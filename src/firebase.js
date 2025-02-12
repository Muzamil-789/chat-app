import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBPGq0LASVwodsvdauJtI2eCV9u_s88rNg",
  authDomain: "realtime-chat-app-edf13.firebaseapp.com",
  projectId: "realtime-chat-app-edf13",
  storageBucket: "realtime-chat-app-edf13.firebasestorage.app",
  messagingSenderId: "937944710501",
  appId: "1:937944710501:web:fcc862f547ecaff67d758c",
  databaseURL: "https://realtime-chat-app-edf13-default-rtdb.firebaseio.com/",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
