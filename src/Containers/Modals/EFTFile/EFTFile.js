import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import $ from "jquery";

const EFTFile = (props) => {
  const [state, setState] = useState({});
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openEftFileModal}
        onHide={() => props.closeModal("openEftFileModal")}
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
                            <h6 className="text-left def-blue">EFT File</h6>
                          </div>

                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openEftFileModal")
                              }
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={() =>
                                props.closeModal("openEftFileModal")
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
                              placeholder="Process Date"
                              className="form-control mm-custom-input"
                            ></input>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Layout"
                              className="form-control mm-custom-input"
                            ></input>
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

export default EFTFile;
