import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import ContactDetails from "../ContactDetails/ContactDetails";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import {
  addSuppliersContact,
  updateSuppliersContact,
  deleteSuppliersContact,
  clearSupplierStates,
} from "../../../Actions/SupplierActtions/SupplierActions";

const Contact = (props) => {
  const [state, setState] = useState({
    isLoading: false,
    openContactDetailsModal: false,
    editSupplierContact: "", //edit supplier's contact
    contact: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const poData = useSelector((state) => state.poData);
  const supplier = useSelector((state) => state.supplier);

  const openModal = (name) => {
    setState((prev) => ({ ...prev, [name]: true }));
  };

  const closeModal = async (name) => {
    if (name === "openContactDetailsModal") {
      setState((prev) => ({ ...prev, editSupplierContact: "", [name]: false }));
    } else {
      setState((prev) => ({ ...prev, [name]: false }));
    }
  };

  const addSupplierContact = async () => {
    await setState((prev) => ({
      ...prev,
      editSupplierContact: "",
    }));

    openModal("openContactDetailsModal");
  };

  const editSupplierContact = async (supplierContact) => {
    await setState((prev) => ({
      ...prev,
      editSupplierContact: supplierContact,
    }));
    openModal("openContactDetailsModal");
  };

  const deleteSupplierContact = async (contact) => {
    setState((prev) => ({ ...prev, isLoading: true, contact }));

    let { id } = contact;
    await dispatch(deleteSuppliersContact(id)); //call api to delete supplier contact

    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleCheckbox = async (e, data) => {
    if (e.target.checked) {
      await props.updatePOSupplierContacts(data);
      clearStates();
    }
  };

  const clearStates = async () => {
    props.closeModal("openContactModal");
    setState((prev) => ({ ...prev, editSupplierContact: "", contact: "" }));
  };

  const updateSupplierContacts = async (contact) => {
    setState((prev) => ({ ...prev, isLoading: true, contact }));

    let { id, name, email, phone, phone2, fax } = contact;

    if (id) {
      let obj = {
        contactID: id,
        contact: {
          name,
          email,
          phone,
          phone2,
          fax,
        },
      };
      await dispatch(updateSuppliersContact(obj)); //call api to update supplier contact
    } else {
      if (props.supplierCode && props.currency) {
        let obj = {
          supplierDetails: {
            currency: props.currency,
            code: props.supplierCode,
          },
          contact: {
            name,
            email,
            phone,
            phone2,
            fax,
          },
        };
        await dispatch(addSuppliersContact(obj)); //call api to add supplier contact
      } else {
        toast.error("Please Select Supplier First!");
      }
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  };
  useEffect(() => {
    let { contact } = state;
    let clearStates = false;
    //success case of update Suppliers Contact
    if (supplier.updateSuppliersContactSuccess) {
      // toast.success(props.supplier.updateSuppliersContactSuccess);
      props.updateSupplierContactsList(contact, "edit"); //also update the contact list
      clearStates = true;
    } else if (supplier.updateSuppliersContactError) {
      //error case of update Suppliers Contact

      handleApiRespErr(supplier.updateSuppliersContactError);
      clearStates = true;
    } else if (supplier.addSuppliersContactSuccess) {
      //success case of add Suppliers Contact

      toast.success(supplier.addSuppliersContactSuccess);
      props.updateSupplierContactsList(contact, "add"); //also update the contact list
      clearStates = true;
    } else if (supplier.addSuppliersContactError) {
      //error case of add Suppliers Contact

      handleApiRespErr(supplier.addSuppliersContactError);
      clearStates = true;
    } else if (supplier.deleteSuppliersContactSuccess) {
      // toast.success(props.supplier.deleteSuppliersContactSuccess);
      props.updateSupplierContactsList(contact, "delete"); //also update the contact list
      clearStates = true;
    } else if (supplier.deleteSuppliersContactError) {
      //error case of delete Suppliers Contact

      handleApiRespErr(supplier.deleteSuppliersContactError);
      clearStates = true;
    }

    if (clearStates) {
      dispatch(clearSupplierStates());
    }
  }, [supplier]);

  //a function that checks  api error
  const handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      await dispatch(clearStatesAfterLogout());
      props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  let contacts = props.contacts || [];
  return (
    <>
      {state.isLoading ? <div className="se-pre-con"></div> : ""}

      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openContactModal}
        onHide={clearStates}
        // className="forgot_email_modal modal_90_per mx-auto"
        className="forgot_email_modal  mx-auto"
      >
        <Modal.Body>
          <div className="container-fluid ">
            <div className="main_wrapper p-10">
              <div className="row d-flex h-100">
                <div className="col-12 justify-content-center align-self-center form_mx_width p-0">
                  <div className="forgot_form_main">
                    <div className="forgot_header px-3">
                      <div className="modal-top-header">
                        <div className="row bord-btm">
                          <div className="col-auto pl-0">
                            <h6 className="text-left def-blue">Contact</h6>
                          </div>
                          <div className="col d-flex justify-content-end s-c-main">
                            <button
                              onClick={clearStates}
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
                        <div className="col mt-md-1 ">
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main align-self-center">
                                  <button
                                    onClick={addSupplierContact}
                                    type="button"
                                    className="btn-save ml-2"
                                  >
                                    <img
                                      src="images/plus.png"
                                      className="mx-auto"
                                      alt="search-icon"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row no-gutters mt-1">
                        <div className="col-12">
                          <div className="login_form">
                            <div className="login_table_list table-responsive">
                              <table className="table table-hover project_table shadow-none mb-5">
                                <thead>
                                  <tr>
                                    <th scope="col"></th>
                                    <th scope="col" className="text-left">
                                      Contact Name
                                    </th>
                                    <th scope="col" className="text-left">
                                      Email
                                    </th>
                                    <th scope="col" className="text-left">
                                      Phone Number
                                    </th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {contacts.map((c, i) => {
                                    return (
                                      <tr key={i}>
                                        <th scope="row">
                                          <div className="col align-self-center text-center pr-0">
                                            <div className="form-group remember_check">
                                              <input
                                                type="checkbox"
                                                id={"contacts" + i}
                                                checked={
                                                  c.checked ? true : false
                                                }
                                                name="checkbox"
                                                onChange={(e) =>
                                                  handleCheckbox(e, c)
                                                }
                                              />
                                              <label
                                                htmlFor={"contacts" + i}
                                                className="mr-0"
                                              ></label>
                                            </div>
                                          </div>
                                        </th>
                                        <th className="text-left">{c.name}</th>
                                        <td className="text-left">{c.email}</td>
                                        <td className="text-left">{c.phone}</td>
                                        <td className="text-center w-15">
                                          <img
                                            onClick={() =>
                                              editSupplierContact(c)
                                            }
                                            src="images/pencill.png"
                                            alt="edit"
                                          />
                                        </td>
                                        <td className="text-center w-15">
                                          <img
                                            onClick={() =>
                                              deleteSupplierContact(c)
                                            }
                                            src="images/delete.svg"
                                            alt="edit"
                                            className="invoice-delete-icon"
                                          />
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
      <ContactDetails
        openContactDetailsModal={state.openContactDetailsModal}
        closeModal={closeModal}
        contact={state.editSupplierContact} //edit supplier's contact
        updateSupplierContacts={updateSupplierContacts} //update supplier contacts list when edit contacts or add contacs
      />
    </>
  );
};
export default Contact;
