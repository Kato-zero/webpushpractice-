importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCxYjffm9bKBNZ0x-4Us0F_ERIgbp9LqrI",
    authDomain: "push-demo-10d34.firebaseapp.com",
    projectId: "push-demo-10d34",
    storageBucket: "push-demo-10d34.firebasestorage.app",
    messagingSenderId: "489596640686",
    appId: "1:489596640686:web:fb29b72efbc98b7a183c3f",
    measurementId: "G-W520J262H7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
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
