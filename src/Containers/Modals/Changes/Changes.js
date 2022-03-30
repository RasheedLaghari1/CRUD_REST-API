import React from "react";
import Modal from "react-bootstrap/Modal";
import "./Changes.css";

const Changes = (props) => {
  let changes = props.changes || [];
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openChangesModal}
        onHide={() => props.closeModal("openChangesModal")}
        className="forgot_email_modal modal_704 mx-auto"
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
                            <h6 className="text-left def-blue">Changes</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openChangesModal")
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
                        {changes.map((c, i) => {
                          return (
                            <div key={i} className="col-md-12">
                              <div className="changes_item_main">
                                <div className="row">
                                  <div className="col-md-9">
                                    <div className="changes_9">
                                      <p>{c.description}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="changes_3 align-self-center">
                                      <p>
                                        {c.date} {c.time}
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

export default Changes;
