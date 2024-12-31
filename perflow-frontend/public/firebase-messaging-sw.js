importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT') {
        const firebaseConfig = event.data.firebaseConfig;
        firebase.initializeApp(firebaseConfig);

        const messaging = firebase.messaging();
        messaging.onBackgroundMessage((payload) => {
            console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신:', payload);

            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: payload.notification.icon
            };

            self.registration.showNotification(notificationTitle, notificationOptions);
        });
    }
});
