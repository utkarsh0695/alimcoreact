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
} from "reactstrap";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import {
  createLabourChargeAPI,
  deleteLabourChargeAPI,
  labourChargeListAPI,
  updateLabourChargeAPI,
} from "../../api/master";
import { toast } from "react-toastify";
import { logoutAction, toCamelCase } from "../../util/myFunction";
import useLogout from "../../util/useLogout";
import { useForm } from "react-hook-form";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";
import { validateNameWithHyphensSlashDotBracketSpaceNumber } from "my-field-validator";

const LabourCharge = () => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("Add");
  const [rowData, setRowData] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const userToken = localStorage.getItem("accessToken");
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
  const columns = [
    {
      name: "Code No.",
      selector: (row) => row?.codeNo,
      sortable: true,
      width: "150px",
    },
    {
      name: "Nature of Work",
      selector: (row) => toCamelCase(row.natureOfWork),
      sortable: true,
      wrap: true,
    },
    {
      name: "Labour Charge",
      selector: (row) => row.labourCharges,
      sortable: true,
    },
    {
      name: "Repair Time",
      selector: (row) => row.repairTime,
      sortable: true,
    },
    {
      name: "Final Labour Charges",
      selector: (row) => row.finalLabourCharges,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Button
            id={'edit-' + row.id}
            outline
            color={`warning`}
            size={`xs`}
            className={`me-2`}
            onClick={() => handleEdit(row)}
            style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
          >
            {" "}
            <FaRegEdit style={{ height: '.8rem', width: '.8rem' }} />
          </Button>
          <ToolTip id={'edit-' + row.id} name={'Edit'} option={'top'} />
          {/* <Button
            outline
            id={'delete-'+row.id}
            color={`danger`}
            size={`xs`}
            onClick={() => handleDelete(row)}
            style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
          >
            {" "}
            <FaRegTrashCan style={{ height: '.8rem', width: '.8rem' }} />
          </Button>
          <ToolTip id={'delete-'+row.id} name={'Delete'} option={'top'} /> */}
        </div>
      ),
    },
  ];
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    getLabourCharge();
  }, []);
  const getLabourCharge = () => {
    labourChargeListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setData(res.data.data.labourData);
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
  const handleEdit = (row) => {
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);
    setValue("codeNo", row.codeNo);
    setValue("natureOfWork", row.natureOfWork);
    setValue("labourCharges", row.labourCharges);
    setValue("repairTime", row.repairTime);
    setValue("finalLabourCharges", row.finalLabourCharges);
  };
  const onFormSubmit = (data) => {
    if (mode == "Edit") {
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      const zero = {
        id: rowData.id,
        key: myKey
      }
      const bodyData = {
        ids: encrypt(zero),
        codeNo: watch("codeNo"),
        labourCharges: watch("labourCharges"),
        repairTime: watch("repairTime"),
        finalLabourCharges: watch("finalLabourCharges"),
        natureOfWork: watch("natureOfWork"),
      };
      updateLabourChargeAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            toast.success(res.data.message);
            handleOpen();
            setMode("Add");
            getLabourCharge();
            reset();
          } else if (res.data.status == "failed") {
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
        codeNo: watch("codeNo"),
        natureOfWork: watch("natureOfWork"),
        labourCharges: watch("labourCharges"),
        repairTime: watch("repairTime"),
        finalLabourCharges: watch("finalLabourCharges"),
      };
      createLabourChargeAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            handleOpen();
            getLabourCharge();
            toast.success(res.data.message);
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
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDelete = (row) => {
    setRowData(row);
    toggleDeleteModal();
  };
  const confirmDelete = () => {
    const bodyData = {
      id: rowData.id,
    };
    deleteLabourChargeAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          getLabourCharge();
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
    toggleDeleteModal();
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Labour Charge"
        parent="Master"
        title="Labour Charge"
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
                      <h5>{`${mode} Labour Charge`}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="codeNo">
                              Code No <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Code Number"
                                type="text"
                                id="codeNo"
                                {...register("codeNo", {
                                  required: "Code Number is required",
                                  pattern: {
                                    value: /^([A-Z]{2,3}\d{2,6}[A-Z]?)([\/+][A-Z]{2,3}\d{2,6}[A-Z]?)?$/,
                                    message:
                                      "Patterns like LK33, TDA265K00, LF23 + LF12, TDA265A00, LK15/16 are allowed.",
                                  },
                                  minLength: {
                                    value: 3,
                                    message:
                                      "Code Number must be at least 3 characters long.",
                                  },
                                  maxLength: {
                                    value: 50,
                                    message:
                                      "Code Number cannot exceed 25 characters.",
                                  },
                                })}
                                className="form-control"
                                value={watch("codeNo")}
                                onChange={(e) => {
                                  setValue("codeNo", e.target.value);
                                  trigger("codeNo");
                                }}
                              />
                              {errors.codeNo && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.codeNo?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="natureOfWork"
                            >
                              Nature of Work <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder=" Nature of Work"
                                type="text"
                                id="natureOfWork"
                                {...register("natureOfWork", {
                                  required: "nature of work is required",
                                  validate: {
                                    isValid: (value) =>
                                      validateNameWithHyphensSlashDotBracketSpaceNumber(value) || "Only AlphaNumeric are allowed with , . / () .",
                                  },
                                })}
                                className="form-control"
                                value={watch("natureOfWork")}
                                onChange={(e) => {
                                  setValue("natureOfWork", e.target.value);
                                  trigger("natureOfWork");
                                }}
                              />
                              {errors.natureOfWork && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.natureOfWork?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="labourCharges"
                            >
                              Labour Charge <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Labour Charge"
                                type="text"
                                id="labourCharges"
                                {...register("labourCharges", {
                                  required: "labour charge is required",
                                  pattern: {
                                    value: /^\d{1,9}(\.\d{0,2})?$/,
                                    message:
                                      "Labour Charges have 2 digits after decimal & not more than 11 digits. ",
                                  },
                                })}

                                className="form-control"
                                value={watch("labourCharges")}
                                onChange={(e) => {
                                  setValue("labourCharges", e.target.value);
                                  trigger("labourCharges");
                                }}

                              />
                              {errors.labourCharges && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.labourCharges?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>

                        <Col md={`4`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="repairTime">
                              Repair Time (min) <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Repair Time"
                                type="text"
                                id="repairTime"
                                {...register("repairTime", {
                                  required: "repair time is required",
                                  pattern: {
                                    value: /^(?:[0-9]|[1-9][0-9]|1[0-7][0-9]|180)$/,
                                    message: "Please enter a valid number of minutes (0-180).",
                                  },
                                })}
                                className="form-control"
                                value={watch("repairTime")}
                                onChange={(e) => {
                                  setValue("repairTime", e.target.value);
                                  trigger("repairTime");
                                }}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                              {errors.repairTime && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.repairTime?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="finalLabourCharges"
                            >
                              Final Labour Charges <Required />
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Final Labour Charges"
                                type="text"
                                id="finalLabourCharges"
                                {...register("finalLabourCharges", {
                                  required: "final labour charge is required",
                                  pattern: {
                                    // value: /^[1-9]\d{0,9}\.\d{2}$/,
                                    value: /^\d{1,9}(\.\d{0,2})?$/,
                                    message:
                                      "Labour Charges have 2 digits after decimal & not more than 11 digits. ",
                                  },
                                })}
                                className="form-control"
                                value={watch("finalLabourCharges")}
                                onChange={(e) => {
                                  setValue(
                                    "finalLabourCharges",
                                    e.target.value
                                  );
                                  trigger("finalLabourCharges");
                                }}
                              />
                              {errors.finalLabourCharges && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.finalLabourCharges?.message}
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
                            <Button color="primary" size="md">
                              Submit
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
          search="search by code number/nature of work "
          name="Labour Charge"
          title="Labour Charge List"
          fileName="Labour Charge List"
          isLoading={isLoading}
          columns={columns}
          data={data}
        />
      </Container>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          onDelete={confirmDelete}
          name={rowData?.codeNo}
        />
      )}
    </>
  );
};

export default LabourCharge;
