import React, { Component } from "react";
import { Link } from "react-router-dom";
class filter extends Component {
  constructor() {
    super();
    this.state = {
      filter_dropdpwn2: false,
    };
  }

  render() {
    return (
      <>
        {console.log("running in user steup")}
        <div className="">
          <div id="filter_dropdpwn1">
            <div className="filter_dropdpwn1_toparea">
              <div className="col-sm-12 p-0">
                <h2>
                  Active Filters
                  <span
                    onClick={() =>
                      this.setState({
                        // filter_dropdpwn1: false,
                        filter_dropdpwn2: false,
                      })
                    }
                    className="float-right pr-2 pop-cros-1 pop-cros-1_sass"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <img
                                        onClick={() =>
                                            this.setState({
                                                filter_dropdpwn1: false,
                                                filter_dropdpwn2: false,
                                            })
                                        }
                                        src="images/cross.png"
                                        alt=""
                                        className="float-right pr-2 pop-cros-1"
                                    /> */}
                </h2>
              </div>

              <div className="clear"></div>
              <div className="col-sm-12 p-0 filter_table_1">
                <p className="nofilter">
                  No filters active applied to this view
                </p>
              </div>
            </div>
            <div className="clear20"></div>
            <div className="col-sm-12 p-0 active_filters">
              <h2>Active Filters</h2>
              <div className="save-filter save-filter_sass">
                <Link to="#">Save filter</Link>
              </div>
              <ul className="active_filter_list">
                <li>
                  <span>
                    <span className="pop-cros-1_sass">
                      <svg
                        style={{ paddingBottom: "3px" }}
                        height="20px"
                        viewBox="0 0 24 24"
                        width="18px"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </span>
                    {/* <img src="images/close-icon-gray.png" alt="close" /> */}
                  </span>
                  Kp test
                </li>
                <li>
                  <span className="pop-cros-1_sass">
                    <svg
                      style={{ paddingBottom: "3px" }}
                      height="20px"
                      viewBox="0 0 24 24"
                      width="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <img src="images/close-icon-gray.png" alt="close" /> */}s
                </li>
              </ul>
            </div>
            <div className="col-sm-12 active_filters_table2"></div>
            <div className="clear"></div>
            <div className="col-sm-12 p-0 active_filters">
              <h2>Workspace Filters</h2>
              <div className="save-filter save-filter_sass">
                <Link to="#">Save filter</Link>
              </div>
              <ul className="active_filter_list">
                <li>
                  <span className="pop-cros-1_sass">
                    <svg
                      style={{ paddingBottom: "3px" }}
                      height="20px"
                      viewBox="0 0 24 24"
                      width="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <span>
                                        <img src="images/close-icon-gray.png" alt="close" />
                                    </span> */}
                  Kp test
                </li>
                <li>
                  <span className="pop-cros-1_sass">
                    <svg
                      style={{ paddingBottom: "3px" }}
                      height="20px"
                      viewBox="0 0 24 24"
                      width="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <span>
                    <img src="images/close-icon-gray.png" alt="close" />
                  </span> */}
                  s
                </li>
                <li>
                  <span className="pop-cros-1_sass">
                    <svg
                      style={{ paddingBottom: "3px" }}
                      height="20px"
                      viewBox="0 0 24 24"
                      width="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <span>
                    <img src="images/close-icon-gray.png" alt="close" />
                  </span> */}
                  Kp test
                </li>
                <li>
                  <span className="pop-cros-1_sass">
                    <svg
                      style={{ paddingBottom: "3px" }}
                      height="20px"
                      viewBox="0 0 24 24"
                      width="18px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </span>
                  {/* <span>
                    <img src="images/close-icon-gray.png" alt="close" />
                  </span> */}
                  s
                </li>
              </ul>
            </div>
            <div className="clear10"></div>
            <div>
              <button className="ml-2 clear-filter clear-filter_sass">
                Clear
              </button>

              <div className="pull-right plus_icon-filter_bottom">
                <button
                  onClick={() => this.setState({ filter_dropdpwn2: true })}
                  // onClick={this.primeUser}
                  className="btn user_setup_rbtns"
                  type="button"
                >
                  <span
                    className="round_plus round_plus_sass "
                    style={{
                      display: "flex",
                      width: "22px",
                      height: "22px",
                      alignItems: "center",

                      // background: "var(--user-setup-bg-color)",
                      borderRadius: "50%",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      fill="white"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="14px"
                      height="14px"
                      viewBox="0 0 349.03 349.031"
                    >
                      <g>
                        <path
                          d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
		                          c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
		                          h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
		                          C344.97,132.147,349.03,136.213,349.03,141.226z"
                        />
                      </g>
                    </svg>
                    {/* <i
                        className="fa fa-plus-circle round_plus_btn round_plus_btn_sass"
                        aria-hidden="true"
                      ></i> */}
                  </span>
                </button>
                {/* <img
                  onClick={() => this.setState({ filter_dropdpwn2: true })}
                  src="images/user-setup/plus_icon-filter_bottom.png"
                  alt=""
                /> */}
              </div>
            </div>
          </div>
          {/* ) : (
                        ''
                        )} */}
          {this.state.filter_dropdpwn2 ? (
            <div id="filter_dropdpwn2">
              <div className="filter_dropdpwn2_toparea p-0">
                <div className="col-sm-12 p-0">
                  <h2 className="pl-3 pt-3 pb-1">Add Filters</h2>
                  <div className="can-sav-btn can-sav-btn_sass">
                    <button className="btn can-btn1 can-btn1_sass ">
                      <span className="tick_sass">
                        <svg
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          height="18px"
                          width="29px"
                        >
                          <g>
                            <g>
                              <path
                                d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
			c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
			C514.5,101.703,514.499,85.494,504.502,75.496z"
                              />
                            </g>
                          </g>
                        </svg>
                      </span>
                      Save
                    </button>
                    <button
                      onClick={() => this.setState({ filter_dropdpwn2: false })}
                      className="btn can-btn1 pl-3"
                    >
                      <span
                        className="tick_sass"
                        style={{ paddingRight: "8px" }}
                      >
                        <svg
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          viewBox="0 0 50 50"
                          height="18px"
                          width="18px"
                        >
                          <g>
                            <path
                              d="M25,0C11.215,0,0,11.215,0,25s11.215,25,25,25s25-11.215,25-25S38.785,0,25,0z M38.059,41.409
		C34.471,44.273,29.938,46,25,46C13.421,46,4,36.579,4,25c0-4.703,1.555-9.05,4.177-12.554c0.33-0.442,0.939-0.475,1.335-0.09
		L38.107,40.07C38.504,40.455,38.488,41.064,38.059,41.409z M42.164,37.052c-0.318,0.451-0.917,0.492-1.312,0.107L12.338,9.524
		c-0.396-0.385-0.374-0.984,0.067-1.316C15.916,5.567,20.278,4,25,4c11.579,0,21,9.421,21,21C46,29.486,44.572,33.639,42.164,37.052
		z"
                            />
                          </g>
                        </svg>
                      </span>
                      Cancel
                    </button>
                  </div>
                  {/* <div className="can-sav-btn">
                    <button className="btn can-btn1">
                      <img src="images/save-check.png" alt="check"></img>
                      Save
                    </button>
                                   
                    <button
                      onClick={() => this.setState({ filter_dropdpwn2: false })}
                      className="btn can-btn1 pl-3"
                    >
                      <img src="images/cancel.png" alt="check"></img>Cancel
                    </button>
                  </div> */}
                  <hr />
                </div>
                <div className="row pb-30">
                  <div className="col sec-pop pr-0">
                    <ul>
                      <li className="">Code</li>
                      <li className="">Description</li>
                      <li className="">Budgeted</li>
                      <li className="">Current</li>
                      <li className="">Rate Date</li>
                    </ul>
                  </div>
                  <div className="col sec-pop pl-0 pr-0 ">
                    <ul className="pr-0">
                      <li className="">Contains</li>
                      <li className="">Doesn't contain</li>
                      <li className="">Equal</li>
                      <li className="">Not Equal</li>
                      <li className="">Startswith</li>
                      <li className="">Over</li>
                      <li className="">Under</li>
                      <li className="">Over Equal</li>
                      <li className="">Under Equal</li>
                    </ul>
                  </div>
                  <div className="col sec-pop1 pl-0">
                    <ul>
                      <li className="border-bottom">
                        <div className="">
                          <input
                            placeholder="Value"
                            type="text"
                            className="cus-in"
                            name="filterValue"
                          />
                        </div>
                        {/* <div className="p-1" contentEditable="true">
                                                    Value
                                                    </div> */}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="clear10"></div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="clear10"></div>
        </div>
      </>
    );
  }
}

export default filter;
