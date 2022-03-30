import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import $ from "jquery";
import store from "../../Store/index";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import Header from "../Common/Header/Header";
import { connect } from "react-redux";
import TopNav from "../Common/TopNav/TopNav";
import SupplierFilterModal from "../Modals/SupplierFilter/SupplierFilter";
import Import from "../Modals/Import/Import";
import Report from "../Modals/Report/Report";
import SupplierActivity from "../Modals/SupplierActivity/SupplierActivity";
import Payments from "../Modals/Payments/Payments";
import Transactions from "../Modals/Transactions/Transactions";

import * as UserActions from "../../Actions/UserActions/UserActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as InvoiceActions from "../../Actions/InvoiceActions/InvoiceActions";
import * as PaymentActions from "../../Actions/PaymentActions/PaymentActions";
import * as Helpers from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";
const uuidv1 = require("uuid/v1");

class Supplier extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      multipleSupplierIDs: [], //contains supplierIDs, use for exporting
      clonedSuppliersList: [], //a copy of  suppliersList
      suppliersListSearch: "", //when a user searches on suppliers list
      activeSupplier: "", //to add active class when click on one supplier in supplier's list

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
      companyPostalCheck: "company",

      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes list

      detailsListSearch: "",
      showHiddenRows: false,
      detailsList: [], //suppliers details List -> containing tracking codes, chart codes etc details
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      supplierDistribution: [],
      suppliersActivity: [], //a suppliers activity
      openSupplierFilterModal: false,
      openImportModal: false,
      openReportModal: false,
      openActivityModal: false,
      openPaymentsModal: false,
      openTransactionModal: false,
      openSettingsModal: false,
      formErrors: {
        name: "",
        currency: "",
      },
      sortFilter: "name",
      sortFilterCheck: "DESC", //to check the sort is in ascending OR descending Order  Ascending -> ASC, Descending -> DESC

      //Details Filters
      filtersArr: [], // a collection of filters e.g [{filter: 'category', condition: 'equal', value: 'settings'},{filter: 'description', condition: 'equal', value: 'abc'}]
      // showDate: false, //in filters second popup when click on rate date
      fltrsColmnFirst: [
        { id: "1", filter: "category", name: "Category", checked: false },
        { id: "2", filter: "description", name: "Description", checked: false },
        { id: "3", filter: "value", name: "Value", checked: false },
      ],
      fltrsColmnSecond: [
        { id: "4", condition: "Contains", checked: false },
        { id: "5", condition: "Doesn't contain", checked: false },
        { id: "6", condition: "Equal", checked: false },
        { id: "7", condition: "Not Equal", checked: false },
        { id: "8", condition: "Starts With", checked: false },
        { id: "9", condition: "Over", checked: false },
        { id: "10", condition: "Under", checked: false },
        { id: "11", condition: "Over Equal", checked: false },
        { id: "12", condition: "Under Equal", checked: false },
      ],
      filterValue: "",
      filterRadioGroup: "OR",
      checkFltr: "", //to check which filter is going to add either active or workspace
      pageLength: 10,
      //active filters
      activeFilters: [], //active filters
      workSpaceFilters: [], //workspace filters

      payments: [],
      transactions: [],
      checkAll: false,
      defaultUserFlags: [],
      columns: [],
    };
    //End Filters
  }

  async componentDidMount() {
    $(document).ready(function () {
      $(".sideBarAccord").click(function () {
        $(this).toggleClass("rorate_0");
      });

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
      $(".export_crd").click(function () {
        $(".export_crd .sideBarAccord1").toggleClass("rotate_0");
      });
      $(".icon_dots").click(function () {
        $(".documents_attatchments2").toggleClass("doc_sidebar2");
      });
    });

    //adding drag and drop attachments listeners
    Helpers.addDragAndDropFileListners(
      "drop-area-supplier",
      this.uploadAttachment
    );
    //end

    this.setState({ isLoading: true });

    let promises = [];
    let defaultUserFlags = [];

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

    if (!this.props.user.getDefaultValues) {
      let defVals = localStorage.getItem("getDefaultValues") || "";
      defVals = defVals ? JSON.parse(defVals) : "";
      if (defVals && defVals.defaultValues) {
        //if localstorage contains the default values then update the Redux State no need to call API
        store.dispatch({
          type: "GET_DEFAULT_VALUES_SUCCESS",
          payload: defVals,
        });
      } else {
        promises.push(this.props.getDefaultValues());
      }
    }

    promises.push(this.props.getSuppliersList());

    promises.push(this.getChartCodes());

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
          return c;
        });
        this.setState({
          currencyList: crncyArr,
        });
      }
    }
    //error case of Get Currencies
    if (this.props.chart.getCurrenciesError) {
      Helpers.handleAPIErr(this.props.chart.getCurrenciesError, this.props);
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
      Helpers.handleAPIErr(this.props.chart.getTaxCodesError, this.props);
    }
    //success case of Get Suppliers List
    if (this.props.supplier.getSuppliersListSuccess) {
      // toast.success(this.props.supplier.getSuppliersListSuccess);
      let suppliersList = this.props.supplier.getSuppliersList || [];
      suppliersList.map((s, i) => {
        s.id = uuidv1();
        s.checked = false;
        return s;
      });

      //-----when comming to search page and show that seleced supplier----
      let code = this.state.code || "";
      let currency = this.state.currency.value || "";
      let sup = suppliersList.find(
        (l) => l.currency === currency && l.code === code
      );

      if (sup) {
        this.setState({ activeSupplier: sup.id });
      }
      this.setState({
        suppliersList: suppliersList || [],
        clonedSuppliersList: suppliersList || [], //a copy of suppliers list
      });
      // this.handleSortSupplierLists("name");

      var elmnt = document.getElementById(this.state.activeSupplier);
      if (elmnt) {
        elmnt.scrollIntoView();
      }
      // ------END-------
    }
    //error case of Get Suppliers List
    if (this.props.supplier.getSuppliersListError) {
      Helpers.handleAPIErr(
        this.props.supplier.getSuppliersListError,
        this.props
      );
    }
    //success case of get default vaues
    if (this.props.user.getDefaultValuesSuccess) {
      // toast.success(this.props.user.getDefaultValuesSuccess);
    }
    //error case of get default vaues
    if (this.props.user.getDefaultValuesError) {
      Helpers.handleAPIErr(this.props.user.getDefaultValuesError, this.props);
    }

    if (
      this.props.user.getDefaultValues &&
      this.props.user.getDefaultValues.flags.length > 0
    ) {
      this.props.user.getDefaultValues.flags.map((u, i) => {
        let obj = {
          value: "",
          length: u.length,
          prompt: u.prompt,
          sequence: u.sequence,
          type: u.type,
        };
        defaultUserFlags.push(obj);
      });
    }
    this.setState({ isLoading: false, defaultUserFlags });

    this.props.clearUserStates();
    this.props.clearChartStates();

    if (
      !this.props.isNewSupplier &&
      this.state.activeSupplier === "" &&
      this.state.suppliersList.length > 0 &&
      this.state.code === ""
    ) {
      //first time when user comes to suppleir page and then show a first supplier from the supplier's list
      let supplier = this.state.suppliersList[0];
      let currency = supplier.currency || "";
      let code = supplier.code || "";
      let id = supplier.id || "";
      if (currency && code && id) {
        let suppler = {
          currency,
          code,
          id,
        };
        await this.getSupplierDetails(suppler);
      }
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    Helpers.removeDragAndDropFileListners(
      "drop-area-supplier",
      this.uploadAttachment
    );
  }

  //get info of single supplier
  getSupplierDetails = async (supplier) => {
    let activeSupplier = this.state.activeSupplier;
    if (activeSupplier != supplier.id) {
      let supplierDetails = {
        currency: supplier.currency,
        code: supplier.code,
      };
      this.clearStates();
      this.setState({ isLoading: true, activeSupplier: supplier.id });

      await this.props.getSupplierDetails(supplierDetails);

      //success case of Get  Supplier Details
      if (this.props.supplier.getSupplierDetailsSuccess) {
        // toast.success(this.props.supplier.getSupplierDetailsSuccess);

        let currency_obj = this.state.currencyList.find(
          (cl) => cl.value == this.props.supplier.getSupplierDetails.currency
        );

        let supplierDetails = this.props.supplier.getSupplierDetails || "";

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
          let code = taxCodeList.find(
            (t) => t.value === supplierDetails.taxCode
          );
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
        let hideSupList = JSON.parse(
          localStorage.getItem("hideSupList") || "[]"
        );

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
          c.phone = c.phoneNumber || "";
          return c;
        });
        let attachments = supplierDetails.attachments || [];

        let supplierDistribution =
          this.props.supplier.supplierDistribution || [];
        supplierDistribution.map((d) => (d.checked = false));

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
          supplierDistribution,
        });
      }
      //error case of Get  Supplier
      if (this.props.supplier.getSupplierDetailsError) {
        Helpers.handleAPIErr(
          this.props.supplier.getSupplierDetailsError,
          this.props
        );
      }
      this.props.clearSupplierStates();
      this.setState({ isLoading: false });

      //getting the Active and Workspace Filter Form LocalStorage
      let _ActiveFilters = JSON.parse(
        localStorage.getItem("ActiveFilters") || "[]"
      );
      let _WorkSpaceFilters = JSON.parse(
        localStorage.getItem("WorkSpaceFilters") || "[]"
      );

      let activeFilters = [];
      let workSpaceFilters = [];
      let userLogin = localStorage.getItem("userLogin");

      if (_ActiveFilters.length > 0) {
        _ActiveFilters.map((a, i) => {
          if (a.userLogin === userLogin) {
            activeFilters = a.Filters || [];
          }
        });
      }

      if (_WorkSpaceFilters.length > 0) {
        _WorkSpaceFilters.map((w, i) => {
          if (w.userLogin === userLogin) {
            workSpaceFilters = w.Filters || [];
          }
        });
      }
      this.setState({ activeFilters, workSpaceFilters });
    }
  };

  openModal = (name) => {
    this.setState({ [name]: true }, () => {
      if (
        name === "openActivityModal" ||
        name === "openPaymentsModal" ||
        name === "openTransactionModal"
      ) {
        let columns = [];
        let aoColumns = [];
        let modalName = "";
        if (name === "openActivityModal") {
          columns = [
            { name: "User", hide: false },
            { name: "Description", hide: false },
            { name: "Date & Time", hide: false },
            { name: "IP Address", hide: false },
          ];

          //adding the column names
          columns.map((c) => aoColumns.push({ sName: c.name }));
          aoColumns[columns.length] = { sName: "menus" };

          //adding the column names
          aoColumns[0] = { sName: "User" };
          aoColumns[1] = { sName: "Description" };
          aoColumns[2] = { sName: "Date & Time" };
          aoColumns[3] = { sName: "IP Address" };
          aoColumns[4] = { sName: "menus" };
          modalName = "supplierActivity";
        } else if (name === "openPaymentsModal") {
          columns = [
            { name: "Cheque", hide: false },
            { name: "ChqDate", hide: false },
            { name: "Status", hide: false },
            { name: "Amount", hide: false },
            { name: "Cu", hide: false },
            { name: "Pres", hide: false },
            { name: "PresDate", hide: false },
            { name: "Bank", hide: false },
            { name: "PosPay", hide: false },
          ];
          //adding the column names
          aoColumns[0] = { sName: "checkbox" };
          columns.map((c) => aoColumns.push({ sName: c.name }));
          aoColumns[columns.length + 1] = { sName: "menus" };

          modalName = "payments";
        } else if (name === "openTransactionModal") {
          columns = [
            { name: "Amount", hide: false },
            { name: "Cu", hide: false },
            { name: "Invoice", hide: false },
            { name: "InvDate", hide: false },
            { name: "DueDate", hide: false },
            { name: "Reference", hide: false },
            { name: "Bank", hide: false },
            { name: "Sep", hide: false },
            { name: "Hold", hide: false },
            { name: "Cheque", hide: false },
            { name: "ChqDate", hide: false },
            { name: "PresDate", hide: false },
            { name: "Period", hide: false },
            { name: "Voucher", hide: false },
            { name: "Batch", hide: false },
            { name: "Tran", hide: false },
          ];
          //adding the column names
          aoColumns[0] = { sName: "checkbox" };
          columns.map((c) => aoColumns.push({ sName: c.name }));
          aoColumns[columns.length + 1] = { sName: "menus" };
          modalName = "transactions";
        }
        let result = Helpers.tableSetting(columns, aoColumns, modalName);
        this.setState({ ...result, columns });
      }
    });
  };

  closeModal = (name) => {
    let { columns, pageLength, checkAll } = this.state;
    if (
      name === "openActivityModal" ||
      name === "openPaymentsModal" ||
      name === "openTransactionModal"
    ) {
      columns = [];
      pageLength = "";
      checkAll = false;
    }
    this.setState({ [name]: false, columns, pageLength, checkAll });
  };

  //when a user searches on suppliers list
  onSuppliersListSearch = async (e) => {
    let searchedText = e.target.value;
    const clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.clonedSuppliersList)
    );

    let { suppliersList, code } = this.state;
    if (!searchedText) {
      suppliersList = clonedSuppliersList;
      //to show selected supplier in the list
      let sup = suppliersList.find((s) => s.code === code);
      if (sup) {
        this.setState({ activeSupplier: sup.id }, () => {
          // scroll to  seleced supplier
          var elmnt = document.getElementById(sup.id);
          if (elmnt) {
            elmnt.scrollIntoView();
          }
        });
      }
    } else {
      let suppliersListFilterdData = [];
      suppliersListFilterdData = clonedSuppliersList.filter((c) => {
        return (
          c.name.toUpperCase().includes(searchedText.toUpperCase()) ||
          c.email.toUpperCase().includes(searchedText.toUpperCase())
        );
      });
      suppliersList = suppliersListFilterdData;
    }

    this.setState({ suppliersList, suppliersListSearch: searchedText });
  };

  //sorting on supplier's list
  handleSortSupplierLists = async (name) => {
    let { sortFilterCheck, sortFilter, clonedSuppliersList } = this.state;

    if (sortFilter != name) {
      sortFilterCheck = "DESC";
    }

    if (sortFilterCheck === "DESC") {
      sortFilterCheck = "ASC";
    } else {
      sortFilterCheck = "DESC";
    }

    let suppliersListFilterdData = clonedSuppliersList.sort(function (a, b) {
      let valueA = a[name].toString().toUpperCase();
      let valueB = b[name].toString().toUpperCase();
      //for ascending order
      if (sortFilterCheck === "ASC") {
        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
        // codes must be equal
      } else {
        //for descending order

        if (valueA > valueB) {
          return -1;
        }
        if (valueA < valueB) {
          return 1;
        }
        return 0;
        // codes must be equal
      }
    });

    this.setState({
      suppliersList: suppliersListFilterdData,
      sortFilter: name,
      sortFilterCheck,
    });
  };

  clearStates = () => {
    this.setState({
      activeSupplier: "", //to add active class when click on one supplier in suppliers list
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
      companyPostalCheck: "company",
      detailsListSearch: "",
      showHiddenRows: false,
      detailsList: [],
      clonedDetailsList: [], //a copy of detailsList
      allContactsCheck: false, //check/uncheck contacts checkboxes
      contacts: [], //supplier's contacts
      attachments: [], //supplier's attachments
      supplierDistribution: [],
      suppliersActivity: [], //supplier's activity
      //Details Filters
      filtersArr: [], // a collection of filters e.g [{filter: 'category', condition: 'equal', value: 'settings'},{filter: 'description', condition: 'equal', value: 'abc'}]
      // showDate: false, //in filters second popup when click on rate date
      fltrsColmnFirst: [
        { id: "1", filter: "category", name: "Category", checked: false },
        { id: "2", filter: "description", name: "Description", checked: false },
        { id: "3", filter: "value", name: "Value", checked: false },
      ],
      fltrsColmnSecond: [
        { id: "4", condition: "Contains", checked: false },
        { id: "5", condition: "Doesn't contain", checked: false },
        { id: "6", condition: "Equal", checked: false },
        { id: "7", condition: "Not Equal", checked: false },
        { id: "8", condition: "Starts With", checked: false },
        { id: "9", condition: "Over", checked: false },
        { id: "10", condition: "Under", checked: false },
        { id: "11", condition: "Over Equal", checked: false },
        { id: "12", condition: "Under Equal", checked: false },
      ],
      filterValue: "",
      filterRadioGroup: "OR",
      checkFltr: "", //to check which filter is going to add either active or workspace

      //active filters
      activeFilters: [], //active filters
      workSpaceFilters: [], //workspace filters
      columns: [],
      //End Filters
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
          const result = await Helpers.toBase64(file).catch((e) => e);
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
      Helpers.handleAPIErr(
        this.props.supplier.addSupAttachmentsError,
        this.props
      );
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
      Helpers.handleAPIErr(
        this.props.supplier.deleteSupAttachmentsError,
        this.props
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
      Helpers.downloadAttachments(resp, fileName, true);
    }
    if (this.props.supplier.getSupAttachmentError) {
      Helpers.handleAPIErr(
        this.props.supplier.getSupAttachmentError,
        this.props
      );
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
          Helpers.handleAPIErr(
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

  //when change details in contcts fields
  hanldeChangeContact = (e, contact, index) => {
    let name = e.target.name;
    let value = e.target.value;
    let { contacts } = this.state;
    contact[name] = value;
    contacts[index] = contact;
    this.setState({ contacts });
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

  //add/edit supplier
  onSave = async () => {
    let {
      activeSupplier,
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
      suppliersList,
      clonedSuppliersList,
      supplierDistribution,
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

      if (activeSupplier === "" && code === "") {
        //Add Supplier Case
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
          supplierDistribution,
        };

        await this.props.insertSupplierDetails(data);

        //success case of insert Supplier Details
        if (this.props.supplier.insertSupplierDetailsSuccess) {
          // toast.success(this.props.supplier.insertSupplierDetailsSuccess);
          let supplierDetails = this.props.supplier.insertSupplierDetails || ""; //newly created supplier details

          let { currency, locked, name, supplierCode, email } = supplierDetails;

          let newSuplier = {
            address: "",
            city: "",
            code: supplierCode,
            country: "",
            currency,
            email,
            id: uuidv1(),
            locked,
            name,
            postcode: "",
            state: "",
            taxID: "",
          };

          suppliersList = [...suppliersList, newSuplier];

          this.setState(
            {
              code: supplierCode,
              suppliersList: suppliersList,
              clonedSuppliersList: suppliersList,
            },
            () => {
              this.handleSortSupplierLists(sortFilter);
              //to show newly created supplier in the list
              let sup = suppliersList.find((s) => s.code === supplierCode);
              if (sup) {
                this.setState({ activeSupplier: sup.id }, () => {
                  // scroll to  seleced supplier
                  let elmnt = document.getElementById(sup.id);
                  if (elmnt) {
                    elmnt.scrollIntoView();
                  }
                });
              }
            }
          );
        }

        //error case of insert Supplier
        if (this.props.supplier.insertSupplierDetailsError) {
          Helpers.handleAPIErr(
            this.props.supplier.insertSupplierDetailsError,
            this.props
          );
        }
      } else {
        //Update Supplier Case
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
            contacts,
          },
          supplierDistribution,
        };

        await this.props.updateSupplierDetails(data);

        //success case of update  Supplier Details
        if (this.props.supplier.updateSupplierDetailsSuccess) {
          toast.success(this.props.supplier.updateSupplierDetailsSuccess);
        }

        //error case of update  Supplier
        if (this.props.supplier.updateSupplierDetailsError) {
          Helpers.handleAPIErr(
            this.props.supplier.updateSupplierDetailsError,
            this.props
          );
        }
      }

      this.props.clearSupplierStates();
      this.setState({ isLoading: false });
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  //When Click to + ADD
  addSupplier = async () => {
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
      Helpers.handleAPIErr(
        this.props.supplier.primeSupplierDetailsError,
        this.props
      );
    }
    this.props.clearSupplierStates();
    this.setState({ isLoading: false });
  };

  /********Detail Filters Start*********/
  handleRadioButtons = async (e) => {
    this.setState({ filterRadioGroup: e.target.value }, async () => {
      //apply filters on detail list
      await this.filterDetailList();
    });
  };

  removeFilter = async (fltrObj, index) => {
    let _filters = this.state.filtersArr;
    let _f = _filters.filter((f, i) => i !== index);
    if (_f.length === 0) {
      this.setState({
        actvFilter: null,
        activeWorkFilter: null,
      });
    }
    this.setState(
      {
        filtersArr: _f,
      },
      async () => {
        //apply filters on Detail List
        await this.filterDetailList();
      }
    );
  };

  //conditions dropdown e.g contains, equal etc
  onChangefltrConditns = async (name, e, index) => {
    let fltrs = JSON.parse(JSON.stringify(this.state.filtersArr));
    let fltrsObj = fltrs.find((f, i) => i === index);
    fltrsObj.condition = e.target.value;
    this.setState({ filtersArr: fltrs }, async () => {
      //apply filters on Detail List
      await this.filterDetailList();
    });
  };

  filterDetailList = async () => {
    let { clonedDetailsList, showHiddenRows } = this.state;
    let list = [];
    if (showHiddenRows) {
      list = clonedDetailsList;
    } else {
      let filterdList = clonedDetailsList.filter((l) => !l.hide);
      list = filterdList;
    }

    if (list.length > 0 && this.state.filtersArr.length > 0) {
      let filtersToApply = this.state.filtersArr; // array of filter to apply on Detail List
      let filteredData = [];
      let opr = this.state.filterRadioGroup; // e.g 'AND' || 'OR'
      // list : [{category: "Tracking Code", description: "Ins", value: "", readOnly: "N", valueType: "List", …},...]
      filteredData = list.filter((c) => {
        //c e.g {category: "Tracking Code", description: "Ins", value: "", readOnly: "N", valueType: "List" ,...}
        let counter = 0; //just for to handle 'AND' case

        filtersToApply.map((f, i) => {
          //f e.g {name: "Category", filter: "category", condition: "Contains", value: "a"}
          let listVal = c[f.filter].toString().toLowerCase();
          let fltrVal = f.value.toString().toLowerCase();
          if (f.condition === "Equal") {
            if (listVal === fltrVal) {
              counter += 1;
            }
          } else if (f.condition === "Not Equal") {
            if (listVal !== fltrVal) {
              counter += 1;
            }
          } else if (f.condition === "Contains") {
            if (listVal.includes(fltrVal)) {
              counter += 1;
            }
          } else if (f.condition === "Doesn't contain") {
            if (!listVal.includes(fltrVal)) {
              counter += 1;
            }
          } else if (f.condition === "Over") {
            if (listVal > fltrVal) {
              counter += 1;
            }
          } else if (f.condition === "Under") {
            if (listVal < fltrVal) {
              counter += 1;
            }
          } else if (f.condition === "Over Equal") {
            if (listVal >= fltrVal) {
              counter += 1;
            }
          } else if (f.condition === "Under Equal") {
            if (listVal <= fltrVal) {
              counter += 1;
            }
          } else {
            //starts with
            if (listVal.startsWith(fltrVal)) {
              counter += 1;
            }
          }
        });
        let filtersToApplyLength = filtersToApply.length;

        if (opr === "AND") {
          if (filtersToApplyLength === counter) {
            //'AND' case every filter condition must be fulfill
            return true;
          } else {
            return false;
          }
        } else {
          if (counter === 0) {
            //means not found any detail according to selected filter
            return false;
          } else {
            return true;
          }
        }
      });

      this.setState({ detailsList: filteredData });
    } else {
      this.setState({ detailsList: list });
    }
  };

  saveFilters = async () => {
    let fltrsColmnFirst = this.state.fltrsColmnFirst;
    let fltrsColmnSecond = this.state.fltrsColmnSecond;
    let filterValue = this.state.filterValue;
    let checkFltrFrst = fltrsColmnFirst.find((f) => f.checked);
    let checkFltrScnd = fltrsColmnSecond.find((f) => f.checked);
    if (!checkFltrFrst || !checkFltrScnd || !filterValue.trim()) {
      toast.error("Please Select Filters and Enter Corresponding Values!");
    } else {
      let obj = {};
      obj.name = checkFltrFrst.name;
      obj.filter = checkFltrFrst.filter;
      obj.condition = checkFltrScnd.condition;
      obj.value = filterValue;

      let filtersArr = this.state.filtersArr;
      filtersArr.push(obj);
      await this.setState({ filtersArr });
      await this.closeFilterPopup();

      //apply filters on detail list
      await this.filterDetailList();
    }
  };

  addFilters = (fltrVal, colmn) => {
    if (colmn === "first") {
      let fltrsColmnFirst = this.state.fltrsColmnFirst;
      fltrsColmnFirst.map((f, i) => {
        if (fltrVal.id === f.id) {
          f.checked = true;
        } else {
          f.checked = false;
        }
        return f;
      });
      let showDate = false;
      // if (fltrVal.id === "55") {
      //   showDate = true;
      // }
      this.setState({ fltrsColmnFirst, showDate });
    } else {
      let fltrsColmnSecond = this.state.fltrsColmnSecond;
      fltrsColmnSecond.map((f, i) => {
        if (fltrVal.id === f.id) {
          f.checked = true;
        } else {
          f.checked = false;
        }
        return f;
      });
      this.setState({ fltrsColmnSecond });
    }
  };

  //values of each filter
  handleFilterValue = (e, check, obj, index) => {
    if (check === "secondPopup") {
      //second popup -> handle change input value
      let value = e.target.value;
      this.setState({ filterValue: value });
    } else {
      //first popup -> handle change input value
      let filtersArr = this.state.filtersArr;
      let findObj = filtersArr.find((f, i) => i === index);
      if (findObj) {
        findObj.value = e.target.value;
      }
      this.setState({ filtersArr }, async () => {
        //apply filters on detail list
        await this.filterDetailList();
      });
    }
  };

  closeFilterPopup = async () => {
    this.setState({ filter_dropdpwn2: false });
    await this.clearFilterStates();
  };

  //add active filters
  addActiveFilters = () => {
    if (this.state.filtersArr.length > 0) {
      this.setState({ checkFltr: "active" }, () =>
        this.openModal("openSupplierFilterModal")
      );
    }
  };

  //add workspace filters
  addWorkspaceFilters = () => {
    if (this.state.filtersArr.length > 0) {
      this.setState({ checkFltr: "workspace" }, () =>
        this.openModal("openSupplierFilterModal")
      );
    }
  };

  //update state after adding the filters
  getUpdatedActiveFilters = (data) => {
    this.setState({
      // filtersArr: [],
      activeFilters: data,
    });
  };

  //update state after adding the filters
  getUpdatedWorkSpaceFilters = (data) => {
    this.setState({
      // filtersArr: [],
      workSpaceFilters: data,
    });
  };

  //handleActiveFilter => when click on one active filtes then apply filters on table
  handleActiveFilter = async (filter, index) => {
    filter = JSON.parse(JSON.stringify(filter));
    if (filter.RulesList && filter.RulesList.length > 0) {
      this.setState(
        {
          filtersArr: filter.RulesList,
          filterRadioGroup: filter.Criteria || "OR",
          activeWorkFilter: null,
          actvFilter: index,
        },
        async () => {
          //apply filters on Detail List
          await this.filterDetailList();
        }
      );
    }
  };

  //delete active filter
  deleteActiveFilter = async (filter, index) => {
    let userLogin = localStorage.getItem("userLogin");

    if (userLogin) {
      filter = JSON.parse(JSON.stringify(filter));

      if (filter.userLogin.toLowerCase() === userLogin.toLowerCase()) {
        let activeFilters = this.state.activeFilters;
        let filteredData = activeFilters.filter((f, i) => i != index);

        let data = {
          userLogin,
          Type: "activeFilter",
          Filters: [...filteredData],
        };

        let storedFilters = JSON.parse(
          localStorage.getItem("ActiveFilters") || "[]"
        );

        storedFilters = storedFilters.filter((f) => f.userLogin != userLogin);

        //update Active filters
        let usersActiveFilters = [...storedFilters, data];
        let fltrs = JSON.stringify(usersActiveFilters);
        localStorage.setItem("ActiveFilters", fltrs);
        this.setState(
          {
            filtersArr: [],
            activeFilters: filteredData,
            actvFilter: null,
            activeWorkFilter: null,
          },
          async () => {
            await this.filterDetailList();
          }
        );
      } else {
        toast.error("You Can Only Delete Your Own Active Filters!");
      }
    } else {
      toast.error("UserLogin Not Found!");
    }
  };

  //handleActiveFilter => when click on one workspace filtes then apply filters on table
  handleWorkSpaceFilter = (filter, index) => {
    filter = JSON.parse(JSON.stringify(filter));
    if (filter.RulesList && filter.RulesList.length > 0) {
      this.setState(
        {
          filtersArr: filter.RulesList,
          filterRadioGroup: filter.Criteria || "OR",
          activeWorkFilter: index,
          actvFilter: null,
        },
        async () => {
          //apply filters on Detail List
          await this.filterDetailList();
        }
      );
    }
  };

  //delete workspace filter
  deleteWorkSpaceFilter = async (filter, index) => {
    let userLogin = localStorage.getItem("userLogin");

    if (userLogin) {
      filter = JSON.parse(JSON.stringify(filter));

      if (filter.userLogin.toLowerCase() === userLogin.toLowerCase()) {
        let workSpaceFilters = this.state.workSpaceFilters;
        let filteredData = workSpaceFilters.filter((f, i) => i != index);

        let data = {
          userLogin,
          Type: "workspaceFilter",
          Filters: [...filteredData],
        };

        let storedFilters = JSON.parse(
          localStorage.getItem("WorkSpaceFilters") || "[]"
        );
        storedFilters = storedFilters.filter((f) => f.userLogin != userLogin);
        //update workspace filters
        let usersWorkSpaceFilters = [...storedFilters, data];
        let fltrs = JSON.stringify(usersWorkSpaceFilters);
        localStorage.setItem("WorkSpaceFilters", fltrs);

        this.setState(
          {
            filtersArr: [],
            workSpaceFilters: filteredData,
            actvFilter: null,
            activeWorkFilter: null,
          },
          async () => {
            await this.filterDetailList();
          }
        );
      } else {
        toast.error("You Can Only Delete Your Own WorkSpace Filters!");
      }
    } else {
      toast.error("UserLogin Not Found!");
    }
  };

  //Clear Filter
  clearFilterStates = () => {
    this.setState({
      fltrsColmnFirst: [
        { id: "1", filter: "category", name: "Category", checked: false },
        { id: "2", filter: "description", name: "Description", checked: false },
        { id: "3", filter: "value", name: "Value", checked: false },
      ],
      fltrsColmnSecond: [
        { id: "4", condition: "Contains", checked: false },
        { id: "5", condition: "Doesn't contain", checked: false },
        { id: "6", condition: "Equal", checked: false },
        { id: "7", condition: "Not Equal", checked: false },
        { id: "8", condition: "Starts With", checked: false },
        { id: "9", condition: "Over", checked: false },
        { id: "10", condition: "Under", checked: false },
        { id: "11", condition: "Over Equal", checked: false },
        { id: "12", condition: "Under Equal", checked: false },
      ],
      filterValue: "",
      // showDate: false
    });
  };

  //when click on Clear Button
  clearAllFilters = () => {
    let filtersArr = this.state.filtersArr;
    let { clonedDetailsList, showHiddenRows } = this.state;
    let detailsList = [];
    if (filtersArr.length > 0) {
      if (showHiddenRows) {
        detailsList = clonedDetailsList;
      } else {
        let filterdList = clonedDetailsList.filter((l) => !l.hide);
        detailsList = filterdList;
      }
      this.clearFilterStates();
      this.setState({ filtersArr: [], detailsList });
    }
  };

  /********Detail Filters End*********/
  //Settings Popup
  handleChangeSettings = (e, i) => {
    const { name, value } = e.target;
    if (name === "pageLength") {
      this.setState({ pageLength: value });
    } else {
      let { columns } = this.state;
      columns[i].hide = e.target.checked;
      this.setState({ columns });
    }
  };

  handleSaveSettings = (name) => {
    let { columns, pageLength } = this.state;
    Helpers.handleSaveSettings(columns, name, pageLength);
    this.closeModal("openSettingsModal");
  };

  handleCloseSettingModal = (name) => {
    let { columns } = this.state;
    let result = Helpers.handleCloseSettingModal(columns, name);
    this.setState({ ...result }, () => {
      this.closeModal("openSettingsModal");
    });
  };

  //-------------Supplier Distribution Tab------------------
  getChartCodes = async () => {
    this.setState({ getChartCodes: "" });
    await this.props.getChartCodes();

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);

      let getChartCodes = this.props.chart.getChartCodes || "";

      //this contains all chart codes
      this.setState({
        chartCodesList: getChartCodes.chartCodes || [],
        clonedChartCodesList: getChartCodes.chartCodes || [],
      });
    }

    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      Helpers.handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }
  };
  //handle auto-completing and typing into the Chart Code
  handleChangeChartCode = async (e, line, index) => {
    $(`.chart${index}`).show();
    let value = e.target.value;
    let { supplierDistribution } = this.state;

    // update in supplierDistribution
    line.chartCode = value || "";
    supplierDistribution[index] = line;

    let clonedChartCodesList = [...this.state.chartCodesList];

    if (!value) {
      clonedChartCodesList = [];
    } else {
      let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
        return (
          (c.code.toUpperCase().includes(value.toUpperCase()) ||
            c.description.toUpperCase().includes(value.toUpperCase())) &&
          c.sort.toUpperCase() === line.chartSort.toUpperCase()
        );
      });
      clonedChartCodesList = chartCodesListFilterdData;
    }
    this.setState({ supplierDistribution, clonedChartCodesList });
  };

  //when select code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line, index) => {
    let { supplierDistribution } = this.state;

    // update in supplierDistribution lines
    line.chartCode = chartCode.code || "";
    supplierDistribution[index] = line;

    this.setState({ supplierDistribution });
  };

  onblurCode = (i) => {
    setTimeout(() => {
      $(`.chart${i}`).hide();
    }, 700);
  };

  //handle distribution list
  hanldeChangeDistribution = (e, dist, index) => {
    const { name, value } = e.target;
    let { supplierDistribution } = this.state;
    dist[name] = value;
    supplierDistribution[index] = dist;
    this.setState({ supplierDistribution });
  };

  handleChangeFlags = (e, line, i) => {
    let { value } = e.target;
    line.flags[i].value = value || "";
  };

  //ADD Distribution when click to + button on Distribution Tab
  addDistribution = () => {
    let { supplierDistribution, defaultUserFlags } = this.state;
    let obj = {
      checked: false,
      chartSort: "",
      chartCode: "",
      flags: JSON.parse(JSON.stringify(defaultUserFlags)),
      description: "",
      amount: "",
      autoFocus: true,
      id: 0,
    };

    supplierDistribution.push(obj);
    this.setState({ supplierDistribution });
  };

  //Delete Distribution when click to + button on Distribution Tab
  deleteDistribution = async () => {
    let { supplierDistribution } = this.state;

    let contct = supplierDistribution.find((d) => d.checked);
    if (contct) {
      //simply remove the new inserted object from the supplier distribution array
      let _supplierDistribution = supplierDistribution.filter(
        (d) => !d.checked
      );
      this.setState({ supplierDistribution: _supplierDistribution });
    } else {
      toast.error("Please Select Item To Delete!");
    }
  };

  handleDistributionCheckboxes = async (e, dist, index) => {
    let { supplierDistribution } = this.state;
    if (e.target.checked) {
      supplierDistribution.map((c, i) => {
        if (index === i) {
          c.checked = true;
        } else {
          c.checked = false;
        }
      });
      this.setState({ supplierDistribution });
    } else {
      dist.checked = false;
      supplierDistribution[index] = dist;

      this.setState({ supplierDistribution });
    }
  };
  //-------------END Distribution Tab---------------
  getPayments = async () => {
    this.setState({ isLoading: true });
    let { currency, code } = this.state;

    await this.props.getPayments({
      currency: currency.value,
      supplierCode: code,
    });
    if (this.props.payments.getPaymentsSuccess) {
      let payments = this.props.payments.getPayments || [];
      payments.map((p) => (p.checked = false));
      this.setState({ payments }, () => {
        this.openModal("openPaymentsModal");
      });
    }
    if (this.props.payments.getPaymentsError) {
      Helpers.handleAPIErr(this.props.payments.getPaymentsError, this.props);
    }

    this.props.clearPaymentStates();
    this.setState({ isLoading: false });
  };

  hanldeCheckbox = async (e, obj, index, type) => {
    let { checked } = e.target;
    let { payments, transactions, checkAll } = this.state;
    let data = "";
    if (type === "payments") {
      data = payments;
    } else {
      //type -> transactions
      data = transactions;
    }
    if (obj === "all") {
      if (checked) {
        data.map((c, i) => {
          c.checked = true;
          return c;
        });
      } else {
        data.map((c, i) => {
          c.checked = false;
          return c;
        });
      }
      this.setState({ data, checkAll: checked });
    } else {
      if (checked) {
        obj.checked = checked;
        data[index] = obj;

        let _check = data.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAll = true;
        }
        this.setState({ data, checkAll });
      } else {
        obj.checked = checked;
        data[index] = obj;
        this.setState({ checkAll: false, data });
      }
    }
  };

  getTransactions = async () => {
    this.setState({ isLoading: true });
    let { currency, code } = this.state;

    await this.props.getTransactions({
      currency: currency.value,
      supplierCode: code,
    });
    if (this.props.invoice.getTransactionsSuccess) {
      let transactions = this.props.invoice.getTransactions || [];
      transactions.map((p) => (p.checked = false));
      this.setState({ transactions }, () => {
        this.openModal("openTransactionModal");
      });
    }
    if (this.props.invoice.getTransactionsError) {
      Helpers.handleAPIErr(this.props.invoice.getTransactionsError, this.props);
    }

    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  //unlock supplier
  unlockSupplier = async () => {
    let { currency, code } = this.state;
    currency = currency.value || "";
    if (currency && code) {
      let obj = {
        supplierDetails: {
          currency,
          code,
        },
      };
      this.setState({ isLoading: true });
      await this.props.unlockSupplier(obj);
      this.setState({ isLoading: false });

      if (this.props.supplier.unlockSupplierSuccess) {
        toast.success(this.props.supplier.unlockSupplierSuccess);
      }
      if (this.props.supplier.unlockSupplierError) {
        Helpers.handleAPIErr(
          this.props.supplier.unlockSupplierError,
          this.props
        );
      }
      this.props.clearSupplierStates();
    } else {
      toast.error("Code or Currency is missing!");
    }
  };

  //approve supplier
  approveSupplier = async () => {
    let { currency, code } = this.state;
    currency = currency.value || "";
    if (currency && code) {
      let obj = {
        supplierDetails: {
          currency,
          code,
        },
      };
      this.setState({ isLoading: true });
      await this.props.approveSupplier(obj);
      this.setState({ isLoading: false });

      if (this.props.supplier.approveSupplierSuccess) {
        toast.success(this.props.supplier.approveSupplierSuccess);
      }
      if (this.props.supplier.approveSupplierError) {
        Helpers.handleAPIErr(
          this.props.supplier.approveSupplierError,
          this.props
        );
      }
      this.props.clearSupplierStates();
    } else {
      toast.error("Code or Currency is missing!");
    }
  };

  //get supplier activity
  getSupplierActivity = async () => {
    let { currency, code, suppliersActivity } = this.state;
    if (suppliersActivity.length > 0) {
      this.openModal("openActivityModal");
      return;
    }

    currency = currency.value || "";
    if (currency && code) {
      let obj = {
        supplierDetails: {
          currency,
          code,
        },
      };
      this.setState({ isLoading: true });
      await this.props.getSupplierActivity(obj);
      this.setState({ isLoading: false });

      if (this.props.supplier.getSupplierActivitySuccess) {
        toast.success(this.props.supplier.getSupplierActivitySuccess);

        let suppliersActivity = this.props.supplier.getSupplierActivity || [];

        this.setState(
          {
            suppliersActivity,
          },
          () => {
            this.openModal("openActivityModal");
          }
        );
      }
      if (this.props.supplier.getSupplierActivityError) {
        Helpers.handleAPIErr(
          this.props.supplier.getSupplierActivityError,
          this.props
        );
      }
      this.props.clearSupplierStates();
    } else {
      toast.error("Code or Currency is missing!");
    }
  };

  handleCheckbox = (e, data, index) => {
    let { suppliersList, multipleSupplierIDs } = this.state;
    let { name, checked } = e.target;

    if (data === "allCheck" && name === "checkboxAll") {
      let multipleSupplierIDsCopy = [];
      if (checked) {
        suppliersList.map((m) => {
          m.checked = true;
          multipleSupplierIDsCopy.push(m.supplierID);
          return m;
        });
      } else {
        suppliersList.map((m) => {
          m.checked = false;
          return m;
        });
      }
      multipleSupplierIDs = [...multipleSupplierIDsCopy];
    } else {
      if (checked) {
        suppliersList.map((m) => {
          if (m.id === data.id) {
            m.checked = true;
          }
          return m;
        });
        multipleSupplierIDs.push(data.supplierID);
      } else {
        suppliersList.map((m) => {
          if (m.id === data.id) {
            m.checked = false;
          }
          return m;
        });
        multipleSupplierIDs = multipleSupplierIDs.filter(
          (m) => m !== data.supplierID
        );
      }
    }
    this.setState({ multipleSupplierIDs });
  };

  //export suppliers
  exportSuppliers = async () => {
    let { multipleSupplierIDs } = this.state;

    if (multipleSupplierIDs.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportSuppliers(multipleSupplierIDs);
      this.setState({ isLoading: false });

      if (this.props.supplier.exportSuppliersSuccess) {
        toast.success(this.props.supplier.exportSuppliersSuccess);

        let obj = {
          contentType: "application/vnd.ms-excel",
          attachment: this.props.supplier.exportSuppliers || "",
        };
        Helpers.downloadAttachments(obj, "suppliers");
      }
      if (this.props.supplier.exportSuppliersError) {
        Helpers.handleAPIErr(
          this.props.supplier.exportSuppliersError,
          this.props
        );
      }
      this.props.clearSupplierStates();
    } else {
      toast.error("Please Select Suppliers First!");
    }
  };

  //paste suppliers
  pasteSuppliers = async (excelData) => {
    this.setState({ isLoading: true });
    await this.props.pasteSuppliers(excelData);
    if (this.props.supplier.pasteSuppliersSuccess) {
      toast.success(this.props.supplier.pasteSuppliersSuccess);
      this.closeModal("openImportModal");
    }
    if (this.props.supplier.pasteSuppliersError) {
      Helpers.handleAPIErr(this.props.supplier.pasteSuppliersError, this.props);
    }
    this.props.clearSupplierStates();

    this.setState({ isLoading: false });
  };

  render() {
    let { defaultUserFlags } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} supplier2={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            {/* side menu suppliers*/}
            <aside
              className="side-nav suppliers_side_nav"
              id="show-side-navigation2"
            >
              <div className="cus-arro-div2">
                <img
                  src="images/arrow-r.png"
                  className=" img-fluid cus-arro-r"
                  alt="user"
                />
              </div>
              <div className="search">
                <div className="row">
                  <div className="col-auto mb-2 pr-0">
                    <div className="form-group remember_check custom-checkbox-ui">
                      <input
                        type="checkbox"
                        id={"order"}
                        name="checkboxAll"
                        onChange={(e) => this.handleCheckbox(e, "allCheck")}
                      />
                      <label
                        htmlFor={"order"}
                        className="mr-0 custom-box"
                      ></label>
                    </div>
                  </div>
                  <div className="col-auto pr-md-0 align-self-center ml-1">
                    <Dropdown
                      alignRight="false"
                      drop="down"
                      className="analysis-card-dropdwn float-right user_drop_options custom-my-radio "
                    >
                      <Dropdown.Toggle
                        variant="sucess"
                        id="dropdown-basic"
                        className="custom-angle-down"
                      >
                        <img src="images/angle-down.png" alt="arrow" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortSupplierLists("name")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="name1"
                              name="name"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "name"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="name1"
                            >
                              Name
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortSupplierLists("code")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="code2"
                              name="code"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "code"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="code2"
                            >
                              Code
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortSupplierLists("currency")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="currency3"
                              name="currency"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "currency"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="currency3"
                            >
                              Currency
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() => this.handleSortSupplierLists("city")}
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="city4"
                              name="city"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "city"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="city4"
                            >
                              City
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortSupplierLists("state")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="state5"
                              name="state"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "state"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="state5"
                            >
                              State
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortSupplierLists("postcode")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="postcode6"
                              name="postcode"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "postcode"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="postcode6"
                            >
                              Postcode
                            </label>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          to="#/action-2"
                          className="f-20 flex-container-inner"
                        >
                          <div
                            onClick={() =>
                              this.handleSortSupplierLists("country")
                            }
                            className="custom-control custom-radio flex-container-inner"
                          >
                            <input
                              type="radio"
                              className="custom-control-input flex-container-inner-input"
                              id="country7"
                              name="country"
                              onChange={() => {}}
                              checked={this.state.sortFilter === "country"}
                            />
                            <label
                              className="custom-control-label flex-container-inner-input"
                              htmlFor="country7"
                            >
                              Country
                            </label>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="col input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1">
                        <img
                          src="images/search-icon.png"
                          className="mx-auto"
                          alt="search-icon"
                        />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What are you looking for"
                      aria-label="What are you looking for"
                      aria-describedby="basic-addon1"
                      name="suppliersListSearch"
                      value={this.state.suppliersListSearch}
                      onChange={this.onSuppliersListSearch}
                    />
                  </div>
                </div>
              </div>

              <ul className="suppliers_list">
                {this.state.suppliersList.map((s, i) => {
                  return (
                    <li
                      key={i}
                      className={
                        this.state.activeSupplier == s.id
                          ? "active cursorPointer"
                          : "cursorPointer"
                      }
                      id={s.id}
                    >
                      {" "}
                      <div className="row">
                        <div className="col-auto mb-2 pr-0">
                          <div className="form-group remember_check">
                            <input
                              type="checkbox"
                              id={"sup" + i}
                              name="checkbox"
                              checked={s.checked}
                              onChange={(e) => this.handleCheckbox(e, s, i)}
                            />
                            <label htmlFor={"sup" + i} className="mr-0"></label>
                          </div>
                        </div>
                        <div
                          onClick={() => this.getSupplierDetails(s)}
                          className="col-10 pl-0"
                        >
                          <div className="supplier_data">
                            <h4>{s.name}</h4>
                            <p>{s.email}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </aside>
            {/* end */}
            <section className="supplier" id="contents">
              <div className="container-fluid ">
                <div className="main_wrapper mt-2">
                  <div className="row d-flex justify-content-center h-60vh">
                    <div className="col-12 col-md-12 w-100 ">
                      <div className="forgot_form_main report_main sup-inner-pad position-relative">
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
                                  onClick={this.addSupplier}
                                  type="button"
                                  className="btn-save "
                                >
                                  <span className="fa fa-plus"></span>
                                  Add
                                </button>
                                <button
                                  onClick={this.onSave}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                                <button type="button" className="btn-save">
                                  <span className="fa fa-ban"></span>
                                  Cancel
                                </button>
                                <Link
                                  to="#"
                                  className="zom-img float-right ml-md-5 pl-2 pr-2 mr-0 more-d mt-0 icon_dots"
                                >
                                  <img
                                    src="images/more.png"
                                    className=" img-fluid"
                                    alt="user"
                                  />{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="documents_attatchments2 supplier2_sidetoggle">
                          <div
                            onClick={() => this.openModal("openReportModal")}
                            className="main-sec-attach main-bg"
                          >
                            Reports
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.exportSuppliers}
                          >
                            <span
                              className="export_crd"
                              data-toggle="collapse"
                              data-target="#export"
                            >
                              {/* <span className="fa fa-angle-up float-left mr-2 sideBarAccord1"></span> */}
                              Export
                            </span>
                          </div>
                          {/* <div className="collapse show" id="export">
                            {["EXCEL", "PSL"].map((op, i) => {
                              return (
                                <div
                                  onClick={this.exportSuppliers}
                                  key={i}
                                  className="pl-2 mb-3"
                                >
                                  <div className="form-group remember_check d-flex">
                                    <span className="text-mar cursorPointer ml-38">
                                      {op}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>{" "} */}
                          <div
                            onClick={() => this.openModal("openImportModal")}
                            className="main-sec-attach main-bg"
                          >
                            Import
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.unlockSupplier}
                          >
                            Unlock
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.approveSupplier}
                          >
                            Approve
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getSupplierActivity}
                          >
                            Activity
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getPayments}
                          >
                            Payments
                          </div>
                          <div
                            className="main-sec-attach main-bg"
                            onClick={this.getTransactions}
                          >
                            Transactions
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

                            {/* <div className="col-md-6">
                              <div className="form-group custon_select">
                                <div className="modal_input pt-2">
                                  <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="usr"
                                    name="email"
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
                            </div> */}

                            <div className="col-md-6">
                              <div className="form-group custon_select">
                                <div className="modal_input pt-2">
                                  <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="usr"
                                    name="taxID"
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
                                    <label className="co_postaol_radio">
                                      <input
                                        name="companyPostalCheck"
                                        type="radio"
                                        id="radio1"
                                        value="company"
                                        checked={
                                          this.state.companyPostalCheck ===
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
                                    <label className="co_postaol_radio">
                                      <input
                                        name="companyPostalCheck"
                                        type="radio"
                                        id="radio1"
                                        value="postal"
                                        checked={
                                          this.state.companyPostalCheck ===
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
                            {this.state.companyPostalCheck === "company" && (
                              <>
                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control mt-0"
                                        id="usr"
                                        name="compAddress"
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

                            {this.state.companyPostalCheck === "postal" && (
                              <>
                                <div className="col-md-6">
                                  <div className="form-group custon_select">
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control mt-0"
                                        id="usr"
                                        name="postAddress"
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
                          className="forgot_body collapse show "
                          id="details"
                        >
                          {/* filter dropdown 1 */}
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
                              <div className="col-sm-12 p-0">
                                {this.state.filtersArr.length > 0 && (
                                  <form action="#" className="">
                                    <div className="form-group mb-0">
                                      <label
                                        htmlFor="test2"
                                        className="co_postaol_radio"
                                      >
                                        <input
                                          type="radio"
                                          id="test2"
                                          name="filterRadioGroup"
                                          value="AND"
                                          checked={
                                            this.state.filterRadioGroup ===
                                            "AND"
                                          }
                                          onChange={this.handleRadioButtons}
                                        />
                                        AND
                                      </label>

                                      <label
                                        htmlFor="test1"
                                        className="co_postaol_radio"
                                      >
                                        <input
                                          type="radio"
                                          id="test1"
                                          name="filterRadioGroup"
                                          value="OR"
                                          checked={
                                            this.state.filterRadioGroup === "OR"
                                          }
                                          onChange={this.handleRadioButtons}
                                        />
                                        OR
                                      </label>
                                    </div>
                                  </form>
                                )}
                              </div>
                            </div>
                            <div className="clear20"></div>
                            <div className="col-sm-12 p0 detail_filter_table_1">
                              <table
                                width="100%"
                                border="0"
                                cellSpacing="0"
                                cellPadding="0"
                                className="detail_detail_detail_detail_drop-table"
                              >
                                {this.state.filtersArr.length > 0
                                  ? this.state.filtersArr.map((f, i) => {
                                      return (
                                        <tr>
                                          <td
                                            align="left"
                                            width="20"
                                            className="cursorPointer"
                                          >
                                            <img
                                              onClick={() =>
                                                this.removeFilter(f, i)
                                              }
                                              src="images/close-icon_filter.png"
                                              width="9"
                                              height="9"
                                              alt=""
                                            />
                                          </td>
                                          <td align="left">{f.name} </td>
                                          <td align="center">
                                            <div className="rel">
                                              <select
                                                onChange={(e) =>
                                                  this.onChangefltrConditns(
                                                    f.filter,
                                                    e,
                                                    i
                                                  )
                                                }
                                              >
                                                {this.state.fltrsColmnSecond.map(
                                                  (fc, i) => {
                                                    return (
                                                      <option
                                                        value={fc.condition}
                                                        selected={
                                                          f.condition ===
                                                          fc.condition
                                                        }
                                                      >
                                                        {fc.condition}
                                                      </option>
                                                    );
                                                  }
                                                )}
                                              </select>
                                              <i className="fa fa-angle-down my-select"></i>
                                            </div>
                                          </td>
                                          <td align="right">
                                            <input
                                              placeholder="Value"
                                              type={
                                                f.filter === "Rate Date"
                                                  ? "date"
                                                  : "text"
                                              }
                                              onChange={(e) =>
                                                this.handleFilterValue(
                                                  e,
                                                  "firstPopup",
                                                  f,
                                                  i
                                                )
                                              }
                                              className="input-cy"
                                              value={f.value}
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })
                                  : "No filters applied to this view"}
                              </table>
                            </div>
                            <div className="col-sm-12 p-0 pt-3 active_filters">
                              <h2>Active Filters</h2>
                              <div className="save-filter">
                                {/* <span
                                  onClick={() =>
                                    this.openModal("openSupplierFilterModal")
                                  }
                                >
                                  Save filter
                                </span> */}
                                <Link to="#" onClick={this.addActiveFilters}>
                                  Save filter
                                </Link>
                              </div>
                              <ul className="active_filter_list">
                                {this.state.activeFilters.map((a, i) => {
                                  return (
                                    <li>
                                      {this.state.actvFilter === i ? (
                                        <span
                                          onClick={() =>
                                            this.deleteActiveFilter(a, i)
                                          }
                                          className="fa fa-close cursorPointer activeFilter"
                                        ></span>
                                      ) : (
                                        <span className="cursorPointer">
                                          <img
                                            onClick={() =>
                                              this.deleteActiveFilter(a, i)
                                            }
                                            src="images/close-icon-gray.png"
                                          />
                                        </span>
                                      )}

                                      <span
                                        className={
                                          this.state.actvFilter === i
                                            ? "cursorPointer activeFilter"
                                            : "cursorPointer"
                                        }
                                        onClick={() =>
                                          this.handleActiveFilter(a, i)
                                        }
                                      >
                                        {" "}
                                        {a.description}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="col-sm-12 active_filters_table2"></div>
                            <div className="clear"></div>
                            <div className="col-sm-12 p-0 active_filters">
                              <h2>Workspace Filters</h2>
                              <div className="save-filter">
                                <Link to="#" onClick={this.addWorkspaceFilters}>
                                  Save filter
                                </Link>
                              </div>
                              <ul className="active_filter_list">
                                {this.state.workSpaceFilters.map((w, i) => {
                                  return (
                                    <li>
                                      {this.state.activeWorkFilter === i ? (
                                        <span
                                          onClick={() =>
                                            this.deleteWorkSpaceFilter(w, i)
                                          }
                                          className="fa fa-close cursorPointer activeFilter"
                                        ></span>
                                      ) : (
                                        <span className="cursorPointer">
                                          <img
                                            onClick={() =>
                                              this.deleteWorkSpaceFilter(w, i)
                                            }
                                            src="images/close-icon-gray.png"
                                          />
                                        </span>
                                      )}

                                      <span
                                        className={
                                          this.state.activeWorkFilter === i
                                            ? "cursorPointer activeFilter"
                                            : "cursorPointer"
                                        }
                                        onClick={() =>
                                          this.handleWorkSpaceFilter(w, i)
                                        }
                                      >
                                        {" "}
                                        {w.description}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="clear10"></div>
                            <div>
                              <button
                                className="ml-2 clear-filter"
                                onClick={this.clearAllFilters}
                              >
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

                          {/* second drop down 2*/}
                          <div id="supplier_filter_dropdpwn2">
                            <div className="filter_dropdpwn2_toparea p-0">
                              <div className="col-sm-12 p-0">
                                <h2 className="pl-3 pt-3 pb-1">Add Filters</h2>
                                <div className="can-sav-btn">
                                  <button
                                    onClick={this.saveFilters}
                                    className="btn can-btn1"
                                  >
                                    <img
                                      src="images/save-check.png"
                                      alt="check"
                                    ></img>
                                    Save
                                  </button>
                                  <button
                                    onClick={this.closeFilterPopup}
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
                                    {this.state.fltrsColmnFirst.map((f, i) => {
                                      return (
                                        <li
                                          className={
                                            f.checked ? "b-active" : ""
                                          }
                                          key={i}
                                          onClick={() =>
                                            this.addFilters(f, "first")
                                          }
                                        >
                                          {f.name}
                                          {f.checked ? (
                                            <span className="fa fa-check icon-check"></span>
                                          ) : (
                                            ""
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                                <div className="col sec-pop pl-0 pr-0 check_active_ul ">
                                  <ul className="pr-0">
                                    <ul className="pr-0">
                                      {this.state.fltrsColmnSecond.map(
                                        (f, i) => {
                                          return (
                                            <li
                                              className={
                                                f.checked ? "b-active" : ""
                                              }
                                              key={i}
                                              onClick={() =>
                                                this.addFilters(f, "second")
                                              }
                                            >
                                              {f.condition}
                                              {f.checked ? (
                                                <span className="fa fa-check icon-check"></span>
                                              ) : (
                                                ""
                                              )}
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </ul>
                                </div>
                                <div className="col sec-pop1 pl-0">
                                  <ul>
                                    <li className="border-bottom">
                                      <div className="">
                                        <input
                                          placeholder="Value"
                                          type={
                                            this.state.showDate
                                              ? "date"
                                              : "text"
                                          }
                                          className="cus-in"
                                          name="filterValue"
                                          value={this.state.filterValue}
                                          onChange={(e) =>
                                            this.handleFilterValue(
                                              e,
                                              "secondPopup"
                                            )
                                          }
                                        />
                                      </div>
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
                                <div className="login_table_list table-responsive tab-1-line supplier2_table ">
                                  <table className="table table-hover busines_unit_table shadow-remove ">
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
                                        <th scope="col" className="text-left">
                                          Description
                                        </th>
                                        <th scope="col" className="text-left">
                                          Value
                                        </th>
                                        <th scope="col">Hide </th>
                                        <th scope="col">
                                          <div className="menu_bars_dropdown">
                                            <Dropdown
                                              alignRight="false"
                                              drop="up"
                                              className="analysis-card-dropdwn "
                                            >
                                              <Dropdown.Toggle variant="" id="">
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

                                            <td className="text-left">
                                              {d.description}
                                            </td>
                                            {d.valueType === "List" ? (
                                              <td className="pt-0 pb-0 text-left">
                                                <Select
                                                  classNamePrefix="custon_select-selector-inner"
                                                  className={
                                                    i == 0
                                                      ? "width-selector only--one input_width2"
                                                      : i == 1
                                                      ? "width-selector only--one input_width2"
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
                                              <td className="supplier2_input_td">
                                                <div className="input_width input_width2 new_input_pad">
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
                                                <div className="col-auto p-0">
                                                  <div className="form-group remember_check text-center pt-0 float-left">
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
                                              <td className="supplier2_input_td">
                                                <div className="input_width input_width2 new_input_pad">
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
                                              <td className="supplier2_input_td">
                                                <div className="input_width input_width2 new_input_pad">
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

                        <div className="forgot_body collapse show" id="contact">
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

                        <div className="collapse show" id="expenseAttachments">
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
                                              this.deleteAttachment(a.recordID);
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
                                      data-target="#distributionList"
                                    />{" "}
                                  </span>
                                  Distribution List
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="forgot_body collapse show"
                          id="distributionList"
                        >
                          <div className="row mt-3">
                            <div className="col-12  d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.deleteDistribution}
                                type="button"
                                className="btn-save "
                              >
                                <span className="fa fa-trash"></span>
                              </button>
                              <button
                                onClick={this.addDistribution}
                                type="button"
                                className="btn-save m-0"
                              >
                                <span className="fa fa-plus"></span>
                              </button>
                            </div>
                            <div className="col-12">
                              <div className="login_form">
                                <div className="login_table_list hide-scroll tab-1-line supplier2_table">
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
                                          Chart Sort
                                        </th>
                                        <th scope="col">Chart Code</th>
                                        <th scope="col">Description</th>
                                        {defaultUserFlags.map((u, i) => {
                                          return (
                                            <th key={i} scope="col">
                                              {u.prompt}
                                            </th>
                                          );
                                        })}
                                        <th scope="col">Amount</th>
                                        <th scope="col">
                                          <span className="fa fa-bars"></span>
                                        </th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.supplierDistribution.map(
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
                                                        name={"chk1"}
                                                        id={"chk1" + i}
                                                        checked={d.checked}
                                                        onChange={(e) =>
                                                          this.handleDistributionCheckboxes(
                                                            e,
                                                            d,
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
                                                  className="input_height sup_modal_contacs uppercaseText"
                                                  autoFocus={d.autoFocus}
                                                  name="chartSort"
                                                  defaultValue={d.chartSort}
                                                  onBlur={(e) =>
                                                    this.hanldeChangeDistribution(
                                                      e,
                                                      d,
                                                      i
                                                    )
                                                  }
                                                  id="chartSort"
                                                />
                                              </td>

                                              <td className="text-left dropdown-position">
                                                <div className="">
                                                  <input
                                                    type="text"
                                                    className="input_height sup_modal_contacs uppercaseText"
                                                    id="usr"
                                                    autoComplete="off"
                                                    name={"chartCode"}
                                                    value={d.chartCode}
                                                    onChange={(e) =>
                                                      this.handleChangeChartCode(
                                                        e,
                                                        d,
                                                        i
                                                      )
                                                    }
                                                    onBlur={() =>
                                                      this.onblurCode(i)
                                                    }
                                                  />
                                                </div>
                                                <div
                                                  className={`chart_menue chart${i}`}
                                                >
                                                  {" "}
                                                  {this.state
                                                    .clonedChartCodesList
                                                    .length > 0 ? (
                                                    <ul className="invoice_vender_menu">
                                                      {this.state.clonedChartCodesList.map(
                                                        (c, ci) => {
                                                          return (
                                                            <li
                                                              className="cursorPointer"
                                                              key={ci}
                                                              onClick={() =>
                                                                this.changeChartCode(
                                                                  c,
                                                                  d,
                                                                  i
                                                                )
                                                              }
                                                            >
                                                              <div className="vender_menu_right chart_new">
                                                                <h3 className="chart_vender_text">
                                                                  <span>
                                                                    {" "}
                                                                    {
                                                                      c.code
                                                                    }{" "}
                                                                  </span>{" "}
                                                                  <span className="right_desc">
                                                                    {" "}
                                                                    {
                                                                      c.description
                                                                    }
                                                                  </span>
                                                                </h3>
                                                              </div>
                                                            </li>
                                                          );
                                                        }
                                                      )}
                                                    </ul>
                                                  ) : (
                                                    <div className="sup_nt_fnd text-center">
                                                      <h6>
                                                        No Chart Code Found
                                                      </h6>
                                                    </div>
                                                  )}
                                                </div>
                                              </td>
                                              <td>
                                                <input
                                                  type="text"
                                                  className="input_height sup_modal_contacs uppercaseText"
                                                  name="description"
                                                  defaultValue={d.description}
                                                  id="description"
                                                  onBlur={(e) =>
                                                    this.hanldeChangeDistribution(
                                                      e,
                                                      d,
                                                      i
                                                    )
                                                  }
                                                />
                                              </td>
                                              {defaultUserFlags.map((u, ui) => {
                                                return (
                                                  <td
                                                    className={
                                                      "text-left pad-left"
                                                    }
                                                    key={ui}
                                                  >
                                                    <div className="modal_input">
                                                      <input
                                                        type="text"
                                                        className={`input_height sup_modal_contacs uppercaseText flags-w${u.length}`}
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={u.type}
                                                        maxLength={u.length}
                                                        defaultValue={
                                                          d.flags[ui].value ||
                                                          ""
                                                        } //because user flags and distribution line flags are already sorted according to sequence
                                                        onBlur={(e) =>
                                                          this.handleChangeFlags(
                                                            e,
                                                            d,
                                                            ui
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </td>
                                                );
                                              })}

                                              <td>
                                                <input
                                                  type="number"
                                                  className="input_height sup_modal_contacs uppercaseText"
                                                  name="amount"
                                                  defaultValue={d.amount}
                                                  id="amount"
                                                  onBlur={(e) =>
                                                    this.hanldeChangeDistribution(
                                                      e,
                                                      d,
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <SupplierFilterModal
          openSupplierFilterModal={this.state.openSupplierFilterModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          activeFilters={this.state.activeFilters} //active filters store on local storage
          workSpaceFilters={this.state.workSpaceFilters} //workspace filters store on local storage
          filters={this.state.filtersArr} //what new filters user want to add in active filters
          criteria={this.state.filterRadioGroup} //operator => 'AND' || 'OR
          getUpdatedActiveFilters={this.getUpdatedActiveFilters} //callback func after added successfully active filters
          getUpdatedWorkSpaceFilters={this.getUpdatedWorkSpaceFilters} //callback func after added successfully workspace filters
          checkFltr={this.state.checkFltr} //to check which filter is going to add either active or workspace
        />

        <Import
          state={this.state}
          closeModal={this.closeModal}
          onImport={this.pasteSuppliers}
          page="suppliers"
        />

        <SupplierActivity
          openModal={this.openModal}
          closeModal={this.closeModal}
          stateData={this.state}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={() => this.handleSaveSettings("supplierActivity")}
          handleCloseSettingModal={() =>
            this.handleCloseSettingModal("supplierActivity")
          }
        />
        <Transactions
          openModal={this.openModal}
          closeModal={this.closeModal}
          stateData={this.state}
          hanldeCheckbox={this.hanldeCheckbox}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={() => this.handleSaveSettings("transactions")}
          handleCloseSettingModal={() =>
            this.handleCloseSettingModal("transactions")
          }
        />
        <Payments
          openModal={this.openModal}
          closeModal={this.closeModal}
          stateData={this.state}
          hanldeCheckbox={this.hanldeCheckbox}
          handleChangeSettings={this.handleChangeSettings}
          handleSaveSettings={() => this.handleSaveSettings("payments")}
          handleCloseSettingModal={() =>
            this.handleCloseSettingModal("payments")
          }
        />

        <Report
          openReportModal={this.state.openReportModal}
          closeModal={this.closeModal}
          reportType="Suppliers"
          locationProps={this.props}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  supplier: state.supplier,
  chart: state.chart,
  payments: state.payments,
  invoice: state.invoice,
  user: state.user,
});

export default connect(mapStateToProps, {
  getSuppliersList: SupplierActions.getSuppliersList,
  getSupplierDetails: SupplierActions.getSupplierDetails,
  primeSupplierDetails: SupplierActions.primeSupplierDetails,
  updateSupplierDetails: SupplierActions.updateSupplierDetails,
  insertSupplierDetails: SupplierActions.insertSupplierDetails,
  addSupAttachments: SupplierActions.addSupAttachments,
  getAttachment: SupplierActions.getAttachment,
  deleteSupAttachments: SupplierActions.deleteSupAttachments,
  deleteSuppliersContact: SupplierActions.deleteSuppliersContact,
  unlockSupplier: SupplierActions.unlockSupplier,
  approveSupplier: SupplierActions.approveSupplier,
  getSupplierActivity: SupplierActions.getSupplierActivity,
  exportSuppliers: SupplierActions.exportSuppliers,
  pasteSuppliers: SupplierActions.pasteSuppliers,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  getCurrencies: ChartActions.getCurrencies,
  getTaxCodes: ChartActions.getTaxCodes,
  getChartCodes: ChartActions.getChartCodes,
  clearChartStates: ChartActions.clearChartStates,
  getTransactions: InvoiceActions.getTransactions,
  getTransactionDetails: InvoiceActions.getTransactionDetails,
  clearInvoiceStates: InvoiceActions.clearInvoiceStates,
  getPayments: PaymentActions.getPayments,
  clearPaymentStates: PaymentActions.clearPaymentStates,
  getDefaultValues: UserActions.getDefaultValues,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(Supplier);
