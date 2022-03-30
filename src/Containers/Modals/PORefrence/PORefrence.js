import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./PORefrence.css";
import { connect } from "react-redux";

class PORefrence extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.poNum) {
      this.poNum.focus();
    }
  }
  onSave = async () => {
    let lockPONumber = localStorage.getItem("lockPONumber"); //e.g 'Y' || 'N' if Y then po number not be editable otherwise editable

    if (lockPONumber.trim() && lockPONumber.trim() === "N") {
      await this.props.updatePOReference();
      await this.props.closeModal("openPORefrenceModal");
    }
  };
  render() {
    let lockPONumber = localStorage.getItem("lockPONumber"); //e.g 'Y' || 'N' if Y then po number not be editable otherwise editable

    let userType = localStorage.getItem("userType");
    let tab = this.props.tab || "";

    let checkOne = false;

    if (userType && tab) {
      if (userType.toLowerCase() === "approver") {
        /* An Approver can only edit the chart code, tracking codes and item description.
         Everything else in the PO is read-only and cannot be altered.*/

        checkOne = true;
      } else if (userType.toLowerCase() === "operator") {
        /*The Operator account should only be able to edit the Preview PDF in the Draft section,
         in every other section the preview pdf must be read only for them.*/
        if (tab != "draft") {
          checkOne = true;
        }
      } else if (userType.toLowerCase() === "op/approver") {
        /*The Operator/Approver account can edit everything in the Draft section 
        AND they can also edit the Chart Code, Tracking Code and Description in the Approve
        and Hold Section */
        if (tab != "draft") {
          checkOne = true;
        }
      }
    }


    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openPORefrenceModal}
          onHide={() => this.props.closeModal("openPORefrenceModal")}
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
                                PO Reference
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              {checkOne ? (
                                <></>
                              ) : (
                                <button
                                  onClick={this.onSave}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  this.props.closeModal("openPORefrenceModal")
                                }
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
                          <div className="col-md-12">
                            <div className="form-group custon_select">
                              <label>PO Number</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkOne || !lockPONumber
                                      ? "disable_bg disable_border"
                                      : lockPONumber && lockPONumber.trim() === "Y"
                                        ? "disable_bg disable_border"
                                        : ""
                                  }
                                  ref={c => (this.poNum = c)}
                                  name="poNumber"
                                  defaultValue={this.props.poNumber}
                                  onBlur={this.props.handleChangeFields}
                                  disabled={
                                    checkOne || !lockPONumber
                                      ? true
                                      : lockPONumber && lockPONumber.trim() === "Y"
                                        ? true
                                        : false
                                  }
                                />
                              </div>

                              {
                                // If a field is read only and cannot be edited or input, please remove the error message that the field is required.

                                !checkOne ? (
                                  lockPONumber ? (
                                    lockPONumber.trim() != "Y" ? (
                                      <div className="text-danger error-12">
                                        {this.props.poNumber.trim() === ""
                                          ? "This Field Is Required"
                                          : ""}
                                      </div>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    <div className="text-danger error-12">
                                      {this.props.poNumber.trim() === ""
                                        ? "This Field Is Required"
                                        : ""}
                                    </div>
                                  )
                                ) : (
                                  ""
                                )
                              }
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

const mapStateToProps = (state) => ({
  user: state.user,
  poData: state.poData,
});
export default connect(mapStateToProps, {})(PORefrence);
