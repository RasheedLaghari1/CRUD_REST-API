import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./TotalAmount.css";
import { connect } from "react-redux";

class TotalAmount extends Component {
  constructor() {
    super();
    this.state = {
      selected: [],
      department: [
        { label: "Accounting", value: 1 },
        { label: "Finance", value: 2 },
        { label: "IT", value: 2 },
      ],
      project: [
        { label: "37 Claremont St, Sth Yarra", value: 1 },
        { label: "34 Claremont St, Sth Yarra", value: 2 },
      ],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.taxTotal) {
      this.taxTotal.focus();
    }
  }
  onSave = async () => {
    await this.props.updatePOAmounts();
    await this.props.closeModal("openTotalAmountModal");

  };

  render() {
    let { netTotal, taxTotal, grossTotal } = this.props;

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
          show={this.props.openTotalAmountModal}
          onHide={() => this.props.closeModal("openTotalAmountModal")}
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
                                Total Amount
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
                                  this.props.closeModal("openTotalAmountModal")
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
                          <div className="col-md-6">
                            <div className="form-group custon_select disabled_fields">
                              <label className="custom_input_label">
                                Sub Total (Includes discount of 4.20)
                              </label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="netTotal"
                                  disabled
                                  name="netTotal"
                                  value={netTotal}
                                  onChange={() => { }}
                                />
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-md-6">
                            <div className="form-group custon_select disabled_fields">
                              <label className="custom_input_label">
                                Freight
                              </label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  placeholder=""
                                  disabled
                                />
                              </div>
                            </div>
                          </div> */}
                          <div className="col-md-6">
                            <div className={tab != "draft" ? "form-group custon_select disabled_fields" : "form-group custon_select"}>
                              <label className="custom_input_label">Tax</label>
                              <div className="modal_input">
                                <input
                                  type="number"
                                  className="form-control"
                                  id="taxTotal"
                                  name="taxTotal"
                                  value={taxTotal}
                                  onChange={this.props.handleTaxAmount}
                                  disabled={tab != "draft"}
                                  ref={c => (this.taxTotal = c)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group custon_select disabled_fields">
                              <label className="custom_input_label">
                                PO Total
                              </label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="grossTotal"
                                  disabled
                                  name="grossTotal"
                                  value={grossTotal}
                                  onChange={() => { }}
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
export default connect(mapStateToProps, {})(TotalAmount);
