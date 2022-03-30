import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import store from "../../../Store/index";
import './Departments.css'
import { toast } from 'react-toastify'
import $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown'
import TopNav from '../../Common/TopNav/TopNav'
import Filter from '../Filter/Filter'
import Settings from '../../Modals/SetupModals/Settings/Settings'
import DepartmentsModal from '../../Modals/SetupModals/Departments/Departments';

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
  handleHideUnhideRows
} from '../../../Utils/Helpers'
import {
  getDepartments,
  getDepartment,
  primeDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getChartSorts,
  getChartCodes,
  getFlags,
  clearChartStates
} from "../../../Actions/ChartActions/ChartActions";

import {
  getDefaultValues,
  clearUserStates,
} from "../../../Actions/UserActions/UserActions";

const uuidv1 = require("uuid/v1");

class Departments extends Component {
  constructor() {
    super()
    this.state = {
      departments: [], //departments list
      columns: [],
      recordID: '', //department ID
      name: "",
      chartSort: "",
      chartCode: "",
      flags: [],//restructured flags according to business logic
      clonedFlags: [],//main flags
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditDeptCheck: '', //to check either department is going to add or update
      chartCodesList: [],
      showSuggestion: false, //chart code suggestion box
      clonedChartCodesList: [], //copy of chart codes list
      trackingCodes: '', //contains details of selected Tracking Codes
      formErrors: {
        name: ''
      },
      openSettingsModal: false,
      openDepartmentsModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,
    }
  }
  componentDidMount() {

    //show/hide filter card jquery
    filterBox('departments')

    let promises = [this.getDepartments(), this.getChartCodes()]

    //to show tracking fields flags on header
    if (!this.props.user.getDefaultValues) {
      let defVals = localStorage.getItem("getDefaultValues") || "";
      defVals = defVals ? JSON.parse(defVals) : "";
      if (defVals && defVals.flags && defVals.flags.length > 0) {
        //if localstorage contains the default values then update the Redux State no need to call API
        store.dispatch({
          type: "GET_DEFAULT_VALUES_SUCCESS",
          payload: defVals,
        });
      } else {
        promises.push(this.props.getDefaultValues());
      }
    }

    if (!this.props.chart.getFlags) {
      promises.push(this.props.getFlags());
    }
    Promise.all(promises)
  }

