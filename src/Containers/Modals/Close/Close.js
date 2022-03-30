import React, { useState, useEffect } from 'react'
import "./Close.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { handleValidation, handleWholeValidation } from "../../../Utils/Validation";

const Close = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    reason: "",
    formErrors: {
      reason: ''
    }
  });

  const handleChangeReason = e => {
    let reason = e.target.value;
    let {
      formErrors
    } = state

    formErrors = handleValidation("reason", reason, formErrors);

    setState((prev) => ({ ...prev, reason, }))
  };
  const closePO = async () => {

    let {
      reason,
      formErrors
    } = state

    reason = reason.trim()

    formErrors = handleWholeValidation(
      { reason },
      formErrors
    );
    if (!formErrors.reason) {
      await props.closePO(reason);
      closeModal();
    }
    setState((prev) => ({ ...prev, formErrors }));

  };

  const clearStates = () => {
    setState({
      isLoading: false,
      reason: "",
      formErrors: {
        reason: ''
      }
    });
  };
  const closeModal = () => {
    clearStates();
    props.closeModal("openCloseModal");
  };

  let {
    reason,
    formErrors
  } = state

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openCloseModal}
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
                            <h6 className="text-left def-blue">Close</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={closePO}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                                Save
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
                        <div className="col-12">
                          <p className="model-p move-modal-t text-left pb-0">
                            This will close the order and zero all balances.
                            Please enter reason bellow.
                            </p>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Reason For Close"
                                id="usr"
                                name="reason"
                                value={reason}
                                onChange={handleChangeReason}
                              />
                            </div>
                            <div className="text-danger error-12">
                              {formErrors.reason !== ""
                                ? formErrors.reason
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
}

export default Close
