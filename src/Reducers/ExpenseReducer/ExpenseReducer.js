const INIT_STATE = {
  expenseTallies: [],
  getExpenseTalliesSuccess: "",
  getExpenseTalliesError: "",

  getExpenseList: [],
  getExpenseListSuccess: "",
  getExpenseListError: "",

  getExpenseSummary: "",
  getExpenseSummarySuccess: "",
  getExpenseSummaryError: "",

  getExpenseDetail: "",
  getExpenseDetailSuccess: "",
  getExpenseDetailError: "",

  insertExpense: "",
  insertExpenseSuccess: "",
  insertExpenseError: "",

  updateExpense: "",
  updateExpenseSuccess: "",
  updateExpenseError: "",

  deleteExpenseSuccess: "",
  deleteExpenseError: "",

  addExpComments: [],
  addExpCommentSuccess: "",
  addExpCommentError: "",

  sendExpForApprovalSuccess: "",
  sendExpForApprovalError: "",

  getExpAttachment: "",
  getExpAttachmentSuccess: "",
  getExpAttachmentError: "",

  addExpAttachment: [],
  addExpAttachmentSuccess: "",
  addExpAttachmentError: "",

  updatePrimaryDocument: [],
  updatePrimaryDocumentSuccess: "",
  updatePrimaryDocumentError: "",

  deleteExpAttachmentSuccess: "",
  deleteExpAttachmentError: "",

  approveExpSuccess: "",
  approveExpError: "",

  declineExpSuccess: "",
  declineExpError: "",

  moveExpSuccess: "",
  moveExpError: "",

  holdExpSuccess: "",
  holdExpError: "",

  exportList: "",
  exportListSuccess: "",
  exportListError: "",

  createInvoiceSuccess: "",
  createInvoiceError: "",

  importEnvelopeSuccess: "",
  importEnvelopeError: "",

  exportEnvelope: "",
  exportEnvelopeSuccess: "",
  exportEnvelopeError: "",

  emailEnvelopeSuccess: "",
  emailEnvelopeError: "",

  impDebitTrans: "",
  impDebitTransSuccess: "",
  impDebitTransError: "",

  balanceTax: "",
  balanceTaxSuccess: "",
  balanceTaxError: "",

  addTaxLines: "",
  addTaxLinesSuccess: "",
  addTaxLinesError: "",

  addAdvancedLine: "",
  addAdvancedLineSuccess: "",
  addAdvancedLineError: "",

  addAccountedLine: "",
  addAccountedLineSuccess: "",
  addAccountedLineError: "",

  postExp: '',
  postExpSuccess: "",
  postExpError: "",

  moveBatchSuccess: "",
  moveBatchError: "",

  importListSuccess: "",
  importListError: "",

  importFuelExpSuccess: "",
  importFuelExpError: "",

  importSplitExpSuccess: "",
  importSplitExpError: "",

  getExpenseCodes: [],
  getExpenseCodesSuccess: "",
  getExpenseCodesError: "",

};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Expense Tallies****-----------------------------
    case "GET_EXPENSE_TALLIES_INIT":
      return {
        ...state,
        expenseTallies: [],
        getExpenseTalliesSuccess: "",
        getExpenseTalliesError: "",
      };
    case "GET_EXPENSE_TALLIES_SUCCESS":
      return {
        ...state,
        expenseTallies: action.payload.expenseTallies || [],
        getExpenseTalliesSuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_TALLIES_FAIL":
      return {
        ...state,
        getExpenseTalliesError: action.payload,
      };
    //----------------------****Get Expense List****-----------------------------
    case "GET_EXPENSE_LIST_INIT":
      return {
        ...state,
        getExpenseList: [],
        getExpenseListSuccess: "",
        getExpenseListError: "",
      };
    case "GET_EXPENSE_LIST_SUCCESS":
      return {
        ...state,
        getExpenseList: action.payload.expenseList || [],
        getExpenseListSuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_LIST_FAIL":
      return {
        ...state,
        getExpenseListError: action.payload,
      };
    //----------------------****Get Expense Summary****-----------------------------
    case "GET_EXPENSE_SUMMARY_INIT":
      return {
        ...state,
        getExpenseSummary: "",
        getExpenseSummarySuccess: "",
        getExpenseSummaryError: "",
      };
    case "GET_EXPENSE_SUMMARY_SUCCESS":
      return {
        ...state,
        getExpenseSummary: action.payload.expenseSummary || "",
        getExpenseSummarySuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_SUMMARY_FAIL":
      return {
        ...state,
        getExpenseSummaryError: action.payload,
      };
    //----------------------****Get Expense Detail****-----------------------------
    case "GET_EXPENSE_DETAIL_INIT":
      return {
        ...state,
        getExpenseDetail: "",
        getExpenseDetailSuccess: "",
        getExpenseDetailError: "",
      };
    case "GET_EXPENSE_DETAIL_SUCCESS":
      return {
        ...state,
        getExpenseDetail: action.payload.expenseDetail || "",
        getExpenseDetailSuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_DETAIL_FAIL":
      return {
        ...state,
        getExpenseDetailError: action.payload,
      };
    //----------------------****Insert Expense ****-----------------------------
    case "INSERT_EXPENSE_INIT":
      return {
        ...state,
        insertExpense: "",
        insertExpenseSuccess: "",
        insertExpenseError: "",
      };
    case "INSERT_EXPENSE_SUCCESS":
      return {
        ...state,
        insertExpense: action.payload.expenseDetail || "",
        insertExpenseSuccess: action.payload.result[0].description,
      };
    case "INSERT_EXPENSE_FAIL":
      return {
        ...state,
        insertExpenseError: action.payload,
      };
    //----------------------****Update Expense ****-----------------------------
    case "UPDATE_EXPENSE_INIT":
      return {
        ...state,
        updateExpense: "",
        updateExpenseSuccess: "",
        updateExpenseError: "",
      };
    case "UPDATE_EXPENSE_SUCCESS":
      return {
        ...state,
        updateExpense: action.payload.expenseDetail || "",
        updateExpenseSuccess: action.payload.result[0].description,
      };
    case "UPDATE_EXPENSE_FAIL":
      return {
        ...state,
        updateExpenseError: action.payload,
      };
    //----------------------****Delete Expense****-----------------------------
    case "DELETE_EXPENSE_INIT":
      return {
        ...state,
        deleteExpenseSuccess: "",
        deleteExpenseError: "",
      };
    case "DELETE_EXPENSE_SUCCESS":
      return {
        ...state,
        deleteExpenseSuccess: action.payload.result[0].description,
      };
    case "DELETE_EXPENSE_FAIL":
      return {
        ...state,
        deleteExpenseError: action.payload,
      };
    //----------------------****Add Comments****-----------------------------
    case "ADD_COMMENT_INIT":
      return {
        ...state,
        addExpComments: [],
        addExpCommentSuccess: "",
        addExpCommentError: "",
      };
    case "ADD_COMMENT_SUCCESS":
      return {
        ...state,
        addExpComments: action.payload.comments || [],
        addExpCommentSuccess: action.payload.result[0].description,
      };
    case "ADD_COMMENT_FAIL":
      return {
        ...state,
        addExpCommentError: action.payload,
      };
    //----------------------****Send Expense For Approval****-----------------------------
    case "SEND_EXPENSE_FOR_APPROVAL_INIT":
      return {
        ...state,
        sendExpForApprovalSuccess: "",
        sendExpForApprovalError: "",
      };
    case "SEND_EXPENSE_FOR_APPROVAL_SUCCESS":
      return {
        ...state,
        sendExpForApprovalSuccess: action.payload.result[0].description,
      };
    case "SEND_EXPENSE_FOR_APPROVAL_FAIL":
      return {
        ...state,
        sendExpForApprovalError: action.payload,
      };
    //----------------------****Get Expense Attachment****-----------------------------
    case "GET_EXPENSE_ATTACHMENT_INIT":
      return {
        ...state,
        getExpAttachment: "",
        getExpAttachmentSuccess: "",
        getExpAttachmentError: "",
      };
    case "GET_EXPENSE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getExpAttachment: action.payload || "",
        getExpAttachmentSuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_ATTACHMENT_FAIL":
      return {
        ...state,
        getExpAttachmentError: action.payload,
      };
    //----------------------****Add Expense Attachment****-----------------------------
    case "ADD_EXPENSE_ATTACHMENT_INIT":
      return {
        ...state,
        addExpAttachment: [],
        addExpAttachmentSuccess: "",
        addExpAttachmentError: "",
      };
    case "ADD_EXPENSE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        addExpAttachment: action.payload.attachments || [],
        addExpAttachmentSuccess: action.payload.result[0].description,
      };
    case "ADD_EXPENSE_ATTACHMENT_FAIL":
      return {
        ...state,
        addExpAttachmentError: action.payload,
      };
    //----------------------****Update Primary Document****-----------------------------
    case "UPDATE_PRIMARY_DOCUMENT_EXPENSE_INIT":
      return {
        ...state,
        updatePrimaryDocument: [],
        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",
      };
    case "UPDATE_PRIMARY_DOCUMENT_EXPENSE_SUCCESS":
      return {
        ...state,
        updatePrimaryDocument: action.payload.attachments || [],
        updatePrimaryDocumentSuccess: action.payload.result[0].description,
      };
    case "UPDATE_PRIMARY_DOCUMENT_EXPENSE_FAIL":
      return {
        ...state,
        updatePrimaryDocumentError: action.payload,
      };
    //----------------------****Delete Expense Attachment****-----------------------------
    case "DELETE_EXPENSE_ATTACHMENT_INIT":
      return {
        ...state,
        deleteExpAttachmentSuccess: "",
        deleteExpAttachmentError: "",
      };
    case "DELETE_EXPENSE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deleteExpAttachmentSuccess: action.payload.result[0].description,
      };
    case "DELETE_EXPENSE_ATTACHMENT_FAIL":
      return {
        ...state,
        deleteExpAttachmentError: action.payload,
      };
    //----------------------****Approve Expense****-----------------------------
    case "APPROVE_EXPENSE_INIT":
      return {
        ...state,
        approveExpSuccess: "",
        approveExpError: "",
      };
    case "APPROVE_EXPENSE_SUCCESS":
      return {
        ...state,
        approveExpSuccess: action.payload.result[0].description,
      };
    case "APPROVE_EXPENSE_FAIL":
      return {
        ...state,
        approveExpError: action.payload,
      };
    //----------------------****Decline Expense****-----------------------------
    case "DECLINE_EXPENSE_INIT":
      return {
        ...state,
        declineExpSuccess: "",
        declineExpError: "",
      };
    case "DECLINE_EXPENSE_SUCCESS":
      return {
        ...state,
        declineExpSuccess: action.payload.result[0].description,
      };
    case "DECLINE_EXPENSE_FAIL":
      return {
        ...state,
        declineExpError: action.payload,
      };
    //----------------------****Move Expense****-----------------------------
    case "MOVE_EXPENSE_INIT":
      return {
        ...state,
        moveExpSuccess: "",
        moveExpError: "",
      };
    case "MOVE_EXPENSE_SUCCESS":
      return {
        ...state,
        moveExpSuccess: action.payload.result[0].description,
      };
    case "MOVE_EXPENSE_FAIL":
      return {
        ...state,
        moveExpError: action.payload,
      };
    //----------------------****Hold Expense****-----------------------------
    case "HOLD_EXPENSE_INIT":
      return {
        ...state,
        holdExpSuccess: "",
        holdExpError: "",
      };
    case "HOLD_EXPENSE_SUCCESS":
      return {
        ...state,
        holdExpSuccess: action.payload.result[0].description,
      };
    case "HOLD_EXPENSE_FAIL":
      return {
        ...state,
        holdExpError: action.payload,
      };
    //----------------------****Export List****-----------------------------
    case "EXPORT_LIST_INIT":
      return {
        ...state,
        exportList: "",
        exportListSuccess: "",
        exportListError: "",
      };
    case "EXPORT_LIST_SUCCESS":
      return {
        ...state,
        exportList: action.payload,
        exportListSuccess: action.payload.result[0].description,
      };
    case "EXPORT_LIST_FAIL":
      return {
        ...state,
        exportListError: action.payload,
      };
    //----------------------****Create Invoice****-----------------------------
    case "CREATE_INVOICE_INIT":
      return {
        ...state,
        createInvoiceSuccess: "",
        createInvoiceError: "",
      };
    case "CREATE_INVOICE_SUCCESS":
      return {
        ...state,
        createInvoiceSuccess: action.payload.result[0].description,
      };
    case "CREATE_INVOICE_FAIL":
      return {
        ...state,
        createInvoiceError: action.payload,
      };
    //----------------------****Export Envelope****-----------------------------
    case "EXPORT_ENVELOPE_INIT":
      return {
        ...state,
        exportEnvelope: "",
        exportEnvelopeSuccess: "",
        exportEnvelopeError: "",
      };
    case "EXPORT_ENVELOPE_SUCCESS":
      return {
        ...state,
        exportEnvelope: action.payload,
        exportEnvelopeSuccess: action.payload.result[0].description,
      };
    case "EXPORT_ENVELOPE_FAIL":
      return {
        ...state,
        exportEnvelopeError: action.payload,
      };
    //----------------------****Email Envelope****-----------------------------
    case "EMAIL_ENVELOPE_INIT":
      return {
        ...state,
        emailEnvelopeSuccess: "",
        emailEnvelopeError: "",
      };
    case "EMAIL_ENVELOPE_SUCCESS":
      return {
        ...state,
        emailEnvelopeSuccess: action.payload.result[0].description,
      };
    case "EMAIL_ENVELOPE_FAIL":
      return {
        ...state,
        emailEnvelopeError: action.payload,
      };
    //----------------------****Import Debit Transactions****-----------------------------
    case "IMPORT_DEBIT_TRANSACTIONS_INIT":
      return {
        ...state,
        impDebitTrans: "",
        impDebitTransSuccess: "",
        impDebitTransError: "",
      };
    case "IMPORT_DEBIT_TRANSACTIONS_SUCCESS":
      return {
        ...state,
        impDebitTrans: action.payload,
        impDebitTransSuccess: action.payload.result[0].description,
      };
    case "IMPORT_DEBIT_TRANSACTIONS_FAIL":
      return {
        ...state,
        impDebitTransError: action.payload,
      };
    //----------------------****Balance Tax****-----------------------------
    case "BALANCE_TAX_INIT":
      return {
        ...state,
        balanceTax: "",
        balanceTaxSuccess: "",
        balanceTaxError: "",
      };
    case "BALANCE_TAX_SUCCESS":
      return {
        ...state,
        balanceTax: action.payload,
        balanceTaxSuccess: action.payload.result[0].description,
      };
    case "BALANCE_TAX_FAIL":
      return {
        ...state,
        balanceTaxError: action.payload,
      };
    //----------------------****Add Tax Lines****-----------------------------
    case "ADD_TAX_LINES_EXPENSE_INIT":
      return {
        ...state,
        addTaxLines: "",
        addTaxLinesSuccess: "",
        addTaxLinesError: "",
      };
    case "ADD_TAX_LINES_EXPENSE_SUCCESS":
      return {
        ...state,
        addTaxLines: action.payload.expenseItems || [],
        addTaxLinesSuccess: action.payload.result[0].description,
      };
    case "ADD_TAX_LINES_EXPENSE_FAIL":
      return {
        ...state,
        addTaxLinesError: action.payload,
      };
    //----------------------****Add Advanced Line****-----------------------------
    case "ADD_ADVANCED_LINE_EXPENSE_INIT":
      return {
        ...state,
        addAdvancedLine: "",
        addAdvancedLineSuccess: "",
        addAdvancedLineError: "",
      };
    case "ADD_ADVANCED_LINE_EXPENSE_SUCCESS":
      return {
        ...state,
        addAdvancedLine: action.payload.expenseItems || [],
        addAdvancedLineSuccess: action.payload.result[0].description,
      };
    case "ADD_ADVANCED_LINE_EXPENSE_FAIL":
      return {
        ...state,
        addAdvancedLineError: action.payload,
      };
    //----------------------****Add Accounted Line****-----------------------------
    case "ADD_ACCOUNTED_LINE_EXPENSE_INIT":
      return {
        ...state,
        addAccountedLine: "",
        addAccountedLineSuccess: "",
        addAccountedLineError: "",
      };
    case "ADD_ACCOUNTED_LINE_EXPENSE_SUCCESS":
      return {
        ...state,
        addAccountedLine: action.payload.expenseItems || [],
        addAccountedLineSuccess: action.payload.result[0].description,
      };
    case "ADD_ACCOUNTED_LINE_EXPENSE_FAIL":
      return {
        ...state,
        addAccountedLineError: action.payload,
      };
    //----------------------****Post Expense****----------------------------------
    case "POST_EXPENSE_INIT":
      return {
        ...state,
        postExp: '',
        postExpSuccess: "",
        postExpError: "",
      };
    case "POST_EXPENSE_SUCCESS":
      return {
        ...state,
        postExp: action.payload,
        postExpSuccess: action.payload.result[0].description,
      };
    case "POST_EXPENSE_FAIL":
      return {
        ...state,
        postExpError: action.payload,
      };
    //----------------------****Move Batch****-----------------------------
    case "MOVE_EXP_BATCH_INIT":
      return {
        ...state,
        moveBatchSuccess: "",
        moveBatchError: "",
      };
    case "MOVE_EXP_BATCH_SUCCESS":
      return {
        ...state,
        moveBatchSuccess: action.payload.result[0].description,
      };
    case "MOVE_EXP_BATCH_FAIL":
      return {
        ...state,
        moveBatchError: action.payload,
      };
    //----------------------****Import Envelope****-----------------------------
    case "IMPORT_ENVELOPE_INIT":
      return {
        ...state,
        importEnvelopeSuccess: "",
        importEnvelopeError: "",
      };
    case "IMPORT_ENVELOPE_SUCCESS":
      return {
        ...state,
        importEnvelopeSuccess: action.payload.result[0].description,
      };
    case "IMPORT_ENVELOPE_FAIL":
      return {
        ...state,
        importEnvelopeError: action.payload,
      };
    //----------------------****Import List****-----------------------------
    case "IMPORT_EXP_LIST_INIT":
      return {
        ...state,
        importListSuccess: "",
        importListError: "",
      };
    case "IMPORT_EXP_LIST_SUCCESS":
      return {
        ...state,
        importListSuccess: action.payload.result[0].description,
      };
    case "IMPORT_EXP_LIST_FAIL":
      return {
        ...state,
        importListError: action.payload,
      };
    //----------------------****Import Fuel Expense****-----------------------------
    case "IMPORT_FUEL_EXP_INIT":
      return {
        ...state,
        importFuelExpSuccess: "",
        importFuelExpError: "",
      };
    case "IMPORT_FUEL_EXP_SUCCESS":
      return {
        ...state,
        importFuelExpSuccess: action.payload.result[0].description,
      };
    case "IMPORT_FUEL_EXP_FAIL":
      return {
        ...state,
        importFuelExpError: action.payload,
      };
    //----------------------****Import Split Expense****-----------------------------
    case "IMPORT_SPLIT_EXP_INIT":
      return {
        ...state,
        importSplitExpSuccess: "",
        importSplitExpError: "",
      };
    case "IMPORT_SPLIT_EXP_SUCCESS":
      return {
        ...state,
        importSplitExpSuccess: action.payload.result[0].description,
      };
    case "IMPORT_SPLIT_EXP_FAIL":
      return {
        ...state,
        importSplitExpError: action.payload,
      };
    //----------------------****Get Expense Codes****-----------------------------
    case "GET_EXPENSE_CODES_INIT":
      return {
        ...state,
        getExpenseCodes: [],
        getExpenseCodesSuccess: "",
        getExpenseCodesError: "",
      };
    case "GET_EXPENSE_CODES_SUCCESS":
      return {
        ...state,
        getExpenseCodes: action.payload.expenseCodes || [],
        getExpenseCodesSuccess: action.payload.result[0].description,
      };
    case "GET_EXPENSE_CODES_FAIL":
      return {
        ...state,
        getExpenseCodesError: action.payload,
      };
    //----------------------****Clear Expense states****-----------------------------
    case "CLEAR_EXPENSE_STATES":
      return {
        ...state,

        getExpenseTalliesSuccess: "",
        getExpenseTalliesError: "",

        getExpenseListSuccess: "",
        getExpenseListError: "",

        getExpenseSummarySuccess: "",
        getExpenseSummaryError: "",

        getExpenseDetailSuccess: "",
        getExpenseDetailError: "",

        insertExpenseSuccess: "",
        insertExpenseError: "",

        updateExpenseSuccess: "",
        updateExpenseError: "",

        deleteExpenseSuccess: "",
        deleteExpenseError: "",

        addExpCommentSuccess: "",
        addExpCommentError: "",

        sendExpForApprovalSuccess: "",
        sendExpForApprovalError: "",

        getExpAttachmentSuccess: "",
        getExpAttachmentError: "",

        addExpAttachmentSuccess: "",
        addExpAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        deleteExpAttachmentSuccess: "",
        deleteExpAttachmentError: "",

        approveExpSuccess: "",
        approveExpError: "",

        declineExpSuccess: "",
        declineExpError: "",

        moveExpSuccess: "",
        moveExpError: "",

        holdExpSuccess: "",
        holdExpError: "",

        exportListSuccess: "",
        exportListError: "",

        createInvoiceSuccess: "",
        createInvoiceError: "",

        importEnvelopeSuccess: "",
        importEnvelopeError: "",

        exportEnvelopeSuccess: "",
        exportEnvelopeError: "",

        emailEnvelopeSuccess: "",
        emailEnvelopeError: "",

        impDebitTransSuccess: "",
        impDebitTransError: "",

        balanceTaxSuccess: "",
        balanceTaxError: "",

        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        addAdvancedLineSuccess: "",
        addAdvancedLineError: "",

        addAccountedLineSuccess: "",
        addAccountedLineError: "",

        postExpSuccess: "",
        postExpError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importListSuccess: "",
        importListError: "",

        importFuelExpSuccess: "",
        importFuelExpError: "",

        importSplitExpSuccess: "",
        importSplitExpError: "",

        getExpenseCodesSuccess: "",
        getExpenseCodesError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,

        getExpenseList: [],
        getExpenseListSuccess: "",
        getExpenseListError: "",

        getExpenseSummary: "",
        getExpenseSummarySuccess: "",
        getExpenseSummaryError: "",

        getExpenseDetail: "",
        getExpenseDetailSuccess: "",
        getExpenseDetailError: "",

        insertExpense: "",
        insertExpenseSuccess: "",
        insertExpenseError: "",

        updateExpense: "",
        updateExpenseSuccess: "",
        updateExpenseError: "",

        deleteExpenseSuccess: "",
        deleteExpenseError: "",

        addExpComments: [],
        addExpCommentSuccess: "",
        addExpCommentError: "",

        sendExpForApprovalSuccess: "",
        sendExpForApprovalError: "",

        getExpAttachment: "",
        getExpAttachmentSuccess: "",
        getExpAttachmentError: "",

        addExpAttachment: [],
        addExpAttachmentSuccess: "",
        addExpAttachmentError: "",

        updatePrimaryDocument: [],
        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        deleteExpAttachmentSuccess: "",
        deleteExpAttachmentError: "",

        approveExpSuccess: "",
        approveExpError: "",

        declineExpSuccess: "",
        declineExpError: "",

        moveExpSuccess: "",
        moveExpError: "",

        holdExpSuccess: "",
        holdExpError: "",

        exportList: "",
        exportListSuccess: "",
        exportListError: "",

        createInvoiceSuccess: "",
        createInvoiceError: "",

        importEnvelopeSuccess: "",
        importEnvelopeError: "",

        exportEnvelope: "",
        exportEnvelopeSuccess: "",
        exportEnvelopeError: "",

        emailEnvelopeSuccess: "",
        emailEnvelopeError: "",

        impDebitTrans: "",
        impDebitTransSuccess: "",
        impDebitTransError: "",

        balanceTax: "",
        balanceTaxSuccess: "",
        balanceTaxError: "",

        addTaxLines: "",
        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        addAdvancedLine: "",
        addAdvancedLineSuccess: "",
        addAdvancedLineError: "",

        addAccountedLine: "",
        addAccountedLineSuccess: "",
        addAccountedLineError: "",

        postExp: '',
        postExpSuccess: "",
        postExpError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importListSuccess: "",
        importListError: "",

        importFuelExpSuccess: "",
        importFuelExpError: "",

        importSplitExpSuccess: "",
        importSplitExpError: "",

        getExpenseCodes: [],
        getExpenseCodesSuccess: "",
        getExpenseCodesError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,

        expenseTallies: [],
        getExpenseTalliesSuccess: "",
        getExpenseTalliesError: "",

        getExpenseList: [],
        getExpenseListSuccess: "",
        getExpenseListError: "",

        getExpenseSummary: "",
        getExpenseSummarySuccess: "",
        getExpenseSummaryError: "",

        getExpenseDetail: "",
        getExpenseDetailSuccess: "",
        getExpenseDetailError: "",

        insertExpense: "",
        insertExpenseSuccess: "",
        insertExpenseError: "",

        updateExpense: "",
        updateExpenseSuccess: "",
        updateExpenseError: "",

        deleteExpenseSuccess: "",
        deleteExpenseError: "",

        addExpComments: [],
        addExpCommentSuccess: "",
        addExpCommentError: "",

        sendExpForApprovalSuccess: "",
        sendExpForApprovalError: "",

        getExpAttachment: "",
        getExpAttachmentSuccess: "",
        getExpAttachmentError: "",

        addExpAttachment: [],
        addExpAttachmentSuccess: "",
        addExpAttachmentError: "",

        updatePrimaryDocument: [],
        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        deleteExpAttachmentSuccess: "",
        deleteExpAttachmentError: "",

        approveExpSuccess: "",
        approveExpError: "",

        declineExpSuccess: "",
        declineExpError: "",

        moveExpSuccess: "",
        moveExpError: "",

        holdExpSuccess: "",
        holdExpError: "",

        exportList: "",
        exportListSuccess: "",
        exportListError: "",

        createInvoiceSuccess: "",
        createInvoiceError: "",

        importEnvelopeSuccess: "",
        importEnvelopeError: "",

        exportEnvelope: "",
        exportEnvelopeSuccess: "",
        exportEnvelopeError: "",

        emailEnvelopeSuccess: "",
        emailEnvelopeError: "",

        impDebitTrans: "",
        impDebitTransSuccess: "",
        impDebitTransError: "",

        balanceTax: "",
        balanceTaxSuccess: "",
        balanceTaxError: "",

        addTaxLines: "",
        addTaxLinesSuccess: "",
        addTaxLinesError: "",

        addAdvancedLine: "",
        addAdvancedLineSuccess: "",
        addAdvancedLineError: "",

        addAccountedLine: "",
        addAccountedLineSuccess: "",
        addAccountedLineError: "",

        postExp: '',
        postExpSuccess: "",
        postExpError: "",

        moveBatchSuccess: "",
        moveBatchError: "",

        importListSuccess: "",
        importListError: "",

        importFuelExpSuccess: "",
        importFuelExpError: "",

        importSplitExpSuccess: "",
        importSplitExpError: "",

        getExpenseCodes: [],
        getExpenseCodesSuccess: "",
        getExpenseCodesError: "",
      };
    default:
      return state
  }
}
