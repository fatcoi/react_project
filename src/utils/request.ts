import axios from "axios";

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
})

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers!['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        if (err.response) {
            if (err.response.status === 401) {
                console.log('Unauthorized, redirecting to login...');
            }
            else if (err.response.status === 400) {
                console.log('Bad Request:', err.response.data);
            }
            else if (err.response.status === 403) {
                console.log('Forbidden:', err.response.data);
            }
            else if (err.response.status === 404) {
                console.log('Not Found:', err.response.data);
            }
            else if (err.response.status === 500) {
                console.log('Internal Server Error:', err.response.data);
            }
            else if (err.response.status === 409) {
                console.log('Conflict:', err.response.data);
            }
        }
        else if (err.request) {
            console.log('No response received:', err.request);
        }
        else {
            console.log('Error setting up request:', err.message);
        }
        return Promise.reject(err);
    }
)

export default request;