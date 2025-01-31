import logo from "../assets/images/logo/logo_invoice.jfif";
import watermark from "../assets/images/logo/Alimco-job.png";
import electricLogo from "../assets/images/logo/alimco-elctric-logo.png";
import waterMarkJob from "../assets/images/logo/Alimco-job.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToWords } from "to-words";
import { RUPEES_SYMBOL } from "../Constant";
import { useState } from "react";

export const printJobCard1 = (row) => {
  const ticketDetailsRows = row?.ticketDetail
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          index + 1
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.categoryLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.productLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.repairLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.old_serial_number
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.new_serial_number
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.qty
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.price
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.serviceCharge
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;text-align: center;">${
          item.qty * item.price + item.serviceCharge
        }</td>
    </tr>
`
    )
    .join("");
  const jobDetailsRows = row?.ticketDetail
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          index + 1
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.repairLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.serviceCharge
        }</td>
         </tr>
`
    )
    .join("");

  const totalAmount = row?.ticketDetail.reduce(
    (total, item) => total + item.serviceCharge,
    0
  );

  const printWindow = window.open();
  printWindow.document.write(
    `
        <!DOCTYPE html>
        <html lang="en">
       <head>
      <meta charset="utf-8">
      <title> Artificial Limbs Manufacturing Corporation of India</title>
       <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            margin: 0 auto;
            border: 1px solid #ccc;
            max-width: 800px;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            max-width: 100px;
        }
        .header h1, .header h2 {
            margin: 5px 0;
        }
        .details, .job-description, .labour-charges, .spare-parts {
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }
        table, th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
  </head>
  <body style="margin: 10px 0; font-size: 12px;line-height: 16px; ">
 <div class="container">
    <div class="header" style="display: flex;justify-content: center;">
       <div>
        <img src=${logo} alt="ALIMCO Logo">
       </div>
        <div>
        <h2 style="margin: 5px 0px;">ALIMCO AUTHORISED SERVICE AND REPAIR AGENT, (AASRA)</h2>
        <h4 style="margin: 5px 0px;">BAHADURGARH, TIKAMGARH, MADHYAPRADESH-472001</h4>
        <span>PHON NO-6268131939</span>
        <h3>JOB-CARD</h3>
        </div>

    </div>
    <div>

    </div>

    <div class="details">
     <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(360deg);
                font-size: 12em;
                color: rgba(233, 226, 226, 0.13);
                z-index: 0;
                pointer-events: none; /* Ensures watermark does not interfere with table content */
                font-family: 'Denk One', sans-serif;
                text-transform: uppercase;
                text-align: center;
                width: 100%;
            ">
                <img src=${watermark}
                alt="alimco-logo"
                width="180px"
                style="opacity: 0.2;">
            </div>
        <table>
            <tr>
                <th>SL. No.</th>
                <td>${row?.sr_no}</td>
                <th>Service Order NO.</th>
                <td>${row?.ticket_id}</td>
            </tr>
            <tr>
                <th>Customer Name</th>
                <td>${row?.customer_name}</td>
                <th>Date</th>
                <td></td>
            </tr>
            <tr>
                <th>Customer Address</th>
                <td></td>
                <th>Mobile No.</th>
                <td></td>
            </tr>
            <tr>
                <th>Adhar No.</th>
                <td></td>
                <th>Date of Distribution</th>
                <td></td>
            </tr>
        </table>
    </div>

    <div class="job-description">
        <h3 style="margin: 5px 0px;">Job Description</h3>
        <table>
            <tr>
                <td style="height: 100px;">${row?.description}</td>
            </tr>
        </table>
    </div>

    <div class="labour-charges">
        <h3 style="margin: 5px 0px;">Job Description</h3>
        <table>
            <tr>
                <th>SL. No.</th>
                <th>Description of Goods</th>
                <th>Labour Rate (in Rs)</th>
            </tr>
           ${jobDetailsRows}
           <tr>
           <td></td>
           <th style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">Total Labour Charge</th>
             <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${totalAmount}</td>
           </tr>
        </table>
    </div>

    <div class="spare-parts">
        <h3 style="margin: 5px 0px;">Spare Parts</h3>
        <table>
            <tr>
                <th>Quantity</th>
                <th>Category</th>
                <th>Spare Part</th>
                <th>Description of Goods</th>
                <th>Old Sr.No.</th>
                <th>New Sr.No.</th>
                <th>Qty</th>
                <th>Basic Price</th>
                <th>Service Charge</th>
                <th>Amount</th>
            </tr>
           ${ticketDetailsRows}
           <tr>

        </table>
    </div>



        <table>
            <tr>
                <th>Total Labour Charge</th>
                <td>${row?.serviceCharge}</td>
            </tr>
            <tr>
                <th>Total Spare Cost</th>
                <td>${row?.subtotal}</td>
            </tr>
            <tr>
                <th>GST</th>
                <td>${row?.gst}</td>
            </tr>
            <tr>
                <th>Total</th>
                <td>${row?.totalAmount}</td>
            </tr>
        </table>

<table>
<tr>
<td style="font-size: 14px;">Job done by AASRA Operator Signature</td>
<td style="font-size: 14px;">Customers/Beneficiary Signature</td>
<td style="font-size: 14px;">Job Verified by ALIMCO service Deptt.</td>
</tr>
</table>


</div>
  </body>
  </html>
  `
  );
  printWindow.focus();
  printWindow.print();
};

export const printJobCard = (row) => {
  let calc_discount = 0;
  let discountedAmt = 0;
  let totalAmount = 0; // Initialize to calculate total cost
  let productPrices = []; // Array to store productPrice values
  const fixedPrice = row?.ticketDetail[0]?.repairPrice || 0;
  const ticketDetailsRows = row?.ticketDetail
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center;">${
          index + 1
        }</td>


        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center;">${
          item.productLabel
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center;">${
          item.qty
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center;">${
          item.repairCheckLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center;">${
          item.productPrice
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

        ${RUPEES_SYMBOL}${
        (item.qty * item.productPrice)?.toFixed(4) || 0.0
      }</td>
    </tr>
`
    )
    .join("");
  const jobDetailsRows = row?.ticketDetail
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">${
          index + 1
        }</td>
        <td  style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">${
          item.repairLabel
        }</td>
        <td  style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center">${
          item.serviceCharge
        }</td>
         </tr>
`
    )
    .join("");

  //   const totalAmount = row?.ticketDetail.reduce(
  //     (total, item) => total +(row.qty*item?.price+ item.serviceCharge),
  //     0
  //   );

  let totalLabourAmount = row?.ticketDetail.reduce((total, item) => {
    const fixedCharge = fixedPrice;
    const itemTotal = total + item.qty * item.serviceCharge;
    // console.log("5555", itemTotal, total, fixedCharge);

    return itemTotal || 0.0;
  }, 0);

  //   console.log(totalLabourAmount, "ttttt");
  if (row?.warranty === true) {
    if (row?.ticketDetail.length > 0) {
      row?.ticketDetail.forEach((ticket) => {
        const productPrice = ticket.productPrice;
        const qty = ticket.qty;

        productPrices.push(productPrice); // Add product price to the array

        // Check the condition for repair value
        if (ticket.repairCheckValue === "Purchase") {
          // No discount for purchases
          calc_discount += productPrice * qty * (0 / 100); // No discount
          totalAmount += productPrice * qty; // Include the product price with the quantity
        } else {
          // Apply 100% discount for repairs
          calc_discount += productPrice * qty * (100 / 100); // 100% discount for repairs
          totalAmount += 0; // Total amount for repairs should be zero
        }
      });
    }

    // console.log("All Product Prices:", productPrices); // This will log the array with all product prices
    // console.log("Total Discount Amount", calc_discount);

    // discountedAmt = totalAmount - calc_discount; // Calculate the final amount after discount
    // discountedAmt = Math.max(0, discountedAmt);
    // console.log("Total payable Amount", discountedAmt);
  } else {
    // If out of warranty, no discount for any of them
    // console.log("No discount applied, warranty is false.");
    discountedAmt = totalAmount; // No discount applied
    // console.log("Discounted Amount without discount", discountedAmt);
  }

  // Calculate the spare amount based on qty * productPrice for all items
  const spareAmount = row?.ticketDetail.reduce((total, item) => {
    // If it's a repair, the value is 0 (100% discount)
    return (
      total +
      (item.repairCheckValue === "Repair" ? 0 : item.qty * item.productPrice)
    );
  }, 0);

  //   console.log("Spare Amount:", spareAmount);

  // Ensure `discountedAmt` is valid before calculating `grandTotal`
  // Ensure calc_discount has a valid value
  const validDiscount = calc_discount || 0;

  // Check if spareAmount has a valid value (greater than 0)
  let grandTotal = 0;
  if (spareAmount > 0) {
    grandTotal = spareAmount - validDiscount;
  } else {
    grandTotal = validDiscount;
  }

  // Ensure the grandTotal is not negative
  grandTotal = Math.max(0, grandTotal);

  //   console.log("Grand Total:", grandTotal);

  const total = row?.totalAmount || 0.0; // Default to 0 if undefined or null
  const gstAmount = row?.gstAmount || 0.0; // Default to 0 if undefined or null

  // Calculate the sum
  const totalWithGst = total + gstAmount;

  const formattedOutput = `${Math.round(totalWithGst).toFixed(2) || 0.0}`; // This will format to 2 decimal places
  const printWindow = window.open();
  printWindow.document.write(
    `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <title> JOB CARD-${row?.aasra_type}-${row?.aasraName}</title>
  <style>
                 @media print {
            body {
                margin: 0;
                padding: 0;
            }

            .page {
                margin: 0;
                padding: 0;
                width: 100%;
            }

            /* A4 size for printing */
            @page {
                size: A4;
                margin: 0;
            }

            /* Watermark styles */
            .subpage {
                background: url(${waterMarkJob}) no-repeat center center;
                background-size: contain;
                // page-break-before: always;
                page-break-after: always;
                display: block;
                height: 100%;
            }

           
        }
              </style>
</head>
<body style="margin: 10px 0; font-size: 12px;line-height: 16px;">
    <div class="page">
        <div class="subpage">
            <div style="padding: 2px; height: -webkit-fill-available;">
                <table cellpadding="0" cellspacing="0" id="body_TblHeader"
                    style="border: solid 0px black; font-family: Calibri;
                    font-size: 14px; margin: auto;
                    width: 740px;
                    background:url(${waterMarkJob})
                    ;
                    background-size: cover;
        background-position: center;">
                    <tr>
                        <td colspan="">
                            <table cellpadding="0" cellspacing="0" width="100%">
                             <thead>
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 2px;">
                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td width="20%"
                                                            style="border-bottom:0px solid black; text-align:center;">
                                                            <img src=${logo}
                                                                alt="alimco"
                                                                style="width:100px;">
                                                        </td>
                                                        <td width="75%"
                                                            style="border-bottom:0px solid black; text-align:center; padding-left: 10px;">
                                                            <strong style="font-size: 22px;text-transform:uppercase">
                                                            ALIMCO
                                                            ${
                                                              row?.aasra_type ==
                                                              "AC"
                                                                ? "AUTHORISED SERVICE AND REPAIR AGENCY"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                            </strong><br>

                                                            <span style="font-size: 12px;width:200px;">${
                                                              row?.aasra_address
                                                            } </span><br>
                                                            <span style="font-size: 12px;width:200px;"><b>Phone No. </b> ${
                                                              row?.aasra_mobile ||
                                                              ""
                                                            } </span>
                                                        </td>
                                                        <td width="5%">

                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>

                                     <tr>
                                          <td colspan="2" style="border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; text-align:center;">
                                              <span><b style="font-size: 20px;">JOB-CARD</b></span>
                                          </td>
                                      </tr>

                                    <tr>
                                        <td style="width: 50%;">
                                              <table cellpadding="0" cellspacing="0" style="width: 100%;border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black;">
                                <tr>
                                    <td
                                        style="line-height: 20px;padding: 5px 0px 0px 5px;border-bottom: 0px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SL. No.
                                                :</b> ${row?.sr_no}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Name
                                                :</b> ${row?.customer_name}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Address
                                                :</b> ${row?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Aadhaar
                                                Number :</b>${
                                                  row?.aadhaar || ""
                                                }
                                        </span><br>


                                    </td>
                                    <td
                                        style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 0px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; ">Service Order
                                                Number :</b>${
                                                  row?.ticket_id || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                                Date :</b>
                                            ${row?.createdAt || ""}</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Mobile No.
                                                :</b>${row?.mobile || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Date of Distribution :</b>${
                                                  row?.dstDate || ""
                                                }
                                        </span><br>

                                    </td>
                                </tr>
                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colspan="2" style="border: 1px solid black;">
                                            <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="height: 100px;vertical-align: top;">


                                                       <b>Customer Complaint</b> : <span>${
                                                         row?.description || ""
                                                       }</span>

                                                        <p style="border-bottom: 1px solid black;"></p>
                                                        <p style="border-bottom: 1px solid black;"></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th style="text-align: center;font-size: 16px;background: #9f9b9b;">
                                                        Job Description</th>
                                                </tr>
                                                <tr>
                                                    <td style="height: 120px;vertical-align: top;">
                                                     <p style="border-bottom: 1px solid black;margin-left: 5px;">
                                                      ${
                                                        row?.job_description ||
                                                        ""
                                                      }</p>

                                                        <p style="border-bottom: 1px solid black;"></p>
                                                        <p style="border-bottom: 1px solid black;"></p>

                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                   </thead>
 <tbody>
                                    <tr>
                                        <td colspan="2" style="padding-top: 5px;height: 490px;vertical-align: top;">
                                            <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                    <tr>
                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50px;text-align: center;">
                                                            Sr. No.</th>
                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                            Labour Rate (in Rs)</th>
                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;">
                                                            Amount</th>
                                                    </tr>
                                                    ${jobDetailsRows}
                                                    <tr>
                                                        <th colspan="2"
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                            Total Labour Charge</th>
                                                        <td
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">
                                                              ${RUPEES_SYMBOL} ${
      totalLabourAmount || 0.0
    }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table style="width: 100% ;padding-top: 5px;" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                    <tr>
                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Sr. No.</th>

                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Spare Part</th>
                                                       <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Quantity</th>
                                                        <th
                                                       <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Repairing and Handling</th>
                                                        <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Basic Price</th>
                                                         <th
                                                            style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center">Amount</th>
                                                    </tr>
                                                   ${ticketDetailsRows}
                                                    <tr>
                                                        <th
                                                            style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center" colspan="5">Total Spare Part</th>
                                                        <td
                                                            style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center">${RUPEES_SYMBOL} ${
      spareAmount?.toFixed(4) || 0.0
    }</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>






                                </tbody>
                                 <tfoot>
                                          <table style="width: 100%;">
                                              <tr>
                                                  <td style="width: 65%;vertical-align:bottom;">
                                                      <table style="border-top: 0px solid black;border-bottom: 0px solid black;border-left: 0px solid black;border-right: 0px solid black;">
                                                          <tr>
                                                              <td style="width: 40%;">Job done by ALIMCO
                                                         ${
                                                           row?.aasra_type ==
                                                           "AC"
                                                             ? "Authorised Service and Repair Agency"
                                                             : ""
                                                         }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                              <br> Operator Signature</td>
                                                              <td style="width: 32%;padding-left: 10px;">Customers/Beneficiary<br> Signature</td>
                                                              <td style="padding-left: 10px;">Job Verified by ALIMCO<br> service Deptt.</td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td colspan="1"width: 35%;">
                                                      <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                            <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                      Total Spare Cost</th>
                                                                       <td
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                 ${RUPEES_SYMBOL} ${
      row?.total.toFixed(4) || 0.0 //   row?.subtotal?.toFixed(2)
    } </td>

                                                              </tr>

                                                              <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50%;">
                                                                      Total Labour Charge</th>
                                                                  <td
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                ${RUPEES_SYMBOL} ${
      row?.serviceCharge || 0.0
    } </td>
                                                              </tr>
                                                             <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50%;">
                                                                    GST Amount</th>
                                                                <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                              ${RUPEES_SYMBOL} ${
      row?.gstAmount.toFixed(4) || 0.0
    } </td>
                                                            </tr>
                                                                                                                          <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                    Discount</th>
                                                                     <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                               ${RUPEES_SYMBOL} ${
      row?.discount || 0.0
    } </td>

                                                            </tr>
                                                                                                                        <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                   Additional Discount</th>
                                                                     <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                               ${RUPEES_SYMBOL} ${
      row?.additionalDiscount || 0.0
    } </td>

                                                            </tr>
                                                              <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                      Total</th>
                                                                       <td
                                                                      style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                 ${RUPEES_SYMBOL} ${formattedOutput} </td>

                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </table>
                                          </tfoot>
                            </table>
                        </td>
                    </tr>


                </table>
            </div>
        </div>
    </div>

</body>

</html>`
  );
  // printWindow.print();
  // printWindow.close();
  printWindow.document.close(); // necessary for some browsers to finish writing before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 2000);
};

