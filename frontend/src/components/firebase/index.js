import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, TwitterAuthProvider, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvF4sctKkdQFSkkvvDyLKENJMFlaWCWQU",
  authDomain: "coe-project-24d1c.firebaseapp.com",
  databaseURL: "https://coe-project-24d1c-default-rtdb.firebaseio.com",
  projectId: "coe-project-24d1c",
  storageBucket: "coe-project-24d1c.appspot.com",
  messagingSenderId: "244172124947",
  appId: "1:244172124947:web:7b21248ef1d4b1d5f060e6",
  measurementId: "G-KGC9E9TWWH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { auth, facebookProvider, twitterProvider, googleProvider };