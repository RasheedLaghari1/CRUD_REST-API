import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";

export default function Move(props) {
  let { openMoveModal, batchListOptions } = props.stateDate;

  const [batchNo, setBatchNo] = useState({ label: "Select Batch", value: "" });

  const moveBatch = async () => {
    if (batchNo.value || batchNo.value === 0) {
      await props.moveBatch(batchNo.value);
      clearStates();
    } else {
      toast.error("Please select batch first!");
    }
  };
  const clearStates = () => {
    setBatchNo({ label: "Select Batch", value: "" });
    props.closeModal("openMoveModal");
  };
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openMoveModal}
        onHide={clearStates}
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
                            <h6 className="text-left def-blue">Move</h6>
                          </div>

                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={moveBatch}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={() => props.closeModal("openMoveModal")}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Discard
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body px-3">
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <label>Batch List</label>
                            <Select
                              className="width-selector"
                              value={batchNo}
                              classNamePrefix="custon_select-selector-inner"
                              options={batchListOptions}
                              onChange={(b) => setBatchNo(b)}
                              theme={(theme) => ({
                                ...theme,
                                border: 0,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: "#f2f2f2",
                                  primary: "#f2f2f2",
                                },
                              })}
                            />
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
