import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleAPIErr } from "../../../Utils/Helpers";

import {
  insertSupplier,
  clearSupplierStates,
} from "../../../Actions/SupplierActtions/SupplierActions";
import {
  handleValidation,
  handleWholeValidation,
} from "../../../Utils/Validation";

let moment = require("moment");

const AddVendors = (props) => {
  let [stateData, setStateData] = useState({
    openSupplierModal: false,
    isLoading: false,
    currency: { label: "Select Currency", value: 0 },
    name: "", //name of the supplier
    show: false,
    address: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    date: new Date().getTime(),
    //contacts info
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    formErrors: {
      name: "",
      currency: "",
    },
  });
  const adrsRef = useRef(null);
  const nameRef = useRef(null);
  const dispatch = useDispatch();
  const suppliertState = useSelector((state) => state.supplier);

  useEffect(() => {
    if (props.openAddVendorsModal) {
      let { currency } = stateData;
      //put  currency  as  the default values
      let getDefaultValues = localStorage.getItem("getDefaultValues");
      let parsedVals = JSON.parse(getDefaultValues);
      if (parsedVals && parsedVals.defaultValues) {
        if (parsedVals.defaultValues && parsedVals.defaultValues.chartSort) {
          let chartSort = parsedVals.defaultValues.chartSort || "";
          if (chartSort) {
            let chartSortArr = chartSort.toString().split(".");

            if (chartSortArr.length === 3) {
              let crncy = chartSortArr[0]; // default curreny
              currency = { label: crncy, value: crncy };
              let _currency = props.currencyList.find((c) => c.value == crncy);

              if (_currency) {
                currency = _currency;
              }
            }
          }
        }
      }

      setStateData((prev) => ({
        ...prev,
        currency,
        name: props.supplierName,
      }));
      if (props.supplierName) {
        setTimeout(() => {
          adrsRef.current.focus();
        }, 200);
      } else {
        setTimeout(() => {
          nameRef.current.focus();
        }, 200);
      }
    }
  }, [props.openAddVendorsModal]);

  const handleChangeDate = (date) => {
    setStateData((prev) => ({ ...prev, date: new Date(date).getTime() }));
  };

  const handleCurrencyChange = (data) => {
    let { formErrors } = stateData;
    formErrors = handleValidation("currency", data.value, formErrors);
    setStateData((prev) => ({ ...prev, currency: data, formErrors }));
  };

  const handleFieldChange = (e) => {
    let { formErrors } = stateData;
    let { name, value } = e.target;
    formErrors = handleValidation(name, value, formErrors);
    setStateData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onSave = async () => {
    let {
      name,
      currency,
      date,
      address,
      address2,
      city,
      state,
      postcode,
      country,
      contactName,
      contactEmail,
      contactPhone,
      formErrors,
    } = stateData;

    formErrors = handleWholeValidation(
      { name, currency: currency.value },
      formErrors
    );

    if (!formErrors.name && !formErrors.currency) {
      setStateData((prev) => ({ ...prev, isLoading: true }));

      let data = {
        supplier: {
          currency: currency.value,
          name,
          w9Exp: date,
          address,
          address2,
          city,
          state,
          postcode,
          country,
        },
        contacts: [
          {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          },
        ],
      };
      await dispatch(insertSupplier(data));
    }
    setStateData((prev) => ({ ...prev, isLoading: false, formErrors }));
  };
  useEffect(() => {
    //success case of Insert Suppliers
    if (suppliertState.insertSupplierSuccess) {
      toast.success(suppliertState.insertSupplierSuccess);
      let insertSupplier = suppliertState.insertSupplier || "";

      let supplier =
        (insertSupplier &&
          insertSupplier.insertSupplierResp &&
          insertSupplier.insertSupplierResp.supplier) ||
        "";
      let contact =
        (insertSupplier &&
          insertSupplier.insertedData &&
          insertSupplier.insertedData.contacts &&
          insertSupplier.insertedData.contacts.length > 0 &&
          insertSupplier.insertedData.contacts[0]) ||
        "";

      let obj = {};
      obj.code = supplier.code || "";
      obj.currency = supplier.currency || "";
      obj.name = supplier.name || "";
      obj.address = supplier.address || "";

      obj.contactName = contact.name || "";
      obj.email = contact.email || "";
      obj.phone = contact.phone || "";

      props.addNewSupplier(obj);
      clearStates();
      dispatch(clearSupplierStates());
    }
    //error case of Insert Suppliers
    if (suppliertState.insertSupplierError) {
      handleAPIErr(suppliertState.insertSupplierError, props.props);

      clearStates();
      dispatch(clearSupplierStates());
    }
  }, [suppliertState]);
  const clearStates = () => {
    setStateData((prev) => ({
      ...prev,
      openSupplierModal: false,
      isLoading: false,
      currency: { label: "Select Currency", value: 0 },
      name: "", //name of the supplier
      show: false,
      address: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      date: new Date().getTime(),
      //contacts info
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      formErrors: {
        name: "",
        currency: "",
      },
    }));
    props.closeModal("openAddVendorsModal");
  };

  let {
    name,
    currency,
    date,
    address,
    address2,
    city,
    state,
    postcode,
    country,
    contactName,
    contactEmail,
    contactPhone,
    formErrors,
    isLoading,
  } = stateData;

  return (
    <>
      {isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openAddVendorsModal}
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
                            <h6 className="text-left def-blue">Add Supplier</h6>
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
                              onClick={clearStates}
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
                      <div className="row mt-4">
                        <div className="col-md-6">
                          {/* dropdown coding start */}
                          <div className="form-group custon_select">
                            <label>Currency</label>
                            <Select
                              className="width-selector"
                              classNamePrefix="custon_select-selector-inner"
                              value={currency}
                              options={props.currencyList}
                              onChange={handleCurrencyChange}
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
                              {formErrors.currency !== ""
                                ? formErrors.currency
                                : ""}
                            </div>
                          </div>
                          {/* end  */}
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Date</label>
                            {/* <div className="modal_input datePickerUP">
                                <DatePicker
                                  selected={date}
                                  onChange={handleChangeDate}
                                  dateFormat="d MMM yyyy"
                                  autoComplete='off'
                                />
                                
                              </div> */}
                            <div className="modal_input ">
                              <input
                                type="text"
                                value={
                                  date
                                    ? moment(date)
                                        .format("DD MMM YYYY")
                                        .toUpperCase()
                                    : ""
                                }
                                onChange={() => {}}
                                className="form-control"
                                id="usr"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label htmlFor="supName">Name</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="supName"
                                ref={nameRef}
                                name="name"
                                value={name}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {formErrors.name !== "" ? formErrors.name : ""}
                              </div>
                              {/* <span className="input_field_icons">
                                  <i className="fa fa-search"></i>
                                </span> */}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="adrss">Address</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="adrss"
                                ref={adrsRef}
                                name="address"
                                value={address}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Address 2</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="address2"
                                value={address2}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">City</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="city"
                                value={city}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">State</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="state"
                                value={state}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Post Code</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="postcode"
                                value={postcode}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Country</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="country"
                                value={country}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Contact Name</label>
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="usr"
                                name="contactName"
                                value={contactName}
                                onChange={handleFieldChange}
                              />
                              {/* <span className="input_field_icons">
                                  <i className="fa fa-search"></i>
                                </span> */}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group custon_select">
                            <label htmlFor="usr">Email</label>
                            <div className="modal_input">
                              <input
                                type="email"
                                className="form-control"
                                id="usr"
                                name="contactEmail"
                                value={contactEmail}
                                onChange={handleFieldChange}
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
                                className="form-control"
                                id="usr"
                                name="contactPhone"
                                value={contactPhone}
                                onChange={handleFieldChange}
                              />
                            </div>
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

export default AddVendors;
