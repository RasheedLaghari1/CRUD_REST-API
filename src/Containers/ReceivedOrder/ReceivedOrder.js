import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";

class ReceivedOrder extends Component {
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
        { label: "25%", value: 4 },
      ],
      aprove: [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 },
      ],
      sub: [
        { label: "Sub", value: 1 },
        { label: "No", value: 2 },
      ],
      startDate: new Date(),
      // dropdown coding end
    };
  }

  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} receivedOrder={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section id="" className="supplier">
              <div className="body_content ordermain-padi">
                <div className="container-fluid ">
                  <div className="main_wrapper ">
                    <div className="img-section-t col-12 pl-0 pr-0">
                      {/* <img src="images/image6.png" className=" img-fluid" alt="user" />  */}

                      <div className="container p-0">
                        <div className="row">
                          <div className=" col-12 col-sm-12 col-md-12">
                            <div className="">
                              <div className="col d-flex justify-content-end s-c-main">
                                <Link to="/past-received-order">
                                  <button type="button" className="btn-save">
                                    <span className="fa fa-check"></span>
                                    Past Orders
                                  </button>
                                </Link>
                                <Link to="/order">
                                  <button type="button" className="btn-save">
                                    <span className="fa fa-check"></span>Save
                                  </button>
                                </Link>
                                <Link to="/order">
                                  <button type="button" className="btn-save">
                                    <span className="fa fa-ban"></span>Cancel
                                  </button>
                                </Link>
                              </div>

                              <div className="row mt-3">
                                <div className="col-sm-6 ">
                                  <div className="row mt-sm-4 pt-sm-2">
                                    <div className=" col-12 col-sm-12 col-md-6 col-lg-4">
                                      <div className="form-group custon_select">
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Delivery Date"
                                            id="usr"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-12 col-sm-12 col-md-6 col-lg-8">
                                      <div className="form-group custon_select">
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Delivery Number"
                                            id="usr"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-12 col-sm-12 col-md-12">
                                      <div className="form-group custon_select">
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Comments"
                                            id="usr"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 ">
                                  <div className="col-12">
                                    <div className=" border-1 p-3 text-center">
                                      <img
                                        src="images/drag-file.png"
                                        className=" img-fluid"
                                        alt="user"
                                        href="#demo"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12 mt-md-4">
                                  <span className="del_notes">
                                    <i className="fa fa-times"></i>DelNotes1.pdf
                                  </span>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-12">
                                  <div className="mt-4">
                                    <div className="login_table_list table-responsive">
                                      <table className="table received-t">
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
                                                    Product Code
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <th scope="col">Description</th>
                                            <th scope="col">SKU</th>
                                            <th scope="col">Ordered</th>
                                            <th scope="col">
                                              Received to Date
                                            </th>
                                            <th scope="col">
                                              Received this Delivery
                                            </th>
                                            <th scope="col">Balance</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                          <tr>
                                            <th scope="row">
                                              <div className="col align-self-center">
                                                <div className="form-group remember_check">
                                                  <input
                                                    type="checkbox"
                                                    id="item1"
                                                  />
                                                  <label htmlFor="item1">
                                                    {" "}
                                                    8471.80NLR
                                                  </label>
                                                </div>
                                              </div>
                                            </th>
                                            <td className="text-left">
                                              {" "}
                                              SEA FREIGHT SYD / CA - 2 X 40'
                                              SHIPPING CONTAINER @ $AUD7,800.00
                                              PER CONTAINER{" "}
                                            </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 3 </td>
                                            <td> 2 </td>
                                            <td>
                                              {" "}
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="02344"
                                              />{" "}
                                            </td>
                                            <td> 2 </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <div className="txt-link text-right">
                                        <img
                                          src="images/tick.png"
                                          className="mr-2"
                                          alt="tick"
                                        />{" "}
                                        Fully Received
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
              </div>
            </section>
          </div>
          {/* end */}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(ReceivedOrder);
