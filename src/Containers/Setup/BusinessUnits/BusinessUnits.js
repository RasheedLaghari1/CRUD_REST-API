import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./BusinessUnits.css";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import * as SetupAction from "../../../Actions/SetupRequest/SetupAction";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import CompanyDetail from "../../Modals/SetupModals/CompanyDetail/CompanyDetail";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from '../Filter/Filter'
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows
} from '../../../Utils/Helpers'
import { toast } from "react-toastify";
const uuidv1 = require("uuid/v1");
class BusinessUnits extends Component {
  constructor() {
    super();
    this.state = {
      openSettingsModal: false,
      openCompanyDetailModal: false,
      columns: [],
      addressShippingCheck: "address",
      address: "",
      address2: "",
      advancedList: [],
      clonedAdvancedList: [],
      city: "",
      companyName: "",
      country: "",
      postcode: "",
      shippingAddress: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingCountry: "",
      shippingPostcode: "",
      shippingState: "",
      state: "",
      taxID: "",
      busList: [],
      recordID: "",
      pageLength: 10,
      actionCheck: "",
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('businessunits')

    this.getBusinessUnitList();
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
  openModal = async (name) => {
    this.setState({ [name]: true });

    if (name === "openCompanyDetailModal") {
      window.$("#companydetail-modal").DataTable({
        dom: "Rlfrtip",
        searching: false,
        paging: false,
        info: false,
        order: [[1, "asc"]],
        colReorder: {
          fixedColumnsRight: 5,
          fixedColumnsLeft: 5
        },
      });
    }
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
    this.clearStates();
  };
  clearStates = () => {
    this.setState({
      addressShippingCheck: "address",
      address: "",
      address2: "",
      city: "",
      companyName: "",
      country: "",
      postcode: "",
      shippingAddress: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingCountry: "",
      shippingPostcode: "",
      shippingState: "",
      state: "",
      taxID: "",
      recordID: "",
      actionCheck: "",
    });
  };
  handleChangeField = (e) => {
    const { name, value } = e.target;
    // let { formErrors, showSuggestion } = this.state
    // formErrors = handleValidation(name, value, formErrors)
    this.setState({ [name]: value });
  };
  handleCheckBox = (e, obj) => {
    let { name, value } = e.target
    if (name === "buListCheck") {
      if (e.target.checked) {
        this.setState({ recordID: obj.recordID })
      } else {
        this.setState({ recordID: "" })
      }
    }
    this.setState({ [name]: value })
  };
  insertBusinessUnit = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.insertBusinessUnit();

    if (this.props.setup.insertBusinessUnitSuccess) {
      let businessUnit =
        JSON.parse(JSON.stringify(this.props.setup.insertBusinessUnit)) || "";

      let recordID = businessUnit.recordID || "";
      let address = businessUnit.address || "";
      let address2 = businessUnit.address2 || "";
      let advancedList = businessUnit.advancedList || [];
      let city = businessUnit.city || "";
      let companyName = businessUnit.companyName || "";
      let country = businessUnit.country || "";
      let postcode = businessUnit.postcode || "";
      let shippingAddress = businessUnit.shippingAddress || "";
      let shippingAddress2 = businessUnit.shippingAddress2 || "";
      let shippingCity = businessUnit.shippingCity || "";
      let shippingCountry = businessUnit.shippingCountry || "";
      let shippingPostcode = businessUnit.shippingPostcode || "";
      let shippingState = businessUnit.shippingState || "";
      let state = businessUnit.state || "";
      let taxID = businessUnit.taxID || "";
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

      //get advanced list data from the local storage to show hidden rows for all Business Units
      let busAdvancedList = JSON.parse(
        localStorage.getItem("BUAdvancedList") || "[]"
      );
      if (busAdvancedList && busAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          busAdvancedList.map((loc, i) => {
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

      this.setState(
        {
          actionCheck: "Insert",
          recordID,
          address,
          address2,
          advancedList,
          city,
          companyName,
          country,
          postcode,
          shippingAddress,
          shippingAddress2,
          shippingCity,
          shippingCountry,
          shippingPostcode,
          shippingState,
          state,
          taxID,
        },
        () => {
          this.openModal("openCompanyDetailModal");
        }
      );
    }
    //error case of prime department
    if (this.props.setup.insertBusinessUnitError) {
      handleAPIErr(this.props.setup.insertBusinessUnitError, this.props);
    }
    // this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  deleteBussinessUnit = async () => {
    let { recordID, busList } = this.state;
    if (recordID) {
      this.setState({ isLoading: true });
      await this.props.deleteBussinessUnit(recordID);
      if (this.props.setup.deleteBusinessUnitSuccess) {
        toast.success("Bussiness Unit Deleted Successfully");
        let table = window.$("#businessunits").DataTable();

        let index = busList.findIndex((c) => c.recordID === recordID);

        let filtersList = busList.filter((c) => c.recordID !== recordID);
        let data = filtersList;
        this.setState(
          {
            busList: data,
            recordID: "",
          },
          () => {
            table.row(index).remove().draw(false); //also update table
          }
        );
      } if (this.props.setup.deleteBusinessUnitError) {
        handleAPIErr(this.props.setup.deleteBusinessUnitError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Bussiness Unit First!");
    }
    this.clearStates();
  };
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    aoColumns[1] = { sName: "Bussiness Name" };
    aoColumns[2] = { sName: "Address" };
    aoColumns[3] = { sName: "menus" };

    let result = tableSetting(columns, aoColumns, 'businessunits')
    this.setState({ ...result })
  }

  getBusinessUnitList = async () => {
    this.setState({ isLoading: true });
    await this.props.getBusinessUnitList();
    if (this.props.setup.getBusinessUnitListSuccess) {
      let list = JSON.parse(
        JSON.stringify(this.props.setup.getBusinessUnitList)
      );
      let columns = [];

      //adding the column names
      columns[0] = { name: "Bussiness Name" };
      columns[1] = { name: "Address" };

      this.setState({ busList: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.setup.getBusinessUnitListError) {
      handleAPIErr(this.props.setup.getBusinessUnitListError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value });
    } else {
      let { columns } = this.state;
      columns[i].hide = e.target.checked;
      this.setState({ columns });
    }
  };
  handleSaveSettings = () => {
    let { columns, pageLength } = this.state;
    handleSaveSettings(columns, 'businessunits', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'businessunits')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  getBusinessUnit = async (e, obj) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    await this.props.getBusinessUnit(obj.recordID);

    //success case of get Bussiness Unit
    if (this.props.setup.getBusinessUnitSuccess) {

      let businessUnit =
        JSON.parse(JSON.stringify(this.props.setup.getBusinessUnit)) || "";
      let recordID = businessUnit.recordID || "";
      let address = businessUnit.address || "";
      let address2 = businessUnit.address2 || "";
      let advancedList = businessUnit.advancedList || [];
      let city = businessUnit.city || "";
      let companyName = businessUnit.companyName || "";
      let country = businessUnit.country || "";
      let postcode = businessUnit.postcode || "";
      let shippingAddress = businessUnit.shippingAddress || "";
      let shippingAddress2 = businessUnit.shippingAddress2 || "";
      let shippingCity = businessUnit.shippingCity || "";
      let shippingCountry = businessUnit.shippingCountry || "";
      let shippingPostcode = businessUnit.shippingPostcode || "";
      let shippingState = businessUnit.shippingState || "";
      let state = businessUnit.state || "";
      let taxID = businessUnit.taxID || "";

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

      //get advanced list data from the local storage to hide/unhide rows for all Business Units
      let busAdvancedList = JSON.parse(
        localStorage.getItem("BUAdvancedList") || "[]"
      );
      if (busAdvancedList && busAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          busAdvancedList.map((loc, i) => {
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

      this.setState(
        {
          actionCheck: "Update",
          recordID,
          address,
          address2,
          advancedList: filtrdList,
          clonedAdvancedList: advancedList,
          city,
          companyName,
          country,
          postcode,
          shippingAddress,
          shippingAddress2,
          shippingCity,
          shippingCountry,
          shippingPostcode,
          shippingState,
          state,
          taxID,
        },
        () => {
          this.openModal("openCompanyDetailModal");
        }
      );
    }
    //error case of get department
    if (this.props.setup.getBusinessUnitError) {
      handleAPIErr(this.props.setup.getBusinessUnitError, this.props);
    }
    // this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  //Advanced List Setting
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };
  companyDetailModalSettings = () => {
    window.$("#companydetail-modal").DataTable({
      dom: "Rlfrtip",
      language: {
        searchPlaceholder: "Search",
      },
      searching: false,
      paging: false,
      info: false,
      columnDefs: [{
        targets: -1,
        orderable: false
      }],
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  }
  handleShowHiddenRows = async () => {
    let table = window.$("#companydetail-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.companyDetailModalSettings()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.companyDetailModalSettings()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#companydetail-modal",
      "BUAdvancedList",
      advancedList,
      clonedAdvancedList,
      showHiddenRows
    )

    let _advancedList = result.advancedList
    let _clonedAdvancedList = result.clonedAdvancedList
    let _showHiddenRows = result.showHiddenRows

    this.setState({
      advancedList: _advancedList,
      clonedAdvancedList: _clonedAdvancedList,
      showHiddenRows: _showHiddenRows
    }, () => {
      this.companyDetailModalSettings()
    });

  };

  updateBussinessUnit = async () => {
    let {
      busList,
      address,
      address2,
      advancedList,
      city,
      companyName,
      country,
      postcode,
      shippingAddress,
      shippingAddress2,
      shippingCity,
      shippingCountry,
      shippingPostcode,
      shippingState,
      state,
      taxID,
      recordID,
      clonedAdvancedList,
      actionCheck
    } = this.state;
    let data = {
      businessUnit: {
        recordID,
        companyName,
        taxID,
        address,
        address2,
        advancedList: clonedAdvancedList,
        city,
        country,
        postcode,
        shippingAddress,
        shippingAddress2,
        shippingCity,
        shippingCountry,
        shippingPostcode,
        shippingState,
        state,

      }
    }
    this.setState({
      isLoading: true
    })
    await this.props.updateBussinessUnit(data);
    if (this.props.setup.updateBusinessUnitSuccess) {
      if (actionCheck === "Update") {
        let found = busList.findIndex(d => d.recordID === recordID)
        if (found != -1) {
          let table = window.$("#businessunits").DataTable()

          busList[found] = data.businessUnit

          this.setState({
            busList: [...busList],
          }, () => {
            table
              .row(found)
              .invalidate('dom')
              .draw(false);
          })
        }
        this.closeModal('openCompanyDetailModal')
      }
      else {
        this.closeModal('openCompanyDetailModal')
        window.location.reload();

      }
      if (this.props.setup.updateBusinessUnitError) {
        handleAPIErr(this.props.setup.updateBusinessUnitError, this.props);
      }

      this.props.clearSetupStates();
    }
    this.clearStates();
    this.setState({ isLoading: false })

  }
  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="user_setup_main">
          <header>
            <TopNav />
            <div className="user_setup_heading">
              <div className="header_menu">
                <a href="/dashboard">
                  <img
                    src="images/dash-logo.png"
                    className="img-fluid"
                    alt="logo"
                  />
                </a>
                <Link
                  className="setup_menu"
                  to="#"
                  data-target="#top_nav_toggle1"
                >
                  <img src="images/top-menu.png" className="" alt="top-menu" />
                </Link>
              </div>
              <h2>Business Units</h2>
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
                  learn how to use business units Read our{" "}
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
                  <button
                    onClick={this.insertBusinessUnit}
                    className="btn user_setup_rbtns"
                    type="button"
                  >
                    <span className="round_plus">
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className="btn user_setup_rbtns"
                    type="button"
                    onClick={this.deleteBussinessUnit}
                  >
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
                id="businessunits"
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
                      <span className="user_setup_hed">business name</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">address</span>
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
                  {this.state.busList.length > 0
                    ? this.state.busList.map((obj, i) => {
                      return (
                        <tr
                          key={obj.recordID}
                          onClick={(event) =>
                            this.getBusinessUnit(event, obj)
                          }
                          className="cursorPointer"
                        >
                          <td>
                            <div className="custom-radio">
                              <label
                                className="check_main remember_check"
                                htmlFor={`listCheck${i}`}
                              >
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`listCheck${i}`}
                                  name={"buListCheck"}
                                  checked={obj.recordID === this.state.recordID}
                                  onChange={(event) =>
                                    this.handleCheckBox(event, obj)
                                  }
                                />
                                <span className="click_checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td>{obj.companyName}</td>
                          <td>{obj.address}</td>
                          <td></td>
                        </tr>
                      );
                    })
                    : ""}
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
        <CompanyDetail
          openCompanyDetailModal={this.state.openCompanyDetailModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          handleChangeField={this.handleChangeField}
          handleCheckBox={this.handleCheckBox}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}
          updateBussinessUnit={this.updateBussinessUnit}
          state={this.state}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({ setup: state.setup });
export default connect(mapStateToProps, {
  getBusinessUnitList: SetupAction.getBusinessUnitList,
  getBusinessUnit: SetupAction.getBusinessUnit,
  deleteBussinessUnit: SetupAction.deleteBussinessunit,
  insertBusinessUnit: SetupAction.insertBusinessUnit,
  updateBussinessUnit: SetupAction.updateBussinessUnit,
  clearSetupStates: SetupAction.clearSetupStates,
})(BusinessUnits);
