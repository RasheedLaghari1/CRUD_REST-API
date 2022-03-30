import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./Currencies.css";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";
import countryList from "country-list";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import CurrenciesModal from "../../Modals/SetupModals/Currencies/Currencies";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from "../Filter/Filter";

import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows,
} from "../../../Utils/Helpers";
import * as Validation from "../../../Utils/Validation";

import * as ChartActions from "../../../Actions/ChartActions/ChartActions";

let cc = require("currency-codes");
const uuidv1 = require("uuid/v1");

class Currencies extends Component {
  constructor() {
    super();
    this.state = {
      currencies: [], //currency list
      columns: [
        { name: "Currency", hide: false },
        { name: "Description", hide: false },
        { name: "Rate", hide: false }, //current rate
        { name: "Rate Date", hide: false },
      ],
      code: "",
      previousCode: "", //will be used when updating the currency
      description: "",
      currency: "",
      countryCode: "",
      budgetRate: "",
      currentRate: "",
      rateDate: "",
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditCurrCheck: "", //to check either Currency is going to add or update
      openSettingsModal: false,
      openCurrencyModal: false,
      formErrors: {
        code: "",
        description: "",
        budgetRate: "",
        currentRate: "",
      },
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox("currencies");

    this.getCurrencies();
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
  openModal = (name) => {
    this.setState({ [name]: true }, () => {
      if (name === "openCurrencyModal") {
        this.currModalTableSetting();
      }
    });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
    if (name === "openCurrencyModal") {
      this.clearStates();
    }
  };
  clearStates = () => {
    this.setState({
      columns: [
        { name: "Currency", hide: false },
        { name: "Description", hide: false },
        { name: "Rate", hide: false },
        { name: "Rate Date", hide: false },
      ],
      code: "",
      previousCode: "", //will be used when updating the currency
      description: "",
      currency: "",
      countryCode: "",
      budgetRate: "",
      currentRate: "",
      rateDate: "",
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditCurrCheck: "", //to check either Currency is going to add or update
      openSettingsModal: false,
      openCurrencyModal: false,
      formErrors: {
        code: "",
        description: "",
        budgetRate: "",
        currentRate: "",
      },
    });
  };
  //currency popup table setting
  currModalTableSetting = () => {
    window.$("#currency-modal").DataTable({
      dom: "Rlfrtip",
      language: {
        searchPlaceholder: "Search",
      },
      searching: false,
      paging: false,
      info: false,
      columnDefs: [
        {
          targets: -1,
          orderable: false,
        },
      ],
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  };
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];

    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    aoColumns[1] = { sName: "Currency" };
    aoColumns[2] = { sName: "Description" };
    aoColumns[3] = { sName: "Rate" };
    aoColumns[4] = { sName: "Rate Date" };
    aoColumns[5] = { sName: "menus" };
    let result = tableSetting(columns, aoColumns, "currencies");
    this.setState({ ...result });
  };

  //get currencies
  getCurrencies = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getCurrencies();
    //success case of get currencies
    if (this.props.chart.getCurrenciesSuccess) {
      // toast.success(this.props.chart.getCurrenciesSuccess);
      let getCurrencies =
        JSON.parse(JSON.stringify(this.props.chart.getCurrencies)) || [];

      this.setState(
        {
          currencies: getCurrencies,
        },
        () => {
          this.tableSetting();
        }
      );
    }
    //error case of get currencies
    if (this.props.chart.getCurrenciesError) {
      handleAPIErr(this.props.chart.getCurrenciesError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  //get currency
  getCurrency = async (e, cur) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    await this.props.getCurrency(cur.code);

    //success case of get currency
    if (this.props.chart.getCurrencySuccess) {
      toast.success(this.props.chart.getCurrencySuccess);

      let getCurrency =
        JSON.parse(JSON.stringify(this.props.chart.getCurrency)) || "";
      let code = getCurrency.code || "";
      let previousCode = getCurrency.code || "";
      let description = getCurrency.description || "";
      let currency = getCurrency.currency || "";
      let countryCode = getCurrency.countryCode || "";
      let budgetRate = getCurrency.budgetRate || "";
      let currentRate = getCurrency.currentRate || "";
      let rateDate = getCurrency.rateDate || "";
      let advancedList = getCurrency.advancedList || [];

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

      //get advanced list data from the local storage to hide/unhide rows for all currencies
      let curAdvancedList = JSON.parse(
        localStorage.getItem("curAdvancedList") || "[]"
      );
      if (curAdvancedList && curAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          curAdvancedList.map((loc, i) => {
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
          code,
          previousCode, //will be used when update currency
          description,
          currency,
          countryCode,
          budgetRate,
          currentRate,
          rateDate,
          advancedList: filtrdList,
          clonedAdvancedList: advancedList,
          addEditCurrCheck: "update",
        },
        () => {
          this.openModal("openCurrencyModal");
        }
      );
    }
    //error case of get currency
    if (this.props.chart.getCurrencyError) {
      handleAPIErr(this.props.chart.getCurrencyError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  //prime currency
  primeCurrency = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.primeCurrency();

    //success case of prime currency
    if (this.props.chart.primeCurrencySuccess) {
      toast.success(this.props.chart.primeCurrencySuccess);

      let primeCurrency = this.props.chart.primeCurrency || "";

      let code = primeCurrency.code || "";
      let description = primeCurrency.description || "";
      let currency = primeCurrency.currency || "";
      let countryCode = primeCurrency.countryCode || "";
      let budgetRate = primeCurrency.budgetRate || "";
      let currentRate = primeCurrency.currentRate || "";
      let rateDate = primeCurrency.rateDate || "";
      let advancedList = primeCurrency.advancedList || [];

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

      //get advanced list data from the local storage to show hidden rows for all departments
      let curAdvancedList = JSON.parse(
        localStorage.getItem("curAdvancedList") || "[]"
      );
      if (curAdvancedList && curAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          curAdvancedList.map((loc, i) => {
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
          code,
          description,
          currency,
          countryCode,
          budgetRate,
          currentRate,
          rateDate,
          addEditCurrCheck: "add",
          advancedList,
          clonedAdvancedList: advancedList,
        },
        () => {
          this.openModal("openCurrencyModal");
        }
      );
    }
    //error case of prime currency
    if (this.props.chart.primeCurrencyError) {
      handleAPIErr(this.props.chart.primeCurrencyError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  };
  //add currency
  addCurrency = async () => {
    let {
      code,
      description,
      currency,
      countryCode,
      budgetRate,
      currentRate,
      rateDate,
      formErrors,
      advancedList,
    } = this.state;

    currentRate = Number(currentRate) === 0 ? "" : currentRate;
    budgetRate = Number(budgetRate) === 0 ? "" : budgetRate;

    formErrors = Validation.handleWholeValidation(
      { code, description, budgetRate, currentRate },
      formErrors
    );
    if (
      !formErrors.code &&
      !formErrors.description &&
      !formErrors.budgetRate &&
      !formErrors.currentRate
    ) {
      this.setState({
        isLoading: true,
      });
      let obj = {
        currency: {
          code,
          description,
          currency,
          countryCode,
          budgetRate,
          currentRate,
          rateDate,
          advancedList,
        },
      };
      await this.props.addCurrency(obj);

      //success case of add currency
      if (this.props.chart.addCurrencySuccess) {
        toast.success(this.props.chart.addCurrencySuccess);
        window.location.reload();
      }
      //error case of add currency
      if (this.props.chart.addCurrencyError) {
        handleAPIErr(this.props.chart.addCurrencyError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false });
  };
  //update currency
  updateCurrency = async () => {
    let {
      code,
      previousCode,
      description,
      currency,
      countryCode,
      budgetRate,
      currentRate,
      rateDate,
      currencies,
      formErrors,
      clonedAdvancedList,
    } = this.state;
    currentRate = Number(currentRate) === 0 ? "" : currentRate;
    budgetRate = Number(budgetRate) === 0 ? "" : budgetRate;
    formErrors = Validation.handleWholeValidation(
      { code, description, budgetRate, currentRate },
      formErrors
    );
    if (
      !formErrors.code &&
      !formErrors.description &&
      !formErrors.budgetRate &&
      !formErrors.currentRate
    ) {
      this.setState({
        isLoading: true,
      });
      let obj = {
        currency: {
          code,
          previousCode,
          description,
          currency,
          countryCode,
          budgetRate,
          currentRate,
          rateDate,
          advancedList: clonedAdvancedList,
        },
      };
      await this.props.updateCurrency(obj);

      //success case of update currency
      if (this.props.chart.updateCurrencySuccess) {
        toast.success(this.props.chart.updateCurrencySuccess);

        //also update the table
        let found = currencies.findIndex((c) => c.code === code);
        if (found != -1) {
          let table = window.$("#currencies").DataTable();

          currencies[found] = obj.currency;

          this.setState(
            {
              currencies: [...currencies],
            },
            () => {
              table.row(found).invalidate("dom").draw(false);
              this.closeModal("openCurrencyModal");
            }
          );
        }
      }
      //error case of update currency
      if (this.props.chart.updateCurrencyError) {
        handleAPIErr(this.props.chart.updateCurrencyError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false });
  };
  //delete currency
  deleteCurrency = async () => {
    let { code, currencies } = this.state;

    if (code) {
      this.setState({
        isLoading: true,
      });

      await this.props.deleteCurrency(code);

      //success case of delete currency
      if (this.props.chart.deleteCurrencySuccess) {
        toast.success(this.props.chart.deleteCurrencySuccess);
        let table = window.$("#currencies").DataTable();

        let index = currencies.findIndex((c) => c.code === code);

        let filtersList = currencies.filter((c) => c.code !== code);
        currencies = filtersList;
        this.setState(
          {
            currencies,
            code: "",
          },
          () => {
            table.row(index).remove().draw(false); //also update table
          }
        );
      }
      //error case of delete currency
      if (this.props.chart.deleteCurrencyError) {
        handleAPIErr(this.props.chart.deleteCurrencyError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Code is Missing!");
    }
  };
  addEditCurrency = () => {
    let { addEditCurrCheck } = this.state;

    if (addEditCurrCheck === "add") {
      this.addCurrency();
    } else {
      //update currency
      this.updateCurrency();
    }
  };
  //Settings Popup
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
    handleSaveSettings(columns, "currencies", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "currencies");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  handleChangeField = (e, type) => {
    if (type === "date") {
      this.setState({
        rateDate: new Date(e).getTime(),
      });
    } else {
      const { name, value } = e.target;
      let { formErrors } = this.state;
      formErrors = Validation.handleValidation(name, value, formErrors);
      this.setState({ [name]: value, formErrors });
    }
  };

  handleCurrencyCheckbox = (e, code) => {
    if (e.target.checked) {
      this.setState({ code });
    } else {
      this.setState({ code: "" });
    }
  };
  //Advanced List Setting
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
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {
    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#currency-modal",
      "curAdvancedList",
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
        this.currModalTableSetting();
      }
    );
  };
  //show hidden rows
  handleShowHiddenRows = async () => {
    let table = window.$("#currency-modal").DataTable();
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
            this.currModalTableSetting();
          });
        } else {
          //hide again hidden rows
          let advancedList = this.state.advancedList;
          let list = advancedList.filter((l) => !l.hide);
          this.setState({ advancedList: list }, () => {
            this.currModalTableSetting();
          });
        }
      }
    );
  };
  render() {
    let { code, currencies } = this.state;
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

              <h2>currencies</h2>
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
                  learn how to use currencies Read our{" "}
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
                  <button className="btn user_setup_rbtns" type="button">
                    <span onClick={this.primeCurrency} className="round_plus">
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={this.deleteCurrency}
                    className="btn user_setup_rbtns"
                    type="button"
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
              <table id="currencies" className=" user_setup_table" width="100%">
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
                      <span className="user_setup_hed">currency</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">rate</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">rate date</span>
                    </th>
                    <th>
                      <span
                        className="user_setup_hed2"
                        onClick={() => this.openModal("openSettingsModal")}
                      >
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
                  {currencies.map((cur, i) => {
                    return (
                      <tr
                        key={cur.code}
                        onClick={(e) => this.getCurrency(e, cur)}
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
                                name={"currListCheck"}
                                checked={cur.code === code}
                                onChange={(e) =>
                                  this.handleCurrencyCheckbox(e, cur.code)
                                }
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td> {cur.code} </td>
                        <td> {cur.description} </td>
                        <td> {cur.rate} </td>
                        <td>
                          {moment(Number(cur.rateDate))
                            .format("DD MMM YYYY")
                            .toUpperCase()}
                        </td>
                        <td></td>
                      </tr>
                    );
                  })}
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
        <CurrenciesModal
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChangeField={this.handleChangeField}
          addEditCurrency={this.addEditCurrency}
          handleValueOptions={this.handleValueOptions}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleShowHiddenRows={this.handleShowHiddenRows}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getCurrencies: ChartActions.getCurrencies,
  getCurrency: ChartActions.getCurrency,
  primeCurrency: ChartActions.primeCurrency,
  addCurrency: ChartActions.addCurrency,
  updateCurrency: ChartActions.updateCurrency,
  deleteCurrency: ChartActions.deleteCurrency,
  clearChartStates: ChartActions.clearChartStates,
})(Currencies);
