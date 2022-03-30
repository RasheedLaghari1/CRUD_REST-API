import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./ChartOfAccounts.css";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import { toast } from "react-toastify";
import Filter from "../Filter/Filter";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import MultipleChangeModal from "../../Modals/SetupModals/MultipleChange/MultipleChange";
import ChartOfAccountsModal from "../../Modals/SetupModals/ChartOfAccounts/ChartOfAccounts";
import InsertChartModal from "../../Modals/SetupModals/InsertChartAccount/InsertChartAccount";
import Import from "../../Modals/Import/Import";
import * as ChartActions from "../../../Actions/ChartActions/ChartActions";
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  downloadAttachments
} from "../../../Utils/Helpers";
import * as Validation from "../../../Utils/Validation";
import _ from "lodash";
class ChartOfAccounts extends Component {
  constructor() {
    super();
    this.state = {
      openSettingsModal: false,
      openMultipleChangeModal: false,
      openChartOfAccountsModal: false,
      openInsertChartAccountModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openImportModal: false,
      accList: [],
      columns: [],
      pageLength: 10,
      chartAccountID: "",
      accountSortCode: "",
      chartSort: "",
      chartCode: "",
      description: "",
      post: "N",
      level: "",
      secLevel: "",
      format: "",
      type: "",
      active: "N",
      initBalance: 0.0,
      extChart: "",
      user: "",
      formErrors: {
        description: "",
        chartSort: "",
        chartCode: "",
        accountSortCode: "",
        chartSort_CA: "",
      },
      chartCodesList: [],
      showSuggestion: false,
      clonedChartCodesList: [],
      addEditCheck: "",
      checkedList: [],
      checkAll: false,

      chartSort_CA: "",
      includeEFC: "N",
      includeBudget: "N",
      includeFringe: "N",
      overwriteDescription: "N",

      mc_level: "",
      mc_level_flag: "N",
      mc_type: "",
      mc_type_flag: "N",
      mc_post: "",
      mc_post_flag: "N",
      mc_active: "",
      mc_active_flag: "N",
      mc_seclevel: "",
      mc_seclevel_flag: "N",
      mc_fringe: "",
      mc_fringe_flag: "N",
      mc_desc: "",
      mc_desc_flag: "N",
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox("chartofaccounts");
    this.getChartAccounts();
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
  getChartSorts = async () => {
    if (!this.props.chart.getChartSorts) {
      this.setState({ isLoading: true });
      await this.props.getChartSorts();
      //success case of Get Chart Sorts
      if (this.props.chart.getChartSortsSuccess) {
        // toast.success(this.props.chart.getChartSortsSuccess);
      }
      //error case of Get Chart Sorts
      if (this.props.chart.getChartSortsError) {
        handleAPIErr(this.props.chart.getChartSortsError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false });
    }
  };
  getUpdatedChartSort = (chartSort) => {
    this.setState({ chartSort });
  };
  primeAccount = async () => {
    this.setState({ isLoading: true });
    await this.props.primeAccount();
    if (this.props.chart.primeAccountSuccess) {
      let primeAccount =
        JSON.parse(JSON.stringify(this.props.chart.primeAccount)) || "";
      let chartAccountID = primeAccount.chartAccountID || "";
      let description = primeAccount.description || "";
      let accountSortCode = primeAccount.accountSortCode || "";
      let post = primeAccount.post || "N";
      let level = primeAccount.level || "";
      let secLevel = primeAccount.secLevel || "";
      let format = primeAccount.format || "";
      let type = primeAccount.type || "";
      let active = primeAccount.active || "N";
      let initBalance = primeAccount.initBalance || 0.0;
      let extChart = primeAccount.extChart || "";
      let user = primeAccount.user || "";
      this.setState(
        {
          chartAccountID,
          accountSortCode,
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
          addEditCheck: "add",
        },
        () => {
          this.openModal("InsertChartModal");
        }
      );
    }
    if (this.props.chart.primeAccountError) {
      handleAPIErr(this.props.chart.primeAccountError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  addAccount = async () => {
    let {
      chartAccountID,
      accountSortCode,
      chartSort,
      chartCode,
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
    } = this.state;

    // var value=chartSort.concat("."+chartCode);
    let data = {
      chartAccount: {
        chartAccountID,
        accountSortCode,
        description,
        active,
        level,
        secLevel,
        format,
        type,
        post,
        initBalance,
        extChart,
        user,
      },
    };
    formErrors = Validation.handleWholeValidation(
      { description, accountSortCode },
      formErrors
    );
    // this.setState({formErrors})
    if (!formErrors.description && !formErrors.accountSortCode) {
      this.setState({ isLoading: true });
      await this.props.addAccount(data);
      if (this.props.chart.addAccountSuccess) {
        // toast.success("Chart Account Inserted Successfully");
        this.closeModal("InsertChartModal");
        window.location.reload();
      }
      if (this.props.chart.addAccountError) {
        handleAPIErr(this.props.chart.addAccountError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ isLoading: false, formErrors });
  };
  handleAddEdit = () => {
    let { addEditCheck } = this.state;
    if (addEditCheck === "add") {
      this.addAccount();
    } else if (addEditCheck === "update") {
      this.updateAccount();
    }
  };
  openModal = async (name) => {
    if (
      name === "openChartOfAccountsModal" ||
      name == "openMultipleChangeModal"
    ) {
      if (this.state.checkedList.length > 0) {
        this.setState({ [name]: true });
      } else {
        toast.error("Select Chart Account First");
      }
    } else if (name === "openChartSortModal") {
      this.setState({ [name]: true }, () => {
        this.getChartSorts();
      });
    } else {
      this.setState({ [name]: true });
    }
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
    if (name === "InsertChartModal" || name === "openChartOfAccountsModal" || name === "openImportAccountModal" || name === "openMultipleChangeModal") {
      this.clearStates();
    }
  };
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];
    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    columns.map((c) => aoColumns.push({ sName: c.name }));
    aoColumns[columns.length + 1] = { sName: "menus" };

    let result = tableSetting(columns, aoColumns, "chartofaccounts");
    this.setState({ ...result });
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
    handleSaveSettings(columns, "chartofaccounts", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "chartofaccounts");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  getChartAccounts = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getChartAccounts();
    if (this.props.chart.getChartAccountsSuccess) {
      let list = JSON.parse(JSON.stringify(this.props.chart.getChartAccounts));
      list.map((lst) => (lst.checked = false));
      let columns = [];
      //adding the column names
      columns[0] = { name: "Chart of Accounts" };
      columns[1] = { name: "Description" };
      columns[2] = { name: "Post" };
      columns[3] = { name: "Level" };
      columns[4] = { name: "SecLevel" };
      columns[5] = { name: "Format" };
      columns[6] = { name: "Type" };
      columns[7] = { name: "Active" };
      columns[8] = { name: "init Balance" };
      columns[9] = { name: "Ext Chart" };
      columns[10] = { name: "User" };
      this.setState({ accList: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.chart.getChartAccountsError) {
      handleAPIErr(this.props.chart.getChartAccountsError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  handleCheckBox = (e) => {
    let { name, value } = e.target;
    if (value === "Y") {
      this.setState({ [name]: "N" });
    } else {
      this.setState({ [name]: "Y" });
    }
  };
  deleteChartAccount = async () => {
    let { chartAccountID, accList, checkedList } = this.state;
    let filtersList = [];
    let chartAccountIDs = _.map(checkedList, "chartAccountID"); //-> [1,2,3, ...]
    if (checkedList.length > 0) {
      this.setState({ isLoading: true });
      await this.props.deleteChartAccount(chartAccountIDs);

      if (this.props.chart.deleteChartAccountSuccess) {
        toast.success("Chart Account Deleted Successfully");
        let table = window.$("#chartofaccounts").DataTable();
        table.colReorder.reset();
        table.destroy()

        filtersList = _.pullAllBy(accList, checkedList, "chartAccountID");
        accList = filtersList;
        this.setState(
          {
            accList,
            chartAccountID: "",
          },
          () => {
            //update datatable cache after updating accounts state 
            this.tableSetting()
          }
        );
      }
      if (this.props.chart.deleteChartAccountError) {
        handleAPIErr(this.props.chart.deleteChartAccountError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false, checkedList: [] });
    } else {
      toast.error("Please Select Chart Account First!");
    }
  };
  handleChangeField = (e) => {
    const { name, value } = e.target;
    let { formErrors, showSuggestion } = this.state;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };
  getChartCodes = async () => {
    await this.props.getChartCodes();
    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
      let getChartCodes = this.props.chart.getChartCodes || "";
      this.setState({
        chartCodesList: getChartCodes.chartCodes || [],
        clonedChartCodesList: getChartCodes.chartCodes || [],
      });
    }

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
    }
    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }
    this.props.clearChartStates();
  };
  //get new chart code value through chart code modal
  getUpdatedChartCode = (chartCode) => {
    this.setState({ chartCode });
  };
  handleChangeChartCode = async (e) => {
    let value = e.target.value;

    let clonedChartCodesList = [...this.state.chartCodesList];

    if (!value) {
      clonedChartCodesList = [];
    } else {
      let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
        return (
          (c.code.toUpperCase().includes(value.toUpperCase()) ||
            c.description.toUpperCase().includes(value.toUpperCase())) &&
          c.sort.toUpperCase() === this.state.chartSort.toUpperCase()
        );
      });
      clonedChartCodesList = chartCodesListFilterdData;
    }

    this.setState({
      chartCode: value,
      showSuggestion: true,
      clonedChartCodesList,
    });
  };
  //hide chart code suggestion box
  onBlurChartCode = () => {
    let { formErrors, chartCode } = this.state;
    formErrors = Validation.handleValidation("chartCode", chartCode, formErrors);
    this.setState({ formErrors });
    setTimeout(() => {
      this.setState({ showSuggestion: false });
    }, 200);
  };
  //when select code from suggestions -> auto-completion
  changeChartCode = (obj) => {
    let chartCode = obj.code || "";
    this.setState({ chartCode });
  };
  clearStates = () => {
    this.setState({
      chartAccountID: "",
      accountSortCode: "",
      chartSort: "",
      chartCode: "",
      description: "",
      post: "N",
      level: "",
      secLevel: "",
      format: "",
      type: "",
      active: "N",
      initBalance: 0.0,
      extChart: "",
      user: "",
      chartSort_CA: "",
      includeEFC: "N",
      includeBudget: "N",
      includeFringe: "N",
      overwriteDescription: "N",
      formErrors: {
        description: "",
        chartSort: "",
        chartCode: "",
        addEditCheck: "",
      },
    });
  };
  getAccount = async (e, obj) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }
    this.setState({ isLoading: true });
    await this.props.getAccount(obj.chartAccountID);
    if (this.props.chart.getAccountSuccess) {
      let getAccount =
        JSON.parse(JSON.stringify(this.props.chart.getAccount)) || "";
      let chartAccountID = getAccount.chartAccountID || "";
      let description = getAccount.description || "";
      let accountSortCode = getAccount.accountSortCode || "";
      let post = getAccount.post || "N";
      let level = getAccount.level || "";
      let secLevel = getAccount.secLevel || "";
      let format = getAccount.format || "";
      let type = getAccount.type || "";
      let active = getAccount.active || "N";
      let initBalance = getAccount.initBalance || 0.0;
      let extChart = getAccount.extChart || "";
      let user = getAccount.user || "";
      this.setState(
        {
          chartAccountID,
          accountSortCode,
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
          addEditCheck: "update",
        },
        () => {
          this.openModal("InsertChartModal");
        }
      );
    }
    if (this.props.chart.getAccountError) {
      handleAPIErr(this.props.chart.getAccountError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  updateAccount = async () => {
    let {
      chartAccountID,
      accountSortCode,
      // chartSort,
      // chartCode,
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
      accList,
    } = this.state;

    let data = {
      chartAccount: {
        chartAccountID,
        accountSortCode,
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
      },
    };
    formErrors = Validation.handleWholeValidation(
      { description, accountSortCode },
      formErrors
    );
    if (!formErrors.description && !formErrors.accountSortCode) {
      this.setState({
        isLoading: true,
      });
      await this.props.updateAccount(data);

      //success case of update department
      if (this.props.chart.updateAccountSuccess) {
        toast.success(this.props.chart.updateAccountSuccess);
        let found = accList.findIndex(
          (d) => d.chartAccountID === chartAccountID
        );
        if (found != -1) {
          let table = window.$("#chartofaccounts").DataTable();

          accList[found] = data.chartAccount;

          this.setState(
            {
              accList: [...accList],
            },
            () => {
              table.row(found).invalidate("dom").draw(false);
              this.closeModal("InsertChartModal");
            }
          );
        }
      }
      //error case of update department
      if (this.props.chart.updateAccountError) {
        handleAPIErr(this.props.chart.updateAccountError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false });
  };
  handleMultipleCheckBox = (e, obj, index) => {
    let { accList, checkAll, checkedList } = this.state;
    let { checked } = e.target;
    if (obj === "all") {
      checkedList = []
      if (checked) {
        accList.map((obj, i) => {
          obj.checked = true;
          let _val = { chartAccountID: obj.chartAccountID };
          checkedList.push(_val);
          return obj;
        });
      } else {
        accList.map((obj, j) => {
          obj.checked = false;
          return obj;
        });
      }
      this.setState({ accList, checkAll: checked, checkedList });
    } else {
      if (checked) {
        obj.checked = checked;
        accList[index] = obj;
        let _check = accList.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAll = true;
        }
        let _val = { chartAccountID: obj.chartAccountID };
        checkedList.push(_val);
        this.setState({ accList, checkAll, checkedList });
      } else {
        obj.checked = checked;
        accList[index] = obj;
        var test = checkedList.filter(
          (check) => check.chartAccountID !== obj.chartAccountID
        );
        this.setState({ checkAll: false, accList, checkedList: test });
      }
    }
  };
  copyAccount = async () => {
    let {
      accList,
      chartSort_CA,
      includeEFC,
      includeBudget,
      includeFringe,
      overwriteDescription,
      formErrors,
      checkedList,
    } = this.state;
    let chartAccountIDs = _.map(checkedList, "chartAccountID"); //-> [1,2,3, ...]
    // chartAccountIDs = chartAccountIDs.map((obj) => obj = parseFloat(obj.replace(/,/g, '')))
    let data = {
      copyOptions: {
        chartAccountID: chartAccountIDs,
        chartSort: chartSort_CA,
        includeEFC,
        includeBudget,
        includeFringe,
        overwriteDescription,
      },
    };
    formErrors = Validation.handleWholeValidation({ chartSort_CA }, formErrors);

    if (!formErrors.chartSort_CA) {
      this.setState({
        isLoading: true,
      });
      await this.props.copyAccount(data);

      //success case of update department
      if (this.props.chart.copyAccountSuccess) {
        toast.success(this.props.chart.copyAccountSuccess);
        checkedList.map((d, i) => {
          let obj = accList.find((e) => e.chartAccountID === d.chartAccountID);
          obj.checked = false;
        });
        this.closeModal("openChartOfAccountsModal");
        checkedList = [];
      }
      //error case of update department
      if (this.props.chart.copyAccountError) {
        handleAPIErr(this.props.chart.copyAccountError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false, checkedList });
  };
  handleDropDown = (data, key) => {
    let { mc_desc, mc_post, mc_active } = this.state;
    if (key === "mc_desc") {
      mc_desc = data;
    } else if (key === "mc_post") {
      mc_post = data;
    } else {
      //mc_active case
      mc_active = data;
    }
    this.setState({ mc_desc, mc_post, mc_active });
  };
  onMultipleChange = async () => {
    let {
      mc_level,
      mc_level_flag,
      mc_type,
      mc_type_flag,
      mc_post,
      mc_post_flag,
      mc_active,
      mc_active_flag,
      mc_seclevel,
      mc_seclevel_flag,
      mc_fringe,
      mc_fringe_flag,
      mc_desc,
      mc_desc_flag,
      checkedList,
      accList,
    } = this.state;
    let chartAccountIDs = _.map(checkedList, "chartAccountID"); //-> [1,2,3, ...]
    // console.log("CHART ACCOUNT ID's",chartAccountIDs)
    // chartAccountIDs = chartAccountIDs.map((obj) => obj = parseFloat(obj.replace(/,/g, '')))
    mc_desc = mc_desc.value;
    mc_post = mc_post.value;
    mc_active = mc_active.value;
    let data = {
      chartAccountID: chartAccountIDs,
      changeOptions: {
        level: mc_level,
        leveFlag: mc_level_flag,
        type: mc_type,
        typeFlag: mc_type_flag,
        post: mc_post,
        postFlag: mc_post_flag,
        active: mc_active,
        activeFlag: mc_active_flag,
        secLevel: mc_seclevel,
        secLevelFlag: mc_seclevel_flag,
        fringe: mc_fringe,
        fringeFlag: mc_fringe_flag,
        descType: mc_desc,
        descTypeFlag: mc_desc_flag,
      },
    };
    if (
      mc_desc_flag === "Y" ||
      mc_fringe_flag === "Y" ||
      mc_seclevel_flag === "Y" ||
      mc_active_flag === "Y" ||
      mc_post_flag === "Y" ||
      mc_type_flag === "Y" ||
      mc_level_flag === "Y"
    ) {
      this.setState({
        isLoading: true,
      });
      await this.props.multipleChange(data);

      //success case of update department
      if (this.props.chart.multiChangeAccountSuccess) {
        toast.success(this.props.chart.multiChangeAccountSuccess);
        checkedList.map((d, i) => {
          let obj = accList.find((e) => e.chartAccountID === d.chartAccountID);
          obj.checked = false;

          if (mc_seclevel_flag === "Y") {
            obj.secLevel = mc_seclevel;
          }
          if (mc_active_flag === "Y") {
            obj.active = mc_active;
          }
          if (mc_post_flag === "Y") {
            obj.post = mc_post;
          }
          if (mc_type_flag === "Y") {
            obj.type = mc_type;
          }
          if (mc_level_flag === "Y") {
            obj.level = mc_level;
          }
          if (mc_fringe_flag === "Y") {
            obj.initBalance = mc_fringe;
          }
        });

        this.setState({ accList }, () => {
          let table = window.$("#chartofaccounts").DataTable();

          checkedList.map((d, i) => {
            let found = accList.findIndex(
              (e) => e.chartAccountID === d.chartAccountID
            );
            if (found != -1) {
              table.row(found).invalidate("dom").draw();
            }
          });
        });

        this.closeModal("openMultipleChangeModal");
        checkedList = [];
      }
      //error case of update department
      if (this.props.chart.multiChangeAccountError) {
        handleAPIErr(this.props.chart.multiChangeAccountError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false, checkedList });
    } else {
      toast.error("No Option Selected");
    }
  };
  exportChartAccount = async () => {
    let { chartAccountID, accList, checkedList } = this.state;
    let chartAccountIDs = _.map(checkedList, "chartAccountID"); //-> [1,2,3, ...]
    if (checkedList.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportChartAccount(chartAccountIDs);

      if (this.props.chart.exportChartAccountSuccess) {
        toast.success("Chart Account Exported Successfully");
        let resp = JSON.parse(
          JSON.stringify(this.props.chart.exportChartAccount)
        );

        let obj = {
          contentType: 'application/vnd.ms-excel',
          attachment: resp
        }
        downloadAttachments(obj, 'AccountCodes')
        checkedList.map((d, i) => {
          let obj = accList.find((e) => e.chartAccountID === d.chartAccountID);
          obj.checked = false;
        });
        checkedList = [];
      }
      if (this.props.chart.exportChartAccountError) {
        handleAPIErr(this.props.chart.exportChartAccountError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false, checkedList });
    } else {
      toast.error("Please Select Chart Account First!");
    }
  };
  //import accounts
  onImport = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.pasteAccount({ excelData });
    if (this.props.chart.pasteChartAccountSuccess) {
      toast.success(this.props.chart.pasteChartAccountSuccess);
      this.closeModal("openImportModal");

    }
    if (this.props.chart.pasteChartAccountError) {
      handleAPIErr(this.props.chart.pasteChartAccountError, this.props);
    }
    this.props.clearChartStates();

    this.setState({ isLoading: false });
  }

  render() {
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
              <h2>chart of accounts</h2>
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
                  learn how to use chart of accounts Read our{" "}
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
          <div className="col-sm-12 table_white_box">
            {/* Filter */}
            <Filter />
            {/* End Filter */}
            <div className="user_setup_plus_Icons">
              <ul>
                <li>
                  <button
                    className="btn user_setup_rbtns"
                    type="button"
                    onClick={this.primeAccount}
                  >
                    <span className="round_plus">
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className="btn user_setup_rbtns"
                    type="button"
                    onClick={this.deleteChartAccount}
                  >
                    <span className="round_file">
                      {" "}
                      <img
                        src="./images/user-setup/delete.png"
                        alt="filter"
                      ></img>
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
                        <span className="dots_img">
                          <img
                            src="./images/user-setup/dots.png"
                            alt="filter"
                          ></img>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            this.openModal("openMultipleChangeModal")
                          }
                        >
                          &nbsp;&nbsp;Multiple Change
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() =>
                            this.openModal("openChartOfAccountsModal")
                          }
                        >
                          &nbsp;&nbsp;Copy Account
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => this.exportChartAccount()}
                        >
                          &nbsp;&nbsp;Export Account
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() =>
                            this.openModal("openImportModal")
                          }
                        >
                          &nbsp;&nbsp;Paste Account
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
                id="chartofaccounts"
                className=" user_setup_table"
                width="100%"
              >
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
                            name="all"
                            checked={this.state.checkAll}
                            onChange={(event) =>
                              this.handleMultipleCheckBox(event, "all")
                            }
                          />
                          <span className="click_checkmark global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className="user_setup_hed">chart of account</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">post</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Lvl</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">sec</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">fmt</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">type</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">active</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">init balance</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">ext chart</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">user</span>
                    </th>
                    <th className="text-right">
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
                  {this.state.accList
                    ? this.state.accList.map((obj, i) => {
                      return (
                        <tr
                          key={obj.chartAccountID}
                          onClick={(e) => this.getAccount(e, obj)}
                          className="cursorPointer"
                        >
                          <td>
                            <div className="custom-radio">
                              <label
                                className="check_main remember_check"
                                htmlFor={`accCheck${i}`}
                              >
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`accCheck${i}`}
                                  name={"accListCheck"}
                                  checked={obj.checked}
                                  onChange={(event) =>
                                    this.handleMultipleCheckBox(event, obj, i)
                                  }
                                />
                                <span className="click_checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td>{obj.accountSortCode}</td>
                          <td>{obj.description}</td>
                          <td>{obj.post}</td>
                          <td>{obj.level}</td>
                          <td>{obj.secLevel}</td>
                          <td>{obj.format}</td>
                          <td>{obj.type}</td>
                          <td>{obj.active}</td>
                          <td>{obj.initBalance}</td>
                          <td>{obj.extChart}</td>
                          <td>{obj.user}</td>
                          <td></td>
                        </tr>
                      );
                    })
                    : ""}
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
        <MultipleChangeModal
          openMultipleChangeModal={this.state.openMultipleChangeModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChangeField={this.handleChangeField}
          handleCheckBox={this.handleCheckBox}
          handleDropDown={this.handleDropDown}
          onMultipleChange={this.onMultipleChange}
        />

        <ChartOfAccountsModal
          openChartOfAccountsModal={this.state.openChartOfAccountsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChangeField={this.handleChangeField}
          handleCheckBox={this.handleCheckBox}
          copyAccount={this.copyAccount}
        />
        <InsertChartModal
          state={this.state}
          openModal={this.openModal}
          closeModal={this.closeModal}
          getChartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          getUpdatedChartSort={this.getUpdatedChartSort}
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          getUpdatedChartCode={this.getUpdatedChartCode}
          handleChangeChartCode={this.handleChangeChartCode}
          onBlurChartCode={this.onBlurChartCode}
          changeChartCode={this.changeChartCode}
          handleChangeField={this.handleChangeField}
          handleCheckBox={this.handleCheckBox}
          handleAddEdit={this.handleAddEdit}
        />
        <Import
          state={this.state}
          openModal={this.openModal}
          closeModal={this.closeModal}
          onImport={this.onImport}
          page="chart-accounts"
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({ chart: state.chart });
export default connect(mapStateToProps, {
  getChartAccounts: ChartActions.getChartAccounts,
  deleteChartAccount: ChartActions.deleteChartAccount,
  clearChartStates: ChartActions.clearChartStates,
  getChartSorts: ChartActions.getChartSorts,
  getChartCodes: ChartActions.getChartCodes,
  primeAccount: ChartActions.primeAccount,
  addAccount: ChartActions.addAccount,
  getAccount: ChartActions.getAccount,
  updateAccount: ChartActions.updateAccount,
  multipleChange: ChartActions.multipleChange,
  copyAccount: ChartActions.copyAccount,
  exportChartAccount: ChartActions.exportChartAccount,
  pasteAccount: ChartActions.pasteAccount,
})(ChartOfAccounts);
