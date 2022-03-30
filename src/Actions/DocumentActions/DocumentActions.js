const Axios = require("axios");
Axios.defaults.withCredentials = true;

// ---------------------****Documents Actions****-----------------------------

//----------------------****Get Document Tallies*****-------------------------
export const getDocumentTallies = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_DOCUMENT_TALLIES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/DocumentRequest?actionType=GetDocumentTallies`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_DOCUMENT_TALLIES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Document Tallies.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_DOCUMENT_TALLIES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_DOCUMENT_TALLIES_FAIL",
        payload: "Error While Getting Document Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Document Tallies.";
    dispatch({
      type: "GET_DOCUMENT_TALLIES_FAIL",
      payload: error,
    });
  }
};

//----------------------****Get Documents List*****---------------------------
export const getDocumentsList = (doc) => async (dispatch) => {
  dispatch({
    type: "GET_DOCUMENTS_LIST_INIT",
  });

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/DocumentRequest?actionType=GetDocumentsList&docState=${doc.docState}&teamDocuments=${doc.teamDocuments}`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_DOCUMENTS_LIST_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Documents List.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_DOCUMENTS_LIST_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_DOCUMENTS_LIST_FAIL",
        payload: "Error While Getting Documents List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Documents List.";
    dispatch({
      type: "GET_DOCUMENTS_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single Document *****-------------------------
export const getDocument = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_DOCUMENT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/DocumentRequest?actionType=GetDocument&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_DOCUMENT_FAIL",
        payload: "Error While Getting Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Document.";
    dispatch({
      type: "GET_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Add Document *****--------------------------------
export const addDocument = () => async (dispatch) => {
  dispatch({
    type: "ADD_DOCUMENT_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let obj = {
    actionType: "AddDocument",
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_DOCUMENT_FAIL",
          payload: resp.result[0].description || "Error While Adding Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_DOCUMENT_FAIL",
        payload: "Error While Adding Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Document.";
    dispatch({
      type: "ADD_DOCUMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Document *****-----------------------------
export const updateDocument = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_DOCUMENT_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let obj = {
    actionType: "UpdateDocument",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "UPDATE_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Updating Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_DOCUMENT_FAIL",
        payload: "Error While Updating Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Document.";
    dispatch({
      type: "UPDATE_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Delete Document*****------------------------------
export const deleteDocument = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_DOCUMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "DeleteDocument",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DELETE_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting The Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_DOCUMENT_FAIL",
        payload: "Error While Deleting The Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting The Document.";
    dispatch({
      type: "DELETE_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Add Comment *****---------------------------------
export const addComment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_COMMENT_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let obj = {
    actionType: "AddComment",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_COMMENT_FAIL",
          payload: resp.result[0].description || "Error While Adding Comment.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_COMMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_COMMENT_FAIL",
        payload: "Error While Adding Comment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Comment.";
    dispatch({
      type: "ADD_COMMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Send For Approval Document*****-------------------
export const sendDocForApproval = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_DOC_FOR_APPROVAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "SendDocForApproval",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "SEND_DOC_FOR_APPROVAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Sending Document For Approval.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_DOC_FOR_APPROVAL_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "SEND_DOC_FOR_APPROVAL_FAIL",
        payload: "Error While Sending Document For Approval.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Document For Approval.";
    dispatch({
      type: "SEND_DOC_FOR_APPROVAL_FAIL",
      payload: error,
    });
  }
};

//----------------------****Approve Document*****-----------------------------
export const approveDocument = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_DOCUMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "ApproveDocument",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "APPROVE_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Approving Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "APPROVE_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "APPROVE_DOCUMENT_FAIL",
        payload: "Error While Approving Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving Document.";
    dispatch({
      type: "APPROVE_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Decline Document*****-----------------------------
export const declineDocument = (tran) => async (dispatch) => {
  dispatch({
    type: "DECLINE_DOCUMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "DeclineDocument",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DECLINE_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Declining The Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DECLINE_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DECLINE_DOCUMENT_FAIL",
        payload: "Error While Declining The Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining The Document.";
    dispatch({
      type: "DECLINE_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Hold Document*****--------------------------------
export const holdDocument = (tran) => async (dispatch) => {
  dispatch({
    type: "HOLD_DOCUMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "HoldDocument",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "HOLD_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Holding The Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "HOLD_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "HOLD_DOCUMENT_FAIL",
        payload: "Error While Holding The Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Holding The Document.";
    dispatch({
      type: "HOLD_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Move Document*****--------------------------------
export const moveDocument = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_DOCUMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "MoveDocument",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "MOVE_DOCUMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Moving The Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "MOVE_DOCUMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "MOVE_DOCUMENT_FAIL",
        payload: "Error While Moving The Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving The Document.";
    dispatch({
      type: "MOVE_DOCUMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Add Document Attachments*****---------------------
export const addDocAttachments = (attachment) => async (dispatch) => {
  dispatch({
    type: "ADD_DOC_ATTACHMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "AddAttachment",
    ...attachment,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_DOC_ATTACHMENTS_FAIL",
          payload:
            resp.result[0].description || "Error While Uploading Attachments.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_DOC_ATTACHMENTS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_DOC_ATTACHMENTS_FAIL",
        payload: "Error While Uploading Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Uploading Attachments.";
    dispatch({
      type: "ADD_DOC_ATTACHMENTS_FAIL",
      payload: error,
    });
  }
};

//----------------------****Update Primary Document*****----------------------
export const updatePrimaryDocument = (tran, recordID) => async (dispatch) => {
  dispatch({
    type: "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "UpdatePrimaryDocument",
    tran,
    recordID,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Updating Primary Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_FAIL",
        payload: "Error While Updating Primary Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Primary Document.";
    dispatch({
      type: "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Document Attachment*****----------------------
export const getAttachment = (fileID) => async (dispatch) => {
  dispatch({
    type: "GET_DOC_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "GetAttachment",
    tran: fileID,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_DOC_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Attachment.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_DOC_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_DOC_ATTACHMENT_FAIL",
        payload: "Error While Getting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Attachment.";
    dispatch({
      type: "GET_DOC_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Document Attachment*****-------------------
export const deleteAttachment = (fileID) => async (dispatch) => {
  dispatch({
    type: "DELETE_DOC_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/DocumentRequest";
  let data = {
    actionType: "DeleteAttachment",
    tran: fileID,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.Document_response) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DELETE_DOC_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting Attachment.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_DOC_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_DOC_ATTACHMENT_FAIL",
        payload: "Error While Deleting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Attachment.";
    dispatch({
      type: "DELETE_DOC_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Clear Documents states****------------------------
export function clearDocumentStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_DOCUMENTS_STATES",
    });
  };
}
