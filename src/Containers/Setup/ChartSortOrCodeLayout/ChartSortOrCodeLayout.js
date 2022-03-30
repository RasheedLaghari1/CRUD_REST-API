import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./ChartSortOrCodeLayout.css";
import { toast } from "react-toastify";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import ChartLayout from "../../Modals/SetupModals/ChartLayout/ChartLayout";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from '../Filter/Filter'
import {
  handleValidation,
  handleWholeValidation
} from '../../../Utils/Validation'
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows,
} from '../../../Utils/Helpers'
import {
  getChartLayouts,
  primeChart,
  getChart,
  addChart,
  updateChart,
  deleteChart,
  clearChartStates
} from "../../../Actions/ChartActions/ChartActions";

const uuidv1 = require("uuid/v1");

class ChartSortOrCodeLayout extends Component {
  constructor() {
    super();
    this.state = {
      chartLayout: [], //chart layouts
      columns: [
        { name: 'Type', hide: false },
        { name: 'Category', hide: false },
        { name: 'Sequence', hide: false },
        { name: 'Length', hide: false },
        { name: 'Description', hide: false },
      ],
      recordID: "", //chart ID
      category: "",
      description: "",
      length: "",
      prompt: "",
      recordID: "",
      sequence: "",
      type: "",
      typeOptions: [],
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditChartCheck: '', //to check either chart is going to add or update
      openSettingsModal: false,
      openChartLayoutModal: false,
      formErrors: {
        type: "",
        category: "",
        description: "",
        length: "",
        prompt: "",
        sequence: "",
      }
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('chartsortorcodelayout')

    this.getChartLayouts()
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
      if (name === "openChartLayoutModal") {
        this.chartLayoutModalSettings()
      }
    });
  };
  closeModal = (name) => {
    this.setState({ [name]: false })
    if (name === 'openChartLayoutModal') {
      this.clearStates()
    }
  };
  clearStates = () => {
    this.setState({
      recordID: "", //chart ID
      category: "",
      description: "",
      length: "",
      prompt: "",
      recordID: "",
      sequence: "",
      type: "",
      typeOptions: [],
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditChartCheck: '', //to check either chart is going to add or update
      openSettingsModal: false,
      openChartLayoutModal: false,
      formErrors: {
        type: "",
        category: "",
        description: "",
        length: "",
        prompt: "",
        sequence: "",
      }
    })
  }

  //main chart setup list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: 'checkbox' }
    aoColumns[1] = { sName: 'Type' }
    aoColumns[2] = { sName: 'Category' }
    aoColumns[3] = { sName: 'Sequence' }
    aoColumns[4] = { sName: 'Length' }
    aoColumns[5] = { sName: 'Description' }
    aoColumns[6] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'chartsortorcodelayout')
    this.setState({ ...result })
  }
  chartLayoutModalSettings = () => {
    window.$("#chart-layout-modal").DataTable({
      dom: "Rlfrtip",
      language: {
        searchPlaceholder: "Search",
      },
      colReorder: false,
      searching: false,
      paging: false,
      info: false,
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  }
  //get chart layouts
  getChartLayouts = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.getChartLayouts();
    //success case of get chart layouts
    if (this.props.chart.getChartLayoutSuccess) {
      // toast.success(this.props.chart.getChartLayoutSuccess);
      let getChartLayout =
        (JSON.parse(JSON.stringify(this.props.chart.getChartLayout))) ||
        '';

      let chartLayout = getChartLayout.chartLayout || []

      this.setState({
        chartLayout
      }, () => this.tableSetting())

    }
    //error case of get chart layouts
    if (this.props.chart.getChartLayoutError) {
      handleAPIErr(this.props.chart.getChartLayoutError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //get chart
  getChart = async (e, chart) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }

    this.setState({
      isLoading: true
    })
    await this.props.getChart(chart.recordID)

    //success case of get chart
    if (this.props.chart.getChartSuccess) {
      // toast.success(this.props.chart.getChartSuccess);

      let getChart =
        (JSON.parse(JSON.stringify(this.props.chart.getChart))) ||
        "";

      let recordID = getChart.recordID || '';
      let category = getChart.category || '';
      let description = getChart.description || '';
      let length = getChart.length || '';
      let prompt = getChart.prompt || '';
      let sequence = getChart.sequence || '';
      let type = getChart.type || '';
      let typeOptions = getChart.typeOptions || [];
      let advancedList = getChart.advancedList || []

      type = { label: type || 'Select Type', value: type || '' }
      let _typeOptions = []
      typeOptions.map((t => {
        let optn = t.option.toUpperCase()
        _typeOptions.push({ label: optn, value: optn })
      }))

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

      //get advanced list data from the local storage to hide/unhide rows for all charts 
      let chartSetupAdvancedList = JSON.parse(
        localStorage.getItem("chartSetupAdvancedList") || "[]"
      );
      if (chartSetupAdvancedList && chartSetupAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          chartSetupAdvancedList.map((loc, i) => {
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

      this.setState({
        recordID,
        category,
        description,
        length,
        prompt,
        recordID,
        sequence,
        type,
        typeOptions: _typeOptions,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditChartCheck: 'update'
      }, () => {
        this.openModal("openChartLayoutModal")
      })
    }
    //error case of get chart
    if (this.props.chart.getChartError) {
      handleAPIErr(this.props.chart.getChartError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //prime chart
  primeChart = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.primeChart()

    //success case of prime chart
    if (this.props.chart.primeChartSuccess) {
      // toast.success(this.props.chart.primeChartSuccess);

      let primeChart =
        (JSON.parse(JSON.stringify(this.props.chart.primeChart))) ||
        "";

      let recordID = primeChart.recordID || '';
      let category = primeChart.category || '';
      let description = primeChart.description || '';
      let length = primeChart.length || '';
      let prompt = primeChart.prompt || '';
      let sequence = primeChart.sequence || '';
      let type = primeChart.type || '';
      let typeOptions = primeChart.typeOptions || [];
      let advancedList = primeChart.advancedList || []

      type = { label: type || 'Select Type', value: type || '' }
      let _typeOptions = []

      typeOptions.map((t => {
        let optn = t.option.toUpperCase()
        _typeOptions.push({ label: optn, value: optn })
      }))

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

      //get advanced list data from the local storage to show hidden rows for all charts
      let chartSetupAdvancedList = JSON.parse(
        localStorage.getItem("chartSetupAdvancedList") || "[]"
      );
      if (chartSetupAdvancedList && chartSetupAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          chartSetupAdvancedList.map((loc, i) => {
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
      this.setState({
        recordID,
        category,
        description,
        length,
        prompt,
        recordID,
        sequence,
        type,
        typeOptions: _typeOptions,
        advancedList,
        clonedAdvancedList: advancedList,
        addEditChartCheck: 'add'
      }, () => {
        this.openModal("openChartLayoutModal")
      })
    }
    //error case of prime chart
    if (this.props.chart.primeChartError) {
      handleAPIErr(this.props.chart.primeChartError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //add chart
  addChart = async () => {
    let {
      type,
      category,
      prompt,
      description,
      length,
      sequence,
      clonedAdvancedList,
      formErrors
    } = this.state;
    let data = {
      chart: {
        type: type.value,
        category,
        prompt,
        description,
        length,
        sequence,
        advancedList: clonedAdvancedList
      }
    }
    formErrors = handleWholeValidation({ type: type.value, category, prompt, description, length, sequence }, formErrors)
    if (!formErrors.type && !formErrors.category && !formErrors.prompt && !formErrors.description && !formErrors.length && !formErrors.sequence) {

      this.setState({
        isLoading: true
      })
      await this.props.addChart(data)

      //success case of add chart
      if (this.props.chart.addChartSuccess) {
        // toast.success(this.props.chart.addChartSuccess);
        window.location.reload()
      }
      //error case of add chart
      if (this.props.chart.addChartError) {
        handleAPIErr(this.props.chart.addChartError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //update chart
  updateChart = async () => {
    let {
      type,
      category,
      prompt,
      description,
      length,
      sequence,
      recordID,
      clonedAdvancedList,
      chartLayout,
      formErrors
    } = this.state;
    let data = {
      chart: {
        type: type.value,
        category,
        prompt,
        description,
        length,
        sequence,
        recordID,
        advancedList: clonedAdvancedList
      }
    }
    formErrors = handleWholeValidation({ type: type.value, category, prompt, description, length, sequence }, formErrors)
    if (!formErrors.type && !formErrors.category && !formErrors.prompt && !formErrors.description && !formErrors.length && !formErrors.sequence) {

      this.setState({
        isLoading: true
      })
      await this.props.updateChart(data)

      //success case of update chart
      if (this.props.chart.updateChartSuccess) {
        toast.success(this.props.chart.updateChartSuccess);

        //also update the table
        let found = chartLayout.findIndex(d => d.recordID === recordID)
        if (found != -1) {
          let table = window.$("#chartsortorcodelayout").DataTable()

          chartLayout[found] = data.chart

          this.setState({
            chartLayout: [...chartLayout],
          }, () => {
            table
              .row(found)
              .invalidate('dom')
              .draw(false);
            this.closeModal('openChartLayoutModal')
          })
        }
      }
      //error case of update chart
      if (this.props.chart.updateChartError) {
        handleAPIErr(this.props.chart.updateChartError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //check whether add or update chart 
  addEditChart = () => {
    let { addEditChartCheck } = this.state;

    if (addEditChartCheck === 'add') {
      //add chart case
      this.addChart()

    } else {
      //update chart case
      this.updateChart()
    }
  }
  //delete chart
  deleteChart = async () => {

    let { recordID, chartLayout } = this.state;
    this.setState({
      isLoading: true
    })

    if (recordID) {
      await this.props.deleteChart(recordID)
    } else {
      toast.error("Record ID is Missing!")
    }

    //success case of delete chart
    if (this.props.chart.deleteChartSuccess) {
      toast.success(this.props.chart.deleteChartSuccess);

      let table = window.$("#chartsortorcodelayout").DataTable()

      let index = chartLayout.findIndex(c => c.recordID === recordID)

      let filtersList = chartLayout.filter(c => c.recordID != recordID)
      chartLayout = filtersList
      this.setState({
        chartLayout,
        recordID: ''
      }, () => {
        table.row(index).remove().draw(false); //also update table
      })
    }

    //error case of delete chart
    if (this.props.chart.deleteChartError) {
      handleAPIErr(this.props.chart.deleteChartError, this.props);
    }
    this.props.clearChartStates();
    this.setState({
      isLoading: false
    })
  }
  //handle chart type
  handleChartType = (obj) => {
    let { formErrors } = this.state;

    formErrors = handleValidation('type', obj.value, formErrors)
    this.setState({ type: obj, formErrors })

  }
  handleChangeField = (e) => {
    const { name, value } = e.target;
    let { formErrors } = this.state
    formErrors = handleValidation(name, value, formErrors)
    this.setState({ [name]: value, formErrors })
  }
  //handle chart layout list checkbox
  handleCharttListCheckbox = (e, chart) => {
    if (e.target.checked) {
      this.setState({ recordID: chart.recordID })
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
    handleSaveSettings(columns, 'chartsortorcodelayout', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'chartsortorcodelayout')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  //Advanced List Setting
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };

  handleShowHiddenRows = async () => {
    let table = window.$("#chart-layout-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.chartLayoutModalSettings()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.chartLayoutModalSettings()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#chart-layout-modal",
      "chartSetupAdvancedList",
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
      this.chartLayoutModalSettings()
    });
  };

  render() {
    let { chartLayout } = this.state;
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
              {/* <h2>chart sortor/code layout</h2> */}
              <h2>CHART SETUP</h2>
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
                  learn how to use chart sort/code layouts Read our{" "}
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
                  <button onClick={this.primeChart} className="btn user_setup_rbtns" type="button">
                    <span
                      className="round_plus"
                    >
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteChart} className="btn user_setup_rbtns" type="button">
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
                id="chartsortorcodelayout"
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
                      <span className="user_setup_hed">Type</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Category</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Sequence</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Length</span>
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
                    chartLayout.map((chrt, ind) => {
                      return <tr key={chrt.recordID} onClick={(e) => this.getChart(e, chrt)} className="cursorPointer">

                        <td>
                          <div className="custom-radio">
                            <label className="check_main remember_check" htmlFor={`listCheck${ind}`}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${ind}`}
                                name={'chartLayoutList'}
                                checked={chrt.recordID === this.state.recordID}
                                onChange={(e) => this.handleCharttListCheckbox(e, chrt)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{chrt.type}</td>
                        <td>{chrt.category}</td>
                        <td>{chrt.sequence}</td>
                        <td>{chrt.length}</td>
                        <td>{chrt.description}</td>
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
        <ChartLayout
          openModal={this.openModal}
          closeModal={this.closeModal}
          state={this.state}
          handleChartType={this.handleChartType}
          handleChangeField={this.handleChangeField}
          addEditChart={this.addEditChart}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}

        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  chart: state.chart

});
export default connect(mapStateToProps, {
  getChartLayouts,
  primeChart,
  getChart,
  addChart,
  updateChart,
  deleteChart,
  clearChartStates
})(ChartSortOrCodeLayout);
