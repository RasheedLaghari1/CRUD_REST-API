import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";

import { connect } from "react-redux";

class PastReceivedOrder extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,

      // dropdown coding
      selected: [],
      options: [
        { label: "100%", value: 1 },
        { label: "75%", value: 2 },
        { label: "50%", value: 3 },
        { label: "25%", value: 4 }
      ],
      aprove: [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 }
      ],
      sub: [
        { label: "Sub", value: 1 },
        { label: "No", value: 2 }
      ]
      // dropdown coding end
    };
  }

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} pastReceivedOrder={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section id="" className="supplier">
              <div className="body_content ordermain-padi shadow-none">
                <div className="container-fluid ">
                  <div className="main_wrapper ">
                    <div className="img-section-t col-12 pl-0 pr-0">
                      {/* <img src="images/image6.png" className=" img-fluid" alt="user" />  */}

                      <div className="container p-0">
                        <div className="row">
                          <div className=" col-12 col-sm-12 col-md-12">
                            <div className="">
                              <div className="row">
                                <div className="col-12">
                                  <div className="col-12 mb-1">
                                    <div className="forgot_header">
                                      <div className="modal-top-header">
                                        <div className="row">
                                          <div className=" p-md-0 col-md-8 col-lg-4 col-sm-12">
                                            <div className="table_search">
                                              <div className="row">
                                                <div className="col p-0 input-group">
                                                  <div className="input-group-prepend">
                                                    <span
                                                      className="input-group-text"
                                                      id="basic-addon1"
                                                    >
                                                      <img
                                                        src="images/search-icon.png"
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
                                                <div className="col-auto pr-0 align-self-center">
                                                  <button className="search_btn">
                                                    Search
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-4 col-lg-8 col-sm-12 s-c-main align-self-center pr-md-0">
                                            <Dropdown
                                              alignRight={true}
                                              drop="down"
                                              className="analysis-card-dropdwn float-right"
                                            >
                                              <Dropdown.Toggle
                                                variant="sucess"
                                                id="dropdown-basic"
                                                className="p-0 pt-2 mr-0"
                                              >
                                                <img
                                                  src="images/order-option.png"
                                                  className=" img-fluid"
                                                  alt="user"
                                                />
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item
                                                  to="#/action-1"
                                                  className="f-20"
                                                >
                                                  {" "}
                                                  <img
                                                    src="images/downlod.png"
                                                    className="w-15"
                                                    alt="search-icon"
                                                  />{" "}
                                                  Export
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                  to="#/action-2"
                                                  className="f-20"
                                                >
                                                  <img
                                                    src="images/downlod.png"
                                                    className="w-15"
                                                    alt="search-icon"
                                                  />{" "}
                                                  Import
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                            <img
                                              src="images/order-refresh.png"
                                              className="float-right img-fluid pt-2 mr-2"
                                              alt="search-icon"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="login_table_list table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th scope="col"> Delivery Date</th>
                                          <th scope="col">Delivery Number</th>
                                          <th
                                            scope="col"
                                            width="40%"
                                            className="text-left"
                                          >
                                            Comments
                                          </th>
                                          <th scope="col"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <Link to="/edit-received-order">
                                              <img
                                                src="images/pencill.png"
                                                className="import_icon float-left mr-1"
                                                alt="pencill"
                                              />
                                            </Link>
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th scope="row"> 20/06/2016 </th>

                                          <td> 34 </td>
                                          <td className="text-left">
                                            Fully Received{" "}
                                          </td>
                                          <td>
                                            <img
                                              src="images/pencill.png"
                                              className="import_icon float-left mr-1"
                                              alt="pencill"
                                            />
                                            <img
                                              src="images/delete.png"
                                              className="import_icon float-right ml-1"
                                              alt="delete"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
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
                </div>
              </div>
            </section>
          </div>
          {/* end */}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, {})(PastReceivedOrder);
