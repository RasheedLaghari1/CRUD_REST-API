import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import DisplayInvoiceMoreDetails from "../DisplayInvoiceMoreDetails/DisplayInvoiceMoreDetails";

class InvoiceMoreDetails extends Component {
  constructor() {
    super();
    this.state = {
      openDisplayInvoiceMoreDetailsModal: false,
      currentApprover: true,
      approverdCheck: true,
      emailSupplier: true,
      tranCheck: true,
      descriptionCheck: true,
      dateCheck: true,
      invoiceNumberCheck: true,
      requestBy: true,
      departmentCheck: true,
      specCondition: true
    };
  }

   componentWillMount() {
    let displayInvoicesSetting = localStorage.getItem("displayInvoicesSetting");
    let parseSetting = JSON.parse(displayInvoicesSetting);
    if (displayInvoicesSetting) {
       this.setState({ ...parseSetting });
    }
  }

  openModal = name => {
    this.setState({ [name]: true });
  };
  closeModal =  name => {
    let displayInvoicesSetting = localStorage.getItem("displayInvoicesSetting");
    let parseSetting = JSON.parse(displayInvoicesSetting);
    if (displayInvoicesSetting) {
       this.setState({ ...parseSetting });
    }
    this.setState({ [name]: false, invoiceMoreDetails: "" });
  };
  render() {
    let invoice = this.props.invoiceMoreDetails;

    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openInvoiceMoreDetailsModal}
          onHide={() => this.props.closeModal("openInvoiceMoreDetailsModal")}
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
                                Invoice Details
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <p
                                onClick={() =>
                                  this.openModal(
                                    "openDisplayInvoiceMoreDetailsModal"
                                  )
                                }
                              >
                                <button type="button" className="btn-save">
                                  <img
                                    src="images/display-icon.png"
                                    className="mr-2"
                                    alt="display-icon"
                                  />
                                  Display
                                </button>
                              </p>
                              <Link to="#">
                                <button
                                  onClick={() =>
                                    this.props.closeModal(
                                      "openInvoiceMoreDetailsModal"
                                    )
                                  }
                                  type="button"
                                  className="btn-save"
                                >
                                  <img
                                    src="images/cancel.png"
                                    className="mr-2"
                                    alt="display-icon"
                                  />
                                  Close
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row mt-4">
                          <div className="col-12">
                            {this.state.currentApprover && (
                              <div className="form-group custon_select">
                                <label>
                                  Current Approver{" "}
                                  <span className="fa fa-check check_blue"></span>
                                </label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={(invoice && invoice.approver) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-12">
                            {this.state.dateCheck && (
                              <div className="form-group custon_select">
                                <label>Date </label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      invoice.date ? invoice.date.trim() : ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {this.state.approverdCheck && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Approved</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={(invoice && invoice.approved) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-12">
                            {this.state.invoiceNumberCheck && (
                              <div className="form-group custon_select">
                                <label>Invoice# </label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (invoice && invoice.invoiceNumber) || ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {this.state.emailSupplier && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Email Supplier</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (invoice && invoice.supplierEmail) || ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.requestBy && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Requested By</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={(invoice && invoice.userName) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.tranCheck && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Tran</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={(invoice && invoice.tran) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.departmentCheck && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Department</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (invoice && invoice.department) || ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.descriptionCheck && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Description</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (invoice && invoice.description) || ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {/* {this.state.specCondition && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Special Conditions</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (invoice && invoice.specialConditions) ||
                                      ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <DisplayInvoiceMoreDetails
          openDisplayInvoiceMoreDetailsModal={
            this.state.openDisplayInvoiceMoreDetailsModal
          }
          closeModal={this.closeModal}
          data={this.props}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  poData: state.poData
});
export default connect(
  mapStateToProps,
  {}
)(InvoiceMoreDetails);
