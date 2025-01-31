import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Label, Row, Spinner } from "reactstrap";
import { Breadcrumbs, H3, H6, P } from "../../AbstractElements";
import { repairProductAPI } from "../../api/aasra";
import {
  categoryWiseProductListAPI,
  productWiseRepairListAPI,
} from "../../api/dropdowns";
import { listCategoryMasterAPI } from "../../api/master";
import { handleClosedTicketPrint } from "../../util/myPrint";
import useLogout from "../../util/useLogout";
import { ticketDropdown } from "../../api/user";
import { ticketDetailAPI } from "../../api/user";
import { RUPEES_SYMBOL } from "../../Constant";
import { useForm } from "react-hook-form";
import Required from "../../Components/MyComponents/Required";

const TicketDetail = () => {
  const { setValue, watch } = useForm();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const userToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const paymentOptions = ["UPI", "Cash", "HDFC Payment Gateway"];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parts, setParts] = useState("");
  const [fixedPrice, setFixedPrice] = useState(
    location?.state?.ticket?.ticketDetail?.length > 0
      ? location?.state?.ticket?.ticketDetail[0]?.repairPrice
      : 0 || 0
  );
  const [battery, setBattery] = useState("");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [handlingList, setHandlingList] = useState([]);
  const [warranty, setWarranty] = useState([
    location?.state?.ticket?.warranty
      ? { value: true, label: "In Warranty" }
      : { value: false, label: "Out of Warranty" },
  ]);
  const [warrantyMessage, setWarrantyMessage] = useState(
    "please select warranty status"
  );
  const [productHandleList, setProductHandleList] = useState([
    { value: "Repair/Replace", label: "Repair/Replace" },
    { value: "Purchase", label: "Purchase" },
  ]);
  const [item, setItem] = useState(location?.state?.ticket);
  const [validationErrors, setValidationErrors] = useState([]);
  const [error, setError] = useState("");
  const [manufacturerList, setManufacturerList] = useState([]);
  const [new_manufacturer, setNewmanufacturer] = useState([
    { value: "Lenavo", label: "Power" },
    { value: "DC", label: "Bolt" },
  ]);
  const [aasraData, setAasraData] = useState([]);
  const [gstAmount, setGstAmount] = useState(0);
  const [description, setDescription] = useState(null);
  const [discountRec, setDiscountRec] = useState(null);
  const [discountRsn, setdiscountRsn] = useState(null);
  useEffect(() => {
    fetch();
    ticketDetail();
    listCategory();
  }, []);
  const fetch = async () => {
    try {
      const response = await ticketDropdown();
      if (response.data.status === "success") {
        setManufacturerList(response.data.data.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const [rows, setRows] = useState([
    {
      warranty: null,
      category: null,
      product: null,
      repair: null,
      qty: 1,
      price: 0,
      serviceCharge: 0,
      gst: 0,
      amount: 0,
    },
  ]);

  const ticketDetail = async () => {
    const ticket_id = location?.state?.ticket?.ticket_id;
    console.log(location?.state?.ticket, "ticket----");

    // if (!ticket_id) {
    //   console.log("No ticket ID found");
    //   return;
    // }
    const body = { ticket_id };
    try {
      const res = await ticketDetailAPI(body);
      if (res?.data?.status === "success") {
        const mappedRows = location?.state?.ticket?.ticketDetail.map(
          (item, index) => ({
            category: { value: item.categoryValue, label: item.categoryLabel },
            product: {
              value: item.productValue,
              label: item.productLabel,
              productPrice: item?.productPrice,
            },
            repair: {
              value: item.repairValue,
              label: item.repairLabel,
              repairGst: item?.repairGst,
              repairLabel: item?.repairLabel,
              repairPrice: item?.repairPrice,
              repairServiceCharge: item?.repairServiceCharge,
              repairTime: item?.repairTime,
            },
            handleRepair: {
              value: item.repairCheckValue,
              label: item.repairCheckLabel,
            },
            old_manufacturer: {
              value: item.old_manufacturer_id,
              label: item.old_manufacture_name,
            },
            new_manufacturer: {
              value: item.new_manufacturer_id,
              label: item.new_manufacture_name,
            },
            old_serial_number: item.old_serial_number,
            new_serial_number: item.new_serial_number,
            repair_time: item.repairTime,
            qty: item.qty,
            price: item.price,
            serviceCharge: item.serviceCharge,
            amount: item.amount,
            gg: handleProductChange(
              {
                value: item.productValue,
                label: item.productLabel,
                productPrice: item?.productPrice,
              },
              index,
              null
            ),
            cc: handleCategoryChange(
              { value: item.categoryValue, label: item.categoryLabel },
              index
            ),
          })
        );
        setItem(location?.state?.ticket);
        setRows(mappedRows);
        setDescription(location?.state?.ticket?.job_description);
        setDiscountRec(location?.state?.ticket?.additionalDiscount.toFixed(4));
        setdiscountRsn(location?.state?.ticket?.discountReason);
      } else {
        console.log("Error in response", res.data);
      }
    } catch (err) {
      console.log("Error fetching ticket detail", err);
    }
  };
  const handleChange = (e) => {
    setDescription(e.target.value);
    // Validate the input here
    if (e.target.value === null) {
      setError("Description is required.");
    } else {
      setError("");
    }
  };
  const listCategory = () => {
    listCategoryMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          // let a = res.data.data.data.map((item) => ({
          //   value: item.id,
          //   label: item.category_name,
          // }));
          let a = res.data.data.data
            .filter((item) => item.category_name === "MOTORIZED TRICYCLE")
            .map((item) => ({
              value: item.id,
              label: item.category_name,
            }));
          setCategoryList(a);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  const handleOldManufacturer = async (e, index) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      old_manufacturer: e,
    };
    setRows(newRows);
  };
  const handleNewManufacturer = (e, index) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      new_manufacturer: e,
    };
    setRows(newRows);
  };
  const handleCategoryChange = (e, index) => {
    const newCategoryValue = e; // Adjust according to your input type
    const newRows = [...rows];

    // Update the category and reset other fields for the current row
    newRows[index] = {
      ...newRows[index],
      category: e,
      product: null,
      repair: null,
      handleRepair: null,
      old_manufacturer: null,
      new_manufacturer: null,
      old_serial_number: null,
      new_serial_number: null,
      qty: 1,
      price: null,
      serviceCharge: null,
      amount: null,
    };
    setRows(newRows);

    // Check for duplicate combination for the current row
    const isDuplicate = isDuplicateCombination(
      newRows,
      e,
      newRows[index].product,
      newRows[index].repair,
      index
    );

    if (isDuplicate) {
      toast.error(
        "Duplicate combination of Category, Product, and Repair found!"
      );
      const newErrors = [...validationErrors];
      newErrors[index] = {
        ...newErrors[index],
        category: "Duplicate combination found",
      };
      setValidationErrors(newErrors);
    } else {
      setRows(newRows);
      const newErrors = [...validationErrors];
      newErrors[index] = {
        ...newErrors[index],
        category: e ? "" : "Category is required",
      };
      setValidationErrors(newErrors);
    }

    // Only call the API if a valid category is selected
    if (newCategoryValue && newRows[index].category) {
      const body = {
        category_id: e.value,
      };
      // Call the API to fetch products for the selected category
      categoryWiseProductListAPI(body, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            setProductList(res.data.data.productData);
          } else if (res.data.status === "failed") {
            toast.error(res.data.message);
          } else if (res.data.status === "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      // If no category is selected, clear the product list for the current row
      console.log(
        `No valid category selected for row ${index}, product list cleared.`
      );
    }
    setProductList([]);
  };

  const handleRepairingChange = (selectedOption, index) => {
    const newRows = [...rows];
    const product = handlingList?.find((p) => p.value === selectedOption.value);
    const price = product ? product.repairPrice : 0;
    const serviceCharge = product ? product.repairServiceCharge : 0;
    const gst = product ? product.repairGst : 0;

    const amount = (price + serviceCharge).toFixed(2);

    newRows[index] = {
      ...newRows[index],
      repair: selectedOption,
      qty: 1,
      price: price,
      // // serviceCharge: serviceCharge,
      gst: gst,
      amount: parseFloat(amount),
    };

    // Check for duplicate combinations
    const isDuplicate = isDuplicateCombination(
      newRows,
      newRows[index].category,
      newRows[index].product,
      selectedOption,
      index
    );

    if (isDuplicate) {
      toast.error(
        "Duplicate combination of Category, Product, and Repair found!"
      );
      const newErrors = [...validationErrors];
      newErrors[index] = {
        ...newErrors[index],
        repair: "Duplicate combination found",
      };
      setValidationErrors(newErrors);
    } else {
      setRows(newRows);
      const newErrors = [...validationErrors];
      newErrors[index] = {
        ...newErrors[index],
        repair: selectedOption ? "" : "Repair is required",
      };
      setValidationErrors(newErrors);
    }
  };
  const handleProductChange = (e, index, k) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      product: e,
      repair: null,
      handleRepair: null,
      old_manufacturer: null,
      new_manufacturer: null,
      old_serial_number: null,
      new_serial_number: null,
      qty: null,
      price: null,
      serviceCharge: null,
      amount: null,
    };

    const isDuplicate = isDuplicateCombination(
      newRows,
      newRows[index].category,
      e,
      newRows[index].repair,
      index
    );

    if (isDuplicate) {
      toast.error(
        "Duplicate combination of Category, Product, and Repair found!"
      );
      const newErrors = [...validationErrors];
      // newErrors[index] = {
      //   ...newErrors[index],
      //   product: "Duplicate combination found",
      // };
      setValidationErrors(newErrors);
    } else {
      setRows(newRows);
      const newErrors = [...validationErrors];
      newErrors[index] = {
        ...newErrors[index],
        product: e ? "" : "Product is required",
      };
      setValidationErrors(newErrors);
    }
    if (e) {
      const body = {
        repair_id: e.value,
        warranty: location?.state?.ticket?.warranty,
      };

      // if (user?.user_type == "AC") {
      productWiseRepairListAPI(body, tokenHeader)
        .then((res) => {
          if (res.data.status == "success") {
            setHandlingList(res.data.data);
            if (k != null) setFixedPrice(res.data.data[0].repairPrice);
          } else if (res.data.status == "failed") {
            toast.error(res.data.message);
          } else if (res.data.status == "expired") {
            logout(res.data.message);
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      // If no product is selected, clear the repair list for the current row
      console.log(
        `No valid product selected for row ${index}, repair list cleared.`
      );
    }
    setHandlingList([]);
  };
  const isDuplicateCombination = (rows, category, product, repair, index) => {
    return rows.some(
      (row, i) =>
        i !== index &&
        row.category?.value === category?.value &&
        row.product?.value === product?.value &&
        row.repair?.value === repair?.value
    );
  };
  const handleWarrantyChange = (e) => {
    setWarranty(e);
    const newRows = [...rows];
    newRows.forEach((row) => {
      row.warranty = e.value; // Update the warranty value for each row
      row.ticket_id = location?.state?.ticket?.ticket_id;
    });
    setRows(newRows);
  };

  const handleQtyChange = (e, index) => {
    // const { value } = e.target;
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    setRows((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        qty: value,
      };
      return newData;
    });
    const newErrors = [...validationErrors];
    newErrors[index] = {
      ...newErrors[index],
      qty: value ? "" : "Please enter qty more than 0",
    };
    setValidationErrors(newErrors);
    // const newRows = [...rows];
    // const qty = parseInt(e.target.value, 10);

    // // Check if qty is a valid number
    // if (isNaN(qty)) {
    //   console.error("Invalid quantity:", e.target.value);
    //   return;
    // }

    // const row = newRows[index];

    // // Calculate amount safely
    // const amount = (row.price + row.serviceCharge) * qty;

    // // Check if amount is a number before applying toFixed
    // const formattedAmount = !isNaN(amount) ? amount.toFixed(2) : "0.00";

    // // Log values to debug
    // newRows[index].qty = qty;
    // newRows[index].amount = parseFloat(formattedAmount); // Convert back to number if necessary

    // setRows(newRows);
  };

  const handleOldSrChange = (e, index) => {
    const value = e.target.value.toUpperCase();

    setRows((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        old_serial_number: value, // Ensure the correct key is used
      };
      return newData;
    });
  };
  const handleNewSrChange = (e, index) => {
    const value = e.target.value.toUpperCase();

    setRows((prevData) => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        new_serial_number: value,
      };
      return newData;
    });
  };
  const addNewRow = () => {
    if (validateRows()) {
      setRows([
        ...rows,
        {
          category: "",
          product: "",
          qty: 1,
          price: "",
          serviceCharge: "",
          gst: "",
          amount: "",
        },
      ]);
      setProductList([]);
      setHandlingList([]);
    } else {
      toast.error(
        "Please complete Category, Product, and Repair of current row!"
      );
    }
  };

  const removeRow = (index) => {
    const newRows = rows.filter((row, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

  const validateRows = () => {
    const errors = rows.map((row) => ({
      category: !row.category ? "Category is required" : "",
      product: !row.product ? "Product is required" : "",
      repair: !row.repair ? "Repair is required" : "",
      handleRepair: !row.handleRepair ? "Repairhandle is required" : "",
      qty: row?.qty < 1 ? "Please enter qty more than 0" : "",
    }));

    setValidationErrors(errors);
    return errors.every(
      (error) =>
        !error.category &&
        !error.product &&
        !error.repair &&
        !error.qty &&
        !error.handleRepair
    );
  };
  const validateDesc = () => {
    if (description == null || description.trim() === "") {
      setError("Description is required.");
      return false;
    }
    setError("");
    return true;
  };
  const handleUpdate = () => {
    if (validateRows() && validateDesc()) generateRepair();

    // if (location?.state?.ticket?.warranty) {
    // if (validateRows()) {
    //   if (location?.state?.ticket?.warranty) {
    //     generateRepair();
    //   } else {
    //     switch (selectedOption) {
    //       case "UPI":
    //         toast.success("upi");
    //         break;
    //       case "Cash":
    //         generateRepair("Cash");
    //         break;
    //       case "HDFC Payment Gateway":
    //         toast.success("hdfc");
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // }
    // }
    //  else {
    //   toast.error("Please select warranty status.");
    // }
  };

  const filteredDataPurchase = rows?.filter(
    (item) => item.handleRepair?.value === "Purchase"
  );
  const filteredDataRepair = rows?.filter(
    (item) => item.handleRepair?.value === "Repair/Replace"
  );

  const calculateTotalAmount = () => {
    const totalAmount = rows.reduce((total, row) => {
      const productPrice = parseFloat(row?.product?.productPrice || 0);
      return total + productPrice * (row?.qty || 0);
    }, 0);

    return totalAmount.toFixed(4);
  };

  const discountAmount = () => {
    let discount = 0;
    if (warranty[0]?.value) {
      // console.log("in warranty");
      discount = 1; // 100% discount
    } else {
      discount = 0; // 0% discount
    }
    // Calculate the discounted total amount
    const discountedTotal = calculateTotalAmount() * discount;
    return discountedTotal.toFixed(4);
  };

  const totalSpareCostPurchase = () => {
    const total = filteredDataPurchase?.reduce((total, row) => {
      const productCost = row.qty * row.product.productPrice;
      const repairCost = row.repair.repairPrice || 0;
      const serviceCharge = row.serviceCharge || 0;
      const gst = row.gst || 0;

      return total + productCost;
    }, 0);

    return total?.toFixed(4);
  };

  // Calculate total labour cost for Purchase
  const totalLabourCostPurchase = () => {
    const total = filteredDataPurchase?.reduce(
      (total, row) =>
        total + (row?.repair?.repairServiceCharge * row?.qty || 0),
      0
    );
    return total?.toFixed(4);
  };

  const finalTotalPurchase = () => {
    const a = totalSpareCostPurchase();
    return a;
  };

  const totalSpareCostRepair = () => {
    const total = filteredDataRepair?.reduce((total, row) => {
      const productCost = row?.qty * row?.product?.productPrice;
      const repairCost = row?.repair?.repairPrice || 0; // Assuming repair price is 0 if not defined
      const serviceCharge = row?.serviceCharge || 0;
      const gst = row.gst || 0;

      return total + productCost;
    }, 0);

    return total?.toFixed(4);
  };

  // Calculate total labour cost for Purchase
  const totalLabourCostRepair = () => {
    const total = filteredDataRepair?.reduce(
      (total, row) =>
        total + (row?.repair?.repairServiceCharge * row?.qty || 0),
      0
    );
    return total?.toFixed(4);
  };
  const finalTotalRepair = () => {
    const a = totalSpareCostRepair();
    const b = totalLabourCostRepair();

    return a;
  };

  const calculateServiceCharge = () => {
    const service = rows.reduce(
      (total, row) => total + (row?.serviceCharge || 0) * (row?.qty || 0),
      0
    );
    return service.toFixed(4);
  };

  const calculateDifference = () => {
    const total1 = calculateTotalAmount();
    const total2 = finalTotalRepair();
    const Total = Math.abs(total1 - total2).toFixed(2);

    // Always return the absolute difference
    return Math.round(Total).toFixed(2);
  };

  const calculateOutWarranty = () => {
    // Get the totals
    const TotalAmount = calculateTotalAmount();
    const labourCost = calculateServiceCharge();

    // Calculate the total amount for out-of-warranty
    const totalOutWarranty = TotalAmount + labourCost - discountRec;
    return Math.round(totalOutWarranty || 0).toFixed(2); // Return the total formatted to 2 decimal places
  };

  const discountAmountWarranty = () => {
    // Get the totals
    const totalAmount = finalTotalRepair();
    const labourCost = calculateServiceCharge();    
    // Calculate the total amount for warranty
    const totalWarranty = parseFloat(totalAmount) + parseFloat(labourCost); // No discount for warranty cases
    const a = totalWarranty.toFixed(4);
    return a; // Return as float formatted to 2 decimal places
  };

  // console.log(rows, "new data");
  // console.log(filteredDataPurchase, "purchase", filteredDataRepair, "repair");
  // console.log(finalTotalPurchase(), "purchase total", finalTotalRepair(), "repair total");
  // console.log(calculateOutWarranty(), "calculateOutWarranty");
  // console.log(calculateServiceCharge(), "calculateServiceCharge");
  // console.log(discountAmountWarranty(), "discountAmountWarranty");

  const handleRepairing = (selectedOption, index) => {
    const newRows = [...rows];
    const product = handlingList?.find(
      (p) => p.value === rows[index]?.repair?.value
    );
    const serviceCharge = product ? product.repairServiceCharge : 0;
    newRows[index] = {
      ...newRows[index],
      handleRepair: selectedOption,
      serviceCharge: selectedOption?.value === "Purchase" ? 0 : serviceCharge,
    };
    setRows(newRows);

    const newErrors = [...validationErrors];
    newErrors[index] = {
      ...newErrors[index],
      handleRepair: selectedOption ? "" : "Repair handle is required",
    };
    setValidationErrors(newErrors);
  };

  const generateRepair = (data) => {
    setIsLoading(true);
    const transformedRows = rows.map((item) => {
      return {
        mode: data,
        job_description: description,
        discountRec: discountRec || null,
        discountRsn: discountRsn || null,
        warranty: location?.state?.ticket?.warranty,
        categoryValue: item?.category?.value,
        categoryLabel: item?.category?.label,
        productValue: item?.product?.value,
        productLabel: item?.product?.label,
        productPrice: item?.product?.productPrice,
        repairValue: item?.repair?.value,
        repairLabel: item?.repair?.label,
        repairCheckValue: item?.handleRepair?.value,
        repairCheckLabel: item?.handleRepair?.label,
        repairServiceCharge: item?.serviceCharge,
        repairTime: item?.repair?.repairTime,
        repairPrice: item?.repair?.repairPrice,
        repairGst: item?.repair?.repairGst,
        qty: item?.qty,
        price: item?.price,
        serviceCharge: item?.serviceCharge,
        gst: item?.gst,
        amount: item?.amount,
        ticket_id: location?.state?.ticket?.ticket_id,
        new_sr_no: item?.new_serial_number || "N/A",
        old_sr_no: item?.old_serial_number || "N/A",
        old_manufacturer_id: item?.old_manufacturer?.value || "N/A",
        new_manufacturer_id: item?.new_manufacturer?.value || "N/A",
      };
    });
    // console.log(rows,transformedRows,"-------------");
    // return false
    repairProductAPI(transformedRows, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate("/tickets");
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
          setIsLoading(false);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  //! This will enable full text view in react-select
  const customStyles = {
    singleValue: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
    }),
  };
  return (
    <>
      <Breadcrumbs mainTitle="Ticket Detail" parent="" title="Ticket Detail" />
      <Row>
        {/* <Col xxl={location?.state?.ticket?.status=='Closed'?'12':'8'} className="box-col-6 order-xxl-0 order-1"> */}
        <Col xxl={"12"} className="box-col-6 order-xxl-0 order-1">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center product-page-details">
                <H3>{item?.product_name}</H3>
                <span className="float-right">
                  Ticket ID : <b>{item?.ticket_id}</b>
                  <br></br>
                  Customer Name: <b>{item?.customer_name}</b>
                  <br></br>
                  Customer Mobile: <b>{item?.mobile}</b>
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <P>{item?.description}</P>
                  {item?.status == "Closed" ? (
                    <Select
                      className="react-select-container"
                      options={[
                        { value: false, label: "Out of Warranty" },
                        { value: true, label: "In warranty" },
                      ]}
                      value={warranty}
                      onChange={(e) => handleWarrantyChange(e)}
                      // required
                      isDisabled={
                        item?.warranty == false && item?.dstDate == null
                          ? false
                          : true
                      }
                    />
                  ) : (
                    <>
                      <Select
                        className="react-select-container"
                        options={[
                          { value: false, label: "Out of Warranty" },
                          { value: true, label: "In warranty" },
                        ]}
                        value={warranty}
                        onChange={(e) => handleWarrantyChange(e)}
                        // required
                        isDisabled={
                          item?.warranty == false && item?.dstDate == null
                            ? false
                            : true
                        }
                      />
                      {warranty == null ? (
                        <span
                          className="invalid"
                          style={{
                            color: "#e85347",
                            fontSize: "11px",
                            fontStyle: "italic",
                          }}
                        >
                          {warrantyMessage}
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
                <div>
                  <span
                    className={
                      item?.status == "Closed"
                        ? "badge badge-light-success"
                        : item?.status == "Open"
                        ? "badge badge-light-warning"
                        : "badge badge-light-primary"
                    }
                  >
                    {item?.status}
                  </span>
                </div>
              </div>

              {location?.state?.ticket?.status == "Closed" ? (
                <>
                <div className="my-div overflow-auto">
                  <table
                    className="table table-bordered table-scroll mt-3"
                    id="productTable"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Product</th>
                        <th scope="col">Repairing and Handling</th>
                        <th scope="col">Repair/Replace</th>
                        <th scope="col">Old Part Manufacturer</th>
                        <th scope="col">Old Part Sr.No.</th>
                        <th scope="col">New Part Manufacturer</th>
                        <th scope="col">New Part Sr.No.</th>
                        <th scope="col">Qty</th>
                        <th scope="col"> Unit Price</th>
                        <th scope="col">Labour Charge</th>
                        {/* <th scope="col">GST (%)</th> */}
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.ticketDetail?.map((item, index) => (
                        <>
                          <tr key={index}>
                            <td>{item?.categoryLabel}</td>
                            <td>{item?.productLabel}</td>
                            <td>{item?.repairLabel}</td>
                            <td>{item?.repairCheckLabel || "N/A"}</td>
                            <td>{item?.old_manufacture_name || "N/A"}</td>
                            <td>{item?.old_serial_number || "N/A"}</td>
                            <td>{item?.new_manufacture_name || "N/A"}</td>
                            <td>{item?.new_serial_number || "N/A"}</td>
                            <td>{item?.qty}</td>
                            <td>
                              {parseFloat(item?.productPrice)?.toFixed(4)}
                            </td>
                            <td>
                              {parseFloat(item?.serviceCharge)?.toFixed(4)}
                            </td>
                            <td>
                              {parseFloat(
                                item.qty * item?.productPrice
                              )?.toFixed(4)}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>  </div>
                  {warranty[0]?.value === false ? (
                    <Row>
                      <Col sm="6">
                        <div className="form-group">
                          <Label className="from-label" htmlFor="Discount">
                            Discount
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Enter discount."
                              type="text"
                              id="Discount"
                              className="form-control"
                              value={discountRec}
                              onChange={(e) => {
                                setDiscountRec(e.target.value);
                              }}
                              readOnly
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="form-group">
                          <Label className="from-label" htmlFor="DiscountRsn">
                            Discount Reason
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Enter discount reason."
                              type="text"
                              id="DiscountRsn"
                              className="form-control"
                              value={discountRsn}
                              onChange={(e) => {
                                setdiscountRsn(e.target.value);
                              }}
                              readOnly
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                  <Row>
                    <Col md="8">
                      <div className="form-group" style={{ marginTop: "32px" }}>
                        <Label className="from-label" htmlFor="description">
                          Description
                        </Label>
                        <div className="form-control-wrap">
                          <textarea
                            id="description"
                            className="form-control"
                            rows={5}
                            value={description}
                            // onChange={(e) => {
                            //   setDescription(e.target.value);
                            //   if (e.target.value.trim() === '') {
                            //     setError('Description is required.');
                            //   } else {
                            //     setError('');
                            //   }
                            // }}
                            readOnly
                            onChange={handleChange}
                          />
                        </div>
                        {error && (
                          <span
                            className="invalid"
                            style={{
                              color: "#e85347",
                              fontSize: "11px",
                              fontStyle: "italic",
                            }}
                          >
                            {error}
                          </span>
                        )}
                      </div>
                    </Col>
                    <Col md="4" className="mt-5">
                      <div>
                        <H6>Payment Summary</H6>
                        <table className="table table-striped">
                          <tbody>
                            <tr>
                              <td className="bold">Total Spare Cost</td>
                              <td>
                                <span>
                                  {" "}
                                  {RUPEES_SYMBOL} {calculateTotalAmount()}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="bold">Purchase Cost</td>
                              <td>
                                {RUPEES_SYMBOL}
                                {finalTotalPurchase()}
                              </td>
                            </tr>
                            <tr>
                              <td className="bold">Repair/Replace Cost </td>
                              <td>
                                {RUPEES_SYMBOL}
                                {finalTotalRepair()}
                              </td>
                            </tr>
                            <tr>
                              <td className="bold">Total Labour Charge</td>
                              <td>
                                <span>
                                  {" "}
                                  {RUPEES_SYMBOL} {calculateServiceCharge()}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="bold">Discount</td>
                              <td>
                                <span>
                                  {RUPEES_SYMBOL}
                                  {warranty[0]?.value
                                    ? discountAmountWarranty()
                                    : discountAmount()}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="bold">Additional Discount </td>
                              <td>
                                <span>
                                  {RUPEES_SYMBOL} {discountRec}{" "}
                                </span>
                              </td>
                            </tr>
                            {/* <tr>
                              <td className="bold">GST Amount </td>
                              <td>
                                <span>
                                  {RUPEES_SYMBOL} {discountRec}{" "}
                                </span>
                              </td>
                            </tr> */}
                            <tr>
                              <td>
                                <span className="font-weight-bold">
                                  Grand Total
                                </span>
                              </td>
                              <td>
                                <span className="font-weight-bold">
                                  {" "}
                                  {RUPEES_SYMBOL}
                                  {warranty[0]?.value
                                    ? calculateDifference()
                                    : calculateOutWarranty()}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                
                </>
              ) : (
                <>
                <div className="my-div overflow-auto">
                  <hr />
                  <table
                    className="table table-bordered table-scroll mt-3"
                    id="productTable"
                  >
                    <thead>
                      <tr>
                        <th scope="col " style={{ width: "150px" }}>
                          Category
                          <Required />
                        </th>
                        <th scope="col">
                          Product
                          <Required />
                        </th>
                        <th scope="col">
                          Repairing and Handling
                          <Required />
                        </th>
                        <th scope="col">
                          Repair/Replace
                          <Required />
                        </th>
                        <th scope="col">Old Manufacture</th>
                        <th scope="col">Old Part Sr.No.</th>
                        <th scope="col">New Manufacture</th>
                        <th scope="col">New Part Sr.No.</th>
                        <th scope="col">
                          Qty
                          <Required />
                        </th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Labour Charge</th>
                        <th scope="col">Amount</th>
                        <th scope="col">
                          <button
                            className="btn btn-info"
                            id="addProduct"
                            onClick={addNewRow}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            {/* <Select
                              id="category"
                              className={
                                validationErrors[index]?.category
                                  ? "is-invalid"
                                  : ""
                              }
                              options={categoryList}
                              value={row.category}
                              onChange={(e) => handleCategoryChange(e, index)}
                            /> */}
                            <Select
                              className={
                                validationErrors[index]?.category
                                  ? "is-invalid my-select-container"
                                  : "my-select-container"
                              }
                              options={categoryList}
                              value={row.category}
                              onChange={(e) => handleCategoryChange(e, index)}
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                            />

                            {validationErrors[index]?.category && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {validationErrors[index]?.category}
                              </span>
                            )}
                          </td>
                          <td>
                            <Select
                              className={
                                validationErrors[index]?.product
                                  ? "is-invalid my-select-container"
                                  : "my-select-container"
                              }
                              options={productList}
                              value={row.product}
                              onChange={(e) =>
                                handleProductChange(e, index, "buttonClick")
                              }
                              // styles={customStyles} //!this will enable full text view
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                            />
                            {validationErrors[index]?.product && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {validationErrors[index]?.product}
                              </span>
                            )}
                          </td>
                          <td>
                            <Select
                              className={
                                validationErrors[index]?.repair
                                  ? "is-invalid my-select-container"
                                  : "my-select-container"
                              }
                              options={handlingList}
                              value={row.repair}
                              onChange={(e) => handleRepairingChange(e, index)}
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                            />
                            {validationErrors[index]?.repair && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {validationErrors[index]?.repair}
                              </span>
                            )}
                          </td>
                          <td>
                            <Select
                              className={
                                validationErrors[index]?.handleRepair
                                  ? "is-invalid my-select-container"
                                  : "my-select-container"
                              }
                              options={productHandleList}
                              value={row.handleRepair}
                              onChange={(e) => handleRepairing(e, index)}
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                            />
                            {validationErrors[index]?.handleRepair && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {validationErrors[index]?.handleRepair}
                              </span>
                            )}
                          </td>
                          <td>
                            <Select
                              className="my-select-container"
                              options={manufacturerList}
                              value={row.old_manufacturer}
                              onChange={(e) => handleOldManufacturer(e, index)}
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.old_serial_number}
                              onChange={(e) => handleOldSrChange(e, index)}
                              // min="1"
                              className="form-control my-width"
                            />
                          </td>
                          <td>
                            <Select
                              options={manufacturerList}
                              value={row.new_manufacturer}
                              onChange={(e) => handleNewManufacturer(e, index)}
                              menuPortalTarget={document.body} // Render dropdown outside
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }), // Ensure dropdown is above other elements
                              }}
                              className="my-select-container"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.new_serial_number}
                              onChange={(e) => handleNewSrChange(e, index)}
                              // min="1"
                              className="form-control my-width"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              autoFocus
                              value={row.qty}
                              onChange={(e) => handleQtyChange(e, index)}
                              className="form-control my-width"
                              pattern="\d*"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Replace non-digit characters, including the decimal point
                              }}
                            />
                            {validationErrors[index]?.qty && (
                              <span className="invalid">
                                {validationErrors[index]?.qty}
                              </span>
                            )}
                          </td>
                          <td>{row?.product?.productPrice || 0}</td>
                          <td>{row.serviceCharge || 0}</td>
                          <td>
                            {(
                              parseFloat(row?.product?.productPrice || 0) *
                              row?.qty
                            ).toFixed(4) || 0}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger remove"
                              onClick={() => removeRow(index)}
                            >
                              <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  {warranty[0]?.value === false ? (
                    <Row>
                      <Col sm="6">
                        <div className="form-group">
                          <Label className="from-label" htmlFor="Discount">
                            Discount
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Enter discount."
                              type="text"
                              id="Discount"
                              className="form-control"
                              value={discountRec}
                              onChange={(e) => {
                                setDiscountRec(e.target.value);
                              }}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="form-group">
                          <Label className="from-label" htmlFor="DiscountRsn">
                            Discount Reason
                          </Label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Enter discount reason."
                              type="text"
                              id="DiscountRsn"
                              className="form-control"
                              value={discountRsn}
                              onChange={(e) => {
                                setdiscountRsn(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
               
                </>
              )}

              <Row>
                <Col md="8">
                  {item?.status == "Closed" ? null : (
                    <div className="form-group" style={{ marginTop: "32px" }}>
                      <Label className="from-label" htmlFor="description">
                        Description <Required />
                      </Label>
                      <div className="form-control-wrap">
                        <textarea
                          id="description"
                          className="form-control"
                          rows={5}
                          value={description}
                          // onChange={(e) => {
                          //   setDescription(e.target.value);
                          //   if (e.target.value.trim() === '') {
                          //     setError('Description is required.');
                          //   } else {
                          //     setError('');
                          //   }
                          // }}
                          onChange={handleChange}
                        />
                      </div>
                      {error && (
                        <span
                          className="invalid"
                          style={{
                            color: "#e85347",
                            fontSize: "11px",
                            fontStyle: "italic",
                          }}
                        >
                          {error}
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "50px;" }}
                  >
                    {item?.status == "Closed" ? (
                      <>
                        {/* <Button
                          className="m-r-10 m-t-10"
                          onClick={() =>
                            handleClosedTicketPrint(
                              location?.state?.ticket,
                              fixedPrice
                            )
                          }
                        >
                          <i className="fa fa-print me-1"></i>
                          Print
                        </Button> */}
                      </>
                    ) : (
                      <>
                        {item?.status == "Open" ? (
                          <Link
                            to={"/chat"}
                            state={{ state: location?.state?.ticket }}
                          >
                            <Button color="primary" className="m-r-10 m-t-10">
                              <i className="fa fa-comments me-1"></i>
                              Chat
                            </Button>
                          </Link>
                        ) : null}
                      </>
                    )}
                    {item?.status == "Closed" ? null : (
                      <div className="">
                        <>
                          <Button
                            color="success"
                            onClick={() => handleUpdate()}
                            className="m-t-10"
                            disabled={isLoading || rows.length == []}
                          >
                            {isLoading ? (
                              <Spinner size="sm" color="light" />
                            ) : (
                              <>
                                <i className="fa fa-address-card-o me-1"></i>
                                {"Create Job Card"}
                              </>
                            )}
                          </Button>
                        </>
                      </div>
                    )}
                  </div>
                </Col>

                {item?.status == "Closed" ? null : (
                  <Col md="4" className="mt-5">
                    <div>
                      <H6>Payment Summary</H6>

                      <table className="table table-striped ">
                        <tbody>
                          <tr>
                            <td className="bold">Total Spare Cost</td>
                            <td>
                              <span>
                                {" "}
                                {RUPEES_SYMBOL} {calculateTotalAmount()}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Purchase Cost</td>
                            <td>
                              {RUPEES_SYMBOL} {finalTotalPurchase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Repair/Replace Cost </td>
                            <td>
                              {RUPEES_SYMBOL} {finalTotalRepair()}
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Total Labour Charge</td>
                            <td>
                              <span>
                                {" "}
                                {RUPEES_SYMBOL} {calculateServiceCharge()}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Discount</td>
                            <td>
                              <span>
                                {RUPEES_SYMBOL}{" "}
                                {/* { discountAmount()} {" "} */}
                                {warranty[0]?.value
                                  ? discountAmountWarranty()
                                  : discountAmount()}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Additional Discount </td>
                            <td>
                              <span>
                                {RUPEES_SYMBOL} {discountRec}{" "}
                              </span>
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="bold">GST Amount</td>

                            <td>{ 0}</td>

                          </tr> */}
                          <tr>
                            <td>
                              <span className="font-weight-bold">
                                Grand Total
                              </span>
                            </td>
                            <td>
                              <span className="font-weight-bold">
                                {RUPEES_SYMBOL}{" "}
                                {warranty[0]?.value
                                  ? calculateDifference()
                                  : calculateOutWarranty()}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TicketDetail;
