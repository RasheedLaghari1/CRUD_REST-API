import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Settings from "../../Modals/SetupModals/Settings/Settings";

export default function TransactionDetails(props) {
  let {
    openTransacDetailModal,
    openSettingsModal,
    columns,
    pageLength,
    checkAll,
    transactionDetails
  } = props.stateData;

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openTransacDetailModal}
        onHide={() => props.closeModal("openTransacDetailModal")}
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
                        Transaction Details
                        </h3>
                      <div className="Indirecttaxcode-poup_can-sav-btn">
                        <button className="btn can-btn1" onClick={() => props.closeModal("openTransacDetailModal")}>
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                            Save
                          </button>
                        <button
                          onClick={() => props.closeModal("openTransacDetailModal")}
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
                              id="transac_details"
                              className="table dt-responsive data-table-d mt-5"
                            >
                              <thead className="thead_bg">
                                <tr>
                                  <th>
                                    <div className="custom-radio">
                                      <label
                                        className="check_main remember_check"
                                        htmlFor="tranDtlHdr"
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="tranDtlHdr"
                                          name="all"
                                        // checked={checkAll}
                                        // onClick={(e) => { props.hanldeCheckbox(e, 'all') }}
                                        />
                                        <span className="click_checkmark global_checkmark"></span>
                                      </label>
                                    </div>
                                  </th>
                                  <th scope="col" className="text-left">
                                    PO
                                    </th>
                                  <th scope="col" className="text-left">
                                    Action
                                    </th>
                                  <th scope="col" className="text-left">
                                    Chart Sort
                                    </th>
                                  <th scope="col" className="text-left">
                                    Chart Code
                                    </th>
                                  <th scope="col" className="text-left">
                                    Tracking Codes
                                    </th>
                                  <th scope="col" className="text-left" width="33%">
                                    Description
                                    </th>
                                  <th scope="col">Amount</th>
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
                                  transactionDetails.map((trans, ind) => {
                                    return <tr>
                                      <td>
                                        <div className="custom-radio">
                                          <label className="check_main remember_check" htmlFor={`tranDtl${ind}`}>
                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id={`tranDtl${ind}`}
                                              name={'payListCheck'}
                                            // checked={pay.checked}
                                            // onClick={(e) => { props.hanldeCheckbox(e, pay, ind) }}
                                            />
                                            <span className="click_checkmark"></span>
                                          </label>
                                        </div>
                                      </td>
                                      <td>{trans.poTran}</td>
                                      <td>{trans.action}</td>
                                      <td>{trans.chartSort}</td>
                                      <td>{trans.chartCode}</td>
                                      <td>{trans.trackingCodes}</td>
                                      <td>{trans.description}</td>
                                      <td>{trans.amount}</td>
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
