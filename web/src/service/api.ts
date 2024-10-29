import axios from "axios";

const MDL_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: MDL_URL || "https://localhost:5001",
});

export { api };
