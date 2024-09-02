import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyA4zW9UEpFCQgcJSHyT-NTFurRynaUX-HI",
  authDomain: "system-300.firebaseapp.com",
  projectId: "system-300",
  storageBucket: "system-300.appspot.com",
  messagingSenderId: "974773170556",
  appId: "1:974773170556:web:14824da31ca343eab674f9",
  measurementId: "G-0T4W3WKREQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);




export { auth,db };