export const printJobCardBulk = (rowData) => {
  //   console.log("rowData:", rowData);
  //    return false;
  // Ensure rowData is an array and has at least one item
  if (!Array.isArray(rowData)) {
    alert("No data available to print.");
    return;
  }

  // Function to process rowData and return HTML and calculated amounts
  function processTicketDetails(rowData) {
    let totalAmount = 0;
    let spareAmount = 0;

    // Map ticketDetails for table rows
    const ticketDetailsRows = rowData.ticketDetail
      ?.map((item, index) => {
        const rowTotal = item.qty * item.productPrice;
        spareAmount += rowTotal;

        return `
          <tr key="${index}" style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px; font-size: 13px;">
            <td style="border-bottom:1px solid black; border-right:1px solid black; border-left:1px solid black; text-align: center;">${
              index + 1
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.productLabel
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.qty
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.repairCheckLabel
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.productPrice
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${RUPEES_SYMBOL}${
          rowTotal.toFixed(4) || 0.0
        }</td>
          </tr>
        `;
      })
      .join("");

    // Map jobDetails for table rows
    const jobDetailsRows = rowData.ticketDetail
      ?.map((item, index) => {
        const serviceTotal = item.qty * item.serviceCharge;
        totalAmount += serviceTotal;

        return `
          <tr key="${index}" style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px; font-size: 13px;">
            <td style="border-bottom:1px solid black; border-right:1px solid black; border-left:1px solid black;text-align: center;">${
              index + 1
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.repairLabel
            }</td>
            <td style="border-bottom:1px solid black; border-right:1px solid black; text-align: center;">${
              item.serviceCharge
            }</td>
          </tr>
        `;
      })
      .join("");

    // Calculate the discount
    const discountPercentage = rowData.ticketDetail.some(
      (item) => item.repairCheckValue === "Purchase"
    )
      ? 0
      : 100;

    const discountAmount =
      (totalAmount + spareAmount) * (discountPercentage / 100);
    const finalAmount = totalAmount + spareAmount - discountAmount;
    // Return the mapped HTML content and calculated amounts
    return {
      ticketDetailsRows,
      jobDetailsRows,
      totalAmount,
      spareAmount,
      discountAmount,
      finalAmount, // This includes the total after applying discount
    };
  }

  // Start HTML content with the header and styles
  let htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="description" content="">
              <meta name="author" content="">
              <title>JOB CARDS</title>
              <style>
                 @media print {
            body {
                margin: 0;
                padding: 0;
            }

            .page {
                margin: 0;
                padding: 0;
                width: 100%;
            }

            /* A4 size for printing */
            @page {
                size: A4;
                margin: 0;
            }

            /* Watermark styles */
            .subpage {
                background: url(${waterMarkJob}) no-repeat center center;
                background-size: contain;
                // page-break-before: always;
                page-break-after: always;
                display: block;
                height: 100%;
            }

           
        }
              </style>
            </head>
            <body style="margin: 10px 0; font-size: 12px;line-height: 16px;">
        `;

  // Loop through rowDataData to generate content for each row
  rowData.forEach((row, index) => {
    const total = row?.totalAmount || 0.0; // Default to 0 if undefined or null
    const gstAmount = row?.gstAmount || 0.0; // Default to 0 if undefined or null

    // Calculate the sum
    const totalWithGst = total + gstAmount;

    const formattedOutput = `${Math.round(totalWithGst || 0).toFixed(2)}`; // This will format to 2 decimal places

    // Process the ticket details and get the HTML and calculated values
    const { ticketDetailsRows, jobDetailsRows, totalAmount, spareAmount } =
      processTicketDetails(row);
    htmlContent += `
      <div class="page">
          <div class="subpage" style="background:url(${waterMarkJob});
     background-size: contain;
    background-position: center;
    background-repeat: no-repeat;">
              <div style="padding:2px; height: -webkit-fill-available;">
                  <table cellpadding="0" cellspacing="0" id="body_TblHeader"
                      style="border: solid 0px #000; font-family: Calibri; font-size: 14px; margin: auto; width: 740px;">
                      <tr>
                          <td colspan="">
                              <table cellpadding="0" cellspacing="0" width="100%">
                               <thead>
                                          <tr>
                                              <td colspan="2" style="padding-bottom: 2px;">
                                                 <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td width="20%"
                                                            style="border-bottom:0px solid #000; text-align:center;">
                                                            <img src=${logo}
                                                                alt="alimco"
                                                                style="width:100px;">
                                                        </td>
                                                        <td width="75%"
                                                            style="border-bottom:0px solid black; text-align:center; padding-left: 10px;">
                                                          <strong style="font-size: 22px;text-transform:uppercase">
                                                            ALIMCO
                                                            ${
                                                              row?.aasra_type ==
                                                              "AC"
                                                                ? "AUTHORISED SERVICE AND REPAIR AGENCY"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                            </strong><br>

                                                            <span style="font-size: 12px;width:200px;">${
                                                              row?.aasra_address
                                                            } </span><br>
                                                            <span style="font-size: 12px;width:200px;"><b>Phone No. </b> ${
                                                              row?.aasra_mobile ||
                                                              ""
                                                            } </span>
                                                        </td>
                                                        <td width="5%">

                                                        </td>
                                                    </tr>
                                                </table>
                                              </td>
                                          </tr>
                                      </thead>
                                  <tbody>

                                      <tr>
                                          <td colspan="2" style="border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black; text-align:center;">
                                              <span><b style="font-size: 20px;">JOB-CARD</b></span>
                                          </td>
                                      </tr>

                                       <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;border-top: 1px solid black;border-right: 1px solid black;border-left: 1px solid black;">
                                <tr>
                                    <td
                                        style="line-height: 20px;padding: 5px 0px 0px 5px;border-bottom: 0px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SL. No.
                                                :</b> ${row?.sr_no}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Name
                                                :</b> ${row?.customer_name}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Address
                                                :</b> ${row?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Aadhaar
                                                Number :</b>${
                                                  row?.aadhaar || ""
                                                }
                                        </span><br>


                                    </td>
                                    <td
                                        style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 0px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Service Order
                                                Number :</b>${
                                                  row?.ticket_id || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                                Date :</b>
                                            ${row?.createdAt || ""}</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Mobile No.
                                                :</b>${row?.mobile || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Date of Distribution :</b>${
                                                  row?.dstDate || ""
                                                }
                                        </span><br>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                                      <tr>
                                          <td colspan="2" style="border: 1px solid black;padding-top:10px;">
                                              <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                  <tr>
                                                      <td style="height: 100px;vertical-align: top;">


                                                         <b>Customer Complaint</b> : <span>${
                                                           row?.description ||
                                                           ""
                                                         }</span>

                                                          <p style="border-bottom: 1px solid black;"></p>
                                                          <p style="border-bottom: 1px solid black;"></p>
                                                          <p style="border-bottom: 1px solid black;"></p>
                                                          <p style="border-bottom: 1px solid black;"></p>
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <th style="text-align: center;font-size: 16px;background: #9f9b9b;">
                                                          Job Description</th>
                                                  </tr>
                                                  <tr>
                                                      <td style="height: 120px;vertical-align: top;">
                                                       <p style="border-bottom: 1px solid black;"></p>
                                                      ${
                                                        row?.job_description ||
                                                        ""
                                                      }
                                                          <p style="border-bottom: 1px solid black;"></p>
                                                          <p style="border-bottom: 1px solid black;"></p>
                                                          <p style="border-bottom: 1px solid black;"></p>

                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>



                                      <tr>
                                          <td colspan="2" style="padding-top: 10px;">
                                              <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                  <tbody>
                                                      <tr>
                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50px;text-align: center;">
                                                              Sr. No.</th>
                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                              Labour Rate (in Rs)</th>
                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;">
                                                              Amount</th>
                                                      </tr>
                                                      ${jobDetailsRows}
                                                      <tr>
                                                          <th colspan="2"
                                                              style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                              Total Labour Charge</th>
                                                          <td
                                                              style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">
                                                                ${RUPEES_SYMBOL} ${
      totalAmount?.toFixed(2) || 0.0
    }
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>



                                      <tr>
                                          <td colspan="2" style="padding-top: 10px; height:250px;vertical-align:top">
                                              <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                  <tbody>
                                                      <tr>
                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Sr. No.</th>

                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Spare Part</th>
                                                         <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Quantity</th>
                                                          <th
                                                         <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Repairing and Handling</th>
                                                          <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center">Basic Price</th>
                                                           <th
                                                              style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center">Amount</th>
                                                      </tr>
                                                     ${ticketDetailsRows}
                                                      <tr>
                                                          <th
                                                              style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;text-align: center" colspan="5">Total Spare Part</th>
                                                          <td
                                                              style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center">${RUPEES_SYMBOL} ${
      spareAmount?.toFixed(2) || 0.0
    }</td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                        <tr>
                                        <tfoot>
                                          <table style="width: 100%;">
                                              <tr>
                                                  <td style="width: 65%;vertical-align:bottom;">
                                                      <table style="border-top: 0px solid black;border-bottom: 0px solid black;border-left: 0px solid black;border-right: 0px solid black;">
                                                          <tr>
                                                              <td style="width: 40%;">Job done by ALIMCO
                                                         ${
                                                           row?.aasra_type ==
                                                           "AC"
                                                             ? "Authorised Service and Repair Agency"
                                                             : ""
                                                         }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                              <br> Operator Signature</td>
                                                              <td style="width: 32%;padding-left: 10px;">Customers/Beneficiary<br> Signature</td>
                                                              <td style="padding-left: 10px;">Job Verified by ALIMCO<br> service Deptt.</td>
                                                          </tr>
                                                      </table>
                                                  </td>
                                                  <td colspan="1"width: 35%;">
                                                      <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                            <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                      Total Spare Cost</th>
                                                                       <td
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                 ${RUPEES_SYMBOL} ${
      row?.total.toFixed(4) || 0.0 //   row?.subtotal?.toFixed(2)
    } </td>

                                                              </tr>

                                                              <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50%;">
                                                                      Total Labour Charge</th>
                                                                  <td
                                                                      style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                ${RUPEES_SYMBOL} ${
      row?.serviceCharge || 0.0
    } </td>
                                                              </tr>
                                                             <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;width: 50%;">
                                                                    GST Amount</th>
                                                                <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                              ${RUPEES_SYMBOL} ${
      row?.gstAmount.toFixed(4) || 0.0
    } </td>
                                                            </tr>
                                                                                                                          <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                    Discount</th>
                                                                     <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                               ${RUPEES_SYMBOL} ${
      row?.discount || 0.0
    } </td>

                                                            </tr>
                                                                                                                        <tr>
                                                                <th
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                   Additional Discount</th>
                                                                     <td
                                                                    style="border-top: 1px solid black;border-bottom: 0px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                               ${RUPEES_SYMBOL} ${
      row?.additionalDiscount || 0.0
    } </td>

                                                            </tr>
                                                              <tr>
                                                                  <th
                                                                      style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 0px solid black;">
                                                                      Total</th>
                                                                       <td
                                                                      style="border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black;border-right: 1px solid black;text-align: center;">

                                                                 ${RUPEES_SYMBOL} ${formattedOutput} </td>

                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </table>
                                          </tfoot>
                                      </tr>



                                  </tbody>
                              </table>
                          </td>
                      </tr>


                  </table>
              </div>
          </div>
      </div>
  ${index < rowData.length - 1 ? '<div class="page-break"></div>' : ""}
            `;
  });

  // Close HTML content
  htmlContent += `
            </body>
          </html>
        `;

  // Open a new window and print the document
  const printWindow = window.open();

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    //   printWindow.document.close();
    // printWindow.onload = async () => {
    //     try {
    //         // Use html2canvas to capture the content as an image
    //         const canvas = await html2canvas(printWindow.document.body, {
    //             scale: 2, // Adjust scale as needed for better resolution
    //             useCORS: true, // Ensure that cross-origin images are handled
    //         });

    //         // Get the data URL of the canvas (image)
    //         const imageData = canvas.toDataURL("image/png");

    //         // Open the image in a new tab for demonstration (optional)
    //         const newTab = window.open();
    //         newTab.document.write('<img src="' + imageData + '"/>');

    //         // Trigger the print dialog after a short delay
    //         setTimeout(() => {
    //             printWindow.print();
    //         }, 3000); // Adjust delay if necessary
    //     } catch (error) {
    //         // console.error("Error capturing content with html2canvas:", error);
    //     }
    // };
    // Trigger the print dialog
    // printWindow.print();
    // printWindow.close();
    printWindow.document.close(); // necessary for some browsers to finish writing before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  } else {
    alert(
      "Failed to open print window. Please check your browser's pop-up settings."
    );
  }
};

export const handleClosedTicketPrintBulk = (rowData) => {
  //   console.log("rowData:", rowData);

  let calc_discount = 0;
  let discountedAmt = 0;
  let totalAmount = 0; // Initialize to calculate total cost
  let productPrices = []; // Array to store productPrice values

  // Ensure rowData is an array and has at least one item
  if (!Array.isArray(rowData) || rowData?.length === 0) {
    alert("No data available to print.");
    return;
  }

  //   const calculateTotalsForRows = (rows = []) => {
  //     let overallSpareAmount = 0;
  //     let overallDiscountedAmt = 0;
  //     let overallGrandTotal = 0;

  //     if (!Array.isArray(rows)) {
  //         console.error('Expected rows to be an array, received:', rows);
  //         return {
  //             overallSpareAmount,
  //             overallDiscountedAmt,
  //             overallGrandTotal,
  //         };
  //     }
  //     if (rows?.length === 1) {
  //         console.log('Single item in rows:', rows[0]);
  //     }
  //     rows?.forEach((row) => {
  //         const fixedPrice = row?.ticketDetail[0]?.repairPrice || 0;
  //         let calc_discount = 0;
  //         let totalAmount = 0;
  //         let productPrices = [];

  //         const spareAmount = row?.ticketDetail.reduce((total, item) => {
  //             return total + (item.repairCheckValue === "Repair" ? 0 : item.qty * item.productPrice);
  //         }, 0);

  //         let totalLabourAmount = row?.ticketDetail.reduce((total, item) => {
  //             return total + item.qty * item.serviceCharge;
  //         }, 0);

  //         if (row?.warranty === true) {
  //             if (row?.ticketDetail.length > 0) {
  //                 row.ticketDetail.forEach((ticket) => {
  //                     const productPrice = ticket.productPrice;
  //                     const qty = ticket.qty;

  //                     productPrices.push(productPrice);

  //                     if (ticket.repairCheckValue === "Purchase") {
  //                         calc_discount += productPrice * qty * (0 / 100);
  //                         totalAmount += productPrice * qty;
  //                     } else {
  //                         calc_discount += productPrice * qty * (100 / 100);
  //                         totalAmount += 0;
  //                     }
  //                 });
  //             }
  //         } else {
  //             overallDiscountedAmt += totalAmount;
  //         }

  //         const validDiscount = calc_discount || 0;
  //         let grandTotal = spareAmount > 0 ? spareAmount - validDiscount : validDiscount;
  //         grandTotal = Math.max(0, grandTotal);

  //         overallGrandTotal += grandTotal;
  //         overallSpareAmount += spareAmount;
  //     });

  //     return {
  //         overallSpareAmount,
  //         overallDiscountedAmt,
  //         overallGrandTotal,
  //     };
  // };

  let htmlContent;
  // Start HTML content with the header and styles

  htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="description" content="">
          <meta name="author" content="">
          <title>CUSTOMER INVOICE</title>
          <style>
             @media print {
            body {
                margin: 0.3cm;
                padding: 0;
            }

            .page {
                margin: 15px;
                padding: 0;
                width: 100%;
            }

            /* A4 size for printing */
            @page {
                size: A4 landscape;
                margin: 0.5cm;
            }

            /* Watermark styles */
            .subpage {
                background: url(${waterMarkJob}) no-repeat center center;
                background-size: contain;
                // page-break-before: always;
                page-break-after: always;
                display: block;
                height: 100%;
            }

           
        }
          </style>
        </head>
        <body>
    `;

  // Loop through rowData to generate content for each row
  rowData?.forEach((row, index) => {
    const total = row?.totalAmount || 0;
    const gstAmount = row?.gstAmount || 0;
    // Calculate the sum
    const totalWithGst = total + gstAmount || 0;
    // console.log(totalWithGst,gstAmount,total,"ppp");
    const grandTotal = `${totalWithGst.toFixed(2)}`;
    const formattedOutput = Math.round(grandTotal); // This will format to 2 decimal places

    // console.log("RRRRR", row);
    // const fixedPrice =
    //   Array.isArray(row?.ticketDetail) && row.ticketDetail.length > 0
    //     ? row.ticketDetail[0]?.repairPrice || 0
    //     : 0;

    // console.log(row, fixedPrice, "ppppp");

    // const totalAmount = Array.isArray(row?.ticketDetail)
    //   ? row.ticketDetail.reduce((total, item) => {
    //       const itemTotal = item.qty * item.serviceCharge;
    //       return total + itemTotal;
    //     }, 0)
    //   : 0; //repair amount or labour charges
    // console.log("total amt", totalAmount);

    // const spareAmount = Array.isArray(row?.ticketDetail)
    //   ? row.ticketDetail.reduce(
    //       (total, item) => total + item.qty * item.productPrice,
    //       0
    //     )
    //   : 0;

    const toWords = new ToWords();
    const words = toWords.convert(formattedOutput, {
      currency: true,
    });
    // console.log("print closed ticket", row);

    const ticketDetailsRows =
      Array.isArray(row?.ticketDetail) && row.ticketDetail.length
        ? row.ticketDetail
            .map(
              (item, index) => `
          <tr key="${index}" style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${index + 1}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.categoryLabel || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.productLabel || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.repairLabel || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.repairCheckLabel || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.old_manufacture_name || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.old_serial_number || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.new_manufacture_name || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.new_serial_number || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.qty || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.productPrice || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">
                ${item.serviceCharge || "N/A"}
              </td>
              <td style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;text-align: center;">
                ${
                  item.qty && item.productPrice
                    ? (item.qty * item.productPrice).toFixed(4)
                    : "N/A"
                }
              </td>
          </tr>`
            )
            .join("")
        : `<tr style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td colspan="13" style="border: 1px solid black; text-align: center;">No data available</td>
     </tr>`;

    htmlContent += `

 <!DOCTYPE html>
      <html lang="en">
    <head>
  <meta charset="utf-8">
     <title> Artificial Limbs Manufacturing Corporation of India</title>
 </head>
 <body style="margin: 10px 0; font-size: 14px;line-height: 16px;">
 <div class="page">
<div class="subpage" style="background:url(${waterMarkJob}); background-size: contain; background-position: center; background-repeat: no-repeat;">
 <table
         style="width: 1000px !important; border: 1px solid black; margin: 0px auto; font-size: 12px; font-family:calibri"
        cellpadding="0" cellspacing="0">
         <tr>
             <td>
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                         <td>
                             <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                <tr>
                                    <td><strong style="margin-left: 5px;">GSTIN:</strong> ${
                                      row?.gstNo || ""
                                    }</td>
                                    <td style="text-align: right;"><strong style="margin-right: 5px;">Original
                                            Copy</strong></td>
                                 </tr>
                             </table>
                         </td>
                     </tr>
                     <tr>
                         <td style="text-align: center;"><b>CUSTOMER INVOICE</b></td>
                     </tr>
                     <tr>
                         <td>
                              <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td width="20%"
                                                            style="border-bottom:0px solid #000; text-align:center;">
                                                            <img src=${logo}
                                                                alt="alimco"
                                                                style="width:100px;">
                                                        </td>
                                                        <td width="75%"
                                                            style="border-bottom:0px solid black; text-align:center; padding-left: 10px;">
                                                           <strong style="font-size: 22px;text-transform:uppercase">
                                                            ALIMCO
                                                            ${
                                                              row?.aasra_type ==
                                                              "AC"
                                                                ? "AUTHORISED SERVICE AND REPAIR AGENCY"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                            </strong><br>

                                                            <span style="font-size: 12px;width:200px;">${
                                                              row?.aasra_address
                                                            } </span><br>
                                                            <span style="font-size: 12px;width:200px;"><b>Phone No. </b> ${
                                                              row?.aasra_mobile ||
                                                              ""
                                                            } </span>
                                                        </td>
                                                        <td width="5%">

                                                        </td>
                                                    </tr>
                                                </table>
                         </td>
                     </tr>

                    <tr>
                         <td>
                             <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;border-Top: 1px solid black;">
                                <tr>
                                     <th
                                         style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;">
                                         Billing Address</th>
                                     <th
                                        style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%;padding-left: 5px;">
                                         </th>
                                 </tr>
                            </table>
                         </td>
                     </tr>
                     <tr>
                         <td>
                              <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                <tr>
                                    <td
                                        style="line-height: 20px;padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SL. No.
                                                :</b> ${row?.sr_no}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Name
                                                :</b> ${row?.customer_name}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Address
                                                :</b> ${row?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Aadhaar
                                                Number :</b>${
                                                  row?.aadhaar || ""
                                                }
                                        </span><br>


                                    </td>
                                    <td
                                        style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Service Order
                                                Number :</b>${
                                                  row?.ticket_id || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                                Date :</b>
                                            ${row?.createdAt || ""}</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Mobile No.
                                                :</b>${row?.mobile || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Date of Distribution :</b>${
                                                  row?.dstDate || ""
                                                }
                                        </span><br>

                                    </td>
                                </tr>
                            </table>
                         </td>
                     </tr>
                     <tr>
                         <td>
                             <table cellpadding="2" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;">
                                 <tr
                                     style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         S.NO</th>
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Category</th>
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;width: 12%">
                                         Item</th>
                                     <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;width: 15%">
                                         Description of Goods</th>
                                   <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;width: 12%">
                                        Repairing and Handling</th>
                                    <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         Old Manufacturer</th>
                                    <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         Old Part Sr.No.</th>
                                          <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         New Manufacturer</th>
                                          <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         New Part Sr.No.</th>
                                         <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         QTY</th>
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;width: 10%">
                                         Basic Price</th>
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                         Labour Charge</th>
                                     <th
                                         style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;width: 10%">
                                         Total</th>
                                 </tr>
     ${ticketDetailsRows}
                             </table>

                         </td>
                     </tr>
                      <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr style="height: 20px;">
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                     <tr>
                         <td>
                             <table cellspacing="0" cellpadding="0" style="width: 100%;">
                                 <tr>
                                     <td style="line-height: 20px; border-right: 1px solid black;padding-left: 5px; width: 50% !important;">
                                         <span></span><br>
                                         <span></span><br>
                                         <span></span><br>

                                         <span
                                             style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Total
                                                 Invoice Amount in Words:
                                                </b>
                                                 <span style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;" >${words}

                                                 </span>
                                     </td>
                                     <td style="line-height: 20px; width: 15%; text-align: end;padding-left: 5px;">
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Sub
                                             Total:</span><br>
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Repair
                                            Amount:</span><br>
                                              <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             GST Amount:</span><br>
                                             <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             Discount:</span><br>
                                                <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             Additional Discount:</span><br>
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Grand
                                             Total:</span>
                                     </td>
                                      <td
                                        style=";padding-top:10px;line-height: 20px; width: 15%; text-align: right; vertical-align: text-top; font-size: small; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;padding-right: 5px;">

                                          <span>${RUPEES_SYMBOL} ${
      row?.total.toFixed(4) || 0.0
    }</span><br>
                                        <span>${RUPEES_SYMBOL}${
      parseFloat(row?.subtotal).toFixed(4) || 0.0
    } </span><br>
     <span>${RUPEES_SYMBOL} ${row?.gstAmount.toFixed(4) || 0.0}</span><br>
     <span>${RUPEES_SYMBOL} ${row?.discount || 0.0}</span><br>

    <span>${RUPEES_SYMBOL} ${row?.additionalDiscount || 0.0}</span><br>

                                        <span>${RUPEES_SYMBOL} ${
      formattedOutput || 0.0
    }</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </div>
    </div>
     ${index < rowData.length - 1 ? '<div class="page-break"></div>' : ""}
      </body>
      </html>

        `;
  });

  // Close HTML content
  htmlContent += `
        </body>
      </html>
    `;

  // Open a new window and print the document
  const printWindow = window.open();

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    // printWindow.document.close();
    // printWindow.onload = async () => {
    //     try {
    //         // Use html2canvas to capture the content as an image
    //         const canvas = await html2canvas(printWindow.document.body, {
    //             scale: 2, // Adjust scale as needed for better resolution
    //             useCORS: true, // Ensure that cross-origin images are handled
    //         });

    //         // Get the data URL of the canvas (image)
    //         const imageData = canvas.toDataURL("image/png");

    //         // Open the image in a new tab for demonstration (optional)
    //         const newTab = window.open();
    //         newTab.document.write('<img src="' + imageData + '"/>');

    //         // Trigger the print dialog after a short delay
    //         setTimeout(() => {
    //             printWindow.print();
    //         }, 3000); // Adjust delay if necessary

    //     } catch (error) {
    //         console.error("Error capturing content with html2canvas:", error);
    //     }
    // };
    // printWindow.print();
    // Trigger the print dialog
    // printWindow.document.close(); // necessary for some browsers to finish writing before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 2000);
  } else {
    alert(
      "Failed to open print window. Please check your browser's pop-up settings."
    );
  }
};

export const handleClosedTicketPrint = (row) => {
  const fixedPrice = row?.ticketDetail[0]?.repairPrice || 0;
  //   console.log(row, fixedPrice, "ppppp");
  let calc_discount = 0;
  let discountedAmt = 0;
  let totalAmount = 0; // Initialize to calculate total cost
  let productPrices = []; // Array to store productPrice values

  // Calculate the spare amount based on qty * productPrice for all items
  const spareAmount = row?.ticketDetail.reduce((total, item) => {
    // If it's a repair, the value is 0 (100% discount)
    return (
      total +
      (item.repairCheckValue === "Repair" ? 0 : item.qty * item.productPrice)
    );
  }, 0);

  //   const totalAmount = row?.ticketDetail.reduce((total, item) => {
  //     const itemTotal = item.qty * item.serviceCharge;
  //     return total + itemTotal;
  //   }, 0);
  //   const spareAmount = row?.ticketDetail.reduce(
  //     (total, item) => total + item.qty * item.productPrice,
  //     0
  //   );

  //   console.log("print closed ticket", row);
  const ticketDetailsRows = row?.ticketDetail
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          index + 1
        }</td>


        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.categoryLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.productLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.repairLabel
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.repairCheckLabel
        }</td>
         <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
           item.old_manufacture_name || "N/A"
         }</td>
         <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
           item.old_serial_number || "N/A"
         }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.new_manufacture_name || "N/A"
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.new_serial_number || "N/A"
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.qty
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.productPrice
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.serviceCharge
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;text-align: center;">${(
          item.qty * item.productPrice
        )?.toFixed(4)}</td>
    </tr>
