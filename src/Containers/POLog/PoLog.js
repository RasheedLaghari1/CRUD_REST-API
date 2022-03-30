// This page is converted into Modal and it is not in use
import React, { Component } from "react";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";

class ReceivedOrder extends Component {
  constructor() {
    super();
    this.state = {
      POLog: [],
    };
  }

  async componentDidMount() {
    let state =
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.state;

    if (state && state.poLogs) {
      let POLog = this.props.history.location.state.poLogs;
      this.setState({ POLog });
    } else {
      if (state && state.invoice) {
        this.props.history.push("/invoice");
      } else {
        this.props.history.push("/order");
      }
    }
  }

  render() {
    return (
      <>
        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} poLog={true} />
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

                      <div className="w-90-per mx-auto">
                        <div className="row">
                          <div className=" col-12 col-sm-12 col-md-12">
                            <div className="">
                              <div className="row">
                                <div className="col-12">
                                  <div className="mt-4">
                                    <div className="login_table_list table-responsive">
                                      <table className="table received-t po_log_table">
                                        <thead>
                                          <tr>
                                            <th scope="col">Detail</th>
                                            <th scope="col">
                                              Line{" "}
                                              <i className="fa fa-angle-down"></i>
                                            </th>
                                            <th scope="col">Vendor</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Chart Sort</th>
                                            <th scope="col">Chart Code</th>
                                            <th scope="col">Tax Code</th>
                                            <th scope="col">Tracking Code</th>
                                            <th scope="col">User</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {this.state.POLog.map((log, i) => {
                                            return (
                                              <>
                                                <tr>
                                                  <th scope="row">
                                                    <img
                                                      src="images/angle-down.png"
                                                      className="down_data"
                                                      // data-target="#down_info"
                                                      data-toggle="collapse"
                                                      data-target={"#abc" + i}
                                                      alt="toggle-down"
                                                    />
                                                  </th>
                                                  <td className="text-left">
                                                    {log.line}
                                                  </td>
                                                  <td>N/A</td>
                                                  <td>{log.amount}</td>
                                                  <td>{log.status}</td>
                                                  <td>{log.description}</td>
                                                  <td>{log.chartSort}</td>
                                                  <td>{log.chartCode}</td>
                                                  <td>{log.taxCode}</td>
                                                  <td>{log.trackingCode}</td>
                                                  <td>{log.userName}</td>
                                                </tr>
                                                <tr
                                                  className="collapse"
                                                  id={"abc" + i}
                                                >
                                                  <td
                                                    colSpan="11"
                                                    className="border-0 px-5"
                                                  >
                                                    <div className="login_table_list table-responsive">
                                                      <table className="table table-hover table_gray_bg project_table shadow-none border">
                                                        <thead>
                                                          <tr>
                                                            <th scope="col">
                                                              Line{" "}
                                                              <i className="fa fa-angle-down"></i>
                                                            </th>
                                                            <th scope="col">
                                                              Vendor
                                                            </th>
                                                            <th scope="col">
                                                              Amount
                                                            </th>
                                                            <th scope="col">
                                                              Status
                                                            </th>
                                                            <th scope="col">
                                                              Description
                                                            </th>
                                                            <th scope="col">
                                                              Chart Sort
                                                            </th>
                                                            <th scope="col">
                                                              Chart Code
                                                            </th>
                                                            <th scope="col">
                                                              Tax Code
                                                            </th>
                                                            <th scope="col">
                                                              Tracking Code
                                                            </th>
                                                            <th scope="col">
                                                              User
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>
                                                          <tr>
                                                            <td className="text-left">
                                                              {log.line}
                                                            </td>
                                                            <td>N/A</td>
                                                            <td>
                                                              {" "}
                                                              <td>
                                                                {log.amount}
                                                              </td>
                                                            </td>
                                                            <td>
                                                              {log.status}
                                                            </td>
                                                            <td>
                                                              {log.description}
                                                            </td>
                                                            <td>
                                                              {log.chartSort}
                                                            </td>
                                                            <td>
                                                              {log.chartCode}
                                                            </td>
                                                            <td>
                                                              {log.taxCode}
                                                            </td>
                                                            <td>
                                                              {log.trackingCode}
                                                            </td>
                                                            <td>
                                                              {log.userName}
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          })}
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
              </div>
            </section>
          </div>
          {/* end */}
        </div>
      </>
    );
  }
}

export default ReceivedOrder;
