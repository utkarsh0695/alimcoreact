import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { OrderUpdate } from "../../api/user";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Col, Label, Row } from "reactstrap";
import { istToISO } from "../../util/myFunction";
import { RazorpayPaymentForm } from "../../MyPages/Razorpay/RazorpayPaymentForm";

const PaymentModal = ({
  show,
  handleClose,
  rowData,
  isLoading,
  setIsLoading,
}) => {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_date: new Date(),
      payment_method: "", // Set initial value to an empty string
      transaction_id: null, // Set initial value to an empty string
    },
  });
  const userToken = localStorage.getItem("accessToken");
  const base_url = localStorage.getItem("base_url");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [payment_method, setPaymentMethod] = useState(null);
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  // Calculate the default start date (2 months before today)
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 2);
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    if (rowData) {
      // setValue("payment_date", rowData.payment_date || "");
      // setValue("payment_method", rowData.payment_method || "");
      setValue("payment_method", "");
      setValue("transaction_id", rowData.transaction_id || "");
      setValue("paid_amount", rowData.grand_total || "");
    }
    setValue("payment_date", istToISO(selectedDate));
    trigger("payment_date");
  }, [rowData, setValue]);

  const payment_mode = [
    ...(userDetail?.user_type == "AC"
      ? [{ value: "online", label: "HDFC Collect" }]
      : []),
    ...(userDetail?.user_type === "A" || userDetail?.user_type === "S"
      ? [{ value: "cash", label: "Cash" }]
      : []),
  ];

  const handleModeChange = (selectedOption) => {
    setPaymentMethod(selectedOption); // Store the selected option in the state if needed
    setValue("payment_method", selectedOption?.value || ""); // Set only the value, not the entire object
    trigger("payment_method");
  };

  const onSubmit = async (data) => {
    if (watch("payment_method") == "online") {
      return (
        <RazorpayPaymentForm
          data={rowData}
          mode={watch("payment_method")}
          transaction_id={watch("transaction_id")}
          payment_date={watch("payment_date")}
          handleClose={handleClose}
          errors={errors}
        />
      );
    } else if (watch("payment_method") == "cash") {
      setIsLoading(true);
      try {
        const response = await OrderUpdate(
          {
            ...rowData,
            transaction_id: watch("transaction_id"),
            payment_method: watch("payment_method"),
            paid_amount: rowData?.grand_total,
            payment_date: watch("payment_date"),
          },
          tokenHeader
        );
        if (response.data.status === "success") {
          setIsLoading(false);

          handleClose();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        console.log("Error", err.message);
      }
    } else {
      alert("fill");
    }
  };
  useEffect(() => {
    if (rowData.payment_status !== "Pending") {
      toast.info("You have already paid");
      handleClose(); // Close the modal if payment is already made
    }
  }, [rowData, handleClose]);

  if (rowData.payment_status !== "Pending") {
    return null; // Don't render the modal if payment_status is not pending
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12}>
              <Label className="form-label">Date</Label>
              <DatePicker
                className="form-control"
                placeholderText="Please select payment date"
                {...register("payment_date", {
                  required: "Payment Date is required",
                })}
                onChange={(date) => {
                  setValue("payment_date", date);
                  setSelectedDate(date);
                  trigger("payment_date");
                }}
                selected={selectedDate}
                selectsStart
                startDate={selectedDate}
                maxDate={new Date()} // Disable future dates
                minDate={defaultStartDate} // Enable dates only up to 2 months in the past
                dateFormat="dd/MM/yyyy"
              />
              {errors.payment_date && (
                <p className="invalid">{errors.payment_date.message}</p>
              )}
            </Col>
          </Row>
          <Form.Group controlId="formPaymentChoice">
            <Row>
              <Col md={"12"}>
                <Label htmlFor="mode" className="form-label">
                  Select payment mode
                </Label>
                <Select
                  className="select"
                  id="payment_method"
                  options={payment_mode}
                  placeholder={"Select payment method"}
                  {...register("payment_method", {
                    required: "Payment method is required",
                  })}
                  onChange={handleModeChange}
                />
                {errors.payment_method && (
                  <span className="invalid">
                    {errors.payment_method.message}
                  </span>
                )}
              </Col>
            </Row>
          </Form.Group>
          {watch("payment_method")
            ? (userDetail?.user_type === "A" ||
                userDetail?.user_type === "S") &&
              watch("payment_method") !== "online" && (
                <Form.Group controlId="formTransactionId">
                  {" "}
                  <Form.Label>
                    {" "}
                    {watch("payment_method") === "cash"
                      ? "Receipt No"
                      : "Transaction Id"}{" "}
                  </Form.Label>{" "}
                  <Form.Control
                    type="text"
                    {...register("transaction_id", {
                      required: "Receipt No is required",
                    })}
                  />{" "}
                  {errors.transaction_id && (
                    <span className="invalid">
                      {" "}
                      {errors.transaction_id.message}{" "}
                    </span>
                  )}{" "}
                </Form.Group>
              )
            : null}
          <Form.Group controlId="formPayment">
            <Form.Label>Payment</Form.Label>
            <Form.Control
              readOnly
              disabled
              type="number"
              step="0.01"
              {...register("paid_amount", {
                required: "Please enter your Amount",
              })}
            />
            {errors.paid_amount && (
              <span
                className="invalid"
                style={{
                  color: "#e85347",
                  fontSize: "11px",
                  fontStyle: "italic",
                }}
              >
                {errors.paid_amount.message}
              </span>
            )}
          </Form.Group>

          {watch("payment_method") == "cash" ? (
            <Form.Group className="text-center">
              <Button color="primary" className="mt-4" type="submit">
                Submit
              </Button>
            </Form.Group>
          ) : null}
          {watch("payment_method") == "online" &&
          (watch("transaction_id") != "" || watch("transaction_id") != null) ? (
            <RazorpayPaymentForm
              data={rowData}
              mode={watch("payment_method")}
              transaction_id={watch("transaction_id")}
              payment_date={watch("payment_date")}
              handleClose={handleClose}
              errors={errors}
            />
          ) : null}
          {/* <RazorpayPaymentForm
            data={rowData}
            mode={watch("payment_method")}
            transaction_id={watch("transaction_id")}
            payment_date={watch("payment_date")}
            handleClose={handleClose}
            errors={errors}
          /> */}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
