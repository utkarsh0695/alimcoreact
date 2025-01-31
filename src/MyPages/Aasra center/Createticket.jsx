import { useEffect, useState } from "react";
import { CardHeader } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { createTicket, otpVarify, uuidDetails } from "../../api/user";
import OtpInput from "../../Components/Common/Component/OtpInput";
import { useNavigate } from "react-router-dom";
import useLogout from "../../util/useLogout";
import { listCategoryMasterAPI, listProblemMasterAPI } from "../../api/master";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";

const CreateTicket = () => {
  const logout = useLogout();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [otpModal, setOtpModal] = useState(false);
  const [slot, setSlot] = useState([]);
  const [slotOptions, setSlotOptions] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [appointment_time, setSelectAppointmentTime] = useState();
  const [searchResults, setSearchResults] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [description, setDescription] = useState(null);
  const [resetOtp, setResetOtp] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [verifyCount, setVerifyCount] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const navigate = useNavigate();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    trigger: triggerOtp,
    watch: watchOtp,
    setValue: setValueOtp,
  } = useForm();
  const listProblem = () => {
    listProblemMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setProblemList(res.data?.data.data);
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
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setValue: setValueForm,
    trigger: triggerForm,
  } = useForm();

  useEffect(() => {
    listProblem();
  }, []);

  const sendOtp = async (formData) => {
    const { mobile, udid } = formData;
    // if (!mobile) {
    //   toast.error("Please enter your mobile number.");
    //   return;
    // }
    // return false
    setIsLoading(true);
    try {
      const response = await otpVarify({ mobile, udid });
      if (response.data.status === "success") {
        setIsLoading(false);
        toast.success(response.data.message);
        setOtpSent(true); // Set this to true to hide the button
        setOtpModal(true);
      } else if (response.data.status === "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status === "expired") {
        setIsLoading(false);
        logout(response.data.message);
      }
    } catch (err) {
      setIsLoading(false);
      // console.log("OTP send error", err.message);
      toast.error("Failed to send OTP");
    }
  };

  const closeModal = () => {
    setOtpModal(false);
    setOtpSent(false); // Reset otpSent to show the "Send OTP" button again
  };

  const verifyOtp = async () => {
    const mobile = watchOtp("mobile");
    const udid = watchOtp("udid");
    // if (!otp) {
    //   toast.error("Please enter OTP.");
    //   return;
    // }
    const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
    const key = encrypt(myKey);

    let timer = null;
    setResendOtpLoading(true)
    setIsLoading(true);
    // Start countdown timer
    timer = setInterval(() => {
      setCountdownTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          setResendOtpLoading(false);
          return 0;
        } else {
          return prevTimer - 1; // Decrease timer by 1 second
        }
      });
    }, 1000);
    try {
      const finalData = { mobile, udid, otp, key };
      const uuidResponse = await uuidDetails(finalData, tokenHeader);
      // console.log(uuidResponse, myKey, uuidResponse.data.data.key);
      // console.log("RESPONSE slot data", uuidResponse.data.data.slots);
      if (uuidResponse.data.status === "success" && uuidResponse.data.data.key === myKey) {
        // console.log("success");
        setData(uuidResponse.data.data.userData);
        setProducts(uuidResponse.data.data.userData[0]?.userItem);
        setSlot(uuidResponse.data.data.slots);
        setOtpModal(false);
        toast.success(uuidResponse?.data?.message);
        setIsOpen(true);
      } else if (uuidResponse.data.status == "failed") {
        toast.error(uuidResponse.data.message);
        setCountdownTimer(uuidResponse?.data?.data?.timer || 0);
      } else if (uuidResponse.data.status == "expired") {
        logout(uuidResponse.data.message);
      }
      setIsLoading(false);
      // } else {
      //   toast.error("Invalid OTP");
      // }
    } catch (err) {
      setIsLoading(false);
      toast.error("OTP verification failed");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (!otpSent) {
          const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
          const key = encrypt(myKey);
          const mobile = watchOtp("mobile");
          const udid = watchOtp("udid");
          sendOtp({ mobile, udid, key });
          setOtpSent(true);
        } else {
          verifyOtp();
        }
      }
    };
    if (!isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [otpSent, watchOtp, encrypt, sendOtp, verifyOtp, setOtpSent]);


  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setData((prevData) => ({ ...prevData, [name]: value }));
  // };

  const option = products.map(product => ({
    label: product.itemName,
    value: product.itemId,
    expiryDate: product.expiryDate,
    name: product.itemName,
  }));

  const onFormSubmit = async () => {
    // console.log("data", data);
    const mobile = watchOtp("mobile");
    const formData = {
      userData: data,
      product: selectedProduct || "",
      description: description,
      appointment_date: startDate ? startDate.toISOString().split("T")[0] : "",
      mobile: mobile,
      problem: selectedProblem || "",
    };
    setIsLoading(true);

    try {
      const response = await createTicket(formData);
      // console.log("response", response);
      if (response.data.status === "success") {
        setIsLoading(false);
        navigate(`${process.env.PUBLIC_URL}/tickets`);
        toast.success(response.data.message);
        setIsOpen(false);
      } else if (response.data.status == "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    registerForm("product", { required: "Please select  Product" });
    registerForm("problem", { required: "Please select  Problem" });
    registerForm("description", { required: "Description is required" });
    registerForm("appointment_time", { required: "Please select slot" });
  }, [registerForm]);

  const handleProductSelect = (selectOption) => {
    setSelectedProduct(selectOption);
    setValueForm("product", selectOption);
    triggerForm("product");
  };
  const handleAppointmentSelect = (selectOption) => {
    setSelectAppointmentTime(selectOption);
    setData((prevData) => ({
      ...prevData,
      ["appointment_time"]: selectOption.value,
    }));
    setValueForm("appointment_time", selectOption);
    triggerForm("appointment_time");
  };

  const handleDateChange = (date) => {
    const today = new Date();
    if (date < today.setHours(0, 0, 0, 0)) {
      setErrorMessage("Please select a future date.");
    } else {
      setErrorMessage("");
      setStartDate(date);
      // Reset the slot selection
      setSelectAppointmentTime(null);
      setValueForm("appointment_time", null);
    }
  };

  const handleProblemChange = (selectOption) => {
    setSelectedProblem(selectOption);
    setValueForm("problem", selectOption);
    triggerForm("problem");
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
    setValueForm("description", e.target.value);
    triggerForm("description");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const onChangeOTP=(OTP)=>{
  //   setOtp(OTP)
  // }

  const handleResendOtp = async () => {
    const mobile = watchOtp("mobile");
    const udid = watchOtp("udid");
    const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const encryptedData = encrypt(myKey);

    try {
      const response = await otpVarify({ mobile, udid, myKey });
      if (response.data.status === "success") {
        toast.success("OTP resent successfully");
        setOtp("");
        setResetOtp(true); // Trigger OTP reset
        setOtpSent(true);
        setOtpModal(true);
        // Start timer
        setResendDisabled(true);
        let secondsLeft = 60;
        setCountdownTimer(secondsLeft);
        const interval = setInterval(() => {
          secondsLeft--;
          setCountdownTimer(secondsLeft);
          if (secondsLeft === 0) {
            clearInterval(interval);
            setResendDisabled(false);
          }
        }, 1000);
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      // console.log("OTP resend error", err.message);
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    const currentTime = new Date();
    // Function to convert time string (HH:MM) to a full Date object for accurate comparison
    const convertToTime = (time) => {
      const [hours, minutes] = time.split(':');
      const newDate = new Date();
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate;
    };

    // Function to check if the selected date is today
    const isToday = (date) => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    // If selected date is today, filter slots to only show future slots
    let futureSlots;

    if (isToday(startDate)) {
      futureSlots = slot.filter((slotItem) => {
        const slotStartTime = convertToTime(slotItem.start);
        return slotStartTime > currentTime;
      });
    } else {
      // If the selected date is not today, show all slots
      futureSlots = slot;
    }

    // Map filtered slots to dropdown options
    const slotOptions = futureSlots.map((slotItem) => ({
      value: `${slotItem.start} - ${slotItem.end}`,
      label: `${slotItem.start} - ${slotItem.end}`,
    }));

    setSlotOptions(slotOptions);
  }, [slot, startDate]); // Effect runs when `slot` or `startDate` changes

  // const slotOptions = slot.map((slot) => ({
  //   value: `${slot.start} - ${slot.end}`,
  //   label: `${slot.start} - ${slot.end}`,
  // }));

  useEffect(() => {
    setSelectAppointmentTime(null);
  }, [startDate]);
  return (
    <>
      <Breadcrumbs
        mainTitle="Create Ticket"
        parent="Aasra center"
        title="Create Ticket"
      />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmitOtp(sendOtp)}>
            <Row>
              <Col sm={4} md="4" xxl="5">
                <label className="form-label" htmlFor="udid">
                  Enter UDID<Required />
                </label>
                <Input
                  id="udid"
                  className="form-control"
                  {...registerOtp("udid", {
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
                      .toUpperCase();


                  }}
                  placeholder="Enter your UDID"
                  value={watchOtp("udid")}
                  onChange={(e) => {
                    setValueOtp("udid", e.target.value);
                    triggerOtp("udid");
                  }}
                  disabled={otpSent}
                />
                {errorsOtp.udid && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errorsOtp.udid.message}
                  </span>
                )}
              </Col>
              <Col sm={4} md="4" xxl="5">
                <label className="form-label" htmlFor="mobile">
                  Enter Mobile number<Required />
                </label>
                <Input
                  id="mobile"
                  className="form-control"
                  {...registerOtp("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6789]\d{9}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  placeholder="Enter your Mobile number"
                  value={watchOtp("mobile")}
                  onChange={(e) => {
                    setValueOtp("mobile", e.target.value);
                    triggerOtp("mobile");
                  }}
                  disabled={otpSent}
                />
                {errorsOtp.mobile && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errorsOtp.mobile.message}
                  </span>
                )}
              </Col>
              <Col sm="3" md="3" xxl="2" style={{ marginTop: "35px" }}>
                {!otpSent && (
                  <Button
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                )}
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>
      <Modal isOpen={otpModal}>
        <ModalHeader toggle={closeModal}>OTP Verification</ModalHeader>
        <ModalBody>
          <OtpInput length={4} onChangeOTP={setOtp} resetOtp={resetOtp} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary"
            onClick={verifyOtp}
            disabled={isLoading || resendOtpLoading ? true : false}
          >
            {isLoading || resendOtpLoading ? (
              <>
                Verify OTP in ({countdownTimer}s) <Spinner size="sm" color="light" />
              </>
            ) : (
              "Verify"
            )}
          </Button>{" "}
          <Button
            color="secondary"
            onClick={handleResendOtp}
            disabled={resendDisabled}
          >
            {resendDisabled ? `Resend in ${timer}s` : "Resend"}
          </Button>
        </ModalFooter>
      </Modal>
      {isOpen && (
        <Container fluid={true}>
          <Col sm="12">
            <Form onSubmit={handleSubmitForm(onFormSubmit)}>
              <Col sm={12}>
                <Card>
                  <CardHeader>
                    <h5>Appointment Schedule</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>Aadhaar Number</Label>
                          <Input
                            name="aadhaar"
                            placeholder="Aadhaar"
                            value={data[0]?.aadhaar || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>Beneficiary ID</Label>
                          <Input
                            className="form-control"
                            name="beneficiary_id"
                            placeholder="Beneficiary ID"
                            value={data[0]?.beneficiary_id || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>District</Label>
                          <Input
                            className="form-control"
                            name="district"
                            placeholder="District"
                            value={data[0]?.district || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>DOB</Label>
                          <Input
                            className="form-control"
                            name="dob"
                            placeholder="DOB"
                            value={data[0]?.dob || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>Father Name</Label>
                          <Input
                            className="form-control"
                            name="father_name"
                            placeholder="Father Name"
                            value={data[0]?.father_name || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>Gender</Label>
                          <Input
                            className="form-control"
                            name="gender"
                            placeholder="Gender"
                            value={data[0]?.gender || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>Name</Label>
                          <Input
                            className="form-control"
                            name="name"
                            placeholder="Name"
                            value={data[0]?.name || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>State</Label>
                          <Input
                            className="form-control"
                            name="state"
                            placeholder="State"
                            value={data[0]?.state || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="form-group">
                          <Label>UDID</Label>
                          <Input
                            className="form-control"
                            name="udid"
                            placeholder="UDID"
                            value={data[0]?.udid || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="form-group">
                          <Label>Product Details<Required /></Label>
                          <Select
                            options={option}
                            value={selectedProduct}
                            placeholder="Search Product"
                            onChange={handleProductSelect}
                          // onInputChange={(inputValue) => {
                          //   setSearchResults(
                          //     products.filter((product) =>
                          //       product.label.toLowerCase().includes(inputValue.toLowerCase())
                          //     )
                          //   );
                          // }}
                          />
                          {errorsForm.product && (
                            <span
                              className="text-danger"
                              style={{
                                color: "#e85347",
                                fontSize: "11px",
                                fontStyle: "italic",
                              }}
                            >
                              {errorsForm.product.message}
                            </span>
                          )}
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="form-group">
                          <Label>Problem<Required /></Label>
                          <Select
                            options={problemList}
                            value={selectedProblem}
                            placeholder="Choose Problem"
                            onChange={handleProblemChange}
                          // onInputChange={(inputValue) => {
                          //   setSearchResults(
                          //     products.filter((product) =>
                          //       product.label.toLowerCase().includes(inputValue.toLowerCase())
                          //     )
                          //   );
                          // }}
                          />
                        </div>
                        {errorsForm.problem && (
                          <span
                            className="text-danger"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errorsForm.problem.message}
                          </span>
                        )}
                      </Col>

                      <Col md={3}>
                        <div className="form-group">
                          <Label>Date<Required /></Label>
                          <DatePicker
                            className="form-control"
                            selected={startDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        {errorMessage && (
                          <span
                            className="text-danger"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errorMessage}
                          </span>
                        )}
                      </Col>

                      <Col md={3}>
                        <div className="form-group">
                          <Label>Slot Booking<Required /></Label>
                          <Select
                            options={slotOptions}
                            value={appointment_time}
                            classNamePrefix="react-select"
                            name="appointment_time"
                            onChange={handleAppointmentSelect}
                            placeholder="Select Slot"
                          />
                        </div>
                        {errorsForm.appointment_time && (
                          <span
                            className="text-danger"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errorsForm.appointment_time.message}
                          </span>
                        )}
                      </Col>

                      <Col md={12}>
                        <Label>Description<Required /></Label>
                        <textarea
                          className="form-control"
                          {...registerForm("description")}
                          onChange={handleDescription}
                        />
                        {errorsForm.description && (
                          <span
                            className="text-danger"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errorsForm.description.message}
                          </span>
                        )}
                      </Col>
                      <Row>
                        <Col md="2" className={`mt-3`}>
                          <div
                            className="form-group"
                            style={{ verticalAlign: "bottom" }}
                          >
                            <Button
                              color="primary"
                              size="md"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Spinner size="sm" color="light" />
                              ) : (
                                "Submit"
                              )}
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
        </Container>
      )}
    </>
  );
};

export default CreateTicket;
