import React, { Component } from "react";
// import { Link } from "react-router-dom";
import ConfirmPassword from "../ConfirmPassword/ConfirmPassword";
import Modal from "react-bootstrap/Modal";
import "./PinCode.css";
import { connect } from "react-redux";
import {
  verifyPinCode,
  requestPinCode,
  clearUserStates,
} from "../../../Actions/UserActions/UserActions";
import { toast } from "react-toastify";

class PinCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openConfirmPasswordModal: false,
      pinCode: "",
      formErrors: {
        pinCode: "",
      },
    };
  }

  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "pinCode":
        if (value.length < 1) {
          formErrors.pinCode = "This Field is Required.";
        } else {
          formErrors.pinCode = "";
        }
        break;

      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  handleFieldChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  };
  onProceed = async (e) => {
    e.preventDefault();

    let formErrors = this.state.formErrors;
    if (!this.state.pinCode) {
      formErrors.pinCode = "This Field is Required.";
    }
    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.pinCode) {
      let data = {
        actionType: "VerifyPinCode",
        userLogin: this.props.userLogin,
        companyID: this.props.companyID,
        pinCode: this.state.pinCode,
      };
      this.setState({ isLoading: true });

      await this.props.verifyPinCode(data); //call api to verify pin code
      //success case
      if (this.props.user.verifyPinCodeSuccess) {
        toast.success(this.props.user.verifyPinCodeSuccess);
        this.props.closeModal("openPinCodeModal");
        this.openModal("openConfirmPasswordModal");
      }
      //error case of
      if (this.props.user.verifyPinCodeError) {
        toast.error(this.props.user.verifyPinCodeError);
      }

      this.setState({ isLoading: false });
      this.props.clearUserStates(); //clear states in main store

      this.clearStates();
    }
  };
  clearStates = () => {
    this.setState({
      pinCode: "",
      formErrors: {
        pinCode: "",
      },
    });
  };
  resendPinCode = async () => {
    this.setState({ isLoading: true });
    let data = {
      actionType: "RequestPinCode",
      userLogin: this.props.userLogin,
      companyID: this.props.companyID,
    };
    //request for pin code
    await this.props.requestPinCode(data); //call request pin code api
    //success case of requestiong pin code
    if (this.props.user.reqPinCodeSuccess) {
      toast.success(this.props.user.reqPinCodeSuccess);
      this.setState({ pinCode: "" });
    }
    //error case of requestiong pin code
    if (this.props.user.reqPinCodeError) {
      toast.error(this.props.user.reqPinCodeError);
    }
    this.setState({ isLoading: false });
    this.props.clearUserStates(); //clear states in main store
  };

  //close this modal
  closePinCodeModal = async () => {
    this.props.openResetPasswordModal("openResetPasswordModal");
    this.props.closeModal("openPinCodeModal");
    this.clearStates();
  };
  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openPinCodeModal}
          onHide={this.closePinCodeModal}
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
                          {/* <i onClick={()=>this.props.closeModal('closeModals')} className="fa fa-times forgot_security_modal_closed"></i> */}
                          <div className="col-12 order-xs-2">
                            <h4 className="text-center modal-title">
                              Reset Password
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12">
                            <div className="forgot_form">
                              <form onSubmit={this.onProceed}>
                                <label className="model-p text-left">
                                  Enter the PIN Code
                              </label>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control modal-text-input"
                                    id="pinCode"
                                    name="pinCode"
                                    placeholder="PIN Code"
                                    value={this.state.pinCode}
                                    onChange={this.handleFieldChange}
                                    tabIndex="6"
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.pinCode !== ""
                                      ? this.state.formErrors.pinCode
                                      : ""}
                                  </div>
                                  <link to="" />{" "}
                                  <span
                                    className="resend_pin float-right"
                                    onClick={this.resendPinCode}
                                  >
                                    Resend code
                                </span>
                                </div>
                                <div className="bottom_btns">
                                  <button
                                    onClick={this.closePinCodeModal}
                                    type="button"
                                    className="btn btn_white float-left"
                                  >
                                    Back
                                </button>
                                  <button
                                    type="submit"
                                    disabled={
                                      this.state.pinCode.length == 6
                                        ? false
                                        : true
                                    }
                                    className={`btn btn_blue float-right ${this.state.pinCode.length == 6
                                        ? ""
                                        : "disabled_btn"
                                      }`}
                                  >
                                    Proceed
                                </button>
                                </div>
                              </form>
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
        <ConfirmPassword
          openModal={this.state.openModal}
          closeModal={this.closeModal}
          openPinCodeModal={this.props.openModal}
          openConfirmPasswordModal={this.state.openConfirmPasswordModal}
          userLogin={this.props.userLogin}
          companyID={this.props.companyID}
          clearStates={this.props.clearStates} //to clear states in resset password modal
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  verifyPinCode,
  requestPinCode,
  clearUserStates,
})(PinCode);
