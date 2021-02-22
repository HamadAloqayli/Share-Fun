import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBSIWvVSXKOmeKF9DUwmLh_xz1wLZSnMog",
    authDomain: "share-fun-e7317.firebaseapp.com",
    projectId: "share-fun-e7317",
    storageBucket: "share-fun-e7317.appspot.com",
    messagingSenderId: "666481015619",
    appId: "1:666481015619:web:62e01f48ff4e5136354df6",
    measurementId: "G-TYBVHD0K6F"
  };

  if(!firebase.apps.length)
        firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export default firebase;