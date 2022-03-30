import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./Activity.css";

const Activity = (props) => {
  let activity = props.activity || [];
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openActivityModal}
        onHide={() => props.closeModal("openActivityModal")}
        className="forgot_email_modal modal_704 mx-auto"
        id="activity-modal"
      >
        <Modal.Body>
          <div className="container-fluid ">
            <div className="main_wrapper p-10">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header">
                      <div className="modal-top-header">
                        <div className="row bord-btm">
                          <div className="col-auto pl-0">
                            <h6 className="text-left def-blue">Activity</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openActivityModal")
                              }
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        {activity.map((a, i) => {
                          return (
                            <div key={i}>
                              <div className="activity_item_main">
                                <div className="flex-content-custom">
                                  <div>
                                    <div className="activity_9">
                                      <p>{a.description}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="activity_3 align-self-center">
                                      <p>
                                        {a.date} {a.time}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
};

export default Activity;
