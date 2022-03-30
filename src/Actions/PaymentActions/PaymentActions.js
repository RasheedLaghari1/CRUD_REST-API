
const Axios = require("axios");

Axios.defaults.withCredentials = true;

// ---------------------****Payments Actions****-----------------------------

//----------------------****Get Payments*****-------------------------------
export const getPayments = ({ currency, supplierCode }) => async (dispatch) => {
    dispatch({
        type: "GET_PAYMENTS_INIT",
    });
    const url =
        localStorage.getItem("API_URL") +
        `/DPFAPI/PaymentRequest?actionType=GetPayments&currency=${currency}&supplierCode=${supplierCode}`;

    try {
        let result = await Axios.get(url);
        let res =
            (result && result.data && result.data.PaymentResponse) || "";
        if (res && res.result.length > 0) {
            if (
                res.result[0] &&
                res.result[0].status === "Success"
            ) {
                dispatch({
                    type: "GET_PAYMENTS_SUCCESS",
                    payload: res,
                });
            } else {
                dispatch({
                    type: "GET_PAYMENTS_FAIL",
                    payload:
                        res.result[0].description ||
                        "Error While Getting Payments.",
                });
            }
        } else {
            dispatch({
                type: "GET_PAYMENTS_FAIL",
                payload: "Error While Getting Payments.",
            });
        }
    } catch (err) {
        const error = err.message || "Error While Getting Payments.";
        dispatch({
            type: "GET_PAYMENTS_FAIL",
            payload: error,
        });
    }
};
//----------------------****Get Payments Detail*****------------------------
export const getPaymentDetails = (chequeIDs) => async (dispatch) => {
    dispatch({
        type: "GET_PAYMENT_DETAILS_INIT",
    });
    const url =
        localStorage.getItem("API_URL") +
        `/DPFAPI/PaymentRequest?actionType=GetPaymentDetails&chequeID=[${chequeIDs}]`;

    try {
        let result = await Axios.get(url);
        let res =
            (result && result.data && result.data.PaymentResponse) || "";
        if (res && res.result.length > 0) {
            if (
                res.result[0] &&
                res.result[0].status === "Success"
            ) {
                dispatch({
                    type: "GET_PAYMENT_DETAILS_SUCCESS",
                    payload: res,
                });
            } else {
                dispatch({
                    type: "GET_PAYMENT_DETAILS_FAIL",
                    payload:
                        res.result[0].description ||
                        "Error While Getting Payment Details.",
                });
            }
        } else {
            dispatch({
                type: "GET_PAYMENT_DETAILS_FAIL",
                payload: "Error While Getting Payment Details.",
            });
        }
    } catch (err) {
        const error = err.message || "Error While Getting Payment Details.";
        dispatch({
            type: "GET_PAYMENT_DETAILS_FAIL",
            payload: error,
        });
    }
};
//----------------------****Export Payments*****-----------------------------
export const exportPayments = (chequeIDs) => async (dispatch) => {
    dispatch({
        type: "EXPORT_PAYMENTS_INIT",
    });
    const url = localStorage.getItem("API_URL") + '/DPFAPI/PaymentRequest'

    let obj = {
        actionType: "ExportPayments",
        chequeIDs
    }
    try {
        let result = await Axios.post(url, obj);
        let res =
            (result && result.data && result.data.PaymentResponse) || "";
        if (res && res.result.length > 0) {
            if (
                res.result[0] &&
                res.result[0].status === "Success"
            ) {
                dispatch({
                    type: "EXPORT_PAYMENTS_SUCCESS",
                    payload: res,
                });
            } else {
                dispatch({
                    type: "EXPORT_PAYMENTS_FAIL",
                    payload:
                        res.result[0].description ||
                        "Error While Exporting Payments.",
                });
            }
        } else {
            dispatch({
                type: "EXPORT_PAYMENTS_FAIL",
                payload: "Error While Exporting Payments.",
            });
        }
    } catch (err) {
        const error = err.message || "Error While Exporting Payments.";
        dispatch({
            type: "EXPORT_PAYMENTS_FAIL",
            payload: error,
        });
    }
};
//----------------------****Clear Payment States In Store****-----------------
export function clearPaymentStates() {
    return async (dispatch) => {
        dispatch({
            type: "CLEAR_PAYMENT_STATES",
        });
    };
}
