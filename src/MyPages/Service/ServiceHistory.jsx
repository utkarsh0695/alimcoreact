import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import useLogout from "../../util/useLogout";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { serviceHistoryListAPI } from "../../api/master";
import { BsEye } from "react-icons/bs";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import ServiceHistoryModal from "../../Components/MyComponents/Modal/ServiceHistoryModal";
const ServiceHistory = () => {
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
    reset,
    formState: { errors },
  } = useForm();
  const [tableColumn, setTableColumn] = useState([
    {
      name: "Ticket Id",
      selector: (row) => row.ticket_id,
      sortable: false,
    },
    {
      name: "Aasra Name",
      selector: (row) => row.aasraName,
      sortable: false,
      width: "250px",
      wrap: true
    },
    {
      name: "Period",
      selector: (row) => row.month,
      sortable: false,
      width: "250px",
      wrap: true
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
      sortable: false,
      width: "250px",
      wrap: true
    },
    {
      name: "In/Out Warranty",
      selector: (row) => row.ticketDetail[0]?.warranty,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          {row.ticketDetail[0]?.warranty ? (
            <span className="badge badge-success">In Warranty</span>
          ) : (
            <span className="badge badge-warning">Out of Warranty</span>
          )}
        </div>
      ),
    },
    {
      name: "Closing Date",
      selector: (row) => row.closeDate,
      sortable: false,
      width: "250px",
      wrap: true
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Button
            id={'view-' + row.id}
            outline
            color={`warning`}
            size={`xs`}
            className={`me-2`}
            onClick={() => handleView(row)}
            style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
          >
            {" "}
            <BsEye style={{ height: '.8rem', width: '.8rem' }} />
          </Button>
          <ToolTip id={'view-' + row.id} name={'View'} option={'top'} />
        </div>
      ),
    },

  ]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [historyModal, setHistoryModal] = useState(false);

  const toggleHistory = () => {
    setHistoryModal(!historyModal);
  };
  const handleView = (row) => {
    console.log(row, "ooooo")
    setRowData(row);
    toggleHistory();
  };

  const onFormSubmit = (data) => {
    setIsLoading(true)
    const warrantyValue = data.warranty ? data.warranty.value : null;

    const bodyData = {
      aasra_id: data.aasraId?.value || null,
      startDate: data.startDate ? new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)).toISOString() : null,
      endDate: data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate())).toISOString() : null,
      warranty: data?.warranty?.value ,

    };

    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    console.log(data,bodyData, "hhhhh")
    serviceHistoryListAPI(bodyData, token)
      .then((res) => {
        if (res.data.status === "success") {
          setIsLoading(false);
          setData(res?.data?.data?.tableData);
          toast.success(res.data.message);
        } else if (res.data.status == "failed") {
          setData([]);
          setIsLoading(false);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Service History"
        parent="Aasra center"
        title="Service History"
      />
      {/* <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
              <Col sm={6}>
                <Input
                  className="form-control"
                  {...register("udId", {
                    required: "Aadhaar number or udId is required",
                  })}
                  placeholder="Enter your Aadhaar number or udId"
                  value={watch("udId")}
                  onChange={(e) => {
                    setValue("udId", e.target.value);
                    trigger("udId");
                  }}
                />
                {errors.udId && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errors.udId.message}
                  </span>
                )}
              </Col>
              <Col sm={6}>
                <Row>
                  <Col xs={4}>
                    <Button color="primary" type="submit">
                      Search
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card> */}
      <Row>
        <Col sm="12">
          <MyDataTable
          required
            export
            SearchCall
            aasraType
            dateFilter
            warranty
            onFormSubmit={onFormSubmit}
            search="search by aasra name/ticket name/product name"
            name={"Service History"}
            fileName={"Service History"}
            title="Service History List"
            data={data}
            isLoading={isLoading}
            columns={tableColumn}
          />
        </Col>
      </Row>
      {
        <ServiceHistoryModal
          toggle={toggleHistory}
          isOpen={historyModal}
          data={rowData}
        />
      }
    </>
  );
};

export default ServiceHistory;
