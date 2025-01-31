import React, { useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import MyDataTable from "../../Components/MyComponents/MyDataTable";

const OurAasra = () => {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableDate, setTableData] = useState([
    // {
    //   sr_no: 1,
    //   id: 1,
    //   aasra_center_name: "aasra name",
    //   state: "up",
    //   district: "lko",
    //   address: "some address",
    //   contact_detail: 9856895689,
    //   email: "test@gmail.com",
    //   registered_date: "12-12-2021",
    // },
    // {
    //   sr_no: 1,
    //   id: 2,
    //   aasra_center_name: "aasra name",
    //   state: "mp",
    //   district: "knp",
    //   address: "some one",
    //   contact_detail: 9856555689,
    //   email: "test@gmail.com",
    //   registered_date: "12-12-2021",
    // },
  ]);
  const [tableColumn, setTableColumn] = useState([
    {
      name: "Sr No.",
      selector: (row) => row.sr_no,
      sortable: false,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Aasra Center Name",
      selector: (row) => row.aasra_center_name,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "District",
      selector: (row) => row.district,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Contact Details",
      selector: (row) => row.contact_detail,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "	Email id",
      selector: (row) => row.email,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Registered. Date",
      selector: (row) => row.registered_date,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
  ]);

  return (
    <>
      <Breadcrumbs mainTitle="Nearest Aasra's" parent="" title="Our Aasha" />

      <Card>
        <CardBody>
          <Row>
            <Col sm="4">
              <label className="form-label">Aasra Center Name</label>
              <input
                className="form-control sm"
                type="text"
                value={searchText}
                placeholder="Enter Aasra Center Name"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col sm="4" className="mt-4">
              <button className="btn btn-primary">Search</button>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Col sm="12">
        <MyDataTable
          title={"Our Aasra"}
          name={"Our Aasra"}
          columns={tableColumn}
          data={tableDate}
          isLoading={isLoading}
          fileName={"Aasra List"}
        />
      </Col>
    </>
  );
};

export default OurAasra;
