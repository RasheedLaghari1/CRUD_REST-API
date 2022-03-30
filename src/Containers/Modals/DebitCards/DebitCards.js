import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  handleValidation,
  handleWholeValidation,
} from "../../../Utils/Validation";

const DebitCards = (props) => {
  const [state, setState] = useState({
    debitCard: "Create PC Forms", // either Import Transactions || Email Envelope || Create PC Forms
    excelData: "",
    expenseCode: { label: "Select Expense Code", value: "" },
    addToRec: false,
    formErrors: {
      excelData: "",
      expenseCode: "",
    },
  });

  const handleExcelData = (e) => {
    let { formErrors } = state;

    let value = e.target.value;

    formErrors = handleValidation("excelData", value, formErrors);

    setState((prev) => ({ ...prev, excelData: value, formErrors }));
  };
  const handleExpenseCode = (expenseCode) => {
    let { formErrors } = state;
    formErrors = handleValidation("expenseCode", expenseCode.value, formErrors);
    setState((prev) => ({ ...prev, expenseCode, formErrors }));
  };
  const handleChangeOption = (e) => {
    let { value } = e.target;
    setState((prev) => ({ ...prev, debitCard: value }));

    if (value === "Import Transactions") {
      props.getExpenseCodes();
    }
  };
  const onSave = async () => {
    let { debitCard, excelData, expenseCode, addToRec, formErrors } = state;

    if (debitCard) {
      if (debitCard === "Import Transactions") {
        expenseCode = expenseCode.value || "";
        excelData = excelData.trim();
        formErrors = handleWholeValidation(
          { excelData, expenseCode },
          formErrors
        );
        if (!formErrors.excelData && !formErrors.expenseCode) {
          addToRec = addToRec === true ? "Y" : "N";

          await props.importDebitTransactions({
            excelData,
            expenseCode,
            addToRec,
          });
          onCancel();
        }
        setState((prev) => ({ ...prev, formErrors: formErrors }));
      } else if (debitCard === "Email Envelope") {
        //Email Envelope
        await props.emailEnvelope();
        onCancel();
      } else {
        //PC Form
        onCancel();
      }
    } else {
      toast.error("Please select Option First!");
    }
  };

  const onCancel = async () => {
    props.closeModal("openDebitCardsModal");
    setState((prev) => ({
      ...prev,
      debitCard: "Create PC Forms", // either Import Transactions || Email Envelope || Create PC Forms
      excelData: "",
      expenseCode: { label: "Select Expense Code", value: "" },
      addToRec: false,
      formErrors: {
        excelData: "",
      },
    }));
  };

  let { debitCard } = state;

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDebitCardsModal}
        onHide={onCancel}
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
                            <h6 className="text-left def-blue">Debit Cards</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onSave}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={onCancel}
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
                  </div>
                </div>
                <div className="forgot_body w-100">
                  <div className="row">
                    {[
                      "Create PC Forms",
                      "Email Envelope",
                      "Import Transactions",
                    ].map((name) => {
                      return (
                        <div key={name} className="col-12">
                          <div className="form-group mb-0">
                            <label
                              htmlFor={name}
                              className="co_postaol_radio font-size-13"
                            >
                              <input
                                type="radio"
                                id={name}
                                name="debitCard"
                                value={name}
                                onChange={handleChangeOption}
                                checked={debitCard === name}
                              />
                              {name}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {debitCard === "Import Transactions" ? (
                    <div className="row no-gutters mt-4">
                      <div className="col-12 mt-1">
                        <div className="form-group custon_select text-center mb-0 w-100 ">
                          <textarea
                            rows="4"
                            className="w-100"
                            name="comment"
                            form="usrform"
                            placeholder="Paste Spreadsheet Data Here..."
                            value={state.excelData}
                            onChange={handleExcelData}
                          />
                        </div>
                        <div className="text-danger error-12">
                          {state.formErrors.excelData !== ""
                            ? state.formErrors.excelData
                            : ""}
                        </div>
                      </div>

                      <div className="col-12 pl-md-0">
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="form-group custon_select mm_pr">
                              <Select
                                className="width-selector pt-2"
                                classNamePrefix="custon_select-selector-inner"
                                value={state.expenseCode}
                                options={props.expenseCodes}
                                onChange={handleExpenseCode}
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
                              <label className="move_label inactive pt-2">
                                Expense Code
                              </label>
                              <div className="text-danger error-12">
                                {state.formErrors.expenseCode !== ""
                                  ? state.formErrors.expenseCode
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 pl-md-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label className="">
                                <input
                                  type="checkbox"
                                  name={"chk1"}
                                  id={"chk1"}
                                  className="mr-3"
                                  checked={state.addToRec}
                                  onChange={(e) =>
                                    setState((prev) => ({
                                      ...prev,
                                      addToRec: e.target.checked,
                                    }))
                                  }
                                />
                                <span id="chk1" className=""></span>
                                Add To Reconciliation
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DebitCards;
