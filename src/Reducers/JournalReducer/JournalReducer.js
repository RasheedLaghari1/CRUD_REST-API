const INIT_STATE = {

  journalTallies: [],
  journalTalliesSuccess: "",
  journalTalliesError: "",

  getJournalList: [],
  getJournalListSuccess: "",
  getJournalListError: "",

  getJournal: "",
  getJournalSuccess: "",
  getJournalError: "",

  getJournalSummary: "",
  getJournalSummarySuccess: "",
  getJournalSummaryError: "",

  updateJournalSuccess: "",
  updateJournalError: "",

  insertJournal: "",
  insertJournalSuccess: "",
  insertJournalError: "",

  sendForApprovalJournalSuccess: "",
  sendForApprovalJournalError: "",

  approveJournalSuccess: "",
  approveJournalError: "",

  declineJournalSuccess: "",
  declineJournalError: "",

  deleteJournalSuccess: "",
  deleteJournalError: "",

  holdJournalSuccess: "",
  holdJournalError: "",

  getAttachment: '',
  getAttachmentSuccess: "",
  getAttachmentError: "",

  addAttachment: [],
  addAttachmentSuccess: "",
  addAttachmentError: "",

  deleteAttachmentSuccess: "",
  deleteAttachmentError: "",

  addComment: [],
  addCommentSuccess: "",
  addCommentError: "",

  copyJournalSuccess: "",
  copyJournalError: "",

  importJournalSuccess: "",
  importJournalError: "",

  postJournal: "",
  postJournalSuccess: "",
  postJournalError: "",

  exportJournal: "",
  exportJournalSuccess: "",
  exportJournalError: "",

  moveJournalSuccess: "",
  moveJournalError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Journal Tallies****-----------------------------
    case "GET_JOURNAL_TALLIES_INIT":
      return {
        ...state,
        journalTallies: [],
        journalTalliesSuccess: "",
        journalTalliesError: "",
      };
    case "GET_JOURNAL_TALLIES_SUCCESS":
      return {
        ...state,
        journalTallies: action.payload.journalTallies || [],
        journalTalliesSuccess: action.payload.result[0].description,
      };
    case "GET_JOURNAL_TALLIES_FAIL":
      return {
        ...state,
        journalTalliesError: action.payload,
      };

    //----------------------****Get Journal List****-----------------------------
    case "GET_JOURNAL_LIST_INIT":
      return {
        ...state,
        getJournalList: [],
        getJournalListSuccess: "",
        getJournalListError: "",
      };
    case "GET_JOURNAL_LIST_SUCCESS":
      return {
        ...state,
        getJournalList: action.payload.journals || [],
        getJournalListSuccess: action.payload.result[0].description,
      };
    case "GET_JOURNAL_LIST_FAIL":
      return {
        ...state,
        getJournalListError: action.payload,
      };
    //----------------------****Get Journal****-----------------------------
    case "GET_JOURNAL_INIT":
      return {
        ...state,
        getJournal: "",
        getJournalSuccess: "",
        getJournalError: "",
      };
    case "GET_JOURNAL_SUCCESS":
      return {
        ...state,
        getJournal: action.payload.journal || "",
        getJournalSuccess: action.payload.result[0].description,
      };
    case "GET_JOURNAL_FAIL":
      return {
        ...state,
        getJournalError: action.payload,
      };
    //----------------------****Get Journal Summary****-----------------------------
    case "GET_JOURNAL_SUMMARY_INIT":
      return {
        ...state,
        getJournalSummary: "",
        getJournalSummarySuccess: "",
        getJournalSummaryError: "",
      };
    case "GET_JOURNAL_SUMMARY_SUCCESS":
      return {
        ...state,
        getJournalSummary: action.payload.journalSummary || "",
        getJournalSummarySuccess: action.payload.result[0].description,
      };
    case "GET_JOURNAL_SUMMARY_FAIL":
      return {
        ...state,
        getJournalSummaryError: action.payload,
      };
    //----------------------****Insert Journal ****-----------------------------
    case "INSERT_JOURNAL_INIT":
      return {
        ...state,
        insertJournal: "",
        insertJournalSuccess: "",
        insertJournalError: "",
      };
    case "INSERT_JOURNAL_SUCCESS":
      return {
        ...state,
        insertJournal: action.payload.journal || '',
        insertJournalSuccess: action.payload.result[0].description,
      };
    case "INSERT_JOURNAL_FAIL":
      return {
        ...state,
        insertJournalError: action.payload,
      };
    //----------------------****Update Journal****-----------------------------
    case "UPDATE_JOURNAL_INIT":
      return {
        ...state,
        updateJournalSuccess: "",
        updateJournalError: "",
      };
    case "UPDATE_JOURNAL_SUCCESS":
      return {
        ...state,
        updateJournalSuccess: action.payload.result[0].description,
      };
    case "UPDATE_JOURNAL_FAIL":
      return {
        ...state,
        updateJournalError: action.payload,
      };
    //----------------------****Send For Approval****-----------------------------
    case "SEND_FOR_APPROVAL_INIT":
      return {
        ...state,
        sendForApprovalJournalSuccess: "",
        sendForApprovalJournalError: ""
      };
    case "SEND_FOR_APPROVAL_SUCCESS":
      return {
        ...state,
        sendForApprovalJournalSuccess: action.payload.result[0].description,
      };
    case "SEND_FOR_APPROVAL_FAIL":
      return {
        ...state,
        sendForApprovalJournalError: action.payload,
      };
    //----------------------****Approve Journal****-----------------------------
    case "APPROVE_JOURNAL_INIT":
      return {
        ...state,
        approveJournalSuccess: "",
        approveJournalError: ""
      };
    case "APPROVE_JOURNAL_SUCCESS":
      return {
        ...state,
        approveJournalSuccess: action.payload.result[0].description,
      };
    case "APPROVE_JOURNAL_FAIL":
      return {
        ...state,
        approveJournalError: action.payload,
      };
    //----------------------****Decline Journal****-----------------------------
    case "DECLINE_JOURNAL_INIT":
      return {
        ...state,
        declineJournalSuccess: "",
        declineJournalError: ""
      };
    case "DECLINE_JOURNAL_SUCCESS":
      return {
        ...state,
        declineJournalSuccess: action.payload.result[0].description,
      };
    case "DECLINE_JOURNAL_FAIL":
      return {
        ...state,
        declineJournalError: action.payload,
      };
    //----------------------****Delete Journal****-----------------------------
    case "DELETE_JOURNAL_INIT":
      return {
        ...state,
        deleteJournalSuccess: "",
        deleteJournalError: ""
      };
    case "DELETE_JOURNAL_SUCCESS":
      return {
        ...state,
        deleteJournalSuccess: action.payload.result[0].description,
      };
    case "DELETE_JOURNAL_FAIL":
      return {
        ...state,
        deleteJournalError: action.payload,
      };
    //----------------------****Hold Journal****-----------------------------
    case "HOLD_JOURNAL_INIT":
      return {
        ...state,
        holdJournalSuccess: "",
        holdJournalError: ""
      };
    case "HOLD_JOURNAL_SUCCESS":
      return {
        ...state,
        holdJournalSuccess: action.payload.result[0].description,
      };
    case "HOLD_JOURNAL_FAIL":
      return {
        ...state,
        holdJournalError: action.payload,
      };
    //----------------------****Get Attachment****-----------------------------
    case "GET_ATTACHMENT_INIT":
      return {
        ...state,
        getAttachment: '',
        getAttachmentSuccess: "",
        getAttachmentError: ""
      };
    case "GET_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getAttachment: action.payload || '',
        getAttachmentSuccess: action.payload.result[0].description,
      };
    case "GET_ATTACHMENT_FAIL":
      return {
        ...state,
        getAttachmentError: action.payload,
      };
    //----------------------****Add Attachment****-----------------------------
    case "ADD_ATTACHMENT_INIT":
      return {
        ...state,
        addAttachment: [],
        addAttachmentSuccess: "",
        addAttachmentError: ""
      };
    case "ADD_ATTACHMENT_SUCCESS":
      return {
        ...state,
        addAttachment: action.payload.attachments || [],
        addAttachmentSuccess: action.payload.result[0].description,
      };
    case "ADD_ATTACHMENT_FAIL":
      return {
        ...state,
        addAttachmentError: action.payload,
      };
    //----------------------****Delete Attachment****-----------------------------
    case "DELETE_ATTACHMENT_INIT":
      return {
        ...state,
        deleteAttachmentSuccess: "",
        deleteAttachmentError: ""
      };
    case "DELETE_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deleteAttachmentSuccess: action.payload.result[0].description,
      };
    case "DELETE_ATTACHMENT_FAIL":
      return {
        ...state,
        deleteAttachmentError: action.payload,
      };
    //----------------------****Add Comment****-----------------------------
    case "ADD_COMMENT_INIT":
      return {
        ...state,
        addComment: [],
        addCommentSuccess: "",
        addCommentError: "",
      };
    case "ADD_COMMENT_SUCCESS":
      return {
        ...state,
        addComment: action.payload.comments || [],
        addCommentSuccess: action.payload.result[0].description,
      };
    case "ADD_COMMENT_FAIL":
      return {
        ...state,
        addCommentError: action.payload,
      };
    //----------------------****Copy Journal****-----------------------------
    case "COPY_JOURNAL_INIT":
      return {
        ...state,
        copyJournalSuccess: "",
        copyJournalError: "",
      };
    case "COPY_JOURNAL_SUCCESS":
      return {
        ...state,
        copyJournalSuccess: action.payload.result[0].description,
      };
    case "COPY_JOURNAL_FAIL":
      return {
        ...state,
        copyJournalError: action.payload,
      };
    //----------------------****Import Journal****-----------------------------
    case "IMPORT_JOURNAL_INIT":
      return {
        ...state,
        importJournalSuccess: "",
        importJournalError: "",
      };
    case "IMPORT_JOURNAL_SUCCESS":
      return {
        ...state,
        importJournalSuccess: action.payload.result[0].description,
      };
    case "IMPORT_JOURNAL_FAIL":
      return {
        ...state,
        importJournalError: action.payload,
      };
    //----------------------****Post Journal****-----------------------------
    case "POST_JOURNAL_INIT":
      return {
        ...state,
        postJournal: "",
        postJournalSuccess: "",
        postJournalError: "",
      };
    case "POST_JOURNAL_SUCCESS":
      return {
        ...state,
        postJournal: action.payload,
        postJournalSuccess: action.payload.result[0].description,
      };
    case "POST_JOURNAL_FAIL":
      return {
        ...state,
        postJournalError: action.payload,
      };
    //----------------------****Export Journal****-----------------------------
    case "EXPORT_JOURNAL_INIT":
      return {
        ...state,
        exportJournal: "",
        exportJournalSuccess: "",
        exportJournalError: "",
      };
    case "EXPORT_JOURNAL_SUCCESS":
      return {
        ...state,
        exportJournal: action.payload.export || '',
        exportJournalSuccess: action.payload.result[0].description,
      };
    case "EXPORT_JOURNAL_FAIL":
      return {
        ...state,
        exportJournalError: action.payload,
      };
    //----------------------****Move Journal****-----------------------------
    case "MOVE_JOURNAL_INIT":
      return {
        ...state,
        moveJournalSuccess: "",
        moveJournalError: "",
      };
    case "MOVE_JOURNAL_SUCCESS":
      return {
        ...state,
        moveJournalSuccess: action.payload.result[0].description,
      };
    case "MOVE_JOURNAL_FAIL":
      return {
        ...state,
        moveJournalError: action.payload,
      };
    //----------------------****Clear States****-----------------------------
    case "CLEAR_JOURNAL_STATES":
      return {
        ...state,

        journalTalliesSuccess: "",
        journalTalliesError: "",

        getJournalListSuccess: "",
        getJournalListError: "",

        getJournalSuccess: "",
        getJournalError: "",

        getJournalSummarySuccess: "",
        getJournalSummaryError: "",

        updateJournalSuccess: "",
        updateJournalError: "",

        insertJournalSuccess: "",
        insertJournalError: "",

        sendForApprovalJournalSuccess: "",
        sendForApprovalJournalError: "",

        approveJournalSuccess: "",
        approveJournalError: "",

        declineJournalSuccess: "",
        declineJournalError: "",

        deleteJournalSuccess: "",
        deleteJournalError: "",

        holdJournalSuccess: "",
        holdJournalError: "",

        getAttachmentSuccess: "",
        getAttachmentError: "",

        addAttachmentSuccess: "",
        addAttachmentError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        addCommentSuccess: "",
        addCommentError: "",

        copyJournalSuccess: "",
        copyJournalError: "",

        importJournalSuccess: "",
        importJournalError: "",

        postJournalSuccess: "",
        postJournalError: "",

        exportJournalSuccess: "",
        exportJournalError: "",

        moveJournalSuccess: "",
        moveJournalError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,

        journalTallies: [],
        journalTalliesSuccess: "",
        journalTalliesError: "",

        getJournalList: [],
        getJournalListSuccess: "",
        getJournalListError: "",

        getJournal: "",
        getJournalSuccess: "",
        getJournalError: "",

        getJournalSummary: "",
        getJournalSummarySuccess: "",
        getJournalSummaryError: "",

        updateJournalSuccess: "",
        updateJournalError: "",

        insertJournal: "",
        insertJournalSuccess: "",
        insertJournalError: "",

        sendForApprovalJournalSuccess: "",
        sendForApprovalJournalError: "",

        approveJournalSuccess: "",
        approveJournalError: "",

        declineJournalSuccess: "",
        declineJournalError: "",

        deleteJournalSuccess: "",
        deleteJournalError: "",

        holdJournalSuccess: "",
        holdJournalError: "",

        getAttachment: '',
        getAttachmentSuccess: "",
        getAttachmentError: "",

        addAttachment: [],
        addAttachmentSuccess: "",
        addAttachmentError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        addComment: [],
        addCommentSuccess: "",
        addCommentError: "",

        copyJournalSuccess: "",
        copyJournalError: "",

        importJournalSuccess: "",
        importJournalError: "",

        postJournal: "",
        postJournalSuccess: "",
        postJournalError: "",

        exportJournal: "",
        exportJournalSuccess: "",
        exportJournalError: "",

        moveJournalSuccess: "",
        moveJournalError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,

        journalTallies: [],
        journalTalliesSuccess: "",
        journalTalliesError: "",

        getJournalList: [],
        getJournalListSuccess: "",
        getJournalListError: "",

        getJournal: "",
        getJournalSuccess: "",
        getJournalError: "",

        getJournalSummary: "",
        getJournalSummarySuccess: "",
        getJournalSummaryError: "",

        updateJournalSuccess: "",
        updateJournalError: "",

        insertJournal: "",
        insertJournalSuccess: "",
        insertJournalError: "",

        sendForApprovalJournalSuccess: "",
        sendForApprovalJournalError: "",

        approveJournalSuccess: "",
        approveJournalError: "",

        declineJournalSuccess: "",
        declineJournalError: "",

        deleteJournalSuccess: "",
        deleteJournalError: "",

        holdJournalSuccess: "",
        holdJournalError: "",

        getAttachment: '',
        getAttachmentSuccess: "",
        getAttachmentError: "",

        addAttachment: [],
        addAttachmentSuccess: "",
        addAttachmentError: "",

        deleteAttachmentSuccess: "",
        deleteAttachmentError: "",

        addComment: [],
        addCommentSuccess: "",
        addCommentError: "",

        copyJournalSuccess: "",
        copyJournalError: "",

        importJournalSuccess: "",
        importJournalError: "",

        postJournal: "",
        postJournalSuccess: "",
        postJournalError: "",

        exportJournal: "",
        exportJournalSuccess: "",
        exportJournalError: "",

        moveJournalSuccess: "",
        moveJournalError: "",
      };
    default:
      return state;
  }
}
