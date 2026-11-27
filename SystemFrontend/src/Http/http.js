
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Authentication APIs
export const registerUser = (data) =>
    api.post("/api/auth/register", data);

export const loginUser = (data) =>
    api.post("/api/auth/login", data);

export const logoutUser = () =>
    api.post("/api/auth/logout");

// Transformer APIs
export const getAllTransformers = () =>
    api.get("/api/transformer");

export const addTransformer = (data) =>
    api.post("/api/transformer/add", data);

export const getTransformerCondition = (id, data) =>
    api.post(`/api/transformer/${id}/condition`, data);

export const updateTransformer = (id, data) =>
    api.put(`/api/transformer/${id}`, data);

export const deleteTransformer = (id) =>
    api.delete(`/api/transformer/${id}`);

export default api;
