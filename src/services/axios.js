import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  // withCredentials: true, // cho phép axios gửi và nhận cookie
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !error.config?.url?.startsWith("/account/")
    ) {
      isRedirecting = true;
      // Lưu URL hiện tại để redirect sau khi đăng nhập lại
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
