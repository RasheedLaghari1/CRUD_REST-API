import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ChartSort from "../../Modals/ChartSort/ChartSort";
import ChartCode from "../../Modals/ChartCode/ChartCode";
import TrackingCode from "../../Modals/TrackingCode/TrackingCode";
import TimePicker from "rc-time-picker";
import moment from "moment";
import { toast } from "react-toastify";
import momentZones from "moment-timezone";
import $ from "jquery";
import { connect } from "react-redux";

import { _customStyles } from "../../../Constants/Constants";
import {
  calculateLine,
  clearInvoiceStates,
} from "../../../Actions/InvoiceActions/InvoiceActions";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";

//setting all dates and time in GMT format
momentZones.tz.setDefault("GMT");

class LineItem extends Component {
  constructor() {
    super();

    this.fromDateRef = React.createRef()
    this.toDateRef = React.createRef()
    this.state = {
      isLoading: false,
      // actionDisabled: true,
      poUpdated: "Y", //disable PO Number and Action when poUpdated = 'N'
      id: "", //if poline edit case then it contains id of that po line otherwise it will be empty (add case)
      lineNo: '', //line no of a line
      openTaxCodeModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,
      checkAddLineFlag: true,
      addCurrencyFlag: true,
      editPOLineflag: true, //to just call only one time condition in componentWillReceiveProps
      chartSort: "",
      chartCode: "",
      description: "",
      typeDescription: "",
      amount: '', //the net amount of the PO Line

      trackingCodes: [],
      flags: [],
      clonedFlags: [],

      // in case of Invoice
      poNumber: "",
      actions: [
        { label: "Clear", value: "Clear" },
        { label: "Subtract", value: "Subtract" },
        { label: "Ignore", value: "Ignore" },
      ],
      action: "Ignore",
      // END

      //all PO types
      POLineTypes: [
        { label: "Service", value: "Service" },
        { label: "Inventory", value: "Inventory" },
        { label: "Rental/Hire", value: "Rental/Hire" },
        { label: "Car", value: "Car" },
        { label: "Distribution", value: "Distribution" },
      ],
      POType: { label: "Service", value: "Service" }, //default

      //when PO type is Service || Destribution then it comes from api

      customFields: [],
      //when PO type is Inventory
      units: "",

      //when PO type is Car
      driver: "",
      empCode: "",
      raNumber: "",
      registration: "",
      startOdometer: "",
      endOdometer: "",
      vehicle: "",
      hireState: "",

      //when PO type is  car || rental/hire

      rate: "",

      fromDate: moment(new Date()).unix() * 1000,
      toDate: moment(new Date()).unix() * 1000,
      startTime: moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000,
      endTime: moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000,


      basisOptionArr: [{ label: "Select Per Options", value: "" }],
      basis: { label: "Select Per Options", value: "" }, //per value

      // form validation
      formErrors: {
        chartSort: "",
        // chartCode: "",
        description: "",
        amount: "", //the net amount of the PO Line

        basis: "",
        //when PO type is Inventory
        units: "",

        //when PO type is  car || rental/hire

        rate: "",
      },
      clonedChartCodesList: [],
    };
  }

