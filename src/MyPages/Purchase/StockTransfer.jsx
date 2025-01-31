import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Label,
    Row,
    Button,
} from "reactstrap";
import Select from "react-select";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { getOrderListAPI } from "../../api/aasra";
import useLogout from "../../util/useLogout";
import DatePicker from "react-datepicker";
import ModalComponent from "../../CommonElements/ModalImg/ModalComponent";

import PaymentSummaryModal from "../../Components/MyComponents/Modal/PaymentSummaryModal";
import { aasraListAPI } from "../../api/dropdowns";
import StockTransferModal from "../../Components/MyComponents/Modal/StockTransferModal";
import PaymentModal from "../../Components/MyComponents/Modal/PaymentModal";
import { stockTransferList } from "../../api/user";
import { RUPEES_SYMBOL } from "../../Constant";
import { BsEye } from "react-icons/bs";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaFilePdf, FaRegImage } from "react-icons/fa";


const StockTransfer = () => {
    const logout = useLogout();
    const [isLoading, setIsLoading] = useState(true);
    const [currentRowData, setCurrentRowData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const user = JSON.parse(localStorage.getItem("userDetail"));
    const base_url = localStorage.getItem("base_url");
    const isAdminn = user?.user_type === "A" || user?.user_type === "S" || user?.user_type === "AC";
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        reset,
        formState: { errors },
    } = useForm();
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
                        id="pdf"
                        color="primary"
                        type="button"
                        onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
                        size="sm"
                    >
                        <FaRegImage style={{ height: '1rem', width: '1rem' }} />
                    </Button>
                    {/* <img
              src={fileUrl}
              alt="file"
              onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
              style={{ width: 80, height: 40, cursor: 'pointer' }}
            /> */}
                </>

            );
        } else if (lowerCaseFileType === 'pdf') {
            return (
                <Button
                    outline
                    id="pdf"
                    color="danger"
                    type="button"
                    onClick={() => handleImageClick(0, fileUrl, "Invoice/Bilti", fileType)}
                    size="sm"
                >
                    <FaFilePdf style={{ height: '1rem', width: '1rem' }} />
                </Button>
            );
        }
        return null;
    };
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
    const [rowData, setRowData] = useState(null);
    const [columns, setColumns] = useState([
        {
            name: "Supplier",
            selector: (row) => row.supplier_name ,
            sortable: true,
            hide: 370,
            width: "120px",
        },
        ...(user?.user_type == "A" || user?.user_type == "AC" ||user?.user_type == "S" 
            ? [
                {
                    name: "Aasra",
                    selector: (row) => row?.aasra?.name_of_org , // Replace with the appropriate field
                    sortable: true,
                    hide: 370,
                    wrap: true
                },
            ]
            : []),
        {
            name: "Order Date",
            selector: (row) => row?.order_date,
            sortable: true,
            wrap:true
        },
        {
            name: "DPS Date",
            selector: (row) => row?.dps_date,
            sortable: true,
            wrap:true
        },
        {
            name: "DPS Value",
            selector: (row) => row?.dps_value,
            sortable: true,
        },
        {
            name: "DPS Number",
            selector: (row) => row?.dps_no,
            sortable: true,
        },
        {
            name: "Order Status",
            selector: (row) => (
                <span
                    className={
                        row?.order_status === "Close"
                            ? "badge badge-light-success"
                            : row?.order_status === "Pending"

                                ? "badge badge-light-warning"
                                : "badge badge-light-primary"
                    }
                >
                    {row?.order_status }
                </span>
            ),
            hide: 370,
        },
        {
            name: "Payment Method",
            selector: (row) => row?.payment_method ,
            sortable: true,
            hide: 370,
            width: "150px",
        },
        {
            name: "Transaction ID",
            selector: (row) => row?.transaction_id ,
            sortable: true,
            hide: 370,
            wrap:true,
            minWidth: "190px",
        },
        // {

        //     name: "Invoice/Bilti",
        //     selector: (row) => (
        //         <div>
        //             {" "}
        //             {row?.image == null ? (
        //                 ""
        //             ) : (
        //                 <img
        //                     src={`${base_url}/${row?.image}`}
        //                     // src={`${row.image}`}
        //                     alt="image"
        //                     onClick={() =>
        //                         handleImageClick(
        //                             0,
        //                             `${base_url}/${row?.image}`,
        //                             "Invoice/Bilti"
        //                         )
        //                     }
        //                     style={{ width: 80, height: 40 }}
        //                 />
        //             )}
        //         </div>
        //     ),
        //     hide: 370,
        //     minWidth: "170px",
        // },
    
        {
            name: "Paid",
            selector: (row) => `${RUPEES_SYMBOL}${row?.paid_amount.toFixed(2)}`,
            sortable: true,
            hide: 370,
            minWidth: "80px",
        },
        {
            name: "Due",
            selector: (row) => `${RUPEES_SYMBOL}${row?.due_amount.toFixed(2)}`,
            sortable: true,
            hide: 370,
            width: "80px",
        },
        {
            name: "Grand total",
            selector: (row) => `${RUPEES_SYMBOL}${row?.grand_total.toFixed(2)}`,
            sortable: true,
            hide: 370,
            minWidth: "80px",
        },
        {
            name: "Under warranty",
            selector: (row) => (
              <span
                className="badge badge-light-success"
              >
                {row?.underWarranty}
              </span>
            ),
            hide: 370,
            width: "140px",
          },
        {
            name: "Invoice/Bilti",
            selector: (row) => {
                const fileUrl = `${base_url}/${row?.image}`;
                const fileType = getFileTypeFromUrl(fileUrl);
                return (
                    <div>
                        {renderContent(fileType, fileUrl)}
                    </div>
                );
            },
            hide: 370,
            minWidth: "170px",
        },
        {
            name: "Invoice No.",
            selector: (row) => row?.invoice_no ,
            sortable: true,
            hide: 370,
            minWidth: "100px",
        },
         {
            name: "Invoice Date",
            selector: (row) => row?.invoice_date ,
            sortable: true,
            hide: 370,
            width: "100px",
            wrap:true
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
                        row.invoicecopies.map(copy => `${base_url}/${copy.image}`), // Pass an array of image URLs
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
            cell: (row) => (
                <>
                    <Button
                        id={'view-' + row.id}
                        outline
                        color="success"
                        className="mx-1"
                        style={{ cursor: "pointer", textAlign: "center", paddingTop: "5px" }}
                        onClick={() => {
                            setCurrentRowData(row);
                            setShowModal(true);
                        }}
                        size="xs"
                    >
                        <BsEye style={{ height: '.8rem', width: '.8rem' }} />
                    </Button>
                    <ToolTip id={'view-' + row.id} name={'View'} option={'top'} />
                </>
            ),
        },

    ]);
    const defaultStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [aasraList, setAasraList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const handleAsraList = (data) => {
        setValue("aasra_name", data);
        trigger("aasra_name");
    };
    useEffect(() => {
        aasralist()
    }, [])
    const aasralist = () => {
        aasraListAPI({}, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    setAasraList(res.data.data);
                } else if (res.data.status == "failed") {
                    toast.error(res.data.message);
                } else if (res.data.status == "expired") {
                    logout(res.data.message);
                }
            })
            .catch((err) => {   
                console.log("catch", err);
            });
    }

    // const handleImageClick = (index, image, inputName) => {
    //     setCurrentImageIndex(index);
    //     setModalImages([image]);
    //     toggleImageModal();
    //     setTitleName(inputName);
    // };
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
    };
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    const [tableData, setTableData] = useState([]);



    useEffect(() => {
        getOrderList();
        setValue("startDate", defaultStartDate);
        setValue("endDate", new Date());
    }, []);
    const getOrderList = () => {
        const data = {
            startDate:null,// startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString() : null,
            endDate: null,//endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate())).toISOString() : null,
            stock: true
        }
        stockTransferList(data, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    toast.success(res.data.message);
                    setTableData(res.data.data?.order);
                    setIsLoading(false);
                } else if (res.data.status == "failed") {
                    toast.error(res.data.message);
                    setIsLoading(false);
                    setTableData([])
                } else if (res.data.status == "expired") {
                    logout(res.data.message);
                }
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    const onFormSubmit = (data) => {
        setIsLoading(true);
        const token = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                Authorization: "Bearer " + `${userToken}`,
            },
        };
        const searchData = {
            aasra_report_id: data.aasraId?.value,
            startDate: data.startDate ? new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)).toISOString() : null,
            endDate: data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate())).toISOString() : null,
            stock: true
        };
        stockTransferList(searchData, token)
            .then((res) => {
                if (res.data.status == "success") {
                    toast.success(res.data.message);
                    setTableData(res.data.data.order);
                    setIsLoading(false);
                } else if (res.data.status == "failed") {
                    toast.error(res.data.message);
                    setTableData([])
                    setIsLoading(false);

                } else if (res.data.status == "expired") {
                    logout(res.data.message);
                }
            })
            .catch((errors) => {
                console.log(errors);
            });
    }


    return (
        <>
            <Breadcrumbs mainTitle="Stock Transfer" parent="" title="Stock Transfer" />
            {/* <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Form onSubmit={handleSubmit(onFormSubmit)}>
                            <Col sm="12">
                                <Card>
                                    <CardHeader>
                                        <h5>{"Stock Transfer  Reports"}</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            {(user?.user_type === "A" || user?.user_type === "S") && (
                                                <Col md="3">
                                                    <div className="form-group">
                                                        <Label className="from-label" htmlFor="aasra_name">
                                                            Aasra
                                                        </Label>
                                                        <div className="form-control-wrap">
                                                            <Select
                                                                className="select"
                                                                id="aasra_name"
                                                                // {...register("aasra_name", {
                                                                //     required: "Aasra is required",
                                                                // })}
                                                                options={aasraList}
                                                                placeholder={"Select Aasra"}
                                                                value={watch("aasra_name")}
                                                                onChange={handleAsraList}
                                                            />
                                                            {errors.aasra_name && (
                                                                <p className="invalid">
                                                                    {errors.aasra_name.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Col>
                                            )}
                                            <Col sm="3">
                                                <Label className="form-label">Start Date</Label>
                                                <DatePicker
                                                    className="form-control"
                                                    placeholderText="Please Select Start Date"

                                                    {...register("startDate", {
                                                        required: "Start Date is required",
                                                    })}
                                                    onChange={(date) => {
                                                        setValue("startDate", date)
                                                        setStartDate(date)
                                                        trigger("startDate");
                                                    }}
                                                    selected={startDate}
                                                    selectsStart
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    maxDate={new Date()}

                                                />

                                                {errors.startDate && (
                                                    <p className="invalid">
                                                        {errors.startDate.message}
                                                    </p>
                                                )}
                                            </Col>
                                            <Col sm="3">
                                                <Label className="form-label">End Date</Label>
                                                <DatePicker
                                                    className="form-control"
                                                    placeholderText="Please Select End Date"
                                                    {...register("endDate", {
                                                        required: "End Date is required",
                                                    })}
                                                    onChange={(date) => {
                                                        setValue("endDate", date)
                                                        setEndDate(date)
                                                        trigger("endDate");
                                                    }}
                                                    selected={endDate}
                                                    selectsEnd
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    maxDate={new Date()}
                                                />
                                                {errors.endDate && (
                                                    <p className="invalid">
                                                        {errors.endDate.message}
                                                    </p>
                                                )}
                                            </Col>
                                            <Col md="2" className="mt-top">
                                                <Button color="primary" size="md">
                                                    Search
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container> */}
            <Row>
            <Col sm="12">
                <MyDataTable
                    SearchCall
                    aasraType
                    dateFilter
                    onFormSubmit={onFormSubmit}
                    search="search by transaction id "
                    export
                    title="Stock Transfer List"
                    name="StockTransfer"
                    data={tableData}
                    columns={columns}
                    isLoading={isLoading}
                    fileName={"Stock Transfer List"}
                />
             </Col>
             </Row>
            {showModal && (
                <StockTransferModal
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    isOpen={showModal}
                    toggle={() => setShowModal(false)}
                    data={currentRowData}
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

export default StockTransfer;
