import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
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
  Spinner,
} from "reactstrap";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import { toCamelCase } from "../../util/myFunction";
import { useForm } from "react-hook-form";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import {
  createManufacturerMasterAPI,
  deleteManufacturerMasterAPI,
  listManufacturerMasterAPI,
  updateManufacturerMasterAPI,
} from "../../api/master";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";
import { validateAlphabetOnly, validateAlphabetWithSpace } from "my-field-validator";

const Manufacture = () => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [mode, setMode] = useState("Add");
  const userToken = localStorage.getItem("accessToken");
  const [rowData, setRowData] = useState(null);
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const columns = [
    {
      name: "Manufacturer Name",
      selector: (row) => row.manufacturer_name,
      sortable: true,
    },
    {
      name: "Manufacturer Code",
      selector: (row) => row.label,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Button
            id={"edit-" + row.id}
            outline
            color={`warning`}
            size={`xs`}
            className={`me-2`}
            onClick={() => handleEdit(row)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              paddingTop: "5px",
            }}
          >
            {" "}
            <FaRegEdit style={{ height: ".8rem", width: ".8rem" }} />
          </Button>
          <ToolTip id={"edit-" + row.id} name={"Edit"} option={"top"} />
        </div>
      ),
    },
  ];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const listManufacturer = () => {
    listManufacturerMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data.data.data);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
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
    listManufacturer();
  }, []);
  const onFormSubmit = (data) => {
    setIsLoading(true);
    const stat = watch("status");
    if (mode == "Edit") {
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      const zero ={
      id:rowData.id,
      key:myKey
      }
      const bodyData = {
        id: encrypt(zero),
        manufacturer_name: watch("manufacturer_name"),
        manufacturer_code: watch("manufacturer_code"),
      };
      updateManufacturerMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            handleOpen();
            setMode("Add");
            setIsLoading(false);
            listManufacturer();
            reset();
          } else if (res.data.status == "failed") {
            setIsLoading(false);
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const bodyData = {
        manufacturer_name: watch("manufacturer_name"),
        manufacturer_code: watch("manufacturer_code"),
      };
      createManufacturerMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            handleOpen();
            setIsLoading(false);
            listManufacturer();
            reset();
          } else if (res.data.status == "failed") {
            setIsLoading(false);
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




  const handleEdit = (row) => {
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);
    setValue("manufacturer_name", row.manufacturer_name);
    setValue("manufacturer_code", row.label);
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Manufacturer"
        parent="Master"
        title="Manufacturer"
      />
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
                      <h5>{"Add Manufacturer"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="category_name"
                            >
                              Manufacturer Name <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Manufacturer Name"
                                type="text"
                                id="manufacturer_name"
                                {...register("manufacturer_name", {
                                  required: "Manufacturer name is required",
                                    validate: {
                                      isValid: (value) =>
                                   validateAlphabetWithSpace(value) || "Only alphabets are allowed.",
                                  },
                                  minLength: {
                                    value: 3,
                                    message:
                                      "Manufacturer name must be at least 3 characters long.",
                                  },
                                  maxLength: {
                                    value: 50,
                                    message:
                                      "Manufacturer name cannot exceed 25 characters.",
                                  },
                                })}
                                className="form-control"
                                value={watch("manufacturer_name")}
                                onChange={(e) => {
                                  setValue("manufacturer_name", e.target.value);
                                  trigger("manufacturer_name");
                                }}
                              />
                              {errors.manufacturer_name && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.manufacturer_name?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="category_name"
                            >
                              Manufacturer Code <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Manufacturer Code"
                                type="text"
                                id="manufacturer_code"
                                {...register("manufacturer_code", {
                                  required: "Manufacturer code is required",
                                  pattern: {
                                    value: /^[0-9]*$/,
                                    message: "Only Digits are allowed.",
                                  },
                                })}
                                className="form-control"
                                value={watch("manufacturer_code")}
                                onChange={(e) => {
                                  setValue("manufacturer_code", e.target.value);
                                  trigger("manufacturer_code");
                                }}
                              />
                              {errors.manufacturer_code && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.manufacturer_code?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <div
                            style={{
                              verticalAlign: "bottom",
                              marginTop: "35px",
                            }}
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
                    </CardBody>
                  </Card>
                </Col>
              </Form>{" "}
            </Col>
          )}
        </Row>

        <MyDataTable
          export
          search="search by manufacturer name "
          name="Manufacturer"
          fileName="Manufacturer List"
          title="Manufacturer List"
          isLoading={isLoading}
          columns={columns}
          data={tableData}
        />
      </Container>
    </>
  );
};

export default Manufacture;
