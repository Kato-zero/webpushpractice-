importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
});

const messaging = firebase.messaging();

// When a notification arrives and no tab is open, FCM shows it automatically
// if the message includes a "notification" block. This handler is optional.
messaging.onBackgroundMessage(payload => {
  console.log('Background message:', payload);
});

// Open the link from the message when the user clicks the notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.FCM_MSG?.fcmOptions?.link || './';
  event.waitUntil(clients.openWindow(url));
});
