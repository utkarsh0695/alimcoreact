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
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { aasraListAPI } from "../../api/dropdowns";
import { wholeStockReportListAPI } from "../../api/revenue";
import useLogout from "../../util/useLogout";

const AaAwholeStockReport = () => {
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
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tableColumn, setTableColumn] = useState([
    // { name: "Sr.no.", selector: (row) => row.serial_no, sortable: false },
    {
      name: "Aasra Name",
      selector: (row) => row.aasra_name,
      sortable: true,
      width: "200px",
      wrap:true
    },
    {
      name: "Spare Part",
      selector: (row) => row.spare_part,
      sortable: true,
      width: "200px",
      wrap:true
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
      width: "200px",
    },
    { name: "Date", selector: (row) => row.date, sortable: true,wrap:true,width: "180px", },
    {
      name: "Opening Stock",
      selector: (row) => row.opening_stock,
      sortable: true,
      width: "180px",
    },
    { name: "Stock In", selector: (row) => row.stock_in, sortable: true },
    { name: "Stock Out", selector: (row) => row.stock_out, sortable: true ,width: "180px",},
    {
      name: "Closing Stock",
      selector: (row) => row.closing_stock,
      sortable: true,
      width: "180px",
    },
    {
      name: "Storage / Excess",
      selector: (row) => row.shortage_excess,
      sortable: true,
      width: "180px",
    },
    {
      name: "Physical stock",
      selector: (row) => row.physical_stock,
      sortable: true,
      width: "180px",
    },
  ]);
  const [aasraList, setAasraList] = useState([]);

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

  const handleApiResponse = (res) => {
    if (res.data.status === "success") {
      setData(res.data.data)
    } else if (res.data.status == "failed") {
      toast.error(res.data.message);
      setData([""]);
    } else if (res.data.status == "expired") {
      logout(res.data.message);
    }
  };

  const handleApiError = (errors) => {
    setData([""]);
    toast.error("Error fetching payment reports");
  };
  // useEffect(() => {
  //   if (user?.user_type === "AC") {
  //     fetchData();
  //   }
  // }, []);
  
  // const fetchData = () => {
  //   setIsLoading(false);
  //   const searchData = {};
  //   const token = {
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + `${userToken}`,
  //     },
  //   };
  //   wholeStockReportListAPI(searchData, token)
  //     .then(handleApiResponse)
  //     .catch(handleApiError)
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const onFormSubmit = (data) => {
    setIsLoading(true);
    // console.log(data,"data")
    const searchData = {
      aasra_id: data?.aasraId?.value || null,
      spare_id: data?.spareType?.value || null,
      startDate: data?.startDate ? new Date(new Date(data?.startDate).setDate(new Date(data?.startDate).getDate() + 1)).toISOString() : null,
      endDate: data?.endDate ? new Date(new Date(data?.endDate).setDate(new Date(data?.endDate).getDate())).toISOString() : null
    };
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };

    wholeStockReportListAPI(searchData, token)
      .then(handleApiResponse)
      .catch(handleApiError)
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Stock Report"
        parent=""
        title="Stock Report"
      />

      {/* {user?.user_type === "S" && (
        <Container fluid={true}>
          <Row>
            <Col sm="12">
              <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Col sm="12">
                  <Card>
                    <CardHeader>
                      <h5>{"Stock Report"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
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
                                  required: "Select Aasra is required",
                                })}
                                options={aasraList}
                                placeholder={"Select Aasra"}
                                value={watch("aasra_name")}
                                onChange={handleAsraList}
                              />
                              {errors.aasra_name && (
                                <p className="text-danger">
                                  {errors.aasra_name.message}
                                </p>
                              )}
                            </div>
                          </div>
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
        </Container>
      )} */}
      <Row>
        <Col sm="12">
          <MyDataTable
          required
           SearchCall
           aasraType
           spareType
          //  dateFilter
          //  serachButton
           onFormSubmit={onFormSubmit}
            search="search by name of aaasra/old material code/SAP material code"
            name="Stock Report"
            title="Stock Report List"
            isLoading={isLoading}
            columns={tableColumn}
            data={data}
            fileName={"Stock Report"}
          />
        </Col>
      </Row>
    </>
  );
};

export default AaAwholeStockReport;
