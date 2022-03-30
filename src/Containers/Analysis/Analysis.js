import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

class Analysis extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,

      show: false
    };
  }

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} />
          {/* end */}
          <div className="container-fluid p_relative">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <div className="row">
              <div className="col-12 p-0">
                <div className="analysis-btn">
                  <button
                    type="submit"
                    className="btn btn-primary analysis_blue float-left"
                  >
                    New Analysis
                  </button>
                  <Link to="/login">
                    <button
                      type="submit"
                      className="btn btn-primary analysis_white float-right"
                    >
                      Manage data
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis gallery tags Start  */}

          <div className="analysis_tabs_ful">
            <div className="container pb-5">
              <div className="analysis_tab_main">
                <ul className="nav nav-tabs text-center">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      data-toggle="tab"
                      to="#home"
                    >
                      All Analyses
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-toggle="tab" to="#menu1">
                      All dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" data-toggle="tab" to="#menu2">
                      Tutorial videos
                    </Link>
                  </li>
                </ul>

                <div className="tab-content">
                  <div className="tab-pane container active" id="home">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />
                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>
                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-2.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>
                                  <p>Updated a month ago</p>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane container fade" id="menu1">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>
                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-2.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>
                                  <p>Updated a month ago</p>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane container fade" id="menu2">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>
                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-2.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Sales Pipeline analysis
                                  </h6>
                                  <p>Updated a month ago</p>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-1.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="analysis_card_ful">
                          <div className="card">
                            <img
                              className="card-img-top analysis_crd_img"
                              src="images/graph-3.jpg"
                              alt="graph"
                            />

                            <div className="row">
                              <div className="col">
                                <div className="card-body">
                                  <h6 className="card-title ">
                                    Business Review Analysis
                                  </h6>

                                  <Link
                                    to="#"
                                    className="btn btn-primary analysis_crd_btn"
                                  >
                                    SAMPLE
                                  </Link>
                                </div>
                              </div>
                              <div className="col-auto">
                                <Dropdown
                                  alignRight={false}
                                  drop="up"
                                  className="analysis-card-dropdwn"
                                >
                                  <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item to="#/action-1">
                                      Action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-2">
                                      Another action
                                    </Dropdown.Item>
                                    <Dropdown.Item to="#/action-3">
                                      Something else
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis gallerry tags end  */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, {})(Analysis);
