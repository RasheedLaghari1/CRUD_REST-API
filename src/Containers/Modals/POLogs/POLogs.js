import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

class POLogs extends Component {
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
          show={this.props.openPOLogsModal}
          onHide={() => this.props.closeModal("openPOLogsModal")}
          className="forgot_email_modal modal_90_per mx-auto poLog--modal"
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
                              <h6 className="text-left def-blue">PO Log</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() =>
                                  this.props.closeModal("openPOLogsModal")
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
                      <div className="forgot_body mt-3">
                        <div className="row">
                          <div className="col-12" style={{ padding: "0px" }}>
                            <div className="model-p">
                              <div className="row">
                                <div className="col-12">
                                  <div className="login_form">
                                    <div className="table-responsive">
                                      <table className="fold-table">
                                        <thead>
                                          <tr>
                                            <th width="5%">Detail</th>
                                            <th width="5%">Line</th>
                                            <th width="9%">Vendor</th>
                                            <th width="5%">Amount</th>
                                            <th width="10%">Status</th>
                                            <th width="20%">Description</th>
                                            <th width="8%">Chart Sort</th>
                                            <th width="8%">Chart Code</th>
                                            <th width="10%">Tax Code</th>
                                            <th width="10%">Tracking Code</th>
                                            <th width="10%">User</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.props.poLog.map((log, i) => {
                                            return (
                                              <>
                                                <tr key={i} className="view">
                                                  <td className="icon-th">
                                                    <img
                                                      src="images/angle-down.png"
                                                      className="down_data"
                                                      // data-target="#down_info"
                                                      data-toggle="collapse"
                                                      data-target={"#abc" + i}
                                                      alt="toggle-down"
                                                    />
                                                  </td>
                                                  <td>{log.line}</td>
                                                  <td>N/A</td>
                                                  <td>{log.amount}</td>
                                                  <td>{log.status}</td>

                                                  <td>{log.description}</td>
                                                  <td>{log.chartSort}</td>
                                                  <td>{log.chartCode}</td>
                                                  <td>{log.taxCode}</td>
                                                  <td>{log.trackingCode}</td>
                                                  <td>{log.userName}</td>
                                                </tr>
                                                <tr
                                                  className="fold collapse"
                                                  id={"abc" + i}
                                                >
                                                  <td
                                                    colspan="12"
                                                    style={{ padding: "0px" }}
                                                  >
                                                    <div className="fold-content">
                                                      <table>
                                                        <thead>
                                                          <tr>
                                                            <th
                                                              width="5%"
                                                              style={{
                                                                backgroundColor:
                                                                  "transparent !important",
                                                              }}
                                                            ></th>
                                                            <th width="5%">
                                                              Line
                                                            </th>
                                                            <th width="9%">
                                                              Vendor
                                                            </th>
                                                            <th width="5%">
                                                              Amount
                                                            </th>
                                                            <th width="10%">
                                                              Status
                                                            </th>
                                                            <th width="20%">
                                                              Description
                                                            </th>
                                                            <th width="8%">
                                                              Chart Sort
                                                            </th>
                                                            <th width="8%">
                                                              Chart Code
                                                            </th>
                                                            <th width="10%">
                                                              Tax Code
                                                            </th>
                                                            <th width="10%">
                                                              Tracking Code
                                                            </th>
                                                            <th width="10%">
                                                              User
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          <tr>
                                                            <td>
                                                              <span
                                                                style={{
                                                                  visibility:
                                                                    "hidden",
                                                                }}
                                                              >
                                                                visible
                                                              </span>
                                                            </td>

                                                            <td>{log.line}</td>
                                                            <td>N/A</td>
                                                            <td>
                                                              {log.amount}
                                                            </td>
                                                            <td>
                                                              {log.status}
                                                            </td>

                                                            <td>
                                                              {log.description}
                                                            </td>
                                                            <td>
                                                              {log.chartSort}
                                                            </td>
                                                            <td>
                                                              {log.chartCode}
                                                            </td>
                                                            <td>
                                                              {log.taxCode}
                                                            </td>
                                                            <td>
                                                              {log.trackingCode}
                                                            </td>
                                                            <td>
                                                              {log.userName}
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          })}
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
      </>
    );
  }
}
export default POLogs;
