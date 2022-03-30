import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './InvoiceOcr.css'
import Select from "react-select";
import DatePicker from "react-datepicker";


export default function InvoiceOCR(props) {

  let {
    type,
    description,
    search,
    showHiddenRows,
    advancedList
  } = props.state;
  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={props.openInvoiceOCRModal}
        onHide={() => props.closeModal('openInvoiceOCRModal')}
        className='modal__InvoiceOcr mx-auto'
      >
        <Modal.Body>
          <div className='container-fluid p-0'>
            <div className='main_wrapper'>
              <div className='row d-flex h-100 p-0'>
                <div className='col-12 justify-content-center align-self-center'>
                  <div className='setting_form_main p-0'>
                    <div className='setting_header thead_bg'>
                      <h3 className='Indirecttaxcode-poup_heading'>
                        Invoice OCR
                        </h3>
                      <div className='Indirecttaxcode-poup_can-sav-btn'>
                        <button className='btn can-btn1' onClick={props.onSave}>
                          <img
                            src='images/user-setup/check-white.png'
                            alt='check'
                          />
                            Save
                          </button>
                        <button
                          onClick={() =>
                            props.closeModal('openInvoiceOCRModal')
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
                    <div className='invoice-ocr-poup_body user-setup-modal-inner'>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='description'
                          id='des'
                          placeholder='Description'
                          defaultValue={description}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='des'>Description</label>
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='type'
                          id='type'
                          placeholder='type'
                          defaultValue={type}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='type'>Type</label>
                      </div>
                      <div className='form-group mb-0 invoiceoccr_search'>
                        <label>Search</label>
                        <textarea name='search' defaultValue={search} onBlur={props.handleChangeField}></textarea>
                      </div>
                      <div className='invoice-ocr_popup__table'>
                        <h2>Advanced</h2>
                        <table
                          className='table table-responsive'
                          id='invoiceocr-modal'
                          width='100%'
                        >
                          <thead className='thead_bg'>
                            <tr>
                              <th scope='col'>
                                <div className='custom-radio'>
                                  <label
                                    className='check_main remember_check'
                                    htmlFor='sa'
                                  >
                                    <input
                                      type='checkbox'
                                      className='custom-control-input'
                                      id='sa'
                                      name='example1'
                                    />
                                    <span className='click_checkmark global_checkmark'></span>
                                  </label>
                                </div>
                              </th>
                              <th scope='col'>
                                <span className='user_setup_hed'>Category</span>
                              </th>
                              <th scope='col'>
                                <span className='user_setup_hed'>
                                  description
                                  </span>
                              </th>
                              <th scope='col'>
                                <span className='user_setup_hed'>value</span>
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
  )

}

