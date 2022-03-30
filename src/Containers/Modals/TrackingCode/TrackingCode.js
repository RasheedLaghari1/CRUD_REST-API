import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  getFlags,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";

class TrackingCode extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      trackingCodes: [],
      clonedtrackingCodes: [], //a copy of trackingCodes
      trackingCodesSearch: "", //search tracking codes
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
      sortColName: "tracCode", //too check which column is going to sort either Tax Code OR Description
      toggleTrackingCode: false,
      toggleTrackingDescription: false,
      showSelected: false,
      selectedTrackingCode: "",
    };
  }
  async componentWillReceiveProps(np) {
    if (np.openTrackingCodeModal) {
      //focus search input field by pressing Tab key
      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 9) {
          evt.preventDefault();
          let id = document.getElementById("trackingCodesSearchId");
          if (id) {
            document.getElementById("trackingCodesSearchId").focus();
          }
        }
      };
    } else {
      //remove focus search input field
      document.onkeydown = function (evt) {
        return true;
      };
    }
    if (this.props.trackingCodes && this.props.trackingCodes.flagArr) {
      let trakCodes = this.props.trackingCodes.flagArr || [];

      trakCodes.map((t, i) => {
        if (t.code == this.props.trackingCodes.data.value) {
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

      let sortedList = trakCodes.sort(function (a, b) {
        let codeA = a.code.toString().toUpperCase();
        let codeB = b.code.toString().toUpperCase();

        if (codeA < codeB) {
          return -1;
        }
        if (codeA > codeB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });

      this.setState({
        trackingCodes: sortedList,
        clonedtrackingCodes: sortedList,
        sortCheck: true,
        sortColName: "tracCode",
      });
    }
  }
  // when click on refresh button then get updated tracking codes
  getTrackingCodes = async () => {
    this.setState({
      isLoading: true,
      trackingCodesSearch: "",
      trackingCodes: this.state.clonedtrackingCodes || [],
    });

    await this.props.getFlags();
    //success case of Get Flags List
    if (this.props.chart.getFlagsSuccess) {
      // toast.success(this.props.chart.getFlagsSuccess);
      if (this.props.trackingCodes && this.props.trackingCodes.flagArr) {
        let trakCodes = [];

        for (var f of Object.keys(this.props.chart.getFlags)) {
          if (
            this.props.trackingCodes.data.label.toLowerCase() ===
            f.toLowerCase()
          ) {
            trakCodes = this.props.chart.getFlags[f];
          }
        }

        trakCodes.map((t, i) => {
          if (t.code == this.props.trackingCodes.data.value) {
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
        this.setState({
          trackingCodes: trakCodes,
          clonedtrackingCodes: trakCodes,
        });
      }
    }
    //error case of Get Flags List
    if (this.props.chart.getFlagsError) {
      this.handleApiRespErr(this.props.chart.getFlagsError);
    }
    this.setState({ isLoading: false });
  };
  //a function that checks api error
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
  //when type in search box
  trackingCodesSearchHandler = (e) => {
    let text = e.target.value;
    if (!text) {
      this.setState({
        trackingCodesSearch: text,
        trackingCodes: this.state.clonedtrackingCodes || [],
      });
    } else {
      this.setState({
        trackingCodesSearch: text,
      });
    }
  };
  //when clicks on search button
  onSearch = () => {
    let text = this.state.trackingCodesSearch.trim();
    if (text) {
      let trackingCodeSearchedData = [];

      trackingCodeSearchedData = this.state.clonedtrackingCodes.filter((c) => {
        return (
          c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
          c.description.toUpperCase().includes(text.toUpperCase())
        );
      });

      this.setState({ trackingCodes: trackingCodeSearchedData });
    }
  };
  onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = this.state.trackingCodesSearch.trim();
      if (text) {
        let trackingCodeSearchedData = [];

        trackingCodeSearchedData = this.state.clonedtrackingCodes.filter(
          (c) => {
            return (
              c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
              c.description.toUpperCase().includes(text.toUpperCase())
            );
          }
        );

        this.setState({ trackingCodes: trackingCodeSearchedData });
      }
    }
  };
  //when click on tracking codes to sort data accordingly
  sortTrackingCodes = async () => {
    if (this.state.toggleTrackingCode) {
      await this.setState({
        toggleTrackingCode: false,
        sortColName: "tracCode",
      });
    } else {
      await this.setState({
        toggleTrackingCode: true,
        sortColName: "tracCode",
      });
    }
    if (this.state.toggleTrackingCode) {
      const trackingCodesList = JSON.parse(
        JSON.stringify(this.state.trackingCodes)
      );

      let sortedTrackingCodes = trackingCodesList.sort(function (a, b) {
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
        trackingCodes: sortedTrackingCodes,
        sortCheck: false,
      });
    } else {
      const trackingCodesList = JSON.parse(
        JSON.stringify(this.state.trackingCodes)
      );

      let sortedTrackingCodes = trackingCodesList.sort(function (a, b) {
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
        trackingCodes: sortedTrackingCodes,
        sortCheck: true,
      });
    }
  };
  //when click on description to sort data accordingly
  sortTrackingDescription = async () => {
    if (this.state.toggleTrackingDescription) {
      await this.setState({
        toggleTrackingDescription: false,
        sortColName: "desc",
      });
    } else {
      await this.setState({
        toggleTrackingDescription: true,
        sortColName: "desc",
      });
    }
    if (this.state.toggleTrackingDescription) {
      const trackingCodesList = JSON.parse(
        JSON.stringify(this.state.trackingCodes)
      );

      let sortedTrackingCodes = trackingCodesList.sort(function (a, b) {
        let descA =
          (a.description && a.description.toString().toUpperCase().trim()) ||
          "---";
        let descB =
          (b.description && b.description.toString().toUpperCase().trim()) ||
          "---";

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
        trackingCodes: sortedTrackingCodes,
        sortCheck: true,
      });
    } else {
      const trackingCodesList = JSON.parse(
        JSON.stringify(this.state.trackingCodes)
      );

      let sortedTrackingCodes = trackingCodesList.sort(function (a, b) {
        let descA =
          (a.description && a.description.toString().toUpperCase().trim()) ||
          "---";
        let descB =
          (b.description && b.description.toString().toUpperCase().trim()) ||
          "---";
        if (descA < descB) {
          return 1;
        }
        if (descA > descB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      this.setState({
        trackingCodes: sortedTrackingCodes,
        sortCheck: false,
      });
    }
  };

  handleShowSelected = async (e) => {
    this.setState({ showSelected: e.target.checked });
    if (e.target.checked) {
      let showSelected = [];

      showSelected = this.state.clonedtrackingCodes.filter((c) => {
        return c.checked;
      });

      this.setState({ trackingCodes: showSelected });
    } else {
      this.setState({
        trackingCodes: this.state.clonedtrackingCodes || [],
      });
    }
  };
  //when user selects tracking code row by clicking on checkbox
  handleCheckbox = async (e, data) => {
    let mainTrackingCodes = JSON.parse(
      JSON.stringify(this.state.trackingCodes)
    );
    let clndTrackingCodes = JSON.parse(
      JSON.stringify(this.state.clonedtrackingCodes)
    ); //copy of main tracking state

    let trackingCodesArr = []; //main tracking codes
    let trackingCodes = []; //cloned tracking codes
    let selectedTrackingCode = "";

    //if checked
    if (e.target.checked) {
      //first find previous selected checkbox(if exists bcz first time there's no checked checkbox) to uncheck and check the newly clicked
      let prevIndex = clndTrackingCodes.findIndex((t) => t.checked == true); //find previous checked index in cloned array
      let prevIndex_main = mainTrackingCodes.findIndex(
        (t) => t.checked == true
      ); //find previous checked index in main/main array
      if (prevIndex != -1) {
        //if there's then uncheck it through cloned tracking states
        clndTrackingCodes[prevIndex].checked = false;
      }
      if (prevIndex_main != -1) {
        //if there's then uncheck it through  main tracking states
        mainTrackingCodes[prevIndex_main].checked = false;
      }

      let fIndex = clndTrackingCodes.findIndex((t) => t.id == data.id);
      let fIndex_main = mainTrackingCodes.findIndex((t) => t.id == data.id);
      //now check the checkbox where the user clicks in both main and cloned states
      clndTrackingCodes[fIndex].checked = true;
      mainTrackingCodes[fIndex_main].checked = true;
      trackingCodes = clndTrackingCodes;
      trackingCodesArr = mainTrackingCodes;
      selectedTrackingCode = data;
    } else {
      //if user uncheck the same checkbox then also uncheck it from both main and cloned states
      let _fIndex = clndTrackingCodes.findIndex((t) => t.id == data.id);
      let _fIndex_main = mainTrackingCodes.findIndex((t) => t.id == data.id);
      clndTrackingCodes[_fIndex].checked = false;
      mainTrackingCodes[_fIndex_main].checked = false;
      trackingCodes = clndTrackingCodes;
      trackingCodesArr = mainTrackingCodes;
      selectedTrackingCode = "";
    }

    if (data) {
      await this.setState({
        selectedTrackingCode,
        trackingCodes: trackingCodesArr,
        clonedtrackingCodes: trackingCodes,
      });
    }

    if (selectedTrackingCode) {
      await this.props.getUpdatedTrackingCode(
        this.state.selectedTrackingCode,
        this.props.trackingCodes.data
      );
      this.clearStates();
    }
  };
  //when clicks on select button
  onSelect = async () => {
    if (this.state.selectedTrackingCode) {
      await this.props.getUpdatedTrackingCode(
        this.state.selectedTrackingCode,
        this.props.trackingCodes.data
      );
      this.clearStates();
    }
  };
  clearStates = async () => {
    this.props.closeModal("openTrackingCodeModal");
    this.setState({
      trackingCodes: [],
      clonedtrackingCodes: [], //a copy of trackingCodes
      trackingCodesSearch: "", //search tracking codes
      toggleTrackingCode: false,
      toggleTrackingDescription: false,
      selectedTrackingCode: "",
      showSelected: false,
    });
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openTrackingCodeModal}
          onHide={this.clearStates}
          className="forgot_email_modal modal_555 mx-auto"
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
                                Tracking Codes
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() => {
                                  this.props.closeModal(
                                    "openTrackingCodeModal"
                                  );
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
                            <div className="table_search">
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
                                    name="clonedtrackingCodes"
                                    id="trackingCodesSearchId"
                                    value={this.state.trackingCodesSearch}
                                    onChange={this.trackingCodesSearchHandler}
                                    onKeyDown={this.onEnter}
                                  />
                                </div>
                                <div className="col-auto p-md-0 align-self-center">
                                  <button
                                    className="search_btn"
                                    onClick={this.onSearch}
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 mt-md-3 mb-1">
                            <div className="forgot_header">
                              <div className="modal-top-header">
                                <div className="row">
                                  <div className="col">
                                    <div className="form-group remember_check mm_check4 mm_checkCc2">
                                      <input
                                        type="checkbox"
                                        id="remember-trc"
                                        checked={this.state.showSelected}
                                        name="checkbox"
                                        onChange={this.handleShowSelected}
                                      />
                                      <label htmlFor="remember-trc"></label>
                                      <p className="pt-1 mm_font">
                                        Show Selected:
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-auto d-flex justify-content-end s-c-main">
                                    <button
                                      onClick={() =>
                                        this.props.closeModal(
                                          "openTaxCodeModal"
                                        )
                                      }
                                      type="button"
                                      className="btn-save ml-2"
                                    ></button>
                                    <button
                                      type="button"
                                      className="btn-save ml-2"
                                      onClick={this.getTrackingCodes}
                                    >
                                      <img
                                        src="images/refresh.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="login_form">
                              <div className="login_table_list">
                                <table className="table table-hover project_table">
                                  <thead>
                                    <tr>
                                      <th scope="col">
                                        <div className="col align-self-center">
                                          <div
                                            onClick={this.sortTrackingCodes}
                                            className="cursorPointer font__wrapper-inner form-group remember_check mm_ffamily"
                                          >
                                            Tracking Code{" "}
                                            {this.state.sortColName ===
                                            "tracCode" ? (
                                              <i
                                                className={
                                                  this.state.sortCheck
                                                    ? "fa fa-angle-down sideBarAccord rorate_0"
                                                    : "fa fa-angle-down sideBarAccord"
                                                }
                                              ></i>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                      </th>
                                      <th
                                        scope="col"
                                        onClick={this.sortTrackingDescription}
                                        className="cursorPointer"
                                      >
                                        Description{" "}
                                        {this.state.sortColName === "desc" ? (
                                          <i
                                            className={
                                              this.state.sortCheck
                                                ? "fa fa-angle-down sideBarAccord rorate_0"
                                                : "fa fa-angle-down sideBarAccord"
                                            }
                                          ></i>
                                        ) : (
                                          ""
                                        )}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.trackingCodes.map((t, i) => {
                                      return (
                                        <tr key={i}>
                                          <th scope="row">
                                            <div className="col align-self-center">
                                              <div className="form-group remember_check mm_check4">
                                                <input
                                                  type="checkbox"
                                                  id={"trackingCodes" + i}
                                                  checked={
                                                    t.checked ? true : false
                                                  }
                                                  name="checkbox"
                                                  onChange={(e) =>
                                                    this.handleCheckbox(e, t)
                                                  }
                                                />
                                                <label
                                                  htmlFor={"trackingCodes" + i}
                                                >
                                                  {t.code}
                                                </label>
                                              </div>
                                            </div>
                                          </th>
                                          <td>{t.description}</td>
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
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getFlags,
  clearChartStates,
  clearStatesAfterLogout,
})(TrackingCode);