  async componentWillReceiveProps(np) {

    if (this.props.poLineEditData && this.state.editPOLineflag) {
      await this.setState({
        editPOLineflag: false,
        ...this.props.poLineEditData,
      });
      // PO Type Service || Destribution fields are comming in the api so set initial values here
      let {
        customFields,
        type,
        basis,
        fromDate,
        toDate,
        startTime,
        endTime,
        POType,
      } = this.state;
      customFields &&
        customFields.length > 0 &&
        customFields.map(async (c, i) => {
          await this.setState({ [c.prompt]: c.value });
        });

      if (type) {
        if (type === "Hire/Rental" || type === "Rental/Hire") {
          POType = { label: "Rental/Hire", value: "Rental/Hire" };
        } else {
          POType = { label: type, value: type };
        }
      }

      let _type = POType.label || "";
      if (_type === "Rental/Hire") {
        _type = "Hire/Rental";
      }
      let basisOptions = this.props.basisOptions || [];
      let options = [];
      if (_type && basisOptions.length > 0) {
        basisOptions.map((o, i) => {
          if (o.type && o.type.toLowerCase() === _type.toLowerCase()) {
            options.push({ label: o.prompt, value: o.value });
          }
        });
      }

      if (!basis) {
        basis = { label: "Select Per Options", value: "" };
      } else if (!basis.label) {
        basis = { label: basis, value: basis };
      }

      if (!fromDate) {
        fromDate = moment(new Date()).unix() * 1000
      }
      if (!toDate) {
        toDate = moment(new Date()).unix() * 1000
      }
      if (!startTime) {
        startTime = moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000
      }
      if (!endTime) {
        endTime = moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000
      }
      //poLine Edit Case
      let _flgs = [];
      let clonedFlags = [];
      this.state.flags.map((f, i) => {
        _flgs.push(
          {
            ...f,
            label: f.type,
            value: f.value ? f.value : "",
            id: i,
          },
          {
            ...f,
            label: f.value,
            value: f.value ? f.value : "",
            id: i,
          }
        );
        clonedFlags.push({
          type: f.type.toLowerCase(),
          prompt: f.prompt,
          value: f.value ? f.value : "",
          sequence: f.sequence,
        });
      });
      await this.setState({
        flags: _flgs,
        clonedFlags,
        basis,
        fromDate,
        toDate,
        startTime,
        POType,
        basisOptionArr: options,
        endTime,
      });
    } else if (
      // clonedFlags &&
      // clonedFlags.length == 0 &&
      this.props.clonedFlags &&
      this.props.clonedFlags.length > 0 &&
      this.props.flags &&
      this.props.flags.length > 0
    ) {
      //add new case

      let clonedFlags = JSON.parse(JSON.stringify(this.props.clonedFlags));
      let flags = JSON.parse(JSON.stringify(this.props.flags));

      //setting the default values
      let getDefaultValues = localStorage.getItem("getDefaultValues");
      let parsedVals = JSON.parse(getDefaultValues);
      if (
        parsedVals &&
        parsedVals.defaultValues &&
        !this.state.isLoading &&
        !this.props.poLineEditData &&
        this.state.checkAddLineFlag &&
        np.openLineItemModal
      ) {
        /*
            170. Chart Sort and Change in Vendor Currency - 
            When changing the **currency** of a PO at the drafting stage, 
            it should now **replace the chart sort currency for all new lines created** 
            [pic1](https://trello-attachments.s3.amazonaws.com/5de6fc55764de2400c4da294/5e8ecac57ac777499efaf0e7/fed430a504bdab9de93620d9e713879d/image.png) 
            and **all lines saved on the PO** 
            [pic2](https://trello-attachments.s3.amazonaws.com/5de6fc55764de2400c4da294/5e8ecac57ac777499efaf0e7/ccc828dcb877795442e86141ba53cb10/image.png)
          */
        let chartCode = "";
        let chartSort = "";

        if (parsedVals.defaultValues && parsedVals.defaultValues.chartCode) {
          chartCode = parsedVals.defaultValues.chartCode || "";
          await this.setState({ chartCode });
        }
        if (
          parsedVals.defaultValues &&
          parsedVals.defaultValues.chartSort &&
          np.openLineItemModal &&
          this.state.addCurrencyFlag
        ) {
          chartSort = parsedVals.defaultValues.chartSort || "";

          let sortArray = chartSort.split(".");
          if (sortArray.length === 3) {
            let sortCurrency = this.props.currency
              ? this.props.currency
              : sortArray[0]
                ? sortArray[0]
                : "";
            let sortLocation = sortArray[1] ? sortArray[1] : "";
            let sortEpisode = sortArray[2] ? sortArray[2] : "";
            chartSort = sortCurrency + "." + sortLocation + "." + sortEpisode;
          } else {
            chartSort = parsedVals.defaultValues.chartSort || "";
          }

          await this.setState({ addCurrencyFlag: false, chartSort });
        }
        if (
          parsedVals.defaultValues &&
          parsedVals.flags &&
          parsedVals.flags.length > 0
        ) {
          let defaultFlags = parsedVals.flags;
          let _clonedFlags = [];
          let _flags = [];
          clonedFlags.map((c, i) => {
            let obj = defaultFlags.find(
              (f) =>
                f.type &&
                f.type.toLowerCase() === c.type &&
                c.type.toLowerCase()
            );
            c.value = (obj && obj.defaultValue) || "";
            _clonedFlags.push(c);
            return c;
          });

          flags.map((o, i) => {
            let obj = defaultFlags.find(
              (f) =>
                f.type &&
                f.type.toLowerCase() === o.type &&
                o.type.toLowerCase()
            );
            if (o.label && o.label.trim()) {
              o.value = (obj && obj.defaultValue) || "";
            } else {
              o.label = (obj && obj.defaultValue) || "";
              o.value = (obj && obj.defaultValue) || "";
            }
            _flags.push(o);
            return o;
          });
          clonedFlags = _clonedFlags;
          flags = _flags;

          await this.setState({
            clonedFlags,
            flags,
          });
        }
        let suppliersFlags = this.props.suppliersFlags || [];
        if (suppliersFlags.length > 0) {
          //setting the flags -> periority Suppliers flags over users flags
          let finalFlags = [];
          if (
            suppliersFlags.length >= clonedFlags.length &&
            clonedFlags.length > 0
          ) {
            suppliersFlags.map((supFlag, key) => {
              let check = false;
              let flagObj = {};
              for (let index = 0; index < clonedFlags.length; index++) {
                if (
                  supFlag.type.toLowerCase() ===
                  clonedFlags[index].type.toLowerCase()
                ) {
                  if (!suppliersFlags[index].value) {
                    check = true;
                    flagObj = clonedFlags[index];
                  }
                }
              }
              if (check) {
                finalFlags.push(flagObj);
              } else {
                finalFlags.push(supFlag);
              }
            });
          } else if (
            suppliersFlags.length > 0 &&
            suppliersFlags.length < clonedFlags.length
          ) {
            clonedFlags.map((userFlag, key) => {
              let check = false;
              let flagObj = {};
              for (let index = 0; index < suppliersFlags.length; index++) {
                if (
                  userFlag.type.toLowerCase() ===
                  suppliersFlags[index].type.toLowerCase()
                ) {
                  if (suppliersFlags[index].value) {
                    check = true;
                    flagObj = suppliersFlags[index];
                  }
                }
              }

              if (check) {
                finalFlags.push(flagObj);
              } else {
                finalFlags.push(userFlag);
              }
            });
          }

          if (finalFlags.length > 0) {
            let flags = JSON.parse(JSON.stringify(this.props.flags));
            let _flgs = [];
            flags.map((o, i) => {
              let obj = finalFlags.find(
                (f) =>
                  f.type &&
                  f.type.toLowerCase() === o.type &&
                  o.type.toLowerCase()
              );

              if (o.label && o.label.trim()) {
                o.value = (obj && obj.value) || "";
              } else {
                o.label = (obj && obj.value) || "";
                o.value = (obj && obj.value) || "";
              }
              _flgs.push(o);
              return o;
            });

            clonedFlags = finalFlags;
            if (_flgs.length > 0) {
              flags = _flgs;
            }
            await this.setState({
              clonedFlags,
              flags,
            });
          }
        }

        //adding custome fields 
        let customFields = this.props.customFields || []
        customFields.map((c, i) => {
          this.setState({ [c.prompt]: c.value });
        });
        await this.setState({ checkAddLineFlag: false, customFields });
      }
    }
  }

