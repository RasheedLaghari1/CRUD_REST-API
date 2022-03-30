import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DisplayOrdersMoreDetails from "../DisplayOrdersMoreDetails/DisplayOrdersMoreDetails";
class OrdersMoreDetails extends Component {
  constructor() {
    super();
    this.state = {
      openDisplayOrdersMoreDetailsModal: false,
      currentApprover: true,
      approverdCheck: true,
      emailSupplier: true,
      tranCheck: true,
      descriptionCheck: true,
      dateCheck: true,
      poNumberCheck: true,
      requestBy: true,
      departmentCheck: true,
      specCondition: true
    };
  }

  async componentWillMount() {
    let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
    let parseSetting = JSON.parse(displayOrdersSetting);
    if (displayOrdersSetting) {
       this.setState({ ...parseSetting });
    }
  }

  openModal = name => {
    this.setState({ [name]: true });
  };
  closeModal = async name => {
    let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
    let parseSetting = JSON.parse(displayOrdersSetting);
    if (displayOrdersSetting) {
       this.setState({ ...parseSetting });
    }
    this.setState({ [name]: false, ordersMoreDetails: "" });
  };
  render() {
    let order = this.props.ordersMoreDetails;

    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openOrdersMoreDetailsModal}
          onHide={() => this.props.closeModal("openOrdersMoreDetailsModal")}
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
                                Order Details
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <p
                                onClick={() =>
                                  this.openModal(
                                    "openDisplayOrdersMoreDetailsModal"
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
                                      "openOrdersMoreDetailsModal"
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
                                    value={(order && order.approver) || ""}
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
                                    value={(order && order.date) || ""}
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
                                    value={(order && order.approved) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-12">
                            {this.state.poNumberCheck && (
                              <div className="form-group custon_select">
                                <label>PO# </label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={(order && order.poNumber) || ""}
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
                                    value={(order && order.supplierEmail) || ""}
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
                                    value={(order && order.requestedBy) || ""}
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
                                    value={(order && order.trans) || ""}
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
                                    value={(order && order.department) || ""}
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
                                    value={(order && order.description) || ""}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {this.state.specCondition && (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label>Special Conditions</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    value={
                                      (order && order.specialConditions) || ""
                                    }
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <DisplayOrdersMoreDetails
          openDisplayOrdersMoreDetailsModal={
            this.state.openDisplayOrdersMoreDetailsModal
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
)(OrdersMoreDetails);
