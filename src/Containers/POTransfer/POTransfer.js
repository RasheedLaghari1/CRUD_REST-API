// This is is not in use and it is converted into Modal.

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  getTransferList,
  clearPOStates,
} from "../../Actions/POActions/POActions";
import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";

class POTransfer extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      POsToTransfer: [], //po to transfer to invoice
      transferList: [],
      clonedTransferList: [],
      poTransferSearch: "",
      supplierCode: "",
      includeZeroLinesCheck: false,
      includeAllSuppliersCheck: false,
      action: [
        { label: "Clear", value: "Clear" },
        { label: "Subtract", value: "Subtract" },
        { label: "Ignore", value: "Ignore" },
      ],
    };
  }

  async componentDidMount() {
    let state =
      this.props.history.location && this.props.history.location.state;
    if (state && state.transferList) {
      let transferList = state.transferList || [];

      transferList.map((l, i) => {
        l.id = i;
        l.action = "Clear";
        l.checked = false;
        return l;
      });
      let supplierCode =
        (state.stateData && state.stateData.supplierCode) || "";
      this.setState({
        transferList,
        clonedTransferList: transferList,
        supplierCode,
      });
    } else if (state && state.createInvoice) {
      this.props.history.push("/add-new-invoice", {
        stateData: state.stateData,
        POsToTransfer: [],
      });
    } else if (state && state.editInvoice) {
      this.props.history.push("/invoice-edit", {
        stateData: state.stateData,
        POsToTransfer: [],
      });
    } else {
      this.props.history.push("/invoice");
    }
  }

  //get filtered getPOTransfer list Include Zero Lines/Include All Suppliers
  getPOTransferList = async () => {
    let { supplierCode, includeZeroLinesCheck, includeAllSuppliersCheck } =
      this.state;
    if (supplierCode) {
      this.setState({ isLoading: true });
      await this.props.getTransferList(
        supplierCode,
        includeZeroLinesCheck,
        includeAllSuppliersCheck
      );
      //success case of Get Transfer List
      if (this.props.poData.getTransferListSuccess) {
        toast.success(this.props.poData.getTransferListSuccess);
        let transferList = this.props.poData.getTransferList || [];

        transferList.map((l, i) => {
          l.id = i;
          l.action = "Clear";
          l.checked = false;
          return l;
        });
        this.setState({ transferList, clonedTransferList: transferList });
      }
      //error case of Get Transfer List
      if (this.props.poData.getTransferListError) {
        this.handleApiRespErr(this.props.poData.getTransferListError);
      }
      this.props.clearPOStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Supplier First!");
    }
  };

  handleFilterCheckBoxes = async (name) => {
    await this.setState((state) => ({ [name]: !state[name] }));
    await this.getPOTransferList();
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

  handleCheckbox = async (e, data) => {
    let { POsToTransfer, transferList } = this.state;

    if (e.target.checked) {
      transferList.map(async (c, i) => {
        if (data.id === i) {
          c.checked = true;
        }
        return c;
      });
      this.state.POsToTransfer.push(data);
      this.setState({ POsToTransfer });
    } else {
      transferList.map(async (c, i) => {
        if (data.id === i) {
          c.checked = false;
        }
        return c;
      });
      let filteredPOs = POsToTransfer.filter((f) => f.id != data.id);
      this.setState({ POsToTransfer: filteredPOs });
    }

    this.setState({
      transferList,
    });
  };

  handleChangeAction = async (data, index, line) => {
    let { POsToTransfer, transferList } = this.state;
    // update in transfer list
    let foundIndex = transferList.findIndex((l) => l.id == index);
    if (foundIndex != -1) {
      line.action = data.value;
      transferList[foundIndex] = line;
    }
    //end

    //update in POsToTransfer
    let fndIndex = POsToTransfer.findIndex((l) => l.id == index);
    if (fndIndex != -1) {
      line.action = data.value;
      POsToTransfer[fndIndex] = line;
    }
    //end

    this.setState({ POsToTransfer, transferList });
  };

  //when type in search box
  poTransferSearchHandler = async (e) => {
    let text = e.target.value;
    if (!text) {
      this.setState({
        poTransferSearch: text,
        clonedTransferList: this.state.transferList || [],
      });
    } else {
      this.setState({
        poTransferSearch: text,
      });
    }
  };

  //when clicks on search button
  onSearch = () => {
    let text = this.state.poTransferSearch.trim();
    if (text) {
      let poTransferSearchData = [];

      poTransferSearchData = this.state.transferList.filter((t) => {
        return (
          t.poNumber.toString().toUpperCase().includes(text.toUpperCase()) ||
          t.description.toUpperCase().includes(text.toUpperCase()) ||
          t.amount.toString().toUpperCase().includes(text.toUpperCase()) ||
          t.supplier.toString().toUpperCase().includes(text.toUpperCase())
        );
      });

      this.setState({ clonedTransferList: poTransferSearchData });
    }
  };

  onTransfer = async () => {
    let POsToTransfer = JSON.parse(JSON.stringify(this.state.POsToTransfer));

    if (POsToTransfer.length > 0) {
      POsToTransfer.map((po, i) => {
        po.poTran = po.tran;
        po.poLine = po.lineNumber;
        delete po["tran"];
        delete po["lineNumber"];
        return po;
      });
      let state =
        this.props.history.location && this.props.history.location.state;
      if (state && state.createInvoice) {
        this.props.history.push("/add-new-invoice", {
          stateData: state.stateData,
          POsToTransfer,
        });
      } else {
        this.props.history.push("/invoice-edit", {
          stateData: state.stateData,
          POsToTransfer,
        });
      }
    } else {
      toast.error("Please Select PO Line First to Transfer!");
    }
  };

  onClose = async () => {
    let state =
      this.props.history.location && this.props.history.location.state;
    if (state && state.createInvoice) {
      this.props.history.push("/add-new-invoice", {
        stateData: state.stateData,
        POsToTransfer: [],
      });
    } else {
      this.props.history.push("/invoice-edit", {
        stateData: state.stateData,
        POsToTransfer: [],
      });
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} poTransfer={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section id="" className="supplier">
              <div className="body_content ordermain-padi">
                <div className="container-fluid ">
                  <div className="main_wrapper ">
                    <div className="img-section-t col-12 pl-0 pr-0">
                      {/* <img src="images/image6.png" className=" img-fluid" alt="user" />  */}

                      <div className="container-fluid pl-md-5 pr-md-5">
                        <div className="row">
                          <div className=" col-12 col-sm-12 col-md-12">
                            <div className="">
                              <div className="row">
                                <div className="col-12">
                                  <div className="mt-4">
                                    <div className="col-12 mt-md-3 mb-1">
                                      <div className="forgot_header">
                                        <div className="modal-top-header">
                                          <div className="row">
                                            <div className=" p-md-0 col-md-8 col-lg-4 col-sm-12">
                                              <div className="table_search">
                                                <div className="row">
                                                  <div className="col p-0 input-group">
                                                    <div className="input-group-prepend">
                                                      <span
                                                        className="input-group-text"
                                                        id="basic-addon1"
                                                      >
                                                        <img
                                                          src="images/search-icon.png"
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
                                                      name="poTransferSearch"
                                                      value={
                                                        this.state
                                                          .poTransferSearch
                                                      }
                                                      onChange={
                                                        this
                                                          .poTransferSearchHandler
                                                      }
                                                    />
                                                  </div>
                                                  <div className="col-auto pr-0 align-self-center">
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
                                            <div className="col-md-4 col-lg-8 col-sm-12 s-c-main">
                                              <Dropdown
                                                alignRight="false"
                                                drop="down"
                                                className="analysis-card-dropdwn float-right"
                                              >
                                                <Dropdown.Toggle
                                                  variant="sucess"
                                                  id="dropdown-basic"
                                                >
                                                  <img
                                                    src="images/more.png"
                                                    className=" img-fluid"
                                                    alt="user"
                                                  />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                  <Dropdown.Item
                                                    to="#/action-12"
                                                    className=""
                                                  >
                                                    <div
                                                      className="pr-0"
                                                      onClick={() =>
                                                        this.handleFilterCheckBoxes(
                                                          "includeZeroLinesCheck"
                                                        )
                                                      }
                                                    >
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id="includeZeroLinesCheck"
                                                          name="includeZeroLinesCheck"
                                                          checked={
                                                            this.state
                                                              .includeZeroLinesCheck
                                                          }
                                                          onChange={() => {}}
                                                        />
                                                        <label
                                                          htmlFor="includeZeroLinesCheck"
                                                          className="mr-0"
                                                        >
                                                          Include Zero Lines
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </Dropdown.Item>
                                                  <Dropdown.Item
                                                    to="#/action-1"
                                                    className=""
                                                  >
                                                    <div
                                                      className="pr-0"
                                                      onClick={() =>
                                                        this.handleFilterCheckBoxes(
                                                          "includeAllSuppliersCheck"
                                                        )
                                                      }
                                                    >
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id="includeAllSuppliersCheck"
                                                          name="includeAllSuppliersCheck"
                                                          checked={
                                                            this.state
                                                              .includeAllSuppliersCheck
                                                          }
                                                          onChange={() => {}}
                                                        />
                                                        <label
                                                          htmlFor="includeAllSuppliersCheck"
                                                          className="mr-0"
                                                        >
                                                          Include All Suppliers
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </Dropdown.Item>
                                                </Dropdown.Menu>
                                              </Dropdown>

                                              <button
                                                type="button"
                                                className="btn-save float-right mt-1 mr-4"
                                                onClick={this.onClose}
                                              >
                                                <span className="fa fa-ban"></span>
                                                Close
                                              </button>
                                              <button
                                                onClick={this.onTransfer}
                                                type="button"
                                                className="btn-save float-right mt-1"
                                              >
                                                <span className="fa fa-ban"></span>
                                                Transfer
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="login_table_list table-responsive">
                                      <table className="table busines_unit_table order-table shadow-remove add-new-t tab-1-line">
                                        <thead>
                                          <tr className="busines_unit_tbl-head">
                                            <th scope="col"></th>
                                            <th scope="col">PO</th>
                                            <th scope="col">Action</th>
                                            <th scope="col">Supplier</th>
                                            <th scope="col">Product Code</th>
                                            <th scope="col">Received</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col" width="7%">
                                              {" "}
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.state.clonedTransferList.map(
                                            (l, i) => {
                                              return (
                                                <tr key={i}>
                                                  <th scope="row">
                                                    <div className="col align-self-center text-center pr-0">
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id={"list" + i}
                                                          checked={l.checked}
                                                          name="checkbox"
                                                          onChange={(e) =>
                                                            this.handleCheckbox(
                                                              e,
                                                              l
                                                            )
                                                          }
                                                        />
                                                        <label
                                                          htmlFor={"list" + i}
                                                          className="mr-0"
                                                        ></label>
                                                      </div>
                                                    </div>
                                                  </th>
                                                  <td>{l.poNumber || "N/A"}</td>
                                                  <td width="10%">
                                                    <Select
                                                      className="width-selector"
                                                      defaultValue={
                                                        this.state.action[0]
                                                      }
                                                      onChange={(d) =>
                                                        this.handleChangeAction(
                                                          d,
                                                          i,
                                                          l
                                                        )
                                                      }
                                                      classNamePrefix="custon_select-selector-inner"
                                                      options={
                                                        this.state.action
                                                      }
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
                                                  </td>
                                                  <td>{l.supplier || "N/A"}</td>
                                                  <td>
                                                    {l.productCode || "N/A"}
                                                  </td>
                                                  <td>{l.received || "N/A"}</td>
                                                  {/* <td className="text-left"> */}
                                                  <td className="">
                                                    {l.description || "N/A"}
                                                  </td>
                                                  <td>{l.amount || "N/A"}</td>
                                                  <td></td>
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
});

export default connect(mapStateToProps, {
  getTransferList,
  clearPOStates,
  clearStatesAfterLogout,
})(POTransfer);
