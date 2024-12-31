import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css';
import router from './router/router.js'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {useAuthStore} from "@/store/authStore.js";
import {initFCMToken, initForegroundMessageHandler} from "@/views/notification/FcmService.js";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.use(pinia);
app.use(router);

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
                registration.active?.postMessage({
                    type: 'INIT',
                    firebaseConfig: {
                        apiKey: import.meta.env.VITE_FCM_APIKEY,
                        authDomain: import.meta.env.VITE_FCM_AUTHDOMAIN,
                        projectId: import.meta.env.VITE_FCM_PROJECTID,
                        storageBucket: import.meta.env.VITE_FCM_STORAGEBUCKET,
                        messagingSenderId: import.meta.env.VITE_FCM_MESSAGINGSENDERID,
                        appId: import.meta.env.VITE_FCM_APPID
                    }
                });
                console.log('Service Worker 등록 성공:', registration);
            })
            .catch((err) => {
                console.error('Service Worker 등록 실패:', err);
            });
    });
}

// Vue 앱 마운트
app.mount('#app').$nextTick(async () => {
    const authStore = useAuthStore();

    // Pinia 스토어가 초기화된 후에 접근해야 합니다.
    // 사용자 로그인 상태 확인
    if (authStore.isLogin && authStore.empId) {
        // 기기 유형 식별 로직 (예: 브라우저 이름)
        let deviceType = 'OTHER';
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Chrome")) {
            deviceType = "CHROME";
        } else if (userAgent.includes("Firefox")) {
            deviceType = "FIREFOX";
        } else if (userAgent.includes("Safari")) {
            deviceType = "SAFARI";
        }

        // FCM 토큰 초기화 및 등록
        await initFCMToken(authStore.empId, deviceType);
    }

    // 포그라운드 메시지 핸들러 초기화
    initForegroundMessageHandler();
});
