import moment from "moment";
import { useEffect, useState } from "react";
import { CardHeader } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { districtListAPI, stateListAPI } from "../../api/dropdowns";
import { addBeneficiaryAPI, editBeneficiaryAPI, listCategoryMasterAPI, userRegistrationListAPI } from "../../api/master";
import { createTicket } from "../../api/user";
import Required from "../../Components/MyComponents/Required";
import { ValidateImgPdf } from "../../util/myFunction";
import useLogout from "../../util/useLogout";
import { encrypt } from "../../security/Encrpt";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaFilePdf, FaRegEdit, FaRegImage } from "react-icons/fa";
import ModalComponent from "../../CommonElements/ModalImg/ModalComponent";
import { validateAadhar, validateAlphabetWithSpace, validateEmail, validateINMobile, validateNameWithHyphensSlashDotBracketSpaceNumber, validateTwoDigitDecimal } from "my-field-validator";

const UserRegister = () => {
    const logout = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [DOB, setDOB] = useState(null);
    const [dodDate, setDodDate] = useState(null);
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [campVenueState, setCampVenueState] = useState([]);
    const [campVenueDistrict, setCampVenueDistrict] = useState([]);
    const [gender, setGender] = useState([{ value: 'F', label: "Female" }, { value: 'M', label: "Male" }, { value: 'O', label: "Other" }]);
    const [approvelList, setApprovelList] = useState([{ value: false, label: "Not Approved" }, { value: true, label: "Approved" }]);
    const [productImg, setProductImg] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalImages, setModalImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [titleName, setTitleName] = useState("");
    const [mode, setMode] = useState("Add");
    const [categoryList, setCategoryList] = useState([]);
    const [document, setDocument] = useState(null);
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));
    const base_url = localStorage.getItem("base_url");
    const userType = userDetail?.user_type;
    const userToken = localStorage.getItem("accessToken");
    const [fileType, setFileType] = useState(null);
    const tokenHeader = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${userToken}`,
        },
    };
    const navigate = useNavigate();

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

    const getFileTypeFromUrl = (url) => {
        const fileExtension = url.split(".").pop().split(/#|\?/)[0];
        return fileExtension.toLowerCase();
    };

    const renderContent1 = () => {
        if (!fileType || !productImg) return null;
        const lowerCaseFileType = fileType.toLowerCase();
        if (["png", "jpg", "jpeg", "jfif"].includes(lowerCaseFileType)) {
            return (
                <Button
                    outline
                    color="primary"
                    type="button"
                    onClick={() =>
                        handleImageClick(0, productImg, "Product Image", fileType)
                    }
                    size="sm"
                >
                    <FaRegImage style={{ height: "1rem", width: "1rem" }} />
                </Button>
            );
        } else if (lowerCaseFileType === "pdf") {
            return (
                <Button
                    outline
                    color="danger"
                    type="button"
                    onClick={() =>
                        handleImageClick(0, productImg, "Product Image", fileType)
                    }
                    size="sm"
                >
                    <FaFilePdf style={{ height: "1rem", width: "1rem" }} />
                </Button>
            );
        }
        return null;
    };

    const renderContent = (fileType, fileUrl) => {
        const lowerCaseFileType = fileType.toLowerCase();
        if (["png", "jpg", "jpeg", "jfif"].includes(lowerCaseFileType)) {
            return (
                <>
                    <Button
                        outline
                        id="pdf"
                        color="primary"
                        type="button"
                        onClick={() =>
                            handleImageClick(0, fileUrl, "Product Image", fileType)
                        }
                        size="sm"
                    >
                        <FaRegImage style={{ height: "1rem", width: "1rem" }} />
                    </Button>
                </>
            );
        } else if (lowerCaseFileType === "pdf") {
            return (
                <Button
                    outline
                    id="pdf"
                    color="danger"
                    type="button"
                    onClick={() =>
                        handleImageClick(0, fileUrl, "Product Image", fileType)
                    }
                    size="sm"
                >
                    <FaFilePdf style={{ height: "1rem", width: "1rem" }} />
                </Button>
            );
        }
        return null;
    };

    const columns = [
        ...(userType == "A" || userType == "S"
            ? [
                {
                    name: "Approvel",
                    selector: (row) => (
                        <span
                            className={
                                row?.approvel === true
                                    ? "badge badge-light-success"
                                    : "badge badge-light-warning"
                            }
                        >
                            {row?.approvel === true ? "Approved" : "Not Approved"}
                        </span>
                    ),
                    sortable: true,
                    wrap: true,
                    width: "150px"
                },
            ]
            : []),
        {
            name: "Beneficiary ID",
            selector: (row) => row?.beneficiary_id,
            width: "150px"
        },
        {
            name: "Aadhaar Number",
            selector: (row) => row?.adhaar_no,
            width: "150px"

        },
        {
            name: "UDID",
            selector: (row) => row?.udid,
            width: "180px"
        },
        {
            name: "Mobile No.",
            selector: (row) => row?.mobile_no,
            width: "130px"
        },
        {
            name: "Name",
            selector: (row) => row?.name,
            wrap: true,
            width: "130px"
        },
        {
            name: "Father Name",
            selector: (row) => row?.Fname,
            width: "150px"

        },
        {
            name: "Email",
            selector: (row) => row?.email,
            wrap: true,
            width: "150px"
        },
        {
            name: "DOB",
            selector: (row) => row?.dobDate,
            wrap: true,
            width: "150px"
        },
        {
            name: "Gender",
            selector: (row) => (
                <span
                >
                    {row?.gender == "F" ? "Female" : null}
                    {row?.gender == "M" ? "Male" : null}
                    {row?.gender == "O" ? "Other" : null}
                </span>
            ),
        },
        {
            name: "State",
            selector: (row) => row?.stateLabel,
            wrap: true
        },
        {
            name: "District",
            selector: (row) => row?.districtLabel,
            wrap: true
        },
        {
            name: "Category",
            selector: (row) => row?.categoryLabel,
            wrap: true
        },
        {
            name: "MPC serial no.",
            selector: (row) => row?.mpc_sr_no,
            width: "150px"

        },
        {
            name: "Product Amount",
            selector: (row) => row?.amount,
            width: "150px"

        },
        {
            name: "Product Rate",
            selector: (row) => row?.rate,
            width: "150px"

        },
        {
            name: "Company name",
            selector: (row) => row?.campName,
            width: "150px"

        },
        {
            name: "Company Venue",
            selector: (row) => row?.campVenue,
            width: "150px"

        },
        {
            name: "Date of Distribution",
            selector: (row) => row?.date_of_distribution,
            width: "200px"

        },
        {
            name: "Product Image",
            // cell: (row) => (
            //     <div>
            //         <img
            //             src={`${base_url}/${row.image}`}
            //             alt="Product Image"
            //             style={{ width: 80, height: 40, cursor: "pointer" }}
            //             onClick={() => handleImageClick(0, `${base_url}/${row?.image}`, 'Product Image')}
            //         />
            //     </div>
            // ),
            selector: (row) => {
                const fileUrl = `${base_url}/${row?.image}`;
                const fileType = getFileTypeFromUrl(fileUrl);
                return <div>{renderContent(fileType, fileUrl)}</div>;
            },
        },
        ...(userType == "A" || userType == "S"
            ? [
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
                                disabled={row?.approvel === true}
                            >
                                {" "}
                                <FaRegEdit style={{ height: '.8rem', width: '.8rem' }} />
                            </Button>
                            <ToolTip id={'edit-' + row.id} name={'Edit'} option={'top'} />

                        </div>
                    ),
                },
            ]
            : []),

    ]


    const getCategoryDropdown = () => {
        listCategoryMasterAPI({}, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    const catData = res?.data?.data?.data?.map((item, index) => (
                        {
                            label: item?.category_name,
                            value: item?.id
                        }))
                    setCategoryList(catData);
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

    const userRegistrationlist = () => {
        userRegistrationListAPI({}, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    setData(res.data.data);
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
    const CampstateList = () => {
        stateListAPI({}, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    setCampVenueState(res.data.data.stateData);
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

    useEffect(() => {
        stateList();
        CampstateList();
        getCategoryDropdown();
        userRegistrationlist();
    }, [])

    const handleCamStateChange = (selectedOption) => {
        setValue("campVenueState", selectedOption || "");
        trigger("campVenueState");
        setValue("campVenueDistrict", null);
        const data = {
            id: selectedOption.value,
        };
        // return false
        districtListAPI(data, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    setCampVenueDistrict(res.data.data.cityData);
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

    const handleCamDistrictChange = (selectedOption) => {
        setValue("campVenueDistrict", selectedOption || "");
        trigger("campVenueDistrict");
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

    const handleGenderChange = (selectedOption) => {
        setValue("gender", selectedOption || "");
        trigger("gender");
    };

    const handleCategory = (selectedOption) => {
        setValue("category", selectedOption);
        trigger("category");
    };
    const handleApprovel = (selectedOption) => {
        setValue("approvel", selectedOption);
        trigger("approvel");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            ValidateImgPdf(file, (isValid) => {
                if (isValid) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setProductImg(reader.result);  // Set the image URL for preview
                        setFileType(getFileTypeFromUrl(file.name));  // Set the file type
                    };
                    reader.readAsDataURL(file);  // Convert the file to a base64 URL
                    trigger("fileUpload");
                    clearErrors("fileUpload");
                } else {
                    setError("fileUpload", {
                        type: 'manual',
                        message: 'Invalid file type. Only PNG, JPEG, and PDF files are allowed.'
                    });
                    setProductImg(null);
                    setFileType(null);
                    e.target.value = '';  // Clear the input
                }
            });
        } else {
            setProductImg(null);
            setFileType(null);
        }
    };

    const handleImageClick = (index, image, inputName, fileType) => {
        setCurrentImageIndex(index);
        toggleImageModal();
        setTitleName(inputName);
        setFileType(fileType);
        if (fileType === "pdf") {
            setModalImages([image]); // Here, 'file' could be the URL or Blob of the PDF
        } else {
            setModalImages([image]); // Here, 'file' could be the URL of the image
        }
    };
    const toggleImageModal = () => {
        setModalOpen(true);
    };
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    const handleEdit = (row) => {
        // console.log(row, "editrow");
        setRowData(row);
        window.scrollTo({
            top: 15,
            behavior: "smooth",
        });
        setMode("Edit");
        setValue("id", row?.id)
        setIsOpen(true);
        setValue("beneficiary_id", row?.beneficiary_id);
        setValue("adhaar_no", row?.adhaar_no);
        setValue("udid", row?.udid);
        setValue("name", row?.name);
        setValue("mobile_no", row?.mobile_no);
        setValue("Fname", row?.Fname);
        setValue("email", row?.email);
        if (row?.dobDate) {
            const parsedDate = moment(row?.dobDate, "DD-MMM-YYYY").toDate();
            setDOB(parsedDate);
            setValue("dob", row?.dobDate);
        }
        if (row?.gender) {
            const selectedGender = gender.find(option => option.value === row.gender);
            if (selectedGender) {
                setValue("gender", selectedGender);
            }
        }
        if (row?.approvel === true || row?.approvel === false) {
            const selectedApprovel = approvelList.find(option => option.value === row?.approvel);
            if (selectedApprovel) {
                setValue("approvel", selectedApprovel);
            }
        }
        setValue("state", { label: row?.stateLabel, value: row?.stateLabel });
        setValue("district", { label: row?.districtLabel, value: row.districtLabel });
        setValue("campVenueState", { label: row?.campVenueState, value: row?.campVenueState });
        setValue("campVenueDistrict", { label: row?.campVenueDistrict, value: row.campVenueDistrict });
        setValue("category", { label: row?.categoryLabel, value: row.categoryLabel });
        setValue("mpc_sr_no", row?.mpc_sr_no);
        setValue("product_amount", row?.amount);
        setValue("product_rate", row?.rate);
        setValue("company_name", row?.campName);
        setValue("company_venue", row?.campVenue);
        if (row?.date_of_distribution) {
            const parsedDate = moment(row?.date_of_distribution, "DD-MMM-YYYY").toDate();
            setDodDate(parsedDate);
            setValue("date_of_distribution", row?.date_of_distribution);
        }
        setValue("fileUpload", `${base_url}/${row?.image}`);
        setProductImg(`${base_url}/${row?.image}`)
    }

    const onFormSubmit = async (data) => {
        const token = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + `${userToken}`,
            },
        };
        if (mode === "Add") {
            const encryptedAdhaar = encrypt(data?.adhaar_no);
            const formData = new FormData();
            formData.append("beneficiary_id", data?.beneficiary_id || null);
            formData.append("adhaar_no", encryptedAdhaar || null);
            formData.append("udid", data?.udid || null);
            formData.append("name", data?.name || null);
            formData.append("mobile_no", data?.mobile_no || null);
            formData.append("Fname", data?.Fname || null);
            formData.append("email", data?.email || null);
            formData.append("dobDate", data?.dob);
            formData.append("gender", data?.gender.value || null);
            formData.append("stateValue", data?.state.value || null);
            formData.append("stateLabel", data?.state.label || null);
            formData.append("districtValue", data?.district.value || null);
            formData.append("districtLabel", data?.district.label || null);
            formData.append("categoryValue", data?.category.value || null);
            formData.append("categoryLabel", data?.category.label || null);
            formData.append("mpc_sr_no", data?.mpc_sr_no || null);
            formData.append("product_amount", data?.product_amount || null);
            formData.append("product_rate", data?.product_rate || null);
            formData.append("company_name", data?.company_name || null);
            formData.append("company_venue", data?.company_venue || null);
            formData.append("campVenueState", data?.state.label || null);
            formData.append("campVenueDistrict", data?.district.label || null);
            formData.append("date_of_distribution", data?.date_of_distribution || null);
            formData.append("image", data?.fileUpload[0] || null);
            // console.log("formData", formData);
            // return false
            addBeneficiaryAPI(formData, token)
                .then((res) => {
                    if (res.data.status === "success") {
                        toast.success(res.data.message);
                        setIsLoading(false);
                        setIsOpen(false);
                        reset();
                        userRegistrationlist();
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
        else {
            // console.log(data, "editData");
            // return false
            setIsLoading(true);
            const formDataEdit = new FormData();
            formDataEdit.append("mpc_sr_no", data?.mpc_sr_no);
            formDataEdit.append("id", watch('id'));
            formDataEdit.append("product_amount", data?.product_amount);
            formDataEdit.append("product_rate", data?.product_rate);
            formDataEdit.append("company_name", data?.company_name);
            formDataEdit.append("company_venue", data?.company_venue);
            formDataEdit.append("date_of_distribution", data?.date_of_distribution);
            formDataEdit.append("approvel", data?.approvel.value);
            formDataEdit.append("campVenueState", data?.campVenueState.label);
            formDataEdit.append("campVenueDistrict", data?.campVenueDistrict.label);
            try {
                const response = await editBeneficiaryAPI(formDataEdit, token);
                if (response.data.status === "success") {
                    setIsLoading(false);
                    reset();
                    toast.success(response.data.message);
                    setIsOpen(false);
                    userRegistrationlist();
                } else if (response.data.status == "failed") {
                    setIsLoading(false);
                    toast.error(response.data.message);
                } else if (response.data.status == "expired") {
                    logout(response.data.message);
                }
            } catch (err) {
                console.log(err.message);
            }
        }

    };


    const handleProductSelect = (selectOption) => {
        setSelectedProduct(selectOption);
        setValue("product", selectOption);
        trigger("product");
    };


    const handleOpen = () => {
        setMode("Add")
        setIsOpen(!isOpen);
        reset();
        setProductImg(null);
        setDOB(null);
        setDodDate(null);
    }

    return (
        <>
            <Breadcrumbs
                mainTitle="Add Beneficiary"
                parent="Master"
                title="Add Beneficiary"
            />
            {(userType == "AC") &&
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
                </Row>
            }
            {isOpen && (
                <Container fluid={true}>
                    <Col sm="12">
                        <Form className="" onSubmit={handleSubmit(onFormSubmit)}>
                            <Col sm={12}>
                                <Card>
                                    <CardHeader>
                                        <h5>{mode == "Edit" ? "Update Beneficiary" : "Add Beneficiary"}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            {/* Beneficiary id */}
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <Label htmlFor="beneficiary_id">Beneficiary ID<Required /></Label>
                                                    <Input
                                                        id="beneficiary_id"
                                                        className="form-control"
                                                        name="beneficiary_id"
                                                        placeholder="Beneficiary ID"
                                                        {...register("beneficiary_id", {
                                                            required: "Beneficiary ID is required",
                                                        })}
                                                        value={watch("beneficiary_id")}
                                                        onChange={(e) => {
                                                            setValue("beneficiary_id", e.target.value);
                                                            trigger("beneficiary_id");
                                                        }}
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.beneficiary_id && (
                                                        <span
                                                            className="invalid"
                                                        >
                                                            {errors.beneficiary_id.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* Aadhaar Number */}
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <Label
                                                        htmlFor="adhaar_number"
                                                        className="form-label"
                                                    >
                                                        Aadhaar Number<Required />
                                                    </Label>
                                                    <input
                                                        className="form-control"
                                                        id="adhaar_number"
                                                        type="text"
                                                        placeholder="Enter Aadhaar Number"
                                                        {...register("adhaar_no", {
                                                            required: "Aadhaar Number is  required.",
                                                            // pattern: mode === "Edit" ? null : {
                                                            //     value: /^[2-9]{1}[0-9]{11}$/,
                                                            //     message:
                                                            //         "Aadhaar Number must be a valid 12-digit number",
                                                            // },
                                                            validate: mode === "Edit" ? null : {
                                                                isValid: (value) =>
                                                             validateAadhar(value) || "Aadhaar Number must be a valid 12-digit number.",
                                                            },
                                                        })}
                                                        onChange={(e) => {
                                                            setValue("adhaar_no", e.target.value);
                                                            trigger("adhaar_no");
                                                        }}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value
                                                                .replace(/[^0-9]/g, "")
                                                                .slice(0, 12);
                                                        }}
                                                        value={watch("adhaar_no")}
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.adhaar_no && (
                                                        <span className="invalid">
                                                            {errors?.adhaar_no?.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* Enter UDID */}
                                            <Col sm={4}>
                                                <label className="form-label" htmlFor="udid">
                                                    Enter UDID<Required />
                                                </label>
                                                <Input
                                                    id="udid"
                                                    className="form-control"
                                                    {...register("udid", {
                                                        required: "udid is required",
                                                        pattern: {
                                                            value: /^[A-Z]{2}[0-9]{16}$/,
                                                            message: "Invalid UDID format"
                                                        },
                                                        maxLength: {
                                                            value: 18,
                                                            message: "UDID must be exactly 18 characters long"
                                                        }
                                                    })}
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value
                                                            .replace(/[^a-zA-Z0-9]/g, "")
                                                            .toUpperCase().slice(0, 18);
                                                    }}
                                                    placeholder="Enter your UDID"
                                                    value={watch("udid")}
                                                    onChange={(e) => {
                                                        setValue("udid", e.target.value);
                                                        trigger("udid");
                                                    }}
                                                    disabled={mode === "Edit" ? true : null}
                                                />
                                                {errors.udid && (
                                                    <span
                                                        className="invalid"

                                                    >
                                                        {errors.udid.message}
                                                    </span>
                                                )}
                                            </Col>
                                            {/* Name */}
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label htmlFor="name" className="form-label">Name<Required /></label>
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
                                                                    validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                                                            },
                                                        })}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(
                                                                /[^A-Za-z\s]/g,
                                                                ""
                                                            );
                                                        }}
                                                        onChange={(e) => {
                                                            setValue("name", e.target.value);
                                                            trigger("name");
                                                        }}
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.name && (
                                                        <span className="invalid">
                                                            {errors?.name?.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* MOBILE */}
                                            <Col md="4">
                                                <label htmlFor="mobile" className="form-label">Mobile<Required /></label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        placeholder="Enter Mobile Number"
                                                        type="text"
                                                        id="mobile"
                                                        {...register("mobile_no", {
                                                            required: "Mobile Number is  required.",
                                                            validate: {
                                                                isValid: (value) =>
                                                             validateINMobile(value) || "Enter a valid 10-digit Indian mobile number starting with 6-9",
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
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.mobile_no && (
                                                        <span className="invalid">
                                                            {errors?.mobile_no?.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* Father Name  */}
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label htmlFor="Fname" className="form-label">Father Name <Required /></label>
                                                    <input
                                                        type="text"
                                                        id="Fname"
                                                        name="Fname"
                                                        className="form-control"
                                                        placeholder="Enter  Name"
                                                        {...register("Fname", {
                                                            minLength: {
                                                                value: 3,
                                                                message:
                                                                    "Father Name must be at least 3 characters",
                                                            },
                                                            required: "Father Name is required.",
                                                            validate: {
                                                                isValid: (value) =>
                                                                  validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                                                              },
                                                        })}
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(
                                                                /[^A-Za-z\s]/g,
                                                                ""
                                                            );
                                                        }}
                                                        onChange={(e) => {
                                                            setValue("Fname", e.target.value);
                                                            trigger("Fname");
                                                        }}
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.Fname && (
                                                        <span className="invalid">
                                                            {errors?.Fname?.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* EMAIL */}
                                            <Col md="4">
                                                <label htmlFor="email" className="form-label">Email<Required /></label>

                                                <div className="form-control-wrap">
                                                    <input
                                                        placeholder="Enter Email"
                                                        type="text"
                                                        id="email"
                                                        {...register("email", {
                                                            required: "Email is  required.",
                                                            validate: {
                                                                isValid: (value) =>
                                                                  validateEmail(value) || "Invalid Email.",
                                                              },
                                                        })}
                                                        className="form-control"
                                                        value={watch("email")}
                                                        onChange={(e) => {
                                                            setValue("email", e.target.value);
                                                            trigger("email");
                                                        }}
                                                        disabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.email && (
                                                        <span className="invalid">
                                                            {errors?.email?.message}
                                                        </span>
                                                    )}

                                                </div>
                                            </Col>
                                            {/* DOB */}
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <Label htmlFor="dob" className="form-label">DOB<Required /></Label>
                                                    <DatePicker
                                                        id='dob'
                                                        className="form-control"
                                                        placeholderText="Please Select DOB"
                                                        {...register("dob", {
                                                            required: "DOB Date is required",
                                                        })}
                                                        onChange={(date) => {
                                                            const formattedDate = moment(date).format("DD-MMM-YYYY"); // Format the date here
                                                            setValue("dob", formattedDate);  // Save the formatted date
                                                            setDOB(date);
                                                            trigger("dob");
                                                        }}
                                                        selected={DOB}
                                                        dateFormat="dd/MM/yyyy"
                                                        maxDate={new Date()}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        disabled={mode === "Edit" ? true : null}
                                                    />

                                                    {errors.dob && (
                                                        <p className="invalid">
                                                            {errors.dob.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* Gender */}
                                            <Col md={`4`}>
                                                <div className="form-group">
                                                    <Label htmlFor="gender"className="form-label">
                                                        Gender
                                                        <Required />
                                                    </Label>
                                                    <div className="form-control-wrap">
                                                        <Select
                                                            id="gender"
                                                            options={gender}
                                                            {...register("gender", {
                                                                required: "Please select Gender",
                                                            })}
                                                            onChange={handleGenderChange}
                                                            value={watch("gender")}
                                                            isDisabled={mode === "Edit" ? true : null}
                                                        />
                                                        {errors.gender && (
                                                            <span
                                                                className="invalid"

                                                            >
                                                                {errors.gender.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                            {/* state */}
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <Label className="form-label" htmlFor="state">
                                                        State
                                                        <Required />
                                                    </Label>
                                                    <div className="form-control-wrap">
                                                        <Select
                                                            id="state"
                                                            options={state}
                                                            {...register("state", {
                                                                required: "Please select state",
                                                            })}
                                                            onChange={handleStateChange}
                                                            value={watch("state")}
                                                            isDisabled={mode === "Edit" ? true : null}
                                                        />
                                                        {errors.state && (
                                                            <span
                                                                className="invalid"

                                                            >
                                                                {errors.state.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                            {/* District */}
                                            <Col md={`4`}>
                                                <div className="form-group">
                                                    <Label className="form-label" htmlFor="district">
                                                        District
                                                        <Required />
                                                    </Label>
                                                    <div className="form-control-wrap">
                                                        <Select
                                                            id="district"
                                                            options={district}
                                                            {...register("district", {
                                                                required: "Please select District",
                                                            })}
                                                            onChange={handleDistrictChange}
                                                            value={watch("district")}
                                                            isDisabled={mode === "Edit" ? true : null}
                                                        />
                                                        {errors.district && (
                                                            <span
                                                                className="invalid"

                                                            >
                                                                {errors.district.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                            {/* Product Category */}
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label htmlFor="category"className="form-label">Category<Required /></label>
                                                    <Select
                                                        className="select"
                                                        id="category"
                                                        {...register("category",
                                                            {
                                                                required: "Category is required",
                                                            })}
                                                        options={categoryList}
                                                        placeholder="Select Category"
                                                        value={watch("category")}
                                                        onChange={handleCategory}
                                                        isDisabled={mode === "Edit" ? true : null}
                                                    />
                                                    {errors.category && (
                                                        <p className="invalid">{errors.category.message}</p>
                                                    )}
                                                </div>
                                            </Col>
                                            {/*MPC Serial No */}
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label htmlFor="mpc_sr_no" className="form-label">MPC Serial No <Required /></label>
                                                    <input
                                                        type="text"
                                                        id="mpc_sr_no"
                                                        name="mpc_sr_no"
                                                        className="form-control"
                                                        placeholder="Enter MPC Serial No"
                                                        {...register("mpc_sr_no", {
                                                            required: "MPC Serial No is required.",
                                                        })}
                                                    />
                                                    {errors.mpc_sr_no && (
                                                        <span className="invalid">
                                                            {errors?.mpc_sr_no?.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </Col>
                                            {userType === "AC" ? <></> : (<>
                                                {/*Product Amount */}
                                                <Col md="4">
                                                    <div className="form-group">
                                                        <label htmlFor="product_amount" className="form-label">Product Amount <Required /></label>
                                                        <input
                                                            type="text"
                                                            id="product_amount"
                                                            name="product_amount"
                                                            className="form-control"
                                                            placeholder="Enter Product Amount"
                                                            {...register("product_amount", {
                                                                required: "Product Amount is required.",
                                                                validate: {
                                                                    isValid: (value) =>
                                                                 validateTwoDigitDecimal(value) || "Amount must be a valid number with up to two decimal places",
                                                                },
                                                            })}
                                                            onInput={(e) => {
                                                                e.target.value = e.target.value.replace(
                                                                    /[^0-9.]/g,
                                                                    ""
                                                                );
                                                            }}
                                                            onChange={(e) => {
                                                                setValue("product_amount", e.target.value);
                                                                trigger("product_amount");
                                                            }}
                                                        />
                                                        {errors.product_amount && (
                                                            <span className="invalid">
                                                                {errors?.product_amount?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/*Product Rate */}
                                                <Col md="4">
                                                    <div className="form-group">
                                                        <label htmlFor="product_rate" className="form-label">Product Rate <Required /></label>
                                                        <input
                                                            type="text"
                                                            id="product_rate"
                                                            name="product_rate"
                                                            className="form-control"
                                                            placeholder="Enter Product Rate"
                                                            {...register("product_rate", {
                                                                required: "Product Rate is required.",
                                                                validate: {
                                                                    isValid: (value) =>
                                                                 validateTwoDigitDecimal(value) || "Amount must be a valid number with up to two decimal places",
                                                                },
                                                            })}
                                                            onInput={(e) => {
                                                                e.target.value = e.target.value.replace(
                                                                    /[^0-9.]/g,
                                                                    ""
                                                                );
                                                            }}
                                                            onChange={(e) => {
                                                                setValue("product_rate", e.target.value);
                                                                trigger("product_rate");
                                                            }}
                                                        />
                                                        {errors.product_rate && (
                                                            <span className="invalid">
                                                                {errors?.product_rate?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/*Company Name */}
                                                <Col md="4">
                                                    <div className="form-group">
                                                        <label htmlFor="company_name" className="form-label">Company Name <Required /></label>
                                                        <input
                                                            type="text"
                                                            id="company_name"
                                                            name="company_name"
                                                            className="form-control"
                                                            placeholder="Enter Company Name"
                                                            {...register("company_name", {
                                                                required: "Company Name is required.",
                                                                validate: {
                                                                    isValid: (value) =>
                                                                 validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                                                                },
                                                            })}
                                                            onChange={(e) => {
                                                                setValue("company_name", e.target.value);
                                                                trigger("company_name");
                                                            }}
                                                        />
                                                        {errors.company_name && (
                                                            <span className="invalid">
                                                                {errors?.company_name?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                                {/*Company Venue */}
                                                <Col md="4">
                                                    <div className="form-group">
                                                        <label htmlFor="company_venue" className="form-label">Company Venue <Required /></label>
                                                        <input
                                                            type="text"
                                                            id="company_venue"
                                                            name="company_venue"
                                                            className="form-control"
                                                            placeholder="Enter Company Venue"
                                                            {...register("company_venue", {
                                                                required: "Company Venue is required.",
                                                                validate: {
                                                                    isValid: (value) =>
                                                                      validateNameWithHyphensSlashDotBracketSpaceNumber(value) || "Only alphanumeric characters and  , . / - _( ) are allowed.",
                                                                  },
                                                            })}
                                                            onChange={(e) => {
                                                                setValue("company_venue", e.target.value);
                                                                trigger("company_venue");
                                                            }}
                                                        />
                                                        {errors.company_venue && (
                                                            <span className="invalid">
                                                                {errors?.company_venue?.message}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Col>
                                            </>
                                            )}
                                            {mode === "Edit" && (
                                                <>
                                                    {/*Campany state */}
                                                    < Col md={4}>
                                                        <div className="form-group">
                                                            <Label className="form-label" htmlFor="campVenueState">
                                                                Campany Venue State
                                                                <Required />
                                                            </Label>
                                                            <div className="form-control-wrap">
                                                                <Select
                                                                    className=""
                                                                    id="campVenueState"
                                                                    options={campVenueState}
                                                                    {...register("campVenueState", {
                                                                        required: "Please select Campany State",
                                                                    })}
                                                                    onChange={handleCamStateChange}
                                                                    value={watch("campVenueState")}

                                                                />
                                                                {errors.campVenueState && (
                                                                    <span
                                                                        className="invalid"

                                                                    >
                                                                        {errors.campVenueState.message}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    {/*Campany District */}
                                                    <Col md={`4`}>
                                                        <div className="form-group">
                                                            <Label className="form-label" htmlFor="campVenueDistrict">
                                                                Campany Venue District
                                                                <Required />
                                                            </Label>
                                                            <div className="form-control-wrap">
                                                                <Select
                                                                    className=""
                                                                    id="campVenueDistrict"
                                                                    options={campVenueDistrict}
                                                                    {...register("campVenueDistrict", {
                                                                        required: "Please select Campany District",
                                                                    })}
                                                                    onChange={handleCamDistrictChange}
                                                                    value={watch("campVenueDistrict")}
                                                                // isDisabled={mode === "Edit" ? true : null}
                                                                />
                                                                {errors.campVenueDistrict && (
                                                                    <span
                                                                        className="invalid"

                                                                    >
                                                                        {errors.campVenueDistrict.message}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </>
                                            )}


                                            {/* Date of Distribution */}
                                            <Col md={4}>
                                                <div className="form-group">
                                                    <Label htmlFor="date_of_distribution" className="form-label">Date of Distribution<Required /></Label>
                                                    <DatePicker
                                                        id='date_of_distribution'
                                                        className="form-control"
                                                        placeholderText="Please Select Distribution Date"
                                                        {...register("date_of_distribution", {
                                                            required: "Date of distribution is required",
                                                        })}
                                                        onChange={(date) => {
                                                            const formattedDate = moment(date).format("DD-MMM-YYYY"); // Format the date here
                                                            setValue("date_of_distribution", formattedDate);  // Save the formatted date
                                                            setDodDate(date);
                                                            trigger("date_of_distribution");
                                                        }}
                                                        selected={dodDate}
                                                        dateFormat="dd/MM/yyyy"
                                                        minDate={moment().subtract(6, "months").toDate()}  // Enable last 6 months
                                                        maxDate={new Date()}  // Disable future dates
                                                        showMonthDropdown
                                                        showYearDropdown
                                                    />

                                                    {errors.date_of_distribution && (
                                                        <p className="invalid">
                                                            {errors.date_of_distribution.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </Col>
                                            {/* Approved */}
                                            {mode === "Edit" && (
                                                <Col md="4">
                                                    <div className="form-group">
                                                        <label htmlFor="approvel" className="form-label">Approvel<Required /></label>
                                                        <Select
                                                            className="select"
                                                            id="approvel"
                                                            {...register("approvel",
                                                                {
                                                                    required: "Approvel is required",
                                                                })}
                                                            options={approvelList}
                                                            placeholder="Select Approvel"
                                                            value={watch("approvel")}
                                                            onChange={handleApprovel}
                                                        />
                                                        {errors.approvel && (
                                                            <p className="invalid">{errors.approvel.message}</p>
                                                        )}
                                                    </div>
                                                </Col>
                                            )}
                                            {/*Product Image */}
                                            <Col md="4">
                                                <div className="form-group">
                                                    <label className="form-label" htmlFor="fileUpload">
                                                        Product Image (Image or PDF) <Required />
                                                    </label>

                                                    {mode === "Edit" ? null : <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        className="form-control"
                                                        id="fileUpload"
                                                        {...register("fileUpload", {
                                                            required: mode === "Edit" ? false : "Image file is required",
                                                        })}
                                                        onChange={handleImageChange}
                                                    />}
                                                    {errors.fileUpload && (
                                                        <span
                                                            className="invalid"
                                                        >
                                                            {errors.fileUpload.message}
                                                        </span>
                                                    )}
                                                </div>
                                                {productImg &&
                                                    <Row className="mt-3">
                                                        <Col>
                                                            <div className="d-flex">
                                                                {productImg && (
                                                                    <div>
                                                                        {renderContent1(getFileTypeFromUrl(productImg), productImg)}
                                                                    </div>
                                                                )}
                                                                {productImg && (
                                                                    <>
                                                                        {mode === "Edit" ? null :
                                                                            <span
                                                                                className="remove-img mx-2"
                                                                                onClick={() => {
                                                                                    setProductImg(null);
                                                                                    setValue("fileUpload", null);
                                                                                }}
                                                                            >
                                                                                X
                                                                            </span>}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                }
                                            </Col>
                                            <Row>
                                                <Col md="2" className={`mt-3`}>
                                                    <div
                                                        className="form-group"
                                                        style={{ verticalAlign: "bottom" }}
                                                    >
                                                        {(mode === "Edit" && (rowData?.approvel === true)) ? null :
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
                                                        }


                                                    </div>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Form>

                    </Col >
                </Container >
            )}
            <MyDataTable
                search="search by beneficiary id/udid/mobile no/name/email"
                columns={columns}
                data={data}
                isLoading={isLoading}
                name="Beneficiary List"
                title="Beneficiary List"
                fileName={"Beneficiary List"}
            />
            <ModalComponent
                fileType={fileType}
                titleName={titleName}
                isOpen={modalOpen}
                toggleModal={toggleModal}
                images={modalImages}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
            />
        </>
    )
}

export default UserRegister;