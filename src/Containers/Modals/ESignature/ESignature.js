import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Base64 from "base-64";
import { toBase64 } from '../../../Utils/Helpers';

import * as UserActions from "../../../Actions/UserActions/UserActions";
class ESignature extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      sigType: "Typed",
      signature: "",
      signatureImage: ""
    };
  }
  componentDidUpdate(p) {
    //set signature in signature pad
    // this.sigPadPro ref only be accessed when modal is open )
    if (this.props.openESignatureModal) {
      if (this.state.sigType == "Drawn" && !this.state.signatureImage) {
        this.sigPadPro.fromDataURL(this.state.signature);
      }
    }
  }
  async componentWillReceiveProps(nextProps) {
    //setting initials values
    if (
      !this.state.isLoading &&
      nextProps.user.getAccountDetails &&
      nextProps.user.getAccountDetails.accountDetails
    ) {
      //to display signature on canvas signature pad
      if (nextProps.user.getAccountDetails.accountDetails.sigType == "Drawn") {
        //this work is done in componentDidMount
        // this.sigPadPro.fromDataURL(
        //   nextProps.user.getAccountDetails.accountDetails.signature
        // );
        this.setState({
          signature: "",
          signatureImage:
            nextProps.user.getAccountDetails.accountDetails.signature ?
              nextProps.user.getAccountDetails.accountDetails.signature : ''
        });
      }
      //to display signature on Input Field
      if (nextProps.user.getAccountDetails.accountDetails.sigType == "Typed") {

        this.setState({
          signature: Base64.decode(
            nextProps.user.getAccountDetails.accountDetails.signature
          )
        });
      }
      this.setState({
        sigType:
          nextProps.user.getAccountDetails.accountDetails.sigType || "Typed"
      });
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
  handleTypedSignature = e => {
    this.setState({ sigType: "Typed", signature: e.target.value });

    if (this.state.signatureImage) {

      this.setState({ signatureImage: "" });
    } else {
      this.sigPadPro.clear();
    }
  };
  closeESModal = () => {
    this.setState({
      isLoading: false,
      sigType: "Typed",
      signature: ""
    });
    this.props.closeModal("openESignatureModal");
  };
  uploadSignatureImage = async e => {
    let type = e.target.files[0].type;
    let file = e.target.files[0];
    let size = e.target.files[0].size;
    if (type == "image/jpg" || type == "image/jpeg") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch(e => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          this.setState({
            sigType: "Drawn",
            signature: "",
            signatureImage: result
          });
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: 'JPG, JPEG'");
    }
  };
 
  onSave = async () => {
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

    //call update api here
    let userData = this.props.user.getAccountDetails.accountDetails;
    let updatedData = {
      ...userData,
      sigType,
      signature,
      flags: this.props.user.getAccountDetails.flags
    };

    await this.props.updateAccountDetails(updatedData);
    //Success case of Update User Account Details
    if (this.props.user.updateAccountDetailsSuccess) {
      // toast.success(this.props.user.updateAccountDetailsSuccess);
      this.closeESModal();
    }
    //Error case of Update User Account Details
    if (this.props.user.updateAccountDetailsError) {
      //if user not login then redirects it to login page
      if (
        this.props.user.updateAccountDetailsError == "User has not logged in."
      ) {
        this.props.props.history.push("/login");
        this.props.clearStatesAfterLogout();
        toast.error(this.props.user.updateAccountDetailsError);
      } else {
        //in case of Network Error
        toast.error(this.props.user.updateAccountDetailsError);
      }
    }

    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };
  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openESignatureModal}
          onHide={this.closeESModal}
          className="forgot_email_modal modal_704 mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid ">
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">
                                E-Signature
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.onSave}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                              <button
                                onClick={this.closeESModal}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-ban"></span>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row mt-4">
                          <div className="col-12">
                            <div className=" profile-tabs">
                              <ul className="nav nav-tabs">
                                <li className="nav-item">
                                  <a
                                    className={
                                      this.state.sigType == "Typed"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    data-toggle="tab"
                                    href="#home"
                                  >
                                    <span className="fa fa-keyboard-o mr-2"></span>{" "}
                                    Typed
                                  </a>
                                </li>
                                <li className="nav-item">
                                  <a
                                    className={
                                      this.state.sigType == "Drawn"
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    data-toggle="tab"
                                    href="#menu1"
                                  >
                                    <span className="fa fa-pencil mr-2"></span>{" "}
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
                                  id="home"
                                >
                                  <textarea
                                    rows="4"
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
                                  id="menu1"
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
                                        ref={ref => {
                                          this.sigPadPro = ref;
                                        }}
                                        onBegin={this.onStartSignature}
                                        penColor="black"
                                        canvasProps={{
                                          width: 500,
                                          height: 200,
                                          className: "sigCanvas"
                                        }}
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 mt-2">
                            <div className="form-group custon_select border text-center mb-0 border-rad-5">
                              <label
                                htmlFor="drag-es"
                                className="import_label border-0"
                              >
                                <img
                                  src="images/drag-file.png"
                                  className="import_icon img-fluid"
                                  alt="signature"
                                />
                              </label>

                              <input
                                type="file"
                                className="form-control d-none"
                                id="drag-es"
                                accept="image/jpeg,image/jpg"
                                onChange={this.uploadSignatureImage}
                                onClick={(event) => {
                                  event.currentTarget.value = null
                                }}//to upload the same file again
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, {
  updateAccountDetails: UserActions.updateAccountDetails,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout
})(ESignature);
