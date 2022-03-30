import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { handleAPIErr } from "../../../Utils/Helpers";
import { useSelector } from "react-redux";
import "./CreateSendEFT.css";
import { handleValidation } from "../../../Utils/Validation";

const CreateSendEFT = (props) => {
  const [authorized, setAuthorized] = useState(false);

  const [loading, setLoading] = useState(false);

  const timecardState = useSelector((state) => state.timecard);

  useEffect(() => {
    if (timecardState.createEFTFileSuccess) {
      toast.success(timecardState.createEFTFileSuccess);
      closeModal();
      props.clearTimecardStates();
    }

    if (timecardState.createEFTFileError) {
      handleAPIErr(timecardState.createEFTFileError, props);
      props.clearTimecardStates();
    }
  }, [timecardState]);

  const closeModal = () => {
    setAuthorized(false);
    props.closeModal("openSendEFTmodal");
  };

  const createSendEFTHandler = async () => {
    setLoading(true);
    await props.createEFTFile(props.batchNo);
    setLoading(false);
  };

  return (
    <>
      {loading ? <div className="se-pre-con"></div> : ""}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openSendEFTmodal}
        onHide={() => props.closeModal("openSendEFTmodal")}
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
                            <h6 className="text-left  modal__title">
                              Create and Send EFT/STP Files
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openSendEFTmodal")
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
                      <div>
                        <h2 className="modal__heading">
                          Once you authorize to send these files the process
                          cannot be stopped or reversed.{" "}
                        </h2>
                        <p className="modal__title2">
                          l am notifying the ATO that
                        </p>
                        <ul className="modal__title2">
                          <li className="modal__title2">
                            -Threadgold Plummer Hood Pty Ltd provides my
                            business with transaction service, and{" "}
                          </li>
                          <li className="modal__title2">
                            {" "}
                            - My business, for the purposes of its transactions
                            with ATO via the SBR channel, sends (and receives)
                            those transactions to (and from) the ATO via QVALENT
                            PTY LTD.
                          </li>
                        </ul>
                        <p className="modal__title2">
                          {" "}
                          I declare the information transmitted in this payroll
                          to be true and correct and I am authorized to make
                          this declaration.{" "}
                        </p>

                        <div className="mb__bottom-wraper">
                          <div className="mb__bottom-wraper">
                            <div className="form-group remember_check d-flex">
                              <div>
                                <input
                                  type="checkbox"
                                  id={"authorized"}
                                  checked={authorized}
                                  name="authorized"
                                  onChange={(e) =>
                                    setAuthorized(e.target.checked)
                                  }
                                />

                                <label
                                  htmlFor={"authorized"}
                                  className="mr-0 label__checkbox lbl-wrapper-check"
                                ></label>
                              </div>

                              <div>
                                <span>
                                  Tick this box to sign the declaration with the
                                  credentials used to login and to authorize
                                  lodgement with QVALENT PTY LTD's AUSkey.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex__wrapper--content">
                          <div className="margin__right--side">
                            <button
                              className="btn btn__authorize"
                              disabled={!authorized}
                              onClick={createSendEFTHandler}
                            >
                              Authorize
                            </button>
                          </div>
                          <div>
                            <button className="btn btn__cancel">Cancel</button>
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

export default CreateSendEFT;
