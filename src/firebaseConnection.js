import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyByWlPdABa9jBgrbUu1CFaThKMljyeeEgU",
    authDomain: "curso-e0984.firebaseapp.com",
    projectId: "curso-e0984",
    storageBucket: "curso-e0984.appspot.com",
    messagingSenderId: "935888231830",
    appId: "1:935888231830:web:72c6ff47c0a2637e8e51b7",
    measurementId: "G-4BKW6V8LK9"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };