import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
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
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { productListAPI } from "../../api/dropdowns";
import { orderDetails, updateOrder, updatePartial, updateReceived } from "../../api/user";
import useLogout from "../../util/useLogout";
import DataTable from "react-data-table-component";
import { RUPEES_SYMBOL } from "../../Constant";
import { ValidateImg, ValidateImgPdf } from "../../util/myFunction";
import { FaFilePdf, FaRegImage } from "react-icons/fa";
import ModalComponent from "../../CommonElements/ModalImg/ModalComponent";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import AddInventoryModal from "../../Components/MyComponents/Modal/AddInventoryModal";
import Required from "../../Components/MyComponents/Required";


const orderOption = { value: "alimco", label: "ALIMCO" };

const UpdatePurchase = () => {
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [previewInvoiceImage, setPreviewInvoiceImage] = useState(null);
  const [invoiceImage, setInvoiceImage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false)
  const [partsData, setPartsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [dpsdate, setDpsDate] = useState(new Date());
  const [paymentStatus, setPaymentStatus] = useState([]);
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const [data, setData] = useState([]);
  const [dataU, setDataU] = useState([]);
  const [status, setStatus] = useState([]);
  const orderStatusOptions = [
    { value: "Created", label: "Created" },
    ...(userDetail?.user_type == "AC" && status === "Ordered" ? [{ value: "Received", label: "Received" }] : []),
    ...(userDetail?.user_type !== "AC" ? [{ value: "Ordered", label: "Dispatch" }] : []),
    ...(userDetail?.user_type == "AC" && status === "Ordered" ? [{ value: "Partial-Close", label: "Partial Close" }] : []),
  ];
  const orderStatusAdmin = [
    ...((userDetail?.user_type == "A" || userDetail?.user_type == "S") && data?.order?.payment_status === "Paid" ? [] : [{ value: "Created", label: "Created" }]),
    ...((userDetail?.user_type == "A" || userDetail?.user_type == "S") && data?.order?.payment_status === "Paid" ? [{ value: "Ordered", label: "Dispatch" }] : []),
  ];
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    control,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [],
      gst: 0,
      discount: 0,
      shipping: 0,
      gstAmount: 0,
      // orderStatus: orderStatusOptions[0],
      notes: "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const base_url = localStorage.getItem("base_url");
  const [modalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);
  const [titleName, setTitleName] = useState("");
  const [fileType, setFileType] = useState("");

  const handleImageClick = (index, image, inputName, fileType) => {
    setCurrentImageIndex(index);
    // setModalImages([image]);
    // toggleImageModal();
    setTitleName(inputName);
    setFileType(fileType)
    setFileType(fileType);

    if (fileType === 'pdf') {
      setModalImages([image]); // Here, 'file' could be the URL or Blob of the PDF
    } else {
      setModalImages([image]); // Here, 'file' could be the URL of the image
    }

    toggleImageModal();
  };
  const toggleImageModal = () => {
    setModalOpen(true);
    // setModalImages(null)
  };
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    // setModalImages(null)
  };
  const toggleConfirmModal = () => {
    setConfirmModalOpen(!isConfirmModalOpen);
  };
  const onClose = () => {
    setConfirmModalOpen(!isConfirmModalOpen);
  };
  const getFileTypeFromUrl = (url) => {
    const fileExtension = url.split('.').pop().split(/#|\?/)[0];
    return fileExtension.toLowerCase();
  };

  const renderContent = (fileType, fileUrl) => {
    const lowerCaseFileType = fileType.toLowerCase();
    if (['png', 'jpg', 'jpeg', "jfif"].includes(lowerCaseFileType)) {
      return (
        <>
          <Button
            outline
            // className="mt-2"
            id="img"
            color="primary"
            type="button"
            onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
            size="sm"
          >
            <FaRegImage style={{ height: '1rem', width: '1rem' }} />
          </Button>
          <ToolTip id="img" name={"Invoice/Bilti"} option={"top"} />
        </>
      );
    } else if (lowerCaseFileType === 'pdf') {
      return (
        <>
          <Button
            outline
            id="pdf"
            color="danger"
            type="button"
            // className="mt-2"
            onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
            size="sm"
          >
            <FaFilePdf style={{ height: '1rem', width: '1rem' }} />
          </Button>
          <ToolTip id="pdf" name={"Invoice/Bilti"} option={"top"} />
        </>

      );
    }
    return null;
  };

  const watchProducts = watch("products");
  const watchOrderTax = watch("gst");
  const watchDiscount = watch("discount");
  const watchShipping = watch("shipping");
  const params = useParams()
  useEffect(() => {
    const id = params?.id;
    const data = { order_id: id };
    fetchList(data);

  }, [location]);
  const [typeList, setTypeList] = useState([{ value: "rtu", label: "RTU" }]);


  const fetchList = async (data) => {
    try {
      const response = await orderDetails(data);
      if (response.data.status === "success") {
        setPaymentStatus(response?.data.data.order.payment);
        const formattedOrderData = response.data.data.order.orderData.map((item) => ({
          id: item.id,
          label: item.item_name,
          itemPrice: item.price,
          itemUnitPrice: item.itemUnitPrice,
          qty: item.quantity,
          gst: item.gstDetails,
          subtotal: (item.price * item.quantity).toFixed(2),
        }));
        setData(response?.data?.data);
        setValue("gst", response?.data?.data?.order?.gst);
        setValue("discount", response?.data?.data?.order?.discount);
        setValue("shipping", response?.data?.data?.order?.shipping_charges);
        setStatus(response?.data?.data?.order?.order_status);
        const validOrderStatus = (userDetail?.user_type === "A" || userDetail?.user_type === "S") ? orderStatusAdmin.find(
          (option) => option.value === response?.data?.data?.order?.order_status
        )?.value : orderStatusOptions.find(
          (option) => option.value === response?.data?.data?.order?.order_status
        )?.value;
        // setValue("orderStatus", validOrderStatus);
        setStartDate(response?.data?.data?.order?.order_date)
        setValue("notes", response?.data?.data?.order?.notes);
        setValue("dps_value", response?.data?.data?.order?.dps_value);
        setValue("dps_number", response?.data?.data?.order?.dps_no);
        setDpsDate(response?.data?.data?.order?.dps_date == null || response?.data?.data?.order?.dps_date == 'null' ? dpsdate : response?.data?.data?.order?.dps_date);
        setValue("products", formattedOrderData);

        const newValue = response.data.data.order.type || null;
        const newLabel = response.data.data.order.type_label || null;
        setTypeList([{ value: newValue, label: newLabel }]);
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productListAPI();
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setPartsData(response.data.data.partsData);
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const orderTaxValue = parseFloat(watchOrderTax) || 0;
    const discountValue = parseFloat(watchDiscount) || 0;
    const shippingValue = parseFloat(watchShipping) || 0;
    let subtotal = watchProducts.reduce((acc, product) => {
      const itemPrice = parseFloat(product.itemPrice) || 0;
      const qty = parseFloat(product.qty) || 0;
      return acc + itemPrice * qty;
    }, 0);
    let subtotalgst = watchProducts.reduce((acc, product) => {
      const qty = parseFloat(product.qty) || 0;
      const gst = parseFloat(product.itemUnitPrice * qty - product.itemPrice* qty) || 0;
      return acc + gst;
    }, 0);
    let grandGst = parseFloat(subtotalgst).toFixed(4);
    console.log(grandGst,"gst");
    let orderTax = (orderTaxValue / 100) * subtotal;
    let grandTotal = subtotal + subtotalgst + orderTax + shippingValue - discountValue ;
    setValue("subtotal", subtotal);
    setValue("orderTaxAmount", orderTax);
    setValue("grandTotal", grandTotal);
    setValue("gstAmount", grandGst);
  }, [watchProducts, watchOrderTax, watch("gst"), watchDiscount, watchShipping, setValue]);

  const handleProductSelect = (selectedOption) => {
    if (selectedOption) {
      const productExists = partsData.find(
        (product) => product.value === selectedOption.value
      );
      if (productExists) {
        const productIndex = watchProducts.findIndex(
          (product) => product.value === productExists.value
        );
        if (productIndex !== -1) {
          const newQty = watchProducts[productIndex].qty + 1;
          update(productIndex, {
            ...watchProducts[productIndex],
            qty: newQty,
            subtotal: (productExists.itemPrice * newQty).toFixed(2),
          });
        } else {
          append({
            ...productExists,
            qty: 1,
            subtotal: (productExists.itemPrice * 1).toFixed(2),
          });
        }
        setSelectedProduct(null);
      } else {
        alert("Selected product is not available.");
      }
    }
  };
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  
  const handleQtyChange = (index, value) => {
    const qty = Math.max(0, parseFloat(value) || 0);
    const products = [...watchProducts];
    const itemPrice = parseFloat(products[index].itemPrice) || 0;
    products[index].qty = qty;
    products[index].subtotal = (itemPrice * qty).toFixed(2);
    setValue("products", products);
  };
  const handleDeleteProduct = (index) => {
    remove(index);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      ValidateImgPdf(file, (isValid) => {
        if (isValid) {
          // Process the valid image
          setPreviewImage(file);
          trigger("fileUpload");
          clearErrors("fileUpload");
        } else {
          // Handle the invalid file type
          setError("fileUpload", { type: 'manual', message: 'Invalid file type. Only PNG, JPEG, and Pdf files are allowed.' });
          e.target.value = '';  // Clear the input
        }
      });
    } else {
      setPreviewImage("");
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const file = files[0];
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      ValidateImg(file, (isValid) => {
        if (isValid) {
          // Process the valid image
          setPreviewInvoiceImage(imageUrls);
          setInvoiceImage(files)
          trigger("invoiceUpload");
          clearErrors("invoiceUpload");
        } else {
          // Handle the invalid file type
          setError("invoiceUpload", { type: 'manual', message: 'Invalid file type. Only PNG,and JPEG files are allowed.' });
          // console.error("Invalid file type. Only PNG, JPEG, and Pdf files are allowed.");
          e.target.value = '';  // Clear the input
        }
      });
    } else {
      setPreviewInvoiceImage("");
    }
  };

  const partialUpdate = async () => {
    // Check if any object in the array has qty equal to 0
    const hasQtyZero = fields.some((item) => item.qty === 0);
    if (hasQtyZero) {
      return;
    }
    // console.log("partial close", location?.state?.product);
    const id = location?.state?.product?.id;
    const aasra_id = location?.state?.product?.aasra_id;
    dataU.order_id = id;
    dataU.aasra_id = aasra_id;
    dataU.date = startDate;
    dataU.invoiceDate = invoiceDate;
    const formData1 = new FormData();
    // Append basic fields to formData
    formData1.append("order_id", id);
    formData1.append("aasra_id", aasra_id);
    formData1.append("date", startDate);
    formData1.append("invoice_date", invoiceDate);
    formData1.append("invoice_no", dataU?.invoice_number);
    // Append supplier name
    if (location?.state?.product?.type === "rtu") {
      formData1.append("type_value", location?.state?.product?.type || 0);
      formData1.append("type_label", location?.state?.product?.type_label || 0);
    }
    formData1.append("orderStatus", location?.state?.product?.order_status);
    formData1.append("supplier_name", 'Alimco');
    formData1.append("supplier_value", 'alimco');
    // Append file upload (assuming single file input)
    // if (dataU.invoiceUpload && dataU?.invoiceUpload[0]) {
    //   formData1.append("invoiceImg", dataU?.invoiceUpload[0] || null);
    // } else {
    //   formData1.append("invoiceImg", null);
    // }
    // Append products array
    dataU.products.forEach((product, index) => {
      formData1.append(`products[${index}][value]`, product?.id);
      formData1.append(`products[${index}][id]`, product?.value);
      formData1.append(`products[${index}][label]`, product.label);
      formData1.append(`products[${index}][itemPrice]`, parseFloat(product.itemPrice).toFixed(2));
      formData1.append(`products[${index}][qty]`, product.qty);
      formData1.append(`products[${index}][itemUnitPrice]`, product.itemUnitPrice);
      formData1.append(`products[${index}][gst]`, (parseFloat((product.itemUnitPrice)* product.qty - (product.itemPrice* product.qty))).toFixed(4));
      formData1.append(`products[${index}][subtotal]`, parseFloat(product.subtotal).toFixed(2));
    });
    invoiceImage?.forEach((image, index) => {
      formData1.append(`invoice_copy`, image);
    })
    // console.log(dataU, "ppp")
    // return false ;
    setIsLoading(true);
    if ((userDetail?.user_type === "A" || userDetail?.user_type === "S") && location?.state?.product?.order_status == "Partial-Close") {
      try {

        const response = await updatePartial(formData1, tokenHeader);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          setConfirmModalOpen(false)
          navigate(`${process.env.PUBLIC_URL}/purchase/all-purchase`);
        } else if (response.data.status === "failed") {
          toast.error(response.data.message);

        } else if (response.data.status === "expired") {
          logout(response.data.message);
        }
        setIsLoading(false)
      } catch (err) {
        console.log("Error", err.message);
      }
    } else {
      try {
        const response = await updateReceived(formData1, tokenHeader);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          setConfirmModalOpen(false)
          navigate(`${process.env.PUBLIC_URL}/purchase/all-purchase`);
        } else if (response.data.status === "failed") {
          toast.error(response.data.message);
        } else if (response.data.status === "expired") {
          logout(response.data.message);
        }
        setIsLoading(false)
      } catch (err) {
        console.log("Error", err.message);
      }
    }


  }

  const updatePurchase = async (data) => {
    // Check if any object in the array has qty equal to 0
    const hasQtyZero = fields.some((item) => item.qty === 0);
    if (hasQtyZero) {
      return;
    }
    const id = params?.id;
    const aasra_id = location?.state?.product?.aasra_id;
    data.order_id = id;
    data.aasra_id = aasra_id;
    data.date = startDate;
    data.dps_date = dpsdate || null;
    data.type = typeList;
    data.invoiceDate = invoiceDate || null;
    const formData = new FormData();
    // Append basic fields to formData
    formData.append("order_id", id);
    formData.append("aasra_id", aasra_id);
    formData.append("date", startDate);
    if (typeList.length > 0) {
      formData.append("type_value", typeList[0].value || 0);
      formData.append("type_label", typeList[0].label || 0);
    }
    formData.append("dpsDate", dpsdate);
    formData.append("dpsValue", data?.dps_value || "");
    formData.append("dpsNo", data?.dps_number || "");
    formData.append("discount", parseFloat(data?.discount || 0).toFixed(2));
    formData.append("shipping", parseFloat(data?.shipping || 0).toFixed(2));
    formData.append("gst", parseFloat(data.gst || 0).toFixed(4));
    formData.append("gstAmount", parseFloat(data.gstAmount || 0).toFixed(4));
    formData.append("orderTaxAmount", parseFloat(data.orderTaxAmount || 0).toFixed(4));
    formData.append("grandTotal", parseFloat(data.grandTotal || 0).toFixed(4));
    formData.append("subtotal", parseFloat(data.subtotal || 0).toFixed(4));
    formData.append("notes", data?.notes || "");
    // Append order status
    formData.append("orderStatus", data?.orderStatus);
    // Append supplier name
    formData.append("supplier_name", 'Alimco');
    formData.append("supplier_value", 'alimco');
    // Append file upload (assuming single file input)
    if (data.fileUpload && data?.fileUpload[0]) {
      formData.append("image", data?.fileUpload[0] || null);
    } else {
      formData.append("image", null);
    }
    if (data.invoiceUpload && data?.invoiceUpload[0]) {
      formData.append("invoiceImg", data?.invoiceUpload[0] || null);
    } else {
      formData.append("invoiceImg", null);
    }
    // Append products array
    data.products.forEach((product, index) => {
      formData.append(`products[${index}][value]`, product?.id);
      formData.append(`products[${index}][id]`, product?.value);
      formData.append(`products[${index}][label]`, product.label);
      formData.append(`products[${index}][itemPrice]`, parseFloat(product.itemPrice).toFixed(2));
      formData.append(`products[${index}][qty]`, product.qty);
      formData.append(`products[${index}][itemUnitPrice]`, product.itemUnitPrice);
      formData.append(`products[${index}][gst]`, (parseFloat((product.itemUnitPrice) * product.qty - (product.itemPrice * product.qty))).toFixed(4));
      formData.append(`products[${index}][subtotal]`, parseFloat(product.subtotal).toFixed(2));
    });

    // Log formData contents for debugging
    console.log("Form Data Contents:", formData,"data",data);
    // formData.forEach((value, key) => {
    //     console.log(key, value);
    // });
    // return false
    setIsLoading(true)
    try {
      const response = await updateOrder(formData, tokenHeader);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        navigate(`${process.env.PUBLIC_URL}/purchase/all-purchase`);
      } else if (response.data.status === "failed") {
        toast.error(response.data.message);
      } else if (response.data.status === "expired") {
        logout(response.data.message);
      }
      setIsLoading(false)
    } catch (err) {
      console.log("Error", err.message);
    }
  }

  const updateFF = async (data) => {
    if ((userDetail?.user_type === "A" || userDetail?.user_type === "S") && (location?.state?.product?.order_status == "Partial-Close" || location?.state?.product?.order_status == "Received")) {
      setConfirmModalOpen(!isConfirmModalOpen);
      setDataU(data)
    } else {
      updatePurchase(data)
    }
  };

  const qtyColumn = {
    name: "Qty",
    cell: (row, index) => {
      const isAC = userDetail?.user_type === "AC";
      const isAorS = userDetail?.user_type === "A" || userDetail?.user_type === "S";
      const isPurchaseOrder = data?.order?.payment?.purchase_order;
      const isOrdered = data?.order?.order_status === "Ordered";
      const isPartialClose = data?.order?.order_status === "Partial-Close";
      const isCreated = data?.order?.order_status === "Created";
      const isPaid = data?.order?.payment_status === "Paid";
      const isPending = data?.order?.payment_status === "Pending";
  
      const shouldDisableInput =
        (isAC && isPurchaseOrder) ||
        (isAorS && isOrdered) ||
        (isAorS && isPurchaseOrder && (!isPartialClose && isPaid || isCreated) && !(isPending && isCreated));
  
      const canEditQty =
        (!isAC && isAorS && isPurchaseOrder && (isPartialClose || (isCreated && isPending))) ||
        (!isAC && isAorS && isPartialClose);
  
      return (
        // <input
        //   type="text"
        //   value={row.qty}
        //   onChange={(e) => handleQtyChange(index, e.target.value)}
        //   min="1"
        //   onInput={(e) => {
        //     e.target.value = e.target.value.replace(/[^0-9]/g, "");
        //   }}
          
        //   disabled={shouldDisableInput}
        // />
        <div>
        <input
          style={{
            width: "auto",
            borderColor: row.qty === 0 ? "red" : "", // Highlight border if qty is 0
          }}
          type="text"
          autoFocus
          value={row.qty}
          onChange={(e) => handleQtyChange(index, e.target.value)}
          min="0"
          pattern="\d*"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          disabled={shouldDisableInput}
        />
        {row.qty === 0 && (
          <div className="invalid mt-2">Please enter qty more than 0</div>
        )}{" "}
      </div>
      );
    },
    width:'190px'
  };

  const columns = [
    { name: "Product", selector: (row) => row.label, sortable: true, wrap: true },
    { name: "Price", selector: (row) => `${RUPEES_SYMBOL}${row.itemPrice}`, sortable: true },
//     ...((userDetail?.user_type === "AC" && data?.order?.payment?.purchase_order === true) || ((userDetail?.user_type === "A" || userDetail?.user_type === "S") && data?.order?.order_status === "Ordered"  )  ?
//       [
//         {
//           name: "Qty",
//           cell: (row, index) => (
//             <input
//               type="text"
//               value={row.qty}
//               onChange={(e) => handleQtyChange(index, e.target.value)}
//               min="1"
//               onInput={(e) => {
//                 e.target.value = e.target.value.replace(
//                   /[^0-9]/g,
//                   ""
//                 );
//               }}
//               disabled
//             />
//           )
//         }
//       ] : []
//     ),
//     ...((userDetail?.user_type === "AC" || userDetail?.user_type === "A" || userDetail?.user_type === "S") && data?.order?.payment?.purchase_order === false ?
//       [
//         {
//           name: "Qty",
//           cell: (row, index) => (
//             <input
//               type="text"
//               value={row.qty}
//               onChange={(e) => handleQtyChange(index, e.target.value)}
//               min="1"
//               onInput={(e) => {
//                 e.target.value = e.target.value.replace(
//                   /[^0-9]/g,
//                   ""
//                 );
//               }}
//             />
//           )
//         }
//       ] : []
//     ),
//     ...(((userDetail?.user_type === "A" || userDetail?.user_type === "S") && data?.order?.payment?.purchase_order === true && ( !data?.order?.order_status === "Partial-Close"
//      && data?.order?.payment_status === "Paid" || data?.order?.order_status === "Created")) ?
//     [
//       {
//         name: "Qty",
//         cell: (row, index) => (
//           <input
//             type="text"
//             value={row.qty}
//             onChange={(e) => handleQtyChange(index, e.target.value)}
//             min="1"
//             onInput={(e) => {
//               e.target.value = e.target.value.replace(
//                 /[^0-9]/g,
//                 ""
//               );
//             }}
//             disabled={data?.order?.payment_status === "Pending" && data?.order?.order_status === "Created" ? false :true}
//           />
//         )
//       }
//     ] : []
//   ),
//   ...(((userDetail?.user_type === "A" || userDetail?.user_type === "S") && (data?.order?.order_status === "Partial-Close")) ?
//   [
//     {
//       name: "Qty",
//       cell: (row, index) => (
//         <input
//           type="text"
//           value={row.qty}
//           onChange={(e) => handleQtyChange(index, e.target.value)}
//           min="1"
//           onInput={(e) => {
//             e.target.value = e.target.value.replace(
//               /[^0-9]/g,
//               ""
//             );
//           }}
//         />
//       )
//     }
//   ] : []
// ),
qtyColumn,
    { name: "Subtotal", selector: (row) => `${RUPEES_SYMBOL}${(parseFloat(row?.subtotal)).toFixed(4)}`, sortable: true },
    {
      name: "GST Amount",
      selector: (row) => (parseFloat((row.itemUnitPrice)* row.qty - (row.itemPrice* row.qty))).toFixed(4),
      sortable: true,
      width: '100px'
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <Button
          outline
          color={`danger`}
          size={`xs`}
          onClick={() => handleDeleteProduct(index)}
          disabled={(userDetail?.user_type === "A" || userDetail?.user_type === "S") && !data?.order?.order_status === "Partial-Close" || data?.order?.payment_status == "Paid"}
        >
          {" "}
          <i className="fa fa-trash"></i>
        </Button>
      ),
    },
  ];


  return (
    <>
      <Breadcrumbs
        mainTitle="Update Purchase "
        parent="Update Purchase"
        title="Update Purchase"
      />
      <Container fluid={true}>
        <Form onSubmit={handleSubmit(updateFF)}>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="date">
                      Date
                    </label>
                    <DatePicker
                      className="form-control"
                      selected={new Date(startDate || null)}
                      onChange={(date) => setStartDate(date)}
                      dateFormat={"dd/MM/yyy"}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="supplier_name">
                      Supplier
                    </label>
                    <Select
                      options={orderOption}
                      defaultValue={orderOption}
                      isDisabled
                    />
                    {errors.supplier_name && (
                      <p className="text-danger">
                        {errors.supplier_name.message}
                      </p>
                    )}
                  </div>
                  {
                    data?.order?.type === "rtu" ?
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="type">
                          Type
                        </label>
                        <Select
                          className="select"
                          options={typeList}
                          defaultValue={typeList}
                          isDisabled
                        />
                      </div> : null
                  }

                  {isLoading || data?.order?.image == null ? null : <div className="col-md-4">
                    <label className="form-label" htmlFor="invoice_bilti">
                      Invoice /Bilti
                    </label>
                    {renderContent(getFileTypeFromUrl(`${base_url}/${data?.order?.image}`), `${base_url}/${data?.order?.image}`)}
                  </div>}
                </Row>
                <Row>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="product">
                      Product
                    </label>
                    <Select
                      options={partsData}
                      value={selectedProduct}
                      onChange={handleProductSelect}
                      isClearable
                      placeholder="Search and add product"
                      isDisabled={(userDetail?.user_type === "A" || userDetail?.user_type === "S") && data?.order?.order_status === "Partial-Close" || data?.order?.payment_status == "Paid"}
                    />
                  </div>
                </Row>
                <Row className="mt-5">
                  <DataTable
                    columns={columns} data={watchProducts}
                    // pagination
                    responsive={true}
                    striped={true}
                    highlightOnHover={true}
                    // paginationRowsPerPageOptions={[25, 50, 100, 500]}
                    // paginationPerPage={25}
                    persistTableHead
                  />
                </Row>
                {(userDetail?.user_type === "A" || userDetail?.user_type === "S") && (location?.state?.product?.order_status == "Partial-Close" || location?.state?.product?.order_status == "Received") ?
                  <>
                    <Row className="mt-4">
                      <Col md="9">
                        <Row >
                          <div className="col-md-4">
                            <label className="form-label" htmlFor="dps_date">
                              Invoice Date
                            </label>
                            <DatePicker
                              className="form-control"
                              selected={new Date(invoiceDate || null)}
                              onChange={(date) => setInvoiceDate(date)}
                              dateFormat={"dd/MM/yyy"}
                              showMonthDropdown
                              showYearDropdown
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label" htmlFor="invoice_number">
                              Invoice Number <Required/>
                            </label>
                            <Input
                              type="text"
                              {...register("invoice_number", {
                                required: "Invoice number is  required.",
                                pattern: {
                                  value: /^[1-9][0-9]/,
                                  message:
                                    "Invoice Number must be a Number",
                                },
                              })}
                              onChange={(e) => {
                                setValue("invoice_number", e.target.value);
                                trigger("invoice_number")
                              }}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              value={watch("invoice_number")}
                            />
                            {errors.invoice_number && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {errors.invoice_number.message}
                              </span>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label" htmlFor="invoiceUpload">
                              Invoice Copy (Image) <Required/>
                            </label>
                            <input
                              type="file"
                              multiple
                              accept="image/* "
                              className="form-control"
                              id="invoiceUpload"
                              {...register("invoiceUpload", {
                                required: "Image file is required",
                              })}
                              onChange={handleImageUpload}
                            />
                            {errors.invoiceUpload && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {errors.invoiceUpload.message}
                              </span>
                            )}
                          </div>
                        </Row>
                      </Col>
                    </Row>
                    <Button className="mt-3" type="submit" color="primary" disabled={isLoading}>

                      {isLoading ? <Spinner size="sm" color="light" /> : location?.state?.product?.order_status == "Partial-Close" ? "Add To Inventory" : 'Update'}
                    </Button>
                  </>
                  :
                  <>
                    <Row className="mt-4">
                      <Col md="8">
                        <Row >
                          <div className={userDetail?.user_type === "AC" ? "col-md-6 col-lg-6" : "col-md-6 col-lg-4"}>
                            <Label className="form-label" htmlFor="orderStatus">
                              Order Status <Required/>
                              <span
                                className={
                                  status === "Received"
                                    ? "badge badge-light-success"
                                    : status === "Pending"
                                      ? "badge badge-light-warning"
                                      : "badge badge-light-primary"
                                }
                              >
                                {status === "Ordered" ? "Dispatch" : status}
                              </span>
                            </Label>

                            <Select
                              options={userDetail?.user_type === "A" || userDetail?.user_type === "S" ? orderStatusAdmin : orderStatusOptions}
                              {...register("orderStatus", {
                                required: "Order Status is required."
                              })}
                              // value={orderStatusOptions.find(option => option.value === watch("orderStatus"))}
                              // value={userDetail?.user_type === "A" || userDetail?.user_type === "S" ? orderStatusAdmin.find(option => option.value === watch("orderStatus")) : orderStatusOptions.find(option => option.value === watch("orderStatus"))}
                              onChange={(selectedOption) => {
                                setValue("orderStatus", selectedOption.value);
                                trigger("orderStatus")
                              }}
                            />
                            {errors.orderStatus && (
                              <span
                                className="invalid"
                                style={{
                                  color: "#e85347",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                {errors.orderStatus.message}
                              </span>
                            )}
                          </div>
                          {userDetail?.user_type === "A" || userDetail?.user_type === "S" ? (
                            <>
                              {/* <div className="col-md-2">
                            <label className="form-label" htmlFor="gst">
                              GST
                            </label>
                            <Input
                              type="text"
                              id="gst"
                              {...register("gst", {
                                // required: "GST percent is required",
                                pattern: {
                                  // value: /^([1-9]|[0-9]|25)\.\d{2}$/,
                                  value: /^([1-9]|[0-9]|25)\.?[0-9]{0,2}$/,
                                  message:
                                    "GST Percent shouldn't greater than 25 & 2 digits after decimal.",
                                },
                                min: {
                                  value: 0,
                                  message: "Value must be between 0 and 25.",
                                },
                                max: {
                                  value: 25,
                                  message: "Value must be between 0 and 25.",
                                },
                                valueAsNumber: true
                              })}
                              value={watch("gst")}
                              onChange={(e) => {
                                setValue("gst", e.target.value || 0);
                                trigger("gst");
                              }}

                              disabled={data?.order?.payment_status ==="Paid" ? true : false}
                              min="0"
                            />
                            {errors.gst && (
                              <span
                                className="invalid"
                              >
                                {errors?.gst?.message}
                              </span>
                            )}
                          </div> */}

                              <div className="col-md-6 col-lg-4">
                                <Label className="form-label" htmlFor="discount">
                                  Discount <Required/>
                                </Label>
                                <Input
                                  type="text"
                                  {...register("discount", {
                                    pattern: {
                                      value: /^[0-9]/,
                                      message:
                                        "Discount must be a number",
                                    },
                                  })}
                                  readOnly
                                  value={watch("discount")}
                                  onChange={(e) => {
                                    setValue("discount", e.target.value);
                                    trigger("discount");
                                  }}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                  }}
                                  disabled={data?.order?.payment_status === "Paid" ? true : false}
                                />
                                {errors.discount && (
                                  <span
                                    className="invalid"
                                  
                                  >
                                    {errors.discount.message}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6 col-lg-4" >
                                <Label className="form-label" htmlFor="shipping">
                                  Shipping <Required/>
                                </Label>
                                <Input
                                  type="text"
                                  {...register("shipping", {
                                    pattern: {
                                      value: /^[0-9]/,
                                      message:
                                        "Shipping must be a number",
                                    },
                                  })}
                                  readOnly
                                  value={watch("shipping")} onChange={(e) => {
                                    setValue("shipping", e.target.value);
                                    trigger("shipping");
                                  }}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                  }}
                                  disabled={data?.order?.payment_status === "Paid" ? true : false}
                                />
                                {errors.shipping && (
                                  <span
                                    className="invalid"
                                  >
                                    {errors.shipping.message}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : null}
                          {/* </Row>
                    <Row> */}
                          {(userDetail?.user_type == "A" || userDetail?.user_type == "S") && (data?.order?.payment_status === "Paid" || data?.order?.order_status == "Received") ? (
                            <>
                              <div className="col-md-6 col-lg-4">
                                <Label className="form-label" htmlFor="dps_date">
                                  DPS Date<Required/>
                                </Label>
                                <DatePicker
                                  className="form-control"
                                  selected={new Date(dpsdate || null)}
                                  onChange={(date) => setDpsDate(date)}
                                  dateFormat={"dd/MM/yyy"}
                                  showMonthDropdown
                                  showYearDropdown
                                />
                              </div>
                              <div className="col-md-6 col-lg-4">
                                <Label className="form-label" htmlFor="dps_number">
                                  DPS Number<Required/>
                                </Label>
                                <Input
                                  type="text"
                                  {...register("dps_number", {
                                    required: "dps number is required.",
                                    pattern: {
                                      value: /^[1-9][0-9]/,
                                      message:
                                        "DPS Number must be valid DPS number",
                                    },
                                  })}
                                  onChange={(e) => {
                                    setValue("dps_number", e.target.value || "");
                                    trigger("dps_number")
                                  }}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                  }}
                                  value={watch("dps_number")}
                                />
                                {errors.dps_number && (
                                  <span
                                    className="invalid"

                                  >
                                    {errors.dps_number.message}
                                  </span>
                                )}
                              </div>
                              <div className="col-md-6 col-lg-4">
                                <label className="form-label" htmlFor="dps_value">
                                  DPS Value<Required/>
                                </label>
                                <Input
                                  type="text"

                                  {...register("dps_value", {
                                    required: "dps value is required",
                                    pattern: {
                                      value: /^[1-9][0-9]/,
                                      message:
                                        " DPS Value must be a number",
                                    },
                                  })}
                                  onChange={(e) => {
                                    setValue("dps_value", e.target.value || "");
                                    trigger("dps_value")
                                  }}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                  }}
                                  value={watch("dps_value")}
                                />
                                {errors.dps_value && (
                                  <span
                                    className="invalid"
                                  
                                  >
                                    {errors.dps_value.message}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : null}
                          {userDetail?.user_type == "AC" && paymentStatus?.invoice ? (
                            <div className="col-md-6 col-lg-6">
                              <label className="form-label" htmlFor="fileUpload">
                                Upload File (Image or PDF) <Required/>
                              </label>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="form-control"
                                id="fileUpload"
                                {...register("fileUpload", {
                                  required: "Image file is required",
                                })}
                                onChange={handleImageChange}
                              />
                              {errors.fileUpload && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.fileUpload.message}
                                </span>
                              )}
                            </div>
                          ) : null}

                        </Row>
                        <div className="col-md-12">
                          <label className="form-label" htmlFor="notes">
                            Notes
                          </label>
                          <Input
                            type="textarea"
                            {...register("notes")}
                            value={watch("notes")}
                            onChange={(e) => {
                              setValue("notes", e.target.value);
                            }}
                          />
                        </div>
                      </Col>
                      <Col md="4">
                        <div className=" mt-4">
                          <table className="table table-striped ">
                            <tbody>
                              <tr>
                                <td className="bold">Sub Total</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL}{" "}
                                    {parseFloat(watch("subtotal") || 0.00).toFixed(
                                      4
                                    )}
                                  </span>
                                </td>
                              </tr>
                              {/* <tr>
                            <td className="bold">GST</td>
                            <td>
                              <span>
                                {RUPEES_SYMBOL}{" "}
                                {parseFloat(watch("orderTaxAmount") || 0.00).toFixed(
                                  2
                                )}{" "}({watch("gst")}%)
                              </span>
                            </td>
                          </tr> */}
                              <tr>
                                <td className="bold">Discount</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL} {parseFloat(watch("discount") || 0).toFixed(4)}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="bold">Shipping</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL} {parseFloat(watch("shipping") || 0).toFixed(4)}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="bold">GST Amount</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL} {parseFloat(watch("gstAmount") || 0).toFixed(4)}
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
                                    {RUPEES_SYMBOL}
                                    {parseFloat(Math.round(watch("grandTotal")) || 0).toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                    <Button className="mt-3" type="submit" color="primary" disabled={isLoading}>
                      {isLoading ? <Spinner size="sm" color="light" /> : 'Update'}
                    </Button>
                  </>
                }


              </CardBody>
            </Card>
          </Col>
        </Form>
      </Container>
      <ModalComponent
        fileType={fileType}
        titleName={titleName}
        isOpen={modalOpen}
        toggleModal={toggleModal}
        images={modalImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />
      <AddInventoryModal
        isOpen={isConfirmModalOpen}
        onClose={partialUpdate}
        toggle={toggleConfirmModal}
      />
    </>
  );
};

export default UpdatePurchase;
