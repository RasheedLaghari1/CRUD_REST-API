import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./CalculateDay.css";
import Select from "react-select";
import { toast } from "react-toastify";
import { _customStyles } from "../../../Constants/Constants";

import { useSelector, useDispatch } from "react-redux";
import {
  calculateDay,
  clearTimecardStates,
} from "../../../Actions/TimecardActions/TimecardActions";

const CalculateDay = (props) => {
  const dispatch = useDispatch();
  let { calculateDayTimeCard, openCalculateDayModal, closeModal } = props;
  console.log("calculateDayTimeCard", calculateDayTimeCard);
  let timecardState = useSelector((state) => state.timecard);

  const [calculateResult, setCalculateResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [tempalteOption, setTempalteOption] = useState([
    { label: "Select Template", value: "" },
  ]);

  const [selectTemp, setSelectedTemplate] = useState({});
  const [calculate, setCalculateDay] = useState({});

  useEffect(() => {
    if (calculateDayTimeCard && tempalteOption) {
      let selectedTemp = tempalteOption.find(
        (template) => template.value === calculateDayTimeCard.template
      );
      console.log("selectedTemp", selectedTemp);
      setSelectedTemplate(selectedTemp);
    }

    setCalculateDay({
      Tran: props.tran || "",
      lineNo: calculateDayTimeCard?.lineNo,
      pmtFlags: calculateDayTimeCard?.pmtFlags,
      rate: calculateDayTimeCard?.rate,
      template: calculateDayTimeCard?.template,
      // dailyTimes: props.dailyTimes || [],
      payAs: calculateDayTimeCard?.payAs,
      date: calculateDayTimeCard?.date,
      day: calculateDayTimeCard?.day,
      camCall: calculateDayTimeCard?.camCall,
      camWrap: calculateDayTimeCard?.camWrap,
      travelTo: calculateDayTimeCard?.travelTo,
      startWork: calculateDayTimeCard?.startWork,
      startMB1: calculateDayTimeCard?.startMB1,
      finishMB1: calculateDayTimeCard?.finishMB1,
      nonDeductableMB1: calculateDayTimeCard?.nonDeductableMB1,
      startMB2: calculateDayTimeCard?.startMB2,
      finishMB2: calculateDayTimeCard?.finishMB2,
      nonDeductableMB2: calculateDayTimeCard?.nonDeductableMB2,
      startMB3: calculateDayTimeCard?.startMB3,
      finishMB3: calculateDayTimeCard?.finishMB3,
      nonDeductableMB3: calculateDayTimeCard?.nonDeductableMB3,
      totalMB: calculateDayTimeCard?.totalMB,
      finishWork: calculateDayTimeCard?.finishWork,
      travelFrom: calculateDayTimeCard?.travelFrom,
      totalHours: calculateDayTimeCard?.totalHours,
      notes: calculateDayTimeCard?.notes,
      advancedList: calculateDayTimeCard?.advancedList,
      category: "",
      description: "",
      value: "",
    });
    setCalculateResult(calculateDayTimeCard?.timeCalc || []);
  }, [calculateDayTimeCard]);

  useEffect(() => {
    if (timecardState.calculateDaySuccess) {
      toast.success(timecardState.calculateDaySuccess);
      setCalculateResult(timecardState.calculateDay);
      setIsLoading(false);
      dispatch(clearTimecardStates());
    }
    if (timecardState.calculateDayError) {
      setIsLoading(false);
      toast.error(timecardState.calculateDayError);
      dispatch(clearTimecardStates());
    }

    let cloneTemplate = [{ label: "Select Template", value: "" }];
    if (timecardState.getTimecard) {
      timecardState.getTimecard.templates.map((item) => {
        cloneTemplate.push({ label: item.description, value: item.tmpCode });
      });
    }
    setTempalteOption(cloneTemplate);
  }, [timecardState]);

  const selectTemplate = (params) => {
    setSelectedTemplate(params);
    setCalculateDay((prev) => ({
      ...prev,
      template: params.value,
    }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setCalculateDay((prev) => ({ ...prev, [name]: value || "" }));
  };

  const calculateHandler = () => {
    setIsLoading(true);
    console.log("calculate", calculate);
    dispatch(calculateDay(calculate));
  };
  const closeModalHandler = () => {
    setCalculateDay({});
    setCalculateResult(null);
    closeModal("openCalculateDayModal");
  };

  return (
    <>
      {isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openCalculateDayModal}
        onHide={closeModalHandler}
        className="forgot_email_modal mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid ">
            <div className="main_wrapper p-10">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width p-0">
                  <div className="forgot_form_main">
                    <div className="forgot_header">
                      <div className="modal-top-header">
                        <div className="row bord-btm">
                          <div className="col-auto pl-0">
                            <h6 className="text-left  modal__title">
                              CalculateDay{" "}
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={closeModalHandler}
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
                      <div className="mtop-20">
                        <div className="form-group form__inner-flex">
                          <label
                            className="control-label col-sm-4 col-md-2 form__lbl--one"
                            htmlFor="pmtFlags"
                          >
                            Pmt Flag:
                          </label>
                          <div className="col-sm-7 col-md-10">
                            <input
                              className="form-control pro_input_pop"
                              type="text"
                              name="pmtFlags"
                              value={calculate.pmtFlags || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group form__inner-flex">
                          <label
                            className="control-label col-sm-4 col-md-2 form__lbl--one"
                            htmlFor="Dept"
                          >
                            Rate:
                          </label>
                          <div className="col-sm-7 col-md-4">
                            <input
                              className="form-control pro_input_pop"
                              type="number"
                              name="rate"
                              value={calculate.rate || 0}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group form__inner-flex">
                          <label
                            className="control-label col-sm-4 col-md-2 form__lbl--one"
                            // htmlFor="PeriodEnding"
                          >
                            Template:
                          </label>

                          <div className="col-sm-7 col-md-4 form-group custon_select custom_selct2">
                            <Select
                              className="width-selector border__one-wrapper border__bottom-wrapper"
                              value={selectTemp}
                              classNamePrefix="react-select"
                              options={tempalteOption}
                              onChange={selectTemplate}
                              id="cur"
                              styles={_customStyles}
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

                        <div>
                          <table className="table  tbl-shadow-wrapper">
                            <thead className="thead_bg calculate--tbl-wrapper">
                              <tr>
                                <th className="calculate__tbl-th">Code</th>
                                <th className="calculate__tbl-th">Payment</th>
                                <th className="calculate__tbl-desc">
                                  Description
                                </th>
                                <th className="calculate__tbl-th">Units</th>
                                <th className="calculate__tbl-th">Rate</th>
                                <th className="calculate__tbl-th">Factor</th>
                                <th className="calculate__tbl-th">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {calculateResult?.length > 0 ? (
                                calculateResult.map((calculateItem) => (
                                  <tr>
                                    <td>{calculateItem.code}</td>
                                    <td>{calculateItem.payment}</td>
                                    <td>{calculateItem.description}</td>
                                    <td className="text-right">
                                      {calculateItem.units.toFixed(6)}
                                    </td>
                                    <td className="text-right">
                                      {calculateItem.rate.toFixed(6)}
                                    </td>
                                    <td className="text-right">
                                      {calculateItem.factor.toFixed(6)}
                                    </td>
                                    <td className="text-right">
                                      {calculateItem.amount.toFixed(2)}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colspan="7" className="text-center">
                                    No Data
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="calculate__wrapper-btn">
                <button
                  className="btn btn__save-wrapper"
                  onClick={calculateHandler}
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalculateDay;
