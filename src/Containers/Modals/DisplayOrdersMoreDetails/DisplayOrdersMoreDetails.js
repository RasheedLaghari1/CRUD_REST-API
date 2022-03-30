import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";

const DisplayOrdersMoreDetails = (props) => {
  const [state, setState] = useState({
    currentApprover: true,
    approverdCheck: true,
    emailSupplier: true,
    tranCheck: true,
    descriptionCheck: true,
    dateCheck: true,
    poNumberCheck: true,
    requestBy: true,
    departmentCheck: true,
    specCondition: true,
  });

  useEffect(() => {
    if (props.openDisplayOrdersMoreDetailsModal) {
      let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
      let parseSetting = JSON.parse(displayOrdersSetting);

      if (displayOrdersSetting) {
        setState((prev) => ({ ...prev, ...parseSetting }));
      }
    }
  }, [props]);

  const handleMoreDetailsCheckboxes = (e) => {
    let { name, checked } = e.target;
    setState((prev) => ({ ...prev, [name]: checked }));
  };

  const onSaveDisplaySetting = () => {
    let {
      currentApprover,
      approverdCheck,
      emailSupplier,
      tranCheck,
      descriptionCheck,
      dateCheck,
      poNumberCheck,
      requestBy,
      departmentCheck,
      specCondition,
    } = state;
    let obj = {
      currentApprover,
      approverdCheck,
      emailSupplier,
      tranCheck,
      descriptionCheck,
      dateCheck,
      poNumberCheck,
      requestBy,
      departmentCheck,
      specCondition,
    };
    localStorage.setItem("displayOrdersSetting", JSON.stringify(obj));
    closeModal();
  };

  const closeModal = () => {
    let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
    let parseSetting = JSON.parse(displayOrdersSetting);
    if (displayOrdersSetting) {
      setState((prev) => ({ ...prev, ...parseSetting }));
    } else {
      setState((prev) => ({
        ...prev,
        currentApprover: true,
        approverdCheck: true,
        emailSupplier: true,
        tranCheck: true,
        descriptionCheck: true,
        dateCheck: true,
        poNumberCheck: true,
        requestBy: true,
        departmentCheck: true,
        specCondition: true,
      }));
    }
    props.closeModal("openDisplayOrdersMoreDetailsModal");
  };
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDisplayOrdersMoreDetailsModal}
        onHide={closeModal}
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
                              Display Order Details
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onSaveDisplaySetting}
                              type="button"
                              className="btn-save"
                            >
                              <img
                                src="images/save-check.png"
                                className="mr-2"
                                alt="display-icon"
                              />
                              Save
                            </button>
                            <button
                              onClick={closeModal}
                              type="button"
                              className="btn-save"
                            >
                              <img
                                src="images/cancel.png"
                                className="mr-2"
                                alt="display-icon"
                              />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="currentApprover"
                                  name="currentApprover"
                                  checked={state.currentApprover}
                                  onChange={handleMoreDetailsCheckboxes}
                                />

                                <label
                                  htmlFor="currentApprover"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Current Approver</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="dateCheck"
                                  name="dateCheck"
                                  checked={state.dateCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="dateCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Date</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="approverdCheck"
                                  name="approverdCheck"
                                  checked={state.approverdCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="approverdCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Approverd</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="poNumberCheck"
                                  name="poNumberCheck"
                                  checked={state.poNumberCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="poNumberCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">PO#</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="emailSupplier"
                                  name="emailSupplier"
                                  checked={state.emailSupplier}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="emailSupplier"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Email Supplier</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="requestBy"
                                  name="requestBy"
                                  checked={state.requestBy}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="requestBy"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Request By</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="tranCheck"
                                  name="tranCheck"
                                  checked={state.tranCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="tranCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">tran</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="departmentCheck"
                                  name="departmentCheck"
                                  checked={state.departmentCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="departmentCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Department</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="descriptionCheck"
                                  name="descriptionCheck"
                                  checked={state.descriptionCheck}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="descriptionCheck"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Description</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="row no-gutters mb-md-3">
                            <div className="col-auto pr-0">
                              <div className="form-group remember_check">
                                <input
                                  type="checkbox"
                                  id="specCondition"
                                  name="specCondition"
                                  checked={state.specCondition}
                                  onChange={handleMoreDetailsCheckboxes}
                                />
                                <label
                                  htmlFor="specCondition"
                                  className="float-left"
                                ></label>
                              </div>
                            </div>
                            <div className="col pl-0">
                              <p className="f-20 m-0">Special Conditions</p>
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

export default DisplayOrdersMoreDetails;
