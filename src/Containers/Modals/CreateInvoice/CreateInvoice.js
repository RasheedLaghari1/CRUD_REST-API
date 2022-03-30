import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

const CreateInvoice = (props) => {
  const [state, setState] = useState({});
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openCreateInvoiceModal}
        onHide={() => props.closeModal("openCreateInvoiceModal")}
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
                              Create Invoice
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={props.createInvoice}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={() =>
                                props.closeModal("openCreateInvoiceModal")
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
                        <div className="col-6 pl-md-0">
                          <div className="row mt-4">
                            <div className="col-md-12">
                              <div className="form-group custon_select mm_pr">
                                <Select
                                  className="width-selector pt-2"
                                  classNamePrefix="custon_select-selector-inner"
                                  value={props.bankCode}
                                  options={props.bankCodeList}
                                  onChange={(obj) =>
                                    props.handleSelectFields("bankCode", obj)
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
                                <label className="move_label inactive pt-2">
                                  Bank Code
                                </label>
                                <div className="text-danger error-12">
                                  {props.formErrors.bankCode !== ""
                                    ? props.formErrors.bankCode
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 pl-md-0">
                          <div className="row mt-4">
                            <div className="col-md-12">
                              <div className="form-group custon_select mm_pr">
                                <Select
                                  className="width-selector pt-2"
                                  classNamePrefix="custon_select-selector-inner"
                                  value={props.taxCode}
                                  options={props.taxCodeList}
                                  onChange={(obj) =>
                                    props.handleSelectFields("taxCode", obj)
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
                                <label className="move_label inactive pt-2">
                                  Tax Code
                                </label>
                                <div className="text-danger error-12">
                                  {props.formErrors.taxCode !== ""
                                    ? props.formErrors.taxCode
                                    : ""}
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
};

export default CreateInvoice;
