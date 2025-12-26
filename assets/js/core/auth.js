/**
 * TEDSAI AUTH CORE (Firebase Integration - Compat Mode)
 */

const TedAuth = {
    // --- LOGIN ---
    async login(email, password) {
        console.log(`🔐 TedAuth: Attempting login for ${email}`);

        if (!window.tedFirebase || !window.tedFirebase.loaded) {
            return { success: false, message: "Erreur Système: Firebase non chargé (Compat)" };
        }

        const { auth, db } = window.tedFirebase; // Instances from compat SDK

        try {
            // 1. Firebase Auth Login (Compat Syntax)
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. Fetch User Role from Firestore
            let userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || email.split('@')[0],
                role: 'visitor'
            };

            try {
                // Compat syntax: db.collection().doc().get()
                const userDoc = await db.collection("users").doc(user.uid).get();

                if (userDoc.exists) {
                    const extraData = userDoc.data();
                    userData = { ...userData, ...extraData };
                } else {
                    // Fallback & Auto-Promote Main User
                    if (email.includes('admin') || email === 'tedsai1385@gmail.com') {
                        userData.role = 'super_admin';
                        // Auto-save to Firestore so next time it's clean
                        db.collection("users").doc(user.uid).set(userData, { merge: true })
                            .then(() => console.log("👑 User promoted to Super Admin in DB"));
                    }
                }
            } catch (err) {
                console.warn("Could not fetch user role", err);
            }

            // 3. Create Session
            this.setSession(userData);
            return { success: true, user: userData };

        } catch (error) {
            console.error("Login Error:", error);
            let msg = "Erreur de connexion";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') msg = "Identifants incorrects";
            if (error.code === 'auth/user-not-found') msg = "Utilisateur inconnu";

            return { success: false, message: msg };
        }
    },

    // --- LOGOUT ---
    async logout() {
        if (window.tedFirebase && window.tedFirebase.auth) {
            await window.tedFirebase.auth.signOut();
        }
        sessionStorage.removeItem('ted_session');
        window.location.href = 'login.html';
    },

    // --- SESSION ---
    setSession(user) {
        sessionStorage.setItem('ted_session', JSON.stringify(user));
    },

    getCurrentUser() {
        const session = sessionStorage.getItem('ted_session');
        return session ? JSON.parse(session) : null;
    },

    requireAuth() {
        const user = this.getCurrentUser();
        if (!user && window.location.pathname.includes('/admin/')) {
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
            return null;
        }
        return user;
    },

    initListener() {
        if (window.tedFirebase && window.tedFirebase.auth) {
            // Compat syntax: auth.onAuthStateChanged(...)
            window.tedFirebase.auth.onAuthStateChanged((user) => {
                if (user) {
                    // console.log("Auth State: Logged In", user.email);
                }
            });
        }
    }
};

window.TedAuth = TedAuth;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => TedAuth.initListener(), 800);
});
