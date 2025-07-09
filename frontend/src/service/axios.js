import axios from 'axios';

function getCookieValue(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getCookieValue('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

export default axiosInstance;
