import { useEffect, useState } from "react";
import { useInjection } from "inversify-react";

import { TYPES } from "@/inversify/types";
import { Session } from "@/model/Session";
import { HttpService } from "@/service/IService/HttpService";

import { localStorageConfig } from "../config/localStorageConfig";
import { api } from "../service/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem(localStorageConfig.token) ? true : false
  );
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const http = useInjection<HttpService>(TYPES.api);

  useEffect(() => {
    async function getSession(token: string) {
      const res = await http.get<Session>("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setIsAuthenticated(true);
        setRole(res.data.role);
        setUsername(`${res.data.firstName} ${res.data.lastName}`);
        setId(res.data.id);
        setPhoneNumber(res.data.phoneNumber);
        return;
      }

      setIsAuthenticated(false);
      setRole(null);
      setUsername(null);
      localStorage.removeItem(localStorageConfig.token);
    }

    const token = localStorage.getItem(localStorageConfig.token);
    if (!token) return;

    getSession(token);
  }, [http]);

  const login = async (email: string, password: string) => {
    const res = await api("/users/login", {
      method: "POST",
      data: {
        email,
        password,
      },
    });

    if (res.status === 200) {
      setIsAuthenticated(true);
      setRole(res.data.userDTO.role);
      setUsername(`${res.data.userDTO.firstName} ${res.data.userDTO.lastName}`);
      localStorage.setItem(localStorageConfig.token, res.data.token);
      return Promise.resolve();
    } else {
      return Promise.reject(res.data.message);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await api("/users/google-login", {
      method: "POST",
      data: {
        credential,
      },
    });

    if (res.status === 200) {
      setIsAuthenticated(true);
      setRole(res.data.userDTO.role);
      setUsername(`${res.data.userDTO.firstName} ${res.data.userDTO.lastName}`);
      localStorage.setItem(localStorageConfig.token, res.data.token);
      return Promise.resolve();
    } else {
      return Promise.reject(res.data.message);
    }
  };

  const logout = () => {
    return new Promise<void>((res) => {
      setIsAuthenticated(false);
      setRole(null);
      localStorage.removeItem(localStorageConfig.token);
      res();
    });
  };

  return {
    isAuthenticated,
    login,
    loginWithGoogle,
    role,
    username,
    logout,
    id,
    phoneNumber,
  };
}
