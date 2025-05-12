import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5021", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiService = {
  get: (url, config = {}) => api.get(url, config),

  post: (url, data, config = {}) => api.post(url, data, config),

  put: (url, data, config = {}) => api.put(url, data, config),

  delete: (url, config = {}) => api.delete(url, config),
};

export default apiService;