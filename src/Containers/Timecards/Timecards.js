import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import $ from "jquery";
import "./Timecards.css";
import { connect } from "react-redux";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import _ from "lodash";
import moment from "moment";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Attachments from "../Modals/Attachments/Attachments";
import CreateSendEFT from "../Modals/CreateSendEFT/CreateSendEFT";
import ResendSTPFile from "../Modals/ResendSTPFile/ResendSTPFile";
import SendYearEndSTPFile from "../Modals/SendYearEndSTPFile/SendYearEndSTPFile";
import TimeCardMoreDetail from "../Modals/TimeCardMoreDetail/TimeCardMoreDetail";
import DeclineTimeCard from "../Modals/DeclineTimeCard/DeclineTimeCard";
import Import from "../Modals/Import/Import";
import Report from "../Modals/Report/Report";
import Dropdown from "react-bootstrap/Dropdown";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import Comments from "../Modals/Comments/Comments";
import Move from "../Modals/Move/Move";
import { options } from "../../Constants/Constants";
import {
  handleAPIErr,
  zoomIn,
  zoomOut,
  handleDropdownZooming,
  downloadAttachments,
} from "../../Utils/Helpers";
import ModileResponsiveMenu from "../../Components/modileResponsiveMenu";
import * as TimecardActions from "../../Actions/TimecardActions/TimecardActions";
import * as SetupActions from "../../Actions/SetupRequest/SetupAction";

const uuidv1 = require("uuid/v1");

