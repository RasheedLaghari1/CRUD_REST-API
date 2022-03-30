import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import Filter from '../Filter/Filter'
import "./UserDefaults.css";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import TopNav from "../../Common/TopNav/TopNav";

import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows
} from '../../../Utils/Helpers'

import {
  getUserDefaults,
  updateUserDefaults,
  clearUserStates
} from "../../../Actions/UserActions/UserActions";

const uuidv1 = require("uuid/v1");

class UserDefaults extends Component {
  constructor() {
    super();
    this.state = {
      columns: [
        { name: 'Category', hide: false },
        { name: 'Description', hide: false },
        { name: 'Prompt', hide: false },
        { name: 'Value', hide: false },
        { name: 'Hide', hide: false },
      ],
      userDefaults: [], //user defaults list
      clonedUserDefaults: [], //copy of users defaults list
      showHiddenRows: false,
      pageLength: 10,
      openSettingsModal: false,
    }
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('userdefaults')
    this.getUserDefaults()
  }
  componentWillMount() {
    $(function () {
      "use strict";
      (function () {
        $(".setup_menu").on("click", function () {
          var id = $(this).attr("data-target");
          if (id === "#top_nav_toggle1") {
            $(`${id}`).toggleClass("show");
          }
        });

        $(".dash_menu_toggle.top--nav").on("click", function () {
          $(".setup_menu").click();
        });
      })();
    });
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  //main user defaults list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: 'checkbox' }
    aoColumns[1] = { sName: 'Category' }
    aoColumns[2] = { sName: 'Description' }
    aoColumns[3] = { sName: 'Prompt' }
    aoColumns[4] = { sName: 'Value' }
    aoColumns[5] = { sName: 'Hide' }
    aoColumns[6] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'userdefaults')
    this.setState({ ...result })
  }
  //get user defaults
  getUserDefaults = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.getUserDefaults();
    //success case of get user defaults
    if (this.props.user.getUserDefaultsSuccess) {
      // toast.success(this.props.user.getUserDefaultsSuccess);
      let getUserDefaults =
        (JSON.parse(JSON.stringify(this.props.user.getUserDefaults))) ||
        [];
      let userDefaults = (getUserDefaults) || [];


      //restructure the list to show in drop-down
      userDefaults.map((lst, i) => {
        if (lst.type && lst.type.toLowerCase() === "list") {
          let valOptns = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({ label: o.option, value: o.option });
            });
          }
          lst.valueOptions = valOptns;
        }

        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });


      //get advanced list data from the local storage to hide/unhide rows for all users
      let userDefaultsList = JSON.parse(
        localStorage.getItem("userDefaultsList") || "[]"
      );
      if (userDefaultsList && userDefaultsList.length > 0) {
        userDefaults.map((al, i) => {
          userDefaultsList.map((lst, i) => {
            if (
              al.category === lst.category &&
              al.description === lst.description &&
              al.prompt === lst.prompt
            ) {
              al.hide = true;
            }
          });
        });
      }
      let filtrdList = userDefaults.filter((l) => !l.hide);

      this.setState({
        userDefaults: filtrdList,
        clonedUserDefaults: userDefaults
      }, () => this.tableSetting())

    }
    //error case of get user defaults
    if (this.props.user.getUserDefaultsError) {
      handleAPIErr(this.props.user.getUserDefaultsError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  }
  //Settings Popup
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value })
    } else {
      let { columns } = this.state
      columns[i].hide = e.target.checked
      this.setState({ columns })
    }
  }
  handleSaveSettings = () => {
    let { columns, pageLength } = this.state;
    handleSaveSettings(columns, 'userdefaults', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'userdefaults')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  //handle values
  handleValueOptions = async (type, val, item, index) => {
    let { userDefaults } = this.state;
    let result = handleValueOptions(type, val, item, index, userDefaults, [])

    this.setState({ result }, () => {
      if (type === "checkbox" || type === "list" || type === "date") {
        this.updateUserDefaults(index)
      }
    });
  };

  //updating user defaults
  updateUserDefaults = async (index) => {
    let { userDefaults } = this.state
    //also update the DOM table cache
    let table = window.$("#userdefaults").DataTable()
    table
      .row(index)
      .invalidate('dom')
      .draw();

    await this.props.updateUserDefaults(userDefaults)

    //success case of update user defaults
    if (this.props.user.updateUserDefaultsSuccess) {
      // toast.success(this.props.user.updateUserDefaultsSuccess);
    }
    //error case of update user defaults
    if (this.props.user.updateUserDefaultsError) {
      handleAPIErr(this.props.user.updateUserDefaultsError, this.props);
    }
    this.props.clearUserStates();
  }
  handleHideUnhideRows = async (item) => {

    let { userDefaults, clonedUserDefaults, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#userdefaults",
      "userDefaultsList",
      userDefaults,
      clonedUserDefaults,
      showHiddenRows
    )

    let _userDefaults = result.advancedList
    let _clonedUserDefaults = result.clonedAdvancedList
    let _showHiddenRows = result.showHiddenRows

    this.setState({
      userDefaults: _userDefaults,
      clonedUserDefaults: _clonedUserDefaults,
      showHiddenRows: _showHiddenRows
    }, () => {
      this.tableSetting()
    });

  };
  handleShowHiddenRows = async () => {
    let { userDefaults, clonedUserDefaults } = this.state;
    let table = window.$("#userdefaults").DataTable()
    table.colReorder.reset(); //to reset colreorder
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        userDefaults = clonedUserDefaults
      } else {
        //hide again hidden rows
        let list = userDefaults.filter((l) => !l.hide);
        userDefaults = list
      }
      this.setState({ userDefaults }, () => {
        this.tableSetting()
      });
    });
  };
  render() {
    let { userDefaults, showHiddenRows } = this.state;

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="user_setup_main">
          <header>
            <TopNav />
            <div className="user_setup_heading">
              <div className="header_menu">
                <Link to="/dashboard">
                  <img
                    src="images/dash-logo.png"
                    className="img-fluid"
                    alt="logo"
                  />
                </Link>
                <Link
                  className="setup_menu"
                  to="#"
                  data-target="#top_nav_toggle1"
                >
                  <img src="images/top-menu.png" className="" alt="top-menu" />
                </Link>
              </div>
              <h2>user defaults</h2>
              <span>
                <img
                  src="./images/user-setup/lock.png"
                  alt="lock"
                  className="img-fluid"
                />
              </span>
            </div>
            <div className="user_setup_headerbox">
              <div className="user_setup_play_div">
                <ul>
                  <li>
                    <p className="user_setup_play_video">Video</p>
                  </li>
                  <li>
                    <p className="user_setup_play_tuturial">Tutorials</p>
                  </li>
                </ul>
                <span className="user_setup_play_icon">
                  <img
                    src="./images/user-setup/play.png"
                    alt="play"
                    className="img-fluid"
                  />
                </span>
              </div>
              <div className="user_setup_header_rightbox">
                <p>
                  In our{" "}
                  <span>
                    <a href="#">Video</a>
                  </span>{" "}
                  learn how to use user defaults Read our{" "}
                  <span>
                    <a href="#">help article</a>
                  </span>{" "}
                  to learn More
                </p>
              </div>
              <span>
                <img
                  className="close_top_sec"
                  src="images/user-setup/cross.png"
                  alt="cross"
                ></img>
              </span>
            </div>
          </header>
          <div className="col-sm-12 table_white_box main_table_box">
            {/* Filter */}
            <div className="user-setup-position">
              <Filter />
            </div>
            {/* End Filter */}
            <div className="user_setup_plus_Icons">
              <ul>
                <li>
                  <div>
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn setting_popup_dots"
                    >
                      <Dropdown.Toggle variant="sucess" id="dropdown-basic">
                        <span className="dots_img">
                          <img
                            src="./images/user-setup/dots.png"
                            alt="filter"
                          ></img>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => this.openModal("openSettingsModal")}
                        >
                          <img
                            src="./images/user-setup/setting-icon.png"
                            alt="seting"
                          ></img>{" "}
                          &nbsp;Settings
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </li>
              </ul>
            </div>
            {/* new tale add start */}
            <body>
              <table id="userdefaults" className=" user_setup_table" width="100%">
                <thead>
                  <tr>
                    <th>
                      <div className="custom-radio">
                        <label
                          className="check_main remember_check"
                          htmlFor="customRadio1109"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customRadio1109"
                            name="example1"
                          />
                          <span className="click_checkmark global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className="user_setup_hed">Category</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Prompt</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Value</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Hide</span>
                    </th>
                    <th className='table__inner--th'>
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
                                  this.handleShowHiddenRows
                                }
                              >
                                <div className="form-group remember_check mm_check4">
                                  <input
                                    type="checkbox"
                                    id="showHiddenRows"
                                    name="showHiddenRows"
                                    checked={
                                      showHiddenRows
                                    }
                                    onClick={
                                      this
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
                  {
                    userDefaults.map((ud, ind) => {
                      return <tr>
                        <td>
                          <div className="custom-radio">
                            <label className="check_main remember_check" htmlFor="td1">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="td1"
                                name="example1"
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{ud.category}</td>
                        <td>{ud.description}</td>
                        <td>{ud.prompt}</td>
                        {ud.type === "List" ? (
                          <td
                            data-sort={ud.value}
                            data-search={ud.value}
                            className="pt-0 pb-0 text-left"
                          >
                            <Select
                              className="width-selector user_default_select"
                              classNamePrefix="custon_select-selector-inner"
                              value={{
                                label: ud.value,
                                value: ud.value,
                              }}
                              options={ud.valueOptions}
                              onChange={(obj) =>
                                this.handleValueOptions(
                                  "list",
                                  obj,
                                  ud,
                                  ind
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
                        ) : ud.type === "Date" ? (
                          <td
                            data-sort={ud.value}
                            data-search={ud.value}
                          >
                            <div className="table_input_field wd-200">
                              <DatePicker
                                selected={Number(ud.value)}
                                dateFormat="d MMM yyyy"
                                autoComplete="off"
                                onChange={(date) =>
                                  this.handleValueOptions(
                                    "date",
                                    date,
                                    ud,
                                    ind
                                  )
                                }
                              />
                            </div>
                          </td>
                        ) : ud.type === "Check" ? (
                          <td>
                            <div className="col-auto p-0">
                              <div className="form-group remember_check text-center pt-0 float-left">
                                <input
                                  type="checkbox"
                                  id={`chk${ind}`}
                                  checked={
                                    ud.value === "Y" ||
                                      ud.value === "1"
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    this.handleValueOptions(
                                      "checkbox",
                                      e,
                                      ud,
                                      ind
                                    )
                                  }
                                />
                                <label htmlFor={`chk${ind}`}></label>
                              </div>
                            </div>
                          </td>
                        ) : ud.type === "Number" ? (
                          <td
                            data-sort={ud.value}
                            data-search={ud.value}
                          >
                            <div className="table_input_field">
                              <input
                                type="number"
                                className="wd-200"
                                value={ud.value}
                                onChange={(e) =>
                                  this.handleValueOptions(
                                    "number",
                                    e,
                                    ud,
                                    ind
                                  )
                                }
                                onBlur={() => this.updateUserDefaults(ind)}
                              />
                            </div>
                          </td>
                        ) : ud.type === "Text" ? (
                          <td
                            data-sort={ud.value}
                            data-search={ud.value}
                          >
                            <div className="table_input_field">
                              <input
                                type="text"
                                className="wd-200"
                                value={ud.value}
                                onChange={(e) =>
                                  this.handleValueOptions(
                                    "text",
                                    e,
                                    ud,
                                    ind
                                  )
                                }
                                onBlur={() => this.updateUserDefaults(ind)}
                              />
                            </div>
                          </td>
                        ) : (
                          <td>{ud.value}</td>
                        )}

                        <td>
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={`hideUnhideRows${ind}`}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                name={"hideUnhideRows"}
                                id={`hideUnhideRows${ind}`}
                                checked={false}
                                onChange={(e) =>
                                  this.handleHideUnhideRows(
                                    ud
                                  )
                                }
                              />
                              <span
                                className={
                                  ud.hide
                                    ? "dash_checkmark bg_clr"
                                    : "dash_checkmark"
                                }
                              ></span>
                            </label>
                          </div>
                        </td>
                        <td></td>
                      </tr>

                    })
                  }
                </tbody>

              </table>
            </body>
            {/* end new table */}
          </div>
        </div>

        <Settings
          openSettingsModal={this.state.openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={this.state.columns}
          pageLength={this.state.pageLength}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={this.handleSaveSettings}
          handleCloseSettingModal={this.handleCloseSettingModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});
export default connect(mapStateToProps, {
  getUserDefaults,
  updateUserDefaults,
  clearUserStates
})(UserDefaults);
