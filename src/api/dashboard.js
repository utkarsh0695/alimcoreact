import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";

//dashboard
export const dashboardAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}dashboard`, data, config);
};
