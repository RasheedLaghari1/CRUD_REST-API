import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './IndirectTaxCodes.css'
import store from "../../../Store/index";
import $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown'
import TopNav from '../../Common/TopNav/TopNav'
import { toast } from 'react-toastify'
import Filter from '../Filter/Filter'

import Settings from '../../Modals/SetupModals/Settings/Settings'
import IndirectTaxCodesModal from '../../Modals/SetupModals/IndirectTaxCodes/IndirectTaxCodes'

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
  getTaxCodes,
  getTaxFlag,
  primeTaxFlag,
  insertTaxFlag,
  updateTaxFlag,
  deleteTaxFlag,
  getChartCodes,
  getChartSorts,
  getFlags,
  clearChartStates
} from "../../../Actions/ChartActions/ChartActions";

const uuidv1 = require("uuid/v1");

class IndirectTaxCodes extends Component {
  constructor() {
    super()
    this.state = {
      code: '',
      description: '',
      rate: '',
      chartSort: '',
      chartCode: '',
      taxCodes: [],
      columns: [],
      detailOfTrackingCode: '', //contains details of selected Tracking Codes
      trackingCodes: [],//restructured tracking flags according to business logic
      clonedTrackingCodes: [],//main tracking flags
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditCodeCheck: '', //to check either tax code is going to add or update
      chartCodesList: [],
      showSuggestion: false, //chart code suggestion box
      clonedChartCodesList: [], //copy of chart codes list
      openSettingsModal: false,
      openIndirectTaxCodesModal: false,
      formErrors: {
        code: '',
        description: ''
      }
    }
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('indirect-tax-codes')

    let promises = [this.getTaxCodes(), this.getChartCodes()]

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
            var id = $(this).attr('data-target')
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
      if (name === 'openIndirectTaxCodesModal') {
        this.taxModalTableSetting()
      } else if (name === "openChartSortModal") {
        this.getChartSorts();
      }
    })
  }

  closeModal = name => {
    this.setState({ [name]: false })
    if (name === 'openIndirectTaxCodesModal') {
      this.clearStates()
    }
  }
  clearStates = () => {
    this.setState({
      code: '',
      description: '',
      rate: '',
      chartSort: '',
      chartCode: '',
      detailOfTrackingCode: '', //contains details of selected Tracking Codes
      trackingCodes: [],//restructured tracking flags according to business logic
      clonedTrackingCodes: [],//main tracking flags
      advancedList: [],
      clonedAdvancedList: [],
      pageLength: 10,
      addEditCodeCheck: '', //to check either tax code is going to add or update
      showSuggestion: false, //chart code suggestion box
      openSettingsModal: false,
      openIndirectTaxCodesModal: false,
      formErrors: {
        code: '',
        description: ''
      }
    })
  }
  //Tax Code popup table setting
  taxModalTableSetting = () => {
    window.$("#IndirectTaxCodes-modal").DataTable({
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
  //main Tax Code list table
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: 'checkbox' }
    aoColumns[1] = { sName: 'Code' }
    aoColumns[2] = { sName: 'Description' }
    aoColumns[3] = { sName: 'Tax Rates' }
    aoColumns[4] = { sName: 'Chart Sort' }
    aoColumns[5] = { sName: 'Chart Code' }
    aoColumns[6] = { sName: 'Tracking Code' }
    aoColumns[7] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'indirect-tax-codes')
    this.setState({ ...result })
  }
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
  //get tax codes
  getTaxCodes = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.getTaxCodes();
    //success case of get tax codes
    if (this.props.chart.getTaxCodesSuccess) {
      // toast.success(this.props.chart.getTaxCodesSuccess);
      let taxCodes =
        (JSON.parse(JSON.stringify(this.props.chart.getTaxCodes))) ||
        [];

      let columns = []

      //adding the column names
      columns[0] = { name: 'Code' }
      columns[1] = { name: 'Description' }
      columns[2] = { name: 'Tax Rates' }
      columns[3] = { name: 'Chart Sort' }
      columns[4] = { name: 'Chart Code' }
      columns[5] = { name: 'Tracking Code' }

      this.setState({
        taxCodes,
        columns
      }, () => {
        this.tableSetting()
      })

    }
    //error case of get tax codes
    if (this.props.chart.getTaxCodesError) {
      handleAPIErr(this.props.chart.getTaxCodesError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });

  }
  //get tax flags
  getTaxFlag = async (e, taxCode) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }

    this.setState({
      isLoading: true
    })
    await this.props.getTaxFlag(taxCode.code)

    //success case of get tax flags
    if (this.props.chart.getTaxFlagSuccess) {
      toast.success(this.props.chart.getTaxFlagSuccess);

      let getTaxFlag =
        (JSON.parse(JSON.stringify(this.props.chart.getTaxFlag))) ||
        "";

      let code = getTaxFlag.code || '';
      let description = getTaxFlag.description || '';
      let rate = getTaxFlag.rate || '0.00';
      let chartSort = getTaxFlag.chartSort || '';
      let chartCode = getTaxFlag.chartCode || '';
      let trackingCodes = getTaxFlag.trackingCodes || [];
      let advancedList = getTaxFlag.advancedList || []

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

      //get advanced list data from the local storage to show hidden rows for all tax codes
      let taxCodesAdvancedList = JSON.parse(
        localStorage.getItem("taxCodesAdvancedList") || "[]"
      );
      if (taxCodesAdvancedList && taxCodesAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          taxCodesAdvancedList.map((loc, i) => {
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
      let clonedTrackingCodes = []
      trackingCodes.map((f, i) => {
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
        clonedTrackingCodes.push({
          type: f.type.toLowerCase(),
          prompt: f.prompt,
          value: f.value ? f.value : "",
          sequence: f.sequence,
        });
      });

      this.setState({
        code,
        description,
        rate,
        chartSort,
        chartCode,
        trackingCodes: _flgs,
        clonedTrackingCodes,
        advancedList,
        clonedAdvancedList: advancedList,
        addEditCodeCheck: 'update',

      }, () => {
        this.openModal("openIndirectTaxCodesModal")
      })
    }
    //error case of get tax flags
    if (this.props.chart.getTaxFlagError) {
      handleAPIErr(this.props.chart.getTaxFlagError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //delete tax flag
  deleteTaxFlag = async () => {

    let { code, taxCodes } = this.state;
    this.setState({
      isLoading: true
    })

    if (code) {
      await this.props.deleteTaxFlag(code)
    } else {
      toast.error("Code is Missing!")
    }

    //success case of delete tax flag
    if (this.props.chart.deleteTaxFlagSuccess) {
      // toast.success(this.props.chart.deleteTaxFlagSuccess);

      let table = window.$("#indirect-tax-codes").DataTable()

      let index = taxCodes.findIndex(d => d.code === code)

      let filtersList = taxCodes.filter(u => u.code != code)
      taxCodes = filtersList
      this.setState({
        taxCodes,
        code: ''
      }, () => {
        table.row(index).remove().draw(false); //also update table
      })
    }

    //error case of delete tax flag
    if (this.props.chart.deleteTaxFlagError) {
      handleAPIErr(this.props.chart.deleteTaxFlagError, this.props);
    }
    this.props.clearChartStates();
    this.setState({
      isLoading: false
    })
  }
  //handle tax codes list checkBox
  handleCodeListCheckbox = (e, tc) => {
    if (e.target.checked) {
      this.setState({ code: tc.code })
    } else {
      this.setState({ code: '' })
    }
  }
  //prime  tax code 
  primeTaxFlag = async () => {
    this.setState({
      isLoading: true
    })
    await this.props.primeTaxFlag()

    //success case of prime tax flag
    if (this.props.chart.primeTaxFlagSuccess) {
      // toast.success(this.props.chart.primeTaxFlagSuccess);

      let primeTaxFlag =
        (JSON.parse(JSON.stringify(this.props.chart.primeTaxFlag))) ||
        "";

      let code = primeTaxFlag.code || '';
      let description = primeTaxFlag.description || '';
      let rate = primeTaxFlag.rate || '0.00';
      let chartSort = primeTaxFlag.chartSort || '';
      let chartCode = primeTaxFlag.chartCode || '';
      let trackingCodes = primeTaxFlag.trackingCodes || [];
      let advancedList = primeTaxFlag.advancedList || []

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

      //get advanced list data from the local storage to show hidden rows for all tax codes
      let taxCodesAdvancedList = JSON.parse(
        localStorage.getItem("taxCodesAdvancedList") || "[]"
      );
      if (taxCodesAdvancedList && taxCodesAdvancedList.length > 0) {
        advancedList.map((al, i) => {
          taxCodesAdvancedList.map((loc, i) => {
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
      let clonedTrackingCodes = []
      trackingCodes.map((f, i) => {
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
        clonedTrackingCodes.push({
          type: f.type.toLowerCase(),
          prompt: f.prompt,
          value: f.value ? f.value : "",
          sequence: f.sequence,
        });
      });

      this.setState({
        code,
        description,
        rate,
        chartSort,
        chartCode,
        trackingCodes: _flgs,
        clonedTrackingCodes,
        advancedList,
        clonedAdvancedList: advancedList,
        addEditCodeCheck: 'add',

      }, () => {
        this.openModal("openIndirectTaxCodesModal")
      })
    }
    //error case of prime tax flag
    if (this.props.chart.primeTaxFlagError) {
      handleAPIErr(this.props.chart.primeTaxFlagError, this.props);
    }
    this.props.clearChartStates();
    this.setState({ isLoading: false });
  }
  //update tax code 
  updateTaxFlag = async () => {
    let {
      code,
      description,
      rate,
      chartSort,
      chartCode,
      clonedTrackingCodes,
      clonedAdvancedList,
      formErrors,
      taxCodes
    } = this.state;
    let data = {
      taxFlag: {
        code,
        description,
        rate,
        chartSort,
        chartCode,
        trackingCodes: clonedTrackingCodes,
        advancedList: clonedAdvancedList,
      }
    }

    formErrors = handleWholeValidation({ code, description }, formErrors)
    if (!formErrors.code && !formErrors.description) {
      this.setState({
        isLoading: true
      })
      await this.props.updateTaxFlag(data)

      //success case of update tax flags
      if (this.props.chart.updateTaxFlagSuccess) {
        toast.success(this.props.chart.updateTaxFlagSuccess);

        //also update the table
        let found = taxCodes.findIndex(d => d.code === code)
        if (found != -1) {
          let table = window.$("#indirect-tax-codes").DataTable()

          let trCode = ""

          if (clonedTrackingCodes.length > 0) {
            clonedTrackingCodes.map((f, i) => {
              trCode = `${trCode} ${f.value}`
            })


          }
          data.taxFlag = { ...data.taxFlag, trackingCodes: trCode }

          taxCodes[found] = data.taxFlag

          this.setState({
            taxCodes: [...taxCodes],
          }, () => {
            table
              .row(found)
              .invalidate('dom')
              .draw(false);
            this.closeModal('openIndirectTaxCodesModal')
          })
        }
      }
      //error case of update tax flags
      if (this.props.chart.updateTaxFlagError) {
        handleAPIErr(this.props.chart.updateTaxFlagError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //insert tax code
  insertTaxFlag = async () => {

    let {
      code,
      description,
      rate,
      chartSort,
      chartCode,
      clonedTrackingCodes,
      clonedAdvancedList,
      formErrors,
      taxCodes
    } = this.state;
    let data = {
      taxFlag: {
        code,
        description,
        rate,
        chartSort,
        chartCode,
        trackingCodes: clonedTrackingCodes,
        advancedList: clonedAdvancedList,
      }
    }

    formErrors = handleWholeValidation({ code, description }, formErrors)

    if (!formErrors.name && !formErrors.description) {
      this.setState({
        isLoading: true
      })
      await this.props.insertTaxFlag(data)

      //success case of add tax flags
      if (this.props.chart.insertTaxFlagSuccess) {
        // toast.success(this.props.chart.insertTaxFlagSuccess);
        window.location.reload()
      }
      //error case of add tax flags
      if (this.props.chart.insertTaxFlagError) {
        handleAPIErr(this.props.chart.insertTaxFlagError, this.props);
      }
      this.props.clearChartStates();
    }
    this.setState({ formErrors, isLoading: false })

  }
  //check whether add or update tax code 
  addEditTaxCode = () => {
    let { addEditCodeCheck } = this.state;

    if (addEditCodeCheck === 'add') {
      //add tax flags case
      this.insertTaxFlag()
    } else {
      //update tax flags case
      this.updateTaxFlag()
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
    handleSaveSettings(columns, 'indirect-tax-codes', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'indirect-tax-codes')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  handleChangeField = (e) => {
    const { name, value } = e.target;
    let { formErrors, showSuggestion } = this.state
    formErrors = handleValidation(name, value, formErrors)
    this.setState({ [name]: value, formErrors })
  }
  //Advanced List Setting
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };

  handleShowHiddenRows = async () => {
    let table = window.$("#IndirectTaxCodes-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.taxModalTableSetting()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.taxModalTableSetting()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#IndirectTaxCodes-modal",
      "taxCodesAdvancedList",
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
      this.taxModalTableSetting()
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
    this.setState({ detailOfTrackingCode: flagsObj }, () => this.openModal("openTrackingCodeModal"));

  };
  //getting new tracking code
  getUpdatedTrackingCode = async (newVal, prevVal) => {
    //prevVal consists of previous tracking code value and newVal consists of new tracking code value
    let trackingCodes = JSON.parse(JSON.stringify(this.state.trackingCodes)); //restructured trackingCodes
    let clonedTrackingCodes = JSON.parse(JSON.stringify(this.state.clonedTrackingCodes)); //trackingCodes
    let clndObj = clonedTrackingCodes.find(
      (f) => f.type.toLowerCase() == prevVal.label.toLowerCase()
    );

    let labelObj = trackingCodes.find(
      (f) =>
        f.label.toLowerCase() == prevVal.label.toLowerCase() &&
        f.id == prevVal.id
    ); //e.g {label: 'Insurance', value: 01, id:0}
    let valueObj = trackingCodes.find(
      (f) =>
        f.label.toLowerCase() == prevVal.value.toLowerCase() &&
        f.id == prevVal.id
    ); //e.g {label: 01, value: 01, id:0}

    if (labelObj && valueObj && clndObj) {
      labelObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["label"] = newVal.code; //update value to just show on tracking codes dropdown
      valueObj["value"] = newVal.code; //update value to just show on tracking codes dropdown
      clndObj["value"] = newVal.code; //update value to send to backend ( when add/update PO)

      this.setState({ trackingCodes, clonedTrackingCodes });
    }
  };
  //handle change flags (edit-in-place)
  handleChangeFlags = async (event, index, line) => {
    const { value, name, defaultValue } = event.target;

    if (value === defaultValue) return;
    let { taxCodes } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value;
      }
      return f;
    });


    let _code = taxCodes[index];

    _code['flags'] = flags;

    let table = window.$("#indirect-tax-codes").DataTable()

    this.setState({
      taxCodes,
    }, () => {
      table
        .row(index)
        .invalidate('dom') //update datatable to re-read the information from the data source for the row (be it from the DOM or objects / arrays - whatever the original data source was).
        .draw();
    })


    let {
      code,
      description,
      rate,
      chartSort,
      chartCode,
      clonedTrackingCodes,
      clonedAdvancedList,
      advancedList,
      formErrors,
    } = this.state;
    let data = {
      taxFlag: {
        code,
        description,
        rate,
        chartSort,
        chartCode,
        trackingCodes: clonedTrackingCodes,
        advancedList,
      }
    }

    this.setState({
      isLoading: true
    })
    await this.props.updateTaxFlag(data)

    //success case of update tax fla
    if (this.props.chart.updateTaxFlagSuccess) {
      toast.success(this.props.chart.updateTaxFlagSuccess);
    }
    //error case of update tax fla
    if (this.props.chart.updateTaxFlagError) {
      handleAPIErr(this.props.chart.updateTaxFlagError, this.props);
    }
    this.props.clearChartStates();

    this.setState({
      isLoading: false
    })

  };
  render() {
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
              <h2>indirect tax codes</h2>
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
                  learn how to use indirect tax codes Read our{' '}
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
                    onClick={this.primeTaxFlag}
                    className='btn user_setup_rbtns'
                    type='button'
                  >
                    <span
                      className='round_plus'
                    >
                      <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteTaxFlag} className='btn user_setup_rbtns' type='button'>
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
              <table
                id='indirect-tax-codes'
                className=' user_setup_table'
                width='100%'
              >
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
                      <span className='user_setup_hed'>Code</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Description</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Tax Rates</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Chart Sort</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Chart Code</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Tracking Code</span>
                    </th>

                    <th>
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
                    this.state.taxCodes.map((tc, i) => {
                      return <tr key={tc.code} onClick={(e) => this.getTaxFlag(e, tc)} className="cursorPointer">
                        <td>
                          <div className="custom-radio">
                            <label className="check_main remember_check" htmlFor={`listCheck${i}`}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`listCheck${i}`}
                                name={'userListCheck'}
                                checked={tc.code === this.state.code}
                                onChange={(e) => this.handleCodeListCheckbox(e, tc)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{tc.code}</td>
                        <td>{tc.description}</td>
                        <td>{tc.rate}</td>

                        <td>{tc.chartSort}</td>
                        <td>{tc.chartCode}</td>
                        <td>{tc.trackingCodes}</td>
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
        <IndirectTaxCodesModal
          openModal={this.openModal}
          closeModal={this.closeModal}
          addEditTaxCode={this.addEditTaxCode}
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
  getTaxCodes,
  getTaxFlag,
  primeTaxFlag,
  insertTaxFlag,
  updateTaxFlag,
  deleteTaxFlag,
  getChartCodes,
  getChartSorts,
  getFlags,
  clearChartStates
})(IndirectTaxCodes);
