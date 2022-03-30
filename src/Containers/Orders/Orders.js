import React, { Component, Fragment, createContext } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";
import FileSaver from "file-saver";
import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Decline from "../Modals/Decline/Decline";
import MoveToDraft from "../Modals/MoveToDraft/MoveToDraft";
import Delete from "../Modals/Delete/Delete";
import Copy from "../Modals/Copy/Copy";
import Close from "../Modals/Close/Close";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";
import Modify from "../Modals/Modify/Modify";
import OrdersMoreDetails from "../Modals/OrdersMoreDetails/OrdersMoreDetails";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import Company from "../Modals/Company/Company";
import PORefrence from "../Modals/PORefrence/PORefrence";
import Supplier from "../Modals/Supplier/Supplier";
import Delivery from "../Modals/Delivery/Delivery";
import OrderRequest from "../Modals/OrderRequest/OrderRequest";
import OrderDetails from "../Modals/OrderDetail/OrderDetail";
import TotalAmount from "../Modals/TotalAmount/TotalAmount";
import Approvals from "../Modals/Approvals/Approvals";
import POLogs from "../Modals/POLogs/POLogs";
import Post from "../Modals/Post/Post";
import Import from "../Modals/Import/Import";
import _ from "lodash";
import Report from "../Modals/Report/Report";
import { options } from "../../Constants/Constants";
import * as POActions from "../../Actions/POActions/POActions";
import * as SetupActions from "../../Actions/SetupRequest/SetupAction";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as ReportsActions from "../../Actions/ReportsActions/ReportsActions";
import { handleAPIErr, downloadAttachments } from "../../Utils/Helpers";
import {
  handleValidation,
  handleWholeValidation,
} from "../../Utils/Validation";
import { zoomIn, zoomOut, handleDropdownZooming } from "./ImageControllers";
import ReactPaginate from "react-paginate";

const uuidv1 = require("uuid/v1");