  openModal = async (name) => {
    if (name === "openChartCodeModal") {
      this.setState({ isLoading: true });

      // await this.props.getChartCodes(this.state.chartSort);

      this.setState({ openChartCodeModal: true, isLoading: false });
    } else if (name === "openChartSortModal") {
      this.props.getChartSorts();
      this.setState({ openChartSortModal: true });

    } else {
      this.setState({ [name]: true });
    }
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  clearStates = async () => {
    await this.props.closeModal("openLineItemModal");

    await this.setState({
      isLoading: false,
      // actionDisabled: true,
      poUpdated: "Y", //disable PO Number and Action when poUpdated = 'N'
      id: "",
      lineNo: '', //line no of a line
      openTaxCodeModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,
      checkAddLineFlag: true,
      poNumber: "",
      action: "Ignore",
      addCurrencyFlag: true,
      editPOLineflag: true,
      chartSort: "",
      chartCode: "",
      description: "",
      typeDescription: "",

      amount: "", //the net amount of the PO Line

      trackingCodes: [],
      flags: [],
      clonedFlags: [],
      //all PO types
      POLineTypes: [
        { label: "Service", value: "Service" },
        { label: "Inventory", value: "Inventory" },
        { label: "Rental/Hire", value: "Rental/Hire" },
        { label: "Car", value: "Car" },
        { label: "Distribution", value: "Distribution" },
      ],
      POType: { label: "Service", value: "Service" }, //default
      customFields: [],

      //when PO type is Inventory
      units: "",

      //when PO type is Car
      driver: "",
      empCode: "",
      raNumber: "",
      registration: "",
      startOdometer: "",
      endOdometer: "",
      vehicle: "",
      hireState: "",

      //when PO type is Rental/Hire || car

      rate: "",

      fromDate: moment(new Date()).unix() * 1000,
      toDate: moment(new Date()).unix() * 1000,
      startTime: moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000,
      endTime: moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000,


      basisOptionArr: [{ label: "Select Per Options", value: "" }],
      basis: { label: "Select Per Options", value: "" }, //per value

      // form validation
      formErrors: {
        chartSort: "",
        // chartCode: "",
        description: "",
        amount: "", //the net amount of the PO Line

        //when PO type is Inventory
        units: "",

        //when PO type is  car || rental/hire

        rate: "",
        basis: "",
      },
      clonedChartCodesList: [],
    });
  };
  handleFieldChange = async (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);

    if (this.state.POType.label === "Inventory") {
      if (fieldName === "rate" || fieldName === "units") {
        /*Please look into how inventory lines are calculated. 
        The formula is "Units x Unit Amount = Total".
        The total field cannot be entered in by the user and the total field must be 
        calculated by the above formula. e.g its 1x10 = 10. */
        let { rate, units } = this.state;
        let amount = 0;
        if (fieldName === "rate") {
          if (fieldValue && Number(fieldValue)) {
            amount = Number(units) * Number(fieldValue);
          }
        }
        if (fieldName === "units" && Number(fieldValue)) {
          amount = Number(rate) * Number(fieldValue);
        }
        this.setState({ amount: amount.toFixed(2) });
        this.validateField("amount", amount.toFixed(2));
      }
    }

    // if (fieldName === "poNumber") {
    //   if (!fieldValue.trim()) {
    //     this.setState({ actionDisabled: true });
    //   } else {
    //     this.setState({ actionDisabled: false });
    //   }
    // }
  };
  convertTwoDecimal = (e) => {
    let val = Number(e.target.value).toFixed(2) || 0.00;
    this.setState({ amount: val });
  };
  handleChangeActions = (data) => {
    this.setState({ action: data.value });
  };
  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "chartSort":
        if (value.length < 1) {
          formErrors.chartSort = "This Field is Required.";
        } else {
          formErrors.chartSort = "";
        }
        break;
      // case "chartCode":
      //   if (value.length < 1) {
      //     formErrors.chartCode = "This Field is Required.";
      //   } else {
      //     formErrors.chartCode = "";
      //   }
      //   break;
      case "description":
        if (value.length < 1) {
          formErrors.description = "This Field is Required.";
        } else {
          formErrors.description = "";
        }
        break;
      case "amount":
        if (value.length < 1) {
          formErrors.amount = "This Field is Required.";
        } else {
          formErrors.amount = "";
        }
        break;

      case "units":
        if (value.length < 1) {
          formErrors.units = "This Field is Required.";
        } else {
          formErrors.units = "";
        }
        break;

