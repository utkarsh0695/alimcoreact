import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { addOrderStockAPI } from "../../api/master";
import { orderDetails, purchaseOrder } from "../../api/user";
import DataTable from "react-data-table-component";
import { printGatePass, printPO } from "../../util/myPrint";
import useLogout from "../../util/useLogout";
import { RUPEES_SYMBOL } from "../../Constant";
import AddInventoryModal from "../../Components/MyComponents/Modal/AddInventoryModal";

const PurchaseDetail = () => {
  const params = useParams()
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [aasraData, setAasraData] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("userDetail"));
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  useEffect(() => {
    const id = params?.id;
    const data = {
      order_id: id,
    };
    fetchList(data);
  }, []);

  const fetchList = async (data) => {
    try {
      const response = await orderDetails(data, tokenHeader);
      if (response.data.status === "success") {

        setOrder(response.data.data.order.orderData);
        setData(response.data.data.order);
        setPaymentData(response.data.data.order.payment);
        setAasraData(response.data.data.order.aasra);
        setTotal(response?.data?.data?.order?.total_bill || 0);
        setIsLoading(false);
      } else if (response.data.status == "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };
  // useEffect(() => {

  //   const data = {
  //     order_id: Order.order_id,
  //   };
  //   fetchOrder(data);
  // }, []);

  const fetchOrder = async (data) => {
    try {
      const response = await purchaseOrder(data, tokenHeader);
      if (response.data.status === "success") {
        setIsLoading(false);
      } else if (response.data.status == "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const handleGeneratePO = async () => {
    setIsLoading(true)
    const data = {
      order_id: orderData[0].order_id,
    };
    try {
      const response = await purchaseOrder(data);
      if (response.data.status === "success") {
        setIsLoading(false)
        toast.success(response.data.message);
        await fetchList(data)
      } else if (response.data.status == "failed") {
        setIsLoading(false)
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const toggleConfirmModal = () => {
    setConfirmModalOpen(!isConfirmModalOpen);
  };

  const product = location?.state?.product || data;
  const purchase = location?.state?.payments;

  const columns = [
    { name: "Item Name", selector: (row) => row.item_name, sortable: true ,wrap:true},
    { name: "Price", selector: (row) => `${RUPEES_SYMBOL}${row.price}`, sortable: true,width:"190px" },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true ,width:"120px"},
    { name: "Sub Total", selector: (row) => `${RUPEES_SYMBOL}${(row.quantity * row?.price)?.toFixed(4)}`, sortable: true,width:"190px" },
    {
      name: "GST Amount",
      selector: (row) => row?.gstDetails ? parseFloat(row.gstDetails).toFixed(4) : '0',
      sortable: true,
      width: '190px'
    },
  ];
  const handleAddStock = () => {
    if (((user?.user_type === "A" || user?.user_type === "S") &&
    data?.stock_transfer === false &&
    (data?.order_status === "Received" || data?.order_status === "Partial-Close")) && data?.payment_status === "Paid" ) {
      navigate(`${process.env.PUBLIC_URL}/purchase/update/${params.id}`, {
        state: { product: product, mode: "update" },
      }); 
    } else {
      setIsLoading(true)
      setConfirmModalOpen(!isConfirmModalOpen);
      const data = {
        order_id: params?.id,
      };
      addOrderStockAPI(data, tokenHeader)
        .then((res) => {
          if (res.data.status == "success") {
            setIsLoading(false);
            setConfirmModalOpen(false)
            fetchList(data)
            toast.success(res.data.message);
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
    }

  };

  return (
    <>
      <Breadcrumbs mainTitle="Purchase" parent="Master" title="Order Detail" />
      <Container fluid={true}>
        <Col sm={12}>
          <Card>
            <CardHeader>
              <Row>
                <Col
                  className="mt-2"
                  sm="12"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div>
                    {/* {  paymentData?.invoice && user?.user_type == "AC" ? (
                      <Button
                        color="success"
                        className="mx-2"
                        onClick={handleAddStock}
                      >
                        Add to Inventory
                      </Button>
                    ) : null}  */}
                    {((user?.user_type === "AC") && (!data?.stock_transfer && data?.order_status == "Received")) ? <Button
                      color="success"
                      className="mx-2"
                      disabled={isLoading}
                      onClick={toggleConfirmModal}
                    >
                      {isLoading ? <Spinner size="sm" color="light" /> : 'Add to Inventory'}
                    </Button>
                      : null}
                    
                    {((user?.user_type === "A" || user?.user_type === "S") &&
                      data?.stock_transfer === false &&
                      (data?.order_status === "Received" || data?.order_status === "Partial-Close")) && data?.payment_status === "Paid" ? (
                      <Button
                        color="success"
                        className="mx-2"
                        disabled={isLoading}
                        onClick={handleAddStock}
                      >
                        {isLoading ? <Spinner size="sm" color="light" /> : 'Add to Inventory'}
                      </Button>
                    ) : null}


                    {/* {(user?.user_type == "AC" || data?.stock_transfer) && (user?.user_type == "A" || data?.order_status == "Partial-Close" || data?.stock_transfer ) ? (
                      <Button color="primary" onClick={handleAddStock}>
                        Add to Inventory
                      </Button>
                    ) : null} */}
                    {/* { (user?.user_type == "A" ||
                    user?.user_type == "S") && paymentData?.invoice && paymentData?.PO_number != 0 ? (
                      <Button
                        color="success"
                        className="mx-2"
                        onClick={handleAddStock}
                      >
                        Add Stock
                      </Button>
                    ) : null} */}
                    {data?.underWarranty === 'UnderWarranty' && data?.order_status == "Replacement" && (user?.user_type === "A" || user?.user_type === "S") ? (
                      <>
                        <Button
                          color="primary"
                          onClick={() => {
                            printGatePass(
                              orderData,
                              aasraData,
                              paymentData,
                              total,
                              product.gst,
                              data
                            );

                          }}
                        >
                          Print Gate Pass
                        </Button>
                        {
                          ((user?.user_type === "A" || user?.user_type === "S") && data?.stock_transfer === false && data?.order_status == "Replacement" ? (
                            <Button
                              color="success"
                              className="mx-2"
                              disabled={isLoading}
                              onClick={toggleConfirmModal}
                            >
                              {isLoading ? <Spinner size="sm" color="light" /> : 'Add to Inventory'}
                            </Button>
                          ) : null)
                        }

                      </>
                    ) : paymentData?.purchase_order && paymentData?.PO_number != 0 ? (
                      <Button
                        color="primary"
                        onClick={() => {
                          if (data?.payment_status === "Paid") {
                            printPO(orderData, aasraData, paymentData, total, product.gst, data);
                          } else {
                            toast.error("Payment Not Done.");
                          }
                        }}
                      >
                        Print PO
                      </Button>
                    ) : null}


                    {(user?.user_type == "A" ||
                      user?.user_type == "S") && paymentData?.PO_number == 0 && data?.underWarranty === null ? (
                      <Button color="primary" onClick={handleGeneratePO} disabled={isLoading}>
                        {isLoading  ? <Spinner size="sm" color="light" />  : 'Generate PO' }
                      </Button>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <h5>Order Details</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <DataTable
                  columns={columns}
                  data={orderData}
                  pagination
                  responsive={true}
                  striped={true}
                  highlightOnHover={true}
                  paginationRowsPerPageOptions={[25, 50, 100, 500]}
                  paginationPerPage={25}
                  persistTableHead
                  progressPending={isLoading}
                  progressComponent={
                    <Spinner
                      color="primary"
                      style={{
                        height: "3rem",
                        width: "3rem",
                      }}
                      type="grow"
                    >
                      Loading...
                    </Spinner>
                  }
                />
              </Row>
              <Row>
                <div className="offset-md-8 col-md-4 mt-4">
                  <table className="table table-striped ">
                    <tbody>
                      {data?.underWarranty === "UnderWarranty" ? <tr>
                        <td>
                          <span className="font-weight-bold">Grand Total</span>
                        </td>
                        <td>
                          <span className="font-weight-bold">
                            {RUPEES_SYMBOL} {product?.grand_total?.toFixed(4) || 0.00}
                          </span>
                        </td>
                      </tr> :
                        <>
                          <tr>
                            <td className="bold">Sub Total</td>
                            <td>
                              <span>{RUPEES_SYMBOL}{parseFloat(product?.total_bill || 0.00)?.toFixed(4)}</span>
                            </td>
                          </tr>
                          {/* <tr>
                        <td className="bold">GST</td>
                        <td>
                          <span>{RUPEES_SYMBOL}{parseFloat(product?.total_tax || 0.00).toFixed(2)} ({product.gst}%)</span>
                        </td>
                      </tr> */}
                          <tr>
                            <td className="bold">Discount</td>
                            <td>
                              <span>{RUPEES_SYMBOL}{product?.discount || 0.00}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">Shipping</td>
                            <td>
                              <span>{RUPEES_SYMBOL}{product?.shipping_charges || 0.00}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="bold">GST Amount</td>
                            <td>
                              <span>{RUPEES_SYMBOL}{data?.gst_amount || 0.00}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span className="font-weight-bold">Grand Total</span>
                            </td>
                            <td>
                              <span className="font-weight-bold">
                                {RUPEES_SYMBOL} {parseFloat(product?.grand_total || 0.00)?.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        </>
                      }


                    </tbody>
                  </table>
                </div>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Container>
      <AddInventoryModal
        isOpen={isConfirmModalOpen}
        onClose={handleAddStock}
        toggle={toggleConfirmModal}
      />
    </>
  );
};

export default PurchaseDetail;
