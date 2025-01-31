import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";

//Ticket List API
export const CategorywiseRTOListAPI = async (data, config) => {
    return await axios.post(`${LOCAL_BASE_URL}category-rto-product-list`, data, config);
  };
  
  export const CreateSalesRTOApi = async (data, config) => {
    return await axios.post(`${LOCAL_BASE_URL}create-rto-sale`, data, config);
  };  

  export const SalesRTOListAPI = async (data, config) => {
    return await axios.post(`${LOCAL_BASE_URL}rto-list`, data, config);
  };

