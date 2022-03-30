const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Timecard Actions****-----------------------------

//----------------------****Get Timecard Tallies*****------------------------
export const getTimecardTallies = (data) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_TALLIES_INIT",
  });

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetTimecardTallies`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_TALLIES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_TALLIES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Timecard Tallies.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_TALLIES_FAIL",
        payload: "Error While Getting Timecard Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Timecard Tallies.";
    dispatch({
      type: "GET_TIMECARD_TALLIES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Timecard List*****---------------------------
export const getTimecardList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_LIST_INIT",
  });

  let timecardType = data.type || "";
  let teamTimecards = data.teamTimecard || "N";

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetTimecardList&timecardType=${timecardType}&teamTimecards=${teamTimecards}`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_LIST_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Timecard List.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_LIST_FAIL",
        payload: "Error While Getting Timecard List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Timecard List.";
    dispatch({
      type: "GET_TIMECARD_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Insert Timecard *****----------------------------
export const primeTimecard = (timecard) => async (dispatch) => {
  dispatch({
    type: "PRIME_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "PrimeTimecard",
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "PRIME_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "PRIME_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Priming Timecard.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_TIMECARD_FAIL",
        payload: "Error While Priming Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Timecard.";
    dispatch({
      type: "PRIME_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Insert Timecard *****----------------------------
export const insertTimecard = (timecard) => async (dispatch) => {
  dispatch({
    type: "INSERT_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "InsertTimecard",
    timecard,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "INSERT_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "INSERT_TIMECARD_FAIL",
          payload: resp.result[0].description || "Error While Adding Timecard.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_TIMECARD_FAIL",
        payload: "Error While Adding Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Timecard.";
    dispatch({
      type: "INSERT_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Timecard *****----------------------------
export const updateTimecard = (timecard) => async (dispatch) => {
  dispatch({
    type: "UPDATE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "UpdateTimecard",
    timecard,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "UPDATE_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Updating Timecard.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_TIMECARD_FAIL",
        payload: "Error While Updating Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Timecard.";
    dispatch({
      type: "UPDATE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single Timecard *****------------------------
export const getTimecard = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetTimecard&tran=${trans}`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Timecard.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_FAIL",
        payload: "Error While Getting Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Timecard.";
    dispatch({
      type: "GET_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Timecard Summary *****-----------------------
export const getTimecardSummary = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_SUMMARY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetTimecardSummary&tran=${trans}`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_SUMMARY_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_SUMMARY_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Timecard Summary.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_SUMMARY_FAIL",
        payload: "Error While Getting Timecard Summary.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Timecard Summary.";
    dispatch({
      type: "GET_TIMECARD_SUMMARY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Timecard Summary*****----------------------
export const updateSummary = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SUMMARY_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let obj = {
    actionType: "UpdateSummary",
    timecardSummary: {
      ...data,
    },
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_SUMMARY_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "UPDATE_SUMMARY_FAIL",
          payload:
            resp.result[0].description || "Error While Updating Summary.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SUMMARY_FAIL",
        payload: "Error While Updating Summary.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Summary.";
    dispatch({
      type: "UPDATE_SUMMARY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Timecard *****----------------------------
export const deleteTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "DeleteTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "DELETE_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting Timecard.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_TIMECARD_FAIL",
        payload: "Error While Deleting Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Timecard.";
    dispatch({
      type: "DELETE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Timecard *****------------------------------
export const moveTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "MoveTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "MOVE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "MOVE_TIMECARD_FAIL",
          payload: resp.result[0].description || "Error While Moving Timecard.",
        });
      }
    } else {
      dispatch({
        type: "MOVE_TIMECARD_FAIL",
        payload: "Error While Moving Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Timecard.";
    dispatch({
      type: "MOVE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Devline Timecard *****----------------------------
export const declineTimecard = (obj) => async (dispatch) => {
  dispatch({
    type: "DECLINE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "DeclineTimecard",
    ...obj,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DECLINE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "DECLINE_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Declining Timecard.",
        });
      }
    } else {
      dispatch({
        type: "DECLINE_TIMECARD_FAIL",
        payload: "Error While Declining Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining Timecard.";
    dispatch({
      type: "DECLINE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send for Approval Timecard *****------------------
export const sendForApproval = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_FOR_APPROVAL_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "SendForApproval",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_FOR_APPROVAL_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "SEND_FOR_APPROVAL_TIMECARD_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Sending Timecard For Approval.",
        });
      }
    } else {
      dispatch({
        type: "SEND_FOR_APPROVAL_TIMECARD_FAIL",
        payload: "Error While Sending Timecard For Approval.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Timecard For Approval.";
    dispatch({
      type: "SEND_FOR_APPROVAL_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Hold Timecard *****-------------------------------
export const holdTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "HOLD_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "HoldTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "HOLD_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "HOLD_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Holding Timecard.",
        });
      }
    } else {
      dispatch({
        type: "HOLD_TIMECARD_FAIL",
        payload: "Error While Holding Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Holding Timecard.";
    dispatch({
      type: "HOLD_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Approve Timecard *****-----------------------------
export const approveTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ApproveTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "APPROVE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "APPROVE_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Approving Timecard.",
        });
      }
    } else {
      dispatch({
        type: "APPROVE_TIMECARD_FAIL",
        payload: "Error While Approving Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving Timecard.";
    dispatch({
      type: "APPROVE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Timecard Attachments*****----------------------
export const addAttachment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_TIMECARD_ATTACHMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let obj = {
    actionType: "AddAttachment",
    ...data,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_TIMECARD_ATTACHMENTS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "ADD_TIMECARD_ATTACHMENTS_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Adding Timecard Attachments.",
        });
      }
    } else {
      dispatch({
        type: "ADD_TIMECARD_ATTACHMENTS_FAIL",
        payload: "Error While Adding Timecard Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Timecard Attachments.";
    dispatch({
      type: "ADD_TIMECARD_ATTACHMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Comment *****------------------
export const addComment = (comment) => async (dispatch) => {
  dispatch({
    type: "ADD_TIMECARD_COMMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "AddComment",
    ...comment,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_TIMECARD_COMMENT_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "ADD_TIMECARD_COMMENT_FAIL",
          payload: resp.result[0].description || "Error While Adding Comment.",
        });
      }
    } else {
      dispatch({
        type: "ADD_TIMECARD_COMMENT_FAIL",
        payload: "Error While Adding Comment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Comment.";
    dispatch({
      type: "ADD_TIMECARD_COMMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Timecard Attachments List *****-----------------
export const getAttachmentsList = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_ATTACHMENTS_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetAttachmentsList&tran=${trans}`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_ATTACHMENTS_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_ATTACHMENTS_LIST_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Timecard Attachment List.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_ATTACHMENTS_LIST_FAIL",
        payload: "Error While Getting Timecard Attachment List.",
      });
    }
  } catch (err) {
    const error =
      err.message || "Error While Getting Timecard Attachment List.";
    dispatch({
      type: "GET_TIMECARD_ATTACHMENTS_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Employee List *****-----------------------------
export const getEmployeeList = () => async (dispatch) => {
  dispatch({
    type: "GET_EMPLOYEE_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/TimecardRequest?actionType=GetEmployeeList`;

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EMPLOYEE_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_EMPLOYEE_LIST_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Employee List.",
        });
      }
    } else {
      dispatch({
        type: "GET_EMPLOYEE_LIST_FAIL",
        payload: "Error While Getting Employee List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Employee List.";
    dispatch({
      type: "GET_EMPLOYEE_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Copy Last Weeks Times *****------------------
export const copyLastWeeksTimes = (obj) => async (dispatch) => {
  dispatch({
    type: "COPY_LAST_WEEKS_TIMES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "CopyLastWeeksTimes",
    ...obj,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "COPY_LAST_WEEKS_TIMES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "COPY_LAST_WEEKS_TIMES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Copying Last Weeks Times.",
        });
      }
    } else {
      dispatch({
        type: "COPY_LAST_WEEKS_TIMES_FAIL",
        payload: "Error While Copying Last Weeks Times.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Copying Last Weeks Times.";
    dispatch({
      type: "COPY_LAST_WEEKS_TIMES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Regenerate Timecard *****------------------
export const regenerateTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "REGENERATE_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "RegenerateTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "REGENERATE_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "REGENERATE_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Regenerating Timecard.",
        });
      }
    } else {
      dispatch({
        type: "REGENERATE_TIMECARD_FAIL",
        payload: "Error While Regenerating Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Regenerating Timecard.";
    dispatch({
      type: "REGENERATE_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send Reports *****------------------
export const sendReports = (batchNo) => async (dispatch) => {
  dispatch({
    type: "SEND_REPORTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "SendReports",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_REPORTS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "SEND_REPORTS_FAIL",
          payload: resp.result[0].description || "Error While Sending Report.",
        });
      }
    } else {
      dispatch({
        type: "SEND_REPORTS_FAIL",
        payload: "Error While Sending Report.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Report.";
    dispatch({
      type: "SEND_REPORTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Lock and Invoice *****------------------
export const lockAndInvoice = (batchNo) => async (dispatch) => {
  dispatch({
    type: "LOCK_AND_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "LockAndInvoice",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "LOCK_AND_INVOICE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "LOCK_AND_INVOICE_FAIL",
          payload:
            resp.result[0].description || "Error While Locking and Invoice.",
        });
      }
    } else {
      dispatch({
        type: "LOCK_AND_INVOICE_FAIL",
        payload: "Error While Locking and Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Locking and Invoice.";
    dispatch({
      type: "LOCK_AND_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Create EFT File *****------------------
export const createEFTFile = (batchNo) => async (dispatch) => {
  dispatch({
    type: "CREATE_EFT_FILE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "CreateEFTFile",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "CREATE_EFT_FILE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "CREATE_EFT_FILE_FAIL",
          payload:
            resp.result[0].description || "Error While Creating EFT file.",
        });
      }
    } else {
      dispatch({
        type: "CREATE_EFT_FILE_FAIL",
        payload: "Error While Creating EFT file.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Creating EFT file.";
    dispatch({
      type: "CREATE_EFT_FILE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send Pays Slips *****------------------
export const sendPayslips = (batchNo) => async (dispatch) => {
  dispatch({
    type: "SEND_PAY_SLIPS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "SendPayslips",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_PAY_SLIPS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "SEND_PAY_SLIPS_FAIL",
          payload:
            resp.result[0].description || "Error While Sending Pays Slips.",
        });
      }
    } else {
      dispatch({
        type: "SEND_PAY_SLIPS_FAIL",
        payload: "Error While Sending Pays Slips.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Pays Slips.";
    dispatch({
      type: "SEND_PAY_SLIPS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Post Data *****------------------
export const postData = (batchNo) => async (dispatch) => {
  dispatch({
    type: "POST_DATA_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "PostData",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "POST_DATA_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "POST_DATA_FAIL",
          payload: resp.result[0].description || "Error While Posting Data.",
        });
      }
    } else {
      dispatch({
        type: "POST_DATA_FAIL",
        payload: "Error While Posting Data.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Posting Data.";
    dispatch({
      type: "POST_DATA_FAIL",
      payload: error,
    });
  }
};
//----------------------****Resend STP File *****------------------
export const resendSTPFile = (batchNo, amendment) => async (dispatch) => {
  dispatch({
    type: "RESEND_STP_FILE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ResendSTPFile",
    batchNo,
    amendment,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "RESEND_STP_FILE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "RESEND_STP_FILE_FAIL",
          payload:
            resp.result[0].description || "Error While Resending STP File.",
        });
      }
    } else {
      dispatch({
        type: "RESEND_STP_FILE_FAIL",
        payload: "Error While Resending STP File.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Resending STP File.";
    dispatch({
      type: "RESEND_STP_FILE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send Year End STP File *****------------------
export const sendYearEndSTPFile = (amendment) => async (dispatch) => {
  dispatch({
    type: "SEND_YEAR_END_STP_FILE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "SendYearEndSTPFile",
    amendment,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_YEAR_END_STP_FILE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "SEND_YEAR_END_STP_FILE_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Sending Year End STP File.",
        });
      }
    } else {
      dispatch({
        type: "SEND_YEAR_END_STP_FILE_FAIL",
        payload: "Error While Sending Year End STP File.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Year End STP File.";
    dispatch({
      type: "SEND_YEAR_END_STP_FILE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Batch *****------------------
export const moveBatch = (tran, batchNo) => async (dispatch) => {
  dispatch({
    type: "MOVE_TIMECARD_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "MoveBatch",
    tran,
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "MOVE_TIMECARD_BATCH_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "MOVE_TIMECARD_BATCH_FAIL",
          payload: resp.result[0].description || "Error While Moving Batch.",
        });
      }
    } else {
      dispatch({
        type: "MOVE_TIMECARD_BATCH_FAIL",
        payload: "Error While Moving Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Batch.";
    dispatch({
      type: "MOVE_TIMECARD_BATCH_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Timecard *****------------------
export const exportTimecard = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ExportTimecard",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EXPORT_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Exporting Timecard.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_TIMECARD_FAIL",
        payload: "Error While Exporting Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Timecard.";
    dispatch({
      type: "EXPORT_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Timecard *****------------------
export const importTimecard = (excelData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_TIMECARD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ImportTimecard",
    excelData,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_TIMECARD_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_TIMECARD_FAIL",
          payload:
            resp.result[0].description || "Error While Importing Timecard.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_TIMECARD_FAIL",
        payload: "Error While Importing Timecard.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Timecard.";
    dispatch({
      type: "IMPORT_TIMECARD_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Distribution *****------------------
export const exportDistribution = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_DISTRIBUTION_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ExportDistribution",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EXPORT_DISTRIBUTION_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_DISTRIBUTION_FAIL",
          payload:
            resp.result[0].description || "Error While Exporting Distribution.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_DISTRIBUTION_FAIL",
        payload: "Error While Exporting Distribution.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Distribution.";
    dispatch({
      type: "EXPORT_DISTRIBUTION_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export TPH Payroll *****------------------
export const exportTPHPayroll = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_TPH_PAYROLL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "ExportTPHPayroll",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EXPORT_TPH_PAYROLL_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_TPH_PAYROLL_FAIL",
          payload:
            resp.result[0].description || "Error While Exporting TPH Payroll.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_TPH_PAYROLL_FAIL",
        payload: "Error While Exporting TPH Payroll.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting TPH Payroll.";
    dispatch({
      type: "EXPORT_TPH_PAYROLL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Refresh Employees *****------------------
export const refreshEmployees = () => async (dispatch) => {
  dispatch({
    type: "REFRESH_EMPLOYEES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/TimecardRequest?actionType=RefreshEmployees";

  try {
    let result = await Axios.get(url);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "REFRESH_EMPLOYEES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "REFRESH_EMPLOYEES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Refreshing The Employees.",
        });
      }
    } else {
      dispatch({
        type: "REFRESH_EMPLOYEES_FAIL",
        payload: "Error While Refreshing The Employees.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Refreshing The Employees.";
    dispatch({
      type: "REFRESH_EMPLOYEES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Timecard Attachment *****----------------------
export const getAttachment = (data) => async (dispatch) => {
  dispatch({
    type: "GET_TIMECARD_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let obj = {
    actionType: "GetAttachment",
    recordID: data,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_TIMECARD_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_TIMECARD_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While fetching Timecard Attachment.",
        });
      }
    } else {
      dispatch({
        type: "GET_TIMECARD_ATTACHMENT_FAIL",
        payload: "Error While fetching Timecard Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While fetching Timecard Attachment.";
    dispatch({
      type: "GET_TIMECARD_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Delete Attachment *****----------------------------
export const deleteAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_TIMECARD_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "DeleteAttachment",
    recordID,
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_TIMECARD_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "DELETE_TIMECARD_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting Attachment.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_TIMECARD_ATTACHMENT_FAIL",
        payload: "Error While Deleting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Attachment.";
    dispatch({
      type: "DELETE_TIMECARD_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Tax Balance *****----------------------------
export const taxBalance = (data) => async (dispatch) => {
  dispatch({
    type: "TAX_BALANCE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let data = {
    actionType: "TaxBalance",
  };

  try {
    let result = await Axios.post(url, data);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "TAX_BALANCE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "TAX_BALANCE_FAIL",
          payload: resp.result[0].description || "Error in tax balance",
        });
      }
    } else {
      dispatch({
        type: "TAX_BALANCE_FAIL",
        payload: "Error in tax balance",
      });
    }
  } catch (err) {
    const error = err.message || "Error in tax balance";
    dispatch({
      type: "TAX_BALANCE_FAIL",
      payload: error,
    });
  }
};

//----------------------****Calculate Day*****----------------------
export const calculateDay = (data) => async (dispatch) => {
  dispatch({
    type: "CALCULATE_DAY_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/TimecardRequest";
  let obj = {
    actionType: "CalculateDay",
    ...data,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.TimecardResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "CALCULATE_DAY_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "CALCULATE_DAY_FAIL",
          payload: resp.result[0].description || "Error While Calculating Day.",
        });
      }
    } else {
      dispatch({
        type: "CALCULATE_DAY_FAIL",
        payload: "Error While Calculating Day.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Calculating Day.";
    dispatch({
      type: "CALCULATE_DAY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear Timecard states****---------------------------
export function clearTimecardStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_TIMECARD_STATES",
    });
  };
}
