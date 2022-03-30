import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";

import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import * as ReportsActions from "../../Actions/ReportsActions/ReportsActions";
import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";
import * as Validation from "../../Utils/Validation";
import {
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";

class Report extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      addNewReportToggle: false,
      reportTypesVal: { label: "Select Report Type", value: "" },
      reportTypes: [{ label: "Select Report Type", value: "" }],

      reportOptionVal: { label: "Select Report Options", value: "" },
      reportOptions: [],
      menuIsOpen: false,

      reportFile: "",
      reportName: "",
      private: false,

      formErrors: {
        reportTypesVal: "",
        reportOptionVal: "",
        reportFile: "",
        reportName: "",
      },
    };
  }

  async componentDidMount() {
    localStorage.removeItem("jsonData");
    localStorage.removeItem("key");
    localStorage.removeItem("reportFile");

    this.setState({ isLoading: true });
    let { reportTypes } = this.state;
    let isRepTyps = false; //to check if redux store contain report types then dont call API again

    if (this.props.report.getReportTypes.length === 0) {
      await this.props.getReportTypes();
    } else {
      isRepTyps = true;
    }

    // get Report Types success
    if (this.props.report.getReportTypesSuccess || isRepTyps) {
      // toast.success(this.props.report.getReportTypesSuccess);
      //Report Types list
      if (
        this.props.report.getReportTypes &&
        this.props.report.getReportTypes.length > 0
      ) {
        let getReportTypes = this.props.report.getReportTypes || [];
        reportTypes = [{ label: "Select Report Type", value: "" }];
        getReportTypes.map((t, i) => {
          reportTypes.push({
            label: t.type,
            value: t.type,
          });
        });
      }
    }
    //error case of Get Report Types
    if (this.props.report.getReportTypesError) {
      this.handleApiRespErr(this.props.report.getReportTypesError);
    }
    this.props.clearReportsStates();
    this.setState({ isLoading: false, reportTypes });
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-report", this.uploadReportFile);
  }

  menuOpened = async () => {
    this.setState({ menuIsOpen: true });
    let _this = this;
    $(document).ready(async function () {
      $('<i class="fa fa-trash report--del"></i>').appendTo(
        ".report_menu.custon_select-selector-inner__option"
      );
      $(".report_menu.custon_select-selector-inner__option i").on(
        "click",
        async function (e) {
          e.preventDefault();
          var p_id = $(this).parent().attr("id");
          let id_split = p_id && p_id.split("-"); //["react", "select", "3", "option", "1"]
          let id = id_split[id_split.length - 1];

          let { reportOptions } = _this.state;
          let rep_opt = reportOptions.length > 0 && reportOptions[id];
          //call delete report options API
          await _this.deleteReport(rep_opt.value, rep_opt.locked);
        }
      );
    });
  };

  menuClosed = () => {
    this.setState({ menuIsOpen: false });
  };

  //a function that checks  api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      this.props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      this.props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };

  handleReportTypes = async (type) => {
    let { formErrors } = this.state;

    formErrors = Validation.handleValidation(
      "reportTypesVal",
      type.value,
      formErrors
    );

    this.setState({
      reportTypesVal: type,
      reportOptionVal: { label: "Select Report Options", value: "" },
      reportOptions: [],
      formErrors,
    });
    if (type.value) {
      //call API to get report options according to selected type
      this.setState({ isLoading: true });
      await this.props.getReportOptions(type.value);
      //success case of get Report Options
      if (this.props.report.getReportOptionsSuccess) {
        // toast.success(this.props.report.getReportOptionsSuccess);
        //report options List
        if (
          this.props.report.getReportOptions &&
          this.props.report.getReportOptions.length > 0
        ) {
          let getReportOptions = this.props.report.getReportOptions;
          let getReportOptionsArr = [];
          getReportOptions.map((t, i) => {
            getReportOptionsArr.push({
              label: t.layout,
              value: t.id,
              locked: t.locked,
            });
          });
          this.setState({
            reportOptions: getReportOptionsArr,
          });
        }
      }
      //error case of get Report Options
      if (this.props.report.getReportOptionsError) {
        this.handleApiRespErr(this.props.report.getReportOptionsError);
      }
      this.props.clearReportsStates();
      this.setState({ isLoading: false });
    }
  };

  handleReportOptions = (layout) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(
      "reportOptionVal",
      layout.value,
      formErrors
    );

    this.setState({ reportOptionVal: layout, formErrors });

    if (layout.value) {
      //clear states on file and report name
      this.setState({
        addNewReportToggle: false,
        reportFile: "",
        reportName: "",
        private: false,

        formErrors: {
          reportFile: "",
          reportName: "",
        },
      });
    }
  };

  addNewReport = async () => {
    await this.setState((prevState) => ({
      addNewReportToggle: !prevState.addNewReportToggle,
    }));

    if (this.state.addNewReportToggle) {
      //add new report case then report options set to default

      this.setState((prevState) => ({
        reportOptionVal: { label: "Select Report Options", value: "" },
        formErrors: {
          ...prevState.formErrors,
          reportOptionVal: "",
        },
      }));

      //adding drag and drop attachments listeners
      addDragAndDropFileListners("drop-area-report", this.uploadReportFile);
      //end
    } else {
      //clear states on file and report name
      this.setState({
        reportFile: "",
        reportName: "",
        private: false,

        formErrors: {
          reportFile: "",
          reportName: "",
        },
      });
    }
  };

  handleCheckbox = async (e) => {
    this.setState({ private: e.target.checked });
  };

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    let { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  uploadReportFile = async (f) => {
    let { formErrors } = this.state;
    let type = f[0].type;
    let file = f[0];
    let size = f[0].size;

    if (type == "mrt") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          formErrors = Validation.handleValidation(
            "reportFile",
            result,
            formErrors
          );
          this.setState({
            reportFile: result,
            formErrors,
          });
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: '.mrt'");
    }
  };

  deleteReport = async (reportID, locked) => {
    let reportType = this.state.reportTypesVal.value || "";
    if (locked != "Y") {
      if (reportType && reportID) {
        this.setState({ isLoading: true });
        await this.props.deleteReport(reportType, reportID);

        //success case of delete Report success
        if (this.props.report.deleteReportSuccess) {
          toast.success(this.props.report.deleteReportSuccess);
          //report options List
          if (
            this.props.report.deleteReport &&
            this.props.report.deleteReport.length > 0
          ) {
            let reportOptions = this.props.report.deleteReport;
            let reportOptionsArr = [];
            reportOptions.map((t, i) => {
              reportOptionsArr.push({
                label: t.layout,
                value: t.id,
                locked: t.locked,
              });
            });
            this.setState({
              reportOptions: reportOptionsArr,
            });
          }

          this.setState({
            addNewReportToggle: false,
            reportFile: "",
            reportName: "",
            private: false,
            reportOptionVal: { label: "Select Report Options", value: "" },
            formErrors: {
              reportFile: "",
              reportName: "",
            },
          });
        }
        //error case of Delete Report
        if (this.props.report.deleteReportError) {
          this.handleApiRespErr(this.props.report.deleteReportError);
        }

        this.setState({ isLoading: false });
      } else {
        toast.error("Report Type OR Report ID is Missing!");
      }
    } else {
      toast.error("You can't delete this Report!");
    }
  };

  onSave = async () => {
    let formErrors = this.state.formErrors;
    if (!this.state.reportTypesVal.value) {
      formErrors.reportTypesVal = "This Field is Required.";
    }
    if (this.state.addNewReportToggle) {
      //add new report case
      if (!this.state.reportName) {
        formErrors.reportName = "This Field is Required.";
      }
      if (!this.state.reportFile) {
        formErrors.reportFile = "MRT File is Required.";
      }
    } else {
      //use reports from the drop down list
      if (!this.state.reportOptionVal.value) {
        formErrors.reportOptionVal = "This Field is Required.";
      }
    }
    this.setState({
      formErrors: formErrors,
    });

    let check = false;

    if (this.state.addNewReportToggle) {
      if (!formErrors.reportFile && !formErrors.reportName) {
        check = true;
      }
    } else {
      if (!formErrors.reportOptionVal) {
        check = true;
      }
    }

    if (!formErrors.reportTypesVal && check) {
      let {
        reportTypesVal,
        reportOptionVal,
        reportFile,
        reportName,
        private: privateCheck,
      } = this.state;
      let data = "";
      if (reportOptionVal.value) {
        //get report data according to available report options
        data = {
          reportType: reportTypesVal.value,
          reportID: reportOptionVal.value,
        };
      } else {
        //create new reports and get data according to that report
        data = {
          reportType: reportTypesVal.value,
          reportFile,
          reportName,
          private: privateCheck,
        };
      }
      if (data) {
        this.setState({ isLoading: true });
        await this.props.getReportData(data);
        //success case of get Report Data
        if (this.props.report.getReportDataSuccess) {
          toast.success(this.props.report.getReportDataSuccess);
          let jsonData = this.props.report.getReportData.jsonData || "";
          let reportFile = this.props.report.getReportData.reportFile || "";
          let key = this.props.report.getReportData.key || "";

          if (jsonData && reportFile && key) {
            localStorage.setItem("reportFile", reportFile);
            localStorage.setItem("jsonData", jsonData);
            localStorage.setItem("key", key);
            var path =
              window.location.protocol +
              "//" +
              window.location.host +
              "/report-view";

            window.open(path, "_blank");
          }
        }
        //error case of get Report Data
        if (this.props.report.getReportDataError) {
          this.handleApiRespErr(this.props.report.getReportDataError);
        }

        this.setState({ isLoading: false });
      }
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} />
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
                                <h6 className="text-left def-blue">Reports</h6>
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
                                <Link to="/dashboard">
                                  <button type="button" className="btn-save">
                                    <span className="fa fa-ban"></span>
                                    Discard
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="forgot_body px-3">
                          <div className="row mt-4">
                            <div className="col-md-12">
                              {/* dropdown coding start */}
                              <div className="form-group custon_select">
                                <Select
                                  className="width-selector"
                                  value={this.state.reportTypesVal}
                                  classNamePrefix="custon_select-selector-inner"
                                  options={this.state.reportTypes}
                                  onChange={this.handleReportTypes}
                                  theme={(theme) => ({
                                    ...theme,
                                    border: 0,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#f2f2f2",
                                      primary: "#f2f2f2",
                                    },
                                  })}
                                />
                                <div className="text-danger error-12">
                                  {this.state.formErrors.reportTypesVal !== ""
                                    ? this.state.formErrors.reportTypesVal
                                    : ""}
                                </div>
                              </div>
                            </div>

                            <div className="form-group col-md-12">
                              {/* dropdown coding start */}
                              <div className="custon_select">
                                {/* <Select
                                  className="width-selector"
                                  value={this.state.reportOptionVal}
                                  classNamePrefix="report_menu custon_select-selector-inner"
                                  options={this.state.reportOptions}
                                  onChange={this.handleReportOptions}
                                  theme={theme => ({
                                    ...theme,
                                    border: 0,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#f2f2f2",
                                      primary: "#f2f2f2"
                                    }
                                  })}
                                /> */}

                                <Select
                                  className="width-selector"
                                  onMenuOpen={this.state.menuIsOpen}
                                  closeMenuOnSelect={true}
                                  value={this.state.reportOptionVal}
                                  classNamePrefix="report_menu custon_select-selector-inner"
                                  onMenuOpen={this.menuOpened}
                                  onMenuClose={this.menuClosed}
                                  onChange={this.handleReportOptions}
                                  options={this.state.reportOptions}
                                  theme={(theme) => ({
                                    ...theme,
                                    border: 0,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#f2f2f2",
                                      primary: "#f2f2f2",
                                    },
                                  })}
                                />

                                <span
                                  className="input_field_icons rit-icon-input"
                                  // data-toggle="collapse"
                                  // data-target="#asd"
                                  onClick={this.addNewReport}
                                >
                                  <i className="fa fa-plus"></i>
                                </span>
                              </div>
                              <div className="text-danger error-12">
                                {this.state.formErrors.reportOptionVal !== ""
                                  ? this.state.formErrors.reportOptionVal
                                  : ""}
                              </div>
                            </div>
                            {this.state.addNewReportToggle && (
                              // <div className="collapse pl-3 pr-3 w-100 id="asd">
                              <div className=" pl-3 pr-3 w-100">
                                <div className="row">
                                  <div className="col-12 mt-2 mb-2">
                                    <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                      <div id="drop-area-report">
                                        <input
                                          type="file"
                                          id="fileElem-rep"
                                          className="form-control d-none"
                                          accept="application/pdf"
                                          onChange={(e) => {
                                            this.uploadReportFile(
                                              e.target.files
                                            );
                                          }}
                                          onClick={(event) => {
                                            event.currentTarget.value = null;
                                          }} //to upload the same file again
                                        />

                                        <label
                                          className="upload-label"
                                          htmlFor="fileElem-rep"
                                        >
                                          <div className="upload-text">
                                            <img
                                              src="images/drag-file.png"
                                              className="import_icon img-fluid"
                                              alt="upload-report"
                                            />
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.reportFile !== ""
                                        ? this.state.formErrors.reportFile
                                        : ""}
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group custon_select mt-3">
                                      <div className="modal_input">
                                        <label>Report Name</label>
                                        <input
                                          type="text"
                                          className="form-control pl-0"
                                          id="usr"
                                          name="reportName"
                                          value={this.state.reportName}
                                          onChange={this.handleFieldChange}
                                        />
                                        <div className="text-danger error-12">
                                          {this.state.formErrors.reportName !==
                                          ""
                                            ? this.state.formErrors.reportName
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 align-self-center mb-2">
                                    <div className="form-group remember_check">
                                      <input
                                        type="checkbox"
                                        id="remember"
                                        checked={this.state.private}
                                        onChange={this.handleCheckbox}
                                      />
                                      <label htmlFor="remember"></label>
                                      <p className="pt-1">Private:</p>
                                    </div>
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
  report: state.report,
});

export default connect(mapStateToProps, {
  getReportTypes: ReportsActions.getReportTypes,
  getReportOptions: ReportsActions.getReportOptions,
  getReportData: ReportsActions.getReportData,
  deleteReport: ReportsActions.deleteReport,
  clearReportsStates: ReportsActions.clearReportsStates,
  clearStatesAfterLogout,
})(Report);
