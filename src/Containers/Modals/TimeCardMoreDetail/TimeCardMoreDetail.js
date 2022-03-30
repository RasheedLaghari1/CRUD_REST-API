import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./TimeCardMoreDetail.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { userAvatar } from "../../../Constants/Constants";
import $ from "jquery";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EmployeeLookup from "../EmployeeLookup/EmployeeLookup";
import { Prev } from "react-bootstrap/esm/PageItem";

import { updateSummary } from "../../../Actions/TimecardActions/TimecardActions";

const TimeCardMoreDetail = (props) => {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let { closeModal, updateTimecardSummaryState, showTallisTabPane } = props;

  showTallisTabPane = showTallisTabPane ? showTallisTabPane.toLowerCase() : "";

  const dispatch = useDispatch();

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      clonedEmployeeList: props.state.employeeList,
      ...props.state,
    }));
  }, [props]);

  // const closeModal = (name) => {};

  const periodOption = () => {
    if (state.approverOptions.length > 0) {
      let newArray = [];
      state.approverOptions.map((item) =>
        newArray.push({ value: item.option, label: item.option })
      );
      return newArray;
    }
  };

  const handleChangeEmployeeName = async (e) => {
    $(".employee_name").show();
    let value = e.target.value;
    let clonedEmployeeList = [...state.employeeList];
    if (!value) {
      clonedEmployeeList = [];
    } else {
      let chartCodesListFilterdData = clonedEmployeeList.filter((c) => {
        return (
          c.firstName.toUpperCase().includes(value.toUpperCase()) ||
          c.lastName.toUpperCase().includes(value.toUpperCase())
        );
      });
      clonedEmployeeList = chartCodesListFilterdData;
    }
    setState((prev) => ({
      ...prev,
      employeeName: value,
      clonedEmployeeList,
    }));
  };

  const onblur = (i) => {
    setTimeout(() => {
      $(".employee_name").hide();
    }, 700);
  };

  const changeEmployeeName = async (params) => {
    //focus after chart code selection to move next on Tab press
    $(`#employee_name_input`).focus();

    setState((prev) => ({
      ...prev,
      employeeCode: params.employeeCode || "",
      employeeName: params.firstName + " " + params.lastName || "",
      department: params.department || "",
      position: params.position || "",
      email: params.email || "",
      approverGroup: params.approverGroup || "",
      stateTaxFlag: params.stateTaxFlag || "",
      group: params.group || "",
    }));
  };

  const onChangeHandlerDate = (date) => {
    setState((prev) => ({
      ...prev,
      periodEndingDate: new Date(date).getTime(),
    }));
  };

  const onChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeType = (data) => {
    setState((prev) => ({
      ...prev,
      approverGroup: data.value,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    let timecardSummary = {
      employeeName: state.employeeName,
      employeeCode: state.employeeCode,
      periodEndingDate: state.periodEndingDate,
      department: state.department,
      position: state.position,
      email: state.email,
      approverGroup: state.approverGroup,
      stateTaxFlag: state.stateTaxFlag,
      group: state.group,
      currentApprover: state.currentApprover,
      approved: state.approved,
      batchDesc: state.batchDesc,
      tran: state.tran,
    };

    setIsLoading(true);

    let response = await dispatch(updateSummary(timecardSummary));
    updateTimecardSummaryState(timecardSummary);

    let { timecardsList, activeTimecard } = props.state;
    let activeTimeCardToUpdate = timecardsList.find(
      (fi) => fi.id === activeTimecard
    );
    await props.getTimecardSummary(activeTimeCardToUpdate, true);
    closeModal("openTimeCardMoreDetail");

    setIsLoading(false);
  };

  const updateParentState = (params) => {
    setState((prev) => ({
      ...prev,
      employeeCode: params.employeeCode || "",
      employeeName: params.firstName + " " + params.lastName || "",
      department: params.department || "",
      position: params.position || "",
      email: params.email || "",
      approverGroup: params.approverGroup || "",
      stateTaxFlag: params.stateTaxFlag || "",
      group: params.group || "",
    }));
  };

  if (!state) {
    return <div>loading....</div>;
  }

  return (
    <>
      {isLoading ? <div className="se-pre-con"></div> : ""}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={state.openTimeCardMoreDetail}
        onHide={() => closeModal("openTimeCardMoreDetail")}
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
                              Employee Details
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            {showTallisTabPane === "draft" ? (
                              <p>
                                <button
                                  type="button"
                                  className="btn-save"
                                  onClick={onSave}
                                >
                                  <img
                                    src="images/display-icon.png"
                                    className="mr-2"
                                    alt="display-icon"
                                  />
                                  Save
                                </button>
                              </p>
                            ) : (
                              ""
                            )}

                            <Link to="#">
                              <button
                                onClick={() =>
                                  closeModal("openTimeCardMoreDetail")
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
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        <div className="form-group col-12">
                          <div className="custon_select">
                            <label htmlFor="usr">Employee Name:</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : "focus_chartCode uppercaseText"
                                }
                                placeholder="Employee Name"
                                id="employee_name_input"
                                autoComplete="off"
                                name="employeeName"
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? handleChangeEmployeeName(e)
                                    : () => {}
                                }
                                disabled={showTallisTabPane !== "draft"}
                                onBlur={onblur}
                                value={state.employeeName}
                              />
                              <div
                                className={`chart_menue employee_name line_item_chart_menue`}
                              >
                                {state.clonedEmployeeList.length > 0 ? (
                                  <ul className="invoice_vender_menu">
                                    {state.clonedEmployeeList.map((c, i) => {
                                      return (
                                        <li
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() => changeEmployeeName(c)}
                                        >
                                          <div className="vender_menu_right chart_new">
                                            <h3 className="chart_vender_text">
                                              {c.firstName + " " + c.lastName}
                                            </h3>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <div className="sup_nt_fnd text-center">
                                    <h6>No Employee Name Found</h6>
                                  </div>
                                )}
                              </div>

                              <span
                                onClick={() =>
                                  showTallisTabPane === "draft"
                                    ? setState((prev) => ({
                                        ...prev,
                                        openEmployeeLookupModal: true,
                                      }))
                                    : () => {}
                                }
                                className="input_field_icons"
                              >
                                <i className="fa fa-search"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className=" col-12">
                          <div className="form-group custon_select">
                            <label htmlFor="id_dt">Period Ending</label>
                            <div className="modal_input datePickerUP">
                              <DatePicker
                                name="periodEndingDate"
                                id="periodEndingDate"
                                tabIndex="3334"
                                dateFormat="d MMM yyyy"
                                autoComplete="off"
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? onChangeHandlerDate(e)
                                    : () => {}
                                }
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : ""
                                }
                                disabled={showTallisTabPane !== "draft"}
                                selected={state.periodEndingDate}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Department</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                name="department"
                                value={state.department}
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? onChangeHandler(e)
                                    : () => {}
                                }
                                disabled={showTallisTabPane !== "draft"}
                                id="department"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Position </label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                name="position"
                                value={state.position}
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? onChangeHandler(e)
                                    : () => {}
                                }
                                disabled={showTallisTabPane !== "draft"}
                                id="position"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Email</label>
                            <div className="modal_input">
                              <input
                                disabled
                                type="text"
                                className="disable_bg disable_border"
                                value={state.email}
                                name="email"
                                id="email"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Approver Group</label>
                            <Select
                              className=" "
                              className={
                                showTallisTabPane !== "draft"
                                  ? "disable_bg disable_border"
                                  : "width-selector"
                              }
                              value={{
                                label: state.approverGroup,
                                value: state.approverGroup,
                              }}
                              classNamePrefix="custon_select-selector-inner"
                              options={periodOption()}
                              onChange={(e) =>
                                showTallisTabPane === "draft"
                                  ? handleChangeType(e)
                                  : () => {}
                              }
                              isDisabled={showTallisTabPane !== "draft"}
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
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>State Tax Flag</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                name="stateTaxFlag"
                                value={state.stateTaxFlag}
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? onChangeHandler(e)
                                    : () => {}
                                }
                                disabled={showTallisTabPane !== "draft"}
                                id="stateTaxFlag"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Group</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className={
                                  showTallisTabPane !== "draft"
                                    ? "disable_bg disable_border"
                                    : "form-control"
                                }
                                value={state.group}
                                onChange={(e) =>
                                  showTallisTabPane === "draft"
                                    ? onChangeHandler(e)
                                    : () => {}
                                }
                                disabled={showTallisTabPane !== "draft"}
                                name="group"
                                id="group"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Current Approver</label>
                            <div className="modal_input">
                              <input
                                disabled
                                type="text"
                                value={state.currentApprover}
                                name="currentApprover"
                                className="disable_bg disable_border"
                                id="currentApprover"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Approved</label>
                            <div className="modal_input">
                              <input
                                disabled
                                type="text"
                                className="disable_bg disable_border"
                                value={state.approved}
                                name="approved"
                                id="approved"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Batch Desc</label>
                            <div className="modal_input">
                              <input
                                disabled
                                type="text"
                                name="batchDesc"
                                value={state.batchDesc}
                                className="disable_bg disable_border"
                                id="usr"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label>Tran#</label>
                            <div className="modal_input">
                              <input
                                value={state.tran}
                                disabled
                                name="tran"
                                type="text"
                                className="disable_bg disable_border"
                                id="tran"
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

      <EmployeeLookup
        refreshEmployees={props.refreshEmployees}
        openEmployeeLookupModal={state.openEmployeeLookupModal}
        employeeList={state.employeeList}
        employeeName={state.employeeName}
        employeeCode={state.employeeCode}
        updateParentState={updateParentState}
        closeModal={() =>
          setState((prev) => ({ ...prev, openEmployeeLookupModal: false }))
        }
      />
    </>
  );
};

export default TimeCardMoreDetail;
