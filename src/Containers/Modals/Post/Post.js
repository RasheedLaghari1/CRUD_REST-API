import React, { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { handleAPIErr } from "../../../Utils/Helpers";
import { handleValidation, handleWholeValidation } from "../../../Utils/Validation";

import { primePost, clearReportsStates } from '../../../Actions/ReportsActions/ReportsActions'

const Post = (props) => {
    const [state, setState] = useState({
        isLoading: false,
        period: '',
        periodOptions: [],
        reportID: '',
        reportOptions: [],
        generateReport: false,
        formErrors: {
            period: '',
            reportID: ''
        }
    });

    const dispatch = useDispatch();
    const reportState = useSelector((state) => state.report);

    //calling primePost API
    useEffect(() => {
        if (props.openPostModal) {
            primePst()
        } else {
            clearStates()
        }
    }, [props.openPostModal])

    const primePst = async () => {
        setState((prev) => ({ ...prev, isLoading: true }))

        await dispatch(primePost(props.postType))

        setState((prev) => ({ ...prev, isLoading: false }))
    }

    //primePost success OR error case
    useEffect(() => {

        if (reportState.primePostSuccess) {
            toast.success(reportState.primePostSuccess);

            let periods = reportState.primePost.periods || []
            let reports = reportState.primePost.reports || []
            let periodOptions = []
            let reportOptions = []

            periods.map((p, i) => {
                periodOptions.push({ label: p, value: p })
            })

            reports.map((r, i) => {
                reportOptions.push({ label: r.layout, value: r.id })
            })

            setState((prev) => ({
                ...prev,
                periodOptions,
                reportOptions

            }))
            dispatch(clearReportsStates())
        }
        if (reportState.primePostError) {
            handleAPIErr(reportState.primePostError, props.locationProps);
            dispatch(clearReportsStates())
        }
    }, [reportState])

    const handlePeriods = (p) => {
        let {
            formErrors
        } = state
        formErrors = handleValidation("period", p.value, formErrors);
        setState((prev) => ({ ...prev, period: p.value, formErrors }))
    }
    const handleReport = (r) => {
        let {
            formErrors
        } = state
        formErrors = handleValidation("reportID", r.value, formErrors);
        setState((prev) => ({ ...prev, reportID: r.value, formErrors }))
    }

    const clearStates = () => {
        setState({
            isLoading: false,
            period: '',
            periodOptions: [],
            reportID: '',
            reportOptions: [],
            generateReport: false,
            formErrors: {
                period: '',
                reportID: ''
            }
        })
        props.closeModal("openPostModal")
    }
    const onSave = async () => {
        let {
            period,
            reportID,
            formErrors
        } = state

        formErrors = handleWholeValidation(
            { period, reportID },
            formErrors
        );

        if (!formErrors.period && !formErrors.reportID) {
            await props.onSave(state)
        }
        setState((prev) => ({ ...prev, formErrors }));
    }
    let {
        periodOptions,
        reportOptions,
        generateReport,
        formErrors
    } = state

    return <>
        {state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.openPostModal}
            onHide={clearStates}
            className="forgot_email_modal modal_704 mx-auto"
        >
            <Modal.Body>
                <div className="container-fluid ">
                    <div className="main_wrapper p-10">
                        <div className="row d-flex h-100">
                            <div className="col-12 justify-content-center align-self-center form_mx_width">
                                <div className="forgot_form_main">
                                    <div className="forgot_header">
                                        <div className="modal-top-header">
                                            <div className="row bord-btm">
                                                <div className="col-auto pl-0">
                                                    <h6 className="text-left def-blue">Post</h6>
                                                </div>

                                                <div className="col d-flex justify-content-end s-c-main">
                                                    <button
                                                        onClick={onSave}
                                                        type="button"
                                                        className="btn-save"
                                                    >
                                                        <span className="fa fa-check"></span>
                                                    Save
                                                    </button>
                                                    <button
                                                        onClick={clearStates}
                                                        type="button"
                                                        className="btn-save"
                                                    >
                                                        <span className="fa fa-ban"></span>
                                                    Discard
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="forgot_body px-3">
                                        <div className="row mt-4">
                                            <div className="col-md-12">
                                                <div className="custon_select">
                                                    <label>Period</label>
                                                    <Select
                                                        className="width-selector"
                                                        defaultValue={{ label: 'Select Period', value: ' ' }}
                                                        classNamePrefix="custon_select-selector-inner"
                                                        options={periodOptions}
                                                        onChange={handlePeriods}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            border: 0,
                                                            borderRadius: 0,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: "#f2f2f2",
                                                                primary: "#f2f2f2",
                                                            },
                                                        })}
                                                    />
                                                    <div className="text-danger error-12">
                                                        {formErrors.period !== ""
                                                            ? formErrors.period
                                                            : ""}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-12 align-self-center mb-2">
                                                <div className="form-group remember_check">
                                                    <input
                                                        type="checkbox"
                                                        id="excel"
                                                        onClick={(p) => setState((prev) => ({ ...prev, generateReport: !prev.generateReport }))}
                                                        checked={generateReport}
                                                    />
                                                    <label htmlFor="excel"></label>
                                                    <p className="reports-excel">
                                                        Create Posting Report:
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="form-group col-md-12">
                                                {/* dropdown coding start */}
                                                <div className="custon_select">
                                                    <Select
                                                        className="width-selector"
                                                        closeMenuOnSelect={true}
                                                        defaultValue={{ label: 'Select Report', value: ' ' }}
                                                        classNamePrefix="report_menu custon_select-selector-inner"
                                                        onChange={handleReport}
                                                        options={reportOptions}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            border: 0,
                                                            borderRadius: 0,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: "#f2f2f2",
                                                                primary: "#f2f2f2",
                                                            },
                                                        })}
                                                    />
                                                </div>
                                                <div className="text-danger error-12">
                                                    {formErrors.reportID !== ""
                                                        ? formErrors.reportID
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>
}

export default Post
