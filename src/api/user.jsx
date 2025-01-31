import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const token = getToken()
const createHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
};
//  list User Master
export const getUserListAPI = async (data) => {
  // const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}user-list`, data);
};
//  create User Master
export const createUserAPI = async (data) => {
  // const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}create-user`, data);
};
//  delete User Master
export const deleteUserAPI = async (data) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}delete-user`, data, { headers });
};
//  update User Master
export const updateUserAPI = async (data) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}update-user`, data, { headers });
};

//update User Permission Master
export const getUserPermissionAPI = async (data) => {
     const headers = createHeaders();
    return await axios.post(`${LOCAL_BASE_URL}get-user-permission`, data,headers);
};

export const updateUserPermissionAPI = async (data) => {
  const headers = createHeaders();
 return await axios.post(`${LOCAL_BASE_URL}create-user-permission`, data,headers);
};

// change password
export const changePassword = async (data,config) => {
  return await axios.post(`${LOCAL_BASE_URL}user-change-pass`, data,config);
};


// Stock Transfer API
export const stockTransferList = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}order-list`, data,{headers});
}
export const addTransferStockAPI = async (data,config) => {
  return await axios.post(`${LOCAL_BASE_URL}stock-transfer-update`, data,config);
};


//User Purchase Data
export const purChaseProduct = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}create-purchase-order`, data,{headers});
}

export const OrderUpdate = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}update-order`, data,{headers});
}

export const OrderList = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}order-list`, data,{headers});
}

export const orderDetails = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}order-details`, data,{headers});
}

export const stockList = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}stock-list`,data,{headers});
}

export const stockItemDetail = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}stock-reports`,data,{headers});
}

export const paymentList = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}transaction-list`,data,{headers});
}

export const purchaseOrderStatus = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}purchase-order-status`,data,{headers});
}

export const purchaseOrder = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}purchase-order`,data,{headers});

}
export const repairReportSearchAPI = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}inventory-report`,data,{headers});

}

//addhhar num or uuid based details
export const uuidDetails = async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}get-user`,data,{headers});
}

export const otpVarify =async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}sentOtpWeb`,data,{headers});
}

export const updateOrder =async(data,header)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}update-order-details`,data,header);
}
export const updatePartial =async(data,header)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}partial-stock-transfer`,data,header);
}
export const updateReceived  =async(data,header)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}normal-stock-transfer`,data,header);
}

export const createTicket =async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}create-customer-ticket`,data,{headers});
}

export const createCall =async(data)=>{
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}callCenter-ticketcreate`,data,{headers});
}

export const dashboardAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}dashboard`, data, {headers});
}

export const ticketDropdown = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}manufacturer-list`, data, {headers});
}

export const ticketDetailAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}ticket-detail`, data, {headers});
}

export const updateStatus = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}user-status-update`, data, {headers});
}






