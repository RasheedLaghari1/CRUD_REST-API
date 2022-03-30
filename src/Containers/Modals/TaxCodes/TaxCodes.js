import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  getTaxCodes,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";
class TaxCodes extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      taxCodes: [],
      clonedTaxCodes: [], //a copy of Tax Codes
      taxCodesSearch: "", //search Tax codes
      toggleCode: false, //when click on tax codes to sort
      toggleDescription: false, //when click on description to sort
      showSelected: false,
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
      sortColName: "taxCode", //too check which column is going to sort either Tax Code OR Description
      selectedTaxCode: "",
    };
  }
  async componentWillReceiveProps(np) {
    if (np.openTaxCodeModal) {
      //focus search input field by pressing Tab key
      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 9) {
          evt.preventDefault();
          let id = document.getElementById("taxCodeSearchId");
          if (id) {
            document.getElementById("taxCodeSearchId").focus();
          }
        }
      };
    } else {
      //remove focus search input field
      document.onkeydown = function (evt) {
        return true;
      };
    }

    if (this.props.taxCodes) {
      let txCodes = this.props.taxCodes || [];
      txCodes.map((t, i) => {
        if (t.code == this.props.taxCode) {
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

      let sortedList = txCodes.sort(function (a, b) {
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
        taxCodes: sortedList,
        clonedTaxCodes: sortedList,
        sortCheck: true,
        sortColName: "taxCode",
      });
    }
  }
  // when click on refresh button then call get tax code api
  getTaxCode = async () => {
     this.setState({
      isLoading: true,
      taxCodesSearch: "",
      clonedTaxCodes: this.state.taxCodes || [],
    });

    await this.props.getTaxCodes();
    //success case of Get Tax Codes
    if (this.props.chart.getTaxCodesSuccess) {
      // toast.success(this.props.chart.getTaxCodesSuccess);
    }
    //error case of Get Tax Codes
    if (this.props.chart.getTaxCodesError) {
       this.handleApiRespErr(this.props.chart.getTaxCodesError);
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
      //Netork Error
      toast.error(error);
    }
  };
  //when type in search box
  taxCodesSearchHandler = async (e) => {
    let text = e.target.value;
    if (!text) {
       this.setState({
        taxCodesSearch: text,
        clonedTaxCodes: this.state.taxCodes || [],
      });
    }else{
       this.setState({
        taxCodesSearch: text,
      });
    }
   
  };
  //when clicks on search button
  onSearch = () => {
    let text = this.state.taxCodesSearch.trim();
    if (text) {
      let taxCodeSearchedData = [];

      taxCodeSearchedData = this.state.taxCodes.filter((c) => {
        return (
          c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
          c.description.toUpperCase().includes(text.toUpperCase())
        );
      });

      this.setState({ clonedTaxCodes: taxCodeSearchedData });
    }
  };

  onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = this.state.taxCodesSearch.trim();
      if (text) {
        let taxCodeSearchedData = [];

        taxCodeSearchedData = this.state.taxCodes.filter((c) => {
          return (
            c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
            c.description.toUpperCase().includes(text.toUpperCase())
          );
        });

        this.setState({ clonedTaxCodes: taxCodeSearchedData });
      }
    }
  };

  handleShowSelected = async (e) => {
    this.setState({ showSelected: e.target.checked });
    if (e.target.checked) {
      let showSelected = [];

      showSelected = this.state.taxCodes.filter((c) => {
        return c.checked;
      });

       this.setState({ clonedTaxCodes: showSelected });
    } else {
       this.setState({
        clonedTaxCodes: this.state.taxCodes || [],
      });
    }
  };

  //when click on tax codes to sort data accordingly
  sortTaxCodes = async () => {
    if (this.state.toggleCode) {
      await this.setState({
        toggleCode: false,
        sortColName: "taxCode",
      });
    } else {
      await this.setState({
        toggleCode: true,
        sortColName: "taxCode",
      });
    }
    if (this.state.toggleCode) {
      const taxCodesList = JSON.parse(
        JSON.stringify(this.state.clonedTaxCodes)
      );

      let sortedTaxCodes = taxCodesList.sort(function (a, b) {
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
        clonedTaxCodes: sortedTaxCodes,
        sortCheck: false,
      });
    } else {
      const taxCodesList = JSON.parse(
        JSON.stringify(this.state.clonedTaxCodes)
      );

      let sortedTaxCodes = taxCodesList.sort(function (a, b) {
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
        clonedTaxCodes: sortedTaxCodes,
        sortCheck: true,
      });
    }
  };
  //when click on description to sort data accordingly
  sortDescription = async () => {
    if (this.state.toggleDescription) {
      await this.setState({
        toggleDescription: false,
        sortColName: "desc",
      });
    } else {
      await this.setState({
        toggleDescription: true,
        sortColName: "desc",
      });
    }
    if (this.state.toggleDescription) {
      const taxCodesList = JSON.parse(
        JSON.stringify(this.state.clonedTaxCodes)
      );

      let sortedTaxCodes = taxCodesList.sort(function (a, b) {
        let descA = a.description.toString().toUpperCase();
        let descB = b.description.toString().toUpperCase();
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
        clonedTaxCodes: sortedTaxCodes,
        sortCheck: true,
      });
    } else {
      const taxCodesList = JSON.parse(
        JSON.stringify(this.state.clonedTaxCodes)
      );

      let sortedTaxCodes = taxCodesList.sort(function (a, b) {
        let descA = a.description.toString().toUpperCase();
        let descB = b.description.toString().toUpperCase();
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
        clonedTaxCodes: sortedTaxCodes,
        sortCheck: false,
      });
    }
  };
  //when user selects tax code row by clicking on checkbox
  handleCheckbox = async (e, data) => {
    let mainTaxCodes = JSON.parse(JSON.stringify(this.state.taxCodes));
    let clndTaxCodes = JSON.parse(JSON.stringify(this.state.clonedTaxCodes)); //copy of main taxcodes state

    let taxCodes = []; //cloned tax codes
    let taxCodesArr = []; //main tax codes
    let selectedTaxCode = "";

    //if checked
    if (e.target.checked) {
      //first find previous selected checkbox(if exists bcz first time there's no checked checkbox) to uncheck and check the newly clicked
      let prevIndex = clndTaxCodes.findIndex((t) => t.checked == true); //find previous checked index in cloned array
      let prevIndex_main = mainTaxCodes.findIndex((t) => t.checked == true); //find previous checked index in main/main array
      if (prevIndex != -1) {
        //if there's then uncheck it through cloned taxcodes states
        clndTaxCodes[prevIndex].checked = false;
      }
      if (prevIndex_main != -1) {
        //if there's then uncheck it through  main taxcodes states
        mainTaxCodes[prevIndex_main].checked = false;
      }

      let fIndex = clndTaxCodes.findIndex((t) => t.id == data.id);
      let fIndex_main = mainTaxCodes.findIndex((t) => t.id == data.id);
      //now check the checkbox where the user clicks in both main and cloned states
      clndTaxCodes[fIndex].checked = true;
      mainTaxCodes[fIndex_main].checked = true;
      taxCodes = clndTaxCodes;
      taxCodesArr = mainTaxCodes;
      selectedTaxCode = data.code;
    } else {
      //if user uncheck the same checkbox then also uncheck it from both main and cloned states
      let _fIndex = clndTaxCodes.findIndex((t) => t.id == data.id);
      let _fIndex_main = mainTaxCodes.findIndex((t) => t.id == data.id);
      clndTaxCodes[_fIndex].checked = false;
      mainTaxCodes[_fIndex_main].checked = false;
      taxCodes = clndTaxCodes;
      taxCodesArr = mainTaxCodes;
      selectedTaxCode = "";
    }

    // if (data && data.code) {
    await this.setState({
      selectedTaxCode,
      clonedTaxCodes: taxCodes,
      taxCodes: taxCodesArr,
    });
    // }

    await this.props.getUpdatedTaxCode(this.state.selectedTaxCode);

     this.props.closeModal("openTaxCodeModal");
     this.clearStates();
  };
  //when clicks on onSelect Button
  onSelect = async () => {
    // if (this.state.selectedTaxCode) {
    await this.props.getUpdatedTaxCode(this.state.selectedTaxCode);

    await this.props.closeModal("openTaxCodeModal");
    await this.clearStates();
    // }
  };
  clearStates =  () => {
     this.props.closeModal("openTaxCodeModal");
     this.setState({
      taxCodes: [],
      clonedTaxCodes: [], //a copy of Tax Codes
      taxCodesSearch: "", //search Tax codes
      toggleCode: false, //when click on tax codes to sort
      toggleDescription: false, //when click on description to sort
      selectedTaxCode: "",
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
          show={this.props.openTaxCodeModal}
          onHide={() => this.props.closeModal("openTaxCodeModal")}
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
                              <h6 className="text-left def-blue">Tax Codes</h6>
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
                                    name="taxCodesSearch"
                                    id="taxCodeSearchId"
                                    value={this.state.taxCodesSearch}
                                    onChange={this.taxCodesSearchHandler}
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

                          <div className="col-12 mt-md-3 mb-1">
                            <div className="forgot_header">
                              <div className="modal-top-header">
                                <div className="row">
                                  <div className="col">
                                    <div className="form-group remember_check mm_checktc">
                                      <input
                                        type="checkbox"
                                        id="remember-tc"
                                        checked={this.state.showSelected}
                                        name="checkbox"
                                        onChange={this.handleShowSelected}
                                      />

                                      <label htmlFor="remember-tc"></label>
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
                                    >
                                      {/* <Link to="/chartofaccount">
                                        <img
                                          src="images/plus.png"
                                          className="mx-auto"
                                          alt="search-icon"
                                        />
                                      </Link> */}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-save ml-2"
                                      onClick={this.getTaxCode}
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
                                            onClick={this.sortTaxCodes}
                                            className="cursorPointer form-group remember_check team_groups"
                                          >
                                            Tax Codes{" "}
                                            {this.state.sortColName ===
                                            "taxCode" ? (
                                              <i
                                                className={
                                                  this.state.sortCheck
                                                    ? "fa fa-angle-down sideBarAccord rorate_0"
                                                    : "fa fa-angle-down sideBarAccord"
                                                }
                                              ></i>
                                            ) : (
                                              ""
                                            )}{" "}
                                          </div>
                                        </div>
                                      </th>
                                      <th
                                        className="cursorPointer"
                                        onClick={this.sortDescription}
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
                                        )}{" "}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.clonedTaxCodes.map((t, i) => {
                                      return (
                                        <tr key={i}>
                                          <th scope="row">
                                            <div className="col align-self-center">
                                              <div className="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id={"taxCode" + i}
                                                  checked={
                                                    t.checked ? true : false
                                                  }
                                                  name="checkbox"
                                                  onChange={(e) =>
                                                    this.handleCheckbox(e, t)
                                                  }
                                                />
                                                <label htmlFor={"taxCode" + i}>
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
                      {/* <div className="forgot_header mb-md-3">
                        <div className="modal-top-header">
                          <div className="row">
                            <div className="col d-flex justify-content-start s-c-main">
                              <button
                                onClick={this.onSelect}
                                type="button"
                                className="btn-save ml-2"
                              >
                                <span className="fa fa-check"></span>
                                Select
                              </button>
                            </div>
                          </div>
                        </div>
                      </div> */}
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
  getTaxCodes,
  clearChartStates,
  clearStatesAfterLogout,
})(TaxCodes);
