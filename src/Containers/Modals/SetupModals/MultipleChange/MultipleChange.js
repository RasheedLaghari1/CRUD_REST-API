import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import "./MultipleChange.css";
export default function MultipleChange(props) {
  let
  {
    mc_level,
    mc_level_flag,
    mc_type,
    mc_type_flag,
    mc_post,
    mc_post_flag,
    mc_active,
    mc_active_flag,
    mc_seclevel,
    mc_seclevel_flag,
    mc_fringe,
    mc_fringe_flag,
    mc_desc,
    mc_desc_flag

  }=props.state;
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openMultipleChangeModal}
        onHide={() => props.closeModal("openMultipleChangeModal")}
        className="modal__multiple_change mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="multiple_change_form_main p-0">
                    <div className="multiple_change_header thead_bg">
                      <h3 className="multiple_change-poup_heading">
                        Multiple Change
                      </h3>
                      <div className="multiple_change-poup_can-sav-btn">
                        <button className="btn can-btn1" onClick={props.onMultipleChange}>
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={() =>
                            props.closeModal("openMultipleChangeModal")
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
                    <div className="multiple_change-poup_body user-setup-modal-inner">
                      <div className="form-group mb-0">
                        <label>Description</label>
                        <div className="custom-radio multichange_selct_check">
                          <label
                            className="check_main remember_check"
                            htmlFor="mc_desc_flag"
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="mc_desc_flag"
                              name="mc_desc_flag"
                              value={mc_desc_flag}
                              checked={mc_desc_flag==="Y"}
                              onChange={props.handleCheckBox}
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="multi_chnage_selct_div">
                          <Select
                            className="width-selector"
                            classNamePrefix="react-select"
                            options={[
                              { label: "Upper Case", value: "UpperCase" },
                              { label: "Lower Case", value: "LowerCase" },
                            ]}
                            value={mc_desc}
                            onChange={(event)=>props.handleDropDown(event,"mc_desc")}
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
                      </div>
                      <div className="form-group mb-0">
                        <div className="">
                          <label>Level</label>
                          <div className="custom-radio multichange_selct_check">
                            <label
                              className="check_main remember_check"
                              htmlFor="mc_level_flag"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="mc_level_flag"
                                name="mc_level_flag"
                                value={mc_level_flag}
                                checked={mc_level_flag==="Y"}
                                onChange={props.handleCheckBox}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                          <div className="multi_chnage_selct_div">
                            <span className="mc_number-wrapper">
                              <input type="number" name="mc_level" defaultValue={mc_level} onBlur={props.handleChangeField} />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group mb-0 w-100 float-left">
                        <label>Type</label>
                        <div className="custom-radio multichange_selct_check">
                          <label
                            className="check_main remember_check"
                            htmlFor="mc_type_flag"
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="mc_type_flag"
                              name="mc_type_flag"
                              value={mc_type_flag}
                              checked={mc_type_flag==="Y"}
                              onChange={props.handleCheckBox}
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="multi_chnage_selct_div">
                          {/* <span className="mc_number-wrapper"> */}
                          <input
                            type="text"
                            name="mc_type"
                            maxLength={"2"}
                            defaultValue={mc_type}
                            onBlur={props.handleChangeField}
                          />
                          {/* </span> */}
                        </div>
                      </div>
                      <div className="form-group mb-0">
                        <label>Post</label>
                        <div className="custom-radio multichange_selct_check">
                          <label
                            className="check_main remember_check"
                            htmlFor="mc_post_flag"
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="mc_post_flag"
                              name="mc_post_flag"
                              value={mc_post_flag}
                              checked={mc_post_flag==="Y"}
                              onChange={props.handleCheckBox}
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="multi_chnage_selct_div">
                          <Select
                            className="width-selector multiple_change_select"
                            classNamePrefix="custon_select-selector-inner"
                            options={[
                              { label: "Y", value: "Y" },
                              { label: "N", value: "N" },
                            ]}
                            value={mc_post}
                            onChange={(event)=>props.handleDropDown(event,"mc_post")}
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
                      </div>
                      <div className="form-group mb-0">
                        <label>Active</label>
                        <div className="custom-radio multichange_selct_check">
                          <label
                            className="check_main remember_check"
                            htmlFor="mc_active_flag"
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="mc_active_flag"
                              name="mc_active_flag"
                              value={mc_active_flag}
                              checked={mc_active_flag==="Y"}
                              onChange={props.handleCheckBox}
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="multi_chnage_selct_div">
                          <Select
                            className="width-selector multiple_change_select"
                            classNamePrefix="custon_select-selector-inner"
                            options={[
                              { label: "Y", value: "Y" },
                              { label: "N", value: "N" },
                            ]}
                            value={mc_active}
                            onChange={(event)=>props.handleDropDown(event,"mc_active")}
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
                        {/* <span className='search_indirect'>
                            <img
                              src='./images/user-setup/search-light.png'
                              alt='search'
                            ></img>
                          </span> */}
                      </div>
                      <div className="form-group mb-0">
                        <div className="">
                          <label>Security Level</label>
                          <div className="custom-radio multichange_selct_check">
                            <label
                              className="check_main remember_check"
                              htmlFor="mc_seclevel_flag"
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="mc_seclevel_flag"
                                name="mc_seclevel_flag"
                                value={mc_seclevel_flag}
                                checked={mc_seclevel_flag==="Y"}
                                onChange={props.handleCheckBox}
                              />
                              <span className="click_checkmark"></span>
                            </label>
                          </div>
                          <div className="multi_chnage_selct_div">
                            <span className="mc_number-wrapper">
                              <input type="number" name="mc_seclevel" min="1" defaultValue={mc_seclevel} onBlur={props.handleChangeField} />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group  mb-0 w-100 float-left">
                        <label>Fringe</label>
                        <div className="custom-radio multichange_selct_check">
                          <label
                            className="check_main remember_check"
                            htmlFor="mc_fringe_flag"
                          >
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="mc_fringe_flag"
                              name="mc_fringe_flag"
                              value={mc_fringe_flag}
                              checked={mc_fringe_flag==="Y"}
                              onChange={props.handleCheckBox}
                            />
                            <span className="click_checkmark"></span>
                          </label>
                        </div>
                        <div className="multi_chnage_selct_div">
                          <input
                            type="number"
                            name="mc_fringe"
                            defaultValue={mc_fringe}
                            onBlur={props.handleChangeField}
                            placeholder="0.00"
                          ></input>
                        </div>
                      </div>
                      {/* 
                        <div className='indirect_tax_code_table'>
                          <h2 className="pt-3">Advanced</h2>
                          <table className='table table-responsive'
                            id="multiple-chnage-modal"
                            width="100%"
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
  );
}
