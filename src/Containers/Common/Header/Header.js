import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import "./Header.css";
import store from "../../../Store/index";
import ReactTooltip from "react-tooltip";
import BusinessUnit from "../../Modals/BusinessUnit/BusinessUnit";
import Profile from "../../Modals/Profile/Profile";
import ESignature from "../../Modals/ESignature/ESignature";
import { connect } from "react-redux";
import { userAvatar } from "../../../Constants/Constants";
import moment from "moment";

import {
  getHelpPage,
  getAccountDetails,
  GetRecentActivity,
  logOutUser,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../../Actions/UserActions/UserActions";

import { toast } from "react-toastify";
class Header extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      show: false,
      openResetPassworddModal: false,
      openBusinessUnitModal: false,
      openProfileModal: false,
      openESignatureModal: false,
    };
  }

  componentWillReceiveProps() {
    if (this.props.loginProductionSuccess) {
      this.setState({ openBusinessUnitModal: false });
    }
  }

  async componentDidMount() {
    // this.setState({ isLoading: true });

    if (!this.props.user.getHelpPage) {
      await this.props.getHelpPage();
    }

    //success case of Get Help Page
    if (this.props.user.getHelpPageSuccess) {
      // toast.success(this.props.user.getHelpPageSuccess);
    }
    //error case of Get Help Page
    if (this.props.user.getHelpPageError) {
      let error = this.props.user.getHelpPageError;
      if (
        error === "Session has expired. Please login again." ||
        error === "User has not logged in."
      ) {
        this.props.clearStatesAfterLogout();
        this.props.history.push("/login");
      } else {
        //Netork Error || api error
        toast.error(error);
      }
    }
    this.props.clearUserStates();
    // this.setState({ isLoading: false });
    //to call Recent Activities API
    // if(!this.props.dashboard && this.props.user.getRecentActivity.length === 0){
    //   await this.getRecentActivity()
    // }
    if (!this.props.settings && !this.props.user.getAccountDetails) {
      let accntVals = localStorage.getItem("getAccountDetails") || "";
      accntVals = accntVals ? JSON.parse(accntVals) : "";

      if (accntVals && accntVals.accountDetails) {
        //if localstorage contains the account details then update the Redux State no need to call API
        store.dispatch({
          type: "GET_ACCOUNT_DETAILS_SUCCESS",
          payload: accntVals,
        });
      } else {
        await this.props.getAccountDetails();
      }
    }

    //success case of Get Account Details
    if (this.props.user.getAccountDetailsSuccess) {
      // toast.success(this.props.user.getAccountDetailsSuccess);
    }
    //error case of Get Account Details
    if (this.props.user.getAccountDetailsError) {
      this.handleApiRespErr(this.props.user.getAccountDetailsError);
    }
  }

  getRecentActivity = async () => {
    await this.props.GetRecentActivity(); //call api to get recent activities
    //success case of get recent activity
    if (this.props.user.getRecentActivitySuccess) {
      // toast.success(this.props.user.getRecentActivitySuccess);
    }
    //error case of get recent activity
    if (this.props.user.getRecentActivityError) {
      this.handleApiRespErr(this.props.user.getRecentActivityError);
    }
  };

  //a function that checks api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      if (this.props.props && this.props.props.history) {
        this.props.props.history.push("/login");
      } else if (
        this.props.props &&
        this.props.props.props &&
        this.props.props.props.history
      ) {
        this.props.props.props.history.push("/login");
      }
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      if (this.props.props && this.props.props.history) {
        this.props.props.history.push("/login-table");
      } else if (
        this.props.props &&
        this.props.props.props &&
        this.props.props.props.history
      ) {
        this.props.props.props.history.push("/login-table");
      }
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };

  CloseNotify = (name) => {
    this.setState({ [name]: false });
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  componentWillMount() {
    $(window).on("scroll", function () {
      if ($(this).scrollTop() >= 82) {
        $(".side-attachments").css("position", "fixed");
        $(".side-attachments").css("top", "82px");
        $(".side-attachments").css("right", "0px");
      } else {
        $(".side-attachments").css("position", "absolute");
        $(".side-attachments").css("top", "0px");
        $(".side-attachments").css("right", "-15px");
      }
    });

    $(function () {
      "use strict";

      (function () {
        var aside = $(".side-nav.home-side-nav");
        var supplier_aside = $(".side-nav.suppliers_side_nav");
        var side_attachments = $(".side-attachments"),
          showAsideBtn = $(".show-side-btn"),
          contents = $("#contents");

        showAsideBtn.on("click", function () {
          $("#" + $(this).data("show")).toggleClass("show-side-nav");

          contents.toggleClass("margin");
        });

        if ($(window).width() <= 767) {
          aside.addClass("show-side-nav");
          $(".img-section-t.col-12>div").css("overflow-x", "auto");
        }
        if ($(window).width() <= 991) {
          supplier_aside.addClass("wid-2");
          side_attachments.addClass("wid-0");
        }

        $(window).on("resize", function () {
          if ($(window).width() <= 767) {
            aside.addClass("show-side-nav");
            $(".img-section-t.col-12>div").css("overflow-x", "auto");
          }
          if ($(window).width() <= 991) {
            supplier_aside.addClass("wid-2");
            side_attachments.addClass("wid-0");
          }

          if ($(window).width() > 767) {
            aside.removeClass("show-side-nav");
          }

          if ($(window).width() > 991) {
            supplier_aside.removeClass("wid-2");
            side_attachments.removeClass("wid-0");
            $(".side-attack").removeClass("wid-0");
            $(".supplier").removeClass("ml-20");
            $(".img-section-t.col-12>div").removeAttr("style");
            $(".side-attack").removeAttr("style");
            $(".img-section-t.col-12>div").removeClass("mx-auto");
            $(".img-section-t.col-12>div>img").removeAttr("style");
          }
        });

        // dropdown menu in the side nav
        var slideNavDropdown = $(".side-nav-dropdown");

        $(".side-nav .categories li").on("click", function () {
          $(this).toggleClass("opend").siblings().removeClass("opend");

          if ($(this).hasClass("opend")) {
            $(this).find(".side-nav-dropdown").slideToggle("fast");

            $(this).siblings().find(".side-nav-dropdown").slideUp("fast");
          } else {
            $(this).find(".side-nav-dropdown").slideUp("fast");
          }
        });

        $(".side-nav .close-aside").on("click", function () {
          $("#" + $(this).data("close")).addClass("show-side-nav");

          contents.removeClass("margin");
        });
        $(".nav-link.text-primary").on("click", function () {
          var id = $(this).attr("data-target");
          if (id === "#top_nav_toggle1") {
            $(`${id}`).toggleClass("show");
          }
        });

        $(".dash_menu_toggle.top--nav").on("click", function () {
          $(".nav-link.text-primary").click();
        });
        $(".side-attachments-2").hide();
        $(".more-d").on("click", function () {
          $(".side-attachments-2").toggle();
        });
        // $(".cus-arro-div").on("click", function() {
        //   $(".side-attack").toggle();
        //   $(this)
        //     .parent()
        //     .toggleClass("wid-0");
        // });
        $(".cus-arro-div2").on("click", function (e) {
          e.preventDefault();
          // $(".side-attack").toggleClass("wid-0");
          // $(".cus-arro-div")
          //   .parent()
          //   .toggleClass("wid-0");
          $(this).parent().toggleClass("wid-2");

          $(".supplier#contents").toggleClass("ml-20");
          $(".supplier#contents").toggleClass("pl-0");

          $(".img-section-t.col-12>div").toggleClass("widFull");
          $(".img-section-t.col-12>div>img").css("padding-left", "0px");
        });

        $(".cus-arro-div").on("click", function (e) {
          e.preventDefault();

          // $(".side-attack").toggleClass("wid-0");
          // $(".cus-arro-div2")
          //   .parent()
          //   .toggleClass("wid-2");
          $(this).parent().toggleClass("wid-0");

          // $(".supplier#contents").toggleClass("ml-20");
          // $(".supplier#contents").toggleClass("pl-0");

          // $(".img-section-t.col-12>div").toggleClass("mx-auto");
          $(".img-section-t.col-12>div>img").css("padding-left", "0px");
        });
      })();
    });
  }

  logout = async () => {
    this.setState({ isLoading: true });
    let pathName =
      (this.props &&
        this.props.props &&
        this.props.props.location &&
        this.props.props.location.pathname) ||
      "";
    if (pathName) {
      //Client-> Can you save the last page a user was logged into so when they log in next it takes them back to that page?
      localStorage.setItem("lastPageLogin", pathName);
    }
    await this.props.logOutUser(); //call user logout api
    //successfully logout
    if (this.props.user.logoutSuccess) {
      // toast.success(this.props.user.logoutSuccess);
      this.props.clearStatesAfterLogout();
      this.props.props.history.push("/login");
    }
    //error while logout user
    if (this.props.user.logoutError) {
      this.handleApiRespErr(this.props.user.logoutError);
    }
    this.setState({ isLoading: false });
  };

  render() {
    let link = this.props.user.getHelpPage || "#";
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        {/* top nav bar */}
        <div className="dash_top_navbar">
          <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-light">
            <div className="navbar-collapse" id="navbarTogglerDemo01">
              <div className="row">
                <div className="col-4 col-sm-auto align-self-center">
                  <Link
                    data-tip
                    data-for="toolTip-Dashboard"
                    className="navbar-brand"
                    to="/dashboard"
                    tabIndex="-1"
                  >
                    <img
                      src="images/dash-logo.png"
                      className="img-fluid"
                      alt="logo"
                    />
                  </Link>
                  <ReactTooltip
                    id="toolTip-Dashboard"
                    place="bottom"
                    type="info"
                    effect="solid"
                  >
                    <span>Dashboard</span>
                  </ReactTooltip>
                </div>
                <div className="col align-self-center order_2">
                  <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                      <div className="user-profile">
                        <Link
                          data-tip
                          data-for="toolTip-NavigationBar"
                          className="nav-link text-primary"
                          to="#"
                          data-target="#top_nav_toggle1"
                          tabIndex="-1"
                        >
                          <img
                            src="images/top-menu.png"
                            className=""
                            alt="top-menu"
                          />
                        </Link>
                        <ReactTooltip
                          id="toolTip-NavigationBar"
                          place="bottom"
                          type="info"
                          effect="solid"
                        >
                          <span>Navigation Bar</span>
                        </ReactTooltip>
                      </div>
                    </li>
                    {/* <li className="nav-item">
                        <div className="user-profile">
                          <Link className="nav-link text-primary" to="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="images/chat-icon.png" className="" alt="chat-icon" />
                          </Link>
                        </div>
                      </li> */}
                    {/* <li className="nav-item">
                      <div className="user-profile">
                        <Link
                          data-tip
                          data-for="toolTip-Alerts"
                          className="nav-link text-primary"
                          to="#"
                          data-toggle="collapse"
                          data-target="#recent_activity"
                          tabIndex="-1"
                        >
                          <img
                            src="images/notify.png"
                            className="head_notify"
                            alt="notify"
                          />
                        </Link>
                        <ReactTooltip
                          id="toolTip-Alerts"
                          place="bottom"
                          type="info"
                          effect="solid"
                        >
                          <span>Alerts</span>
                        </ReactTooltip>
                      </div>
                    </li> */}
                    <li className="nav-item">
                      <div className="user-profile">
                        <a
                          data-tip
                          data-for="toolTip-HelpSection"
                          className="nav-link text-primary"
                          // to="/external"
                          href={link}
                          target="_blank"
                          tabIndex="-1"
                        >
                          <img src="images/ball.png" className="" alt="ball" />
                        </a>
                        <ReactTooltip
                          id="toolTip-HelpSection"
                          place="bottom"
                          type="info"
                          effect="solid"
                        >
                          <span>Help Section</span>
                        </ReactTooltip>
                      </div>
                    </li>
                    {this.props.orders ||
                    this.props.invoices ||
                    this.props.journal ||
                    this.props.timecards ||
                    this.props.documents ||
                    this.props.expense ? (
                      <>
                        <li
                          onClick={() =>
                            this.props.viewTeam === "Y"
                              ? this.props.toggleTeamIcon("N")
                              : this.props.toggleTeamIcon("Y")
                          }
                          className="nav-item"
                        >
                          <div className="user-profile">
                            <Link
                              tabIndex="-1"
                              data-tip
                              data-for="toolTip-ViewTeamOrders"
                              className="nav-link text-primary"
                              to="#"
                            >
                              <img
                                src={
                                  this.props.viewTeam === "Y"
                                    ? "images/Group 2147.png"
                                    : "images/ic_person_24px.png"
                                }
                                className=""
                                alt="ball"
                              />
                            </Link>
                          </div>
                        </li>

                        <ReactTooltip
                          id="toolTip-ViewTeamOrders"
                          place="bottom"
                          type="info"
                          effect="solid"
                        >
                          <span>View Team Orders Toggle</span>
                        </ReactTooltip>
                      </>
                    ) : (
                      ""
                    )}

                    {this.props.company ? (
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link external_modal_link"
                          to="#"
                          onClick={() =>
                            this.openModal("openBusinessUnitModal")
                          }
                        >
                          {localStorage.getItem("loginProduction")}{" "}
                          <img
                            src="images/arrow-right.png"
                            className=""
                            alt="arrow-right"
                          />
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </div>
                {/* to show   Suppliers on Header*/}
                {this.props.supplier ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Suppliers
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show   Suppliers on Header*/}
                {this.props.supplier2 ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Suppliers
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Edit Invoice on Header*/}
                {this.props.editInvoice ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Invoice Edit
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show PO Transfer on Header*/}
                {this.props.poTransfer ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      PO Transfer
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show PO Log on Header*/}
                {this.props.poLog ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      PO Log
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show   Purchase Orders on Header*/}
                {this.props.orders ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Purchase Orders
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.journal ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Journals
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.distChange ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Dist Changes
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.journalForm ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Journals Form
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.distchangesform ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Dist Changes form Form
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.payments ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Payments
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {this.props.timecards ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Timecards
                    </Link>
                  </div>
                ) : (
                  ""
                )}

                {/* to show  Received Order on Header*/}
                {this.props.receivedOrder ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Received Orders
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show  Past Received Order on Header*/}
                {this.props.pastReceivedOrder ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Past Received Orders
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Invoices on Header*/}
                {this.props.invoices ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Invoices
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Expenses on Header*/}
                {this.props.expense ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Expenses
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Expenses on Header*/}
                {this.props.expenseForm ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Expense Form
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Expenses on Header*/}
                {this.props.documents ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Documents
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Expenses on Header*/}
                {this.props.documentsForm ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Document
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Settings on Header*/}
                {this.props.settings ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Settings
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show NewInvoice on Header*/}
                {this.props.newInvoice ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      New Invoice
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show NewPoEdit on Header*/}
                {this.props.newPoEdit ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      New PO Edit
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show NewSupplier on Header*/}
                {this.props.newSupplier ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link
                      tabIndex="-1"
                      className="nav-link external_modal_link"
                      to="#"
                    >
                      Supplier Entry Form
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {/* to show Search on Header */}
                {this.props.search ? (
                  <div className="col align-self-center order_2 text-left ml-120">
                    <Link className="nav-link external_modal_link" to="#">
                      Search
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-8 col-sm-auto align-self-center">
                  <div className="form-inline my-2 my-lg-0">
                    <div className="user-profile user_drop_options">
                      <Link
                        className="nav-link user_menu"
                        to="#"
                        id="user_options"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        tabIndex="-1"
                      >
                        {this.props.user.getAccountDetails &&
                        this.props.user.getAccountDetails.accountDetails &&
                        this.props.user.getAccountDetails.accountDetails
                          .userName
                          ? this.props.user.getAccountDetails.accountDetails
                              .userName
                          : ""}
                        <img
                          src="images/angle-down.png"
                          className="dash_down_caret"
                          alt="angle-down"
                        />
                      </Link>
                      <span>
                        <img
                          src={
                            this.props.user.getAccountDetails &&
                            this.props.user.getAccountDetails.accountDetails &&
                            this.props.user.getAccountDetails.accountDetails
                              .avatar
                              ? this.props.user.getAccountDetails.accountDetails
                                  .avatar
                              : userAvatar
                          }
                          onClick={() => this.openModal("openProfileModal")}
                          alt="avatar"
                        />
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="user_options"
                      >
                        <Link className="dropdown-item" to="/settings">
                          Settings
                        </Link>
                        {/* <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => this.openModal("openESignatureModal")}
                        >
                          Signature
                        </Link> */}
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => this.openModal("openProfileModal")}
                        >
                          Profile
                        </Link>
                        <span onClick={this.logout} className="dropdown-item">
                          Log Out
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        {/* end */}

        {/* Businss Unit  Modal */}
        <BusinessUnit
          openBusinessUnitModal={this.state.openBusinessUnitModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          loginProduction={this.props.loginProduction}
        />
        {/* end */}
        {/* Profile  Modal */}
        <Profile
          openProfileModal={this.state.openProfileModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          props={this.props.props}
        />
        {/* end */}
        {/* ESignature  Modal */}
        <ESignature
          openESignatureModal={this.state.openESignatureModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          props={this.props.props}
        />
        {/* end */}

        {/* recent activity */}

        <div className="collapse" id="recent_activity">
          <div className="row">
            <div className="col-md-12">
              <div className="forgot_body recent_act">
                <div className="row">
                  <div className="col-12 mb-2">
                    <h4 className="recent_actives">Recent Activity</h4>
                  </div>
                  <div className="col-md-12">
                    <div className="activity_item_main comments_main recent_active_main">
                      <div className="row">
                        <div className="col-auto">
                          <div className="recent_active_pic">
                            <img
                              src="images/256.png"
                              className="import_icon img-fluid float-left"
                              alt="user"
                            />
                          </div>
                        </div>
                        <div className="col p-md-0">
                          <div className="activity_9 p-0">
                            <h6 className="activity_9_h5 p-0 mb-0">Jie He</h6>
                            <p>I added some comments in order.</p>
                          </div>
                        </div>
                        <div className="col-auto align-self-center pr-md-4">
                          <div className="activity_3 ">
                            <p>5/07/2018 1:10pm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="activity_item_main comments_main recent_active_main">
                      <div className="row">
                        <div className="col-auto">
                          <div className="recent_active_pic">
                            <img
                              src="images/256.png"
                              className="import_icon img-fluid float-left"
                              alt="user"
                            />
                          </div>
                        </div>
                        <div className="col p-md-0">
                          <div className="activity_9 p-0">
                            <h6 className="activity_9_h5 p-0 mb-0">Jie He</h6>
                            <p>I added some comments in order.</p>
                          </div>
                        </div>
                        <div className="col-auto align-self-center pr-md-4">
                          <div className="activity_3 ">
                            <p>5/07/2018 1:10pm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* {this.props.user.getRecentActivity.map((a, i) => {
                    return (
                      <div className="col-md-12">
                        <div className="activity_item_main comments_main recent_active_main">
                          <div className="row">
                            <div className="col-auto">
                              <div className="recent_active_pic">
                                <img
                                  src={
                                    a.USERAVATAR
                                      ? "data:image/png;base64," + a.USERAVATAR
                                      : userAvatar
                                  }
                                  className="import_icon img-fluid float-left circle-image"
                                  alt="user"
                                />
                              </div>
                            </div>
                          
                            <div className="col p-md-0">
                              <div className="activity_9 p-0">
                                <h6 className="activity_9_h5 p-0 mb-0">
                                  {a.userName}
                                </h6>
                                <p>{a.action}</p>
                              </div>
                            </div>

                            <div className="col-auto align-self-center pr-md-4">
                              <div className="activity_3 ">
                                <p>
                                  {moment
                                    .unix(a.actionDate)

                                    .format("DD MMM YYYY")
                                    .toUpperCase()}{" "}
                                  {moment.unix(a.actionTime).format("hh:mm a")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  getAccountDetails,
  GetRecentActivity,
  logOutUser,
  clearUserStates,
  clearStatesAfterLogout,
  getHelpPage,
})(Header);
