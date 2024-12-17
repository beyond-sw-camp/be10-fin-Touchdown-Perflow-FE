import { defineStore } from 'pinia';
import api from "@/config/axios.js";
import {ref} from "vue";
import router from "@/router/router.js";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: ref(),
        refreshToken: ref(),
        isLogin: ref(false),
        timerInterval: null,
        remainingTime: 0
    }),
    actions: {
        // 로그인 후 토큰 저장
        setTokens( newAccessToken, newRefreshToken ) {
            this.accessToken = newAccessToken;
            this.refreshToken = newRefreshToken;
            this.isLogin = true;
            this.startTimer();
        },
        // 남은 시간 계산 및 실시간 업데이트
        startTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval); // 기존 타이머 초기화
            }

            const decoded = jwtDecode(this.accessToken);
            const expiryTime = decoded.exp * 1000; // 만료 시간 (밀리초)

            // 1초마다 남은 시간 갱신
            this.timerInterval = setInterval(() => {
                const currentTime = Date.now();
                const remaining = Math.max(0, Math.floor((expiryTime - currentTime) / 1000)); // 초 단위 남은 시간

                const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
                const seconds = String(remaining % 60).padStart(2, '0');

                this.remainingTime = minutes+'분 '+seconds+'초';

                if (remaining <= 0) {
                    this.logout(); // 남은 시간이 0이면 로그아웃
                }
            }, 1000);
        },

        // 토큰 갱신
        async refreshAccessToken() {
            try {
                const response = await api.post('hr/employees/reissue',{} , {
                    headers : { refreshToken: this.refreshToken }
                });

                const newAccessToken = response.headers['Authorization'];
                const newRefreshToken = response.headers['refreshToken'];

                this.setTokens({ newAccessToken, newRefreshToken });
                return newAccessToken; // 갱신된 Access Token 반환
            } catch (error) {
                console.error('Failed to refresh token:', error);
                this.logout(); // 갱신 실패 시 로그아웃 처리
                throw error;
            }
        },

        // 로그아웃
        logout() {
            this.accessToken = null;
            this.refreshToken = null;
            this.isLogin = false;
            this.remainingTime = 0;
            clearInterval(this.timerInterval);
            alert("유효기간이 지나 로그아웃 되었습니다.")
            router.push('/login');
        },

    },
    persist:true
});