class Timecards extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      allowEdit: "N", //to add the edit timecard button on approve tab if it is Y
      tcType: "", //timecard type -> draft, pending, declined, all etc
      employeeList: [],
      tran: "", //tran of current selected Timecard
      multipleTrans: [], //when user selects multiple Timecard to perform different functionality
      timecardTallies: [], //e.g Draft, Pending, Approved, etc
      timecardListSearch: "", //search on timecard list
      timecardsList: [], //side menu (left side) timecard list data
      clonedTimecardsList: [], //a copy of  timecardsList
      filteredTimecardList: [], //this contains filterd list and used for searching on it
      activeTimecard: "", //to add class active in lists of getting timecards (in left side )
      activeTimecardTallis: "1", //to add class active on timecards tallis
      showTallisTabPane: "Draft", //to add class active on timecards tallis below tab pane
      timecardType: "", //draft, pending, declined, all etc
      viewTeam: "N",
      employeeCode: "",
      employeeName: "",
      weekEndingDate: "",
      department: "",
      position: "",
      email: "",
      approverGroup: "",
      approverOptions: [],
      approvers: [],
      stateTaxFlag: "",
      group: "",
      currentApprover: "",
      approved: "",
      batchDesc: "",
      batchNo: "", //batch no of current selected batch
      batchList: [],
      batchListOptions: [], //restructured batch listfor the drop-down when Move popup opens
      totalHours: "",
      previews: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      scaling: 3.4,
      dropdownZoomingValue: { label: "40%", value: "40%" },
      rotate: 0,
      toggleRightSidebar: true,

      sortTCListKeyName: "employeeName",
      sortTCListOrder: "ASC",

      attachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      exceptions: [],
      comments: [],
      activity: [],

      openAttachmentsModal: false,
      openCommentsModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openReportModal: false,
      openEmployeeLookupModal: false,
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
    //Team Timecard Check
    let viewTeam = localStorage.getItem("teamTimecard");
    if (viewTeam) {
      this.setState({ viewTeam });
    }
    let sortTCListKeyName = localStorage.getItem("sortTCListKeyName") || "";
    let sortTCListOrder = localStorage.getItem("sortTCListOrder") || ""; //ASC | DESC
    if (sortTCListKeyName && sortTCListOrder) {
      this.setState({ sortTCListKeyName, sortTCListOrder });
    }

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
    // sideBarAccord
    $(".invoice-inherit").click(function () {
      $(".invoice-inherit .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });
    $(".invoice-inherit2").click(function () {
      $(".sideBarAccord2 ").toggleClass("rotate_0");
    });
    $(".invoice-batchlist").click(function () {
      $(".invoice-batchlist .sideBarAccord1").toggleClass("rotate_0");
    });
    // end

    let {
      tallies,
      dashboard,
      tallType,
      addEditTimecardCheck,
      addEditTimecardTran,
    } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (dashboard && tallType) {
      //when user click on Timecard Tallies on Dashboard
      await this.getTimecardTallies(tallType, true);
    } else if (
      tallies &&
      (tallies === "Draft" || tallies === "Approve") &&
      addEditTimecardCheck &&
      addEditTimecardTran
    ) {
      /*Check When Edit Timecard and then user Save or Cancel that edit, 
    then load the same Timecard user just edited?.*/
      await this.getTimecardTallies(tallies, true);
    } else {
      await this.getTimecardTallies();
    }

    this.getBtachList();
  }

  clearStates = () => {
    this.setState({
      allowEdit: "N", //to add then edit timecardd button on approve tab if it is equal to Y
      tcType: "", //timecard type -> draft, pending, declined, all etc
      isLoading: false,
      tran: "", //tran of current selected Timecard
      multipleTrans: [], //when user selects multiple Timecard to perform different functionality
      timecardListSearch: "", //search on timecard list
      timecardsList: [], //side menu (left side) timecard list data
      clonedTimecardsList: [], //a copy of  timecardsList
      filteredTimecardList: [], //this contains filterd list and used for searching on it
      activeTimecard: "", //to add class active in lists of getting timecards (in left side )
      activeTimecardTallis: "1", //to add class active on timecards tallis
      showTallisTabPane: "Draft", //to add class active on timecards tallis below tab pane
      timecardType: "", //draft, pending, declined, all etc
      employeeCode: "",
      employeeName: "",
      weekEndingDate: "",
      department: "",
      position: "",
      email: "",
      approverGroup: "",
      approverOptions: [],
      approvers: [],
      stateTaxFlag: "",
      group: "",
      currentApprover: "",
      approved: "",
      batchDesc: "",
      batchNo: "", //batch no of current selected batch
      totalHours: "",
      previews: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      attachments: [],
      exceptions: [],
      comments: [],
      activity: [],

      openAttachmentsModal: false,
      openCommentsModal: false,
      openActivityModal: false,
      openChangesModal: false,
      openReportModal: false,
    });
  };

  //get Timecard talleis
  getTimecardTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined OR after creating new Timecard etc then update Timecard Tallies
    this.setState({ isLoading: true });
    let isTCTallies = false; //to check if redux store containe timecard tallies then dont call API again

    let _timecardTallies = this.props.timecard.timecardTallies || [];

    if (_timecardTallies.length === 0 || check) {
      await this.props.getTimecardTallies(); // get timecardTallies
    } else {
      isTCTallies = true;
    }
    let tcTally = ""; //contains single tally info e.g. {type: draft, count: 3}
    let timecardTallies = [];
    let { activeTimecardTallis, showTallisTabPane } = this.state;

    //success case of Timecard tallies
    if (this.props.timecard.timecardTalliesSuccess || isTCTallies) {
      // toast.success(this.props.timecard.timecardTalliesSuccess);
      timecardTallies = this.props.timecard.timecardTallies || [];

      let _type = "";

      if (type) {
        _type = type;
      } else if (timecardTallies.length > 0) {
        _type = timecardTallies[0].type;
      }

      timecardTallies.map(async (s, i) => {
        if (s.type === _type) {
          let id = uuidv1();
          s.id = id;
          tcTally = s;
          activeTimecardTallis = id;
          showTallisTabPane = s.type;
        } else {
          s.id = uuidv1();
        }
        return s;
      });
    }
    //error case of Timecard tallies
    if (this.props.timecard.timecardTalliesError) {
      handleAPIErr(this.props.timecard.timecardTalliesError, this.props);
    }
    this.setState({
      isLoading: false,
      timecardTallies,
      activeTimecardTallis,
      showTallisTabPane,
    });
    if (tcTally) {
      await this.checkTCList_API(tcTally);
    }
    this.props.clearTimecardStates();
  };

  //check GetTimecardList OR GetNewTimecardList API should be called
  checkTCList_API = (data, check) => {
    // let usePageLoading = localStorage.getItem("usePageLoading") || "N";
    // usePageLoading = usePageLoading.toLocaleLowerCase();

    //determines if the timecardsList (N) or GetNewPOList (Y) is used.

    this.getTimecardList(data, check);
    // if (usePageLoading === "y") {
    //   this.getNewPOList(data, check);
    // } else {
    //   this.timecardsList(data, check);
    // }
  };

  //getting the timecard list when click on Draft || Pending || Approved etc
  getTimecardList = async (data, check) => {
    this.clearStates();
    this.setState({
      isLoading: true,
      activeTimecardTallis: data.id,
      showTallisTabPane: data.type,
    });
    let { activeTimecard, viewTeam } = this.state;
    let teamTimecardCheck = viewTeam;
    if (teamTimecardCheck) {
      data.teamTimecard = teamTimecardCheck;
    }
    await this.props.getTimecardList(data); // get Timecard list

    let firstTC = ""; //first timecard

    //success case of Timecard List
    if (this.props.timecard.getTimecardListSuccess) {
      // toast.success(this.props.timecard.getTimecardListSuccess);
      let timecardsList = this.props.timecard.getTimecardList || [];

      let sortTCListKeyName = this.state.sortTCListKeyName || "";
      let sortTCListOrder = this.state.sortTCListOrder || "";
      let valueA = "";
      let valueB = "";
      timecardsList
        .sort((a, b) => {
          if (sortTCListKeyName === "tran") {
            valueA = Number(a[sortTCListKeyName]);
            valueB = Number(b[sortTCListKeyName]);
          } else if (sortTCListKeyName === "date") {
            valueA = new Date(a.date);
            valueB = new Date(b.date);
          } else if (sortTCListKeyName) {
            valueA = a[sortTCListKeyName].toString().toUpperCase();
            valueB = b[sortTCListKeyName].toString().toUpperCase();
          }
          //for ascending order
          if (sortTCListOrder === "ASC") {
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
        })
        .map(async (tc, i) => {
          tc.id = uuidv1();
          tc.checked = false;
          tc.weekEndingDate = moment(tc.weekEndingDate, "DD/M/YYYY")
            .format("DD MMM YYYY")
            .toUpperCase();
          return tc;
        });

      //setting up the first timecard to active and call getTimecardSummary API accordingly
      if (timecardsList.length > 0) {
        firstTC = timecardsList[0];
        activeTimecard = timecardsList[0].id;
      }

      let { addEditTimecardTran, tallies, addEditTimecardCheck } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";

      /*Check When Add/Edit timecard and then user Save or Cancel that edit, 
        then load the same  timecard user just edited/created?.*/
      if (
        tallies &&
        (tallies === "Draft" || tallies === "Approve") &&
        addEditTimecardCheck &&
        addEditTimecardTran
      ) {
        let checkTC = timecardsList.find((l) => l.tran === addEditTimecardTran);
        if (checkTC) {
          firstTC = checkTC;
          activeTimecard = checkTC.id; //now first time replaced with the last modified or canceled timecard from the add edit timecard page
        }
      }
      this.setState({
        activeTimecard,
        timecardsList,
        clonedTimecardsList: timecardsList,
        filteredTimecardList: timecardsList,
      });
    }
    //error case of Timecard List
    if (this.props.timecard.getTimecardListError) {
      handleAPIErr(this.props.timecard.getTimecardListError, this.props);
    }
    this.props.clearTimecardStates();

    this.setState({ isLoading: false });
    if (firstTC) {
      //to call get timecard baseed on first timecard in timecard list
      await this.getTimecardSummary(firstTC, true);
    }
    await this.props.clearTimecardStates();

    // scroll to active timecard
    var elmnt = document.getElementById(this.state.activeTimecard);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //Get Timecard Summary
  getTimecardSummary = async (tc, check) => {
    if (this.state.activeTimecard != tc.id || check) {
      this.clearTCStates(tc);
      await this.props.getTimecardSummary(tc.tran);
      //success case of Get Timecard Summary
      if (this.props.timecard.getTimecardSummarySuccess) {
        // toast.success(this.props.timecard.getTimecardSummarySuccess);

        let tcSummary = _.cloneDeep(this.props.timecard.getTimecardSummary);

        let tran = tcSummary.tran || "";
        let allowEdit = tcSummary.allowEdit || "N";
        let tcType = tcSummary.type || "";
        let batchDesc = tcSummary.batchDesc || "";
        let approved = tcSummary.approved || "";
        let currentApprover = tcSummary.currentApprover || "";
        let group = tcSummary.group || "";
        let stateTaxFlag = tcSummary.stateTaxFlag || "";
        let approverGroup = tcSummary.approverGroup || "";
        let approverOptions = tcSummary.approverOptions || [];
        let approvers = tcSummary.approvers || [];
        let department = tcSummary.department || "";
        let position = tcSummary.position || "";
        let email = tcSummary.email || "";
        let periodEndingDate = tcSummary.periodEndingDate || "";
        let employeeName = tcSummary.employeeName || "";
        let employeeCode = tcSummary.employeeCode || "";
        let totalHours = tcSummary.totalHours || "";
        let activity = tcSummary.activity || [];
        let comments = tcSummary.comments || [];

        comments.map((c) => (c.comment = c.status));

        let attachments = tcSummary.attachments || [];

        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });

        let previews = tcSummary.previews || [];
        let exceptions = tcSummary.exceptions || [];

        approverOptions.map((a, i) => {
          a.checked = false;
          a.id = uuidv1();
          return a;
        });

        this.setState({
          tcType,
          tran,
          allowEdit,
          batchDesc,
          approved,
          currentApprover,
          group,
          stateTaxFlag,
          approverGroup,
          approverOptions,
          approvers,
          department,
          position,
          email,
          periodEndingDate,
          employeeName,
          employeeCode,
          totalHours,
          activity,
          comments,
          attachments,
          attachmentSize,
          previews,
          exceptions,
          isLoading: false,
        });
      }
      //error case of Get Timecard Summary
      if (this.props.timecard.getTimecardSummaryError) {
        handleAPIErr(this.props.timecard.getTimecardSummaryError, this.props);
      }
      this.props.clearTimecardStates();
      let timecardZoom = localStorage.getItem("timecardZoom");
      if (timecardZoom) {
        this.handleDropdownZooming({ value: timecardZoom });
      }
    }
  };

  //just clear Timecard related states
  clearTCStates = (tc) => {
    this.setState({
      tcType: "", //timecard type -> draft, pending, declined, all etc
      isLoading: true,
      activeTimecard: tc.id,
      timecardType: "",
      teamTimecard: "N",
      employeeCode: "",
      employeeName: "",
      weekEndingDate: "",
      department: "",
      position: "",
      email: "",
      approverGroup: "",
      approverOptions: [],
      approvers: [],
      stateTaxFlag: "",
      group: "",
      currentApprover: "",
      approved: "",
      batchDesc: "",
      batchNo: "",
      totalHours: "",
      tran: "",
      previews: [],
      rotate: 0,
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      attachments: [],
      attachmentSize: 0,
      exceptions: [],
      comments: [],
      activity: [],
    });
  };

  //call getTimecardList API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamTimecard", check);
    this.setState({ viewTeam: check }, () => {
      let { activeTimecardTallis, showTallisTabPane } = this.state;
      let obj = {
        id: activeTimecardTallis,
        type: showTallisTabPane,
      };
      this.checkTCList_API(obj);
    });
  };

  // move to previous timecard
  moveToPrevTimecard = async () => {
    let { timecardsList, activeTimecard } = this.state;
    let foundIndex = timecardsList.findIndex((l) => l.id === activeTimecard);

    if (foundIndex != -1 && foundIndex != 0) {
      let tc = timecardsList[foundIndex - 1];
      if (tc) {
        await this.getTimecardSummary(tc);
      }
    }
  };

  // move to next timecard
  moveToNextTimecard = async () => {
    let { timecardsList, activeTimecard } = this.state;
    let foundIndex = timecardsList.findIndex((l) => l.id === activeTimecard);

    if (foundIndex != -1) {
      let tc = timecardsList[foundIndex + 1];
      if (tc) {
        await this.getTimecardSummary(tc);
      }
    }
  };

  //delete timecard
  deleteTimecard = async () => {
    let {
      tran,
      multipleTrans,
      timecardsList,
      activeTimecard,
      activeTimecardTallis,
      showTallisTabPane,
      timecardTallies,
      clonedTimecardsList,
      filteredTimecardList,
      batchList,
    } = this.state;

    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Timecard can be Delete at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      let activeTimeCard = timecardsList.find((tc) => tc.tran === _trans) || "";
      let batchObject =
        batchList.find(
          (batchItem) =>
            Number(batchItem.batchNo) === Number(activeTimeCard.batchNo)
        ) || "";

      if (batchObject.lock === "Locked") {
        toast.error("Selected Timecard Batch is Locked");
        return;
      }

      this.setState({
        isLoading: true,
      });

      await this.props.deleteTimecard(_trans); // delete timecard
      //success case of delete Timecard
      if (this.props.timecard.deleteTimecardSuccess) {
        // toast.success(this.props.timecard.deleteTimecardSuccess);
        // When deleting an Timecard --- Can it just highlight the Timecard above the deleted one?

        if (timecardsList.length === 1) {
          await this.clearStates();
          //decrease the tallies count also
          timecardTallies.map((t, i) => {
            if (
              t.type.toLowerCase() === "draft" //delete button only appears in draft section
            ) {
              t.count = 0;
            }
            return t;
          });
          timecardsList = [];
          clonedTimecardsList = [];
          multipleTrans = [];
          filteredTimecardList = [];
        } else if (timecardsList.length > 1) {
          if (_trans === tran) {
            //when user delete the current selected Timecard
            //there are two cases if the user deletes the first Timecard in the list  then active the very next otherwise highlight Timecard above the deleted Timecard
            let foundIndex = timecardsList.findIndex(
              (l) => l.id === activeTimecard
            );
            if (foundIndex != -1 && foundIndex === 0) {
              let tc = timecardsList[foundIndex + 1];
              if (tc) {
                await this.getTimecardSummary(tc);
              }
            } else {
              let tc = timecardsList[foundIndex - 1];
              if (tc) {
                await this.getTimecardSummary(tc);
              }
            }
            let list = timecardsList.filter((l) => l.tran != _trans);
            //decrease the tallies count also
            timecardTallies.map((t, i) => {
              if (t.type.toLowerCase() === "draft") {
                t.count = list.length;
              }
              return t;
            });

            timecardsList = list;
            clonedTimecardsList = list;
            filteredTimecardList = list;
            multipleTrans = [];
          } else {
            //when user delete other timecard by checking the check box
            let list = timecardsList.filter((l) => l.tran != _trans);
            //decrease the tallies count also
            timecardTallies.map((t, i) => {
              if (t.type.toLowerCase() === "draft") {
                t.count = list.length;
              }
              return t;
            });
            timecardsList = list;
            clonedTimecardsList = list;
            filteredTimecardList = list;
            multipleTrans = [];
          }
        }
      }
      //error case of delete Timecard
      if (this.props.timecard.deleteTimecardError) {
        handleAPIErr(this.props.timecard.deleteTimecardError, this.props);
      }
      this.setState({
        isLoading: false,
        timecardsList,
        clonedTimecardsList,
        filteredTimecardList,
        activeTimecardTallis,
        multipleTrans,
        showTallisTabPane,
        timecardTallies,
      });
      this.props.clearTimecardStates();
    }
  };

  //move Timecard
  moveTimecard = async () => {
    let { tran, multipleTrans, showTallisTabPane, timecardsList, batchList } =
      this.state;

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
      if (typeof _trans !== "object") {
        let activeTimeCard =
          timecardsList.find((tc) => tc.tran === _trans) || "";
        let batchObject =
          batchList.find(
            (batchItem) =>
              Number(batchItem.batchNo) === Number(activeTimeCard.batchNo)
          ) || "";

        if (batchObject.lock === "Locked") {
          toast.error("Selected Timecard batch is locked");
          return;
        }
      } else {
        let anyTimecardLocked = false;
        _trans.map((tran) => {
          let filteredObj = timecardsList.find((tc) => tc.tran === tran) || "";
          if (filteredObj) {
            let lockedBatch =
              batchList.find(
                (batchObj) =>
                  Number(batchObj.batchNo) === Number(filteredObj.batchNo) &&
                  batchObj.lock === "Locked"
              ) || "";
            if (lockedBatch) {
              anyTimecardLocked = true;
              return;
            }
          }
          return;
        });
        if (anyTimecardLocked) {
          toast.error("One of selected Timecard batch is locked");
          return;
        }
      }

      this.setState({
        isLoading: true,
      });

      await this.props.moveTimecard(_trans); // move timecard
      //success case of move timecard
      if (this.props.timecard.moveTimecardSuccess) {
        toast.success(this.props.timecard.moveTimecardSuccess);
        await this.getTimecardTallies(showTallisTabPane, true); //to refresh the list
      }
      //error case of move timecard
      if (this.props.timecard.moveTimecardError) {
        handleAPIErr(this.props.timecard.moveTimecardError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //approve Timecard
  approveTimecard = async () => {
    let { tran, multipleTrans, showTallisTabPane } = this.state;
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

      await this.props.approveTimecard(_trans); // approve timecard
      //success case of approve timecard
      if (this.props.timecard.approveTimecardSuccess) {
        toast.success(this.props.timecard.approveTimecardSuccess);
        await this.getTimecardTallies(showTallisTabPane, true); //to refresh the list
      }
      //error case of approve timecard
      if (this.props.timecard.approveTimecardError) {
        handleAPIErr(this.props.timecard.approveTimecardError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //hold Timecard
  holdTimecard = async () => {
    let { tran, multipleTrans, showTallisTabPane } = this.state;
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

      await this.props.holdTimecard(_trans); // hold timecard
      //success case of hold timecard
      if (this.props.timecard.holdTimecardSuccess) {
        toast.success(this.props.timecard.holdTimecardSuccess);
        await this.getTimecardTallies(showTallisTabPane, true); //to refresh the list
      }
      //error case of hold timecard
      if (this.props.timecard.holdTimecardError) {
        handleAPIErr(this.props.timecard.holdTimecardError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  declineTimeCard = async () => {
    const { tran, timecardsList, batchList } = this.state;
    let activeTimeCard = timecardsList.find((tc) => tc.tran === tran) || "";
    let batchObject =
      batchList.find(
        (batchItem) =>
          Number(batchItem.batchNo) === Number(activeTimeCard.batchNo)
      ) || "";

    if (batchObject.lock === "Locked") {
      toast.error("Selected Timecard batch is locked");
      return;
    } else {
      this.setState({
        openDeclineTimeCardmodal: true,
      });
    }
  };

  // sendForApproval Timecard =>Draft -> send
  sendForApproval = async () => {
    let { tran, multipleTrans, showTallisTabPane, timecardsList, batchList } =
      this.state;
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

      if (typeof _trans !== "object") {
        let activeTimeCard =
          timecardsList.find((tc) => tc.tran === _trans) || "";

        if (Number(activeTimeCard.batchNo) === 0) {
          toast.error("Selected Timecard batch is 0");
          return;
        }

        let batchObject =
          batchList.find(
            (batchItem) =>
              Number(batchItem.batchNo) === Number(activeTimeCard.batchNo)
          ) || "";
        if (batchObject.lock === "Locked") {
          toast.error("Selected Timecard batch is locked");
          return;
        }
      } else {
        let anyTimecardLocked = false;
        _trans.map((tran) => {
          let filteredObj = timecardsList.find((tc) => tc.tran === tran);
          if (filteredObj) {
            if (Number(filteredObj.batchNo) === 0) {
              toast.error("Selected Timecard batch is 0");
              return;
            }
            let lockedBatch = batchList.find(
              (batchObj) =>
                Number(batchObj.batchNo) === Number(filteredObj.batchNo) &&
                batchObj.lock === "Locked"
            );
            if (lockedBatch) {
              anyTimecardLocked = true;
              return;
            }
          }
          return;
        });
        if (anyTimecardLocked) {
          toast.error("One of selected Timecard batch is locked");
          return;
        }
      }

      this.setState({
        isLoading: true,
      });

      await this.props.sendForApproval(_trans); // send For Approval Timecard
      //success case of send For Approval Timecard
      if (this.props.timecard.sendForApprovalTimecardSuccess) {
        // toast.success(this.props.timecard.sendForApprovalTimecardSuccess);
        await this.getTimecardTallies(showTallisTabPane, true); //to refresh the list
      }
      //error case of send For Approval Timecard
      if (this.props.timecard.sendForApprovalTimecardError) {
        handleAPIErr(
          this.props.timecard.sendForApprovalTimecardError,
          this.props
        );
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  handleCheckbox = (e, data) => {
    let { timecardsList, multipleTrans } = this.state;
    let { name, checked } = e.target;

    if (data === "allCheck" && name === "checkboxAll") {
      let multipleTransCopy = [];
      if (checked) {
        timecardsList.map((m) => {
          m.checked = true;
          multipleTransCopy.push(m.tran);
          return m;
        });
      } else {
        timecardsList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleTrans = [...multipleTransCopy];
    } else {
      if (checked) {
        timecardsList.map((m) => {
          if (m.id === data.id) {
            m.checked = true;
          }
          return m;
        });
        multipleTrans.push(data.tran);
      } else {
        timecardsList.map((m) => {
          if (m.id === data.id) {
            m.checked = false;
          }
          return m;
        });
        multipleTrans = multipleTrans.filter((m) => m != data.tran);
      }
    }
    this.setState({ timecardsList, multipleTrans });
  };

  //add attachment
  addAttachment = async (attachment, fileName) => {
    let { tran } = this.state;
    if (tran) {
      this.setState({ isLoading: true });
      let data = {
        fileName,
        attachment,
        tran,
      };
      await this.props.addAttachment(data);
      if (this.props.timecard.addAttachmentsSuccess) {
        toast.success(this.props.timecard.addAttachmentsSuccess);
        let attachments = this.props.timecard.addAttachments || [];
        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        this.setState({ attachments, attachmentSize });
      }
      if (this.props.timecard.addAttachmentsError) {
        handleAPIErr(this.props.timecard.addAttachmentsError, this.props);
      }
      this.props.clearTimecardStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select an Timecard");
    }
  };

  //get Attachment
  getAttachment = async (recordID, type, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getAttachment(recordID);
    if (this.props.timecard.getAttachmentSuccess) {
      let resp = this.props.timecard.getAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.timecard.getAttachmentError) {
      handleAPIErr(this.props.timecard.getAttachmentError, this.props);
    }
    this.props.clearTimecardStates();
    this.setState({ isLoading: false });
  };

  //Download copy of TimeCards
  downloadPreview = async () => {
    let { previews } = this.state;

    previews.map((prev) => {
      const linkSource = `data:application/pdf;base64,${prev.file}`;
      const downloadLink = document.createElement("a");
      const fileName = "attachment.pdf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  };

  //add comment
  addComment = async (comment) => {
    let { tran, comments } = this.state;
    if (tran) {
      if (comment) {
        this.setState({ isLoading: true });
        let data = {
          comment,
          tran,
        };
        await this.props.addComment(data);
        if (this.props.timecard.addCommentSuccess) {
          // toast.success(this.props.timecard.addCommentSuccess);
          comments = this.props.timecard.addComments || comments;
        }
        if (this.props.timecard.addCommentError) {
          handleAPIErr(this.props.timecard.addCommentError, this.props);
        }
        this.props.clearTimecardStates();
        this.setState({ isLoading: false, comments });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please Select an Timecard");
    }
  };

  hanldeTPHpayoll = (name) => {
    if (
      name === "Create and Send EFT/STP Files" ||
      name === "Resend STP File" ||
      name === "Send Year End STP File"
    ) {
      if (name === "Create and Send EFT/STP Files") {
        let { batchNo, batchList } = this.state;

        if (batchNo || batchNo === 0) {
          let batch = batchList.find((b) => b.batchNo === batchNo);

          if (batch && batch.lock === "Locked") {
            this.openModal("openSendEFTmodal");
          } else {
            toast.error(
              "BBatch must be locked to Create EFT and Send STP Files"
            );
          }
        } else {
          toast.error("Please select Batch Form Batch List!");
        }
      } else if (name === "Resend STP File") {
        this.openModal("openResendSTPFilemodal");
      } else {
        this.openModal("openSendYearEndSTPFilemodal");
      }
    } else if (name === "Send Reports") {
      this.sendReports();
    } else if (name === "Lock & Invoice") {
      this.lockAndInvoice();
    } else if (name === "Send Payslips to employees") {
      this.sendPayslips();
    } else if (name === "Post & Upload Data") {
      this.postData();
    }
  };

  //Sned Repors
  sendReports = async () => {
    let { batchNo } = this.state;
    if (batchNo || batchNo === 0) {
      this.setState({ isLoading: true });

      await this.props.sendReports(batchNo);

      if (this.props.timecard.sendReportsSuccess) {
        toast.success(this.props.timecard.sendReportsSuccess);
      }

      if (this.props.timecard.sendReportsError) {
        handleAPIErr(this.props.timecard.sendReportsError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Batch Form Batch List!");
    }
  };

  //Lock And Invoice
  lockAndInvoice = async () => {
    let { batchNo, batchList, tcType } = this.state;
    if (tcType === "Approved" || tcType === "approved") {
      if (batchNo || batchNo === 0) {
        let batch = batchList.find((b) => b.batchNo === batchNo);

        if (batch && batch.lock === "Locked") {
          toast.error("Batch is already Locked");
        } else {
          this.setState({ isLoading: true });

          await this.props.lockAndInvoice(batchNo);

          if (this.props.timecard.lockAndInvoiceSuccess) {
            toast.success(this.props.timecard.lockAndInvoiceSuccess);
            let ind = batchList.findIndex((b) => b.batchNo === batchNo);
            if (ind > -1) {
              batch = { ...batch, lock: "Locked" };
              batchList[ind] = batch;
            }
          }

          if (this.props.timecard.lockAndInvoiceError) {
            handleAPIErr(this.props.timecard.lockAndInvoiceError, this.props);
          }
          this.setState({ isLoading: false, batchList });
          this.props.clearTimecardStates();
        }
      } else {
        toast.error("Please select Batch Form Batch List!");
      }
    } else {
      toast.error(
        "Timecard has not been fully approved so the batch can not be locked and Invoiced!"
      );
    }
  };

  //Send Payslips to Employees
  sendPayslips = async () => {
    let { batchNo, batchList } = this.state;

    if (batchNo || batchNo === 0) {
      let batch = batchList.find((b) => b.batchNo === batchNo);

      if (batch && batch.lock === "Locked") {
        this.setState({ isLoading: true });

        await this.props.sendPayslips(batchNo);

        if (this.props.timecard.sendPaySlipSuccess) {
          toast.success(this.props.timecard.sendPaySlipSuccess);
        }

        if (this.props.timecard.sendPaySlipError) {
          handleAPIErr(this.props.timecard.sendPaySlipError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearTimecardStates();
      } else {
        toast.error("Batch must be locked to Send Payslips");
      }
    } else {
      toast.error("Please select Batch Form Batch List!");
    }
  };

  //Post Data
  postData = async () => {
    let { batchNo, batchList } = this.state;

    if (batchNo || batchNo === 0) {
      let batch = batchList.find((b) => b.batchNo === batchNo);

      if (batch && batch.lock === "Locked") {
        this.setState({ isLoading: true });

        await this.props.postData(batchNo);

        if (this.props.timecard.postDataSuccess) {
          toast.success(this.props.timecard.postDataSuccess);
        }

        if (this.props.timecard.postDataError) {
          handleAPIErr(this.props.timecard.postDataError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearTimecardStates();
      } else {
        toast.error("Batch must be locked to Post and Upload");
      }
    } else {
      toast.error("Please select Batch Form Batch List!");
    }
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  //sorting on timecard list
  handleSortTimecardList = async (name) => {
    name = name || "";
    // let usePageLoading = localStorage.getItem("usePageLoading") || "N";
    // usePageLoading = usePageLoading.toLocaleLowerCase();
    // if (usePageLoading === "y") {
    //   this.setState(
    //     {
    //       sortTCListKeyName: name,
    //     },
    //     () => {
    //       let { activeTimecardTallis, showTallisTabPane, sortTCListOrder } =
    //         this.state;

    //       let obj = {
    //         id: activeTimecardTallis,
    //         type: showTallisTabPane,
    //       };
    //       localStorage.setItem("sortTCListKeyName", name);
    //       localStorage.setItem("sortTCListOrder", sortTCListOrder);

    //       this.getNewPOList(obj);
    //     }
    //   );
    // } else {
    let { sortTCListOrder, filteredTimecardList, activeTimecard } = this.state;
    if (this.state.sortTCListKeyName != name) {
      sortTCListOrder = "DESC";
    }
    if (sortTCListOrder === "DESC") {
      sortTCListOrder = "ASC";
    } else {
      sortTCListOrder = "DESC";
    }
    localStorage.setItem("sortTCListKeyName", name);
    localStorage.setItem("sortTCListOrder", sortTCListOrder);

    filteredTimecardList = _.cloneDeep(filteredTimecardList);

    let tcListFilterdData = [];
    if (name === "tran") {
      tcListFilterdData = filteredTimecardList.sort(function (a, b) {
        let valueA = Number(a[name]);
        let valueB = Number(b[name]);
        //for ascending order
        if (sortTCListOrder === "ASC") {
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
      tcListFilterdData = filteredTimecardList.sort(function (a, b) {
        let valueA = "";
        let valueB = "";

        if (name === "date") {
          valueA = new Date(a.date);
          valueB = new Date(b.date);
        } else {
          valueA = new Date(a.approvalDate);
          valueB = new Date(b.approvalDate);
        }

        //for ascending order
        if (sortTCListOrder === "ASC") {
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
      tcListFilterdData = filteredTimecardList.sort(function (a, b) {
        let valueA = a[name].toString().toUpperCase();
        let valueB = b[name].toString().toUpperCase();
        //for ascending order
        if (sortTCListOrder === "ASC") {
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
      timecardsList: tcListFilterdData,
      sortTCListKeyName: name,
      sortTCListOrder,
    });

    // scroll to active timecard
    var elmnt = document.getElementById(activeTimecard);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
    // }
  };

  handleChangeNewTCListSearch = (e) => {
    let { value } = e.target;
    this.setState({ timecardListSearch: value }, () => {
      if (!value) {
        let { activeTimecardTallis, showTallisTabPane } = this.state;
        let obj = {
          id: activeTimecardTallis,
          type: showTallisTabPane,
        };
        // this.getNewPOList(obj);
      }
    });
  };

  //when a user searches on Timecard list
  handleChangeTCListSearch = async (e) => {
    let { value } = e.target;
    this.setState({ timecardListSearch: value }, () => {
      let { filteredTimecardList, sortTCListOrder, sortTCListKeyName } =
        this.state;

      if (!value) {
        //if user removes all searched text then diaplay all list back
        filteredTimecardList = _.cloneDeep(filteredTimecardList);

        if (sortTCListOrder === "ASC") {
          sortTCListOrder = "DESC";
        } else {
          sortTCListOrder = "ASC";
        }
        this.setState(
          { timecardsList: filteredTimecardList, sortTCListOrder },
          () => this.handleSortTimecardList(sortTCListKeyName)
        );
      }
    });
  };

  onNewTCListSearch = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let { value } = e.target;
      let usePageLoading = localStorage.getItem("usePageLoading") || "N";
      usePageLoading = usePageLoading.toLocaleLowerCase();
      if (usePageLoading === "y") {
        this.setState(
          {
            timecardListSearch: value,
          },
          () => {
            let { activeTimecardTallis, showTallisTabPane } = this.state;

            let obj = {
              id: activeTimecardTallis,
              type: showTallisTabPane,
            };
            this.getNewPOList(obj);
          }
        );
      }
    }
  };

  onTCListSearch = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let timecardListSearch = this.state.timecardListSearch.trim();

      if (timecardListSearch) {
        let { filteredTimecardList } = this.state;

        filteredTimecardList = _.cloneDeep(filteredTimecardList);
        let tcListFilterdData = [];
        tcListFilterdData = filteredTimecardList.filter((c) => {
          return (
            c.employeeName
              .toUpperCase()
              .includes(timecardListSearch.toUpperCase()) ||
            c.position
              .toUpperCase()
              .includes(timecardListSearch.toUpperCase()) ||
            c.department
              .toUpperCase()
              .includes(timecardListSearch.toUpperCase())
          );
        });
        this.setState({ timecardsList: tcListFilterdData });
      }
    }
  };

  refreshEmployees = async () => {
    let { employeeList } = this.state;
    this.setState({
      isLoading: true,
    });

    await this.props.refreshEmployees();

    if (this.props.timecard.refreshEmployeesSuccess) {
      // toast.success(this.props.timecard.refreshEmployeesSuccess);
      employeeList = this.props.timecard.refreshEmployees || [];
    }
    if (this.props.timecard.refreshEmployeesError) {
      handleAPIErr(this.props.timecard.refreshEmployeesError, this.props);
    }
    this.setState({
      isLoading: false,
      employeeList,
    });
    this.props.clearTimecardStates();
  };

  getEmployeeList = async () => {
    let { employeeList } = this.state;
    this.setState({
      isLoading: true,
    });

    await this.props.getEmployeeList();

    if (this.props.timecard.getEmployeeListSuccess) {
      // toast.success(this.props.timecard.getEmployeeListSuccess);
      employeeList = this.props.timecard.getEmployeeList || [];
    }
    if (this.props.timecard.getEmployeeListError) {
      handleAPIErr(this.props.timecard.getEmployeeListError, this.props);
    }
    this.setState({
      isLoading: false,
      employeeList,
    });
    this.props.clearTimecardStates();
  };

  clickHandlerMoredetails = async (event, parmData) => {
    let { showTallisTabPane } = this.state;

    showTallisTabPane = showTallisTabPane
      ? showTallisTabPane.toLowerCase()
      : "";

    if (showTallisTabPane === "draft") {
      this.getEmployeeList();
    }

    this.setState({
      openTimeCardMoreDetail: true,
    });
  };

  updateTimecardSummaryState = async (param) => {
    let { previews } = this.state;
    if (this.props.timecard.updateTimecardSummarySuccess) {
      toast.success(this.props.timecard.updateTimecardSummarySuccess);

      let filteredTimecardsList = this.state.timecardsList.find(
        (element) => element.tran === param.tran
      );

      let indexToUpdate = this.state.timecardsList.findIndex(
        (element) => element === filteredTimecardsList
      );
      let newemplyeeList = this.state.timecardsList;
      newemplyeeList[indexToUpdate] = {
        ...newemplyeeList[indexToUpdate],
        weekEndingDate: moment(param.periodEndingDate).format("DD MMM YYYY"),
        tran: param.tran,
        department: param.department,
        employeeName: param.employeeName,
        group: param.group,
        position: param.position,
      };

      await this.props.getTimecardSummary(this.state.tran);
      if (this.props.timecard.getTimecardSummarySuccess) {
        let tcSummary = _.cloneDeep(this.props.timecard.getTimecardSummary);
        previews = tcSummary.previews || [];
      }

      if (this.props.timecard.getTimecardSummaryError) {
        handleAPIErr(this.props.timecard.getTimecardSummaryError, this.props);
      }

      this.setState({
        param,
        previews,
        periodEndingDate: param.periodEndingDate,
      });
    } else {
      toast.error(this.props.timecard.updateTimecardSummaryError);
    }
  };

  // Timecard Previews
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
        localStorage.setItem("timecardZoom", zoom);

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
        localStorage.setItem("timecardZoom", zoom);
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

    localStorage.setItem("timecardZoom", value);

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
    let { rotate } = this.state;
    this.setState({ rotate: rotate + 90 });
  };

  // END
  // Batch List Start
  getBtachList = async () => {
    let batchList = [];
    let batchListOptions = [];
    await this.props.getBtachList("Timecard");
    if (this.props.setup.getBatchListSuccess) {
      // toast.success(this.props.setup.getBatchListSuccess)
      batchList = this.props.setup.getBatchList || [];
      let unlockBatchList = batchList.filter((b) => b.lock != "Locked");

      unlockBatchList.map((b) =>
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
    let { timecardsList, filteredTimecardList } = this.state;

    let batchNo = "";

    const clonedTimecardsList = JSON.parse(
      JSON.stringify(this.state.clonedTimecardsList)
    );

    if (e.target.checked) {
      batchNo = bNo;

      let filterdData = clonedTimecardsList.filter((c) => {
        return Number(c.batchNo) === Number(bNo);
      });

      timecardsList = filterdData;
      filteredTimecardList = filterdData;
    } else {
      //uncheck checkbox
      timecardsList = clonedTimecardsList;
      filteredTimecardList = clonedTimecardsList;
    }
    this.setState({
      batchNo,
      timecardsList,
      filteredTimecardList,
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
        type: "PR",
        notes: "",
        insertBatch: true,
      },
    ];
    this.setState({ batchList });
  };

  deleteBatch = async () => {
    let {
      batchList,
      batchNo,
      timecardsList,
      filteredTimecardList,
      clonedTimecardsList,
    } = this.state;

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

        clonedTimecardsList = _.cloneDeep(clonedTimecardsList);

        timecardsList = clonedTimecardsList;
        filteredTimecardList = clonedTimecardsList;
      }
      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchList,
        batchNo,
        timecardsList,
        filteredTimecardList,
      });
    } else {
      toast.error("Please Select Batch First!");
    }
  };

  addUpdateBatch = async (e, batch, index) => {
    let { batchList, batchListOptions } = this.state;

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
            batchListOptions.push({
              label: batch[name] + " (" + batchNo + ")",
              value: batchNo,
            });
          }
          if (this.props.setup.insertBatchError) {
            handleAPIErr(this.props.setup.insertBatchError, this.props);
          }
          this.props.clearSetupStates();

          this.setState({ isLoading: false, batchListOptions });
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

  // END
  //approvals filter
  handleApprovalsFilters = (e, obj) => {
    let checked = e.target.checked;
    obj.checked = checked;

    let {
      approverOptions,
      clonedTimecardsList,
      timecardsList,
      filteredTimecardList,
    } = this.state;

    let foundIndex = approverOptions.findIndex((a) => a.id == obj.id);
    approverOptions[foundIndex] = obj;

    let check = false;
    let count = 0;
    approverOptions.map((a, i) => {
      if (!a.checked) {
        count += 1;
      }
    });
    if (approverOptions.length === count) {
      check = true;
    }
    clonedTimecardsList = _.cloneDeep(clonedTimecardsList);

    if (check) {
      //all checkboxes are uncheck
      timecardsList = clonedTimecardsList;
      filteredTimecardList = clonedTimecardsList;
    } else {
      let filterdData = [];

      approverOptions.map((a, i) => {
        let tcListFilterdData = [];
        if (a.checked) {
          tcListFilterdData = clonedTimecardsList.filter((c) => {
            return (
              c.approvalGroup &&
              c.approvalGroup.toUpperCase() === a.option.toUpperCase()
            );
          });
        }
        filterdData.push(...tcListFilterdData);
      });

      timecardsList = filterdData;
      filteredTimecardList = filterdData;
    }

    this.setState(
      {
        timecardsList,
        filteredTimecardList,
        approverOptions,
      },
      () => {
        this.handleSortTimecardList(this.state.sortTCListKeyName);
      }
    );
  };

  //Regenerate the preview of a timecard.
  regenerateTimecard = async () => {
    let { tran, previews } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.regenerateTimecard(tran);
      //success case of regenerate timecard
      if (this.props.timecard.regenerateTimecardSuccess) {
        toast.success(this.props.timecard.regenerateTimecardSuccess);
        previews = this.props.timecard.regenerateTimecard || [];
      }
      //error case of regenerate timecard
      if (this.props.timecard.regenerateTimecardError) {
        handleAPIErr(this.props.timecard.regenerateTimecardError, this.props);
      }
      this.setState({ isLoading: false, previews });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  hanldeExport = (name) => {
    if (name === "Excel Timecard") {
      this.exportTimeCard();
    } else if (name === "Excel Distribution") {
      this.exportDistribution();
    } else if (name === "TPH Payroll") {
      this.exportTPHPayroll();
    }
  };

  //Export Timecard
  exportTimeCard = async () => {
    let { tran, multipleTrans } = this.state;
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
      await this.props.exportTimecard(_trans);
      this.setState({ isLoading: false });

      if (this.props.timecard.exportTimecardSuccess) {
        toast.success(this.props.timecard.exportTimecardSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.timecard.exportTimecard || "",
        };
        downloadAttachments(obj, "timecard");
      }

      if (this.props.timecard.exportTimecardError) {
        handleAPIErr(this.props.timecard.exportTimecardError, this.props);
      }
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //Export Distribution
  exportDistribution = async () => {
    let { tran, multipleTrans } = this.state;
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
      await this.props.exportDistribution(_trans);
      this.setState({ isLoading: false });

      if (this.props.timecard.exportDistributionSuccess) {
        toast.success(this.props.timecard.exportDistributionSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.timecard.exportDistribution || "",
        };
        downloadAttachments(obj, "distribution");
      }

      if (this.props.timecard.exportDistributionError) {
        handleAPIErr(this.props.timecard.exportDistributionError, this.props);
      }
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //Export TPH Payroll
  exportTPHPayroll = async () => {
    let { tran, multipleTrans } = this.state;
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
      await this.props.exportTPHPayroll(_trans);

      if (this.props.timecard.exportTPHPayrollSuccess) {
        toast.success(this.props.timecard.exportTPHPayrollSuccess);
      }
      if (this.props.timecard.exportTPHPayrollError) {
        handleAPIErr(this.props.timecard.exportTPHPayrollError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //Import Timecard
  importTimecard = async (excelData) => {
    this.setState({ isLoading: true });

    await this.props.importTimecard(excelData);

    if (this.props.timecard.importTimecardSuccess) {
      toast.success(this.props.timecard.importTimecardSuccess);
    }
    if (this.props.timecard.importTimecardError) {
      handleAPIErr(this.props.timecard.importTimecardError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearTimecardStates();
  };

  //Move Batch
  moveBatch = async (batchNo) => {
    let { tran, multipleTrans, timecardsList } = this.state;
    if (tran || (multipleTrans && multipleTrans.length > 0)) {
      this.setState({ isLoading: true });

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

      await this.props.moveBatch(_trans, batchNo);

      if (this.props.timecard.moveTimecardBatchSuccess) {
        toast.success(this.props.timecard.moveTimecardBatchSuccess);

        if (Array.isArray(_trans)) {
          timecardsList.map((tl) => {
            _trans.map((t) => {
              if (tl.tran === t) {
                tl.batchNo = batchNo;
              }
            });
          });
        } else {
          let tc = timecardsList.find((el) => el.tran === _trans) || "";
          tc.batchNo = batchNo;
        }
      }

      if (this.props.timecard.moveTimecardBatchError) {
        handleAPIErr(this.props.timecard.moveTimecardBatchError, this.props);
      }
      this.setState({ isLoading: false, timecardsList });
      this.props.clearTimecardStates();
    } else {
      toast.error("Please select Timecard First!");
    }
  };

  //Balance Tax
  balanceTax = async () => {
    this.setState({ isLoading: true });
    await this.props.taxBalance();

    let timecardSuccess = this.props.timecard.taxBalanceSuccess;
    let timecardFail = this.props.timecard.taxBalanceError;

    if (timecardSuccess) {
      return toast.success(timecardSuccess);
    } else {
      return toast.error(timecardFail);
    }

    this.props.clearTimecardStates();
    this.setState({ isLoading: false });
  };

  //Creating New Timecard

  //Update Timecard
  editTimecard = () => {
    //If Timecard belongs to a batch where lock = Locked disable timecard edit or approval\decline\move\delete
    let { tran, batchList, timecardsList, showTallisTabPane } = this.state;

    if (tran) {
      let activeTimeCard = timecardsList.find((tc) => tc.tran === tran) || "";
      let batchObject =
        batchList.find(
          (batchItem) =>
            Number(batchItem.batchNo) === Number(activeTimeCard.batchNo)
        ) || "";
      if (batchObject.lock === "Locked") {
        toast.error(
          "Timecard cannot be updated because its batchNo is locked!"
        );
        return;
      }

      this.props.history.push("/add-edit-timecard", {
        tran,
        tallies: showTallisTabPane,
      });
    }
  };

  render() {
    let userType = localStorage.getItem("userType");
    let {
      showTallisTabPane,
      activeTimecard,
      activeTimecardTallis,
      openSendEFTmodal,
      openResendSTPFilemodal,
      openSendYearEndSTPFilemodal,
      openSendYearEndSTPFile,
      openTimeCardMoreDetail,
      openDeclineTimeCardmodal,
      sortTCListKeyName,
      viewTeam,
      timecardTallies,
      timecardsList,
      timecardListSearch,
      tran,
      attachmentSize,
      attachments,
      previews,
      toggleRightSidebar,
      dropdownZoomingValue,
      batchList,
      approverGroup,
      approverOptions,
      approvers,
      comments,
      exceptions,
      batchNo,
      allowEdit,
    } = this.state;

    let tab = (showTallisTabPane && showTallisTabPane.toLowerCase()) || "";
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            timecards={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={viewTeam}
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
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortTimecardList("employeeName")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="employeeName"
                              name="employeeName"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "employeeName"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="lastName"
                            >
                              Employee Name
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortTimecardList("department")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="department"
                              name="department"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "department"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="department"
                            >
                              Department{" "}
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortTimecardList("position")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="position"
                              name="position"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "position"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="position"
                            >
                              Position{" "}
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortTimecardList("date")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "date"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="date"
                            >
                              Date{" "}
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortTimecardList("group")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="group"
                              name="group"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "group"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="group"
                            >
                              Group{" "}
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortTimecardList("tran")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="tran"
                              name="tran"
                              onChange={() => {}}
                              checked={sortTCListKeyName === "tran"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="tran"
                            >
                              Tran{" "}
                            </label>
                          </div>
                        </Dropdown.Item>
                        {/* <div className="custom-control custom-radio flex-container-inner">
                          <div className="settings_display_row flex__wrapper-inner">
                            <label className="labelwrapper__iner">
                              Display Rows Per Page
                            </label>
                            <input
                              className="form-control input__wrapper--inner"
                              type="number"
                              min="1"
                              defaultValue={10}
                            />
                          </div>
                        </div> */}
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
                      name="timecardListSearch"
                      id="timecardListSearchId"
                      value={timecardListSearch}
                      onChange={(e) =>
                        false
                          ? this.handleChangeNewTCListSearch(e)
                          : this.handleChangeTCListSearch(e)
                      }
                      onKeyDown={(e) =>
                        false
                          ? this.onNewTCListSearch(e)
                          : this.onTCListSearch(e)
                      }
                    />
                  </div>
                </div>
              </div>

              <ul
                className={
                  // Number(0) !== 0
                  // ? usePageLoading === "y"
                  // ? "suppliers_list list__color-bottom"
                  // :
                  "suppliers_list"
                  // : "suppliers_list"
                }
              >
                {timecardsList.map((l, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        l.teamTimecard === "Y"
                          ? timecardsList[i + 1] &&
                            timecardsList[i + 1].teamTimecard &&
                            timecardsList[i + 1].teamTimecard === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : activeTimecard === l.id
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
                              id={"timecard" + i}
                              checked={l.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, l)}
                            />
                            <label
                              htmlFor={"timecard" + i}
                              className="mr-0"
                            ></label>
                          </div>
                        </div>
                        <div
                          onClick={() => this.getTimecardSummary(l)}
                          className="col pl-0"
                        >
                          <div className="invioce_data pr-sm-3">
                            <h4>{l.employeeName}</h4>
                            <div className="row">
                              <div className="col data-i">
                                <p> {l.department}</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{l.position} </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>
                                  <b>Total Hours:</b> {l.totalHours}
                                </p>
                              </div>
                              <div className="col-auto data-i">
                                <p>
                                  <b>Date:</b>{" "}
                                  {l.weekEndingDate
                                    ? l.weekEndingDate.trim()
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p></p>
                              </div>
                              <div className="col-auto data-i">
                                <div className="text-center cursorPointer">
                                  <p
                                    onClick={(e) =>
                                      this.clickHandlerMoredetails(e, l)
                                    }
                                  >
                                    <p className="more-details-color text__underline-wrapper">
                                      more details
                                    </p>
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
              {/* {Number(1) !== 0 ? (
                <div className="pagination__list-custom">
                  <p className="mb__zero">
                    {" "}
                    showing {1} to {1} of {1} entries
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
                    pageCount={1}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    // onPageChange={this.handlePageClick}
                    containerClassName={"pagination cursorPointer"}
                    activeClassName={"active"}
                    // forcePage={page - 1}
                  />
                </div>
              ) : (
                ""
              )} */}
            </aside>
            {/* {/ end /} */}

            <section id="contents" className="supplier pr-0 pt-0">
              <div className="body_content ordermain-padi body__invoice--top">
                <div className="container-fluid pl-0 ">
                  <div className="main_wrapper ">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* Timecard Tallies */}
                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {timecardTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="nav-item cursorPointer"
                                  onClick={
                                    () => this.getTimecardTallies(t.type, true)
                                    // this.checkTCList_API(t, "tallies")
                                  }
                                >
                                  <a
                                    className={
                                      activeTimecardTallis === t.id
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
                        <div className="bg-gry content__elem--style mm_top_nav">
                          <div className="w-100 float-left mm_lr_pad ">
                            <div className="mm_tab_left invoice_left">
                              <div className="tab-content">
                                {tab === "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        onClick={() =>
                                          this.props.history.push(
                                            "/add-edit-timecard",
                                            {
                                              tran: "newTimecard",
                                            }
                                          )
                                        }
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
                                        onClick={this.editTimecard}
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
                                          timecardsList.length > 0
                                            ? this.deleteTimecard()
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
                                          timecardsList.length > 0
                                            ? this.sendForApproval()
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
                                      timecardsList.lenght === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveTimecard}
                                      >
                                        <img
                                          src="images/tick.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Approve </Link>
                                      </li>
                                      <li
                                        onClick={this.holdTimecard}
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
                                        className="cursorPointer"
                                        onClick={this.declineTimeCard}
                                      >
                                        <img
                                          src="images/decline.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link> Decline </Link>
                                      </li>

                                      {allowEdit === "N" ? (
                                        <li
                                          onClick={this.editTimecard}
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/pencill.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Edit </Link>{" "}
                                        </li>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab === "declined" && (
                                  <div
                                    className={
                                      timecardsList.lenght === 0
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
                                          onClick={this.moveTimecard}
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
                                      timecardsList.lenght === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.approveTimecard}
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
                                        onClick={this.declineTimeCard}
                                      >
                                        <img
                                          src="images/decline.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Decline </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "pending" && (
                                  <div
                                    className={
                                      timecardsList.lenght === 0
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
                                          onClick={this.moveTimecard}
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
                                      timecardsList.lenght === 0
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
                                      timecardsList.lenght === 0
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
                                  value={dropdownZoomingValue}
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
                                  onClick={this.moveToNextTimecard}
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
                                  onClick={this.moveToPrevTimecard}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="prev"
                                  />{" "}
                                </Link>

                                <div className="side-attachments-2 height-2 mm_invoice_sidebar2 aside__right--height">
                                  <div
                                    onClick={this.regenerateTimecard}
                                    className="main-sec-attach main-bg"
                                  >
                                    Regenerate
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
                                    {approverOptions.map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i + "timecard"}
                                                name={a.option}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i + "timecard"}>
                                                {" "}
                                              </label>
                                            </div>
                                            <span className="text-mar">
                                              {a.option}{" "}
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
                                        {[].length}
                                      </span>
                                      <span className="fa fa-angle-right"></span>
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Changes_invoice"
                                  >
                                    {[].map((c, i) => {
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
                                    {[].map((a, i) => {
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
                                    {[
                                      "Excel Timecard",
                                      "Excel Distribution",
                                      "TPH Payroll",
                                    ].map((op, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="pl-2 mb-3"
                                          onClick={() => this.hanldeExport(op)}
                                        >
                                          <div className="form-group remember_check d-flex">
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
                                      className="export_crd"
                                      data-toggle="collapse"
                                      data-target="#TPH_Payroll"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      TPH Payroll
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="TPH_Payroll"
                                  >
                                    {[
                                      "Send Reports",
                                      "Lock & Invoice",
                                      "Create and Send EFT/STP Files",
                                      "Send Payslips to employees",
                                      "Post & Upload Data",
                                      "Resend STP File",
                                      "Send Year End STP File",
                                    ].map((name, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="pl-2 mb-3"
                                          onClick={() =>
                                            this.hanldeTPHpayoll(name)
                                          }
                                        >
                                          <div className="form-group remember_check d-flex">
                                            <span className="text-mar cursorPointer ml-38">
                                              {name}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
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
                                    onClick={() =>
                                      this.setState({ openMoveModal: true })
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Move
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
                          toggleRightSidebar
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
                          {timecardsList.length > 0 && (
                            <div
                              id="demo"
                              className={
                                toggleRightSidebar
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
                                {previews.length > 0
                                  ? previews.map((p, i) => {
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

                                {previews.length > 1 && (
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
                            {/*Timecard Attachments */}
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
                                {attachments.length}
                              </span>
                              <span className="fa fa-angle-right"></span>
                              <p className="float-right mr-3">
                                <img
                                  src="images/add.png"
                                  className=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </p>
                            </span>
                          </div>
                          <div
                            className="collapse show"
                            id="Attachments_invoice"
                          >
                            {attachments.map((a, i) => {
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

                          <div className="main-sec-attach main-bg">
                            {/*Timecard Attachments */}
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Exceptions"
                            ></span>
                            <span className="name_attached">
                              Exceptions
                              <span className="ml-3 font-weight-bold">
                                {exceptions.length}
                              </span>
                              {/* <span className="fa fa-angle-right"></span> */}
                              {/* <p className="float-right mr-3">
                                <img
                                  src="images/add.png"
                                  className=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </p> */}
                            </span>
                          </div>
                          <div className="collapse show" id="Exceptions">
                            {exceptions.map((a, i) => {
                              return (
                                <div key={i} className="main-sec-attach1">
                                  <p className="m-clr s-bold mb-0">
                                    {a.userName}
                                  </p>
                                  {a.comment}
                                  <p className="gry-clr mb-0">
                                    {a.date} {a.time}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          {/* Exceptions end */}

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
                            {approverGroup && approverGroup.trim() && (
                              <div className="main-sec-mid">
                                {approverGroup}
                              </div>
                            )}

                            {approvers.map((a, i) => {
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

                          {/* Timecard Comments */}
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
                                {comments.length}
                              </span>
                              <span className="fa fa-angle-right"></span>
                              <a className="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  className=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div className="collapse show" id="Comments_invoice">
                            {comments.map((c, i) => {
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

        <Attachments
          openAttachmentsModal={this.state.openAttachmentsModal}
          closeModal={this.closeModal}
          addAttachment={this.addAttachment}
          attachments={attachments}
          getAttachment={this.getAttachment}
          attachmentSize={attachmentSize}
          draft={tab === "draft" ? true : false} //to hide/show "Drag Files in or Click to Upload" box
        />

        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={comments}
          addComment={this.addComment}
          tab={tab}
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

        <Import
          state={this.state}
          closeModal={this.closeModal}
          onImport={this.importTimecard}
        />

        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Timecards"
          locationProps={this.props}
        />

        <CreateSendEFT
          openSendEFTmodal={openSendEFTmodal}
          closeModal={this.closeModal}
          createEFTFile={this.props.createEFTFile}
          clearTimecardStates={this.props.clearTimecardStates}
          batchNo={batchNo}
        />

        <ResendSTPFile
          stateDate={this.state}
          openResendSTPFilemodal={openResendSTPFilemodal}
          closeModal={this.closeModal}
          resendSTPFile={this.props.resendSTPFile}
          clearTimecardStates={this.props.clearTimecardStates}
        />

        <SendYearEndSTPFile
          openSendYearEndSTPFilemodal={openSendYearEndSTPFilemodal}
          closeModal={this.closeModal}
        />

        <TimeCardMoreDetail
          state={this.state}
          getTimecardSummary={this.getTimecardSummary}
          showTallisTabPane={showTallisTabPane}
          refreshEmployees={this.refreshEmployees}
          updateTimecardSummaryState={this.updateTimecardSummaryState}
          openTimeCardMoreDetail={openTimeCardMoreDetail}
          closeModal={this.closeModal}
        />

        <DeclineTimeCard
          openDeclineTimeCardmodal={openDeclineTimeCardmodal}
          closeModal={this.closeModal}
          tran={tran}
          locationProps={this.props}
          showTallisTabPane={showTallisTabPane}
          getTimecardTallies={this.getTimecardTallies}
          approvers={approvers}
        />

        <Move
          closeModal={this.closeModal}
          stateDate={this.state}
          moveBatch={this.moveBatch}
        />
        <ModileResponsiveMenu props={this.props} active="timecard" />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  timecard: state.timecard,
  setup: state.setup,
});
export default connect(mapStateToProps, {
  getTimecardTallies: TimecardActions.getTimecardTallies,
  getTimecardList: TimecardActions.getTimecardList,
  insertTimecard: TimecardActions.insertTimecard,
  updateTimecard: TimecardActions.updateTimecard,
  getTimecard: TimecardActions.getTimecard,
  getTimecardSummary: TimecardActions.getTimecardSummary,
  updateSummary: TimecardActions.updateSummary,
  deleteTimecard: TimecardActions.deleteTimecard,
  moveTimecard: TimecardActions.moveTimecard,
  declineTimecard: TimecardActions.declineTimecard,
  sendForApproval: TimecardActions.sendForApproval,
  holdTimecard: TimecardActions.holdTimecard,
  approveTimecard: TimecardActions.approveTimecard,
  addAttachment: TimecardActions.addAttachment,
  getAttachmentsList: TimecardActions.getAttachmentsList,
  getEmployeeList: TimecardActions.getEmployeeList,
  refreshEmployees: TimecardActions.refreshEmployees,
  addComment: TimecardActions.addComment,
  regenerateTimecard: TimecardActions.regenerateTimecard,
  sendReports: TimecardActions.sendReports,
  lockAndInvoice: TimecardActions.lockAndInvoice,
  createEFTFile: TimecardActions.createEFTFile,
  sendPayslips: TimecardActions.sendPayslips,
  resendSTPFile: TimecardActions.resendSTPFile,
  moveBatch: TimecardActions.moveBatch,
  exportTimecard: TimecardActions.exportTimecard,
  exportDistribution: TimecardActions.exportDistribution,
  exportTPHPayroll: TimecardActions.exportTPHPayroll,
  importTimecard: TimecardActions.importTimecard,
  postData: TimecardActions.postData,
  getAttachment: TimecardActions.getAttachment,
  taxBalance: TimecardActions.taxBalance,
  getBtachList: SetupActions.getBtachList,
  deleteBatch: SetupActions.deleteBatch,
  updateBatch: SetupActions.updateBatch,
  insertBatch: SetupActions.insertBatch,
  clearSetupStates: SetupActions.clearSetupStates,
  clearTimecardStates: TimecardActions.clearTimecardStates,
})(Timecards);
