import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import store from "../../../Store/index";
import Dropdown from "react-bootstrap/Dropdown";
import LineItem from "../../Modals/LineItem/LineItem";
import DeleteOrderDetails from "../../Modals/DeleteOrderDetail/DeleteOrderDetail";
import MultipleChanges from "../../Modals/MultipleChanges/MultipleChanges";
import ImportModal from "../../Modals/ImportLines/ImportLines";
import ExportSuccessModal from "../../Modals/ExportSuccess/ExportSuccess";
import { toast } from "react-toastify";
import $ from "jquery";

class InvoiceDetail extends Component {
  constructor() {
    super();
    this.state = {
      openLineItemModal: false,
      openDeleteOrderDetailModal: false,
      openMultipleChangesModal: false,
      openExportSuccessModal: false,
      openImportLinesModal: false,

      invoiceLineEditData: "", //contains invoice Line data for editing
      deleteInvoiceLineId: "", //contains invoice Line id for deleting
      sugg_left: "",
    };
  }

  componentWillReceiveProps(np) {
    if (
      np.openInvoiceDetailModal &&
      $("#par").offset() &&
      $("#par").offset().left &&
      $("#cd_id") &&
      $("#cd_id").offset()
    ) {
      var dist_ho = Math.abs(
        $("#par").offset().left - $("#cd_id").offset().left
      ); // horizontal distance
      if (!this.state.sugg_left) {
        this.setState({ sugg_left: dist_ho });
      }
    }
  }

  openModal = (name) => {
    if (name == "openDeleteOrderDetailModal") {
      this.setState({ [name]: true });
    } else {
      this.setState({ [name]: true });
      // this.props.closeModal("openInvoiceDetailModal");
    }
  };
  closeModal = (name) => {
    this.setState({
      [name]: false,
      invoiceLineEditData: "",
      deleteInvoiceLineId: "",
    });
  };
  clearStates = () => {
    this.setState({
      invoiceLineEditData: "", //contains invoice Line data for editing
      deleteInvoiceLineId: "",
      sugg_left: "",
    });
    this.props.closeModal("openInvoiceDetailModal");
  };
  getNewORUpdatedInvoiceLine = async (data) => {
    await this.props.getNewORUpdatedInvoiceLine(data);
  };

  //edit invoice lines
  editInvoiceLine = (data) => {
    if (data.type && data.type.trim()) {
      this.setState({ invoiceLineEditData: data }, () =>
        this.openModal("openLineItemModal")
      );
    }
  };
  //delete invoice line
  deleteInvoiceLine = (line) => {
    this.setState({ deleteInvoiceLineId: line.id }, () =>
      this.openModal("openDeleteOrderDetailModal")
    );
  };
  //update invoice
  updateInvoiceLines = async () => {
    await this.props.updateInvoiceLines();

    let invoice = store.getState().invoice; //redux state of invoice

    if (invoice.updateInvoiceLinesSuccess || invoice.updateInvoiceLinesError) {
      this.clearStates();
      store.dispatch({
        type: "CLEAR_INVOICE_STATES",
      });
    }
  };
  handleMultipleChangesModal = () => {
    let lines = this.props.invoiceLines || [];
    let check = lines.find((l) => l.checked);
    if (check) {
      this.openModal("openMultipleChangesModal");
    } else {
      toast.error("Please tick lines for Multiple changes!");
    }
  };

