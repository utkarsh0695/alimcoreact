import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

const OtpInput = ({ length, onChangeOTP, resetOtp }) => {
  const [otp, setOTP] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    register("otp", {
      validate: (value) => {
        const otpValue = value || ""; // Handle empty values
        // Check if all fields are filled
        return otpValue.length === length &&
          otpValue.split("").every((char) => char !== "")
          ? true
          : "Please fill all OTP fields";
      },
    });
  }, [register, length]);

  useEffect(() => {
    if (resetOtp) {
      setOTP(Array(length).fill(""));
      inputRefs.current[0].focus();
      onChangeOTP("");
    }
  }, [resetOtp, length, onChangeOTP]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/^[0-9]$/)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      const otpValue = newOTP.join("");
      setValue("otp", otpValue);
      trigger("otp");
      if (index < length - 1) {
        inputRefs.current[index + 1].focus();
      }
      onChangeOTP(newOTP.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOTP = [...otp];
        newOTP[index] = "";
        setOTP(newOTP);
        onChangeOTP(newOTP.join(""));
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (e.key === "Delete" && index < length - 1) {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOTP = [...otp];
        newOTP[index] = "";
        setOTP(newOTP);
        onChangeOTP(newOTP.join(""));
      }
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            {...register("otp")}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={{
              width: "40px",
              height: "40px",
              textAlign: "center",
              fontSize: "24px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              boxShadow: "0 0 0 2px #FFFFFF",
            }}
          />
        ))}
      </div>
      {errors.otp && (
        <span style={{ color: "red", marginTop: "8px" }}>
          {errors.otp.message}
        </span>
      )}
    </div>
  );
};

export default OtpInput;
