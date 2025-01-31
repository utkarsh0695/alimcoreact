import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import Select from "react-select";
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
} from "reactstrap";
import { Breadcrumbs } from '../../AbstractElements';
import ModalComponent from '../../CommonElements/ModalImg/ModalComponent';
const ViewAasraDetails = () => {

    const base_url = localStorage.getItem("base_url");
    const location = useLocation();

    const row = location?.state?.row;
    useEffect(() => {
        const row = location?.state?.row;
        // console.log(row, "details-----")
        setValue("id", row?.id)
        setValue("state", { label: row.stateData.name, value: row.stateData.id });
        setValue("district", { label: row.city.city, value: row.city.id });
        setValue("state", row.stateData.name);
        setValue("district", row.city.city);
        setValue("dd_number", row.dd_number);
        setValue("dd_bank", row.dd_bank);
        setValue("amount", row.amount);
        setValue("address", row.address);
        setValue("pin", row.pin);
        setValue("telephone_no", row.telephone_no);
        setValue("mobile_no", row.mobile_no);
        setValue("email", row.email);
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
        setPhotoImg(`${base_url}${row?.document?.[0]?.photoImg}`);
        setMarketSurvey(`${base_url}${row?.document?.[0]?.marketImg}`);
        setSales(`${base_url}${row?.document?.[0]?.salesImg}`);
        setAdhaarImgs(`${base_url}/${row?.document?.[0]?.adhaarImg}`);
        setAreaSqftImgs(`${base_url}${row?.document?.[0]?.areaImgs}`);
        setRegImgs(`${base_url}${row?.document?.[0]?.regImg}`);
        setPanImgs(`${base_url}${row?.document?.[0]?.panImg}`);
        setSignatureImg(`${base_url}${row?.document?.[0]?.signatureImg}`);
    }, []);
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
    const [panImgs, setPanImgs] = useState([]);
    const [adhaarImgs, setAdhaarImgs] = useState([]);
    const [areaSqftImgs, setAreaSqftImgs] = useState([]);
    const [regImgs, setRegImgs] = useState([]);
    const [marketSurvey, setMarketSurvey] = useState([]);
    const [sales, setSales] = useState([]);
    const [photoImg, setPhotoImg] = useState([]);
    const [signatureImg, setSignatureImg] = useState([]);
    const [modalImages, setModalImages] = useState([])
    const [titleName, setTitleName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageClick = (index, image, inputName) => {
        setCurrentImageIndex(index);
        setModalImages([image])
        toggleImageModal();
        setTitleName(inputName)
    };
    const toggleImageModal = () => {
        setModalOpen(true);
    };
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    return (
        <>
            <Breadcrumbs mainTitle="View Aasra" parent="View Aasra" title="View Aasra" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Form >
                            <Col sm="12">
                                <Card>
                                    <CardHeader>
                                        <h5>{"View Aasra"}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col md={2}>
                                                <div className="form-group">
                                                    <Label className="from-label" htmlFor="state">
                                                        State
                                                    </Label>
                                                    <div className="form-control-wrap">
                                                        {/* <Select
                                                            className=""
                                                            id="state"
                                                            {...register("state")}
                                                            value={watch("state")}
                                                            isDisabled
                                                        /> */}
                                                        <span className="form-control">
                                                            {watch("state")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={`2`}>
                                                <div className="form-group">
                                                    <Label className="from-label" htmlFor="district">
                                                        District
                                                    </Label>
                                                    <div className="form-control-wrap">
                                                        <span className="form-control">
                                                            {watch("district")}
                                                        </span>
                                                        {/* <Select
                                                            className=""
                                                            id="district"
                                                            {...register("district")}
                                                            value={watch("district")}
                                                            isDisabled
                                                        /> */}

                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md="12" className="mt-5">
                                                <fieldset>
                                                    <legend>Application Fee Details</legend>
                                                    <Row>
                                                        <Col md="3">
                                                            <label for="bank-name">DD Number:</label>

                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter dd-number"
                                                                    type="text"
                                                                    id="dd-number"
                                                                    {...register("dd_number")}
                                                                    className="form-control"
                                                                    value={watch("dd_number")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <label for="bank">Bank:</label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Bank "
                                                                    type="text"
                                                                    id="dd_bank"
                                                                    {...register("dd_bank")}
                                                                    className="form-control"
                                                                    value={watch("dd_bank")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <label for="amount">Amount:</label>
                                                            <div className="form-control-wrap">

                                                                <input
                                                                    placeholder="Enter Amount"
                                                                    type="text"
                                                                    id="amount"
                                                                    {...register("amount")}
                                                                    className="form-control"
                                                                    value={watch("amount")}
                                                                    readOnly
                                                                />



                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </fieldset>
                                            </Col>
                                            <Col md="12" className="mt-4">
                                                <fieldset>
                                                    <legend>Aasra Site Details</legend>
                                                    <Row>
                                                        <Col md="2">
                                                            <label for="address">Center Name:</label>

                                                            <div className="form-control-wrap">
                                                                {/* <input
                                                                    placeholder="Enter Center Name "
                                                                    type="text"
                                                                    id="centerName"
                                                                    {...register("name_of_org")}
                                                                    className="form-control"
                                                                    value={watch("name_of_org")}
                                                                    readOnly
                                                                /> */}
                                                                <span className="form-control">
                                                                    {watch("name_of_org")}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                        <Col md="2">
                                                            <label for="address">Address:</label>
                                                            {/* <input type="text" id="address" name="address" /> */}
                                                            <div className="form-control-wrap">
                                                                {/* <input
                                                                    placeholder="Enter Address "
                                                                    type="text"
                                                                    id="address"
                                                                    {...register("address")}
                                                                    className="form-control"
                                                                    value={watch("address")}
                                                                    readOnly
                                                                /> */}
                                                                <span className="form-control">
                                                                    {watch("address")}
                                                                </span>
                                                            </div>
                                                        </Col>

                                                        <Col md="2">
                                                            <label for="pin">PIN:</label>
                                                            <div className="form-control-wrap">

                                                                <input
                                                                    placeholder="Enter Pin"
                                                                    type="text"
                                                                    id="pin"
                                                                    {...register("pin")}
                                                                    className="form-control"
                                                                    value={watch("pin")}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col md="2">
                                                            <label for="telephone">
                                                                Telephone(landline):
                                                            </label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Telephone"
                                                                    type="text"
                                                                    id="telephone_no"
                                                                    {...register("telephone_no")}
                                                                    className="form-control"
                                                                    value={watch("telephone_no")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="2">
                                                            <label for="mobile">Mobile:</label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Mobile Number"
                                                                    type="text"
                                                                    id="mobile_no"
                                                                    {...register("mobile_no")}
                                                                    className="form-control"
                                                                    value={watch("mobile_no")}
                                                                    readOnly

                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="2">
                                                            <label for="fax-email">Email:</label>

                                                            <div className="form-control-wrap">
                                                                {/* <input
                                                                    placeholder="Enter Email"
                                                                    type="text"
                                                                    id="email"
                                                                    {...register("email")}
                                                                    className="form-control"
                                                                    value={watch("email")}
                                                                    readOnly
                                                                /> */}
                                                                <span className="form-control">
                                                                    {watch("email")}
                                                                </span>
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
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Registration Certificate Number
                                                                </Label>
                                                                <input
                                                                    className="form-control"
                                                                    id="part_number"
                                                                    type="text"
                                                                    placeholder="Enter Registration Number"
                                                                    {...register("regCertificate_no")}
                                                                    readOnly

                                                                />
                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {regImgs.length > 0 && (
                                                                                <div>

                                                                                    <img
                                                                                        src={`${base_url}${row?.document?.[0]?.regImg}`}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, regImgs, "Registration Certificate")}
                                                                                    />
                                                                                </div>
                                                                            )}



                                                                        </div>

                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    PAN Number
                                                                </Label>
                                                                <input
                                                                    className="form-control"
                                                                    id="part_number"
                                                                    type="text"
                                                                    placeholder="Enter PAN Number"
                                                                    {...register("pan_no")}
                                                                    readOnly
                                                                    value={watch("pan_no")}
                                                                />



                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {panImgs.length > 0 && (
                                                                                <div >

                                                                                    <img
                                                                                        src={panImgs}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, panImgs, 'PanCard')}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Adhaar Number
                                                                </Label>
                                                                <input
                                                                    className="form-control"
                                                                    id="adhaar_number"
                                                                    type="text"
                                                                    placeholder="Enter Aadhaar Number"
                                                                    {...register("adhaar_no")}
                                                                    readOnly
                                                                    value={watch("adhaar_no")}
                                                                />
                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {adhaarImgs.length > 0 && (
                                                                                <div>

                                                                                    <img
                                                                                        src={adhaarImgs}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, adhaarImgs, 'Adhaar Card')}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Area in Sqft.
                                                                </Label>
                                                                <input
                                                                    className="form-control"
                                                                    id="area_sqft"
                                                                    type="text"
                                                                    placeholder="Enter Area Number"
                                                                    {...register("area_sqft")}
                                                                    readOnly
                                                                    value={watch(`area_sqft`)}
                                                                />




                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {areaSqftImgs.length > 0 && (
                                                                                <div>

                                                                                    <img
                                                                                        src={areaSqftImgs}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, areaSqftImgs, "Area-Sqft-Image")}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Market Survey
                                                                </Label>

                                                                <input
                                                                    className="form-control"
                                                                    id="market_survey_no"
                                                                    type="text"
                                                                    placeholder="Enter market survey number"
                                                                    {...register("market_survey_no")}
                                                                    readOnly
                                                                    value={watch(`market_survey_no`)}
                                                                />





                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {marketSurvey.length > 0 && (
                                                                                <div>

                                                                                    <img
                                                                                        src={marketSurvey}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, marketSurvey, 'Market Survey Image')}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                        </Col>
                                                        <Col md={2}>
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Annual Sales
                                                                </Label>
                                                                <input
                                                                    className="form-control"
                                                                    id="annual_sales_potential"
                                                                    type="text"
                                                                    placeholder="Enter Annual Sales "
                                                                    {...register("annual_sales_potential")}
                                                                    value={watch(`annual_sales_potential`)}
                                                                    readOnly
                                                                />


                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {sales.length > 0 && (
                                                                                <div>

                                                                                    <img
                                                                                        src={sales}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, sales, ' Annual Sales Image')}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </fieldset>
                                            </Col>
                                            <Col md="12" className="mt-4">
                                                <fieldset>
                                                    <legend>Bank Details</legend>
                                                    <Row>
                                                        <Col md="3">
                                                            <label for="bank-name">Name:</label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Bank "
                                                                    type="text"
                                                                    id="bank_name"
                                                                    {...register("bank_name")}
                                                                    className="form-control"
                                                                    value={watch("bank_name")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <label for="bank-address">Address:</label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Bank Address "
                                                                    type="text"
                                                                    id="bank_address"
                                                                    {...register("bank_address")}
                                                                    className="form-control"
                                                                    value={watch("bank_address")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <label for="branch-name">Branch Name:</label>

                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter Branch Name"
                                                                    type="text"
                                                                    id="branch_name"
                                                                    {...register("branch_name")}
                                                                    className="form-control"
                                                                    value={watch("branch_name")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <label for="ifsc">IFSC Code:</label>
                                                            <div className="form-control-wrap">
                                                                <input
                                                                    placeholder="Enter IFSC Code"
                                                                    type="text"
                                                                    id="ifsc_code"
                                                                    {...register("ifsc_code")}
                                                                    className="form-control"
                                                                    value={watch("ifsc_code")}
                                                                    readOnly
                                                                />



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
                                                                    className="from-label"
                                                                    htmlFor="relative_in_alimco"
                                                                >
                                                                    Do you have any relative working : in ALIMCO? If
                                                                    yes state, the relationship in detail
                                                                </Label>
                                                                <div className="form-control-wrap">
                                                                    <textarea
                                                                        id="relative_in_alimco"
                                                                        className="form-control"
                                                                        {...register("relative_in_alimco")}
                                                                        readOnly
                                                                    />

                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="form-group">
                                                                <Label
                                                                    className="from-label"
                                                                    htmlFor="additionalInfo"
                                                                >
                                                                    Additional Information
                                                                </Label>
                                                                <div className="form-control-wrap">
                                                                    <textarea
                                                                        id="additionalInfo"
                                                                        className="form-control"
                                                                        {...register("additionalInfo")}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="form-group">
                                                                <Label className="from-label" htmlFor="agreement">
                                                                    Whether you can invest Rs.2.50 lakhs for :

                                                                    purchase of tools & tackles & Minimum one-month
                                                                    inventory of spare parts of ALIMCO Aids &
                                                                    Appliances (Motorized Tricycle/ Motorized
                                                                    Wheelchair, Conventional Tricycle, Conventional
                                                                    Wheelchair & Hearing Aid) after getting ALIMCO
                                                                    authorized Service & Repair Agency (AASRA)
                                                                    ownership?

                                                                </Label>
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
                                                                            readOnly
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
                                                                            id="agreement"
                                                                            value="No"
                                                                            className="form-check-input"
                                                                            {...register("agreement_of_rupee", {
                                                                                required: "Agreement is required.",
                                                                            })}
                                                                            readOnly
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="agreement"
                                                                        >
                                                                            {" "}
                                                                            No{" "}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="form-group">
                                                                <Label
                                                                    className="from-label"
                                                                    htmlFor="invest_agree"
                                                                >
                                                                    Whether you can invest or have facility of

                                                                    Hardware like Computer /Laptop, a good
                                                                    quality Android Phone, online Camera,
                                                                    Printer, UPS and a high speed internet
                                                                    connection to carry out online registration
                                                                    and assessment of Beneficiary under ADIP
                                                                    and RVY Scheme?

                                                                </Label>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="form-check form-check-inline">
                                                                        <input
                                                                            type="radio"
                                                                            id="invest_agree"
                                                                            value="Yes"
                                                                            className="form-check-input"
                                                                            {...register("invest_agree", {
                                                                                required: "Invest Agreement is required.",
                                                                            })}
                                                                            readOnly
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
                                                                                required: "Invest Agreement is required.",
                                                                            })}
                                                                            readOnly
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
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </fieldset>
                                            </Col>
                                            <Col md="12" className="mt-4">
                                                <fieldset>
                                                    <legend>Self Declaration</legend>
                                                    <Row>
                                                        <Col md="3">
                                                            <div className="form-group">
                                                                <label htmlFor="name">Name</label>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    className="form-control"
                                                                    placeholder="Enter  Name"
                                                                    {...register("name")}
                                                                    readOnly
                                                                />

                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <div className="form-group">
                                                                <label htmlFor="place">Place</label>
                                                                <input
                                                                    type="text"
                                                                    id="place"
                                                                    name="place"
                                                                    className="form-control"
                                                                    placeholder="Enter Place "
                                                                    {...register("place")}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col md="3">
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Photo
                                                                </Label>

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
                                                                                            onClick={() => handleImageClick(0, photoImg, "Photo")}
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                        </Col>
                                                        <Col md="3">
                                                            <div className="form-group">
                                                                <Label htmlFor="default-0" className="form-label">
                                                                    Signature
                                                                </Label>

                                                                <Row className="mt-3">
                                                                    <Col>
                                                                        <div className="d-flex">
                                                                            {signatureImg.length > 0 && (
                                                                                <div className="mt-2">
                                                                                    <img
                                                                                        src={signatureImg}
                                                                                        alt="Selected"
                                                                                        className="preview-img img-thumbnail"
                                                                                        onClick={() => handleImageClick(0, signatureImg, "Signature Image")}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                            </div>
                                                        </Col>


                                                    </Row>

                                                </fieldset>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <ModalComponent
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

export default ViewAasraDetails;