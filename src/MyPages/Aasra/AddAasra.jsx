import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { districtListAPI, stateListAPI } from "../../api/dropdowns";
import {
  deleteAasraAPI,
  listAasraListAPI,
  registerAasraAPI,
  updateAasraAPI,
} from "../../api/master";
import ModalComponent from "../../CommonElements/ModalImg/ModalComponent";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { ValidateImg } from "../../util/myFunction";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";
import {
  validateAadhar,
  validateAlphabetWithSpace,
  validateDDCode,
  validateEmail,
  validateGST,
  validateIFSC,
  validateINMobile,
  validateNameWithHyphensSlashDotBracketSpaceNumber,
  validatePan,
  validatePinCode,
  validateTwoDigitDecimal,
} from "my-field-validator";
const AddAasra = () => {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("Add");
  const [isLoading, setIsLoading] = useState(false);
  const base_url = localStorage.getItem("base_url");
  const [data, setData] = useState([]);
  const [isCallCenter, setIsCallCenter] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setMode("Add");
    setIsOpen(!isOpen);
    reset();
    setRegImgs([]);
    setPanImgs([]);
    setAdhaarImgs([]);
    setAreaSqftImgs([]);
    setMarketSurvey([]);
    setPhotoImg([]);
    setSales([]);
    setSignatureImg([]);
  };
  const inputRef = useRef(null);
  const columns = [
    {
      name: "State",
      selector: (row) => row.stateData?.name,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    {
      name: "District",
      selector: (row) => row.city?.city,
      sortable: true,
      wrap: true,
      width: "120px",
    },
    {
      name: "Center Name",
      selector: (row) => row.name_of_org,
      sortable: true,
      wrap: true,
    },
    {
      name: "GST Number",
      selector: (row) =>
        row?.gst === "null" || row?.gst === null ? "" : row?.gst,
      sortable: true,
      wrap: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      wrap: true,
    },
    {
      name: "Pin",
      selector: (row) => row.pin,
      sortable: true,
      width: "90px",
    },
    {
      name: "Telephone No.",
      selector: (row) => row.telephone_no,
      sortable: true,
      width: "150px",
    },
    {
      name: "Mobile No.",
      selector: (row) => row.mobile_no,
      sortable: true,
      width: "130px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },

    //Application Fee Details
    // {
    //   name: "Application Fee Details",
    //   cell: (row) => (
    //     <div>
    //       <table cellPadding={4}>
    //         <tr>
    //           <td><b>DD Number</b></td>
    //           <td>{row.dd_number}</td>
    //         </tr>
    //         <tr> <td><b>DD Bank </b></td>
    //           <td>{row.dd_bank}</td></tr>
    //         <tr>
    //           <td><b>Amount</b> </td>
    //           <td>{row.amount}</td>
    //         </tr>

    //       </table>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "180px",

    // },

    // {
    //   name: "Aasra Site Details",
    //   cell: (row) => (
    //     <div>
    //       <table cellPadding={3}>
    //         <tr>
    //           <td><b>Center Name</b></td>
    //           <td>{row.name_of_org}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Address</b></td>
    //           <td>{row.address}</td>
    //         </tr>
    //         <tr> <td><b>Pin </b></td>
    //           <td>{row.pin}</td></tr>
    //         <tr>
    //           <td><b>Telephone No.</b> </td>
    //           <td>{row.telephone_no}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Mobile </b> </td>
    //           <td>{row.mobile_no}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Email</b> </td>
    //           <td>{row.email}</td>
    //         </tr>
    //       </table>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "380px",
    //   allowOverflow: true
    // },
    // {
    //   name: "Bank Details",
    //   cell: (row) => (
    //     <div>
    //       <table cellPadding={2}>
    //         <tr>
    //           <td><b>Bank Name</b></td>
    //           <td>{row.bank_name}</td>
    //         </tr>
    //         <tr>
    //           <td><b>Branch Name</b></td>
    //           <td>{row.branch_name}</td>
    //         </tr>
    //         <tr>
    //           <td><b>IFSC Code</b></td>
    //           <td>{row.ifsc_code}</td>
    //         </tr>
    //         <tr> <td><b>Bank Address</b></td>
    //           <td>{row.bank_address}</td></tr>
    //         <tr>
    //           <td><b>Address</b> </td>
    //           <td>{row.address}</td>
    //         </tr>

    //       </table>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "350px",

    // },
    // {
    //   name: "Self Declaration",
    //   cell: (row) => (
    //     <div>
    //       <table cellPadding={2}>
    //         <tr>
    //           <td><b>Name</b></td>
    //           <td>{row.name}</td>
    //         </tr>
    //         <tr> <td><b>Place</b></td>
    //           <td>{row.place}</td></tr>
    //         <tr> <td><b>Photo</b></td>
    //           <td><img
    //             src={`${base_url}/${row.document?.[0]?.photoImg}`}
    //             // src={`${row.photoImg}`}
    //             alt="photoImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.photoImg}`, 'Photo Image')}
    //           /></td>
    //         </tr>
    //         <tr>
    //           <td><b>Signature Image</b> </td>
    //           <td> <img
    //             src={`${base_url}/${row.document?.[0]?.signatureImg}`}
    //             // src={`${row.signatureImg}`}
    //             alt="signatureImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.signatureImg}`, 'Signature Image')}
    //           /></td>
    //         </tr>

    //       </table>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "350px",

    // },
    // {
    //   name: "Additional Information",
    //   cell: (row) => (
    //     <div className="table-responsive" id="style-2">
    //       <table cellPadding={4} style={{ width: '800PX' }}>
    //         <tr>
    //           <td><b>Relative in Alimco</b></td>
    //           <td>{row.relative_in_alimco}</td>
    //         </tr>
    //         <tr> <td><b>Additional Information</b></td>
    //           <td>{row.additionalInfo}</td></tr>
    //         <tr> <td><b>Agreement Of Rupee</b></td>
    //           <td>{row.agreement_of_rupee}</td></tr>
    //         <tr>
    //           <td><b>Invest Agree No</b> </td>
    //           <td>{row.invest_agree}</td>
    //         </tr>
    //       </table>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "350px",

    // },
    // {
    //   name: "Documents",
    //   cell: (row) => (
    //     <div className="table-responsive" id="style-2">
    //       <table cellPadding={2} style={{ width: '950PX' }}>
    //         <tr>
    //           <td><b>Pan No.</b></td>
    //           <td>{row.pan_no}</td>
    //           <td><img
    //             src={`${base_url}/${row.document?.[0]?.panImg}`}
    //             // src={`${row.panImg}`}
    //             alt="panImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.panImg}`, 'PanCard Image')}
    //           /></td>
    //           <td><b>Aadhaar No</b></td>
    //           <td>{row.adhaar_no}</td>
    //           <td> <img
    //             src={`${base_url}/${row.document?.[0]?.adhaarImg}`}
    //             // src={`${row.adhaarImg}`}
    //             alt="adhaarImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.adhaarImg}`, 'Adhaar Image')}
    //           /></td>
    //           <td><b>RegCertificate No</b></td>
    //           <td>{row.regCertificate_no}</td>
    //           <td><img
    //             src={`${base_url}/${row?.document?.[0]?.regImg}`}
    //             // src={`${row.regImg}`}
    //             alt="regImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.regImg}`, 'Registration Certificate')}
    //           /></td>
    //         </tr>
    //         <tr>
    //           <td><b>Area Sqft</b> </td>
    //           <td>{row.area_sqft}</td>
    //           <td><img
    //             src={`${base_url}/${row.document?.[0]?.areaImgs}`}
    //             // src={`${row.areaImgs}`}
    //             alt="areaImgs"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.areaImgs}`, 'Area sqft Image')}
    //           /></td>
    //           <td><b>Annual Sales Potential</b> </td>
    //           <td>{row.annual_sales_potential}</td>
    //           <td><img
    //             src={`${base_url}/${row.document?.[0]?.salesImg}`}
    //             // src={`${row.salesImg}`}
    //             alt="salesImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.salesImg}`, 'Sales Image')}
    //           /></td>
    //           <td><b>Market Survey No</b> </td>
    //           <td>{row.market_survey_no}</td>
    //           <td> <img
    //             src={`${base_url}/${row.document?.[0]?.marketImg}`}
    //             // src={`${row.marketImg}`}
    //             alt="marketImg"
    //             style={{ width: 80, height: 40, cursor: "pointer" }}
    //             onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.marketImg}`, 'Market Image')}
    //           /></td>
    //         </tr>
    //       </table>
    //       <div className="scroller"></div>
    //     </div>
    //   ),
    //   wrap: true,
    //   width: "400px",

    // },

    // {
    //   name: "regCertificate_no",
    //   selector: (row) => row.regCertificate_no,
    //   sortable: true,
    // },
    // {
    //   name: "pan_no",
    //   selector: (row) => row.pan_no,
    //   sortable: true,
    // },
    // {
    //   name: "Aadhaar_no",
    //   selector: (row) => row.adhaar_no,
    //   sortable: true,
    // },
    // {
    //   name: "area_sqft",
    //   selector: (row) => row.area_sqft,
    //   sortable: true,
    // },
    // {
    //   name: "Annual Sales Potential",
    //   selector: (row) => row.annual_sales_potential,
    //   sortable: true,
    // },
    // {
    //   name: "market_survey_no",
    //   selector: (row) => row.market_survey_no,
    //   sortable: true,
    // },
    // {
    //   name: "name",
    //   selector: (row) => row.name,
    //   sortable: true,
    // },
    // {
    //   name: "place",
    //   selector: (row) => row.place,
    //   sortable: true,
    // },
    // {
    //   name: "RegImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row?.document?.[0]?.regImg}`}
    //       // src={`${row.regImg}`}
    //       alt="regImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.regImg}`, 'Registration Certificate')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "photoImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.photoImg}`}
    //       // src={`${row.photoImg}`}
    //       alt="photoImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.photoImg}`, 'Photo Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "panImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.panImg}`}
    //       // src={`${row.panImg}`}
    //       alt="panImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.panImg}`, 'PanCard Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "adhaarImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.adhaarImg}`}
    //       // src={`${row.adhaarImg}`}
    //       alt="adhaarImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.adhaarImg}`, 'Adhaar Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "areaImgs",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.areaImgs}`}
    //       // src={`${row.areaImgs}`}
    //       alt="areaImgs"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.areaImgs}`, 'Area sqft Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "salesImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.salesImg}`}
    //       // src={`${row.salesImg}`}
    //       alt="salesImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.salesImg}`, 'Sales Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "marketImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.marketImg}`}
    //       // src={`${row.marketImg}`}
    //       alt="marketImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.marketImg}`, 'Market Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },
    // {
    //   name: "signatureImg",
    //   selector: (row) => <div>
    //     <img
    //       src={`${base_url}/${row.document?.[0]?.signatureImg}`}
    //       // src={`${row.signatureImg}`}
    //       alt="signatureImg"
    //       style={{ width: 80, height: 40, cursor: "pointer" }}
    //       onClick={() => handleImageClick(0, `${base_url}/${row?.document?.[0]?.signatureImg}`, 'Signature Image')}
    //     />
    //   </div>,
    //   sortable: true,
    // },

    {
      name: "Action",
      width: "100px",
      cell: (row) => (
        <div>
          {/* <Button
            outline
            color={`danger`}
            size={`xs`}
             className={`me-1`}
            onClick={() => handleView(row)}
          >
            {" "}
            <i className="fa fa-eye"></i>
          </Button> */}
          <Button
            id={"edit-" + row.id}
            outline
            color={`warning`}
            size={`xs`}
            className={`me-2`}
            onClick={() => handleEdit(row)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              paddingTop: "5px",
            }}
          >
            {" "}
            <FaRegEdit style={{ height: ".8rem", width: ".8rem" }} />
          </Button>
          <ToolTip id={"edit-" + row.id} name={"Edit"} option={"top"} />
          {/* <Button
            outline
            id={"delete-" + row.id}
            color={`danger`}
            size={`xs`}
            onClick={() => handleDelete(row)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              paddingTop: "5px",
            }}
          >
            {" "}
            <FaRegTrashCan style={{ height: ".8rem", width: ".8rem" }} />
          </Button>
          <ToolTip id={"delete-" + row.id} name={"Delete"} option={"top"} /> */}
        </div>
      ),
    },
  ];

  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const [panImgs, setPanImgs] = useState(null);
  const [adhaarImgs, setAdhaarImgs] = useState(null);
  const [areaSqftImgs, setAreaSqftImgs] = useState(null);
  const [regImgs, setRegImgs] = useState(null);
  const [marketSurvey, setMarketSurvey] = useState(null);
  const [sales, setSales] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [titleName, setTitleName] = useState("");
  const [image, setImage] = useState(false);
  useEffect(() => {
    stateList();
    aasraList();
  }, []);
  const navigate = useNavigate();
  const handleView = (row) => {
    navigate(`${process.env.PUBLIC_URL}/view-aasra/${row.id}`, {
      state: { row },
    });
  };
  const stateList = () => {
    stateListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setState(res.data.data.stateData);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  const aasraList = () => {
    listAasraListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setData(res.data?.data?.data);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
          setData([]);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  const handleStateChange = (selectedOption) => {
    setValue("state", selectedOption || "");
    trigger("state");
    setValue("district", "");
    setValue("callCenter", "");
    const data = {
      id: selectedOption.value,
    };
    districtListAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setDistrict(res.data.data.cityData);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  const handleDistrictChange = (selectedOption) => {
    setValue("district", selectedOption || "");
    trigger("district");
  };

  // const handleImageChange = (e, setImageState, inputName, type) => {
  //   const file = e.target.files[0]; // Get the first file
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setImageState([imageUrl]); // Set the state to an array with one image
  //     setValue(inputName, e.target.files);
  //   }
  // };

  const handleImageChange = (e, setImageState, inputName, errorInput) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      ValidateImg(file, (isValid) => {
        if (isValid) {
          // Process the valid image
          setImageState([imageUrl]); // Set the state to an array with one image
          setValue(inputName, e.target.files);
          trigger(inputName);
          clearErrors(errorInput);
        } else {
          // Handle the invalid file type
          setError(errorInput, {
            type: "manual",
            message:
              "Invalid file type. Only PNG, JPEG, and JPG files are allowed.",
          });
          console.error(
            "Invalid file type. Only PNG, JPEG, and JPG files are allowed."
          );
          e.target.value = ""; // Clear the input
        }
      });
    } else {
      setImageState([" "]);
    }
  };

  const handleRemoveImage = (index, imageArray, setImageState, id) => {
    if (!Array.isArray(imageArray)) {
      return;
    }
    const newImages = [...imageArray];
    newImages.splice(index, 1);
    setImageState(newImages);
    document.getElementById(id).value = null;
    if (index === currentImageIndex && newImages.length > 0) {
      setCurrentImageIndex(0);
    } else if (newImages.length === 0) {
      //toggleModal(); // Close the modal if no images left
    }
  };
  const handleImageClick = (index, image, inputName) => {
    setCurrentImageIndex(index);
    setModalImages([image]);
    toggleImageModal();
    setTitleName(inputName);
  };
  const toggleImageModal = () => {
    setModalOpen(true);
    // setModalImages(null)
  };
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    // setModalImages(null)
  };
  const handleDelete = (row) => {
    setRowData(row);
    toggleDeleteModal();
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };
  const confirmDelete = () => {
    const bodyData = {
      id: rowData.id,
    };
    deleteAasraAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data?.status == "success") {
          aasraList();
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
    toggleDeleteModal();
  };
  const handleEdit = (row) => {
    window.scrollTo({
      top: 15,
      behavior: "smooth",
    });
    // console.log(row, "setRowdata");

    setImage(true);
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);
    setValue("id", row?.id);
    setValue("state", { label: row.stateData.name, value: row.stateData.id });
    setValue("district", { label: row.city.city, value: row.city.id });
    if (row?.callCenterValue !== null) {
      setValue("callCenter", {
        label: row.callCenterLabel,
        value: row.callCenterValue,
      });
    }
    setValue("dd_number", row.dd_number);
    setValue("dd_bank", row.dd_bank);
    setValue("amount", row.amount);
    setValue("address", row.address);
    setValue("pin", row.pin);
    setValue("telephone_no", row.telephone_no);
    setValue("mobile_no", row.mobile_no);
    setValue("email", row.email);
    if (row?.gst !== null && row?.gst !== "null") {
      setValue("gst", row?.gst);
    }
    setValue("lat", row.lat);
    setValue("log", row.log);
    setValue("regCertificate_no", row.regCertificate_no);
    setValue("pan_no", row.pan_no);
    setValue("adhaar_no", row.adhaar_no);
    setValue("area_sqft", row.area_sqft);
    setValue("bank_name", row.bank_name);
    setValue("bank_address", row.bank_address);
    setValue("branch_name", row.branch_name);
    setValue("ifsc_code", row.ifsc_code);
    setValue("market_survey_no", row.market_survey_no);
    setValue("additionalInfo", row.additionalInfo);
    setValue("relative_in_alimco", row.relative_in_alimco);
    setValue("agreement_of_rupee", row.agreement_of_rupee);
    setValue("annual_sales_potential", row.annual_sales_potential);
    setValue("invest_agree", row.invest_agree);
    setValue("name", row.name);
    setValue("name_of_org", row.name_of_org);
    setValue("place", row.place);
    setValue("regImg", row?.document?.[0]?.regImg);
    setValue("photo", row?.document?.[0]?.photoImg);
    setValue("panImg", row?.document?.[0]?.panImg);
    setValue("areaImgs", row?.document?.[0]?.areaImgs);
    setValue("adhaarImg", row?.document?.[0]?.adhaarImg);
    setValue("salesImg", row?.document?.[0]?.salesImg);
    setValue("marketImg", row?.document?.[0]?.marketImg);
    setValue("signatureImg", row?.document?.[0]?.signatureImg);
    // console.log(`${base_url}/${row?.document?.[0]?.salesImg}`, "s----");
    setPhotoImg(`${base_url}/${row?.document?.[0]?.photoImg}`);
    setMarketSurvey(`${base_url}/${row?.document?.[0]?.marketImg}`);
    setSales(`${base_url}/${row?.document?.[0]?.salesImg}`);
    setAdhaarImgs(`${base_url}/${row?.document?.[0]?.adhaarImg}`);
    setAreaSqftImgs(`${base_url}/${row?.document?.[0]?.areaImgs}`);
    setRegImgs(`${base_url}/${row?.document?.[0]?.regImg}`);
    setPanImgs(`${base_url}/${row?.document?.[0]?.panImg}`);
    setSignatureImg(`${base_url}/${row?.document?.[0]?.signatureImg}`);
    const data = {
      id: row.stateData.id,
    };
    districtListAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setDistrict(res.data.data.cityData);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };

  const onFormSubmit = (data) => {
    // console.log(data, "oooooooo");
    setIsLoading(true);
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    if (mode == "Edit") {
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      const zero = {
        id: data?.id,
        key: myKey,
      };
      // console.log(data,"editdata");
      // return false
      const EditformData = new FormData();
      EditformData.append("ids", encrypt(zero));
      EditformData.append("state", data?.state?.value);
      EditformData.append("district", data?.district?.value);
      EditformData.append("callCenter", data?.callCenter?.value || null);
      EditformData.append("dd_number", data?.dd_number);
      EditformData.append("dd_bank", data?.dd_bank);
      EditformData.append("amount", data?.amount);
      EditformData.append("address", data?.address);
      EditformData.append("name_of_org", data?.name_of_org);
      EditformData.append("pin", data?.pin);
      EditformData.append("telephone_no", data?.telephone_no);
      EditformData.append("mobile_no", data?.mobile_no);
      EditformData.append("email", data?.email);
      EditformData.append("gst", data?.gst || null);
      EditformData.append("lat", data?.lat);
      EditformData.append("log", data?.log);
      EditformData.append("regCertificate_no", data?.regCertificate_no);
      EditformData.append("pan_no", data?.pan_no);
      EditformData.append("adhaar_no", data?.adhaar_no);
      EditformData.append("area_sqft", data?.area_sqft);
      EditformData.append("bank_name", data?.bank_name);
      EditformData.append("bank_address", data?.bank_address);
      EditformData.append("branch_name", data?.branch_name);
      EditformData.append("ifsc_code", data?.ifsc_code);
      EditformData.append("market_survey_no", data?.market_survey_no);
      EditformData.append("additionalInfo", data?.additionalInfo);
      EditformData.append("relative_in_alimco", data?.relative_in_alimco);
      EditformData.append("agreement_of_rupee", data?.agreement_of_rupee);
      EditformData.append(
        "annual_sales_potential",
        data?.annual_sales_potential
      );
      EditformData.append("invest_agree", data?.invest_agree);
      EditformData.append("name", data?.name);
      EditformData.append("place", data?.place);

      if (data?.regImg && data.regImg[0]) {
        EditformData.append("regImg", data.regImg[0]);
      } else {
        EditformData.append("regImg", null);
      }
      if (data?.panImg && data.panImg[0]) {
        EditformData.append("panImg", data.panImg[0]);
      } else {
        EditformData.append("panImg", null);
      }
      if (data?.adhaarImg && data.adhaarImg[0]) {
        EditformData.append("adhaarImg", data.adhaarImg[0]);
      } else {
        EditformData.append("adhaarImg", null);
      }
      if (data?.areaImgs && data.areaImgs[0]) {
        EditformData.append("areaImgs", data.areaImgs[0]);
      } else {
        EditformData.append("areaImgs", null);
      }
      if (data?.marketImg && data.marketImg[0]) {
        EditformData.append("marketImg", data.marketImg[0]);
      } else {
        EditformData.append("marketImg", null);
      }
      if (data?.salesImg && data.salesImg[0]) {
        EditformData.append("salesImg", data.salesImg[0]);
      } else {
        EditformData.append("salesImg", null);
      }
      if (data?.photoImg && data.photoImg[0]) {
        EditformData.append("photoImg", data.photoImg[0]);
      } else {
        EditformData.append("photoImg", null);
      }
      if (data?.signatureImg && data.signatureImg[0]) {
        EditformData.append("signatureImg", data.signatureImg[0]);
      } else {
        EditformData.append("signatureImg", null);
      }
      updateAasraAPI(EditformData, token)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            toast.success(res.data.message);
            setIsLoading(false);
            aasraList();
            handleOpen();
            reset();
            setMode("Add");
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
            setIsLoading(false);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const formData = new FormData();
      formData.append("state", data?.state?.value || null);
      formData.append("district", data?.district?.value || null);
      formData.append("callCenterValue", data?.callCenter?.value || null);
      formData.append("callCenterLabel", data?.callCenter?.label || null);
      formData.append("dd_number", data?.dd_number || 0);
      formData.append("dd_bank", data?.dd_bank || null);
      formData.append("amount", data?.amount || 0);
      formData.append("address", data?.address || null);
      formData.append("name_of_org", data?.name_of_org || null);
      formData.append("pin", data?.pin || null);
      formData.append("telephone_no", data?.telephone_no || null);
      formData.append("mobile_no", data?.mobile_no || null);
      formData.append("email", data?.email || null);
      formData.append("gst", data?.gst || null);
      formData.append("lat", data?.lat || null);
      formData.append("log", data?.log || null);
      formData.append("regCertificate_no", data?.regCertificate_no || null);
      formData.append("pan_no", data?.pan_no || null);
      formData.append("adhaar_no", data?.adhaar_no || null);
      formData.append("area_sqft", data?.area_sqft || null);
      formData.append("bank_name", data?.bank_name || null);
      formData.append("bank_address", data?.bank_address || null);
      formData.append("branch_name", data?.branch_name || null);
      formData.append("ifsc_code", data?.ifsc_code || null);
      formData.append("market_survey_no", data?.market_survey_no || null);
      formData.append("additionalInfo", data?.additionalInfo);
      formData.append("relative_in_alimco", data?.relative_in_alimco);
      formData.append("agreement_of_rupee", data?.agreement_of_rupee || null);
      formData.append(
        "annual_sales_potential",
        data?.annual_sales_potential || null
      );
      formData.append("invest_agree", data?.invest_agree || null);
      formData.append("name", data?.name || null);
      formData.append("place", data?.place || null);
      // Append images if they exist
      if (data?.regImg && data.regImg[0]) {
        formData.append("regImg", data.regImg[0] || null);
      } else {
        formData.append("regImg", null);
      }
      if (data?.panImg && data.panImg[0]) {
        formData.append("panImg", data.panImg[0] || null);
      } else {
        formData.append("panImg", null);
      }
      if (data?.adhaarImg && data.adhaarImg[0]) {
        formData.append("adhaarImg", data.adhaarImg[0] || null);
      } else {
        formData.append("adhaarImg", null);
      }
      if (data?.areaImgs && data.areaImgs[0]) {
        formData.append("areaImgs", data.areaImgs[0] || null);
      } else {
        formData.append("areaImgs", null);
      }
      if (data?.marketImg && data.marketImg[0]) {
        formData.append("marketImg", data.marketImg[0] || null);
      } else {
        formData.append("marketImg", null);
      }
      if (data?.salesImg && data.salesImg[0]) {
        formData.append("salesImg", data.salesImg[0] || null);
      } else {
        formData.append("salesImg", null);
      }

      if (data?.photoImg && data.photoImg[0]) {
        formData.append("photoImg", data.photoImg[0] || null);
      } else {
        formData.append("photoImg", null);
      }
      if (data?.signatureImg && data.signatureImg[0]) {
        formData.append("signatureImg", data.signatureImg[0] || null);
      } else {
        formData.append("signatureImg", null);
      }
      registerAasraAPI(formData, token)
        .then((res) => {
          if (res.data.status === "success") {
            toast.success(res.data.message);
            setIsLoading(false);
            aasraList();
            handleOpen();
            reset();
            setImage(false);
          } else if (res.data.status == "failed") {
            setIsLoading(false);
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
    // for (let key in data) {
    //     if ( key === 'marketImg' || key === 'salesImg' || key === 'photoImg' || key === 'signatureImg') {

    //         if (data[key]) {
    //             Array.from(data[key]).forEach(file => formData.append(key, file));
    //         }
    //     } else {
    //         formData.append(key, data[key]);
    //     }
    // }
  };

  const callCenter = [{ value: "callcenter", label: "Call Center" }];

  const handlecallCenterChange = (selectedOption) => {
    setIsCallCenter(true);
    setValue("callCenter", selectedOption || "");
    trigger("callCenter");
  };
  // console.log("images pan",watch("panImg"),panImgs);
  // console.log("images reg",watch("regImg"),regImgs);
  // console.log("images adhaar",watch("adhaarImg"),adhaarImgs);
  // console.log("images area",watch("areaImgs"),areaSqftImgs);
  // console.log("images sales",watch("salesImg"),sales);
  // console.log("images market",watch("marketImg"),marketSurvey);
  // console.log("images signature", watch("signatureImg"), signatureImg);
  // console.log("images photo", watch("photoImg"), photoImg);
  // console.log(data,"data");
  // console.log(rowData,"data");
  // Reusable function to determine upload button visibility

  //   const shouldShowUploadButton = (mode, images) => {
  //     // Ensure consistent base URL logic
  //     const updatedBaseUrl = base_url.endsWith("/") ? base_url : `${base_url}/`;

  //     // Allow button only in "Edit" or "Add" mode
  //     if (mode !== "Edit" && mode !== "Add") return false;

  //     // Hide button if images are already uploaded
  //     if (
  //       Array.isArray(images) &&
  //       images.some((img) => img && !img.includes("undefined") && img !== "")
  //     ) {
  //       return false;
  //     }

  //     // For "Edit", check if images are "null", "undefined", or ""
  //     if (mode === "Edit") {
  //       if (typeof images === "string") {
  //         const path = images.replace(`${updatedBaseUrl}`, "");
  //         return path === "null" || images.includes("undefined") || images === "";
  //       } else if (Array.isArray(images)) {
  //         const hasValidImage = images.some(
  //           (img) =>
  //             img && // Ensure image is not null or undefined
  //             !img.includes("undefined") && // Exclude "undefined"
  //             img !== "" && // Exclude empty strings
  //             img.replace(`${updatedBaseUrl}`, "") !== "null" // Exclude "null"
  //         );
  //         return !hasValidImage;
  //       }
  //     }

  //     // Default: Show button in "Add" mode with no valid images
  //     return true;
  //   };
  //  // Function to get valid image URLs
  // const getValidImageUrls = (images) => {
  //   const updatedBaseUrl = base_url.endsWith("/") ? base_url : `${base_url}/`;

  //   if (Array.isArray(images)) {
  //     return images.filter(
  //       (img) =>
  //         img && // Ensure the item is not null or undefined
  //         img !== "" && // Exclude empty strings
  //         !img.includes("undefined") && // Exclude URLs containing "undefined"
  //         img.replace(`${updatedBaseUrl}`, "") !== "null" // Exclude string "null"
  //     );
  //   }

  //   if (
  //     typeof images === "string" &&
  //     images &&
  //     images !== "" && // Exclude empty strings
  //     !images.includes("undefined") && // Exclude URLs containing "undefined"
  //     images.replace(`${updatedBaseUrl}`, "") !== "null"
  //   ) {
  //     return [images];
  //   }

  //   return []; // Return empty array if no valid images found
  // };

  const shouldShowUploadButton = (mode, images) => {
    // Ensure consistent base URL logic
    const updatedBaseUrl = base_url.endsWith("/") ? base_url : `${base_url}/`;

    // Allow button only in "Edit" or "Add" mode
    if (mode !== "Edit" && mode !== "Add") return false;

    // Hide button if images are already uploaded and valid
    if (
      Array.isArray(images) &&
      images.some(
        (img) =>
          img && // Ensure image is not null or undefined
          img !== "" && // Exclude empty strings
          img !== updatedBaseUrl && // Exclude base URL only
          !img.includes("undefined") && // Exclude URLs containing "undefined"
          img.replace(`${updatedBaseUrl}`, "") !== "null" // Exclude "null"
      )
    ) {
      return false;
    }

    // For "Edit", check if images are invalid
    if (mode === "Edit") {
      if (typeof images === "string") {
        const path = images.replace(`${updatedBaseUrl}`, "");
        return (
          !images || // Null, undefined, or empty strings
          images === updatedBaseUrl || // Base URL only
          images.includes("undefined") || // URLs containing "undefined"
          path === "null" // "null" string
        );
      } else if (Array.isArray(images)) {
        const hasValidImage = images.some(
          (img) =>
            img &&
            img !== "" &&
            img !== updatedBaseUrl &&
            !img.includes("undefined") &&
            img.replace(`${updatedBaseUrl}`, "") !== "null"
        );
        return !hasValidImage;
      }
    }

    // Default: Show button in "Add" mode with no valid images
    return true;
  };

  const getValidImageUrls = (images) => {
    const updatedBaseUrl = base_url.endsWith("/") ? base_url : `${base_url}/`;
    console.log("images", images);

    if (Array.isArray(images)) {
      return images.filter(
        (img) =>
          img && // Ensure the item is not null or undefined
          img !== "" && // Exclude empty strings
          img !== updatedBaseUrl && // Exclude base URL only
          !img.includes("undefined") && // Exclude URLs containing "undefined"
          img.replace(`${updatedBaseUrl}`, "") !== "null" // Exclude string "null"
      );
    }

    if (
      typeof images === "string" &&
      images &&
      images !== "" && // Exclude empty strings
      images !== updatedBaseUrl && // Exclude base URL only
      !images.includes("undefined") && // Exclude URLs containing "undefined"
      images.replace(`${updatedBaseUrl}`, "") !== "null"
    ) {
      return [images];
    }

    return []; // Return empty array if no valid images found
  };

  return (
    <>
      <Breadcrumbs mainTitle="Our Aasra" parent="Our Aasra" title="Add Aasra" />
      <Container fluid={true}>
        <Row>
          <Col
            className="mb-2"
            sm="12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div>
              <Button color="primary" onClick={handleOpen}>
                {isOpen ? (
                  <i className="fa fa-minus" />
                ) : (
                  <i className="fa fa-plus" />
                )}
              </Button>
            </div>
          </Col>
          {isOpen && (
            <Col sm="12">
              <Form className="" onSubmit={handleSubmit(onFormSubmit)}>
                <Col sm="12">
                  <Card>
                    <CardHeader>
                      <h5>{"Add Aasra"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md="4" sm="3" xxl="3">
                          <div className="form-group">
                            <Label className="form-label" htmlFor="state">
                              State
                              <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="state"
                                options={state}
                                {...register("state", {
                                  required: "Please select state",
                                })}
                                onChange={handleStateChange}
                                value={watch("state")}
                              />
                              {errors.state && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.state.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md="4" sm="3" xxl="3">
                          <div className="form-group">
                            <Label className="form-label" htmlFor="district">
                              District
                              <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="district"
                                options={district}
                                {...register("district", {
                                  required: "Please select District",
                                })}
                                onChange={handleDistrictChange}
                                value={watch("district")}
                              />
                              {errors.district && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.district.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        {mode == "Edit" &&
                        (rowData.callCenterValue == null ||
                          rowData.callCenterValue == "null") ? null : (
                          <Col md="4" sm="3" xxl="3">
                            <div className="form-group">
                              <Label
                                className="form-label"
                                htmlFor="callCenter"
                              >
                                Call Center
                              </Label>
                              <div className="form-control-wrap">
                                <Select
                                  className=""
                                  id="callCenter"
                                  options={callCenter}
                                  {...register("callCenter", {
                                    // required: "Please select callCenter",
                                  })}
                                  onChange={handlecallCenterChange}
                                  value={watch("callCenter")}
                                  isClearable
                                  isDisabled={mode == "Edit" ? true : false}
                                />
                                {/* {errors.callCenter && (
                               <span
                                 className="invalid"
                                 style={{
                                   color: "#e85347",
                                   fontSize: "11px",
                                   fontStyle: "italic",
                                 }}
                               >
                                 {errors.callCenter.message}
                               </span>
                             )} */}
                              </div>
                            </div>
                          </Col>
                        )}
                        {/* Application fee detail */}
                        {/* {!(watch(`callCenter`))&& ( */}
                        {/* <> */}
                        <Col md="12" className="mt-5">
                          <fieldset>
                            <legend>Application Fee Details</legend>
                            <Row>
                              <Col md="4" sm="3" xxl="3">
                                <Label for="dd-number" className="form-label">
                                  DD Number
                                  <Required />
                                </Label>

                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter dd-number"
                                    type="text"
                                    id="dd-number"
                                    {...register("dd_number", {
                                      required: "DD-number is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateDDCode(value) ||
                                          "DD-number must be a digit number",
                                      },
                                      minLength: {
                                        value: 6,
                                        message: "DD-number minmum is 6 digit.",
                                      },
                                      maxLength: {
                                        value: 12,
                                        message:
                                          "DD-number maximum is 12 digit.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("dd_number")}
                                    onChange={(e) => {
                                      setValue("dd_number", e.target.value);
                                      trigger("dd_number");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.dd_number && (
                                    <span className="invalid">
                                      {errors?.dd_number?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="3">
                                <label for="bank"className="form-label">
                                  Bank
                                  <Required />
                                </label>
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Bank "
                                    type="text"
                                    id="bank"
                                    {...register("dd_bank", {
                                      required: "Bank is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAlphabetWithSpace(value) ||
                                          "Enter only alphabetic characters.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("dd_bank")}
                                    onChange={(e) => {
                                      setValue("dd_bank", e.target.value);
                                      trigger("dd_bank");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.dd_bank && (
                                    <span className="invalid">
                                      {errors?.dd_bank?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="3">
                                <label for="amount"className="form-label">
                                  Amount
                                  <Required />
                                </label>
                                <div className="form-control-wrap">
                                  {/* <input
                                    placeholder="Enter Amount "
                                    type="text"
                                    id="amount"
                                    {...register("amount", {
                                      required: "Amount is  required.",
                                      pattern: {
                                        value: /^[0-9]*$/,
                                        message:
                                          "Amount must be a digit number",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("amount")}
                                    onChange={(e) => {
                                      setValue("amount", e.target.value);
                                      trigger("amount");
                                    }}
                                    onInput={(e) => {
                                      // Remove any non-numeric characters
                                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                  /> */}
                                  <input
                                    placeholder="Enter Amount"
                                    type="text"
                                    id="amount"
                                    {...register("amount", {
                                      required: "Amount is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateTwoDigitDecimal(value) ||
                                          "Amount must be a valid number with up to two decimal places.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("amount")}
                                    onChange={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );
                                      setValue("amount", e.target.value);
                                      trigger("amount");
                                    }}
                                    onInput={(e) => {
                                      // Allow only digits and a single decimal point
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );

                                      // Prevent more than one decimal point
                                      const parts = e.target.value.split(".");
                                      if (parts.length > 2) {
                                        e.target.value = `${parts[0]}.${parts[1]}`;
                                      }

                                      // Limit to two decimal places
                                      if (parts[1]?.length > 2) {
                                        e.target.value = `${
                                          parts[0]
                                        }.${parts[1].slice(0, 2)}`;
                                      }
                                    }}
                                  />

                                  {errors.amount && (
                                    <span className="invalid">
                                      {errors?.amount?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>
                        {/* </>
                        )} */}
                        <Col md="12" className="mt-4">
                          <fieldset>
                            {!watch(`callCenter`) ? (
                              <>
                                <legend>Aasra Site Details</legend>
                              </>
                            ) : (
                              <>
                                <legend>Call Center Details</legend>
                              </>
                            )}
                            <Row>
                              <Col md="4" sm="3" xxl="2">
                                <label for="centerName" className="form-label">
                                  Center Name
                                  <Required />
                                </label>

                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Center Name "
                                    type="text"
                                    id="centerName"
                                    {...register("name_of_org", {
                                      required: "Center Name is  required.",
                                    })}
                                    className="form-control"
                                    value={watch("name_of_org")}
                                    onChange={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                      setValue("name_of_org", e.target.value);
                                      trigger("name_of_org");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.name_of_org && (
                                    <span className="invalid">
                                      {errors?.name_of_org?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label className="form-label" htmlFor="gst">
                                  GST Number
                                </label>
                                <input
                                  className="form-control"
                                  id="gst"
                                  type="text"
                                  placeholder="Enter GST Number"
                                  {...register("gst", {
                                    pattern: {
                                      value:
                                        /[0-9]{2}[A-Za-z]{3}[ABCFGHLJPTF]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/, // Updated to allow up to two decimal places
                                      message: "Enter valid GST Number.",
                                    },
                                  })}
                                  onChange={(e) => {
                                    setValue("gst", e.target.value);
                                    trigger("gst");
                                  }}
                                  value={watch(`gst`)}
                                />
                                {errors.gst && (
                                  <span className="invalid">
                                    {errors?.gst?.message}
                                  </span>
                                )}
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="address" className="form-label">
                                  Address <Required />
                                </label>
                                {/* <input type="text" id="address" name="address" /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Address "
                                    type="text"
                                    id="address"
                                    {...register("address", {
                                      required: "Address is  required.",
                                      pattern: {
                                        value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                        message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                      }
                                    })}
                                    className="form-control"
                                    value={watch("address")}
                                    onChange={(e) => {
                                      setValue("address", e.target.value);
                                      trigger("address");
                                    }}
                                  />
                                  {errors.address && (
                                    <span className="invalid">
                                      {errors?.address?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="pin" className="form-label">
                                  PIN
                                  <Required />
                                </label>
                                {/* <input type="text" id="pin" name="pin" /> */}
                                <div className="form-control-wrap">
                                  {/* <input
                                    placeholder="Enter Pin "
                                    type="text"
                                    id="pin"
                                    {...register("pin", {
                                      required: "Pin is  required.",
                                      pattern: {
                                        value: /^[1-9][0-9]{5}$/,
                                        message: "Pin must be a Indian PIN code",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("pin")}
                                    onChange={(e) => {
                                      setValue("pin", e.target.value);
                                      trigger("pin");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                  /> */}
                                  <input
                                    placeholder="Enter Pin"
                                    type="text"
                                    id="pin"
                                    {...register("pin", {
                                      required: "Pin is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validatePinCode(value) ||
                                          "Pin must be an Indian PIN code.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("pin")}
                                    onChange={(e) => {
                                      const value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 6);
                                      setValue("pin", value);
                                      trigger("pin"); // This triggers the validation manually
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 6);
                                    }}
                                  />

                                  {errors.pin && (
                                    <span className="invalid">
                                      {errors?.pin?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="telephone" className="form-label">
                                  Telephone(landline)
                                  <Required />
                                </label>
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Telephone"
                                    type="text"
                                    id="telephone"
                                    {...register("telephone_no", {
                                      required: "Telephone is  required.",
                                      pattern: {
                                        value: /^[0-9][0-9]{10}$/,
                                        message:
                                          "Telephone (landline) must be a valid 11-digit Indian number starting with 2-9",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("telephone_no")}
                                    onChange={(e) => {
                                      setValue("telephone_no", e.target.value);
                                      trigger("telephone_no");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 11);
                                    }}
                                  />
                                  {errors.telephone_no && (
                                    <span className="invalid">
                                      {errors?.telephone_no?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="mobile" className="form-label">
                                  Mobile
                                  <Required />
                                </label>
                                {/* <input type="text" id="mobile" name="mobile" /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Mobile Number"
                                    type="text"
                                    id="mobile"
                                    {...register("mobile_no", {
                                      required: "Mobile Number is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateINMobile(value) ||
                                          "Enter a valid 10-digit Indian mobile number starting with 6-9.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("mobile_no")}
                                    onChange={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      setValue("mobile_no", e.target.value);
                                      trigger("mobile_no");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      e.target.value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 10);
                                    }}
                                  />
                                  {errors.mobile_no && (
                                    <span className="invalid">
                                      {errors?.mobile_no?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="email" className="form-label">
                                  Email
                                  <Required />
                                </label>
                                {/* <input
                              type="text"
                              id="fax-email"
                              name="fax-email"
                            /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Email"
                                    type="text"
                                    id="email"
                                    {...register("email", {
                                      required: "Email is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateEmail(value) ||
                                          "Enter valid email.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("email")}
                                    onChange={(e) => {
                                      setValue("email", e.target.value);
                                      trigger("email");
                                    }}
                                  />
                                  {errors.email && (
                                    <span className="invalid">
                                      {errors?.email?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="lat" className="form-label">
                                  Latitude
                                  <Required />
                                </label>
                                {/* <input
                              type="text"
                              id="fax-email"
                              name="fax-email"
                            /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter latitude"
                                    type="text"
                                    id="lat"
                                    {...register("lat", {
                                      required: "Latitude is  required.",
                                    })}
                                    className="form-control"
                                    value={watch("lat")}
                                    onChange={(e) => {
                                      setValue("lat", e.target.value);
                                      trigger("lat");
                                    }}
                                  />
                                  {errors.lat && (
                                    <span className="invalid">
                                      {errors?.lat?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md="4" sm="3" xxl="2">
                                <label for="log" className="form-label">
                                  Longitude
                                  <Required />
                                </label>
                                {/* <input
                              type="text"
                              id="fax-email"
                              name="fax-email"
                            /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Longitude"
                                    type="text"
                                    id="log"
                                    {...register("log", {
                                      required: "Longitude is  required.",

                                    })}
                                    className="form-control"
                                    value={watch("log")}
                                    onChange={(e) => {
                                      setValue("log", e.target.value);
                                      trigger("log");
                                    }}
                                  />
                                  {errors.log && (
                                    <span className="invalid">
                                      {errors?.log?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>

                        {/* //document*/}
                        <Col md="12" className="mt-4">
                          <fieldset>
                            <legend>Document</legend>
                            <Row>
                              <Col md="6" sm="6" lg="6" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="reg_no"
                                    className="form-label"
                                  >
                                    Reg. Certificate No.
                                    <Required />
                                  </Label>
                                  <input
                                    className="form-control"
                                    id="reg_no"
                                    type="text"
                                    placeholder="Enter Registration Number"
                                    {...register("regCertificate_no", {
                                      required:
                                        "Registration Certificate No. is  required.",
                                      pattern: {
                                        value: /^[a-zA-Z0-9]+$/,
                                        message:
                                          "Registration Certificate Alphanumeric",
                                      },
                                      minLength: {
                                        value: 2,
                                        message: "Enter minimum 2 digits.",
                                      },
                                      maxLength: {
                                        value: 23,
                                        message: "Enter maximum 23 digits.",
                                      },
                                    })}
                                    value={watch(`regCertificate_no`)}
                                    onChange={(e) => {
                                      setValue(
                                        "regCertificate_no",
                                        e.target.value
                                      );
                                      trigger("regCertificate_no");
                                    }}
                                    // onChange={handleInput("regCertificate_no")}
                                  />
                                  {errors.regCertificate_no && (
                                    <span className="invalid">
                                      {errors?.regCertificate_no?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(mode, regImgs) && (
                                    <div className="form-control-wrap mt-2">
                                      {/* <input
                                          className="form-control"
                                          id="regImg"
                                          type="file"
                                          name="regImg"
                                          accept="image/jpg, image/jpeg,image/png"
                                          {...register("regImage", {
                                            required: "Registration Image is  required.",
                                            validate: {
                                              size: (value) => value[0] && value[0].size <= 2 * 1024 * 1024 || "File size should be less than 2MB",
                                              type: (value) =>
                                                value[0] &&
                                                (value[0].type === "image/jpeg" || value[0].type === "image/png" || value[0].type === "image/jpg") ||
                                                "Only .jpg, .png, and .jpeg files are allowed",
                                            },
                                          })}

                                          onChange={(e) => handleImageChange(e, setRegImgs, "regImg")}

                                        /> */}
                                      <div class="file file--upload">
                                        <label for="regImg">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="regImg"
                                          type="file"
                                          name="regImg"
                                          accept="image/jpg, image/jpeg,image/png"
                                          {...register(
                                            "regImage"
                                            //   {
                                            //   required:
                                            //     "Registration Image is  required.",
                                            //   validate: {
                                            //     size: (value) =>
                                            //       (value[0] &&
                                            //         value[0].size <=
                                            //           2 * 1024 * 1024) ||
                                            //       "File size should be less than 2MB",
                                            //     type: (value) =>
                                            //       (value[0] &&
                                            //         (value[0].type ===
                                            //           "image/jpeg" ||
                                            //           value[0].type ===
                                            //             "image/png" ||
                                            //           value[0].type ===
                                            //             "image/jpg")) ||
                                            //       "Only .jpg, .png, and .jpeg files are allowed",
                                            //   },
                                            // }
                                          )}
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setRegImgs,
                                              "regImg",
                                              "regImage"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.regImage && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.regImage?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}
                                  {getValidImageUrls(regImgs).length > 0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {regImgs.length > 0 && (
                                            <div>
                                              {/* <span
                                              className="mx-2"
                                              onClick={() => handleRemoveImage(0, regImgs, setRegImgs, "regImg")}
                                              style={{ cursor: "pointer" }}
                                            >
                                              x
                                            </span> */}
                                              <img
                                                src={regImgs}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    regImgs,
                                                    "Registration Certificate"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {regImgs.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setRegImgs([]);
                                                  setValue("regImg", null); // Clear the value in the form
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="6" sm="6" lg="6" xl="2" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="pan_no"
                                    className="form-label"
                                  >
                                    PAN Number
                                    <Required />
                                  </Label>
                                  <input
                                    className="form-control"
                                    id="pan_no"
                                    type="text"
                                    placeholder="Enter PAN Number"
                                    {...register("pan_no", {
                                      required: "PAN Number is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validatePan(value) ||
                                          "Invalid PAN Number.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      // Allow only valid PAN characters: 5 letters, 4 digits, 1 letter
                                      e.target.value = e.target.value
                                        .replace(/[^a-zA-Z0-9]/g, "")
                                        .toUpperCase();
                                      // Enforce format
                                      if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(
                                          0,
                                          10
                                        ); // Limit to 10 characters
                                      }
                                    }}
                                    value={watch("pan_no")}
                                  />

                                  {errors.pan_no && (
                                    <span className="invalid">
                                      {errors?.pan_no?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(mode, panImgs) && (
                                    <div className="form-control-wrap mt-2">
                                      <div class="file file--upload">
                                        <label for="panImg">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="panImg"
                                          type="file"
                                          name="panImg"
                                          accept=".jpg, .png, .jpeg"
                                          {...register("panImage", {
                                            // required: "PAN Image is  required.",
                                          })}
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setPanImgs,
                                              "panImg",
                                              "panImage"
                                            )
                                          }
                                        />
                                      </div>

                                      {errors.panImage && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.panImage?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}
                                  {getValidImageUrls(panImgs).length > 0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {panImgs.length > 0 && (
                                            <div>
                                              {/* <span
                                            className="mx-2"
                                            onClick={() => handleRemoveImage(0, panImgs, setPanImgs, "panImg")}
                                            style={{ cursor: "pointer" }}
                                          >
                                            x
                                          </span> */}
                                              <img
                                                src={panImgs}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    panImgs,
                                                    "PanCard"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {panImgs.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                size="md"
                                                onClick={() => {
                                                  setValue("panImg", null);
                                                  setPanImgs([]);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="6" sm="6" lg="6" xl="2" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="adhaar_number"
                                    className="form-label"
                                  >
                                    Aadhaar Number
                                    <Required />
                                  </Label>
                                  <input
                                    className="form-control"
                                    id="adhaar_number"
                                    type="text"
                                    placeholder="Enter Aadhaar Number"
                                    {...register("adhaar_no", {
                                      required: "Aadhaar Number is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAadhar(value) ||
                                          "Aadhaar Number must be a valid 12-digit number.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      // Remove any non-numeric characters and limit to 12 digits
                                      e.target.value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 12);
                                    }}
                                    value={watch("adhaar_no")}
                                  />

                                  {errors.adhaar_no && (
                                    <span className="invalid">
                                      {errors?.adhaar_no?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(mode, adhaarImgs) && (
                                    <div className="form-control-wrap mt-2">
                                      <div class="file file--upload">
                                        <label for="adhaarImg">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="adhaarImg"
                                          type="file"
                                          name="adhaarImg"
                                          accept=".jpg, .png, .jpeg"
                                          {...register(
                                            "adhaarImage"
                                            //    {
                                            //   required:
                                            //     "Aadhaar Image is  required.",
                                            //   validate: {
                                            //     size: (value) =>
                                            //       (value[0] &&
                                            //         value[0].size <=
                                            //           2 * 1024 * 1024) ||
                                            //       "File size should be less than 2MB",
                                            //     type: (value) =>
                                            //       (value[0] &&
                                            //         (value[0].type ===
                                            //           "image/jpeg" ||
                                            //           value[0].type ===
                                            //             "image/png" ||
                                            //           value[0].type ===
                                            //             "image/jpg")) ||
                                            //       "Only .jpg, .png, and .jpeg files are allowed",
                                            //   },
                                            // }
                                          )}
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setAdhaarImgs,
                                              "adhaarImg",
                                              "adhaarImage"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.adhaarImage && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.adhaarImage?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}

                                  {getValidImageUrls(adhaarImgs).length > 0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {adhaarImgs.length > 0 && (
                                            <div>
                                              {/* <span
                                            className="mx-2"
                                            onClick={() => handleRemoveImage(0, adhaarImgs, setAdhaarImgs, "adhaarImg")}
                                            style={{ cursor: "pointer" }}
                                          >
                                            x
                                          </span> */}
                                              <img
                                                src={adhaarImgs}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    adhaarImgs,
                                                    "Adhaar Card"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {adhaarImgs.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setAdhaarImgs([]);
                                                  setValue("adhaarImg", null);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="6" sm="6" lg="6" xl="2" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="area_sqft"
                                    className="form-label"
                                  >
                                    Area in Sqft. <Required />
                                  </Label>
                                  <input
                                    className="form-control"
                                    id="area_sqft"
                                    type="text"
                                    placeholder="Enter Area Number"
                                    {...register("area_sqft", {
                                      required: "Area is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateTwoDigitDecimal(value) ||
                                          "Area number must be a valid number with up to two decimal places.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      // Remove any non-numeric characters
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );
                                    }}
                                    value={watch(`area_sqft`)}
                                  />
                                  {errors.area_sqft && (
                                    <span className="invalid">
                                      {errors?.area_sqft?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(
                                    mode,
                                    areaSqftImgs
                                  ) && (
                                    <div className="form-control-wrap mt-2">
                                      <div class="file file--upload">
                                        <label for="areaImg">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="areaImg"
                                          type="file"
                                          name="areaImgs"
                                          accept=".jpg, .png, .jpeg"
                                          {...register("areaImg", {
                                            // required:
                                            //   "Area in Sqft. Image is  required.",
                                            // validate: {
                                            //   size: (value) =>
                                            //     (value[0] &&
                                            //       value[0].size <=
                                            //         2 * 1024 * 1024) ||
                                            //     "File size should be less than 2MB",
                                            //   type: (value) =>
                                            //     (value[0] &&
                                            //       (value[0].type ===
                                            //         "image/jpeg" ||
                                            //         value[0].type ===
                                            //           "image/png" ||
                                            //         value[0].type ===
                                            //           "image/jpg")) ||
                                            //     "Only .jpg, .png, and .jpeg files are allowed",
                                            // },
                                          })}
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setAreaSqftImgs,
                                              "areaImgs",
                                              "areaImg"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.areaImg && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.areaImg?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}
                                  {getValidImageUrls(areaSqftImgs).length >
                                    0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {/* {!watch(`callCenter`) && (
                                          <> */}
                                          {areaSqftImgs.length > 0 && (
                                            <div>
                                              {/* <span
                                              className="mx-2"
                                              onClick={() => handleRemoveImage(0, areaSqftImgs, setAreaSqftImgs, "areaImg")}
                                              style={{ cursor: "pointer" }}
                                            >
                                              x
                                            </span> */}
                                              <img
                                                src={areaSqftImgs}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    areaSqftImgs,
                                                    "Area-Sqft-Image"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {areaSqftImgs.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setAreaSqftImgs([]);
                                                  setValue("areaImgs", null);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                          {/* </>
                                        )} */}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="6" sm="6" lg="6" xl="2" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="market_survey_no"
                                    className="form-label"
                                  >
                                    Market Survey <Required />
                                  </Label>

                                  <input
                                    className="form-control"
                                    id="market_survey_no"
                                    type="text"
                                    placeholder="Enter market survey number"
                                    {...register("market_survey_no", {
                                      required: "Market survey is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateTwoDigitDecimal(value) ||
                                          "Market survey must be a valid number with up to two decimal places.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      // Remove any non-numeric characters
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );
                                    }}
                                    value={watch(`market_survey_no`)}
                                    // onChange={handleInput("market_survey_no")}
                                  />
                                  {errors.market_survey_no && (
                                    <span className="invalid">
                                      {errors?.market_survey_no?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(
                                    mode,
                                    marketSurvey
                                  ) && (
                                    <div className="form-control-wrap mt-2">
                                      <div class="file file--upload">
                                        <label for="marketImgs">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="marketImgs"
                                          type="file"
                                          name="marketImg"
                                          {...register("marketImage", {
                                            // required:
                                            //   "Market Survey Image is  required.",
                                            // validate: {
                                            //   size: (value) =>
                                            //     (value[0] &&
                                            //       value[0].size <=
                                            //         2 * 1024 * 1024) ||
                                            //     "File size should be less than 2MB",
                                            //   type: (value) =>
                                            //     (value[0] &&
                                            //       (value[0].type ===
                                            //         "image/jpeg" ||
                                            //         value[0].type ===
                                            //           "image/png" ||
                                            //         value[0].type ===
                                            //           "image/jpg")) ||
                                            //     "Only .jpg, .png, and .jpeg files are allowed",
                                            // },
                                          })}
                                          accept=".jpg, .png, .jpeg"
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setMarketSurvey,
                                              "marketImg",
                                              "marketImage"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.marketImage && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.marketImage?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}
                                  {getValidImageUrls(marketSurvey).length >
                                    0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {marketSurvey.length > 0 && (
                                            <div>
                                              {/* <span
                                              className="mx-2"
                                              onClick={() => handleRemoveImage(0, marketSurvey, setMarketSurvey, "marketImgs")}
                                              style={{ cursor: "pointer" }}
                                            >
                                              x
                                            </span> */}
                                              <img
                                                src={marketSurvey}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    marketSurvey,
                                                    "Market Survey Image"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {/* {!watch(`callCenter`) && (
                                          <> */}
                                          {marketSurvey.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setMarketSurvey([]);
                                                  setValue("marketImg", null);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                          {/* </>
                                        )} */}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="6" sm="6" lg="6" xl="2" xxl="2">
                                <div className="form-group">
                                  <Label
                                    htmlFor="annual_sales_potential"
                                    className="form-label"
                                  >
                                    Annual Sales
                                    <Required />
                                  </Label>
                                  <input
                                    className="form-control"
                                    id="annual_sales_potential"
                                    type="text"
                                    placeholder="Enter Annual Sales "
                                    {...register("annual_sales_potential", {
                                      required: "Annual sales is required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateTwoDigitDecimal(value) ||
                                          "Annual sales must be a valid number with up to two decimal places.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      // Remove any non-numeric characters
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );
                                    }}
                                    value={watch(`annual_sales_potential`)}
                                    // onChange={handleInput("market_survey_no")}
                                  />
                                  {errors.annual_sales_potential && (
                                    <span className="invalid">
                                      {errors?.annual_sales_potential?.message}
                                    </span>
                                  )}
                                  {/* {!watch(`callCenter`) && (
                                    <> */}
                                  {shouldShowUploadButton(mode, sales) && (
                                    <div className="form-control-wrap mt-2">
                                      <div class="file file--upload">
                                        <label for="salesImgs">
                                          <i className="fa fa-upload"></i>
                                          Upload
                                        </label>
                                        <input
                                          className="form-control"
                                          id="salesImgs"
                                          type="file"
                                          name="salesImg"
                                          {...register("sales", {
                                            // required:
                                            //   "Annual Sales Image is required.",
                                            // validate: {
                                            //   size: (value) =>
                                            //     (value[0] &&
                                            //       value[0].size <=
                                            //         2 * 1024 * 1024) ||
                                            //     "File size should be less than 2MB",
                                            //   type: (value) =>
                                            //     (value[0] &&
                                            //       (value[0].type ===
                                            //         "image/jpeg" ||
                                            //         value[0].type ===
                                            //           "image/png" ||
                                            //         value[0].type ===
                                            //           "image/jpg")) ||
                                            //     "Only .jpg, .png, and .jpeg files are allowed",
                                            // },
                                          })}
                                          accept=".jpg, .png, .jpeg"
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setSales,
                                              "salesImg",
                                              "sales"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.sales && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.sales.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {/* </>
                                  )} */}

                                  {getValidImageUrls(sales).length > 0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {sales.length > 0 && (
                                            <div>
                                              {/* <span
                                              className="mx-2"
                                              onClick={() => handleRemoveImage(0, sales, setSales, "salesImgs")}
                                              style={{ cursor: "pointer" }}
                                            >
                                              x
                                            </span> */}
                                              <img
                                                src={sales}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    sales,
                                                    " Annual Sales Image"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {sales.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setSales([]);
                                                  setValue("salesImg", null);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>
                        {/* {!(watch(`callCenter`))&& (
                          <> */}
                        <Col md="12" className="mt-4">
                          <fieldset>
                            <legend>Bank Details</legend>
                            <Row>
                              <Col md="3">
                                <label for="bank_name" className="form-label">
                                  Name
                                  <Required />
                                </label>
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Bank "
                                    type="text"
                                    id="bank_name"
                                    {...register("bank_name", {
                                      required: "Bank Name is  required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAlphabetWithSpace(value) ||
                                          "Enter only alphabetic characters.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("bank_name")}
                                    onChange={(e) => {
                                      setValue("bank_name", e.target.value);
                                      trigger("bank_name");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.bank_name && (
                                    <span className="invalid">
                                      {errors?.bank_name?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>

                              <Col md="3">
                                <label for="bank_address" className="form-label">
                                  Address
                                  <Required />
                                </label>
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Bank Address "
                                    type="text"
                                    id="bank_address"
                                    {...register("bank_address", {
                                      required: "Bank Address is required.",
                                      pattern: {
                                        value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                        message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                      }
                                    })}
                                    className="form-control"
                                    value={watch("bank_address")}
                                    onChange={(e) => {
                                      setValue("bank_address", e.target.value);
                                      trigger("bank_address");
                                    }}
                                  />
                                  {errors.bank_address && (
                                    <span className="invalid">
                                      {errors?.bank_address?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>

                              <Col md="3">
                                <label for="branch_name" className="form-label">
                                  Branch Name
                                  <Required />
                                </label>
                                {/* <input
                              type="text"
                              id="telephone"
                              name="telephone"
                            /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter Branch Name"
                                    type="text"
                                    id="branch_name"
                                    {...register("branch_name", {
                                      required: "Branch Name is required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAlphabetWithSpace(value) ||
                                          "Enter only alphabetic characters.",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("branch_name")}
                                    onChange={(e) => {
                                      setValue("branch_name", e.target.value);
                                      trigger("branch_name");
                                    }}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.branch_name && (
                                    <span className="invalid">
                                      {errors?.branch_name?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>

                              <Col md="3">
                                <label for="ifsc_code" className="form-label">
                                  IFSC Code
                                  <Required />
                                </label>
                                {/* <input type="text" id="mobile" name="mobile" /> */}
                                <div className="form-control-wrap">
                                  <input
                                    placeholder="Enter IFSC Code"
                                    type="text"
                                    id="ifsc_code"
                                    {...register("ifsc_code", {
                                      required: "IFSC code is required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateIFSC(value) ||
                                          "Enter a valid 11-character IFSC Code (4 letters + 7 digits).",
                                      },
                                    })}
                                    className="form-control"
                                    value={watch("ifsc_code")}
                                    onChange={(e) => {
                                      e.target.value = e.target.value
                                        .replace(/[^a-zA-Z0-9]/g, "")
                                        .toUpperCase()
                                        .slice(0, 11);
                                      setValue("ifsc_code", e.target.value);
                                      trigger("ifsc_code");
                                    }}
                                  />

                                  {errors.ifsc_code && (
                                    <span className="invalid">
                                      {errors?.ifsc_code?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>
                        {/* Yes/No Checkbox */}
                        <Col md="12" className="mt-4">
                          <fieldset>
                            <legend>Additional Information</legend>
                            <Row>
                              <Col md={6}>
                                <div className="form-group">
                                  <Label
                                    className="form-label"
                                    htmlFor="relative_in_alimco"
                                  >
                                    Do you have any relative working : in
                                    ALIMCO? If yes state, the relationship in
                                    detail <Required />
                                  </Label>
                                  <div className="form-control-wrap">
                                    <textarea
                                      id="relative_in_alimco"
                                      className="form-control"
                                      {...register("relative_in_alimco", {
                                        required: "Description is required.",
                                        pattern: {
                                          value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                          message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                        }
                                      })}
                                      onChange={(e)=>{
                                        setValue("relative_in_alimco",e.target.value);
                                        trigger("relative_in_alimco")
                                      }}
                                    />
                                    {errors.relative_in_alimco && (
                                      <span
                                        className="invalid"
                                        style={{
                                          color: "#e85347",
                                          fontSize: "11px",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        {errors.relative_in_alimco.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-group">
                                  <Label
                                    className="form-label"
                                    htmlFor="additionalInfo"
                                  >
                                    Additional Information <Required />
                                  </Label>
                                  <div className="form-control-wrap">
                                    <textarea
                                      id="additionalInfo"
                                      className="form-control"
                                      {...register("additionalInfo", {
                                        required: "Description is required.",
                                        pattern: {
                                          value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                          message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                        }
                                      })}
                                      onChange={(e)=>{
                                        setValue("additionalInfo",e.target.value);
                                        trigger("additionalInfo")
                                      }}
                                    />
                                    {errors.additionalInfo && (
                                      <span
                                        className="invalid"
                                        style={{
                                          color: "#e85347",
                                          fontSize: "11px",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        {errors.additionalInfo.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-group">
                                  <label
                                    // className="form-label"
                                    htmlFor="agreement"
                                  >
                                    Whether you can invest Rs.2.50 lakhs for :
                                    purchase of tools & tackles & Minimum
                                    one-month inventory of spare parts of ALIMCO
                                    Aids & Appliances (Motorized Tricycle/
                                    Motorized Wheelchair, Conventional Tricycle,
                                    Conventional Wheelchair & Hearing Aid) after
                                    getting ALIMCO authorized Service & Repair
                                    Agency (AASRA) ownership? <Required />
                                  </label>
                                  <div className="d-flex align-items-center">
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id="agreementYes"
                                        value="Yes"
                                        className="form-check-input"
                                        {...register("agreement_of_rupee", {
                                          required: "Agreement is required.",
                                        })}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="agreementYes"
                                      >
                                        {" "}
                                        Yes{" "}
                                      </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id="agreement_no"
                                        value="No"
                                        className="form-check-input"
                                        {...register("agreement_of_rupee", {
                                          required: "Agreement is required.",
                                        })}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="agreement_no"
                                      >
                                        {" "}
                                        No{" "}
                                      </label>
                                    </div>
                                  </div>
                                  {errors.agreement_of_rupee && (
                                    <span
                                      className="invalid"
                                      style={{
                                        color: "#e85347",
                                        fontSize: "11px",
                                        fontStyle: "italic",
                                        marginLeft: "10px", // Adjust the margin if needed
                                      }}
                                    >
                                      {errors.agreement_of_rupee.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="form-group">
                                  <label
                                    // className="form-label"
                                    htmlFor="invest_agree"
                                  >
                                    Whether you can invest or have facility of
                                    Hardware like Computer /Laptop, a good
                                    quality Android Phone, online Camera,
                                    Printer, UPS and a high speed internet
                                    connection to carry out online registration
                                    and assessment of Beneficiary under ADIP and
                                    RVY Scheme?
                                    <Required />
                                  </label>
                                  <div className="d-flex align-items-center">
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id="invest_agree"
                                        value="Yes"
                                        className="form-check-input"
                                        {...register("invest_agree", {
                                          required:
                                            "Invest Agreement is required.",
                                        })}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="invest_agree"
                                      >
                                        {" "}
                                        Yes{" "}
                                      </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id="invest_agree_no"
                                        value="No"
                                        className="form-check-input"
                                        {...register("invest_agree", {
                                          required:
                                            "Invest Agreement is required.",
                                        })}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="invest_agree_no"
                                      >
                                        {" "}
                                        No{" "}
                                      </label>
                                    </div>
                                  </div>
                                  {errors.invest_agree && (
                                    <span
                                      className="invalid"
                                      style={{
                                        color: "#e85347",
                                        fontSize: "11px",
                                        fontStyle: "italic",
                                        marginLeft: "10px", // Adjust the margin if needed
                                      }}
                                    >
                                      {errors.invest_agree.message}
                                    </span>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>
                        {/* </>
                        )} */}
                        <Col md="12" className="mt-4">
                          <fieldset>
                            <legend>Self Declaration</legend>
                            <Row>
                              <Col md="3">
                                <div className="form-group">
                                  <label htmlFor="name" className="form-label">
                                    Name <Required />
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter  Name"
                                    {...register("name", {
                                      minLength: {
                                        value: 3,
                                        message:
                                          "Name must be at least 3 characters",
                                      },
                                      required: "Name is required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAlphabetWithSpace(value) ||
                                          "Enter only alphabetic characters.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.name && (
                                    <span className="invalid">
                                      {errors?.name?.message}
                                    </span>
                                  )}
                                </div>
                              </Col>

                              <Col md="3">
                                <div className="form-group">
                                  <label htmlFor="place" className="form-label">
                                    Place <Required />
                                  </label>
                                  <input
                                    type="text"
                                    id="place"
                                    name="place"
                                    className="form-control"
                                    placeholder="Enter Place "
                                    {...register("place", {
                                      required: "Place is required.",
                                      validate: {
                                        isValid: (value) =>
                                          validateAlphabetWithSpace(value) ||
                                          "Enter only alphabetic characters.",
                                      },
                                    })}
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^A-Za-z\s]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  {errors.place && (
                                    <span className="invalid">
                                      {errors.place.message}
                                    </span>
                                  )}
                                </div>
                              </Col>

                              {/* <Col md="3">
                                <div className="form-group">
                                  <label htmlFor="photo">Upload Photo</label>
                                  {
                                    photoImg.length === 0 && (
                                      <div className="form-control-wrap">
                                        <input
                                          type="file"
                                          id="photo"
                                          name="photo"
                                          {...register("photo", {
                                            required: "Photo Image is required.",
                                          })}
                                          className="form-control"
                                          accept=".jpg, .png, .jpeg"
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setPhotoImg,
                                              "photoImg"
                                            )
                                          }
                                        />
                                      </div>
                                    )}

                                  {
                                    photoImg.length > 0 && (
                                      <>
                                        <Button className="my-3" color="primary" size="md" onClick={() => {
                                          setImage(false)
                                          setPhotoImg("")
                                        }}>
                                          Change Image
                                        </Button>
                                      </>
                                    )
                                  }
                                  {photoImg.length > 0 && (
                                    <div className="mt-2">
                                      <img
                                        src={photoImg}
                                        alt="Selected"
                                        style={{
                                          maxWidth: "80px",
                                          maxHeight: "80px",
                                          cursor: "pointer",
                                          marginLeft: "20px",
                                          objectFit: "cover",
                                        }}
                                        onClick={() => handleImageClick(0, photoImg, "Photo")}
                                      />
                                    </div>
                                  )}
                                  {errors.photo && (
                                    <span
                                      className="invalid"
                                     
                                    >
                                      {errors?.photo?.message}
                                    </span>
                                  )}
                                </div>
                              </Col> */}

                              <Col md="3">
                                <div className="form-group">
                                  <Label
                                    htmlFor="default-0"
                                    className="form-label"
                                  >
                                    Photo
                                  </Label>

                                  {shouldShowUploadButton(mode, photoImg) && (
                                    <div className="form-control-wrap">
                                      <div class="file file--upload">
                                        <label
                                          for="photo"
                                          style={{
                                            width: "350px",
                                            marginTop: "0px",
                                          }}
                                        >
                                          <i className="fa fa-upload"></i>Upload
                                        </label>
                                        <input
                                          type="file"
                                          id="photo"
                                          name="photo"
                                          className="form-control"
                                          {...register("photo", {
                                            // required:
                                            //   "Photo Image is required.",
                                            // validate: {
                                            //   size: (value) =>
                                            //     (value[0] &&
                                            //       value[0].size <=
                                            //         2 * 1024 * 1024) ||
                                            //     "File size should be less than 2MB",
                                            //   type: (value) =>
                                            //     (value[0] &&
                                            //       (value[0].type ===
                                            //         "image/jpeg" ||
                                            //         value[0].type ===
                                            //           "image/png" ||
                                            //         value[0].type ===
                                            //           "image/jpg")) ||
                                            //     "Only .jpg, .png, and .jpeg files are allowed",
                                            // },
                                          })}
                                          // className={`form-control ${errors.photo ? "is-invalid" : ""}`}

                                          accept=".jpg, .png, .jpeg"
                                          onChange={(e) => {
                                            handleImageChange(
                                              e,
                                              setPhotoImg,
                                              "photoImg",
                                              "photo"
                                            );
                                          }}
                                        />
                                      </div>
                                      {errors.photo && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.photo?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {getValidImageUrls(photoImg).length > 0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {photoImg.length > 0 && (
                                            <>
                                              <div className="mt-2">
                                                <img
                                                  src={photoImg}
                                                  alt="Selected"
                                                  className="preview-img img-thumbnail"
                                                  onClick={() =>
                                                    handleImageClick(
                                                      0,
                                                      photoImg,
                                                      "Photo"
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setPhotoImg([]); // Clear the image when the "Change Image" button is clicked
                                                  setValue("photoImg", null);
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                              <Col md="3">
                                <div className="form-group">
                                  <Label
                                    htmlFor="default-0"
                                    className="form-label"
                                  >
                                    Signature
                                  </Label>
                                  {shouldShowUploadButton(
                                    mode,
                                    signatureImg
                                  ) && (
                                    <div className="form-control-wrap">
                                      <div class="file file--upload">
                                        <label
                                          for="signature"
                                          style={{
                                            width: "350px",
                                            marginTop: "0px",
                                          }}
                                        >
                                          <i className="fa fa-upload"></i>Upload
                                        </label>
                                        <input
                                          type="file"
                                          id="signature"
                                          name="signature"
                                          className="form-control"
                                          {...register("signature", {
                                            // required:
                                            //   "Signature Image is required.",
                                          })}
                                          accept=".jpg, .png, .jpeg"
                                          onChange={(e) =>
                                            handleImageChange(
                                              e,
                                              setSignatureImg,
                                              "signatureImg",
                                              "signature"
                                            )
                                          }
                                        />
                                      </div>
                                      {errors.signature && (
                                        <span
                                          className="invalid"
                                          style={{
                                            color: "#e85347",
                                            fontSize: "11px",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {errors?.signature?.message}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {getValidImageUrls(signatureImg).length >
                                    0 && (
                                    <Row className="mt-3">
                                      <Col>
                                        <div className="d-flex">
                                          {signatureImg.length > 0 && (
                                            <div className="mt-2">
                                              <img
                                                src={signatureImg}
                                                alt="Selected"
                                                className="preview-img img-thumbnail"
                                                onClick={() =>
                                                  handleImageClick(
                                                    0,
                                                    signatureImg,
                                                    "Signature Image"
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                          {signatureImg.length > 0 && (
                                            <>
                                              <span
                                                className="remove-img mx-2"
                                                onClick={() => {
                                                  setSignatureImg([]);
                                                  setValue(
                                                    "signatureImg",
                                                    null
                                                  );
                                                }}
                                              >
                                                X
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Col>
                      </Row>
                      <Button
                        className="mt-3"
                        type="submit"
                        color="primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              </Form>
            </Col>
          )}
        </Row>
        <MyDataTable
          export
          search="search by state/district/aasra center name/mobile number/address/name/email"
          columns={columns}
          data={data}
          isLoading={isLoading}
          name="Aasra List"
          title="Aasra List"
          fileName={"Aasra List"}
        />
      </Container>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          onDelete={confirmDelete}
          name={rowData?.name}
        />
      )}
      <ModalComponent
        titleName={titleName}
        isOpen={modalOpen}
        toggleModal={toggleModal}
        images={modalImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        handleRemoveImage={handleRemoveImage}
      />
    </>
  );
};

export default AddAasra;
