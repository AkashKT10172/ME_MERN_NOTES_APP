import axios from "axios";

const API_URL = "https://me-mern-notes-app.onrender.com/api/auth";

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};
