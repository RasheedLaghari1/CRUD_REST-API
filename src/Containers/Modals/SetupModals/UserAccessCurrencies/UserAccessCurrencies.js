import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./UserAccessCurrencies.css";
const $ = require("jquery");
// const dt = require("datatables.net");
class UserAccess extends Component {
  constructor() {
    super();
    this.state = {
      AccessControls: "",
      AccessRights: [],
      accessAll: [],
    };
  }

  selectedAllCheck() {
    //console.log("accessAll",this.state.accessAll);
    $.each(this.state.accessAll, function (i, el) {
      $("#accessAll" + i).prop("checked", el);
      //console.log('#accessAll'+i, el);
    });
  }

  selectAll = (id, pIndex) => async (event) => {
    var table = $(id);
    $("td input:checkbox", table).prop("checked", event.target.checked);
  };

  handleChange = async (event) => {};

  renderAccessControls(access, pindex) {
    var AccessControlsHtml = "";
    AccessControlsHtml = [
      "Access",
      "Insert",
      "Change",
      "Delete",
      "Reports",
      "Excel",
    ].map((Control, i) => {
      if (access[i] === "0") {
        this.state.accessAll[pindex] = false;
      }
      return (
        <tr key={i}>
          <td></td>
          <td className="pl-0">
            <label className=" my-checkbox">
              <div className="custom-radio">
                <label className="check_main remember_check">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    onClick={this.handleChange}
                    data-pindex={pindex}
                    data-index={i}
                  />
                  <span className="click_checkmark"></span>
                  {Control}
                </label>
              </div>
              {/* <label>{"Control"}</label>
              <input
                type="checkbox"
                // defaultChecked={access[i] === "1" ? 1 : 0}
                onClick={this.handleChange}
                data-pindex={pindex}
                data-index={i}
              />{" "}
              <span className="checkmark"></span> */}
            </label>
          </td>
          <td></td>
        </tr>
      );
    });
    return AccessControlsHtml;
  }

  renderAccessRights() {
    var AccessRightsHtml = "";
    this.state["accessAll"] = [];
    AccessRightsHtml = ["User 1", "User 2", "User 3"].map((Access, i) => {
      this.state.accessAll[i] = true;
      return (
        <tr key={i}>
          <td colspan="3" className="pl-0 pr-0">
            <table className="table child-table">
              <tr>
                <td>
                  <p> {Access}</p>
                </td>
                <td>
                  <div className="custom-radio">
                    <label className="check_main remember_check my-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        onClick={this.selectAll("#accessAllTbl" + i, i)}
                      />
                      <span className="click_checkmark"></span>
                    </label>
                  </div>
                </td>
                <td className="main-click">
                  <img
                    src="images/user-setup/arrow_down.png"
                    className="img-fluid"
                    alt=""
                  />
                </td>
              </tr>
              <tr className="child-click">
                <td colspan="3">
                  <table
                    className="table child-table children"
                    id={"accessAllTbl" + i}
                  >
                    {this.renderAccessControls("Access.access", i)}
                  </table>
                </td>
                <td style={{ display: "none" }}></td>
                <td style={{ display: "none" }}></td>
              </tr>
            </table>
          </td>
          <td style={{ display: "none" }}></td>
          <td style={{ display: "none" }}></td>
        </tr>
      );
    });

    return AccessRightsHtml;
  }

  render() {
    return (
      <>
        <Modal
          size="lg"
          // aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openUserAccessModal}
          onHide={() => this.props.closeModal("openUserAccessModal")}
          className="modal_user_access mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid p-0">
              <div className="main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center">
                    <div className="user_access_main ">
                      <div className="setting_header thead_bg">
                        <h3 className="Indirecttaxcode-poup_heading">
                          User Access
                        </h3>
                        <div className="Indirecttaxcode-poup_can-sav-btn">
                          <button className="btn can-btn1">
                            <img
                              src="images/user-setup/check-white.png"
                              alt="check"
                            />
                            Save
                          </button>
                          <button
                            onClick={() =>
                              this.props.closeModal("openUserAccessModal")
                            }
                            className="btn can-btn1 pl-3"
                          >
                            <img
                              src="images/user-setup/cancel-white.png"
                              alt="cancel"
                            />
                            Cancel
                          </button>
                          <button className="btn can-btn1 pl-2">
                            <img
                              src="images/user-setup/dots-h.png"
                              alt="dots"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="user_access_body">
                        <div className="main-sec">
                          <div className="col-sm-12 user_access_inner table_white_box">
                            <div className="table-responsive">
                              <div className="user_setup_plus_Icons"></div>
                              <table
                                id="access_modal"
                                className="table dt-responsive nowrap data-table-d mt-50"
                              >
                                <thead className="thead_bg">
                                  <tr>
                                    <th>
                                      <span className="hed">Operator Name</span>
                                    </th>
                                    <th>
                                      <span className="hed">Access</span>
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>{this.renderAccessRights()}</tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default UserAccess;
