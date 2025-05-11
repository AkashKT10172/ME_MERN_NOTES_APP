import axios from "axios";

// Add auth token to requests
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const API_URL = "https://me-mern-notes-app.onrender.com/api/notes";

export const getNotes = (search = "") => {
  const params = search ? { search } : {};
  return axios.get(API_URL, { params });
};

export const createNote = (noteData) => {
  return axios.post(API_URL, noteData);
};

export const updateNote = (id, updatedData) => {
  return axios.put(`${API_URL}/${id}`, updatedData);
};

export const deleteNote = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const togglePinNote = async (noteId) => {
  const response = await axios.put(`${API_URL}/${noteId}/pin`);
  return response.data; // The updated note object
};

