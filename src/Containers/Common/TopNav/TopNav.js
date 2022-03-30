import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class TopNav extends Component {
  constructor() {
    super();
    this.state = {
      openUserSetupMenu: false,
    };
  }
  handleUserSetup = () => {
    this.setState({ openUserSetupMenu: !this.state.openUserSetupMenu });
  };

  render() {
    let url = localStorage.getItem("API_URL") || "";
    if (!url) {
      return <Redirect to={"/login"} />;
    }

    let blockPO = localStorage.getItem("blockPO") || "N";
    let blockPayments = localStorage.getItem("blockPayments") || "N";
    let blockTimecards = localStorage.getItem("blockTimecards") || "N";
    let blockJournals = localStorage.getItem("blockJournals") || "N";
    let supplierApproval = localStorage.getItem("supplierApproval") || "N";
    let blockSupplier = localStorage.getItem("blockSupplier") || "N";
    let blockInvoice = localStorage.getItem("blockInvoice") || "N";
    let blockDocuments = localStorage.getItem("blockDocuments") || "N";
    let blockExpense = localStorage.getItem("blockExpense") || "N";

    let userType = localStorage.getItem("userType") || "";
    userType = userType.toLowerCase();
    let link = this.props.user.getHelpPage || "#";
    return (
      <>
        {/* top nav toggle*/}
        <div className="collapse" id="top_nav_toggle1">
          <aside className="side-nav sidebar--scroll--wrapper" id="">
            <ul className="categories sidebar--scroll--inner">
              <img
                src="images/menu-toggle.png"
                data-show="show-side-navigation1"
                className="dash_menu_toggle top--nav"
                alt="menu-toggle"
              />
              <li>
                <Link to="/dashboard">
                  <img
                    src="images/menu-home.png"
                    className="dash_menu_item"
                    alt="menu-toggle"
                  />
                  Home
                </Link>
              </li>
              {blockPO === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/order">
                    <img
                      src="images/menu-state.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Orders
                  </Link>
                </li>
              )}

              {blockInvoice === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/invoice">
                    <img
                      src="images/menu-invoice.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Invoices
                  </Link>
                </li>
              )}
              {blockExpense === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/expenses">
                    <img
                      src="images/menu-invoice.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Expenses
                  </Link>
                </li>
              )}
              {blockDocuments === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/documents">
                    <img
                      src="images/menu-invoice.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Documents
                  </Link>
                </li>
              )}
              {blockSupplier === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/suppliers2">
                    <img
                      src="images/menu-suppliers.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Suppliers
                  </Link>
                </li>
              )}
              {/* Supplier approval screen  */}
              {/* Supplier approval screen  */}
              {supplierApproval === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/suppliers">
                    <img
                      src="images/menu-suppliers.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Suppliers Approval
                  </Link>
                </li>
              )}

              {/* new pages add  */}
              {blockJournals === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/journals">
                    <img
                      src="images/journal.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Journals
                  </Link>
                </li>
              )}
              {blockJournals === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/dist-changes">
                    <img
                      src="images/dist-changes.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Dist Changes
                  </Link>
                </li>
              )}

              {blockPayments === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/payments">
                    <img
                      src="images/credit-card.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Payments
                  </Link>
                </li>
              )}

              {blockTimecards === "Y" ? (
                ""
              ) : (
                <li>
                  <Link to="/timecards">
                    <img
                      src="images/credit-card.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Timecards
                  </Link>
                </li>
              )}

              <li>
                <Link to="/report">
                  <img
                    src="images/menu-report.png"
                    className="dash_menu_item"
                    alt="menu-toggle"
                  />
                  Reports
                </Link>
              </li>
              {(userType === "admin" || userType === "sysadmin") && (
                <li>
                  <span
                    className="usersetu_side_menu_span "
                    onClick={this.handleUserSetup}
                  >
                    <img
                      src="images/menu-steup.png"
                      className="dash_menu_item"
                      alt="menu-toggle"
                    />
                    Setup
                  </span>
                  {this.state.openUserSetupMenu ? (
                    <ul className="usersetu_sidesub_menu">
                      <li>
                        <Link to="/user-setup">User Setup</Link>
                      </li>
                      <li>
                        <Link to="/approval-setup">Approval Setup</Link>
                      </li>
                      <li>
                        <Link to="/custom-fields">Custom Fields</Link>
                      </li>
                      <li>
                        <Link to="/custom-line-type">Custom Line Types</Link>
                      </li>
                      <li>
                        <Link to="/departments">Departments</Link>
                      </li>
                      <li>
                        <Link to="/chart-of-accounts">Chart of Accounts</Link>
                      </li>
                      <li>
                        <Link to="/indirect-tax-codes">Tax Codes</Link>
                      </li>
                      <li>
                        <Link to="/currencies">Currency</Link>
                      </li>
                      {/* <li>
                      <Link to="/currencies-details">Currency Details</Link>
                    </li> */}
                      <li>
                        <Link to="/business-units">Business Unit</Link>
                      </li>
                      <li>
                        <Link to="/chart-setup">Chart Setup</Link>
                      </li>
                      <li>
                        <Link to="/tracking-codes-layout">
                          Tracking Codes Layout
                        </Link>
                      </li>
                      <li>
                        <Link to="/order-template">Order Template</Link>
                      </li>
                      <li>
                        <Link to="/email-template">Email Template</Link>
                      </li>
                      <li>
                        <Link to="/invoice-ocr-setup">Invoice OCR Setup</Link>
                      </li>
                      <li>
                        <Link to="/user-defaults">User Defaults</Link>
                      </li>
                      <li>
                        <Link to="/system-defaults">System Defaults</Link>
                      </li>
                      <li>
                        <Link to="/batch-list">Batch List</Link>
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </li>
              )}
              <li>
                <a href={link} target="_blank">
                  <img
                    src="images/menu-help.png"
                    className="dash_menu_item"
                    alt="menu-toggle"
                  />
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/search">
                  <img
                    src="images/menu-search.png"
                    className="dash_menu_item"
                    alt="menu-toggle"
                  />
                  Search
                </Link>
              </li>
            </ul>
          </aside>
        </div>
        {/* end */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(TopNav);
