import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import $ from "jquery";
import { Document, Page } from "react-pdf";
import FileSaver from "file-saver";

import Delete from "../Modals/Delete/Delete";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";
import Activity from "../Modals/Activity/Activity";

import * as DocumentActions from "../../Actions/DocumentActions/DocumentActions";
import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";
import {
  handleAPIErr,
  zoomIn,
  zoomOut,
  handleDropdownZooming,
  downloadAttachments,
} from "../../Utils/Helpers";
import { options } from "../../Constants/Constants";

const uuidv1 = require("uuid/v1");

class Documents extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      tran: "", //tran of current selected Docmunet
      multipleTrans: [], //when user selects multiple Documents to perform different functionality

      documentsTallies: [], //e.g Draft, Pending, Approved, etc
      docListSearch: "", //search on DOC list
      getDocList: [], //side menu (left side) DOC list data
      clonedgetDocList: [], //a copy of  getDocList
      activeDoc: "", //to add class active in lists of getting DOC (in left side )
      activeDocTallis: "", //to add class active on DOC tallis
      showDocTallisTabPane: "", //to add class active on Doc tallis below tab pane
      filteredDocList: [], //this contains filterd list and used for searching on it
      approverGroup: "",
      approvalsGroups: [],
      approvers: [], //to just show on side menuw bar
      previews: [],
      rotate: 0,
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      docComments: [],
      docAttachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      docActivity: [],
      sortFilterDoc: "type",
      sortFilterDocCheck: "ASC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC
      openAttachmentsModal: false,
      openCommentsModal: false,
      openDeleteModal: false,
      openActivityModal: false,
      viewTeam: "N",
      teamDocCheck: "", //to check selected document is team document or not

      scaling: 3.4,
      dropdownZoomingValue: { label: "40%", value: "40%" },
      toggleRightSidebar: true,
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
          $(".documents_attatchments1").removeClass("wid-0");
        }
        if ($(window).width() <= 991) {
          this.setState({ toggleRightSidebar: false });
          $(".documents_attatchments1").addClass("wid-0");
        }
      },
      false
    );
    // end
    //focus search input field by pressing Tab key
    // document.onkeydown = function (evt) {
    //   evt = evt || window.event;
    //   if (evt.keyCode == 9) {
    //     evt.preventDefault();
    //     let id = document.getElementById("docListSearchId");
    //     if (id) {
    //       document.getElementById("docListSearchId").focus();
    //     }
    //   }
    // };

    let { sortFilterDoc, sortFilterDocCheck, viewTeam } = this.state;

    sortFilterDoc = localStorage.getItem("sortFilterDoc") || sortFilterDoc;
    sortFilterDocCheck =
      localStorage.getItem("sortFilterDocCheck") || sortFilterDocCheck;

    //Team Document Check
    viewTeam = localStorage.getItem("teamDocuments") || viewTeam;

    this.setState({ sortFilterDoc, sortFilterDocCheck, viewTeam });

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

    // sideBarAccord
    $(".invoice-inherit").click(function () {
      $(".invoice-inherit .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });

    // end

    $(".icon_dots").click(function () {
      $(".documents_attatchments2").toggleClass("doc_sidebar2");
    });
    $(".cus-arro-div2").on("click", function (e) {
      e.preventDefault();
      $(".invoice_pdf_canvas").toggleClass("dicrease_invoice_pdf");
    });
    // end

    let { dashboard, tallType, tallies, addEditDocCheck, docTran } =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (dashboard && tallType) {
      //when user click on Document Tallies on Dashboard
      await this.getDocumentTallies(tallType, true); // get Document Tallies
    } else if (tallies && tallies === "Draft" && addEditDocCheck && docTran) {
      /*Check When Add/Edit Document and then user Save or Cancel that edit, 
      then load the same  Document user just edited/created?.*/
      await this.getDocumentTallies("Draft", true);
    } else {
      await this.getDocumentTallies();
    }
  }

  //get document talleis
  getDocumentTallies = async (type, check) => {
    //check -> when a user Perform some actions like send for approval, Approve, Declined etc then updated Document Tallies
    this.setState({ isLoading: true });

    let isDocTallies = false; //to check if redux store contain Doc tallies then dont call API again
    let _docTallies = this.props.document.documentsTallies || [];

    if (_docTallies.length === 0 || check) {
      await this.props.getDocumentTallies(); //get Document Tallies
    } else {
      isDocTallies = true;
    }

    let docTally = "";
    let { activeDocTallis, showDocTallisTabPane } = this.state;
    let docTalliesArr = [];

    //success case of DOC tallies
    if (this.props.document.getDocumentsTalliesSuccess || isDocTallies) {
      // toast.success(this.props.document.getDocumentsTalliesSuccess);
      let documentsTallies = this.props.document.documentsTallies || [];
      let docTypes = [];

      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType == "operator") {
        docTypes = ["draft", "pending", "declined", "approved", "all"];
      } else if (userType == "approver") {
        docTypes = [
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      } else if (userType == "op/approver") {
        docTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      }

      if (docTypes.length > 0) {
        docTypes.map((t, i) => {
          let obj = documentsTallies.find(
            (tl) => tl.docState && tl.docState.toLowerCase() === t
          );
          if (obj) {
            docTalliesArr.push(obj);
          }
        });
      } else {
        docTalliesArr = documentsTallies;
      }

      let _type = "";

      if (type) {
        _type = type;
      } else if (docTalliesArr.length > 0) {
        _type = docTalliesArr[0].docState;
      }

      docTalliesArr.map(async (t, i) => {
        if (t.docState === _type) {
          let id = uuidv1();
          t.id = id;
          docTally = t;
          activeDocTallis = id;
          showDocTallisTabPane = t.docState;
        } else {
          t.id = uuidv1();
        }
        return t;
      });
    }
    //error case of DOC tallies
    if (this.props.document.getDocumentsTalliesError) {
      handleAPIErr(this.props.document.getDocumentsTalliesError, this.props);
    }

    this.setState({
      isLoading: false,
      documentsTallies: docTalliesArr,
      activeDocTallis,
      showDocTallisTabPane,
    });
    if (docTally) {
      //to call getDocumentsList baseed on first DOC tallies
      await this.getDocumentsList(docTally); //docTally => draft || pending || approved || hold || all etc
    }
    this.props.clearDocumentStates();
  };

  //getting the Documents list when click on Draft || Pending || Approved etc
  getDocumentsList = async (data) => {
    let activeDoc = "";
    let getDocList = [];
    let clonedgetDocList = [];
    let filteredDocList = [];

    this.clearStates();
    this.setState({
      isLoading: true,
      activeDocTallis: data.id,
      showDocTallisTabPane: data.docState,
      docListSearch: "",
    });

    let teamDocCheck = this.state.viewTeam;
    if (teamDocCheck) {
      data.teamDocuments = teamDocCheck;
    }
    await this.props.getDocumentsList(data); // get DOC list

    let firstDoc = "";
    //success case of get DOC List
    if (this.props.document.getDocumentsListSuccess) {
      // toast.success(this.props.document.getDocumentsListSuccess);
      let _getDocList = this.props.document.getDocumentsList || [];

      let sortFilterDoc = this.state.sortFilterDoc || "";
      let sortFilterDocCheck = this.state.sortFilterDocCheck;
      _getDocList
        .sort((a, b) => {
          if (sortFilterDoc === "tran") {
            let valueA = Number(a[sortFilterDoc]);
            let valueB = Number(b[sortFilterDoc]);
            //for ascending order
            if (sortFilterDocCheck === "ASC") {
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
          } else if (sortFilterDoc === "date") {
            let valueA = new Date(a.date);
            let valueB = new Date(b.date);

            //for ascending order
            if (sortFilterDocCheck === "ASC") {
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
          } else if (sortFilterDoc) {
            let valueA = a[sortFilterDoc].toString().toUpperCase();
            let valueB = b[sortFilterDoc].toString().toUpperCase();
            //for ascending order
            if (sortFilterDocCheck === "ASC") {
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
        .map(async (doc, i) => {
          if (i == 0) {
            let id = uuidv1();
            doc.id = id;
            firstDoc = doc;
            doc.checked = false;
            activeDoc = id;
          } else {
            doc.id = uuidv1();
            doc.checked = false;
          }
          return doc;
        });
      getDocList = _getDocList;
      clonedgetDocList = _getDocList;
      filteredDocList = _getDocList;

      /*Check When  Add/Edit Document  and then user Save or Cancel that edit, 
      then load the same Document user just created/edited?.*/

      let { tallies, addEditDocCheck, docTran } =
        (this.props.history &&
          this.props.history.location &&
          this.props.history.location.state) ||
        "";

      if (tallies && tallies === "Draft" && addEditDocCheck && docTran) {
        let checkDoc = getDocList.find((l) => l.tran === docTran);
        if (checkDoc) {
          firstDoc = checkDoc;
          activeDoc = checkDoc.id;
        }
      }
    }
    //error case of get DOC List
    if (this.props.document.getDocumentsListError) {
      handleAPIErr(this.props.document.getDocumentsListError, this.props);
    }
    this.props.clearDocumentStates();
    this.setState({
      activeDoc,
      getDocList,
      clonedgetDocList,
      filteredDocList,
      isLoading: false,
    });
    if (firstDoc) {
      // to call get Document baseed on first Document in  list
      await this.getDocument(firstDoc, true);
    }
    this.props.clearDocumentStates();
    // scroll to active Document
    var elmnt = document.getElementById(this.state.activeDoc);
    if (elmnt) {
      elmnt.scrollIntoView();
    }
  };

  //getting the single Document
  getDocument = async (doc, check) => {
    if (this.state.activeDoc != doc.id || check) {
      this.setState({
        isLoading: true,
        activeDoc: doc.id,
        tran: "",
        rotate: 0,
        previews: [],
        numPages: null,
        pageNumber: 1,
        numPagesArr: [], //it contains number of pages of each PDF
        docComments: [],
        docAttachments: [],
        attachmentSize: 0,
        docActivity: [],
      });
      await this.props.getDocument(doc.tran); // get document
      //success case of get document
      if (this.props.document.getDocumentSuccess) {
        // toast.success(this.props.document.getDocumentSuccess);

        let docDetails =
          (this.props.document.getDocument &&
            this.props.document.getDocument &&
            JSON.parse(JSON.stringify(this.props.document.getDocument))) ||
          "";

        let approverGroup = docDetails.approverGroup || "";

        let approvalsGroups =
          (docDetails &&
            JSON.parse(JSON.stringify(docDetails.approvalOptions))) ||
          [];
        approvalsGroups.map((a, i) => {
          a.checked = false;
          a.id = uuidv1();
          return a;
        });

        let tran = (docDetails && docDetails.tran) || "";

        let approvers = (docDetails && docDetails.approvers) || [];

        let previews =
          (this.props.document &&
            this.props.document.getDocument &&
            this.props.document.getDocument.previews) ||
          [];

        //to show primary PDF first
        previews = previews.sort((a, b) =>
          a.primaryDoc.toLowerCase() < b.primaryDoc.toLowerCase() ? 1 : -1
        );

        let docAttachments = (docDetails && docDetails.attachments) || [];
        let attachmentSize = 0;
        docAttachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });

        let docComments = (docDetails && docDetails.comments) || [];

        let docActivity = (docDetails && docDetails.activity) || [];

        this.setState({
          tran,
          approverGroup,
          approvalsGroups,
          docAttachments,
          attachmentSize,
          docComments,
          approvers,
          previews,
          docActivity,
        });
      }
      //error case of get document
      if (this.props.document.getDocumentError) {
        handleAPIErr(this.props.document.getDocumentError, this.props);
      }
      this.props.clearDocumentStates();
      this.setState({ isLoading: false });
    }
  };

  //call getDocumentsList API
  toggleTeamIcon = (check) => {
    localStorage.setItem("teamDocuments", check);
    this.setState({ viewTeam: check }, () => {
      let { activeDocTallis, showDocTallisTabPane } = this.state;
      let obj = {
        id: activeDocTallis,
        docState: showDocTallisTabPane,
      };
      this.getDocumentsList(obj);
    });
  };

  //when a user searches on Documents list
  handleChangeDocListSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ docListSearch: searchedText }, () => {
      const filteredDocList = JSON.parse(
        JSON.stringify(this.state.filteredDocList)
      );
      if (!searchedText) {
        this.setState({ getDocList: filteredDocList }, () => {
          // scroll to active Document
          var elmnt = document.getElementById(this.state.activeDoc);
          if (elmnt) {
            elmnt.scrollIntoView();
          }
          // let sortFilterDocCheck = this.state.sortFilterDocCheck;

          // if (sortFilterDocCheck === "ASC") {
          //   sortFilterDocCheck = "DESC";
          // } else {
          //   sortFilterDocCheck = "ASC";
          // }
          // await this.setState({ sortFilterDocCheck });

          // await this.handleSortDocumentsList(this.state.sortFilterDoc);
        });
      }
    });
  };

  onDocListSearch = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let docListSearch = this.state.docListSearch.trim();

      if (docListSearch) {
        const filteredDocList = JSON.parse(
          JSON.stringify(this.state.filteredDocList)
        );

        let docListFilterdData = [];
        docListFilterdData = filteredDocList.filter((c) => {
          return (
            c.type.toUpperCase().includes(docListSearch.toUpperCase()) ||
            c.description.toUpperCase().includes(docListSearch.toUpperCase())
          );
        });
        this.setState({ getDocList: docListFilterdData });
      }
    }
  };

  //Draft-> Add
  addDocument = async () => {
    this.props.history.push("/documents-form", {
      tran: "addNewdocument",
    });
  };

  //Draft-> Edit
  updateDocument = async () => {
    this.props.history.push("/documents-form", {
      tran: this.state.tran,
    });
  };

  //adding comment to the document
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
        if (this.props.document.addDocCommentSuccess) {
          // toast.success(this.props.document.addDocCommentSuccess);
          let docComments = this.props.document.addDocComments || [];
          this.setState({ docComments });
        }
        //Error Case Of Adding Comment
        if (this.props.document.addDocCommentError) {
          handleAPIErr(this.props.document.addDocCommentError, this.props);
        }
        this.props.clearDocumentStates();
        this.setState({ isLoading: false });
      } else {
        toast.error("Please Enter Comment!");
      }
    } else {
      toast.error("Please select Document First!");
    }
  };

  //Delete Document
  deleteDocument = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.deleteDocument(tran); // delete document
      //success case of delete document
      if (this.props.document.deleteDocumentSuccess) {
        // toast.success(this.props.document.deleteDocumentSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of delete document
      if (this.props.document.deleteDocumentError) {
        handleAPIErr(this.props.document.deleteDocumentError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    }
  };

  //sendDocForApproval =>Draft -> send
  sendDocForApproval = async () => {
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

      await this.props.sendDocForApproval(_trans); // send Doc For Approval
      //success case of send Doc For Approval
      if (this.props.document.sendDocForApprovalSuccess) {
        toast.success(this.props.document.sendDocForApprovalSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of send Doc For Approval
      if (this.props.document.sendDocForApprovalError) {
        handleAPIErr(this.props.document.sendDocForApprovalError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    } else {
      toast.error("Please select Document First!");
    }
  };

  // Approve Document => Approve -> Approve
  approveDocument = async () => {
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
      await this.props.approveDocument(_trans); // approve document
      //success case of approve document
      if (this.props.document.approveDocSuccess) {
        toast.success(this.props.document.approveDocSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of approve document
      if (this.props.document.approveDocError) {
        handleAPIErr(this.props.document.approveDocError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    } else {
      toast.error("Please select Document First!");
    }
  };

  // Approve Document => Approve -> Decline
  declineDocument = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.declineDocument(tran); // decline document
      //success case of decline document
      if (this.props.document.declineDocSuccess) {
        toast.success(this.props.document.declineDocSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of decline document
      if (this.props.document.declineDocError) {
        handleAPIErr(this.props.document.declineDocError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    } else {
      toast.error("Please select Document First!");
    }
  };

  //Hold Document
  holdDocument = async () => {
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

      await this.props.holdDocument(_trans); // hold document
      //success case of hold document
      if (this.props.document.holdDocumentSuccess) {
        toast.success(this.props.document.holdDocumentSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of hold document
      if (this.props.document.holdDocumentError) {
        handleAPIErr(this.props.document.holdDocumentError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    } else {
      toast.error("Please Select Document First!");
    }
  };

  //Move Document
  moveDocument = async () => {
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

      await this.props.moveDocument(_trans); // move document
      //success case of move document
      if (this.props.document.moveDocumentSuccess) {
        toast.success(this.props.document.moveDocumentSuccess);
        await this.getDocumentTallies(this.state.showDocTallisTabPane, true); //to refresh the list
      }
      //error case of move document
      if (this.props.document.moveDocumentError) {
        handleAPIErr(this.props.document.moveDocumentError, this.props);
      }
      this.setState({ isLoading: false });

      this.props.clearDocumentStates();
    } else {
      toast.error("Please Select Document First!");
    }
  };

  //add Document Attachments
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
      await this.props.addDocAttachments(obj);
      if (this.props.document.addDocAttachmentSuccess) {
        toast.success(this.props.document.addDocAttachmentSuccess);
        let docAttachments = this.props.document.addDocAttachment || [];

        let attachmentSize = 0;
        docAttachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });

        this.setState({ docAttachments, attachmentSize });
      }
      if (this.props.document.addDocAttachmentError) {
        handleAPIErr(this.props.document.addDocAttachmentError, this.props);
      }
      this.props.clearDocumentStates();

      this.setState({ isLoading: false });
    }
  };

  //Get Document Attachment
  getAttachment = async (fileID, type, fileName) => {
    if (fileID) {
      this.setState({ isLoading: true });

      await this.props.getAttachment(fileID);
      if (this.props.document.getDocAttachmentSuccess) {
        // toast.success(this.props.document.getDocAttachmentSuccess);
        let resp = this.props.document.getDocAttachment;
        downloadAttachments(resp, fileName);
      }
      if (this.props.document.getDocAttachmentError) {
        handleAPIErr(this.props.document.getDocAttachmentError, this.props);
      }
      this.props.clearDocumentStates();
      this.setState({ isLoading: false });
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
    const clonedgetDocList = JSON.parse(
      JSON.stringify(this.state.clonedgetDocList)
    );

    if (check) {
      //all checkboxes are uncheck
      this.setState(
        {
          getDocList: clonedgetDocList,
          filteredDocList: clonedgetDocList,
        },
        () => this.handleSortDocumentsList(this.state.sortFilterDoc)
      );
    } else {
      let filterdData = [];

      approvalsGroups.map((a, i) => {
        let docListFilterdData = [];
        if (a.checked) {
          docListFilterdData = clonedgetDocList.filter((c) => {
            return (
              c.approvalGroup &&
              c.approvalGroup.toUpperCase() === a.approvalGroup.toUpperCase()
            );
          });
        }
        filterdData.push(...docListFilterdData);
      });

      this.setState(
        {
          getDocList: filterdData,
          filteredDocList: filterdData,
        },
        () => this.handleSortDocumentsList(this.state.sortFilterDoc)
      );
    }
  };

  //sorting on documents list
  handleSortDocumentsList = async (name) => {
    let { sortFilterDocCheck } = this.state;
    if (this.state.sortFilterDoc != name) {
      sortFilterDocCheck = "DESC";
    }

    if (sortFilterDocCheck === "DESC") {
      sortFilterDocCheck = "ASC";
    } else {
      sortFilterDocCheck = "DESC";
    }

    localStorage.setItem("sortFilterDoc", name);
    localStorage.setItem("sortFilterDocCheck", sortFilterDocCheck);

    const filteredDocList = JSON.parse(
      JSON.stringify(this.state.filteredDocList)
    );
    let docListFilterdData = [];
    if (name === "tran") {
      docListFilterdData = filteredDocList.sort(function (a, b) {
        let valueA = Number(a[name]);
        let valueB = Number(b[name]);
        //for ascending order
        if (sortFilterDocCheck === "ASC") {
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
      docListFilterdData = filteredDocList.sort(function (a, b) {
        let valueA = new Date(a.date);
        let valueB = new Date(b.date);

        //for ascending order
        if (sortFilterDocCheck === "ASC") {
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
      docListFilterdData = filteredDocList.sort(function (a, b) {
        let valueA = a[name].toString().toUpperCase();
        let valueB = b[name].toString().toUpperCase();
        //for ascending order
        if (sortFilterDocCheck === "ASC") {
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
      getDocList: docListFilterdData,
      sortFilterDoc: name,
      sortFilterDocCheck,
    });
  };

  // move to previous Doc
  moveToPrevDOC = async () => {
    let { getDocList, activeDoc } = this.state;
    let foundIndex = getDocList.findIndex((l) => l.id === activeDoc);

    if (foundIndex != -1 && foundIndex != 0) {
      let doc = getDocList[foundIndex - 1];
      if (doc) {
        await this.getDocument(doc);
      }
    }
  };

  // move to next Doc
  moveToNextDOC = async () => {
    let { getDocList, activeDoc } = this.state;
    let foundIndex = getDocList.findIndex((l) => l.id === activeDoc);

    if (foundIndex != -1) {
      let doc = getDocList[foundIndex + 1];
      if (doc) {
        await this.getDocument(doc);
      }
    }
  };

  onTabPane = (tab) => {
    this.setState({ showDocTallisTabPane: tab });
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = async (name) => {
    this.setState({ [name]: false });
  };

  clearStates = async () => {
    this.setState({
      isLoading: false,
      tran: "", //tran of current selected Docmunet
      multipleTrans: [], //when user selects multiple Documents to perform different functionality

      docListSearch: "", //search on DOC list
      getDocList: [], //side menu (left side) DOC list data
      clonedgetDocList: [], //a copy of  getDocList
      activeDoc: "", //to add class active in lists of getting DOC (in left side )
      activeDocTallis: "", //to add class active on DOC tallis
      showDocTallisTabPane: "", //to add class active on DOC tallis below tab pane
      filteredDocList: [], //this contains filterd list and used for searching on it

      openAttachmentsModal: false,
      openCommentsModal: false,
      openDeleteModal: false,
      openActivityModal: false,
      approverGroup: "",
      approvalsGroups: [],
      approvers: [], //to just show on side menuw bar
      previews: [],
      numPages: null,
      pageNumber: 1,
      numPagesArr: [], //it contains number of pages of each PDF
      docComments: [],
      docAttachments: [],
      docActivity: [],
    });
  };

  handleCheckbox = async (e, data) => {
    let { getDocList, multipleTrans } = this.state;
    let { name, checked } = e.target;
    if (data === "allCheck" && name === "checkboxAll") {
      let multipleTransCopy = [];
      if (checked) {
        getDocList.map((m) => {
          m.checked = true;
          multipleTransCopy.push(m.tran);
          return m;
        });
      } else {
        getDocList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleTrans = [...multipleTransCopy];
    } else {
      if (checked) {
        getDocList.map(async (doc, i) => {
          if (data.id === doc.id) {
            doc.checked = true;
          }
          return doc;
        });
        multipleTrans.push(data.tran);
      } else {
        getDocList.map(async (doc, i) => {
          if (data.id === doc.id) {
            doc.checked = false;
          }
          return doc;
        });
        let filteredMultiTrans = multipleTrans.filter((t) => t != data.tran);
        multipleTrans = filteredMultiTrans;
      }
    }
    this.setState({
      getDocList,
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
    this.setState({ numPagesArr });
    this.settPreviewArrows();
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

  render() {
    let { getDocList, activeDoc } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            documents={true}
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
                            onClick={() => this.handleSortDocumentsList("type")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="type"
                              name="type"
                              onChange={() => {}}
                              checked={this.state.sortFilterDoc === "type"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="type"
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
                            onClick={() => this.handleSortDocumentsList("date")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={this.state.sortFilterDoc === "date"}
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
                              this.handleSortDocumentsList("description")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="description"
                              name="description"
                              onChange={() => {}}
                              checked={
                                this.state.sortFilterDoc === "description"
                              }
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="description"
                            >
                              Description
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortDocumentsList("tran")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="tran"
                              name="tran"
                              onChange={() => {}}
                              checked={this.state.sortFilterDoc === "tran"}
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
                      name="docListSearch"
                      id="docListSearchId"
                      value={this.state.docListSearch}
                      onChange={this.handleChangeDocListSearch}
                      onKeyDown={this.onDocListSearch}
                    />
                  </div>
                </div>
              </div>

              <ul className="suppliers_list">
                {getDocList.map((l, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        l.teamDocument === "Y"
                          ? getDocList[i + 1] &&
                            getDocList[i + 1].teamDocument &&
                            getDocList[i + 1].teamDocument === "Y"
                            ? "teamOrdersBg teamOrdersBorder2 cursorPointer"
                            : "teamOrdersBg teamOrdersBorder cursorPointer"
                          : activeDoc === l.id
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
                              id={"doc" + i}
                              checked={l.checked}
                              name="checkbox"
                              onChange={(e) => this.handleCheckbox(e, l)}
                            />
                            <label htmlFor={"doc" + i} className="mr-0"></label>
                          </div>
                        </div>

                        <div
                          className="col pl-0"
                          onClick={() => this.getDocument(l)}
                        >
                          <div className="invioce_data pr-sm-3">
                            <div className="row">
                              <div className="col data-i">
                                <p> Type:</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{l.type || ""}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col data-i">
                                <p>Date:</p>
                              </div>
                              <div className="col-auto data-i">
                                <p>{l.date}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col ">
                                <p className="mb-0">Description:</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p> {l.description}</p>
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
                        {/* Documents Tallies */}

                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {this.state.documentsTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="cursorPointer nav-item"
                                  onClick={() =>
                                    this.getDocumentTallies(t.docState, true)
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activeDocTallis === t.id
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    {t.docState}{" "}
                                    <span className="stats">{t.tally}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="bg-gry mm_top_nav">
                          <div className="w-100 float-left mm_lr_pad ">
                            <div className="mm_tab_left invoice_left">
                              <div className="tab-content">
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "draft" && (
                                    <div className="tab-pane container active">
                                      <ul>
                                        <li
                                          onClick={this.addDocument}
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
                                            this.state.getDocList.length > 0
                                              ? this.updateDocument()
                                              : () => {}
                                          }
                                          className="cursorPointer"
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
                                            this.state.getDocList.length > 0
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
                                          <Link to="#">Delete </Link>
                                        </li>
                                        <li
                                          className="cursorPointer"
                                          onClick={() =>
                                            this.state.getDocList.length > 0
                                              ? this.sendDocForApproval()
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
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "approve" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        <li
                                          onClick={this.approveDocument}
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
                                          onClick={this.holdDocument}
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
                                          onClick={this.declineDocument}
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/decline.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Decline </Link>
                                        </li>
                                        {/* <li className="cursorPointer">
                                          <img
                                            src="images/pencill.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Edit </Link>
                                        </li> */}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "declined" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        <li
                                          onClick={this.moveDocument}
                                          className="cursorPointer"
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

                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "hold" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        <li
                                          onClick={this.approveDocument}
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
                                          onClick={this.declineDocument}
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/decline.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Decline </Link>
                                        </li>
                                        {/* <li className="cursorPointer">
                                          {" "}
                                          <img
                                            src="images/pencill.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Edit </Link>
                                        </li> */}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "pending" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        <li
                                          onClick={this.moveDocument}
                                          className="cursorPointer"
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
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "approved" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul></ul>
                                    </div>
                                  )}
                                {this.state.showDocTallisTabPane &&
                                  this.state.showDocTallisTabPane.toLowerCase() ==
                                    "all" && (
                                    <div
                                      className={
                                        this.state.getDocList.length === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul></ul>
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
                                  className="zom-img float-right ml-md-5 pl-2 pr-2 mr-0 more-d mt-0 icon_dots"
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
                                  onClick={this.moveToNextDOC}
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
                                  onClick={this.moveToPrevDOC}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    data-slide="prev"
                                  />{" "}
                                </Link>

                                <div className="documents_attatchments2">
                                  <div className="main-sec-attach main-bg">
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
                                      data-target="#Approvals_invoice1"
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
                                                id={i + "doc"}
                                                name={a.approvalGroup}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i + "doc"}>
                                                {" "}
                                              </label>
                                            </div>
                                            <span className="text-mar">
                                              {a.approvalGroup}{" "}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
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
                                      onClick={() =>
                                        this.openModal("openActivityModal")
                                      }
                                      className="name_attached font-weight-bold"
                                    >
                                      Activity
                                      <span className="fa fa-angle-right"></span>
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Activity_invoice"
                                  >
                                    {this.state.docActivity.map((a, i) => {
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="img-section-t col-12">
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
                          {this.state.getDocList.length > 0 && (
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
                                {this.state.previews.length > 0
                                  ? this.state.previews.map((p, i) => {
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
                                                    rotate={this.state.rotate}
                                                  >
                                                    <Page
                                                      pageNumber={
                                                        this.state.pageNumber
                                                      }
                                                      scale={this.state.scaling}
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
                                                      {this.state.pageNumber} of{" "}
                                                      {this.state.numPages}
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
                                {this.state.previews.length > 1 && (
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

                      <div className="documents_attatchments1 aside__right--height">
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
                            {/*Docmuents Attachments */}
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
                                {this.state.docAttachments.length}
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
                            id="Attachments_invoice"
                          >
                            {this.state.docAttachments.map((a, i) => {
                              return (
                                <div
                                  key={i}
                                  className="main-sec-attach"
                                  onClick={() =>
                                    this.getAttachment(a.fileID, "", a.fileName)
                                  }
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

                            {/* <span className="fa fa-angle-right"></span> */}
                          </div>
                          <div className="collapse show" id="Approvals_invoice">
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
                                            ? "order-right-color ml-2 selected"
                                            : "text-mar"
                                        }
                                      >
                                        {a.approverName}
                                      </span>
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
                                {this.state.docComments.length}
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
                            {this.state.docComments.map((c, i) => {
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
          attachments={this.state.docAttachments}
          attachmentSize={this.state.attachmentSize}
          getAttachment={this.getAttachment}
          draft={
            this.state.showDocTallisTabPane &&
            this.state.showDocTallisTabPane.toLowerCase() === "draft"
              ? true
              : false
          } //to hide/show "Drag Files in or Click to Upload" box
        />

        <Delete
          openDeleteModal={this.state.openDeleteModal}
          closeModal={this.closeModal}
          onDelete={this.deleteDocument}
        />

        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={this.state.docComments}
          addComment={this.addComment}
          tab={
            this.state.showDocTallisTabPane &&
            this.state.showDocTallisTabPane.toLowerCase()
          }
        />

        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
          activity={this.state.docActivity}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  document: state.document,
});

export default connect(mapStateToProps, {
  getDocumentTallies: DocumentActions.getDocumentTallies,
  getDocumentsList: DocumentActions.getDocumentsList,
  getDocument: DocumentActions.getDocument,
  deleteDocument: DocumentActions.deleteDocument,
  sendDocForApproval: DocumentActions.sendDocForApproval,
  addDocAttachments: DocumentActions.addDocAttachments,
  getAttachment: DocumentActions.getAttachment,
  addComment: DocumentActions.addComment,
  approveDocument: DocumentActions.approveDocument,
  declineDocument: DocumentActions.declineDocument,
  holdDocument: DocumentActions.holdDocument,
  moveDocument: DocumentActions.moveDocument,
  clearDocumentStates: DocumentActions.clearDocumentStates,
  clearStatesAfterLogout,
})(Documents);
