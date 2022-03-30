const INIT_STATE = {
  checkCompanySuccess: "",
  checkCompanyError: "",

  loginResp: "",
  loginSuccess: "",
  loginError: "",

  reqPinCode: "",
  reqPinCodeSuccess: "",
  reqPinCodeError: "",

  verifyPinCodeSuccess: "",
  verifyPinCodeError: "",

  resetPasswordSuccess: "",
  resetPasswordError: "",

  logoutSuccess: "",
  logoutError: "",

  productions: [],
  getProductionsSuccess: "",
  getProductionsError: "",

  loginProductionData: "",
  loginProductionSuccess: "",
  loginProductionError: "",

  getAccountDetails: "",
  getAccountDetailsSuccess: "",
  getAccountDetailsError: "",

  setUserSettings: "",
  setUserSettingsSuccess: "",
  setUserSettingsError: "",

  updateAccountDetails: "",
  updateAccountDetailsSuccess: "",
  updateAccountDetailsError: "",

  getDefaultValues: "",
  getDefaultValuesSuccess: "",
  getDefaultValuesError: "",

  getHelpPage: "",
  getHelpPageSuccess: "",
  getHelpPageError: "",

  getTransactionHistory: [],
  getTransactionHistorySuccess: "",
  getTransactionHistoryError: "",

  getRecentActivity: [],
  getRecentActivitySuccess: "",
  getRecentActivityError: "",

  getUsersList: "",
  getUsersListSuccess: "",
  getUsersListError: "",

  getUserSetup: "",
  getUserSetupSuccess: "",
  getUserSetupError: "",

  updateUserSuccess: "",
  updateUserError: "",

  primeUser: "",
  primeUserSuccess: "",
  primeUserError: "",

  insertUser: "",
  insertUserSuccess: "",
  insertUserError: "",

  deleteUserSuccess: "",
  deleteUserError: "",

  getAdvancedList: [],
  getAdvancedListSuccess: "",
  getAdvancedListError: "",

  getApprovers: [],
  getApproversSuccess: "",
  getApproversError: "",

  getApprovalGroups: [],
  getApprovalGroupsSuccess: "",
  getApprovalGroupsError: "",

  getApprovalGroup: "",
  getApprovalGroupSuccess: "",
  getApprovalGroupError: "",

  insertApprovalGroupSuccess: "",
  insertApprovalGroupError: "",

  updateApprovalGroupSuccess: "",
  updateApprovalGroupError: "",

  primeApprover: "",
  primeApproverSuccess: "",
  primeApproverError: "",

  deleteApprovalGroupSuccess: "",
  deleteApprovalGroupError: "",

  getUserDefaults: [],
  getUserDefaultsSuccess: "",
  getUserDefaultsError: "",

  updateUserDefaultsSuccess: "",
  updateUserDefaultsError: "",

  getSystemDefaults: [],
  getSystemDefaultsSuccess: "",
  getSystemDefaultsError: "",

  updateSystemDefaultsSuccess: "",
  updateSystemDefaultsError: "",

  sendInviteSuccess: "",
  sendInviteError: "",

  setting: {
    Color: "#2f73ad",
    uploadBackgroundImage: "/static/media/user_setup_bg.4feb80d3.png",
  },
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Check Company****--------------------------
    case "CHECK_COMPANY_INIT":
      return {
        ...state,
        checkCompanySuccess: "",
        checkCompanyError: "",
      };
    case "CHECK_COMPANY_SUCCESS":
      return {
        ...state,
        checkCompanySuccess: action.payload || "Success",
      };
    case "CHECK_COMPANY_FAIL":
      return {
        ...state,
        checkCompanyError: action.payload,
      };
    //----------------------****Log In User****-----------------------------
    case "LOG_IN_USER_INIT":
      return {
        ...state,
        loginSuccess: "",
        loginError: "",
      };
    case "LOG_IN_USER_SUCCESS":
      return {
        ...state,
        loginError: "",
        loginSuccess: action.payload.results[0].description || "Success",
        loginResp: action.payload,
      };
    case "LOG_IN_USER_FAIL":
      return {
        ...state,
        loginError: action.payload,
      };
    //----------------------****Request For Pin Code****--------------------
    case "REQUEST_PIN_CODE_INIT":
      return {
        ...state,
        reqPinCodeSuccess: "",
        reqPinCodeError: "",
      };
    case "REQUEST_PIN_CODE_SUCCESS":
      return {
        ...state,
        reqPinCode: action.payload,
        reqPinCodeSuccess: action.payload.results[0].description,
      };
    case "REQUEST_PIN_CODE_FAIL":
      return {
        ...state,
        reqPinCodeError: action.payload,
      };
    //----------------------****Verify Pin Code****--------------------------
    case "VERIFY_PIN_CODE_INIT":
      return {
        ...state,
        verifyPinCodeError: "",
        verifyPinCodeSuccess: "",
      };
    case "VERIFY_PIN_CODE_SUCCESS":
      return {
        ...state,
        verifyPinCodeError: "",
        verifyPinCodeSuccess: action.payload,
      };
    case "VERIFY_PIN_CODE_FAIL":
      return {
        ...state,
        verifyPinCodeError: action.payload,
      };
    //----------------------****Reset Password****---------------------------
    case "RESET_PASSWORD_INIT":
      return {
        ...state,
        resetPasswordSuccess: "",
        resetPasswordError: "",
      };
    case "RESET_PASSWORD_SUCCESS":
      return {
        ...state,
        resetPasswordError: "",
        resetPasswordSuccess: action.payload,
      };
    case "RESET_PASSWORD_FAIL":
      return {
        ...state,
        resetPasswordError: action.payload,
      };
    //----------------------****Log Out User****-----------------------------
    case "LOG_OUT_USER_INIT":
      return {
        ...state,
        logoutSuccess: "",
        logoutError: "",
      };
    case "LOG_OUT_USER_SUCCESS":
      return {
        ...state,
        logoutSuccess: action.payload,
        logoutError: "",
      };
    case "LOG_OUT_USER_FAIL":
      return {
        ...state,
        logoutError: action.payload,
      };
    //----------------------****Get Productions****--------------------------
    case "GET_PRODUCTIONS_INIT":
      return {
        ...state,
        getProductionsSuccess: "",
        getProductionsError: "",
      };
    case "GET_PRODUCTIONS_SUCCESS":
      return {
        ...state,
        productions: action.payload.productions || [],
        getProductionsSuccess: action.payload.results[0].description,
        getProductionsError: "",
      };
    case "GET_PRODUCTIONS_FAIL":
      return {
        ...state,
        getProductionsError: action.payload,
      };
    //----------------------****LogIn Production****---------------------------
    case "LOG_IN_PRODUCTION_INIT":
      return {
        ...state,
        loginProductionData: "",
        loginProductionSuccess: "",
        loginProductionError: "",
      };
    case "LOG_IN_PRODUCTION_SUCCESS":
      return {
        ...state,
        loginProductionData: action.payload.userDetails || "",
        loginProductionSuccess: action.payload.results[0].description,
      };
    case "LOG_IN_PRODUCTION_FAIL":
      return {
        ...state,
        loginProductionError: action.payload,
      };
    //----------------------****Get Account Details****-------------------------
    case "GET_ACCOUNT_DETAILS_INIT":
      return {
        ...state,
        getAccountDetails: "",
        getAccountDetailsSuccess: "",
        getAccountDetailsError: "",
      };
    case "GET_ACCOUNT_DETAILS_SUCCESS":
      let resp = {
        ...action.payload,
        accountDetails: {
          ...action.payload.accountDetails,
          avatar:
            "data:image/png;base64," + action.payload.accountDetails.avatar,
          signature:
            action.payload.accountDetails.sigType === "Drawn" &&
            action.payload.accountDetails.signature
              ? "data:image/png;base64," +
                action.payload.accountDetails.signature
              : action.payload.accountDetails.signature,
        },
      };

      localStorage.setItem("getAccountDetails", JSON.stringify(action.payload));

      return {
        ...state,
        getAccountDetails: resp || "",
        getAccountDetailsSuccess: action.payload.results[0].description,
      };
    case "GET_ACCOUNT_DETAILS_FAIL":
      return {
        ...state,
        getAccountDetailsError: action.payload,
      };
    //----------------------****Update Account Details****----------------------
    case "UPDATE_ACCOUNT_DETAILS_INIT":
      return {
        ...state,
        updateAccountDetails: "",
        updateAccountDetailsSuccess: "",
        updateAccountDetailsError: "",
      };
    case "UPDATE_ACCOUNT_DETAILS_SUCCESS":
      let accountDetailsRes = {
        ...action.payload.updatedData,
        // avatar: "data:image/png;base64," + action.payload.updatedData.avatar,
        // signature:
        //   action.payload.updatedData.sigType === "Drawn"
        //     ? "data:image/png;base64," + action.payload.updatedData.signature
        //     : action.payload.updatedData.signature
      };
      return {
        ...state,
        getAccountDetails: {
          ...state.getAccountDetails,
          accountDetails: {
            ...state.accountDetails,
            ...accountDetailsRes,
          },
        },
        updateAccountDetails: action.payload || "",
        updateAccountDetailsSuccess:
          action.payload.updateAccountDetailsResp.results[0].description,
      };
    case "UPDATE_ACCOUNT_DETAILS_FAIL":
      return {
        ...state,
        updateAccountDetailsError: action.payload,
      };
    //----------------------****Get Help Page****--------------------------------
    case "GET_HELP_PAGE_INIT":
      return {
        ...state,
        getHelpPage: "",
        getHelpPageSuccess: "",
        getHelpPageError: "",
      };
    case "GET_HELP_PAGE_SUCCESS":
      return {
        ...state,
        getHelpPage: action.payload.helpPage || "",
        getHelpPageSuccess: action.payload.results[0].description,
      };
    case "GET_HELP_PAGE_FAIL":
      return {
        ...state,
        getHelpPageError: action.payload,
      };
    //----------------------****Get Transaction History****-----------------------
    case "GET_TRANSACTION_HISTORY_INIT":
      return {
        ...state,
        getTransactionHistory: [],
        getTransactionHistorySuccess: "",
        getTransactionHistoryError: "",
      };
    case "GET_TRANSACTION_HISTORY_SUCCESS":
      return {
        ...state,
        getTransactionHistory: action.payload.transactionHistory || [],
        getTransactionHistorySuccess: action.payload.results[0].description,
      };
    case "GET_TRANSACTION_HISTORY_FAIL":
      return {
        ...state,
        getTransactionHistoryError: action.payload,
      };
    //----------------------****Get Recent Activity****----------------------------
    case "GET_RECENT_ACTIVITY_INIT":
      return {
        ...state,
        getRecentActivity: [],
        getRecentActivitySuccess: "",
        getRecentActivityError: "",
      };
    case "GET_RECENT_ACTIVITY_SUCCESS":
      return {
        ...state,
        getRecentActivity: action.payload.recentActivity || [],
        getRecentActivitySuccess: action.payload.results[0].description,
      };
    case "GET_RECENT_ACTIVITY_FAIL":
      return {
        ...state,
        getRecentActivityError: action.payload,
      };
    //----------------------****Get Default Values****------------------------------
    case "GET_DEFAULT_VALUES_INIT":
      return {
        ...state,
        getDefaultValues: "",
        getDefaultValuesSuccess: "",
        getDefaultValuesError: "",
      };
    case "GET_DEFAULT_VALUES_SUCCESS":
      let defVals = action.payload;

      let flags = defVals.flags || [];
      let _flags =
        flags.sort((a, b) => (a.sequence > b.sequence ? 1 : -1)) || [];
      defVals.flags = _flags;

      localStorage.setItem("getDefaultValues", JSON.stringify(defVals));
      return {
        ...state,
        getDefaultValues: defVals,
        getDefaultValuesSuccess: action.payload.results[0].description,
      };
    case "GET_DEFAULT_VALUES_FAIL":
      return {
        ...state,
        getDefaultValuesError: action.payload,
      };
    //----------------------****Get User Settings****-------------------------------
    case "GET_SET_USER_SETTING_INIT":
      return {
        ...state,
        setUserSettings: "",
        setUserSettingsSuccess: "",
        setUserSettingsError: "",
      };
    case "GET_SET_USER_SETTING_SUCCESS":
      return {
        ...state,
        setUserSettings: action.payload,
        setUserSettingsSuccess: action.payload.results[0].description,
      };
    case "GET_SET_USER_SETTING_FAIL":
      return {
        ...state,
        setUserSettingsError: action.payload,
      };
    //----------------------****Get Users List****-----------------------------------
    case "GET_USERS_LIST_INIT":
      return {
        ...state,
        getUsersList: "",
        getUsersListSuccess: "",
        getUsersListError: "",
      };
    case "GET_USERS_LIST_SUCCESS":
      return {
        ...state,
        getUsersList: action.payload,
        getUsersListSuccess: action.payload.results[0].description,
      };
    case "GET_USERS_LIST_FAIL":
      return {
        ...state,
        getUsersListError: action.payload,
      };
    //----------------------****Get User Setup****-----------------------------------
    case "GET_USER_SETUP_INIT":
      return {
        ...state,
        getUserSetup: "",
        getUserSetupSuccess: "",
        getUserSetupError: "",
      };
    case "GET_USER_SETUP_SUCCESS":
      return {
        ...state,
        getUserSetup: action.payload,
        getUserSetupSuccess: action.payload.results[0].description,
      };
    case "GET_USER_SETUP_FAIL":
      return {
        ...state,
        getUserSetupError: action.payload,
      };
    //----------------------****Update User****-----------------------------------
    case "UPDATE_USER_INIT":
      return {
        ...state,
        updateUserSuccess: "",
        updateUserError: "",
      };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        updateUser: action.payload,
        updateUserSuccess: action.payload.results[0].description,
      };
    case "UPDATE_USER_FAIL":
      return {
        ...state,
        getUserSetupError: action.payload,
      };
    //----------------------****Prime User****-----------------------------------
    case "PRIME_USER_INIT":
      return {
        ...state,
        primeUser: "",
        primeUserSuccess: "",
        primeUserError: "",
      };
    case "PRIME_USER_SUCCESS":
      return {
        ...state,
        primeUser: action.payload,
        primeUserSuccess: action.payload.results[0].description,
      };
    case "PRIME_USER_FAIL":
      return {
        ...state,
        primeUserError: action.payload,
      };
    //----------------------****Insert User****-----------------------------------
    case "INSERT_USER_INIT":
      return {
        ...state,
        insertUser: "",
        insertUserSuccess: "",
        insertUserError: "",
      };
    case "INSERT_USER_SUCCESS":
      return {
        ...state,
        insertUser: action.payload,
        insertUserSuccess: action.payload.results[0].description,
      };
    case "INSERT_USER_FAIL":
      return {
        ...state,
        insertUserError: action.payload,
      };
    //----------------------****Delete User****-----------------------------------
    case "DELETE_USER_INIT":
      return {
        ...state,
        deleteUserSuccess: "",
        deleteUserError: "",
      };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        deleteUserSuccess: action.payload.results[0].description,
      };
    case "DELETE_USER_FAIL":
      return {
        ...state,
        deleteUserError: action.payload,
      };
    //----------------------****Get Advanced List****-----------------------------------
    case "GET_ADVANCED_LIST_INIT":
      return {
        ...state,
        getAdvancedList: [],
        getAdvancedListSuccess: "",
        getAdvancedListError: "",
      };
    case "GET_ADVANCED_LIST_SUCCESS":
      return {
        ...state,
        getAdvancedList: action.payload.advancedList || [],
        getAdvancedListSuccess: action.payload.results[0].description,
      };
    case "GET_ADVANCED_LIST_FAIL":
      return {
        ...state,
        getAdvancedListError: action.payload,
      };
    //----------------------****Get Approvers****-----------------------------------
    case "GET_APPROVERS_INIT":
      return {
        ...state,
        getApprovers: [],
        getApproversSuccess: "",
        getApproversError: "",
      };
    case "GET_APPROVERS_SUCCESS":
      return {
        ...state,
        getApprovers: action.payload.userList || [],
        getApproversSuccess: action.payload.results[0].description,
      };
    case "GET_APPROVERS_FAIL":
      return {
        ...state,
        getApproversError: action.payload,
      };
    //----------------------****Get Approval Groups****-----------------------------------
    case "GET_APPROVAL_GROUPS_INIT":
      return {
        ...state,
        getApprovalGroups: [],
        getApprovalGroupsSuccess: "",
        getApprovalGroupsError: "",
      };
    case "GET_APPROVAL_GROUPS_SUCCESS":
      return {
        ...state,
        getApprovalGroups: action.payload.approvalGroups || [],
        getApprovalGroupsSuccess: action.payload.results[0].description,
      };
    case "GET_APPROVAL_GROUPS_FAIL":
      return {
        ...state,
        getApprovalGroupsError: action.payload,
      };
    //----------------------****Get Approval Group****-----------------------------------
    case "GET_APPROVAL_GROUP_INIT":
      return {
        ...state,
        getApprovalGroup: "",
        getApprovalGroupSuccess: "",
        getApprovalGroupError: "",
      };
    case "GET_APPROVAL_GROUP_SUCCESS":
      return {
        ...state,
        getApprovalGroup: action.payload.approvalGroup || "",
        getApprovalGroupSuccess: action.payload.results[0].description,
      };
    case "GET_APPROVAL_GROUP_FAIL":
      return {
        ...state,
        getApprovalGroupError: action.payload,
      };
    //----------------------****Insert Approval Group****-----------------------------------
    case "INSERT_APPROVAL_GROUP_INIT":
      return {
        ...state,
        insertApprovalGroupSuccess: "",
        insertApprovalGroupError: "",
      };
    case "INSERT_APPROVAL_GROUP_SUCCESS":
      return {
        ...state,
        insertApprovalGroupSuccess: action.payload.results[0].description,
      };
    case "INSERT_APPROVAL_GROUP_FAIL":
      return {
        ...state,
        insertApprovalGroupError: action.payload,
      };
    //----------------------****Update Approval Group****-----------------------------------
    case "UPDATE_APPROVAL_GROUP_INIT":
      return {
        ...state,
        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",
      };
    case "UPDATE_APPROVAL_GROUP_SUCCESS":
      return {
        ...state,
        updateApprovalGroupSuccess: action.payload.results[0].description,
      };
    case "UPDATE_APPROVAL_GROUP_FAIL":
      return {
        ...state,
        updateApprovalGroupError: action.payload,
      };
    //----------------------****Prime Approver****-----------------------------------
    case "PRIME_APPROVER_INIT":
      return {
        ...state,
        primeApprover: "",
        primeApproverSuccess: "",
        primeApproverError: "",
      };
    case "PRIME_APPROVER_SUCCESS":
      return {
        ...state,
        primeApprover: action.payload.approver || "",
        primeApproverSuccess: action.payload.results[0].description,
      };
    case "PRIME_APPROVER_FAIL":
      return {
        ...state,
        primeApproverError: action.payload,
      };
    //----------------------****Delete Approval Group****-----------------------------------
    case "DELETE_APPROVAL_GROUP_INIT":
      return {
        ...state,
        deleteApprovalGroupSuccess: "",
        deleteApprovalGroupError: "",
      };
    case "DELETE_APPROVAL_GROUP_SUCCESS":
      return {
        ...state,
        deleteApprovalGroupSuccess: action.payload.results[0].description,
      };
    case "DELETE_APPROVAL_GROUP_FAIL":
      return {
        ...state,
        deleteApprovalGroupError: action.payload,
      };
    //----------------------****Get User Defaults****-----------------------------------
    case "GET_USER_DEFAULTS_INIT":
      return {
        ...state,
        getUserDefaults: [],
        getUserDefaultsSuccess: "",
        getUserDefaultsError: "",
      };
    case "GET_USER_DEFAULTS_SUCCESS":
      return {
        ...state,
        getUserDefaults: action.payload.userDefaults || [],
        getUserDefaultsSuccess: action.payload.results[0].description,
      };
    case "GET_USER_DEFAULTS_FAIL":
      return {
        ...state,
        getUserDefaultsError: action.payload,
      };
    //----------------------****Update User Defaults****-----------------------------------
    case "UPDATE_USER_DEFAULTS_INIT":
      return {
        ...state,
        updateUserDefaultsSuccess: "",
        updateUserDefaultsError: "",
      };
    case "UPDATE_USER_DEFAULTS_SUCCESS":
      return {
        ...state,
        updateUserDefaultsSuccess: action.payload.results[0].description,
      };
    case "UPDATE_USER_DEFAULTS_FAIL":
      return {
        ...state,
        updateUserDefaultsError: action.payload,
      };
    //----------------------****Get System Defaults****-----------------------------------
    case "GET_SYSTEM_DEFAULTS_INIT":
      return {
        ...state,
        getSystemDefaults: [],
        getSystemDefaultsSuccess: "",
        getSystemDefaultsError: "",
      };
    case "GET_SYSTEM_DEFAULTS_SUCCESS":
      return {
        ...state,
        getSystemDefaults: action.payload.systemDefaults || [],
        getSystemDefaultsSuccess: action.payload.results[0].description,
      };
    case "GET_SYSTEM_DEFAULTS_FAIL":
      return {
        ...state,
        getSystemDefaultsError: action.payload,
      };
    //----------------------****Update System Defaults****-----------------------------------
    case "UPDATE_SYSTEM_DEFAULTS_INIT":
      return {
        ...state,
        updateSystemDefaultsSuccess: "",
        updateSystemDefaultsError: "",
      };
    case "UPDATE_SYSTEM_DEFAULTS_SUCCESS":
      return {
        ...state,
        updateSystemDefaultsSuccess: action.payload.results[0].description,
      };
    case "UPDATE_SYSTEM_DEFAULTS_FAIL":
      return {
        ...state,
        updateSystemDefaultsError: action.payload,
      };
    //----------------------****Send Invite****-----------------------------------
    case "SEND_INVITE_INIT":
      return {
        ...state,
        sendInviteSuccess: "",
        sendInviteError: "",
      };
    case "SEND_INVITE_SUCCESS":
      return {
        ...state,
        sendInviteSuccess: action.payload.results[0].description,
      };
    case "SEND_INVITE_FAIL":
      return {
        ...state,
        sendInviteError: action.payload,
      };
    //----------------------****Clear States****-----------------------------
    case "CLEAR_USER_STATES":
      return {
        ...state,
        checkCompanySuccess: "",
        checkCompanyError: "",

        loginSuccess: "",
        loginError: "",

        reqPinCodeSuccess: "",
        reqPinCodeError: "",

        verifyPinCodeSuccess: "",
        verifyPinCodeError: "",

        resetPasswordSuccess: "",
        resetPasswordError: "",

        logoutSuccess: "",
        logoutError: "",

        getProductionsSuccess: "",
        getProductionsError: "",

        loginProductionSuccess: "",
        loginProductionError: "",

        getAccountDetailsSuccess: "",
        getAccountDetailsError: "",

        setUserSettingsSuccess: "",
        setUserSettingsError: "",

        updateAccountDetailsSuccess: "",
        updateAccountDetailsError: "",

        getDefaultValuesSuccess: "",
        getDefaultValuesError: "",

        getHelpPageSuccess: "",
        getHelpPageError: "",

        getTransactionHistorySuccess: "",
        getTransactionHistoryError: "",

        getRecentActivitySuccess: "",
        getRecentActivityError: "",

        getUsersListSuccess: "",
        getUsersListError: "",

        getUserSetupSuccess: "",
        getUserSetupError: "",

        updateUserSuccess: "",
        updateUserError: "",

        primeUserSuccess: "",
        primeUserError: "",

        insertUserSuccess: "",
        insertUserError: "",

        deleteUserSuccess: "",
        deleteUserError: "",

        getAdvancedListSuccess: "",
        getAdvancedListError: "",

        getApproversSuccess: "",
        getApproversError: "",

        getApprovalGroupsSuccess: "",
        getApprovalGroupsError: "",

        getApprovalGroupSuccess: "",
        getApprovalGroupError: "",

        insertApprovalGroupSuccess: "",
        insertApprovalGroupError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        primeApproverSuccess: "",
        primeApproverError: "",

        deleteApprovalGroupSuccess: "",
        deleteApprovalGroupError: "",

        getUserDefaultsSuccess: "",
        getUserDefaultsError: "",

        updateUserDefaultsSuccess: "",
        updateUserDefaultsError: "",

        getSystemDefaultsSuccess: "",
        getSystemDefaultsError: "",

        updateSystemDefaultsSuccess: "",
        updateSystemDefaultsError: "",

        sendInviteSuccess: "",
        sendInviteError: "",
      };
    //----------------------****Clear States When Producton Login****-----------------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getAccountDetails: "",
        getAccountDetailsSuccess: "",
        getAccountDetailsError: "",

        updateAccountDetails: "",
        updateAccountDetailsSuccess: "",
        updateAccountDetailsError: "",

        getDefaultValues: "",
        getDefaultValuesSuccess: "",
        getDefaultValuesError: "",

        setUserSettings: "",
        setUserSettingsSuccess: "",
        setUserSettingsError: "",

        getHelpPage: "",
        getHelpPageSuccess: "",
        getHelpPageError: "",

        getTransactionHistory: [],
        getTransactionHistorySuccess: "",
        getTransactionHistoryError: "",

        getRecentActivity: [],
        getRecentActivitySuccess: "",
        getRecentActivityError: "",

        getUsersList: "",
        getUsersListSuccess: "",
        getUsersListError: "",

        getUserSetup: "",
        getUserSetupSuccess: "",
        getUserSetupError: "",

        updateUserSuccess: "",
        updateUserError: "",

        primeUser: "",
        primeUserSuccess: "",
        primeUserError: "",

        insertUser: "",
        insertUserSuccess: "",
        insertUserError: "",

        deleteUserSuccess: "",
        deleteUserError: "",

        getAdvancedList: [],
        getAdvancedListSuccess: "",
        getAdvancedListError: "",

        getApprovers: [],
        getApproversSuccess: "",
        getApproversError: "",

        getApprovalGroups: [],
        getApprovalGroupsSuccess: "",
        getApprovalGroupsError: "",

        getApprovalGroup: "",
        getApprovalGroupSuccess: "",
        getApprovalGroupError: "",

        insertApprovalGroupSuccess: "",
        insertApprovalGroupError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        primeApprover: "",
        primeApproverSuccess: "",
        primeApproverError: "",

        deleteApprovalGroupSuccess: "",
        deleteApprovalGroupError: "",

        getUserDefaults: [],
        getUserDefaultsSuccess: "",
        getUserDefaultsError: "",

        updateUserDefaultsSuccess: "",
        updateUserDefaultsError: "",

        getSystemDefaults: [],
        getSystemDefaultsSuccess: "",
        getSystemDefaultsError: "",

        updateSystemDefaultsSuccess: "",
        updateSystemDefaultsError: "",

        sendInviteSuccess: "",
        sendInviteError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      localStorage.removeItem("userLogin");
      localStorage.removeItem("userType");
      localStorage.removeItem("getAccountDetails");
      localStorage.removeItem("getDefaultValues");
      localStorage.removeItem("loginProduction");
      localStorage.removeItem("userContact");
      localStorage.removeItem("blockChart");

      localStorage.removeItem("blockPO");
      localStorage.removeItem("lockPONumber");
      localStorage.removeItem("blockInvoice");
      localStorage.removeItem("blockDocuments");
      localStorage.removeItem("blockExpense");
      localStorage.removeItem("blockPayments");
      localStorage.removeItem("blockTimecards");
      localStorage.removeItem("blockJournals");
      localStorage.removeItem("supplierApproval");
      localStorage.removeItem("blockSupplier");
      localStorage.removeItem("usePageLoading");

      localStorage.removeItem("jsonData");
      localStorage.removeItem("key");
      localStorage.removeItem("reportFile");

      //set default setting
      let obj = {
        receivedDateCheck: false,
        descriptionCheck: true,
        paymentReferenceCheck: false,
        paymentDateCheck: false,
      };
      localStorage.setItem("displayAddInvoiceSettings", JSON.stringify(obj));

      return {
        ...state,

        checkCompanySuccess: "",
        checkCompanyError: "",

        loginResp: "",
        loginSuccess: "",
        loginError: "",

        reqPinCode: "",
        reqPinCodeSuccess: "",
        reqPinCodeError: "",

        verifyPinCodeSuccess: "",
        verifyPinCodeError: "",

        resetPasswordSuccess: "",
        resetPasswordError: "",

        logoutSuccess: "",
        logoutError: "",

        productions: [],
        getProductionsSuccess: "",
        getProductionsError: "",

        loginProductionData: "",
        loginProductionSuccess: "",
        loginProductionError: "",

        getAccountDetails: "",
        getAccountDetailsSuccess: "",
        getAccountDetailsError: "",

        updateAccountDetails: "",
        updateAccountDetailsSuccess: "",
        updateAccountDetailsError: "",

        getDefaultValues: "",
        getDefaultValuesSuccess: "",
        getDefaultValuesError: "",

        setUserSettings: "",
        setUserSettingsSuccess: "",
        setUserSettingsError: "",

        getHelpPage: "",
        getHelpPageSuccess: "",
        getHelpPageError: "",

        getTransactionHistory: [],
        getTransactionHistorySuccess: "",
        getTransactionHistoryError: "",

        getRecentActivity: [],
        getRecentActivitySuccess: "",
        getRecentActivityError: "",

        getUsersList: "",
        getUsersListSuccess: "",
        getUsersListError: "",

        getUserSetup: "",
        getUserSetupSuccess: "",
        getUserSetupError: "",

        updateUserSuccess: "",
        updateUserError: "",

        primeUser: "",
        primeUserSuccess: "",
        primeUserError: "",

        insertUser: "",
        insertUserSuccess: "",
        insertUserError: "",

        deleteUserSuccess: "",
        deleteUserError: "",

        getAdvancedList: [],
        getAdvancedListSuccess: "",
        getAdvancedListError: "",

        getApprovers: [],
        getApproversSuccess: "",
        getApproversError: "",

        getApprovalGroups: [],
        getApprovalGroupsSuccess: "",
        getApprovalGroupsError: "",

        getApprovalGroup: "",
        getApprovalGroupSuccess: "",
        getApprovalGroupError: "",

        insertApprovalGroupSuccess: "",
        insertApprovalGroupError: "",

        updateApprovalGroupSuccess: "",
        updateApprovalGroupError: "",

        primeApprover: "",
        primeApproverSuccess: "",
        primeApproverError: "",

        deleteApprovalGroupSuccess: "",
        deleteApprovalGroupError: "",

        getUserDefaults: [],
        getUserDefaultsSuccess: "",
        getUserDefaultsError: "",

        updateUserDefaultsSuccess: "",
        updateUserDefaultsError: "",

        getSystemDefaults: [],
        getSystemDefaultsSuccess: "",
        getSystemDefaultsError: "",

        updateSystemDefaultsSuccess: "",
        updateSystemDefaultsError: "",

        sendInviteSuccess: "",
        sendInviteError: "",
      };

    case "UPDATE_SETTING":
      return {
        ...state,
        setting: action.payload,
      };
    default:
      return state;
  }
}
