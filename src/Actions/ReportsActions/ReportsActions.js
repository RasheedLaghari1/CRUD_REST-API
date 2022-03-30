
const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Reports Actions****----------------------

//----------------------****Get Report Types****----------------------
export const getReportTypes = () => async (dispatch) => {
  dispatch({
    type: "GET_REPORT_TYPES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ReportRequest?actionType=GetReportTypes";

  try {
    let data = await Axios.get(url);
    let resp =
      (data && data.data && data.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_REPORT_TYPES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_REPORT_TYPES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Report Types.",
        });
      }
    } else {
      dispatch({
        type: "GET_REPORT_TYPES_FAIL",
        payload: "Error While Getting Report Types.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Report Types.";
    dispatch({
      type: "GET_REPORT_TYPES_FAIL",
      payload: error,
    });
  }
};

//----------------------****Get Report Options****--------------------
export const getReportOptions = (type) => async (dispatch) => {
  dispatch({
    type: "GET_REPORT_OPTIONS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ReportRequest?actionType=GetReportOptions&reportType=${type}`;

  try {
    let data = await Axios.get(url);
    let resp =
      (data && data.data && data.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_REPORT_OPTIONS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_REPORT_OPTIONS_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Report Options.",
        });
      }
    } else {
      dispatch({
        type: "GET_REPORT_OPTIONS_FAIL",
        payload: "Error While Getting Report Options.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Report Options.";
    dispatch({
      type: "GET_REPORT_OPTIONS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Report settings****--------------------
export const getReportSettings = (type) => async (dispatch) => {
  dispatch({
    type: "GET_REPORT_SETTINGS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ReportRequest?actionType=GetReportSettings&reportType=${type}`;

  try {
    let data = await Axios.get(url);
    let resp =
      (data && data.data && data.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_REPORT_SETTINGS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_REPORT_SETTINGS_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Report Settings.",
        });
      }
    } else {
      dispatch({
        type: "GET_REPORT_SETTINGS_FAIL",
        payload: "Error While Getting Report Settings.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Report Settings.";
    dispatch({
      type: "GET_REPORT_SETTINGS_FAIL",
      payload: error,
    });
  }
};

//----------------------****Get Report Data****-----------------------
export const getReportData = (data) => async (dispatch) => {
  dispatch({
    type: "GET_REPORT_DATA_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ReportRequest";
  let obj = {
    actionType: "GetReportData",
    ...data,
  };
  try {
    let data = await Axios.post(url, obj);
    let resp =
      (data && data.data && data.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_REPORT_DATA_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_REPORT_DATA_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Report Data.",
        });
      }
    } else {
      dispatch({
        type: "GET_REPORT_DATA_FAIL",
        payload: "Error While Getting Report Data.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Report Data.";
    dispatch({
      type: "GET_REPORT_DATA_FAIL",
      payload: error,
    });
  }
};

//----------------------****Delete Report****--------------------------
export const deleteReport = (reportType, reportID) => async (dispatch) => {
  dispatch({
    type: "DELETE_REPORT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ReportRequest";
  let obj = {
    actionType: "DeleteReport",
    reportType,
    reportID,
  };
  try {
    let data = await Axios.post(url, obj);
    let resp =
      (data && data.data && data.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_REPORT_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "DELETE_REPORT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Deleting Report.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_REPORT_FAIL",
        payload: "Error While Deleting Report.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Report.";
    dispatch({
      type: "DELETE_REPORT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Prime Post****-----------------------------
export const primePost = (reportType) => async (dispatch) => {
  dispatch({
    type: "PRIME_POST_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ReportRequest";
  let obj = {
    actionType: "PrimePost",
    reportType
  };
  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.Report_response) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_POST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "PRIME_POST_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Priming The Post.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_POST_FAIL",
        payload: "Error While Priming The Post.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming The Post.";
    dispatch({
      type: "PRIME_POST_FAIL",
      payload: error,
    });
  }
};

//----------------------****Clear Reports States In Store****-----------
export function clearReportsStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_REPORTS_STATES",
    });
  };
}
