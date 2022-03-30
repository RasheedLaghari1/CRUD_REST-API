import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import { _customStyles } from "../../../Constants/Constants";

const Approvals = (props) => {
  const aprvlRef = useRef(null);

  useEffect(() => {
    if (props.openApprovalsModal) {
      aprvlRef.current.focus();
    }
  }, [props]);
  //when clicks on Save Button
  const onSave = async () => {
    if (props.approvalGroup.value) {
      await props.updateApprovalGroup();
      await props.closeModal("openApprovalsModal");
    } else {
      toast.error("Please Select Approval Group!");
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
        show={props.openApprovalsModal}
        onHide={() => props.closeModal("openApprovalsModal")}
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
                              Approval Group
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
                                props.closeModal("openApprovalsModal")
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
                        <div className="col-12 pl-md-0">
                          <div className="row mt-4">
                            <div className="col-md-12">
                              <div className="form-group custon_select">
                                <Select
                                  className="width-selector"
                                  // classNamePrefix="track_menu custon_select-selector-inner"
                                  styles={_customStyles}
                                  classNamePrefix="react-select"
                                  value={props.approvalGroup}
                                  options={props.approvals}
                                  onChange={props.handleChangeApprovalsGroups}
                                  ref={aprvlRef}
                                  tabIndex="2232"
                                  id="id_appGroup"
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
                                  isDisabled={checkOne}
                                />
                                <span
                                  className="input_field_icons rit-icon-input"
                                  data-toggle="collapse"
                                  data-target="#asd"
                                ></span>
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

export default Approvals;
