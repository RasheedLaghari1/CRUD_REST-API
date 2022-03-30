import React, { Component, Fragment, createContext } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import $ from "jquery";
import { Document, Page } from "react-pdf";
import moment from "moment";
import { toast } from "react-toastify";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import Delete from "../Modals/Delete/Delete";
import Decline from "../Modals/Decline/Decline";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";
import Dropdown from "react-bootstrap/Dropdown";
import Post from "../Modals/Post/Post";
import Import from "../Modals/Import/Import";
import Report from "../Modals/Report/Report";
import { options } from "../../Constants/Constants";
import * as JournalActions from "../../Actions/JournalActions/JournalActions";
import * as SetupActions from "../../Actions/SetupRequest/SetupAction";
import {
  zoomIn,
  zoomOut,
  handleDropdownZooming,
  downloadAttachments,
  handleAPIErr,
} from "../../Utils/Helpers";

const uuidv1 = require("uuid/v1");

class Journals extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      //journal summary
      journalType: "", //draft, pending, declined, all etc
      tran: "", //tran of current selected journal
      multipleTrans: [], //when user selects multiple Journals to perform different functionality
      teamJournal: "",
      viewTeam: "N",
      approvers: [], //a group
      approvalGroup: "",
      approvalOptions: [],
      attachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      comments: [],
      previewList: [],
      rotate: 0,
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      scaling: 3.4,
      dropdownZoomingValue: { label: "40%", value: "40%" },
      journalTallies: [], //e.g Draft, Pending, Approved, etc
      journalListSearch: "", //search on journal list
      getJournalList: [], //side menu (left side) journal list data
      clonedJournalList: [], //a copy of  getJournalList
      activeJournal: "", //to add class active in lists of getting journal (in left side )
      activeJournalTallies: "", //to add class active on journal tallies
      showTalliesTabPane: "", //to add class active on journal tallies below tab pane
      filteredJournalList: [], //this contains filterd list and used for searching

      teamJournalCheck: "", //to check selected journal is team journal or not

      sortJrnlFilter: "journalDate",
      sortJrnlFilterCheck: "ASC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC

      batchList: [],
      batchNo: "", //batch no of current selected batch

      toggleRightSidebar: true,
      openDeleteModal: false,
      openDeclineModal: false,
      openCommentsModal: false,
      openAttachmentsModal: false,
      openImportModal: false,
      openPostModal: false,
    };
  }

  async componentDidMount() {
    this.handleJquery();

    let { viewTeam, sortJrnlFilter, sortJrnlFilterCheck } = this.state;
    //Team journals Check
    viewTeam = localStorage.getItem("teamJournal") || "N";
    //getting default sorting list setting from localstorage
    sortJrnlFilter = localStorage.getItem("sortJrnlFilter") || "journalDate";
    sortJrnlFilterCheck = localStorage.getItem("sortJrnlFilterCheck") || "ASC";

    this.setState({ viewTeam, sortJrnlFilter, sortJrnlFilterCheck });

    let {
      tallies,
      dashboard,
      tallType,
      addEditJournalCheck,
      addEditJournalTran,
    } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (dashboard && tallType) {
      //when user click on journal Tallies on Dashboard
      await this.getJournalTallies(tallType, true);
    } else if (
      tallies &&
      tallies === "Draft" &&
      addEditJournalCheck &&
      addEditJournalTran
    ) {
      /*Check When Edit journal and then user Save or Cancel that edit, 
      then load the same journal user just edited?.*/

      await this.getJournalTallies("Draft", true);
    } else {
      await this.getJournalTallies();
    }
  }

  clearStates = () => {
    this.setState({
      isLoading: false,
      //journal summary
      journalType: "", //draft, pending, declined, all etc
      tran: "", //tran of current selected journal
      multipleTrans: [], //when user selects multiple Journals to perform different functionality
      teamJournal: "",
      approvers: [],
      approvalGroup: "",
      approvalOptions: [],
      attachments: [],
      comments: [],
      previewList: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF

      journalListSearch: "", //search on journal list
      getJournalList: [], //side menu (left side) journal list data
      clonedJournalList: [], //a copy of  getJournalList
      activeJournal: "", //to add class active in lists of getting journal (in left side )
      activeJournalTallies: "", //to add class active on journal tallies
      showTalliesTabPane: "", //to add class active on journal tallies below tab pane
      filteredJournalList: [], //this contains filterd list and used for searching
      openDeleteModal: false,
      openDeclineModal: false,
      openCommentsModal: false,
      openAttachmentsModal: false,
      openImportModal: false,
    });
  };

  //get journal talleis
  getJournalTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined OR after creating new journal etc then update journal Tallies
    this.setState({ isLoading: true });
    let isJournalTallies = false; //to check if redux store containe journal tallies then dont call API again
    let _journalTallies = this.props.journal.journalTallies || [];

    if (_journalTallies.length === 0 || check) {
      await this.props.getJournalTallies(); // get journal Tallies
    } else {
      isJournalTallies = true;
    }
    let journalTally = "";

    let { activeJournalTallies, showTalliesTabPane } = this.state;
    let journalTalliesArr = [];

    //success case of journal tallies
    if (this.props.journal.journalTalliesSuccess || isJournalTallies) {
      // toast.success(this.props.journal.journalTalliesSuccess);
      let journalTallies = this.props.journal.journalTallies || [];
      let tallTypes = [];

      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType == "operator") {
        tallTypes = ["draft", "pending", "declined", "approved", "all"];
      } else if (userType == "approver") {
        tallTypes = [
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      } else if (userType == "op/approver") {
        tallTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      }

      if (tallTypes.length > 0) {
        tallTypes.map((t, i) => {
          let obj = journalTallies.find(
            (tl) => tl.type && tl.type.toLowerCase() === t
          );
          if (obj) {
            journalTalliesArr.push(obj);
          }
        });
      } else {
        journalTalliesArr = journalTallies;
      }

      let _type = "";

      if (type) {
        _type = type;
      } else if (journalTalliesArr.length > 0) {
        _type = journalTalliesArr[0].type;
      }

      journalTalliesArr.map(async (s, i) => {
        if (s.type === _type) {
          let id = uuidv1();
          s.id = id;
          journalTally = s;
          activeJournalTallies = id;
          showTalliesTabPane = s.type;
        } else {
          s.id = uuidv1();
        }
        return s;
      });
    }
    //error case of journal tallies
    if (this.props.journal.journalTalliesError) {
      handleAPIErr(this.props.journal.journalTalliesError, this.props);
    }

    this.setState({
      isLoading: false,
      journalTallies: journalTalliesArr,
      activeJournalTallies,
      showTalliesTabPane,
    });
    if (journalTally) {
      await this.getJournalList(journalTally);
    } else {
      this.props.clearJournalStates();
    }
  };

  //getting the journal list when click on Draft || Pending || Approved etc
  getJournalList = async (data, check) => {
    let activeJournal = "";
    let getJournalList = [];
    let clonedJournalList = [];
    let filteredJournalList = [];

    this.clearStates();
    this.setState({
      isLoading: true,
      activeJournalTallies: data.id,
      showTalliesTabPane: data.type,
      journalListSearch: "",
    });

    let teamJournalCheck = this.state.viewTeam;
    if (teamJournalCheck) {
      data.teamJournals = teamJournalCheck;
    }
    await this.props.getJournalsList(data); // get journal list
    let firstJournal = "";
    //success case of journal List
    if (this.props.journal.getJournalListSuccess) {
      // toast.success(this.props.journal.getJournalListSuccess);
      let _getJournalList = this.props.journal.getJournalList || [];
      // when a user comes form Search page then show the journal comming from Search page
      let { addEditJournalTran, tallies, addEditJournalCheck } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";

      let sortJrnlFilter = this.state.sortJrnlFilter;
      let sortJrnlFilterCheck = this.state.sortJrnlFilterCheck;
      _getJournalList
        .sort((a, b) => {
          if (
            sortJrnlFilter === "voucher" ||
            sortJrnlFilter === "taxAmount" ||
            sortJrnlFilter === "batch"
          ) {
            let valueA = Number(a[sortJrnlFilter]);
            let valueB = Number(b[sortJrnlFilter]);
            //for ascending order
            if (sortJrnlFilterCheck === "ASC") {
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
          } else if (sortJrnlFilter === "journalDate") {
            let valueA = "";
            let valueB = "";

            if (sortJrnlFilter === "date") {
              valueA = new Date(a.date);
              valueB = new Date(b.date);
            } else {
              valueA = new Date(a.approvalDate);
              valueB = new Date(b.approvalDate);
            }

            //for ascending order
            if (sortJrnlFilterCheck === "ASC") {
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
          }
        })
        .map(async (jrnl, i) => {
          if (i == 0) {
            let id = uuidv1();
            jrnl.id = id;
            firstJournal = jrnl;
            jrnl.checked = false;
            activeJournal = id;
          } else {
            jrnl.id = uuidv1();
            jrnl.checked = false;
          }
          jrnl.journalDate = moment(jrnl.journalDate, "DD/M/YYYY")
            .format("DD MMM YYYY")
            .toUpperCase();
          return jrnl;
        });

      getJournalList = _getJournalList;
      clonedJournalList = getJournalList;
      filteredJournalList = getJournalList;

      /*Check When Add/Edit journal and then user Save or Cancel that edit, 
    then load the same  journal user just edited/created?.*/
      if (
        tallies &&
        tallies === "Draft" &&
        addEditJournalCheck &&
        addEditJournalTran
      ) {
        let checkJournal = getJournalList.find(
          (l) => l.tran === addEditJournalTran
        );
        if (checkJournal) {
          firstJournal = checkJournal;
          activeJournal = checkJournal.id;
        }
      }
    }
    //error case of Journal List
    if (this.props.journal.getJournalListError) {
      handleAPIErr(this.props.journal.getJournalListError, this.props);
    }

    this.setState({
      isLoading: false,
      activeJournal,
      getJournalList,
      clonedJournalList,
      filteredJournalList,
    });

    if (firstJournal) {
      //to call get journal baseed on first journal in journal list
      await this.getJournal(firstJournal, true);
    }
    this.props.clearJournalStates();

    // scroll to active journal
    let elmnt = document.getElementById(activeJournal);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  // move to previous journal
  moveToPrevJournal = async () => {
    let { getJournalList, activeJournal } = this.state;
    let foundIndex = getJournalList.findIndex((l) => l.id === activeJournal);

    if (foundIndex !== -1 && foundIndex !== 0) {
      let journal = getJournalList[foundIndex - 1];
      if (journal) {
        await this.getJournal(journal);
      }
    }
  };

  // move to next journal
  moveToNextJournal = async () => {
    let { getJournalList, activeJournal } = this.state;
    let foundIndex = getJournalList.findIndex((l) => l.id === activeJournal);

    if (foundIndex !== -1) {
      let journal = getJournalList[foundIndex + 1];
      if (journal) {
        await this.getJournal(journal);
      }
    }
  };

  //Getting The Single Journal
  getJournal = async (jrnl, check) => {
    let { activeJournal } = this.state;
    //getJournalSummary  will be called when a journal is selected in the List
    if (activeJournal !== jrnl.id || check) {
      this.setState({
        isLoading: true,
        tran: "",
        journalType: "",
        activeJournal: jrnl.id,
        approvers: [],
        approvalGroup: "",
        approvalOptions: [],
        attachments: [],
        attachmentSize: 0,
        comments: [],
        previewList: [],
        numPages: null,
        pageNumber: 1,
        numPagesArr: [], //it contains number of pages of each PDF
      });
      let promises = [];
      //only admin type of users can see batch list
      let userType = localStorage.getItem("userType") || "";
      userType = userType.toLowerCase();
      if (
        userType === "admin" ||
        userType === "sysadmin" ||
        userType === "accounts"
      ) {
        promises.push(this.getBtachList());
      }
      promises.push(this.getJournalSummary(jrnl.tran));

      await Promise.all(promises);

      this.setState({ isLoading: false, journalType: jrnl.journalType });
    }
  };

  //Get Journal Summary
  getJournalSummary = async (tran, type) => {
    await this.props.getJournalSummary(tran);
    //success case of Get Journal Summary
    if (this.props.journal.getJournalSummarySuccess) {
      // toast.success(this.props.journal.getJournalSummarySuccess);

      let journalSummary =
        (this.props.journal.getJournalSummary &&
          JSON.parse(JSON.stringify(this.props.journal.getJournalSummary))) ||
        "";
      let tran = journalSummary.tran || "";
      let previewList = journalSummary.previewList || [];
      let comments = journalSummary.comments || [];
      let attachments = journalSummary.attachments || [];

      let attachmentSize = 0;
      attachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      let approvalOptions = journalSummary.approvalOptions || [];

      approvalOptions.map((a, i) => {
        a.groupName = a.option || "";
        a.checked = false;
        a.id = uuidv1();
        return a;
      });

      let approvalGroup = journalSummary.approvalGroup || "";
      let approvers = journalSummary.approvers || [];

      this.setState(
        {
          tran,
          previewList,
          comments,
          attachments,
          attachmentSize,
          approvers,
          approvalGroup,
          approvalOptions,
        },
        () => {
          let { getJournalList } = this.state;
          let currentActiveJournal = getJournalList.find(
            (l) => l.tran === tran
          );

          //If you have multiple journals ticked and one of them is a team journal, then hide the buttons as well.
          let check = false;
          this.state.multipleTrans.map((t, i) => {
            let jrnl = getJournalList.find((l) => l.tran === t);
            if (
              jrnl &&
              jrnl.teamJournal &&
              jrnl.teamJournal.toLowerCase() === "y"
            ) {
              check = true;
            }
          });

          if (check) {
            this.setState({ teamJournalCheck: "Y" });
          } else {
            this.setState({
              teamJournalCheck: currentActiveJournal.teamJournal,
            });
          }
        }
      );

      //setting the journal zoom
      let journalZoom = localStorage.getItem("journalZoom");

      if (journalZoom) {
        this.handleDropdownZooming({ value: journalZoom });
      }
    }
    //error case of Get Journal Summary
    if (this.props.journal.getJournalSummaryError) {
      handleAPIErr(this.props.journal.getJournalSummaryError, this.props);
    }
    this.props.clearJournalStates();
  };

  // Draft > + New
  insertJournal = async () => {
    let { journalTallies } = this.state;
    this.setState({ isLoading: true });
    await this.props.insertJournal();
    //success case of Insert Journal
    if (this.props.journal.insertJournalSuccess) {
      // toast.success(this.props.journal.insertJournalSuccess);

      let journal =
        (this.props.journal.insertJournal &&
          JSON.parse(JSON.stringify(this.props.journal.insertJournal))) ||
        "";
      let tran = journal.tran || "";
      let amount = journal.amount || "0.00";
      let batch = journal.batch || "";
      let description = journal.description || "";
      let journalDate = journal.date || "";
      journalDate = moment(journalDate).format("DD MMM YYYY").toUpperCase();
      let voucher = journal.voucher || "";

      let accountDetails =
        this.props.user.getAccountDetails.accountDetails || "";
      let userName = accountDetails.userName || "";

      let previewList = journal.previewList || [];
      let comments = journal.comments || [];
      let attachments = journal.attachments || [];

      let attachmentSize = 0;
      attachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      let approvalGroup = journal.approvalGroup || "";
      let approvers = journal.approvers || [];

      let approvalOptions = journal.approvalOptions || [];

      approvalOptions.map((a, i) => {
        a.groupName = a.option || "";
        a.checked = false;
        a.id = uuidv1();
        return a;
      });
      let id = uuidv1();
      //also add newly created journal in the journal List
      let obj = {
        id,
        tran,
        amount,
        batch,
        description,
        journalDate,
        journalType: "Draft",
        teamJournal: "N",
        userName,
        voucher,
      };

      let { getJournalList } = this.state;
      getJournalList = [...getJournalList, obj];

      //also increase the draft tallies count
      journalTallies.map((t, i) => {
        if (t.type.toLowerCase() === "draft") {
          t.count = Number(t.count) + 1;
        }
        return t;
      });
      this.setState({
        activeJournal: id,
        tran,
        previewList,
        comments,
        attachments,
        attachmentSize,
        approvers,
        approvalGroup,
        getJournalList,
        clonedJournalList: getJournalList,
        filteredJournalList: getJournalList,
        journalTallies,
        approvalOptions,
      });
      // scroll to active journal
      var elmnt = document.getElementById(id);
      if (elmnt) {
        elmnt.scrollIntoView();
      }
    }
    //error case of Insert  Journal
    if (this.props.journal.insertJournalError) {
      handleAPIErr(this.props.journal.insertJournalError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearJournalStates();
  };

  //Draft > Edit
  draftEditJournal = async () => {
    let { tran, multipleTrans } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Journal can be edit at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      this.props.history.push("/journal-form", {
        tran: _trans,
      });
    }
  };

  //sorting on journal's list
  handleSortJournalList = async (name) => {
    let { sortJrnlFilterCheck, filteredJournalList, activeJournal } =
      this.state;
    if (this.state.sortJrnlFilter !== name) {
      sortJrnlFilterCheck = "DESC";
    }
    if (sortJrnlFilterCheck === "DESC") {
      sortJrnlFilterCheck = "ASC";
    } else {
      sortJrnlFilterCheck = "DESC";
    }
    localStorage.setItem("sortJrnlFilter", name);
    localStorage.setItem("sortJrnlFilterCheck", sortJrnlFilterCheck);

    const _filteredJournalList = JSON.parse(
      JSON.stringify(filteredJournalList)
    );

    let jrnlListFilterdData = [];
    if (name === "voucher" || name === "taxAmount" || name === "batch") {
      jrnlListFilterdData = _filteredJournalList.sort(function (a, b) {
        let valueA = Number(a[name]);
        let valueB = Number(b[name]);
        //for ascending order
        if (sortJrnlFilterCheck === "ASC") {
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
    } else if (name === "journalDate") {
      jrnlListFilterdData = _filteredJournalList.sort(function (a, b) {
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
        if (sortJrnlFilterCheck === "ASC") {
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
      jrnlListFilterdData = _filteredJournalList.sort(function (a, b) {
        let valueA = a[name].toString().toUpperCase();
        let valueB = b[name].toString().toUpperCase();
        //for ascending order
        if (sortJrnlFilterCheck === "ASC") {
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
    this.setState(
      {
        getJournalList: jrnlListFilterdData,
        sortJrnlFilter: name,
        sortJrnlFilterCheck,
      },
      () => {
        // scroll to active journal
        var elmnt = document.getElementById(activeJournal);
        if (elmnt) {
          elmnt.scrollIntoView();
        }
      }
    );
  };

  //when a user searches on Journal list
  handleChangeJournalListSearch = async (e) => {
    let searchedText = e.target.value;
    this.setState({ journalListSearch: searchedText }, () => {
      const filteredJournalList = JSON.parse(
        JSON.stringify(this.state.filteredJournalList)
      );
      if (!searchedText) {
        let sortJrnlFilterCheck = this.state.sortJrnlFilterCheck;
        if (sortJrnlFilterCheck === "ASC") {
          sortJrnlFilterCheck = "DESC";
        } else {
          sortJrnlFilterCheck = "ASC";
        }
        this.setState(
          { getJournalList: filteredJournalList, sortJrnlFilterCheck },
          () => this.handleSortJournalList(this.state.sortJrnlFilter)
        );
      }
    });
  };

  onJournalListSearch = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let journalListSearch = this.state.journalListSearch.trim();

      if (journalListSearch) {
        const filteredJournalList = JSON.parse(
          JSON.stringify(this.state.filteredJournalList)
        );
        let filteredData = [];
        filteredData = filteredJournalList.filter((c) => {
          return c.batch
            .toString()
            .toUpperCase()
            .includes(journalListSearch.toUpperCase());
        });
        this.setState({ getJournalList: filteredData });
      }
    }
  };

  handleCheckbox = (e, jrnl, index) => {
    let { getJournalList, multipleTrans, tran } = this.state;
    let { checked } = e.target;

    if (checked) {
      jrnl.checked = checked;
      getJournalList[index] = jrnl;
      multipleTrans.push(jrnl.tran);
    } else {
      jrnl.checked = checked;
      getJournalList[index] = jrnl;
      let filteredMultiTrans = multipleTrans.filter((t) => t !== jrnl.tran);
      multipleTrans = filteredMultiTrans;
    }
    this.setState({ getJournalList, multipleTrans }, () => {
      let currentActiveJournal = getJournalList.find((l) => l.tran === tran);

      //If you have multiple journals ticked and one of them is a team journal, then hide the buttons as well.

      let check = false;
      this.state.multipleTrans.map((t, i) => {
        let jrnl = getJournalList.find((l) => l.tran === t);
        if (
          jrnl &&
          jrnl.teamJournal &&
          jrnl.teamJournal.toLowerCase() === "y"
        ) {
          check = true;
        }
      });
      if (check) {
        this.setState({ teamJournalCheck: "Y" });
      } else {
        this.setState({ teamJournalCheck: currentActiveJournal.teamJournal });
      }
    });
  };

  // sendForApproval =>Draft -> send
  sendForApproval = async () => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
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
      await this.props.sendForApproval(_trans); // send For Approval journal
      //success case of send For Approval journal
      if (this.props.journal.sendForApprovalJournalSuccess) {
        // toast.success(this.props.journal.sendForApprovalJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of send For Approval journal
      if (this.props.journal.sendForApprovalJournalError) {
        handleAPIErr(
          this.props.journal.sendForApprovalJournalError,
          this.props
        );
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    } else {
      toast.error("Please select Journal First!");
    }
  };

  approveJournal = async () => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
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
      await this.props.approveJournal(_trans); // approve journal
      //success case of approve journal
      if (this.props.journal.approveJournalSuccess) {
        // toast.success(this.props.journal.approveJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of approve journal
      if (this.props.journal.approveJournalError) {
        handleAPIErr(this.props.journal.approveJournalError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    } else {
      toast.error("Please select Journal First!");
    }
  };

  // copy journal
  copyJournal = async () => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Journal can be Copied at a Time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.copyJournal(_trans); // copy journal
      //success case of copy journal
      if (this.props.journal.copyJournalSuccess) {
        toast.success(this.props.journal.copyJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of copy journal
      if (this.props.journal.copyJournalError) {
        handleAPIErr(this.props.journal.copyJournalError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    }
  };

  //delete Journal
  deleteJournal = async () => {
    let {
      tran,
      multipleTrans,
      getJournalList,
      activeJournal,
      activeJournalTallies,
      showTalliesTabPane,
      journalTallies,
      clonedJournalList,
      filteredJournalList,
    } = this.state;

    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Journal can be Delete at a Time!");
      }
    } else {
      _trans = tran;
    }
    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.deleteJournal(_trans); // delete Journal
      //success case of delete Journal
      if (this.props.journal.deleteJournalSuccess) {
        // toast.success(this.props.journal.deleteJournalSuccess);
        // When deleting an journal --- Can it just highlight the journal above the deleted one?

        if (getJournalList.length === 1) {
          await this.clearStates();
          //decrease the tallies count also
          journalTallies.map((t, i) => {
            if (
              t.type.toLowerCase() === "draft" //delete button only appears in draft section
            ) {
              t.count = 0;
            }
            return t;
          });
          getJournalList = [];
          clonedJournalList = [];
          multipleTrans = [];
          filteredJournalList = [];
        } else if (getJournalList.length > 1) {
          if (_trans === tran) {
            //when user delete the current selected journal
            //there are two cases if the user deletes the first journal in the list then active the very next otherwise highlight journal above the deleted journal
            let foundIndex = getJournalList.findIndex(
              (l) => l.id === activeJournal
            );
            if (foundIndex !== -1 && foundIndex === 0) {
              let jrnl = getJournalList[foundIndex + 1];
              if (jrnl) {
                await this.getJournal(jrnl);
              }
            } else {
              let jrnl = getJournalList[foundIndex - 1];
              if (jrnl) {
                await this.getJournal(jrnl);
              }
            }
            let list = getJournalList.filter((l) => l.tran !== _trans);
            //decrease the tallies count also
            journalTallies.map((t, i) => {
              if (t.type.toLowerCase() === "draft") {
                t.count = list.length;
              }
              return t;
            });

            getJournalList = list;
            clonedJournalList = list;
            filteredJournalList = list;
            multipleTrans = [];
          } else {
            //when user delete other journal by checking the checkbox
            let list = getJournalList.filter((l) => l.tran !== _trans);
            //decrease the tallies count also
            journalTallies.map((t, i) => {
              if (t.type.toLowerCase() === "draft") {
                t.count = list.length;
              }
              return t;
            });
            getJournalList = list;
            clonedJournalList = list;
            filteredJournalList = list;
            multipleTrans = [];
          }
        }
      }
      //error case of delete Journal
      if (this.props.journal.deleteJournalError) {
        handleAPIErr(this.props.journal.deleteJournalError, this.props);
      }
      this.setState({
        isLoading: false,
        activeJournalTallies,
        showTalliesTabPane,
        journalTallies,
        getJournalList,
        clonedJournalList,
        filteredJournalList,
        multipleTrans,
      });
      this.props.clearJournalStates();
    }
  };

  holdJournal = async () => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
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
      await this.props.holdJournal(_trans); // hold journal
      //success case of hold journal
      if (this.props.journal.holdJournalSuccess) {
        // toast.success(this.props.journal.holdJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of hold journal
      if (this.props.journal.holdJournalError) {
        handleAPIErr(this.props.journal.holdJournalError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    } else {
      toast.error("Please select Journal First!");
    }
  };

  //decline Journal
  declineJournal = async (reason) => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
    let _trans = "";
    if (multipleTrans.length > 0) {
      if (multipleTrans.length == 1) {
        _trans = multipleTrans[0];
      } else {
        toast.error("Only One Journal can be Declined at a Time!");
      }
    } else {
      _trans = tran;
    }

    if (_trans) {
      this.setState({
        isLoading: true,
      });
      await this.props.declineJournal(tran, reason); // decline journal
      //success case of decline journal
      if (this.props.journal.declineJournalSuccess) {
        toast.success(this.props.journal.declineJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of decline journal
      if (this.props.journal.declineJournalError) {
        handleAPIErr(this.props.journal.declineJournalError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    }
  };

  //move journal
  moveJournal = async () => {
    let { tran, multipleTrans, showTalliesTabPane } = this.state;
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
      await this.props.moveJournal(_trans); // move journal
      //success case of move journal
      if (this.props.journal.moveJournalSuccess) {
        // toast.success(this.props.journal.moveJournalSuccess);
        await this.getJournalTallies(showTalliesTabPane, true); //to refresh the list
      }
      //error case of move journal
      if (this.props.journal.moveJournalError) {
        handleAPIErr(this.props.journal.moveJournalError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearJournalStates();
    } else {
      toast.error("Please Select Journal First!");
    }
  };

  //add commnet
  addComment = async (comment) => {
    let { tran } = this.state;
    if (tran) {
      if (comment) {
        this.setState({ isLoading: true });
        let data = {
          comment,
          tran,
        };
        await this.props.addComment(data);
        if (this.props.journal.addCommentSuccess) {
          // toast.success(this.props.journal.addCommentSuccess);
          let comments = this.props.journal.addComment || [];
          this.setState({ comments });
        }
        if (this.props.journal.addCommentError) {
          handleAPIErr(this.props.journal.addCommentError, this.props);
        }
        this.props.clearJournalStates();
        this.setState({ isLoading: false });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please select Journal First!");
    }
  };

  //add attachment
  addAttachment = async (attachment, fileName) => {
    let { tran } = this.state;
    if (tran) {
      this.setState({ isLoading: true });
      let data = {
        tran,
        fileName,
        attachment,
      };

      await this.props.addAttachment(data);
      if (this.props.journal.addAttachmentSuccess) {
        toast.success(this.props.journal.addAttachmentSuccess);
        let attachments = this.props.journal.addAttachment || [];

        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        this.setState({ attachments, attachmentSize });
      }
      if (this.props.journal.addAttachmentError) {
        handleAPIErr(this.props.journal.addAttachmentError, this.props);
      }
      this.props.clearJournalStates();

      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select a Journal");
    }
  };

  getAttachment = async (recordID, type, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getAttachment(recordID);
    if (this.props.journal.getAttachmentSuccess) {
      // toast.success(this.props.journal.getAttachmentSuccess);
      let resp = this.props.journal.getAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.journal.getAttachmentError) {
      handleAPIErr(this.props.journal.getAttachmentError, this.props);
    }
    this.props.clearJournalStates();
    this.setState({ isLoading: false });
  };

  //Import Journal
  importJournalForm = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.importJournalForm(excelData);
    if (this.props.journal.importJournalSuccess) {
      toast.success(this.props.journal.importJournalSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.journal.importJournalError) {
      handleAPIErr(this.props.journal.importJournalError, this.props);
    }
    this.props.clearJournalStates();

    this.setState({ isLoading: false });
  };

  openPostModal = () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.openModal("openPostModal");
    } else {
      toast.error("Please Select Journal First!");
    }
  };

  postJournal = async (data) => {
    let { multipleTrans } = this.state;
    let { period, reportID, generateReport } = data;

    let obj = {
      tran: multipleTrans,
      period,
      reportID,
      generateReport: generateReport ? "Y" : "N",
    };
    this.setState({ isLoading: true });
    await this.props.postJournal(obj);
    if (this.props.journal.postJournalSuccess) {
      toast.success(this.props.journal.postJournalSuccess);

      let jsonData = this.props.journal.postJournal.reportJson || "";
      let reportFile = this.props.journal.postJournal.stReport || "";
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
    if (this.props.journal.postJournalError) {
      handleAPIErr(this.props.journal.postJournalError, this.props);
    }
    this.props.clearJournalStates();
    this.setState({ isLoading: false });
  };

  //Export Journal
  exportJournal = async () => {
    let { multipleTrans } = this.state;

    if (multipleTrans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportJournal(multipleTrans);
      this.setState({ isLoading: false });

      if (this.props.journal.exportJournalSuccess) {
        toast.success(this.props.journal.exportJournalSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.journal.exportJournal || "",
        };
        downloadAttachments(obj, "journals");
      }
      if (this.props.journal.exportJournalError) {
        handleAPIErr(this.props.journal.exportJournalError, this.props);
      }
      this.props.clearJournalStates();
    } else {
      toast.error("Please Select Journal First!");
    }
  };

  //Batch Start
  getBtachList = async () => {
    this.setState({ isLoading: true });
    let { batchList } = this.state;
    if (batchList.length > 0) return;
    await this.props.getBtachList("Journals");
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
    let { getJournalList, filteredJournalList } = this.state;

    let batchNo = "";

    const clonedJournalList = JSON.parse(
      JSON.stringify(this.state.clonedJournalList)
    );

    if (e.target.checked) {
      batchNo = bNo;

      let filterdData = clonedJournalList.filter((c) => {
        return Number(c.batch) === Number(bNo);
      });

      getJournalList = filterdData;
      filteredJournalList = filterdData;
    } else {
      //uncheck checkbox
      getJournalList = clonedJournalList;
      filteredJournalList = clonedJournalList;
    }
    this.setState({
      batchNo,
      getJournalList,
      filteredJournalList,
    });
  };

  updateBatch = async (e, batch, index) => {
    let { batchList } = this.state;

    let { name, value } = e.target;

    batch[name] = value;

    let bch = batchList[index];

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
  };

  deleteBatch = async () => {
    let { batchList, batchNo, getJournalList, filteredJournalList } =
      this.state;

    if (batchNo === 0 || batchNo) {
      this.setState({ isLoading: true });
      await this.props.deleteBatch(batchNo);
      if (this.props.setup.deleteBatchSuccess) {
        toast.success(this.props.setup.deleteBatchSuccess);

        batchList = batchList.filter((c) => c.batchNo !== batchNo);
        batchNo = "";

        const clonedJournalList = JSON.parse(
          JSON.stringify(this.state.clonedJournalList)
        );

        getJournalList = clonedJournalList;
        filteredJournalList = clonedJournalList;
      }
      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchList,
        batchNo,
        getJournalList,
        filteredJournalList,
      });
    } else {
      toast.error("Please Select Batch First!");
    }
  };

  // Batch END
  //approvals filter
  handleApprovalsFilters = (e, obj) => {
    let {
      approvalOptions,
      getJournalList,
      filteredJournalList,
      clonedJournalList,
    } = this.state;
    let checked = e.target.checked;
    obj.checked = checked;
    let foundIndex = approvalOptions.findIndex((a) => a.id == obj.id);
    approvalOptions[foundIndex] = obj;

    let check = false;
    let count = 0;
    approvalOptions.map((a, i) => {
      if (!a.checked) {
        count += 1;
      }
    });
    if (approvalOptions.length === count) {
      check = true;
    }
    clonedJournalList = JSON.parse(JSON.stringify(clonedJournalList));
    if (check) {
      //all checkboxes are uncheck

      getJournalList = clonedJournalList;
      filteredJournalList = clonedJournalList;
    } else {
      let filterdData = [];

      approvalOptions.map((a, i) => {
        let filterdList = [];
        if (a.checked) {
          filterdList = clonedJournalList.filter((c) => {
            return (
              c.approvalGroup &&
              c.approvalGroup.toUpperCase() === a.groupName.toUpperCase()
            );
          });
        }
        filterdData.push(...filterdList);
      });
      getJournalList = filterdData;
      filteredJournalList = filterdData;
    }

    this.setState({
      approvalOptions,
      getJournalList,
      filteredJournalList,
    });
  };

  handleJquery = () => {
    //right hand side bar setting with journal Image
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
        let id = document.getElementById("journalListSearchId");
        if (id) {
          document.getElementById("journalListSearchId").focus();
        }
      }
    };

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
  };

  handleRightSidebar = () => {
    this.setState((prevState, props) => ({
      toggleRightSidebar: !prevState.toggleRightSidebar,
    }));
  };

  openModal = async (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({
      [name]: false,
    });
  };

  onLoadSuccessPage = () => {
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
    this.setState({ numPagesArr });
    this.settPreviewArrows();
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

  handlePDFRotate = () => {
    this.setState({ rotate: this.state.rotate + 90 });
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
        localStorage.setItem("journalZoom", zoom);

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
        localStorage.setItem("journalZoom", zoom);

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

    localStorage.setItem("journalZoom", value);

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

  //call get journal list API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamJournal", check);
    this.setState({ viewTeam: check }, () => {
      let { activeJournalTallies, showTalliesTabPane } = this.state;
      let obj = {
        id: activeJournalTallies,
        type: showTalliesTabPane,
      };
      this.getJournalList(obj);
    });
  };

  render() {
    let {
      showTalliesTabPane,
      journalTallies,
      getJournalList,
      activeJournal,
      sortJrnlFilter,
      journalListSearch,
      attachments,
      comments,
      approvalGroup,
      approvers,
      approvalOptions,
      previewList,
      toggleRightSidebar,
      viewTeam,
      isLoading,
      rotate,
      pageNumber,
      numPages,
      scaling,
      batchList,
      batchNo,
      teamJournalCheck,
    } = this.state;

    let userType = localStorage.getItem("userType");
    let approverCheck = false;
    let checkTwo = false;
    if (userType) {
      if (userType.toLowerCase() === "approver") {
        approverCheck = true;
      }
    }
    let tab = (showTalliesTabPane && showTalliesTabPane.toLowerCase()) || "";
    if (tab) {
      if (tab === "pending" || tab === "declined") {
        //when tab is pending or declined then everything is read only for Approver
        if (approverCheck) {
          checkTwo = true;
        }
      }
    }

    let isAdmin = false;
    if (
      userType === "admin" ||
      userType === "sysadmin" ||
      userType === "accounts"
    ) {
      isAdmin = true;
    }
    return (
      <>
        {isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            journal={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={this.state.viewTeam}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content dash__invoice--content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu journal*/}
            <aside
              className="side-nav suppliers_side_nav side__content--invoice"
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
                  <div className="col-auto pr-md-0 align-self-center">
                    <Dropdown
                      alignRight={false}
                      drop="down"
                      className="analysis-card-dropdwn custom-my-radio user_drop_options"
                    >
                      <Dropdown.Toggle variant="sucess" id="dropdown-basic">
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            className="custom-control custom-radio flex-container-inner"
                            onClick={() =>
                              this.handleSortJournalList("taxAmount")
                            }
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="taxAmount"
                              name="taxAmount"
                              onChange={() => {}}
                              checked={sortJrnlFilter === "taxAmount"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="taxAmount"
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
                            className="custom-control custom-radio flex-container-inner"
                            onClick={() => this.handleSortJournalList("batch")}
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="batch"
                              name="batch"
                              onChange={() => {}}
                              checked={sortJrnlFilter === "batch"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="batch"
                            >
                              Batch
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            className="custom-control custom-radio flex-container-inner"
                            onClick={() =>
                              this.handleSortJournalList("userName")
                            }
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="userName"
                              name="userName"
                              onChange={() => {}}
                              checked={sortJrnlFilter === "userName"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="userName"
                            >
                              User
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item to="#/action-1" className="">
                          <div
                            onClick={() =>
                              this.handleSortJournalList("voucher")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="voucher"
                              name="voucher"
                              onChange={() => {}}
                              checked={sortJrnlFilter === "voucher"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="voucher"
                            >
                              Voucher
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortJournalList("journalDate")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="journalDate"
                              name="journalDate"
                              onChange={() => {}}
                              checked={sortJrnlFilter === "journalDate"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="journalDate"
                            >
                              Date
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
                      name="journalListSearch"
                      id="journalListSearchId"
                      value={journalListSearch}
                      onChange={this.handleChangeJournalListSearch}
                      onKeyDown={this.onJournalListSearch}
                    />
                  </div>
                </div>
              </div>
              <ul className="suppliers_list">
                {getJournalList.map((j, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        j.teamJournal === "Y"
                          ? getJournalList[i + 1] &&
                            getJournalList[i + 1].teamJournal &&
                            getJournalList[i + 1].teamJournal === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : activeJournal === j.id
                          ? "active cursorPointer"
                          : "cursorPointer"
                      }
                      id={j.id}
                    >
                      <div className="row">
                        <div className="col-auto mb-2 pr-0">
                          <div className="form-group remember_check">
                            <input
                              type="checkbox"
                              id={"journal" + i}
                              checked={j.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, j, i)}
                            />
                            <label
                              htmlFor={"journal" + i}
                              className="mr-0"
                            ></label>
                          </div>
                        </div>
                        <div
                          className="col pl-0"
                          onClick={() => this.getJournal(j)}
                        >
                          <div className="invioce_data pr-sm-3">
                            <h4>{j.description} </h4>
                            <div className="row">
                              <div className="col data-i">
                                <p>{j.voucher}</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{j.journalDate}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>{j.batch}</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{j.userName}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>{j.amount}</p>
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
                  <div className="main_wrapper " id="order--dynamic--height">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* journal Tallies */}
                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {journalTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="cursorPointer nav-item"
                                  onClick={() =>
                                    this.getJournalTallies(t.type, true)
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activeJournalTallies === t.id
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
                                {tab === "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={this.insertJournal}
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
                                          getJournalList.length > 0
                                            ? this.draftEditJournal()
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
                                          getJournalList.length > 0
                                            ? this.copyJournal()
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
                                      {teamJournalCheck !== "Y" ? (
                                        <>
                                          <li
                                            onClick={() =>
                                              getJournalList.length > 0
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
                                              getJournalList.length > 0
                                                ? this.sendForApproval()
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
                                {tab === "approve" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {teamJournalCheck !== "Y" ? (
                                        <>
                                          <li
                                            onClick={this.approveJournal}
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
                                            onClick={this.holdJournal}
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
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab === "declined" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!approverCheck && (
                                      <ul>
                                        {teamJournalCheck !== "Y" ? (
                                          <li
                                            onClick={this.moveJournal}
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
                                {tab === "hold" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {teamJournalCheck !== "Y" ? (
                                        <>
                                          <li
                                            onClick={this.approveJournal}
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
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab === "pending" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!approverCheck && (
                                      <ul>
                                        {teamJournalCheck !== "Y" ? (
                                          <li
                                            onClick={this.moveJournal}
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
                                            getJournalList.length > 0
                                              ? this.copyJournal()
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
                                      </ul>
                                    )}
                                  </div>
                                )}
                                {tab === "approved" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {!approverCheck && (
                                        <li
                                          onClick={() =>
                                            getJournalList.length > 0
                                              ? this.copyJournal()
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
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {tab === "all" && (
                                  <div
                                    className={
                                      1 === 0
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
                                  onClick={this.moveToNextJournal}
                                >
                                  <img
                                    src="images/arow-r.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    // href="#demo"
                                    data-slide="next"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mtop-1"
                                  onClick={this.moveToPrevJournal}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    // href="#demo"
                                    data-slide="prev"
                                  />{" "}
                                </Link>
                                <div className="side-attachments-2 height-2 mm_order_sidebar aside__right--height">
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
                                    {approvalOptions.map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i}
                                                name={a.option}
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
                                              {a.option}{" "}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Changes"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                    >
                                      Changes
                                      <span className="ml-3 font-weight-bold">
                                        0
                                      </span>
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Changes">
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
                                  </div> */}
                                  {/* <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Activity"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                    >
                                      Activity
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Activity">
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
                                  </div> */}
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
                                      className="pl-2 mb-3"
                                      onClick={this.exportJournal}
                                    >
                                      <div className="form-group remember_check d-flex">
                                        <span className="text-mar cursorPointer ml-38">
                                          EXCEL
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
                                                          this.updateBatch(
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
                                                    <td>{b.batchNo}</td>
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
                          {getJournalList.length > 0 && (
                            <div
                              id="demo"
                              className={
                                toggleRightSidebar
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
                                {previewList.length > 0
                                  ? previewList.map((p, i) => {
                                      return (
                                        <div
                                          className={
                                            i === 0
                                              ? "carousel-item active "
                                              : "carousel-item "
                                          }
                                          id={i}
                                          key={i}
                                        >
                                          <div className="text-center">
                                            <div className="invoice_pdf_canvas invoice_pdf_new pdf--buttons pdf__height--content doc-main-page">
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
                                                    rotate={rotate}
                                                  >
                                                    <Page
                                                      pageNumber={pageNumber}
                                                      scale={scaling}
                                                      height={372}
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
                                                      {pageNumber} of {numPages}
                                                    </span>
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
                                {previewList.length > 1 && (
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
                            {/* Journal Attachments */}
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
                                {attachments.length}
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
                            {attachments.map((a, i) => {
                              return (
                                <div
                                  onClick={() =>
                                    this.getAttachment(
                                      a.recordID,
                                      a.fileType,
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
                            {approvalGroup.trim() && (
                              <div className="main-sec-mid">
                                {approvalGroup}
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
                          {/* Journal Comments */}
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
                                {this.state.comments.length}
                              </span>
                              <a className="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  className=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div className="collapse show" id="Comments">
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

        <Decline
          openDeclineModal={this.state.openDeclineModal}
          closeModal={this.closeModal}
          onDecline={this.declineJournal}
        />
        <Attachments
          openAttachmentsModal={this.state.openAttachmentsModal}
          closeModal={this.closeModal}
          addAttachment={this.addAttachment}
          attachments={this.state.attachments}
          attachmentSize={this.state.attachmentSize}
          getAttachment={this.getAttachment}
          draft={tab === "draft" ? true : false} //to hide/show "Drag Files in or Click to Upload" box
        />
        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={this.state.comments}
          addComment={this.addComment}
          tab={tab}
        />
        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
        />
        <Changes
          openChangesModal={this.state.openChangesModal}
          closeModal={this.closeModal}
        />
        <Import
          state={this.state}
          closeModal={this.closeModal}
          onImport={this.importJournalForm}
        />

        <Post
          openPostModal={this.state.openPostModal}
          closeModal={this.closeModal}
          postType="Journals"
          onSave={this.postJournal}
          locationProps={this.props}
        />
        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Journals"
          locationProps={this.props}
        />
        <Delete
          openDeleteModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          onDelete={this.deleteJournal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  journal: state.journal,
  user: state.user,
  setup: state.setup,
});

export default connect(mapStateToProps, {
  getJournalTallies: JournalActions.getJournalTallies,
  getJournalsList: JournalActions.getJournalsList,
  getJournal: JournalActions.getJournal,
  getJournalSummary: JournalActions.getJournalSummary,
  updateJournal: JournalActions.updateJournal,
  insertJournal: JournalActions.insertJournal,
  sendForApproval: JournalActions.sendForApproval,
  copyJournal: JournalActions.copyJournal,
  deleteJournal: JournalActions.deleteJournal,
  addComment: JournalActions.addComment,
  holdJournal: JournalActions.holdJournal,
  declineJournal: JournalActions.declineJournal,
  approveJournal: JournalActions.approveJournal,
  addAttachment: JournalActions.addAttachment,
  getAttachment: JournalActions.getAttachment,
  insertJournal: JournalActions.insertJournal,
  importJournalForm: JournalActions.importJournalForm,
  postJournal: JournalActions.postJournal,
  exportJournal: JournalActions.exportJournal,
  moveJournal: JournalActions.moveJournal,
  getBtachList: SetupActions.getBtachList,
  deleteBatch: SetupActions.deleteBatch,
  updateBatch: SetupActions.updateBatch,
  clearSetupStates: SetupActions.clearSetupStates,
  clearJournalStates: JournalActions.clearJournalStates,
})(Journals);
