import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  createUomMasterAPI,
  listUOMListAPI,
  updateUomMasterAPI,
} from "../../api/master";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import { FaRegEdit } from "react-icons/fa";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegTrashCan } from "react-icons/fa6";
import { encrypt } from "../../security/Encrpt";
import Required from "../../Components/MyComponents/Required";
// import DeleteConfirmModal from "../../Components/MyComponents/Modal/DeleteConfirmModal";
const UnitOfMeasurement = () => {
  const logout = useLogout();
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("Add");
  const [rowData, setRowData] = useState(null);
  const [data, setData] = useState([]);
  const handleOpen = () => {
    setIsOpen(!isOpen);
    reset();
  };
  const handleInput = (field) => (e) => {
    e.preventDefault();
    setValue(field, e.target.value);
    trigger(field);
  };
  const columns = [
    {
      name: "Id",
      selector: (row) => row?.value,
      sortable: true,
      wrap: true,
    },
    {
      name: "Unit Of Measurement",
      selector: (row) => row?.label,
      sortable: true,
      wrap: true,
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
  const handleEdit = (row) => {
    setMode("Edit");
    setIsOpen(true);
    setRowData(row);
    setValue("unit_of_measurement", row?.unit_of_measurement);
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  // const handleDelete = (row) => {
  //   setRowData(row);
  //   toggleDeleteModal();
  // }
  // const confirmDelete = () => {
  //   const bodyData = {
  //     id: rowData.id,
  //   };
  //   deleteUomMasterAPI(bodyData, tokenHeader)
  //     .then((res) => {
  //       if (res.data.status == "success") {
  //         toast.success(res.data.message);
  //       } else {
  //         toast.error(res.data.message);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("catch", err);
  //     });
  //   toggleDeleteModal();
  // };

  useEffect(() => {
    uomList();
  }, []);
  const uomList = () => {
    listUOMListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setData(res.data?.data?.data);
        } else if (res.data.status == "failed") {
          setIsLoading(false)
          setData([]);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };

  const onFormSubmit = (data) => {
    setIsLoading(true);
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    if (mode == "Edit") {
      const myKey = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      const zero ={
      id:rowData?.id,
      key:myKey
      }
      const Data = {
        id: encrypt(zero),
        unit_of_measurement: data?.unit_of_measurement,
      };
      updateUomMasterAPI(Data, token)
        .then((res) => {
          if (res.data.status === "success" && res.data.data.key === myKey) {
            handleOpen();
            setMode("Add");
            reset();
            uomList();
            setIsLoading(false);
            toast.success(res.data.message);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
            setIsLoading(false);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    } else {
      const Data = {
        unit_of_measurement: data.unit_of_measurement,
      };
      createUomMasterAPI(Data, token)
        .then((res) => {
          if (res.data.status === "success") {
            handleOpen();
            reset();
            uomList();
            setIsLoading(false);
            toast.success(res.data.message);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
            setIsLoading(false);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Unit Of Measurement"
        parent="Master"
        title="Unit Of Measurement"
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
              <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Card sm="12" >
                  <CardHeader>
                    <h5>{"Unit Of Measurement"}</h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="4">
                        <Label className="form-label">UOM <Required/></Label>
                        <input
                          className="form-control"
                          id="unit_of_measurement"
                          type="text"
                          placeholder="Enter Unit Of Measurement"
                          {...register("unit_of_measurement", {
                            required: " Unit Of Measurement is required",
                            pattern: {
                              value: /^(cm|kg|m|g|l|ml|piece)$/,
                              message:
                                "Input must be one of the units: cm, kg, m, g, l, ml",
                            },
                          })}
                          value={watch(`unit_of_measurement`)}
                          onChange={handleInput("unit_of_measurement")}
                        />
                        {errors.unit_of_measurement && (
                          <p className="invalid">
                            {errors.unit_of_measurement.message}
                          </p>
                        )}
                      </Col>
                      <Col sm="4" className="mt-4">
                        <Button
                          color="primary"
                          size="md"
                          disabled={isLoading}
                          className="btn btn-primary"
                          type="submit"
                          style={{ marginTop: "11px" }}
                        >
                          {isLoading ? (
                            <Spinner size="sm" color="light" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            </Col>
          )}
        </Row>
          <MyDataTable
            export
            search="search by unit of measurement "
            name="Unit Of Measurement"
            title="Unit Of Measurement"
            data={data}
            columns={columns}
            fileName={"Unit Of Measurement"}
            isLoading={isLoading}
          />
      </Container>
      {/* {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          toggle={toggleDeleteModal}
          onDelete={confirmDelete}
          name={rowData?.unit_of_measurement}
        />
      )} */}
    </>
  );
};

export default UnitOfMeasurement;
