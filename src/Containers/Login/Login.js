import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";
import cookie from "react-cookies";
import ResetPassword from "../Modals/ResetPassword/ResetPassword";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as Validation from "../../Utils/Validation";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      userLogin: "",
      companyID: "",
      userPassword: "",
      rememberme: false,
      openResetPasswordModal: false,
      formErrors: {
        userLogin: "",
        companyID: "",
        userPassword: "",
      },
    };
  }

  componentWillMount = async () => {
    //Check User Cookies
    let chkUserLogin = cookie.load("userLogin");
    let chkCID = cookie.load("companyID");
    let chkPass = cookie.load("userPassword");
    if (
      chkUserLogin !== undefined &&
      chkCID !== undefined &&
      chkPass !== undefined
    ) {
      this.setState({
        userLogin: chkUserLogin,
        companyID: chkCID,
        userPassword: chkPass,
        rememberme: true,
      });
    }
  };

  async componentDidMount() {
    let id = document.getElementById("name");
    if (id) {
      document.getElementById("name").focus();
    }
    this.setState({ isLoading: true });

    await this.props.getProductions();

    //success case of get Productions
    if (this.props.user.getProductionsSuccess) {
      // toast.success(this.props.user.getProductionsSuccess);
      this.props.history.push("/dashboard");
    }
    //error case of get Productions
    if (this.props.user.getProductionsError) {
      let error = this.props.user.getProductionsError;
      if (
        error === "Session has expired. Please login again." ||
        error === "User has not logged in."
      ) {
        this.props.clearStatesAfterLogout();
      }
    }
    this.setState({ isLoading: false });
  }

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    let { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  // call checkCompany API before login API check company API tells us which server API url will be used in whole App as there are different API URLs
  checkCompany = async (e) => {
    e.preventDefault();

    let { userLogin, companyID, userPassword, formErrors } = this.state;

    formErrors = Validation.handleWholeValidation(
      { userLogin, companyID, userPassword },
      formErrors
    );

    if (
      !formErrors.userLogin &&
      !formErrors.companyID &&
      !formErrors.userPassword
    ) {
      this.setState({ isLoading: true });

      let server1 = "https://ezypo.com.au:5447";
      let server2 = "https://ezypo2.tphglobal.com:5447";

      await this.props.checkCompany(server1, companyID);

      if (this.props.user.checkCompanySuccess) {
        // toast.success(this.props.user.checkCompanySuccess);

        localStorage.setItem("API_URL", server1);
        await this.login();
      } else {
        await this.props.checkCompany(server2, companyID);
        if (this.props.user.checkCompanySuccess) {
          // toast.success(this.props.user.checkCompanySuccess);
          localStorage.setItem("API_URL", server2);
          await this.login();
        } else {
          if (this.props.user.checkCompanyError) {
            toast.error(this.props.user.checkCompanyError);
          }
        }
      }

      this.setState({ isLoading: false });

      this.props.clearUserStates(); //clear states in main store
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  login = async () => {
    let userData = {
      actionType: "LoginUser",
      userLogin: this.state.userLogin,
      companyID: this.state.companyID,
      userPassword: this.state.userPassword,
    };

    await this.props.logInUser(userData); //call login api

    //login error case
    if (this.props.user.loginError) {
      if (this.props.user.loginError === "User is already logged in.") {
        this.props.history.push("/dashboard");
      } else {
        toast.error(this.props.user.loginError);
      }
    }
    //login success case
    if (this.props.user.loginSuccess) {
      //toast.success(this.props.user.loginSuccess);

      localStorage.setItem("userLogin", this.state.userLogin.toLowerCase());
      //set cookies
      if (this.state.rememberme) {
        cookie.save("userLogin", this.state.userLogin, {
          path: "/",
        });
        cookie.save("companyID", this.state.companyID, {
          path: "/",
        });
        cookie.save("userPassword", this.state.userPassword, {
          path: "/",
        });
      } else {
        cookie.remove("userLogin", {
          path: "/",
        });
        cookie.remove("companyID", {
          path: "/",
        });
        cookie.remove("userPassword", {
          path: "/",
        });
      }

      //to change password if 'RessetPassword = Y'
      let resetPassword =
        this.props.user.loginResp &&
        this.props.user.loginResp.resetPassword &&
        this.props.user.loginResp.resetPassword.toLowerCase() === "y"
          ? true
          : false;

      //redirect to verify/two factor page if 'twoFactor = Y'
      let twoFactor =
        this.props.user.loginResp &&
        this.props.user.loginResp.twoFactor &&
        this.props.user.loginResp.twoFactor.toLowerCase() === "y"
          ? true
          : false;

      if (resetPassword) {
        this.props.history.push("/ressetPassword", { ressetPassword: true });
      } else if (!twoFactor) {
        this.props.history.push("/login-table");
      } else {
        let data = {
          actionType: "RequestPinCode",
          userLogin: this.state.userLogin,
          companyID: this.state.companyID,
        };

        await this.props.requestPinCode(data); //call request pin code api

        //success case of requestiong pin code
        if (this.props.user.reqPinCodeSuccess) {
          toast.success(this.props.user.reqPinCodeSuccess);
          localStorage.setItem(
            "userContact",
            this.props.user.reqPinCode.userContact
          );
          this.props.history.push("/verify", {
            userLogin: this.state.userLogin,
            companyID: this.state.companyID,
          });
        }
        //error case of requestiong pin code
        if (this.props.user.reqPinCodeError) {
          toast.error(this.props.user.reqPinCodeError);
        }
      }
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="container-fluid pl-0">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
          <div className="main-wrap">
            <div className="row">
              <div className="col-12 col-md-6 pr-sm-0 pr-xs-0 order2">
                <div className="left_slider">
                  <div
                    id="login_left_slider"
                    className="carousel slide mm_login_slider"
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
                          src="images/1st_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Dashboard Page</h5>
                          <p>
                            Your dashboard quickly shows you recent activity and
                            a summary of orders and invoices.
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/2nd_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Orders Screen</h5>
                          <p>
                            Visually see orders when drafting and approving.
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/3rd_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Invoices Screen</h5>
                          <p>OCR Invoices for quick entry and PO matching.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="login-badges">
                    <a
                      href="https://play.google.com/store/apps/details?id=tph.digital_paper_flow"
                      target="_blank"
                    >
                      <img
                        src="images/google-play-store.png"
                        className="img-fluid"
                        alt="google-play"
                      />
                    </a>
                    <a
                      href="https://apps.apple.com/app/id1576617760"
                      style={{
                        display: "inline-block",
                      }}
                      target="_blank"
                    >
                      <img
                        src="images/apple-store.png"
                        className="img-fluid"
                        alt="google-play"
                      />
                    </a>
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
                          className="d-block img-fluid"
                          alt="Logo"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="login_form">
                        <form onSubmit={this.checkCompany}>
                          <p>Welcome back! Please login to your account.</p>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              placeholder="User Login"
                              name="userLogin"
                              value={this.state.userLogin}
                              onChange={this.handleFieldChange}
                              tabIndex="1"
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
                              className="form-control"
                              id="id"
                              placeholder="Company ID"
                              name="companyID"
                              value={this.state.companyID}
                              onChange={this.handleFieldChange}
                              tabIndex="2"
                            />
                            <div className="text-danger error-12">
                              {this.state.formErrors.companyID !== ""
                                ? this.state.formErrors.companyID
                                : ""}
                            </div>
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              className="form-control"
                              id="pass"
                              placeholder="Password"
                              name="userPassword"
                              value={this.state.userPassword}
                              onChange={this.handleFieldChange}
                              tabIndex="3"
                            />
                            <div className="text-danger error-12">
                              {this.state.formErrors.userPassword !== ""
                                ? this.state.formErrors.userPassword
                                : ""}
                            </div>
                          </div>

                          <div className="row mt-35">
                            <div className="col align-self-center">
                              <div className="form-group remember_check mm_check2">
                                <input
                                  type="checkbox"
                                  id="remember"
                                  name="rememberme"
                                  checked={this.state.rememberme}
                                  onChange={(e) =>
                                    this.setState({
                                      rememberme: e.target.checked,
                                    })
                                  }
                                />
                                <label htmlFor="remember"> Remember Me</label>
                              </div>
                            </div>
                            <div className="col text-right align-self-center">
                              <button
                                type="button"
                                onClick={() =>
                                  this.openModal("openResetPasswordModal")
                                }
                                className="btn forgot_btn"
                              >
                                Forgot Password
                              </button>
                            </div>
                            <div className="col-12">
                              <div className="login_btn">
                                <button
                                  id="login"
                                  //  onKeyUp={this.onKeyDown}
                                  //  autoFocus
                                  type="submit"
                                  className="btn btn-primary login_blue"
                                >
                                  Login
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="term">Term of use. Privacy policy.</p>
              </div>
            </div>
          </div>
        </div>

        <ResetPassword
          openResetPasswordModal={this.state.openResetPasswordModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  checkCompany: UserActions.checkCompany,
  logInUser: UserActions.logInUser,
  getProductions: UserActions.getProductions,
  requestPinCode: UserActions.requestPinCode,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
  clearUserStates: UserActions.clearUserStates,
})(Login);
