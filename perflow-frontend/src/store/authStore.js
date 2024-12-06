import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        refreshToken: null,
    }),
    actions: {
        // 로그인 후 토큰 저장
        setTokens({ accessToken, refreshToken }) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        },

        // 토큰 갱신
        async refreshAccessToken() {
            try {
                const response = await axios.post('/employee/reissue', {
                    headers : { refreshToken: this.refreshToken }
                });

                const newAccessToken = response.headers.get(`Authorization`)
                const newRefreshToken = response.headers.get(`refreshToken`);

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
            delete axios.defaults.headers.common['Authorization'];
        },
    },
});
