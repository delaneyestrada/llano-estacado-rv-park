import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const config = {
  apiKey: "***REMOVED***",
  authDomain: "llano-estacado-rv-park.firebaseapp.com",
  projectId: "llano-estacado-rv-park",
  storageBucket: "llano-estacado-rv-park.appspot.com",
  messagingSenderId: "967435769392",
  appId: "1:967435769392:web:ea0d2e6dcdfce13c93bff5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const authProviders = {
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
};
// utils
const db = firebase.firestore();
const auth = firebase.auth();
const fb = firebase;

// collection references
const usersCollection = db.collection("users");

// export utils/refs
export { db, auth, fb, usersCollection };
