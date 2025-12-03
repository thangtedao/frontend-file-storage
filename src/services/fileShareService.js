import apiClient from "./axios";

export const shareFile = async (fileId, emails) => {
  try {
    const response = await apiClient.post(`/fileshare/${fileId}/share`, emails);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateShareFile = async (fileId, emails) => {
  try {
    const response = await apiClient.patch(
      `/fileshare/${fileId}/share`,
      emails
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeShareFile = async (fileId) => {
  try {
    const response = await apiClient.delete(`/fileshare/${fileId}/share`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFilesShare = async () => {
  try {
    const response = await apiClient.get(`/fileshare`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const shareFilePublicly = async (fileId) => {
  try {
    const response = await apiClient.post(`/fileshare/${fileId}/share-public`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPublicFileInfo = async (token) => {
  try {
    const response = await apiClient.get(`/fileshare/public/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const downloadPublicFile = async (token) => {
  try {
    const response = await apiClient.get(`/fileshare/public/${token}/download`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const removePublicLink = async (id) => {
  try {
    const response = await apiClient.delete(`/fileshare/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
