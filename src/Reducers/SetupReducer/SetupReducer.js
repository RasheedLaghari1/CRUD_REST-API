const INIT_STATE = {
  getBatchList: [],
  getBatchListSuccess: "",
  getBatchListError: "",

  insertBatchSuccess: "",
  insertBatchError: "",

  deleteBatchSuccess: "",
  deleteBatchError: "",

  updateBatchSuccess: "",
  updateBatchError: "",

  getBusinessUnitList: [],
  getBusinessUnitListSuccess: "",
  getBusinessUnitListError: "",

  getBusinessUnit: "",
  getBusinessUnitSuccess: "",
  getBusinessUnitError: "",

  deleteBusinessUnitSuccess: "",
  deleteBusinessUnitError: "",

  insertBusinessUnit: '',
  insertBusinessUnitSuccess: "",
  insertBusinessUnitError: "",

  updateBusinessUnitSuccess: "",
  updateBusinessUnitError: "",

  primeInvoiceOCR: '',
  primeInvoiceOCRSuccess: "",
  primeInvoiceOCRError: "",

  getInvoiceOCRList: [],
  getInvoiceOCRListSuccess: "",
  getInvoiceOCRListError: "",

  updateInvoiceOCRListSuccess: "",
  updateInvoiceOCRListError: "",

  getOrderTemplateList: [],
  getOrderTemplateListSuccess: "",
  getOrderTemplateListError: "",

  getOrderTemplate: '',
  getOrderTemplateSuccess: "",
  getOrderTemplateError: "",

  updateOrderTemplateSuccess: "",
  updateOrderTemplateError: "",

  getEmailTemplateList: [],
  getEmailTemplateListSuccess: "",
  getEmailTemplateListError: "",

  getEmailTypeOpt: [],
  getEmailTypeOptSuccess: "",
  getEmailTypeOptError: "",

  getEmailTemplate: '',
  getEmailTemplateSuccess: "",
  getEmailTemplateError: "",

  insertEmailTemplateSuccess: "",
  insertEmailTemplateError: "",

  updateEmailTemplateSuccess: "",
  updateEmailTemplateError: "",

  deleteEmailTemplateSuccess: "",
  deleteEmailTemplateError: "",

  addEmailAttach: '',
  addEmailAttachSuccess: "",
  addEmailAttachError: "",

  getPlaceholders: [],
  getPlaceholdersSuccess: '',
  getPlaceholdersError: '',

  updatePlaceholdersSuccess: '',
  updatePlaceholdersError: '',

  getCustomFields: [],
  getCustomFieldsSuccess: '',
  getCustomFieldsError: '',

  getCustomField: '',
  getCustomFieldSuccess: '',
  getCustomFieldError: '',

  primeCustomField: '',
  primeCustomFieldSuccess: '',
  primeCustomFieldError: '',

  deleteCustomFieldSuccess: '',
  deleteCustomFieldError: '',

  insertCustomFieldSuccess: '',
  insertCustomFieldError: '',

  updateCustomFieldSuccess: '',
  updateCustomFieldError: '',

  primeCustomLineType: '',
  primeCustomLineTypeSuccess: '',
  primeCustomLineTypeError: '',

  insertCustomLineTypeSuccess: '',
  insertCustomLineTypeError: '',

  updateCustomLineTypeSuccess: '',
  updateCustomLineTypeError: '',

  deleteCustomLineTypeSuccess: '',
  deleteCustomLineTypeError: '',

  getCustomLineTypes: [],
  getCustomLineTypesSuccess: '',
  getCustomLineTypesError: '',

  getCustomLineType: '',
  getCustomLineTypeSuccess: '',
  getCustomLineTypeError: '',
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------GET BATCH LIST-------------------------
    case "GET_BATCH_LIST_INIT":
      return {
        ...state,
        getBatchList: [],
        getBatchListSuccess: "",
        getBatchListError: "",
      };
    case "GET_BATCH_LIST_SUCCESS":
      return {
        ...state,
        getBatchList: action.payload.batchList || [],
        getBatchListSuccess: action.payload.result[0].description,
      };
    case "GET_BATCH_LIST_FAIL":
      return {
        ...state,
        getBatchListError: action.payload,
      };
    //----------------------INSERT BATCH---------------------------
    case "INSERT_BATCH_INIT":
      return {
        ...state,
        insertBatchSuccess: "",
        insertBatchError: "",
      };
    case "INSERT_BATCH_SUCCESS":
      return {
        ...state,
        insertBatchSuccess: action.payload.result[0].description,
      };
    case "INSERT_BATCH_FAIL":
      return {
        ...state,
        insertBatchError: action.payload,
      };
    //----------------------DELETE BATCH---------------------------
    case "DELETE_BATCH_INIT":
      return {
        ...state,
        deleteBatchSuccess: "",
        deleteBatchError: "",
      };
    case "DELETE_BATCH_SUCCESS":
      return {
        ...state,
        deleteBatchSuccess: action.payload.result[0].description,
      };
    case "DELETE_BATCH_FAIL":
      return {
        ...state,
        deleteBatchError: action.payload,
      };
    //----------------------UPDATE BATCH---------------------------
    case "UPDATE_BATCH_INIT":
      return {
        ...state,
        updateBatchSuccess: "",
        updateBatchError: "",
      };
    case "UPDATE_BATCH_SUCCESS":
      return {
        ...state,
        updateBatchSuccess: action.payload.result[0].description,
      };
    case "UPDATE_BATCH_FAIL":
      return {
        ...state,
        updateBatchError: action.payload,
      };
    //----------------------GET BUSSINES UNIT LIST-----------------
    case "GET_BUSSINES_UNIT_LIST_INIT":
      return {
        ...state,
        getBusinessUnitList: [],
        getBusinessUnitListSuccess: "",
        getBusinessUnitListError: "",
      };
    case "GET_BUSSINES_UNIT_LIST_SUCCESS":
      return {
        ...state,
        getBusinessUnitList: action.payload.businessUnitList || [],
        getBusinessUnitListSuccess: action.payload.result[0].description,
      };
    case "GET_BUSSINES_UNIT_LIST_FAIL":
      return {
        ...state,
        getBusinessUnitListError: action.payload,
      };
    //----------------------GET SINGLE BUSSINESS UNIT--------------
    case "GET_BUSSINESS_UNIT_INIT":
      return {
        ...state,
        getBusinessUnit: "",
        getBusinessUnitSuccess: "",
        getBusinessUnitError: "",
      };
    case "GET_BUSSINESS_UNIT_SUCCESS":
      return {
        ...state,
        getBusinessUnit: action.payload.businessUnit || "",
        getBusinessUnitSuccess: action.payload.result[0].description,
      };
    case "GET_BUSSINESS_UNIT_FAIL":
      return {
        ...state,
        getBusinessUnitError: action.payload,
      };
    //----------------------DELETE BUSSINESS UNIT------------------
    case "DELETE_BUSSINESS_UNIT_INIT":
      return {
        ...state,
        deleteBusinessUnitSuccess: "",
        deleteBusinessUnitError: "",
      };
    case "DELETE_BUSSINESS_UNIT_SUCCESS":
      return {
        ...state,
        deleteBusinessUnitSuccess: action.payload.result[0].description,
      };
    case "DELETE_BUSSINESS_UNIT_FAIL":
      return {
        ...state,
        deleteBusinessUnitError: action.payload,
      };
    //----------------------Insert BUSINESS UNIT-------------------
    case "INSERT_BUSSINESS_UNIT_INIT":
      return {
        ...state,
        insertBusinessUnit: '',
        insertBusinessUnitSuccess: "",
        insertBusinessUnitError: "",
      };
    case "INSERT_BUSSINESS_UNIT_SUCCESS":
      return {
        ...state,
        insertBusinessUnit: action.payload.businessUnit || '',
        insertBusinessUnitSuccess: action.payload.result[0].description,
      };
    case "INSERT_BUSSINESS_UNIT_FAIL":
      return {
        ...state,
        insertBusinessUnitError: action.payload,
      };
    //----------------------Update Bussiness Unit------------------
    case "UPDATE_BUSSINESS_UNIT_INIT":
      return {
        ...state,
        updateBusinessUnitSuccess: "",
        updateBusinessUnitError: "",
      };
    case "UPDATE_BUSSINESS_UNIT_SUCCESS":
      return {
        ...state,
        updateBusinessUnitSuccess: action.payload.result[0].description,
      };
    case "UPDATE_BUSSINESS_UNIT_FAIL":
      return {
        ...state,
        updateBusinessUnitError: action.payload,
      };
    //----------------------Prime Invoice OCR-------------------
    case "PRIME_INVOICE_OCR_INIT":
      return {
        ...state,
        primeInvoiceOCR: '',
        primeInvoiceOCRSuccess: "",
        primeInvoiceOCRError: "",
      };
    case "PRIME_INVOICE_OCR_SUCCESS":
      return {
        ...state,
        primeInvoiceOCR: action.payload.invoiceOCR || '',
        primeInvoiceOCRSuccess: action.payload.result[0].description,
      };
    case "PRIME_INVOICE_OCR_FAIL":
      return {
        ...state,
        primeInvoiceOCRError: action.payload,
      };
    //----------------------Get Invoice OCR List-------------------
    case "GET_INVOICE_OCR_LIST_INIT":
      return {
        ...state,
        getInvoiceOCRList: [],
        getInvoiceOCRListSuccess: "",
        getInvoiceOCRListError: "",
      };
    case "GET_INVOICE_OCR_LIST_SUCCESS":
      return {
        ...state,
        getInvoiceOCRList: action.payload.ocrList || [],
        getInvoiceOCRListSuccess: action.payload.result[0].description,
      };
    case "GET_INVOICE_OCR_LIST_FAIL":
      return {
        ...state,
        getInvoiceOCRListError: action.payload,
      };
    //----------------------Update Invoice OCR List----------------
    case "UPDATE_INVOICE_OCR_LIST_INIT":
      return {
        ...state,
        updateInvoiceOCRListSuccess: "",
        updateInvoiceOCRListError: "",

      };
    case "UPDATE_INVOICE_OCR_LIST_SUCCESS":
      return {
        ...state,
        updateInvoiceOCRListSuccess: action.payload.result[0].description,
      };
    case "UPDATE_INVOICE_OCR_LIST_FAIL":
      return {
        ...state,
        updateInvoiceOCRListError: action.payload,
      };
    //----------------------Get Order Template List----------------
    case "GET_ORDER_TEMPLATE_LIST_INIT":
      return {
        ...state,
        getOrderTemplateList: [],
        getOrderTemplateListSuccess: "",
        getOrderTemplateListError: "",
      };
    case "GET_ORDER_TEMPLATE_LIST_SUCCESS":
      return {
        ...state,
        getOrderTemplateList: action.payload.templates || [],
        getOrderTemplateListSuccess: action.payload.result[0].description,
      };
    case "GET_ORDER_TEMPLATE_LIST_FAIL":
      return {
        ...state,
        getOrderTemplateListError: action.payload,
      };
    //----------------------Get Order Template---------------------
    case "GET_ORDER_TEMPLATE_INIT":
      return {
        ...state,
        getOrderTemplate: '',
        getOrderTemplateSuccess: "",
        getOrderTemplateError: "",
      };
    case "GET_ORDER_TEMPLATE_SUCCESS":
      return {
        ...state,
        getOrderTemplate: action.payload || '',
        getOrderTemplateSuccess: action.payload.result[0].description,
      };
    case "GET_ORDER_TEMPLATE_FAIL":
      return {
        ...state,
        getOrderTemplateError: action.payload,
      };
    //----------------------Update Order Template------------------
    case "UPDATE_ORDER_TEMPLATE_INIT":
      return {
        ...state,
        updateOrderTemplateSuccess: "",
        updateOrderTemplateError: "",
      };
    case "UPDATE_ORDER_TEMPLATE_SUCCESS":
      return {
        ...state,
        updateOrderTemplateSuccess: action.payload.result[0].description,
      };
    case "UPDATE_ORDER_TEMPLATE_FAIL":
      return {
        ...state,
        updateOrderTemplateError: action.payload,
      };
    //----------------------Get Email Template List----------------
    case "GET_EMAIL_TEMPLATE_LIST_INIT":
      return {
        ...state,
        getEmailTemplateList: [],
        getEmailTemplateListSuccess: "",
        getEmailTemplateListError: "",
      };
    case "GET_EMAIL_TEMPLATE_LIST_SUCCESS":
      return {
        ...state,
        getEmailTemplateList: action.payload.templates || [],
        getEmailTemplateListSuccess: action.payload.result[0].description,
      };
    case "GET_EMAIL_TEMPLATE_LIST_FAIL":
      return {
        ...state,
        getEmailTemplateListError: action.payload,
      };
    //----------------------Get Email Type Options----------------
    case "GET_EMAIL_TYPE_OPTIONS_INIT":
      return {
        ...state,
        getEmailTypeOpt: [],
        getEmailTypeOptSuccess: "",
        getEmailTypeOptError: "",
      };
    case "GET_EMAIL_TYPE_OPTIONS_SUCCESS":
      return {
        ...state,
        getEmailTypeOpt: action.payload.emailTypeOptions || [],
        getEmailTypeOptSuccess: action.payload.result[0].description,
      };
    case "GET_EMAIL_TYPE_OPTIONS_FAIL":
      return {
        ...state,
        getEmailTypeOptError: action.payload,
      };
    //----------------------Get Email Template----------------
    case "GET_EMAIL_TEMPLATE_INIT":
      return {
        ...state,
        getEmailTemplate: '',
        getEmailTemplateSuccess: "",
        getEmailTemplateError: "",
      };
    case "GET_EMAIL_TEMPLATE_SUCCESS":
      return {
        ...state,
        getEmailTemplate: action.payload || '',
        getEmailTemplateSuccess: action.payload.result[0].description,
      };
    case "GET_EMAIL_TEMPLATE_FAIL":
      return {
        ...state,
        getEmailTemplateError: action.payload,
      };
    //----------------------Insert Email Template----------------
    case "INSERT_EMAIL_TEMPLATE_INIT":
      return {
        ...state,
        insertEmailTemplateSuccess: "",
        insertEmailTemplateError: "",
      };
    case "INSERT_EMAIL_TEMPLATE_SUCCESS":
      return {
        ...state,
        insertEmailTemplateSuccess: action.payload.result[0].description,
      };
    case "INSERT_EMAIL_TEMPLATE_FAIL":
      return {
        ...state,
        insertEmailTemplateError: action.payload,
      };
    //----------------------Update Email Template----------------
    case "UPDATE_EMAIL_TEMPLATE_INIT":
      return {
        ...state,
        updateEmailTemplateSuccess: "",
        updateEmailTemplateError: "",
      };
    case "UPDATE_EMAIL_TEMPLATE_SUCCESS":
      return {
        ...state,
        updateEmailTemplateSuccess: action.payload.result[0].description,
      };
    case "UPDATE_EMAIL_TEMPLATE_FAIL":
      return {
        ...state,
        updateEmailTemplateError: action.payload,
      };
    //----------------------Delete Email Template----------------
    case "DELETE_EMAIL_TEMPLATE_INIT":
      return {
        ...state,
        deleteEmailTemplateSuccess: "",
        deleteEmailTemplateError: "",
      };
    case "DELETE_EMAIL_TEMPLATE_SUCCESS":
      return {
        ...state,
        deleteEmailTemplateSuccess: action.payload.result[0].description,
      };
    case "DELETE_EMAIL_TEMPLATE_FAIL":
      return {
        ...state,
        deleteEmailTemplateError: action.payload,
      };
    //----------------------Add Email Attachment----------------
    case "ADD_EMAIL_ATTACHMENT_INIT":
      return {
        ...state,
        addEmailAttach: '',
        addEmailAttachSuccess: "",
        addEmailAttachError: "",
      };
    case "ADD_EMAIL_ATTACHMENT_SUCCESS":
      return {
        ...state,
        addEmailAttach: action.payload.fileName || '',
        addEmailAttachSuccess: action.payload.result[0].description,
      };
    case "ADD_EMAIL_ATTACHMENT_FAIL":
      return {
        ...state,
        addEmailAttachError: action.payload,
      };
    //----------------------Get Placeholders----------------
    case "GET_PLACEHOLDERS_INIT":
      return {
        ...state,
        getPlaceholders: [],
        getPlaceholdersSuccess: '',
        getPlaceholdersError: ''
      };
    case "GET_PLACEHOLDERS_SUCCESS":
      return {
        ...state,
        getPlaceholders: action.payload.placeholders || [],
        getPlaceholdersSuccess: action.payload.result[0].description,
      };
    case "GET_PLACEHOLDERS_FAIL":
      return {
        ...state,
        getPlaceholdersError: action.payload,
      };
    //----------------------Update Placeholders----------------
    case "UPDATE_PLACEHOLDERS_INIT":
      return {
        ...state,
        updatePlaceholdersSuccess: '',
        updatePlaceholdersError: ''
      };
    case "UPDATE_PLACEHOLDERS_SUCCESS":
      return {
        ...state,
        updatePlaceholdersSuccess: action.payload.result[0].description,
      };
    case "UPDATE_PLACEHOLDERS_FAIL":
      return {
        ...state,
        updatePlaceholdersError: action.payload,
      };
    //----------------------Get Custom Fields----------------
    case "GET_CUSTOM_FIELDS_INIT":
      return {
        ...state,
        getCustomFields: [],
        getCustomFieldsSuccess: '',
        getCustomFieldsError: '',
      };
    case "GET_CUSTOM_FIELDS_SUCCESS":
      return {
        ...state,
        getCustomFields: action.payload.customFields || [],
        getCustomFieldsSuccess: action.payload.result[0].description,
      };
    case "GET_CUSTOM_FIELDS_FAIL":
      return {
        ...state,
        getCustomFieldsError: action.payload,
      };
    //----------------------Get Custom Field----------------
    case "GET_CUSTOM_FIELD_INIT":
      return {
        ...state,
        getCustomField: '',
        getCustomFieldSuccess: '',
        getCustomFieldError: '',
      };
    case "GET_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        getCustomField: action.payload.customField || '',
        getCustomFieldSuccess: action.payload.result[0].description,
      };
    case "GET_CUSTOM_FIELD_FAIL":
      return {
        ...state,
        getCustomFieldError: action.payload,
      };
    //----------------------Prime Custom Field----------------
    case "PRIME_CUSTOM_FIELD_INIT":
      return {
        ...state,
        primeCustomField: '',
        primeCustomFieldSuccess: '',
        primeCustomFieldError: '',
      };
    case "PRIME_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        primeCustomField: action.payload.customField || '',
        primeCustomFieldSuccess: action.payload.result[0].description,
      };
    case "PRIME_CUSTOM_FIELD_FAIL":
      return {
        ...state,
        primeCustomFieldError: action.payload,
      };
    //----------------------Delete Custom Field----------------
    case "DELETE_CUSTOM_FIELD_INIT":
      return {
        ...state,
        deleteCustomFieldSuccess: '',
        deleteCustomFieldError: '',
      };
    case "DELETE_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        deleteCustomFieldSuccess: action.payload.result[0].description,
      };
    case "DELETE_CUSTOM_FIELD_FAIL":
      return {
        ...state,
        deleteCustomFieldError: action.payload,
      };
    //----------------------Insert Custom Field----------------
    case "INSERT_CUSTOM_FIELD_INIT":
      return {
        ...state,
        insertCustomFieldSuccess: '',
        insertCustomFieldError: '',
      };
    case "INSERT_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        insertCustomFieldSuccess: action.payload.result[0].description,
      };
    case "INSERT_CUSTOM_FIELD_FAIL":
      return {
        ...state,
        insertCustomFieldError: action.payload,
      };
    //----------------------Update Custom Field----------------
    case "UPDATE_CUSTOM_FIELD_INIT":
      return {
        ...state,
        updateCustomFieldSuccess: '',
        updateCustomFieldError: '',
      };
    case "UPDATE_CUSTOM_FIELD_SUCCESS":
      return {
        ...state,
        updateCustomFieldSuccess: action.payload.result[0].description,
      };
    case "UPDATE_CUSTOM_FIELD_FAIL":
      return {
        ...state,
        updateCustomFieldError: action.payload,
      };
    //----------------------Prime Custom Line Type----------------
    case "PRIME_CUSTOM_LINE_TYPE_INIT":
      return {
        ...state,
        primeCustomLineType: '',
        primeCustomLineTypeSuccess: '',
        primeCustomLineTypeError: '',
      };
    case "PRIME_CUSTOM_LINE_TYPE_SUCCESS":
      return {
        ...state,
        primeCustomLineType: action.payload.customLineType || '',
        primeCustomLineTypeSuccess: action.payload.result[0].description,
      };
    case "PRIME_CUSTOM_LINE_TYPE_FAIL":
      return {
        ...state,
        primeCustomLineTypeError: action.payload,
      };
    //----------------------Insert Custom Line Type----------------
    case "INSERT_CUSTOM_LINE_TYPE_INIT":
      return {
        ...state,
        insertCustomLineTypeSuccess: '',
        insertCustomLineTypeError: '',
      };
    case "INSERT_CUSTOM_LINE_TYPE_SUCCESS":
      return {
        ...state,
        insertCustomLineTypeSuccess: action.payload.result[0].description,
      };
    case "INSERT_CUSTOM_LINE_TYPE_FAIL":
      return {
        ...state,
        insertCustomLineTypeError: action.payload,
      };
    //----------------------Update Custom Line Type----------------
    case "UPDATE_CUSTOM_LINE_TYPE_INIT":
      return {
        ...state,
        updateCustomLineTypeSuccess: '',
        updateCustomLineTypeError: '',
      };
    case "UPDATE_CUSTOM_LINE_TYPE_SUCCESS":
      return {
        ...state,
        updateCustomLineTypeSuccess: action.payload.result[0].description,
      };
    case "UPDATE_CUSTOM_LINE_TYPE_FAIL":
      return {
        ...state,
        updateCustomLineTypeError: action.payload,
      };
    //----------------------Delete Custom Line Type----------------
    case "DELETE_CUSTOM_LINE_TYPE_INIT":
      return {
        ...state,
        deleteCustomLineTypeSuccess: '',
        deleteCustomLineTypeError: '',
      };
    case "DELETE_CUSTOM_LINE_TYPE_SUCCESS":
      return {
        ...state,
        deleteCustomLineTypeSuccess: action.payload.result[0].description,
      };
    case "DELETE_CUSTOM_LINE_TYPE_FAIL":
      return {
        ...state,
        deleteCustomLineTypeError: action.payload,
      };
    //----------------------Get Custom Line Types----------------
    case "GET_CUSTOM_LINE_TYPES_INIT":
      return {
        ...state,
        getCustomLineTypes: [],
        getCustomLineTypesSuccess: '',
        getCustomLineTypesError: '',
      };
    case "GET_CUSTOM_LINE_TYPES_SUCCESS":
      return {
        ...state,
        getCustomLineTypes: action.payload.customLineTypes || [],
        getCustomLineTypesSuccess: action.payload.result[0].description,
      };
    case "GET_CUSTOM_LINE_TYPES_FAIL":
      return {
        ...state,
        getCustomLineTypesError: action.payload,
      };
    //----------------------Get Custom Line Type----------------
    case "GET_CUSTOM_LINE_TYPE_INIT":
      return {
        ...state,
        getCustomLineType: '',
        getCustomLineTypeSuccess: '',
        getCustomLineTypeError: '',
      };
    case "GET_CUSTOM_LINE_TYPE_SUCCESS":
      return {
        ...state,
        getCustomLineType: action.payload.customLineType || '',
        getCustomLineTypeSuccess: action.payload.result[0].description,
      };
    case "GET_CUSTOM_LINE_TYPE_FAIL":
      return {
        ...state,
        getCustomLineTypeError: action.payload,
      };
    //----------------------CLEAR STATES---------------------------
    case "CLEAR_SETUP_STATES":
      return {
        ...state,
        getBatchListSuccess: "",
        getBatchListError: "",

        insertBatchSuccess: "",
        insertBatchError: "",

        deleteBatchSuccess: "",
        deleteBatchError: "",

        updateBatchSuccess: "",
        updateBatchError: "",

        getBusinessUnitListSuccess: "",
        getBusinessUnitListError: "",

        getBusinessUnitSuccess: "",
        getBusinessUnitError: "",

        deleteBusinessUnitSuccess: "",
        deleteBusinessUnitError: "",

        insertBusinessUnitSuccess: "",
        insertBusinessUnitError: "",

        updateBusinessUnitSuccess: "",
        updateBusinessUnitError: "",

        primeInvoiceOCRSuccess: "",
        primeInvoiceOCRError: "",

        getInvoiceOCRListSuccess: "",
        getInvoiceOCRListError: "",

        updateInvoiceOCRListSuccess: "",
        updateInvoiceOCRListError: "",

        getOrderTemplateListSuccess: "",
        getOrderTemplateListError: "",

        getOrderTemplateSuccess: "",
        getOrderTemplateError: "",

        updateOrderTemplateSuccess: "",
        updateOrderTemplateError: "",

        getEmailTemplateListSuccess: "",
        getEmailTemplateListError: "",

        getEmailTypeOptSuccess: "",
        getEmailTypeOptError: "",

        getEmailTemplateSuccess: "",
        getEmailTemplateError: "",

        insertEmailTemplateSuccess: "",
        insertEmailTemplateError: "",

        updateEmailTemplateSuccess: "",
        updateEmailTemplateError: "",

        deleteEmailTemplateSuccess: "",
        deleteEmailTemplateError: "",

        addEmailAttachSuccess: "",
        addEmailAttachError: "",

        getPlaceholdersSuccess: '',
        getPlaceholdersError: '',

        updatePlaceholdersSuccess: '',
        updatePlaceholdersError: '',

        getCustomFieldsSuccess: '',
        getCustomFieldsError: '',

        getCustomFieldSuccess: '',
        getCustomFieldError: '',

        primeCustomFieldSuccess: '',
        primeCustomFieldError: '',

        deleteCustomFieldSuccess: '',
        deleteCustomFieldError: '',

        insertCustomFieldSuccess: '',
        insertCustomFieldError: '',

        updateCustomFieldSuccess: '',
        updateCustomFieldError: '',

        primeCustomLineTypeSuccess: '',
        primeCustomLineTypeError: '',

        insertCustomLineTypeSuccess: '',
        insertCustomLineTypeError: '',

        updateCustomLineTypeSuccess: '',
        updateCustomLineTypeError: '',

        deleteCustomLineTypeSuccess: '',
        deleteCustomLineTypeError: '',

        getCustomLineTypesSuccess: '',
        getCustomLineTypesError: '',

        getCustomLineTypeSuccess: '',
        getCustomLineTypeError: '',
      };
    //----------------------****Clear States When Producton Login****--
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getBatchList: [],
        getBatchListSuccess: "",
        getBatchListError: "",

        insertBatchSuccess: "",
        insertBatchError: "",

        deleteBatchSuccess: "",
        deleteBatchError: "",

        updateBatchSuccess: "",
        updateBatchError: "",

        getBusinessUnitList: [],
        getBusinessUnitListSuccess: "",
        getBusinessUnitListError: "",

        getBusinessUnit: "",
        getBusinessUnitSuccess: "",
        getBusinessUnitError: "",

        deleteBusinessUnitSuccess: "",
        deleteBusinessUnitError: "",

        insertBusinessUnit: '',
        insertBusinessUnitSuccess: "",
        insertBusinessUnitError: "",

        updateBusinessUnitSuccess: "",
        updateBusinessUnitError: "",

        primeInvoiceOCR: '',
        primeInvoiceOCRSuccess: "",
        primeInvoiceOCRError: "",

        getInvoiceOCRList: [],
        getInvoiceOCRListSuccess: "",
        getInvoiceOCRListError: "",

        updateInvoiceOCRListSuccess: "",
        updateInvoiceOCRListError: "",

        getOrderTemplateList: [],
        getOrderTemplateListSuccess: "",
        getOrderTemplateListError: "",

        getOrderTemplate: '',
        getOrderTemplateSuccess: "",
        getOrderTemplateError: "",

        updateOrderTemplateSuccess: "",
        updateOrderTemplateError: "",

        getEmailTemplateList: [],
        getEmailTemplateListSuccess: "",
        getEmailTemplateListError: "",

        getEmailTypeOpt: [],
        getEmailTypeOptSuccess: "",
        getEmailTypeOptError: "",

        getEmailTemplate: '',
        getEmailTemplateSuccess: "",
        getEmailTemplateError: "",

        insertEmailTemplateSuccess: "",
        insertEmailTemplateError: "",

        updateEmailTemplateSuccess: "",
        updateEmailTemplateError: "",

        deleteEmailTemplateSuccess: "",
        deleteEmailTemplateError: "",

        addEmailAttach: '',
        addEmailAttachSuccess: "",
        addEmailAttachError: "",

        getPlaceholders: [],
        getPlaceholdersSuccess: '',
        getPlaceholdersError: '',

        updatePlaceholdersSuccess: '',
        updatePlaceholdersError: '',

        getCustomFields: [],
        getCustomFieldsSuccess: '',
        getCustomFieldsError: '',

        getCustomField: '',
        getCustomFieldSuccess: '',
        getCustomFieldError: '',

        primeCustomField: '',
        primeCustomFieldSuccess: '',
        primeCustomFieldError: '',

        deleteCustomFieldSuccess: '',
        deleteCustomFieldError: '',

        insertCustomFieldSuccess: '',
        insertCustomFieldError: '',

        updateCustomFieldSuccess: '',
        updateCustomFieldError: '',

        primeCustomLineType: '',
        primeCustomLineTypeSuccess: '',
        primeCustomLineTypeError: '',

        insertCustomLineTypeSuccess: '',
        insertCustomLineTypeError: '',

        updateCustomLineTypeSuccess: '',
        updateCustomLineTypeError: '',

        deleteCustomLineTypeSuccess: '',
        deleteCustomLineTypeError: '',

        getCustomLineTypes: [],
        getCustomLineTypesSuccess: '',
        getCustomLineTypesError: '',

        getCustomLineType: '',
        getCustomLineTypeSuccess: '',
        getCustomLineTypeError: '',
      };
    //----------------------****Clear States After Logout****---------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        getBatchList: [],
        getBatchListSuccess: "",
        getBatchListError: "",

        insertBatchSuccess: "",
        insertBatchError: "",

        deleteBatchSuccess: "",
        deleteBatchError: "",

        updateBatchSuccess: "",
        updateBatchError: "",

        getBusinessUnitList: [],
        getBusinessUnitListSuccess: "",
        getBusinessUnitListError: "",

        getBusinessUnit: "",
        getBusinessUnitSuccess: "",
        getBusinessUnitError: "",

        deleteBusinessUnitSuccess: "",
        deleteBusinessUnitError: "",

        insertBusinessUnit: '',
        insertBusinessUnitSuccess: "",
        insertBusinessUnitError: "",

        updateBusinessUnitSuccess: "",
        updateBusinessUnitError: "",

        primeInvoiceOCR: '',
        primeInvoiceOCRSuccess: "",
        primeInvoiceOCRError: "",

        getInvoiceOCRList: [],
        getInvoiceOCRListSuccess: "",
        getInvoiceOCRListError: "",

        updateInvoiceOCRListSuccess: "",
        updateInvoiceOCRListError: "",

        getOrderTemplateList: [],
        getOrderTemplateListSuccess: "",
        getOrderTemplateListError: "",

        getOrderTemplate: '',
        getOrderTemplateSuccess: "",
        getOrderTemplateError: "",

        updateOrderTemplateSuccess: "",
        updateOrderTemplateError: "",

        getEmailTemplateList: [],
        getEmailTemplateListSuccess: "",
        getEmailTemplateListError: "",

        getEmailTypeOpt: [],
        getEmailTypeOptSuccess: "",
        getEmailTypeOptError: "",

        getEmailTemplate: '',
        getEmailTemplateSuccess: "",
        getEmailTemplateError: "",

        insertEmailTemplateSuccess: "",
        insertEmailTemplateError: "",

        updateEmailTemplateSuccess: "",
        updateEmailTemplateError: "",

        deleteEmailTemplateSuccess: "",
        deleteEmailTemplateError: "",

        addEmailAttach: '',
        addEmailAttachSuccess: "",
        addEmailAttachError: "",

        getPlaceholders: [],
        getPlaceholdersSuccess: '',
        getPlaceholdersError: '',

        updatePlaceholdersSuccess: '',
        updatePlaceholdersError: '',

        getCustomFields: [],
        getCustomFieldsSuccess: '',
        getCustomFieldsError: '',

        getCustomField: '',
        getCustomFieldSuccess: '',
        getCustomFieldError: '',

        primeCustomField: '',
        primeCustomFieldSuccess: '',
        primeCustomFieldError: '',

        deleteCustomFieldSuccess: '',
        deleteCustomFieldError: '',

        insertCustomFieldSuccess: '',
        insertCustomFieldError: '',

        updateCustomFieldSuccess: '',
        updateCustomFieldError: '',

        primeCustomLineType: '',
        primeCustomLineTypeSuccess: '',
        primeCustomLineTypeError: '',

        insertCustomLineTypeSuccess: '',
        insertCustomLineTypeError: '',

        updateCustomLineTypeSuccess: '',
        updateCustomLineTypeError: '',

        deleteCustomLineTypeSuccess: '',
        deleteCustomLineTypeError: '',

        getCustomLineTypes: [],
        getCustomLineTypesSuccess: '',
        getCustomLineTypesError: '',

        getCustomLineType: '',
        getCustomLineTypeSuccess: '',
        getCustomLineTypeError: '',
      };
    default:
      return state;
  }
}
