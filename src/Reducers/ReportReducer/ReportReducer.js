const INIT_STATE = {
  getReportTypes: [],
  getReportTypesSuccess: "",
  getReportTypesError: "",

  getReportOptions: [],
  getReportOptionsSuccess: "",
  getReportOptionsError: "",

  getReportSettings: [],
  getReportSettingsSuccess: "",
  getReportSettingsError: "",

  getReportData: "",
  getReportDataSuccess: "",
  getReportDataError: "",

  deleteReport: [],
  deleteReportSuccess: "",
  deleteReportError: "",

  primePost: "",
  primePostSuccess: "",
  primePostError: "",
};

export default function (state = INIT_STATE, action) {
  switch (action.type) {
    //----------------------****Get Report Types****-----------------------------
    case "GET_REPORT_TYPES_INIT":
      return {
        ...state,
        getReportTypes: [],
        getReportTypesSuccess: "",
        getReportTypesError: "",
      };
    case "GET_REPORT_TYPES_SUCCESS":
      return {
        ...state,
        getReportTypes: action.payload.reportTypes || [],
        getReportTypesSuccess: action.payload.result[0].description,
      };
    case "GET_REPORT_TYPES_FAIL":
      return {
        ...state,
        getReportTypesError: action.payload,
      };
    //----------------------****Get Report Optons****-----------------------------
    case "GET_REPORT_OPTIONS_INIT":
      return {
        ...state,
        getReportOptions: [],
        getReportOptionsSuccess: "",
        getReportOptionsError: "",
      };
    case "GET_REPORT_OPTIONS_SUCCESS":
      return {
        ...state,
        getReportOptions: action.payload.reportAreas || [],
        getReportOptionsSuccess: action.payload.result[0].description,
      };
    case "GET_REPORT_OPTIONS_FAIL":
      return {
        ...state,
        getReportOptionsError: action.payload,
      };
    //----------------------****Get Report Settings****-----------------------------
    case "GET_REPORT_SETTINGS_INIT":
      return {
        ...state,
        getReportSettings: [],
        getReportSettingsSuccess: "",
        getReportSettingsError: "",
      };
    case "GET_REPORT_SETTINGS_SUCCESS":
      return {
        ...state,
        getReportSettings: action.payload.reportSettings || [],
        getReportSettingsSuccess: action.payload.result[0].description,
      };
    case "GET_REPORT_SETTINGS_FAIL":
      return {
        ...state,
        getReportSettingsError: action.payload,
      };
    //----------------------****Get Report Data****-----------------------------
    case "GET_REPORT_DATA_INIT":
      return {
        ...state,
        getReportData: "",
        getReportDataSuccess: "",
        getReportDataError: "",
      };
    case "GET_REPORT_DATA_SUCCESS":
      return {
        ...state,
        getReportData: action.payload || "",
        getReportDataSuccess: action.payload.result[0].description,
      };
    case "GET_REPORT_DATA_FAIL":
      return {
        ...state,
        getReportDataError: action.payload,
      };
    //----------------------****Delete Report****-----------------------------
    case "DELETE_REPORT_INIT":
      return {
        ...state,
        deleteReport: [],
        deleteReportSuccess: "",
        deleteReportError: "",
      };
    case "DELETE_REPORT_SUCCESS":
      return {
        ...state,
        deleteReport: action.payload.reports || [],
        deleteReportSuccess: action.payload.result[0].description,
      };
    case "DELETE_REPORT_FAIL":
      return {
        ...state,
        deleteReportError: action.payload,
      };

    //----------------------****Prime Post****-----------------------------
    case "PRIME_POST_INIT":
      return {
        ...state,
        primePost: "",
        primePostSuccess: "",
        primePostError: "",
      };
    case "PRIME_POST_SUCCESS":
      return {
        ...state,
        primePost: action.payload || "",
        primePostSuccess: action.payload.result[0].description,
      };
    case "PRIME_POST_FAIL":
      return {
        ...state,
        primePostError: action.payload,
      };
    //----------------------****Clear States When Producton Login****--------------------
    case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
      //when user login production on dashboard then remove data of previous Production
      return {
        ...state,
        getReportTypes: [],
        getReportTypesSuccess: "",
        getReportTypesError: "",

        getReportOptions: [],
        getReportOptionsSuccess: "",
        getReportOptionsError: "",

        getReportSettings: [],
        getReportSettingsSuccess: "",
        getReportSettingsError: "",

        getReportData: "",
        getReportDataSuccess: "",
        getReportDataError: "",

        deleteReport: [],
        deleteReportSuccess: "",
        deleteReportError: "",

        primePost: "",
        primePostSuccess: "",
        primePostError: "",
      };
    //----------------------****Clear States After Logout****-----------------------------
    case "CLEAR_STATES_AFTER_LOGOUT":
      return {
        ...state,
        getReportTypes: [],
        getReportTypesSuccess: "",
        getReportTypesError: "",

        getReportOptions: [],
        getReportOptionsSuccess: "",
        getReportOptionsError: "",

        getReportSettings: [],
        getReportSettingsSuccess: "",
        getReportSettingsError: "",

        getReportData: "",
        getReportDataSuccess: "",
        getReportDataError: "",

        deleteReport: [],
        deleteReportSuccess: "",
        deleteReportError: "",

        primePost: "",
        primePostSuccess: "",
        primePostError: "",
      };
    //----------------------****Clear Report States****-----------------------------
    case "CLEAR_REPORTS_STATES":
      return {
        ...state,
        getReportTypesSuccess: "",
        getReportTypesError: "",

        getReportOptionsSuccess: "",
        getReportOptionsError: "",

        getReportSettingsSuccess: "",
        getReportSettingsError: "",

        getReportDataSuccess: "",
        getReportDataError: "",

        deleteReportSuccess: "",
        deleteReportError: "",

        primePostSuccess: "",
        primePostError: "",
      };
    default:
      return state;
  }
}
