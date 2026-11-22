importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCxYjffm9bKBNZ0x-4Us0F_ERIgbp9LqrI',
  authDomain: 'push-demo-10d34.firebaseapp.com',
  projectId: 'push-demo-10d34',
  storageBucket: 'push-demo-10d34.firebasestorage.app',
  messagingSenderId: '489596640686',
  appId: '1:489596640686:web:fb29b72efbc98b7a183c3f'
});

const messaging = firebase.messaging();

// Opens the chat when the user clicks a notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://kato-zero.github.io/webpushpractice-/'));
});
