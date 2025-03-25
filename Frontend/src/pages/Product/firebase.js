import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrYx-w6bnOsOz3pNyqOPESjWp44f8r6es",
  authDomain: "uploadimage-5a6c2.firebaseapp.com",
  projectId: "uploadimage-5a6c2",
  storageBucket: "uploadimage-5a6c2.appspot.com",
  messagingSenderId: "404609307580",
  appId: "1:404609307580:web:bc5372febe2f41789d11b9",
};


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };