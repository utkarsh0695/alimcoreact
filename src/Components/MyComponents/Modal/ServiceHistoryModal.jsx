import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import { H3, H6 } from "../../../AbstractElements";
import { RUPEES_SYMBOL } from "../../../Constant";

const ServiceHistoryModal = (props) => {
  const fixedCharge = props?.data?.ticketDetail?.length > 0 ? props?.data?.ticketDetail[0]?.repairPrice : 0 || 0;
  const totalSpareCost = () => {
    const total = props?.data?.ticketDetail?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(2)
  }
  const totalLabourCost = () => {
    const total = props?.data?.ticketDetail?.reduce(
      (total, row) => (total + (row.repairServiceCharge) * row.qty),
      0
    )
    const fixed = fixedCharge;
    return (total)?.toFixed(2)
  }
  const finalTotal = () => {
    const a = totalSpareCost();
    const b = totalLabourCost()
    return parseFloat(a) + parseFloat(b) + parseFloat(fixedCharge)
  }

  const filteredData =  props?.data?.ticketDetail?.filter(item => item.repairCheckValue === "Purchase");
  const filteredData1 =  props?.data?.ticketDetail?.filter(item => item.repairCheckValue === "Repair/Replace");

  const totalSpareCost1 = () => {
    const total =  filteredData?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(2)
  }
  const totalLabourCost1 = () => {
    const total = filteredData?.reduce(
      (total, row) => (total + (row.repairServiceCharge) * row.qty),
      0
    )
    return (total)?.toFixed(2)
  }
  const finalTotal1 = () => {
    const a = totalSpareCost1();
    const b = totalLabourCost1()
    return parseFloat(a) + parseFloat(b)
  }

  const totalSpareCost2 = () => {
    const total =  filteredData1?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(2)
  }
  const totalLabourCost2 = () => {
    const total = filteredData1?.reduce(
      (total, row) => (total + (row.repairServiceCharge) * row.qty),
      0
    )
    return (total)?.toFixed(2)
  }
  const finalTotal2 = () => {
    const a = totalSpareCost2();
    const b = totalLabourCost2()
    return parseFloat(a)
  }

  return (
    <Modal size="xl" isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle} style={{ borderBottom: '1px solid #ddd' }}>Service History</ModalHeader>

      <ModalBody>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{props?.data?.product_name}</h5>
            {props?.data?.ticketDetail[0]?.warranty ? (
              <span className="badge badge-success">In Warranty</span>
            ) : (
              <span className="badge badge-danger">Out of Warranty</span>
            )}
          </div>
          <div>
            <span className="float-right">
              Ticket ID : <b>{props?.data?.ticket_id}</b>
              <br></br>
              Customer Name: <b>{props?.data?.customer_name}</b>
              <br></br>
              Customer Mobile: <b>{props?.data?.mobile}</b>
            </span>
          </div>



          {/* <div className="row mt-2">
           <div className="col-md-4">
           Ticket ID :<span><b>{props?.data?.ticket_id}</b></span>
           </div>
           <div className="col-md-4">
           Customer Name :<span><b>{props?.data?.customer_name}</b></span>
           </div>
           <div className="col-md-4">
           Customer Mobile :<span><b>{props?.data?.mobile}</b></span>
           </div>
          </div> */}
        </div>
        <Row>
          <div>
            <table
              className="table table-bordered table-scroll mt-3"
              id="productTable"
            >
              <thead style={{ background: '#f3f3f3' }}>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Product</th>
                  <th scope="col">Repairing and Handling</th>
                  <th scope="col">Repairing and Handling</th>
                  <th scope="col">Old Part Manufacture</th>
                  <th scope="col">Old Part Sr.No.</th>
                  <th scope="col">New Part Manufacture</th>
                  <th scope="col">New Part Sr.No.</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Price</th>
                  <th scope="col">Labour Charge</th>
                  {/* <th scope="col">GST (%)</th> */}
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {props?.data?.ticketDetail?.map((item, index) => (
                  <>
                    <tr key={index}>
                      <td>{item?.categoryLabel}</td>
                      <td>{item?.productLabel}</td>
                      <td>{item?.repairLabel}</td>
                      <td>{item?.repairCheckLabel || "N/A"}</td>
                      <td>{item?.new_manufacture_name || "N/A"}</td>
                      <td>{item?.old_serial_number || "N/A"}</td>
                      <td>{item?.old_manufacture_name || "N/A"}</td>
                      <td>{item?.new_serial_number || "N/A"}</td>
                      <td>{item?.qty}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item?.productPrice).toFixed(2)}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item?.serviceCharge).toFixed(2)}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item.qty * item.productPrice).toFixed(2)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-8">
            <div className="form-group"><label for="description" className="from-label form-label">Description</label><div className="form-control-wrap"><textarea id="description" class="form-control" rows="6" readonly="" value={props?.data?.job_description} ></textarea></div></div>
          </div>
          <div className="col-md-4 col-md-3 mt-4">
            <H6>Payment Summary</H6>
            <table className="table table-striped table-sm">
              <tbody>
                {/* <tr>
                  <td className="bold">Fixed Charge</td>
                  <td>
                    <span>
                      {" "}
                      {RUPEES_SYMBOL} {fixedCharge}
                    </span>
                  </td>
                </tr> */}
                <tr>
                  <td className="bold">Total Spare Cost</td>
                  <td>
                    {RUPEES_SYMBOL} {" "}
                    {totalSpareCost()}
                  </td>
                </tr>
                {/* <tr>
                  <td className="bold">GST</td>

                  <td>{props?.data?.gst || 0}%</td>

                </tr> */}
                <tr>
                  <td className="bold">Purchase Cost</td>
                  <td>
                    {RUPEES_SYMBOL}{finalTotal1()}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Repair/Replace Cost </td>
                  <td>
                    {RUPEES_SYMBOL}{finalTotal2()}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Total Labour Charge</td>
                  <td>
                    {RUPEES_SYMBOL}{totalLabourCost()}
                  </td>
                </tr>

                <tr>
                  <td>
                    <span className="font-weight-bold">Grand Total</span>
                  </td>
                  <td>
                    <span className="font-weight-bold">
                      {RUPEES_SYMBOL} {finalTotal1()}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ServiceHistoryModal;
