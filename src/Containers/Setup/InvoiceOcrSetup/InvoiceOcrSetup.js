import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./InvoiceOcrSetup.css";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from '../Filter/Filter'
import Settings from "../../Modals/SetupModals/Settings/Settings";
import InvoiceOCR from "../../Modals/SetupModals/InvoiceOcr/InvoiceOcr";
import * as SetupAction from '../../../Actions/SetupRequest/SetupAction'
import * as Helpers from '../../../Utils/Helpers'
import { toast } from "react-toastify";

const uuidv1 = require("uuid/v1");

class InvoiceOcrSetup extends Component {
  constructor() {
    super();
    this.state = {
      invoiceOCRList: [],
      index: '', //to check which invoice ocr is going to update
      description: "",
      type: "",
      search: "",
      advancedList: [],
      clonedAdvancedList: [],
      addUpdateInvoiceOCR: '', //to check whether ocr going to update or insert
      columns: [],
      pageLength: 10,
      openSettingsModal: false,
      openInvoiceOCRModal: false,
      checkAll: false // check all invoice ocr
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    Helpers.filterBox('invoiceocrsetup')
    this.getInvoiceOCRList();
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
  getInvoiceOCRList = async () => {
    this.setState({ isLoading: true });

    await this.props.getInvoiceOCRList();

    if (this.props.setup.getInvoiceOCRListSuccess) {
      let list = this.props.setup.getInvoiceOCRList || []
      list.map(lst => lst.checked = false)
      let columns = [];
      //adding the column names
      columns[0] = { name: "Description" };
      columns[1] = { name: "Type" };
      columns[2] = { name: "Search Fields" };
      this.setState({ invoiceOCRList: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.setup.getInvoiceOCRListError) {
      Helpers.handleAPIErr(this.props.setup.getInvoiceOCRListError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  getInvoiceOCR = async ({
    type = '',
    search = '',
    description = '',
    advancedList = []
  }, index, e) => {

    if (e.target.cellIndex === 0 || e.target.cellIndex === undefined) {
      return;
    }

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

    //get advanced list data from the local storage to hide/unhide rows for all Inoice ocrs
    let invcOcrAdvList = JSON.parse(
      localStorage.getItem("InvcOcrAdvList") || "[]"
    );
    if (invcOcrAdvList && invcOcrAdvList.length > 0) {
      advancedList.map((al, i) => {
        invcOcrAdvList.map((loc, i) => {
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
      type,
      search,
      description,
      advancedList: filtrdList,
      clonedAdvancedList: advancedList,
      index,
      addUpdateInvoiceOCR: 'update'
    }, () => {
      this.openModal("openInvoiceOCRModal")
    })
  };
  primeInvoiceOCR = async (dep) => {
    this.setState({
      isLoading: true
    })
    await this.props.primeInvoiceOCR()

    //success case of prime department
    if (this.props.setup.primeInvoiceOCRSuccess) {
      toast.success(this.props.setup.primeInvoiceOCRSuccess);

      let primeInvoiceOCR =
        (JSON.parse(JSON.stringify(this.props.setup.primeInvoiceOCR))) ||
        "";
      let description = primeInvoiceOCR.description || '';
      let type = primeInvoiceOCR.type || '';
      let search = primeInvoiceOCR.search || '';
      let advancedList = primeInvoiceOCR.advancedList || []

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

      //get advanced list data from the local storage to show hidden rows for all ocrs
      let invcOcrAdvList = JSON.parse(
        localStorage.getItem("InvcOcrAdvList") || "[]"
      );
      if (invcOcrAdvList && invcOcrAdvList.length > 0) {
        advancedList.map((al, i) => {
          invcOcrAdvList.map((loc, i) => {
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
        description,
        type,
        search,
        advancedList,
        clonedAdvancedList: advancedList,
        addUpdateInvoiceOCR: 'add'
      }, () => {
        this.openModal("openInvoiceOCRModal")
      })
    }
    //error case of prime department
    if (this.props.setup.primeInvoiceOCRError) {
      Helpers.handleAPIErr(this.props.setup.primeInvoiceOCRError, this.props);
    }
    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  }

  deleteInvoiceOCR = async () => {
    let { invoiceOCRList } = this.state;

    let ind = invoiceOCRList.findIndex(l => l.checked)
    if (ind > -1) {
      this.setState({ isLoading: true });

      let filteredList = invoiceOCRList.filter(f => !f.checked)

      await this.props.updateInvoiceOCRList(filteredList);

      if (this.props.setup.updateInvoiceOCRListSuccess) {

        toast.success(this.props.setup.updateInvoiceOCRListSuccess);
        let table = window.$("#invoiceocrsetup").DataTable();
        table.colReorder.reset();
        table.destroy()

        this.setState(
          {
            invoiceOCRList: filteredList
          }, () => {
            this.tableSetting()
          });
      }
      if (this.props.setup.updateInvoiceOCRListError) {
        Helpers.handleAPIErr(this.props.setup.updateInvoiceOCRListError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({ isLoading: false });
    } else {
      toast.error('Please Select OCR First!')
    }
  };

  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = [];
    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    columns.map((c) => aoColumns.push({ sName: c.name }));
    aoColumns[columns.length + 1] = { sName: "menus" };

    let result = Helpers.tableSetting(columns, aoColumns, "invoiceocrsetup");
    this.setState({ ...result });
  };
  invoiceOCRModalSettings = () => {
    window.$("#invoiceocr-modal").DataTable({
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
    Helpers.handleSaveSettings(columns, "invoiceocrsetup", pageLength);
    this.closeModal("openSettingsModal");
  };
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = Helpers.handleCloseSettingModal(columns, "invoiceocrsetup");
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };
  openModal = (name) => {
    this.setState({ [name]: true });
    if (name === "openInvoiceOCRModal") {
      this.invoiceOCRModalSettings()
    }
  };
  closeModal = (name) => {
    if (name === "openInvoiceOCRModal") {
      this.clearStates();
    }
    this.setState({ [name]: false });
  };
  clearStates = () => {
    this.setState({
      index: '', //to check which invoice ocr is going to update
      description: "",
      type: "",
      search: "",
      advancedList: [],
      clonedAdvancedList: [],
      addUpdateInvoiceOCR: '', //to check whether ocr going to update or insert
    })
  }
  handleChangeField = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }
  handleCheckBox = async (e, invOcr, index) => {
    let { invoiceOCRList, checkAll } = this.state;
    let { checked } = e.target;
    if (invOcr === "all") {
      if (checked) {
        invoiceOCRList.map((lst, i) => {
          lst.checked = true;
          return lst;
        });
      } else {
        invoiceOCRList.map((lst, i) => {
          lst.checked = false;
          return lst;
        });
      }
      checkAll = checked

    } else {
      if (checked) {
        invOcr.checked = checked;
        invoiceOCRList[index] = invOcr;

        let _check = invoiceOCRList.findIndex((lst) => lst.checked === false);
        if (_check === -1) {
          checkAll = true;
        }
      } else {
        invOcr.checked = checked;
        invoiceOCRList[index] = invOcr;
        checkAll = false
      }
    }
    this.setState({ checkAll, invoiceOCRList });

  };
  //advanced List
  handleValueOptions = async (type, val, item, index) => {
    let { advancedList, clonedAdvancedList } = this.state;
    let result = Helpers.handleValueOptions(type, val, item, index, advancedList, clonedAdvancedList)
    this.setState(result);
  };
  handleShowHiddenRows = async () => {
    let table = window.$("#invoiceocr-modal").DataTable()
    table.destroy()
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }), () => {

      let { showHiddenRows, advancedList, clonedAdvancedList } = this.state;
      if (showHiddenRows) {
        //show hidden rows
        advancedList = clonedAdvancedList
      } else {
        //hide again hidden rows
        let list = advancedList.filter((l) => !l.hide);
        advancedList = list
      }

      this.setState({ advancedList }, () => {
        this.invoiceOCRModalSettings()
      });

    });
  };
  handleHideUnhideRows = async (item) => {

    let { advancedList, clonedAdvancedList, showHiddenRows } = this.state;

    let result = Helpers.handleHideUnhideRows(
      item,
      "#invoiceocr-modal",
      "InvcOcrAdvList",
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
      this.invoiceOCRModalSettings()
    });

  };
  //end
  onSave = async () => {
    let {
      index,
      description,
      type,
      search,
      advancedList,
      clonedAdvancedList,
      invoiceOCRList,
      addUpdateInvoiceOCR
    } = this.state;

    if (addUpdateInvoiceOCR === "update") {
      //update case
      invoiceOCRList[index] = {
        description,
        type,
        search,
        advancedList: clonedAdvancedList
      }
    } else {
      //add case
      invoiceOCRList = [...invoiceOCRList, { description, type, search, advancedList }]
    }

    this.setState({
      isLoading: true
    })
    await this.props.updateInvoiceOCRList(invoiceOCRList);

    if (this.props.setup.updateInvoiceOCRListSuccess) {
      let table = window.$("#invoiceocrsetup").DataTable()

      if (addUpdateInvoiceOCR === "update") {
        //update invoice ocr case

        this.setState({
          invoiceOCRList
        }, () => {
          table
            .row(index)
            .invalidate('dom')
            .draw(false);
        })
      } else {
        //add invoice ocr case
        table.colReorder.reset();
        table.destroy()

        this.setState({
          invoiceOCRList
        }, () => {
          this.tableSetting()
        })
      }
      this.closeModal("openInvoiceOCRModal");
    }

    if (this.props.setup.updateInvoiceOCRListError) {
      Helpers.handleAPIErr(this.props.setup.updateInvoiceOCRListError, this.props);

    }
    this.props.clearSetupStates();
    this.setState({
      isLoading: false
    })
  }

  render() {
    let { invoiceOCRList } = this.state;

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
              <h2>invoice ocr setup</h2>
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
                  learn how to use invoice ocr setup Read our{" "}
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
                    onClick={this.primeInvoiceOCR}
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
                    onClick={this.deleteInvoiceOCR}
                    className="btn user_setup_rbtns" type="button">
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
                id="invoiceocrsetup"
                className=" user_setup_table"
                width="100%"
              >
                <thead>
                  <tr>
                    <th>
                      <div className="custom-radio">
                        <label
                          className="check_main remember_check"
                          htmlFor='checkAll'
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id='checkAll'
                            name={"checkAll"}
                            checked={this.state.checkAll}
                            onChange={(event) =>
                              this.handleCheckBox(event, 'all')
                            }
                          />
                          <span className="click_checkmark global_checkmark"></span>
                        </label>
                      </div>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Type</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Search fields</span>
                    </th>
                    <th>
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
                  {invoiceOCRList.length > 0
                    ? invoiceOCRList.map((obj, i) => {
                      return (
                        <tr className='cursorPointer' onClick={(e) => this.getInvoiceOCR(obj, i, e)}>
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
                                  checked={obj.checked}
                                  onChange={(event) =>
                                    this.handleCheckBox(event, obj, i)
                                  }
                                />
                                <span className="click_checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td>{obj.description}</td>
                          <td>{obj.type}</td>
                          <td>{obj.search}</td>
                          <td></td>
                        </tr>
                      )
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
        <InvoiceOCR
          openInvoiceOCRModal={this.state.openInvoiceOCRModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          handleChangeField={this.handleChangeField}
          handleValueOptions={this.handleValueOptions}
          handleShowHiddenRows={this.handleShowHiddenRows}
          handleHideUnhideRows={this.handleHideUnhideRows}
          state={this.state}
          onSave={this.onSave}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  setup: state.setup
});
export default connect(mapStateToProps, {
  primeInvoiceOCR: SetupAction.primeInvoiceOCR,
  getInvoiceOCRList: SetupAction.getInvoiceOCRList,
  updateInvoiceOCRList: SetupAction.updateInvoiceOCRList,
  clearSetupStates: SetupAction.clearSetupStates
})(InvoiceOcrSetup);
