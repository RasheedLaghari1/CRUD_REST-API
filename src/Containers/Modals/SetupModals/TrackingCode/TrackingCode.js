import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './TrackingCode.css'
import Dropdown from 'react-bootstrap/Dropdown'
import Select from 'react-select'


export default function TrackingCodes(props) {

  let {
    trackingType,
    description,
    length,
    prompt,
    sequence,
    status,
    taxCode,
    trackingOptions,
    showHiddenRows,
    formErrors,
    typeOptions,
    checkAllOptions,
    openTrackingCodeModal
  } = props.state;

  taxCode = taxCode.toString().toLowerCase();
  status = status.toString().toLowerCase();
  return (
    <>
      <Modal
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        show={openTrackingCodeModal}
        onHide={() => props.closeModal('openTrackingCodeModal')}
        className='modal__tracking_code mx-auto'
      >
        <Modal.Body>
          <div className='container-fluid p-0'>
            <div className='main_wrapper'>
              <div className='row d-flex h-100 p-0'>
                <div className='col-12 justify-content-center align-self-center'>
                  <div className='setting_form_main p-0'>
                    <div className='setting_header thead_bg'>
                      <h3 className='Indirecttaxcode-poup_heading'>
                        tracking code
                        </h3>
                      <div className='Indirecttaxcode-poup_can-sav-btn'>
                        <button onClick={props.updateTrackingCode} className='btn can-btn1'>
                          <img
                            src='images/user-setup/check-white.png'
                            alt='check'
                          />
                            Save
                          </button>
                        <button
                          onClick={() =>
                            props.closeModal('openTrackingCodeModal')
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
                    <div className='user_setup-poup_body user-setup-modal-inner'>
                      <div className='form-group'>
                        <label>Tracking Types</label>
                        <Select
                          className='width-selector tracking_code_popup_select'
                          classNamePrefix='custon_select-selector-inner'
                          value={trackingType}
                          options={typeOptions}
                          onChange={props.handleChangeType}
                          theme={theme => ({
                            ...theme,
                            border: 0,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: '#f2f2f2',
                              primary: '#f2f2f2'
                            }
                          })}
                        />
                        <div className="text-danger error-12  user-required-field">
                          {formErrors.trackingType !== ""
                            ? formErrors.trackingType
                            : ""}
                        </div>
                      </div>

                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='description'
                          id='desc7'
                          placeholder='Description'
                          defaultValue={description}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='desc7'>Description</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.description !== ""
                          ? formErrors.description
                          : ""}
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='number'
                          name='sequence'
                          id='sequ'
                          placeholder='Sequence'
                          defaultValue={sequence}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='sequ'>Sequence</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.sequence !== ""
                          ? formErrors.sequence
                          : ""}
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='text'
                          name='prompt'
                          id='promp'
                          placeholder='Prompt'
                          defaultValue={prompt}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='promp'>Prompt</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.prompt !== ""
                          ? formErrors.prompt
                          : ""}
                      </div>
                      <div className='focus_input_field'>
                        <input
                          type='number'
                          name='length'
                          id='length'
                          placeholder='Length'
                          defaultValue={length}
                          onBlur={props.handleChangeField}
                        />
                        <label htmlFor='length'>Length</label>
                      </div>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.length !== ""
                          ? formErrors.length
                          : ""}
                      </div>
                      <div className='tracking_code_checks mb-1'>
                        <ul>
                          {
                            ['Required', 'Read-Only', 'Hide'].map(((c, i) => {
                              return <li>
                                <div className='custom-radio'>
                                  {c}:
                                    <label
                                    className='check_main remember_check'
                                    htmlFor={c}
                                  >
                                    <input
                                      type='radio'
                                      id={c}
                                      name='status'
                                      value={c}
                                      checked={status === c.toLowerCase()}
                                      className='custom-control-input'
                                      onChange={props.handleChecks}
                                    />
                                    <span className='click_checkmark'></span>
                                  </label>
                                </div>
                              </li>
                            }))
                          }
                        </ul>
                        <div className='custom-radio track_code_admin_check pt-3'>
                          Use Tax Codes:
                            <label className='check_main remember_check' htmlFor='taxCode'>
                            <input
                              type='checkbox'
                              id='taxCode'
                              name='taxCode'
                              checked={taxCode === 'y'}
                              onChange={props.handleChecks}
                              className='custom-control-input'
                            />
                            <span className='click_checkmark'></span>
                          </label>
                        </div>
                      </div>
                      {
                        taxCode != 'y' &&

                        <div className='tracking_code_popup__table'>
                          <h2>Values</h2>
                          <div className='user_setup_plus_Icons p-0'>
                            <ul>
                              <li>
                                <button
                                  className='btn user_setup_rbtns'
                                  type='button'
                                  onClick={props.primeTrackingOption}
                                >
                                  <span className='round_plus'>
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
                                  onClick={props.deleteTrackingOption}
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
                          <table
                            className='table table-responsive'
                            id='trackingCode-modal'
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
                                        type="checkbox"
                                        className='custom-control-input'
                                        name={"checkAllOptions"}
                                        id='sa'
                                        checked={
                                          checkAllOptions
                                        }
                                        onChange={(e) =>
                                          props.handleOptionsCheckboxes(
                                            e,
                                            "all"
                                          )
                                        }
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
                                    Description
                                  </span>
                                </th>
                                <th scope='col'>
                                  <span className='user_setup_hed'>Value</span>
                                </th>
                                <th scope='col'>
                                  <span className='user_setup_hed'>Hide</span>
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
                              {
                                trackingOptions.map((op, ind) => {
                                  return <tr>
                                    <td>
                                      <div className='custom-radio'>
                                        <label
                                          className='check_main remember_check'
                                          htmlFor={'valOp' + ind}
                                        >
                                          <input
                                            type='checkbox'
                                            className='custom-control-input'
                                            id={'valOp' + ind}
                                            checked={op.checked || false}
                                            onChange={(e) => props.handleOptionsCheckboxes(e, op, ind)}

                                          />
                                          <span className='click_checkmark'></span>
                                        </label>
                                      </div>
                                    </td>
                                    <td data-sort={op.category} data-search={op.category}>
                                      <input
                                        className='values_custom border-0'
                                        value={op.category}
                                        name='category'
                                        onChange={(e) => props.handleTrackingValues(e, op)}
                                      />
                                    </td>
                                    <td data-sort={op.description} data-search={op.description}>
                                      <input
                                        className='values_custom border-0'
                                        value={op.description}
                                        name='description'
                                        onChange={(e) => props.handleTrackingValues(e, op)}
                                      />
                                    </td>
                                    <td data-sort={op.value} data-search={op.value}>
                                      <input
                                        className='values_custom border-0'
                                        value={op.value}
                                        name='value'
                                        onChange={(e) => props.handleTrackingValues(e, op)}
                                      />
                                    </td>

                                    <td>
                                      <div className="custom-radio">
                                        <label
                                          className="check_main remember_check"
                                          htmlFor={`hideUnhideRows${ind}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name={"hideUnhideRows"}
                                            id={`hideUnhideRows${ind}`}
                                            checked={false}
                                            onChange={(e) =>
                                              props.handleHideUnhideRows(
                                                op
                                              )
                                            }
                                          />

                                          {/* <span className='click_checkmark'></span> */}
                                          <span
                                            className={
                                              op.hide
                                                ? "dash_checkmark bg_clr"
                                                : "dash_checkmark"
                                            }
                                          ></span>
                                        </label>
                                      </div>
                                    </td>
                                    <td></td>
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      }
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


