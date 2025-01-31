import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Spinner,
} from "reactstrap";
import { H3, H6 } from "../../../AbstractElements";

import { toast } from "react-toastify";
import useLogout from "../../../util/useLogout";
import { Disabled, RUPEES_SYMBOL } from "../../../Constant";
import { addTransferStockAPI } from "../../../api/user";
import AddInventoryModal from "./AddInventoryModal";
const StockTransferModal = (props) => {
    const userToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("userDetail"));
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const tokenHeader = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + `${userToken}`,
        },
    };

    const logout = useLogout();
    // console.log(props, "ooo");
    const toggleConfirmModal = () => {
        setConfirmModalOpen(!isConfirmModalOpen);
    };

    const handleAddStock = () => {
        setConfirmModalOpen(!isConfirmModalOpen);
        props.setIsLoading(true)
        const data = {
            order_id: props?.data?.orderData?.[0]?.order_id,
            status: "Close"
        };
        // return false
        addTransferStockAPI(data, tokenHeader)
            .then((res) => {
                if (res.data.status == "success") {
                    toast.success(res.data.message);
                    props?.getOrderList();
                    props?.toggle(false);
                    setConfirmModalOpen(false);
                    props.setIsLoading(false);
                } else if (res.data.status == "failed") {
                    toast.error(res.data.message);
                    props.setIsLoading(false)
                } else if (res.data.status == "expired") {
                    logout(res.data.message);
                }
            })
            .catch((err) => {
                console.log("catch", err);
            });
    };

    return (
        <>
            <Modal size="xl" isOpen={props?.isOpen} toggle={props?.toggle}>
                <ModalHeader toggle={props?.toggle}>
                    Order Transfer Details
                </ModalHeader>
                {
                    (props?.data?.order_status === "Partial-Close") || props?.data?.stock_transfer ||
                        (props?.data?.underWarranty === 'UnderWarranty' || props?.data?.order_status == "Replacement") ? null :
                        <div className="chat-box">
                            <div className="people-list justify-content-between align-items-center">
                                <div className="add-stock">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={(props?.data?.order_status === "Close" || props?.data?.order_status === "Received") && (props?.data?.stock_transfer) || (props?.isLoading)}
                                        onClick={toggleConfirmModal}
                                    >
                                        {props.isLoading ? <Spinner size="sm" color="light" /> : 'Transfer Stock'}

                                    </Button>
                                </div>
                            </div>
                        </div>
                }

                <hr></hr>
                <ModalBody>
                    <Row>
                        <div>
                            <table
                                className="table table-bordered table-scroll mt-3"
                                id="productTable"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">Item</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Unit Price</th>
                                        <th scope="col">Amount</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {props?.data?.orderData?.map((item, index) => (
                                        <>
                                            <tr key={index}>
                                                <td>{item?.item_name}</td>
                                                <td>{item?.quantity}</td>
                                                <td>{RUPEES_SYMBOL} {item?.price}</td>
                                                <td>{RUPEES_SYMBOL} {parseFloat(item?.price * item?.quantity).toFixed(2)}</td>

                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-between">

                            <div className="col-md-4 mt-4">
                                <H6>Payment Summary</H6>
                                <table className="table table-striped table-sm">
                                    <tbody>
                                        {/* <tr>
                                        <td className="bold">GST</td>
                                        <td>
                                            <span>{props?.data?.gst}%</span>
                                        </td>
                                    </tr> */}
                                        <tr>

                                            <td>
                                                <span className="font-weight-bold">Grand Total</span>
                                            </td>
                                            <td>
                                                <span className="font-weight-bold">
                                                    {(props?.data?.order_status === "Partial-Close") ? ` ${RUPEES_SYMBOL} ${parseFloat(props?.data?.creditnotetotal || 0).toFixed(2)}` : ` ${RUPEES_SYMBOL} ${parseFloat(props?.data?.grand_total || 0).toFixed(2)}`}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-4 mt-4">
                                <H6>Payment Status</H6>
                                <table className="table table-striped table-sm">
                                    <tbody>
                                        <tr>
                                            <td className="bold">Transaction Id</td>
                                            <td>
                                                <span>{props?.data?.transaction_id}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bold">Payment Date</td>
                                            <td>
                                                <span>{props?.data?.payment_date}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="font-weight-bold">Payment Method</span>
                                            </td>
                                            <td>
                                                <span className="font-weight-bold">
                                                    {props?.data?.payment_method}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="font-weight-bold">Payment Status</span>
                                            </td>
                                            <td>
                                                <span className="font-weight-bold">
                                                    {props?.data?.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>


                    </Row>
                </ModalBody>
            </Modal>
            <AddInventoryModal
                isOpen={isConfirmModalOpen}
                onClose={handleAddStock}
                toggle={toggleConfirmModal}
            />
        </>

    );
};

export default StockTransferModal;
