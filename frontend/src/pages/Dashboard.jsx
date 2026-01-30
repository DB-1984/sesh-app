import Header from "../components/Header";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { userInfo } = useOutletContext();

  return (
    <div>
      <p>{userInfo.email}</p>
    </div>
  );
};

export default Dashboard;
