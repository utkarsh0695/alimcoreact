import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import Captcha from "../../Common/Component/Captcha";
import { toast } from "react-toastify";
import { fileuploadpartSerialAPI } from "../../../api/master"; // Import the API
import { FaDownload } from "react-icons/fa";
import useLogout from "../../../util/useLogout";
import { MarginTop } from "../../../Constant";
import ToolTip from "../../../CommonElements/ToolTips/ToolTip";
import Required from "../Required";
import { validateExcelFile } from "../../../util/myFunction";
const UploadPartsSerial = ({ show, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();
  const logout = useLogout();
  const userToken = localStorage.getItem("accessToken");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaTouched, setCaptchaTouched] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const captchaRef = useRef(null);
  const base_url = localStorage.getItem("base_url");
  const defaultStartDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const [startDate, setStartDate] = useState(defaultStartDate);
  useEffect(() => {
    setValue("startDate", defaultStartDate);
  }, []);
  // Handle form submission
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
        Authorization: "Bearer " + `${userToken}`,
      },
    };

    const file = data.file[0]; // Get the file from input
    const formData = new FormData();
    formData.append("date", startDate.toISOString()); // Append the date
    formData.append("file", file); // Append the file

    try {
      setIsUploading(true); // Show loading state
      // Call the API to upload the file
      await fileuploadpartSerialAPI(formData, token).then((res) => {
        if (res.data.status === "success") {
          toast.success(res.data.message);
          handleClose();
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      });
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  const validateFileType = async (file) => {
    if (!file) return "File is required.";
    const isValid = await validateExcelFile(file[0]); // Ensure file[0] is passed
    return isValid || "Invalid file type. Only .xlsx files are allowed.";
  };

  const handleViewFile = async () => {
    const fileName = `sample_file`;
    //  return false
    const filePath = `${base_url}/partserial.xlsx`; // Update the path
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Modal isOpen={show} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Upload Parts Serial</ModalHeader>
        <hr />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12">
                {/* Date Input Field */}
                <Label className="form-label">
                  Date <Required />
                </Label>
                <DatePicker
                  className="form-control"
                  placeholderText="Please select date"
                  {...register("startDate", {
                    required: "Start Date is required",
                  })}
                  onChange={(date) => {
                    setValue("startDate", date);
                    setStartDate(date);
                    trigger("startDate");
                  }}
                  selected={startDate}
                  selectsStart
                  startDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                />
                {errors.startDate && (
                  <p className="invalid">{errors.startDate.message}</p>
                )}
              </Col>
              <Row>
                <Col md="10">
                  {/* File Input Field */}
                  <Label className="form-label">
                    File
                    <Required />
                  </Label>
                  <input
                    type="file"
                    className="form-control"
                    {...register("file", {
                      required: "File is required",
                      validate: {
                        fileType: (value) =>
                          value[0]
                            ? validateFileType(value[0]) &&
                              value[0].name === "partserial.xlsx"
                              ? true
                              : "Only 'partserial.xlsx' file is allowed."
                            : "File is required",
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
                    id={`uploaded-file`}
                    onClick={() => handleViewFile()}
                  >
                    <FaDownload />
                  </Button>
                  <ToolTip
                    id={`uploaded-file`}
                    name={"Download Sample"}
                    option={"top"}
                  />
                </Col>
              </Row>

              <Col sm="12" className="mt-2">
                <div className="form-control-wrap">
                  <Captcha
                    size={"175px"}
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
              <Col sm="12" className="d-flex justify-content-center">
                <Button type="submit" className="mt-4" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Submit"}
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UploadPartsSerial;
