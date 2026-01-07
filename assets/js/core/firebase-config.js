// FIREBASE CONFIGURATION (COMPATIBILITY MODE)
// Works with file:// protocol and without closures

// 1. Keys (Preserved from User)
const firebaseConfig = {
    apiKey: "AIzaSyDFtVRpZiELmWbxLcwaUX53vEXh3x4wPyw",
    authDomain: "tedsai-prod-dd55f.firebaseapp.com",
    projectId: "tedsai-prod-dd55f",
    storageBucket: "tedsai-prod-dd55f.firebasestorage.app",
    messagingSenderId: "889607754188",
    appId: "1:889607754188:web:b06be52e987883a06c4d69",
    measurementId: "G-0WM9ETBKV5"
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
