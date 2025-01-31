import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { H3, H6 } from "../../../AbstractElements";
import { useForm } from "react-hook-form";
import { ModalFooter, Spinner } from "reactstrap";
const CashModalOpen = ({ show, toggle, data, handlePayment, isLoading,receipt }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm();
const fixedPrice=data?.ticketDetail?.length>0 ? data?.ticketDetail[0]?.repairPrice:0||0
  const onSubmit = (data1) => {
    const transactionDetail = {
      receipt_no: receipt,
    };
    handlePayment("Cash", data, transactionDetail);
  };


  // Set Value in amount input

  const totalAmount=Math.round(data?.totalAmount+data?.gstAmount).toFixed(2)

  const totalSpareCost = () =>{
    const total = data?.ticketDetail?.reduce(
      (total, row) => total + row.qty * row.productPrice,
      0
    )
    return total?.toFixed(2)
  }
  const totalLabourCost = () =>{
    const total =data?.ticketDetail?.reduce(
      (total, row) => (total + row?.qty*row.repairServiceCharge),
      0
    )
    const fixed = fixedPrice;
    return (total)?.toFixed(2)
  }
  const finalTotal = () =>{
    const a = totalSpareCost();
    const b = totalLabourCost()
    // console.log("a",a,"b",b)
    return parseFloat(a)+parseFloat(b)
  }
  const filteredData =  data?.ticketDetail?.filter(item => item.repairCheckValue === "Purchase");
  const filteredData1 =  data?.ticketDetail?.filter(item => item.repairCheckValue === "Repair/Replace");

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

  const calculateDifference = () => {
    const total1 = finalTotal();
    const total2 = finalTotal2();
  
    // Always return the absolute difference
    return Math.abs(total1 - total2);
  };

  
  return (
    <>
      <Modal show={show} onHide={toggle}>
        <Modal.Header closeButton>
          <H3>Cash Payment</H3>
        </Modal.Header>
        <hr></hr>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="row">
              <div className="mt-3 col-sm-12 col-md-12 col-lg-12">
                <div className="table-responsive">
                  <table className="table table-hover table-bordered table-md">
                    <thead>
                      <tr>
                        <th scope="col"> Receipt No</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            id="receipt_no"
                            className="form-control"
                            // {...register("receipt_no", {
                            //     required: "Receipt No is required",
                            // })}
                            disabled
                            value={receipt}
                            // value={watch("receipt_no")} // Assuming you're using react-hook-form's watch
                            type="text"
                          />
                          {errors.receipt_no && (
                            <p className="invalid">
                              {errors.receipt_no.message}
                            </p>
                          )}
                        </td>
                        <td>
                          <input
                            className="form-control"
                            disabled
                            value={totalAmount}
                            type="text"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>{" "}
          </Modal.Body>
          <ModalFooter>
            <Button color="danger" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" color="light"/>:'Submit'}
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default CashModalOpen;
