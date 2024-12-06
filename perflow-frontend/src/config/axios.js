import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Axios 기본 설정
const api = axios.create({
    baseURL: '/api/v1',
    timeout: 5000,
});

// 요청 인터셉터: Access Token 자동 추가
api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers['Authorization'] = `${authStore.accessToken}`;
    }
    return config;
});

// 응답 인터셉터: Access Token 만료 처리
api.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환
    async (error) => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // 401 Unauthorized + 첫 시도인 경우
            originalRequest._retry = true;

            try {
                const newToken = await authStore.refreshToken();
                originalRequest.headers['Authorization'] = `${newToken}`;
                return api(originalRequest); // 원래 요청 재시도
            } catch (refreshError) {
                return Promise.reject(refreshError); // 갱신 실패 시 오류 반환
            }
        }

        return Promise.reject(error); // 다른 오류는 그대로 반환
    }
);

export default api;
