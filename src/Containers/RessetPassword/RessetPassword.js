import React, { Component } from "react";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  logOutUser,
  resetPassword,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../Actions/UserActions/UserActions";
class RessetPassword extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      previousPassword: "",
      userPassword: "", //new password
      confirmUserPassword: "",
      formErrors: {
        previousPassword: "",
        userPassword: "",
        confirmUserPassword: "",
      },
    };
  }
  componentDidMount() {
    let { ressetPassword } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (!ressetPassword) {
      this.props.history.push("/login");
    }
  }

  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    var strongRegex = new RegExp(
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
      formErrors: formErrors,
    });
  };

  handleFieldChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    this.setState({ [fieldName]: fieldValue }, () =>
      this.validateField(fieldName, fieldValue)
    );
  };

  onProceed = async (e) => {
    e.preventDefault();

    let formErrors = this.state.formErrors;
    if (!this.state.previousPassword) {
      formErrors.previousPassword = "This Field is Required.";
    }
    if (!this.state.userPassword) {
      formErrors.userPassword = "This Field is Required.";
    }
    if (!this.state.confirmUserPassword) {
      formErrors.confirmUserPassword = "This Field is Required.";
    } else if (this.state.userPassword !== this.state.confirmUserPassword) {
      formErrors.confirmUserPassword = "Password not matched.";
    }

    this.setState({
      formErrors: formErrors,
    });
    if (
      !formErrors.previousPassword &&
      !formErrors.userPassword &&
      !formErrors.confirmUserPassword
    ) {
      let data = {
        actionType: "ResetPassword",
        previousPassword: this.state.previousPassword,
        userPassword: this.state.userPassword,
      };
      this.setState({ isLoading: true });

      await this.props.resetPassword(data); //call api to reset your password
      //success case
      if (this.props.user.resetPasswordSuccess) {
        toast.success(this.props.user.resetPasswordSuccess);
        this.props.history.push("/login-table");
      }
      //error case of
      if (this.props.user.resetPasswordError) {
        if (this.props.user.resetPasswordError === "User has not logged in.") {
          this.props.history.push("/login");
          toast.error(this.props.user.resetPasswordError);
          this.props.clearStatesAfterLogout();
        } else {
          toast.error(this.props.user.resetPasswordError);
        }
      }

      this.setState({ isLoading: false });
      this.props.clearUserStates(); //clear states in main store
      this.clearStates();
    }
  };

  clearStates = () => {
    this.setState({
      isLoading: false,
      previousPassword: "",
      userPassword: "", //new password
      confirmUserPassword: "",
      formErrors: {
        previousPassword: "",
        userPassword: "",
        confirmUserPassword: "",
      },
    });
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
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} CoA={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section id="">
              <div className="container-fluid ">
                <div className="main_wrapper p-10">
                  <div className="row d-flex justify-content-center h-60vh">
                    <div className="col-12 col-md-7 col-lg-6 col-xl-5 w-100 align-self-center">
                      <div className="forgot_form_main report_main">
                        <form onSubmit={this.onProceed}>
                          <div className="forgot_header">
                            <div className="modal-top-header bord-btm">
                              <div className="row">
                                <div className="col-auto">
                                  <h6 className="text-left def-blue">
                                    Reset Password
                                  </h6>
                                </div>
                                <div className="col d-flex justify-content-end s-c-main">
                                  <button
                                    type="submit"
                                    tabIndex="10"
                                    className={
                                      this.state.id_save
                                        ? "btn-save ml-0 btn_focus"
                                        : "btn-save ml-0"
                                    }
                                    id="id_save"
                                    onFocus={(e) =>
                                      this.setState({ [e.target.id]: true })
                                    }
                                    onBlur={(e) =>
                                      this.setState({ [e.target.id]: false })
                                    }
                                  >
                                    <span className="fa fa-check"></span>
                                    Save
                                  </button>
                                  <button
                                    onClick={this.logout}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    id="id_cancel"
                                    tabIndex="11"
                                    onFocus={(e) =>
                                      this.setState({ [e.target.id]: true })
                                    }
                                    onBlur={(e) =>
                                      this.setState({ [e.target.id]: false })
                                    }
                                  >
                                    <span className="fa fa-ban"></span>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="forgot_body px-3">
                            <div className="row mt-4">
                              <div className="col-12">
                                <div className="form-group custon_select">
                                  <div className="modal_input">
                                    <input
                                      type="password"
                                      className="form-control modal-text-input"
                                      id="code"
                                      placeholder="Previous Password"
                                      name="previousPassword"
                                      value={this.state.previousPassword}
                                      onChange={this.handleFieldChange}
                                      tabIndex="7"
                                      autoFocus
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .previousPassword !== ""
                                        ? this.state.formErrors.previousPassword
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-12">
                                <div className="form-group custon_select">
                                  <div className="modal_input">
                                    <input
                                      type="password"
                                      className="form-control modal-text-input"
                                      id="code"
                                      placeholder="New Password"
                                      name="userPassword"
                                      value={this.state.userPassword}
                                      onChange={this.handleFieldChange}
                                      tabIndex="8"
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.userPassword !== ""
                                        ? this.state.formErrors.userPassword
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group custon_select">
                                  <div className="modal_input">
                                    <input
                                      type="password"
                                      className="form-control modal-text-input"
                                      id="code"
                                      placeholder="Confirm New Password"
                                      name="confirmUserPassword"
                                      value={this.state.confirmUserPassword}
                                      onChange={this.handleFieldChange}
                                      tabIndex="9"
                                    />
                                    <div className="text-danger error-12">
                                      {this.state.formErrors
                                        .confirmUserPassword !== ""
                                        ? this.state.formErrors
                                            .confirmUserPassword
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* end */}
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
  resetPassword,
  clearUserStates,
  clearStatesAfterLogout,
})(RessetPassword);
