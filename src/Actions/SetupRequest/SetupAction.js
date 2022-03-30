const Axios = require("axios");

Axios.defaults.withCredentials = true;

//--------------------------------Get Btach List-----------------
export const getBtachList = (batchType) => async (dispatch) => {
  dispatch({
    type: "GET_BATCH_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetBatchList&batchType=${batchType}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_BATCH_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_BATCH_LIST_FAIL",
          payload:
            res.result[0].description || "Error While Getting Batch Lists.",
        });
      }
    } else {
      dispatch({
        type: "GET_BATCH_LIST_FAIL",
        payload: "Error While Getting Batch List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Batch List.";
    dispatch({
      type: "GET_BATCH_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Insert Batch------------------
export const insertBatch = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let batch = {
    actionType: "InsertBatch",
    ...data,
  };

  try {
    let result = await Axios.post(url, batch);

    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "INSERT_BATCH_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_BATCH_FAIL",
          payload: res.result[0].description || "Error While Adding Batch.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_BATCH_FAIL",
        payload: "Error While Adding Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Batch.";
    dispatch({
      type: "INSERT_BATCH_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Delete Batch-------------------
export const deleteBatch = (batchNo) => async (dispatch) => {
  dispatch({
    type: "DELETE_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let data = {
    actionType: "DeleteBatch",
    batchNo,
  };

  try {
    let result = await Axios.post(url, data);

    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "DELETE_BATCH_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_BATCH_FAIL",
          payload: res.result[0].description || "Error While Deleting Batch.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_BATCH_FAIL",
        payload: "Error While Deleting Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Batch.";
    dispatch({
      type: "DELETE_BATCH_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Batch-------------------
export const updateBatch = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_BATCH_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let batch = {
    actionType: "UpdateBatch",
    ...data,
  };

  try {
    let result = await Axios.post(url, batch);

    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_BATCH_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_BATCH_FAIL",
          payload: res.result[0].description || "Error While Updating Batch.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_BATCH_FAIL",
        payload: "Error While Updating Batch.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Batch.";
    dispatch({
      type: "UPDATE_BATCH_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Bussiness Unit List---------
export const getBusinessUnitList = () => async (dispatch) => {
  dispatch({
    type: "GET_BUSSINES_UNIT_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetBusinessUnitList";

  try {
    let response = await Axios.get(url);
    let businessUnitResp =
      (response && response.data && response.data.SetupResponse) || "";
    if (businessUnitResp && businessUnitResp.result.length > 0) {
      if (
        businessUnitResp.result[0] &&
        businessUnitResp.result[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_BUSSINES_UNIT_LIST_FAIL",
          payload:
            businessUnitResp.result[0].description ||
            "Error While Getting Bussiness Unit Lists.",
        });
      }
      if (
        businessUnitResp.result[0] &&
        businessUnitResp.result[0].status === "Success"
      ) {
        dispatch({
          type: "GET_BUSSINES_UNIT_LIST_SUCCESS",
          payload: businessUnitResp,
        });
      }
    } else {
      dispatch({
        type: "GET_BUSSINES_UNIT_LIST_FAIL",
        payload: "Error While Getting Bussiness Unit List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Bussiness Unit List.";
    dispatch({
      type: "GET_BUSSINES_UNIT_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Bussiness Unit -------------
export const getBusinessUnit = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_BUSSINESS_UNIT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetBusinessUnit&recordID=${recordID}`;

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_BUSSINESS_UNIT_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_BUSSINESS_UNIT_FAIL",
          payload:
            res.result[0].description || "Error While Getting Bussiness Unit.",
        });
      }
    } else {
      dispatch({
        type: "GET_BUSSINESS_UNIT_FAIL",
        payload: "Error While Getting Bussiness Unit.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Bussiness Unit.";
    dispatch({
      type: "GET_BUSSINESS_UNIT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Delete Bussiness Unit ----------
export const deleteBussinessunit = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_BUSSINESS_UNIT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let data = {
    actionType: "DeleteBusinessUnit",
    recordID,
  };
  try {
    let response = await Axios.post(url, data);

    let res = (response && response.data && response.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "DELETE_BUSSINESS_UNIT_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_BUSSINESS_UNIT_FAIL",
          payload:
            res.result[0].description || "Error While Deleting Bussiness Unit.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_BUSSINESS_UNIT_FAIL",
        payload: "Error While Deleting Bussiness Unit.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Bussiness Unit.";
    dispatch({
      type: "DELETE_BUSSINESS_UNIT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Insert Bussiness Unit -----------
export const insertBusinessUnit = () => async (dispatch) => {
  dispatch({
    type: "INSERT_BUSSINESS_UNIT_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=InsertBusinessUnit";

  try {
    let response = await Axios.get(url);

    let res = (response && response.data && response.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "INSERT_BUSSINESS_UNIT_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_BUSSINESS_UNIT_FAIL",
          payload:
            res.result[0].description ||
            "Error While Inserting Bussiness Unit.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_BUSSINESS_UNIT_FAIL",
        payload: "Error While Inserting Bussiness Unit.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Bussiness Unit.";
    dispatch({
      type: "INSERT_BUSSINESS_UNIT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Bussiness Unit -----------
export const updateBussinessUnit = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_BUSSINESS_UNIT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let bussinessUnit = {
    actionType: "UpdateBusinessUnit",
    ...data,
  };

  try {
    let response = await Axios.post(url, bussinessUnit);

    let res = (response && response.data && response.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_BUSSINESS_UNIT_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_BUSSINESS_UNIT_FAIL",
          payload:
            res.result[0].description || "Error While Updating Bussiness Unit.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_BUSSINESS_UNIT_FAIL",
        payload: "Error While Updating Bussiness Unit.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Batch.";
    dispatch({
      type: "UPDATE_BUSSINESS_UNIT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Prime Invoice OCR ------------
export const primeInvoiceOCR = () => async (dispatch) => {
  dispatch({
    type: "PRIME_INVOICE_OCR_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=PrimeInvoiceOCR";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "PRIME_INVOICE_OCR_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "PRIME_INVOICE_OCR_FAIL",
          payload:
            res.result[0].description || "Error While Priming Invoice OCR.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_INVOICE_OCR_FAIL",
        payload: "Error While Priming Invoice OCR.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Invoice OCR.";
    dispatch({
      type: "PRIME_INVOICE_OCR_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Invoice OCR List ------------
export const getInvoiceOCRList = () => async (dispatch) => {
  dispatch({
    type: "GET_INVOICE_OCR_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetInvoiceOCRList";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_INVOICE_OCR_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_INVOICE_OCR_LIST_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Invoice OCR Lists.",
        });
      }
    } else {
      dispatch({
        type: "GET_INVOICE_OCR_LIST_FAIL",
        payload: "Error While Getting Invoice OCR List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Invoice OCR List.";
    dispatch({
      type: "GET_INVOICE_OCR_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Invoice OCR List ------------
export const updateInvoiceOCRList = (ocrList) => async (dispatch) => {
  dispatch({
    type: "UPDATE_INVOICE_OCR_LIST_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let lst = {
    actionType: "UpdateInvoiceOCRList",
    ocrList,
  };

  try {
    let result = await Axios.post(url, lst);

    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_INVOICE_OCR_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_INVOICE_OCR_LIST_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Invoice OCR Lists.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_INVOICE_OCR_LIST_FAIL",
        payload: "Error While Updating Invoice OCR List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Invoice OCR List.";
    dispatch({
      type: "UPDATE_INVOICE_OCR_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Order Template List--------
export const getOrderTemplatesList = () => async (dispatch) => {
  dispatch({
    type: "GET_ORDER_TEMPLATE_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetOrderTemplatesList";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_ORDER_TEMPLATE_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_ORDER_TEMPLATE_LIST_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Order Template List.",
        });
      }
    } else {
      dispatch({
        type: "GET_ORDER_TEMPLATE_LIST_FAIL",
        payload: "Error While Getting Order Template List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Order Template List.";
    dispatch({
      type: "GET_ORDER_TEMPLATE_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Order Template--------------
export const getOrderTemplate = (templateName) => async (dispatch) => {
  dispatch({
    type: "GET_ORDER_TEMPLATE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetOrderTemplate&templateName=${templateName}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_ORDER_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_ORDER_TEMPLATE_FAIL",
          payload:
            res.result[0].description || "Error While Getting Order Template.",
        });
      }
    } else {
      dispatch({
        type: "GET_ORDER_TEMPLATE_FAIL",
        payload: "Error While Getting Order Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Order Template.";
    dispatch({
      type: "GET_ORDER_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Order Template--------------
export const updateOrderTemplate = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_ORDER_TEMPLATE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let obj = {
    actionType: "UpdateOrderTemplate",
    ...data,
  };

  try {
    let result = await Axios.post(url, obj);

    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_ORDER_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_ORDER_TEMPLATE_FAIL",
          payload:
            res.result[0].description || "Error While Updating Order Template.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_ORDER_TEMPLATE_FAIL",
        payload: "Error While Updating Order Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Order Template.";
    dispatch({
      type: "UPDATE_ORDER_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get email Template List--------
export const getEmailTemplatesList = () => async (dispatch) => {
  dispatch({
    type: "GET_EMAIL_TEMPLATE_LIST_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetEmailTemplatesList";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_EMAIL_TEMPLATE_LIST_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_EMAIL_TEMPLATE_LIST_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Email Template List.",
        });
      }
    } else {
      dispatch({
        type: "GET_EMAIL_TEMPLATE_LIST_FAIL",
        payload: "Error While Getting Email Template List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Email Template List.";
    dispatch({
      type: "GET_EMAIL_TEMPLATE_LIST_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get email Type Options--------
export const getEmailTypeOptions = () => async (dispatch) => {
  dispatch({
    type: "GET_EMAIL_TYPE_OPTIONS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetEmailTypeOptions";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_EMAIL_TYPE_OPTIONS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_EMAIL_TYPE_OPTIONS_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Email Type Options.",
        });
      }
    } else {
      dispatch({
        type: "GET_EMAIL_TYPE_OPTIONS_FAIL",
        payload: "Error While Getting Email Type Options.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Email Type Options.";
    dispatch({
      type: "GET_EMAIL_TYPE_OPTIONS_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get email Template Detail--------
export const getEmailTemplate = (templateName) => async (dispatch) => {
  dispatch({
    type: "GET_EMAIL_TEMPLATE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetEmailTemplate&templateName=${templateName}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_EMAIL_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_EMAIL_TEMPLATE_FAIL",
          payload:
            res.result[0].description || "Error While Getting Email Template.",
        });
      }
    } else {
      dispatch({
        type: "GET_EMAIL_TEMPLATE_FAIL",
        payload: "Error While Getting Email Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Email Template.";
    dispatch({
      type: "GET_EMAIL_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Insert Email Template--------
export const insertEmailTemplate = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_EMAIL_TEMPLATE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let temp = {
    actionType: "InsertEmailTemplate",
    ...data,
  };

  try {
    let result = await Axios.post(url, temp);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "INSERT_EMAIL_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_EMAIL_TEMPLATE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Inserting Email Template.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_EMAIL_TEMPLATE_FAIL",
        payload: "Error While Inserting Email Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Email Template.";
    dispatch({
      type: "INSERT_EMAIL_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Email Template--------
export const updateEmailTemplate = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_EMAIL_TEMPLATE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let temp = {
    actionType: "UpdateEmailTemplate",
    ...data,
  };

  try {
    let result = await Axios.post(url, temp);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_EMAIL_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_EMAIL_TEMPLATE_FAIL",
          payload:
            res.result[0].description || "Error While Updating Email Template.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_EMAIL_TEMPLATE_FAIL",
        payload: "Error While Updating Email Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Email Template.";
    dispatch({
      type: "UPDATE_EMAIL_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Delete Email Template--------
export const deleteEmailTemplate = (templateName) => async (dispatch) => {
  dispatch({
    type: "DELETE_EMAIL_TEMPLATE_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let temp = {
    actionType: "DeleteEmailTemplate",
    templateName,
  };

  try {
    let result = await Axios.post(url, temp);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "DELETE_EMAIL_TEMPLATE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_EMAIL_TEMPLATE_FAIL",
          payload:
            res.result[0].description || "Error While Deleting Email Template.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_EMAIL_TEMPLATE_FAIL",
        payload: "Error While Deleting Email Template.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Email Template.";
    dispatch({
      type: "DELETE_EMAIL_TEMPLATE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Add Email Attachment--------
export const addEmailAttachment = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_EMAIL_ATTACHMENT_INIT",
  });

  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let temp = {
    actionType: "AddEmailAttachment",
    ...obj,
  };

  try {
    let result = await Axios.post(url, temp);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "ADD_EMAIL_ATTACHMENT_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "ADD_EMAIL_ATTACHMENT_FAIL",
          payload:
            res.result[0].description || "Error While Adding Email Attachment.",
        });
      }
    } else {
      dispatch({
        type: "ADD_EMAIL_ATTACHMENT_FAIL",
        payload: "Error While Adding Email Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Email Attachment.";
    dispatch({
      type: "ADD_EMAIL_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Placeholders--------
export const getPlaceholders = (emailType) => async (dispatch) => {
  dispatch({
    type: "GET_PLACEHOLDERS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetPlaceholders&emailType=${emailType}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_PLACEHOLDERS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_PLACEHOLDERS_FAIL",
          payload:
            res.result[0].description || "Error While Getting Placeholders.",
        });
      }
    } else {
      dispatch({
        type: "GET_PLACEHOLDERS_FAIL",
        payload: "Error While Getting Placeholders.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Placeholders.";
    dispatch({
      type: "GET_PLACEHOLDERS_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Placeholders--------
export const updatePlaceholders = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_PLACEHOLDERS_INIT",
  });
  const url = localStorage.getItem("API_URL") + `/DPFAPI/SetupRequest`;

  let obj = {
    actionType: "UpdatePlaceholders",
    ...data,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_PLACEHOLDERS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_PLACEHOLDERS_FAIL",
          payload:
            res.result[0].description || "Error While Updating Placeholders.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_PLACEHOLDERS_FAIL",
        payload: "Error While Updating Placeholders.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Placeholders.";
    dispatch({
      type: "UPDATE_PLACEHOLDERS_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Prime Custom Fields--------
export const primeCustomField = () => async (dispatch) => {
  dispatch({
    type: "PRIME_CUSTOM_FIELD_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=PrimeCustomField";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "PRIME_CUSTOM_FIELD_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "PRIME_CUSTOM_FIELD_FAIL",
          payload:
            res.result[0].description || "Error While Priming Custom Field.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_CUSTOM_FIELD_FAIL",
        payload: "Error While Priming Custom Field.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Custom Field.";
    dispatch({
      type: "PRIME_CUSTOM_FIELD_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Custom Fields--------
export const getCustomFields = () => async (dispatch) => {
  dispatch({
    type: "GET_CUSTOM_FIELDS_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetCustomFields";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_CUSTOM_FIELDS_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_CUSTOM_FIELDS_FAIL",
          payload:
            res.result[0].description || "Error While Getting Custom Fields.",
        });
      }
    } else {
      dispatch({
        type: "GET_CUSTOM_FIELDS_FAIL",
        payload: "Error While Getting Custom Fields.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Custom Fields.";
    dispatch({
      type: "GET_CUSTOM_FIELDS_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Custom Field--------
export const getCustomField = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_CUSTOM_FIELD_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetCustomField&recordID=${recordID}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_CUSTOM_FIELD_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_CUSTOM_FIELD_FAIL",
          payload:
            res.result[0].description || "Error While Getting Custom Field.",
        });
      }
    } else {
      dispatch({
        type: "GET_CUSTOM_FIELD_FAIL",
        payload: "Error While Getting Custom Field.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Custom Field.";
    dispatch({
      type: "GET_CUSTOM_FIELD_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Delete Custom Field--------
export const deleteCustomField = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_CUSTOM_FIELD_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=DeleteCustomField&recordID=${recordID}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "DELETE_CUSTOM_FIELD_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_CUSTOM_FIELD_FAIL",
          payload:
            res.result[0].description || "Error While Deleting Custom Field.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_CUSTOM_FIELD_FAIL",
        payload: "Error While Deleting Custom Field.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Custom Field.";
    dispatch({
      type: "DELETE_CUSTOM_FIELD_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Insert Custom Field--------
export const insertCustomField = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_CUSTOM_FIELD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let obj = {
    actionType: "InsertCustomField",
    ...data,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "INSERT_CUSTOM_FIELD_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_CUSTOM_FIELD_FAIL",
          payload:
            res.result[0].description || "Error While Inserting Custom Field.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_CUSTOM_FIELD_FAIL",
        payload: "Error While Inserting Custom Field.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Custom Field.";
    dispatch({
      type: "INSERT_CUSTOM_FIELD_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Custom Field--------
export const updateCustomField = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_CUSTOM_FIELD_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let obj = {
    actionType: "UpdateCustomField",
    ...data,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_CUSTOM_FIELD_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_CUSTOM_FIELD_FAIL",
          payload:
            res.result[0].description || "Error While Updating Custom Field.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_CUSTOM_FIELD_FAIL",
        payload: "Error While Updating Custom Field.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Custom Field.";
    dispatch({
      type: "UPDATE_CUSTOM_FIELD_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Prime Custom Line Type--------
export const primeCustomLineType = () => async (dispatch) => {
  dispatch({
    type: "PRIME_CUSTOM_LINE_TYPE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=PrimeCustomLineType";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "PRIME_CUSTOM_LINE_TYPE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "PRIME_CUSTOM_LINE_TYPE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Priming Custom Line Type.",
        });
      }
    } else {
      dispatch({
        type: "PRIME_CUSTOM_LINE_TYPE_FAIL",
        payload: "Error While Priming Custom Line Type.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Priming Custom Line Type.";
    dispatch({
      type: "PRIME_CUSTOM_LINE_TYPE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Insert Custom Line Type--------
export const insertCustomLineType = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_CUSTOM_LINE_TYPE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let obj = {
    actionType: "InsertCustomLineType",
    ...data,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "INSERT_CUSTOM_LINE_TYPE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "INSERT_CUSTOM_LINE_TYPE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Inserting Custom Line Type.",
        });
      }
    } else {
      dispatch({
        type: "INSERT_CUSTOM_LINE_TYPE_FAIL",
        payload: "Error While Inserting Custom Line Type.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Custom Line Type.";
    dispatch({
      type: "INSERT_CUSTOM_LINE_TYPE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Update Custom Line Type--------
export const updateCustomLineType = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_CUSTOM_LINE_TYPE_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SetupRequest";

  let obj = {
    actionType: "UpdateCustomLineType",
    ...data,
  };
  try {
    let result = await Axios.post(url, obj);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "UPDATE_CUSTOM_LINE_TYPE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "UPDATE_CUSTOM_LINE_TYPE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Updating Custom Line Type.",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_CUSTOM_LINE_TYPE_FAIL",
        payload: "Error While Updating Custom Line Type.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Custom Line Type.";
    dispatch({
      type: "UPDATE_CUSTOM_LINE_TYPE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Delete Custom Line Type--------
export const deleteCustomLineType = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_CUSTOM_LINE_TYPE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=DeleteCustomLineType&recordID=${recordID}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "DELETE_CUSTOM_LINE_TYPE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "DELETE_CUSTOM_LINE_TYPE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Deleting Custom Line Type.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_CUSTOM_LINE_TYPE_FAIL",
        payload: "Error While Deleting Custom Line Type.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Custom Line Type.";
    dispatch({
      type: "DELETE_CUSTOM_LINE_TYPE_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Custom Line Types--------
export const getCustomLineTypes = () => async (dispatch) => {
  dispatch({
    type: "GET_CUSTOM_LINE_TYPES_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    "/DPFAPI/SetupRequest?actionType=GetCustomLineTypes";

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_CUSTOM_LINE_TYPES_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_CUSTOM_LINE_TYPES_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Custom Line Types.",
        });
      }
    } else {
      dispatch({
        type: "GET_CUSTOM_LINE_TYPES_FAIL",
        payload: "Error While Getting Custom Line Types.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Custom Line Types.";
    dispatch({
      type: "GET_CUSTOM_LINE_TYPES_FAIL",
      payload: error,
    });
  }
};
//--------------------------------Get Custom Line Type--------
export const getCustomLineType = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_CUSTOM_LINE_TYPE_INIT",
  });
  const url =
    localStorage.getItem("API_URL") +
    `/DPFAPI/SetupRequest?actionType=GetCustomLineType&recordID=${recordID}`;

  try {
    let result = await Axios.get(url);
    let res = (result && result.data && result.data.SetupResponse) || "";
    if (res && res.result.length > 0) {
      if (res.result[0] && res.result[0].status === "Success") {
        dispatch({
          type: "GET_CUSTOM_LINE_TYPE_SUCCESS",
          payload: res,
        });
      } else {
        dispatch({
          type: "GET_CUSTOM_LINE_TYPE_FAIL",
          payload:
            res.result[0].description ||
            "Error While Getting Custom Line Type.",
        });
      }
    } else {
      dispatch({
        type: "GET_CUSTOM_LINE_TYPE_FAIL",
        payload: "Error While Getting Custom Line Type.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Custom Line Type.";
    dispatch({
      type: "GET_CUSTOM_LINE_TYPE_FAIL",
      payload: error,
    });
  }
};
export function clearSetupStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_SETUP_STATES",
    });
  };
}
