import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { aasraListAPI } from "../../api/dropdowns";
import { repairReportSearchAPI } from "../../api/user";
import useLogout from "../../util/useLogout";
import { RUPEES_SYMBOL } from "../../Constant";
const RepairReports = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm();
  const logout = useLogout();
  const [tableData, setTableData] = useState([]);
  const [aasraList, setAasraList] = useState([]);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const handleAasraId = (selectedOption) => {
    setValue("aasraId", selectedOption);
    trigger("aasraId");
  };

  const handleWarrenty = (selectedOption) => {
    setValue("warranty", selectedOption);
    trigger("warranty");
  };

  const columns = [
    {
      name: "Ticket Id",
      selector: (row) => row.ticket_id,
      sortable: true,
      width: "150px"
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
    // {
    //   name: "Category Value",
    //   selector: (row) => row.categoryValue,
    //   sortable: true,
    // },
    {
      name: "Category",
      selector: (row) => row.categoryLabel,
      sortable: true,
      wrap: true,
      width: "150px"
    },
    {
      name: "New Serial Number",
      selector: (row) => row.new_serial_number,
      sortable: true,
      wrap: true,
      width: "150px"
    },
    {
      name: "Old Serial Number",
      selector: (row) => row.old_serial_number,
      sortable: true,
      wrap: true,
      width: "150px"
    },
    // {
    //   name: "Part Number",
    //   selector: (row) => row.productValue,
    //   sortable: true,
    // },
    {
      name: "Product",
      selector: (row) => row.productLabel,
      sortable: true,
      wrap: true
    },
    {
      name: "Product Price",
      selector: (row) => `${RUPEES_SYMBOL}${row.productPrice}`,
      sortable: true,
      wrap: true,
      width: "180px"
    },
    // {
    //   name: "Part Number",
    //   selector: (row) => row.repairValue,
    //   sortable: true,
    // },
    {
      name: "Repair",
      selector: (row) => row.repairLabel,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Repair Service Charges",
      selector: (row) => `${RUPEES_SYMBOL}${row.repairServiceCharge}`,
      sortable: true,
      width: "200px",
      wrap: true
    },
    {
      name: "Repair Time",
      selector: (row) => row.repairTime,
      sortable: true,
      width: "150px",
    },
    {
      name: "Repair Price",
      selector: (row) => `${RUPEES_SYMBOL}${row.repairPrice}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Repair GST",
      selector: (row) => row.repairGst * 100,
      sortable: true,
      width: "150px",
    },
    {
      name: "Qty",
      selector: (row) => row.qty,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `${RUPEES_SYMBOL}${row.price}`,
      sortable: true,
    },
    {
      name: "Service Charges",
      selector: (row) => `${RUPEES_SYMBOL}${row.serviceCharge}`,
      sortable: true,
      width: "180px",
    },
    {
      name: "Amount",
      selector: (row) => `${RUPEES_SYMBOL}${row.amount}`,
      sortable: true,
    },

  ];

  useEffect(() => {
    getAasraDropdown();
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

  const onSubmit = (data) => {
    // Check if aasraId and warranty are defined before accessing their values
    const aasraIdValue = data.aasraId ? data.aasraId.value : null;
    const warrantyValue = data.warranty ? data.warranty.value : null;
    // console.log(data, "data")
    const bodyData = {
      aasra_id: aasraIdValue,
      warranty: warrantyValue,
      spare_id: data?.spareType?.value || null,
      startDate: data?.startDate
        ? new Date(
          new Date(data.startDate).setDate(
            new Date(data.startDate).getDate() + 1
          )
        ).toISOString()
        : null,
      endDate: data?.endDate
        ? new Date(
          new Date(data.endDate).setDate(new Date(data.endDate).getDate())
        ).toISOString()
        : null,

    };

    // console.log(bodyData, "oooooo")
    // Call the repairReportSearchAPI with the bodyData
    repairReportSearchAPI(bodyData, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          setTableData(res.data?.data.repairs);
          toast.success(res.data.message);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
          setTableData([])
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  return (
    <>
      <Breadcrumbs
        mainTitle="Repair Reports"
        parent=""
        title="Repair Reports"
      />

      {/* <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="4">
                <Label className="form-label">Aasra ID</Label>
                <Select
                  className="select"
                  id="aasraId"
                  {...register("aasraId", {
                    required: "AasraId is required",
                  })}
                  options={aasraList}
                  placeholder={"Select aasraId"}
                  value={watch(`aasraId`)}
                  onChange={handleAasraId}
                />
                {errors.aasraId && (
                  <p className="text-danger">{errors.aasraId.message}</p>
                )}
              </Col>
              <Col sm="4">
                <Label className="form-label">Warranty</Label>
                <Select
                  className="select"
                  id="warranty"
                  {...register("warranty", {
                    required: "warranty is required",
                  })}
                  options={[
                    { label: "YES", value: "1" },
                    { label: "NO", value: "0" },
                  ]}
                  placeholder={"Select warranty"}
                  value={watch(`warranty`)}
                  onChange={handleWarrenty}
                />
                {errors.warranty && (
                  <p className="text-danger">{errors.warranty.message}</p>
                )}
              </Col>
              <Col sm="4" className="mt-4">
                <Label></Label>
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
              </Col>
            </Row>{" "}
          </form>
        </CardBody>
      </Card> */}
      <Row>
        <Col sm="12">
          <MyDataTable
            export
            SearchCall
            dateFilter
            spareType
            aasraType
            warranty
            onFormSubmit={onSubmit}
            search="search by category/product/ticket id"
            name={"Repair Reports"}
            title="Repair Reports List"
            data={tableData}
            // isLoading={isLoading}
            columns={columns}
            fileName={"Repair Reports"}
          />
        </Col>
      </Row>

    </>
  );
};

export default RepairReports;
