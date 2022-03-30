import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./UserSetup.css";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import UserSetupModal from "../../Modals/SetupModals/UserSetup/UserSetup";
import UserAccessModal from "../../Modals/SetupModals/UserAccessCurrencies/UserAccessCurrencies";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from "../Filter/Filter";
import countryList from "country-list";
import "../SetupSASS/setupStyle.scss";
import backgroundPic from "../../../Assets/images/user_setup_bg.png";
import {
  handleValidation,
  handleWholeValidation,
} from "../../../Utils/Validation";
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows,
} from "../../../Utils/Helpers";

import {
  getUsersList,
  getUserSetup,
  updateUser,
  primeUser,
  insertUser,
  deleteUser,
  getAdvancedList,
  sendInvite,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../../Actions/UserActions/UserActions";
const uuidv1 = require("uuid/v1");

class UserSetup extends Component {
  constructor() {
    super();
    this.state = {
      columns: [], //column headings
      userList: [], //users lists
      userTypeOptions: [], //users types
      userType: "",
      userName: "", //users user name
      userLogin: "", //users user login
      emailAddress: "", //users email address
      initials: "", //users department
      department: "", //users department
      departmentOptions: [],
      clndDepartmentOptions: [], //a copy of clndDepartmentOptions
      countryCode: { label: "Select Country Code", value: "" }, //users country code
      mobileNumber: "", //users mobile number
      advancedList: [], //users advanced list
      clonedAdvancedList: [], //copy of users advanced list
      countryCodesList: [], //country codes
      showHiddenRows: false,
      pageLength: 10,
      openSettingsModal: false,
      openUserSetupModal: false,
      openUserAccessModal: false,
      addEditUserCheck: "", //to check either user is going to add or update
      formErrors: {
        userName: "",
        userLogin: "",
        emailAddress: "",
      },
      backgroundImg: "",
    };
  }
  async componentDidMount() {
    await this.setState({
      themeColor: this.props.user.setting.Color || "",
      backgroundImg: this.props.user.setting.uploadBackgroundImage || "",
    });

    const root = document.documentElement;
    root.style.setProperty("--user-setup-bg-color", this.state.themeColor);
    root.style.setProperty("--background-Image", this.state.backgroundImg);

    //show/hide filter card jquery
    this.getUsersList();
    filterBox("example2");

    //getting country codes list
    let countryLists = countryList.getData();
    let ctryList = [];
    countryLists.map((cl, i) => {
      return ctryList.push({
        label: cl.name + " (" + cl.code + ")",
        value: cl.code,
      });
    });

    var collator = new Intl.Collator(undefined, {
      sensitivity: "base",
    });

    ctryList.sort(function (a, b) {
      return collator.compare(a.label, b.label);
    });

    this.setState({ countryCodesList: ctryList });
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
    this.setState({ [name]: true }, () => {
      if (name === "openUserSetupModal") {
        this.userSetupTableSetting();
      }
      if (name === "openUserAccessModal") {
        $("#access_modal").DataTable({
          dom: "Rlfrtip",
          language: {
            searchPlaceholder: "Search",
          },
          colReorder: false,
        });
      }
    });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
    this.clearStates();
  };
  clearStates = () => {
    this.setState({
      userType: "",
      userTypeOptions: [], //users types
      userName: "", //users user name
      userLogin: "", //users user login
      emailAddress: "", //users email address
      initials: "", //users department
      department: "", //users department
      departmentOptions: [],
      clndDepartmentOptions: [], //a copy of clndDepartmentOptions
      countryCode: { label: "Select Country Code", value: "" }, //users country code
      mobileNumber: "", //users mobile number
      advancedList: [], //users advanced list
      showHiddenRows: false,
      clonedAdvancedList: [], //copy of users advanced list
      openSettingsModal: false,
      openUserSetupModal: false,
      openUserAccessModal: false,
      addEditUserCheck: "", //to check either user is going to add or update

      formErrors: {
        userName: "",
        userLogin: "",
        emailAddress: "",
      },
    });
  };
  //user setup popup
  userSetupTableSetting = () => {
    window.$("#usersteup-modal").DataTable({
      dom: "Rlfrtip",
      // stateSave: true,
      // stateSaveCallback: function (settings, data) {
      //   localStorage.setItem('DataTables_usersteup-modal', JSON.stringify(data))
      // },
      // stateLoadCallback: function (settings) {
      //   return JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance))
      // },
      language: {
        searchPlaceholder: "Search",
      },
      searching: false,
      paging: false,
      info: false,
      columnDefs: [
        {
          targets: -1,
          orderable: false,
        },
      ],
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  };
  //main user list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];

    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    columns.map((c) => aoColumns.push({ sName: c.name }));
    aoColumns[columns.length + 1] = { sName: "menues" };

    let result = tableSetting(columns, aoColumns, "example2");
    this.setState({ ...result });
  };
  //get users list
  getUsersList = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getUsersList();
    //success case of get users list
    if (this.props.user.getUsersListSuccess) {
      // toast.success(this.props.user.getUsersListSuccess);
      let getUsersList =
        JSON.parse(JSON.stringify(this.props.user.getUsersList)) || "";
      let columns = getUsersList.columns || [];
      let userList = getUsersList.userList || [];
      this.setState(
        {
          columns,
          userList,
        },
        () => this.tableSetting()
      );
    }
    //error case of get users list
    if (this.props.user.getUsersListError) {
      handleAPIErr(this.props.user.getUsersListError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };
  //get User Setup
  getUserSetup = async (e, user) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }

    this.setState({
      isLoading: true,
    });
    await this.props.getUserSetup(user.userLogin);

    //success case of get user setup
    if (this.props.user.getUserSetupSuccess) {
      // toast.success(this.props.user.getUserSetupSuccess);
      let getUserSetup =
        JSON.parse(JSON.stringify(this.props.user.getUserSetup)) || "";

      let userTypeOptions =
        (getUserSetup.userSetup && getUserSetup.userSetup.userTypeOptions) ||
        [];
      let userType =
        (getUserSetup.userSetup && getUserSetup.userSetup.userType) || "";
      let userName =
        (getUserSetup.userSetup && getUserSetup.userSetup.userName) || "";
      let userLogin =
        (getUserSetup.userSetup && getUserSetup.userSetup.userLogin) || "";
      let emailAddress =
        (getUserSetup.userSetup && getUserSetup.userSetup.emailAddress) || "";
      let initials =
        (getUserSetup.userSetup && getUserSetup.userSetup.initials) || "";
      let department =
        (getUserSetup.userSetup && getUserSetup.userSetup.department) || "";
      let departmentOptions =
        (getUserSetup.userSetup && getUserSetup.userSetup.departmentOptions) ||
        [];
      let countryCode =
        (getUserSetup.userSetup && getUserSetup.userSetup.countryCode) || "";
      let mobileNumber =
        (getUserSetup.userSetup && getUserSetup.userSetup.mobileNumber) || "";
      let advancedList = getUserSetup.advancedList || [];

      //advanced list
      advancedList.map((lst, i) => {
        if (lst.valueType && lst.valueType.toLowerCase() === "list") {
          let valOptns = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({ label: o.option, value: o.option });
            });
          }
          lst.valueOptions = valOptns;
        } else if (
          lst.valueType &&
          lst.valueType.toLowerCase() === "multilist"
        ) {
          let valOptns = [];
          let multiValue = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({
                value: o.option,
                label: o.option,
                selected: o.selected,
              });
              if (o.selected === "Y") {
                multiValue.push({
                  value: o.option,
                  label: o.option,
                  selected: "Y",
                });
              }
            });
          }
          lst.multiValue = multiValue;
          lst.valueOptions = valOptns;
        }
        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });

      //get advanced list data from the local storage to hide/unhide rows for all users
      let userAdvancedList = JSON.parse(
        localStorage.getItem("userAdvancedList") || "[]"
      );
      if (userAdvancedList && userAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          userAdvancedList.map((loc, i) => {
            if (
              al.category === loc.category &&
              al.description === loc.description &&
              al.valueType === loc.valueType
            ) {
              al.hide = true;
            }
          });
        });
      }
      let filtrdList = advancedList.filter((l) => !l.hide);
      //converting country code into obj then pass to Select
      let countryLists = countryList.getData();
      let ctryObj = "";
      ctryObj = countryLists.find(
        (c) => c.code.toLowerCase() == countryCode.toLowerCase()
      );
      if (ctryObj) {
        ctryObj = {
          label: ctryObj.name + " (" + ctryObj.code + ")",
          value: ctryObj.code,
        };
      } else {
        ctryObj = { label: "Select Country Code", value: "" };
      }

      //departmentOptions
      departmentOptions.map((d, i) => {
        if (d.name === department) {
          d.checked = true;
        } else {
          d.checked = false;
        }
      });
      this.setState(
        {
          userTypeOptions,
          userType,
          userName,
          userLogin,
          emailAddress,
          initials,
          department,
          departmentOptions,
          clndDepartmentOptions: departmentOptions,
          countryCode: ctryObj,
          mobileNumber,
          advancedList: filtrdList,
          clonedAdvancedList: advancedList,
          addEditUserCheck: "update",
        },
        () => {
          this.openModal("openUserSetupModal");
        }
      );
    }
    //error case of get user setup
    if (this.props.user.getUserSetupError) {
      handleAPIErr(this.props.user.getUserSetupError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };
  //----Departments popup-------
  //when clicks on search button
  onSearch = (depSearch) => {
    let { departmentOptions } = this.state;
    if (depSearch) {
      let _dep = [];
      _dep = departmentOptions.filter((d) => {
        return d.name.toUpperCase().includes(depSearch.toUpperCase());
      });
      this.setState({ clndDepartmentOptions: _dep });
    } else {
      this.setState({ clndDepartmentOptions: departmentOptions });
    }
  };
  //when click on departments to sort data accordingly
  sortDepartments = (toggleDepartment) => {
    let sortedDepts = [];
    let depList = this.state.clndDepartmentOptions;
    if (toggleDepartment) {
      sortedDepts = depList.sort(function (a, b) {
        let nameA = a.name.toString().toUpperCase();
        let nameB = b.name.toString().toUpperCase();
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
    } else {
      sortedDepts = depList.sort(function (a, b) {
        let nameA = a.name.toString().toUpperCase();
        let nameB = b.name.toString().toUpperCase();
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
    }
    this.setState({
      clndDepartmentOptions: sortedDepts,
    });
  };
  handleShowSelected = (checked) => {
    let { departmentOptions } = this.state;
    let clndDepartmentOptions = [];
    if (checked) {
      let showSelected = [];
      showSelected = this.state.departmentOptions.filter((c) => {
        return c.checked;
      });
      clndDepartmentOptions = showSelected;
    } else {
      clndDepartmentOptions = departmentOptions;
    }
    this.setState({ clndDepartmentOptions });
  };
  handleCheckbox = (checked, dept) => {
    let { clndDepartmentOptions } = this.state;
    let department = "";
    clndDepartmentOptions.map((d, i) => {
      if (d.name === dept.name) {
        d.checked = checked;
        if (checked) {
          department = dept.name;
        }
      } else {
        d.checked = false;
      }
    });
    this.setState({ clndDepartmentOptions, department });
  };
  //setting departments initials vals when close popup
  setInitials = () => {
    let { departmentOptions } = this.state;
    this.setState({ clndDepartmentOptions: departmentOptions });
  };
  //suggestion box selecting department
  selectDepartment = (dept) => {
    let { departmentOptions } = this.state;
    let department = "";
    departmentOptions.map((d, i) => {
      if (d.name === dept.name) {
        d.checked = true;
        department = dept.name;
      } else {
        d.checked = false;
      }
    });
    this.setState({ departmentOptions, department });
  };
  //----------END-----------
  handleChangeType = (e) => {
    let name = e.target.name;
  };
  handleChangeField = (e, check) => {
    const { name, value } = e.target;

    let { formErrors, departmentOptions, addEditUserCheck } = this.state;
    let clndDepartmentOptions = departmentOptions;
    if (check === "userType") {
      this.setState({ userType: name }, () => {
        this.getAdvancedList();
      });
    } else if (name === "department") {
      $(".setup-focus-dropdown").show();
      if (value) {
        let _dep = [];
        _dep = departmentOptions.filter((d) => {
          return d.name.toUpperCase().includes(value.toUpperCase());
        });
        clndDepartmentOptions = _dep;
      } else {
        clndDepartmentOptions = departmentOptions;
      }
      this.setState({ [name]: value, clndDepartmentOptions });
    } else {
      this.setState({ [name]: value });
    }

    formErrors = handleValidation(name, value, formErrors);
    this.setState({ formErrors });
  };
  handleCountryCode = (countryCode) => {
    this.setState({ countryCode });
  };
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value });
    } else {
      let { columns } = this.state;
      columns[i].hide = e.target.checked;
      this.setState({ columns });
    }
  };
  handleSaveSettings = () => {
    let { columns, pageLength } = this.state;
    handleSaveSettings(columns, "example2", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "example2");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  //handle Advanced list
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(
      type,
      val,
      item,
      index,
      advancedList,
      clonedAdvancedList
    );
    this.setState(result);
  };
  handleShowHiddenRows = async () => {
    let table = window.$("#usersteup-modal").DataTable();
    table.destroy();
    this.setState(
      (state) => ({
        showHiddenRows: !state["showHiddenRows"],
      }),
      () => {
        let { showHiddenRows } = this.state;
        if (showHiddenRows) {
          //show hidden rows
          let clonedAdvancedList = this.state.clonedAdvancedList;
          this.setState({ advancedList: clonedAdvancedList }, () => {
            this.userSetupTableSetting();
          });
        } else {
          //hide again hidden rows
          let advancedList = this.state.advancedList;
          let list = advancedList.filter((l) => !l.hide);
          this.setState({ advancedList: list }, () => {
            this.userSetupTableSetting();
          });
        }
      }
    );
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {
    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#usersteup-modal",
      "userAdvancedList",
      advancedList,
      clonedAdvancedList,
      showHiddenRows
    );

    let _advancedList = result.advancedList;
    let _clonedAdvancedList = result.clonedAdvancedList;
    let _showHiddenRows = result.showHiddenRows;

    this.setState(
      {
        advancedList: _advancedList,
        clonedAdvancedList: _clonedAdvancedList,
        showHiddenRows: _showHiddenRows,
      },
      () => {
        this.userSetupTableSetting();
      }
    );
  };
  //priming user
  primeUser = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.primeUser();

    //success case of prime user
    if (this.props.user.primeUserSuccess) {
      // toast.success(this.props.user.primeUserSuccess);
      let primeUser =
        JSON.parse(JSON.stringify(this.props.user.primeUser)) || "";

      let userTypeOptions =
        (primeUser.userSetup && primeUser.userSetup.userTypeOptions) || [];
      let userType =
        (primeUser.userSetup && primeUser.userSetup.userType) || "";
      let userName =
        (primeUser.userSetup && primeUser.userSetup.userName) || "";
      let userLogin =
        (primeUser.userSetup && primeUser.userSetup.userLogin) || "";
      let emailAddress =
        (primeUser.userSetup && primeUser.userSetup.emailAddress) || "";
      let initials =
        (primeUser.userSetup && primeUser.userSetup.initials) || "";
      let department =
        (primeUser.userSetup && primeUser.userSetup.department) || "";
      let departmentOptions =
        (primeUser.userSetup && primeUser.userSetup.departmentOptions) || [];
      let countryCode =
        (primeUser.userSetup && primeUser.userSetup.countryCode) || "";
      let mobileNumber =
        (primeUser.userSetup && primeUser.userSetup.mobileNumber) || "";
      let advancedList = primeUser.advancedList || [];

      //advanced list
      advancedList.map((lst, i) => {
        if (lst.valueType && lst.valueType.toLowerCase() === "list") {
          let valOptns = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({ label: o.option, value: o.option });
            });
          }
          lst.valueOptions = valOptns;
        } else if (
          lst.valueType &&
          lst.valueType.toLowerCase() === "multilist"
        ) {
          let valOptns = [];
          let multiValue = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({
                value: o.option,
                label: o.option,
                selected: o.selected,
              });
              if (o.selected === "Y") {
                multiValue.push({
                  value: o.option,
                  label: o.option,
                  selected: "Y",
                });
              }
            });
          }
          lst.multiValue = multiValue;
          lst.valueOptions = valOptns;
        }
        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });

      //converting country code into obj then pass to Select
      let countryLists = countryList.getData();
      let ctryObj = "";
      ctryObj = countryLists.find(
        (c) => c.code.toLowerCase() == countryCode.toLowerCase()
      );
      if (ctryObj) {
        ctryObj = {
          label: ctryObj.name + " (" + ctryObj.code + ")",
          value: ctryObj.code,
        };
      } else {
        ctryObj = { label: "Select Country Code", value: "" };
      }

      //departmentOptions
      departmentOptions.map((d, i) => {
        if (d.name === department) {
          d.checked = true;
        } else {
          d.checked = false;
        }
      });
      this.setState(
        {
          userTypeOptions,
          userType,
          userName,
          userLogin,
          emailAddress,
          initials,
          department,
          departmentOptions,
          clndDepartmentOptions: departmentOptions,
          countryCode: ctryObj,
          mobileNumber,
          advancedList,
          clonedAdvancedList: advancedList,
          addEditUserCheck: "add",
        },
        () => {
          this.openModal("openUserSetupModal");
          this.getAdvancedList();
        }
      );
    }
    //error case of prime user
    if (this.props.user.primeUserError) {
      handleAPIErr(this.props.user.primeUserError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };
  //get advanced list
  getAdvancedList = async () => {
    /*
    GetAdvancedList - To be called when the usertype is changed when editing. 
    Updates the advanced records based on the user type.
    */
    this.setState({
      isLoading: true,
    });
    let { userType, userLogin } = this.state;
    await this.props.getAdvancedList(userType, userLogin);

    //success case of get advanced list
    if (this.props.user.getAdvancedListSuccess) {
      toast.success(this.props.user.getAdvancedListSuccess);
      let table = window.$("#usersteup-modal").DataTable();
      table.destroy();

      let advancedList =
        JSON.parse(JSON.stringify(this.props.user.getAdvancedList)) || [];

      //advanced list
      advancedList.map((lst, i) => {
        if (lst.valueType && lst.valueType.toLowerCase() === "list") {
          let valOptns = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({ value: o.selected, label: o.option });
            });
          }
          lst.valueOptions = valOptns;
        } else if (
          lst.valueType &&
          lst.valueType.toLowerCase() === "multilist"
        ) {
          let valOptns = [];
          let multiValue = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({
                value: o.option,
                label: o.option,
                selected: o.selected,
              });
              if (o.selected === "Y") {
                multiValue.push({
                  value: o.option,
                  label: o.option,
                  selected: "Y",
                });
              }
            });
          }
          lst.multiValue = multiValue;
          lst.valueOptions = valOptns;
        }
        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });

      //get advanced list data from the local storage to show hidden rows for all users
      let userAdvancedList = JSON.parse(
        localStorage.getItem("userAdvancedList") || "[]"
      );
      if (userAdvancedList && userAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          userAdvancedList.map((loc, i) => {
            if (
              al.category === loc.category &&
              al.description === loc.description &&
              al.valueType === loc.valueType
            ) {
              al.hide = true;
            }
          });
        });
      }

      this.setState(
        {
          advancedList,
          clonedAdvancedList: advancedList,
        },
        () => {
          this.userSetupTableSetting();
        }
      );
    }
    //error case of get advanced list
    if (this.props.user.getAdvancedListError) {
      handleAPIErr(this.props.user.getAdvancedListError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };
  //handle user list check box
  handleUserListCheckbox = (e, user) => {
    if (e.target.checked) {
      this.setState({ userLogin: user.userLogin });
    } else {
      this.setState({ userLogin: "" });
    }
  };
  //delete user
  deleteUser = async () => {
    this.setState({
      isLoading: true,
    });

    let { userLogin, userList } = this.state;

    if (userLogin) {
      await this.props.deleteUser(userLogin);
    } else {
      toast.error("userLogin is missing!");
    }

    //success case of delete user
    if (this.props.user.deleteUserSuccess) {
      // toast.success(this.props.user.deleteUserSuccess);

      let table = window.$("#example2").DataTable();

      let index = userList.findIndex((ul) => ul.userLogin === userLogin);

      let filtersList = userList.filter((u) => u.userLogin != userLogin);
      userList = filtersList;
      this.setState(
        {
          userList,
          userLogin: "",
        },
        () => {
          table.row(index).remove().draw(false); //also update table
        }
      );
    }

    //error case of delete user
    if (this.props.user.deleteUserError) {
      handleAPIErr(this.props.user.deleteUserError, this.props);
    }
    this.props.clearUserStates();
    this.setState({
      isLoading: false,
    });
  };
  //updating user
  updateUser = async () => {
    let {
      userType,
      userName,
      userLogin,
      emailAddress,
      initials,
      department,
      countryCode,
      mobileNumber,
      advancedList,
      clonedAdvancedList,
      userList,
      formErrors,
    } = this.state;

    clonedAdvancedList.map((lst, i) => {
      let _valueOptions = lst.valueOptions || [];
      if (lst.valueType === "MultiList") {
        _valueOptions = [];
        lst.valueOptions.map((valOp) => {
          let found = lst.multiValue.find((f) => f.label === valOp.label);
          if (found) {
            valOp.selected = "Y";
            _valueOptions.push({
              option: valOp.label,
              selected: "Y",
            });
          } else {
            _valueOptions.push({
              option: valOp.label,
              selected: "N",
            });
          }
        });
      }
      lst.valueOptions = _valueOptions;
    });

    let data = {
      userSetup: {
        userType,
        userName,
        userLogin,
        emailAddress,
        initials,
        department,
        countryCode: countryCode.value,
        mobileNumber,
        advancedList: clonedAdvancedList,
      },
    };
    formErrors = handleWholeValidation(
      { userName, userLogin, emailAddress },
      formErrors
    );

    if (!userType) {
      toast.error("Please select user type.");
    } else if (
      !formErrors.userName &&
      !formErrors.userLogin &&
      !formErrors.emailAddress
    ) {
      this.setState({ isLoading: true });
      await this.props.updateUser(data);

      if (this.props.user.updateUserSuccess) {
        // toast.success(this.props.user.updateUserSuccess)

        //also update the table
        let found = userList.findIndex((ul) => ul.userLogin === userLogin);
        if (found != -1) {
          let table = window.$("#example2").DataTable();

          let updatedUser = {
            userType,
            userName,
            userLogin,
            status: "",
            department,
          };
          userList[found] = updatedUser;

          this.setState(
            {
              userList: [...userList],
            },
            () => {
              table.row(found).invalidate("dom").draw(false);
              this.closeModal("openUserSetupModal");
            }
          );
        }
      }
      //error case of get user setup
      if (this.props.user.updateUserError) {
        handleAPIErr(this.props.user.updateUserError, this.props);
      }
      this.props.clearUserStates();
    }
    this.setState({ formErrors, isLoading: false });
  };
  //insert/add user
  insertUser = async () => {
    let {
      userList,
      userType,
      userName,
      userLogin,
      emailAddress,
      initials,
      department,
      countryCode,
      mobileNumber,
      advancedList,
      clonedAdvancedList,
      formErrors,
    } = this.state;

    clonedAdvancedList.map((lst, i) => {
      let _valueOptions = lst.valueOptions || [];
      if (lst.valueType === "MultiList") {
        _valueOptions = [];
        lst.valueOptions.map((valOp) => {
          let found = lst.multiValue.find((f) => f.label === valOp.label);
          if (found) {
            valOp.selected = "Y";
            _valueOptions.push({
              option: valOp.label,
              selected: "Y",
            });
          } else {
            _valueOptions.push({
              option: valOp.label,
              selected: "N",
            });
          }
        });
      }
      lst.valueOptions = _valueOptions;
    });
    let data = {
      userSetup: {
        userType,
        userName,
        userLogin,
        emailAddress,
        initials,
        department,
        countryCode: countryCode.value,
        mobileNumber,
        advancedList: clonedAdvancedList,
      },
    };
    formErrors = handleWholeValidation(
      { userName, userLogin, emailAddress },
      formErrors
    );

    if (!userType) {
      toast.error("Please select user type.");
    } else if (
      !formErrors.userName &&
      !formErrors.userLogin &&
      !formErrors.emailAddress
    ) {
      this.setState({ isLoading: true });
      await this.props.insertUser(data);

      if (this.props.user.insertUserSuccess) {
        toast.success(this.props.user.insertUserSuccess);

        //also add user to list to show updated users list
        // let user = {
        //   department,
        //   emailAddress,
        //   status: '',
        //   userLogin,
        //   userName,
        //   userType
        // }

        // let table = window.$("#example2").DataTable()
        // table.destroy()

        // let list = [...userList, user]
        // this.setState({
        // userList: list,
        // }, () => {
        // this.tableSetting()
        window.location.reload();

        // this.closeModal('openUserSetupModal')
        // })
      }
      //error case of get user setup
      if (this.props.user.insertUserError) {
        handleAPIErr(this.props.user.insertUserError, this.props);
      }
      this.props.clearUserStates();
    }
    this.setState({ formErrors, isLoading: false });
  };
  //check whether add or update user
  addEditUser = () => {
    let { addEditUserCheck } = this.state;

    if (addEditUserCheck === "add") {
      //add user case
      this.insertUser();
    } else {
      //update user case
      this.updateUser();
    }
  };
  //send invite
  sendInvite = async () => {
    this.setState({
      isLoading: true,
    });

    let { userLogin } = this.state;

    if (userLogin) {
      await this.props.sendInvite(userLogin);
    } else {
      toast.error("userLogin is missing!");
    }

    //success case of send invite
    if (this.props.user.sendInviteSuccess) {
      toast.success(this.props.user.sendInviteSuccess);
    }

    //error case of send invite
    if (this.props.user.sendInviteError) {
      handleAPIErr(this.props.user.sendInviteError, this.props);
    }
    this.props.clearUserStates();
    this.setState({
      isLoading: false,
      userLogin: "",
    });
  };
  render() {
    let { themeColor } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div
          style={{ backgroundImage: "url(" + this.state.backgroundImg + ")" }}
          className="user_setup_main"
        >
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
              <h2>user Setup</h2>
              <span>
                <img
                  onClick={() => this.openModal("openUserAccessModal")}
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
                    <p className="user_setup_play_video  user_setup_play_video_sass">
                      Video
                    </p>
                  </li>
                  <li>
                    <p className="user_setup_play_tuturial user_setup_play_tuturial_sass">
                      Tutorials
                    </p>
                  </li>
                </ul>
                <span
                  // className="user_setup_play_icon"
                  // style={{ backgroundColor: themeColor }}
                  className="user_setup_play_icon user_setup_play_icon_svg_sass"
                  // style={{
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "center",
                  //   fill: "var(--user-setup-bg-color)",
                  // }}
                >
                  {/* <img
                    src="./images/user-setup/play.png"
                    alt="play"
                    className="img-fluid"
                  /> */}
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24px"
                    height="24px"
                    viewBox="0 0 490.661 490.661"
                  >
                    <g>
                      <g>
                        <path
                          d="M453.352,236.091L48.019,1.424c-3.285-1.899-7.36-1.899-10.688,0c-3.285,1.899-5.333,5.419-5.333,9.237v469.333
			c0,3.819,2.048,7.339,5.333,9.237c1.643,0.939,3.499,1.429,5.333,1.429c1.856,0,3.691-0.469,5.355-1.429l405.333-234.667
			c3.285-1.92,5.312-5.44,5.312-9.237S456.637,237.989,453.352,236.091z"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
              </div>
              <div className="user_setup_header_rightbox">
                <p>
                  In our{" "}
                  <span>
                    <a href="#" className="video_hlepArtical_sass">
                      Video
                    </a>
                  </span>{" "}
                  learn how to use user setup Read our{" "}
                  <span>
                    <a href="#" className="video_hlepArtical_sass">
                      help article
                    </a>
                  </span>{" "}
                  to learn More
                </p>
              </div>
              <span
                className="round_plus close_top_sec round_plus_sass"
                style={{
                  display: "flex",
                  width: "22px",
                  height: "22px",
                  alignItems: "center",

                  // background: "var(--user-setup-bg-color)",
                  borderRadius: "50%",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 0 24 24"
                  width="16px"
                  fill="white"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </span>
              {/* <span>
                <img
                  className="close_top_sec"
                  src="images/user-setup/cross.png"
                  alt="cross"
                ></img>
              </span> */}
            </div>
          </header>
          <div className="col-sm-12 table_white_box table_white_box_sass">
            {/* Filter */}

            <Filter />

            {/* End Filter */}
            <div className="user_setup_plus_Icons">
              <ul>
                <li>
                  <button
                    onClick={this.primeUser}
                    className="btn user_setup_rbtns"
                    type="button"
                  >
                    {/* <span className="round_plus">
                      <i
                        className="fa fa-plus-circle"
                        aria-hidden="true"
                        style={{ color: themeColor }}
                      ></i>
                    </span> */}

                    <span
                      className="round_plus"
                      style={{
                        display: "flex",
                        width: "22px",
                        height: "22px",
                        alignItems: "center",

                        background: "var(--user-setup-bg-color)",
                        borderRadius: "50%",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        style={{ fill: "white" }}
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="14px"
                        height="14px"
                        viewBox="0 0 349.03 349.031"
                      >
                        <g>
                          <path
                            d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
		                          c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
		                          h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
		                          C344.97,132.147,349.03,136.213,349.03,141.226z"
                          />
                        </g>
                      </svg>
                      {/* <i
                        className="fa fa-plus-circle round_plus_btn round_plus_btn_sass"
                        aria-hidden="true"
                      ></i> */}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={this.deleteUser}
                    className="btn user_setup_rbtns"
                    type="button"
                  >
                    {/* <span className="round_file">
                      {" "}
                      <img
                        src="./images/user-setup/delete.png"
                        alt="filter"
                      ></img>
                    </span> */}
                    <span
                      className="round_file"
                      style={{
                        display: "flex",
                        width: "22px",
                        height: "22px",

                        alignItems: "center",

                        background: "var(--user-setup-bg-color)",
                        borderRadius: "50%",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        style={{ fill: "white" }}
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="14px"
                        height="14px"
                        viewBox="0 0 384 384"
                        // style="enable-background:new 0 0 384 384;"
                      >
                        <g>
                          <g>
                            <g>
                              <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                              <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                            </g>
                          </g>
                        </g>
                      </svg>
                      {/* <img
                        src="./images/user-setup/delete.png"
                        alt="filter"
                      ></img> */}
                    </span>
                  </button>
                </li>
                <li>
                  <div>
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn setting_popup_dots"
                    >
                      <Dropdown.Toggle variant="sucess" id="dropdown-basic">
                        {/* <span className="dots_img">
                          <img
                            src="./images/user-setup/dots.png"
                            alt="filter"
                          ></img>
                        </span> */}
                        <span
                          className="dots_img"
                          style={{
                            display: "flex",
                          }}
                        >
                          {/* <MoreOutlined /> */}
                          {/* <img
                            src="./images/user-setup/dots.png"
                            alt="filter"
                          ></img> */}

                          <svg
                            // style={{ fill: "var(--user-setup-bg-color)" }}
                            className="dots_img_sass"
                            id="Capa_1"
                            enable-background="new 0 0 515.555 515.555"
                            height="20"
                            viewBox="0 0 515.555 515.555"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                            <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                            <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                          </svg>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={this.sendInvite}>
                          Send Invite
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </li>
              </ul>
            </div>
            {/* new tale add start */}
            <body>
              <table
                id="example2"
                className=" user_setup_table user_setup_table_sass"
                width="100%"
              >
                <thead style={{ backgroundColor: themeColor }}>
                  <tr>
                    <th>
                      <div className="custom-radio">
                        <label
                          className="check_main check_main_sass remember_check"
                          htmlFor="customRadio1109"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customRadio1109"
                            name="example1"
                          />
                          <span className="click_checkmark click_checkmark_sass global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    {this.state.columns.map((c, i) => {
                      return (
                        <>
                          {
                            <th key={i}>
                              <span className="user_setup_hed">{c.name}</span>
                            </th>
                          }
                        </>
                      );
                    })}
                    <th>
                      <span
                        className="user_setup_hed2"
                        onClick={() => this.openModal("openSettingsModal")}
                      >
                        {" "}
                        <img
                          src="./images/user-setup/bars.png"
                          alt="bars"
                        ></img>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.userList.map((u, i) => {
                    return (
                      <tr
                        key={u.userLogin}
                        onClick={(e) => this.getUserSetup(e, u)}
                        className="cursorPointer"
                      >
                        <td>
                          <div className="custom-radio">
                            <label
                              className="check_main check_main_sass remember_check"
                              htmlFor={`listCheck${i}`}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${i}`}
                                name={"userListCheck"}
                                checked={u.userLogin === this.state.userLogin}
                                onChange={(e) =>
                                  this.handleUserListCheckbox(e, u)
                                }
                              />
                              <span className="click_checkmark click_checkmark_sass"></span>
                            </label>
                          </div>
                        </td>
                        {this.state.columns.map((c, i) => {
                          return <td>{u[c.field]}</td>;
                        })}
                        <td
                        // className="u-setup-td-edit cursorPointer"
                        // onClick={() => this.getUserSetup(u)}
                        >
                          {/* <img
                            src="images/user-setup/pencill.png"
                            alt="pencill"
                          ></img> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </body>
            {/* end new table */}
          </div>
        </div>
        <Settings
          themeColor={this.state.themeColor}
          openSettingsModal={this.state.openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={this.state.columns}
          pageLength={this.state.pageLength}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={this.handleSaveSettings}
          handleCloseSettingModal={this.handleCloseSettingModal}
        />
        <UserSetupModal
          themeColor={this.state.themeColor}
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChangeType={this.handleChangeType}
          handleChangeField={this.handleChangeField}
          handleCountryCode={this.handleCountryCode}
          onSearch={this.onSearch}
          sortDepartments={this.sortDepartments}
          handleShowSelected={this.handleShowSelected}
          handleCheckbox={this.handleCheckbox}
          setInitials={this.setInitials}
          updateUser={this.updateUser}
          handleValueOptions={this.handleValueOptions}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleShowHiddenRows={this.handleShowHiddenRows}
          selectDepartment={this.selectDepartment}
          addEditUser={this.addEditUser} //Add OR Update user based on addEditUserCheck
        />
        <UserAccessModal
          openUserAccessModal={this.state.openUserAccessModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  getUsersList,
  getUserSetup,
  updateUser,
  primeUser,
  insertUser,
  deleteUser,
  getAdvancedList,
  sendInvite,
  clearUserStates,
  clearStatesAfterLogout,
})(UserSetup);
