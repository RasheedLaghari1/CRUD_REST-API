import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./SendYearEndSTPFile.css";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  sendYearEndSTPFile,
  clearTimecardStates,
} from "../../../Actions/TimecardActions/TimecardActions";

import { handleAPIErr } from "../../../Utils/Helpers";

const SendYearEndSTPFile = (props) => {
  const [amendment, setAmendment] = useState(false);
  const [verify, setVerify] = useState(false); //The Authorize button should be disabled until the user has ticked the checkbox.
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const timecardState = useSelector((state) => state.timecard);

  //Send Year End STP File
  const _sendYearEndSTPFile = async () => {
    if (verify) {
      setLoading(true);

      await dispatch(sendYearEndSTPFile(amendment ? "Y" : "N"));

      setLoading(false);
    }
  };

  // Success or Error case of sendYearEndSTPFile
  useEffect(() => {
    if (timecardState.sendYearEndSTPFileSuccess) {
      toast.success(timecardState.sendYearEndSTPFileSuccess);
      closeModal();
      dispatch(clearTimecardStates());
    }

    if (timecardState.sendYearEndSTPFileError) {
      handleAPIErr(timecardState.sendYearEndSTPFileError, this.props);
      dispatch(clearTimecardStates());
    }
  }, [timecardState]);

  const closeModal = () => {
    setAmendment(false);
    setVerify(false);
    props.closeModal("openSendYearEndSTPFilemodal");
  };
  return (
    <>
      {loading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openSendYearEndSTPFilemodal}
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
                            <h6 className="text-left  modal__title">
                              Send Year End STP File
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={closeModal}
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
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">year Ending:</div>
                          <div>31/2/2018</div>
                        </div>

                        <div className="flex__wrapper--content mb--20 margin-topbottom">
                          <div className="flex__inner"> Amendment:</div>
                          <div>
                            <div className="form-group remember_check">
                              <input
                                type="checkbox"
                                id={"amendment"}
                                checked={amendment}
                                name="checkbox"
                                onChange={() => setAmendment(!amendment)}
                              />
                              <label
                                htmlFor={"amendment"}
                                className="mr-0 label__checkbox"
                              ></label>
                            </div>
                          </div>
                        </div>

                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Employee:</div>
                          <div>980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Total Gross:</div>
                          <div>7577755980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Total Tax:</div>
                          <div>7577755980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Total Allowances:</div>
                          <div>7577755980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Total Super:</div>
                          <div>7577755980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Another Total 1:</div>
                          <div>7577755980</div>
                        </div>
                        <div className="flex__wrapper--content mb--20">
                          <div className="flex__inner">Another Total 2:</div>
                          <div>7577755980</div>
                        </div>

                        <h2 className="modal__heading mt-top-30">
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
                          <div className="form-group remember_check d-flex">
                            <div>
                              <input
                                type="checkbox"
                                id={"verify"}
                                checked={verify}
                                name="checkbox"
                                onChange={() => setVerify(!verify)}
                              />

                              <label
                                htmlFor={"verify"}
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
                        <div className="flex__wrapper--content">
                          <div className="margin__right--side">
                            <button
                              disabled={!verify}
                              onClick={_sendYearEndSTPFile}
                              className="btn btn__authorize"
                            >
                              Authorize
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={closeModal}
                              className="btn btn__cancel"
                            >
                              Cancel
                            </button>
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

export default SendYearEndSTPFile;
