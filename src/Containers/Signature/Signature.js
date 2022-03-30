import React, { Component } from "react";
import SignatureCanvas from "react-signature-canvas";
import { connect } from "react-redux";
import Base64 from "base-64";
import { toast } from "react-toastify";

import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import * as UserActions from "../../Actions/UserActions/UserActions";
import { handleAPIErr, toBase64 } from "../../Utils/Helpers";

import ModileResponsiveMenu from "../../Components/modileResponsiveMenu";

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      sigType: "Typed",
      signature: "",
      signatureImage: "",
    };
  }

  async componentDidMount() {
    let promises = [];
    let accntVals = localStorage.getItem("getAccountDetails") || "";
    accntVals = accntVals ? JSON.parse(accntVals) : "";
    if (accntVals && accntVals.accountDetails) {
      //if localstorage contains the account details then update the Redux State no need to call API
      store.dispatch({
        type: "GET_ACCOUNT_DETAILS_SUCCESS",
        payload: accntVals,
      });
    } else {
      promises.push(this.props.getAccountDetails());
    }
    await Promise.all(promises);
    if (this.props.user.getAccountDetailsError) {
      handleAPIErr(this.props.user.getAccountDetailsError, this.props);
    }

    this.props.clearUserStates();
    this.setState({ isLoading: false });
  }

  async componentWillReceiveProps() {
    if (
      this.props.user.getAccountDetailsSuccess ||
      this.props.user.updateAccountDetailsSuccess
    ) {
      let accountDetails =
        (this.props.user.getAccountDetails &&
          this.props.user.getAccountDetails.accountDetails) ||
        "";
      if (accountDetails) {
        this.setState({
          signature: "",
          signatureImage: "",
        });
        if (!this.state.signatureImage) {
          // this.sigPad.clear();
        }
        if (accountDetails.sigType == "Drawn") {
          if (
            this.state.sigType == "Drawn" &&
            !this.state.signatureImage &&
            this.sigPad
          ) {
            this.sigPad.fromDataURL(accountDetails.signature);
          }
          this.setState({
            signature: "",
            signatureImage: accountDetails.signature || "",
          });
        }
        //to display signature on Input Field
        if (accountDetails.sigType == "Typed") {
          this.setState({
            signature: Base64.decode(accountDetails.signature),
          });
        }

        this.setState({
          sigType: accountDetails.sigType || "Typed",
        });
      }
    }
  }

  //this function trigers when user start signature writing
  onStartSignature = () => {
    this.setState({ sigType: "Drawn", signature: "" });
  };

  //clear canvas signature
  clearSignature = () => {
    if (this.state.signatureImage) {
      this.setState({ signatureImage: "" });
    } else {
      this.sigPadPro.clear();
    }
  };

  handleTypedSignature = async (e) => {
    this.setState({ sigType: "Typed", signature: e.target.value });
    if (this.state.signatureImage) {
      this.setState({ signatureImage: "" });
    } else {
      this.sigPadPro.clear();
    }
  };

  onSave = async (e) => {
    e.preventDefault();

    let sigType = this.state.sigType; // either 'Typed' OR 'Drawn'
    let signature = this.state.signature;

    if (sigType == "Typed") {
      signature = Base64.encode(signature);
    }
    if (sigType == "Drawn") {
      if (this.state.signatureImage) {
        signature = this.state.signatureImage;
      } else {
        signature = this.sigPadPro.toDataURL();
      }
    }

    this.setState({ isLoading: true });

    let userData = this.props.user.getAccountDetails.accountDetails;
    //call update api here
    let updatedData = {
      ...userData,
      sigType,
      signature,
    };

    await this.props.updateAccountDetails(updatedData);
    //Success case of Update User Account Details
    if (this.props.user.updateAccountDetailsSuccess) {
      // toast.success(this.props.user.updateAccountDetailsSuccess);
      //settings 'Show On dashboard'

      //update getAccountDetails in localstorage then no need to call API again
      let getAccountDetails = JSON.parse(
        localStorage.getItem("getAccountDetails") || "{}"
      );

      if (getAccountDetails.accountDetails) {
        let updatedDetails = {
          ...getAccountDetails,
          accountDetails: {
            ...updatedData,
            avatar: updatedData.avatar.split(",")[1],
            signature:
              this.state.sigType === "Drawn"
                ? updatedData.signature.split(",")[1]
                : updatedData.signature,
          },
          // flags: [...updatedData.flags],
          // results: [...getAccountDetails.results],
        };
        localStorage.setItem(
          "getAccountDetails",
          JSON.stringify(updatedDetails)
        );
      }

      this.props.history.push("/dashboard");
    }
    //Error case of Update User Account Details
    if (this.props.user.updateAccountDetailsError) {
      handleAPIErr(this.props.user.updateAccountDetailsError, this.props);
    }

    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };

  onDiscard = () => {
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <>
        <div className="dashboard">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

          {/* top nav bar */}
          <Header props={this.props} settings={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <form onSubmit={this.onSave}>
                <div className="container-fluid ">
                  <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad Setting_main">
                          {/* user's Details Code start */}
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main w-sm-100">
                                  <button type="submit" className="btn-save">
                                    <span className="fa fa-check "></span>
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-save"
                                    onClick={this.onDiscard}
                                  >
                                    <span className="fa fa-ban"></span>
                                    Discard
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="forgot_header mt-4">
                            <div className="modal-top-header">
                              <div className="row bord-btm">
                                <div className="col-auto pl-0">
                                  <h6 className="text-left def-blue">
                                    <span>
                                      {" "}
                                      <img
                                        src="images/arrow_up.png"
                                        className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                        alt="arrow_up"
                                        data-toggle="collapse"
                                        data-target="#Signature"
                                      />{" "}
                                    </span>
                                    User Signature
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Signature">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-12">
                                  <div className=" profile-tabs">
                                    <ul className="nav nav-tabs">
                                      <li className="nav-item">
                                        <a
                                          id="typed"
                                          className={
                                            this.state.sigType == "Typed"
                                              ? "nav-link active"
                                              : "nav-link"
                                          }
                                          data-toggle="tab"
                                          href="#home11"
                                        >
                                          <span
                                            htmlFor="typed"
                                            className="fa fa-keyboard-o mr-2"
                                          ></span>{" "}
                                          Typed
                                        </a>
                                      </li>
                                      <li className="nav-item">
                                        <a
                                          id="drawn"
                                          className={
                                            this.state.sigType == "Drawn"
                                              ? "nav-link active"
                                              : "nav-link"
                                          }
                                          data-toggle="tab"
                                          href="#menu11"
                                        >
                                          <span
                                            htmlFor="drawn"
                                            className="fa fa-pencil mr-2"
                                          ></span>{" "}
                                          Drawn
                                        </a>
                                      </li>
                                    </ul>

                                    <div className="tab-content">
                                      <div
                                        className={
                                          this.state.sigType == "Typed"
                                            ? "tab-pane container active"
                                            : "tab-pane container fade"
                                        }
                                        // className="tab-pane container fade"
                                        id="home11"
                                      >
                                        <textarea
                                          rows="4"
                                          id="ddd"
                                          className="sig-text"
                                          onChange={this.handleTypedSignature}
                                          value={
                                            this.state.sigType == "Typed"
                                              ? this.state.signature
                                              : ""
                                          }
                                        />
                                      </div>
                                      <div
                                        className={
                                          this.state.sigType == "Drawn"
                                            ? "tab-pane container active"
                                            : "tab-pane container"
                                        }
                                        // className="tab-pane container active"

                                        id="menu11"
                                      >
                                        {" "}
                                        <i
                                          onClick={this.clearSignature}
                                          className="fa fa-trash clear_sign"
                                        ></i>{" "}
                                        {this.state.signatureImage ? (
                                          <img
                                            className="d-block img-fluid mx-auto"
                                            src={this.state.signatureImage}
                                            // alt="user"
                                          />
                                        ) : (
                                          <SignatureCanvas
                                            id="canvas"
                                            ref={(ref) => {
                                              this.sigPadPro = ref;
                                            }}
                                            onBegin={this.onStartSignature}
                                            penColor="black"
                                            canvasProps={{
                                              width: 500,
                                              height: 200,
                                              className: "sigCanvas",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* end */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
          {/* end */}
        </div>
        <ModileResponsiveMenu props={this.props} active="signature" />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  getAccountDetails: UserActions.getAccountDetails,
  clearUserStates: UserActions.clearUserStates,
  updateAccountDetails: UserActions.updateAccountDetails,
})(Settings);
