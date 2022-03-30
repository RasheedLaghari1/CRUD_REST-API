const INIT_STATE = {
  getSuppliersList: [], //contains a list of all suppliers
  getSuppliersListSuccess: "",
  getSuppliersListError: "",

  getSupplier: "", //Info of single suppliers
  getSupplierSuccess: "",
  getSupplierError: "",

  getSupplierDetails: "",
  supplierDistribution: [],
  getSupplierDetailsSuccess: "",
  getSupplierDetailsError: "",

  primeSupplierDetails: "",
  primeSupplierDetailsSuccess: "",
  primeSupplierDetailsError: "",

  insertSupplierDetails: "", //data of suppliers newly added
  insertSupplierDetailsSuccess: "",
  insertSupplierDetailsError: "",

  updateSupplierDetailsSuccess: "",
  updateSupplierDetailsError: "",

  getSupplierContacts: [],
  getSupplierContactsSuccess: "",
  getSupplierContactsError: "",

  addSuppliersContacts: [],
  addSuppliersContactSuccess: "",
  addSuppliersContactError: "",

  updateSuppliersContactSuccess: "",
  updateSuppliersContactError: "",

  deleteSuppliersContactSuccess: "",
  deleteSuppliersContactError: "",

  updateSupplier: "", //data of suppliers that updated
  updateSupplierSuccess: "",
  updateSupplierError: "",

  insertSupplier: "", //data of suppliers newly added
  insertSupplierSuccess: "",
  insertSupplierError: "",

  addSupAttachments: [],
  addSupAttachmentsSuccess: "",
  addSupAttachmentsError: "",

  getSupAttachment: "",
  getSupAttachmentSuccess: "",
  getSupAttachmentError: "",

  deleteSupAttachmentsSuccess: "",
  deleteSupAttachmentsError: "",

  unlockSupplierSuccess: "",
  unlockSupplierError: "",

  approveSupplierSuccess: "",
  approveSupplierError: "",

  getSupplierActivity: [],
  getSupplierActivitySuccess: "",
  getSupplierActivityError: "",

  exportSuppliers: '',
  exportSuppliersSuccess: "",
  exportSuppliersError: "",

  pasteSuppliersSuccess: "",
  pasteSuppliersError: "",

};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Suppliers List****-----------------------------
    case "GET_SUPPLIERS_LIST_INIT":
      return {
        ...state,
        getSuppliersList: [],
        getSuppliersListSuccess: "",
        getSuppliersListError: "",
      };
    case "GET_SUPPLIERS_LIST_SUCCESS":
      return {
        ...state,
        getSuppliersList: action.payload.suppliers || [],
        getSuppliersListSuccess: action.payload.results[0].description,
      };
    case "GET_SUPPLIERS_LIST_FAIL":
      return {
        ...state,
        getSuppliersListError: action.payload,
      };
    //----------------------****Get Single Supplier ****-----------------------------
    case "GET_SUPPLIER_INIT":
      return {
        ...state,
        getSupplier: "",
        getSupplierSuccess: "",
        getSupplierError: "",
      };
    case "GET_SUPPLIER_SUCCESS":
      return {
        ...state,
        getSupplier: action.payload,
        getSupplierSuccess: action.payload.results[0].description,
      };
    case "GET_SUPPLIER_FAIL":
      return {
        ...state,
        getSupplierError: action.payload,
      };
    //----------------------****Get Supplier Details****-----------------------------
    case "GET_SUPPLIER_DETAILS_INIT":
      return {
        ...state,
        getSupplierDetails: "",
        supplierDistribution: [],
        getSupplierDetailsSuccess: "",
        getSupplierDetailsError: "",
      };
    case "GET_SUPPLIER_DETAILS_SUCCESS":
      return {
        ...state,
        getSupplierDetails: action.payload.supplier || "",
        supplierDistribution: action.payload.supplierDistribution || [],
        getSupplierDetailsSuccess: action.payload.results[0].description,
      };
    case "GET_SUPPLIER_DETAILS_FAIL":
      return {
        ...state,
        getSupplierDetailsError: action.payload,
      };
    //----------------------****Prime Supplier Details****-----------------------------
    case "PRIME_SUPPLIER_DETAILS_INIT":
      return {
        ...state,
        primeSupplierDetails: "",
        primeSupplierDetailsSuccess: "",
        primeSupplierDetailsError: "",
      };
    case "PRIME_SUPPLIER_DETAILS_SUCCESS":
      return {
        ...state,
        primeSupplierDetails: action.payload.supplier || "",
        primeSupplierDetailsSuccess: action.payload.results[0].description,
      };
    case "PRIME_SUPPLIER_DETAILS_FAIL":
      return {
        ...state,
        primeSupplierDetailsError: action.payload,
      };
    //----------------------****Insert Supplier Details****-----------------------------
    case "INSERT_SUPPLIER_DETAILS_INIT":
      return {
        ...state,
        insertSupplierDetails: "",
        insertSupplierDetailsSuccess: "",
        insertSupplierDetailsError: "",
      };
    case "INSERT_SUPPLIER_DETAILS_SUCCESS":
      return {
        ...state,
        insertSupplierDetails: action.payload.supplier || "",
        insertSupplierDetailsSuccess: action.payload.results[0].description,
      };
    case "INSERT_SUPPLIER_DETAILS_FAIL":
      return {
        ...state,
        insertSupplierDetailsError: action.payload,
      };
    //----------------------****Update Supplier Details****-----------------------------
    case "UPDATE_SUPPLIER_DETAILS_INIT":
      return {
        ...state,
        updateSupplierDetailsSuccess: "",
        updateSupplierDetailsError: "",
      };
    case "UPDATE_SUPPLIER_DETAILS_SUCCESS":
      return {
        ...state,
        updateSupplierDetailsSuccess: action.payload.results[0].description,
      };
    case "UPDATE_SUPPLIER_DETAILS_FAIL":
      return {
        ...state,
        updateSupplierDetailsError: action.payload,
      };
    //----------------------****Get  Supplier Contacts ****-----------------------------
    case "GET_SUPPLIER_CONTACTS_INIT":
      return {
        ...state,
        getSupplierContacts: [],
        getSupplierContactsSuccess: "",
        getSupplierContactsError: "",
      };
    case "GET_SUPPLIER_CONTACTS_SUCCESS":
      return {
        ...state,
        getSupplierContacts: action.payload.contacts || [],
        getSupplierContactsSuccess: action.payload.results[0].description,
      };
    case "GET_SUPPLIER_CONTACTS_FAIL":
      return {
        ...state,
        getSupplierContactsError: action.payload,
      };

    //----------------------****Update Supplier ****-----------------------------
    case "UPDATE_SUPPLIER_INIT":
      return {
        ...state,
        updateSupplier: "",
        updateSupplierSuccess: "",
        updateSupplierError: "",
      };
    case "UPDATE_SUPPLIER_SUCCESS":
      return {
        ...state,
        updateSupplier: action.payload || "",
        updateSupplierSuccess: action.payload.results[0].description,
      };
    case "UPDATE_SUPPLIER_FAIL":
      return {
        ...state,
        updateSupplierError: action.payload,
      };
    //----------------------****Add Supplier's Contact ****-----------------------------
    case "ADD_SUPPLIER_CONTACT_INIT":
      return {
        ...state,
        addSuppliersContacts: [],
        addSuppliersContactSuccess: "",
        addSuppliersContactError: "",
      };
    case "ADD_SUPPLIER_CONTACT_SUCCESS":
      return {
        ...state,
        addSuppliersContacts: action.payload.contacts || [],
        addSuppliersContactSuccess: action.payload.results[0].description,
      };
    case "ADD_SUPPLIER_CONTACT_FAIL":
      return {
        ...state,
        addSuppliersContactError: action.payload,
      };
    //----------------------****Update Supplier's Contact ****-----------------------------
    case "UPDATE_SUPPLIER_CONTACT_INIT":
      return {
        ...state,
        updateSuppliersContactSuccess: "",
        updateSuppliersContactError: "",
      };
    case "UPDATE_SUPPLIER_CONTACT_SUCCESS":
      return {
        ...state,
        updateSuppliersContactSuccess: action.payload.results[0].description,
      };
    case "UPDATE_SUPPLIER_CONTACT_FAIL":
      return {
        ...state,
        updateSuppliersContactError: action.payload,
      };
    //----------------------****Delete Supplier's Contact ****-----------------------------
    case "DELETE_SUPPLIER_CONTACT_INIT":
      return {
        ...state,
        deleteSuppliersContactSuccess: "",
        deleteSuppliersContactError: "",
      };
    case "DELETE_SUPPLIER_CONTACT_SUCCESS":
      return {
        ...state,
        deleteSuppliersContactSuccess: action.payload.results[0].description,
      };
    case "DELETE_SUPPLIER_CONTACT_FAIL":
      return {
        ...state,
        deleteSuppliersContactError: action.payload,
      };
    //----------------------****Insert Supplier ****-----------------------------
    case "INSERT_SUPPLIER_INIT":
      return {
        ...state,
        insertSupplier: "",
        insertSupplierSuccess: "",
        insertSupplierError: "",
      };
    case "INSERT_SUPPLIER_SUCCESS":
      let successMsg =
        (action.payload.insertSupplierResp &&
          action.payload.insertSupplierResp.results &&
          action.payload.insertSupplierResp.results[0].description) ||
        "Supplier Successfully Inserted.";
      return {
        ...state,
        insertSupplier: action.payload,
        insertSupplierSuccess: successMsg,
      };
    case "INSERT_SUPPLIER_FAIL":
      return {
        ...state,
        insertSupplierError: action.payload,
      };
    //----------------------****Add Supplier's Attachments ****-----------------------------
    case "ADD_SUP_ATTACHMENTS_INIT":
      return {
        ...state,
        addSupAttachments: [],
        addSupAttachmentsSuccess: "",
        addSupAttachmentsError: "",
      };
    case "ADD_SUP_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        addSupAttachments: action.payload.attachments || [],
        addSupAttachmentsSuccess: action.payload.results[0].description,
      };
    case "ADD_SUP_ATTACHMENTS_FAIL":
      return {
        ...state,
        addSupAttachmentsError: action.payload,
      };
    //----------------------****Get Supplier's Attachments ****-----------------------------
    case "GET_SUP_ATTACHMENT_INIT":
      return {
        ...state,
        getSupAttachment: "",
        getSupAttachmentSuccess: "",
        getSupAttachmentError: "",
      };
    case "GET_SUP_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getSupAttachment: action.payload || "",
        getSupAttachmentSuccess: action.payload.results[0].description,
      };
    case "GET_SUP_ATTACHMENT_FAIL":
      return {
        ...state,
        getSupAttachmentError: action.payload,
      };
    //----------------------****Delete Supplier's Attachments ****-----------------------------
    case "DELETE_SUP_ATTACHMENTS_INIT":
      return {
        ...state,
        deleteSupAttachmentsSuccess: "",
        deleteSupAttachmentsError: "",
      };
    case "DELETE_SUP_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        deleteSupAttachmentsSuccess: action.payload.results[0].description,
      };
    case "DELETE_SUP_ATTACHMENTS_FAIL":
      return {
        ...state,
        deleteSupAttachmentsError: action.payload,
      };
    //----------------------****Unlock Supplier ****-----------------------------
    case "UNLOCK_SUPPLIER_INIT":
      return {
        ...state,
        unlockSupplierSuccess: "",
        unlockSupplierError: "",
      };
    case "UNLOCK_SUPPLIER_SUCCESS":
      return {
        ...state,
        unlockSupplierSuccess: action.payload.results[0].description,
      };
    case "UNLOCK_SUPPLIER_FAIL":
      return {
        ...state,
        unlockSupplierError: action.payload,
      };
    //----------------------****Approve Supplier ****-----------------------------
    case "APPROVE_SUPPLIER_INIT":
      return {
        ...state,
        approveSupplierSuccess: "",
        approveSupplierError: "",
      };
    case "APPROVE_SUPPLIER_SUCCESS":
      return {
        ...state,
        approveSupplierSuccess: action.payload.results[0].description,
      };
    case "APPROVE_SUPPLIER_FAIL":
      return {
        ...state,
        approveSupplierError: action.payload,
      };
    //----------------------****Get Supplier Activity ****-----------------------------
    case "GET_SUPPLIER_ACTIVITY_INIT":
      return {
        ...state,
        getSupplierActivity: [],
        getSupplierActivitySuccess: "",
        getSupplierActivityError: "",
      };
    case "GET_SUPPLIER_ACTIVITY_SUCCESS":
      return {
        ...state,
        getSupplierActivity: action.payload.activity || [],
        getSupplierActivitySuccess: action.payload.results[0].description,
      };
    case "GET_SUPPLIER_ACTIVITY_FAIL":
      return {
        ...state,
        getSupplierActivityError: action.payload,
      };
    //----------------------****Export Suppliers ****-----------------------------
    case "EXPORT_SUPPLIERS_INIT":
      return {
        ...state,
        exportSuppliers: '',
        exportSuppliersSuccess: "",
        exportSuppliersError: "",
      };
    case "EXPORT_SUPPLIERS_SUCCESS":
      return {
        ...state,
        exportSuppliers: action.payload.export || '',
        exportSuppliersSuccess: action.payload.results[0].description,
      };
    case "EXPORT_SUPPLIERS_FAIL":
      return {
        ...state,
        exportSuppliersError: action.payload,
      };
    //----------------------****Paste Suppliers ****-----------------------------
    case "PASTE_SUPPLIERS_INIT":
      return {
        ...state,
        pasteSuppliersSuccess: "",
        pasteSuppliersError: "",
      };
    case "PASTE_SUPPLIERS_SUCCESS":
      return {
        ...state,
        pasteSuppliersSuccess: action.payload.results[0].description,
      };
    case "PASTE_SUPPLIERS_FAIL":
      return {
        ...state,
        pasteSuppliersError: action.payload,
      };
    //----------------------****To Clear States*****-----------------------------
    case "CLEAR_SUPPLIER_STATES":
      return {
        ...state,
        getSuppliersListSuccess: "",
        getSuppliersListError: "",

        getSupplierSuccess: "",
        getSupplierError: "",

        getSupplierDetailsSuccess: "",
        getSupplierDetailsError: "",

        primeSupplierDetailsSuccess: "",
        primeSupplierDetailsError: "",

        insertSupplierDetailsSuccess: "",
        insertSupplierDetailsError: "",

        updateSupplierDetailsSuccess: "",
        updateSupplierDetailsError: "",

        updateSupplierSuccess: "",
        updateSupplierError: "",

        addSuppliersContactSuccess: "",
        addSuppliersContactError: "",

        updateSuppliersContactSuccess: "",
        updateSuppliersContactError: "",

        deleteSuppliersContactSuccess: "",
        deleteSuppliersContactError: "",

        insertSupplierSuccess: "",
        insertSupplierError: "",

        getSupplierContactsSuccess: "",
        getSupplierContactsError: "",

        addSupAttachmentsSuccess: "",
        addSupAttachmentsError: "",

        getSupAttachmentSuccess: "",
        getSupAttachmentError: "",

        deleteSupAttachmentsSuccess: "",
        deleteSupAttachmentsError: "",

        unlockSupplierSuccess: "",
        unlockSupplierError: "",

        approveSupplierSuccess: "",
        approveSupplierError: "",

        getSupplierActivitySuccess: "",
        getSupplierActivityError: "",

        exportSuppliersSuccess: "",
        exportSuppliersError: "",

        pasteSuppliersSuccess: "",
        pasteSuppliersError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getSuppliersList: [],
        getSuppliersListSuccess: "",
        getSuppliersListError: "",

        getSupplier: "",
        getSupplierSuccess: "",
        getSupplierError: "",

        getSupplierDetails: "",
        supplierDistribution: [],
        getSupplierDetailsSuccess: "",
        getSupplierDetailsError: "",

        primeSupplierDetails: "",
        primeSupplierDetailsSuccess: "",
        primeSupplierDetailsError: "",

        insertSupplierDetails: "", //data of suppliers newly added
        insertSupplierDetailsSuccess: "",
        insertSupplierDetailsError: "",

        updateSupplierDetailsSuccess: "",
        updateSupplierDetailsError: "",

        updateSupplier: "",
        updateSupplierSuccess: "",
        updateSupplierError: "",

        addSuppliersContacts: [],
        addSuppliersContactSuccess: "",
        addSuppliersContactError: "",

        updateSuppliersContactSuccess: "",
        updateSuppliersContactError: "",

        deleteSuppliersContactSuccess: "",
        deleteSuppliersContactError: "",

        insertSupplier: "",
        insertSupplierSuccess: "",
        insertSupplierError: "",

        getSupplierContacts: [],
        getSupplierContactsSuccess: "",
        getSupplierContactsError: "",

        addSupAttachments: [],
        addSupAttachmentsSuccess: "",
        addSupAttachmentsError: "",

        getSupAttachment: "",
        getSupAttachmentSuccess: "",
        getSupAttachmentError: "",

        deleteSupAttachmentsSuccess: "",
        deleteSupAttachmentsError: "",

        unlockSupplierSuccess: "",
        unlockSupplierError: "",

        approveSupplierSuccess: "",
        approveSupplierError: "",

        getSupplierActivity: [],
        getSupplierActivitySuccess: "",
        getSupplierActivityError: "",

        exportSuppliers: '',
        exportSuppliersSuccess: "",
        exportSuppliersError: "",

        pasteSuppliersSuccess: "",
        pasteSuppliersError: "",
      };

    //----------------------****Clear States After Logout****-------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        getSuppliersList: [],
        getSuppliersListSuccess: "",
        getSuppliersListError: "",

        getSupplier: "",
        getSupplierSuccess: "",
        getSupplierError: "",

        getSupplierDetails: "",
        supplierDistribution: [],
        getSupplierDetailsSuccess: "",
        getSupplierDetailsError: "",

        primeSupplierDetails: "",
        primeSupplierDetailsSuccess: "",
        primeSupplierDetailsError: "",

        insertSupplierDetails: "", //data of suppliers newly added
        insertSupplierDetailsSuccess: "",
        insertSupplierDetailsError: "",

        updateSupplierDetailsSuccess: "",
        updateSupplierDetailsError: "",

        updateSupplier: "",
        updateSupplierSuccess: "",
        updateSupplierError: "",

        addSuppliersContacts: [],
        addSuppliersContactSuccess: "",
        addSuppliersContactError: "",

        updateSuppliersContactSuccess: "",
        updateSuppliersContactError: "",

        deleteSuppliersContactSuccess: "",
        deleteSuppliersContactError: "",

        insertSupplier: "",
        insertSupplierSuccess: "",
        insertSupplierError: "",

        getSupplierContacts: [],
        getSupplierContactsSuccess: "",
        getSupplierContactsError: "",

        addSupAttachments: [],
        addSupAttachmentsSuccess: "",
        addSupAttachmentsError: "",

        getSupAttachment: "",
        getSupAttachmentSuccess: "",
        getSupAttachmentError: "",

        deleteSupAttachmentsSuccess: "",
        deleteSupAttachmentsError: "",

        unlockSupplierSuccess: "",
        unlockSupplierError: "",

        approveSupplierSuccess: "",
        approveSupplierError: "",

        getSupplierActivity: [],
        getSupplierActivitySuccess: "",
        getSupplierActivityError: "",

        exportSuppliers: '',
        exportSuppliersSuccess: "",
        exportSuppliersError: "",

        pasteSuppliersSuccess: "",
        pasteSuppliersError: "",
      };
    default:
      return state
  }
}
