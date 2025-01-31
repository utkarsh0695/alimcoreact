import React, { Fragment, useState } from "react";
import { Btn, H4, P, H6, Image } from "../../../AbstractElements";
import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { deleteAPI } from "../../../api/auth";
import { toast } from "react-toastify";
import logoLight from "../../../assets/images/logo/Alimco_Logo.png";
const DeleteForm = ({ logoClassMain }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [hideMobile, setHideMobile] = useState(false);
  const [hideOtp, setHideOtp] = useState(true);
  const handleGenerateOpt = (data) => {
    const bodyData = {
      mobile: data?.mobile_no,
    };
    const bodyData1 = {
      mobile: data?.mobile_no,
      otp: data?.otp,
    };
    if (!hideOtp) {
      // console.log("OTP");
      //   return false
      deleteAPI(bodyData1)
        .then((res) => {
          if (res.data.status === "success") {
            toast.success(res.data.message);
            setHideMobile(false);
            setHideOtp(true);
          } else if (res.data.status === "failed") {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error("catch error", err);
        });
    } else {
      // console.log("mobile");
      //   return false
      deleteAPI(bodyData)
        .then((res) => {
          if (res.data.status === "success") {
            toast.success(res.data.message);
            setHideMobile(true);
            setHideOtp(false);
          } else if (res.data.status === "failed") {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error("catch error", err);
        });
    }
  };
  return (
    <Fragment>
      <Container fluid={true} className="p-0">
        <Row>
          <Col>
            <div className="login-card">
              <div>
                <div>
                  <Link className="logo" to="/login">
                    <img
                      className="img-fluid for-light"
                      src={logoLight}
                      alt="looginpage"
                    />
                  </Link>
                </div>
                <div className="login-main">
                  <Form
                    className="theme-form login-form"
                    onSubmit={handleSubmit(handleGenerateOpt)}
                  >
                    {hideMobile ? null : (
                      <>
                        {" "}
                        <H4>Delete Your Account</H4>
                        <FormGroup>
                          <Row>
                            <Col>
                              <label for="mobile">Mobile:</label>
                              {/* <input type="text" id="mobile" name="mobile" /> */}
                              <div className="form-control-wrap">
                                <input
                                  placeholder="Enter Mobile Number"
                                  type="text"
                                  id="mobile_no"
                                  {...register("mobile_no")}
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
                                />
                                {errors.mobile_no && (
                                  <span className="invalid">
                                    {errors?.mobile_no?.message}
                                  </span>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          <Row>
                            <Col>
                              <div className="form-group mb-0">
                                <Btn
                                  attrBtn={{
                                    className: "btn-block w-100",
                                    color: "primary",
                                    type: "submit",
                                  }}
                                >
                                  Send
                                </Btn>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      </>
                    )}
                    {hideOtp ? null : (
                      <>
                        <FormGroup>
                          <Row>
                            <Col>
                              <label for="otp">OTP:</label>
                              <div className="form-control-wrap">
                                <input
                                  type="text"
                                  placeholder="Enter Mobile Number"
                                  id="otp"
                                  {...register("otp")}
                                  className="form-control"
                                  value={watch("otp")}
                                  onChange={(e) => {
                                    setValue("otp", e.target.value);
                                    trigger("otp");
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          <Row>
                            <Col>
                              <div className="form-group mb-0 ">
                                <Btn
                                  attrBtn={{
                                    className: "btn-block w-100",
                                    color: "primary",
                                    type: "submit",
                                  }}
                                >
                                  Sumbit
                                </Btn>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                      </>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default DeleteForm;
