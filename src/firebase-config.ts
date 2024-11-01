import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:ba0d30c24d919b1ab5b0ba",
  measurementId: "***REMOVED***"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export { app as firebaseApp }
