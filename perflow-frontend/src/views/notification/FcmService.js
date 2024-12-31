// src/FcmService.js
import axios from 'axios';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, VAPID_KEY } from './firebase';
import api from "@/config/axios.js";

/**
 * FCM 토큰을 초기화하고 서버에 등록하는 함수
 * @param {String} empId - 사용자(Employee) ID
 * @param {String} deviceType - 기기 유형 (예: 'CHROME', 'FIREFOX', 'SAFARI')
 */
export async function initFCMToken(empId, deviceType) {
    // 1) 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        console.warn('알림 권한이 허용되지 않았습니다.');
        return null;
    }

    // 2) FCM 토큰 가져오기
    let currentToken = null;
    try {
        currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
            console.log('FCM Token:', currentToken);
            // 3) 백엔드에 토큰 등록
            await registerTokenToBackend(empId, currentToken, deviceType);
        } else {
            console.warn('FCM 토큰을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('FCM 토큰 발급 실패:', error);
        return null;
    }

    // 4) 주기적으로 토큰 확인 (예: 1시간마다)
    setInterval(async () => {
        try {
            const newToken = await getToken(messaging, { vapidKey: VAPID_KEY });
            if (newToken && newToken !== currentToken) {
                console.log('FCM Token 갱신:', newToken);
                await registerTokenToBackend(empId, newToken, deviceType);
                currentToken = newToken;
            }
        } catch (error) {
            console.error('주기적 토큰 확인 실패:', error);
        }
    }, 60 * 60 * 1000); // 1시간
}

/**
 * 백엔드에 FCM 토큰을 등록하는 함수
 * @param {String} empId - 사용자 ID
 * @param {String} token - FCM 토큰
 * @param {String} deviceType - 기기 유형
 */
async function registerTokenToBackend(empId, token, deviceType) {
    try {
        await api.post('/fcm/token', {
            empId: empId,
            token: token,
            deviceType: deviceType
        });
        console.log('토큰이 서버에 정상적으로 등록되었습니다.');
    } catch (error) {
        console.error('서버로 토큰 전송 실패:', error);
    }
}

/**
 * 백엔드에서 FCM 토큰을 삭제하는 함수
 * @param {String} token - 삭제할 FCM 토큰
 */
export async function deleteTokenFromBackend(token) {
    try {
        await api.delete('/fcm/token', {
            data: {
                token: token
            }
        });
        console.log('토큰이 서버에서 삭제되었습니다.');
    } catch (error) {
        console.error('서버에서 토큰 삭제 실패:', error);
    }
}

/**
 * 포그라운드 메시지 수신 핸들러
 */
export function initForegroundMessageHandler() {
    onMessage(messaging, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);
        if (payload?.notification) {
            const { title, body } = payload.notification;
            new Notification(title, { body });
        }
    });
}
