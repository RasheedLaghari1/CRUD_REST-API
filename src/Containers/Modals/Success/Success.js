import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./Success.css";

const Success = (props) => {
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openSuccessModal}
        onHide={() => props.closeModal("openSuccessModal")}
        className="success_model_main"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row no-gutters d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header blue_bg">
                      <div className="row no-gutters">
                        <i
                          onClick={() => props.closeModal("openSuccessModal")}
                          className="fa fa-times modal_closed"
                        ></i>
                        <div className="col-12 order-xs-2">
                          <h4 className="text-center modal-title">
                            <img
                              src="/images/success-icon.png"
                              className="mx-auto img-fluid"
                              alt="success-icon"
                            />
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row">
                        <div className="col-12">
                          <div className="forgot_form">
                            <h4 className="success_msg">SUCCESS!</h4>
                            <div className="bottom_btns text-center">
                              <button
                                onClick={() => {
                                  props.closeModal("openSuccessModal");
                                }}
                                type="button"
                                className="btn_white bblue"
                              >
                                OK
                              </button>
                            </div>
                          </div>
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

export default Success;
