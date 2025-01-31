import axios from "axios";
import { LOCAL_BASE_URL, LOCAL_BASE_URL1 } from "../Constant/MyConstants";

//stateList
export const stateListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}state-list`, data, config);
};
//districtList
export const districtListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}district-list`, data, config);
};
// aasra-based on district List
export const districtBasedAasraAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasraList-callCenter`, data, config);
};
//aasraList
export const aasraListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasra-dd-list`, data, config);
};

//userType
export const userTypeAPI = async (data,config) =>{
  return await axios.post(`${LOCAL_BASE_URL}role-list`,data, config);
}
//aasraType
export const aasraTypeAPI = async (data,config) =>{
  return await axios.post(`${LOCAL_BASE_URL}aasra-type`,data, config);
}

//product-list for create-purchase
export const productListAPI = async(data,config)=>{
  return await axios.post(`${LOCAL_BASE_URL}product-list`,data,config)
}
export const RTUproductListAPI = async(data,config)=>{
  return await axios.post(`${LOCAL_BASE_URL}produuct-rtu-list`,data,config)
}
//product-list for create-purchase
export const categoryWiseProductListAPI = async(data,config)=>{
  return await axios.post(`${LOCAL_BASE_URL}category-product-list`,data,config)
}
//product-list for create-purchase
export const productWiseRepairListAPI = async(data,config)=>{
  return await axios.post(`${LOCAL_BASE_URL}product-repair-list`,data,config)
}

//Service Note
export const serviceNoteListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}generate-service-note`, data, config);
};