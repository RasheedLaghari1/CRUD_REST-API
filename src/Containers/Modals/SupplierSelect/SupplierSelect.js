import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";

class SupplierSelect extends Component {
  constructor() {
    super();
    this.state = {
      supplierSearch: "",
      isLoading: false,
      toggleSupplierName: false,
      showSelected: false,
      supplierCode: "", //supplier code
      supplierName: "", //supplier name
      currency: "",
      suppliersList: [],
      clonedSuppliersList: [],
    };
  }
  async componentWillReceiveProps(np) {
    if (np.openSupplierSelectModal) {
      //focus search input field by pressing Tab key
      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 9) {
          evt.preventDefault();
          let id = document.getElementById("supplierSelectId");
          if (id) {
            document.getElementById("supplierSelectId").focus();
          }
        }
      };
    }

    if (this.props.suppliersList) {
      let suppliersList =
        JSON.parse(JSON.stringify(this.props.suppliersList)) || [];
      suppliersList.map(async (s, i) => {
        if (s.code == this.props.supplierCode) {
          //to show selected default
          s.checked = true;
          s.id = i;
          await this.setState({ supplierCode: s.code, supplierName: s.name });

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
      });
    }
  }

  //when click on Supplier name to sort data accordingly
  sortSupplierName = async () => {
    if (this.state.toggleSupplierName) {
      await this.setState({
        toggleSupplierName: false,
      });
    } else {
      await this.setState({
        toggleSupplierName: true,
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
      });
    }
  };

  //when type in search box
  supplierSearchHandler =  (e) => {
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
  onSuppliersListSearch = async (searchedText) => {
    const clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.suppliersList)
    );

    if (!searchedText) {
      this.setState({ suppliersList: clonedSuppliersList });
    } else {
      let suppliersListFilterdData = clonedSuppliersList.filter((c) => {
        return c.name.toUpperCase().includes(searchedText.toUpperCase());
      });
       this.setState({ clonedSuppliersList: suppliersListFilterdData });
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
  clearStates =  () => {
     this.props.closeModal("openSupplierSelectModal");
     this.setState({
      supplierSearch: "",
      supplierCode: "", //supplier code
      supplierName: "", //supplier name
      currency: "",
      suppliersList: [],
      clonedSuppliersList: [],
    });
  };

  handleCheckbox = async (e, data) => {
    let clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.clonedSuppliersList)
    );
    if (e.target.checked) {
      clonedSuppliersList.map(async (c, i) => {
        if (data.code === c.code) {
          c.checked = true;
          await this.setState({
            supplierCode: data.code,
            supplierName: data.name,
            currency: data.currency,
          });
        } else {
          c.checked = false;
        }
        return c;
      });
    } else {
      clonedSuppliersList.map((c, i) => {
        c.checked = false;
        return c;
      });
      await this.setState({ supplierCode: "", supplierName: "", currency: "" });
    }
     this.setState({ clonedSuppliersList });

    let { supplierCode, supplierName, currency } = this.state;
    if (supplierCode && supplierName && currency) {
      let obj = {
        name: supplierName,
        code: supplierCode,
        currency,
      };
      await this.props.getSelectedSupplier(obj);
       this.props.closeModal("openSupplierSelectModal");
       this.clearStates();
    }
  };

  onSelect = async () => {
    let { supplierCode, supplierName, currency } = this.state;
    if (supplierCode && supplierName && currency) {
      let obj = {
        name: supplierName,
        code: supplierCode,
        currency,
      };
      await this.props.getSelectedSupplier(obj);
      await this.props.closeModal("openSupplierSelectModal");
      await this.clearStates();
    }
  };

  addSupplier = () => {
    this.props.props.history.push("/new-supplier2", {
      stateData: this.props.stateData,
      page: this.props.page,
    });
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
          show={this.props.openSupplierSelectModal}
          onHide={() => this.props.closeModal("openSupplierSelectModal")}
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
                                Supplier Select
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() =>
                                  this.props.closeModal(
                                    "openSupplierSelectModal"
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
                                    name="supplierSearch"
                                    id="supplierSelectId"
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
                                  <div className="col-auto d-flex justify-content-end s-c-main">
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
                                      onClick={this.props.getSuppliersList}
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
                                            className="cursorPointer form-group remember_check"
                                          >
                                            {/* <input
                                              type="checkbox"
                                              id="remember"
                                            /> */}
                                            <label>
                                              Suppliers{" "}
                                              <i
                                                className={
                                                  !this.state.toggleSupplierName
                                                    ? "fa fa-angle-down sideBarAccord rorate_0"
                                                    : "fa fa-angle-down sideBarAccord"
                                                }
                                              ></i>
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                      {/* <th scope="col">
                                      Description
                                      </th> */}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {this.state.clonedSuppliersList.map(
                                      (s, i) => {
                                        return (
                                          <tr key={i}>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
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
                      {/* <div className="forgot_header mb-md-3">
                        <div className="modal-top-header">
                          <div className="row">
                            <div className="col d-flex justify-content-start s-c-main">
                              <button
                                onClick={this.onSelect   }
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

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(SupplierSelect);
