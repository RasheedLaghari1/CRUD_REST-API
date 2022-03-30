import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import './ChartOfAccounts.css'

export default function UserSetup(props) {
let {
  chartSort_CA,
  includeEFC,
  includeBudget,
  includeFringe,
  overwriteDescription,
  formErrors
} =props.state 

    return (
      <>
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={props.openChartOfAccountsModal}
          onHide={() =>props.closeModal('openChartOfAccountsModal')}
          className='modal__copy_accounts mx-auto'
        >
          <Modal.Body>
            <div className='container-fluid p-0'>
              <div className='main_wrapper'>
                <div className='row d-flex h-100 p-0'>
                  <div className='col-12 justify-content-center align-self-center'>
                    <div className='setting_form_main p-0'>
                      <div className='custom_line_type_header thead_bg'>
                        <h3 className='custom_line_type_poup_heading'>
                          Copy Chart Accounts
                        </h3>
                        <div className='departments-poup_can-sav-btn'>
                          <button className='btn can-btn1' onClick={props.copyAccount}>
                            <img
                              src='images/user-setup/check-white.png'
                              alt='check'
                            />
                            Save
                          </button>
                          <button
                            onClick={() =>
                              props.closeModal('openChartOfAccountsModal')
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
                      <div className='copy_accounts_poup_body user-setup-modal-inner'>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='chartSort_CA'
                            id='charts'
                            placeholder='Chart Sort'
                            defaultValue={chartSort_CA}
                            onBlur={props.handleChangeField}
                          />
                          <label htmlFor='charts'>Chart Sort</label>
                        </div>
                        <div className="text-danger error-12  user-required-field">
                        {formErrors.chartSort_CA !== "" ? formErrors.chartSort_CA : ""}
                      </div>
                        {/* <div className='focus_input_field'>
                          <input
                            type='text'
                            name='lookup'
                            id='1122'
                            placeholder='Lookup'
                          />
                          <label htmlFor='1122'>Lookup</label>
                        </div> */}
                        <div className='tracking_code_checks pt-2'>
                          <ul className='cus_line_check_ul'>
                            <li>
                              <div className='custom-radio'>
                                Include EFC:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='includeEFC'
                                >
                                  <input
                                    type='checkbox'
                                    id='includeEFC'
                                    name='includeEFC'
                                    className='custom-control-input'
                                    value={includeEFC}
                                    checked={includeEFC==="Y"}
                                    onChange={props.handleCheckBox}
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className='custom-radio'>
                                Include Budget:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='includeBudget'
                                >
                                  <input
                                    type='checkbox'
                                    id='includeBudget'
                                    name='includeBudget'
                                    className='custom-control-input'
                                    value={includeBudget}
                                    checked={includeBudget==="Y"}
                                    onChange={props.handleCheckBox}
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className='tracking_code_checks pt-2 mb-2'>
                          <ul className='cus_line_check_ul'>
                            <li>
                              <div className='custom-radio'>
                                Include Fringe:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='includeFringe'
                                >
                                  <input
                                    type='checkbox'
                                    id='includeFringe'
                                    name='includeFringe'
                                    className='custom-control-input'
                                    checked={includeFringe==="Y"}
                                    onChange={props.handleCheckBox}
                                    value={includeFringe}
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className='custom-radio'>
                                Over Write Description:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='overwriteDescription'
                                >
                                  <input
                                    type='checkbox'
                                    id='overwriteDescription'
                                    name='overwriteDescription'
                                    className='custom-control-input'
                                    value={overwriteDescription}
                                    checked={overwriteDescription==="Y"}
                                    onChange={props.handleCheckBox}
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
{/* 
                        <div className='copy_accounts_table'>
                          <h2 className='pt-4'>Advanced</h2>
                          <table className='table table-responsive'
                            width='100%'
                            id='chart-of-accounts-modal'
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
                                <th scope='col'>Category</th>
                                <th scope='col'>description</th>
                                <th scope='col'>value</th>
                                <th scope='col'>hide</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='za'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='za'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=' '>Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cgb'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cgb'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='xs'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='xs'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=' '>Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cgs'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cgs'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='xd'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='xd'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=' '>Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cgz'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cgz'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cx'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cx'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                                <td className=' '>Text</td>
                                <td>description</td>
                                <td> 123</td>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cgx'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cgx'
                                        name='example1'
                                      />
                                      <span className='click_checkmark'></span>
                                    </label>
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                       */}
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


