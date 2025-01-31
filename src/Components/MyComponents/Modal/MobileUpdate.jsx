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

const MobileUpdate = ({
  isOpenCustomer,
  handleClose,
  id,
  fetchUsers,
  rowData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { mobile: "", name: "", email: "" },
  });
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const onFormSubmit = async (data) => {
    if (!data.name && !data.mobile && !data.email) {
      handleClose();
      return;
    }

    try {
      setIsLoading(true);

      const formData = {
        ...(data.mobile && { mobile: data.mobile }),
        ...(id && { id }), // Always include `id` if available
        ...(data.name && { uniqueCode: data.name }),
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
      <Modal
        isOpen={isOpenCustomer}
        toggle={handleClearClose}
        backdrop="static"
      >
        <ModalHeader
          toggle={handleClearClose}
          className="d-flex justify-content-center align-items-center"
        >
          Update Customer Details <br></br>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: "14px" }}
          >
            ({rowData?.name})
          </div>
        </ModalHeader>
        <hr></hr>
        <ModalBody>
          <form  id="updateForm" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <Label className="from-label" htmlFor="name">
                Name
              </Label>
              <div className="form-control-wrap">
                <input
                  placeholder="Enter Username"
                  type="text"
                  id="name"
                  {...register("name", {
                    pattern: {
                      value: /^[a-zA-Z0-9 _-]*$/,
                      message:
                        "Only alpha-numeric, space, _ and - are allowed.",
                    },
                  })}
                  className="form-control"
                  value={watch("name")}
                  onChange={(e) => {
                    setValue("name", e.target.value);
                    trigger("name");
                  }}
                />
                {errors.name && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errors?.name?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="form-group">
              <Label className="from-label" htmlFor="mobile">
                Mobile Number
              </Label>
              <input
                placeholder="Enter Mobile Number"
                type="text"
                id="mobile"
                {...register("mobile", {
                  // required: "Mobile Number is  required.",
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
            <label for="email"className="form-label">Email</label>
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
          </form>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center align-items-center">
          <Button
            color="primary"
            size="md"
            type="submit"
            form="updateForm" 
            style={{ marginTop: "20px" }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" color="light" /> : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MobileUpdate;
