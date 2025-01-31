import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Label, Row, Spinner } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { aasraListAPI, serviceNoteListAPI } from "../../api/dropdowns";
import useLogout from "../../util/useLogout";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { printForm } from "../../util/myPrint";
import Required from "../../Components/MyComponents/Required";
const ServiceNotes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    // {
    //   id: 1,
    //   name: "Test",
    //   address: "test address with home and locality",
    //   district: "Test District",
    //   state: "Test State",
    //   pin: "226010",
    //   mobile: "9859689568",
    //   aadhaar_no: "56458985985745",
    //   product_name:"product_name",
    //   product_code:"product_code",
    //   camp_name:"camp name",
    //   camp_detail:"camp detail",
    //   distribution_date:'12/08/2024',
    //   distribution_place:'distribution place',
    //   warranty:true,
    //   problem:"battery not working",
    //   attendant_name:"name of officer",
    //   complaint_resolution:"battery replaced",
    //   user_feedback:"feedback",
    //   ticket_close_date:'20/08-2024',
    //   complaint_Date:'05/08/2024'
    // },
    // {
    //   id: 2,
    //   name: "Test2",
    //   address: "test address with home and locality",
    //   district: "Test District2",
    //   state: "Test State2",
    //   pin: "226010",
    //   mobile: "9859689568",
    //   aadhaar_no: "56458985985745",
    //   product_name:"product_name",
    //   product_code:"product_code",
    //   camp_name:"camp name",
    //   camp_detail:"camp detail",
    //   distribution_date:'12/08/2024',
    //   distribution_place:'distribution place',
    //   warranty:true,
    //   problem:"battery not working",
    //   attendant_name:"name of officer",
    //   complaint_resolution:"battery replaced",
    //   user_feedback:"feedback",
    //   ticket_close_date:'20/08-2024',
    //   complaint_Date:'05/08/2024'
    // },
  ]);
  const [column, setColumn] = useState([
    {
      name: "Customer Name",
      selector: (row) => row?.user?.name,
      sortable: false,
      wrap: true,
    },
    {
      name: "District",
      selector: (row) => row?.customer?.district,
      sortable: false,
      wrap: true,
    },
    {
      name: "State",
      selector: (row) => row?.customer?.state,
      sortable: false,
      wrap: true,
    },
    {
      name: "Mobile",
      selector: (row) => row?.user?.mobile,
      sortable: false,
      wrap: true,
    },
    {
      name: "Aadhaar",
      selector: (row) => row?.customer?.aadhaar,
      sortable: false,
      wrap: true,
    },
    {
      name: "Product Name",
      selector: (row) => row?.item_name,
      sortable: false,
      wrap: true,
    },
    {
      name: "Product Code",
      selector: (row) => row?.item_id,
      sortable: false,
      wrap: true,
    },
    {
      name: "Distribution Date",
      selector: (row) => row.distribution_date,
      sortable: false,
      wrap: true,
    },
    {
      name: "Distribution Place",
      selector: (row) => row.distribution_place,
      sortable: false,
      wrap: true,
    },
    {
      name: "Warranty",
      selector: (row) =>
        row?.warranty == "1" ? "In warranty" : "Out of warranty",
      sortable: false,
      wrap: true,
    },
    {
      name: "Problem",
      selector: (row) => row.problem,
      sortable: false,
      wrap: true,
    },

    {
      name: "Complaint Date",
      selector: (row) => row.complaint_Date,
      sortable: false,
      wrap: true,
    },
    {
      name: "Ticket Close Date",
      selector: (row) => row.ticket_close_date,
      sortable: false,
      wrap: true,
    },
  ]);
  const [aasraTableList, setAasraTableList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  useEffect(() => {
    aasraList();
    // serviceNoteList()
  }, []);
  const aasraList = () => {
    aasraListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          setAasraTableList(res.data.data);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
          setData([]);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error in API call:", err);
      });
  };
  const serviceNoteList = () => {
    serviceNoteListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          console.log("res", res.data);
          // setAasraTableList(res.data.data);
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
  const handleAsraList = (data) => {
    setValue("aasra_name", data);
    trigger("aasra_name");
  };
  const handleWarranty = (selectedOption) => {
    setValue("warranty", selectedOption);
    trigger("warranty");
  };
  const handleSearch = (data) => {
    console.log("search", data);
    setIsLoading(true);
    const bodyData = {
      aasra_id: data?.aasra_name?.value,
      startDate: startDate
        ? new Date(
            new Date(startDate).setDate(new Date(startDate).getDate() + 1)
          ).toISOString()
        : null,
      endDate: endDate
        ? new Date(
            new Date(endDate).setDate(new Date(endDate).getDate())
          ).toISOString()
        : null,
      warranty: data?.warranty?.value,
    };
    serviceNoteListAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          setIsLoading(false);
          setData(res.data.data.totalData);
        } else if (res.data.status == "failed") {
          setData([]);
          toast.error(res.data.message);
          setIsLoading(false);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("Error in API call:", err);
      });
  };

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      console.log("selected rows", selectedRows);
      printForm(selectedRows);
    };

    return (
      <Button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: "red" }}
        icon
      >
        <i className="fa fa-print" /> Bulk Print
      </Button>
    );
  }, [data, selectedRows, toggleCleared]);

  // const isSunday = (date) => {
  //   const day = date.getDay();
  //   return day === 0; // 0 represents Sunday
  // };//! TO Disable Sunday from calender
  return (
    <>
      <Breadcrumbs mainTitle="Service Notes" parent="" title="Service Notes" />
      <Card>
        {/* <CardHeader>
          <h5>{"Service Notes"}</h5>
        </CardHeader> */}
        <CardBody>
          <form onSubmit={handleSubmit(handleSearch)}>
            <Row className="mb-5">
              {(user?.user_type === "A" || user?.user_type === "S") && (
                <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                  <div className="form-group">
                    <Label className="from-label" htmlFor="aasra_name">
                      Aasra <Required/>
                    </Label>
                    <div className="form-control-wrap">
                      <Select
                        className="select"
                        id="aasra_name"
                        {...register("aasra_name", {
                          required: "Aasra is required",
                        })}
                        options={aasraTableList}
                        placeholder={"select aasra"}
                        value={watch("aasra_name")}
                        onChange={handleAsraList}
                      />
                      {errors.aasra_name && (
                        <p className="invalid">{errors.aasra_name.message}</p>
                      )}
                    </div>
                  </div>
                </Col>
              )}
              <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                <Label className="form-label" htmlFor="startDate">
                  Start Date<Required/>
                </Label>
                <DatePicker
                  id="startDate"
                  className="form-control"
                  placeholderText="select start date"
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
                  showMonthDropdown
                  showYearDropdown
                  // filterDate={(date) => !isSunday(date)}//!To Disable Sunday from calender
                />

                {errors.startDate && (
                  <p className="invalid">{errors.startDate.message}</p>
                )}
              </Col>
              <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                <Label className="form-label" htmlFor="endDate">
                  End Date <Required/>
                </Label>
                <DatePicker
                  id="endDate"
                  className="form-control"
                  placeholderText="select end date"
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
                  showMonthDropdown
                  showYearDropdown
                />
                {errors.endDate && (
                  <p className="invalid">{errors.endDate.message}</p>
                )}
              </Col>
              <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                <Label className="form-label" htmlFor="warranty">
                  Warranty <Required/>
                </Label>
                <Select
                  className="select"
                  id="warranty"
                  {...register("warranty", {
                    required: "warranty is required",
                  })}
                  options={[
                    { label: "In warranty", value: 1 },
                    { label: "Out of warranty", value: 0 },
                  ]}
                  placeholder={"select warranty"}
                  value={watch(`warranty`)}
                  onChange={handleWarranty}
                />
                {errors.warranty && (
                  <p className="invalid">{errors.warranty.message}</p>
                )}
              </Col>
              <Col md="2" className="mt-top">
                <Button outline color="primary">
                  Search
                </Button>
              </Col>
            </Row>
          </form>

          <div className="data-table-container">
            <DataTable
              columns={column}
              data={data}
              id="style-2"
              title="Service Note List"
              pagination
              selectableRows
              responsive={true}
              striped={true}
              highlightOnHover={true}
              paginationRowsPerPageOptions={[25, 50, 100, 500]}
              paginationPerPage={25}
              persistTableHead
              progressPending={isLoading}
              progressComponent={
                <Spinner
                  color="primary"
                  style={{
                    height: "3rem",
                    width: "3rem",
                  }}
                  type="grow"
                >
                  Loading...
                </Spinner>
              }
              contextActions={contextActions}
              onSelectedRowsChange={handleRowSelected}
              clearSelectedRows={toggleCleared}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ServiceNotes;
