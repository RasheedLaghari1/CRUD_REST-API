import React, { Component, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import AutosizeInput from "react-input-autosize";
import "./ApprovalGroupSetup.css";
import Delete from "../Delete/Delete";
import ApprovalSetup from "../ApprovalSetup/ApprovalSetup";
import { toast } from "react-toastify";

export default function ApprovalGroupSetup(props) {
  let {
    approvalName,

    poCheck,
    poApprovers,

    invoiceCheck,
    invoiceApprovers,

    expenseCheck,
    expenseApprovers,

    documentCheck,
    documentApprovers,

    paymentCheck,
    paymentApprovers,

    timecardCheck,
    timecardApprovers,

    journalCheck,
    journalApprovers,

    supplierCheck,
    supplierApprovers,

    allPOApproverCheck,
    allInvcApproverCheck,
    allExpApproverCheck,
    allDocApproverCheck,
    allPayApproverCheck,
    allTimecardsApproverCheck,
    allJournalsApproverCheck,
    allSupplierApproverCheck,

    formErrors,
    openApprovalGroupSetupModal,
    openApprovalSetupModal,
    isChecked,
  } = props.state;
  console.log("check>>>>>>>>>", props.state);
  const [state, setState] = useState({
    openDeleteModal: false,
    type: "",
  });
  const closeModal = (name) => {
    setState((prev) => ({ ...prev, [name]: false }));
  };

  const openModal = async (name, type) => {
    const toastMsg = "Please select records to Delete";
    if (type === "PO") {
      const foundIndex = poApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Invoice") {
      const foundIndex = invoiceApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Expense") {
      const foundIndex = expenseApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Payment") {
      const foundIndex = paymentApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Document") {
      const foundIndex = documentApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Timecard") {
      const foundIndex = timecardApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Journal") {
      const foundIndex = journalApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    } else if (type === "Supplier") {
      const foundIndex = supplierApprovers.findIndex((i) => i.checked === true);
      if (foundIndex === -1) return toast.error(toastMsg);
      setState((prev) => ({ ...prev, [name]: true, type: type }));
    }
    // if (isChecked === false) {
    //   toast.error("Please select records to Delete");
    // } else {
    //   setState((prev) => ({ ...prev, [name]: true, type: type }));
    // }

    // this.setState({
    //   [name]: false,
    //   // ordersMoreDetails: "",
    // });
  };
  let handleFieldChange = props.handleFieldChange;

  poCheck = poCheck || "";
  invoiceCheck = invoiceCheck || "";
  expenseCheck = expenseCheck || "";
  paymentCheck = paymentCheck || "";
  documentCheck = documentCheck || "";
  timecardCheck = timecardCheck || "";
  journalCheck = journalCheck || "";
  supplierCheck = supplierCheck || "";

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openApprovalGroupSetupModal}
        onHide={() => props.closeModal("openApprovalGroupSetupModal")}
        className="modal__approval_group_setup mx-auto"
      >
        <Modal.Body>
          <div className="user_setup_main">
            <header>
              <div className="user_setup_heading">
                <h2>Approval Group Setup</h2>
              </div>
            </header>
            <div className="white_box user-setup-modal-inner dataTablesEmpty tbl__wdth-wrapper">
              <div className="amy_user approve__input--wrapper">
                <AutosizeInput
                  className="input__resize"
                  name="approvalName"
                  value={approvalName}
                  inputStyle={{
                    fontSize: "16px",
                    maxWidth: "400px",
                  }}
                  onChange={props.handleFieldChange}
                />
                <div className="text-danger error-12 ">
                  {formErrors.approvalName !== ""
                    ? formErrors.approvalName
                    : ""}
                </div>
              </div>

              <div className="approvalgroup-poup_can-sav-btn">
                <button
                  onClick={props.addEditApprovalGroup}
                  className="btn can-btn1"
                >
                  <img src="images/save-check.png" alt="check" />
                  Save
                </button>

                <button
                  onClick={() =>
                    props.closeModal("openApprovalGroupSetupModal")
                  }
                  className="btn can-btn1 pl-3"
                >
                  <img src="images/cancel.png" alt="cancel" />
                  Cancel
                </button>
              </div>
              {/* purchase order */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        {" "}
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Purchase_Orders"
                          />{" "}
                        </span>{" "}
                        Purchase Orders
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="poCheck"
                      >
                        <input
                          type="checkbox"
                          id="poCheck"
                          name="poCheck"
                          value={poCheck}
                          checked={poCheck.toLowerCase() === "y" ? true : false}
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />
                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>

                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          onClick={() => props.primeApprover("PO")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("PO")}
                          onClick={() => openModal("openDeleteModal", "PO")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) => props.copyApprovers(e, "PO")}
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) => props.pasteApprovers(e, "PO")}
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Purchase_Orders">
                  <table
                    id="approvalGroupSetupOrder"
                    className="table table-responsive user_setup_table"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"poApproverCheck"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="poApproverCheck"
                                name="poApproverCheck"
                                checked={allPOApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position{" "}
                          </span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>{" "}
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {poApprovers.map((po, i) => {
                        return (
                          <tr
                            key={i}
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "PO", i, po)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={`poApprover${i}`}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`poApprover${i}`}
                                    name="poApproverCheck"
                                    checked={po.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>
                            <td className=" ">{po.approverName}</td>
                            <td>{po.sequence}</td>
                            <td> {po.signaturePosition}</td>
                            <td>
                              {po.range === "All"
                                ? po.range
                                : po.range === "Above"
                                ? po.range + " " + " " + po.amountFrom
                                : po.range === "Between"
                                ? po.range +
                                  " " +
                                  po.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  po.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>{" "}
              </div>
              {/* {Invoices} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Invoices"
                          />{" "}
                        </span>
                        Invoices
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="invoiceCheck"
                      >
                        <input
                          type="checkbox"
                          id="invoiceCheck"
                          name="invoiceCheck"
                          value={invoiceCheck}
                          checked={
                            invoiceCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />
                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          onClick={() => props.primeApprover("Invoice")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Invoice")}
                          onClick={() =>
                            openModal("openDeleteModal", "Invoice")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Invoice")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Invoice")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Invoices">
                  <table
                    className="table table-responsive "
                    id="approvalGroupSetupInvoice"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"invoiceApproverCheck"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="invoiceApproverCheck"
                                name="invoiceApproverCheck"
                                checked={allInvcApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceApprovers.map((invc, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Invoice", i, invc)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"invoiceApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"invoiceApprover" + i}
                                    name="invoiceApproverCheck"
                                    checked={invc.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>
                            <td className=" ">{invc.approverName}</td>
                            <td>{invc.sequence}</td>
                            <td> {invc.signaturePosition}</td>
                            <td>
                              {invc.range === "All"
                                ? invc.range
                                : invc.range === "Above"
                                ? invc.range + " " + " " + invc.amountFrom
                                : invc.range === "Between"
                                ? invc.range +
                                  " " +
                                  invc.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  invc.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {Expenses} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between  bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Expenses"
                          />{" "}
                        </span>
                        Expenses
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="expenseCheck"
                      >
                        <input
                          type="checkbox"
                          id="expenseCheck"
                          name="expenseCheck"
                          value={expenseCheck}
                          checked={
                            expenseCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />
                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          onClick={() => props.primeApprover("Expense")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Expense")}
                          onClick={() =>
                            openModal("openDeleteModal", "Expense")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Expense")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Expense")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Expenses">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupExpense"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"expenseApproverCheck"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="expenseApproverCheck"
                                name="expenseApproverCheck"
                                checked={allExpApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseApprovers.map((exp, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Expense", i, exp)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"expenseApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"expenseApprover" + i}
                                    name="expenseApproverCheck"
                                    checked={exp.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>
                            <td className=" ">{exp.approverName}</td>
                            <td>{exp.sequence}</td>
                            <td> {exp.signaturePosition}</td>
                            <td>
                              {exp.range === "All"
                                ? exp.range
                                : exp.range === "Above"
                                ? exp.range + " " + " " + exp.amountFrom
                                : exp.range === "Between"
                                ? exp.range +
                                  " " +
                                  exp.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  exp.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {Payments} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Payments"
                          />{" "}
                        </span>
                        Payments
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="paymentCheck"
                      >
                        <input
                          type="checkbox"
                          id="paymentCheck"
                          name="paymentCheck"
                          value={paymentCheck}
                          checked={
                            paymentCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />
                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          onClick={() => props.primeApprover("Payment")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Payment")}
                          onClick={() =>
                            openModal("openDeleteModal", "Payment")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Payment")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Payment")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Payments">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupPayments"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"paymentApproverCheck"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="paymentApproverCheck"
                                name="paymentApproverCheck"
                                checked={allPayApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentApprovers.map((pay, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Payment", i, pay)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"paymentApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"paymentApprover" + i}
                                    name="paymentApproverCheck"
                                    checked={pay.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>
                            <td className=" ">{pay.approverName}</td>
                            <td>{pay.sequence}</td>
                            <td> {pay.signaturePosition}</td>
                            <td>
                              {pay.range === "All"
                                ? pay.range
                                : pay.range === "Above"
                                ? pay.range + " " + " " + pay.amountFrom
                                : pay.range === "Between"
                                ? pay.range +
                                  " " +
                                  pay.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  pay.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {Documents} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Documents"
                          />{" "}
                        </span>
                        Documents
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="documentCheck"
                      >
                        <input
                          type="checkbox"
                          id="documentCheck"
                          name="documentCheck"
                          value={documentCheck}
                          checked={
                            documentCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />

                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          onClick={() => props.primeApprover("Document")}
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Document")}
                          onClick={() =>
                            openModal("openDeleteModal", "Document")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Document")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Document")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Documents">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupDocuments"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"documentApprover"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="documentApprover"
                                name="documentApproverCheck"
                                checked={allDocApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentApprovers.map((doc, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Document", i, doc)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"documentApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"documentApprover" + i}
                                    name="documentApproverCheck"
                                    checked={doc.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>
                            <td className=" ">{doc.approverName}</td>
                            <td>{doc.sequence}</td>
                            <td> {doc.signaturePosition}</td>
                            <td>
                              {doc.range === "All"
                                ? doc.range
                                : doc.range === "Above"
                                ? doc.range + " " + " " + doc.amountFrom
                                : doc.range === "Between"
                                ? doc.range +
                                  " " +
                                  doc.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  doc.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>{" "}
              </div>
              {/* {Timecards} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          {" "}
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Timecards"
                          />{" "}
                        </span>
                        Timecards
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="timecardCheck"
                      >
                        <input
                          type="checkbox"
                          id="timecardCheck"
                          name="timecardCheck"
                          value={timecardCheck}
                          checked={
                            timecardCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />

                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          className="btn user_setup_rbtns"
                          onClick={() => props.primeApprover("Timecard")}
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Timecard")}
                          onClick={() =>
                            openModal("openDeleteModal", "Timecard")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Timecard")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Timecard")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Timecards">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupTimecards"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"timecardApprover"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="timecardApprover"
                                name="timecardApproverCheck"
                                checked={allTimecardsApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            {" "}
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {timecardApprovers.map((tc, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Timecard", i, tc)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"timecardApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"timecardApprover" + i}
                                    name="timecardApproverCheck"
                                    checked={tc.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>

                            <td className=" ">{tc.approverName}</td>
                            <td>{tc.sequence}</td>
                            <td> {tc.signaturePosition}</td>
                            <td>
                              {tc.range === "All"
                                ? tc.range
                                : tc.range === "Above"
                                ? tc.range + " " + " " + tc.amountFrom
                                : tc.range === "Between"
                                ? tc.range +
                                  " " +
                                  tc.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  tc.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {Journal} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Journal"
                          />
                        </span>
                        Journal
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="journalCheck"
                      >
                        <input
                          type="checkbox"
                          id="journalCheck"
                          name="journalCheck"
                          value={journalCheck}
                          checked={
                            journalCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />

                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          className="btn user_setup_rbtns"
                          onClick={() => props.primeApprover("Journal")}
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Journal")}
                          onClick={() =>
                            openModal("openDeleteModal", "Journal")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Journal")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Journal")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Journal">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupJournal"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"journalApprover"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="journalApprover"
                                name="journalApproverCheck"
                                checked={allJournalsApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalApprovers.map((jrnl, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Journal", i, jrnl)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"journalApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"journalApprover" + i}
                                    name="journalApproverCheck"
                                    checked={jrnl.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>

                            <td className=" ">{jrnl.approverName}</td>
                            <td>{jrnl.sequence}</td>
                            <td> {jrnl.signaturePosition}</td>
                            <td>
                              {jrnl.range === "All"
                                ? jrnl.range
                                : jrnl.range === "Above"
                                ? jrnl.range + " " + " " + jrnl.amountFrom
                                : jrnl.range === "Between"
                                ? jrnl.range +
                                  " " +
                                  jrnl.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  jrnl.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* {Supplier} */}
              <div className="approval_group_popup__table">
                <div className="d-flex justify-content-between bord-btm">
                  <div className="d-flex">
                    <div>
                      <h2>
                        <span>
                          <img
                            src="images/arrow_up.png"
                            className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                            alt="arrow_up"
                            data-toggle="collapse"
                            data-target="#Supplier"
                          />
                        </span>
                        Supplier
                      </h2>
                    </div>

                    <div className="approve__label-heading">
                      <label
                        className="check_main remember_check"
                        htmlFor="supplierCheck"
                      >
                        <input
                          type="checkbox"
                          id="supplierCheck"
                          name="supplierCheck"
                          value={supplierCheck}
                          checked={
                            supplierCheck.toLowerCase() === "y" ? true : false
                          }
                          onChange={handleFieldChange}
                          className="custom-control-input"
                        />

                        <span className="click_checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="approval-group_plus_Icons p-0">
                    <ul>
                      <li>
                        <button
                          className="btn user_setup_rbtns"
                          onClick={() => props.primeApprover("Supplier")}
                          type="button"
                        >
                          <span
                            className="round_plus"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",
                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 349.03 349.031"
                            >
                              <g>
                                <path
                                  d="M349.03,141.226v66.579c0,5.012-4.061,9.079-9.079,9.079H216.884v123.067c0,5.019-4.067,9.079-9.079,9.079h-66.579
                            c-5.009,0-9.079-4.061-9.079-9.079V216.884H9.079c-5.016,0-9.079-4.067-9.079-9.079v-66.579c0-5.013,4.063-9.079,9.079-9.079
                            h123.068V9.079c0-5.018,4.069-9.079,9.079-9.079h66.579c5.012,0,9.079,4.061,9.079,9.079v123.068h123.067
                            C344.97,132.147,349.03,136.213,349.03,141.226z"
                                />
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          // onClick={() => props.removeApprover("Supplier")}
                          onClick={() =>
                            openModal("openDeleteModal", "Supplier")
                          }
                          className="btn user_setup_rbtns"
                          type="button"
                        >
                          <span
                            className="round_file"
                            style={{
                              display: "flex",
                              width: "20px",
                              height: "20px",

                              alignItems: "center",

                              background: "#2f73ad",
                              borderRadius: "50%",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              style={{ fill: "white" }}
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="12px"
                              height="12px"
                              viewBox="0 0 384 384"
                              // style="enable-background:new 0 0 384 384;"
                            >
                              <g>
                                <g>
                                  <g>
                                    <path d="M64,341.333C64,364.907,83.093,384,106.667,384h170.667C300.907,384,320,364.907,320,341.333v-256H64V341.333z" />
                                    <polygon points="266.667,21.333 245.333,0 138.667,0 117.333,21.333 42.667,21.333 42.667,64 341.333,64 341.333,21.333 			" />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                        </button>
                      </li>
                      <li>
                        {/* <button className="btn user_setup_rbtns">
                          <img src="images/user-setup/dots.png" alt="menue" />
                        </button> */}
                        <div>
                          <Dropdown
                            alignRight="false"
                            drop="down"
                            className="analysis-card-dropdwn setting_popup_dots"
                          >
                            <Dropdown.Toggle
                              variant="sucess"
                              id="dropdown-basic"
                            >
                              <span
                                className="dots_img"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <svg
                                  style={{ fill: "#2f73ad" }}
                                  // className="dots_img_sass"
                                  id="Capa_1"
                                  enable-background="new 0 0 515.555 515.555"
                                  height="20"
                                  viewBox="0 0 515.555 515.555"
                                  width="20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                  <path d="m303.347 405.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0" />
                                </svg>
                              </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) =>
                                  props.copyApprovers(e, "Supplier")
                                }
                              >
                                &nbsp;&nbsp;Copy
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={(e) =>
                                  props.pasteApprovers(e, "Supplier")
                                }
                              >
                                &nbsp;&nbsp;Paste
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="collapse " id="Supplier">
                  <table
                    className="table table-responsive"
                    id="approvalGroupSetupSupplier"
                    width="100%"
                  >
                    <thead className="thead_bg hover-border">
                      <tr>
                        <th scope="col">
                          <div className="custom-radio">
                            <label
                              className="check_main remember_check"
                              htmlFor={"supplierApprover"}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="supplierApprover"
                                name="supplierApproverCheck"
                                checked={allSupplierApproverCheck}
                                onChange={(e) =>
                                  props.handleApproversListCheckbox(e, "", true)
                                }
                              />
                              <span className="click_checkmark global_checkmark"></span>
                            </label>
                          </div>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">User</span>{" "}
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Sequence</span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">
                            Signature position
                          </span>
                        </th>
                        <th scope="col">
                          <span className="user_setup_hed">Amount</span>
                        </th>
                        <th className="text-center table__inner--th">
                          <span className="user_setup_hed2">
                            <img
                              src="./images/user-setup/bars.png"
                              alt="bars"
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierApprovers.map((sup, i) => {
                        return (
                          <tr
                            className="cursorPointer"
                            onClick={(e) =>
                              props.getApproverDetails(e, "Supplier", i, sup)
                            }
                          >
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={"supplierApprover" + i}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={"supplierApprover" + i}
                                    name="supplierApproverCheck"
                                    checked={sup.checked}
                                    onChange={(e) =>
                                      props.handleApproversListCheckbox(e, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>

                            <td className=" ">{sup.approverName}</td>
                            <td>{sup.sequence}</td>
                            <td> {sup.signaturePosition}</td>
                            <td>
                              {sup.range === "All"
                                ? sup.range
                                : sup.range === "Above"
                                ? sup.range + " " + " " + sup.amountFrom
                                : sup.range === "Between"
                                ? sup.range +
                                  " " +
                                  sup.amountTo +
                                  " " +
                                  "to " +
                                  " " +
                                  sup.amountFrom
                                : ""}
                            </td>
                            <td></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Delete
        openDeleteModal={state.openDeleteModal}
        closeModal={closeModal}
        type={state.type}
        onDelete={props.removeApprover}
      />
      <ApprovalSetup
        openModal={props.openModal}
        closeModal={props.closeModal}
        state={props.state}
        handleFieldChange={props.handleFieldChange}
        addEditApprover={props.addEditApprover}
        handleChangeApproverName={props.handleChangeApproverName}
        handleValueOptions={props.handleValueOptions}
        handleHideUnhideRows={props.handleHideUnhideRows}
        handleShowHiddenRows={props.handleShowHiddenRows}
      />
    </>
  );
}
