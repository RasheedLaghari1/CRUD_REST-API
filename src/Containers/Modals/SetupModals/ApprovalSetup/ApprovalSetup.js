import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "./ApprovalSetup.css";

import { userAvatar, _customStyles } from "../../../../Constants/Constants";
export default function ApprovalSetup(props) {
  let {
    advancedList,
    showHiddenRows,
    amountFrom,
    amountTo,
    approverName,
    changeDollar,
    changeOrders,
    changePercent,
    flags,
    range,
    sequence,
    signaturePosition,
    userLogin,
    approverOptions,
    openApprovalSetupModal,
  } = props.state;
  range = range || "";
  changeOrders = changeOrders || "";
  let handleFieldChange = props.handleFieldChange;

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openApprovalSetupModal}
        onHide={() => props.closeModal("openApprovalSetupModal")}
        className="modal__setting mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="setting_form_main p-0">
                    <div className="setting_header thead_bg">
                      <h3 className="approvalSetup-poup_heading">
                        Approval Setup
                      </h3>
                      <div className="Indirecttaxcode-poup_can-sav-btn">
                        <button
                          onClick={props.addEditApprover}
                          className="btn can-btn1"
                        >
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={() =>
                            props.closeModal("openApprovalSetupModal")
                          }
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
                    <div className="Indirecttaxcode-poup_body p-0 user-setup-modal-inner">
                      <div className="approval_setup_form">
                        <h1>Approver details</h1>
                        <div className="row">
                          <div className="col-md-6">
                            {/* <div className='input_left'> */}
                            <div className="form-group custon_select form__select--wrapper">
                              <label className="font--label-wrapper">
                                Approval Name
                              </label>
                              <Select
                                // isDisabled
                                className="width-selector new-react-select"
                                value={approverName}
                                options={approverOptions}
                                onChange={props.handleChangeApproverName}
                                autoFocus={true}
                                styles={_customStyles}
                                classNamePrefix="react-select"
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
                            {/* </div> */}
                          </div>

                          <div className="col-md-6">
                            {/* <div className='input_right'> */}
                            <div className="focus_input_field input__field--wraper3">
                              <input
                                className="input__wraperh30"
                                type="text"
                                name="userLogin"
                                id="userLogin"
                                value={userLogin}
                                disabled
                              />
                              <label
                                htmlFor="userLogin"
                                className="user__label-wraper"
                              >
                                User Login
                              </label>
                            </div>
                            {/* </div> */}
                          </div>
                        </div>
                        <div className="tracking_code_checks approval-setup-check-div">
                          <ul>
                            {["All", "Above", "Between"].map((c, i) => {
                              return (
                                <li>
                                  <div className="custom-radio">
                                    {c}:
                                    <label
                                      className="check_main remember_check"
                                      htmlFor={c}
                                    >
                                      <input
                                        type="radio"
                                        id={c}
                                        name="range"
                                        value={c}
                                        checked={
                                          range.toLowerCase() ===
                                          c.toLowerCase()
                                        }
                                        className="custom-control-input"
                                        onChange={handleFieldChange}
                                      />
                                      <span className="click_checkmark"></span>
                                    </label>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="row">
                          <div className="col-md-12">
                            <div>
                              {(range.toLowerCase() === "above" ||
                                range.toLowerCase() === "between") && (
                                <div className="input_left">
                                  <div className="focus_input_field">
                                    <input
                                      type="number"
                                      name="amountFrom"
                                      id="amountFrom"
                                      placeholder="Amount From"
                                      defaultValue={amountFrom}
                                      onBlur={handleFieldChange}
                                    />
                                    <label htmlFor="amountFrom">
                                      Amount From
                                    </label>
                                  </div>
                                </div>
                              )}
                              {range.toLowerCase() === "between" && (
                                <div className="input_right">
                                  <div className="focus_input_field">
                                    <input
                                      type="number"
                                      name="amountTo"
                                      id="amountTo"
                                      placeholder="Amount To"
                                      defaultValue={amountTo}
                                      onBlur={handleFieldChange}
                                    />
                                    <label htmlFor="amountTo">Amount To</label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-12"></div>
                        </div>
                        <div className="input_left">
                          <div className="focus_input_field">
                            <input
                              type="number"
                              name="sequence"
                              id="sequence"
                              placeholder="Sequence"
                              defaultValue={sequence}
                              onBlur={handleFieldChange}
                            />
                            <label htmlFor="sequence">Sequence</label>
                          </div>
                        </div>
                        <div className="input_right">
                          <div className="focus_input_field">
                            <input
                              type="number"
                              name="signaturePosition"
                              id="signaturePosition"
                              placeholder="Signature Position"
                              defaultValue={signaturePosition}
                              onBlur={handleFieldChange}
                            />
                            <label htmlFor="signaturePosition">
                              Signature Position
                            </label>
                          </div>
                        </div>

                        <h1>Change Orders</h1>
                        <div className="custom-radio track_code_admin_check font__tweleve">
                          All:
                          <label
                            className="check_main remember_check ml-2"
                            htmlFor="changeOrders"
                          >
                            <input
                              type="checkbox"
                              id="changeOrders"
                              name="changeOrders"
                              value={changeOrders}
                              checked={
                                changeOrders.toLowerCase() === "y"
                                  ? true
                                  : false
                              }
                              onChange={handleFieldChange}
                              className="custom-control-input"
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="input_left">
                          <div className="focus_input_field">
                            <input
                              type="number"
                              name="changeDollar"
                              id="changeDollar"
                              placeholder="Change Dollar"
                              defaultValue={changeDollar}
                              onBlur={handleFieldChange}
                            />
                            <label htmlFor="changeDollar">Change Dollar</label>
                          </div>
                        </div>
                        <div className="input_right">
                          <div className="focus_input_field">
                            <input
                              type="number"
                              name="changePercent"
                              id="changePercent"
                              placeholder="Change Percent"
                              defaultValue={changePercent}
                              onBlur={handleFieldChange}
                            />
                            <label htmlFor="changePercent">
                              Change Percent
                            </label>
                          </div>
                        </div>
                        <h1>Tracking Fields</h1>
                        <div className="approval_setup_popup__table1">
                          <table
                            className="table table-responsive"
                            id="approvalsetupModal"
                            width="100%"
                          >
                            <thead className="thead_bg hover-border">
                              <tr>
                                <th scope="col">
                                  <div className="custom-radio">
                                    {/* <label
                                      className='check_main remember_check'
                                      htmlFor='sa'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='sa'
                                        name='example1'
                                      />
                                      <span className='click_checkmark global_checkmark'></span>
                                    </label> */}
                                  </div>
                                </th>
                                <th className="text-left" scope="col">
                                  <span className="user_setup_hed">
                                    Tracking Fields
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">value</span>
                                </th>
                                <th className="table__inner--th">
                                  <span className="user_setup_hed2">
                                    {" "}
                                    <img
                                      src="./images/user-setup/bars.png"
                                      alt="bars"
                                    />
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {flags.map((f, i) => {
                                return (
                                  <tr>
                                    <td>
                                      <div className="custom-radio">
                                        {/* <label
                                          className='check_main remember_check'
                                          htmlFor='za'
                                        >
                                          <input
                                            type='checkbox'
                                            className='custom-control-input'
                                            id='za'
                                            name='example1'
                                          />
                                          <span className='click_checkmark'></span>
                                        </label> */}
                                      </div>
                                    </td>
                                    <td className="text-left font__inner--wrapper">
                                      {f.type}
                                    </td>
                                    <td className="font__inner--wrapper">
                                      <span className="">
                                        <input
                                          className="values_custom border-0 approval__input--wrapper"
                                          name={f.type}
                                          defaultValue={f.value}
                                          onBlur={(e) =>
                                            handleFieldChange(e, "flags")
                                          }
                                        />
                                      </span>
                                    </td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="approval_setup_popup__table">
                          <h1>Advanced</h1>
                          <table
                            className="table table-responsive"
                            id="approvalSetupdtAdvancedList"
                            width="100%"
                          >
                            <thead className="thead_bg hover-border">
                              <tr>
                                <th scope="col"> </th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    Category
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    description
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">value</span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">hide</span>
                                </th>
                                <th className="table__inner--th">
                                  <div className="dropdown">
                                    <button
                                      aria-haspopup="true"
                                      aria-expanded="true"
                                      id=""
                                      type="button"
                                      className="dropdown-toggle btn dept-tbl-menu"
                                      data-toggle="dropdown"
                                    >
                                      <span className="fa fa-bars "></span>
                                    </button>
                                    <div className="dropdown-menu dept-menu-list  dropdown-menu-right">
                                      <div className="pr-0 dropdown-item">
                                        <div className="form-group remember_check mm_check4">
                                          <input
                                            type="checkbox"
                                            id="showHiddenRows"
                                            name="showHiddenRows"
                                            checked={showHiddenRows}
                                            onClick={props.handleShowHiddenRows}
                                          />
                                          <label
                                            htmlFor="showHiddenRows"
                                            className="mr-0"
                                          >
                                            Show Hidden Rows
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {advancedList.map((list, i) => {
                                return (
                                  <tr key={i}>
                                    <td> </td>
                                    <td className=" ">{list.category}</td>
                                    <td>{list.description}</td>

                                    {list.valueType === "List" ? (
                                      <td className="pt-0 pb-0 text-left">
                                        <Select
                                          classNamePrefix="custon_select-selector-inner"
                                          value={{
                                            label: list.value,
                                            value: list.value,
                                          }}
                                          options={list.valueOptions}
                                          onChange={(obj) =>
                                            props.handleValueOptions(
                                              "list",
                                              obj,
                                              list,
                                              i
                                            )
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
                                      </td>
                                    ) : list.valueType === "Date" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <DatePicker
                                            selected={Number(list.value)}
                                            dateFormat="d MMM yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                              props.handleValueOptions(
                                                "date",
                                                date,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : list.valueType === "Check" ? (
                                      <td>
                                        <div className="col-auto p-0">
                                          <div className="form-group remember_check text-center pt-0 float-left">
                                            <input
                                              type="checkbox"
                                              id={`chk${i}`}
                                              checked={
                                                list.value === "Y" ||
                                                list.value === "1"
                                                  ? true
                                                  : false
                                              }
                                              onChange={(e) =>
                                                props.handleValueOptions(
                                                  "checkbox",
                                                  e,
                                                  list,
                                                  i
                                                )
                                              }
                                            />
                                            <label htmlFor={`chk${i}`}></label>
                                          </div>
                                        </div>
                                      </td>
                                    ) : list.valueType === "Numeric" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <input
                                            type="number"
                                            defaultValue={list.value}
                                            onBlur={(e) =>
                                              props.handleValueOptions(
                                                "number",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : list.valueType === "Text" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <input
                                            type="text"
                                            defaultValue={list.value}
                                            onBlur={(e) =>
                                              props.handleValueOptions(
                                                "text",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : (
                                      <td>{list.value}</td>
                                    )}
                                    <td>
                                      <div className="custom-radio">
                                        <label
                                          className="check_main remember_check"
                                          htmlFor={`hideUnhideRows${i}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name={"hideUnhideRows"}
                                            id={`hideUnhideRows${i}`}
                                            checked={false}
                                            onChange={(e) =>
                                              props.handleHideUnhideRows(list)
                                            }
                                          />

                                          {/* <span className='click_checkmark'></span> */}
                                          <span
                                            className={
                                              list.hide
                                                ? "dash_checkmark bg_clr"
                                                : "dash_checkmark"
                                            }
                                          ></span>
                                        </label>
                                      </div>
                                    </td>
                                    <td></td>
                                  </tr>
                                );
                              })}
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
}