`
    )
    .join("");

  //   const totalAmount = row?.ticketDetail.reduce(
  //     (total, item) => total + (item.qty * item.price + item.serviceCharge),
  //     0
  //   );

  let totalLabourAmount = row?.ticketDetail.reduce((total, item) => {
    const fixedCharge = fixedPrice;
    const itemTotal = total + item.qty * item.serviceCharge;
    // console.log("5555", itemTotal, total, fixedCharge);
    // setCostDifference(itemTotal)
    return itemTotal;
  }, 0);

  //   console.log(totalLabourAmount, "ttttt");
  if (row?.warranty === true) {
    if (row?.ticketDetail.length > 0) {
      row?.ticketDetail.forEach((ticket) => {
        const productPrice = ticket.productPrice;
        const qty = ticket.qty;

        productPrices.push(productPrice); // Add product price to the array

        // Check the condition for repair value
        if (ticket.repairCheckValue === "Purchase") {
          // No discount for purchases
          calc_discount += productPrice * qty * (0 / 100); // No discount
          totalAmount += productPrice * qty; // Include the product price with the quantity
        } else {
          // Apply 100% discount for repairs
          calc_discount += productPrice * qty * (100 / 100); // 100% discount for repairs
          totalAmount += 0; // Total amount for repairs should be zero
        }
      });
    }

    // console.log("All Product Prices:", productPrices); // This will log the array with all product prices
    // console.log("Total Discount Amount", calc_discount);

    // discountedAmt = totalAmount - calc_discount; // Calculate the final amount after discount
    // discountedAmt = Math.max(0, discountedAmt);
    // console.log("Total payable Amount", discountedAmt);
  } else {
    // If out of warranty, no discount for any of them
    // console.log("No discount applied, warranty is false.");
    discountedAmt = totalAmount || 0; // No discount applied
    // console.log("Discounted Amount without discount", discountedAmt);
  }

  //   console.log("Spare Amount:", spareAmount);

  // Ensure `discountedAmt` is valid before calculating `grandTotal`
  // Ensure calc_discount has a valid value
  const validDiscount = calc_discount || 0;

  // Check if spareAmount has a valid value (greater than 0)
  let grandTotal = 0;
  if (spareAmount > 0) {
    grandTotal = spareAmount - validDiscount;
  } else {
    grandTotal = validDiscount;
  }

  // Ensure the grandTotal is not negative
  grandTotal = Math.max(0, grandTotal);

  //   console.log("Grand Total:", grandTotal);

  const total = row?.totalAmount || 0; // Default to 0 if undefined or null
  const gstAmount = row?.gstAmount || 0; // Default to 0 if undefined or null

  // Calculate the sum
  const totalWithGst = total + gstAmount;
  const grandTotalAmount = `${totalWithGst.toFixed(2)}`;
  const formattedOutput = Math.round(grandTotalAmount).toFixed(2); // This will format to 2 decimal places
  const toWords = new ToWords();
  const words = toWords.convert(formattedOutput, { currency: true });

  const printWindow = window.open();
  printWindow.document.write(
    `
      <!DOCTYPE html>
      <html lang="en">
     <head>
    <meta charset="utf-8">
    <title>CUSTOMER INVOICE- ${row?.aasraName}-${row?.aasra_type}
</title>
        <style>
         @media print {
            body {
                margin: 0;
                padding: 0;
            }

            .page {
                margin: 0;
                padding: 0;
                width: 100%;
            }

            /* A4 size for printing */
            @page {
                size: A4 landscape;
                margin: 20mm;
            }

            /* Watermark styles */
            .subpage {
                background: url(${waterMarkJob}) no-repeat center center;
                background-size: contain;
                // page-break-before: always;
                page-break-after: always;
                display: block;
                height: 100%;
            }

           
        }

    </style>
