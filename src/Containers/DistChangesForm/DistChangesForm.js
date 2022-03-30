import React, { Component } from "react";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";

class Distchangesform extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        {false ? <div className="se-pre-con"></div> : ""}
        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} distchangesform={true} />
          {/* end */}
          {/* body part */}
          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="container-fluid ">
                  <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center h-60vh">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad">
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main">
                                  <button
                                    type="button"
                                    className={
                                      this.state.id_save
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2236"
                                    id="id_save"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    onClick={() =>
                                      this.props.history.push("/dist-changes")
                                    }
                                  >
                                    <span className="fa fa-check"></span>
                                    Save
                                  </button>

                                  <button
                                    onClick={this.onCancel}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2237"
                                    id="id_cancel"
                                    onFocus={this.onFocus}
                                    onClick={() =>
                                      this.props.history.push("/dist-changes")
                                    }
                                  >
                                    <span className="fa fa-ban"></span>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* new table collapse start  */}
                            <div className="row">
                              <div className="col-12">
                                <div className="login_form">
                                  <div className="table-responsive">
                                    <table className="fold-table">
                                      <thead>
                                        <tr>
                                          <th width="5%">Chart Sort</th>
                                          <th width="5%">Chart Code</th>
                                          <th width="9%">Tracking Codes</th>
                                          <th width="20%">Description</th>
                                          <th width="10%">Date</th>
                                          <th width="5%">Amount</th>

                                          <th width="8%">Tran</th>
                                          <th width="8%">Line</th>

                                          <th width="3%"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="view">
                                          <td className="icon-th">
                                            <img
                                              src="images/angle-down.png"
                                              className="down_data"
                                              // data-target="#down_info"
                                              data-toggle="collapse"
                                              data-target="#asdf"
                                              alt="toggle-down"
                                            />
                                          </td>
                                          <td className="text-left">
                                            <div className="modal_input ">
                                              <input
                                                type="text"
                                                className="form-control"
                                              />
                                            </div>
                                          </td>
                                          <td className="text-left">
                                            <div className="modal_input ">
                                              <input
                                                type="text"
                                                className="form-control"
                                              />
                                            </div>
                                          </td>
                                          <td className="text-left">
                                            <div className="modal_input ">
                                              <input
                                                type="text"
                                                className="form-control"
                                              />
                                            </div>
                                          </td>
                                          <td className="text-left">
                                            <div className="modal_input ">
                                              <input
                                                type="text"
                                                className="form-control"
                                              />
                                            </div>
                                          </td>
                                          <td className="text-left">
                                            <div className="modal_input ">
                                              <input
                                                type="text"
                                                className="form-control"
                                              />
                                            </div>
                                          </td>
                                          <td>Tran</td>
                                          <td>Line121</td>

                                          <td>
                                            <img
                                              src="images/delete.svg"
                                              class=" invoice-delete-icon cursorPointer"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr className="fold collapse" id="asdf">
                                          <td
                                            colspan="12"
                                            style={{ padding: "0px" }}
                                          >
                                            <div className="fold-content">
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th
                                                      width="5%"
                                                      style={{
                                                        backgroundColor:
                                                          "transparent !important",
                                                      }}
                                                    ></th>
                                                    <th width="5%">
                                                      Chart Sort
                                                    </th>
                                                    <th width="5%">
                                                      Chart Code
                                                    </th>
                                                    <th width="9%">
                                                      Tracking Codes
                                                    </th>
                                                    <th width="20%">
                                                      Description
                                                    </th>
                                                    <th width="10%">Date</th>
                                                    <th width="5%">Amount</th>

                                                    <th width="8%">Tran</th>
                                                    <th width="8%">Line</th>

                                                    <th width="3%">
                                                      <img
                                                        src="images/plus.png"
                                                        class="cursorPointer img-fluid"
                                                        alt="user"
                                                      ></img>
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <span
                                                        style={{
                                                          visibility: "hidden",
                                                        }}
                                                      ></span>
                                                    </td>

                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>
                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>
                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>
                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>

                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>
                                                    <td className="text-left">
                                                      <div className="modal_input ">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                        />
                                                      </div>
                                                    </td>

                                                    <td>Tran</td>
                                                    <td>Line123</td>
                                                    <td>
                                                      <img
                                                        src="images/delete.svg"
                                                        class=" invoice-delete-icon cursorPointer"
                                                        alt="delete"
                                                      />
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* new table collapse end  */}
                            {/* New data end here  */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
          {/* end */}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Distchangesform);