class Orders extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      //po summary
      poType: "", //draft, pending, declined, all etc
      tran: "", //tran of current selected po
      multipleTrans: [], //when user selects multiple PO to perform different functionality
      poNumber: "", //to show in PO Reference Modal
      specialConditions: "", //to show/update in delivery modal
      requestedBy: "", //to show/update in order request modal
      requestedDepartment: "", //to show/update in order request modal
      approvalGroup: { label: "Select Approval Group", value: "" },
      approvals: [], //to show on approvals modal
      approvalsGroups: [], //list of approvals Groups checkboxes to filter po list
      approvers: [], //to just show on side menuw bar
      poComments: [], //po comments
      poAttachments: [], //po attachments
      //preview
      preview: "", //orders image
      //company
      companies: [], //to show on company modal (resttructured to show on company drop-list)
      companyOptions: [], //to show on company modal
      companyName: "", //company companyName
      companyID: "", //company companyID
      companyAddress: "", //company companyAddress
      companyTaxID: "", //company taxID
      companyPhone: "", //company phone
      //supplier
      currency: "",
      poDate: "",
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierCode: "",
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //a copy of  suppliersList
      suppliersFlags: [],
      contacts: [], //supplier contacts
      //po lines
      poLines: [],
      subTotal: 0, //to just show on order-details page sub total
      taxTotal: 0,
      grossTotal: 0,
      basisOptions: [],
      orderDescription: "",
      customFields: [],
      //po changes
      poChanges: [],
      //po activity
      poActivity: [],
      //po log
      poLog: [],
      totalPOs: "",
      pageStart: "",
      pageEnd: "",
      page: 1, //The page to retrieve. Returns the first page if left as zero.
      totalPages: "", //getNewPOList return total num of pages
      display: localStorage.getItem("orderDPR") || 10, //The number of orders to display.
      POListSearch: "", //search on po list
      getPOList: [], //side menu (left side) po list data
      clonedGetPOList: [], //a copy of  getPOList
      activePO: "", //to add class active in lists of getting po (in left side )
      activePOTallis: "", //to add class active on po tallis
      showPOTallisTabPane: "", //to add class active on po tallis below tab pane
      filteredPOList: [], //this contains filterd list and used for searching on it
      // exclude filter 'Zero', 'Close'
      zero: false,
      close: false,
      ordersMoreDetails: "", //when click on orders more details

      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes list
      poTallies: [], //e.g Draft, Pending, Approved, etc
      currencyList: [],
      viewTeam: localStorage.getItem("teamOrders") || "N",
      openDeclineModal: false,
      openMoveToDraftModal: false,
      openDeleteModal: false,
      openCopyModal: false,
      openCloseModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openAttachmentsModal: false,
      openCommentsModal: false,
      openModifyModal: false,
      openCompanyModal: false,
      openPORefrenceModal: false,
      openSupplierModal: false,
      openDeliveryModal: false,
      openOrderRequestModal: false,
      openOrderDetailModal: false,
      openTotalAmountModal: false,
      openApprovalsModal: false,
      openPOLogsModal: false,
      openOrdersMoreDetailsModal: false,
      openPostModal: false,
      openImportModal: false,
      openReportModal: false,
      cur_hide: false,
      date_hide: false,
      address_hide: false,
      quote_hide: false,
      sortFilter: "supplier",
      sortFilterCheck: "ASC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC
      // dropdown coding
      scaling: "scale(0.95)",
      dropdownZoomingValue: { label: "40%", value: "40%" },
      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags
      toggleRightSidebar: true,
      formErrors: {
        supplierCode: "",
      },
      editName: false, //check when supplier name is going to edit
      teamOrderCheck: "", //to check selected po is team order or not
      batchList: [],
      batchNo: "", //batch no of current selected batch
      /*
      ---> If an Order is a team order then you must hide these buttons for the user (listed in comment).
      --->If you have multiple orders ticked and one of them is a team order, then hide the buttons as well.
        Draft Pos:
        - Delete
        - Send
        Approve:
        - Approve
        - Hold
        - Decline
        - Edit
        - Prevent editing of PO lines in preview image
        Hold:
        - Approve
        - Decline
        - Edit
        - Prevent editing of PO lines in preview image
        Pending
        - Move
        Declined
        - Move
              */
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
      },
      false
    );
    // end

    //focus search input field by pressing Tab key
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 9) {
        evt.preventDefault();
        let id = document.getElementById("POListSearchId");
        if (id) {
          document.getElementById("POListSearchId").focus();
        }
      }
    };

    // setting the orders more details
    let displayOrdersSetting = localStorage.getItem("displayOrdersSetting");
    let parseSetting = JSON.parse(displayOrdersSetting);
    if (displayOrdersSetting) {
      this.setState({ ...parseSetting });
    }

    //******END*****
    let sortFilter = localStorage.getItem("sortFilter");
    let sortFilterCheck = localStorage.getItem("sortFilterCheck");
    if (sortFilter && sortFilterCheck) {
      this.setState({ sortFilter, sortFilterCheck });
    }
    $(document).ready(function () {
      var vw = $(window).width();
      var nav = $(".navbar.fixed-top").height();
      var underNav = $(".order-tabs").height();
      var wh = $(window).height();
      var h = wh - nav - 60;
      var rsb = wh - nav - underNav - 20;
      var pdfDiv = wh - nav - underNav - 80;
      var pdfWid = vw - 740;
      $("#overload_image").css("width", pdfWid);
      $("#order--dynamic--height").css("height", h);
      $(".side-attachments,.side-attachments-2").css("height", rsb);
      $("#maped_image").css("height", pdfDiv);
      $(window).on("load", function () {
        var vw = $(window).width();
        var nav = $(".navbar.fixed-top").height();
        var underNav = $(".order-tabs").height();
        var wh = $(window).height();
        var h = wh - nav - 60;
        var rsb = wh - nav - underNav - 20;
        var pdfDiv = wh - nav - underNav - 80;
        var pdfWid = vw - 740;
        $("#overload_image").css("width", pdfWid);
        $("#order--dynamic--height").css("height", h);
        $(".side-attachments,.side-attachments-2").css("height", rsb);
        $("#maped_image").css("height", pdfDiv);
      });
      $(window).resize(function () {
        var vw = $(window).width();
        var nav = $(".navbar.fixed-top").height();
        var underNav = $(".order-tabs").height();
        var wh = $(window).height();
        var h = wh - nav - 60;
        var rsb = wh - nav - underNav - 20;
        var pdfDiv = wh - nav - underNav - 80;
        var pdfWid = vw - 740;
        $("#overload_image").css("width", pdfWid);
        $("#order--dynamic--height").css("height", h);
        $(".side-attachments,.side-attachments-2").css("height", rsb);
        $("#maped_image").css("height", pdfDiv);
      });
    });
    $("#expand").on("click", function (e) {
      e.preventDefault();
      $(".maped_image").addClass("mm_pdf_img");
    });

    $(".cus-arro-div2").on("click", function (e) {
      e.preventDefault();
      $(".order_pdf_new").toggleClass("order_left_auto");
    });
    $("#full_screen").on("click", function (e) {
      e.preventDefault();
      $(".explore_img").addClass("fit_top_bottom");
    });
    // end
    // sideBarAccord
    $(".invoice-inherit").click(function () {
      $(".invoice-inherit .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });
    $(".export_crd").click(function () {
      $(".export_crd .sideBarAccord1").toggleClass("rotate_0");
    });
    $(".invoice-inherit2").click(function () {
      $(".sideBarAccord2 ").toggleClass("rotate_0");
    });

    // end
    // when user comes after Add New Supplier
    let { stateData, poSupplier, isNewSupplier, dashboard, tallType } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";
    if (stateData && poSupplier) {
      let po = {
        id: stateData.activePO,
        trans: stateData.tran,
      };
      // await this.getPO(po, true);

      if (isNewSupplier) {
        //add new supplier
        let { supplierName, supplierCode, supplierAddress, currency } =
          stateData;

        let data = {
          name: supplierName,
          code: supplierCode,
          address: supplierAddress,
          currency,
        };
        delete stateData.contacts;
        this.setState({ ...stateData }, () => this.updatePOSupplier(data));
      } else {
        //cancel add new supplier
        this.setState({ ...stateData });
      }
      // scroll to that PO which is going to edit
      var elmnt = document.getElementById(stateData.activePO);
      if (elmnt) {
        elmnt.scrollIntoView();
      }
    } else {
      //when user comes from search page
      let { po, searchPO, tallies, addEditPOCheck, addEditPOTran } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";
      if (po && po.trans && po.type && searchPO) {
        await this.getPOTallies(po.type);
      } else if (dashboard && tallType) {
        //when user click on Orders  Tallies on Dashboard
        await this.getPOTallies(tallType, true);
      } else if (
        tallies &&
        tallies === "Draft" &&
        addEditPOCheck &&
        addEditPOTran
      ) {
        /*Check When Add/Edit Order and then user Save or Cancel that edit, 
        then load the same  Order user just edited/created?.*/

        await this.getPOTallies("Draft", true);
      } else {
        await this.getPOTallies();
      }
    }
    this.setState({ editName: false });
  }

  clearStates = () => {
    this.setState({
      //po summary
      poType: "", //draft, pending, declined, all etc
      tran: "", //tran of current selected po
      poNumber: "", //to show in PO Reference Modal
      specialConditions: "", //to show/update in delivery modal
      requestedBy: "", //to show/update in order request modal
      requestedDepartment: "", //to show/update in order request modal
      approvalGroup: { label: "Select Approval Group", value: "" },
      approvals: [], //to show on approvals modal
      approvalsGroups: [], //list of approvals Groups checkboxes to filter po list
      approvers: [], //to just show on side menuw bar
      poComments: [], //po comments
      poAttachments: [], //po attachments
      //preview
      preview: "", //orders image
      //company
      companies: [], //to show on company modal (resttructured to show on company drop-list)
      companyOptions: [], //to show on company modal
      companyName: "", //company companyName
      companyID: "", //company companyID
      companyAddress: "", //company companyAddress
      companyTaxID: "", //company taxID
      companyPhone: "", //company phone
      //supplier
      currency: "",
      poDate: "",
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierCode: "",
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //a copy of  suppliersList
      suppliersFlags: [],
      contacts: [], //supplier contacts
      //po lines
      poLines: [],
      subTotal: 0, //to just show on order-details page sub total
      taxTotal: 0,
      grossTotal: 0,
      basisOptions: [],
      orderDescription: "",
      customFields: [],
      //po changes
      poChanges: [],
      //po activity
      poActivity: [],
      //po log
      poLog: [],
      multipleTrans: [], //when user selects multiple PO to perform different functionality
      getPOList: [], //side menu (left side) po list data
      clonedGetPOList: [], //a copy of  getPOList
      activePO: "", //to add class active in lists of getting po (in left side )
      activePOTallis: "", //to add class active on po tallis
      showPOTallisTabPane: "", //to add class active on po tallis below tab pane
      filteredPOList: [], //this contains filterd list and used for searching on it
      // exclude filter 'Zero', 'Close' and 'Fully Received'
      zero: false,
      close: false,
      ordersMoreDetails: "", //when click on orders more details
      openOrdersMoreDetailsModal: false,
      openPOLogsModal: false,
      formErrors: {
        supplierCode: "",
      },
      editName: false, //check when supplier name is going to edit
    });
  };

  //get po talleis
  getPOTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined OR after creating new PO etc then update PO Tallies
    this.setState({ isLoading: true });
    let isPOTallies = false; //to check if redux store containe po tallies then dont call API again
    let _poTallies = this.props.poData.poTallies || [];

    if (_poTallies.length === 0 || check) {
      await this.props.getPOTallies(); // get poTallies
    } else {
      isPOTallies = true;
    }
    let poTally = "";

    let { activePOTallis, showPOTallisTabPane } = this.state;
    let poTalliesArr = [];

    //success case of PO tallies
    if (this.props.poData.getPOTalliesSuccess || isPOTallies) {
      // toast.success(this.props.poData.getPOTalliesSuccess);
      let poTallies = this.props.poData.poTallies || [];
      let opTypes = [];

      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType == "operator") {
        opTypes = ["draft", "pending", "declined", "approved", "all"];
      } else if (userType == "approver") {
        opTypes = ["approve", "hold", "pending", "declined", "approved", "all"];
      } else if (userType == "op/approver") {
        opTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      }

      if (opTypes.length > 0) {
        opTypes.map((t, i) => {
          let obj = poTallies.find(
            (tl) => tl.type && tl.type.toLowerCase() === t
          );
          if (obj) {
            poTalliesArr.push(obj);
          }
        });
      } else {
        poTalliesArr = poTallies;
      }

      let _type = "";

      if (type) {
        _type = type;
      } else if (poTalliesArr.length > 0) {
        _type = poTalliesArr[0].type;
      }

      poTalliesArr.map(async (s, i) => {
        if (s.type === _type) {
          let id = uuidv1();
          s.id = id;
          poTally = s;
          activePOTallis = id;
          showPOTallisTabPane = s.type;
        } else {
          s.id = uuidv1();
        }
        return s;
      });
    }
    //error case of PO tallies
    if (this.props.poData.getPOTalliesError) {
      handleAPIErr(this.props.poData.getPOTalliesError, this.props);
    }

    this.setState({
      isLoading: false,
      poTallies: poTalliesArr,
      activePOTallis,
      showPOTallisTabPane,
    });
    if (poTally) {
      //determines if the GetPOList (N) or GetNewPOList (Y) is used.
      await this.checkPOList_API(poTally);
    }
    this.props.clearPOStates();
  };

  //check GetPOList OR GetNewPOList API should be called
  checkPOList_API = (data, check) => {
    let usePageLoading = localStorage.getItem("usePageLoading") || "N";
    usePageLoading = usePageLoading.toLocaleLowerCase();

    //determines if the GetPOList (N) or GetNewPOList (Y) is used.

    if (usePageLoading === "y") {
      this.getNewPOList(data, check);
    } else {
      this.getPOList(data, check);
    }
  };

  //getting the purchase order list when click on Draft || Pending || Approved etc
  getPOList = async (data, check) => {
    let activePO = "";
    let getPOList = [];
    let clonedGetPOList = [];
    let filteredPOList = [];

    let { zero, close } = this.state;

    if (check === "tallies") {
      zero = false;
      close = false;
    }
    this.clearStates();
    this.setState({
      isLoading: true,
      activePOTallis: data.id,
      showPOTallisTabPane: data.type,
      POListSearch: "",
      zero,
      close,
    });

    let teamOrderCheck = this.state.viewTeam;
    if (teamOrderCheck) {
      data.teamOrders = teamOrderCheck;
    }
    await this.props.getPOList(data); // get PO list
    let firstPO = "";
    //success case of PO List
    if (this.props.poData.getPOListSuccess) {
      // toast.success(this.props.poData.getPOListSuccess);
      let _getPOList = this.props.poData.getPOList || [];
      let searchPOTran = "";
      // when a user comes form Search page then show the PO comming from Search page
      let { po, searchPO, addEditPOTran, tallies, addEditPOCheck } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";
      if (po && po.type && po.type.toLowerCase() === data.type.toLowerCase()) {
        if (po && po.trans && po.type && searchPO) {
          let order = getPOList.find(
            (l) => Number(l.trans) === Number(po.trans)
          );

          if (order) {
            getPOList.map(function (l, i) {
              if (l.trans === order.trans) {
                getPOList.splice(i, 1);
                getPOList.unshift(l);

                searchPOTran = l.trans;
              }
            });
          } else {
            //push order comming frm search page
            getPOList.unshift(po);
            searchPOTran = po.trans;

            let { poTallies } = this.state;
            //also increase the count of Tallies
            let f = poTallies.find(
              (p) => p.type.toLowerCase() === po.type.toLowerCase()
            );
            f.count = getPOList.length || Number(f.count);
            var foundIndex = poTallies.findIndex(
              (x) => x.type.toLowerCase() == po.type.toLowerCase()
            );
            poTallies[foundIndex] = f;
          }
        }
      }

      let sortFilter = this.state.sortFilter;
      let sortFilterCheck = this.state.sortFilterCheck;
      _getPOList
        .sort((a, b) => {
          if (
            sortFilter === "poNumber" ||
            sortFilter === "total" ||
            sortFilter === "trans"
          ) {
            let valueA = Number(a[sortFilter]);
            let valueB = Number(b[sortFilter]);
            //for ascending order
            if (sortFilterCheck === "ASC") {
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
          } else if (sortFilter === "date") {
            let valueA = new Date(a.date);
            let valueB = new Date(b.date);

            //for ascending order
            if (sortFilterCheck === "ASC") {
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
          } else if (sortFilter) {
            let valueA = a[sortFilter].toString().toUpperCase();
            let valueB = b[sortFilter].toString().toUpperCase();
            //for ascending order
            if (sortFilterCheck === "ASC") {
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
        .map((po, i) => {
          if (i == 0) {
            let id = uuidv1();
            po.id = id;
            firstPO = po;
            po.checked = false;
            activePO = id;
          } else {
            po.id = uuidv1();
            po.checked = false;
          }
          return po;
        });

      getPOList = _getPOList;
      clonedGetPOList = _getPOList;
      filteredPOList = _getPOList;

      // check if po comming from search page
      let checkPO = getPOList.find((l) => l.trans === searchPOTran);
      if (checkPO) {
        firstPO = checkPO;
        activePO = checkPO.id;
      }

      /*Check When Add/Edit Order and then user Save or Cancel that edit, 
    then load the same  Order user just edited/created?.*/
      if (tallies && tallies === "Draft" && addEditPOCheck && addEditPOTran) {
        let checkPO = getPOList.find((l) => l.trans === addEditPOTran);
        if (checkPO) {
          firstPO = checkPO;
          activePO = checkPO.id;
        }
      }
    }
    //error case of PO List
    if (this.props.poData.getPOListError) {
      handleAPIErr(this.props.poData.getPOListError, this.props);
    }
    await this.props.clearPOStates();

    this.setState({
      activePO,
      getPOList,
      clonedGetPOList,
      filteredPOList,
      isLoading: false,
    });

    if (firstPO) {
      //to call get po baseed on first po in po list
      await this.getPO(firstPO, true);
    }
    await this.props.clearPOStates();
    //Can you ensure that checkboxes on the right hand side stay ticked when in the same section for Exclude?
    if (zero || close) {
      this.handleExclude();
    }
    // scroll to active po
    var elmnt = document.getElementById(this.state.activePO);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //getting the new PO list when usePageLoading = Y
  getNewPOList = async (data, check) => {
    let activePO = "";
    let getPOList = [];
    let clonedGetPOList = [];
    let filteredPOList = [];
    let totalPages = "";
    let pageStart = "";
    let pageEnd = "";
    let totalPOs = "";

    let { zero, close, page, display, sortFilter, viewTeam, POListSearch } =
      this.state;
    if (check === "tallies") {
      zero = false;
      close = false;
    }
    this.clearStates();
    this.setState({
      isLoading: true,
      activePOTallis: data.id,
      showPOTallisTabPane: data.type,
      zero,
      close,
    });
    let obj = {
      poType: data.type,
      display,
      order: sortFilter,
      search: POListSearch,
      page,
      teamOrders: viewTeam,
    };

    await this.props.getNewPOList(obj); // get PO list
    let firstPO = "";
    //success case of PO List
    if (this.props.poData.getNewPOListSuccess) {
      // toast.success(this.props.poData.getNewPOListSuccess);
      let listData = this.props.poData.getNewPOList || "";

      getPOList = listData.poList || [];
      totalPages = listData.totalPages || "";
      pageStart = listData.pageStart || "";
      pageEnd = listData.pageEnd || "";
      totalPOs = listData.totalPOs || "";

      let searchPOTran = "";
      // when a user comes form Search page then show the PO comming from Search page
      let { po, searchPO, addEditPOTran, tallies, addEditPOCheck } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";
      if (po && po.type && po.type.toLowerCase() === data.type.toLowerCase()) {
        if (po && po.trans && po.type && searchPO) {
          let order = getPOList.find(
            (l) => Number(l.trans) === Number(po.trans)
          );

          if (order) {
            getPOList.map(function (l, i) {
              if (l.trans === order.trans) {
                getPOList.splice(i, 1);
                getPOList.unshift(l);

                searchPOTran = l.trans;
              }
            });
          } else {
            //push order comming frm search page
            getPOList.unshift(po);
            searchPOTran = po.trans;

            let { poTallies } = this.state;
            //also increase the count of Tallies
            let f = poTallies.find(
              (p) => p.type.toLowerCase() === po.type.toLowerCase()
            );
            f.count = getPOList.length || Number(f.count);
            var foundIndex = poTallies.findIndex(
              (x) => x.type.toLowerCase() == po.type.toLowerCase()
            );
            poTallies[foundIndex] = f;
          }
        }
      }

      getPOList.map((po, i) => {
        if (i == 0) {
          let id = uuidv1();
          po.id = id;
          firstPO = po;
          po.checked = false;
          activePO = id;
        } else {
          po.id = uuidv1();
          po.checked = false;
        }
        return po;
      });

      clonedGetPOList = getPOList;
      filteredPOList = getPOList;

      // check if po comming from search page
      let checkPO = getPOList.find((l) => l.trans === searchPOTran);
      if (checkPO) {
        firstPO = checkPO;
        activePO = checkPO.id;
      }

      /*Check When Add/Edit Order and then user Save or Cancel that edit, 
    then load the same  Order user just edited/created?.*/
      if (tallies && tallies === "Draft" && addEditPOCheck && addEditPOTran) {
        let checkPO = getPOList.find((l) => l.trans === addEditPOTran);
        if (checkPO) {
          firstPO = checkPO;
          activePO = checkPO.id;
        }
      }
    }
    //error case of PO List
    if (this.props.poData.getNewPOListError) {
      handleAPIErr(this.props.poData.getNewPOListError, this.props);
    }

    await this.props.clearPOStates();
    this.setState({
      activePO,
      getPOList,
      clonedGetPOList,
      filteredPOList,
      totalPages,
      pageStart,
      pageEnd,
      totalPOs,
      isLoading: false,
    });

    if (firstPO) {
      //to call get po baseed on first po in po list
      await this.getPO(firstPO, true);
    }
    await this.props.clearPOStates();
    //Can you ensure that checkboxes on the right hand side stay ticked when in the same section for Exclude?
    if (zero || close) {
      this.handleExclude();
    }
    // scroll to active po
    var elmnt = document.getElementById(this.state.activePO);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //Getting The Single PO
  getPO = async (po, check) => {
    //GetPOSummary and GetPOPreview will be called when a PO is selected in the List
    if (this.state.activePO != po.id || check) {
      await this.clearPOStates(po);
      await Promise.all([
        this.getPOSummary(po.trans, po.type),
        this.getPOPreview(po.trans, po.type),
      ]);
      this.setState({ isLoading: false, poType: po.type });

      //get default values, chart codes, supplier flags, user flags for PO Line Item Modal
      this.getDefaultData();
    }
  };

  //just clear po related states
  clearPOStates = (po) => {
    this.setState({
      isLoading: true,
      poType: "", //draft, pending, declined, all etc
      activePO: po.id,
      teamOrderCheck: po.teamOrder, //to check either PO is team order or not then we can hide buttons based on team orders
      //po summary
      tran: "",
      poNumber: "",
      specialConditions: "",
      requestedBy: "",
      requestedDepartment: "",
      approvalGroup: { label: "Select Approval Group", value: "" }, //to show select in approvals modal
      approvals: [], //to show on approvals modal
      approvalsGroups: [], //list of approvals Groups checkboxes to filter po list
      approvers: [], //to just show on side menuw bar
      poComments: [], //po comments
      poAttachments: [],
      //preview
      preview: "", //orders image
      //company
      companies: [], //to show on company modal (resttructured to show on company drop-list)
      companyOptions: [], //to show on company modal
      companyName: "", //company companyName
      companyID: "", //company companyID
      companyAddress: "", //company companyAddress
      companyTaxID: "", //company taxID
      companyPhone: "", //company phone
      //supplier
      currency: "",
      poDate: "",
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierCode: "",
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //a copy of  suppliersList
      suppliersFlags: [],
      contacts: [], //supplier contacts
      //po lines
      poLines: [],
      subTotal: 0,
      taxTotal: 0,
      grossTotal: 0,
      basisOptions: [],
      orderDescription: "",
      customFields: [],
      //po changes
      poChanges: [],
      //po activity
      poActivity: [],
      //po log
      poLog: [],
    });
  };

  //Get PO Preview
  getPOPreview = async (trans, type) => {
    await this.props.getPOPreview(trans, type);
    //success case of  Get PO Preview
    if (this.props.poData.getPOPreviewSuccess) {
      // toast.success(this.props.poData.getPOPreviewSuccess);

      let preview = this.props.poData.getPOPreview || "";
      this.setState({ preview });
    }
    //error case of Get PO Preview
    if (this.props.poData.getPOPreviewError) {
      handleAPIErr(this.props.poData.getPOPreviewError, this.props);
    }
    this.props.clearPOStates();
  };

  //Get PO Summary
  getPOSummary = async (trans, type) => {
    await this.props.getPOSummary(trans, type);
    //success case of Get PO Summary
    if (this.props.poData.getPOSummarySuccess) {
      // toast.success(this.props.poData.getPOSummarySuccess);

      let poSummary =
        (this.props.poData.getPOSummary &&
          JSON.parse(JSON.stringify(this.props.poData.getPOSummary))) ||
        "";
      let tran = poSummary.tran || "";

      //to show on PO Reference Modal
      let poNumber = poSummary.poNumber || "";
      let specialConditions = poSummary.specialConditions || "";

      let orderDescription = poSummary.description || "";
      let supplierEmail = poSummary.supplierEmail || "";

      let requestedBy = poSummary.requestedBy || "";
      let requestedDepartment = poSummary.requestedDepartment || "";

      let approvalGroup = poSummary.approvalGroup || "";

      let approvalsGroups =
        (poSummary && JSON.parse(JSON.stringify(poSummary.approvalOptions))) ||
        [];
      let aprlsGrps = [];

      approvalsGroups.map((a, i) => {
        aprlsGrps.push({ label: a.groupName, value: a.groupName });
        a.checked = false;
        a.id = uuidv1();
        return a;
      });

      let approvers = poSummary.approvers || [];
      let poAttachments = poSummary.attachments || [];
      let poComments = poSummary.comments || [];

      let subTotal = Number(poSummary.netTotal) || 0.0;
      let taxTotal = Number(poSummary.taxTotal) || 0.0;
      let grossTotal = poSummary.grossTotal || "";

      let currency = poSummary.currency || "";
      let supplierCode = poSummary.supplierCode || "";

      this.setState(
        {
          tran,
          orderDescription,
          supplierEmail,
          poNumber,
          specialConditions,
          requestedBy,
          requestedDepartment,
          approvalGroup: {
            label: approvalGroup ? approvalGroup : "Select Approval Group",
            value: approvalGroup ? approvalGroup : "",
          },
          approvals: aprlsGrps,
          approvalsGroups,
          approvers,
          poAttachments,
          poComments,
          subTotal,
          taxTotal,
          grossTotal,
          currency,
          supplierCode,
        },
        () => {
          let { getPOList } = this.state;
          let currentActivePO = getPOList.find(
            (l) => l.trans === this.state.tran
          );

          //If you have multiple orders ticked and one of them is a team order, then hide the buttons as well.
          let check = false;
          this.state.multipleTrans.map((t, i) => {
            let po = getPOList.find((l) => l.trans === t);
            if (po && po.teamOrder && po.teamOrder.toLowerCase() === "y") {
              check = true;
            }
          });

          if (check) {
            this.setState({ teamOrderCheck: "Y" });
          } else {
            this.setState({ teamOrderCheck: currentActivePO.teamOrder });
          }
        }
      );

      //setting the order zoom
      let orderZoom = localStorage.getItem("orderZoom");

      if (orderZoom) {
        this.handleDropdownZooming({ value: orderZoom });
      }
    }
    //error case of Get PO Summary
    if (this.props.poData.getPOSummaryError) {
      handleAPIErr(this.props.poData.getPOSummaryError, this.props);
    }
    this.props.clearPOStates();
  };

  //Get PO Company
  getPOCompany = async () => {
    // if state contains company data then dont call API again else grab data from component state and redux state (in case when user close comany modal)
    if (this.state.companies.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getPOCompany(this.state.tran);
      this.setState({ isLoading: false });
      //success case of  Get PO Company
      if (this.props.poData.getPOCompanySuccess) {
        // toast.success(this.props.poData.getPOCompanySuccess);

        let getPOCompany = this.props.poData.getPOCompany || "";

        //to show on company modal
        let companyOptions = getPOCompany.companyOptions || [];

        let companies = [];
        companyOptions.map((c, i) => {
          companies.push({ label: c.companyName, value: c.companyID });
        });

        let companyName = getPOCompany.companyName || "";
        let companyAddress = getPOCompany.companyAddress || "";
        let companyTaxID = getPOCompany.taxID || "";
        let companyPhone = getPOCompany.phone || "";
        let companyID = getPOCompany.companyID || "";

        this.setState({
          companies,
          companyName,
          companyAddress,
          companyTaxID,
          companyPhone,
          companyID,
          companyOptions,
        });
      }
      //error case of Get PO Company
      if (this.props.poData.getPOCompanyError) {
        handleAPIErr(this.props.poData.getPOCompanyError, this.props);
      }
      this.props.clearPOStates();
    }

    this.openModal("openCompanyModal");
  };

  //Update PO Company
  updatePOCompany = async () => {
    let { tran, companyID, poType } = this.state;

    let obj = {
      tran,
      companyID,
    };
    this.setState({ isLoading: true });
    await this.props.updatePOCompany(obj);
    //success case of Update PO Company
    if (this.props.poData.updatePOCompanySuccess) {
      // toast.success(this.props.poData.updatePOCompanySuccess);
      this.getPOPreview(tran, poType);
    }
    //error case of  Update PO Company
    if (this.props.poData.updatePOCompanyError) {
      handleAPIErr(this.props.poData.updatePOCompanyError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Update PO Reference
  updatePOReference = async () => {
    let { tran, poNumber, poType } = this.state;

    let obj = {
      tran,
      poNumber,
    };
    this.setState({ isLoading: true });
    await this.props.updatePOReference(obj);
    //success case of Update Special Condition
    if (this.props.poData.updatePORefSuccess) {
      // toast.success(this.props.poData.updatePORefSuccess);
      this.getPOPreview(tran, poType);
    }
    //error case of Update Special Condition
    if (this.props.poData.updatePORefError) {
      handleAPIErr(this.props.poData.updatePORefError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Get PO Supplier
  getPOSupplier = async () => {
    let { tran } = this.state;

    this.setState({ isLoading: true, formErrors: { supplierCode: "" } });
    await this.props.getPOSupplier(tran);
    //success case of Get PO Supplier
    if (this.props.poData.getPOSupplierSuccess) {
      // toast.success(this.props.poData.getPOSupplierSuccess);
      let getPOSupplier = this.props.poData.getPOSupplier || "";

      // to show on supplier modal
      let currency = getPOSupplier.currency || "";
      let poDate = getPOSupplier.date || "";
      let supplierName = getPOSupplier.supplierName || "";

      supplierName =
        supplierName === "Select Vendor from list" ||
        supplierName === "*No Supplier Selected*" ||
        supplierName === "*No Supplier Selected*.."
          ? ""
          : supplierName || "";

      let supplierPhone = getPOSupplier.phone || "";
      let supplierAddress = getPOSupplier.address || "";
      let supplierContact = getPOSupplier.contactName || "";
      let supplierEmail = getPOSupplier.email || "";
      let supplierCode = getPOSupplier.supplierCode || "";

      this.setState(
        {
          currency,
          poDate,
          supplierName,
          supplierPhone,
          supplierAddress,
          supplierContact,
          supplierEmail,
          supplierCode,
        },
        () => {
          let input = document.getElementById("Name");
          //Focus Supplier's Name
          if (input) {
            input.focus();
            input.select();
          }
        }
      );
    }
    //error case of Get PO Supplier
    if (this.props.poData.getPOSupplierError) {
      handleAPIErr(this.props.poData.getPOSupplierError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Update PO Supplier
  updatePOSup = async () => {
    let {
      tran,
      poType,
      currency,
      poDate,
      supplierName,
      supplierPhone,
      supplierAddress,
      supplierContact,
      supplierEmail,
      supplierCode,
    } = this.state;

    let obj = {
      poSupplierSummary: {
        tran,
        currency,
        date: poDate,
        supplierCode,
        address: supplierAddress,
        contactName: supplierContact,
        email: supplierEmail,
        phone: supplierPhone,
        supplierName,
      },
    };
    this.setState({ isLoading: true });
    await this.props.updatePOSupplier(obj);
    //success case of Update PO Supplier
    if (this.props.poData.updatePOSupplierSuccess) {
      // toast.success(this.props.poData.updatePOSupplierSuccess);
      Promise.all([this.getPOPreview(tran, poType), this.getSupplier()]);

      //update po list
      let obj = {
        supplier: supplierName,
      };
      this.updatePOList(obj, tran);
    }
    //error case of Update PO Supplier
    if (this.props.poData.updatePOSupplierError) {
      handleAPIErr(this.props.poData.updatePOSupplierError, this.props);
    }
    this.setState({ isLoading: false, poLines: [] });
    this.props.clearPOStates();
  };

  //Update Special Condition
  updateSpecialConditions = async () => {
    let { tran, specialConditions, poType } = this.state;

    let obj = {
      tran,
      specialConditions,
    };
    this.setState({ isLoading: true });
    await this.props.updateSpecialConditions(obj);
    //success case of Update Special Condition
    if (this.props.poData.updateSpecialConditionSuccess) {
      // toast.success(this.props.poData.updateSpecialConditionSuccess);
      this.getPOPreview(tran, poType);
    }
    //error case of Update Special Condition
    if (this.props.poData.updateSpecialConditionError) {
      handleAPIErr(this.props.poData.updateSpecialConditionError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Update Requested
  updateRequested = async () => {
    let { tran, requestedBy, requestedDepartment, poType } = this.state;

    let obj = {
      tran,
      requestedBy,
      department: requestedDepartment,
    };
    this.setState({ isLoading: true });
    await this.props.updateRequested(obj);
    //success case of Update Requested
    if (this.props.poData.updateRequestedSuccess) {
      // toast.success(this.props.poData.updateRequestedSuccess);
      this.getPOPreview(tran, poType);

      //update po list
      let obj = {
        requestedBy,
        department: requestedDepartment,
      };
      this.updatePOList(obj, tran);
    }
    //error case of Update Requested
    if (this.props.poData.updateRequestedError) {
      handleAPIErr(this.props.poData.updateRequestedError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Get PO Lines
  getPOLines = async () => {
    let { tran, poType } = this.state;

    // if state contains po line data then dont call API again else grab data from component state and redux state (in case when user close comany modal)
    if (this.state.poLines.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getPOLines(tran, poType);
      this.setState({ isLoading: false });
      //success case of Get PO Lines
      if (this.props.poData.getPOLinesSuccess) {
        // toast.success(this.props.poData.getPOLinesSuccess);
        let poLineSummary = this.props.poData.getPOLines || "";

        let poLines = poLineSummary.poLines || [];
        poLines = JSON.parse(JSON.stringify(poLines));
        let subTotal = Number(poLineSummary.netTotal) || 0.0;
        let taxTotal = Number(poLineSummary.taxTotal) || 0.0;
        let grossTotal = poLineSummary.grossTotal || "";
        poLines.map((poLine, i) => {
          poLine.id = uuidv1();
          poLine.checked = false;
          // if (poLine.startTime && poLine.startTime != "0") {
          //   poLine.startTime *= 1000;
          // }
          // if (poLine.endTime && poLine.endTime != "0") {
          //   poLine.endTime *= 1000;
          // }
          poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;
          poLine.toDate = poLine.endDate;
          poLine.fromDate = poLine.startDate;

          return poLine;
        });

        /*
          client- I've added a poLine with lineNo -1 to the responses for 
          GetPOLines and GetPO to provide the custom fields for the lines. 
          Can these be hidden on the front end so users don't accidently try to add/edit these lines?
        */
        let dummyPOLine = poLines.find((line) => line.lineNo === -1);
        let customFields = (dummyPOLine && dummyPOLine.customFields) || [];

        let filteredLines = poLines.filter((line) => line.lineNo != -1); // remove line with lineNo = -1

        let basisOptions = poLineSummary.basisOptions || [];
        let orderDescription = poLineSummary.description || "";

        this.setState({
          poLines: filteredLines,
          customFields,
          subTotal: Number(subTotal).toFixed(2),
          taxTotal: taxTotal.toFixed(2),
          grossTotal,
          basisOptions,
          orderDescription,
        });
      }
      //error case of Get PO Lines
      if (this.props.poData.getPOLinesError) {
        handleAPIErr(this.props.poData.getPOLinesError, this.props);
      }

      this.props.clearPOStates();
    }
    this.setState({ openOrderDetailModal: true });
  };

  //Update PO Lines
  updatePOLines = async () => {
    let {
      tran,
      orderDescription,
      taxTotal,
      grossTotal,
      subTotal,
      poLines,
      poType,
    } = this.state;

    poLines.map((line) => {
      line.description = line.description.toUpperCase();

      if (
        line.type === "Rental/Hire" ||
        line.type === "Hire/Rental" ||
        line.type === "Car"
      ) {
        line.startDate = line.fromDate;
        line.endDate = line.toDate;
        line.startTime = line.startTime;
        line.endTime = line.endTime;
      }

      return line;
    });

    let obj = {
      poType,
      poLineSummary: {
        tran,
        description: orderDescription,
        taxTotal,
        grossTotal,
        netTotal: subTotal,
        poLines,
      },
    };
    this.setState({ isLoading: true });
    await this.props.updatePOLines(obj);
    //success case of Update PO Lines
    if (this.props.poData.updatePOLinesSuccess) {
      // toast.success(this.props.poData.updatePOLinesSuccess);
      this.getPOPreview(tran, poType);

      //update po list
      let obj = {
        total: grossTotal,
        taxAmount: taxTotal,
      };
      this.updatePOList(obj, tran);
    }
    //error case of Update PO Lines
    if (this.props.poData.updatePOLinesError) {
      handleAPIErr(this.props.poData.updatePOLinesError, this.props);
    }
    this.setState({ isLoading: false });
  };

  //Update PO Amounts
  updatePOAmounts = async () => {
    let { tran, subTotal, taxTotal, grossTotal, poType } = this.state;
    let obj = {
      tran,
      grossAmount: Number(taxTotal) + Number(subTotal),
      taxAmount: Number(taxTotal),
    };
    this.setState({ isLoading: true });
    await this.props.updatePOAmounts(obj);
    //success case of Update Special Condition
    if (this.props.poData.updatePOAmountSuccess) {
      // toast.success(this.props.poData.updatePOAmountSuccess);
      this.getPOPreview(tran, poType);

      //update po list
      let obj = {
        total: grossTotal,
        taxAmount: taxTotal,
      };
      this.updatePOList(obj, tran);
    }
    //error case of Update Special Condition
    if (this.props.poData.updatePOAmountError) {
      handleAPIErr(this.props.poData.updatePOAmountError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Update Approval Group
  updateApprovalGroup = async () => {
    let { tran, approvalGroup, poType } = this.state;
    approvalGroup = approvalGroup.value || "";
    let obj = {
      tran,
      approvalGroup,
    };
    this.setState({ isLoading: true });
    await this.props.updateApprovalGroup(obj);
    //success case of Update Approval Group
    if (this.props.poData.updateApprovalGroupSuccess) {
      // toast.success(this.props.poData.updateApprovalGroupSuccess);
      this.getPOPreview(tran, poType);
    }
    //error case of Update Approval Group
    if (this.props.poData.updateApprovalGroupError) {
      handleAPIErr(this.props.poData.updateApprovalGroupError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();
  };

  //Get PO Changes
  getPOChanges = async () => {
    let { poChanges, tran } = this.state;
    //if state contains po changes then dont call API again
    if (poChanges.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getPOChanges(tran);
      this.setState({ isLoading: false });

      //success case of  Get PO Changes
      if (this.props.poData.getPOChangesSuccess) {
        // toast.success(this.props.poData.getPOChangesSuccess);

        let poChanges = this.props.poData.getPOChanges || [];
        this.setState({ poChanges });
      }
      //error case of Get PO Changes
      if (this.props.poData.getPOChangesError) {
        handleAPIErr(this.props.poData.getPOChangesError, this.props);
      }
      this.props.clearPOStates();
    }
    this.openModal("openChangesModal");
  };

  //Get PO Logs
  getPOLog = async () => {
    let { poLog, tran } = this.state;

    //if state contains po log then dont call API again
    if (poLog.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getPOLog(tran);
      this.setState({ isLoading: false });

      //success case of  Get PO Log
      if (this.props.poData.getPOLogSuccess) {
        // toast.success(this.props.poData.getPOLogSuccess);
        let poLog = this.props.poData.getPOLog || [];
        this.setState({ poLog });
      }
      //error case of Get PO Log
      if (this.props.poData.getPOLogError) {
        handleAPIErr(this.props.poData.getPOLogError, this.props);
      }
      this.props.clearPOStates();
    }
    this.openModal("openPOLogsModal");
  };

  //get PO Activity
  getPOActivity = async () => {
    let { poActivity, tran } = this.state;

    //if state contains po activity then dont call API again
    if (poActivity.length === 0) {
      this.setState({ isLoading: true });
      await this.props.getPOActivity(tran);
      this.setState({ isLoading: false });

      //success case of  Get PO Activity
      if (this.props.poData.getPOActivitySuccess) {
        // toast.success(this.props.poData.getPOActivitySuccess);

        let poActivity = this.props.poData.getPOActivity || [];
        this.setState({ poActivity });
      }
      //error case of Get PO Activity
      if (this.props.poData.getPOActivityError) {
        handleAPIErr(this.props.poData.getPOActivityError, this.props);
      }
      this.props.clearPOStates();
    }
    this.openModal("openActivityModal");
  };
  //get data of default values, flags, chart codes and supplier flags to show in PO Line Item Modal
  getDefaultData = async () => {
    let promises = [];
    let { currency, supplierCode, suppliersFlags, chartCodesList } = this.state;

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
    //call getSupplier when supplier flags = 0
    if (currency && supplierCode && suppliersFlags.length === 0) {
      /*The tracking flags from the getSupplier request need to be reconciled with
        the tracking codes from the users default tracking codes*/
      promises.push(this.getSupplier());
    }

    if (!this.props.chart.getFlags) {
      promises.push(this.props.getFlags());
    }

    if (chartCodesList.length === 0) {
      promises.push(this.getChartCodes("", "all"));
    }

    let userType = localStorage.getItem("userType") || "";
    userType = userType.toLowerCase();
    //only admin type of users can see batch list
    if (
      userType === "admin" ||
      userType === "sysadmin" ||
      userType === "accounts"
    ) {
      promises.push(this.getBtachList());
    }

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

    // this is for Line Items Modal (Tracking Codes)
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

    this.props.clearChartStates();
    this.props.clearUserStates();
  };

  updatePOList = (newVal, tran) => {
    //update po list
    let getPOList = this.state.getPOList;

    var foundIndex = getPOList.findIndex((x) => x.trans == tran);
    if (foundIndex >= 0) {
      let order = getPOList[foundIndex];
      order = { ...order, ...newVal };

      getPOList[foundIndex] = order;

      this.setState({
        getPOList,
        clonedGetPOList: getPOList,
        filteredPOList: getPOList,
      });
    }
  };

  // Draft > + New
  insertPO = async () => {
    let { poTallies, getPOList } = this.state;
    this.setState({ isLoading: true });
    await this.props.insertPO(); // insertPO po
    //success case of Insert PO
    if (this.props.poData.insertPOSuccess) {
      // toast.success(this.props.poData.insertPOSuccess);

      let poDetails =
        (this.props.poData.insertPO &&
          this.props.poData.insertPO.poDetails &&
          JSON.parse(JSON.stringify(this.props.poData.insertPO.poDetails))) ||
        "";
      let tran = poDetails.tran || "";
      let preview = this.props.poData.insertPO.preview || "";

      //to show on PO Reference Modal
      let poNumber = poDetails.poNumber || "";
      let poDate = poDetails.poDate || "";

      poDate =
        moment(poDate, "DD/MM/YYYY").format("DD MMM YYYY").toUpperCase() || "";

      let specialConditions = poDetails.specialConditions || "";

      let orderDescription = poDetails.description || "";
      let supplierEmail = poDetails.supplierEmail || "";

      let requestedBy = poDetails.requestedBy || "";
      let requestedDepartment = poDetails.requestedDepartment || "";

      let approvalGroup = poDetails.approvalGroup || "";

      let approvalsGroups =
        (poDetails && JSON.parse(JSON.stringify(poDetails.approvalOptions))) ||
        [];
      let aprlsGrps = [];

      approvalsGroups.map((a, i) => {
        aprlsGrps.push({ label: a.groupName, value: a.groupName });
        a.checked = false;
        a.id = uuidv1();
        return a;
      });
      let approvers = poDetails.approvers || [];
      let poAttachments = poDetails.attachments || [];
      let poComments = poDetails.comments || [];

      let subTotal = Number(poDetails.netTotal) || 0.0;
      let taxTotal = Number(poDetails.taxTotal) || 0.0;
      let grossTotal = poDetails.grossTotal || "";

      let currency = poDetails.currency || "";
      let supplierCode = poDetails.supplierCode || "";

      let id = uuidv1();
      //also add newly created PO in the PO List
      let obj = {
        id,
        type: "Draft",
        approvalGroup,
        approved: "",
        approver: "",
        date: poDate,
        department: requestedDepartment,
        description: orderDescription,
        excludeStatus: "",
        modifyNumber: "",
        orderBy: "",
        poNumber,
        requestedBy,
        specialConditions,
        supplier: poDetails.supplierName || "",
        supplierEmail,
        symbol: "",
        taxAmount: taxTotal,
        total: grossTotal,
        trans: tran,
      };

      await this.clearPOStates(obj);

      getPOList = [...getPOList, obj];

      //also increase the draft tallies count
      poTallies.map((t, i) => {
        if (t.type.toLowerCase() === "draft") {
          t.count = Number(t.count) + 1;
        }
        return t;
      });
      this.setState({
        poType: "Draft",
        tran,
        preview,
        getPOList,
        clonedGetPOList: getPOList,
        filteredPOList: getPOList,
        poDate,
        orderDescription,
        supplierEmail,
        poNumber,
        specialConditions,
        requestedBy,
        requestedDepartment,
        approvalGroup: {
          label: approvalGroup ? approvalGroup : "Select Approval Group",
          value: approvalGroup ? approvalGroup : "",
        },
        approvals: aprlsGrps,
        approvalsGroups,
        approvers,
        poAttachments,
        poComments,
        subTotal,
        taxTotal,
        grossTotal,
        currency,
        supplierCode,
        poTallies,
      });
      // scroll to active po
      var elmnt = document.getElementById(id);
      if (elmnt) {
        elmnt.scrollIntoView();
      }
    }
    //error case of Insert  PO
    if (this.props.poData.insertPOError) {
      handleAPIErr(this.props.poData.insertPOError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearPOStates();

    if (getPOList.length === 1) {
      //get default values, chart codes, supplier flags, user flags for PO Line Item Modal
      this.getDefaultData();
    }
  };

  //only "OPERATOR" can edit the PO
  //Draft > Edit
  draftEditPO = async () => {
    let { tran, multipleTrans, currency, supplierCode } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One PO can be edit at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      this.props.history.push("/new-purchase-order", {
        tran: _trans,
      });
    }
  };

  getBtachList = async () => {
    this.setState({ isLoading: true });
    let batchList = [];
    await this.props.getBtachList("Orders");
    if (this.props.setup.getBatchListSuccess) {
      // toast.success(this.props.setup.getBatchListSuccess)
      batchList = this.props.setup.getBatchList || [];
    }
    if (this.props.setup.getBatchListError) {
      handleAPIErr(this.props.setup.getBatchListError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false, batchList });
  };

  handleChangeBatchFields = (e, batch, index) => {
    let { batchList } = this.state;
    let { name, value } = e.target;
    batch[name] = value;
    batchList[index] = batch;
    this.setState({ batchList });
  };

  handleBatchCheckbox = (e, bNo) => {
    let { getPOList, filteredPOList } = this.state;

    let batchNo = "";

    const clonedGetPOList = JSON.parse(
      JSON.stringify(this.state.clonedGetPOList)
    );

    if (e.target.checked) {
      batchNo = bNo;

      let poListFilterdData = clonedGetPOList.filter((c) => {
        return Number(c.batchNo) === Number(bNo);
      });

      getPOList = poListFilterdData;
      filteredPOList = poListFilterdData;
    } else {
      //uncheck checkbox
      getPOList = clonedGetPOList;
      filteredPOList = clonedGetPOList;
    }
    this.setState({
      batchNo,
      getPOList,
      filteredPOList,
    });
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
        type: "PO",
        notes: "",
        insertBatch: true,
      },
    ];

    this.setState({ batchList });
  };

  deleteBatch = async () => {
    let { batchList, batchNo, getPOList, filteredPOList } = this.state;

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

        const clonedGetPOList = JSON.parse(
          JSON.stringify(this.state.clonedGetPOList)
        );

        getPOList = clonedGetPOList;
        filteredPOList = clonedGetPOList;
      }
      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchList,
        batchNo,
        getPOList,
        filteredPOList,
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

  getSupplier = async () => {
    /*
    168. Vendor Tracking Codes vs User Tracking Codes - 
    These codes need to be reconciled when creating a new Invoice or Order line. 
    The tracking flags from the getSupplier request need to be reconciled with
    the tracking codes from the users default tracking codes. The Supplier flags will overwrite
    and take precedence over the user's codes if they don't exist. For example, if a **supplier** has 
    the following tracking codes: **Free = A and Tax = G**. And a **User** has the following tracking codes,
    **Insurance = NQ, Tax = V, and Set = 5000**. It will merge these codes with **supplier taking precedence**, 
    so the tracking code of the Invoice or Order line will
    now be **Insurance = NQ, Free = A, Tax = G (because the supplier gets priority) and Set = 5000**.
    */
    let { currency, supplierCode } = this.state;
    let supplierDetails = {
      currency,
      code: supplierCode,
    };

    await this.props.getSupplier(supplierDetails);

    //success case of Get single Supplier
    if (this.props.supplier.getSupplierSuccess) {
      // toast.success(this.props.supplier.getSupplierSuccess);
      let flgs = this.props.supplier.getSupplier.flags || [];

      this.setState({ suppliersFlags: flgs });
    }
    //error case of Get single Supplier
    if (this.props.supplier.getSupplierError) {
      handleAPIErr(this.props.supplier.getSupplierError, this.props);
    }
    this.props.clearSupplierStates();
  };

  //get supplier's list
  getSuppliersList = async () => {
    await this.props.getSuppliersList(this.state.currency || "", "", "ORDER"); //second param for previous supplier(used in search page)
    //success case of Get Suppliers List
    if (this.props.supplier.getSuppliersListSuccess) {
      // toast.success(this.props.supplier.getSuppliersListSuccess)
      this.setState({
        suppliersList: this.props.supplier.getSuppliersList || [],
      });
    }
    //error case of Get Suppliers List
    if (this.props.supplier.getSuppliersListError) {
      handleAPIErr(this.props.supplier.getSuppliersListError, this.props);
    }
    this.props.clearSupplierStates();
  };

  getSuppliersContacts = async (check) => {
    let { currency, supplierCode } = this.state;
    let data = {
      currency,
      code: supplierCode,
    };
    if (currency && supplierCode) {
      await this.props.getSupplierContacts(data);

      //success case of get  Supplier Contacts
      if (this.props.supplier.getSupplierContactsSuccess) {
        // toast.success(this.props.supplier.getSupplierContactsSuccess);
        let contacts = this.props.supplier.getSupplierContacts || [];
        contacts.map((c, i) => {
          c.checked = false;
          return c;
        });

        if (contacts.length > 0 && !check) {
          this.setState({
            supplierContact: contacts[0].name,
            supplierEmail: contacts[0].email,
            supplierPhone: contacts[0].phone,
            contacts,
          });
        } else {
          this.setState({ contacts });
        }
      }
      //error case of get Supplier Contacts
      if (this.props.supplier.getSupplierContactsError) {
        handleAPIErr(this.props.supplier.getSupplierContactsError, this.props);
      }
      this.props.clearSupplierStates();
    }
  };

  //updating the contacts list after adding, updating OR deleting the contact
  updateSupplierContactsList = async (contact, check) => {
    if (check === "add") {
      await this.getSuppliersContacts(true);
      //let contacts = this.state.contacts;
      //contacts.push(contact);
      //this.setState({ contacts });
    } else if (check === "edit") {
      let foundIndex = this.state.contacts.findIndex((c) => c.id == contact.id);
      this.state.contacts[foundIndex] = contact;
    } else {
      //delete case
      let contacts = this.state.contacts || [];
      let filteredContacts = contacts.filter((c) => c.id != contact.id);
      this.setState({ contacts: filteredContacts });
    }
  };

  /*Draft Orders - When in the preview pdf supplier edit screen, after creating a new quick supplier and
   saving them, it should auto populate the supplier details and contact person into the PO */
  addNewSupplier = (data) => {
    let { name, code, address, currency, contactName, phone, email } = data;

    this.setState({
      supplierName: name,
      supplierCode: code,
      supplierAddress: address,
      currency,
      supplierContact: contactName,
      supplierEmail: email,
      supplierPhone: phone,
      formErrors: {
        supplierCode: "",
      },
    });
  };

  //update PO supplier
  updatePOSupplier = async (data) => {
    let { formErrors } = this.state;
    let { name, code, address, currency } = data;

    formErrors = handleValidation("supplierCode", code, formErrors);

    this.setState(
      {
        isLoading: true,
        supplierName: name,
        supplierCode: code,
        supplierAddress: address,
        currency,
        // clear contacts
        supplierContact: "",
        supplierEmail: "",
        supplierPhone: "",
        formErrors,
      },
      async () => {
        //to get suppliers contacts
        await this.getSuppliersContacts();
      }
    );

    this.setState({
      isLoading: false,
    });
  };

  //update PO supplier's contacst
  updatePOSupplierContacts = (data) => {
    let { name, email, phone, id } = data;
    this.setState({
      supplierContact: name,
      supplierEmail: email,
      supplierPhone: phone,
    });
  };

  //handleCurrencyChange
  handleCurrencyChange = async (data) => {
    this.setState({
      currency: data.value,
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierCode: "",
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //a copy of  suppliersList
      contacts: [],
      isLoading: true,
    });

    await this.getSuppliersList();

    let { poLines, currency } = this.state;
    this.state.poLines.map((l, i) => {
      let chartSort = "";

      let sortArray = l.chartSort.split(".");

      if (sortArray.length === 3) {
        let sortCurrency = currency
          ? currency
          : sortArray[0]
          ? sortArray[0]
          : "";
        let sortLocation = sortArray[1] ? sortArray[1] : "";
        let sortEpisode = sortArray[2] ? sortArray[2] : "";
        l.chartSort = sortCurrency + "." + sortLocation + "." + sortEpisode;
      } else {
        l.chartSort = l.chartSort;
      }
      return l;
    });

    this.setState({ poLines, isLoading: false });
  };

  handleChangeSupplierName = (e) => {
    let {
      supplierContact,
      supplierEmail,
      supplierPhone,
      contacts,
      formErrors,
    } = this.state;
    $(".invoice_vender_menu1").show();

    let value = e.target.value;

    formErrors.supplierCode = "This Field is Required.";

    let clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.suppliersList)
    );

    if (!value) {
      clonedSuppliersList = [];
    } else {
      let suppliersListFilterdData = clonedSuppliersList.filter((c) => {
        return c.name.toUpperCase().includes(value.toUpperCase());
      });
      clonedSuppliersList = suppliersListFilterdData;
      supplierContact = "";
      supplierEmail = "";
      supplierPhone = "";
      contacts = [];
    }
    this.setState({
      supplierName: value,
      supplierCode: "",
      editName: true,
      clonedSuppliersList,
      supplierContact,
      supplierEmail,
      supplierPhone,
      contacts,
      formErrors,
    });
  };
  /* 
    8-Add 3 dot menu next to Save/Cancel with option to display hidden cards so user can unhide. 
    Options on 3 dot menu to hide unhide following fields: curr, date, supplier address and import quote
  */
  handleHideCheck = (name, value) => {
    this.setState({ [name]: !value }, () => {
      let { cur_hide, date_hide, address_hide, quote_hide } = this.state;
      let hide_cards = [];
      hide_cards = {
        cur_hide,
        date_hide,
        address_hide,
        quote_hide,
      };
      let username = localStorage.getItem("userLogin") || "";
      localStorage.setItem(
        username + "_HideSuppCards",
        JSON.stringify(hide_cards)
      );
    });
  };

  validateField = async (name, code) => {
    let { formErrors } = this.state;
    formErrors = handleValidation("supplierCode", code, formErrors);
    this.setState({
      formErrors: formErrors,
    });
  };

  openModal = async (name) => {
    if (name === "openSupplierModal") {
      let name = localStorage.getItem("userLogin") || "";
      let data = localStorage.getItem(name + "_HideSuppCards");
      data = data ? JSON.parse(data) : "";

      this.setState({ openSupplierModal: true, ...data });
      this.getPOSupplier();
      Promise.all([
        this.getSuppliersList(),
        this.getSuppliersContacts(true),
        this.getCurrencies(),
      ]);
    } else {
      this.setState({ [name]: true }, () => {
        if (name === "openReportModal") {
        }
      });
    }
  };

  closeModal = (name) => {
    this.setState({
      [name]: false,
      ordersMoreDetails: "",
    });

    let poSummary =
      (this.props.poData.getPOSummary &&
        JSON.parse(JSON.stringify(this.props.poData.getPOSummary))) ||
      "";

    //to put initial values again when modal closed`
    if (name === "openCompanyModal") {
      let getPOCompany = this.props.poData.getPOCompany || "";
      let companyOptions = getPOCompany.companyOptions || [];
      let companyName = getPOCompany.companyName || "";
      let companyAddress = getPOCompany.companyAddress || "";
      let companyTaxID = getPOCompany.taxID || "";
      let companyPhone = getPOCompany.phone || "";
      let companyID = getPOCompany.companyID || "";
      this.setState({
        companyName,
        companyAddress,
        companyTaxID,
        companyPhone,
        companyID,
        companyOptions,
      });
    } else if (name === "openDeliveryModal") {
      let specialConditions = poSummary.specialConditions || "";
      this.setState({ specialConditions });
    } else if (name === "openOrderRequestModal") {
      let requestedBy = poSummary.requestedBy || "";
      let requestedDepartment = poSummary.requestedDepartment || "";
      this.setState({ requestedBy, requestedDepartment });
    } else if (name === "openApprovalsModal") {
      let approvalGroup = poSummary.approvalGroup || "";
      approvalGroup = {
        label: approvalGroup ? approvalGroup : "Select Approval Group",
        value: approvalGroup ? approvalGroup : "",
      };
      this.setState({ approvalGroup });
    } else if (name === "openPORefrenceModal") {
      let poNumber = poSummary.poNumber || "";
      this.setState({
        poNumber,
      });
    } else if (name === "openTotalAmountModal") {
      let subTotal = poSummary.netTotal || 0;
      let taxTotal = poSummary.taxTotal || 0;
      let grossTotal = poSummary.grossTotal || 0;
      this.setState({
        subTotal,
        taxTotal,
        grossTotal,
      });
    } else if (name === "openOrderDetailModal") {
      let poLineSummary =
        JSON.parse(JSON.stringify(this.props.poData.getPOLines)) || "";

      let poLines = poLineSummary.poLines || [];

      let subTotal = Number(poLineSummary.netTotal) || 0.0;
      let taxTotal = Number(poLineSummary.taxTotal) || 0.0;
      let grossTotal = poLineSummary.grossTotal || "";
      poLines.map((poLine, i) => {
        poLine.id = uuidv1();
        poLine.checked = false;
        // if (poLine.startTime && poLine.startTime != "0") {
        //   poLine.startTime *= 1000;
        // }
        // if (poLine.endTime && poLine.endTime != "0") {
        //   poLine.endTime *= 1000;
        // }
        poLine.toDate = poLine.endDate;
        poLine.fromDate = poLine.startDate;
        poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;
        return poLine;
      });

      let filteredLines = poLines.filter((line) => line.lineNo != -1); // remove line with lineNo = -1

      let basisOptions = poLineSummary.basisOptions || [];
      let orderDescription = poLineSummary.description || "";

      this.setState({
        poLines: filteredLines,
        subTotal: Number(subTotal).toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        grossTotal,
        basisOptions,
        orderDescription,
      });
    } else if (name === "openSupplierModal") {
      this.setState({
        currency: "",
        poDate: "",
        supplierName: "",
        supplierAddress: "",
        supplierContact: "",
        supplierEmail: "",
        supplierPhone: "",
        supplierCode: "",
      });
    }
  };

  getCurrencies = async () => {
    let isCurrencies = false;
    if (this.props.chart.getCurrencies.length > 0) {
      isCurrencies = true;
    } else {
      await this.props.getCurrencies();
    }

    // get currencies success
    if (this.props.chart.getCurrenciesSuccess || isCurrencies) {
      // toast.success(this.props.chart.getCurrenciesSuccess);
      //currencies list
      if (
        this.props.chart.getCurrencies &&
        this.props.chart.getCurrencies.length > 0
      ) {
        let currencies = this.props.chart.getCurrencies || [];
        let crncyArr = [];
        currencies.map((c, i) => {
          crncyArr.push({
            label: c.description + " (" + c.code + ")",
            value: c.code,
          });
        });
        this.setState({
          currencyList: crncyArr,
        });
      }
    }
    //error case of Get Currencies
    if (this.props.chart.getCurrenciesError) {
      handleAPIErr(this.props.chart.getCurrenciesError, this.props);
    }
    this.props.clearChartStates();
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
        //this contains all chart codes
        this.setState({
          chartCodesList: getChartCodes.chartCodes || [],
          clonedChartCodesList: getChartCodes.chartCodes || [],
        });
      }
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

  //handle auto-completing and typing into the Chart Code
  handleChangeChartCode = async (e, line, i) => {
    $(`.chart${i}`).show();
    let value = e.target.value;
    let { poLines } = this.state;

    // update in order lines
    let foundIndex = poLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = value || "";
      poLines[foundIndex] = line;
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

    this.setState({ poLines, clonedChartCodesList });
  };

  // handleChangeChartSort = (e, line, i) => {
  //   let value = e.target.value;
  //   let { poLines } = this.state;

  //   // update in invoice lines
  //   let foundIndex = poLines.findIndex((l) => l.id == line.id);
  //   if (foundIndex != -1) {
  //     line.chartSort = value || "";
  //     poLines[foundIndex] = line;
  //   }

  //   this.setState({ poLines });
  // };
  handleChangeInLineFields = (e, line, i) => {
    let name = e.target.name;
    let value = e.target.value;
    let { poLines } = this.state;
    line[name] = value || "";
    this.setState({ poLines });
  };

  convertTwoDecimal = (e, line) => {
    let val = Number(e.target.value).toFixed(2) || 0.0;

    let { poLines } = this.state;
    line["amount"] = val;
    // calculation(subTotal, taxTotal, grossTotal) work start
    let subTotal = 0.0;
    let taxTotal = 0.0;
    let grossTotal = 0;
    let lines = JSON.parse(JSON.stringify(poLines));
    lines.map((poLinedata) => {
      subTotal = Number(subTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(subTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(subTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: Number(subTotal).toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  handleChangeFlags = (e, line) => {
    let name = e.target.name;
    let value = e.target.value;
    let { poLines } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value.toUpperCase();
      }
      return f;
    });

    //update po lines
    line.flags = flags;

    // calculation(netTotal, taxTotal, grossTotal) work start
    let netTotal = 0;
    let taxTotal = 0.0;
    let grossTotal = 0;
    let polinesArr = JSON.parse(JSON.stringify(poLines));
    polinesArr.map((poLinedata) => {
      netTotal = Number(netTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(netTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: netTotal.toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
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
    let { poLines } = this.state;

    // update in invoice lines
    let foundIndex = poLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = chartCode.code || "";
      poLines[foundIndex] = line;
    }

    this.setState({ poLines });
  };

  //handle tax amount
  handleTaxAmount = (e) => {
    let fieldValue = e.target.value;
    let grossTotal = Number(this.state.subTotal) + Number(fieldValue);
    this.setState({
      taxTotal: fieldValue,
      grossTotal: Number(grossTotal).toFixed(2),
    });
  };

  //handle change company
  handleChangeCompanies = (data) => {
    let { companyOptions } = this.state;
    let foundCompany = companyOptions.find((c) => c.companyID === data.value);
    if (foundCompany) {
      let { companyName, companyID, companyAddress, taxID, phone } =
        foundCompany;
      this.setState({
        companyName,
        companyID,
        companyAddress,
        companyTaxID: taxID,
        companyPhone: phone,
      });
    }
  };

  handleChangeNewPOListSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ POListSearch: searchedText }, () => {
      if (!searchedText) {
        let { activePOTallis, showPOTallisTabPane } = this.state;
        let obj = {
          id: activePOTallis,
          type: showPOTallisTabPane,
        };
        this.getNewPOList(obj);
      }
    });
  };

  //when a user searches on PO list
  handleChangePOListSearch = async (e) => {
    let searchedText = e.target.value;
    this.setState({ POListSearch: searchedText }, () => {
      const filteredPOList = JSON.parse(
        JSON.stringify(this.state.filteredPOList)
      );
      if (!searchedText) {
        let sortFilterCheck = this.state.sortFilterCheck;
        if (sortFilterCheck === "ASC") {
          sortFilterCheck = "DESC";
        } else {
          sortFilterCheck = "ASC";
        }
        this.setState({ getPOList: filteredPOList, sortFilterCheck }, () =>
          this.handleSortOrderLists(this.state.sortFilter)
        );
      }
    });
  };

  onNewPOListSearch = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let searchedText = e.target.value;
      let usePageLoading = localStorage.getItem("usePageLoading") || "N";
      usePageLoading = usePageLoading.toLocaleLowerCase();
      if (usePageLoading === "y") {
        this.setState(
          {
            POListSearch: searchedText,
          },
          () => {
            let { activePOTallis, showPOTallisTabPane } = this.state;

            let obj = {
              id: activePOTallis,
              type: showPOTallisTabPane,
            };
            this.getNewPOList(obj);
          }
        );
      }
    }
  };

  onPOListSearch = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let POListSearch = this.state.POListSearch.trim();

      if (POListSearch) {
        const filteredPOList = JSON.parse(
          JSON.stringify(this.state.filteredPOList)
        );
        let POListFilterdData = [];
        POListFilterdData = filteredPOList.filter((c) => {
          return c.supplier.toUpperCase().includes(POListSearch.toUpperCase());
        });
        this.setState({ getPOList: POListFilterdData });
      }
    }
  };

  //sorting on order's list
  handleSortOrderLists = async (name) => {
    let usePageLoading = localStorage.getItem("usePageLoading") || "N";
    usePageLoading = usePageLoading.toLocaleLowerCase();
    if (usePageLoading === "y") {
      this.setState(
        {
          sortFilter: name,
        },
        () => {
          let { activePOTallis, showPOTallisTabPane, sortFilterCheck } =
            this.state;

          let obj = {
            id: activePOTallis,
            type: showPOTallisTabPane,
          };
          localStorage.setItem("sortFilter", name);
          localStorage.setItem("sortFilterCheck", sortFilterCheck);

          this.getNewPOList(obj);
        }
      );
    } else {
      let { sortFilterCheck } = this.state;
      if (this.state.sortFilter != name) {
        sortFilterCheck = "DESC";
      }
      if (sortFilterCheck === "DESC") {
        sortFilterCheck = "ASC";
      } else {
        sortFilterCheck = "DESC";
      }
      localStorage.setItem("sortFilter", name);
      localStorage.setItem("sortFilterCheck", sortFilterCheck);

      const filteredPOList = JSON.parse(
        JSON.stringify(this.state.filteredPOList)
      );

      let poListFilterdData = [];
      if (name === "poNumber" || name === "total" || name === "trans") {
        poListFilterdData = filteredPOList.sort(function (a, b) {
          let valueA = Number(a[name]);
          let valueB = Number(b[name]);
          //for ascending order
          if (sortFilterCheck === "ASC") {
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
        poListFilterdData = filteredPOList.sort(function (a, b) {
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
          if (sortFilterCheck === "ASC") {
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
      } else if (name) {
        poListFilterdData = filteredPOList.sort(function (a, b) {
          let valueA = a[name].toString().toUpperCase();
          let valueB = b[name].toString().toUpperCase();
          //for ascending order
          if (sortFilterCheck === "ASC") {
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
        getPOList: poListFilterdData,
        sortFilter: name,
        sortFilterCheck,
      });

      // scroll to active po
      var elmnt = document.getElementById(this.state.activePO);
      if (elmnt) {
        elmnt.scrollIntoView();
      }
    }
  };

  //when click on more details link
  handleMoreDetails = (detail) => {
    let {
      approvers,
      poNumber,
      supplierEmail,
      requestedBy,
      tran,
      requestedDepartment,
      orderDescription,
      specialConditions,
    } = this.state;
    let approver = "";
    let approved = "";
    if (approvers && approvers.length > 0) {
      let aprved = approvers.find(
        (a) => a.status && a.status.toLowerCase() === "approved"
      );
      let crntAprvr = approvers.find(
        (a) => a.status && a.status.toLowerCase() === "current"
      );
      approver = crntAprvr
        ? crntAprvr.approverName
          ? crntAprvr.approverName
          : ""
        : ""; //current approver
      approved = aprved ? (aprved.approverName ? aprved.approverName : "") : ""; //approved
    }
    let data = {
      approver,
      date: detail.date || "",
      approved,
      poNumber,
      supplierEmail,
      requestedBy,
      trans: tran,
      department: requestedDepartment,
      description: orderDescription,
      specialConditions,
    };
    this.setState({ ordersMoreDetails: data }, () =>
      this.openModal("openOrdersMoreDetailsModal")
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
        if (this.props.poData.addCommentSuccess) {
          // toast.success(this.props.poData.addCommentSuccess);
          let poComments = this.props.poData.addCommentData || [];
          this.setState({ poComments });
        }
        if (this.props.poData.addCommentError) {
          handleAPIErr(this.props.poData.addCommentError, this.props);
        }
        this.props.clearPOStates();
        this.setState({ isLoading: false });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please select PO First!");
    }
  };

  //add attachment
  addAttachment = async (fileList) => {
    if (this.state.tran) {
      this.setState({ isLoading: true });
      let data = {
        tran: this.state.tran,
        fileList,
      };

      await this.props.addPoAttachmentLists(data);
      if (this.props.poData.addPOAttachmentListsSuccess) {
        toast.success(this.props.poData.addPOAttachmentListsSuccess);
        let poAttachments = this.props.poData.addPOAttachmentLists || [];
        this.setState({ poAttachments });
      }
      if (this.props.poData.addPOAttachmentListsError) {
        handleAPIErr(this.props.poData.addPOAttachmentListsError, this.props);
      }
      this.props.clearPOStates();

      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select a PO");
    }
  };

  getAttachment = async (recordID, type, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getPOAttachment(this.state.tran, recordID);
    if (this.props.poData.getPOAttachmentSuccess) {
      // toast.success(this.props.poData.getPOAttachmentSuccess);
      let resp = this.props.poData.getPOAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.poData.getPOAttachmentError) {
      handleAPIErr(this.props.poData.getPOAttachmentError, this.props);
    }
    this.props.clearPOStates();
    this.setState({ isLoading: false });
  };

  //delete PO
  deletePO = async () => {
    let {
      tran,
      multipleTrans,
      getPOList,
      activePO,
      activePOTallis,
      showPOTallisTabPane,
      poTallies,
      clonedGetPOList,
      filteredPOList,
    } = this.state;

    let poMumber =
      this.props.poData.getPO &&
      this.props.poData.getPO.poDetails &&
      this.props.poData.getPO.poDetails.poNumber;

    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One PO can be Delete at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      if (!poMumber && _trans) {
        this.setState({
          isLoading: true,
        });
        await this.props.deletePO(_trans); // delete po
        //success case of delete PO
        if (this.props.poData.deletePOSuccess) {
          // toast.success(this.props.poData.deletePOSuccess);
          // When deleting an Order --- Can it just highlight the order above the deleted one?

          if (getPOList.length === 1) {
            await this.clearStates();
            //decrease the tallies count also
            poTallies.map((t, i) => {
              if (
                t.type.toLowerCase() === "draft" //delete button only appears in draft section
              ) {
                t.count = 0;
              }
              return t;
            });
            getPOList = [];
            clonedGetPOList = [];
            multipleTrans = [];
            filteredPOList = [];
          } else if (getPOList.length > 1) {
            if (_trans === tran) {
              //when user delete the current selected PO
              //there are two cases if the user deletes the first PO in the list  then active the very next otherwise highlight PO above the deleted PO
              let foundIndex = getPOList.findIndex((l) => l.id === activePO);
              if (foundIndex != -1 && foundIndex === 0) {
                let po = getPOList[foundIndex + 1];
                if (po) {
                  await this.getPO(po);
                }
              } else {
                let po = getPOList[foundIndex - 1];
                if (po) {
                  await this.getPO(po);
                }
              }
              let list = getPOList.filter((l) => l.trans != _trans);
              //decrease the tallies count also
              poTallies.map((t, i) => {
                if (t.type.toLowerCase() === "draft") {
                  t.count = list.length;
                }
                return t;
              });

              getPOList = list;
              clonedGetPOList = list;
              filteredPOList = list;
              multipleTrans = [];
            } else {
              //when user delete other PO by checking the check box
              let list = getPOList.filter((l) => l.trans != _trans);
              //decrease the tallies count also
              poTallies.map((t, i) => {
                if (t.type.toLowerCase() === "draft") {
                  t.count = list.length;
                }
                return t;
              });
              getPOList = list;
              clonedGetPOList = list;
              filteredPOList = list;
              multipleTrans = [];
            }
          }
        }
        //error case of delete PO
        if (this.props.poData.deletePOError) {
          handleAPIErr(this.props.poData.deletePOError, this.props);
        }
        this.setState({
          isLoading: false,
          getPOList,
          clonedGetPOList,
          filteredPOList,
          activePOTallis,
          multipleTrans,
          showPOTallisTabPane,
          poTallies,
        });
        this.props.clearPOStates();
      } else {
        toast.error("This PO Can't be Deleted!");
      }
    }
  };

  //copy PO
  copyPO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One PO can be Copied at a Time!");
      }
    } else {
      _trans = tran;
    }

    let type = showPOTallisTabPane; //e.g draft, pending or approved
    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.copyPO(_trans, type); // copy po
      //success case of copy PO
      if (this.props.poData.copyPOSuccess) {
        toast.success(this.props.poData.copyPOSuccess);
        await this.getPOTallies(type, true); //to refresh the list
      }
      //error case of copy PO
      if (this.props.poData.copyPOError) {
        handleAPIErr(this.props.poData.copyPOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    }
  };

  //modify PO
  modifyPO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;

    if (multipleTrans.length == 0) {
      if (tran) {
        this.setState({
          isLoading: true,
        });
        await this.props.modifyPO(tran); // modify po
        //success case of modify PO
        if (this.props.poData.modifyPOSuccess) {
          // toast.success(this.props.poData.modifyPOSuccess);
          await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
        }
        //error case of modify PO
        if (this.props.poData.modifyPOError) {
          handleAPIErr(this.props.poData.modifyPOError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearPOStates();
      } else {
        toast.error("Please select PO First!");
      }
    }
  };

  //close PO
  closePO = async (reason) => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only one PO can be Closed at a time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.closePO(_trans, reason); // closePO po
      //success case of closePO PO
      if (this.props.poData.closePOSuccess) {
        // toast.success(this.props.poData.closePOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of closePO PO
      if (this.props.poData.closePOError) {
        handleAPIErr(this.props.poData.closePOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    }
  };

  //approve PO
  approvePO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      this.setState({
        isLoading: true,
      });
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
      await this.props.approvePO(_trans); // approve po
      //success case of approve PO
      if (this.props.poData.approvePOSuccess) {
        // toast.success(this.props.poData.approvePOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of approve PO
      if (this.props.poData.approvePOError) {
        handleAPIErr(this.props.poData.approvePOError, this.props);
      }
      this.setState({ isLoading: false });

      await this.props.clearPOStates();
    } else {
      toast.error("Please select PO First!");
    }
  };

  //decline PO
  declinePO = async (reason) => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One PO can be Declined at a Time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.declinePO(tran, reason); // decline po
      //success case of decline PO
      if (this.props.poData.declinePOSuccess) {
        toast.success(this.props.poData.declinePOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of decline PO
      if (this.props.poData.declinePOError) {
        handleAPIErr(this.props.poData.declinePOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    }
  };

  //hold PO
  holdPO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      this.setState({
        isLoading: true,
      });
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
      await this.props.holdPO(_trans); // hold po
      //success case of hold PO
      if (this.props.poData.holdPOSuccess) {
        toast.success(this.props.poData.holdPOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of hold PO
      if (this.props.poData.holdPOError) {
        handleAPIErr(this.props.poData.holdPOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    } else {
      toast.error("Please select PO First!");
    }
  };

  //move PO
  movePO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      this.setState({
        isLoading: true,
      });
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

      await this.props.movePO(_trans); // move po
      //success case of move PO
      if (this.props.poData.movePOSuccess) {
        toast.success(this.props.poData.movePOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of move PO
      if (this.props.poData.movePOError) {
        handleAPIErr(this.props.poData.movePOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    } else {
      toast.error("Please select PO First!");
    }
  };

  // sendForApprovalPO =>Draft -> send
  sendForApprovalPO = async () => {
    let { tran, multipleTrans, showPOTallisTabPane } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      this.setState({
        isLoading: true,
      });
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
      await this.props.sendForApprovalPO(_trans); // send For Approval PO
      //success case of send For Approval PO
      if (this.props.poData.sendForApprovalPOSuccess) {
        // toast.success(this.props.poData.sendForApprovalPOSuccess);
        await this.getPOTallies(showPOTallisTabPane, true); //to refresh the list
      }
      //error case of send For Approval PO
      if (this.props.poData.sendForApprovalPOError) {
        handleAPIErr(this.props.poData.sendForApprovalPOError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearPOStates();
    } else {
      toast.error("Please select PO First!");
    }
  };

  //download preview
  downloadPreview = () => {
    if (this.state.preview) {
      var a = document.createElement("a"); //Create <a>
      a.href = "data:image/png;base64," + this.state.preview; //Image Base64 Goes here
      a.download = "Image.png"; //File name Here
      a.click(); //Downloaded file
    }
  };

  //exclude filters
  handleExclude = (e, obj) => {
    /*
    - Ticking Zero should filter out POs in the list where PO amount = 0. 
      Unticking this should bring them back into the list.
    - Ticking Close has should filter out POs that have an excludeStatus of Zero
    */

    let { zero, close } = this.state;

    let check = !zero && !close ? true : false; //all checkboxes are uncheck
    const clonedGetPOList = JSON.parse(
      JSON.stringify(this.state.clonedGetPOList)
    );
    if (check) {
      //all checkboxes are uncheck
      this.setState({
        getPOList: clonedGetPOList,
        filteredPOList: clonedGetPOList,
      });
    } else {
      //checkbox chcek case
      let filterdData = [];
      let POListFilterdData = [];

      if (zero && close) {
        //both are checked

        POListFilterdData = clonedGetPOList.filter((c) => {
          return (
            c.excludeStatus.toUpperCase() != "ZERO" && Number(c.total) != 0
          );
        });
      } else if (close) {
        POListFilterdData = clonedGetPOList.filter((c) => {
          return c.excludeStatus.toUpperCase() != "ZERO";
        });
      } else {
        //Zero checked
        POListFilterdData = clonedGetPOList.filter((c) => {
          return Number(c.total) != 0;
        });
      }

      filterdData.push(...POListFilterdData);
      this.setState({
        getPOList: filterdData,
        filteredPOList: filterdData,
      });
    }
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
    const clonedGetPOList = JSON.parse(
      JSON.stringify(this.state.clonedGetPOList)
    );
    if (check) {
      //all checkboxes are uncheck
      this.setState({
        getPOList: clonedGetPOList,
        filteredPOList: clonedGetPOList,
      });
    } else {
      let filterdData = [];

      approvalsGroups.map((a, i) => {
        let POListFilterdData = [];
        if (a.checked) {
          POListFilterdData = clonedGetPOList.filter((c) => {
            return (
              c.approvalGroup &&
              c.approvalGroup.toUpperCase() === a.groupName.toUpperCase()
            );
          });
        }
        filterdData.push(...POListFilterdData);
      });
      this.setState({
        getPOList: filterdData,
        filteredPOList: filterdData,
      });
    }
  };

  //add/update PO Lines
  getNewORUpdatedPOLine = (poLine) => {
    let { poLines } = this.state;
    if (poLine.id) {
      //update case

      var foundIndex = poLines.findIndex((p) => p.id == poLine.id);

      // var data = poLines.find(p => p.id == poLine.id);
      if (foundIndex != -1) {
        poLine.customFields = poLines[foundIndex].customFields || []; //to add custome fields
      }
      if (poLine.customFields && poLine.customFields.length > 0) {
        poLine.customFields.map((c, i) => {
          if (poLine[c.prompt]) {
            return (c.value = poLine[c.prompt]);
          }
        });
      }
      poLines[foundIndex] = poLine;
    } else {
      //add case
      poLine.id = uuidv1();
      poLine.checked = false;

      poLine.customFields = poLine.customFields || []; //to add custome fields

      if (poLine.customFields && poLine.customFields.length > 0) {
        poLine.customFields.map((c, i) => {
          if (poLine[c.prompt]) {
            return (c.value = poLine[c.prompt]);
          }
        });
      }

      poLines.push(poLine);
    }

    // calculation(netTotal, taxTotal, grossTotal) work start
    let netTotal = 0;
    let taxTotal = 0.0;
    let grossTotal = 0;
    let lines = JSON.parse(JSON.stringify(poLines));
    lines.map((poLinedata) => {
      netTotal = Number(netTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(netTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: netTotal.toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  //upldate po-lines according to multiple change modal
  handleMultipleChanges = (data) => {
    let { poLines } = this.state;
    let flagIsEmpty = false;
    // data.trackingCodes.map((f, i) => {
    //   if (f.value.trim() == "") {
    //     flagIsEmpty = true;
    //   }
    // });
    poLines.map((p, i) => {
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
    this.setState({ poLines });
  };

  //handle change fields
  handleChangeFields = (e) => {
    let { formErrors } = this.state;
    const { name, value } = e.target;
    formErrors = handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  //handle change approvals in approvals modal
  handleChangeApprovalsGroups = (grp) => {
    this.setState({ approvalGroup: grp });
  };

  openOrderDetailModal = () => {
    let { multipleTrans, tran } = this.state;
    if (multipleTrans.length === 0) {
      this.getPOLines();
    } else if (multipleTrans.length == 1) {
      if (multipleTrans[0] === tran) {
        //current selected po
        this.getPOLines();
      } else {
        //other selected po
        toast.error("You can edit only Selected PO!");
      }
    }
  };

  deletePOLine = (id) => {
    let { poLines } = this.state;
    if (id) {
      let filteredPOLines = poLines.filter((p) => p.id != id);
      let subTotal = 0;
      //calculate subtotal
      filteredPOLines.map((poLine, i) => {
        subTotal += Number(poLine.amount);

        return poLine;
      });
      this.setState({
        poLines: filteredPOLines,
        subTotal: Number(subTotal).toFixed(2),
      });
    }
  };

  importQuote = (data) => {
    let poLines = (data.poDetails && data.poDetails.poLines) || [];
    let subTotal = 0;

    //replace po-lines
    if (poLines.length > 0) {
      poLines = _.cloneDeep(poLines);

      poLines.map((poLine, i) => {
        poLine.id = uuidv1();
        poLine.checked = false;

        // if (poLine.startTime && poLine.startTime != "0") {
        //   poLine.startTime *= 1000;
        // }
        // if (poLine.endTime && poLine.endTime != "0") {
        //   poLine.endTime *= 1000;
        // }
        poLine.toDate = poLine.endDate;
        poLine.fromDate = poLine.startDate;
        poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;

        subTotal += Number(poLine.amount);

        return poLine;
      });
      //poLines: [] to call getPOLines API again with latest lines after calling quote request
    }
    this.setState({ poLines: [], subTotal: Number(subTotal).toFixed(2) });
  };

  // move to previous po
  moveToPrevPO = async () => {
    let { getPOList, activePO } = this.state;
    let foundIndex = getPOList.findIndex((l) => l.id === activePO);

    if (foundIndex != -1 && foundIndex != 0) {
      let po = getPOList[foundIndex - 1];
      if (po) {
        await this.getPO(po);
      }
    }
  };

  // move to next po
  moveToNextPO = async () => {
    let { getPOList, activePO } = this.state;
    let foundIndex = getPOList.findIndex((l) => l.id === activePO);

    if (foundIndex != -1) {
      let po = getPOList[foundIndex + 1];
      if (po) {
        await this.getPO(po);
      }
    }
  };

  handleCheckbox = (e, data) => {
    let { getPOList, multipleTrans, tran } = this.state;
    let { name, checked } = e.target;
    if (data === "allCheck" && name === "checkboxAll") {
      let multipleTransCopy = [];
      if (checked) {
        getPOList.map((m) => {
          m.checked = true;
          multipleTransCopy.push(m.trans);
          return m;
        });
      } else {
        getPOList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleTrans = [...multipleTransCopy];
    } else {
      if (checked) {
        getPOList.map(async (po, i) => {
          if (data.id === po.id) {
            po.checked = true;
          }
          return po;
        });
        multipleTrans.push(data.trans);
      } else {
        getPOList.map(async (po, i) => {
          if (data.id === po.id) {
            po.checked = false;
          }
          return po;
        });
        let filteredMultiTrans = multipleTrans.filter((t) => t != data.trans);
        multipleTrans = filteredMultiTrans;
      }
    }
    this.setState({ getPOList, multipleTrans }, () => {
      let currentActivePO = getPOList.find((l) => l.trans === tran);

      //If you have multiple orders ticked and one of them is a team order, then hide the buttons as well.
      let check = false;
      this.state.multipleTrans.map((t, i) => {
        let po = getPOList.find((l) => l.trans === t);
        if (po && po.teamOrder && po.teamOrder.toLowerCase() === "y") {
          check = true;
        }
      });

      if (check) {
        this.setState({ teamOrderCheck: "Y" });
      } else {
        this.setState({ teamOrderCheck: currentActivePO.teamOrder });
      }
    });
  };

  handleCheckboxesInOrderDetails = (e, line) => {
    let { poLines } = this.state;
    if (e.target.checked) {
      if (line === "all") {
        poLines.map(async (l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        poLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = true;
          }
          return l;
        });
      }
    } else {
      if (line === "all") {
        poLines.map(async (l, i) => {
          l.checked = false;
          return l;
        });
      } else {
        poLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = false;
          }
          return l;
        });
      }
    }

    this.setState({
      poLines,
    });
  };

  //call get po list API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamOrders", check);
    this.setState({ viewTeam: check }, () => {
      let { activePOTallis, showPOTallisTabPane } = this.state;
      let obj = {
        id: activePOTallis,
        type: showPOTallisTabPane,
      };
      this.checkPOList_API(obj);
    });
  };

  handleRightSidebar = () => {
    this.setState((prevState, props) => ({
      toggleRightSidebar: !prevState.toggleRightSidebar,
    }));
  };

  //when click on '+' plus button to zoom in the pdf/image
  zoomIn = async () => {
    let { scaling } = this.state;

    let { zoom, scale, dropdownZoomingValue } = zoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("orderZoom", zoom);
      }
    );
  };

  //when click on '-' minus button to zoom out the pdf/image
  zoomOut = async () => {
    let { scaling } = this.state;

    let { zoom, scale, dropdownZoomingValue } = zoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("orderZoom", zoom);
      }
    );
  };

  //when click on dropdown button to resize the pdf/image
  handleDropdownZooming = async (data) => {
    let value = data.value;

    localStorage.setItem("orderZoom", value);

    let { scale, dropdownZoomingValue } = handleDropdownZooming(value);

    this.setState({
      scaling: scale,
      dropdownZoomingValue,
    });
  };

  handleHorizontalArrow = () => {
    $(".explore_img").removeClass("fit_top_bottom");
    this.setState({
      scaling: "scale(1)",
      dropdownZoomingValue: { label: "50%", value: "50%" },
    });
  };

  handleHorizontalCross = () => {
    $(".expand_it").removeClass("mm_pdf_img");
    this.setState({
      scaling: "scale(1)",
      dropdownZoomingValue: { label: "50%", value: "50%" },
    });
  };

  //PSL Export
  PSLExport = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.PSLExport(multipleTrans);
      this.setState({ isLoading: false });

      if (this.props.poData.pslExportSuccess) {
        toast.success(this.props.poData.pslExportSuccess);

        let obj = {
          contentType: "application/xml",
          attachment: this.props.poData.pslExport || "",
        };
        downloadAttachments(obj, "orders.xml");
      }
      if (this.props.poData.pslExportError) {
        handleAPIErr(this.props.poData.pslExportError, this.props);
      }
      this.props.clearPOStates();
    } else {
      toast.error("Please Select PO First!");
    }
  };

  //Export PO
  exportPO = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportPO(multipleTrans);
      this.setState({ isLoading: false });

      if (this.props.poData.exportPOSuccess) {
        toast.success(this.props.poData.exportPOSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.poData.exportPO || "",
        };
        downloadAttachments(obj, "orders");
      }
      if (this.props.poData.exportPOError) {
        handleAPIErr(this.props.poData.exportPOError, this.props);
      }
      this.props.clearPOStates();
    } else {
      toast.error("Please Select PO First!");
    }
  };

  //Import PO
  importPO = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importPO(excelData);
    if (this.props.poData.importPOSuccess) {
      toast.success(this.props.poData.importPOSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.poData.importPOError) {
      handleAPIErr(this.props.poData.importPOError, this.props);
    }
    this.props.clearPOStates();

    this.setState({ isLoading: false });
  };

  openPostModal = () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.openModal("openPostModal");
    } else {
      toast.error("Please Select PO First!");
    }
  };

  postPO = async (data) => {
    let { multipleTrans } = this.state;
    let { period, reportID, generateReport } = data;

    let obj = {
      tran: multipleTrans,
      period,
      reportID,
      generateReport: generateReport ? "Y" : "N",
    };
    this.setState({ isLoading: true });
    await this.props.postPO(obj);
    if (this.props.poData.postPOSuccess) {
      toast.success(this.props.poData.postPOSuccess);

      let jsonData = this.props.poData.postPO.reportJSON || "";
      let reportFile = this.props.poData.postPO.reportTemplate || "";

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
    if (this.props.poData.postPOError) {
      handleAPIErr(this.props.poData.postPOError, this.props);
    }
    this.props.clearPOStates();
    this.setState({ isLoading: false });
  };

  handlePageClick = ({ selected }) => {
    let { activePOTallis, showPOTallisTabPane } = this.state;
    let obj = {
      id: activePOTallis,
      type: showPOTallisTabPane,
    };

    this.setState(
      { page: selected + 1, pageStart: "", pageEnd: "", totalPOs: "" },
      () => {
        this.getNewPOList(obj);
      }
    );
  };

  handleRowsSetting = (e) => {
    let { activePOTallis, showPOTallisTabPane } = this.state;

    let obj = {
      id: activePOTallis,
      type: showPOTallisTabPane,
    };
    localStorage.setItem("orderDPR", e.target.value); // no of display order pages

    this.setState({ display: e.target.value }, () => {
      this.getNewPOList(obj);
    });
  };

  render() {
    /*
      Changes for Approver only user types (not operator or operator/approver) are below:
      1 - Remove Move button in the Declined section
      2 - Remove Copy and Modify buttons from Approved section. Keep Close and do not remove it.
      3 - Remove Move and Copy from Pending sections
    */
    //checkTwo -> disable everything in PO, when user is 'Approver' and tab is pending or declined
    let userType = localStorage.getItem("userType") || "";
    userType = userType.toLowerCase();

    let approverCheck = false;
    let checkTwo = false;
    if (userType) {
      if (userType === "approver") {
        approverCheck = true;
      }
    }
    let tab =
      this.state.showPOTallisTabPane &&
      this.state.showPOTallisTabPane.toLowerCase();

    if (tab) {
      if (tab === "pending" || tab === "declined") {
        //when tab is pending or declined then everything is read only for Approver
        if (approverCheck) {
          checkTwo = true;
        }
      }
    }

    /*when Pending, Declined, Approved, All Sections:
        Please make the order description field read only (and remove the underscore line) */
    let disDisc = false;

    if (
      tab === "declined" ||
      tab === "pending" ||
      tab === "approved" ||
      tab === "all"
    ) {
      disDisc = true;
    }

    // Please hide the CLOSE button unless the user is an Accounts or ADMIN usertype
    let isAdmin = false;
    if (
      userType === "admin" ||
      userType === "sysadmin" ||
      userType === "accounts"
    ) {
      isAdmin = true;
    }

    // user can add comment in these sections the Draft, Approve, Hold, Pending, Declined:
    let cmntCheck = true;

    if (tab === "approved" || tab === "all") {
      cmntCheck = false;
    }
    let usePageLoading = localStorage.getItem("usePageLoading") || "N";
    usePageLoading = usePageLoading.toLowerCase();
    let {
      getPOList,
      batchList,
      batchNo,
      teamOrderCheck,
      totalPages,
      display,
      page,
      pageStart,
      pageEnd,
      totalPOs,
    } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        {console.log("state::::::::", this.state)}
        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            orders={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={this.state.viewTeam}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content dash__invoice--content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu po*/}
            <aside
              className="side-nav suppliers_side_nav side__content--invoice side-bar-height"
              id="show-side-navigation12"
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
                        className="custom-angle-down"
                        id="dropdown-basic"
                      >
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {tab === "approved" ? (
                          <Dropdown.Item
                            to="#/action-2"
                            className="f-20 custom-drp-down"
                          >
                            <div
                              onClick={() =>
                                this.handleSortOrderLists("approvalDate")
                              }
                              className="custom-control custom-radio"
                            >
                              <input
                                type="radio"
                                className="custom-control-input"
                                id="approvalDate"
                                name="approvalDate"
                                onChange={() => {}}
                                checked={
                                  this.state.sortFilter === "approvalDate"
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
                            onClick={() => this.handleSortOrderLists("total")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="total"
                              name="total"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "total"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="total"
                            >
                              Amount
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-1"
                          className="flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortOrderLists("orderBy")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="orderBy"
                              name="orderBy"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "orderBy"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="orderBy"
                            >
                              Buyer
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortOrderLists("date")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "date"}
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
                              this.handleSortOrderLists("department")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="department"
                              name="department"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "department"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="department"
                            >
                              Department
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortOrderLists("poNumber")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="poNumber"
                              name="poNumber"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "poNumber"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="poNumber"
                            >
                              PO Number
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortOrderLists("supplier")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="supplier"
                              name="supplier"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "supplier"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="supplier"
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
                            onClick={() => this.handleSortOrderLists("trans")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="trans"
                              name="trans"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "trans"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="trans"
                            >
                              Transaction
                            </label>
                          </div>
                        </Dropdown.Item>
                        {usePageLoading === "y" ? (
                          <div className="custom-control custom-radio cutm-pr-right">
                            <div className="settings_display_row flex__wrapper-inner">
                              <label className="labelwrapper__iner lable-inner-wrapper">
                                Display Rows Per Page
                              </label>
                              <input
                                className="form-control input__wrapper--inner "
                                type="number"
                                min="1"
                                defaultValue={display}
                                onBlur={this.handleRowsSetting}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
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
                      name="POListSearch"
                      id="POListSearchId"
                      value={this.state.POListSearch}
                      onChange={(e) =>
                        usePageLoading === "y"
                          ? this.handleChangeNewPOListSearch(e)
                          : this.handleChangePOListSearch(e)
                      }
                      onKeyDown={(e) =>
                        usePageLoading === "y"
                          ? this.onNewPOListSearch(e)
                          : this.onPOListSearch(e)
                      }
                    />
                  </div>
                </div>
              </div>
              <ul
                className={
                  Number(totalPages) !== 0
                    ? usePageLoading === "y"
                      ? "suppliers_list list__color-bottom"
                      : "suppliers_list"
                    : "suppliers_list"
                }
              >
                {getPOList.map((l, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        l.teamOrder === "Y"
                          ? this.state.getPOList[i + 1] &&
                            this.state.getPOList[i + 1].teamOrder &&
                            this.state.getPOList[i + 1].teamOrder === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : this.state.activePO === l.id
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
                              id={"order" + i}
                              checked={l.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, l)}
                            />
                            <label
                              htmlFor={"order" + i}
                              className="mr-0"
                            ></label>
                          </div>
                        </div>
                        <div onClick={() => this.getPO(l)} className="col pl-0">
                          <div className="invioce_data pr-sm-3">
                            <h4>{l.supplier} </h4>
                            <div className="row">
                              <div className="col data-i">
                                <p>
                                  {l.poNumber}

                                  {l.modifyNumber > 0 ? (
                                    <>
                                      {"-"}
                                      {l.modifyNumber}
                                      {"(Modified)"}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{l.date}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>{l.department}</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{l.orderBy}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>{l.total + " (" + l.taxAmount + ")"}</p>
                              </div>
                              <div className="col-auto data-i">
                                <div className="text-center cursorPointer">
                                  <p onClick={() => this.handleMoreDetails(l)}>
                                    <Link
                                      tabIndex="-1"
                                      className="more-details-color"
                                      to="#"
                                    >
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

              {Number(totalPages) !== 0 ? (
                usePageLoading === "y" ? (
                  <div className="pagination__list-custom">
                    <p className="mb__zero pt-top-container">
                      {" "}
                      Showing {pageStart} to {pageEnd} of {totalPOs} entries
                    </p>
                    <ReactPaginate
                      tabIndex="-1"
                      previousLabel={"prev"}
                      pageLinkClassName={"pagination__list-custom-link   "}
                      pageClassName={"pagination__list-custom-li "}
                      activeLinkClassName={"pagination__tab-custm"}
                      nextLabel={"next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={totalPages}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={2}
                      onPageChange={this.handlePageClick}
                      containerClassName={
                        "pagination cursorPointer align-center-container"
                      }
                      activeClassName={"active"}
                      forcePage={page - 1}
                    />
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </aside>
            {/* {/ end /} */}

            <section id="contents" className="supplier pr-0 pt-0">
              <div className="body_content ordermain-padi body__invoice--top">
                <div className="container-fluid pl-0 ">
                  <div className="main_wrapper " id="order--dynamic--height">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* PO Tallies */}
                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {this.state.poTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="cursorPointer nav-item"
                                  onClick={() =>
                                    this.getPOTallies(t.type, true)
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activePOTallis === t.id
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

                        <div className="bg-gry w-100 float-left mm_top_nav">
                          <div className="w-100 float-left mm_lr_pad">
                            <div className="mm_tab_left order_left_icons">
                              <div className="tab-content">
                                {tab == "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.insertPO}
                                      >
                                        <img
                                          src="images/add.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#">New</Link>{" "}
                                      </li>
                                      <li
                                        className="cursorPointer"
                                        onClick={() =>
                                          this.state.getPOList.length > 0
                                            ? this.draftEditPO()
                                            : () => {}
                                        }
                                      >
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#">Edit</Link>{" "}
                                      </li>
                                      <li
                                        onClick={() =>
                                          this.state.getPOList.length > 0
                                            ? this.copyPO()
                                            : () => {}
                                        }
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/copy1.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Copy </Link>
                                      </li>
                                      {teamOrderCheck != "Y" ? (
                                        <>
                                          <li
                                            onClick={() =>
                                              this.state.getPOList.length > 0
                                                ? this.openModal(
                                                    "openDeleteModal"
                                                  )
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
                                            onClick={() =>
                                              this.state.getPOList.length > 0
                                                ? this.sendForApprovalPO()
                                                : () => {}
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/send.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Send </Link>
                                          </li>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab == "approve" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {teamOrderCheck != "Y" ? (
                                        <>
                                          <li
                                            onClick={this.approvePO}
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/tick.png"
                                              className="img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Approve </Link>
                                          </li>
                                          <li
                                            onClick={this.holdPO}
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/move.png"
                                              className=" img-fluid"
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Hold </Link>
                                          </li>
                                          <li
                                            onClick={() =>
                                              this.openModal("openDeclineModal")
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/decline.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Decline </Link>
                                          </li>
                                          <li
                                            onClick={this.openOrderDetailModal}
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/pencill.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Edit </Link>
                                          </li>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab == "declined" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!approverCheck && (
                                      <ul>
                                        {teamOrderCheck != "Y" ? (
                                          <li
                                            onClick={() =>
                                              checkTwo
                                                ? this.openModal("")
                                                : this.openModal(
                                                    "openMoveToDraftModal"
                                                  )
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/move.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Move </Link>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                )}
                                {tab == "hold" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {teamOrderCheck !== "Y" ? (
                                        <>
                                          <li
                                            onClick={this.approvePO}
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/tick.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Approve </Link>
                                          </li>
                                          <li
                                            onClick={() =>
                                              this.openModal("openDeclineModal")
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/decline.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Decline </Link>
                                          </li>
                                          <li
                                            onClick={this.openOrderDetailModal}
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/pencill.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Edit </Link>
                                          </li>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab == "pending" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!approverCheck && (
                                      <ul>
                                        {teamOrderCheck !== "Y" ? (
                                          <li
                                            onClick={() =>
                                              checkTwo
                                                ? this.openModal("")
                                                : this.openModal(
                                                    "openMoveToDraftModal"
                                                  )
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/move.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Move </Link>
                                          </li>
                                        ) : (
                                          ""
                                        )}
                                        <li
                                          onClick={() =>
                                            checkTwo
                                              ? this.openModal("")
                                              : this.openModal("openCopyModal")
                                          }
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/copy1.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Copy </Link>
                                        </li>
                                      </ul>
                                    )}
                                  </div>
                                )}
                                {tab == "approved" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {!approverCheck && (
                                        <li
                                          onClick={() =>
                                            this.openModal("openCopyModal")
                                          }
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/copy1.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Copy </Link>
                                        </li>
                                      )}
                                      {isAdmin ? (
                                        <li
                                          onClick={() =>
                                            this.openModal("openCloseModal")
                                          }
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/decline.png"
                                            className="top_0 img-fluid"
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Close </Link>
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                      {!approverCheck && (
                                        <li
                                          onClick={() =>
                                            this.openModal("openModifyModal")
                                          }
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/pencill.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Modify </Link>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab == "all" && (
                                  <div
                                    className={
                                      this.state.getPOList.length === 0
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
                            <div className="mm_tab_center order_right_icons">
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
                                    className="img-fluid float-left"
                                    alt="user"
                                    id="full_screen"
                                  />{" "}
                                </Link>
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.handleHorizontalArrow}
                                    src="images/twoarow.png"
                                    className="img-fluid float-left"
                                    alt="user"
                                    id="expand"
                                  />{" "}
                                </Link>

                                <Link
                                  to="#"
                                  className="zom-img float-right ml-md-5 pl-2 pr-2 mr-0 more-d mt-0"
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
                                  onClick={this.moveToNextPO}
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
                                  onClick={this.moveToPrevPO}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="prev"
                                  />{" "}
                                </Link>
                                <div className="side-attachments-2 height-2 mm_order_sidebar aside__right--height">
                                  <div
                                    onClick={this.getPOLog}
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

                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit"
                                      data-toggle="collapse"
                                      data-target="#Exclude"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Exclude
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Exclude">
                                    <div className="pl-2 mb-3">
                                      <div className="form-group remember_check">
                                        <input
                                          type="checkbox"
                                          id="item2"
                                          name="zero"
                                          checked={this.state.zero}
                                          onChange={(e) => {
                                            this.setState(
                                              {
                                                [e.target.name]:
                                                  e.target.checked,
                                              },
                                              () => {
                                                this.handleExclude();
                                              }
                                            );
                                          }}
                                        />
                                        <label htmlFor="item2">
                                          {" "}
                                          <span className="text-mar">Zero</span>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="pl-2 mb-3">
                                      <div className="form-group remember_check">
                                        <input
                                          type="checkbox"
                                          id="item23"
                                          name="close"
                                          checked={this.state.close}
                                          onChange={(e) => {
                                            this.setState(
                                              {
                                                [e.target.name]:
                                                  e.target.checked,
                                              },
                                              () => {
                                                this.handleExclude();
                                              }
                                            );
                                          }}
                                        />
                                        <label htmlFor="item23">
                                          {" "}
                                          <span className="text-mar">
                                            Close
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit2"
                                      data-toggle="collapse"
                                      data-target="#Approvalsa"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord2"></span>
                                      Approvals
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Approvalsa"
                                  >
                                    {this.state.approvalsGroups.map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i}
                                                name={a.groupName}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i}> </label>
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
                                      data-target="#Changes"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={this.getPOChanges}
                                    >
                                      Changes
                                      <span className="ml-3 font-weight-bold">
                                        {this.state.poChanges.length}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Changes">
                                    {this.state.poChanges.map((c, i) => {
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
                                      data-target="#Activity"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={this.getPOActivity}
                                    >
                                      Activity
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Activity">
                                    {this.state.poActivity.map((a, i) => {
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
                                    <div
                                      onClick={this.exportPO}
                                      className="pl-2 mb-3"
                                    >
                                      <div className="form-group remember_check d-flex">
                                        <span className="text-mar cursorPointer ml-38">
                                          EXCEL
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      onClick={this.PSLExport}
                                      className="pl-2 mb-3"
                                    >
                                      <div className="form-group remember_check d-flex">
                                        <span className="text-mar cursorPointer ml-38">
                                          PSL
                                        </span>
                                      </div>
                                    </div>
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
                                  {isAdmin ? (
                                    <>
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
                                      <div
                                        className="collapse show"
                                        id="batchlist"
                                      >
                                        <div className="pl-2 mb-3">
                                          <div className="text-right pb-2 pr-4">
                                            <span
                                              className="cursorPointer mr-3"
                                              href="#"
                                              onClick={this.insertBatch}
                                            >
                                              <img
                                                src="images/add.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />
                                            </span>
                                            <span
                                              className="cursorPointer"
                                              onClick={this.deleteBatch}
                                            >
                                              <img
                                                src="images/delete.svg"
                                                className="invoice-delete-icon img-fluid "
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
                                                      <div className="form-group remember_check">
                                                        <input
                                                          type="checkbox"
                                                          id={"batch" + i}
                                                          name="batch_checked"
                                                          checked={
                                                            b.batchNo ===
                                                            batchNo
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
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="img-section-t col-12 pl-0 h-100">
                      <div
                        className={
                          this.state.toggleRightSidebar
                            ? "pdf__height--content mm_ordr1 order_pdf_new h-100"
                            : "pdf__height--content mm_ordr1 order_pdf_expand1 m_auto h-100"
                        }
                        id="overload_image"
                      >
                        <div
                          id="maped_image "
                          className="order_pfd h-100"
                          style={{ background: "#fff" }}
                        >
                          <div
                            className="maped_image h-100 expand_it "
                            style={{
                              transform: this.state.scaling,
                              transformOrigin: "center top",
                            }}
                          >
                            {this.state.getPOList.length > 0 && (
                              <img
                                className="explore_img"
                                // src='images/newtest.png'
                                src={
                                  "data:image/png;base64," + this.state.preview
                                }
                                useMap="#image-map"
                                id="preview"
                                alt="preview"
                              />
                            )}
                            <map name="image-map">
                              <area
                                onClick={this.getPOCompany}
                                alt="company"
                                title="company"
                                coords="390,105,43,24"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openPORefrenceModal")
                                }
                                alt="po-reference"
                                title="po-reference"
                                coords="391,23,758,104"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openSupplierModal")
                                }
                                alt="supplier"
                                title="supplier"
                                coords="43,119,386,301"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openDeliveryModal")
                                }
                                alt="delivery"
                                title="delivery"
                                coords="757,202,394,121"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openOrderRequestModal")
                                }
                                alt="order-request"
                                title="order-request"
                                coords="394,210,758,301"
                                shape="rect"
                              />
                              <area
                                onClick={this.getPOLines}
                                alt="order-details"
                                title="order-details"
                                coords="40,339,758,742"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openTotalAmountModal")
                                }
                                alt="total-amount"
                                title="total-amount"
                                // coords="387,744,758,821"
                                coords="370,710,778,878"
                                shape="rect"
                              />
                              <area
                                onClick={() =>
                                  this.openModal("openApprovalsModal")
                                }
                                alt="approvals"
                                title="approvals"
                                // coords="40,860,282,916"
                                coords="39,816,237,924"
                                shape="rect"
                              />
                            </map>
                          </div>
                        </div>
                      </div>
                      <div
                        id="right-sidbar"
                        className="side-attachments mm_order_side aside__right--height"
                      >
                        {" "}
                        <div
                          onClick={this.handleRightSidebar}
                          className="cus-arro-div"
                        >
                          <img
                            src="images/arrow-r.png"
                            className=" img-fluid cus-arro-r"
                            alt="user"
                          />
                        </div>
                        <div className="side-attack">
                          <div className="main-sec-attach main-bg">
                            {/* PO Attachments */}
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Attachments"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openAttachmentsModal")
                              }
                            >
                              Attachments
                              <span className="ml-3 font-weight-bold">
                                {this.state.poAttachments.length}
                              </span>
                              {tab === "draft" ? (
                                <a className="float-right mr-3" href="#">
                                  <img
                                    src="images/add.png"
                                    className=" img-fluid sidebarr_plus "
                                    alt="user"
                                  />
                                </a>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          <div className="collapse show" id="Attachments">
                            {this.state.poAttachments.map((a, i) => {
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
                              data-target="#Approvals"
                            >
                              <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                              <span className="name_attached">Approvals</span>
                            </span>
                          </div>
                          <div className="collapse show" id="Approvals">
                            {this.state.approvalGroup.value &&
                              this.state.approvalGroup.value.trim() && (
                                <div className="main-sec-mid">
                                  {this.state.approvalGroup.value}
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
                          {/* PO Comments */}
                          <div className="main-sec-attach main-bg">
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Comments"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openCommentsModal")
                              }
                            >
                              Comments
                              <span className="ml-3 font-weight-bold">
                                {this.state.poComments.length}
                              </span>
                              {cmntCheck ? (
                                <a className="float-right mr-3" href="#">
                                  <img
                                    src="images/add.png"
                                    className=" img-fluid sidebarr_plus "
                                    alt="user"
                                  />
                                </a>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          <div className="collapse show" id="Comments">
                            {this.state.poComments.map((c, i) => {
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
          onDecline={this.declinePO}
        />
        <MoveToDraft
          openMoveToDraftModal={this.state.openMoveToDraftModal}
          closeModal={this.closeModal}
          movePO={this.movePO}
        />
        <Delete
          openDeleteModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          onDelete={this.deletePO}
        />
        <Copy
          openCopyModal={this.state.openCopyModal}
          closeModal={this.closeModal}
          copyPO={this.copyPO}
        />
        <Close
          openCloseModal={this.state.openCloseModal}
          closeModal={this.closeModal}
          closePO={this.closePO}
        />

        <Attachments
          openAttachmentsModal={this.state.openAttachmentsModal}
          closeModal={this.closeModal}
          addAttachment={this.addAttachment}
          attachments={this.state.poAttachments}
          // tran={this.state.tran}
          // props={this.props}
          getAttachment={this.getAttachment}
          draft={tab === "draft" ? true : false} //to hide/show "Drag Files in or Click to Upload" box
          ordersPage={true}
        />
        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={this.state.poComments}
          addComment={this.addComment}
          tab={tab}
        />
        <Modify
          openModifyModal={this.state.openModifyModal}
          closeModal={this.closeModal}
          modifyPO={this.modifyPO}
        />
        <Company
          openCompanyModal={this.state.openCompanyModal}
          closeModal={this.closeModal}
          companies={this.state.companies}
          handleChangeCompanies={this.handleChangeCompanies}
          companyName={this.state.companyName}
          companyID={this.state.companyID}
          companyAddress={this.state.companyAddress}
          taxID={this.state.companyTaxID}
          phone={this.state.companyPhone}
          updatePOCompany={this.updatePOCompany}
          tab={tab}
        />
        <PORefrence
          openPORefrenceModal={this.state.openPORefrenceModal}
          closeModal={this.closeModal}
          handleChangeFields={this.handleChangeFields}
          poNumber={this.state.poNumber}
          updatePOReference={this.updatePOReference}
          tab={tab}
        />
        <Supplier
          openSupplierModal={this.state.openSupplierModal}
          closeModal={this.closeModal}
          openModal={this.openModal}
          getSuppliersList={this.getSuppliersList} //function to get supplier list
          suppliersList={this.state.suppliersList || []} //array of suppliers list
          updatePOSupplier={this.updatePOSupplier}
          updatePOSupplierContacts={this.updatePOSupplierContacts}
          updatePOSup={this.updatePOSup}
          props={this.props}
          addAttachment={this.addAttachment}
          importQuote={this.importQuote}
          currencyList={this.state.currencyList || []}
          handleCurrencyChange={this.handleCurrencyChange}
          contacts={this.state.contacts || []}
          updateSupplierContactsList={this.updateSupplierContactsList}
          deleteSupplierContact={this.deleteSupplierContact}
          addNewSupplier={this.addNewSupplier}
          clonedSuppliersList={this.state.clonedSuppliersList}
          handleChangeSupplierName={this.handleChangeSupplierName}
          handleHideCheck={this.handleHideCheck}
          editName={this.state.editName}
          validateField={this.validateField}
          draft={tab === "draft" ? true : false} //to hide/show "Drag Files in or Click to Upload" box
          tab={tab}
          stateData={this.state}
          props={this.props}
          page="orders"
        />
        <Delivery
          openDeliveryModal={this.state.openDeliveryModal}
          closeModal={this.closeModal}
          handleChangeFields={this.handleChangeFields}
          specialConditions={this.state.specialConditions}
          updateSpecialConditions={this.updateSpecialConditions}
          tab={tab}
        />
        <OrderRequest
          openOrderRequestModal={this.state.openOrderRequestModal}
          closeModal={this.closeModal}
          handleChangeFields={this.handleChangeFields}
          requestedBy={this.state.requestedBy}
          requestedDepartment={this.state.requestedDepartment}
          updateRequested={this.updateRequested}
          tab={tab}
        />

        <OrderDetails
          openOrderDetailModal={this.state.openOrderDetailModal}
          closeModal={this.closeModal}
          openModal={this.openModal}
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          currency={this.state.currency || ""}
          flags_api={this.props.chart.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          poLines={this.state.poLines} //po lines of a PO
          subTotal={this.state.subTotal}
          flagsPrompts={
            //to show flags prompts in order detail header
            this.props.user.getDefaultValues &&
            this.props.user.getDefaultValues.flags &&
            this.props.user.getDefaultValues.flags.length > 0
              ? this.props.user.getDefaultValues.flags
              : []
          }
          getNewORUpdatedPOLine={this.getNewORUpdatedPOLine} //update po line on add/edit po lines
          updatePOLines={this.updatePOLines}
          handleMultipleChanges={this.handleMultipleChanges} //update po-lines according to multiple change modal
          deletePOLine={this.deletePOLine} //to delete po line
          accountDetails={
            this.props.user.getAccountDetails.accountDetails || ""
          }
          handleCheckboxesInOrderDetails={this.handleCheckboxesInOrderDetails}
          props={this.props}
          tab={tab}
          teamOrdersCheck={teamOrderCheck}
          basisOptions={this.state.basisOptions || []}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
          suppliersFlags={this.state.suppliersFlags}
          orderDescription={this.state.orderDescription || ""}
          handleChangeFields={this.handleChangeFields}
          handleChangeChartCode={this.handleChangeChartCode}
          handleChangeInLineFields={this.handleChangeInLineFields}
          convertTwoDecimal={this.convertTwoDecimal}
          handleChangeFlags={this.handleChangeFlags}
          onblurCode={this.onblurCode}
          changeChartCode={this.changeChartCode}
          chartCodesList={this.state.chartCodesList}
          clonedChartCodesList={this.state.clonedChartCodesList}
          customFields={this.state.customFields || []}
          disDisc={disDisc}
        />
        <TotalAmount
          openTotalAmountModal={this.state.openTotalAmountModal}
          closeModal={this.closeModal}
          tab={tab}
          netTotal={this.state.subTotal}
          taxTotal={this.state.taxTotal}
          grossTotal={this.state.grossTotal}
          updatePOAmounts={this.updatePOAmounts}
          handleTaxAmount={this.handleTaxAmount}
        />
        <Approvals
          openApprovalsModal={this.state.openApprovalsModal}
          closeModal={this.closeModal}
          approvals={this.state.approvals || []}
          handleChangeApprovalsGroups={this.handleChangeApprovalsGroups}
          approvalGroup={this.state.approvalGroup}
          updateApprovalGroup={this.updateApprovalGroup}
          tab={tab}
        />
        <OrdersMoreDetails
          openModal={this.openModal}
          closeModal={this.closeModal}
          openOrdersMoreDetailsModal={this.state.openOrdersMoreDetailsModal}
          ordersMoreDetails={this.state.ordersMoreDetails}
        />
        <POLogs
          openPOLogsModal={this.state.openPOLogsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          poLog={this.state.poLog}
        />
        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
          activity={this.state.poActivity}
        />
        <Changes
          openChangesModal={this.state.openChangesModal}
          closeModal={this.closeModal}
          changes={this.state.poChanges}
        />
        <Import
          state={this.state}
          closeModal={this.closeModal}
          onImport={this.importPO}
          page="orders"
        />
        <Post
          openPostModal={this.state.openPostModal}
          closeModal={this.closeModal}
          postType="Orders"
          onSave={this.postPO}
          locationProps={this.props}
        />
        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Purchase Orders"
          locationProps={this.props}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  poData: state.poData,
  chart: state.chart,
  supplier: state.supplier,
  setup: state.setup,
  report: state.report,
});

export default connect(mapStateToProps, {
  getPOPreview: POActions.getPOPreview,
  getPOSummary: POActions.getPOSummary,
  getPOCompany: POActions.getPOCompany,
  updatePOCompany: POActions.updatePOCompany,
  updatePOReference: POActions.updatePOReference,
  getPOSupplier: POActions.getPOSupplier,
  updatePOSupplier: POActions.updatePOSupplier,
  updateSpecialConditions: POActions.updateSpecialConditions,
  updateRequested: POActions.updateRequested,
  getPOLines: POActions.getPOLines,
  updatePOLines: POActions.updatePOLines,
  updatePOAmounts: POActions.updatePOAmounts,
  updateApprovalGroup: POActions.updateApprovalGroup,
  getPOChanges: POActions.getPOChanges,
  getPOLog: POActions.getPOLog,
  getPOActivity: POActions.getPOActivity,
  getPOList: POActions.getPOList,
  getNewPOList: POActions.getNewPOList,
  addPoAttachments: POActions.addPoAttachments,
  getPO: POActions.getPO,
  insertPO: POActions.insertPO,
  approvePO: POActions.approvePO,
  declinePO: POActions.declinePO,
  holdPO: POActions.holdPO,
  sendForApprovalPO: POActions.sendForApprovalPO,
  deletePO: POActions.deletePO,
  addPoAttachmentLists: POActions.addPoAttachmentLists,
  getPOAttachment: POActions.getPOAttachment,
  modifyPO: POActions.modifyPO,
  addComment: POActions.addComment,
  closePO: POActions.closePO,
  copyPO: POActions.copyPO,
  movePO: POActions.movePO,
  getPOTallies: POActions.getPOTallies,
  updatePO: POActions.updatePO,
  importPO: POActions.importPO,
  PSLExport: POActions.PSLExport,
  exportPO: POActions.exportPO,
  postPO: POActions.postPO,
  clearPOStates: POActions.clearPOStates,
  getChartCodes: ChartActions.getChartCodes,
  getChartSorts: ChartActions.getChartSorts,
  getFlags: ChartActions.getFlags,
  getCurrencies: ChartActions.getCurrencies,
  getDefaultValues: UserActions.getDefaultValues,
  getSupplier: SupplierActions.getSupplier,
  getSuppliersList: SupplierActions.getSuppliersList,
  getSupplierContacts: SupplierActions.getSupplierContacts,
  getBtachList: SetupActions.getBtachList,
  deleteBatch: SetupActions.deleteBatch,
  updateBatch: SetupActions.updateBatch,
  insertBatch: SetupActions.insertBatch,
  primePost: ReportsActions.primePost,
  clearReportsStates: ReportsActions.clearReportsStates,
  clearSetupStates: SetupActions.clearSetupStates,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearChartStates: ChartActions.clearChartStates,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Orders);
