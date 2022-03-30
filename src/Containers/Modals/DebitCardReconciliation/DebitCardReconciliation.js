import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
// import { toast } from "react-toastify";
import Select from "react-select";

const DebitCardReconciliation = (props) => {
  const [state, setState] = useState({
    debitCard: "Debit Card Transactions", // either	Debit Card Transactions || 	Posted Items ||	Attachments.
    excelData: "",
    expenseCode: { label: "Select Expense Code", value: "" },
    addToRec: false,
    formErrors: {
      excelData: "",
      expenseCode: "",
    },
  });

  const onSave = () => {};

  const onCancel = () => {
    props.closeModal("openDebitCardReconciliationModal");
  };

  const uploadReportFile = () => {};

  let { debitCard } = state;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDebitCardReconciliationModal}
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
                            <h6 className="text-left def-blue">
                              Debit Card Reconciliation
                            </h6>
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
                              onClick={() =>
                                props.closeModal(
                                  "openDebitCardReconciliationModal"
                                )
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
                  </div>
                </div>
                <div className="forgot_body w-100">
                  <div className="row">
                    {[
                      "Debit Card Transactions",
                      "Posted Items",
                      "Attachments",
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
                                onChange={(e) =>
                                  setState({ debitCard: e.target.value })
                                }
                                checked={debitCard === name}
                              />
                              {name}
                            </label>
                          </div>
                        </div>
                      );
                    })}

                    <div className="debit-cars-table">
                      {debitCard === "Debit Card Transactions" ? (
                        <div className="reconciliation-table1">
                          <table className="table ">
                            <thead className="thead_bg">
                              <tr>
                                <th scope="col" width="5%">
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="saa"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="saa"
                                        name="example1"
                                      />
                                      <span className="click_checkmark global_checkmark"></span>
                                    </label>
                                  </div>
                                </th>
                                <th scope="col">Date</th>
                                <th scope="col">Reference</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Insert</th>
                                <th scope="col">change</th>
                                <th>
                                  <div className="reconciliation-btns">
                                    <Dropdown
                                      alignRight="false"
                                      drop="down"
                                      className="analysis-card-dropdwn float-right bg-tp"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                      >
                                        <img
                                          src="images/dots-white.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item>Import</Dropdown.Item>
                                        <Dropdown.Item>Export</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* 2nd table start  */}
                      {debitCard === "Posted Items" ? (
                        <div className="reconciliation-table1">
                          <table className="table ">
                            <thead className="thead_bg">
                              <tr>
                                <th scope="col" width="5%">
                                  <div className="custom-radio">
                                    <label
                                      className="check_main remember_check"
                                      htmlFor="saa"
                                    >
                                      <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="saa"
                                        name="example1"
                                      />
                                      <span className="click_checkmark global_checkmark"></span>
                                    </label>
                                  </div>
                                </th>
                                <th scope="col">Date</th>
                                <th scope="col">Reference</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Tran</th>
                                <th scope="col">Line</th>
                                <th>
                                  <div className="reconciliation-btns">
                                    <Dropdown
                                      alignRight="false"
                                      drop="down"
                                      className="analysis-card-dropdwn float-right bg-tp"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                      >
                                        <img
                                          src="images/dots-white.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item>Export</Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td className=" ">Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>description</td>
                                <td>q122</td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        ""
                      )}
                      {/* 3rd upload img start  */}
                      {debitCard === "Attachments" ? (
                        <div className="col-12 mt-2 mb-2">
                          <div className="form-group custon_select  text-center mb-0 border-rad-5">
                            <div id="drop-area-report">
                              <input
                                type="file"
                                id="fileElem-rep"
                                className="form-control d-none"
                                accept="application/pdf"
                                onChange={(e) => {
                                  uploadReportFile(e.target.files);
                                }}
                                onClick={(event) => {
                                  event.currentTarget.value = null;
                                }} //to upload the same file again
                              />

                              <label
                                className="upload-label"
                                htmlFor="fileElem-rep"
                              >
                                <div className="upload-text">
                                  <img
                                    src="images/drag-file.png"
                                    className="import_icon img-fluid"
                                    alt="upload-report"
                                  />
                                </div>
                              </label>
                            </div>
                            <div className="export-import-btns">
                              <button className="dabit_card_btns">
                                Change
                              </button>
                              <button className="dabit_card_btns">
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="text-danger error-12"></div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* drop list control code  */}
                    <div className="row mt-4 w-100 p-5">
                      <div className="col-md-12">
                        <div className="form-group custon_select">
                          <Select
                            className="width-selector"
                            // value={{label: 'Select Period', value: 'Period '}}
                            classNamePrefix="custon_select-selector-inner"
                            options={[
                              { label: "Company", value: "" },
                              { label: "Email Address", value: "" },
                              { label: "Amount 123", value: "" },
                            ]}
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
                      <div className="col-12 ">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="">
                              <input
                                type="checkbox"
                                id="chk1"
                                className="mr-3"
                              />
                              <span id="chk1" className=""></span>
                              Hide Reconciled Items
                            </label>
                          </div>
                        </div>
                        <div className="export-import-btns">
                          <button className="dabit_card_btns">Send</button>
                          <button className="dabit_card_btns">Report</button>
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

export default DebitCardReconciliation;
