import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import "./Decline.css";

const Decline = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    reason: "",
    formErrors: {
      reason: "",
    },
  });

  const handleChangeReason = (e) => {
    let fieldValue = e.target.value;

    let formErrors = state.formErrors;

    if (fieldValue < 1) {
      formErrors.reason = "This Field is Required.";
    } else {
      formErrors.reason = "";
    }
    setState((prev) => ({
      ...prev,
      formErrors: formErrors,
      reason: fieldValue,
    }));
  };
  const onDecline = async () => {
    let formErrors = state.formErrors;

    if (!state.reason) {
      formErrors.reason = "This Field is Required.";
    }
    setState((prev) => ({ ...prev, formErrors: formErrors }));
    if (!formErrors.reason && !formErrors.currency) {
      await props.onDecline(state.reason);
      closeModal();
    }
  };

  const closeModal = () => {
    setState((prev) => ({
      ...prev,
      reason: "",
      formErrors: {
        reason: "",
      },
    }));
    props.closeModal("openDeclineModal");
  };
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDeclineModal}
        onHide={closeModal}
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
                            <h6 className="text-left def-blue">Decline</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onDecline}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Decline
                            </button>
                            <button
                              onClick={closeModal}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row">
                        <div className="col-md-12 move-modal-t">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Reason For Declined"
                                id="usr"
                                name="reason"
                                value={state.reason}
                                onChange={handleChangeReason}
                              />
                            </div>
                            <div className="text-danger error-12 text-left">
                              {state.formErrors.reason !== ""
                                ? state.formErrors.reason
                                : ""}
                            </div>
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
    </>
  );
};

export default Decline;
