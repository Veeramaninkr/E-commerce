import axios from "axios";

// Dynamically determine the API base URL to match the current hostname.
// This prevents cross-site cookie issues between localhost and 127.0.0.1.
const getBaseURL = () => {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname === "127.0.0.1") {
            return "http://127.0.0.1:8000";
        }
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

export default api;