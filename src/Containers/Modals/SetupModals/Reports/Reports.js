import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import './Reports.css'
import Dropdown from 'react-bootstrap/Dropdown'
import Select from 'react-select'

class CustomFields extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <>
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={this.props.openReportsModal}
          onHide={() => this.props.closeModal('openReportsModal')}
          className='modal__reports mx-auto'
        >
          <Modal.Body>
            <div className='container-fluid p-0'>
              <div className='main_wrapper'>
                <div className='row d-flex h-100 p-0'>
                  <div className='col-12 justify-content-center align-self-center'>
                    <div className='setting_form_main p-0'>
                      <div className='setting_header thead_bg'>
                        <h3 className='Indirecttaxcode-poup_heading'>
                          Reports
                        </h3>
                        <div className='Indirecttaxcode-poup_can-sav-btn'>
                          <button className='btn can-btn1'>
                            <img
                              src='images/user-setup/check-white.png'
                              alt='check'
                            />
                            Save
                          </button>
                          <button
                            onClick={() =>
                              this.props.closeModal('openReportsModal')
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
                      <div className='reports-poup_body user-setup-modal-inner'>
                        <div className='user_setup_plus_Icons p-0 w-100'>
                          <ul className='reports_icons_ul'>
                            <li>
                              <button
                                className='btn user_setup_rbtns'
                                type='button'
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
                        <div className='form-group mb-0'>
                          <label>Layout</label>
                          <Select
                            className='width-selector custom_fields_popup_select'
                            classNamePrefix='custon_select-selector-inner'
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
                        </div>
                        <div className='form-group'>
                          <div className='custom-radio '>
                            <label className='check_main remember_check' htmlFor='df12'>
                              <input
                                type='checkbox'
                                id='df12'
                                name='edit'
                                className='custom-control-input'
                              />
                              <span className='click_checkmark'></span>
                              Edit Reports Layout
                            </label>
                          </div>
                        </div>
                        <div className='reports_popup__table'>
                          <h2>Advanced</h2>
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

export default CustomFields
