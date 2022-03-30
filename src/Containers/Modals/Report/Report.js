import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { _customStyles } from "../../../Constants/Constants";
import { useSelector, useDispatch } from "react-redux";
import {
  handleAPIErr,
  toBase64,
  handleValueOptions,
  handleHideUnhideRows,
} from "../../../Utils/Helpers";
import * as Validation from "../../../Utils/Validation";
import {
  getReportOptions,
  getReportSettings,
  getReportData,
  deleteReport,
  clearReportsStates,
} from "../../../Actions/ReportsActions/ReportsActions";
const uuidv1 = require("uuid/v1");

const Report = (props) => {
  const [state, setState] = useState({
    addNewReportToggle: false,
    reportTypesVal: { label: "", value: "" },
    reportTypes: [],
    reportOptionVal: { label: "", value: "" },
    reportOptions: [],
    menuIsOpen: false,
    reportFile: "",
    reportName: "",
    privateCheck: false,
    showHiddenRows: false,
    reportSettings: [],
    clonedReportSettings: [],
    reDrawDT: false, //re draw datatable
    formErrors: {
      reportTypesVal: "",
      reportOptionVal: "",
      reportFile: "",
      reportName: "",
    },
  });

  const dispatch = useDispatch();
  const reportState = useSelector((state) => state.report);

  //calling getReportOptions API
  useEffect(() => {
    if (props.openReportModal) {
      Promise.all([_getReportOptions(), _getReportSettings()]);
    } else {
      clearStates();
    }
  }, [props.openReportModal]);

  const _getReportOptions = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await dispatch(getReportOptions(props.reportType));

    setState((prev) => ({ ...prev, isLoading: false }));
  };
  const _getReportSettings = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await dispatch(getReportSettings(props.reportType));

    setState((prev) => ({ ...prev, isLoading: false }));
  };
  //getReportOptions and getReportSettings success OR error case
  useEffect(() => {
    if (reportState.getReportOptionsSuccess) {
      // toast.success(reportState.getReportOptionsSuccess);

      let getReportOptions = reportState.getReportOptions || [];

      reportTypes = [];
      getReportOptions.map((t, i) => {
        reportTypes.push({
          label: t.reportType,
          value: t.areaRef,
        });
      });

      setState((prev) => ({
        ...prev,
        reportTypes,
      }));

      dispatch(clearReportsStates());
    } else if (reportState.getReportOptionsError) {
      handleAPIErr(reportState.getReportOptionsError, props.locationProps);
      dispatch(clearReportsStates());
    }
    //get report settings case
    if (reportState.getReportSettingsSuccess) {
      toast.success(reportState.getReportSettingsSuccess);

      let reportSettings = reportState.getReportSettings || [];

      //restructure list to show in drop-down
      reportSettings.map((lst, i) => {
        if (lst.valueType && lst.valueType.toLowerCase() === "list") {
          let valOptns = [];
          if (lst.valueOptions && lst.valueOptions.length > 0) {
            lst.valueOptions.map((o, i) => {
              valOptns.push({ label: o.option, value: o.option });
            });
          }
          lst.valueOptions = valOptns;
        }
        lst.id = uuidv1();
        lst.hide = false;
        return lst;
      });

      //get advanced list data from the local storage to hide/unhide rows for all reports
      let reports__settings = JSON.parse(
        localStorage.getItem("reports__settings") || "[]"
      );
      if (reports__settings && reports__settings.length > 0) {
        reportSettings.map((al, i) => {
          reports__settings.map((lst, i) => {
            if (
              al.category === lst.category &&
              al.description === lst.description
            ) {
              al.hide = true;
            }
          });
        });
      }
      let filtrdList = reportSettings.filter((l) => !l.hide);
      setState((prev) => ({
        ...prev,
        reportSettings: filtrdList,
        clonedReportSettings: reportSettings,
        reDrawDT: true,
      }));
      dispatch(clearReportsStates());
    } else if (reportState.getReportSettingsError) {
      handleAPIErr(reportState.getReportSettingsError, props.locationProps);
      dispatch(clearReportsStates());
    }
  }, [reportState]);
  const handleReportTypes = (type) => {
    let { formErrors } = state;

    formErrors = Validation.handleValidation(
      "reportTypesVal",
      type.value,
      formErrors
    );

    let areaRef = type.value || "";

    let getReportOptions = reportState.getReportOptions || [];
    reportOptions = [];

    let found = getReportOptions.find((rop) => rop.areaRef === areaRef);
    if (found) {
      let reportLayouts = found.reportLayouts || [];

      reportLayouts.map((l, i) => {
        reportOptions.push({
          label: l.layout,
          value: l.id,
          locked: l.locked,
        });
      });
    }
    setState((prev) => ({
      ...prev,
      reportTypesVal: type,
      reportOptionVal: { label: "", value: "" },
      reportOptions,
      formErrors,
    }));
  };
  const handleReportOptions = (layout) => {
    let { formErrors } = state;

    formErrors = Validation.handleValidation(
      "reportOptionVal",
      layout.value,
      formErrors
    );

    setState((prev) => ({
      ...prev,
      reportOptionVal: layout,
      addNewReportToggle: false,
      reportFile: "",
      reportName: "",
      private: false,
      formErrors,
    }));
  };
  const handleReportCheckbox = (e) => {
    let { checked } = e.target;
    setState((prev) => ({ ...prev, privateCheck: checked }));
  };
  const handleReportRadios = async (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFieldChange = async (e) => {
    let { name, value } = e.target;
    let { formErrors } = state;

    formErrors = Validation.handleValidation("reportName", value, formErrors);
    setState((prev) => ({ ...prev, [name]: value, formErrors }));
  };
  const uploadReportFile = async (f) => {
    let { formErrors } = state;
    let type = f[0].type;
    let file = f[0];
    let size = f[0].size;

    if (type == "mrt") {
      if (size <= 2000000) {
        const result = await toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          formErrors = Validation.handleValidation(
            "reportFile",
            result,
            formErrors
          );
          setState((prev) => ({
            ...prev,
            reportFile: result,
            formErrors,
          }));
        }
      } else {
        toast.error("Maximum Image Size 2MB");
      }
    } else {
      toast.error("Please Select only Images of type: '.mrt'");
    }
  };
  const addNewReport = () => {
    setState((prevState) => ({
      ...prevState,
      addNewReportToggle: !prevState.addNewReportToggle,
      reportOptionVal: { label: "", value: "" },
      formErrors: {
        ...formErrors,
        reportOptionVal: "",
      },
    }));
  };
  const _deleteReport = async (reportID, locked) => {
    let reportType = props.reportType || "";

    if (locked != "Y" || 1) {
      if (reportType && reportID) {
        setState((prev) => ({ ...prev, isLoading: true }));
        await dispatch(deleteReport(reportType, reportID));
        setState((prev) => ({ ...prev, isLoading: false }));
      } else {
        toast.error("Report Type OR Report ID is Missing!");
      }
    } else {
      toast.error("You can't delete this Report!");
    }
  };
  //deleteReport success or error case
  useEffect(() => {
    //success case of delete Report success
    if (reportState.deleteReportSuccess) {
      toast.success(reportState.deleteReportSuccess);
      let { reportOptions } = state;
      //report options List
      if (reportState.deleteReport && reportState.deleteReport.length > 0) {
        reportOptions = reportState.deleteReport;
        let reportOptionsArr = [];
        reportOptions.map((t, i) => {
          reportOptionsArr.push({
            label: t.layout,
            value: t.id,
            locked: t.locked,
          });
        });
        reportOptions = reportOptionsArr;
      }

      setState((prev) => ({
        ...prev,
        reportOptions,
        addNewReportToggle: false,
        reportFile: "",
        reportName: "",
        private: false,
        reportOptionVal: { label: "", value: "" },
        formErrors: {
          ...formErrors,
          reportFile: "",
          reportName: "",
        },
      }));
      dispatch(clearReportsStates());
    }
    //error case of Delete Report
    if (reportState.deleteReportError) {
      handleAPIErr(reportState.deleteReportError, props.locationProps);
      dispatch(clearReportsStates());
    }
  }, [reportState]);
  const initializeTable = () => {
    window.$("#reportv4-table").DataTable({
      dom: "Rlfrtip",
      searching: false,
      colResize: true,
      paging: false,
      info: false,
      order: [[1, "asc"]],
      colReorder: {
        fixedColumnsRight: 5,
        fixedColumnsLeft: 5,
      },
    });
  };
  //Hide/Unhide Rows
  const _handleHideUnhideRows = (item) => {
    let { reportSettings, clonedReportSettings, showHiddenRows } = state;

    let result = handleHideUnhideRows(
      item,
      "#reportv4-table",
      "reports__settings",
      reportSettings,
      clonedReportSettings,
      showHiddenRows
    );

    setState((prev) => ({
      ...prev,
      reportSettings: result.advancedList,
      clonedReportSettings: result.clonedAdvancedList,
      showHiddenRows: result.showHiddenRows,
      reDrawDT: true,
    }));
  };
  //initialize advanced list datatable
  useEffect(() => {
    if (state.reDrawDT) {
      initializeTable();
    }
    setState((prev) => ({ ...prev, reDrawDT: false }));
  }, [state.reDrawDT]); //reDrawDT -> re-drawing datatable

  //Advanced List Setting
  const _handleValueOptions = async (type, val, item, index) => {
    let { reportSettings, clonedReportSettings } = state;
    let result = handleValueOptions(
      type,
      val,
      item,
      index,
      reportSettings,
      clonedReportSettings
    );
    setState((prev) => ({
      ...prev,
      reportSettings: result.advancedList,
      clonedReportSettings: result.clonedAdvancedList,
    }));
  };
  const handleShowHiddenRows = async () => {
    let table = window.$("#reportv4-table").DataTable();
    table.destroy();

    let { reportSettings, clonedReportSettings, showHiddenRows } = state;

    showHiddenRows = !showHiddenRows;

    if (showHiddenRows) {
      //show hidden rows
      reportSettings = clonedReportSettings;
    } else {
      //hide again hidden rows
      let list = reportSettings.filter((l) => !l.hide);
      reportSettings = list;
    }

    setState((prev) => ({
      ...prev,
      reportSettings,
      showHiddenRows,
      reDrawDT: true, //to re daraw the datatable
    }));
  };
  const menuOpened = async () => {
    setState((prev) => ({ ...prev, menuIsOpen: true }));
    $(document).ready(async function () {
      $('<i class="fa fa-trash report--del"></i>').appendTo(
        ".report_menu.custon_select-selector-inner__option"
      );
      $(".report_menu.custon_select-selector-inner__option i").on(
        "click",
        async function (e) {
          e.preventDefault();
          var p_id = $(this).parent().attr("id");
          let id_split = p_id && p_id.split("-"); //["react", "select", "3", "option", "1"]
          let id = id_split[id_split.length - 1];

          let { reportOptions } = state;
          let rep_opt = reportOptions.length > 0 && reportOptions[id];
          //call delete report options API
          await _deleteReport(rep_opt.value, rep_opt.locked);
        }
      );
    });
  };
  const menuClosed = () => {
    setState((prev) => ({ ...prev, menuIsOpen: false }));
  };
  const clearStates = () => {
    setState({
      addNewReportToggle: false,
      reportTypesVal: { label: "", value: "" },
      reportTypes: [],
      reportOptionVal: { label: "", value: "" },
      reportOptions: [],
      menuIsOpen: false,
      reportFile: "",
      reportName: "",
      privateCheck: false,
      reportSettings: [],
      showHiddenRows: false,
      formErrors: {
        reportTypesVal: "",
        reportOptionVal: "",
        reportFile: "",
        reportName: "",
      },
    });
    props.closeModal("openReportModal");
  };
  const onSaveReport = async () => {
    let {
      reportName,
      reportTypesVal,
      reportOptionVal,
      reportFile,
      addNewReportToggle,
      privateCheck,
      formErrors,
      clonedReportSettings,
    } = state;

    if (addNewReportToggle) {
      //add new report case
      formErrors = Validation.handleWholeValidation(
        { reportName, reportFile },
        formErrors
      );
    } else {
      //use reports from the drop down list
      formErrors = Validation.handleWholeValidation(
        {
          reportTypesVal: reportTypesVal.value,
          reportOptionVal: reportOptionVal.value,
        },
        formErrors
      );
    }

    let check = false;
    if (addNewReportToggle) {
      if (!formErrors.reportFile && !formErrors.reportName) {
        check = true;
      }
    } else {
      if (!formErrors.reportOptionVal) {
        check = true;
      }
    }
    if (!formErrors.reportTypesVal && check) {
      let data = "";
      if (reportOptionVal.value) {
        //get report data according to available report options
        data = {
          reportType: props.reportType,
          reportID: reportOptionVal.value,
          reportSettings: clonedReportSettings,
        };
      } else {
        //create new reports and get data according to that report
        data = {
          reportType: props.reportType,
          reportFile,
          reportName,
          private: privateCheck,
          reportSettings: clonedReportSettings,
        };
      }
      if (data) {
        setState((prev) => ({ ...prev, isLoading: true }));
        await dispatch(getReportData(data));
      }
    }
    setState((prev) => ({ ...prev, formErrors, isLoading: false }));
  };
  //getReportData success OR error case
  useEffect(() => {
    //success case of get Report Data
    if (reportState.getReportDataSuccess) {
      // toast.success(reportState.getReportDataSuccess);
      let jsonData = reportState.getReportData.jsonData || "";
      let reportFile = reportState.getReportData.reportFile || "";
      let key = reportState.getReportData.key || "";

      if (jsonData && reportFile && key) {
        localStorage.setItem("reportFile", reportFile);
        localStorage.setItem("jsonData", jsonData);
        localStorage.setItem("key", key);
        var path =
          window.location.protocol +
          "//" +
          window.location.host +
          "/report-view";

        window.open(path, "_blank");
        clearStates();
      }
      dispatch(clearReportsStates());
    }
    //error case of get Report Data
    if (reportState.getReportDataError) {
      dispatch(clearReportsStates());
      handleAPIErr(reportState.getReportDataError, props.locationProps);
    }
  }, [reportState]);
  let {
    addNewReportToggle,
    reportTypesVal,
    reportTypes,
    reportOptionVal,
    reportOptions,
    menuIsOpen,
    reportFile,
    reportName,
    privateCheck,
    formErrors,
    reportSettings,
    showHiddenRows,
  } = state;
  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openReportModal}
        onHide={clearStates}
        className="modal_704 mx-auto reports-v4-modal"
      >
        <Modal.Body>
          <div className="container-fluid p-0">
            <div className="main_wrapper">
              <div className="row d-flex h-100 p-0">
                <div className="col-12 justify-content-center align-self-center">
                  <div className="setting_form_main p-0">
                    <div className="setting_header thead_bg">
                      <h3 className="Indirecttaxcode-poup_heading">Reports</h3>
                      <div className="Indirecttaxcode-poup_can-sav-btn">
                        <button onClick={onSaveReport} className="btn can-btn1">
                          <img
                            src="images/user-setup/check-white.png"
                            alt="check"
                          />
                          Save
                        </button>
                        <button
                          onClick={clearStates}
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
                    <div className="reportv4-modal-inner">
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <label>Select Report Type</label>

                            <Select
                              className="width-selector"
                              value={reportTypesVal}
                              classNamePrefix="custon_select-selector-inner"
                              options={reportTypes}
                              onChange={handleReportTypes}
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
                            <div className="text-danger error-12">
                              {formErrors.reportTypesVal !== ""
                                ? formErrors.reportTypesVal
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="reports_popup__table">
                        <h2>Advanced</h2>
                        <div className="row">
                          <div className="form-group col-md-12">
                            <div className="custon_select">
                              <label>Select Report Option</label>

                              <Select
                                className="width-selector"
                                onMenuOpen={menuIsOpen}
                                closeMenuOnSelect={true}
                                value={reportOptionVal}
                                classNamePrefix="report_menu custon_select-selector-inner"
                                onMenuOpen={menuOpened}
                                onMenuClose={menuClosed}
                                onChange={handleReportOptions}
                                options={reportOptions}
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
                              <div className="text-danger error-12">
                                {formErrors.reportOptionVal !== ""
                                  ? formErrors.reportOptionVal
                                  : ""}
                              </div>
                              <span
                                className="input_field_icons rit-icon-input"
                                onClick={addNewReport}
                              >
                                <i className="fa fa-plus"></i>
                              </span>
                            </div>
                          </div>
                          {addNewReportToggle && (
                            <div className=" pl-3 pr-3 w-100">
                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group custon_select mt-3">
                                    <div className="modal_input">
                                      <label>Report Name</label>
                                      <input
                                        type="text"
                                        className="form-control pl-0"
                                        id="usr"
                                        name="reportName"
                                        value={reportName}
                                        onChange={handleFieldChange}
                                      />
                                      <div className="text-danger error-12">
                                        {formErrors.reportName !== ""
                                          ? formErrors.reportName
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12 align-self-center mb-2 supp2-roprt-check">
                                  <div className="form-group remember_check">
                                    <input
                                      type="checkbox"
                                      id="remember"
                                      checked={privateCheck}
                                      onChange={(e) => handleReportCheckbox(e)}
                                    />
                                    <label htmlFor="remember"></label>
                                    <p className="reports-excel rc-lineheight">
                                      Private:
                                    </p>
                                  </div>
                                </div>
                                <div className="col-12 mt-2 mb-2">
                                  <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                    <div id="drop-area-report">
                                      <input
                                        type="file"
                                        id="fileElem-rep"
                                        className="form-control d-none"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                          uploadReportFile(e.target.files);
                                        }}
                                        onClick={(event) => {
                                          event.currentTarget.value = null;
                                        }} //to upload the same file again
                                      />

                                      <label
                                        className="upload-label"
                                        htmlFor="fileElem-rep"
                                      >
                                        <div className="upload-text">
                                          <img
                                            src="images/drag-file.png"
                                            className="import_icon img-fluid"
                                            alt="upload-report"
                                          />
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="text-danger error-12">
                                    {formErrors.reportFile !== ""
                                      ? formErrors.reportFile
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="reconciliation-table1 table_white_box">
                          <table
                            className="table"
                            id="reportv4-table"
                            width="100%"
                          >
                            <thead className="thead_bg hover-border">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    category
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">
                                    Description
                                  </span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">Value</span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">From</span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">To</span>
                                </th>
                                <th scope="col">
                                  <span className="user_setup_hed">Hide</span>
                                </th>
                                <th className="table__inner--th">
                                  <div className="dropdown">
                                    <button
                                      aria-haspopup="true"
                                      aria-expanded="true"
                                      id=""
                                      type="button"
                                      className="dropdown-toggle btn dept-tbl-menu "
                                      data-toggle="dropdown"
                                    >
                                      <span className="fa fa-bars "></span>
                                    </button>
                                    <div className="dropdown-menu dept-menu-list dropdown-menu-right">
                                      <div className="pr-0 dropdown-item">
                                        <div className="form-group remember_check mm_check4">
                                          <input
                                            type="checkbox"
                                            id="showHiddenRows"
                                            name="showHiddenRows"
                                            checked={showHiddenRows}
                                            onClick={handleShowHiddenRows}
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
                              {reportSettings.map((list, i) => {
                                return (
                                  <tr>
                                    <td></td>
                                    <td>{list.category}</td>
                                    <td>{list.description}</td>
                                    {list.valueType === "List" ? (
                                      <td className="pt-0 pb-0 text-left  value__field--wrapperdept ">
                                        <Select
                                          classNamePrefix="custon_select-selector-inner main__dropdown--wrappertwo select__font-wrapper                                        "
                                          value={{
                                            label: list.value,
                                            value: list.value,
                                          }}
                                          options={list.valueOptions}
                                          onChange={(obj) =>
                                            _handleValueOptions(
                                              "list",
                                              obj,
                                              list,
                                              i
                                            )
                                          }
                                          styles={_customStyles}
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
                                      </td>
                                    ) : list.valueType === "Date" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <DatePicker
                                            selected={Number(list.value)}
                                            dateFormat="d MMM yyyy"
                                            autoComplete="off"
                                            onChange={(date) =>
                                              _handleValueOptions(
                                                "date",
                                                date,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : list.valueType === "Check" ? (
                                      <td>
                                        <div className="col-auto p-0">
                                          <div className="form-group remember_check text-center pt-0 float-left">
                                            <input
                                              type="checkbox"
                                              id={`chk${i}`}
                                              checked={
                                                list.value === "Y" ||
                                                list.value === "1"
                                                  ? true
                                                  : false
                                              }
                                              onChange={(e) =>
                                                _handleValueOptions(
                                                  "checkbox",
                                                  e,
                                                  list,
                                                  i
                                                )
                                              }
                                            />
                                            <label htmlFor={`chk${i}`}></label>
                                          </div>
                                        </div>
                                      </td>
                                    ) : list.valueType === "Numeric" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <input
                                            type="number"
                                            value={list.value}
                                            onChange={(e) =>
                                              _handleValueOptions(
                                                "number",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : list.valueType === "Range" ||
                                      list.valueType === "Text" ? (
                                      <td>
                                        <div className="table_input_field">
                                          <input
                                            type="text"
                                            value={list.value}
                                            onChange={(e) =>
                                              _handleValueOptions(
                                                "text",
                                                e,
                                                list,
                                                i
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    ) : (
                                      <td>{list.value}</td>
                                    )}
                                    <td>{list.from}</td>
                                    <td>{list.to}</td>
                                    <td>
                                      <div className="custom-radio">
                                        <label
                                          className="check_main remember_check"
                                          htmlFor={`hideUnhideRows${i}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name={"hideUnhideRows"}
                                            id={`hideUnhideRows${i}`}
                                            checked={false}
                                            onChange={(e) =>
                                              _handleHideUnhideRows(list)
                                            }
                                          />

                                          {/* <span className='click_checkmark'></span> */}
                                          <span
                                            className={
                                              list.hide
                                                ? "dash_checkmark bg_clr"
                                                : "dash_checkmark"
                                            }
                                          ></span>
                                        </label>
                                      </div>
                                    </td>
                                    <td></td>
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
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Report;
