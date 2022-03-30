import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './CopyAccounts.css'

class UserSetup extends Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    return (
      <>
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={this.props.openCopyAccountsModal}
          onHide={() => this.props.closeModal('openCopyAccountsModal')}
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
                          Copy Accounts
                        </h3>
                        <div className='departments-poup_can-sav-btn'>
                          <button className='btn can-btn1'>
                            <img
                              src='images/user-setup/check-white.png'
                              alt='check'
                            />
                            Save
                          </button>
                          <button
                            onClick={() =>
                              this.props.closeModal('openCopyAccountsModal')
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
                            name='chartsort'
                            id='charts'
                            placeholder='Chart Sort'
                          />
                          <label htmlFor='charts'>Chart Sort</label>
                        </div>
                        <div className='tracking_code_checks pt-2'>
                          <ul className='cus_line_check_ul'>
                            <li>
                              <div className='custom-radio'>
                                Include EFC:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='std12'
                                >
                                  <input
                                    type='checkbox'
                                    id='std12'
                                    name='example1'
                                    className='custom-control-input'
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
                                  htmlFor='az2'
                                >
                                  <input
                                    type='checkbox'
                                    id='az2'
                                    name='example1'
                                    className='custom-control-input'
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className='tracking_code_checks pt-2'>
                          <ul className='cus_line_check_ul'>
                            <li>
                              <div className='custom-radio'>
                                Include Fringe:
                                <label
                                  className='check_main remember_check'
                                  htmlFor='std122'
                                >
                                  <input
                                    type='checkbox'
                                    id='std122'
                                    name='example1'
                                    className='custom-control-input'
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
                                  htmlFor='az22'
                                >
                                  <input
                                    type='checkbox'
                                    id='az22'
                                    name='example1'
                                    className='custom-control-input'
                                  />
                                  <span className='click_checkmark'></span>
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className='copy_accounts_table'>
                          <h2 className='pt-3'>Advanced</h2>
                          <table className='table table-responsive'>
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
                              <tr>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor='cd'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cd'
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
                                      htmlFor='ca'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='ca'
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
                                      htmlFor='cf'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cf'
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
                                      htmlFor='cge'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cge'
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
                                      htmlFor='df'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='df'
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
                                      htmlFor='cgd'
                                    >
                                      <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='cgd'
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
}

export default UserSetup
