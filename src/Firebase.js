import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_API_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

  if(!firebase.apps.length)
        firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// offline data
firestore.enablePersistence()
.then(res => {
  console.log(res);
})
.catch(err => {
  if(err.code === 'failed-precondition')
  {
    console.log('multiple tabs open at once');
  }
  else if(err.code === 'unimplemented')
  {
    console.log('lack of browser support');
  }
});

export default firebase;