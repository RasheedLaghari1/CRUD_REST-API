import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./TrackingCodesLayout.css";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from '../Filter/Filter'
import Settings from "../../Modals/SetupModals/Settings/Settings";
import TrackingCodeModal from "../../Modals/SetupModals/TrackingCode/TrackingCode";

import * as Validation from '../../../Utils/Validation'
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox
} from '../../../Utils/Helpers'
import * as ChartActions from "../../../Actions/ChartActions/ChartActions";

const uuidv1 = require("uuid/v1");

class TrackingCodesLayout extends Component {
  constructor() {
    super();
    this.state = {
      trackingCodes: [], //tracking codes list
      recordID: '', //tracking code ID
      columns: [
        { name: 'Tracking Type', hide: false },
        { name: 'Sequence', hide: false },
        { name: 'Description', hide: false },
      ],
      description: '',
      length: '',
      prompt: "",
      sequence: "",
      status: "",
      taxCode: "N", //Determines if the tracking code uses the Indirect Tax Codes instead of custom fields. Accepts Y or N
      trackingOptions: [],
      clonedTrackingOptions: [],
      checkAllOptions: false, //tracking options check uncheck all options
      showHiddenRows: false,
      trackingType: "",
      typeOptions: [],
      pageLength: 10,
      openSettingsModal: false,
      openTrackingCodeModal: false,
      addTrackCodeCheck: false,//add tracking code check
      formErrors: {
        trackingType: "",
        description: "",
        length: "",
        prompt: "",
        sequence: "",
      }
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('trackingcodeslayout')
    this.getTrackingCodes()
  }
  componentWillMount() {
    $(function () {
      "use strict";
      (function () {
        $(".setup_menu").on("click", function () {
          var id = $(this).attr("data-target");
          if (id === "#top_nav_toggle1") {
            $(`${id}`).toggleClass("show");
          }
        });

        $(".dash_menu_toggle.top--nav").on("click", function () {
          $(".setup_menu").click();
        });
      })();
    });
  }

  openModal = name => {
    this.setState({ [name]: true })
  }
  closeModal = name => {
    this.setState({ [name]: false }, () => {
      if (name === 'openTrackingCodeModal') {
        setTimeout(() => {
          this.clearStates()
        }, 300);
      }
    })

  }
  clearStates = () => {
    this.setState({
      columns: [
        { name: 'Tracking Type', hide: false },
        { name: 'Sequence', hide: false },
        { name: 'Description', hide: false },
      ],
      recordID: '', //tracking code ID
      description: '',
      length: '',
      prompt: "",
      sequence: "",
      status: "", //The status of the tracking code. Accepts Required, Read-Only or Hide.
      taxCode: "N",
      trackingOptions: [],
      clonedTrackingOptions: [],
      checkAllOptions: false, //tracking options check uncheck all options
      trackingType: "",
      typeOptions: [],
      pageLength: 10,
      openSettingsModal: false,
      openTrackingCodeModal: false,
      addTrackCodeCheck: false,
      formErrors: {
        trackingType: "",
        description: "",
        length: "",
        prompt: "",
        sequence: "",
      }
    })
  }
  //main Tracking Codes list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: 'checkbox' }
    aoColumns[1] = { sName: 'Tracking Type' }
    aoColumns[2] = { sName: 'Sequence' }
    aoColumns[3] = { sName: 'Description' }
    aoColumns[4] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'trackingcodeslayout')
    this.setState({ ...result })
  }

  //get tracking codes
  getTrackingCodes = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.getTrackingCodes();
    //success case of get tracking codes
    if (this.props.chart.getTrackingCodesSuccess) {
      // toast.success(this.props.chart.getTrackingCodesSuccess);
      let getTrackingCodes =
        (JSON.parse(JSON.stringify(this.props.chart.getTrackingCodes))) ||
        [];

      this.setState({
        trackingCodes: getTrackingCodes
      }, () => {
        this.tableSetting()
      })
    }
    //error case of get tracking codes
    if (this.props.chart.getTrackingCodesError) {
      handleAPIErr(this.props.chart.getTrackingCodesError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });

  }
  //get single tracking code
  getTrackingCode = async (e, tCode) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }
    this.setState({
      isLoading: true
    })
    let recordID = tCode.recordID;
    await this.props.getTrackingCode(recordID)

    //success case of get tracking code
    if (this.props.chart.getTrackingCodeSuccess) {
      // toast.success(this.props.chart.getTrackingCodeSuccess);

      let getTrackingCode =
        (JSON.parse(JSON.stringify(this.props.chart.getTrackingCode))) ||
        "";
      let trackingType = getTrackingCode.trackingType || ''
      let description = getTrackingCode.description || ''
      let length = getTrackingCode.length || ''
      let prompt = getTrackingCode.prompt || ''
      let sequence = getTrackingCode.sequence || ''
      let status = getTrackingCode.status || ''
      let taxCode = getTrackingCode.taxCode || ''
      let trackingOptions = getTrackingCode.trackingOptions || []
      let typeOptions = getTrackingCode.typeOptions || []

      trackingType = { label: trackingType || '', value: trackingType || '' }

      let _typOptns = []
      typeOptions.map((typ, i) => {
        _typOptns.push({ label: typ.option, value: typ.option })
      })

      trackingOptions.map((lst, i) => {
        lst.id = uuidv1();
        lst.checked = false
        lst.hide = false;
        return lst;
      });

      //get tracking options list data from the local storage to hide/unhide rows for tracking options
      let trackingOptionsList = JSON.parse(
        localStorage.getItem("trackingOptionsList") || "[]"
      );
      if (trackingOptionsList && trackingOptionsList.length > 0) {
        trackingOptions.map((op, i) => {
          let found = trackingOptionsList.find(lst => (
            op.category === lst.category &&
            op.description === lst.description
          ))
          if (found) {
            op.hide = true;
          }
        });
      }

      this.setState({
        trackingType,
        recordID,
        description,
        length,
        prompt,
        sequence,
        status,
        taxCode,
        trackingOptions: trackingOptions,
        clonedTrackingOptions: trackingOptions,
        showHiddenRows: true,
        typeOptions: _typOptns,
      }, () => {
        this.openModal("openTrackingCodeModal")
      })
    }
    //error case of get tracking code
    if (this.props.chart.getTrackingCodeError) {
      handleAPIErr(this.props.chart.getTrackingCodeError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //update tracking code
  updateTrackingCode = async (dep) => {
    let {
      trackingType,
      typeOptions,
      recordID,
      prompt,
      description,
      length,
      sequence,
      status,
      taxCode,
      trackingCodes,
      clonedTrackingOptions,
      addTrackCodeCheck,
      formErrors
    } = this.state;

    let typeOP = [];
    typeOptions.map((tp => {
      typeOP.push({ option: tp.value })
    }))

    let data = {
      trackingCode: {
        trackingType: trackingType.value,
        typeOptions: typeOP,
        recordID,
        prompt,
        description,
        length,
        sequence,
        status,
        taxCode,
        trackingOptions: clonedTrackingOptions
      }
    }
    length = Number(length) === 0 ? '' : length

    formErrors = Validation.handleWholeValidation({ trackingType: trackingType.value || '', prompt, description, length, sequence }, formErrors)
    if (!formErrors.trackingType && !formErrors.prompt && !formErrors.description && !formErrors.length && !formErrors.sequence) {

      this.setState({
        isLoading: true
      })
      await this.props.updateTrackingCode(data)

      //success case of update tracking code
      if (this.props.chart.updateTrackingCodeSuccess) {
        // toast.success(this.props.chart.updateTrackingCodeSuccess);

        if (addTrackCodeCheck) {
          //add tracking code case
          window.location.reload()
        } else {
          //update tracking code case

          //also update the table
          let found = trackingCodes.findIndex(d => d.recordID === recordID)
          if (found != -1) {
            let table = window.$("#trackingcodeslayout").DataTable()

            trackingCodes[found] = data.trackingCode

            this.setState({
              trackingCodes: [...trackingCodes],
            }, () => {
              table
                .row(found)
                .invalidate('dom')
                .draw(false);
              this.closeModal('openTrackingCodeModal')
            })
          }
        }

      }
      //error case of update tracking code
      if (this.props.chart.updateTrackingCodeError) {
        handleAPIErr(this.props.chart.updateTrackingCodeError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })
  }
  //add tracking code
  addTrackingCode = async () => {

    this.setState({
      isLoading: true
    })
    await this.props.addTrackingCode()
    let obj = {}
    let flag = false
    //success case of add tracking code
    if (this.props.chart.addTrackingCodeSuccess) {
      // toast.success(this.props.chart.addTrackingCodeSuccess);
      let data = this.props.chart.addTrackingCode;
      let typeOptions = data.typeOptions || []
      let _typOptns = []
      typeOptions.map((typ, i) => {
        _typOptns.push({ label: typ.option, value: typ.option })
      })
      let trackingType = data.trackingType || ''

      obj = {
        ...data,
        trackingType: { label: trackingType || '', value: trackingType || '' },
        typeOptions: _typOptns,
        trackingOptions: [{
          category: '',
          description: '',
          value: '',
          checked: false
        }],
        addTrackCodeCheck: true
      }
      flag = true
    }
    //error case of add tracking code
    if (this.props.chart.addTrackingCodeError) {
      handleAPIErr(this.props.chart.addTrackingCodeError, this.props);
    }
    this.props.clearChartStates();

    this.setState({ isLoading: false, ...obj }, () => {
      if (flag) {
        this.openModal("openTrackingCodeModal")
      }
    })

  }
  //delete tracking code
  deleteTrackingCode = async () => {

    let { recordID, trackingCodes } = this.state;

    if (recordID) {
      this.setState({
        isLoading: true
      })
      await this.props.deleteTrackingCode(recordID)

      //success case of delete tracking code
      if (this.props.chart.deleteTrackingCodeSuccess) {
        toast.success(this.props.chart.deleteTrackingCodeSuccess);

        let table = window.$("#trackingcodeslayout").DataTable()

        let index = trackingCodes.findIndex(c => c.recordID === recordID)

        let filtersList = trackingCodes.filter(c => c.recordID != recordID)
        trackingCodes = filtersList
        this.setState({
          trackingCodes,
          recordID: ''
        }, () => {
          table.row(index).remove().draw(false); //also update table
        })
      }

      //error case of delete tracking code
      if (this.props.chart.deleteTrackingCodeError) {
        handleAPIErr(this.props.chart.deleteTrackingCodeError, this.props);
      }
      this.props.clearChartStates();
      this.setState({
        isLoading: false
      })
    } else {
      toast.error("Record ID is Missing!")
    }
  }
  getTrackingOptions = async (type) => {
    this.setState({
      isLoading: true
    })
    let { trackingOptions, clonedTrackingOptions } = this.state;
    await this.props.getTrackingOptions(type)
    //success case of get tracking options
    if (this.props.chart.getTrackingOptionsSuccess) {
      // toast.success(this.props.chart.getTrackingOptionsSuccess);
      trackingOptions = this.props.chart.getTrackingOptions || []


      trackingOptions.map((lst, i) => {
        lst.id = uuidv1();
        lst.checked = false
        lst.hide = false;
        return lst;
      });

      //get tracking options list data from the local storage to hide/unhide rows for tracking options
      let trackingOptionsList = JSON.parse(
        localStorage.getItem("trackingOptionsList") || "[]"
      );
      if (trackingOptionsList && trackingOptionsList.length > 0) {
        trackingOptions.map((op, i) => {
          let found = trackingOptionsList.find(lst => (
            op.category === lst.category &&
            op.description === lst.description
          ))
          if (found) {
            op.hide = true;
          }
        });
      }
    }
    //error case of get tracking options
    if (this.props.chart.getTrackingOptionsError) {
      handleAPIErr(this.props.chart.getTrackingOptionsError, this.props);
    }
    this.props.clearChartStates();
    this.setState({
      isLoading: false,
      trackingOptions: trackingOptions,
      clonedTrackingOptions: trackingOptions,
      showHiddenRows: true
    })
  }
  //prime tracking option
  primeTrackingOption = () => {
    let { trackingOptions, clonedTrackingOptions } = this.state;
    let obj = {
      category: '',
      description: '',
      value: '',
      checked: false,
      hide: false,
      id: uuidv1()
    }
    trackingOptions = [...trackingOptions, obj]
    clonedTrackingOptions = [...clonedTrackingOptions, obj]
    this.setState({ trackingOptions, clonedTrackingOptions, checkAllOptions: false })
  }
  //delete tracking option
  deleteTrackingOption = async () => {
    let { trackingOptions, checkAllOptions } = this.state;
    let trOption = trackingOptions.find(op => op.checked)
    if (trOption) {
      let options = trackingOptions.filter((c) => !c.checked);
      if (options.length === 0) {
        checkAllOptions = false
      }
      this.setState({ trackingOptions: options, checkAllOptions });
    } else {
      toast.error('Please select options first!')
    }
  }
  //handle tracking code list checkbox
  handleCharttListCheckbox = (e, code) => {
    if (e.target.checked) {
      this.setState({ recordID: code.recordID })
    } else {
      this.setState({ recordID: '' })
    }
  }
  //Settings Popup
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value })
    } else {
      let { columns } = this.state
      columns[i].hide = e.target.checked
      this.setState({ columns })
    }
  }
  handleSaveSettings = () => {
    let { columns, pageLength } = this.state;
    handleSaveSettings(columns, 'trackingcodeslayout', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'trackingcodeslayout')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }

  //handle change type
  handleChangeType = (obj) => {
    let { formErrors } = this.state;

    formErrors = Validation.handleValidation('trackingType', obj.value, formErrors)
    this.setState({ trackingType: obj, formErrors, checkAllOptions: false })
    if (obj.value) {
      this.getTrackingOptions(obj.value)
    }
  }
  handleChangeField = (e) => {
    const { name, value } = e.target;
    let { formErrors } = this.state
    formErrors = Validation.handleValidation(name, value, formErrors)
    this.setState({ [name]: value, formErrors })
  }
  //handle tracking options values 
  handleTrackingValues = (e, op, index) => {
    let { trackingOptions } = this.state;
    let { name, value } = e.target;
    //no need to update in clonedTrackingOptions because trackingOptions and clonedTrackingOptions pointing the same address in memory
    trackingOptions.map((valOP, i) => { //valOP -> value option
      if (valOP.category === op.category && valOP.description === op.description && valOP.value === op.value) {
        valOP[name] = value
      }
      return valOP
    })

    this.setState({ trackingOptions })
  }
  //handle status and tax codes checks
  handleChecks = (e) => {
    const { name, checked, value } = e.target;
    if (name === 'status') {
      this.setState({
        status: value
      })
    } else {
      //Use Tax Codes
      this.setState({
        taxCode: checked ? 'Y' : 'N'
      })
    }
  }
  //handle tracking code options checks
  handleOptionsCheckboxes = async (e, tcOption, index) => {
    let { trackingOptions, checkAllOptions } = this.state;
    if (tcOption === "all") {
      if (e.target.checked) {
        trackingOptions.map((c, i) => {
          c.checked = true;
          return c;
        });
      } else {
        trackingOptions.map((c, i) => {
          c.checked = false;
          return c;
        });
      }
      this.setState({ trackingOptions, checkAllOptions: e.target.checked });
    } else {
      if (e.target.checked) {
        tcOption.checked = e.target.checked;
        trackingOptions[index] = tcOption;

        let _check = trackingOptions.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAllOptions = true;
        }
        this.setState({ trackingOptions, checkAllOptions });
      } else {
        tcOption.checked = e.target.checked;
        trackingOptions[index] = tcOption;
        this.setState({ checkAllOptions: false, trackingOptions });
      }
    }
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {
    let trackingOptions = JSON.parse(JSON.stringify(this.state.trackingOptions));
    let clonedTrackingOptions = this.state.clonedTrackingOptions;

    if (!item.hide) {
      //hide row
      let list = trackingOptions.filter((l) => l.id != item.id);
      item.hide = true;
      let foundIndex = clonedTrackingOptions.findIndex((x) => x.id == item.id);
      if (foundIndex >= 0) {
        clonedTrackingOptions[foundIndex] = item;
      }
      //also save this setting on Local Storage
      let trackingOptionsList = JSON.parse(
        localStorage.getItem("trackingOptionsList") || "[]"
      );
      if (trackingOptionsList && trackingOptionsList.length > 0) {
        let check = true;
        trackingOptionsList.map((al, i) => {
          if (
            al.category === item.category &&
            al.description === item.description
          ) {
            check = false;
          }
        });

        if (check) {
          let obj = {
            category: item.category,
            description: item.description,
            value: item.value,
          };
          trackingOptionsList.push(obj);

          localStorage.setItem("trackingOptionsList", JSON.stringify(trackingOptionsList));
        }

      } else {
        //trackingOptionsList doesn't contain in local storage

        let trackingOptionsList = [];
        let obj = {
          category: item.category,
          description: item.description,
          value: item.value,
        };
        trackingOptionsList.push(obj);

        localStorage.setItem("trackingOptionsList", JSON.stringify(trackingOptionsList));
      }

      this.setState({
        trackingOptions: list,
        clonedTrackingOptions,
        showHiddenRows: false,
      });

    } else {
      //un-hide row
      item.hide = false;

      let _foundIndex = trackingOptions.findIndex((x) => x.id == item.id);
      trackingOptions[_foundIndex] = item;

      let foundIndex = clonedTrackingOptions.findIndex((x) => x.id == item.id);
      clonedTrackingOptions[foundIndex] = item;

      //also remove this setting on Local Storage
      let savedData = localStorage.getItem("trackingOptionsList");
      if (savedData) {
        let trackingOptionsList = JSON.parse(
          localStorage.getItem("trackingOptionsList") || "[]"
        );
        if (trackingOptionsList.length > 0) {
          let lstArr = [];
          trackingOptionsList.map((d, i) => {
            if (
              !(
                d.category === item.category &&
                d.description === item.description
              )
            ) {
              lstArr.push(d);
            }
          });

          if (lstArr.length > 0) {
            localStorage.setItem("trackingOptionsList", JSON.stringify(lstArr));
          } else {
            localStorage.removeItem("trackingOptionsList");
          }
        }
      }

      this.setState({
        trackingOptions,
        clonedTrackingOptions,
      });
    }

  };
  //show hidden rows
  handleShowHiddenRows = async () => {

    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedTrackingOptions = this.state.clonedTrackingOptions;
        clonedTrackingOptions.map(op => op.checked = false)
        this.setState({ trackingOptions: clonedTrackingOptions, checkAllOptions: false });
      } else {
        //hide again hidden rows
        let trackingOptions = this.state.trackingOptions;
        let list = trackingOptions.filter((l) => !l.hide);
        this.setState({ trackingOptions: list, checkAllOptions: false });
      }
    });
  };
  render() {
    let { trackingCodes } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="user_setup_main">
          <header>
            <TopNav />
            <div className="user_setup_heading">
              <div className="header_menu">
                <Link to="/dashboard">
                  <img
                    src="images/dash-logo.png"
                    className="img-fluid"
                    alt="logo"
                  />
                </Link>
                <Link
                  className="setup_menu"
                  to="#"
                  data-target="#top_nav_toggle1"
                >
                  <img src="images/top-menu.png" className="" alt="top-menu" />
                </Link>
              </div>
              <h2>tracking codes layout</h2>
              <span>
                <img
                  src="./images/user-setup/lock.png"
                  alt="lock"
                  className="img-fluid"
                />
              </span>
            </div>
            <div className="user_setup_headerbox">
              <div className="user_setup_play_div">
                <ul>
                  <li>
                    <p className="user_setup_play_video">Video</p>
                  </li>
                  <li>
                    <p className="user_setup_play_tuturial">Tutorials</p>
                  </li>
                </ul>
                <span className="user_setup_play_icon">
                  <img
                    src="./images/user-setup/play.png"
                    alt="play"
                    className="img-fluid"
                  />
                </span>
              </div>
              <div className="user_setup_header_rightbox">
                <p>
                  In our{" "}
                  <span>
                    <a href="#">Video</a>
                  </span>{" "}
                  learn how to use tracking codes layout Read our{" "}
                  <span>
                    <a href="#">help article</a>
                  </span>{" "}
                  to learn More
                </p>
              </div>
              <span>
                <img
                  className="close_top_sec"
                  src="images/user-setup/cross.png"
                  alt="cross"
                ></img>
              </span>
            </div>
          </header>
          <div className="col-sm-12 table_white_box">
            {/* Filter */}
            <Filter />
            {/* End Filter */}
            <div className="user_setup_plus_Icons">
              <ul>
                <li>
                  <button onClick={this.addTrackingCode} className="btn user_setup_rbtns" type="button">
                    <span
                      className="round_plus"
                    >
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteTrackingCode} className="btn user_setup_rbtns" type="button">
                    <span className="round_file">
                      {" "}
                      <img
                        src="./images/user-setup/delete.png"
                        alt="filter"
                      ></img>
                    </span>
                  </button>
                </li>
                <li>
                  <div>
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn setting_popup_dots"
                    >
                      <Dropdown.Toggle variant="sucess" id="dropdown-basic">
                        <span className="dots_img">
                          <img
                            src="./images/user-setup/dots.png"
                            alt="filter"
                          ></img>
                        </span>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </li>
              </ul>
            </div>
            {/* new tale add start */}
            <body>
              <table
                id="trackingcodeslayout"
                className=" user_setup_table"
                width="100%"
              >
                <thead>
                  <tr>
                    <th>
                      <div className="custom-radio">
                        <label
                          className="check_main remember_check"
                          htmlFor="customRadio1109"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customRadio1109"
                            name="example1"
                          />
                          <span className="click_checkmark global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className="user_setup_hed">Tracking Type</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Sequence</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th className="text-center">
                      <span className="user_setup_hed2" onClick={() => this.openModal("openSettingsModal")}>
                        {" "}
                        <img
                          src="./images/user-setup/bars.png"
                          alt="bars"
                        ></img>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    trackingCodes.map((tc, i) => {
                      return <tr key={tc.recordID} onClick={(e) => this.getTrackingCode(e, tc)} className="cursorPointer">
                        <td>
                          <div className="custom-radio">
                            <label className="check_main remember_check" htmlFor={`listCheck${i}`}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${i}`}
                                name={'codeListCheck'}
                                checked={tc.recordID === this.state.recordID}
                                onChange={(e) => this.handleCharttListCheckbox(e, tc)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td> {tc.trackingType} </td>
                        <td> {tc.sequence} </td>
                        <td> {tc.description} </td>
                        <td></td>
                      </tr>
                    })
                  }
                </tbody>
              </table>
            </body>
            {/* end new table */}
          </div>
        </div>
        <Settings
          openSettingsModal={this.state.openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={this.state.columns}
          pageLength={this.state.pageLength}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={this.handleSaveSettings}
          handleCloseSettingModal={this.handleCloseSettingModal}
        />
        <TrackingCodeModal
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChangeField={this.handleChangeField}
          handleChangeType={this.handleChangeType}
          handleChecks={this.handleChecks}
          updateTrackingCode={this.updateTrackingCode}
          handleTrackingValues={this.handleTrackingValues}
          primeTrackingOption={this.primeTrackingOption}
          deleteTrackingOption={this.deleteTrackingOption}
          handleOptionsCheckboxes={this.handleOptionsCheckboxes}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleShowHiddenRows={this.handleShowHiddenRows}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  chart: state.chart
});
export default connect(mapStateToProps, {
  getTrackingCodes: ChartActions.getTrackingCodes,
  getTrackingCode: ChartActions.getTrackingCode,
  updateTrackingCode: ChartActions.updateTrackingCode,
  addTrackingCode: ChartActions.addTrackingCode,
  deleteTrackingCode: ChartActions.deleteTrackingCode,
  getTrackingOptions: ChartActions.getTrackingOptions,
  clearChartStates: ChartActions.clearChartStates
})(TrackingCodesLayout);
