import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Modal from "react-bootstrap/Modal";
import "./OrderRequest.css";
import { connect } from "react-redux";

const OrderRequest = (props) => {
  const [state, setState] = useState({
    department: [],
    projects: [],
  });
  const reqBy = useRef(null);

  useEffect(() => {
    if (props.openOrderRequestModal) {
      reqBy.current.focus();
    }
  }, [props.openOrderRequestModal]);

  const onSave = async () => {
    if (props.requestedBy.trim() != "" && props.requestedDepartment !== "") {
      await props.updateRequested();
      await props.closeModal("openOrderRequestModal");
    }
  };

  let userType = localStorage.getItem("userType");
  let tab = props.tab || "";

  let checkOne = false;

  if (userType && tab) {
    if (userType.toLowerCase() === "approver") {
      /* An Approver can only edit the chart code, tracking codes and item description.
       Everything else in the PO is read-only and cannot be altered.*/

      checkOne = true;
    } else if (userType.toLowerCase() === "operator") {
      /*The Operator account should only be able to edit the Preview PDF in the Draft section,
       in every other section the preview pdf must be read only for them.*/
      if (tab != "draft") {
        checkOne = true;
      }
    } else if (userType.toLowerCase() === "op/approver") {
      /*The Operator/Approver account can edit everything in the Draft section 
      AND they can also edit the Chart Code, Tracking Code and Description in the Approve
      and Hold Section */
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
        show={props.openOrderRequestModal}
        onHide={() => props.closeModal("openOrderRequestModal")}
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
                              Order Request
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            {checkOne ? (
                              <></>
                            ) : (
                              <button
                                onClick={onSave}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                            )}
                            <button
                              onClick={() =>
                                props.closeModal("openOrderRequestModal")
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
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label>Requested By</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  checkOne
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                id="name"
                                ref={reqBy}
                                name="requestedBy"
                                defaultValue={props.requestedBy}
                                onBlur={props.handleChangeFields}
                                disabled={checkOne}
                              />
                            </div>

                            {
                              // If a field is read only and cannot be edited or input, please remove the error message that the field is required.
                              !checkOne && (
                                <div className="text-danger error-12">
                                  {props.requestedBy.trim() === ""
                                    ? "This Field Is Required"
                                    : ""}
                                </div>
                              )
                            }
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label>Department</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  checkOne
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                // id="name"
                                name="requestedDepartment"
                                defaultValue={props.requestedDepartment}
                                onBlur={props.handleChangeFields}
                                disabled={checkOne}
                              />
                            </div>

                            {
                              // If a field is read only and cannot be edited or input, please remove the error message that the field is required.
                              !checkOne && (
                                <div className="text-danger error-12">
                                  {props.requestedDepartment.trim() === ""
                                    ? "This Field Is Required"
                                    : ""}
                                </div>
                              )
                            }
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

export default OrderRequest;
