const INIT_STATE = {
    getPayments: [],
    getPaymentsSuccess: "",
    getPaymentsError: "",

    getPaymentDetails: [],
    getPaymentDetailsSuccess: "",
    getPaymentDetailsError: "",

    exportPayments: '',
    exportPaymentsSuccess: "",
    exportPaymentsError: "",

};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        //----------------------****Get Payments****-----------------------------
        case "GET_PAYMENTS_INIT":
            return {
                ...state,
                getPayments: [],
                getPaymentsSuccess: "",
                getPaymentsError: "",
            };
        case "GET_PAYMENTS_SUCCESS":
            return {
                ...state,
                getPayments: action.payload.payments || [],
                getPaymentsSuccess: action.payload.result[0].description,
            };
        case "GET_PAYMENTS_FAIL":
            return {
                ...state,
                getPaymentsError: action.payload,
            };
        //----------------------****Get Payments Details****-----------------------------
        case "GET_PAYMENT_DETAILS_INIT":
            return {
                ...state,
                getPaymentDetails: [],
                getPaymentDetailsSuccess: "",
                getPaymentDetailsError: "",
            };
        case "GET_PAYMENT_DETAILS_SUCCESS":
            return {
                ...state,
                getPaymentDetails: action.payload.paymentDetails || [],
                getPaymentDetailsSuccess: action.payload.result[0].description,
            };
        case "GET_PAYMENT_DETAILS_FAIL":
            return {
                ...state,
                getPaymentDetailsError: action.payload,
            };

        //----------------------****Export Payments****-----------------------------
        case "EXPORT_PAYMENTS_INIT":
            return {
                ...state,
                exportPayments: '',
                exportPaymentsSuccess: "",
                exportPaymentsError: ""
            };
        case "EXPORT_PAYMENTS_SUCCESS":
            return {
                ...state,
                exportPayments: action.payload.export || '',
                exportPaymentsSuccess: action.payload.result[0].description,
            };
        case "EXPORT_PAYMENTS_FAIL":
            return {
                ...state,
                exportPaymentsError: action.payload,
            };

        //----------------------****Clear States When Producton Login****--------------------
        case "CLEAR_STATES_WHEN_LOGIN_PRODUCTION":
            //when user login production on dashboard then remove data of previous Production
            return {
                ...state,
                getPayments: [],
                getPaymentsSuccess: "",
                getPaymentsError: "",

                getPaymentDetails: [],
                getPaymentDetailsSuccess: "",
                getPaymentDetailsError: "",

                exportPayments: '',
                exportPaymentsSuccess: "",
                exportPaymentsError: ""
            };
        //----------------------****Clear States After Logout****-----------------------------
        case "CLEAR_STATES_AFTER_LOGOUT":
            return {
                ...state,
                getPayments: [],
                getPaymentsSuccess: "",
                getPaymentsError: "",

                getPaymentDetails: [],
                getPaymentDetailsSuccess: "",
                getPaymentDetailsError: "",

                exportPayments: '',
                exportPaymentsSuccess: "",
                exportPaymentsError: "",


            };
        //----------------------****Clear Payments States****-----------------------------
        case "CLEAR_PAYMENT_STATES":
            return {
                ...state,
                getPaymentsSuccess: "",
                getPaymentsError: "",

                getPaymentDetailsSuccess: "",
                getPaymentDetailsError: "",

                exportPayments: '',
                exportPaymentsSuccess: "",
                exportPaymentsError: "",

            };
        default:
            return state
    }
}
