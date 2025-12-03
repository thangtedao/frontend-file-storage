import apiClient from "./axios";

export const getFiles = async () => {
  try {
    const response = await apiClient.get("/file");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveFiles = async () => {
  try {
    await pause(500);
    return null;
    const response = await apiClient.get("/file/active");
  } catch (error) {
    throw error;
  }
};

export const getDeletedFiles = async () => {
  try {
    return null;
    const response = await apiClient.get("/file/deleted");
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (data) => {
  try {
    const response = await apiClient.post("/file/upload", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadFile = async (id) => {
  try {
    const response = await apiClient.get(`/file/download/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (id) => {
  try {
    return null;
    const response = await apiClient.patch(`/file/${id}/delete`);
  } catch (error) {
    throw error;
  }
};

export const permanentDeleteFile = async (id) => {
  try {
    return null;
    const response = await apiClient.delete(`/file/${id}`);
  } catch (error) {
    throw error;
  }
};

export const restoreFile = async (id) => {
  try {
    return null;
    const response = await apiClient.patch(`/file/${id}/restore`);
  } catch (error) {
    throw error;
  }
};

export const emptyTrash = async () => {
  try {
    return null;
    const response = await apiClient.delete(`/file`);
  } catch (error) {
    throw error;
  }
};

export const searchFiles = async (term) => {
  try {
    const response = await apiClient.get(`/file?search=${term}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DEV ONLY !!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
