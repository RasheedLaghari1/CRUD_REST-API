import React, { useState, useEffect } from "react";
import "./Attachments.css";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../../Utils/Helpers";

const Attachments = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    attachment: "",
  });

  useEffect(() => {
    addDragAndDropFileListners("drop-area-attach-modal", uploadAttachment);
  }, [props.openAttachmentsModal]);

  const closeModal = async () => {
    props.closeModal("openAttachmentsModal");
    removeDragAndDropFileListners("drop-area-attach-modal", uploadAttachment);
  };

  // uplaod po attchments
  const uploadAttachment = async (attachments) => {
    /*
    A user cannot have greater than 29.5MB of attachments 
    in one invoice/po/expenses/documents transaction. 
  */

    let fileList = [];
    let attachmentSize = props.attachmentSize || 0;
    for (let i = 0; i < attachments.length; i++) {
      let type = attachments[i].type;
      let file = attachments[i];
      let size = attachments[i].size;
      let name = attachments[i].name;

      if (
        type == "application/pdf" ||
        type ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        type == "image/jpeg" ||
        type == "image/jpg" ||
        type == "image/png" ||
        type == "application/msword" ||
        type == "application/vnd.ms-excel" ||
        type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        type == "application/vnd.ms-powerpoint" ||
        type == "text/csv"
      ) {
        if (size <= 10485760) {
          //10MB = 10485760 Bytes

          if (attachmentSize < 30932992) {
            //30932992  -> 29.5 MB
            if (Number(size) + Number(attachmentSize) < 30932992) {
              const result = await toBase64(file).catch((e) => e);
              if (result instanceof Error) {
                toast.error(result.message);
                return;
              } else {
                fileList.push({
                  fileName: name,
                  attachment: result.split(",")[1],
                });
              }
            } else {
              let remaining_KBs = (30932992 - attachmentSize) / 1024; //available space

              remaining_KBs = Number(remaining_KBs).toFixed(2);

              toast.error(
                `You can upload a file of size ${remaining_KBs}KB, Attachmnents limit 29.5MB.`
              );
            }
          } else {
            toast.error(
              "You can't add more attachments. Attachments limit 29.5MB! "
            );
          }
        } else {
          toast.error(
            "This file exceeds the 10MB limit. Please upload a smaller file."
          );
        }
      } else {
        toast.error(
          "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
        );
      }
    }

    if (attachments.length === fileList.length) {
      await addAttachments(fileList);
    }
  };

  const addAttachments = async (fileList) => {
    if (props.ordersPage) {
      //order --> you can add multiple attachments at a time
      await props.addAttachment(fileList);
    } else {
      await props.addAttachment(fileList[0].attachment, fileList[0].fileName);
    }
    setState((prev) => ({ ...prev, attachment: "" }));

    // setState({
    //   attachment: "",
    // });
    closeModal();
  };

  const showAttachment = async (recordID, type, fileName) => {
    await props.getAttachment(recordID, type, fileName);
  };

  let attachments = props.attachments || [];

  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openAttachmentsModal}
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
                            <h6 className="text-left def-blue">Attachments</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={closeModal}
                              type="button"
                              className="btn-save"
                            >
                              <span className="fa fa-ban"></span>
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="forgot_body">
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-12">
                              <ul className="list-group attachment-adjust">
                                <li className="list-group-item attachment-heading">
                                  Description{" "}
                                </li>
                                {attachments.map((a, i) => {
                                  return (
                                    <li key={i} className="list-group-item">
                                      {a.fileName}{" "}
                                      <img
                                        onClick={() =>
                                          showAttachment(
                                            a.recordID || a.fileID || a.id,
                                            a.contentType,
                                            a.fileName || ""
                                          )
                                        }
                                        src="images/attach_icon.png"
                                        className="import_icon img-fluid float-right"
                                      />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                          {props.draft && (
                            <div className="drag-file-img">
                              <div id="drop-area-attach-modal">
                                <input
                                  type="file"
                                  id="fileElem-modal"
                                  className="form-control d-none"
                                  accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                                 , application/pdf, image/jpeg,image/jpg,image/png,
                                  .csv, .xlsx, .xls,
                                  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                  onChange={(e) => {
                                    uploadAttachment(e.target.files);
                                  }}
                                  onClick={(event) => {
                                    event.currentTarget.value = null;
                                  }} //to upload the same file again
                                  multiple={props.ordersPage ? true : false}
                                />
                                <label
                                  className="upload-label"
                                  htmlFor="fileElem-modal"
                                >
                                  <div className="upload-text">
                                    <img
                                      src="images/drag-file.png"
                                      className="import_icon img-fluid"
                                      alt="upload-attachment"
                                    />
                                  </div>
                                </label>
                              </div>
                            </div>
                          )}
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

export default Attachments;
