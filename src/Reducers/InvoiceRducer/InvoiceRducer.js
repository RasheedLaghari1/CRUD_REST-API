const INIT_STATE = {
  invoiceTallies: [],
  getInvoiceTalliesSuccess: "",
  getInvoiceTalliesError: "",

  getInvoicesList: [],
  getInvoicesListSuccess: "",
  getInvoicesListError: "",

  getInvoice: "",
  getInvoiceSuccess: "",
  getInvoiceError: "",

  draftInvoice: "",
  draftInvoiceSuccess: "",
  draftInvoiceError: "",

  deleteInvoiceSuccess: "",
  deleteInvoiceError: "",

  getOCRToken: "",
  getOCRTokenSuccess: "",
  getOCRTokenError: "",

  addTaxLines: [],
  addTaxLinesSuccess: "",
  addTaxLinesError: "",

  invoiceOCRLookup: "",
  invoiceOCRLookupSuccess: "",
  invoiceOCRLookupError: "",

  importInvoiceData: "",
  importInvoiceSuccess: "",
  importInvoiceWarning: "",
  importInvoiceError: "",

  importInvoicLinese: "",
  importInvoicLineseSuccess: "",
  importInvoicLineseError: "",

  exportInvoiceLines: "",
  exportInvoiceLinesSuccess: "",
  exportInvoiceLinesError: "",

  updateInvoiceSuccess: "",
  updateInvoiceError: "",

  updateInvoiceLines: "",
  updateInvoiceLinesSuccess: "",
  updateInvoiceLinesError: "",

  calculateLine: "",
  calculateLineSuccess: "",
  calculateLineError: "",

  addCommentData: [],
  addCommentSuccess: "",
  addCommentError: "",

  addInvoiceAttachment: "",
  addInvoiceAttachmentSuccess: "",
  addInvoiceAttachmentError: "",

  getInvocieAttachment: "",
  getInvocieAttachmentSuccess: "",
  getInvocieAttachmentError: "",

  deleteInvoiceAttachmentSuccess: "",
  deleteInvoiceAttachmentError: "",

  updatePrimaryDocumentSuccess: "",
  updatePrimaryDocumentError: "",

  approveInvoiceSuccess: "",
  approveInvoiceError: "",

  declineInvoiceSuccess: "",
  declineInvoiceError: "",

  moveInvoiceSuccess: "",
  moveInvoiceError: "",

  sendForApprovalInvoiceSuccess: "",
  sendForApprovalInvoiceError: "",

  regenerateSignatureSuccess: "",
  regenerateSignatureError: "",

  getTransactions: [],
  getTransactionsSuccess: "",
  getTransactionsError: "",

  getTransactionDetails: [],
  getTransactionDetailsSuccess: "",
  getTransactionDetailsError: "",

  exportTransactions: "",
  exportTransactionsSuccess: "",
  exportTransactionsError: "",

  postInvoice: "",
  postInvoiceSuccess: "",
  postInvoiceError: "",

  balanceTaxSuccess: "",
  balanceTaxError: "",

  exportInvoice: "",
  exportInvoiceSuccess: "",
  exportInvoiceError: "",

  exportTPHSuccess: "",
  exportTPHError: "",

  exportTaxInvoice: [],
  exportTaxInvoiceSuccess: "",
  exportTaxInvoiceError: "",

  moveBatchSuccess: "",
  moveBatchError: "",

  importChqReqSuccess: "",
  importChqReqError: "",

  importListSuccess: "",
  importListError: "",

  importEPFileSuccess: "",
  importEPFileError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Invoice Tallies****-----------------------------
    case "GET_INVOICE_TALLIES_INIT":
      return {
        ...state,
        invoiceTallies: [],
        getInvoiceTalliesSuccess: "",
        getInvoiceTalliesError: "",
      };
    case "GET_INVOICE_TALLIES_SUCCESS":
      return {
        ...state,
        invoiceTallies: action.payload.invoiceTallies || [],
        getInvoiceTalliesSuccess: action.payload.results[0].description,
      };
    case "GET_INVOICE_TALLIES_FAIL":
      return {
        ...state,
        getInvoiceTalliesError: action.payload,
      };
    //----------------------****Get Invoices List****-----------------------------
    case "GET_INVOICES_LIST_INIT":
      return {
        ...state,

        getInvoicesList: [],
        getInvoicesListSuccess: "",
        getInvoicesListError: "",
      };
    case "GET_INVOICES_LIST_SUCCESS":
      return {
        ...state,
        getInvoicesList: action.payload.invoiceList || [],
        getInvoicesListSuccess: action.payload.results[0].description,
      };
    case "GET_INVOICES_LIST_FAIL":
      return {
        ...state,
        getInvoicesListError: action.payload,
      };
    //----------------------****Get Invoice****-----------------------------
    case "GET_INVOICE_INIT":
      return {
        ...state,

        getInvoice: "",
        getInvoiceSuccess: "",
        getInvoiceError: "",
      };
    case "GET_INVOICE_SUCCESS":
      return {
        ...state,
        getInvoice: action.payload || "",
        getInvoiceSuccess: action.payload.results[0].description,
      };
    case "GET_INVOICE_FAIL":
      return {
        ...state,
        getInvoiceError: action.payload,
      };
    //----------------------****Draft Invoice****-----------------------------
    case "DRAFT_INVOICE_INIT":
      return {
        ...state,
        draftInvoice: "",
        draftInvoiceSuccess: "",
        draftInvoiceError: "",
      };
    case "DRAFT_INVOICE_SUCCESS":
      return {
        ...state,
        draftInvoice: action.payload.invoice || "",
        draftInvoiceSuccess: action.payload.results[0].description,
      };
    case "DRAFT_INVOICE_FAIL":
      return {
        ...state,
        draftInvoiceError: action.payload,
      };
    //----------------------****Delete Invoice****-----------------------------
    case "DELETE_INVOICE_INIT":
      return {
        ...state,
        deleteInvoiceSuccess: "",
        deleteInvoiceError: "",
      };
    case "DELETE_INVOICE_SUCCESS":
      return {
        ...state,
        deleteInvoiceSuccess: action.payload.results[0].description,
      };
    case "DELETE_INVOICE_FAIL":
      return {
        ...state,
        deleteInvoiceError: action.payload,
      };
    //----------------------****Get OCR Token****-----------------------------
    case "GET_OCR_TOKEN_INIT":
      return {
        ...state,
        getOCRToken: "",
        getOCRTokenSuccess: "",
        getOCRTokenError: "",
      };
    case "GET_OCR_TOKEN_SUCCESS":
      return {
        ...state,
        getOCRToken: (action.payload && action.payload.token) || "",
        getOCRTokenSuccess: action.payload.results[0].description,
      };
    case "GET_OCR_TOKEN_FAIL":
      return {
        ...state,
        getOCRTokenError: action.payload,
      };
    //----------------------****Add Tax Lines****-----------------------------
    case "ADD_TAX_LINES_INIT":
      return {
        ...state,
        addTaxLines: [],
        addTaxLinesSuccess: "",
        addTaxLinesError: "",
      };
    case "ADD_TAX_LINES_SUCCESS":
      return {
        ...state,
        addTaxLines: (action.payload && action.payload.invoiceLines) || [],
        addTaxLinesSuccess: action.payload.results[0].description,
      };
    case "ADD_TAX_LINES_FAIL":
      return {
        ...state,
        addTaxLinesError: action.payload,
      };
    //----------------------****Invoice OCR Lookup****-----------------------------
    case "INVOICE_OCR_LOOKUP_INIT":
      return {
        ...state,
        invoiceOCRLookup: "",
        invoiceOCRLookupSuccess: "",
        invoiceOCRLookupError: "",
      };
    case "INVOICE_OCR_LOOKUP_SUCCESS":
      return {
        ...state,
        invoiceOCRLookup: action.payload || "",
        invoiceOCRLookupSuccess: action.payload.results[0].description,
      };
    case "INVOICE_OCR_LOOKUP_FAIL":
      return {
        ...state,
        invoiceOCRLookupError: action.payload,
      };
    //----------------------****Import Invoice****-----------------------------
    case "IMPORT_INVOICE_INIT":
      return {
        ...state,
        importInvoiceData: "",
        importInvoiceSuccess: "",
        importInvoiceWarning: "",
        importInvoiceError: "",
      };
    case "IMPORT_INVOICE_SUCCESS":
      let results = action.payload.results || [];
      let warning = "";
      results.map((r, i) => {
        if (r.status === "Warning") {
          warning = r.description || "";
        }
      });
      return {
        ...state,
        importInvoiceData: action.payload || "",
        importInvoiceSuccess: "Invoice lines updated.",
        importInvoiceWarning: warning,
      };
    case "IMPORT_INVOICE_FAIL":
      return {
        ...state,
        importInvoiceError: action.payload,
      };
    //----------------------****Import Invoice Lines****-----------------------------
    case "IMPORT_INVOICE_LINES_INIT":
      return {
        ...state,
        importInvoicLinese: "",
        importInvoicLineseSuccess: "",
        importInvoicLineseError: "",
      };
    case "IMPORT_INVOICE_LINES_SUCCESS":
      return {
        ...state,
        importInvoicLinese: action.payload || "",
        importInvoicLineseSuccess: action.payload.results[0].description,
      };
    case "IMPORT_INVOICE_LINES_FAIL":
      return {
        ...state,
        importInvoicLineseError: action.payload,
      };
    //----------------------****Export Invoice Lines****-----------------------------
    case "EXPORT_INVOICE_LINES_INIT":
      return {
        ...state,
        exportInvoiceLines: "",
        exportInvoiceLinesSuccess: "",
        exportInvoiceLinesError: "",
      };
    case "EXPORT_INVOICE_LINES_SUCCESS":
      return {
        ...state,
        exportInvoiceLines: action.payload.attachment || "",
        exportInvoiceLinesSuccess: action.payload.results[0].description,
      };
    case "EXPORT_INVOICE_LINES_FAIL":
      return {
        ...state,
        exportInvoiceLinesError: action.payload,
      };
    //----------------------****Update Invoice****-----------------------------
    case "UPDATE_INVOICE_INIT":
      return {
        ...state,
        updateInvoiceSuccess: "",
        updateInvoiceError: "",
      };
    case "UPDATE_INVOICE_SUCCESS":
      return {
        ...state,
        updateInvoiceSuccess: action.payload.results[0].description,
      };
    case "UPDATE_INVOICE_FAIL":
      return {
        ...state,
        updateInvoiceError: action.payload,
      };
    //----------------------****Add Invoice Comment****-----------------------------
    case "ADD_INVOICE_COMMENT_INIT":
      return {
        ...state,
        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",
      };
    case "ADD_INVOICE_COMMENT_SUCCESS":
      return {
        ...state,
        addCommentData: action.payload.comments || [],
        addCommentSuccess: action.payload.results[0].description,
      };
    case "ADD_INVOICE_COMMENT_FAIL":
      return {
        ...state,
        addCommentError: action.payload,
      };
    //----------------------****Add Invoice Attachments ****-----------------------------
    case "ADD_INVOICE_ATTACHMENTS_INIT":
      return {
        ...state,
        addInvoiceAttachment: "",
        addInvoiceAttachmentSuccess: "",
        addInvoiceAttachmentError: "",
      };
    case "ADD_INVOICE_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        addInvoiceAttachment: action.payload.attachments || [],
        addInvoiceAttachmentSuccess: action.payload.results[0].description,
      };
    case "ADD_INVOICE_ATTACHMENTS_FAIL":
      return {
        ...state,
        addInvoiceAttachmentError: action.payload,
      };
    //----------------------****Get Invoice Attachments****-----------------------------
    case "GET_INVOICE_ATTACHMENT_INIT":
      return {
        ...state,
        getInvocieAttachment: "",
        getInvocieAttachmentSuccess: "",
        getInvocieAttachmentError: "",
      };
    case "GET_INVOICE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getInvocieAttachment: action.payload,
        getInvocieAttachmentSuccess: action.payload.results[0].description,
      };
    case "GET_INVOICE_ATTACHMENT_FAIL":
      return {
        ...state,
        getInvocieAttachmentError: action.payload,
      };
    //----------------------****Delete Invoice Attachments****-----------------------------
    case "DELETE_INVOICE_ATTACHMENT_INIT":
      return {
        ...state,
        deleteInvoiceAttachmentSuccess: "",
        deleteInvoiceAttachmentError: "",
      };
    case "DELETE_INVOICE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deleteInvoiceAttachmentSuccess: action.payload.results[0].description,
      };
    case "DELETE_INVOICE_ATTACHMENT_FAIL":
      return {
        ...state,
        deleteInvoiceAttachmentError: action.payload,
      };
    //----------------------****Update Primary Document****---------------------
    case "PDATE_PRIMARY_DOC_INVOICE__INIT":
      return {
        ...state,
        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",
      };
    case "PDATE_PRIMARY_DOC_INVOICE__SUCCESS":
      return {
        ...state,
        updatePrimaryDocumentSuccess: action.payload.results[0].description,
      };
    case "PDATE_PRIMARY_DOC_INVOICE__FAIL":
      return {
        ...state,
        updatePrimaryDocumentError: action.payload,
      };

    //----------------------****Approve Invoice****-----------------------------
    case "APPROVE_INVOICE_INIT":
      return {
        ...state,
        approveInvoiceSuccess: "",
        approveInvoiceError: "",
      };
    case "APPROVE_INVOICE_SUCCESS":
      return {
        ...state,
        approveInvoiceSuccess: action.payload.results[0].description,
      };
    case "APPROVE_INVOICE_FAIL":
      return {
        ...state,
        approveInvoiceError: action.payload,
      };
    //----------------------****Decline Invoice ****-----------------------------
    case "DECLINE_INVOICE_INIT":
      return {
        ...state,
        declineInvoiceSuccess: "",
        declineInvoiceError: "",
      };
    case "DECLINE_INVOICE_SUCCESS":
      return {
        ...state,
        declineInvoiceSuccess: action.payload.results[0].description,
      };
    case "DECLINE_INVOICE_FAIL":
      return {
        ...state,
        declineInvoiceError: action.payload,
      };
    //----------------------****Move Invoice ****-----------------------------
    case "MOVE_INVOICE_INIT":
      return {
        ...state,
        moveInvoiceSuccess: "",
        moveInvoiceError: "",
      };
    case "MOVE_INVOICE_SUCCESS":
      return {
        ...state,
        moveInvoiceSuccess: action.payload.results[0].description,
      };
    case "MOVE_INVOICE_FAIL":
      return {
        ...state,
        moveInvoiceError: action.payload,
      };
    //----------------------****Send For Approval Invoice ****-----------------------------
    case "SEND_FOR_APPROVAL_INVOICE_INIT":
      return {
        ...state,
        sendForApprovalInvoiceSuccess: "",
        sendForApprovalInvoiceError: "",
      };
    case "SEND_FOR_APPROVAL_INVOICE_SUCCESS":
      return {
        ...state,
        sendForApprovalInvoiceSuccess: action.payload.results[0].description,
      };
    case "SEND_FOR_APPROVAL_INVOICE_FAIL":
      return {
        ...state,
        sendForApprovalInvoiceError: action.payload,
      };
    //----------------------****Update Invoice Lines ****-----------------------------
    case "UPDATE_INVOICE_LINES_INIT":
      return {
        ...state,
        updateInvoiceLines: "",
        updateInvoiceLinesSuccess: "",
        updateInvoiceLinesError: "",
      };
    case "UPDATE_INVOICE_LINES_SUCCESS":
      return {
        ...state,
        updateInvoiceLines: action.payload,
        updateInvoiceLinesSuccess: action.payload.results[0].description,
      };
    case "UPDATE_INVOICE_LINES_FAIL":
      return {
        ...state,
        updateInvoiceLinesError: action.payload,
      };
    //----------------------****Calculate Invoice Lines ****-----------------------------
    case "CALCULATE_LINES_INIT":
      return {
        ...state,
        calculateLine: "",
        calculateLineSuccess: "",
        calculateLineError: "",
      };
    case "CALCULATE_LINES_SUCCESS":
      return {
        ...state,
        calculateLine: action.payload,
        calculateLineSuccess: action.payload.results[0].description,
      };
    case "CALCULATE_LINES_FAIL":
      return {
        ...state,
        calculateLineError: action.payload,
      };
    //----------------------****Regenerate Signature ****-----------------------------
    case "REGENERATING_SIGNATURE_INIT":
      return {
        ...state,
        regenerateSignatureSuccess: "",
        regenerateSignatureError: "",
      };
    case "REGENERATING_SIGNATURE_SUCCESS":
      return {
        ...state,
        regenerateSignatureSuccess: action.payload.results[0].description,
      };
    case "REGENERATING_SIGNATURE_FAIL":
      return {
        ...state,
        regenerateSignatureError: action.payload,
      };
    //----------------------****Get Transactions ****-----------------------------
    case "GET_TRANSACTIONS_INIT":
      return {
        ...state,
        getTransactions: [],
        getTransactionsSuccess: "",
        getTransactionsError: "",
      };
    case "GET_TRANSACTIONS_SUCCESS":
      return {
        ...state,
        getTransactions: action.payload.transactions || [],
        getTransactionsSuccess: action.payload.results[0].description,
      };
    case "GET_TRANSACTIONS_FAIL":
      return {
        ...state,
        getTransactionsError: action.payload,
      };
    //----------------------****Get Transaction Details ****-----------------------------
    case "GET_TRANSACTION_DETAILS_INIT":
      return {
        ...state,
        getTransactionDetails: [],
        getTransactionDetailsSuccess: "",
        getTransactionDetailsError: "",
      };
    case "GET_TRANSACTION_DETAILS_SUCCESS":
      return {
        ...state,
        getTransactionDetails: action.payload.transactionDetails || [],
        getTransactionDetailsSuccess: action.payload.results[0].description,
      };
    case "GET_TRANSACTION_DETAILS_FAIL":
      return {
        ...state,
        getTransactionDetailsError: action.payload,
      };
    //----------------------****Export Transaction ****-----------------------------
    case "EXPORT_TRANSACTIONS_INIT":
      return {
        ...state,
        exportTransactions: "",
        exportTransactionsSuccess: "",
        exportTransactionsError: "",
      };
    case "EXPORT_TRANSACTIONS_SUCCESS":
      return {
        ...state,
        exportTransactions: action.payload.export || "",
        exportTransactionsSuccess: action.payload.results[0].description,
      };
    case "EXPORT_TRANSACTIONS_FAIL":
      return {
        ...state,
        exportTransactionsError: action.payload,
      };
    //----------------------****Post Invoice****-----------------------------
    case "POST_INVOICE_INIT":
      return {
        ...state,
        postInvoice: "",
        postInvoiceSuccess: "",
        postInvoiceError: "",
      };
    case "POST_INVOICE_SUCCESS":
      return {
        ...state,
        postInvoice: action.payload,
        postInvoiceSuccess: action.payload.results[0].description,
      };
    case "POST_INVOICE_FAIL":
      return {
        ...state,
        postInvoiceError: action.payload,
      };
    //----------------------****Balance Tax****-----------------------------
    case "INVOICE_BALANCE_TAX_INIT":
      return {
        ...state,
        balanceTaxSuccess: "",
        balanceTaxError: "",
      };
    case "INVOICE_BALANCE_TAX_SUCCESS":
      return {
        ...state,
        balanceTaxSuccess: action.payload.results[0].description,
      };
    case "INVOICE_BALANCE_TAX_FAIL":
      return {
        ...state,
        balanceTaxError: action.payload,
      };
    //----------------------****Export Invoice****-----------------------------
    case "EXPORT_INVOICE_INIT":
      return {
        ...state,
        exportInvoice: "",
        exportInvoiceSuccess: "",
        exportInvoiceError: "",
      };
    case "EXPORT_INVOICE_SUCCESS":
      return {
        ...state,
        exportInvoice: action.payload.export || "",
        exportInvoiceSuccess: action.payload.results[0].description,
      };
    case "EXPORT_INVOICE_FAIL":
      return {
        ...state,
        exportInvoiceError: action.payload,
      };
    //----------------------****Export TPH****-----------------------------
    case "EXPORT_TPH_INIT":
      return {
        ...state,
        exportTPHSuccess: "",
        exportTPHError: "",
      };
    case "EXPORT_TPH_SUCCESS":
      return {
        ...state,
        exportTPHSuccess: action.payload.results[0].description,
      };
    case "EXPORT_TPH_FAIL":
      return {
        ...state,
        exportTPHError: action.payload,
      };
    //----------------------****Export Tax Invocie****-----------------------------
    case "EXPORT_TAX_INVOICE_INIT":
      return {
        ...state,
        exportTaxInvoice: [],
        exportTaxInvoiceSuccess: "",
        exportTaxInvoiceError: "",
      };
    case "EXPORT_TAX_INVOICE_SUCCESS":
      return {
        ...state,
        exportTaxInvoice: action.payload.taxInvoices || [],
        exportTaxInvoiceSuccess: action.payload.results[0].description,
      };
    case "EXPORT_TAX_INVOICE_FAIL":
      return {
        ...state,
        exportTaxInvoiceError: action.payload,
      };
    //----------------------****Move Batch****-----------------------------
    case "MOVE_BATCH_INIT":
      return {
        ...state,
        moveBatchSuccess: "",
        moveBatchError: "",
      };
    case "MOVE_BATCH_SUCCESS":
      return {
        ...state,
        moveBatchSuccess: action.payload.results[0].description,
      };
    case "MOVE_BATCH_FAIL":
      return {
        ...state,
        moveBatchError: action.payload,
      };
    //----------------------****Import Chq Request****-----------------------------
    case "IMPORT_CHQ_REQ_INIT":
      return {
        ...state,
        importChqReqSuccess: "",
        importChqReqError: "",
      };
    case "IMPORT_CHQ_REQ_SUCCESS":
      return {
        ...state,
        importChqReqSuccess: action.payload.results[0].description,
      };
    case "IMPORT_CHQ_REQ_FAIL":
      return {
        ...state,
        importChqReqError: action.payload,
      };
    //----------------------****Import List****-----------------------------
    case "IMPORT_LIST_INIT":
      return {
        ...state,
        importListSuccess: "",
        importListError: "",
      };
    case "IMPORT_LIST_SUCCESS":
      return {
        ...state,
        importListSuccess: action.payload.results[0].description,
      };
    case "IMPORT_LIST_FAIL":
      return {
        ...state,
        importListError: action.payload,
      };
    //----------------------****Import EP File****-----------------------------
    case "IMPORT_EP_FILE_INIT":
      return {
        ...state,
        importEPFileSuccess: "",
        importEPFileError: "",
      };
    case "IMPORT_EP_FILE_SUCCESS":
      return {
        ...state,
        importEPFileSuccess: action.payload.results[0].description,
      };
    case "IMPORT_EP_FILE_FAIL":
      return {
        ...state,
        importEPFileError: action.payload,
      };

    //-----------clear invoice states---------------------
    case "CLEAR_INVOICE_STATES":
      return {
        ...state,
        getInvoiceTalliesSuccess: "",
        getInvoiceTalliesError: "",

        getInvoicesListSuccess: "",
        getInvoicesListError: "",

        getInvoiceSuccess: "",
        getInvoiceError: "",

        draftInvoiceSuccess: "",
        draftInvoiceError: "",

        deleteInvoiceSuccess: "",
        deleteInvoiceError: "",

        getOCRTokenSuccess: "",
        getOCRTokenError: "",

        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        invoiceOCRLookupSuccess: "",
        invoiceOCRLookupError: "",

        importInvoiceSuccess: "",
        importInvoiceWarning: "",
        importInvoiceError: "",

        importInvoicLineseSuccess: "",
        importInvoicLineseError: "",

        exportInvoiceLinesSuccess: "",
        exportInvoiceLinesError: "",

        updateInvoiceSuccess: "",
        updateInvoiceError: "",

        addCommentSuccess: "",
        addCommentError: "",

        addInvoiceAttachmentSuccess: "",
        addInvoiceAttachmentError: "",

        getInvocieAttachmentSuccess: "",
        getInvocieAttachmentError: "",

        deleteInvoiceAttachmentSuccess: "",
        deleteInvoiceAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        approveInvoiceSuccess: "",
        approveInvoiceError: "",

        declineInvoiceSuccess: "",
        declineInvoiceError: "",

        sendForApprovalInvoiceSuccess: "",
        sendForApprovalInvoiceError: "",

        updateInvoiceLinesSuccess: "",
        updateInvoiceLinesError: "",

        calculateLineSuccess: "",
        calculateLineError: "",

        moveInvoiceSuccess: "",
        moveInvoiceError: "",

        regenerateSignatureSuccess: "",
        regenerateSignatureError: "",

        getTransactionsSuccess: "",
        getTransactionsError: "",

        getTransactionDetailsSuccess: "",
        getTransactionDetailsError: "",

        exportTransactions: "",
        exportTransactionsSuccess: "",
        exportTransactionsError: "",

        postInvoiceSuccess: "",
        postInvoiceError: "",

        balanceTaxSuccess: "",
        balanceTaxError: "",

        exportInvoiceSuccess: "",
        exportInvoiceError: "",

        exportTPHSuccess: "",
        exportTPHError: "",

        exportTaxInvoiceSuccess: "",
        exportTaxInvoiceError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importChqReqSuccess: "",
        importChqReqError: "",

        importListSuccess: "",
        importListError: "",

        importEPFileSuccess: "",
        importEPFileError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getInvoicesList: [],
        getInvoicesListSuccess: "",
        getInvoicesListError: "",

        getInvoice: "",
        getInvoiceSuccess: "",
        getInvoiceError: "",

        draftInvoice: "",
        draftInvoiceSuccess: "",
        draftInvoiceError: "",

        deleteInvoiceSuccess: "",
        deleteInvoiceError: "",

        getOCRToken: "",
        getOCRTokenSuccess: "",
        getOCRTokenError: "",

        addTaxLines: [],
        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        invoiceOCRLookup: "",
        invoiceOCRLookupSuccess: "",
        invoiceOCRLookupError: "",

        importInvoiceData: "",
        importInvoiceSuccess: "",
        importInvoiceWarning: "",
        importInvoiceError: "",

        importInvoicLinese: "",
        importInvoicLineseSuccess: "",
        importInvoicLineseError: "",

        exportInvoiceLines: "",
        exportInvoiceLinesSuccess: "",
        exportInvoiceLinesError: "",

        updateInvoiceSuccess: "",
        updateInvoiceError: "",

        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",

        addInvoiceAttachment: "",
        addInvoiceAttachmentSuccess: "",
        addInvoiceAttachmentError: "",

        getInvocieAttachment: "",
        getInvocieAttachmentSuccess: "",
        getInvocieAttachmentError: "",

        deleteInvoiceAttachmentSuccess: "",
        deleteInvoiceAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        approveInvoiceSuccess: "",
        approveInvoiceError: "",

        declineInvoiceSuccess: "",
        declineInvoiceError: "",

        sendForApprovalInvoiceSuccess: "",
        sendForApprovalInvoiceError: "",

        updateInvoiceLines: "",
        updateInvoiceLinesSuccess: "",
        updateInvoiceLinesError: "",

        calculateLine: "",
        calculateLineSuccess: "",
        calculateLineError: "",

        moveInvoiceSuccess: "",
        moveInvoiceError: "",

        regenerateSignatureSuccess: "",
        regenerateSignatureError: "",

        getTransactions: [],
        getTransactionsSuccess: "",
        getTransactionsError: "",

        getTransactionDetails: [],
        getTransactionDetailsSuccess: "",
        getTransactionDetailsError: "",

        exportTransactions: "",
        exportTransactionsSuccess: "",
        exportTransactionsError: "",

        postInvoice: "",
        postInvoiceSuccess: "",
        postInvoiceError: "",

        balanceTaxSuccess: "",
        balanceTaxError: "",

        exportInvoice: "",
        exportInvoiceSuccess: "",
        exportInvoiceError: "",

        exportTPHSuccess: "",
        exportTPHError: "",

        exportTaxInvoice: [],
        exportTaxInvoiceSuccess: "",
        exportTaxInvoiceError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importChqReqSuccess: "",
        importChqReqError: "",

        importListSuccess: "",
        importListError: "",

        importEPFileSuccess: "",
        importEPFileError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        invoiceTallies: [],
        getInvoiceTalliesSuccess: "",
        getInvoiceTalliesError: "",

        getInvoicesList: [],
        getInvoicesListSuccess: "",
        getInvoicesListError: "",

        getInvoice: "",
        getInvoiceSuccess: "",
        getInvoiceError: "",

        draftInvoice: "",
        draftInvoiceSuccess: "",
        draftInvoiceError: "",

        deleteInvoiceSuccess: "",
        deleteInvoiceError: "",

        getOCRToken: "",
        getOCRTokenSuccess: "",
        getOCRTokenError: "",

        addTaxLines: [],
        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        invoiceOCRLookup: "",
        invoiceOCRLookupSuccess: "",
        invoiceOCRLookupError: "",

        importInvoiceData: "",
        importInvoiceSuccess: "",
        importInvoiceWarning: "",
        importInvoiceError: "",

        importInvoicLinese: "",
        importInvoicLineseSuccess: "",
        importInvoicLineseError: "",

        exportInvoiceLines: "",
        exportInvoiceLinesSuccess: "",
        exportInvoiceLinesError: "",

        updateInvoiceSuccess: "",
        updateInvoiceError: "",

        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",

        addInvoiceAttachment: "",
        addInvoiceAttachmentSuccess: "",
        addInvoiceAttachmentError: "",

        getInvocieAttachment: "",
        getInvocieAttachmentSuccess: "",
        getInvocieAttachmentError: "",

        deleteInvoiceAttachmentSuccess: "",
        deleteInvoiceAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        approveInvoiceSuccess: "",
        approveInvoiceError: "",

        declineInvoiceSuccess: "",
        declineInvoiceError: "",

        sendForApprovalInvoiceSuccess: "",
        sendForApprovalInvoiceError: "",

        updateInvoiceLines: "",
        updateInvoiceLinesSuccess: "",
        updateInvoiceLinesError: "",

        calculateLine: "",
        calculateLineSuccess: "",
        calculateLineError: "",

        moveInvoiceSuccess: "",
        moveInvoiceError: "",

        regenerateSignatureSuccess: "",
        regenerateSignatureError: "",

        getTransactions: [],
        getTransactionsSuccess: "",
        getTransactionsError: "",

        getTransactionDetails: [],
        getTransactionDetailsSuccess: "",
        getTransactionDetailsError: "",

        exportTransactions: "",
        exportTransactionsSuccess: "",
        exportTransactionsError: "",

        postInvoice: "",
        postInvoiceSuccess: "",
        postInvoiceError: "",

        balanceTaxSuccess: "",
        balanceTaxError: "",

        exportInvoice: "",
        exportInvoiceSuccess: "",
        exportInvoiceError: "",

        exportTPHSuccess: "",
        exportTPHError: "",

        exportTaxInvoice: [],
        exportTaxInvoiceSuccess: "",
        exportTaxInvoiceError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importChqReqSuccess: "",
        importChqReqError: "",

        importListSuccess: "",
        importListError: "",

        importEPFileSuccess: "",
        importEPFileError: "",
      };
    default:
      return state;
  }
}
