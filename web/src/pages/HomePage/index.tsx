import { useContext } from "react";
import { redirect } from "react-router-dom";

import SideBar from "../../components/SideBar";
import AuthContext from "../../context/AuthContext";
import { useMenuOptions } from "../../hooks/useMenuOptions";
import CampusHome from "../CampusHome";
import FleetHome from "../FleetHome";
import TaskHome from "../TaskHome";
import UserHome from "../UserHome";

const HomePage: React.FC = () => {
  const { menuOptions } = useMenuOptions();
  const { role } = useContext(AuthContext);
  if (!role) redirect("/login");

  return (
    <div className="flex">
      {role === "campus" && <CampusHome />}
      {role === "fleet" && <FleetHome />}
      {role === "user" && <UserHome />}
      {role === "task" && <TaskHome />}
    </div>
  );
};

export default HomePage;
