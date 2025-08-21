import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";
import LoadingScreen from "../components/LoadingScreen";

const PublicRoute = () => {
  const { user, authChecked } = useAuth();

  if (!authChecked) return <LoadingScreen />;

  return !user ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;