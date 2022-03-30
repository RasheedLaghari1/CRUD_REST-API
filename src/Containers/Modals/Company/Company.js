import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { connect } from "react-redux";
import { userAvatar, _customStyles } from "../../../Constants/Constants";

const Company = (props) => {
  const comRef = useRef(null);

  useEffect(() => {
    if (props.openCompanyModal) {
      comRef.current.focus();
    }
  }, [props]);
  const onSave = async () => {
    if (props.companyName.trim() != "") {
      await props.updatePOCompany();
      await props.closeModal("openCompanyModal");
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
        show={props.openCompanyModal}
        onHide={() => props.closeModal("openCompanyModal")}
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
                            <h6 className="text-left def-blue">Company</h6>
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
                                props.closeModal("openCompanyModal")
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
                        <div className="col-12">
                          {/* <p className="model-p move-modal-t">
                            This order will be copied to your drafts folder to modify and send for approval.
                            </p> */}

                          {/* dropdown coding start */}
                          <div className="form-group custon_select">
                            <label>Company</label>
                            <Select
                              isDisabled={checkOne}
                              className="width-selector"
                              // classNamePrefix="custon_select-selector-inner"
                              styles={_customStyles}
                              classNamePrefix="react-select"
                              autoFocus={true}
                              ref={comRef}
                              defaultValue={
                                props.companyName
                                  ? {
                                      label: props.companyName,
                                      value: props.companyID,
                                    }
                                  : { label: "Select Company", value: "" }
                              }
                              options={props.companies}
                              onChange={props.handleChangeCompanies}
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
                            {
                              // If a field is read only and cannot be edited or input, please remove the error message that the field is required.
                              !checkOne && (
                                <div className="text-danger error-12">
                                  {props.companyName.trim() === ""
                                    ? "This Field Is Required"
                                    : ""}
                                </div>
                              )
                            }
                          </div>

                          {/* end  */}
                        </div>

                        <div className="col-12">
                          <div className="form-group custon_select disabled_fields pl-0">
                            <label htmlFor="usr">Address</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                // placeholder="1380 Anderson Park Ilene, 2344"
                                id="usr"
                                disabled
                                value={props.companyAddress}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select disabled_fields pl-0">
                            <label htmlFor="usr">Tax ID</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                // placeholder="1335-24-5563"
                                id="usr"
                                disabled
                                value={props.taxID}
                                onChange={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select disabled_fields">
                            <label htmlFor="usr">Phone</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                // placeholder="86-(196)475-367"
                                id="usr"
                                disabled
                                value={props.phone}
                                onChange={() => {}}
                              />
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

const mapStateToProps = (state) => ({
  user: state.user,
  poData: state.poData,
});
export default connect(mapStateToProps, {})(Company);