</head>
<body >
  <div class="page">
        <div class="subpage" style="background:url(${waterMarkJob});background-size: contain;
        background-position: center;background-repeat: no-repeat;">

          <table
        style="width: 1000px; border: 1px solid black; margin: 0px auto; font-size: 12px; font-family:Verdana, Geneva, Tahoma, sans-serif"
        cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                <tr>
                                    <td><strong style="margin-left: 5px;">GSTIN:</strong> ${
                                      row?.gstNo || ""
                                    }</td>
                                    <td style="text-align: right;"><strong style="margin-right: 5px;">Original
                                            Copy</strong></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;"><b>CUSTOMER INVOICE</b></td>
                    </tr>
                    <tr>
                        <td>
                           <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td width="20%"
                                                            style="border-bottom:0px solid #000; text-align:center;">
                                                            <img src=${logo}
                                                                alt="alimco"
                                                                style="width:100px;">
                                                        </td>
                                                        <td width="75%"
                                                            style="border-bottom:0px solid black; text-align:center; padding-left: 10px;">
                                                             <strong style="font-size: 22px;text-transform:uppercase">
                                                            ALIMCO
                                                            ${
                                                              row?.aasra_type ==
                                                              "AC"
                                                                ? "AUTHORISED SERVICE AND REPAIR AGENCY"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "RMC"
                                                                ? "Regional Marketing Center"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "PMDK"
                                                                ? "Pradhanmantri Divyasha Kendra"
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "HQ"
                                                                ? "Head quarters "
                                                                : ""
                                                            }
                                                            ${
                                                              row?.aasra_type ==
                                                              "AAPC"
                                                                ? "Auxiliary Production Centers"
                                                                : ""
                                                            }
                                                            </strong><br>

                                                            <span style="font-size: 12px;width:200px;">${
                                                              row?.aasra_address
                                                            } </span><br>
                                                            <span style="font-size: 12px;width:200px;"><b>Phone No. </b> ${
                                                              row?.aasra_mobile ||
                                                              ""
                                                            } </span>
                                                        </td>
                                                        <td width="5%">

                                                        </td>
                                                    </tr>
                                                </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;border-top: 1px solid black;">
                                <tr>
                                    <th
                                        style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;">
                                        Billing Address</th>
                                    <th
                                        style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%;padding-left: 5px;">
                                        </th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                <tr>
                                    <td
                                        style="line-height: 20px;padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SL. No.
                                                :</b> ${row?.sr_no}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Name
                                                :</b> ${row?.customer_name}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Customer Address
                                                :</b> ${row?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Aadhaar
                                                Number :</b>${
                                                  row?.aadhaar || ""
                                                }
                                        </span><br>


                                    </td>
                                    <td
                                        style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Service Order
                                                Number :</b>${
                                                  row?.ticket_id || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                                Date :</b>
                                            ${row?.createdAt || ""}</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Mobile No.
                                                :</b>${row?.mobile || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Date of Distribution :</b>${
                                                  row?.dstDate || ""
                                                }
                                        </span><br>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="2" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;">
                                <tr
                                    style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        S.NO</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Category</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Item</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Description of Goods</th>
                                   <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Repairing and Handling</th>
                                   <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Old Manufacturer</th>
                                   <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Old Part Sr.No.</th>
                                         <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        New Manufacturer</th>
                                         <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        New Part Sr.No.</th>
                                        <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        QTY</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Basic Price</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Labour Charge</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;">
                                        Total</th>

                                </tr>

    ${ticketDetailsRows}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr style="height: 50px;">
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                     <tr>
                         <td>
                             <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 0px solid black;">
                                 <tr>
                                     <td style="line-height: 20px;padding-top:5px; border-right: 1px solid black;padding-left: 5px; ">
                                         <span></span><br>
                                         <span></span><br>
                                         <span></span><br>

                                         <span
                                             style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Total
                                                 Invoice Amount in Words:
                                                </b>
                                                 <span style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;" >${words}</span>
                                     </td>
                                     <td style="line-height: 20px;padding-top:5px; width: 18%; text-align: end;padding-left: 5px;">
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Sub
                                             Total:</span><br>
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Repair
                                            Amount:</span><br>
                                              <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             GST Amount:</span><br>
                                             <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             Discount:</span><br>
                                              <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                             Additional Discount:</span><br>
                                         <span
                                             style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Grand
                                             Total:</span>
                                     </td>
                                      <td
                                        style="padding-top:5px;line-height: 20px; width: 15%; text-align: right; vertical-align: text-top; font-size: small; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;padding-right: 5px;">

                                          <span>${RUPEES_SYMBOL} ${
      row?.total.toFixed(4) || 0
    }</span><br>
                                        <span>${RUPEES_SYMBOL} ${
      row?.subtotal
    }</span><br>
     <span>${RUPEES_SYMBOL} ${row?.gstAmount.toFixed(4) || 0}</span><br>
     <span>${RUPEES_SYMBOL} ${row?.discount || 0}</span><br>
    <span>${RUPEES_SYMBOL} ${row?.additionalDiscount || 0}</span><br>

                                        <span>${RUPEES_SYMBOL} ${
      formattedOutput || 0
    }</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

        </div>
    </div>
      </body>
      </html>
    `
  );
  printWindow.document.close();
  // printWindow.focus();
  // printWindow.print()
  // printWindow.document.close(); // n/ecessary for some browsers to finish writing before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 2000);
};

export const printPO = (row, aarsaData, paymentData, total, gst, data) => {
  //   console.log(data, row, paymentData, aarsaData, "jjghgfhg");
  const toWords = new ToWords();
  const a = parseFloat(data?.gst_amount || 0).toFixed(4) || 0;
  const b = parseFloat(data?.total_bill || 0).toFixed(4) || 0;
  const totalGstPrice = (parseFloat(a) + parseFloat(b)).toFixed(4) || 0;

  const words = toWords.convert(Math.round(totalGstPrice || 0), {
    currency: true,
  });
  const ticketDetailsRows = row
    ?.map(
      (item, index) => `
    <tr key="${index}"  style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 30px;font-size: 13px;">
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          index + 1
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.item_name
        }</td>

        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.quantity
        }
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${RUPEES_SYMBOL}&nbsp;${
        item.price
      }</td>
                </td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;text-align: center;">${
          item.gst || 0
        }</td>
        <td  style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;text-align: center;">${RUPEES_SYMBOL}&nbsp;${parseFloat(
        item.quantity * item.price
      ).toFixed(4)}</td>
    </tr>
`
    )
    .join("");

  const totalAmount = row?.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const printWindow = window.open();
  printWindow.document.write(
    `
        <!DOCTYPE html>
      <html lang="en">
     <head>
    <meta charset="utf-8">
    <title>PO-${
      aarsaData?.name_of_org +
        "-" +
        data?.unique_code +
        "-" +
        paymentData?.invoice_number || ""
    }z</title>
    <style>
        @media print {
            button {
                display: none;
            }

            @page {
                size: A4 portrait;
                margin: default ;
            }
        }
        .page {
            width: 19.4cm;
            min-height: auto;
            margin: 1cm auto;
            border: 1px #D3D3D3 solid;
            border-radius: 0px;
            background: white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
        }

         .subpage {
            width: 19.4cm;
            /* border: 5px solid #2f5e79; */
            height: 275mm;
            box-sizing: border-box;
        }


        @page {
            size: A4;
        }

        @media print {
            .page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="subpage" style="background:url(${waterMarkJob});background-size: cover;
        background-position: center;">
            <div style="padding: 2px; height: -webkit-fill-available;">
          <table
        style="border:  solid 1px #000; margin: 0px auto; font-size: 12px; font-family:Verdana, Geneva, Tahoma, sans-serif"
        cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                <tr>
                                    <td><strong style="margin-left: 5px;">GSTIN:</strong> 09AABCA8899F1Z6</td>
                                    <td style="text-align: right;"><strong style="margin-right: 5px;">Original
                                            Copy</strong></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr>
                                    <td style="width: 20%; text-align: center;">
                                        <img src=${logo} alt="alimco-logo"
                                            width="110px">
                                    </td>
                                    <td style="text-align: center;">
                                        <span
                                            style="text-transform:uppercase;font-size: 18px; font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; ">
                                            Artificial Limbs Manufacturing Corporation of India</span><br>
                                        <span
                                                style="font-size:14px;text-decoration :underline ;font-family: 'Franklin Gothic', 'Arial Narrow', Arial, sans-serif;">
                                                A GOVERNMENT OF INDIA UNDERTAKING</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                        Naramau, G.T.Road
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                        Kanpur 209217</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                      U85110UP1972NPL003646
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                       09AABCA8899F1Z6
                                       </span><br>
 <span style="text-align: center;font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;"><b>PROFORMA INVOICE : ${
   data?.invoice_no || ""
 }</b></span><br>
                                    </td>

                                    <td style="width: 10%; text-align: center;"></td>
                                </tr>
                                <tr>
                                <td style="padding:5px;">
                                 <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                      Type: Spare part sale
                                       </span><br>
                                </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                <tr>
                                    <th
                                        style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;border-right: 1px solid black;">
                                        Shipping / Export Details (Consignee Address)</th>
                                    <th
                                        style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%;padding-left: 5px;">
                                         Billing Details(Indenter Code & Name)</th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                <tr>
                                    <td
                                        style="line-height: 20px; border-right: 1px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                :</b> ${aarsaData?.name_of_org}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Party Code
                                                :</b> ${data?.unique_code || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                :</b> ${aarsaData?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pin Code
                                                :</b> ${aarsaData?.pin}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">GST
                                                Number :</b>${data?.gstNo || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Mobile
                                                Number :</b>${
                                                  aarsaData?.mobile_no || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Serial Number# :</b>${
                                                  paymentData?.invoice_number
                                                }</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Date :</b>
                                           ${paymentData?.createdAt}</span><br>

                                    </td>
                                    <td
                                        style="line-height: 20px; border-right: 0px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                :</b> ${aarsaData?.name_of_org}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Party Code
                                                :</b> ${data?.unique_code || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                :</b> ${aarsaData?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pin Code
                                                :</b> ${aarsaData?.pin}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">GST
                                                Number :</b>${data?.gstNo || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Mobile
                                                Number :</b>${
                                                  aarsaData?.mobile_no || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Serial Number# :</b>${
                                                  paymentData?.invoice_number
                                                }</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Date :</b>
                                           ${paymentData?.createdAt}</span><br>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="2" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;">
                                <tr
                                    style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        S.NO</th>

                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Item</th>

                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        QTY</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        Basic Price</th>
                                     <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                        GST</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;">
                                        Total</th>

                                </tr>

    ${ticketDetailsRows}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr style="height: 200px;">
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr>
                                    <td style="line-height: 20px; border-right: 1px solid black;padding-left: 5px;vertical-align: top;padding-top: 5px;">

                                       <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                              Payment Mode:</b>
                                   <span style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;text-transform:uppercase;" >${
                                     data?.payment_method || ""
                                   }</span>
</br>

                                       <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                               Transaction Id:</b>
                                   <span style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;" >${
                                     data?.transaction_id || ""
                                   }</span>
</br>
                                        <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Total
                                                Invoice Amount in Words:</b>
                                                <span style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;" >${words}</span>
                                    </td>
                                    <td style="line-height: 20px; width: 15%; text-align: end;padding-left: 5px;">
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Sub
                                            Total:</span><br>
                                       ${
                                         data?.sgst || data?.cgst
                                           ? `
                                         <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SGST:
                                            </span>
                                            <br/>
                                         <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">CGST:
                                            </span>
                                            <br/>
                                       `
                                           : `
                                             <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">GST:
                                            </span>
                                            <br/>
                                           `
                                       }

                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Shipping Charges:</span>  <br>
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Discount:</span>  <br>
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Grand
                                            Total:</span>
                                    </td>
                                    <td style="line-height: 20px; width: 15%; text-align: end;padding-left: 5px;padding-right:5px;">
                                        <span
                                            style="font-size: small;"> <span>${RUPEES_SYMBOL}&nbsp;${parseFloat(
      data?.total_bill || 0
    ).toFixed(4)} </span><br>


                                        ${
                                          data?.sgst || data?.cgst
                                            ? `
                                         <span
                                            style="font-size: small;">${
                                              data?.sgst || 0.0
                                            }%
                                            </span>
                                            <br/>
                                         <span
                                            style="font-size: small;">${
                                              data?.cgst || 0.0
                                            }%
                                            </span>
                                            <br/>
                                      `
                                            : `
                                              <span
                                            style="font-size: small;">${parseFloat(
                                              data?.gst_amount || 0
                                            ).toFixed(4)}
                                            </span>
                                            <br/>
                                            `
                                        }

                                        <span
                                            style="font-size: small;"><span>${RUPEES_SYMBOL}&nbsp;${parseFloat(
      data?.shipping_charges || 0.0
    ).toFixed(4)} </span>  <br>
                                        <span
                                            style="font-size: small;"><span>${RUPEES_SYMBOL}&nbsp;${parseFloat(
      data?.discount || 0.0
    ).toFixed(4)} </span>  <br>
                                        <span
                                            style="font-size: small;"><span>${RUPEES_SYMBOL}&nbsp;${parseFloat(
      Math.round(totalGstPrice || 0)
    ).toFixed(2)} </span>
                                    </td>

                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black;">
                                <td style="border-right: 1px solid black;padding-left: 5px;">
                                    <h3
                                        style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-weight: bolder; margin: 0; padding: 0;">
                                        TERMS & CONDITIONS</h3>
                                    <ol
                                        style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: small;">
                                        <li>Goods Once dispatch will not be taken Back.</li>
                                        <li>Subject to Lucknow Jurisdiction only.</li>
                                    </ol>
                                    </span>
                                </td>
                                <td style="padding: 5px;">

                                    <div style="display: flex; justify-content:space-between; font-size: small;">
                                        <p
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; padding: 0; margin: 40px 0px 0px 0px;">
                                            <b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Party
                                                Code: </b>${
                                                  data?.unique_code || ""
                                                }
                                        </p>
                                        <p
                                            style="padding: 0; margin: 40px 0px 0px 0px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                                            Authorised Signatory</p>
                                    </div>
                                </td>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                <p style="font-size: small; font-weight:bold; padding: 0; margin: 10px 0px 30px 10px;">
                                    Declaration : <br>
                                    We Declare that this Invoice shows the actual price of the Goods described and that
                                    all
                                    particulars are true and correct. <br>
                                    Registered Office- ALIMCO, G. T. Road, Kanpur, Uttar Pradesh - 209217 <br>
                                    CIN -U85110UP1972NPL003646 Website- www. Artificial Limbs
                                    Manufacturing Corporation of India.com Contact No
                                    -1800-180-5129 <br> Email- alimco@alimco.in | Artificial Limbs Manufacturing
                                    Corporation of India.co</p>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
       </div>
      </div>
    </div>
      </body>
      </html>
    `
  );
  // printWindow.print();
  // printWindow.close();
  printWindow.document.close(); // necessary for some browsers to finish writing before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 100);
};

export const downloaadPdf = async (
  row,
  orderData,
  aarsaData,
  paymentData,
  total,
  sgst,
  cgst,
  gst,
  total_bill,
  total_tax,
  shipping_charges,
  discount
) => {
  const totalGstPricePartial = parseFloat(row?.grand_total_gst_partial).toFixed(
    2
  );
  const creditNoteTotal = parseFloat(row?.creditnotetotal || 0).toFixed(2);
  const totalPartial = (
    parseFloat(totalGstPricePartial) + parseFloat(creditNoteTotal)
  ).toFixed(2);

  const totalGstPrice = parseFloat(row?.grand_total_gst).toFixed(2);

  //   console.log(totalGstPricePartial);
  //   console.log(creditNoteTotal);
  //   console.log(totalGstPrice);
  //   console.log(totalPartial);
  const toWords = new ToWords();
  const words = toWords.convert(totalGstPrice || 0.0, { currency: true });
  const ticketDetailsRows = orderData
    ?.map(
      (item, index) => `
    <tr key="${index}" style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 1px solid black; text-align: center;">${
          index + 1
        }</td>
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 1px solid black; text-align: center;">${
          item.item_name
        }</td>
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 1px solid black; text-align: center;">${
          item.quantity
        }</td>
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 1px solid black; text-align: center;">Rs.${" "}${
        item.price
      }</td>
            </td>
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 1px solid black; text-align: center;">${
          item.gstpercent.gst || 0
        }</td>
        <td style="border-top: 0px solid black; border-bottom: 1px solid black; border-left: 0px solid black; border-right: 0px solid black; text-align: center;">
        Rs.${" "}${parseFloat(item.quantity * item.itemUnitPrice).toFixed(
        4
      )}</td>


    </tr>
