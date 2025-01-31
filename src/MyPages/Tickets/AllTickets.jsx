import React, { useContext, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { Button, Card, CardBody, Col, Label, Row, Spinner } from "reactstrap";
import ProjectContext from "../../_helper/Project";
import { Breadcrumbs } from "../../AbstractElements";
import {
  closeTicketAPI,
  generateOtpAPI,
  openTicketAPI,
  ticketListAPI,
  verifyOtpAPI,
} from "../../api/ticket";
import ConfirmModal from "../../Components/MyComponents/Modal/ConfirmModal";
import OpenTicketModal from "../../Components/MyComponents/Modal/OpenTicketModal";
import OtpConfirmation from "../../Components/MyComponents/Modal/OtpConfirmation";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import {
  handleClosedTicketPrint,
  handleClosedTicketPrintBulk,
  printForm,
  printJobCard,
  printJobCard1,
  printJobCardBulk,
} from "../../util/myPrint";
import useLogout from "../../util/useLogout";
import { aasraListAPI } from "../../api/dropdowns";
import { useForm } from "react-hook-form";
import { NewVisits } from "../../Constant";
import PaymentModal from "../../Components/MyComponents/Modal/PaymentModal";
import CashModalOpen from "../../Components/MyComponents/Modal/CashModalOpen";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { BsEye, BsPrinter } from "react-icons/bs";
import { FaRegCheckCircle, FaRegAddressCard } from "react-icons/fa";
import { displayRazorpay } from "../Razorpay/RazorPay";
import { decrypt, encrypt } from "../../security/Encrpt";
const AllTickets = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm();
  const logout = useLogout();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [verifyCount, setVerifyCount] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [otpModal, setOtpModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState(null);
  const [resetOtp, setResetOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [aasraList, setAasraList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rNumber, setRNumber] = useState(null);

  //!Payment Modal
  const [paymentModal, setPaymentModal] = useState(false);
  const [cashPaymentModal, setCashPaymentModal] = useState(false);
  const togglePayment = () => {
    setPaymentModal(!paymentModal);
  };
  const toggleCashPayment = () => {
    setCashPaymentModal(!cashPaymentModal);
    setIsLoading(false);
  };
  const paymentOptions = ["Cash"];
  const [selectedOption, setSelectedOption] = useState(paymentOptions[0]);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [selectedJobcardRow, setSelectedJobcardRow] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // State to track "Select All" checkbox

  // Function to handle "Select All" checkbox
  // const handleSelectAllChange = () => {
  //   const allEnabledRowsSelected = tableData.map((row) =>
  //     row?.ticketDetail?.length > 0 ? true : false
  //   ); // Select all enabled rows
  //   // Collect all selected rows' data
  //   const selectedRowsData = tableData.filter(
  //     (row) => row?.ticketDetail?.length > 0
  //   );
  //   setSelectedJobcardRow(selectAll ? [] : allEnabledRowsSelected); // Clear or select based on "selectAll" state
  //   setSelectAll(!selectAll); // Toggle "Select All" state
  //   // Log all selected rows' data
  //   console.log("Selected Rows Data:", selectAll ? [] : selectedRowsData);
  //   // Call bulkJobCardPrint function with selected rows data
  //   bulkJobCardPrint(selectAll ? [] : selectedRowsData);
  // };

  // Function to handle individual checkbox change
  // const handleCheckboxChange = (row, index) => {
  //   const updatedSelection = [...selectedJobcardRow]; // Copy the current selection state
  //   updatedSelection[index] = !updatedSelection[index]; // Toggle the checkbox for the specific row
  //   setSelectedJobcardRow(updatedSelection); // Update the state
  //   console.log("SelectedRow", row);
  //   // Filter the rows that are selected based on updatedSelection
  //   const selectedRowsData = tableData.filter(
  //     (_, idx) => updatedSelection[idx]
  //   );
  //   // Call bulkJobCardPrint function with selected rows data
  //   bulkJobCardPrint(selectedRowsData);
  // };

  // Function to handle bulk job card printing
  // const bulkJobCardPrint = (selectedRowsData) => {
  //   // Perform the bulk printing operation here
  //   // printJobCardBulk(selectedRowsData);

  //   if (selectedRowsData.length > 0) {
  //     console.log("Printing job cards for selected rows:", selectedRowsData);
  //     // Add your bulk print logic here
  //   } else {
  //     console.log("No rows selected for printing.");
  //   }
  // };

  const columns = [
    {
      name: "Ticket Id",
      selector: (row) => (
        <div>
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
                <span>{row?.ticket_id}</span>
              )}
            </>
          )}
        </div>
      ),
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Warranty Status/Expire Date",
      selector: (row) => (
        <>
          <span
            className={
              row.warranty
                ? "badge badge-light-success" :
                "badge badge-light-danger"
            }

          >
            {row?.warranty ? "In Warranty" : "Out of Warranty"}
          </span><br></br>
          <span>{row?.expire_date?.includes("Invalid") ? "" : row?.expire_date}</span>
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
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Problem",
      selector: (row) => row.problem,
      sortable: true,
      hide: 370,
      wrap: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },

    {
      name: "Appointment Date",
      selector: (row) => row.appointment_date,
      sortable: true,
      hide: 370,
      minWidth: "190px",
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
      hide: 370,
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

  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [toggleCleared, setToggleCleared] = useState(false);
  const [rowSelected, setRowSelected] = useState(false);
  const rowDisabledCriteria = (row) => {
    return (
      (row.status === "Open" || row.status === "Pending") &&
      !row?.ticketDetail?.length > 0
    ); // Disable rows with status "Open"
  };
  // Fetch data here and setTableData...

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const [allTicketDetails, setallTicketDetails] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log(tableData, "table Data");
    // console.log("Selected Closed Ticket and Job Card ", selectedRows);
    // let allTicketDetails = []; // Declare an array to store all ticket details
    selectedRows.forEach((row) => {
      row.ticketDetail.forEach((ticket) => {
        // console.log(ticket, "Ticket Detail");
        allTicketDetails.push(ticket); // Collect each ticket detail
      });
    });
    // Now you can access all collected ticket details outside the loop
    // console.log(allTicketDetails, "All Ticket Details");
  }, [selectedRows]);
  const handleBulkPrint = () => {
    // Filter selected rows that have status "Closed"
    const closedRows = selectedRows?.filter((row) => row?.status === "Closed");

    if (closedRows?.length > 0) {
      // Only handle the closed tickets
      // console.log("Selected Rows for Bulk Print (Closed Tickets):", closedRows);
      handleClosedTicketPrintBulk(closedRows);
    }

    // For the open rows, you can implement the bulk print logic here as needed
    const openRows = selectedRows?.filter(
      (row) => row?.status === "Open" && row?.ticketDetail?.length > 0
    );

    if (openRows?.length > 0) {
      // console.log("Selected Rows for Bulk Print (Open Tickets):", openRows);
      // Implement bulk print logic for open rows if needed
    }
  };

  const handleBulkPrintJobCard = () => {
    // if (selectedRows?.ticketDetail?.length > 0) {
    // Implement the bulk print logic here
    // console.log("Selected Rows for Bulk Print:", selectedRows);
    printJobCardBulk(selectedRows);
    // }
  };

  const handleEdit = (row) => {
    // console.log(row);
    navigate(`${process.env.PUBLIC_URL}/ticket-detail`, {
      state: { ticket: row },
    });
  };

  const handleAasraId = (selectedOption) => {
    setValue("aasraId", selectedOption);
    trigger("aasraId");
  };
  useEffect(() => {
    getTickets();
  }, []);
  const getTickets = () => {
    ticketListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data.data.tableData || []);
          // console.log("data", res.data.data.tableData[0].status);
        } else if (res.data.status == "failed") {
          setTableData([]);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
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
      ticket_id: rowData?.ticket_id,
    };
    openTicketAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
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
  const handleConfirm = (row) => {
    setRowData(row);
    setConfirmModalOpen(!isConfirmModalOpen);
    return false;
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
  const onChangeOTP = (OTP) => {
    setOtp(OTP);
  };

  const onVerifyOtp = () => {
    setIsLoading(true);
    setVerifyCount(true);
    const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const key = encrypt(myKey);

    const data = {
      otp: otp || "",
      ticket_id: rowData?.ticket_id,
      key: key,
    };
    let timer = null;
    // Start countdown timer
    timer = setInterval(() => {
      setResetTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          setVerifyCount(false);
          return 0;
        } else {
          return prevTimer - 1; // Decrease timer by 1 second
        }
      });
    }, 1000);

    verifyOtpAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success" && res.data.data.key == myKey) {
          setConfirmModalOpen(false);
          setOtpModal(false);
          setRNumber(res?.data?.data?.receipt_no);
          togglePayment();
          setIsLoading(false);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
          toast.error(res.data.message);
          setResetTimer(res.data.data.timer || 0);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
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

  const handleCreate = () => { };

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

  useEffect(() => {
    getAasraDropdown();
  }, []);

  const getAasraDropdown = () => {
    aasraListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setAasraList(res.data.data);
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
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    const searchData = {
      aasra_id: data.aasraId?.value,
      startDate: data.startDate
        ? new Date(
          new Date(data.startDate).setDate(
            new Date(data.startDate).getDate() + 1
          )
        ).toISOString()
        : null,
      endDate: data.endDate
        ? new Date(
          new Date(data.endDate).setDate(new Date(data.endDate).getDate())
        ).toISOString()
        : null,
    };
    setIsLoading(true);
    ticketListAPI(searchData, token)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data.data.tableData || []);
          toast.success(res.data.message);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
        setIsLoading(false);
      })

      .catch((err) => {
        console.log("catch", err);
      });
  };
  const handlePayment = (data) => {
    if (data?.warranty && data?.repairCheckValue == "Purchase") {
      payment("", data);
    } else {
      switch (selectedOption) {
        case "UPI":
          toast.success("upi");
          displayRazorpay(data, tokenHeader);
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
    // console.log(data, "pppp");
    // return false
    const bodyData = {
      mode: mode || "",
      ticket_id: data?.ticket_id,
      receipt_no: mode == "Cash" ? receipt?.receipt_no : null,
      data: data,
    };

    closeTicketAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          setConfirmModalOpen(false);
          setOtpModal(false);
          setPaymentModal(false);
          setCashPaymentModal(false);
          getTickets();
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

  const handleOnlinePayment = async (data) => {
    // console.log("data--->", data);
  };

  return (
    <>
      <Breadcrumbs mainTitle="Tickets" parent="" subParent="" title="Tickets" />
      <Row className=" widget-grid">
        {userDetail?.user_type == "AC" || userDetail?.user_type == "CC" ? (
          <Col
            className="mb-2"
            sm="12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div>
              <Link
                to={
                  userDetail?.user_type == "CC"
                    ? `${process.env.PUBLIC_URL}/create-call`
                    : `${process.env.PUBLIC_URL}/create-ticket`
                }
              >
                <Button color="primary" onClick={handleCreate}>
                  Create Ticket
                </Button>
              </Link>
            </div>
          </Col>
        ) : null}
        {/* <div className="col-sm-12">
          <Card>
            <CardBody>
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent default form submission
                    handleSubmit(onFormSubmit)(); // Trigger the form submission handler
                  }
                }}
              >
                <Row>
                  {(user?.user_type == "A" || user?.user_type == "S") && (
                    <>
                      <Col sm="4">
                        <Label className="form-label">Aasra</Label>
                        <Select
                          className="select"
                          id="aasraId"
                          {...register("aasraId", {
                            required: "Aasra is required",
                          })}
                          options={aasraList}
                          placeholder="Select Aasra"
                          value={watch(`aasraId`)}
                          onChange={handleAasraId}
                        />
                        {errors.aasraId && (
                          <p className="invalid">{errors.aasraId.message}</p>
                        )}
                      </Col>
                    </>
                  )}
                  <Col sm="4">
                    <Label className="form-label">Start Date</Label>
                    <DatePicker
                      className="form-control"
                      placeholderText="Please Select Start Date"
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
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                    />

                    {errors.startDate && (
                      <p className="invalid">{errors.startDate.message}</p>
                    )}
                  </Col>
                  <Col sm="4">
                    <Label className="form-label">End Date</Label>
                    <DatePicker
                      className="form-control"
                      placeholderText="Please Select End Date"
                      {...register("endDate", {
                        required: "End Date is required",
                      })}
                      onChange={(date) => {
                        setValue("endDate", date);
                        setEndDate(date);
                        trigger("endDate");
                      }}
                      selected={endDate}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                    />
                    {errors.endDate && (
                      <p className="invalid">{errors.endDate.message}</p>
                    )}
                  </Col>
                  <Col sm="4" className="mt-4">
                    <Label></Label>
                    <button className="btn btn-primary" type="submit">
                      Search
                    </button>
                  </Col>
                </Row>{" "}
              </form>
            </CardBody>
          </Card>
        </div> */}

        <div className="col-sm-12">
          <MyDataTable
            id="style"
            export={userDetail?.user_type !== "CC"} // Conditionally include export
            SearchCall
            aasraType
            dateFilter
            onFormSubmit={onFormSubmit}
            search="search by tickets id/customer name/product name"
            isLoading={isLoading}
            data={tableData}
            columns={columns}
            name={"Ticket List"}
            title={"Ticket List"}
            fileName={"Ticket List"}
            selectedRows={userDetail?.user_type !== "CC"}
            selectableRowDisabled={rowDisabledCriteria} // Pass the criteria function
            onRowSelected={handleRowSelected} // Pass the selection handler
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            Rows={selectedRows}
            print={handleBulkPrint}
            print2={handleBulkPrintJobCard}
            selected={rowSelected}
            ticketDetails={allTicketDetails}
            ticket
          // JobCardRows={selectedJobcardRow}
          // printJobCard={bulkJobCardPrint}
          />
        </div>
      </Row>
      {/* OPEN CLOSE OTP MODAL */}
      <OtpConfirmation
        isOpen={otpModal}
        otp={otp}
        setOtp={setOtp}
        resetTimer={resetTimer}
        isLoading={isLoading}
        verifyCount={verifyCount}
        resetOtp={setResetOtp}
        onVerifyOtp={onVerifyOtp}
        toggle={toggleOtpModal}
        handleResendOtp={handleResendOtp}
      />
      {/*CLOSE TICKET CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onTicketClose={onTicketClose}
        name={rowData?.ticket_id}
        toggle={toggleConfirmModal}
      />
      {/*OPEN TICKET CONFIRMATION MODAL */}
      <OpenTicketModal
        isOpen={isOpen}
        toggle={toggleModal}
        name={rowData?.ticket_id}
        onClick={openTicket}
      />
      {/* OPEN CLOSE PYAMENT MODAL */}
      {rowData && (
        <PaymentModal
          toggle={togglePayment}
          isOpen={paymentModal}
          data={rowData}
          isLoading={isLoading}
          paymentOptions={paymentOptions}
          handleOptionChange={handleOptionChange}
          selectedOption={selectedOption}
          handlePayment={handlePayment}
        />
      )}
      {/*CASH PYAMENT MODAL ON CLOSE TICKET*/}
      {
        <CashModalOpen
          toggle={toggleCashPayment}
          show={cashPaymentModal}
          data={rowData}
          isLoading={isLoading}
          receipt={rNumber}
          handlePayment={payment}
        />
      }
    </>
  );
};

export default AllTickets;
