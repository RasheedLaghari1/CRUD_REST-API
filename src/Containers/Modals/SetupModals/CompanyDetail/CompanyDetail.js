import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./CompanyDetail.css";
import Select from "react-select";
import DatePicker from "react-datepicker";

export function CompanyDetails(props) {
  let {
    openCompanyDetailModal,
    address,
    address2,
    advancedList,
    city,
    companyName,
    country,
    postcode,
    showHiddenRows,
    addressShippingCheck,
    shippingAddress,
    shippingAddress2,
    shippingCity,
    shippingCountry,
    shippingPostcode,
    shippingState,
    state,
    taxID
  } = props.state;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={openCompanyDetailModal}
        onHide={() => props.closeModal("openCompanyDetailModal")}
        className="modal__company_detail mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="setting_form_main p-0">
                    <div className="custom_line_type_header thead_bg">
                      <h3 className="custom_line_type_poup_heading">
                        Company Detail
                      </h3>
                      <div className="departments-poup_can-sav-btn">
                        <button
                          className="btn can-btn1"
                          onClick={props.updateBussinessUnit}
                        >
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={() =>
                            props.closeModal("openCompanyDetailModal")
                          }
                          className="btn can-btn1 pl-3"
                        >
                          <img
                            src="images/user-setup/cancel-white.png"
                            alt="cancel"
                          />
                          Cancel
                        </button>
                        <button className="btn can-btn1 pl-2">
                          <img src="images/user-setup/dots-h.png" alt="dots" />
                        </button>
                      </div>
                    </div>
                    <div className="modal__company_poup_body user-setup-modal-inner">
                      <h2>Name & Address</h2>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="focus_input_field">
                            <input
                              type="text"
                              name="companyName"
                              id="companyName"
                              placeholder="Company Name"
                              onChange={props.handleChangeField}
                              value={companyName}
                            />
                            <label htmlFor="companyName">Company Name</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="focus_input_field">
                            <input
                              type="text"
                              name="taxID"
                              id="taxID"
                              placeholder="Tax Id"
                              onChange={props.handleChangeField}
                              value={taxID}
                            />
                            <label htmlFor="taxID">Tax Id</label>
                          </div>
                        </div>
                        <div className="col-12 pt-3 pb-3 company-detail_check">
                          <div className="custom-radio">
                            Address
                            <label
                              className="check_main remember_check"
                              htmlFor="sa"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="sa"
                                name="addressShippingCheck"
                                value="address"
                                checked={addressShippingCheck === "address"}
                                onChange={props.handleCheckBox}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                          <div className="custom-radio">
                            Shipping Address
                            <label
                              className="check_main remember_check"
                              htmlFor="sa1"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="sa1"
                                name="addressShippingCheck"
                                value="shipping"
                                checked={addressShippingCheck === "shipping"}
                                onChange={props.handleCheckBox}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                        </div>
                        {addressShippingCheck === "address" ? (
                          <React.Fragment>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="address"
                                  id="address"
                                  placeholder="Address"
                                  value={address}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="address">Address</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="address2"
                                  id="address2"
                                  placeholder="Address2"
                                  value={address2}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="address2">Address2</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="city"
                                  id="city"
                                  placeholder="City"
                                  value={city}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="city">City</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="state"
                                  id="state"
                                  placeholder="State"
                                  value={state}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="state">State</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="postcode"
                                  id="postcode"
                                  placeholder="Post Code"
                                  value={postcode}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="postcode">Post Code</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="country"
                                  id="contry"
                                  placeholder="Country"
                                  value={country}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="contry">Country</label>
                              </div>
                            </div>
                          </React.Fragment>
                        ) : addressShippingCheck === "shipping" ? (
                          <React.Fragment>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingAddress"
                                  id="shippingAddress"
                                  placeholder="Address"
                                  value={shippingAddress}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingAddress">Address</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingAddress2"
                                  id="shippingAddress2"
                                  placeholder="Address2"
                                  value={shippingAddress2}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingAddress2">Address2</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingCity"
                                  id="shippingCity"
                                  placeholder="City"
                                  value={shippingCity}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingCity">City</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingState"
                                  id="shippingState"
                                  placeholder="State"
                                  value={shippingState}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingState">State</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingPostcode"
                                  id="shippingPostcode"
                                  placeholder="Post Code"
                                  value={shippingPostcode}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingPostcode">Post Code</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="focus_input_field">
                                <input
                                  type="text"
                                  name="shippingCountry"
                                  id="shippingCountry"
                                  placeholder="Country"
                                  value={shippingCountry}
                                  onChange={props.handleChangeField}
                                />
                                <label htmlFor="shippingCountry">Country</label>
                              </div>
                            </div>
                          </React.Fragment>
                        ) : ""}{" "}
                      </div>

                      <div className="modal__company_popup__table">
                        <h2>Advanced</h2>
                        <table
                          className="table table-responsive"
                          id="companydetail-modal"
                          width="100%"
                        >
                          <thead className="thead_bg">
                            <tr>
                              <th scope="col">
                                <div className="custom-radio">
                                  <label
                                    className="check_main remember_check"
                                    htmlFor="sa"
                                  >
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="sa"
                                      name="example1"
                                    />
                                    <span className="click_checkmark global_checkmark"></span>
                                  </label>
                                </div>
                              </th>
                              <th scope="col">
                                <span className="user_setup_hed">Category</span>
                              </th>
                              <th scope="col">
                                <span className="user_setup_hed">
                                  Description
                                </span>
                              </th>
                              <th scope="col">
                                <span className="user_setup_hed">value</span>
                              </th>
                              <th scope="col">
                                <span className="user_setup_hed">hide</span>
                              </th>
                              <th className='table__inner--th'>
                                <div className="dropdown">
                                  <button
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                    id=""
                                    type="button"
                                    className="dropdown-toggle btn dept-tbl-menu"
                                    data-toggle="dropdown"
                                  >
                                    <span className="fa fa-bars "></span>
                                  </button>
                                  <div className="dropdown-menu dept-menu-list dropdown-menu-right">
                                    <div className="pr-0 dropdown-item">
                                      <div className="form-group remember_check mm_check4">
                                        <input
                                          type="checkbox"
                                          id="showHiddenRows"
                                          name="showHiddenRows"
                                          checked={showHiddenRows}
                                          onClick={props.handleShowHiddenRows}
                                        />
                                        <label
                                          htmlFor="showHiddenRows"
                                          className="mr-0"
                                        >
                                          Show Hidden Rows
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {" "}
                            {advancedList.map((list, i) => {
                              return (
                                <tr key={i}>
                                  <td>
                                    <div className="custom-radio">
                                      <label
                                        className="check_main remember_check"
                                        htmlFor="za"
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          id="za"
                                          name="example1"
                                          checked={false}
                                        />
                                        <span className="click_checkmark"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td className=" ">{list.category}</td>
                                  <td>{list.description}</td>

                                  {list.valueType === "List" ? (
                                    <td className="pt-0 pb-0 text-left">
                                      <Select
                                        classNamePrefix="custon_select-selector-inner"
                                        value={{
                                          label: list.value,
                                          value: list.value,
                                        }}
                                        options={list.valueOptions}
                                        onChange={(obj) =>
                                          props.handleValueOptions(
                                            "list",
                                            obj,
                                            list,
                                            i
                                          )
                                        }
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
                                    </td>
                                  ) : list.valueType === "Date" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <DatePicker
                                          selected={Number(list.value)}
                                          dateFormat="d MMM yyyy"
                                          autoComplete="off"
                                          onChange={(date) =>
                                            props.handleValueOptions(
                                              "date",
                                              date,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : list.valueType === "Check" ? (
                                    <td>
                                      <div className="col-auto p-0">
                                        <div className="form-group remember_check text-center pt-0 float-left">
                                          <input
                                            type="checkbox"
                                            id={`chk${i}`}
                                            checked={
                                              list.value === "Y" ||
                                                list.value === "1"
                                                ? true
                                                : false
                                            }
                                            onChange={(e) =>
                                              props.handleValueOptions(
                                                "checkbox",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                          <label htmlFor={`chk${i}`}></label>
                                        </div>
                                      </div>
                                    </td>
                                  ) : list.valueType === "Numeric" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <input
                                          type="number"
                                          value={list.value}
                                          onChange={(e) =>
                                            props.handleValueOptions(
                                              "number",
                                              e,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : list.valueType === "Text" ? (
                                    <td>
                                      <div className="table_input_field">
                                        <input
                                          type="text"
                                          value={list.value}
                                          onChange={(e) =>
                                            props.handleValueOptions(
                                              "text",
                                              e,
                                              list,
                                              i
                                            )
                                          }
                                        />
                                      </div>
                                    </td>
                                  ) : (
                                    <td>{list.value}</td>
                                  )}
                                  <td>
                                    <div className="custom-radio">
                                      <label
                                        className="check_main remember_check"
                                        htmlFor={`hideUnhideRows${i}`}
                                      >
                                        <input
                                          type="checkbox"
                                          className="custom-control-input"
                                          name={"hideUnhideRows"}
                                          id={`hideUnhideRows${i}`}
                                          checked={false}
                                          onChange={(e) =>
                                            props.handleHideUnhideRows(list)
                                          }
                                        />

                                        {/* <span className='click_checkmark'></span> */}
                                        <span
                                          className={
                                            list.hide
                                              ? "dash_checkmark bg_clr"
                                              : "dash_checkmark"
                                          }
                                        ></span>
                                      </label>
                                    </div>
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
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CompanyDetails;
