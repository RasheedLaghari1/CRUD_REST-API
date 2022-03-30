const INIT_STATE = {
  documentsTallies: [],
  getDocumentsTalliesSuccess: "",
  getDocumentsTalliesError: "",

  getDocumentsList: [],
  getDocumentsListSuccess: "",
  getDocumentsListError: "",

  getDocument: "",
  getDocumentSuccess: "",
  getDocumentError: "",

  addDocument: "",
  addDocumentSuccess: "",
  addDocumentError: "",

  updateDocumentSuccess: "",
  updateDocumentError: "",

  deleteDocumentSuccess: "",
  deleteDocumentError: "",

  addDocComments: [],
  addDocCommentSuccess: "",
  addDocCommentError: "",

  addDocAttachment: [],
  addDocAttachmentSuccess: "",
  addDocAttachmentError: "",

  updatePrimaryDocumentSuccess: "",
  updatePrimaryDocumentError: "",

  getDocAttachment: "",
  getDocAttachmentSuccess: "",
  getDocAttachmentError: "",

  deleteDocAttachmentSuccess: "",
  deleteDocAttachmentError: "",

  sendDocForApprovalSuccess: "",
  sendDocForApprovalError: "",

  approveDocSuccess: "",
  approveDocError: "",

  declineDocSuccess: "",
  declineDocError: "",

  holdDocumentSuccess: "",
  holdDocumentError: "",

  moveDocumentSuccess: "",
  moveDocumentError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Documents Tallies****-----------------------------
    case "GET_DOCUMENT_TALLIES_INIT":
      return {
        ...state,
        documentsTallies: [],
        getDocumentsTalliesSuccess: "",
        getDocumentsTalliesError: "",
      };
    case "GET_DOCUMENT_TALLIES_SUCCESS":
      let documentTallies = action.payload.documentTallies || []

      //changing Drafts to Draft
      documentTallies.map((t, i) => {
        if (t.docState === "Drafts") {
          t.docState = "Draft";
        }
        return t;
      });
      return {
        ...state,
        documentsTallies: documentTallies || [],
        getDocumentsTalliesSuccess: action.payload.result[0].description,
      };
    case "GET_DOCUMENT_TALLIES_FAIL":
      return {
        ...state,
        getDocumentsTalliesError: action.payload,
      };
    //----------------------****Get Documents List****-----------------------------
    case "GET_DOCUMENTS_LIST_INIT":
      return {
        ...state,
        getDocumentsList: [],
        getDocumentsListSuccess: "",
        getDocumentsListError: "",
      };
    case "GET_DOCUMENTS_LIST_SUCCESS":
      return {
        ...state,
        getDocumentsList: action.payload.documentsList || [],
        getDocumentsListSuccess: action.payload.result[0].description,
      };
    case "GET_DOCUMENTS_LIST_FAIL":
      return {
        ...state,
        getDocumentsListError: action.payload,
      };
    //----------------------****Get Documents List****-----------------------------
    case "GET_DOCUMENT_INIT":
      return {
        ...state,
        getDocument: "",
        getDocumentSuccess: "",
        getDocumentError: "",
      };
    case "GET_DOCUMENT_SUCCESS":
      return {
        ...state,
        getDocument: action.payload.document || "",
        getDocumentSuccess: action.payload.result[0].description,
      };
    case "GET_DOCUMENT_FAIL":
      return {
        ...state,
        getDocumentError: action.payload,
      };
    //----------------------****Add Document ****-----------------------------
    case "ADD_DOCUMENT_INIT":
      return {
        ...state,
        addDocument: "",
        addDocumentSuccess: "",
        addDocumentError: "",
      };
    case "ADD_DOCUMENT_SUCCESS":
      return {
        ...state,
        addDocument: action.payload.document || "",
        addDocumentSuccess: action.payload.result[0].description,
      };
    case "ADD_DOCUMENT_FAIL":
      return {
        ...state,
        addDocumentError: action.payload,
      };
    //----------------------****Update Document****-----------------------------
    case "UPDATE_DOCUMENT_INIT":
      return {
        ...state,
        updateDocumentSuccess: "",
        updateDocumentError: "",
      };
    case "UPDATE_DOCUMENT_SUCCESS":
      return {
        ...state,
        updateDocumentSuccess: action.payload.result[0].description,
      };
    case "UPDATE_DOCUMENT_FAIL":
      return {
        ...state,
        updateDocumentError: action.payload,
      };
    //----------------------****Delete Document****-----------------------------
    case "DELETE_DOCUMENT_INIT":
      return {
        ...state,
        deleteDocumentSuccess: "",
        deleteDocumentError: "",
      };
    case "DELETE_DOCUMENT_SUCCESS":
      return {
        ...state,
        deleteDocumentSuccess: action.payload.result[0].description,
      };
    case "DELETE_DOCUMENT_FAIL":
      return {
        ...state,
        deleteDocumentError: action.payload,
      };
    //----------------------****Add Comments****-----------------------------
    case "ADD_COMMENT_INIT":
      return {
        ...state,
        addDocComments: [],
        addDocCommentSuccess: "",
        addDocCommentError: "",
      };
    case "ADD_COMMENT_SUCCESS":
      return {
        ...state,
        addDocComments: action.payload.comments || [],
        addDocCommentSuccess: action.payload.result[0].description,
      };
    case "ADD_COMMENT_FAIL":
      return {
        ...state,
        addDocCommentError: action.payload,
      };
    //----------------------****Add Document Attachments****-----------------------------
    case "ADD_DOC_ATTACHMENTS_INIT":
      return {
        ...state,
        addDocAttachment: [],
        addDocAttachmentSuccess: "",
        addDocAttachmentError: "",
      };
    case "ADD_DOC_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        addDocAttachment: action.payload.attachments || [],
        addDocAttachmentSuccess: action.payload.result[0].description,
      };
    case "ADD_DOC_ATTACHMENTS_FAIL":
      return {
        ...state,
        addDocAttachmentError: action.payload,
      };
    //----------------------****Update Primary Document****-----------------------------
    case "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_INIT":
      return {
        ...state,
        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",
      };
    case "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_SUCCESS":
      return {
        ...state,
        updatePrimaryDocumentSuccess: action.payload.result[0].description,
      };
    case "UPDATE_TO_PRIMARY_DOC_DOCUMENTS_FAIL":
      return {
        ...state,
        updatePrimaryDocumentError: action.payload,
      };
    //----------------------****Get Document Attachment****-----------------------------
    case "GET_DOC_ATTACHMENT_INIT":
      return {
        ...state,
        getDocAttachment: "",
        getDocAttachmentSuccess: "",
        getDocAttachmentError: "",
      };
    case "GET_DOC_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getDocAttachment: action.payload || "",
        getDocAttachmentSuccess: action.payload.result[0].description,
      };
    case "GET_DOC_ATTACHMENT_FAIL":
      return {
        ...state,
        getDocAttachmentError: action.payload,
      };
    //----------------------****Delete Document Attachment****-----------------------------
    case "DELETE_DOC_ATTACHMENT_INIT":
      return {
        ...state,
        deleteDocAttachmentSuccess: "",
        deleteDocAttachmentError: "",
      };
    case "DELETE_DOC_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deleteDocAttachmentSuccess: action.payload.result[0].description,
      };
    case "DELETE_DOC_ATTACHMENT_FAIL":
      return {
        ...state,
        deleteDocAttachmentError: action.payload,
      };
    //----------------------****Send Document For Approval****-----------------------------
    case "SEND_DOC_FOR_APPROVAL_INIT":
      return {
        ...state,
        sendDocForApprovalSuccess: "",
        sendDocForApprovalError: "",
      };
    case "SEND_DOC_FOR_APPROVAL_SUCCESS":
      return {
        ...state,
        sendDocForApprovalSuccess: action.payload.result[0].description,
      };
    case "SEND_DOC_FOR_APPROVAL_FAIL":
      return {
        ...state,
        sendDocForApprovalError: action.payload,
      };
    //----------------------****Approve Document****-----------------------------
    case "APPROVE_DOCUMENT_INIT":
      return {
        ...state,
        approveDocSuccess: "",
        approveDocError: "",
      };
    case "APPROVE_DOCUMENT_SUCCESS":
      return {
        ...state,
        approveDocSuccess: action.payload.result[0].description,
      };
    case "APPROVE_DOCUMENT_FAIL":
      return {
        ...state,
        approveDocError: action.payload,
      };
    //----------------------****Decline Document****-----------------------------
    case "DECLINE_DOCUMENT_INIT":
      return {
        ...state,
        declineDocSuccess: "",
        declineDocError: "",
      };
    case "DECLINE_DOCUMENT_SUCCESS":
      return {
        ...state,
        declineDocSuccess: action.payload.result[0].description,
      };
    case "DECLINE_DOCUMENT_FAIL":
      return {
        ...state,
        declineDocError: action.payload,
      };
    //----------------------****Hold Document****-----------------------------
    case "HOLD_DOCUMENT_INIT":
      return {
        ...state,
        holdDocumentSuccess: "",
        holdDocumentError: "",
      };
    case "HOLD_DOCUMENT_SUCCESS":
      return {
        ...state,
        holdDocumentSuccess: action.payload.result[0].description,
      };
    case "HOLD_DOCUMENT_FAIL":
      return {
        ...state,
        holdDocumentError: action.payload,
      };
    //----------------------****Move Document****-----------------------------
    case "MOVE_DOCUMENT_INIT":
      return {
        ...state,
        moveDocumentSuccess: "",
        moveDocumentError: "",
      };
    case "MOVE_DOCUMENT_SUCCESS":
      return {
        ...state,
        moveDocumentSuccess: action.payload.result[0].description,
      };
    case "MOVE_DOCUMENT_FAIL":
      return {
        ...state,
        moveDocumentError: action.payload,
      };
    //----------------------****Clear Documents states****-----------------------------
    case "CLEAR_DOCUMENTS_STATES":
      return {
        ...state,

        getDocumentsTalliesSuccess: "",
        getDocumentsTalliesError: "",

        getDocumentsListSuccess: "",
        getDocumentsListError: "",

        getDocumentSuccess: "",
        getDocumentError: "",

        addDocumentSuccess: "",
        addDocumentError: "",

        updateDocumentSuccess: "",
        updateDocumentError: "",

        deleteDocumentSuccess: "",
        deleteDocumentError: "",

        addDocCommentSuccess: "",
        addDocCommentError: "",

        addDocAttachmentSuccess: "",
        addDocAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        getDocAttachmentSuccess: "",
        getDocAttachmentError: "",

        deleteDocAttachmentSuccess: "",
        deleteDocAttachmentError: "",

        sendDocForApprovalSuccess: "",
        sendDocForApprovalError: "",

        approveDocSuccess: "",
        approveDocError: "",

        declineDocSuccess: "",
        declineDocError: "",

        holdDocumentSuccess: "",
        holdDocumentError: "",

        moveDocumentSuccess: "",
        moveDocumentError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,

        getDocumentsList: [],
        getDocumentsListSuccess: "",
        getDocumentsListError: "",

        getDocument: "",
        getDocumentSuccess: "",
        getDocumentError: "",

        addDocument: "",
        addDocumentSuccess: "",
        addDocumentError: "",

        updateDocumentSuccess: "",
        updateDocumentError: "",

        deleteDocumentSuccess: "",
        deleteDocumentError: "",

        addDocComments: [],
        addDocCommentSuccess: "",
        addDocCommentError: "",

        addDocAttachment: [],
        addDocAttachmentSuccess: "",
        addDocAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        getDocAttachment: "",
        getDocAttachmentSuccess: "",
        getDocAttachmentError: "",

        deleteDocAttachmentSuccess: "",
        deleteDocAttachmentError: "",

        sendDocForApprovalSuccess: "",
        sendDocForApprovalError: "",

        approveDocSuccess: "",
        approveDocError: "",

        declineDocSuccess: "",
        declineDocError: "",

        holdDocumentSuccess: "",
        holdDocumentError: "",

        moveDocumentSuccess: "",
        moveDocumentError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,

        documentsTallies: [],
        getDocumentsTalliesSuccess: "",
        getDocumentsTalliesError: "",

        getDocumentsList: [],
        getDocumentsListSuccess: "",
        getDocumentsListError: "",

        getDocument: "",
        getDocumentSuccess: "",
        getDocumentError: "",

        addDocument: "",
        addDocumentSuccess: "",
        addDocumentError: "",

        updateDocumentSuccess: "",
        updateDocumentError: "",

        deleteDocumentSuccess: "",
        deleteDocumentError: "",

        addDocComments: [],
        addDocCommentSuccess: "",
        addDocCommentError: "",

        addDocAttachment: [],
        addDocAttachmentSuccess: "",
        addDocAttachmentError: "",

        updatePrimaryDocumentSuccess: "",
        updatePrimaryDocumentError: "",

        getDocAttachment: "",
        getDocAttachmentSuccess: "",
        getDocAttachmentError: "",

        deleteDocAttachmentSuccess: "",
        deleteDocAttachmentError: "",

        sendDocForApprovalSuccess: "",
        sendDocForApprovalError: "",

        approveDocSuccess: "",
        approveDocError: "",

        declineDocSuccess: "",
        declineDocError: "",

        holdDocumentSuccess: "",
        holdDocumentError: "",

        moveDocumentSuccess: "",
        moveDocumentError: "",
      };
    default:
      return state
  }
}
