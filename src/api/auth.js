import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";

//  login
export const loginAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}login`, data, config);
};
export const deleteAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-account`, data, config);
};
//  logout
export const logoutAPI = async (data, config) => {
    return await axios.post(`${LOCAL_BASE_URL}logout`, data, config);
  };

  //!Validate TOKEN
export const validateTokenAPI =async (data,config) =>{
  return await axios.post(`${LOCAL_BASE_URL}validate-token`,data,config)
}
