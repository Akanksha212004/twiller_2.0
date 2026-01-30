import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBr73m-f65ZwYBSjUETSrVyayg7EcYC9l8",
  authDomain: "twiller-59e95.firebaseapp.com",
  projectId: "twiller-59e95",
  storageBucket: "twiller-59e95.firebasestorage.app",
  messagingSenderId: "127399254790",
  appId: "1:127399254790:web:61f1d9e533308c5f87dc87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app