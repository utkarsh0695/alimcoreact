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

const PaymentModal = (props) => {
  // console.log(props, "data");
  const fixedCharge = props?.data?.ticketDetail?.length > 0 ? props?.data?.ticketDetail[0]?.repairPrice : 0 || 0;
  const grandTotal= Math.round(props?.data?.totalAmount+props?.data?.gstAmount || 0).toFixed(2)
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
    return parseFloat(a) + parseFloat(b)
  }

  const filteredData = props?.data?.ticketDetail?.filter(item => item.repairCheckValue === "Purchase");
  const filteredData1 = props?.data?.ticketDetail?.filter(item => item.repairCheckValue === "Repair/Replace");

  const totalSpareCost1 = () => {
    const total = filteredData?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(4)
  }
  const totalLabourCost1 = () => {
    const total = filteredData?.reduce(
      (total, row) => (total + (row.repairServiceCharge) * row.qty),
      0
    )
    return (total)?.toFixed(4)
  }
  const finalTotal1 = () => {
    const a = totalSpareCost1();
    const b = totalLabourCost1()
    return parseFloat(a) + parseFloat(b)
  }

  const totalSpareCost2 = () => {
    const total = filteredData1?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(4)
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

  const calculateDifference = () => {
    const total1 = finalTotal();
    const total2 = finalTotal2();

    // Always return the absolute difference
    return Math.abs(total1 - total2);
  };

  // console.log(props?.data,"pyamentData")
  return (
    <Modal size="xl" isOpen={props?.isOpen} toggle={props?.toggle}>
      <ModalHeader toggle={props?.toggle}>Payment</ModalHeader>
      <hr></hr>
      <ModalBody>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{props?.data?.product_name}</h5>
            {props?.data?.warranty ? (
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
        </div>
        <Row>
          <div>
            <table
              className="table table-bordered table-scroll mt-3"
              id="productTable"
            >
              <thead>
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
                      <td>{item?.repairCheckLabel}</td>
                      <td>{item?.new_manufacture_name || "N/A"}</td>
                      <td>{item?.old_serial_number || "N/A"}</td>
                      <td>{item?.old_manufacture_name || "N/A"}</td>
                      <td>{item?.new_serial_number || "N/A"}</td>
                      <td>{item?.qty}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item?.productPrice).toFixed(4)}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item?.serviceCharge).toFixed(4)}</td>
                      <td>{RUPEES_SYMBOL}{parseFloat(item.qty * item.productPrice).toFixed(4)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-5 mt-4 pt-5 pl-2">
            {props?.data?.warranty && props?.data?.repairCheckValue == "Purchase" ? <>
              {" "}
              {props?.paymentOptions?.map((option, index) => (
                <label
                  className="d-block"
                  htmlFor={`option-${index}`}
                  key={index}
                >
                  <input
                    className="radio_animated"
                    id={`option-${index}`}
                    type="radio"
                    name="payment-option"
                    value={option}
                    checked={props?.selectedOption === option}
                    onChange={props?.handleOptionChange}
                  />
                  {option}
                </label>
              ))}
            </> : (
              <>
                {" "}
                {props?.paymentOptions?.map((option, index) => (
                  <label
                    className="d-block"
                    htmlFor={`option-${index}`}
                    key={index}
                  >
                    <input
                      className="radio_animated"
                      id={`option-${index}`}
                      type="radio"
                      name="payment-option"
                      value={option}
                      checked={props?.selectedOption === option}
                      onChange={props?.handleOptionChange}
                    />
                    {option}
                  </label>
                ))}
              </>
            )}
          </div>
          <div className="col-md-7 col-md-3 mt-4">
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
                  <td className="bold">Total Spare Cost + Total Labour Charge</td>
                  <td>
                    {/* {RUPEES_SYMBOL} {" "}
                    {totalSpareCost()} */}
                    {RUPEES_SYMBOL} {" "}
                    {props?.data?.total || 0}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Total Labour Charge</td>
                  <td>
                    {/* {RUPEES_SYMBOL}{totalLabourCost()} */}
                    {RUPEES_SYMBOL} {" "} {props?.data?.serviceCharge || 0}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Purchase Cost</td>
                  <td>
                    {RUPEES_SYMBOL} {" "}{finalTotal1()}
                    {/* {props?.data?.total || " "} */}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Repair/Replace Cost </td>
                  <td>
                    {RUPEES_SYMBOL} {" "} {finalTotal2()}
                    {/* {props?.data?.total || " "} */}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Discount </td>
                  <td>
                    {/* {RUPEES_SYMBOL}{finalTotal2()} */}

                    {RUPEES_SYMBOL} {" "}  {props?.data?.discount || 0}
                  </td>
                </tr>
                <tr>
                  <td className="bold">Additional Discount  </td>
                  <td>
                    {/* {RUPEES_SYMBOL}{finalTotal2()} */}

                    {RUPEES_SYMBOL} {" "}  {props?.data?.additionalDiscount}
                  </td>
                </tr>
                <tr>
                  <td className="bold">GST Amount</td>

                  <td>{parseFloat(props?.data?.gstAmount || 0).toFixed(4)}</td>

                </tr>
                <tr>
                  <td>
                    <span className="font-weight-bold">Grand Total</span>
                  </td>
                  <td>
                    <span className="font-weight-bold">
                      {/* {RUPEES_SYMBOL} {finalTotal1() } */}
                      {RUPEES_SYMBOL} {" "} {grandTotal}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          disabled={props?.isLoading}
          onClick={() => props?.handlePayment(props?.data)}
        >
          {props?.data?.warranty ? "Close Ticket" : "Pay"}
        </Button>{" "}
        <Button color="secondary" onClick={props?.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentModal;
