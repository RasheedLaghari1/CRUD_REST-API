import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./Comments.css";
import { handleValidation } from "../../../Utils/Validation";

const Comments = (props) => {
  let [state, setState] = useState({
    isLoading: false,
    comment: "",
    formErrors: {
      comment: "",
    },
  });

  const handleChangeComment = async (e) => {
    let { formErrors } = state;
    let fieldName = "comment";
    let fieldValue = e.target.value;
    formErrors = handleValidation(fieldName, fieldValue, formErrors);
    setState((prev) => ({
      ...prev,
      comment: fieldValue,
      formErrors,
    }));
  };

  const addComment = async () => {
    let { comment, formErrors } = state;
    comment = comment.trim();
    formErrors = handleValidation("comment", comment, formErrors);

    if (!formErrors.comment) {
      await props.addComment(comment);
      closeModal();
    }
    setState((prev) => ({
      ...prev,
      formErrors,
    }));
  };

  const clearStates = () => {
    setState((prev) => ({
      ...prev,
      comment: "",
      formErrors: {
        comment: "",
      },
    }));
  };
  const closeModal = () => {
    clearStates();
    props.closeModal("openCommentsModal");
  };
  let comments = props.comments || [];

  // user can add comment in these sections the Draft, Approve, Hold, Pending, Declined:
  let cmntCheck = true;
  let tab = props.tab || "";

  if (tab === "approved" || tab === "all") {
    cmntCheck = false;
  }

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openCommentsModal}
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
                            <h6 className="text-left def-blue">Comments</h6>
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
                        {comments.map((c, i) => {
                          return (
                            <div key={i} className="col-md-12">
                              <div className="activity_item_main comments_main">
                                <div className="row">
                                  <div className="col-md-9">
                                    <div className="activity_9">
                                      <h5 className="activity_9_h5">
                                        {c.userName}
                                      </h5>
                                      <p>{c.comment}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="activity_3 align-self-center">
                                      <p>
                                        {c.date} {c.time}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {cmntCheck && (
                          <div className="col-md-12">
                            <div className="comment_section ">
                              <h5>Comments</h5>
                              <textarea
                                className="form-control form-control-sm mb-3 comment_textarea"
                                rows="3"
                                placeholder=""
                                name="comment"
                                value={state.comment}
                                onChange={handleChangeComment}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.comment !== ""
                                  ? state.formErrors.comment
                                  : ""}
                              </div>
                            </div>
                            <button
                              onClick={addComment}
                              type="button"
                              className="btn-save add_comment_btn"
                            >
                              <span className="fa fa-check "></span>
                              Add Comment
                            </button>
                          </div>
                        )}
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

export default Comments;
