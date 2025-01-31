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
  Row,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import {
  createSparePartMasterAPI,
  deleteSparePartMasterAPI,
  listCategoryMasterAPI,
  listSparePartMasterAPI,
  listUOMListAPI,
  updateSparePartMasterAPI,
} from "../../api/master";
import CryptoJS from 'crypto-js';
import img from "../../assets/images/appointment/app-ent.jpg";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { toCamelCase, ValidateImg } from "../../util/myFunction";
import useLogout from "../../util/useLogout";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { decrypt, encrypt } from "../../security/Encrpt";
import { SECRET_KEY } from "../../Constant/MyConstants";
import Required from "../../Components/MyComponents/Required";
import { validateAlphabetWithSpace, validateNameWithHyphensSlashDotBracketSpaceNumber, validateTwoDigitDecimal } from "my-field-validator";

const SpareParts = () => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [changeImg, setChangeImg] = useState(false);
  const [mode, setMode] = useState("Add");
  const [categoryList, setCategoryList] = useState([]);
  const [typeList, setTypeList] = useState([{ value: "rtu", label: "RTU" }]);

  const [uomList, setUomList] = useState([]);
  const base_url = localStorage.getItem("base_url");
  const [tableData, setTableData] = useState([
  ]);
  const [rowData, setRowData] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();

  const [previewImage, setPreviewImage] = useState(null);
  const image = watch("image");
  // useEffect(() => {
  //   if (image && image.length > 0) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result);
  //     };
  //     reader.readAsDataURL(image[0]);
  //   }
  // }, [image]);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result);
  //       trigger("image");
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setPreviewImage("");
  //   }
  // };

  const handleImageChange = (e, errorInput) => {
    const file = e.target.files[0];

    if (file) {
      ValidateImg(file, (isValid) => {
        if (isValid) {
          // Process the valid image
          setPreviewImage(file);
          trigger("image");
          clearErrors(errorInput);
        } else {
          // Handle the invalid file type
          setError(errorInput, {
            type: "manual",
            message:
              "Invalid file type. Only PNG, JPEG, and JPG files are allowed.",
          });
          console.error("Invalid file type. Only PNG, JPEG, and JPG files are allowed.");
          e.target.value = '';  // Clear the input
        }
      });
    } else {
      setPreviewImage("");
    }

    // setPreviewImage(file);
    // trigger("image");
  };

  const columns = [
    {
      name: "Type",
      selector: (row) => row?.type,
      sortable: true,
      width: "120px"
    },
    {
      name: "HSN Code",
      selector: (row) => row.hsn_code,
      sortable: true,
      wrap: true
    },
    {
      name: "Made By",
      selector: (row) => row.made_by,
      sortable: true,
      wrap: true
    },
    {
      name: "Part No.",
      selector: (row) => row.part_number,
      sortable: true,
    },
    {
      name: "Part Name",
      selector: (row) => toCamelCase(row.part_name),
      sortable: true,
      wrap: true,
      width: "120px"
    },
    {
      name: "Category",
      selector: (row) => toCamelCase(row.category || ""),
      sortable: true,
      wrap: true,
    },
    {
      name: "UOM",
      selector: (row) => toCamelCase(row.uom_name),
      sortable: true,
      wrap: true,
      width: "80px"
    },
    {
      name: "Manufacturer",
      selector: (row) => toCamelCase(row.manufacturer),
      sortable: true,
      width: "120px"
    },
    {
      name: "Base Price",
      selector: (row) => row.base_price,
      sortable: true,
      width: "115px"
    },
    {
      name: "GST",
      selector: (row) => row.gst,
      sortable: true,
      width: "80px"
    },
    {
      name: "Unit Price",
      selector: (row) => row.unit_price,
      sortable: true,
    },

    // {
    //   name: "Reorder Point",
    //   selector: (row) => row.reorder_point,
    //   sortable: true,
    // },
    // {
    //   name: "Quantity in Stock",
    //   selector: (row) => row.quantity_in_stock,
    //   sortable: true,
    // },
    // {
    //   name: "Max Stock Level",
    //   selector: (row) => row.max_stock_level,
    //   sortable: true,
    // },

    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <div>
          <img
            src={`${base_url}/${row.image}`}
            // src={`${row.image}`}
            alt="image"
            style={{ width: 80, height: 40 }}
          />
        </div>
      ),
    },

    {
      name: "Action",
      cell: (row) => (
        <div>
          <Button
            id={'edit-' + row.id}
            outline
            color={`warning`}
            size={`xs`}
            className={`me-2`}
            onClick={() => handleEdit(row)}
            style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
          >
            {" "}
            <FaRegEdit style={{ height: '.8rem', width: '.8rem' }} />
          </Button>
          <ToolTip id={'edit-' + row.id} name={'Edit'} option={'top'} />
          {/* <Button
            outline
            id={'delete-'+row.id}
            color={`danger`}
            size={`xs`}
            onClick={() => handleDelete(row)}
            style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
          >
            {" "}
            <FaRegTrashCan style={{ height: '.8rem', width: '.8rem' }} />
          </Button>
          <ToolTip id={'delete-'+row.id} name={'Delete'} option={'top'} /> */}
        </div>
      ),
    },
  ];
  const handleType = (selectedOption) => {
    setValue("type", selectedOption || null);
    trigger("type");
  };
  const handleCategory = (selectedOption) => {
    setValue("category_name", selectedOption);
    trigger("category_name");
  };
  const handleUom = (selectedOption) => {
    setValue("uom", selectedOption);
    trigger("uom");
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };
  const listCategory = () => {
    listCategoryMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          let a = res.data.data.data.map((item) => ({
            value: item.id,
            label: item.category_name,
          }));
          setCategoryList(a);
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
  const listUom = () => {
    listUOMListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          let a = res.data.data.data.map((item) => ({
            value: item.value,
            label: item.label,
          }));
          setUomList(a);
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
  const listSparePart = () => {
    listSparePartMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data?.data?.data);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  useEffect(() => {
    listSparePart();
    listCategory();
    listUom();
  }, []);
  const handleInput = (field) => (e) => {
    e.preventDefault();
    setValue(field, e.target.value);
    trigger(field);

  };
  const handleOpen = () => {
    setIsOpen(!isOpen);
    reset();
    setChangeImg(false);
    setPreviewImage("");
  };
  const handleDelete = (row) => {
    setRowData(row);
    toggleDeleteModal();
  };
  const confirmDelete = () => {
    const bodyData = {
      id: rowData.id,
    };
    deleteSparePartMasterAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          // toast.success(res.data.message);
          listSparePart();
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
      top: 0,
      behavior: "smooth",
    });
    setPreviewImage(row.image);
    setValue("id", row?.id);
    setMode("Edit");
    setIsOpen(true);
    setChangeImg(true);
    setRowData(row);
    setValue("status", {
      value: row.status === true ? true : false,
      label: row.status === true ? "Active" : "InActive",
    });
    setValue("category_name", { value: row.category_id, label: row.category });
    setValue("type", { value: row.type, label: row.label });
    setValue("uom", { value: row.uom_value, label: row.uom_name });
    setValue("hsn_code", row.hsn_code);
    setValue("serial_no", row.serial_no);
    setValue("made_by", row.made_by);
    setValue("base_price", row.base_price);
    setValue("gst", row.gst);
    setValue("part_number", row.part_number);
    setValue("part_name", row.part_name);
    setValue("manufacturer", row.manufacturer);
    setValue("Unit_price", row.unit_price);
    setValue("reorder_point", row.reorder_point);
    setValue("stock", row.quantity_in_stock);
    setValue("max_stock_level", row.max_stock_level);
    setValue("description", row.description);
    setValue("image", row.image);
    const a = `${base_url}/${row.image}`;
    setPreviewImage(a);
  };



  // Encrypting with a random IV
  function encryptWithIV(plaintext) {
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random 16-byte IV
    const key = SECRET_KEY;

    // Encrypt with the IV and key
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv
    });
    // Combine the IV with the encrypted ciphertext (store both for decryption)
    const ivCiphertext = iv.toString() + ':' + encrypted.toString();
    return ivCiphertext;
  }


  const onFormSubmit = (data) => {
    setIsLoading(true);
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
    const zero = {
      id: data?.id,
      key: myKey
    }
    if (mode == "Edit") {
      const EditformData = new FormData();
      EditformData.append("id", encrypt(zero));
      EditformData.append("hsn_code", data?.hsn_code);
      EditformData.append("type", data?.type?.value || null);
      EditformData.append("serial_no", data?.serial_no);
      EditformData.append("made_by", data?.made_by);
      EditformData.append("base_price", data?.base_price);
      EditformData.append("gst", data?.gst);
      EditformData.append("part_number", data?.part_number);
      EditformData.append("part_name", data?.part_name);
      EditformData.append("manufacturer", data?.manufacturer);
      EditformData.append("category", data?.category_name?.value);
      EditformData.append("uom_id", data?.uom?.value);
      EditformData.append("unit_price", data?.Unit_price);
      EditformData.append("description", data?.description);
      EditformData.append("image", changeImg ? watch("image") : data?.image[0]);
      updateSparePartMasterAPI(EditformData, token)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            listSparePart();
            setPreviewImage(null);
            setMode("Add");
            handleOpen();
            reset();
            toast.success(res.data.message);
            setIsLoading(false);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const formData = new FormData();
      formData.append("hsn_code", data?.hsn_code);
      formData.append("type_value", data?.type?.value || null);
      formData.append("type_label", data?.type?.label || null);
      formData.append("serial_no", data?.serial_no);
      formData.append("made_by", data?.made_by);
      formData.append("base_price", data?.base_price);
      formData.append("gst", data?.gst);
      formData.append("part_number", data?.part_number);
      formData.append("part_name", data?.part_name);
      formData.append("manufacturer", data?.manufacturer);
      formData.append("category", data?.category_name?.value);
      formData.append("uom_id", data?.uom?.value || null);
      formData.append("unit_price", data?.Unit_price);
      formData.append("description", data?.description);
      formData.append("image", data?.image[0]);

      createSparePartMasterAPI(formData, token)
        .then((res) => {
          if (res.data.status === "success") {
            listSparePart();
            setPreviewImage(null);
            handleOpen();
            reset();
            setIsLoading(false);
            toast.success(res.data.message);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  };

  const handleRemoveImage = (index) => {
    setPreviewImage("");
    document.getElementById("image").value = null;
  };
  const basePrice = watch("base_price");
  const gst = watch("gst");

  useEffect(() => {
    if (basePrice && gst) {
      const base = parseFloat(basePrice);
      const gstAmount = (base * parseFloat(gst)) / 100;
      const calculatedUnitPrice = base + gstAmount;
      setValue("Unit_price", calculatedUnitPrice.toFixed(4));
      trigger("Unit_price");
    }
  }, [basePrice, gst, setValue]);

  return (
    <>
      <Breadcrumbs
        mainTitle="Spare Parts"
        parent="Master"
        title="Spare Parts"
      />
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
                      <h5>{"Add Spare Part"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="type">
                            Type
                          </label>
                          <Select
                            className="select"
                            id="type"
                            {...register("type", {
                              // required: "Type is required",
                            })}
                            options={typeList}
                            placeholder={"Select Type"}
                            value={watch(`ty
                              pe`)}
                            onChange={handleType}
                          />
                          {errors.type && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.type.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="serial_no">
                            Serial Number <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="serial_no"
                            type="text"
                            placeholder="Enter Serial Number"
                            {...register("serial_no", {
                              required: "Serial Number is required",
                              pattern: {
                                value: /^[0-9]*$/,
                                message: "Serial number must be in digits.",
                              },
                            })}
                            value={watch(`serial_no`)}
                            onChange={handleInput("serial_no")}
                          />
                          {errors.serial_no && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.serial_no.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="hsn_code">
                            HSN Code <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="hsn_code"
                            type="text"
                            placeholder="Enter Part Name"
                            {...register("hsn_code", {
                              required: "HSN Code is required.",
                              pattern: {
                                value: /^[0-9]*$/,
                                message: "HSN code must be in digits.",
                              },
                            })}
                            value={watch(`hsn_code`)}
                            onChange={handleInput("hsn_code")}
                          />
                          {errors.hsn_code && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.hsn_code.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="made_by">
                            Made By <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="made_by"
                            type="text"
                            placeholder="Enter Made By"
                            {...register("made_by", {
                              required: "Made By is required.",
                              pattern: {
                                value: /^[A-Za-z\s_-]+$/,
                                message: "Made by must be  Alphabets.",
                              },
                              validate: {
                                isValid: (value) =>
                                  validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                            },
                            })}
                            value={watch(`made_by`)}
                            onChange={handleInput("made_by")}
                          />
                          {errors.made_by && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.made_by.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="part_name">
                            Part Name <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="part_name"
                            type="text"
                            placeholder="Enter Part Name"
                            {...register("part_name", {
                              required: "Part Name is required.",
                            //   validate: {
                            //     isValid: (value) =>
                            //       validateNameWithHyphensSlashDotBracketSpaceNumber(value) || "Only AlphaNumeric are allowed with , . / ()",
                            // },
                            })}
                            value={watch(`part_name`)}
                            onChange={handleInput("part_name")}
                          />
                          {errors.part_name && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.part_name.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="part_number">
                            Part Number <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="part_number"
                            type="text"
                            placeholder="Enter Part Number"
                            {...register("part_number", {
                              required: "Part Number is required.",
                              // pattern: {
                              //   value: /^[a-zA-Z\s\d-/.()&]+$/,
                              //   message: "Part Number must be Alpha-numeric.",
                              // },
                            })}
                            value={watch(`part_number`)}
                            onChange={handleInput("part_number")}
                          />
                          {errors.part_number && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.part_number.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="uom">
                            Unit Of Measurement <Required/>
                          </label>
                          <Select
                            className="select"
                            id="uom"
                            {...register("uom", {
                              required: "Unit Of Measurement is required.",
                            })}
                            options={uomList}
                            placeholder={"Select category"}
                            value={watch(`uom`)}
                            onChange={handleUom}
                          />
                          {errors.uom && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.uom.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="category_name">
                            Category <Required/>
                          </label>
                          <Select
                            className="select"
                            id="category_name"
                            {...register("category_name", {
                              required: "Category is required",
                            })}
                            options={categoryList}
                            placeholder={"Select category"}
                            value={watch(`category_name`)}
                            onChange={handleCategory}
                          />
                          {errors.category_name && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.category_name.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="manufacturer">
                            Manufacturer <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="manufacturer"
                            type="text"
                            placeholder="Enter Manufacturer"
                            {...register("manufacturer", {
                              required: "Manufacturer is required.",
                              pattern: {
                                value: /^[a-zA-Z]*$/,
                                message: "Manufacturer must be in Alphabets.",
                              },
                            })}
                            // value={watch(`manufacturer`)}
                            value="Alimco"
                            onChange={handleInput("manufacturer")}
                          />
                          {errors.manufacturer && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.manufacturer.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="base_price">
                            Base Price <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="base_price"
                            type="text"
                            placeholder="Enter Base Price"
                            {...register("base_price", {
                              required: "Base Price is required.",
                              pattern: {
                                value: /^[0-9]*\.?[0-9]{0,4}$/, // Updated to allow up to two decimal places
                                message:
                                  "Amount must be a valid number with up to four decimal places",
                            },
                            })}
                            value={watch(`base_price`)}
                            onChange={handleInput("base_price")}
                          />
                          {errors.base_price && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.base_price.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="gst">
                            GST <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="gst"
                            type="text"
                            placeholder="Enter GST "
                            {...register("gst", {
                              required: "GST percent is required",
                              pattern: {
                                value: /^([1-9]|[1-9][0-9]|100)(\.\d{1,2})?$/,
                                message:
                                  "GST Percent shouldn't greater than 100 & 2 digits after decimal.",
                              },
                              min: {
                                value: 0,
                                message: "Value must be between 1 and 100.",
                              },
                              max: {
                                value: 100.0,
                                message: "Value must be between 1 and 100.",
                              },
                            })}
                            value={watch(`gst`)}
                            onChange={handleInput("gst")}
                          />
                          {errors.gst && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.gst.message}
                            </span>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="Unit_price">
                            Unit Price <Required/>
                          </label>
                          <input
                            className="form-control"
                            id="Unit_price"
                            type="text"
                            placeholder="Enter Unit Price"
                            {...register("Unit_price", {
                              required: "Unit Price is required.",
                              pattern: {
                                value: /^[0-9]*\.?[0-9]{0,4}$/, // Updated to allow up to two decimal places
                                message:
                                  "Amount must be a valid number with up to four decimal places",
                            },
                            })}
                            disabled
                            value={watch(`Unit_price`)}
                            onChange={handleInput("Unit_price")}
                          />
                          {errors.Unit_price && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.Unit_price.message}
                            </span>
                          )}
                        </div>

                        {/* <div className="col-md-4">
                          <label className="form-label" htmlFor="stock">
                            Quantity in Stock
                          </label>
                          <input
                            className="form-control"
                            id="stock"
                            type="number"
                            placeholder="Enter Quantity in stock"
                            {...register("stock", {
                              required: "Quantity in Stock is required",
                              pattern: {
                                value: /^[0-9]*$/,
                                message:
                                  "Quantity in Stock must be a digit number",
                              },
                            })}
                            value={watch(`stock`)}
                            onChange={handleInput("stock")}
                          />
                          {errors.stock && (
                            <p className="text-danger">{errors.stock.message}</p>
                          )}
                        </div>
                        <div className="col-md-4">
                          <label className="form-label" htmlFor="reorder_point">
                            Reorder Point
                          </label>
                          <input
                            className="form-control"
                            id="reorder_point"
                            type="number"
                            placeholder="Enter Reorder Point"
                            {...register("reorder_point", {
                              required: "Reorder reorder_point required",
                              pattern: {
                                value: /^[0-9]*$/,
                                message:
                                  "Reorder Points must be a digit number",
                              },
                            })}
                            value={watch(`reorder_point`)}
                            onChange={handleInput("reorder_point")}
                          />
                          {errors.reorder_point && (
                            <p className="text-danger">
                              {errors.reorder_point.message}
                            </p>
                          )}
                        </div>  */}
                        {/* <div className="col-md-4">
                          <label className="form-label" htmlFor="max_stock_level">
                            Max Stock Level
                          </label>
                          <input
                            className="form-control"
                            id="max_stock_level"
                            type="text"
                            placeholder="Enter Max Stock Level"
                            {...register("max_stock_level", {
                              required: "Max Stock Level points required",
                              pattern: {
                                value: /^[a-zA-Z0-9]*$/,
                                message:
                                  "Max stock level must be Alpha-numeric",
                              },
                            })}
                            value={watch(`max_stock_level`)}
                            onChange={handleInput("max_stock_level")}
                          />
                          {errors.max_stock_level && (
                            <p className="text-danger">
                              {errors.max_stock_level.message}
                            </p>
                          )}
                        </div> */}
                        {!changeImg && (
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="image">
                              Image URL <Required/>
                            </label>
                            <input
                              className="form-control"
                              id="image"
                              type="file"
                              {...register("image", {
                                required: "Image file is required",
                              })}
                              accept=".jpg, .png, .jpeg"
                              onChange={(e) => {
                                handleImageChange(
                                  e,
                                  "image"
                                );
                              }}
                            />
                            {errors.image && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {errors.image.message}
                              </span>
                            )}
                          </div>
                        )}
                        {changeImg && (
                          <>
                            <div className="col-md-3" style={{ marginTop: "35px" }} >
                              <Button
                                color="primary"
                                size="md"
                                onClick={() => {
                                  setChangeImg(false);
                                  setPreviewImage("");
                                }}
                              >
                                Change Image
                              </Button>
                            </div>
                          </>
                        )}
                        {/* <div className="col-md-3">
                          {previewImage && (
                            <>
                              {!changeImg && (
                                <span className="mx-2" onClick={handleRemoveImage} style={{ cursor: "pointer" }}>
                                  x
                                </span>
                              )}
                              <img
                                src={previewImage}
                                alt="selected-image"
                                style={{
                                  maxWidth: "80px",
                                  maxHeight: "80px",
                                  marginLeft: "20px",
                                  objectFit: "cover",
                                }}
                              />
                            </>
                          )}
                        </div> */}
                        <div className="col-12">
                          <label className="form-label" htmlFor="description">
                            Description <Required/>
                          </label>
                          <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            {...register("description", {
                              required: "description is required",
                            //   validate: {
                            //     isValid: (value) =>
                            //       validateNameWithHyphensSlashDotBracketSpaceNumber(value) || "Only AlphaNumeric are allowed with , . / () .",
                            // },
                            })}
                            value={watch(`description`)}
                            onChange={handleInput("description")}
                          ></textarea>
                          {errors.description && (
                            <span
                              className="invalid"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errors.description.message}
                            </span>
                          )}
                        </div>

                        <Row>
                          <Col md="2" className={`mt-3`}>
                            <div
                              className="form-group"
                              style={{ verticalAlign: "bottom" }}
                            >
                              <Button color="primary" size="md">
                                Submit
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Form>
            </Col>
          )}
        </Row>
        <MyDataTable
          search="search by serial number/HSN code/part name/part number/manufacturer/category name/type "
          export
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          name="Spare Part"
          title="Spare Part"
          fileName="Spare Part List"
        />
      </Container>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          onDelete={confirmDelete}
          name={rowData?.part_number}
        />
      )}
    </>
  );
};

export default SpareParts;
