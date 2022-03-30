import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import moment from "moment";

export default function PaymentDetails(props) {
  let {
    openPaymentDetailModal,
    openSettingsModal,
    columns,
    pageLength,
    checkAll,
    paymentDetails
  } = props.stateData;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openPaymentDetailModal}
        onHide={() => props.closeModal("openPaymentDetailModal")}
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
                        Payment Details
                        </h3>
                      <div className="Indirecttaxcode-poup_can-sav-btn">
                        <button className="btn can-btn1" onClick={() => props.closeModal("openPaymentDetailModal")}>
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                            Save
                          </button>
                        <button
                          onClick={() => props.closeModal("openPaymentDetailModal")}
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
                          <div className="table-responsive">
                            <table
                              id="payment_details"
                              className="table dt-responsive data-table-d mt-5"
                            >
                              <thead className="thead_bg">
                                <tr>
                                  <th>
                                    <div className="custom-radio">
                                      <label
                                        className="check_main remember_check"
                                        htmlFor="payDtlHdr"
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="payDtlHdr"
                                          name="all"
                                          checked={false}
                                          // onClick={(e) => { props.hanldeCheckbox(e, 'all') }}
                                        />
                                        <span className="click_checkmark global_checkmark"></span>
                                      </label>
                                    </div>
                                  </th>
                                  <th scope="col" className="text-left">
                                    Invoice
                                    </th>
                                  <th scope="col" className="text-left">
                                    Reference
                                    </th>
                                  <th scope="col" className="text-left">
                                    Batch
                                    </th>
                                  <th scope="col" className="text-left">
                                    Voucher
                                    </th>
                                  <th scope="col" className="text-left">
                                    Description
                                    </th>
                                  <th scope="col" className="text-left">
                                    Amount
                                    </th>
                                  <th scope="col" className="text-left">
                                    InvDate
                                    </th>
                                  <th scope="col" className="text-left">
                                    Tran
                                    </th>
                                  <th>
                                    <span
                                      className="user_setup_hed2"
                                      onClick={() =>
                                        props.openModal("openSettingsModal")
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
                                  paymentDetails.map((pay, ind) => {
                                    return <tr>
                                      <td>
                                        <div className="custom-radio">
                                          <label className="check_main remember_check" htmlFor={`payDtl${ind}`}>
                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id={`payDtl${ind}`}
                                              name={'payListCheck'}
                                              checked={false}
                                              // onClick={(e) => { props.hanldeCheckbox(e, pay, ind) }}
                                            />
                                            <span className="click_checkmark"></span>
                                          </label>
                                        </div>
                                      </td>
                                      <td>{pay.invoice}</td>
                                      <td>{pay.reference}</td>
                                      <td>{pay.batch}</td>
                                      <td>{pay.voucher}</td>
                                      <td>{pay.description}</td>
                                      <td>{pay.amount}</td>
                                      <td>
                                      {moment(pay.invoiceDate).format("DD-MMM-YYYY").toUpperCase()} 
                                      </td>
                                      <td>{pay.tran}</td>
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
        handleChangeSettings={props.handleChangeSettings}
        handleSaveSettings={props.handleSaveSettings}
        handleCloseSettingModal={props.handleCloseSettingModal}
      />
    </>
  );

}