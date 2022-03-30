import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./InsertChartAccount.css";
import ChartSort from "../../../Modals/ChartSort/ChartSort";
import ChartCode from "../../../Modals/ChartCode/ChartCode";

export default function Departments(props) {
  let {
    InsertChartModal,
    openChartSortModal,
    openChartCodeModal,
    chartSort,
    chartCode,
    clonedChartCodesList,
    showSuggestion,
    description,
    post,
    level,
    secLevel,
    format,
    type,
    active,
    initBalance,
    extChart,
    user,
    formErrors,
    accountSortCode
  } = props.state;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={InsertChartModal}
        onHide={() => props.closeModal("InsertChartModal")}
        className="modal__departments mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="setting_form_main p-0">
                    <div className="departments_header thead_bg">
                      <h3 className="departments-poup_heading">
                        Chart of Accounts
                      </h3>
                      <div className="departments-poup_can-sav-btn">
                        <button
                          onClick={props.handleAddEdit}
                          className="btn can-btn1"
                        >
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={() => props.closeModal("InsertChartModal")}
                          className="btn can-btn1 pl-3"
                        >
                          <img
                            src="images/user-setup/cancel-white.png"
                            alt="cancel"
                          />
                          Cancel
                        </button>
                        <button className="btn can-btn1 pl-2">
                          <img src="images/user-setup/dots-h.png" alt="dots" />
                        </button>
                      </div>
                    </div>
                    <div className="departments-poup_body user-setup-modal-inner">
{/*                         
                      <div className="focus_input_field">
                        <span
                          onClick={() => props.openModal("openChartSortModal")}
                          className="search_indirect2"
                        >
                          <img
                            src="./images/user-setup/search-light.png"
                            alt="search"
                          />
                        </span>
                        <input
                          type="text"
                          name="chartSort"
                          id="chartSort"
                          placeholder="chart sort"
                          value={chartSort}
                          onChange={props.handleChangeField}
                        />
                        <label htmlFor="chartSort">Chart Sort</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.chartSort !== "" ? formErrors.chartSort : ""}
                      </div>
                      <div className="focus_input_field">
                        <span
                          onClick={() => props.openModal("openChartCodeModal")}
                          className="search_indirect2"
                        >
                          <img
                            src="./images/user-setup/search-light.png"
                            alt="search"
                          />
                        </span>
                        <input
                          type="text"
                          name="chartCode"
                          id="chartCode"
                          placeholder="chart code"
                          value={chartCode}
                          onChange={props.handleChangeChartCode}
                          onBlur={props.onBlurChartCode}
                        />
                        <label htmlFor="chartCode">Chart Code</label>

                        {showSuggestion && (
                          <div className="department-suggestion">
                            {clonedChartCodesList.length > 0 ? (
                              <ul className="invoice_vender_menu">
                                {clonedChartCodesList.map((c, i) => {
                                  return (
                                    <li
                                      className="cursorPointer"
                                      key={i}
                                      onClick={() => props.changeChartCode(c)}
                                    >
                                      <div className="vender_menu_right chart_new">
                                        <h3 className="chart_vender_text">
                                          <span> {c.code} </span>{" "}
                                          <span className="right_desc">
                                            {" "}
                                            {c.description}
                                          </span>
                                        </h3>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <div className="sup_nt_fnd text-center">
                                <h6>No Chart Code Found</h6>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.chartCode !== "" ? formErrors.chartCode : ""}
                      </div> */}
                          <div className="focus_input_field">
                        <input
                          type="text"
                          name="accountSortCode"
                          id="accountSortCode"
                          placeholder="Sort Code"
                          defaultValue={accountSortCode}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="accountSortCode">Account Sort Code</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.accountSortCode !== "" ? formErrors.accountSortCode : ""}
                      </div>
                      <div className="focus_input_field">
                        <input
                          type="text"
                          name="description"
                          id="description"
                          placeholder="Description"
                          defaultValue={description}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="description">Description</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.description !== "" ? formErrors.description : ""}
                      </div>

                      <div className="d-flex">
                        <div className="col-12 pt-3 pb-3 pl-0 company-detail_check">
                          <div className="custom-radio">
                            POST
                            <label
                              className="check_main remember_check"
                              htmlFor="post"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="post"
                                name="post"
                                value={post}
                                checked={post === "Y"}
                                onChange={(event) =>
                                  props.handleCheckBox(event)
                                }
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                          <div className="custom-radio">
                            ACTIVE
                            <label
                              className="check_main remember_check"
                              htmlFor="active"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="active"
                                name="active"
                                value={active}
                                checked={active === "Y"}
                                onChange={(event) =>
                                  props.handleCheckBox(event)
                                }
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="focus_input_field">
                        <input
                          type="number"
                          name="level"
                          id="level"
                          step="0.1"
                          placeholder="Level"
                          defaultValue={level}
                        
                          onBlur={props.handleChangeField}
                          
                        />
                        <label htmlFor="level">Level</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="number"
                          name="secLevel"
                          id="secLevel"
                          step="0.1"
                          
                          placeholder="Sec Level"
                          defaultValue={secLevel}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="secLevel">Sec Level</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="text"
                          name="format"
                          id="format"
                          placeholder="Format"
                          defaultValue={format}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="format">Format</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="text"
                          name="type"
                          id="type"
                          placeholder="Type"
                          defaultValue={type}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="type">Type</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="number"
                          name="initBalance"
                          id="initBalance"
                          step="0.1"
                          placeholder="Init Balance"
                          defaultValue={initBalance}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="initBalance">Init Balance</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="text"
                          name="extChart"
                          id="extChart"
                          placeholder="Ext Chart"
                          defaultValue={extChart}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="extChart">Ext Chart</label>
                      </div>

                      <div className="focus_input_field">
                        <input
                          type="text"
                          name="user"
                          id="user"
                          placeholder="User"
                          defaultValue={user}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor="user">User</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <ChartSort
        openChartSortModal={openChartSortModal}
        closeModal={props.closeModal}
        chartSorts={props.getChartSorts || ""} //api response (get chart sort)
        defaultChartSort={chartSort} //chart sort that is showing on this modal e.g 'AU.01.000'
        getUpdatedChartSort={props.getUpdatedChartSort} //get updated chart sort to show on this modal
      />
      <ChartCode
        openChartCodeModal={openChartCodeModal}
        closeModal={props.closeModal}
        chartCodes={props.chartCodes || []} //all chart codes
        getUpdatedChartCode={props.getUpdatedChartCode} //get updated chart code to show on this modal
        chartCode={chartCode} //value of chartCode (single value) that is shown in chart code input field
        props={props.props || ""}
        chartSort={chartSort}
      />
    </>
  );
}
