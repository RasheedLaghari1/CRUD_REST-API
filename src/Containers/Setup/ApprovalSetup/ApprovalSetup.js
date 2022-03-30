import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./ApprovalSetup.css";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import ApprovalGroupsetup from "../../Modals/SetupModals/ApprovalGroupSetup/ApprovalGroupSetup";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from "../Filter/Filter";
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
  getApprovers,
  getApprovalGroups,
  getApprovalGroup,
  insertApprovalGroup,
  updateApprovalGroup,
  primeApprover,
  deleteApprovalGroup,
  clearUserStates,
} from "../../../Actions/UserActions/UserActions";
import _ from "lodash";

const uuidv1 = require("uuid/v1");

class ApprovalSetup extends Component {
  constructor() {
    super();
    this.state = {
      recordID: "", //approval group ID
      approversList: [], //approvers list
      approverOptions: [], //restructured approvers list to show in select options
      approvalGroups: [], //approval groups list
      approvalName: "", //approval group name

      poCheck: "N",
      allPOApproverCheck: false,
      poApprovers: [],

      invoiceCheck: "N",
      allInvcApproverCheck: false,
      invoiceApprovers: [],

      expenseCheck: "N",
      allExpApproverCheck: false,
      expenseApprovers: [],

      documentCheck: "N",
      allDocApproverCheck: false,
      documentApprovers: [],

      paymentCheck: "N",
      allPayApproverCheck: false,
      paymentApprovers: [],

      timecardCheck: "N",
      allTimecardsApproverCheck: false,
      timecardApprovers: [],

      journalCheck: "N",
      allJournalsApproverCheck: false,
      journalApprovers: [],

      supplierCheck: "N",
      allSupplierApproverCheck: false,
      supplierApprovers: [],

      advancedList: [],
      clonedAdvancedList: [],
      showHiddenRows: false,
      approverType: "", //-> po || invoice || expense || payments || documents
      approverIndex: "", //when getting the approver details then save the approver index index will be used for  updating approver at that index
      amountFrom: "",
      amountTo: "",
      approverName: { label: "Select Approver Name", value: "" },
      changeDollar: "",
      changeOrders: "",
      changePercent: "",
      flags: [],
      range: "",
      sequence: "",
      signaturePosition: "",
      userLogin: "",
      addEditApproverCheck: "", //to check either approver is going to add or update
      addEditApprovalGroupCheck: "", //to check either approval group is going to add or update
      columns: [
        { name: "Approval Name", hide: false },
        { name: "Approval Group Setup", hide: false },
      ],
      pageLength: 10,
      openSettingsModal: false,
      openApprovalGroupSetupModal: false,
      openApprovalSetupModal: false,
      formErrors: {
        approvalName: "",
      },

      copyObject: [],
      isChecked: false,
    };
  }

