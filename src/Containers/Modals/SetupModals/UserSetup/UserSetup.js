import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./UserSetup.css";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import $ from "jquery";
import "../../../Setup/SetupSASS/setupStyle.scss";

import Departments from "../../Departments/Departments";

import { _customStyles } from "../../../../Constants/Constants";

class UserSetupModal extends Component {
  constructor() {
    super();
    this.state = {
      openDepartmentModal: false,
    };
  }
  componentDidMount() {}
  openModal = (name) => {
    this.setState({ [name]: true });
    this.props.setInitials();
    // this.props.sortDepartments(false);
  };
  closeModal = async (name) => {
    this.setState({ [name]: false });
    this.props.setInitials();
  };

  render() {
    let {
      openUserSetupModal,
      userTypeOptions,
      userName,
      userLogin,
      emailAddress,
      initials,
      department,
      clndDepartmentOptions,
      countryCode,
      mobileNumber,
      advancedList,
      countryCodesList,
      userType,
      showHiddenRows,
      formErrors,
    } = this.props.state;
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={openUserSetupModal}
          onHide={() => this.props.closeModal("openUserSetupModal")}
          className="modal__user_setup mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid p-0">
              <div className="main_wrapper">
                <div className="row d-flex h-100 p-0">
                  <div className="col-12 justify-content-center align-self-center">
                    <div className="setting_form_main p-0">
                      <div className="setting_header thead_bg thead_bg_sass">
                        <h3 className="Indirecttaxcode-poup_heading">
                          User setup
                        </h3>
                        <div className="Indirecttaxcode-poup_can-sav-btn">
                          <button
                            onClick={this.props.addEditUser}
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
                              this.props.closeModal("openUserSetupModal")
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
                            <img
                              src="images/user-setup/dots-h.png"
                              alt="dots"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="user_type_checks">
                        <p>User Type:</p>
                        <ul>
                          {userTypeOptions.map((t, i) => {
                            return (
                              <li key={i}>
                                <div className="custom-radio">
                                  {t.userType}:
                                  <label
                                    className="check_main check_main_sass remember_check"
                                    htmlFor={`userType${i}`}
                                  >
                                    <input
                                      type="radio"
                                      id={`userType${i}`}
                                      name={t.userType}
                                      checked={t.userType === userType}
                                      onChange={(e) =>
                                        this.props.handleChangeField(
                                          e,
                                          "userType"
                                        )
                                      }
                                      className="custom-control-input"
                                    />
                                    <span className="click_checkmark click_checkmark_sass"></span>
                                  </label>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="user_setup-poup_body user-setup-modal-inner">
                        <div className="row w-100">
                          <div className="col-md-6">
                            <div className="focus_input_field">
                              <input
                                type="text"
                                name="userName"
                                defaultValue={userName}
                                onBlur={this.props.handleChangeField}
                                id="usernam"
                                placeholder="User Name"
                              />
                              <label htmlFor="usernam">User Name</label>
                            </div>
                            <div className="text-danger error-12  user-required-field">
                              {formErrors.userName !== ""
                                ? formErrors.userName
                                : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="focus_input_field">
                              <input
                                type="text"
                                name="userLogin"
                                defaultValue={userLogin}
                                onBlur={this.props.handleChangeField}
                                id="userlog"
                                placeholder="User Login"
                              />
                              <label htmlFor="userlog">User Login</label>
                            </div>
                            <div className="text-danger error-12 user-required-field">
                              {formErrors.userLogin !== ""
                                ? formErrors.userLogin
                                : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="focus_input_field">
                              <input
                                type="text"
                                name="emailAddress"
                                defaultValue={emailAddress}
                                onBlur={this.props.handleChangeField}
                                id="mail"
                                placeholder="Email Address"
                              />
                              <label htmlFor="mail">Email Address</label>
                            </div>
                            <div className="text-danger error-12 user-required-field">
                              {formErrors.emailAddress !== ""
                                ? formErrors.emailAddress
                                : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="focus_input_field">
                              <input
                                type="text"
                                name="initials"
                                defaultValue={initials}
                                onBlur={this.props.handleChangeField}
                                id="init"
                                placeholder="Intials"
                              />
                              <label htmlFor="init">Intials</label>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="user-setup-position">
                              <div className="focus_input_field">
                                <span
                                  onClick={() =>
                                    this.openModal("openDepartmentModal")
                                  }
                                  className="search_dep"
                                >
                                  <img
                                    src="./images/user-setup/search-light.png"
                                    alt="search"
                                  ></img>
                                </span>
                                <input
                                  type="text"
                                  className="focus_dep"
                                  name="department"
                                  value={department}
                                  autoComplete={false}
                                  id="depart4"
                                  placeholder="Department"
                                  onChange={this.props.handleChangeField}
                                  onBlur={() => {
                                    setTimeout(() => {
                                      $(".setup-focus-dropdown").hide();
                                    }, 200);
                                  }}
                                />
                                <label htmlFor="depart4">Department</label>
                              </div>
                              <div className="setup-focus-dropdown">
                                {clndDepartmentOptions.length > 0 ? (
                                  <ul>
                                    {clndDepartmentOptions.map((d, i) => {
                                      return (
                                        <li
                                          classname="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.props.selectDepartment(d)
                                          }
                                        >
                                          <h3>
                                            <span> {d.name} </span>
                                            {/* <span className="right_desc">
                                                  {d.des}
                                                </span> */}
                                          </h3>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <div className="sup_nt_fnd text-center">
                                    <h6>No Department Found</h6>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6"></div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Country Code</label>
                              <Select
                                className="width-selector user_setup_popup_select"
                                classNamePrefix="custon_select-selector-inner"
                                value={countryCode}
                                options={countryCodesList}
                                onChange={this.props.handleCountryCode}
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
                          <div className="col-md-6">
                            <div className="focus_input_field">
                              <input
                                type="text"
                                name="mobileNumber"
                                defaultValue={mobileNumber}
                                onBlur={this.props.handleChangeField}
                                id="mobn"
                                placeholder="Mobile Number"
                              />
                              <label htmlFor="mobn">Mobile Number</label>
                            </div>
                          </div>
                        </div>
                        <div className="user_setup_popup__table">
                          <h2>Advanced</h2>
                          <table
                            className="table"
                            width="100%"
                            id="usersteup-modal"
                          >
                            <thead className="thead_bg thead_bg_sass hover-border">
                              <tr>
                                <th scope="col"> </th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    Category
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    Description
                                  </span>
                                </th>
                                <th
                                  scope="col"
                                  className="value__field--wrapperuser"
                                >
                                  <span className="user_setup_hed">value</span>
                                </th>
                                <th
                                  scope="col"
                                  className="text__right__contentuser"
                                >
                                  <span className="user_setup_hed">hide</span>
                                </th>
                                <th className="table__inner--th">
                                  {/* <span  className='user_setup_hed2'>
                                    {' '}
                                    <img
                                      src='./images/user-setup/bars.png'
                                      alt='bars'
                                    />
                                  </span> */}
                                  <div className="menu_bars_dropdown">
                                    <Dropdown
                                      alignRight="false"
                                      drop="up"
                                      className="analysis-card-dropdwn "
                                    >
                                      <Dropdown.Toggle variant="" id="">
                                        <span className="fa fa-bars "></span>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          to="#/action-1"
                                          className=""
                                        >
                                          <div
                                            className="pr-0"
                                            onClick={
                                              this.props.handleShowHiddenRows
                                            }
                                          >
                                            <div className="form-group remember_check form-group_sass remember_check_sass mm_check4">
                                              <input
                                                type="checkbox"
                                                id="showHiddenRows"
                                                name="showHiddenRows"
                                                checked={showHiddenRows}
                                                onClick={
                                                  this.props
                                                    .handleShowHiddenRows
                                                }
                                              />
                                              <label
                                                htmlFor="showHiddenRows"
                                                className="mr-0"
                                              >
                                                Show Hidden Rows
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {advancedList.map((list, i) => {
                                return (
                                  <tr key={i}>
                                    <td></td>
                                    <td className=" ">{list.category}</td>
                                    <td>{list.description}</td>
                                    {list.valueType === "List" ? (
                                      <td className="pt-0 pb-0 text-left">
                                        <Select
                                          classNamePrefix="custon_select-selector-inner main__dropdown--wrapper1"
                                          // className={
                                          //   i == 0
                                          //     ? "width-selector only--one input_width2"
                                          //     : i == 1
                                          //     ? "width-selector only--one input_width2"
                                          //     : "width-selector input_width"
                                          // }
                                          styles={_customStyles}
                                          value={{
                                            label: list.value,
                                            value: list.value,
                                          }}
                                          options={list.valueOptions}
                                          onChange={(obj) =>
                                            this.props.handleValueOptions(
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
                                    ) : list.valueType === "MultiList" ? (
                                      <td className="pt-0 pb-0 text-left">
                                        <Select
                                          className="basic-multi-select main__dropdown--wrapper1"
                                          name="multiple-op"
                                          // classNamePrefix="custon_select-selector-inner"
                                          defaultValue={{
                                            label: "Select Approval Group",
                                            value: "",
                                          }}
                                          value={list.multiValue || []}
                                          options={list.valueOptions}
                                          isClearable={false}
                                          onChange={(obj) =>
                                            this.props.handleValueOptions(
                                              "multiList",
                                              obj,
                                              list,
                                              i
                                            )
                                          }
                                          isMulti
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
                                              this.props.handleValueOptions(
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
                                          <div className="form-group remember_check form-group_sass remember_check_sass text-center pt-0 float-left">
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
                                                this.props.handleValueOptions(
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
                                            value={list.value}
                                            onChange={(e) =>
                                              this.props.handleValueOptions(
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
                                            value={list.value}
                                            onChange={(e) =>
                                              this.props.handleValueOptions(
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
                                    <td className="text__right--user">
                                      <div className="custom-radio">
                                        <label
                                          className="check_main check_main_sass remember_check"
                                          htmlFor={`hideUnhideRows${i}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name={"hideUnhideRows"}
                                            id={`hideUnhideRows${i}`}
                                            checked={false}
                                            onChange={(e) =>
                                              this.props.handleHideUnhideRows(
                                                list
                                              )
                                            }
                                          />

                                          {/* <span className='click_checkmark'></span> */}
                                          <span
                                            // className={
                                            //   list.hide
                                            //     ? "dash_checkmark bg_clr"
                                            //     : "dash_checkmark"
                                            // }

                                            className={
                                              list.hide
                                                ? "dash_checkmark bg_clr bg_clr_sass"
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
          </Modal.Body>
        </Modal>

        <Departments
          openDepartmentModal={this.state.openDepartmentModal}
          closeModal={this.closeModal}
          clndDepartmentOptions={clndDepartmentOptions}
          onSearch={this.props.onSearch}
          sortDepartments={this.props.sortDepartments}
          handleShowSelected={this.props.handleShowSelected}
          handleCheckbox={this.props.handleCheckbox}
        />
      </>
    );
  }
}

export default UserSetupModal;
