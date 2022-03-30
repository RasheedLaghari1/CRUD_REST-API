import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Success from "../Success/Success";
import "./ConfirmPassword.css";
import { connect } from "react-redux";
import {
  resetPassword,
  clearUserStates
} from "../../../Actions/UserActions/UserActions";
import { toast } from "react-toastify";

class ConfirmPassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openSuccessModal: false,
      userPassword: "",
      confirmUserPassword: "",
      formErrors: {
        userPassword: "",
        confirmUserPassword: ""
      }
    };
  }
  openModal = name => {
    this.setState({ [name]: true });
  };
  closeModal = name => {
    this.setState({ [name]: false });
  };

  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})"
    );

    switch (name) {
      case "userPassword":
        if (value.length < 1) {
          formErrors.userPassword = "This Field is Required.";
        } else if (!strongRegex.test(this.state.userPassword)) {
          formErrors.userPassword =
            "password length should be 10 or greater and It must contain 'special characters, uppercase, lowercase and numbers'";
        } else if (this.state.confirmUserPassword) {
          if (this.state.userPassword !== this.state.confirmUserPassword) {
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
        } else if (this.state.userPassword !== this.state.confirmUserPassword) {
          formErrors.confirmUserPassword = "Password not matched.";
        } else {
          formErrors.confirmUserPassword = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors
    });
  };
  handleFieldChange = event => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [fieldName]: fieldValue }, () => this.validateField(fieldName, fieldValue));

  };
  onProceed = async (e) => {
    e.preventDefault();

    let formErrors = this.state.formErrors;
    if (!this.state.userPassword) {
      formErrors.userPassword = "This Field is Required.";
    }
    if (!this.state.confirmUserPassword) {
      formErrors.confirmUserPassword = "This Field is Required.";
    } else if (this.state.userPassword !== this.state.confirmUserPassword) {
      formErrors.confirmUserPassword = "Password not matched.";
    }
    this.setState({
      formErrors: formErrors
    });
    if (!formErrors.userPassword && !formErrors.confirmUserPassword) {
      let data = {
        actionType: "ResetPassword",
        userLogin: this.props.userLogin,
        companyID: this.props.companyID,
        userPassword: this.state.userPassword
      };
      this.setState({ isLoading: true });

      await this.props.resetPassword(data); //call api to reset your password
      //success case
      if (this.props.user.resetPasswordSuccess) {
        toast.success(this.props.user.resetPasswordSuccess);
        this.props.closeModal("openConfirmPasswordModal");
        this.openModal("openSuccessModal");
        this.props.clearStates(); //to clear states in resset password modal
      }
      //error case of
      if (this.props.user.resetPasswordError) {
        toast.error(this.props.user.resetPasswordError);
      }

      this.setState({ isLoading: false });
      this.props.clearUserStates(); //clear states in main store
      this.clearStates();
    }
  };

  clearStates = () => {
    this.setState({
      userPassword: "",
      confirmUserPassword: "",
      formErrors: {
        userPassword: "",
        confirmUserPassword: ""
      }
    });
  };

  //close this modal
  closeConfirmPassModal = async () => {
    this.props.openPinCodeModal("openPinCodeModal");
    this.props.closeModal("openConfirmPasswordModal");
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
          show={this.props.openConfirmPasswordModal}
          onHide={this.closeConfirmPassModal}
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
                                  Enter the password and confirm password
                              </label>
                                <div className="form-group">
                                  <input
                                    type="password"
                                    className="form-control modal-text-input"
                                    id="code"
                                    placeholder="New Password"
                                    name="userPassword"
                                    value={this.state.userPassword}
                                    onChange={this.handleFieldChange}
                                    tabIndex="7"
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.userPassword !== ""
                                      ? this.state.formErrors.userPassword
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
                                    value={this.state.confirmUserPassword}
                                    onChange={this.handleFieldChange}
                                    tabIndex="8"
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.confirmUserPassword !==
                                      ""
                                      ? this.state.formErrors.confirmUserPassword
                                      : ""}
                                  </div>
                                </div>
                                <div className="bottom_btns">
                                  <button
                                    onClick={this.closeConfirmPassModal}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn_white float-left btn_focus"
                                        : "btn_white float-left"
                                    }
                                    id="id_cancel"
                                    tabIndex="10"
                                    onFocus={(e) => this.setState({ [e.target.id]: true })}
                                    onBlur={(e) => this.setState({ [e.target.id]: false })}

                                  >
                                    Back
                                </button>
                                  <button
                                    type="submit"
                                    tabIndex="9"
                                    className={
                                      this.state.id_proceed
                                        ? "btn_blue float-right btn_focus"
                                        : "btn_blue float-right"
                                    }
                                    id="id_proceed"
                                    onFocus={(e) => this.setState({ [e.target.id]: true })}
                                    onBlur={(e) => this.setState({ [e.target.id]: false })}
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
        <Success
          openModal={this.openModal}
          closeModal={this.closeModal}
          openConfirmPasswordModal={this.props.openModal}
          openSuccessModal={this.state.openSuccessModal}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, {
  resetPassword,
  clearUserStates
})(ConfirmPassword);
