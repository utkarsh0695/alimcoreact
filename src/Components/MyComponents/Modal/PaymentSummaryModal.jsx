import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { H3, H6 } from "../../../AbstractElements";
import { useForm } from "react-hook-form";
import { RUPEES_SYMBOL } from "../../../Constant";

const PaymentSummaryModal = ({ show, handleClose, rowData }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <H3>Payment Summary</H3>
        </Modal.Header>
        <hr></hr>
        <Modal.Body>
          <div class="row"><div class="mt-3 col-sm-12 col-md-12 col-lg-12">
            <div class="table-responsive"><table class="table table-hover table-bordered table-md"><thead><tr>
              <th scope="col">Transaction Id</th>
              <th scope="col">Date</th>
              <th scope="col">Mode</th>
              <th scope="col">Amount</th>
            </tr></thead> <tbody>
                <tr>
                  <td>{rowData.transaction_id || ''}</td>
                  <td>{rowData.payment_date || ''}</td>
                  <td style={{textTransform:"capitalize"}}>{rowData.payment_method || ''}</td>
                  <td>{RUPEES_SYMBOL}{rowData.paid_amount || ''}</td>
                </tr></tbody>
            </table>
            </div>
          </div>
          </div>  </Modal.Body>
      </Modal>
    </>
  )
}

export default PaymentSummaryModal;