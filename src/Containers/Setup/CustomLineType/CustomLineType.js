import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './CustomLineType.css'
import $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown'
import { toast } from 'react-toastify'
import TopNav from '../../Common/TopNav/TopNav'
import Settings from '../../Modals/SetupModals/Settings/Settings'
import CustomLineTypeModal from '../../Modals/SetupModals/CustomLineType/CustomLineType'
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
import ReactInputMask from 'react-input-mask'
const uuidv1 = require("uuid/v1");

class CustomLineType extends Component {
  constructor() {
    super()
    this.state = {
      recordID: "",
      lineType: "",
      description: "",
      fields: [],
      state: "",
      isLoading: false,
      customLineTypes: [],
      columns: [],
      advancedList: [],
      clonedAdvancedList: [],
      addEditCheck: "",
      pageLength: 10,
      openSettingsModal: false,
      openCustomLineTypeModal: false,
    }
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox("customlinetype");
    this.getCustomLineTypes();
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
  getCustomLineTypes = async () => {
    this.setState({
      isLoading: true,
    });
    await this.props.getCustomLineTypes();
    if (this.props.setup.getCustomLineTypesSuccess) {
      let list = JSON.parse(JSON.stringify(this.props.setup.getCustomLineTypes));
      list.map((lst) => (lst.checked = false));
      let columns = [];
      //adding the column names
      columns[0] = { name: "Type" };
      columns[1] = { name: "Description" };
      this.setState({ customLineTypes: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.setup.getCustomLineTypesError) {
      handleAPIErr(this.props.setup.getCustomLineTypesError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];
    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    columns.map((c) => aoColumns.push({ sName: c.name }));
    aoColumns[columns.length + 1] = { sName: "menus" };

    let result = tableSetting(columns, aoColumns, "customlinetype");
    this.setState({ ...result });
  };
  openModal = name => {
    this.setState({ [name]: true }, () => {
      if (name === 'openCustomLineTypeModal') {
        // window.$('#custome-line-type-1').DataTable({
        //   dom: 'Rlfrtip',
        //   searching: false,
        //   paging: false,
        //   info: false,
        //   order: [[1, 'asc']],
        //   colReorder: {
        //     fixedColumnsRight: 5,
        //     fixedColumnsLeft: 5
        //   }
        // })
        this.custmLineTypeModalSetting()
      }
    })
  }
  closeModal = name => {
    this.setState({ [name]: false });
    if (name === "openCustomLineTypeModal") {
      this.clearStates();
    }
  }
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
    handleSaveSettings(columns, "customlinetype", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, "customlinetype");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  clearStates = () => {
    this.setState({
      recordID: "",
      lineType: "",
      description: "",
      fields: [],
      state: "",
      advancedList: [],
      clonedAdvancedList: [],
      addEditCheck: "",
      pageLength: 10
    });
  };
  custmLineTypeModalSetting = () => {
    window.$('#custome-line-type-advncd').DataTable({
      dom: 'Rlfrtip',
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
  //get custom line type
  getCustomLineType = async (e, cl) => {
    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) { return; }
    this.setState({
      isLoading: true
    })
    await this.props.getCustomLineType(cl.recordID)

    //success case of get custom line type
    if (this.props.setup.getCustomLineTypeSuccess) {
      // toast.success(this.props.setup.getCustomLineTypeSuccess);

      let customLineType =
        (JSON.parse(JSON.stringify(this.props.setup.getCustomLineType))) ||
        "";

      let recordID = customLineType.recordID || '';
      let lineType = customLineType.lineType || '';
      let description = customLineType.description || '';
      let fields = customLineType.fields || [];
      let state = customLineType.state || ''
      let advancedList = customLineType.advancedList || []
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

      //get advanced list data from the local storage to hide/unhide rows for all custom line types
      let custmLineTypesAdvncdLst = JSON.parse(
        localStorage.getItem("custmLineTypesAdvncdLst") || "[]"
      );
      if (custmLineTypesAdvncdLst && custmLineTypesAdvncdLst.length > 0) {
        advancedList.map((al, i) => {
          custmLineTypesAdvncdLst.map((lst, i) => {
            if (
              al.category === lst.category &&
              al.description === lst.description &&
              al.valueType === lst.valueType
            ) {
              al.hide = true;
            }
          });
        });
      }
      let filtrdList = advancedList.filter((l) => !l.hide);


      fields.map(f => f.checked = false)

      this.setState({
        recordID,
        lineType,
        description,
        fields,
        state,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditCheck: 'update'
      }, () => {
        this.openModal("openCustomLineTypeModal")
      })
    }
    //error case of get custom line type
    if (this.props.setup.getCustomLineTypeError) {
      handleAPIErr(this.props.setup.getCustomLineTypeError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  }
  //prime custom line type
  primeCustomLineType = async () => {

    this.setState({
      isLoading: true
    })
    await this.props.primeCustomLineType()

    //success case of prime custom line type
    if (this.props.setup.primeCustomLineTypeSuccess) {
      // toast.success(this.props.setup.primeCustomLineTypeSuccess);

      let customLineType =
        (JSON.parse(JSON.stringify(this.props.setup.primeCustomLineType))) ||
        "";

      let recordID = customLineType.recordID || '';
      let lineType = customLineType.lineType || '';
      let description = customLineType.description || '';
      let fields = customLineType.fields || [];
      let state = customLineType.state || ''
      let advancedList = customLineType.advancedList || []
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

      //get advanced list data from the local storage to hide/unhide rows for all custom line types
      let custmLineTypesAdvncdLst = JSON.parse(
        localStorage.getItem("custmLineTypesAdvncdLst") || "[]"
      );
      if (custmLineTypesAdvncdLst && custmLineTypesAdvncdLst.length > 0) {
        advancedList.map((al, i) => {
          custmLineTypesAdvncdLst.map((lst, i) => {
            if (
              al.category === lst.category &&
              al.description === lst.description &&
              al.valueType === lst.valueType
            ) {
              al.hide = true;
            }
          });
        });
      }
      let filtrdList = advancedList.filter((l) => !l.hide);

      fields.map(f => f.checked = false)

      this.setState({
        recordID,
        lineType,
        description,
        fields,
        state,
        advancedList: filtrdList,
        clonedAdvancedList: advancedList,
        addEditCheck: 'add'
      }, () => {
        this.openModal("openCustomLineTypeModal")
      })
    }
    //error case of prime custom line type
    if (this.props.setup.primeCustomLineTypeError) {
      handleAPIErr(this.props.setup.primeCustomLineTypeError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  }
  handleChangeField = (e, type, i) => {
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }
  handleFields = (e, i) => {
    let { fields } = this.state;
    const { name, value } = e.target;

    let fld = fields[i]
    fld[name] = value

    this.setState({ fields })
  }
  addField = () => {
    let { fields } = this.state;
    fields = _.cloneDeep(fields);

    this.setState({ fields: [...fields, { field: "", defaultValue: "", checked: false }] })
  }
  deleteField = () => {
    let { fields } = this.state;
    fields = _.cloneDeep(fields);

    fields = fields.filter(f => !f.checked)
    this.setState({ fields })
  }
  handleFieldCheckbox = (e, i) => {
    let { fields } = this.state;
    const { checked } = e.target;

    let fld = fields[i]
    fld.checked = checked

    this.setState({ fields })
  }
  //Advanced List Setting
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };
  handleShowHiddenRows = async () => {
    let table = window.$("#custome-line-type-advncd").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        let clonedAdvancedList = this.state.clonedAdvancedList;
        this.setState({ advancedList: clonedAdvancedList }, () => {
          this.custmLineTypeModalSetting()
        });
      } else {
        //hide again hidden rows
        let advancedList = this.state.advancedList;
        let list = advancedList.filter((l) => !l.hide);
        this.setState({ advancedList: list }, () => {
          this.custmLineTypeModalSetting()
        });
      }
    });
  };
  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = handleHideUnhideRows(
      item,
      "#custome-line-type-advncd",
      "custmLineTypesAdvncdLst",
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
      this.custmLineTypeModalSetting()
    });

  };
  //handle custom line list checkbox
  handleCustomListCheckbox = (e, cus) => {
    if (e.target.checked) {
      this.setState({ recordID: cus.recordID })
    } else {
      this.setState({ recordID: '' })
    }
  }
  handleRadio = (e) => {
    let { value } = e.target
    value = value.toLowerCase()
    this.setState({ state: value })
  }
  //delete custom line type
  deleteCustomLineType = async () => {

    let { recordID, customLineTypes } = this.state;
    this.setState({
      isLoading: true
    })

    if (recordID) {
      await this.props.deleteCustomLineType(recordID)
    } else {
      toast.error("Record ID is Missing!")
    }

    //success case of delete custom line type
    if (this.props.setup.deleteCustomLineTypeSuccess) {
      // toast.success(this.props.setup.deleteCustomLineTypeSuccess);

      let table = window.$("#customlinetype").DataTable()

      let index = customLineTypes.findIndex(c => c.recordID === recordID)

      let filtersList = customLineTypes.filter(c => c.recordID != recordID)
      customLineTypes = filtersList
      this.setState({
        customLineTypes,
        recordID: ''
      }, () => {
        table.row(index).remove().draw(false); //also update table
      })
    }

    //error case of delete custom line type
    if (this.props.setup.deleteCustomLineTypeError) {
      handleAPIErr(this.props.setup.deleteCustomLineTypeError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({
      isLoading: false
    })
  }
  //check whether add or update custome line type 
  addEditCustomLineType = () => {
    let { addEditCheck } = this.state;

    if (addEditCheck === 'add') {
      //add custome line type case
      this.insertCustomLineType()
    } else {
      //update custome line type case
      this.updateCustomLineType()
    }
  }
  //insert custom line type
  insertCustomLineType = async (custm) => {
    let {
      recordID,
      lineType,
      description,
      fields,
      state,
      clonedAdvancedList,
    } = this.state;
    let data = {
      customLineType: {
        recordID,
        lineType,
        description,
        fields,
        state,
        advancedList: clonedAdvancedList
      }
    }

    this.setState({
      isLoading: true
    })
    await this.props.insertCustomLineType(data)

    //success case of insert custom field
    if (this.props.setup.insertCustomLineTypeSuccess) {
      // toast.success(this.props.setup.insertCustomLineTypeSuccess);
      window.location.reload()
    }
    //error case of insert custom field
    if (this.props.setup.insertCustomLineTypeError) {
      handleAPIErr(this.props.setup.insertCustomLineTypeError, this.props);
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false })

  }
  //update custom line type
  updateCustomLineType = async (custm) => {
    let {
      customLineTypes,
      recordID,
      lineType,
      description,
      fields,
      state,
      clonedAdvancedList,
    } = this.state;
    let data = {
      customLineType: {
        recordID,
        lineType,
        description,
        fields,
        state,
        advancedList: clonedAdvancedList
      }
    }

    this.setState({
      isLoading: true
    })
    await this.props.updateCustomLineType(data)

    //success case of insert custom field
    if (this.props.setup.updateCustomLineTypeSuccess) {
      // toast.success(this.props.setup.updateCustomLineTypeSuccess);
      //also update the table
      let found = customLineTypes.findIndex(d => d.recordID === recordID)
      if (found != -1) {
        let table = window.$("#customlinetype").DataTable()

        customLineTypes[found] = data.customLineType

        this.setState({
          customLineTypes: [...customLineTypes],
        }, () => {
          table
            .row(found)
            .invalidate('dom')
            .draw(false);
          this.closeModal('openCustomLineTypeModal')
        })
      }
    }
    //error case of insert custom field
    if (this.props.setup.updateCustomLineTypeError) {
      handleAPIErr(this.props.setup.updateCustomLineTypeError, this.props);
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false })

  }
  render() {

    let {
      recordID,
      customLineTypes,
      columns,
      pageLength,
      isLoading,
      openSettingsModal
    } = this.state;
    return (
      <>
        {isLoading ? <div className='se-pre-con'></div> : ''}

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
              <h2>custom line type</h2>
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
                  learn how to use custom line type Read our{' '}
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
                    onClick={this.primeCustomLineType}

                    className='btn user_setup_rbtns'
                    type='button'
                  >
                    <span className='round_plus'
                    >
                      <i className='fa fa-plus-circle' aria-hidden='true'></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={this.deleteCustomLineType} className='btn user_setup_rbtns' type='button'>
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
              <table id='customlinetype' className=' user_setup_table' width='100%'>
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
                      <span className='user_setup_hed'>Type</span>
                    </th>
                    <th>
                      <span className='user_setup_hed'>Description</span>
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
                    customLineTypes.map((cl, i) => {
                      return <tr key={cl.recordID} onClick={(e) => this.getCustomLineType(e, cl)} className="cursorPointer">
                        <td>
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={`cusLine${i}`}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`cusLine${i}`}
                                name={'customField'}
                                checked={cl.recordID === recordID}
                                onChange={(e) => this.handleCustomListCheckbox(e, cl)}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        <td>{cl.lineType}</td>
                        <td>{cl.description}</td>
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
        <CustomLineTypeModal
          addEditCustomLineType={this.addEditCustomLineType}
          state={this.state}
          openModal={this.openModal}
          closeModal={this.closeModal}
          handleChangeField={this.handleChangeField}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}
          handleRadio={this.handleRadio}
          handleFields={this.handleFields}
          addField={this.addField}
          deleteField={this.deleteField}
          handleFieldCheckbox={this.handleFieldCheckbox}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => ({ setup: state.setup });
export default connect(mapStateToProps, {
  primeCustomLineType: SetupAction.primeCustomLineType,
  getCustomLineTypes: SetupAction.getCustomLineTypes,
  getCustomLineType: SetupAction.getCustomLineType,
  deleteCustomLineType: SetupAction.deleteCustomLineType,
  insertCustomLineType: SetupAction.insertCustomLineType,
  updateCustomLineType: SetupAction.updateCustomLineType,
  clearSetupStates: SetupAction.clearSetupStates
})(CustomLineType);