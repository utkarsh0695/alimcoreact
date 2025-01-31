import React from "react";
import DataTable from "react-data-table-component";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { H6 } from "../../../AbstractElements";
import { RUPEES_SYMBOL } from "../../../Constant";

const SalesDetailModal = ({ show, handleClose, salesData }) => {
  if (!salesData) return null; // Handle case where salesData is undefined or null
  console.log(salesData, "sss");

  return (
    <>
      <Modal size="xl" isOpen={show} toggle={handleClose}>
        <ModalHeader toggle={handleClose} className="justify-content-center">Sales Detail</ModalHeader>
        <hr></hr>
        <ModalBody>
          <Row className="mb-5">
          <Col>
              <h5>Customer Information</h5>
              <table
                className="table table-responsive mt-3 table-striped"
                id="productTable"
              >
              <tbody>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Mobile No</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                  </tr>
                    <tr >
                      <td>{salesData.name}</td>
                      <td>{salesData.mobile_no}</td>
                      <td>{salesData.email}</td>
                      <td>{salesData.address}</td>
                    </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row>
            <div>
              <h5>Product Details</h5>
              <table
                className="table table-responsive table-bordered table-scroll mt-3"
                id="productTable"
              >
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Product</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Manufacturer</th>
                    <th scope="col">Job Description</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.ticketDetail?.map((ticket, index) => (
                    <tr key={index}>
                      <td>{ticket.categoryLabel}</td>
                      <td>{ticket.productLabel}</td>
                      <td>{ticket.qty}</td>
                      <td>{ticket.unitPrice}</td>
                      <td>{ticket.amount}</td>
                      <td>{ticket.new_manufacture_name || "N/A"}</td>
                      <td>{ticket.job_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="col-md-7 col-md-3 mt-4">
                <H6>Payment Summary</H6>
                <table className="table table-striped table-sm">
                  <tbody>
                    <tr>
                      <td className="bold">Total Spare Cost:</td>
                      <td>
                        {RUPEES_SYMBOL} {salesData.totalSpareCost}
                      </td>
                    </tr>
                    <tr>
                      <td className="bold">GST Amount:</td>
                      <td>
                        {/* {RUPEES_SYMBOL}{totalLabourCost()} */}
                        {RUPEES_SYMBOL} {salesData.gstAmount}
                      </td>
                    </tr>
                    <tr>
                      <td className="bold">Grand Total:</td>
                      <td>
                        {RUPEES_SYMBOL} {salesData.grandTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Row>
        </ModalBody>
        {/* <ModalFooter> */}
          {/* <Button color="secondary" onClick={handleClose}>
            Close
          </Button> */}
        {/* </ModalFooter> */}
      </Modal>
    </>
  );
};

export default SalesDetailModal;
