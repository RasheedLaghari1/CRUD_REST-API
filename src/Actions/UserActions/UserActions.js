const Axios = require("axios");
Axios.defaults.withCredentials = true;
// ---------------------****User Actions****-----------------------------

//----****Check Company ::> to check which API url will used in all APP****---
export const checkCompany = (apiUrl, companyID) => async (dispatch) => {
  dispatch({
    type: "CHECK_COMPANY_INIT",
  });

  let url = apiUrl + "/DPFAPI/UserRequest";
  let data = {
    actionType: "CheckCompany",
    companyID,
  };
  try {
    let response = await Axios.post(url, data);

    let checkCompanyResp =
      (response && response.data && response.data.UserResponse) || "";
    if (checkCompanyResp && checkCompanyResp.results.length > 0) {
      if (
        checkCompanyResp.results[0] &&
        checkCompanyResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "CHECK_COMPANY_FAIL",
          payload:
            checkCompanyResp.results[0].description ||
            "Error While Checking Company.",
        });
      }
      if (
        checkCompanyResp.results[0] &&
        checkCompanyResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "CHECK_COMPANY_SUCCESS",
          payload: checkCompanyResp.results[0].description,
        });
      }
    } else {
      dispatch({
        type: "CHECK_COMPANY_FAIL",
        payload: "Error While Checking Company.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Checking Company.";
    dispatch({
      type: "CHECK_COMPANY_FAIL",
      payload: error,
    });
  }
};
//----****LogIn User****-----------
export const logInUser = (userData) => async (dispatch) => {
  dispatch({
    type: "LOG_IN_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  try {
    let response = await Axios.post(url, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    let userLoginResp =
      (response && response.data && response.data.UserResponse) || "";
    if (userLoginResp && userLoginResp.results.length > 0) {
      if (
        userLoginResp.results[0] &&
        userLoginResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "LOG_IN_USER_FAIL",
          payload:
            userLoginResp.results[0].description || "Error While Logging",
        });
      }
      if (
        userLoginResp.results[0] &&
        userLoginResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "LOG_IN_USER_SUCCESS",
          payload: userLoginResp,
        });
      }
    } else {
      dispatch({
        type: "LOG_IN_USER_FAIL",
        payload: "Error While Logging",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Logging";
    dispatch({
      type: "LOG_IN_USER_FAIL",
      payload: error,
    });
  }
};
//----****Request pin code****-----
export const requestPinCode = (data) => async (dispatch) => {
  dispatch({
    type: "REQUEST_PIN_CODE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  try {
    let response = await Axios.post(url, data);
    let reqPinCodeResp =
      (response && response.data && response.data.UserResponse) || "";
    if (reqPinCodeResp && reqPinCodeResp.results.length > 0) {
      if (
        reqPinCodeResp.results[0] &&
        reqPinCodeResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "REQUEST_PIN_CODE_FAIL",
          payload:
            reqPinCodeResp.results[0].description ||
            "Error While Requesting Pin Code",
        });
      }
      if (
        reqPinCodeResp.results[0] &&
        reqPinCodeResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "REQUEST_PIN_CODE_SUCCESS",
          payload: reqPinCodeResp,
        });
      }
    } else {
      dispatch({
        type: "REQUEST_PIN_CODE_FAIL",
        payload: "Error While Requesting Pin Code",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Requesting Pin Code";
    dispatch({
      type: "REQUEST_PIN_CODE_FAIL",
      payload: error,
    });
  }
};
//----****Verify pin code****------
export const verifyPinCode = (data) => async (dispatch) => {
  dispatch({
    type: "VERIFY_PIN_CODE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  try {
    let response = await Axios.post(url, data);

    let verifyPinCodeResp =
      (response && response.data && response.data.UserResponse) || "";
    if (verifyPinCodeResp && verifyPinCodeResp.results.length > 0) {
      if (
        verifyPinCodeResp.results[0] &&
        verifyPinCodeResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "VERIFY_PIN_CODE_FAIL",
          payload:
            verifyPinCodeResp.results[0].description ||
            "Error While Verifying Pin Code",
        });
      }
      if (
        verifyPinCodeResp.results[0] &&
        verifyPinCodeResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "VERIFY_PIN_CODE_SUCCESS",
          payload:
            verifyPinCodeResp.results[0].description ||
            "Successfully Verify Pin Code",
        });
      }
    } else {
      dispatch({
        type: "VERIFY_PIN_CODE_FAIL",
        payload: "Error While Verifying Pin Code",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Verifying Pin Code";
    dispatch({
      type: "VERIFY_PIN_CODE_FAIL",
      payload: error,
    });
  }
};
//----****Reset Password****-------
export const resetPassword = (data) => async (dispatch) => {
  dispatch({
    type: "RESET_PASSWORD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  try {
    let response = await Axios.post(url, data);

    let resetPassResp =
      (response && response.data && response.data.UserResponse) || "";
    if (resetPassResp && resetPassResp.results.length > 0) {
      if (
        resetPassResp.results[0] &&
        resetPassResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "RESET_PASSWORD_FAIL",
          payload:
            resetPassResp.results[0].description ||
            "Error While Reseting Password.",
        });
      }
      if (
        resetPassResp.results[0] &&
        resetPassResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "RESET_PASSWORD_SUCCESS",
          payload:
            resetPassResp.results[0].description ||
            "Successfully Reset Your Password.",
        });
      }
    } else {
      dispatch({
        type: "RESET_PASSWORD_FAIL",
        payload: "Error While Reseting Password.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Reseting Password.";
    dispatch({
      type: "RESET_PASSWORD_FAIL",
      payload: error,
    });
  }
};
//----****LogOut User****----------
export const logOutUser = () => async (dispatch) => {
  dispatch({
    type: "LOG_OUT_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let data = {
    actionType: "LogoutUser",
  };
  try {
    let response = await Axios.post(url, data, {
      headers: { "content-type": "application/json" },
    });

    let logoutResp =
      (response && response.data && response.data.UserResponse) || "";
    if (logoutResp && logoutResp.results.length > 0) {
      if (logoutResp.results[0] && logoutResp.results[0].status === "Failed") {
        dispatch({
          type: "LOG_OUT_USER_FAIL",
          payload: logoutResp.results[0].description || "Error While Logout.",
        });
      }
      if (logoutResp.results[0] && logoutResp.results[0].status === "Success") {
        dispatch({
          type: "LOG_OUT_USER_SUCCESS",
          payload: logoutResp.results[0].description || "Successfully Logout.",
        });
      }
    } else {
      dispatch({
        type: "LOG_OUT_USER_FAIL",
        payload: "Error While Logout.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Logout.";
    dispatch({
      type: "LOG_OUT_USER_FAIL",
      payload: error,
    });
  }
};
//----****GetProductions****--------
export const getProductions = () => async (dispatch) => {
  dispatch({
    type: "GET_PRODUCTIONS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetProductions";

  try {
    let response = await Axios.get(url);
    let getProductionsResp =
      (response && response.data && response.data.UserResponse) || "";
    if (getProductionsResp && getProductionsResp.results.length > 0) {
      if (
        getProductionsResp.results[0] &&
        getProductionsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_PRODUCTIONS_FAIL",
          payload:
            getProductionsResp.results[0].description ||
            "Error While Getting Productions.",
        });
      }
      if (
        getProductionsResp.results[0] &&
        getProductionsResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_PRODUCTIONS_SUCCESS",
          payload: getProductionsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_PRODUCTIONS_FAIL",
        payload: "Error While Getting Productions.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Productions.";
    dispatch({
      type: "GET_PRODUCTIONS_FAIL",
      payload: error,
    });
  }
};
//----****Get LogIn Production****------
export const logInProduction = (productionName) => async (dispatch) => {
  dispatch({
    type: "LOG_IN_PRODUCTION_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let data = {
    actionType: "LoginProduction",
    productionName,
  };
  try {
    let response = await Axios.post(url, data);
    let getLoginProductionResp =
      (response && response.data && response.data.UserResponse) || "";
    if (getLoginProductionResp && getLoginProductionResp.results.length > 0) {
      if (
        getLoginProductionResp.results[0] &&
        getLoginProductionResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "LOG_IN_PRODUCTION_FAIL",
          payload:
            getLoginProductionResp.results[0].description ||
            "Error While Login Production.",
        });
      }
      if (
        getLoginProductionResp.results[0] &&
        getLoginProductionResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "LOG_IN_PRODUCTION_SUCCESS",
          payload: getLoginProductionResp,
        });
      }
    } else {
      dispatch({
        type: "LOG_IN_PRODUCTION_FAIL",
        payload: "Error While Login Production.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Login Production.";
    dispatch({
      type: "LOG_IN_PRODUCTION_FAIL",
      payload: error,
    });
  }
};
//----****Get Accounts Details****--------
export const getAccountDetails = (a) => async (dispatch) => {
  dispatch({
    type: "GET_ACCOUNT_DETAILS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetAccountDetails";
  try {
    let response = await Axios.get(url);

    let getAccountDetailsResp =
      (response && response.data && response.data.UserResponse) || "";
    if (getAccountDetailsResp && getAccountDetailsResp.results.length > 0) {
      if (
        getAccountDetailsResp.results[0] &&
        getAccountDetailsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_ACCOUNT_DETAILS_FAIL",
          payload:
            getAccountDetailsResp.results[0].description ||
            "Error While Getting Account Details.",
        });
      }
      if (
        getAccountDetailsResp.results[0] &&
        getAccountDetailsResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_ACCOUNT_DETAILS_SUCCESS",
          payload: getAccountDetailsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_ACCOUNT_DETAILS_FAIL",
        payload: "Error While Getting Account Details.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Account Details.";
    dispatch({
      type: "GET_ACCOUNT_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----****Update Accounts Details****--------
export const updateAccountDetails = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_ACCOUNT_DETAILS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let userData = {
    actionType: "UpdateAccountDetails",
    accountDetails: {
      ...data,
      signature:
        data.sigType === "Drawn"
          ? data.signature.split(",")[1]
          : data.signature,
      avatar: data.avatar.split(",")[1],
    },
  };

  try {
    let response = await Axios.post(url, userData);
    let updateAccountDetailsResp =
      (response && response.data && response.data.UserResponse) || "";
    if (
      updateAccountDetailsResp &&
      updateAccountDetailsResp.results.length > 0
    ) {
      if (
        updateAccountDetailsResp.results[0] &&
        updateAccountDetailsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_ACCOUNT_DETAILS_FAIL",
          payload:
            updateAccountDetailsResp.results[0].description ||
            "Error While Updating Account Details.",
        });
      }
      if (
        updateAccountDetailsResp.results[0] &&
        updateAccountDetailsResp.results[0].status === "Success"
      ) {
        let obj = {
          updatedData: data,
          updateAccountDetailsResp,
        };
        dispatch({
          type: "UPDATE_ACCOUNT_DETAILS_SUCCESS",
          payload: obj,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_ACCOUNT_DETAILS_FAIL",
        payload: "Error While Updating Account Details.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Account Details.";
    dispatch({
      type: "UPDATE_ACCOUNT_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----****Get Default Values****--------
export const getDefaultValues = () => async (dispatch) => {
  dispatch({
    type: "GET_DEFAULT_VALUES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetDefaultValues";

  try {
    let response = await Axios.get(url);
    let getDefaultValuesResp =
      (response && response.data && response.data.UserResponse) || "";
    if (getDefaultValuesResp && getDefaultValuesResp.results.length > 0) {
      if (
        getDefaultValuesResp.results[0] &&
        getDefaultValuesResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_DEFAULT_VALUES_SUCCESS",
          payload: getDefaultValuesResp,
        });
      } else {
        dispatch({
          type: "GET_DEFAULT_VALUES_FAIL",
          payload:
            getDefaultValuesResp.results[0].description ||
            "Error While Getting Defaults Values.",
        });
      }
    } else {
      dispatch({
        type: "GET_DEFAULT_VALUES_FAIL",
        payload: "Error While Getting Defaults Values.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Defaults Values.";
    dispatch({
      type: "GET_DEFAULT_VALUES_FAIL",
      payload: error,
    });
  }
};
//----****Get SetUserSettings****-----------
export const setUserSettings = (a) => async (dispatch) => {
  dispatch({
    type: "GET_SET_USER_SETTING_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=SetUserSettings";

  try {
    let response = await Axios.get(url);
    let setUserSettingsResp =
      (response && response.data && response.data.UserResponse) || "";
    if (setUserSettingsResp && setUserSettingsResp.results.length > 0) {
      if (
        setUserSettingsResp.results[0] &&
        setUserSettingsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_SET_USER_SETTING_FAIL",
          payload:
            setUserSettingsResp.results[0].description ||
            "Error While Set user Settings.",
        });
      }
      if (
        setUserSettingsResp.results[0] &&
        setUserSettingsResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_SET_USER_SETTING_SUCCESS",
          payload: setUserSettingsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_SET_USER_SETTING_FAIL",
        payload: "Error While Set user Settings.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Set user Settings.";
    dispatch({
      type: "GET_SET_USER_SETTING_FAIL",
      payload: error,
    });
  }
};
//----****Get Help Page****-----------
export const getHelpPage = (a) => async (dispatch) => {
  dispatch({
    type: "GET_HELP_PAGE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetHelpPage";

  try {
    let response = await Axios.get(url);

    let geHelpPageResp =
      (response && response.data && response.data.UserResponse) || "";
    if (geHelpPageResp && geHelpPageResp.results.length > 0) {
      if (
        geHelpPageResp.results[0] &&
        geHelpPageResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_HELP_PAGE_FAIL",
          payload:
            geHelpPageResp.results[0].description ||
            "Error While Getting Help Page.",
        });
      }
      if (
        geHelpPageResp.results[0] &&
        geHelpPageResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_HELP_PAGE_SUCCESS",
          payload: geHelpPageResp,
        });
      }
    } else {
      dispatch({
        type: "GET_HELP_PAGE_FAIL",
        payload: "Error While Getting Help Page.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Help Page.";
    dispatch({
      type: "GET_HELP_PAGE_FAIL",
      payload: error,
    });
  }
};
//----****Get Transaction History****-----------
export const GetTransactionHistory = (a) => async (dispatch) => {
  dispatch({
    type: "GET_TRANSACTION_HISTORY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetTransactionHistory";

  try {
    let response = await Axios.get(url);

    let geTransactionHistoryResp =
      (response && response.data && response.data.UserResponse) || "";
    if (
      geTransactionHistoryResp &&
      geTransactionHistoryResp.results.length > 0
    ) {
      if (
        geTransactionHistoryResp.results[0] &&
        geTransactionHistoryResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_TRANSACTION_HISTORY_FAIL",
          payload:
            geTransactionHistoryResp.results[0].description ||
            "Error While Getting Transaction History.",
        });
      }
      if (
        geTransactionHistoryResp.results[0] &&
        geTransactionHistoryResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_TRANSACTION_HISTORY_SUCCESS",
          payload: geTransactionHistoryResp,
        });
      }
    } else {
      dispatch({
        type: "GET_TRANSACTION_HISTORY_SUCCESS",
        payload: geTransactionHistoryResp,
        // type: "GET_TRANSACTION_HISTORY_FAIL",
        // payload: "Error While Getting Transaction History."
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Transaction History.";
    dispatch({
      type: "GET_TRANSACTION_HISTORY_FAIL",
      payload: error,
    });
  }
};
//----****Get Recent Activity****-----------
export const GetRecentActivity = (a) => async (dispatch) => {
  dispatch({
    type: "GET_RECENT_ACTIVITY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetRecentActivity";

  try {
    let response = await Axios.get(url);

    let geRecentActivityResp =
      (response && response.data && response.data.UserResponse) || "";
    if (geRecentActivityResp && geRecentActivityResp.results.length > 0) {
      if (
        geRecentActivityResp.results[0] &&
        geRecentActivityResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_RECENT_ACTIVITY_FAIL",
          payload:
            geRecentActivityResp.results[0].description ||
            "Error While Getting Recent Activity.",
        });
      }
      if (
        geRecentActivityResp.results[0] &&
        geRecentActivityResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_RECENT_ACTIVITY_SUCCESS",
          payload: geRecentActivityResp,
        });
      }
    } else {
      dispatch({
        type: "GET_RECENT_ACTIVITY_FAIL",
        payload: "Error While Getting Recent Activity.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Recent Activity.";
    dispatch({
      type: "GET_RECENT_ACTIVITY_FAIL",
      payload: error,
    });
  }
};
// ********************User Setups Actions********************
//----****Get Users List****-----------
export const getUsersList = () => async (dispatch) => {
  dispatch({
    type: "GET_USERS_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetUsersList";

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_USERS_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_USERS_LIST_FAIL",
          payload:
            res.results[0].description || "Error While Getting Users List",
        });
      }
    } else {
      dispatch({
        type: "GET_USERS_LIST_FAIL",
        payload: "Error While Getting Users List",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Users List";
    dispatch({
      type: "GET_USERS_LIST_FAIL",
      payload: error,
    });
  }
};
//----****Get User Setup****-----------
export const getUserSetup = (userLogin) => async (dispatch) => {
  dispatch({
    type: "GET_USER_SETUP_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/UserRequest?actionType=GetUserSetup&userLogin=${userLogin}`;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_USER_SETUP_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_USER_SETUP_FAIL",
          payload:
            res.results[0].description || "Error While Getting User Setup.",
        });
      }
    } else {
      dispatch({
        type: "GET_USER_SETUP_FAIL",
        payload: "Error While Getting User Setup.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting User Setup.";
    dispatch({
      type: "GET_USER_SETUP_FAIL",
      payload: error,
    });
  }
};
//----****Update User****-----------
export const updateUser = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let userData = {
    actionType: "UpdateUser",
    ...data,
  };

  try {
    let response = await Axios.post(url, userData);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_USER_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_USER_FAIL",
          payload: res.results[0].description || "Error While Updating User.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload: "Error While Updating User.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating User.";
    dispatch({
      type: "UPDATE_USER_FAIL",
      payload: error,
    });
  }
};
//----****prime User****-----------
export const primeUser = () => async (dispatch) => {
  dispatch({
    type: "PRIME_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let userData = {
    actionType: "PrimeUser",
  };

  try {
    let response = await Axios.post(url, userData);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "PRIME_USER_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "PRIME_USER_FAIL",
          payload: res.results[0].description || "Error While Priming User.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_USER_FAIL",
        payload: "Error While Priming User.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming User.";
    dispatch({
      type: "PRIME_USER_FAIL",
      payload: error,
    });
  }
};
//----****Insert User****-----------
export const insertUser = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let userData = {
    actionType: "InsertUser",
    ...data,
  };

  try {
    let response = await Axios.post(url, userData);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "INSERT_USER_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_USER_FAIL",
          payload: res.results[0].description || "Error While Inserting User.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_USER_FAIL",
        payload: "Error While Inserting User.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting User.";
    dispatch({
      type: "INSERT_USER_FAIL",
      payload: error,
    });
  }
};
//----****delete User****-----------
export const deleteUser = (userLogin) => async (dispatch) => {
  dispatch({
    type: "DELETE_USER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let userData = {
    actionType: "DeleteUser",
    userLogin,
  };

  try {
    let response = await Axios.post(url, userData);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "DELETE_USER_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_USER_FAIL",
          payload: res.results[0].description || "Error While Deleting User.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_USER_FAIL",
        payload: "Error While Deleting User.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting User.";
    dispatch({
      type: "DELETE_USER_FAIL",
      payload: error,
    });
  }
};
//----****Get Advanced List ****-----------
export const getAdvancedList = (userType, userLogin) => async (dispatch) => {
  dispatch({
    type: "GET_ADVANCED_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/UserRequest?actionType=GetAdvancedList&userType=${userType}&userLogin=${userLogin} `;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_ADVANCED_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_ADVANCED_LIST_FAIL",
          payload:
            res.results[0].description || "Error While Getting Advanced List",
        });
      }
    } else {
      dispatch({
        type: "GET_ADVANCED_LIST_FAIL",
        payload: "Error While Getting Advanced List",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Advanced List";
    dispatch({
      type: "GET_ADVANCED_LIST_FAIL",
      payload: error,
    });
  }
};
// **************************END******************************
// **************************Approval Setup APIs********************
//----****Get Approvers List****-----------
export const getApprovers = () => async (dispatch) => {
  dispatch({
    type: "GET_APPROVERS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetApprovers";

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_APPROVERS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_APPROVERS_FAIL",
          payload:
            res.results[0].description || "Error While Getting Approvers.",
        });
      }
    } else {
      dispatch({
        type: "GET_APPROVERS_FAIL",
        payload: "Error While Getting Approvers.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Approvers.";
    dispatch({
      type: "GET_APPROVERS_FAIL",
      payload: error,
    });
  }
};
//----****Get Approval Groups****-----------
export const getApprovalGroups = () => async (dispatch) => {
  dispatch({
    type: "GET_APPROVAL_GROUPS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/UserRequest?actionType=GetApprovalGroups";

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_APPROVAL_GROUPS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_APPROVAL_GROUPS_FAIL",
          payload:
            res.results[0].description ||
            "Error While Getting Approval Groups.",
        });
      }
    } else {
      dispatch({
        type: "GET_APPROVAL_GROUPS_FAIL",
        payload: "Error While Getting Approval Groups.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Approval Groups.";
    dispatch({
      type: "GET_APPROVAL_GROUPS_FAIL",
      payload: error,
    });
  }
};
//----****Get Approval Group****-----------
export const getApprovalGroup = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_APPROVAL_GROUP_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/UserRequest?actionType=GetApprovalGroup&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_APPROVAL_GROUP_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_APPROVAL_GROUP_FAIL",
          payload:
            res.results[0].description || "Error While Getting Approval Group.",
        });
      }
    } else {
      dispatch({
        type: "GET_APPROVAL_GROUP_FAIL",
        payload: "Error While Getting Approval Group.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Approval Group.";
    dispatch({
      type: "GET_APPROVAL_GROUP_FAIL",
      payload: error,
    });
  }
};
//----****Insert Approval Group****-----------
export const insertApprovalGroup = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_APPROVAL_GROUP_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let _data = {
    actionType: "InsertApprovalGroup",
    ...data,
  };

  try {
    let response = await Axios.post(url, _data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "INSERT_APPROVAL_GROUP_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_APPROVAL_GROUP_FAIL",
          payload:
            res.results[0].description ||
            "Error While Inserting Approval Group.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_APPROVAL_GROUP_FAIL",
        payload: "Error While Inserting Approval Group.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Approval Group.";
    dispatch({
      type: "INSERT_APPROVAL_GROUP_FAIL",
      payload: error,
    });
  }
};
//----****Update Approval Group****-----------
export const updateApprovalGroup = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_APPROVAL_GROUP_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let _data = {
    actionType: "UpdateApprovalGroup",
    ...data,
  };

  try {
    let response = await Axios.post(url, _data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_APPROVAL_GROUP_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_APPROVAL_GROUP_FAIL",
          payload:
            res.results[0].description ||
            "Error While Updating Approval Group.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_APPROVAL_GROUP_FAIL",
        payload: "Error While Updating Approval Group.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Approval Group.";
    dispatch({
      type: "UPDATE_APPROVAL_GROUP_FAIL",
      payload: error,
    });
  }
};
//----****Prime Approver****-----------
export const primeApprover = (approverType) => async (dispatch) => {
  dispatch({
    type: "PRIME_APPROVER_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let _data = {
    actionType: "PrimeApprover",
    approverType,
  };

  try {
    let response = await Axios.post(url, _data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "PRIME_APPROVER_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "PRIME_APPROVER_FAIL",
          payload:
            res.results[0].description || "Error While Priming Approver.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_APPROVER_FAIL",
        payload: "Error While Priming Approver.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Approver.";
    dispatch({
      type: "PRIME_APPROVER_FAIL",
      payload: error,
    });
  }
};
//----****Delete Approval Group****-----------
export const deleteApprovalGroup = (recordID) => async (dispatch) => {
  dispatch({
    type: "PRIME_APPROVER_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let _data = {
    actionType: "DeleteApprovalGroup",
    recordID,
  };

  try {
    let response = await Axios.post(url, _data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "DELETE_APPROVAL_GROUP_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_APPROVAL_GROUP_FAIL",
          payload:
            res.results[0].description ||
            "Error While Deleting Approval Group.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_APPROVAL_GROUP_FAIL",
        payload: "Error While Deleting Approval Group.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Approval Group.";
    dispatch({
      type: "DELETE_APPROVAL_GROUP_FAIL",
      payload: error,
    });
  }
};
// **************************END******************************

// *******************User Defaults API's********************
//----****Get User Defaults****-----------
export const getUserDefaults = () => async (dispatch) => {
  dispatch({
    type: "GET_USER_DEFAULTS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/UserRequest?actionType=GetUserDefaults`;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_USER_DEFAULTS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_USER_DEFAULTS_FAIL",
          payload:
            res.results[0].description || "Error While Getting User Defaults.",
        });
      }
    } else {
      dispatch({
        type: "GET_USER_DEFAULTS_FAIL",
        payload: "Error While Getting User Defaults.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting User Defaults.";
    dispatch({
      type: "GET_USER_DEFAULTS_FAIL",
      payload: error,
    });
  }
};
//----****Update User Defaults****-----------
export const updateUserDefaults = (userDefaults) => async (dispatch) => {
  dispatch({
    type: "UPDATE_USER_DEFAULTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let data = {
    actionType: "UpdateUserDefaults",
    userDefaults,
  };

  try {
    let response = await Axios.post(url, data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_USER_DEFAULTS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_USER_DEFAULTS_FAIL",
          payload:
            res.results[0].description || "Error While Updating User Defaults.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_USER_DEFAULTS_FAIL",
        payload: "Error While Updating User Defaults.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating User Defaults.";
    dispatch({
      type: "UPDATE_USER_DEFAULTS_FAIL",
      payload: error,
    });
  }
};
// **************************END******************************

// *******************System Defaults API's********************
//----****Get System Defaults****-----------
export const getSystemDefaults = () => async (dispatch) => {
  dispatch({
    type: "GET_SYSTEM_DEFAULTS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/UserRequest?actionType=GetSystemDefaults`;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_SYSTEM_DEFAULTS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_SYSTEM_DEFAULTS_FAIL",
          payload:
            res.results[0].description ||
            "Error While Getting System Defaults.",
        });
      }
    } else {
      dispatch({
        type: "GET_SYSTEM_DEFAULTS_FAIL",
        payload: "Error While Getting System Defaults.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting System Defaults.";
    dispatch({
      type: "GET_SYSTEM_DEFAULTS_FAIL",
      payload: error,
    });
  }
};
//----****Update System Defaults****-----------
export const updateSystemDefaults = (systemDefaults) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SYSTEM_DEFAULTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let data = {
    actionType: "UpdateSystemDefaults",
    systemDefaults,
  };

  try {
    let response = await Axios.post(url, data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_SYSTEM_DEFAULTS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_SYSTEM_DEFAULTS_FAIL",
          payload:
            res.results[0].description ||
            "Error While Updating System Defaults.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SYSTEM_DEFAULTS_FAIL",
        payload: "Error While Updating System Defaults.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating System Defaults.";
    dispatch({
      type: "UPDATE_SYSTEM_DEFAULTS_FAIL",
      payload: error,
    });
  }
};
//----****Send Invite****-----------
export const sendInvite = (userLogin) => async (dispatch) => {
  dispatch({
    type: "SEND_INVITE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/UserRequest";

  let data = {
    actionType: "SendInvite",
    userLogin,
  };

  try {
    let response = await Axios.post(url, data);

    let res = (response && response.data && response.data.UserResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "SEND_INVITE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "SEND_INVITE_FAIL",
          payload: res.results[0].description || "Error While Sending Invite.",
        });
      }
    } else {
      dispatch({
        type: "SEND_INVITE_FAIL",
        payload: "Error While Sending Invite.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Invite.";
    dispatch({
      type: "SEND_INVITE_FAIL",
      payload: error,
    });
  }
};
// **************************END******************************

//----****Clear User States In Store****-----------
export function clearUserStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_USER_STATES",
    });
  };
}
//----****Clear States After Logout****-----------
export function clearStatesAfterLogout() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_STATES_AFTER_LOGOUT",
    });
  };
}

// ********************User Setups Actions********************

//***************themeColor */
export const updateThemeSetting = (setting) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SETTING",
    payload: setting,
  });
};
