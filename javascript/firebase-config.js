import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBmk6AZqePU9rhfGx6udF-_kcpZB6KDWX8",
    authDomain: "tuyen-sinh-c3fe5.firebaseapp.com",
    projectId: "tuyen-sinh-c3fe5",
    storageBucket: "tuyen-sinh-c3fe5.firebasestorage.app",
    messagingSenderId: "500441087989",
    appId: "1:500441087989:web:449a269648e229c1b72abc",
    measurementId: "G-ZJZWQBKEWZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };