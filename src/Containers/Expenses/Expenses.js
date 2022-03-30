import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import FileSaver from "file-saver";
import $ from "jquery";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import _ from "lodash";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";
import store from "../../Store/index";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import Report from "../Modals/Report/Report";
import ExpenseDetails from "../Modals/ExpenseDetails/ExpenseDetails";
import ExpenseMoreDetail from "../Modals/ExpenseMoreDetail/ExpenseMoreDetail";
import Delete from "../Modals/Delete/Delete";
import CreateInvoice from "../Modals/CreateInvoice/CreateInvoice";
import Decline from "../Modals/Decline/Decline";
import Import from "../Modals/Import/Import";
import DebitCards from "../Modals/DebitCards/DebitCards";
import Move from "../Modals/Move/Move";
import Post from "../Modals/Post/Post";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import DebitCardReconciliation from "../Modals/DebitCardReconciliation/DebitCardReconciliation";
import * as SetupActions from "../../Actions/SetupRequest/SetupAction";
import * as ExpenseActions from "../../Actions/ExpenseActions/ExpenseActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import {
  handleAPIErr,
  zoomIn,
  zoomOut,
  handleDropdownZooming,
  downloadAttachments,
} from "../../Utils/Helpers";
import { options } from "../../Constants/Constants";
import * as Validation from "../../Utils/Validation";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const uuidv1 = require("uuid/v1");

class Expense extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      tran: "", //tran of current selected expenses
      multipleTrans: [], //when user selects multiple expenses to perform different functionality

      expenseMoreDetails: [], //contains data when click on more details link
      expenseTallies: [], //e.g Draft, Pending, Approved, etc
      expListSearch: "", //search on Expenses list
      getExpenseList: [], //side menu (left side) Expenses list data
      clonedGetExpenseList: [], //a copy of  getExpenseList
      filteredExpenseList: [], //this contains filterd list and used for searching on it
      activeExpense: "", //to add class active in lists of getting Expenses (in left side )
      activeExpTallies: "", //to add class active on Expenses tallis
      showExpTalliesTabPane: "", //to add class active on Expenses tallis below tab pane

      approverGroup: "",
      approvalsGroups: [], //list of approvals Groups checkboxes to filter Expenses list
      approvers: [], //to just show on side menuw bar
      previewList: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      comments: [], //Expenses Comments
      attachments: [], //Expenses Attachments
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      activity: [], //Expenses Activity
      changes: [], //Expenses Changes
      taxCodeList: [],
      taxCode: { label: "Select Tax Code", value: "" },
      bankCodeList: [],
      bankCode: { label: "Select Bank Code", value: "" },
      sortFilterExp: "expenseType",
      sortFilterExpCheck: "ASC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC
      viewTeam: "N",
      teamExpCheck: "", //to check selected Expense is team Expense or not

      openAttachmentsModal: false,
      openCommentsModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openReportModal: false,
      openExpenseMoreDetailsModal: false,
      openDeleteModal: false,
      openCreateInvoiceModal: false,
      openDebitCardsModal: false,
      openDeclineModal: false,
      openExpenseDetailModal: false,
      openDebitCardReconciliationModal: false,
      openMoveModal: false,
      openPostModal: false,
      openImportModal: false,

      scaling: 3.4,
      dropdownZoomingValue: { label: "40%", value: "40%" },
      toggleRightSidebar: true,
      rotate: 0,
      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags

      formErrors: {
        taxCode: "",
        bankCode: "",
      },
      expenseLines: [],
      expenseCodes: [],

      batchList: [],
      batchNo: "", //batch no of current selected batch
      batchListOptions: [], //restructured batch listfor the drop-down when Move popup opens

      bankDetails: "", //supplier bank details
      currency: "", //supplier currency
      supplierCode: "", //supplier code
    };
  }

  async componentDidMount() {
    window.addEventListener(
      "resize",
      () => {
        $(".mm_ordr1").addClass("mm_order_pdfMain");

        if ($(window).width() > 991) {
          this.setState({ toggleRightSidebar: true });
        }
        if ($(window).width() <= 991) {
          this.setState({ toggleRightSidebar: false });
        }
        if ($(window).width() >= 2045) {
          $(".invoice_pdf_new").addClass("invoice_pdf_new1");
        }
        if ($(window).width() < 2045) {
          $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
        }
      },
      false
    );

    let { viewTeam, sortFilterExp, sortFilterExpCheck } = this.state;
    //Team Expense Check
    viewTeam = localStorage.getItem("teamExpense") || "N";
    //getting default sorting list setting from localstorage
    sortFilterExp = localStorage.getItem("sortFilterExp") || "expenseType";
    sortFilterExpCheck = localStorage.getItem("sortFilterExpCheck") || "ASC";
    this.setState({ viewTeam, sortFilterExp, sortFilterExpCheck });

    $(document).ready(function () {
      var vw = $(window).width();
      var nav = $(".navbar.fixed-top").height();
      var underNav = $(".order-tabs").height();
      var wh = $(window).height();
      var h = wh - nav - 60;
      var rsb = wh - nav - underNav - 20;
      // var pdfDiv = wh - nav - underNav - 80
      var pdfDiv = wh - nav;
      var wh = wh - nav - underNav;
      $("#order--dynamic--height").css("height", h);
      $(".side-attachments,.side-attachments-2").css("height", rsb);
      $(".invoice_pdf_canvas.invoice_pdf_new").css("height", wh);

      $(window).resize(function () {
        var vw = $(window).width();
        // if (vw > 1930) {
        var nav = $(".navbar.fixed-top").height();
        var underNav = $(".order-tabs").height();
        var wh = $(window).height();
        var h = wh - nav - 60;
        var rsb = wh - nav - underNav - 20;
        // var pdfDiv = wh - nav - underNav - 80
        var pdfDiv = wh - nav;
        var wh = wh - nav - underNav;
        $("#order--dynamic--height").css("height", h);
        $(".side-attachments,.side-attachments-2").css("height", rsb);
        $(".invoice_pdf_canvas.invoice_pdf_new").css("height", wh);
        // }
      });
      if ($(window).width() >= 2045) {
        $(".invoice_pdf_new").addClass("invoice_pdf_new1");
      }
      if ($(window).width() < 2045) {
        $(".invoice_pdf_new").addClass("invoice_pdf_new1");
      }
    });

    $(".cus-arro-div2").on("click", function (e) {
      e.preventDefault();
      $(".invoice_carousel").toggleClass("expand_invoice_img");
    });

    $(".cus-arro-div2").on("click", function (e) {
      e.preventDefault();
      $(".order_pdf_new").toggleClass("order_left_auto");
    });
    // end
    // sideBarAccord
    $(".invoice-inherit").click(function () {
      $(".invoice-inherit .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".bank_details").click(function () {
      $(".bank_details .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".invoice-batchlist").click(function () {
      $(".invoice-batchlist .sideBarAccord1").toggleClass("rotate_0");
    });

    $(".export_crd").click(function () {
      $(".export_crd .sideBarAccord1").toggleClass("rotate_0");
    });
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });

    // end

    let {
      dashboard,
      tallType,
      tallies,
      addEditExpCheck,
      expTran,
      noChange,
      defaultData,
    } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";
    if (dashboard && tallType) {
      //when user click on Expense Tallies on Dashboard
      await this.getExpenseTallies(tallType, true); // get Expense Tallies
    } else if (
      tallies &&
      tallies === "Draft" &&
      addEditExpCheck &&
      expTran &&
      noChange &&
      defaultData
    ) {
      /*Check When Add/Edit Expense and then user Save or Cancel that edit, 
      then load the same Expense user just edited/created?.*/

      this.setState({ ...defaultData }, () => {
        // scroll to active Exp
        var elmnt = document.getElementById(defaultData.activeExpense);
        if (elmnt) {
          elmnt.scrollIntoView();
        }
      });
    } else {
      this.getExpenseTallies("", true);
    }

    let promises = [];
    if (!this.props.user.getDefaultValues) {
      let defVals = localStorage.getItem("getDefaultValues") || "";
      defVals = defVals ? JSON.parse(defVals) : "";
      if (defVals && defVals.defaultValues) {
        //if localstorage contains the default values then update the Redux State no need to call API
        store.dispatch({
          type: "GET_DEFAULT_VALUES_SUCCESS",
          payload: defVals,
        });
      } else {
        promises.push(this.props.getDefaultValues());
      }
    }

    if (!this.props.chart.getFlags) {
      promises.push(this.props.getFlags());
    }
    promises.push(this.getBtachList());

    await Promise.all(promises);
    //success case of get default vaues
    if (this.props.user.getDefaultValuesSuccess) {
      // toast.success(this.props.user.getDefaultValuesSuccess);
    }
    //error case of get default vaues
    if (this.props.user.getDefaultValuesError) {
      handleAPIErr(this.props.user.getDefaultValuesError, this.props);
    }

    //success case of Get Flags List
    if (this.props.chart.getFlagsSuccess) {
      // toast.success(this.props.chart.getFlagsSuccess);
    }
    //error case of Get Flags List
    if (this.props.chart.getFlagsError) {
      handleAPIErr(this.props.chart.getFlagsError, this.props);
    }

    //(Tracking Codes) multiple change modal

    if (
      this.props.user.getDefaultValues.flags &&
      this.props.user.getDefaultValues.flags.length > 0
    ) {
      let flags = [];
      let clonedFlags = [];
      this.props.user.getDefaultValues.flags.map((defVal, i) => {
        flags.push(
          {
            type: defVal.type,
            label: defVal.type,
            value: "",
            id: i,
            sequence: defVal.sequence,
          },
          {
            type: defVal.type,
            label: "",
            value: "",
            id: i,
            sequence: defVal.sequence,
          }
        );
        clonedFlags.push({
          type: defVal.type,
          value: "",
          prompt: defVal.prompt,
          sequence: defVal.sequence,
        });
      });
      this.setState({ flags, clonedFlags });
    }
  }

  //get Expense talleis
  getExpenseTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined etc then updated Expense Tallies
    this.setState({ isLoading: true });

    let isExpTallies = false; //to check if redux store contain Exp tallies then dont call API again
    let _expenseTallies = this.props.expenseData.expenseTallies || [];

    if (_expenseTallies.length === 0 || check) {
      await this.props.getExpenseTallies(); //get Expense Tallies
    } else {
      isExpTallies = true;
    }

    let expTally = "";
    let { activeExpTallies, showExpTalliesTabPane } = this.state;
    let expenseTalliesArr = [];

    //success case of Get Expense Tallies
    if (this.props.expenseData.getExpenseTalliesSuccess || isExpTallies) {
      // toast.success(this.props.expenseData.getExpenseTalliesSuccess);
      let expenseTallies = this.props.expenseData.expenseTallies || [];
      let expTypes = [];

      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType == "operator") {
        expTypes = ["draft", "pending", "declined", "approved", "all"];
      } else if (userType == "approver") {
        expTypes = [
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      } else if (userType == "op/approver") {
        expTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      }

      if (expTypes.length > 0) {
        expTypes.map((t, i) => {
          let obj = expenseTallies.find(
            (tl) => tl.type && tl.type.toLowerCase() === t
          );
          if (obj) {
            expenseTalliesArr.push(obj);
          }
        });
      } else {
        expenseTalliesArr = expenseTallies;
      }

      let _type = "";

      if (type) {
        _type = type;
      } else if (expenseTalliesArr.length > 0) {
        _type = expenseTalliesArr[0].type;
      }

      expenseTalliesArr.map(async (t, i) => {
        if (t.type === _type) {
          let id = uuidv1();
          t.id = id;
          expTally = t;
          activeExpTallies = id;
          showExpTalliesTabPane = t.type;
        } else {
          t.id = uuidv1();
        }
        return t;
      });
    }
    //error case of Get Expense Tallies
    if (this.props.expenseData.getExpenseTalliesError) {
      handleAPIErr(this.props.expenseData.getExpenseTalliesError, this.props);
    }

    this.setState({
      isLoading: false,
      expenseTallies: expenseTalliesArr,
      activeExpTallies,
      showExpTalliesTabPane,
    });
    if (expTally) {
      //to call getExpenseList baseed on first Expense Tallies
      await this.getExpenseList(expTally); //expTally => draft || pending || approved || hold || all etc
    }
    this.props.clearExpenseStates();
  };

  //getting the Expense list when click on Draft || Pending || Approved etc
  getExpenseList = async (data) => {
    let activeExpense = "";
    let getExpenseList = [];
    let clonedGetExpenseList = [];
    let filteredExpenseList = [];
    this.clearStates();
    this.setState({
      isLoading: true,
      activeExpTallies: data.id,
      showExpTalliesTabPane: data.type,
      expListSearch: "",
    });
    let teamExpCheck = this.state.viewTeam;
    if (teamExpCheck) {
      data.teamExpense = teamExpCheck;
    }
    await this.props.getExpenseList(data); // get Expense list
    let firstExp = "";
    //success case of get Exp List
    if (this.props.expenseData.getExpenseListSuccess) {
      // toast.success(this.props.expenseData.getExpenseListSuccess);
      let _getExpenseList = this.props.expenseData.getExpenseList || [];

      let sortFilterExp = this.state.sortFilterExp;
      let sortFilterExpCheck = this.state.sortFilterExpCheck;
      _getExpenseList
        .sort((a, b) => {
          if (
            sortFilterExp === "advancedAmount" ||
            sortFilterExp === "accountedAmount" ||
            sortFilterExp === "tran"
          ) {
            let valueA = Number(a[sortFilterExp]);
            let valueB = Number(b[sortFilterExp]);
            //for ascending order
            if (sortFilterExpCheck === "ASC") {
              if (valueA < valueB) {
                return -1;
              }
              if (valueA > valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            } else {
              //for descending order

              if (valueA > valueB) {
                return -1;
              }
              if (valueA < valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            }
          } else if (sortFilterExp === "date") {
            let valueA = new Date(a.date);
            let valueB = new Date(b.date);

            //for ascending order
            if (sortFilterExpCheck === "ASC") {
              if (valueA < valueB) {
                return -1;
              }
              if (valueA > valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            } else {
              //for descending order

              if (valueA > valueB) {
                return -1;
              }
              if (valueA < valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            }
            // codes must be equal
          } else if (sortFilterExp) {
            let valueA = a[sortFilterExp].toString().toUpperCase();
            let valueB = b[sortFilterExp].toString().toUpperCase();
            //for ascending order
            if (sortFilterExpCheck === "ASC") {
              if (valueA < valueB) {
                return -1;
              }
              if (valueA > valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            } else {
              //for descending order

              if (valueA > valueB) {
                return -1;
              }
              if (valueA < valueB) {
                return 1;
              }
              return 0;
              // codes must be equal
            }
          }
        })
        .map((exp, i) => {
          if (i == 0) {
            let id = uuidv1();
            exp.id = id;
            firstExp = exp;
            exp.checked = false;
            activeExpense = id;
          } else {
            exp.id = uuidv1();
            exp.checked = false;
          }
          return exp;
        });

      getExpenseList = _getExpenseList;
      clonedGetExpenseList = _getExpenseList;
      filteredExpenseList = _getExpenseList;

      /*Check When  Add/Edit Expense  and then user Save or Cancel that edit, 
        then load the same Expense user just created/edited?.*/

      let { tallies, addEditExpCheck, expTran } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";

      if (tallies && tallies === "Draft" && addEditExpCheck && expTran) {
        let checkExp = getExpenseList.find((l) => l.tran === expTran);
        if (checkExp) {
          firstExp = checkExp;
          activeExpense = checkExp.id;
        }
      }
    }
    //error case of get Exp List
    if (this.props.expenseData.getExpenseListError) {
      handleAPIErr(this.props.expenseData.getExpenseListError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({
      activeExpense,
      getExpenseList,
      clonedGetExpenseList,
      filteredExpenseList,
      isLoading: false,
    });

    if (firstExp) {
      // to call get Expense baseed on first Expense in  list

      let promises = [];
      promises.push(this.getExpenseSummary(firstExp, true));

      let isFlgs = false;

      let flgs = this.props.chart.getFlags || "";

      if (!flgs) {
        promises.push(this.props.getFlags());
      } else {
        isFlgs = true;
      }

      await Promise.all(promises);

      //success case of Get Flags List
      if (this.props.chart.getFlagsSuccess || isFlgs) {
        // toast.success(this.props.chart.getFlagsSuccess);
        let taxCodes = this.props.chart.getFlags.tax || [];

        let tc = [];
        taxCodes.map((t, i) => {
          tc.push({
            label: t.description + " (" + t.code + ")",
            value: t.code,
          });
        });
        this.setState({ taxCodeList: tc });
      }
      //error case of Get Flags List
      if (this.props.chart.getFlagsError) {
        handleAPIErr(this.props.chart.getFlagsError, this.props);
      }
    }
    this.props.clearChartStates();
    // scroll to active Expense
    var elmnt = document.getElementById(this.state.activeExpense);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //Get Expense Summary
  getExpenseSummary = async (exp, check) => {
    if (this.state.activeExpense != exp.id || check) {
      this.setState({
        isLoading: true,
        rotate: 0,
        activeExpense: exp.id,
        previewList: [],
        numPages: null,
        pageNumber: 1,
        numPagesArr: [], //it contains number of pages of each PDF
        taxCode: { label: "Select Tax Code", value: "" },
        bankCodeList: [],
        bankCode: { label: "Select Bank Code", value: "" },
        attachmentSize: 0,
        bankDetails: "", //supplier bank details
      });
      await this.props.getExpenseSummary(exp.tran); // get expense summary
      //success case of get expense summary
      if (this.props.expenseData.getExpenseSummarySuccess) {
        // toast.success(this.props.expenseData.getExpenseSummarySuccess);
        let expSummary =
          (this.props.expenseData.getExpenseSummary &&
            this.props.expenseData.getExpenseSummary &&
            JSON.parse(
              JSON.stringify(this.props.expenseData.getExpenseSummary)
            )) ||
          "";

        // let approvalsGroups =
        //   (expSummary &&
        //     JSON.parse(JSON.stringify(expSummary.approverOptions))) ||
        //   [];
        // approvalsGroups.map((a, i) => {
        //   a.checked = false;
        //   a.id = uuidv1();
        //   return a;
        // });

        let tran = (expSummary && expSummary.tran) || "";

        let approverGroup = expSummary.approverGroup || "";

        let approvers = expSummary.approvers || [];

        let attachments = (expSummary && expSummary.attachments) || [];
        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        let changes = (expSummary && expSummary.changes) || [];

        let activity = (expSummary && expSummary.activityList) || [];

        let comments = (expSummary && expSummary.comments) || [];

        let previewList = (expSummary && expSummary.previewList) || [];

        //to show primary PDF first
        previewList = previewList.sort((a, b) =>
          a.primaryDoc.toLowerCase() < b.primaryDoc.toLowerCase() ? 1 : -1
        );

        let bankCodeList = (expSummary && expSummary.bankCodes) || [];

        let currency = (expSummary && expSummary.currency) || "";
        let supplierCode = (expSummary && expSummary.supplierCode) || "";

        this.setState(
          {
            tran,
            approverGroup,
            approvers,
            // approvalsGroups,
            attachments,
            previewList,
            comments,
            attachments,
            attachmentSize,
            activity,
            changes,
            bankCodeList,
            currency,
            supplierCode,
          },
          () => {
            this.getSupplier();
          }
        );
      }
      //error case of get expense summary
      if (this.props.expenseData.getExpenseSummaryError) {
        handleAPIErr(this.props.expenseData.getExpenseSummaryError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  handleSelectFields = async (name, data) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, data.value, formErrors);
    this.setState({ [name]: data, formErrors });
  };

  createInvoice = async () => {
    let { taxCode, bankCode, tran, formErrors } = this.state;
    taxCode = taxCode.value || "";
    bankCode = bankCode.value || "";

    formErrors = Validation.handleWholeValidation(
      { taxCode: taxCode, bankCode: bankCode },
      formErrors
    );

    if (!formErrors.taxCode && !formErrors.bankCode) {
      this.setState({ isLoading: true });
      let obj = {
        tran,
        taxCode,
        bankCode,
      };
      await this.props.createInvoice(obj);
      if (this.props.expenseData.createInvoiceSuccess) {
        toast.success(this.props.expenseData.createInvoiceSuccess);
      }
      if (this.props.expenseData.createInvoiceError) {
        handleAPIErr(this.props.expenseData.createInvoiceError, this.props);
      }
      this.closeModal("openCreateInvoiceModal");
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
    this.setState({
      formErrors,
    });
  };

  importDebitTransactions = async (data) => {
    this.setState({ isLoading: true });
    let tran = this.state.tran;
    data = { tran, ...data };
    await this.props.importDebitTransactions(data);

    if (this.props.expenseData.impDebitTransSuccess) {
      toast.success(this.props.expenseData.impDebitTransSuccess);
    }
    if (this.props.expenseData.impDebitTransError) {
      handleAPIErr(this.props.expenseData.impDebitTransError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  //Delete Expense
  deleteExpense = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.deleteExpense(tran); // delete expense
      //success case of delete expense
      if (this.props.expenseData.deleteExpenseSuccess) {
        toast.success(this.props.expenseData.deleteExpenseSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of delete expense
      if (this.props.expenseData.deleteExpenseError) {
        handleAPIErr(this.props.expenseData.deleteExpenseError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearExpenseStates();
    }
  };

  //when click on more details link
  handleMoreDetails = async (exp) => {
    let detailsList = exp.detailsList || [];
    this.setState({ expenseMoreDetails: detailsList }, () => {
      this.openModal("openExpenseMoreDetailsModal");
    });
  };

  clearStates = () => {
    this.setState({
      isLoading: false,
      tran: "", //tran of current selected Expense
      multipleTrans: [], //when user selects multiple expenses to perform different functionality
      expenseMoreDetails: [], //contains data when click on more details link
      expListSearch: "", //search on Exp list
      getExpenseList: [], //side menu (left side) Exp list data
      clonedGetExpenseList: [], //a copy of  getExpenseList
      activeExpense: "", //to add class active in lists of getting Exp (in left side )
      activeExpTallies: "", //to add class active on Exp tallis
      showExpTalliesTabPane: "", //to add class active on Exp tallis below tab pane
      filteredExpenseList: [], //this contains filterd list and used for searching on it
      teamExpense: "",

      openAttachmentsModal: false,
      openCommentsModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openReportModal: false,
      openExpenseMoreDetailsModal: false,
      openCreateInvoiceModal: false,
      openDeleteModal: false,
      openDebitCardsModal: false,
      openDeclineModal: false,
      openExpenseDetailModal: false,
      openDebitCardReconciliationModal: false,
      openMoveModal: false,
      openPostModal: false,
      approverGroup: "",
      approvalsGroups: [],
      approvers: [], //to just show on side menuw bar
      previewList: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      comments: [], //Expenses Comments
      attachments: [], //Expenses Attachments
      activity: [], //Expenses Activity
      changes: [], //Expenses Changes
      taxCode: { label: "Select Tax Code", value: "" },
      taxCodeList: [],
      bankCodeList: [],
      bankCode: { label: "Select Bank Code", value: "" },

      bankDetails: "", //supplier bank details
      currency: "", //supplier currency
      supplierCode: "", //supplier code

      formErrors: {
        taxCode: "",
        bankCode: "",
      },
    });
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = async (name) => {
    this.setState({
      [name]: false,
      expenseMoreDetails: [],
      taxCode: { label: "Select Tax Code", value: "" },
      bankCode: { label: "Select Bank Code", value: "" },
      formErrors: {
        taxCode: "",
        bankCode: "",
      },
    });
  };

  // -------------EXPENSE Detail Popup----------
  //handle expense detail popup checkboxes
  handleCheckboxesInExpenseDetails = (e, line) => {
    let { expenseLines } = this.state;
    if (e.target.checked) {
      if (line === "all") {
        expenseLines.map(async (l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        expenseLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = true;
          }
          return l;
        });
      }
    } else {
      if (line === "all") {
        expenseLines.map(async (l, i) => {
          l.checked = false;
          return l;
        });
      } else {
        expenseLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = false;
          }
          return l;
        });
      }
    }

    this.setState({
      expenseLines,
    });
  };

  handleChangeField = (e, line, i) => {
    let name = e.target.name;
    let value = e.target.value;
    let { expenseLines } = this.state;

    line[name] = value || "";

    this.setState({ expenseLines });
  };

  handleChangeFlags = (e, line) => {
    let name = e.target.name;
    let value = e.target.value;
    let { expenseLines } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value.toUpperCase();
      }
      return f;
    });

    line.flags = flags;

    this.setState({ expenseLines });
  };

  handleMultipleChanges = (data) => {
    let { expenseLines } = this.state;
    expenseLines.map((p, i) => {
      if (p.checked) {
        if (data.chartSort) {
          p.chartSort = data.chartSort;
        }
        p.chartCode = data.chartCode || "";
        if (data.trackingCodes && data.trackingCodes.length > 0) {
          p.flags = data.trackingCodes;
        }
      }
      return p;
    });
    this.setState({ expenseLines });
  };

  //update expense lines
  updateExpenseLines = async () => {
    let { expenseLines } = this.state;
  };

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

  // ---------------END-----------------
  //when a user searches on Expense List
  handleExpListSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ expListSearch: searchedText }, () => {
      const filteredExpenseList = JSON.parse(
        JSON.stringify(this.state.filteredExpenseList)
      );
      if (!searchedText) {
        this.setState({ getExpenseList: filteredExpenseList }, () => {
          let { getExpenseList, tran } = this.state;
          //to show selected expense in the list
          let exp = getExpenseList.find((s) => s.tran === tran);
          if (exp) {
            this.setState({ activeExpense: exp.id });
            // scroll to  seleced expense
            var elmnt = document.getElementById(exp.id);
            if (elmnt) {
              elmnt.scrollIntoView();
            }
          }
        });
      }
    });
  };

  onExpListSearch = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let expListSearch = this.state.expListSearch.trim();

      if (expListSearch) {
        const filteredExpenseList = JSON.parse(
          JSON.stringify(this.state.filteredExpenseList)
        );

        let expListFilterdData = [];
        expListFilterdData = filteredExpenseList.filter((c) => {
          return (
            c.supplier.toUpperCase().includes(expListSearch.toUpperCase()) ||
            c.expenseType.toUpperCase().includes(expListSearch.toUpperCase())
          );
        });
        this.setState({ getExpenseList: expListFilterdData });
      }
    }
  };

  //adding comment to the Expense
  addComment = async (comment) => {
    let { tran } = this.state;
    if (tran) {
      if (comment) {
        this.setState({ isLoading: true });
        let data = {
          comment,
          tran: tran,
        };
        await this.props.addComment(data);
        //Success Case Of Adding Comment
        if (this.props.expenseData.addExpCommentSuccess) {
          toast.success(this.props.expenseData.addExpCommentSuccess);
          let comments = this.props.expenseData.addExpComments || [];
          this.setState({ comments });
        }
        //Error Case Of Adding Comment
        if (this.props.expenseData.addExpCommentError) {
          handleAPIErr(this.props.expenseData.addExpCommentError, this.props);
        }
        this.props.clearExpenseStates();
        this.setState({ isLoading: false });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //add Expense Attachments
  addAttachment = async (attachment, fileName) => {
    let { tran } = this.state;

    if (tran) {
      this.setState({ isLoading: true });
      let obj = {
        tran,
        attachment,
        fileName,
        primaryAttachment: "N",
      };
      await this.props.addExpAttachment(obj);
      if (this.props.expenseData.addExpAttachmentSuccess) {
        // toast.success(this.props.expenseData.addExpAttachmentSuccess);
        let attachments = this.props.expenseData.addExpAttachment || [];
        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        this.setState({ attachments, attachmentSize });
      }
      if (this.props.expenseData.addExpAttachmentError) {
        handleAPIErr(this.props.expenseData.addExpAttachmentError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  //Get Expense Attachment
  getAttachment = async (id, type, fileName) => {
    if (id) {
      this.setState({ isLoading: true });

      await this.props.getExpAttachment(id);
      if (this.props.expenseData.getExpAttachmentSuccess) {
        // toast.success(this.props.expenseData.getExpAttachmentSuccess);
        let resp = this.props.expenseData.getExpAttachment;
        downloadAttachments(resp, fileName);
      }
      if (this.props.expenseData.getExpAttachmentError) {
        handleAPIErr(this.props.expenseData.getExpAttachmentError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  //sorting on Expense List
  handleSortExpenseLists = (name) => {
    let { sortFilterExpCheck } = this.state;
    if (this.state.sortFilterExp != name) {
      sortFilterExpCheck = "DESC";
    }

    if (sortFilterExpCheck === "DESC") {
      sortFilterExpCheck = "ASC";
    } else {
      sortFilterExpCheck = "DESC";
    }

    localStorage.setItem("sortFilterExp", name);
    localStorage.setItem("sortFilterExpCheck", sortFilterExpCheck);

    const filteredExpenseList = JSON.parse(
      JSON.stringify(this.state.filteredExpenseList)
    );
    let expListFilterdData = [];
    if (
      name === "advancedAmount" ||
      name === "accountedAmount" ||
      name === "tran"
    ) {
      expListFilterdData = filteredExpenseList.sort(function (a, b) {
        let valueA = Number(a[name]);
        let valueB = Number(b[name]);
        //for ascending order
        if (sortFilterExpCheck === "ASC") {
          if (valueA < valueB) {
            return -1;
          }
          if (valueA > valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        } else {
          //for descending order

          if (valueA > valueB) {
            return -1;
          }
          if (valueA < valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        }
      });
    } else if (name === "date") {
      expListFilterdData = filteredExpenseList.sort(function (a, b) {
        let valueA = new Date(a.date);
        let valueB = new Date(b.date);

        //for ascending order
        if (sortFilterExpCheck === "ASC") {
          if (valueA < valueB) {
            return -1;
          }
          if (valueA > valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        } else {
          //for descending order

          if (valueA > valueB) {
            return -1;
          }
          if (valueA < valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        }
        // codes must be equal
      });
    } else {
      expListFilterdData = filteredExpenseList.sort(function (a, b) {
        let valueA = a[name].toString().toUpperCase();
        let valueB = b[name].toString().toUpperCase();
        //for ascending order
        if (sortFilterExpCheck === "ASC") {
          if (valueA < valueB) {
            return -1;
          }
          if (valueA > valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        } else {
          //for descending order

          if (valueA > valueB) {
            return -1;
          }
          if (valueA < valueB) {
            return 1;
          }
          return 0;
          // codes must be equal
        }
      });
    }

    this.setState({
      getExpenseList: expListFilterdData,
      sortFilterExp: name,
      sortFilterExpCheck,
    });
  };

  //sendExpForApproval =>Draft -> send
  sendExpForApproval = async () => {
    let { tran, multipleTrans } = this.state;

    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        _trans = multipleTrans;
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      this.setState({
        isLoading: true,
      });

      await this.props.sendExpForApproval(_trans); // send Expense For Approval
      //success case of send Exp For Approval
      if (this.props.expenseData.sendExpForApprovalSuccess) {
        toast.success(this.props.expenseData.sendExpForApprovalSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of send Exp For Approval
      if (this.props.expenseData.sendExpForApprovalError) {
        handleAPIErr(
          this.props.expenseData.sendExpForApprovalError,
          this.props
        );
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  // Approve Expense => Approve -> Approve
  approveExpense = async () => {
    let { tran, multipleTrans } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      let _trans = "";
      if (multipleTrans.length > 0) {
        if (multipleTrans.length == 1) {
          _trans = multipleTrans[0];
        } else {
          _trans = multipleTrans;
        }
      } else {
        _trans = tran;
      }

      this.setState({
        isLoading: true,
      });

      await this.props.approveExpense(_trans); // approve Expense
      //success case of Approve Expense
      if (this.props.expenseData.approveExpSuccess) {
        toast.success(this.props.expenseData.approveExpSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of Approve Expense
      if (this.props.expenseData.approveExpError) {
        handleAPIErr(this.props.expenseData.approveExpError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  // Approve Expense => Approve -> Decline
  declineExpense = async (comment) => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.declineExpense({ tran, comment }); // decline Expense
      //success case of Decline Expense
      if (this.props.expenseData.declineExpSuccess) {
        toast.success(this.props.expenseData.declineExpSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of Decline Expense
      if (this.props.expenseData.declineExpError) {
        handleAPIErr(this.props.expenseData.declineExpError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  // Move Expense
  moveExpense = async () => {
    let { tran, multipleTrans } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      let _trans = "";
      if (multipleTrans.length > 0) {
        if (multipleTrans.length == 1) {
          _trans = multipleTrans[0];
        } else {
          _trans = multipleTrans;
        }
      } else {
        _trans = tran;
      }

      this.setState({
        isLoading: true,
      });
      await this.props.moveExpense(_trans); // Move Expense
      //success case of Move Expense
      if (this.props.expenseData.moveExpSuccess) {
        toast.success(this.props.expenseData.moveExpSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of Move Expense
      if (this.props.expenseData.moveExpError) {
        handleAPIErr(this.props.expenseData.moveExpError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  // Hold Expense
  holdExpense = async () => {
    let { tran, multipleTrans } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      let _trans = "";
      if (multipleTrans.length > 0) {
        if (multipleTrans.length == 1) {
          _trans = multipleTrans[0];
        } else {
          _trans = multipleTrans;
        }
      } else {
        _trans = tran;
      }

      this.setState({
        isLoading: true,
      });

      await this.props.holdExpense(_trans); // Hold Expense
      //success case of Hold Expense
      if (this.props.expenseData.holdExpSuccess) {
        toast.success(this.props.expenseData.holdExpSuccess);
        await this.getExpenseTallies(this.state.showExpTalliesTabPane, true); //to refresh the list
      }
      //error case of Hold Expense
      if (this.props.expenseData.holdExpError) {
        handleAPIErr(this.props.expenseData.holdExpError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //Export List
  exportList = async () => {
    let { tran, multipleTrans } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      let _trans = "";
      if (multipleTrans.length > 0) {
        if (multipleTrans.length == 1) {
          _trans = multipleTrans[0];
        } else {
          _trans = multipleTrans;
        }
      } else {
        _trans = tran;
      }

      this.setState({
        isLoading: true,
      });
      await this.props.exportList(_trans); //Export List
      //success case of Export List
      if (this.props.expenseData.exportListSuccess) {
        toast.success(this.props.expenseData.exportListSuccess);
      }
      //error case of Export List
      if (this.props.expenseData.exportListError) {
        handleAPIErr(this.props.expenseData.exportListError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //Export Envelope
  exportEnvelope = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.exportEnvelope(tran); //Export Envelope
      //success case of export envelope
      if (this.props.expenseData.exportEnvelopeSuccess) {
        toast.success(this.props.expenseData.exportEnvelopeSuccess);
      }
      //error case of export envelope
      if (this.props.expenseData.exportEnvelopeError) {
        handleAPIErr(this.props.expenseData.exportEnvelopeError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //Email Envelope
  emailEnvelope = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.emailEnvelope(tran); //Email Envelope
      //success case of email envelope
      if (this.props.expenseData.emailEnvelopeSuccess) {
        toast.success(this.props.expenseData.emailEnvelopeSuccess);
      }
      //error case of email envelope
      if (this.props.expenseData.emailEnvelopeError) {
        handleAPIErr(this.props.expenseData.emailEnvelopeError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //Balance Tax
  balanceTax = async () => {
    let { tran, multipleTrans } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      let _trans = "";
      if (multipleTrans.length > 0) {
        if (multipleTrans.length == 1) {
          _trans = multipleTrans[0];
        } else {
          _trans = multipleTrans;
        }
      } else {
        _trans = tran;
      }

      this.setState({
        isLoading: true,
      });

      await this.props.balanceTax(_trans); //Balance Tax
      //success case of Balance Tax
      if (this.props.expenseData.balanceTaxSuccess) {
        toast.success(this.props.expenseData.balanceTaxSuccess);
      }
      //error case of Balance Tax
      if (this.props.expenseData.balanceTaxError) {
        handleAPIErr(this.props.expenseData.balanceTaxError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    } else {
      toast.error("Please select Expense First!");
    }
  };

  //Draft-> Add
  insertExpense = async () => {
    this.props.history.push("/expense-form", {
      tran: "insertExpense",
      defaultData: this.state,
    });
  };

  //Draft-> Edit
  updateExpense = async () => {
    this.props.history.push("/expense-form", {
      tran: this.state.tran,
      defaultData: this.state,
    });
  };

  // move to previous Exp
  moveToPrevExpense = async () => {
    let { getExpenseList, activeExpense } = this.state;
    let foundIndex = getExpenseList.findIndex((l) => l.id === activeExpense);

    if (foundIndex != -1 && foundIndex != 0) {
      let exp = getExpenseList[foundIndex - 1];
      if (exp) {
        await this.getExpenseSummary(exp);
      }
    }
  };

  // move to next Exp
  moveToNextExpense = async () => {
    let { getExpenseList, activeExpense } = this.state;
    let foundIndex = getExpenseList.findIndex((l) => l.id === activeExpense);

    if (foundIndex != -1) {
      let exp = getExpenseList[foundIndex + 1];
      if (exp) {
        await this.getExpenseSummary(exp);
      }
    }
  };

  handleCheckbox = (e, data) => {
    let { getExpenseList, multipleTrans } = this.state;
    let { name, checked } = e.target;
    if (data === "allCheck" && name === "checkboxAll") {
      let multipleTransCopy = [];
      if (checked) {
        getExpenseList.map((m) => {
          m.checked = true;
          multipleTransCopy.push(m.tran);
          return m;
        });
      } else {
        getExpenseList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleTrans = [...multipleTransCopy];
    } else {
      if (checked) {
        getExpenseList.map(async (exp, i) => {
          if (data.id === exp.id) {
            exp.checked = true;
          }
          return exp;
        });
        multipleTrans.push(data.tran);
      } else {
        getExpenseList.map((exp, i) => {
          if (data.id === exp.id) {
            exp.checked = false;
          }
          return exp;
        });
        let filteredMultiTrans = multipleTrans.filter((t) => t != data.tran);
        multipleTrans = filteredMultiTrans;
      }
    }
    this.setState({
      getExpenseList,
      multipleTrans,
    });
  };

  zoomIn = async () => {
    $(".invoice_pdf_new").removeClass("invoice_carousel_pdf");
    $(".invoice_pdf_new").removeClass("full_screen_convas");

    let { scaling } = this.state;

    let { scale, dropdownZoomingValue } = zoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        if (
          scaling == 2.5 ||
          scaling == 2.2 ||
          scaling == 1.9 ||
          scaling == 1.6 ||
          scaling == 1.3
        ) {
          if ($(window).width() >= 2045) {
            $(".invoice_pdf_new").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  zoomOut = async () => {
    $(".invoice_pdf_new").removeClass("invoice_carousel_pdf");
    $(".invoice_pdf_new").removeClass("full_screen_convas");

    let { scaling } = this.state;

    let { scale, dropdownZoomingValue } = zoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        if (
          scaling == 2.5 ||
          scaling == 2.2 ||
          scaling == 1.9 ||
          scaling == 1.6 ||
          scaling == 1.3
        ) {
          if ($(window).width() >= 2045) {
            $(".invoice_pdf_new").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  handleDropdownZooming = async (data) => {
    $(".invoice_pdf_new").removeClass("invoice_carousel_pdf");
    $(".invoice_pdf_new").removeClass("full_screen_convas");
    let value = data.value;

    let { scale, dropdownZoomingValue } = handleDropdownZooming(value);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        if (
          value == "25%" ||
          value == "20%" ||
          value == "15%" ||
          value == "10%" ||
          value == "5%"
        ) {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  handleRightSidebar = () => {
    this.setState((prevState, props) => ({
      toggleRightSidebar: !prevState.toggleRightSidebar,
    }));
  };

  handleHorizontalArrow = () => {
    $(".invoice_pdf_new").addClass("invoice_carousel_pdf");

    $(".invoice_pdf_new").removeClass("full_screen_convas");

    if ($(window).width() > 1500) {
      this.setState({
        scaling: 7,
        dropdownZoomingValue: { label: "100%", value: "100%" },
      });
    } else if ($(window).width() <= 1500) {
      this.setState({
        scaling: 3.4,
        dropdownZoomingValue: { label: "40%", value: "40%" },
      });
    }
  };

  onLoadSuccessPage = (page) => {
    var vw = $(window).width();
    var vw = $(".side-attachments").width();
    var nav = $(".navbar.fixed-top").height();
    var underNav = $(".order-tabs").height();
    var wh = $(window).height();
    var h = wh - nav - 60;
    var rsb = wh - nav - underNav - 20;
    // var pdfDiv = wh - nav - underNav - 80
    var pdfDiv = wh - nav;
    var wh = wh - nav - underNav;
    $("#order--dynamic--height").css("height", h);
    $(".side-attachments,.side-attachments-2").css("height", rsb);
    // $('#maped_image').css('height', pdfDiv)
    $(".invoice_pdf_canvas.invoice_pdf_new").css("height", wh);
  };

  handlePDFRotate = () => {
    this.setState({ rotate: this.state.rotate + 90 });
  };

  onDocumentLoadSuccess = (data, index) => {
    let numPages = data.numPages;
    let { numPagesArr } = this.state;
    numPagesArr[index] = numPages;

    if (index === 0) {
      this.setState({ numPages });
    }
    this.setState({ numPagesArr }, () => {
      this.settPreviewArrows();
    });
  };

  goToPrevPage = () => {
    let { pageNumber } = this.state;
    if (pageNumber - 1 >= 1) {
      this.setState({ pageNumber: pageNumber - 1 });
    }
  };

  goToNextPage = () => {
    let { pageNumber, numPages } = this.state;
    if (pageNumber + 1 <= numPages) {
      this.setState({ pageNumber: pageNumber + 1 });
    }
  };

  onSlideChange = () => {
    //carusal get active slide
    this.setState({ pageNumber: 1, rotate: 0 });
    //it takes time to render in DOM
    setTimeout(() => {
      var currentIndex = $(".carousel-item.active").attr("id");
      let numPages = this.state.numPagesArr[currentIndex] || 1;
      this.setState({ numPages });
      this.settPreviewArrows();
    }, 700);
  };

  settPreviewArrows = () => {
    // Make the arrows be a bit smarter. Dont appear
    //if only one attachment, hide the left or right arrow if on "first" or "last" document.
    if ($(".carousel-item.active").attr("id") === "0") {
      $(".carousel-control-prev").hide();
      $(".carousel-control-next").show();
    } else if ($(".carousel-inner .carousel-item:last").hasClass("active")) {
      $(".carousel-control-prev").show();
      $(".carousel-control-next").hide();
    } else {
      $(".carousel-control-prev").show();
      $(".carousel-control-next").show();
    }
  };

  handleHorizontalCross = () => {
    $(".mm_invoice_div").addClass("over_auto_remove");
    $(".invoice_pdf_new").addClass("full_screen_convas");
    var vw = $(window).width();
    var nav = $(".navbar.fixed-top").height();
    var underNav = $(".order-tabs").height();
    var wh = $(window).height();
    var pdfDiv = wh - nav;
    var wh = wh - nav - underNav;

    $(".invoice_pdf_new").removeClass("invoice_carousel_pdf");
    $(".invoice_pdf_canvas.invoice_pdf_new").css("height", wh);

    if ($(window).width() > 1500) {
      this.setState({
        scaling: 7,
        dropdownZoomingValue: { label: "100%", value: "100%" },
      });
    } else if ($(window).width() <= 1500) {
      this.setState({
        scaling: 3.1,
        dropdownZoomingValue: { label: "35%", value: "35%" },
      });
    }
  };

  //call get expense list API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamExpense", check);
    this.setState({ viewTeam: check }, () => {
      let { activeExpTallies, showExpTalliesTabPane } = this.state;
      let obj = {
        id: activeExpTallies,
        type: showExpTalliesTabPane,
      };
      this.getExpenseList(obj);
    });
  };

  onExport = (name) => {
    if (name === "LIST") {
      this.exportList();
    } else {
      //Envelope
      this.exportEnvelope();
    }
  };

  getBtachList = async () => {
    let batchList = [];
    let batchListOptions = [];
    await this.props.getBtachList("Expenses");
    if (this.props.setup.getBatchListSuccess) {
      // toast.success(this.props.setup.getBatchListSuccess)
      batchList = this.props.setup.getBatchList || [];
      batchList.map((b) =>
        batchListOptions.push({
          label: b.description + " (" + b.batchNo + ")",
          value: b.batchNo,
        })
      );
    }
    if (this.props.setup.getBatchListError) {
      handleAPIErr(this.props.setup.getBatchListError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ batchList, batchListOptions });
  };

  handleChangeBatchFields = (e, batch, index) => {
    let { batchList } = this.state;
    let { name, value } = e.target;
    batch[name] = value;
    batchList[index] = batch;
    this.setState({ batchList });
  };

  handleBatchCheckbox = (e, bNo) => {
    let { getExpenseList, filteredExpenseList } = this.state;

    let batchNo = "";

    const clonedGetExpenseList = JSON.parse(
      JSON.stringify(this.state.clonedGetExpenseList)
    );

    if (e.target.checked) {
      batchNo = bNo;

      let expListFilterdData = clonedGetExpenseList.filter((c) => {
        return Number(c.batchNo) === Number(bNo);
      });

      getExpenseList = expListFilterdData;
      filteredExpenseList = expListFilterdData;
    } else {
      //uncheck checkbox
      getExpenseList = clonedGetExpenseList;
      filteredExpenseList = clonedGetExpenseList;
    }
    this.setState(
      {
        batchNo,
        getExpenseList,
        filteredExpenseList,
      },
      () => this.handleSortExpenseLists(this.state.sortFilterExp)
    );
  };

  insertBatch = async (event) => {
    let { batchList } = this.state;

    let obj = _.maxBy(batchList, "batchNo"); //to fine the highest batch no
    let batchNo = Number(obj ? obj.batchNo : "") + 1;
    batchList = [
      ...batchList,
      {
        batchNo,
        description: "",
        type: "PC",
        notes: "",
        insertBatch: true,
      },
    ];

    this.setState({ batchList });
  };

  deleteBatch = async () => {
    let { batchList, batchNo, getExpenseList, filteredExpenseList } =
      this.state;

    let batch = batchList.find((b) => b.batchNo === batchNo);
    if (batch && batch.insertBatch) {
      //just remove the newly inserted batch, no need to call API
      batchList = batchList.filter((c) => c.batchNo !== batchNo);
      batchNo = "";

      this.setState({ batchList, batchNo });
    } else if (batchNo === 0 || batchNo) {
      this.setState({ isLoading: true });
      await this.props.deleteBatch(batchNo);
      if (this.props.setup.deleteBatchSuccess) {
        toast.success(this.props.setup.deleteBatchSuccess);

        batchList = batchList.filter((c) => c.batchNo !== batchNo);
        batchNo = "";

        const clonedGetExpenseList = JSON.parse(
          JSON.stringify(this.state.clonedGetExpenseList)
        );

        getExpenseList = clonedGetExpenseList;
        filteredExpenseList = clonedGetExpenseList;
      }
      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchList,
        batchNo,
        getExpenseList,
        filteredExpenseList,
      });
    } else {
      toast.error("Please Select Batch First!");
    }
  };

  addUpdateBatch = async (e, batch, index) => {
    let { batchList } = this.state;

    let { name, value } = e.target;

    batch[name] = value;

    let bch = batchList[index];

    if (bch.insertBatch) {
      //insert new batch case

      let { batchNo } = batch;

      batchNo = batchNo.toString();
      batchNo = batchNo.trim();
      batchNo = batchNo ? Number(batchNo) : "";

      if (batchNo === 0 || batchNo) {
        let exists = batchList.find(
          (b) => b.batchNo === batchNo && !b.insertBatch
        ); //in case if batch no is already exists

        if (!exists) {
          this.setState({ isLoading: true });

          await this.props.insertBatch({ batch });

          if (this.props.setup.insertBatchSuccess) {
            toast.success(this.props.setup.insertBatchSuccess);
            batch.insertBatch = false;
          }
          if (this.props.setup.insertBatchError) {
            handleAPIErr(this.props.setup.insertBatchError, this.props);
          }
          this.props.clearSetupStates();

          this.setState({ isLoading: false });
        } else {
          toast.error("Batch No Already Exists!");
        }
      } else {
        toast.error("Please Enter Btach No!");
      }
    } else {
      //update batch case

      this.setState({ isLoading: true });

      await this.props.updateBatch({ batch });
      if (this.props.setup.updateBatchSuccess) {
        toast.success(this.props.setup.updateBatchSuccess);
        batchList[index] = batch;
      }
      if (this.props.setup.updateBatchError) {
        handleAPIErr(this.props.setup.updateBatchError, this.props);
      }

      this.props.clearSetupStates();
      this.setState({ isLoading: false, batchList });
    }
  };

  openPostModal = () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.openModal("openPostModal");
    } else {
      toast.error("Please Select Expense First!");
    }
  };

  postExpense = async (data) => {
    let { multipleTrans } = this.state;
    let { period, reportID, generateReport } = data;

    let obj = {
      tran: multipleTrans,
      period,
      reportID,
      generateReport: generateReport ? "Y" : "N",
    };
    this.setState({ isLoading: true });
    await this.props.postExpense(obj);
    if (this.props.expenseData.postExpSuccess) {
      toast.success(this.props.expenseData.postExpSuccess);

      let jsonData = this.props.expenseData.postExp.reportJSON || "";
      let reportFile = this.props.expenseData.postExp.reportTemplate || "";

      if (jsonData && reportFile) {
        localStorage.setItem("reportFile", reportFile);
        localStorage.setItem("jsonData", jsonData);
        localStorage.setItem("key", "test");
        var path =
          window.location.protocol +
          "//" +
          window.location.host +
          "/report-view";

        window.open(path, "_blank");
      }
      this.closeModal("openPostModal");
    }
    if (this.props.expenseData.postExpError) {
      handleAPIErr(this.props.expenseData.postExpError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  openMoveBatchPopup = () => {
    let { multipleTrans } = this.state;
    if (multipleTrans.length > 0) {
      this.openModal("openMoveModal");
    } else {
      toast.error("Please Select Expense First!");
    }
  };

  moveBatch = async (batchNo) => {
    let { multipleTrans } = this.state;
    this.setState({ isLoading: true });
    await this.props.moveBatch({ tran: multipleTrans, batchNo });
    if (this.props.expenseData.moveBatchSuccess) {
      toast.success(this.props.expenseData.moveBatchSuccess);
    }
    if (this.props.expenseData.moveBatchError) {
      handleAPIErr(this.props.expenseData.moveBatchError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  onImport = async (excelData, type) => {
    if (type === "List") {
      await this.importList(excelData);
    } else if (type === "Envelope") {
      await this.importEnvelope(excelData);
    } else if (type === "Split Tax Envelope") {
      await this.importSplitExpense(excelData);
    } else if (type === "Fuel Envelope") {
      await this.importFuelExpense(excelData);
    }
  };

  importList = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importList(excelData);
    if (this.props.expenseData.importListSuccess) {
      toast.success(this.props.expenseData.importListSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.expenseData.importListError) {
      handleAPIErr(this.props.expenseData.importListError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  importEnvelope = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importEnvelope(excelData);
    if (this.props.expenseData.importEnvelopeSuccess) {
      toast.success(this.props.expenseData.importEnvelopeSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.expenseData.importEnvelopeError) {
      handleAPIErr(this.props.expenseData.importEnvelopeError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  importSplitExpense = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importSplitExpense(excelData);
    if (this.props.expenseData.importSplitExpSuccess) {
      toast.success(this.props.expenseData.importSplitExpSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.expenseData.importSplitExpError) {
      handleAPIErr(this.props.expenseData.importSplitExpError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  importFuelExpense = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importFuelExpense(excelData);
    if (this.props.expenseData.importFuelExpSuccess) {
      toast.success(this.props.expenseData.importFuelExpSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.expenseData.importFuelExpError) {
      handleAPIErr(this.props.expenseData.importFuelExpError, this.props);
    }
    this.props.clearExpenseStates();
    this.setState({ isLoading: false });
  };

  getExpenseCodes = async () => {
    let { expenseCodes } = this.state;

    if (expenseCodes.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getExpenseCodes();
      if (this.props.expenseData.getExpenseCodesSuccess) {
        toast.success(this.props.expenseData.getExpenseCodesSuccess);
        let codes = this.props.expenseData.getExpenseCodes || [];
        codes.map((c) =>
          expenseCodes.push({
            label: c.expenseCode + " (" + c.description + ")",
            value: c.expenseCode,
          })
        );
      }
      if (this.props.expenseData.getExpenseCodesError) {
        handleAPIErr(this.props.expenseData.getExpenseCodesError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false, expenseCodes });
    }
  };

  getSupplier = async () => {
    // To display the supplier bank details on the right side bar
    let { currency, supplierCode } = this.state;

    if (currency && supplierCode) {
      let supplierDetails = {
        currency,
        code: supplierCode,
      };

      await this.props.getSupplier(supplierDetails);

      //success case of Get single Supplier
      if (this.props.supplier.getSupplierSuccess) {
        // toast.success(this.props.supplier.getSupplierSuccess);
        let bankDetails = this.props.supplier.getSupplier.bankDetails || "";
        this.setState({
          bankDetails,
        });
      }
      //error case of Get single Supplier
      if (this.props.supplier.getSupplierError) {
        handleAPIErr(this.props.supplier.getSupplierError, this.props);
      }
      this.props.clearSupplierStates();
    }
  };

  render() {
    let {
      batchList,
      batchNo,
      showExpTalliesTabPane,
      activeExpense,
      getExpenseList,
      bankDetails,
    } = this.state;

    let tab =
      (showExpTalliesTabPane && showExpTalliesTabPane.toLowerCase()) || "";
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            expense={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={this.state.viewTeam}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content dash__invoice--content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu Expense*/}

            <aside
              className="side-nav suppliers_side_nav side__content--invoice"
              id="show-side-navigation1"
            >
              <div className="cus-arro-div2">
                <img
                  src="images/arrow-r.png"
                  className=" img-fluid cus-arro-r"
                  alt="user"
                />
              </div>
              <div className="search">
                <div className="row">
                  <div className="col-auto mb-2 pr-0">
                    <div className="form-group remember_check custom-checkbox-ui">
                      <input
                        type="checkbox"
                        id={"order"}
                        name="checkboxAll"
                        onChange={(e) => this.handleCheckbox(e, "allCheck")}
                      />
                      <label
                        htmlFor={"order"}
                        className="mr-0 custom-box"
                      ></label>
                    </div>
                  </div>
                  <div className="col-auto pr-md-0 align-self-center ml-1">
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn custom-my-radio user_drop_options"
                    >
                      <Dropdown.Toggle
                        variant="sucess"
                        id="dropdown-basic"
                        className="custom-angle-down"
                      >
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortExpenseLists("expenseType")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="expenseType"
                              name="expenseType"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterExp === "expenseType"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="expenseType"
                            >
                              Type
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortExpenseLists("date")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={this.state.sortFilterExp === "date"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="date"
                            >
                              Date
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortExpenseLists("envelope")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="envelope"
                              name="envelope"
                              onChange={() => {}}
                              checked={this.state.sortFilterExp === "envelope"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="envelope"
                            >
                              Envelope
                            </label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortExpenseLists("expenseCode")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="expenseCode"
                              name="expenseCode"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterExp === "expenseCode"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="expenseCode"
                            >
                              Code
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortExpenseLists("advancedAmount")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="advancedAmount"
                              name="advancedAmount"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterExp === "advancedAmount"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="advancedAmount"
                            >
                              Advanced Amount
                            </label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortExpenseLists("accountedAmount")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="accountedAmount"
                              name="accountedAmount"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterExp === "accountedAmount"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="accountedAmount"
                            >
                              Accounted Amount
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortExpenseLists("tran")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="tran"
                              name="tran"
                              onChange={() => {}}
                              checked={this.state.sortFilterExp === "tran"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="tran"
                            >
                              Transaction
                            </label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>{" "}
                  </div>
                  <div className="col input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <img
                          src="images/search-icon.png"
                          className="mx-auto"
                          alt="search-icon"
                        />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What are you looking for"
                      aria-label="What are you looking for"
                      aria-describedby="basic-addon1"
                      name="expListSearch"
                      value={this.state.expListSearch}
                      onChange={this.handleExpListSearch}
                      onKeyDown={this.onExpListSearch}
                    />
                  </div>
                </div>
              </div>

              <ul className="suppliers_list">
                {getExpenseList.map((l, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        l.teamExpense === "Y"
                          ? getExpenseList[i + 1] &&
                            getExpenseList[i + 1].teamExpense &&
                            getExpenseList[i + 1].teamExpense === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : activeExpense === l.id
                          ? "active cursorPointer"
                          : "cursorPointer"
                      }
                      id={l.id}
                    >
                      <div className="row">
                        <div className="col-auto mb-2 pr-0">
                          <div className="form-group remember_check">
                            <input
                              type="checkbox"
                              id={"exp" + i}
                              checked={l.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, l)}
                            />
                            <label htmlFor={"exp" + i} className="mr-0"></label>
                          </div>
                        </div>

                        <div
                          className="col pl-0"
                          onClick={() => this.getExpenseSummary(l)}
                        >
                          <div className="invioce_data pr-sm-3">
                            <h4>{l.supplier || ""}</h4>
                            <div className="row">
                              <div className="col data-i pr-0">
                                <p> {l.expenseType}</p>
                              </div>
                              <div className="col data-i pl-0">
                                <p>
                                  Date: {l.date}
                                  {/* {moment.unix(l.date).format("DD-MMM-YYYY")} */}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i pr-0">
                                <p>Env#: {l.envelope}</p>
                              </div>
                              <div className="col data-i pl-0">
                                <p> Code: {l.expenseCode}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col pr-0">
                                <p>Adv: {l.advancedAmount}</p>
                              </div>
                              <div className="col pl-0">
                                <p> Acct: {l.accountedAmount}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i"></div>
                              <div className="col-auto data-i">
                                <div className="text-center cursorPointer">
                                  <span
                                    onClick={() => this.handleMoreDetails(l)}
                                  >
                                    <Link className="more-details-color" to="#">
                                      more details
                                    </Link>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
                );
              </ul>
            </aside>
            {/* {/ end /} */}

            <section id="contents" className="supplier pr-0 pt-0">
              <div className="body_content ordermain-padi body__invoice--top">
                <div className="container-fluid pl-0 ">
                  <div className="main_wrapper ">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* Expense Tallies */}
                        <div className="exp_header_bottom">
                          <ul className="nav nav-tabs">
                            {this.state.expenseTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="cursorPointer nav-item"
                                  onClick={() =>
                                    this.getExpenseTallies(t.type, true)
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activeExpTallies === t.id
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    {t.type}{" "}
                                    <span className="stats">{t.count}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="bg-gry mm_top_nav content__elem--style">
                          <div className="w-100 float-left mm_lr_pad ">
                            <div className="mm_tab_left invoice_left expenses-hed-left">
                              <div className="tab-content">
                                {tab === "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        onClick={this.insertExpense}
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/add.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#">New</Link>{" "}
                                      </li>
                                      <li
                                        onClick={() =>
                                          this.state.getExpenseList.length > 0
                                            ? this.updateExpense()
                                            : () => {}
                                        }
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Edit </Link>{" "}
                                      </li>
                                      <li
                                        onClick={() =>
                                          this.state.getExpenseList.length > 0
                                            ? this.openModal("openDeleteModal")
                                            : () => {}
                                        }
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/delete.svg"
                                          className="invoice-delete-icon img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#">Delete </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        onClick={() =>
                                          this.state.getExpenseList.length > 0
                                            ? this.sendExpForApproval()
                                            : () => {}
                                        }
                                      >
                                        <img
                                          src="images/send.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Send </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "approve" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveExpense}
                                      >
                                        <img
                                          src="images/tick.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Approve </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.holdExpense}
                                      >
                                        <img
                                          src="images/move.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Hold </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        onClick={() =>
                                          this.openModal("openDeclineModal")
                                        }
                                      >
                                        <img
                                          src="images/decline.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Decline </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        // onClick={() =>
                                        //   this.openModal(
                                        //     "openExpenseDetailModal"
                                        //   )
                                        // }
                                      >
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Edit </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "declined" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.moveExpense}
                                      >
                                        <img
                                          src="images/move.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Move </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {tab === "hold" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveExpense}
                                      >
                                        <img
                                          src="images/tick.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Approve </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.declineExpense}
                                      >
                                        <img
                                          src="images/decline.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Decline </Link>
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        // onClick={() =>
                                        //   this.openModal(
                                        //     "openExpenseDetailModal"
                                        //   )
                                        // }
                                      >
                                        {" "}
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Edit </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "pending" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.moveExpense}
                                      >
                                        <img
                                          src="images/move.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Move </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "approved" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul></ul>
                                  </div>
                                )}
                                {tab === "all" && (
                                  <div
                                    className={
                                      this.state.getExpenseList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul></ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mm_tab_center invoice_right expenses-hed-right">
                              <div className="slider-panel">
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.zoomOut}
                                    src="images/minus.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.zoomIn}
                                    src="images/add.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Select
                                  className="width-selector"
                                  value={this.state.dropdownZoomingValue}
                                  classNamePrefix="custon_select-selector-inner"
                                  options={options}
                                  onChange={this.handleDropdownZooming}
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
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.handleHorizontalCross}
                                    src="images/fulls.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                    id="full_screen"
                                  />{" "}
                                </Link>
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.handleHorizontalArrow}
                                    src="images/twoarow.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                    id="expand"
                                  />{" "}
                                </Link>
                                <span
                                  onClick={this.handlePDFRotate}
                                  className="cursorPointer"
                                >
                                  <img
                                    src="images/undo.png"
                                    className=" img-fluid float-left undo-img"
                                    alt="user"
                                  />
                                </span>

                                <Link
                                  to="#"
                                  className="zom-img float-right ml-md-5 mr-0 pr-2 pl-2 more-d mt-0"
                                >
                                  <img
                                    src="images/more.png"
                                    className=" img-fluid"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mt-0"
                                  onClick={this.moveToNextExpense}
                                >
                                  <img
                                    src="images/arow-r.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="next"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mtop-1"
                                  onClick={this.moveToPrevExpense}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="prev"
                                  />{" "}
                                </Link>

                                <div className="side-attachments-2 exp-side-attachment2 aside__right--height">
                                  <div
                                    className="main-sec-attach main-bg"
                                    onClick={() =>
                                      this.openModal("openCreateInvoiceModal")
                                    }
                                  >
                                    Create Invoice
                                  </div>
                                  <div
                                    onClick={this.balanceTax}
                                    className="main-sec-attach main-bg"
                                  >
                                    Balance Tax
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal("openReportModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Reports
                                  </div>
                                  {tab === "draft" ? (
                                    <div
                                      onClick={() =>
                                        this.openModal("openImportModal")
                                      }
                                      className="main-sec-attach main-bg"
                                    >
                                      Import
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div
                                    onClick={() =>
                                      this.openModal("openDebitCardsModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Debit Cards
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal(
                                        "openDebitCardReconciliationModal"
                                      )
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Debit Card Reconciliation
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="export_crd"
                                      data-toggle="collapse"
                                      data-target="#export"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Export
                                    </span>
                                  </div>
                                  <div className="collapse show" id="export">
                                    {["LIST", "ENVELOPE"].map((op, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div
                                            className="form-group remember_check d-flex"
                                            onClick={() => this.onExport(op)}
                                          >
                                            <span className="text-mar cursorPointer ml-38">
                                              {op}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="accordian__text bank_details"
                                      data-toggle="collapse"
                                      data-target="#bank_details "
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Bank Details
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="bank_details"
                                  >
                                    <div className="pl-2 mb-3">
                                      <div className="form-group remember_check d-flex pt-0">
                                        <div className="ml-33 pt-1">
                                          <div className="uppercaseText">
                                            {bankDetails.accountName || ""}
                                          </div>
                                          <div>{bankDetails.bank || ""}</div>
                                          <div className="uppercaseText">
                                            {bankDetails.accountNo || ""}
                                          </div>
                                          <div className="uppercaseText">
                                            {bankDetails.suffix || ""}
                                          </div>
                                          <div className="uppercaseText">
                                            {bankDetails.sort || ""}
                                          </div>
                                          <div className="uppercaseText">
                                            {bankDetails.iban || ""}
                                          </div>
                                          <div className="uppercaseText">
                                            {bankDetails.swift || ""}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit"
                                      data-toggle="collapse"
                                      data-target="#Approvals_expense"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Approvals
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Approvals_expense"
                                  >
                                    {this.state.approvalsGroups.map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i + "Expense"}
                                                name={a.groupName}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i + "Expense"}>
                                                {" "}
                                              </label>
                                            </div>
                                            <span className="text-mar">
                                              {a.groupName}{" "}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Changes_expense"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={() =>
                                        this.openModal("openChangesModal")
                                      }
                                    >
                                      Changes
                                      <span className="ml-3 font-weight-bold">
                                        {this.state.changes.length}
                                        <span className="fa fa-angle-right"></span>
                                      </span>
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Changes_expense"
                                  >
                                    {this.state.changes.map((c, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="main-sec-attach1"
                                        >
                                          <p className="m-clr s-bold mb-0">
                                            {c.userName}
                                          </p>
                                          {c.description}
                                          <p className="gry-clr mb-0">
                                            {c.date} {c.time}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Activity_expense"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={() =>
                                        this.openModal("openActivityModal")
                                      }
                                    >
                                      Activity
                                      <span className="fa fa-angle-right"></span>
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Activity_expense"
                                  >
                                    {this.state.activity.map((a, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="main-sec-attach1"
                                        >
                                          {a.description}
                                          <p className="gry-clr mb-0">
                                            {a.date} {a.time}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div
                                    onClick={this.openMoveBatchPopup}
                                    className="main-sec-attach main-bg"
                                  >
                                    Move
                                  </div>
                                  <div
                                    onClick={this.openPostModal}
                                    className="main-sec-attach main-bg"
                                  >
                                    Post
                                  </div>
                                  {/* batch list start here  */}
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit"
                                      data-toggle="collapse"
                                      data-target="#batchlist"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Batch List
                                    </span>
                                  </div>
                                  <div className="collapse show" id="batchlist">
                                    <div className="pl-2 mb-3">
                                      <div className="text-right pb-2 pr-4">
                                        <span
                                          class="cursorPointer mr-3"
                                          href="#"
                                          onClick={this.insertBatch}
                                        >
                                          <img
                                            src="images/add.png"
                                            class=" img-fluid "
                                            alt="user"
                                          />
                                        </span>
                                        <span
                                          class="cursorPointer"
                                          onClick={this.deleteBatch}
                                        >
                                          <img
                                            src="images/delete.svg"
                                            class="invoice-delete-icon img-fluid "
                                            alt="user"
                                          />
                                        </span>
                                      </div>
                                      <table className="table table-bordered mb-0 order-collapse-table batch-list-table">
                                        <tbody>
                                          <tr>
                                            <th></th>
                                            <th>Description</th>
                                            <th>Batch</th>
                                            <th></th>
                                          </tr>
                                          {batchList.map((b, i) => {
                                            return (
                                              <tr>
                                                <td>
                                                  <div class="form-group remember_check">
                                                    <input
                                                      type="checkbox"
                                                      id={"batch" + i}
                                                      name="batch_checked"
                                                      checked={
                                                        b.batchNo === batchNo
                                                      }
                                                      onChange={(e) =>
                                                        this.handleBatchCheckbox(
                                                          e,
                                                          b.batchNo
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      htmlFor={"batch" + i}
                                                    ></label>
                                                  </div>
                                                </td>
                                                <td>
                                                  <input
                                                    className="border-0"
                                                    name="description"
                                                    value={b.description}
                                                    onBlur={(e) =>
                                                      this.addUpdateBatch(
                                                        e,
                                                        b,
                                                        i
                                                      )
                                                    }
                                                    onChange={(e) =>
                                                      this.handleChangeBatchFields(
                                                        e,
                                                        b,
                                                        i
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  {b.insertBatch ? (
                                                    <input
                                                      className="border-0"
                                                      name="batchNo"
                                                      value={b.batchNo}
                                                      onBlur={(e) =>
                                                        this.addUpdateBatch(
                                                          e,
                                                          b,
                                                          i
                                                        )
                                                      }
                                                      onChange={(e) =>
                                                        this.handleChangeBatchFields(
                                                          e,
                                                          b,
                                                          i
                                                        )
                                                      }
                                                    />
                                                  ) : (
                                                    b.batchNo
                                                  )}
                                                </td>
                                                <td></td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  {/* end  Batch list  */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="img-section-t col-12 pl-0">
                      {/* <img src="images/image6.png" className=" img-fluid" alt="user" />  */}
                      <div
                        className={
                          this.state.toggleRightSidebar
                            ? " mm_ordr1 order_pdf_new invo_margin"
                            : " mm_ordr1 order_pdf_expand1 m_auto"
                        }
                        id="overload_image--invoice"
                      >
                        <div
                          id="maped_image"
                          className="order_pfd over_auto_remove"
                          style={{ background: "#fff" }}
                        >
                          {this.state.getExpenseList.length > 0 && (
                            <div
                              id="demo"
                              className={
                                this.state.toggleRightSidebar
                                  ? " carousel slide invoice_carousel mm_invoice_div over_auto_remove"
                                  : " carousel slide invoice_carousel "
                              }
                              // data-ride="carousel"
                              data-interval={false}
                            >
                              <ul className="carousel-indicators">
                                <li
                                  data-target="#demo"
                                  data-slide-to="0"
                                  className="active"
                                ></li>
                                <li data-target="#demo" data-slide-to="1"></li>
                                <li data-target="#demo" data-slide-to="2"></li>
                              </ul>

                              <div className="carousel-inner">
                                {this.state.previewList.length > 0
                                  ? this.state.previewList.map((p, i) => {
                                      return (
                                        <div
                                          className={
                                            i === 0
                                              ? "carousel-item active "
                                              : "carousel-item "
                                          }
                                          id={i}
                                        >
                                          <div className="text-center">
                                            <div className="invoice_pdf_canvas invoice_pdf_new pdf--buttons pdf__height--content expensis-home">
                                              {p.file ? (
                                                <>
                                                  <Document
                                                    file={
                                                      "data:application/pdf;base64," +
                                                      p.file
                                                    }
                                                    onLoadSuccess={(data) =>
                                                      this.onDocumentLoadSuccess(
                                                        data,
                                                        i
                                                      )
                                                    }
                                                    rotate={this.state.rotate}
                                                  >
                                                    <Page
                                                      pageNumber={
                                                        this.state.pageNumber
                                                      }
                                                      scale={this.state.scaling}
                                                      height="372"
                                                      onLoadSuccess={
                                                        this.onLoadSuccessPage
                                                      }
                                                    />
                                                  </Document>
                                                  <div className="page-controls">
                                                    <button
                                                      type="button"
                                                      disabled=""
                                                      onClick={
                                                        this.goToPrevPage
                                                      }
                                                    >
                                                      ‹
                                                    </button>
                                                    <span>
                                                      {this.state.pageNumber} of{" "}
                                                      {this.state.numPages}
                                                    </span>{" "}
                                                    <button
                                                      type="button"
                                                      onClick={
                                                        this.goToNextPage
                                                      }
                                                    >
                                                      ›
                                                    </button>
                                                  </div>
                                                </>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  : "No Preview Found"}

                                {this.state.previewList.length > 1 && (
                                  <>
                                    <a
                                      className="carousel-control-prev"
                                      href="#demo"
                                      data-slide="prev"
                                      onClick={this.onSlideChange}
                                    >
                                      <i>
                                        <span className="carousel-control-prev-icon"></span>
                                      </i>
                                    </a>
                                    <a
                                      className="carousel-control-next"
                                      href="#demo"
                                      data-slide="next"
                                      onClick={this.onSlideChange}
                                    >
                                      <i>
                                        <span className="carousel-control-next-icon"></span>
                                      </i>
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="side-attachments exp-side-attachment aside__right--height">
                        <div
                          className="cus-arro-div"
                          onClick={this.handleRightSidebar}
                        >
                          <img
                            src="images/arrow-r.png"
                            className=" img-fluid cus-arro-r"
                            alt="user"
                          />
                        </div>
                        <div className="side-attack">
                          <div className="main-sec-attach main-bg">
                            {/*Expense Attachments */}
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Attachments_expense"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openAttachmentsModal")
                              }
                            >
                              Attachments
                              <span className="ml-3 font-weight-bold">
                                {this.state.attachments.length}
                              </span>
                              <span className="fa fa-angle-right"></span>
                              <a class="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  class=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div
                            className="collapse show"
                            id="Attachments_expense"
                          >
                            {this.state.attachments.map((a, i) => {
                              return (
                                <div
                                  onClick={() =>
                                    this.getAttachment(
                                      a.id || a.recordID,
                                      "",
                                      a.fileName
                                    )
                                  }
                                  key={i}
                                  className="main-sec-attach"
                                >
                                  {a.fileName}{" "}
                                  <span className="fa fa-angle-right"></span>
                                </div>
                              );
                            })}
                          </div>

                          {/* side menue Approvers / Approvals */}

                          <div className="main-sec-attach main-bg">
                            <span
                              className="invoice-inherit"
                              data-toggle="collapse"
                              data-target="#Approvals_expense"
                            >
                              <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                              Approvals
                            </span>
                          </div>
                          <div className="collapse show" id="Approvals_expense">
                            {this.state.approverGroup &&
                              this.state.approverGroup.trim() && (
                                <div className="main-sec-mid">
                                  {this.state.approverGroup}
                                </div>
                              )}
                            {this.state.approvers.map((a, i) => {
                              return (
                                <div
                                  key={i}
                                  className="main-sec-attach cus-check"
                                >
                                  <div className="form-group remember_check">
                                    {a.status === "Approved" ? (
                                      <input type="checkbox" id={i} checked />
                                    ) : (
                                      ""
                                    )}
                                    {a.status === "Current" ? (
                                      <i
                                        className="fa fa-circle-thin circle-check float-left ml-1"
                                        aria-hidden="true"
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    <label htmlFor={i}>
                                      {" "}
                                      <span
                                        className={
                                          a.status === "Current"
                                            ? "order-right-color ml-2 selected mm_lcapp"
                                            : "text-mar"
                                        }
                                      >
                                        {a.name}
                                      </span>
                                      {a.status === "Current" ? (
                                        <span className="current-approver mm_approre">
                                          {" "}
                                          (current approver)
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Expense Comments */}
                          <div className="main-sec-attach main-bg">
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Comments_expense"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openCommentsModal")
                              }
                            >
                              Comments
                              <span className="ml-3 font-weight-bold">
                                {this.state.comments.length}
                              </span>
                              <span className="fa fa-angle-right"></span>
                              <a class="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  class=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div className="collapse show" id="Comments_expense">
                            {this.state.comments.map((c, i) => {
                              return (
                                <div key={i} className="main-sec-attach1">
                                  <p className="m-clr s-bold mb-0">
                                    {c.userName}
                                  </p>
                                  {c.comment}
                                  <p className="gry-clr mb-0">
                                    {c.date} {c.time}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* end */}
        </div>

        <Decline
          openDeclineModal={this.state.openDeclineModal}
          closeModal={this.closeModal}
          onDecline={this.declineExpense}
        />

        <Attachments
          openAttachmentsModal={this.state.openAttachmentsModal}
          closeModal={this.closeModal}
          addAttachment={this.addAttachment}
          attachments={this.state.attachments}
          getAttachment={this.getAttachment}
          attachmentSize={this.state.attachmentSize}
          draft={tab === "draft" ? true : false} //to hide/show "Drag Files in or Click to Upload" box
        />

        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={this.state.comments}
          addComment={this.addComment}
          tab={tab}
          page="expense"
        />

        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
          activity={[]}
        />

        <Changes
          openChangesModal={this.state.openChangesModal}
          closeModal={this.closeModal}
          changes={[]}
        />
        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Expenses"
          locationProps={this.props}
        />

        <ExpenseDetails
          openExpenseDetailModal={this.state.openExpenseDetailModal}
          closeModal={this.closeModal}
          openModal={this.openModal}
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          flags_api={this.props.chart.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          expenseLines={this.state.expenseLines} //expense lines of an expense
          flagsPrompts={
            //to show flags prompts in expense detail header
            this.props.user.getDefaultValues.flags &&
            this.props.user.getDefaultValues.flags.length > 0
              ? this.props.user.getDefaultValues.flags
              : []
          }
          updateExpenseLines={this.updateExpenseLines}
          handleMultipleChanges={this.handleMultipleChanges} //update invocie-lines according to multiple change modal
          props={this.props}
          handleCheckboxesInExpenseDetails={
            this.handleCheckboxesInExpenseDetails
          }
          tab={tab}
          props={this.props}
          getChartSorts={this.getChartSorts} //get chart sorts function
          handleChangeField={this.handleChangeField}
          handleChangeFlags={this.handleChangeFlags}
        />

        <ExpenseMoreDetail
          openExpenseMoreDetailsModal={this.state.openExpenseMoreDetailsModal}
          closeModal={this.closeModal}
          details={this.state.expenseMoreDetails}
        />

        <Delete
          openDeleteModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          onDelete={this.deleteExpense}
        />
        <CreateInvoice
          openCreateInvoiceModal={this.state.openCreateInvoiceModal}
          closeModal={this.closeModal}
          createInvoice={this.createInvoice}
          taxCode={this.state.taxCode}
          taxCodeList={this.state.taxCodeList}
          bankCode={this.state.bankCode}
          bankCodeList={this.state.bankCodeList}
          handleSelectFields={this.handleSelectFields}
          formErrors={this.state.formErrors}
        />

        <Import
          state={this.state}
          closeModal={this.closeModal}
          page="expense"
          onImport={this.onImport}
        />
        <DebitCards
          openDebitCardsModal={this.state.openDebitCardsModal}
          closeModal={this.closeModal}
          importDebitTransactions={this.importDebitTransactions}
          emailEnvelope={this.emailEnvelope}
          getExpenseCodes={this.getExpenseCodes}
          expenseCodes={this.state.expenseCodes}
        />
        <Move
          closeModal={this.closeModal}
          stateDate={this.state}
          moveBatch={this.moveBatch}
        />

        <Post
          openPostModal={this.state.openPostModal}
          closeModal={this.closeModal}
          postType="Expenses"
          onSave={this.postExpense}
          locationProps={this.props}
        />
        <DebitCardReconciliation
          openDebitCardReconciliationModal={
            this.state.openDebitCardReconciliationModal
          }
          closeModal={this.closeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expenseData: state.expense,
  chart: state.chart,
  user: state.user,
  setup: state.setup,
  supplier: state.supplier,
});

export default connect(mapStateToProps, {
  getExpenseTallies: ExpenseActions.getExpenseTallies,
  getExpenseList: ExpenseActions.getExpenseList,
  getExpenseSummary: ExpenseActions.getExpenseSummary,
  deleteExpense: ExpenseActions.deleteExpense,
  sendExpForApproval: ExpenseActions.sendExpForApproval,
  getExpAttachment: ExpenseActions.getExpAttachment,
  addExpAttachment: ExpenseActions.addExpAttachment,
  addComment: ExpenseActions.addComment,
  approveExpense: ExpenseActions.approveExpense,
  declineExpense: ExpenseActions.declineExpense,
  moveExpense: ExpenseActions.moveExpense,
  holdExpense: ExpenseActions.holdExpense,
  exportList: ExpenseActions.exportList,
  createInvoice: ExpenseActions.createInvoice,
  exportEnvelope: ExpenseActions.exportEnvelope,
  emailEnvelope: ExpenseActions.emailEnvelope,
  balanceTax: ExpenseActions.balanceTax,
  importDebitTransactions: ExpenseActions.importDebitTransactions,
  postExpense: ExpenseActions.postExpense,
  moveBatch: ExpenseActions.moveBatch,
  importEnvelope: ExpenseActions.importEnvelope,
  importList: ExpenseActions.importList,
  importSplitExpense: ExpenseActions.importSplitExpense,
  importFuelExpense: ExpenseActions.importFuelExpense,
  getExpenseCodes: ExpenseActions.getExpenseCodes,
  clearExpenseStates: ExpenseActions.clearExpenseStates,
  getFlags: ChartActions.getFlags,
  getDefaultValues: UserActions.getDefaultValues,
  getChartSorts: ChartActions.getChartSorts,
  getBtachList: SetupActions.getBtachList,
  deleteBatch: SetupActions.deleteBatch,
  updateBatch: SetupActions.updateBatch,
  insertBatch: SetupActions.insertBatch,
  getSupplier: SupplierActions.getSupplier,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearSetupStates: SetupActions.clearSetupStates,
  clearChartStates: ChartActions.clearChartStates,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Expense);
