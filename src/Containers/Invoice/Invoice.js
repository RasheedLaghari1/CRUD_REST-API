import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import _ from "lodash";
import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";
import Dropdown from "react-bootstrap/Dropdown";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Delete from "../Modals/Delete/Delete";
import Decline from "../Modals/Decline/Decline";
import InvoiceDetail from "../Modals/InvoiceDetail/InvoiceDetail";
import InvoiceMoreDetails from "../Modals/InvoiceMoreDetails/InvoiceMoreDetails";
import POLogs from "../Modals/POLogs/POLogs";
import Post from "../Modals/Post/Post";
import Import from "../Modals/Import/Import";
import Report from "../Modals/Report/Report";
import moment from "moment";
import Move from "../Modals/Move/Move";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as InvoiceActions from "../../Actions/InvoiceActions/InvoiceActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as SetupActions from "../../Actions/SetupRequest/SetupAction";
import {
  handleAPIErr,
  zoomIn,
  zoomOut,
  handleDropdownZooming,
  downloadAttachments,
} from "../../Utils/Helpers";
import { options } from "../../Constants/Constants";
import {
  handleValidation,
  handleWholeValidation,
} from "../../Utils/Validation";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const uuidv1 = require("uuid/v1");

class Invoice extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      tran: "", //tran of current selected invoice
      multipleTrans: [], //when user selects multiple Invoices to perform different functionality

      invoicesListSearch: "", //search on invoices list
      getInvoicesList: [], //side menu (left side) invoices list data
      clonedGetInvoicesList: [], //a copy of  getInvoicesList
      invoiceTallies: [], //e.g Draft, Pending, Approved, etc
      activeInvoice: "", //to add class active in lists of getting invoices (in left side )
      activeInvoiceTallis: "", //to add class active on invoices tallis
      showInvoiceTallisTabPane: "", //to add class active on invoices tallis below tab pane
      filteredInvoicesList: [], //this contains filterd list and used for searching on it
      viewTeam: "N",
      teamInvcCheck: "", //to check selected invoice is team invoice or not
      preview: "", //invoice PDF
      previewList: [], //list of base 64 PDFs
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      comments: [], //invoice comments
      attachments: [], //invoice attachments
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      approvers: [], //to just show on side menuw bar
      invoiceChanges: [],
      invoiceActivity: [],
      lines: [], //invoice lines
      subTotal: 0, //to just show on invoice-details page sub total
      poLines: [], //po lines

      // exclude filter 'Zero', 'Close' and 'fully Approved'
      zero: false,
      close: false,
      fullyApproved: false,

      approvalsGroups: [], //list of approvals Groups checkboxes to filter invoice list
      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes lsit
      openAttachmentsModal: false,
      openCommentsModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openDeclineModal: false,
      openInvoiceDetailModal: false,
      openPOLogsModal: false,
      openDeleteModa: false,
      openImportModal: false,
      openReportModal: false,
      openMoveModal: false,
      openPostModal: false,

      invoiceMoreDetails: "",
      openInvoiceMoreDetailsModal: false,

      sortFilterInvc: "supplierName",
      sortFilterCheckInvc: "ASC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC
      // dropdown coding
      scaling: 3.4,
      dropdownZoomingValue: { label: "40%", value: "40%" },

      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags
      basisOptions: [],
      toggleRightSidebar: true,
      rotate: 0,

      batchList: [],
      batchListOptions: [], //restructured batch listfor the drop-down when Move popup opens
      batchNo: "", //batch no of current selected batch

      bankDetails: "", //supplier bank details
      currency: "", //supplier currency
      supplierCode: "", //supplier code
    };
  }
  async componentDidMount() {
    //right hand side bar setting with PO Image
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
    // end
    //focus search input field by pressing Tab key
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 9) {
        evt.preventDefault();
        let id = document.getElementById("invoicesListSearchId");
        if (id) {
          document.getElementById("invoicesListSearchId").focus();
        }
      }
    };

    let { viewTeam, sortFilterInvc, sortFilterCheckInvc } = this.state;
    //Team Invoice Check
    viewTeam = localStorage.getItem("teamInvoice") || "N";
    //getting default sorting list setting from localstorage
    sortFilterInvc = localStorage.getItem("sortFilterInvc") || "supplierName";
    sortFilterCheckInvc = localStorage.getItem("sortFilterCheckInvc") || "ASC";
    this.setState({ viewTeam, sortFilterInvc, sortFilterCheckInvc });

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
    $(".export_crd").click(function () {
      $(".export_crd .sideBarAccord1").toggleClass("rotate_0");
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
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });

    // end

    let { dashboard, tallType, editInvoiceTran, tallies, editInvoiceCheck } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (dashboard && tallType) {
      //when user click on Invoices Tallies on Dashboard
      await this.getInvoiceTallies(tallType, true); // get Invoice Tallies
    } else if (
      tallies &&
      tallies === "Draft" &&
      editInvoiceCheck &&
      editInvoiceTran
    ) {
      /*When  draft/Edit and Invoice or Order  and then user Save or Cancel that edit, 
        then load the same Invoice or Order user just edited?.*/
      await this.getInvoiceTallies("Draft", true);
    } else {
      await this.getInvoiceTallies(); // get Invoice Tallies
    }

    await Promise.all([this.getChartCodes("", "all"), this.getBtachList()]);

    this.props.clearChartStates();
    this.props.clearUserStates();
    this.props.clearInvoiceStates();
  }

  //get invoice talleis
  getInvoiceTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined etc then updated Invoice Tallies
    this.setState({ isLoading: true });
    let isInvoiceTallies = false; //to check if redux store containe invoice tallies then dont call API again
    let _invoiceTallies = this.props.invoiceData.invoiceTallies || [];

    if (_invoiceTallies.length === 0 || check) {
      await this.props.getInvoiceTallies(); // get Invoice Tallies
    } else {
      isInvoiceTallies = true;
    }
    let invcTally = "";

    let { activeInvoiceTallis, showInvoiceTallisTabPane } = this.state;

    let invcTalliesArr = [];

    //success case of Invoice tallies
    if (this.props.invoiceData.getInvoiceTalliesSuccess || isInvoiceTallies) {
      // toast.success(this.props.invoiceData.getInvoiceTalliesSuccess);
      let invoiceTallies = this.props.invoiceData.invoiceTallies || [];
      let invcTypes = [];

      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType == "operator") {
        invcTypes = ["draft", "pending", "declined", "approved", "all"];
      } else if (userType == "approver") {
        invcTypes = [
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      } else if (userType == "op/approver") {
        invcTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      }

      if (invcTypes.length > 0) {
        invcTypes.map((t, i) => {
          let obj = invoiceTallies.find(
            (tl) => tl.type && tl.type.toLowerCase() === t
          );
          if (obj) {
            invcTalliesArr.push(obj);
          }
        });
      } else {
        invcTalliesArr = invoiceTallies;
      }

      let _type = "";

      if (type) {
        _type = type;
      } else if (invcTalliesArr.length > 0) {
        _type = invcTalliesArr[0].type;
      }

      invcTalliesArr.map(async (invc, i) => {
        if (invc.type === _type) {
          let id = uuidv1();
          invc.id = id;
          invcTally = invc;
          activeInvoiceTallis = id;
          showInvoiceTallisTabPane = invc.type;
        } else {
          invc.id = uuidv1();
        }
        return invc;
      });
    }
    //error case case of Invoice tallies
    if (this.props.invoiceData.getInvoiceTalliesError) {
      handleAPIErr(this.props.invoiceData.getInvoiceTalliesError, this.props);
    }
    this.setState({
      isLoading: false,
      invoiceTallies: invcTalliesArr,
      activeInvoiceTallis,
      showInvoiceTallisTabPane,
    });
    if (invcTally) {
      //to call get invoices List baseed on first invoice tallies
      await this.getInvoicesList(invcTally);
    }
    await this.props.clearInvoiceStates();
  };

  //getting the purchase order list when click on Draft || Pending || Approved etc
  getInvoicesList = async (data) => {
    let activeInvoice = "";
    let getInvoicesList = [];
    let clonedGetInvoicesList = [];
    let filteredInvoicesList = [];

    this.clearStates();
    this.setState({
      isLoading: true,
      activeInvoiceTallis: data.id,
      showInvoiceTallisTabPane: data.type,
      invoicesListSearch: "",
      zero: false,
      close: false,
      fullyApproved: false,
    });
    let teamInvcCheck = this.state.viewTeam;
    if (teamInvcCheck) {
      data.teamInvoices = teamInvcCheck;
    }
    await this.props.getInvoicesList(data); // get invoice list
    let firstInvoice = "";
    //success case of getInvoicesListSuccess
    if (this.props.invoiceData.getInvoicesListSuccess) {
      // toast.success(this.props.invoiceData.getInvoicesListSuccess);
      let _getInvoicesList = this.props.invoiceData.getInvoicesList || [];

      let sortFilterInvc = this.state.sortFilterInvc;
      let sortFilterCheckInvc = this.state.sortFilterCheckInvc;

      _getInvoicesList
        .sort((a, b) => {
          if (sortFilterInvc === "amount" || sortFilterInvc === "tran") {
            let valueA = Number(a[sortFilterInvc]);
            let valueB = Number(b[sortFilterInvc]);
            //for ascending order
            if (sortFilterCheckInvc === "ASC") {
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
          } else if (sortFilterInvc === "date") {
            let valueA = new Date(a.date);
            let valueB = new Date(b.date);
            //for ascending order
            if (sortFilterCheckInvc === "ASC") {
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
          } else if (sortFilterInvc) {
            let valueA = a[sortFilterInvc].toString().toUpperCase();
            let valueB = b[sortFilterInvc].toString().toUpperCase();
            //for ascending order
            if (sortFilterCheckInvc === "ASC") {
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
        .map((invc, i) => {
          if (i == 0) {
            let id = uuidv1();
            invc.id = id;
            invc.checked = false;
            firstInvoice = invc;
            activeInvoice = id;
          } else {
            invc.id = uuidv1();
            invc.checked = false;
          }
          return invc;
        });
      getInvoicesList = _getInvoicesList;
      clonedGetInvoicesList = _getInvoicesList;
      filteredInvoicesList = _getInvoicesList;

      /*Check When  Edit and Invoice or Order  and then user Save or Cancel that edit, 
    then load the same Invoice or Order user just edited?.*/

      let { editInvoiceTran, tallies, editInvoiceCheck } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";

      if (
        tallies &&
        tallies === "Draft" &&
        editInvoiceCheck &&
        editInvoiceTran
      ) {
        let checkInvoice = getInvoicesList.find(
          (l) => l.tran === editInvoiceTran
        );
        if (checkInvoice) {
          firstInvoice = checkInvoice;
          activeInvoice = checkInvoice.id;
        }
      }
    }
    //error case of invoices List
    if (this.props.invoiceData.getInvoicesListError) {
      handleAPIErr(this.props.invoiceData.getInvoicesListError, this.props);
    }
    this.setState({
      activeInvoice,
      getInvoicesList,
      clonedGetInvoicesList,
      filteredInvoicesList,
      isLoading: false,
    });
    if (firstInvoice) {
      //to call get invoice baseed on first invoice in invoice list
      await this.getInvoice(firstInvoice, true);
    }
    this.props.clearInvoiceStates();

    // scroll to active invoice
    var elmnt = document.getElementById(this.state.activeInvoice);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //getting the single invoice
  getInvoice = async (invc, check) => {
    if (this.state.activeInvoice != invc.id || check) {
      this.setState({
        isLoading: true,
        previewList: [],
        numPages: null,
        pageNumber: 1,
        rotate: 0,
        numPagesArr: [], //it contains number of pages of each PDF
        attachmentSize: 0,
        activeInvoice: invc.id,
        currency: "",
        supplierCode: "",
        bankDetails: "",
      });
      await this.props.getInvoice(invc.tran); // get Invocie
      //success case of getInvoice
      if (this.props.invoiceData.getInvoiceSuccess) {
        // toast.success(this.props.invoiceData.getInvoiceSuccess);

        let invoiceDetails =
          (this.props.invoiceData.getInvoice &&
            this.props.invoiceData.getInvoice.invoice &&
            JSON.parse(
              JSON.stringify(this.props.invoiceData.getInvoice.invoice)
            )) ||
          "";

        let tran = (invoiceDetails && invoiceDetails.tran) || "";
        let comments = (invoiceDetails && invoiceDetails.comments) || [];
        let attachments = (invoiceDetails && invoiceDetails.attachments) || [];

        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });

        let preview = (invoiceDetails && invoiceDetails.preview) || "";

        let approvers = (invoiceDetails && invoiceDetails.approvers) || [];

        let approvalGroup =
          (invoiceDetails && invoiceDetails.approvalGroup) || "";

        let approvalsGroups =
          (invoiceDetails &&
            JSON.parse(JSON.stringify(invoiceDetails.approvalOptions))) ||
          [];
        approvalsGroups.map((a, i) => {
          a.checked = false;
          a.id = uuidv1();
          return a;
        });
        let invoiceChanges =
          (this.props.invoiceData &&
            this.props.invoiceData.getInvoice &&
            this.props.invoiceData.getInvoice.invoiceChanges) ||
          [];

        let invoiceActivity =
          (this.props.invoiceData &&
            this.props.invoiceData.getInvoice &&
            this.props.invoiceData.getInvoice.activity) ||
          [];
        let previewList =
          (this.props.invoiceData &&
            this.props.invoiceData.getInvoice &&
            this.props.invoiceData.getInvoice.previewList) ||
          [];

        let lines = (invoiceDetails && invoiceDetails.lines) || [];

        let subTotal = 0;

        lines.map((line, i) => {
          line.id = uuidv1();
          line.checked = false;

          if (line.startTime && line.startTime != "0") {
            line.startTime *= 1000;
          }
          if (line.endTime && line.endTime != "0") {
            line.endTime *= 1000;
          }
          line.amount = Number(line.amount).toFixed(2) || 0.0;

          subTotal = Number(subTotal) + Number(line.amount);

          return line;
        });

        let poLines = (invoiceDetails && invoiceDetails.poLines) || [];

        let basisOptions =
          (invoiceDetails && invoiceDetails.basisOptions) || [];

        let currency = (invoiceDetails && invoiceDetails.currency) || "";
        let supplierCode =
          (invoiceDetails && invoiceDetails.supplierCode) || "";

        this.setState(
          {
            tran,
            comments,
            attachments,
            attachmentSize,
            preview,
            approvers,
            lines,
            subTotal: Number(subTotal).toFixed(2),
            invoiceChanges,
            invoiceActivity,
            approvalsGroups,
            poLines,
            approvalGroup,
            basisOptions,
            previewList,
            currency,
            supplierCode,
          },
          () => {
            this.getSupplier();
          }
        );
      }
      //error case of get invoice
      if (this.props.invoiceData.getInvoiceError) {
        handleAPIErr(this.props.invoiceData.getInvoiceError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
      //setting the invoice zoom
      let invoiceZoom = localStorage.getItem("invoiceZoom");
      if (invoiceZoom) {
        this.handleDropdownZooming({ value: invoiceZoom });
      }
    }
  };

  getChartCodes = async (sort, check) => {
    //if check == all it means that store all type chartCodes for the first time(when call api in didmount )
    //it is because when line item modal open and we call getChartCodes according to selected Chart sort then state contains only that chart codes related to select chart sorts
    //these all chart codes will be used for chart code auto-completion to show related to the chart sort in the line (filter codes according to sort in the line)
    await this.props.getChartCodes(sort); //to get chart codes filterd list according to chart sort

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);

      let getChartCodes = this.props.chart.getChartCodes || "";

      if (check === "all") {
        //this will contains all chart codes
        this.setState({
          chartCodesList: getChartCodes.chartCodes || [],
          clonedChartCodesList: getChartCodes.chartCodes || [],
        });
      }
    }

    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }
    this.props.clearChartStates();
  };

  //handle auto-completing and typing into the Chart Code
  handleChangeChartCode = async (e, line, i) => {
    $(`.chart${i}`).show();
    let value = e.target.value;
    let { lines } = this.state;

    // update in invoice lines
    let foundIndex = lines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = value || "";
      lines[foundIndex] = line;
    }

    let clonedChartCodesList = [...this.state.chartCodesList];

    if (!value) {
      clonedChartCodesList = [];
    } else {
      let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
        return (
          (c.code.toUpperCase().includes(value.toUpperCase()) ||
            c.description.toUpperCase().includes(value.toUpperCase())) &&
          c.sort.toUpperCase() === line.chartSort.toUpperCase()
        );
      });
      clonedChartCodesList = chartCodesListFilterdData;
    }
    this.setState({ lines, clonedChartCodesList });
  };

  handleChangeField = (e, line, i) => {
    let name = e.target.name;
    let value = e.target.value;
    let { lines } = this.state;

    // update in invoice lines
    let foundIndex = lines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line[name] = value || "";
      lines[foundIndex] = line;
    }

    this.setState({ lines });
  };

  convertTwoDecimal = (e, line) => {
    let val = Number(e.target.value).toFixed(2) || 0.0;

    let { lines } = this.state;
    line["amount"] = val;

    // calculation(subTotal)
    let subTotal = 0.0;
    let lns = JSON.parse(JSON.stringify(lines));
    lns.map((l) => {
      subTotal = Number(subTotal) + Number(l.amount);
    });

    this.setState({
      subTotal: Number(subTotal).toFixed(2),
      lines,
    });
  };

  handleChangeFlags = (e, line) => {
    let name = e.target.name;
    let value = e.target.value;
    let { lines } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value.toUpperCase();
      }
      return f;
    });

    // update in invoice lines
    let foundIndex = lines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.flags = flags;
      lines[foundIndex] = line;
    }

    this.setState({ lines });
  };

  onblurCode = (i) => {
    setTimeout(() => {
      $(`.chart${i}`).hide();
    }, 700);
  };

  //when select code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line, index) => {
    //focus after chart code selection to move next on Tab press
    $(`#chrtCode${index}`).focus();

    let { lines } = this.state;

    // update in invoice lines
    let foundIndex = lines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = chartCode.code || "";
      lines[foundIndex] = line;
    }

    this.setState({ lines });
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

  //when a user searches on Invoices list
  handleChangeInvoiceListSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ invoicesListSearch: searchedText }, () => {
      const filteredInvoicesList = JSON.parse(
        JSON.stringify(this.state.filteredInvoicesList)
      );

      if (!searchedText) {
        let sortFilterCheckInvc = this.state.sortFilterCheckInvc;

        if (sortFilterCheckInvc === "ASC") {
          sortFilterCheckInvc = "DESC";
        } else {
          sortFilterCheckInvc = "ASC";
        }
        this.setState(
          { getInvoicesList: filteredInvoicesList, sortFilterCheckInvc },
          () => {
            this.handleSortInvoiceLists(this.state.sortFilterInvc);
            // scroll to active invoice
            var elmnt = document.getElementById(this.state.activeInvoice);
            if (elmnt) {
              elmnt.scrollIntoView();
            }
          }
        );
      }
    });
  };

  onInvoiceListSearch = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let invoicesListSearch = this.state.invoicesListSearch.trim();

      if (invoicesListSearch) {
        const filteredInvoicesList = JSON.parse(
          JSON.stringify(this.state.filteredInvoicesList)
        );

        let invoiceListFilterdData = [];
        invoiceListFilterdData = filteredInvoicesList.filter((c) => {
          return c.supplierName
            .toUpperCase()
            .includes(invoicesListSearch.toUpperCase());
        });

        this.setState({ getInvoicesList: invoiceListFilterdData });
      }
    }
  };

  //sorting on invocies list
  handleSortInvoiceLists = (name, check) => {
    let { sortFilterCheckInvc } = this.state;
    if (this.state.sortFilterInvc != name) {
      sortFilterCheckInvc = "DESC";
    }

    if (sortFilterCheckInvc === "DESC") {
      sortFilterCheckInvc = "ASC";
    } else {
      sortFilterCheckInvc = "DESC";
    }

    localStorage.setItem("sortFilterInvc", name);
    localStorage.setItem("sortFilterCheckInvc", sortFilterCheckInvc);

    const filteredInvoicesList = JSON.parse(
      JSON.stringify(this.state.filteredInvoicesList)
    );
    let invoiceListFilterdData = [];
    if (name === "amount" || name === "tran") {
      invoiceListFilterdData = filteredInvoicesList.sort(function (a, b) {
        let valueA = Number(a[name]);
        let valueB = Number(b[name]);
        //for ascending order
        if (sortFilterCheckInvc === "ASC") {
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
    } else if (name === "date" || name === "approvalDate") {
      invoiceListFilterdData = filteredInvoicesList.sort(function (a, b) {
        let valueA = "";
        let valueB = "";

        if (name === "date") {
          valueA = new Date(a.date);
          valueB = new Date(b.date);
        } else {
          // valueA = new Date(a.approvalDate);
          // valueB = new Date(b.approvalDate);
          valueA = new Date(
            moment(a.approvalDate.replace(/\s/g, ""), "DD/MM/YYYY")
          );
          valueB = new Date(
            moment(b.approvalDate.replace(/\s/g, ""), "DD/MM/YYYY")
          );
        }

        //for ascending order
        if (sortFilterCheckInvc === "ASC") {
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
    } else if (name) {
      invoiceListFilterdData = filteredInvoicesList.sort(function (a, b) {
        let valueA = a[name].toString().toUpperCase();
        let valueB = b[name].toString().toUpperCase();
        //for ascending order
        if (sortFilterCheckInvc === "ASC") {
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
      getInvoicesList: invoiceListFilterdData,
      sortFilterInvc: name,
      sortFilterCheckInvc,
    });
  };

  //when click on more details link
  handleMoreDetails = (data) => {
    this.setState({ invoiceMoreDetails: data }, () =>
      this.openModal("openInvoiceMoreDetailsModal")
    );
  };

  //add commnet
  addComment = async (comment) => {
    if (this.state.tran) {
      if (comment) {
        this.setState({ isLoading: true });
        let data = {
          comment,
          tran: this.state.tran,
        };
        await this.props.addComment(data);
        if (this.props.invoiceData.addCommentSuccess) {
          // toast.success(this.props.invoiceData.addCommentSuccess);
          let comments = this.props.invoiceData.addCommentData || [];
          this.setState({ comments });
        }
        if (this.props.invoiceData.addCommentError) {
          handleAPIErr(this.props.invoiceData.addCommentError, this.props);
        }
        this.props.clearInvoiceStates();
        this.setState({ isLoading: false });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  //add attachment
  addAttachment = async (attachment, fileName) => {
    if (this.state.tran) {
      this.setState({ isLoading: true });
      let data = {
        fileName,
        attachment,
        tran: this.state.tran,
      };
      await this.props.addInvoiceAttachments(data);
      if (this.props.invoiceData.addInvoiceAttachmentSuccess) {
        // toast.success(this.props.invoiceData.addInvoiceAttachmentSuccess);
        let attachments = this.props.invoiceData.addInvoiceAttachment || [];
        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        this.setState({ attachments, attachmentSize });
      }
      if (this.props.invoiceData.addInvoiceAttachmentError) {
        handleAPIErr(
          this.props.invoiceData.addInvoiceAttachmentError,
          this.props
        );
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select an Invoice");
    }
  };

  getAttachment = async (recordID, type, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getInvoiceAttachments(this.state.tran, recordID);
    if (this.props.invoiceData.getInvocieAttachmentSuccess) {
      // toast.success(this.props.invoiceData.getInvocieAttachmentSuccess);
      let resp = this.props.invoiceData.getInvocieAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.invoiceData.getInvocieAttachmentError) {
      handleAPIErr(
        this.props.invoiceData.getInvocieAttachmentError,
        this.props
      );
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  //download preview
  downloadPreview = () => {
    if (this.state.preview) {
      const linkSource = `data:application/pdf;base64,${this.state.preview}`;
      const downloadLink = document.createElement("a");
      const fileName = "attachment.pdf";

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  };

  clearStates = () => {
    this.setState({
      tran: "", //tran of current selected invoice
      multipleTrans: [], //when user selects multiple Invoices to perform different functionality
      invoicesListSearch: "", //search on invoices list
      getInvoicesList: [], //side menu (left side) invoices list data
      clonedGetInvoicesList: [], //a copy of  getInvoicesList
      activeInvoice: "", //to add class active in lists of getting invoices (in left side )
      activeInvoiceTallis: "", //to add class active on invoices tallis
      showInvoiceTallisTabPane: "", //to add class active on invoices tallis below tab pane
      filteredInvoicesList: [], //this contains filterd list and used for searching on it
      teamInvoice: "",
      preview: "", //invoice PDF
      previewList: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      comments: [], //invoice comments
      attachments: [], //invoice attachments
      approvers: [], //to just show on side menuw bar
      invoiceChanges: [],
      invoiceActivity: [],

      lines: [], //invoice lines
      subTotal: 0, //to just show on invoice-details page sub total
      poLines: [], //po lines

      // exclude filter 'Zero', 'Close' and 'fully Approved'
      zero: false,
      close: false,
      fullyApproved: false,
      approvalsGroups: [], //list of approvals Groups checkboxes to filter Invoice list

      invoiceMoreDetails: "",
      openInvoiceMoreDetailsModal: false,
      openDeleteModal: false,

      currency: "",
      supplierCode: "",
    });
  };

  openModal = async (name) => {
    if (name === "openInvoiceDetailModal") {
      this.setState({ isLoading: true });

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
          await this.props.getDefaultValues();
        }
      }

      if (!this.props.chart.getFlags) {
        await this.props.getFlags();
      }

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

      // this is for Line Items Modal (Tracking Codes)
      let { flags, clonedFlags } = this.state;
      if (
        this.props.user.getDefaultValues.flags &&
        this.props.user.getDefaultValues.flags.length > 0
      ) {
        flags = [];
        clonedFlags = [];
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
      }

      this.setState({
        openInvoiceDetailModal: true,
        isLoading: false,
        flags,
        clonedFlags,
      });
    } else {
      this.setState({ [name]: true });
    }
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
    let invoiceDetails =
      (this.props.invoiceData.getInvoice &&
        this.props.invoiceData.getInvoice.invoice &&
        JSON.parse(
          JSON.stringify(this.props.invoiceData.getInvoice.invoice)
        )) ||
      "";
    if (name === "openInvoiceDetailModal") {
      let lines = (invoiceDetails && invoiceDetails.lines) || [];

      let subTotal = 0;

      lines.map((line, i) => {
        line.id = uuidv1();
        line.checked = false;

        if (line.startTime && line.startTime != "0") {
          line.startTime *= 1000;
        }
        if (line.endTime && line.endTime != "0") {
          line.endTime *= 1000;
        }

        line.amount = Number(line.amount).toFixed(2) || 0.0;

        subTotal = Number(subTotal) + Number(line.amount);
        return line;
      });
      this.setState({ lines, subTotal: Number(subTotal).toFixed(2) });
    }
  };

  //Draft > Edit
  draftEditInvoice = async () => {
    let { tran, multipleTrans } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Invoice can be edit at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      this.props.history.push("/invoice-edit", {
        tran: _trans,
      });
    }
  };

  //Draft > New
  addNewInvoice = () => {
    let type = this.state.showInvoiceTallisTabPane.toLowerCase() || "draft";
    this.props.history.push("/add-new-invoice", {
      type,
    });
  };

  //deleting the Invocie
  deleteInvoice = async () => {
    let { tran, multipleTrans } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Invoice can be Delete at a Time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({ isLoading: true });
      await this.props.deleteInvoice(_trans); //to deleteinvoice
      //success case of Delete Invoice
      if (this.props.invoiceData.deleteInvoiceSuccess) {
        toast.success(this.props.invoiceData.deleteInvoiceSuccess);
        // When deleting an invoice --- Can it just highlight the invoice above the deleted one?
        let {
          getInvoicesList,
          multipleTrans,
          activeInvoice,
          activeInvoiceTallis,
          showInvoiceTallisTabPane,
          invoiceTallies,
          tran,
        } = this.state;

        if (getInvoicesList.length === 1) {
          await this.clearStates();
          //decrease the tallies count also
          invoiceTallies.map((t, i) => {
            if (
              showInvoiceTallisTabPane.toLocaleLowerCase() ===
              t.type.toLocaleLowerCase()
            ) {
              if (t.count === 1) {
                t.count = 0;
              } else {
                t.count = t.count - 1;
              }
            }
            return t;
          });
          this.setState({
            activeInvoiceTallis,
            showInvoiceTallisTabPane,
            invoiceTallies,
          });
        } else if (getInvoicesList.length > 1) {
          if (_trans === tran) {
            //when user delete the current selected invoice
            //there are two cases if the user deletes the first invoice in the list  then active the very next otherwise highlight invoice above the deleted invoice
            let foundIndex = getInvoicesList.findIndex(
              (l) => l.id === activeInvoice
            );
            if (foundIndex != -1 && foundIndex === 0) {
              let inv = getInvoicesList[foundIndex + 1];
              if (inv) {
                await this.getInvoice(inv);
              }
            } else {
              let inv = getInvoicesList[foundIndex - 1];
              if (inv) {
                await this.getInvoice(inv);
              }
            }
            let list = getInvoicesList.filter((l) => l.tran != _trans);
            //decrease the tallies count also
            invoiceTallies.map((t, i) => {
              if (
                showInvoiceTallisTabPane.toLocaleLowerCase() ===
                t.type.toLocaleLowerCase()
              ) {
                if (t.count === 1) {
                  t.count = 0;
                } else {
                  t.count = t.count - 1;
                }
              }
              return t;
            });

            this.setState({
              getInvoicesList: list,
              clonedGetInvoicesList: list,
              invoiceTallies,
              multipleTrans: [],
            });
          } else {
            //when user delete other invoice by checking the check box
            let list = getInvoicesList.filter((l) => l.tran != _trans);
            //decrease the tallies count also
            invoiceTallies.map((t, i) => {
              if (
                showInvoiceTallisTabPane.toLocaleLowerCase() ===
                t.type.toLocaleLowerCase()
              ) {
                if (t.count === 1) {
                  t.count = 0;
                } else {
                  t.count = t.count - 1;
                }
              }
              return t;
            });

            this.setState({
              getInvoicesList: list,
              clonedGetInvoicesList: list,
              invoiceTallies,
              multipleTrans: [],
            });
          }
        }
      }
      //error case of Delete Invoice
      if (this.props.invoiceData.deleteInvoiceError) {
        handleAPIErr(this.props.invoiceData.deleteInvoiceError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    }
  };

  //approve Invoice
  approveInvoice = async () => {
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
      await this.props.approveInvoice(_trans); // approve invoice
      //success case of approve invoice
      if (this.props.invoiceData.approveInvoiceSuccess) {
        // toast.success(this.props.invoiceData.approveInvoiceSuccess);
        await this.getInvoiceTallies(this.state.showInvoiceTallisTabPane, true); //to refresh the list
      }
      //error case of approve invoice
      if (this.props.invoiceData.approveInvoiceError) {
        handleAPIErr(this.props.invoiceData.approveInvoiceError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearInvoiceStates();
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  //decline Invoice
  declineInvoice = async (reason) => {
    let { tran, multipleTrans } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Invoice can be Declined at a Time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.declineInvoice(_trans, reason); // decline invoice
      //success case of decline invoice
      if (this.props.invoiceData.declineInvoiceSuccess) {
        // toast.success(this.props.invoiceData.declineInvoiceSuccess);
        await this.getInvoiceTallies(this.state.showInvoiceTallisTabPane, true); //to refresh the list
      }
      //error case of decline invoice
      if (this.props.invoiceData.declineInvoiceError) {
        handleAPIErr(this.props.invoiceData.declineInvoiceError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearInvoiceStates();
    }
  };

  // sendForApprovalInvoice =>Draft -> send
  sendForApprovalInvoice = async () => {
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
      await this.props.sendForApprovalInvoice(_trans); // send For Approval invoice
      //success case of send For Approval invoice
      if (this.props.invoiceData.sendForApprovalInvoiceSuccess) {
        // toast.success(this.props.invoiceData.sendForApprovalInvoiceSuccess);
        await this.getInvoiceTallies(this.state.showInvoiceTallisTabPane, true); //to refresh the list
      }
      //error case of send For Approval invoice
      if (this.props.invoiceData.sendForApprovalInvoiceError) {
        handleAPIErr(
          this.props.invoiceData.sendForApprovalInvoiceError,
          this.props
        );
      }
      this.setState({ isLoading: false });
      this.props.clearInvoiceStates();
    }
  };

  deleteInvoiceLine = (id) => {
    let { lines } = this.state;
    if (id) {
      let filteredInvoiceLines = lines.filter((p) => p.id != id);

      let subTotal = 0;

      filteredInvoiceLines.map((line, i) => {
        subTotal += Number(line.amount);

        return line;
      });
      this.setState({ lines: filteredInvoiceLines, subTotal });
    }
  };

  //move invoice
  moveInvoice = async () => {
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
      await this.props.moveInvoice(_trans); // move invoice
      //success case of move invoice
      if (this.props.invoiceData.moveInvoiceSuccess) {
        // toast.success(this.props.invoiceData.moveInvoiceSuccess);
        await this.getInvoiceTallies(this.state.showInvoiceTallisTabPane, true); //to refresh the list
      }
      //error case of move invoice
      if (this.props.invoiceData.moveInvoiceError) {
        handleAPIErr(this.props.invoiceData.moveInvoiceError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearInvoiceStates();
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  //add/update invoice Lines
  getNewORUpdatedInvoiceLine = async (invoiceLine) => {
    let { lines } = this.state;

    if (invoiceLine.id) {
      //update case

      var foundIndex = lines.findIndex((p) => p.id == invoiceLine.id);

      // var data = lines.find(p => p.id == invoiceLine.id);
      if (foundIndex != -1) {
        invoiceLine.customFields = lines[foundIndex].customFields || []; //to add custome fields
      }
      if (invoiceLine.customFields && invoiceLine.customFields.length > 0) {
        invoiceLine.customFields.map((c, i) => {
          if (invoiceLine[c.prompt]) {
            return (c.value = invoiceLine[c.prompt]);
          }
        });
      }

      lines[foundIndex] = invoiceLine;
    } else {
      //add case
      invoiceLine.id = uuidv1();
      invoiceLine.checked = false;

      lines.push(invoiceLine);
    }
    this.setState({ lines }, () => {
      let subTotal = Number(0);
      this.state.lines.map((p, i) => {
        subTotal += Number(p.amount);
      });
      this.setState({ subTotal });
    });
  };

  openInvoiceDetailModal = async () => {
    let { multipleTrans, tran } = this.state;

    if (multipleTrans.length === 0) {
      this.openModal("openInvoiceDetailModal");
    } else if (multipleTrans.length == 1) {
      if (multipleTrans[0] === tran) {
        //current selected invoice
        this.openModal("openInvoiceDetailModal");
      } else {
        //other selected invoice
        toast.error("You can edit only Selected Invoice!");
      }
    }
  };

  //update invoice
  updateInvoiceLines = async () => {
    let tran = this.state.tran;
    if (tran) {
      let { lines } = this.state;

      lines.map((l, i) => {
        l.description = l.description.toUpperCase();
        return l;
      });

      this.setState({
        isLoading: true,
      });

      let data = {
        tran,
        invoiceLines: lines,
      };
      await this.props.updateInvoiceLines(data); // update Invoice Lines

      //success case of update Invoice Lines
      if (this.props.invoiceData.updateInvoiceLinesSuccess) {
        // toast.success(this.props.invoiceData.updateInvoiceLinesSuccess);

        //get updated invoice after editing
        let { activeInvoice, tran } = this.state;
        await this.getInvoice(
          {
            id: activeInvoice,
            tran,
          },
          true
        );
        //end
      }
      //error case of update Invoice Lines
      if (this.props.invoiceData.updateInvoiceLinesError) {
        handleAPIErr(
          this.props.invoiceData.updateInvoiceLinesError,
          this.props
        );
      }
      this.setState({ isLoading: false, openInvoiceDetailModal: false });
    } else {
      toast.error("Please select Invoice First!");
    }
  };

  //upldate po-lines according to multiple change modal
  handleMultipleChanges = (data) => {
    let { lines } = this.state;

    let flagIsEmpty = false;

    // data.trackingCodes.map((f, i) => {
    //   if (f.value.trim() == "") {
    //     flagIsEmpty = true;
    //   }
    // });

    lines.map((p, i) => {
      if (p.checked) {
        if (data.chartSort) {
          p.chartSort = data.chartSort;
        }
        // if (data.chartCode) {
        p.chartCode = data.chartCode || "";
        // }
        if (data.trackingCodes && data.trackingCodes.length > 0) {
          p.flags = data.trackingCodes;
        }
      }
      return p;
    });
    this.setState({ lines });
  };

  handleCheckboxesInInvoiceDetails = (e, line) => {
    let { lines } = this.state;
    if (e.target.checked) {
      if (line === "all") {
        lines.map(async (l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        lines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = true;
          }
          return l;
        });
      }
    } else {
      if (line === "all") {
        lines.map(async (l, i) => {
          l.checked = false;
          return l;
        });
      } else {
        lines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = false;
          }
          return l;
        });
      }
    }

    this.setState({
      lines,
    });
  };

  //exclude filters
  handleExclude = (e) => {
    let name = e.target.name;
    let checked = e.target.checked;
    this.setState(
      {
        [name]: checked,
      },
      async () => {
        let { zero, close, fullyApproved } = this.state;

        let check = !zero && !close && !fullyApproved ? true : false; //all checkboxes are uncheck
        const clonedGetInvoicesList = JSON.parse(
          JSON.stringify(this.state.clonedGetInvoicesList)
        );

        if (check) {
          //all checkboxes are uncheck
          this.setState(
            {
              getInvoicesList: clonedGetInvoicesList,
              filteredInvoicesList: clonedGetInvoicesList,
            },
            () => {
              this.handleSortInvoiceLists(this.state.sortFilterInvc);
            }
          );
        } else {
          //checkbox chcek case
          let filterdData = [];
          let excludeFilters = [];
          if (zero) {
            excludeFilters = ["close", "fullyApproved", ""];
          }
          if (close) {
            excludeFilters = ["zero", "fullyApproved", ""];
          }
          if (fullyApproved) {
            excludeFilters = ["zero", "close", ""];
          }
          if (zero && close) {
            excludeFilters = ["fullyApproved", ""];
          }

          if (zero && fullyApproved) {
            excludeFilters = ["close", ""];
          }

          if (close && fullyApproved) {
            excludeFilters = ["zero", ""];
          }

          if (close && fullyApproved && zero) {
            excludeFilters = [""];
          }

          excludeFilters.map((f, i) => {
            let InvoiceListFilterdData = [];

            InvoiceListFilterdData = clonedGetInvoicesList.filter((c) => {
              // if (c.excludeStatus.toUpperCase()) {
              return c.excludeStatus.toUpperCase() === f.toUpperCase();
              // }
            });
            filterdData.push(...InvoiceListFilterdData);
          });

          this.setState(
            {
              getInvoicesList: filterdData,
              filteredInvoicesList: filterdData,
            },
            () => {
              this.handleSortInvoiceLists(this.state.sortFilterInvc);
            }
          );
        }
      }
    );
  };

  //approvals filter
  handleApprovalsFilters = (e, obj) => {
    let checked = e.target.checked;
    obj.checked = checked;

    let approvalsGroups = this.state.approvalsGroups;
    let foundIndex = approvalsGroups.findIndex((a) => a.id == obj.id);
    approvalsGroups[foundIndex] = obj;

    this.setState({
      approvalsGroups,
    });
    let check = false;
    let count = 0;
    approvalsGroups.map((a, i) => {
      if (!a.checked) {
        count += 1;
      }
    });
    if (approvalsGroups.length === count) {
      check = true;
    }
    const clonedGetInvoicesList = JSON.parse(
      JSON.stringify(this.state.clonedGetInvoicesList)
    );

    if (check) {
      //all checkboxes are uncheck
      this.setState(
        {
          getInvoicesList: clonedGetInvoicesList,
          filteredInvoicesList: clonedGetInvoicesList,
        },
        () => {
          this.handleSortInvoiceLists(this.state.sortFilterInvc);
        }
      );
    } else {
      let filterdData = [];

      approvalsGroups.map((a, i) => {
        let InvoiceListFilterdData = [];
        if (a.checked) {
          InvoiceListFilterdData = clonedGetInvoicesList.filter((c) => {
            return (
              c.approvalGroup &&
              c.approvalGroup.toUpperCase() === a.groupName.toUpperCase()
            );
          });
        }
        filterdData.push(...InvoiceListFilterdData);
      });

      this.setState(
        {
          getInvoicesList: filterdData,
          filteredInvoicesList: filterdData,
        },
        () => {
          this.handleSortInvoiceLists(this.state.sortFilterInvc);
        }
      );
    }
  };

  // move to previous invoice
  moveToPrevInvoice = async () => {
    let { getInvoicesList, activeInvoice } = this.state;
    let foundIndex = getInvoicesList.findIndex((l) => l.id === activeInvoice);

    if (foundIndex != -1 && foundIndex != 0) {
      let inv = getInvoicesList[foundIndex - 1];
      if (inv) {
        await this.getInvoice(inv);
      }
    }
  };

  // move to next invoice
  moveToNextInvoice = async () => {
    let { getInvoicesList, activeInvoice } = this.state;
    let foundIndex = getInvoicesList.findIndex((l) => l.id === activeInvoice);

    if (foundIndex != -1) {
      let inv = getInvoicesList[foundIndex + 1];
      if (inv) {
        await this.getInvoice(inv);
      }
    }
  };

  handleCheckbox = (e, data) => {
    let { getInvoicesList, multipleTrans } = this.state;
    let { name, checked } = e.target;
    if (data === "allCheck" && name === "checkboxAll") {
      let multipleTransCopy = [];
      if (checked) {
        getInvoicesList.map((m) => {
          m.checked = true;
          multipleTransCopy.push(m.tran);
          return m;
        });
      } else {
        getInvoicesList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleTrans = [...multipleTransCopy];
    } else {
      if (checked) {
        getInvoicesList.map((invc, i) => {
          if (data.id === invc.id) {
            invc.checked = true;
          }
          return invc;
        });
        multipleTrans.push(data.tran);
      } else {
        getInvoicesList.map(async (invc, i) => {
          if (data.id === invc.id) {
            invc.checked = false;
          }
          return invc;
        });
        let filteredMultiTrans = multipleTrans.filter((t) => t != data.tran);
        multipleTrans = filteredMultiTrans;
      }
    }
    this.setState({
      getInvoicesList,
      multipleTrans,
    });
  };

  getBtachList = async () => {
    let batchList = [];
    let batchListOptions = [];
    await this.props.getBtachList("Invoices");
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
    let { getInvoicesList, filteredInvoicesList } = this.state;

    let batchNo = "";

    const clonedGetInvoicesList = JSON.parse(
      JSON.stringify(this.state.clonedGetInvoicesList)
    );

    if (e.target.checked) {
      batchNo = bNo;

      let invcListFilterdLst = clonedGetInvoicesList.filter((c) => {
        return Number(c.batchNo) === Number(bNo);
      });

      getInvoicesList = invcListFilterdLst;
      filteredInvoicesList = invcListFilterdLst;
    } else {
      //uncheck checkbox
      getInvoicesList = clonedGetInvoicesList;
      filteredInvoicesList = clonedGetInvoicesList;
    }
    this.setState(
      {
        batchNo,
        getInvoicesList,
        filteredInvoicesList,
      },
      () => this.handleSortInvoiceLists(this.state.sortFilterInvc)
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
        type: "AP",
        notes: "",
        insertBatch: true,
      },
    ];

    this.setState({ batchList });
  };

  deleteBatch = async () => {
    let { batchList, batchNo, getInvoicesList, filteredInvoicesList } =
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

        const clonedGetInvoicesList = JSON.parse(
          JSON.stringify(this.state.clonedGetInvoicesList)
        );

        getInvoicesList = clonedGetInvoicesList;
        filteredInvoicesList = clonedGetInvoicesList;
      }
      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchList,
        batchNo,
        getInvoicesList,
        filteredInvoicesList,
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

  zoomIn = async () => {
    $(".invoice_pdf_new").removeClass("invoice_carousel_pdf");
    $(".invoice_pdf_new").removeClass("full_screen_convas");

    let { scaling } = this.state;

    let { scale, dropdownZoomingValue, zoom } = zoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("invoiceZoom", zoom);

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

    let { scale, dropdownZoomingValue, zoom } = zoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("invoiceZoom", zoom);
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

    localStorage.setItem("invoiceZoom", value);

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
        scaling: 3.1,
        dropdownZoomingValue: { label: "35%", value: "35%" },
      });
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

  onLoadSuccessPage = ({ numPages }) => {
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

  onDocumentLoadSuccess = (data, index) => {
    let numPages = data.numPages;
    let { numPagesArr } = this.state;
    numPagesArr[index] = numPages;

    if (index === 0) {
      this.setState({ numPages });
    }
    this.setState({ numPagesArr }, () => this.settPreviewArrows());
  };

  goToPrevPage = async () => {
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

  handlePDFRotate = () => {
    this.setState({ rotate: this.state.rotate + 90 });
  };

  //Regenerate Signature
  regenerateSignatures = async () => {
    let { tran } = this.state;

    if (tran) {
      this.setState({
        isLoading: true,
      });
      await this.props.regenerateSignatures(tran); // regenerate signature
      //success case of regenerate signature
      if (this.props.invoiceData.regenerateSignatureSuccess) {
        toast.success(this.props.invoiceData.regenerateSignatureSuccess);
        //call get invoice API to get the updated Previews List
        await this.props.getInvoice(tran); // get Invocie
        //success case of getInvoice
        if (this.props.invoiceData.getInvoiceSuccess) {
          // toast.success(this.props.invoiceData.getInvoiceSuccess);
          let invoiceDetails =
            (this.props.invoiceData.getInvoice &&
              this.props.invoiceData.getInvoice.invoice &&
              JSON.parse(
                JSON.stringify(this.props.invoiceData.getInvoice.invoice)
              )) ||
            "";

          let previewList =
            (this.props.invoiceData &&
              this.props.invoiceData.getInvoice &&
              this.props.invoiceData.getInvoice.previewList) ||
            [];

          let preview = (invoiceDetails && invoiceDetails.preview) || "";

          this.setState({
            preview,
            previewList,
          });
        }
        //error case of get invoice
        if (this.props.invoiceData.getInvoiceError) {
          handleAPIErr(this.props.invoiceData.getInvoiceError, this.props);
        }
        this.props.clearInvoiceStates();
      }
      //error case of regenerate signature
      if (this.props.invoiceData.regenerateSignatureError) {
        handleAPIErr(
          this.props.invoiceData.regenerateSignatureError,
          this.props
        );
      }
      this.setState({ isLoading: false });
      this.props.clearInvoiceStates();
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  //call get invocie list API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamInvoice", check);
    this.setState({ viewTeam: check }, () => {
      let { activeInvoiceTallis, showInvoiceTallisTabPane } = this.state;
      let obj = {
        id: activeInvoiceTallis,
        type: showInvoiceTallisTabPane,
      };
      this.getInvoicesList(obj);
    });
  };

  openPostModal = () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.openModal("openPostModal");
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  postInvoice = async (data) => {
    let { multipleTrans } = this.state;
    let { period, reportID, generateReport } = data;

    let obj = {
      tran: multipleTrans,
      period,
      reportID,
      generateReport: generateReport ? "Y" : "N",
    };
    this.setState({ isLoading: true });
    await this.props.postInvoice(obj);
    if (this.props.invoiceData.postInvoiceSuccess) {
      toast.success(this.props.invoiceData.postInvoiceSuccess);

      let jsonData = this.props.invoiceData.postInvoice.reportJSON || "";
      let reportFile = this.props.invoiceData.postInvoice.reportTemplate || "";

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
    if (this.props.invoiceData.postInvoiceError) {
      handleAPIErr(this.props.invoiceData.postInvoiceError, this.props);
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  hanldeExport = (type) => {
    if (type === "EXCEL") {
      this.exportInvoice();
    } else if (type === "TPH") {
      this.exportTPH();
    } else {
      //tax invoice case
      this.exportTaxInvoice();
    }
  };

  balanceTax = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.balanceTax(multipleTrans);
      if (this.props.invoiceData.balanceTaxSuccess) {
        toast.success(this.props.invoiceData.balanceTaxSuccess);
      }
      if (this.props.invoiceData.balanceTaxError) {
        handleAPIErr(this.props.invoiceData.balanceTaxError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  exportInvoice = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportInvoice(multipleTrans);
      if (this.props.invoiceData.exportInvoiceSuccess) {
        toast.success(this.props.invoiceData.exportInvoiceSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.invoiceData.exportInvoice || "",
        };
        downloadAttachments(obj, "invoice");
      }
      if (this.props.invoiceData.exportInvoiceError) {
        handleAPIErr(this.props.invoiceData.exportInvoiceError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  exportTPH = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportTPH(multipleTrans);
      if (this.props.invoiceData.exportTPHSuccess) {
        toast.success(this.props.invoiceData.exportTPHSuccess);
      }
      if (this.props.invoiceData.exportTPHError) {
        handleAPIErr(this.props.invoiceData.exportTPHError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  exportTaxInvoice = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportTaxInvoice(multipleTrans);
      if (this.props.invoiceData.exportTaxInvoiceSuccess) {
        toast.success(this.props.invoiceData.exportTaxInvoiceSuccess);
        let exportTaxInvoice = this.props.invoiceData.exportTaxInvoice || [];

        exportTaxInvoice.map((e, i) => {
          let obj = {
            contentType: "application/pdf",
            isDownload: true,
            ...e,
          };
          downloadAttachments(obj);
        });
      }
      if (this.props.invoiceData.exportTaxInvoiceError) {
        handleAPIErr(this.props.invoiceData.exportTaxInvoiceError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  openMoveBatchPopup = () => {
    let { multipleTrans } = this.state;
    if (multipleTrans.length > 0) {
      this.openModal("openMoveModal");
    } else {
      toast.error("Please Select Invoice First!");
    }
  };

  moveBatch = async (batchNo) => {
    let { multipleTrans } = this.state;
    this.setState({ isLoading: true });
    await this.props.moveBatch({ tran: multipleTrans, batchNo });
    if (this.props.invoiceData.moveBatchSuccess) {
      toast.success(this.props.invoiceData.moveBatchSuccess);
    }
    if (this.props.invoiceData.moveBatchError) {
      handleAPIErr(this.props.invoiceData.moveBatchError, this.props);
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  onImport = async (excelData, type) => {
    if (type === "List") {
      await this.importList(excelData);
    } else if (type === "Chq Request") {
      await this.importChqRequest(excelData);
    } else {
      //EP file
      await this.importEPFile(excelData);
    }
  };

  importChqRequest = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importChqRequest(excelData);
    if (this.props.invoiceData.importChqReqSuccess) {
      toast.success(this.props.invoiceData.importChqReqSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.invoiceData.importChqReqError) {
      handleAPIErr(this.props.invoiceData.importChqReqError, this.props);
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  importList = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importList(excelData);
    if (this.props.invoiceData.importListSuccess) {
      toast.success(this.props.invoiceData.importListSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.invoiceData.importListError) {
      handleAPIErr(this.props.invoiceData.importListError, this.props);
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  importEPFile = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importEPFile(excelData);
    if (this.props.invoiceData.importEPFileSuccess) {
      toast.success(this.props.invoiceData.importEPFileSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.invoiceData.importEPFileError) {
      handleAPIErr(this.props.invoiceData.importEPFileError, this.props);
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
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
    let userType = localStorage.getItem("userType");
    let {
      batchList,
      batchNo,
      showInvoiceTallisTabPane,
      activeInvoice,
      getInvoicesList,
      bankDetails,
    } = this.state;

    let tab =
      (showInvoiceTallisTabPane && showInvoiceTallisTabPane.toLowerCase()) ||
      "";

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            invoices={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={this.state.viewTeam}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content dash__invoice--content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu suppliers*/}
            <aside
              className="side-nav suppliers_side_nav mm_invoice_left_sidebar side__content--invoice"
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
                      alignRight={false}
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
                        {tab === "approved" ? (
                          <Dropdown.Item
                            to="#/action-2"
                            className="f-20 flex-container-inner"
                          >
                            <div
                              onClick={() =>
                                this.handleSortInvoiceLists("approvalDate")
                              }
                              className="custom-control custom-radio flex-container-inner"
                            >
                              <input
                                type="radio"
                                className="custom-control-input flex-container-inner-input"
                                id="approvalDate"
                                name="approvalDate"
                                onChange={() => {}}
                                checked={
                                  this.state.sortFilterInvc === "approvalDate"
                                }
                              />
                              <label
                                className="custom-control-label flex-container-inner-input"
                                htmlFor="approvalDate"
                              >
                                Approval Date
                              </label>
                            </div>
                          </Dropdown.Item>
                        ) : (
                          ""
                        )}
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortInvoiceLists("supplierName")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="supplierName"
                              name="supplierName"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterInvc === "supplierName"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="supplierName"
                            >
                              Supplier
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortInvoiceLists("invoiceNumber")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="invoiceNumber"
                              name="invoiceNumber"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterInvc === "invoiceNumber"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="invoiceNumber"
                            >
                              Invoice Number
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortInvoiceLists("date")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={this.state.sortFilterInvc === "date"}
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
                              this.handleSortInvoiceLists("amount")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="amount"
                              name="amount"
                              onChange={() => {}}
                              checked={this.state.sortFilterInvc === "amount"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="amount"
                            >
                              Amount
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortInvoiceLists("userName")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="userName"
                              name="userName"
                              onChange={() => {}}
                              checked={this.state.sortFilterInvc === "userName"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="userName"
                            >
                              Operator
                            </label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortInvoiceLists("approver")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="approver"
                              name="approver"
                              onChange={() => {}}
                              checked={this.state.sortFilterInvc === "approver"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="approver"
                            >
                              Approver
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortInvoiceLists("tran")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="tran"
                              name="tran"
                              onChange={() => {}}
                              checked={this.state.sortFilterInvc === "tran"}
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
                      name="invoicesListSearch"
                      id="invoicesListSearchId"
                      value={this.state.invoicesListSearch}
                      onChange={this.handleChangeInvoiceListSearch}
                      onKeyDown={this.onInvoiceListSearch}
                    />
                  </div>
                </div>
              </div>

              <ul className="suppliers_list">
                {getInvoicesList.map((l, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        l.teamInvoice === "Y"
                          ? getInvoicesList[i + 1] &&
                            getInvoicesList[i + 1].teamInvoice &&
                            getInvoicesList[i + 1].teamInvoice === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : activeInvoice === l.id
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
                              id={"invoice" + i}
                              checked={l.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, l)}
                            />
                            <label
                              htmlFor={"invoice" + i}
                              className="mr-0"
                            ></label>
                          </div>
                        </div>
                        <div
                          onClick={() => this.getInvoice(l)}
                          className="col pl-0"
                        >
                          <div className="invioce_data pr-sm-3">
                            <h4>{l.supplierName}</h4>
                            <div className="row">
                              <div className="col data-i">
                                <p> {l.invoiceNumber}</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>
                                  {l.date ? l.date.trim() : ""}

                                  {/* {moment.unix(l.date).format("DD-MMM-YYYY")} */}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>
                                  <b>Tax:</b> {l.taxAmount}
                                </p>
                              </div>
                              <div className="col-auto data-i">
                                <p>
                                  <b>Due:</b>{" "}
                                  {l.dueDate ? l.dueDate.trim() : ""}
                                  {/* {moment.unix(l.dueDate).format("DD-MMM-YYYY")} */}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>
                                  <b>Total:</b> {l.amount}
                                </p>
                              </div>
                              <div className="col-auto data-i">
                                <div className="text-center cursorPointer">
                                  <p onClick={() => this.handleMoreDetails(l)}>
                                    <Link className="more-details-color" to="#">
                                      more details
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </aside>
            {/* {/ end /} */}

            <section id="contents" className="supplier pr-0 pt-0">
              <div className="body_content ordermain-padi body__invoice--top">
                <div className="container-fluid pl-0 ">
                  <div className="main_wrapper ">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* invoice Tallies */}
                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {this.state.invoiceTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="nav-item cursorPointer"
                                  onClick={() =>
                                    this.getInvoiceTallies(t.type, true)
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activeInvoiceTallis === t.id
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                    // data-toggle="tab"
                                    // href={"#" + `${t.type}`}
                                  >
                                    {t.type}{" "}
                                    <span className="stats">{t.count}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="bg-gry content__elem--style mm_top_nav">
                          <div className="w-100 float-left mm_lr_pad ">
                            <div className="mm_tab_left invoice_left">
                              <div className="tab-content">
                                {tab === "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        onClick={this.addNewInvoice}
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/add.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> New </Link>{" "}
                                      </li>
                                      <li
                                        onClick={() =>
                                          this.state.getInvoicesList.length > 0
                                            ? this.draftEditInvoice()
                                            : () => {}
                                        }
                                        // onClick={()=> this.openModal('openInvoiceDetailModal')}

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
                                          this.state.getInvoicesList.length > 0
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
                                        <Link to="#"> Delete </Link>
                                      </li>

                                      <li
                                        className="cursorPointer"
                                        onClick={() =>
                                          this.state.getInvoicesList.length > 0
                                            ? this.sendForApprovalInvoice()
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
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveInvoice}
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
                                        onClick={this.openInvoiceDetailModal}
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
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {((userType &&
                                        userType.toLowerCase() ===
                                          "operator") ||
                                        (userType &&
                                          userType.toLowerCase() ===
                                            "op/approver")) && (
                                        <li
                                          className="cursorPointer"
                                          onClick={this.moveInvoice}
                                        >
                                          <img
                                            src="images/move.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Move </Link>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {tab === "hold" && (
                                  <div
                                    className={
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveInvoice}
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
                                        onClick={this.openInvoiceDetailModal}
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
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {((userType &&
                                        userType.toLowerCase() ===
                                          "operator") ||
                                        (userType &&
                                          userType.toLowerCase() ===
                                            "op/approver")) && (
                                        <li
                                          className="cursorPointer"
                                          onClick={this.moveInvoice}
                                        >
                                          <img
                                            src="images/move.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Move </Link>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab === "approved" && (
                                  <div
                                    className={
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li></li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "all" && (
                                  <div
                                    className={
                                      this.state.getInvoicesList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li></li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mm_tab_center invoice_right">
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
                                  className="zom-img float-right ml-md-5 mr-0 pl-2 pr-2 more-d mt-0"
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
                                  onClick={this.moveToNextInvoice}
                                >
                                  <img
                                    src="images/arow-r.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    data-slide="next"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mtop-1"
                                  onClick={this.moveToPrevInvoice}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    data-slide="prev"
                                  />{" "}
                                </Link>

                                <div className="side-attachments-2 height-2 mm_invoice_sidebar2 aside__right--height">
                                  <div
                                    onClick={this.regenerateSignatures}
                                    className="main-sec-attach main-bg"
                                  >
                                    Regenerate
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal("openPOLogsModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    PO Log
                                  </div>

                                  <div
                                    onClick={this.downloadPreview}
                                    className="main-sec-attach main-bg"
                                  >
                                    Download Copy
                                    <img
                                      src="images/downlod.png"
                                      className=" img-fluid float-right fa"
                                      alt="user"
                                    />
                                  </div>

                                  <div className="main-sec-attach main-bg mb-0">
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
                                    <div className="">
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
                                      data-target="#Approvals_invoice1 "
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Approvals
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Approvals_invoice1"
                                  >
                                    {this.state.approvalsGroups.map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i + "invoice"}
                                                name={a.groupName}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i + "invoice"}>
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
                                      data-target="#Changes_invoice"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={() =>
                                        this.openModal("openChangesModal")
                                      }
                                    >
                                      Changes
                                      <span className="ml-3 font-weight-bold">
                                        {this.state.invoiceChanges.length}
                                      </span>
                                      <span className="fa fa-angle-right"></span>
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Changes_invoice"
                                  >
                                    {this.state.invoiceChanges.map((c, i) => {
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
                                      data-target="#Activity_invoice"
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
                                    id="Activity_invoice"
                                  >
                                    {this.state.invoiceActivity.map((a, i) => {
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
                                    {["EXCEL", "TPH", "TAX INVOICE"].map(
                                      (op, i) => {
                                        return (
                                          <div
                                            key={i}
                                            className="pl-2 mb-3"
                                            onClick={() =>
                                              this.hanldeExport(op)
                                            }
                                          >
                                            <div className="form-group remember_check d-flex">
                                              <span className="text-mar cursorPointer ml-38">
                                                {op}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal("openReportModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Reports
                                  </div>
                                  <div
                                    className="main-sec-attach main-bg"
                                    onClick={this.balanceTax}
                                  >
                                    Tax Balance
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
                          {this.state.getInvoicesList.length > 0 && (
                            <div
                              id="demo"
                              className={
                                this.state.toggleRightSidebar
                                  ? " carousel slide invoice_carousel mm_invoice_div over_auto_remove invoice-carowsel-new"
                                  : " carousel slide invoice_carousel invoice-carowsel-new "
                              }
                              // className="carousel slide invoice_carousel mm_invoice_div"
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
                                            <div className="invoice_pdf_canvas invoice_pdf_new pdf--buttons pdf__height--content invoice-pdf-height">
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
                                        {" "}
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
                                        {" "}
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

                      <div className="side-attachments mm_invoice_sidebar mm_invoice_sidebar_right aside__right--height">
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
                            {/*Invoice Attachments */}
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Attachments_invoice"
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
                              <p class="float-right mr-3">
                                <img
                                  src="images/add.png"
                                  class=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </p>
                            </span>
                          </div>
                          <div
                            className="collapse show"
                            id="Attachments_invoice"
                          >
                            {this.state.attachments.map((a, i) => {
                              return (
                                <div
                                  onClick={() =>
                                    this.getAttachment(
                                      a.recordID,
                                      a.contentType,
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
                              data-target="#Approvals_invoice"
                            >
                              <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                              Approvals
                            </span>
                          </div>
                          <div className="collapse show" id="Approvals_invoice">
                            {this.state.approvalGroup &&
                              this.state.approvalGroup.trim() && (
                                <div className="main-sec-mid">
                                  {this.state.approvalGroup}
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
                                        {a.approverName}
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

                          {/* Invoice Comments */}
                          <div className="main-sec-attach main-bg">
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Comments_invoice"
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
                          <div className="collapse show" id="Comments_invoice">
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
          onDecline={this.declineInvoice}
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
        />

        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
          activity={this.state.invoiceActivity}
        />

        <Changes
          openChangesModal={this.state.openChangesModal}
          closeModal={this.closeModal}
          changes={this.state.invoiceChanges}
        />

        <InvoiceDetail
          openInvoiceDetailModal={this.state.openInvoiceDetailModal}
          closeModal={this.closeModal}
          openModal={this.openModal}
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          flags_api={this.props.chart.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          invoiceLines={this.state.lines || []} //invoice lines of an Invoice
          subTotal={this.state.subTotal}
          flagsPrompts={
            //to show flags prompts in order detail header
            this.props.user.getDefaultValues &&
            this.props.user.getDefaultValues.flags &&
            this.props.user.getDefaultValues.flags.length > 0
              ? this.props.user.getDefaultValues.flags
              : []
          }
          getNewORUpdatedInvoiceLine={this.getNewORUpdatedInvoiceLine} //update invoice line on add/edit Invoice lines
          updateInvoiceLines={this.updateInvoiceLines}
          handleMultipleChanges={this.handleMultipleChanges} //update invocie-lines according to multiple change modal
          deleteInvoiceLine={this.deleteInvoiceLine} //to delete Invoice line
          props={this.props}
          handleCheckboxesInInvoiceDetails={
            this.handleCheckboxesInInvoiceDetails
          }
          tab={tab}
          props={this.props}
          basisOptions={this.state.basisOptions || []}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
          handleChangeChartCode={this.handleChangeChartCode}
          handleChangeField={this.handleChangeField}
          convertTwoDecimal={this.convertTwoDecimal}
          handleChangeFlags={this.handleChangeFlags}
          onblurCode={this.onblurCode}
          changeChartCode={this.changeChartCode}
          chartCodesList={this.state.chartCodesList}
          clonedChartCodesList={this.state.clonedChartCodesList}
        />

        <InvoiceMoreDetails
          openModal={this.openModal}
          closeModal={this.closeModal}
          openInvoiceMoreDetailsModal={this.state.openInvoiceMoreDetailsModal}
          invoiceMoreDetails={this.state.invoiceMoreDetails}
        />

        <POLogs
          openPOLogsModal={this.state.openPOLogsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          poLog={this.state.poLines}
        />

        <Delete
          openDeleteModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          onDelete={this.deleteInvoice}
        />

        <Import
          state={this.state}
          closeModal={this.closeModal}
          page="invoice"
          onImport={this.onImport}
        />

        <Post
          openPostModal={this.state.openPostModal}
          closeModal={this.closeModal}
          postType="Invoices"
          onSave={this.postInvoice}
          locationProps={this.props}
        />
        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Invoices"
          locationProps={this.props}
        />
        <Move
          closeModal={this.closeModal}
          stateDate={this.state}
          moveBatch={this.moveBatch}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  invoiceData: state.invoice,
  chart: state.chart,
  supplier: state.supplier,
  setup: state.setup,
});

export default connect(mapStateToProps, {
  getInvoiceTallies: InvoiceActions.getInvoiceTallies,
  getInvoicesList: InvoiceActions.getInvoicesList,
  getInvoice: InvoiceActions.getInvoice,
  addComment: InvoiceActions.addComment,
  addInvoiceAttachments: InvoiceActions.addInvoiceAttachments,
  getInvoiceAttachments: InvoiceActions.getInvoiceAttachments,
  approveInvoice: InvoiceActions.approveInvoice,
  declineInvoice: InvoiceActions.declineInvoice,
  deleteInvoice: InvoiceActions.deleteInvoice,
  moveInvoice: InvoiceActions.moveInvoice,
  sendForApprovalInvoice: InvoiceActions.sendForApprovalInvoice,
  updateInvoiceLines: InvoiceActions.updateInvoiceLines,
  regenerateSignatures: InvoiceActions.regenerateSignatures,
  postInvoice: InvoiceActions.postInvoice,
  balanceTax: InvoiceActions.balanceTax,
  exportInvoice: InvoiceActions.exportInvoice,
  exportTPH: InvoiceActions.exportTPH,
  exportTaxInvoice: InvoiceActions.exportTaxInvoice,
  moveBatch: InvoiceActions.moveBatch,
  importChqRequest: InvoiceActions.importChqRequest,
  importList: InvoiceActions.importList,
  importEPFile: InvoiceActions.importEPFile,
  clearInvoiceStates: InvoiceActions.clearInvoiceStates,
  getChartCodes: ChartActions.getChartCodes,
  getChartSorts: ChartActions.getChartSorts,
  getFlags: ChartActions.getFlags,
  clearChartStates: ChartActions.clearChartStates,
  getDefaultValues: UserActions.getDefaultValues,
  getSupplier: SupplierActions.getSupplier,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  getBtachList: SetupActions.getBtachList,
  deleteBatch: SetupActions.deleteBatch,
  updateBatch: SetupActions.updateBatch,
  insertBatch: SetupActions.insertBatch,
  clearSetupStates: SetupActions.clearSetupStates,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Invoice);
