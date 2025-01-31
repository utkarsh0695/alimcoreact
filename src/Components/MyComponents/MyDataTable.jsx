import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// CSS Modules, react-datepicker-cssmodules.css
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { Export } from "./Export/Export";
import { useForm } from "react-hook-form";
import { aasraListAPI } from "../../api/dropdowns";
import useLogout from "../../util/useLogout";
import { toast } from "react-toastify";
import { IoArrowBackSharp } from "react-icons/io5";
import { listSparePartMasterAPI } from "../../api/master";
import UploadPartsSerial from "./Modal/UploadPartsSerial";
import { FaUpload } from "react-icons/fa";
import Required from "./Required";

const MyDataTable = (props) => {
  // console.log(props?.JobCardRows, "selected Row");
  // console.log(props?.printJobCard, "function Row");
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset
  } = useForm();
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState(props?.data);
  const defaultStartDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(new Date());
  const [isRtuProduct, setIsRtuProduct] = useState(false);

  const userToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const logout = useLogout();
  const [aasraList, setAasraList] = useState([]);
  const [spareTypeList, setSpareList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // console.log("Ticket PROPS", props?.ticket);
  // console.log("row data", props?.ticketDetails);
  useEffect(() => {
    let filteredData = props?.data;
    switch (props?.name) {
      case "Beneficiary List":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.beneficiary_id &&
              item.beneficiary_id.toLowerCase().includes(filter)) ||
            (item.mobile_no &&
              item.mobile_no.toString().toLowerCase().includes(filter)) ||
            (item.email && item.email.toLowerCase().includes(filter)) ||
            (item.name && item.name.toLowerCase().includes(filter)) ||
            (item.city?.city && item.city?.city.toLowerCase().includes(filter))||
            (item.udid && item.udid.toLowerCase().includes(filter))
          );
        });
        break;
      case "Aasra List":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.name_of_org &&
              item.name_of_org.toLowerCase().includes(filter)) ||
            (item.mobile_no &&
              item.mobile_no.toString().toLowerCase().includes(filter)) ||
            (item.address && item.address.toLowerCase().includes(filter)) ||
            (item.email && item.email.toLowerCase().includes(filter)) ||
            (item.name && item.name.toLowerCase().includes(filter)) ||
            (item.stateData?.name &&
              item.stateData?.name.toLowerCase().includes(filter)) ||
            (item.city?.city && item.city?.city.toLowerCase().includes(filter))
          );
        });
        break;
      case "Revenue Reports":
        filteredData = props?.data?.filter((item) => {
          const filter = filterText?.toLowerCase();
          return (
            item.aasra_name && item.aasra_name.toLowerCase().includes(filter)
          );
        });
        break;
      case "Inventory Reports":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.item_name && item.item_name.toLowerCase().includes(filter)) ||
            (item.item_id &&
              item.item_id.toString().toLowerCase().includes(filter))
          );
        });
        break;
      case "Service Charge":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.product_name &&
              item.product_name.toLowerCase().includes(filter)) ||
            (item.aasra_id &&
              item.aasra_id.toString().toLowerCase().includes(filter)) ||
            (item.product_id && item.product_id.toLowerCase().includes(filter))
          );
        });
        break;
      case "Service History":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.aasra_name &&
              item.aasra_name.toLowerCase().includes(filter)) ||
            (item.ticket_no &&
              item.ticket_no.toString().toLowerCase().includes(filter)) ||
            (item.product_name &&
              item.product_name.toLowerCase().includes(filter))
          );
        });
        break;
      case "Ticket List":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.ticket_id &&
              item.ticket_id.toString().toLowerCase().includes(filter)) ||
            (item.customer_name &&
              item.customer_name.toLowerCase().includes(filter)) ||
            (item.product_name &&
              item.product_name.toLowerCase().includes(filter))
          );
        });
        break;
      case "Category":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.category_name &&
            item.category_name.toLowerCase().includes(filter)
          );
        });
        break;
      case "Problem":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.problem_name &&
            item.problem_name.toLowerCase().includes(filter)
          );
        });
        break;
      case "Manufacturer":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.manufacturer_name &&
            item.manufacturer_name.toLowerCase().includes(filter)
          );
        });
        break;
      case "Centre List":
        filteredData = props?.data?.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.centre_name &&
              item.centre_name.toLowerCase().includes(filter)) ||
            (item.type &&
              item.type.toString().toLowerCase().includes(filter)) ||
            (item.district &&
              item.district.toString().toLowerCase().includes(filter))
          );
        });
        break;
      case "Unit Of Measurement":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.unit_of_measurement &&
            item.unit_of_measurement.toLowerCase().includes(filter)
          );
        });
        break;
      case "Spare Part":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.part_name && item.part_name.toLowerCase().includes(filter)) ||
            (item.part_number &&
              item.part_number.toString().toLowerCase().includes(filter)) ||
            (item.serial_no &&
              item.serial_no.toString().toLowerCase().includes(filter)) ||
            (item.hsn_code &&
              item.hsn_code.toString().toLowerCase().includes(filter)) ||
            (item.category &&
              item.category.toString().toLowerCase().includes(filter)) ||
            (item.manufacturer &&
              item.manufacturer.toString().toLowerCase().includes(filter)) ||
            (item.type && item.type.toString().toLowerCase().includes(filter))
          );
        });
        break;
      case "Repair Reports":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.categoryLabel &&
              item.categoryLabel.toLowerCase().includes(filter)) ||
            (item.productLabel &&
              item.productLabel.toString().toLowerCase().includes(filter)) ||
            (item.ticket_id &&
              item.ticket_id.toString().toLowerCase().includes(filter))
          );
        });
        break;
      case "Payments Reports":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.transaction_id &&
              item.transaction_id.toLowerCase().includes(filter)) ||
            (item.dps_no &&
              item.dps_no.toString().toLowerCase().includes(filter))
          );
        });
        break;
      case "Replacement Reports":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.aasra_name &&
              item.aasra_name.toLowerCase().includes(filter)) ||
            (item.beneficery_name &&
              item.beneficery_name.toString().toLowerCase().includes(filter)) ||
            (item.serial_number_of_damaged_product &&
              item.serial_number_of_damaged_product
                .toString()
                .toLowerCase()
                .includes(filter)) ||
            (item.old_material_code &&
              item.old_material_code
                .toString()
                .toLowerCase()
                .includes(filter)) ||
            (item.sap_material_code_code &&
              item.sap_material_code_code
                .toString()
                .toLowerCase()
                .includes(filter)) ||
            (item.distributed_old_product_code &&
              item.distributed_old_product_code
                .toString()
                .toLowerCase()
                .includes(filter)) ||
            (item.distributed_sap_productcode &&
              item.distributed_sap_productcode
                .toString()
                .toLowerCase()
                .includes(filter))
          );
        });
        break;
      case "Stock Report":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.aasra_name &&
              item.aasra_name.toLowerCase().includes(filter)) ||
            (item.old_material_code &&
              item.old_material_code
                .toString()
                .toLowerCase()
                .includes(filter)) ||
            (item.sap_material_code_code &&
              item.sap_material_code_code
                .toString()
                .toLowerCase()
                .includes(filter))
          );
        });
        break;
      case "Stock Transfer List":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.transaction_id &&
            item.transaction_id.toLowerCase().includes(filter)
          );
        });
        break;
      case "Transaction":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.ticket_id && item.ticket_id.toLowerCase().includes(filter)) ||
            (item.receipt_no && item.receipt_no.toLowerCase().includes(filter))
          );
        });
        break;
      case "Users":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.name && item.name.toLowerCase().includes(filter)) ||
            (item.mobile &&
              item.mobile.toString().toLowerCase().includes(filter)) ||
            (item.email &&
              item.email.toString().toLowerCase().includes(filter)) ||
            (item.unique_code &&
              item.unique_code.toString().toLowerCase().includes(filter))
          );
        });
        break;
      // case "Aasra List":
      //   filteredData = props?.data.filter((item) => {
      //     const filter = filterText.toLowerCase();
      //     return (
      //       (item.email && item.email.toLowerCase().includes(filter)) ||
      //       (item.mobile_no &&
      //         item.mobile_no.toString().toLowerCase().includes(filter)) ||
      //       (item?.city?.city &&
      //         item?.city?.city.toString().toLowerCase().includes(filter)) ||
      //       (item?.stateData?.name &&
      //         item?.stateData?.name.toString().toLowerCase().includes(filter))
      //     );
      //   });
      //   break;
      case "Purchases":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.transaction_id &&
              item.transaction_id.toLowerCase().includes(filter)) ||
            (item.supplier_name &&
              item.supplier_name.toLowerCase().includes(filter))
          );
        });
        break;
      case "Transaction":
        filteredData = props?.data.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.payment_status &&
              item.payment_status.toLowerCase().includes(filter)) ||
            (item.paid_amount &&
              item.paid_amount.toString().toLowerCase().includes(filter)) ||
            (item.order_status &&
              item.order_status.toLowerCase().includes(filter)) ||
            (item.payment_method &&
              item.payment_method.toLowerCase().includes(filter))
          );
        });
        break;
      case "Permission":
        filteredData = props?.data?.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            item.menu_name && item.menu_name.toLowerCase().includes(filter)
          );
        });
        break;
      case "Labour Charge":
        filteredData = props?.data?.filter((item) => {
          const filter = filterText.toLowerCase();
          return (
            (item.codeNo && item.codeNo.toLowerCase().includes(filter)) ||
            (item.natureOfWork &&
              item.natureOfWork.toLowerCase().includes(filter))
          );
        });
      default:
        break;
    }
    setFilteredItems(filteredData);
  }, [filterText, props?.data, props?.name]);

  const handleAasraId = (selectedOption) => {
    setValue("aasraId", selectedOption);
    trigger("aasraId");
  };
  const handleSpareType = (selectedOption) => {
    setValue("spareType", selectedOption);
    trigger("spareType");
  };
  const handleWarrenty = (selectedOption) => {
    setValue("warranty", selectedOption);
    trigger("warranty");
  };
  // Function to handle Type change
  const handleType = (selectedOption) => {
    // Update the type value in the form
    setValue("type", selectedOption);
    trigger("type");
    // Check if the selected type is "rtuproduct"
    if (selectedOption?.label === "RTU") {
      setIsRtuProduct(true);
      // Clear the warranty field when "rtuproduct" is selected
      setValue("warranty", null);
    } else {
      setIsRtuProduct(false);
    }
    console.log(isRtuProduct, "ffff");
  };
  useEffect(() => {
    getAasraDropdown();
    getSpareDropdown();
    setValue("startDate", defaultStartDate);
    setValue("endDate", new Date());
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
  const getSpareDropdown = () => {
    listSparePartMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setSpareList(res?.data?.data?.data);
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
  const required = props.required;
  const row = props?.Rows;
  // const len = row.length;
  // console.log("row data", row);

  //! this will enable full text view in react-select
  const customStyles = {
    singleValue: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
    }),
  };
  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardHeader>
              <h5>{props?.title}</h5>
              {props?.SearchCall ? (
                <form onSubmit={handleSubmit(props?.onFormSubmit)}>
                  <Row>
                    {props?.motorSR && (
                      <Col md="4" sm="4" lg="3" xl="2" xxl="2">
                        <Label className="form-label">
                          Motor Tricycle Sr No. <Required/>
                        </Label>
                        <Input
                          className="form-control"
                          {...register("motorSR", {
                            required: "Motor Serial No. is required",
                          })}
                          placeholder=" Enter Motor Tricycle Sr No."
                          value={watch("motorSR")}
                          onChange={(e) => {
                            setValue("motorSR", e.target.value);
                            trigger("motorSR");
                          }}
                        />
                        {errors.motorSR && (
                          <span
                            className="invalid"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errors.motorSR.message}
                          </span>
                        )}
                      </Col>

                      // <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                      //   <div className="form-group">
                      //     <Label htmlFor="motorTricycleSRNo">
                      //       Motor Tricycle SR No.
                      //     </Label>
                      //     <Input
                      //       type="text"
                      //       id="motorTricycleSRNo"
                      //       className="form-control"
                      //       {...register("motorSR", {
                      //         // You can add validation here if needed
                      //         // required: "Motor Tricycle SR No. is required",
                      //       })}
                      //       placeholder="Enter Motor Tricycle SR No."
                      //     />
                      //     {errors.motorSR && (
                      //       <p className="invalid">{errors.motorSR.message}</p>
                      //     )}
                      //   </div>
                      // </Col>
                    )}
                    {props?.Type && (
                      <Col md="3" sm="4" lg="4" xl="2" xxl="2">
                        <div className="form-group">
                          <Label className="form-label" htmlFor="type">
                            Type<Required/>
                          </Label>
                          <div className="form-control-wrap">
                            <Select
                              className="select"
                              id="type"
                              {...register("type", {
                                required: "Select Type is required",
                              })}
                              options={[
                                { value: 1, label: "Sales" },
                                { value: 2, label: "Labour" },
                                { value: 3, label: "RTU" },
                              ]}
                              placeholder="Select type"
                              value={watch("type")}
                              onChange={handleType}
                            />
                            {errors.type && (
                              <p className="invalid">{errors.type.message}</p>
                            )}
                          </div>
                        </div>
                      </Col>
                    )}
                    {props.aasraType &&
                      (user?.user_type === "A" || user?.user_type === "S") && (
                        <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                          <Label className="form-label">Aasra</Label>
                          <Select
                            className="select"
                            id="aasraId"
                            {...register("aasraId", {
                              // required: required ? "Aasra is required" : false,
                            })}
                            options={aasraList}
                            placeholder="Select Aasra"
                            value={watch("aasraId")}
                            onChange={handleAasraId}
                            isClearable
                          />
                          {errors.aasraId && (
                            <p className="invalid">{errors.aasraId.message}</p>
                          )}
                        </Col>
                      )}
                    {props.spareType && (
                      <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                        <Label className="form-label">Spare Part
                          {props.required && (<Required/>)}
                        </Label>
                        <Select
                          className="select"
                          id="spareType"
                          {...register("spareType",
                          {
                            // required: "Spare Part is required",
                            required: props.required
                              ? "Spare Part is required"
                              : false,
                          })}
                          options={spareTypeList}
                          placeholder="Select Spare Part"
                          value={watch("spareType")}
                          onChange={handleSpareType}
                          isClearable
                          // styles={customStyles} //enable this to see full text 
                        />
                        {errors.spareType && (
                          <p className="invalid">{errors.spareType.message}</p>
                        )}
                      </Col>
                    )}

                    {props.dateFilter && (
                      <>
                        <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                          <Label className="form-label">Start Date <Required/></Label>
                          <DatePicker
                            className="form-control"
                            placeholderText="Please select start date"
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
                          />
                          {errors.startDate && (
                            <p className="invalid">
                              {errors.startDate.message}
                            </p>
                          )}
                        </Col>

                        <Col md="3" sm="4" lg="3" xl="2" xxl="2">
                          <Label className="form-label">End Date <Required/></Label>
                          <DatePicker
                            className="form-control"
                            placeholderText="Please select end date"
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
                      </>
                    )}

                    {props?.UDID && (
                      <Col md="4" sm="4" lg="3" xl="2" xxl="2">
                        <Label className="form-label">
                          Aadhaar Number or UDID <Required/>
                        </Label>
                        <Input
                          className="form-control"
                          {...register("udId", {
                            required: "Aadhaar Number or UDID is required",
                          })}
                          placeholder="aadhaar number / udid"
                          value={watch("udId")}
                          onChange={(e) => {
                            setValue("udId", e.target.value);
                            trigger("udId");
                          }}
                        />
                        {errors.udId && (
                          <span
                            className="invalid"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {errors.udId.message}
                          </span>
                        )}
                      </Col>
                    )}

                    {props?.warranty && !isRtuProduct && (
                      <Col md="4" sm="4" lg="4" xl="2" xxl="2">
                        <Label className="form-label">Warranty {props.required && (<Required/>)}</Label>
                        <Select
                          className="select"
                          id="warranty"
                          {...register("warranty", {
                            // required: "Warranty is required",
                            required: props.required
                              ? "Warranty is required"
                              : false,
                          })}
                          options={[
                            { label: "In warranty", value: 1 },
                            { label: "Out of warranty", value: 0 },
                          ]}
                          placeholder="Select warranty"
                          value={watch("warranty")}
                          onChange={handleWarrenty}
                          isClearable
                        />
                        {errors.warranty && (
                          <p className="invalid">{errors.warranty.message}</p>
                        )}
                      </Col>
                    )}
                    {props?.serachButton && user.user_type === "AC" ? null : (
                      <Col sm="2" style={{ marginTop: "35px" }}>
                        <Button
                          outline
                          color="primary"
                          disabled={props.isLoading}
                        >
                          {props.isLoading ? (
                            <Spinner size="sm" color="light" />
                          ) : (
                            "Search"
                          )}
                        </Button>
                      </Col>
                    )}

                    {props?.upload && (
                      <>
                        <Col
                          md="4"
                          sm="6"
                          lg="3"
                          xl="2"
                          xxl="2"
                          style={{ marginTop: "35px" }}
                        ></Col>
                        <Col
                          md="3"
                          sm="3"
                          lg="2"
                          xl="2"
                          xxl="2"
                          style={{ marginTop: "35px" }}
                        >
                          <span style={{ marginLeft: "130px" }}>
                            <Button
                              outline
                              color="primary"
                              type="button"
                              onClick={() => {
                                setShowModal(true);
                              }}
                              style={{ textAlign: "right" }}
                              size="sm"
                            >
                              <FaUpload />
                              {"    "} Upload
                            </Button>
                          </span>
                        </Col>
                      </>
                    )}
                  </Row>
                </form>
              ) : null}
            </CardHeader>
            <CardBody>
              <div className="chat-box">
                <div className="people-list d-flex justify-content-between align-items-center">
                  <div className="search">
                    <Form className="theme-form">
                      <FormGroup className="form-group">
                        <Input
                          className="form-control"
                          type="text"
                          placeholder={props.search}
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                        <i className="fa fa-search"></i>
                      </FormGroup>
                    </Form>
                  </div>
                  <div className="exportBtn">
                    {props?.back ? (
                      <>
                        {" "}
                        <Button
                          outline
                          id="back"
                          color="primary"
                          className=""
                          type="button"
                          onClick={props?.back}
                          size="sm"
                        >
                          <IoArrowBackSharp
                            style={{ height: "1rem", width: "1rem" }}
                          />
                        </Button>{" "}
                      </>
                    ) : null}
                  </div>
                  <div className="exportBtn">
                    {props?.export ? (
                      <>
                        {" "}
                        {props?.data?.length > 0 ? (
                          <Export
                            className="btn-white"
                            sheetName={props?.fileName || "Report"}
                            data={filteredItems}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="data-table-container">
                {/* Render the bulk button above the table only if rows are selected */}
                {props?.ticket && Array.isArray(row) && row.length > 0 && (
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      backgroundColor: "#e9f5ff", // Light blue background
                      borderRadius: "5px", // Rounded corners
                    }}
                  >
                    <div
                      style={{
                        fontSize: "medium",
                        color: "#333", // Darker text color for readability
                      }}
                    >
                      {`${row.length} rows Selected`}
                      {/* {`${
                        row.filter((r) => r.ticketDetail?.length > 0).length
                      } Job Cards selected and`}
                      {"   "}
                      {`${
                        row.filter((r) => r.status === "Closed").length
                      } Closed Tickets selected`} */}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {" "}
                      {/* Container to hold buttons side by side */}
                      {Array.isArray(row) &&
                        row.length > 0 &&
                        row.every((item) => item?.ticketDetail?.length > 0) && (
                          <Button
                            onClick={props?.print2}
                            style={{
                              backgroundColor: "#ff476f", // Match the button color
                              color: "white",
                              border: "none",
                              borderRadius: "4px", // Rounded corners like in the image
                              padding: "5px 15px", // Adjust padding for better appearance
                              display: "flex",
                              alignItems: "center",
                              gap: "5px", // Space between icon and text
                            }}
                          >
                            <i className="fa fa-print" />
                            Job Card Print
                          </Button>
                        )}
                      {Array.isArray(row) &&
                        row.length > 0 &&
                        row.some((item) => item?.status === "Closed") && (
                          <Button
                            onClick={props?.print}
                            style={{
                              backgroundColor: "#ff476f", // Match the button color
                              color: "white",
                              border: "none",
                              borderRadius: "4px", // Rounded corners like in the image
                              padding: "5px 15px", // Adjust padding for better appearance
                              display: "flex",
                              alignItems: "center",
                              gap: "5px", // Space between icon and text
                            }}
                          >
                            <i className="fa fa-print" />
                            Closed Ticket Print
                          </Button>
                        )}
                    </div>
                  </div>
                )}

                {/* {props?.ticket && Array.isArray(row) && row.length > 0 && (
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      backgroundColor: "#e9f5ff", // Light blue background
                      borderRadius: "5px", // Rounded corners
                    }}
                  >
                    <div
                      style={{
                        fontSize: "medium",
                        color: "#333", // Darker text color for readability
                      }}
                    >
                      {"   "}
                      {`${
                        row.filter((r) => r.ticketDetail?.length > 0).length
                      } Job Cards selected`}
                    </div>
                  </div>
                )} */}

                <DataTable
                  id="style-2"
                  data={filteredItems}
                  columns={props?.columns}
                  pagination
                  responsive={true}
                  striped={true}
                  highlightOnHover={true}
                  paginationRowsPerPageOptions={[25, 50, 100, 500]}
                  paginationPerPage={25}
                  persistTableHead
                  selectableRows={props?.selectedRows}
                  selectableRowDisabled={props?.selectableRowDisabled} // Use the passed prop
                  progressPending={props?.isLoading}
                  onSelectedRowsChange={props?.onSelectedRowsChange} // Use the passed handler
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
                  contextActions={props?.contextActions}
                  clearSelectedRows={props?.clearSelectedRows}
                />
              </div>
              {props?.onClick && (
                <div className="col-12">
                  <Button
                    type="submit"
                    color="primary"
                    onClick={props?.onClick}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </CardBody>
            <UploadPartsSerial
              show={showModal}
              handleClose={() =>{
                setShowModal(false)
              }} // Modal close handler
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default MyDataTable;
