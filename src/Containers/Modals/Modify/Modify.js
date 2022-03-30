import React from "react";
import Modal from "react-bootstrap/Modal";
import "./Modify.css";

const Modify = (props) => {
  const modifyPO = async () => {
    await props.modifyPO();
    closeModal();
  };

  const closeModal = async () => {
    await props.closeModal("openModifyModal");
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openModifyModal}
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
                            <h6 className="text-left def-blue">Modify</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={modifyPO}
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
                          <p className="model-p move-modal-t">
                            This order will be copied to your drafts folder to
                            modify and send for approval.
                          </p>
                        </div>
                        <div className="col-12"></div>
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

export default Modify;
