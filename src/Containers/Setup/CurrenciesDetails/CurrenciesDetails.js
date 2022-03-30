import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import './CurrenciesDetails.css'
import Settings from '../../Modals/SetupModals/Settings/Settings'
class CurrenciesDetails extends Component {
  constructor () {
    super()
    this.state = {
      filter_dropdpwn1: false,
      filter_dropdpwn2: false,
      openSettingsModal: false
    }
  }

  openModal = async name => {
    await this.setState({ [name]: true })
  }
  closeModal = name => {
    this.setState({ [name]: false })
  }

  render () {
    return (
      <>
        {this.state.isLoading ? <div className='se-pre-con'></div> : ''}

        <div className='user_setup_main'>
          <header>
          <div className='user_setup_heading'>
              <div className='header_menu'>
                <a href='#'>
                  <img
                    src='images/dash-logo.png'
                    className='img-fluid'
                    alt='logo'
                  />
                </a>
                <a href='#'>
                  <img src='images/top-menu.png' className='' alt='top-menu' />
                </a>
              </div>
              <h2>Currencies Details</h2>
              <span>
                <img
                  src='./images/user-setup/lock.png'
                  alt='lock'
                  className='img-fluid'
                />
              </span>
            </div>
          </header>
          <div className='col-sm-12 table_white_box'>
            <div className='currencies_detail'>
              <h2>Currencies Details</h2>
              <div className='currency_detail_save_del'>
                <button className='btn can-btn1'>
                  <img src='images/save-check.png' alt='check' />
                  Save
                </button>
                <button className='btn can-btn1 pl-3'>
                  <img src='images/cancel.png' alt='check' />
                  Cancel
                </button>
              </div>
            </div>
            <div className='currencies_details_form'>
              <div className='form-group'>
                <label>Currency Code</label>
                <input type='text' name='temp'></input>
              </div>
              <div className='form-group'>
                <label>Description</label>
                <input type='text' name='temp'></input>
              </div>
              <div className='form-group email_temp_type '>
                <label>Currency</label>
                <Select
                  className='width-selector currency_details_select'
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
              <div className='form-group email_temp_type '>
                <label>Country Code</label>
                <Select
                  className='width-selector currency_details_select'
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
                <div className='custom-radio'>
                  Base currency:
                  <label className='check_main remember_check' htmlFor='nb'>
                    <input
                      type='checkbox'
                      className='custom-control-input'
                      id='nb'
                      name='example1'
                    />
                    <span className='click_checkmark'></span>
                  </label>
                </div>
              </div>
              <div className='form-group'>
                <label>Rate</label>
                <div className='custom-radio float-right'>
                 Use Current Rate From Web:
                  <label className='check_main remember_check' htmlFor='bv'>
                    <input
                      type='checkbox'
                      className='custom-control-input'
                      id='bv'
                      name='example1'
                    />
                    <span className='click_checkmark'></span>
                  </label>
                </div>
                <input type='text' name='temp'></input>
              </div>
              <div className='form-group'>
                <label>Rate Date</label>
                <span className="cd_calander"><img src="images/calender-icon.png" alt="calnder"></img></span>
                <input type='text' name='temp'></input>
              </div>
              
            </div>
          </div>
        </div>
        <Settings
          openSettingsModal={this.state.openSettingsModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          columns={[]}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps, {})(CurrenciesDetails)
