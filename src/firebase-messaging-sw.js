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
// const firebaseApp = firebase.initializeApp({
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: "",
// });
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBW-KNGRH6qRmghU3bN62V2GM-yiz42hhY",
  authDomain: "trans-name-252111.firebaseapp.com",
  projectId: "trans-name-252111",
  storageBucket: "trans-name-252111.appspot.com",
  messagingSenderId: "210626357606",
  appId: "1:210626357606:web:857651622094799aa640a7",
  measurementId: "G-NTK8B6EWXW"
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
