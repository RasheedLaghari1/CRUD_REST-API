import React, { Component, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";

const Departments = (props) => {
  const [state, setState] = useState({
    depSearch: "", //search Department
    toggleDepartment: false,
    sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
    showSelected: false,
  });

  //when type in search box
  const depSearchHandler = (e) => {
    let text = e.target.value;
    if (!text) {
      setState((prev) => ({
        ...prev,
        depSearch: text,
      }));
      props.onSearch();
    } else {
      setState((prev) => ({
        ...prev,
        depSearch: text,
      }));
    }
  };
  //when clicks on search button
  const onSearch = () => {
    let text = state.depSearch.trim();
    props.onSearch(text);
  };
  const onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = state.depSearch.trim();
      props.onSearch(text);
    }
  };
  //when click on departments to sort data accordingly
  const sortDepartments = async () => {
    let { toggleDepartment } = state;
    props.sortDepartments(!toggleDepartment);

    setState((prev) => ({
      ...prev,
      sortCheck: !prev.sortCheck,
      toggleDepartment: !prev.toggleDepartment,
    }));
  };
  const handleShowSelected = (e) => {
    let checked = e.target.checked;
    if (checked) {
      props.handleShowSelected(checked);
    } else {
      props.handleShowSelected(checked);
    }
    setState((prev) => ({
      ...prev,
      showSelected: checked,
    }));
  };
  const handleCheckbox = (e, d) => {
    props.handleCheckbox(e.target.checked, d);
    props.closeModal("openDepartmentModal");
    clearStates();
  };
  const clearStates = () => {
    props.closeModal("openDepartmentModal");
    setState((prev) => ({
      ...prev,
      depSearch: "",
      showSelected: false,
      toggleDepartment: false,
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
    }));
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openDepartmentModal}
        onHide={clearStates}
        className="forgot_email_modal modal_555 mx-auto"
      >
        <Modal.Body className="chart_code_custome-height">
          <div className="container-fluid ">
            <div className="main_wrapper p-10">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header">
                      <div className="modal-top-header">
                        <div className="row bord-btm">
                          <div className="col-auto pl-0">
                            <h6 className="text-left def-blue">Departments</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() => {
                                props.closeModal("openDepartmentModal");
                              }}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row">
                        <div className="col-12 pl-md-0">
                          <div className="table_search p-md-0">
                            <div className="row">
                              <div className="col input-group">
                                <div className="input-group-prepend mm_append">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <img
                                      src="images/search-black.png"
                                      className="mx-auto"
                                      alt="search-icon"
                                    />
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search"
                                  aria-label="What are you looking for"
                                  aria-describedby="basic-addon1"
                                  name="depSearch"
                                  id="depSearchId"
                                  value={state.depSearch}
                                  onChange={depSearchHandler}
                                  onKeyDown={onEnter}
                                />
                              </div>
                              <div className="col-auto p-md-0 align-self-center">
                                <button
                                  onClick={onSearch}
                                  className="search_btn search_btn_sass"
                                >
                                  Search
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 mt-md-3 mb-1 p-md-0">
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col">
                                  <div className="form-group remember_check form-group_sass remember_check_sass  mm_check3 mm_checkCc2">
                                    <input
                                      type="checkbox"
                                      id="remember-chart-c"
                                      checked={state.showSelected}
                                      name="checkbox"
                                      onChange={handleShowSelected}
                                    />
                                    <label htmlFor="remember-chart-c"></label>
                                    <p className="pt-1 mm_font">
                                      Show Selected:
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 p-md-0">
                          <div className="login_form">
                            <div className="login_table_list login_table_list_sass">
                              <table className="table table-hover project_table chart_code">
                                <thead>
                                  <tr>
                                    <th scope="col">
                                      <div className="col align-self-center">
                                        <div
                                          onClick={sortDepartments}
                                          className="cursorPointer form-group remember_check form-group_sass remember_check_sass  mm_ffamily"
                                        >
                                          Department{" "}
                                          <i
                                            className={
                                              state.sortCheck
                                                ? "fa fa-angle-down sideBarAccord rorate_0"
                                                : "fa fa-angle-down sideBarAccord"
                                            }
                                          ></i>
                                        </div>
                                      </div>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {props.clndDepartmentOptions.map((d, i) => {
                                    return (
                                      <tr key={i}>
                                        <th scope="row">
                                          <div className="col align-self-center">
                                            <div className="form-group remember_check mm_check3 mm_checkCc">
                                              <input
                                                type="checkbox"
                                                id={"dep" + i}
                                                checked={
                                                  d.checked ? true : false
                                                }
                                                name="checkbox"
                                                onChange={(e) =>
                                                  handleCheckbox(e, d)
                                                }
                                              />
                                              <label htmlFor={"dep" + i}>
                                                {" "}
                                              </label>
                                              <span>{d.name}</span>
                                            </div>
                                          </div>
                                        </th>
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
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Departments;
