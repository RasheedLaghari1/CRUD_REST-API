import React, { Component, Fragment, createContext } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import $ from "jquery";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import Activity from "../Modals/Activity/Activity";
import Changes from "../Modals/Changes/Changes";
import Attachments from "../Modals/Attachments/Attachments";
import Comments from "../Modals/Comments/Comments";

import Dropdown from "react-bootstrap/Dropdown";
import Post from "../Modals/Post/Post";
import Import from "../Modals/Import/Import";
import Report from "../Modals/Report/Report";
import { options } from "../../Constants/Constants";

const uuidv1 = require("uuid/v1");

class DistChanges extends Component {
  constructor() {
    super();
    this.state = {
      toggleRightSidebar: true,

      poTallies: [
        {
          id: 1,
          type: "Draft",
          count: 227,
          percent: "10%",
        },
        {
          id: 12,
          type: "Pending",
          count: 2,
          percent: "30%",
        },
        {
          id: 3,
          type: "Declined",
          count: 11,
          percent: "40%",
        },
        {
          id: 4,
          type: "Approved",
          count: 25,
          percent: "50%",
        },
        {
          id: 5,
          type: "All",
          count: 265,
          percent: "1001%",
        },
      ],
      activePOTallis: 1,
      showPOTallisTabPane: "draft",
    };
  }

