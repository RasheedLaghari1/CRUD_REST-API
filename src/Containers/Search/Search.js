import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { searchPOs, clearPOStates } from "../../Actions/POActions/POActions";
import {
  getSuppliersList,
  clearSupplierStates,
} from "../../Actions/SupplierActtions/SupplierActions";

import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";

class Search extends Component {
  constructor() {
    super();
    this.state = {
      filter: "description",
      filterSelect: "Item Description",
      search: "",
      vendorCheck: false,
      poList: [],
      suppliersList: [],
    };
  }

  async componentDidMount() {
    await this.getSuppliersList();
    //focus search input field by pressing Tab key
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 9) {
        evt.preventDefault();
        let id = document.getElementById("searchId");
        if (id) {
          document.getElementById("searchId").focus();
        }
      }
    };
  }

  handleFilter = (filterSelect, filter) => {
    this.setState({ filterSelect, filter });
  };

  handleCheckBox = async (e) => {
    let name = e.target.name;
    if (name === "vendorCheck") {
      this.setState({ vendorCheck: e.target.checked });
      await this.getSuppliersList(e.target.checked ? "Y" : "N");
    }
  };

  getSuppliersList = async (previousSupplier) => {
    // this.setState({ isLoading: true });
    await this.props.getSuppliersList("", previousSupplier, ""); //first param is for currency and last for module

    //success case of Get Suppliers List
    if (this.props.supplier.getSuppliersListSuccess) {
      // toast.success(this.props.supplier.getSuppliersListSuccess);
      let suppliersList = this.props.supplier.getSuppliersList || [];

      this.setState({
        suppliersList: suppliersList || [],
      });
    }
    //error case of Get Suppliers List
    if (this.props.supplier.getSuppliersListError) {
      this.handleApiRespErr(this.props.supplier.getSuppliersListError);
    }
    // this.setState({ isLoading: false });
  };

  handleSupplier = async (supplier) => {
    if (supplier && supplier.code && supplier.currency) {
      this.props.history.push("/suppliers2", {
        currency: supplier.currency,
        supplierCode: supplier.code,
        searchSupplier: true,
      });
    } else {
      toast.error("The supplier does not have the currency and code!");
    }
  };

  handlePO = async (PO) => {
    if (PO && PO.trans && PO.type && PO.type.trim()) {
      this.props.history.push("/order", {
        po: PO,
        searchPO: true,
      });
    } else {
      toast.error("There is no trans or type in PO!");
    }
  };

  onChangeSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ search: searchedText });
  };

  //call search POs API when enter is pressed
  onEnter = async (e) => {
    let { search, filter } = this.state;
    if (e.key === "Enter" || e.key === "Tab") {
      let { search, filter } = this.state;
      if (search && search.toLowerCase() && search.toLowerCase().trim()) {
        let obj = {
          search,
          filter,
        };
        this.setState({ isLoading: true });
        await this.props.searchPOs(obj);
        //success case of SearchPOs
        if (this.props.poData.searchPOsSuccess) {
          // toast.success(this.props.poData.searchPOsSuccess);
          let poList =
            (this.props.poData.searchPOs &&
              this.props.poData.searchPOs.poList) ||
            [];
          this.setState({ poList });
        }
        //error case of SearchPOs
        if (this.props.poData.searchPOsError) {
          this.handleApiRespErr(this.props.poData.searchPOsError);
        }
        this.props.clearPOStates();
        this.setState({ isLoading: false });
      }
    }
  };

  //call search POs API when button is pressed
  onSearch = async () => {
    let { search, filter } = this.state;
    if (search && search.toLowerCase() && search.toLowerCase().trim()) {
      let obj = {
        search,
        filter,
      };
      this.setState({ isLoading: true });
      await this.props.searchPOs(obj);
      //success case of SearchPOs
      if (this.props.poData.searchPOsSuccess) {
        // toast.success(this.props.poData.searchPOsSuccess);
        let poList =
          (this.props.poData.searchPOs && this.props.poData.searchPOs.poList) ||
          [];
        this.setState({ poList });
      }
      //error case of SearchPOs
      if (this.props.poData.searchPOsError) {
        this.handleApiRespErr(this.props.poData.searchPOsError);
      }
      this.props.clearPOStates();
      this.setState({ isLoading: false });
    }
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

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} search={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <div className="container-fluid">
                <div className="main_wrapper p-10 mt-md-5 mt-2 sup-main-pad">
                  <div className="row d-flex mt-4">
                    {/* Search Bar Start */}
                    <div className="col-auto pr-2">
                      <Dropdown
                        drop="down"
                        className="analysis-card-dropdwn item_desc"
                      >
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {this.state.filterSelect}{" "}
                          <img src="images/angle-down.png" alt="arrow" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            to="#/action-1"
                            onClick={() =>
                              this.handleFilter(
                                "Item Description",
                                "description"
                              )
                            }
                          >
                            Item Description
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#/action-2"
                            onClick={() =>
                              this.handleFilter("Product Code", "productCode")
                            }
                          >
                            Product Code
                          </Dropdown.Item>
                          <Dropdown.Item
                            to="#/action-3"
                            onClick={() =>
                              this.handleFilter("Contact Name", "contactName")
                            }
                          >
                            Contact Name
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="col-12 col-lg-5 col-md-6 pl-md-0">
                      <div className="table_search">
                        <div className="row">
                          <div className="col input-group pl-0">
                            <div className="input-group-prepend">
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
                              name="search"
                              id="searchId"
                              value={this.state.search}
                              onChange={this.onChangeSearch}
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

                    {/* Search Bar End */}
                    <div className="col-12 col-lg-7 col-xl-8">
                      <div className="forgot_form_main report_main">
                        <div className="forgot_header">
                          <div className="modal-top-header bord-btm">
                            <div className="row">
                              <div className="col-auto">
                                <h6 className="text-left def-blue">
                                  Purchase Orders
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Supplier Details Code start */}

                        <div className="forgot_body px-4">
                          {/* Contact Portion Start */}

                          <div className="row mt-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input type="checkbox" id="remember" />
                                <label
                                  htmlFor="remember"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">
                                Only show items I have ordered before
                              </p>
                            </div>
                          </div>
                          {/* table start  */}

                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="login_form">
                                <div className="login_table_list table-responsive">
                                  <table className="table table-hover busines_unit_table shadow-remove project_table search_table tab-1-line">
                                    <thead>
                                      <tr className="busines_unit_tbl-head">
                                        <th scope="col">
                                          PO Number{" "}
                                          <i className="fa fa-angle-down ml-2"></i>
                                        </th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.poList.map((l, i) => {
                                        return (
                                          <tr key={i}>
                                            <th scope="row">
                                              <span
                                                onClick={() => this.handlePO(l)}
                                                className="text-primary cursorPointer"
                                              >
                                                <u>{l.poNumber || "N/A"}</u>
                                              </span>
                                            </th>
                                            <td>{l.description || "N/A"}</td>
                                            <td>{l.taxAmount || "N/A"}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* table end */}

                          {/* Contact Portion End */}
                        </div>
                      </div>
                    </div>
                    {/* Search Bar End */}
                    <div className="col-12 col-lg-5 col-xl-4">
                      <div className="forgot_form_main report_main">
                        <div className="forgot_header">
                          <div className="modal-top-header bord-btm">
                            <div className="row">
                              <div className="col-auto">
                                <h6 className="text-left def-blue">Vendors</h6>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Supplier Details Code start */}

                        <div className="forgot_body px-4">
                          {/* Contact Portion Start */}

                          <div className="row mt-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="vendor"
                                  name="vendorCheck"
                                  onChange={this.handleCheckBox}
                                  checked={this.state.vendorCheck}
                                />
                                <label
                                  htmlFor="vendor"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">
                                Only show vendors I have used before
                              </p>
                            </div>
                          </div>
                          {/* table start  */}

                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="login_form">
                                <div className="login_table_list table-responsive">
                                  <table className="table table-hover busines_unit_table shadow-remove project_table search_table tab-1-line">
                                    <thead>
                                      <tr className="busines_unit_tbl-head">
                                        <th scope="col">
                                          Vendor{" "}
                                          <i className="fa fa-angle-down ml-2"></i>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.suppliersList.map((s, i) => {
                                        return (
                                          <tr
                                            className="cursorPointer"
                                            key={i}
                                            onClick={() =>
                                              this.handleSupplier(s)
                                            }
                                          >
                                            <th scope="row">
                                              {s.name || "N/A"}
                                            </th>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* table end */}
                          {/* Contact Portion End */}
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
  poData: state.poData,
  supplier: state.supplier,
});

export default connect(mapStateToProps, {
  searchPOs,
  getSuppliersList,
  clearSupplierStates,
  clearPOStates,
  clearStatesAfterLogout,
})(Search);
