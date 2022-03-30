import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import $ from "jquery";
import { toast } from "react-toastify";

import Header from "../Common/Header/Header";
import { connect } from "react-redux";
import TopNav from "../Common/TopNav/TopNav";
import SupplierFilterModal from "../Modals/SupplierFilter/SupplierFilter";
import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import {
  handleAPIErr,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";

class AddEditSupplier extends Component {
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
      editPOSupplier: false, //when edit the supplier from the PO suppliers Modal

      detailsListSearch: "",
      showHiddenRows: false,
      detailsList: [], //suppliers details List -> containing tracking codes, chart codes etc details
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      suppliersActivity: [], //a suppliers activity
      openSupplierFilterModal: false,

      formErrors: {
        name: "",
        currency: "",
      },
      sortFilter: "name",
      sortFilterCheck: "DESC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC
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

    //adding drag and drop attachments listeners
    addDragAndDropFileListners("drop-area-supplier", this.uploadAttachment);
    //end

    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });

    this.setState({ isLoading: true });

    let promises = [];

    let isCurrencies = false;
    if (this.props.chart.getCurrencies.length > 0) {
      isCurrencies = true;
    } else {
      promises.push(this.props.getCurrencies());
    }

    let isTaxCodes = false;
    if (this.props.chart.getTaxCodes.length === 0) {
      promises.push(this.props.getTaxCodes());
    } else {
      isTaxCodes = true;
    }

    await Promise.all(promises);

    //success case of Get Currencies
    if (this.props.chart.getCurrenciesSuccess || isCurrencies) {
      // toast.success(this.props.chart.getCurrenciesSuccess);
      //currencies list
      if (this.props.chart.getCurrencies.length > 0) {
        let currencies = this.props.chart.getCurrencies || [];
        let crncyArr = [{ label: "Select Currency", value: "" }];
        currencies.map((c, i) => {
          crncyArr.push({
            label: c.description + " (" + c.code + ")",
            value: c.code,
          });
        });
        this.setState({
          currencyList: crncyArr,
        });
      }
    }
    //error case of Get Currencies
    if (this.props.chart.getCurrenciesError) {
      handleAPIErr(this.props.chart.getCurrenciesError, this.props);
    }
    //success case of Get Tax Codes
    if (this.props.chart.getTaxCodesSuccess || isTaxCodes) {
      // toast.success(this.props.chart.getTaxCodesSuccess);
      let taxCodes = this.props.chart.getTaxCodes || [];
      let tc = [{ label: "Select Tax Codes", value: "" }];
      taxCodes.map((t, i) => {
        tc.push({
          label: t.description + " (" + t.code + ")",
          value: t.code,
        });
      });
      this.setState({ taxCodeList: tc });
    }
    //error case of Get Tax Codes
    if (this.props.chart.getTaxCodesError) {
      handleAPIErr(this.props.chart.getTaxCodesError, this.props);
    }
    // -------------------------------END--------------------------------

    await this.primeSupplierDetails();

    this.setState({ isLoading: false });

    //invoice-edit: Vendor inline edit name and then '+ Create supplier from "what he has typed"
    let state = this.props.location.state || "";
    if (state && state.page && state.supplierName) {
      this.setState({ name: state.supplierName });
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-supplier", this.uploadAttachment);
  }

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  /*
  First, you will need to prime the values of the Supplier by calling PrimeSupplierDetails. 
  This will provide you with a supplierID that can be used to add attachments and contacts before the 
  supplier has been completed. Saving a new supplier will call the InsertSupplierDetails request. 
  */
  primeSupplierDetails = async () => {
    this.setState({ isLoading: true });
    this.clearStates();
    await this.props.primeSupplierDetails();

    //success case of prime Supplier Details
    if (this.props.supplier.primeSupplierDetailsSuccess) {
      toast.success(this.props.supplier.primeSupplierDetailsSuccess);

      let supplierDetails = this.props.supplier.primeSupplierDetails || "";
      let currency_obj = this.state.currencyList.find(
        (cl) => cl.value == supplierDetails.currency
      );

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

      let supplierID = supplierDetails.supplierID || "";
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
        // else if (d.valueType && d.valueType.toLowerCase() === "date") {
        //   d.value = new Date(d.value).getTime();
        // }
        return d;
      });
      this.setState({
        currency: currency_obj || { label: "Select Currency", value: "" },
        taxCode,
        supplierID,
        type,
        typeOptions,
        detailsList,
        clonedDetailsList: detailsList,
      });
    }

    //error case of prime Supplier Details
    if (this.props.supplier.primeSupplierDetailsError) {
      handleAPIErr(this.props.supplier.primeSupplierDetailsError, this.props);
    }
    this.props.clearSupplierStates();
    this.setState({ isLoading: false });
  };

  clearStates = () => {
    this.setState({
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
      detailsList: [],
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      suppliersActivity: [], //supplier's activity
    });
  };

  handleSelectFields = (data, name) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, data.value, formErrors);
    this.setState({ [name]: data, formErrors });
  };

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    const { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  //when  click to Company OR Postal to change addressess accordingly
  handleComanyPostal = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
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
        if (size <= 10485760) {
          //10MB = 10485760 Bytes
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
      handleAPIErr(this.props.supplier.addSupAttachmentsError, this.props);
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
      handleAPIErr(this.props.supplier.deleteSupAttachmentsError, this.props);
    }
    this.props.clearSupplierStates();
    this.setState({ isLoading: false });
  };

  handleValueOptions = (type, val, item, index) => {
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

  onDetailsListSearch = (e) => {
    let searchedText = e.target.value;
    this.setState({ detailsListSearch: searchedText });

    const clonedDetailsList = this.state.clonedDetailsList;

    if (!searchedText) {
      this.setState({ detailsList: clonedDetailsList });
    } else {
      let detailsListFilterdData = [];
      detailsListFilterdData = clonedDetailsList.filter((c) => {
        return (
          c.category.toUpperCase().includes(searchedText.toUpperCase()) ||
          c.description.toUpperCase().includes(searchedText.toUpperCase()) ||
          (c.valueType === "Date"
            ? Date(c.value).toUpperCase().includes(searchedText.toUpperCase())
            : c.value.toUpperCase().includes(searchedText.toUpperCase()))
        );
      });
      this.setState({ detailsList: detailsListFilterdData });
    }
  };
  handleShowHiddenRows = () => {
    this.setState((state) => ({
      showHiddenRows: !state["showHiddenRows"],
    }));

    let { showHiddenRows } = this.state;
    const clonedDetailsList = this.state.clonedDetailsList;

    if (showHiddenRows) {
      this.setState({ detailsList: clonedDetailsList });
    }
  };

  handleHideCheckbox = (row, index) => {
    let detailsList = JSON.parse(JSON.stringify(this.state.detailsList));
    if (index > -1) {
      detailsList.splice(index, 1);
      this.setState({ detailsList, showHiddenRows: false });
    }
  };

  //ADD Supplier's contact -> when click to + button on contacts
  addContact = () => {
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
          handleAPIErr(
            this.props.supplier.deleteSuppliersContactError,
            this.props
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

  //may be used later
  handleContactCheckboxes1 = async (e, contact, index) => {
    let { contacts, allContactsCheck } = this.state;
    if (contact === "all") {
      if (e.target.checked) {
        contacts.map((c, i) => {
          c.checked = true;
          return c;
        });
      } else {
        contacts.map((c, i) => {
          c.checked = false;
          return c;
        });
      }
      this.setState({ contacts, allContactsCheck: e.target.checked });
    } else {
      if (e.target.checked) {
        contact.checked = e.target.checked;
        contacts[index] = contact;

        let _check = contacts.findIndex((c) => c.checked === false);
        if (_check === -1) {
          allContactsCheck = true;
        }
        this.setState({ contacts, allContactsCheck });
      } else {
        contact.checked = e.target.checked;
        contacts[index] = contact;
        this.setState({ allContactsCheck: false, contacts });
      }
    }
  };

  handleContactCheckboxes = async (e, contact, index) => {
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

  //when change details in contcts fields
  hanldeChangeContact = (e, contact, index) => {
    let name = e.target.name;
    let value = e.target.value;
    let { contacts } = this.state;
    contact[name] = value;
    contacts[index] = contact;
    this.setState({ contacts });
  };

  onFocus = (e) => {
    let id = e.target.id;
    this.setState({ [id]: true });
  };

  onBlur = (e) => {
    let id = e.target.id;
    this.setState({ [id]: false });
  };

  onSave = async (e) => {
    e.preventDefault();
    let {
      code,
      currency,
      name,
      type,
      email,
      taxID,
      supplierID,
      taxCode,
      sortFilter,
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
      //detail list
      detailsList,
      //contacts
      contacts,
      formErrors,
    } = this.state;

    formErrors = Validation.handleWholeValidation(
      { currency: currency.value, name },
      formErrors
    );

    if (!formErrors.name && !formErrors.currency) {
      this.setState({ isLoading: true });

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
        supplierID,
        supplier: {
          currency: currency.value,
          name,
          type: type.value,
          email,
          taxID,
          taxCode: taxCode.value,
          companyAddress,
          postalAddress,
          detailsList,
          contacts,
        },
      };

      await this.props.insertSupplierDetails(data);

      //success case of insert Supplier Details
      if (this.props.supplier.insertSupplierDetailsSuccess) {
        toast.success(this.props.supplier.insertSupplierDetailsSuccess);

        var supplier = this.props.supplier.insertSupplierDetails || "";
        var stateObj = this.props.location.state || "";

        if (stateObj.stateData && stateObj.page) {
          let stateData = stateObj.stateData;

          let supObj = {
            address: "",
            checked: false,
            city: "",
            code: supplier.supplierCode,
            country: "",
            currency: supplier.currency,
            email: supplier.email,
            id: "",
            locked: "N",
            name: supplier.name,
            postcode: "",
            state: "",
            taxID: "",
          };

          let supplierName = supplier.name || "";
          supplierName =
            supplierName === "Select Vendor from list" ||
            supplierName === "*No Supplier Selected*" ||
            supplierName === "*No Supplier Selected*.."
              ? ""
              : supplierName || "";

          stateData.suppliersList.push(supObj);
          stateData.supplierName = supplierName;
          stateData.supplierCode = supplier.supplierCode || "";
          stateData.currency = supplier.currency || "";

          if (stateObj.page === "editInvoice") {
            this.props.history.push("/invoice-edit", {
              stateData,
              isNew: true,
            });
          } else if (stateObj.page === "addNewInvoice") {
            this.props.history.push("/add-new-invoice", {
              stateData,
            });
          } else if (stateObj.page === "newPOedit") {
            let { address, address2, city, state, postcode, country } =
              supplier.companyAddress;
            let supplierAddress =
              address +
              " " +
              address2 +
              " " +
              city +
              " " +
              state +
              " " +
              postcode +
              " " +
              country;
            stateData.supplierAddress = supplierAddress || "";
            stateData.supplierContact = "";
            stateData.supplierEmail = supplier.email;
            stateData.supplierPhone = "";
            stateData.contacts = [];
            this.props.history.push("/new-purchase-order", {
              stateData,
            });
          } else if (stateObj.page === "orders") {
            let { address, address2, city, state, postcode, country } =
              supplier.companyAddress;
            let supplierAddress =
              address +
              " " +
              address2 +
              " " +
              city +
              " " +
              state +
              " " +
              postcode +
              " " +
              country;
            stateData.supplierAddress = supplierAddress || "";
            stateData.supplierContact = "";
            stateData.supplierEmail = supplier.email;
            stateData.supplierPhone = "";
            this.props.history.push("/order", {
              stateData,
              poSupplier: true,
              isNewSupplier: true,
            });
          } else if (stateObj.page === "addEditExpense") {
            this.props.history.push("/expense-form", {
              stateData,
            });
          } else {
            this.props.history.push("/dashboard");
          }
        } else {
          this.props.history.push("/dashboard");
        }
      }
      //error case of insert Supplier
      if (this.props.supplier.insertSupplierDetailsError) {
        handleAPIErr(
          this.props.supplier.insertSupplierDetailsError,
          this.props
        );
      }

      this.props.clearSupplierStates();
      this.setState({ isLoading: false });
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  onCancel = () => {
    let state =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";

    if (state.stateData && state.page && state.page === "newPOedit") {
      this.props.history.push("/new-purchase-order", {
        stateData: state.stateData,
      });
    } else if (
      state.stateData &&
      state.page &&
      state.page === "addNewInvoice"
    ) {
      this.props.history.push("/add-new-invoice", {
        stateData: state.stateData,
      });
    } else if (state.stateData && state.page && state.page === "editInvoice") {
      this.props.history.push("/invoice-edit", {
        stateData: state.stateData,
      });
    } else if (state.stateData && state.page && state.page === "orders") {
      this.props.history.push("/order", {
        stateData: state.stateData,
        poSupplier: true,
      });
    } else if (
      state.stateData &&
      state.page &&
      state.page === "addEditExpense"
    ) {
      this.props.history.push("/expense-form", {
        stateData: state.stateData,
      });
    } else {
      this.props.history.push("/dashboard");
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} newSupplier={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section className="supplier">
              <form onSubmit={this.onSave}>
                <div className="container-fluid ">
                  <div className="mt-2 main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center h-60vh">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad">
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
                                    type="submit"
                                    className={
                                      this.state.id_save
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2140"
                                    id="id_save"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                  >
                                    <span className="fa fa-check"></span>
                                    Save
                                  </button>

                                  <button
                                    tabIndex="2141"
                                    type="button"
                                    id="id_disc"
                                    className={
                                      this.state.id_disc
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    onClick={this.onCancel}
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
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
                                      this.handleSelectFields(e, "currency")
                                    }
                                    classNamePrefix="custon_select-selector-inner"
                                    options={this.state.currencyList}
                                    autoFocus={true}
                                    tabIndex="2121"
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
                                    {this.state.formErrors.currency !== ""
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
                                    tabIndex="2122"
                                    onChange={(e) =>
                                      this.handleSelectFields(e, "type")
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
                                      tabIndex="2123"
                                      value={this.state.name}
                                      onChange={this.handleFieldChange}
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
                                      tabIndex="2124"
                                      value={this.state.email}
                                      onChange={this.handleFieldChange}
                                    />
                                    <label className="move_label inactive pt-2">
                                      Email
                                    </label>
                                  </div>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.email !== ""
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
                                      tabIndex="2125"
                                      value={this.state.taxID}
                                      onChange={this.handleFieldChange}
                                    />
                                    <label className="move_label inactive pt-2">
                                      Tax ID
                                    </label>
                                  </div>
                                  <div className="text-danger error-12">
                                    {this.state.formErrors.taxID !== ""
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
                                    tabIndex="2126"
                                    onChange={(e) =>
                                      this.handleSelectFields(e, "taxCode")
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
                                      <label
                                        htmlFor="radio1"
                                        className="co_postaol_radio"
                                      >
                                        <input
                                          name="comanyPostalCheck"
                                          type="radio"
                                          id="radio1"
                                          value="company"
                                          tabIndex="2127"
                                          checked={
                                            this.state.comanyPostalCheck ===
                                            "company"
                                          }
                                          onChange={this.handleComanyPostal}
                                        />
                                        Company
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-auto pt-3">
                                    <div className="form-group">
                                      <label
                                        htmlFor="radio12"
                                        className="co_postaol_radio"
                                      >
                                        <input
                                          name="comanyPostalCheck"
                                          type="radio"
                                          id="radio12"
                                          value="postal"
                                          tabIndex="2128"
                                          checked={
                                            this.state.comanyPostalCheck ===
                                            "postal"
                                          }
                                          onChange={this.handleComanyPostal}
                                        />
                                        Postal
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {this.state.comanyPostalCheck === "company" && (
                                <>
                                  <div className="col-md-6">
                                    <div className="form-group custon_select">
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control mt-0"
                                          id="usr"
                                          name="compAddress"
                                          tabIndex="2129"
                                          value={this.state.compAddress}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2130"
                                          value={this.state.compAddress2}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2131"
                                          value={this.state.compCity}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2132"
                                          value={this.state.compState}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2133"
                                          value={this.state.compPostcode}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2134"
                                          value={this.state.compCountry}
                                          onChange={this.handleFieldChange}
                                        />
                                        <label className="move_label inactive pt-2">
                                          Country
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {this.state.comanyPostalCheck === "postal" && (
                                <>
                                  <div className="col-md-6">
                                    <div className="form-group custon_select">
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control mt-0"
                                          id="usr"
                                          name="postAddress"
                                          tabIndex="2129"
                                          value={this.state.postAddress}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2130"
                                          value={this.state.postAddress2}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2131"
                                          value={this.state.postCity}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2132"
                                          value={this.state.postState}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2133"
                                          value={this.state.postPostcode}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="2134"
                                          value={this.state.postCountry}
                                          onChange={this.handleFieldChange}
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
                                      alt="cross"
                                      className="float-right pr-2 pop-cros-1"
                                    />
                                  </h2>
                                </div>

                                <div className="clear"></div>
                                <div className="col-sm-12 p-0 filter_table_1">
                                  <p className="nofilter">
                                    No filters active applied to this view
                                  </p>
                                </div>
                              </div>
                              <div className="clear20"></div>
                              <div className="col-sm-12 p-0 active_filters">
                                <h2>Active Filters</h2>
                                <div className="save-filter">
                                  <span
                                    onClick={() =>
                                      this.openModal("openSupplierFilterModal")
                                    }
                                  >
                                    Save filter
                                  </span>
                                </div>
                                <ul className="active_filter_list">
                                  <li>
                                    <span>
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
                                    </span>
                                    Kp test
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
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
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
                                    </span>
                                    Kp test
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
                                    </span>
                                    s
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
                                    </span>
                                    Kp test
                                  </li>
                                  <li>
                                    <span>
                                      <img
                                        src="images/close-icon-gray.png"
                                        alt="close"
                                      />
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
                                      this.setState({ filter_dropdpwn2: true })
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
                                      <li className="">Doesn't contain</li>
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

                            <div className="col-12 col-lg-4 col-md-6 pl-md-0 mt-4">
                              <div className="d-flex justify-content-center h-100">
                                <div className="searchbar">
                                  <input
                                    className="search_input"
                                    type="text"
                                    name=""
                                    placeholder="Search..."
                                    name="detailsListSearch"
                                    value={this.state.detailsListSearch}
                                    onChange={this.onDetailsListSearch}
                                    tabIndex="2135"
                                  />
                                  <a
                                    href="javascript:void(0)"
                                    className="search_icon search-boredr"
                                    tabIndex="-1"
                                  >
                                    <i className="fa fa-search"></i>
                                  </a>
                                  <a
                                    href="javascript:void(0)"
                                    className="search_icon"
                                    tabIndex="-1"
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
                                          <th scope="col" className="text-left">
                                            Category
                                          </th>
                                          <th scope="col">Description</th>
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
                                                          Show Hidden Rows
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
                                        {this.state.detailsList.map((d, i) => {
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
                                                        name={"chk1"}
                                                        id={"chk1"}
                                                        checked={false}
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

                                              <td>{d.description}</td>
                                              {d.valueType === "List" ? (
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
                                                      label: d.value,
                                                      value: d.value,
                                                    }}
                                                    options={d.valueOptions}
                                                    onChange={(obj) =>
                                                      this.handleValueOptions(
                                                        "list",
                                                        obj,
                                                        d,
                                                        i
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
                                                </td>
                                              ) : d.valueType === "Date" ? (
                                                <td>
                                                  <div className="input_width">
                                                    <DatePicker
                                                      selected={Number(d.value)}
                                                      dateFormat="d MMM yyyy"
                                                      autoComplete="off"
                                                      onChange={(date) =>
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
                                              ) : d.valueType === "Check" ? (
                                                <td>
                                                  <div className="col-auto mb-2 pr-0">
                                                    <div className="form-group remember_check text-center">
                                                      <input
                                                        type="checkbox"
                                                        id="1w"
                                                        checked={
                                                          d.value === "Y" ||
                                                          d.value === "1"
                                                            ? true
                                                            : false
                                                        }
                                                        onChange={(e) =>
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
                                              ) : d.valueType === "Numeric" ? (
                                                <td>
                                                  <div className="input_width">
                                                    <input
                                                      type="number"
                                                      value={d.value}
                                                      onChange={(e) =>
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
                                              ) : d.valueType === "Text" ? (
                                                <td>
                                                  <div className="input_width">
                                                    <input
                                                      type="text"
                                                      value={d.value}
                                                      onChange={(e) =>
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
                                                        name={"chk1"}
                                                        id={"chk1"}
                                                        checked={false}
                                                        onChange={(e) =>
                                                          this.handleHideCheckbox(
                                                            d,
                                                            i
                                                          )
                                                        }
                                                      />
                                                      <span
                                                        id="chk1"
                                                        className="dash_checkmark  "
                                                      ></span>
                                                    </label>
                                                  </div>
                                                </div>
                                              </td>
                                              <td></td>
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
                                          <th scope="col" className="text-left">
                                            Contact Name
                                          </th>
                                          <th scope="col">Email</th>
                                          <th scope="col">Phone Number</th>
                                          <th scope="col">
                                            <span className="fa fa-bars"></span>
                                          </th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.state.contacts.map((c, i) => {
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
                                                        name={"chk1"}
                                                        id={"chk1" + i}
                                                        checked={c.checked}
                                                        onChange={(e) =>
                                                          this.handleContactCheckboxes(
                                                            e,
                                                            c,
                                                            i
                                                          )
                                                        }
                                                      />
                                                      <span
                                                        id={"chk1" + i}
                                                        className="dash_checkmark"
                                                      ></span>
                                                    </label>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-left">
                                                <input
                                                  type="text"
                                                  className="input_height sup_modal_contacs"
                                                  autoFocus={c.autoFocus}
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
                                                  value={c.phone}
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
                                        })}
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
                                <div className="form-group custon_select">
                                  <div
                                    id="drop-area-supplier"
                                    className="exp_drag_area"
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
                                        this.uploadAttachment(e.target.files);
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

                                  <div className="exp_upload_files">
                                    <ul>
                                      {this.state.attachments.map((a, i) => {
                                        return (
                                          <li className={"blue_li"}>
                                            <span className="fa fa-file"></span>
                                            <p>{a.fileName || ""}</p>
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
                                      })}
                                    </ul>
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
              </form>
            </section>
          </div>
        </div>

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
  primeSupplierDetails: SupplierActions.primeSupplierDetails,
  insertSupplierDetails: SupplierActions.insertSupplierDetails,
  addSupAttachments: SupplierActions.addSupAttachments,
  deleteSupAttachments: SupplierActions.deleteSupAttachments,
  deleteSuppliersContact: SupplierActions.deleteSuppliersContact,
  getCurrencies: ChartActions.getCurrencies,
  getTaxCodes: ChartActions.getTaxCodes,
  clearChartStates: ChartActions.clearChartStates,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearStatesAfterLogout,
})(AddEditSupplier);
