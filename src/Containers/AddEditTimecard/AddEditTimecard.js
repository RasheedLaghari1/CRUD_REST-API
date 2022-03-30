import React, { Component } from "react";
import $ from "jquery";
import "antd/dist/antd.css";
import "./antd_custom.css";
import { TimePicker, DatePicker } from "antd";
import RDatePicker from "react-datepicker";

import moment from "moment";
import { connect } from "react-redux";
import CalculateDayModal from "../Modals/CalculateDay/CalculateDay";
import EmployeeLookup from "../Modals/EmployeeLookup/EmployeeLookup";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
import _ from "lodash";
import Select from "react-select";
import * as UserActions from "../../Actions/UserActions/UserActions";

import {
  toBase64,
  handleAPIErr,
  handleValueOptions,
  handleHideUnhideRows,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
  downloadAttachments,
} from "../../Utils/Helpers";

import { userAvatar, _customStyles } from "../../Constants/Constants";

import * as TimecardActions from "../../Actions/TimecardActions/TimecardActions";

const uuidv1 = require("uuid/v1");

class TimeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timecardEntry: "List",
      timecardInterval: 1,
      isLoading: true,
      dateFormat: "DD/MM/YYYY",
      standardDateFormat: "YYYY-MM-DD",
      format: "HH:mm",
      subView: "List",
      payFrequency: "Weekly",
      payEnding: "",
      dayTimeCopyIndex: 0,
      dailyTimesCopyIndex: 0,
      dayTimeIndex: false,
      dayTimeDateMoment: moment(),
      dayTimeDate: "",
      saveDayTimeError: "",
      inputReadOnly: true,
      allowEmpty: false,
      minuteStep: localStorage.getItem("UserMinutsStep")
        ? parseInt(localStorage.getItem("UserMinutsStep"))
        : 5,

      height: 0,
      width: 0,
      isMobCalOpen: false,
      isWebCalOpen: false,

      employeeList: [],
      clonedEmployeeList: [],
      isPrimed: false, //if true then insertTimecard API should be called otherwise updateTimecard
      tran: "",
      approverGroup: "",
      approverOptions: [],
      employeeName: "",
      employeeCode: "",
      department: "",
      position: "",
      weekEndingDate: "",

      dailyTimes: [],
      day: "",
      date: moment(),
      finishWork: moment("00:00", "HH:mm"),
      finishWorkType: "00:00",
      finishMB1: moment("00:00", "HH:mm"),
      finishMB1Type: "00:00",
      finishMB2: moment("00:00", "HH:mm"),
      finishMB2Type: "00:00",
      finishMB3: moment("00:00", "HH:mm"),
      finishMB3Type: "00:00",
      nonDeductableMB1: false,
      nonDeductableMB2: false,
      nonDeductableMB3: false,
      totalMBDedDisabled: false,
      notes: "",
      payAs: "Worked",
      payAsOptions: [
        { Flag: "CON", Value: "Worked" },
        { Flag: "NW", Value: "Not Worked" },
        { Flag: "SIC", Value: "Sick" },
        { Flag: "HOL", Value: "Holiday Pay" },
        { Flag: "TIL", Value: "Time in Lieu" },
        { Flag: "PUB", Value: "Public Holiday" },
        { Flag: "PHW", Value: "Pub Hol Worked" },
      ],
      startWork: moment("00:00", "HH:mm"),
      startWorkType: "00:00",
      startMB1: moment("00:00", "HH:mm"),
      startMB1Type: "00:00",
      startMB2: moment("00:00", "HH:mm"),
      startMB2Type: "00:00",
      startMB3: moment("00:00", "HH:mm"),
      startMB3Type: "00:00",
      totalHours: "0.00",
      dayTimeTotalHours: "0.00",
      totalMB: moment("00:00", "HH:mm"),
      totalMBType: "00:00",
      travelTo: moment("00:00", "HH:mm"),
      travelToType: "00:00",
      travelFrom: moment("00:00", "HH:mm"),
      travelFromType: "00:00",
      camCall: moment("00:00", "HH:mm"),
      camCallType: "00:00",
      camWrap: moment("00:00", "HH:mm"),
      camWrapType: "00:00",
      pmtFlags: "",

      attachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      advancedList: [], //timecard advanced list
      clonedAdvancedList: [], //copy of timecard advanced list

      dailyTimeAdvancedList: [], //daily time advanced list
      clonedDailyTimeAdvancedList: [], //copy of dailyTimeAdvancedList
    };
  }

  async componentDidMount() {
    // let type = localStorage.getItem("time-picker-type") || "list";

    await this.props.setUserSettings();

    let timecardEntry =
      this.props.user.setUserSettings.userDetails?.timecardEntry;
    let timecardInterval =
      this.props.user.setUserSettings.userDetails?.timecardInterval;
    this.setState({
      timecardEntry,
      timecardInterval,
    });
    let promises = [];

    promises = [this.getEmployeeList()];

    let state =
      (this.props.history.location && this.props.history.location.state) || "";
    let { tran } = state;
    if (tran) {
      if (tran === "newTimecard") {
        //timecard first primed and then insert api should be called (this case will only called when user wants to create timecard through dashboard)
        promises = [...promises, this.primeTimecard()];
      } else {
        //timecard was inserted and now it just be updated
        promises = [...promises, this.getTimecard(tran)];
      }
      await Promise.all(promises);
    } else {
      this.props.history.push("/timecards");
    }

    this.setState(
      {
        subView: "Add",
      },
      () => {
        setTimeout(() => {
          //adding drag and drop attachments listeners
          addDragAndDropFileListners("drop-area", this.uploadAttachment);
          //end
        }, 2000);
      }
    );
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    $(document).ready(function () {
      $(".rotate").click(function () {
        $(this).toggleClass("up");
      });

      $(".focus_employee").focusout(function () {
        setTimeout(() => {
          $(".invoice_vender_menu1").hide();
        }, 700);
      });
    });
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area", this.uploadAttachment);
  }

  clearTimeCardStats() {
    this.setState({
      finishWork: moment("00:00", "HH:mm"),
      finishMB1: moment("00:00", "HH:mm"),
      finishMB1Type: "00:00",
      finishMB2: moment("00:00", "HH:mm"),
      finishMB3: moment("00:00", "HH:mm"),
      finishMB3Type: "00:00",
      nonDeductableMB1: false,
      nonDeductableMB2: false,
      nonDeductableMB3: false,
      totalMBDedDisabled: false,
      startWork: moment("00:00", "HH:mm"),
      startMB1: moment("00:00", "HH:mm"),
      startMB2: moment("00:00", "HH:mm"),
      startMB2Type: "00:00",
      startMB3: moment("00:00", "HH:mm"),
      totalHours: "0.00",
      totalMB: moment("00:00", "HH:mm"),
      travelTo: moment("00:00", "HH:mm"),
      travelFrom: moment("00:00", "HH:mm"),
      camCall: moment("00:00", "HH:mm"),
      camWrap: moment("00:00", "HH:mm"),
      pmtFlags: "",
    });
  }

  handleSaveDayTimeInline = async (event) => {
    let {
      dailyTimes,
      startWork,
      payAs,
      day,
      travelFrom,
      totalMB,
      startMB1,
      finishMB1,
      startMB2,
      finishMB2,
      startMB3,
      finishMB3,
      nonDeductableMB2,
      nonDeductableMB1,
      nonDeductableMB3,
      finishWork,
      travelTo,
      totalHours,
      dayTimeTotalHours,
      notes,
      dayTimeIndex,
    } = this.state;

    let index = dayTimeIndex;
    let customValidation = true;

    if (customValidation === true) {
      let dayTimeObj = {
        ...dailyTimes[index],
        day: day,
        finishWork: finishWork._i,
        finishMB1: finishMB1.format("HH:mm"),
        finishMB2: finishMB2.format("HH:mm"),
        finishMB3: finishMB3.format("HH:mm"),
        nonDeductableMB1: nonDeductableMB1 ? "1" : "0",
        nonDeductableMB2: nonDeductableMB2 ? "1" : "0",
        nonDeductableMB3: nonDeductableMB3 ? "1" : "0",
        notes: notes,
        payAs: payAs,
        startWork: startWork._i,
        startMB1: startMB1.format("HH:mm"),
        startMB2: startMB2.format("HH:mm"),
        startMB3: startMB3.format("HH:mm"),
        totalHours: dayTimeTotalHours,
        totalMB: totalMB.format("HH:mm"),
        travelTo: travelTo.format("HH:mm"),
        travelFrom: travelFrom.format("HH:mm"),
      };

      dailyTimes[index] = dayTimeObj;

      this.updateTotalHours();
    }
  };

  updateTotalHours = () => {
    let { dailyTimes } = this.state;

    dailyTimes = _.cloneDeep(dailyTimes);

    let totalTime = moment.duration("00:00", "HH:mm");

    dailyTimes.map((time, i) => {
      totalTime.add(moment.duration(time.totalHours, "HH:mm"));
    });

    let hours = parseInt(totalTime.asHours(), 10);
    let minutes = parseInt(totalTime.asMinutes(), 10) % 60;

    let totalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState({ totalHours: totalHours });
  };

  handleSaveDayTime = (index, subView) => {
    let {
      startWork,
      payAs,
      day,
      date,
      travelFrom,
      totalMB,
      startMB1,
      finishMB1,
      startMB2,
      finishMB2,
      startMB3,
      finishMB3,
      nonDeductableMB2,
      nonDeductableMB1,
      nonDeductableMB3,
      finishWork,
      travelTo,
      totalHours,
      notes,
      dayTimeDate,
      dailyTimes,
      camCall,
      camWrap,
      dayTimeTotalHours,
      clonedDailyTimeAdvancedList,
    } = this.state;

    let customValidation = true;

    $(".custom-time-field")
      .filter("[required]:visible")
      .each(function (i, requiredField) {
        if ($(requiredField).attr("type") === "checkbox") {
          if ($(requiredField).is(":checked")) {
            $(requiredField).parent().parent().removeClass("field_required");
          } else {
            customValidation = false;
            $(requiredField).parent().parent().addClass("field_required");
          }
        } else {
          if ($(requiredField).val() === "") {
            customValidation = false;
            $(requiredField).parent().parent().addClass("field_required");
          } else {
            $(requiredField).parent().parent().removeClass("field_required");
          }
        }
      });

    this.setState({ saveDayTimeError: "" });
    if (payAs !== "0" || customValidation === true) {
      let dayTimeObj = {
        ...dailyTimes[index],
        payAs: payAs,
        date,
        day,
        travelTo: travelTo.format("HH:mm"),
        startWork: startWork._i,
        startMB1: startMB1.format("HH:mm"),
        finishMB1: finishMB1.format("HH:mm"),
        nonDeductableMB1: nonDeductableMB1 ? "1" : "0",
        startMB2: startMB2.format("HH:mm"),
        finishMB2: finishMB2.format("HH:mm"),
        nonDeductableMB2: nonDeductableMB2 ? "1" : "0",
        startMB3: startMB3.format("HH:mm"),
        finishMB3: finishMB3.format("HH:mm"),
        nonDeductableMB3: nonDeductableMB3 ? "1" : "0",
        totalMB: totalMB.format("HH:mm"),
        finishWork: finishWork._i,
        travelFrom: travelFrom.format("HH:mm"),
        totalHours: dayTimeTotalHours,
        notes: notes || "",
        camCall: camCall.format("HH:mm"),
        camWrap: camWrap.format("HH:mm"),
        advancedList: clonedDailyTimeAdvancedList,
      };

      dailyTimes[index] = dayTimeObj;

      this.setState({ dailyTimes: dailyTimes }, () => {
        this.updateTotalHours();
      });
      if (subView === "Add") {
        $("#WeekTimesModalCenterClose").click();
      } else {
        this.setState({ subView: subView });
      }
    } else {
      if (payAs === "0") {
        this.setState({ saveDayTimeError: "payAs is required." });
      }
    }
  };

  handleDayTimeDate = (value, dateString) => {
    let d = new Date(dateString);
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    this.setState({
      dayTimeDateMoment: value,
      dayTimeDate: value.format(this.state.standardDateFormat),
      day: weekday[d.getDay()],
    });
  };

  handleChangeDayTimeTravel1 = (time, timeString, i, modal) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      dailyTimes,
    } = this.state;

    let travel1Duration = moment.duration(timeString, "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");

    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let clonesDailyTime = dailyTimes;

    if (modal) {
      this.setState({
        travelTo: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
      });
    } else {
      clonesDailyTime[i] = {
        ...clonesDailyTime[i],
        travelTo: moment(timeString, format),
        totalHours: dayTimeTotalHours,
      };

      this.setState(
        {
          dailyTimes: clonesDailyTime,
          travelTo: moment(timeString, format),
          dayTimeTotalHours: dayTimeTotalHours,
          day: clonesDailyTime[i].day,
          date: clonesDailyTime[i].date,
        },
        () => {
          this.handleSaveDayTime(i, "Add");
        }
      );
    }
  };

  handleChangeDayTimeTravel2 = (time, timeString, i, modal) => {
    let {
      startWork,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;

    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(timeString, "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let clonesDailyTime = this.state.dailyTimes;

    if (modal) {
      this.setState({
        travelFrom: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
      });
    } else {
      clonesDailyTime[i] = {
        ...clonesDailyTime[i],
        travelTo: moment(timeString, format),
        totalHours: dayTimeTotalHours,
      };
      this.setState(
        {
          dailyTimes: clonesDailyTime,
          travelFrom: moment(timeString, format),
          dayTimeTotalHours: dayTimeTotalHours,
          day: clonesDailyTime[i].day,
          date: clonesDailyTime[i].date,
        },
        () => {
          this.handleSaveDayTime(i, "Add");
        }
      );
    }
  };

  handleChangeDayTimeStartInline = (time, timeString) => {
    let {
      travelFrom,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      payAs,
      travelTo,
    } = this.state;

    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(timeString, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");

    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState(
      {
        startWork: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
      },
      () => {
        this.handleSaveDayTimeInline();
      }
    );
  };

  handleChangeCamCallTime = (m, t, i) => {
    let cloneDailyTimes = this.state.dailyTimes;

    if (i !== undefined) {
      cloneDailyTimes[i] = {
        ...cloneDailyTimes[i],
        camCall: t,
      };
    }

    this.setState({ dailyTimes: cloneDailyTimes, camCall: m });
  };

  handleChangeCamWrapTime = (m, t, i) => {
    let cloneDailyTimes = this.state.dailyTimes;
    if (i !== undefined) {
      cloneDailyTimes[i] = {
        ...cloneDailyTimes[i],
        camWrap: t,
      };
    }

    this.setState({ dailyTimes: cloneDailyTimes, camWrap: m });
  };

  handleChangeDayTimeFinishInline = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;

    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(timeString, "HH:mm");

    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState(
      {
        finishWork: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
      },
      () => {
        this.handleSaveDayTimeInline();
      }
    );
  };

  handleChangeDayTimeTotalMBDedInline = (time, timeString) => {
    let { travelFrom, startWork, finishWork, format, travelTo, payAs } =
      this.state;

    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    let TotalMBDedDuration = moment.duration(timeString, "HH:mm");
    endTime.subtract(TotalMBDedDuration);

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);

    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState(
      {
        totalMB: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
      },
      () => {
        this.handleSaveDayTimeInline();
      }
    );
  };

  handleChangeDayTimeStart = (time, timeString) => {
    let {
      travelFrom,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;

    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(timeString, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");

    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState({
      startWork: moment(timeString, format),
      dayTimeTotalHours: dayTimeTotalHours,
    });
  };

  handleChangeDayTimeFinish = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;

    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(timeString, "HH:mm");

    if (startTime > endTime) {
      endTime.add(24, "hours");
    }

    if (totalMBDedDisabled) {
      if (!nonDeductableMB1) {
        let startTimeMB1 = moment(startMB1, "HH:mm");
        let endTimeMB1 = moment(finishMB1, "HH:mm");
        if (startTimeMB1 > endTimeMB1) {
          endTimeMB1.add(24, "hours");
        }
        let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
      }

      if (!nonDeductableMB2) {
        let startTimeMB2 = moment(startMB2, "HH:mm");
        let endTimeMB2 = moment(finishMB2, "HH:mm");
        if (startTimeMB2 > endTimeMB2) {
          endTimeMB2.add(24, "hours");
        }
        let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }

      if (!nonDeductableMB3) {
        let startTimeMB3 = moment(startMB3, "HH:mm");
        let endTimeMB3 = moment(finishMB3, "HH:mm");
        if (startTimeMB3 > endTimeMB3) {
          endTimeMB3.add(24, "hours");
        }
        let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    } else {
      let TotalMBDedDuration = moment.duration(
        totalMB.format("HH:mm"),
        "HH:mm"
      );
      endTime.subtract(TotalMBDedDuration);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState({
      finishWork: moment(timeString, format),
      dayTimeTotalHours: dayTimeTotalHours,
    });
  };

  handleChangeDayTimeStartMeal = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      nonDeductableMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;

    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(time, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        startMB1: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeFinishMeal1 = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      nonDeductableMB1,
      startMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(time, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        finishMB1: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeStartMeal2 = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;

    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(time, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        startMB2: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeFinishMeal2 = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(time, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        finishMB2: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeStartMeal3 = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;

    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(time, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        startMB3: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeFinishMeal3 = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    totalMB.add(durationMB1);

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    totalMB.add(durationMB2);

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(time, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    totalMB.add(durationMB3);

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState(
      {
        finishMB3: moment(timeString, format),
        dayTimeTotalHours: dayTimeTotalHours,
        totalMB: moment(totalMB, format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  handleChangeDayTimeTotalMBDed = (time, timeString) => {
    let {
      travelFrom,
      startWork,
      finishWork,
      totalMBDedDisabled,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
      payAs,
    } = this.state;
    if (payAs === "0" && payAs[0]) {
      payAs = payAs[0].Value;
    }
    let travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    let TotalMBDedDuration = moment.duration(timeString, "HH:mm");
    endTime.subtract(TotalMBDedDuration);

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(travel1Duration);
    duration.add(travel2Duration);

    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    this.setState({
      totalMB: moment(timeString, format),
      dayTimeTotalHours: dayTimeTotalHours,
    });
  };

  getDateFormate = (date, formate) => {
    let datestring = date * 1000;
    if (formate === 1) {
      return (
        new Date(datestring).getFullYear() +
        "-" +
        String(new Date(datestring).getMonth() + 1).padStart(2, 0) +
        "-" +
        String(new Date(datestring).getDate()).padStart(2, 0)
      );
    }
    if (formate === 2) {
      return (
        String(new Date(datestring).getDate()).padStart(2, 0) +
        "/" +
        String(new Date(datestring).getMonth() + 1).padStart(2, 0) +
        "/" +
        new Date(datestring).getFullYear()
      );
    }
    return date;
  };

  updateMealBreakTime = () => {
    let {
      travelFrom,
      startWork,
      finishWork,
      nonDeductableMB1,
      startMB1,
      finishMB1,
      nonDeductableMB2,
      startMB2,
      finishMB2,
      nonDeductableMB3,
      startMB3,
      finishMB3,
      totalMB,
      format,
      travelTo,
    } = this.state;

    let Travel1Duration = moment.duration(travelTo.format("HH:mm"), "HH:mm");
    let Travel2Duration = moment.duration(travelFrom.format("HH:mm"), "HH:mm");
    let startTime = moment(startWork, "HH:mm");
    let endTime = moment(finishWork, "HH:mm");
    if (startTime > endTime) {
      endTime.add(24, "hours");
    }
    totalMB = moment.duration("00:00", "HH:mm");

    let startTimeMB1 = moment(startMB1, "HH:mm");
    let endTimeMB1 = moment(finishMB1, "HH:mm");
    if (startTimeMB1 > endTimeMB1) {
      endTimeMB1.add(24, "hours");
    }
    let durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    if (!nonDeductableMB1) {
      totalMB.add(durationMB1);
    }

    let startTimeMB2 = moment(startMB2, "HH:mm");
    let endTimeMB2 = moment(finishMB2, "HH:mm");
    if (startTimeMB2 > endTimeMB2) {
      endTimeMB2.add(24, "hours");
    }
    let durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    if (!nonDeductableMB2) {
      totalMB.add(durationMB2);
    }

    let startTimeMB3 = moment(startMB3, "HH:mm");
    let endTimeMB3 = moment(finishMB3, "HH:mm");
    if (startTimeMB3 > endTimeMB3) {
      endTimeMB3.add(24, "hours");
    }
    let durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    if (!nonDeductableMB3) {
      totalMB.add(durationMB3);
    }

    if (!nonDeductableMB1) {
      endTime.subtract(durationMB1);
    }

    if (!nonDeductableMB2) {
      endTime.subtract(durationMB2);
    }

    if (!nonDeductableMB3) {
      endTime.subtract(durationMB3);
    }

    let duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    let hours = parseInt(duration.asHours(), 10);
    let minutes = parseInt(duration.asMinutes(), 10) % 60;
    // let totalHours =
    //   String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let dayTimeTotalHours =
      String(hours).padStart(2, 0) + ":" + String(minutes).padStart(2, 0);

    let hoursmbded = parseInt(totalMB.asHours(), 10);
    let minutesmbded = parseInt(totalMB.asMinutes(), 10) % 60;
    totalMB =
      String(hoursmbded).padStart(2, 0) +
      ":" +
      String(minutesmbded).padStart(2, 0);

    this.setState({
      dayTimeTotalHours: dayTimeTotalHours,
      totalMB: moment(totalMB, format),
    });
  };

  handleChangeDayTime = (event) => {
    this.setState({ saveDayTimeError: "" });
    const name = event.target.name;
    const value = event.target.value;
    //alert(name);
    if (
      name === "nonDeductableMB1" ||
      name === "nonDeductableMB2" ||
      name === "nonDeductableMB3"
    ) {
      this.setState({ [name]: event.target.checked }, () => {
        this.updateMealBreakTime();
      });
    } else {
      this.setState({ [name]: value !== "" ? value : null });
    }
  };

  //when click on td then it setstate the current object values in the state
  handleDayTimeInline = (index, subView) => {
    let { format, dayTimeIndex, dailyTimes, dateFormat, standardDateFormat } =
      this.state;

    if (index !== dayTimeIndex) {
      let day = dailyTimes[index];
      this.setState(
        {
          saveDayTimeError: "",
          subView,
          dayTimeIndex: index,
          dayTimeCopyIndex: index,
          dayTimeDateMoment: day.date
            ? moment(this.dailyTimesDateFormat(day.date), dateFormat)
            : "",
          dayTimeDate: day.date
            ? moment(this.dailyTimesDateFormat(day.date), dateFormat).format(
                standardDateFormat
              )
            : "",
          day: day.day,
          date: day.date,
          finishWork: day.finishWork
            ? moment(day.finishWork, format)
            : moment("00:00", format),
          finishMB1: day.finishMB1
            ? moment(day.finishMB1, format)
            : moment("00:00", format),
          finishMB2: day.finishMB2
            ? moment(day.finishMB2, format)
            : moment("00:00", format),
          finishMB3: day.finishMB3
            ? moment(day.finishMB3, format)
            : moment("00:00", format),
          nonDeductableMB1: day.nonDeductableMB1 === "0" ? false : true,
          nonDeductableMB2: day.nonDeductableMB2 === "0" ? false : true,
          nonDeductableMB3: day.nonDeductableMB3 === "0" ? false : true,
          notes: day.notes ? day.notes : null,
          payAs: day.payAs ? day.payAs : "0",
          startWork: day.startWork
            ? moment(day.startWork, format)
            : moment("00:00", format),
          startMB1: day.startMB1
            ? moment(day.startMB1, format)
            : moment("00:00", format),
          startMB2: day.startMB2
            ? moment(day.startMB2, format)
            : moment("00:00", format),
          startMB3: day.startMB3
            ? moment(day.startMB3, format)
            : moment("00:00", format),
          // totalHours: day.totalHours ? day.totalHours : "00:00",
          dayTimeTotalHours: day.totalHours ? day.totalHours : "00:00",
          totalMB: day.totalMB
            ? moment(day.totalMB, format)
            : moment("00:00", format),
          travelTo: day.travelTo
            ? moment(day.travelTo, format)
            : moment("00:00", format),
          travelFrom: day.travelFrom
            ? moment(day.travelFrom, format)
            : moment("00:00", format),
          camCall: day.camCall
            ? moment(day.camCall, format)
            : moment("00:00", format),
          camWrap: day.camWrap
            ? moment(day.camWrap, format)
            : moment("00:00", format),
        },
        () => {
          this.updateTotalMBDedDisabledState();
        }
      );
    }
  };

  handleCopyYesterdaysTimes = (index) => {
    let { format, dailyTimes } = this.state;
    if (index === 0) {
      index = dailyTimes.length - 1;
    } else {
      index = index - 1;
    }
    let day = dailyTimes[index];
    this.setState(
      {
        dayTimeCopyIndex: index,
        finishWorkType: day.finishWork ? day.finishWork : "00:00",
        finishWork: day.finishWork
          ? moment(day.finishWork, format)
          : moment("00:00", format),
        finishMB1Type: day.finishMB1 ? day.finishMB1 : "00:00",
        finishMB1: day.finishMB1
          ? moment(day.finishMB1, format)
          : moment("00:00", format),
        finishMB2Type: day.finishMB2 ? day.finishMB2 : "00:00",
        finishMB2: day.finishMB2
          ? moment(day.finishMB2, format)
          : moment("00:00", format),
        finishMB3Type: day.finishMB3 ? day.finishMB3 : "00:00",
        finishMB3: day.finishMB3
          ? moment(day.finishMB3, format)
          : moment("00:00", format),
        nonDeductableMB1: day.nonDeductableMB1 === "0" ? false : true,
        nonDeductableMB2: day.nonDeductableMB2 === "0" ? false : true,
        nonDeductableMB3: day.nonDeductableMB3 === "0" ? false : true,
        notes: day.notes ? day.notes : null,
        payAs: day.payAs,
        // startMB1.format("HH:mm")
        startWorkType: day.startWork ? day.startWork : "00:00",
        startWork: day.startWork
          ? moment(day.startWork, format)
          : moment("00:00", format),
        startMB1Type: day.startMB1 ? day.startMB1 : "00:00",
        startMB1: day.startMB1
          ? moment(day.startMB1, format)
          : moment("00:00", format),
        startMB2Type: day.startMB2 ? day.startMB2 : "00:00",
        startMB2: day.startMB2
          ? moment(day.startMB2, format)
          : moment("00:00", format),
        startMB3Type: day.startMB3 ? day.startMB3 : "00:00",
        startMB3: day.startMB3
          ? moment(day.startMB3, format)
          : moment("00:00", format),
        // totalHours: day.totalHours ? day.totalHours : "00:00",
        dayTimeTotalHours: day.totalHours ? day.totalHours : "00:00",
        totalMBType: day.totalMB ? day.totalMB : "00:00",
        totalMB: day.totalMB
          ? moment(day.totalMB, format)
          : moment("00:00", format),
        travelToType: day.travelTo ? day.travelTo : "00:00",
        travelTo: day.travelTo
          ? moment(day.travelTo, format)
          : moment("00:00", format),
        travelFromType: day.travelFrom ? day.travelFrom : "00:00",
        travelFrom: day.travelFrom
          ? moment(day.travelFrom, format)
          : moment("00:00", format),
      },
      () => {
        this.updateTotalMBDedDisabledState();
      }
    );
  };

  renderPayasDropdown = () => {
    return this.state.payAsOptions.map((obj, i) => (
      <option key={i} value={obj.Value}>
        {obj.Value}
      </option>
    ));
  };

  handleCalendar = (element) => {
    $(element + " div input").click();
  };

  disabledDate = (current) => {
    let { payEnding } = this.state;

    if (payEnding) {
      if (current) {
        return payEnding !== current.format("dddd");
      }
    } else {
      // Can not select days before today and today
      //return current && current < moment().endOf('day');
      return false;
    }
  };

  // ########## MOBILE SECREENS ####################
  handleSubView = async (element, clear) => {
    if (element === "ListMobile") {
      let saveConfirm = window.confirm("Would you like to Save?");
      if (saveConfirm === true) {
        $("#SaveTimeCardMobile").click();
        return false;
      }
      element = "List";
      this.setState({ subView: element, isLoading: false });
    } else {
      this.setState({ subView: element, isLoading: false });
    }

    if (clear === "Yes") {
      let index = "0";

      this.setState({
        dailyTimesCopyIndex: 0,
        subView: element,
        dailyTimes: [],
        payFrequency: "Weekly",
        weekEndingDate: "",
        totalHours: "00:00",
        payEnding: "",
      });
    }
  };

  renderDayTimes = (view) => {
    let {
      dayTimeDateMoment,
      payAs,
      saveDayTimeError,
      day,
      minuteStep,
      inputReadOnly,
      allowEmpty,
      travelFrom,
      format,
      dateFormat,
      startWork,
      totalMB,
      totalMBDedDisabled,
      finishWork,
      travelTo,
      totalHours,
      notes,
      dayTimeIndex,
      isLoading,
      dayTimeCopyIndex,
      dayTimeTotalHours,
    } = this.state;

    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
          <div className="form__inner-flex">
            <div className="col-xs-2 chev_res_let">
              <a
                className="svg__icons1"
                href="javascript:void(0)"
                onClick={() => this.handleSubView("WeekTimes")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="2398 1881 13 19.418"
                >
                  <path
                    id="ic_chevron_left_24px"
                    className="cls-1"
                    d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z"
                    transform="translate(2390 1875)"
                  ></path>
                </svg>
              </a>
            </div>

            <div className="col-xs-8 text-center text--wrapper--one">
              <div>Digital Timesheet</div>
            </div>
          </div>

          {/* <div className="col-xs-8 text-center">Digital Timesheet</div> */}
          <div className="clear20"></div>
        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>

        <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
          <div className="clear5"></div>
          <div className="clear70-wrap"></div>
          <div className="col-sm-12 p-0">
            <div className="col-sm-6 p0">
              <button
                type="button"
                className="btn_copy_time"
                onClick={() => this.handleCopyYesterdaysTimes(dayTimeCopyIndex)}
              >
                <span>Copy Yesterdays Times</span>
              </button>
            </div>
            <div className="clear20"></div>
            <div className="mb-40"></div>
            <form className="form-horizontal">
              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="payAs"
                >
                  Pay As
                </label>
                <div className="col-xs-8">
                  <select
                    className="form-control pro_input_pop"
                    name="payAs"
                    value={payAs}
                    onChange={this.handleChangeDayTime}
                  >
                    <option value="0">Select</option>
                    {this.renderPayasDropdown()}
                  </select>
                  <span
                    className="doc_file_error"
                    style={{ position: "initial" }}
                  >
                    {saveDayTimeError ? saveDayTimeError : ""}
                  </span>
                </div>
              </div>

              <div className="form-group form__inner-flex ">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="Email"
                >
                  Date
                </label>
                <div className="col-xs-6 mr__right-wrapper">
                  <DatePicker
                    allowClear={false}
                    className="calendarDayTimeDateMobile"
                    value={dayTimeDateMoment}
                    format={dateFormat}
                    onChange={this.handleDayTimeDate}
                    disabled
                  />
                </div>
                <div className="col-xs-1 calendar_time2">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.handleCalendar(".calendarDayTimeDateMobile")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2936.352 349.176 18.501 23.145"
                    >
                      <path
                        id="ic_date_range_24px"
                        className="cls-1"
                        d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z"
                        transform="translate(2933.352 347.176)"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Day
                </label>
                <div className="col-xs-8" style={{ paddingTop: "5px" }}>
                  {day}
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-sm-3 form__lbl--one"
                  htmlFor="Mobile"
                >
                  Cam Call
                </label>
                <div className="col-sm-8" style={{ textAlign: "left" }}>
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={moment(this.state.camCall, format)}
                    format={format}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(moment, time) =>
                      this.handleChangeCamCallTime(moment, time)
                    }
                    // onChange={this.handleChangeDayTimeStart}
                  />
                </div>
              </div>
              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-sm-3 form__lbl--one"
                  htmlFor="Mobile"
                >
                  Cam Wrap
                </label>
                <div className="col-sm-8" style={{ textAlign: "left" }}>
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={moment(this.state.camWrap, format)}
                    format={format}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(moment, time) =>
                      this.handleChangeCamWrapTime(moment, time)
                    }
                  />
                </div>
              </div>
              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="Mobile"
                >
                  Travel To
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={moment(this.state.travelTo, format)}
                    format={format}
                    onChange={(m, t) =>
                      this.handleChangeDayTimeTravel1(m, t, "", true)
                    }
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Start Work
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={startWork}
                    format={format}
                    onChange={this.handleChangeDayTimeStart}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-5 form__lbl--one form__mx-wraper"
                  htmlFor="Email"
                >
                  Meal Break
                </label>
                <div className="col-xs-7">
                  <div className="col-xs-12 p0 btn_time_time2_svg">
                    <TimePicker
                      showNow={false}
                      allowClear={false}
                      minuteStep={minuteStep}
                      inputReadOnly={inputReadOnly}
                      allowEmpty={allowEmpty}
                      value={totalMB}
                      format={format}
                      onChange={this.handleChangeDayTimeTotalMBDed}
                      disabled={totalMBDedDisabled}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-4690 1327 10 16.19"
                      style={{ top: "11", cursor: "pointer" }}
                      onClick={() => this.handleSubView("BreakTimes")}
                    >
                      <path
                        id="ic_chevron_right_24px"
                        className="cls-1"
                        d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z"
                        transform="translate(-4698.59 1321)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="Email"
                >
                  Finish Work:
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={finishWork}
                    format={format}
                    onChange={this.handleChangeDayTimeFinish}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="Email"
                >
                  Travel From:
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={moment(this.state.travelFrom, format)}
                    format={format}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(m, t) =>
                      this.handleChangeDayTimeTravel2(m, t, "", true)
                    }
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Total Hours
                </label>
                <div className="col-xs-8" style={{ paddingTop: "5px" }}>
                  {dayTimeTotalHours}
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-xs-4 form__lbl--one form__mx-wraper"
                  htmlFor="Email"
                >
                  Note:
                </label>
                <div className="col-xs-8">
                  <input
                    className="form-control pro_input_pop"
                    placeholder=""
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={this.handleChangeDayTime}
                  />
                </div>
              </div>
              <div className="clear20"></div>
              <div
                className="col-sm-6 pull-right"
                style={{ paddingRight: "0" }}
              >
                <input
                  name=""
                  className="btn_save_pro btn_save_pro_5"
                  value="Save"
                  type="button"
                  onClick={() =>
                    this.handleSaveDayTime(dayTimeIndex, "WeekTimes")
                  }
                  disabled={isLoading}
                />
                <input
                  name=""
                  className="btn_cancel_pro nn"
                  value="Cancel"
                  type="button"
                  onClick={() => this.handleSubView("WeekTimes")}
                />

                <div className="clear40"></div>
              </div>

              <div className="clearfix"></div>
            </form>

            <div className="clear5"></div>

            <div className="clear40"></div>
            <div className="clear20"></div>
          </div>
        </div>
      </div>
    );
  };

  renderWeekTimes = (view) => {
    let {
      weekEndingDate,
      dailyTimesCopyIndex,
      dailyTimes,
      totalHours,
      isLoading,
    } = this.state;
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="clear70-wrap"></div>
        <div className="res_top_timecard">
          <div className="form__inner-flex">
            <div className="col-xs-2 chev_res_let">
              <a
                className="svg__icons1"
                href={null}
                onClick={() => this.handleSubView("Add", "No")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="2398 1881 13 19.418"
                >
                  <path
                    id="ic_chevron_left_24px"
                    className="cls-1"
                    d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z"
                    transform="translate(2390 1875)"
                  ></path>
                </svg>
              </a>
            </div>
            <div className="col-xs-8 text-center text--wrapper--one">
              <div>Digital Timesheet</div>
            </div>
          </div>

          {/* <div className="col-xs-8 text-center">Digital fff Timesheet</div> */}
          <div className="clear20"></div>
        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>

        <div className="col-xs-12 profile_setting_pop p0">
          <div className="clear5"></div>
          <div className="col-sm-12 p-0">
            <div className="col-sm-6 p-0 mb-40">
              <button
                type="button"
                href="#"
                className="btn_copy_time"
                onClick={this.handleCopyLastWeekTimes}
              >
                <span>Copy Last Weeks Times</span>
              </button>
            </div>
            <div className="clear20"></div>

            <table className="table table-bordered table-sm timecard2_table res_table_time_svg5">
              <thead>
                <tr>
                  <th width="20%" align="center">
                    Date
                  </th>
                  <th width="20%" align="center">
                    Day
                  </th>
                  <th width="10%" align="center">
                    Hours
                  </th>
                  <th width="10%" align="center">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                {weekEndingDate !== "" ? (
                  dailyTimes.length === 0 ? (
                    <tr key="empty">
                      <td align="center" colSpan="4">
                        <strong>Please select period ending date.</strong>
                      </td>
                    </tr>
                  ) : (
                    this.renderDailyTimesList(dailyTimes, view)
                  )
                ) : (
                  <tr key="empty">
                    <td align="center" colSpan="4">
                      <strong>Please select period ending date.</strong>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="clear5"></div>
            <div className="row">
              <div className="col-sm-12 p0">
                <div className="pull-right ">
                  <div className="pull-right label_timecard2">
                    <span style={{ paddingLeft: "20px" }}>
                      {weekEndingDate !== "" ? totalHours : "00:00"}
                    </span>
                  </div>
                </div>
                <div className="pull-right label_timecard2">
                  Total(Hrs):&nbsp;
                </div>
              </div>
            </div>

            <div className="flex__wrapper--four">
              <input
                name=""
                className="btn_save_pro btn_save_pro_5"
                value="Save"
                type="button"
                onClick={() => this.handleSubView("Add", "No")}
                disabled={isLoading}
              />
              <input
                name=""
                className="btn_cancel_pro nn"
                value="Cancel"
                type="button"
                onClick={() => this.handleSubView("Add", "No")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderBreakTimes = (view) => {
    let {
      minuteStep,
      inputReadOnly,
      allowEmpty,
      format,
      dayTimeIndex,
      isLoading,
      startMB1,
      finishMB1,
      startMB2,
      finishMB2,
      startMB3,
      finishMB3,
      nonDeductableMB1,
      nonDeductableMB2,
      nonDeductableMB3,
    } = this.state;
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
          <div className="form__inner-flex">
            <div className="col-xs-2 chev_res_let">
              <a
                className="svg__icons1"
                href="javascript:void(0)"
                onClick={() => this.handleSubView("DayTimes")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="2398 1881 13 19.418"
                >
                  <path
                    id="ic_chevron_left_24px"
                    className="cls-1"
                    d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z"
                    transform="translate(2390 1875)"
                  ></path>
                </svg>
              </a>
            </div>

            <div className="col-xs-8 text-center text--wrapper--one">
              <div>Meal Break Times</div>
            </div>
          </div>

          {/* <div className="col-xs-8 text-center">Meal Break Times</div> */}
          <div className="clear20"></div>
        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>

        <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
          <div className="clear70-wrap"></div>
          <div className="col-sm-12 p-0">
            <form className="form-horizontal">
              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Start MB1
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={startMB1}
                    format={format}
                    onChange={this.handleChangeDayTimeStartMeal}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Finish MB1
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={finishMB1}
                    format={format}
                    onChange={this.handleChangeDayTimeFinishMeal1}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Start MB2
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={startMB2}
                    format={format}
                    onChange={this.handleChangeDayTimeStartMeal2}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Finish MB2
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={finishMB2}
                    format={format}
                    onChange={this.handleChangeDayTimeFinishMeal2}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Start MB3
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={startMB3}
                    format={format}
                    onChange={this.handleChangeDayTimeStartMeal3}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-4 form__lbl--one form__mx-wraper">
                  Finish MB3
                </label>
                <div className="col-xs-8">
                  <TimePicker
                    showNow={false}
                    allowClear={false}
                    minuteStep={minuteStep}
                    inputReadOnly={inputReadOnly}
                    allowEmpty={allowEmpty}
                    value={finishMB3}
                    format={format}
                    onChange={this.handleChangeDayTimeFinishMeal3}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-6 form__lbl--one form__mx-wraper2">
                  Non Deductible MB1
                </label>
                <div className="col-xs-6" style={{ paddingTop: "10px" }}>
                  <input
                    type="checkbox"
                    name="nonDeductableMB1"
                    onChange={this.handleChangeDayTime}
                    checked={nonDeductableMB1}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-6 form__lbl--one form__mx-wraper2">
                  Non Deductible MB2
                </label>
                <div className="col-xs-6" style={{ paddingTop: "10px" }}>
                  <input
                    type="checkbox"
                    name="nonDeductableMB2"
                    onChange={this.handleChangeDayTime}
                    checked={nonDeductableMB2}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label className="control-label col-xs-6 form__lbl--one form__mx-wraper2">
                  Non Deductible MB3
                </label>
                <div className="col-xs-6" style={{ paddingTop: "10px" }}>
                  <input
                    type="checkbox"
                    name="nonDeductableMB3"
                    onChange={this.handleChangeDayTime}
                    checked={nonDeductableMB3}
                  />
                </div>
              </div>

              <div className="clear20"></div>
              <div className="flex__wrapper--four">
                <input
                  name=""
                  className="btn_save_pro btn_save_pro_5"
                  value="Save"
                  type="button"
                  onClick={() =>
                    this.handleSaveDayTime(dayTimeIndex, "DayTimes")
                  }
                  onClick={() => this.handleSubView("DayTimes")}
                  disabled={isLoading}
                />
                <input
                  name=""
                  className="btn_cancel_pro nn"
                  value="Cancel"
                  type="button"
                  onClick={() => this.handleSubView("DayTimes")}
                />
              </div>
            </form>

            <div className="clear5"></div>

            <div className="clear40"></div>
            <div className="clear20"></div>
          </div>
        </div>
      </div>
    );
  };

  //when edit to single day
  handleDayTime = (index, subView) => {
    let table = window.$("#dailyTimes-table").DataTable();
    table.destroy();

    let { dailyTimes, format, dateFormat, standardDateFormat } = this.state;

    let initialTime = moment("00:00", format);

    let day = dailyTimes[index];
    //setting the advanecd list
    let dailyTimeAdvancedList = day.advancedList || [];
    dailyTimeAdvancedList = _.cloneDeep(dailyTimeAdvancedList);
    let filtrdList = this.settingAdvancedList(
      "dtAdvancedList",
      dailyTimeAdvancedList
    );

    this.setState(
      {
        payAs: day.payAs ? day.payAs : "0",
        day: day.day,
        date: day.date,

        camCall: day.camCall ? moment(day.camCall, format) : initialTime,
        camCallType: day.camCall
          ? moment(day.camCall, format).format(format)
          : "00:00",

        camWrap: day.camWrap ? moment(day.camWrap, format) : initialTime,
        camWrapType: day.camWrap
          ? moment(day.camWrap, format).format(format)
          : "00:00",

        travelTo: day.travelTo ? moment(day.travelTo, format) : initialTime,
        travelToType: day.travelTo
          ? moment(day.travelTo, format).format(format)
          : "00:00",

        startWork: day.startWork ? moment(day.startWork, format) : initialTime,
        startWorkType: day.startWork
          ? moment(day.startWork, format).format(format)
          : "00:00",

        startMB1: day.startMB1 ? moment(day.startMB1, format) : initialTime,
        startMB1Type: day.startMB1
          ? moment(day.startMB1, format).format(format)
          : "00:00",

        finishMB1: day.finishMB1 ? moment(day.finishMB1, format) : initialTime,
        finishMB1Type: day.finishMB1
          ? moment(day.finishMB1, format).format(format)
          : "00:00",

        nonDeductableMB1:
          day.nonDeductableMB1 === "0" || day.nonDeductableMB1 === ""
            ? false
            : true,

        startMB2: day.startMB2 ? moment(day.startMB2, format) : initialTime,
        startMB2Type: day.startMB2
          ? moment(day.startMB2, format).format(format)
          : "00:00",

        finishMB2: day.finishMB2 ? moment(day.finishMB2, format) : initialTime,
        finishMB2Type: day.finishMB2
          ? moment(day.finishMB2, format).format(format)
          : "00:00",

        nonDeductableMB2:
          day.nonDeductableMB2 === "0" || day.nonDeductableMB2 === ""
            ? false
            : true,

        startMB3: day.startMB3 ? moment(day.startMB3, format) : initialTime,
        startMB3Type: day.startMB3
          ? moment(day.startMB3, format).format(format)
          : "00:00",

        finishMB3: day.finishMB3 ? moment(day.finishMB3, format) : initialTime,
        finishMB3Type: day.finishMB3
          ? moment(day.finishMB3, format).format(format)
          : "00:00",

        nonDeductableMB3:
          day.nonDeductableMB3 === "0" || day.nonDeductableMB3 === ""
            ? false
            : true,

        totalMB: day.totalMB ? moment(day.totalMB, format) : initialTime,
        totalMBType: day.totalMB
          ? moment(day.totalMB, format).format(format)
          : "00:00",

        finishWork: day.finishWork
          ? moment(day.finishWork, format)
          : initialTime,
        finishWorkType: day.finishWork
          ? moment(day.finishWork, format).format(format)
          : "00:00",

        travelFrom: day.travelFrom
          ? moment(day.travelFrom, format)
          : initialTime,
        travelFromType: day.travelFrom
          ? moment(day.travelFrom, format).format(format)
          : "00:00",

        // totalHours: day.totalHours ? day.totalHours : "00:00",
        dayTimeTotalHours: day.totalHours ? day.totalHours : "00:00",
        notes: day.notes ? day.notes : null,

        saveDayTimeError: "",
        subView,
        dayTimeIndex: index,
        dayTimeCopyIndex: index,
        dayTimeDateMoment: day.date
          ? moment(this.dailyTimesDateFormat(day.date), dateFormat)
          : "",
        dayTimeDate: day.date
          ? moment(this.dailyTimesDateFormat(day.date), dateFormat).format(
              standardDateFormat
            )
          : "",
        dailyTimeAdvancedList: filtrdList,
        clonedDailyTimeAdvancedList: dailyTimeAdvancedList,
      },
      () => {
        this.updateTotalMBDedDisabledState();
        this.timecardTableSetting("#dailyTimes-table");
      }
    );

    if (subView === "Add") {
      $("#WeekTimesModalCenterBtn").click();
    }
  };

  // ############### END #############
  //Prime Timecard
  primeTimecard = async () => {
    /*
  PrimeTimecard should be called when the insert button is pressed. This will provide the tran no. for the attachments 
  and InsertTimecard. InsertTimecard should be called for the first save to create the record. 
  This requires the Employee Code and Tran. UpdateTimecard can be called after InsertTimecard to save any changes.
  */
    this.setState({ isLoading: true });
    await this.props.primeTimecard();

    let {
      tran,
      department,
      employeeCode,
      employeeName,
      approverGroup,
      approverOptions,
      position,
      totalHours,
      weekEndingDate,
      dailyTimes,
      attachments,
      advancedList,
    } = this.state;

    if (this.props.timecard.primeTimecardSuccess) {
      toast.success(this.props.timecard.primeTimecardSuccess);

      let primeTimecard = _.cloneDeep(this.props.timecard.primeTimecard);

      tran = primeTimecard.tran || "";
      department = primeTimecard.department || "";
      employeeName = primeTimecard.employeeName || "";
      employeeCode = primeTimecard.employeeCode || "";
      approverGroup = primeTimecard.approverGroup || "";
      approverOptions = primeTimecard.approverOptions || [];
      position = primeTimecard.position || "";
      totalHours = primeTimecard.totalHours || "0.00";
      weekEndingDate = moment(parseInt(primeTimecard.weekEndingDate)) || "";
      dailyTimes = primeTimecard.dailyTimes || [];
      attachments = primeTimecard.attachments || [];
      advancedList = primeTimecard.advancedList || [];

      dailyTimes.map(
        (t) =>
          (t.date = moment(parseInt(t.date)).format(
            this.state.standardDateFormat
          ))
      );

      approverOptions.map((a, i) => {
        a.label = a.option;
        a.value = a.option;
        return a;
      });
    } else if (this.props.timecard.primeTimecardError) {
      handleAPIErr(this.props.timecard.primeTimecardError, this.props);
    }
    let filtrdList = this.settingAdvancedList("tcAdvancedList", advancedList);

    this.setState(
      {
        tran,
        approverGroup,
        approverOptions,
        employeeName,
        employeeCode,
        department,
        position,
        totalHours,
        weekEndingDate,
        dailyTimes,
        attachments,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        isPrimed: true,
        isLoading: false,
      },
      () => {
        this.props.clearTimecardStates();
        this.setDailyTimes();
        this.timecardTableSetting("#timecard-advanced-list");
      }
    );
  };

  settingAdvancedList = (tableName, advancedList) => {
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

    //get advanced list data from the local storage to hide/unhide rows for all users
    let tcAdvancedList = JSON.parse(localStorage.getItem(tableName) || "[]");

    if (tcAdvancedList && tcAdvancedList.length > 0) {
      advancedList.map((al, i) => {
        tcAdvancedList.map((loc, i) => {
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

    return filtrdList;
  };

  //get Timecard
  getTimecard = async (_tran) => {
    this.setState({ isLoading: true });
    await this.props.getTimecard(_tran);

    let {
      tran,
      department,
      employeeCode,
      employeeName,
      approverGroup,
      approverOptions,
      position,
      totalHours,
      weekEndingDate,
      dailyTimes,
      attachments,
      attachmentSize,
      advancedList,
    } = this.state;

    if (this.props.timecard.getTimecardSuccess) {
      toast.success(this.props.timecard.getTimecardSuccess);

      let getTimecard = _.cloneDeep(this.props.timecard.getTimecard);

      tran = getTimecard.tran || "";
      department = getTimecard.department || "";
      employeeName = getTimecard.employeeName || "";
      employeeCode = getTimecard.employeeCode || "";
      approverGroup = getTimecard.approverGroup || "";
      approverOptions = getTimecard.approverOptions || [];
      position = getTimecard.position || "";
      totalHours = getTimecard.totalHours || "";
      weekEndingDate = moment(parseInt(getTimecard.weekEndingDate)) || "";
      dailyTimes = getTimecard.dailyTimes || [];

      dailyTimes.map(
        (t) =>
          (t.date = moment(parseInt(t.date)).format(
            this.state.standardDateFormat
          ))
      );
      //dailyTimes.map((t) => (t.date = t.date / 1000));

      attachments = getTimecard.attachments || [];

      attachmentSize = 0;

      attachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      advancedList = getTimecard.advancedList || [];

      approverOptions.map((a, i) => {
        a.label = a.option;
        a.value = a.option;
        return a;
      });
    } else if (this.props.timecard.getTimecardError) {
      handleAPIErr(this.props.timecard.getTimecardError, this.props);
    }
    let filtrdList = this.settingAdvancedList("tcAdvancedList", advancedList);

    this.setState(
      {
        tran,
        approverGroup,
        approverOptions,
        employeeName,
        employeeCode,
        department,
        position,
        totalHours,
        weekEndingDate,
        dailyTimes,
        attachments,
        attachmentSize,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        isPrimed: false,
        isLoading: false,
      },
      () => {
        this.props.clearTimecardStates();
        this.timecardTableSetting("#timecard-advanced-list");
      }
    );
  };

  //update Timecard
  updateTimecard = async () => {
    this.setState({ isLoading: true });

    let {
      tran,
      department,
      employeeCode,
      approverGroup,
      position,
      totalHours,
      weekEndingDate,
      dailyTimes,
      attachments,
      advancedList,
    } = this.state;

    let timecrd = {
      tran,
      employeeCode,
      department,
      position,
      approverGroup,
      totalHours,
      // weekEndingDate: moment.unix(weekEndingDate).valueOf(),
      weekEndingDate: moment.utc(weekEndingDate).valueOf(),
      dailyTimes,
      attachments,
      advancedList,
    };
    //console.log("dailyTimes=>", dailyTimes); return false;
    await this.props.updateTimecard(timecrd);

    if (this.props.timecard.updateTimecardSuccess) {
      toast.success(this.props.timecard.updateTimecardSuccess);

      /*Check When Add/Edit timecard and then user Save or Cancel that edit, 
        then load the same  timecard user just edited/created?.*/

      let state =
        (this.props.history.location && this.props.history.location.state) ||
        "";
      let { tallies } = state;

      this.props.history.push("/timecards", {
        tallies,
        addEditTimecardCheck: true,
        addEditTimecardTran: tran,
      });
    } else if (this.props.timecard.updateTimecardError) {
      handleAPIErr(this.props.timecard.updateTimecardError, this.props);
    }

    this.props.clearTimecardStates();
    this.setState({ isLoading: false });
  };

  //insert Timecard
  insertTimecard = async () => {
    this.setState({ isLoading: true });

    let {
      tran,
      department,
      employeeCode,
      approverGroup,
      position,
      totalHours,
      weekEndingDate,
      dailyTimes,
      attachments,
      advancedList,
    } = this.state;

    let timecrd = {
      tran,
      employeeCode,
      department,
      position,
      approverGroup,
      totalHours,
      // weekEndingDate: moment.unix(weekEndingDate).valueOf(),
      weekEndingDate: moment(weekEndingDate).valueOf(),
      dailyTimes,
      attachments,
      advancedList,
    };

    await this.props.insertTimecard(timecrd);

    if (this.props.timecard.insertTimecardSuccess) {
      // toast.success(this.props.timecard.insertTimecardSuccess);

      /*Check When Add/Edit timecard and then user Save or Cancel that edit, 
        then load the same  timecard user just edited/created?.*/
      this.props.history.push("/timecards", {
        tallies: "Draft",
        addEditTimecardCheck: true,
        addEditTimecardTran: tran,
      });
    } else if (this.props.timecard.insertTimecardError) {
      handleAPIErr(this.props.timecard.insertTimecardError, this.props);
    }

    this.props.clearTimecardStates();
    this.setState({ isLoading: false });
  };

  onCancel = () => {
    /*Check When Add/Edit timecard and then user Save or Cancel that edit, 
        then load the same  timecard user just edited/created?.*/

    let state =
      (this.props.history.location && this.props.history.location.state) || "";
    let { tallies } = state;

    this.props.history.push("/timecards", {
      tallies,
      addEditTimecardCheck: true,
      addEditTimecardTran: this.state.tran,
    });
  };

  handleCopyLastWeekTimes = async () => {
    let { weekEndingDate, tran, employeeCode, dailyTimes, totalHours } =
      this.state;
    let clonedWeekEndingDate = moment.utc(weekEndingDate).valueOf();

    if (this.state.weekEndingDate.length === 0) {
      toast.error("Please select period ending date.");
      return false;
    } else {
      let obj = {
        tran,
        periodEnding: clonedWeekEndingDate,
        employeeCode,
      };
      this.setState({ isLoading: true });
      await this.props.copyLastWeeksTimes(obj);

      if (this.props.timecard.copyLastWeeksTimesSuccess) {
        toast.success(this.props.timecard.copyLastWeeksTimesSuccess);

        let copyLastWeeksTimesDailyTime =
          this.props.timecard.copyLastWeeksTimes.dailyTimes.map((item) => ({
            ...item,
            date: item.date,
          }));

        totalHours =
          this.props.timecard.copyLastWeeksTimes.totalHours || "0.00";

        dailyTimes = copyLastWeeksTimesDailyTime;
      } else {
        handleAPIErr(this.props.timecard.copyLastWeeksTimesError, this.props);
      }
      this.setState({
        dailyTimes,
        totalHours,
        isLoading: false,
      });
      this.props.clearTimecardStates();
    }
  };

  setDailyTimes = () => {
    let { payFrequency, weekEndingDate } = this.state;
    //console.log("weekEndingDate>>", weekEndingDate);
    let subtractDays =
      payFrequency === "Monthly"
        ? 29
        : payFrequency === "Fortnightly"
        ? 13
        : payFrequency === "4 Weekly"
        ? 27
        : 6;
    let periodStarting = moment(weekEndingDate)
      .subtract(subtractDays, "days")
      .format("YYYY-MM-DD 00:00");
    let dailyTimes = [];
    periodStarting = moment(periodStarting);
    //console.log("periodStarting>>", periodStarting);
    while (periodStarting <= weekEndingDate) {
      dailyTimes.push({
        payAs: "0",
        //date: Math.floor(periodStarting.valueOf() / 1000),
        date: periodStarting.format(this.state.standardDateFormat),
        day: periodStarting.format("dddd"),
        camCall: "00:00",
        camWrap: "00:00",

        travelTo: "00:00",
        startWork: "00:00",
        startMB1: "00:00",
        finishMB1: "00:00",
        nonDeductableMB1: "0",
        startMB2: "00:00",
        finishMB2: "00:00",
        nonDeductableMB2: "0",
        startMB3: "00:00",
        finishMB3: "00:00",
        nonDeductableMB3: "0",
        totalMB: "00:00",
        finishWork: "00:00",
        travelFrom: "00:00",
        totalHours: "00:00",
        pmtFlags: "",
        notes: null,
      });
      periodStarting.add(1, "days");
    }
    this.setState({ dailyTimes });
  };

  handlePeriodEnding = (value, dateString) => {
    this.setState(
      {
        weekEndingDate: value,
        totalHours: "00:00",
        isMobCalOpen: false,
        isWebCalOpen: false,
      },
      () => {
        this.setDailyTimes();
      }
    );
  };

  handlerDateChangeForIndividualLine = (e, i) => {
    let day = moment(e).format("dddd");
    //console.log("date=>", e);
    let clonedDailyTimes = this.state.dailyTimes;
    if (i !== undefined) {
      clonedDailyTimes[i] = {
        ...clonedDailyTimes[i],
        date: e.format(this.state.standardDateFormat),
        day,
      };
    }
    this.setState({
      dailyTimes: clonedDailyTimes,
      date: e.format(this.state.standardDateFormat),
      day,
    });
  };

  //open or close calender
  toggleCalendar = (element, ev) => {
    if (ev === "blur") {
      this.setState({ [element]: false });
    } else {
      this.setState({ [element]: !this.state[element] });
    }
  };

  // uplaod timecard attchments
  uploadAttachment = async (f) => {
    let { attachmentSize } = this.state;
    let type = f[0].type;
    let name = f[0].name;
    let file = f[0];
    let size = f[0].size;
    if (type == "application/pdf") {
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
              await this.addAttachment(result.split(",")[1], name);
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
      toast.error("Please Select only Attachments of type: 'pdf'");
    }
  };

  //add attachment
  addAttachment = async (attachment, fileName) => {
    let { tran, attachments, attachmentSize } = this.state;
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
        attachments = this.props.timecard.addAttachments || attachments;
        attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
      }
      if (this.props.timecard.addAttachmentsError) {
        handleAPIErr(this.props.timecard.addAttachmentsError, this.props);
      }
      this.setState({ isLoading: false, attachments, attachmentSize });
    } else {
      toast.error("Tran is missing!");
    }
  };

  deleteAttachment = async (recordID) => {
    let { attachments } = this.state;
    this.setState({ isLoading: true });
    await this.props.deleteAttachment(recordID);

    if (this.props.timecard.deleteAttachmentSuccess) {
      toast.success(this.props.timecard.deleteAttachmentSuccess);

      attachments = attachments.filter((att) => att.recordID !== recordID);
    }
    if (this.props.timecard.deleteAttachmentError) {
      handleAPIErr(this.props.timecard.deleteAttachmentError, this.props);
    }

    this.setState({ attachments, isLoading: false });

    this.props.clearTimecardStates();
  };

  getAttachment = async (recordID) => {
    this.setState({
      isLoading: true,
    });

    await this.props.getAttachment(recordID);
    this.setState({ isLoading: false });

    if (this.props.timecard.getAttachmentSuccess) {
      toast.success(this.props.timecard.getAttachmentSuccess);

      let attachment = this.props.timecard.getAttachment || "";

      downloadAttachments(attachment, "timecard");
    }

    if (this.props.timecard.getAttachmentError) {
      handleAPIErr(this.props.timecard.getAttachmentError, this.props);
    }
    this.props.clearTimecardStates();
  };

  updateParentState = (params) => {
    this.setState({
      employeeCode: params.employeeCode,
      employeeName: params.firstName + " " + params.lastName,
      approverGroup: params.approverGroup,
      department: params.department,
      position: params.position,
    });
  };

  handleChangeEmployeeName = async (e) => {
    $(".employee_name").show();
    let value = e.target.value;
    let clonedEmployeeList = [...this.state.employeeList];
    if (!value) {
      clonedEmployeeList = [];
    } else {
      let chartCodesListFilterdData = clonedEmployeeList.filter((c) => {
        return (
          c.firstName.toUpperCase().includes(value.toUpperCase()) ||
          c.lastName.toUpperCase().includes(value.toUpperCase())
        );
      });
      clonedEmployeeList = chartCodesListFilterdData;
    }

    this.setState({
      employeeName: value,
      clonedEmployeeList,
    });
  };

  changeEmployeeName = async (params) => {
    //focus after chart code selection to move next on Tab press
    $(`#employee_name_input`).focus();

    this.setState({
      employeeCode: params.employeeCode,
      employeeName: params.firstName + " " + params.lastName,
      approverGroup: params.approverGroup,
      department: params.department,
      position: params.position,
    });
  };

  onblur = (i) => {
    setTimeout(() => {
      $(".employee_name").hide();
    }, 700);
  };

  refreshEmployees = async () => {
    let { employeeList } = this.state;
    this.setState({
      isLoading: true,
    });

    await this.props.refreshEmployees();

    if (this.props.timecard.refreshEmployeesSuccess) {
      toast.success(this.props.timecard.refreshEmployeesSuccess);
      employeeList = this.props.timecard.refreshEmployees || [];
    }
    if (this.props.timecard.refreshEmployeesError) {
      handleAPIErr(this.props.timecard.refreshEmployeesError, this.props);
    }
    this.setState({
      isLoading: false,
      employeeList,
      clonedEmployeeList: employeeList,
    });
    this.props.clearTimecardStates();
  };

  getEmployeeList = async () => {
    let { employeeList } = this.state;

    await this.props.getEmployeeList();

    if (this.props.timecard.getEmployeeListSuccess) {
      // toast.success(this.props.timecard.getTimecardListSuccess);
      employeeList = this.props.timecard.getEmployeeList || [];
    }
    if (this.props.timecard.getEmployeeListError) {
      handleAPIErr(this.props.timecard.getEmployeeListError, this.props);
    }
    this.setState({
      employeeList: employeeList,
      clonedEmployeeList: employeeList,
    });
    this.props.clearTimecardStates();
  };
  // Advanced List Start

  timecardTableSetting = (tableName) => {
    window.$(tableName).DataTable({
      dom: "Rlfrtip",
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

  //handle Advanced list values Timecard
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

  //handle Advanced list values Daily Times
  handleValueOptionsDailyTimes = async (type, val, item, index) => {
    let { dailyTimeAdvancedList, clonedDailyTimeAdvancedList } = this.state;

    let result = handleValueOptions(
      type,
      val,
      item,
      index,
      dailyTimeAdvancedList,
      clonedDailyTimeAdvancedList
    );

    dailyTimeAdvancedList = result.advancedList;
    clonedDailyTimeAdvancedList = result.clonedAdvancedList;

    this.setState({ dailyTimeAdvancedList, clonedDailyTimeAdvancedList });
  };

  //show hidden rows timecard

  handleShowHiddenRows = async () => {
    let table = window.$("#timecard-advanced-list").DataTable();
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
            this.timecardTableSetting("#timecard-advanced-list");
          });
        } else {
          //hide again hidden rows
          let advancedList = this.state.advancedList;
          let list = advancedList.filter((l) => !l.hide);
          this.setState({ advancedList: list }, () => {
            this.timecardTableSetting("#timecard-advanced-list");
          });
        }
      }
    );
  };
  //show hidden rows daily times
  showHiddenRowsDailyTime = async () => {
    let table = window.$("#dailyTimes-table").DataTable();
    table.destroy();
    this.setState(
      (state) => ({
        showHiddenRowsDailyTime: !state["showHiddenRowsDailyTime"],
      }),
      () => {
        let { showHiddenRowsDailyTime, clonedDailyTimeAdvancedList } =
          this.state;
        if (showHiddenRowsDailyTime) {
          //show hidden rows
          this.setState(
            { dailyTimeAdvancedList: clonedDailyTimeAdvancedList },
            () => {
              this.timecardTableSetting("#dailyTimes-table");
            }
          );
        } else {
          //hide again hidden rows
          let { dailyTimeAdvancedList } = this.state;
          let list = dailyTimeAdvancedList.filter((l) => !l.hide);
          this.setState({ dailyTimeAdvancedList: list }, () => {
            this.timecardTableSetting("#dailyTimes-table");
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
      "#timecard-advanced-list",
      "tcAdvancedList",
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
        this.timecardTableSetting("#timecard-advanced-list");
      }
    );
  };

  //Hide/Unhide Rows Daily Times Popup
  handleHideUnhideRowsDailyTimes = async (item) => {
    let { dailyTimeAdvancedList, clonedDailyTimeAdvancedList, showHiddenRows } =
      this.state;

    let result = handleHideUnhideRows(
      item,
      "#dailyTimes-table",
      "dtAdvancedList", //dailytime advanced list
      dailyTimeAdvancedList,
      clonedDailyTimeAdvancedList,
      showHiddenRows
    );

    let _advancedList = result.advancedList;
    let _clonedAdvancedList = result.clonedAdvancedList;
    let _showHiddenRows = result.showHiddenRows;

    this.setState(
      {
        dailyTimeAdvancedList: _advancedList,
        clonedDailyTimeAdvancedList: _clonedAdvancedList,
        showHiddenRowsDailyTime: _showHiddenRows,
      },
      () => {
        this.timecardTableSetting("#dailyTimes-table");
      }
    );
  };

  updateTotalMBDedDisabledState = () => {
    //totalMBDedDisabled

    let {
      startMB1,
      startMB2,
      startMB3,
      finishMB1,
      finishMB2,
      finishMB3,
      totalMBDedDisabled,
    } = this.state;

    if (
      startMB1.format("HH:mm") === "00:00" &&
      startMB2.format("HH:mm") === "00:00" &&
      startMB3.format("HH:mm") === "00:00" &&
      finishMB1.format("HH:mm") === "00:00" &&
      finishMB2.format("HH:mm") === "00:00" &&
      finishMB3.format("HH:mm") === "00:00"
    ) {
      totalMBDedDisabled = false;
    } else {
      totalMBDedDisabled = true;
    }
    this.setState({ totalMBDedDisabled });
  };

  inputHandlerChangeFeild = (e, i) => {
    let clonesDailyTime = this.state.dailyTimes;
    if (i !== undefined) {
      clonesDailyTime[i] = {
        ...clonesDailyTime[i],
        [e.target.name]: e.target.value,
      };
    }

    this.setState({
      dailyTimes: clonesDailyTime,
      [e.target.name]: e.target.value,
    });
  };

  checkBoxHandler = (e, i) => {
    let clonedDailyTimes = this.state.dailyTimes;
    if (i !== undefined) {
      clonedDailyTimes[i] = {
        ...clonedDailyTimes[i],
        checked: e.target.checked,
      };
    } else {
      this.setState({ checkAll: e.target.checked });
      clonedDailyTimes = clonedDailyTimes.map((item) => ({
        ...item,
        checked: e.target.checked,
      }));
    }
    this.setState({ dailyTimes: clonedDailyTimes });
  };

  clearPmtTages = (e) => {
    e.preventDefault();
    let clonesDailyTime = this.state.dailyTimes;
    clonesDailyTime = clonesDailyTime = clonesDailyTime.map((item) => {
      if (item.checked) {
        return { ...item, pmtFlags: "" };
      } else {
        return item;
      }
    });

    this.setState(
      {
        dailyTimes: clonesDailyTime,
      },
      () => {
        this.clearTimeCardStats();
      }
    );
  };

  zeroHours = (e) => {
    e.preventDefault();
    let clonesDailyTime = _.cloneDeep(this.state.dailyTimes);

    clonesDailyTime = clonesDailyTime.map((item) => {
      if (item.checked) {
        return {
          ...item,
          camCall:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          camWrap:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          travelTo:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          startWork:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          startMB1: moment("00:00", "HH:mm"),
          finishMB1: moment("00:00", "HH:mm"),
          nonDeductableMB1: false,
          startMB2: moment("00:00", "HH:mm"),
          finishMB2: moment("00:00", "HH:mm"),
          nonDeductableMB2: false,
          startMB3: moment("00:00", "HH:mm"),
          finishMB3: moment("00:00", "HH:mm"),
          nonDeductableMB3: false,
          totalMB:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          finishWork:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          travelFrom:
            this.state.timecardEntry === "Text"
              ? "00:00"
              : moment("00:00", "HH:mm"),
          totalHours: "00.00",
        };
      } else {
        return item;
      }
    });
    this.setState(
      {
        dailyTimes: clonesDailyTime,
      },
      () => {
        this.updateTotalHours();
        this.clearTimeCardStats();
      }
    );
  };

  addDailyTimesRow = (e) => {
    let previousDailyTimes = this.state.dailyTimes;
    let day = moment(this.state.weekEndingDate).format("dddd");
    previousDailyTimes.push({
      checked: false,
      payAs: "Worked",
      date: this.state.weekEndingDate.format(this.state.standardDateFormat),
      day: day,
      camCall: "00:00",
      camWrap: "00:00",
      travelTo: "00:00",
      startWork: "00:00",
      startMB1: "00:00",
      finishMB1: "00:00",
      nonDeductableMB1: false,
      startMB2: "00:00",
      finishMB2: "00:00",
      nonDeductableMB2: false,
      startMB3: "00:00",
      finishMB3: "00:00",
      nonDeductableMB3: false,
      totalMB: "00:00",
      finishWork: "00:00",
      travelFrom: "00:00",
      totalHours: "0.00",
      pmtFlags: "",
      notes: "",
    });
    this.setState({
      dailyTimes: previousDailyTimes,
    });
  };

  delteSelctedDailyTimesRow = (e) => {
    let filterdRowsWhichisNotChecked = this.state.dailyTimes.filter(
      (item) => !item.checked || item.checked === undefined
    );

    if (filterdRowsWhichisNotChecked.length === this.state.dailyTimes.length) {
      alert("select atleast one row");
      return;
    } else {
      this.setState(
        {
          dailyTimes: filterdRowsWhichisNotChecked,
        },
        () => {
          this.updateTotalHours();
        }
      );
    }
  };

  calculateDayHandler = (time, index) => {
    this.setState({ openCalculateDayModal: true }, () => {
      this.setState({
        dayCalculateData: time,
      });
    });
  };

  closeCalculateModal = async () => {
    let { tran } = this.state;
    this.setState({ openCalculateDayModal: false, dayCalculateData: "" });
    let table = await window.$("#timecard-advanced-list").DataTable();
    await table.destroy();
    await this.getTimecard(tran);
  };

  dailyTimesDateFormat(date) {
    if (typeof date === "number") {
      return moment(date).format(this.state.dateFormat);
    } else {
      //return moment(new Date(date)).format(this.state.dateFormat);
      return moment(date, this.state.standardDateFormat).format(
        this.state.dateFormat
      );
    }
  }

  renderDailyTimesList = (dailyTimes, view) => {
    let {
      dateFormat,
      minuteStep,
      inputReadOnly,
      allowEmpty,
      format,
      totalMBDedDisabled,
    } = this.state;

    if (view === "mobile") {
      return dailyTimes.map((time, i) => (
        <tr
          key={i}
          style={{ cursor: "pointer" }}
          onClick={() => this.handleDayTime(i, "DayTimes")}
        >
          <td align="center">{this.dailyTimesDateFormat(time.date)}</td>
          <td align="center">{time.day}</td>
          <td align="center">{time.totalHours}</td>
          <td align="center" style={{ paddingTop: "12px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-4690 1327 10 16.19"
            >
              <path
                id="ic_chevron_right_24px"
                className="cls-1"
                d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z"
                transform="translate(-4698.59 1321)"
              ></path>
            </svg>
          </td>
        </tr>
      ));
    } else {
      return dailyTimes.map((time, i) => (
        <tr key={i}>
          <td align="center">
            <div className="form-group remember_check pt-0">
              <input
                type="checkbox"
                id={`editOrder ${i}`}
                checked={time.checked !== undefined ? time.checked : false}
                onChange={(e) => this.checkBoxHandler(e, i)}
                // onChange={(e) => this.handleCheckboxesInOrderDetails(e, "all")}
              />
              <label htmlFor={`editOrder ${i}`} className="mr-0"></label>
            </div>
          </td>
          <td align="center">
            <DatePicker
              value={moment(this.dailyTimesDateFormat(time.date), dateFormat)}
              allowClear={false}
              format={dateFormat}
              // onChange={this.handlePeriodEnding}
              onChange={(e) => this.handlerDateChangeForIndividualLine(e, i)}
            />
            {/* {String(new Date(time.Date * 1000).getDate()).padStart(2, 0)}/
            {String(new Date(time.Date * 1000).getMonth() + 1).padStart(2, 0)}/
            {new Date(time.Date * 1000).getFullYear()} */}
          </td>
          <td align="center">{time.day}</td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.camCall, format)}
                format={format}
                onChange={(moment, time) =>
                  this.handleChangeCamCallTime(moment, time, i)
                }
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.camCall == "00:00" ? "" : time.camCall}
                placeholder="00:00"
                name="camCall"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.camWrap, format)}
                format={format}
                onChange={(moment, time) =>
                  this.handleChangeCamWrapTime(moment, time, i)
                }
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.camWrap == "00:00" ? "" : time.camWrap}
                placeholder="00:00"
                name="camWrap"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.travelTo, format)}
                format={format}
                onChange={(m, t) =>
                  this.handleChangeDayTimeTravel1(m, t, i, false)
                }
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.travelTo == "00:00" ? "" : time.travelTo}
                placeholder="00:00"
                name="travelTo"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.startWork, format)}
                format={format}
                onChange={this.handleChangeDayTimeStartInline}
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.startWork == "00:00" ? "" : time.startWork}
                placeholder="00:00"
                name="startWork"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.totalMB, format)}
                format={format}
                onChange={this.handleChangeDayTimeTotalMBDedInline}
                disabled={totalMBDedDisabled}
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.totalMB == "00:00" ? "" : time.totalMB}
                placeholder="00:00"
                name="totalMB"
                disabled={totalMBDedDisabled}
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.finishWork, format)}
                format={format}
                onChange={this.handleChangeDayTimeFinishInline}
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.finishWork == "00:00" ? "" : time.finishWork}
                placeholder="00:00"
                name="finishWork"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td
            align="center"
            onClick={() => this.handleDayTimeInline(i, "Add")}
            className="custom--width"
          >
            {this.state.timecardEntry !== "Text" ? (
              <TimePicker
                showNow={false}
                allowClear={false}
                // minuteStep={minuteStep}
                minuteStep={
                  this.state.timecardInterval ? this.state.timecardInterval : 1
                }
                className="text_inline"
                inputReadOnly={inputReadOnly}
                allowEmpty={allowEmpty}
                value={moment(time.travelFrom, format)}
                format={format}
                onChange={(m, t) =>
                  this.handleChangeDayTimeTravel2(m, t, i, false)
                }
              />
            ) : (
              <input
                type="text"
                className="text_inline_note"
                value={time.travelFrom == "00:00" ? "" : time.travelFrom}
                placeholder="00:00"
                name="travelFrom"
                onChange={(e) => this.handleChangeDayTimeTypeInline(e, i)}
                onBlur={(e) => this.updateTimeTypeInline(e, i, false)}
              />
            )}
          </td>
          <td align="center">{time.totalHours}</td>
          <td align="center">
            {/* <input type="text" className="text_pmt-flag" /> */}
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="1"
              name="pmtFlags"
              value={time.pmtFlags}
              onChange={(e) => this.inputHandlerChangeFeild(e, i)}
            ></textarea>
          </td>
          <td align="center">
            <textarea
              className="form-control"
              id="exampleFormControlTextarea12"
              rows="1"
              name="notes"
              value={time.notes}
              onChange={(e) => this.inputHandlerChangeFeild(e, i)}
            ></textarea>
          </td>
          <td align="center">
            <div className="flex__wrapper-time">
              <div className="text-center timecard_edit6">
                <a
                  href="javascript:void(0)"
                  onClick={() => this.handleDayTime(i, "Add")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="1656.776 299 17.515 18.003"
                  >
                    <path
                      id="ic_create_24px2"
                      className="cls-1"
                      d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z"
                      transform="translate(1653.776 296.002)"
                    />
                  </svg>
                </a>
              </div>
              <div>
                <button
                  onClick={() => this.calculateDayHandler(time, i)}
                  className="btn"
                >
                  <i className="fa fa-calculator"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
      ));
    }
  };

  //Advanced List End
  renderAddView = (view) => {
    let {
      employeeName,
      department,
      position,
      weekEndingDate,
      approverGroup,
      approverOptions,
      dateFormat,
      isWebCalOpen,
      isPrimed,
      attachments,
      advancedList,
      showHiddenRows,
      clonedEmployeeList,
      totalHours,
      dailyTimes,
      dailyTimesCopyIndex,
    } = this.state;
    if (view === "mobile") {
      return (
        <div className="col-xs-12 col-sm-12 col-md-12  time_table_mrg_res">
          <div className="res_top_timecard ">
            <div className="form__inner-flex">
              <div className="col-xs-4 chev_res_let">
                <a
                  className="svg__icons1"
                  href="javascript:void(0)"
                  onClick={() => this.handleSubView("ListMobile", "Yes")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="2398 1881 13 19.418"
                  >
                    <path
                      id="ic_chevron_left_24px"
                      className="cls-1"
                      d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z"
                      transform="translate(2390 1875)"
                    ></path>
                  </svg>
                </a>{" "}
              </div>
              <div className="col-xs-8 text-center text--wrapper--one">
                <div>Digital Timesheet</div>
              </div>
            </div>
            <div className="clear20"></div>
          </div>

          <div className="clear70-wrap"></div>

          <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
            <div className="clear5"></div>

            <form className="form-horizontal">
              <div className="form-group form__inner-flex ">
                <label className="control-label label__wrapper1 form__lbl--one">
                  Employee Name:
                </label>
                <div className="label__wrapper2">
                  <div className="custon_select">
                    <div className="modal_input">
                      <input
                        type="text"
                        className={
                          "form-control focus_employee border__one-wrapper"
                        }
                        placeholder="Employee Name"
                        id="employee_name_input"
                        autoComplete="off"
                        name="employeeName"
                        onChange={this.handleChangeEmployeeName}
                        onBlur={this.onblur}
                        value={employeeName}

                        // onChange={() => {
                        //   $(".invoice_vender_menu1").show();
                        // }}
                      />

                      <span
                        onClick={() =>
                          this.setState({ openEmployeeLookupModal: true })
                        }
                        className="input_field_icons padding__right-20"
                      >
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                    <div
                      className={`chart_menue employee_name line_item_chart_menue`}
                    >
                      {clonedEmployeeList.length > 0 ? (
                        <ul className="invoice_vender_menu">
                          {clonedEmployeeList.map((c, i) => {
                            return (
                              <li
                                className="cursorPointer"
                                key={i}
                                onClick={() => this.changeEmployeeName(c)}
                              >
                                <div className="vender_menu_right chart_new">
                                  <h3 className="chart_vender_text">
                                    {c.firstName + " " + c.lastName}
                                    {}
                                  </h3>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="sup_nt_fnd text-center">
                          <h6>No Employee Name Found</h6>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group form__inner-flex ">
                <label className="control-label label__wrapper1 form__lbl--one">
                  Approver Group:
                </label>
                <div className="label__wrapper2">
                  <Select
                    className="width-selector border__one-wrapper border__bottom-wrapper"
                    value={{
                      label: approverGroup,
                      value: approverGroup,
                    }}
                    options={approverOptions}
                    // classNamePrefix="custon_select-selector-inner"
                    styles={_customStyles}
                    classNamePrefix="react-select"
                    onChange={(g) => this.setState({ approverGroup: g.value })}
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
                </div>
              </div>

              <div className="form-group form__inner-flex ">
                <label className="control-label label__wrapper12 form__lbl--one">
                  Period Ending:
                </label>
                <div className="margin__wrapper--right">
                  <DatePicker
                    allowClear={false}
                    open={isWebCalOpen}
                    // disabledDate={this.disabledDate}
                    value={weekEndingDate}
                    format={dateFormat}
                    onChange={this.handlePeriodEnding}
                    onClick={() => this.toggleCalendar("isWebCalOpen", "click")}
                    onBlur={() => this.toggleCalendar("isWebCalOpen", "blur")}
                  />
                </div>
                <div className="col-xs-1 calendar_time2 calendar__icon--four">
                  <a
                    href="javascript:void(0)"
                    onClick={() => this.toggleCalendar("isMobCalOpen", "click")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2936.352 349.176 18.501 23.145"
                    >
                      <path
                        id="ic_date_range_24px"
                        className="cls-1"
                        d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z"
                        transform="translate(2933.352 347.176)"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="form-group form__inner-flex ">
                <label
                  className="control-label label__wrapper1 form__lbl--one"
                  htmlFor="Dept"
                >
                  Department:
                </label>
                <div className="label__wrapper2">
                  <input
                    className="form-control pro_input_pop"
                    type="text"
                    id="department"
                    name="department"
                    defaultValue={department}
                    onBlur={this.handleChangeField}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label label__wrapper1 form__lbl--one"
                  htmlFor="Position"
                >
                  Position:
                </label>
                <div className="label__wrapper2">
                  <input
                    className="form-control pro_input_pop"
                    type="text"
                    id="position"
                    name="position"
                    defaultValue={position}
                    onBlur={this.handleChangeField}
                  />
                </div>
              </div>

              <div className="clearfix"></div>
            </form>

            <div className="clear5"></div>
            <div className="col-xs-12 p0 btn_time_time2_svg position-relative-wrapper">
              <input
                name=""
                className="btn_time_time2"
                value={
                  weekEndingDate !== ""
                    ? "Times " + totalHours + " Hrs"
                    : "Times 00:00 Hrs"
                }
                type="button"
                onClick={() => this.handleSubView("WeekTimes")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-4690 1327 10 16.19"
              >
                <path
                  id="ic_chevron_right_24px"
                  className="cls-1"
                  d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z"
                  transform="translate(-4698.59 1321)"
                />
              </svg>
            </div>
            <div className="clear5"></div>

            <div className="col-sm-12 p-0">
              <div className="heading_1">Attachment</div>

              <div className="col-12 mt-2">
                <div className="form-group custon_select border text-center mb-0 border-rad-5">
                  <div id="drop-area">
                    <input
                      type="file"
                      id="fileElem-attach"
                      className="form-control d-none"
                      accept="application/pdf"
                      onChange={(e) => {
                        this.uploadAttachment(e.target.files);
                      }}
                      onClick={(event) => {
                        event.currentTarget.value = null;
                      }} //to upload the same file again
                    />
                    <label className="upload-label" htmlFor="fileElem-attach">
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

              <div className="clear10"></div>
              <div className="flex__wrapper--four">
                <input
                  name=""
                  className="btn_submit_res3 pull-right mr__right-wrapper"
                  type="button"
                  value="Save"
                  onClick={() => {
                    isPrimed ? this.insertTimecard() : this.updateTimecard();
                  }}
                />

                <input
                  name=""
                  className="btn_save_res3 pull-right"
                  type="button"
                  value={"Cancel"}
                  onClick={this.onCancel}
                />
              </div>
              <div className="clear40"></div>
              <div className="clear20"></div>
            </div>
          </div>

          <div className="clear40"></div>
        </div>
      );
    } else {
      return (
        <div className="col-xs-12 col-sm-12 col-md-12 time_table_mrg">
          <div className="heading_1">Digital Timesheet</div>
          <div className="clear20"></div>

          <div className="col-sm-12 profile_setting_pop p0">
            <form className="form-horizontal mtop-wrapper">
              <div className="form-group form__inner-flex">
                <label className="control-label col-sm-4 col-md-3  col__label--wrapper form__lbl--one">
                  Employee Name:
                </label>
                <div className="col-sm-7 col-md-4  col__mx--100 period_ending">
                  <div className="custon_select">
                    <div className="modal_input">
                      <input
                        type="text"
                        className={
                          "form-control focus_employee border__one-wrapper"
                        }
                        placeholder="Employee Name"
                        id="employee_name_input"
                        autoComplete="off"
                        name="employeeName"
                        onChange={this.handleChangeEmployeeName}
                        onBlur={this.onblur}
                        value={employeeName}

                        // onChange={() => {
                        //   $(".invoice_vender_menu1").show();
                        // }}
                      />

                      <span
                        onClick={() =>
                          this.setState({ openEmployeeLookupModal: true })
                        }
                        className="input_field_icons padding__right-20"
                      >
                        <i className="fa fa-search"></i>
                      </span>
                    </div>
                    <div
                      className={`chart_menue employee_name line_item_chart_menue`}
                    >
                      {clonedEmployeeList.length > 0 ? (
                        <ul className="invoice_vender_menu">
                          {clonedEmployeeList.map((c, i) => {
                            return (
                              <li
                                className="cursorPointer"
                                key={i}
                                onClick={() => this.changeEmployeeName(c)}
                              >
                                <div className="vender_menu_right chart_new">
                                  <h3 className="chart_vender_text">
                                    {c.firstName + " " + c.lastName}
                                    {}
                                  </h3>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="sup_nt_fnd text-center">
                          <h6>No Employee Name Found</h6>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group form__inner-flex">
                <label className="control-label col-sm-4 col-md-3 col__label--wrapper form__lbl--one">
                  Approver Group:
                </label>

                <div className="col-sm-7 col-md-4  col__mx--100 form-group custon_select custom_selct2">
                  <Select
                    className="width-selector border__one-wrapper border__bottom-wrapper"
                    value={{
                      label: approverGroup,
                      value: approverGroup,
                    }}
                    options={approverOptions}
                    // classNamePrefix="custon_select-selector-inner"
                    styles={_customStyles}
                    classNamePrefix="react-select"
                    onChange={(g) => this.setState({ approverGroup: g.value })}
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
                </div>
              </div>
              <div className="form-group form__inner-flex">
                <label className="control-label col-sm-4 col-md-3 col__label--wrapper form__lbl--one">
                  Period Ending:
                </label>
                <div className="col-sm-4 col-md-9 period_ending flex__wrap--one">
                  <DatePicker
                    allowClear={false}
                    open={isWebCalOpen}
                    // disabledDate={this.disabledDate}
                    value={weekEndingDate}
                    format={dateFormat}
                    onChange={this.handlePeriodEnding}
                    onClick={() => this.toggleCalendar("isWebCalOpen", "click")}
                    onBlur={() => this.toggleCalendar("isWebCalOpen", "blur")}
                  />
                  <a
                    className="calendar_time2 timecard_cldr2 calednr__icon ml-20-wrapper"
                    href="javascript:void(0)"
                    onClick={() => this.toggleCalendar("isWebCalOpen", "click")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2936.352 349.176 18.501 23.145"
                    >
                      <path
                        id="ic_date_range_24px"
                        className="cls-1"
                        d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z"
                        transform="translate(2933.352 347.176)"
                      />
                    </svg>
                  </a>

                  <button
                    type="button"
                    href="#"
                    className="btn_copy_time"
                    onClick={this.handleCopyLastWeekTimes}
                  >
                    <span>Copy Last Weeks Times</span>
                  </button>
                </div>
                {/* <div className="col-sm-4 col-md-3 ">
                
                </div> */}
                {/* <div className="col-sm-1 col-md-1 calendar_time2 timecard_cldr2 calednr__icon cl__icon-wrapper-three">
                </div> */}
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-sm-4 col-md-3 col__label--wrapper form__lbl--one"
                  htmlFor="department"
                >
                  Department:
                </label>
                <div className="col-sm-7 col-md-4  col__mx--100">
                  <input
                    className="form-control pro_input_pop"
                    type="text"
                    id="department"
                    name="department"
                    defaultValue={department}
                    onBlur={this.handleChangeField}
                  />
                </div>
              </div>

              <div className="form-group form__inner-flex">
                <label
                  className="control-label col-sm-4 col-md-3 col__label--wrapper form__lbl--one"
                  htmlFor="position"
                >
                  Position:
                </label>
                <div className="col-sm-7 col-md-4  col__mx--100">
                  <input
                    className="form-control pro_input_pop"
                    type="text"
                    id="position"
                    name="position"
                    defaultValue={position}
                    onBlur={this.handleChangeField}
                  />
                </div>
              </div>

              <div className="clear20"></div>
            </form>
          </div>
          <div className="clear10"></div>
          <div>
            <div className="col-md-12 p-0">
              <div className=" d-flex justify-content-end s-c-main icon_pad_top">
                <button
                  className="new_poedit_add_btn btn__plus--wrapper"
                  type="button"
                  tabIndex="2231"
                  id="id_save111"
                  onClick={this.addDailyTimesRow}
                >
                  <i
                    className="fa fa-plus icon--font_20"
                    aria-hidden="true"
                  ></i>
                  {/* <img
                                        src="images/plus-round.png"
                                        className="btn img-fluid float-right pr-0"
                                        alt="user"
                                      /> */}
                </button>
                <button
                  className="new_poedit_add_btn btn__plus--wrapper"
                  type="button"
                  tabIndex="2231"
                  id="id_save111"
                  onClick={this.delteSelctedDailyTimesRow}
                >
                  <i
                    className="fa fa-trash icon--font_20"
                    aria-hidden="true"
                  ></i>
                  {/* <img
                                        src="images/plus-round.png"
                                        className="btn img-fluid float-right pr-0"
                                        alt="user"
                                      /> */}
                </button>
              </div>
            </div>
          </div>
          <table className="table table-bordered table-sm timecard2_table">
            <thead>
              <tr>
                <th width="3%" align="center" className="timecrd-tbl-innerth">
                  <div className="form-group remember_check pt-0">
                    <input
                      type="checkbox"
                      id="checkAllDailtyTimes"
                      checked={
                        this.state.checkAll ? this.state.checkAll : false
                      }
                      onChange={(e) => this.checkBoxHandler(e)}
                      // onChange={(e) =>
                      //   this.handleCheckboxesInOrderDetails(e, "all")
                      // }
                    />
                    <label
                      htmlFor="checkAllDailtyTimes"
                      className="mr-0"
                    ></label>
                  </div>
                </th>
                <th width="8%" align="center" className="timecrd-tbl-innerth">
                  Date
                </th>
                <th width="6%" align="center" className="timecrd-tbl-innerth">
                  Day
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Cam Call
                </th>
                <th width="6%" align="center" className="timecrd-tbl-innerth">
                  Cam Wrap
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Travel
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Start
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Meal
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Finish
                </th>
                <th width="5%" align="center" className="timecrd-tbl-innerth">
                  Travel
                </th>
                <th width="7%" align="center" className="timecrd-tbl-innerth">
                  Hours
                </th>
                <th width="15%" align="center" className="timecrd-tbl-innerth">
                  Pmt Flags
                </th>
                <th width="35%" align="center" className="timecrd-tbl-innerth">
                  Note
                </th>
                <th width="8%" align="center" className="timecrd-tbl-innerth">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody style={{ color: "#aaaaaa" }}>
              {weekEndingDate !== "" ? (
                dailyTimes.length === 0 ? (
                  <tr key="empty">
                    <td align="center" colSpan="5">
                      <strong>Please select period ending date.</strong>
                    </td>
                  </tr>
                ) : (
                  this.renderDailyTimesList(dailyTimes, view)
                )
              ) : (
                <tr key="empty">
                  <td align="center" colSpan="9">
                    <strong>Please select period ending date.</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="clear10"></div>
          <div className="row">
            <div className="col-sm-12 p0 ">
              <div className="flex__inner-wrapperone">
                <div className="label__total-wrapper label_timecard2">
                  Total(Hrs):
                </div>
                <div className=" ">
                  <button type="button" href="#" className="btn_price_time2">
                    <span>{weekEndingDate !== "" ? totalHours : "00:00"}</span>
                  </button>
                </div>

                <div className="ml-left-wrapper">
                  <button className="btn" onClick={this.zeroHours}>
                    Zero Hours
                  </button>
                </div>
                <div>
                  <button className="btn" onClick={this.clearPmtTages}>
                    Clear PMT Flags
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="departments__table2 table__advance--inner timcard-tbl-wrapperone">
            <h2>Advanced</h2>
            <table className="table " id="timecard-advanced-list" width="100%">
              <thead className="thead_bg hover-border">
                <tr>
                  <th
                    scope="col"
                    className="font--fourteen-wrapper calculate__tbl-thfirst"
                  >
                    {" "}
                  </th>
                  <th
                    scope="col"
                    className="font--fourteen-wrapper calculate__tbl-th"
                  >
                    <span className="user_setup_hed">Category</span>
                  </th>
                  <th
                    scope="col"
                    className="font--fourteen-wrapper calculate__tbl-desc"
                  >
                    <span className="user_setup_hed">Description</span>
                  </th>
                  <th
                    className="value__field--wrapperdept font--fourteen-wrapper calculate__tbl-th"
                    scope="col"
                  >
                    <span className="user_setup_hed">value</span>
                  </th>
                  <th
                    className="text__right__contentdept font--fourteen-wrapper calculate__tbl-th"
                    scope="col"
                  >
                    <span className="user_setup_hed">hide</span>
                  </th>
                  <th className="table__inner--th font--fourteen-wrapper calculate__tbl-th">
                    <div className="dropdown">
                      <button
                        aria-haspopup="true"
                        aria-expanded="true"
                        id=""
                        type="button"
                        className="dropdown-toggle btn dept-tbl-menu "
                        data-toggle="dropdown"
                      >
                        <span className="fa fa-bars "></span>
                      </button>
                      <div className="dropdown-menu dept-menu-list dropdown-menu-right">
                        <div className="pr-0 dropdown-item">
                          <div className="form-group remember_check mm_check4">
                            <input
                              type="checkbox"
                              id="showHiddenRows"
                              name="showHiddenRows"
                              checked={showHiddenRows}
                              onClick={this.handleShowHiddenRows}
                            />
                            <label htmlFor="showHiddenRows" className="mr-0">
                              Show Hidden Rows
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {advancedList.map((list, i) => {
                  return (
                    <tr key={i}>
                      <td></td>
                      <td className=" ">{list.category}</td>
                      <td>{list.description}</td>
                      {list.valueType === "List" ? (
                        <td className="pt-0 pb-0 text-left">
                          <Select
                            classNamePrefix="custon_select-selector-inner main__dropdown--wrapper1"
                            // className={
                            //   i == 0
                            //     ? "width-selector only--one input_width2"
                            //     : i == 1
                            //     ? "width-selector only--one input_width2"
                            //     : "width-selector input_width"
                            // }
                            styles={_customStyles}
                            isDisabled={list.readOnly === "Y" ? true : false}
                            value={{
                              label: list.value,
                              value: list.value,
                            }}
                            options={list.valueOptions}
                            onChange={(obj) =>
                              this.handleValueOptions("list", obj, list, i)
                            }
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
                        </td>
                      ) : list.valueType === "Date" ? (
                        <td>
                          <div className="table_input_field">
                            <RDatePicker
                              selected={Number(list.value)}
                              readOnly={list.readOnly === "Y" ? true : false}
                              dateFormat="d MMM yyyy"
                              autoComplete="off"
                              onChange={(date) =>
                                this.handleValueOptions("date", date, list, i)
                              }
                            />
                          </div>
                        </td>
                      ) : list.valueType === "Check" ? (
                        <td>
                          <div className="col-auto p-0">
                            <div className="form-group remember_check text-center pt-0 float-left">
                              <input
                                type="checkbox"
                                readOnly={list.readOnly === "Y" ? true : false}
                                id={`chk${i}`}
                                checked={
                                  list.value === "Y" || list.value === "1"
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  this.handleValueOptions(
                                    "checkbox",
                                    e,
                                    list,
                                    i
                                  )
                                }
                              />
                              <label htmlFor={`chk${i}`}></label>
                            </div>
                          </div>
                        </td>
                      ) : list.valueType === "Numeric" ? (
                        <td>
                          <div className="table_input_field">
                            <input
                              type="number"
                              value={list.value}
                              readOnly={list.readOnly === "Y" ? true : false}
                              onChange={(e) =>
                                this.handleValueOptions("number", e, list, i)
                              }
                            />
                          </div>
                        </td>
                      ) : list.valueType === "Text" ? (
                        <td>
                          <div className="table_input_field">
                            <input
                              type="text"
                              value={list.value}
                              readOnly={list.readOnly === "Y" ? true : false}
                              onChange={(e) =>
                                this.handleValueOptions("text", e, list, i)
                              }
                            />
                          </div>
                        </td>
                      ) : (
                        <td>{list.value}</td>
                      )}
                      <td className="text__right--user">
                        <div className="custom-radio">
                          <label
                            className="check_main remember_check"
                            htmlFor={`hideUnhideRows${i}`}
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name={"hideUnhideRows"}
                              id={`hideUnhideRows${i}`}
                              checked={false}
                              onChange={(e) => this.handleHideUnhideRows(list)}
                            />

                            {/* <span className='click_checkmark'></span> */}
                            <span
                              className={
                                list.hide
                                  ? "dash_checkmark bg_clr"
                                  : "dash_checkmark"
                              }
                            ></span>
                          </label>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="col-12 mt-2 p-0">
            <div className="form-group custon_select border text-center mb-0 border-rad-5 image__upload--wrapper mb-3">
              <div id="drop-area">
                <input
                  type="file"
                  id="fileElem"
                  className="form-control d-none"
                  accept="application/pdf"
                  onChange={(e) => {
                    this.uploadAttachment(e.target.files);
                  }}
                  onClick={(event) => {
                    event.currentTarget.value = null;
                  }} //to upload the same file again
                />
                <label className="upload-label" htmlFor="fileElem">
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
          {attachments.length > 0 &&
            attachments.map((a, i) => {
              return (
                <div key={i} className="col-md-12 mb-md-4">
                  <span className="del_notes">
                    <i
                      onClick={() => this.deleteAttachment(a.recordID)}
                      className="fa fa-times cursorPointer"
                    ></i>

                    <span
                      onClick={() => this.getAttachment(a.recordID)}
                      className="cursorPointer"
                    >
                      {a.fileName || ""}
                    </span>
                  </span>
                </div>
              );
            })}
          <div className="mtop-wrapper">
            <button
              className="btn btn__save-wrapper"
              onClick={() => {
                isPrimed ? this.insertTimecard() : this.updateTimecard();
              }}
            >
              Save
            </button>
            <button className="btn btn__cancel-wrapper" onClick={this.onCancel}>
              Cancel
            </button>
          </div>
        </div>
      );
    }
  };

  // hanldle change field
  handleChangeField = async (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  handleChangeDayTimeType = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  updateTimeType = async (e, modal) => {
    let { name, value } = e.target;
    let { format } = this.state;
    value = value ? value.trim() : "";
    let isValid = true;
    if (value.length > 5) {
      isValid = false;
    } else {
      let timeParts = value.split(/[:,.]/);
      if (timeParts.length > 2) {
        isValid = false;
      } else if (timeParts.length === 1) {
        value = ("0000" + value).slice(-4);
        value = value.substring(0, 2) + ":" + value.substring(2, value.length);
      } else {
        value =
          ("00" + timeParts[0]).slice(-2) +
          ":" +
          ("00" + timeParts[1]).slice(-2);
      }
    }

    if (!moment(value, this.state.format, true).isValid() || !isValid) {
      value = "00:00";
      toast.error("Time string is not valid.");
    }

    this.setState(
      {
        [name]: value,
      },
      () => {
        if (name === "camCallType") {
          this.handleChangeCamCallTime(moment(value, format), value);
        } else if (name === "camWrapType") {
          this.handleChangeCamWrapTime(moment(value, format), value);
        } else if (name === "travelToType") {
          this.handleChangeDayTimeTravel1(
            moment(value, format),
            value,
            "",
            modal
          );
        } else if (name === "startWorkType") {
          this.handleChangeDayTimeStart(moment(value, format), value);
        } else if (name === "finishWorkType") {
          this.handleChangeDayTimeFinish(moment(value, format), value);
        } else if (name === "travelFromType") {
          this.handleChangeDayTimeTravel2(
            moment(value, format),
            value,
            "",
            modal
          );
        } else if (name === "totalMBType") {
          console.log("totalMBType");
          this.handleChangeDayTimeTotalMBDed(moment(value, format), value);
        } else if (name === "startMB1Type") {
          this.handleChangeDayTimeStartMeal(moment(value, format), value);
        } else if (name === "finishMB1Type") {
          this.handleChangeDayTimeFinishMeal1(moment(value, format), value);
        } else if (name === "startMB2Type") {
          this.handleChangeDayTimeStartMeal2(moment(value, format), value);
        } else if (name === "finishMB2Type") {
          this.handleChangeDayTimeFinishMeal2(moment(value, format), value);
        } else if (name === "startMB3Type") {
          this.handleChangeDayTimeStartMeal3(moment(value, format), value);
        } else if (name === "finishMB3Type") {
          this.handleChangeDayTimeFinishMeal3(moment(value, format), value);
        } else {
        }
      }
    );
    console.log("value=>>>", value);
  };

  handleChangeDayTimeTypeInline = async (event, index) => {
    let value = event.target.value;
    let name = event.target.name;
    let day = this.state.dailyTimes[index];
    let dailyTimes = this.state.dailyTimes;
    //console.log(day.Day);
    var dayTimeObj = {
      ...dailyTimes[index],
      camCall: name === "camCall" ? value : day.camCall,
      camWrap: name === "camWrap" ? value : day.camWrap,
      travelTo: name === "travelTo" ? value : day.travelTo,
      travelFrom: name === "travelFrom" ? value : day.travelFrom,
      startWork: name === "startWork" ? value : day.startWork,
      totalMB: name === "totalMB" ? value : day.totalMB,
      finishWork: name === "finishWork" ? value : day.finishWork,
    };
    dailyTimes[index] = dayTimeObj;

    console.log("DailyTimes obj=>", dayTimeObj);
    this.setState({ dailyTimes });
  };

  updateTimeTypeInline = async (e, index, modal) => {
    let { format } = this.state;
    let name = e.target.name;
    var value = e.target.value;
    value = value ? value.trim() : "";
    var isValid = true;
    if (value.length > 5) {
      isValid = false;
    } else {
      let timeParts = value.split(/[:,.]/);
      console.log(timeParts);
      if (timeParts.length > 2) {
        isValid = false;
      } else if (timeParts.length === 1) {
        value = ("0000" + value).slice(-4);
        value = value.substring(0, 2) + ":" + value.substring(2, value.length);
      } else {
        value =
          ("00" + timeParts[0]).slice(-2) +
          ":" +
          ("00" + timeParts[1]).slice(-2);
        //value = value.substring(0, 2) + ":" + value.substring(2, value.length);
      }
    }

    if (!moment(value, this.state.format, true).isValid() || !isValid) {
      value = "00:00";
      toast.error("Time string is not valid.");
    }
    //console.log("Update Time=>",moment(value, this.state.format));
    if (name === "camCall") {
      this.handleChangeCamCallTime(moment(value, format), value, index);
    } else if (name === "camWrap") {
      this.handleChangeCamWrapTime(moment(value, format), value, index);
    } else if (name === "travelTo") {
      this.handleChangeDayTimeTravel1(
        moment(value, format),
        value,
        index,
        modal
      );
    } else if (name === "startWork") {
      this.handleChangeDayTimeStartInline(moment(value, format), value);
    } else if (name === "finishWork") {
      this.handleChangeDayTimeFinishInline(moment(value, format), value);
    } else if (name === "travelFrom") {
      this.handleChangeDayTimeTravel2(
        moment(value, format),
        value,
        index,
        modal
      );
    } else if (name === "totalMB") {
      console.log("totalMB");
      this.handleChangeDayTimeTotalMBDedInline(moment(value, format), value);
    } else {
    }
  };

  render() {
    let {
      width,
      isLoading,
      subView,
      dayTimeDateMoment,
      dailyTimes,
      dateFormat,
      minuteStep,
      inputReadOnly,
      allowEmpty,
      startWork,
      format,
      payAs,
      day,
      travelFrom,
      totalMB,
      totalMBDedDisabled,
      startMB1,
      finishMB1,
      startMB2,
      finishMB2,
      startMB3,
      finishMB3,
      nonDeductableMB2,
      nonDeductableMB1,
      nonDeductableMB3,
      finishWork,
      travelTo,
      totalHours,
      notes,
      dayTimeIndex,
      saveDayTimeError,
      openCalculateDayModal,
      openEmployeeLookupModal,
      employeeList,
      employeeName,
      employeeCode,
      dayTimeCopyIndex,
      dayTimeTotalHours,
      dailyTimeAdvancedList,
      showHiddenRowsDailyTime,
    } = this.state;
    return (
      <>
        {isLoading ? <div className="se-pre-con"></div> : ""}

        {width >= 768 ? (
          <>
            {" "}
            <Header props={this.props} timecards={true} />
            <TopNav />
          </>
        ) : (
          ""
        )}

        <div
          className="col-xs-12  col-sm-12 col-md-12 mrg_dashboard_right timecard--inner--container"
          style={{ background: "#ffffff", color: "#707070" }}
        >
          {isLoading ? <div className="is-loading"></div> : ""}
          <div className="clear40"></div>

          {width >= 768 ? (
            subView === "Add" ? (
              this.renderAddView("web")
            ) : (
              ""
            )
          ) : (
            <>
              {subView === "Add" ? this.renderAddView("mobile") : ""}

              {subView === "WeekTimes" ? this.renderWeekTimes("mobile") : ""}
              {subView === "DayTimes" ? this.renderDayTimes("mobile") : ""}
              {subView === "BreakTimes" ? this.renderBreakTimes("mobile") : ""}
            </>
          )}

          {/*WeekTimesModalCenter Start*/}
          <div
            className="modal fade custm__mdl-wrapper timecard-mdl"
            id="WeekTimesModalCenter"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered timecard_2popup"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header modal_header_register">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    id="WeekTimesModalCenterClose"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body register_suc timecard2_popup register_suc_scrol">
                  <button
                    type="button"
                    className="btn_copytime"
                    onClick={() =>
                      this.handleCopyYesterdaysTimes(dayTimeCopyIndex)
                    }
                  >
                    <span>Copy Yesterdays Times</span>
                  </button>

                  <div className="clear20"></div>

                  <div className="col-sm-12 profile_setting_pop">
                    <form className="form-horizontal" action="/action_page.php">
                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Pay As"
                        >
                          Pay As
                        </label>
                        <div className="col-sm-5">
                          <select
                            className="form-control pro_input_pop"
                            name="payAs"
                            value={payAs}
                            onChange={this.handleChangeDayTime}
                          >
                            <option value="0">Select</option>
                            {this.renderPayasDropdown()}
                          </select>
                        </div>
                      </div>
                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Last Name"
                        >
                          Date
                        </label>
                        <div
                          className="col-sm-3 period_ending_popup3"
                          style={{ textAlign: "left" }}
                        >
                          <DatePicker
                            // getPopupContainer={(triggerNode) =>
                            //   triggerNode.parentNode
                            // }
                            getPopupContainer={(triggerNode) =>
                              triggerNode.parentNode
                            }
                            // allowClear={false}
                            // className="calendarDayTimeDateWeb"
                            // disabledDate={this.disabledDate}
                            // value={moment(this.state.date * 1000)}
                            // format={dateFormat}

                            value={moment(
                              this.dailyTimesDateFormat(this.state.date),
                              dateFormat
                            )}
                            allowClear={false}
                            format={dateFormat}
                            onChange={(e) =>
                              this.handlerDateChangeForIndividualLine(e)
                            }
                          />
                        </div>
                        <div className="col-sm-1 time_card_popup3 icon__wrapper--calendar22">
                          <a
                            href="javascript:void(0)"
                            onClick={() =>
                              this.handleCalendar(".calendarDayTimeDateWeb")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="2936.352 349.176 18.501 23.145"
                            >
                              <path
                                id="ic_date_range_24px"
                                className="cls-1"
                                d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z"
                                transform="translate(2933.352 347.176)"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Email"
                        >
                          Day
                        </label>
                        <div
                          className="col-sm-8 text-left"
                          style={{ paddingTop: "7px" }}
                        >
                          {this.state.day}
                        </div>
                      </div>
                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Cam Call
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={moment(this.state.camCall, format)}
                              format={format}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              onChange={(moment, time) =>
                                this.handleChangeCamCallTime(moment, time)
                              }
                              // onChange={this.handleChangeDayTimeStart}
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="camCallType"
                              value={
                                this.state.camCallType == "00:00"
                                  ? ""
                                  : this.state.camCallType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Cam Wrap
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={moment(this.state.camWrap, format)}
                              format={format}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              onChange={(moment, time) =>
                                this.handleChangeCamWrapTime(moment, time)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="camWrapType"
                              value={
                                this.state.camWrapType == "00:00"
                                  ? ""
                                  : this.state.camWrapType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Travel To
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={moment(this.state.travelTo, format)}
                              format={format}
                              onChange={(m, t) =>
                                this.handleChangeDayTimeTravel1(m, t, "", true)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="travelToType"
                              value={
                                this.state.travelToType == "00:00"
                                  ? ""
                                  : this.state.travelToType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Start Work
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={startWork}
                              format={format}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              onChange={this.handleChangeDayTimeStart}
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="startWorkType"
                              value={
                                this.state.startWorkType == "00:00"
                                  ? ""
                                  : this.state.startWorkType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Meal Break
                        </label>
                        <div className="col-sm-3">
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={totalMB}
                              format={format}
                              onChange={this.handleChangeDayTimeTotalMBDed}
                              disabled={totalMBDedDisabled}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="totalMBType"
                              value={
                                this.state.totalMBDedDisabled
                                  ? moment(totalMB, "hmm").format("HH:mm")
                                  : this.state.totalMBType == "00:00"
                                  ? ""
                                  : this.state.totalMBType
                              }
                              disabled={this.state.totalMBDedDisabled}
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>

                        <div className="col-sm-2 p0">
                          <div id="accordion">
                            <div className="card">
                              <div
                                className="card-header card__header--wrapper1"
                                id="headingfour"
                              >
                                {/* <h5 className="mb-0"> */}
                                <p
                                  className="btn btn-link btn__chevron--wrapper"
                                  data-toggle="collapse"
                                  data-target="#collapseOne"
                                  aria-expanded="true"
                                  aria-controls="collapseOne"
                                >
                                  <i
                                    className="fa fa-chevron-down rotate"
                                    aria-hidden="true"
                                  ></i>
                                </p>
                                {/* </h5> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="collapseOne"
                        className="collapse "
                        aria-labelledby="headingfour"
                        data-parent="#accordion"
                      >
                        <div className="card-body crd__custm--wrapper">
                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Start MB1
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={startMB1}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeStartMeal}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="startMB1Type"
                                  value={
                                    this.state.startMB1Type == "00:00"
                                      ? ""
                                      : this.state.startMB1Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Finish MB1
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={finishMB1}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeFinishMeal1}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="finishMB1Type"
                                  value={
                                    this.state.finishMB1Type == "00:00"
                                      ? ""
                                      : this.state.finishMB1Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Start MB2
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={startMB2}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeStartMeal2}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="startMB2Type"
                                  value={
                                    this.state.startMB2Type == "00:00"
                                      ? ""
                                      : this.state.startMB2Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Finish MB2
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={finishMB2}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeFinishMeal2}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="finishMB2Type"
                                  value={
                                    this.state.finishMB2Type == "00:00"
                                      ? ""
                                      : this.state.finishMB2Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Start MB3
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={startMB3}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeStartMeal3}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="startMB3Type"
                                  value={
                                    this.state.startMB3Type == "00:00"
                                      ? ""
                                      : this.state.startMB3Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Finish MB3
                            </label>
                            <div
                              className="col-sm-8"
                              style={{ textAlign: "left" }}
                            >
                              {this.state.timecardEntry !== "Text" ? (
                                <TimePicker
                                  showNow={false}
                                  allowClear={false}
                                  // minuteStep={minuteStep}
                                  minuteStep={
                                    this.state.timecardInterval
                                      ? this.state.timecardInterval
                                      : 1
                                  }
                                  inputReadOnly={inputReadOnly}
                                  allowEmpty={allowEmpty}
                                  value={finishMB3}
                                  format={format}
                                  getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                  }
                                  onChange={this.handleChangeDayTimeFinishMeal3}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control pro_input_pop custom-time-field"
                                  name="finishMB3Type"
                                  value={
                                    this.state.finishMB3Type == "00:00"
                                      ? ""
                                      : this.state.finishMB3Type
                                  }
                                  placeholder="00:00"
                                  onChange={this.handleChangeDayTimeType}
                                  onBlur={(e) => this.updateTimeType(e, true)}
                                />
                              )}
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Non Deductible MB1:
                            </label>
                            <div className="col-sm-1 checkbox_popuptime">
                              <input
                                type="checkbox"
                                name="nonDeductableMB1"
                                onChange={this.handleChangeDayTime}
                                checked={nonDeductableMB1}
                              />
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Non Deductible MB2:
                            </label>
                            <div className="col-sm-1 checkbox_popuptime">
                              <input
                                type="checkbox"
                                name="nonDeductableMB2"
                                onChange={this.handleChangeDayTime}
                                checked={nonDeductableMB2}
                              />
                            </div>
                          </div>

                          <div className="form-group form__inner-flex">
                            <label
                              className="control-label col-sm-3 form__lbl--one"
                              htmlFor="Mobile"
                            >
                              Non Deductible MB3:
                            </label>
                            <div className="col-sm-1 checkbox_popuptime">
                              <input
                                type="checkbox"
                                name="nonDeductableMB3"
                                onChange={this.handleChangeDayTime}
                                checked={nonDeductableMB3}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Finish Work
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={finishWork}
                              format={format}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              onChange={this.handleChangeDayTimeFinish}
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="finishWorkType"
                              value={
                                this.state.finishWorkType == "00:00"
                                  ? ""
                                  : this.state.finishWorkType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Travel From
                        </label>
                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          {this.state.timecardEntry !== "Text" ? (
                            <TimePicker
                              showNow={false}
                              allowClear={false}
                              // minuteStep={minuteStep}
                              minuteStep={
                                this.state.timecardInterval
                                  ? this.state.timecardInterval
                                  : 1
                              }
                              inputReadOnly={inputReadOnly}
                              allowEmpty={allowEmpty}
                              value={moment(this.state.travelFrom, format)}
                              format={format}
                              getPopupContainer={(triggerNode) =>
                                triggerNode.parentNode
                              }
                              onChange={(m, t) =>
                                this.handleChangeDayTimeTravel2(m, t, "", true)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-control pro_input_pop custom-time-field"
                              name="travelFromType"
                              value={
                                this.state.travelFromType == "00:00"
                                  ? ""
                                  : this.state.travelFromType
                              }
                              placeholder="00:00"
                              onChange={this.handleChangeDayTimeType}
                              onBlur={(e) => this.updateTimeType(e, true)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Total Hours
                        </label>
                        <div
                          className="col-sm-8 text-left"
                          style={{ paddingLeft: "27px", paddingTop: "7px" }}
                        >
                          {dayTimeTotalHours}
                        </div>
                      </div>

                      <div className="form-group form__inner-flex">
                        <label
                          className="control-label col-sm-3 form__lbl--one"
                          htmlFor="Mobile"
                        >
                          Note
                        </label>
                        <div className="col-sm-8">
                          <textarea
                            name="notes"
                            value={notes ? notes : ""}
                            className="form-control pro_input_pop"
                            rows=""
                            onChange={(e) => this.inputHandlerChangeFeild(e)}
                            // onChange={this.handleChangeDayTime}
                          ></textarea>
                        </div>
                      </div>

                      <div className="departments__table2">
                        <h2>Advanced</h2>
                        <table
                          className="table mb-3"
                          id="dailyTimes-table"
                          width="100%"
                        >
                          <thead className="thead_bg hover-border">
                            <tr>
                              <th scope="col"> </th>
                              <th scope="col">
                                <span className="user_setup_hed">Category</span>
                              </th>
                              <th scope="col">
                                <span className="user_setup_hed">
                                  Description
                                </span>
                              </th>
                              <th
                                className="value__field--wrapperdept"
                                scope="col"
                              >
                                <span className="user_setup_hed">value</span>
                              </th>
                              <th
                                className="text__right__contentdept"
                                scope="col"
                              >
                                <span className="user_setup_hed">hide</span>
                              </th>
                              <th className="table__inner--th">
                                <div className="dropdown">
                                  <button
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                    id=""
                                    type="button"
                                    className="dropdown-toggle btn dept-tbl-menu "
                                    data-toggle="dropdown"
                                  >
                                    <span className="fa fa-bars "></span>
                                  </button>
                                  <div className="dropdown-menu dept-menu-list dropdown-menu-right">
                                    <div className="pr-0 dropdown-item">
                                      <div className="form-group remember_check mm_check4">
                                        <input
                                          type="checkbox"
                                          id="showHiddenRowsDailyTime"
                                          name="showHiddenRowsDailyTime"
                                          checked={showHiddenRowsDailyTime}
                                          onClick={this.showHiddenRowsDailyTime}
                                        />
                                        <label
                                          htmlFor="showHiddenRowsDailyTime"
                                          className="mr-0"
                                        >
                                          Show Hidden Rows
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailyTimeAdvancedList.map((list, i) => {
                              return (
                                <tr key={i}>
                                  <td></td>
                                  <td className=" ">{list.category}</td>
                                  <td>{list.description}</td>
                                  {list.valueType === "List" ? (
                                    <td className="pt-0 pb-0 text-left">
                                      <Select
                                        classNamePrefix="custon_select-selector-inner main__dropdown--wrapper1"
                                        styles={_customStyles}
                                        value={{
                                          label: list.value,
                                          value: list.value,
                                        }}
                                        options={list.valueOptions}
                                        onChange={(obj) =>
                                          this.handleValueOptionsDailyTimes(
                                            "list",
                                            obj,
                                            list,
                                            i
                                          )
                                        }
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
                                    </td>
                                  ) : list.valueType === "Date" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <RDatePicker
                                          selected={Number(list.value)}
                                          dateFormat="d MMM yyyy"
                                          autoComplete="off"
                                          getPopupContainer={(triggerNode) =>
                                            triggerNode.parentNode
                                          }
                                          onChange={(date) =>
                                            this.handleValueOptionsDailyTimes(
                                              "date",
                                              date,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : list.valueType === "Check" ? (
                                    <td>
                                      <div className="col-auto p-0">
                                        <div className="form-group remember_check text-center pt-0 float-left">
                                          <input
                                            type="checkbox"
                                            id={`chk${i}`}
                                            checked={
                                              list.value === "Y" ||
                                              list.value === "1"
                                                ? true
                                                : false
                                            }
                                            onChange={(e) =>
                                              this.handleValueOptionsDailyTimes(
                                                "checkbox",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                          <label htmlFor={`chk${i}`}></label>
                                        </div>
                                      </div>
                                    </td>
                                  ) : list.valueType === "Numeric" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <input
                                          type="number"
                                          value={list.value}
                                          onChange={(e) =>
                                            this.handleValueOptionsDailyTimes(
                                              "number",
                                              e,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : list.valueType === "Text" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <input
                                          type="text"
                                          value={list.value}
                                          onChange={(e) =>
                                            this.handleValueOptionsDailyTimes(
                                              "text",
                                              e,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : (
                                    <td>{list.value}</td>
                                  )}
                                  <td className="text__right--user">
                                    <div className="custom-radio">
                                      <label
                                        className="check_main remember_check"
                                        htmlFor={`dt-hideUnhideRows${i}`}
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          name={"dt-hideUnhideRows"}
                                          id={`dt-hideUnhideRows${i}`}
                                          checked={false}
                                          onChange={(e) =>
                                            this.handleHideUnhideRowsDailyTimes(
                                              list
                                            )
                                          }
                                        />

                                        {/* <span className='click_checkmark'></span> */}
                                        <span
                                          className={
                                            list.hide
                                              ? "dash_checkmark bg_clr"
                                              : "dash_checkmark"
                                          }
                                        ></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="clear20"></div>
                      <div className="btn_cance_save">
                        <input
                          name=""
                          className="btn_save_pro"
                          value="Save"
                          type="button"
                          onClick={() =>
                            this.handleSaveDayTime(dayTimeIndex, "Add")
                          }
                        />
                        <input
                          name=""
                          className="btn_cancel_pro"
                          data-dismiss="modal"
                          aria-label="Close"
                          value="Cancel"
                          type="button"
                        />
                      </div>
                    </form>

                    <div className="btn_cance_save2">
                      <input
                        name=""
                        type="button"
                        className="btn_save_pro"
                        value="Save"
                      />
                      <input
                        name=""
                        type="button"
                        className="btn_cancel_pro"
                        value="Cancel"
                      />
                    </div>
                  </div>
                  <div className="clear10"></div>
                  <span
                    className="doc_file_error"
                    style={{ position: "initial" }}
                  >
                    {saveDayTimeError ? saveDayTimeError : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/*WeekTimesModalCenter END*/}
          <button
            data-dismiss="modal"
            data-toggle="modal"
            data-target="#WeekTimesModalCenter"
            id="WeekTimesModalCenterBtn"
            style={{ display: "none" }}
          >
            Show Modal
          </button>
        </div>

        {/* {openCalculateDayModal && ( */}
        <CalculateDayModal
          tran={this.state.tran}
          dailyTimes={this.state.dailyTimes}
          calculateDayTimeCard={this.state.dayCalculateData}
          openCalculateDayModal={openCalculateDayModal}
          closeModal={this.closeCalculateModal}
        />
        {/* )} */}
        <EmployeeLookup
          openEmployeeLookupModal={openEmployeeLookupModal}
          employeeList={employeeList}
          employeeName={employeeName}
          employeeCode={employeeCode}
          updateParentState={this.updateParentState}
          closeModal={() => this.setState({ openEmployeeLookupModal: false })}
          refreshEmployees={this.refreshEmployees}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  timecard: state.timecard,
  user: state.user,
});

export default connect(mapStateToProps, {
  primeTimecard: TimecardActions.primeTimecard,
  copyLastWeeksTimes: TimecardActions.copyLastWeeksTimes,
  insertTimecard: TimecardActions.insertTimecard,
  updateTimecard: TimecardActions.updateTimecard,
  getTimecard: TimecardActions.getTimecard,
  getEmployeeList: TimecardActions.getEmployeeList,
  refreshEmployees: TimecardActions.refreshEmployees,
  addAttachment: TimecardActions.addAttachment,
  deleteAttachment: TimecardActions.deleteAttachment,
  getAttachment: TimecardActions.getAttachment,
  clearTimecardStates: TimecardActions.clearTimecardStates,
  setUserSettings: UserActions.setUserSettings,
})(TimeCard);
