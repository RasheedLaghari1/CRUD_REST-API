import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import './CustomLineTypeFirst.css'
import Dropdown from 'react-bootstrap/Dropdown'

import CustomLineTypeModalSecond from '../CustomLineTypeSecond/CustomLineTypeSecond'

class CustomeLineType extends Component {
  constructor() {
    super()
    this.state = {
      openCustomLineTypeModalSecond: false
    }
  }
  openModal = async name => {
    await this.setState({ [name]: true })
  }
  closeModal = name => {
    this.setState({ [name]: false })
  }

  render() {
    return (
      <>
        <Modal
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
          show={true}
          onHide={() => this.props.closeModal('openCustomLineTypeFirst')}
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
                          Custom Line Type 1
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
                              this.props.closeModal('openCustomLineTypeFirst')
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
                      <div className='custom_line_type_poup_body'>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='typename'
                            id='typen'
                            placeholder='Inventry'
                          />
                          <label htmlFor='typen'>Type Name</label>
                        </div>
                        <div className='form-group text-right mb-0'>
                          <label className='mb-0'>
                            <img
                              onClick={() =>
                                this.openModal('openCustomLineTypeModalSecond')
                              }
                              src='./images/user-setup/dots-w.png'
                              alt='jhg'
                            ></img>
                          </label>
                        </div>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='Quantity'
                            id='quantity'
                            placeholder='Quantity'
                          />
                          <label htmlFor='quantity'>Quantity</label>
                        </div>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='per'
                            id='par'
                            placeholder='Per'
                          />
                          <label htmlFor='par'>Per</label>
                        </div>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='desc'
                            id='desc4'
                            placeholder='Description'
                          />
                          <label htmlFor='desc4'>Description</label>
                        </div>
                        <div className='focus_input_field'>
                          <input
                            type='text'
                            name='sku'
                            id='sku'
                            placeholder='SKU'
                          />
                          <label htmlFor='sku'>SKU</label>
                        </div>
                        <div className='row customline_bottom_input'>
                          <div className='col-md-3'>
                            <div className='focus_input_field mb-0'>
                              <input
                                type='text'
                                name='Category'
                                id='cat3'
                                placeholder='Category'
                              />
                              <label htmlFor='cat3'>Category</label>
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <div className='focus_input_field mb-0'>
                              <input
                                type='text'
                                name='Description'
                                id='desc5'
                                placeholder='Description'
                              />
                              <label htmlFor='desc5'>Description</label>
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <div className='focus_input_field mb-0'>
                              <input
                                type='text'
                                name='Value'
                                id='valu3'
                                placeholder='Value'
                              />
                              <label htmlFor='valu3'>Value</label>
                            </div>
                          </div>
                          <div className='col-md-3'>
                            <div className='custom-radio'>
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
                                Hide
                                <span className='click_checkmark'></span>
                              </label>
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

        <CustomLineTypeModalSecond
          openCustomLineTypeModalSecond={
            this.state.openCustomLineTypeModalSecond
          }
          openModal={this.openModal}
          closeModal={this.closeModal}
        />
      </>
    )
  }
}

export default CustomeLineType
