import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// User provided config (2026-02-20)
// Ideally move these to process.env in production
const firebaseConfig = {
    apiKey: "AIzaSyDkPrFAPkIdS0SWzzc54dx1ZYs3Gkuejms",
    authDomain: "lexfix-ddf5c.firebaseapp.com",
    projectId: "lexfix-ddf5c",
    storageBucket: "lexfix-ddf5c.firebasestorage.app",
    messagingSenderId: "865624418462",
    appId: "1:865624418462:web:793bab781c3d887109738f"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
