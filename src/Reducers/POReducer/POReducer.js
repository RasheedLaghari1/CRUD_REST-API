const INIT_STATE = {
  poTallies: [],
  getPOTalliesSuccess: "",
  getPOTalliesError: "",

  getPOList: [],
  getPOListSuccess: "",
  getPOListError: "",

  getNewPOList: '',
  getNewPOListSuccess: "",
  getNewPOListError: "",

  getQuote: [],
  getQuoteSuccess: "",
  getQuoteError: "",

  getPO: "",
  getPOSuccess: "",
  getPOError: "",

  getPOPreview: "",
  getPOPreviewSuccess: "",
  getPOPreviewError: "",

  getPOSummary: "",
  getPOSummarySuccess: "",
  getPOSummaryError: "",

  getPOCompany: "",
  getPOCompanySuccess: "",
  getPOCompanyError: "",

  updatePOCompanySuccess: "",
  updatePOCompanyError: "",

  updatePORefSuccess: "",
  updatePORefError: "",

  getPOSupplier: "",
  getPOSupplierSuccess: "",
  getPOSupplierError: "",

  updatePOSupplierSuccess: "",
  updatePOSupplierError: "",


  updateSpecialConditionSuccess: "",
  updateSpecialConditionError: "",

  updateRequestedSuccess: "",
  updateRequestedError: "",

  getPOLines: "",
  getPOLinesSuccess: "",
  getPOLinesError: "",

  updatePOLinesSuccess: "",
  updatePOLinesError: "",

  updatePOAmountSuccess: "",
  updatePOAmountError: "",

  updateApprovalGroupSuccess: "",
  updateApprovalGroupError: "",

  getPOChanges: [],
  getPOChangesSuccess: "",
  getPOChangesError: "",

  getPOLog: [],
  getPOLogSuccess: "",
  getPOLogError: "",

  getPOActivity: [],
  getPOActivitySuccess: "",
  getPOActivityError: "",

  searchPOs: "",
  searchPOsSuccess: "",
  searchPOsError: "",

  addCommentData: [],
  addCommentSuccess: "",
  addCommentError: "",

  addPOAttachment: [],
  addPOAttachmentSuccess: "",
  addPOAttachmentError: "",

  addPOAttachmentLists: [],
  addPOAttachmentListsSuccess: "",
  addPOAttachmentListsError: "",

  getPOAttachment: "",
  getPOAttachmentSuccess: "",
  getPOAttachmentError: "",

  deletePOAttachmentSuccess: "",
  deletePOAttachmentError: "",

  deletePOSuccess: "",
  deletePOError: "",

  copyPOSuccess: "",
  copyPOError: "",

  closePOSuccess: "",
  closePOError: "",

  movePOSuccess: "",
  movePOError: "",

  approvePOSuccess: "",
  approvePOError: "",

  declinePOSuccess: "",
  declinePOError: "",

  holdPOSuccess: "",
  holdPOError: "",

  sendForApprovalPOSuccess: "",
  sendForApprovalPOError: "",

  modifyPOSuccess: "",
  modifyPOError: "",

  updatePOSuccess: "",
  updatePOError: "",

  insertPO: "",
  insertPOSuccess: "",
  insertPOError: "",

  getTransferList: [],
  getTransferListSuccess: "",
  getTransferListError: "",

  pslExport: "",
  pslExportSuccess: "",
  pslExportError: "",

  exportPO: "",
  exportPOSuccess: "",
  exportPOError: "",

  importPOSuccess: "",
  importPOError: "",

  postPO: "",
  postPOSuccess: "",
  postPOError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****GetPOTallies****-----------------------------
    case "GET_PO_TALLIES_INIT":
      return {
        ...state,
        poTallies: [],
        getPOTalliesSuccess: "",
        getPOTalliesError: "",
      };
    case "GET_PO_TALLIES_SUCCESS":
      return {
        ...state,
        poTallies: action.payload.poTallies || [],
        getPOTalliesSuccess: action.payload.results[0].description,
      };
    case "GET_PO_TALLIES_FAIL":
      return {
        ...state,
        getPOTalliesError: action.payload,
      };
    //----------------------****Get PO List****-----------------------------
    case "GET_PO_LIST_INIT":
      return {
        ...state,
        getPO: "",
        getPOList: [],
        getPOListSuccess: "",
        getPOListError: "",
      };
    case "GET_PO_LIST_SUCCESS":
      return {
        ...state,
        getPOList: action.payload.poList || [],
        getPOListSuccess: action.payload.results[0].description,
      };
    case "GET_PO_LIST_FAIL":
      return {
        ...state,
        getPOListError: action.payload,
      };
    //----------------------****Get New PO List****-----------------------------
    case "GET_NEW_PO_LIST_INIT":
      return {
        ...state,
        getNewPOList: '',
        getNewPOListSuccess: "",
        getNewPOListError: "",
      };
    case "GET_NEW_PO_LIST_SUCCESS":
      return {
        ...state,
        getNewPOList: action.payload || '',
        getNewPOListSuccess: action.payload.results[0].description,
      };
    case "GET_NEW_PO_LIST_FAIL":
      return {
        ...state,
        getNewPOListError: action.payload,
      };
    //----------------------****Get Quote****-----------------------------
    case "GET_QUOTE_INIT":
      return {
        ...state,
        getQuote: [],
        getQuoteSuccess: "",
        getQuoteError: "",
      };
    case "GET_QUOTE_SUCCESS":
      return {
        ...state,
        getQuote: action.payload,
        getQuoteSuccess: action.payload.results[0].description,
      };
    case "GET_QUOTE_FAIL":
      return {
        ...state,
        getQuoteError: action.payload,
      };
    //----------------------****Get PO****-----------------------------
    case "GET_PO_INIT":
      return {
        ...state,
        getPO: "",
        getPOSuccess: "",
        getPOError: "",
      };
    case "GET_PO_SUCCESS":
      return {
        ...state,
        getPO: action.payload || "",
        getPOSuccess: action.payload.results[0].description,
      };
    case "GET_PO_FAIL":
      return {
        ...state,
        getPOError: action.payload,
      };
    //----------------------****Get PO Preview****-----------------------------
    case "GET_PO_PREVIEW_INIT":
      return {
        ...state,
        getPOPreview: "",
        getPOPreviewSuccess: "",
        getPOPreviewError: "",
      };
    case "GET_PO_PREVIEW_SUCCESS":
      return {
        ...state,
        getPOPreview: action.payload.preview || "",
        getPOPreviewSuccess: action.payload.results[0].description,
      };
    case "GET_PO_PREVIEW_FAIL":
      return {
        ...state,
        getPOPreviewError: action.payload,
      };
    //----------------------****Get PO Summary****-----------------------------
    case "GET_PO_SUMMARY_INIT":
      return {
        ...state,
        getPOSummary: "",
        getPOSummarySuccess: "",
        getPOSummaryError: "",
      };
    case "GET_PO_SUMMARY_SUCCESS":
      return {
        ...state,
        getPOSummary: action.payload.poSummary || "",
        getPOSummarySuccess: action.payload.results[0].description,
      };
    case "GET_PO_SUMMARY_FAIL":
      return {
        ...state,
        getPOSummaryError: action.payload,
      };
    //----------------------****Get PO Company****-----------------------------
    case "GET_PO_COMPANY_INIT":
      return {
        ...state,
        getPOCompany: "",
        getPOCompanySuccess: "",
        getPOCompanyError: "",
      };
    case "GET_PO_COMPANY_SUCCESS":
      return {
        ...state,
        getPOCompany: action.payload.poCoSummary || "",
        getPOCompanySuccess: action.payload.results[0].description,
      };
    case "GET_PO_COMPANY_FAIL":
      return {
        ...state,
        getPOCompanyError: action.payload,
      };
    //----------------------****Update PO Company****-----------------------------
    case "UPDATE_PO_COMPANY_INIT":
      return {
        ...state,
        updatePOCompanySuccess: "",
        updatePOCompanyError: "",
      };
    case "UPDATE_PO_COMPANY_SUCCESS":
      let getPOCompany = state.getPOCompany || '';
      let companyID = action.payload.companyID || ''
      if (companyID) {
        let foundCompany = getPOCompany.companyOptions.find((c) => c.companyID === companyID);
        if (foundCompany) {
          let {
            companyName,
            companyID,
            companyAddress,
            taxID,
            phone,
          } = foundCompany;
          getPOCompany = {
            ...getPOCompany,
            companyName,
            companyID,
            companyAddress,
            taxID,
            phone,
          }
        }
      }

      return {
        ...state,
        getPOCompany: {
          ...state.getPOCompany,
          ...getPOCompany
        },
        updatePOCompanySuccess: action.payload.results[0].description,
      };
    case "UPDATE_PO_COMPANY_FAIL":
      return {
        ...state,
        updatePOCompanyError: action.payload,
      };
    //----------------------****Update PO Reference****-----------------------------
    case "UPDATE_PO_REFERENCE_INIT":
      return {
        ...state,
        updatePORefSuccess: "",
        updatePORefError: "",
      };
    case "UPDATE_PO_REFERENCE_SUCCESS":
      let { poNumber } = action.payload;
      return {
        ...state,
        getPOSummary: {
          ...state.getPOSummary,
          poNumber
        },
        updatePORefSuccess: action.payload.results[0].description,
      };
    case "UPDATE_PO_REFERENCE_FAIL":
      return {
        ...state,
        updatePORefError: action.payload,
      };
    //----------------------****Get PO Supplier****-----------------------------
    case "GET_PO_SUPPLIER_INIT":
      return {
        ...state,
        getPOSupplier: "",
        getPOSupplierSuccess: "",
        getPOSupplierError: "",
      };
    case "GET_PO_SUPPLIER_SUCCESS":
      return {
        ...state,
        getPOSupplier: action.payload.poSupplierSummary || "",
        getPOSupplierSuccess: action.payload.results[0].description,
      };
    case "GET_PO_SUPPLIER_FAIL":
      return {
        ...state,
        getPOSupplierError: action.payload,
      };
    //----------------------****Update PO Supplier****-----------------------------
    case "UPDATE_PO_SUPPLIER_INIT":
      return {
        ...state,
        updatePOSupplierSuccess: "",
        updatePOSupplierError: "",
      };
    case "UPDATE_PO_SUPPLIER_SUCCESS":
      return {
        ...state,
        updatePOSupplierSuccess: action.payload.results[0].description,
      };
    case "UPDATE_PO_SUPPLIER_FAIL":
      return {
        ...state,
        updatePOSupplierError: action.payload,
      };
    //----------------------****Update Special Condition****-----------------------------
    case "UPDATE_SPECIAL_CONDITION_INIT":
      return {
        ...state,
        updateSpecialConditionSuccess: "",
        updateSpecialConditionError: "",
      };
    case "UPDATE_SPECIAL_CONDITION_SUCCESS":
      //updating main redux state
      let specialConditions = action.payload.specialConditions || "";
      return {
        ...state,
        getPOSummary: {
          ...state.getPOSummary,
          specialConditions,
        },
        updateSpecialConditionSuccess: action.payload.results[0].description || 'Success',
      };
    case "UPDATE_SPECIAL_CONDITION_FAIL":
      return {
        ...state,
        updateSpecialConditionError: action.payload,
      };
    //----------------------****Update Requested****-----------------------------
    case "UPDATE_REQUESTED_INIT":
      return {
        ...state,
        updateRequestedSuccess: "",
        updateRequestedError: "",
      };
    case "UPDATE_REQUESTED_SUCCESS":
      let { requestedDepartment, requestedBy } = action.payload;
      return {
        ...state,
        getPOSummary: {
          ...state.getPOSummary,
          requestedDepartment,
          requestedBy,
        },
        updateRequestedSuccess: action.payload.results[0].description,
      };
    case "UPDATE_REQUESTED_FAIL":
      return {
        ...state,
        updateRequestedError: action.payload,
      };
    //----------------------****Get PO Lines****-----------------------------
    case "GET_PO_LINES_INIT":
      return {
        ...state,
        getPOLines: "",
        getPOLinesSuccess: "",
        getPOLinesError: "",
      };
    case "GET_PO_LINES_SUCCESS":
      return {
        ...state,
        getPOLines: action.payload.poLineSummary || "",
        getPOLinesSuccess: action.payload.results[0].description,
      };
    case "GET_PO_LINES_FAIL":
      return {
        ...state,
        getPOLinesError: action.payload,
      };
    //----------------------****Update PO Lines****-----------------------------
    case "UPDATE_PO_LINES_INIT":
      return {
        ...state,
        updatePOLinesSuccess: "",
        updatePOLinesError: "",
      };
    case "UPDATE_PO_LINES_SUCCESS":

      let _getPOLines = action.payload.poLineSummary
      let _grossTotal = _getPOLines.grossTotal || 0
      let _taxTotal = _getPOLines.taxTotal || 0
      let _netTotal = _getPOLines.netTotal || 0
      return {
        ...state,
        getPOLines: {
          ...state.getPOLines,
          ..._getPOLines
        },
        getPOSummary: {
          ...state.getPOSummary,
          grossTotal: _grossTotal,
          taxTotal: _taxTotal,
          netTotal: _netTotal
        },
        updatePOLinesSuccess: action.payload.results[0].description,
      };
    case "UPDATE_PO_LINES_FAIL":
      return {
        ...state,
        updatePOLinesError: action.payload,
      };
    //----------------------****Update PO Amount****-----------------------------
    case "UPDATE_PO_AMOUNTS_INIT":
      return {
        ...state,
        updatePOAmountSuccess: "",
        updatePOAmountError: "",
      };
    case "UPDATE_PO_AMOUNTS_SUCCESS":
      let grossTotal = action.payload.grossTotal || 0
      let taxTotal = action.payload.taxTotal || 0
      return {
        ...state,
        getPOSummary: {
          ...state.getPOSummary,
          grossTotal,
          taxTotal
        },
        updatePOAmountSuccess: action.payload.results[0].description,
      };
    case "UPDATE_PO_AMOUNTS_FAIL":
      return {
        ...state,
        updatePOAmountError: action.payload,
      };
    //---------------------****Update Approval Group****-----------------------------
    case "UPDATE_APPROVAL_GROUP_INIT":
      return {
        ...state,
        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",
      };
    case "UPDATE_APPROVAL_GROUP_SUCCESS":
      let approvalGroup = action.payload.approvalGroup || "";
      return {
        ...state,
        getPOSummary: {
          ...state.getPOSummary,
          approvalGroup,
        },
        updateApprovalGroupSuccess: action.payload.results[0].description,
      };
    case "UPDATE_APPROVAL_GROUP_FAIL":
      return {
        ...state,
        updateApprovalGroupError: action.payload,
      };
    //----------------------****Get PO Changes****-----------------------------
    case "GET_PO_CHANGES_INIT":
      return {
        ...state,
        getPOChanges: [],
        getPOChangesSuccess: "",
        getPOChangesError: "",
      };
    case "GET_PO_CHANGES_SUCCESS":
      return {
        ...state,
        getPOChanges: action.payload.poChanges || [],
        getPOChangesSuccess: action.payload.results[0].description,
      };
    case "GET_PO_CHANGES_FAIL":
      return {
        ...state,
        getPOChangesError: action.payload,
      };
    //----------------------****Get PO Log****-----------------------------
    case "GET_PO_LOG_INIT":
      return {
        ...state,
        getPOLog: [],
        getPOLogSuccess: "",
        getPOLogError: "",
      };
    case "GET_PO_LOG_SUCCESS":
      return {
        ...state,
        getPOLog: action.payload.poLog || [],
        getPOLogSuccess: action.payload.results[0].description,
      };
    case "GET_PO_LOG_FAIL":
      return {
        ...state,
        getPOLogError: action.payload,
      };
    //----------------------****Get PO Activity****-----------------------------
    case "GET_PO_ACTIVITY_INIT":
      return {
        ...state,
        getPOActivity: [],
        getPOActivitySuccess: "",
        getPOActivityError: "",
      };
    case "GET_PO_ACTIVITY_SUCCESS":
      return {
        ...state,
        getPOActivity: action.payload.activity || [],
        getPOActivitySuccess: action.payload.results[0].description,
      };
    case "GET_PO_ACTIVITY_FAIL":
      return {
        ...state,
        getPOActivityError: action.payload,
      };
    //----------------------**** Search POs ****-----------------------------
    case "SEARCH_POs_INIT":
      return {
        ...state,
        searchPOs: "",
        searchPOsSuccess: "",
        searchPOsError: "",
      };
    case "SEARCH_POs_SUCCESS":
      return {
        ...state,
        searchPOs: action.payload || [],
        searchPOsSuccess: action.payload.results[0].description,
      };
    case "SEARCH_POs_FAIL":
      return {
        ...state,
        searchPOsError: action.payload,
      };
    //----------------------****Add PO Comment****-----------------------------
    case "ADD_PO_COMMENT_INIT":
      return {
        ...state,
        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",
      };
    case "ADD_PO_COMMENT_SUCCESS":
      return {
        ...state,
        addCommentData: action.payload.comments || [],
        addCommentSuccess: action.payload.results[0].description,
      };
    case "ADD_PO_COMMENT_FAIL":
      return {
        ...state,
        addCommentError: action.payload,
      };
    //----------------------****Add PO Attachments ****-----------------------------
    case "ADD_PO_ATTACHMENTS_INIT":
      return {
        ...state,
        addPOAttachment: [],
        addPOAttachmentSuccess: "",
        addPOAttachmentError: "",
      };
    case "ADD_PO_ATTACHMENTS_SUCCESS":
      return {
        ...state,
        addPOAttachment: action.payload.attachments || [],
        addPOAttachmentSuccess: action.payload.results[0].description,
      };
    case "ADD_PO_ATTACHMENTS_FAIL":
      return {
        ...state,
        addPOAttachmentError: action.payload,
      };
    //----------------------****Add PO Attachment Lists ****-----------------------------
    case "ADD_PO_ATTACHMENT_LISTS_INIT":
      return {
        ...state,
        addPOAttachmentLists: [],
        addPOAttachmentListsSuccess: "",
        addPOAttachmentListsError: "",
      };
    case "ADD_PO_ATTACHMENT_LISTS_SUCCESS":
      return {
        ...state,
        addPOAttachmentLists: action.payload.attachments || [],
        addPOAttachmentListsSuccess: action.payload.results[0].description,
      };
    case "ADD_PO_ATTACHMENT_LISTS_FAIL":
      return {
        ...state,
        addPOAttachmentListsError: action.payload,
      };
    //----------------------****Get PO Attachment****-----------------------------
    case "GET_PO_ATTACHMENT_INIT":
      return {
        ...state,
        getPOAttachment: "",
        getPOAttachmentSuccess: "",
        getPOAttachmentError: "",
      };
    case "GET_PO_ATTACHMENT_SUCCESS":
      return {
        ...state,
        getPOAttachment: action.payload,
        getPOAttachmentSuccess: action.payload.results[0].description,
      };
    case "GET_PO_ATTACHMENT_FAIL":
      return {
        ...state,
        getPOAttachmentError: action.payload,
      };
    //----------------------****Delete PO Attachment****-----------------------------
    case "DELETE_PO_ATTACHMENT_INIT":
      return {
        ...state,
        deletePOAttachmentSuccess: "",
        deletePOAttachmentError: "",
      };
    case "DELETE_PO_ATTACHMENT_SUCCESS":
      return {
        ...state,
        deletePOAttachmentSuccess: action.payload.results[0].description,
      };
    case "DELETE_PO_ATTACHMENT_FAIL":
      return {
        ...state,
        deletePOAttachmentError: action.payload,
      };
    //----------------------****Delete PO ****-----------------------------
    case "DELETE_PO_INIT":
      return {
        ...state,
        deletePOSuccess: "",
        deletePOError: "",
      };
    case "DELETE_PO_SUCCESS":
      return {
        ...state,
        deletePOSuccess: action.payload.results[0].description,
      };
    case "DELETE_PO_FAIL":
      return {
        ...state,
        deletePOError: action.payload,
      };
    //----------------------****Copy PO ****-----------------------------
    case "COPY_PO_INIT":
      return {
        ...state,
        copyPOSuccess: "",
        copyPOError: "",
      };
    case "COPY_PO_SUCCESS":
      return {
        ...state,
        copyPOSuccess: action.payload.results[0].description,
      };
    case "COPY_PO_FAIL":
      return {
        ...state,
        copyPOError: action.payload,
      };
    //----------------------****Move PO****-----------------------------
    case "MOVE_PO_INIT":
      return {
        ...state,
        movePOSuccess: "",
        movePOError: "",
      };
    case "MOVE_PO_SUCCESS":
      return {
        ...state,
        movePOSuccess: action.payload.results[0].description,
      };
    case "MOVE_PO_FAIL":
      return {
        ...state,
        movePOError: action.payload,
      };
    //----------------------****Send For Approval PO****-----------------------------
    case "SEND_FOR_APPROVAL_PO_INIT":
      return {
        ...state,

        sendForApprovalPOSuccess: "",
        sendForApprovalPOError: "",
      };
    case "SEND_FOR_APPROVAL_PO_SUCCESS":
      return {
        ...state,
        sendForApprovalPOSuccess: action.payload.results[0].description,
      };
    case "SEND_FOR_APPROVAL_PO_FAIL":
      return {
        ...state,
        sendForApprovalPOError: action.payload,
      };
    //----------------------****Approve PO****-----------------------------
    case "APPROVE_PO_INIT":
      return {
        ...state,
        approvePOSuccess: "",
        approvePOError: "",
      };
    case "APPROVE_PO_SUCCESS":
      return {
        ...state,
        approvePOSuccess: action.payload.results[0].description,
      };
    case "APPROVE_PO_FAIL":
      return {
        ...state,
        approvePOError: action.payload,
      };
    //----------------------****Decline PO ****-----------------------------
    case "DECLINE_PO_INIT":
      return {
        ...state,
        declinePOSuccess: "",
        declinePOError: "",
      };
    case "DECLINE_PO_SUCCESS":
      return {
        ...state,
        declinePOSuccess: action.payload.results[0].description,
      };
    case "DECLINE_PO_FAIL":
      return {
        ...state,
        declinePOError: action.payload,
      };
    //----------------------****Hold PO ****-----------------------------
    case "HOLD_PO_INIT":
      return {
        ...state,
        holdPOSuccess: "",
        holdPOError: "",
      };
    case "HOLD_PO_SUCCESS":
      return {
        ...state,
        holdPOSuccess: action.payload.results[0].description,
      };
    case "HOLD_PO_FAIL":
      return {
        ...state,
        holdPOError: action.payload,
      };
    //----------------------****Close PO ****-----------------------------
    case "CLOSE_PO_INIT":
      return {
        ...state,
        closePOSuccess: "",
        closePOError: "",
      };
    case "CLOSE_PO_SUCCESS":
      return {
        ...state,
        closePOSuccess: action.payload.results[0].description,
      };
    case "CLOSE_PO_FAIL":
      return {
        ...state,
        closePOError: action.payload,
      };
    //----------------------****Modify PO ****-----------------------------
    case "MODIFY_PO_INIT":
      return {
        ...state,
        modifyPOSuccess: "",
        modifyPOError: "",
      };
    case "MODIFY_PO_SUCCESS":
      return {
        ...state,
        modifyPOSuccess: action.payload.results[0].description,
      };
    case "MODIFY_PO_FAIL":
      return {
        ...state,
        modifyPOError: action.payload,
      };
    //----------------------****Insert PO ****-----------------------------
    case "INSERT_PO_INIT":
      return {
        ...state,
        insertPO: "",
        insertPOSuccess: "",
        insertPOError: "",
      };
    case "INSERT_PO_SUCCESS":
      return {
        ...state,
        insertPO: action.payload,
        insertPOSuccess: action.payload.results[0].description,
      };
    case "INSERT_PO_FAIL":
      return {
        ...state,
        insertPOError: action.payload,
      };
    //----------------------****Update PO****-----------------------------
    case "UPDATE_PO_INIT":
      return {
        ...state,
        updatePOSuccess: "",
        updatePOError: "",
      };
    case "UPDATE_PO_SUCCESS":
      let updatedPO = action.payload.updatedPO;
      return {
        ...state,
        updatePOSuccess: action.payload.message,
        getPO: {
          ...state.getPO,
          ...updatedPO,
        },
      };
    case "UPDATE_PO_FAIL":
      return {
        ...state,
        updatePOError: action.payload,
      };
    //----------------------****Get PO Transfer****-----------------------------
    case "GET_TRANSFER_LIST_INIT":
      return {
        ...state,
        getTransferList: [],
        getTransferListSuccess: "",
        getTransferListError: "",
      };
    case "GET_TRANSFER_LIST_SUCCESS":
      return {
        ...state,
        getTransferList: action.payload.transferList || [],
        getTransferListSuccess: action.payload.results[0].description,
      };
    case "GET_TRANSFER_LIST_FAIL":
      return {
        ...state,
        getTransferListError: action.payload,
      };
    //----------------------****Import PO Lines****-----------------------------
    case "IMPORT_PO_LINES_INIT":
      return {
        ...state,
        importPOLinese: "",
        importPOLineseSuccess: "",
        importPOLineseError: "",
      };
    case "IMPORT_PO_LINES_SUCCESS":
      return {
        ...state,
        importPOLinese: action.payload || "",
        importPOLineseSuccess: action.payload.results[0].description,
      };
    case "IMPORT_PO_LINES_FAIL":
      return {
        ...state,
        importPOLineseError: action.payload,
      };
    //----------------------****Export PO Lines****-----------------------------
    case "EXPORT_PO_LINES_INIT":
      return {
        ...state,
        exportPOLines: "",
        exportPOLinesSuccess: "",
        exportPOLinesError: "",
      };
    case "EXPORT_PO_LINES_SUCCESS":
      return {
        ...state,
        exportPOLines: action.payload.attachment || "",
        exportPOLinesSuccess: action.payload.results[0].description,
      };
    case "EXPORT_PO_LINES_FAIL":
      return {
        ...state,
        exportPOLinesError: action.payload,
      };
    //----------------------****PSL Export****-----------------------------
    case "PSL_EXPORT_INIT":
      return {
        ...state,
        pslExport: "",
        pslExportSuccess: "",
        pslExportError: ""
      };
    case "PSL_EXPORT_SUCCESS":
      return {
        ...state,
        pslExport: action.payload.attachment || "",
        pslExportSuccess: action.payload.results[0].description,
      };
    case "PSL_EXPORT_FAIL":
      return {
        ...state,
        pslExportError: action.payload,
      };
    //----------------------****Export PO****-----------------------------
    case "EXPORT_PO_INIT":
      return {
        ...state,
        exportPO: "",
        exportPOSuccess: "",
        exportPOError: ""
      };
    case "EXPORT_PO_SUCCESS":
      return {
        ...state,
        exportPO: action.payload.attachment || "",
        exportPOSuccess: action.payload.results[0].description,
      };
    case "EXPORT_PO_FAIL":
      return {
        ...state,
        exportPOError: action.payload,
      };

    //----------------------****Import PO****-----------------------------
    case "IMPORT_PO_INIT":
      return {
        ...state,
        importPOSuccess: "",
        importPOError: "",
      };
    case "IMPORT_PO_SUCCESS":
      return {
        ...state,
        importPOSuccess: action.payload.results[0].description,
      };
    case "IMPORT_PO_FAIL":
      return {
        ...state,
        importPOError: action.payload,
      };
    //----------------------****Post PO****-----------------------------
    case "POST_PO_INIT":
      return {
        ...state,
        postPO: '',
        postPOSuccess: "",
        postPOError: "",
      };
    case "POST_PO_SUCCESS":
      return {
        ...state,
        postPO: action.payload,
        postPOSuccess: action.payload.results[0].description,
      };
    case "POST_PO_FAIL":
      return {
        ...state,
        postPOError: action.payload,
      };
    //----------------------****Clear States****-----------------------------
    case "CLEAR_PO_STATES":
      return {
        ...state,
        getPOTalliesSuccess: "",
        getPOTalliesError: "",

        getPOListSuccess: "",
        getPOListError: "",

        getNewPOListSuccess: "",
        getNewPOListError: "",

        getPOSuccess: "",
        getPOError: "",

        getPOPreviewSuccess: "",
        getPOPreviewError: "",

        getPOSummarySuccess: "",
        getPOSummaryError: "",

        getPOCompanySuccess: "",
        getPOCompanyError: "",

        updatePOCompanySuccess: "",
        updatePOCompanyError: "",

        updatePORefSuccess: "",
        updatePORefError: "",

        getPOSupplierSuccess: "",
        getPOSupplierError: "",

        updatePOSupplierSuccess: "",
        updatePOSupplierError: "",


        updateSpecialConditionSuccess: "",
        updateSpecialConditionError: "",

        updateRequestedSuccess: "",
        updateRequestedError: "",

        getPOLinesSuccess: "",
        getPOLinesError: "",

        updatePOLinesSuccess: "",
        updatePOLinesError: "",

        updatePOAmountSuccess: "",
        updatePOAmountError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        getPOChangesSuccess: "",
        getPOChangesError: "",

        getPOLogSuccess: "",
        getPOLogError: "",

        getPOActivitySuccess: "",
        getPOActivityError: "",

        searchPOsSuccess: "",
        searchPOsError: "",

        addCommentSuccess: "",
        addCommentError: "",

        addPOAttachmentSuccess: "",
        addPOAttachmentError: "",

        addPOAttachmentListsSuccess: "",
        addPOAttachmentListsError: "",

        getPOAttachmentSuccess: "",
        getPOAttachmentError: "",

        deletePOAttachmentSuccess: "",
        deletePOAttachmentError: "",

        deletePOSuccess: "",
        deletePOError: "",

        copyPOSuccess: "",
        copyPOError: "",

        movePOSuccess: "",
        movePOError: "",

        sendForApprovalPOSuccess: "",
        sendForApprovalPOError: "",

        approvePOSuccess: "",
        approvePOError: "",

        declinePOSuccess: "",
        declinePOError: "",

        holdPOSuccess: "",
        holdPOError: "",

        closePOSuccess: "",
        closePOError: "",

        modifyPOSuccess: "",
        modifyPOError: "",

        updatePOSuccess: "",
        updatePOError: "",

        insertPOSuccess: "",
        insertPOError: "",

        getQuoteSuccess: "",
        getQuoteError: "",

        getTransferListSuccess: "",
        getTransferListError: "",

        importPOLinesSuccess: "",
        importPOLinesError: "",

        exportPOLinesSuccess: "",
        exportPOLinesError: "",

        pslExportSuccess: "",
        pslExportError: "",

        exportPOSuccess: "",
        exportPOError: "",

        importPOSuccess: "",
        importPOError: "",

        postPOSuccess: "",
        postPOError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getPOList: [],
        getPOListSuccess: "",
        getPOListError: "",

        getNewPOList: '',
        getNewPOListSuccess: "",
        getNewPOListError: "",

        getPO: "",
        getPOSuccess: "",
        getPOError: "",

        getPOPreview: "",
        getPOPreviewSuccess: "",
        getPOPreviewError: "",

        getPOSummary: "",
        getPOSummarySuccess: "",
        getPOSummaryError: "",

        getPOCompany: "",
        getPOCompanySuccess: "",
        getPOCompanyError: "",

        updatePOCompanySuccess: "",
        updatePOCompanyError: "",

        updatePORefSuccess: "",
        updatePORefError: "",

        getPOSupplier: "",
        getPOSupplierSuccess: "",
        getPOSupplierError: "",

        updatePOSupplierSuccess: "",
        updatePOSupplierError: "",


        updateSpecialConditionSuccess: "",
        updateSpecialConditionError: "",

        updateRequestedSuccess: "",
        updateRequestedError: "",

        getPOLines: "",
        getPOLinesSuccess: "",
        getPOLinesError: "",

        updatePOLinesSuccess: "",
        updatePOLinesError: "",

        updatePOAmountSuccess: "",
        updatePOAmountError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        getPOChanges: [],
        getPOChangesSuccess: "",
        getPOChangesError: "",

        getPOLog: [],
        getPOLogSuccess: "",
        getPOLogError: "",

        getPOActivity: [],
        getPOActivitySuccess: "",
        getPOActivityError: "",

        searchPOs: "",
        searchPOsSuccess: "",
        searchPOsError: "",

        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",

        addPOAttachment: [],
        addPOAttachmentSuccess: "",
        addPOAttachmentError: "",

        addPOAttachmentLists: [],
        addPOAttachmentListsSuccess: "",
        addPOAttachmentListsError: "",

        getPOAttachment: "",
        getPOAttachmentSuccess: "",
        getPOAttachmentError: "",

        deletePOAttachmentSuccess: "",
        deletePOAttachmentError: "",

        deletePOSuccess: "",
        deletePOError: "",

        copyPOSuccess: "",
        copyPOError: "",

        movePOSuccess: "",
        movePOError: "",

        sendForApprovalPOSuccess: "",
        sendForApprovalPOError: "",

        approvePOSuccess: "",
        approvePOError: "",

        declinePOSuccess: "",
        declinePOError: "",

        holdPOSuccess: "",
        holdPOError: "",

        closePOSuccess: "",
        closePOError: "",

        modifyPOSuccess: "",
        modifyPOError: "",

        updatePOSuccess: "",
        updatePOError: "",

        insertPO: "",
        insertPOSuccess: "",
        insertPOError: "",

        getQuote: [],
        getQuoteSuccess: "",
        getQuoteError: "",

        getTransferList: [],
        getTransferListSuccess: "",
        getTransferListError: "",

        importPOLines: "",
        importPOLinesSuccess: "",
        importPOLinesError: "",

        exportPOLines: "",
        exportPOLinesSuccess: "",
        exportPOLinesError: "",

        pslExport: "",
        pslExportSuccess: "",
        pslExportError: "",

        exportPO: "",
        exportPOSuccess: "",
        exportPOError: "",

        importPOSuccess: "",
        importPOError: "",

        postPO: '',
        postPOSuccess: "",
        postPOError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        poTallies: [],
        getPOTalliesSuccess: "",
        getPOTalliesError: "",

        getPOList: [],
        getPOListSuccess: "",
        getPOListError: "",

        getNewPOList: '',
        getNewPOListSuccess: "",
        getNewPOListError: "",

        getPO: "",
        getPOSuccess: "",
        getPOError: "",


        getPOPreview: "",
        getPOPreviewSuccess: "",
        getPOPreviewError: "",

        getPOSummary: "",
        getPOSummarySuccess: "",
        getPOSummaryError: "",

        getPOCompany: "",
        getPOCompanySuccess: "",
        getPOCompanyError: "",

        updatePOCompanySuccess: "",
        updatePOCompanyError: "",

        updatePORefSuccess: "",
        updatePORefError: "",

        getPOSupplier: "",
        getPOSupplierSuccess: "",
        getPOSupplierError: "",

        updatePOSupplierSuccess: "",
        updatePOSupplierError: "",


        updateSpecialConditionSuccess: "",
        updateSpecialConditionError: "",

        updateRequestedSuccess: "",
        updateRequestedError: "",

        getPOLines: "",
        getPOLinesSuccess: "",
        getPOLinesError: "",

        updatePOLinesSuccess: "",
        updatePOLinesError: "",

        updatePOAmountSuccess: "",
        updatePOAmountError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        getPOChanges: [],
        getPOChangesSuccess: "",
        getPOChangesError: "",

        getPOLog: [],
        getPOLogSuccess: "",
        getPOLogError: "",

        getPOActivity: [],
        getPOActivitySuccess: "",
        getPOActivityError: "",

        searchPOs: "",
        searchPOsSuccess: "",
        searchPOsError: "",

        addCommentData: [],
        addCommentSuccess: "",
        addCommentError: "",

        addPOAttachment: [],
        addPOAttachmentSuccess: "",
        addPOAttachmentError: "",

        addPOAttachmentLists: [],
        addPOAttachmentListsSuccess: "",
        addPOAttachmentListsError: "",

        getPOAttachment: "",
        getPOAttachmentSuccess: "",
        getPOAttachmentError: "",

        deletePOAttachmentSuccess: "",
        deletePOAttachmentError: "",

        deletePOSuccess: "",
        deletePOError: "",

        copyPOSuccess: "",
        copyPOError: "",

        movePOSuccess: "",
        movePOError: "",

        sendForApprovalPOSuccess: "",
        sendForApprovalPOError: "",

        approvePOSuccess: "",
        approvePOError: "",

        declinePOSuccess: "",
        declinePOError: "",

        holdPOSuccess: "",
        holdPOError: "",

        closePOSuccess: "",
        closePOError: "",

        modifyPOSuccess: "",
        modifyPOError: "",

        updatePOSuccess: "",
        updatePOError: "",

        insertPO: "",
        insertPOSuccess: "",
        insertPOError: "",

        getQuote: [],
        getQuoteSuccess: "",
        getQuoteError: "",

        getTransferList: [],
        getTransferListSuccess: "",
        getTransferListError: "",

        importPOLines: "",
        importPOLinesSuccess: "",
        importPOLinesError: "",


        exportPOLines: "",
        exportPOLinesSuccess: "",
        exportPOLinesError: "",

        pslExport: "",
        pslExportSuccess: "",
        pslExportError: "",

        exportPO: "",
        exportPOSuccess: "",
        exportPOError: "",

        importPOSuccess: "",
        importPOError: "",

        postPO: '',
        postPOSuccess: "",
        postPOError: "",
      };
    default:
      return state
  }
}
