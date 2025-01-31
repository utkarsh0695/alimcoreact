import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Card, Row } from "react-bootstrap";
import { CardBody, Col } from "reactstrap";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import UploadPartsSerial from "../../Components/MyComponents/Modal/UploadPartsSerial";
import { partsSerialListAPI } from "../../api/master";
import { toast } from "react-toastify";
import useLogout from "../../util/useLogout";

const PartsSerialno = () => {
  const logout = useLogout;
  const [isLoading, setIsLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const userToken = localStorage.getItem("accessToken");
  const [tableColumn, setTableColumn] = useState([
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1, // Display the serial number based on the index
      sortable: true, // Generally, serial numbers are not sortablet the width as needed
    },
    {
      name: "Motor Tricycle Sr No.",
      selector: (row) => row.moterTriSerialNo || " ",
      sortable: true,
      wrap: true,
    },
    {
      name: "Hub Drive Motor Sr No.",
      selector: (row) => row.hubDriveMoter || "",
      sortable: true,
      wrap: true,
    },
    {
      name: "Battery 1 Sr No.",
      selector: (row) => row.batteryOne || " ",
      sortable: true,
    },
    {
      name: "Battery 2 Sr No.",
      selector: (row) => row.batterytwo || " ",
      sortable: true,
      width: "180px",
    },
    {
      name: "Charger Sr No.",
      selector: (row) => row.charger ||  " ",
      sortable: true,
    },
    {
      name: "Controller Sr No.",
      selector: (row) => row.controller || " ",
      sortable: true,
    },
  ]);
  useEffect(() => {
    partSerialList();
  }, []);

  const partSerialList = () => {
    const tokenHeader = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    partsSerialListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          // Access the partSerialNo array correctly
          setData(res.data.data.partSerialNo || []); // Use partSerialNo array or empty array if it's undefined
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
  const onFormSubmit = (data) => {
    setIsLoading(true);
    // Construct the searchData object
    const searchData = {
      moterTriSerialNo: data?.motorSR || null, // Access the motorSR value
      startDate: data?.startDate
        ? new Date(
            new Date(data?.startDate).setDate(
              new Date(data?.startDate).getDate() + 1
            )
          ).toISOString()
        : null,
      endDate: data?.endDate
        ? new Date(
            new Date(data?.endDate).setDate(new Date(data?.endDate).getDate())
          ).toISOString()
        : null,
    };

    // Token configuration for API call
    const tokenHeader = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };

    // Call the partSerialListAPI with the constructed searchData
    partsSerialListAPI(searchData, tokenHeader)
      .then((res) => {
        if (res.data.status === "success") {
          // Handle success response
          setData(res.data.data.partSerialNo || []); // Use partSerialNo array or empty array if it's undefined
          toast.success("Record Found Successfully!");
        } else if (res.data.status === "failed") {
          toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("Error in API call:", err);
      })
      .finally(() => {
        setIsLoading(false); // Reset loading state
      });
  };

  return (
    <>
      <Breadcrumbs mainTitle="Parts Serial" parent="Master" title="Parts Serial" />
      <Row>
        <Card>
          {/* <CardBody>
            <Button className="primary" onClick={() => setShowModal(true)}>
              Upload
            </Button>
          </CardBody> */}
        </Card>
        <Col sm="12">
          <MyDataTable
            SearchCall
            export
            upload
            // aasraType
            // spareType
            motorSR
            dateFilter
            onFormSubmit={onFormSubmit}
            name="Parts Serial No"
            title="Parts Serial No. List"
            isLoading={isLoading}
            columns={tableColumn}
            data={data}
            fileName={"Stock Report"}
          />
        </Col>
      </Row>

      {/* Modal component for uploading parts serial */}
      {/* <UploadPartsSerial
        show={showModal}
        handleClose={() => setShowModal(false)} // Modal close handler
      /> */}
    </>
  );
};

export default PartsSerialno;
