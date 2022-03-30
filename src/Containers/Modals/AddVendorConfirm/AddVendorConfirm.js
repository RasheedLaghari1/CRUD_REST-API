import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import AddVendorsModal from "../AddVendors/AddVendors";

const AddVendorConfirmModal = (props) => {
  let [openAddVendorsModal, setOpenAddVendorsModal] = useState(false);
  const openModal = (name) => {
    setOpenAddVendorsModal(true);
    props.closeModal("openAddVendorConfirmModal");
  };
  const closeModal = (name) => {
    setOpenAddVendorsModal(false);
    props.closeModal("openSupplierModal");
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openAddVendorConfirmModal}
        onHide={() => props.closeModal("openAddVendorConfirmModal")}
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
                            <h6 className="text-left def-blue">Add Supplier</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={() => openModal("openAddVendorsModal")}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Yes
                            </button>
                            <button
                              onClick={() =>
                                props.closeModal("openAddVendorConfirmModal")
                              }
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
                      <div className="row">
                        <div className="col-12">
                          <p className="model-p move-modal-t">
                            Do you wish to add a new Supplier?
                          </p>
                        </div>
                        <div className="col-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <AddVendorsModal
        openAddVendorsModal={openAddVendorsModal}
        closeModal={closeModal}
        props={props.props}
        currencyList={props.props.currencyList || []}
        addNewSupplier={props.addNewSupplier}
        supplierName={props.supplierName || ""}
      />
    </>
  );
};

export default AddVendorConfirmModal;
