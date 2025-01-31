import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import { purChaseProduct } from "../../api/user";
import useLogout from "../../util/useLogout";
import DataTable from "react-data-table-component";
import { RUPEES_SYMBOL } from "../../Constant";

const orderStatusOptions = { value: "Created", label: "Created" };

const orderOption = { value: "alimco", label: "ALIMCO" };
const CreatePurchase = () => {
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
      orderTax: null,
      type: [{ value: null, label: null }],
      discount: null,
      gstAmount: null,
      shipping: null,
      gst: null,
      orderStatus: orderStatusOptions,
      notes: "",
    },
  });

  const logout = useLogout();
  const navigate = useNavigate();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [partsData, setPartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const watchProducts = watch("products");
  const watchOrderTax = watch("gst");
  const watchDiscount = watch("discount");
  const watchShipping = watch("shipping");
  const [typeList, setTypeList] = useState([{ value: "rtu", label: "RTU" }]);

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
    // setValue('supplier_name',orderOption?.label || 'alimco')
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
      const gst =
        parseFloat(product.itemUnitPrice * qty - product.itemPrice * qty) || 0;
      return acc + gst;
    }, 0);
    let grandGst = parseFloat(subtotalgst).toFixed(2);
    let orderTax = (orderTaxValue / 100) * subtotal;
    let grandTotal =
      subtotal + subtotalgst + orderTax + shippingValue - discountValue;
    setValue("subtotal", subtotal);
    setValue("orderTaxAmount", orderTax);
    setValue("grandTotal", grandTotal);
    setValue("gstAmount", parseFloat(grandGst).toFixed(2));
  }, [watchProducts, watchOrderTax, watchDiscount, watchShipping, setValue]);

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
          const gstAmount = parseFloat(
            watchProducts[productIndex].itemUnitPrice * newQty -
              watchProducts[productIndex].itemPrice * newQty
          ).toFixed(2);
          update(productIndex, {
            ...watchProducts[productIndex],
            qty: newQty,
            gst: gstAmount,
          });
        } else {
          const gstAmount = parseFloat(
            productExists.itemUnitPrice * 1 - productExists.itemPrice * 1
          ).toFixed(2);
          append({ ...productExists, qty: 1, gst: gstAmount });
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
    const gst = parseFloat(
      products[index].itemUnitPrice * products[index].qty -
        products[index].itemPrice * products[index].qty
    ).toFixed(2);
    products[index].gst = gst;
    setValue("products", products);
    setTimeout(() => {
      if (inputRef.current[index]) {
        inputRef.current[index].focus();
      }
    }, 0);
  };

  const handleDeleteProduct = (index) => {
    remove(index);
  };

  const onSubmit = async (data) => {
    data.date = startDate;
    if (fields.length === 0) {
      trigger("products");
      return;
    }
    // Check if any object in the array has qty equal to 0
    const hasQtyZero = fields.some((item) => item.qty === 0);
    if (hasQtyZero) {
      return;
    }
    // console.log(data,"data",fields);
    // return false
    setIsLoading(true);
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
      type: null,
      orderTax: null,
      discount: null,
      gstAmount: null,
      shipping: null,
      gst: null,
      orderStatus: orderStatusOptions,
      notes: "",
    });
  };
  useEffect(() => {
    // Perform validation when selectedProduct changes
    setValue("product", selectedProduct); // Ensure form value is up-to-date
    setValue("supplier_name", orderOption);
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
    //       style={{ width: '50px' }}
    //       type="text"
    //       autoFocus
    //       value={row.qty}
    //       onChange={(e) => handleQtyChange(index, e.target.value)}
    //       min="0" // Ensure input cannot be less than 0
    //       pattern="\d*"
    //       onInput={(e) => {
    //         e.target.value = e.target.value.replace(/[^0-9]/g, "");
    //       }}
    //     />
    //   ),
    //   sortable: true,
    //   width: '90px'
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
            type="number"
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
      name: "Sub Total",
      selector: (row) => (parseFloat(row.itemPrice) * row.qty).toFixed(4),
      sortable: true,
      width: "190px",
      wrap: true,
    },
    {
      name: "GST Amount",
      selector: (row) =>
        parseFloat(
          row.itemUnitPrice * row.qty - row.itemPrice * row.qty
        ).toFixed(4),
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
        mainTitle="Create Purchase"
        parent="Create Purchase"
        title="Create Purchase"
      />
      <Container fluid={true}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="supplier_name">
                      Supplier
                    </label>
                    <Select
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
                  <div className="col-md-4">
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
                </Row>
                <Row>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="product">
                      Product
                    </label>
                    <Select
                      options={
                        searchResults.length > 0 ? searchResults : partsData
                      }
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
                          {/* <Col md="3">
                            <label className="form-label" htmlFor="orderStatus">
                              Order Status
                            </label>
                            <Select
                              options={orderStatusOptions}
                              defaultValue={orderStatusOptions}
                              {...register("orderStatus", { required: true })}
                              onChange={(value) => setValue("orderStatus", value)}
                              isDisabled
                            />
                            {errors.orderStatus && (
                              <span
                                className="invalid"
                              >
                                {errors?.orderStatus?.message}
                              </span>
                            )}
                          </Col> */}
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
                        <div className="col-md-12 mt-4">
                          <table className="table table-striped ">
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
                                    GST Amount
                                  </span>
                                </td>
                                <td>
                                  <span className="font-weight-bold">
                                    {RUPEES_SYMBOL}{" "}
                                    {parseFloat(
                                      watch("gstAmount") || 0
                                    ).toFixed(4)}
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
                                    {parseFloat(
                                     Math.round( watch("grandTotal")) || 0
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

export default CreatePurchase;
