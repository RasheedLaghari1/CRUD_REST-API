import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";

class ExpensesMoreDetails extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openExpenseMoreDetailsModal}
          onHide={() => this.props.closeModal("openExpenseMoreDetailsModal")}
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
                                Expenses Details
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() =>
                                  this.props.closeModal(
                                    "openExpenseMoreDetailsModal"
                                  )
                                }
                                type="button"
                                className="btn-save"
                              >
                                <img
                                  src="images/cancel.png"
                                  className="mr-2"
                                  alt="display-icon"
                                />
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12">
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
                                    <Dropdown.Item>Action 1</Dropdown.Item>
                                    <Dropdown.Item>Action 2</Dropdown.Item>
                                    <Dropdown.Item>Action 3</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                <div className="login_form">
                                  <div className="login_table_list table-responsive new_radio_form">
                                    <table className="table shadow-none order-table tab-1-line">
                                      <thead>
                                        <tr>
                                          <th scope="col">
                                            <div className="col align-self-center text-center pr-0">
                                              <div className="form-group m-0">
                                                <label className="dash_container dash_remember table-check unckeck p-0 exp_detail">
                                                  <input
                                                    type="checkbox"
                                                    name={"chk1"}
                                                    id={"chk1"}
                                                    // checked={true}
                                                  />
                                                  <span
                                                    id="chk1"
                                                    className="dash_checkmark"
                                                  ></span>
                                                </label>
                                                <p className="exp_item_hed">
                                                  {" "}
                                                  Item
                                                </p>
                                              </div>
                                            </div>
                                          </th>

                                          <th scope="col" className="text-left">
                                            Description
                                          </th>
                                          <th scope="col" className="text-left">
                                            Value
                                          </th>
                                          <th scope="col" className="text-left">
                                            Hide
                                          </th>
                                          <th scope="col" className="text-left">
                                            <img src="images/top-menu.png"></img>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.props.details.map((d, i) => {
                                          return (
                                            <tr key={i}>
                                              <td>
                                                <div className="col align-self-center text-center pr-0">
                                                  <div className="form-group  check_round round_bottom">
                                                    <input
                                                      type="checkbox"
                                                      id="remember1"
                                                    />
                                                    <label
                                                      htmlFor="remember1"
                                                      className="mr-0"
                                                    >
                                                      <span>{d.item}</span>
                                                    </label>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-left">
                                                {d.description}
                                              </td>
                                              <td className="text-left">
                                                {" "}
                                                {d.value}
                                              </td>
                                              <td>
                                                <div className="col align-self-center text-center pr-0 pl-0">
                                                  <div className="form-group  check_round round_bottom pl-0">
                                                    <input
                                                      type="checkbox"
                                                      id="remember2"
                                                      checked
                                                    />
                                                    <label
                                                      htmlFor="remember2"
                                                      className="mr-0"
                                                    ></label>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-left"> </td>
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {})(ExpensesMoreDetails);
