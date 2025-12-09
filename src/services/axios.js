import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  // withCredentials: true, // cho phép axios gửi và nhận cookie
});

apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
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
      (error.response.status === 401 || error.response.status === 403)
      // !error.config?.url?.startsWith("/account/")
    ) {
      // Lưu URL hiện tại để redirect sau khi đăng nhập lại
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.assign("/login");
    } else if (error.response) {
      console.error("API error:", error.response.data);
      toast.error(error.response?.data?.detail);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
