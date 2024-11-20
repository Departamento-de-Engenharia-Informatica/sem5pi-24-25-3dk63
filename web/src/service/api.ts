import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "https://lapr5.sytes.net:5001") +
  "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50 * 1 * 1000, //50s
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<unknown>) => {
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      errorMessage =
        (error.response.data as { message?: string })?.message ??
        `Error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "No response received from server";
    } else {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    (enhancedError as Error & { cause: unknown }).cause = error;
    return Promise.reject(enhancedError);
  }
);

export { api };
