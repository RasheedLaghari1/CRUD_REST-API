import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const ContactDetails = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    id: "", //just to identify which contact is going to edit
    name: "",
    email: "",
    phone: "",
    phone2: "",
    fax: "",
    formErrors: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (props.contact) {
      let contact = JSON.parse(JSON.stringify(props.contact));
      setState((prev) => ({
        ...prev,
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        phone2: contact.phone2,
        fax: contact.fax,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        id: "",
        name: "",
        phone: "",
        phone2: "",
        fax: "",
        email: "",
      }));
    }
  }, [props.openContactDetailsModal]);

  const closeModal = () => {
    clearStates();
    props.closeModal("openContactDetailsModal");
  };
  const handleFieldChange = (e) => {
    let { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  const validateField = async (name, value) => {
    let email_pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let formErrors = state.formErrors;
    switch (name) {
      case "name":
        if (value.length < 1) {
          formErrors.name = "This Field is Required.";
        } else {
          formErrors.name = "";
        }
        break;
      case "email":
        if (value.length < 1) {
          formErrors.email = "";
        } else if (!email_pattern.test(value)) {
          formErrors.email = "Please enter valid email format.";
        } else {
          formErrors.email = "";
        }
        break;
      default:
        break;
    }
    setState((prev) => ({ ...prev, formErrors: formErrors }));
  };
  const onSave = async () => {
    let formErrors = state.formErrors;
    if (!state.name) {
      formErrors.name = "This Field is Required.";
    }
    if (!state.email) {
      formErrors.email = "This Field is Required.";
    }
    setState((prev) => ({ ...prev, formErrors }));

    if (!formErrors.name && !formErrors.email) {
      let contact = {
        id: state.id,
        name: state.name,
        email: state.email,
        phone: state.phone,
        phone2: state.phone2,
        fax: state.fax,
      };
      await props.updateSupplierContacts(contact);

      props.closeModal("openContactDetailsModal");
      clearStates();
    }
  };
  const clearStates = () => {
    setState((prev) => ({
      ...prev,
      id: "", //just to identify which contact is going to edit
      name: "",
      email: "",
      phone: "",
      formErrors: {
        name: "",
        email: "",
      },
    }));
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openContactDetailsModal}
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
                              Contact Details
                            </h6>
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
                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                name="name"
                                value={state.name}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.name !== ""
                                  ? state.formErrors.name
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Phone 1"
                                name="phone"
                                value={state.phone}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Phone 2"
                                name="phone2"
                                value={state.phone2}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Fax"
                                name="fax"
                                value={state.fax}
                                onChange={handleFieldChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group custon_select">
                            <div className="modal_input">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Email"
                                name="email"
                                value={state.email}
                                onChange={handleFieldChange}
                              />
                              <div className="text-danger error-12">
                                {state.formErrors.email !== ""
                                  ? state.formErrors.email
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

export default ContactDetails;
