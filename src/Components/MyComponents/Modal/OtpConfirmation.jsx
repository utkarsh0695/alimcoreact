import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import OtpInput from "../../Common/Component/OtpInput";

const OtpConfirmation = (props) => {

  return (
    <Modal isOpen={props?.isOpen} >
      <ModalHeader toggle={props?.toggle}>Enter OTP</ModalHeader>
      <ModalBody>
        <OtpInput length={4} onChangeOTP={props?.setOtp} resetOtp={props?.resetOtp} />
        {/* <input
          type="text"
          value={props?.otp}
          onChange={(e) => props?.setOtp(e.target.value)}
          placeholder="Enter otp"
          minLength={4}
          maxLength={4}
          className="form-control"
        /> */}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props?.onVerifyOtp}
          disabled={props?.isLoading }
        >
          Submit
        </Button>{" "}
        <Button color="secondary" onClick={props?.handleResendOtp}
          disabled={props?.isLoading }
        >
          {props?.isLoading && props?.verifyCount ? (
            <>
              Resend in ({props?.resetTimer}s) <Spinner size="sm" color="light" />
            </>
          ) : (
            "Resend"
          )}
        </Button>{" "}
        {/* <Button color="secondary" onClick={props?.handleResendOtp}  >
          Resend
        </Button> */}
      </ModalFooter>
    </Modal>
  );
};

export default OtpConfirmation;
