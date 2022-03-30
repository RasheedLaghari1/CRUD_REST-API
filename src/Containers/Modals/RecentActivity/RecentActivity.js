import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "./RecentActivity.css";

class RecentActivity extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openRecentActivityModal}
          onHide={() => this.props.closeModal("openRecentActivityModal")}
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
                            <div className="col-12 pl-0">
                              <h6 className="text-left def-blue">
                                Recent Activity
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body rececnt_tab">
                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="activity_item_main comments_main recent_active_main">
                              <div className="row">
                                <div className="col-md-1 col-sm-2 p-0">
                                  <div className="recent_active_pic">
                                    <img
                                      src="images/256.png"
                                      className="import_icon img-fluid float-left"
                                      alt="user"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-8 col-sm-7 p-0">
                                  <div className="activity_9 p-0">
                                    <h6 className="activity_9_h5 p-0 mb-0">
                                      Jie He
                                    </h6>
                                    <p>I added some comments in order.</p>
                                  </div>
                                </div>
                                <div className="col-md-3 col-sm-3 align-self-center">
                                  <div className="activity_3 ">
                                    <p>5/07/2018 1:10pm</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="activity_item_main comments_main recent_active_main">
                              <div className="row">
                                <div className="col-md-1 col-sm-2 p-0">
                                  <div className="recent_active_pic">
                                    <img
                                      src="images/people2.png"
                                      className="import_icon img-fluid float-left"
                                      alt="user"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-8 col-sm-7 p-0">
                                  <div className="activity_9 p-0">
                                    <h5 className="activity_9_h5 p-0 mb-0">
                                      Jie He
                                    </h5>
                                    <p>I added some comments in order.</p>
                                  </div>
                                </div>
                                <div className="col-md-3 col-sm-3 align-self-center">
                                  <div className="activity_3 ">
                                    <p>5/07/2018 1:10pm</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="activity_item_main comments_main recent_active_main">
                              <div className="row">
                                <div className="col-md-1 col-sm-2 p-0">
                                  <div className="recent_active_pic">
                                    <img
                                      src="images/256.png"
                                      className="import_icon img-fluid float-left"
                                      alt="user"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-8 col-sm-7 p-0">
                                  <div className="activity_9 p-0">
                                    <h5 className="activity_9_h5 p-0 mb-0">
                                      Jie He
                                    </h5>
                                    <p>I added some comments in order.</p>
                                  </div>
                                </div>
                                <div className="col-md-3 col-sm-3 align-self-center">
                                  <div className="activity_3 ">
                                    <p>5/07/2018 1:10pm</p>
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
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default RecentActivity;
