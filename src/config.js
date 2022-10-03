import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  authDomain: "foodingo-39a75.firebaseapp.com",
  projectId: "foodingo-39a75",
  storageBucket: "foodingo-39a75.appspot.com",
  messagingSenderId: "716575640192",
  appId: "1:716575640192:web:12315dcfc418df915f7465",
  measurementId: "G-K2HEFHRM45"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const storage = firebase.storage();
export { auth, storage, firebase};