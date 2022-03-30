// this page is converted into modal and this page isn't in use
import React, { Component } from "react";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

class DisplayInvoiceDetails extends Component {
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
    } else {
      this.props.history.push("/invoice");
    }
  }

  onSave = () => {
    let obj = { ...this.state };
    localStorage.setItem("displayInvoicesSetting", JSON.stringify(obj));

    this.props.history.push("invoice-detail", {
      data: this.props.history.location.state.data,
    });
  };

  onCancel = () => {
    this.props.history.push("invoice-detail", {
      data: this.props.history.location.state.data,
    });
  };

  handleCheckBoxes = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
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
                                  Display Invoice Details
                                </h6>
                              </div>
                              <div className="col d-flex justify-content-end s-c-main">
                                <button
                                  onClick={this.onSave}
                                  type="button"
                                  className="btn-save"
                                >
                                  <img
                                    src="images/save-check.png"
                                    className="mr-2"
                                    alt="display-icon"
                                  />
                                  Save
                                </button>
                                <button
                                  onClick={this.onCancel}
                                  type="button"
                                  className="btn-save"
                                >
                                  <img
                                    src="images/cancel.png"
                                    className="mr-2"
                                    alt="display-icon"
                                  />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="forgot_body px-3 dod_check">
                          <div className="row mt-3">
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="currentApproverCheck"
                                      name="currentApproverCheck"
                                      checked={this.state.currentApproverCheck}
                                      onChange={this.handleCheckBoxes}
                                    />

                                    <label
                                      htmlFor="currentApproverCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Current Approver</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="dateCheck"
                                      name="dateCheck"
                                      checked={this.state.dateCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="dateCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Date</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="approverdCheck"
                                      name="approverdCheck"
                                      checked={this.state.approverdCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="approverdCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Approverd</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="invoiceNumberCheck"
                                      name="invoiceNumberCheck"
                                      checked={this.state.invoiceNumberCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="invoiceNumberCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Invoice#</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="emailSupplier"
                                      name="emailSupplier"
                                      checked={this.state.emailSupplier}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="emailSupplier"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Email Supplier</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="requestBy"
                                      name="requestBy"
                                      checked={this.state.requestBy}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="requestBy"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Request By</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="tranCheck"
                                      name="tranCheck"
                                      checked={this.state.tranCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="tranCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Tran</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="departmentCheck"
                                      name="departmentCheck"
                                      checked={this.state.departmentCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="departmentCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Department</p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="descriptionCheck"
                                      name="descriptionCheck"
                                      checked={this.state.descriptionCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="descriptionCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Description</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="row no-gutters mb-md-3">
                                <div className="col-auto pr-0">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="specCondition"
                                      name="specCondition"
                                      checked={this.state.specCondition}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="specCondition"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">Special Conditions</p>
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
export default connect(mapStateToProps, {})(DisplayInvoiceDetails);
