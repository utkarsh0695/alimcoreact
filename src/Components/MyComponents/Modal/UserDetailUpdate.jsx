import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Col,
  Label,
  Input,
  Toast,
  Spinner,
  ModalFooter,
} from "reactstrap"; // Assuming you're using Reactstrap
import { encrypt } from "../../../security/Encrpt";
import { changePassword } from "../../../api/user";
import { toast } from "react-toastify";
import useLogout from "../../../util/useLogout";

const UserDetailUpdate = ({ isOpen, handleClose, id, fetchUsers, rowData }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cus_password: "",
      confirmPassword: "",
      username: "",
      email: "",
      mobile: "",
    },
  });
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConPassword, setToggleConPassword] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const onFormSubmit = async (data) => {
    console.log("pressed");

    if (!data.cus_password && !data.username && !data.mobile && !data.email) {
      handleClose(); // Close the modal
      return; // Exit the function without proceeding further
    }
    try {
      setIsLoading(true);

      const formData = {
        ...(data.cus_password && { password: data.cus_password }),
        ...(id && { id }), // Always include `id` if available
        ...(data.username && { unique_code: data.username }),
        ...(data.mobile && { mobile: data.mobile }),
        ...(data.email && { email: data.email }),
      };
      const encryptBody = encrypt(formData);
      const bodyData = {
        zero: encryptBody,
      };

      const response = await changePassword(bodyData, tokenHeader);

      if (response?.data?.status === "success") {
        toast.success(response.data.message);
        reset();
        handleClose();
        fetchUsers();
      } else if (response?.data?.status === "failed") {
        toast.error(response.data.message);
      } else if (response?.data?.status === "expired") {
        logout(response.data.message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearClose = () => {
    reset();
    handleClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={handleClearClose} backdrop="static">
        <ModalHeader
          toggle={handleClearClose}
          className="d-flex justify-content-center align-items-center"
        >
          Update Aasra Detail <br></br>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: "14px" }}
          >
            ({rowData?.name})
          </div>
        </ModalHeader>
   
        <ModalBody>
          <form id="updateForm" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <Label className="from-label" htmlFor="username">
                Username
              </Label>
              <div className="form-control-wrap">
                <input
                  placeholder="Enter Username"
                  type="text"
                  id="username"
                  {...register("username", {
                    pattern: {
                      value: /^[a-zA-Z0-9 _-]*$/,
                      message:
                        "Only alpha-numeric, space, _ and - are allowed.",
                    },
                  })}
                  className="form-control"
                  value={watch("username")}
                  onChange={(e) => {
                    setValue("username", e.target.value);
                    trigger("username");
                  }}
                  autoComplete="off"
                />
                {errors.username && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errors?.username?.message}
                  </span>
                )}
              </div>
            </div>
            <div>
              <Label className="from-label" htmlFor="mobile">
                Mobile Number
              </Label>
              <div className="form-control-wrap">
                <input
                  placeholder="Enter Mobile Number"
                  type="text"
                  id="mobile"
                  {...register("mobile", {
                    pattern: {
                      value: /^[6789]\d{9}$/,
                      message: "Enter Valid Mobile Number.",
                    },
                  })}
                  className="form-control"
                  value={watch("mobile")}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    setValue("mobile", e.target.value);
                    trigger("mobile");
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    e.target.value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                  }}
                />
                {errors.mobile && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errors?.mobile?.message}
                  </span>
                )}
              </div>
            </div>{" "}
            <label for="email" className="form-label">Email</label>
            <div className="form-control-wrap">
              <input
                placeholder="Enter Email"
                type="text"
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+(?:\.[^\s@]+)?\.[a-z]{2,}$/,
                    message: "Invalid Email.",
                  },
                })}
                className="form-control"
                value={watch("email")}
                onChange={(e) => {
                  setValue("email", e.target.value);
                  trigger("email");
                }}
              />
              {errors.email && (
                <span className="invalid">{errors?.email?.message}</span>
              )}
            </div>
            <div className="position-relative">
              <Label htmlFor="cus_password">Password</Label>
              <Input
                id="cus_password"
                type={togglePassword ? "text" : "password"}
                {...register("cus_password", {
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,18}$/,
                    message:
                      "Password must contain 1 special character, 1 uppercase, 1 lowercase, 1 digit, and be 8-18 characters long",
                  },
                })}
                autoComplete="off"
                placeholder="Enter Password"
                className="form-control"
                onChange={(e) => {
                  setValue("cus_password", e.target.value);
                  trigger("cus_password");
                }}
              />
              <div
                className="show-hide1"
                onClick={() => setTogglePassword(!togglePassword)}
              >
                <i
                  style={{ cursor: "pointer" }}
                  className={togglePassword ? "fa fa-eye" : "fa fa-eye-slash"}
                ></i>
              </div>
              {errors.cus_password && (
                <p
                  className="invalid"
                  style={{
                    color: "#e85347",
                    fontSize: "11px",
                    fontStyle: "italic",
                  }}
                >
                  {errors.cus_password.message}
                </p>
              )}
            </div>
            <div className="position-relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={toggleConPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("cus_password") || "Password do not match",
                })}
                placeholder="Confirm password"
                className="form-control"
                onChange={(e) => {
                  setValue("confirmPassword", e.target.value);
                  trigger("confirmPassword");
                }}
              />
               <div
                className="show-hide1"
                onClick={() => setToggleConPassword(!toggleConPassword)}
              >
                <i
                  style={{ cursor: "pointer" }}
                  className={toggleConPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                ></i>
              </div>
              {watch("cus_password") && errors.confirmPassword?.message && (
                <span
                  className="invalid"
                  style={{
                    color: "#e85347",
                    fontSize: "11px",
                    fontStyle: "italic",
                  }}
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center align-items-center">
          <Button
            form="updateForm"
            color="primary"
            size="md"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" color="light" /> : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UserDetailUpdate;
