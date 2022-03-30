import React, { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from 'react-toastify';
import { handleValidation, handleWholeValidation } from "../../../Utils/Validation";

export default function Import(props) {

  let {
    openImportModal,
  } = props.state

  const [state, setState] = useState({
    excelData: '',
    importType: { label: 'List', value: 'List' },
    formErrors: {
      excelData: ''
    }
  });

  const onImport = async () => {
    let {
      formErrors,
      excelData,
      importType
    } = state
    excelData = excelData.trim()
    formErrors = handleWholeValidation(
      { excelData },
      formErrors
    );
    if (!formErrors.excelData) {
      await props.onImport(excelData, importType.value) //2nd param valid only for import invoice case
      clearStates()
    }
    setState((prev) => ({ ...prev, formErrors }))
  }
  const handleChangeData = (e) => {
    let { value } = e.target;
    let {
      formErrors
    } = state

    formErrors = handleValidation("excelData", value, formErrors);
    setState((prev) => ({ ...prev, excelData: value, formErrors }))
  }
  const clearStates = () => {
    setState((prev) => ({
      excelData: '',
      importType: { label: 'List', value: 'List' },
      formErrors: {
        excelData: ''
      }
    }))
    props.closeModal("openImportModal")
  }

  let {
    formErrors,
    excelData,
    importType
  } = state

  let options = props.page === 'invoice' ? [
    { label: "List", value: "List " },
    { label: "Chq Request", value: "Chq Request" },
    { label: "EP File", value: "EP File" }
  ] : props.page === 'expense' ?
    [
      { label: "List", value: "List " },
      { label: "Envelope", value: "Envelope" },
      { label: "EU Envelope", value: "EU Envelope" },
      { label: "Split Tax Envelope", value: "Split Tax Envelope" },
      { label: "Fuel Envelope", value: "Fuel Envelope" }
    ] : []
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openImportModal}
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
                            <h6 className="text-left def-blue">Import</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onImport}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                                Save
                              </button>
                            <button
                              onClick={() => props.closeModal('openImportModal')}
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
                  <div className="row no-gutters mt-4">
                    {
                      props.page === 'invoice' || props.page === 'expense' ?
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <Select
                              className="width-selector"
                              value={importType}
                              classNamePrefix="custon_select-selector-inner"
                              options={options}
                              onChange={(t) => setState((prev) => ({ ...prev, importType: t }))}
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
                        : ''
                    }
                    <div className="col-12 mt-1">
                      <div className="form-group custon_select text-center mb-0 w-100 ">
                        <textarea
                          rows="4"
                          className="w-100"
                          name="excelData"
                          form="usrform"
                          id="excelData"
                          defaultValue={excelData}
                          placeholder="Paste Spreadsheet Data Here..."
                          onBlur={handleChangeData}
                        />
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.excelData ? formErrors.excelData : ""}
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

