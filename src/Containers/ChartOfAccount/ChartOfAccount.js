// This is is not in use and it is converted into Modal.

import React, { Component } from "react";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

import {
  inserChartOfAccountCode,
  clearChartStates,
} from "../../Actions/ChartActions/ChartActions";
import { handleAPIErr } from "../../Utils/Helpers";
import {
  handleValidation,
  handleWholeValidation,
} from "../../Utils/Validation";
class ChartOfAccount extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      chartSort: "",
      chartCode: "",
      description: "",
      openResetPasswordModal: false,
      formErrors: {
        chartSort: "",
        chartCode: "",
        description: "",
      },
    };
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const chartSort = urlParams.get("chartSort");
    if (chartSort) {
      let { formErrors } = this.state;
      formErrors = handleValidation("chartSort", chartSort, formErrors);
      this.setState({ chartSort, formErrors });
    }
  }

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    let { name, value } = e.target;
    formErrors = handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  insertChartOfAccount = async () => {
    let { chartSort, chartCode, description, formErrors } = this.state;

    formErrors = handleWholeValidation(
      { chartSort, chartCode, description },
      formErrors
    );

    if (
      !formErrors.chartSort &&
      !formErrors.chartCode &&
      !formErrors.description
    ) {
      this.setState({ isLoading: true });
      let userData = {
        actionType: "InsertAccount",
        chartSort,
        chartCode,
        description,
      };

      await this.props.inserChartOfAccountCode(userData); //call insert chart os accounts api

      //error case
      if (this.props.chart.insertChartOfAccountsError) {
        handleAPIErr(this.props.chart.insertChartOfAccountsError, this.props);
      }
      //success case
      if (this.props.chart.insertChartOfAccountsSuccess) {
        // toast.success(this.props.chart.insertChartOfAccountsSuccess);
        window.close();
      }

      this.setState({ isLoading: false });
      this.props.clearChartStates(); //clear states in main store
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  onCancel = () => {
    window.close();
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

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
                                  Chart of Accounts
                                </h6>
                              </div>
                              <div className="col d-flex justify-content-end s-c-main">
                                <button
                                  onClick={this.insertChartOfAccount}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                                <button
                                  onClick={this.onCancel}
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
                        <div className="forgot_body px-3">
                          <div className="row mt-4">
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Chart Sort"
                                    id="usr"
                                    name="chartSort"
                                    value={this.state.chartSort}
                                    onChange={this.handleFieldChange}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.chartSort !== ""
                                      ? this.state.formErrors.chartSort
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Chart Code"
                                    id="usr"
                                    name="chartCode"
                                    value={this.state.chartCode}
                                    onChange={this.handleFieldChange}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.chartCode !== ""
                                      ? this.state.formErrors.chartCode
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    id="usr"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleFieldChange}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.description !== ""
                                      ? this.state.formErrors.description
                                      : ""}
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
  chart: state.chart,
});
export default connect(mapStateToProps, {
  inserChartOfAccountCode,
  clearChartStates,
})(ChartOfAccount);
