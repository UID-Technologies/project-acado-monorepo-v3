// firebase.js (Compat version setup)
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import envConfig from '@app/config/env.config';

const firebaseConfig = {
  apiKey: envConfig.firebase.apiKey,
  authDomain: envConfig.firebase.authDomain,
  projectId: envConfig.firebase.projectId,
  storageBucket: envConfig.firebase.storageBucket,
  messagingSenderId: envConfig.firebase.messagingSenderId,
  appId: envConfig.firebase.appId,
  measurementId: envConfig.firebase.measurementId,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export { firebaseApp, messaging };
