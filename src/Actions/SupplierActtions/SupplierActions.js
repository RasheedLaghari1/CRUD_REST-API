const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Supplier Actions****-----------------------------

//----------------------****Get Suppliers List****---------------------------
export const getSuppliersList = (currency, previousSupplier, module) => async (
  dispatch
) => {
  dispatch({
    type: "GET_SUPPLIERS_LIST_INIT",
  });
  let url;
  if (currency && module) {
    url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/SupplierRequest?actionType=GetSuppliersList&currency=${currency}&module=${module}`;
  } else if (module) {
    url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/SupplierRequest?actionType=GetSuppliersList&module=${module}`;
  } else if (previousSupplier) {
    //in Search Page while getting the suppliers list then previous suppliers check will be used
    url =
      localStorage.getItem("API_URL") +
      `/DPFAPI/SupplierRequest?actionType=GetSuppliersList&previousSupplier=${previousSupplier}`;
  } else {
    url =
      localStorage.getItem("API_URL") +
      "/DPFAPI/SupplierRequest?actionType=GetSuppliersList";
  }

  try {
    // let response = getSuppliersList_api;

    let response = await Axios.get(url);
    let getSupplierResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (getSupplierResp && getSupplierResp.results.length > 0) {
      if (
        getSupplierResp.results[0] &&
        getSupplierResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_SUPPLIERS_LIST_FAIL",
          payload:
            getSupplierResp.results[0].description ||
            "Error While Getting Suppliers List.",
        });
      }
      if (
        getSupplierResp.results[0] &&
        getSupplierResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_SUPPLIERS_LIST_SUCCESS",
          payload: getSupplierResp,
        });
      }
    } else {
      dispatch({
        type: "GET_SUPPLIERS_LIST_FAIL",
        payload: "Error While Getting Suppliers List.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Suppliers List.";
    dispatch({
      type: "GET_SUPPLIERS_LIST_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Single Supplier ****-------------------------
export const getSupplier = (data) => async (dispatch) => {
  dispatch({
    type: "GET_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "GetSupplier",
    supplierDetails: {
      ...data,
    },
  };
  try {
    // let response = getSupplier_api;

    let response = await Axios.post(url, supplierData);
    let getSupplierResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (getSupplierResp && getSupplierResp.results.length > 0) {
      if (
        getSupplierResp.results[0] &&
        getSupplierResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_SUPPLIER_FAIL",
          payload:
            getSupplierResp.results[0].description ||
            "Error While Getting Supplier.",
        });
      }
      if (
        getSupplierResp.results[0] &&
        getSupplierResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_SUPPLIER_SUCCESS",
          payload: getSupplierResp,
        });
      }
    } else {
      dispatch({
        type: "GET_SUPPLIER_FAIL",
        payload: "Error While Getting Supplier.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Supplier.";
    dispatch({
      type: "GET_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Supplier Details ****------------------------
export const getSupplierDetails = (data) => async (dispatch) => {
  dispatch({
    type: "GET_SUPPLIER_DETAILS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "GetSupplierDetails",
    supplierDetails: {
      ...data,
    },
  };
  try {
    let response = await Axios.post(url, supplierData);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";

    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_SUPPLIER_DETAILS_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Getting Supplier Details",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_SUPPLIER_DETAILS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_SUPPLIER_DETAILS_FAIL",
        payload: "Error While Getting Suppliers Details",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Suppliers Details";
    dispatch({
      type: "GET_SUPPLIER_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Supplier Details ****---------------------
export const updateSupplierDetails = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SUPPLIER_DETAILS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "UpdateSupplierDetails",
    ...data,
  };
  try {
    let response = await Axios.post(url, supplierData);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";

    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "UPDATE_SUPPLIER_DETAILS_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Updating Supplier Details",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "UPDATE_SUPPLIER_DETAILS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SUPPLIER_DETAILS_FAIL",
        payload: "Error While Updating Supplier Details",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Supplier Details";
    dispatch({
      type: "UPDATE_SUPPLIER_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Call prime Supplier Details ****-----------------
export const primeSupplierDetails = () => async (dispatch) => {
  dispatch({
    type: "PRIME_SUPPLIER_DETAILS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "PrimeSupplierDetails",
  };
  try {
    let response = await Axios.post(url, supplierData);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";

    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "PRIME_SUPPLIER_DETAILS_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Calling the Prime Suppliers Details ",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "PRIME_SUPPLIER_DETAILS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "PRIME_SUPPLIER_DETAILS_FAIL",
        payload: "Error While Calling Prime Suppliers Details",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Calling Prime Suppliers Details";
    dispatch({
      type: "PRIME_SUPPLIER_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Insert Supplier Details ****---------------------
export const insertSupplierDetails = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_SUPPLIER_DETAILS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "InsertSupplierDetails",
    ...data,
  };
  try {
    let response = await Axios.post(url, supplierData);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";

    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "INSERT_SUPPLIER_DETAILS_FAIL",
          payload:
            resp.results[0].description ||
            "Error While Inserting Supplier Details",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "INSERT_SUPPLIER_DETAILS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "INSERT_SUPPLIER_DETAILS_FAIL",
        payload: "Error While Inserting Supplier Details",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Inserting Supplier Details";
    dispatch({
      type: "INSERT_SUPPLIER_DETAILS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Supplier ****-----------------------------
export const updateSupplier = (data) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "UpdateSupplier",
    ...data,
  };
  try {
    // let response = updateSupplier_api;

    let response = await Axios.post(url, supplierData);
    let updateSupplierResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (updateSupplierResp && updateSupplierResp.results.length > 0) {
      if (
        updateSupplierResp.results[0] &&
        updateSupplierResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_SUPPLIER_FAIL",
          payload:
            updateSupplierResp.results[0].description ||
            "Error While Updating Supplier.",
        });
      }
      if (
        updateSupplierResp.results[0] &&
        updateSupplierResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_SUPPLIER_SUCCESS",
          payload: updateSupplierResp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SUPPLIER_FAIL",
        payload: "Error While Updating Supplier.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Supplier.";
    dispatch({
      type: "UPDATE_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//---------------------****Insert Supplier ****------------------------------
export const insertSupplier = (data) => async (dispatch) => {
  dispatch({
    type: "INSERT_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "InsertSupplier",
    ...data,
  };
  try {
    // let response = insertSupplier_api;

    let response = await Axios.post(url, supplierData);
    let insertSupplierResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (insertSupplierResp && insertSupplierResp.results.length > 0) {
      if (
        insertSupplierResp.results[0] &&
        insertSupplierResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "INSERT_SUPPLIER_FAIL",
          payload:
            insertSupplierResp.results[0].description ||
            "Error While inserting Supplier.",
        });
      }
      if (
        insertSupplierResp.results[0] &&
        insertSupplierResp.results[0].status === "Success"
      ) {
        let insertedData = data;
        let obj = {
          insertedData,
          insertSupplierResp,
        };
        dispatch({
          type: "INSERT_SUPPLIER_SUCCESS",
          payload: obj,
        });
      }
    } else {
      dispatch({
        type: "INSERT_SUPPLIER_FAIL",
        payload: "Error While inserting Supplier.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While inserting Supplier.";
    dispatch({
      type: "INSERT_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get  Supplier's contacts ****--------------------
export const getSupplierContacts = (data) => async (dispatch) => {
  dispatch({
    type: "GET_SUPPLIER_CONTACTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const supplierData = {
    actionType: "GetSupplierContacts",
    supplierDetails: {
      ...data,
    },
  };
  try {
    let response = await Axios.post(url, supplierData);
    let getSupplierContactsResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (getSupplierContactsResp && getSupplierContactsResp.results.length > 0) {
      if (
        getSupplierContactsResp.results[0] &&
        getSupplierContactsResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "GET_SUPPLIER_CONTACTS_FAIL",
          payload:
            getSupplierContactsResp.results[0].description ||
            "Error While Getting Suppliers Contacts.",
        });
      }
      if (
        getSupplierContactsResp.results[0] &&
        getSupplierContactsResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "GET_SUPPLIER_CONTACTS_SUCCESS",
          payload: getSupplierContactsResp,
        });
      }
    } else {
      dispatch({
        type: "GET_SUPPLIER_CONTACTS_FAIL",
        payload: "Error While Getting Suppliers Contacts.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Suppliers Contacts.";
    dispatch({
      type: "GET_SUPPLIER_CONTACTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Supplier's Contact ****-------------------
export const updateSuppliersContact = (contact) => async (dispatch) => {
  dispatch({
    type: "UPDATE_SUPPLIER_CONTACT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const contactData = {
    actionType: "UpdateSupplierContact",
    ...contact,
  };
  try {
    // let response = updateSupplier_api;

    let response = await Axios.post(url, contactData);
    let updateSuppliersContactResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (
      updateSuppliersContactResp &&
      updateSuppliersContactResp.results.length > 0
    ) {
      if (
        updateSuppliersContactResp.results[0] &&
        updateSuppliersContactResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "UPDATE_SUPPLIER_CONTACT_FAIL",
          payload:
            updateSuppliersContactResp.results[0].description ||
            "Error While Updating Supplier's Contact.",
        });
      }
      if (
        updateSuppliersContactResp.results[0] &&
        updateSuppliersContactResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "UPDATE_SUPPLIER_CONTACT_SUCCESS",
          payload: updateSuppliersContactResp,
        });
      }
    } else {
      dispatch({
        type: "UPDATE_SUPPLIER_CONTACT_FAIL",
        payload: "Error While Updating Supplier's Contact.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Updating Supplier's Contact.";
    dispatch({
      type: "UPDATE_SUPPLIER_CONTACT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Update Supplier's Contact ****-------------------
export const addSuppliersContact = (contact) => async (dispatch) => {
  dispatch({
    type: "ADD_SUPPLIER_CONTACT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const contactData = {
    actionType: "AddSupplierContact",
    ...contact,
  };
  try {
    let response = await Axios.post(url, contactData);
    let addSuppliersContactResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (addSuppliersContactResp && addSuppliersContactResp.results.length > 0) {
      if (
        addSuppliersContactResp.results[0] &&
        addSuppliersContactResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "ADD_SUPPLIER_CONTACT_FAIL",
          payload:
            addSuppliersContactResp.results[0].description ||
            "Error While Adding Supplier's Contact.",
        });
      }
      if (
        addSuppliersContactResp.results[0] &&
        addSuppliersContactResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "ADD_SUPPLIER_CONTACT_SUCCESS",
          payload: addSuppliersContactResp,
        });
      }
    } else {
      dispatch({
        type: "ADD_SUPPLIER_CONTACT_FAIL",
        payload: "Error While Adding Supplier's Contact.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Adding Supplier's Contact.";
    dispatch({
      type: "ADD_SUPPLIER_CONTACT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Supplier's Contact ****-------------------
export const deleteSuppliersContact = (contactID) => async (dispatch) => {
  dispatch({
    type: "DELETE_SUPPLIER_CONTACT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";

  const contactData = {
    actionType: "DeleteSupplierContact",
    contactID,
  };
  try {
    let response = await Axios.post(url, contactData);
    let deleteSuppliersContactResp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (
      deleteSuppliersContactResp &&
      deleteSuppliersContactResp.results.length > 0
    ) {
      if (
        deleteSuppliersContactResp.results[0] &&
        deleteSuppliersContactResp.results[0].status === "Failed"
      ) {
        dispatch({
          type: "DELETE_SUPPLIER_CONTACT_FAIL",
          payload:
            deleteSuppliersContactResp.results[0].description ||
            "Error While Deleting Supplier's Contact.",
        });
      }
      if (
        deleteSuppliersContactResp.results[0] &&
        deleteSuppliersContactResp.results[0].status === "Success"
      ) {
        dispatch({
          type: "DELETE_SUPPLIER_CONTACT_SUCCESS",
          payload: deleteSuppliersContactResp,
        });
      }
    } else {
      dispatch({
        type: "DELETE_SUPPLIER_CONTACT_FAIL",
        payload: "Error While Deleting Supplier's Contact.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Supplier's Contact.";
    dispatch({
      type: "DELETE_SUPPLIER_CONTACT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Add Supplier Attachments*****--------------------
export const addSupAttachments = (obj) => async (dispatch) => {
  dispatch({
    type: "ADD_SUP_ATTACHMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "AddAttachment",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "ADD_SUP_ATTACHMENTS_FAIL",
          payload:
            resp.results[0].description || "Error While Uploading Attachments.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "ADD_SUP_ATTACHMENTS_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "ADD_SUP_ATTACHMENTS_FAIL",
        payload: "Error While Uploading Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Uploading Attachments.";
    dispatch({
      type: "ADD_SUP_ATTACHMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Supplier's Attachment*****-------------------
export const getAttachment = (recordID) => async (dispatch) => {
  dispatch({
    type: "GET_SUP_ATTACHMENT_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "GetAttachment",
    recordID,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Failed") {
        dispatch({
          type: "GET_SUP_ATTACHMENT_FAIL",
          payload:
            resp.results[0].description || "Error While Getting Attachment.",
        });
      }
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_SUP_ATTACHMENT_SUCCESS",
          payload: resp,
        });
      }
    } else {
      dispatch({
        type: "GET_SUP_ATTACHMENT_FAIL",
        payload: "Error While Getting Attachment.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Attachment.";
    dispatch({
      type: "GET_SUP_ATTACHMENT_FAIL",
      payload: error,
    });
  }
};
//----------------------****Delete Supplier Attachments*****-----------------
export const deleteSupAttachments = (recordID) => async (dispatch) => {
  dispatch({
    type: "DELETE_SUP_ATTACHMENTS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "DeleteAttachment",
    recordID,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "DELETE_SUP_ATTACHMENTS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "DELETE_SUP_ATTACHMENTS_FAIL",
          payload:
            resp.results[0].description || "Error While Deleting Attachments.",
        });
      }
    } else {
      dispatch({
        type: "DELETE_SUP_ATTACHMENTS_FAIL",
        payload: "Error While Deleting Attachments.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Deleting Attachments.";
    dispatch({
      type: "DELETE_SUP_ATTACHMENTS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Unlock Supplier*****----------------------------
export const unlockSupplier = (obj) => async (dispatch) => {
  dispatch({
    type: "UNLOCK_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "UnlockSupplier",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "UNLOCK_SUPPLIER_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "UNLOCK_SUPPLIER_FAIL",
          payload:
            resp.results[0].description || "Error While Unloking The Suppleir.",
        });
      }
    } else {
      dispatch({
        type: "UNLOCK_SUPPLIER_FAIL",
        payload: "Error While Unloking The Suppleir.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Unloking The Suppleir.";
    dispatch({
      type: "UNLOCK_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Approve Supplier*****----------------------------
export const approveSupplier = (obj) => async (dispatch) => {
  dispatch({
    type: "APPROVE_SUPPLIER_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "ApproveSupplier",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "APPROVE_SUPPLIER_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "APPROVE_SUPPLIER_FAIL",
          payload:
            resp.results[0].description || "Error While Approving The Suppleir.",
        });
      }
    } else {
      dispatch({
        type: "APPROVE_SUPPLIER_FAIL",
        payload: "Error While Approving The Suppleir.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Approving The Suppleir.";
    dispatch({
      type: "APPROVE_SUPPLIER_FAIL",
      payload: error,
    });
  }
};
//----------------------****Get Supplier Activity*****------------------------
export const getSupplierActivity = (obj) => async (dispatch) => {
  dispatch({
    type: "GET_SUPPLIER_ACTIVITY_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "GetSupplierActivity",
    ...obj,
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "GET_SUPPLIER_ACTIVITY_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "GET_SUPPLIER_ACTIVITY_FAIL",
          payload:
            resp.results[0].description || "Error While Getting Suppleir Activity.",
        });
      }
    } else {
      dispatch({
        type: "GET_SUPPLIER_ACTIVITY_FAIL",
        payload: "Error While Getting Suppleir Activity.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Getting Suppleir Activity.";
    dispatch({
      type: "GET_SUPPLIER_ACTIVITY_FAIL",
      payload: error,
    });
  }
};
//----------------------****Export Suppliers*****-----------------------------
export const exportSuppliers = (supplierID) => async (dispatch) => {
  dispatch({
    type: "EXPORT_SUPPLIERS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "ExportSuppliers",
    supplierID
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "EXPORT_SUPPLIERS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "EXPORT_SUPPLIERS_FAIL",
          payload:
            resp.results[0].description || "Error While Exporting Suppleirs.",
        });
      }
    } else {
      dispatch({
        type: "EXPORT_SUPPLIERS_FAIL",
        payload: "Error While Exporting Suppleirs.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Exporting Suppleirs.";
    dispatch({
      type: "EXPORT_SUPPLIERS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Paste Suppliers*****-----------------------------
export const pasteSuppliers = (excelData) => async (dispatch) => {
  dispatch({
    type: "PASTE_SUPPLIERS_INIT",
  });
  const url = localStorage.getItem("API_URL") + "/DPFAPI/SupplierRequest";
  let data = {
    actionType: "PasteSuppliers",
    excelData
  };

  try {
    let response = await Axios.post(url, data);
    let resp =
      (response && response.data && response.data.SupplierResponse) || "";
    if (resp && resp.results.length > 0) {
      if (resp.results[0] && resp.results[0].status === "Success") {
        dispatch({
          type: "PASTE_SUPPLIERS_SUCCESS",
          payload: resp,
        });
      } else {
        dispatch({
          type: "PASTE_SUPPLIERS_FAIL",
          payload:
            resp.results[0].description || "Error While Pasting Suppleirs.",
        });
      }
    } else {
      dispatch({
        type: "PASTE_SUPPLIERS_FAIL",
        payload: "Error While Pasting Suppleirs.",
      });
    }
  } catch (err) {
    const error = err.message || "Error While Pasting Suppleirs.";
    dispatch({
      type: "PASTE_SUPPLIERS_FAIL",
      payload: error,
    });
  }
};
//----------------------****Clear Supplier States In Store****----------------
export function clearSupplierStates() {
  return async (dispatch) => {
    dispatch({
      type: "CLEAR_SUPPLIER_STATES",
    });
  };
}
