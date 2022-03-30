// this page is converted into a moda and this page is not using
import React, { Component } from "react";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

class DisplayOrderDetail extends Component {
  constructor() {
    super();
    this.state = {
      currentApprover: true,
      approverdCheck: true,
      emailSupplier: true,
      tran: true,
      descriptionCheck: true,
      dateCheck: true,
      poNumberCheck: true,
      requestBy: true,
      departmentCheck: true,
      specCondition: true,
    };
  }
  componentDidMount() {
    if (
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.state &&
      this.props.history.location.state.data
    ) {
      let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
      let parseSetting = JSON.parse(displayOrdersSetting);
      if (displayOrdersSetting) {
        this.setState({ ...parseSetting });
      }
    } else {
      this.props.history.push("/order");
    }
  }

  onSave = () => {
    let obj = { ...this.state };
    localStorage.setItem("displayOrdersSetting", JSON.stringify(obj));

    this.props.history.push("order-detail", {
      data: this.props.history.location.state.data,
    });
  };

  onCancel = () => {
    this.props.history.push("order-detail", {
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
                                  Display Order Details
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
                                      id="currentApprover"
                                      name="currentApprover"
                                      checked={this.state.currentApprover}
                                      onChange={this.handleCheckBoxes}
                                    />

                                    <label
                                      htmlFor="currentApprover"
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
                                      id="poNumberCheck"
                                      name="poNumberCheck"
                                      checked={this.state.poNumberCheck}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="poNumberCheck"
                                      className="float-left"
                                    ></label>
                                  </div>
                                </div>
                                <div className="col pl-0">
                                  <p className="f-20 m-0">PO#</p>
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
                                      id="tran"
                                      name="tran"
                                      checked={this.state.tran}
                                      onChange={this.handleCheckBoxes}
                                    />
                                    <label
                                      htmlFor="tran"
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
export default connect(mapStateToProps, {})(DisplayOrderDetail);
