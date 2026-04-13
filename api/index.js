import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

// const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
// const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';

// export const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || `${protocol}://${host}:5001`
// });