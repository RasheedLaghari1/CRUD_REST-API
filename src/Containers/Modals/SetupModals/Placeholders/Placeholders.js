import React, { useState, useEffect } from 'react'
import './Placeholders.css'
import Modal from "react-bootstrap/Modal";
import _ from 'lodash'
import { toast } from 'react-toastify';

const Placeholder = (props) => {
  let [placeholders, setPlaceholders] = useState([]);
  let [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    if (props.openPlaceholderModal) {
      let placeholders = _.cloneDeep(props.placeholders);
      placeholders.map(p => p.checked = false)
      setPlaceholders(placeholders)
    }
  }, [props.openPlaceholderModal])

  const handleChangeField = (e, ind, obj) => {
    let { name, value } = e.target;
    obj[name] = value
    placeholders[ind] = obj
    setPlaceholders([...placeholders])
  }
  const handleCheckBoxes = async (e, item, index) => {
    let checked = e.target.checked

    if (item === "all") {
      if (checked) {
        placeholders.map((e, i) => {
          e.checked = true;
          return e;
        });
      } else {
        placeholders.map((e, i) => {
          e.checked = false;
          return e;
        });
      }
      setPlaceholders([...placeholders])
      setCheckAll(checked)
    } else {
      if (checked) {
        item.checked = checked;
        placeholders[index] = item;
        let _check = placeholders.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAll = true;
        }
        setPlaceholders([...placeholders])
        setCheckAll(checkAll)
      } else {
        item.checked = checked;
        placeholders[index] = item;
        setPlaceholders([...placeholders])
        setCheckAll(false)
      }
    }
  };
  const updatePlaceholders = async () => {
    await props.updatePlaceholders(placeholders)
    setPlaceholders([])
    props.closeModal(
      'openPlaceholderModal'
    )
  }
  const deletePlaceholders = () => {
    let ind = placeholders.findIndex(p => p.checked)
    if (ind >= 0) {
      placeholders = placeholders.filter(p => !p.checked)
      setPlaceholders(placeholders)
      setCheckAll(false)
    } else {
      toast.error('Please select item first!')
    }
  }
  return <>
    <Modal
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      show={props.openPlaceholderModal}
      onHide={() => {
        setPlaceholders([])
        setCheckAll(false)
        props.closeModal(
          'openPlaceholderModal'
        )
      }}
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
                      Placeholders
                    </h3>
                    <div className='departments-poup_can-sav-btn'>
                      <button onClick={updatePlaceholders} className='btn can-btn1'>
                        <img
                          src='images/user-setup/check-white.png'
                          alt='check'
                        />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setPlaceholders([])
                          setCheckAll(false)
                          props.closeModal(
                            'openPlaceholderModal'
                          )
                        }
                        }
                        className='btn can-btn1 pl-3'
                      >
                        <img
                          src='images/user-setup/cancel-white.png'
                          alt='cancel'
                        />
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className='custom_line_type_poup_body user-setup-modal-inner'>

                    <div className='user_setup_plus_Icons p-0'>
                      <ul className='custonline_icons_ul'>
                        <li>
                          <button
                            className='btn user_setup_rbtns'
                            type='button'
                            onClick={() => {
                              setPlaceholders([...placeholders, { prompt: '', tag: '', type: '', value: '' }])
                              setCheckAll(false)
                            }}
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
                            onClick={deletePlaceholders}
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
                    <div className='custom_line_type__table2 customline_table1'>
                      <table
                        width='100%'
                        className='table table-responsive'
                      >
                        <thead className='thead_bg'>
                          <tr>
                            <th scope='col'>
                              <div className='custom-radio'>
                                <label
                                  className='check_main remember_check'
                                  htmlFor='chkAll'
                                >
                                  <input
                                    type="checkbox"
                                    className='custom-control-input'
                                    name={"chkAll"}
                                    id={"chkAll"}
                                    checked={
                                      checkAll
                                    }
                                    onChange={(e) =>
                                      handleCheckBoxes(
                                        e,
                                        "all"
                                      )
                                    }
                                  />
                                  <span className='click_checkmark global_checkmark'></span>
                                </label>
                              </div>
                            </th>
                            <th scope='col'><span className='user_setup_hed'>Prompt</span></th>
                            <th scope='col'><span className='user_setup_hed'>Tag</span></th>
                            <th scope='col'><span className='user_setup_hed'>Type</span></th>
                            <th scope='col'><span className='user_setup_hed'>Value</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            placeholders.map((p, i) => {
                              return <tr key={i}>
                                <td>
                                  <div className='custom-radio'>
                                    <label
                                      className='check_main remember_check'
                                      htmlFor={"chk1" + i}
                                    >
                                      <input
                                        type="checkbox"
                                        className='custom-control-input'
                                        name={"chk"}
                                        id={"chk1" + i}
                                        checked={p.checked}
                                        onChange={(e) =>
                                          handleCheckBoxes(
                                            e,
                                            p,
                                            i
                                          )
                                        }
                                      />
                                      <span
                                        id={"chk1" + i}
                                        className="click_checkmark"
                                      ></span>
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <span className=''>
                                    <input
                                      className='values_custom border-0 ml-0'
                                      name="prompt"
                                      value={p.prompt}
                                      onChange={(e) => handleChangeField(e, i, p)}
                                    />
                                  </span>
                                </td>
                                <td>
                                  <span className=''>
                                    <input
                                      className='values_custom border-0 ml-0'
                                      name="tag"
                                      value={p.tag}
                                      onChange={(e) => handleChangeField(e, i, p)}
                                    />
                                  </span>
                                </td>
                                <td>
                                  <span className=''>
                                    <input
                                      className='values_custom border-0 ml-0'
                                      name="type"
                                      value={p.type}
                                      onChange={(e) => handleChangeField(e, i, p)}
                                    />
                                  </span>
                                </td>
                                <td>
                                  <span className=''>
                                    <input
                                      className='values_custom border-0 ml-0'
                                      name="value"
                                      value={p.value}
                                      onChange={(e) => handleChangeField(e, i, p)}
                                    />
                                  </span>
                                </td>
                              </tr>
                            })
                          }
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
}

export default Placeholder
