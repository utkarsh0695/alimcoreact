import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";

//Ticket List API
export const ticketListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}ticket-list`, data, config);
};
//Ticket List API
export const chatMessageListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasra-chat-list`, data, config);
};
//Ticket List API
export const createNewChatAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-aasra-chat`, data, config);
};
//generate Otp API
export const generateOtpAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}generate-otp`, data, config);
};
//verify Otp API
export const verifyOtpAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}verify-otp`, data, config);
};

//close Ticket API
export const closeTicketAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}close-ticket`, data, config);
};
//close Ticket API
export const openTicketAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}open-ticket`, data, config);
};




//! GENERATE ORDER NUMBER FOR TICKET AND PURCHASE ORDER
export const generateOrderNumber = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}generate-order-number`, data, config);
};
//! Verify ORDER  is open or not
export const verifyOrder = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}verify-order`, data, config);
};