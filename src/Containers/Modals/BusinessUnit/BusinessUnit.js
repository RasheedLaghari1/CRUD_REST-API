import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./BusinessUnit.css";
import { connect } from "react-redux";
import {
  getProductions,
  logInProduction,
} from "../../../Actions/UserActions/UserActions";
const BusinessUnit = (props) => {
  let productionName = localStorage.getItem("loginProduction");
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openBusinessUnitModal}
        onHide={() => props.closeModal("openBusinessUnitModal")}
        className="forgot_email_modal modal_704 mx-auto business_unit_modal_content"
      >
        <Modal.Body className="business-unit-body">
          <div className="container-fluid ">
            <div className="main_wrapper p-10">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width">
                  <div className="forgot_form_main">
                    <div className="forgot_header"></div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="login_form">
                            <div className="login_table_list">
                              <table className="table table-hover busines_unit_table">
                                <thead>
                                  <tr className="busines_unit_tbl-head">
                                    <th scope="col">Business Unit</th>
                                    <th scope="col">Approve PO</th>
                                    <th scope="col">Approve Invoices</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {props.user.productions.map((pn, i) => {
                                    return (
                                      <tr
                                        onClick={() =>
                                          props.loginProduction(
                                            pn.productionName
                                          )
                                        }
                                        key={i}
                                        className={
                                          productionName === pn.productionName
                                            ? "active cursorPointer"
                                            : "cursorPointer"
                                        }
                                      >
                                        <th scope="row">{pn.productionName}</th>
                                        <td>
                                          {pn.approveOrders ||
                                          pn.approveOrders == 0
                                            ? pn.approveOrders
                                            : ""}
                                        </td>
                                        <td>
                                          {pn.approveInvoices ||
                                          pn.approveInvoices == 0
                                            ? pn.approveInvoices
                                            : ""}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
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

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps, {
  getProductions,
  logInProduction,
})(BusinessUnit);
