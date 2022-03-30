import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import {
  inserChartOfAccountCode,
  clearChartStates,
} from "../../../Actions/ChartActions/ChartActions";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  handleValidation,
  handleWholeValidation,
} from "../../../Utils/Validation";

const ChartOfAccount = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    chartSort: "",
    chartCode: "",
    description: "",
    formErrors: {
      chartSort: "",
      chartCode: "",
      description: "",
    },
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const chart = useSelector((state) => state.chart);

  useEffect(() => {
    const chartSort = props.chartSort || "";
    if (chartSort) {
      let { formErrors } = state;
      formErrors = handleValidation("chartSort", chartSort, formErrors);
      setState((prev) => ({ ...prev, chartSort, formErrors }));
    }
  }, [props]);

  const handleFieldChange = (e) => {
    let { formErrors } = state;
    let { name, value } = e.target;
    formErrors = handleValidation(name, value, formErrors);
    setState((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      props.clearStatesAfterLogout();
      props.props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      props.props.history.push("/login-table");
    } else {
      toast.error(error);
    }
  };

  const insertChartOfAccount = async () => {
    let { chartSort, chartCode, description, formErrors } = state;

    formErrors = handleWholeValidation(
      { chartSort, chartCode, description },
      formErrors
    );

    if (
      !formErrors.chartSort &&
      !formErrors.chartCode &&
      !formErrors.description
    ) {
      let userData = {
        actionType: "InsertAccount",
        chartSort,
        chartCode,
        description,
      };
      setState((prev) => ({ ...prev, isLoading: true }));

      await dispatch(inserChartOfAccountCode(userData));
    }
    setState((prev) => ({ ...prev, formErrors, isLoading: false }));
  };

  useEffect(() => {
    if (chart.insertChartOfAccountsSuccess) {
      dispatch(clearChartStates());
      closeModal();
    } else if (chart.insertChartOfAccountsError) {
      dispatch(clearChartStates());
      handleApiRespErr(chart.insertChartOfAccountsError);
    }
  }, [chart]);

  const closeModal = () => {
    props.closeModal("openChartOfAccountModal");
    setState((prev) => ({
      ...prev,
      isLoading: false,
      chartSort: "",
      chartCode: "",
      description: "",
      formErrors: {
        chartSort: "",
        chartCode: "",
        description: "",
      },
    }));
  };

  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openChartOfAccountModal}
        onHide={closeModal}
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
                            <h6 className="text-left def-blue">
                              Chart of Accounts
                            </h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={insertChartOfAccount}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Save
                            </button>
                            <button
                              onClick={closeModal}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Chart Sort"
                                id="usr"
                                name="chartSort"
                                value={state.chartSort}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.chartSort !== ""
                                  ? state.formErrors.chartSort
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Chart Code"
                                id="usr"
                                name="chartCode"
                                value={state.chartCode}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.chartCode !== ""
                                  ? state.formErrors.chartCode
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                id="usr"
                                name="description"
                                value={state.description}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.description !== ""
                                  ? state.formErrors.description
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
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChartOfAccount;
