import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5050',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 422 && !originalRequest._retry) {
            originalRequest._retry = true;

            const new_token = error.response?.data?.new_token;

            if(!new_token) {
                localStorage.removeItem("jwt_token");
                window.location.href = "/auth";
                return Promise.reject(error);
            }

            localStorage.setItem("jwt_token", new_token);

            originalRequest.headers.Authorization = `Bearer ${new_token}`;

            return apiClient(originalRequest);
        }
    }
);

export default apiClient;
