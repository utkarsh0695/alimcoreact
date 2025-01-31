import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Breadcrumbs, H5 } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";

const ServiceChargeWP = () => {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([{
    sr_no: 1,
    aasra_id: 1,
    product_name: "wheel",
    product_id: 'W1000',
    qty: 25,
    repair_charges: 12,
    date_of_payment: '12-12-2024'
  }, {
    sr_no: 2,
    aasra_id: 2,
    product_name: "seat",
    product_id: 'S00002',
    qty: 29,
    repair_charges: 10,
    date_of_payment: '12-12-2024'
  }, {
    sr_no: 3,
    aasra_id: 3,
    product_name: "hand grip",
    product_id: 'HG3000',
    qty: 125,
    repair_charges: 12,
    date_of_payment: '12-12-2024'
  }]);
  const [tableColumn, setTableColumn] = useState([
    {
      name: "Sr No.",
      selector: (row) => row.sr_no,
      sortable: false,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Aasra ID",
      selector: (row) => row.aasra_id,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Product Id",
      selector: (row) => row.product_id,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Qty",
      selector: (row) => row.qty,
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Repair Charges",
      selector: (row) => row.repair_charges,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Date of Payment",
      selector: (row) => row.date_of_payment,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
  ]);
  return (
    <>
      <div>
        <Breadcrumbs
          mainTitle="Service Charge W.P"
          parent=""
          title="Service Charge W.P"
        />
      </div>
      <Row>
        <Col sm="12">
          <MyDataTable
            export
            search="search by product name/aasra id/product id"
            name={"Service Charge"}
            title="Service Charge W.P. Report List"
            isLoading={isLoading}
            columns={tableColumn}
            data={tableData}
            fileName={"Service Charge List"}
          />
        </Col>
      </Row>
    </>
  );
};

export default ServiceChargeWP;
