import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { productListAPI, RTUproductListAPI } from "../../api/dropdowns";
import { orderDetails, purChaseProduct, updateOrder } from "../../api/user";
import useLogout from "../../util/useLogout";
import DataTable from "react-data-table-component";
import { RUPEES_SYMBOL } from "../../Constant";

const orderOption = { value: "alimco", label: "ALIMCO" };
const underWarrantyOption = [
  { value: "underWarranty", label: "UnderWarranty" },
];

const UnderWarrantyPurchase = () => {
  const orderStatusOptions = { value: "Created", label: "Created" };
  const orderStatusOptions1 = { value: "Replacement", label: "Replacement" };

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [],
      type: [{ value: null, label: null }],
      orderTax: null,
      discount: null,
      shipping: null,
      gst: null,
      orderStatus: orderStatusOptions,
      notes: "",
    },
  });

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const defaultStartDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1
  );
  const defaultEndDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  );
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [partsData, setPartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState([]);
  const [typeList, setTypeList] = useState([{ value: "rtu", label: "RTU" }]);
  const watchProducts = watch("products");
  const watchOrderTax = watch("gst");
  const watchDiscount = watch("discount");
  const watchShipping = watch("shipping");
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const fetchProducts = async () => {
    try {
      const response = await productListAPI();
      if (response.data.status === "success") {
        setPartsData(response?.data?.data?.partsData);
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const fetchRTUProducts = async (value) => {
    try {
      const response = await RTUproductListAPI(value); // Pass the value if your API needs it
      if (response.data.status === "success") {
        setPartsData(response?.data?.data?.partsData);
      } else if (response.data.status === "failed") {
        toast.error(response.data.message);
      } else if (response.data.status === "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  useEffect(() => {
    const id = location?.state?.product?.id;
    const data = { order_id: id };
    fetchList(data);
  }, [location]);

  const fetchList = async (data) => {
    try {
      const response = await orderDetails(data);
      if (response.data.status === "success") {
        const formattedOrderData = response.data.data.order.orderData.map(
          (item) => ({
            id: item.id,
            label: item.item_name,
            itemPrice: item.price,
            itemUnitPrice: item.itemUnitPrice,
            qty: item.quantity,
            gst: item.gst,
            subtotal: (item.price * item.quantity).toFixed(2),
          })
        );
        setData(response?.data?.data);
        setValue("gst", response?.data?.data?.order?.gst);
        setValue("discount", response?.data?.data?.order?.discount);
        setValue("shipping", response?.data?.data?.order?.shipping_charges);
        const newValue = response.data.data.order.type || null;
        const newLabel = response.data.data.order.type_label || null;
        setValue("type", [{ value: newValue, label: newLabel }]);
        setValue("notes", response?.data?.data?.order?.notes);
        setValue("products", formattedOrderData);
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
    const orderTaxValue = parseFloat(watchOrderTax) || 0;
    const discountValue = parseFloat(watchDiscount) || 0;
    const shippingValue = parseFloat(watchShipping) || 0;
    let subtotal = watchProducts.reduce((acc, product) => {
      const itemPrice = parseFloat(product.itemPrice) || 0;
      const qty = parseFloat(product.qty) || 0;
      return acc + itemPrice * qty;
    }, 0);
    let orderTax = (orderTaxValue / 100) * subtotal;
    let grandTotal = subtotal + orderTax + shippingValue - discountValue;
    setValue("subtotal", subtotal);
    setValue("orderTaxAmount", orderTax);
    setValue("grandTotal", grandTotal);
  }, [watchProducts, watchOrderTax, watchDiscount, watchShipping, setValue]);

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
  const inputRef = useRef([]);

  const handleQtyChange = (index, value) => {
    const qty = Math.max(0, parseFloat(value) || 0); // Ensure qty is non-negative
    const products = [...watchProducts];
    products[index].qty = qty;
    setValue("products", products);
    setTimeout(() => {
      if (inputRef.current[index]) {
        inputRef.current[index].focus();
      }
    }, 0);
  };
  const handleTypeSelect = async (selectedOption) => {
    setValue("type", selectedOption || 0);
    // Clear all product-related states
    setPartsData([]);
    setSelectedProduct(null);
    setSearchResults([]);
    remove(); // Clear the products array in useFieldArray
    if (selectedOption) {
      await fetchRTUProducts();
    } else {
      await fetchProducts();
    }
  };
  const handleDeleteProduct = (index) => {
    remove(index);
  };

  const onSubmit = async (data) => {
    // Check if any object in the array has qty equal to 0
    const hasQtyZero = fields.some((item) => item.qty === 0);
    if (hasQtyZero) {
      return;
    }
    if (location?.state?.mode == "edit") {
      const id = location?.state?.product?.id;
      const aasra_id = location?.state?.product?.aasra_id;
      data.order_id = id;
      data.aasra_id = aasra_id;
      data.startDate = startDate;
      data.endDate = endDate;
      data.dps_date = null;
      const formData = new FormData();
      // Append basic fields to formData
      formData.append("order_id", id);
      formData.append("aasra_id", aasra_id);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      if (typeList.length > 0) {
        formData.append("type_value", data?.type[0].value || 0);
        formData.append("type_label", data?.type[0].label || 0);
      }
      formData.append("discount", parseFloat(data?.discount || 0).toFixed(2));
      formData.append("shipping", parseFloat(data?.shipping || 0).toFixed(2));
      formData.append("gst", parseFloat(data?.gst || 0).toFixed(2));
      formData.append(
        "orderTaxAmount",
        parseFloat(data?.orderTaxAmount || 0).toFixed(2)
      );
      formData.append(
        "grandTotal",
        parseFloat(data?.grandTotal || 0).toFixed(2)
      );
      formData.append("subtotal", parseFloat(data?.subtotal || 0).toFixed(2));
      formData.append("notes", data?.notes || "");
      // Append order status
      formData.append(
        "orderStatus",
        userDetail?.user_type == "AC" ? "Created" : "Replacement"
      );
      // Append supplier name
      formData.append("supplier_name", "Alimco");
      formData.append("supplier_value", "alimco");
      // Append file upload (assuming single file input)
      if (data.fileUpload && data?.fileUpload[0]) {
        formData.append("image", data?.fileUpload[0] || null);
      } else {
        formData.append("image", null);
      }
      // Append products array
      data.products.forEach((product, index) => {
        formData.append(`products[${index}][value]`, product?.id);
        formData.append(`products[${index}][id]`, product?.value);
        formData.append(`products[${index}][label]`, product.label);
        formData.append(
          `products[${index}][itemUnitPrice]`,
          product.itemUnitPrice
        );
        formData.append(
          `products[${index}][itemPrice]`,
          parseFloat(product.itemPrice).toFixed(2)
        );
        formData.append(`products[${index}][qty]`, product.qty);
        formData.append(
          `products[${index}][gst]`,
          parseFloat(product.gst || 0).toFixed(2)
        );
        formData.append(
          `products[${index}][subtotal]`,
          parseFloat(product.subtotal).toFixed(2)
        );
      });

      // Log formData contents for debugging
      // console.log("Form Data Contents:", formData, data);
      // formData.forEach((value, key) => {
      //     console.log(key, value);
      // });
      // return false
      setIsLoading(true);
      try {
        const response = await updateOrder(formData, tokenHeader);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          navigate(`${process.env.PUBLIC_URL}/purchase/details/${id}`);
        } else if (response.data.status === "failed") {
          toast.error(response.data.message);
        } else if (response.data.status === "expired") {
          logout(response.data.message);
        }
        setIsLoading(false);
      } catch (err) {
        console.log("Error", err.message);
      }
    } else {
      data.startDate = startDate;
      data.endDate = endDate;
      // console.log(data, "datadfff");
      setIsLoading(true);
      if (fields.length === 0) {
        trigger("products");
        return;
      }
      // return false
      trigger("products");
      try {
        const response = await purChaseProduct(data);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          setIsLoading(false);
          navigate(`${process.env.PUBLIC_URL}/purchase/all-purchase`);
        } else if (response.data.status == "failed") {
          toast.error(response.data.message);
          setIsLoading(false);
        } else if (response.data.status == "expired") {
          logout(response.data.message);
        }
      } catch (err) {
        console.log("Error", err.message);
      }
      reset({
        products: [],
        orderTax: null,
        discount: null,
        shipping: null,
        type: [{ value: null, label: null }],
        gst: null,
        orderStatus: orderStatusOptions,
        notes: "",
      });
    }
  };
  useEffect(() => {
    // Perform validation when selectedProduct changes
    setValue("product", selectedProduct); // Ensure form value is up-to-date
    setValue("supplier_name", orderOption);
    setValue("underWarranty", underWarrantyOption[0]);
  }, [selectedProduct, setValue]);

  const columns = [
    {
      name: "Product",
      selector: (row) => row.label,
      sortable: true,
      wrap: true,
    },
    {
      name: "Price",
      selector: (row) => row.itemPrice,
      sortable: true,
      width: "90px",
    },
    // {
    //   name: "Qty",
    //   cell: (row, index) => (
    //     <input
    //       ref={(el) => (inputRef.current[index] = el)}
    //       style={{ width: "50px" }}
    //       type="text"
    //       autoFocus
    //       value={row.qty}
    //       onChange={(e) => handleQtyChange(index, e.target.value)}
    //       min="1" // Ensure input cannot be less than 0
    //       pattern="\d*"
    //       onInput={(e) => {
    //         e.target.value = e.target.value.replace(/[^0-9]/g, "");
    //         if (e.target.value === "" || e.target.value < 1) {
    //           e.target.value = 1;
    //         }
    //       }}
    //     />
    //   ),
    //   sortable: true,
    //   width: "90px",
    // },
    {
      name: "Qty",
      cell: (row, index) => (
        <div>
          <input
            ref={(el) => (inputRef.current[index] = el)}
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
          />
          {row.qty === 0 && (
            <div className="invalid mt-2">Please enter qty more than 0</div>
          )}{" "}
        </div>
      ),
      sortable: true,
      width: "190px",
    },
    {
      name: "Subtotal",
      selector: (row) => (parseFloat(row.itemPrice) * row.qty).toFixed(2),
      sortable: true,
      width: "190px",
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <Button
          outline
          color={`danger`}
          size={`xs`}
          onClick={() => handleDeleteProduct(index)}
        >
          {" "}
          <i className="fa fa-trash"></i>
        </Button>
      ),
      width: "150px",
    },
  ];

  return (
    <>
      <Breadcrumbs
        mainTitle="Create Replacement"
        parent="Create Replacement"
        title="Create Replacement"
      />
      <Container fluid={true}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="startDate">
                      Start Date
                    </label>
                    <DatePicker
                      className="form-control"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      disabled
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label" htmlFor="endDate">
                      End Date
                    </label>
                    <DatePicker
                      className="form-control"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      disabled
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label" htmlFor="supplier_name">
                      Supplier
                    </label>
                    <Select
                      id="supplier_name"
                      className="select"
                      options={orderOption}
                      placeholder="Select Supplier"
                      {...register("supplier_name", {
                        required: "Supplier is required",
                      })}
                      defaultValue={orderOption}
                      onChange={(value) => {
                        setValue("supplier_name", value);
                        trigger("supplier_name");
                      }}
                      isDisabled
                    />
                    {errors.supplier_name && (
                      <span className="invalid">
                        {errors?.supplier_name?.message}
                      </span>
                    )}
                  </div>
                  <div className="col-md-2">
                    <label className="form-label" htmlFor="underWarranty">
                      Under warranty
                    </label>
                    <Select
                      id="underWarranty"
                      className="select"
                      options={underWarrantyOption}
                      placeholder="Select Warranty"
                      {...register("underWarranty", {
                        required: "Warranty is required",
                      })}
                      defaultValue={underWarrantyOption[0]}
                      onChange={(value) => {
                        setValue("underWarranty", value);
                        trigger("underWarranty");
                      }}
                      isDisabled={location?.state?.mode === "edit"}
                    />
                    {errors.underWarranty && (
                      <span className="invalid">
                        {errors?.underWarranty?.message}
                      </span>
                    )}
                  </div>
                  {location?.state?.mode === "edit" &&
                    location?.state?.product?.type === "rtu" ? (
                    <>
                      <div className="col-md-2">
                        <label className="form-label" htmlFor="type">
                          Type
                        </label>
                        <Select
                          className="select"
                          options={typeList}
                          placeholder="Select Type"
                          {...register("type", {
                            // required: "Supplier is required",
                          })}
                          defaultValue={typeList}
                          isClearable
                          onChange={handleTypeSelect}
                          isDisabled={location?.state?.mode === "edit"}
                        />
                        {errors.type && (
                          <span className="invalid">{errors?.type?.message}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-2">
                        <label className="form-label" htmlFor="type">
                          Type
                        </label>
                        <Select
                          className="select"
                          options={typeList}
                          placeholder="Select Type"
                          {...register("type", {
                            // required: "Supplier is required",
                          })}
                          isClearable
                          onChange={handleTypeSelect}
                        />
                        {errors.type && (
                          <span className="invalid">{errors?.type?.message}</span>
                        )}
                      </div>
                    </>
                  )}
                </Row>


                <Row>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="product">
                      Product
                    </label>
                    <Select
                      options={partsData}
                      value={selectedProduct}
                      placeholder="Search Product"
                      isClearable
                      onChange={handleProductSelect}
                      onInputChange={(inputValue) => {
                        setSearchResults(
                          partsData.filter((product) =>
                            product.label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                          )
                        );
                      }}
                      isDisabled={location?.state?.mode === "edit"}
                    />
                  </div>
                </Row>
                {fields.length === 0 && (
                  <span className="invalid">
                    At least one product must be selected.
                  </span>
                )}

                {fields.length === 0 ? null : (
                  <>
                    <Row className="mt-5">
                      <DataTable
                        columns={columns}
                        data={fields}
                        // pagination
                        responsive={true}
                        striped={true}
                        highlightOnHover={true}
                        // paginationRowsPerPageOptions={[25, 50, 100, 500]}
                        // paginationPerPage={25}
                        persistTableHead
                      />
                    </Row>
                    <Row className="mt-4">
                      <Col md="9">
                        <Row>
                          {/* <Col md="3">
                            <label className="form-label" htmlFor="orderTax">
                              GST (%)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              {...register("gst", {
                                required: "Amount is  required.",
                                required: "GST percent is required",
                                pattern: {
                                  value: /^([1-9]|[1-9][0-9]|100)\.\d{2}$/,
                                  message:
                                    "GST Percent shouldn't greater than 100 & 2 digits after decimal.",
                                },
                                min: {
                                  value: 1,
                                  message: "Value must be between 1 and 100.",
                                },
                                max: {
                                  value: 100.0,
                                  message: "Value must be between 1 and 100.",
                                },
                                valueAsNumber: true
                              })}
                              min="0" // Ensure input cannot be less than 0
                              defaultValue={18}
                              disabled
                            />
                            {errors.gst && (
                              <span
                                className="invalid"
                              >
                                {errors?.gst?.message}
                              </span>
                            )}
                          </Col> */}
                          {/* <Col md="3">
                            <label className="form-label" htmlFor="discount">
                              Discount
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              {...register("discount", { valueAsNumber: true })}
                              min="0" // Ensure input cannot be less than 0
                            />
                          </Col> */}
                          {/* <Col md="3">
                            <label className="form-label" htmlFor="shipping">
                              Shipping
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              {...register("shipping", { valueAsNumber: true })}
                              min="0" // Ensure input cannot be less than 0
                            />
                          </Col> */}
                          {/* {  userDetail?.user_type == "AC" ||
                                                        location?.state?.underWarranty == "UnderWarranty" && (
                                                            <Col md="3">
                                                                <label className="form-label" htmlFor="orderStatus">
                                                                    Order Status
                                                                </label>
                                                                <Select
                                                                    options={orderStatusOptions}
                                                                    defaultValue={orderStatusOptions}
                                                                    {...register("orderStatus", { required: true })}
                                                                    onChange={(selectedOption) => setValue("orderStatus", selectedOption.value)}
                                                                    isDisabled
                                                                />
                                                                {errors.orderStatus && (
                                                                    <span
                                                                        className="invalid"
                                                                    >
                                                                        {errors?.orderStatus?.message}
                                                                    </span>
                                                                )}
                                                            </Col>
                                                        )

                                                    } */}

                          <Col md="12">
                            <label className="form-label" htmlFor="notes">
                              Notes
                            </label>
                            <textarea
                              className="form-control"
                              {...register("notes")}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="3">
                        <div className="col-md-12 mt-5">
                          <table className="table table-striped table-sm">
                            <tbody>
                              {/* <tr>
                                <td className="bold">GST</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL}{" "}
                                    {parseFloat(watch("orderTaxAmount") || 0).toFixed(
                                      2
                                    )}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="bold">Discount</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL}{" "}{parseFloat(watch("discount") || 0).toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="bold">Shipping</td>
                                <td>
                                  <span>
                                    {RUPEES_SYMBOL}{" "}{parseFloat(watch("shipping") || 0).toFixed(2)}
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
                                    {RUPEES_SYMBOL}{" "}
                                    {parseFloat(
                                      watch("grandTotal") || 0
                                    ).toFixed(2)}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col>
                        <Button
                          className="mt-3"
                          type="submit"
                          color="primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Spinner size="sm" color="light" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Form>
      </Container>
    </>
  );
};

export default UnderWarrantyPurchase;
