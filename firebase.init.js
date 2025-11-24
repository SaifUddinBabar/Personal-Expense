import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPZ91R3n7QlBVgYJMnoKUPx-JRxMUG78w",
  authDomain: "expensetracker-30471.firebaseapp.com",
  projectId: "expensetracker-30471",
  storageBucket: "expensetracker-30471.appspot.com",
  messagingSenderId: "599505872933",
  appId: "1:599505872933:web:4a07037401bbbe44a837cc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
