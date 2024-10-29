import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import {
  HomeIcon,
  LogoutIcon,
  RequestsIcon,
  TasksIcon,
  UsersIcon,
} from "../styles/Icons";

export const useMenuOptions = () => {
  const { role, logout } = useContext(AuthContext);
  const navigation = useNavigate();

  const menuOptions = useMemo(() => {
    const options = [
      {
        label: "Home",
        icon: HomeIcon,
        onClick: () => navigation("/"),
      },
    ];

    if (role === "admin") {
      options.push({
        label: "Users",
        icon: UsersIcon,
        onClick: () => navigation("/users"),
      });
      options.push({
        label: "Requests",
        icon: RequestsIcon,
        onClick: () => navigation("/requests"),
      });
    }


    if (role === "user") {
      options.push({
        label: "Tasks",
        icon: TasksIcon,
        onClick: () => navigation("/tasks"),
      });
    }

    options.push({
      label: "Logout",
      icon: LogoutIcon,
      onClick: () => {
        logout();
        navigation("/login");
      },
    });

    return options;
  }, [navigation, role, logout]);

  return { menuOptions };
};
