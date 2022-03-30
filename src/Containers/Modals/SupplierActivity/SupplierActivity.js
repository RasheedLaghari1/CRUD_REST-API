import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Settings from "../../Modals/SetupModals/Settings/Settings";

const SupplierActivity = (props) => {
  let {
    openActivityModal,
    openSettingsModal,
    pageLength,
    columns,
    suppliersActivity,
  } = props.stateData;

  if (!openActivityModal) {
    openSettingsModal = false;
  }
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openActivityModal}
        onHide={() => props.closeModal("openActivityModal")}
        className="forgot_email_modal modal_704 mx-auto supp_activity"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center">
                  <div className="user_access_main ">
                    <div className="setting_header thead_bg">
                      <h3 className="Indirecttaxcode-poup_heading">Activity</h3>
                      <div className="Indirecttaxcode-poup_can-sav-btn">
                        <button
                          className="btn can-btn1"
                          onClick={() => props.closeModal("openActivityModal")}
                        >
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={() => props.closeModal("openActivityModal")}
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
                            <div className="user_setup_plus_Icons"></div>
                            <table
                              id="supplierActivity"
                              className="table dt-responsive data-table-d mt-50"
                            >
                              <thead className="thead_bg">
                                <tr>
                                  <th>
                                    <span className="hed">User</span>
                                  </th>
                                  <th>
                                    <span className="hed">Description</span>
                                  </th>
                                  <th>
                                    <span className="hed nowrap-text">
                                      Date & Time
                                    </span>
                                  </th>
                                  <th>
                                    <span className="hed nowrap-text">
                                      IP Address
                                    </span>
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
                                {suppliersActivity.map((a, i) => {
                                  return (
                                    <tr key={i + a}>
                                      <td>{a.userName}</td>
                                      <td>{a.comment}</td>
                                      <td> {a.dateStamp}</td>
                                      <td>{a.ipAddress}</td>
                                      <td></td>
                                    </tr>
                                  );
                                })}
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
};

export default SupplierActivity;
