import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Row,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import {
    listSparePartMasterAPI,
    listStockMasterAPI,
} from "../../api/master";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { toCamelCase, ValidateImg } from "../../util/myFunction";
import useLogout from "../../util/useLogout";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import { FaRegEdit, FaUpload } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { decrypt, encrypt } from "../../security/Encrpt";
import { SECRET_KEY } from "../../Constant/MyConstants";
import UploadStockModal from "../../Components/MyComponents/Modal/UploadStockModal";

const UploadStock = () => {
    const logout = useLogout();
    const [isLoading, setIsLoading] = useState(true);

    const base_url = localStorage.getItem("base_url");
    const [tableData, setTableData] = useState([
    ]);
    const [rowData, setRowData] = useState(null);
    const userToken = localStorage.getItem("accessToken");
    const tokenHeader = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${userToken}`,
        },
    };
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        reset,
        clearErrors,
        setError,
        formState: { errors },
    } = useForm();

    const columns = [
        {
            name: "Type",
            selector: (row) => row.type || "-",
            sortable: true,
        },
        {
            name: "Part No.",
            selector: (row) => row.part_number,
            sortable: true,
        },
        {
            name: "Part Name",
            selector: (row) => toCamelCase(row.part_name),
            sortable: true,
            wrap: true,
        }
    ];

    const listStockList = () => {
        listSparePartMasterAPI({}, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    setIsLoading(false);
                    setTableData(res.data?.data?.data);
                } else if (res.data.status == "failed") {
                    setIsLoading(false);
                    toast.error(res.data.message);
                } else if (res.data.status == "expired") {
                    logout(res.data.message);
                }
            })
            .catch((err) => {
                console.log("catch", err);
            });
    };
    useEffect(() => {
        listStockList();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const handleModal=()=>{
        setShowModal(false);
        reset();
    }

    return (
        <>
            <Breadcrumbs
                mainTitle="Upload Stock"
                parent="Master"
                title="Upload Stock"
            />
            <Container fluid={true}>
                <Row>
                      <Col sm="12"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                        className="mb-4"
                    >
                        <div>
                            <>
                                <Button
                                    outline
                                    color="primary"
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                    style={{ textAlign: "right" }}
                                    size="m"
                                >
                                    <FaUpload />
                                    {"    "} Upload Stock
                                </Button>
                            </>
                        </div>
                    </Col>
                </Row>
                <MyDataTable
                  search="search by part name/part number/type "
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    name="Spare Part"
                    title="Spare Part"
                    fileName="Spare Part List"
                />
            </Container>
            <UploadStockModal
                show={showModal}
                handleClose={handleModal} 
            />
        </>
    );
};

export default UploadStock;
