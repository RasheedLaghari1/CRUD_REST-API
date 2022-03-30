import React, { Component } from "react";
import store from "../../../Store/index";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import LineItem from "../../Modals/LineItem/LineItem";
import DeleteOrderDetails from "../../Modals/DeleteOrderDetail/DeleteOrderDetail";
import MultipleChanges from "../../Modals/MultipleChanges/MultipleChanges";
import ImportModal from "../../Modals/ImportLines/ImportLines";
import ExportSuccessModal from "../../Modals/ExportSuccess/ExportSuccess";
import { toast } from "react-toastify";
import $ from "jquery";
class OrderDetail extends Component {
  constructor() {
    super();
    this.state = {
      openLineItemModal: false,
      openDeleteOrderDetailModal: false,
      openMultipleChangesModal: false,
      openExportSuccessModal: false,
      openImportLinesModal: false,

      poLineEditData: "", //contains poLine data for editing
      deletePOLineId: "", //contains poLine id for deleting
      sugg_left: "",
    };
  }
  componentWillReceiveProps(np) {
    if (
      np.openOrderDetailModal &&
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
      // this.props.closeModal("openOrderDetailModal");
    }
  };
  closeModal = (name) => {
    this.setState({ [name]: false, poLineEditData: "", deletePOLineId: "" });
  };
  clearStates = () => {
    this.setState({
      poLineEditData: "", //contains poLine data for editing
      deletePOLineId: "",
      sugg_left: "",
    });
    this.props.closeModal("openOrderDetailModal");
  };
  getNewORUpdatedPOLine = async (data) => {
    await this.props.getNewORUpdatedPOLine(data);
  };
  //edit po lines
  editPOLine = async (data) => {
    if ((data.type && data.type.trim()) || true) {
      this.setState({ poLineEditData: data }, () =>
        this.openModal("openLineItemModal")
      );
    }
  };
  //delete po line
  deletePOLine = async (poLine) => {
    await this.setState({ deletePOLineId: poLine.id }, () =>
      this.openModal("openDeleteOrderDetailModal")
    );
  };
  //update PO
  updatePOLines = async () => {
    await this.props.updatePOLines();

    let poData = store.getState().poData; //redux state of PO

    if (poData.updatePOLinesSuccess || poData.updatePOLinesError) {
      this.clearStates();
      store.dispatch({
        type: "CLEAR_PO_STATES",
      });
    }
  };
  handleMultipleChangesModal = () => {
    let lines = this.props.poLines || [];
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
    let teamOrdersCheck = this.props.teamOrdersCheck || "N";
    let checkOne = false;
    let checkTwo = false;

    if (userType && tab) {
      if (userType.toLowerCase() === "approver") {
        /* An Approver can only edit the chart code, tracking codes and item description.
         Everything else in the PO is read-only and cannot be altered.*/

        if (tab === "approve" || tab === "hold" || tab === "approved") {
          checkOne = true;
        } else if (tab === "pending" || tab === "declined" || tab === "all") {
          //when tab is pending , declined or all then everything is read only for Approver
          checkOne = true;
          checkTwo = true;
        }
      } else if (userType.toLowerCase() === "operator") {
        /*The Operator account should only be able to edit the Preview PDF in the Draft section,
         in every other section the preview pdf must be read only for them.*/
        if (tab != "draft") {
          checkOne = true;
          checkTwo = true;
        }
      } else if (userType.toLowerCase() === "op/approver") {
        /*The Operator/Approver account can edit everything in the Draft section 
        AND they can also edit the Chart Code, Tracking Code and Description in the Approve
        and Hold Section */
        if (tab === "pending" || tab === "declined" || tab === "all") {
          //everything is read-only in these sections
          checkOne = true;
          checkTwo = true;
        } else if (tab != "draft") {
          checkOne = true;
        }
      }
    }

    if (
      teamOrdersCheck &&
      teamOrdersCheck.toLowerCase() === "Y" &&
      tab &&
      (tab === "approve" || tab === "hold")
    ) {
      //when PO is Team Order then disable po lines
      checkOne = true;
      checkTwo = true;
    }

    let flagsPrompts = this.props.flagsPrompts || [];
    let flgLength = flagsPrompts.length;
    let dynamicClass =
      "forgot_email_modal mx-auto order-detail-popup order-detail-popup";
    //increase the order detail popup width as flags increases
    dynamicClass =
      flgLength === 3
        ? `${dynamicClass}3`
        : flgLength === 4
        ? `${dynamicClass}4`
        : flgLength === 5
        ? `${dynamicClass}5`
        : flgLength === 6
        ? `${dynamicClass}6`
        : flgLength === 7
        ? `${dynamicClass}7`
        : flgLength === 8
        ? `${dynamicClass}8`
        : flgLength === 9
        ? `${dynamicClass}9`
        : flgLength === 10
        ? `${dynamicClass}10`
        : "forgot_email_modal mx-auto order-detail-popup";

    let disDisc = this.props.disDisc || false;
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openOrderDetailModal}
          onHide={this.clearStates}
          // className="forgot_email_modal modal_90_per mx-auto"
          // className="forgot_email_modal mx-auto order-detail-popup order-detail-popup3 "
          className={dynamicClass}
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
                                Order Detail
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              {checkTwo ? (
                                <></>
                              ) : (
                                <button
                                  onClick={this.updatePOLines}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                              )}
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
                            <div className="model-p move-modal-t pt-0">
                              <div className="row">
                                <div className="col-md-6">
                                  <p className="order-description_text m-0">
                                    <span>Order Description </span>
                                  </p>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        disDisc
                                          ? "border-0 bg-white"
                                          : "form-control"
                                      }
                                      id="orderDescription"
                                      name="orderDescription"
                                      value={this.props.orderDescription}
                                      onChange={(e) =>
                                        disDisc
                                          ? {}
                                          : this.props.handleChangeFields(e)
                                      }
                                      disabled={disDisc}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 order_detail_ricon">
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
                                      {!checkTwo ? (
                                        <Dropdown.Item
                                          onClick={() =>
                                            this.handleMultipleChangesModal()
                                          }
                                        >
                                          Multiple Changes
                                        </Dropdown.Item>
                                      ) : (
                                        ""
                                      )}

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
                                    <></>
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
                                </div>

                                <div className="col-12" id="par">
                                  <div className="login_form">
                                    <div
                                      className="login_table_list order-detail-tabl-main "
                                      // id="horizontal-scroll"
                                    >
                                      <table className="table shadow-none order-table tab-1-line order-detail-popup-table  od_popup_new  order--PDF ">
                                        <thead>
                                          <tr>
                                            <th scope="col"></th>
                                            <th
                                              scope="col"
                                              className="order-detail-th2-td2"
                                            >
                                              <div className="col align-self-center text-center pr-0 pl-0">
                                                <div className="form-group remember_check mm_check4 pt-0">
                                                  <input
                                                    type="checkbox"
                                                    id="remember"
                                                    onChange={(e) =>
                                                      this.props.handleCheckboxesInOrderDetails(
                                                        e,
                                                        "all"
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="remember"
                                                    className="mr-0"
                                                  ></label>
                                                </div>
                                              </div>
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left order-popup-th"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left pr-0 od-chart-sort-code"
                                            >
                                              Chart Sort
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left pl-3"
                                            >
                                              Chart Code
                                            </th>
                                            {flagsPrompts.length > 0 ? (
                                              flagsPrompts.map((p, i) => {
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
                                              })
                                            ) : (
                                              <>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                              </>
                                            )}

                                            <th
                                              className="order-detail-th10-td10 text-right pl-0 od-amount-pad-right"
                                              scope="col"
                                            >
                                              Amount
                                            </th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.props.poLines.map((d, i) => {
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
                                                <td className="order-detail-th2-td2">
                                                  <div className="col align-self-center text-center pr-0 pl-0">
                                                    <div className="form-group remember_check mm_check4 pt-0">
                                                      <input
                                                        type="checkbox"
                                                        id={"orderDetails" + i}
                                                        onChange={(e) =>
                                                          this.props.handleCheckboxesInOrderDetails(
                                                            e,
                                                            d
                                                          )
                                                        }
                                                        checked={d.checked}
                                                      />
                                                      <label
                                                        htmlFor={
                                                          "orderDetails" + i
                                                        }
                                                        className="mr-0"
                                                      ></label>
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-left pl-0 uppercaseText od-desc-input">
                                                  {(d.type === "Service" ||
                                                    d.type ===
                                                      "Distribution") &&
                                                  !checkTwo ? (
                                                    <div className="modal_input">
                                                      <input
                                                        type="text"
                                                        className="form-control uppercaseText"
                                                        id="description"
                                                        autoComplete="off"
                                                        autoFocus={true}
                                                        name={"description"}
                                                        defaultValue={
                                                          d.description
                                                        }
                                                        onBlur={(e) =>
                                                          this.props.handleChangeInLineFields(
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
                                                      d.type === "Inventory" ||
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
                                                <td className="text-left">
                                                  {checkOne ? (
                                                    d.chartSort
                                                  ) : (
                                                    <div className="modal_input width-56 ">
                                                      <input
                                                        type="text"
                                                        className={
                                                          d.chartSort.length <=
                                                          5
                                                            ? "form-control wd-50 uppercaseText"
                                                            : "form-control wd-75 uppercaseText"
                                                        }
                                                        id="chartSort"
                                                        autoComplete="off"
                                                        name={"chartSort"}
                                                        value={d.chartSort}
                                                        onChange={(e) =>
                                                          this.props.handleChangeInLineFields(
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
                                                  className={
                                                    checkTwo
                                                      ? "text-left poup-dropdown-position2"
                                                      : "text-left poup-dropdown-position"
                                                  }
                                                  id="cd_id"
                                                >
                                                  {checkTwo ? (
                                                    d.chartCode
                                                  ) : (
                                                    <>
                                                      <div className="modal_input width-90">
                                                        <input
                                                          type="text"
                                                          className={
                                                            d.chartCode
                                                              .length <= 4
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
                                                            this.state
                                                              .sugg_left,
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
                                                              No Chart Code
                                                              Found
                                                            </h6>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                </td>

                                                {flagsPrompts.length > 0 ? (
                                                  flagsPrompts.map((p, i) => {
                                                    return (
                                                      <td
                                                        className={
                                                          "text-left pad-left"
                                                        }
                                                        key={i}
                                                      >
                                                        {checkTwo ? (
                                                          d.flags.find(
                                                            (f) =>
                                                              f.type.toLowerCase() ===
                                                              p.type.toLowerCase()
                                                          ).value || ""
                                                        ) : (
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
                                                        )}
                                                      </td>
                                                    );
                                                  })
                                                ) : (
                                                  <>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                  </>
                                                )}

                                                <td
                                                  className={
                                                    (d.type === "Service" ||
                                                      d.type ===
                                                        "Distribution") &&
                                                    !checkOne
                                                      ? "text-left order-detail-th10-td10 uppercaseText"
                                                      : " text-right od-amount-td uppercaseText"
                                                  }
                                                >
                                                  {(d.type === "Service" ||
                                                    d.type ===
                                                      "Distribution") &&
                                                  !checkOne ? (
                                                    <div className="modal_input order_num_input">
                                                      <input
                                                        type="number"
                                                        className="form-control uppercaseText text-right float-right"
                                                        id="amount"
                                                        autoComplete="off"
                                                        name={"amount"}
                                                        value={d.amount}
                                                        onChange={(e) =>
                                                          this.props.handleChangeInLineFields(
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
                                                </td>
                                                <td>
                                                  {checkTwo ? (
                                                    <></>
                                                  ) : (
                                                    <img
                                                      onClick={() =>
                                                        this.editPOLine(d)
                                                      }
                                                      src="images/pencill.png"
                                                      className="import_icon cursorPointer"
                                                      alt="pencill"
                                                    />
                                                  )}
                                                </td>
                                                <td className="od-del-icon">
                                                  {checkOne ? (
                                                    <></>
                                                  ) : (
                                                    <img
                                                      onClick={() =>
                                                        this.deletePOLine(d)
                                                      }
                                                      src="images/delete.svg"
                                                      className="invoice-delete-icon cursorPointer"
                                                      alt="delete"
                                                    />
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                          <tr>
                                            <th scope="row"></th>
                                            <th className="text-left"></th>
                                            <td></td>
                                            <td></td>

                                            {flagsPrompts.length > 0 ? (
                                              flagsPrompts.map((p, i) => {
                                                return <td key={i}></td>;
                                              })
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
                                            <td className="tbl_total_amount text-right od-pr-subtotal">
                                              {this.props.subTotal}
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
          getNewORUpdatedPOLine={this.getNewORUpdatedPOLine} //add/edit po line
          poLineEditData={this.state.poLineEditData} //poLine for Editing
          accountDetails={this.props.accountDetails}
          tab={this.props.tab}
          basisOptions={this.props.basisOptions || []}
          props={this.props.props || ""}
          getChartCodes={this.props.getChartCodes}
          getChartSorts={this.props.getChartSorts}
          currency={this.props.currency}
          suppliersFlags={this.props.suppliersFlags}
          chartCodesList={this.props.chartCodesList || []}
          customFields={this.props.customFields || []}
        />

        <DeleteOrderDetails
          openDeleteOrderDetailModal={this.state.openDeleteOrderDetailModal}
          closeModal={this.closeModal}
          deletePOLineId={this.state.deletePOLineId}
          deletePOLine={this.props.deletePOLine}
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
          taxCodes={this.props.taxCodes || ""} //api response (get tax codes)
          chartSorts={this.props.chartSorts || ""} //api response (get chart sort)
          chartCodes={this.props.chartCodesList || []} //all chart codes
          handleMultipleChanges={this.props.handleMultipleChanges}
          tab={this.props.tab}
          lines={this.props.poLines}
          props={this.props.props || ""}
          getChartCodes={this.props.getChartCodes}
          getChartSorts={this.props.getChartSorts}
        />
      </>
    );
  }
}
export default OrderDetail;
