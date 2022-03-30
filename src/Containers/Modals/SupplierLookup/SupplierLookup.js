import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";

import SupplierForm from "../SupplierForm/SupplierForm";
import { toast } from "react-toastify";

import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";

import {
  getSupplierDetails,
  clearSupplierStates,
} from "../../../Actions/SupplierActtions/SupplierActions";

import {
  getCurrencies,
  getTaxCodes,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";

class SupplierLookup extends Component {
  constructor() {
    super();
    this.state = {
      openSupplierForm: false,
      showSelected: false,
      supplierSearch: "",
      isLoading: false,
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
      sortColName: "supName", //too check which column is going to sort either Tax Code OR Description
      toggleSupplierName: false,
      toggleCurrency: false,
      toggleTaxId: false,
      suppliersList: [],
      clonedSuppliersList: [],
    };
  }
  async componentWillReceiveProps(np) {
    // if(this.state.openSupplierForm){
    //   document.removeEventListener("onkeydown");
    // }
    // if (np.openSupplierLookupModal && !this.state.openSupplierForm) {
    //   //focus search input field by pressing Tab key
    //   document.onkeydown = function (evt) {
    //     evt = evt || window.event;
    //     if (evt.keyCode == 9) {
    //       evt.preventDefault();
    //       let id = document.getElementById("supplierLookupSearch");
    //       if (id) {
    //         document.getElementById("supplierLookupSearch").focus();
    //       }
    //     }
    //   };
    // }
    if (this.props.suppliersList) {
      let suppliersList = this.props.suppliersList || [];
      suppliersList.map((s, i) => {
        if (s.code == this.props.supplierCode) {
          //to show selected default
          s.checked = true;
          s.id = i;
          return s;
        } else {
          s.id = i;
          s.checked = false;
          return s;
        }
      });

      let sortedList = suppliersList.sort(function (a, b) {
        let descA = a.name.toString().toUpperCase();
        let descB = b.name.toString().toUpperCase();
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
        suppliersList: sortedList,
        clonedSuppliersList: sortedList,
        sortCheck: true,
        sortColName: "supName",
      });
    }

    if (
      this.props.stateData &&
      this.props.page == "editInvoice" &&
      this.props.stateData.editName
    ) {
      let name = this.props.stateData.supplierName || "";
       this.setState({ supplierSearch: name });
      await this.onSuppliersListSearch(name);
    } else {
       this.setState({ supplierSearch: "" });
    }
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  //when click on Supplier name to sort data accordingly
  sortSupplierName = async () => {
    if (this.state.toggleSupplierName) {
      await this.setState({
        toggleSupplierName: false,
        sortColName: "supName",
      });
    } else {
      await this.setState({
        toggleSupplierName: true,
        sortColName: "supName",
      });
    }
    if (this.state.toggleSupplierName) {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedSupplierNames = suppliersList.sort(function (a, b) {
        let descA = a.name.toString().toUpperCase();
        let descB = b.name.toString().toUpperCase();
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
        clonedSuppliersList: sortedSupplierNames,
        sortCheck: false,
      });
    } else {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedSupplierNames = suppliersList.sort(function (a, b) {
        let descA = a.name.toString().toUpperCase();
        let descB = b.name.toString().toUpperCase();
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
        clonedSuppliersList: sortedSupplierNames,
        sortCheck: true,
      });
    }
  };
  //when click on Currency to sort data accordingly
  sortCurrency = async () => {
    if (this.state.toggleCurrency) {
      await this.setState({
        toggleCurrency: false,
        sortColName: "currency",
      });
    } else {
      await this.setState({
        toggleCurrency: true,
        sortColName: "currency",
      });
    }
    if (this.state.toggleCurrency) {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedList = suppliersList.sort(function (a, b) {
        let curA = a.currency.toString().toUpperCase();
        let curB = b.currency.toString().toUpperCase();
        if (curA > curB) {
          return -1;
        }
        if (curA < curB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
       this.setState({
        clonedSuppliersList: sortedList,
        sortCheck: false,
      });
    } else {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedList = suppliersList.sort(function (a, b) {
        let curA = a.currency.toString().toUpperCase();
        let curB = b.currency.toString().toUpperCase();
        if (curA > curB) {
          return 1;
        }
        if (curA < curB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
       this.setState({
        clonedSuppliersList: sortedList,
        sortCheck: true,
      });
    }
  };
  //when click on Currency to sort data accordingly
  sortTaxID = async () => {
    if (this.state.toggleTaxId) {
      await this.setState({
        toggleTaxId: false,
        sortColName: "taxId",
      });
    } else {
      await this.setState({
        toggleTaxId: true,
        sortColName: "taxId",
      });
    }
    if (this.state.toggleTaxId) {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedList = suppliersList.sort(function (a, b) {
        let idA = a.taxID.toString().toUpperCase();
        let id = b.taxID.toString().toUpperCase();
        if (idA > id) {
          return -1;
        }
        if (idA < id) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
       this.setState({
        clonedSuppliersList: sortedList,
        sortCheck: false,
      });
    } else {
      const suppliersList = JSON.parse(
        JSON.stringify(this.state.clonedSuppliersList)
      );

      let sortedList = suppliersList.sort(function (a, b) {
        let idA = a.taxID.toString().toUpperCase();
        let idB = b.taxID.toString().toUpperCase();
        if (idA > idB) {
          return 1;
        }
        if (idA < idB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
       this.setState({
        clonedSuppliersList: sortedList,
        sortCheck: true,
      });
    }
  };

  //when type in search box
  supplierSearchHandler = async (e) => {
    let text = e.target.value;
    if (!text) {
       this.setState({
        supplierSearch: text,
        clonedSuppliersList: this.state.suppliersList || [],
      });
    }else{
       this.setState({
        supplierSearch: text,
      });
    }
   
  };
  //when clicks on search button
  onSearch = async () => {
    let text = this.state.supplierSearch.trim();
    await this.onSuppliersListSearch(text);
  };

  onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = this.state.supplierSearch.trim();
      await this.onSuppliersListSearch(text);
    }
  };

  onSuppliersListSearch =  (searchedText) => {
    const clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.suppliersList)
    );

    if (!searchedText) {
       this.setState({
        clonedSuppliersList: this.state.suppliersList || [],
      });
    } else {
      let suppliersListFilterdData = clonedSuppliersList.filter((c) => {
        return c.name.toUpperCase().includes(searchedText.toUpperCase());
      });
       this.setState({ clonedSuppliersList: suppliersListFilterdData });
    }
  };
  getSuppliersList = async () => {
     this.setState({ isLoading: true });
    await this.props.getSuppliersList();
     this.setState({ isLoading: false });
  };

  clearStates =  () => {
     this.props.closeModal("openSupplierLookupModal");
     this.setState({
      supplierSearch: "",
      isLoading: false,
      suppliersList: [],
      clonedSuppliersList: [],
      openSupplierForm: false,
      showSelected: false
    });
  };

  handleCheckbox = async (e, data) => {
    if (e.target.checked) {
      await this.props.updatePOSupplier(data);
       this.clearStates();
    }
  };
  addSupplier = () => {
    this.props.props.history.push("/new-supplier2", {
      stateData: this.props.stateData,
      page: this.props.page,
    });
  };

  //Edit the Supplier when clicks on Edit button
  editSupplier = async (supplier) => {
    let { code, currency } = supplier;
    if (code && currency) {
       this.setState({ isLoading: true });
      let promises = [
        this.getTaxCodes(),
        this.getCurrencies(),
        this.getSupplierDetails(supplier),
      ];
      await Promise.all(promises);
       this.setState({ isLoading: false });

       this.openModal("openSupplierForm");
    } else {
      toast.error("Supplier Code or Currency missing!");
    }
  };

  handleShowSelected =  (e) => {
    this.setState({ showSelected: e.target.checked });
    if (e.target.checked) {
      let showSelected = [];

       showSelected = this.state.clonedSuppliersList.filter((c) => {
        return c.checked;
      });
       this.setState({ clonedSuppliersList: showSelected });
    } else {
       this.setState({
        clonedSuppliersList: this.state.suppliersList || [],
      });
    }
  };

  //get currencies
  getCurrencies = async () => {
    let isCurrencies = false;
    if (this.props.chart.getCurrencies.length > 0) {
      isCurrencies = true;
    } else {
      await this.props.getCurrencies();
    }

    //success case of Get Currencies
    if (this.props.chart.getCurrenciesSuccess || isCurrencies) {
      // toast.success(this.props.chart.getCurrenciesSuccess);
    }
    //error case of Get Currencies
    if (this.props.chart.getCurrenciesError) {
       this.handleApiRespErr(this.props.chart.getCurrenciesError);
    }
  };

  getTaxCodes = async () => {
    let codes = this.props.chart.getTaxCodes || [];
    if (codes.length === 0) {
      await this.props.getTaxCodes();
    }
    //success case of Get Tax Codes
    if (this.props.chart.getTaxCodesSuccess) {
      // toast.success(this.props.chart.getTaxCodesSuccess);
    }
    //error case of Get Tax Codes
    if (this.props.chart.getTaxCodesError) {
       this.handleApiRespErr(this.props.chart.getTaxCodesError);
    }
  };
  //get info of single supplier
  getSupplierDetails = async (supplier) => {
    let supplierDetails = {
      currency: supplier.currency,
      code: supplier.code,
    };

    await this.props.getSupplierDetails(supplierDetails);

    //success case of Get  Supplier Details
    if (this.props.supplier.getSupplierDetailsSuccess) {
      // toast.success(this.props.supplier.getSupplierDetailsSuccess);
    }
    //error case of Get  Supplier
    if (this.props.supplier.getSupplierDetailsError) {
       this.handleApiRespErr(this.props.supplier.getSupplierDetailsError);
    }
    await this.props.clearSupplierStates();
  };
  //a function that checks api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
       this.props.clearStatesAfterLogout();
      let history = this.props.history || this.props.props.history;
      history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      let history = this.props.history || this.props.props.history;
      history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  render() {
    let _blockSupplier = localStorage.getItem("blockSupplier");
    let blockSupplier = false;
    if (_blockSupplier) {
      blockSupplier = _blockSupplier === "N" ? true : false;
    }
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openSupplierLookupModal}
          onHide={this.clearStates}
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
                                <i
                                  onClick={() =>
                                    this.props.closeModal(
                                      "openSupplierLookupModal"
                                    )
                                  }
                                  className="cursorPointer fa fa-angle-left"
                                ></i>{" "}
                                Supplier Lookup
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() =>
                                  this.props.closeModal(
                                    "openSupplierLookupModal"
                                  )
                                }
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
                                <div className="col-md-5 input-group">
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
                                    name="supplierSearch"
                                    id="supplierLookupSearch"
                                    value={this.state.supplierSearch}
                                    onChange={this.supplierSearchHandler}
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
                                    <div className="form-group remember_check">
                                      <input
                                        type="checkbox"
                                        id="remember-sup-selec"
                                        checked={this.state.showSelected}
                                        name="checkbox"
                                        onChange={this.handleShowSelected}
                                      />
                                      <label htmlFor="remember-sup-selec"></label>
                                      <p className="pt-1 mm_font">Show Selected:</p>

                                      </div>
                                      </div>
                                  <div className="col d-flex justify-content-end s-c-main">
                                    {blockSupplier && (
                                      <button
                                        type="button"
                                        className="btn-save ml-2"
                                      >
                                        <img
                                          onClick={this.addSupplier}
                                          src="images/plus.png"
                                          className="mx-auto"
                                          alt="search-icon"
                                        />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="btn-save ml-2"
                                      onClick={this.getSuppliersList}
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
                                            onClick={this.sortSupplierName}
                                            className="cursorPointer form-group remember_check team_groups suppplier_look"
                                          >
                                            {/* <input type="checkbox" id="remember" /> */}
                                            {/* <label htmlFor="remember"> */}
                                            Supplier Name{" "}
                                            {this.state.sortColName ===
                                            "supName" ? (
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
                                            {/* </label> */}
                                          </div>
                                        </div>
                                      </th>
                                      <th
                                        className="text-center cursorPointer"
                                        onClick={this.sortCurrency}
                                      >
                                        Currency{" "}
                                        {this.state.sortColName ===
                                        "currency" ? (
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
                                      <th
                                        className="text-center cursorPointer"
                                        onClick={this.sortTaxID}
                                      >
                                        Tax ID{" "}
                                        {this.state.sortColName === "taxId" ? (
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
                                      <th>Edit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.clonedSuppliersList.map(
                                      (s, i) => {
                                        return (
                                          <tr key={i}>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check mm_check2">
                                                  <input
                                                    type="checkbox"
                                                    id={"supplier" + i}
                                                    checked={
                                                      s.checked ? true : false
                                                    }
                                                    name="checkbox"
                                                    onChange={(e) =>
                                                      this.handleCheckbox(e, s)
                                                    }
                                                  />

                                                  <label
                                                    htmlFor={"supplier" + i}
                                                  >
                                                    {s.name}
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td>{s.currency}</td>
                                            <td>{s.taxID}</td>
                                            <td
                                              onClick={() =>
                                                this.editSupplier(s)
                                              }
                                              className="text-left cursorPointer"
                                            >
                                              <img
                                                src="images/pencill.png"
                                                className="import_icon supplier_edit_icon"
                                                alt="pencill"
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
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

        <SupplierForm
          openSupplierForm={this.state.openSupplierForm}
          closeModal={this.closeModal}
          props={this.props.props}
          getSuppliersList={this.props.getSuppliersList}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  poData: state.poData,
  supplier: state.supplier,
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getSupplierDetails,
  getCurrencies,
  getTaxCodes,
  clearChartStates,
  clearSupplierStates,
  clearStatesAfterLogout,
})(SupplierLookup);
