import React, { Component } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

class Project extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openProjectModal}
          onHide={() => this.props.closeModal("openProjectModal")}
          className="forgot_email_modal modal_555 mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid ">
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">Project</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12 pl-md-0">
                            <div className="table_search">
                              <div className="row">
                                <div className="col input-group">
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <img
                                        src="images/search-black.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    aria-label="What are you looking for"
                                    aria-describedby="basic-addon1"
                                  />
                                </div>
                                <div className="col-auto p-md-0 align-self-center">
                                  <button className="search_btn">Search</button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 mb-2">
                            <div className="forgot_header">
                              <div className="modal-top-header">
                                <div className="row">
                                  <div className="col d-flex justify-content-end s-c-main">
                                    <button type="button" className="btn-save">
                                      <img
                                        src="images/plus.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-save ml-2"
                                    >
                                      <img
                                        src="images/refresh.png"
                                        className="mx-auto"
                                        alt="search-icon"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="login_form">
                              <div className="login_table_list">
                                <table className="table table-hover project_table">
                                  <thead>
                                    <tr>
                                      <th scope="col">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input
                                              type="checkbox"
                                              id="remember"
                                            />
                                            <label htmlFor="remember">
                                              Projects{" "}
                                              <i className="fa fa-angle-down"></i>
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item1" />
                                            <label htmlFor="item1">
                                              {" "}
                                              Wanted 3
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item2" />
                                            <label htmlFor="item2">
                                              {" "}
                                              Celebrity 2
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item3" />
                                            <label htmlFor="item3">
                                              {" "}
                                              Master Cheff
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item4" />
                                            <label htmlFor="item4"> Dora</label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item5" />
                                            <label htmlFor="item5">
                                              {" "}
                                              Sherlock
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item6" />
                                            <label htmlFor="item6">
                                              {" "}
                                              Distribution
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item7" />
                                            <label htmlFor="item7">
                                              {" "}
                                              Wanted 3
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                    <tr>
                                      <th scope="row">
                                        <div className="col align-self-center">
                                          <div className="form-group remember_check">
                                            <input type="checkbox" id="item8" />
                                            <label htmlFor="item8">
                                              {" "}
                                              Celebrity 2
                                            </label>
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_header mb-md-3">
                        <div className="modal-top-header">
                          <div className="row">
                            <div className="col d-flex justify-content-start s-c-main">
                              <button
                                onClick={() =>
                                  this.props.closeModal("openChartSortModal")
                                }
                                type="button"
                                className="btn-save ml-2"
                              >
                                <span className="fa fa-check"></span>
                                Select
                              </button>
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

export default Project;
