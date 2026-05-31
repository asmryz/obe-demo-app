import axios from "axios";

const getBaseURL = () => {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:5001/api`;
};

export const api = axios.create({
    baseURL: getBaseURL()
});