import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import Select from "react-select";
import $ from "jquery";
import _ from "lodash";
import moment from "moment";
import store from "../../Store/index";
import * as JournalActions from "../../Actions/JournalActions/JournalActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import {
  handleAPIErr,
  downloadAttachments,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";
import { _customStyles } from "../../Constants/Constants";
import { toast } from "react-toastify";

class JournalForm extends Component {
  constructor() {
    super();
    this.state = {
      tran: "",
      batch: "",
      description: "",
      voucher: "",
      date: moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000,
      attachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      approvalGroup: {
        label: "Select Approval Group",
        value: "",
      },
      approvalOptions: [],
      journalLines: [],

      //get chart codes
      chartCodesList: [],
      clonedChartCodesList: [],
      defaultUserFlags: [], //default user flags
      checkAllJrnltem: false,
      formErrors: {
        approvalGroup: "",
        description: "",
      },
    };
  }

  async componentDidMount() {
    window.addEventListener(
      "resize",
      () => {
        // calculatin the margin for the chart code suggestion box
        this.calcMrgnForSuggestion();
      },
      false
    );
    addDragAndDropFileListners("drop-area-attach", this.uploadAttachment);

    let tran =
      (this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.tran) ||
      "";
    let check = false;

    if (tran && tran === "addNewJournal") {
      //  Add Journal Case
      await this.insertJournal(); //add Journal to get trans
      check = true;
    } else if (tran) {
      //update journal case
      this.setState({
        tran,
        attachmentSize: 0,
        isLoading: true,
      });
      await this.getJournal(tran);
      check = true;
    } else {
      this.props.history.push("/journals");
    }

    let isDefaultValues = false;
    let promises = [];
    let defVals =
      (this.props.user.getDefaultValues &&
        this.props.user.getDefaultValues.flags) ||
      [];

    if (defVals.length === 0) {
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
    } else {
      isDefaultValues = true;
    }
    if (check) {
      promises.push(this.getChartCodes());

      await Promise.all(promises);
    }

    //success case of get default vaues
    if (this.props.user.getDefaultValuesSuccess || isDefaultValues) {
      // toast.success(this.props.user.getDefaultValuesSuccess);
      let defaultUserFlags =
        (this.props.user.getDefaultValues &&
          this.props.user.getDefaultValues.flags) ||
        [];
      let _flags = [];
      defaultUserFlags.map((f, i) => {
        let obj = {
          value: f.defaultValue || "",
          length: f.length,
          prompt: f.prompt,
          sequence: f.sequence,
          type: f.type,
        };
        _flags.push(obj);
      });
      this.setState({ defaultUserFlags: _flags });
    }
    //error case of get default vaues
    if (this.props.user.getDefaultValuesError) {
      handleAPIErr(this.props.user.getDefaultValuesError, this.props);
    }
    this.calcMrgnForSuggestion();
  }
  
  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-attach", this.uploadAttachment);
  }

  // insert journal
  insertJournal = async () => {
    let {
      tran,
      batch,
      description,
      voucher,
      date,
      attachments,
      attachmentSize,
      approvalGroup,
      approvalOptions,
      journalLines,
    } = this.state;

    this.setState({ isLoading: true });
    await this.props.insertJournal();
    //success case of Insert Journal
    if (this.props.journal.insertJournalSuccess) {
      // toast.success(this.props.journal.insertJournalSuccess);

      let journal =
        (this.props.journal.insertJournal &&
          JSON.parse(JSON.stringify(this.props.journal.insertJournal))) ||
        "";
      tran = journal.tran || "";
      batch = journal.batch || "";
      description = journal.description || "";
      voucher = journal.voucher || "";
      date = journal.date || "";
      attachments = journal.attachments || [];

      attachmentSize = 0;
      attachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      approvalOptions = journal.approvalOptions || [];

      let aprvls = [];
      approvalOptions.map((a, i) => {
        aprvls.push({ label: a.option, value: a.option });
      });

      approvalGroup = journal.approvalGroup || "";
      journalLines = journal.journalLines || [];
      journalLines.map((l) => (l.checked = false));

      approvalGroup = {
        label: approvalGroup || "Select Approval Group",
        value: approvalGroup || "",
      };
      approvalOptions = aprvls;
    }
    //error case of Insert  Journal
    if (this.props.journal.insertJournalError) {
      handleAPIErr(this.props.journal.insertJournalError, this.props);
    }
    this.props.clearJournalStates();
    this.setState(
      {
        tran,
        batch,
        description,
        voucher,
        date,
        attachments,
        attachmentSize,
        approvalGroup,
        approvalOptions,
        journalLines,
        isLoading: false,
      },
      () => {
        this.calcMrgnForSuggestion();
      }
    );
  };

  getJournal = async (transition, type) => {
    let {
      tran,
      batch,
      description,
      voucher,
      date,
      attachments,
      attachmentSize,
      approvalGroup,
      approvalOptions,
      journalLines,
    } = this.state;
    await this.props.getJournal(transition);
    //success case of Get Journal
    if (this.props.journal.getJournalSuccess) {
      // toast.success(this.props.journal.getJournalSuccess);

      let journal =
        (this.props.journal.getJournal &&
          JSON.parse(JSON.stringify(this.props.journal.getJournal))) ||
        "";
      tran = journal.tran || "";
      batch = journal.batch || "";
      description = journal.description || "";
      voucher = journal.voucher || "";
      date = journal.date || "";
      attachments = journal.attachments || [];

      attachmentSize = 0;
      attachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      approvalOptions = journal.approvalOptions || [];

      let aprvls = [];
      approvalOptions.map((a, i) => {
        aprvls.push({ label: a.option, value: a.option });
      });

      approvalGroup = journal.approvalGroup || "";
      journalLines = journal.journalLines || [];
      journalLines.map((l) => (l.checked = false));

      approvalGroup = {
        label: approvalGroup || "Select Approval Group",
        value: approvalGroup || "",
      };
      approvalOptions = aprvls;
    }
    //error case of Get Journal
    if (this.props.journal.getJournalError) {
      handleAPIErr(this.props.journal.getJournalError, this.props);
    }
    this.props.clearJournalStates();
    this.setState(
      {
        tran,
        batch,
        description,
        voucher,
        date,
        attachments,
        attachmentSize,
        approvalGroup,
        approvalOptions,
        journalLines,
        isLoading: false,
      },
      () => {
        this.calcMrgnForSuggestion();
      }
    );
  };

  //calculate the dynamic margin from left for char code suggestion drop down
  calcMrgnForSuggestion = () => {
    if (
      $("#par").offset() &&
      $("#par").offset().left &&
      $("#cd_id") &&
      $("#cd_id").offset()
    ) {
      var dist_ho = Math.abs(
        $("#par").offset().left - $("#cd_id").offset().left
      ); // horizontal distance
      this.setState({ sugg_left: dist_ho });
    }
  };

  //to close date picker on tab change
  closeDatePicker = () => {
    $(".react-datepicker").hide();
  };

  handleChangeApprovalGroup = (approvalGroup) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(
      "approvalGroup",
      approvalGroup.value,
      formErrors
    );

    this.setState({ approvalGroup, formErrors });
  };

  handleChangeField = (e) => {
    let { name, value } = e.target;
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  //delete journal attachemnt
  deleteAttachment = async (attach) => {
    let { attachmentSize, attachments } = this.state;
    this.setState({ isLoading: true });
    let recordID = attach.recordID || "";

    await this.props.deleteAttachment(recordID);
    if (this.props.journal.deleteAttachmentSuccess) {
      // toast.success(this.props.journal.deleteAttachmentSuccess);
      let filteredAttachments = attachments.filter(
        (a) => a.recordID != recordID
      );

      attachmentSize = Number(attachmentSize) - Number(attach.fileSize);
      this.setState({
        attachments: filteredAttachments,
        attachmentSize,
      });
    }
    if (this.props.journal.deleteAttachmentError) {
      handleAPIErr(this.props.journal.deleteAttachmentError, this.props);
    }
    this.props.clearJournalStates();

    this.setState({ isLoading: false });
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

  // uplaod journal attchments
  uploadAttachment = async (f) => {
    let { attachmentSize } = this.state;
    let type = f[0].type;
    let name = f[0].name;
    let file = f[0];
    let size = f[0].size;
    if (
      type == "application/pdf" ||
      type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type == "image/jpeg" ||
      type == "image/jpg" ||
      type == "image/png" ||
      type == "application/msword" ||
      type == "application/vnd.ms-excel" ||
      type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type == "application/vnd.ms-powerpoint" ||
      type == "text/csv"
    ) {
      if (size <= 10485760) {
        //10MB = 10485760 Bytes
        if (attachmentSize < 30932992) {
          //30932992  -> 29.5 MB
          if (Number(size) + Number(attachmentSize) < 30932992) {
            const result = await toBase64(file).catch((e) => e);
            if (result instanceof Error) {
              toast.error(result.message);
              return;
            } else {
              await this.addAttachment(result, name);
            }
          } else {
            let remaining_KBs = (30932992 - attachmentSize) / 1024; //available space
            remaining_KBs = Number(remaining_KBs).toFixed(2);
            toast.error(
              `You can upload a file of size ${remaining_KBs}KB, Attachmnents limit 29.5MB.`
            );
          }
        } else {
          toast.error(
            "You can't add more attachments. Attachments limit 29.5MB! "
          );
        }
      } else {
        toast.error(
          "This file exceeds the 10MB limit. Please upload a smaller file."
        );
      }
    } else {
      toast.error(
        "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
      );
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
      toast.error("Tran is missing!");
    }
  };

  //get chart codes
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

  //ADD Journal Lines -> when click to + button on Journal Items
  addJournalLines = async () => {
    let { journalLines, defaultUserFlags } = this.state;

    let lastLineItem = journalLines[journalLines.length - 1];
    let lineNo = 1;
    if (lastLineItem) {
      if (Number(lastLineItem.lineNo) != NaN) {
        if (Number(lastLineItem.lineNo) < 1) {
          lineNo = 1;
        } else {
          lineNo = Number(lastLineItem.lineNo) + 1;
        }
      } else {
        lineNo = 1;
      }
    } else {
      lineNo = 1;
    }

    //pre-fill the Chart Sort with the user's default chart sort.
    let chartSort =
      (this.props.user.getDefaultValues &&
        this.props.user.getDefaultValues.defaultValues &&
        this.props.user.getDefaultValues.defaultValues.chartSort) ||
      "";

    let flags = defaultUserFlags || []; //user's flags

    let obj = {
      chartSort,
      chartCode: "",
      trackingCodes: flags,
      date: new Date().getTime(),
      description: "",
      amount: "0.00",
      supplier: "",
      invoice: "",
      po: "",
      empRef: "",
      tran: "",
      lineNo,
      autoFocus: true,
      checked: false,
    };

    journalLines = [...journalLines, obj];
    this.setState({ journalLines, checkAllJrnltem: false }, () => {
      if (journalLines.length === 1) {
        this.calcMrgnForSuggestion();
      }
    });
  };

  //Journal Lines checkbox
  handleJrnlLinesCheckBoxes = async (e, jrnlItem, index) => {
    let { journalLines, checkAllJrnltem } = this.state;
    let { checked } = e.target;

    if (jrnlItem === "all") {
      if (checked) {
        journalLines.map((e, i) => {
          e.checked = true;
          return e;
        });
      } else {
        journalLines.map((e, i) => {
          e.checked = false;
          return e;
        });
      }
      this.setState({
        journalLines,
        checkAllJrnltem: checked,
      });
    } else {
      if (checked) {
        jrnlItem.checked = checked;
        journalLines[index] = jrnlItem;

        let _check = journalLines.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAllJrnltem = true;
        }
        this.setState({ journalLines, checkAllJrnltem });
      } else {
        jrnlItem.checked = checked;
        journalLines[index] = jrnlItem;
        this.setState({ checkAllJrnltem: false, journalLines });
      }
    }
  };

  removeJournalLine = () => {
    let { journalLines } = this.state;

    let jrnlItem = journalLines.find((e) => e.checked);
    if (jrnlItem) {
      //remove item from Journal array
      let _journalLines = journalLines.filter((e) => !e.checked);
      this.setState({ journalLines: _journalLines });
    } else {
      toast.error("Please Select Journal Item To Remove!");
    }
  };

  //handle change journal lines fields
  hanldeJrnlLineFields = (e, jrnl, index, fldName) => {
    let name = "";
    let value = "";
    let { journalLines, chartCodesList } = this.state;
    let clonedChartCodesList = [...chartCodesList];
    let chartCodeSuggestion = null;
    if (fldName === "date") {
      name = "date";
      value = new Date(e).getTime();
    } else if (e.target.name === "chartCode") {
      //chart code sugggestion
      name = e.target.name;
      value = e.target.value;
      if (!value) {
        clonedChartCodesList = [];
      } else {
        let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
          return (
            (c.code.toUpperCase().includes(value.toUpperCase()) ||
              c.description.toUpperCase().includes(value.toUpperCase())) &&
            c.sort.toUpperCase() === jrnl.chartSort.toUpperCase()
          );
        });

        clonedChartCodesList = chartCodesListFilterdData;
      }
      chartCodeSuggestion = index;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    jrnl[name] = value;

    journalLines[index] = jrnl;

    this.setState({ journalLines, clonedChartCodesList, chartCodeSuggestion });
  };

  // when select chart code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line, index) => {
    let { journalLines } = this.state;
    // update in journal lines
    line.chartCode = chartCode.code || "";
    journalLines[index] = line;
    this.setState({ journalLines });
  };

  convertTwoDecimal = (e, line) => {
    let { name, value } = e.target;

    let val = Number(value).toFixed(2) || 0.0;

    let { journalLines } = this.state;
    line[name] = val;
    this.setState({ journalLines });
  };

  //handle change journal lines flags
  handleChangeFlags = (e, line, index) => {
    let { name, value } = e.target;
    let { journalLines } = this.state;

    let trackingCodes = line.trackingCodes || [];
    trackingCodes.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value;
      }
      return f;
    });

    this.setState({ journalLines });
  };

  updateJournal = async () => {
    let {
      tran,
      batch,
      description,
      voucher,
      date,
      approvalGroup,
      journalLines,
      formErrors,
    } = this.state;

    formErrors = Validation.handleWholeValidation(
      { approvalGroup: approvalGroup.value, description },
      formErrors
    );

    if (!formErrors.approvalGroup && !formErrors.description) {
      let journal = {
        tran,
        batch,
        description,
        voucher,
        date,
        approvalGroup: approvalGroup.value || "",
        journalLines,
      };
      this.setState({ isLoading: true });
      await this.props.updateJournal(journal);
      //success case
      if (this.props.journal.updateJournalSuccess) {
        toast.success(this.props.journal.updateJournalSuccess);

        this.props.history.push("/journals", {
          tallies: "Draft",
          addEditJournalCheck: true,
          addEditJournalTran: tran,
        });
      }
      //error case
      if (this.props.journal.updateJournalError) {
        toast.error(this.props.journal.updateJournalError);
      }

      this.props.clearJournalStates();
      this.setState({ formErrors, isLoading: false });
    }
  };

  onDiscard = async () => {
    /*Check When Edit Journal and then user Save or Cancel that edit,
    then load the same Journal user just edited/created?.*/

    let state = this.props.history.location
      ? this.props.history.location.state
      : "";

    this.props.history.push("/journals", {
      tallies: "Draft",
      addEditJournalCheck: true,
      addEditJournalTran: this.state.tran,
      defaultData: state.defaultData,
    });
  };

  render() {
    let {
      isLoading,
      batch,
      description,
      voucher,
      date,
      approvalGroup,
      approvalOptions,
      attachments,
      formErrors,
      defaultUserFlags,
      journalLines,
      sugg_left,
      chartCodeSuggestion,
      clonedChartCodesList,
      checkAllJrnltem,
    } = this.state;

    return (
      <>
        {isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} journalForm={true} />
          {/* end */}
          {/* body part */}
          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="container-fluid ">
                  <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center h-60vh">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad">
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main">
                                  <button
                                    type="button"
                                    className={
                                      this.state.id_save
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2236"
                                    id="id_save"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    onClick={this.updateJournal}
                                  >
                                    <span className="fa fa-check"></span>
                                    Save
                                  </button>

                                  <button
                                    onClick={this.onDiscard}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2237"
                                    id="id_cancel"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                  >
                                    <span className="fa fa-ban"></span>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group custon_select">
                                  <label htmlFor="id_date">Voucher</label>
                                  <div className="modal_input">
                                    <input
                                      autoFocus
                                      tabIndex="1123"
                                      type="text"
                                      className="form-control"
                                      name="voucher"
                                      value={voucher}
                                      onChange={this.handleChangeField}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group custon_select">
                                  <label htmlFor="id_dt">Date</label>
                                  <div className="modal_input datePickerUP">
                                    <DatePicker
                                      name="date"
                                      selected={date}
                                      id="id_dt"
                                      tabIndex="1124  "
                                      onKeyDown={(e) => {
                                        if (e.key == "Tab") {
                                          this.closeDatePicker();
                                        }
                                      }}
                                      onChange={(date) =>
                                        this.setState({
                                          date: new Date(date).getTime(),
                                        })
                                      }
                                      dateFormat="d MMM yyyy"
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group custon_select">
                                  <label htmlFor="id_date">Batch</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={batch}
                                      disabled
                                      onChange={() => {}}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group custon_select">
                                  <label htmlFor="id_date">
                                    Approval Group
                                  </label>
                                  <Select
                                    className="width-selector"
                                    // classNamePrefix="track_menu custon_select-selector-inner"
                                    styles={_customStyles}
                                    classNamePrefix="react-select"
                                    value={approvalGroup}
                                    options={approvalOptions}
                                    onChange={this.handleChangeApprovalGroup}
                                    tabIndex="1125"
                                    id="id_appGroup"
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
                                  <span
                                    className="input_field_icons rit-icon-input"
                                    data-toggle="collapse"
                                    data-target="#asd"
                                  ></span>
                                  <div className="text-danger error-12">
                                    {formErrors.approvalGroup !== ""
                                      ? formErrors.approvalGroup
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="id_date">Description</label>
                                  <div className="modal_input">
                                    <input
                                      tabIndex="1126"
                                      type="text"
                                      className="form-control"
                                      name="description"
                                      value={description}
                                      onChange={this.handleChangeField}
                                    />
                                  </div>
                                  <div className="text-danger error-12">
                                    {formErrors.description !== ""
                                      ? formErrors.description
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="forgot_body">
                              <div className="col-12 mt-md-3 mb-1">
                                <div className="forgot_header">
                                  <div className="modal-top-header">
                                    <div className="col-auto d-flex justify-content-end s-c-main p-0">
                                      <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                        <button
                                          type="button"
                                          className="btn-save exp-top-btn expxtopbtn1"
                                          onClick={this.addJournalLines}
                                        >
                                          <span className="fa fa-plus-circle"></span>
                                        </button>
                                        <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                          <button
                                            type="button"
                                            className="btn-save exp-top-btn"
                                            onClick={this.removeJournalLine}
                                          >
                                            <span className="fa fa-trash"></span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* table start  */}
                              <div className="row mt-3" id="par">
                                <div className="col-12">
                                  <div className="login_form expense-form">
                                    <div className="login_table_list table-reponsive exp-dropdown-ui">
                                      <table className="table  project_table shadow-none newpo--edit exp_edit">
                                        <thead>
                                          <tr>
                                            <th
                                              scope="col"
                                              className="exp_th1 mm_contact-name"
                                            >
                                              <div className="form-group">
                                                <label className="dash_container dash_remember table-check unckeck">
                                                  <input
                                                    type="checkbox"
                                                    name={"chk1"}
                                                    id={"chk1"}
                                                    checked={checkAllJrnltem}
                                                    onChange={(e) =>
                                                      this.handleJrnlLinesCheckBoxes(
                                                        e,
                                                        "all"
                                                      )
                                                    }
                                                  />
                                                  <span
                                                    id="chk1"
                                                    className="dash_checkmark"
                                                  ></span>
                                                </label>
                                              </div>
                                            </th>
                                            <th className="text-left white-space">
                                              {" "}
                                              Chart Sort
                                            </th>
                                            <th className="text-left white-space">
                                              {" "}
                                              Chart Code
                                            </th>
                                            {defaultUserFlags.map((p, i) => {
                                              return (
                                                <th
                                                  className="text-left exp-form-flag"
                                                  key={i}
                                                  scope="col"
                                                >
                                                  {p.prompt}
                                                </th>
                                              );
                                            })}
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              Date
                                            </th>
                                            <th
                                              scope="col"
                                              className="exp-descript text-left"
                                            >
                                              Description
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left exp-supplier-th"
                                            >
                                              Supplier
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              Invoice
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              PO
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              EmpRef
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              Tran
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left"
                                            >
                                              Amount
                                            </th>

                                            <th
                                              scope="col"
                                              className="text-left "
                                            >
                                              Line
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {journalLines.map((item, i) => {
                                            return (
                                              <tr key={i}>
                                                <td>
                                                  <div className="col align-self-center text-center pr-0">
                                                    <div className="form-group mb-0 check-line">
                                                      <label className="dash_container dash_remember table-check unckeck">
                                                        <input
                                                          type="checkbox"
                                                          name={"chk1"}
                                                          id={"chk1" + i}
                                                          checked={item.checked}
                                                          onChange={(e) =>
                                                            this.handleJrnlLinesCheckBoxes(
                                                              e,
                                                              item,
                                                              i
                                                            )
                                                          }
                                                        />
                                                        <span
                                                          id={"chk1" + i}
                                                          className="dash_checkmark"
                                                        ></span>
                                                      </label>
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-left">
                                                  <input
                                                    type="text"
                                                    className={
                                                      item.chartSort.length <= 5
                                                        ? "input_height wd-50 uppercaseText"
                                                        : "input_height wd-75 uppercaseText"
                                                    }
                                                    autoFocus={item.autoFocus}
                                                    name="chartSort"
                                                    value={item.chartSort}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="chartSort"
                                                  />
                                                </td>
                                                <td
                                                  className="text-left"
                                                  id="cd_id"
                                                >
                                                  <input
                                                    type="text"
                                                    className={
                                                      item.chartCode.length <= 4
                                                        ? "input_height wd-45 uppercaseText"
                                                        : item.chartCode
                                                            .length <= 8
                                                        ? "input_height wd-72 uppercaseText"
                                                        : "input_height wd-101 uppercaseText"
                                                    }
                                                    name="chartCode"
                                                    value={item.chartCode}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="chartCode"
                                                    autoComplete="off"
                                                    onBlur={() =>
                                                      setTimeout(() => {
                                                        this.setState({
                                                          chartCodeSuggestion:
                                                            null,
                                                        });
                                                      }, 200)
                                                    }
                                                  />
                                                  {chartCodeSuggestion == i && (
                                                    <div
                                                      className={
                                                        "chart_menue d-block"
                                                      }
                                                      style={{
                                                        marginLeft: sugg_left,
                                                      }}
                                                    >
                                                      {clonedChartCodesList.length >
                                                      0 ? (
                                                        <ul className="invoice_vender_menu">
                                                          {clonedChartCodesList.map(
                                                            (c, ind) => {
                                                              return (
                                                                <li
                                                                  className="cursorPointer"
                                                                  onClick={() =>
                                                                    this.changeChartCode(
                                                                      c,
                                                                      item,
                                                                      i
                                                                    )
                                                                  }
                                                                >
                                                                  <div className="vender_menu_right chart_new">
                                                                    <h3 className="chart_vender_text">
                                                                      <span>
                                                                        {" "}
                                                                        {
                                                                          c.code
                                                                        }{" "}
                                                                      </span>{" "}
                                                                      <span className="right_desc">
                                                                        {" "}
                                                                        {
                                                                          c.description
                                                                        }
                                                                      </span>
                                                                    </h3>
                                                                  </div>
                                                                </li>
                                                              );
                                                            }
                                                          )}
                                                        </ul>
                                                      ) : (
                                                        <div className="sup_nt_fnd text-center">
                                                          <h6>
                                                            No Chart Code Found
                                                          </h6>
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                                </td>

                                                {defaultUserFlags.map(
                                                  (p, i) => {
                                                    return (
                                                      <td
                                                        className={
                                                          p.type === "Set" ||
                                                          p.type === "set"
                                                            ? "od-flag-last  text-left"
                                                            : "text-left"
                                                        }
                                                        key={i}
                                                      >
                                                        <div className="">
                                                          <input
                                                            type="text"
                                                            id="usr"
                                                            className="input_height  uppercaseText"
                                                            autoComplete="off"
                                                            name={p.type}
                                                            maxLength={p.length}
                                                            value={
                                                              (item
                                                                .trackingCodes[
                                                                i
                                                              ] &&
                                                                item
                                                                  .trackingCodes[
                                                                  i
                                                                ].value) ||
                                                              ""
                                                            }
                                                            onChange={(e) =>
                                                              this.handleChangeFlags(
                                                                e,
                                                                item,
                                                                i
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                      </td>
                                                    );
                                                  }
                                                )}
                                                <td className="text-left">
                                                  <div
                                                    className="input_width m-0"
                                                    style={{ width: "100px" }}
                                                  >
                                                    <DatePicker
                                                      selected={Number(
                                                        item.date
                                                      )}
                                                      onKeyDown={(e) => {
                                                        if (e.key == "Tab") {
                                                          this.refs[
                                                            "jrnl" + i
                                                          ].setOpen(false);
                                                        }
                                                      }}
                                                      ref={"jrnl" + i}
                                                      className="uppercaseText"
                                                      dateFormat="d MMM yyyy"
                                                      autoComplete="off"
                                                      name="date"
                                                      onChange={(date) =>
                                                        this.hanldeJrnlLineFields(
                                                          date,
                                                          item,
                                                          i,
                                                          "date"
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>

                                                <td className="text-left exp-descript">
                                                  <input
                                                    type="text"
                                                    className="input_height uppercaseText"
                                                    name="description"
                                                    value={item.description}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="description"
                                                  />
                                                </td>

                                                <td className="text-left">
                                                  <input
                                                    type="text"
                                                    className="input_height wd-300 uppercaseText"
                                                    name="supplier"
                                                    value={item.supplier}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="supplier"
                                                  />
                                                </td>
                                                <td className="text-left">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="invoice"
                                                    value={item.invoice}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i,
                                                        "invoice"
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="invoice"
                                                  />
                                                </td>
                                                <td className="text-left ">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="po"
                                                    value={item.po}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i,
                                                        "po"
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="po"
                                                  />
                                                </td>

                                                <td className="text-left ">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="empRef"
                                                    value={item.empRef}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="empRef"
                                                  />
                                                </td>

                                                <td className="text-left">
                                                  {item.tran}
                                                </td>
                                                <td className="text-left ">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="amount"
                                                    value={item.amount}
                                                    onChange={(e) =>
                                                      this.hanldeJrnlLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="amount"
                                                  />
                                                </td>
                                                <td className="text-left pl-2">
                                                  {item.lineNo}
                                                </td>

                                                {/* <td className="text-left"></td> */}
                                              </tr>
                                            );
                                          })}
                                          <tr>
                                            <td scope="row"></td>
                                            <td className="text-left"></td>
                                            {defaultUserFlags.map((f) => (
                                              <td></td>
                                            ))}
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className="tbl_total_amount">
                                              Credit:
                                            </td>
                                            <td className="tbl_total_amount text-right pr-subtotal">
                                              0.00
                                            </td>
                                            <td className="tbl_total_amount">
                                              Debit:
                                            </td>
                                            <td className="tbl_total_amount text-right pr-subtotal">
                                              0.00
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* table end */}
                            </div>

                            <div className="row">
                              <div className="col-12 mt-2 mb-2">
                                <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                  <div id="drop-area-attach">
                                    <input
                                      type="file"
                                      id="fileElem-attach"
                                      className="form-control d-none uppercaseText"
                                      accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                                      , application/pdf, image/jpeg,image/jpg,image/png,
                                       .csv, .xlsx, .xls,
                                       application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                       application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                      onChange={(e) => {
                                        this.uploadAttachment(e.target.files);
                                      }}
                                      onClick={(event) => {
                                        event.currentTarget.value = null;
                                      }} //to upload the same file again
                                    />
                                    <label
                                      className="upload-label"
                                      htmlFor="fileElem-attach"
                                    >
                                      <div className="upload-text">
                                        <img
                                          src="images/drag-file.png"
                                          className="import_icon img-fluid"
                                          alt="upload-attachment"
                                        />
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {attachments &&
                                attachments.length > 0 &&
                                attachments.map((a, i) => {
                                  return (
                                    <div key={i} className="col-md-12 mb-md-4">
                                      <span className="del_notes">
                                        <i
                                          onClick={() =>
                                            this.deleteAttachment(a)
                                          }
                                          className="fa fa-times cursorPointer"
                                        ></i>

                                        <span
                                          className="cursorPointer"
                                          onClick={() =>
                                            this.getAttachment(
                                              a.recordID,
                                              a.fileName
                                            )
                                          }
                                        >
                                          {a.fileName || ""}
                                        </span>
                                      </span>
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
              </form>
            </section>
          </div>
          {/* end */}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  journal: state.journal,
  chart: state.chart,
  user: state.user,
});

export default connect(mapStateToProps, {
  insertJournal: JournalActions.insertJournal,
  getJournal: JournalActions.getJournal,
  deleteAttachment: JournalActions.deleteAttachment,
  getAttachment: JournalActions.getAttachment,
  addAttachment: JournalActions.addAttachment,
  updateJournal: JournalActions.updateJournal,
  getDefaultValues: UserActions.getDefaultValues,
  getChartCodes: ChartActions.getChartCodes,
  clearChartStates: ChartActions.clearChartStates,
  clearUserStates: UserActions.clearUserStates,
  clearJournalStates: JournalActions.clearJournalStates,
})(JournalForm);
