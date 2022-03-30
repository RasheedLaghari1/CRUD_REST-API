// import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import Select from "react-select";
import $ from "jquery";

const CancelReIssue = (props) => {
  const [state, setState] = useState({
    addNewReportToggle: false,
    reportTypesVal: { label: "Select Report Type", value: "" },
    reportTypes: [{ label: "Select Report Type", value: "" }],
    reportOptionVal: { label: "Select Report Options", value: "" },
    reportOptions: [
      { label: "Test 1", value: "" },
      { label: "Test 2", value: "" },
    ],
    menuIsOpen: false,
    reportFile: "",
    reportName: "",
    privateCheck: false,
    exchangeRateCheck: "budgeted",
    currConvCheck: "native",
    formErrors: {
      reportTypesVal: "",
      reportOptionVal: "",
      reportFile: "",
      reportName: "",
    },
    newBatch: false,
  });

  const handleReportTypes = (type) => {
    setState((prev) => ({
      ...prev,
      reportTypesVal: type,
      reportOptionVal: { label: "Select Report Options", value: "" },
      reportOptions: [],
    }));
  };
  const handleReportOptions = (layout) => {
    setState((prev) => ({
      ...prev,
      reportOptionVal: layout,
      addNewReportToggle: false,
      reportFile: "",
      reportName: "",
      private: false,
    }));
  };
  const handleReportCheckbox = async (e) => {
    setState((prev) => ({ ...prev, privateCheck: e.target.checked }));
  };

  const handleFieldChange = async (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    setState((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const addNewReport = () => {
    setState((prev) => ({
      ...prev,
      reportOptionVal: { label: "Select Report Options", value: "" },
      addNewReportToggle: !prev.addNewReportToggle,
    }));
  };
  const uploadReportFile = async (f) => {};

  const onSaveReport = () => {
    props.closeModal("openCancelReIssueModal");
    setState((prev) => ({ ...prev, newBatch: false }));
  };

  const onCancelReport = () => {
    props.closeModal("openCancelReIssueModal");
    setState((prev) => ({ ...prev, newBatch: false }));
  };
  const menuOpened = async () => {
    setState((prev) => ({ ...prev, menuIsOpen: true }));

    let _this = this;
    $(document).ready(async function () {
      $('<i class="fa fa-trash report--del"></i>').appendTo(
        ".report_menu.custon_select-selector-inner__option"
      );
      $(".report_menu.custon_select-selector-inner__option i").on(
        "click",
        async function (e) {
          e.preventDefault();
          var p_id = $(this).parent().attr("id");
          let id_split = p_id && p_id.split("-"); //["react", "select", "3", "option", "1"]
          let id = id_split[id_split.length - 1];

          let { reportOptions } = state;
          let rep_opt = reportOptions.length > 0 && reportOptions[id];
          //call delete report options API
        }
      );
    });
  };
  const menuClosed = () => {
    setState((prev) => ({ ...prev, menuIsOpen: false }));
  };
  let {
    addNewReportToggle,
    reportTypesVal,
    reportTypes,
    reportOptionVal,
    reportOptions,
    menuIsOpen,
    reportName,
    privateCheck,
    formErrors,
  } = state;

  let { heading } = props;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openCancelReIssueModal}
        onHide={onCancelReport}
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
                            <h6 className="text-left def-blue">{heading}</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onSaveReport}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={onCancelReport}
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
                    <div className="forgot_body px-3">
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <Select
                              className="width-selector"
                              value={reportTypesVal}
                              classNamePrefix="custon_select-selector-inner"
                              options={reportTypes}
                              onChange={handleReportTypes}
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
                            <div className="text-danger error-12">
                              {formErrors && formErrors.reportTypesVal !== ""
                                ? formErrors.reportTypesVal
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="form-group col-md-12">
                          <div className="custon_select">
                            <Select
                              className="width-selector"
                              onMenuOpen={menuIsOpen}
                              closeMenuOnSelect={true}
                              value={reportOptionVal}
                              classNamePrefix="report_menu custon_select-selector-inner"
                              onMenuOpen={menuOpened}
                              onMenuClose={menuClosed}
                              onChange={handleReportOptions}
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
                              onClick={addNewReport}
                            >
                              <i className="fa fa-plus"></i>
                            </span>
                          </div>
                        </div>
                        {addNewReportToggle && (
                          // <div className="collapse pl-3 pr-3 w-100 id="asd">
                          <div className=" pl-3 pr-3 w-100">
                            <div className="row">
                              <div className="col-12">
                                <div className="form-group custon_select mt-3">
                                  <div className="modal_input">
                                    <label>Report Name</label>
                                    <input
                                      type="text"
                                      className="form-control pl-0"
                                      id="usr"
                                      name="reportName"
                                      value={reportName}
                                      onChange={handleFieldChange}
                                    />
                                    <div className="text-danger error-12">
                                      {formErrors.reportName !== ""
                                        ? formErrors.reportName
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 align-self-center mb-2">
                                <div className="form-group remember_check">
                                  <input
                                    type="checkbox"
                                    id="remember"
                                    checked={privateCheck}
                                    onChange={handleReportCheckbox}
                                  />
                                  <label htmlFor="remember"></label>
                                  <p className="reports-excel">Private:</p>
                                </div>
                              </div>
                              <div className="col-12 mt-2 mb-2">
                                <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                  <div id="drop-area-report">
                                    <input
                                      type="file"
                                      id="fileElem-rep"
                                      className="form-control d-none"
                                      accept="application/pdf"
                                      onChange={(e) => {
                                        uploadReportFile(e.target.files);
                                      }}
                                      onClick={(event) => {
                                        event.currentTarget.value = null;
                                      }} //to upload the same file again
                                    />

                                    <label
                                      className="upload-label"
                                      htmlFor="fileElem-rep"
                                    >
                                      <div className="upload-text">
                                        <img
                                          src="images/drag-file.png"
                                          className="import_icon img-fluid"
                                          alt="upload-report"
                                        />
                                      </div>
                                    </label>
                                  </div>
                                </div>
                                <div className="text-danger error-12">
                                  {formErrors.reportFile !== ""
                                    ? formErrors.reportFile
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <label>Period</label>
                            <Select
                              className="width-selector"
                              // value={{label: 'Select Period', value: 'Period '}}
                              classNamePrefix="custon_select-selector-inner"
                              defaultValue={{
                                label: "Read Only",
                                value: "readOnly ",
                              }}
                              options={[
                                { label: "Read Only", value: "readOnly " },
                              ]}
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
                          </div>
                        </div>
                        <div className="col-12 align-self-center mb-2">
                          <div className="form-group remember_check">
                            <input
                              type="checkbox"
                              id="batch"
                              checked={state.newBatch}
                              onChange={(e) => {
                                setState({ newBatch: e.target.checked });
                              }}
                            />
                            <label htmlFor="batch"></label>
                            <p className="reports-excel">New Batch</p>
                          </div>
                        </div>
                        {!state.newBatch ? (
                          <div className="col-md-12">
                            <div className="form-group custon_select">
                              <label>Batch List</label>
                              <Select
                                className="width-selector"
                                // value={{label: 'Select Period', value: 'Period '}}
                                classNamePrefix="custon_select-selector-inner"
                                defaultValue={{
                                  label: "Batch's List ... ",
                                  value: " ",
                                }}
                                options={[
                                  { label: "List 1", value: " " },
                                  { label: "List 2", value: " " },
                                  { label: "List 3", value: " " },
                                ]}
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
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="col-12 align-self-center mb-2">
                          <div className="form-group remember_check">
                            <input type="checkbox" id="cheque" />
                            <label htmlFor="cheque"></label>
                            <p className="reports-excel">
                              {heading === "Invoice Cancel Re-issue"
                                ? "Re-enter Cancelled Invoice:"
                                : "Re-enter Cancelled Cheque Invoices:"}
                            </p>
                          </div>
                        </div>
                        <div className="col-12 align-self-center mb-2">
                          <div className="form-group remember_check">
                            <input type="checkbox" id="print" />
                            <label htmlFor="print"></label>
                            <p className="reports-excel">
                              Create Posting Report
                            </p>
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

export default CancelReIssue;