      case "rate":
        if (value.length < 1) {
          formErrors.rate = "This Field is Required.";
        } else {
          formErrors.rate = "";
        }
        break;
      case "basis":
        if (value.length < 1) {
          formErrors.basis = "This Field is Required.";
        } else {
          formErrors.basis = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  //a function that checks  api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      this.props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      this.props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  handleTrackingCode = async (data) => {
    //data -> { lable: 'tax', value: 01 }, { lable: 'set', value: 02 } etc
    let flags = this.props.flags_api; //object contains multiple flags {  set: [], insurance: [], tax: [] } => get flags api response
    // let flagArr = [];
    let flagsObj = { data };
    for (var f of Object.keys(flags)) {
      if (data.label.toLowerCase() === f.toLowerCase()) {
        // flagArr = flags[f];
        flagsObj.flagArr = flags[f];
      }
    }
    //flagArr contains all flags regarding to selected tracking code
    this.setState({ trackingCodes: flagsObj }, () => this.openModal("openTrackingCodeModal"));

  };
  getUpdatedTrackingCode = async (newVal, prevVal) => {
    //prevVal consists of previous tracking code value and newVal consists of new tracking code value
    let flags = JSON.parse(JSON.stringify(this.state.flags)); //restructured flags
    let clonedFlags = JSON.parse(JSON.stringify(this.state.clonedFlags)); //flags
    let clndObj = clonedFlags.find(
      (f) => f.type.toLowerCase() == prevVal.label.toLowerCase()
    );

    let labelObj = flags.find(
      (f) =>
        f.label.toLowerCase() == prevVal.label.toLowerCase() &&
        f.id == prevVal.id
    ); //e.g {label: 'Insurance', value: 01, id:0}
    let valueObj = flags.find(
      (f) =>
        f.label.toLowerCase() == prevVal.value.toLowerCase() &&
        f.id == prevVal.id
    ); //e.g {label: 01, value: 01, id:0}

    if (labelObj && valueObj && clndObj) {
      labelObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["label"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      clndObj["value"] = newVal.code; //update value to send to backend ( when add/update PO)
      // await this.props.updateFlags(flags, clonedFlags); //update flags

      this.setState({ flags, clonedFlags });
    }
  };
  //handle change time
  onChangeTime = async (name, time) => {
    if (time) {
      time = time
    } else {
      time = moment(new Date().setUTCHours(0, 0, 0)).unix() * 1000
    }

    this.setState({ [name]: moment(time).unix() * 1000 }, () => {
      this.calculateLine();
    });

  };
  //handle change date
  handleDateChange = (date, name) => {

    this.setState({
      [name]: moment(date).unix() * 1000
    }, () => {
      this.calculateLine();
    });

  };
  //get new chart sort value through chart sort modal
  getUpdatedChartSort = async (chartSort) => {
    if (chartSort) {
      this.setState({ chartSort });
    }
    this.validateField("chartSort", chartSort);
  };
  handleChangeChartSort = async (e) => {
    let value = e.target.value;
    this.setState({ chartSort: value });
    this.validateField("chartSort", value);
  };
  //get new chart code value through chart code modal
  getUpdatedChartCode = async (chartCode) => {
    // if (chartCode) {
    this.setState({ chartCode });
    //  this.validateField("chartCode", chartCode);
  };
  //handle auto-completing and typing into the Chart Code
  handleChangeChartCode = async (e) => {
    $(".chart").show();
    let value = e.target.value;
    let clonedChartCodesList = [...this.props.chartCodesList]

    if (!value) {
      clonedChartCodesList = []
    } else {
      let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
        return (c.code.toUpperCase().includes(value.toUpperCase()) ||
          c.description.toUpperCase().includes(value.toUpperCase())) &&
          c.sort.toUpperCase() === this.state.chartSort
      });
      clonedChartCodesList = chartCodesListFilterdData;
    }
    this.setState({ chartCode: value, clonedChartCodesList });

  };
  //when select code from suggestions e.g. auto-completion
  changeChartCode = async (obj) => {
    //focus after chart code selection to move next on Tab press
    $(`#chrtCode_id`).focus();

    let chartCode = obj.code || "";
    this.setState({ chartCode });
  };
  onblur = (i) => {
    setTimeout(() => {
      $(".chart").hide();
    }, 700);
  };
  handleChangeBasis = (basis) => {
    this.setState({ basis }, () => {
      this.calculateLine();
    });
    this.validateField("basis", basis.value);

  };
  handleChangePOLineType = async (type) => {
    let _type = type.label || "";
    if (_type === "Rental/Hire") {
      _type = "Hire/Rental";
    }
    let basisOptions = this.props.basisOptions || [];
    let options = [];
    if (_type && basisOptions.length > 0) {
      basisOptions.map((o, i) => {
        if (o.type && o.type.toLowerCase() === _type.toLowerCase()) {
          options.push({ label: o.prompt, value: o.value });
        }
      });
    }

    this.setState({
      POType: type,
      basisOptionArr: options,
      basis: { label: "Select Per Options", value: "" },
      amount: "",
      units: "",
      rate: "",
    });
  };
  // API to calculate the line amount when type is car OR rental/hire
  calculateLine = async (check) => {
    let lineType = this.state.POType.label; //type: Service || Inventory || Rental/Hire || Car || Distribution

    let {
      basis,
      fromDate,
      toDate,
      startTime,
      endTime,
      rate,
      amount,
      description,
      registration,
      vehicle,
      driver,
      raNumber,
      units,
    } = this.state;

    let obj = {
      lineType,

      amount: Number(amount),
      description,
    };
    if (lineType === "Car") {
      obj = {
        ...obj,
        basis: basis.value,
        rate: Number(rate),
        registration,
        vehicle,
        driver,
        raNumber,
        startDate: fromDate,
        startTime,
        endDate: toDate,
        endTime,
      };
    }
    if (lineType === "Rental/Hire") {
      obj = {
        ...obj,
        startDate: fromDate,
        startTime,
        endDate: toDate,
        endTime,
        basis: basis.value,
        rate: Number(rate),
      };
    }

    if (lineType === "Inventory") {
      obj = { ...obj, quantity: units, rate: Number(rate) };
    }

    if (lineType === "Car" || lineType === "Rental/Hire") {
      if (rate != "" && Number(rate) != 0) {
        if (basis && basis.value) {
          this.setState({ isLoading: true });

          await this.props.calculateLine(obj);

          this.setState({ isLoading: false });
        }
      }
    } else if (lineType === "Inventory") {
      if (
        rate != "" &&
        Number(rate) != 0 &&
        units != "" &&
        Number(units) != 0
      ) {
        this.setState({ isLoading: true });

        await this.props.calculateLine(obj);

        this.setState({ isLoading: false });
      }
    }

    //success case of calculate line amount
    if (this.props.invoiceData.calculateLineSuccess) {
      toast.success(this.props.invoiceData.calculateLineSuccess);

      let resp = this.props.invoiceData.calculateLine;
      let _rate = Number(resp.rate);
      let _amount = Number(resp.amount);
      let typeDescription = resp.typeDescription || "";
      if (lineType === "Inventory") {
        this.setState({ typeDescription });
      } else {
        this.setState({ rate: _rate, amount: _amount, typeDescription });
        this.validateField("amount", _amount);
      }
    }
    //error case of calculate line amount
    if (this.props.invoiceData.calculateLineError) {
      this.handleApiRespErr(this.props.invoiceData.calculateLineError);
    }

    this.props.clearInvoiceStates();
  };
  onSavePOLine = async () => {
    var type = this.state.POType.label; //type: Service || Inventory || Rental/Hire || Car || Distribution
    let formErrors = this.state.formErrors;
    if (!this.state.chartSort) {
      formErrors.chartSort = "This Field is Required.";
    }
    // if (!this.state.chartCode) {
    //   formErrors.chartCode = "This Field is Required.";
    // }
    if (!this.state.description) {
      formErrors.description = "This Field is Required.";
    }
    if (!this.state.amount && this.state.amount != "0") {
      formErrors.amount = "This Field is Required.";
    }
    // if type is Inventory
    if (type === "Inventory") {
      if (!this.state.units && this.state.units != "0") {
        formErrors.units = "This Field is Required.";
      }

      if (!this.state.rate && this.state.rate != "0") {
        formErrors.rate = "This Field is Required.";
      }
      // if (!this.state.basis) {
      //   formErrors.basis = "This Field is Required.";
      // }
    } else if (type === "Car") {
      //if type is Car

      if (!this.state.rate && this.state.rate != "0") {
        formErrors.rate = "This Field is Required.";
      }
      if (!this.state.basis.value) {
        formErrors.basis = "This Field is Required.";
      }
    } else if (type === "Rental/Hire") {
      //if type is Rental/Hire

      if (!this.state.rate && this.state.rate != "0") {
        formErrors.rate = "This Field is Required.";
      }

      if (!this.state.basis.value) {
        formErrors.basis = "This Field is Required.";
      }
    }

    this.setState({
      formErrors: formErrors,
    });
    let check = false;

    if (type === "Service" || type === "Distribution") {
      check = true;
    }
    if (type === "Inventory") {
      if (!formErrors.units && !formErrors.rate && !formErrors.basis) {
        check = true;
      }
    } else if (type === "Car") {
      if (!formErrors.rate && !formErrors.basis) {
        check = true;
      }
    } else if (type === "Rental/Hire") {
      //rental/hire
      if (!formErrors.rate && !formErrors.basis) {
        check = true;
      }
    }

    if (
      !formErrors.chartSort &&
      // !formErrors.chartCode &&
      !formErrors.description &&
      !formErrors.amount &&
      check
    ) {
      let {
        lineNo,
        id,
        chartSort,
        chartCode,
        description,
        typeDescription,
        amount,
        units,
        driver,
        empCode,
        raNumber,
        registration,
        startOdometer,
        endOdometer,
        vehicle,
        hireState,
        fromDate,
        toDate,
        startTime,
        endTime,
        basis,
        rate,
        clonedFlags,
        poNumber,
        action,
        poTran,
        poLine,
        poUpdated,
        customFields
      } = this.state;

      let flagIsEmpty = false;

      // clonedFlags.map((f, i) => {
      //   if (f.value.trim() == "") {
      //     flagIsEmpty = true;
      //   }
      // });
      let obj = "";
      if (type === "Service" || type === "Distribution") {
        obj = {
          id,
          type,
          chartSort,
          chartCode,
          description,
          amount,
          flags: clonedFlags,
        };

        this.state.customFields &&
          this.state.customFields.length > 0 &&
          this.state.customFields.map((c, i) => {
            obj[c.prompt] = this.state[c.prompt];
          });
        obj.customFields = customFields
      } else if (type === "Inventory") {
        obj = {
          id,
          type,
          chartSort,
          chartCode,
          description,
          typeDescription,
          amount,
          units,
          rate,
          basis: basis.value,
          flags: clonedFlags,
        };
      } else if (type === "Car") {
        obj = {
          id,
          type,
          chartSort,
          chartCode,
          description,
          typeDescription,
          amount,
          driver,
          empCode,
          raNumber,
          registration,
          startOdometer,
          endOdometer,
          vehicle,
          hireState,
          fromDate,
          toDate,
          startTime,
          endTime,
          basis: basis.value,
          rate,
          flags: clonedFlags,
        };
      } else if (type === "Rental/Hire") {
        obj = {
          id,
          type,
          chartSort,
          chartCode,
          description,
          typeDescription,
          amount,
          fromDate,
          toDate,
          startTime,
          endTime,
          basis: basis.value,
          rate,
          flags: clonedFlags,
        };
      }

      if (
        this.props.modal === "invoice-edit" ||
        this.props.modal === "add-New-Invoice"
      ) {
        obj.poNumber = poNumber;
        obj.action = action;
        obj.poLine = poLine || 0;
        obj.poTran = poTran || 0;
        obj.poUpdated = poUpdated;
      }

      //adding lineNo if it exist while updating lines
      if (lineNo !== '') {
        obj.lineNo = lineNo
      }
      if (obj) {
        await this.props.getNewORUpdatedPOLine(obj);
        this.clearStates();
      }
    }
  };

  render() {
    let userType = localStorage.getItem("userType");
    let tab = this.props.tab || "";

    let checkOne = false;
    let checkTwo = false;

    if (userType && tab) {
      if (userType.toLowerCase() === "approver") {
        /* An Approver can only edit the chart code, tracking codes and item description.
         Everything else is read-only and cannot be altered.*/

        checkOne = true;
      } else if (userType.toLowerCase() === "operator") {
        /*The Operator account should only be able to edit the Preview PDF in the Draft section,
         in every other section the preview pdf must be read only for them.*/
        if (tab != "draft") {
          checkOne = true;
          checkTwo = true;
        }
      } else if (userType.toLowerCase() === "op/approver") {
        /*The Operator/Approver account can edit everything in the Draft section 
        AND they can also edit the Chart Code, Tracking Code and Description in the Approve
        and Hold Section */

        if (tab != "draft") {
          checkOne = true;
        }
      }
    }
    //for tracking codes
    let clonedFlags = this.state.clonedFlags || [];


    let trckng_codes = { label: "Select Tracking codes", value: 0 };
    if (clonedFlags && clonedFlags.length > 0) {

      let str = ""

      clonedFlags.map((f, i) => {
        str = <>{str} &nbsp;{f.value}&nbsp;</>
      })

      trckng_codes = {
        label: (
          <>
            {" "}
            {str}
            {" "}
          </>
        ),
        value: "",
      };
    }
    // end
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openLineItemModal}
          onHide={this.clearStates}
          className="forgot_email_modal modal_704 mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid ">
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">Line Item</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              {checkTwo ? (
                                <button type="button" className="btn-save">
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={this.onSavePOLine}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                              )}
                              <button
                                onClick={this.clearStates}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-ban"></span>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row mt-4">
                          {this.props.modal === "add-New-Invoice" ? (
                            <>
                              <div className="col-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">PO Number</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        this.state.poUpdated === "N"
                                          ? "disable_bg disable_border"
                                          : ""
                                      }
                                      id="usr"
                                      name="poNumber"
                                      value={this.state.poNumber}
                                      onChange={this.handleFieldChange}
                                      disabled={this.state.poUpdated === "N"}
                                    />
                                  </div>
                                </div>
                              </div>
                              {/* <div className="col-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Action</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="AU-01-000"
                                      id="usr"
                                    />
                                  </div>
                                </div>
                              </div> */}
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label>Action</label>
                                  <Select
                                    isDisabled={this.state.poUpdated === "N"}
                                    className="width-selector"
                                    onChange={this.handleChangeActions}
                                    value={{
                                      label: this.state.action,
                                      value: this.state.action,
                                    }}
                                    // defaultValue={this.state.POLineTypes[0]}
                                    // classNamePrefix="custon_select-selector-inner"
                                    styles={_customStyles}
                                    classNamePrefix="react-select"
                                    options={this.state.actions}
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
                            </>
                          ) : (
                            ""
                          )}

                          <div className="form-group col-12">
                            <div className="custon_select">
                              <label htmlFor="usr">Chart Sort</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkOne
                                      ? "disable_bg disable_border uppercaseText"
                                      : "uppercaseText"
                                  }
                                  placeholder="Chart Sort"
                                  id="usr"
                                  name="chartSort"
                                  onChange={this.handleChangeChartSort}
                                  value={this.state.chartSort}
                                  disabled={checkOne}
                                />
                                <span className="input_field_icons">
                                  {checkOne ? (
                                    <i className="fa fa-search"></i>
                                  ) : (
                                    <i
                                      onClick={() =>
                                        this.openModal("openChartSortModal")
                                      }
                                      className="fa fa-search"
                                    ></i>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="text-danger error-12">
                              {this.state.formErrors.chartSort !== ""
                                ? this.state.formErrors.chartSort
                                : ""}
                            </div>
                          </div>

                          <div className="form-group col-12">
                            <div className="custon_select">
                              <label htmlFor="usr">Chart Code</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkTwo
                                      ? "disable_bg disable_border focus_chartCode uppercaseText"
                                      : "focus_chartCode uppercaseText"
                                  }
                                  placeholder="Chart Code"
                                  id="chrtCode_id"
                                  autoComplete="off"
                                  name="chartCode"
                                  onChange={this.handleChangeChartCode}
                                  onBlur={this.onblur}
                                  value={this.state.chartCode}
                                  disabled={checkTwo}
                                />
                                <div
                                  className={`chart_menue chart line_item_chart_menue`}
                                >
                                  {this.state.clonedChartCodesList.length >
                                    0 ? (
                                    <ul className="invoice_vender_menu">
                                      {this.state.clonedChartCodesList.map(
                                        (c, i) => {
                                          return (
                                            <li
                                              className="cursorPointer"
                                              key={i}
                                              onClick={() =>
                                                this.changeChartCode(c)
                                              }
                                            >
                                              <div className="vender_menu_right chart_new">
                                                <h3 className="chart_vender_text">
                                                  <span> {c.code} </span>{" "}
                                                  <span className="right_desc">
                                                    {" "}
                                                    {c.description}
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
                                      <h6>No Chart Code Found</h6>
                                    </div>
                                  )}
                                </div>

                                <span className="input_field_icons">
                                  {checkTwo ? (
                                    <i className="fa fa-search"></i>
                                  ) : (
                                    <i
                                      onClick={() =>
                                        this.openModal("openChartCodeModal")
                                      }
                                      className="fa fa-search"
                                    ></i>
                                  )}
                                </span>
                              </div>
                            </div>
                            {/* <div className="text-danger error-12">
                              {this.state.formErrors.chartCode !== ""
                                ? this.state.formErrors.chartCode
                                : ""}
                            </div> */}
                          </div>

                          <div className="col-md-12">
                            <div className="form-group custon_select custom_selct2 tracking_code_select">
                              <label>Tracking Codes</label>
                              <Select
                                isDisabled={checkTwo}
                                value={trckng_codes}
                                className="width-selector"
                                // classNamePrefix="custon_select-selector-inner"
                                classNamePrefix="tracking_codes track_menu custon_select-selector-inner"
                                options={this.state.flags}
                                onChange={this.handleTrackingCode}
                                isSearchable={false}
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
                            </div>
                            <div className="text-danger error-12">
                              {this.state.formErrors.trackingCodes !== ""
                                ? this.state.formErrors.trackingCodes
                                : ""}
                            </div>
                          </div>

                          {this.state.POType.label === "Inventory" ||
                            this.state.POType.label === "Rental/Hire" ||
                            this.state.POType.label === "Car" ? (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label htmlFor="usr">Type Description</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="disable_bg disable_border"
                                    id="usr"
                                    name="typeDescription"
                                    value={this.state.typeDescription}
                                    // onChange={this.handleFieldChange}
                                    disabled={true} //type description can't be edited only user can see it
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-12">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Item Description</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkTwo ? "disable_bg disable_border " : ""
                                  }
                                  id="usr"
                                  name="description"
                                  value={this.state.description}
                                  onChange={this.handleFieldChange}
                                  disabled={checkTwo}
                                  onBlur={this.calculateLine}

                                />
                              </div>
                              <div className="text-danger error-12">
                                {this.state.formErrors.description !== ""
                                  ? this.state.formErrors.description
                                  : ""}
                              </div>
                            </div>
                          </div>

                          {/* {this.props.modal === "add-New-Invoice" ||
                          this.props.modal === "New-PO-Edit" ? ( */}
                          <div className="col-md-12">
                            <div className="form-group custon_select custom_selct2">
                              <label>Type</label>
                              <Select
                                isDisabled={checkOne}
                                className="width-selector"
                                onChange={this.handleChangePOLineType}
                                value={this.state.POType}
                                // defaultValue={this.state.POLineTypes[0]}
                                // classNamePrefix="custon_select-selector-inner"
                                styles={_customStyles}
                                classNamePrefix="react-select"
                                options={this.state.POLineTypes}
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
                          {/* ) 
                           : (
                             ""
                           )} */}

                          {/* if type is Service */}
                          {this.state.POType.label === "Service" ||
                            this.state.POType.label === "Distribution" ? (
                            <>
                              {this.state.customFields &&
                                this.state.customFields.length > 0 &&
                                this.state.customFields.map((c, i) => {
                                  return (
                                    <div key={i} className="col-md-12">
                                      <div className="form-group custon_select">
                                        <label htmlFor="usr">{c.prompt}</label>
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className={
                                              checkOne
                                                ? "disable_bg disable_border "
                                                : ""
                                            }
                                            id="usr"
                                            name={c.prompt}
                                            onChange={this.handleFieldChange}
                                            value={this.state[c.prompt]}
                                            disabled={checkOne}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </>
                          ) : (
                            ""
                          )}
                          {/* end type Service*/}

                          {/* if type is Inventory */}
                          {this.state.POType.label === "Inventory" ? (
                            <>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Units</label>
                                  <div className="modal_input">
                                    <input
                                      type="number"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      id="usr"
                                      name="units"
                                      value={this.state.units}
                                      onChange={this.handleFieldChange}
                                      disabled={checkOne}
                                      onBlur={this.calculateLine}
                                    />
                                  </div>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.units !== ""
                                      ? this.state.formErrors.units
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              {/* rate */}
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Unit Amount</label>
                                  <div className="modal_input">
                                    <input
                                      type="number"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      id="usr"
                                      name="rate"
                                      value={this.state.rate}
                                      onChange={this.handleFieldChange}
                                      disabled={checkOne}
                                      onBlur={this.calculateLine}
                                    />
                                  </div>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.rate !== ""
                                      ? this.state.formErrors.rate
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              {/* <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label>Per</label>
                                  <Select
                                    isDisabled={checkOne}
                                    className="width-selector"
                                    onChange={this.handleChangeBasis}
                                    value={this.state.basis}
                                    // defaultValue={this.state.POLineTypes[0]}
                                    classNamePrefix="custon_select-selector-inner"
                                    options={this.state.basisOptionArr}
                                    theme={theme => ({
                                      ...theme,
                                      border: 0,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#f2f2f2",
                                        primary: "#f2f2f2"
                                      }
                                    })}
                                  />
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.basis !== ""
                                      ? this.state.formErrors.basis
                                      : ""}
                                  </div>
                                </div>
                              </div> */}
                            </>
                          ) : (
                            ""
                          )}
                          {/* end type Inventory*/}

                          {/*when type is car ||  Rental/Hire */}
                          {this.state.POType.label === "Car" ||
                            this.state.POType.label === "Rental/Hire" ? (
                            <>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">From/Start Date</label>
                                  <div className="modal_input datePickerUP">
                                    <DatePicker
                                      disabled={checkOne}
                                      name="fromDate"
                                      onKeyDown={(e) => {
                                        if (e.key == "Tab") {
                                          this.fromDateRef.current.setOpen(false);
                                        }
                                      }}
                                      ref={this.fromDateRef}
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      selected={this.state.fromDate}
                                      onChange={(d) =>
                                        this.handleDateChange(d, "fromDate")
                                      }
                                      dateFormat="d MMM yyyy"
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="startTime">Start Time</label>
                                  <div className="modal_input">
                                    <TimePicker
                                      disabled={checkOne}
                                      id="startTime"
                                      showSecond={false}
                                      // defaultValue={now}
                                      value={moment(
                                        moment(this.state.startTime).format(
                                          "HH:mm"
                                        ),
                                        "HH:mm"
                                      )}
                                      className="date_time_bg"
                                      name="startTime"
                                      onChange={(t) =>
                                        this.onChangeTime("startTime", t)
                                      }
                                      format={"h:mm a"}
                                      use12Hours
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">To/Finish Date</label>
                                  <div className="modal_input datePickerUP">
                                    <DatePicker
                                      disabled={checkOne}
                                      name="toDate"
                                      onKeyDown={(e) => {
                                        if (e.key == "Tab") {
                                          this.toDateRef.current.setOpen(false);
                                        }
                                      }}
                                      ref={this.toDateRef}
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      selected={this.state.toDate}
                                      onChange={(d) =>
                                        this.handleDateChange(d, "toDate")
                                      }
                                      dateFormat="d MMM yyyy"
                                      autoComplete="off"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="endTime">
                                    End/Finish Time
                                  </label>
                                  <div className="modal_input">
                                    <TimePicker
                                      disabled={checkOne}
                                      id="endTime"
                                      showSecond={false}
                                      // defaultValue={now}
                                      className="date_time_bg"
                                      value={moment(
                                        moment(this.state.endTime).format(
                                          "HH:mm"
                                        ),
                                        "HH:mm"
                                      )}
                                      name="endTime"
                                      format={"h:mm a"}
                                      onChange={(t) =>
                                        this.onChangeTime("endTime", t)
                                      }
                                      use12Hours
                                      getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Rate</label>
                                  <div className="modal_input">
                                    <input
                                      type="number"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      id="usr"
                                      name="rate"
                                      value={this.state.rate}
                                      onChange={this.handleFieldChange}
                                      disabled={checkOne}
                                      onBlur={this.calculateLine}
                                      onKeyDown={(e) => e.key === 'Enter' ? this.calculateLine('enter')
                                        : ' '}
                                    />
                                  </div>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.rate !== ""
                                      ? this.state.formErrors.rate
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label>Per</label>
                                  <Select
                                    isDisabled={checkOne}
                                    className="width-selector"
                                    onChange={this.handleChangeBasis}
                                    value={this.state.basis}
                                    // defaultValue={this.state.POLineTypes[0]}
                                    // classNamePrefix="custon_select-selector-inner"
                                    options={this.state.basisOptionArr}
                                    styles={_customStyles}
                                    classNamePrefix="react-select"
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
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.basis !== ""
                                      ? this.state.formErrors.basis
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {/* end */}

                          <div className="col-md-12">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Amount</label>
                              <div className="modal_input">
                                <input
                                  type="number"
                                  className={
                                    checkOne ||
                                      this.state.POType.label === "Inventory" ||
                                      this.state.POType.label === "Rental/Hire" ||
                                      this.state.POType.label === "Car"
                                      ? "disable_bg disable_border "
                                      : ""
                                  }
                                  id="usr"
                                  name="amount"
                                  value={this.state.amount}
                                  onBlur={this.convertTwoDecimal}
                                  onChange={this.handleFieldChange}
                                  disabled={
                                    checkOne ||
                                      this.state.POType.label === "Inventory" ||
                                      this.state.POType.label === "Rental/Hire" ||
                                      this.state.POType.label === "Car"
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                              <div className="text-danger error-12">
                                {this.state.formErrors.amount !== ""
                                  ? this.state.formErrors.amount
                                  : ""}
                              </div>
                            </div>
                          </div>

                          {/* if type is Car */}
                          {this.state.POType.label === "Car" ? (
                            <>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Driver</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="driver"
                                      value={this.state.driver}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">EMP Code</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="empCode"
                                      value={this.state.empCode}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">RA Number</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="raNumber"
                                      value={this.state.raNumber}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Registration</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="registration"
                                      value={this.state.registration}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Start Odometer</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="startOdometer"
                                      value={this.state.startOdometer}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">End Odometer</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="endOdometer"
                                      value={this.state.endOdometer}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Vehicle</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="vehicle"
                                      value={this.state.vehicle}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="form-group custon_select">
                                  <label htmlFor="usr">Hire State</label>
                                  <div className="modal_input">
                                    <input
                                      type="text"
                                      className={
                                        checkOne
                                          ? "disable_bg disable_border "
                                          : ""
                                      }
                                      name="hireState"
                                      value={this.state.hireState}
                                      onChange={this.handleFieldChange}
                                      id="usr"
                                      disabled={checkOne}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {/* end type Car*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <ChartSort
          openChartSortModal={this.state.openChartSortModal}
          closeModal={this.closeModal}
          chartSorts={this.props.chartSorts || ""} //api response (get chart sort)
          defaultChartSort={this.state.chartSort} //chart sort that show on this page e.g 'AU.01.000'
          getUpdatedChartSort={this.getUpdatedChartSort} //get updated chart sort to show on this page
        />

        {/* <TaxCode
          openTaxCodeModal={this.state.openTaxCodeModal}
          closeModal={this.closeModal}
          taxCodes={this.props.taxCodes || ""} //api response (get tax codes)
        /> */}

        <ChartCode
          openChartCodeModal={this.state.openChartCodeModal}
          closeModal={this.closeModal}
          chartCodes={this.props.chartCodes || []} //all chart codes
          getUpdatedChartCode={this.getUpdatedChartCode} //get updated chart code to show on this page
          chartCode={this.state.chartCode} //value of chartCode (single value) that is shown in chart code input field
          props={this.props.props || ""}
          chartSort={this.state.chartSort}
        />
        <TrackingCode
          openTrackingCodeModal={this.state.openTrackingCodeModal}
          closeModal={this.closeModal}
          trackingCodes={this.state.trackingCodes}
          getUpdatedTrackingCode={this.getUpdatedTrackingCode} //get updated tracking code to show on this page
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  invoiceData: state.invoice,
});
export default connect(mapStateToProps, {
  calculateLine,
  clearInvoiceStates,
  clearStatesAfterLogout,
})(LineItem);
