import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateDocument } from "../../Actions/DocumentActions/DocumentActions";

const AddNewTypeConfirm = (props) => {
  const dispatch = useDispatch();
  const { closeModal, onAddNewTypeSuccess, state } = props;

  const [isLoading, setIsLoading] = useState(false);

  const documentState = useSelector((state) => state.document);

  useEffect(() => {
    if (documentState.updateDocumentSuccess) {
      toast.success(documentState.updateDocumentSuccess);
      closeModal();
      setIsLoading(false);
      onAddNewTypeSuccess(state.newType);
    }
    if (documentState.updateDocumentError) {
      setIsLoading(false);
      toast.error(documentState.updateDocumentError);
    }
  }, [documentState]);

  const onConfirm = async () => {
    let obj = { document: { tran: state.tran, type: state.newType.value } };
    dispatch(updateDocument(obj));
    setIsLoading(true);
  };

  return (
    <>
      {isLoading ? <div className="se-pre-con"></div> : ""}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={state.openAddTypeModal}
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
                            <h6 className="text-left def-blue">Confirm</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={onConfirm}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-check"></span>
                              Confirm
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
                      <div className="row">
                        <div className="col-12">
                          <p className="model-p move-modal-t">
                            Are you sure to create new type{" "}
                            <strong>
                              <em>{state.newType.value}</em>
                            </strong>
                            ?
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
    </>
  );
};

export default AddNewTypeConfirm;
