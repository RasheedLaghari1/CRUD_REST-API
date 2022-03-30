import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './CustomLineType.css'
import Select from 'react-select'
import DatePicker from "react-datepicker";


export default function CustomeLineType(props) {
  let {
    lineType,
    description,
    fields,
    state,
    openCustomLineTypeModal,
    showHiddenRows,
    advancedList,
  } = props.state;
  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={openCustomLineTypeModal}
        onHide={() => props.closeModal('openCustomLineTypeModal')}
        className='modal__custom_line_type mx-auto'
      >
        <Modal.Body>
          <div className='container-fluid p-0'>
            <div className='main_wrapper'>
              <div className='row d-flex h-100 p-0'>
                <div className='col-12 justify-content-center align-self-center'>
                  <div className='setting_form_main p-0'>
                    <div className='custom_line_type_header thead_bg'>
                      <h3 className='custom_line_type_poup_heading'>
                        Custom Line Type
                        </h3>
                      <div className='departments-poup_can-sav-btn'>
                        <button onClick={props.addEditCustomLineType} className='btn can-btn1'>
                          <img
                            src='images/user-setup/check-white.png'
                            alt='check'
                          />
                            Save
                          </button>
                        <button
                          onClick={() =>
                            props.closeModal(
                              'openCustomLineTypeModal'
                            )
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
                    <div className='custom_line_type_poup_body user-setup-modal-inner'>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='lineType'
                          id='lineType'
                          defaultValue={lineType}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='lineType'>Line Type</label>
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='description'
                          id='description'
                          defaultValue={description}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='description'>Description</label>
                      </div>
                      <div className='user_setup_plus_Icons p-0'>
                        <ul className='custonline_icons_ul'>
                          <li>
                            <button
                              className='btn user_setup_rbtns'
                              type='button'
                              onClick={props.addField}
                            >
                              <span
                                className='round_plus'
                              >
                                <i
                                  className='fa fa-plus-circle'
                                  aria-hidden='true'
                                ></i>
                              </span>
                            </button>
                          </li>
                          <li>
                            <button
                              className='btn user_setup_rbtns'
                              type='button'
                              onClick={props.deleteField}
                            >
                              <span className='round_file'>
                                {' '}
                                <img
                                  src='./images/user-setup/delete.png'
                                  alt='filter'
                                ></img>
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="custom_line_type__table2 customline_table1 cl-type-tbl1">
                        <table
                          id='custome-line-type-1'
                          width='100%'
                          className='table table-responsive'
                        >
                          <thead className="thead_bg hover-border">
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
                                {' '}
                                <span className='user_setup_hed'>Field</span>
                              </th>
                              <th scope='col'>
                                {' '}
                                <span className='user_setup_hed'>
                                  Default Value
                                  </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              fields.map((f, i) => {
                                return <tr>
                                  <td class="w-25">
                                    <div className='custom-radio'>
                                      <label
                                        className='check_main remember_check'
                                        htmlFor={'fld' + i}
                                      >
                                        <input
                                          type='checkbox'
                                          className='custom-control-input'
                                          id={'fld' + i}
                                          name='fldCheck'
                                          checked={f.checked}
                                          onChange={(e) => props.handleFieldCheckbox(e, i)}
                                        />
                                        <span className='click_checkmark'></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td className=' '>
                                    <span className=''>
                                      <input
                                        className='values_custom border-0'
                                        name={'field'}
                                        value={f.field}
                                        onChange={(e) => props.handleFields(e, i)}
                                      />
                                    </span>
                                  </td>
                                  <td> <span className=''>
                                    <input
                                      className='values_custom border-0'
                                      name={'defaultValue'}
                                      value={f.defaultValue}
                                      onChange={(e) => props.handleFields(e, i)}
                                    />
                                  </span></td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                      <div className='tracking_code_checks'>
                        <ul className='cus_line_check_ul'>
                          {['Required', 'Read Only', 'Hide'].map((v, i) => {
                            return <li>
                              <div className='custom-radio'>
                                {v}:
                                <label
                                  className='check_main remember_check'
                                  htmlFor={v + i}
                                >
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id={v + i}
                                    name={'state'}
                                    value={v}
                                    checked={v.toLowerCase() === state}
                                    onChange={(event) =>
                                      props.handleRadio(event)
                                    }
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                          })}
                        </ul>
                      </div>
                      <div className='custom_line_type__table2'>
                        <h2 className=''>Advanced</h2>
                        <table
                          className='table table-responsive'
                          id='custome-line-type-advncd'
                          width='100%'
                        >
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
    </>
  )

}

