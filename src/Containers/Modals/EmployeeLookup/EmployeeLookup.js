import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import TableTest from "./employeeTabel";

const EmployeeLookup = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    isLoading: false,
    clonedEmployeeList: [], //a copy of employeeList
    employeeSearchKeyword: "", //search employee
    toggleEmployeeFirstName: false,
    sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
    toggleEmployeeLastName: false,
    toggleEmployeeDepartment: false,
    toggleEmployeePosition: false,

    showSelected: false,
    selectedChartCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal, refreshEmployees } = props;

  useEffect(() => {
    let newArary;
    if (props.employeeList !== undefined) {
      newArary = props.employeeList.map((item) => {
        if (item.employeeCode === props.employeeCode) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      });
    } else {
      newArary = [];
    }

    setState((prev) => ({
      ...prev,
      clonedEmployeeList: newArary,
      employeeList: newArary,
    }));
  }, [props]);

  const employeeSearchHandler = (e) => {
    let text = e.target.value;
    if (!text) {
      setState((prev) => ({
        ...prev,
        employeeSearchKeyword: text,
        clonedEmployeeList: state.employeeList || [],
      }));
    } else {
      setState((prev) => ({
        ...prev,
        employeeSearchKeyword: text,
      }));
    }
  };

  const onEnter = async (e) => {
    // if (e.key === "Enter" || e.key === "Tab") {
    //   let text = this.state.employeeSearchKeyword.trim();
    //   if (text) {
    //     let employeeSearchedData = [];
    //     employeeSearchedData = this.state.employeeList.filter((c) => {
    //       return (
    //         c.code.toString().toUpperCase().includes(text.toUpperCase()) ||
    //         c.firstName.toUpperCase().includes(text.toUpperCase())
    //       );
    //     });
    //     this.setState({ clonedEmployeeList: employeeSearchedData });
    //   }
    // }
  };

  const onSearch = () => {
    let text = state.employeeSearchKeyword.trim();
    if (text) {
      let employeeSearchedData = [];
      employeeSearchedData = state.employeeList.filter((c) => {
        return (
          c.firstName.toString().toUpperCase().includes(text.toUpperCase()) ||
          c.lastName.toUpperCase().includes(text.toUpperCase()) ||
          c.position.toUpperCase().includes(text.toUpperCase()) ||
          c.department.toUpperCase().includes(text.toUpperCase())
        );
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: employeeSearchedData,
      }));
    }
  };

  const sortEmployeeListWithFirstName = async () => {
    if (state.toggleEmployeeFirstName) {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeFirstName: false,
        sortColName: "employeeFirstName",
      }));
    } else {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeFirstName: true,
        sortColName: "employeeFirstName",
      }));
    }
    if (state.toggleEmployeeFirstName) {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeFirstName = EmployeeList.sort(function (a, b) {
        let fNameA =
          (a.firstName && a.firstName.toString().toUpperCase().trim()) || "---";
        let fNameB =
          (b.firstName && b.firstName.toString().toUpperCase().trim()) || "---";
        if (fNameA > fNameB) {
          return -1;
        }
        if (fNameA < fNameB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeFirstName,
        sortCheck: false,
      }));
    } else {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeFirstName = EmployeeList.sort(function (a, b) {
        let fNameA =
          (a.firstName && a.firstName.toString().toUpperCase().trim()) || "---";
        let fNameB =
          (b.firstName && b.firstName.toString().toUpperCase().trim()) || "---";
        if (fNameA > fNameB) {
          return 1;
        }
        if (fNameA < fNameB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeFirstName,
        sortCheck: true,
      }));
    }
  };

  const sortEmployeeListWithLastName = async () => {
    if (state.toggleEmployeeLastName) {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeLastName: false,
        sortColName: "employeeLastName",
      }));
    } else {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeLastName: true,
        sortColName: "employeeLastName",
      }));
    }
    if (state.toggleEmployeeLastName) {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeLastName = EmployeeList.sort(function (a, b) {
        let lNameA =
          (a.lastName && a.lastName.toString().toUpperCase().trim()) || "---";
        let lNameB =
          (b.lastName && b.lastName.toString().toUpperCase().trim()) || "---";
        if (lNameA > lNameB) {
          return -1;
        }
        if (lNameA < lNameB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeLastName,
        sortCheck: false,
      }));
    } else {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeLastName = EmployeeList.sort(function (a, b) {
        let lNameA =
          (a.lastName && a.lastName.toString().toUpperCase().trim()) || "---";
        let lNameB =
          (b.lastName && b.lastName.toString().toUpperCase().trim()) || "---";
        if (lNameA > lNameB) {
          return 1;
        }
        if (lNameA < lNameB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeLastName,
        sortCheck: true,
      }));
    }
  };

  const sortEmployeeListWithDepartment = async () => {
    if (state.toggleEmployeeDepartment) {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeDepartment: false,
        sortColName: "employeeDepartment",
      }));
    } else {
      await setState((prev) => ({
        ...prev,
        toggleEmployeeDepartment: true,
        sortColName: "employeeDepartment",
      }));
    }
    if (state.toggleEmployeeDepartment) {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeDepartment = EmployeeList.sort(function (a, b) {
        let deptNameA =
          (a.department && a.department.toString().toUpperCase().trim()) ||
          "---";
        let deptNameB =
          (b.department && b.department.toString().toUpperCase().trim()) ||
          "---";
        if (deptNameA > deptNameB) {
          return -1;
        }
        if (deptNameA < deptNameB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeDepartment,
        sortCheck: false,
      }));
    } else {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeeDepartment = EmployeeList.sort(function (a, b) {
        let deptNameA =
          (a.department && a.department.toString().toUpperCase().trim()) ||
          "---";
        let positionNameB =
          (b.department && b.department.toString().toUpperCase().trim()) ||
          "---";
        if (deptNameA > positionNameB) {
          return 1;
        }
        if (deptNameA < positionNameB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeeDepartment,
        sortCheck: true,
      }));
    }
  };

  const sortEmployeeListWithPosition = async () => {
    if (state.toggleEmployeePosition) {
      await setState((prev) => ({
        ...prev,
        toggleEmployeePosition: false,
        sortColName: "employeePosition",
      }));
    } else {
      await setState((prev) => ({
        ...prev,
        toggleEmployeePosition: true,
        sortColName: "employeePosition",
      }));
    }
    if (state.toggleEmployeePosition) {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeePosition = EmployeeList.sort(function (a, b) {
        let positionNameA =
          (a.position && a.position.toString().toUpperCase().trim()) || "---";
        let positionNameB =
          (b.position && b.position.toString().toUpperCase().trim()) || "---";
        if (positionNameA > positionNameB) {
          return -1;
        }
        if (positionNameA < positionNameB) {
          return 1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeePosition,
        sortCheck: false,
      }));
    } else {
      const EmployeeList = JSON.parse(JSON.stringify(state.clonedEmployeeList));

      let sortedEmployeePosition = EmployeeList.sort(function (a, b) {
        let positionNameA =
          (a.position && a.position.toString().toUpperCase().trim()) || "---";
        let deptNameB =
          (b.position && b.position.toString().toUpperCase().trim()) || "---";
        if (positionNameA > deptNameB) {
          return 1;
        }
        if (positionNameA < deptNameB) {
          return -1;
        }
        return 0;
        // codes must be equal
      });
      setState((prev) => ({
        ...prev,
        clonedEmployeeList: sortedEmployeePosition,
        sortCheck: true,
      }));
    }
  };

  const showSelectedCheckboxHandler = async (e) => {
    let newemplyeeList = state.clonedEmployeeList;
    let newfilteredArray;
    if (!e.target.checked) {
      newfilteredArray = state.employeeList;
    } else {
      newfilteredArray = newemplyeeList.filter(
        (element) => element.checked === true
      );
    }

    setState((prev) => ({
      ...prev,
      clonedEmployeeList: newfilteredArray,
    }));
  };

  const handleCheckbox = async (e, data) => {
    let _indexOfObject = state.clonedEmployeeList.findIndex(
      (item) => item === data
    );

    let _indexOfObjectWantTocheckedFalse = state.clonedEmployeeList.findIndex(
      (item) =>
        item ===
        state.clonedEmployeeList.find((element) => element.checked === true)
    );

    let newemplyeeList = state.clonedEmployeeList;
    if (_indexOfObjectWantTocheckedFalse !== -1) {
      newemplyeeList[_indexOfObjectWantTocheckedFalse] = {
        ...newemplyeeList[_indexOfObjectWantTocheckedFalse],
        checked: !newemplyeeList[_indexOfObjectWantTocheckedFalse].checked,
      };
    }
    if (_indexOfObject !== -1) {
      newemplyeeList[_indexOfObject] = {
        ...newemplyeeList[_indexOfObject],
        checked: !newemplyeeList[_indexOfObject].checked,
      };
    }
    setState((prev) => ({
      ...prev,
      clonedEmployeeList: newemplyeeList,
    }));

    props.updateParentState(data);
    closeModal("openEmployeeLookupModal");
  };

  const clearStates = () => {
    closeModal("openEmployeeLookupModal");
    setState({
      isLoading: false,
      clonedEmployeeList: [], //a copy of employeeList
      employeeSearchKeyword: "", //search employee
      toggleEmployeeFirstName: false,
      sortCheck: true, //to check weather sorting is Ascending OR Descending order (by Default Ascending)
      toggleEmployeeLastName: false,
      toggleEmployeeDepartment: false,
      toggleEmployeePosition: false,
      showSelected: false,
      selectedChartCode: "",
    });
  };

  if (!state) {
    return <div className="se-pre-con"></div>;
  }

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openEmployeeLookupModal}
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
                            <h6 className="text-left def-blue">
                              Employee Lookup
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() => {
                                closeModal("openEmployeeLookupModal");
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
                                  name="employeeSearchKeyword"
                                  id="employeeSearchId"
                                  value={state.employeeSearchKeyword}
                                  onChange={employeeSearchHandler}
                                  onKeyDown={onEnter}
                                />
                              </div>
                              <div className="col-auto p-md-0 align-self-center">
                                <button
                                  className="search_btn"
                                  onClick={onSearch}
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
                                  <div className="form-group remember_check mm_check3 mm_checkCc2">
                                    <input
                                      type="checkbox"
                                      id="remember-chart-c"
                                      checked={state.checkbox}
                                      onChange={showSelectedCheckboxHandler}
                                      name="checkbox"
                                    />
                                    <label htmlFor="remember-chart-c"></label>
                                    <p className="pt-1 mm_font">
                                      Show Selected:
                                    </p>
                                  </div>
                                </div>
                                <div className="col-auto d-flex justify-content-end s-c-main">
                                  <button
                                    type="button"
                                    className="btn-save ml-2"
                                    onClick={refreshEmployees}
                                  >
                                    <img
                                      src="images/refresh.png"
                                      className="mx-auto"
                                      alt="search-icon"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 p-md-0">
                          <div className="login_form">
                            <div className="login_table_list">
                              {/* <table className="table table-hover table_contaniner chart_code">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      onClick={sortEmployeeListWithFirstName}
                                      className="table_container--th"
                                    >
                                      <div className="col align-self-center">
                                        <div className="cursorPointer form-group remember_check mm_ffamily font__wrapper-inner">
                                          First Name{" "}
                                          {state.sortColName ===
                                            "employeeFirstName" && (
                                            <i
                                              className={
                                                state.sortCheck
                                                  ? "fa fa-angle-down sideBarAccord rorate_0"
                                                  : "fa fa-angle-down sideBarAccord"
                                              }
                                            ></i>
                                          )}
                                        </div>
                                      </div>
                                    </th>
                                    <th
                                      onClick={sortEmployeeListWithLastName}
                                      scope="col"
                                      className="cursorPointer table_container--th font__wrapper-inner"
                                    >
                                      Last Name{" "}
                                      {state.sortColName ===
                                        "employeeLastName" && (
                                        <i
                                          className={
                                            state.sortCheck
                                              ? "fa fa-angle-down sideBarAccord rorate_0"
                                              : "fa fa-angle-down sideBarAccord"
                                          }
                                        ></i>
                                      )}
                                    </th>
                                    <th
                                      onClick={sortEmployeeListWithDepartment}
                                      scope="col"
                                      className="cursorPointer table_container--th font__wrapper-inner"
                                    >
                                      Department{" "}
                                      {state.sortColName ===
                                        "employeeDepartment" && (
                                        <i
                                          className={
                                            state.sortCheck
                                              ? "fa fa-angle-down sideBarAccord rorate_0"
                                              : "fa fa-angle-down sideBarAccord"
                                          }
                                        ></i>
                                      )}
                                    </th>
                                    <th
                                      onClick={sortEmployeeListWithPosition}
                                      scope="col"
                                      className="cursorPointer table_container--th font__wrapper-inner"
                                    >
                                      Position{" "}
                                      {state.sortColName ===
                                        "employeePosition" && (
                                        <i
                                          className={
                                            state.sortCheck
                                              ? "fa fa-angle-down sideBarAccord rorate_0"
                                              : "fa fa-angle-down sideBarAccord"
                                          }
                                        ></i>
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {state.clonedEmployeeList.map((c, i) => {
                                    return (
                                      <tr key={i}>
                                        <th
                                          className="tbl__vertical--bottom"
                                          scope="row"
                                        >
                                          <div className="form-group remember_check mm_check3 mm_checkCc padding__wrapper-top">
                                            <input
                                              type="checkbox"
                                              id={"chartCode" + i}
                                              checked={c.checked ? true : false}
                                              name="checkbox"
                                              onChange={(e) =>
                                                handleCheckbox(e, c)
                                              }
                                            />
                                            <label
                                              htmlFor={"chartCode" + i}
                                            ></label>
                                            <span className="input__label-wrapper2">
                                              {c.firstName}
                                            </span>
                                          </div>
                                        </th>
                                        <td className="tbl__vertical--bottom">
                                          {c.lastName}
                                        </td>
                                        <td className="tbl__vertical--bottom">
                                          {c.department}
                                        </td>
                                        <td className="tbl__vertical--bottom">
                                          {c.position}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table> */}

                              <TableTest
                                handleCheckbox={handleCheckbox}
                                tabelData={state.clonedEmployeeList || []}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_header mb-md-3">
                      <div className="modal-top-header">
                        <div className="row">
                          {/* <div className="col d-flex justify-content-start s-c-main">
                              <button
                                onClick={this.onSelect}
                                type="button"
                                className="btn-save ml-2"
                              >
                                <span className="fa fa-check"></span>
                                Select
                              </button>
                            </div> */}
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

export default EmployeeLookup;
