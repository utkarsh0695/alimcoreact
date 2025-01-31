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
import { useForm } from "react-hook-form";
import {
  createProblemMasterAPI,
  deleteCategoryMasterAPI,
  deleteProblemMasterAPI,
  listCategoryMasterAPI,
  listProblemMasterAPI,
  updateProblemMasterAPI,
} from "../../api/master";
import { toCamelCase } from "../../util/myFunction";
import { toast } from "react-toastify";
import Select from "react-select";
import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
import { FaRegEdit } from "react-icons/fa";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";

const Problem = () => {
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
      name: "Problem Name",
      selector: (row) => row.problem_name,
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
  const onFormSubmit = (data) => {
    setIsLoading(true);
    if (mode == "Edit") {
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      const zero ={
      id:rowData.id,
      key:myKey
      }
      const bodyData = {
        id: encrypt(zero) ,
        problem_name: watch("problem_name"),
      };
      updateProblemMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            handleOpen();
            setMode("Add");
            setIsLoading(false);
            listProblem();
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
        problem_name: watch("problem_name"),
      };
      createProblemMasterAPI(bodyData, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            handleOpen();
            setIsLoading(false);
            listProblem();
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
  const listProblem = () => {
    listProblemMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setTableData(res.data?.data.data);
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
  const handleEdit = (row) => {
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);

    setValue("problem_name", row.problem_name);
  };
  useEffect(() => {
    listProblem();
  }, []);

  return (
    <>
      <Breadcrumbs mainTitle="Problem" parent="Master" title="Problem" />
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
                      <h5>{"Add Problem"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={`4`}>
                          <div className="form-group">
                            <Label
                              className="from-label"
                              htmlFor="category_name"
                            >
                              Problem Name <Required/>
                            </Label>
                            <div className="form-control-wrap">
                              <input
                                placeholder="Enter Problem"
                                type="text"
                                id="problem_name"
                                {...register("problem_name", {
                                  required: "Problem name is required",
                                  pattern: {
                                    value: /^[a-zA-Z0-9 ]*$/,
                                    message: "Only AlphaNumeric are allowed.",
                                  },
                                  minLength: {
                                    value: 3,
                                    message:
                                      "Problem name must be at least 3 characters long.",
                                  },
                                  maxLength: {
                                    value: 50,
                                    message:
                                      "Problem name cannot exceed 25 characters.",
                                  },
                                })}
                                className="form-control"
                                value={watch("problem_name")}
                                onChange={(e) => {
                                  setValue("problem_name", e.target.value);
                                  trigger("problem_name");
                                }}
                              />
                              {errors.problem_name && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.problem_name?.message}
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
          search="search by problem name "
          name="Problem"
          fileName="Problem List"
          title="Problem List"
          isLoading={isLoading}
          columns={columns}
          data={tableData}
        />
      </Container>
    </>
  );
};

export default Problem;
