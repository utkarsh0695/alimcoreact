import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fileuploadSparePartsAPI } from "../../../api/master";
import { FaDownload } from "react-icons/fa";
import useLogout from "../../../util/useLogout";
import Captcha from "../../Common/Component/Captcha";
import ToolTip from "../../../CommonElements/ToolTips/ToolTip";
import Select from "react-select";
import ConfirmUploadStock from "./ConfirmUploadStock";
import { aasraListAPI } from "../../../api/dropdowns";
import Required from "../Required";
import { validateExcel, validateExcelFile } from "../../../util/myFunction";

const UploadStockModal = ({ show, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    reset,
  } = useForm();
  const logout = useLogout();
  const userToken = localStorage.getItem("accessToken");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaTouched, setCaptchaTouched] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [isFailed, setIsFailed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [mode, setMode] = useState("validate");
  const [YesBtn, setYesBtn] = useState(false);
  const [message, setMessage] = useState();
  const [aasraList, setAasraList] = useState([]);
  const captchaRef = useRef(null);
  const base_url = localStorage.getItem("base_url");

  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };

  useEffect(() => {
    getAasraDropdown();
  }, []);

  const getAasraDropdown = () => {
    aasraListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          setAasraList(res.data.data);
        } else if (res.data.status === "failed") {
          toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching Aasra list:", err);
      });
  };

  const handleAasraId = (selectedOption) => {
    setValue("aasraId", selectedOption);
    trigger("aasraId");
  };

  const onSubmit = async (data) => {
    setCaptchaTouched(true);
    if (!captchaValid) {
      setCaptchaError("Captcha is required");
      captchaRef.current.resetCaptcha();
      return;
    }
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      },
    };
    if (YesBtn === true) {
      setCaptchaTouched(true);
      if (!captchaValid) {
        setCaptchaError("Captcha is required");
        captchaRef.current.resetCaptcha();
        return;
      }
      if (!data.file || data.file.length === 0) {
        toast.error("File is required");
        return;
      }
      const file = data.file[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("aasra", data.aasraId.value);
      try {
        setIsUploading(true);
        const response = await fileuploadSparePartsAPI(formData, token);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          setConfirmModalOpen(false);
          handleClose();
          reset();
          setYesBtn(false);
        } else if (response.data.status === "failed") {
          toast.error(response.data.message);
        } else if (response.data.status === "expired") {
          logout(response.data.message);
        }
      } catch (error) {
        toast.error("Error uploading file: " + error.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      setCaptchaTouched(true);
      if (!captchaValid) {
        setCaptchaError("Captcha is required");
        captchaRef.current.resetCaptcha();
        return;
      }
      if (!data.file || data.file.length === 0) {
        toast.error("File is required");
        return;
      }
      const file = data.file[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("aasra", data.aasraId.value);
      formData.append("mode", mode);
      try {
        setIsUploading(true);
        // return false; // You might want to remove this line if you actually want to proceed with the upload.
        const response = await fileuploadSparePartsAPI(formData, token);
        if (
          response.data.status === "success" &&
          response.data.data.mode === mode
        ) {
          setConfirmModalOpen(true);
          setMessage(response.data.data.errors);
          setYesBtn(true);
          handleClose();
        } else if (response.data.status === "failed") {
          toast.error(response.data.message);
          setMessage(response.data.data.message);
          setIsFailed(true);
        } else if (response.data.status === "expired") {
          logout(response.data.message);
        }
      } catch (error) {
        toast.error("Error uploading file: " + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validateFileType = async (file) => {
    if (!file) return "File is required.";
    const isValid = await validateExcelFile(file[0]); // Ensure file[0] is passed
    return isValid || "Invalid file type. Only .xlsx files are allowed.";
  };
  
  const handleViewFile = () => {
    const filePath = `${base_url}/stockimport.xlsx`;
    const link = document.createElement("a");
    link.href = filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseWithReset = () => {
    setValue("aasraId", null);
    reset();
    handleClose();
    setYesBtn(false);
  };

  return (
    <>
      <Modal isOpen={show} toggle={handleCloseWithReset}>
        <ModalHeader toggle={handleCloseWithReset}>Upload Stock</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12">
                <Label className="form-label">
                  Aasra <Required />
                </Label>
                <Select
                  className="select"
                  id="aasraId"
                  {...register("aasraId", { required: "Aasra is required" })}
                  options={aasraList}
                  placeholder="Select Aasra"
                  value={watch("aasraId")}
                  onChange={handleAasraId}
                  isClearable
                  isValidNewOption={() => false}
                />
                {errors.aasraId && (
                  <p className="invalid">{errors.aasraId.message}</p>
                )}
              </Col>
            </Row>
            <Row>
              <Col md="10">
                <Label className="form-label">
                  File <Required />
                </Label>
                <input
                  type="file"
                  className="form-control"
                  {...register("file", {
                    required: "File is required",
                    validate: {
                      fileType: (value) => validateFileType(value),
                    },
                  })}                 
                />
                {errors.file && (
                  <p className="invalid">{errors.file.message}</p>
                )}
              </Col>
              <Col md="2" style={{ marginTop: "35px" }}>
                <Button
                  outline
                  color="primary"
                  id="uploaded-file"
                  onClick={handleViewFile}
                >
                  <FaDownload />
                </Button>
                <ToolTip
                  id="uploaded-file"
                  name="Download Sample"
                  option="top"
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12" className="mt-2">
                <div className="form-control-wrap">
                  <Captcha
                    size="175px"
                    ref={captchaRef}
                    setCaptchaValid={setCaptchaValid}
                    setCaptchaError={setCaptchaError}
                  />
                  {captchaTouched && (
                    <span
                      className="invalid"
                      style={{
                        color: "#e85347",
                        fontSize: "11px",
                        fontStyle: "italic",
                      }}
                    >
                      {captchaError}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="12" className="d-flex justify-content-center">
                <Button className="mt-4" type="submit" disabled={isUploading}>
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
      <ConfirmUploadStock
        disabled={isUploading}
        isOpen={isConfirmModalOpen}
        onConfirm={() => {
          handleSubmit(onSubmit)();
        }}
        isFailed={isFailed}
        message={message}
        toggle={() => {
          setConfirmModalOpen(!isConfirmModalOpen);
          reset();
          setYesBtn(false);
        }}
      />
    </>
  );
};

export default UploadStockModal;
