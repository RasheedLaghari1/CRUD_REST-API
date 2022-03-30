import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./Settings.css";
import "../../../Setup/SetupSASS/setupStyle.scss";

export default function Settings(props) {
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openSettingsModal}
        onHide={props.handleCloseSettingModal}
        className="modal__setting mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="setting_form_main p-0">
                    <div className="setting_header setting_header_sass thead_bg">
                      <h3 className="settings_heading">Settings</h3>
                      <div className="settings_can-sav-btn">
                        <button
                          className="btn can-btn1"
                          onClick={props.handleSaveSettings}
                        >
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={props.handleCloseSettingModal}
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
                    <div className="setting_body">
                      <div className="settings_display_row">
                        <label>
                          Display Rows Per Page
                          <span className="number-wrapper">
                            <input
                              type="number"
                              name="pageLength"
                              min="1"
                              onBlur={(e) => props.handleChangeSettings(e)}
                              defaultValue={props.pageLength}
                            />
                          </span>
                        </label>
                      </div>
                      <div className="hide_checks">
                        <h2>Hide</h2>
                        <ul>
                          {props.columns.map((col, i) => {
                            return (
                              <li key={i}>
                                <div className="custom-radio">
                                  <label
                                    className="settings_check_main settings_check_main_sass"
                                    htmlFor={i}
                                  >
                                    <input
                                      type="checkbox"
                                      id={i}
                                      name="hideColumns"
                                      checked={col.hide}
                                      onChange={(e) =>
                                        props.handleChangeSettings(e, i)
                                      }
                                    />
                                    <span
                                      className="settings_checkmark settings_checkmark_sass"
                                      style={{
                                        backgroundColor: col.hide
                                          ? props.themeColor
                                          : "white",
                                      }}
                                    ></span>
                                    {col.name}
                                  </label>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
