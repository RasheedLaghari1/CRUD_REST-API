const Axios = require("axios");
Axios.defaults.withCredentials = true;

// -------------------------****Expense Actions****-----------------------------

//------------------------****Get Expense Tallies*****--------------------------
export const getExpenseTallies = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_TALLIES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ExpenseRequest?actionType=GetExpenseTallies`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_EXPENSE_TALLIES_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Expense Tallies.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EXPENSE_TALLIES_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_TALLIES_FAIL",
        payload: "Error While Getting Expense Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Expense Tallies.";
    dispatch({
      type: "GET_EXPENSE_TALLIES_FAIL",
      payload: error,
    });
  }
};
//--------------------------****Get Expense List*****---------------------------
export const getExpenseList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_LIST_INIT",
  });
  let expenseType = data.type || ''
  let teamExpenses = data.teamExpense || 'N'
  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ExpenseRequest?actionType=GetExpenseList&expenseType=${expenseType}&teamExpenses=${teamExpenses}`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_EXPENSE_LIST_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Expense List.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EXPENSE_LIST_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_LIST_FAIL",
        payload: "Error While Getting Expense List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Expense List.";
    dispatch({
      type: "GET_EXPENSE_LIST_FAIL",
      payload: error,
    });
  }
};
//-------------------------****Get Expense Summary *****------------------------
export const getExpenseSummary = (tran) => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_SUMMARY_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ExpenseRequest?actionType=GetExpenseSummary&tran=${tran}`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_EXPENSE_SUMMARY_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Getting Expense Summary.",
        });
      }
      if ((resp.result[0] && resp.result[0].status === "Success") || 1) {
        dispatch({
          type: "GET_EXPENSE_SUMMARY_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_SUMMARY_FAIL",
        payload: "Error While Getting Expense Summary.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Expense Summary.";
    dispatch({
      type: "GET_EXPENSE_SUMMARY_FAIL",
      payload: error,
    });
  }
};
//--------------------------****Get Expense Detail *****------------------------
export const getExpenseDetail = (tran) => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_DETAIL_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ExpenseRequest?actionType=GetExpenseDetail&tran=${tran}`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_EXPENSE_DETAIL_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Expense Detail.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EXPENSE_DETAIL_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_DETAIL_FAIL",
        payload: "Error While Getting Expense Detail.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Expense Detail.";
    dispatch({
      type: "GET_EXPENSE_DETAIL_FAIL",
      payload: error,
    });
  }
};
//----------------------------****Insert Expense *****--------------------------
export const insertExpense = () => async (dispatch) => {
  dispatch({
    type: "INSERT_EXPENSE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "InsertExpense",
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "INSERT_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Inserting Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "INSERT_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "INSERT_EXPENSE_FAIL",
        payload: "Error While Inserting Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Expense.";
    dispatch({
      type: "INSERT_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//----------------------------****Update Expense *****--------------------------
export const updateExpense = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_EXPENSE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "UpdateExpense",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "UPDATE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Updating Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_EXPENSE_FAIL",
        payload: "Error While Updating Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Expense.";
    dispatch({
      type: "UPDATE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Expense*****---------------------------------
export const deleteExpense = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "DeleteExpense",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DELETE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting The Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_EXPENSE_FAIL",
        payload: "Error While Deleting The Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting The Expense.";
    dispatch({
      type: "DELETE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Add Comment *****--------------------------
export const addComment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_COMMENT_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "AddComment",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
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
//------------------------****Send Expense For Approval Expense*****------------
export const sendExpForApproval = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_EXPENSE_FOR_APPROVAL_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "SendForApproval",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "SEND_EXPENSE_FOR_APPROVAL_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Sending Expense For Approval.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "SEND_EXPENSE_FOR_APPROVAL_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "SEND_EXPENSE_FOR_APPROVAL_FAIL",
        payload: "Error While Sending Expense For Approval.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending Expense For Approval.";
    dispatch({
      type: "SEND_EXPENSE_FOR_APPROVAL_FAIL",
      payload: error,
    });
  }
};
//--------------------------****Get Expense Attachment*****---------------------
export const getExpAttachment = (id) => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "GetAttachment",
    id,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "GET_EXPENSE_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Attachment.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EXPENSE_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_ATTACHMENT_FAIL",
        payload: "Error While Getting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Attachment.";
    dispatch({
      type: "GET_EXPENSE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Expense Attachments*****------------------------
export const addExpAttachment = (attachment) => async (dispatch) => {
  dispatch({
    type: "ADD_EXPENSE_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "AddAttachment",
    ...attachment,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_EXPENSE_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Uploading Attachments.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_EXPENSE_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_EXPENSE_ATTACHMENT_FAIL",
        payload: "Error While Uploading Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Uploading Attachments.";
    dispatch({
      type: "ADD_EXPENSE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Expense Attachment*****----------------------
export const deleteExpAttachment = (id) => async (dispatch) => {
  dispatch({
    type: "DELETE_EXPENSE_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "DeleteAttachment",
    id,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DELETE_EXPENSE_ATTACHMENT_FAIL",
          payload:
            resp.result[0].description || "Error While Deleting Attachment.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DELETE_EXPENSE_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_EXPENSE_ATTACHMENT_FAIL",
        payload: "Error While Deleting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Attachment.";
    dispatch({
      type: "DELETE_EXPENSE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Primary Document*****------------------------
export const updatePrimaryDocument = (tran, id) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PRIMARY_DOCUMENT_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "UpdatePrimaryDocument",
    tran,
    id,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "UPDATE_PRIMARY_DOCUMENT_EXPENSE_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Updating Primary Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_PRIMARY_DOCUMENT_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PRIMARY_DOCUMENT_EXPENSE_FAIL",
        payload: "Error While Updating Primary Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Primary Document.";
    dispatch({
      type: "UPDATE_PRIMARY_DOCUMENT_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Approve Expense*****-----------------------
export const approveExpense = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "ApproveExpense",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "APPROVE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Approving Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "APPROVE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "APPROVE_EXPENSE_FAIL",
        payload: "Error While Approving Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving Expense.";
    dispatch({
      type: "APPROVE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Decline Expense*****----------------------
export const declineExpense = (obj) => async (dispatch) => {
  dispatch({
    type: "DECLINE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "DeclineExpense",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "DECLINE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Declining The Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "DECLINE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "DECLINE_EXPENSE_FAIL",
        payload: "Error While Declining The Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining The Expense.";
    dispatch({
      type: "DECLINE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Move Expense*****-------------------------
export const moveExpense = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "MoveExpense",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "MOVE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Moving The Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "MOVE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "MOVE_EXPENSE_FAIL",
        payload: "Error While Moving The Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving The Expense.";
    dispatch({
      type: "MOVE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Hold Expense*****-------------------------
export const holdExpense = (tran) => async (dispatch) => {
  dispatch({
    type: "HOLD_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "HoldExpense",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "HOLD_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Holding The Expense.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "HOLD_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "HOLD_EXPENSE_FAIL",
        payload: "Error While Holding The Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Holding The Expense.";
    dispatch({
      type: "HOLD_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Export List*****---------------------------
export const exportList = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_LIST_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "ExportList",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "EXPORT_LIST_FAIL",
          payload: resp.result[0].description || "Error While Exporting List.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EXPORT_LIST_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "EXPORT_LIST_FAIL",
        payload: "Error While Exporting List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting List.";
    dispatch({
      type: "EXPORT_LIST_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Create Invoice*****------------------------
export const createInvoice = (data) => async (dispatch) => {
  dispatch({
    type: "CREATE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "CreateInvoice",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "CREATE_INVOICE_FAIL",
          payload:
            resp.result[0].description || "Error While Creating Invoice.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "CREATE_INVOICE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "CREATE_INVOICE_FAIL",
        payload: "Error While Creating Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Creating Invoice.";
    dispatch({
      type: "CREATE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Export Envelope*****-----------------------
export const exportEnvelope = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_ENVELOPE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "ExportEnvelope",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "EXPORT_ENVELOPE_FAIL",
          payload:
            resp.result[0].description || "Error While Exporting Envelope.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EXPORT_ENVELOPE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "EXPORT_ENVELOPE_FAIL",
        payload: "Error While Exporting Envelope.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Envelope.";
    dispatch({
      type: "EXPORT_ENVELOPE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Email Envelope*****------------------------
export const emailEnvelope = (tran) => async (dispatch) => {
  dispatch({
    type: "EMAIL_ENVELOPE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "EmailEnvelope",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "EMAIL_ENVELOPE_FAIL",
          payload:
            resp.result[0].description || "Error While Emailing Envelope.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "EMAIL_ENVELOPE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "EMAIL_ENVELOPE_FAIL",
        payload: "Error While Emailing Envelope.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Emailing Envelope.";
    dispatch({
      type: "EMAIL_ENVELOPE_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Import Debit Transactions*****-------------
export const importDebitTransactions = (data) => async (dispatch) => {
  dispatch({
    type: "IMPORT_DEBIT_TRANSACTIONS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "ImportDebitTransactions",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_DEBIT_TRANSACTIONS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_DEBIT_TRANSACTIONS_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Importing Debit Transactions.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_DEBIT_TRANSACTIONS_FAIL",
        payload: "Error While Importing Debit Transactions.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Debit Transactions.";
    dispatch({
      type: "IMPORT_DEBIT_TRANSACTIONS_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Balance Tax*****---------------------------
export const balanceTax = (tran) => async (dispatch) => {
  dispatch({
    type: "BALANCE_TAX_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "BalanceTax",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "BALANCE_TAX_FAIL",
          payload: resp.result[0].description || "Error While Balancing Tax.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "BALANCE_TAX_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "BALANCE_TAX_FAIL",
        payload: "Error While Balancing Tax.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Balancing Tax.";
    dispatch({
      type: "BALANCE_TAX_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Add Tax Lines*****------------------------
export const addTaxLines = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_TAX_LINES_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "AddTaxLines",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_TAX_LINES_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Adding Tax Lines.",
        });
      }

      if (resp.result[0] && resp.result[0].status === "Sucess") {
        dispatch({
          type: "ADD_TAX_LINES_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_TAX_LINES_EXPENSE_FAIL",
        payload: "Error While Adding Tax Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Tax Lines.";
    dispatch({
      type: "ADD_TAX_LINES_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Add Advanced Line*****--------------------
export const addAdvancedLine = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_ADVANCED_LINE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "AddAdvancedLine",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_ADVANCED_LINE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Adding Advanced Line.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_ADVANCED_LINE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_ADVANCED_LINE_EXPENSE_FAIL",
        payload: "Error While Adding Advanced Line.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Advanced Line.";
    dispatch({
      type: "ADD_ADVANCED_LINE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------****Add Accounted Line*****-------------------
export const addAccountedLine = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_ACCOUNTED_LINE_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "AddAccountedLine",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "ADD_ACCOUNTED_LINE_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Adding Accounted Line.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "ADD_ACCOUNTED_LINE_EXPENSE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_ACCOUNTED_LINE_EXPENSE_FAIL",
        payload: "Error While Adding Accounted Line.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Accounted Line.";
    dispatch({
      type: "ADD_ACCOUNTED_LINE_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Post Expense*****------------------------------
export const postExpense = (data) => async (dispatch) => {
  dispatch({
    type: "POST_EXPENSE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "PostExpense",
    ...data
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "POST_EXPENSE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "POST_EXPENSE_FAIL",
          payload:
            resp.result[0].description || "Error While Posting Expense.",
        });
      }
    } else {
      dispatch({
        type: "POST_EXPENSE_FAIL",
        payload: "Error While Posting Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Posting Expense.";
    dispatch({
      type: "POST_EXPENSE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Batch*****----------------------------------
export const moveBatch = (data) => async (dispatch) => {
  dispatch({
    type: "MOVE_EXP_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "MoveBatch",
    ...data
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "MOVE_EXP_BATCH_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "MOVE_EXP_BATCH_FAIL",
          payload:
            resp.result[0].description || "Error While Moving Batch.",
        });
      }
    } else {
      dispatch({
        type: "MOVE_EXP_BATCH_FAIL",
        payload: "Error While Moving Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Batch.";
    dispatch({
      type: "MOVE_EXP_BATCH_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Import Envelope*****-----------------------
export const importEnvelope = (excelData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_ENVELOPE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let data = {
    actionType: "ImportEnvelope",
    excelData,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Failed") {
        dispatch({
          type: "IMPORT_ENVELOPE_FAIL",
          payload:
            resp.result[0].description || "Error While Importing Envelope.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_ENVELOPE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "IMPORT_ENVELOPE_FAIL",
        payload: "Error While Importing Envelope.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Envelope.";
    dispatch({
      type: "IMPORT_ENVELOPE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import List*****--------------------------
export const importList = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_EXP_LIST_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "ImportList",
    importData
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_EXP_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_EXP_LIST_FAIL",
          payload:
            resp.result[0].description || "Error While Importing List.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_EXP_LIST_FAIL",
        payload: "Error While Importing List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing List.";
    dispatch({
      type: "IMPORT_EXP_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Fuel Expense*****--------------------------
export const importFuelExpense = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_FUEL_EXP_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "ImportFuelExpense",
    importData
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_FUEL_EXP_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_FUEL_EXP_FAIL",
          payload:
            resp.result[0].description || "Error While Importing Fuel Expense.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_FUEL_EXP_FAIL",
        payload: "Error While Importing Fuel Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Fuel Expense.";
    dispatch({
      type: "IMPORT_FUEL_EXP_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Split Expense*****--------------------------
export const importSplitExpense = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_SPLIT_EXP_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/ExpenseRequest";
  let obj = {
    actionType: "ImportSplitExpense",
    importData
  };

  try {
    let result = await Axios.post(url, obj);
    let resp =
      (result && result.data && result.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "IMPORT_SPLIT_EXP_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_SPLIT_EXP_FAIL",
          payload:
            resp.result[0].description || "Error While Importing Split Expense.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_SPLIT_EXP_FAIL",
        payload: "Error While Importing Split Expense.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Split Expense.";
    dispatch({
      type: "IMPORT_SPLIT_EXP_FAIL",
      payload: error,
    });
  }
};
//--------------------------****Get Expense Codes*****---------------------------
export const getExpenseCodes = () => async (dispatch) => {
  dispatch({
    type: "GET_EXPENSE_CODES_INIT",
  });

  let url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/ExpenseRequest?actionType=GetExpenseCodes`;

  try {
    let response = await Axios.get(url);
    let resp =
      (response && response.data && response.data.ExpenseResponse) || "";
    if (resp && resp.result.length > 0) {

      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "GET_EXPENSE_CODES_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_EXPENSE_CODES_FAIL",
          payload:
            resp.result[0].description || "Error While Getting Expense Codes.",
        });
      }
    } else {
      dispatch({
        type: "GET_EXPENSE_CODES_FAIL",
        payload: "Error While Getting Expense Codes.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Expense Codes.";
    dispatch({
      type: "GET_EXPENSE_CODES_FAIL",
      payload: error,
    });
  }
};
//-------------------------------****Clear Expense states****-------------------
export function clearExpenseStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_EXPENSE_STATES",
    });
  };
}
