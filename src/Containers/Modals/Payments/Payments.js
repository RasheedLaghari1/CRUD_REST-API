import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import CancelReIssue from "../CancelReIssue/CancelReIssue";
import Report from "../Report/Report";
import PaymentDetails from "../PaymentDetails/PaymentDetails";
import { handleSaveSettings, handleCloseSettingModal, tableSetting, handleAPIErr , downloadAttachments} from "../../../Utils/Helpers";
import * as PaymentActions from "../../../Actions/PaymentActions/PaymentActions";
import { toast } from "react-toastify";

class Payments extends Component {
  constructor() {
    super();
    this.state = {
      openCancelReIssueModal: false,
      openReportModal: false,
      openPaymentDetailModal: false,
      openSettingsModal: false,
      pageLength: 10,
      columns: [],
      paymentDetails: []
    };
  }
  openModal = (name) => {
    let columns = []
    let aoColumns = []
    this.setState({ [name]: true }, () => {
      if (name === 'openPaymentDetailModal') {
        columns = [
          { name: 'Invoice', hide: false },
          { name: 'Reference', hide: false },
          { name: 'Batch', hide: false },
          { name: 'Voucher', hide: false },
          { name: 'Description', hide: false },
          { name: 'Amount', hide: false },
          { name: 'InvDate', hide: false },
          { name: 'Tran', hide: false }
        ]
        //adding the column names
        aoColumns[0] = { sName: 'checkbox' }
        columns.map(c => aoColumns.push({ sName: c.name }))
        aoColumns[columns.length + 1] = { sName: 'menus' }

        let result = tableSetting(columns, aoColumns, 'payment_details')
        this.setState({ ...result })
      }
    })
  }
  closeModal = (name) => {
    this.setState({ [name]: false , paymentDetails:[]})
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
  getPaymentDetails = async () => {
    let {
      payments
    } = this.props.stateData
    let chequeIDs = []
    payments.map(p => {
      if (p.checked) {
        chequeIDs.push(p.chequeID)
      }
    })
    if (chequeIDs.length > 0) {
      this.setState({ isLoading: true });
      await this.props.getPaymentDetails(chequeIDs);
      if (this.props.payments.getPaymentDetailsSuccess) {
        let getPaymentDetails = this.props.payments.getPaymentDetails || [];
        this.setState({ paymentDetails: getPaymentDetails }, () => {
          this.openModal('openPaymentDetailModal')
        })
      }
      if (this.props.payments.getPaymentDetailsError) {
        handleAPIErr(this.props.payments.getPaymentDetailsError, this.props);
      }
      this.props.clearPaymentStates();
      this.setState({ isLoading: false });
    } else {
      toast.error('Please Select Payments First!')
    }

  };
  exportPayments = async () => {
    let {
      payments
    } = this.props.stateData
    let chequeIDs = []
    payments.map(p => {
      if (p.checked) {
        chequeIDs.push(p.chequeID)
      }
    })
    if (chequeIDs.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportPayments(chequeIDs);
      if (this.props.payments.exportPaymentsSuccess) {
        let exportPayments = this.props.payments.exportPayments || '';
        let obj ={
          contentType: 'application/vnd.ms-excel',
          attachment: exportPayments
        }
        downloadAttachments(obj, 'Payments')
      }
      if (this.props.payments.exportPaymentsError) {
        handleAPIErr(this.props.payments.exportPaymentsError, this.props);
      }
      this.props.clearPaymentStates();
      this.setState({ isLoading: false });
    } else {
      toast.error('Please Select Payments First!')
    }
  };

  render() {
    let {
      openPaymentsModal,
      openSettingsModal,
      pageLength,
      columns,
      payments,
      checkAll
    } = this.props.stateData

    if (!openPaymentsModal) {
      openSettingsModal = false
    }
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={openPaymentsModal}
          onHide={() => this.props.closeModal("openPaymentsModal")}
          className="forgot_email_modal modal_704 mx-auto supp_activity"
        >
          <Modal.Body>
            <div className="container-fluid p-0">
              <div className="main_wrapper">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center">
                    <div className="user_access_main ">
                      <div className="setting_header thead_bg">
                        <h3 className="Indirecttaxcode-poup_heading">
                          Payments
                        </h3>
                        <div className="Indirecttaxcode-poup_can-sav-btn">
                          <button className="btn can-btn1" onClick={() => this.props.closeModal("openPaymentsModal")}>
                            <img
                              src="images/user-setup/check-white.png"
                              alt="check"
                            />
                            Save
                          </button>
                          <button
                            onClick={() => this.props.closeModal("openPaymentsModal")}
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
                                    <Dropdown.Item onClick={this.exportPayments}>Export</Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.openModal('openCancelReIssueModal')}>Cheque Cancel Re-issue</Dropdown.Item>
                                    <Dropdown.Item onClick={this.getPaymentDetails}>Detail</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="table-responsive">

                              <table
                                id="payments"
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
                                            onClick={(e) => { this.props.hanldeCheckbox(e, 'all', '', 'payments') }}
                                          />
                                          <span className="click_checkmark global_checkmark"></span>
                                        </label>
                                      </div>
                                    </th>
                                    <th>
                                      <span className="hed">Cheque</span>
                                    </th>
                                    <th>
                                      <span className="hed">ChqDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">Status</span>
                                    </th>
                                    <th>
                                      <span className="hed">Amount</span>
                                    </th>
                                    <th>
                                      <span className="hed">Cu</span>
                                    </th>
                                    <th>
                                      <span className="hed">Pres</span>
                                    </th>
                                    <th>
                                      <span className="hed">PresDate</span>
                                    </th>
                                    <th>
                                      <span className="hed">Bank</span>
                                    </th>
                                    <th>
                                      <span className="hed">PosPay</span>
                                    </th>

                                    <th>
                                      <span
                                        className="user_setup_hed2"
                                        onClick={() =>
                                          this.props.openModal("openSettingsModal")
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
                                    payments.map((pay, ind) => {
                                      return <tr>
                                        <td>
                                          <div className="custom-radio">
                                            <label className="check_main remember_check" htmlFor={`listCheck${ind}`}>
                                              <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`listCheck${ind}`}
                                                name={'payListCheck'}
                                                checked={pay.checked}
                                                onClick={(e) => { this.props.hanldeCheckbox(e, pay, ind, 'payments') }}
                                              />
                                              <span className="click_checkmark"></span>
                                            </label>
                                          </div>
                                        </td>
                                        <td>{pay.cheque}</td>
                                        <td>
                                        {moment(pay.chequeDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>{pay.status}</td>
                                        <td>{pay.amount}</td>
                                        <td>{pay.currency}</td>
                                        <td>{pay.presented}</td>
                                        <td>
                                        {moment(pay.presentDate).format("DD-MMM-YYYY").toUpperCase()} 
                                        </td>
                                        <td>{pay.bankCode}</td>
                                        <td>{pay.positivePay}</td>
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
          heading='Cheque Cancel Re-issue'
          closeModal={this.closeModal}
        />
        {/* <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
        /> */}
        <PaymentDetails
          closeModal={this.closeModal}
          openModal={this.openModal}
          stateData={this.state}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={() => this.handleSaveSettings('payment_details')}
          handleCloseSettingModal={() => this.handleCloseSettingModal('payment_details')}
        // hanldeCheckbox={this.props.hanldeCheckbox}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  payments: state.payments,
});
export default connect(mapStateToProps, {
  getPaymentDetails: PaymentActions.getPaymentDetails,
  exportPayments: PaymentActions.exportPayments,
  clearPaymentStates: PaymentActions.clearPaymentStates
})(Payments);
