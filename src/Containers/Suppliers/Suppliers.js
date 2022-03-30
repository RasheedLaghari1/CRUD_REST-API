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

class Suppliers extends Component {
  constructor() {
    super();
    this.state = {
      suppliersList: [
        {
          email: "One@gmail.com",
          name: "Supplier One",
        },
        {
          email: "Two@gmail.com",
          name: "Supplier Two",
        },
        {
          email: "Three@gmail.com",
          name: "Supplier Three",
        },
        {
          email: "Four@gmail.com",
          name: "Supplier Four",
        },
      ],
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
      showSUPTallisTabPane: "draft",
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
    let { showSUPTallisTabPane } = this.state;
    let tab =
      (showSUPTallisTabPane && showSUPTallisTabPane.toLowerCase()) || "";
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} supplier={true} />
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
                  <div className="col-auto mb-2 pr-0">
                    <div className="form-group remember_check custom-checkbox-ui">
                      <input
                        type="checkbox"
                        id={"order"}
                        // checked={l.checked}
                        name="checkbox"
                        // onChange={(e) => this.handleCheckbox(e, l)}
                      />
                      <label
                        htmlFor={"order"}
                        className="mr-0 custom-box"
                      ></label>
                    </div>
                  </div>
                  <div className="col-auto pr-md-0 align-self-center ml-1">
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn float-right user_drop_options custom-my-radio "
                    >
                      <Dropdown.Toggle
                        variant="sucess"
                        id="dropdown-basic"
                        className="custom-angle-down"
                      >
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          {" "}
                          <div className="custom-control custom-radio flex-container-inner">
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="name1"
                              name="name"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "name"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="name1"
                            >
                              Name
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
                              id="code2"
                              name="code"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "code"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="code2"
                            >
                              Code
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
                              id="currency3"
                              name="currency"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "currency"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="currency3"
                            >
                              Currency
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
                              id="city4"
                              name="city"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "city"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="city4"
                            >
                              City
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
                              id="state5"
                              name="state"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "state"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="state5"
                            >
                              State
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
                              id="postcode6"
                              name="postcode"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "postcode"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="postcode6"
                            >
                              Postcode
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
                              id="country7"
                              name="country"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "country"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="country7"
                            >
                              Country
                            </label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
                {this.state.suppliersList.map((s, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        i == 0 ? "active cursorPointer" : "cursorPointer"
                      }
                      id={s.id}
                    >
                      {" "}
                      <div className="row">
                        <div className="col-auto mb-2 pr-0">
                          <div className="form-group remember_check">
                            <input
                              type="checkbox"
                              id={"sup" + i}
                              name="checkbox"
                              checked={s.checked}
                              // onChange={(e) => this.handleCheckbox(e, s, i)}
                            />
                            <label htmlFor={"sup" + i} className="mr-0"></label>
                          </div>
                        </div>
                        <div className="col-10 pl-0">
                          <div className="supplier_data">
                            <h4>{s.name}</h4>
                            <p>{s.email}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
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
                                      showSUPTallisTabPane: t.type,
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
                                {tab === "draft" && (
                                  <div className="tab-pane container active">
                                    <ul>
                                      <li
                                        className="cursorPointer"
                                        onClick={() =>
                                          this.props.history.push(
                                            "/new-supplier2"
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
                                      <li className="cursorPointer">
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
                                    </ul>
                                  </div>
                                )}
                                {tab === "approve" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
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
                                          this.openModal("openDeclineModal")
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
                                        onClick={this.openOrderDetailModal}
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Edit </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "declined" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!false && (
                                      <ul>
                                        <li className="cursorPointer">
                                          <img
                                            src="images/move.png"
                                            className=" img-fluid "
                                            alt="user"
                                          />{" "}
                                          <Link to="#"> Move </Link>
                                        </li>
                                      </ul>
                                    )}
                                  </div>
                                )}
                                {tab === "hold" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
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
                                          this.openModal("openDeclineModal")
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
                                        onClick={this.openOrderDetailModal}
                                        className="cursorPointer"
                                      >
                                        <img
                                          src="images/pencill.png"
                                          className=" img-fluid "
                                          alt="user"
                                        />{" "}
                                        <Link to="#"> Edit </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {tab === "pending" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    {!false && (
                                      <ul>
                                        <li
                                          onClick={() =>
                                            false
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

                                        <li
                                          onClick={() =>
                                            false
                                              ? this.openModal("")
                                              : this.openModal("openCopyModal")
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
                                {tab === "approved" && (
                                  <div
                                    className={
                                      1 === 0
                                        ? "tab-pane container"
                                        : "tab-pane container active"
                                    }
                                  >
                                    <ul>
                                      {!false && (
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
                                      {!false && (
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
                                {tab === "all" && (
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
                          <div
                            onClick={() => this.openModal("openReportModal")}
                            className="main-sec-attach main-bg"
                          >
                            Reports
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
                            {["EXCEL", "PSL"].map((op, i) => {
                              return (
                                <div
                                  onClick={this.exportSuppliers}
                                  key={i}
                                  className="pl-2 mb-3"
                                >
                                  <div className="form-group remember_check d-flex">
                                    <span className="text-mar cursorPointer ml-38">
                                      {op}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {tab === "draft" ? (
                            <div
                              onClick={() => this.openModal("openImportModal")}
                              className="main-sec-attach main-bg"
                            >
                              Import
                            </div>
                          ) : (
                            ""
                          )}
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.unlockSupplier}
                          >
                            Unlock
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.approveSupplier}
                          >
                            Approve
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getSupplierActivity}
                          >
                            Activity
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getPayments}
                          >
                            Payments
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getTransactions}
                          >
                            Transactions
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

        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Suppliers"
          locationProps={this.props}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Suppliers);
