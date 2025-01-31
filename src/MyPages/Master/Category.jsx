import React, { useEffect, useState } from "react";
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
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import {
  createCategoryMasterAPI,
  deleteCategoryMasterAPI,
  listCategoryMasterAPI,
  updateCategoryMasterAPI,
} from "../../api/master";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { toCamelCase } from "../../util/myFunction";
import useLogout from "../../util/useLogout";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";
import { validateNameWithHyphensSlashDotBracketSpaceNumber } from "my-field-validator";
const Category = () => {
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
      name: "Category Name",
      selector: (row) => toCamelCase(row.category_name),
      sortable: true,
    },
    {
      name: "Category Description",
      selector: (row) => toCamelCase(row.category_description),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={
            row.status == true
              ? "badge badge-light-success"
              : "badge badge-light-danger"
          }
        >
          {row.status === true ? "Active" : "InActive"}
        </span>
      ),

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm();
  const handleStatusChange = (selectedOption) => {
    setValue("status", selectedOption || "");
    trigger("status");
  };
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  const listCategory = () => {
    listCategoryMasterAPI({}, tokenHeader)
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
  useEffect(() => {
    listCategory();
  }, []);
  const onFormSubmit = (e) => {
    console.log(e, "sss");
    // return false
    setIsLoading(true);
    const stat = watch("status");
    if (mode == "Edit") {
      // console.log("edit");
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      const zero = {
        id: rowData?.id,
        key: myKey
      }
      const bodyData = {
        id: encrypt(zero),
        category_name: watch("category_name"),
        category_description: watch("category_description"),
        status: stat?.value,
      };
      console.log(bodyData)
      updateCategoryMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            handleOpen();
            setMode("Add");
            listCategory();
            reset();
            setIsLoading(false);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
            setIsLoading(false);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const bodyData = {
        category_name: watch("category_name"),
        category_description: watch("category_description"),
        status: stat?.value,
      };
      createCategoryMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            handleOpen();
            listCategory();
            reset();
            setIsLoading(false);
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
    setValue("status", {
      value: row.status === true ? true : false,
      label: row.status === true ? "Active" : "InActive",
    });
    setValue("category_name", row.category_name);
    setValue("category_description", row.category_description);
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
    deleteCategoryMasterAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          listCategory();
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
      <Breadcrumbs mainTitle="Category" parent="Master" title="Category" />
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
                      <h5>{"Add Category"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="category_name"
                            >
                              Category <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Category"
                                type="text"
                                id="category_name"
                                {...register("category_name", {
                                  required: "Category name is required",
                                  pattern: {
                                    value: /^[a-zA-Z0-9 ]*$/,
                                    message: "Only AlphaNumeric are allowed.",
                                  },
                                  minLength: {
                                    value: 3,
                                    message:
                                      "Category name must be at least 3 characters long.",
                                  },
                                  maxLength: {
                                    value: 50,
                                    message:
                                      "Category name cannot exceed 25 characters.",
                                  },
                                })}
                                className="form-control"
                                value={watch("category_name")}
                                onChange={(e) => {
                                  setValue("category_name", e.target.value);
                                  trigger("category_name");
                                }}
                              />
                              {errors.category_name && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.category_name?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`6`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="category_description"
                            >
                              Category Description <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Category Description"
                                type="text"
                                //  rows="4"
                                //cols="50"
                                id="category_description"
                                {...register("category_description", {
                                  required: "Category description is required",
                                  pattern: {
                                    value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                                    message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                                  }
                                })}
                                className="form-control"
                                value={watch("category_description")}
                                onChange={(e) => {
                                  setValue(
                                    "category_description",
                                    e.target.value
                                  );
                                  trigger("category_description");
                                }}
                              />
                              {errors.category_description && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.category_description?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={`2`}>
                          <div className="form-group">
                            <Label className="from-label" htmlFor="status">
                              Status <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <Select
                                className=""
                                id="status"
                                options={[
                                  { value: true, label: "Active" },
                                  { value: false, label: "InActive" },
                                ]}
                                {...register("status", {
                                  required: "please select status",
                                })}
                                onChange={handleStatusChange}
                                value={watch("status")}
                                isValidNewOption={() => false}
                              />

                              {errors.status && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.status.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Row>
                          <Col md="2" className={`mt-3`}>
                            <div
                              className="form-group"
                              style={{ verticalAlign: "bottom" }}
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
          search="search by category name "
          name="Category"
          fileName="Category List"
          title="Category Master"
          isLoading={isLoading}
          columns={columns}
          data={tableData}
        />
      </Container>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          onDelete={confirmDelete}
          name={rowData?.category_name}
        />
      )}
    </>
  );
};

export default Category;
