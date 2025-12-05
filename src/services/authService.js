import apiClient from "./axios";

export const isAuthenticated = () => {
  return document.cookie.includes("JWT_TOKEN=");
};

export const register = async (data) => {
  try {
    await apiClient.post("/account/register", data);
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/account/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.get("/account/logout");
  } catch (error) {
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await apiClient.get("/account/current-user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await apiClient.get(`/account/check-email/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
