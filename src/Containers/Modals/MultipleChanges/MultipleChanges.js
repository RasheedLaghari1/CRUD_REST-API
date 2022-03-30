import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import "./MultipleChanges.css";
import ChartSort from "../../Modals/ChartSort/ChartSort";
import ChartCode from "../../Modals/ChartCode/ChartCode";
import TrackingCode from "../../Modals/TrackingCode/TrackingCode";
import { toast } from "react-toastify";

class MultipleChanges extends Component {
  constructor() {
    super();
    this.state = {
      openTaxCodeModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,

      selected: [],
      optionsTrack: [
        { label: "A 01", value: 1 },
        { label: "01", value: 2 },
        { label: "A", value: 3 },
      ],
      trackingCodes: [],
      flags: [],
      clonedFlags: [],

      chartSort: "",
      chartCode: "",

      trackingCodeCheck: false,
      chartCodeCheck: false,
      chartSortCheck: false,
      formErrors: {
        chartSort: "",
        // chartCode: "",
        trackingCode: "",
      },
    };
  }

   componentWillReceiveProps(nextProps) {
    let clonedFlags = this.state.clonedFlags;
    if (
      clonedFlags &&
      clonedFlags.length == 0 &&
      this.props.clonedFlags &&
      this.props.clonedFlags.length > 0 &&
      this.props.flags &&
      this.props.flags.length > 0
    ) {
       this.setState({
        clonedFlags: JSON.parse(JSON.stringify(this.props.clonedFlags)),
        flags: JSON.parse(JSON.stringify(this.props.flags)),
      });
    }
  }
  openModal =  (name) => {
    if (name === "openChartCodeModal") {
       this.setState({ openChartCodeModal: true });
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
  handleTrackingCode = () => {
    this.openModal("openTrackingCodeModal");
  };

  handleTrackingCode = async (data) => {
    //data consists of where user clicks on tracking codes dropdown e.g { lable: 'tax', value: 01 }, { lable: 'set', value: 02 }
    let flags = this.props.flags_api; //object contains multiple flags {  set: [], insurance: [], tax: [] } => get flags api respose
    // let flagArr = [];
    let flagsObj = { data };
    for (var f of Object.keys(flags)) {
      if (data.label.toLowerCase() === f.toLowerCase()) {
        // flagArr = flags[f];
        flagsObj.flagArr = flags[f];
      }
    }
    //flagArr contains all flags regarding to selected tracking code
     this.setState({ trackingCodes: flagsObj },()=>this.openModal("openTrackingCodeModal"));
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
      await this.setState({ flags, clonedFlags });
    }
  };
  //get new chart sort value through chart sort modal
  getUpdatedChartSort = async (chartSort) => {
    if (chartSort) {
       this.setState({ chartSort });
    }
     this.validateField("chartSort", chartSort);
  };

  //get new chart code value through chart code modal
  getUpdatedChartCode =  (chartCode) => {
     this.setState({ chartCode });
  };
  validateField =  (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "chartSort":
        if (value.length < 1) {
          formErrors.chartSort = "This Field is Required.";
        } else {
          formErrors.chartSort = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  clearStates =  () => {
     this.props.closeModal("openMultipleChangesModal");
     this.setState({
      trackingCodes: [],
      flags: [],
      clonedFlags: [],
      chartSort: "",
      chartCode: "",
      trackingCodeCheck: false,
      chartCodeCheck: false,
      chartSortCheck: false,
      formErrors: {
        chartSort: "",
        // chartCode: "",
        trackingCode: "",
      },
    });
  };

  handleCheckBoxes = async (e) => {
    let name = e.target.name;
    let checked = e.target.checked;
    await this.setState({ [name]: checked });

    let {
      chartCodeCheck,
      chartSortCheck,
      trackingCodeCheck,
      clonedFlags,
    } = this.state;
    let formErrors = this.state.formErrors;

    if (chartSortCheck) {
      if (!this.state.chartSort) {
        formErrors.chartSort = "This Field is Required.";
      }
    } else {
      formErrors.chartSort = "";
    }

    // if (chartCodeCheck) {
    //   if (!this.state.chartCode) {
    //     formErrors.chartCode = "This Field is Required.";
    //   }
    // } else {
    //   formErrors.chartCode = "";
    // }
    if (trackingCodeCheck) {
      let flagIsEmpty = false;

      // clonedFlags.map((f, i) => {
      //   if (f.value.trim() == "") {
      //     flagIsEmpty = true;
      //   }
      // });

      // if (flagIsEmpty) {
      //   formErrors.trackingCode = "This Field is Required.";
      // }
    } else {
      formErrors.trackingCode = "";
    }
     this.setState({
      formErrors: formErrors,
    });
  };
  onSave = async () => {
    let {
      chartSort,
      chartCode,
      clonedFlags,
      chartCodeCheck,
      chartSortCheck,
      trackingCodeCheck,
    } = this.state;
    let formErrors = this.state.formErrors;
    if (
      !formErrors.trackingCode &&
      !formErrors.chartSort 
      // !formErrors.chartCode
    ) {
      let obj = {};

      if (chartCodeCheck) {
        obj.chartCode = chartCode;
      }
      if (chartSortCheck) {
        obj.chartSort = chartSort;
      }
      if (trackingCodeCheck) {
        obj.trackingCodes = clonedFlags;
      }
      let lines = this.props.lines || [];
      let check = lines.find((l) => l.checked);

      if (check) {
        if (chartCodeCheck || chartSortCheck || trackingCodeCheck) {
          await this.props.handleMultipleChanges(obj);
          await this.clearStates();
        } else {
          toast.error("Please Select Checkbox for Multiple Changes!");
        }
      } else {
        toast.error("Please tick lines for Multiple changes!");
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
         Everything else in the PO/invoice is read-only and cannot be altered.*/

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

    // for tracking codes
    let clonedFlags = this.state.clonedFlags || [];
    let trckng_codes = { label: "Select Tracking codes", value: 0 };
    if (clonedFlags && clonedFlags.length > 0) {
      let insurance = clonedFlags.find(
        (f) => f.type && f.type.toLowerCase() === "insurance"
      );
      let free = clonedFlags.find(
        (f) => f.type && f.type.toLowerCase() === "free"
      );
      let tax = clonedFlags.find(
        (f) => f.type && f.type.toLowerCase() === "tax"
      );
      let set = clonedFlags.find(
        (f) => f.type && f.type.toLowerCase() === "set"
      );

      let ins = insurance && insurance.value ? insurance.value : " ";
      let fre = free && free.value ? free.value : " ";
      let tx = tax && tax.value ? tax.value : " ";
      let st = set && set.value ? set.value : " ";
      trckng_codes = {
        label: (
          <>
            {" "}
            {ins} &nbsp; {fre} &nbsp; {tx}&nbsp; {st}{" "}
          </>
        ),
        value: "",
      };
    }
    // end

    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openMultipleChangesModal}
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
                              <h6 className="text-left def-blue">
                                Multiple Changes
                              </h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              {checkTwo ? (
                                <button type="button" className="btn-save">
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={this.onSave}
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
                          <div className="col-md-12">
                            <div className="form-group custon_select">
                              <label>Chart Sort</label>
                              <div className="modal_input check-wid-input">
                                <div className="row border-full m-0">
                                  <div className="col-auto p-0">
                                    <div className="form-group remember_check mt-2">
                                      <input
                                        type="checkbox"
                                        id="remember111"
                                        name="chartSortCheck"
                                        checked={this.state.chartSortCheck}
                                        onChange={this.handleCheckBoxes}
                                        disabled={checkOne}
                                      />
                                      <label htmlFor="remember111"></label>
                                    </div>
                                  </div>

                                  <div className="col pl-0">
                                    <div className="form-group custon_select mb-0">
                                      <div className="modal_input ">
                                        <input
                                          type="text"
                                          className="form-control mb-0 border-0"
                                          placeholder="Chart Sort"
                                          id="usr"
                                          name="chartSort"
                                          onChange={() => {}}
                                          value={this.state.chartSort}
                                          disabled={checkTwo}
                                        />
                                        <span className="input_field_icons">
                                          {checkOne ? (
                                            <i className="fa fa-search"></i>
                                          ) : (
                                            <i
                                              onClick={() =>
                                                this.openModal(
                                                  "openChartSortModal"
                                                )
                                              }
                                              className="fa fa-search"
                                            ></i>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-danger error-12">
                                  {this.state.formErrors.chartSort !== ""
                                    ? this.state.formErrors.chartSort
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <div className="form-group custon_select">
                              <label>Chart Code</label>
                              <div className="modal_input check-wid-input">
                                <div className="row border-full m-0">
                                  <div className="col-auto p-0">
                                    <div className="form-group remember_check mt-2">
                                      <input
                                        type="checkbox"
                                        id="remember2"
                                        name="chartCodeCheck"
                                        checked={this.state.chartCodeCheck}
                                        onChange={this.handleCheckBoxes}
                                        disabled={checkTwo}
                                      />
                                      <label htmlFor="remember2"></label>
                                    </div>
                                  </div>
                                  <div className="col pl-0">
                                    <div className="form-group custon_select mb-0">
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control mb-0 border-0"
                                          placeholder="Chart Code"
                                          id="usr"
                                          name="chartCode"
                                          onChange={() => {}}
                                          value={this.state.chartCode}
                                          disabled={checkTwo}
                                        />
                                        <span className="input_field_icons">
                                          {checkTwo ? (
                                            <i className="fa fa-search"></i>
                                          ) : (
                                            <i
                                              onClick={() =>
                                                this.openModal(
                                                  "openChartCodeModal"
                                                )
                                              }
                                              className="fa fa-search"
                                            ></i>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* <div className="text-danger error-12">
                                {this.state.formErrors.chartCode !== ""
                                  ? this.state.formErrors.chartCode
                                  : ""}
                              </div> */}
                            </div>

                            <div className="form-group custon_select">
                              <label>Tracking Codes</label>
                              <div className="modal_input check-wid-input">
                                <div className="row border-full m-0">
                                  <div className="col-auto p-0">
                                    <div className="form-group remember_check mt-2">
                                      <input
                                        type="checkbox"
                                        id="remember3"
                                        name="trackingCodeCheck"
                                        checked={this.state.trackingCodeCheck}
                                        onChange={this.handleCheckBoxes}
                                        disabled={checkTwo}
                                      />
                                      <label htmlFor="remember3"></label>
                                    </div>
                                  </div>
                                  <div className="col pl-0">
                                    {/* dropdown coding start */}
                                    <div className="form-group custon_select mb-0">
                                      <Select
                                        isDisabled={checkTwo}
                                        value={trckng_codes}
                                        className="width-selector"
                                        // classNamePrefix="custon_select-selector-inner"
                                        classNamePrefix="tracking_codes track_menu custon_select-selector-inner"
                                        options={this.state.flags}
                                        onChange={this.handleTrackingCode}
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
                                <div className="text-danger error-12">
                                  {this.state.formErrors.trackingCode !== ""
                                    ? this.state.formErrors.trackingCode
                                    : ""}
                                </div>
                              </div>
                            </div>

                            {/* <div className="form-group custon_select">
                              <label>Tracking Codes</label>
                              <div className="modal_input check-wid-input">
                                <div className="row border-full m-0">
                                  <div className="col-auto p-0">
                                    <div className="form-group remember_check mt-2">
                                      <input type="checkbox" id="remember3" />
                                      <label htmlFor="remember3"></label>
                                    </div>
                                  </div>
                                  <div className="col pl-0">
                                    <div className="form-group custon_select mb-0">
                                      <Select
                                        className="width-selector"
                                        defaultValue={
                                          this.state.optionsTrack[0]
                                        }
                                        classNamePrefix="border_b track_menu custon_select-selector-inner"
                                        options={this.state.optionsTrack}
                                        onChange={this.handleTrackingCode}
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
                                      <span
                                        className="input_field_icons rit-icon-input"
                                        data-toggle="collapse"
                                        data-target="#asd"
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>  */}
                            {/* <div className="form-group custon_select">
                              <label>Tax Code</label>
                              <div className="modal_input check-wid-input">
                                <div className="row border-full m-0">
                                  <div className="col-auto p-0">
                                    <div className="form-group remember_check mt-2">
                                      <input type="checkbox" id="remember4" />
                                      <label htmlFor="remember4"></label>
                                    </div>
                                  </div>
                                  
                                  <div className="col pl-0">
                                    <div className="form-group custon_select mb-0">
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control mb-0 border-0"
                                          placeholder="G"
                                          id="usr"
                                        />
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
                                </div>
                              </div>
                            </div> */}
                          </div>
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
          props={this.props.props || ""}
          chartSort={this.state.chartSort}
          chartCode={this.state.chartCode} //value of chartCode (single value) that is shown in chart code input field
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

export default MultipleChanges;