  componentDidMount() {
    //show/hide filter card jquery

    filterBox("approvalsetup");
    Promise.all([this.getApprovalGroups(), this.getApprovers()]);
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
      if (name === "openApprovalGroupSetupModal") {
        this.approvalGroupPopup_tables("approvalGroupSetupOrder");
        this.approvalGroupPopup_tables("approvalGroupSetupInvoice");
        this.approvalGroupPopup_tables("approvalGroupSetupExpense");
        this.approvalGroupPopup_tables("approvalGroupSetupPayments");
        this.approvalGroupPopup_tables("approvalGroupSetupDocuments");
        this.approvalGroupPopup_tables("approvalGroupSetupTimecards");
        this.approvalGroupPopup_tables("approvalGroupSetupJournal");
        this.approvalGroupPopup_tables("approvalGroupSetupSupplier");
        $(".sideBarAccord").click(function () {
          $(this).toggleClass("rorate_0");
        });
      } else if (name === "openApprovalSetupModal") {
        window.$("#approvalsetupModal").DataTable({
          dom: "Rlfrtip",
          stateSave: true,
          stateSaveCallback: function (settings, data) {
            localStorage.setItem(
              "DataTables_approvalsetupModal",
              JSON.stringify(data)
            );
          },
          stateLoadCallback: function (settings) {
            return JSON.parse(
              localStorage.getItem("DataTables_approvalsetupModal")
            );
          },
          colReorder: false,
          searching: false,
          paging: false,
          info: false,
          order: [[1, "asc"]],
          colReorder: {
            fixedColumnsRight: 5,
            fixedColumnsLeft: 5,
          },
        });
        //advanced list
        window.$("#approvalSetupdtAdvancedList").DataTable({
          dom: "Rlfrtip",
          colReorder: false,
          searching: false,
          paging: false,
          info: false,
          order: [[1, "asc"]],
          colReorder: {
            fixedColumnsRight: 5,
            fixedColumnsLeft: 5,
          },
        });
      }
    });
  };

  closeModal = (name) => {
    this.setState({ [name]: false }, () => {
      if (name === "openApprovalGroupSetupModal") {
        //clearing all states
        this.clearStates();
      } else if (name === "openApprovalSetupModal") {
        //clearing specific states
        this.setState({
          advancedList: [],
          clonedAdvancedList: [],
          showHiddenRows: false,
          approverType: "", //-> po || invoice || expense || payments || documents || timecard || journal || Supplier
          approverIndex: "",
          amountFrom: "",
          amountTo: "",
          approverName: { label: "Select Approver Name", value: "" },
          changeDollar: "",
          changeOrders: "",
          changePercent: "",
          flags: [],
          range: "",
          sequence: "",
          signaturePosition: "",
          userLogin: "",
          addEditApproverCheck: "", //to check either approver is going to add or update
          copyObject: [],
        });
      }
    });
  };

  approvalGroupPopup_tables = (name) => {
    window.$("#" + name).DataTable({
      dom: "Rlfrtip",
      destroy: true,
      colReorder: false,
      searching: false,
      paging: false,
      info: false,
      order: [[2, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  };

  //approver popup advanced list table setting
  advancedLstTableSetting = () => {
    window.$("#approvalSetupdtAdvancedList").DataTable({
      dom: "Rlfrtip",
      colReorder: false,
      searching: false,
      paging: false,
      info: false,
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  };

  clearStates = () => {
    this.setState({
      recordID: "", //approval group ID
      approvalName: "",

      poCheck: "N",
      allPOApproverCheck: false,
      poApprovers: [],

      invoiceCheck: "N",
      allInvcApproverCheck: false,
      invoiceApprovers: [],

      expenseCheck: "N",
      allExpApproverCheck: false,
      expenseApprovers: [],

      documentCheck: "N",
      allDocApproverCheck: false,
      documentApprovers: [],

      paymentCheck: "N",
      allPayApproverCheck: false,
      paymentApprovers: [],

      timecardCheck: "N",
      allTimecardsApproverCheck: false,
      timecardApprovers: [],

      journalCheck: "N",
      allJournalsApproverCheck: false,
      journalApprovers: [],

      supplierCheck: "N",
      allSupplierApproverCheck: false,
      supplierApprovers: [],

      advancedList: [],
      clonedAdvancedList: [],
      showHiddenRows: false,
      approverType: "", //-> po || invoice || expense || payments || documents || timecard || journal || supplier
      approverIndex: "",
      amountFrom: "",
      amountTo: "",
      approverName: { label: "Select Approver Name", value: "" },
      changeDollar: "",
      changeOrders: "",
      changePercent: "",
      flags: [],
      range: "",
      sequence: "",
      signaturePosition: "",
      userLogin: "",
      addEditApproverCheck: "", //to check either approver is going to add or update
      addEditApprovalGroupCheck: "", //to check either approval group is going to add or update
      pageLength: 10,
      openSettingsModal: false,
      openApprovalGroupSetupModal: false,
      openApprovalSetupModal: false,
      formErrors: {
        approvalName: "",
      },
      copyObject: [],
    });
  };

  //Approval Groups Table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];

    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    aoColumns[1] = { sName: "Approval Name" };
    aoColumns[2] = { sName: "Approval Group Setup" };
    aoColumns[3] = { sName: "menus" };

    let result = tableSetting(columns, aoColumns, "approvalsetup");
    this.setState({ ...result });
  };

  //Settings Popup
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
    handleSaveSettings(columns, "approvalsetup", pageLength);
    this.closeModal("openSettingsModal");
  };

  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "approvalsetup");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };

  //get approvers list
  getApprovers = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getApprovers();
    //success case of get approvers
    if (this.props.user.getApproversSuccess) {
      // toast.success(this.props.user.getApproversSuccess);

      let approversList =
        JSON.parse(JSON.stringify(this.props.user.getApprovers)) || [];

      let aprvs = [];

      approversList.map((a, i) => {
        aprvs.push({ label: a.userName, value: a.userLogin });
      });

      this.setState({
        approversList,
        approverOptions: aprvs,
      });
    }
    //error case of get approvers
    if (this.props.user.getApproversError) {
      handleAPIErr(this.props.user.getApproversError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };

  //get approval groups
  getApprovalGroups = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getApprovalGroups();
    //success case of get approval groups
    if (this.props.user.getApprovalGroupsSuccess) {
      // toast.success(this.props.user.getApprovalGroupsSuccess);

      let approvalGroups =
        JSON.parse(JSON.stringify(this.props.user.getApprovalGroups)) || [];

      this.setState(
        {
          approvalGroups,
        },
        () => this.tableSetting()
      );
    }
    //error case of get approval groups
    if (this.props.user.getApprovalGroupsError) {
      handleAPIErr(this.props.user.getApprovalGroupsError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };

  //get single approval group
  getApprovalGroup = async (e, grp) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }

    this.setState({
      isLoading: true,
    });
    await this.props.getApprovalGroup(grp.recordID);

    //success case of get approval group
    if (this.props.user.getApprovalGroupSuccess) {
      // toast.success(this.props.user.getApprovalGroupSuccess);

      let getApprovalGroup =
        JSON.parse(JSON.stringify(this.props.user.getApprovalGroup)) || "";
      let recordID = grp.recordID || "";
      let approvalName = getApprovalGroup.approvalName || "";

      let poCheck = getApprovalGroup.poCheck || "";
      let poApprovers = getApprovalGroup.poApprovers || [];

      let invoiceCheck = getApprovalGroup.invoiceCheck || "";
      let invoiceApprovers = getApprovalGroup.invoiceApprovers || [];

      let expenseCheck = getApprovalGroup.expenseCheck || "";
      let expenseApprovers = getApprovalGroup.expenseApprovers || [];

      let documentCheck = getApprovalGroup.documentCheck || "";
      let documentApprovers = getApprovalGroup.documentApprovers || [];

      let paymentCheck = getApprovalGroup.paymentCheck || "";
      let paymentApprovers = getApprovalGroup.paymentApprovers || [];

      let timecardCheck = getApprovalGroup.timecardCheck || "";
      let timecardApprovers = getApprovalGroup.timecardApprovers || [];

      let journalCheck = getApprovalGroup.journalCheck || "";
      let journalApprovers = getApprovalGroup.journalApprovers || [];

      let supplierCheck = getApprovalGroup.supplierCheck || "";
      let supplierApprovers = getApprovalGroup.supplierApprovers || [];

      poApprovers.map((p) => (p.checked = false));
      invoiceApprovers.map((i) => (i.checked = false));
      expenseApprovers.map((e) => (e.checked = false));
      documentApprovers.map((d) => (d.checked = false));
      paymentApprovers.map((p) => (p.checked = false));
      timecardApprovers.map((p) => (p.checked = false));
      journalApprovers.map((p) => (p.checked = false));
      supplierApprovers.map((p) => (p.checked = false));

      this.setState(
        {
          recordID,
          approvalName,

          poCheck,
          poApprovers,

          invoiceCheck,
          invoiceApprovers,

          expenseCheck,
          expenseApprovers,

          documentCheck,
          documentApprovers,

          paymentCheck,
          paymentApprovers,

          timecardCheck,
          timecardApprovers,

          journalCheck,
          journalApprovers,

          supplierCheck,
          supplierApprovers,

          addEditApprovalGroupCheck: "update",
        },
        () => {
          this.openModal("openApprovalGroupSetupModal");
        }
      );
    }
    //error case of get approval group
    if (this.props.user.getApprovalGroupError) {
      handleAPIErr(this.props.user.getApprovalGroupError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };

  //delete department
  deleteApprovalGroup = async () => {
    let { recordID, approvalGroups } = this.state;
    this.setState({
      isLoading: true,
    });

    if (recordID) {
      await this.props.deleteApprovalGroup(recordID);
    } else {
      toast.error("Record ID is Missing!");
    }

    //success case of delete Approval Group
    if (this.props.user.deleteApprovalGroupSuccess) {
      toast.success(this.props.user.deleteApprovalGroupSuccess);

      let table = window.$("#approvalsetup").DataTable();

      let index = approvalGroups.findIndex((g) => g.recordID === recordID);
      let filtersList = approvalGroups.filter((g) => g.recordID != recordID);
      approvalGroups = filtersList;
      this.setState(
        {
          approvalGroups,
          recordID: "",
        },
        () => {
          table.row(index).remove().draw(false); //also update table
        }
      );
    }

    //error case of delete Approval Group
    if (this.props.user.deleteApprovalGroupError) {
      handleAPIErr(this.props.user.deleteApprovalGroupError, this.props);
    }
    this.props.clearUserStates();
    this.setState({
      isLoading: false,
    });
  };

  //handle Approval Groups check box
  handleGroupListCheckbox = (e, grp) => {
    if (e.target.checked) {
      this.setState({ recordID: grp.recordID });
    } else {
      this.setState({ recordID: "" });
    }
  };

  //when click to + button for creating new approval group
  primeApprovalGroup = () => {
    this.setState(
      {
        addEditApprovalGroupCheck: "add",
      },
      () => {
        this.openModal("openApprovalGroupSetupModal");
      }
    );
  };

  //add approval group
  addApprovalGroup = async () => {
    let {
      approvalName,

      poCheck,
      poApprovers,

      invoiceCheck,
      invoiceApprovers,

      expenseCheck,
      expenseApprovers,

      documentCheck,
      documentApprovers,

      paymentCheck,
      paymentApprovers,

      timecardCheck,
      timecardApprovers,

      journalCheck,
      journalApprovers,

      supplierCheck,
      supplierApprovers,

      formErrors,
    } = this.state;
    let data = {
      approvalGroup: {
        approvalName: approvalName.toUpperCase(),

        poCheck,
        poApprovers,

        invoiceCheck,
        invoiceApprovers,

        expenseCheck,
        expenseApprovers,

        documentCheck,
        documentApprovers,

        paymentCheck,
        paymentApprovers,

        timecardCheck,
        timecardApprovers,

        journalCheck,
        journalApprovers,

        supplierCheck,
        supplierApprovers,
      },
    };
    formErrors = handleWholeValidation({ approvalName }, formErrors);
    if (!formErrors.approvalName) {
      this.setState({
        isLoading: true,
      });
      await this.props.insertApprovalGroup(data);

      //success case of add approval group
      if (this.props.user.insertApprovalGroupSuccess) {
        toast.success(this.props.user.insertApprovalGroupSuccess);
        window.location.reload();
        // this.closeModal('openApprovalGroupSetupModal')
      }
      //error case of add approval group
      if (this.props.user.insertApprovalGroupError) {
        handleAPIErr(this.props.user.insertApprovalGroupError, this.props);
      }
      this.props.clearUserStates();
    }
    this.setState({ formErrors, isLoading: false });
  };

  //update approval group
  updateApprovalGroup = async () => {
    let {
      approvalGroups,
      recordID,
      approvalName,
      userLogin,

      poCheck,
      poApprovers,

      invoiceCheck,
      invoiceApprovers,

      expenseCheck,
      expenseApprovers,

      documentCheck,
      documentApprovers,

      paymentCheck,
      paymentApprovers,

      timecardCheck,
      timecardApprovers,

      journalCheck,
      journalApprovers,

      supplierCheck,
      supplierApprovers,

      formErrors,
    } = this.state;
    let data = {
      recordID,
      approvalGroup: {
        approvalName,

        poCheck,
        poApprovers,

        invoiceCheck,
        invoiceApprovers,

        expenseCheck,
        expenseApprovers,

        documentCheck,
        documentApprovers,

        paymentCheck,
        paymentApprovers,

        timecardCheck,
        timecardApprovers,

        journalCheck,
        journalApprovers,

        supplierCheck,
        supplierApprovers,
      },
    };
    formErrors = handleWholeValidation({ approvalName }, formErrors);
    if (!formErrors.approvalName) {
      this.setState({
        isLoading: true,
      });
      await this.props.updateApprovalGroup(data);

      //success case of update approval group
      if (this.props.user.updateApprovalGroupSuccess) {
        toast.success(this.props.user.updateApprovalGroupSuccess);

        //also update the table
        let found = approvalGroups.findIndex((g) => g.recordID === recordID);
        if (found != -1) {
          let table = window.$("#approvalsetup").DataTable();

          approvalGroups[found].approvalName = approvalName;

          this.setState(
            {
              approvalGroups: [...approvalGroups],
            },
            () => {
              table.row(found).invalidate("dom").draw(false);
              this.closeModal("openApprovalGroupSetupModal");
            }
          );
        }
      }
      //error case of update approval group
      if (this.props.user.updateApprovalGroupError) {
        handleAPIErr(this.props.user.updateApprovalGroupError, this.props);
      }
      this.props.clearUserStates();
    }
    this.setState({ formErrors, isLoading: false });
  };

  //when a user add or update approval group
  addEditApprovalGroup = () => {
    let { addEditApprovalGroupCheck } = this.state;

    if (addEditApprovalGroupCheck === "add") {
      //add Approval Group case
      this.addApprovalGroup();
    } else {
      //update Approval Group case
      this.updateApprovalGroup();
    }
  };

  //prime approver
  primeApprover = async (type) => {
    this.setState({
      isLoading: true,
    });
    await this.props.primeApprover(type);

    //success case of prime approver
    if (this.props.user.primeApproverSuccess) {
      toast.success(this.props.user.primeApproverSuccess);

      let primeApprover =
        JSON.parse(JSON.stringify(this.props.user.primeApprover)) || "";

      let advancedList = primeApprover.advancedList || [];
      let amountFrom = primeApprover.amountFrom || "";
      let amountTo = primeApprover.amountTo || "";
      let approverName = primeApprover.approverName || "";
      let changeDollar = primeApprover.changeDollar || "";
      let changeOrders = primeApprover.changeOrders || "";
      let changePercent = primeApprover.changePercent || "";
      let flags = primeApprover.flags || [];
      let range = primeApprover.range || "";
      let sequence = primeApprover.sequence || "";
      let signaturePosition = primeApprover.signaturePosition || "";
      let userLogin = primeApprover.userLogin || "";

      approverName = {
        label: approverName || "Select Approver Name",
        value: approverName || "",
      };

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
        }
        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });

      this.setState(
        {
          advancedList,
          clonedAdvancedList: advancedList,
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
          addEditApproverCheck: "add",
          approverType: type,
        },
        () => {
          this.openModal("openApprovalSetupModal");
        }
      );
    }
    //error case of prime approver
    if (this.props.user.primeApproverError) {
      handleAPIErr(this.props.user.primeApproverError, this.props);
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  };

  //Getting Approver Details and display on Popup for updating
  getApproverDetails = (e, type, ind, approver) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }

    let advancedList = approver.advancedList || [];

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
      }
      lst.id = uuidv1();
      lst.hide = false;
      return lst;
    });

    //get advanced list data from the local storage to hide/unhide rows for all approvers/approvals
    let aprvlAdvncdLst = JSON.parse(
      localStorage.getItem("aprvlAdvncdLst") || "[]"
    );
    if (aprvlAdvncdLst && aprvlAdvncdLst.length > 0) {
      advancedList.map((al, i) => {
        aprvlAdvncdLst.map((loc, i) => {
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

    approver.advancedList = filtrdList;
    approver.clonedAdvancedList = advancedList;

    this.setState(
      {
        ...approver,

        approverIndex: ind,
        approverType: type,
        approverName: {
          label: approver.approverName || "Select Approver Name",
          value: approver.userLogin || "",
        },
        addEditApproverCheck: "update",
      },
      () => this.openModal("openApprovalSetupModal")
    );
  };

  //adding new approver
  addApprover = () => {
    let {
      poApprovers,
      invoiceApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,

      approverType,
      advancedList,
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
    } = this.state;

    let newApprover = {
      advancedList,
      amountFrom,
      amountTo,
      approverName: approverName.label || "",
      changeDollar,
      changeOrders,
      changePercent,
      flags,
      range,
      sequence,
      signaturePosition,
      userLogin,
    };

    if (approverType === "PO") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupOrder").DataTable().destroy();

      //add in poApprovers array
      poApprovers = [...poApprovers, newApprover];
    } else if (approverType === "Invoice") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupInvoice").DataTable().destroy();

      //add in invoiceApprovers array
      invoiceApprovers = [...invoiceApprovers, newApprover];
    } else if (approverType === "Expense") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupExpense").DataTable().destroy();

      //add in expenseApprovers array
      expenseApprovers = [...expenseApprovers, newApprover];
    } else if (approverType === "Payment") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupPayments").DataTable().destroy();

      //add in paymentApprovers array
      paymentApprovers = [...paymentApprovers, newApprover];
    } else if (approverType === "Document") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupDocuments").DataTable().destroy();

      //add in documentApprovers array
      documentApprovers = [...documentApprovers, newApprover];
    } else if (approverType === "Timecard") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupTimecards").DataTable().destroy();

      //add in timecardApprovers array
      timecardApprovers = [...timecardApprovers, newApprover];
    } else if (approverType === "Journal") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupJournal").DataTable().destroy();

      //add in timecardApprovers array
      journalApprovers = [...journalApprovers, newApprover];
    } else if (approverType === "Supplier") {
      //destroy table first to update the list
      window.$("#approvalGroupSetupSupplier").DataTable().destroy();

      //add in timecardApprovers array
      supplierApprovers = [...supplierApprovers, newApprover];
    }

    this.setState(
      {
        poApprovers,
        invoiceApprovers,
        expenseApprovers,
        paymentApprovers,
        documentApprovers,
        timecardApprovers,
        journalApprovers,
        supplierApprovers,
      },
      () => {
        this.closeModal("openApprovalSetupModal");
        //re-initializing the related table after destroying
        if (approverType === "PO") {
          this.approvalGroupPopup_tables("approvalGroupSetupOrder");
        } else if (approverType === "Invoice") {
          this.approvalGroupPopup_tables("approvalGroupSetupInvoice");
        } else if (approverType === "Expense") {
          this.approvalGroupPopup_tables("approvalGroupSetupExpense");
        } else if (approverType === "Payment") {
          this.approvalGroupPopup_tables("approvalGroupSetupPayments");
        } else if (approverType === "Document") {
          //Document
          this.approvalGroupPopup_tables("approvalGroupSetupDocuments");
        } else if (approverType === "Timecard") {
          this.approvalGroupPopup_tables("approvalGroupSetupTimecards");
        } else if (approverType === "Journal") {
          this.approvalGroupPopup_tables("approvalGroupSetupJournal");
        } else if (approverType === "Supplier") {
          this.approvalGroupPopup_tables("approvalGroupSetupSupplier");
        }
      }
    );
  };

  //updating current approver
  updateApprover = () => {
    let {
      poApprovers,
      invoiceApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,

      approverIndex,
      approverType,
      clonedAdvancedList,
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
    } = this.state;

    let updatedApprover = {
      advancedList: clonedAdvancedList,
      amountFrom,
      amountTo,
      approverName: approverName.label || "",
      changeDollar,
      changeOrders,
      changePercent,
      flags,
      range,
      sequence,
      signaturePosition,
      userLogin,
    };
    let tableName = "";
    if (approverType === "PO") {
      //add in poApprovers array
      poApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupOrder";
    } else if (approverType === "Invoice") {
      //add in invoiceApprovers array
      invoiceApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupInvoice";
    } else if (approverType === "Expense") {
      //add in expenseApprovers array
      expenseApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupExpense";
    } else if (approverType === "Payment") {
      //add in paymentApprovers array
      paymentApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupPayments";
    } else if (approverType === "Document") {
      //add in documentApprovers array
      documentApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupDocuments";
    } else if (approverType === "Timecard") {
      //add in documentApprovers array
      timecardApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupTimecards";
    } else if (approverType === "Journal") {
      //add in documentApprovers array
      journalApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupJournal";
    } else if (approverType === "Supplier") {
      //add in documentApprovers array
      supplierApprovers[approverIndex] = updatedApprover;
      tableName = "#approvalGroupSetupSupplier";
    }
    //also update in table
    let table = window.$(tableName).DataTable();
    this.setState(
      {
        poApprovers,
        invoiceApprovers,
        expenseApprovers,
        paymentApprovers,
        documentApprovers,
        timecardApprovers,
        journalApprovers,
        supplierApprovers,
      },
      () => {
        table.row(approverIndex).invalidate("dom").draw();
        this.closeModal("openApprovalSetupModal");
      }
    );
  };

  //when a user add or update Approver
  addEditApprover = () => {
    let { addEditApproverCheck } = this.state;

    if (addEditApproverCheck === "add") {
      //add Approver case
      this.addApprover();
    } else {
      //update Approver case
      this.updateApprover();
    }
  };

  //handle Approvers List check box
  handleApproversListCheckbox = (e, ind, all) => {
    let { name, value, checked } = e.target;
    let {
      poApprovers,
      invoiceApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,
      isChecked,
    } = this.state;
    let approvers = "";
    let checkAll = "";
    let list = [];
    if (name === "poApproverCheck") {
      if (all) {
        //all approvers will be checked
        poApprovers.map((a) => (a.checked = checked));
        approvers = "poApprovers";
        checkAll = "allPOApproverCheck";
        list = poApprovers;
      } else {
        poApprovers[ind].checked = checked;
        approvers = "poApprovers";
        list = poApprovers;
      }
    } else if (name === "invoiceApproverCheck") {
      if (all) {
        //all approvers will be checked
        invoiceApprovers.map((a) => (a.checked = checked));
        approvers = "invoiceApprovers";
        checkAll = "allInvcApproverCheck";
        list = invoiceApprovers;
      } else {
        let result =
          this.state.poApprovers[0] === this.state.invoiceApprovers[0];

        invoiceApprovers[ind].checked = checked;
        approvers = "invoiceApprovers";
        list = invoiceApprovers;
      }
    } else if (name === "expenseApproverCheck") {
      if (all) {
        //all approvers will be checked
        expenseApprovers.map((a) => (a.checked = checked));
        approvers = "expenseApprovers";
        checkAll = "allExpApproverCheck";
        list = expenseApprovers;
      } else {
        expenseApprovers[ind].checked = checked;
        approvers = "expenseApprovers";
        list = expenseApprovers;
      }
    } else if (name === "paymentApproverCheck") {
      if (all) {
        //all approvers will be checked
        paymentApprovers.map((a) => (a.checked = checked));
        approvers = "paymentApprovers";
        checkAll = "allPayApproverCheck";
        list = paymentApprovers;
      } else {
        paymentApprovers[ind].checked = checked;
        approvers = "paymentApprovers";
        list = paymentApprovers;
      }
    } else if (name === "documentApproverCheck") {
      //documentApproverCheck

      if (all) {
        //all approvers will be checked
        documentApprovers.map((a) => (a.checked = checked));
        approvers = "documentApprovers";
        checkAll = "allDocApproverCheck";
        list = documentApprovers;
      } else {
        documentApprovers[ind].checked = checked;
        approvers = "documentApprovers";
        list = documentApprovers;
      }
    } else if (name === "timecardApproverCheck") {
      // timecardApproverCheck

      if (all) {
        //all approvers will be checked
        timecardApprovers.map((a) => (a.checked = checked));
        approvers = "timecardApprovers";
        checkAll = "allTimecardsApproverCheck";
        list = timecardApprovers;
      } else {
        timecardApprovers[ind].checked = checked;
        approvers = "timecardApprovers";
        list = timecardApprovers;
      }
    } else if (name === "journalApproverCheck") {
      // journalApproverCheck

      if (all) {
        //all approvers will be checked
        journalApprovers.map((a) => (a.checked = checked));
        approvers = "journalApprovers";
        checkAll = "allJournalsApproverCheck";
        list = journalApprovers;
      } else {
        journalApprovers[ind].checked = checked;
        approvers = "journalApprovers";
        list = journalApprovers;
      }
    } else if (name === "supplierApproverCheck") {
      // supplierApprovers

      if (all) {
        //all approvers will be checked
        supplierApprovers.map((a) => (a.checked = checked));
        approvers = "supplierApprovers";
        checkAll = "allSupplierApproverCheck";
        list = supplierApprovers;
      } else {
        supplierApprovers[ind].checked = checked;
        approvers = "supplierApprovers";
        list = supplierApprovers;
      }
    }
    this.setState({
      [approvers]: list,
      [checkAll]: checked,
      isChecked: checked,
    });
  };

  //removing the approver from approver list
  removeApprover = (type, i) => {
    let {
      poApprovers,
      invoiceApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,
    } = this.state;
    let approvers = "";
    let list = [];

    const toastMsg = "Please select records to Delete";

    if (type === "PO") {
      const foundIndex = poApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupOrder").DataTable().destroy();

      list = poApprovers.filter((a) => !a.checked);
      approvers = "poApprovers";
    } else if (type === "Invoice") {
      const foundIndex = invoiceApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupInvoice").DataTable().destroy();

      list = invoiceApprovers.filter((a) => !a.checked);
      approvers = "invoiceApprovers";
    } else if (type === "Expense") {
      const foundIndex = expenseApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupExpense").DataTable().destroy();

      list = expenseApprovers.filter((a) => !a.checked);
      approvers = "expenseApprovers";
    } else if (type === "Payment") {
      const foundIndex = paymentApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupPayments").DataTable().destroy();

      list = paymentApprovers.filter((a) => !a.checked);
      approvers = "paymentApprovers";
    } else if (type === "Document") {
      const foundIndex = documentApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupDocuments").DataTable().destroy();

      list = documentApprovers.filter((a) => !a.checked);
      approvers = "documentApprovers";
    } else if (type === "Timecard") {
      const foundIndex = timecardApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupTimecards").DataTable().destroy();

      list = timecardApprovers.filter((a) => !a.checked);
      approvers = "timecardApprovers";
    } else if (type === "Journal") {
      const foundIndex = journalApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupJournal").DataTable().destroy();

      list = journalApprovers.filter((a) => !a.checked);
      approvers = "journalApprovers";
    } else if (type === "Supplier") {
      const foundIndex = supplierApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      //destroy table first to update the list
      window.$("#approvalGroupSetupSupplier").DataTable().destroy();

      list = supplierApprovers.filter((a) => !a.checked);
      approvers = "supplierApprovers";
    }
    this.setState(
      {
        [approvers]: list,
      },
      () => {
        //re-initializing the related table after destroying
        if (type === "PO") {
          this.approvalGroupPopup_tables("approvalGroupSetupOrder");
        } else if (type === "Invoice") {
          this.approvalGroupPopup_tables("approvalGroupSetupInvoice");
        } else if (type === "Expense") {
          this.approvalGroupPopup_tables("approvalGroupSetupExpense");
        } else if (type === "Payment") {
          this.approvalGroupPopup_tables("approvalGroupSetupPayments");
        } else if (type === "Document") {
          //Document
          this.approvalGroupPopup_tables("approvalGroupSetupDocuments");
        } else if (type === "Timecard") {
          this.approvalGroupPopup_tables("approvalGroupSetupTimecards");
        } else if (type === "Journal") {
          this.approvalGroupPopup_tables("approvalGroupSetupJournal");
        } else if (type === "Supplier") {
          this.approvalGroupPopup_tables("approvalGroupSetupSupplier");
        }
      }
    );
  };

  handleFieldChange = (e, type) => {
    let { name, value, checked } = e.target;
    let { flags } = this.state;
    if (
      name === "changeOrders" ||
      name === "poCheck" ||
      name === "invoiceCheck" ||
      name === "expenseCheck" ||
      name === "paymentCheck" ||
      name === "documentCheck" ||
      name === "timecardCheck" ||
      name === "journalCheck" ||
      name === "supplierCheck"
    ) {
      value = checked ? "Y" : "N";
    }
    if (type === "flags") {
      flags.map((f, i) => {
        if (f.type === name) {
          f.value = value;
        }
        return f;
      });
    }
    let { formErrors } = this.state;
    formErrors = handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors, flags });
  };

  //Advanced List Setting
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

  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {
    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#approvalSetupdtAdvancedList",
      "aprvlAdvncdLst",
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
        this.advancedLstTableSetting();
      }
    );
  };

  handleShowHiddenRows = async () => {
    let table = window.$("#approvalSetupdtAdvancedList").DataTable();
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
            this.advancedLstTableSetting();
          });
        } else {
          //hide again hidden rows
          let advancedList = this.state.advancedList;
          let list = advancedList.filter((l) => !l.hide);
          this.setState({ advancedList: list }, () => {
            this.advancedLstTableSetting();
          });
        }
      }
    );
  };

  handleChangeApproverName = (approverName) => {
    this.setState({ approverName, userLogin: approverName.value });
  };

  //Copy Approvers
  copyApprovers = (e, type) => {
    let {
      invoiceApprovers,
      poApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,
    } = this.state;
    let objectToCopy = [];

    if (type === "PO") {
      objectToCopy = poApprovers.filter(
        (poApproverObj) => poApproverObj.checked === true
      );
    } else if (type === "Invoice") {
      objectToCopy = invoiceApprovers.filter(
        (invoiceApproversObj) => invoiceApproversObj.checked === true
      );
    } else if (type === "Expense") {
      objectToCopy = expenseApprovers.filter(
        (expenseApproversObj) => expenseApproversObj.checked === true
      );
    } else if (type === "Payment") {
      objectToCopy = paymentApprovers.filter(
        (paymentApproversObj) => paymentApproversObj.checked === true
      );
    } else if (type === "Document") {
      objectToCopy = documentApprovers.filter(
        (documentApproversObj) => documentApproversObj.checked === true
      );
    } else if (type === "Timecard") {
      objectToCopy = timecardApprovers.filter(
        (timecardApproversObj) => timecardApproversObj.checked === true
      );
    } else if (type === "Journal") {
      objectToCopy = journalApprovers.filter(
        (journalApproversObj) => journalApproversObj.checked === true
      );
    } else if (type === "Supplier") {
      objectToCopy = supplierApprovers.filter(
        (supplierApproversObj) => supplierApproversObj.checked === true
      );
    } else {
      return;
    }

    this.setState(
      {
        copyObject: objectToCopy,
      },
      () => {
        objectToCopy.length > 0
          ? toast.success("copy successful")
          : toast.error("Please select records to copy");
      }
    );
  };

  //Paste the copied approvers into diff modules
  pasteApprovers = (e, type) => {
    let {
      invoiceApprovers,
      copyObject,
      poApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,
    } = this.state;

    if (copyObject.length > 0) {
      let arrayToPaste = _.cloneDeep(copyObject);
      arrayToPaste = arrayToPaste.map((element) => ({
        ...element,
        checked: !element.checked,
      }));
      if (type === "PO") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupOrder").DataTable().destroy();

        poApprovers = [...poApprovers, ...arrayToPaste];
      } else if (type === "Invoice") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupInvoice").DataTable().destroy();

        invoiceApprovers = [...invoiceApprovers, ...arrayToPaste];
      } else if (type === "Expense") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupExpense").DataTable().destroy();

        expenseApprovers = [...expenseApprovers, ...arrayToPaste];
      } else if (type === "Payment") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupPayments").DataTable().destroy();

        paymentApprovers = [...paymentApprovers, ...arrayToPaste];
      } else if (type === "Document") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupDocuments").DataTable().destroy();

        documentApprovers = [...documentApprovers, ...arrayToPaste];
      } else if (type === "Timecard") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupTimecards").DataTable().destroy();

        timecardApprovers = [...timecardApprovers, ...arrayToPaste];
      } else if (type === "Journal") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupJournal").DataTable().destroy();

        journalApprovers = [...journalApprovers, ...arrayToPaste];
      } else if (type === "Supplier") {
        //destroy table first to update the list
        window.$("#approvalGroupSetupSupplier").DataTable().destroy();

        supplierApprovers = [...supplierApprovers, ...arrayToPaste];
      } else {
        return;
      }

      this.setState(
        {
          invoiceApprovers,
          poApprovers,
          expenseApprovers,
          paymentApprovers,
          documentApprovers,
          timecardApprovers,
          journalApprovers,
          supplierApprovers,
        },
        () => {
          //re-initializing the related table after destroying
          if (type === "PO") {
            this.approvalGroupPopup_tables("approvalGroupSetupOrder");
          } else if (type === "Invoice") {
            this.approvalGroupPopup_tables("approvalGroupSetupInvoice");
          } else if (type === "Expense") {
            this.approvalGroupPopup_tables("approvalGroupSetupExpense");
          } else if (type === "Payment") {
            this.approvalGroupPopup_tables("approvalGroupSetupPayments");
          } else if (type === "Document") {
            this.approvalGroupPopup_tables("approvalGroupSetupDocuments");
          } else if (type === "Timecard") {
            this.approvalGroupPopup_tables("approvalGroupSetupTimecards");
          } else if (type === "Journal") {
            this.approvalGroupPopup_tables("approvalGroupSetupJournal");
          } else if (type === "Supplier") {
            this.approvalGroupPopup_tables("approvalGroupSetupSupplier");
          }
        }
      );
    } else {
      toast.error("Please copy first");
    }
  };

  render() {
    let {
      poApprovers,
      invoiceApprovers,
      expenseApprovers,
      paymentApprovers,
      documentApprovers,
      timecardApprovers,
      journalApprovers,
      supplierApprovers,
    } = this.state;
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
              <h2>Approval Setup</h2>
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
                  learn how to use approval setup Read our{" "}
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
                  <button className="btn user_setup_rbtns" type="button">
                    <span
                      onClick={this.primeApprovalGroup}
                      className="round_plus"
                      style={{
                        display: "flex",
                        width: "22px",
                        height: "22px",
                        alignItems: "center",

                        background: "#2f73ad",
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
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={this.deleteApprovalGroup}
                    className="btn user_setup_rbtns"
                    type="button"
                  >
                    <span
                      className="round_file"
                      style={{
                        display: "flex",
                        width: "22px",
                        height: "22px",

                        alignItems: "center",

                        background: "#2f73ad",
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
                        <span
                          className="dots_img"
                          style={{
                            display: "flex",
                          }}
                        >
                          <svg
                            style={{ fill: "#2f73ad" }}
                            // className="dots_img_sass"
                            id="Capa_1"
                            enable-background="new 0 0 515.555 515.555"
                            height="22"
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
                    </Dropdown>
                  </div>
                </li>
              </ul>
            </div>
            {/* new tale add start */}
            <body>
              <table
                id="approvalsetup"
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
                            name="example1"
                          />
                          <span className="click_checkmark global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className="user_setup_hed">Approval Name</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">
                        Approval Group Setup
                      </span>
                    </th>
                    <th className="text-center">
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
                  {this.state.approvalGroups.map((g, i) => {
                    return (
                      <tr
                        key={g.recordID}
                        onClick={(e) => this.getApprovalGroup(e, g)}
                        className="cursorPointer"
                      >
                        <td>
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={`listCheck${i}`}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${i}`}
                                name={"userListCheck"}
                                checked={g.recordID === this.state.recordID}
                                onChange={(e) =>
                                  this.handleGroupListCheckbox(e, g)
                                }
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{g.approvalName}</td>
                        <td></td>
                        <td></td>
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
          openSettingsModal={this.state.openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={this.state.columns}
          pageLength={this.state.pageLength}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={this.handleSaveSettings}
          handleCloseSettingModal={this.handleCloseSettingModal}
        />
        <ApprovalGroupsetup
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          primeApprover={this.primeApprover}
          addEditApprovalGroup={this.addEditApprovalGroup}
          handleFieldChange={this.handleFieldChange}
          getApproverDetails={this.getApproverDetails}
          addEditApprover={this.addEditApprover}
          handleChangeApproverName={this.handleChangeApproverName}
          handleApproversListCheckbox={this.handleApproversListCheckbox}
          removeApprover={this.removeApprover}
          handleValueOptions={this.handleValueOptions}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleShowHiddenRows={this.handleShowHiddenRows}
          copyApprovers={this.copyApprovers} //copy approvers from one module to another
          pasteApprovers={this.pasteApprovers} //paste copied approvers in diff modules
          isChecked={this.state.isChecked}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  getApprovers,
  getApprovalGroups,
  getApprovalGroup,
  insertApprovalGroup,
  updateApprovalGroup,
  primeApprover,
  deleteApprovalGroup,
  clearUserStates,
})(ApprovalSetup);
