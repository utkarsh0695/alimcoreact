import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Button, Container } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DropdownCommon from "../../Components/Common/Component/DropdownCommon";
import PaymentModal from "../../Components/Common/ModalForm";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { getOrderListAPI } from "../../api/aasra";
import useLogout from "../../util/useLogout";
import { FaFilePdf, FaRegImage } from "react-icons/fa";
import ModalComponent from "../../CommonElements/ModalImg/ModalComponent";
import { downloaadPdf, downloadCredit } from "../../util/myPrint";
import PaymentSummaryModal from "../../Components/MyComponents/Modal/PaymentSummaryModal";
import { RUPEES_SYMBOL } from "../../Constant";

import usePreventBackNavigation from "../Razorpay/usePreventBackNavigation";

const AllPurchase = () => {
  usePreventBackNavigation();
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(true);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymetSummary, setShowPaymetSummary] = useState(false);
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const base_url = localStorage.getItem("base_url");

  const isAdminn =
    user?.user_type === "A" ||
    user?.user_type === "S" ||
    user?.user_type === "AC";

  const [photoImg, setPhotoImg] = useState([]);
  const [signatureImg, setSignatureImg] = useState([]);
  const [orderData, setOrder] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [aasraData, setAasraData] = useState([]);
  const [data, setData] = useState([]);

  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);
  const [titleName, setTitleName] = useState("");
  const [fileType, setFileType] = useState("");
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  // const DailyDropdown = [
  //   { icon: "fa fa-info", name: "Purchase Details" },
  //   { icon: "fa fa-pencil", name: "Edit Purchase" },
  //   // { icon: "fa fa-undo", name: "Purchase Return" },
  //   // { icon: "fa fa-money", name: "Show Payments" },
  //   { icon: "fa fa-plus", name: "Create Payments" },
  //   { icon: "fa fa-file-pdf-o", name: "Download Pdf" },
  //   // { icon: "fa fa-envelope", name: "Email Notification" },
  //   // { icon: "fa fa-comment-o", name: "SMS Notification" },
  //   // { icon: "fa fa-trash-o", name: "Delete Purchase" },
  // ];

  // Filter options based on user role
  // const filteredDropdown = isAdminn ? DailyDropdown.filter(option => ["Purchase Details", "Edit Purchase"].includes(option.name)) : DailyDropdown;

  // const filteredDropdown = (row, isAdminn) => {
  //   console.log(isAdminn, "admin");
  //   let options = [];
  //   if (isAdminn == true) {
  //     options.push({ icon: "fa fa-info", name: "Purchase Details" });
  //     if (
  //       (row.order_status === "Created" ||
  //         row.order_status === "Created" ||
  //         row.order_status === "received") &&
  //       row.payment_status === "paid"
  //     ) {
  //       options.push({ icon: "fa fa-file-pdf-o", name: "Download Pdf" });
  //     } else if (
  //       row.order_status === "Pending" &&
  //       row.payment_status === "pending"
  //     ) {
  //       options.push({ icon: "fa fa-pencil", name: "Edit Purchase" });
  //       options.push({ icon: "fa fa-file-pdf-o", name: "Download Pdf" });
  //       // options.push({ icon: "fa fa-plus", name: "Create Payments" });
  //     }
  //   } else {
  //     if (
  //       (row.order_status === "created" ||
  //         row.order_status === "Created" ||
  //         row.order_status === "received") &&
  //       row.payment_status === "paid"
  //     ) {
  //       options.push({ icon: "fa fa-info", name: "Purchase Details" });
  //     } else if (
  //       row.order_status === "Pending" &&
  //       row.payment_status === "pending"
  //     ) {
  //       options.push({ icon: "fa fa-pencil", name: "Edit Purchase" });
  //       options.push({ icon: "fa fa-plus", name: "Create Payments" });
  //     }
  //   }

  //   return options;
  // };

  const DailyDropdown = [
    { icon: "fa fa-info", name: "Purchase Detail" },
    { icon: "fa fa-pencil", name: "Edit Purchase" },
    { icon: "fa fa-file-pdf-o", name: "Download Pdf" },
    { icon: "fa fa-sticky-note-o", name: "Download Credit Note" },
    { icon: "fa fa-plus", name: "Create Payment" },
    { icon: "fa fa-inr", name: "Payment Summary" },
  ];

  var allowedOptions = [];
  // Filter options based on conditions
  const filteredDropdown = (row) => {
    if (user?.user_type === "A" || user?.user_type === "S") {
      allowedOptions = [
        "Purchase Detail",
        row?.payment?.invoice ? "Download Pdf" : null,
        row?.payment_status == "Pending" && row?.payment?.PO_number.length > 1
          ? "Create Payment"
          : null,
        row?.payment_status == "Paid" ? "Payment Summary" : null,
        row?.invoice_no?.length > 0 ? "Download Credit Note" : null,
        row?.order_status == "Received" ||
        row?.order_status == "close" ||
        row?.invoice_no?.length > 0 ||
        row?.stock_transfer == true
          ? null
          : "Edit Purchase",
      ];
      //   allowedOptions = [
      //     "Purchase Details",
      //     row.payment.invoice ? "Download Pdf" : null,
      //     row.payment_status === "Paid" ? null : "Create Payments",
      //     row.order_status === "Received" ? null : "Edit Purchase"
      //   ].filter(Boolean); // Filter out null values
      // }
    } else if (user?.user_type === "AC") {
      allowedOptions = [
        "Purchase Detail",
        row?.payment?.invoice || row?.underWarranty == "UnderWarranty"
          ? "Download Pdf"
          : null,
        row?.payment_status == "Paid" ||
        (!row?.payment?.purchase_order && !row?.payment?.invoice) ||
        row?.underWarranty == "UnderWarranty"
          ? null
          : "Create Payment",
        row?.payment_status == "Paid" ? "Payment Summary" : null,
        (row?.payment?.PO_number == "0" || row?.order_status == "Ordered") &&
        row?.underWarranty === null
          ? "Edit Purchase"
          : (row?.underWarranty === "UnderWarranty" &&
              row?.payment_status === "Success") ||
            row?.order_status == "Received" ||
            row?.order_status == "close" ||
            row?.underWarranty == "UnderWarranty" ||
            row?.invoice_no?.length > 0 ||
            !row?.payment?.PO_number?.length < 1
          ? "null"
          : "null1",
        // (row?.payment?.PO_number=='0' || row?.order_status=="Ordered") &&(row?.underWarranty==="UnderWarranty" &&row?.payment_status==="Success")?"Edit Purchase":"mat dekho",
        // row?.order_status == "Received" || row?.order_status == "close" || row?.underWarranty == "UnderWarranty" || row?.invoice_no?.length > 0 ||
        //   !row?.payment?.PO_number.length < 1 || !row?.order_status == "Ordered" ? null : (row?.payment?.PO_number.length > 1 || row?.order_status == "Ordered") ? "Edit Purchase" : null,
      ];
    }
    // if (isAdmin==true) {
    //   allowedOptions = ["Purchase Details"];
    //   allowedOptions = ["Download Pdf"];
    //   allowedOptions = ["Create Payments"];
    //   allowedOptions = ["Edit Purchase"];
    //   if (
    //     (row.order_status === "Closed" ||
    //       row.order_status === "Partial Closed")
    //   ) {
    //     allowedOptions = ["Download Pdf"];
    //   } else if (
    //     row.order_status === "Pending" ||
    //     row.payment_status === "Created"
    //   ) {
    //     allowedOptions = ["Edit Purchase"];
    //   }
    // } else {

    // }
    return DailyDropdown.filter((option) =>
      allowedOptions.includes(option.name)
    );
  };

  const navigate = useNavigate();
  const handleDropdownSelect = (item, row) => {
    switch (item?.name) {
      case "Create Payment":
        setCurrentRowData(row);
        setShowPaymentModal(true);
        break;
      case "Purchase Detail":
        navigate(`${process.env.PUBLIC_URL}/purchase/details/${row.id}`, {
          state: { product: row, payments: row.payments?.[0]?.purchase_order },
        });
        break;
      case "Edit Purchase": // Add this case
        if (row?.underWarranty == "UnderWarranty") {
          navigate(`${process.env.PUBLIC_URL}/purchase/under-warranty`, {
            state: { product: row, mode: "edit" },
          });
        } else {
          navigate(`${process.env.PUBLIC_URL}/purchase/update/${row.id}`, {
            state: { product: row, mode: "update" },
          });
        }
        break;
      case "Payment Summary":
        setCurrentRowData(row);
        setShowPaymetSummary(true);
        break;
      case "Download Pdf":
        downloaadPdf(
          row,
          row?.orderData,
          row?.aasra,
          row?.payment,
          row?.grand_total,
          row?.sgst,
          row?.cgst,
          row?.gst,
          row?.total_bill,
          row?.total_tax,
          row?.shipping_charges,
          row?.discount
        );
        break;
      case "Download Credit Note":
        downloadCredit(row);
        break;

      default:
        return null;
    }
    // if (item.name === "Create Payments") {
    //   setCurrentRowData(row);
    //   setShowPaymentModal(true);
    // }else if (item.name === "Purchase Details"){
    //   navigate(`${process.env.PUBLIC_URL}/purchase/details/${row.id}`,
    //     {
    //       state: { product: row }
    //     }
    //   )
    // }
  };

  const getFileTypeFromUrl = (url) => {
    const fileExtension = url.split(".").pop().split(/#|\?/)[0];
    return fileExtension.toLowerCase();
  };

  const renderContent = (fileType, fileUrl) => {
    const lowerCaseFileType = fileType.toLowerCase();

    if (["png", "jpg", "jpeg", "jfif"].includes(lowerCaseFileType)) {
      return (
        <>
          <Button
            outline
            id="pdf"
            color="primary"
            type="button"
            onClick={() =>
              handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)
            }
            size="sm"
          >
            <FaRegImage style={{ height: "1rem", width: "1rem" }} />
          </Button>
          {/* <img
          src={fileUrl}
          alt="file"
          onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
          style={{ width: 80, height: 40, cursor: 'pointer' }}
        /> */}
        </>
      );
    } else if (lowerCaseFileType === "pdf") {
      return (
        <Button
          outline
          id="pdf"
          color="danger"
          type="button"
          onClick={() =>
            handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)
          }
          size="sm"
        >
          <FaFilePdf style={{ height: "1rem", width: "1rem" }} />
        </Button>
      );
    }
    return null;
  };

  const [tableColPurchase, setColPurchases] = useState([
    {
      name: "Supplier",
      selector: (row) => row.supplier_name,
      sortable: true,
      hide: 370,
      width: "150px",
    },
    ...(user?.user_type == "A" || user?.user_type == "S"
      ? [
          {
            name: "Aasra",
            selector: (row) => row.aasra?.name_of_org, // Replace with the appropriate field

            sortable: true,
            hide: 370,
            wrap: true,
          },
        ]
      : []),
    {
      name: "DPS Value",
      selector: (row) => row?.dps_value || "",
      sortable: true,
      width: "150px",
    },
    {
      name: "DPS Number",
      selector: (row) => row?.dps_no || "",
      sortable: true,
      width: "150px",
    },
    {
      name: "DPS Date",
      selector: (row) => row?.dps_date || "",
      sortable: true,
      width: "150px",
      wrap: true,
    },
    {
      name: "Order Status",
      selector: (row) => (
        <span
          className={
            row.order_status === "Received"
              ? "badge badge-light-success"
              : row.order_status === "Ordered"
              ? "badge badge-light-warning"
              : "badge badge-light-primary"
          }
        >
          {row.order_status === "Ordered" ? "Dispatch" : row.order_status}
        </span>
      ),
      hide: 370,
      width: "120px",
    },
    {
      name: "Stock Status",
      selector: (row) => (
        <span
          className={
            row.stock_transfer === true
              ? "badge badge-light-success"
              : "badge badge-light-warning"
          }
        >
          {row?.stock_transfer === true
            ? "Stock Transfer"
            : "Stock Not Transfer"}
        </span>
      ),
      hide: 370,
      width: "150px",
    },
    // {
    //   name: "Payment Method",
    //   selector: (row) => row.payment_method ?? "-",
    //   sortable: true,
    //   hide: 370,
    //   width:"150px"
    // },
    // {
    //   name: "Transaction ID",
    //   selector: (row) => row.transaction_id ?? "-",
    //   sortable: true,
    //   hide: 370,
    //   width:"150px"
    // },

    // {
    //   name: "Invoice/Bilti",
    //   selector: (row) => (
    //     <div>
    //       {" "}
    //       {row?.image == null ? (
    //         ""
    //       ) : (
    //         <img
    //           src={`${base_url}/${row?.image}`}
    //           // src={`${row.image}`}
    //           alt="image"
    //           onClick={() =>
    //             handleImageClick(
    //               0,
    //               `${base_url}/${row?.image}`,
    //               "Invoice/Bilti"
    //             )
    //           }
    //           style={{ width: 80, height: 40 }}
    //         />
    //       )}
    //     </div>
    //   ),
    //   hide: 370,
    //   minWidth: "170px",
    // },

    {
      name: "Paid",
      selector: (row) => `${RUPEES_SYMBOL}${row.paid_amount.toFixed(2)}`,
      sortable: true,
      hide: 370,
      width: "180px",
    },
    {
      name: "Due",
      selector: (row) => row.due_amount.toFixed(2),
      sortable: true,
      hide: 370,
      width: "180px",
    },
    {
      name: "Grand total",
      selector: (row) => `${RUPEES_SYMBOL}${row?.grand_total?.toFixed(2)}`,
      sortable: true,
      hide: 370,
      width: "180px",
    },

    // {
    //   name: "Transaction ID",
    //   selector: (row) => row.transaction_id ?? "-",
    //   sortable: true,
    //   hide: 370,
    //   minWidth: "190px",
    // },

    {
      name: "Payment Status",
      selector: (row) => (
        <span
          className={
            row.payment_status === "Paid"
              ? "badge badge-light-success"
              : row.payment_status === "Pending"
              ? "badge badge-light-warning"
              : "badge badge-light-primary"
          }
        >
          {row.payment_status || " "}
        </span>
      ),
      hide: 370,
      minWidth: "140px",
    },
    {
      name: "Under warranty",
      selector: (row) => (
        <span className="badge badge-light-success">{row.underWarranty}</span>
      ),
      hide: 370,
      minWidth: "140px",
    },
    {
      name: "Invoice/Bilti",
      selector: (row) => {
        const fileUrl = `${base_url}/${row?.image}`;
        const fileType = getFileTypeFromUrl(fileUrl);
        return <div>{renderContent(fileType, fileUrl)}</div>;
      },
      hide: 370,
      minWidth: "130px",
    },
    {
      name: "Invoice No.",
      selector: (row) => row?.invoice_no,
      sortable: true,
      hide: 370,
      width: "130px",
    },
    {
      name: "Invoice Date",
      selector: (row) => row?.invoice_date,
      sortable: true,
      hide: 370,
      width: "150px",
      wrap: true,
    },
    {
      name: "Invoice Copy",
      selector: (row) => (
        <div>
          {row?.invoicecopies && row.invoicecopies.length > 0 ? (
            <img
              src={`${base_url}/${row?.invoicecopies[0]?.image}`}
              alt="image"
              onClick={() =>
                handleImageClick2(
                  0,
                  row.invoicecopies.map((copy) => `${base_url}/${copy.image}`), // Pass an array of image URLs
                  "Invoice Copy",
                  "image" // You can adjust this based on your file type
                )
              }
              style={{ width: 80, height: 40, cursor: "pointer" }}
            />
          ) : (
            ""
          )}
        </div>
      ),
      hide: 370,
      minWidth: "130px",
    },

    {
      name: "Action",
      cell: (row) => {
        // const isAC = user?.role === "AC";
        // const options = filteredDropdown ; // Call the function here to get the options array
        const options = filteredDropdown(row); // Call the function here to get the options array
        return (
          <div style={{ position: "relative" }}>
            <div className="card-header-right-icon">
              <DropdownCommon
                style={{ overFlowY: "scroll", height: "150px" }}
                dropdownMain={{
                  className: "icon-dropdown",
                  direction: "start",
                }}
                options={options} // Pass the resulting options array here
                iconName="icon-more-alt"
                btn={{ tag: "span" }}
                onSelect={(item) => handleDropdownSelect(item, row)}
              />
            </div>
          </div>
        );
      },
    },
  ]);

  const handleImageClick2 = (index, images, inputName, fileType) => {
    setCurrentImageIndex(index);
    setTitleName(inputName);
    setFileType(fileType);

    // If multiple images or files are provided, set modalImages accordingly
    if (Array.isArray(images)) {
      setModalImages(images);
    } else {
      setModalImages([images]);
    }
    toggleImageModal();
  };

  const handleImageClick = (index, image, inputName, fileType) => {
    setCurrentImageIndex(index);
    // setModalImages([image]);
    // toggleImageModal();
    setTitleName(inputName);
    setFileType(fileType);
    setFileType(fileType);

    if (fileType === "pdf") {
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
  const handleClose = () => {
    setShowPaymentModal(false);
    getOrderList();
  };
  const [tablePurchaseData, setPurchaseData] = useState([]);

  useEffect(() => {
    getOrderList();
  }, []);

  // useEffect(() => {
  //   // // Push the current state to the history stack initially
  //   // window.history.pushState(null, null, window.location.href);
  //   // // This function will be called when the back button is pressed
  //   // const handlePopState = () => {
  //   //   // Push the state again to prevent back navigation
  //   //   window.history.pushState(null, null, window.location.href);
  //   // };
  //   // // Add event listener to handle back button press
  //   // window.addEventListener('popstate', handlePopState);
  //   // // Clean up the event listener on component unmount
  //   // return () => {
  //   //   window.removeEventListener('popstate', handlePopState);
  //   // };
  //   window.addEventListener("popstate", (e) => {
  //     window.history.forward();
  //   });
  // }, []);

  const getOrderList = () => {
    getOrderListAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          setIsLoading(false);
          setPurchaseData(res.data.data?.order);
          setData(res.data.data?.order);
        } else if (res.data.status == "failed") {
          setIsLoading(false);
          setPurchaseData([]);
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      <Breadcrumbs mainTitle="All Purchases" parent="" title="All Purchases" />
      <Container fluid={true}>
        <MyDataTable
          search="search by supplier name/transaction id "
          export
          title="Purchases"
          name="Purchases"
          data={tablePurchaseData}
          columns={tableColPurchase}
          isLoading={isLoading}
          fileName={"Purchase List"}
        />
      </Container>
      {showPaymentModal && (
        <PaymentModal
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          show={showPaymentModal}
          handleClose={() => {
            setShowPaymentModal(false);
            getOrderList();
          }}
          rowData={currentRowData}
        />
      )}
      {showPaymetSummary && (
        <PaymentSummaryModal
          show={showPaymetSummary}
          handleClose={() => setShowPaymetSummary(false)}
          rowData={currentRowData}
        />
      )}
      <ModalComponent
        fileType={fileType}
        titleName={titleName}
        isOpen={modalOpen}
        toggleModal={toggleModal}
        images={modalImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </>
  );
};

export default AllPurchase;
