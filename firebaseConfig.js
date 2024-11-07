import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBnisuSPIUH6VrIamkrT6WYzodjZrvV8M8",
  authDomain: "mzansibiz-36877.firebaseapp.com",
  projectId: "mzansibiz-36877",
  storageBucket: "mzansibiz-36877.appspot.com",
  messagingSenderId: "884918238308",
  appId: "1:884918238308:web:330c2570bc8f206ee07371"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
