// attachToken.js
import api from "./api";
import { getAccessToken } from "./tokenService";

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
