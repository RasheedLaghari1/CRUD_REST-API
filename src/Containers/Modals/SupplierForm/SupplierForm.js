import React, { Component } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import FileSaver from "file-saver";

import $ from "jquery";
import { toast } from "react-toastify";

import SupplierFilterModal from "../SupplierFilter/SupplierFilter";
import { clearStatesAfterLogout } from "../../../Actions/UserActions/UserActions";
import * as SupplierActions from "../../../Actions/SupplierActtions/SupplierActions";
import * as ChartActions from "../../../Actions/ChartActions/ChartActions";
import { downloadAttachments, toBase64, addDragAndDropFileListners , removeDragAndDropFileListners } from "../../../Utils/Helpers";

const uuidv1 = require("uuid/v1");

class SupplierForm extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      currency: { label: "Select Currency", value: "" },
      currencyList: [{ label: "Select Currency", value: "" }],
      type: { label: "Select Type", value: "" },
      typeOptions: [{ label: "Select Type", value: "" }],
      code: "", //supplier's code
      supplierID: "", //supplier's ID
      name: "", //supplier's name
      email: "", //supplier's email
      taxID: "", //supplier's taxID
      taxCode: { label: "Select Tax Code", value: "" },
      taxCodeList: [{ label: "Select Tax Codes", value: "" }],
      //company address
      companyAddress: "",
      compAddress: "",
      compAddress2: "",
      compCity: "",
      compState: "",
      compPostcode: "",
      compCountry: "",
      //postal address
      postalAddress: "",
      postAddress: "",
      postAddress2: "",
      postCity: "",
      postState: "",
      postPostcode: "",
      postCountry: "",
      comanyPostalCheck: "company",
      detailsListSearch: "",
      showHiddenRows: false,
      detailsList: [], //suppliers details List -> containing tracking codes, chart codes etc details
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      suppliersActivity: [], //a suppliers activity
      check: true,
      openSupplierFilterModal: false,

      formErrors: {
        name: "",
        currency: "",
      },
    };
  }
  async componentDidMount() {
    $(document).ready(function () {
      $("#filter_dropdown").click(function () {
        $("#supplier_filter_dropdpwn1").toggle();
        $("#supplier_filter_dropdpwn2").hide();
      });
      $(".plus_icon-filter_bottom").click(function () {
        $("#supplier_filter_dropdpwn2").toggle();
      });
      $(".pop-cros-1").click(function () {
        $("#supplier_filter_dropdpwn1").hide();
        $("#supplier_filter_dropdpwn2").hide();
      });
      $(".close_it").click(function () {
        $("#supplier_filter_dropdpwn2").hide();
      });
    });
  }
  async componentWillReceiveProps(np) {
    if (np.openSupplierForm && this.state.check) {
      //modal takes some time to display in DOM thats why we set settimout for adding Listeners
      setTimeout(() => {
        addDragAndDropFileListners("drop-area-supplier", this.uploadAttachment )
      }, 300);

      //--------setting Currencies List--------
      if (
        np.chart.getCurrencies &&
        np.chart.getCurrencies.length > 0
      ) {
        let currencies = np.chart.getCurrencies || [];
        let crncyArr = [{ label: "Select Currency", value: "" }];
        currencies.map((c, i) => {
          crncyArr.push({
            label: c.description + " (" + c.code + ")",
            value: c.code,
          });
        });
        await this.setState({
          currencyList: crncyArr,
        });
      }
      //------------setting Tax Codes-------------
      let taxCodes = np.chart.getTaxCodes || [];
      let tc = [{ label: "Select Tax Codes", value: "" }];
      taxCodes.map((t, i) => {
        tc.push({
          label: t.description + " (" + t.code + ")",
          value: t.code,
        });
      });
      await this.setState({ taxCodeList: tc });

      //----------setting Supplier Details----------
      let currency_obj = this.state.currencyList.find(
        (cl) => cl.value == np.supplier.getSupplierDetails.currency
      );

      let supplierDetails = np.supplier.getSupplierDetails || "";

      let code = supplierDetails.supplierCode || "";
      let supplierID = supplierDetails.supplierID || "";
      let name = supplierDetails.name || "";
      let type = supplierDetails.type
        ? { label: supplierDetails.type, value: supplierDetails.type }
        : { label: "Select Type", value: "" };

      let typeOptions = [{ label: "Select Type", value: "" }];
      if (
        supplierDetails.typeOptions &&
        supplierDetails.typeOptions.length > 0
      ) {
        supplierDetails.typeOptions.map((o, i) => {
          typeOptions.push({ label: o.option, value: o.option });
        });
      }

      let taxCode = {
        label: supplierDetails.taxCode, //supplierDetails.taxCode -> 'B','Z' etc
        value: supplierDetails.taxCode,
      } || { label: "Select Tax Code", value: "" };

      let { taxCodeList } = this.state;
      if (taxCodeList.length > 0) {
        let code = taxCodeList.find((t) => t.value === supplierDetails.taxCode);
        if (code) {
          taxCode = {
            label: code.label, //now label is -> Bank Fees (B)
            value: code.value, // value is -> B
          };
        }
      }

      let email = supplierDetails.email || "";
      let taxID = supplierDetails.taxID || "";

      let companyAddress = supplierDetails.companyAddress || "";
      let postalAddress = supplierDetails.postalAddress || "";
      //setting by default Company and postal Addressess

      //Company Address
      let compAddress = companyAddress.address || "";
      let compAddress2 = companyAddress.address2 || "";
      let compCity = companyAddress.city || "";
      let compState = companyAddress.state || "";
      let compPostcode = companyAddress.postcode || "";
      let compCountry = companyAddress.country || "";
      //Postal Address
      let postAddress = postalAddress.address || "";
      let postAddress2 = postalAddress.address2 || "";
      let postCity = postalAddress.city || "";
      let postState = postalAddress.state || "";
      let postPostcode = postalAddress.postcode || "";
      let postCountry = postalAddress.country || "";
      // end

      let detailsList = supplierDetails.detailsList || [];

      detailsList.map((d, i) => {
        if (d.valueType && d.valueType.toLowerCase() === "list") {
          let valOptns = [];
          if (d.valueOptions && d.valueOptions.length > 0) {
            d.valueOptions.map((o, i) => {
              valOptns.push({ label: o.option, value: o.option });
            });
          }
          d.valueOptions = valOptns;
        }
        d.id = uuidv1();
        d.hide = false;
        return d;
      });

      //get detail list data from the local storage to hide/unhide rows for all suppliers
      let hideSupList = JSON.parse(localStorage.getItem("hideSupList") || "[]");

      if (hideSupList && hideSupList.length > 0) {
        detailsList.map((d, i) => {
          hideSupList.map((h, i) => {
            if (
              d.category === h.category &&
              d.description === h.description &&
              d.valueType === h.valueType
            ) {
              d.hide = true;
            }
          });
        });
      }

      let filtrdList = detailsList.filter((l) => !l.hide);

      let contacts = supplierDetails.contacts || [];
      contacts.map((c, i) => {
        c.checked = false;
        c.phone = c.phoneNumber || ''
        return c;
      });
      let attachments = supplierDetails.attachments || [];
      let suppliersActivity = supplierDetails.activity || []; //a suppliers activity

      this.setState({
        code,
        supplierID,
        name,
        currency: currency_obj || { label: "Select Currency", value: "" },
        type,
        typeOptions,
        taxCode,
        email,
        taxID,
        //Company and Postal Addressess
        companyAddress,
        compAddress,
        compAddress2,
        compCity,
        compState,
        compPostcode,
        compCountry,
        //postal address
        postalAddress,
        postAddress,
        postAddress2,
        postCity,
        postState,
        postPostcode,
        postCountry,
        //detail list
        detailsList: filtrdList,
        clonedDetailsList: detailsList,
        contacts,
        attachments,
        suppliersActivity,
        check: false,
      });
    }
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  handleSelectFields = (data, name) => {
    this.setState({ [name]: data });
    this.validateField(name, data.value);
  };
  handleFieldChange = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);
  };
  //when  click to Company OR Postal to change addressess accordingly
  handleComanyPostal = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };
  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "name":
        if (value == 0 || value == "") {
          formErrors.name = "This Field is Required.";
        } else {
          formErrors.name = "";
        }
        break;
      case "currency":
        if (value == 0 || value == "") {
          formErrors.currency = "This Field is Required.";
        } else {
          formErrors.currency = "";
        }
        break;

      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  // uplaod supploer's attchments
  uploadAttachment = async (f) => {

    let attachment = f;
    if (attachment[0] && attachment[0].type) {
      let type = attachment[0].type;
      let name = attachment[0].name;
      let file = attachment[0];
      let size = attachment[0].size;

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
        if (size <= 10485760) { //10MB = 10485760 Bytes
          const result = await toBase64(file).catch((e) => e);
          if (result instanceof Error) {
            toast.error(result.message);
            return;
          } else {
            await this.addAttachments({
              fileName: name,
              attachment: result.split(",")[1],
            });
          }
        } else {
          toast.error("This file exceeds the 10MB limit. Please upload a smaller file.");
        }
      } else {
        toast.error(
          "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
        );
      }
    }
  };
  addAttachments = async (data) => {
    let { currency, code, supplierID } = this.state;

    this.setState({ isLoading: true });
    let obj = {
      supplierID,
      supplierDetails: {
        currency: currency.value,
        code,
        supplierID,
        ...data,
      },
    };
    await this.props.addSupAttachments(obj);
    if (this.props.supplier.addSupAttachmentsSuccess) {
      // toast.success(this.props.supplier.addSupAttachmentsSuccess);
      let attachments = this.props.supplier.addSupAttachments || [];
      this.setState({ attachments });
    }
    if (this.props.supplier.addSupAttachmentsError) {
      this.handleApiRespErr(this.props.supplier.addSupAttachmentsError);
    }
    this.props.clearSupplierStates();

    this.setState({ isLoading: false });
  };

  deleteAttachment = async (recordID) => {
    this.setState({ isLoading: true });

    await this.props.deleteSupAttachments(recordID);
    if (this.props.supplier.deleteSupAttachmentsSuccess) {
      toast.success(this.props.supplier.deleteSupAttachmentsSuccess);
      let attachments = this.state.attachments || [];
      let filteredSupAttachments = attachments.filter(
        (a) => a.recordID != recordID
      );
      this.setState({ attachments: filteredSupAttachments });
    }
    if (this.props.supplier.deleteSupAttachmentsError) {
      this.handleApiRespErr(
        this.props.supplier.deleteSupAttachmentsError
      );
    }
    this.props.clearSupplierStates();
    this.setState({ isLoading: false });
  };
  //view attachments in new tab
  getAttachment = async (recordID, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getAttachment(recordID);
    if (this.props.supplier.getSupAttachmentSuccess) {
      toast.success(this.props.supplier.getSupAttachmentSuccess);
      let resp = this.props.supplier.getSupAttachment;
      downloadAttachments(resp, fileName, true)
    }
    if (this.props.supplier.getSupAttachmentError) {
      this.handleApiRespErr(this.props.supplier.getSupAttachmentError);
    }
    this.props.clearSupplierStates();
    this.setState({ isLoading: false });
  };

  handleValueOptions = async (type, val, item, index) => {
    //type -> list, date, checkbox, input fields
    //val -> value/event
    //item -> row that has been eidt
    //index -> index of the row that is being edit

    let { detailsList } = this.state;

    if (type === "list") {
      item.value = val.value;
      detailsList[index] = item;
    } else if (type === "date") {
      item.value = new Date(val).getTime();
      detailsList[index] = item;
    } else if (type === "checkbox") {
      item.value = val.target.checked ? "Y" : "N";
      detailsList[index] = item;
    } else {
      //input fields
      item.value = val.target.value;
      detailsList[index] = item;
    }
    this.setState({ detailsList });
  };

  onDetailsListSearch = async (e) => {
    let searchedText = e.target.value;
    this.setState({ detailsListSearch: searchedText });

    let { clonedDetailsList, showHiddenRows } = this.state;
    if (!searchedText) {
      if (showHiddenRows) {
        this.setState({ detailsList: clonedDetailsList });
      } else {
        let filterdList = clonedDetailsList.filter((l) => !l.hide);

        this.setState({ detailsList: filterdList });
      }
    } else {
      let detailsListFilterdData = [];

      if (showHiddenRows) {
        detailsListFilterdData = clonedDetailsList.filter((c) => {
          return (
            c.category.toUpperCase().includes(searchedText.toUpperCase()) ||
            c.description.toUpperCase().includes(searchedText.toUpperCase())
          );
        });
      } else {
        detailsListFilterdData = clonedDetailsList.filter((c) => {
          return (
            (c.category.toUpperCase().includes(searchedText.toUpperCase()) &&
              !c.hide) ||
            (c.description.toUpperCase().includes(searchedText.toUpperCase()) &&
              !c.hide) ||
            (c.valueType === "Date"
              ? Date(c.value)
                .toUpperCase()
                .includes(searchedText.toUpperCase()) && !c.hide
              : c.value.toUpperCase().includes(searchedText.toUpperCase()) &&
              !c.hide)
          );
        });
      }

      this.setState({ detailsList: detailsListFilterdData });
    }
  };

  handleShowHiddenRows = async () => {
    await this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }));

    let { showHiddenRows } = this.state;
    if (showHiddenRows) {
      //show hidden rows
      let clonedDetailsList = this.state.clonedDetailsList;
      this.setState({ detailsList: clonedDetailsList });
    } else {
      //hide again hidden rows
      let detailsList = this.state.detailsList;

      let list = detailsList.filter((l) => !l.hide);
      this.setState({ detailsList: list });
    }
  };

  //Hide/Unhide Rows
  handleHideUnhideRows = async (item) => {
    let detailsList = JSON.parse(JSON.stringify(this.state.detailsList));
    let clonedDetailsList = this.state.clonedDetailsList;

    if (!item.hide) {
      //hide row
      let list = detailsList.filter((l) => l.id != item.id);

      item.hide = true;

      let foundIndex = clonedDetailsList.findIndex((x) => x.id == item.id);
      clonedDetailsList[foundIndex] = item;

      //also save this setting on Local Storage
      let savedData = localStorage.getItem("hideSupList");
      if (savedData) {
        //check if item doestn't exists in hideSupList then push in the array
        let hideSupList = JSON.parse(
          localStorage.getItem("hideSupList") || "[]"
        );
        if (hideSupList.length > 0) {
          let check = true;
          hideSupList.map((d, i) => {
            if (
              d.category === item.category &&
              d.description === item.description &&
              d.valueType === item.valueType
            ) {
              check = false;
            }
          });

          if (check) {
            let obj = {
              category: item.category,
              description: item.description,
              valueType: item.valueType,
            };
            hideSupList.push(obj);

            localStorage.setItem("hideSupList", JSON.stringify(hideSupList));
          }
        }
      } else {
        //hideSupList doesn't contain in local storage

        let hideSupList = [];
        let obj = {
          category: item.category,
          description: item.description,
          valueType: item.valueType,
        };
        hideSupList.push(obj);

        localStorage.setItem("hideSupList", JSON.stringify(hideSupList));
      }

      this.setState({
        detailsList: list,
        clonedDetailsList,
        showHiddenRows: false,
      });
    } else {
      //un-hide row

      item.hide = false;

      let _foundIndex = detailsList.findIndex((x) => x.id == item.id);
      detailsList[_foundIndex] = item;

      let foundIndex = clonedDetailsList.findIndex((x) => x.id == item.id);
      clonedDetailsList[foundIndex] = item;

      this.setState({
        detailsList,
        clonedDetailsList,
      });

      //also remove this setting on Local Storage
      let savedData = localStorage.getItem("hideSupList");
      if (savedData) {
        let hideSupList = JSON.parse(
          localStorage.getItem("hideSupList") || "[]"
        );
        if (hideSupList.length > 0) {
          let lstArr = [];
          hideSupList.map((d, i) => {
            if (
              !(
                d.category === item.category &&
                d.description === item.description &&
                d.valueType === item.valueType
              )
            ) {
              lstArr.push(d);
            }
          });

          if (lstArr.length > 0) {
            localStorage.setItem("hideSupList", JSON.stringify(lstArr));
          } else {
            localStorage.removeItem("hideSupList");
          }
        }
      }
    }
  };

  //ADD Supplier's contact -> when click to + button on contacts
  addContact = async () => {
    let { contacts } = this.state;
    let obj = {
      checked: false,
      name: "",
      email: "",
      phone: "",
      phone2: "",
      fax: "",
      autoFocus: true,
    };

    contacts.push(obj);
    this.setState({ contacts });
  };
  deleteSupplierContact = async () => {
    let { contacts } = this.state;

    let contct = contacts.find((c) => c.checked);
    if (contct) {
      let { id } = contct;

      if (id) {
        this.setState({ isLoading: true });

        await this.props.deleteSuppliersContact(id); //call api to delete supplier contact

        //success case of delete Suppliers Contact
        if (this.props.supplier.deleteSuppliersContactSuccess) {
          toast.success(this.props.supplier.deleteSuppliersContactSuccess);

          let _contacts = contacts.filter((c) => c.id != id);
          this.setState({ contacts: _contacts });
        }
        //error case of delete Suppliers Contact
        if (this.props.supplier.deleteSuppliersContactError) {
          this.handleApiRespErr(
            this.props.supplier.deleteSuppliersContactError
          );
        }
        this.props.clearSupplierStates();
        this.setState({ isLoading: false });
      } else {
        //simply remove the new inserted object from the contact array
        let _contacts = contacts.filter((c) => !c.checked);
        this.setState({ contacts: _contacts });
      }
    } else {
      toast.error("Please Select Contact To Delete!");
    }
  };
  //when change details in contcts fields
  hanldeChangeContact = (e, contact, index) => {
    let name = e.target.name;
    let value = e.target.value;
    let { contacts } = this.state;
    contact[name] = value;
    contacts[index] = contact;
    this.setState({ contacts });
  };

  handleContactCheckboxes = (e, contact, index) => {
    let { contacts } = this.state;

    if (e.target.checked) {
      contacts.map((c, i) => {
        if (index === i) {
          c.checked = true;
        } else {
          c.checked = false;
        }
      });

      this.setState({ contacts });
    } else {
      contact.checked = false;
      contacts[index] = contact;

      this.setState({ contacts });
    }
  };
  //a function that checks api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      let history = this.props.history || this.props.props.history;
      history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      let history = this.props.history || this.props.props.history;
      history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };
  clearStates = () => {
    this.setState({
      isLoading: false,
      currency: { label: "Select Currency", value: "" },
      type: { label: "Select Type", value: "" },
      typeOptions: [{ label: "Select Type", value: "" }],
      code: "", //supplier's code
      supplierID: "", //supplier's ID
      name: "", //supplier's name
      email: "", //supplier's email
      taxID: "", //supplier's taxID
      taxCode: { label: "Select Tax Code", value: "" },
      //company address
      companyAddress: "",
      compAddress: "",
      compAddress2: "",
      compCity: "",
      compState: "",
      compPostcode: "",
      compCountry: "",
      //postal address
      postalAddress: "",
      postAddress: "",
      postAddress2: "",
      postCity: "",
      postState: "",
      postPostcode: "",
      postCountry: "",

      comanyPostalCheck: "company",
      detailsListSearch: "",
      showHiddenRows: false,
      detailsList: [], //suppliers details List -> containing tracking codes, chart codes etc details
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      suppliersActivity: [], //a suppliers activity
      check: true,
      formErrors: {
        name: "",
        currency: "",
      },
    });
  };

  onCancel = async () => {
    await this.props.closeModal("openSupplierForm");
    await this.clearStates();
    removeDragAndDropFileListners("drop-area-supplier", this.uploadAttachment )
  };
  //update supplier
  onSave = async () => {
    let formErrors = this.state.formErrors;
    if (!this.state.name) {
      formErrors.name = "This Field is Required.";
    }
    if (this.state.currency.value == "") {
      formErrors.currency = "This Field is Required.";
    }
    this.setState({
      formErrors: formErrors,
    });

    if (!formErrors.name && !formErrors.currency) {
      this.setState({ isLoading: true });
      let {
        code,
        currency,
        name,
        type,
        email,
        taxID,
        supplierID,
        taxCode,
        detailsList,
        //company address
        compAddress,
        compAddress2,
        compCity,
        compState,
        compPostcode,
        compCountry,
        //postal address
        postAddress,
        postAddress2,
        postCity,
        postState,
        postPostcode,
        postCountry,
        //contacts
        contacts
      } = this.state;

      let companyAddress = {
        address: compAddress,
        address2: compAddress2,
        city: compCity,
        state: compState,
        postcode: compPostcode,
        country: compCountry,
      };

      let postalAddress = {
        address: postAddress,
        address2: postAddress2,
        city: postCity,
        state: postState,
        postcode: postPostcode,
        country: postCountry,
      };

      let data = {
        supplierDetails: {
          currency: currency.value,
          code,
        },
        supplier: {
          name,
          type: type.value,
          email,
          taxID,
          taxCode: taxCode.value,
          companyAddress,
          postalAddress,
          detailsList,
          contacts
        },
      };

      await this.props.updateSupplierDetails(data);
      this.setState({ isLoading: false });

      //success case of update  Supplier Details
      if (this.props.supplier.updateSupplierDetailsSuccess) {
        toast.success(this.props.supplier.updateSupplierDetailsSuccess);
        // await this.props.getSuppliersList();

        // await this.props.updatePO();
      }

      //error case of update  Supplier
      if (this.props.supplier.updateSupplierDetailsError) {
        this.handleApiRespErr(
          this.props.supplier.updateSupplierDetailsError
        );
      }

      this.props.clearSupplierStates();
      this.onCancel();
    }
  };
  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openSupplierForm}
          // show={true}
          onHide={this.onCancel}
          className="forgot_email_modal modal_704 mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid ">
              <div className="">
                <div className="row d-flex h-100">
                  <div className="w-100">
                    <div className="forgot_form_main">
                      <div className="forgot_body">
                        <div className="row mt-4">
                          <form>
                            <section className="supplier w-100">
                              <div className="container-fluid ">
                                <div className="col-12 col-md-12 w-100 ">
                                  <div className="">
                                    <div className="forgot_header">
                                      <div className="modal-top-header">
                                        <div className="row bord-btm">
                                          <div className="col pl-0">
                                            <h6 className="text-left def-blue">
                                              <span>
                                                {" "}
                                                <img
                                                  src="images/arrow_up.png"
                                                  className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                                  alt="arrow_up"
                                                  data-toggle="collapse"
                                                  data-target="#supplierDetails"
                                                />{" "}
                                              </span>
                                              Supplier Details
                                            </h6>
                                          </div>
                                          <div className="col-12 col-md-auto d-flex justify-content-end s-c-main">
                                            <button
                                              onClick={this.onSave}
                                              type="button"
                                              className="btn-save"
                                            >
                                              <span className="fa fa-check"></span>
                                              Save
                                            </button>
                                            <button
                                              type="button"
                                              className="btn-save"
                                              onClick={this.onCancel}
                                            >
                                              <span className="fa fa-ban"></span>
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="forgot_body collapse show"
                                      id="supplierDetails"
                                    >
                                      <div className="row mt-4">
                                        <div className="col-md-6">
                                          <div className="form-group custon_select mm_pr">
                                            <Select
                                              className="width-selector"
                                              value={this.state.currency}
                                              onChange={(e) =>
                                                this.handleSelectFields(
                                                  e,
                                                  "currency"
                                                )
                                              }
                                              classNamePrefix="custon_select-selector-inner"
                                              options={this.state.currencyList}
                                              theme={(theme) => ({
                                                ...theme,
                                                border: 0,
                                                borderRadius: 0,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: "#f2f2f2",
                                                  primary: "#f2f2f2",
                                                },
                                              })}
                                            />
                                            <label className="move_label inactive">
                                              Currency
                                            </label>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors
                                                .currency !== ""
                                                ? this.state.formErrors.currency
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="form-group custon_select mm_pr">
                                            <Select
                                              className="width-selector"
                                              classNamePrefix="custon_select-selector-inner"
                                              classNamePrefix="custon_select-selector-inner"
                                              value={this.state.type}
                                              options={this.state.typeOptions}
                                              onChange={(e) =>
                                                this.handleSelectFields(
                                                  e,
                                                  "type"
                                                )
                                              }
                                              theme={(theme) => ({
                                                ...theme,
                                                border: 0,
                                                borderRadius: 0,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: "#f2f2f2",
                                                  primary: "#f2f2f2",
                                                },
                                              })}
                                            />
                                            <label className="move_label inactive type_pad">
                                              Type
                                            </label>
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="form-group custon_select">
                                            <div className="modal_input pt-2">
                                              <input
                                                type="text"
                                                className="form-control mt-0"
                                                id="usr"
                                                name="name"
                                                value={this.state.name}
                                                onChange={
                                                  this.handleFieldChange
                                                }
                                              />
                                              <label className="move_label inactive pt-2">
                                                Supplier Name
                                              </label>
                                            </div>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors.name !== ""
                                                ? this.state.formErrors.name
                                                : ""}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="form-group custon_select">
                                            <div className="modal_input pt-2">
                                              <input
                                                type="text"
                                                className="form-control mt-0"
                                                id="usr"
                                                name="email"
                                                value={this.state.email}
                                                onChange={
                                                  this.handleFieldChange
                                                }
                                              />
                                              <label className="move_label inactive pt-2">
                                                Email
                                              </label>
                                            </div>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors.email !==
                                                ""
                                                ? this.state.formErrors.email
                                                : ""}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          <div className="form-group custon_select">
                                            <div className="modal_input pt-2">
                                              <input
                                                type="text"
                                                className="form-control mt-0"
                                                id="usr"
                                                name="taxID"
                                                value={this.state.taxID}
                                                onChange={
                                                  this.handleFieldChange
                                                }
                                              />
                                              <label className="move_label inactive pt-2">
                                                Tax ID
                                              </label>
                                            </div>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors.taxID !==
                                                ""
                                                ? this.state.formErrors.taxID
                                                : ""}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-6">
                                          {/* dropdown coding start */}
                                          <div className="form-group custon_select mm_pr">
                                            <Select
                                              className="width-selector pt-2"
                                              classNamePrefix="custon_select-selector-inner"
                                              value={this.state.taxCode}
                                              options={this.state.taxCodeList}
                                              onChange={(e) =>
                                                this.handleSelectFields(
                                                  e,
                                                  "taxCode"
                                                )
                                              }
                                              theme={(theme) => ({
                                                ...theme,
                                                border: 0,
                                                borderRadius: 0,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: "#f2f2f2",
                                                  primary: "#f2f2f2",
                                                },
                                              })}
                                            />
                                            <label className="move_label inactive pt-2">
                                              Tax Code
                                            </label>
                                          </div>
                                        </div>
                                        <div className="col-12 border border-bottom mt-3"></div>

                                        <div className="col-md-12">
                                          <div className="row">
                                            <div className="col-auto pt-3">
                                              <div className="form-group">
                                                <label className="co_postaol_radio">
                                                  <input
                                                    name="comanyPostalCheck"
                                                    type="radio"
                                                    id="radio1"
                                                    value="company"
                                                    checked={
                                                      this.state
                                                        .comanyPostalCheck ===
                                                      "company"
                                                    }
                                                    onChange={
                                                      this.handleComanyPostal
                                                    }
                                                  />
                                                  Company
                                                </label>
                                              </div>
                                            </div>
                                            <div className="col-auto pt-3">
                                              <div className="form-group">
                                                <label className="co_postaol_radio">
                                                  <input
                                                    name="comanyPostalCheck"
                                                    type="radio"
                                                    id="radio1"
                                                    value="postal"
                                                    checked={
                                                      this.state
                                                        .comanyPostalCheck ===
                                                      "postal"
                                                    }
                                                    onChange={
                                                      this.handleComanyPostal
                                                    }
                                                  />
                                                  Postal
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {this.state.comanyPostalCheck ===
                                          "company" && (
                                            <>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compAddress"
                                                      value={
                                                        this.state.compAddress
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive">
                                                      Address
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compAddress2"
                                                      value={
                                                        this.state.compAddress2
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive type_pad">
                                                      Address2
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compCity"
                                                      value={this.state.compCity}
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      City
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compState"
                                                      value={this.state.compState}
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      State
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compPostcode"
                                                      value={
                                                        this.state.compPostcode
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      Post Code
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="compCountry"
                                                      value={
                                                        this.state.compCountry
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      Country
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}

                                        {this.state.comanyPostalCheck ===
                                          "postal" && (
                                            <>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postAddress"
                                                      value={
                                                        this.state.postAddress
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive">
                                                      Address
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postAddress2"
                                                      value={
                                                        this.state.postAddress2
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive type_pad">
                                                      Address2
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postCity"
                                                      value={this.state.postCity}
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      City
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postState"
                                                      value={this.state.postState}
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      State
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postPostcode"
                                                      value={
                                                        this.state.postPostcode
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      Post Code
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-md-6">
                                                <div className="form-group custon_select">
                                                  <div className="modal_input pt-2">
                                                    <input
                                                      type="text"
                                                      className="form-control mt-0"
                                                      id="usr"
                                                      name="postCountry"
                                                      value={
                                                        this.state.postCountry
                                                      }
                                                      onChange={
                                                        this.handleFieldChange
                                                      }
                                                    />
                                                    <label className="move_label inactive pt-2">
                                                      Country
                                                  </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                      </div>
                                    </div>

                                    <div className="forgot_header mt-4">
                                      <div className="modal-top-header">
                                        <div className="row bord-btm">
                                          <div className="col-auto pl-0">
                                            <h6 className="text-left def-blue">
                                              <span>
                                                {" "}
                                                <img
                                                  src="images/arrow_up.png"
                                                  className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                                  alt="arrow_up"
                                                  data-toggle="collapse"
                                                  data-target="#details"
                                                />{" "}
                                              </span>
                                              Details
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="forgot_body collapse show"
                                      id="details"
                                    >
                                      {/* filter dropdown */}
                                      <div id="supplier_filter_dropdpwn1">
                                        <div className="filter_dropdpwn1_toparea">
                                          <div className="col-sm-12 p-0">
                                            <h2>
                                              Active Filters{" "}
                                              <img
                                                onClick={() =>
                                                  this.setState({
                                                    filter_dropdpwn1: false,
                                                    filter_dropdpwn2: false,
                                                  })
                                                }
                                                src="images/cross.png"
                                                alt=""
                                                className="float-right pr-2 pop-cros-1"
                                              />
                                            </h2>
                                          </div>

                                          <div className="clear"></div>
                                          <div className="col-sm-12 p-0 filter_table_1">
                                            <p className="nofilter">
                                              No filters active applied to this
                                              view
                                            </p>
                                          </div>
                                        </div>
                                        <div className="clear20"></div>
                                        <div className="col-sm-12 p-0 active_filters">
                                          <h2>Active Filters</h2>
                                          <div className="save-filter">
                                            <span
                                              onClick={() =>
                                                this.openModal(
                                                  "openSupplierFilterModal"
                                                )
                                              }
                                            >
                                              Save filter
                                            </span>
                                          </div>
                                          <ul className="active_filter_list">
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              Kp test
                                            </li>
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              s
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="col-sm-12 active_filters_table2"></div>
                                        <div className="clear"></div>
                                        <div className="col-sm-12 p-0 active_filters">
                                          <h2>Workspace Filters</h2>
                                          <div className="save-filter">
                                            <Link to="#">Save filter</Link>
                                          </div>
                                          <ul className="active_filter_list">
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              Kp test
                                            </li>
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              s
                                            </li>
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              Kp test
                                            </li>
                                            <li>
                                              <span>
                                                <img src="images/close-icon-gray.png" alt="close" />
                                              </span>
                                              s
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="clear10"></div>
                                        <div>
                                          <button className="ml-2 clear-filter">
                                            Clear
                                          </button>

                                          <div className="pull-right plus_icon-filter_bottom">
                                            <img
                                              onClick={() =>
                                                this.setState({
                                                  filter_dropdpwn2: true,
                                                })
                                              }
                                              src="images/user-setup/plus_icon-filter_bottom.png"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* second drop down */}
                                      <div id="supplier_filter_dropdpwn2">
                                        <div className="filter_dropdpwn2_toparea p-0">
                                          <div className="col-sm-12 p-0">
                                            <h2 className="pl-3 pt-3 pb-1">
                                              Add Filters
                                            </h2>
                                            <div className="can-sav-btn">
                                              <button className="btn can-btn1">
                                                <img
                                                  src="images/save-check.png"
                                                  alt="check"
                                                ></img>
                                                Save
                                              </button>
                                              <button
                                                onClick={() =>
                                                  this.setState({
                                                    filter_dropdpwn2: false,
                                                  })
                                                }
                                                className="btn can-btn1 pl-3 close_it"
                                              >
                                                <img
                                                  src="images/cancel.png"
                                                  alt="check"
                                                ></img>
                                                Cancel
                                              </button>
                                            </div>
                                            <hr />
                                          </div>
                                          <div className="row pb-30">
                                            <div className="col sec-pop pr-0">
                                              <ul>
                                                <li className="">Code</li>
                                                <li className="">Description</li>
                                                <li className="">Budgeted</li>
                                                <li className="">Current</li>
                                                <li className="">Rate Date</li>
                                              </ul>
                                            </div>
                                            <div className="col sec-pop pl-0 pr-0 ">
                                              <ul className="pr-0">
                                                <li className="">Contains</li>
                                                <li className="">
                                                  Doesn't contain
                                                </li>
                                                <li className="">Equal</li>
                                                <li className="">Not Equal</li>
                                                <li className="">Startswith</li>
                                                <li className="">Over</li>
                                                <li className="">Under</li>
                                                <li className="">Over Equal</li>
                                                <li className="">Under Equal</li>
                                              </ul>
                                            </div>
                                            <div className="col sec-pop1 pl-0">
                                              <ul>
                                                <li className="border-bottom">
                                                  <div className="">
                                                    <input
                                                      placeholder="Value"
                                                      type="text"
                                                      className="cus-in"
                                                      name="filterValue"
                                                    />
                                                  </div>
                                                  {/* <div className="p-1" contentEditable="true">
                                                    Value
                                                  </div> */}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="clear10"></div>
                                        </div>
                                      </div>
                                      {/* end dropdown */}
                                      <div className="col-12 col-lg-6 col-md-6 pl-md-0 mt-4">
                                        <div className="d-flex justify-content-center h-100">
                                          <div className="searchbar">
                                            <input
                                              className="search_input"
                                              type="text"
                                              name=""
                                              placeholder="Search..."
                                              name="detailsListSearch"
                                              value={
                                                this.state.detailsListSearch
                                              }
                                              onChange={
                                                this.onDetailsListSearch
                                              }
                                            />
                                            <a
                                              href="javascript:void(0)"
                                              className="search_icon search-boredr"
                                            >
                                              <i className="fa fa-search"></i>
                                            </a>

                                            <a
                                              href="javascript:void(0)"
                                              className="search_icon"
                                              id="filter_dropdown"
                                            >
                                              <i className="fa fa-filter"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row mt-3">
                                        <div className="col-12">
                                          <div className="login_form">
                                            <div className="login_table_list table-responsive tab-1-line ">
                                              <table className="table table-hover busines_unit_table shadow-remove">
                                                <thead>
                                                  <tr className="busines_unit_tbl-head">
                                                    <th
                                                      scope="col"
                                                      className="mm_contact-name"
                                                    >
                                                      <div className="col align-self-center text-center pr-0">
                                                        <div className="form-group m-0 text-left pl-4">
                                                          <label className="dash_container dash_remember table-check unckeck p-0 exp_detail">
                                                            <input
                                                              type="checkbox"
                                                              name={"chk1"}
                                                              id={"chk1"}
                                                              checked={false}
                                                            />
                                                            <span
                                                              id="chk1"
                                                              className="dash_checkmark sup_radio"
                                                            ></span>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </th>
                                                    <th
                                                      scope="col"
                                                      className="text-left"
                                                    >
                                                      Category
                                                    </th>
                                                    <th scope="col">
                                                      Description
                                                    </th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Hide </th>
                                                    <th scope="col">
                                                      <div className="menu_bars_dropdown">
                                                        <Dropdown
                                                          alignRight="false"
                                                          drop="up"
                                                          className="analysis-card-dropdwn "
                                                        >
                                                          <Dropdown.Toggle
                                                            variant=""
                                                            id=""
                                                          >
                                                            <span className="fa fa-bars "></span>
                                                          </Dropdown.Toggle>
                                                          <Dropdown.Menu>
                                                            <Dropdown.Item
                                                              to="#/action-1"
                                                              className=""
                                                            >
                                                              <div
                                                                className="pr-0"
                                                                onClick={() =>
                                                                  this.handleShowHiddenRows(
                                                                    "showHiddenRows"
                                                                  )
                                                                }
                                                              >
                                                                <div className="form-group remember_check mm_check4">
                                                                  <input
                                                                    type="checkbox"
                                                                    id="showHiddenRows"
                                                                    name="showHiddenRows"
                                                                    checked={
                                                                      this.state
                                                                        .showHiddenRows
                                                                    }
                                                                    onClick={() =>
                                                                      this.handleShowHiddenRows(
                                                                        "showHiddenRows"
                                                                      )
                                                                    }
                                                                  />
                                                                  <label
                                                                    htmlFor="showHiddenRows"
                                                                    className="mr-0"
                                                                  >
                                                                    Show Hidden
                                                                    Rows
                                                                  </label>
                                                                </div>
                                                              </div>
                                                            </Dropdown.Item>
                                                          </Dropdown.Menu>
                                                        </Dropdown>
                                                      </div>
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {this.state.detailsList.map(
                                                    (d, i) => {
                                                      return (
                                                        <tr key={i}>
                                                          <td
                                                            scope="row"
                                                            className="sup_pad_left"
                                                          >
                                                            {" "}
                                                            <div className="col align-self-center text-center pr-0 sup_radio_bottom">
                                                              <div className="form-group m-0">
                                                                <label className="dash_container dash_remember table-check unckeck p-0 exp_detail">
                                                                  <input
                                                                    type="checkbox"
                                                                    name={
                                                                      "chk1"
                                                                    }
                                                                    id={"chk1"}
                                                                    checked={
                                                                      false
                                                                    }
                                                                  />
                                                                  <span
                                                                    id="chk1"
                                                                    className="dash_checkmark"
                                                                  ></span>
                                                                </label>
                                                              </div>
                                                            </div>
                                                          </td>
                                                          <td className="text-left">
                                                            {d.category}
                                                          </td>

                                                          <td>
                                                            {d.description}
                                                          </td>
                                                          {d.valueType ===
                                                            "List" ? (
                                                            <td className="pt-0 pb-0">
                                                              <Select
                                                                classNamePrefix="custon_select-selector-inner"
                                                                className={
                                                                  i == 0
                                                                    ? "width-selector only--one input_width"
                                                                    : i == 1
                                                                      ? "width-selector only--one input_width"
                                                                      : "width-selector input_width"
                                                                }
                                                                value={{
                                                                  label:
                                                                    d.value,
                                                                  value:
                                                                    d.value,
                                                                }}
                                                                options={
                                                                  d.valueOptions
                                                                }
                                                                onChange={(
                                                                  obj
                                                                ) =>
                                                                  this.handleValueOptions(
                                                                    "list",
                                                                    obj,
                                                                    d,
                                                                    i
                                                                  )
                                                                }
                                                                theme={(
                                                                  theme
                                                                ) => ({
                                                                  ...theme,
                                                                  border: 0,
                                                                  borderRadius: 0,
                                                                  colors: {
                                                                    ...theme.colors,
                                                                    primary25:
                                                                      "#f2f2f2",
                                                                    primary:
                                                                      "#f2f2f2",
                                                                  },
                                                                })}
                                                              />
                                                            </td>
                                                          ) : d.valueType ===
                                                            "Date" ? (
                                                            <td>
                                                              <div className="input_width detail_date_input">
                                                                <DatePicker
                                                                  selected={Number(
                                                                    d.value
                                                                  )}
                                                                  dateFormat="d MMM yyyy"
                                                                  autoComplete="off"
                                                                  onChange={(
                                                                    date
                                                                  ) =>
                                                                    this.handleValueOptions(
                                                                      "date",
                                                                      date,
                                                                      d,
                                                                      i
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            </td>
                                                          ) : d.valueType ===
                                                            "Check" ? (
                                                            <td>
                                                              <div className="col-auto mb-2 pr-0">
                                                                <div className="form-group remember_check text-center">
                                                                  <input
                                                                    type="checkbox"
                                                                    id="1w"
                                                                    checked={
                                                                      d.value ===
                                                                        "Y" ||
                                                                        d.value ===
                                                                        "1"
                                                                        ? true
                                                                        : false
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      this.handleValueOptions(
                                                                        "checkbox",
                                                                        e,
                                                                        d,
                                                                        i
                                                                      )
                                                                    }
                                                                  />
                                                                  <label htmlFor="1w"></label>
                                                                </div>
                                                              </div>
                                                            </td>
                                                          ) : d.valueType ===
                                                            "Numeric" ? (
                                                            <td>
                                                              <div className="input_width">
                                                                <input
                                                                  type="number"
                                                                  value={
                                                                    d.value
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    this.handleValueOptions(
                                                                      "number",
                                                                      e,
                                                                      d,
                                                                      i
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            </td>
                                                          ) : d.valueType ===
                                                            "Text" ? (
                                                            <td>
                                                              <div className="input_width">
                                                                <input
                                                                  type="text"
                                                                  value={
                                                                    d.value
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    this.handleValueOptions(
                                                                      "text",
                                                                      e,
                                                                      d,
                                                                      i
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            </td>
                                                          ) : (
                                                            <td>{d.value}</td>
                                                          )}

                                                          <td
                                                            scope="row"
                                                            className="detail_td"
                                                          >
                                                            {" "}
                                                            <div className="sup_catgry_radio ">
                                                              <div className="form-group m-0">
                                                                <label className="dash_container dash_remember table-check unckeck exp_detail">
                                                                  <input
                                                                    type="checkbox"
                                                                    name={
                                                                      "chk1"
                                                                    }
                                                                    id={"chk1"}
                                                                    checked={
                                                                      false
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      this.handleHideUnhideRows(
                                                                        d
                                                                      )
                                                                    }
                                                                  />
                                                                  <span
                                                                    id="chk1"
                                                                    className={
                                                                      d.hide
                                                                        ? "dash_checkmark bg_clr"
                                                                        : "dash_checkmark"
                                                                    }
                                                                  ></span>
                                                                </label>
                                                              </div>
                                                            </div>
                                                          </td>
                                                          <td></td>
                                                        </tr>
                                                      );
                                                    }
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="forgot_header mt-4">
                                      <div className="modal-top-header">
                                        <div className="row bord-btm">
                                          <div className="col-12 pl-0">
                                            <h6 className="text-left def-blue">
                                              <span>
                                                {" "}
                                                <img
                                                  src="images/arrow_up.png"
                                                  className="import_icon img-fluid pr-3 ml-3 sideBarAccord "
                                                  alt="arrow_up"
                                                  data-toggle="collapse"
                                                  data-target="#contact"
                                                />{" "}
                                              </span>
                                              Contact
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="forgot_body collapse show"
                                      id="contact"
                                    >
                                      <div className="row mt-3">
                                        <div className="col-12  d-flex justify-content-end s-c-main">
                                          <button
                                            onClick={this.deleteSupplierContact}
                                            type="button"
                                            className="btn-save "
                                          >
                                            <span className="fa fa-trash"></span>
                                          </button>
                                          <button
                                            onClick={this.addContact}
                                            type="button"
                                            className="btn-save m-0"
                                          >
                                            <span className="fa fa-plus"></span>
                                          </button>
                                        </div>
                                        <div className="col-12">
                                          <div className="login_form">
                                            <div className="login_table_list table-responsive tab-1-line supplier2_table">
                                              <table className="table table-hover busines_unit_table shadow-remove">
                                                <thead>
                                                  <tr className="busines_unit_tbl-head">
                                                    <th
                                                      scope="col"
                                                      className="mm_contact-name"
                                                    >
                                                      <div className="col align-self-center text-center pr-0">
                                                        <div className="form-group m-0 text-left pl-4">
                                                          <label className="dash_container dash_remember table-check unckeck p-0 exp_detail">
                                                            <input
                                                              type="checkbox"
                                                              name={"chk1"}
                                                              id={"chk1"}
                                                              checked={false}
                                                            // checked={
                                                            //   this.state.allContactsCheck
                                                            // }
                                                            // onChange={(e) =>
                                                            //   this.handleContactCheckboxes(
                                                            //     e,
                                                            //     "all"
                                                            //   )
                                                            // }
                                                            />
                                                            <span
                                                              id="chk1"
                                                              className="dash_checkmark sup_radio"
                                                            ></span>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </th>
                                                    <th scope="col">
                                                      Contact Name
                                                    </th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">
                                                      Phone Number
                                                    </th>
                                                    <th scope="col">
                                                      <span className="fa fa-bars"></span>
                                                    </th>
                                                    <th></th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {this.state.contacts.map(
                                                    (c, i) => {
                                                      return (
                                                        <tr key={i}>
                                                          <td
                                                            scope="row"
                                                            className="sup_pad_left"
                                                          >
                                                            {" "}
                                                            <div className="col align-self-center text-center pr-0 sup_radio_bottom">
                                                              <div className="form-group m-0  ">
                                                                <label className="dash_container dash_remember table-check unckeck p-0 exp_detail">
                                                                  <input
                                                                    type="checkbox"
                                                                    name={
                                                                      "chk1"
                                                                    }
                                                                    id={
                                                                      "chk1" + i
                                                                    }
                                                                    checked={
                                                                      c.checked
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      this.handleContactCheckboxes(
                                                                        e,
                                                                        c,
                                                                        i
                                                                      )
                                                                    }
                                                                  />
                                                                  <span
                                                                    id={
                                                                      "chk1" + i
                                                                    }
                                                                    className="dash_checkmark"
                                                                  ></span>
                                                                </label>
                                                              </div>
                                                            </div>
                                                          </td>
                                                          <td>
                                                            <input
                                                              type="text"
                                                              className="input_height sup_modal_contacs"
                                                              autoFocus={
                                                                c.autoFocus
                                                              }
                                                              name="name"
                                                              value={c.name}
                                                              onChange={(e) =>
                                                                this.hanldeChangeContact(
                                                                  e,
                                                                  c,
                                                                  i
                                                                )
                                                              }
                                                              id="name"
                                                            />
                                                          </td>

                                                          <td>
                                                            <input
                                                              type="text"
                                                              className="input_height sup_modal_contacs"
                                                              name="email"
                                                              value={c.email}
                                                              onChange={(e) =>
                                                                this.hanldeChangeContact(
                                                                  e,
                                                                  c,
                                                                  i
                                                                )
                                                              }
                                                              id="email"
                                                            />
                                                          </td>

                                                          <td>
                                                            <input
                                                              type="text"
                                                              className="input_height sup_modal_contacs"
                                                              name="phone"
                                                              value={
                                                                c.phone
                                                              }
                                                              id="phone"
                                                              onChange={(e) =>
                                                                this.hanldeChangeContact(
                                                                  e,
                                                                  c,
                                                                  i
                                                                )
                                                              }
                                                            />
                                                          </td>
                                                          <td></td>
                                                          <td></td>
                                                        </tr>
                                                      );
                                                    }
                                                  )}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="forgot_header mt-4">
                                      <div className="modal-top-header">
                                        <div className="row bord-btm">
                                          <div className="col-auto pl-0">
                                            <h6 className="text-left def-blue">
                                              <span>
                                                {" "}
                                                <img
                                                  src="images/arrow_up.png"
                                                  className="import_icon img-fluid pr-3 ml-3 sideBarAccord"
                                                  alt="arrow_up"
                                                  data-toggle="collapse"
                                                  data-target="#attachments"
                                                />{" "}
                                              </span>
                                              Attachment
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="collapse show"
                                      id="expenseAttachments"
                                    >
                                      <div
                                        className="forgot_body collapse show"
                                        id="attachments"
                                      >
                                        <div className="col-12 mt-2">
                                          <div className="form-group custon_select exp1_upload_area">
                                            <div
                                              id="drop-area-supplier"
                                              className="exp_drag_area supplier_img_darg"
                                            >
                                              <input
                                                type="file"
                                                id="fileElem-sup"
                                                className="form-control d-none"
                                                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                                                    , application/pdf, image/jpeg,image/jpg,image/png,
                                                    .csv, .xlsx, .xls,
                                                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                onChange={(e) => {
                                                  this.uploadAttachment(
                                                    e.target.files
                                                  );
                                                }}
                                                onClick={(event) => {
                                                  event.currentTarget.value = null;
                                                }} //to upload the same file again
                                              />

                                              <label
                                                className="upload-label"
                                                htmlFor="fileElem-sup"
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

                                            <div className="exp_upload_files exp_upload2">
                                              <ul>
                                                {this.state.attachments.map(
                                                  (a, i) => {
                                                    return (
                                                      <li className="blue_li w-50">
                                                        <span className="fa fa-file"></span>
                                                        <p
                                                          className="cursorPointer"
                                                          onClick={() =>
                                                            this.getAttachment(
                                                              a.recordID,
                                                              a.fileName
                                                            )
                                                          }
                                                        >
                                                          {" "}
                                                          {a.fileName || ""}
                                                        </p>
                                                        <span
                                                          onClick={() => {
                                                            this.deleteAttachment(
                                                              a.recordID
                                                            );
                                                          }}
                                                          className="cursorPointer fa fa-times"
                                                        ></span>
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <SupplierFilterModal
          openSupplierFilterModal={this.state.openSupplierFilterModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  supplier: state.supplier,
  chart: state.chart,
});
export default connect(mapStateToProps, {
  getSupplierDetails: SupplierActions.getSupplierDetails,

  updateSupplierDetails: SupplierActions.updateSupplierDetails,
  insertSupplierDetails: SupplierActions.insertSupplierDetails,
  addSupAttachments: SupplierActions.addSupAttachments,
  getAttachment: SupplierActions.getAttachment,
  deleteSupAttachments: SupplierActions.deleteSupAttachments,
  deleteSuppliersContact: SupplierActions.deleteSuppliersContact,
  getCurrencies: ChartActions.getCurrencies,
  getTaxCodes: ChartActions.getTaxCodes,
  clearChartStates: ChartActions.clearChartStates,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearStatesAfterLogout,
})(SupplierForm);
