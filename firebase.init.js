// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPZ91R3n7QlBVgYJMnoKUPx-JRxMUG78w",
  authDomain: "expensetracker-30471.firebaseapp.com",
  projectId: "expensetracker-30471",
  storageBucket: "expensetracker-30471.firebasestorage.app",
  messagingSenderId: "599505872933",
  appId: "1:599505872933:web:4a07037401bbbe44a837cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
