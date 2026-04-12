import axios from "axios";

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || `http://${host}:5001`
});