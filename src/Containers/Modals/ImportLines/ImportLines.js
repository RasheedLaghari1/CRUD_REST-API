import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "react-datepicker/dist/react-datepicker.css";

class ImportLines extends Component {
  constructor() {
    super();
    this.state = {
      excelData: "",
      formErrors: {
        excelData: "",
      },
    };
  }

  handleExcelData = (e) => {
    let formErrors = this.state.formErrors;
    let value = e.target.value;
    if (value.length < 1) {
      formErrors.excelData = "This Field is Required.";
    } else {
      formErrors.excelData = "";
    }
    this.setState({
      excelData: value,
      formErrors: formErrors,
    });
  };

  onSave = async () => {
    let formErrors = this.state.formErrors;

    if (!this.state.excelData.trim()) {
      formErrors.excelData = "This Field is Required.";
    }
     this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.excelData) {
      let { excelData } = this.state;
      await this.props.importLines(excelData);
    }
  };

  onCancel =  () => {
     this.setState({
      excelData: "",
      formErrors: {
        excelData: "",
      },
    });
    this.props.closeModal("openImportLinesModal");
  };

  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openImportLinesModal}
          onHide={this.onCancel}
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
                              <h6 className="text-left def-blue">Import</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.onSave}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                              <button
                                onClick={this.onCancel}
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
                    </div>
                  </div>
                  <div className="forgot_body w-100">
                    <div className="row no-gutters mt-4">
                      <div className="col-12 mt-1">
                        <div className="form-group custon_select text-center mb-0 w-100 ">
                          <textarea
                            rows="4"
                            className="w-100"
                            name="comment"
                            form="usrform"
                            placeholder="Paste Spreadsheet Data Here..."
                            value={this.state.excelData}
                            onChange={this.handleExcelData}
                          />
                        </div>
                        <div className="text-danger error-12">
                          {this.state.formErrors.excelData !== ""
                            ? this.state.formErrors.excelData
                            : ""}
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
  }
}
export default ImportLines;
