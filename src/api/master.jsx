import axios from "axios";
import { LOCAL_BASE_URL } from "../Constant/MyConstants";
const getToken = () => {
  return localStorage.getItem("accessToken");
};

const createHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
};
//! Master Category Starts Here
//  create Category Master
export const createCategoryMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-category`, data, config);
};
//  list Category Master
export const listCategoryMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}category-list`, data, config);
};
//  update Category Master
export const updateCategoryMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-category`, data, config);
};
//  delete Category Master
export const deleteCategoryMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-category`, data, config);
};
//! Master problem Ends Here

//! Master problem Starts Here
//  create problem Master
export const createProblemMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-problem`, data, config);
};
//  list problem Master
export const listProblemMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}problem-list`, data, config);
};
//  update problem Master
export const updateProblemMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-problem`, data, config);
};
//  delete problem Master
export const deleteProblemMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-problem`, data, config);
};
//! Master problem Ends Here


//! Master manufacturer Starts Here
//  create manufacturer Master
export const createManufacturerMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-manufacturer`, data, config);
};
//  list manufacturer Master
export const listManufacturerMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}manufacturer-list`, data, config);
};
//  update manufacturer Master
export const updateManufacturerMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-manufacturer`, data, config);
};
//  delete manufacturer Master
export const deleteManufacturerMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-manufacturer`, data, config);
};
//! Master Category Ends Here


//! Master center Starts Here
//  create center Master
export const createCenterMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasratype-create`, data, config);
};
//  list center Master
export const listCenterMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasratype-list`, data, config);
};
//  update center Master
export const updateCenterMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasratype-update`, data, config);
};
//  delete center Master
export const deleteCenterMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-aasratype`, data, config);
};
//! Master center Ends Here



//! Master UOM Starts Here
export const createUomMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-uom`, data, config);
};
export const updateUomMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-uom`, data, config);
};

// export const deleteUomMasterAPI = async (data, config) => {
//   return await axios.post(`${LOCAL_BASE_URL}delete-uom`, data, config);
// };

export const listUOMListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}uom-list`, data, config);
};
//! Master Spare Part Starts Here
//  create SparePart Master
export const createSparePartMasterAPI = async (data, config) => {

  const headers = createHeaders();
  return await axios.post(`${LOCAL_BASE_URL}create-spare-part`, data, config);
};
//  list SparePart Master
export const listSparePartMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}spare-part-list`, data, config);
};
//  update SparePart Master
export const updateSparePartMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-spare-part`, data, config);
};
//  delete SparePart Master
export const deleteSparePartMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-spare-part`, data, config);
};
//! Master Spare Part Ends Here

// Aasra 

export const registerAasraAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}register-aasra`, data, config);
};
export const deleteAasraAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasra-delete`, data, config);
};
export const updateAasraAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-aasra`, data, config);
};
export const listAasraListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}aasra-list`, data, config);
};

export const addOrderStockAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}add-stock`, data, config);
};

//Service history 
export const serviceHistoryListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}service-history-list`, data, config);
};

//! Labour Charge API
export const labourChargeListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}labour-charges`, data, config);
};
export const updateLabourChargeAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}update-labour-charges`, data, config);
};
export const deleteLabourChargeAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}delete-labour-charges`, data, config);
};
export const createLabourChargeAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}create-labour-charges`, data, config);
};


export const fileuploadpartSerialAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}file-upload-part-serial`, data, config);
};

export const fileuploadSparePartsAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}file-upload-stock`, data, config);
};
export const listStockMasterAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}stock-upload-list`, data, config);
};

export const partsSerialListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}list-part-serial`, data, config);
};

// create beneficiary api
export const addBeneficiaryAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}user-registration`, data, config);
}
export const editBeneficiaryAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}user-registration-update`, data, config);
}
export const userRegistrationListAPI = async (data, config) => {
  return await axios.post(`${LOCAL_BASE_URL}user-registration-list`, data, config);
}