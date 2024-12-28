// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPH4zrOG0fREdjh-U8hIDLc_tITHAWerk",
  authDomain: "photofolio-app-feac3.firebaseapp.com",
  projectId: "photofolio-app-feac3",
  storageBucket: "photofolio-app-feac3.firebasestorage.app",
  messagingSenderId: "304748534005",
  appId: "1:304748534005:web:3135ed3ff3f917be064dbc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);