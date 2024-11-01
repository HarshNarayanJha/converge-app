// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCve8SQF99uHkhT2JDaRbR7MYUcFWGBMWc",
  authDomain: "converge-543d6.firebaseapp.com",
  projectId: "converge-543d6",
  storageBucket: "converge-543d6.firebasestorage.app",
  messagingSenderId: "604544711631",
  appId: "1:604544711631:web:ba0d30c24d919b1ab5b0ba",
  measurementId: "G-CP68R08VZZ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getFirestore(app)

export { app as firebaseApp, analytics, db }
