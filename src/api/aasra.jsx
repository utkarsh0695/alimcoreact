import axios from "axios";
import { LOCAL_BASE_URL} from "../Constant/MyConstants";

//  login
export const getOrderListAPI = async (data, config) => {

  return await axios.post(`${LOCAL_BASE_URL}order-list`, data, config);
};
//  login
export const repairProductAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}repair`, data, config);

};