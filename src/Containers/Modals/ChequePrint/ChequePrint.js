import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import Select from "react-select";

const ChequePrint = (props) => {
  const [state, setState] = useState({
    addNewReportToggle: false,
    reportOptionVal: { label: "Select Report Options", value: "" },
    reportOptions: [
      { label: "Test 1", value: "" },
      { label: "Test 2", value: "" },
    ],
    menuIsOpen: false,
    reportFile: "",
    reportName: "",
    privateCheck: false,
    formErrors: {
      reportOptionVal: "",
      reportFile: "",
      reportName: "",
    },
  });

  let { reportOptionVal, reportOptions, menuIsOpen } = state;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openChequePrintModal}
        onHide={() => props.closeModal("openChequePrintModal")}
        className="forgot_email_modal modal_704 mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid ">
            <div className="main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header">
                      <div className="modal-top-header">
                        <div className="row bord-btm">
                          <div className="col-auto pl-0">
                            <h6 className="text-left def-blue">Cheque Print</h6>
                          </div>

                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openChequePrintModal")
                              }
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={() =>
                                props.closeModal("openChequePrintModal")
                              }
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Check Number"
                              className="form-control mm-custom-input"
                            ></input>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Check Date"
                              className="form-control mm-custom-input"
                            ></input>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            {/* dropdown coding start */}
                            <div className="custon_select">
                              <Select
                                className="width-selector"
                                onMenuOpen={menuIsOpen}
                                closeMenuOnSelect={true}
                                value={reportOptionVal}
                                classNamePrefix="report_menu custon_select-selector-inner"
                                onMenuOpen={state.menuOpened}
                                onMenuClose={state.menuClosed}
                                onChange={state.handleReportOptions}
                                options={reportOptions}
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

                              <span
                                className="input_field_icons rit-icon-input"
                                onClick={state.addNewReport}
                              >
                                <i className="fa fa-plus"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="remittance-advance-table">
                        <h2>Advanced</h2>
                        <div className="table-responsive">
                          <table className="table ">
                            <thead className="thead_bg">
                              <tr>
                                <th scope="col">
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="sa"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="sa"
                                        name="example1"
                                      />
                                      <span className="click_checkmark global_checkmark"></span>
                                    </label>
                                  </div>
                                </th>
                                <th scope="col">Category</th>
                                <th scope="col">description</th>
                                <th scope="col">value</th>
                                <th scope="col">hide</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="za"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="za"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cgb"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cgb"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="xs"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="xs"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cgs"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cgs"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="xd"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="xd"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cgz"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cgz"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cx"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cx"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cgx"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cgx"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cd"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cd"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="ca"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="ca"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cf"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cf"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cge"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cge"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="df"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="df"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="cgd"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="cgd"
                                        name="example1"
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChequePrint;
