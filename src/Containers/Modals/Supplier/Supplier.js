import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import $ from "jquery";

import AddVendorConfirmModal from "../AddVendorConfirm/AddVendorConfirm";
import SupplierLookup from "../SupplierLookup/SupplierLookup";
import ContactModal from "../Contact/Contact";
import { toast } from "react-toastify";
import { userAvatar, _customStyles } from "../../../Constants/Constants";
import SupplierForm from "../SupplierForm/SupplierForm";
import {
  getSupplierDetails,
  clearSupplierStates,
} from "../../../Actions/SupplierActtions/SupplierActions";
import {
  getTaxCodes,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";
import { getQuote, clearPOStates } from "../../../Actions/POActions/POActions";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../../Utils/Helpers";
import { getPO } from "../../../Actions/POActions/POActions";
import { handleAPIErr } from "../../../Utils/Helpers";
let moment = require("moment");

const Supplier = (props) => {
  const dispatch = useDispatch();
  const poData = useSelector((state) => state.poData);
  const supplier = useSelector((state) => state.supplier);
  const chart = useSelector((state) => state.chart);

  const [state, setState] = useState({
    isLoading: false,
    quote: "", //import quote
    attachment: "", // po attachment
    contacts: [], //suppliers constacts
    openAddVendorConfirmModal: false,
    openContactModal: false,
    openSupplierLookupModal: false,
    openSupplierForm: false,
    // date picker
    startDate: new Date(),
    poDataDetail: "",
  });

  useEffect(() => {
    if (props.openSupplierModal) {
      addDragAndDropFileListners("drop-area-attach-modal", uploadAttachment);

      $(".focus_vender").focusout(function () {
        setTimeout(() => {
          $(".invoice_vender_menu1").hide();
        }, 400);
      });
    }
    _getPO(props.stateData.tran);
  }, [props.openSupplierModal]);

  const openModal = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const closeModal = (name) => {
    setState((prev) => ({
      ...prev,
      [name]: false,
    }));
  };
  //getting the single purchase order
  const _getPO = async (tran) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    if (poData.getPOSuccess === "") {
      if (tran) {
        await dispatch(getPO(tran)); // get PO
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  };
  // useEffect(() => {
  //   //success case of PO
  //   if (poData.getPOSuccess) {

  //   } else if (poData.getPOError) {
  //     //error case of PO
  //     handleAPIErr(poData.getPOError);
  //   }
  // }, [poData]);

  const handleChange = (date) => {
    setState((prev) => ({
      ...prev,
      startDate: date,
    }));
  };

  //a function that checks  api error
  const handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      dispatch(clearStatesAfterLogout());
      props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  const clearStates = async () => {
    setState((prev) => ({
      ...prev,
      contacts: [], //suppliers constacts
      attachment: "", // po attachment
      quote: "", //import quote
    }));
    props.closeModal("openSupplierModal");
    removeDragAndDropFileListners("drop-area-attach-modal", uploadAttachment);
  };
  //Edit the Supplier when clicks on Edit button
  const editSupplier = async () => {
    let { currency, supplierCode } = props.stateData;

    if (supplierCode && currency) {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));
      await Promise.all([
        _getTaxCodes(),
        _getSupplierDetails(supplierCode, currency),
      ]);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      openModal("openSupplierForm");
    } else {
      toast.error("Supplier Code or Currency missing!");
    }
  };
  //get tax codes
  const _getTaxCodes = async () => {
    await dispatch(getTaxCodes());
  };

  useEffect(() => {
    //success case of Get Tax Codes
    if (chart.getTaxCodesSuccess) {
      // toast.success(chart.getTaxCodesSuccess);
      dispatch(clearChartStates());
    } else if (chart.getTaxCodesError) {
      //error case of Get Tax Codes
      handleApiRespErr(chart.getTaxCodesError);
      dispatch(clearChartStates());
    }
  }, [chart]);

  //get info of single supplier
  const _getSupplierDetails = async (code, currency) => {
    let supplierDetails = {
      currency,
      code,
    };

    await dispatch(getSupplierDetails(supplierDetails));
  };

  useEffect(() => {
    //success case of Get  Supplier Details
    if (supplier.getSupplierDetailsSuccess) {
      // toast.success(supplier.getSupplierDetailsSuccess);
      dispatch(clearSupplierStates());
    } else if (supplier.getSupplierDetailsError) {
      //error case of Get  Supplier

      handleApiRespErr(supplier.getSupplierDetailsError);
      dispatch(clearSupplierStates());
    }
  }, [supplier]);

  // uplaod po attchments
  const uploadAttachment = async (attachments) => {
    let fileList = [];

    for (let i = 0; i < attachments.length; i++) {
      let type = attachments[i].type;
      let file = attachments[i];
      let size = attachments[i].size;
      let name = attachments[i].name;

      if (
        type == "application/pdf" ||
        type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        type == "image/jpeg" ||
        type == "image/jpg" ||
        type == "image/png" ||
        type == "application/msword" ||
        type == "application/vnd.ms-excel" ||
        type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        type == "application/vnd.ms-powerpoint" ||
        type == "text/csv"
      ) {
        if (size <= 10485760) {
          //10MB = 10485760 Bytes
          const result = await toBase64(file).catch((e) => e);
          if (result instanceof Error) {
            toast.error(result.message);
            return;
          } else {
            fileList.push({
              fileName: name,
              attachment: result.split(",")[1],
            });
          }
        } else {
          toast.error(
            "This file exceeds the 10MB limit. Please upload a smaller file."
          );
        }
      } else {
        toast.error(
          "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
        );
      }
    }

    if (attachments.length === fileList.length) {
      await addAttachments(fileList);
    }
  };

  const addAttachments = async (fileList) => {
    await props.addAttachment(fileList);
    setState((prev) => ({
      ...prev,
      attachment: "",
    }));
  };
  //import quote
  const handleQuote = async (e) => {
    let quote = e.target.value;
    setState((prev) => ({
      ...prev,
      quote,
    }));
  };
  //call api to import quote
  const importQuote = async () => {
    let { quote } = state;
    let { supplierCode, tran } = props.stateData;
    if (quote && quote.trim() && supplierCode) {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      await dispatch(getQuote(supplierCode, quote, tran));

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    //success case of get  quotes
    if (poData.getQuoteSuccess) {
      toast.success(poData.getQuoteSuccess);
      props.importQuote(poData.getQuote); //replace po-lines
      dispatch(clearPOStates());
    }
    //error case of get quotes
    if (poData.getQuoteError) {
      handleApiRespErr(poData.getQuoteError);
      dispatch(clearPOStates());
    }
  }, [poData]);

  const onSave = async (e) => {
    e.preventDefault();

    let { supplierCode } = props.stateData;
    if (supplierCode) {
      await props.updatePOSup();
      clearStates();
    } else {
      props.validateField("supplierCode", supplierCode);
    }
  };
  const onFocus = (e) => {
    let id = e.target.id;
    setState((prev) => ({
      ...prev,
      [id]: true,
    }));
  };
  const onBlur = (e) => {
    let id = e.target.id;
    setState((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  // render code

  let {
    currency,
    poDate,
    supplierName,
    supplierPhone,
    supplierAddress,
    supplierContact,
    supplierEmail,
    supplierCode,
    cur_hide,
    date_hide,
    address_hide,
    quote_hide,
    formErrors,
  } = props.stateData;
  console.log("podata@@@@@", poData);
  let { lockSupplier } =
    poData.getPO && poData.getPO.poDetails ? poData.getPO.poDetails : "";

  let lockSupplierCheck = !lockSupplier
    ? false
    : lockSupplier && lockSupplier === "N"
    ? true
    : false;

  let userType = localStorage.getItem("userType");
  let tab = props.tab || "";

  let checkOne = false;

  if (userType && tab) {
    if (userType.toLowerCase() === "approver") {
      /* An Approver can only edit the chart code, tracking codes and item description.
         Everything else in the PO is read-only and cannot be altered.*/

      checkOne = true;
    } else if (userType.toLowerCase() === "operator") {
      /*The Operator account should only be able to edit the Preview PDF in the Draft section,
         in every other section the preview pdf must be read only for them.*/
      if (tab != "draft") {
        checkOne = true;
      }
    } else if (userType.toLowerCase() === "op/approver") {
      /*The Operator/Approver account can edit everything in the Draft section 
        AND they can also edit the Chart Code, Tracking Code and Description in the Approve
        and Hold Section */
      if (tab != "draft") {
        checkOne = true;
      }
    }
  }

  poDate = poDate ? moment(poDate).format("DD MMM YYYY").toUpperCase() : "";

  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openSupplierModal}
        onHide={clearStates}
        className="forgot_email_modal modal_704 mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid ">
            <form onSubmit={onSave}>
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">Suppliers</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              {}
                              {lockSupplierCheck ? (
                                checkOne ? (
                                  <></>
                                ) : (
                                  <button
                                    tabIndex="3674"
                                    type="button"
                                    id="id_edit"
                                    className={
                                      state.id_edit
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    onClick={editSupplier}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                  >
                                    <img
                                      className="pr-3"
                                      src="images/menu-report.png"
                                      alt="edit"
                                    />
                                    Edit
                                  </button>
                                )
                              ) : (
                                ""
                              )}
                              {checkOne ? (
                                <></>
                              ) : (
                                <button
                                  type="submit"
                                  className={
                                    state.id_save
                                      ? "btn-save btn_focus"
                                      : "btn-save"
                                  }
                                  tabIndex="3675"
                                  id="id_save"
                                  onFocus={onFocus}
                                  onBlur={onBlur}
                                >
                                  <span className="fa fa-check "></span>
                                  Save
                                </button>
                              )}

                              <button
                                tabIndex="3676"
                                type="button"
                                id="id_disc"
                                className={
                                  state.id_disc
                                    ? "btn-save btn_focus"
                                    : "btn-save"
                                }
                                onClick={clearStates}
                                onFocus={onFocus}
                                onBlur={onBlur}
                              >
                                <span className="fa fa-ban"></span>
                                Discard
                              </button>
                            </div>
                            <div className="s-c-main">
                              <Dropdown
                                alignRight="false"
                                drop="down"
                                className="analysis-card-dropdwn float-right"
                              >
                                <Dropdown.Toggle
                                  variant="sucess"
                                  id="dropdown-basic"
                                >
                                  <img
                                    src="images/user-setup/dots.png"
                                    className=" img-fluid"
                                    alt="user"
                                  />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    <div
                                      className="pr-0"
                                      onClick={() =>
                                        props.handleHideCheck(
                                          "cur_hide",
                                          cur_hide
                                        )
                                      }
                                    >
                                      <div className="form-group remember_check mm_check mm_check5">
                                        <input
                                          type="checkbox"
                                          id="cur_hide"
                                          name="cur_hide"
                                          checked={cur_hide}
                                        />
                                        <label
                                          htmlFor="cur_hide"
                                          className="mr-0"
                                        >
                                          Hide Currency
                                        </label>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <div
                                      className="pr-0"
                                      onClick={() =>
                                        props.handleHideCheck(
                                          "date_hide",
                                          date_hide
                                        )
                                      }
                                    >
                                      <div className="form-group remember_check mm_check">
                                        <input
                                          type="checkbox"
                                          id="date_hide"
                                          name="date_hide"
                                          checked={date_hide}
                                        />
                                        <label
                                          htmlFor="date_hide"
                                          className="mr-0"
                                        >
                                          Hide Date
                                        </label>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <div
                                      className="pr-0"
                                      onClick={() =>
                                        props.handleHideCheck(
                                          "address_hide",
                                          address_hide
                                        )
                                      }
                                    >
                                      <div className="form-group remember_check mm_check">
                                        <input
                                          type="checkbox"
                                          id="address_hide"
                                          name="address_hide"
                                          checked={address_hide}
                                        />
                                        <label
                                          htmlFor="address_hide"
                                          className="mr-0"
                                        >
                                          Hide Address
                                        </label>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <div
                                      className="pr-0"
                                      onClick={() =>
                                        props.handleHideCheck(
                                          "quote_hide",
                                          quote_hide
                                        )
                                      }
                                    >
                                      <div className="form-group remember_check mm_check">
                                        <input
                                          type="checkbox"
                                          id="quote_hide"
                                          name="quote_hide"
                                          checked={quote_hide}
                                        />
                                        <label
                                          htmlFor="quote_hide"
                                          className="mr-0"
                                        >
                                          Hide Import Quote
                                        </label>
                                      </div>
                                    </div>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row mt-4">
                          {!cur_hide ? (
                            <div className="col-md-6">
                              {/* dropdown coding start */}
                              <div className="form-group custon_select custom_selct2">
                                <label>Currency</label>
                                <Select
                                  isDisabled={checkOne}
                                  className="width-selector"
                                  value={{
                                    label: currency,
                                    value: currency,
                                  }}
                                  // classNamePrefix="custon_select-selector-inner"
                                  styles={_customStyles}
                                  classNamePrefix="react-select"
                                  options={props.currencyList}
                                  onChange={props.handleCurrencyChange}
                                  tabIndex="3672"
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
                              {/* end  */}
                            </div>
                          ) : (
                            ""
                          )}

                          {!date_hide ? (
                            <div className="col-md-6">
                              <div className="form-group custon_select">
                                <label htmlFor="usr">Date</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="disable_bg disable_border"
                                    id="usr"
                                    tabIndex="3673"
                                    value={poDate}
                                    onChange={() => {}}
                                    // disabled={checkOne}
                                    disabled
                                  />
                                  {/* <DatePicker
                                disabled
                                selected={new Date()}
                                onChange={handleChange}
                                 dateFormat="d MMM yyyy"
                                autoComplete='off'

                              /> */}
                                  {/* <input type="date" className="form-control" id="usr"/> */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-12">
                            <div className="form-group custon_select">
                              <label htmlFor="Name">Name</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkOne
                                      ? "disable_bg disable_border focus_vender"
                                      : "form-control focus_vender"
                                  }
                                  id="Name"
                                  autoComplete="off"
                                  autoFocus={true}
                                  tabIndex="3667"
                                  name={"supplierName"}
                                  value={supplierName}
                                  placeholder={
                                    "Please select supplier from list or start typing"
                                  }
                                  onChange={props.handleChangeSupplierName}
                                  disabled={checkOne}
                                />

                                <span className="input_field_icons order_sup_icons">
                                  {lockSupplierCheck ? (
                                    checkOne ? (
                                      <i className="fa fa-plus mr-3"></i>
                                    ) : (
                                      <i
                                        onClick={() =>
                                          openModal("openAddVendorConfirmModal")
                                        }
                                        className="fa fa-plus mr-3"
                                      ></i>
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {checkOne ? (
                                    <i className="fa fa-search"></i>
                                  ) : (
                                    <i
                                      onClick={() =>
                                        openModal("openSupplierLookupModal")
                                      }
                                      className="fa fa-search"
                                    ></i>
                                  )}
                                </span>
                              </div>
                              <div className="invoice_vender_menu1">
                                {props.clonedSuppliersList.length > 0 ? (
                                  <ul className="invoice_vender_menu supplier_sub_menu">
                                    {props.clonedSuppliersList.map((s, i) => {
                                      return (
                                        <li
                                          classname="cursorPointer"
                                          key={i}
                                          onClick={() =>
                                            props.updatePOSupplier(s)
                                          }
                                        >
                                          <span>
                                            <img
                                              src={userAvatar}
                                              className=" img-fluid"
                                              alt="user"
                                            />
                                          </span>
                                          <div className="vender_menu_right order_sup">
                                            <h3>{s.name}</h3>
                                            <p className="invoice_edit_vender_email">
                                              {s.email}
                                            </p>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <div className="sup_nt_fnd text-center">
                                    <h6>No Supplier Found</h6>
                                  </div>
                                )}
                                {props.editName ? (
                                  <div className="last_menu_li cursorPointer">
                                    <buuton
                                      onClick={() =>
                                        openModal("openAddVendorConfirmModal")
                                      }
                                      className="addSupplier"
                                    >
                                      + Create Supplier From {"'"}
                                      {supplierName}
                                      {"'"}
                                    </buuton>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="text-danger error-12">
                                {formErrors.supplierCode !== ""
                                  ? formErrors.supplierCode
                                  : ""}
                              </div>
                            </div>
                          </div>
                          {!address_hide ? (
                            <div className="col-12">
                              <div className="form-group custon_select disabled_fields pl-0">
                                <label htmlFor="usr">Address</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="usr"
                                    disabled={checkOne}
                                    value={supplierAddress}
                                    onChange={() => {}}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-12">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Contact Name</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkOne
                                      ? "disable_bg disable_border"
                                      : "form-control"
                                  }
                                  id="usr"
                                  value={supplierContact}
                                  tabIndex="3668"
                                  onChange={() => {}}
                                  disabled={checkOne}
                                />
                                {checkOne ? (
                                  <span className="input_field_icons">
                                    <i className="fa fa-search"></i>
                                  </span>
                                ) : (
                                  <span
                                    onClick={() =>
                                      openModal("openContactModal")
                                    }
                                    className="input_field_icons"
                                  >
                                    <i className="fa fa-search"></i>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Email</label>
                              <div className="modal_input">
                                <input
                                  type="email"
                                  className={
                                    checkOne
                                      ? "disable_bg disable_border"
                                      : "form-control"
                                  }
                                  id="usr"
                                  value={supplierEmail}
                                  tabIndex="3669"
                                  onChange={() => {}}
                                  disabled={checkOne}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group custon_select">
                              <label htmlFor="usr">Phone</label>
                              <div className="modal_input">
                                <input
                                  type="text"
                                  className={
                                    checkOne
                                      ? "disable_bg disable_border"
                                      : "form-control"
                                  }
                                  id="usr"
                                  value={supplierPhone}
                                  tabIndex="3670"
                                  onChange={() => {}}
                                  disabled={checkOne}
                                />
                              </div>
                            </div>
                          </div>
                          {!quote_hide ? (
                            <div className="col-12">
                              <div className="form-group custon_select">
                                <label htmlFor="usr">Import Quote</label>
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className={
                                      checkOne
                                        ? "disable_bg disable_border"
                                        : "form-control"
                                    }
                                    id="usr"
                                    name="quote"
                                    tabIndex="3671"
                                    value={state.quote}
                                    onChange={handleQuote}
                                    onBlur={importQuote}
                                    disabled={checkOne}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {props.draft && (
                            <div className="col-12 mt-2">
                              <div className="form-group custon_select border text-center mb-0">
                                <div id="drop-area-attach-modal">
                                  <input
                                    type="file"
                                    id="fileElem-modal"
                                    className="form-control d-none"
                                    accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                                , application/pdf, image/jpeg,image/jpg,image/png,
                                 .csv, application/vnd.ms-excel,
                                 application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                 application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={(e) => {
                                      uploadAttachment(e.target.files);
                                    }}
                                    onClick={(event) => {
                                      event.currentTarget.value = null;
                                    }} //to upload the same file again
                                    disabled={checkOne}
                                    multiple
                                  />
                                  <label
                                    className="upload-label"
                                    htmlFor="fileElem-modal"
                                  >
                                    <div className="upload-text">
                                      <img
                                        src="images/drag-file.png"
                                        className="import_icon img-fluid"
                                        alt="upload-attachment"
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <AddVendorConfirmModal
        openAddVendorConfirmModal={state.openAddVendorConfirmModal}
        closeModal={closeModal}
        props={props}
        currencyList={props.currencyList}
        addNewSupplier={props.addNewSupplier}
        supplierName={props.editName ? props.stateData.supplierName : ""}
      />

      <SupplierLookup
        openSupplierLookupModal={state.openSupplierLookupModal}
        closeModal={closeModal}
        getSuppliersList={props.getSuppliersList}
        suppliersList={props.suppliersList || []}
        supplierCode={props.stateData.supplierCode || ""}
        updatePOSupplier={props.updatePOSupplier}
        stateData={props.stateData}
        props={props.props || ""}
        page={props.page || ""}
      />

      <SupplierForm
        openSupplierForm={state.openSupplierForm}
        closeModal={closeModal}
        props={props.props || ""}
        getSuppliersList={props.getSuppliersList}
        updatePO={props.updatePO}
      />

      <ContactModal
        openContactModal={state.openContactModal}
        closeModal={closeModal}
        contacts={props.contacts}
        updatePOSupplierContacts={props.updatePOSupplierContacts} //PO Suppliers contacts update
        updateSupplierContactsList={props.updateSupplierContactsList} //when a contact is updated when click on edit(pencil button)
        deleteSupplierContact={props.deleteSupplierContact} //when a contact is deleted when click on delete button
        supplierCode={props.stateData.supplierCode || ""}
        currency={props.stateData.currency || ""}
      />
    </>
  );
};
export default Supplier;