  async componentDidMount() {
    //right hand side bar setting with PO Image
    window.addEventListener(
      "resize",
      () => {
        $(".mm_ordr1").addClass("mm_order_pdfMain");

        if ($(window).width() > 991) {
          this.setState({ toggleRightSidebar: true });
        }
        if ($(window).width() <= 991) {
          this.setState({ toggleRightSidebar: false });
        }
      },
      false
    );
    // end

    //focus search input field by pressing Tab key
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 9) {
        evt.preventDefault();
        let id = document.getElementById("POListSearchId");
        if (id) {
          document.getElementById("POListSearchId").focus();
        }
      }
    };

    $(document).ready(function () {
      var vw = $(window).width();
      var nav = $(".navbar.fixed-top").height();
      var underNav = $(".order-tabs").height();
      var wh = $(window).height();
      var h = wh - nav - 60;
      var rsb = wh - nav - underNav - 20;
      var pdfDiv = wh - nav - underNav - 80;
      var pdfWid = vw - 740;
      $("#overload_image").css("width", pdfWid);
      $("#order--dynamic--height").css("height", h);
      $(".side-attachments,.side-attachments-2").css("height", rsb);
      $("#maped_image").css("height", pdfDiv);
      $(window).on("load", function () {
        var vw = $(window).width();
        var nav = $(".navbar.fixed-top").height();
        var underNav = $(".order-tabs").height();
        var wh = $(window).height();
        var h = wh - nav - 60;
        var rsb = wh - nav - underNav - 20;
        var pdfDiv = wh - nav - underNav - 80;
        var pdfWid = vw - 740;
        $("#overload_image").css("width", pdfWid);
        $("#order--dynamic--height").css("height", h);
        $(".side-attachments,.side-attachments-2").css("height", rsb);
        $("#maped_image").css("height", pdfDiv);
      });
      $(window).resize(function () {
        var vw = $(window).width();
        var nav = $(".navbar.fixed-top").height();
        var underNav = $(".order-tabs").height();
        var wh = $(window).height();
        var h = wh - nav - 60;
        var rsb = wh - nav - underNav - 20;
        var pdfDiv = wh - nav - underNav - 80;
        var pdfWid = vw - 740;
        $("#overload_image").css("width", pdfWid);
        $("#order--dynamic--height").css("height", h);
        $(".side-attachments,.side-attachments-2").css("height", rsb);
        $("#maped_image").css("height", pdfDiv);
      });
    });
    $("#expand").on("click", function (e) {
      e.preventDefault();
      $(".maped_image").addClass("mm_pdf_img");
    });

    $(".cus-arro-div2").on("click", function (e) {
      e.preventDefault();
      $(".order_pdf_new").toggleClass("order_left_auto");
    });
    $("#full_screen").on("click", function (e) {
      e.preventDefault();
      $(".explore_img").addClass("fit_top_bottom");
    });
    // end
    // sideBarAccord
    $(".invoice-inherit").click(function () {
      $(".invoice-inherit .sideBarAccord1 ").toggleClass("rotate_0");
    });
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });
    $(".export_crd").click(function () {
      $(".export_crd .sideBarAccord1").toggleClass("rotate_0");
    });
    $(".invoice-inherit2").click(function () {
      $(".sideBarAccord2 ").toggleClass("rotate_0");
    });
  }

  handleRightSidebar = () => {
    this.setState((prevState, props) => ({
      toggleRightSidebar: !prevState.toggleRightSidebar,
    }));
  };

  openModal = async (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({
      [name]: false,
    });
  };

  render() {
    let userType = localStorage.getItem("userType");
    let approverCheck = false;
    let checkTwo = false;
    if (userType) {
      if (userType.toLowerCase() === "approver") {
        approverCheck = true;
      }
    }
    let tab =
      this.state.showPOTallisTabPane &&
      this.state.showPOTallisTabPane.toLowerCase();
    if (tab) {
      if (tab === "pending" || tab === "declined") {
        //when tab is pending or declined then everything is read only for Approver
        if (approverCheck) {
          checkTwo = true;
        }
      }
    }
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header
            props={this.props}
            distChange={true}
            toggleTeamIcon={this.toggleTeamIcon}
            viewTeam={this.state.viewTeam}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content dash__invoice--content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu po*/}
            <aside
              className="side-nav suppliers_side_nav side__content--invoice"
              id="show-side-navigation12"
            >
              <div className="cus-arro-div2">
                <img
                  src="images/arrow-r.png"
                  className=" img-fluid cus-arro-r"
                  alt="user"
                />
              </div>
              <div className="search">
                <div className="row">
                  <div className="col-auto pr-md-0 align-self-center">
                    <Dropdown
                      alignRight={false}
                      drop="down"
                      className="analysis-card-dropdwn custom-my-radio user_drop_options"
                    >
                      <Dropdown.Toggle variant="sucess" id="dropdown-basic">
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div className="custom-control custom-radio flex-container-inner">
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="total"
                              name="total"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "total"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="total"
                            >
                              Amount
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div className="custom-control custom-radio flex-container-inner">
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="orderBy"
                              name="orderBy"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "orderBy"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="orderBy"
                            >
                              Buyer
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div className="custom-control custom-radio flex-container-inner">
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="date"
                              name="date"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "date"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="date"
                            >
                              Date
                            </label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>{" "}
                  </div>
                  <div className="col input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
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
                      placeholder="What are you looking for"
                      aria-label="What are you looking for"
                      aria-describedby="basic-addon1"
                      name="POListSearch"
                      id="POListSearchId"
                      value={this.state.POListSearch}
                      onChange={this.handleChangePOListSearch}
                      onKeyDown={this.onPOListSearch}
                    />
                  </div>
                </div>
              </div>
              <ul className="suppliers_list">
                <li className="active cursorPointer">
                  <div className="row">
                    <div className="col-auto mb-2 pr-0">
                      <div className="form-group remember_check">
                        <input
                          type="checkbox"
                          // id={"order" + i}
                          // checked={l.checked}
                          name="checkbox"
                          // onChange={(e) => this.handleCheckbox(e, l)}
                        />
                        <label
                          // htmlFor={"order" + i}
                          className="mr-0"
                        ></label>
                      </div>
                    </div>
                    <div className="col pl-0">
                      <div className="invioce_data pr-sm-3">
                        <h4>Changes One </h4>
                        <div className="row">
                          <div className="col data-i">
                            <p>{12345}</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>20 FEB 2021</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>Test</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>XYZ</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>{100 + " (" + 200 + ")"}</p>
                          </div>
                          <div className="col-auto data-i">
                            <div className="text-center cursorPointer">
                              <p onClick={() => this.handleMoreDetails()}>
                                <Link
                                  tabIndex="-1"
                                  className="more-details-color"
                                  to="#"
                                >
                                  more details
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className=" cursorPointer">
                  <div className="row">
                    <div className="col-auto mb-2 pr-0">
                      <div className="form-group remember_check">
                        <input
                          type="checkbox"
                          // id={"order" + i}
                          // checked={l.checked}
                          name="checkbox"
                          // onChange={(e) => this.handleCheckbox(e, l)}
                        />
                        <label
                          // htmlFor={"order" + i}
                          className="mr-0"
                        ></label>
                      </div>
                    </div>
                    <div className="col pl-0">
                      <div className="invioce_data pr-sm-3">
                        <h4>Changes Two </h4>
                        <div className="row">
                          <div className="col data-i">
                            <p>{7777}</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>24 FEB 2021</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>Test</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>XYZ</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>{100 + " (" + 200 + ")"}</p>
                          </div>
                          <div className="col-auto data-i">
                            <div className="text-center cursorPointer">
                              <p onClick={() => this.handleMoreDetails()}>
                                <Link
                                  tabIndex="-1"
                                  className="more-details-color"
                                  to="#"
                                >
                                  more details
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className=" cursorPointer">
                  <div className="row">
                    <div className="col-auto mb-2 pr-0">
                      <div className="form-group remember_check">
                        <input
                          type="checkbox"
                          // id={"order" + i}
                          // checked={l.checked}
                          name="checkbox"
                          // onChange={(e) => this.handleCheckbox(e, l)}
                        />
                        <label
                          // htmlFor={"order" + i}
                          className="mr-0"
                        ></label>
                      </div>
                    </div>
                    <div className="col pl-0">
                      <div className="invioce_data pr-sm-3">
                        <h4>Changes Three </h4>
                        <div className="row">
                          <div className="col data-i">
                            <p>{666}</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>2 FEB 2021</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>Test</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>XYZ</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>{100 + " (" + 200 + ")"}</p>
                          </div>
                          <div className="col-auto data-i">
                            <div className="text-center cursorPointer">
                              <p onClick={() => this.handleMoreDetails()}>
                                <Link
                                  tabIndex="-1"
                                  className="more-details-color"
                                  to="#"
                                >
                                  more details
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className=" cursorPointer">
                  <div className="row">
                    <div className="col-auto mb-2 pr-0">
                      <div className="form-group remember_check">
                        <input
                          type="checkbox"
                          // id={"order" + i}
                          // checked={l.checked}
                          name="checkbox"
                          // onChange={(e) => this.handleCheckbox(e, l)}
                        />
                        <label
                          // htmlFor={"order" + i}
                          className="mr-0"
                        ></label>
                      </div>
                    </div>
                    <div className="col pl-0">
                      <div className="invioce_data pr-sm-3">
                        <h4>Changes Four </h4>
                        <div className="row">
                          <div className="col data-i">
                            <p>{233}</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>20 DEC 2021</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>Test</p>
                          </div>
                          <div className="col-auto data-i">
                            <p>XYZ</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col data-i">
                            <p>{100 + " (" + 200 + ")"}</p>
                          </div>
                          <div className="col-auto data-i">
                            <div className="text-center cursorPointer">
                              <p onClick={() => this.handleMoreDetails()}>
                                <Link
                                  tabIndex="-1"
                                  className="more-details-color"
                                  to="#"
                                >
                                  more details
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </aside>
            {/* {/ end /} */}

            <section id="contents" className="supplier pr-0 pt-0">
              <div className="body_content ordermain-padi body__invoice--top">
                <div className="container-fluid pl-0 ">
                  <div className="main_wrapper " id="order--dynamic--height">
                    <div className="row d-flex pl-15">
                      <div className="col-12 w-100 order-tabs p-md-0">
                        {/* PO Tallies */}
                        <div className="nav_tav_ul">
                          <ul className="nav nav-tabs">
                            {this.state.poTallies.map((t, i) => {
                              return (
                                <li
                                  key={i}
                                  className="cursorPointer nav-item"
                                  onClick={() =>
                                    this.setState({
                                      activePOTallis: t.id,
                                      showPOTallisTabPane: t.type,
                                    })
                                  }
                                >
                                  <a
                                    className={
                                      this.state.activePOTallis === t.id
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    {t.type}{" "}
                                    <span className="stats">{t.count}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="bg-gry w-100 float-left mm_top_nav">
                          <div className="w-100 float-left mm_lr_pad">
                            <div className="mm_tab_left order_left_icons">
                              <div className="tab-content">
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "draft" && (
                                    <div className="tab-pane container active">
                                      <ul>
                                        <li
                                          className="cursorPointer"
                                          onClick={() =>
                                            this.props.history.push(
                                              "/dist-changes-form"
                                            )
                                          }
                                        >
                                          <img
                                            src="images/add.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#">New</Link>{" "}
                                        </li>
                                        <li
                                          className="cursorPointer"
                                          onClick={() =>
                                            this.props.history.push(
                                              "/dist-changes-form"
                                            )
                                          }
                                        >
                                          <img
                                            src="images/pencill.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#">Edit</Link>{" "}
                                        </li>
                                        <li className="cursorPointer">
                                          <img
                                            src="images/copy1.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Copy </Link>
                                        </li>
                                        {this.state.teamOrderCheck != "Team" ? (
                                          <>
                                            <li className="cursorPointer">
                                              <img
                                                src="images/delete.svg"
                                                className="invoice-delete-icon img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Delete </Link>
                                            </li>
                                            <li className="cursorPointer">
                                              <img
                                                src="images/send.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Send </Link>
                                            </li>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "approve" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        {this.state.teamOrderCheck != "Team" ? (
                                          <>
                                            <li
                                              onClick={this.approvePO}
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/tick.png"
                                                className="img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Approve </Link>
                                            </li>
                                            <li
                                              onClick={this.holdPO}
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/move.png"
                                                className=" img-fluid"
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Hold </Link>
                                            </li>
                                            <li
                                              onClick={() =>
                                                this.openModal(
                                                  "openDeclineModal"
                                                )
                                              }
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/decline.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Decline </Link>
                                            </li>
                                            <li
                                              onClick={
                                                this.openOrderDetailModal
                                              }
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/pencill.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Edit </Link>
                                            </li>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "declined" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      {!approverCheck && (
                                        <ul>
                                          {this.state.teamOrderCheck !=
                                          "Team" ? (
                                            <li className="cursorPointer">
                                              <img
                                                src="images/move.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Move </Link>
                                            </li>
                                          ) : (
                                            ""
                                          )}
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "hold" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        {this.state.teamOrderCheck != "Team" ? (
                                          <>
                                            <li
                                              onClick={this.approvePO}
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/tick.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Approve </Link>
                                            </li>
                                            <li
                                              onClick={() =>
                                                this.openModal(
                                                  "openDeclineModal"
                                                )
                                              }
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/decline.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Decline </Link>
                                            </li>
                                            <li
                                              onClick={
                                                this.openOrderDetailModal
                                              }
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/pencill.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Edit </Link>
                                            </li>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "pending" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      {!approverCheck && (
                                        <ul>
                                          {this.state.teamOrderCheck !=
                                          "Team" ? (
                                            <li
                                              onClick={() =>
                                                checkTwo
                                                  ? this.openModal("")
                                                  : this.openModal(
                                                      "openMoveToDraftModal"
                                                    )
                                              }
                                              className="cursorPointer"
                                            >
                                              <img
                                                src="images/move.png"
                                                className=" img-fluid "
                                                alt="user"
                                              />{" "}
                                              <Link to="#"> Move </Link>
                                            </li>
                                          ) : (
                                            ""
                                          )}
                                          <li
                                            onClick={() =>
                                              checkTwo
                                                ? this.openModal("")
                                                : this.openModal(
                                                    "openCopyModal"
                                                  )
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/copy1.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Copy </Link>
                                          </li>
                                        </ul>
                                      )}
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "approved" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        {!approverCheck && (
                                          <li
                                            onClick={() =>
                                              this.openModal("openCopyModal")
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/copy1.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Copy </Link>
                                          </li>
                                        )}
                                        <li
                                          onClick={() =>
                                            this.openModal("openCloseModal")
                                          }
                                          className="cursorPointer"
                                        >
                                          <img
                                            src="images/decline.png"
                                            className="top_0 img-fluid"
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Close </Link>
                                        </li>
                                        {!approverCheck && (
                                          <li
                                            onClick={() =>
                                              this.openModal("openModifyModal")
                                            }
                                            className="cursorPointer"
                                          >
                                            <img
                                              src="images/pencill.png"
                                              className=" img-fluid "
                                              alt="user"
                                            />{" "}
                                            <Link to="#"> Modify </Link>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {this.state.showPOTallisTabPane &&
                                  this.state.showPOTallisTabPane.toLowerCase() ==
                                    "all" && (
                                    <div
                                      className={
                                        1 === 0
                                          ? "tab-pane container"
                                          : "tab-pane container active"
                                      }
                                    >
                                      <ul>
                                        <li></li>
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="mm_tab_center order_right_icons">
                              <div className="slider-panel">
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.zoomOut}
                                    src="images/minus.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.zoomIn}
                                    src="images/add.png"
                                    className=" img-fluid float-left"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Select
                                  className="width-selector"
                                  value={this.state.dropdownZoomingValue}
                                  classNamePrefix="custon_select-selector-inner"
                                  options={options}
                                  onChange={this.handleDropdownZooming}
                                  theme={(theme) => ({
                                    ...theme,
                                    border: 0,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      primary25: "#f2f2f2",
                                      primary: "#f2f2f2",
                                    },
                                  })}
                                />
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.handleHorizontalCross}
                                    src="images/fulls.png"
                                    className="img-fluid float-left"
                                    alt="user"
                                    id="full_screen"
                                  />{" "}
                                </Link>
                                <Link to="#" className="zom-img">
                                  <img
                                    onClick={this.handleHorizontalArrow}
                                    src="images/twoarow.png"
                                    className="img-fluid float-left"
                                    alt="user"
                                    id="expand"
                                  />{" "}
                                </Link>

                                <Link
                                  to="#"
                                  className="zom-img float-right ml-md-5 pl-2 pr-2 mr-0 more-d mt-0"
                                >
                                  <img
                                    src="images/more.png"
                                    className=" img-fluid"
                                    alt="user"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mt-0"
                                  onClick={this.moveToNextPO}
                                >
                                  <img
                                    src="images/arow-r.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="next"
                                  />{" "}
                                </Link>
                                <Link
                                  to="#"
                                  className="zom-img float-right mtop-1"
                                  onClick={this.moveToPrevPO}
                                >
                                  <img
                                    src="images/arow-l.png"
                                    className=" img-fluid lr-arrow-up"
                                    alt="user"
                                    href="#demo"
                                    data-slide="prev"
                                  />{" "}
                                </Link>
                                <div className="side-attachments-2 height-2 mm_order_sidebar aside__right--height">
                                  {/* <div
                                    onClick={this.getPOLog}
                                    className="main-sec-attach main-bg"
                                  >
                                    PO Log
                                  </div>
                                  <div
                                    onClick={this.downloadPreview}
                                    className="main-sec-attach main-bg"
                                  >
                                    Download Copy
                                    <img
                                      src="images/downlod.png"
                                      className=" img-fluid float-right fa"
                                      alt="user"
                                    />
                                  </div>

                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit"
                                      data-toggle="collapse"
                                      data-target="#Exclude"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Exclude
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Exclude">
                                    <div className="pl-2 mb-3">
                                      <div className="form-group remember_check">
                                        <input
                                          type="checkbox"
                                          id="item2"
                                          name="zero"
                                          checked={this.state.zero}
                                          onChange={(e) => {
                                            this.setState(
                                              {
                                                [e.target.name]:
                                                  e.target.checked,
                                              },
                                              () => {
                                                this.handleExclude();
                                              }
                                            );
                                          }}
                                        />
                                        <label htmlFor="item2">
                                          {" "}
                                          <span className="text-mar">Zero</span>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="pl-2 mb-3">
                                      <div className="form-group remember_check">
                                        <input
                                          type="checkbox"
                                          id="item23"
                                          name="close"
                                          checked={this.state.close}
                                          onChange={(e) => {
                                            this.setState(
                                              {
                                                [e.target.name]:
                                                  e.target.checked,
                                              },
                                              () => {
                                                this.handleExclude();
                                              }
                                            );
                                          }}
                                        />
                                        <label htmlFor="item23">
                                          {" "}
                                          <span className="text-mar">
                                            Close
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                  </div> */}
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit2"
                                      data-toggle="collapse"
                                      data-target="#Approvalsa"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord2"></span>
                                      Approvals
                                    </span>
                                  </div>
                                  <div
                                    className="collapse show"
                                    id="Approvalsa"
                                  >
                                    {[].map((a, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <div className="checkSide">
                                              <input
                                                type="checkbox"
                                                id={i}
                                                name={a.groupName}
                                                checked={a.checked}
                                                onChange={(e) =>
                                                  this.handleApprovalsFilters(
                                                    e,
                                                    a
                                                  )
                                                }
                                              />
                                              <label htmlFor={i}> </label>
                                            </div>
                                            <span className="text-mar">
                                              {a.groupName}{" "}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Changes"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={this.getPOChanges}
                                    >
                                      Changes
                                      <span className="ml-3 font-weight-bold">
                                        0
                                      </span>
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Changes">
                                    {[].map((c, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="main-sec-attach1"
                                        >
                                          <p className="m-clr s-bold mb-0">
                                            {c.userName}
                                          </p>
                                          {c.description}
                                          <p className="gry-clr mb-0">
                                            {c.date} {c.time}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="fa fa-angle-up float-left mr-2 sideBarAccord"
                                      data-toggle="collapse"
                                      data-target="#Activity"
                                    ></span>
                                    <span
                                      className="name_attached font-weight-bold"
                                      onClick={this.getPOActivity}
                                    >
                                      Activity
                                    </span>
                                  </div>
                                  <div className="collapse show" id="Activity">
                                    {[].map((a, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className="main-sec-attach1"
                                        >
                                          {a.description}
                                          <p className="gry-clr mb-0">
                                            {a.date} {a.time}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="export_crd"
                                      data-toggle="collapse"
                                      data-target="#export"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Export
                                    </span>
                                  </div>
                                  <div className="collapse show" id="export">
                                    {["EXCEL"].map((op, i) => {
                                      return (
                                        <div key={i} className="pl-2 mb-3">
                                          <div className="form-group remember_check d-flex">
                                            <span className="text-mar cursorPointer ml-38">
                                              {op}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal("openReportModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Reports
                                  </div>

                                  <div
                                    onClick={() =>
                                      this.openModal("openImportModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Import
                                  </div>
                                  <div
                                    onClick={() =>
                                      this.openModal("openPostModal")
                                    }
                                    className="main-sec-attach main-bg"
                                  >
                                    Post
                                  </div>
                                  {/* batch list start here  */}
                                  <div className="main-sec-attach main-bg">
                                    <span
                                      className="invoice-inherit"
                                      data-toggle="collapse"
                                      data-target="#batchlist"
                                    >
                                      <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                                      Batch List
                                    </span>
                                  </div>
                                  <div className="collapse show" id="batchlist">
                                    <div className="pl-2 mb-3">
                                      <div className="text-right pb-2 pr-4">
                                        <a class="mr-3" href="#">
                                          <img
                                            src="images/add.png"
                                            class=" img-fluid "
                                            alt="user"
                                          />
                                        </a>
                                        <a class="" href="#">
                                          <img
                                            src="images/delete.svg"
                                            class="invoice-delete-icon img-fluid "
                                            alt="user"
                                          />
                                        </a>
                                      </div>
                                      <table className="table table-bordered mb-0 order-collapse-table">
                                        <tbody>
                                          <tr>
                                            <th>
                                              <div class="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id="oleftcheck1"
                                                />
                                                <label htmlFor="oleftcheck1"></label>
                                              </div>
                                            </th>
                                            <th>Description</th>
                                            <th>Batch</th>
                                            <th></th>
                                          </tr>
                                          <tr>
                                            <td>
                                              <div class="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id="oleftcheck2"
                                                />
                                                <label htmlFor="oleftcheck2"></label>
                                              </div>
                                            </td>
                                            <td>API Batch</td>
                                            <td>2</td>
                                            <td></td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <div class="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id="oleftcheck3"
                                                />
                                                <label htmlFor="oleftcheck3"></label>
                                              </div>
                                            </td>
                                            <td>Draft Invoice</td>
                                            <td>3</td>
                                            <td></td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <div class="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id="oleftcheck4"
                                                />
                                                <label htmlFor="oleftcheck4"></label>
                                              </div>
                                            </td>
                                            <td>Pending Invoices</td>
                                            <td>4</td>
                                            <td></td>
                                          </tr>
                                          <tr>
                                            <td>
                                              <div class="form-group remember_check">
                                                <input
                                                  type="checkbox"
                                                  id="oleftcheck5"
                                                />
                                                <label htmlFor="oleftcheck5"></label>
                                              </div>
                                            </td>
                                            <td>Approved Invoices</td>
                                            <td>5</td>
                                            <td></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  {/* end  Batch list  */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="img-section-t col-12 pl-0 h-100">
                      <div
                        className={
                          this.state.toggleRightSidebar
                            ? "pdf__height--content mm_ordr1 order_pdf_new h-100"
                            : "pdf__height--content mm_ordr1 order_pdf_expand1 m_auto h-100"
                        }
                        id="overload_image"
                      >
                        <div
                          id="maped_image "
                          className="order_pfd h-100"
                          style={{ background: "#fff" }}
                        >
                          <div
                            className="maped_image h-100 expand_it "
                            style={{
                              transform: this.state.scaling,
                              transformOrigin: "center top",
                            }}
                          >
                            <img
                              className="explore_img"
                              // src='images/newtest.png'
                              src={"images/image6.png"}
                              useMap="#image-map"
                              id="preview"
                              alt="preview"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        id="right-sidbar"
                        className="side-attachments mm_order_side aside__right--height"
                      >
                        {" "}
                        <div
                          onClick={this.handleRightSidebar}
                          className="cus-arro-div"
                        >
                          <img
                            src="images/arrow-r.png"
                            className=" img-fluid cus-arro-r"
                            alt="user"
                          />
                        </div>
                        <div className="side-attack">
                          <div className="main-sec-attach main-bg">
                            {/* PO Attachments */}
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Attachments"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openAttachmentsModal")
                              }
                            >
                              Attachments
                              <span className="ml-3 font-weight-bold">0</span>
                              <a class="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  class=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div className="collapse show" id="Attachments">
                            {[].map((a, i) => {
                              return (
                                <div
                                  onClick={() =>
                                    this.getAttachment(
                                      a.recordID,
                                      a.contentType,
                                      a.fileName
                                    )
                                  }
                                  key={i}
                                  className="main-sec-attach"
                                >
                                  {a.fileName}{" "}
                                  <span className="fa fa-angle-right"></span>
                                </div>
                              );
                            })}
                          </div>
                          {/* side menue Approvers / Approvals */}
                          <div className="main-sec-attach main-bg">
                            <span
                              className="invoice-inherit"
                              data-toggle="collapse"
                              data-target="#Approvals"
                            >
                              <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span>
                              <span className="name_attached">Approvals</span>
                            </span>
                          </div>
                          <div className="collapse show" id="Approvals">
                            <div className="main-sec-mid">TEST</div>
                            {[].map((a, i) => {
                              return (
                                <div
                                  key={i}
                                  className="main-sec-attach cus-check"
                                >
                                  <div className="form-group remember_check">
                                    {a.status === "Approved" ? (
                                      <input type="checkbox" id={i} checked />
                                    ) : (
                                      ""
                                    )}
                                    {a.status === "Current" ? (
                                      <i
                                        className="fa fa-circle-thin circle-check float-left ml-1"
                                        aria-hidden="true"
                                      ></i>
                                    ) : (
                                      ""
                                    )}
                                    <label htmlFor={i}>
                                      {" "}
                                      <span
                                        className={
                                          a.status === "Current"
                                            ? "order-right-color ml-2 selected mm_lcapp"
                                            : "text-mar"
                                        }
                                      >
                                        {a.approverName}
                                      </span>
                                      {a.status === "Current" ? (
                                        <span className="current-approver mm_approre">
                                          {" "}
                                          (current approver)
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* PO Comments */}
                          <div className="main-sec-attach main-bg">
                            <span
                              className="fa fa-angle-up float-left mr-2 sideBarAccord"
                              data-toggle="collapse"
                              data-target="#Comments"
                            ></span>
                            <span
                              className="name_attached"
                              onClick={() =>
                                this.openModal("openCommentsModal")
                              }
                            >
                              Comments
                              <span className="ml-3 font-weight-bold">0</span>
                              <a class="float-right mr-3" href="#">
                                <img
                                  src="images/add.png"
                                  class=" img-fluid sidebarr_plus "
                                  alt="user"
                                />
                              </a>
                            </span>
                          </div>
                          <div className="collapse show" id="Comments">
                            {[].map((c, i) => {
                              return (
                                <div key={i} className="main-sec-attach1">
                                  <p className="m-clr s-bold mb-0">
                                    {c.userName}
                                  </p>
                                  {c.comment}
                                  <p className="gry-clr mb-0">
                                    {c.date} {c.time}
                                  </p>
                                </div>
                              );
                            })}
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

        <Attachments
          openAttachmentsModal={this.state.openAttachmentsModal}
          closeModal={this.closeModal}
        />
        <Comments
          openCommentsModal={this.state.openCommentsModal}
          closeModal={this.closeModal}
          comments={this.state.poComments}
          addComment={() => {}}
          tab={
            this.state.showPOTallisTabPane &&
            this.state.showPOTallisTabPane.toLowerCase()
          }
        />

        <Activity
          openActivityModal={this.state.openActivityModal}
          closeModal={this.closeModal}
          activity={this.state.poActivity}
        />
        <Changes
          openChangesModal={this.state.openChangesModal}
          closeModal={this.closeModal}
          changes={this.state.poChanges}
        />
        <Import state={this.state} closeModal={this.closeModal} />

        <Post
          openPostModal={this.state.openPostModal}
          closeModal={this.closeModal}
        />
        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Distribution Change"
          locationProps={this.props}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(DistChanges);
