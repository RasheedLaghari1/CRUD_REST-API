// this page is converted into modal and this page isn't in use

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

class InvoiceDetail extends Component {
  constructor() {
    super();
    this.state = {
      currentApproverCheck: true,
      approverdCheck: true,
      emailSupplier: true,
      tranCheck: true,
      descriptionCheck: true,
      dateCheck: true,
      invoiceNumberCheck: true,
      requestBy: true,
      departmentCheck: true,
      specCondition: true,
    };
  }

  async componentDidMount() {
    if (
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.state &&
      this.props.history.location.state.data
    ) {
      let displayInvoicesSetting = localStorage.getItem(
        "displayInvoicesSetting"
      );
      let parseSetting = JSON.parse(displayInvoicesSetting);
      if (displayInvoicesSetting) {
        this.setState({ ...parseSetting });
      }
      let data = this.props.history.location.state.data;
      this.setState({ ...data });
    } else {
      this.props.history.push("/invoice");
    }
  }

  handleDispalyInvoiceDetails = () => {
    this.props.history.push("display-invoice-detail", {
      data: this.props.history.location.state.data,
    });
  };

  render() {
    return (
      <>
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
                        <div className="forgot_header">
                          <div className="modal-top-header bord-btm">
                            <div className="row">
                              <div className="col-auto">
                                <h6 className="text-left def-blue">
                                  Invoice Details
                                </h6>
                              </div>
                              <div className="col d-flex justify-content-end s-c-main">
                                <p onClick={this.handleDispalyInvoiceDetails}>
                                  <button type="button" className="btn-save">
                                    <img
                                      src="images/display-icon.png"
                                      className="mr-2"
                                      alt="display-icon"
                                    />
                                    Display
                                  </button>
                                </p>
                                <Link to="/invoice">
                                  <button type="button" className="btn-save">
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
                        <div className="forgot_body px-3">
                          <div className="row mt-4">
                            <div className="col-12">
                              {this.state.currentApproverCheck && (
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
                                      value={this.state.approver || ""}
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
                                      value={this.state.date || ""}
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
                                      value={this.state.approved || ""}
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
                                      value={this.state.invoiceNumber || ""}
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
                                      value={this.state.supplierEmail || ""}
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
                                      value={this.state.userName || ""}
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
                                      value={this.state.tran || ""}
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
                                      value={this.state.department || ""}
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
                                      value={this.state.description || ""}
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
                                      value={this.state.specialConditions || ""}
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

export default connect(mapStateToProps, {})(InvoiceDetail);
