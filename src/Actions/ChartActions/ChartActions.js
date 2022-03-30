import _ from "lodash";
const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Chart Actions****-------------------------

//----------------------****Get Chart Sorts****-----------------------
export const getChartSorts = () => async (dispatch) => {
  dispatch({
    type: "GET_CHART_SORT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetChartSort";

  try {
    // let response = getChartSort_api;

    let response = await Axios.get(url);
    let getChartSortsResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getChartSortsResp && getChartSortsResp.result.length > 0) {
      if (
        getChartSortsResp.result[0] &&
        getChartSortsResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_CHART_SORT_FAIL",
          payload:
            getChartSortsResp.result[0].description ||
            "Error While Getting Chart Sorts.",
        });
      }
      if (
        getChartSortsResp.result[0] &&
        getChartSortsResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CHART_SORT_SUCCESS",
          payload: getChartSortsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_CHART_SORT_FAIL",
        payload: "Error While Getting Chart Sorts.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Chart Sorts.";
    dispatch({
      type: "GET_CHART_SORT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Get Chart Codes****------------------------
export const getChartCodes = (sort) => async (dispatch) => {
  dispatch({
    type: "GET_CHART_CODES_INIT",
  });
  let url;
  if (sort) {
    url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/ChartRequest?actionType=GetChartCodes&chartSort=${sort}`;
  } else {
    url =
      localStorage.getItem("API_URL") +
      "/DPFAPI/ChartRequest?actionType=GetChartCodes";
  }

  try {
    // let response = getChartCodes_api;

    let response = await Axios.get(url);
    let getChartCodesResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getChartCodesResp && getChartCodesResp.result.length > 0) {
      if (
        getChartCodesResp.result[0] &&
        getChartCodesResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_CHART_CODES_FAIL",
          payload:
            getChartCodesResp.result[0].description ||
            "Error While Getting Chart Codes.",
        });
      }
      if (
        getChartCodesResp.result[0] &&
        getChartCodesResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CHART_CODES_SUCCESS",
          payload: getChartCodesResp,
        });
      }
    } else {
      dispatch({
        type: "GET_CHART_CODES_FAIL",
        payload: "Error While Getting Chart Codes.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Chart Codes.";
    dispatch({
      type: "GET_CHART_CODES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Tax Codes****--------------------------
export const getTaxCodes = () => async (dispatch) => {
  dispatch({
    type: "GET_TAX_CODES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetTaxCodes";

  try {
    // let response = getTaxCodes_api;

    let response = await Axios.get(url);
    let getTaxCodesResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getTaxCodesResp && getTaxCodesResp.result.length > 0) {
      if (
        getTaxCodesResp.result[0] &&
        getTaxCodesResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_TAX_CODES_FAIL",
          payload:
            getTaxCodesResp.result[0].description ||
            "Error While Getting Tax Codes.",
        });
      }
      if (
        getTaxCodesResp.result[0] &&
        getTaxCodesResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TAX_CODES_SUCCESS",
          payload: getTaxCodesResp,
        });
      }
    } else {
      dispatch({
        type: "GET_TAX_CODES_FAIL",
        payload: "Error While Getting Tax Codes.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Tax Codes.";
    dispatch({
      type: "GET_TAX_CODES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Flags ****-----------------------------
export const getFlags = () => async (dispatch) => {
  dispatch({
    type: "GET_FLAGS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetFlags";

  try {
    // let response = getFlags_api;

    let response = await Axios.get(url);
    let getFlagsResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getFlagsResp && getFlagsResp.result.length > 0) {
      if (
        getFlagsResp.result[0] &&
        getFlagsResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_FLAGS_FAIL",
          payload:
            getFlagsResp.result[0].description || "Error While Getting Flags.",
        });
      }
      if (
        getFlagsResp.result[0] &&
        getFlagsResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_FLAGS_SUCCESS",
          payload: getFlagsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_FLAGS_FAIL",
        payload: "Error While Getting Flags.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Flags.";
    dispatch({
      type: "GET_FLAGS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Currencies****-------------------------
export const getCurrencies = () => async (dispatch) => {
  dispatch({
    type: "GET_CURRENCIES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetCurrencies";

  try {
    // let response = getCurrencies_api;

    let response = await Axios.get(url);
    let getCurrenciesResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getCurrenciesResp && getCurrenciesResp.result.length > 0) {
      if (
        getCurrenciesResp.result[0] &&
        getCurrenciesResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_CURRENCIES_FAIL",
          payload:
            getCurrenciesResp.result[0].description ||
            "Error While Getting Currencies.",
        });
      }
      if (
        getCurrenciesResp.result[0] &&
        getCurrenciesResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CURRENCIES_SUCCESS",
          payload: getCurrenciesResp,
        });
      }
    } else {
      dispatch({
        type: "GET_CURRENCIES_FAIL",
        payload: "Error While Getting Currencies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Currencies.";
    dispatch({
      type: "GET_CURRENCIES_FAIL",
      payload: error,
    });
  }
};

//----------------------****Inser Chart Of Accounts Code****-----------
export const inserChartOfAccountCode = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_CHART_ACCOUNTS_CODE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  try {
    let response = await Axios.post(url, data);
    let updateAccountDetailsResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (
      updateAccountDetailsResp &&
      updateAccountDetailsResp.result.length > 0
    ) {
      if (
        updateAccountDetailsResp.result[0] &&
        updateAccountDetailsResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "INSERT_CHART_ACCOUNTS_CODE_FAIL",
          payload:
            updateAccountDetailsResp.result[0].description ||
            "Error While Updating Account Details.",
        });
      }
      if (
        updateAccountDetailsResp.result[0] &&
        updateAccountDetailsResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "INSERT_CHART_ACCOUNTS_CODE_SUCCESS",
          payload: updateAccountDetailsResp,
        });
      }
    } else {
      dispatch({
        type: "INSERT_CHART_ACCOUNTS_CODE_FAIL",
        payload: "Error While Updating Account Details.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Account Details.";
    dispatch({
      type: "INSERT_CHART_ACCOUNTS_CODE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Chart layouts****----------------------
export const getChartLayouts = () => async (dispatch) => {
  dispatch({
    type: "GET_CHART_LAYOUTS_INIT",
  });
  let url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetChartLayout";

  try {
    let response = await Axios.get(url);
    let getChartLayoutResp =
      (response && response.data && response.data.ChartResponse) || "";
    if (getChartLayoutResp && getChartLayoutResp.result.length > 0) {
      if (
        getChartLayoutResp.result[0] &&
        getChartLayoutResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_CHART_LAYOUTS_FAIL",
          payload:
            getChartLayoutResp.result[0].description ||
            "Error While Getting Chart Layout.",
        });
      }
      if (
        getChartLayoutResp.result[0] &&
        getChartLayoutResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CHART_LAYOUTS_SUCCESS",
          payload: getChartLayoutResp,
        });
      }
    } else {
      dispatch({
        type: "GET_CHART_LAYOUTS_FAIL",
        payload: "Error While Getting Chart Layout.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Chart Layout.";
    dispatch({
      type: "GET_CHART_LAYOUTS_FAIL",
      payload: error,
    });
  }
};

// ------------------------Depertments API's---------------------------

//----------------------****Get Departments****------------------------
export const getDepartments = () => async (dispatch) => {
  dispatch({
    type: "GET_DEPARTMENTS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetDepartments";

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_DEPARTMENTS_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_DEPARTMENTS_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Departments.",
        });
      }

    } else {
      dispatch({
        type: "GET_DEPARTMENTS_FAIL",
        payload: "Error While Getting Departments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Departments.";
    dispatch({
      type: "GET_DEPARTMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single Department****------------------
export const getDepartment = recordID => async (dispatch) => {
  dispatch({
    type: "GET_DEPARTMENT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetDepartment&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_DEPARTMENT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_DEPARTMENT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Department.",
        });
      }

    } else {
      dispatch({
        type: "GET_DEPARTMENT_FAIL",
        payload: "Error While Getting Department.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Department.";
    dispatch({
      type: "GET_DEPARTMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Prime Department****-----------------------
export const primeDepartment = () => async (dispatch) => {
  dispatch({
    type: "PRIME_DEPARTMENT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=PrimeDepartment";

  try {
    let response = await Axios.get(url);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_DEPARTMENT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PRIME_DEPARTMENT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Department.",
        });
      }

    } else {
      dispatch({
        type: "PRIME_DEPARTMENT_FAIL",
        payload: "Error While Priming Department.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Department.";
    dispatch({
      type: "PRIME_DEPARTMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Department****-------------------------
export const addDepartment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_DEPARTMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let department = {
    actionType: "AddDepartment",
    ...data
  };

  try {
    let response = await Axios.post(url, department);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_DEPARTMENT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "ADD_DEPARTMENT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Adding Department.",
        });
      }

    } else {
      dispatch({
        type: "ADD_DEPARTMENT_FAIL",
        payload: "Error While Adding Department.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Department.";
    dispatch({
      type: "ADD_DEPARTMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Department****----------------------
export const updateDepartment = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_DEPARTMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let department = {
    actionType: "UpdateDepartment",
    ...data
  };

  try {
    let response = await Axios.post(url, department);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_DEPARTMENT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_DEPARTMENT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Department.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_DEPARTMENT_FAIL",
        payload: "Error While Updating Department.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Department.";
    dispatch({
      type: "UPDATE_DEPARTMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Department****----------------------
export const deleteDepartment = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_DEPARTMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "DeleteDepartment",
    recordID
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_DEPARTMENT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_DEPARTMENT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Department.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_DEPARTMENT_FAIL",
        payload: "Error While Deleting Department.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Department.";
    dispatch({
      type: "DELETE_DEPARTMENT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------END----------------------------------
// ------------------------Chart Setup API's---------------------------

//----------------------****Prime Chart****----------------------------
export const primeChart = () => async (dispatch) => {
  dispatch({
    type: "PRIME_CHART_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=PrimeChart`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_CHART_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PRIME_CHART_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Chart.",
        });
      }

    } else {
      dispatch({
        type: "PRIME_CHART_FAIL",
        payload: "Error While Priming Chart.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Chart.";
    dispatch({
      type: "PRIME_CHART_FAIL",
      payload: error,
    });
  }
};
export const getChart = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_CHART_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetChart&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CHART_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_CHART_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Chart.",
        });
      }

    } else {
      dispatch({
        type: "GET_CHART_FAIL",
        payload: "Error While Getting Chart.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Chart.";
    dispatch({
      type: "GET_CHART_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Chart****------------------------------
export const addChart = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_CHART_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chart = {
    actionType: "AddChart",
    ...data
  };

  try {
    let response = await Axios.post(url, chart);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_CHART_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "ADD_CHART_FAIL",
          payload:
            res.result[0].description ||
            "Error While Adding Chart.",
        });
      }

    } else {
      dispatch({
        type: "ADD_CHART_FAIL",
        payload: "Error While Adding Chart.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Chart.";
    dispatch({
      type: "ADD_CHART_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Chart****---------------------------
export const updateChart = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_CHART_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chart = {
    actionType: "UpdateChart",
    ...data
  };

  try {
    let response = await Axios.post(url, chart);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_CHART_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_CHART_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Chart.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_CHART_FAIL",
        payload: "Error While Updating Chart.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Chart.";
    dispatch({
      type: "UPDATE_CHART_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Chart****---------------------------
export const deleteChart = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_CHART_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "DeleteChart",
    recordID
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_CHART_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_CHART_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Chart.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_CHART_FAIL",
        payload: "Error While Deleting Chart.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Chart.";
    dispatch({
      type: "DELETE_CHART_FAIL",
      payload: error,
    });
  }
};
//--------------------------------END----------------------------------
// ------------------------Currencies API's----------------------------
// ------------------------Get Currency--------------------------------
export const getCurrency = (code) => async (dispatch) => {
  dispatch({
    type: "GET_CURRENCY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetCurrency&code=${code}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CURRENCY_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_CURRENCY_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Currency.",
        });
      }

    } else {
      dispatch({
        type: "GET_CURRENCY_FAIL",
        payload: "Error While Getting Currency.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Currency.";
    dispatch({
      type: "GET_CURRENCY_FAIL",
      payload: error,
    });
  }
};
// ------------------------Prime Currency------------------------------
export const primeCurrency = (code) => async (dispatch) => {
  dispatch({
    type: "PRIME_CURRENCY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    '/DPFAPI/ChartRequest?actionType=PrimeCurrency';

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_CURRENCY_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PRIME_CURRENCY_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Currency.",
        });
      }

    } else {
      dispatch({
        type: "PRIME_CURRENCY_FAIL",
        payload: "Error While Priming Currency.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Currency.";
    dispatch({
      type: "PRIME_CURRENCY_FAIL",
      payload: error,
    });
  }
};
// ------------------------Add Currency--------------------------------
export const addCurrency = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_CURRENCY_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "AddCurrency",
    ...obj
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_CURRENCY_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "ADD_CURRENCY_FAIL",
          payload:
            res.result[0].description ||
            "Error While Adding Currency.",
        });
      }

    } else {
      dispatch({
        type: "ADD_CURRENCY_FAIL",
        payload: "Error While Adding Currency.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Currency.";
    dispatch({
      type: "ADD_CURRENCY_FAIL",
      payload: error,
    });
  }
};
// ------------------------Update Currency-----------------------------
export const updateCurrency = (obj) => async (dispatch) => {
  dispatch({
    type: "UPDATE_CURRENCY_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "UpdateCurrency",
    ...obj
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_CURRENCY_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_CURRENCY_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Currency.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_CURRENCY_FAIL",
        payload: "Error While Updating Currency.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Currency.";
    dispatch({
      type: "UPDATE_CURRENCY_FAIL",
      payload: error,
    });
  }
};
// ------------------------Delete Currency-----------------------------
export const deleteCurrency = (code) => async (dispatch) => {
  dispatch({
    type: "DELETE_CURRENCY_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "DeleteCurrency",
    code
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_CURRENCY_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_CURRENCY_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Currency.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_CURRENCY_FAIL",
        payload: "Error While Deleting Currency.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Currency.";
    dispatch({
      type: "DELETE_CURRENCY_FAIL",
      payload: error,
    });
  }
};
// -------------------------------END----------------------------------
// ------------------------Tracking Codes API's------------------------
// ------------------------Get Tracking Codes--------------------------
export const getTrackingCodes = (code) => async (dispatch) => {
  dispatch({
    type: "GET_TRACKING_CODES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    '/DPFAPI/ChartRequest?actionType=GetTrackingCodes';

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TRACKING_CODES_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_TRACKING_CODES_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Tracking Codes.",
        });
      }

    } else {
      dispatch({
        type: "GET_TRACKING_CODES_FAIL",
        payload: "Error While Getting Tracking Codes.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Tracking Codes.";
    dispatch({
      type: "GET_TRACKING_CODES_FAIL",
      payload: error,
    });
  }
};
// ------------------------Get Tracking Code---------------------------
export const getTrackingCode = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_TRACKING_CODE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetTrackingCode&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TRACKING_CODE_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_TRACKING_CODE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Tracking Code.",
        });
      }

    } else {
      dispatch({
        type: "GET_TRACKING_CODE_FAIL",
        payload: "Error While Getting Tracking Code.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Tracking Code.";
    dispatch({
      type: "GET_TRACKING_CODE_FAIL",
      payload: error,
    });
  }
};
// ------------------------Update Tracking Code------------------------
export const updateTrackingCode = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_TRACKING_CODE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let trCode = {
    actionType: "UpdateTrackingCode",
    ...data
  };

  try {
    let response = await Axios.post(url, trCode);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_TRACKING_CODE_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_TRACKING_CODE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Tracking Code.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_TRACKING_CODE_FAIL",
        payload: "Error While Updating Tracking Code.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Tracking Code.";
    dispatch({
      type: "UPDATE_TRACKING_CODE_FAIL",
      payload: error,
    });
  }
};
// ------------------------Add Tracking Code---------------------------
export const addTrackingCode = () => async (dispatch) => {
  dispatch({
    type: "ADD_TRACKING_CODE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chart = {
    actionType: "AddTrackingCode",
  };

  try {
    let response = await Axios.post(url, chart);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_TRACKING_CODE_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "ADD_TRACKING_CODE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Adding Tracking Code.",
        });
      }

    } else {
      dispatch({
        type: "ADD_TRACKING_CODE_FAIL",
        payload: "Error While Adding Tracking Code.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Tracking Code.";
    dispatch({
      type: "ADD_TRACKING_CODE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Tracking Code****-------------------
export const deleteTrackingCode = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_TRACKING_CODE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let data = {
    actionType: "DeleteTrackingCode",
    recordID
  };

  try {
    let response = await Axios.post(url, data);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_TRACKING_CODE_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_TRACKING_CODE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Tracking Code.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_TRACKING_CODE_FAIL",
        payload: "Error While Deleting Tracking Code.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Tracking Code.";
    dispatch({
      type: "DELETE_TRACKING_CODE_FAIL",
      payload: error,
    });
  }
};
// ------------------------Get Tracking Options------------------------
export const getTrackingOptions = (trackingType) => async (dispatch) => {
  dispatch({
    type: "GET_TRACKING_OPTIONS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetTrackingOptions&trackingType=${trackingType}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TRACKING_OPTIONS_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_TRACKING_OPTIONS_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Tracking Options.",
        });
      }

    } else {
      dispatch({
        type: "GET_TRACKING_OPTIONS_FAIL",
        payload: "Error While Getting Tracking Options.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Tracking Options.";
    dispatch({
      type: "GET_TRACKING_OPTIONS_FAIL",
      payload: error,
    });
  }
};
// -------------------------------END----------------------------------
// ------------------------Indirecct Tax Codes-------------------------

// ------------------------Get Tax Flag--------------------------------
export const getTaxFlag = (taxCode) => async (dispatch) => {
  dispatch({
    type: "GET_TAX_FLAG_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetTaxFlag&taxCode=${taxCode}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TAX_FLAG_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_TAX_FLAG_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Tax Flag.",
        });
      }

    } else {
      dispatch({
        type: "GET_TAX_FLAG_FAIL",
        payload: "Error While Getting Tax Flag.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Tax Flag.";
    dispatch({
      type: "GET_TAX_FLAG_FAIL",
      payload: error,
    });
  }
};
// ------------------------Prime Tax Flag------------------------------
export const primeTaxFlag = () => async (dispatch) => {
  dispatch({
    type: "PRIME_TAX_FLAG_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=PrimeTaxFlag`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_TAX_FLAG_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PRIME_TAX_FLAG_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Tax Flag.",
        });
      }

    } else {
      dispatch({
        type: "PRIME_TAX_FLAG_FAIL",
        payload: "Error While Priming Tax Flag.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Tax Flag.";
    dispatch({
      type: "PRIME_TAX_FLAG_FAIL",
      payload: error,
    });
  }
};
// ------------------------Insert Tax Flag-----------------------------
export const insertTaxFlag = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_TAX_FLAG_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let obj = {
    actionType: "InsertTaxFlag",
    ...data
  };

  try {
    let response = await Axios.post(url, obj);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "INSERT_TAX_FLAG_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "INSERT_TAX_FLAG_FAIL",
          payload:
            res.result[0].description ||
            "Error While Inserting Tax Flag.",
        });
      }

    } else {
      dispatch({
        type: "INSERT_TAX_FLAG_FAIL",
        payload: "Error While Inserting Tax Flag.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Tax Flag.";
    dispatch({
      type: "INSERT_TAX_FLAG_FAIL",
      payload: error,
    });
  }
};
// ------------------------Update Tax Flag-----------------------------
export const updateTaxFlag = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_TAX_FLAG_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let obj = {
    actionType: "UpdateTaxFlag",
    ...data
  };

  try {
    let response = await Axios.post(url, obj);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_TAX_FLAG_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_TAX_FLAG_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Tax Flag.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_TAX_FLAG_FAIL",
        payload: "Error While Updating Tax Flag.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Tax Flag.";
    dispatch({
      type: "UPDATE_TAX_FLAG_FAIL",
      payload: error,
    });
  }
};
// ------------------------Delete Tax Flag-----------------------------
export const deleteTaxFlag = (taxCode) => async (dispatch) => {
  dispatch({
    type: "DELETE_TAX_FLAG_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=DeleteTaxFlag&taxCode=${taxCode}`;

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_TAX_FLAG_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_TAX_FLAG_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Tax Flag.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_TAX_FLAG_FAIL",
        payload: "Error While Deleting Tax Flag.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Tax Flag.";
    dispatch({
      type: "DELETE_TAX_FLAG_FAIL",
      payload: error,
    });
  }
};
// -------------------------------END----------------------------------

//-------------------------------GET CHART ACCOUNT LIST----------------
export const getChartAccounts = () => async (dispatch) => {
  dispatch({
    type: "GET_CHART_ACCOUNTS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=GetAccounts";

  try {
    let response = await Axios.get(url);
    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_CHART_ACCOUNTS_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_CHART_ACCOUNTS_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Accounts.",
        });
      }

    } else {
      dispatch({
        type: "GET_CHART_ACCOUNTS_FAIL",
        payload: "Error While Getting Accounts.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Accounts.";
    dispatch({
      type: "GET_CHART_ACCOUNTS_FAIL",
      payload: error,
    });
  }
};
//----------------------------DELETE CHART ACCOUNT---------------------
export const deleteChartAccount = (chartAccountID) => async (dispatch) => {
  dispatch({
    type: "DELETE_CHART_ACCOUNT_INIT"
  })

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "DeleteAccount",
    chartAccountID
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_CHART_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "DELETE_CHART_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Chart Account.",
        });
      }

    } else {
      dispatch({
        type: "DELETE_CHART_ACCOUNT_FAIL",
        payload: "Error While Deleting Chart Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Chart Account.";
    dispatch({
      type: "DELETE_CHART_ACCOUNT_FAIL",
      payload: error,
    });
  }
}
//-----------------------------Prime Chart Account---------------------
export const primeAccount = () => async (dispatch) => {
  dispatch({
    type: "PRIME_ACCOUNT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/ChartRequest?actionType=PrimeAccount";

  try {
    let response = await Axios.get(url);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PRIME_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PRIME_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Account.",
        });
      }

    } else {
      dispatch({
        type: "PRIME_ACCOUNT_FAIL",
        payload: "Error While Priming Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Account.";
    dispatch({
      type: "PRIME_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//-------------------------------Add Chart Account---------------------
export const addAccount = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_ACCOUNT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "InsertAccount",
    ...data
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "ADD_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Adding Chart Account.",
        });
      }

    } else {
      dispatch({
        type: "ADD_ACCOUNT_FAIL",
        payload: "Error While Adding Chart Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Chart Account.";
    dispatch({
      type: "ADD_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//--------------------------Get Chart Account--------------------------
export const getAccount = chartAccountID => async (dispatch) => {
  dispatch({
    type: "GET_ACCOUNT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ChartRequest?actionType=GetAccount&chartAccountID=${chartAccountID}`;

  try {
    let response = await Axios.get(url);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "GET_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Account.",
        });
      }

    } else {
      dispatch({
        type: "GET_ACCOUNT_FAIL",
        payload: "Error While Getting Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Account.";
    dispatch({
      type: "GET_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//-----------------------UPDATE ACCOUNT--------------------------------
export const updateAccount = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_ACCOUNT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "UpdateAccount",
    ...data
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "UPDATE_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Account.",
        });
      }

    } else {
      dispatch({
        type: "UPDATE_ACCOUNT_FAIL",
        payload: "Error While Updating Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Account.";
    dispatch({
      type: "UPDATE_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
export const copyAccount = (data) => async (dispatch) => {
  dispatch({
    type: "COPY_ACCOUNT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "CopyAccount",
    ...data
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "COPY_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "COPY_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Copying Account.",
        });
      }

    } else {
      dispatch({
        type: "COPY_ACCOUNT_FAIL",
        payload: "Error While Copying Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Copying Account.";
    dispatch({
      type: "COPY_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//---------------------------Multiple Change---------------------------
export const multipleChange = (data) => async (dispatch) => {
  dispatch({
    type: "MULTIPLE_CHANGE_ACCOUNT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartOptions = {
    actionType: "MultiChangeAccounts",
    ...data
  };

  try {
    let response = await Axios.post(url, chartOptions);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "MULTIPLE_CHANGE_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "MULTIPLE_CHANGE_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Changing Accounts.",
        });
      }

    } else {
      dispatch({
        type: "MULTIPLE_CHANGE_ACCOUNT_FAIL",
        payload: "Error While Changing Accounts.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Changing Accounts.";
    dispatch({
      type: "MULTIPLE_CHANGE_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//------------------------Export Account------------------------------
export const exportChartAccount = (chartAccountID) => async (dispatch) => {
  dispatch({
    type: "EXPORT_CHART_ACCOUNT_INIT"
  })

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "ExportAccounts",
    chartAccountID
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "EXPORT_CHART_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "EXPORT_CHART_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Chart Account.",
        });
      }

    } else {
      dispatch({
        type: "EXPORT_CHART_ACCOUNT_FAIL",
        payload: "Error While Exporting Chart Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Chart Account.";
    dispatch({
      type: "EXPORT_CHART_ACCOUNT_FAIL",
      payload: error,
    });
  }
}
//------------------------PASTE ACCOUNT-------------------------------
export const pasteAccount = (data) => async (dispatch) => {
  dispatch({
    type: "PASTE_ACCOUNT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ChartRequest";

  let chartAccount = {
    actionType: "PasteAccounts",
    ...data
  };

  try {
    let response = await Axios.post(url, chartAccount);

    let res =
      (response && response.data && response.data.ChartResponse) || "";
    if (res && res.result.length > 0) {
      if (
        res.result[0] &&
        res.result[0].status === "Success"
      ) {
        dispatch({
          type: "PASTE_ACCOUNT_SUCCESS",
          payload: res,
        });
      }
      else {
        dispatch({
          type: "PASTE_ACCOUNT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Pasting Account.",
        });
      }

    } else {
      dispatch({
        type: "PASTE_ACCOUNT_FAIL",
        payload: "Error While Pasting Account.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Pasting Account.";
    dispatch({
      type: "PASTE_ACCOUNT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear Chart States In Store****-----------
export function clearChartStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_CHART_STATES",
    });
  };
}
