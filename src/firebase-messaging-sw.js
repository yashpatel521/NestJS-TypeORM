importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js");

self.addEventListener("notificationclick", function (event) {
  const data = event.notification.data.FCM_MSG.data;
  const url = data.url;
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const element of windowClients) {
        const client = element;
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseApp = firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
});

const messaging = firebaseApp.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.image,
  // };
  // self.registration.showNotification(notificationTitle, notificationOptions);
});
