import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import './CustomFields.css'
import $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown'
import Settings from '../../Modals/SetupModals/Settings/Settings'
import CustomFieldsModal from '../../Modals/SetupModals/CustomFields/CustomFields'
import TopNav from '../../Common/TopNav/TopNav'
import Filter from "../Filter/Filter";
import * as SetupAction from "../../../Actions/SetupRequest/SetupAction";
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox,
  handleValueOptions,
  handleHideUnhideRows
} from "../../../Utils/Helpers";
import * as Validation from "../../../Utils/Validation";
import _ from "lodash";
const uuidv1 = require("uuid/v1");

class CustomFields extends Component {
  constructor() {
    super()
    this.state = {
      recordID: "",
      description: "",
      fieldType: "",
      fieldOptions: [],
      fieldValue: "",
      displayValue: "",
      prompt: "",
      validation: "",
      isLoading: false,
      customFields: [],
      columns: [],
      advancedList: [],
      clonedAdvancedList: [],
      addEditCheck: "",
      pageLength: 10,
      openSettingsModal: false,
      openCustomFieldsModal: false,
    }
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox("customfields");
    this.getCustomFields();
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
      if (name === 'openCustomFieldsModal') {
        this.custmFieldModalSetting()
      }
    })
  }
  closeModal = name => {
    this.setState({ [name]: false });
    if (name === "openCustomFieldsModal") {
      this.clearStates();
    }
  }
  clearStates = () => {
    this.setState({
      recordID: "",
      description: "",
      fieldType: "",
      fieldValue: "",
      displayValue: "",
      prompt: "",
      validation: "",
      advancedList: [],
      clonedAdvancedList: [],
      addEditCheck: "",
      pageLength: 10
    });
  };
  custmFieldModalSetting = () => {
    window.$('#CustomFields-modal').DataTable({
      dom: 'Rlfrtip',

      // language: {
      //   searchPlaceholder: "Search",
      // },
      searching: false,
      paging: false,
      info: false,
      order: [[1, 'asc']],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5
      }
    })
  }
  getCustomFields = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getCustomFields();
    if (this.props.setup.getCustomFieldsSuccess) {
      let list = JSON.parse(JSON.stringify(this.props.setup.getCustomFields));
      list.map((lst) => (lst.checked = false));
      let columns = [];
      //adding the column names
      columns[0] = { name: "Prompt" };
      columns[1] = { name: "Description" };
      columns[2] = { name: "Field Type" };
      columns[3] = { name: "Display Value" };
      columns[4] = { name: "Field value" };
      columns[5] = { name: "validation" };
      this.setState({ customFields: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.setup.getCustomFieldsError) {
      handleAPIErr(this.props.setup.getCustomFieldsError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  //get custom field
  getCustomField = async (e, custm) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }

    this.setState({
      isLoading: true
    })
    await this.props.getCustomField(custm.recordID)

    //success case of get custom field
    if (this.props.setup.getCustomFieldSuccess) {
      // toast.success(this.props.setup.getCustomFieldSuccess);

      let customField =
        (JSON.parse(JSON.stringify(this.props.setup.getCustomField))) ||
        "";

      let recordID = customField.recordID || '';
      let description = customField.description || '';
      let displayValue = customField.displayValue || '';
      let fieldType = customField.fieldType || '';
      let fieldOptions = customField.fieldOptions || [];
      let fieldValue = customField.fieldValue || '';
      let prompt = customField.prompt || '';
      let validation = customField.validation || '';
      let advancedList = customField.advancedList || []
      validation = validation.toLowerCase()
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

      //get advanced list data from the local storage to hide/unhide rows for all custom fields
      let custmFldsAdvncdLst = JSON.parse(
        localStorage.getItem("custmFldsAdvncdLst") || "[]"
      );
      if (custmFldsAdvncdLst && custmFldsAdvncdLst.length > 0) {
        advancedList.map((al, i) => {
          custmFldsAdvncdLst.map((loc, i) => {
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

      let _fieldOptions = []
      fieldOptions.map((op, i) => {
        _fieldOptions.push({ label: op.option, value: op.option })
      })
      this.setState({
        recordID,
        description,
        fieldType,
        fieldOptions: _fieldOptions,
        fieldValue,
        displayValue,
        prompt,
        validation,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditCheck: 'update'
      }, () => {
        this.openModal("openCustomFieldsModal")
      })
    }
    //error case of get custom field
    if (this.props.setup.getCustomFieldError) {
      handleAPIErr(this.props.setup.getCustomFieldError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  }
  //prime custom field
  primeCustomField = async () => {

    this.setState({
      isLoading: true
    })
    await this.props.primeCustomField()

    //success case of prime custom field
    if (this.props.setup.primeCustomFieldSuccess) {
      // toast.success(this.props.setup.primeCustomFieldSuccess);

      let customField =
        (JSON.parse(JSON.stringify(this.props.setup.primeCustomField))) ||
        "";

      let recordID = customField.recordID || '';
      let description = customField.description || '';
      let displayValue = customField.displayValue || '';
      let fieldType = customField.fieldType || '';
      let fieldOptions = customField.fieldOptions || [];
      let fieldValue = customField.fieldValue || '';
      let prompt = customField.prompt || '';
      let validation = customField.validation || '';
      let advancedList = customField.advancedList || []
      validation = validation.toLowerCase()
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

      //get advanced list data from the local storage to hide/unhide rows for all custom fields
      let custmFldsAdvncdLst = JSON.parse(
        localStorage.getItem("custmFldsAdvncdLst") || "[]"
      );
      if (custmFldsAdvncdLst && custmFldsAdvncdLst.length > 0) {
        advancedList.map((al, i) => {
          custmFldsAdvncdLst.map((loc, i) => {
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

      let _fieldOptions = []
      fieldOptions.map((op, i) => {
        _fieldOptions.push({ label: op.option, value: op.option })
      })
      this.setState({
        recordID,
        description,
        fieldType,
        fieldOptions: _fieldOptions,
        fieldValue,
        displayValue,
        prompt,
        validation,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditCheck: 'add'
      }, () => {
        this.openModal("openCustomFieldsModal")
      })
    }
    //error case of prime custom field
    if (this.props.setup.primeCustomFieldError) {
      handleAPIErr(this.props.setup.primeCustomFieldError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  }
  //delete custom field
  deleteCustomField = async () => {

    let { recordID, customFields } = this.state;
    this.setState({
      isLoading: true
    })

    if (recordID) {
      await this.props.deleteCustomField(recordID)
    } else {
      toast.error("Record ID is Missing!")
    }

    //success case of delete custom field
    if (this.props.setup.deleteCustomFieldSuccess) {
      // toast.success(this.props.setup.deleteCustomFieldSuccess);

      let table = window.$("#customfields").DataTable()

      let index = customFields.findIndex(c => c.recordID === recordID)

      let filtersList = customFields.filter(c => c.recordID != recordID)
      customFields = filtersList
      this.setState({
        customFields,
        recordID: ''
      }, () => {
        table.row(index).remove().draw(false); //also update table
      })
    }

    //error case of delete custom field
    if (this.props.setup.deleteCustomFieldError) {
      handleAPIErr(this.props.setup.deleteCustomFieldError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({
      isLoading: false
    })
  }
  //handle custom Fields list checkbox
  handleCustomListCheckbox = (e, cus) => {
    if (e.target.checked) {
      this.setState({ recordID: cus.recordID })
    } else {
      this.setState({ recordID: '' })
    }
  }
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];
    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    columns.map((c) => aoColumns.push({ sName: c.name }));
    aoColumns[columns.length + 1] = { sName: "menus" };

    let result = tableSetting(columns, aoColumns, "customfields");
    this.setState({ ...result });
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
    handleSaveSettings(columns, "customfields", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "customfields");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  handleChangeField = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }
  handleValidation = (e) => {
    let { value } = e.target
    value = value.toLowerCase()
    this.setState({ validation: value })
  }
  handleChangeFieldType = (obj) => {
    this.setState({ fieldType: obj.value })
  }
  //Advanced List Setting
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };
  handleShowHiddenRows = async () => {
    let table = window.$("#CustomFields-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.custmFieldModalSetting()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.custmFieldModalSetting()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#CustomFields-modal",
      "custmFldsAdvncdLst",
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
      this.custmFieldModalSetting()
    });

  };
  //check whether add or update custome field 
  addEditCustomField = () => {
    let { addEditCheck } = this.state;

    if (addEditCheck === 'add') {
      //add custome field case
      this.insertCustomField()
    } else {
      //update custome field case
      this.updateCustomField()
    }
  }
  //update custom field
  updateCustomField = async (custm) => {
    let {
      recordID,
      description,
      fieldType,
      fieldValue,
      displayValue,
      prompt,
      validation,
      clonedAdvancedList,
      customFields
    } = this.state;
    let data = {
      customField: {
        recordID,
        description,
        fieldType,
        fieldValue,
        displayValue,
        prompt,
        validation,
        advancedList: clonedAdvancedList,
      }
    }

    this.setState({
      isLoading: true
    })
    await this.props.updateCustomField(data)

    //success case of update custom field
    if (this.props.setup.updateCustomFieldSuccess) {
      // toast.success(this.props.setup.updateCustomFieldSuccess);

      //also update the table
      let found = customFields.findIndex(d => d.recordID === recordID)
      if (found != -1) {
        let table = window.$("#customfields").DataTable()

        customFields[found] = data.customField

        this.setState({
          customFields: [...customFields],
        }, () => {
          table
            .row(found)
            .invalidate('dom')
            .draw(false);
          this.closeModal('openCustomFieldsModal')
        })
      }
    }
    //error case of update custom field
    if (this.props.setup.updateCustomFieldError) {
      handleAPIErr(this.props.setup.updateCustomFieldError, this.props);
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false })

  }
  //insert custom field
  insertCustomField = async (custm) => {
    let {
      recordID,
      description,
      fieldType,
      fieldValue,
      displayValue,
      prompt,
      validation,
      clonedAdvancedList,
      fieldOptions
    } = this.state;
    let data = {
      customField: {
        recordID,
        description,
        fieldType,
        fieldValue,
        displayValue,
        prompt,
        validation,
        advancedList: clonedAdvancedList,
        fieldOptions
      }
    }

    this.setState({
      isLoading: true
    })
    await this.props.insertCustomField(data)

    //success case of insert custom field
    if (this.props.setup.insertCustomFieldSuccess) {
      // toast.success(this.props.setup.insertCustomFieldSuccess);
      window.location.reload()
    }
    //error case of insert custom field
    if (this.props.setup.insertCustomFieldError) {
      handleAPIErr(this.props.setup.insertCustomFieldError, this.props);
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false })

  }
  render() {
    let {
      recordID,
      customFields,
      openCustomFieldsModal,
      openSettingsModal,
      columns,
      pageLength
    } = this.state;
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
              <h2>custom fields</h2>
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
                  learn how to use custom fields Read our{' '}
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
                  <button className='btn user_setup_rbtns' type='button'>
                    <span
                      onClick={this.primeCustomField}
                      className='round_plus'
                    >
                      <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteCustomField} className='btn user_setup_rbtns' type='button'>
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
              <table id='customfields' className=' user_setup_table' width='100%'>
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
                            checked={false}
                          />
                          <span className='click_checkmark global_checkmark'></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Prompt</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Description</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Field Type</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Display Value</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Field value</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>validation</span>
                    </th>
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
                    customFields.map((cf, i) => {
                      return <tr key={cf.recordID} onClick={(e) => this.getCustomField(e, cf)} className="cursorPointer">
                        <td>
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={`cusField${i}`}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`cusField${i}`}
                                name={'customField'}
                                checked={cf.recordID === recordID}
                                onChange={(e) => this.handleCustomListCheckbox(e, cf)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{cf.prompt}</td>
                        <td>{cf.fieldType}</td>
                        <td>{cf.description}</td>
                        <td>{cf.displayValue}</td>
                        <td>{cf.fieldValue}</td>
                        <td>{cf.validation}</td>
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
          openSettingsModal={openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={columns}
          pageLength={pageLength}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={this.handleSaveSettings}
          handleCloseSettingModal={this.handleCloseSettingModal}
        />
        <CustomFieldsModal
          addEditCustomField={this.addEditCustomField}
          state={this.state}
          openModal={this.openModal}
          closeModal={this.closeModal}
          handleChangeField={this.handleChangeField}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleValidation={this.handleValidation}
          handleChangeFieldType={this.handleChangeFieldType}
        />
      </>
    )
  }
}
const mapStateToProps = (state) => ({ setup: state.setup });
export default connect(mapStateToProps, {
  primeCustomField: SetupAction.primeCustomField,
  getCustomFields: SetupAction.getCustomFields,
  getCustomField: SetupAction.getCustomField,
  deleteCustomField: SetupAction.deleteCustomField,
  insertCustomField: SetupAction.insertCustomField,
  updateCustomField: SetupAction.updateCustomField,
  clearSetupStates: SetupAction.clearSetupStates
})(CustomFields);