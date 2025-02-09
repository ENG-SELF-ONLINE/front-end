import axios from 'axios';
import refreshTokenFn from './refreshTokenFn';

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        async config => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const expiryTime = localStorage.getItem('expiryTime');
                if (expiryTime && Date.now() >= expiryTime) {
                    const tokenData = await refreshTokenFn();

                    if (tokenData) {
                        localStorage.setItem('accessToken', tokenData.accessToken);
                        localStorage.setItem('refreshToken', tokenData.refreshToken)
                        const newConfig = {
                            ...config,
                            headers: {
                                ...config.headers,
                                'Authorization': `Bearer ${tokenData.accessToken}`
                            }
                        }
                        return newConfig
                    } else {
                        console.error("Token refresh failed")
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = "/"
                        return config
                    }
                }
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Prevent infinite loops

                const tokenData = await refreshTokenFn()

                if (tokenData) {
                    originalRequest.headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
                    return axios(originalRequest);
                } else {
                    window.location.href = "/"
                }
            }

            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;