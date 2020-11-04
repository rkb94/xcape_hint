import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB30tl9b5jdPzsyNOQMxCai5meLFzFk3t0",
    authDomain: "xcapehint.firebaseapp.com",
    databaseURL: "https://xcapehint.firebaseio.com",
    projectId: "xcapehint",
    storageBucket: "xcapehint.appspot.com",
    messagingSenderId: "258457372086",
    appId: "1:258457372086:web:6be5e8821a491307492d17",
    measurementId: "G-6RVW2SLN32"
};

const firebseApp = firebase.initializeApp(firebaseConfig);
const database = firebseApp.firestore(); // real-time sort of ...

export default database;