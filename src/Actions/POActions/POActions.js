const Axios = require("axios");
Axios.defaults.withCredentials = true;

// ---------------------****PO Actions****-----------------------------

//---------------****GetPOTallies****----------------------------------
export const getPOTallies = () => async (dispatch) => {
  dispatch({
    type: "GET_PO_TALLIES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/PORequest?actionType=GetPOTallies";

  try {
    let response = await Axios.get(url);
    let getPOTallies =
      (response && response.data && response.data.POResponse) || "";
    if (getPOTallies && getPOTallies.results.length > 0) {
      if (
        getPOTallies.results[0] &&
        getPOTallies.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_PO_TALLIES_FAIL",
          payload:
            getPOTallies.results[0].description ||
            "Error While Getting PO Tallies.",
        });
      }
      if (
        getPOTallies.results[0] &&
        getPOTallies.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_PO_TALLIES_SUCCESS",
          payload: getPOTallies,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_TALLIES_FAIL",
        payload: "Error While Getting PO Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Tallies.";
    dispatch({
      type: "GET_PO_TALLIES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO List*****---------------------------
export const getPOList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_PO_LIST_INIT",
  });
  let type = data.type || "";
  let teamOrders = data.teamOrders || "";

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOList&poType=${type}&teamOrders=${teamOrders}`;

  try {
    let response = await Axios.get(url);
    let getPOListResp =
      (response && response.data && response.data.POResponse) || "";
    if (getPOListResp && getPOListResp.results.length > 0) {
      if (
        getPOListResp.results[0] &&
        getPOListResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_PO_LIST_FAIL",
          payload:
            getPOListResp.results[0].description ||
            "Error While Getting PO List.",
        });
      }
      if (
        getPOListResp.results[0] &&
        getPOListResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_PO_LIST_SUCCESS",
          payload: getPOListResp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_LIST_FAIL",
        payload: "Error While Getting PO List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO List.";
    dispatch({
      type: "GET_PO_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get New PO List*****---------------------------
export const getNewPOList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_NEW_PO_LIST_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "GetNewPOList",
    ...data,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_NEW_PO_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_NEW_PO_LIST_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO List.",
        });
      }
    } else {
      dispatch({
        type: "GET_NEW_PO_LIST_FAIL",
        payload: "Error While Getting PO List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO List.";
    dispatch({
      type: "GET_NEW_PO_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single PO *****------------------------
export const getPO = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPO&tran=${trans}&fileType=Image`;

  try {
    let response = await Axios.get(url);
    let getPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (getPOResp && getPOResp.results.length > 0) {
      if (getPOResp.results[0] && getPOResp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_FAIL",
          payload:
            getPOResp.results[0].description || "Error While Getting PO.",
        });
      }
      if (getPOResp.results[0] && getPOResp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_SUCCESS",
          payload: getPOResp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_FAIL",
        payload: "Error While Getting PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO.";
    dispatch({
      type: "GET_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Preview *****-----------------------
export const getPOPreview = (trans, poType) => async (dispatch) => {
  dispatch({
    type: "GET_PO_PREVIEW_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOPreview&tran=${trans}&fileType=Image&poType=${poType}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_PREVIEW_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Preview.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_PREVIEW_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_PREVIEW_FAIL",
        payload: "Error While Getting PO Preview.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Preview.";
    dispatch({
      type: "GET_PO_PREVIEW_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Summary *****-----------------------
export const getPOSummary = (trans, poType) => async (dispatch) => {
  dispatch({
    type: "GET_PO_SUMMARY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOSummary&tran=${trans}&poType=${poType}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_SUMMARY_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Summary.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_SUMMARY_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_SUMMARY_FAIL",
        payload: "Error While Getting PO Summary.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Summary.";
    dispatch({
      type: "GET_PO_SUMMARY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Company *****-----------------------
export const getPOCompany = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_COMPANY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOCompany&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_COMPANY_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Company.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_COMPANY_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_COMPANY_FAIL",
        payload: "Error While Getting PO Company.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Company.";
    dispatch({
      type: "GET_PO_COMPANY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO Company *****--------------------
export const updatePOCompany = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_COMPANY_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdatePOCompany",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PO_COMPANY_FAIL",
          payload:
            resp.results[0].description || "Error While Updating PO Company.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.companyID = data.companyID || "";
        dispatch({
          type: "UPDATE_PO_COMPANY_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_COMPANY_FAIL",
        payload: "Error While Updating PO Company.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO Company.";
    dispatch({
      type: "UPDATE_PO_COMPANY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO Reference*****-------------------
export const updatePOReference = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_REFERENCE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdatePOReference",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PO_REFERENCE_FAIL",
          payload:
            resp.results[0].description || "Error While Updating PO Reference.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.poNumber = data.poNumber || "";

        dispatch({
          type: "UPDATE_PO_REFERENCE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_REFERENCE_FAIL",
        payload: "Error While Updating PO Reference.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO Reference.";
    dispatch({
      type: "UPDATE_PO_REFERENCE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Supplier *****----------------------
export const getPOSupplier = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_SUPPLIER_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOSupplier&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_SUPPLIER_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Supplier.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_SUPPLIER_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_SUPPLIER_FAIL",
        payload: "Error While Getting PO Supplier.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Supplier.";
    dispatch({
      type: "GET_PO_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO Supplier *****-------------------
export const updatePOSupplier = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdatePOSupplier",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PO_SUPPLIER_FAIL",
          payload:
            resp.results[0].description || "Error While Updating PO Supplier.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_PO_SUPPLIER_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_SUPPLIER_FAIL",
        payload: "Error While Updating PO Supplier.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO Supplier.";
    dispatch({
      type: "UPDATE_PO_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Special Condition *****-------------
export const updateSpecialConditions = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SPECIAL_CONDITION_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdateSpecialConditions",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_SPECIAL_CONDITION_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Updating Special Condition.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.specialConditions = data.specialConditions || "";

        dispatch({
          type: "UPDATE_SPECIAL_CONDITION_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SPECIAL_CONDITION_FAIL",
        payload: "Error While Updating Special Condition.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Special Condition.";
    dispatch({
      type: "UPDATE_SPECIAL_CONDITION_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Requested *****---------------------
export const updateRequested = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_REQUESTED_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdateRequested",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_REQUESTED_FAIL",
          payload:
            resp.results[0].description || "Error While Updating Requested.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.requestedDepartment = data.department;
        resp.requestedBy = data.requestedBy;
        dispatch({
          type: "UPDATE_REQUESTED_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_REQUESTED_FAIL",
        payload: "Error While Updating Requested.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Requested.";
    dispatch({
      type: "UPDATE_REQUESTED_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Lines *****-------------------------
export const getPOLines = (trans, poType) => async (dispatch) => {
  dispatch({
    type: "GET_PO_LINES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOLines&tran=${trans}&poType=${poType}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_LINES_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Lines.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_LINES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_LINES_FAIL",
        payload: "Error While Getting PO Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Lines.";
    dispatch({
      type: "GET_PO_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO Lines *****----------------------
export const updatePOLines = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdatePOLines",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);

    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PO_LINES_FAIL",
          payload:
            resp.results[0].description || "Error While Updating PO Lines.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp = { ...resp, ...data };
        dispatch({
          type: "UPDATE_PO_LINES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_LINES_FAIL",
        payload: "Error While Updating PO Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO Lines.";
    dispatch({
      type: "UPDATE_PO_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO Amounts*****---------------------
export const updatePOAmounts = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_AMOUNTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdatePOAmounts",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PO_AMOUNTS_FAIL",
          payload:
            resp.results[0].description || "Error While Updating PO Amount.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.grossTotal = data.grossAmount || 0;
        resp.taxTotal = data.taxAmount || 0;

        dispatch({
          type: "UPDATE_PO_AMOUNTS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_AMOUNTS_FAIL",
        payload: "Error While Updating PO Amount.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO Amount.";
    dispatch({
      type: "UPDATE_PO_AMOUNTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Approval Group *****----------------
export const updateApprovalGroup = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_APPROVAL_GROUP_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "UpdateApprovalGroup",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_APPROVAL_GROUP_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Updating Approval Group.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        resp.approvalGroup = data.approvalGroup;
        dispatch({
          type: "UPDATE_APPROVAL_GROUP_SUCCESS",
          payload: resp,
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
//----------------------****Get PO Changes *****-----------------------
export const getPOChanges = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_CHANGES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOChanges&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_CHANGES_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Changes.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_CHANGES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_CHANGES_FAIL",
        payload: "Error While Getting PO Changes.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Changes.";
    dispatch({
      type: "GET_PO_CHANGES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Log *****---------------------------
export const getPOLog = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_LOG_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOLog&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_LOG_FAIL",
          payload: resp.results[0].description || "Error While Getting PO Log.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_LOG_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_LOG_FAIL",
        payload: "Error While Getting PO Log.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Log.";
    dispatch({
      type: "GET_PO_LOG_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Activity *****----------------------
export const getPOActivity = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_PO_ACTIVITY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOActivity&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_PO_ACTIVITY_FAIL",
          payload:
            resp.results[0].description || "Error While Getting PO Activity.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_PO_ACTIVITY_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_ACTIVITY_FAIL",
        payload: "Error While Getting PO Activity.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Activity.";
    dispatch({
      type: "GET_PO_ACTIVITY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Search POs****-----------------------------
export const searchPOs = (data) => async (dispatch) => {
  dispatch({
    type: "SEARCH_POs_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "SearchPOs",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let searchPOResponse =
      (response && response.data && response.data.POResponse) || "";
    if (searchPOResponse && searchPOResponse.results.length > 0) {
      if (
        searchPOResponse.results[0] &&
        searchPOResponse.results[0].status === "Failed"
      ) {
        dispatch({
          type: "SEARCH_POs_FAIL",
          payload:
            searchPOResponse.results[0].description ||
            "Error While Searching POs.",
        });
      }
      if (
        searchPOResponse.results[0] &&
        searchPOResponse.results[0].status === "Success"
      ) {
        dispatch({
          type: "SEARCH_POs_SUCCESS",
          payload: searchPOResponse,
        });
      }
    } else {
      dispatch({
        type: "SEARCH_POs_FAIL",
        payload: "Error While Searching POs.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Searching POs.";
    dispatch({
      type: "SEARCH_POs_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Comment****----------------------------
export const addComment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_PO_COMMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "AddComment",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let addCommentResp =
      (response && response.data && response.data.POResponse) || "";
    if (addCommentResp && addCommentResp.results.length > 0) {
      if (
        addCommentResp.results[0] &&
        addCommentResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_PO_COMMENT_FAIL",
          payload:
            addCommentResp.results[0].description || "Error While Commenting.",
        });
      }
      if (
        addCommentResp.results[0] &&
        addCommentResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_PO_COMMENT_SUCCESS",
          payload: addCommentResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_PO_COMMENT_FAIL",
        payload: "Error While Commenting.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Commenting.";
    dispatch({
      type: "ADD_PO_COMMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add PO Attachments*****--------------------
export const addPoAttachments = (attachment) => async (dispatch) => {
  dispatch({
    type: "ADD_PO_ATTACHMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "AddPOAttachment",
    ...attachment,
  };

  try {
    let response = await Axios.post(url, data);
    let addPOAttachmentResp =
      (response && response.data && response.data.POResponse) || "";
    if (addPOAttachmentResp && addPOAttachmentResp.results.length > 0) {
      if (
        addPOAttachmentResp.results[0] &&
        addPOAttachmentResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_PO_ATTACHMENTS_FAIL",
          payload:
            addPOAttachmentResp.results[0].description ||
            "Error While Uploading Attachments.",
        });
      }
      if (
        addPOAttachmentResp.results[0] &&
        addPOAttachmentResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_PO_ATTACHMENTS_SUCCESS",
          payload: addPOAttachmentResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_PO_ATTACHMENTS_FAIL",
        payload: "Error While Uploading Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Uploading Attachments.";
    dispatch({
      type: "ADD_PO_ATTACHMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add PO Attachment Lists*****---------------
export const addPoAttachmentLists = (list) => async (dispatch) => {
  dispatch({
    type: "ADD_PO_ATTACHMENT_LISTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "AddPOAttachmentsList",
    ...list,
  };

  try {
    let response = await Axios.post(url, data);
    let addPOAttachmentListsResp =
      (response && response.data && response.data.POResponse) || "";
    if (
      addPOAttachmentListsResp &&
      addPOAttachmentListsResp.results.length > 0
    ) {
      if (
        addPOAttachmentListsResp.results[0] &&
        addPOAttachmentListsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_PO_ATTACHMENT_LISTS_FAIL",
          payload:
            addPOAttachmentListsResp.results[0].description ||
            "Error While Uploading Attachments.",
        });
      }
      if (
        addPOAttachmentListsResp.results[0] &&
        addPOAttachmentListsResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_PO_ATTACHMENT_LISTS_SUCCESS",
          payload: addPOAttachmentListsResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_PO_ATTACHMENT_LISTS_FAIL",
        payload: "Error While Uploading Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Uploading Attachments.";
    dispatch({
      type: "ADD_PO_ATTACHMENT_LISTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Attachment*****---------------------
export const getPOAttachment = (trans, recordID) => async (dispatch) => {
  dispatch({
    type: "GET_PO_ATTACHMENT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetPOAttachment&tran=${trans}&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);
    let getPOAtchResp =
      (response && response.data && response.data.POResponse) || "";
    if (getPOAtchResp && getPOAtchResp.results.length > 0) {
      if (
        getPOAtchResp.results[0] &&
        getPOAtchResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_PO_ATTACHMENT_FAIL",
          payload:
            getPOAtchResp.results[0].description ||
            "Error While Getting PO Attachemnt.",
        });
      }
      if (
        getPOAtchResp.results[0] &&
        getPOAtchResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_PO_ATTACHMENT_SUCCESS",
          payload: getPOAtchResp,
        });
      }
    } else {
      dispatch({
        type: "GET_PO_ATTACHMENT_FAIL",
        payload: "Error While Getting PO Attachemnt.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting PO Attachemnt.";
    dispatch({
      type: "GET_PO_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete PO Attachment*****------------------
export const deletePOAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_PO_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "DeletePOAttachment",
    recordID,
  };
  try {
    let response = await Axios.post(url, data);
    let deletePOAtchResp =
      (response && response.data && response.data.POResponse) || "";
    if (deletePOAtchResp && deletePOAtchResp.results.length > 0) {
      if (
        deletePOAtchResp.results[0] &&
        deletePOAtchResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DELETE_PO_ATTACHMENT_FAIL",
          payload:
            deletePOAtchResp.results[0].description ||
            "Error While Deleting PO Attachemnt.",
        });
      }
      if (
        deletePOAtchResp.results[0] &&
        deletePOAtchResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_PO_ATTACHMENT_SUCCESS",
          payload: deletePOAtchResp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_PO_ATTACHMENT_FAIL",
        payload: "Error While Deleting PO Attachemnt.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting PO Attachemnt.";
    dispatch({
      type: "DELETE_PO_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete PO *****----------------------------
export const deletePO = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "DeletePO",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let deletePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (deletePOResp && deletePOResp.results.length > 0) {
      if (
        deletePOResp.results[0] &&
        deletePOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DELETE_PO_FAIL",
          payload:
            deletePOResp.results[0].description || "Error While Deleting PO.",
        });
      }
      if (
        deletePOResp.results[0] &&
        deletePOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_PO_SUCCESS",
          payload: deletePOResp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_PO_FAIL",
        payload: "Error While Deleting PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting PO.";
    dispatch({
      type: "DELETE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Copy PO *****-----------------------------
export const copyPO = (tran, poType) => async (dispatch) => {
  dispatch({
    type: "COPY_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "CopyPO",
    tran,
    poType,
  };

  try {
    let response = await Axios.post(url, data);
    let copyPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (copyPOResp && copyPOResp.results.length > 0) {
      if (copyPOResp.results[0] && copyPOResp.results[0].status === "Failed") {
        dispatch({
          type: "COPY_PO_FAIL",
          payload:
            copyPOResp.results[0].description || "Error While Copying PO.",
        });
      }
      if (copyPOResp.results[0] && copyPOResp.results[0].status === "Success") {
        dispatch({
          type: "COPY_PO_SUCCESS",
          payload: copyPOResp,
        });
      }
    } else {
      dispatch({
        type: "COPY_PO_FAIL",
        payload: "Error While Copying PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Copying PO.";
    dispatch({
      type: "COPY_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move PO*****-----------------------------
export const movePO = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "MovePO",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let movePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (movePOResp && movePOResp.results.length > 0) {
      if (movePOResp.results[0] && movePOResp.results[0].status === "Failed") {
        dispatch({
          type: "MOVE_PO_FAIL",
          payload:
            movePOResp.results[0].description || "Error While Moving PO.",
        });
      }
      if (movePOResp.results[0] && movePOResp.results[0].status === "Success") {
        dispatch({
          type: "MOVE_PO_SUCCESS",
          payload: movePOResp,
        });
      }
    } else {
      dispatch({
        type: "MOVE_PO_FAIL",
        payload: "Error While Moving PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving PO.";
    dispatch({
      type: "MOVE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send For Approval PO*****------------------
export const sendForApprovalPO = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_FOR_APPROVAL_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "SendForApproval",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let sendForApprovalPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (sendForApprovalPOResp && sendForApprovalPOResp.results.length > 0) {
      if (
        sendForApprovalPOResp.results[0] &&
        sendForApprovalPOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "SEND_FOR_APPROVAL_PO_FAIL",
          payload:
            sendForApprovalPOResp.results[0].description ||
            "Error While Sending For Approval PO.",
        });
      }
      if (
        sendForApprovalPOResp.results[0] &&
        sendForApprovalPOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "SEND_FOR_APPROVAL_PO_SUCCESS",
          payload: sendForApprovalPOResp,
        });
      }
    } else {
      dispatch({
        type: "SEND_FOR_APPROVAL_PO_FAIL",
        payload: "Error While Sending For Approval PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending For Approval PO.";
    dispatch({
      type: "SEND_FOR_APPROVAL_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Approve PO *****---------------------------
export const approvePO = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ApprovePO",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let approvePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (approvePOResp && approvePOResp.results.length > 0) {
      if (
        approvePOResp.results[0] &&
        approvePOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "APPROVE_PO_FAIL",
          payload:
            approvePOResp.results[0].description || "Error While Approving PO.",
        });
      }
      if (
        approvePOResp.results[0] &&
        approvePOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "APPROVE_PO_SUCCESS",
          payload: approvePOResp,
        });
      }
    } else {
      dispatch({
        type: "APPROVE_PO_FAIL",
        payload: "Error While Approving PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving PO.";
    dispatch({
      type: "APPROVE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Close PO *****-----------------------------
export const closePO = (tran, comment) => async (dispatch) => {
  dispatch({
    type: "CLOSE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ClosePO",
    tran,
    comment,
  };

  try {
    let response = await Axios.post(url, data);
    let closePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (closePOResp && closePOResp.results.length > 0) {
      if (
        closePOResp.results[0] &&
        closePOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "CLOSE_PO_FAIL",
          payload:
            closePOResp.results[0].description || "Error While Closing PO.",
        });
      }
      if (
        closePOResp.results[0] &&
        closePOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "CLOSE_PO_SUCCESS",
          payload: closePOResp,
        });
      }
    } else {
      dispatch({
        type: "CLOSE_PO_FAIL",
        payload: "Error While Closing PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Closing PO.";
    dispatch({
      type: "CLOSE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Decline PO *****---------------------------
export const declinePO = (tran, comment) => async (dispatch) => {
  dispatch({
    type: "DECLINE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "DeclinePO",
    tran,
    comment,
  };

  try {
    let response = await Axios.post(url, data);
    let declinePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (declinePOResp && declinePOResp.results.length > 0) {
      if (
        declinePOResp.results[0] &&
        declinePOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DECLINE_PO_FAIL",
          payload:
            declinePOResp.results[0].description || "Error While Declining PO.",
        });
      }
      if (
        declinePOResp.results[0] &&
        declinePOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DECLINE_PO_SUCCESS",
          payload: declinePOResp,
        });
      }
    } else {
      dispatch({
        type: "DECLINE_PO_FAIL",
        payload: "Error While Declining PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining PO.";
    dispatch({
      type: "DECLINE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Hold PO *****-----------------------------
export const holdPO = (tran) => async (dispatch) => {
  dispatch({
    type: "HOLD_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "HoldPO",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let holdPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (holdPOResp && holdPOResp.results.length > 0) {
      if (holdPOResp.results[0] && holdPOResp.results[0].status === "Failed") {
        dispatch({
          type: "HOLD_PO_FAIL",
          payload:
            holdPOResp.results[0].description || "Error While Holding PO.",
        });
      }
      if (holdPOResp.results[0] && holdPOResp.results[0].status === "Success") {
        dispatch({
          type: "HOLD_PO_SUCCESS",
          payload: holdPOResp,
        });
      }
    } else {
      dispatch({
        type: "HOLD_PO_FAIL",
        payload: "Error While Holding PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Holding PO.";
    dispatch({
      type: "HOLD_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Modify PO *****----------------------------
export const modifyPO = (tran) => async (dispatch) => {
  dispatch({
    type: "MODIFY_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ModifyPO",
    tran,
    modify: "N",
  };

  try {
    let response = await Axios.post(url, data);
    let modifyPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (modifyPOResp && modifyPOResp.results.length > 0) {
      if (
        modifyPOResp.results[0] &&
        modifyPOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "MODIFY_PO_FAIL",
          payload:
            modifyPOResp.results[0].description || "Error While Modify PO.",
        });
      }
      if (
        modifyPOResp.results[0] &&
        modifyPOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "MODIFY_PO_SUCCESS",
          payload: modifyPOResp,
        });
      }
    } else {
      dispatch({
        type: "MODIFY_PO_FAIL",
        payload: "Error While Modify PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Modify PO.";
    dispatch({
      type: "MODIFY_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update PO *****----------------------------
export const updatePO = (tran, POData) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "UpdatePO",
    tran,
    poDetails: {
      ...POData,
    },
  };

  try {
    let response = await Axios.post(url, data);
    let updatePOResp =
      (response && response.data && response.data.POResponse) || "";
    if (updatePOResp && updatePOResp.results.length > 0) {
      if (
        updatePOResp.results[0] &&
        updatePOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_PO_FAIL",
          payload:
            updatePOResp.results[0].description || "Error While Updating PO.",
        });
      }
      if (
        updatePOResp.results[0] &&
        updatePOResp.results[0].status === "Success"
      ) {
        let obj = {
          message: updatePOResp.results[0].description,
          updatedPO: data,
        };
        dispatch({
          type: "UPDATE_PO_SUCCESS",
          payload: obj,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PO_FAIL",
        payload: "Error While Updating PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating PO.";
    dispatch({
      type: "UPDATE_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Insert PO *****----------------------------
export const insertPO = (POData) => async (dispatch) => {
  dispatch({
    type: "INSERT_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "InsertPO",
    // poDetails: {
    //   ...POData
    // }
  };

  try {
    let response = await Axios.post(url, data);
    let insertPOResp =
      (response && response.data && response.data.POResponse) || "";
    if (insertPOResp && insertPOResp.results.length > 0) {
      if (
        insertPOResp.results[0] &&
        insertPOResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "INSERT_PO_FAIL",
          payload:
            insertPOResp.results[0].description || "Error While Adding PO.",
        });
      }
      if (
        insertPOResp.results[0] &&
        insertPOResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "INSERT_PO_SUCCESS",
          payload: insertPOResp,
        });
      }
    } else {
      dispatch({
        type: "INSERT_PO_FAIL",
        payload: "Error While Adding PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding PO.";
    dispatch({
      type: "INSERT_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Quote *****----------------------------
export const getQuote = (supplier, quote, tran) => async (dispatch) => {
  dispatch({
    type: "GET_QUOTE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/PORequest?actionType=GetQuote&supplier=${supplier}&quote=${quote}&tran=${tran}`;

  try {
    let response = await Axios.get(url);
    let getQuoteResp =
      (response && response.data && response.data.POResponse) || "";
    if (getQuoteResp && getQuoteResp.results.length > 0) {
      if (
        getQuoteResp.results[0] &&
        getQuoteResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_QUOTE_FAIL",
          payload:
            getQuoteResp.results[0].description || "Error While Getting Quote.",
        });
      }
      if (
        getQuoteResp.results[0] &&
        getQuoteResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_QUOTE_SUCCESS",
          payload: getQuoteResp,
        });
      }
    } else {
      dispatch({
        type: "GET_QUOTE_FAIL",
        payload: "Error While Getting Quote.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Quote.";
    dispatch({
      type: "GET_QUOTE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get PO Transfer List*****------------------
export const getTransferList =
  (supplier, zeroLines, allSuppliers) => async (dispatch) => {
    dispatch({
      type: "GET_TRANSFER_LIST_INIT",
    });
    let zero = zeroLines ? "Y" : "N";
    let allSup = allSuppliers ? "Y" : "N";
    const url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/PORequest?actionType=GetTransferList&supplier=${supplier}&zeroLines=${zero}&allSuppliers=${allSup}`;

    try {
      let response = await Axios.get(url);
      let getTransferListResp =
        (response && response.data && response.data.POResponse) || "";
      if (getTransferListResp && getTransferListResp.results.length > 0) {
        if (
          getTransferListResp.results[0] &&
          getTransferListResp.results[0].status === "Failed"
        ) {
          dispatch({
            type: "GET_TRANSFER_LIST_FAIL",
            payload:
              getTransferListResp.results[0].description ||
              "Error While Getting Transfer List.",
          });
        }
        if (
          getTransferListResp.results[0] &&
          getTransferListResp.results[0].status === "Success"
        ) {
          dispatch({
            type: "GET_TRANSFER_LIST_SUCCESS",
            payload: getTransferListResp,
          });
        }
      } else {
        dispatch({
          type: "GET_TRANSFER_LIST_FAIL",
          payload: "Error While Getting Transfer List.",
        });
      }
    } catch (err) {
      const error = err.message || "Error While Getting Transfer List.";
      dispatch({
        type: "GET_TRANSFER_LIST_FAIL",
        payload: error,
      });
    }
  };
//----------------------****Import PO Lines*****-----------------------
export const importPOLines = (excelData, tran) => async (dispatch) => {
  dispatch({
    type: "IMPORT_PO_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";

  let data = {
    actionType: "ImportPOLines",
    tran,
    excelData,
  };

  try {
    let response = await Axios.post(url, data);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "IMPORT_PO_LINES_FAIL",
          payload:
            resp.results[0].description || "Error While Importing PO Lines.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "IMPORT_PO_LINES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "IMPORT_PO_LINES_FAIL",
        payload: "Error While Importing PO Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing PO Lines.";
    dispatch({
      type: "IMPORT_PO_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export PO Lines*****-----------------------
export const exportPOLines = (poLines) => async (dispatch) => {
  dispatch({
    type: "EXPORT_PO_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ExportPOLines",
    poLines,
  };

  try {
    let response = await Axios.post(url, data);
    let exportPOLinesesp =
      (response && response.data && response.data.POResponse) || "";
    if (exportPOLinesesp && exportPOLinesesp.results.length > 0) {
      if (
        exportPOLinesesp.results[0] &&
        exportPOLinesesp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "EXPORT_PO_LINES_FAIL",
          payload:
            exportPOLinesesp.results[0].description ||
            "Error While Exporting PO Lines.",
        });
      }
      if (
        exportPOLinesesp.results[0] &&
        exportPOLinesesp.results[0].status === "Success"
      ) {
        dispatch({
          type: "EXPORT_PO_LINES_SUCCESS",
          payload: exportPOLinesesp,
        });
      }
    } else {
      dispatch({
        type: "EXPORT_PO_LINES_FAIL",
        payload: "Error While Exporting PO Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting PO Lines.";
    dispatch({
      type: "EXPORT_PO_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export PO*****----------------------------
export const PSLExport = (tran) => async (dispatch) => {
  dispatch({
    type: "PSL_EXPORT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "PSLExport",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "PSL_EXPORT_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "PSL_EXPORT_FAIL",
          payload: resp.results[0].description || "Error While PSL Exporting.",
        });
      }
    } else {
      dispatch({
        type: "PSL_EXPORT_FAIL",
        payload: "Error While PSL Exporting.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While PSL Exporting.";
    dispatch({
      type: "PSL_EXPORT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export PO*****----------------------------
export const exportPO = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ExportPO",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_PO_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_PO_FAIL",
          payload: resp.results[0].description || "Error While Exporting PO.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_PO_FAIL",
        payload: "Error While Exporting PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting PO.";
    dispatch({
      type: "EXPORT_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import PO*****----------------------------
export const importPO = (excelData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let data = {
    actionType: "ImportPO",
    excelData,
  };

  try {
    let response = await Axios.post(url, data);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "IMPORT_PO_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_PO_FAIL",
          payload: resp.results[0].description || "Error While Importing PO.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_PO_FAIL",
        payload: "Error While Importing PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing PO.";
    dispatch({
      type: "IMPORT_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Post PO*****------------------------------
export const postPO = (data) => async (dispatch) => {
  dispatch({
    type: "POST_PO_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/PORequest";
  let obj = {
    actionType: "PostPO",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp = (response && response.data && response.data.POResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "POST_PO_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "POST_PO_FAIL",
          payload: resp.results[0].description || "Error While Posting PO.",
        });
      }
    } else {
      dispatch({
        type: "POST_PO_FAIL",
        payload: "Error While Posting PO.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Posting PO.";
    dispatch({
      type: "POST_PO_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear PO states****-----------------------
export function clearPOStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_PO_STATES",
    });
  };
}
