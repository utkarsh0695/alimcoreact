import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";
import { config } from "react-transition-group";

//Revenue Reports

export const revenueReportsListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}revenue-report`, data, config);
};

//payment Reports

export const paymentReportListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}payment-report`, data, config);
};

//payment-report-list-aasra

export const paymentReportAasraAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}payment-report-aasra`,data,config);
};


export const partsReplacementListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}part-repalacement`,data,config);
};

export const wholeStockReportListAPI = async (data,config) =>{
  return await axios.post(`${LOCAL_BASE_URL}inventory-Whole-Format`,data,config);
}

export const AasrapaymentReportListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}Aasra-Payment-Reports`, data, config);
};