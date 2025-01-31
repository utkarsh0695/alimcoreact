import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const useLogout = () => {
  const navigate = useNavigate();
  const logoutAction = (msg) => {
    localStorage.clear();
    toast.error(msg);
    navigate("/login");
  };

  return logoutAction;
};

export default useLogout;
