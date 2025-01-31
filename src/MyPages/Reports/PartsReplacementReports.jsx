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
import { partsReplacementListAPI } from "../../api/revenue";
import useLogout from "../../util/useLogout";
import { RUPEES_SYMBOL } from "../../Constant";
import { ticketListAPI } from "../../api/ticket";
import { filterByTicketId } from "../../util/myFunction";
import { printJobCardBulk } from "../../util/myPrint";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegAddressCard } from "react-icons/fa";

const PartsReplacementReports = () => {
  const logout = useLogout();
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
  const [rowdata, setRowData] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    getTickets();
  }, []);
  var a;
  const getTickets = () => {
    ticketListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          a = res.data.data.tableData;
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

  const printCard = (row) => {
    const ticketId = row.ticket;
    getTicketId(ticketId);
  };

  const getTicketId = (ticketId) => { // Assuming 'a' is defined and accessible in this scope
    const cardData = filterByTicketId(ticketId, a); // Filtering the data
    printJobCardBulk(cardData); // Uncomment this if you have this function defined
  };

  const [tableColumn, setTablecolumn] = useState([
    {
      name: "Aasra Name",
      selector: (row) => row.aasra_name,
      sortable: true,
      width: "180px",
      wrap: true,
    },
    {
      name: "Ticket Id",
      selector: (row) => row.ticket,
      sortable: false,
      wrap: true,
    },
    {
      name: "Beneficiary Name",
      selector: (row) => row.beneficery_name,
      sortable: true,
      width: "160px",
      wrap:true
    },
    {
      name: "Spare Parts",
      selector: (row) => row.spare_part,
      sortable: true,
      width: "160px",
      wrap: true,
    },
    {
      name: "Sr. No. of Damaged Product",
      selector: (row) => row.serial_no_of_damaged_product,
      sortable: true,
      width: "250px",
    },
    {
      name: "In/Out Warranty",
      selector: (row) => row.warranty,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          {row.warranty ? (
            <span className="badge badge-success">In Warranty</span>
          ) : (
            <span className="badge badge-warning">Out of Warranty</span>
          )}
        </div>
      ),
    },
    {
      name: "Make",
      selector: (row) => row.make,
      sortable: true,
    },
    {
      name: "Old Material Code",
      selector: (row) => row.old_material_code,
      sortable: true,
      width: "180px",
    },
    {
      name: "SAP Material Code",
      selector: (row) => row.sap_material_code_code,
      sortable: true,
      width: "180px",
    },
    {
      name: "Material Description",
      selector: (row) => row.material_description,
      sortable: true,
      width: "180px",
    },
    {
      name: "Unit of Measurement",
      selector: (row) => row.unit_of_measurement,
      sortable: true,
      width: "180px",
    },
    {
      name: "Date of Replacement",
      selector: (row) => row.date_of_replacement,
      sortable: true,
      width: "180px",
      wrap:true
    },
    { name: "Qty", selector: (row) => row.quantity, sortable: true },
    {
      name: "Labour Rate",
      selector: (row) => row.labour_rate,
      sortable: true,
      width: "130px",
    },
    {
      name: "Labour Amount",
      selector: (row) => `${row.labour_amount}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Distributed Old Product Code",
      selector: (row) => row.distributed_old_product_code,
      sortable: true,
      width: "240px",
    },
    {
      name: "Distributed SAP Product Code",
      selector: (row) => row.distributed_sap_productcode,
      sortable: true,
      width: "250px",
    },
    {
      name: "Scheme(ADIP/RVP/Cash)",
      selector: (row) => row.Scheme_adip_rvy_cash,
      sortable: true,
      width: "210px",
    },
    {
      name: "Date of Distribution",
      selector: (row) => row.date_of_distribution,
      sortable: true,
      width: "180px",
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="d-flex flex-wrap">
          <div>
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
              <FaRegAddressCard style={{ height: ".8rem", width: ".8rem" }} />
            </Button>
            <ToolTip id={"printJobCard"} name={"Print Card"} option={"top"} />
          </div>
        </div>
      ),
      sortable: true,
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
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error in API call:", err);
      });
  };

  const onFormSubmit = (data) => {
    setIsLoading(true);
    const warrantyValue = data.warranty ? data.warranty.value : null;
    const searchData = {
      warranty: warrantyValue,
      aasra_id: data?.aasraId?.value || null,
      spare_id: data?.spareType?.value || null,
      startDate: data?.startDate
        ? new Date(
            new Date(data?.startDate).setDate(
              new Date(data?.startDate).getDate() + 1
            )
          ).toISOString()
        : null,
      endDate: data?.endDate
        ? new Date(
            new Date(data?.endDate).setDate(new Date(data?.endDate).getDate())
          ).toISOString()
        : null,
    };
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };

    const handleApiResponse = (res) => {
      if (res.data.status === "success") {
        setData(res.data.data);
        toast.success(res.data.message);
      } else if (res.data.status == "failed") {
        setData([" "]);
        toast.error(res.data.message);
      } else if (res.data.status == "expired") {
        logout(res.data.message);
      }
    };

    const handleApiError = (errors) => {
      toast.error("Error fetching payment reports");
    };

    if (user?.user_type === "S" || user?.user_type === "A") {
      partsReplacementListAPI(searchData, token)
        .then(handleApiResponse)
        .catch(handleApiError)
        .finally(() => {
          setIsLoading(false);
        });
    } else if (user?.user_type === "AC") {
      partsReplacementListAPI(searchData, token)
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
        mainTitle="Replacement Reports"
        parent=""
        title="Replacement Reports"
      />

      {/* <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={handleSubmit(onFormSubmit)} onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      handleSubmit(onFormSubmit)(); // Trigger the form submission handler
    }
  }}>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>{"Replacement Reports"}</h5>
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
                        setValue("startDate",date)
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
                        setValue("endDate",date)
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
            warranty
            spareType
            dateFilter
            onFormSubmit={onFormSubmit}
            search="search by name of aasra/beneficery name/serial no. of damaged product/old material code/SAP material code/distributed old product code/distributed SAP product code"
            name="Replacement Reports"
            title="Replacement Reports List"
            isLoading={isLoading}
            columns={tableColumn}
            data={data}
            fileName={"Replacement Reports"}
          />
        </Col>
      </Row>
    </>
  );
};

export default PartsReplacementReports;
