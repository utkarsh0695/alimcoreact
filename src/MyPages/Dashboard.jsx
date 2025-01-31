import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Breadcrumbs } from "../AbstractElements";
import { dashboardAPI } from "../api/dashboard";

import axios from "axios";
import {
  closeTicketAPI,
  generateOrderNumber,
  generateOtpAPI,
  openTicketAPI,
  verifyOtpAPI,
} from "../api/ticket";
import img1 from "../assets/images/dashboard/cartoon.svg";
import ConfirmModal from "../Components/MyComponents/Modal/ConfirmModal";
import OpenTicketModal from "../Components/MyComponents/Modal/OpenTicketModal";
import OtpConfirmation from "../Components/MyComponents/Modal/OtpConfirmation";
import MyDataTable from "../Components/MyComponents/MyDataTable";
import {
  handleClosedTicketPrint,
  printJobCard,
  printJobCardBulk,
} from "../util/myPrint";
import useLogout from "../util/useLogout";
import PaymentModal from "../Components/MyComponents/Modal/PaymentModal";
import CashModalOpen from "../Components/MyComponents/Modal/CashModalOpen";
import ToolTip from "../CommonElements/ToolTips/ToolTip";
import { Button } from "reactstrap";
import { BsEye, BsPrinter } from "react-icons/bs";
import { FaRegCheckCircle, FaRegAddressCard } from "react-icons/fa";
import { displayRazorpay } from "./Razorpay/RazorPay";
import { encrypt } from "../security/Encrpt";
const Dashboard = () => {
  const location = useLocation();
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const userToken = localStorage.getItem("accessToken");
  const base_url = localStorage.getItem("base_url");
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [otpModal, setOtpModal] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [resetOtp, setResetOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  //!Payment Modal
  const [paymentModal, setPaymentModal] = useState(false);
  const [cashPaymentModal, setCashPaymentModal] = useState(false);

  const [rNumber, setRNumber] = useState(null);
  const togglePayment = () => {
    setPaymentModal(!paymentModal);
  };
  const toggleCashPayment = () => {
    setCashPaymentModal(!cashPaymentModal);
  };
  const paymentOptions = ["Cash"];
  const [selectedOption, setSelectedOption] = useState(paymentOptions[0]);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const calculateTotalAmount = () => {
    return (
      rowData?.length > 0 &&
      rowData?.reduce((total, row) => total + (row.amount || 0), 0)
    );
  };
  const calculateTotalWithGST = () => {
    if (rowData?.warranty?.value) {
      // Calculate the total amount without GST
      const totalWithoutGST =
        rowData?.length > 0 &&
        rowData?.reduce((total, row) => total + (row.serviceCharge || 0), 0);

      // Calculate GST (18% of the total amount)
      const gstAmount = totalWithoutGST * 0.18;

      // Return the total amount including GST
      // return totalWithoutGST + gstAmount;
      // returning )
      return 0;
    } else {
      // Calculate the total amount without GST
      const totalWithoutGST = rowData?.reduce(
        (total, row) => total + (row.amount || 0),
        0
      );

      // Calculate GST (18% of the total amount)
      const gstAmount = totalWithoutGST * 0.18;

      // Return the total amount including GST
      return totalWithoutGST + gstAmount;
    }
  };

  const calculateServiceCharge = () => {
    return (
      rowData?.length > 0 &&
      rowData?.reduce((total, row) => total + (row.serviceCharge || 0), 0)
    );
  };
  const calculateDiscount = () => {
    if (rowData?.warranty?.value) {
      return (
        rowData?.length > 0 &&
        rowData?.reduce((total, row) => total + (row.amount || 0), 0)
      );
    } else {
      return 0;
    }
  };

  const navigate = useNavigate();
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [complaints, setComplaints] = useState([]);
  const getColorClass = (type) => {
    switch (type) {
      case "Total Tickets":
        return "primary";
      case "Running Tickets":
        return "primary";
      case "Pending Tickets":
        return "warning";
      case "Register Grievance":
        return "success";
      default:
        return "";
    }
  };
  const [tableData, setTableData] = useState([
    {
      sr_no: 1,
      ticket_id: 1,
      customer_name: "Test",
      product_name: "Wheel chair",
      description: "change in wheels",
      appointment_date: "7-7-24",
      status: "Pending",
    },
    {
      sr_no: 2,
      ticket_id: 2,
      customer_name: "Test one",
      product_name: "Wheel chair",
      description: "change in wheels",
      appointment_date: "8-7-24",
      status: "Pending",
    },
  ]);
  const [tableColumns, setColumns] = useState([]);

  const columns = [
    {
      name: "Ticket Id",
      selector: (row) => (
        <>
          {userDetail?.user_type == "AC" && row?.status == "Open" ? (
            <Link to="/ticket-detail" state={{ ticket: row }}>
              {row.ticket_id}
            </Link>
          ) : (
            <>
              {(userDetail?.user_type == "S" || userDetail?.user_type == "A") &&
              row?.status == "Closed" ? (
                <Link to="/ticket-detail" state={{ ticket: row }}>
                  {row.ticket_id}
                </Link>
              ) : (
                <>{row?.ticket_id}</>
              )}
            </>
          )}
        </>
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: "Warranty Status/Expire Date",
      selector: (row) => (
        <>
          <span
            className={
              row.warranty 
                ? "badge badge-light-success":
                "badge badge-light-danger"
            }
           
          >
            {row?.warranty ? "In Warranty" : "Out of Warranty"}
          </span><br></br>
          <span>{row?.expire_date?.includes("Invalid") ? "" :row?.expire_date }</span>
        </>
      ),
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    ...(userDetail?.user_type == "A" || userDetail?.user_type == "S"
      ? [
          {
            name: "Aasra",
            selector: (row) => row.aasraName ?? "-", // Replace with the appropriate field
            sortable: true,
            hide: 370,
            minWidth: "190px",
            wrap: true,
          },
        ]
      : []),
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
      minWidth: "140px",
      wrap: true,
    },
    
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
      width: "200px",
      wrap: true,
    },
    {
      name: "Problem",
      selector: (row) => row.problem,
      sortable: true,
      minWidth: "190px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      minWidth: "190px",
      wrap: true,
    },
   
    {
      name: "Appointment Date",
      selector: (row) => row.appointment_date,
      sortable: true,
      minWidth: "160px",
    },
    {
      name: "Ticket Status",
      selector: (row) => (
        <span
          className={
            row.status == "Closed"
              ? "badge badge-light-success"
              : row.status == "Open"
              ? "badge badge-light-warning"
              : "badge badge-light-primary"
          }
        >
          {row.status}
        </span>
      ),
      minWidth: "80px",
    },

    ...(userDetail?.user_type !== "CC"
      ? [
          {
            name: "Action",
            selector: (row) => (
              <div className="d-flex flex-wrap">
                {(userDetail?.user_type == "A" ||
                  userDetail?.user_type == "S") &&
                row?.status == "Closed" ? (
                  <>
                    {" "}
                    <Button
                      id="view"
                      outline
                      color="primary"
                      className="mx-1 mb-1"
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        paddingTop: "5px",
                      }}
                      onClick={() => handleAction(row)}
                      size="xs"
                    >
                      <BsEye style={{ height: ".8rem", width: ".8rem" }} />
                    </Button>
                    <ToolTip id={"view"} name={"View Ticket"} option={"top"} />
                  </>
                ) : null}

                {userDetail?.user_type == "AC" ? (
                  <>
                    {" "}
                    <Button
                      id="view"
                      outline
                      className="mx-1"
                      color="primary"
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        paddingTop: "5px",
                      }}
                      onClick={() => handleAction(row)}
                      size="xs"
                    >
                      <BsEye style={{ height: ".8rem", width: ".8rem" }} />
                    </Button>
                    <ToolTip id={"view"} name={"View Ticket"} option={"top"} />
                    {row.status == "Open" && row?.ticketDetail?.length > 0 ? (
                      <>
                        <Button
                          id={"close"}
                          outline
                          color="success"
                          className="mx-1 mb-1"
                          style={{
                            cursor: "pointer",
                            textAlign: "center",
                            paddingTop: "5px",
                          }}
                          onClick={() => handleConfirm(row)}
                          size="xs"
                        >
                          <FaRegCheckCircle
                            style={{ height: ".8rem", width: ".8rem" }}
                          />
                        </Button>
                        <ToolTip
                          id={"close"}
                          name={"Ticket Close"}
                          option={"top"}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
                {row?.ticketDetail?.length > 0 ? (
                  <>
                    <Button
                      id="printJobCard"
                      outline
                      className="mx-1 mb-1"
                      color="danger"
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        paddingTop: "5px",
                      }}
                      onClick={() => printJobCard(row)}
                      size="xs"
                    >
                      <FaRegAddressCard
                        style={{ height: ".8rem", width: ".8rem" }}
                      />
                    </Button>
                    <ToolTip
                      id={"printJobCard"}
                      name={"Print Job Card"}
                      option={"top"}
                    />
                  </>
                ) : null}
                {row?.status == "Closed" ? (
                  <>
                    <Button
                      id="printTicket"
                      outline
                      color="info"
                      className="mx-1"
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        paddingTop: "5px",
                      }}
                      onClick={() => handleClosedTicketPrint(row)}
                      size="xs"
                    >
                      <BsPrinter style={{ height: ".8rem", width: ".8rem" }} />
                    </Button>
                    <ToolTip
                      id={"printTicket"}
                      name={"Print Ticket"}
                      option={"top"}
                    />
                  </>
                ) : (
                  ""
                )}
              </div>
            ),
            sortable: true,
          },
        ]
      : []),
  ];
  const handleAction = (row) => {
    setRowData(row);
    if (row?.status == "Pending") {
      toggleModal();
    } else {
      navigate("/ticket-detail", { state: { ticket: row } });
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const openTicket = () => {
    const bodyData = {
      ticket_id: rowData.ticket_id,
    };
    openTicketAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          navigate("/ticket-detail", { state: { ticket: rowData } });
          toggleModal();
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
    getDashboard();
  }, [location]);
  const getDashboard = () => {
    dashboardAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setComplaints(res.data.data.cardData);
          localStorage.setItem(
            "sideBar",
            JSON.stringify(res?.data?.data?.sideBar)
          );
          setTableData(res.data.data.tableData);
          setIsLoading(false);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch-->", err);
      });
  };

  const onChangeOTP = (OTP) => {
    setOtp(OTP);
  };
  const handleConfirm = (row) => {
    setConfirmModalOpen(!isConfirmModalOpen);
    setRowData(row);
    return false;
    setRowData(row);
    const data = {
      ticket_id: row?.ticket_id,
    };
    generateOtpAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          setConfirmModalOpen(!isConfirmModalOpen);
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

  const toggleConfirmModal = () => {
    setConfirmModalOpen(!isConfirmModalOpen);
  };
  const toggleOtpModal = () => {
    setOtpModal(!otpModal);
  };
  const onVerifyOtp = () => {
    const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const key = encrypt(myKey);
    const data = {
      otp: otp,
      ticket_id: rowData?.ticket_id,
      key: key,
    };

    verifyOtpAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          setConfirmModalOpen(false);
          setOtpModal(false);
          togglePayment();
          setRNumber(res?.data?.data?.receipt_no);
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
  const onTicketClose = () => {
    const data = {
      ticket_id: rowData?.ticket_id,
    };
    generateOtpAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          toggleOtpModal();
          // setConfirmModalOpen(!isConfirmModalOpen);
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

  const handleResendOtp = async () => {
    const data = {
      ticket_id: rowData?.ticket_id,
    };

    try {
      const response = await generateOtpAPI(data, tokenHeader);
      if (response.data.status === "success") {
        toast.success("OTP resent successfully");
        setOtp("");
        setResetOtp(true);
        setOtpSent(true);
        setOtpModal(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handlePayment = (data) => {
    if (data?.warranty && data?.repairCheckValue == "Purchase") {
      payment("", data);
    } else {
      switch (selectedOption) {
        case "UPI":
          handleOnlinePayment(data);
          break;
        case "Cash":
          toggleCashPayment(!cashPaymentModal);
          // payment("Cash", data);
          break;
        case "HDFC Payment Gateway":
          toast.success("hdfc");
          break;
        default:
          break;
      }
    }
  };
  const payment = (mode, data, receipt) => {
    setIsLoading(true);
    const bodyData = {
      mode: mode || "",
      ticket_id: data?.ticket_id,
      receipt_no: mode == "Cash" ? receipt?.receipt_no : null,
      data: data,
    };

    // return false
    closeTicketAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          setConfirmModalOpen(false);
          setOtpModal(false);
          setPaymentModal(false);
          setCashPaymentModal(false);
          getDashboard();
          setIsLoading(false);
          if (mode == "") {
            setPaymentModal(false);
          }
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
  const handleOnlinePayment = (data) => {
    // console.log("data--->", data);
  };

  return (
    <>
      <div className="fluid-container">
        <Breadcrumbs
          mainTitle="Dashboard"
          parent=""
          subParent=""
          title="Dashboard"
        />
      </div>

      <div className="row widget-grid">
        <div className="col-lg-4 col-md-4 col-sm-6 box-col-6">
          <div className="card profile-box">
            <div className="card-body">
              <div className="media media-wrapper justify-content-between">
                <div className="media-body">
                  <div className="greeting-user">
                    <h4 className="f-w-600 text-white">Welcome to ALIMCO</h4>
                    <p className="text-white">
                      Here whats happing in your account today
                    </p>
                    <div className="whatsnew-btn">
                      <a className="btn btn-outline-white">Whats New !</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cartoon">
                <img
                  className="img-fluid"
                  src={img1}
                  alt="vector women with laptop"
                  width="280px"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-6 box-col-6">
          <div className="row">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="col-xl-6 col-md-6">
                <a>
                  <div className="card widget-1">
                    <div className="card-body">
                      <div className="widget-content">
                        <div
                          className={`widget-round ${getColorClass(
                            complaint.type
                          )}`}
                        >
                          <div className="bg-round">
                            <img
                              src={`${base_url + "/" + complaint.imgSrc}`}
                              width="30"
                              alt={complaint.type}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div>
                          <h4>{complaint.count}</h4>
                          <span className="f-light">{complaint.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
        <MyDataTable
          export={userDetail?.user_type !== "CC"} // Conditionally include export
          search="search by tickets id/customer name/product name"
          name={"Ticket List"}
          columns={columns}
          title={"Ticket List"}
          isLoading={isLoading}
          data={tableData}
          fileName={"Ticket List"}
        />
      </div>
      <OpenTicketModal
        isOpen={isOpen}
        toggle={toggleModal}
        name={rowData?.ticket_id}
        onClick={openTicket}
      />
      <OtpConfirmation
        isOpen={otpModal}
        otp={otp}
        setOtp={setOtp}
        resetOtp={setResetOtp}
        onVerifyOtp={onVerifyOtp}
        toggle={toggleOtpModal}
        handleResendOtp={handleResendOtp}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onTicketClose={onTicketClose}
        name={rowData?.ticket_id}
        toggle={toggleConfirmModal}
      />
      {rowData && (
        <PaymentModal
          toggle={togglePayment}
          isOpen={paymentModal}
          data={rowData}
          paymentOptions={paymentOptions}
          handleOptionChange={handleOptionChange}
          selectedOption={selectedOption}
          calculateTotalAmount={calculateTotalAmount}
          calculateTotalWithGST={calculateTotalWithGST}
          calculateServiceCharge={calculateServiceCharge}
          calculateDiscount={calculateDiscount}
          handlePayment={handlePayment}
        />
      )}
      {
        <CashModalOpen
          toggle={toggleCashPayment}
          show={cashPaymentModal}
          data={rowData}
          handlePayment={payment}
          receipt={rNumber}
          isLoading={isLoading}
        />
      }
    </>
  );
};

export default Dashboard;
