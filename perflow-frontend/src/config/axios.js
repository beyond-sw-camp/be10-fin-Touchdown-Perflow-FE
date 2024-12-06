import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Axios 기본 설정
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

// 요청 인터셉터: Access Token 자동 추가
api.interceptors.request.use((config) => {

    console.log(`request interceptor 시작!`)
    const authStore = useAuthStore();

    if(config.url.includes('hr/employees/reissue')){
        if(authStore.refreshToken){
            config.headers['Authorization'] = `${authStore.refreshToken}`;
        }
    } else {
        if(authStore.accessToken){
            config.headers['Authorization'] = `${authStore.accessToken}`;
        }
    }

    return config;
});

// 응답 인터셉터: Access Token 만료 처리
api.interceptors.response.use(
    (response) => {
        return response
    }, // 성공 응답은 그대로 반환
    async (error) => {

        console.log(`response interceptor 시작!`)

        const authStore = useAuthStore();
        const originalRequest = error.config;

        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                const newToken = await authStore.refreshAccessToken();
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
