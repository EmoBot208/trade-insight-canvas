
import axios from "axios";
import { Upload, Metric, UserPreferences } from "../types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadAPI = {
  getAll: async (page = 1, limit = 10): Promise<{ data: Upload[], total: number }> => {
    const response = await api.get(`/uploads/?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string): Promise<Upload> => {
    const response = await api.get(`/uploads/${id}/`);
    return response.data;
  },

  create: async (formData: FormData, onProgress?: (progress: number) => void): Promise<Upload> => {
    const response = await api.post("/uploads/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/uploads/${id}/`);
  },
};

export const metricsAPI = {
  getByUploadId: async (uploadId: string): Promise<Metric[]> => {
    const response = await api.get(`/metrics/?uploadId=${uploadId}`);
    return response.data;
  },
  
  getSymbols: async (uploadId: string): Promise<string[]> => {
    const response = await api.get(`/metrics/symbols/?uploadId=${uploadId}`);
    return response.data;
  },
};

export const preferencesAPI = {
  get: async (): Promise<UserPreferences> => {
    const response = await api.get("/preferences/");
    return response.data;
  },

  save: async (preferences: UserPreferences): Promise<UserPreferences> => {
    if (preferences.id) {
      const response = await api.put(`/preferences/${preferences.id}/`, preferences);
      return response.data;
    } else {
      const response = await api.post("/preferences/", preferences);
      return response.data;
    }
  },
};

export default api;
