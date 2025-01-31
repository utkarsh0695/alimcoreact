import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Label,
  Row
} from "reactstrap";
import { Breadcrumbs, H3, H6 } from "../../AbstractElements";
import {
  productWiseRepairListAPI
} from "../../api/dropdowns";
import { listCategoryMasterAPI } from "../../api/master";
import { CategorywiseRTOListAPI, CreateSalesRTOApi } from "../../api/Sales";
import { ticketDetailAPI, ticketDropdown } from "../../api/user";
import { RUPEES_SYMBOL } from "../../Constant";
import useLogout from "../../util/useLogout";
import Required from "../../Components/MyComponents/Required";
import { validateEmail, validateINMobile } from "my-field-validator";

const Sales = () => {
  const {
    register,
    trigger,
    setValue,
    watch,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
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
  const [gstNo, setGstNo] = useState(null); // State for GST number
  const [gstPercent, setGstPercent] = useState(null); // State for GST percent
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
  const [rsnError, serRsnError] = useState("");
  const [manufacturerList, setManufacturerList] = useState([]);
  const [new_manufacturer, setNewmanufacturer] = useState([
    { value: "Lenavo", label: "Power" },
    { value: "DC", label: "Bolt" },
  ]);
  const [aasraData, setAasraData] = useState([]);
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState(null);

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
      qty: 0,
      price: 0,
      gst: 0,
      amount: 0,
    },
  ]);
  const ticketDetail = async () => {
    const ticket_id = location?.state?.ticket?.ticket_id;
    if (!ticket_id) {
      return;
    }
    const body = { ticket_id };
    try {
      const res = await ticketDetailAPI(body);
      if (res?.data?.status === "success") {
        const mappedRows = res?.data?.data?.tableData?.ticketDetail.map(
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
            // handleRepair: {
            //   value: item.repairCheckValue,
            //   label: item.repairCheckLabel,
            // },
            // old_manufacturer: {
            //   value: item.old_manufacturer_id,
            //   label: item.old_manufacture_name,
            // },
            new_manufacturer: {
              value: item.new_manufacturer_id,
              label: item.new_manufacture_name,
            },
            // old_serial_number: item.old_serial_number,
            new_serial_number: item.new_serial_number,
            // repair_time: item.repairTime,
            qty: item.qty,
            price: item.price,
            // serviceCharge: item.serviceCharge,
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
        setItem(res?.data?.data?.tableData);
        setRows(mappedRows);
        setDescription(res?.data?.data?.tableData?.job_description);
      } else {
        console.log("Error in response", res.data);
      }
    } catch (err) {
      console.log("Error fetching ticket detail", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    trigger('description');

    // Validate the input here
    if (!value) {
      setError("Description is required.");
    } else if (/^[a-zA-Z0-9./, ]+$/.test(value)) {
      setError("");
    } else {
      setError("Description can only contain letters, numbers, spaces, and the characters . , /");
    }
  };



  const handlediscountRsnChange = (e) => {
    const discountValue = watch("discount"); // Get the discount value
    setReason(e.target.value);

    // If discount is entered and the reason is empty, show the error
    if (discountValue && e.target.value.trim() === "") {
      serRsnError("Reason is required when discount is entered.");
    } else {
      serRsnError(""); // Clear error if reason is valid
    }
  };

  const listCategory = () => {
    listCategoryMasterAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          let a = res.data.data.data
            .filter((item) => item.category_name === "RTU")
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
      new_serial_number: null,
      qty: null,
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
      CategorywiseRTOListAPI(body, tokenHeader)
        .then((res) => {
          if (res.data.status === "success") {
            setProductList(res.data.data.productData);
            // Assuming GST number comes with the product data
            if (res?.data?.data?.gstno.length > 0) {
              setGstNo(res.data.data.gstno);
              setGstPercent(18);
            }
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

  // Now checking GST No and setting GST Percent
  // useEffect(() => {
  //   // Check if GST number is present
  //   if (gstNo && gstNo.trim() !== "") {
  //     setGstPercent(18);
  //   } else {
  //     setGstPercent(null); // Or any default value
  //   }
  // }, [gstNo]);

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

    // Set product and clear specific fields
    newRows[index] = {
      ...newRows[index],
      product: e,
      repair: null,
      handleRepair: null,
      old_manufacturer: null,
      new_manufacturer: null,
      old_serial_number: null,
      new_serial_number: "", // Set to blank
      qty: null, // Set to blank
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



  const inputRef = useRef([]);
  const handleQtyChange = (e, index) => {
      // const { value } = e.target;
      const value = Math.max(0, parseFloat(e.target.value) || 0); // Ensure qty is non-negative
      setRows((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          qty: value,
        };
        return newData;
      });
  
      // setRows(newRows);
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
          qty: 0,
          price: "",
          gst: "",
          amount: "",
        },
      ]);
      setProductList([]);
      setHandlingList([]);
    } else {
      toast.error(
        "Please fill Category, Product, and Qty of current row!"
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
      qty:row?.qty<1 ? "Please enter qty more than 0":"",
      // repair: !row.repair ? "Repair is required" : "",
      // handleRepair: !row.handleRepair ? "Repairhandle is required" : "",
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
    // if (validateRows() && validateDesc()) generatesales();
    // Validate the rows
    if (!validateRows()) {
      return;
    }
    if (validateDesc()) {
      generatesales();
    }

    // if (location?.state?.ticket?.warranty) {
    // if (validateRows()) {
    //   if (location?.state?.ticket?.warranty) {
    //     generatesales();
    //   } else {
    //     switch (selectedOption) {
    //       case "UPI":
    //         toast.success("upi");
    //         break;
    //       case "Cash":
    //         generatesales("Cash");
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

    return parseFloat(totalAmount.toFixed(2));
  };

  const discountAmount = () => {
    let discount = 0;
    if (warranty[0]?.value) {
      discount = 1; // 100% discount
    } else {
      discount = 0; // 0% discount
    }
    // Calculate the discounted total amount
    const discountedTotal = calculateTotalAmount() * discount;
    return parseFloat(discountedTotal.toFixed(2));
  };

  const totalSpareCostPurchase = () => {
    const total = filteredDataPurchase?.reduce((total, row) => {
      const productCost = row.qty * row.product.productPrice;
      const repairCost = row.repair.repairPrice || 0;
      const serviceCharge = row.serviceCharge || 0;
      const gst = row.gst || 0;

      return total + productCost;
    }, 0);

    return total?.toFixed(2);
  };

  // Calculate total labour cost for Purchase
  const totalLabourCostPurchase = () => {
    const total = filteredDataPurchase?.reduce(
      (total, row) =>
        total + (row?.repair?.repairServiceCharge * row?.qty || 0),
      0
    );
    return total?.toFixed(2);
  };

  const finalTotalPurchase = () => {
    const a = totalSpareCostPurchase();
    return parseFloat(a);
  };

  const totalSpareCostRepair = () => {
    const total = filteredDataRepair?.reduce((total, row) => {
      const productCost = row?.qty * row?.product?.productPrice;
      const repairCost = row?.repair?.repairPrice || 0; // Assuming repair price is 0 if not defined
      const serviceCharge = row?.serviceCharge || 0;
      const gst = row.gst || 0;

      return total + productCost;
    }, 0);

    return total?.toFixed(2);
  };

  // Calculate total labour cost for Purchase
  const totalLabourCostRepair = () => {
    const total = filteredDataRepair?.reduce(
      (total, row) =>
        total + (row?.repair?.repairServiceCharge * row?.qty || 0),
      0
    );
    return total?.toFixed(2);
  };
  const finalTotalRepair = () => {
    const a = totalSpareCostRepair();
    const b = totalLabourCostRepair();

    return parseFloat(a);
  };

  const calculateServiceCharge = () => {
    const service = rows.reduce(
      (total, row) => total + (row?.serviceCharge || 0) * (row?.qty || 0),
      0
    );
    return parseFloat(service.toFixed(2));
  };
  const calculateDifference = () => {
    const total1 = calculateTotalAmount();
    const total2 = finalTotalRepair();

    // Always return the absolute difference
    const difference = Math.abs(total1 - total2).toFixed(2);

    // Calculate the total including GST
    const totalWithGST = calculateGST(parseFloat(difference));

    return totalWithGST.toFixed(2); // Return the total including GST, formatted to 2 decimal places
  };

  const calculateOutWarranty = () => {
    // Get the totals
    const TotalAmount = calculateTotalAmount();
    const labourCost = calculateServiceCharge();

    // Calculate the total amount for out-of-warranty
    const totalOutWarranty = TotalAmount + labourCost;

    // Calculate the total including GST
    const totalWithGST = calculateGST(totalOutWarranty);

    return totalWithGST.toFixed(2); // Return the total including GST, formatted to 2 decimal places
  };

  const discountAmountWarranty = () => {
    // Get the totals
    const totalAmount = finalTotalRepair();
    const labourCost = calculateServiceCharge();

    // Calculate the total amount for warranty
    const totalWarranty = totalAmount + labourCost; // No discount for warranty cases

    return parseFloat(totalWarranty.toFixed(2)); // Return as float formatted to 2 decimal places
  };


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

  const generatesales = (data) => {
    // Extract form field values using watch from react-hook-form
    const name = watch("name");
    const mobile_no = watch("mobile_no");
    const email = watch("email");
    const address = watch("address");
    //   const gstNo = watch("gstNo");

    // Calculate total amounts
    const totalSpareCost = calculateTotalAmount();
    const gstAmount = warranty[0]?.value
      ? calculateDifference()
      : calculateOutWarranty();
    const grandTotal = warranty[0]?.value
      ? (parseFloat(calculateDifference()) + totalSpareCost).toFixed(2)
      : (parseFloat(calculateOutWarranty()) + totalSpareCost).toFixed(2);

    // Transform rows and include form field values
    const transformedRows = rows.map((item) => {
      const rowAmount = (
        parseFloat(item?.product?.productPrice || 0) * (item?.qty || 1)
      ).toFixed(2);

      const gstRowAmount = warranty[0]?.value
        ? calculateGST(calculateDifference()).gstAmount
        : calculateGST(calculateOutWarranty()).gstAmount;

      return {
        mode: data,
        job_description: description,
        categoryValue: item?.category?.value,
        categoryLabel: item?.category?.label,
        productValue: item?.product?.value,
        productLabel: item?.product?.label,
        unitPrice: item?.product?.productPrice,
        repairPrice: item?.repair?.repairPrice,
        qty: item?.qty,
        basePrice: item?.product?.basePrice,
        gst: gstRowAmount, // Add calculated GST here
        amount: rowAmount, // Use calculated row amount for each row
        newPart_sr_no: item?.new_serial_number || "N/A",
        new_manufacturer_id: item?.new_manufacturer?.value || "N/A",
      };
    });


    // Prepare request data
    const requestData = {
      name,
      mobile_no,
      email,
      address,
      totalSpareCost,
      gstAmount,
      grandTotal,
      gstPercent: gstPercent,
      items: transformedRows, // Include transformedRows
    };

    // If GST percentage is set, include it in requestData
    // if (gstPercent !== null) {
    //   requestData.gstPercent = gstPercent;
    // }

    // return false
    setIsLoading(true); // Set loading state to true
    // Hit the API
    CreateSalesRTOApi(requestData, tokenHeader)
      .then((res) => {
        setIsLoading(false); // Set loading to false immediately after getting response
        if (res.data.status === "success") {
          toast.success(res.data.message);
          // Optionally navigate to another page
          navigate("/sales/sales-list");
        } else if (res.data.status === "failed") {
          toast.error(res.data.message);
        } else if (res.data.status === "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false); // Ensure loading is set to false on error
        console.log("err", err);
      });
  };

  // Function to calculate 18% GST
  const calculateGST = (grandTotal) => {
    const gstPercentage = gstPercent;

    const gstAmount = (grandTotal * gstPercentage) / 100;
    const totalWithGST = grandTotal + gstAmount;
    return totalWithGST, gstAmount;
  };

  return (
    <>
      <Breadcrumbs mainTitle="Sales" parent="Sales" title="Create Sell" />
      <Row>
        <Col xxl={"12"} className="box-col-6 order-xxl-0 order-1">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center product-page-details">
                <H3>Sales</H3>
              </div>
              <>
                <hr />
                <Row>
                  <Col md="3">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Name <Required /></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Enter  Name"
                        {...register("name", {
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 characters",
                          },
                          required: "Name is required.",

                          pattern: {
                            value: /^[A-Za-z\s]*$/,
                            message: "Enter only alphabetic characters",
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                        }}
                      />
                      {errors.name && (
                        <span className="invalid">{errors?.name?.message}</span>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <label htmlFor="mobile" className="form-label">Mobile<Required /></label>
                    {/* <input type="text" id="mobile" name="mobile" /> */}
                    <div className="form-control-wrap">
                      <input
                        placeholder="Enter Mobile Number"
                        type="text"
                        id="mobile_no"
                        {...register("mobile_no", {
                          required: "Mobile Number is  required.",
                          validate: {
                            isValid: (value) =>
                         validateINMobile(value) || "Enter a valid 10-digit Indian mobile number starting with 6-9",
                        },
                        })}
                        className="form-control"
                        value={watch("mobile_no")}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setValue("mobile_no", e.target.value);
                          trigger("mobile_no");
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          e.target.value = e.target.value
                            .replace(/[^0-9]/g, "")
                            .slice(0, 10);
                        }}
                      />
                      {errors.mobile_no && (
                        <span className="invalid">
                          {errors?.mobile_no?.message}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <label htmlFor="fax-email" className="form-label">Email<Required /></label>
                    {/* <input
                              type="text"
                              id="fax-email"
                              name="fax-email"
                            /> */}
                    <div className="form-control-wrap">
                      <input
                        placeholder="Enter Email"
                        type="text"
                        id="email"
                        {...register("email", {
                          required: "Email is  required.",
                          validate: {
                            isValid: (value) =>
                              validateEmail(value) ||
                              "Enter valid email.",
                          },
                        })}
                        className="form-control"
                        value={watch("email")}
                        onChange={(e) => {
                          setValue("email", e.target.value);
                          trigger("email");
                        }}
                      />
                      {errors.email && (
                        <span className="invalid">
                          {errors?.email?.message}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <label htmlFor="address" className="form-label">Address<Required /></label>
                    {/* <input type="text" id="address" name="address" /> */}
                    <div className="form-control-wrap">
                      <input
                        placeholder="Enter Address "
                        type="text"
                        id="address"
                        {...register("address", {
                          required: "Address is  required.",
                          pattern: {
                            value: /^[a-zA-Z0-9.,/_( ) -]+$/,
                            message: "Only alphanumeric characters and [ , . / - _ ( )] are allowed."
                          }
                        })}
                        className="form-control"
                        value={watch("address")}
                        onChange={(e) => {
                          setValue("address", e.target.value);
                          trigger("address");
                        }}
                      />
                      {errors.address && (
                        <span className="invalid">
                          {errors?.address?.message}
                        </span>
                      )}
                    </div>
                  </Col>
                </Row>
        
                <div className="overflow-auto">
                <table
                  className="table table-bordered mt-5 "
                  id="productTable"
                >
                  <thead>
                    <tr>
                      <th scope="col">Category <Required /></th>
                      <th scope="col">Product<Required /></th>
                      <th scope="col">New Manufacture</th>
                      <th scope="col">New Part Sr.No.</th>
                      <th scope="col">Qty<Required /></th>
                      <th scope="col">Price</th>
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
                          <Select
                            id="category"
                            className={
                              validationErrors[index]?.category
                                ? "is-invalid"
                                : ""
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
                             
                            >
                              {validationErrors[index]?.product}
                            </span>
                          )}
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
                        <td className="my-width">
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
                            <span
                              className="invalid"
                             
                            >
                              {validationErrors[index]?.qty}
                            </span>
                          )}
                        </td>
                        <td>{row?.product?.productPrice || 0}</td>
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
             
              </>
              <>
                <Row>
                  <Col md="8">
                    {item?.status == "Closed" ? null : (
                      <div className="form-group" style={{ marginTop: "32px" }}>
                        <Label className="from-label" htmlFor="description">
                          Description <Required />
                        </Label>
                        <div className="form-control-wrap">
                          <textarea
                            type="text"
                            id="description"
                            rows={5}
                            value={description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="form-control"
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
                      style={{ marginTop: "50px" }}
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
                          {/* {item?.status == "Open" ? (
                          <Link
                            to={"/chat"}
                            state={{ state: location?.state?.ticket }}
                          >
                            <Button color="primary" className="m-r-10 m-t-10">
                              <i className="fa fa-comments me-1"></i>
                              Chat
                            </Button>
                          </Link>
                        ) : null} */}
                        </>
                      )}
                      {item?.status == "Closed" ? null : (
                        <div className="">
                          <>
                            <Button
                              color="primary"
                              onClick={handleSubmit((data) =>
                                handleUpdate(data)
                              )}
                              className="m-t-10"
                            // disabled={isLoading || rows.length === 0}
                            >
                              {/* {isLoading ? (
                                <Spinner size="sm" color="light" />
                              ) : ( */}
                              <>
                                Submit
                              </>
                              {/* )} */}
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

                        <table className="table table-striped table-sm">
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
                              <td className="bold">GST(18%) Amount</td>
                              <td>
                                <span>
                                  {" "}
                                  {RUPEES_SYMBOL}{" "}
                                  {warranty[0]?.value
                                    ? calculateDifference()
                                    : calculateOutWarranty()}
                                </span>
                              </td>
                            </tr>
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
                                    ? (
                                      parseFloat(calculateDifference()) +
                                      calculateTotalAmount()
                                    ).toFixed(2)
                                    : (
                                      parseFloat(calculateOutWarranty()) +
                                      calculateTotalAmount()
                                    ).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  )}
                </Row>
              </>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Sales;
