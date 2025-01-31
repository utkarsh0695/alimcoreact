import React, {
  Fragment,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { Btn, H4, P } from "../../../AbstractElements";
import {
  EmailAddress,
  ForgotPassword,
  Password,
  RememberPassword,
  SignIn,
} from "../../../Constant";
import Captcha from "../../../Components/Common/Component/Captcha";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../../../api/auth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { decrypt, encrypt } from "../../../security/Encrpt";
import Required from "../../../Components/MyComponents/Required";

const LoginTab = ({ selected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaTouched, setCaptchaTouched] = useState(false);
  const [captchaError, setCaptchaError] = useState(""); // To track if CAPTCHA has been interacted with
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setCaptchaTouched(true);
    if (!captchaValid) {
      setCaptchaError("Captcha is required");
      captchaRef.current.resetCaptcha();
      return;
    }
    const data = {
      email: formData.email,
      password: formData.password,
    };

    const encryptedData = encrypt(data);
    const encryptData = {
      zero: encryptedData,
    };
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    setIsLoading(true);
    // return false
    loginAPI(encryptData)
      .then((res) => {
        if (res.data.status === "success") {
          const decryptedResponse = decrypt(res.data.data);
          localStorage.setItem("base_url", decryptedResponse?.base_url);
          localStorage.setItem(
            "userDetail",
            JSON.stringify(decryptedResponse?.user)
          );
          setIsLoading(false);
          localStorage.setItem("login", JSON.stringify(true));
          localStorage.setItem("Name", decryptedResponse?.name);
          localStorage.setItem("accessToken", decryptedResponse?.user?.token);
          navigate("/dashboard", { replace: true });
          toast.success(res.data.message);
        } else if (res.data.status === "failed") {
          setIsLoading(false);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("catch error", err);
      });
  };
  //! To get current file name on which you are working console.log(__filename);
  React.useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, []);
  return (
    <Fragment>
      <Form className="theme-form" onSubmit={handleSubmit(onSubmit)}>
        <H4>{selected === "simpleLogin" ? "Sign In " : "Sign In"}</H4>
        <P>{"Enter your username & password to login"}</P>
        <FormGroup>
          <Label className="col-form-label">{"Username"}<Required/></Label>
          <Input
            placeholder="Enter Username"
            className="form-control"
            type="text"
            {...register("email", {
              required: "Username is required",
              // pattern: {
              //   value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
              //   message: "Invalid email address",
              // },
            })}
            // value={watch("email")}
            onChange={(e) => {
              setValue("email", e.target.value);
              trigger("email");
            }}
            autoComplete="email"
          />
          {errors.email && (
            <span
              className="invalid"
              style={{
                color: "#e85347",
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              {errors?.email?.message}
            </span>
          )}
        </FormGroup>
        <FormGroup className="position-relative">
          <Label className="col-form-label">{Password}<Required/></Label>
          <div className="position-relative">
            <Input
              placeholder="Enter password"
              className="form-control"
              type={togglePassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long.",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters.",
                },
              })}
              // value={watch("password")}
              onChange={(e) => {
                setValue("password", e.target.value);
                trigger("password");
              }}
              autoComplete="new-password"
            />
            {errors.password && (
              <span
                className="invalid"
                style={{
                  color: "#e85347",
                  fontSize: "11px",
                  fontStyle: "italic",
                }}
              >
                {errors?.password?.message}
              </span>
            )}
            <div
              className="show-hide"
              onClick={() => setTogglePassword(!togglePassword)}
            >
              <i
                style={{ cursor: "pointer" }}
                className={togglePassword ? "fa fa-eye" : "fa fa-eye-slash"}
              ></i>
            </div>
          </div>
        </FormGroup>
        <Captcha
          ref={captchaRef}
          setCaptchaValid={setCaptchaValid}
          setCaptchaError={setCaptchaError}
        />
        {captchaTouched && (
          <span
            className="invalid"
            style={{ color: "#e85347", fontSize: "11px", fontStyle: "italic" }}
          >
            {captchaError}
          </span>
        )}
        <div className="position-relative form-group mb-0">
          {/* <div className="checkbox">
            <Input id="checkbox1" type="checkbox" />
            <Label className="text-muted" htmlFor="checkbox1">
              {RememberPassword}
            </Label>
          </div>
          <Link
            className="link"
            to={`${process.env.PUBLIC_URL}/forgot-password`}
          >
            {ForgotPassword}
          </Link> */}
          {selected === "simpleLogin" && (
            <Button
              color="primary"
              className="d-block w-100 mt-5"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" color="light" /> : SignIn}
            </Button>
          )}
        </div>
      </Form>
    </Fragment>
  );
};

export default LoginTab;
