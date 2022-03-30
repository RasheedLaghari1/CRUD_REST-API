import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import moment from "moment";
import CancelReIssue from "../CancelReIssue/CancelReIssue";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import Report from "../Report/Report";
import { toast } from "react-toastify";
import TransactionDetails from "../TransactionDetails/TransactionDetails";
import { handleSaveSettings, handleCloseSettingModal, tableSetting, handleAPIErr , downloadAttachments} from "../../../Utils/Helpers";
import * as InvoiceActions from "../../../Actions/InvoiceActions/InvoiceActions";

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      openCancelReIssueModal: false,
      openReportModal: false,
      openTransacDetailModal: false,
      transactions: [
        { checked: false },
        { checked: false },
        { checked: false },
        { checked: false },
        { checked: false },
      ],
      pageLength: 10,
      columns: [],
      transactionDetails: []
    };
  }
  openModal = (name) => {
    let columns = []
    let aoColumns = []
    this.setState({ [name]: true }, () => {
      if (name === 'openTransacDetailModal') {
        columns = [
          { name: 'PO', hide: false },
          { name: 'Action', hide: false },
          { name: 'Chart Sort', hide: false },
          { name: 'Chart Code', hide: false },
          { name: 'Tracking Codes', hide: false },
          { name: 'Description', hide: false },
          { name: 'Amount', hide: false },
        ]
        //adding the column names
        aoColumns[0] = { sName: 'checkbox' }
        columns.map(c => aoColumns.push({ sName: c.name }))
        aoColumns[columns.length + 1] = { sName: 'menus' }

        let result = tableSetting(columns, aoColumns, 'transac_details')
        this.setState({ ...result })
      }
    })
  }
  closeModal = (name) => {
    this.setState({ [name]: false, transactionDetails:[]})
  }
  /********Detail Filters End*********/
  //Settings Popup
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value })
    } else {
      let { columns } = this.state
      columns[i].hide = e.target.checked
      this.setState({ columns })
    }
  }
  handleSaveSettings = (name) => {
    let { columns, pageLength } = this.state;
    handleSaveSettings(columns, name, pageLength)
    this.closeModal('openSettingsModal')
  }
  handleCloseSettingModal = (name) => {
    let { columns } = this.state;
    let result = handleCloseSettingModal(columns, name)
    this.setState({ ...result }, () => {
      this.closeModal('openSettingsModal')
    })
  }
  getTransactionDetails = async () => {
    let {
      transactions
    } = this.props.stateData
    let trans = []
    transactions.map(p => {
      if (p.checked) {
        trans.push(p.tran)
      }
    })
    if (trans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.getTransactionDetails(trans);
      if (this.props.invoice.getTransactionDetailsSuccess) {
        let getTransactionDetails = this.props.invoice.getTransactionDetails || [];
        this.setState({ transactionDetails: getTransactionDetails }, () => {
          this.openModal('openTransacDetailModal')
        })
      }
      if (this.props.invoice.getTransactionDetailsError) {
        handleAPIErr(this.props.invoice.getTransactionDetailsError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error('Please Select Transactions First!')
    }

  };

  exportTransactions = async () => {
    let {
      transactions
    } = this.props.stateData
    let trans = []
    transactions.map(p => {
      if (p.checked) {
        trans.push(p.tran)
      }
    })
    if (trans.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportTransactions(trans);
      if (this.props.invoice.exportTransactionsSuccess) {
        let exportTransactions = this.props.invoice.exportTransactions || '';
        let obj ={
          contentType: 'application/vnd.ms-excel',
          attachment: exportTransactions
        }
        downloadAttachments(obj, 'Transactions')
      }
      if (this.props.invoice.exportTransactionsError) {
        handleAPIErr(this.props.invoice.exportTransactionsError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    } else {
      toast.error('Please Select Transactions First!')
    }
  };

  render() {
    let {
      openTransactionModal,
      openSettingsModal,
      pageLength,
      columns,
      transactions,
      checkAll
    } = this.props.stateData

    if (!openTransactionModal) {
      openSettingsModal = false
    }

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={openTransactionModal}
          onHide={() => this.props.closeModal("openTransactionModal")}
          className="forgot_email_modal modal_704 mx-auto supp_activity supp2_transaction"
        >
          <Modal.Body>
            <div className="container-fluid p-0">
              <div className="main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center">
                    <div className="user_access_main ">
                      <div className="setting_header thead_bg">
                        <h3 className="Indirecttaxcode-poup_heading">
                          Transactions
                        </h3>
                        <div className="Indirecttaxcode-poup_can-sav-btn">
                          <button className="btn can-btn1" onClick={() => this.props.closeModal("openTransactionModal")}>
                            <img
                              src="images/user-setup/check-white.png"
                              alt="check"
                            />
                            Save
                          </button>
                          <button
                            onClick={() => this.props.closeModal("openTransactionModal")}
                            className="btn can-btn1 pl-3"
                          >
                            <img
                              src="images/user-setup/cancel-white.png"
                              alt="cancel"
                            />
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="user_access_body">
                        <div className="main-sec supp2-modal-tabel">
                          <div className="col-sm-12 user_access_inner table_white_box">
                            <div className="supplier_activity_plsIcons">
                              <div>
                                <Dropdown
                                  alignRight="false"
                                  drop="down"
                                  className="analysis-card-dropdwn setting_popup_dots"
                                >
                                  <Dropdown.Toggle
                                    variant="sucess"
                                    id="dropdown-basic"
                                  >
                                    <span className="dots_img">
                                      <img
                                        src="./images/user-setup/dots.png"
                                        alt="filter"
                                      ></img>
                                    </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => this.props.openModal('openReportModal')}>Reports</Dropdown.Item>
                                    <Dropdown.Item onClick={this.exportTransactions}>Export</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.openModal('openCancelReIssueModal')}>Invoice Cancel Re-issue</Dropdown.Item>
                                    <Dropdown.Item onClick={this.getTransactionDetails}>Detail</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="table-responsive sipplier2-scroll">
                              <table
                                id="transactions"
                                className="table dt-responsive data-table-d mt-50"
                              >
                                <thead className="thead_bg">
                                  <tr>
                                    <th>
                                      <div className="custom-radio">
                                        <label
                                          className="check_main remember_check"
                                          htmlFor="customRadio1109"
                                        >
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="customRadio1109"
                                            name="all"
                                            checked={checkAll}
                                            onClick={(e) => { this.props.hanldeCheckbox(e, 'all', '', 'transactions') }}
                                          />
                                          <span className="click_checkmark global_checkmark"></span>
                                        </label>
                                      </div>
                                    </th>
                                    <th>
                                      <span className="hed">Amount</span>
                                    </th>
                                    <th>
                                      <span className="hed">Cu</span>
                                    </th>
                                    <th>
                                      <span className="hed">Invoice</span>
                                    </th>
                                    <th>
                                      <span className="hed">InvDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">DueDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">Reference</span>
                                    </th>
                                    <th>
                                      <span className="hed">Bank</span>
                                    </th>
                                    <th>
                                      <span className="hed">Sep</span>
                                    </th>
                                    <th>
                                      <span className="hed">Hold</span>
                                    </th>
                                    <th>
                                      <span className="hed">Cheque</span>
                                    </th>
                                    <th>
                                      <span className="hed">ChqDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">PresDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">Period</span>
                                    </th>
                                    <th>
                                      <span className="hed">Voucher</span>
                                    </th>
                                    <th>
                                      <span className="hed">Batch</span>
                                    </th>
                                    <th>
                                      <span className="hed">Tran</span>
                                    </th>
                                    <th>
                                      <span
                                        className="user_setup_hed2"
                                        onClick={() =>
                                          this.props.openModal(
                                            "openSettingsModal"
                                          )
                                        }
                                      >
                                        {" "}
                                        <img
                                          src="./images/user-setup/bars.png"
                                          alt="bars"
                                        ></img>
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    transactions.map((tran, ind) => {
                                      return <tr>
                                        <td>
                                          <div className="custom-radio">
                                            <label className="check_main remember_check" htmlFor={`listCheck${ind}`}>
                                              <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`listCheck${ind}`}
                                                name={'tranListCheck'}
                                                checked={tran.checked}
                                                onClick={(e) => { this.props.hanldeCheckbox(e, tran, ind, 'transactions') }}
                                              />
                                              <span className="click_checkmark"></span>
                                            </label>
                                          </div>
                                        </td>
                                        <td>{tran.amount}</td>
                                        <td>{tran.currency}</td>
                                        <td>{tran.invoice}</td>
                                        <td>
                                        {moment(tran.invoiceDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>
                                        {moment(tran.dueDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>{tran.reference}</td>
                                        <td>{tran.bankCode}</td>
                                        <td>{tran.sep}</td>
                                        <td>{tran.hold}</td>
                                        <td>{tran.cheque}</td>
                                        <td>
                                        {moment(tran.chequeDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>
                                        {moment(tran.presentDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>{tran.period}</td>
                                        <td>{tran.voucher}</td>
                                        <td>{tran.batch}</td>
                                        <td>{tran.tran}</td>

                                        <td></td>
                                      </tr>
                                    })
                                  }
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
          </Modal.Body>
        </Modal>
        <Settings
          openSettingsModal={openSettingsModal}
          columns={columns || []}
          pageLength={pageLength}
          handleChangeSettings={this.props.handleChangeSettings}
          handleSaveSettings={this.props.handleSaveSettings}
          handleCloseSettingModal={this.props.handleCloseSettingModal}
        />
        <CancelReIssue
          openCancelReIssueModal={this.state.openCancelReIssueModal}
          heading='Invoice Cancel Re-issue'
          closeModal={this.closeModal}
        />
        {/* <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
        /> */}
        <TransactionDetails
          closeModal={this.closeModal}
          openModal={this.openModal}
          stateData={this.state}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={() => this.handleSaveSettings('transac_details')}
          handleCloseSettingModal={() => this.handleCloseSettingModal('transac_details')}
        // hanldeCheckbox={this.props.hanldeCheckbox}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  invoice: state.invoice,
});
export default connect(mapStateToProps, {
  getTransactionDetails: InvoiceActions.getTransactionDetails,
  exportTransactions: InvoiceActions.exportTransactions,
  clearInvoiceStates: InvoiceActions.clearInvoiceStates,
})(Transactions);
