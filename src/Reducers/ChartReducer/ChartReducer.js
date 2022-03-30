const INIT_STATE = {
  getChartSorts: "",
  getChartSortsSuccess: "",
  getChartSortsError: "",

  getChartCodes: "",
  getChartCodesSuccess: "",
  getChartCodesError: "",

  getTaxCodes: [],
  getTaxCodesSuccess: "",
  getTaxCodesError: "",

  getFlags: "",
  getFlagsSuccess: "",
  getFlagsError: "",

  getCurrencies: [],
  getCurrenciesSuccess: "",
  getCurrenciesError: "",

  insertChartOfAccounts: "",
  insertChartOfAccountsSuccess: "",
  insertChartOfAccountsError: "",

  getChartLayout: "",
  getChartLayoutSuccess: "",
  getChartLayoutError: "",

  getDepartments: [],
  getDepartmentsSuccess: "",
  getDepartmentsError: "",

  getDepartment: "",
  getDepartmentSuccess: "",
  getDepartmentError: "",

  primeDepartment: "",
  primeDepartmentSuccess: "",
  primeDepartmentError: "",

  addDepartmentSuccess: "",
  addDepartmentError: "",

  updateDepartmentSuccess: "",
  updateDepartmentError: "",

  deleteDepartmentSuccess: "",
  deleteDepartmentError: "",

  primeChart: "",
  primeChartSuccess: "",
  primeChartError: "",

  getChart: "",
  getChartSuccess: "",
  getChartError: "",

  addChartSuccess: "",
  addChartError: "",

  updateChartSuccess: "",
  updateChartError: "",

  deleteChartSuccess: "",
  deleteChartError: "",

  getCurrency: "",
  getCurrencySuccess: "",
  getCurrencyError: "",

  primeCurrency: "",
  primeCurrencySuccess: "",
  primeCurrencyError: "",

  getTrackingCodes: [],
  getTrackingCodesSuccess: "",
  getTrackingCodesError: "",

  getTrackingCode: "",
  getTrackingCodeSuccess: "",
  getTrackingCodeError: "",

  updateTrackingCodeSuccess: "",
  updateTrackingCodeError: "",

  addTrackingCode: "",
  addTrackingCodeSuccess: "",
  addTrackingCodeError: "",

  deleteTrackingCodeSuccess: "",
  deleteTrackingCodeError: "",

  getTrackingOptions: [],
  getTrackingOptionsSuccess: "",
  getTrackingOptionsError: "",

  getTaxFlag: "",
  getTaxFlagSuccess: "",
  getTaxFlagError: "",

  primeTaxFlag: "",
  primeTaxFlagSuccess: "",
  primeTaxFlagError: "",

  insertTaxFlagSuccess: "",
  insertTaxFlagError: "",

  updateTaxFlagSuccess: "",
  updateTaxFlagError: "",

  deleteTaxFlagSuccess: "",
  deleteTaxFlagError: "",

  getChartAccounts: [],
  getChartAccountsSuccess: "",
  getChartAccountsError: "",

  deleteChartAccountSuccess: "",
  deleteChartAccountError: "",

  primeAccount: "",
  primeAccountSuccess: "",
  primeAccountError: "",

  addAccountSuccess: "",
  addAccountError: "",

  getAccount: "",
  getAccountSuccess: "",
  getAccountError: "",

  updateAccountSuccess: "",
  updateAccountError: "",

  copyAccountSuccess: "",
  copyAccountError: "",

  multiChangeAccountSuccess: "",
  multiChangeAccountError: "",

  exportChartAccount: "",
  exportChartAccountSuccess: "",
  exportChartAccountError: "",

  pasteChartAccountSuccess: "",
  pasteChartAccountError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get CHART SORT****--------------------------
    case "GET_CHART_SORT_INIT":
      return {
        ...state,
        getChartSorts: "",
        getChartSortsSuccess: "",
        getChartSortsError: "",
      };
    case "GET_CHART_SORT_SUCCESS":
      return {
        ...state,
        getChartSorts: action.payload || "",
        getChartSortsSuccess: action.payload.result[0].description,
      };
    case "GET_CHART_SORT_FAIL":
      return {
        ...state,
        getChartSortsError: action.payload,
      };
    //----------------------****Get CHART CODES****-------------------------
    case "GET_CHART_CODES_INIT":
      return {
        ...state,
        getChartCodes: "",
        getChartCodesSuccess: "",
        getChartCodesError: "",
      };
    case "GET_CHART_CODES_SUCCESS":
      return {
        ...state,
        getChartCodes: action.payload || "",
        getChartCodesSuccess: action.payload.result[0].description,
      };
    case "GET_CHART_CODES_FAIL":
      return {
        ...state,
        getChartCodesError: action.payload,
      };
    //----------------------****Get TAX CODES****----------------------------
    case "GET_TAX_CODES_INIT":
      return {
        ...state,
        getTaxCodes: [],
        getTaxCodesSuccess: "",
        getTaxCodesError: "",
      };
    case "GET_TAX_CODES_SUCCESS":
      return {
        ...state,
        getTaxCodes: action.payload.tax || [],
        getTaxCodesSuccess: action.payload.result[0].description,
      };
    case "GET_TAX_CODES_FAIL":
      return {
        ...state,
        getTaxCodesError: action.payload,
      };
    //----------------------****Get Flags****--------------------------------
    case "GET_FLAGS_INIT":
      return {
        ...state,
        getFlags: "",
        getFlagsSuccess: "",
        getFlagsError: "",
      };
    case "GET_FLAGS_SUCCESS":
      return {
        ...state,
        getFlags: action.payload || "",
        getFlagsSuccess:
          "Flags Get Successfully." || action.payload.result[0].description,
      };
    case "GET_FLAGS_FAIL":
      return {
        ...state,
        getFlagsError: action.payload,
      };
    //----------------------****Get Currencies****---------------------------
    case "GET_CURRENCIES_INIT":
      return {
        ...state,
        getCurrencies: [],
        getCurrenciesSuccess: "",
        getCurrenciesError: "",
      };
    case "GET_CURRENCIES_SUCCESS":
      return {
        ...state,
        getCurrencies: action.payload.currency || [],
        getCurrenciesSuccess: action.payload.result[0].description,
      };
    case "GET_CURRENCIES_FAIL":
      return {
        ...state,
        getCurrenciesError: action.payload,
      };
    //----------------------****Inser Chart Of Accounts Code****-------------
    case "INSERT_CHART_ACCOUNTS_CODE_INIT":
      return {
        ...state,
        insertChartOfAccounts: "",
        insertChartOfAccountsSuccess: "",
        insertChartOfAccountsError: "",
      };
    case "INSERT_CHART_ACCOUNTS_CODE_SUCCESS":
      return {
        ...state,
        insertChartOfAccounts: action.payload,
        insertChartOfAccountsSuccess: action.payload.result[0].description,
      };
    case "INSERT_CHART_ACCOUNTS_CODE_FAIL":
      return {
        ...state,
        insertChartOfAccountsError: action.payload,
      };
    //----------------------****Get CHART Layout****-------------------------
    case "GET_CHART_LAYOUTS_INIT":
      return {
        ...state,
        getChartLayout: "",
        getChartLayoutSuccess: "",
        getChartLayoutError: "",
      };
    case "GET_CHART_LAYOUTS_SUCCESS":
      return {
        ...state,
        getChartLayout: action.payload || "",
        getChartLayoutSuccess: action.payload.result[0].description,
      };
    case "GET_CHART_LAYOUTS_FAIL":
      return {
        ...state,
        getChartLayoutError: action.payload,
      };
    //----------------------****Departments****------------------------------

    //----------------------****Get Departments****--------------------------
    case "GET_DEPARTMENTS_INIT":
      return {
        ...state,
        getDepartments: [],
        getDepartmentsSuccess: "",
        getDepartmentsError: "",
      };
    case "GET_DEPARTMENTS_SUCCESS":
      return {
        ...state,
        getDepartments: action.payload.departments || [],
        getDepartmentsSuccess: action.payload.result[0].description,
      };
    case "GET_DEPARTMENTS_FAIL":
      return {
        ...state,
        getDepartmentsError: action.payload,
      };
    //----------------------****Get Single Department****--------------------
    case "GET_DEPARTMENT_INIT":
      return {
        ...state,
        getDepartment: "",
        getDepartmentSuccess: "",
        getDepartmentError: "",
      };
    case "GET_DEPARTMENT_SUCCESS":
      return {
        ...state,
        getDepartment: action.payload.department || "",
        getDepartmentSuccess: action.payload.result[0].description,
      };
    case "GET_DEPARTMENT_FAIL":
      return {
        ...state,
        getDepartmentError: action.payload,
      };
    //----------------------****Prime Department****--------------------------
    case "PRIME_DEPARTMENT_INIT":
      return {
        ...state,
        primeDepartment: "",
        primeDepartmentSuccess: "",
        primeDepartmentError: "",
      };
    case "PRIME_DEPARTMENT_SUCCESS":
      return {
        ...state,
        primeDepartment: action.payload.department || "",
        primeDepartmentSuccess: action.payload.result[0].description,
      };
    case "PRIME_DEPARTMENT_FAIL":
      return {
        ...state,
        primeDepartmentError: action.payload,
      };
    //----------------------****Add Department****----------------------------
    case "ADD_DEPARTMENT_INIT":
      return {
        ...state,
        addDepartmentSuccess: "",
        addDepartmentError: "",
      };

    case "ADD_DEPARTMENT_SUCCESS":
      return {
        ...state,
        addDepartmentSuccess: action.payload.result[0].description,
      };
    case "ADD_DEPARTMENT_FAIL":
      return {
        ...state,
        addDepartmentError: action.payload,
      };
    //----------------------****Update Department****--------------------------

    case "UPDATE_DEPARTMENT_INIT":
      return {
        ...state,
        updateDepartmentSuccess: "",
        updateDepartmentError: "",
      };
    case "UPDATE_DEPARTMENT_SUCCESS":
      return {
        ...state,
        updateDepartmentSuccess: action.payload.result[0].description,
      };
    case "UPDATE_DEPARTMENT_FAIL":
      return {
        ...state,
        updateDepartmentError: action.payload,
      };
    //----------------------****Delete Department****-------------------------
    case "DELETE_DEPARTMENT_INIT":
      return {
        ...state,
        deleteDepartmentSuccess: "",
        deleteDepartmentError: "",
      };
    case "DELETE_DEPARTMENT_SUCCESS":
      return {
        ...state,
        deleteDepartmentSuccess: action.payload.result[0].description,
      };
    case "DELETE_DEPARTMENT_FAIL":
      return {
        ...state,
        deleteDepartmentError: action.payload,
      };
    //----------------------****END****---------------------------------------

    //----------------------****Chart Setup****------------------------------
    //----------------------****Prime Chart****------------------------------
    case "PRIME_CHART_INIT":
      return {
        ...state,
        primeChart: "",
        primeChartSuccess: "",
        primeChartError: "",
      };
    case "PRIME_CHART_SUCCESS":
      return {
        ...state,
        primeChart: action.payload.chart || "",
        primeChartSuccess: action.payload.result[0].description,
      };
    case "PRIME_CHART_FAIL":
      return {
        ...state,
        primeChartError: action.payload,
      };
    //----------------------****Get Chart****-------------------------------
    case "GET_CHART_INIT":
      return {
        ...state,
        getChart: "",
        getChartSuccess: "",
        getChartError: "",
      };
    case "GET_CHART_SUCCESS":
      return {
        ...state,
        getChart: action.payload.chart || "",
        getChartSuccess: action.payload.result[0].description,
      };
    case "GET_CHART_FAIL":
      return {
        ...state,
        getChartError: action.payload,
      };
    //----------------------****Add Chart****------------------------------
    case "ADD_CHART_INIT":
      return {
        ...state,
        addChartSuccess: "",
        addChartError: "",
      };
    case "ADD_CHART_SUCCESS":
      return {
        ...state,
        addChartSuccess: action.payload.result[0].description,
      };
    case "ADD_CHART_FAIL":
      return {
        ...state,
        addChartError: action.payload,
      };
    //----------------------****Update Chart****-----------------------------
    case "UPDATE_CHART_INIT":
      return {
        ...state,
        updateChartSuccess: "",
        updateChartError: "",
      };
    case "UPDATE_CHART_SUCCESS":
      return {
        ...state,
        updateChartSuccess: action.payload.result[0].description,
      };
    case "UPDATE_CHART_FAIL":
      return {
        ...state,
        updateChartError: action.payload,
      };
    //----------------------****Delete Chart****-----------------------------
    case "DELETE_CHART_INIT":
      return {
        ...state,
        deleteChartSuccess: "",
        deleteChartError: "",
      };
    case "DELETE_CHART_SUCCESS":
      return {
        ...state,
        deleteChartSuccess: action.payload.result[0].description,
      };
    case "DELETE_CHART_FAIL":
      return {
        ...state,
        deleteChartError: action.payload,
      };
    //----------------------****END****---------------------------------------
    //----------------------****Currencies****------------------------------
    //----------------------****Get Currency****----------------------------
    case "GET_CURRENCY_INIT":
      return {
        ...state,
        getCurrency: "",
        getCurrencySuccess: "",
        getCurrencyError: "",
      };
    case "GET_CURRENCY_SUCCESS":
      return {
        ...state,
        getCurrency: action.payload.currency || "",
        getCurrencySuccess: action.payload.result[0].description,
      };
    case "GET_CURRENCY_FAIL":
      return {
        ...state,
        getCurrencyError: action.payload,
      };
    //----------------------****Prime Currency****--------------------------
    case "PRIME_CURRENCY_INIT":
      return {
        ...state,
        primeCurrency: "",
        primeCurrencySuccess: "",
        primeCurrencyError: "",
      };
    case "PRIME_CURRENCY_SUCCESS":
      return {
        ...state,
        primeCurrency: action.payload.currency || "",
        primeCurrencySuccess: action.payload.result[0].description,
      };
    case "PRIME_CURRENCY_FAIL":
      return {
        ...state,
        primeCurrencyError: action.payload,
      };
    //----------------------****Add Currency****--------------------------
    case "ADD_CURRENCY_INIT":
      return {
        ...state,
        addCurrencySuccess: "",
        addCurrencyError: "",
      };
    case "ADD_CURRENCY_SUCCESS":
      return {
        ...state,
        addCurrencySuccess: action.payload.result[0].description,
      };
    case "ADD_CURRENCY_FAIL":
      return {
        ...state,
        addCurrencyError: action.payload,
      };
    //----------------------****Update Currency****--------------------------
    case "UPDATE_CURRENCY_INIT":
      return {
        ...state,
        updateCurrencySuccess: "",
        updateCurrencyError: "",
      };
    case "UPDATE_CURRENCY_SUCCESS":
      return {
        ...state,
        updateCurrencySuccess: action.payload.result[0].description,
      };
    case "UPDATE_CURRENCY_FAIL":
      return {
        ...state,
        updateCurrencyError: action.payload,
      };
    //----------------------****Delete Currency****--------------------------
    case "DELETE_CURRENCY_INIT":
      return {
        ...state,
        deleteCurrencySuccess: "",
        deleteCurrencyError: "",
      };
    case "DELETE_CURRENCY_SUCCESS":
      return {
        ...state,
        deleteCurrencySuccess: action.payload.result[0].description,
      };
    case "DELETE_CURRENCY_FAIL":
      return {
        ...state,
        deleteCurrencyError: action.payload,
      };

    //----------------------****END****------------------------------
    //----------------------****Tracking Codes****------------------------------
    //----------------------****Get Tracking Codes****--------------------------
    case "GET_TRACKING_CODES_INIT":
      return {
        ...state,
        getTrackingCodes: [],
        getTrackingCodesSuccess: "",
        getTrackingCodesError: "",
      };
    case "GET_TRACKING_CODES_SUCCESS":
      return {
        ...state,
        getTrackingCodes: action.payload.trackingCodes || [],
        getTrackingCodesSuccess: action.payload.result[0].description,
      };
    case "GET_TRACKING_CODES_FAIL":
      return {
        ...state,
        getTrackingCodesError: action.payload,
      };
    //----------------------****Get Tracking Code****--------------------------
    case "GET_TRACKING_CODE_INIT":
      return {
        ...state,
        getTrackingCode: "",
        getTrackingCodeSuccess: "",
        getTrackingCodeError: "",
      };
    case "GET_TRACKING_CODE_SUCCESS":
      return {
        ...state,
        getTrackingCode: action.payload.trackingCode || "",
        getTrackingCodeSuccess: action.payload.result[0].description,
      };
    case "GET_TRACKING_CODE_FAIL":
      return {
        ...state,
        getTrackingCodeError: action.payload,
      };
    //----------------------****Update Tracking Code****--------------------------
    case "UPDATE_TRACKING_CODE_INIT":
      return {
        ...state,
        updateTrackingCodeSuccess: "",
        updateTrackingCodeError: "",
      };
    case "UPDATE_TRACKING_CODE_SUCCESS":
      return {
        ...state,
        updateTrackingCodeSuccess: action.payload.result[0].description,
      };
    case "UPDATE_TRACKING_CODE_FAIL":
      return {
        ...state,
        updateTrackingCodeError: action.payload,
      };
    //----------------------****Add Tracking Code****--------------------------
    case "ADD_TRACKING_CODE_INIT":
      return {
        ...state,
        addTrackingCode: "",
        addTrackingCodeSuccess: "",
        addTrackingCodeError: "",
      };
    case "ADD_TRACKING_CODE_SUCCESS":
      return {
        ...state,
        addTrackingCode: action.payload.trackingCode,
        addTrackingCodeSuccess: action.payload.result[0].description,
      };
    case "ADD_TRACKING_CODE_FAIL":
      return {
        ...state,
        addTrackingCodeError: action.payload,
      };
    //----------------------****Delete Tracking Code****--------------------------
    case "DELETE_TRACKING_CODE_INIT":
      return {
        ...state,
        deleteTrackingCodeSuccess: "",
        deleteTrackingCodeError: "",
      };
    case "DELETE_TRACKING_CODE_SUCCESS":
      return {
        ...state,
        deleteTrackingCodeSuccess: action.payload.result[0].description,
      };
    case "DELETE_TRACKING_CODE_FAIL":
      return {
        ...state,
        deleteTrackingCodeError: action.payload,
      };

    //----------------------****Get Tracking Options****--------------------------
    case "GET_TRACKING_OPTIONS_INIT":
      return {
        ...state,
        getTrackingOptions: [],
        getTrackingOptionsSuccess: [],
        getTrackingOptionsError: "",
      };
    case "GET_TRACKING_OPTIONS_SUCCESS":
      return {
        ...state,
        getTrackingOptions: action.payload.trackingOptions || [],
        getTrackingOptionsSuccess: action.payload.result[0].description,
      };
    case "GET_TRACKING_OPTIONS_FAIL":
      return {
        ...state,
        getTrackingOptionsError: action.payload,
      };
    //----------------------****END****------------------------------

    //----------------------****Indirect Tax Codes****------------------------------
    //----------------------****Get Tax Flag****--------------------------
    case "GET_TAX_FLAG_INIT":
      return {
        ...state,
        getTaxFlag: "",
        getTaxFlagSuccess: "",
        getTaxFlagError: "",
      };
    case "GET_TAX_FLAG_SUCCESS":
      return {
        ...state,
        getTaxFlag: action.payload.taxFlag || "",
        getTaxFlagSuccess: action.payload.result[0].description,
      };
    case "GET_TAX_FLAG_FAIL":
      return {
        ...state,
        getTaxFlagError: action.payload,
      };
    //----------------------****Prime Tax Flag****--------------------------
    case "PRIME_TAX_FLAG_INIT":
      return {
        ...state,
        primeTaxFlag: "",
        primeTaxFlagSuccess: "",
        primeTaxFlagError: "",
      };
    case "PRIME_TAX_FLAG_SUCCESS":
      return {
        ...state,
        primeTaxFlag: action.payload.taxFlag || "",
        primeTaxFlagSuccess: action.payload.result[0].description,
      };
    case "PRIME_TAX_FLAG_FAIL":
      return {
        ...state,
        primeTaxFlagError: action.payload,
      };
    //----------------------****Insert Tax Flag****--------------------------
    case "INSERT_TAX_FLAG_INIT":
      return {
        ...state,
        insertTaxFlagSuccess: "",
        insertTaxFlagError: "",
      };
    case "INSERT_TAX_FLAG_SUCCESS":
      return {
        ...state,
        insertTaxFlagSuccess: action.payload.result[0].description,
      };
    case "INSERT_TAX_FLAG_FAIL":
      return {
        ...state,
        insertTaxFlagError: action.payload,
      };
    //----------------------****Update Tax Flag****--------------------------
    case "UPDATE_TAX_FLAG_INIT":
      return {
        ...state,
        updateTaxFlagSuccess: "",
        updateTaxFlagError: "",
      };
    case "UPDATE_TAX_FLAG_SUCCESS":
      return {
        ...state,
        updateTaxFlagSuccess: action.payload.result[0].description,
      };
    case "UPDATE_TAX_FLAG_FAIL":
      return {
        ...state,
        updateTaxFlagError: action.payload,
      };
    //----------------------****Delete Tax Flag****--------------------------
    case "DELETE_TAX_FLAG_INIT":
      return {
        ...state,
        deleteTaxFlagSuccess: "",
        deleteTaxFlagError: "",
      };
    case "DELETE_TAX_FLAG_SUCCESS":
      return {
        ...state,
        deleteTaxFlagSuccess: action.payload.result[0].description,
      };
    case "DELETE_TAX_FLAG_FAIL":
      return {
        ...state,
        deleteTaxFlagError: action.payload,
      };
    //----------------------****END****------------------------------

    //-----------------------GET CHART ACCOUNTS----------------------

    case "GET_CHART_ACCOUNTS_INIT":
      return {
        ...state,
        getChartAccounts: [],
        getChartAccountsSuccess: "",
        getChartAccountsError: "",
      };
    case "GET_CHART_ACCOUNTS_SUCCESS":
      return {
        ...state,
        getChartAccounts: action.payload.chartAccounts || [],
        getChartAccountsSuccess: action.payload.result[0].description,
      };
    case "GET_CHART_ACCOUNTS_FAIL":
      return {
        ...state,
        getChartAccountsError: action.payload,
      };

    //DELETE CHART ACCOUNT

    case "DELETE_CHART_ACCOUNT_INIT":
      return {
        ...state,
        deleteChartAccountSuccess: "",
        deleteChartAccountError: "",
      };
    case "DELETE_CHART_ACCOUNT_SUCCESS":
      return {
        ...state,
        deleteChartAccountSuccess: action.payload.result[0].description,
      };
    case "DELETE_CHART_ACCOUNT_FAIL":
      return {
        ...state,
        deleteChartAccountError: action.payload,
      };
    //--------------------Prime Account-----------------------

    case "PRIME_ACCOUNT_INIT":
      return {
        ...state,
        primeAccount: "",
        primeAccountSuccess: "",
        primeAccountError: "",
      };
    case "PRIME_ACCOUNT_SUCCESS":
      return {
        ...state,
        primeAccount: action.payload.chartAccount || "",
        primeAccountSuccess: action.payload.result[0].description,
      };
    case "PRIME_ACCOUNT_FAIL":
      return {
        ...state,
        primeAccountError: action.payload,
      };
    //------------------------Add Account----------------------

    case "ADD_ACCOUNT_INIT":
      return {
        ...state,
        addAccountSuccess: "",
        addAccountError: "",
      };

    case "ADD_ACCOUNT_SUCCESS":
      return {
        ...state,
        addAccountSuccess: action.payload.result[0].description,
      };
    case "ADD_ACCOUNT_FAIL":
      return {
        ...state,
        addAccountError: action.payload,
      };

    //------------------GET ACCOUNT----------------------------

    case "GET_ACCOUNT_INIT":
      return {
        ...state,
        getAccount: "",
        getAccountSuccess: "",
        getAccountError: "",
      };
    case "GET_ACCOUNT_SUCCESS":
      return {
        ...state,
        getAccount: action.payload.chartAccount || "",
        getAccountSuccess: action.payload.result[0].description,
      };
    case "GET_ACCOUNT_FAIL":
      return {
        ...state,
        getAccountError: action.payload,
      };
    //--------------------UPDATE ACCOUNT------------------------

    case "UPDATE_ACCOUNT_INIT":
      return {
        ...state,
        updateAccountSuccess: "",
        updateAccountError: "",
      };
    case "UPDATE_ACCOUNT_SUCCESS":
      return {
        ...state,
        updateAccountSuccess: action.payload.result[0].description,
      };
    case "UPDATE_ACCOUNT_FAIL":
      return {
        ...state,
        updateAccountError: action.payload,
      };

    //----------------------COPY ACCOUNT-----------------------

    case "COPY_ACCOUNT_INIT":
      return {
        ...state,
        copyAccountSuccess: "",
        copyAccountError: "",
      };
    case "COPY_ACCOUNT_SUCCESS":
      return {
        ...state,
        copyAccountSuccess: action.payload.result[0].description,
      };
    case "COPY_ACCOUNT_FAIL":
      return {
        ...state,
        copyAccountError: action.payload,
      };

    //---------------------------MULTI CHANGE ACCOUNT--------------

    case "MULTIPLE_CHANGE_ACCOUNT_INIT":
      return {
        ...state,
        multiChangeAccountSuccess: "",
        multiChangeAccountError: "",
      };
    case "MULTIPLE_CHANGE_ACCOUNT_SUCCESS":
      return {
        ...state,
        multiChangeAccountSuccess: action.payload.result[0].description,
      };
    case "MULTIPLE_CHANGE_ACCOUNT_FAIL":
      return {
        ...state,
        multiChangeAccountError: action.payload,
      };

    //--------------------------------EXPORT CHART ACCOUNT----------------

    case "EXPORT_CHART_ACCOUNT_INIT":
      return {
        ...state,
        exportChartAccount: "",
        exportChartAccountSuccess: "",
        exportChartAccountError: "",
      };
    case "EXPORT_CHART_ACCOUNT_SUCCESS":
      return {
        ...state,
        exportChartAccount: action.payload.export || "",
        exportChartAccountSuccess: action.payload.result[0].description,
      };
    case "EXPORT_CHART_ACCOUNT_FAIL":
      return {
        ...state,
        exportChartAccountError: action.payload,
      };
    //--------------------------PASTE CHART ACCOUNT----------------------------

    case "PASTE_ACCOUNT_INIT":
      return {
        ...state,
        pasteChartAccountSuccess: "",
        pasteChartAccountError: "",
      };
    case "PASTE_ACCOUNT_SUCCESS":
      return {
        ...state,
        pasteChartAccountSuccess: action.payload.result[0].description,
      };
    case "PASTE_ACCOUNT_FAIL":
      return {
        ...state,
        pasteChartAccountError: action.payload,
      };

    //----------------------****Clear States When Producton Login****---------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getChartSorts: "",
        getChartSortsSuccess: "",
        getChartSortsError: "",

        getChartCodes: "",
        getChartCodesSuccess: "",
        getChartCodesError: "",

        getTaxCodes: [],
        getTaxCodesSuccess: "",
        getTaxCodesError: "",

        getFlags: "",
        getFlagsSuccess: "",
        getFlagsError: "",

        getCurrencies: [],
        getCurrenciesSuccess: "",
        getCurrenciesError: "",

        insertChartOfAccounts: "",
        insertChartOfAccountsSuccess: "",
        insertChartOfAccountsError: "",

        getChartLayout: "",
        getChartLayoutSuccess: "",
        getChartLayoutError: "",

        getDepartments: [],
        getDepartmentsSuccess: "",
        getDepartmentsError: "",

        getDepartment: "",
        getDepartmentSuccess: "",
        getDepartmentError: "",

        primeDepartment: "",
        primeDepartmentSuccess: "",
        primeDepartmentError: "",

        addDepartmentSuccess: "",
        addDepartmentError: "",

        updateDepartmentSuccess: "",
        updateDepartmentError: "",

        deleteDepartmentSuccess: "",
        deleteDepartmentError: "",

        primeChart: "",
        primeChartSuccess: "",
        primeChartError: "",

        getChart: "",
        getChartSuccess: "",
        getChartError: "",

        addChartSuccess: "",
        addChartError: "",

        updateChartSuccess: "",
        updateChartError: "",

        deleteChartSuccess: "",
        deleteChartError: "",

        getCurrency: "",
        getCurrencySuccess: "",
        getCurrencyError: "",

        primeCurrency: "",
        primeCurrencySuccess: "",
        primeCurrencyError: "",

        addCurrencySuccess: "",
        addCurrencyError: "",

        updateCurrencySuccess: "",
        updateCurrencyError: "",

        deleteCurrencySuccess: "",
        deleteCurrencyError: "",

        getTrackingCodes: [],
        getTrackingCodesSuccess: "",
        getTrackingCodesError: "",

        getTrackingCode: "",
        getTrackingCodeSuccess: "",
        getTrackingCodeError: "",

        updateTrackingCodeSuccess: "",
        updateTrackingCodeError: "",

        addTrackingCode: "",
        addTrackingCodeSuccess: "",
        addTrackingCodeError: "",

        deleteTrackingCodeSuccess: "",
        deleteTrackingCodeError: "",

        getTrackingOptions: [],
        getTrackingOptionsSuccess: "",
        getTrackingOptionsError: "",

        getTaxFlag: "",
        getTaxFlagSuccess: "",
        getTaxFlagError: "",

        primeTaxFlag: "",
        primeTaxFlagSuccess: "",
        primeTaxFlagError: "",

        insertTaxFlagSuccess: "",
        insertTaxFlagError: "",

        updateTaxFlagSuccess: "",
        updateTaxFlagError: "",

        deleteTaxFlagSuccess: "",
        deleteTaxFlagError: "",

        getChartAccounts: [],
        getChartAccountsSuccess: "",
        getChartAccountsError: "",

        deleteChartAccountSuccess: "",
        deleteChartAccountError: "",

        primeAccount: "",
        primeAccountSuccess: "",
        primeAccountError: "",

        addAccountSuccess: "",
        addAccountError: "",

        getAccount: "",
        getAccountSuccess: "",
        getAccountError: "",

        updateAccountSuccess: "",
        updateAccountError: "",

        copyAccountSuccess: "",
        copyAccountError: "",

        multiChangeAccountSuccess: "",
        multiChangeAccountError: "",

        exportChartAccount: "",
        exportChartAccountSuccess: "",
        exportChartAccountError: "",

        pasteChartAccountSuccess: "",
        pasteChartAccountError: "",
      };

    //----------------------****Clear States After Logout****---------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        getChartSorts: "",
        getChartSortsSuccess: "",
        getChartSortsError: "",

        getChartCodes: "",
        getChartCodesSuccess: "",
        getChartCodesError: "",

        getTaxCodes: [],
        getTaxCodesSuccess: "",
        getTaxCodesError: "",

        getFlags: "",
        getFlagsSuccess: "",
        getFlagsError: "",

        getCurrencies: [],
        getCurrenciesSuccess: "",
        getCurrenciesError: "",

        insertChartOfAccounts: "",
        insertChartOfAccountsSuccess: "",
        insertChartOfAccountsError: "",

        getChartLayout: "",
        getChartLayoutSuccess: "",
        getChartLayoutError: "",

        getDepartments: [],
        getDepartmentsSuccess: "",
        getDepartmentsError: "",

        getDepartment: "",
        getDepartmentSuccess: "",
        getDepartmentError: "",

        primeDepartment: "",
        primeDepartmentSuccess: "",
        primeDepartmentError: "",

        addDepartmentSuccess: "",
        addDepartmentError: "",

        updateDepartmentSuccess: "",
        updateDepartmentError: "",

        deleteDepartmentSuccess: "",
        deleteDepartmentError: "",

        primeChart: "",
        primeChartSuccess: "",
        primeChartError: "",

        getChart: "",
        getChartSuccess: "",
        getChartError: "",

        addChartSuccess: "",
        addChartError: "",

        updateChartSuccess: "",
        updateChartError: "",

        deleteChartSuccess: "",
        deleteChartError: "",

        getCurrency: "",
        getCurrencySuccess: "",
        getCurrencyError: "",

        primeCurrency: "",
        primeCurrencySuccess: "",
        primeCurrencyError: "",

        addCurrencySuccess: "",
        addCurrencyError: "",

        updateCurrencySuccess: "",
        updateCurrencyError: "",

        deleteCurrencySuccess: "",
        deleteCurrencyError: "",

        getTrackingCodes: [],
        getTrackingCodesSuccess: "",
        getTrackingCodesError: "",

        getTrackingCode: "",
        getTrackingCodeSuccess: "",
        getTrackingCodeError: "",

        updateTrackingCodeSuccess: "",
        updateTrackingCodeError: "",

        addTrackingCode: "",
        addTrackingCodeSuccess: "",
        addTrackingCodeError: "",

        deleteTrackingCodeSuccess: "",
        deleteTrackingCodeError: "",

        getTrackingOptions: [],
        getTrackingOptionsSuccess: "",
        getTrackingOptionsError: "",

        getTaxFlag: "",
        getTaxFlagSuccess: "",
        getTaxFlagError: "",

        primeTaxFlag: "",
        primeTaxFlagSuccess: "",
        primeTaxFlagError: "",

        insertTaxFlagSuccess: "",
        insertTaxFlagError: "",

        updateTaxFlagSuccess: "",
        updateTaxFlagError: "",

        deleteTaxFlagSuccess: "",
        deleteTaxFlagError: "",

        getChartAccounts: [],
        getChartAccountsSuccess: "",
        getChartAccountsError: "",

        deleteChartAccountSuccess: "",
        deleteChartAccountError: "",

        primeAccount: "",
        primeAccountSuccess: "",
        primeAccountError: "",

        addAccountSuccess: "",
        addAccountError: "",

        getAccount: "",
        getAccountSuccess: "",
        getAccountError: "",

        updateAccountSuccess: "",
        updateAccountError: "",

        copyAccountSuccess: "",
        copyAccountError: "",

        multiChangeAccountSuccess: "",
        multiChangeAccountError: "",

        exportChartAccount: "",
        exportChartAccountSuccess: "",
        exportChartAccountError: "",

        pasteChartAccountSuccess: "",
        pasteChartAccountError: "",
      };
    //----------------------****Clear Chart States****-----------------------------
    case "CLEAR_CHART_STATES":
      return {
        ...state,
        getChartSortsSuccess: "",
        getChartSortsError: "",

        getChartCodesSuccess: "",
        getChartCodesError: "",

        getTaxCodesSuccess: "",
        getTaxCodesError: "",

        getFlagsSuccess: "",
        getFlagsError: "",

        getCurrenciesSuccess: "",
        getCurrenciesError: "",

        insertChartOfAccountsSuccess: "",
        insertChartOfAccountsError: "",

        getChartLayoutSuccess: "",
        getChartLayoutError: "",

        getDepartmentsSuccess: "",
        getDepartmentsError: "",

        getDepartmentSuccess: "",
        getDepartmentError: "",

        primeDepartmentSuccess: "",
        primeDepartmentError: "",

        addDepartmentSuccess: "",
        addDepartmentError: "",

        updateDepartmentSuccess: "",
        updateDepartmentError: "",

        deleteDepartmentSuccess: "",
        deleteDepartmentError: "",

        primeChartSuccess: "",
        primeChartError: "",

        getChartSuccess: "",
        getChartError: "",

        addChartSuccess: "",
        addChartError: "",

        updateChartSuccess: "",
        updateChartError: "",

        deleteChartSuccess: "",
        deleteChartError: "",

        getCurrencySuccess: "",
        getCurrencyError: "",

        primeCurrencySuccess: "",
        primeCurrencyError: "",

        addCurrencySuccess: "",
        addCurrencyError: "",

        updateCurrencySuccess: "",
        updateCurrencyError: "",

        deleteCurrencySuccess: "",
        deleteCurrencyError: "",

        getTrackingCodesSuccess: "",
        getTrackingCodesError: "",

        getTrackingCodeSuccess: "",
        getTrackingCodeError: "",

        updateTrackingCodeSuccess: "",
        updateTrackingCodeError: "",

        addTrackingCodeSuccess: "",
        addTrackingCodeError: "",

        deleteTrackingCodeSuccess: "",
        deleteTrackingCodeError: "",

        getTrackingOptionsSuccess: "",
        getTrackingOptionsError: "",

        getTaxFlagSuccess: "",
        getTaxFlagError: "",

        primeTaxFlagSuccess: "",
        primeTaxFlagError: "",

        insertTaxFlagSuccess: "",
        insertTaxFlagError: "",

        updateTaxFlagSuccess: "",
        updateTaxFlagError: "",

        deleteTaxFlagSuccess: "",
        deleteTaxFlagError: "",

        getChartAccountsSuccess: "",
        getChartAccountsError: "",

        deleteChartAccountSuccess: "",
        deleteChartAccountError: "",

        primeAccountSuccess: "",
        primeAccountError: "",

        addAccountSuccess: "",
        addAccountError: "",

        getAccountSuccess: "",
        getAccountError: "",

        updateAccountSuccess: "",
        updateAccountError: "",

        copyAccountSuccess: "",
        copyAccountError: "",

        multiChangeAccountSuccess: "",
        multiChangeAccountError: "",

        exportChartAccountSuccess: "",
        exportChartAccountError: "",

        pasteChartAccountSuccess: "",
        pasteChartAccountError: "",
      };
    default:
      return state;
  }
}
