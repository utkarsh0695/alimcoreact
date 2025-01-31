import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Col, Row } from "reactstrap";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { BsEye } from "react-icons/bs";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import SalesDetailModal from "../../Components/MyComponents/Modal/SalesDetailModal";
import { SalesRTOListAPI } from "../../api/Sales";
import { toast } from "react-toastify";
import useLogout from "../../util/useLogout";

const SalesList = () => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // State for storing selected row
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [data, setData] = useState([]);

  // Example of setting the selected sale row data when you open the modal
  const [selectedSale, setSelectedSale] = useState(null);

  const [column, setColumn] = useState([
    {
      name: "Customer Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Customer Mobile",
      selector: (row) => row.mobile_no,
      sortable: true,
      wrap: true,
    },
    {
      name: "Total Spare Cost",
      selector: (row) => row.totalSpareCost,
      sortable: true,
      wrap: true,
    },
    {
      name: "GST(18%) Amount",
      selector: (row) => row.gstAmount,
      sortable: true,
      wrap: true,
    },
    {
      name: "Grand Total",
      selector: (row) => row.grandTotal,
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="d-flex flex-wrap">
            {/* {userDetail?.user_type === "AC" && ( */}
            <>
              <Button
                id="view"
                outline
                color="primary"
                className="mx-1 mb-1"
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  paddingTop: "5px",
                }}
                onClick={() => {
                  setSelectedRow(row); // Pass the selected row, not the entire data
                  setShowModal(true); // Open the modal
                }}
                size="xs"
              >
                <BsEye style={{ height: ".8rem", width: ".8rem" }} />
              </Button>
              <ToolTip id="view" name="View Details" option="top" />
            </>
            {/* )} */}
          </div>
        );
      },
      sortable: true,
    },
  ]);

  const onFormSubmit = (data) => {
    console.log(data, "pp");
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    const searchData = {
      aasra_id: data.aasraId?.value || null,
      startDate: data.startDate
        ? new Date(
            new Date(data.startDate).setDate(
              new Date(data.startDate).getDate() + 1
            )
          ).toISOString()
        : null,
      endDate: data.endDate
        ? new Date(
            new Date(data.endDate).setDate(new Date(data.endDate).getDate())
          ).toISOString()
        : null,
    };
    console.log(searchData, "searchData");

    // return false
    setIsLoading(true);
    SalesRTOListAPI(searchData, token)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setData(res.data.data?.saleDate);
          toast.success("Record Found Successfully!");
          // setSalesData(apiResponse.data.saleDate);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    {
      userDetail?.user_type === "AC" && getSalesList();
    }
  }, []);

  const getSalesList = () => {
    SalesRTOListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setData(res.data.data?.saleDate);
          // toast.success("Record Found Successfully!");
          // setSalesData(apiResponse.data.saleDate);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleAction = (row) => {
    console.log(row, "ROW");
  };

  return (
    <>
      <Breadcrumbs mainTitle="Sales Report" parent="Sales" title="Sales Report" />
      <Row>
        <Col sm="12">
          <MyDataTable
            rtoProduct
            SearchCall
            aasraType
            dateFilter
            onFormSubmit={onFormSubmit}
            name="Sales Report"
            title="Sales Report List"
            isLoading={isLoading}
            columns={column}
            data={data}
            fileName={"Sales Report"}
          />
        </Col>
      </Row>
      {/* Render the SalesDetailModal and pass showModal state and handleClose function */}
      <SalesDetailModal
        show={showModal}
        handleClose={() => setShowModal(false)} // Close modal handler
        salesData={selectedRow} // Pass selected row data to the modal
      />
    </>
  );
};

export default SalesList;
