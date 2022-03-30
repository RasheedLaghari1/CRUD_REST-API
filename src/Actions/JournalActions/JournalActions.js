const Axios = require("axios");
Axios.defaults.withCredentials = true;

//----------------------****Get Journal Tallies*****---------------------------
export const getJournalTallies = (data) => async (dispatch) => {
  dispatch({
    type: "GET_JOURNAL_TALLIES_INIT",
  });

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/JournalRequest?actionType=GetJournalTallies`;

  try {
    let result = await Axios.get(url);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {

      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_JOURNAL_TALLIES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_JOURNAL_TALLIES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Journal Tallies.",
        });
      }
    } else {
      dispatch({
        type: "GET_JOURNAL_TALLIES_FAIL",
        payload: "Error While Getting Journal Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Journal Tallies.";
    dispatch({
      type: "GET_JOURNAL_TALLIES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Journal List*****---------------------------
export const getJournalsList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_JOURNAL_LIST_INIT",
  });

  let journalType = data.type || "";
  let teamJournals = data.teamJournals || "N";

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/JournalRequest?actionType=GetJournalsList&journalType=${journalType}&teamJournals=${teamJournals}`;

  try {
    let result = await Axios.get(url);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {

      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_JOURNAL_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_JOURNAL_LIST_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Journal List.",
        });
      }
    } else {
      dispatch({
        type: "GET_JOURNAL_LIST_FAIL",
        payload: "Error While Getting Journal List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Journal List.";
    dispatch({
      type: "GET_JOURNAL_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single Journal *****------------------------
export const getJournal = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_JOURNAL_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/JournalRequest?actionType=GetJournal&tran=${trans}`;

  try {
    let result = await Axios.get(url);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {

      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_JOURNAL_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_JOURNAL_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Journal.",
        });
      }
    } else {
      dispatch({
        type: "GET_JOURNAL_FAIL",
        payload: "Error While Getting Journal.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Journal.";
    dispatch({
      type: "GET_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Journal Summary *****-----------------------
export const getJournalSummary = (trans, poType) => async (dispatch) => {
  dispatch({
    type: "GET_JOURNAL_SUMMARY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/JournalRequest?actionType=GetJournalSummary&tran=${trans}`;

  try {
    let result = await Axios.get(url);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {

      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_JOURNAL_SUMMARY_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_JOURNAL_SUMMARY_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Journal Summary.",
        });
      }
    } else {
      dispatch({
        type: "GET_JOURNAL_SUMMARY_FAIL",
        payload: "Error While Getting Journal Summary.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Journal Summary.";
    dispatch({
      type: "GET_JOURNAL_SUMMARY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Journal *****----------------------------
export const updateJournal = (journal) => async (dispatch) => {
  dispatch({
    type: "UPDATE_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "UpdateJournal",
    journal: {
      ...journal,
    },
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "UPDATE_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Updating Journal.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_JOURNAL_FAIL",
        payload: "Error While Updating Journal.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Journal.";
    dispatch({
      type: "UPDATE_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Insert Journal *****----------------------------
export const insertJournal = () => async (dispatch) => {
  dispatch({
    type: "INSERT_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "InsertJournal"
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {

      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "INSERT_JOURNAL_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "INSERT_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Adding Journal.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_JOURNAL_FAIL",
        payload: "Error While Adding Journal.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Journal.";
    dispatch({
      type: "INSERT_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send For Approval *****----------------------------
export const sendForApproval = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_FOR_APPROVAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "SendForApproval",
    tran
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "SEND_FOR_APPROVAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "SEND_FOR_APPROVAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Sending For Approval",
        });
      }
    } else {
      dispatch({
        type: "SEND_FOR_APPROVAL_FAIL",
        payload: "Error While Sending For Approval",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending For Approval";
    dispatch({
      type: "SEND_FOR_APPROVAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Approve Journal *****----------------------------
export const approveJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "ApproveJournal",
    tran
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "APPROVE_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "APPROVE_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Approving Journal",
        });
      }
    } else {
      dispatch({
        type: "APPROVE_JOURNAL_FAIL",
        payload: "Error While Approving Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving Journal";
    dispatch({
      type: "APPROVE_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Decline Journal *****----------------------------
export const declineJournal = (tran, comment) => async (dispatch) => {
  dispatch({
    type: "DECLINE_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "DeclineJournal",
    tran,
    comment
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "DECLINE_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "DECLINE_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Declining Journal",
        });
      }
    } else {
      dispatch({
        type: "DECLINE_JOURNAL_FAIL",
        payload: "Error While Declining Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining Journal";
    dispatch({
      type: "DECLINE_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Journal *****----------------------------
export const deleteJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "DeleteJournal",
    tran
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "DELETE_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Deleting Journal",
        });
      }
    } else {
      dispatch({
        type: "DELETE_JOURNAL_FAIL",
        payload: "Error While Deleting Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Journal";
    dispatch({
      type: "DELETE_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Hold Journal *****----------------------------
export const holdJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "HOLD_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "HoldJournal",
    tran
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "HOLD_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "HOLD_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Holding Journal",
        });
      }
    } else {
      dispatch({
        type: "HOLD_JOURNAL_FAIL",
        payload: "Error While Holding Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Holding Journal";
    dispatch({
      type: "HOLD_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Attachment *****----------------------------
export const getAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "GetAttachment",
    recordID
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_ATTACHMENT_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "GET_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Attachment",
        });
      }
    } else {
      dispatch({
        type: "GET_ATTACHMENT_FAIL",
        payload: "Error While Getting Attachment",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Attachment";
    dispatch({
      type: "GET_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Attachment *****----------------------------
export const addAttachment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "AddAttachment",
    ...data
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_ATTACHMENT_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "ADD_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Adding Attachment",
        });
      }
    } else {
      dispatch({
        type: "ADD_ATTACHMENT_FAIL",
        payload: "Error While Adding Attachment",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Attachment";
    dispatch({
      type: "ADD_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Attachment *****----------------------------
export const deleteAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "DeleteAttachment",
    recordID
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_ATTACHMENT_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "DELETE_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Deleting Attachment",
        });
      }
    } else {
      dispatch({
        type: "DELETE_ATTACHMENT_FAIL",
        payload: "Error While Deleting Attachment",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Attachment";
    dispatch({
      type: "DELETE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Comment *****----------------------------
export const addComment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_COMMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "AddComment",
    ...data
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_COMMENT_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "ADD_COMMENT_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Adding Comment",
        });
      }
    } else {
      dispatch({
        type: "ADD_COMMENT_FAIL",
        payload: "Error While Adding Comment",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Comment";
    dispatch({
      type: "ADD_COMMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Copy Journal *****----------------------------
export const copyJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "COPY_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "CopyJournal",
    tran
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "COPY_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "COPY_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Copying Journal",
        });
      }
    } else {
      dispatch({
        type: "COPY_JOURNAL_FAIL",
        payload: "Error While Copying Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Copying Journal";
    dispatch({
      type: "COPY_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Journal Form *****----------------------------
export const importJournalForm = (excelData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "ImportJournalForm",
    excelData
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "IMPORT_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "IMPORT_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Importing Journal",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_JOURNAL_FAIL",
        payload: "Error While Importing Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Journal";
    dispatch({
      type: "IMPORT_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Post Journal*****----------------------------
export const postJournal = (data) => async (dispatch) => {
  dispatch({
    type: "POST_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "PostJournal",
    ...data
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "POST_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "POST_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Posting Journal",
        });
      }
    } else {
      dispatch({
        type: "POST_JOURNAL_FAIL",
        payload: "Error While Posting Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Posting Journal";
    dispatch({
      type: "POST_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Journal *****----------------------------
export const exportJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let obj = {
    actionType: "ExportJournal",
    tran
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "EXPORT_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "EXPORT_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Exporting Journal",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_JOURNAL_FAIL",
        payload: "Error While Exporting Journal",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Journal";
    dispatch({
      type: "EXPORT_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Journal *****----------------------------
export const moveJournal = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_JOURNAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/JournalRequest";
  let data = {
    actionType: "MoveJournal",
    tran
  };

  try {
    let result = await Axios.post(url, data);
    let resp =
      (result && result.data && result.data.JournalResponse) || "";
    if (resp && resp.result.length > 0) {
      if (
        resp.result[0] &&
        resp.result[0].status === "Success"
      ) {
        dispatch({
          type: "MOVE_JOURNAL_SUCCESS",
          payload: resp
        });
      } else {
        dispatch({
          type: "MOVE_JOURNAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Moving Journal to Draft",
        });
      }
    } else {
      dispatch({
        type: "MOVE_JOURNAL_FAIL",
        payload: "Error While Moving Journal to Draft",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Journal to Draft";
    dispatch({
      type: "MOVE_JOURNAL_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear Journal states****-----------------------
export function clearJournalStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_JOURNAL_STATES",
    });
  };
}