  render() {
    let userType = localStorage.getItem("userType");
    let tab = this.props.tab || "";
    let checkOne = false;

    if (userType && tab) {
      if (userType.toLowerCase() === "approver") {
        /* An Approver can only edit the chart code, tracking codes and item description.
         Everything else in the PO is read-only and cannot be altered.*/
        if (tab != "draft") {
          checkOne = true;
        }
      } else if (userType.toLowerCase() === "op/approver") {
        if (tab != "draft") {
          checkOne = true;
        }
      }
    }

    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openInvoiceDetailModal}
          onHide={this.clearStates}
          // className="forgot_email_modal modal_90_per mx-auto"
          className="forgot_email_modal mx-auto order-detail-popup"
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
                                Invoice Detail
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.updateInvoiceLines}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                              <button
                                onClick={this.clearStates}
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
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12">
                            <div className="model-p move-modal-t">
                              <div className="row">
                                <div className="col-12" id="par">
                                  <Dropdown
                                    alignRight="false"
                                    drop="down"
                                    className="analysis-card-dropdwn float-right bg-tp"
                                  >
                                    <Dropdown.Toggle
                                      variant="sucess"
                                      id="dropdown-basic"
                                    >
                                      <img
                                        src="images/order-option.png"
                                        className=" img-fluid"
                                        alt="user"
                                      />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={
                                          this.handleMultipleChangesModal
                                        }
                                      >
                                        Multiple Changes
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          this.openModal("openImportLinesModal")
                                        }
                                      >
                                        Import
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() =>
                                          this.openModal(
                                            "openExportSuccessModal"
                                          )
                                        }
                                      >
                                        Export
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>

                                  {checkOne ? (
                                    <img
                                      src="images/plus-round.png"
                                      className="btn img-fluid float-right pr-0"
                                      alt="user"
                                    />
                                  ) : (
                                    <img
                                      onClick={() =>
                                        this.openModal("openLineItemModal")
                                      }
                                      src="images/plus-round.png"
                                      className="btn img-fluid float-right pr-0"
                                      alt="user"
                                    />
                                  )}

                                  <div className="login_form">
                                    <div className="login_table_list table-responsive order-detail-tabl-main">
                                      <table className="table shadow-none order-table tab-1-line inv--edit od_popup_new order-detail-popup-table invic-detail">
                                        <thead>
                                          <tr>
                                            <th width="10" scope="col"></th>
                                            <th
                                              scope="col"
                                              className="pl-0"
                                              width="3%"
                                            >
                                              <div className="col align-self-center text-center pr-0 pl-0">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="invoiceDetail1"
                                                    onChange={(e) =>
                                                      this.props.handleCheckboxesInInvoiceDetails(
                                                        e,
                                                        "all"
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="invoiceDetail1"
                                                    className="mr-0"
                                                  ></label>
                                                </div>
                                              </div>
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left invoice-detail-desth"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left pl-3"
                                            >
                                              Chart Sort
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left pl-1"
                                            >
                                              Chart Code
                                            </th>
                                            {this.props.flagsPrompts &&
                                            this.props.flagsPrompts.length >
                                              0 ? (
                                              this.props.flagsPrompts.map(
                                                (p, i) => {
                                                  return (
                                                    <th
                                                      key={i}
                                                      scope="col"
                                                      className={
                                                        "text-left pad-left"
                                                      }
                                                    >
                                                      {p.prompt}
                                                    </th>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                              </>
                                            )}
                                            <th
                                              className="text-left invoice-detail-th9-td9"
                                              scope="col"
                                            >
                                              Amount
                                            </th>{" "}
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.props.invoiceLines.map(
                                            (d, i) => {
                                              return (
                                                <tr key={i}>
                                                  <th scope="row">
                                                    <Dropdown
                                                      alignRight="false"
                                                      drop="right"
                                                      className="bg-trans"
                                                    >
                                                      <Dropdown.Toggle
                                                        variant="sucess"
                                                        id="dropdown-basic"
                                                      >
                                                        <span className="clr-drop yellow-c"></span>
                                                      </Dropdown.Toggle>
                                                      <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                          These markers indicate{" "}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                          budget status.
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                          {" "}
                                                          <span className="clr-drop green-c mt-2 mr-2"></span>{" "}
                                                          In budget
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                          {" "}
                                                          <span className="clr-drop yellow-c mt-2 mr-2"></span>{" "}
                                                          Approaching budget
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                          {" "}
                                                          <span className="clr-drop red-c mt-2 mr-2"></span>{" "}
                                                          Over budget
                                                        </Dropdown.Item>
                                                      </Dropdown.Menu>
                                                    </Dropdown>
                                                  </th>
                                                  <td className="pl-0">
                                                    <div className="col align-self-center text-center pr-0 pl-0">
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id={
                                                            "invoiceDetails12" +
                                                            i
                                                          }
                                                          onChange={(e) =>
                                                            this.props.handleCheckboxesInInvoiceDetails(
                                                              e,
                                                              d
                                                            )
                                                          }
                                                          checked={d.checked}
                                                        />
                                                        <label
                                                          htmlFor={
                                                            "invoiceDetails12" +
                                                            i
                                                          }
                                                          className="mr-0"
                                                        ></label>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="text-left pl-0 uppercaseText od-desc-input">
                                                    {d.type === "Service" ||
                                                    d.type ===
                                                      "Distribution" ? (
                                                      <div className="modal_input">
                                                        <input
                                                          type="text"
                                                          className="form-control uppercaseText pl-0"
                                                          id="description"
                                                          autoComplete="off"
                                                          name={"description"}
                                                          defaultValue={
                                                            d.description
                                                          }
                                                          onBlur={(e) =>
                                                            this.props.handleChangeField(
                                                              e,
                                                              d,
                                                              i
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    ) : (
                                                      <>
                                                        {d.type === "Car" ||
                                                        d.type ===
                                                          "Inventory" ||
                                                        d.type ===
                                                          "Rental/Hire" ||
                                                        d.type === "Hire/Rental"
                                                          ? d.typeDescription ||
                                                            ""
                                                          : d.description ||
                                                            ""}{" "}
                                                      </>
                                                    )}
                                                  </td>
                                                  <td
                                                    className={
                                                      checkOne
                                                        ? "text-left pl-3"
                                                        : "text-left"
                                                    }
                                                  >
                                                    {checkOne ? (
                                                      d.chartSort
                                                    ) : (
                                                      <div className="modal_input  invo-chart-sort width-56">
                                                        <input
                                                          type="text"
                                                          className={
                                                            d.chartSort
                                                              .length <= 5
                                                              ? " form-control wd-50 uppercaseText"
                                                              : "form-control wd-75 uppercaseText"
                                                          }
                                                          id="chartSort"
                                                          autoComplete="off"
                                                          name={"chartSort"}
                                                          defaultValue={
                                                            d.chartSort
                                                          }
                                                          onBlur={(e) =>
                                                            this.props.handleChangeField(
                                                              e,
                                                              d,
                                                              i
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    )}
                                                  </td>
                                                  <td
                                                    className="text-left inov-dropdown-position"
                                                    id="cd_id"
                                                  >
                                                    <div className="modal_input width-90">
                                                      <input
                                                        type="text"
                                                        className={
                                                          d.chartCode.length <=
                                                          4
                                                            ? "form-control focus_chartCode wd-45 uppercaseText"
                                                            : d.chartCode
                                                                .length <= 8
                                                            ? "form-control focus_chartCode wd-72 uppercaseText"
                                                            : "form-control focus_chartCode wd-101 uppercaseText"
                                                        }
                                                        id={`chrtCode${i}`}
                                                        autoComplete="off"
                                                        name={"chartCode"}
                                                        value={d.chartCode}
                                                        onChange={(e) =>
                                                          this.props.handleChangeChartCode(
                                                            e,
                                                            d,
                                                            i
                                                          )
                                                        }
                                                        onBlur={() =>
                                                          this.props.onblurCode(
                                                            i
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                    <div
                                                      className={`chart_menue chart${i}`}
                                                      style={{
                                                        marginLeft:
                                                          this.state.sugg_left,
                                                      }}
                                                    >
                                                      {" "}
                                                      {this.props
                                                        .clonedChartCodesList
                                                        .length > 0 ? (
                                                        <ul className="invoice_vender_menu">
                                                          {this.props.clonedChartCodesList.map(
                                                            (c, ind) => {
                                                              return (
                                                                <li
                                                                  className="cursorPointer"
                                                                  key={ind}
                                                                  onClick={() =>
                                                                    this.props.changeChartCode(
                                                                      c,
                                                                      d,
                                                                      i
                                                                    )
                                                                  }
                                                                >
                                                                  <div className="vender_menu_right chart_new">
                                                                    <h3 className="chart_vender_text">
                                                                      <span>
                                                                        {" "}
                                                                        {
                                                                          c.code
                                                                        }{" "}
                                                                      </span>{" "}
                                                                      <span className="right_desc">
                                                                        {" "}
                                                                        {
                                                                          c.description
                                                                        }
                                                                      </span>
                                                                    </h3>
                                                                  </div>
                                                                </li>
                                                              );
                                                            }
                                                          )}
                                                        </ul>
                                                      ) : (
                                                        <div className="sup_nt_fnd text-center">
                                                          <h6>
                                                            No Chart Code Found
                                                          </h6>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </td>
                                                  {this.props.flagsPrompts &&
                                                  this.props.flagsPrompts
                                                    .length > 0 ? (
                                                    this.props.flagsPrompts.map(
                                                      (p, i) => {
                                                        return (
                                                          <td
                                                            className={
                                                              "text-left pad-left"
                                                            }
                                                            key={i}
                                                          >
                                                            {/* {" "}
                                                            {d.flags.find(
                                                              (f) =>
                                                                f.type.toLowerCase() ===
                                                                p.type.toLowerCase()
                                                            ).value || ""}{" "} */}

                                                            <div className="modal_input">
                                                              <input
                                                                type="text"
                                                                className={`form-control uppercaseText flags-w${p.length}`}
                                                                id="usr"
                                                                autoComplete="off"
                                                                name={p.type}
                                                                maxLength={
                                                                  p.length
                                                                }
                                                                value={
                                                                  (d.flags.find(
                                                                    (f) =>
                                                                      f.type.toLowerCase() ===
                                                                      p.type.toLowerCase()
                                                                  ) &&
                                                                    d.flags.find(
                                                                      (f) =>
                                                                        f.type.toLowerCase() ===
                                                                        p.type.toLowerCase()
                                                                    ).value) ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
                                                                  this.props.handleChangeFlags(
                                                                    e,
                                                                    d
                                                                  )
                                                                }
                                                              />
                                                            </div>
                                                          </td>
                                                        );
                                                      }
                                                    )
                                                  ) : (
                                                    <>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                    </>
                                                  )}
                                                  <td className="text-left invoice-detail-th9-td9 uppercaseText">
                                                    {(d.type === "Service" ||
                                                      d.type ===
                                                        "Distribution") &&
                                                    !checkOne ? (
                                                      <div className="modal_input">
                                                        <input
                                                          type="number"
                                                          className="form-control uppercaseText"
                                                          id="amount"
                                                          autoComplete="off"
                                                          name={"amount"}
                                                          value={d.amount}
                                                          onChange={(e) =>
                                                            this.props.handleChangeField(
                                                              e,
                                                              d,
                                                              i
                                                            )
                                                          }
                                                          onBlur={(e) =>
                                                            this.props.convertTwoDecimal(
                                                              e,
                                                              d
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    ) : (
                                                      Number(d.amount).toFixed(
                                                        2
                                                      ) || 0.0
                                                    )}
                                                  </td>{" "}
                                                  <td className="eidt-del-icons">
                                                    <img
                                                      onClick={() =>
                                                        this.editInvoiceLine(d)
                                                      }
                                                      src="images/pencill.png"
                                                      className="import_icon cursorPointer"
                                                      alt="pencill"
                                                    />
                                                  </td>
                                                  <td className="eidt-del-icons">
                                                    {checkOne ? (
                                                      <img
                                                        src="images/delete.svg"
                                                        className="invoice-delete-icon cursorPointer"
                                                        alt="delete"
                                                      />
                                                    ) : (
                                                      <img
                                                        onClick={() =>
                                                          this.deleteInvoiceLine(
                                                            d
                                                          )
                                                        }
                                                        src="images/delete.svg"
                                                        className="invoice-delete-icon cursorPointer"
                                                        alt="delete"
                                                      />
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                          <tr>
                                            <th scope="row"></th>
                                            <th className="text-left"></th>
                                            <td></td>
                                            <td></td>

                                            {this.props.flagsPrompts &&
                                            this.props.flagsPrompts.length >
                                              0 ? (
                                              this.props.flagsPrompts.map(
                                                (p, i) => {
                                                  return <td key={i}></td>;
                                                }
                                              )
                                            ) : (
                                              <>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                              </>
                                            )}
                                            <td className="tbl_total_amount">
                                              Subtotal:&nbsp;&nbsp;
                                            </td>
                                            <td className="tbl_total_amount text-left">
                                              {Number(
                                                this.props.subTotal
                                              ).toFixed(2)}
                                            </td>
                                            <td></td>
                                            <td></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <LineItem
          openLineItemModal={this.state.openLineItemModal}
          closeModal={this.closeModal}
          // taxCodes={this.props.taxCodes || ""} //api response (get tax codes)
          chartSorts={this.props.chartSorts || ""} //api response (get chart sort)
          chartCodes={this.props.chartCodesList || []} //all chart codes
          flags_api={this.props.flags_api} //flags comming from get flags api
          flags={this.props.flags} //restructured flags accordings to requirements
          clonedFlags={this.props.clonedFlags} //a copy of flags
          // updateFlags={this.updateFlags} //get updated flags from liine item modal
          getNewORUpdatedPOLine={this.getNewORUpdatedInvoiceLine} //add/edit invoice line
          poLineEditData={this.state.invoiceLineEditData} //invoice Lines for Editing
          props={this.props.props}
          page="invoicePage"
          tab={this.props.tab}
          basisOptions={this.props.basisOptions || []}
          props={this.props.props || ""}
          modal="invoice-edit"
          getChartCodes={this.props.getChartCodes}
          getChartSorts={this.props.getChartSorts}
          chartCodesList={this.props.chartCodesList || []}
        />

        <DeleteOrderDetails
          openDeleteOrderDetailModal={this.state.openDeleteOrderDetailModal}
          closeModal={this.closeModal}
          invoice={true}
          deletePOLineId={this.state.deleteInvoiceLineId} //delete invoice line id
          deletePOLine={this.props.deleteInvoiceLine} //delete invoice line func
        />

        <ImportModal
          openImportLinesModal={this.state.openImportLinesModal}
          closeModal={this.closeModal}
        />
        <ExportSuccessModal
          openExportSuccessModal={this.state.openExportSuccessModal}
          closeModal={this.closeModal}
        />
        <MultipleChanges
          openMultipleChangesModal={this.state.openMultipleChangesModal}
          closeModal={this.closeModal}
          flags_api={this.props.flags_api} //flags comming from get flags api
          flags={this.props.flags} //restructured flags accordings to requirements
          clonedFlags={this.props.clonedFlags} //a copy of flags
          // taxCodes={this.props.taxCodes || ""} //api response (get tax codes)
          chartSorts={this.props.chartSorts || ""} //api response (get chart sort)
          chartCodes={this.props.chartCodesList || []} //all chart codes
          handleMultipleChanges={this.props.handleMultipleChanges}
          lines={this.props.invoiceLines}
          props={this.props.props || ""}
          tab={this.props.tab}
          getChartCodes={this.props.getChartCodes}
          getChartSorts={this.props.getChartSorts}
        />
      </>
    );
  }
}
export default InvoiceDetail;
