import { defineStore } from 'pinia';
import api from "@/config/axios.js";
import {ref} from "vue";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: ref(),
        refreshToken: ref(),
    }),
    actions: {
        // 로그인 후 토큰 저장
        setTokens( newAccessToken, newRefreshToken ) {
            this.accessToken = newAccessToken;
            this.refreshToken = newRefreshToken;
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
        },
    },
});
