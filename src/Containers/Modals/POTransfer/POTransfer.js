import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";

import Select from "react-select";

class POTransfer extends Component {
  constructor() {
    super();
    this.state = {};
  }
  async componentWillReceiveProps(np) {
    if (np.openPOTransferModal) {
      //focus search input field by pressing Tab key
      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 9) {
          evt.preventDefault();
          let id = document.getElementById("poTransferSearchId");
          if (id) {
            document.getElementById("poTransferSearchId").focus();
          }
        }
      };
    }
  }
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openPOTransferModal}
          onHide={() => this.props.closeModal("openPOTransferModal")}
          className="forgot_email_modal modal_90_per mx-auto"
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
                                PO Transfer
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
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
                                                  <div className="input-group-prepend mm_append">
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
                                                    id="poTransferSearchId"
                                                    value={
                                                      this.props
                                                        .poTransferSearch
                                                    }
                                                    onChange={
                                                      this.props
                                                        .poTransferSearchHandler
                                                    }
                                                    onKeyDown={
                                                      this.props.onEnter
                                                    }
                                                  />
                                                </div>
                                                <div className="col-auto pr-0 align-self-center">
                                                  <button
                                                    onClick={
                                                      this.props.onSearch
                                                    }
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
                                                      this.props.handleFilterCheckBoxes(
                                                        "includeZeroLinesCheck"
                                                      )
                                                    }
                                                  >
                                                    <div className="form-group remember_check mm_check mm_check5">
                                                      <input
                                                        type="checkbox"
                                                        id="includeZeroLinesCheck"
                                                        name="includeZeroLinesCheck"
                                                        checked={
                                                          this.props
                                                            .includeZeroLinesCheck
                                                        }
                                                        onChange={() => { }}
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
                                                      this.props.handleFilterCheckBoxes(
                                                        "includeAllSuppliersCheck"
                                                      )
                                                    }
                                                  >
                                                    <div className="form-group remember_check mm_check">
                                                      <input
                                                        type="checkbox"
                                                        id="includeAllSuppliersCheck"
                                                        name="includeAllSuppliersCheck"
                                                        checked={
                                                          this.props
                                                            .includeAllSuppliersCheck
                                                        }
                                                        onChange={() => { }}
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
                                              onClick={() =>
                                                this.props.closeModal(
                                                  "openPOTransferModal"
                                                )
                                              }
                                            >
                                              <span className="fa fa-ban"></span>
                                              Close
                                            </button>
                                            <button
                                              onClick={this.props.onTransfer}
                                              type="button"
                                              className="btn-save float-right mt-1"
                                            >
                                              <span className="fa fa-check"></span>
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
                                          <th scope="col">
                                            <div className="col align-self-center text-center pr-0">
                                              <div className="form-group remember_check mm_check7">
                                                <input
                                                  type="checkbox"
                                                  id="po-logs-11"
                                                  onChange={(e) =>
                                                    this.props.handlePOTransferCheckbox(
                                                      e,
                                                      "all"
                                                    )
                                                  }
                                                />
                                                <label
                                                  htmlFor="po-logs-11"
                                                  className="mr-0"
                                                ></label>
                                              </div>
                                            </div>
                                          </th>
                                          <th scope="col" className="text-left" >PO</th>
                                          <th scope="col" className="text-left">Action</th>
                                          <th scope="col" className="text-left">Supplier</th>
                                          <th scope="col" className="text-left">Description</th>
                                          <th scope="col" >Amount</th>
                                          <th scope="col" width="7%">
                                            {" "}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.props.clonedTransferList.map(
                                          (l, i) => {
                                            return (
                                              <tr key={i}>
                                                <th scope="row">
                                                  <div className="col align-self-center text-center pr-0">
                                                    <div className="form-group remember_check mm_check7">
                                                      <input
                                                        type="checkbox"
                                                        id={"list" + i}
                                                        checked={l.checked}
                                                        name="checkbox"
                                                        onChange={(e) =>
                                                          this.props.handlePOTransferCheckbox(
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
                                                <td className="text-left">{l.poNumber || "N/A"}</td>
                                                <td className="text-left" width="10%">
                                                  <Select
                                                    className="width-selector"
                                                    defaultValue={
                                                      this.props.action[0]
                                                    }
                                                    onChange={(d) =>
                                                      this.props.handleChangeAction(
                                                        d,
                                                        l,
                                                        "poTransferList"
                                                      )
                                                    }
                                                    classNamePrefix="custon_select-selector-inner"
                                                    options={this.props.action}
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
                                                <td className="text-left">{l.supplier || "N/A"}</td>
                                                <td className="text-left">
                                                  {l.description || "N/A"}
                                                </td>
                                                <td >{l.amount || "N/A"}</td>
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
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default POTransfer;
