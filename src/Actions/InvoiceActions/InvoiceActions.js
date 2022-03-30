const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Invoice Actions****-----------------------------
//----------------------****Get Invoice Tallies*****------------------------
export const getInvoiceTallies = () => async (dispatch) => {
  dispatch({
    type: "GET_INVOICE_TALLIES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/InvoiceRequest?actionType=GetInvoiceTallies";

  try {
    // let response = getInvoiceTallies_api;

    let response = await Axios.post(url);
    let getInvoiceTallies =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (getInvoiceTallies && getInvoiceTallies.results.length > 0) {
      if (
        getInvoiceTallies.results[0] &&
        getInvoiceTallies.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_INVOICE_TALLIES_FAIL",
          payload:
            getInvoiceTallies.results[0].description ||
            "Error While Getting Invoice Tallies.",
        });
      }
      if (
        getInvoiceTallies.results[0] &&
        getInvoiceTallies.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_INVOICE_TALLIES_SUCCESS",
          payload: getInvoiceTallies,
        });
      }
    } else {
      dispatch({
        type: "GET_INVOICE_TALLIES_FAIL",
        payload: "Error While Getting Invoice Tallies.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Invoice Tallies.";
    dispatch({
      type: "GET_INVOICE_TALLIES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Invoice List*****---------------------------
export const getInvoicesList = (data) => async (dispatch) => {
  dispatch({
    type: "GET_INVOICES_LIST_INIT",
  });
  let type = data.type || "";
  let teamInvoices = data.teamInvoices || "N";
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/InvoiceRequest?actionType=GetInvoiceList&invoiceType=${type}&teamInvoices=${teamInvoices}`;

  try {
    let response = await Axios.get(url);
    let getInvoicesListResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (getInvoicesListResp && getInvoicesListResp.results.length > 0) {
      if (
        getInvoicesListResp.results[0] &&
        getInvoicesListResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_INVOICES_LIST_FAIL",
          payload:
            getInvoicesListResp.results[0].description ||
            "Error While Getting Invoices List.",
        });
      }
      if (
        getInvoicesListResp.results[0] &&
        getInvoicesListResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_INVOICES_LIST_SUCCESS",
          payload: getInvoicesListResp,
        });
      }
    } else {
      dispatch({
        type: "GET_INVOICES_LIST_FAIL",
        payload: "Error While Getting Invoices List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Invoices List.";
    dispatch({
      type: "GET_INVOICES_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Invoice *****-------------------------------
export const getInvoice = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_INVOICE_INIT",
  });
  // const url = localStorage.getItem("API_URL") + `/DPFAPI/InvoiceRequest?actionType=GetInvoice&tran=${trans}&fileType=Image`;
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/InvoiceRequest?actionType=GetInvoice&tran=${trans}`;

  try {
    let response = await Axios.get(url);
    let getInvocieResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (getInvocieResp && getInvocieResp.results.length > 0) {
      if (
        getInvocieResp.results[0] &&
        getInvocieResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_INVOICE_FAIL",
          payload:
            getInvocieResp.results[0].description ||
            "Error While Getting Invocie.",
        });
      }
      if (
        getInvocieResp.results[0] &&
        getInvocieResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_INVOICE_SUCCESS",
          payload: getInvocieResp,
        });
      }
    } else {
      dispatch({
        type: "GET_INVOICE_FAIL",
        payload: "Error While Getting Invocie.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Invocie.";
    dispatch({
      type: "GET_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Create Invoice*****-----------------------------
export const draftInvoice = (data) => async (dispatch) => {
  dispatch({
    type: "DRAFT_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "DraftInvoice",
  };
  try {
    let response = await Axios.post(url, obj);
    let draftInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";

    if (draftInvoiceResp && draftInvoiceResp.results.length > 0) {
      if (
        draftInvoiceResp.results[0] &&
        draftInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DRAFT_INVOICE_FAIL",
          payload:
            draftInvoiceResp.results[0].description ||
            "Error While Creating Invoice.",
        });
      }
      if (
        draftInvoiceResp.results[0] &&
        draftInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DRAFT_INVOICE_SUCCESS",
          payload: draftInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "DRAFT_INVOICE_FAIL",
        payload: "Error While Creating Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Creating Invoice.";
    dispatch({
      type: "DRAFT_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****delete Invoice*****-----------------------------
export const deleteInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "DELETE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "DeleteInvoice",
    tran,
  };
  try {
    let response = await Axios.post(url, obj);
    let deleteInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";

    if (deleteInvoiceResp && deleteInvoiceResp.results.length > 0) {
      if (
        deleteInvoiceResp.results[0] &&
        deleteInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DELETE_INVOICE_FAIL",
          payload:
            deleteInvoiceResp.results[0].description ||
            "Error While Deleting Invoice.",
        });
      }
      if (
        deleteInvoiceResp.results[0] &&
        deleteInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_INVOICE_SUCCESS",
          payload: deleteInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_INVOICE_FAIL",
        payload: "Error While Deleting Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Invoice.";
    dispatch({
      type: "DELETE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get OCR TOken *****------------------------------
export const getOCRToken = (trans) => async (dispatch) => {
  dispatch({
    type: "GET_OCR_TOKEN_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/InvoiceRequest?actionType=GetOCRToken";

  try {
    let response = await Axios.get(url);
    let getOCRTokenResp =
      (response && response.data && response.data.InvoiceResponse) || "";

    if (getOCRTokenResp && getOCRTokenResp.results.length > 0) {
      if (
        getOCRTokenResp.results[0] &&
        getOCRTokenResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_OCR_TOKEN_FAIL",
          payload:
            getOCRTokenResp.results[0].description ||
            "Error While Getting OCR Token.",
        });
      }
      if (
        getOCRTokenResp.results[0] &&
        getOCRTokenResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_OCR_TOKEN_SUCCESS",
          payload: getOCRTokenResp,
        });
      }
    } else {
      dispatch({
        type: "GET_OCR_TOKEN_FAIL",
        payload: "Error While Getting OCR Token.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting OCR Token.";
    dispatch({
      type: "GET_OCR_TOKEN_FAIL",
      payload: error,
    });
  }
};
//----------------------****Invoice OCR Lookup*****--------------------------
export const invoiceOCRLookup = (data) => async (dispatch) => {
  dispatch({
    type: "INVOICE_OCR_LOOKUP_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "InvoiceOCRLookup",
    ...data,
  };
  try {
    let response = await Axios.post(url, obj);
    let invoiceOCRLookupResp =
      (response && response.data && response.data.InvoiceResponse) || "";

    if (invoiceOCRLookupResp && invoiceOCRLookupResp.results.length > 0) {
      if (
        invoiceOCRLookupResp.results[0] &&
        invoiceOCRLookupResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "INVOICE_OCR_LOOKUP_FAIL",
          payload:
            invoiceOCRLookupResp.results[0].description ||
            "Error While Getting Invoice OCR Lookup.",
        });
      }
      if (
        invoiceOCRLookupResp.results[0] &&
        invoiceOCRLookupResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "INVOICE_OCR_LOOKUP_SUCCESS",
          payload: invoiceOCRLookupResp,
        });
      }
    } else {
      dispatch({
        type: "INVOICE_OCR_LOOKUP_FAIL",
        payload: "Error While Getting Invoice OCR Lookup.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Invoice OCR Lookup.";
    dispatch({
      type: "INVOICE_OCR_LOOKUP_FAIL",
      payload: error,
    });
  }
};
//----------------------**** Import Invoice*****-----------------------------
export const importInvoice = (data) => async (dispatch) => {
  dispatch({
    type: "IMPORT_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ImportInvoice",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let importInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (importInvoiceResp && importInvoiceResp.results.length > 0) {
      let results = importInvoiceResp.results || [];
      let check = false;
      results.map((r, i) => {
        if (
          r.status === "Success" &&
          (r.description === "Invoice lines updated." ||
            r.description === "Invoice updated")
        ) {
          check = true;
        }
      });
      if (!check) {
        //Error case
        dispatch({
          type: "IMPORT_INVOICE_FAIL",
          payload:
            importInvoiceResp.results[0].description ||
            "Error While Importing The Invoice.",
        });
      } else {
        //Success case
        dispatch({
          type: "IMPORT_INVOICE_SUCCESS",
          payload: importInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "IMPORT_INVOICE_FAIL",
        payload: "Error While Importing The Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing The Invoice.";
    dispatch({
      type: "IMPORT_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------**** Upadte Invoice*****-----------------------------
export const updateInvoice = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "UpdateInvoice",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let updateInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (updateInvoiceResp && updateInvoiceResp.results.length > 0) {
      if (
        updateInvoiceResp.results[0] &&
        updateInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_INVOICE_FAIL",
          payload:
            updateInvoiceResp.results[0].description ||
            "Error While Updating The Invoice.",
        });
      }
      if (
        updateInvoiceResp.results[0] &&
        updateInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_INVOICE_SUCCESS",
          payload: updateInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_INVOICE_FAIL",
        payload: "Error While Updating The Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating The Invoice.";
    dispatch({
      type: "UPDATE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Tax Lines****--------------------------------
export const addTaxLines = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_TAX_LINES_INIT",
  });

  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/InvoiceRequest?actionType=AddTaxLines&currency=${data.currency}&supplierCode=${data.supplierCode}&amount=${data.amount}&taxAmount=${data.taxAmount}`;

  try {
    let response = await Axios.get(url);
    let addTaxLineResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (addTaxLineResp && addTaxLineResp.results.length > 0) {
      if (
        addTaxLineResp.results[0] &&
        addTaxLineResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_TAX_LINES_FAIL",
          payload:
            addTaxLineResp.results[0].description ||
            "Error Add Tax Line Getiing.",
        });
      }
      if (
        addTaxLineResp.results[0] &&
        addTaxLineResp.results[0].status === "Sucess"
      ) {
        dispatch({
          type: "ADD_TAX_LINES_SUCCESS",
          payload: addTaxLineResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_TAX_LINES_FAIL",
        payload: "Error Add Tax Line Getiing.",
      });
    }
  } catch (err) {
    const error = err.message || "Error Add Tax Line Getiing.";
    dispatch({
      type: "ADD_TAX_LINES_FAIL",
      payload: error,
    });
  }
};

//----------------------****Add Comment****----------------------------------
export const addComment = (data) => async (dispatch) => {
  dispatch({
    type: "ADD_INVOICE_COMMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "AddComment",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let addCommentResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (addCommentResp && addCommentResp.results.length > 0) {
      if (
        addCommentResp.results[0] &&
        addCommentResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_INVOICE_COMMENT_FAIL",
          payload:
            addCommentResp.results[0].description || "Error While Commenting.",
        });
      }
      if (
        addCommentResp.results[0] &&
        addCommentResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_INVOICE_COMMENT_SUCCESS",
          payload: addCommentResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_INVOICE_COMMENT_FAIL",
        payload: "Error While Commenting.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Commenting.";
    dispatch({
      type: "ADD_INVOICE_COMMENT_FAIL",
      payload: error,
    });
  }
};

//----------------------****Add Invoice Attachments*****---------------------
export const addInvoiceAttachments =
  (attachment, primaryAttach) => async (dispatch) => {
    dispatch({
      type: "ADD_INVOICE_ATTACHMENTS_INIT",
    });
    const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
    let data = {
      actionType: "AddInvoiceAttachment",
      ...attachment,
    };

    //while adding new invoice then document/pdf sending for OCR Sypht will be the primary attachment of the invoice
    if (primaryAttach) {
      data.primaryAttachment = "Y";
    }

    try {
      let response = await Axios.post(url, data);
      let addInvoiceAttachmentResp =
        (response && response.data && response.data.InvoiceResponse) || "";
      if (
        addInvoiceAttachmentResp &&
        addInvoiceAttachmentResp.results.length > 0
      ) {
        if (
          addInvoiceAttachmentResp.results[0] &&
          addInvoiceAttachmentResp.results[0].status === "Failed"
        ) {
          dispatch({
            type: "ADD_INVOICE_ATTACHMENTS_FAIL",
            payload:
              addInvoiceAttachmentResp.results[0].description ||
              "Error While Uploading Attachments.",
          });
        }
        if (
          addInvoiceAttachmentResp.results[0] &&
          addInvoiceAttachmentResp.results[0].status === "Success"
        ) {
          dispatch({
            type: "ADD_INVOICE_ATTACHMENTS_SUCCESS",
            payload: addInvoiceAttachmentResp,
          });
        }
      } else {
        dispatch({
          type: "ADD_INVOICE_ATTACHMENTS_FAIL",
          payload: "Error While Uploading Attachments.",
        });
      }
    } catch (err) {
      const error = err.message || "Error While Uploading Attachments.";
      dispatch({
        type: "ADD_INVOICE_ATTACHMENTS_FAIL",
        payload: error,
      });
    }
  };

//----------------------****Get Invoice Attachments*****---------------------
export const getInvoiceAttachments = (trans, recordID) => async (dispatch) => {
  dispatch({
    type: "GET_INVOICE_ATTACHMENT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/InvoiceRequest?actionType=GetInvoiceAttachment&tran=${recordID}`;

  try {
    let response = await Axios.get(url);
    let getInvoiceAttachmentResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (
      getInvoiceAttachmentResp &&
      getInvoiceAttachmentResp.results.length > 0
    ) {
      if (
        getInvoiceAttachmentResp.results[0] &&
        getInvoiceAttachmentResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_INVOICE_ATTACHMENT_FAIL",
          payload:
            getInvoiceAttachmentResp.results[0].description ||
            "Error While Getting Attachments.",
        });
      }
      if (
        getInvoiceAttachmentResp.results[0] &&
        getInvoiceAttachmentResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_INVOICE_ATTACHMENT_SUCCESS",
          payload: getInvoiceAttachmentResp,
        });
      }
    } else {
      dispatch({
        type: "GET_INVOICE_ATTACHMENT_FAIL",
        payload: "Error While Getting Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Attachments.";
    dispatch({
      type: "GET_INVOICE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Invoice Attachment*****-------------------
export const deleteInvoiceAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_INVOICE_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "DeleteInvoiceAttachment",
    recordID,
  };
  try {
    let response = await Axios.post(url, data);
    let deleteInvoiceAtchResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (deleteInvoiceAtchResp && deleteInvoiceAtchResp.results.length > 0) {
      if (
        deleteInvoiceAtchResp.results[0] &&
        deleteInvoiceAtchResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DELETE_INVOICE_ATTACHMENT_FAIL",
          payload:
            deleteInvoiceAtchResp.results[0].description ||
            "Error While Deleting Invoice Attachemnt.",
        });
      }
      if (
        deleteInvoiceAtchResp.results[0] &&
        deleteInvoiceAtchResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_INVOICE_ATTACHMENT_SUCCESS",
          payload: deleteInvoiceAtchResp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_INVOICE_ATTACHMENT_FAIL",
        payload: "Error While Deleting Invoice Attachemnt.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Invoice Attachemnt.";
    dispatch({
      type: "DELETE_INVOICE_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Primary Document*****----------------------
export const updatePrimaryDocument = (tran, recordID) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PRIMARY_DOC_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
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
          type: "UPDATE_PRIMARY_DOC_INVOICE_FAIL",
          payload:
            resp.result[0].description ||
            "Error While Updating Primary Document.",
        });
      }
      if (resp.result[0] && resp.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_PRIMARY_DOC_INVOICE_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PRIMARY_DOC_INVOICE_FAIL",
        payload: "Error While Updating Primary Document.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Primary Document.";
    dispatch({
      type: "UPDATE_PRIMARY_DOC_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Decline Invoice *****----------------------------
export const declineInvoice = (tran, comment) => async (dispatch) => {
  dispatch({
    type: "DECLINE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "DeclineInvoice",
    tran,
    comment,
  };

  try {
    let response = await Axios.post(url, data);
    let declineInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (declineInvoiceResp && declineInvoiceResp.results.length > 0) {
      if (
        declineInvoiceResp.results[0] &&
        declineInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DECLINE_INVOICE_FAIL",
          payload:
            declineInvoiceResp.results[0].description ||
            "Error While Declining Invoice.",
        });
      }
      if (
        declineInvoiceResp.results[0] &&
        declineInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DECLINE_INVOICE_SUCCESS",
          payload: declineInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "DECLINE_INVOICE_FAIL",
        payload: "Error While Declining Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Declining Invoice.";
    dispatch({
      type: "DECLINE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Approve Invoice *****----------------------------
export const approveInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "APPROVE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "ApproveInvoice",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let approveInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (approveInvoiceResp && approveInvoiceResp.results.length > 0) {
      if (
        approveInvoiceResp.results[0] &&
        approveInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "APPROVE_INVOICE_FAIL",
          payload:
            approveInvoiceResp.results[0].description ||
            "Error While Approving Invoice.",
        });
      }
      if (
        approveInvoiceResp.results[0] &&
        approveInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "APPROVE_INVOICE_SUCCESS",
          payload: approveInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "APPROVE_INVOICE_FAIL",
        payload: "Error While Approving Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving Invoice.";
    dispatch({
      type: "APPROVE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Invoice *****-------------------------------
export const moveInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "MOVE_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "MoveInvoice",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let moveInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (moveInvoiceResp && moveInvoiceResp.results.length > 0) {
      if (
        moveInvoiceResp.results[0] &&
        moveInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "MOVE_INVOICE_FAIL",
          payload:
            moveInvoiceResp.results[0].description ||
            "Error While Moving Invoice.",
        });
      }
      if (
        moveInvoiceResp.results[0] &&
        moveInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "MOVE_INVOICE_SUCCESS",
          payload: moveInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "MOVE_INVOICE_FAIL",
        payload: "Error While Moving Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Invoice.";
    dispatch({
      type: "MOVE_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Send For Approval Invoice*****-------------------
export const sendForApprovalInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "SEND_FOR_APPROVAL_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "SendForApproval",
    tran,
  };

  try {
    let response = await Axios.post(url, data);
    let sendForApprovalInvoiceResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (
      sendForApprovalInvoiceResp &&
      sendForApprovalInvoiceResp.results.length > 0
    ) {
      if (
        sendForApprovalInvoiceResp.results[0] &&
        sendForApprovalInvoiceResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "SEND_FOR_APPROVAL_INVOICE_FAIL",
          payload:
            sendForApprovalInvoiceResp.results[0].description ||
            "Error While Sending For Approval Invoice.",
        });
      }
      if (
        sendForApprovalInvoiceResp.results[0] &&
        sendForApprovalInvoiceResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "SEND_FOR_APPROVAL_INVOICE_SUCCESS",
          payload: sendForApprovalInvoiceResp,
        });
      }
    } else {
      dispatch({
        type: "SEND_FOR_APPROVAL_INVOICE_FAIL",
        payload: "Error While Sending For Approval Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Sending For Approval Invoice.";
    dispatch({
      type: "SEND_FOR_APPROVAL_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Invoice Lines*****------------------------
export const updateInvoiceLines = (lines) => async (dispatch) => {
  dispatch({
    type: "UPDATE_INVOICE_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "UpdateInvoiceLines",
    ...lines,
  };

  try {
    let response = await Axios.post(url, data);
    let updateInvoiceLinesResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (updateInvoiceLinesResp && updateInvoiceLinesResp.results.length > 0) {
      if (
        updateInvoiceLinesResp.results[0] &&
        updateInvoiceLinesResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_INVOICE_LINES_FAIL",
          payload:
            updateInvoiceLinesResp.results[0].description ||
            "Error While Updating Invoice Lines.",
        });
      }
      if (
        updateInvoiceLinesResp.results[0] &&
        updateInvoiceLinesResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_INVOICE_LINES_SUCCESS",
          payload: updateInvoiceLinesResp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_INVOICE_LINES_FAIL",
        payload: "Error While Updating Invoice Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Invoice Lines.";
    dispatch({
      type: "UPDATE_INVOICE_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Invoice Lines*****------------------------
export const calculateLine = (obj) => async (dispatch) => {
  dispatch({
    type: "CALCULATE_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "CalculateLine",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let calculateLineResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (calculateLineResp && calculateLineResp.results.length > 0) {
      if (
        calculateLineResp.results[0] &&
        calculateLineResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "CALCULATE_LINES_FAIL",
          payload:
            calculateLineResp.results[0].description ||
            "Error While Calculating Lines.",
        });
      }
      if (
        calculateLineResp.results[0] &&
        calculateLineResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "CALCULATE_LINES_SUCCESS",
          payload: calculateLineResp,
        });
      }
    } else {
      dispatch({
        type: "CALCULATE_LINES_FAIL",
        payload: "Error While Calculating Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Calculating Lines.";
    dispatch({
      type: "CALCULATE_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Invoice Lines*****------------------------
export const importInvoiceLines = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_INVOICE_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "ImportInvoiceLines",
    importData,
  };

  try {
    let response = await Axios.post(url, data);
    let importInvoiceLinesResp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (importInvoiceLinesResp && importInvoiceLinesResp.results.length > 0) {
      if (
        importInvoiceLinesResp.results[0] &&
        importInvoiceLinesResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "IMPORT_INVOICE_LINES_FAIL",
          payload:
            importInvoiceLinesResp.results[0].description ||
            "Error While Importing Invoice Lines.",
        });
      }
      if (
        importInvoiceLinesResp.results[0] &&
        importInvoiceLinesResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "IMPORT_INVOICE_LINES_SUCCESS",
          payload: importInvoiceLinesResp,
        });
      }
    } else {
      dispatch({
        type: "IMPORT_INVOICE_LINES_FAIL",
        payload: "Error While Importing Invoice Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Invoice Lines.";
    dispatch({
      type: "IMPORT_INVOICE_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Invoice Lines*****------------------------
export const exportInvoiceLines = (invoiceLines) => async (dispatch) => {
  dispatch({
    type: "EXPORT_INVOICE_LINES_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "ExportInvoiceLines",
    invoiceLines,
  };

  try {
    let response = await Axios.post(url, data);
    let exportInvoiceLinesesp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (exportInvoiceLinesesp && exportInvoiceLinesesp.results.length > 0) {
      if (
        exportInvoiceLinesesp.results[0] &&
        exportInvoiceLinesesp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "EXPORT_INVOICE_LINES_FAIL",
          payload:
            exportInvoiceLinesesp.results[0].description ||
            "Error While Exporting Invoice Lines.",
        });
      }
      if (
        exportInvoiceLinesesp.results[0] &&
        exportInvoiceLinesesp.results[0].status === "Success"
      ) {
        dispatch({
          type: "EXPORT_INVOICE_LINES_SUCCESS",
          payload: exportInvoiceLinesesp,
        });
      }
    } else {
      dispatch({
        type: "EXPORT_INVOICE_LINES_FAIL",
        payload: "Error While Exporting Invoice Lines.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Invoice Lines.";
    dispatch({
      type: "EXPORT_INVOICE_LINES_FAIL",
      payload: error,
    });
  }
};
//----------------------****Regenerate Signatures*****-----------------------
export const regenerateSignatures = (tran) => async (dispatch) => {
  dispatch({
    type: "REGENERATING_SIGNATURE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let data = {
    actionType: "RegenerateSignatures",
    tran,
  };

  try {
    let result = await Axios.post(url, data);
    let res = (result && result.data && result.data.InvoiceResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Failed") {
        dispatch({
          type: "REGENERATING_SIGNATURE_FAIL",
          payload:
            res.results[0].description || "Error While Regenerating Signature.",
        });
      }
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "REGENERATING_SIGNATURE_SUCCESS",
          payload: res,
        });
      }
    } else {
      dispatch({
        type: "REGENERATING_SIGNATURE_FAIL",
        payload: "Error While Regenerating Signature.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Regenerating Signature.";
    dispatch({
      type: "REGENERATING_SIGNATURE_FAIL",
      payload: error,
    });
  }
};
//----------------------**** Transactions Requests*****----------------------
//----------------------****Get Transactions*****----------------------------
export const getTransactions =
  ({ currency, supplierCode }) =>
  async (dispatch) => {
    dispatch({
      type: "GET_TRANSACTIONS_INIT",
    });
    const url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/InvoiceRequest?actionType=GetTransactions&currency=${currency}&supplierCode=${supplierCode}`;

    try {
      let result = await Axios.get(url);
      let res = (result && result.data && result.data.InvoiceResponse) || "";
      if (res && res.results.length > 0) {
        if (res.results[0] && res.results[0].status === "Success") {
          dispatch({
            type: "GET_TRANSACTIONS_SUCCESS",
            payload: res,
          });
        } else {
          dispatch({
            type: "GET_TRANSACTIONS_FAIL",
            payload:
              res.results[0].description || "Error While Getting Transactions.",
          });
        }
      } else {
        dispatch({
          type: "GET_TRANSACTIONS_FAIL",
          payload: "Error While Getting Transactions.",
        });
      }
    } catch (err) {
      const error = err.message || "Error While Getting Transactions.";
      dispatch({
        type: "GET_TRANSACTIONS_FAIL",
        payload: error,
      });
    }
  };
//----------------------****Get Transaction Detail*****----------------------
export const getTransactionDetails = (tran) => async (dispatch) => {
  dispatch({
    type: "GET_TRANSACTION_DETAILS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/InvoiceRequest?actionType=GetTransactionDetails&tran=[${tran}]`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.InvoiceResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "GET_TRANSACTION_DETAILS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_TRANSACTION_DETAILS_FAIL",
          payload:
            res.results[0].description ||
            "Error While Getting Transaction Details.",
        });
      }
    } else {
      dispatch({
        type: "GET_TRANSACTION_DETAILS_FAIL",
        payload: "Error While Getting Transaction Details.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Transaction Details.";
    dispatch({
      type: "GET_TRANSACTION_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Transactions*****-------------------------
export const exportTransactions = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_TRANSACTIONS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";

  let obj = {
    actionType: "ExportTransactions",
    tran,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.InvoiceResponse) || "";
    if (res && res.results.length > 0) {
      if (res.results[0] && res.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_TRANSACTIONS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "EXPORT_TRANSACTIONS_FAIL",
          payload:
            res.results[0].description || "Error While Exporting Transactions.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_TRANSACTIONS_FAIL",
        payload: "Error While Exporting Transactions.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Transactions.";
    dispatch({
      type: "EXPORT_TRANSACTIONS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Post Invoice*****--------------------------------
export const postInvoice = (data) => async (dispatch) => {
  dispatch({
    type: "POST_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "PostInvoice",
    ...data,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "POST_INVOICE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "POST_INVOICE_FAIL",
          payload:
            resp.results[0].description || "Error While Posting Invoice.",
        });
      }
    } else {
      dispatch({
        type: "POST_INVOICE_FAIL",
        payload: "Error While Posting Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Posting Invoice.";
    dispatch({
      type: "POST_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Balance Tax*****---------------------------------
export const balanceTax = (tran) => async (dispatch) => {
  dispatch({
    type: "INVOICE_BALANCE_TAX_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "BalanceTax",
    tran,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "INVOICE_BALANCE_TAX_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "INVOICE_BALANCE_TAX_FAIL",
          payload:
            resp.results[0].description || "Error While Balancing The Tax.",
        });
      }
    } else {
      dispatch({
        type: "INVOICE_BALANCE_TAX_FAIL",
        payload: "Error While Balancing The Tax.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Balancing The Tax.";
    dispatch({
      type: "INVOICE_BALANCE_TAX_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Invoice*****------------------------------
export const exportInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ExportInvoice",
    tran,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_INVOICE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_INVOICE_FAIL",
          payload:
            resp.results[0].description || "Error While Exporting Invoice.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_INVOICE_FAIL",
        payload: "Error While Exporting Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Invoice.";
    dispatch({
      type: "EXPORT_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export to TPH*****-------------------------------
export const exportTPH = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_TPH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ExportTPH",
    tran,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_TPH_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_TPH_FAIL",
          payload: resp.results[0].description || "Error While Exporting TPH.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_TPH_FAIL",
        payload: "Error While Exporting TPH.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting TPH.";
    dispatch({
      type: "EXPORT_TPH_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Tax Invoice*****--------------------------
export const exportTaxInvoice = (tran) => async (dispatch) => {
  dispatch({
    type: "EXPORT_TAX_INVOICE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ExportTaxInvoice",
    tran,
  };

  try {
    let response = await Axios.post(url, obj);
    let resp =
      (response && response.data && response.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_TAX_INVOICE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_TAX_INVOICE_FAIL",
          payload:
            resp.results[0].description || "Error While Exporting Tax Invoice.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_TAX_INVOICE_FAIL",
        payload: "Error While Exporting Tax Invoice.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Tax Invoice.";
    dispatch({
      type: "EXPORT_TAX_INVOICE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Move Batch*****----------------------------------
export const moveBatch = (data) => async (dispatch) => {
  dispatch({
    type: "MOVE_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "MoveBatch",
    ...data,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "MOVE_BATCH_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "MOVE_BATCH_FAIL",
          payload: resp.results[0].description || "Error While Moving Batch.",
        });
      }
    } else {
      dispatch({
        type: "MOVE_BATCH_FAIL",
        payload: "Error While Moving Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Moving Batch.";
    dispatch({
      type: "MOVE_BATCH_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import Chq Request*****--------------------------
export const importChqRequest = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_CHQ_REQ_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ImportChqRequest",
    importData,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "IMPORT_CHQ_REQ_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_CHQ_REQ_FAIL",
          payload:
            resp.results[0].description || "Error While Importing Chq Request.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_CHQ_REQ_FAIL",
        payload: "Error While Importing Chq Request.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing Chq Request.";
    dispatch({
      type: "IMPORT_CHQ_REQ_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import List*****--------------------------
export const importList = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_LIST_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ImportList",
    importData,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "IMPORT_LIST_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_LIST_FAIL",
          payload: resp.results[0].description || "Error While Importing List.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_LIST_FAIL",
        payload: "Error While Importing List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing List.";
    dispatch({
      type: "IMPORT_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Import EP File*****--------------------------
export const importEPFile = (importData) => async (dispatch) => {
  dispatch({
    type: "IMPORT_EP_FILE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/InvoiceRequest";
  let obj = {
    actionType: "ImportEPFile",
    importData,
  };

  try {
    let result = await Axios.post(url, obj);
    let resp = (result && result.data && result.data.InvoiceResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "IMPORT_EP_FILE_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "IMPORT_EP_FILE_FAIL",
          payload:
            resp.results[0].description || "Error While Importing EP File.",
        });
      }
    } else {
      dispatch({
        type: "IMPORT_EP_FILE_FAIL",
        payload: "Error While Importing EP File.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Importing EP File.";
    dispatch({
      type: "IMPORT_EP_FILE_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear Invoice states****-------------------------
export function clearInvoiceStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_INVOICE_STATES",
    });
  };
}
