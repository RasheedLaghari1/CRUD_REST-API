import React, { Component } from "react";
import { connect } from "react-redux";
import {
  logOutUser,
  getProductions,
  verifyPinCode,
  requestPinCode,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../Actions/UserActions/UserActions";
import { toast } from "react-toastify";

class VerifyCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      pinCode: "",
      formErrors: {
        pinCode: "",
      },
    };
  }
  componentWillMount = () => {
    if (this.props.location.state) {
      if (
        // !this.props.location.state.companyID &&
        !this.props.location.state.userLogin
      ) {
        this.props.history.push("/");
      }
    } else {
      this.props.history.push("/");
    }
  };

  handleFieldChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
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

  verifyCodeAndLogin = async () => {
    let formErrors = this.state.formErrors;
    if (!this.state.pinCode.trim()) {
      formErrors.pinCode = "This Field is Required.";
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.pinCode) {
      let data = {
        actionType: "VerifyPinCode",
        userLogin: this.props.location.state.userLogin,
        companyID: this.props.location.state.companyID || "",
        pinCode: this.state.pinCode.trim(),
      };
      this.setState({ isLoading: true });

      await this.props.verifyPinCode(data); //call api to verify pin code
      //success case
      if (this.props.user.verifyPinCodeSuccess) {
        // toast.success(this.props.user.verifyPinCodeSuccess);
        localStorage.removeItem("userContact");

        this.props.history.push("/login-table");
      }
      //error case of
      if (this.props.user.verifyPinCodeError) {
        toast.error(this.props.user.verifyPinCodeError);
      }

      this.setState({ isLoading: false });
      this.props.clearUserStates(); //clear states in main store
    }
  };

  resendPinCode = async () => {
    this.setState({ isLoading: true });
    let data = {
      actionType: "RequestPinCode",
      userLogin: this.props.location.state.userLogin,
      companyID: this.props.location.state.companyID,
    };
    //request for pin code
    await this.props.requestPinCode(data); //call request pin code api
    //success case of requestiong pin code
    if (this.props.user.reqPinCodeSuccess) {
      // toast.success(this.props.user.reqPinCodeSuccess);
      localStorage.setItem(
        "userContact",
        this.props.user.reqPinCode.userContact
      );

      this.setState({ pinCode: "" });
    }
    //error case of requestiong pin code
    if (this.props.user.reqPinCodeError) {
      toast.error(this.props.user.reqPinCodeError);
    }
    this.setState({ isLoading: false });
    this.props.clearUserStates(); //clear states in main store
  };

  logout = async () => {
    this.setState({ isLoading: true });

    await this.props.logOutUser(); //call user logout api
    //successfully logout
    if (this.props.user.logoutSuccess) {
      // toast.success(this.props.user.logoutSuccess);
      this.props.clearStatesAfterLogout();
      this.props.history.push("/login");
    }
    //error while logout user
    if (this.props.user.logoutError) {
      if (this.props.user.logoutError === "User has not logged in.") {
        this.props.history.push("/login");
        toast.error(this.props.user.logoutError);
        this.props.clearStatesAfterLogout();
      } else {
        toast.error(this.props.user.logoutError);
      }
    }
    this.setState({ isLoading: false });
  };

  render() {
    let userContact = localStorage.getItem("userContact") || "";
    return (
      <>
        <div className="container-fluid pl-0">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

          <div className="main-wrap">
            <div className="row">
              <div className="col-12 col-md-6 pr-sm-0 pr-xs-0 order2">
                <div className="left_slider">
                  <div
                    id="login_left_slider"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <ol className="carousel-indicators">
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="0"
                        className="active"
                      ></li>
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="1"
                      ></li>
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="2"
                      ></li>
                    </ol>
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <img
                          src="images/login-slider.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Welcome to Digital Paper Flow1</h5>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever, Lorem Ipsum has been the industry's
                            standard dummy text ever
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/login-slider.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Welcome to Digital Paper Flow2</h5>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever, Lorem Ipsum has been the industry's
                            standard dummy text ever
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/login-slider.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Welcome to Digital Paper Flow3</h5>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever, Lorem Ipsum has been the industry's
                            standard dummy text ever
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="copy_right">
                    @ Copyright TPH Technologies 2018
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 order1">
                <div className="login_side">
                  <div className="row">
                    <div className="col-12">
                      <div className="site_log">
                        <img
                          src="images/logo.png"
                          className="d-block img-fluid pl-sm-5"
                          alt="Logo"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="login_form">
                        <p className="text-center mb-sm-5">
                          In a few moments a 6-digit verification code will
                          <br /> be sent to {userContact}
                        </p>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Verification code"
                            name="pinCode"
                            value={this.state.pinCode}
                            onChange={this.handleFieldChange}
                          />
                          <div className="text-danger error-12">
                            {this.state.formErrors.pinCode !== ""
                              ? this.state.formErrors.pinCode
                              : ""}
                          </div>
                        </div>

                        <div className="row mt-100">
                          <div className="col text-right justify-content-end align-self-center">
                            <button
                              onClick={this.resendPinCode}
                              className="btn resend_code"
                            >
                              Resend Code
                            </button>
                          </div>
                          <div className="col-12">
                            <div className="login_btn">
                              <button
                                onClick={this.verifyCodeAndLogin}
                                type="submit"
                                className="btn btn-primary login_blue"
                              >
                                Login
                              </button>

                              <button
                                onClick={this.logout}
                                type="submit"
                                className="btn btn-primary login_white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="term">Term of use. Privacy policy.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  logOutUser,
  getProductions,
  verifyPinCode,
  requestPinCode,
  clearUserStates,
  clearStatesAfterLogout,
})(VerifyCode);
