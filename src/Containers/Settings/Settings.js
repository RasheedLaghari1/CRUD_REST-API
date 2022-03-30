import React, { Component } from "react";
import $ from "jquery";
import Select from "react-select";
import SignatureCanvas from "react-signature-canvas";
import { connect } from "react-redux";
import Base64 from "base-64";
import { toast } from "react-toastify";
import countryList from "country-list";

import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import ChartSort from "../Modals/ChartSort/ChartSort";
import ChartCode from "../Modals/ChartCode/ChartCode";
import TaxCode from "../Modals/TaxCodes/TaxCodes";
import TrackingCode from "../Modals/TrackingCode/TrackingCode";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import {
  handleAPIErr,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      email: "",
      mobileNumber: "",
      chartSort: "",
      chartCode: "",
      taxCode: "",
      sigType: "Typed",
      signature: "",
      signatureImage: "",
      trackingCodes: [],
      formErrors: {
        email: "",
      },

      openTaxCodeModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,

      //flags/tracking codes
      flags: [], //restructured user's flags according to select dropdown to just show ,comming from get user's account details api
      clonedFlags: [], //a copy of user's flags
      // end

      allCountryCodesList: [],
      selectedCountry: { label: "Select Country Code", value: 0 },

      //show on dashboard
      activity: true,
      history: true,
      POInsights: true,
    };
  }

  async componentDidMount() {
    //focus search input field
    // let id = document.getElementById("emailId");
    // if (id) {
    //   document.getElementById("emailId").focus();
    // }

    //adding drag and drop attachments listeners
    addDragAndDropFileListners("drop-area", this.uploadSignatureImage);
    //end

    // sideBarAccord
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });
    // end
    this.setState({ isLoading: true });
    //get country codes list
    let countryLists = countryList.getData();
    let ctryList = [];
    countryLists.map((cl, i) => {
      return ctryList.push({
        label: cl.name + " (" + cl.code + ")",
        value: cl.code,
      });
    });

    var collator = new Intl.Collator(undefined, {
      sensitivity: "base",
    });

    ctryList.sort(function (a, b) {
      return collator.compare(a.label, b.label);
    });

    this.setState({ allCountryCodesList: ctryList });
    // end country codes
    let promises = [];

    let accntVals = localStorage.getItem("getAccountDetails") || "";
    accntVals = accntVals ? JSON.parse(accntVals) : "";

    if (accntVals && accntVals.accountDetails) {
      //if localstorage contains the account details then update the Redux State no need to call API
      store.dispatch({
        type: "GET_ACCOUNT_DETAILS_SUCCESS",
        payload: accntVals,
      });
    } else {
      promises.push(this.props.getAccountDetails());
    }

    //  this.props.clearUserStates(); //to just clear user's state
    if (!this.props.chart.getChartSorts) {
      promises.push(this.props.getChartSorts());
    }
    if (this.props.chart.getTaxCodes.length === 0) {
      promises.push(this.props.getTaxCodes());
    }

    if (!this.props.chart.getFlags) {
      promises.push(this.props.getFlags());
    }
    await Promise.all(promises);

    //success case of Get Account Details
    if (this.props.user.getAccountDetailsSuccess) {
      // toast.success(this.props.user.getAccountDetailsSuccess);
    }
    //error case of Get Account Details
    if (this.props.user.getAccountDetailsError) {
      handleAPIErr(this.props.user.getAccountDetailsError, this.props);
    }

    //success case of Get Chart Sorts
    if (this.props.chart.getChartSortsSuccess) {
      // toast.success(this.props.chart.getChartSortsSuccess);
    }
    //error case of Get Chart Sorts
    if (this.props.chart.getChartSortsError) {
      handleAPIErr(this.props.chart.getChartSortsError, this.props);
    }

    //success case of Get Tax Codes
    if (this.props.chart.getTaxCodesSuccess) {
      // toast.success(this.props.chart.getTaxCodesSuccess);
    }
    //error case of Get Tax Codes
    if (this.props.chart.getTaxCodesError) {
      handleAPIErr(this.props.chart.getTaxCodesError, this.props);
    }

    //success case of Get Flags List
    if (this.props.chart.getFlagsSuccess) {
      // toast.success(this.props.chart.getFlagsSuccess);
    }
    //error case of Get Flags List
    if (this.props.chart.getFlagsError) {
      handleAPIErr(this.props.chart.getFlagsError, this.props);
    }
    this.props.clearChartStates();
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  }

  async componentWillReceiveProps() {
    /*success case of Get Account Details and set initial values and updated valus when user updated 
     settings(profile modal, signature modal then show updated value here)
     */
    if (
      this.props.user.getAccountDetailsSuccess ||
      this.props.user.updateAccountDetailsSuccess
    ) {
      let accountDetails =
        (this.props.user.getAccountDetails &&
          this.props.user.getAccountDetails.accountDetails) ||
        "";
      if (accountDetails) {
        let ctryCode = accountDetails.countryCode || "";
        let countryLists = countryList.getData();
        let ctryObj = "";
        ctryObj = countryLists.find(
          (c) => c.code.toLowerCase() == ctryCode.toLowerCase()
        );
        if (ctryObj) {
          ctryObj = {
            label: ctryObj.name + " (" + ctryObj.code + ")",
            value: ctryObj.code,
          };
        } else {
          ctryObj = { label: "Select Country Code", value: 0 };
        }
        this.setState({
          signature: "",
          signatureImage: "",
        });
        if (!this.state.signatureImage) {
          // this.sigPad.clear();
        }
        //to display signature on canvas signature pad
        if (accountDetails.sigType == "Drawn") {
          if (
            this.state.sigType == "Drawn" &&
            !this.state.signatureImage &&
            this.sigPad
          ) {
            this.sigPad.fromDataURL(accountDetails.signature);
          }

          this.setState({
            signature: "",
            signatureImage: accountDetails.signature || "",
          });
        }
        //to display signature on Input Field
        if (accountDetails.sigType == "Typed") {
          this.setState({
            signature: Base64.decode(accountDetails.signature),
          });
        }
        //show on dashboard settings
        let dataArr = JSON.parse(
          localStorage.getItem("showOnDashboard") || "[]"
        );

        let email = accountDetails.email || "";
        let check = dataArr.find((f) => f.email === email);
        if (check) {
          this.setState({
            history: check.history,
            activity: check.activity,
            POInsights: check.POInsights,
          });
        }
        // end
        // users flags
        let flgs = this.props.user.getAccountDetails.flags || [];
        let _flgs = [];
        let taxValue = ""; //tax code value (a seperate tax code modal)
        flgs.map((f, i) => {
          if (f.type === "Tax") {
            taxValue = f.defaultValue || "";
          } else {
            //all flags except tax flags in the tracking code list beacause tax codes already in seperate field
            _flgs.push(
              {
                ...f,
                label: f.type,
                value: f.defaultValue ? f.defaultValue : "",
                id: i,
              },
              {
                ...f,
                label: f.defaultValue,
                value: f.defaultValue ? f.defaultValue : "",
                id: i,
              }
            );
          }
        });
        // end

        this.setState({
          selectedCountry: ctryObj,
          email,
          mobileNumber: accountDetails.mobileNumber || "",
          chartSort: accountDetails.chartSort || "",
          chartCode: accountDetails.chartCode || "",
          taxCode: taxValue,
          sigType: accountDetails.sigType || "Typed",
          flags: _flgs, //restructured user's flags according to select dropdown to just show
          clonedFlags: this.props.user.getAccountDetails.flags || [], //a user's flags
        });
      }
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area", this.uploadSignatureImage);
  }

  getChartCodes = async () => {
    this.setState({ isLoading: true });
    await this.props.getChartCodes(this.state.chartSort); //to get chart codes filterd list according to chart sort

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
    }
    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }

    this.setState({ isLoading: false });
    this.props.clearChartStates();
  };

  // ***************END*************
  openModal = async (name) => {
    if (name === "openChartCodeModal") {
      await this.getChartCodes();
      this.setState({ openChartCodeModal: true });
    } else {
      this.setState({ [name]: true });
    }
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  handleTrackingCode = async (data) => {
    //data consists of where user clicks on user's tracking codes/flags dropdown e.g { lable: 'tax', value: 01 }, { lable: 'set', value: 02 }
    let flags = this.props.chart.getFlags; //object contains multiple flags {  set: [], insurance: [], tax: [] } => get flags api respose
    // let flagArr = [];
    let flagsObj = { data };
    for (var f of Object.keys(flags)) {
      if (data.label.toLowerCase() === f.toLowerCase()) {
        // flagArr = flags[f];
        flagsObj.flagArr = flags[f];
      }
    }
    //flagArr contains all flags regarding to selected tracking code
    this.setState({ trackingCodes: flagsObj }, () =>
      this.openModal("openTrackingCodeModal")
    );
  };

  getUpdatedTrackingCode = async (newVal, prevVal) => {
    //prevVal consists of previous tracking code value and newVal consists of new tracking code value

    let flags = this.state.flags; //restructured user's flags
    let clonedFlags = this.state.clonedFlags; //orignal user's flags
    let clndObj = clonedFlags.find((f) => f.type == prevVal.label);

    let labelObj = flags.find(
      (f) => f.label == prevVal.label && f.id == prevVal.id
    ); //e.g {label: 'Insurance', value: 01, id:0}
    let valueObj = flags.find(
      (f) => f.label == prevVal.value && f.id == prevVal.id
    ); //e.g {label: 01, value: 01, id:0}

    if (labelObj.type === "Tax") {
      //to just show on tax code field
      if (newVal.code) {
        this.setState({
          taxCode: newVal.code,
        });
      } else {
        this.setState({
          taxCode: "",
        });
      }
    }

    if (labelObj && valueObj && clndObj) {
      labelObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["label"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      clndObj["defaultValue"] = newVal.code; //update value to send to backend ( when update user's)
      this.setState({ flags, clonedFlags });
    }
  };

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    const { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  handleCountryFieldChange = (data) => {
    this.setState({ selectedCountry: data });
  };

  //get new chart sort value through chart sort modal
  getUpdatedChartSort = (chartSort) => {
    if (chartSort) {
      this.setState({ chartSort });
    }
  };

  //get new chart code value through chart code modal
  getUpdatedChartCode = (chartCode) => {
    this.setState({ chartCode });
  };

  //get new tax code value through tax code modal
  getUpdatedTaxCode = (taxCode) => {
    // if (taxCode) {
    //    this.setState({ taxCode });
    // }

    //when update tax codes then also update in suppliers flags (also in tracking codes dropdown)
    let flags = this.state.flags; //restructured supplier flags
    let clonedFlags = this.state.clonedFlags; //orignal supplier flags
    let clndObj = clonedFlags.find((f) => f.type == "Tax");

    let labelObj = flags.find((f) => f.label == "Tax");
    let valueObj = flags.find((f) => f.label == this.state.taxCode);

    if (clndObj) {
      // labelObj["value"] = taxCode; //update value to just show on tracking codes dropdown
      // valueObj["label"] = taxCode; //update value to just show on tracking codes dropdown
      // valueObj["value"] = taxCode; //update value to just show on tracking codes dropdown
      clndObj["defaultValue"] = taxCode; //update value to send to backend ( when update supplier)
      this.setState({ flags, clonedFlags, taxCode });
    }
  };

  //this function trigers when user start signature writing
  onStartSignature = () => {
    this.setState({ sigType: "Drawn", signature: "" });
  };

  //clear canvas signature
  clearSignature = () => {
    if (this.state.signatureImage) {
      this.setState({ signatureImage: "" });
    } else {
      this.sigPadPro.clear();
    }
  };

  handleTypedSignature = async (e) => {
    this.setState({ sigType: "Typed", signature: e.target.value });
    if (this.state.signatureImage) {
      this.setState({ signatureImage: "" });
    } else {
      this.sigPadPro.clear();
    }
  };

  uploadSignatureImage = async (f) => {
    let type = f[0].type;
    let file = f[0];
    let size = f[0].size;

    if (type == "image/jpg" || type == "image/jpeg") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          this.setState({
            sigType: "Drawn",
            signature: "",
            signatureImage: result,
          });
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: 'JPG, JPEG'");
    }
  };

  //show on dashboard
  handleShowOnDashboard = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  onSave = async (e) => {
    e.preventDefault();

    let { email, formErrors } = this.state;
    let countryCode = this.state.selectedCountry.value;
    let mobileNumber = this.state.mobileNumber;
    let chartSort = this.state.chartSort;
    let chartCode = this.state.chartCode;
    let sigType = this.state.sigType; // either 'Typed' OR 'Drawn'
    let signature = this.state.signature;

    if (sigType == "Typed") {
      signature = Base64.encode(signature);
    }
    if (sigType == "Drawn") {
      if (this.state.signatureImage) {
        signature = this.state.signatureImage;
      } else {
        signature = this.sigPadPro.toDataURL();
      }
    }

    formErrors = Validation.handleValidation("email", email, formErrors);

    if (!formErrors.email) {
      this.setState({ isLoading: true });

      //call update api here
      let userData = this.props.user.getAccountDetails.accountDetails;
      let updatedData = {
        ...userData,
        flags: [...this.state.clonedFlags],
        email,
        countryCode,
        mobileNumber,
        chartSort,
        chartCode,
        sigType,
        signature,
      };

      await this.props.updateAccountDetails(updatedData);
      //Success case of Update User Account Details
      if (this.props.user.updateAccountDetailsSuccess) {
        // toast.success(this.props.user.updateAccountDetailsSuccess);
        //settings 'Show On dashboard'

        let dataArr = JSON.parse(
          localStorage.getItem("showOnDashboard") || "[]"
        );

        let arr = [];
        if (dataArr.length == 0) {
          let data = {
            email,
            history: this.state.history,
            activity: this.state.activity,
            POInsights: this.state.POInsights,
          };
          localStorage.setItem("showOnDashboard", JSON.stringify([data]));
        } else {
          dataArr.map((d, i) => {
            if (d.email === email) {
              let obj = {};
              obj.email = email;
              obj.history = this.state.history;
              obj.activity = this.state.activity;
              obj.POInsights = this.state.POInsights;
              arr.push(obj);
            } else {
              arr.push(d);
            }
          });
          localStorage.setItem("showOnDashboard", JSON.stringify(arr));
        }

        //update getAccountDetails in localstorage then no need to call API again
        let getAccountDetails = JSON.parse(
          localStorage.getItem("getAccountDetails") || "{}"
        );
        if (getAccountDetails.accountDetails) {
          let updatedDetails = {
            accountDetails: {
              ...updatedData,
              avatar: updatedData.avatar.split(",")[1],
              // signature: updatedData.signature.split(",")[1],
              signature:
                this.state.sigType === "Drawn"
                  ? updatedData.signature.split(",")[1]
                  : updatedData.signature,
            },
            flags: [...updatedData.flags],
            results: [...getAccountDetails.results],
          };
          localStorage.setItem(
            "getAccountDetails",
            JSON.stringify(updatedDetails)
          );
        }

        //update getDefaultValues in localstorage and redux store then no need to call API again
        let getDefaultValues = JSON.parse(
          localStorage.getItem("getDefaultValues") || "{}"
        );
        if (getDefaultValues.defaultValues) {
          let currency = updatedData.chartSort || "";
          if (currency) {
            let arr = currency.split(".");
            if (arr.length === 3) {
              currency = arr[0];
            }
          }
          let defVals = {
            ...getDefaultValues,
            defaultValues: {
              chartCode: updatedData.chartCode || "",
              chartSort: updatedData.chartSort || "",
              currency,
            },
            flags: [...updatedData.flags],
          };
          localStorage.setItem("getDefaultValues", JSON.stringify(defVals));
          store.dispatch({
            type: "GET_DEFAULT_VALUES_SUCCESS",
            payload: defVals,
          });
        } else {
          // getting default values after saving account setting
          await this.props.getDefaultValues(); //getting users default values
        }

        //success case of get default vaues
        if (this.props.user.getDefaultValuesSuccess) {
          // toast.success(this.props.user.getDefaultValuesSuccess);
        }
        //error case of get default vaues
        if (this.props.user.getDefaultValuesError) {
          handleAPIErr(this.props.user.getDefaultValuesError, this.props);
        }

        this.props.history.push("/dashboard");
      }
      //Error case of Update User Account Details
      if (this.props.user.updateAccountDetailsError) {
        handleAPIErr(this.props.user.updateAccountDetailsError, this.props);
      }

      this.props.clearUserStates();
      this.setState({ isLoading: false });
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  onDiscard = () => {
    this.props.history.push("/dashboard");
  };

  onFocus = (e) => {
    let id = e.target.id;
    this.setState({ [id]: true });
  };

  onBlur = (e) => {
    let id = e.target.id;
    this.setState({ [id]: false });
  };

  render() {
    return (
      <>
        <div className="dashboard">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

          {/* top nav bar */}
          <Header props={this.props} settings={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <form onSubmit={this.onSave}>
                <div className="container-fluid ">
                  <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad Setting_main">
                          {/* user's Details Code start */}
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main w-sm-100">
                                  <button
                                    type="submit"
                                    className={
                                      this.state.id_save
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="1124"
                                    id="id_save"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                  >
                                    <span className="fa fa-check "></span>
                                    Save
                                  </button>
                                  <button
                                    tabIndex="1125"
                                    type="button"
                                    id="id_disc"
                                    className={
                                      this.state.id_disc
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    onClick={this.onDiscard}
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                  >
                                    <span className="fa fa-ban"></span>
                                    Discard
                                  </button>
                                </div>
                              </div>
                              <div className="row bord-btm">
                                <div className="col-auto pl-0">
                                  <h6 className="text-left def-blue">
                                    <span>
                                      {" "}
                                      <img
                                        src="images/arrow_up.png"
                                        className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                        alt="arrow_up"
                                        data-toggle="collapse"
                                        data-target="#Account"
                                      />{" "}
                                    </span>
                                    Account
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Account">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="email"
                                        className="form-control mt-0"
                                        id="email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleFieldChange}
                                        tabIndex="1111"
                                        autoFocus={true}
                                      />
                                      <label
                                        className={
                                          this.state.formErrors.email !== ""
                                            ? "move_label active"
                                            : "move_label inactive"
                                        }
                                        htmlFor="email"
                                      >
                                        Email Address
                                      </label>
                                    </div>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.email !== ""
                                        ? this.state.formErrors.email
                                        : ""}
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  {/* dropdown coding start */}
                                  <div className="form-group custon_select">
                                    <Select
                                      className="width-selector"
                                      // defaultValue={this.state.selectedCountry}
                                      name="countryCode"
                                      id="countryCode"
                                      onChange={this.handleCountryFieldChange}
                                      value={this.state.selectedCountry}
                                      classNamePrefix="custon_select-selector-inner"
                                      options={this.state.allCountryCodesList}
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
                                      tabIndex="1112"
                                    />
                                    <label
                                      htmlFor="countryCode"
                                      className="move_label inactive"
                                    >
                                      Country
                                    </label>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        value={this.state.mobileNumber}
                                        onChange={this.handleFieldChange}
                                        tabIndex="1113"
                                      />
                                      <label
                                        htmlFor="mobileNumber"
                                        className="move_label active"
                                      >
                                        Mobile
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="forgot_header mt-4">
                            <div className="modal-top-header">
                              <div className="row bord-btm">
                                <div className="col-auto pl-0">
                                  <h6 className="text-left def-blue">
                                    <span>
                                      {" "}
                                      <img
                                        src="images/arrow_up.png"
                                        className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                        alt="arrow_up"
                                        data-toggle="collapse"
                                        data-target="#on_Dashboard"
                                      />{" "}
                                    </span>
                                    Show on Dashboard
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="on_Dashboard">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-md-12">
                                  <div className="row">
                                    <div className="custom-radio pt-3 pr-3">
                                      <label
                                        className="setting_check_main setting_remember_check"
                                        htmlFor="t_history"
                                      >
                                        {" "}
                                        Transaction History
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="t_history"
                                          name="history"
                                          checked={this.state.history}
                                          onChange={this.handleShowOnDashboard}
                                          tabIndex="1114"
                                          onFocus={this.onFocus}
                                          onBlur={this.onBlur}
                                        />
                                        <span
                                          className={
                                            this.state.t_history
                                              ? "setting_click_checkmark span_focus"
                                              : "setting_click_checkmark"
                                          }
                                        ></span>
                                      </label>
                                    </div>

                                    <div className="custom-radio pt-3 pr-3">
                                      <label
                                        className={
                                          "setting_check_main setting_remember_check"
                                        }
                                        htmlFor="t_activity"
                                      >
                                        {" "}
                                        Recent Activity
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="t_activity"
                                          name="activity"
                                          checked={this.state.activity}
                                          onChange={this.handleShowOnDashboard}
                                          onFocus={this.onFocus}
                                          onBlur={this.onBlur}
                                          tabIndex="1115"
                                        />
                                        <span
                                          className={
                                            this.state.t_activity
                                              ? "setting_click_checkmark span_focus"
                                              : "setting_click_checkmark"
                                          }
                                        ></span>
                                      </label>
                                    </div>

                                    <div className="custom-radio pt-3">
                                      <label
                                        className={
                                          "setting_check_main setting_remember_check"
                                        }
                                        htmlFor="t_insight"
                                      >
                                        {" "}
                                        PO Insights
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="t_insight"
                                          name="POInsights"
                                          checked={this.state.POInsights}
                                          onChange={this.handleShowOnDashboard}
                                          onFocus={this.onFocus}
                                          onBlur={this.onBlur}
                                          tabIndex="1116"
                                        />
                                        <span
                                          className={
                                            this.state.t_insight
                                              ? "setting_click_checkmark span_focus"
                                              : "setting_click_checkmark"
                                          }
                                        ></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="forgot_header mt-4">
                            <div className="modal-top-header">
                              <div className="row bord-btm">
                                <div className="col-auto pl-0">
                                  <h6 className="text-left def-blue">
                                    <span>
                                      {" "}
                                      <img
                                        src="images/arrow_up.png"
                                        className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                        alt="arrow_up"
                                        data-toggle="collapse"
                                        data-target="#Buyer"
                                      />{" "}
                                    </span>
                                    Buyer
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Buyer">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="chartSort"
                                        name="chartSort"
                                        onChange={() => {}}
                                        value={this.state.chartSort}
                                        tabIndex="1117"
                                      />
                                      <label
                                        htmlFor="chartSort"
                                        className="move_label inactive"
                                      >
                                        Chart Sort
                                      </label>
                                      <span className="input_field_icons">
                                        <i
                                          onClick={() =>
                                            this.openModal("openChartSortModal")
                                          }
                                          className="fa fa-search"
                                        ></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="chartCode"
                                        name="chartCode"
                                        onChange={() => {}}
                                        value={this.state.chartCode}
                                        tabIndex="1118"
                                      />
                                      <label
                                        htmlFor="chartCode"
                                        className="move_label inactive"
                                      >
                                        Chart Code
                                      </label>

                                      <span className="input_field_icons">
                                        <i
                                          onClick={() =>
                                            this.openModal("openChartCodeModal")
                                          }
                                          className="fa fa-search"
                                        ></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control mt-0"
                                        id="taxCode"
                                        name="taxCode"
                                        onChange={() => {}}
                                        value={this.state.taxCode}
                                        tabIndex="1119"
                                      />
                                      <label
                                        htmlFor="taxCode"
                                        className="move_label inactive"
                                      >
                                        Tax Code
                                      </label>

                                      <span className="input_field_icons">
                                        <i
                                          onClick={() =>
                                            this.openModal("openTaxCodeModal")
                                          }
                                          className="fa fa-search"
                                        ></i>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <Select
                                      className="width-selector"
                                      value={{
                                        label: "Select Tracking codes",
                                        value: 0,
                                      }}
                                      classNamePrefix="tracking_codes track_menu custon_select-selector-inner"
                                      options={this.state.flags}
                                      onChange={this.handleTrackingCode}
                                      id="flags"
                                      tabIndex="1120"
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
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="forgot_header mt-4">
                            <div className="modal-top-header">
                              <div className="row bord-btm">
                                <div className="col-auto pl-0">
                                  <h6 className="text-left def-blue">
                                    <span>
                                      {" "}
                                      <img
                                        src="images/arrow_up.png"
                                        className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                        alt="arrow_up"
                                        data-toggle="collapse"
                                        data-target="#Signature"
                                      />{" "}
                                    </span>
                                    User Signature
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Signature">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-12">
                                  <div className=" profile-tabs">
                                    <ul className="nav nav-tabs">
                                      <li className="nav-item">
                                        <a
                                          id="typed"
                                          className={
                                            this.state.sigType == "Typed"
                                              ? "nav-link active"
                                              : "nav-link"
                                          }
                                          data-toggle="tab"
                                          href="#home11"
                                          tabIndex="1121"
                                        >
                                          <span
                                            htmlFor="typed"
                                            className="fa fa-keyboard-o mr-2"
                                          ></span>{" "}
                                          Typed
                                        </a>
                                      </li>
                                      <li className="nav-item">
                                        <a
                                          id="drawn"
                                          className={
                                            this.state.sigType == "Drawn"
                                              ? "nav-link active"
                                              : "nav-link"
                                          }
                                          data-toggle="tab"
                                          href="#menu11"
                                          tabIndex="1123"
                                        >
                                          <span
                                            htmlFor="drawn"
                                            className="fa fa-pencil mr-2"
                                          ></span>{" "}
                                          Drawn
                                        </a>
                                      </li>
                                    </ul>

                                    <div className="tab-content">
                                      <div
                                        className={
                                          this.state.sigType == "Typed"
                                            ? "tab-pane container active"
                                            : "tab-pane container fade"
                                        }
                                        // className="tab-pane container fade"
                                        id="home11"
                                      >
                                        <textarea
                                          rows="4"
                                          id="ddd"
                                          className="sig-text"
                                          onChange={this.handleTypedSignature}
                                          value={
                                            this.state.sigType == "Typed"
                                              ? this.state.signature
                                              : ""
                                          }
                                          tabIndex="1122"
                                        />
                                      </div>
                                      <div
                                        className={
                                          this.state.sigType == "Drawn"
                                            ? "tab-pane container active"
                                            : "tab-pane container"
                                        }
                                        // className="tab-pane container active"

                                        id="menu11"
                                      >
                                        {" "}
                                        <i
                                          onClick={this.clearSignature}
                                          className="fa fa-trash clear_sign"
                                        ></i>{" "}
                                        {this.state.signatureImage ? (
                                          <img
                                            className="d-block img-fluid mx-auto"
                                            src={this.state.signatureImage}
                                            // alt="user"
                                          />
                                        ) : (
                                          <SignatureCanvas
                                            id="canvas"
                                            ref={(ref) => {
                                              this.sigPadPro = ref;
                                            }}
                                            onBegin={this.onStartSignature}
                                            penColor="black"
                                            canvasProps={{
                                              width: 500,
                                              height: 200,
                                              className: "sigCanvas",
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Drag AND Drop files*/}

                                <div className="col-12 mt-2">
                                  <div className="form-group custon_select border text-center mb-0 border-rad-5">
                                    <div id="drop-area">
                                      <input
                                        type="file"
                                        id="fileElem"
                                        accept="image/jpeg,image/jpg"
                                        onChange={(e) => {
                                          this.uploadSignatureImage(
                                            e.target.files
                                          );
                                        }}
                                        onClick={(event) => {
                                          event.currentTarget.value = null;
                                        }} //to upload the same file again
                                      />
                                      <label
                                        className="upload-label"
                                        htmlFor="fileElem"
                                      >
                                        <div className="upload-text">
                                          <img
                                            src="images/drag-file.png"
                                            className="import_icon img-fluid"
                                            alt="signature"
                                          />
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {/* end */}
                              </div>
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

        <ChartSort
          openChartSortModal={this.state.openChartSortModal}
          closeModal={this.closeModal}
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          defaultChartSort={this.state.chartSort} //chart sort that show on this page e.g 'AU.01.000'
          getUpdatedChartSort={this.getUpdatedChartSort} //get updated chart sort to show on this page
        />
        <ChartCode
          openChartCodeModal={this.state.openChartCodeModal}
          closeModal={this.closeModal}
          chartCodes={this.props.chart.getChartCodes.chartCodes || []} //api response (get chart codes array)
          chartCode={this.state.chartCode} //value of chartCode (single value) that is shown in chart code input field
          getUpdatedChartCode={this.getUpdatedChartCode} //get updated chart code to show on this page
          chartSort={this.state.chartSort} //to get filtered chart codes list
          props={this.props}
        />

        <TaxCode
          openTaxCodeModal={this.state.openTaxCodeModal}
          closeModal={this.closeModal}
          taxCodes={this.props.chart.getTaxCodes || []} //api response (get tax codes array)
          taxCode={this.state.taxCode} //value of taxCode (single value) that is shown in chart code input field
          getUpdatedTaxCode={this.getUpdatedTaxCode} //get updated tax code to show on this page
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
  user: state.user,
  chart: state.chart,
});

export default connect(mapStateToProps, {
  getDefaultValues: UserActions.getDefaultValues,
  getAccountDetails: UserActions.getAccountDetails,
  clearUserStates: UserActions.clearUserStates,
  getChartSorts: ChartActions.getChartSorts,
  getChartCodes: ChartActions.getChartCodes,
  getFlags: ChartActions.getFlags,
  getTaxCodes: ChartActions.getTaxCodes,
  clearChartStates: ChartActions.clearChartStates,
  updateAccountDetails: UserActions.updateAccountDetails,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Settings);
