import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Label, Spinner } from "reactstrap";
import Select from "react-select";
import { useForm } from "react-hook-form";
import {
  aasraTypeAPI,
  districtListAPI,
  stateListAPI,
} from "../../api/dropdowns";
import { toast } from "react-toastify";
import useLogout from "../../util/useLogout";
import {
  createCenterMasterAPI,
  listCenterMasterAPI,
  updateCenterMasterAPI,
} from "../../api/master";
import { FaRegEdit } from "react-icons/fa";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import Required from "../../Components/MyComponents/Required";
import { validateAlphabetWithSpace, validateEmail, validateINMobile, validateNameWithHyphensSlashDotBracketSpaceNumber } from "my-field-validator";

const Center = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm();

  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [type, setType] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [mode, setMode] = useState("Add");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([
    {
      name: "Center Name",
      selector: (row) => row.centre_name,
      sortable: true,
      width: "220px",
      wrap:true
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "120px",
      wrap:true
    },
    {
      name: "State",
      selector: (row) => row.state_label,
      sortable: true,
      width: "120px",
      wrap:true
    },
    {
      name: "City",
      selector: (row) => row.city_label,
      sortable: true,
      width: "120px",
      wrap:true
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      width: "220px",
      wrap:true
    },
    {
      name: "Contact person",
      selector: (row) => row.contact_person,
      sortable: true,
      width: "320px",
      wrap:true
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_details,
      sortable: true,
      width: "180px",
      wrap:true
    },
    {
      name: "Email",
      selector: (row) => row.email_id,
      sortable: true,
      width: "100px",
      wrap:true
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div>
    //       <Button
    //         id={"edit-" + row.id}
    //         outline
    //         color={`warning`}
    //         size={`xs`}
    //         className={`me-2`}
    //         onClick={() => handleEdit(row)}
    //         style={{
    //           cursor: "pointer",
    //           textAlign: "center",
    //           paddingTop: "5px",
    //         }}
    //       >
    //         {" "}
    //         <FaRegEdit style={{ height: ".8rem", width: ".8rem" }} />
    //       </Button>
    //       <ToolTip id={"edit-" + row.id} name={"Edit"} option={"top"} />
    //     </div>
    //   ),
    // },
  ]);

  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    reset();
  };
  useEffect(() => {
    stateList();
    aasraTypeList();
    listCenter();
  }, []);

  const aasraTypeList = () => {
    aasraTypeAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          setType(res.data.data.data); // Store the options in state
        } else if (res.data.status === "failed") {
          toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };

  const handletypeChange = (selectedOption) => {
    setValue("type", selectedOption || "");
    trigger("type");
  };

  const stateList = () => {
    stateListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setState(res.data.data.stateData);
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

  const handleStateChange = (selectedOption) => {
    setValue("state", selectedOption || "");
    trigger("state");
    setValue("district", "");
    const data = {
      id: selectedOption.value,
    };
    districtListAPI(data, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setDistrict(res.data.data.cityData);
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
  const handleDistrictChange = (selectedOption) => {
    setValue("district", selectedOption || "");
    trigger("district");
  };

  const listCenter = () => {
    listCenterMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data.data.data);
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

  const handleAPIError = (res) => {
    if (res.data.status === "failed") {
       setIsLoading(false)
      toast.error(res.data.message);
    } else if (res.data.status === "expired") {
      logout(res.data.message);
    }
  };

  const handleCatchError = (err) => {
    toast.error("An error occurred. Please try again.");
  };

  const handleEdit = (row) => {
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);
    setValue("center_name", row.centre_name);
    setValue("type", { label: row.type, value: row.type_id });
    setValue("state", { label: row.state_label, value: row.state_id });
    setValue("district", { label: row.city_label, value: row.city_id });
    setValue("address", row.address);
    setValue("contact_person", row.contact_person);
    setValue("number", row.contact_details);
    setValue("email", row.email_id);
  };

  const onFormSubmit = (data) => {
    setIsLoading(false)
    const bodyData = {
      type: data.type.value,
      centre_name: data.center_name,
      state_id: data.state.value,
      city_id: data.district.value,
      address: data.address,
      contact_person: data.contact_person,
      contact_details: data.number,
      email_id: data.email,
    };

    if (mode === "Edit") {
      bodyData.id = rowData.id;
      updateCenterMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            listCenter();
            handleOpen();
            setMode("Add");
            // Refresh the list after successful update
            reset();
            toast.success("Center updated successfully!");
          } else {
            handleAPIError(res);
          }
        })
        .catch(handleCatchError);
    } else {
      const bodyData = {
        type: data.type.value,
        centre_name: watch("center_name"),
        state_id: data.state.value,
        city_id: data.district.value,
        address: watch("address"),
        contact_details: watch("number"),
        contact_person: watch("contact_person"),
        email_id: watch("email"),
      };
      createCenterMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            listCenter();
            handleOpen();
            toast.success("Center created successfully!");
            reset();
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log("catch", err);
        });
    }
  };

  return (
    <>
      <Breadcrumbs mainTitle="Centre" parent="Master" title="Centre" />
      <Container fluid={true}>
        <Row>
          <Col
            className="mb-2"
            sm="12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div>
              <Button color="primary" onClick={handleOpen}>
                {isOpen ? (
                  <i className="fa fa-minus" />
                ) : (
                  <i className="fa fa-plus" />
                )}
              </Button>
            </div>
          </Col>
          {isOpen && (
            <Col sm="12">
              <Form className="" onSubmit={handleSubmit(onFormSubmit)}>
                <Col sm="12">
                  <Card>
                    <CardHeader>
                      <h5>{"Add Centre"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="address">
                              Centre Name <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Centre Name"
                                type="text"
                                id="center_name"
                                {...register("center_name", {
                                  required: "Center name is required",
                                  // pattern: {
                                  //   value: /^[a-zA-Z ]*$/,
                                  //   message: "Only alphabets are allowed.",
                                  // },
                                  validate: {
                                    isValid: (value) =>
                                 validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                                },
                                })}
                                className="form-control"
                                value={watch("center_name")}
                                onChange={(e) => {
                                  setValue("center_name", e.target.value);
                                  trigger("center_name");
                                }}
                              />
                              {errors.center_name && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.center_name?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="type">
                              Type <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="type"
                                options={type}
                                {...register("type", {
                                  required: "Please select type",
                                })}
                                onChange={handletypeChange}
                                value={watch("type")}
                              />
                              {errors.type && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.type.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="state">
                              State <Required/>
                            </Label> 
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="state"
                                options={state}
                                {...register("state", {
                                  required: "please select state",
                                })}
                                onChange={handleStateChange}
                                value={watch("state")}
                              />
                              {errors.state && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.state.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="district">
                              District <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="district"
                                options={district}
                                {...register("district", {
                                  required: "please select District",
                                })}
                                onChange={handleDistrictChange}
                                value={watch("district")}
                              />
                              {errors.district && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.district.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="address">
                              Address <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter address"
                                type="text"
                                id="address"
                                {...register("address", {
                                  required: "Address is required",
                                  pattern: {
                                    value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                    message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                  }
                                })}
                                className="form-control"
                                value={watch("address")}
                                onChange={(e) => {
                                  setValue("address", e.target.value);
                                  trigger("address");
                                }}
                              />
                              {errors.address && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.address?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="contact_person"
                            > 
                              Contact Person <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Contact Person"
                                type="text"
                                id="contact_person"
                                {...register("contact_person", {
                                  required: "Contact Person is required",
                                  validate: {
                                    isValid: (value) =>
                                 validateAlphabetWithSpace(value) || "Enter only alphabetic characters.",
                                },
                                })}
                                className="form-control"
                                value={watch("contact_person")}
                                onChange={(e) => {
                                  setValue("contact_person", e.target.value);
                                  trigger("contact_person");
                                }}
                              />
                              {errors.contact_person && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.contact_person?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="number">
                              Contact number <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Contact Number"
                                type="text"
                                id="number"
                                {...register("number", {
                                  required: "Contact Number is required",
                                  // pattern: {
                                  //   value: /^[0-9]{10}$/,
                                  //   message:
                                  //     "Invalid contact number. It should be 10 digits.",
                                  // },
                                  validate: {
                                    isValid: (value) =>
                                 validateINMobile(value) || "Enter a valid 10-digit Indian mobile number starting with 6-9",
                                },
                                })}
                                className="form-control"
                                value={watch("number")}
                                onChange={(e) => {
                                  setValue("number", e.target.value);
                                  trigger("number");
                                }}
                              />
                              {errors.number && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.number?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`3`}>
                          <label for="fax-email" className="form-label">Email<Required/></label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Enter Fax/Email"
                              type="text"
                              id="email"
                              {...register("email", {
                                required: "Email is required",
                                // pattern: {
                                //   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                //   message: "Invalid Email.",
                                // },
                                validate: {
                                  isValid: (value) =>
                                    validateEmail(value) || "Invalid Email.",
                                },
                              })}
                              className="form-control"
                              value={watch("email")}
                              onChange={(e) => {
                                setValue("email", e.target.value);
                                trigger("email");
                              }}
                            />
                            {errors.email && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {errors?.email?.message}
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div
                            style={{
                              verticalAlign: "bottom",
                              marginTop: "35px",
                            }}
                          >
                            <Button color="primary" size="md" type="submit" disabled={isLoading}  >
                            {isLoading ?<Spinner size="sm" color="light"/> :'Submit'}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Form>{" "}
            </Col>
          )}
        </Row>

        <MyDataTable
          export
          search="search by centre name "
          name="Centre List"
          fileName="Centre List"
          title="Centre List"
          isLoading={isLoading}
          columns={columns}
          data={tableData}
        />
      </Container>
    </>
  );
};

export default Center;
