import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
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
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { aasraListAPI } from "../../api/dropdowns";
// import { revenueReportsListAPI } from "../../api/revenue";
import { revenueReportsListAPI } from "../../api/revenue";
import useLogout from "../../util/useLogout";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { printJobCard, printJobCardBulk } from "../../util/myPrint";
import { FaRegAddressCard } from "react-icons/fa";
import { ticketListAPI } from "../../api/ticket";
import { filterByTicketId } from "../../util/myFunction";
import SalesDetailModal from "../../Components/MyComponents/Modal/SalesDetailModal";
import { BsEye } from "react-icons/bs";

const RevenueReports = () => {
  const logout = useLogout();
  const userToken = localStorage.getItem("accessToken");
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
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
    formState: { errors },
  } = useForm();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowdata, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rtoView, setRtoView] = useState(false);
  const [data, setData] = useState([
    //   {
    //     "total_amount": 478,
    //     "aasra_name": "AASRA SAHARSA KOSHI KCHHETRIYA BIKLANG",
    //     "month": "July - December",
    //     "type": 2
    // }
  ]);
  //it is called to use it in ticketDetail
  useEffect(() => {
    getTickets();
  }, []);
//initialize a with ticketDetail , it is var so that it is accessible inside a function
  var a;
  //api call
  const getTickets = () => {
    ticketListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setRowData(res.data.data.tableData || []);
        } else if (res.data.status == "failed") {
          setRowData([]);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
//handle onClick Function
  const printCard = (row) => {
    const ticketId = row.ticket_id;
    // console.log("RowData", filterByTicketId(ticketId, rowdata));
    getTicketId(ticketId);
  };
//fetch ticketId and send that id details to the job card function
  const getTicketId = (ticketId) => {
    // console.log("id and row data", ticketId, rowdata); // Assuming 'a' is defined and accessible in this scope
    const cardData = filterByTicketId(ticketId, rowdata); // Filtering the data
    // console.log(cardData); // Logging the filtered data
    printJobCardBulk(cardData); // Uncomment this if you have this function defined
  };
  const [aasraList, setAasraList] = useState([]);
  const [typeList, setTypeList] = useState([
    { value: 1, label: "Sales" },
    { value: 2, label: "Labour" },
  ]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleType = (data) => {
    setValue("type", data);
    trigger("type");
  };
  const handleAsraList = (data) => {
    setValue("aasra_name", data);
    trigger("aasra_name");
  };
  useEffect(() => {
    aasralist();
  }, []);
  const aasralist = () => {
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
//handle search click
  const onFormSubmit = (data) => {
    // console.log(data, "data");
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    // const searchData = {
    //   type: data.type?.value,
    //   aasra_id: data.aasra_name?.value,
    //   startDate: startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString() : null,
    //   endDate: endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString() : null

    // }
    const warrantyValue = data.warranty ? data.warranty.value : null;

    const searchData = {
      // rto:data.
      type: data.type?.value,
      warranty: warrantyValue,
      aasra_id: data.aasraId?.value || null,
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

    revenueReportsListAPI(searchData, token)
      .then((res) => {
        if (res.data.status === "success") {
          setData(res?.data?.data);
          toast.success(res.data.message);
        } else if (res.data.status == "failed") {
          setData([]);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  // console.log(data,"data");
  
  const tableColumn = [
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: false,
      wrap: true,
    },
    ...(data.some(item => item.ticket_id) ? [
      {
        name: "Ticket Id",
        selector: (row) => row.ticket_id,
        sortable: false,
        wrap: true,
      },
    ] : []),
    {
      name: "Aasra Name",
      selector: (row) => row.aasra_name,
      sortable: false,
      width: "250px",
      wrap: true,
    },
    {
      name: "Month",
      selector: (row) => row.month,
      sortable: true,
      wrap:true
    },
    {
      name: "Total Amount",
      selector: (row) => row.total_amount,
      sortable: true,
    },
    {
      name: "Taxable Amount",
      selector: (row) => row.taxable_amount,
      sortable: true,
    },
    {
      name: "Rate GST",
      selector: (row) => parseFloat(row.rate_gst).toFixed(2),
      sortable: true,
    },
    {
      name: "GST",
      selector: (row) => parseFloat(row.gst).toFixed(2),
      sortable: true,
    },
    {
      name: "Invoice Value",
      selector: (row) => row.invoice_value,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <>
            <div className="d-flex flex-wrap">
              {row?.type === "RTU" ? (
                <>
                  <div>
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
                      onClick={() => {
                        setSelectedRow(row); // Pass the selected row, not the entire data
                        setShowModal(true); // Open the modal
                      }}
                      size="xs"
                    >
                      <BsEye style={{ height: ".8rem", width: ".8rem" }} />
                    </Button>
                    <ToolTip id="view" name="View Details" option="top" />
                  </div>
                </>
              ) : (
                <div className="d-flex flex-wrap">
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
                    onClick={() => printCard(row)}
                    size="xs"
                  >
                    <FaRegAddressCard
                      style={{ height: ".8rem", width: ".8rem" }}
                    />
                  </Button>
                  <ToolTip id="printJobCard" name="Print Card" option="top" />
                </div>
              )}
            </div>
          </>
        );
      },
      sortable: true,
    },
  ];
  return (
    <>
      <Breadcrumbs
        mainTitle="Revenue Report"
        parent=""
        title="Revenue Report"
      />
      {/* <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={handleSubmit(onFormSubmit)} onKeyDown={(e)=>{
               e.preventDefault(); // Prevent default form submission
               handleSubmit(onFormSubmit)()
            }}>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>{"Revenue Reports"}</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={`3`}>
                        <div className="form-group">
                          <Label className="from-label" htmlFor="state">
                            Type
                          </Label>
                          <div className="form-control-wrap">
                            <Select
                              className="select"
                              id="type"
                              {...register("type", {
                                required: "Select Type is required",
                              })}
                              options={typeList}
                              placeholder={"Select Type"}
                              value={watch(`type`)}
                              onChange={handleType}
                            />
                            {errors.type && (
                              <p className="invalid">
                                {errors.type.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </Col>
                      {(user?.user_type == "A" || user?.user_type == "S") && <Col md={`3`}>
                        <div className="form-group">
                          <Label className="from-label" htmlFor="district">
                            Assra
                          </Label>
                          <div className="form-control-wrap">
                            <Select
                              className="select"
                              id="aasra_name"
                              {...register("aasra_name", {
                                required: "Aasra is required",
                              })}
                              options={aasraList}
                              placeholder={"Select Aasra"}
                              value={watch(`aasra_name`)}
                              onChange={handleAsraList}
                            />
                            {errors.aasra_name && (
                              <p className="invalid">
                                {errors.aasra_name.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </Col>}
                      <Col sm="3">
                        <Label className="form-label">Start Date</Label>
                        <DatePicker
                          className="form-control"
                          placeholderText="Please Select Start Date"

                          {...register("startDate", {
                            required: "Start Date is required",
                          })}
                          onChange={(date) => {
                            setValue("startDate", date)
                            setStartDate(date)
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
                          <p className="invalid">
                            {errors.startDate.message}
                          </p>
                        )}
                      </Col>
                      <Col sm="3">
                        <Label className="form-label">End Date</Label>
                        <DatePicker
                          className="form-control"
                          placeholderText="Please Select End Date"
                          {...register("endDate", {
                            required: "End Date is required",
                          })}
                          onChange={(date) => {
                            setValue("endDate", date)
                            setEndDate(date)
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
                          <p className="invalid">
                            {errors.endDate.message}
                          </p>
                        )}
                      </Col>
                      <Col md="2" className="mt-top">
                        <Button color="primary" size="md">
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Form>
          </Col>

        </Row>
      </Container> */}

      <Row>
        <Col sm="12">
          <MyDataTable
            rtoProduct
            export
            required
            SearchCall
            aasraType
            Type
            warranty
            dateFilter
            onFormSubmit={onFormSubmit}
            search="search by aasra name"
            name="Revenue Reports"
            title="Revenue Reports List"
            isLoading={isLoading}
            columns={tableColumn}
            data={data}
            fileName={"Revenue Report"}
          />
        </Col>
      </Row>
      <SalesDetailModal
        show={showModal}
        handleClose={() => setShowModal(false)} // Close modal handler
        salesData={selectedRow} // Pass selected row data to the modal
      />
    </>
  );
};

export default RevenueReports;
