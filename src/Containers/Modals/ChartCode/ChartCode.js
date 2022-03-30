import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

import { connect } from "react-redux";
import { toast } from "react-toastify";
import ChartOfAccount from "../ChartOfAccount/ChartOfAccount";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  getChartCodes,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";
class ChartCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      chartCodes: [],
      clonedChartCodes: [], //a copy of chartCodes
      chartCodesSearch: "", //search chart codes
      toggleChartCode: false,
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
      sortColName: "chartCode", //too check which column is going to sort either Tax Code OR Description
      toggleChartDescription: false,
      showSelected: false,
      selectedChartCode: "",
      openChartOfAccountModal: false,
      flag: true,
    };
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = async (name) => {
    this.setState({ [name]: false });
  };
  async componentWillReceiveProps(np) {
    if (np.openChartCodeModal && this.state.flag) {
      //focus search input field by pressing Tab key
      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 9) {
          evt.preventDefault();
          let id = document.getElementById("chartCodeSearchId");
          if (id) {
            document.getElementById("chartCodeSearchId").focus();
          }
        }
      };
      this.setState({ toggleChartCode: false });
      const chrtcods = JSON.parse(
        JSON.stringify(this.props.chartCodes || "[]")
      );
      if (chrtcods && chrtcods.length > 0) {
        //filter chart codes according to selected chart sort
        let fltrdCodes = chrtcods.filter(
          (c) => c.sort === this.props.chartSort
        );

        fltrdCodes.map((t, i) => {
          if (t.code === this.props.chartCode && this.props.chartCode != "") {
            //to show selected default
            t.id = i;
            t.checked = true;
            return t;
          } else {
            t.id = i;
            t.checked = false;
            return t;
          }
        });

        let sortedList = fltrdCodes.sort(function (a, b) {
          let descA = a.code.toString().toUpperCase();
          let descB = b.code.toString().toUpperCase();
          if (descA < descB) {
            return -1;
          }
          if (descA > descB) {
            return 1;
          }
          return 0;
          // codes must be equal
        });

        this.setState({
          chartCodes: sortedList,
          clonedChartCodes: sortedList,
          sortCheck: true,
          sortColName: "chartCode",
          flag: false,
        });
      }
    } else {
      //remove focus search input field
      document.onkeydown = function (evt) {
        return true;
      };
    }
  }

  // when click on refresh button then call get tax code api
  getChartCodes = async () => {
    this.setState({ isLoading: true, chartCodesSearch: "" });
    await this.props.getChartCodes(this.props.chartSort); //to get chart codes according to chart sort (filtered chart codes)
    this.setState({
      chartCodes: [],
      clonedChartCodes: [],
    });
    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
      let getChartCodes = this.props.chart.getChartCodes || "";

      if (
        getChartCodes &&
        getChartCodes.chartCodes &&
        getChartCodes.chartCodes.length > 0
      ) {
        let chrtcods = getChartCodes.chartCodes;

        chrtcods.map((t, i) => {
          if (t.sort == this.props.chartCode) {
            //to show selected default
            t.id = i;
            t.checked = true;
            return t;
          } else {
            t.id = i;
            t.checked = false;
            return t;
          }
        });

        let sortedList = chrtcods.sort(function (a, b) {
          let descA = a.code.toString().toUpperCase();
          let descB = b.code.toString().toUpperCase();
          if (descA < descB) {
            return -1;
          }
          if (descA > descB) {
            return 1;
          }
          return 0;
          // codes must be equal
        });

        this.setState({
          chartCodes: sortedList,
          clonedChartCodes: sortedList,
        });
      }
    }
    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      this.handleApiRespErr(this.props.chart.getChartCodesError);
    }
    this.setState({ isLoading: false });
    this.props.clearChartStates();
  };
  //a function that checks api error
  handleApiRespErr = (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      this.props.props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      this.props.props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  //when type in search box
  chartCodesSearchHandler = (e) => {
    let text = e.target.value;
    if (!text) {
      this.setState({
        chartCodesSearch: text,
        clonedChartCodes: this.state.chartCodes || [],
      });
    } else {
      this.setState({
        chartCodesSearch: text,
      });
    }
  };
  //when clicks on search button
  onSearch = () => {
    let text = this.state.chartCodesSearch.trim();
    if (text) {
      let chartCodeSearchedData = [];

      chartCodeSearchedData = this.state.chartCodes.filter((c) => {
        return (
          c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
          c.description.toUpperCase().includes(text.toUpperCase())
        );
      });

      this.setState({ clonedChartCodes: chartCodeSearchedData });
    }
  };
  onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = this.state.chartCodesSearch.trim();
      if (text) {
        let chartCodeSearchedData = [];

        chartCodeSearchedData = this.state.chartCodes.filter((c) => {
          return (
            c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
            c.description.toUpperCase().includes(text.toUpperCase())
          );
        });

        this.setState({ clonedChartCodes: chartCodeSearchedData });
      }
    }
  };
  //when click on chart codes to sort data accordingly
  sortChartCodes = async () => {
    if (this.state.toggleChartCode) {
      await this.setState({
        toggleChartCode: false,
        sortColName: "chartCode",
      });
    } else {
      await this.setState({
        toggleChartCode: true,
        sortColName: "chartCode",
      });
    }
    if (this.state.toggleChartCode) {
      const chartCodesList = JSON.parse(
        JSON.stringify(this.state.clonedChartCodes)
      );

      let sortedChartCodes = chartCodesList.sort(function (a, b) {
        let codeA = a.code.toString().toUpperCase();
        let codeB = b.code.toString().toUpperCase();
        if (codeA > codeB) {
          return -1;
        }
        if (codeA < codeB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      this.setState({
        clonedChartCodes: sortedChartCodes,
        sortCheck: false,
      });
    } else {
      const chartCodesList = JSON.parse(
        JSON.stringify(this.state.clonedChartCodes)
      );

      let sortedChartCodes = chartCodesList.sort(function (a, b) {
        let codeA = a.code.toString().toUpperCase();
        let codeB = b.code.toString().toUpperCase();
        if (codeA > codeB) {
          return 1;
        }
        if (codeA < codeB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      this.setState({
        clonedChartCodes: sortedChartCodes,
        sortCheck: true,
      });
    }
  };
  //when click on description to sort data accordingly
  sortChartDescription = async () => {
    if (this.state.toggleChartDescription) {
      await this.setState({
        toggleChartDescription: false,
        sortColName: "desc",
      });
    } else {
      await this.setState({
        toggleChartDescription: true,
        sortColName: "desc",
      });
    }
    if (this.state.toggleChartDescription) {
      const chartCodesList = JSON.parse(
        JSON.stringify(this.state.clonedChartCodes)
      );

      let sortedChartCodes = chartCodesList.sort(function (a, b) {
        let descA =
          (a.description && a.description.toString().toUpperCase().trim()) ||
          "---";
        let descB =
          (b.description && b.description.toString().toUpperCase().trim()) ||
          "---";
        if (descA > descB) {
          return -1;
        }
        if (descA < descB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      this.setState({
        clonedChartCodes: sortedChartCodes,
        sortCheck: false,
      });
    } else {
      const chartCodesList = JSON.parse(
        JSON.stringify(this.state.clonedChartCodes)
      );

      let sortedChartCodes = chartCodesList.sort(function (a, b) {
        let descA =
          (a.description && a.description.toString().toUpperCase().trim()) ||
          "---";
        let descB =
          (b.description && b.description.toString().toUpperCase().trim()) ||
          "---";
        if (descA > descB) {
          return 1;
        }
        if (descA < descB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      this.setState({
        clonedChartCodes: sortedChartCodes,
        sortCheck: true,
      });
    }
  };
  handleShowSelected = (e) => {
    this.setState({ showSelected: e.target.checked });
    if (e.target.checked) {
      let showSelected = [];
      showSelected = this.state.chartCodes.filter((c) => {
        return c.checked;
      });

      this.setState({ clonedChartCodes: showSelected });
    } else {
      this.setState({
        clonedChartCodes: this.state.chartCodes || [],
      });
    }
  };
  //when user selects chart code row by clicking on checkbox
  handleCheckbox = async (e, data) => {
    let mainChartCodes = JSON.parse(JSON.stringify(this.state.chartCodes));
    let clndChartCodes = JSON.parse(
      JSON.stringify(this.state.clonedChartCodes)
    ); //copy of main chartcodes state

    let _mainChartCodes = []; //main chart codes
    let _clndChartCodes = []; //cloned chart codes
    let selectedChartCode = "";

    //if checked
    if (e.target.checked) {
      //first find previous selected checkbox(if exists bcz first time there's no checked checkbox) to uncheck and check the newly clicked
      let prevIndex = clndChartCodes.findIndex((t) => t.checked == true); //find previous checked index in cloned array
      let prevIndex_main = mainChartCodes.findIndex((t) => t.checked == true); //find previous checked index in main/main array
      if (prevIndex != -1) {
        //if there's then uncheck it through cloned chartcodes states
        clndChartCodes[prevIndex].checked = false;
      }
      if (prevIndex_main != -1) {
        //if there's then uncheck it through  main chartcodes states
        mainChartCodes[prevIndex_main].checked = false;
      }

      let fIndex = clndChartCodes.findIndex((t) => t.id == data.id);
      let fIndex_main = mainChartCodes.findIndex((t) => t.id == data.id);
      //now check the checkbox where the user clicks in both main and cloned states
      clndChartCodes[fIndex].checked = true;
      mainChartCodes[fIndex_main].checked = true;
      _clndChartCodes = clndChartCodes;
      _mainChartCodes = mainChartCodes;
      selectedChartCode = data.code;
    } else {
      //if user uncheck the same checkbox then also uncheck it from both main and cloned states
      let _fIndex = clndChartCodes.findIndex((t) => t.id == data.id);
      let _fIndex_main = mainChartCodes.findIndex((t) => t.id == data.id);
      clndChartCodes[_fIndex].checked = false;
      mainChartCodes[_fIndex_main].checked = false;
      _clndChartCodes = clndChartCodes;
      _mainChartCodes = mainChartCodes;
      selectedChartCode = "";
    }

    await this.setState({
      selectedChartCode,
      chartCodes: _mainChartCodes,
      clonedChartCodes: _clndChartCodes,
    });

    await this.props.getUpdatedChartCode(this.state.selectedChartCode);
    this.props.closeModal("openChartCodeModal");
    this.clearStates();
  };
  //when clicks on onSelect Button
  onSelect = async () => {
    if (this.state.selectedChartCode) {
      await this.props.getUpdatedChartCode(this.state.selectedChartCode);
      this.props.closeModal("openChartCodeModal");
      this.clearStates();
    }
  };
  clearStates = () => {
    this.props.closeModal("openChartCodeModal");
    this.setState({
      chartCodes: [],
      clonedChartCodes: [], //a copy of chartCodes
      chartCodesSearch: "", //search chart codes
      toggleChartCode: false,
      toggleChartDescription: false,
      selectedChartCode: "",
      showSelected: false,
      flag: true,
    });
  };

  addChartOfAccount = async () => {
    this.openModal("openChartOfAccountModal");
  };
  render() {
    let blockChart = localStorage.getItem("blockChart");

    //setting the default chart sorts
    let chartSort = "";
    let getDefaultValues = localStorage.getItem("getDefaultValues") || "";
    let parsedVals = getDefaultValues ? JSON.parse(getDefaultValues) : "";
    if (parsedVals && parsedVals.defaultValues) {
      if (parsedVals.defaultValues && parsedVals.defaultValues.chartSort) {
        chartSort = parsedVals.defaultValues.chartSort || "";
      }
    }
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openChartCodeModal}
          onHide={this.clearStates}
          className="forgot_email_modal modal_555 mx-auto"
        >
          <Modal.Body className="chart_code_custome-height">
            <div className="container-fluid ">
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">Chart Code</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() => {
                                  this.props.closeModal("openChartCodeModal");
                                }}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-ban"></span>
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12 pl-md-0">
                            <div className="table_search p-md-0">
                              <div className="row">
                                <div className="col input-group">
                                  <div className="input-group-prepend mm_append">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <img
                                        src="images/search-black.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="What are you looking for"
                                    aria-describedby="basic-addon1"
                                    name="chartCodesSearch"
                                    id="chartCodeSearchId"
                                    value={this.state.chartCodesSearch}
                                    onChange={this.chartCodesSearchHandler}
                                    onKeyDown={this.onEnter}
                                  />
                                </div>
                                <div className="col-auto p-md-0 align-self-center">
                                  <button
                                    onClick={this.onSearch}
                                    className="search_btn"
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 mt-md-3 mb-1 p-md-0">
                            <div className="forgot_header">
                              <div className="modal-top-header">
                                <div className="row">
                                  <div className="col">
                                    <div className="form-group remember_check mm_check3 mm_checkCc2">
                                      <input
                                        type="checkbox"
                                        id="remember-chart-c"
                                        checked={this.state.showSelected}
                                        name="checkbox"
                                        onChange={this.handleShowSelected}
                                      />
                                      <label htmlFor="remember-chart-c"></label>
                                      <p className="pt-1 mm_font">
                                        Show Selected:
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-auto d-flex justify-content-end s-c-main">
                                    <button
                                      type="button"
                                      className="btn-save ml-2"
                                      onClick={this.getChartCodes}
                                    >
                                      <img
                                        src="images/refresh.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </button>
                                    {blockChart === "N" && (
                                      <button
                                        type="button"
                                        className="btn-save ml-2"
                                      >
                                        <img
                                          onClick={this.addChartOfAccount}
                                          src="images/plus.png"
                                          className="mx-auto"
                                          alt="search-icon"
                                        />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 p-md-0">
                            <div className="login_form">
                              <div className="login_table_list">
                                <table className="table table-hover project_table chart_code">
                                  <thead>
                                    <tr>
                                      <th scope="col">
                                        <div className="col align-self-center">
                                          <div
                                            onClick={this.sortChartCodes}
                                            className="cursorPointer font__wrapper-inner form-group remember_check mm_ffamily"
                                          >
                                            Chart Code{" "}
                                            {this.state.sortColName ===
                                              "chartCode" && (
                                              <i
                                                className={
                                                  this.state.sortCheck
                                                    ? "fa fa-angle-down sideBarAccord rorate_0"
                                                    : "fa fa-angle-down sideBarAccord"
                                                }
                                              ></i>
                                            )}
                                          </div>
                                        </div>
                                      </th>
                                      <th
                                        onClick={this.sortChartDescription}
                                        scope="col"
                                        className="cursorPointer"
                                      >
                                        Description{" "}
                                        {this.state.sortColName === "desc" && (
                                          <i
                                            className={
                                              this.state.sortCheck
                                                ? "fa fa-angle-down sideBarAccord rorate_0"
                                                : "fa fa-angle-down sideBarAccord"
                                            }
                                          ></i>
                                        )}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.clonedChartCodes.map((c, i) => {
                                      return (
                                        <tr key={i}>
                                          <th scope="row">
                                            <div className="col align-self-center">
                                              <div className="form-group remember_check mm_check3 mm_checkCc">
                                                <input
                                                  type="checkbox"
                                                  id={"chartCode" + i}
                                                  checked={
                                                    c.checked ? true : false
                                                  }
                                                  name="checkbox"
                                                  onChange={(e) =>
                                                    this.handleCheckbox(e, c)
                                                  }
                                                />
                                                <label
                                                  htmlFor={"chartCode" + i}
                                                >
                                                  {" "}
                                                </label>
                                                <span>{c.code}</span>
                                              </div>
                                            </div>
                                          </th>
                                          <td>{c.description}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_header mb-md-3">
                        <div className="modal-top-header">
                          <div className="row">
                            {/* <div className="col d-flex justify-content-start s-c-main">
                              <button
                                onClick={this.onSelect}
                                type="button"
                                className="btn-save ml-2"
                              >
                                <span className="fa fa-check"></span>
                                Select
                              </button>
                            </div> */}
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

        <ChartOfAccount
          openChartOfAccountModal={this.state.openChartOfAccountModal}
          closeModal={this.closeModal}
          props={this.props.props || ""}
          chartSort={chartSort || ""}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getChartCodes,
  clearChartStates,
  clearStatesAfterLogout,
})(ChartCode);
