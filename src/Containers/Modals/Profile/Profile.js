import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import Base64 from "base-64";
import ChangePassword from "../ChangePassword/ChangePassword";
import * as UserActions from "../../../Actions/UserActions/UserActions";
import {
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../../Utils/Helpers";
import Select from "react-select";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      userName: "",
      profilePhoto: "",
      signatureImage: "",
      email: "",
      mobileNumber: "",
      sigType: "Typed",
      signature: "",
      formErrors: {
        email: "",
        userName: "",
      },
      userType: "",

      backgroundImg: "",
      themeColor: "",
    };
  }

  componentDidMount() {
    let userType = localStorage.getItem("userLogin") || "";
    this.setState({
      userType: userType,
    });
  }

  componentDidUpdate(p) {
    //set signature in signature pad
    // this.sigPadPro ref only be accessed when modal is open )
    if (this.props.openProfileModal) {
      if (this.state.sigType == "Drawn" && !this.state.signatureImage) {
        this.sigPadPro.fromDataURL(this.state.signature);
      }
    }
  }

  async componentWillReceiveProps(nextProps) {
    await this.setState({
      themeColor: this.props.user.setting.Color || "",
      backgroundImg: this.props.user.setting.uploadBackgroundImage || "",
    });

    if (nextProps.openProfileModal !== this.props.openProfileModal) {
      //modal takes some time to display in DOM thats why we set settimout for adding Listeners
      setTimeout(() => {
        addDragAndDropFileListners(
          "drop-area-attach-modal",
          this.uploadSignatureImage
        );
      }, 300);
    }

    //setting initials values
    if (
      !this.state.isLoading &&
      nextProps.user.getAccountDetails &&
      nextProps.user.getAccountDetails.accountDetails
    ) {
      // alert(3)
      //to display signature on canvas signature pad
      if (nextProps.user.getAccountDetails.accountDetails.sigType == "Drawn") {
        //this work is done in componentDidMount
        // this.sigPadPro.fromDataURL(
        //   nextProps.user.getAccountDetails.accountDetails.signature
        // );
        await this.setState({
          signature: "",
          signatureImage: nextProps.user.getAccountDetails.accountDetails
            .signature
            ? nextProps.user.getAccountDetails.accountDetails.signature
            : "",
        });
      }
      //to display signature on Input Field
      if (nextProps.user.getAccountDetails.accountDetails.sigType == "Typed") {
        await this.setState({
          signature: Base64.decode(
            nextProps.user.getAccountDetails.accountDetails.signature
          ),
        });
      }
      await this.setState({
        userName:
          nextProps.user.getAccountDetails.accountDetails.userName || "",
        email: nextProps.user.getAccountDetails.accountDetails.email || "",
        mobileNumber:
          nextProps.user.getAccountDetails.accountDetails.mobileNumber || "",
        sigType:
          nextProps.user.getAccountDetails.accountDetails.sigType || "Typed",
        profilePhoto:
          nextProps.user.getAccountDetails.accountDetails.avatar || "",
      });
    }
  }
  handleFieldChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  };
  validateField = async (name, value) => {
    let email_pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let formErrors = this.state.formErrors;
    switch (name) {
      case "email":
        if (value.length < 1) {
          formErrors.email = "This Field is Required.";
        } else if (!email_pattern.test(value)) {
          formErrors.email = "Please enter valid email format.";
        } else {
          formErrors.email = "";
        }
        break;
      case "userName":
        if (value.length < 1) {
          formErrors.userName = "This Field is Required.";
        } else {
          formErrors.userName = "";
        }
        break;

      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
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
  closeProfileModal = async () => {
    this.setState({
      isLoading: false,
      openChangePasswordModal: false,
      email: "",
      mobileNumber: "",
      sigType: "Typed",
      signature: "",
      formErrors: {
        email: "",
      },
    });
    this.props.closeModal("openProfileModal");
    removeDragAndDropFileListners(
      "drop-area-attach-modal",
      this.uploadSignatureImage
    );
  };
  openModal = async (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  uploadProfilePhoto = async (e) => {
    let type = e.target.files[0].type;
    let file = e.target.files[0];
    let size = e.target.files[0].size;
    if (type == "image/jpg" || type == "image/jpeg" || type == "image/png") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          this.setState({ profilePhoto: result });
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: 'PNG, JPG, JPEG'");
    }
  };
  uploadSignatureImage = async (f) => {
    let type = f[0].type;
    let file = f[0];
    let size = f[0].size;
    if (type == "image/jpg" || type == "image/jpeg") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          this.setState({
            sigType: "Drawn",
            signature: "",
            signatureImage: result,
          });
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: 'JPG, JPEG'");
    }
  };
  uploadBackgroundImage = async (f) => {
    let type = f[0].type;
    let file = f[0];
    let size = f[0].size;
    if (type == "image/jpg" || type == "image/jpeg") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          this.setState({
            backgroundImg: result,
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
    let avatar = "";
    let {
      userName,
      email,
      mobileNumber,
      sigType, // either 'Typed' OR 'Drawn'
      signature,
      profilePhoto,
    } = this.state;
    avatar = profilePhoto;
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
    let formErrors = this.state.formErrors;
    if (!this.state.email) {
      formErrors.email = "This Field is Required.";
    }
    if (!this.state.userName) {
      formErrors.userName = "This Field is Required.";
    }

    this.setState({
      formErrors: formErrors,
    });
    if (
      !formErrors.userName &&
      !formErrors.email &&
      !formErrors.userSort &&
      !formErrors.userCode
    ) {
      //call update api here

      let userData = this.props.user.getAccountDetails.accountDetails;
      let updatedData = {
        ...userData,
        userName,
        email,
        mobileNumber,
        sigType,
        signature,
        avatar,
        flags: this.props.user.getAccountDetails.flags,
      };
      this.setState({ isLoading: true });
      await this.updatUserSetting();
      await this.props.updateAccountDetails(updatedData);
      //Success case of Update User Account Details
      if (this.props.user.updateAccountDetailsSuccess) {
        toast.success(this.props.user.updateAccountDetailsSuccess);

        //update getAccountDetails in localstorage then no need to call API again
        let getAccountDetails = JSON.parse(
          localStorage.getItem("getAccountDetails") || "{}"
        );
        if (getAccountDetails.accountDetails) {
          let updatedDetails = {
            accountDetails: {
              ...updatedData,
              avatar: updatedData.avatar.split(",")[1],
              // signature: updatedData.signature.split(',')[1],
              signature:
                this.state.sigType === "Drawn"
                  ? updatedData.signature.split(",")[1]
                  : updatedData.signature,
            },
            flags: [...updatedData.flags],
            results: [...getAccountDetails.results],
          };
          localStorage.setItem(
            "getAccountDetails",
            JSON.stringify(updatedDetails)
          );
        }

        this.closeProfileModal();
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
    }
  };

  updatUserSetting = async () => {
    debugger;
    let { themeColor, backgroundImg } = this.state;
    let setting = {
      Color: themeColor,
      uploadBackgroundImage: backgroundImg,
    };
    await this.props.updateThemeSetting(setting);
  };

  changeThemeColor = async (e) => {
    let { value } = e.target;
    this.setState({ themeColor: value });
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openProfileModal}
          onHide={this.closeProfileModal}
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
                              <h6 className="text-left def-blue">Profile</h6>
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
                                onClick={this.closeProfileModal}
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
                          <div className="col-md-5">
                            <div className="profile-box">
                              <img
                                className="d-block img-fluid mx-auto"
                                src={this.state.profilePhoto}
                                alt="user"
                              />

                              <label htmlFor="p-img">
                                <img src="images/camera.png" alt="camera" />
                                <input
                                  type="file"
                                  id="p-img"
                                  accept="image/jpeg, image/png, image/jpg"
                                  onChange={this.uploadProfilePhoto}
                                  onClick={(event) => {
                                    event.currentTarget.value = null;
                                  }} //to upload the same file again
                                />
                                <span>Change photo</span>
                              </label>
                              <p>
                                <img src="images/lock.png" alt="lock" />
                                <Link
                                  to="#"
                                  onClick={() =>
                                    this.openModal("openChangePasswordModal")
                                  }
                                >
                                  Change Password
                                </Link>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">User Name</label>
                              <div className="modal_input profile-input">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Jessie"
                                  id="usr"
                                  name="userName"
                                  value={this.state.userName}
                                  onChange={this.handleFieldChange}
                                />
                              </div>
                            </div>
                            <div className="text-danger error-12">
                              {this.state.formErrors.userName !== ""
                                ? this.state.formErrors.userName
                                : ""}
                            </div>
                            {/* <div className="form-group custon_select">
                              <label htmlFor="usr">Last Name</label>
                              <div className="modal_input profile-input">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="He"
                                  id="usr"
                                />
                              </div>
                            </div> */}
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Email</label>
                              <div className="modal_input profile-input">
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="example@gmail.com"
                                  id="usr"
                                  name="email"
                                  value={this.state.email}
                                  onChange={this.handleFieldChange}
                                />
                              </div>
                            </div>
                            <div className="text-danger error-12">
                              {this.state.formErrors.email !== ""
                                ? this.state.formErrors.email
                                : ""}
                            </div>
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Mobile</label>
                              <div className="modal_input profile-input">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="123456789"
                                  id="usr"
                                  name="mobileNumber"
                                  value={this.state.mobileNumber}
                                  onChange={this.handleFieldChange}
                                />
                              </div>
                            </div>

                              <div>
                                <div className="profile-input custon_select">
                                  <label className="mb-0 mt-2">
                                    backgroun Image change
                                  </label>
                                  <div className="row">
                                    <div className="col-6 mt-1">
                                      {this.state.backgroundImg ? (
                                        <img
                                          className="d-block img-fluid mx-auto"
                                          src={this.state.backgroundImg}
                                          alt="signatureImage"
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="col-6 mt-1">
                                      <div>
                                        <input
                                          type="file"
                                          id="fileElem-modal-bgImg"
                                          className="form-control d-none"
                                          accept="image/jpeg,image/jpg"
                                          onChange={(e) => {
                                            this.uploadBackgroundImage(
                                              e.target.files
                                            );
                                          }}
                                          onClick={(event) => {
                                            event.currentTarget.value = null;
                                          }} //to upload the same file again
                                        />
                                        <label htmlFor="fileElem-modal-bgImg">
                                          <div className="upload-text">
                                            <img
                                              src="images/drag-file.png"
                                              className="import_icon img-fluid"
                                              alt="upload-attachment"
                                            />
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-2"></div>
                                <div className="form-group custon_select">
                                  <div>
                                    <label for="favcolor">
                                      Select your favorite color:
                                    </label>
                                  </div>
                                  <div className="theme-color-picker">
                                    <input
                                      onChange={this.changeThemeColor}
                                      type="color"
                                      id="favcolor"
                                      name="favcolor"
                                      value={this.state.themeColor}
                                    />
                                  </div>
                                </div>
                              </div>
                            
                          </div>
                          <div className="col-12 mt-2">
                            <p className="f-20 head-clr">Signature</p>
                          </div>
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
                                  ></i>
                                  {this.state.signatureImage ? (
                                    <img
                                      className="d-block img-fluid mx-auto"
                                      src={this.state.signatureImage}
                                      alt="signatureImage"
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

                          <div className="col-12 mt-2">
                            <div className="form-group custon_select border text-center mb-0 border-rad-5">
                              <div id="drop-area-attach-modal">
                                <input
                                  type="file"
                                  id="fileElem-modal"
                                  className="form-control d-none"
                                  accept="image/jpeg,image/jpg"
                                  onChange={(e) => {
                                    this.uploadSignatureImage(e.target.files);
                                  }}
                                  onClick={(event) => {
                                    event.currentTarget.value = null;
                                  }} //to upload the same file again
                                />
                                <label
                                  className="upload-label"
                                  htmlFor="fileElem-modal"
                                >
                                  <div className="upload-text">
                                    <img
                                      src="images/drag-file.png"
                                      className="import_icon img-fluid"
                                      alt="upload-attachment"
                                    />
                                  </div>
                                </label>
                              </div>
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
        {/* change password modal */}
        <ChangePassword
          openChangePasswordModal={this.state.openChangePasswordModal}
          // openModal={this.openModal}
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
  updateAccountDetails: UserActions.updateAccountDetails,
  clearUserStates: UserActions.clearUserStates,
  updateThemeSetting: UserActions.updateThemeSetting,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Profile);
