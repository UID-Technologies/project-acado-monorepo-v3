// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDrYracOsRLk2WiaV98sT8AZhPWbVXmvHI",
    authDomain: "acado-ee897.firebaseapp.com",
    projectId: "acado-ee897",
    storageBucket: "acado-ee897.firebasestorage.app",
    messagingSenderId: "984348085482",
    appId: "1:984348085482:web:3f5b8e0822fa42764a9b93",
    measurementId: "G-1GYH9BBRB2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
