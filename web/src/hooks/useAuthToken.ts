import { localStorageConfig } from "@/config/localStorageConfig";

export const useAuthToken = () => {
  const token = localStorage.getItem(localStorageConfig.token);
  return { token };
};
