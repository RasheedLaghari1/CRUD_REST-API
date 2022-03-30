import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./DeclineTimeCard.css";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { handleAPIErr } from "../../../Utils/Helpers";
import { toast } from "react-toastify";

import {
  handleValidation,
  handleWholeValidation,
} from "../../../Utils/Validation";
import {
  declineTimecard,
  clearTimecardStates,
} from "../../../Actions/TimecardActions/TimecardActions";
const DeclineTimeCard = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [declineTo, setDeclineTo] = useState("toEmployee");
  const [approver, setApprover] = useState("");
  const [approverOptions, setApproverOptions] = useState([]);
  const [skipApprover, setSkipApprover] = useState(false);
  const [comment, setComment] = useState("");
  let [formErrors, setFormErrors] = useState({
    comment: "",
    approver: "",
  });

  const dispatch = useDispatch();
  const timecardState = useSelector((state) => state.timecard);

  useEffect(() => {
    if (props.openDeclineTimeCardmodal) {
      let approverOptions = props.approvers || [];
      let _approverOptions = [];
      approverOptions.map((op) =>
        _approverOptions.push({
          label: op.approverName,
          value: op.approverName,
        })
      );
      setApproverOptions(_approverOptions);
    }
  }, [props.openDeclineTimeCardmodal]);

  const onDecline = async () => {
    if (!props.tran) {
      toast.error("Tran is missing!");
      return;
    }

    let flag = false;
    if (declineTo === "toApprover") {
      formErrors = handleWholeValidation({ comment, approver }, formErrors);

      if (!formErrors.comment && !formErrors.approver) {
        flag = true;
      }
    } else if (declineTo === "toEmployee" || declineTo === "toOperator") {
      formErrors = handleWholeValidation({ comment }, formErrors);
      if (!formErrors.comment) {
        flag = true;
      }
    }

    if (flag) {
      setIsLoading(true);

      let obj = {
        tran: props.tran,
        userName: approver,
        skipApprover: skipApprover ? "Y" : "N",
        toEmployee: declineTo === "toEmployee" ? "Y" : "N",
        comment,
      };
      await dispatch(declineTimecard(obj)); // decline Timecard

      setIsLoading(false);
      dispatch(clearTimecardStates(props.postType));
    }
    setFormErrors({
      comment: formErrors.comment,
      approver: formErrors.approver,
    });
  };
  //decline timecard success OR error case
  useEffect(() => {
    if (timecardState.declineTimecardSuccess) {
      toast.success(timecardState.declineTimecardSuccess);
      props.getTimecardTallies(props.showTallisTabPane, true); //to refresh the list

      dispatch(clearTimecardStates());
      clearState();
    }
    if (timecardState.declineTimecardError) {
      handleAPIErr(timecardState.declineTimecardError, props.locationProps);
      dispatch(clearTimecardStates());
      clearState();
    }
  }, [timecardState]);

  const clearState = () => {
    setDeclineTo("toEmployee");
    setApprover("");
    setSkipApprover(false);
    setComment("");
    setFormErrors({ comment: "", approver: "" });
    props.closeModal("openDeclineTimeCardmodal");
  };

  return (
    <>
      {isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDeclineTimeCardmodal}
        onHide={clearState}
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
                              Decline TimeCard{" "}
                            </h6>
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
                              onClick={clearState}
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
                      <div className="mtop-20">
                        <div className="flex__wrapper--content margin-topbottom">
                          <div className="flex-align-wrapper">
                            <div className="form-group remember_check ">
                              <input
                                type="radio"
                                className="input-line-height"
                                id={"emp"}
                                checked={declineTo === "toEmployee"}
                                name="declineTo"
                                onChange={(e) => {
                                  setApprover("");
                                  setComment("");
                                  setSkipApprover(false);
                                  setDeclineTo("toEmployee");
                                }}
                              />
                              <label
                                htmlFor={"emp"}
                                className="mr-0 label__checkbox input-line-height"
                              ></label>
                              <p className="label__font-wrapper font-15-wrappar input-line-height">
                                {" "}
                                To Employee:
                              </p>
                            </div>
                          </div>
                          <div className="flex-align-wrapper">
                            <div className="form-group remember_check ">
                              <input
                                type="radio"
                                className="input-line-height"
                                id={"toApprover"}
                                checked={declineTo === "toApprover"}
                                name="declineTo"
                                onChange={(e) => {
                                  setComment("");
                                  setApprover("");
                                  setSkipApprover(false);
                                  setDeclineTo("toApprover");
                                }}
                              />
                              <label
                                htmlFor={"toApprover"}
                                className="mr-0 label__checkbox input-line-height"
                              ></label>
                              <p className="label__font-wrapper font-15-wrappar input-line-height">
                                {" "}
                                Approver:
                              </p>
                            </div>
                          </div>
                          <div className="flex-align-wrapper">
                            <div className="form-group remember_check ">
                              <input
                                type="radio"
                                className="input-line-height"
                                id={"toOperator"}
                                checked={declineTo === "toOperator"}
                                name="declineTo"
                                onChange={(e) => {
                                  setComment("");
                                  setApprover("");
                                  setSkipApprover(false);
                                  setDeclineTo("toOperator");
                                }}
                              />
                              <label
                                htmlFor={"toOperator"}
                                className="mr-0 label__checkbox input-line-height"
                              ></label>
                              <p className="label__font-wrapper font-15-wrappar input-line-height">
                                {" "}
                                Operator:
                              </p>
                            </div>
                          </div>
                        </div>
                        {declineTo === "toApprover" ? (
                          <>
                            <div className="flex__wrapper--content">
                              <div className="width100">
                                <div className="custon_select decline__label">
                                  <label className="font-15-wrappar">
                                    To Approver :
                                  </label>
                                  <Select
                                    className="width-selector font-15-wrappar color-gray-containter"
                                    defaultValue={{
                                      label: "Select Approver",
                                      value: " ",
                                    }}
                                    classNamePrefix="custon_select-selector-inner"
                                    options={approverOptions}
                                    onChange={(obj) => {
                                      setApprover(obj.value);
                                      setFormErrors(
                                        handleValidation(
                                          "approver",
                                          obj.value,
                                          formErrors
                                        )
                                      );
                                    }}
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
                                  <div className="text-danger error-12">
                                    {formErrors.approver !== ""
                                      ? formErrors.approver
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex__wrapper--content margin-topbottom">
                              <div>
                                <div className="form-group remember_check">
                                  <input
                                    type="checkbox"
                                    id={"aprvr"}
                                    checked={skipApprover}
                                    name="checkbox"
                                    onChange={(e) =>
                                      setSkipApprover(!skipApprover)
                                    }
                                  />
                                  <label
                                    htmlFor={"aprvr"}
                                    className="mr-0 label__checkbox "
                                  ></label>
                                  <p className="label__font-wrapper font-15-wrappar">
                                    {" "}
                                    Skip Previous Approvers :
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <div>
                          <textarea
                            className="form-control text__field-wrapper"
                            placeholder="Reason to Decline"
                            value={comment}
                            onChange={(e) => {
                              setComment(e.target.value);
                              setFormErrors(
                                handleValidation(
                                  "comment",
                                  e.target.value,
                                  formErrors
                                )
                              );
                            }}
                          />
                          <div className="text-danger error-12">
                            {formErrors.comment !== ""
                              ? formErrors.comment
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeclineTimeCard;
