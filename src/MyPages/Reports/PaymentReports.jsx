import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Label,
  Row,
  Button,
} from "reactstrap";
import { aasraListAPI } from "../../api/dropdowns";
import Select from "react-select";
import DatePicker from "react-datepicker";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { paymentReportAasraAPI, paymentReportListAPI } from "../../api/revenue";
import { toast } from "react-toastify";
import { RUPEES_SYMBOL } from "../../Constant";
import { istToCustomFormat } from "../../util/myFunction";

const PaymentReports = () => {
  const userToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("userDetail"));
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
  const [data, setData] = useState([]);
  const [tableColumn, setTablecolumn] = useState([
    // {
    //   name: "Sr.no.",
    //   selector: (row) => row.serial_no,
    //   sortable: false,
    //   // cell: (row, index) => index + 1  //RDT provides index by default
    // },
    {
      name: "Aasra Name",
      selector: (row) => row.aasraName,
      sortable: true,
      width: "150px",
      wrap:true
    },
    {
      name: "Aasra Code",
      selector: (row) => row.aasraCode,
      sortable: true,
      width: "150px",
      wrap:true
    },
    {
      name: "Transaction ID",
      selector: (row) => row.transaction_id,
      sortable: true,
      width: "150px",
      wrap:true
    },
    {
      name: "Order Date",
      selector: (row) => row.order_date,
      sortable: true,
      width: "150px",
    },
    {
      name: "Order Status",
      selector: (row) => (
        <span
          className={
            row.order_status == "Paid"
              ? "badge badge-light-success"
              : row.order_status == "Received"
                ? "badge badge-light-success"
                : "badge badge-light-primary"
          }
        >
          {row.order_status}
        </span>
      ),
      hide: 370,
      width: "150px",
    },
    {
      name: "Order Amount",
      selector: (row) => `${RUPEES_SYMBOL}${row.order_amount}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Paid Amount",
      selector: (row) => `${RUPEES_SYMBOL}${row.paid_amount}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Balance (if any)",
      selector: (row) => `${RUPEES_SYMBOL}${(row.balance).toFixed(2)}`,
      sortable: true,
      width: "145.5px",
    },
    {
      name: "Payment Date",
      selector: (row) => istToCustomFormat(row.payment_date),
      sortable: true,
      hide: 370,
      width: "160px",
    },
    {
      name: "Payment Method",
      selector: (row) => row.payment_method,
      sortable: true,
      width: "160px",
    },
    {
      name: "Payment Status",
      selector: (row) => (
        <span
          className={
            row.payment_status == "Paid"
              ? "badge badge-light-success"
              : row.payment_status == "Pending"
                ? "badge badge-light-warning"
                : "badge badge-light-primary"
          }
        >
          {row.payment_status}
        </span>
      ),
      hide: 370,
      width: "190px",
    },
    {
      name: "DPS Number",
      selector: (row) => row.dps_no || "-",
      sortable: true,
      width: "140px",
      hide: 370,
    },
    {
      name: "DPS Date",
      selector: (row) =>istToCustomFormat( row.dps_date),
      sortable: true,
      hide: 370,
    },
    {
      name: "DPS Value",
      selector: (row) =>  row.dps_value,
      sortable: true,
      hide: 370,
      width: "140px",
    },
  ]);
  const [aasraList, setAasraList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
        if (res.data.status === "success") {
          setAasraList(res.data.data);
        } 
      })
      .catch((err) => {
        console.log("Error in API call:", err);
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
      startDate: data.startDate ? new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)).toISOString() : null,
      endDate: data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate())).toISOString() : null
    };
    const handleApiResponse = (res) => {
      if (res.data.status === "success") {
        setData(res.data.data);
        toast.success(res.data.message);
      } else if (res.data.status == "failed") {
        toast.error(res.data.message);
        setData([])
      }
    };
    const handleApiError = (errors) => {
      setData([]);
      toast.error("Error fetching payment reports");
    };

    if (user?.user_type === "A" || user?.user_type === "S") {
      searchData.aasra_id = data.aasraId?.value || null;
      paymentReportListAPI(searchData, token)
        .then(handleApiResponse)
        .catch(handleApiError)
        .finally(() => {
          setIsLoading(false);
        });
    } else if (user?.user_type === "AC") {
      paymentReportListAPI(searchData, token)
        .then(handleApiResponse)
        .catch(handleApiError)
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Payment Reports"
        parent=""
        title="Payment Reports"
      />
      {/* <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={handleSubmit(onFormSubmit)}  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      handleSubmit(onFormSubmit)(); // Trigger the form submission handler
    }
  }}>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>{"Payments Reports"}</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {(user?.user_type === "A" || user?.user_type === "S") && (
                        <Col md="3">
                          <div className="form-group">
                            <Label className="from-label" htmlFor="aasra_name">
                              Aasra
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
                                value={watch("aasra_name")}
                                onChange={handleAsraList}
                              />
                              {errors.aasra_name && (
                                <p className="invalid">
                                  {errors.aasra_name.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </Col>
                      )}
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
             export
            SearchCall
            aasraType
            dateFilter
            onFormSubmit={onFormSubmit}
            search="search by transaction id / DPS number "
            name="Payments Reports"
            title="Payments Reports List"
            isLoading={isLoading}
            columns={tableColumn}
            data={data}
            fileName={"Payments Report"}
          />
        </Col>
      </Row>
    </>
  );
};

export default PaymentReports;
