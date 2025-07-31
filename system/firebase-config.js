// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc,
    updateDoc // CORRECTED: Added updateDoc to the import list
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJyphralzLyOg992QzPDRE_JyNQEC6T6Q",
  authDomain: "lifewood-system.firebaseapp.com",
  projectId: "lifewood-system",
  storageBucket: "lifewood-system.appspot.com",
  messagingSenderId: "914180528399",
  appId: "1:914180528399:web:15d822b24a5386b394067a",
  measurementId: "G-BTRKH7DK16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export all the necessary functions and the database instance
export { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc,
    updateDoc // CORRECTED: Added updateDoc to the export list
};