`
    )
    .join("");

  const totalAmount = orderData?.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const doc = new jsPDF({
    format: "a4",
    unit: "px",
  });

  // Use html2canvas to capture the HTML content
  const htmlContent = `
    <!DOCTYPE html>
  <html lang="en">
 <head>
<meta charset="utf-8">
<title> Artificial Limbs Manufacturing Corporation of India</title>
</head>
<body style="margin: 10px 0; font-size: 14px;line-height: 14px;white-space: normal;">
          <div class="subpage" style="background:url(${waterMarkJob});
     background-size: contain;
    background-position: center;
    background-repeat: no-repeat;">
      <table
    style="width: 800px; border: 0.8px solid black; margin: 0px auto; font-size: 12px; white-space: normal; font-family:Verdana, Geneva, Tahoma, sans-serif"
    cellpadding="0" cellspacing="0">
    <tr>
        <td>
            <table cellpadding="0" cellspacing="0" style="width: 100%; border: 0px solid black;">
                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                            <tr>
                                <td><strong style="margin-left: 5px;">GSTIN:</strong>09AABCA8899F1Z6</td>
                                <td style="text-align: right;"><strong style="margin-right: 5px;">Original
                                        Copy</strong></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                 <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr>
                                    <td style="width: 20%; text-align: center;">
                                        <img src=${logo} alt="alimco-logo"
                                            width="110px">
                                    </td>
                                    <td style="text-align: center;">
                                        <span
                                            style="text-transform:uppercase;font-size: 18px; font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;letter-spacing: 0.9px ">
                                            Artificial Limbs Manufacturing Corporation of India</span><br>
                                        <span
                                                style="font-size:14px;text-decoration :underline ;font-family: 'Franklin Gothic', 'Arial Narrow', Arial, sans-serif;letter-spacing: 0.9px">
                                                A GOVERNMENT OF INDIA UNDERTAKING</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                        Naramau, G.T.Road
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                        Kanpur 209217</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                      U85110UP1972NPL003646
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                       09AABCA8899F1Z6
                                       </span><br>
 <span style="text-align: center;font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;letter-spacing: 0.95px;"><b>PROFORMA INVOICE : ${
   row?.invoice_no || ""
 }</b></span><br>
                                    </td>

                                    <td style="width: 10%; text-align: center;"></td>
                                </tr>
                                <tr>
                                <td style="padding:5px;">
                                 <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                      Type: Spare part sale
                                       </span><br>
                                </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                <tr>
                    <td>
                        <table cellspacing="0" cellpadding="0"
                            style="width: 100%; text-align: left; border-bottom: 1px solid black;letter-spacing: 0.5px">
                            <tr>
                                <th
                                    style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;border-right: 1px solid black;">
                                    Shipping / Export Details (Consignee Address)</th>
                                <th
                                    style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%;padding-left: 5px;">
                                     Billing Details(Indenter Code & Name)</th>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" style="width: 100%;letter-spacing: 0.5px">
                            <tr>

                                    <td
                                        style="line-height: 20px; border-right: 1px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                :</b> ${aarsaData?.name_of_org}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Party Code
                                                :</b> ${
                                                  row?.aasraUser?.unique_code ||
                                                  ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                :</b> ${aarsaData?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pin Code
                                                :</b> ${aarsaData?.pin}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">GST
                                                Number :</b>${row?.gstNo || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Mobile
                                                Number :</b>${
                                                  aarsaData?.mobile_no || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Serial Number# :</b>${
                                                  paymentData?.invoice_number
                                                }</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Date :</b>
                                           ${paymentData?.createdAt}</span><br>

                                </td>
                                <td
                                        style="line-height: 20px; border-right: 0px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid black;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                :</b> ${aarsaData?.name_of_org}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Party Code
                                                :</b> ${
                                                  row?.aasraUser?.unique_code ||
                                                  ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                :</b> ${aarsaData?.address}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pin Code
                                                :</b> ${aarsaData?.pin}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">GST
                                                Number :</b>${row?.gstNo || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Mobile
                                                Number :</b>${
                                                  aarsaData?.mobile_no || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Serial Number# :</b>${
                                                  paymentData?.invoice_number
                                                }</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Invoice
                                                Date :</b>
                                           ${paymentData?.createdAt}</span><br>

                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellpadding="2" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;letter-spacing: 0.5px">
                            <tr
                                style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                    S.NO</th>

                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                    Item</th>

                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                    QTY</th>
                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                    Basic Price</th>
                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 1px solid black;">
                                   GST %</th>

                                <th
                                    style="border-top: 0px solid black;border-bottom: 1px solid black;border-left: 0px solid black;border-right: 0px solid black;">
                                    Total</th>

                            </tr>

${ticketDetailsRows}
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black; white-space: normal;">
                            <tr style="height: 200px;">
                                <td></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black; white-space: normal;letter-spacing: 0.5px">
                            <tr>
                                <td style="line-height: 20px; border-right: 1px solid black;padding-left: 5px;vertical-align: top;padding-top: 5px;">
                                        <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                               Payment Mode:</b>
                                   <span style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;text-transform:uppercase;">${
                                     row?.payment_method || ""
                                   }</span>
</br>
                                        <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                               Transaction Id:</b>
                                   <span style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">${
                                     row?.transaction_id || ""
                                   }</span>
</br>
                                        <span
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: small;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Total
                                                Invoice Amount in Words:</b>
                                                <span style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">${words}</span>

                                        <br>
                                    </td>
                                <td style="line-height: 20px; width: 15%; text-align: end;padding-left: 5px; white-space: normal;">
                                    ${
                                      sgst > 0 || cgst > 0
                                        ? `
                                         <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">SGST:
                                            </span>
                                            <br/>
                                         <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">CGST:
                                            </span>
                                      `
                                        : `
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">GST Amount:
                                            </span>
                                            <br>
                                        `
                                    }
                                    <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Shipping Charges:</span>  <br>
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Discount:</span>  <br>
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Grand
                                            Total:</span>
                                </td>
                                <td
                                   style="line-height: 20px; width: 15%; text-align: end;padding-left: 5px;padding-right:5px;">
                                     ${
                                       sgst > 0 || cgst > 0
                                         ? `
                                         <span
                                            style="font-size: small; ">${
                                              sgst || 0
                                            }%
                                            </span>
                                            <br/>
                                         <span
                                            style="font-size: small;">${
                                              cgst || 0
                                            }%
                                            </span>
                                      `
                                         : `<span
                                            style="font-size: small;">Rs.${" "}${parseFloat(
                                             row?.gst_price || 0.0
                                           ).toFixed(4)}

                                            </span> <br>`
                                     }
                                   <span>Rs. ${parseFloat(
                                     shipping_charges || 0.0
                                   ).toFixed(4)}</span><br>
                                    <span>Rs.${" "}${parseFloat(
    discount || 0.0
  ).toFixed(4)}</span><br>

                                    <span>Rs.${" "}${parseFloat(
    totalGstPrice || 0.0
  ).toFixed(2)}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 1px solid black; white-space: normal;">
                            <td style="border-right: 1px solid black;padding-left: 5px;">
                                <h3
                                    style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-weight: bolder; margin: 0; padding: 0;letter-spacing: 1px">
                                    TERMS & CONDITIONS</h3>
                                <span
                                    style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;letter-spacing: 1px">
                                    <span>1.Goods Once dispatch will not be taken Back.</span></br>
                                    <span>2.Subject to Lucknow Jurisdiction only.</span>

                                </span>
                            </td>
                            <td style="padding: 5px;">

                                <div style="display: flex; justify-content:space-between; font-size: small;">
                                    <p
                                        style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; padding: 0; margin: 40px 0px 0px 0px;">
                                        <b
                                            style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Party
                                            Code: </b>${
                                              row?.aasraUser?.unique_code || ""
                                            }
                                    </p>
                                    <p
                                        style="padding: 0;margin: 40px 0px 0px 0px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small; letter-spacing: 1px">
                                        Authorised Signature</p>
                                </div>
                            </td>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="margin:0px 50px 0px 5px">
                        <table cellpadding="0" cellspacing="0" style="width: 100%;border:0px ">
                        <tr >
                        <td >
                          <span style="font-size: small;font-weight:450; padding:5px;">
                                Declaration : <br></span>
                         <span style="font-size: small; padding:5px; ">
                                We Declare that this Invoice shows the actual price of the Goods described and that all particulars are true and correct.</span><br>
                                  <span style="font-size: small; padding:5px;">
                                Registered Office- ALIMCO, G.T. Road,Kanpur,Uttar Pradesh - 209217 </span><br>
                                  <span style="font-size: small; padding:5px;">
                         CIN -U85110UP1972NPL003646 </span><br>
                                  <span style="font-size: small; padding:5px;">
                               Website- www.alimco.in Artificial Limbs Manufacturing Corporation of India.com Contact No- 1800-180-5129 </span> <br>
                                  <span style="font-size: small; padding:5px;">
                                 Email- alimco@alimco.in | Artificial Limbs Manufacturing Corporation of India.co
                                </span>

                        </td>
                        </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</div>
  </body>
  </html>
`;

  // Open a new window to render the content
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = async () => {
    const doc = new jsPDF("p", "pt", "a4");

    const invoiceNumber =
      aarsaData?.name_of_org +
        "-" +
        row?.aasraUser?.unique_code +
        "/" +
        paymentData?.invoice_number || "";
    const orderDate = row?.order_date || "";
    const underWarranty = row?.underWarranty || "";
    const fileName =
      invoiceNumber.length > 1
        ? invoiceNumber
        : `${orderDate}_${underWarranty}`.replace(/[\/?*<>|":]/g, "_"); // Sanitize file name

    // Replace HTML entity with the Rupee symbol
    document.querySelectorAll("span").forEach((span) => {
      if (span.innerHTML.includes("&#8377;")) {
        span.innerHTML = span.innerHTML.replace(/&#8377;/g, "₹");
      }
    });
    // Get the updated HTML content from the print window
    const htmlContent = printWindow.document.body.innerHTML;

    // Generate the PDF
    await doc.html(htmlContent, {
      callback: (pdf) => {
        pdf.save(`${fileName}.pdf`);
        printWindow.close();
      },
      margin: [10, 10, 10, 10], // top, left, bottom, right
      html2canvas: {
        scale: 0.7, // Adjust to fit content within page
        letterRendering: true,
        useCORS: true, // If your HTML content has images from other domains
      },
      x: 10,
      y: 10,
    });
  };
};

export const printForm = (rowData) => {
  //   console.log("rowData:", rowData);

  // Ensure rowData is an array and has at least one item
  if (!Array.isArray(rowData) || rowData.length === 0) {
    alert("No data available to print.");
    return;
  }

  // Start HTML content with the header and styles
  let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="description" content="">
          <meta name="author" content="">
          <title>ALIMCO</title>
          <style>
            @media print {
              @page {
                size: A4 portrait;
                margin: 50px;
              }
              .page-break {
                page-break-before: always;
              }
              .no-page-break {
                page-break-inside: avoid;
              }
            }
            body {
              font-family: Calibri, sans-serif;
              font-size: 14px;
              margin: 0;
              padding: 0;
            }
            .section {
              margin-bottom: 20px; /* Adjust if needed */
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 8px;
            }
          </style>
        </head>
        <body>
    `;

  // Loop through rowData to generate content for each row
  rowData.forEach((data, index) => {
    htmlContent += `
          <table
            cellpadding="0"
            cellspacing="0"
            id="body_TblHeader"
            style="
        border: solid 0px #000;
        font-family: Calibri;
        font-size: 14px;
        margin: auto;
        width: 800px;
      "
        >
            <tr>
                <td>
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                            <tr>
                                <td colspan="3" style="text-align: center; padding-left: 10px">
                                    <!-- <strong style="font-size: 20px;"> -->
                                    <!-- भारतीय कृत्रिम अंग निर्माण कंपनी -->
                                    <!-- </strong> -->
                                    <br>
                                    <strong style="font-size: 20px;">
                                        ARTIFICIAL LIMBS MANUFACTURING CORPORATION OF INDIA
                                    </strong>
                                    <br>
                                    <!-- <strong style="font-size: 14px;"> -->
                                    <!-- (भारत सरकार का उपक्रम) -->
                                    <!-- </strong> -->
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        style="border-bottom: 2px solid #333;padding-bottom: 5px;"
                                    >
                                        <tbody>
                                            <tr>
                                                <td style="text-align: left;">
                                                    <img src=${electricLogo} alt="Image" style="max-width: 100px; height: auto; display: block; margin-bottom: 5px;">
                                                    <br>
                                                    <strong style="font-size: 12px">
                                                        <!-- वेबसाइट/ Website: www.alimco.in -->
                                                        Website: www.alimco.in
                                                    </strong>
                                                    <br>
                                                    <strong style="font-size: 12px">
                                                        <!-- ईमेल / Email: -->
                                                        Email:
                                                    </strong>
                                                </td>
                                                <td style="text-align: center;">
                                                    <strong>(A GOVERNMENT OF INDIA UNDERTAKING)</strong>
                                                    <br>
                                                    <!-- <b> सामाजिक न्याय एवं अधिकारिता मंत्रालय के अधीन</b><br> -->
                                                    <strong>
                                                        UNDER MINISTRY OF SOCIAL, JUSTISE AND
                              EMPOWERMENT
                                                    </strong>
                                                    <br>
                                                    <!-- <b>आइ एस ओ 9001:2008 प्रतिष्ठान</b><br> -->
                                                    <strong>AN SO 9001:2008 COMPANY</strong>
                                                    <br>
                                                    <!-- जीO टीO रोड, कानपुर-209217 -->
                                                    <strong>G. T. ROAD, KANPUR-209217</strong>
                                                    <br>
                                                    <!-- टोल फ्री नंO/ -->
                                                    <strong>Toll Free No. 1800-180-5129</strong>
                                                </td>
                                                <td style="text-align: right;font-size: 12px;">
                                                    <img src=${watermark} alt="Image" style="align-content: right; max-width: 100px; height: auto; display: block; padding-left: 106px;">
                                                    <br>
                                                    <!-- <strong>फैक्स / FAX :0512-2770088</strong> -->
                                                    <strong> FAX :0512-2770088</strong>
                                                    <br>
                                                    <!-- <strong>दूरभाषा / Phone :0512-2770088</strong> -->
                                                    <strong> Phone :0512-2770088</strong>
                                                    <br>
                                                    <!-- <b>टिन नंO TIN No.-09645600010</b> -->
                                                    <b> TIN No.-09645600010</b>
                                                    <br>
                                                    <strong> CIN No. :U85110UP0972GOI003646</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: center; padding-left: 10px;padding-top: 8px;">
                                    <strong style="font-size: 20px">
                                        <!-- सर्विस रिपोर्ट -->
                                        SERVICE REPORT
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right; padding-left: 10px">
                                    <strong style="font-size: 16px">
                                        <!-- दिनांक : 25/52/2024 -->
                                        Date :
                                    </strong><span>${
                                      data?.complaint_Date || ""
                                    }</span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3" style="width: 100%; padding: 0px 0px">
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                            <!-- 1 -->
                                            <tr>
                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                    <!-- <b style="margin-right: 20px;">1.</b><strong style="margin-right: 20px;">लाभार्थी का नाम:</strong> <strong>___________________________________________________________________________________________</strong> -->
                                                    <b style="margin-right: 20px;">1.</b>
                                                    <strong style="margin-right: 0px;">Beneficiary Name:</strong>
                                                    <span>${
                                                      data?.user?.name
                                                    }</span>
                                                </td>
                                            </tr>
                                            <!-- 2 -->
                                            <tr>
                                                <td colspan="3" style="padding-bottom: 5px;padding-top: 6px;">
                                                    <!-- <b style="margin-right: 20px;">2.</b><strong style="margin-right: 20px;">स्थाई पता :</strong> <strong>________________________________________________________________________________________________</strong> -->
                                                    <b style="margin-right: 20px;">2.</b>
                                                    <strong style="margin-right: 0px;">Permanent Address:</strong>
                                                    <span>${
                                                      data?.address || ""
                                                    }</span>
                                                </td>
                                            </tr>
                                            <!-- 2 -->
                                            <tr>
                                                <td colspan="3" style="padding-bottom: 5px;padding-top: 6px;">
                                                    <!-- <b style="margin-right: 20px;">&nbsp;</b><strong style="margin-right: 20px;"></strong>

                                                    <strong style="margin-right: 0px;"></strong>
                                                    <strong></strong>
                                                </td>
                                            </tr>
                                            <!-- 2-->
                                            <tr>
                                                <td style="padding-top: 10px;padding-bottom: 10px;width: 40%;">
                                                    <!-- <b style="margin-right: 20px;">&nbsp;&nbsp;</b><strong style="margin-right: 20px;"> जिला  :</strong> <strong>__________________</strong> -->
                                                    <b style="margin-right: 20px;">&nbsp;&nbsp;</b>
                                                    <strong style="margin-right: 0px;"> District  :</strong>
                                                    <span>${
                                                      data?.customer?.district
                                                    }</span>
                                                </td>
                                                <td style="padding-top: 10px;padding-bottom: 10px;width: 30%;">
                                                    <!-- <b style="margin-right: 20px;"></b><strong style="margin-right: 20px;"> राज्य :</strong> <strong>__________________</strong> -->
                                                    <b style="margin-right: 5px;"></b>
                                                    <strong style="margin-right: 0px;"> State :</strong>
                                                    <span>${
                                                      data?.customer?.state
                                                    }</span>
                                                </td>
                                                <td style="padding-top: 10px;padding-bottom: 10px;text-align: right;">
                                                    <!-- <b style="margin-right: 20px;"></b><strong style="margin-right: 20px;">पिन  :</strong> <strong>__________________</strong> -->
                                                    <b style="margin-right: 5px;"></b>
                                                    <strong style="margin-right: 0px;">Pin Code :</strong>
                                                    <span>

                                                    ${data?.customer?.pin || ""}

                                                    </span>
                                                </td>
                                            </tr>
                                            <!-- 3 -->
                                            <tr>
                                                <td style="padding-top: 10px;padding-bottom: 10px;">
                                                    <!-- <b style="margin-right: 20px;">3.</b><strong style="margin-right: 20px;">मोबाइल नंबर :</strong> <strong>__________________</strong> -->
                                                    <b style="margin-right: 20px;">3.</b>
                                                    <strong style="margin-right: 0px;">Mobile No. :</strong>
                                                    <span>${
                                                      data?.user?.mobile || ""
                                                    }</span>
                                                </td>
                                                <td style="padding-top: 10px;padding-bottom: 10px;">
                                                    <!-- <b style="margin-right: 20px;"></b><strong style="margin-right: 20px;">आधार कार्ड नंबर :</strong> <strong>__________________</strong> -->
                                                    <b style="margin-right: 6px;"></b>
                                                    <strong style="margin-right: 0px;">Aadhaar Card No. :</strong>
                                                    <span>${
                                                      data?.customer?.aadhaar ||
                                                      ""
                                                    }</span>
                                                </td>
                                            </tr>
                                            <!-- 4 -->
                                            <tr>
                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                    <!-- <b style="margin-right: 20px;">4.</b><strong style="margin-right: 20px;">कैम्प का विवरण: :</strong>&nbsp;&nbsp;&nbsp;&nbsp; <strong style="margin-left: 15px;">एडिप<input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;<strong style="margin-left: 15px;">एडिप<input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;<strong style="margin-left: 15px;">एडिप<input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;<strong style="margin-left: 15px;">एडिप<input type="checkbox">&nbsp;&nbsp;<strong style="margin-left: 15px;">एडिप<input type="checkbox">&nbsp;&nbsp;</strong> -->
                                                    <b style="margin-right: 20px;">4.</b>
                                                    <strong style="margin-right: 0px;"> Camp Details:</strong>&nbsp;&nbsp;&nbsp;&nbsp;


                                                                    <span>${
                                                                      data?.campName ||
                                                                      ""
                                                                    }</span>

                                                                </td>
                                                            </tr>
                                                            <!-- 5-->
                                                            <tr>
                                                                <td colspan="3" style="padding-bottom: 5px;padding-top: 5px;">
                                                                    <!-- <b style="margin-right: 20px;">5.</b><strong style="margin-right: 20px;">उत्पाद/प्रोडक्ट का कोड व नाम:</strong> <strong>______________________________________________________________________________</strong> -->
                                                                    <b style="margin-right: 20px;">5.</b>
                                                                    <strong style="margin-right: 0px;">Product code and name:</strong>

                                                                 ${
                                                                   data?.item_id ||
                                                                   ""
                                                                 }-${
      data?.item_name
    }

                                                                </td>
                                                            </tr>
                                                            <!-- 6 -->
                                                            <tr>
                                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 20px;">6.</b><strong style="margin-right: 20px;">कैम्प का नाम एवं विवरण  :</strong><strong>__________________</strong> -->
                                                                    <b style="margin-right: 20px;">6.</b>
                                                                    <strong style="margin-right: 0px;">Camp Name and Details:</strong>

                                                                    <span>${
                                                                      data?.campName ||
                                                                      ""
                                                                    }</span>

                                                                </td>

                                                            </tr>
<tr>
 <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 20px;"></b><strong style="margin-right: 20px;">वितरण तिथि व स्थान :</strong> <strong>__________________</strong> -->
                                                                    <b style="margin-right: 34px;"></b>
                                                                    <strong style="margin-right: 0px;"> Distribution Date and Place:</strong>
                                                                    <span>${
                                                                      data?.distribution_date ||
                                                                      ""
                                                                    } - ${
      data?.distribution_place || ""
    }</span>
                                                                </td>
</tr>


                                                            <!-- 7 -->
                                                            <tr>
                                                                <td style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 20px;">7.</b><strong style="margin-right: 20px;">  शिकायत की प्रवृति :</strong> <strong>__________________</strong> -->
                                                                    <b style="margin-right: 20px;">7.</b>
                                                                    <strong style="margin-right: 0px;"> Nature of Complaint:</strong>

                                                                    <span>${
                                                                      data?.problem ||
                                                                      ""
                                                                    }</span>

                                                                </td>
                                                                <td style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 20px;"></b><strong style="margin-right: 20px;">वारंटी के तहत :</strong> <strong>__________________</strong> -->
                                                                    <b style="margin-right: 6px;"></b>
                                                                    <strong style="margin-right: 0px;">Under Warranty : </strong>
                                                                    <span>${
                                                                      data?.warranty ==
                                                                      "1"
                                                                        ? "Yes"
                                                                        : "No"
                                                                    }</span>
                                                                </td>
                                                            </tr>
                                                            <!-- 8 -->
                                                            <tr>
                                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <b style="margin-right: 20px;">8.</b>
                                                                    <strong style="margin-right: 0px;">Repair details of components:</strong>

                                                                    <span>${
                                                                      data
                                                                        ?.ticketData
                                                                        ?.productLabel ||
                                                                      ""
                                                                    }</span>

                                                                    <!-- <b style="margin-right: 20px;">8.</b><strong style="margin-right: 20px;"> अवयवों की मरम्मत का विवरण::</strong> <strong>____________________________________________________________________________</strong> -->
                                                                </td>
                                                            </tr>
                                                            <!-- 9 -->
                                                            <tr>
                                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 20px;">9.</b><strong style="margin-right: 20px;"> शिकायत सहायक/अटेन्डेन्टः </strong> <strong>______________________________________________________________________________</strong> -->
                                                                    <b style="margin-right: 20px;">9.</b>
                                                                    <strong style="margin-right: 0px;">  Complaint Assistant/Attendant:</strong>

                                                                    <span>${
                                                                      data?.attendant_name ||
                                                                      ""
                                                                    }</span>

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                    <!-- <b style="margin-right: 30px;"></b><strong style="margin-right: 20px;">शिकायत का समाधान :</strong> <strong>____________________________________________________________________________________</strong> -->
                                                                    <b style="margin-right: 34px;"></b>
                                                                    <strong style="margin-right: 0px;">Complaint resolution:</strong>
                                                                    <span></span>
                                                                </td>
                                                            </tr>

                                                                    <td colspan="3" style="padding-top: 10px;padding-bottom: 10px;">
                                                                      <strong style="margin-left: 0px;">Date: </strong>
                                                                            <span>${
                                                                              data?.ticket_close_date ||
                                                                              ""
                                                                            }</span></td></tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <table cellpadding="2" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="text-align: left;height: 200px;vertical-align: bottom;">
                                                            <strong style="font-size: 12px">
                                                                <!-- (लाभार्थी का हस्ताक्षर) -->
                                                                (Signature of the beneficiary)
                                                            </strong>
                                                            <br>
                                                            <br>
                                                            <strong style="font-size: 12px">
                                                                <!-- स्थान :______________________ -->
                                                                Place :______________________
                                                            </strong>
                                                        </td>
                                                        <td style="text-align: center;height: 200px;vertical-align: bottom;">
                                                            <strong style="font-size: 12px">
                                                                <!-- विपणन अधिकारी के हस्ताक्षर  -->
                                                                Signature of Marketing Officer
                                                            </strong>
                                                            <br>
                                                            <br>
                                                            <strong style="font-size: 12px">
                                                                <!-- पद :______________________ -->
                                                                Designation :______________________
                                                            </strong>
                                                        </td>
                                                        <td style="text-align: right;height: 200px;vertical-align: bottom;">
                                                            <strong style="font-size: 12px;margin-right: 40px;">
                                                                <!-- (तकनीशियन के हस्ताक्षर)<br> -->
                                                                (Signature of Technician)
                                                            </strong>
                                                            <br>
                                                            <strong style="font-size: 12px">
                                                                <!-- मोबाइल नं.: :______________________ -->
                                                                Mobile No.:______________________
                                                            </strong>
                                                            <br>
                                                            <br>
                                                            <strong style="font-size: 12px;margin-right: 90px;">
                                                                <!-- कृते एलिम्को, कानपुर -->

                                                               ${
                                                                 data?.campVenue ||
                                                                 ""
                                                               }

                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

          ${index < rowData.length - 1 ? '<div class="page-break"></div>' : ""}
        `;
  });

  // Close HTML content
  htmlContent += `
        </body>
      </html>
    `;

  // Open a new window and print the document
  const printWindow = window.open("", "", "width=800,height=600");

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = async () => {
      try {
        // Use html2canvas to capture the content as an image
        const canvas = await html2canvas(printWindow.document.body, {
          scale: 2, // Adjust scale as needed for better resolution
          useCORS: true, // Ensure that cross-origin images are handled
        });

        // Get the data URL of the canvas (image)
        const imageData = canvas.toDataURL("image/png");

        // Open the image in a new tab for demonstration (optional)
        const newTab = window.open();
        newTab.document.write('<img src="' + imageData + '"/>');

        // Trigger the print dialog after a short delay
        setTimeout(() => {
          printWindow.print();
        }, 500); // Adjust delay if necessary
      } catch (error) {
        // console.error("Error capturing content with html2canvas:", error);
      }
    };

    // Trigger the print dialog
    printWindow.print();
  } else {
    alert(
      "Failed to open print window. Please check your browser's pop-up settings."
    );
  }
};

export const printGatePass = (
  row,
  aarsaData,
  paymentData,
  total,
  gst,
  data
) => {
  //   console.log(data, row, paymentData, aarsaData, "jjghgfhg");
  const toWords = new ToWords();
  const words = toWords.convert(data?.grand_total || 0.0, { currency: true });
  const ticketDetailsRows = row
    ?.map(
      (item, index) => `
      <tr key="${index}">
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                               ${index + 1}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                               ${item?.part_number}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                ${item?.description}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                 ${item?.hsn_code}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                ${item?.price}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                ${item?.quantity}</td>
                                            <td
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                 ${
                                                   parseFloat(
                                                     item.quantity * item.price
                                                   ).toFixed(2) || 0.0
                                                 }</td>
                                        </tr>
  `
    )
    .join("");

  const totalAmount = row?.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const printWindow = window.open();
  printWindow.document.write(
    `
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>ARTIFICIAL LIMBS MANUFACTURING CORPORATION OF INDIA</title>
    <style>
        @media print {
            button {
                display: none;
            }

            @page {
                size: A4 landscape;
                margin: 30px !important;
            }
        }

    </style>
</head>

<body>

    <table cellpadding="0" cellspacing="0" id="body_TblHeader"
        style="border: solid 0px #000; font-family: Calibri; font-size: 14px; margin: auto; width: 1160px !important;">
        <tr>
            <td colspan="4">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                        <tr>
                            <td colspan="4">
                                    <table style="width: 100%;">
                                        <tbody>
                                            <td>
                                                  <img src=${logo} alt="alimco-logo"
                                            width="120px">
                                            </td>
                                            <td colspan="" style="text-align:center; padding-left: 10px;">
                                                <strong style="font-size: 24px;">ARTIFICIAL LIMBS MANUFACTURING CORPORATION OF
                                                    INDIA</strong><br>
                                                <strong style="font-size: 16px;padding-top: 10px;">
                                                    G.T.Road, Naramau, Kanpur<br>
                                                    Postal Code: 209217, Uttar Pradesh, India.<br>
                                                    CIN: U85110UP1972NPL003646.<br>
                                                    GSTIN: 09AABCA8899F126.
                                                </strong>
                                            </td>
                                        </tbody>
                                    </table>

                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" style="text-align: right;padding-bottom: 10px;">
                                <strong>office Copy</strong>
                            </td>
                        </tr>
                        <tr>
                        <td>
                        <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                        <td colspan="3" style="vertical-align: top;width:80%">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td colspan="3"
                                                style="border-top: 1px solid #000;border-bottom: 0px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700;font-size: 27px;padding-left: 15px;">
                                                Returnable Gate Pass (RGP/VRGP)/Invoices
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 0px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                From Location:</td>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 0px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                To Location/Bill To</td>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 0px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Ship To:</td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700;padding-left: 10px;">
                                                 <span>
                                                   Artificial Limbs Manufacturing Corporation of India  G.T. Road Naramau, Kanpur - 209217, Uttar Pradesh, India.
                                                 </span><br>
                                               
                                            </td>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700;padding-left: 8px;">
                                                <span>${
                                                  aarsaData?.address || ""
                                                }</span><br>

                                                <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>GSTIN</td>
                                                            <td>:</td>
                                                            <td>${
                                                              data?.gstNo +
                                                                "-" +
                                                                data?.unique_code ||
                                                              ""
                                                            }</td>

                                                        </tr>
                                                        <tr>
                                                            <td>State</td>
                                                            <td>:</td>
                                                            <td>${
                                                              data?.aasraState ||
                                                              ""
                                                            } </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                            </td>
                                            <td
                                                style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;width: 28%;">
                                                 <span>${
                                                   aarsaData?.address || ""
                                                 }</span><br>
                                                  <table cellpadding="0" cellspacing="0" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>GSTIN/Unique ID</td>
                                                            <td>:</td>
                                                            <td>${
                                                              data?.gstNo +
                                                                "-" +
                                                                data?.unique_code ||
                                                              ""
                                                            }</td>

                                                        </tr>
                                                        <tr>
                                                            <td>State</td>
                                                            <td>:</td>
                                                            <td>${
                                                              data?.aasraState ||
                                                              ""
                                                            } </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            
                        </tr>
                        </table>

                        </td>
                            </tr>

                        <tr>
                            <td colspan="4">
                                <table cellpadding="4" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                S.No</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Material No.</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Description</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                HSN Code</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Price/Unit</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 0px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Quantity</th>
                                            <th
                                                style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: center;font-weight: 700;">
                                                Total (INR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${ticketDetailsRows}


                                    </tbody>

                                </table>
                            </td>
                        </tr>
                            <tr style="padding-top:"5px;">
                                        <td colspan="2" style="border-left: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">
                                            <table style="width: 100%;" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="height: 100px;vertical-align: top;">
                                                       <b>Notes</b> : <span>${
                                                         data?.notes || ""
                                                       }</span>
                                                        <p style="border-bottom: 1px solid black;"></p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                        <tr>
                            <td colspan="4">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td
                                            style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700; padding-left: 8px;width: 764px;">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>Total Value of Invoice (in Words)</td>
                                                        <td>:</td>
                                                        <td>
                                                         ${words}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Payment Terms</td>
                                                        <td>:</td>
                                                        <td>

                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Incoterms</td>
                                                        <td>:</td>
                                                        <td>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>

                                        <td
                                            style="text-align: right;vertical-align: top;border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 0px solid #000;text-align: left;font-weight: 700; padding-left: 8px;width: 764417;">

                                                <table style="width: 100%;">
                                                    <tbody>
                                                     <tr>
                                                        <td>GST</td>
                                                        <td>:</td>
                                                        <td>${RUPEES_SYMBOL} 0.00

                                                        </td>
                                                    </tr>
                                                        <tr>
                                                            <td>Total Value</td>
                                                            <td>:</td>
                                                            <td>${RUPEES_SYMBOL} ${
      data?.grand_total || 0.0
    }</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>


                        </tr>
                        <tr>
                            <td colspan="4">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td
                                            style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700;padding: 5px;">
                                                <strong>Terms and Conditions</strong><br>
                                                <span>1. The above materials are on loan basis.</span><br>
                                                <span>2. The materials should be returned within 30 days.</span><br>
                                                <span>3. Claims for pricing errors, shortages, and defective products must
                                                    be reported within 15 days of the invoice date.</span><br><br>
                                              
                                            </td>

                                            <td rowspan="2"
                                            style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 0px solid #000;text-align: center;font-weight: 700;vertical-align: top;padding: 5px;">
                                               <strong style="margin-top: 10px;"> FOR ARTIFICIAL LIMBS MANUFACTURING
                                                CORPORATION OF INDIA</strong><br>
                                                <br>
                                                <br>
                                                <br>
                                                <span style="text-align: center;">Authorized Signatory</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                            style="border-top: 0px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;border-left: 1px solid #000;text-align: left;font-weight: 700;padding: 5px;">
                                                Declaration. This is to cortify that particulars given in the Invoice
                                                are True & Correct directly/ indirectly from the buyer. and the amount
                                                indicated represents the price actually charged and there is no inllow
                                                of additional consideration
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>


    </table>
</body>

</html>
      `
  );
  // printWindow.print();
  printWindow.document.close(); // necessary for some browsers to finish writing before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 100);
};

export const downloadCreditImageExport = (row) => {
  const toWords = new ToWords();
  const a = parseFloat(row?.totalGstPricePartial || 0).toFixed(2);
  const b = parseFloat(row?.creditnotetotal || 0).toFixed(2);
  const totalGstPrice = (parseFloat(a) + parseFloat(b)).toFixed(2);

  const words = toWords.convert(totalGstPrice || 0.0, { currency: true });
  //   console.log(totalGstPrice,a,b,"net Total");

  const productDetailsRows = row?.stockData?.items
    ?.map(
      (item, index) => `

     <tr  key="${index}"
                                    style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 40px;">
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        ${index + 1}</td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                       ${
                                         item?.sparePartPartial?.hsn_code || " "
                                       }<br> ${
        item?.sparePartPartial?.part_name || " "
      } </td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
        ${item?.item_name}</td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                       ${item?.quantity}</td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                         ${item?.price || 0.0}</td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                           ${item?.sparePartPartial?.gst || 0.0}
                                        </td>
                                    <td
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;">
                                        ${
                                          parseFloat(
                                            item?.quantity * item?.itemUnitPrice
                                          ).toFixed(2) || 0.0
                                        }

                                        </td>

                                </tr>
`
    )
    .join("");

  const content = `

<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Artificial Limbs Manufacturing Corporation of India</title>
</head>
<style type="text/css">
    p {
        padding: 0px;
        margin: 0px;
        margin-bottom: 10px !important;
    }
</style>

<body style="margin: 10px 0; font-size: 12px;line-height: 16px; ">
    <table
        style="width: 800px; border: 1px solid black; margin: 0px auto; font-size: 12px; font-family:Verdana, Geneva, Tahoma, sans-serif"
        cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">

                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 1px solid black;">
                                <tr>
                                    <td style="width: 20%; text-align: center;">
                                        <img src=${logo}
                                            alt="alimco-logo" width="100px"><br>
                                        <span>ISO 9001 : 2015</span>
                                    </td>
                                    <td style="padding-top: 10px;text-align: center;">
                                        <span
                                            style="font-size: 20px; font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Artificial
                                            Limbs Manufacturing Corporation of India</span><br>
                                        <span><b
                                                style="font-size:medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">A
                                                GOVERMENT OF INDIA UNDERTAKING</b></span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                            Naramau, G.T.Road Kanpur 209217</span><br>
                                        <span
                                            style="font-family:Verdana, Geneva, Tahoma, sans-serif;">U85110UP1972NPL003646</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">09AABCA8899F1Z6
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-size: 16px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">TAX
                                                INVOICE</span><br><br>
                                    </td>
                                </tr>
                                <!-- <tr>
                                    <td colspan="2" style="text-align: center;"><b>TAX INVOICE</b></td>
                                </tr> -->
                                <tr>
                                    <td colspan="2">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                            <tr>
                                                <td><strong style="margin-left: 5px;">Type :</strong> 07AAHCK3696C1ZF
                                                </td>
                                                <td style="text-align: right;"><strong style="margin-right: 5px;">SAP
                                                        Reference No :</strong><span
                                                        style="padding-right: 5px;">4865789646</span></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>


                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                <tbody>
                                    <tr>
                                        <th style="width: 300px;text-align: left;padding-left: 5px;">
                                            IRN</th>
                                        <th style="width: 250px;text-align: center;">
                                            Acknowledgment Number</th>
                                        <th style="width: 300px;text-align: right;padding-right: 5px;">
                                            Ack.Date</th>

                                    </tr>
                                    <tr>
                                        <td
                                            style="width: 250px;text-align: left;padding-left: 5px;border-top: 1px solid #333;">
    ${row?.inr || ""}</td>
                                        <td style="width: 250px;text-align: center;border-top: 1px solid #333;">
                                           ${row?.Ack_No || ""} </td>
                                        <td
                                            style="width: 300px;text-align: right;padding-right: 5px;border-top: 1px solid #333;">
                                           ${row?.Ack_Date || ""}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                <tbody>
                                    <tr>
                                        <th style="width: 200px;text-align: left;padding-left: 5px;">
                                            Credit No</th>
                                        <th style="width: 250px;text-align: center;">
                                            Credit Date </th>
                                        <th style="width: 300px;text-align: center;padding-right: 5px;">
                                            Order Ref No </th>
                                        <th style="width: 300px;text-align: left;padding-left: 5px;">
                                            Order Ref Date</th>
                                        <th style="width: 250px;text-align: center;">
                                            MRN No </th>
                                        <th style="width: 300px;text-align: right;padding-right: 5px;">
                                        MRN Date</th>

                                    </tr>
                                    <tr>
                                        <td style="width: 200px;text-align: left;padding-left: 5px;">
                                            ${row?.credit_no || ""}</td>
                                        <td style="width: 250px;text-align: center;">
                                        ${row?.credit_date || ""}</td>
                                        <td style="width: 300px;text-align: center;padding-right: 5px;">
                                            ${row?.order_ref_no || ""} </td>
                                        <td style="width: 250px;text-align: left;padding-left: 5px;">
                                           ${row?.order_ref_date || ""} </td>
                                        <td style="width: 250px;text-align: center;">
                                           ${row?.MRN_no || ""} </td>
                                        <td style="width: 300px;text-align: right;padding-right: 5px;">
                                            ${row?.MRN_date || ""}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                <tr>
                                    <th
                                        style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;">
                                        Shipping /Export Details (Consingee Address):</th>
                                    <th
                                        style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%;">
                                        Billing Details (Indenter Code & Name):</th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                <tr>
                                    <td
                                        style="line-height: 20px; border-right: 1px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid #333;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                :</b> ${row?.aasra?.name || ""}
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                :</b>  ${
                                                  row?.aasra?.address || ""
                                                }</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pincode
                                                :</b>
                                             ${row?.aasra?.pin || ""}</span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Phone
                                                :</b>  ${
                                                  row?.aasra?.mobile_no || ""
                                                }</span><br>

                                    </td>
                                    <td
                                        style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 1px solid #333;">
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Party
                                                Code :</b>  ${
                                                  row?.aasra?.unique_code || ""
                                                } </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Indentor
                                                Name :</b>${
                                                  row?.aasra?.name || ""
                                                }
                                        </span><br>
                                        <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">GSTIN
                                                :</b>${row?.aasra?.gstIn || ""}
                                        </span><br>

                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                <tbody>
                                    <tr>
                                        <th
                                            style="width: 200px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333;">
                                            Banker's Name</th>
                                        <th style="width: 250px;text-align: center;border-bottom: 1px solid #333;">
                                            Pyament Terms </th>
                                        <th
                                            style="width: 300px;text-align: center;padding-right: 5px;border-bottom: 1px solid #333;">
                                            Transporter Name </th>
                                        <th
                                            style="width: 300px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333;">
                                            Truck No </th>
                                        <th style="width: 250px;text-align: center;border-bottom: 1px solid #333;">
                                            No of Cases </th>
                                        <th
                                            style="width: 300px;text-align: right;padding-right: 5px;border-bottom: 1px solid #333;">
                                            Weight</th>

                                    </tr>
                                    <tr>
                                        <td style="width: 200px;text-align: left;padding-left: 5px;">
                                            ${row?.bank_name || ""}</td>
                                        <td style="width: 200px;text-align: left;padding-left: 5px;">
                                            ${row?.pyament_terms || ""}</td>
                                        <td style="width: 250px;text-align: center;">
                                            ${row?.transporter_name || ""} </td>
                                        <td style="width: 300px;text-align: center;padding-right: 5px;">
                                            ${row?.truck_no || ""} </td>
                                        <td style="width: 250px;text-align: left;padding-left: 5px;">
                                            ${row?.no_of_cases || ""}</td>
                                        <td style="width: 250px;text-align: center;">
                                           ${row?.weight || ""} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                <tbody>
                                    <tr>
                                        <th
                                            style="width: 200px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333">
                                            Gate Pass No </th>
                                        <th style="width: 250px;text-align: center;border-bottom: 1px solid #333">
                                            Rr Gr No </th>
                                        <th style="text-align: center;padding-right: 5px;border-bottom: 1px solid #333">
                                            Remarks </th>
                                        <th style="text-align: left;padding-left: 5px;border-bottom: 1px solid #333">
                                            Driver Contact No</th>
                                        <th colspan="2" style="text-align: center;border-bottom: 1px solid #333">
                                            Dispatch Mode </th>


                                    </tr>
                                    <tr>
                                        <td style="width: 200px;text-align: left;padding-left: 5px;">
                                           ${row?.gate_pass || ""}</td>
                                        <td style="width: 250px;text-align: center;">
                                           ${row?.rg_gr_no || ""}</td>
                                        <td style="text-align: center;padding-right: 5px;">
                                            ${row?.remarks || ""}</td>
                                        <td style="text-align: center;padding-left: 5px;">
                                           ${row?.driver_contact || ""} </td>
                                        <td colspan="2" style="text-align: center;">
                                            ${row?.dispatch_mode || ""} </td>

                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0"
                                style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                <tbody>
                                    <tr>
                                        <th style="text-align: center;padding-left: 5px;border-bottom: 1px solid #333">
                                            Insurance Details
                                        </th>

                                    </tr>
                                    <tr>
                                        <td style="text-align: left;padding-left: 5px;">
                                            ${row?.notes || " "}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;">
                                <tr
                                    style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        S.NO</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        Product & HSN</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        Nomenclature</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        QTY</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        Unit Price</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                        GST (%)</th>
                                    <th
                                        style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;">
                                        Total Amount</th>
                                </tr>

                               ${productDetailsRows}
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 0px solid black;">
                                <tr>
                                    <td style="border-right: 1px solid black;">
                                        <h3
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-weight: bolder; margin: 0; padding: 0;">
                                            TERMS & CONDITIONS FOR THE SALE:</h3>
                                        <ol
                                            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: small;">
                                            <li>Interest of 21% on annual basis will be levied if the invoice is not
                                                cleared within 8 days of presentation of documents.</li>
                                            <li>Items once sold not be accepted back.</li>
                                            <li>Rest of the terms & conditions as per our quotation.</li>
                                        </ol>
                                        </span>
                                    </td>
                                    <td style="line-height: 20px; width: 25%; text-align: end;">
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">GST
                                         :</span><br>
                                    </td>
                                    <td style="line-height: 20px; width: 25%; text-align: center;"
                                        style="width: 25%; text-align: center; vertical-align: text-top; font-size: small; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                                        <span
                                            style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">₹

                                            ${
                                              parseFloat(
                                                row?.totalGstPricePartial
                                              ).toFixed(2) || 0.0
                                            }</span><br>


                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2"
                                        style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: right;font-weight: 600; font-size: 14px;padding-bottom: 5px;padding-top: 2px">
                                        Net Total
                                    </td>
                                    <td
                                        style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;font-weight: 600; font-size: 14px;padding-bottom: 5px;padding-top: 2px">
                                        ₹ ${
                                          parseFloat(totalGstPrice).toFixed(
                                            2
                                          ) || 0.0
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style="border-top: 0px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: left;padding-left: 10px;">
                                        Form No. ER 35
                                    </td>
                                    <td colspan="2"
                                        style="border-top: 0px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;">
                                        <strong>${words}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3"
                                        style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: right;padding-right: 10px;">
                                        <br><span>E. & O.E.</span><br><br>
                                        <span>For ALIMCO</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="height: 100px;vertical-align: bottom;">
                            <table cellpadding="0" cellspacing="0" style="width: 100%;padding-bottom: 10px;">
                                <tr>
                                    <td style="padding-left: 50px;"><strong>Status : Active</strong></td>
                                    <td style="text-align: center;"><strong>Prepared By</strong></td>
                                    <td style="text-align: center;"><strong>(Authorized Signature)</strong></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
 `;
  const printWindow = window.open("", "", "width=800,height=600");
  // Open a new window to render the content
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();
  // Wait for the content to load
  printWindow.onload = async () => {
    // Capture the content with html2canvas
    const canvas = await html2canvas(printWindow.document.body, {
      scale: 1, // Increase scale for better resolution
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 10, 10, 580, 0);

    const fileName = "Credit Note";

    pdf.save(fileName);
    // Close the print window
    printWindow.close();
  };
};
export const downloadCredit = (row) => {
  const toWords = new ToWords();
  const a = parseFloat(row?.totalGstPricePartial || 0).toFixed(2);
  const b = parseFloat(row?.creditnotetotal || 0).toFixed(2);

  const totalGstPricePartial = (parseFloat(a) + parseFloat(b)).toFixed(2);

  const totalGstPrice = Math.round(totalGstPricePartial);

  const words = toWords.convert(totalGstPrice || 0, { currency: true });
  //   console.log(totalGstPrice,a,b,"net Total");

  const productDetailsRows = row?.stockData?.items
    ?.map(
      (item, index) => `
  
       <tr  key="${index}"
                                      style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; height: 40px; letter-spacing:1.5px" >
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center; letter-spacing:1.5px">
                                          ${index + 1}</td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center; letter-spacing:1.5px">
                                         ${
                                           item?.sparePartPartial?.hsn_code ||
                                           " "
                                         }- ${
        item?.sparePartPartial?.part_name || " "
      } </td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center; letter-spacing:1.5px">
          ${item?.item_name}</td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                         ${item?.quantity}</td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                           ${item?.price || 0.0}</td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                             ${
                                               item?.sparePartPartial?.gst ||
                                               0.0
                                             }
                                          </td>
                                      <td
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;">
                                          ${
                                            parseFloat(
                                              item?.quantity *
                                                item?.itemUnitPrice
                                            ).toFixed(4) || 0.0
                                          }
  
                                          </td>
  
                                  </tr>
  `
    )
    .join("");

  // Use html2canvas to capture the HTML content
  const content = `
  
  <!doctype html>
  <html>
  
  <head>
      <meta charset="utf-8">
      <title>Artificial Limbs Manufacturing Corporation of India</title>
  </head>
  <style type="text/css">
      p {
          padding: 0px;
          margin: 0px;
          margin-bottom: 10px !important;
      }
  </style>
  
  <body style="margin: 10px 0; font-size: 12px;line-height: 14px; ">
      <table
         style="width: 800px; border: 0.8px solid black; margin: 0px auto; font-size: 12px; white-space: normal; font-family:Verdana, Geneva, Tahoma, sans-serif"
      cellpadding="0" cellspacing="0">
          <tr>
              <td>
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
  
                      <tr>
                          <td>
                              <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 1px solid black;">
                                  <tr>
                                      <td style="width: 20%; text-align: center;">
                                          <img src=${logo}
                                              alt="alimco-logo" width="100px"><br>
                                          <span>ISO 9001 : 2015</span>
                                      </td>
                                      <td style="padding-top: 10px;text-align: center;">
                                          <span
                                              style="font-size: 20px; font-weight: bolder; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; word-spacing: 2px; letter-spacing:1.5px">Artificial
                                              Limbs Manufacturing  Corporation  of India</span><br>
                                          <span><b
                                                  style="font-size:medium; text-decoration:undeline; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;word-spacing:2px; letter-spacing:1.5px">A
                                                  GOVERMENT OF INDIA UNDERTAKING</b></span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">
                                              Naramau, G.T.Road Kanpur 209217</span><br>
                                          <span
                                              style="font-family:Verdana, Geneva, Tahoma, sans-serif;">U85110UP1972NPL003646</span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;">09AABCA8899F1Z6
                                          </span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif; word-spacing: 2px; letter-spacing:1.5px"><b
                                                  style="font-size: 16px; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; word-spacing: 2px; letter-spacing:1.5px">TAX
                                                  INVOICE</span><br><br>
                                      </td>
                                  </tr>
                                  <!-- <tr>
                                      <td colspan="2" style="text-align: center;word-spacing:3px; letter-spacing:1.5px"><b>TAX INVOICE</b></td>
                                  </tr> -->
                                  <tr>
                                      <td colspan="2">
                                          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                                              <tr>
                                                  <td><strong style="margin-left: 5px;">Type :</strong> 
                                                  <span
                                                          style="padding-right: 5px;">${
                                                            row?.purchase_type ||
                                                            ""
                                                          }</span>
                                                  </td>
                                                  <td style="text-align: right;"><strong style="margin-right: 5px;">SAP
                                                          Reference No :</strong><span
                                                          style="padding-right: 5px;">${
                                                            row?.sap_ref_no ||
                                                            ""
                                                          }</span></td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
  
  
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                  <tbody>
                                      <tr>
                                          <th style="width: 300px;text-align: left;padding-left: 5px;">
                                              IRN:</th>
                                          <th style="width: 245px;text-align: center;">
                                              Acknowledgment Number:</th>
                                          <th style="width: 300px;text-align: right;padding-right: 5px;">
                                              Ack.Date:</th>
                                              <th></th>
  
                                      </tr>
                                      <tr>
                                          <td
                                              style="width: 250px;text-align: left;padding-left: 5px;border-top: 1px solid #333;">
      ${row?.inr || ""}</td>
                                          <td style="width: 250px;text-align: center;border-top: 1px solid #333;">
                                             ${row?.Ack_No || ""} </td>
                                          <td
                                              style="width: 300px;text-align: right;padding-right: 5px;border-top: 1px solid #333;">
                                             ${row?.Ack_Date || ""}</td>
  
                                      </tr>
                                                                          <tr><td colspan="6" style="border-bottom: 1px solid black;">&nbsp;</td>
                                  
                                      </tr>
  
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                  <tbody>
                                      <tr>
                                          <th style="width: 200px;text-align: left;padding-left: 5px;">
                                              Credit No:</th>
                                          <th style="width: 250px;text-align: center;">
                                              Credit Date: </th>
                                          <th style="width: 300px;text-align: center;padding-right: 5px;">
                                              Order Ref No: </th>
                                          <th style="width: 300px;text-align: left;padding-left: 5px;">
                                              Order Ref Date:</th>
                                          <th style="width: 250px;text-align: center;">
                                              MRN No: </th>
                                          <th style="width: 300px;text-align: right;padding-right: 5px;">
                                          MRN Date:</th>
  
                                      </tr>
                                     
                                      <tr>
                                          <td style="width: 200px;text-align: left;padding-left: 5px;">
                                              ${row?.credit_no || ""}</td>
                                          <td style="width: 250px;text-align: center;">
                                          ${row?.credit_date || ""}</td>
                                          <td style="width: 300px;text-align: center;padding-right: 5px;">
                                              ${row?.order_ref_no || ""} </td>
                                          <td style="width: 250px;text-align: left;padding-left: 5px;">
                                             ${row?.order_ref_date || ""} </td>
                                          <td style="width: 250px;text-align: center;">
                                             ${row?.MRN_no || ""} </td>
                                          <td style="width: 300px;text-align: right;padding-right: 5px;">
                                              ${row?.MRN_date || ""}</td>
                                      </tr>
                                      <tr><td colspan="6" style="border-top: 1px solid black;">&nbsp;</td>
                                  
                                      </tr>
              
                                  </tbody>
                              </table>
                          </td>
                      </tr>
  
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 1px solid black; word-spacing:1.5px">
                                  <tr>
                                      <th
                                          style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: medium; width: 50%; padding: 5px;letter-spacing:0.5px;border-right:1px solid black;">
                                          Shipping /Export Details (Consingee Address):</th>
                                      <th
                                          style="font-size: medium; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; width: 50%; word-spacing:1.5px ;padding: 5px; letter-spacing:0.5px">
                                          Billing Details (Indentor Code & Name):</th>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                  <tr>
                                      <td
                                          style="line-height: 20px; border-right: 1px solid black; padding: 5px 0px 0px 5px;border-bottom: 1px solid #333;">
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Name
                                                  :</b> ${
                                                    row?.aasra?.name || ""
                                                  }
                                          </span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Address
                                                  :</b>  ${
                                                    row?.aasra?.address || ""
                                                  }</span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Pincode
                                                  :</b>
                                               ${
                                                 row?.aasra?.pin || ""
                                               }</span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small;">Phone
                                                  :</b>  ${
                                                    row?.aasra?.mobile_no || ""
                                                  }</span><br>
  
                                      </td>
                                      <td
                                          style="line-height: 20px; width: 50%; padding: 5px 0px 0px 5px;border-bottom: 1px solid #333;">
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small; letter-spacing:1.0px">Party
                                                  Code :</b>  ${
                                                    row?.aasraUser
                                                      ?.unique_code || ""
                                                  } </span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small; letter-spacing:1px">
                                                  Indentor Name :</b>${
                                                    row?.aasra?.name || ""
                                                  }
                                          </span><br>
                                          <span style="font-family:Verdana, Geneva, Tahoma, sans-serif;"><b
                                                  style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: small; letter-spacing:1.0px">GSTIN
                                                  :</b>${row?.aasra?.gst || ""}
                                          </span><br>
  
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                  <tbody>
                                      <tr>
                                          <th
                                              style="width: 250px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333; word-spacing:0.1px !important">
                                              Banker's Name:</th>
                                          <th style="width: 250px;text-align: center;border-bottom: 1px solid #333;">
                                              Payment Terms: </th>
                                          <th
                                              style="width: 300px;text-align: center;padding-right: 5px;border-bottom: 1px solid #333;">
                                              Transporter Name: </th>
                                          <th
                                              style="width: 300px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333;">
                                              Truck No: </th>
                                          <th style="width: 250px;text-align: center;border-bottom: 1px solid #333;">
                                              No of Cases: </th>
                                          <th
                                              style="width: 300px;text-align: right;padding-right: 5px;border-bottom: 1px solid #333;">
                                              Weight:</th>
  
                                      </tr>
                                      <tr>
                                          <td style="width: 200px;text-align: left;padding-left: 5px;">
                                              ${row?.bank_name || ""}</td>
                                          <td style="width: 200px;text-align: left;padding-left: 5px;">
                                              ${row?.pyament_terms || ""}</td>
                                          <td style="width: 250px;text-align: center;">
                                              ${
                                                row?.transporter_name || ""
                                              } </td>
                                          <td style="width: 300px;text-align: center;padding-right: 5px;">
                                              ${row?.truck_no || ""} </td>
                                          <td style="width: 250px;text-align: left;padding-left: 5px;">
                                              ${row?.no_of_cases || ""}</td>
                                          <td style="width: 250px;text-align: center;">
                                             ${row?.weight || ""} </td>
                                      </tr>
                                      <tr><td colspan="6" style="border-bottom: 1px solid black;">&nbsp;</td>
                                  
                                      </tr>
  
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 0px solid black;">
                                  <tbody>
                                      <tr>
                                          <th
                                              style="width: 200px;text-align: left;padding-left: 5px;border-bottom: 1px solid #333">
                                              Gate Pass No: </th>
                                          <th style="width: 250px;text-align: center;border-bottom: 1px solid #333">
                                              Rr Gr No: </th>
                                          <th style="text-align: center;padding-  : 5px;border-bottom: 1px solid #333">
                                              Remarks: </th>
                                          <th style="text-align: left;padding-left: 5px;border-bottom: 1px solid #333">
                                              Driver Contact No:</th>
                                          <th colspan="2" style="text-align: center;border-bottom: 1px solid #333">
                                              Dispatch Mode: </th>
  
  
                                      </tr>
                                      <tr>
                                          <td style="width: 200px;text-align: left;padding-left: 5px;">
                                             ${row?.gate_pass || ""}</td>
                                          <td style="width: 250px;text-align: center;">
                                             ${row?.rg_gr_no || ""}</td>
                                          <td style="text-align: center;padding-right: 5px;">
                                              ${row?.remarks || ""}</td>
                                          <td style="text-align: center;padding-left: 5px;">
                                             ${row?.driver_contact || ""} </td>
                                          <td colspan="2" style="text-align: center;">
                                              ${row?.dispatch_mode || ""} </td>
  
                                      </tr>
                                        <tr><td colspan="6" style="border-bottom: 1px solid black;">&nbsp;</td>
                                  
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
  
                      <tr>
                          <td>
                              <table cellspacing="0" cellpadding="0"
                                  style="width: 100%; text-align: left; border-bottom: 1px solid black;">
                                  <tbody>
                                      <tr>
                                          <th style="text-align: center;padding-left: 5px;border-bottom: 1px solid #333">
                                              Insurance Details-
                                          </th>
  
                                      </tr>
                                      <tr>
                                          <td style="text-align: left;padding-left: 5px;">
                                              ${row?.notes || " "}
                                          </td>
                                          <tr></tr>
                                      </tr>
                                        <tr><td colspan="6">&nbsp;</td>
                                  
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
  
                      <tr>
                          <td>
                              <table cellpadding="0" cellspacing="0" style="width: 100%; border-bottom: 0px solid black;">
                                  <tr
                                      style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center; padding:3px;">
                                          S.no</th>
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center; letter-spacing: 1.5px">
                                          Product & HSN</th>
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                          Nomenclature</th>
                                      <th
                                          style="font-size:12px; border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;padding:3px">
                                          Qty</th>
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                          Unit Price</th>
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 1px solid #333;text-align: center;">
                                          GST (%)</th>
                                      <th
                                          style="border-top: 0px solid black;border-bottom: 1px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center;">
                                          Total Amount</th>
                                  </tr>
  
                                 ${productDetailsRows}
                              </table>
                          </td>
                      </tr>
  
                    <tr>
      <td>
          <table cellspacing="0" cellpadding="0" style="width: 100%; border-bottom: 0px solid black;">
              <tr>
                  <td style="border-right: 1px solid black;">
                      <h3
                          style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-weight: bolder; margin: 0; padding: 0;letter-spacing:1.5px">
                          TERMS & CONDITIONS FOR THE SALE:
                      </h3>
                      <ul
                          style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-size: small; margin: 0; padding-left: 20px; line-height: 1.6; letter-spacing:1.5px">
                          <li><b>1.</b> Interest of 21% on an annual basis will be levied if the invoice is not cleared within 8 days of presentation of documents.</li>
                          <li><b>2.</b> Items once sold will not be accepted back.</li>
                          <li><b>3.</b> Rest of the terms & conditions as per our quotation.</li>
                      </ul>
                  </td>
                  <td style="line-height: 20px; width: 25%; text-align: end;">
                      <span
                          style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;word-spacing: 3px;letter-spacing:1.5px">
                          GST:
                      </span><br>
                  </td>
                  <td style="line-height: 20px; width: 25%; text-align: center;">
                      <span
                          style="font-size: small; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                          Rs. ${
                            parseFloat(row?.totalGstPricePartial).toFixed(4) ||
                            0.0
                          }
                      </span><br>
                  </td>
              </tr>
              <tr>
                  <td colspan="2"
                      style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: right;font-weight: 600; font-size: 14px;padding-bottom: 5px;padding-top: 2px">
                      Net Total:
                  </td>
                 <td
                                          style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: left;font-weight: 600; font-size: 14px;padding-bottom: 5px;padding-top: 2px">
                                          Rs. ${
                                            parseFloat(totalGstPrice).toFixed(
                                              2
                                            ) || 0.0
                                          }
                                      </td>
  
              </tr>
              <tr>
                  <td
                      style="border-top: 0px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: left;padding-left: 10px;">
                      Form No. ER 35
                  </td>
                  <td colspan="2"
                      style="border-top: 0px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: center; word-spacing:1px">
                      <strong>${words}</strong>
                  </td>
              </tr>
              <tr>
                  <td colspan="3"
                      style="border-top: 1px solid #333;border-bottom: 0px solid #333;border-left: 0px solid black;border-right: 0px solid #333;text-align: right;padding-right: 10px;">
                      <br><span>E. & O.E.</span><br>
                      <span>For ALIMCO</span>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
  
  <tr>
      <td style="height: 100px;vertical-align: bottom;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;padding-bottom: 10px;">
              <tr>
                  <td style="padding-left: 50px;"><strong>Status: Active</strong></td>
                  <td style="text-align: center;"><strong>Prepared By</strong></td>
                  <td style="text-align: center;"><strong>(Authorized Signature)</strong></td>
              </tr>
          </table>
      </td>
  </tr>
  
      </table>
  </body>
  </html>
   `;
  const printWindow = window.open("", "", "width=800,height=600");
  // Open a new window to render the content
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();
  // Wait for the content to load
  printWindow.onload = async () => {
    const doc = new jsPDF("p", "pt", "a4");

    // Get the updated HTML content from the print window
    const htmlContent = printWindow.document.body.innerHTML;
    // Example of adding inline styles to improve spacing in HTML
    const styledHtmlContent = htmlContent.replace(
      /<\/head>/,
      `<style>
         body { margin: 20px; }
         h1, h2, h3 { margin-bottom: 15px; }
         p { margin-bottom: 10px; line-height: 1.6; }
         table { margin: 15px 0; border-spacing: 10px; }
       </style></head>`
    );

    const fileName = "Credit Note";

    // Generate the PDF
    await doc.html(htmlContent, {
      callback: (pdf) => {
        pdf.save(fileName);
        printWindow.close();
      },
      margin: [10, 10, 10, 10], // top, left, bottom, right
      html2canvas: {
        scale: 0.7, // Adjust to fit content within page
        letterRendering: true,
        useCORS: true, // If your HTML content has images from other domains
      },
      x: 10,
      y: 10,
    });
  };
};
