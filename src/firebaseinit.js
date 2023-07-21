// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnhVSFL9UsjsduQgQ_QeCwEQ1Atp_sOlY",
  authDomain: "expensetracker-d3069.firebaseapp.com",
  projectId: "expensetracker-d3069",
  storageBucket: "expensetracker-d3069.appspot.com",
  messagingSenderId: "870020256600",
  appId: "1:870020256600:web:9b9014c63aedfa7b164b2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);