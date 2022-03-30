import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import MultipleChanges from "../../Modals/MultipleChanges/MultipleChanges";
import { toast } from "react-toastify";

class ExpenseDetails extends Component {
  constructor() {
    super();
    this.state = {
      openMultipleChangesModal: false,
    };
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({
      [name]: false,
    });
  };

  //update Expense lines
  updateExpenseLines = async () => {
    await this.props.updateExpenseLines();
    this.props.closeModal("openExpenseDetailModal");
  };
  handleMultipleChangesModal = () => {
    let lines = this.props.expenseLines || [];
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
          show={this.props.openExpenseDetailModal}
          onHide={() => this.props.closeModal("openExpenseDetailModal")}
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
                                Expense Detail
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.updateExpenseLines}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  this.props.closeModal(
                                    "openExpenseDetailModal"
                                  )
                                }
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
                                <div className="col-12">
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
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  <div className="login_form">
                                    <div className="login_table_list table-responsive exp-detail-tbl-main">
                                      <table className="table shadow-none order-table tab-1-line inv--edit od_popup_new order-detail-popup-table invic-detail">
                                        <thead>
                                          <tr>
                                            <th
                                              scope="col"
                                              className="pl-0"
                                              width="3%"
                                            >
                                              <div className="col align-self-center text-center pr-0">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="expDetail1"
                                                    onChange={(e) =>
                                                      this.props.handleCheckboxesInExpenseDetails(
                                                        e,
                                                        "all"
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="expDetail1"
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
                                            {this.props.flagsPrompts.map(
                                              (p, i) => {
                                                return (
                                                  <th
                                                    key={i}
                                                    scope="col"
                                                    className={
                                                      p.type === "Set" ||
                                                      p.type === "set"
                                                        ? "od-flag-last text-left"
                                                        : "text-left invo-d-flag-pad"
                                                    }
                                                  >
                                                    {p.prompt}
                                                  </th>
                                                );
                                              }
                                            )}
                                            <th></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.props.expenseLines.map(
                                            (d, i) => {
                                              return (
                                                <tr key={i}>
                                                  <td className="pl-0">
                                                    <div className="col align-self-center text-center pr-0">
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id={
                                                            "expDetails12" + i
                                                          }
                                                          onChange={(e) =>
                                                            this.props.handleCheckboxesInExpenseDetails(
                                                              e,
                                                              d
                                                            )
                                                          }
                                                          checked={d.checked}
                                                        />
                                                        <label
                                                          htmlFor={
                                                            "expDetails12" + i
                                                          }
                                                          className="mr-0"
                                                        ></label>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="text-left pl-0 uppercaseText">
                                                    <div className="modal_input">
                                                      <input
                                                        type="text"
                                                        className="form-control uppercaseText pl-0"
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={"description"}
                                                        value={d.description}
                                                        onChange={(e) =>
                                                          this.props.handleChangeField(
                                                            e,
                                                            d,
                                                            i
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </td>
                                                  <td className="text-left ">
                                                    <div className="modal_input  invo-chart-sort width-56">
                                                      <input
                                                        type="text"
                                                        className={
                                                          d.chartSort.length <=
                                                          5
                                                            ? " form-control wd-50 uppercaseText"
                                                            : "form-control wd-75 uppercaseText"
                                                        }
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={"chartSort"}
                                                        value={d.chartSort}
                                                        onChange={(e) =>
                                                          this.props.handleChangeField(
                                                            e,
                                                            d,
                                                            i
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </td>
                                                  <td className="text-left dropdown-position">
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
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={"chartCode"}
                                                        value={d.chartCode}
                                                        onChange={(e) =>
                                                          this.props.handleChangeField(
                                                            e,
                                                            d,
                                                            i
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </td>
                                                  {this.props.flagsPrompts.map(
                                                    (p, i) => {
                                                      return (
                                                        <td
                                                          className={
                                                            p.type === "Set" ||
                                                            p.type === "set"
                                                              ? "od-flag-last text-left"
                                                              : "text-left pad-left2"
                                                          }
                                                          key={i}
                                                        >
                                                          <div className="modal_input">
                                                            <input
                                                              type="text"
                                                              className="form-control uppercaseText"
                                                              id="usr"
                                                              autoComplete="off"
                                                              name={p.type}
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
                                                  )}
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

        <MultipleChanges
          openMultipleChangesModal={this.state.openMultipleChangesModal}
          closeModal={this.closeModal}
          flags_api={this.props.flags_api} //flags comming from get flags api
          flags={this.props.flags} //restructured flags accordings to requirements
          clonedFlags={this.props.clonedFlags} //a copy of flags
          chartSorts={this.props.chartSorts || ""} //api response (get chart sort)
          handleMultipleChanges={this.props.handleMultipleChanges}
          lines={this.props.expenseLines}
          props={this.props.props || ""}
          getChartSorts={this.props.getChartSorts}
        />
      </>
    );
  }
}
export default ExpenseDetails;
