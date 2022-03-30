import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import {
  getDefaultValues,
  logOutUser,
  getProductions,
  logInProduction,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../Actions/UserActions/UserActions";
import { handleAPIErr } from "../../Utils/Helpers";

class LoginTable extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      productionName: "", //contains production name when user clicks on production list for login production
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });
    localStorage.removeItem("userContact");

    await this.props.getProductions(); //call api to get productions list

    //success case
    if (this.props.user.getProductionsSuccess) {
      // toast.success(this.props.user.getProductionsSuccess);
      let productions = this.props.user.productions;
      // if there is only one prod. then automatically login into that prod
      if (productions && productions.length === 1) {
        await this.setState({ productionName: productions[0].productionName });
        await this.loginProduction();
      }
    }
    //error case of
    if (this.props.user.getProductionsError) {
      //if user not login then redirects it to login page
      handleAPIErr(this.props.user.getProductionsError, this.props);
    }
    let prod = localStorage.getItem("loginProduction");
    this.setState({ productionName: prod });

    this.props.clearUserStates();
    this.setState({ isLoading: false });
  }

  logout = async () => {
    this.setState({ isLoading: true });

    await this.props.logOutUser(); //call user logout api
    //successfully logout
    if (this.props.user.logoutSuccess) {
      // toast.success(this.props.user.logoutSuccess);
      this.props.clearStatesAfterLogout();
      this.props.history.push("/login");
    }
    //error while logout user
    if (this.props.user.logoutError) {
      if (this.props.user.logoutError === "User has not logged in.") {
        this.props.history.push("/login");
        toast.error(this.props.user.logoutError);
        this.props.clearStatesAfterLogout();
      } else {
        toast.error(this.props.user.logoutError);
      }
    }
    this.setState({ isLoading: false });
  };

  handleproductionName = async (pn) => {
    this.setState({ productionName: pn });
  };

  loginProduction = async () => {
    let { productionName } = this.state;

    if (productionName) {
      this.setState({ isLoading: true });

      await this.props.logInProduction(productionName); //call api to login production

      //success case
      if (this.props.user.loginProductionSuccess) {
        await this.props.getDefaultValues(); //getting users default values
        //success case of get default vaues
        if (this.props.user.getDefaultValuesSuccess) {
          // toast.success(this.props.user.getDefaultValuesSuccess);
          //Default values are svaed in LocalStorage in reducer
        }
        //error case of get default vaues
        if (this.props.user.getDefaultValuesError) {
          handleAPIErr(this.props.user.getDefaultValuesError, this.props);
        }

        //set default setting
        let obj = {
          receivedDateCheck: false,
          descriptionCheck: true,
          paymentReferenceCheck: false,
          paymentDateCheck: false,
        };
        localStorage.setItem("displayAddInvoiceSettings", JSON.stringify(obj));

        //these all are removed in user reducer when "CLEAR_STATES_AFTER_LOGOUT" is dispatched
        localStorage.setItem("loginProduction", productionName); //to show on dashboard

        /*I've added a few more fields during login for access to each module:
        blockPO - determines if the user has access to the order module
        lockPONumber - will now be used instead to determine if the user can edit po numbers
        blockInvoice - determines access to the invoice module
        blockDocuments - determines access to the documents module
        blockExpense - determines access to the expense module
        blockPayment - determines access to the payment module
        blockJournals - determines access to the Journals and Dist Changes modules
        supplierApproval - determines access to the Supplier Approval module
        */
        let {
          userType,
          blockChart,
          blockPO,
          lockPONumber,
          blockInvoice,
          blockDocuments,
          blockExpense,
          blockPayments,
          blockTimecards,
          blockJournals,
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
        blockTimecards = blockTimecards || "N";
        blockJournals = blockJournals || "N";
        supplierApproval = supplierApproval || "N";
        blockSupplier = blockSupplier || "N";
        usePageLoading = usePageLoading || "N";

        localStorage.setItem("userType", userType); //to show the email or phone of the user after login "code has been send to '...'""
        localStorage.setItem("blockChart", blockChart); //if 'Y' then chart code + button will show otherwise not
        localStorage.setItem("blockPO", blockPO);
        localStorage.setItem("lockPONumber", lockPONumber); //if 'Y' then user not able to edit the PO Number in the PO Page (when PO Reference modal opens)
        localStorage.setItem("blockInvoice", blockInvoice);
        localStorage.setItem("blockDocuments", blockDocuments);
        localStorage.setItem("blockExpense", blockExpense);
        localStorage.setItem("blockPayments", blockPayments);
        localStorage.setItem("blockTimecards", blockTimecards);
        localStorage.setItem("blockJournals", blockJournals);
        localStorage.setItem("supplierApproval", supplierApproval);
        localStorage.setItem("usePageLoading", usePageLoading);
        localStorage.setItem("blockSupplier", blockSupplier); //if 'Y' then user not able to add/edit the supplier

        // toast.success(this.props.user.loginProductionSuccess);

        //Client-> Can you save the last page a user was logged into so when they log in next it takes them back to that page?
        let lastPageLogin = localStorage.getItem("lastPageLogin");
        if (lastPageLogin) {
          this.props.history.push(lastPageLogin);
        } else {
          this.props.history.push("/dashboard");
        }
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

  render() {
    let url = localStorage.getItem("API_URL") || "";
    if (!url) {
      return <Redirect to={"/login"} />;
    }
    return (
      <>
        <div className="container-fluid pl-0">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
          <div className="main-wrap">
            <div className="row">
              <div className="col-12 col-md-6 pr-sm-0 pr-xs-0 order2">
                <div className="left_slider">
                  <div
                    id="login_left_slider"
                    className="carousel slide mm_login_slider"
                    data-ride="carousel"
                  >
                    <ol className="carousel-indicators">
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="0"
                        className="active"
                      ></li>
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="1"
                      ></li>
                      <li
                        data-target="#login_left_slider"
                        data-slide-to="2"
                      ></li>
                    </ol>

                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <img
                          src="images/1st_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Dashboard Page</h5>
                          <p>
                            Your dashboard quickly shows you recent activity and
                            a summary of orders and invoices.
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/2nd_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Orders Screen</h5>
                          <p>
                            Visually see orders when drafting and approving.
                          </p>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img
                          src="images/3rd_card.png"
                          className="d-block img-fluid mx-auto"
                          alt="slide"
                        />
                        <div className="carousel-caption">
                          <h5>Invoices Screen</h5>
                          <p>OCR Invoices for quick entry and PO matching.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="login-badges">
                    <a
                      href="https://play.google.com/store/apps/details?id=com.digital_paper_flow&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                      target="_blank"
                    >
                      <img
                        src="images/google-play-store.png"
                        className="img-fluid"
                        alt="google-play"
                      />
                    </a>
                    <a
                      href="https://apps.apple.com/ng/app/digital-paper-flow/id1504166985"
                      style={{
                        display: "inline-block",
                      }}
                      target="_blank"
                    >
                      <img
                        src="images/apple-store.png"
                        className="img-fluid"
                        alt="google-play"
                      />
                    </a>
                  </div>
                  <p className="copy_right">
                    @ Copyright TPH Technologies 2018
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 order1">
                <div className="login_side tabel">
                  <div className="row">
                    <div className="col-12">
                      <div className="site_log">
                        <img
                          src="images/logo.png"
                          className="d-block img-fluid mx-auto pr-sm-5"
                          alt="Logo"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="login_form">
                        <div className="login_table_list scroll-inner-container">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr>
                                <th scope="col">Business Unit</th>
                                <th scope="col">Approve PO</th>
                                <th scope="col">Approve Invoices</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.props.user.productions.map((prod, i) => {
                                return (
                                  <tr
                                    key={i}
                                    onClick={() =>
                                      this.handleproductionName(
                                        prod.productionName
                                      )
                                    }
                                    onDoubleClick={() =>
                                      this.loginProduction(prod.productionName)
                                    }
                                    className={
                                      this.state.productionName ===
                                      prod.productionName
                                        ? "active cursorPointer"
                                        : "cursorPointer"
                                    }
                                  >
                                    <th scope="row">{prod.productionName}</th>
                                    <td>
                                      {prod.approveOrders ||
                                      prod.approveOrders == 0
                                        ? prod.approveOrders
                                        : ""}
                                    </td>
                                    <td>
                                      {prod.approveInvoices ||
                                      prod.approveInvoices == 0
                                        ? prod.approveInvoices
                                        : ""}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row no-gutters login_table_btns">
                    <div className="col-12">
                      <div className="login_btn">
                        <button
                          type="submit"
                          className="btn btn-primary login_blue"
                          onClick={this.loginProduction}
                        >
                          Login
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary login_white"
                          onClick={this.logout}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="term">Term of use. Privacy policy.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  getDefaultValues,
  logOutUser,
  getProductions,
  logInProduction,
  clearUserStates,
  clearStatesAfterLogout,
})(LoginTable);
