
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import Dropdown from "react-bootstrap/Dropdown";
import './IndirectTaxCodes.css'
import DatePicker from "react-datepicker";


import ChartSort from "../../../Modals/ChartSort/ChartSort";
import ChartCode from "../../../Modals/ChartCode/ChartCode";
import TrackingCode from "../../../Modals/TrackingCode/TrackingCode";


export default function TaxCodesModal(props) {

  let {
    openIndirectTaxCodesModal,
    code,
    description,
    rate,
    chartSort,
    chartCode,
    flags,
    advancedList,
    showHiddenRows,
    clonedChartCodesList,
    showSuggestion,
    trackingCodes,
    detailOfTrackingCode,
    openChartSortModal,
    openChartCodeModal,
    openTrackingCodeModal,
    addEditCodeCheck,
    formErrors
  } = props.state;
  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={openIndirectTaxCodesModal}
        onHide={() => props.closeModal('openIndirectTaxCodesModal')}
        className='modal__setting mx-auto'
      >
        <Modal.Body>
          <div className='container-fluid p-0'>
            <div className='main_wrapper'>
              <div className='row d-flex h-100 p-0'>
                <div className='col-12 justify-content-center align-self-center'>
                  <div className='setting_form_main p-0'>
                    <div className='setting_header thead_bg'>
                      <h3 className='Indirecttaxcode-poup_heading'>
                        Indirect tax codes
                        </h3>
                      <div className='departments-poup_can-sav-btn'>
                        <button onClick={props.addEditTaxCode} className='btn can-btn1'>

                          <img
                            src='images/user-setup/check-white.png'
                            alt='check'
                          />
                          Save
                        </button>
                        <button
                          onClick={() =>
                            props.closeModal('openIndirectTaxCodesModal')
                          }
                          className='btn can-btn1 pl-3'
                        >
                          <img
                            src='images/user-setup/cancel-white.png'
                            alt='cancel'
                          />
                          Cancel
                        </button>
                        <button className='btn can-btn1 pl-2'>
                          <img
                            src='images/user-setup/dots-h.png'
                            alt='dots'
                          />
                        </button>
                      </div>
                    </div>
                    <div className='departments-poup_body user-setup-modal-inner'>
                      <div className='focus_input_field'>

                        <input
                          type='text'
                          name='code'
                          id='code'
                          disabled={addEditCodeCheck === 'update'}
                          placeholder='chart sort'
                          value={code}
                          onChange={props.handleChangeField}
                        />
                        <label htmlFor='code'>Code</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.code !== ""
                          ? formErrors.code
                          : ""}
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='description'
                          id='description'
                          placeholder='chart sort'
                          value={description}
                          onChange={props.handleChangeField}
                        />
                        <label htmlFor='description'>Description</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.description !== ""
                          ? formErrors.description
                          : ""}
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='number'
                          name='rate'
                          id='rate'
                          placeholder='chart sort'
                          value={rate}
                          onChange={props.handleChangeField}
                        />
                        <label htmlFor='rate'>Rate</label>
                      </div>
                      <div className='focus_input_field'>
                        <span
                          onClick={() =>
                            props.openModal("openChartSortModal")
                          }
                          className='search_indirect2'>
                          <img
                            src='./images/user-setup/search-light.png'
                            alt='search'
                          />
                        </span>
                        <input
                          type='text'
                          name='chartSort'
                          id='chartSort'
                          placeholder='chart sort'
                          value={chartSort}
                          onChange={props.handleChangeField}
                        />
                        <label htmlFor='chartSort'>Chart Sort</label>
                      </div>
                      <div className='focus_input_field'>
                        <span
                          onClick={() =>
                            props.openModal("openChartCodeModal")
                          }
                          className='search_indirect2'>
                          <img
                            src='./images/user-setup/search-light.png'
                            alt='search'
                          />
                        </span>
                        <input
                          type='text'
                          name='chartCode'
                          id='chartCode'
                          placeholder='chart code'
                          value={chartCode}
                          onChange={props.handleChangeChartCode}
                          onBlur={props.onBlurChartCode}
                        />
                        <label htmlFor='chartCode'>Chart Code</label>

                        {
                          showSuggestion &&
                          <div
                            className='department-suggestion'
                          >
                            {clonedChartCodesList.length >
                              0 ? (
                              <ul className="invoice_vender_menu">
                                {clonedChartCodesList.map(
                                  (c, i) => {
                                    return (
                                      <li
                                        className="cursorPointer"
                                        key={i}
                                        onClick={() =>
                                          props.changeChartCode(c)
                                        }
                                      >
                                        <div className="vender_menu_right chart_new">
                                          <h3 className="chart_vender_text">
                                            <span> {c.code} </span>{" "}
                                            <span className="right_desc">
                                              {" "}
                                              {c.description}
                                            </span>
                                          </h3>
                                        </div>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            ) : (
                              <div className="sup_nt_fnd text-center">
                                <h6>No Chart Code Found</h6>
                              </div>
                            )}
                          </div>
                        }
                      </div>

                      <div className='form-group'>
                        <label>Tracking Codes</label>
                        <Select
                          value={{ label: 'Tracking Codes', value: '' }}
                          className="width-selector"
                          classNamePrefix="tracking_codes track_menu custon_select-selector-inner"
                          options={trackingCodes}
                          onChange={props.handleTrackingCode}
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

                      <div className='indirect_tax_code_table'>
                        <h2>Advanced</h2>
                        <table className='table table-responsive' id="IndirectTaxCodes-modal" width="100%">
                          <thead className="thead_bg hover-border">
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
                                <span className="user_setup_hed">
                                  Category
                                  </span>
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
                                    <div
                                      className="pr-0 dropdown-item"
                                    >
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
                                            props.handleHideUnhideRows(
                                              list
                                            )
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


      <ChartSort
        openChartSortModal={openChartSortModal}
        closeModal={props.closeModal}
        chartSorts={props.getChartSorts || ""} //api response (get chart sort)
        defaultChartSort={chartSort} //chart sort that is showing on this modal e.g 'AU.01.000'
        getUpdatedChartSort={props.getUpdatedChartSort} //get updated chart sort to show on this modal
      />
      <ChartCode
        openChartCodeModal={openChartCodeModal}
        closeModal={props.closeModal}
        chartCodes={props.chartCodes || []} //all chart codes
        getUpdatedChartCode={props.getUpdatedChartCode} //get updated chart code to show on this modal
        chartCode={chartCode} //value of chartCode (single value) that is shown in chart code input field
        props={props.props || ""}
        chartSort={chartSort}
      />

      <TrackingCode
        openTrackingCodeModal={openTrackingCodeModal}
        closeModal={props.closeModal}
        trackingCodes={detailOfTrackingCode}
        getUpdatedTrackingCode={props.getUpdatedTrackingCode} //get updated tracking code to show on this modal
      />
    </>
  )
}
