import React from "react";

import Modal from "react-bootstrap/Modal";

const DeleteOrderDetails = (props) => {
  const deletePOLine = async () => {
    let id = props.deletePOLineId;
    await props.deletePOLine(id);
    props.closeModal("openDeleteOrderDetailModal");
  };
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDeleteOrderDetailModal}
        onHide={() => props.closeModal("openDeleteOrderDetailModal")}
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
                            <h6 className="text-left def-blue">
                              {props.invoice
                                ? "Invoice Details"
                                : "Order Details"}
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={deletePOLine}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                props.closeModal("openDeleteOrderDetailModal")
                              }
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
                          <p className="model-p move-modal-t text-left">
                            You are about to delete this line, do you wish to
                            continue?
                            <span className="modal_reason_span modal-Order_D-span">
                              {" "}
                              This can't be undone.{" "}
                            </span>
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

export default DeleteOrderDetails;
