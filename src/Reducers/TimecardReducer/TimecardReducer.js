const INIT_STATE = {
  timecardTallies: [],
  timecardTalliesSuccess: "",
  timecardTalliesError: "",

  getTimecardList: [],
  getTimecardListSuccess: "",
  getTimecardListError: "",

  getTimecard: "",
  getTimecardSuccess: "",
  getTimecardError: "",

  getTimecardSummary: "",
  getTimecardSummarySuccess: "",
  getTimecardSummaryError: "",

  updateTimecardSummary: "",
  updateTimecardSummarySuccess: "",
  updateTimecardSummaryError: "",

  primeTimecard: "",
  primeTimecardSuccess: "",
  primeTimecardError: "",

  insertTimecardSuccess: "",
  insertTimecardError: "",

  updateTimecardSuccess: "",
  updateTimecardError: "",

  deleteTimecardSuccess: "",
  deleteTimecardError: "",

  declineTimecardSuccess: "",
  declineTimecardError: "",

  sendForApprovalTimecardSuccess: "",
  sendForApprovalTimecardError: "",

  holdTimecardSuccess: "",
  holdTimecardError: "",

  approveTimecardSuccess: "",
  approveTimecardError: "",

  addAttachments: [],
  addAttachmentsSuccess: "",
  addAttachmentsError: "",

  addComments: [],
  addCommentSuccess: "",
  addCommentError: "",

  getAttachmentsList: [],
  getAttachmentsListSuccess: "",
  getAttachmentsListError: "",

  getEmployeeList: [],
  getEmployeeListSuccess: "",
  getEmployeeListError: "",

  copyLastWeeksTimes: "",
  copyLastWeeksTimesSuccess: "",
  copyLastWeeksTimesError: "",

  regenerateTimecard: [],
  regenerateTimecardSuccess: "",
  regenerateTimecardError: "",

  sendReportsSuccess: "",
  sendReportsError: "",

  lockAndInvoiceSuccess: "",
  lockAndInvoiceError: "",

  createEFTFileSuccess: "",
  createEFTFileError: "",

  sendPaySlipSuccess: "",
  sendPaySlipError: "",

  postDataSuccess: "",
  postDataError: "",

  resendSTPFileSuccess: "",
  resendSTPFileError: "",

  sendYearEndSTPFileSuccess: "",
  sendYearEndSTPFileError: "",

  moveTimecardBatchSuccess: "",
  moveTimecardBatchError: "",

  moveTimecardSuccess: "",
  moveTimecardError: "",

  exportTimecard: "",
  exportTimecardSuccess: "",
  exportTimecardError: "",

  importTimecardSuccess: "",
  importTimecardError: "",

  exportDistribution: "",
  exportDistributionSuccess: "",
  exportDistributionError: "",

  exportTPHPayrollSuccess: "",
  exportTPHPayrollError: "",

  refreshEmployees: [],
  refreshEmployeesSuccess: "",
  refreshEmployeesError: "",

  getAttachment: {},
  getAttachmentSuccess: "",
  getAttachmentError: "",

  deleteAttachmentSuccess: "",
  deleteAttachmentError: "",

  taxBalanceSuccess: "",
  taxBalanceError: "",

  calculateDay: [],
  calculateDaySuccess: "",
  calculateDayError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Timecard Tallies****---------------
    case "GET_TIMECARD_TALLIES_INIT":
      return {
        ...state,
        timecardTallies: [],
        timecardTalliesSuccess: "",
        timecardTalliesError: "",
      };
    case "GET_TIMECARD_TALLIES_SUCCESS":
      return {
        ...state,
        timecardTallies: action.payload.timecardTallies || [],
        timecardTalliesSuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_TALLIES_FAIL":
      return {
        ...state,
        timecardTalliesError: action.payload,
      };
    //----------------------****Get Timecard List****------------------
    case "GET_TIMECARD_LIST_INIT":
      return {
        ...state,
        getTimecardList: [],
        getTimecardListSuccess: "",
        getTimecardListError: "",
      };
    case "GET_TIMECARD_LIST_SUCCESS":
      return {
        ...state,
        getTimecardList: action.payload.timecardList || [],
        getTimecardListSuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_LIST_FAIL":
      return {
        ...state,
        getTimecardListError: action.payload,
      };
    //----------------------****Get Timecard****-----------------------
    case "GET_TIMECARD_INIT":
      return {
        ...state,
        getTimecard: "",
        getTimecardSuccess: "",
        getTimecardError: "",
      };
    case "GET_TIMECARD_SUCCESS":
      return {
        ...state,
        getTimecard: action.payload.timecard || "",
        getTimecardSuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_FAIL":
      return {
        ...state,
        getTimecardError: action.payload,
      };
    //----------------------****Get Timecard Summary****---------------
    case "GET_TIMECARD_SUMMARY_INIT":
      return {
        ...state,
        getTimecardSummary: "",
        getTimecardSummarySuccess: "",
        getTimecardSummaryError: "",
      };
    case "GET_TIMECARD_SUMMARY_SUCCESS":
      return {
        ...state,
        getTimecardSummary: action.payload.timecard || "",
        getTimecardSummarySuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_SUMMARY_FAIL":
      return {
        ...state,
        getTimecardSummaryError: action.payload,
      };
    //----------------------****Update Timecard Summary****------------
    case "UPDATE_SUMMARY_INIT":
      return {
        ...state,
        updateTimecardSummary: "",
        updateTimecardSummarySuccess: "",
        updateTimecardSummaryError: "",
      };
    case "UPDATE_SUMMARY_SUCCESS":
      return {
        ...state,
        updateTimecardSummary: action.payload.timecard || "",
        updateTimecardSummarySuccess: action.payload.result[0].description,
      };
    case "UPDATE_SUMMARY_FAIL":
      return {
        ...state,
        updateTimecardSummaryError: action.payload,
      };
    //----------------------****Prime Timecard ****--------------------
    case "PRIME_TIMECARD_INIT":
      return {
        ...state,
        primeTimecard: "",
        primeTimecardSuccess: "",
        primeTimecardError: "",
      };
    case "PRIME_TIMECARD_SUCCESS":
      return {
        ...state,
        primeTimecard: action.payload.timecard || "",
        primeTimecardSuccess: action.payload.result[0].description,
      };
    case "PRIME_TIMECARD_FAIL":
      return {
        ...state,
        primeTimecardError: action.payload,
      };
    //----------------------****Insert Timecard ****-------------------
    case "INSERT_TIMECARD_INIT":
      return {
        ...state,
        insertTimecardSuccess: "",
        insertTimecardError: "",
      };
    case "INSERT_TIMECARD_SUCCESS":
      return {
        ...state,
        insertTimecardSuccess: action.payload.result[0].description,
      };
    case "INSERT_TIMECARD_FAIL":
      return {
        ...state,
        insertTimecardError: action.payload,
      };
    //----------------------****Update Timecard****--------------------
    case "UPDATE_TIMECARD_INIT":
      return {
        ...state,
        updateTimecardSuccess: "",
        updateTimecardError: "",
      };
    case "UPDATE_TIMECARD_SUCCESS":
      return {
        ...state,
        updateTimecardSuccess: action.payload.result[0].description,
      };
    case "UPDATE_TIMECARD_FAIL":
      return {
        ...state,
        updateTimecardError: action.payload,
      };
    //----------------------****Delete Timecard ****-------------------
    case "DELETE_TIMECARD_INIT":
      return {
        ...state,
        deleteTimecardSuccess: "",
        deleteTimecardError: "",
      };
    case "DELETE_TIMECARD_SUCCESS":
      return {
        ...state,
        deleteTimecardSuccess: action.payload.result[0].description,
      };
    case "DELETE_TIMECARD_FAIL":
      return {
        ...state,
        deleteTimecardError: action.payload,
      };
    //----------------------****Decline Timecard ****------------------
    case "DECLINE_TIMECARD_INIT":
      return {
        ...state,
        declineTimecardSuccess: "",
        declineTimecardError: "",
      };
    case "DECLINE_TIMECARD_SUCCESS":
      return {
        ...state,
        declineTimecardSuccess: action.payload.result[0].description,
      };
    case "DECLINE_TIMECARD_FAIL":
      return {
        ...state,
        declineTimecardError: action.payload,
      };
    //----------------------****Send For Approval Timecard ****--------
    case "SEND_FOR_APPROVAL_TIMECARD_INIT":
      return {
        ...state,
        sendForApprovalTimecardSuccess: "",
        sendForApprovalTimecardError: "",
      };
    case "SEND_FOR_APPROVAL_TIMECARD_SUCCESS":
      return {
        ...state,
        sendForApprovalTimecardSuccess: action.payload.result[0].description,
      };
    case "SEND_FOR_APPROVAL_TIMECARD_FAIL":
      return {
        ...state,
        sendForApprovalTimecardError: action.payload,
      };
    //----------------------****Hold Timecard ****---------------------
    case "HOLD_TIMECARD_INIT":
      return {
        ...state,
        holdTimecardSuccess: "",
        holdTimecardError: "",
      };
    case "HOLD_TIMECARD_SUCCESS":
      return {
        ...state,
        holdTimecardSuccess: action.payload.result[0].description,
      };
    case "HOLD_TIMECARD_FAIL":
      return {
        ...state,
        holdTimecardError: action.payload,
      };
    //----------------------****Approve Timecard ****------------------
    case "APPROVE_TIMECARD_INIT":
      return {
        ...state,
        approveTimecardSuccess: "",
        approveTimecardError: "",
      };
    case "APPROVE_TIMECARD_SUCCESS":
      return {
        ...state,
        approveTimecardSuccess: action.payload.result[0].description,
      };
    case "APPROVE_TIMECARD_FAIL":
      return {
        ...state,
        approveTimecardError: action.payload,
      };
    //----------------------****Add Timecard Attachments***------------
    case "ADD_TIMECARD_ATTACHMENTS_INIT":
      return {
        ...state,
        addAttachments: [],
        addAttachmentsSuccess: "",
        addAttachmentsError: "",
      };
    case "ADD_TIMECARD_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        addAttachments: action.payload.attachments || [],
        addAttachmentsSuccess: action.payload.result[0].description,
      };
    case "ADD_TIMECARD_ATTACHMENTS_FAIL":
      return {
        ...state,
        addAttachmentsError: action.payload,
      };
    //----------------------****Add Comment***-------------------------
    case "ADD_TIMECARD_COMMENT_INIT":
      return {
        ...state,
        addComments: [],
        addCommentSuccess: "",
        addCommentError: "",
      };
    case "ADD_TIMECARD_COMMENT_SUCCESS":
      return {
        ...state,
        addComments: action.payload.comments || [],
        addCommentSuccess: action.payload.result[0].description,
      };
    case "ADD_TIMECARD_COMMENT_FAIL":
      return {
        ...state,
        addCommentError: action.payload,
      };
    //----------------------****Get Timecard Attachments List***-------
    case "GET_TIMECARD_ATTACHMENTS_LIST_INIT":
      return {
        ...state,
        getAttachmentsList: [],
        getAttachmentsListSuccess: "",
        getAttachmentsListError: "",
      };
    case "GET_TIMECARD_ATTACHMENTS_LIST_SUCCESS":
      return {
        ...state,
        getAttachmentsList: action.payload.attachments | [],
        getAttachmentsListSuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_ATTACHMENTS_LIST_FAIL":
      return {
        ...state,
        getAttachmentsListError: action.payload,
      };
    //----------------------****Get Employee List***-------------------
    case "GET_EMPLOYEE_LIST_INIT":
      return {
        ...state,
        getEmployeeList: [],
        getEmployeeListSuccess: "",
        getEmployeeListError: "",
      };
    case "GET_EMPLOYEE_LIST_SUCCESS":
      return {
        ...state,
        getEmployeeList: action.payload.employees || [],
        getEmployeeListSuccess: action.payload.result[0].description,
      };
    case "GET_EMPLOYEE_LIST_FAIL":
      return {
        ...state,
        getEmployeeListError: action.payload,
      };
    //----------------------****Copy Last Weeks Times***---------------
    case "COPY_LAST_WEEKS_TIMES_INIT":
      return {
        ...state,
        copyLastWeeksTimes: "",
        copyLastWeeksTimesSuccess: "",
        copyLastWeeksTimesError: "",
      };
    case "COPY_LAST_WEEKS_TIMES_SUCCESS":
      return {
        ...state,
        copyLastWeeksTimes: action.payload.timecard || "",
        copyLastWeeksTimesSuccess: action.payload.result[0].description,
      };
    case "COPY_LAST_WEEKS_TIMES_FAIL":
      return {
        ...state,
        copyLastWeeksTimesError: action.payload,
      };
    //----------------------****Regenerate Timecard***-----------------
    case "REGENERATE_TIMECARD_INIT":
      return {
        ...state,
        regenerateTimecard: [],
        regenerateTimecardSuccess: "",
        regenerateTimecardError: "",
      };
    case "REGENERATE_TIMECARD_SUCCESS":
      return {
        ...state,
        regenerateTimecard: action.payload.previews || [],
        regenerateTimecardSuccess: action.payload.result[0].description,
      };
    case "REGENERATE_TIMECARD_FAIL":
      return {
        ...state,
        regenerateTimecardError: action.payload,
      };
    //----------------------****Send Reports***------------------------
    case "SEND_REPORTS_INIT":
      return {
        ...state,
        sendReportsSuccess: "",
        sendReportsError: "",
      };
    case "SEND_REPORTS_SUCCESS":
      return {
        ...state,
        sendReportsSuccess: action.payload.result[0].description,
      };
    case "SEND_REPORTS_FAIL":
      return {
        ...state,
        sendReportsError: action.payload,
      };
    //----------------------****Lock And Invoice***--------------------
    case "LOCK_AND_INVOICE_INIT":
      return {
        ...state,
        lockAndInvoiceSuccess: "",
        lockAndInvoiceError: "",
      };
    case "LOCK_AND_INVOICE_SUCCESS":
      return {
        ...state,
        lockAndInvoiceSuccess: action.payload.result[0].description,
      };
    case "LOCK_AND_INVOICE_FAIL":
      return {
        ...state,
        lockAndInvoiceError: action.payload,
      };
    //----------------------****Create EFT File***---------------------
    case "CREATE_EFT_FILE_INIT":
      return {
        ...state,
        createEFTFileSuccess: "",
        createEFTFileError: "",
      };
    case "CREATE_EFT_FILE_SUCCESS":
      return {
        ...state,
        createEFTFileSuccess: action.payload.result[0].description,
      };
    case "CREATE_EFT_FILE_FAIL":
      return {
        ...state,
        createEFTFileError: action.payload,
      };
    //----------------------****Send Pay Slips***----------------------
    case "SEND_PAY_SLIPS_INIT":
      return {
        ...state,
        sendPaySlipSuccess: "",
        sendPaySlipError: "",
      };
    case "SEND_PAY_SLIPS_SUCCESS":
      return {
        ...state,
        sendPaySlipSuccess: action.payload.result[0].description,
      };
    case "SEND_PAY_SLIPS_FAIL":
      return {
        ...state,
        sendPaySlipError: action.payload,
      };
    //----------------------****Post Data***---------------------------
    case "POST_DATA_INIT":
      return {
        ...state,
        postDataSuccess: "",
        postDataError: "",
      };
    case "POST_DATA_SUCCESS":
      return {
        ...state,
        postDataSuccess: action.payload.result[0].description,
      };
    case "POST_DATA_FAIL":
      return {
        ...state,
        postDataError: action.payload,
      };
    //----------------------****Resend STP File***---------------------
    case "RESEND_STP_FILE_INIT":
      return {
        ...state,
        resendSTPFileSuccess: "",
        resendSTPFileError: "",
      };
    case "RESEND_STP_FILE_SUCCESS":
      return {
        ...state,
        resendSTPFileSuccess: action.payload.result[0].description,
      };
    case "RESEND_STP_FILE_FAIL":
      return {
        ...state,
        resendSTPFileError: action.payload,
      };
    //----------------------****Send Year End STP File***--------------
    case "SEND_YEAR_END_STP_FILE_INIT":
      return {
        ...state,
        sendYearEndSTPFileSuccess: "",
        sendYearEndSTPFileError: "",
      };
    case "SEND_YEAR_END_STP_FILE_SUCCESS":
      return {
        ...state,
        sendYearEndSTPFileSuccess: action.payload.result[0].description,
      };
    case "SEND_YEAR_END_STP_FILE_FAIL":
      return {
        ...state,
        sendYearEndSTPFileError: action.payload,
      };
    //----------------------****Move Batch***--------------------------
    case "MOVE_TIMECARD_BATCH_INIT":
      return {
        ...state,
        moveTimecardBatchSuccess: "",
        moveTimecardBatchError: "",
      };
    case "MOVE_TIMECARD_BATCH_SUCCESS":
      return {
        ...state,
        moveTimecardBatchSuccess: action.payload.result[0].description,
      };
    case "MOVE_TIMECARD_BATCH_FAIL":
      return {
        ...state,
        moveTimecardBatchError: action.payload,
      };
    //----------------------****Move Timecard***--------------------------
    case "MOVE_TIMECARD_INIT":
      return {
        ...state,
        moveTimecardSuccess: "",
        moveTimecardError: "",
      };
    case "MOVE_TIMECARD_SUCCESS":
      return {
        ...state,
        moveTimecardSuccess: action.payload.result[0].description,
      };
    case "MOVE_TIMECARD_FAIL":
      return {
        ...state,
        moveTimecardError: action.payload,
      };
    //----------------------****Export Timecard***---------------------
    case "EXPORT_TIMECARD_INIT":
      return {
        ...state,
        exportTimecard: "",
        exportTimecardSuccess: "",
        exportTimecardError: "",
      };
    case "EXPORT_TIMECARD_SUCCESS":
      return {
        ...state,
        exportTimecard: action.payload.export || "",
        exportTimecardSuccess: action.payload.result[0].description,
      };
    case "EXPORT_TIMECARD_FAIL":
      return {
        ...state,
        exportTimecardError: action.payload,
      };
    //----------------------****Import Timecard***---------------------
    case "IMPORT_TIMECARD_INIT":
      return {
        ...state,
        importTimecardSuccess: "",
        importTimecardError: "",
      };
    case "IMPORT_TIMECARD_SUCCESS":
      return {
        ...state,
        importTimecardSuccess: action.payload.result[0].description,
      };
    case "IMPORT_TIMECARD_FAIL":
      return {
        ...state,
        importTimecardError: action.payload,
      };
    //----------------------****Export Distribution***---------------------
    case "EXPORT_DISTRIBUTION_INIT":
      return {
        ...state,
        exportDistribution: "",
        exportDistributionSuccess: "",
        exportDistributionError: "",
      };
    case "EXPORT_DISTRIBUTION_SUCCESS":
      return {
        ...state,
        exportDistribution: action.payload.export || "",
        exportDistributionSuccess: action.payload.result[0].description,
      };
    case "EXPORT_DISTRIBUTION_FAIL":
      return {
        ...state,
        exportDistributionError: action.payload,
      };
    //----------------------****Export TPH Payroll***---------------------
    case "EXPORT_TPH_PAYROLL_INIT":
      return {
        ...state,
        exportTPHPayrollSuccess: "",
        exportTPHPayrollError: "",
      };
    case "EXPORT_TPH_PAYROLL_SUCCESS":
      return {
        ...state,
        exportTPHPayrollSuccess: action.payload.result[0].description,
      };
    case "EXPORT_TPH_PAYROLL_FAIL":
      return {
        ...state,
        exportTPHPayrollError: action.payload,
      };
    //----------------------****Refresh Employees***---------------------
    case "REFRESH_EMPLOYEES_INIT":
      return {
        ...state,
        refreshEmployees: [],
        refreshEmployeesSuccess: "",
        refreshEmployeesError: "",
      };
    case "REFRESH_EMPLOYEES_SUCCESS":
      return {
        ...state,
        refreshEmployees: action.payload.employees || [],
        refreshEmployeesSuccess: action.payload.result[0].description,
      };
    case "REFRESH_EMPLOYEES_FAIL":
      return {
        ...state,
        refreshEmployeesError: action.payload,
      };

    //----------------------****Get Timecard Attachment***------------
    case "GET_TIMECARD_ATTACHMENT_INIT":
      return {
        ...state,
        getAttachment: {},
        getAttachmentSuccess: "",
        getAttachmentError: "",
      };
    case "GET_TIMECARD_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getAttachment: {
          attachment: action.payload.export || "",
          contentType: action.payload.contentType || "",
        },
        getAttachmentSuccess: action.payload.result[0].description,
      };
    case "GET_TIMECARD_ATTACHMENT_FAIL":
      return {
        ...state,
        getAttachmentError: action.payload,
      };

    //----------------------****Delete Attachment***------------
    case "DELETE_TIMECARD_ATTACHMENT_INIT":
      return {
        ...state,
        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",
      };
    case "DELETE_TIMECARD_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deleteAttachmentSuccess: action.payload.result[0].description,
      };
    case "DELETE_TIMECARD_ATTACHMENT_FAIL":
      return {
        ...state,
        deleteAttachmentError: action.payload,
      };
    //----------------------****Tax Balance****-------------------
    case "TAX_BALANCE_INIT":
      return {
        ...state,
        taxBalanceSuccess: "",
        taxBalanceError: "",
      };
    case "TAX_BALANCE_SUCCESS":
      return {
        ...state,
        taxBalanceSuccess: action.payload.result[0].description,
      };
    case "TAX_BALANCE_FAIL":
      return {
        ...state,
        taxBalanceError: action.payload,
      };

    //----------------------****Calculate Day***-------------------------
    case "CALCULATE_DAY_INIT":
      return {
        ...state,
        calculateDay: [],
        calculateDaySuccess: "",
        calculateDayError: "",
      };
    case "CALCULATE_DAY_SUCCESS":
      let res = action.payload || "";
      return {
        ...state,
        calculateDay: res.calculationCodes || [],
        calculateDaySuccess: res.result[0].description,
      };
    case "CALCULATE_DAY_FAIL":
      return {
        ...state,
        calculateDayError: action.payload,
      };

    //----------------------****Clear States****-----------------------
    case "CLEAR_TIMECARD_STATES":
      return {
        ...state,

        timecardTalliesSuccess: "",
        timecardTalliesError: "",

        getTimecardListSuccess: "",
        getTimecardListError: "",

        getTimecardSuccess: "",
        getTimecardError: "",

        getTimecardSummarySuccess: "",
        getTimecardSummaryError: "",

        updateTimecardSummarySuccess: "",
        updateTimecardSummaryError: "",

        primeTimecardSuccess: "",
        primeTimecardError: "",

        insertTimecardSuccess: "",
        insertTimecardError: "",

        updateTimecardSuccess: "",
        updateTimecardError: "",

        deleteTimecardSuccess: "",
        deleteTimecardError: "",

        declineTimecardSuccess: "",
        declineTimecardError: "",

        sendForApprovalTimecardSuccess: "",
        sendForApprovalTimecardError: "",

        holdTimecardSuccess: "",
        holdTimecardError: "",

        approveTimecardSuccess: "",
        approveTimecardError: "",

        addAttachmentsSuccess: "",
        addAttachmentsError: "",

        addCommentSuccess: "",
        addCommentError: "",

        getAttachmentsListSuccess: "",
        getAttachmentsListError: "",

        getEmployeeListSuccess: "",
        getEmployeeListError: "",

        copyLastWeeksTimesSuccess: "",
        copyLastWeeksTimesError: "",

        regenerateTimecardSuccess: "",
        regenerateTimecardError: "",

        sendReportsSuccess: "",
        sendReportsError: "",

        lockAndInvoiceSuccess: "",
        lockAndInvoiceError: "",

        createEFTFileSuccess: "",
        createEFTFileError: "",

        sendPaySlipSuccess: "",
        sendPaySlipError: "",

        postDataSuccess: "",
        postDataError: "",

        resendSTPFileSuccess: "",
        resendSTPFileError: "",

        sendYearEndSTPFileSuccess: "",
        sendYearEndSTPFileError: "",

        moveTimecardBatchSuccess: "",
        moveTimecardBatchError: "",

        moveTimecardSuccess: "",
        moveTimecardError: "",

        exportTimecard: "",
        exportTimecardSuccess: "",
        exportTimecardError: "",

        importTimecardSuccess: "",
        importTimecardError: "",

        exportDistribution: "",
        exportDistributionSuccess: "",
        exportDistributionError: "",

        exportTPHPayrollSuccess: "",
        exportTPHPayrollError: "",

        refreshEmployees: [],
        refreshEmployeesSuccess: "",
        refreshEmployeesError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        taxBalanceSuccess: "",
        taxBalanceError: "",

        calculateDay: [],
        calculateDaySuccess: "",
        calculateDayError: "",
      };
    //----------------------****Clear States When Producton Login****--
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,

        timecardTallies: [],
        timecardTalliesSuccess: "",
        timecardTalliesError: "",

        getTimecardList: [],
        getTimecardListSuccess: "",
        getTimecardListError: "",

        getTimecard: "",
        getTimecardSuccess: "",
        getTimecardError: "",

        getTimecardSummary: "",
        getTimecardSummarySuccess: "",
        getTimecardSummaryError: "",

        updateTimecardSummary: "",
        updateTimecardSummarySuccess: "",
        updateTimecardSummaryError: "",

        primeTimecard: "",
        primeTimecardSuccess: "",
        primeTimecardError: "",

        insertTimecardSuccess: "",
        insertTimecardError: "",

        updateTimecardSuccess: "",
        updateTimecardError: "",

        deleteTimecardSuccess: "",
        deleteTimecardError: "",

        declineTimecardSuccess: "",
        declineTimecardError: "",

        sendForApprovalTimecardSuccess: "",
        sendForApprovalTimecardError: "",

        holdTimecardSuccess: "",
        holdTimecardError: "",

        approveTimecardSuccess: "",
        approveTimecardError: "",

        addAttachments: [],
        addAttachmentsSuccess: "",
        addAttachmentsError: "",

        addComments: [],
        addCommentSuccess: "",
        addCommentError: "",

        getAttachmentsList: [],
        getAttachmentsListSuccess: "",
        getAttachmentsListError: "",

        getEmployeeList: [],
        getEmployeeListSuccess: "",
        getEmployeeListError: "",

        copyLastWeeksTimes: "",
        copyLastWeeksTimesSuccess: "",
        copyLastWeeksTimesError: "",

        regenerateTimecard: [],
        regenerateTimecardSuccess: "",
        regenerateTimecardError: "",

        sendReportsSuccess: "",
        sendReportsError: "",

        lockAndInvoiceSuccess: "",
        lockAndInvoiceError: "",

        createEFTFileSuccess: "",
        createEFTFileError: "",

        sendPaySlipSuccess: "",
        sendPaySlipError: "",

        postDataSuccess: "",
        postDataError: "",

        resendSTPFileSuccess: "",
        resendSTPFileError: "",

        sendYearEndSTPFileSuccess: "",
        sendYearEndSTPFileError: "",

        moveTimecardBatchSuccess: "",
        moveTimecardBatchError: "",

        moveTimecardSuccess: "",
        moveTimecardError: "",

        exportTimecard: "",
        exportTimecardSuccess: "",
        exportTimecardError: "",

        importTimecardSuccess: "",
        importTimecardError: "",

        exportDistribution: "",
        exportDistributionSuccess: "",
        exportDistributionError: "",

        exportTPHPayrollSuccess: "",
        exportTPHPayrollError: "",

        refreshEmployees: [],
        refreshEmployeesSuccess: "",
        refreshEmployeesError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        taxBalanceSuccess: "",
        taxBalanceError: "",

        calculateDay: [],
        calculateDaySuccess: "",
        calculateDayError: "",
      };
    //----------------------****Clear States After Logout****----------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,

        timecardTallies: [],
        timecardTalliesSuccess: "",
        timecardTalliesError: "",

        getTimecardList: [],
        getTimecardListSuccess: "",
        getTimecardListError: "",

        getTimecard: "",
        getTimecardSuccess: "",
        getTimecardError: "",

        getTimecardSummary: "",
        getTimecardSummarySuccess: "",
        getTimecardSummaryError: "",

        updateTimecardSummary: "",
        updateTimecardSummarySuccess: "",
        updateTimecardSummaryError: "",

        primeTimecard: "",
        primeTimecardSuccess: "",
        primeTimecardError: "",

        insertTimecardSuccess: "",
        insertTimecardError: "",

        updateTimecardSuccess: "",
        updateTimecardError: "",

        deleteTimecardSuccess: "",
        deleteTimecardError: "",

        declineTimecardSuccess: "",
        declineTimecardError: "",

        sendForApprovalTimecardSuccess: "",
        sendForApprovalTimecardError: "",

        holdTimecardSuccess: "",
        holdTimecardError: "",

        approveTimecardSuccess: "",
        approveTimecardError: "",

        addAttachments: [],
        addAttachmentsSuccess: "",
        addAttachmentsError: "",

        addComments: [],
        addCommentSuccess: "",
        addCommentError: "",

        getAttachmentsList: [],
        getAttachmentsListSuccess: "",
        getAttachmentsListError: "",

        getEmployeeList: [],
        getEmployeeListSuccess: "",
        getEmployeeListError: "",

        copyLastWeeksTimes: "",
        copyLastWeeksTimesSuccess: "",
        copyLastWeeksTimesError: "",

        regenerateTimecard: [],
        regenerateTimecardSuccess: "",
        regenerateTimecardError: "",

        sendReportsSuccess: "",
        sendReportsError: "",

        lockAndInvoiceSuccess: "",
        lockAndInvoiceError: "",

        createEFTFileSuccess: "",
        createEFTFileError: "",

        sendPaySlipSuccess: "",
        sendPaySlipError: "",

        postDataSuccess: "",
        postDataError: "",

        resendSTPFileSuccess: "",
        resendSTPFileError: "",

        sendYearEndSTPFileSuccess: "",
        sendYearEndSTPFileError: "",

        moveTimecardBatchSuccess: "",
        moveTimecardBatchError: "",

        moveTimecardSuccess: "",
        moveTimecardError: "",

        exportTimecard: "",
        exportTimecardSuccess: "",
        exportTimecardError: "",

        importTimecardSuccess: "",
        importTimecardError: "",

        exportDistribution: "",
        exportDistributionSuccess: "",
        exportDistributionError: "",

        exportTPHPayrollSuccess: "",
        exportTPHPayrollError: "",

        refreshEmployees: [],
        refreshEmployeesSuccess: "",
        refreshEmployeesError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        taxBalanceSuccess: "",
        taxBalanceError: "",

        calculateDay: [],
        calculateDaySuccess: "",
        calculateDayError: "",
      };
    default:
      return state;
  }
}
