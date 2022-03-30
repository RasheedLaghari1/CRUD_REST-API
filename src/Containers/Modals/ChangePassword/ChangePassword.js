import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Success from "../Success/Success";
import cookie from "react-cookies";
import "./ChangePassword.css";
import { connect } from "react-redux";
import {
  resetPassword,
  clearUserStates,
} from "../../../Actions/UserActions/UserActions";
import { toast } from "react-toastify";

const ChangePassword = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    openSuccessModal: false,
    userPassword: "",
    confirmUserPassword: "",
    previousPassword: "",
    formErrors: {
      userPassword: "",
      confirmUserPassword: "",
      previousPassword: "",
    },
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const openModal = (name) => {
    setState((prev) => ({ ...prev, [name]: true }));
  };
  const closeModal = (name) => {
    setState((prev) => ({ ...prev, [name]: false }));
  };

  const validateField = async (name, value) => {
    let formErrors = state.formErrors;

    let strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})"
    );
    switch (name) {
      case "previousPassword":
        if (value.length < 1) {
          formErrors.previousPassword = "This Field is Required.";
        } else {
          formErrors.previousPassword = "";
        }
        break;
      case "userPassword":
        if (value.length < 1) {
          formErrors.userPassword = "This Field is Required.";
        } else if (!strongRegex.test(value)) {
          formErrors.userPassword =
            "password length should be 10 or greater and It must contain 'special characters, uppercase, lowercase and numbers'";
        } else if (state.confirmUserPassword) {
          if (value !== state.confirmUserPassword) {
            formErrors.confirmUserPassword = "Password not matched.";
            formErrors.userPassword = "";
          } else {
            formErrors.confirmUserPassword = "";
            formErrors.userPassword = "";
          }
        } else {
          formErrors.userPassword = "";
        }
        break;
      case "confirmUserPassword":
        if (value.length < 1) {
          formErrors.confirmUserPassword = "This Field is Required.";
        } else if (state.userPassword !== value) {
          formErrors.confirmUserPassword = "Password not matched.";
        } else {
          formErrors.confirmUserPassword = "";
        }
        break;
      default:
        break;
    }
    setState((prev) => ({
      ...prev,
      formErrors,
    }));
  };
  const handleFieldChange = async (e) => {
    let { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };
  const onProceed = async () => {
    let formErrors = state.formErrors;
    if (!state.previousPassword) {
      formErrors.previousPassword = "This Field is Required.";
    }
    if (!state.userPassword) {
      formErrors.userPassword = "This Field is Required.";
    }
    if (!state.confirmUserPassword) {
      formErrors.confirmUserPassword = "This Field is Required.";
    } else if (state.userPassword !== state.confirmUserPassword) {
      formErrors.confirmUserPassword = "Password not matched.";
    }

    setState((prev) => ({ ...prev, formErrors }));

    if (
      !formErrors.previousPassword &&
      !formErrors.userPassword &&
      !formErrors.confirmUserPassword
    ) {
      let data = {
        actionType: "ResetPassword",
        previousPassword: state.previousPassword,
        userPassword: state.userPassword,
      };

      setState((prev) => ({ ...prev, isLoading: true }));

      //change password
      await dispatch(resetPassword(data)); //call api to reset your password

      clearStates();
    }
  };
  //success or error case of resset password
  useEffect(() => {
    //success case
    if (user.resetPasswordSuccess) {
      //also update password in cookies
      let chkPass = cookie.load("userPassword");
      if (chkPass) {
        cookie.save("userPassword", state.userPassword, {
          path: "/",
        });
      }
      toast.success(user.resetPasswordSuccess);
      props.closeModal("openChangePasswordModal");
      openModal("openSuccessModal");
      dispatch(clearUserStates());
    }
    //error case of
    if (user.resetPasswordError) {
      toast.error(user.resetPasswordError);
      dispatch(clearUserStates());
    }
  }, [user]);

  const clearStates = () => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      previousPassword: "",
      userPassword: "",
      confirmUserPassword: "",
      formErrors: {
        previousPassword: "",
        userPassword: "",
        confirmUserPassword: "",
      },
    }));
  };

  //close this modal
  const closeChangePassModal = () => {
    props.closeModal("openChangePasswordModal");
    clearStates();
  };
  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openChangePasswordModal}
        onHide={closeChangePassModal}
        className="forgot_email_modal"
      >
        <Modal.Body>
          <div className="container-fluid">
            <div className="main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header">
                      <div className="row">
                        {/* <i onClick={()=>props.closeModal('closeModals')} className="fa fa-times forgot_security_modal_closed"></i> */}
                        <div className="col-12 order-xs-2">
                          <h4 className="text-center modal-title">
                            Change Password
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="forgot_form">
                            <label className="model-p text-left">
                              Enter Your Previous Password & New Password Below
                              to Change Your Password
                            </label>
                            <div className="form-group">
                              <input
                                type="password"
                                className="form-control modal-text-input"
                                id="code"
                                placeholder="Previous Password"
                                name="previousPassword"
                                value={state.previousPassword}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.previousPassword !== ""
                                  ? state.formErrors.previousPassword
                                  : ""}
                              </div>
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                className="form-control modal-text-input"
                                id="code"
                                placeholder="New Password"
                                name="userPassword"
                                value={state.userPassword}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.userPassword !== ""
                                  ? state.formErrors.userPassword
                                  : ""}
                              </div>
                            </div>
                            <div className="form-group">
                              <input
                                type="password"
                                className="form-control modal-text-input"
                                id="code"
                                placeholder="Confirm New Password"
                                name="confirmUserPassword"
                                value={state.confirmUserPassword}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.confirmUserPassword !== ""
                                  ? state.formErrors.confirmUserPassword
                                  : ""}
                              </div>
                            </div>
                            <div className="bottom_btns">
                              <button
                                onClick={closeChangePassModal}
                                type="button"
                                className="btn_white float-left"
                              >
                                Back
                              </button>
                              <button
                                onClick={onProceed}
                                type="button"
                                className="btn_blue float-right "
                              >
                                Proceed
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Success
        openModal={openModal}
        closeModal={closeModal}
        openSuccessModal={state.openSuccessModal}
      />
    </>
  );
};

export default ChangePassword;