  componentWillMount() {
    $(function () {
      'use strict'
        ; (function () {
          $('.setup_menu').on('click', function () {
            let id = $(this).attr('data-target')
            if (id === '#top_nav_toggle1') {
              $(`${id}`).toggleClass('show')
            }
          })

          $('.dash_menu_toggle.top--nav').on('click', function () {
            $('.setup_menu').click()
          })
        })()
    })
  }
  openModal = name => {
    this.setState({ [name]: true }, () => {
      if (name === 'openDepartmentsModal') {
        this.depModalTableSetting()
      } else if (name === "openChartSortModal") {
        this.getChartSorts();
      }
    })
  }
  closeModal = name => {
    this.setState({ [name]: false })
    if (name === 'openDepartmentsModal') {
      this.clearStates()
    }
  }
  clearStates = () => {
    this.setState({
      recordID: '', //department ID
      name: "",
      chartSort: "",
      chartCode: "",
      flags: [],//restructured flags according to business logic
      clonedFlags: [],//main flags
      advancedList: [],
      clonedAdvancedList: [],
      showSuggestion: false, //chart code suggestion box
      trackingCodes: '', //contains details of selected Tracking Codes
      pageLength: 10,
      openSettingsModal: false,
      openDepartmentsModal: false,
      openChartSortModal: false,
      openChartCodeModal: false,
      openTrackingCodeModal: false,

      addEditDeptCheck: '', //to check either department is going to add or update
      formErrors: {
        name: ''
      }
    })
  }
  //department popup table setting
  depModalTableSetting = () => {
    window.$("#departments-modal").DataTable({
      dom: "Rlfrtip",
      // stateSave: true,
      // stateSaveCallback: function (settings, data) {
      //   localStorage.setItem('DataTables_department-modal', JSON.stringify(data))
      // },
      // stateLoadCallback: function (settings) {
      //   return JSON.parse(localStorage.getItem('DataTables_department-modal'))
      // },
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
  //main department list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    let flagsPrompts = this.props.user.getDefaultValues && this.props.user.getDefaultValues.flags || []

    //adding the column names
    aoColumns[0] = { sName: 'checkbox' }
    aoColumns[1] = { sName: 'Department' }
    aoColumns[2] = { sName: 'Chart Sort' }
    aoColumns[3] = { sName: 'Chart Code' }
    flagsPrompts.map(f => aoColumns.push({ sName: f.type }))
    aoColumns[aoColumns.length] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'departments')
    this.setState({ ...result })
  }

  //get departments
  getDepartments = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.getDepartments();
    //success case of get departments
    if (this.props.chart.getDepartmentsSuccess) {
      // toast.success(this.props.chart.getDepartmentsSuccess);
      let getDepartments =
        (JSON.parse(JSON.stringify(this.props.chart.getDepartments))) ||
        "";
      let departments = (getDepartments) || [];

      let columns = []
      let flagsPrompts = this.props.user.getDefaultValues && this.props.user.getDefaultValues.flags || []

      //adding the column names
      columns[0] = { name: 'Department', hide: false }
      columns[1] = { name: 'Chart Sort', hide: false }
      columns[2] = { name: 'Chart Code', hide: false }
      flagsPrompts.map(f => columns.push({ name: f.type, hide: false }))


      //sorting flags according to sequence to show in table 
      departments.map((dep, ind) => {
        let flags = dep.flags && dep.flags.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1) || []
        dep.flags = flags
        return dep;
      })
      this.setState({
        departments,
        columns
      }, () => this.tableSetting())

    }
    //error case of get departments
    if (this.props.chart.getDepartmentsError) {
      handleAPIErr(this.props.chart.getDepartmentsError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });

  }
  //get department
  getDepartment = async (e, dep) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }

    this.setState({
      isLoading: true
    })
    await this.props.getDepartment(dep.recordID)

    //success case of get department
    if (this.props.chart.getDepartmentSuccess) {
      // toast.success(this.props.chart.getDepartmentSuccess);

      let getDepartment =
        (JSON.parse(JSON.stringify(this.props.chart.getDepartment))) ||
        "";

      let recordID = dep.recordID || '';
      let name = getDepartment.name || '';
      let chartSort = getDepartment.chartSort || '';
      let chartCode = getDepartment.chartCode || '';
      let flags = getDepartment.flags || [];
      let advancedList = getDepartment.advancedList || []

      let _flgs = [];
      let clonedFlags = []
      flags.map((f, i) => {
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

      //get advanced list data from the local storage to hide/unhide rows for all departments
      let depAdvancedList = JSON.parse(
        localStorage.getItem("depAdvancedList") || "[]"
      );
      if (depAdvancedList && depAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          depAdvancedList.map((loc, i) => {
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
        name,
        chartSort,
        chartCode,
        flags: _flgs,
        clonedFlags,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditDeptCheck: 'update'
      }, () => {
        this.openModal("openDepartmentsModal")
      })
    }
    //error case of get department
    if (this.props.chart.getDepartmentError) {
      handleAPIErr(this.props.chart.getDepartmentError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //prime department
  primeDepartment = async (dep) => {
    this.setState({
      isLoading: true
    })
    await this.props.primeDepartment()

    //success case of prime department
    if (this.props.chart.primeDepartmentSuccess) {
      // toast.success(this.props.chart.primeDepartmentSuccess);

      let primeDepartment =
        (JSON.parse(JSON.stringify(this.props.chart.primeDepartment))) ||
        "";

      let name = primeDepartment.name || '';
      let chartSort = primeDepartment.chartSort || '';
      let chartCode = primeDepartment.chartCode || '';
      let flags = primeDepartment.flags || [];
      let advancedList = primeDepartment.advancedList || []

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
      let depAdvancedList = JSON.parse(
        localStorage.getItem("depAdvancedList") || "[]"
      );
      if (depAdvancedList && depAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          depAdvancedList.map((loc, i) => {
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

      let _flgs = [];
      let clonedFlags = []
      flags.map((f, i) => {
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

      this.setState({
        name,
        chartSort,
        chartCode,
        flags: _flgs,
        clonedFlags,
        advancedList,
        clonedAdvancedList: advancedList,
        addEditDeptCheck: 'add'
      }, () => {
        this.openModal("openDepartmentsModal")
      })
    }
    //error case of prime department
    if (this.props.chart.primeDepartmentError) {
      handleAPIErr(this.props.chart.primeDepartmentError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //add department
  addDepartment = async (dep) => {

    let {
      name,
      chartSort,
      chartCode,
      clonedFlags,
      advancedList,
      formErrors
    } = this.state;
    let data = {
      department: {
        name,
        chartSort,
        chartCode,
        flags: clonedFlags,
        advancedList,
      }
    }

    formErrors = handleWholeValidation({ name }, formErrors)

    if (!formErrors.name) {
      this.setState({
        isLoading: true
      })
      await this.props.addDepartment(data)

      //success case of add department
      if (this.props.chart.addDepartmentSuccess) {
        // toast.success(this.props.chart.addDepartmentSuccess);
        window.location.reload()

        // this.closeModal('openDepartmentsModal')
      }
      //error case of add department
      if (this.props.chart.addDepartmentError) {
        handleAPIErr(this.props.chart.addDepartmentError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //update department
  updateDepartment = async (dep) => {
    let {
      recordID,
      name,
      chartSort,
      chartCode,
      clonedFlags,
      advancedList,
      clonedAdvancedList,
      formErrors,
      departments
    } = this.state;
    let data = {
      department: {
        recordID,
        name,
        chartSort,
        chartCode,
        flags: clonedFlags,
        advancedList: clonedAdvancedList,
      }
    }

    formErrors = handleWholeValidation({ name }, formErrors)
    if (!formErrors.name) {
      this.setState({
        isLoading: true
      })
      await this.props.updateDepartment(data)

      //success case of update department
      if (this.props.chart.updateDepartmentSuccess) {
        // toast.success(this.props.chart.updateDepartmentSuccess);

        //also update the table
        let found = departments.findIndex(d => d.recordID === recordID)
        if (found != -1) {
          let table = window.$("#departments").DataTable()

          departments[found] = data.department

          this.setState({
            departments: [...departments],
          }, () => {
            table
              .row(found)
              .invalidate('dom')
              .draw(false);
            this.closeModal('openDepartmentsModal')
          })
        }
      }
      //error case of update department
      if (this.props.chart.updateDepartmentError) {
        handleAPIErr(this.props.chart.updateDepartmentError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //check whether add or update department 
  addEditDepartment = () => {
    let { addEditDeptCheck } = this.state;

    if (addEditDeptCheck === 'add') {
      //add department case
      this.addDepartment()
    } else {
      //update department case
      this.updateDepartment()
    }
  }
  //delete department
  deleteDepartment = async () => {

    let { recordID, departments } = this.state;
    this.setState({
      isLoading: true
    })

    if (recordID) {
      await this.props.deleteDepartment(recordID)
    } else {
      toast.error("Record ID is Missing!")
    }

    //success case of delete department
    if (this.props.chart.deleteDepartmentSuccess) {
      // toast.success(this.props.chart.deleteDepartmentSuccess);

      let table = window.$("#departments").DataTable()

      let index = departments.findIndex(d => d.recordID === recordID)

      let filtersList = departments.filter(u => u.recordID != recordID)
      departments = filtersList
      this.setState({
        departments,
        recordID: ''
      }, () => {
        table.row(index).remove().draw(false); //also update table
      })
    }

    //error case of delete department
    if (this.props.chart.deleteDepartmentError) {
      handleAPIErr(this.props.chart.deleteDepartmentError, this.props);
    }
    this.props.clearChartStates();
    this.setState({
      isLoading: false
    })
  }
  //handle department list check box
  handleDeptListCheckbox = (e, dep) => {
    if (e.target.checked) {
      this.setState({ recordID: dep.recordID })
    } else {
      this.setState({ recordID: '' })
    }
  }
  handleChangeField = (e) => {
    const { name, value } = e.target;
    let { formErrors, showSuggestion } = this.state
    formErrors = handleValidation(name, value, formErrors)
    this.setState({ [name]: value, formErrors })

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
    handleSaveSettings(columns, 'departments', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'departments')
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
    let table = window.$("#departments-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.depModalTableSetting()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.depModalTableSetting()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#departments-modal",
      "depAdvancedList",
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
      this.depModalTableSetting()
    });

  };
  //get chart sorts
  getChartSorts = async () => {
    if (!this.props.chart.getChartSorts) {
      this.setState({ isLoading: true });

      await this.props.getChartSorts();

      //success case of Get Chart Sorts
      if (this.props.chart.getChartSortsSuccess) {
        // toast.success(this.props.chart.getChartSortsSuccess);
      }
      //error case of Get Chart Sorts
      if (this.props.chart.getChartSortsError) {
        handleAPIErr(this.props.chart.getChartSortsError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false });
    }
  };
  //get new chart sort value through chart sort modal
  getUpdatedChartSort = (chartSort) => {
    // if (chartSort) {
    this.setState({ chartSort });
    // }
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
  //get new chart code value through chart code modal
  getUpdatedChartCode = (chartCode) => {
    this.setState({ chartCode });
  };
  //handle auto-completion and typing into the Chart Code
  handleChangeChartCode = async (e) => {
    let value = e.target.value;

    let clonedChartCodesList = [...this.state.chartCodesList]

    if (!value) {
      clonedChartCodesList = []
    } else {
      let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {

        return (c.code.toUpperCase().includes(value.toUpperCase()) ||
          c.description.toUpperCase().includes(value.toUpperCase())) &&
          c.sort.toUpperCase() === this.state.chartSort.toUpperCase()
          ;
      });
      clonedChartCodesList = chartCodesListFilterdData
    }

    this.setState({ chartCode: value, showSuggestion: true, clonedChartCodesList });

  };
  //hide chart code suggestion box
  onBlurChartCode = () => {
    setTimeout(() => {
      this.setState({ showSuggestion: false })
    }, 200);
  }
  //when select code from suggestions -> auto-completion
  changeChartCode = (obj) => {
    let chartCode = obj.code || "";
    this.setState({ chartCode });
  };
  //Tracking Code
  handleTrackingCode = async (data) => {
    //data ->  { lable: 'tax', value: 01 }, { lable: 'set', value: 02 } etc
    let flags = this.props.chart.getFlags; //object contains multiple flags {  set: [], insurance: [], tax: [] } => get flags api response
    let flagsObj = { data };
    for (let f of Object.keys(flags)) {
      if (data.label.toLowerCase() === f.toLowerCase()) {
        flagsObj.flagArr = flags[f];
      }
    }
    //flagArr contains all flags regarding to selected tracking code
    this.setState({ trackingCodes: flagsObj }, () => this.openModal("openTrackingCodeModal"));

  };
  //getting new tracking code
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

      this.setState({ flags, clonedFlags });
    }
  };
  //handle change flags (edit-in-place)
  handleChangeFlags = async (event, index, line) => {
    const { value, name, defaultValue } = event.target;

    if (value === defaultValue) return;
    let { departments } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value;
      }
      return f;
    });


    let dep = departments[index];

    dep['flags'] = flags;

    let table = window.$("#departments").DataTable()

    this.setState({
      departments,
    }, () => {
      table
        .row(index)
        .invalidate('dom') //update datatable to re-read the information from the data source for the row (be it from the DOM or objects / arrays - whatever the original data source was).
        .draw();
    })


    let {
      recordID,
      chartSort,
      chartCode,
      flags: clonedFlags,
      advancedList
    } = dep;
    let data = {
      department: {
        recordID,
        name: dep.name,
        chartSort,
        chartCode,
        flags: clonedFlags,
        advancedList,
      }

    }

    this.setState({
      isLoading: true
    })
    await this.props.updateDepartment(data)

    //success case of update department
    if (this.props.chart.updateDepartmentSuccess) {
      toast.success(this.props.chart.updateDepartmentSuccess);
    }
    //error case of update department
    if (this.props.chart.updateDepartmentError) {
      handleAPIErr(this.props.chart.updateDepartmentError, this.props);
    }
    this.props.clearChartStates();

    this.setState({
      isLoading: false
    })

  };
  render() {

    let flagsPrompts = this.props.user.getDefaultValues && this.props.user.getDefaultValues.flags || []
    return (
      <>
        {this.state.isLoading ? <div className='se-pre-con'></div> : ''}

        <div className='user_setup_main'>
          <header>
            <TopNav />

            <div className='user_setup_heading'>
              <div className='header_menu'>
                <a href='/dashboard'>
                  <img
                    src='images/dash-logo.png'
                    className='img-fluid'
                    alt='logo'
                  />
                </a>
                <Link
                  className='setup_menu'
                  to='#'
                  data-target='#top_nav_toggle1'
                >
                  <img src='images/top-menu.png' className='' alt='top-menu' />
                </Link>
              </div>
              <h2>Departments</h2>
              <span>
                <img
                  src='./images/user-setup/lock.png'
                  alt='lock'
                  className='img-fluid'
                />
              </span>
            </div>
            <div className='user_setup_headerbox'>
              <div className='user_setup_play_div'>
                <ul>
                  <li>
                    <p className='user_setup_play_video'>Video</p>
                  </li>
                  <li>
                    <p className='user_setup_play_tuturial'>Tutorials</p>
                  </li>
                </ul>
                <span className='user_setup_play_icon'>
                  <img
                    src='./images/user-setup/play.png'
                    alt='play'
                    className='img-fluid'
                  />
                </span>
              </div>
              <div className='user_setup_header_rightbox'>
                <p>
                  In our{' '}
                  <span>
                    <a href='#'>Video</a>
                  </span>{' '}
                  learn how to use departments Read our{' '}
                  <span>
                    <a href='#'>help article</a>
                  </span>{' '}
                  to learn More
                </p>
              </div>
              <span>
                <img
                  className='close_top_sec'
                  src='images/user-setup/cross.png'
                  alt='cross'
                ></img>
              </span>
            </div>
          </header>
          <div className='col-sm-12 table_white_box'>
            {/* Filter */}
            <Filter />
            {/* End Filter */}
            <div className='user_setup_plus_Icons'>
              <ul>
                <li>
                  <button
                    onClick={this.primeDepartment}
                    className='btn user_setup_rbtns'
                    type='button'
                  >
                    <span className='round_plus'>
                      <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteDepartment} className='btn user_setup_rbtns' type='button'>
                    <span className='round_file'>
                      {' '}
                      <img
                        src='./images/user-setup/delete.png'
                        alt='filter'
                      ></img>
                    </span>
                  </button>
                </li>
                <li>
                  <div>
                    <Dropdown
                      alignRight='false'
                      drop='down'
                      className='analysis-card-dropdwn setting_popup_dots'
                    >
                      <Dropdown.Toggle variant='sucess' id='dropdown-basic'>
                        <span className='dots_img'>
                          <img
                            src='./images/user-setup/dots.png'
                            alt='filter'
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
              <table id='departments' className=' user_setup_table' width='100%'>
                <thead>
                  <tr>
                    <th>
                      <div className='custom-radio'>
                        <label
                          className='check_main remember_check'
                          htmlFor='customRadio1109'
                        >
                          <input
                            type='checkbox'
                            className='custom-control-input'
                            id='customRadio1109'
                            name='example1'
                          />
                          <span className='click_checkmark global_checkmark'></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Department</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Chart Sort</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Chart Code</span>
                    </th>

                    {flagsPrompts.length > 0 && flagsPrompts.map(
                      (p, i) => {
                        return (
                          <th
                            key={i}
                          >
                            <span className='user_setup_hed'>{p.prompt}</span>
                          </th>
                        );
                      }
                    )}
                    <th className='text-right'>
                      <span className="user_setup_hed2" onClick={() => this.openModal("openSettingsModal")}>
                        {' '}
                        <img
                          src='./images/user-setup/bars.png'
                          alt='bars'
                        ></img>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.departments.map((d, i) => {
                      return <tr key={d.recordID} onClick={(e) => this.getDepartment(e, d)} className="cursorPointer">
                        <td>
                          <div className="custom-radio">
                            <label className="check_main remember_check" htmlFor={`listCheck${i}`}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${i}`}
                                name={'userListCheck'}
                                checked={d.recordID === this.state.recordID}
                                onChange={(e) => this.handleDeptListCheckbox(e, d)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{d.name}</td>
                        <td>
                          {d.chartSort}
                          {/* <input
                            type="text"
                            name="chartSort"
                            defaultValue={d.chartSort}
                            onBlur={(e) => this.handleChangeInput(e, i)
                            }
                          /> */}

                        </td>
                        <td>
                          {d.chartCode}
                          {/* <input
                            type="text"
                            name="chartCode"
                            defaultValue={d.chartCode}
                            onBlur={(e) => this.handleChangeInput(e, i)
                            }
                          /> */}

                        </td>

                        {flagsPrompts.length > 0 && flagsPrompts.map(
                          (p, ind) => {
                            return (
                              <td
                                // key={i}
                                data-sort={d.flags[ind].value
                                }
                                data-search={d.flags[ind].value
                                }
                              >
                                <input
                                  type="text"
                                  style={{ border: '0px' }}
                                  name={p.type}
                                  maxLength={p.length}
                                  defaultValue={
                                    d.flags[ind].value //this is because flags are already sorted according to sequence
                                  }
                                  onBlur={(e) => this.handleChangeFlags(e, i, d)
                                  }
                                />
                              </td>
                            );
                          }
                        )}

                        <td
                        // className="u-setup-td-edit cursorPointer"
                        >
                        </td>
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
        <DepartmentsModal
          openModal={this.openModal}
          closeModal={this.closeModal}
          addEditDepartment={this.addEditDepartment}
          state={this.state}
          handleChangeField={this.handleChangeField}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}
          getUpdatedChartSort={this.getUpdatedChartSort}
          getChartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          getUpdatedChartCode={this.getUpdatedChartCode}
          handleChangeChartCode={this.handleChangeChartCode}
          onBlurChartCode={this.onBlurChartCode}
          changeChartCode={this.changeChartCode}
          handleTrackingCode={this.handleTrackingCode}
          getUpdatedTrackingCode={this.getUpdatedTrackingCode}
          props={this.props}

        />
      </>
    )
  }
}


const mapStateToProps = (state) => ({
  user: state.user,
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getDepartments,
  getDepartment,
  primeDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getChartSorts,
  getChartCodes,
  getFlags,
  getDefaultValues,
  clearUserStates,
  clearChartStates,
})(Departments);

