import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import store from "../../Store/index";

import "./DashBoard.css";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import SideNav from "../Common/SideNav/SideNav";
import moment from "moment";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import ModileResponsiveMenu from "../../Components/modileResponsiveMenu";
import { userAvatar } from "../../Constants/Constants";
import { getPOTallies, clearPOStates } from "../../Actions/POActions/POActions";
import {
  getInvoiceTallies,
  clearInvoiceStates,
} from "../../Actions/InvoiceActions/InvoiceActions";
import {
  getDocumentTallies,
  clearDocumentStates,
} from "../../Actions/DocumentActions/DocumentActions";
import {
  getExpenseTallies,
  clearExpenseStates,
} from "../../Actions/ExpenseActions/ExpenseActions";
import {
  getTimecardTallies,
  clearTimecardStates,
} from "../../Actions/TimecardActions/TimecardActions";
import {
  setUserSettings,
  getAccountDetails,
  getDefaultValues,
  GetTransactionHistory,
  GetRecentActivity,
  getProductions,
  logInProduction,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../Actions/UserActions/UserActions";
import {
  getJournalTallies,
  clearJournalStates,
} from "../../Actions/JournalActions/JournalActions";
import { handleAPIErr } from "../../Utils/Helpers";

class DashBoard extends Component {
  constructor() {
    super();
    this.state = {
      isloading: false,
      welcome: true,
      ShowPOInsights: true,
      showTransactions: true,
      showActivity: true,
      poTallies: [],
      invoiceTallies: [],
      documentsTallies: [], //e.g Draft, Pending, Approved, etc
      expenseTallies: [], //e.g Draft, Pending, Approved, etc
      timecardTallies: [],
      journalTallies: [],
    };
  }

  componentWillReceiveProps() {
    if (
      this.props.user.getAccountDetailsSuccess ||
      this.props.user.updateAccountDetailsSuccess
    ) {
      if (this.props.user.getAccountDetails.accountDetails) {
        //dashboard settings
        let dataArr = JSON.parse(
          localStorage.getItem("showOnDashboard") || "[]"
        );
        let email = this.props.user.getAccountDetails.accountDetails.email;
        let data = dataArr.find((f) => f.email === email);
        if (data) {
          this.setState({
            ShowPOInsights: data.POInsights,
            showTransactions: data.history,
            showActivity: data.activity,
          });
        }
        //end
      }
    }
  }

  async componentDidMount() {
    await this.dashBoardAPIs();
  }

  dashBoardAPIs = async (loginProdCheck) => {
    this.setState({ isLoading: true });

    let promises = [];

    /*loginProdCheck -> when user loin-prod on dasboard then call  getDefaultValues and all other tallies APIs to update 
    the state according to new login production*/
    if (loginProdCheck) {
      promises.push(this.props.getDefaultValues()); //getting users default values
    }

    let isSetngs = false; //to check if redux store contain user settings then dont call API again
    if (!this.props.user.setUserSettings.userDetails || loginProdCheck) {
      promises.push(this.props.setUserSettings());
    } else {
      isSetngs = true;
    }

    let isPOTal = false; //to check if redux store contain po tallies then dont call API again

    if (this.props.poData.poTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getPOTallies()); // get poTallies to show on Dashboard
    } else {
      isPOTal = true;
    }

    let isInvTal = false; //to check if redux store contain invoice tallies then dont call API again

    if (this.props.invoice.invoiceTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getInvoiceTallies()); // get Invoice Tallies to show on Dashboard
    } else {
      isInvTal = true;
    }

    let isDocTal = false; //to check if redux store contain doc tallies then dont call API again

    if (this.props.document.documentsTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getDocumentTallies()); //get Document Tallies to show on Dashboard
    } else {
      isDocTal = true;
    }

    let isExpTal = false; //to check if redux store contain exp tallies then dont call API again

    if (this.props.expenseData.expenseTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getExpenseTallies()); //get Expense Tallies to show on Dashboard
    } else {
      isExpTal = true;
    }

    let isTCTal = false; //to check if redux store contain timecard tallies then dont call API again

    if (this.props.timecard.timecardTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getTimecardTallies()); //get timecard Tallies to show on Dashboard
    } else {
      isTCTal = true;
    }

    let isJrnlTal = false; //to check if redux store contain journal tallies then dont call API again

    if (this.props.journal.journalTallies.length === 0 || loginProdCheck) {
      promises.push(this.props.getJournalTallies()); //get Journal Tallies to show on Dashboard
    } else {
      isJrnlTal = true;
    }
    //if productions exists in redux store then dont call API again
    let productions = this.props.user.productions || [];
    if (productions.length === 0) {
      promises.push(this.props.getProductions()); //call api to get productions list
    }

    if (this.props.user.getTransactionHistory.length === 0 || loginProdCheck) {
      promises.push(this.props.GetTransactionHistory()); //call api to get transaction history
    }
    await Promise.all(promises);
    //success case of set user settings
    if (this.props.user.setUserSettingsSuccess || isSetngs) {
      //  toast.success(this.props.user.setUserSettingsSuccess)
    }

    //error case of set user settings
    if (this.props.user.setUserSettingsError) {
      handleAPIErr(this.props.user.setUserSettingsError, this.props);
    }
    let poTalliesArr = [];
    let {
      poTallies,
      invoiceTallies,
      documentsTallies,
      expenseTallies,
      timecardTallies,
      journalTallies,
    } = this.state;
    //success case of PO tallies
    if (this.props.poData.getPOTalliesSuccess || isPOTal) {
      // toast.success(this.props.poData.getPOTalliesSuccess);
      poTallies = this.props.poData.poTallies || [];
      let opTypes = [];
      let userType = localStorage.getItem("userType");
      userType = userType ? userType.toLowerCase() : "";

      if (userType === "approver") {
        opTypes = ["approve", "hold", "pending", "declined", "approved", "all"];
      } else if (userType === "op/approver") {
        opTypes = [
          "draft",
          "approve",
          "hold",
          "pending",
          "declined",
          "approved",
          "all",
        ];
      } else {
        //operator
        opTypes = ["draft", "pending", "declined", "approved", "all"];
      }
      if (opTypes.length > 0) {
        opTypes.map((t, i) => {
          let obj = poTallies.find(
            (tl) => tl.type && tl.type.toLowerCase() === t
          );
          if (obj) {
            poTalliesArr.push(obj);
          }
        });
      }
      poTallies = poTalliesArr;
    }
    //error case of PO tallies
    if (this.props.poData.getPOTalliesError) {
      handleAPIErr(this.props.poData.getPOTalliesError, this.props);
    }
    //success case of Invoice tallies
    if (this.props.invoice.getInvoiceTalliesSuccess || isInvTal) {
      // toast.success(this.props.invoice.getInvoiceTalliesSuccess);
      let poTallies = poTalliesArr || [];
      invoiceTallies = [];
      poTallies.map((pt, i) => {
        let found = this.props.invoice.invoiceTallies.find(
          (it) => it.type.toLowerCase() === pt.type.toLowerCase()
        );
        if (found) {
          invoiceTallies.push(found);
        } else {
          invoiceTallies.push({ type: pt.type, count: 0, percent: "0%" });
        }
      });
    }
    //error case case of Invoice tallies
    if (this.props.invoice.getInvoiceTalliesError) {
      handleAPIErr(this.props.invoice.getInvoiceTalliesError, this.props);
    }

    //success case of Documents tallies
    if (this.props.document.getDocumentsTalliesSuccess || isDocTal) {
      // toast.success(this.props.document.getDocumentsTalliesSuccess);
      let poTallies = poTalliesArr || [];
      documentsTallies = [];

      poTallies.map((pt, i) => {
        let found = this.props.document.documentsTallies.find(
          (dt) => dt.docState.toLowerCase() === pt.type.toLowerCase()
        );
        if (found) {
          documentsTallies.push(found);
        } else {
          documentsTallies.push({ docState: pt.type, tally: 0, percent: "0%" });
        }
      });
    }
    //error case of Documents tallies
    if (this.props.document.getDocumentsTalliesError) {
      handleAPIErr(this.props.document.getDocumentsTalliesError, this.props);
    }

    //success case of Expense tallies
    if (this.props.expenseData.getExpenseTalliesSuccess || isExpTal) {
      // toast.success(this.props.expenseData.getExpenseTalliesSuccess);
      let poTallies = poTalliesArr || [];
      expenseTallies = [];

      poTallies.map((pt, i) => {
        let found = this.props.expenseData.expenseTallies.find(
          (et) => et.type.toLowerCase() === pt.type.toLowerCase()
        );
        if (found) {
          expenseTallies.push(found);
        } else {
          expenseTallies.push({ type: pt.type, count: 0, percent: "0%" });
        }
      });
    }
    //error case of Get Expense Tallies
    if (this.props.expenseData.getExpenseTalliesError) {
      handleAPIErr(this.props.expenseData.getExpenseTalliesError, this.props);
    }
    //success case of Timecard tallies
    if (this.props.timecard.timecardTalliesSuccess || isTCTal) {
      // toast.success(this.props.timecard.timecardTalliesSuccess);
      let poTallies = poTalliesArr || [];
      timecardTallies = [];

      poTallies.map((pt, i) => {
        let found = this.props.timecard.timecardTallies.find(
          (et) => et.type.toLowerCase() === pt.type.toLowerCase()
        );
        if (found) {
          timecardTallies.push(found);
        } else {
          timecardTallies.push({ type: pt.type, count: 0, percent: "0%" });
        }
      });
    }
    //error case of Get Timecard Tallies
    if (this.props.timecard.timecardTalliesError) {
      handleAPIErr(this.props.timecard.timecardTalliesError, this.props);
    }
    //success case of Journal tallies
    if (this.props.journal.journalTalliesSuccess || isJrnlTal) {
      // toast.success(this.props.journal.journalTalliesSuccess);
      let poTallies = poTalliesArr || [];
      journalTallies = [];

      poTallies.map((pt, i) => {
        let found = this.props.journal.journalTallies.find(
          (et) => et.type.toLowerCase() === pt.type.toLowerCase()
        );
        if (found) {
          journalTallies.push(found);
        } else {
          journalTallies.push({ type: pt.type, count: 0, percent: "0%" });
        }
      });
    }
    //error case of journal tallies
    if (this.props.journal.journalTalliesError) {
      handleAPIErr(this.props.journal.journalTalliesError, this.props);
    }

    //success case of get Productions
    if (this.props.user.getProductionsSuccess) {
      // toast.success(this.props.user.getProductionsSuccess);
    }
    //error case of get Productions
    if (this.props.user.getProductionsError) {
      handleAPIErr(this.props.user.getProductionsError, this.props);
    }
    //success case of get transaction history
    if (this.props.user.getTransactionHistorySuccess) {
      // toast.success(this.props.user.getTransactionHistorySuccess);
    }
    //error case of get transaction history
    if (this.props.user.getTransactionHistoryError) {
      handleAPIErr(this.props.user.getTransactionHistoryError, this.props);
    }

    //success case of get default vaues
    if (this.props.user.getDefaultValuesSuccess) {
      // toast.success(this.props.user.getDefaultValuesSuccess);
    }
    //error case of get default vaues
    if (this.props.user.getDefaultValuesError) {
      handleAPIErr(this.props.user.getDefaultValuesError, this.props);
    }

    this.props.clearPOStates();
    this.props.clearInvoiceStates();
    this.props.clearUserStates();
    this.props.clearJournalStates();
    this.setState({
      isLoading: false,
      poTallies,
      invoiceTallies,
      documentsTallies,
      expenseTallies,
      timecardTallies,
      journalTallies,
    });

    if (this.props.user.getRecentActivity.length === 0 || loginProdCheck) {
      await this.getRecentActivity(); //call api to get recent activities
    }
  };

  getRecentActivity = async () => {
    await this.props.GetRecentActivity(); //call api to get recent activities
    //success case of get recent activity
    if (this.props.user.getRecentActivitySuccess) {
      // toast.success(this.props.user.getRecentActivitySuccess);
    }
    //error case of get recent activity
    if (this.props.user.getRecentActivityError) {
      handleAPIErr(this.props.user.getRecentActivityError, this.props);
    }
    this.props.clearUserStates();
  };

  CloseNotify = (name) => {
    this.setState({ [name]: false });
  };

  //add new PO
  addNewPO = async () => {
    this.props.history.push("/new-purchase-order", {
      tran: "addNewPO",
    });
  };

  //Add New Invoice
  addNewInvoice = () => {
    this.props.history.push("/add-new-invoice", {
      type: "draft",
    });
  };

  //Add New Expense
  addNewExpense = () => {
    this.props.history.push("/expense-form", {
      tran: "insertExpense",
    });
  };

  //Add New Document
  addNewDocument = async () => {
    this.props.history.push("/documents-form", {
      tran: "addNewdocument",
    });
  };

  //Add New Journal
  addNewJournal = async () => {
    this.props.history.push("/journal-form", {
      tran: "addNewJournal",
    });
  };

  //Add New Timecard
  addNewTimecard = async () => {
    this.props.history.push("/add-edit-timecard", {
      tran: "newTimecard",
    });
  };

  //login production
  loginProduction = async (productionName) => {
    if (productionName) {
      this.setState({ isLoading: true });

      await this.props.logInProduction(productionName); //call api to login production

      //success case
      if (this.props.user.loginProductionSuccess) {
        store.dispatch({
          type: "CLEAR_STATES_WHEN_LOGIN_PRODUCTION",
        });

        localStorage.removeItem("getDefaultValues");
        localStorage.removeItem("loginProduction");
        localStorage.removeItem("userType");
        localStorage.removeItem("blockChart");
        localStorage.removeItem("blockPO");
        localStorage.removeItem("lockPONumber");
        localStorage.removeItem("blockInvoice");
        localStorage.removeItem("blockDocuments");
        localStorage.removeItem("blockExpense");
        localStorage.removeItem("blockPayments");
        localStorage.removeItem("blockTimecards");
        localStorage.removeItem("blockJournals");
        localStorage.removeItem("supplierApproval");
        localStorage.removeItem("blockSupplier");
        localStorage.removeItem("usePageLoading");

        localStorage.setItem("loginProduction", productionName); //to show on dashboard

        let {
          userType,
          blockChart,
          blockPO,
          lockPONumber,
          blockInvoice,
          blockDocuments,
          blockExpense,
          blockPayments,
          blockJournals,
          blockTimecards,
          supplierApproval,
          blockSupplier,
          usePageLoading,
        } = this.props.user.loginProductionData || "";

        userType = userType || "N";
        blockChart = blockChart || "N";
        blockPO = blockPO || "N";
        lockPONumber = lockPONumber || "N";
        blockInvoice = blockInvoice || "N";
        blockDocuments = blockDocuments || "N";
        blockExpense = blockExpense || "N";
        blockPayments = blockPayments || "N";
        blockJournals = blockJournals || "N";
        blockTimecards = blockTimecards || "N";
        supplierApproval = supplierApproval || "N";
        blockSupplier = blockSupplier || "N";
        usePageLoading = usePageLoading || "N";

        localStorage.setItem("userType", userType);
        localStorage.setItem("blockChart", blockChart); //if 'Y' then chart code + button will show otherwise not
        localStorage.setItem("blockPO", blockPO);
        localStorage.setItem("lockPONumber", lockPONumber); //if 'Y' then user not able to edit the PO Number in the PO Page (when PO Reference modal opens)
        localStorage.setItem("blockInvoice", blockInvoice);
        localStorage.setItem("blockDocuments", blockDocuments);
        localStorage.setItem("blockExpense", blockExpense);
        localStorage.setItem("blockPayments", blockPayments);
        localStorage.setItem("blockJournals", blockJournals);
        localStorage.setItem("blockTimecards", blockTimecards);
        localStorage.setItem("supplierApproval", supplierApproval);
        localStorage.setItem("usePageLoading", usePageLoading);
        localStorage.setItem("blockSupplier", blockSupplier); //if 'Y' then user not able to add/edit the supplier

        this.getAccountDetails();
        await this.dashBoardAPIs(true);
      }
      //error case of
      if (this.props.user.loginProductionError) {
        handleAPIErr(this.props.user.loginProductionError, this.props);
      }
      this.props.clearUserStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select A Production For Login!");
    }
  };

  getAccountDetails = async () => {
    await this.props.getAccountDetails();

    //success case of Get Account Details
    if (this.props.user.getAccountDetailsSuccess) {
      // toast.success(this.props.user.getAccountDetailsSuccess);
    }
    //error case of Get Account Details
    if (this.props.user.getAccountDetailsError) {
      handleAPIErr(this.props.user.getAccountDetailsError, this.props);
    }
    this.props.clearUserStates();
  };

  handleTallies = async (type, page) => {
    if (page === "orders") {
      this.props.history.push("/order", {
        dashboard: true,
        tallType: type,
      });
    } else if (page === "invoices") {
      this.props.history.push("/invoice", {
        dashboard: true,
        tallType: type,
      });
    } else if (page === "documents") {
      this.props.history.push("/documents", {
        dashboard: true,
        tallType: type,
      });
    } else if (page === "journals") {
      this.props.history.push("/journals", {
        dashboard: true,
        tallType: type,
      });
    } else if (page === "timecard") {
      this.props.history.push("/timecards", {
        dashboard: true,
        tallType: type,
      });
    } else {
      this.props.history.push("/expenses", {
        dashboard: true,
        tallType: type,
      });
    }
  };

  render() {
    let blockPO = localStorage.getItem("blockPO") || "N";
    let blockInvoice = localStorage.getItem("blockInvoice") || "N";
    let blockDocuments = localStorage.getItem("blockDocuments") || "N";
    let blockExpense = localStorage.getItem("blockExpense") || "N";
    let blockSupplier = localStorage.getItem("blockSupplier") || "N";
    let blockJournals = localStorage.getItem("blockJournals") || "N";
    let blockTimecards = localStorage.getItem("blockTimecards") || "N";

    let {
      poTallies,
      invoiceTallies,
      expenseTallies,
      documentsTallies,
      journalTallies,
      timecardTallies,
    } = this.state;

    return (
      <>
        <div className="dashboard">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

          {/* top nav bar */}
          <Header
            props={this.props}
            company={true}
            loginProduction={this.loginProduction}
            loginProductionSuccess={this.props.user.loginProductionSuccess}
            getRecentActivity={this.getRecentActivity}
            dashboard={true}
          />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side nav menu */}
            <SideNav />
            {/* end */}

            <section id="contents">
              <div className="body_content">
                {this.state.welcome ? (
                  <div className="welcome">
                    <div className="containr-fluid">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="content">
                            <img
                              src="images/white-close.png"
                              onClick={() => this.CloseNotify("welcome")}
                              className="white_close"
                              alt="close"
                            />
                            <h2>WELCOME TO DIGITAL PAPER FLOW</h2>
                            <p>
                              Hello! Let's get started with Digital Paper Flow.
                              This is your dashboard to quickly show you recent
                              activity and a summary of orders and invoices.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <section className="statistics">
                  <div className="containr-fluid">
                    <div className="row">
                      {this.state.ShowPOInsights ? (
                        <div className="col-12">
                          <img
                            src="images/gray-close.png"
                            onClick={() => this.CloseNotify("ShowPOInsights")}
                            className="gray_close xs-position"
                            alt="close"
                          />
                          <div className="table-responsive home_table">
                            <table className="table home_stat_table">
                              <thead>
                                <tr>
                                  <th scope="col"></th>
                                  {this.state.poTallies.map((pt, i) => {
                                    return (
                                      <th key={i} scope="col">
                                        {pt.type}
                                      </th>
                                    );
                                  })}
                                </tr>
                              </thead>
                              <tbody>
                                {blockPO === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Orders</th>
                                    {poTallies.map((pt, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              pt.type,
                                              "orders"
                                            )
                                          }
                                        >
                                          <span> {pt.count}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}
                                {blockInvoice === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Invoices</th>
                                    {invoiceTallies.map((it, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              it.type,
                                              "invoices"
                                            )
                                          }
                                        >
                                          <span> {it.count}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}

                                {blockExpense === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Expenses</th>
                                    {expenseTallies.map((et, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              et.type,
                                              "expenses"
                                            )
                                          }
                                        >
                                          <span> {et.count}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}
                                {blockDocuments === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Documents</th>
                                    {documentsTallies.map((dt, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              dt.docState,
                                              "documents"
                                            )
                                          }
                                        >
                                          <span> {dt.tally}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}
                                {blockJournals === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Journals</th>
                                    {journalTallies.map((jr, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              jr.type,
                                              "journals"
                                            )
                                          }
                                        >
                                          <span> {jr.count}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}
                                {blockTimecards === "Y" ? (
                                  ""
                                ) : (
                                  <tr>
                                    <th scope="row">Timecards</th>
                                    {timecardTallies.map((tc, i) => {
                                      return (
                                        <td
                                          className="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            this.handleTallies(
                                              tc.type,
                                              "timecard"
                                            )
                                          }
                                        >
                                          <span> {tc.count}</span>
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="col-12">
                        <div className="row">
                          {/* Transactions History */}
                          {this.state.showTransactions ? (
                            <div className="col-xl-7">
                              <div className="forgot_body recent_act">
                                <img
                                  src="images/gray-close.png"
                                  onClick={() =>
                                    this.CloseNotify("showTransactions")
                                  }
                                  className="gray_close"
                                  alt="close"
                                />
                                <div className="row">
                                  <div className="col-12 mb-2">
                                    <h4 className="recent_actives">
                                      Transactions History
                                    </h4>
                                  </div>
                                  {this.props.user.getTransactionHistory.map(
                                    (t, i) => {
                                      return (
                                        <div key={i} className="col-md-12">
                                          <div className="activity_item_main comments_main recent_active_main tans_history purpal">
                                            <div className="row">
                                              <div className="col-auto">
                                                <div className="activity_9">
                                                  <p className="trans_price">
                                                    {t.amount.toFixed(2)}
                                                  </p>
                                                  <p>
                                                    <span className="trans_date_time">
                                                      {/* Today{" "} */}
                                                      {moment
                                                        .unix(t.date)
                                                        .format("DD MMM YYYY")
                                                        .toUpperCase()}
                                                    </span>
                                                    <span className="trans_date_time">
                                                      {moment
                                                        .unix(t.time)
                                                        .format("hh:mm a")}
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="col">
                                                <div className="col-12 p-all-0">
                                                  <div className="row p-all-0">
                                                    <div className="col-md-5 p-md-0">
                                                      <div className="activity_9 p-0">
                                                        <h6 className="activity_9_h5 p-0">
                                                          {t.approver}
                                                        </h6>
                                                      </div>
                                                    </div>
                                                    <div className="col align-self-center">
                                                      <div className="activity_9">
                                                        <p>{t.status}</p>
                                                      </div>
                                                    </div>
                                                    <div className="col-auto align-self-center">
                                                      <div className="activity_9">
                                                        <p>{t.userName}</p>
                                                      </div>
                                                    </div>

                                                    <div className="col-12 p-0 border-top">
                                                      <div className="activity_9 p-0">
                                                        <p>
                                                          {t.description}
                                                          {/* <br />
                                                    COLOURED PAPER */}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {/* end */}
                          {/* Recent Activity */}
                          {this.state.showActivity ? (
                            <div className="col-xl-5 pl-xl-0">
                              <div className="forgot_body recent_act pb-md-3">
                                <img
                                  src="images/gray-close.png"
                                  onClick={() =>
                                    this.CloseNotify("showActivity")
                                  }
                                  className="gray_close"
                                  alt="close"
                                />
                                <div className="row">
                                  <div className="col-12 mb-2">
                                    <h4 className="recent_actives">
                                      Recent Activity
                                    </h4>
                                  </div>
                                  {this.props.user.getRecentActivity.map(
                                    (a, i) => {
                                      return (
                                        <div key={i} className="col-md-12">
                                          <div className="activity_item_main comments_main recent_active_main">
                                            <div className="row">
                                              <div className="col-auto">
                                                <div className="recent_active_pic">
                                                  <img
                                                    src={
                                                      a.USERAVATAR
                                                        ? "data:image/png;base64," +
                                                          a.USERAVATAR
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
                                              <div className="col-sm-auto align-self-center pr-md-4 t-right">
                                                <div className="activity_3 ">
                                                  <p>
                                                    {moment
                                                      .unix(a.actionDate)

                                                      .format("DD MMM YYYY")
                                                      .toUpperCase()}{" "}
                                                    {moment
                                                      .unix(a.actionTime)
                                                      .format("hh:mm a")}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {/* end */}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
            <div className="sticky_drop">
              <Dropdown
                alignRight={true}
                drop="up"
                className="dash analysis-card-dropdwn drop__dash--clickbuton"
              >
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    src="images/add-icon.png"
                    className="img-fluid add_icon_img"
                    alt="add icon"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {blockInvoice === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewInvoice}>
                      <a href="#">New Invoice</a>
                    </Dropdown.Item>
                  )}
                  {blockPO === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewPO}>
                      <a href="#">New PO</a>
                    </Dropdown.Item>
                  )}
                  {blockSupplier === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item>
                      <Link to="/new-supplier2">New Supplier</Link>
                    </Dropdown.Item>
                  )}
                  {blockExpense === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewExpense}>
                      <a href="#">New Expense</a>
                    </Dropdown.Item>
                  )}
                  {blockDocuments === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewDocument}>
                      <a href="#">New Document</a>
                    </Dropdown.Item>
                  )}
                  {blockJournals === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewJournal}>
                      <a href="#">New Journal</a>
                    </Dropdown.Item>
                  )}
                  {blockTimecards === "Y" ? (
                    ""
                  ) : (
                    <Dropdown.Item onClick={this.addNewTimecard}>
                      <a href="#">New Timecard</a>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          {/* end */}
          <ModileResponsiveMenu props={this.props} active="dashboard" />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  poData: state.poData,
  invoice: state.invoice,
  chart: state.chart,
  document: state.document,
  expenseData: state.expense,
  journal: state.journal,
  timecard: state.timecard,
});

export default connect(mapStateToProps, {
  setUserSettings,
  getAccountDetails,
  logInProduction,
  getDefaultValues,
  getPOTallies,
  clearPOStates,
  getInvoiceTallies,
  clearInvoiceStates,
  getProductions,
  GetTransactionHistory,
  GetRecentActivity,
  getDocumentTallies,
  clearDocumentStates,
  getExpenseTallies,
  getJournalTallies,
  getTimecardTallies,
  clearTimecardStates,
  clearJournalStates,
  clearExpenseStates,
  clearUserStates,
  clearStatesAfterLogout,
})(DashBoard);
