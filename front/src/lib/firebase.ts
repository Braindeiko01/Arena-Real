
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLfKTmumxXru-AtAqnC8_gCrbzyJSTLRM",
  authDomain: "royaleduel.firebaseapp.com",
  projectId: "royaleduel",
  storageBucket: "royaleduel.firebasestorage.app",
  messagingSenderId: "8233856510",
  appId: "1:8233856510:web:9503cc0d46d34a74e064af"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
