import { initializeApp } from "firebase/app"

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

export { app as firebaseApp }
