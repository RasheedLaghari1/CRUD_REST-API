import React, { Component } from "react";
// import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import "./ResetPassword.css";
import PinCode from "../PinCode/PinCode";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  checkCompany,
  requestPinCode,
  clearUserStates,
} from "../../../Actions/UserActions/UserActions";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openPinCodeModal: false,
      userLogin: "",
      companyID: "",
      formErrors: {
        userLogin: "",
        companyID: "",
      },
    };
  }
  componentWillReceiveProps() {
    setTimeout(() => {
      let id = document.getElementById("userLogin2");
      if (id && !this.state.isLoading) {
        document.getElementById("userLogin2").focus();
      }
    }, 100);

  }
  openModal = async (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "userLogin":
        if (value.length < 1) {
          formErrors.userLogin = "This Field is Required.";
        } else {
          formErrors.userLogin = "";
        }
        break;
      case "companyID":
        if (value.length < 1) {
          formErrors.companyID = "This Field is Required.";
        } else {
          formErrors.companyID = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  handleFieldChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  };
  checkCompany = async (e) => {
    e.preventDefault();

    let formErrors = this.state.formErrors;
    if (!this.state.userLogin) {
      formErrors.userLogin = "This Field is Required.";
    }
    if (!this.state.companyID) {
      formErrors.companyID = "This Field is Required.";
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.userLogin && !formErrors.companyID) {

      this.setState({ isLoading: true });

      let server1 = "https://ezypo.com.au:5447";
      let server2 = "https://ezypo2.tphglobal.com:5447";

      const { companyID } = this.state;
      await this.props.checkCompany(server1, companyID);

      if (this.props.user.checkCompanySuccess) {
        toast.success(this.props.user.checkCompanySuccess);

        localStorage.setItem("API_URL", server1);
        await this.onProceed();
      } else {
        await this.props.checkCompany(server2, companyID);
        if (this.props.user.checkCompanySuccess) {
          toast.success(this.props.user.checkCompanySuccess);
          localStorage.setItem("API_URL", server2);
          await this.onProceed();
        } else {
          if (this.props.user.checkCompanyError) {
            toast.error(this.props.user.checkCompanyError);
          }
        }
      }

      this.setState({ isLoading: false });
      this.props.clearUserStates(); //clear states in main store
    }
  };

  onProceed = async () => {
    let data = {
      actionType: "RequestPinCode",
      userLogin: this.state.userLogin,
      companyID: this.state.companyID,
    };
    //request for pin code
    await this.props.requestPinCode(data); //call request pin code api
    //success case of requestiong pin code
    if (this.props.user.reqPinCodeSuccess) {
      toast.success(this.props.user.reqPinCodeSuccess);
      this.props.closeModal("openResetPasswordModal");
      this.openModal("openPinCodeModal");
    }
    //error case of requestiong pin code
    if (this.props.user.reqPinCodeError) {
      toast.error(this.props.user.reqPinCodeError);
    }
  };
  clearStates = () => {
    this.setState({
      userLogin: "",
      companyID: "",
      formErrors: {
        userLogin: "",
        companyID: "",
      },
    });
  };

  //close this modal
  closeRessetpassModal = async () => {
    this.props.closeModal("openResetPasswordModal");
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
          show={this.props.openResetPasswordModal}
          onHide={this.closeRessetpassModal}
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
                            <p className="model-p text-center">
                              Enter your User Login & Company ID below to reset
                              your password
                            </p>
                            <div className="forgot_form">
                              <form onSubmit={this.checkCompany}>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control modal-text-input"
                                    id="userLogin2"
                                    placeholder="User Login"
                                    name="userLogin"
                                    value={this.state.userLogin}
                                    onChange={this.handleFieldChange}
                                    tabIndex="4"
                                  />

                                  <div className="text-danger error-12">
                                    {this.state.formErrors.userLogin !== ""
                                      ? this.state.formErrors.userLogin
                                      : ""}
                                  </div>
                                </div>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control modal-text-input"
                                    id="companyID2"
                                    placeholder="Company ID"
                                    name="companyID"
                                    value={this.state.companyID}
                                    onChange={this.handleFieldChange}
                                    tabIndex="5"
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.companyID !== ""
                                      ? this.state.formErrors.companyID
                                      : ""}
                                  </div>
                                </div>
                                <div className="bottom_btns">
                                  <button
                                    onClick={this.closeRessetpassModal}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn btn_white float-left btn_focus"
                                        : "btn btn_white float-left"
                                    }
                                    id="id_cancel"
                                    tabIndex="7"
                                    onFocus={(e) => this.setState({ [e.target.id]: true })}
                                    onBlur={(e) => this.setState({ [e.target.id]: false })}
                                  >
                                    Back
                                </button>
                                  <button
                                    type="submit"
                                    tabIndex="6"
                                    className={
                                      this.state.id_proceed
                                        ? "btn btn_blue float-right btn_focus"
                                        : "btn btn_blue float-right"
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

        <PinCode
          openModal={this.openModal}
          closeModal={this.closeModal}
          openResetPasswordModal={this.props.openModal}
          openPinCodeModal={this.state.openPinCodeModal}
          userLogin={this.state.userLogin}
          companyID={this.state.companyID}
          clearStates={this.clearStates}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  checkCompany,
  requestPinCode,
  clearUserStates,
})(ResetPassword);
