// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import  {getAuth} from "firebase/auth" ;
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyHPkXUFlEd7cYOIKnY_Gz8UUNHMsJRW4",
  authDomain: "public-center-website.firebaseapp.com",
  projectId: "public-center-website",
  storageBucket: "public-center-website.firebasestorage.app",
  messagingSenderId: "124905533171",
  appId: "1:124905533171:web:0efa3647bdca061ebdd186",
  measurementId: "G-0M5175P6K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db =getFirestore(app);

export {app,auth,db};