import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./ResendSTPFile.css";
import Select from "react-select";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleAPIErr } from "../../../Utils/Helpers";

const ResendSTPFile = (props) => {
  const timecardState = useSelector((state) => state.timecard);

  let { batchListOptions } = props.stateDate;

  let { resendSTPFile, clearTimecardStates } = props;

  const [batch, setBatchNo] = useState({ label: "Select Batch", value: "" });

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    amendment: false,
    authorized: false,
  });

  useEffect(() => {
    if (timecardState.resendSTPFileSuccess) {
      toast.success(timecardState.resendSTPFileSuccess);
      closeModal();
      clearTimecardStates();
    }

    if (timecardState.resendSTPFileError) {
      handleAPIErr(timecardState.resendSTPFileError, props);
      clearTimecardStates();
    }
  }, [timecardState]);

  const handleCheckbox = (e) => {
    let name = e.target.name;
    let checked = e.target.checked;
    setState((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const resendSTPFileHandler = async () => {
    if (batch.value || batch.value === 0) {
      setLoading(true);
      let batchNo = batch.value;
      let amendment = state.amendment ? "Y" : "N";
      await resendSTPFile(batchNo, amendment);
      setLoading(false);
    } else {
      toast.error("Select Batch No ");
    }
  };

  const closeModal = () => {
    setBatchNo({ label: "Select Batch", value: "" });

    setState({
      amendment: false,
      authorized: false,
    });

    props.closeModal("openResendSTPFilemodal");
  };

  return (
    <>
      {loading ? <div className="se-pre-con"></div> : ""}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openResendSTPFilemodal}
        onHide={() => props.closeModal("openResendSTPFilemodal")}
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
                              Resend STP File{" "}
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() =>
                                props.closeModal("openResendSTPFilemodal")
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
                        <div className="flex__wrapper--content">
                          <div className="margin__right-wrapper">Batch:</div>
                          <div className="width100">
                            <div className="custon_select ">
                              <label></label>
                              <Select
                                className="width-selector select__wrapper-inner"
                                value={batch}
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

                        <div className="flex__wrapper--content margin-topbottom">
                          <div className="margin__right-wrapper2">
                            {" "}
                            Amendment:
                          </div>
                          <div>
                            <div className="form-group remember_check">
                              <input
                                type="checkbox"
                                id={"amendment"}
                                checked={state.amendment}
                                name="amendment"
                                onChange={handleCheckbox}
                              />
                              <label
                                htmlFor={"amendment"}
                                className="mr-0 label__checkbox"
                              ></label>
                            </div>
                          </div>
                        </div>

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
                          <div className="form-group remember_check d-flex">
                            <div>
                              <input
                                type="checkbox"
                                id={"authorized"}
                                checked={state.authorized}
                                name="authorized"
                                onChange={handleCheckbox}
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

                        <div className="flex__wrapper--content">
                          <div className="margin__right--side">
                            <button
                              className="btn btn__authorize"
                              disabled={!state.authorized}
                              onClick={resendSTPFileHandler}
                            >
                              Authorize
                            </button>
                          </div>
                          <div>
                            <button
                              className="btn btn__cancel"
                              onClick={() =>
                                props.closeModal("openResendSTPFilemodal")
                              }
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

export default ResendSTPFile;
