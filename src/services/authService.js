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
    await apiClient.post("/account/login", { username, password });
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
    console.log(response);

    return response.data;
  } catch (error) {
    throw error;
  }
};
