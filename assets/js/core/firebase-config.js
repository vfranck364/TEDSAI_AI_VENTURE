// FIREBASE CONFIGURATION (COMPATIBILITY MODE)
// Works with file:// protocol and without closures

// 1. Keys (Preserved from User)
const firebaseConfig = {
    apiKey: "AIzaSyB005ML4Ir-E8WWstZQ4L9efycg7zsB8Nw",
    authDomain: "tedsai-complex.firebaseapp.com",
    projectId: "tedsai-complex",
    storageBucket: "tedsai-complex.firebasestorage.app",
    messagingSenderId: "481412810894",
    appId: "1:481412810894:web:1132aa94212d1c579e61df"
};
// Expose for secondary app usage (User Management)
window.tedFirebaseConfig = firebaseConfig;

// 2. Check if Firebase is loaded (Compat scripts in HTML)


if (typeof firebase !== 'undefined') {
    // Initialize
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Get Instances
    const app = firebase.app();
    const db = firebase.firestore();
    const auth = firebase.auth();

    // Export for App (Simplified structure for Compat)
    window.tedFirebase = {
        app,
        db,
        auth,
        loaded: true
    };

    console.log("🔥 Firebase Initialized (Compat Mode)");
} else {
    console.error("❌ Firebase SDK not loaded. Check script tags in HTML.");
    window.tedFirebase = null;
}
