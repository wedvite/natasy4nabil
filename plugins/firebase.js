import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

if (!firebase.apps.length) {
    let config = {
        apiKey: "AIzaSyDDAla8nhnojGOzUnK0Fri1C4KXo2tguKU",
        authDomain: "weddinger-info.firebaseapp.com",
        databaseURL: "https://weddinger-info.firebaseio.com",
        projectId: "weddinger-info",
        storageBucket: "weddinger-info.appspot.com",
        messagingSenderId: "808633359875"
    };
    firebase.initializeApp(config);
    // firebase.firestore().settings({timestampsInSnapshots: true})
}

//initialize firebase firestore
const fireDb = firebase.firestore()

//initialize firebase auth
const auth = firebase.auth();

export { fireDb, auth }

