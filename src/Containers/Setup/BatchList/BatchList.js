import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./BatchList.css";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import * as SetupAction from "../../../Actions/SetupRequest/SetupAction";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import Filter from '../Filter/Filter'
import {
  tableSetting,
  handleSaveSettings,
  handleCloseSettingModal,
  handleAPIErr,
  filterBox
} from '../../../Utils/Helpers'
import { toast } from "react-toastify";
class BatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSettingsModal: false,
      isLoading: false,
      BatchList: [],
      columns: [],
      batchNo: null,
      description: "",
      type: "",
      notes: "",
      batchCode: "",
      pageLength: 10,
    };
  }
  componentDidMount() {
    //show/hide filter card jquery
    filterBox('batchlist')
    this.getBtachList();
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
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  tableSetting = () => {
    let { columns } = this.state;
    let aoColumns = []

    //adding the column names
    aoColumns[0] = { sName: "checkbox" };
    aoColumns[1] = { sName: "Batch" };
    aoColumns[2] = { sName: "Description" };
    aoColumns[3] = { sName: "Type" };
    aoColumns[4] = { sName: "Notes" };
    aoColumns[5] = { sName: 'menus' }

    let result = tableSetting(columns, aoColumns, 'batchlist')
    this.setState({ ...result })
  }

  getBtachList = async () => {
    this.setState({ isLoading: true });
    await this.props.getBtachList();
    if (this.props.setup.getBatchListSuccess) {
      let list = JSON.parse(JSON.stringify(this.props.setup.getBatchList));

      let columns = []

      //adding the column names
      columns[0] = { name: 'Batch' }
      columns[1] = { name: 'Description' }
      columns[2] = { name: 'Type' }
      columns[3] = { name: 'Notes' }

      await this.setState({ BatchList: list, columns }, () => {
        this.tableSetting();
      });
    }
    if (this.props.setup.getBatchListError) {
      handleAPIErr(this.props.setup.getBatchListError, this.props);
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
    handleSaveSettings(columns, 'batchlist', pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = () => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, 'batchlist')
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  clearState = () => {
    this.setState({
      batchNo: null,
      description: "",
      type: "",
      notes: "",
      batchCode: "",
    });
  };
  addRow = () => {
    let batch = { batchNo: null, description: "", type: "", notes: "" };
    this.setState({ BatchList: [...this.state.BatchList, batch] });
  };
  insertBatch = async (event) => {
    if (event.target.value === "" || event.target.value === null) {
      toast.error("Enter a valid value.")
    }
    else {
      await this.setState({
        isLoading: true,
        batchNo: event.target.value,
        description: "",
        type: "",
        notes: "",
      });
      let { batchNo, description, type, notes } = this.state;
      let data = {
        batch: {
          batchNo,
          description,
          type,
          notes,
        },
      };
      await this.props.insertBatch(data);

      if (this.props.setup.insertBatchSuccess) {
        toast.success(this.props.setup.insertBatchSuccess);
        window.location.reload();
      }
      if (this.props.setup.insertBatchError) {
        handleAPIErr(this.props.setup.insertBatchError, this.props);
      }
      this.props.clearSetupStates();
      this.setState({
        isLoading: false,
        batchNo: null,
        description: "",
        type: "",
        notes: "",
      });
    }
  };
  handleCheckbox = (event, code) => {
    if (event.target.checked) {
      this.setState({ batchCode: code });
    } else {
      this.setState({ batchCode: "" });
    }
  };
  deletebatch = async () => {
    let { batchCode, BatchList } = this.state;
    if (batchCode) {
      this.setState({ isLoading: true });
      await this.props.deletebatch(batchCode);
      if (this.props.setup.deleteBatchSuccess) {
        toast.success("Batch Deleted Successfully");
        let table = window.$("#batchlist").DataTable();

        let index = BatchList.findIndex((c) => c.batchNo === batchCode);

        let filtersList = BatchList.filter((c) => c.batchNo !== batchCode);
        let data = filtersList;
        this.setState(
          {
            BatchList: data,
            batchCode: "",
          },
          () => {
            table.row(index).remove().draw(false); //also update table
          }
        );
      }

      if (this.props.setup.deleteBatchError) {
        handleAPIErr(this.props.setup.deleteBatchError, this.props);
      }

      this.props.clearSetupStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Batch First!");
    }
    this.clearState();
  };
  updateBatch = async (e, obj, key) => {
    let { value, defaultValue } = e.target;
    if (value === defaultValue) return;

    let batchNo;
    let description;
    let type;
    let notes;
    let { BatchList } = this.state;
    if (key === "Description") {
      batchNo = obj.batchNo;
      description = value;
      type = obj.type;
      notes = obj.notes;
    } else if (key === "Notes") {
      batchNo = obj.batchNo;
      description = obj.description;
      type = obj.type;
      notes = value;
    } else if (key === "Type") {
      batchNo = obj.batchNo;
      description = obj.description;
      type = value;
      notes = obj.notes;
    }
    this.setState({ isLoading: true });
    let data = {
      batch: {
        batchNo,
        description,
        type,
        notes,
      },
    };
    await this.props.updateBatch(data);
    if (this.props.setup.updateBatchSuccess) {
      toast.success("Batch Updated Successfully.");

      let found = BatchList.findIndex((c) => c.batchNo === obj.batchNo);
      if (found != -1) {
        let table = window.$("#batchlist").DataTable();

        BatchList[found] = data.batch;

        this.setState(
          {
            BatchList: [...BatchList],
          },
          () => {
            table.row(found).invalidate("dom").draw();
          }
        );
      }
    }

    if (this.props.setup.updateBatchError) {
      handleAPIErr(this.props.setup.updateBatchError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };
  render() {
    let { batchCode } = this.state;
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
              <h2>Batch List</h2>
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
                  learn how to use batch list Read our{" "}
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
                    <span className="round_plus" onClick={this.addRow}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </span>
                  </button>
                </li>
                <li>
                  <button className="btn user_setup_rbtns" type="button">
                    <span className="round_file" onClick={this.deletebatch}>
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
              <table id="batchlist" className=" user_setup_table" width="100%">
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
                      <span className="user_setup_hed">+Bach</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">Description</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">type</span>
                    </th>
                    <th>
                      <span className="user_setup_hed">notes</span>
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
                  {this.state.BatchList.map((obj, i) => {
                    return (
                      <tr key={obj.batchNo}>
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
                                name={"batchListCheck"}
                                checked={obj.batchNo === batchCode}
                                onChange={(event) =>
                                  this.handleCheckbox(event, obj.batchNo)
                                }
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </td>
                        {obj.batchNo !== null ? (
                          <>
                            <td>{obj.batchNo}</td>
                            <td>
                              <input
                                type="text"
                                style={{ border: "0px" }}
                                defaultValue={obj.description}
                                onBlur={(event) =>
                                  this.updateBatch(event, obj, "Description")
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                style={{ border: "0px" }}
                                defaultValue={obj.type}
                                onBlur={(event) =>
                                  this.updateBatch(event, obj, "Type")
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="text"
                                style={{ border: "0px" }}
                                defaultValue={obj.notes}
                                onBlur={(event) =>
                                  this.updateBatch(event, obj, "Notes")
                                }
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <input className='custm-icons'
                                type="number"
                                style={{ border: "0px" }}
                                defaultValue={obj.batchNo}
                                onBlur={(event) => this.insertBatch(event)}
                              />
                            </td>

                            <td>{obj.description}</td>
                            <td>{obj.type}</td>
                            <td>{obj.notes}</td>
                          </>
                        )}
                        <td>
                        </td>
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


      </>
    );
  }
}

const mapStateToProps = (state) => ({ setup: state.setup });
export default connect(mapStateToProps, {
  getBtachList: SetupAction.getBtachList,
  insertBatch: SetupAction.insertBatch,
  deletebatch: SetupAction.deleteBatch,
  updateBatch: SetupAction.updateBatch,
  clearSetupStates: SetupAction.clearSetupStates,
})(BatchList);
