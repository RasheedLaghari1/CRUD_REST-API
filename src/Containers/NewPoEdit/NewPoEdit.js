import React, { Component } from "react";




import Select from "react-select";
import store from "../../Store/index";
import $ from "jquery";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import Dropdown from "react-bootstrap/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import DatePicker from "react-datepicker";
import _ from "lodash";
import SupplierLookup from "../Modals/SupplierLookup/SupplierLookup";
import Contact from "../Modals/Contact/Contact";
import LineItem from "../Modals/LineItem/LineItem";
import DeleteOrderDetails from "../Modals/DeleteOrderDetail/DeleteOrderDetail";
import MultipleChanges from "../Modals/MultipleChanges/MultipleChanges";
import ImportModal from "../Modals/ImportLines/ImportLines";
import ExportSuccessModal from "../Modals/ExportSuccess/ExportSuccess";
import { userAvatar, _customStyles } from "../../Constants/Constants";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as POActions from "../../Actions/POActions/POActions";
import {
  handleAPIErr,
  downloadAttachments,
  toBase64,
  removeDragAndDropFileListners,
  addDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";

const uuidv1 = require("uuid/v1");
let moment = require("moment");

class NewPoEdit extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      tran: "", //tran of current po
      updatePOCheck: false,
      addPOCheck: false,
      //supplier
      currencyList: [],
      currency: "",
      poDate: "",
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierCode: "",
      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //a copy of  suppliersList
      contacts: [], //suppliers constacts
      suppliersFlags: [],
      quote: "",
      //supplier end
      orderDescription: "",
      //  companies
      companyValue: {
        label: "Select Company",
        value: "",
      },
      companies: [], //to show on company modal/block (resttructured to show on company drop-list)
      companyOptions: [],
      companyName: "",
      companyID: "",
      companyAddress: "",
      taxID: "",
      phone: "",
      //companies end
      //reference number
      poNumber: "", //to show in PO Reference Modal
      //end
      // delivery
      specialConditions: "", //to show/update in delivery modal
      //end
      //order request
      requestedBy: "", //to show/update in order request modal
      requestedDepartment: "", //to show/update in order request modal
      //end
      // order details
      defaultUserFlags: [], //default user flags
      poLines: [],
      customFields: [],
      poLineEditData: "", //contains poLine data for editing
      deletePOLineId: "", //contains poLine id for deleting
      subTotal: 0.0, //to just show on order-details page sub total
      //end order details
      //approvals
      approvalGroup: "", //to show select in approvals modal/block
      approvals: [], //list of approvals Groups
      approvalGroupValue: {
        label: "Select Approval Group",
        value: "",
      },
      //end
      // total amount
      taxTotal: 0.0,
      grossTotal: 0.0,
      //end
      // attachments
      poAttachments: [], //to show which attachments are uploaded
      openDeleteOrderDetailModal: false,
      openMultipleChangesModal: false,
      openExportSuccessModal: false,
      openImportLinesModal: false,
      openSupplierLookupModal: false,
      openContactModal: false,
      openLineItemModal: false,
      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags
      getChartCodes: "", //get chart sorts API response
      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes list
      getFlags: "", //API response
      poDetailsApiResp: "", //get po api response
      insertPOApiResp: "", //insert po API response
      basisOptions: [], //basis options like 'Day', Hour', 'Week' etc
      formErrors: {
        currency: "",
        supplierCode: "",
      },
      editName: false, //check when supplier name is going to edit
      //Allow a user to close company, PO Reference, Order Request, Delivery, Approval Group cards and remember that setting.
      comp_hide: false,
      poRef_hide: false,
      ordReq_hide: false,
      deliv_hide: false,
      approval_hide: false,
      cur_hide: false,
      date_hide: false,
      address_hide: false,
      quote_hide: false,

      sortErrorMsg: "",
      currencySort: [],
      locationSort: [],
      episodeSort: [],
      //END
    };
  }

  async componentDidMount() {
    $(document).ready(function () {
      $(".focus_vender").focusout(function () {
        setTimeout(() => {
          $(".invoice_vender_menu1").hide();
        }, 700);
      });
    });
    //adding drag and drop attachments listeners
    addDragAndDropFileListners("drop-area", this.uploadAttachment);
    //end

    // sideBarAccord
    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });
    // end
    this.showHiddenCards();

    let state =
      (this.props.history &&
        this.props.history.location &&
        this.props.history.location.state) ||
      "";
    if (state.stateData) {
      //when a user comes after creating new supplier
      this.setState({ ...state.stateData }, () => {
        this.setState(
          {
            openSupplierLookupModal: false,
            formErrors: {
              currency: "",
              supplierCode: "",
            },
            editName: false,
          },
          () => {
            //getting the update supplierFlags state according to selected supplier
            Promise.all([this.getSupplier(), this.getSuppliersContacts()]);
          }
        );
      });
    } else {
      let tran =
        (this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.tran) ||
        "";
      if (tran) {
        this.setState({ isLoading: true });
        this.getChartSorts();
        let {
          flags,
          clonedFlags,
          defaultUserFlags,
          getFlags,
          currencyList,
          updatePOCheck,
        } = this.state;

        let promises = [];
        if (tran === "addNewPO") {
          //add new po case (Dashboard)
          promises.push(this.insertPO()); //insert po to get trans
        } else {
          //update po case
          updatePOCheck = true;
          this.setState({ tran });
          promises.push(this.getPO(tran)); //get po
        }

        let isCurrencies = false;
        if (this.props.chart.getCurrencies.length > 0) {
          isCurrencies = true;
        } else {
          promises.push(this.props.getCurrencies());
        }

        let isFlgs = false;
        let flgs = this.props.chart.getFlags || "";
        if (!flgs) {
          promises.push(this.props.getFlags());
        } else {
          isFlgs = true;
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
        promises.push(this.getChartCodes("", "all"));

        await Promise.all(promises);

        // get currencies success
        if (this.props.chart.getCurrenciesSuccess || isCurrencies) {
          // toast.success(this.props.chart.getCurrenciesSuccess);
          //currencies list
          if (
            this.props.chart.getCurrencies &&
            this.props.chart.getCurrencies.length > 0
          ) {
            let currencies = this.props.chart.getCurrencies || [];
            let crncyArr = [{ label: "Currency", value: "" }];
            currencies.map((c, i) => {
              crncyArr.push({
                label: c.description + " (" + c.code + ")",
                value: c.code,
              });
            });
            currencyList = crncyArr;
          }
        }
        //error case of Get Currencies
        if (this.props.chart.getCurrenciesError) {
          handleAPIErr(this.props.chart.getCurrenciesError, this.props);
        }

        //success case of get default vaues
        if (this.props.user.getDefaultValuesSuccess) {
          // toast.success(this.props.user.getDefaultValuesSuccess);
        }
        //error case of get default vaues
        if (this.props.user.getDefaultValuesError) {
          handleAPIErr(this.props.user.getDefaultValuesError, this.props);
        }

        //success case of Get Flags List
        if (this.props.chart.getFlagsSuccess || isFlgs) {
          // toast.success(this.props.chart.getFlagsSuccess);

          getFlags = this.props.chart.getFlags || "";
        }
        //error case of Get Flags List
        if (this.props.chart.getFlagsError) {
          handleAPIErr(this.props.chart.getFlagsError, this.props);
        }
        // this is for Line Items Modal (Tracking Codes)

        if (
          this.props.user.getDefaultValues &&
          this.props.user.getDefaultValues.flags.length > 0
        ) {
          flags = [];
          clonedFlags = [];
          defaultUserFlags = [];

          this.props.user.getDefaultValues.flags.map((u, i) => {
            flags.push(
              {
                type: u.type,
                label: u.type,
                value: "",
                id: i,
                sequence: u.sequence,
              },
              {
                type: u.type,
                label: "",
                value: "",
                id: i,
                sequence: u.sequence,
              }
            );
            clonedFlags.push({
              type: u.type,
              value: "",
              prompt: u.prompt,
              sequence: u.sequence,
            });

            defaultUserFlags.push({
              value: u.defaultValue || "",
              length: u.length,
              prompt: u.prompt,
              sequence: u.sequence,
              type: u.type,
              errorMessageIn: "",
              errorMessageF: "",
              errorMessageTax: "",
            });
          });
        }
        this.setState({
          isLoading: false,
          flags,
          clonedFlags,
          defaultUserFlags,
          getFlags,
          currencyList,
          updatePOCheck,
        });
        this.props.clearUserStates();
        this.props.clearChartStates();
        this.props.clearSupplierStates();
        this.props.clearPOStates();
        this.props.clearSupplierStates();
      } else {
        this.props.history.push("/order");
      }
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area", this.uploadAttachment);
  }

  //get po to edit
  //getting the single purchase order
  getPO = async (tran) => {
    if (tran) {
      if (this.props.poData.getPOSuccess === "") {
        await this.props.getPO(tran); // get PO
      }
      //success case of PO
      if (this.props.poData.getPOSuccess) {
        // toast.success(this.props.poData.getPOSuccess);
        let poDetails =
          (this.props.poData.getPO &&
            this.props.poData.getPO.poDetails &&
            JSON.parse(JSON.stringify(this.props.poData.getPO.poDetails))) ||
          "";
        // to show on supplier modal/block
        let currency = poDetails.currency || "";
        let poDate = poDetails.poDate || "";
        let supplierName =
          poDetails.supplierName === "Select Vendor from list" ||
          poDetails.supplierName === "*No Supplier Selected*" ||
          poDetails.supplierName === "*No Supplier Selected*.."
            ? ""
            : poDetails.supplierName || "";
        let supplierPhone = poDetails.supplierPhone || "";
        let supplierAddress = poDetails.supplierAddress || "";
        let supplierContact = poDetails.supplierContact || "";
        let supplierEmail = poDetails.supplierEmail || "";
        let supplierCode = poDetails.supplierCode || "";
        //to show on company modal/block
        let companyOptions = poDetails.companyOptions || [];
        let companyName = poDetails.companyName || "";
        let companyID = poDetails.companyID || "";
        let companyAddress = poDetails.companyAddress || "";
        let taxID = poDetails.companyTaxID || "";
        let phone = poDetails.phone || "";
        let companies = [];
        companyOptions.map((c, i) => {
          companies.push({ label: c.companyName, value: c.companyID });
        });
        // delivery block
        let specialConditions = poDetails.specialConditions || "";
        //to show on PO Reference Modal/block
        let poNumber = poDetails.poNumber || "";
        //order request block
        let requestedBy = poDetails.requestedBy || "";
        let requestedDepartment = poDetails.requestedDepartment || "";
        let approvals =
          (poDetails &&
            JSON.parse(JSON.stringify(poDetails.approvalOptions))) ||
          [];
        let approvalOptions = [];
        approvals.map((a, i) => {
          approvalOptions.push({ label: a.groupName, value: a.groupName });
        });
        let poAttachments = poDetails.attachments || [];
        let approvalGroup = poDetails.approvalGroup || "";
        let poLines = (poDetails && poDetails.poLines) || [];
        let subTotal = (poDetails && Number(poDetails.netTotal)) || 0.0;
        let taxTotal = (poDetails && Number(poDetails.taxTotal)) || 0.0;
        let grossTotal = (poDetails && poDetails.grossTotal) || 0.0;
        poLines.map((poLine, i) => {
          poLine.errorMessageSort = "";
          poLine.errorMessageCode = "";
          poLine.errorInvalidCode = "";
          poLine.id = uuidv1();
          poLine.checked = false;
          poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;
          // if (poLine.startTime && poLine.startTime != "0") {
          //   poLine.startTime *= 1000;
          // }
          // if (poLine.endTime && poLine.endTime != "0") {
          //   poLine.endTime *= 1000;
          // }
          poLine.toDate = poLine.endDate;
          poLine.fromDate = poLine.startDate;
          return poLine;
        });

        /*
          client- I've added a poLine with lineNo -1 to the responses for 
          GetPOLines and GetPO to provide the custom fields for the lines. 
          Can these be hidden on the front end so users don't accidently try to add/edit these lines?
        */
        let dummyPOLine = poLines.find((line) => line.lineNo === -1);
        let customFields = (dummyPOLine && dummyPOLine.customFields) || [];
        let filteredLines = poLines.filter((line) => line.lineNo != -1); // remove line with lineNo = -1

        let basisOptions = poDetails.basisOptions || [];
        let orderDescription = poDetails.description || "";

        this.setState(
          {
            poDetailsApiResp: poDetails,
            currency,
            poDate,
            supplierName,
            supplierPhone,
            supplierAddress,
            supplierContact,
            supplierEmail,
            supplierCode,
            companies,
            companyOptions,
            companyValue: {
              label: companyName || "Select Company",
              value: companyID || "",
            },
            companyName,
            companyID,
            companyAddress,
            taxID,
            phone,
            specialConditions,
            poNumber,
            requestedBy,
            requestedDepartment,
            approvalGroup,
            approvalGroupValue: {
              label: approvalGroup || "Select Approval Group",
              value: approvalGroup || "",
            },
            approvals: approvalOptions,
            poAttachments,
            poLines: filteredLines || [],
            customFields,
            subTotal: Number(subTotal).toFixed(2),
            taxTotal: taxTotal.toFixed(2),
            grossTotal: Number(grossTotal).toFixed(2),
            basisOptions,
            orderDescription,
          },
          async () => {
            Promise.all([
              this.getSuppliersContacts(),
              this.getSuppliersList(),
              this.getSupplier(),
            ]);
          }
        );
      }
      //error case of PO
      if (this.props.poData.getPOError) {
        handleAPIErr(this.props.poData.getPOError, this.props);
      }
    }
  };

  /*when click on New button to create new PO, first call api "insertPO" to create the trans Number 
   after that update po api will call to update PO */
  insertPO = async () => {
    await this.props.insertPO(); // insertPO po
    //success case of Insert PO
    if (this.props.poData.insertPOSuccess) {
      // toast.success(this.props.poData.insertPOSuccess);
      let poDetails =
        (this.props.poData.insertPO &&
          this.props.poData.insertPO.poDetails &&
          JSON.parse(JSON.stringify(this.props.poData.insertPO.poDetails))) ||
        "";
      //geting trans
      let tran = (poDetails && poDetails.tran) || "";
      // to show on supplier modal/block
      let currency = poDetails.currency || "";
      let poDate = poDetails.poDate || "";
      let supplierName = "";
      let supplierPhone = poDetails.supplierPhone || "";
      let supplierAddress = poDetails.supplierAddress || "";
      let supplierContact = poDetails.supplierContact || "";
      let supplierEmail = poDetails.supplierEmail || "";
      let supplierCode = poDetails.supplierCode || "";
      //to show on company modal/block
      let companyOptions = poDetails.companyOptions || [];
      let companies = [];
      companyOptions.map((c, i) => {
        companies.push({ label: c.companyName, value: c.companyID });
      });
      let companyName = poDetails.companyName || "";
      let companyID = poDetails.companyID || "";
      let companyAddress = poDetails.companyAddress || "";
      let taxID = poDetails.companyTaxID || "";
      let phone = poDetails.phone || "";
      // delivery block
      let specialConditions = poDetails.specialConditions || "";
      //to show on PO Reference Modal/block
      let poNumber = poDetails.poNumber || "";
      //order request block
      let requestedBy = poDetails.requestedBy || "";
      let requestedDepartment = poDetails.requestedDepartment || "";
      let approvals =
        (poDetails && JSON.parse(JSON.stringify(poDetails.approvalOptions))) ||
        [];
      let approvalOptions = [];
      approvals.map((a, i) => {
        approvalOptions.push({ label: a.groupName, value: a.groupName });
      });
      let approvalGroup = poDetails.approvalGroup || "";
      let basisOptions = poDetails.basisOptions || [];
      //if there is no currency found in insertPO then use Currency from the getDefaultValues API as default
      if (currency === "") {
        //setting the default values
        let getDefaultValues = localStorage.getItem("getDefaultValues");
        let parsedVals = JSON.parse(getDefaultValues);

        if (parsedVals && parsedVals.defaultValues) {
          if (parsedVals.defaultValues.currency) {
            currency = parsedVals.defaultValues.currency || "";
          }
        }
      }
      let orderDescription = poDetails.description || "";

      let poLines = (poDetails && poDetails.poLines) || [];
      let subTotal = (poDetails && Number(poDetails.netTotal)) || 0.0;
      let taxTotal = (poDetails && Number(poDetails.taxTotal)) || 0.0;
      let grossTotal = (poDetails && poDetails.grossTotal) || 0.0;
      poLines.map((poLine, i) => {
        poLine.id = uuidv1();
        poLine.checked = false;
        poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;
        poLine.toDate = poLine.endDate;
        poLine.fromDate = poLine.startDate;
        return poLine;
      });

      /*
        client- I've added a poLine with lineNo -1 to the responses for 
        GetPOLines and GetPO to provide the custom fields for the lines. 
        Can these be hidden on the front end so users don't accidently try to add/edit these lines?
      */
      let dummyPOLine = poLines.find((line) => line.lineNo === -1);
      let customFields = (dummyPOLine && dummyPOLine.customFields) || [];
      let filteredLines = poLines.filter((line) => line.lineNo != -1); // remove line with lineNo = -1

      this.setState({
        insertPOApiResp: poDetails,
        tran,
        updatePOCheck: false,
        addPOCheck: true,
        currency,
        poDate,
        supplierName,
        supplierPhone,
        supplierAddress,
        supplierContact,
        supplierEmail,
        supplierCode,
        orderDescription,
        companies,
        companyOptions,
        companyValue: {
          label: companyName || "Select Company",
          value: companyID || "",
        },
        companyName,
        companyID,
        companyAddress,
        taxID,
        phone,
        specialConditions,
        poNumber,
        requestedBy,
        requestedDepartment,
        approvalGroupValue: {
          label: approvalGroup || "Select Approval Group",
          value: approvalGroup || "",
        },
        approvals: approvalOptions,
        basisOptions,
        poLines: filteredLines,
        customFields,
        subTotal: Number(subTotal).toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        grossTotal: Number(grossTotal).toFixed(2),
      });
      this.getSuppliersList();
    }
    //error case of Insert  PO
    if (this.props.poData.insertPOError) {
      handleAPIErr(this.props.poData.insertPOError, this.props);
    }
  };

  //Update PO Lines on supplier change
  updatePoLines = () => {
    /*Clinet -> (1)In the Draft PO screen, can the 5 blank PO lines in the response be included when inserting a new PO?
    (2)Can the Insert PO Line button also add 5 blank lines instead of opening the edit line popup? */

    let { poLines, suppliersFlags, defaultUserFlags } = this.state;

    //pre-fill the Chart Sort with the user's default chart sort.
    let chartSort =
      (this.props.user.getDefaultValues &&
        this.props.user.getDefaultValues.defaultValues &&
        this.props.user.getDefaultValues.defaultValues.chartSort) ||
      "";

    let flags = defaultUserFlags || []; //user's flags
    flags = JSON.parse(JSON.stringify(flags));

    suppliersFlags = JSON.parse(JSON.stringify(suppliersFlags));
    //The Supplier flags will overwrite
    //and take precedence over the user's codes if they don't exist.
    flags.map((f, i) => {
      let found = suppliersFlags.find((s) => {
        return s.type.toLowerCase() === f.type.toLowerCase();
      });
      if (found) {
        f.value = found.value || f.value;
      }
      return f;
    });

    let subTotal = 0.0;
    let taxTotal = 0.0;
    let grossTotal = 0.0;

    let newPoLines = JSON.parse(JSON.stringify(poLines));

    for (let i = 0; i < newPoLines.length; i++) {
      newPoLines[i].chartSort = chartSort;
      newPoLines[i].flags = JSON.parse(JSON.stringify(flags));

      // calculation(subTotal, taxTotal, grossTotal) work start
      let poLinedata = newPoLines[i];
      subTotal = Number(subTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    }

    grossTotal = (
      Math.round((Number(subTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(subTotal, taxTotal, grossTotal) work end

    this.setState({
      poLines: newPoLines,
      subTotal: Number(subTotal).toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  //when clicks to + button to add po lines
  insertPoLines = () => {
    /*Clinet -> (1)In the Draft PO screen, can the 5 blank PO lines in the response be included when inserting a new PO?
    (2)Can the Insert PO Line button also add 5 blank lines instead of opening the edit line popup? */

    let {
      clonedFlags,
      poLines,
      customFields,
      suppliersFlags,
      defaultUserFlags,
    } = this.state;

    //pre-fill the Chart Sort with the user's default chart sort.
    let chartSort =
      (this.props.user.getDefaultValues &&
        this.props.user.getDefaultValues.defaultValues &&
        this.props.user.getDefaultValues.defaultValues.chartSort) ||
      "";

    let flags = defaultUserFlags || []; //user's flags
    flags = JSON.parse(JSON.stringify(flags));

    suppliersFlags = JSON.parse(JSON.stringify(suppliersFlags));
    //The Supplier flags will overwrite
    //and take precedence over the user's codes if they don't exist.
    flags.map((f, i) => {
      let found = suppliersFlags.find((s) => {
        return s.type.toLowerCase() === f.type.toLowerCase();
      });
      if (found) {
        f.value = found.value || f.value;
      }
      return f;
    });
    let newPoLines = [];

    for (let i = 0; i < 5; i++) {
      let line = {
        id: uuidv1(),
        type: "Service",
        chartSort,
        chartCode: "",
        description: "",
        amount: "0.00",
        flags,
        checked: false,
        customFields,
      };

      newPoLines.push(line);
    }

    poLines = [...poLines, ...newPoLines];
    poLines = JSON.parse(JSON.stringify(poLines));
    this.setState({ poLines });
  };

  getChartCodes = async (sort, check) => {
    //if check == all it means that get all chartCodes for the first time(when API will be called in didmount )
    //it is because when line item modal opens and we call getChartCodes according to selected Chart sort then state contains only that chart codes related to select chart sorts
    //these all chart codes will be used for chart code auto-completion to show related to the chart sort in the line (filter codes according to sort in the line)
    this.setState({ getChartCodes: "" });
    await this.props.getChartCodes(sort); //to get chart codes filterd list according to chart sort

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);

      let getChartCodes = this.props.chart.getChartCodes || "";

      if (check === "all") {
        //this will contains all chart codes
        this.setState({
          getChartCodes, //this contains codes according to the sorts
          chartCodesList: getChartCodes.chartCodes || [],
          clonedChartCodesList: getChartCodes.chartCodes || [],
        });
      } else {
        this.setState({
          getChartCodes, //this contains codes according to the sorts
        });
      }
    }

    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }
  };

  //handle auto-completing and typing into the Chart Code
  handleChangeChartCode = async (e, line, i) => {
    $(`.chart${i}`).show();
    let { name, value } = e.target;
    let { poLines } = this.state;
    const copyArr = poLines;
    let clonedChartCodesList = [...this.state.chartCodesList];

    // update in po lines
    let foundIndex = copyArr.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = value || "";
      copyArr[foundIndex] = line;
    }

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
    //chart code -----------------------------------------------------
    if (value.length < 1 && name === "chartCode") {
      copyArr[i] = {
        ...copyArr[i],
        errorMessageCode: "Required",
      };
    } else {
      if (name === "chartCode") {
        copyArr[i] = { ...copyArr[i], errorMessageCode: "" };
        const result = await clonedChartCodesList.findIndex(
          (s) => s.code === value
        );
        if (result === -1) {
          copyArr[i] = {
            ...copyArr[i],
            errorMessageCode: "Invalid",
          };
        } else {
          copyArr[i] = {
            ...copyArr[i],
            errorMessageCode: "",
          };
        }
      }
    }

    this.setState({ poLines: copyArr, clonedChartCodesList });
  };
  handleInLine = async (e, d, i,sequence) => {
    debugger;
    this.onblurCode(i);
    let { name, value } = e.target;
    // console.log("sequence:::::::::::", sequence);
    console.log("name:::::::::::", name);
    console.log("value:::::::::::", value);
    console.log("sequence:::::::::::", sequence);
    let { poLines, currencySort, locationSort, episodeSort, getFlags } =
      this.state;
    const copyArr = poLines;
    let dotsCounter = "";

    let a = currencySort.findIndex(
      (f) => f.code === value.toUpperCase().slice(0, 2)
    );
    let b = locationSort.findIndex(
      (f) => f.code === value.toUpperCase().slice(3, 5)
    );
    let c = episodeSort.findIndex(
      (f) => f.code === value.toUpperCase().slice(6, 9)
    );
    let srchIndx = value.search("\\.");
    if (srchIndx !== -1) {
      dotsCounter = value.match(new RegExp("\\.", "g")).length;
    }

    if (name === "chartSort") {
      if (value.length < 1) {
        copyArr[i] = {
          ...copyArr[i],
          sortErrorMsg: "Required",
        };
      } else if (dotsCounter !== 2) {
        if ("." !== value.slice(2, 3)) {
          copyArr[i] = {
            ...copyArr[i],
            sortErrorMsg: "Dot Missing!",
          };
        } else if ("." !== value.slice(5, 6)) {
          copyArr[i] = {
            ...copyArr[i],
            sortErrorMsg: "Dot Missing!",
          };
        }
      } else if (a === -1) {
        copyArr[i] = {
          ...copyArr[i],
          sortErrorMsg: "CU Invalid",
        };
      } else if (b === -1) {
        copyArr[i] = {
          ...copyArr[i],
          sortErrorMsg: "LOC Invalid",
        };
      } else if (c === -1) {
        copyArr[i] = {
          ...copyArr[i],
          sortErrorMsg: "EPS Invalid",
        };
      } else {
        copyArr[i] = { ...copyArr[i], sortErrorMsg: "" };
      }
    }

    // insurance part -------------------------------------------------
    let flags = d.flags || [];
    let insurance = getFlags.insurance || [];
    flags.map((f, i) => {
      if (
        f.type &&
        f.type.toLowerCase() == name.toLowerCase() &&
        name === "Insurance"
      ) {
        f.errorMessageIn = "";
        const result = insurance.findIndex((m) => m.code === value);
        if (result === -1) {
          f.errorMessageIn = "Invalid";
        } else {
          f.errorMessageIn = "";
        }
      }
    });
    d.flags = flags;

    // flag part ------------------------------------------------
    flags = d.flags || [];
    let free = getFlags.free || [];
    flags.map((f, i) => {
      if (
        f.type &&
        f.type.toLowerCase() == name.toLowerCase() &&
        name === "Free"
      ) {
        f.errorMessageF = "";
        const result = free.findIndex((m) => m.code === value);
        if (result === -1) {
          f.errorMessageF = "Invalid";
        } else {
          f.errorMessageF = "";
        }
      }
    });

    // update in po lines
    d.flags = flags;
    // Tax part ----------------------------------------------------
    flags = d.flags || [];
    let tax = getFlags.tax || [];
    flags.map((f, i) => {
      if (
        f.type &&
        f.type.toLowerCase() == name.toLowerCase() &&
        name === "Tax"
      ) {
        f.errorMessageTax = "";
        const result = tax.findIndex((m) => m.code === value);
        if (result === -1) {
          f.errorMessageTax = "Invalid";
        } else {
          f.errorMessageTax = "";
        }
      }
    });

       // Set part ------------------------------------------------
       flags = d.flags || [];
       flags.map((f, i) => {
         if (
           f.type &&
           f.type.toLowerCase() == name.toLowerCase() &&
           name === "Set"
         ) {
           if(!value){
            f.errorMessageSet = "Required";

           }else {
            f.errorMessageSet = "";

           }
          //  if (result === -1) {
          //    f.errorMessageF = "Invalid";
          //  } else {
          //    f.errorMessageF = "";
          //  }
         }
       });

              // Q to Rb3 part ------------------------------------------------
              flags = d.flags || [];
              flags.map((f, i) => {
                if (
                  f.type &&
                  f.type.toLowerCase() == name.toLowerCase() && f.sequence === sequence && 
                  name === "Rebate"
                ) {
                  if(!value){
                   f.errorMessageRebate = "Required";
       
                  }else {
                   f.errorMessageRebate = "";
       
                  }
                 //  if (result === -1) {
                 //    f.errorMessageF = "Invalid";
                 //  } else {
                 //    f.errorMessageF = "";
                 //  }
                }
              });

                 // test part ------------------------------------------------
                 flags = d.flags || [];
                 flags.map((f, i) => {
                   if (
                     f.type &&
                     f.type.toLowerCase() == name.toLowerCase() && f.sequence === sequence && 
                     name === "Other"
                   ) {
                     if(!value){
                      f.errorMessageTest = "Required";
          
                     }else {
                      f.errorMessageTest = "";
          
                     }
                    //  if (result === -1) {
                    //    f.errorMessageF = "Invalid";
                    //  } else {
                    //    f.errorMessageF = "";
                    //  }
                   }
                 });


    // update in po lines
    d.flags = flags;
    this.setState({
      poLines: copyArr,
    });
  };

  handleChangeInLineFields = (e, line) => {
    let { name, value } = e.target;
    let { poLines } = this.state;

    line[name] = value || "";
    this.setState({ poLines });
  };

  convertTwoDecimal = (e, line) => {
    let val = Number(e.target.value).toFixed(2) || 0.0;

    let { poLines } = this.state;
    line["amount"] = val;
    // calculation(subTotal, taxTotal, grossTotal) work start
    let subTotal = 0.0;
    let taxTotal = 0.0;
    let grossTotal = 0.0;
    let lines = JSON.parse(JSON.stringify(poLines));
    lines.map((poLinedata) => {
      subTotal = Number(subTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(subTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(subTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: Number(subTotal).toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  handleChangeFlags = (e, line, sequence) => {
    let { name, value } = e.target;
    // console.log("sequence:::::::::::", sequence);
    // console.log("name:::::::::::", name);
    // console.log("value:::::::::::", value);
    let { poLines, subTotal } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase() && f.sequence === sequence ) {
        f.value = value.toUpperCase();
      }
      return f;
    });

    // update in po lines
    line.flags = flags;

    // calculation(netTotal, taxTotal, grossTotal) work start
    let netTotal = 0.0;
    let taxTotal = 0.0;
    let grossTotal = 0.0;
    let polinesArr = JSON.parse(JSON.stringify(poLines));
    polinesArr.map((poLinedata) => {
      netTotal = Number(netTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );
        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(netTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: netTotal.toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  onblurCode = (i) => {
    setTimeout(() => {
      $(`.chart${i}`).hide();
    }, 300);
  };

  //when select code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line, i) => {
    let { poLines } = this.state;
    const copyArr = poLines;
    console.log("polines@@@@", poLines);
    console.log("polines@@@@", chartCode);

    // update in order lines
    let foundIndex = poLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = chartCode.code || "";
      copyArr[foundIndex] = line;
      copyArr[i] = {
        ...copyArr[i],
        errorMessageCode: "",
      };
    }

    this.setState({ poLines: copyArr });
    this.onblurCode(i);
  };

  getChartSorts = async () => {
      this.setState({ isLoading: true });

      await this.props.getChartSorts();

      //success case of Get Chart Sorts
      if (this.props.chart.getChartSortsSuccess) {
        // toast.success(this.props.chart.getChartSortsSuccess);
        let chartSort = this.props.chart.getChartSorts;
        let currencySort = chartSort.currency || [];
        let locationSort = chartSort.location || [];
        let episodeSort = chartSort.episode || [];
        this.setState({
          currencySort,
          locationSort,
          episodeSort,
        });
      }
      //error case of Get Chart Sorts
      if (this.props.chart.getChartSortsError) {
        handleAPIErr(this.props.chart.getChartSortsError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false });
  };

  //handle change company
  handleChangeCompanies = (data) => {
    let { companyOptions } = this.state;
    let foundCompany = companyOptions.find((c) => c.companyID === data.value);
    if (foundCompany) {
      let { companyName, companyID, companyAddress, taxID, phone } =
        foundCompany;
      this.setState({
        companyName,
        companyID,
        companyAddress,
        taxID,
        phone,
        companyValue: data,
      });
    }
  };

  //handle change approvals in approvals block
  handleChangeApprovalsGroups = (approvalGroup) => {
    this.setState({
      approvalGroup: approvalGroup.value,
      approvalGroupValue: approvalGroup,
    });
  };

  //import quote
  handleQuote = (e) => {
    let quote = e.target.value;
    this.setState({ quote });
  };

  //call api to import quote
  importQuote = async () => {
    let { quote, supplierCode, tran } = this.state;
    if (supplierCode) {
      if (quote && quote.trim() && supplierCode) {
        this.setState({ isLoading: true });
        await this.props.getQuote(supplierCode, quote, tran);
        //success case of get  quotes
        if (this.props.poData.getQuoteSuccess) {
          toast.success(this.props.poData.getQuoteSuccess);
          await this.importQuoteReplacePOLines(this.props.poData.getQuote); //replace po-lines
        }
        //error case of get quotes
        if (this.props.poData.getQuoteError) {
          handleAPIErr(this.props.poData.getQuoteError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearPOStates();
      }
    } else {
      toast.error("PLease Select A Supplier!");
      this.setState({ quote: "" });
    }
  };

  //import quotes will replace po lines
  importQuoteReplacePOLines = (data) => {
    let poLines = (data.poDetails && data.poDetails.poLines) || [];
    if (poLines.length > 0) {
      // calculation(netTotal, taxTotal, grossTotal) work start
      let netTotal = 0.0;
      let taxTotal = 0.0;
      let grossTotal = 0.0;
      let polinesArr = _.cloneDeep(poLines);

      polinesArr = polinesArr.filter((line) => line.lineNo != -1); // remove line with lineNo = -1

      let POlns = polinesArr.map((poLine) => {
        poLine.id = uuidv1();
        poLine.checked = false;
        if (poLine.startTime && poLine.startTime != "0") {
          poLine.startTime *= 1000;
        }
        if (poLine.endTime && poLine.endTime != "0") {
          poLine.endTime *= 1000;
        }
        poLine.amount = Number(poLine.amount).toFixed(2) || 0.0;
        netTotal = Number(netTotal) + Number(poLine.amount);
        let taxFlag = poLine.flags.find((f) => f.type.toLowerCase() === "tax");
        if (taxFlag) {
          let foundTax = this.props.chart.getFlags.tax.find(
            // this is for to get rate of a tax code or value
            (flagValue) => flagValue.code == taxFlag.value
          );
          if (foundTax) {
            let calculatedTax =
              (Number(poLine.amount) * Number(foundTax.rate)) / 100;
            taxTotal += calculatedTax;
          }
        }
        return poLine;
      });
      grossTotal = (
        Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
      ).toFixed(2);
      // calculation(netTotal, taxTotal, grossTotal) work end
      this.setState({
        poLines: POlns,
        subTotal: netTotal.toFixed(2),
        taxTotal: Number(taxTotal).toFixed(2),
        grossTotal,
      });
    }
  };

  //upldate po-lines according to multiple change modal
  handleMultipleChanges = (data) => {
    let { poLines } = this.state;
    let flagIsEmpty = false;
    // data.trackingCodes.map((f, i) => {
    //   if (f.value.trim() == "") {
    //     flagIsEmpty = true;
    //   }
    // });
    poLines.map((p, i) => {
      if (p.checked) {
        if (data.chartSort) {
          p.chartSort = data.chartSort;
        }
        // if (data.chartCode) {
        p.chartCode = data.chartCode || "";
        // }
        if (data.trackingCodes && data.trackingCodes.length > 0) {
          p.flags = data.trackingCodes;
        }
      }
      return p;
    });
    this.setState({ poLines });
  };

  //add/update PO Lines
  getNewORUpdatedPOLine = (poLine) => {
    let { poLines } = this.state;

    if (poLine.id) {
      //update case
      var foundIndex = poLines.findIndex((p) => p.id == poLine.id);
      //var data = poLines.find(p => p.id == poLine.id);
      if (foundIndex != -1) {
        poLine.customFields = poLines[foundIndex].customFields || []; //to add custome fields
      }
      if (poLine.customFields && poLine.customFields.length > 0) {
        poLine.customFields.map((c, i) => {
          if (poLine[c.prompt]) {
            return (c.value = poLine[c.prompt]);
          }
        });
      }
      poLines[foundIndex] = poLine;
    } else {
      //add case
      poLine.id = uuidv1();
      poLine.checked = false;

      poLine.customFields = poLine.customFields || []; //to add custome fields

      if (poLine.customFields && poLine.customFields.length > 0) {
        poLine.customFields.map((c, i) => {
          if (poLine[c.prompt]) {
            return (c.value = poLine[c.prompt]);
          }
        });
      }

      poLines.push(poLine);
    }
    // calculation(netTotal, taxTotal, grossTotal) work start
    let netTotal = 0.0;
    let taxTotal = 0.0;
    let grossTotal = 0.0;
    let polinesArr = JSON.parse(JSON.stringify(poLines));
    polinesArr.map((poLinedata) => {
      netTotal = Number(netTotal) + Number(poLinedata.amount);
      let taxFlag = poLinedata.flags.find(
        (f) => f.type.toLowerCase() === "tax"
      );
      if (taxFlag) {
        let foundTax = this.props.chart.getFlags.tax.find(
          // this is for to get rate of a tax code or value
          (flagValue) =>
            flagValue.code.toLowerCase() == taxFlag.value.toLowerCase()
        );

        if (foundTax) {
          let calculatedTax =
            (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
          taxTotal += calculatedTax;
        }
      }
    });
    grossTotal = (
      Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
    ).toFixed(2);
    //calculation(netTotal, taxTotal, grossTotal) work end
    this.setState({
      poLines,
      subTotal: netTotal.toFixed(2),
      taxTotal: Number(taxTotal).toFixed(2),
      grossTotal,
    });
  };

  //edit po lines
  editPOLine = (data) => {
    if (data.type && data.type.trim()) {
      this.setState({ poLineEditData: data }, () => {
        this.openModal("openLineItemModal");
      });
    }
  };

  //going to delete po line
  deletePOLineItem = (poLine) => {
    this.setState({ deletePOLineId: poLine.id }, () =>
      this.openModal("openDeleteOrderDetailModal")
    );
  };

  //delete po line
  deletePOLine = (id) => {
    let { poLines } = this.state;
    if (id) {
      let filteredPOLines = poLines.filter((p) => p.id != id);
      let subTotal = 0;
      filteredPOLines.map((poLine, i) => {
        subTotal += Number(poLine.amount);
        return poLine;
      });
      this.setState({
        poLines: filteredPOLines,
        subTotal: Number(subTotal).toFixed(2),
      });
    }
  };

  // hanldle change field
  handleChangeField = async (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    if (fieldName === "poNumber") {
      //to only enters numbers
      let val = this.state[fieldName];
      let value = e.target.validity.valid ? fieldValue : val;
      this.setState({ [fieldName]: value });
    } else if (fieldName === "taxTotal") {
      let grossTotal = Number(this.state.subTotal) + Number(fieldValue);
      this.setState({ [fieldName]: fieldValue, grossTotal });
    } else {
      this.setState({ [fieldName]: fieldValue });
    }
  };

  //get supplier's list
  getSuppliersList = async () => {
    await this.props.getSuppliersList(this.state.currency || "", "", "ORDER"); //second param for previous supplier(used in search page)
    //success case of Get Suppliers List
    if (this.props.supplier.getSuppliersListSuccess) {
      // toast.success(this.props.supplier.getSuppliersListSuccess);
      this.setState({
        suppliersList: this.props.supplier.getSuppliersList || [],
        // clonedSuppliersList: this.props.supplier.getSuppliersList || [], //a copy of suppliers list
      });
    }
    //error case of Get Suppliers List
    if (this.props.supplier.getSuppliersListError) {
      handleAPIErr(this.props.supplier.getSuppliersListError, this.props);
    }
  };

  //update state supplier when select supplier from the supplier lookup
  updatePOSupplier = (data) => {
    let { formErrors } = this.state;
    let { name, code, address, currency } = data;
    this.setState(
      {
        isLoading: true,
        currency,
        supplierName: name,
        supplierCode: code,
        supplierAddress: address,
        //clear contacts
        supplierContact: "",
        supplierEmail: "",
        supplierPhone: "",
        editName: false,
      },
      async () => {
        formErrors = Validation.handleWholeValidation(
          { supplierCode: this.state.supplierCode, currency },
          formErrors
        );
        //to get suppliers contacts
        await this.getSuppliersContacts();

        //swap supplier and users flags only in add case
        //get suppliers
        await this.getSupplier();

        this.setState(
          {
            isLoading: false,
            formErrors,
          },
          () => {
            this.updatePoLines();
          }
        );
      }
    );
  };

  getSuppliersContacts = async () => {
    let { currency, supplierCode } = this.state;
    let data = {
      currency,
      code: supplierCode,
    };
    if (currency && supplierCode) {
      await this.props.getSupplierContacts(data);

      //success case of get  Supplier Contacts
      if (this.props.supplier.getSupplierContactsSuccess) {
        // toast.success(this.props.supplier.getSupplierContactsSuccess);
        let contacts = this.props.supplier.getSupplierContacts || [];
        contacts.map((c, i) => {
          c.checked = false;
          return c;
        });
        if (contacts.length > 0) {
          this.setState({
            contacts,
            supplierContact: contacts[0].name,
            supplierEmail: contacts[0].email,
            supplierPhone: contacts[0].phone,
          });
        } else {
          this.setState({ contacts });
        }
      }
      //error case of get Supplier Contacts
      if (this.props.supplier.getSupplierContactsError) {
        handleAPIErr(this.props.supplier.getSupplierContactsError, this.props);
      }
    }
  };

  getSupplier = async () => {
    /*
    168. Vendor Tracking Codes vs User Tracking Codes - 
    These codes need to be reconciled when creating a new Invoice or Order line. 
    The tracking flags from the getSupplier request need to be reconciled with
    the tracking codes from the users default tracking codes. The Supplier flags will overwrite
    and take precedence over the user's codes if they don't exist. For example, if a **supplier** has 
    the following tracking codes: **Free = A and Tax = G**. And a **User** has the following tracking codes,
    **Insurance = NQ, Tax = V, and Set = 5000**. It will merge these codes with **supplier taking precedence**, 
    so the tracking code of the Invoice or Order line will
    now be **Insurance = NQ, Free = A, Tax = G (because the supplier gets priority) and Set = 5000**.
    */
    let { currency, supplierCode } = this.state;
    let supplierDetails = {
      currency,
      code: supplierCode,
    };
    await this.props.getSupplier(supplierDetails);
    //success case of Get single Supplier
    if (this.props.supplier.getSupplierSuccess) {
      // toast.success(this.props.supplier.getSupplierSuccess);
      let flgs = this.props.supplier.getSupplier.flags || [];

      this.setState({ suppliersFlags: flgs });
    }
    //error case of Get single Supplier
    if (this.props.supplier.getSupplierError) {
      handleAPIErr(this.props.supplier.getSupplierError, this.props);
    }
    this.props.clearSupplierStates();
  };

  //updating the contacts list after adding, updating OR deleting the contact
  updateSupplierContactsList = async (contact, check) => {
    if (check === "add") {
      await this.getSuppliersContacts();
      //let contacts = this.state.contacts;
      //contacts.push(contact);
      //this.setState({ contacts });
    } else if (check === "edit") {
      let foundIndex = this.state.contacts.findIndex((c) => c.id == contact.id);
      this.state.contacts[foundIndex] = contact;
    } else {
      //delete case
      let contacts = this.state.contacts || [];
      let filteredContacts = contacts.filter((c) => c.id != contact.id);
      this.setState({ contacts: filteredContacts });
    }
  };

  //update state of supplier's contacts when select a contact from the contact list
  updatePOSupplierContacts = (data) => {
    let { name, email, phone } = data;
    this.setState({
      supplierContact: name,
      supplierEmail: email,
      supplierPhone: phone,
    });
  };

  //a function that checks api error
  handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      this.props.clearStatesAfterLogout();
      this.props.history.push("/login");
      toast.error(error);
    } else if (error === "User has not logged into a production.") {
      toast.error(error);
      this.props.history.push("/login-table");
    } else {
      //Netork Error || api error
      toast.error(error);
    }
  };

  handleChangeDate = (date) => {
    this.setState({
      poDate: new Date(date).getTime(),
    });
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false, poLineEditData: "", deletePOLineId: "" });
  };

  //updated value of flags comming from line item modal
  updateFlags = (flags, clonedFlags) => {
    this.setState({ flags, clonedFlags });
  };

  // uplaod po attchments
  uploadAttachment = async (attachments) => {
    let fileList = [];
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
      await this.addAttachments(fileList);
    }
  };

  addAttachments = async (fileList) => {
    let { tran } = this.state;
    if (tran) {
      this.setState({ isLoading: true });
      let data = {
        tran,
        fileList,
      };
      await this.props.addPoAttachmentLists(data);
      if (this.props.poData.addPOAttachmentListsSuccess) {
        toast.success(this.props.poData.addPOAttachmentListsSuccess);
        let poAttachments = this.props.poData.addPOAttachmentLists || [];
        this.setState({ poAttachments });
      }
      if (this.props.poData.addPOAttachmentListsError) {
        handleAPIErr(this.props.poData.addPOAttachmentListsError, this.props);
      }
      this.props.clearPOStates();
      this.setState({ isLoading: false });
    }
  };

  deletePOAttachment = async (recordID) => {
    this.setState({ isLoading: true });
    await this.props.deletePOAttachment(recordID);
    if (this.props.poData.deletePOAttachmentSuccess) {
      toast.success(this.props.poData.deletePOAttachmentSuccess);
      let poAttachments = this.state.poAttachments || [];
      let filteredPOAttachments = poAttachments.filter(
        (a) => a.recordID != recordID
      );
      this.setState({ poAttachments: filteredPOAttachments });
    }
    if (this.props.poData.deletePOAttachmentError) {
      handleAPIErr(this.props.poData.deletePOAttachmentError, this.props);
    }
    this.props.clearPOStates();
    this.setState({ isLoading: false });
  };

  //handleCurrencyChange
  handleCurrencyChange = (data) => {
    let { formErrors } = this.state;
    this.setState(
      {
        currency: data.value,
        supplierName: "",
        supplierAddress: "",
        supplierContact: "",
        supplierEmail: "",
        supplierPhone: "",
        supplierCode: "",
        suppliersList: [], //contains all suppliers by calling Get Supplier Api
        clonedSuppliersList: [], //a copy of  suppliersList
        contacts: [],
      },
      async () => {
        formErrors = Validation.handleValidation(
          "currency",
          data.value,
          formErrors
        );
        this.setState({ isLoading: true, formErrors });
        await this.getSuppliersList();
        this.setState({ isLoading: false });
        let { poLines, currency } = this.state;
        this.state.poLines.map((l, i) => {
          let chartSort = "";

          let sortArray = l.chartSort.split(".");

          if (sortArray.length === 3) {
            let sortCurrency = currency
              ? currency
              : sortArray[0]
              ? sortArray[0]
              : "";
            let sortLocation = sortArray[1] ? sortArray[1] : "";
            let sortEpisode = sortArray[2] ? sortArray[2] : "";
            l.chartSort = sortCurrency + "." + sortLocation + "." + sortEpisode;
          } else {
            l.chartSort = l.chartSort;
          }
          return l;
        });
        this.setState({ poLines });
      }
    );
  };

  handleCheckboxesInOrderDetails = (e, line) => {
    let { poLines } = this.state;
    if (e.target.checked) {
      if (line === "all") {
        poLines.map((l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        poLines.map((l, i) => {
          if (l.id === line.id) {
            l.checked = true;
          }
          return l;
        });
      }
    } else {
      if (line === "all") {
        poLines.map((l, i) => {
          l.checked = false;
          return l;
        });
      } else {
        poLines.map((l, i) => {
          if (l.id === line.id) {
            l.checked = false;
          }
          return l;
        });
      }
    }
    this.setState({
      poLines,
    });
  };

  handleMultipleChangesModal = () => {
    let lines = this.state.poLines || [];
    let check = lines.find((l) => l.checked);
    if (check) {
      this.openModal("openMultipleChangesModal");
    } else {
      toast.error("Please tick lines for Multiple changes!");
    }
  };

  handleChangeSupplierName = (e) => {
    let {
      supplierName,
      supplierContact,
      supplierEmail,
      supplierPhone,
      contacts,
      formErrors,
    } = this.state;
    $(".invoice_vender_menu1").show();

    let value = e.target.value;

    formErrors.supplierCode = "This Field is Required!";

    let clonedSuppliersList = JSON.parse(
      JSON.stringify(this.state.suppliersList)
    );

    if (!value) {
      clonedSuppliersList = [];
    } else {
      let suppliersListFilterdData = clonedSuppliersList.filter((c) => {
        return c.name.toUpperCase().includes(value.toUpperCase());
      });
      clonedSuppliersList = suppliersListFilterdData;
      supplierContact = "";
      supplierEmail = "";
      supplierPhone = "";
      contacts = [];
    }

    this.setState({
      supplierName: value,
      supplierCode: "",
      editName: true,
      clonedSuppliersList,
      supplierContact,
      supplierEmail,
      supplierPhone,
      contacts,
      formErrors,
    });
  };

  //create supplier when click on + when supplier inline editing
  addSupplier = () => {
    this.props.history.push("/new-supplier2", {
      stateData: this.state,
      page: "newPOedit",
      supplierName: this.state.supplierName,
    });
  };

  //view attachments in new tab
  getAttachment = async (recordID, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getPOAttachment(this.state.tran, recordID);
    if (this.props.poData.getPOAttachmentSuccess) {
      // toast.success(this.props.poData.getPOAttachmentSuccess);
      let resp = this.props.poData.getPOAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.poData.getPOAttachmentError) {
      handleAPIErr(this.props.poData.getPOAttachmentError, this.props);
    }
    this.props.clearPOStates();
    this.setState({ isLoading: false });
  };

  //when clcik on Export from menue item
  exportPOLines = async () => {
    let { poLines } = this.state;
    let linesToExport = poLines.filter((l) => l.checked);
    if (linesToExport.length > 0) {
      this.setState({ isLoading: true });
      await this.props.exportPOLines(linesToExport);
      //success case of export PO Lines
      if (this.props.poData.exportPOLinesSuccess) {
        toast.success(this.props.poData.exportPOLinesSuccess);
        let attachemnt = this.props.poData.exportPOLines || "";
        if (attachemnt) {
          window.location.href =
            "data:application/vnd.ms-excel;base64," + attachemnt;
        }
        this.openModal("openExportSuccessModal");
      }
      //error case of export PO Lines
      if (this.props.poData.exportPOLinesError) {
        handleAPIErr(this.props.poData.exportPOLinesError, this.props);
      }
      this.props.clearPOStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Lines to Export!");
    }
  };

  //when clcik on Import from menue item
  importPOLines = async (excelData) => {
    this.setState({ isLoading: true });
    let { tran } = this.state;
    if (excelData) {
      await this.props.importPOLines(excelData, tran);
    }
    //success case of Import PO Lines
    if (this.props.poData.importPOLineseSuccess) {
      toast.success(this.props.poData.importPOLineseSuccess);
    }
    //error case of Import PO Lines
    if (this.props.poData.importPOLineseError) {
      handleAPIErr(this.props.poData.importPOLineseError, this.props);
    }
    this.props.clearPOStates();
    this.setState({ isLoading: false });
  };

  updatePO = async (e) => {
      e.preventDefault();

    let {
      updatePOCheck,
      addPOCheck,
      poNumber,
      poLines,
      specialConditions,
      requestedBy,
      requestedDepartment,
      approvalGroupValue,
      supplierName,
      supplierCode,
      supplierAddress,
      supplierContact,
      supplierEmail,
      supplierPhone,
      currency,
      companyName,
      companyID,
      companyAddress,
      taxID,
      phone,
      orderDescription,
      formErrors,
    } = this.state;
    formErrors = Validation.handleWholeValidation(
      { currency, supplierCode },
      formErrors
    );
    /////////   order detail valodation //////////
    let error = poLines.findIndex(
      (m) => m.sortErrorMsg || m.errorMessageCode
    );
    var arr = [];
    poLines.map((m) => {
      arr.push(...m.flags);
    });

    let errorFlags = arr.findIndex((f) => 
    Object.keys(f.errorMessageIn || "").length  > 0 || 
    Object.keys(f.errorMessageF || "").length  > 0 || 
    Object.keys(f.errorMessageTax || "").length  > 0 ||
    Object.keys(f.errorMessageSet || "").length  > 0 ||
    Object.keys(f.errorMessageRebate || "").length  > 0 ||
    Object.keys(f.errorMessageTest || "").length  > 0 );
    
    if(error !== -1 || errorFlags !== -1){
      toast.error("Please correct all invalid fields");
      return
    }
    // // console.log("error>>>>>>>>>>>>", error);
    // // console.log("error>>>>>>>>>>>>", errorFlags);
////////-------------------------------------------------------
    if (!formErrors.supplierCode && !formErrors.currency) {
      let { tran, poLines } = this.state;
      if (tran) {
        poLines.map((line) => {
          line.description = line.description.toUpperCase();
          if (
            line.type === "Rental/Hire" ||
            line.type === "Hire/Rental" ||
            line.type === "Car"
          ) {
            line.startDate = line.fromDate;
            line.endDate = line.toDate;
            line.startTime = line.startTime;
            line.endTime = line.endTime;
          }
        });

        this.setState({
          isLoading: true,
        });
        let data = {};
        if (updatePOCheck) {
          //if true menas that it contains getPO API response  otherwise insertPO api
          data = this.state.poDetailsApiResp || "";
        } else {
          data = this.state.insertPOApiResp;
        }
        data.currency = currency;
        data.supplierName = supplierName;
        data.supplierCode = supplierCode;
        data.supplierAddress = supplierAddress;
        data.supplierContact = supplierContact;
        data.supplierEmail = supplierEmail;
        data.supplierPhone = supplierPhone;
        data.companyName = companyName;
        data.companyID = companyID;
        data.companyAddress = companyAddress;
        data.companyTaxID = taxID;
        data.companyPhone = phone;
        data.poNumber = poNumber;
        data.specialConditions = specialConditions;
        data.requestedBy = requestedBy;
        data.requestedDepartment = requestedDepartment;
        data.approvalGroup = approvalGroupValue.value || "";
        data.poLines = poLines;
        data.description = orderDescription || "";

        // calculation(netTotal, taxTotal, grossTotal) work start
        let netTotal = Number(this.state.subTotal);
        let taxTotal = Number(this.state.taxTotal);
        let grossTotal = 0.0;
        // let polinesArr = JSON.parse(JSON.stringify(poLines));
        // polinesArr.map((poLinedata) => {
        //   netTotal = Number(netTotal) + Number(poLinedata.amount);
        //   let taxFlag = poLinedata.flags.find(
        //     (f) => f.type.toLowerCase() === "tax"
        //   );
        //   if (taxFlag) {
        //     let foundTax = this.state.getFlags.tax.find(
        //       // this is for to get rate of a tax code or value
        //       (flagValue) => flagValue.code == taxFlag.value
        //     );
        //     if (foundTax) {
        //       let calculatedTax =
        //         (Number(poLinedata.amount) * Number(foundTax.rate)) / 100;
        //       taxTotal += calculatedTax;
        //     }
        //   }
        // });
        grossTotal = (
          Math.round((Number(netTotal) + Number(taxTotal)) * 100) / 100
        ).toFixed(2);
        //calculation(netTotal, taxTotal, grossTotal) work end
        data.netTotal = Number(netTotal);
        data.taxTotal = Number(taxTotal).toFixed(2);
        data.grossTotal = Number(grossTotal);
        if (data.supplierEmail && data.supplierEmail.trim() != "") {
          data.sendEmail = "Y";
        } else {
          data.sendEmail = "N";
        }

        await this.props.updatePO(tran, data); // updatePO po
        //success case of updatePO PO
        if (this.props.poData.updatePOSuccess) {
          toast.success(this.props.poData.updatePOSuccess);
          /*Check When Add/Edit Order and then user Save or Cancel that edit, 
            then load the same  Order user just edited/created?.*/
          if (this.state.updatePOCheck || this.state.addPOCheck) {
            this.props.history.push("/order", {
              tallies: "Draft",
              addEditPOCheck: true,
              addEditPOTran: this.state.tran,
            });
          } else {
            this.props.history.push("/order");
          }
        }
        //error case of updatePO PO
        if (this.props.poData.updatePOError) {
          handleAPIErr(this.props.poData.updatePOError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearPOStates();
      } else {
        toast.error("Trans is missing");
      }
    }
    this.setState({
      formErrors: formErrors,
    });
  };

  onCancel = async () => {
    /*Check When Add/Edit Order and then user Save or Cancel that edit, 
    then load the same  Order user just edited/created?.*/
    if (this.state.updatePOCheck || this.state.addPOCheck) {
      this.props.history.push("/order", {
        tallies: "Draft",
        addEditPOCheck: true,
        addEditPOTran: this.state.tran,
      });
    } else {
      this.props.history.push("/order");
    }
  };

  onFocus = (e) => {
    let id = e.target.id;
    this.setState({ [id]: true });
  };

  onBlur = (e) => {
    let id = e.target.id;
    this.setState({ [id]: false });
  };

  //Allow a user to close company, PO Reference, Order Request, Delivery, Approval Group cards and remember that setting.
  handleHideCheck = (name, value) => {
    this.setState({ [name]: !value }, () => {
      let {
        comp_hide,
        poRef_hide,
        ordReq_hide,
        deliv_hide,
        approval_hide,
        cur_hide,
        date_hide,
        address_hide,
        quote_hide,
      } = this.state;
      let hide_columns = [];
      hide_columns = {
        comp_hide,
        poRef_hide,
        ordReq_hide,
        deliv_hide,
        approval_hide,
        cur_hide,
        date_hide,
        address_hide,
        quote_hide,
      };
      let username = localStorage.getItem("userLogin") || "";
      localStorage.setItem(
        username + "_HideFields",
        JSON.stringify(hide_columns)
      );
    });
  };

  showHiddenCards = () => {
    let name = localStorage.getItem("userLogin");
    let data = localStorage.getItem(name + "_HideFields");
    data = data ? JSON.parse(data) : "";
    this.setState({ ...data });
  };

  //END
  render() {
    let lockPONumber = "";
    lockPONumber = localStorage.getItem("lockPONumber"); //e.g 'Y' || 'N' if Y then po number not be editable otherwise editable
    let {
      currency,
      poDate,
      supplierName,
      supplierPhone,
      supplierAddress,
      supplierContact,
      supplierEmail,
      supplierCode,
      comp_hide,
      poRef_hide,
      ordReq_hide,
      deliv_hide,
      approval_hide,
      cur_hide,
      date_hide,
      address_hide,
      quote_hide,
    } = this.state;

    return (
      <>
        {console.log("State::::::", this.state.poLines)}
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}
        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} newPoEdit={true} />
          {/* end */}
          {/* body part */}
          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="container-fluid ">
                  <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                    <div className="row d-flex justify-content-center h-60vh">
                      <div className="col-12 col-md-12 w-100 ">
                        <div className="forgot_form_main report_main sup-inner-pad">
                          <div className="forgot_header">
                            <div className="modal-top-header">
                              <div className="row">
                                <div className="col d-flex justify-content-end s-c-main">
                                  <button
                                    type="button"
                                    className={
                                      this.state.id_save
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2236"
                                    id="id_save"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    onClick={this.updatePO}
                                  >
                                    <span className="fa fa-check"></span>
                                    Save
                                  </button>

                                  <button
                                    onClick={this.onCancel}
                                    type="button"
                                    className={
                                      this.state.id_cancel
                                        ? "btn-save btn_focus"
                                        : "btn-save"
                                    }
                                    tabIndex="2237"
                                    id="id_cancel"
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                  >
                                    <span className="fa fa-ban"></span>
                                    Cancel
                                  </button>
                                  <div className="s-c-main">
                                    <Dropdown
                                      alignRight="false"
                                      drop="down"
                                      className="analysis-card-dropdwn float-right"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                      >
                                        <img
                                          src="images/user-setup/dots.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "cur_hide",
                                                cur_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check mm_check5">
                                              <input
                                                type="checkbox"
                                                id="cur_hide"
                                                name="cur_hide"
                                                checked={cur_hide}
                                              />
                                              <label
                                                htmlFor="cur_hide"
                                                className="mr-0"
                                              >
                                                Hide Currency
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "date_hide",
                                                date_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="date_hide"
                                                name="date_hide"
                                                checked={date_hide}
                                              />
                                              <label
                                                htmlFor="date_hide"
                                                className="mr-0"
                                              >
                                                Hide Date
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "address_hide",
                                                address_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="address_hide"
                                                name="address_hide"
                                                checked={address_hide}
                                              />
                                              <label
                                                htmlFor="address_hide"
                                                className="mr-0"
                                              >
                                                Hide Address
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "quote_hide",
                                                quote_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="quote_hide"
                                                name="quote_hide"
                                                checked={quote_hide}
                                              />
                                              <label
                                                htmlFor="quote_hide"
                                                className="mr-0"
                                              >
                                                Hide Import Quote
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "comp_hide",
                                                comp_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check mm_check5">
                                              <input
                                                type="checkbox"
                                                id="comp_hide"
                                                name="comp_hide"
                                                checked={comp_hide}
                                              />
                                              <label
                                                htmlFor="comp_hide"
                                                className="mr-0"
                                              >
                                                Hide Company
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "poRef_hide",
                                                poRef_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="poRef_hide"
                                                name="poRef_hide"
                                                checked={poRef_hide}
                                              />
                                              <label
                                                htmlFor="poRef_hide"
                                                className="mr-0"
                                              >
                                                Hide PO Reference
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "ordReq_hide",
                                                ordReq_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="ordReq_hide"
                                                name="ordReq_hide"
                                                checked={ordReq_hide}
                                              />
                                              <label
                                                htmlFor="ordReq_hide"
                                                className="mr-0"
                                              >
                                                Hide Order Request
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "deliv_hide",
                                                deliv_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="deliv_hide"
                                                name="deliv_hide"
                                                // onChange={(event)=>this.handleHideCheck(
                                                // event
                                                // )}
                                                checked={deliv_hide}
                                              />
                                              <label
                                                htmlFor="deliv_hide"
                                                className="mr-0"
                                              >
                                                Hide Delivery
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleHideCheck(
                                                "approval_hide",
                                                approval_hide
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check mm_check">
                                              <input
                                                type="checkbox"
                                                id="approval_hide"
                                                name="approval_hide"
                                                checked={approval_hide}
                                              />
                                              <label
                                                htmlFor="approval_hide"
                                                className="mr-0"
                                              >
                                                Hide Approval Group
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                                        data-target="#PO_Details"
                                      />{" "}
                                    </span>
                                    PO Details
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="PO_Details">
                            <div className="row">
                              <div className="col-lg-6">
                                {/* Supplier Modal Adding start */}

                                <div className="col-lg-12 ">
                                  <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn sup_pb">
                                    <div className="forgot_header">
                                      <div className="modal-top-header">
                                        <div className="row bord-btm">
                                          <div className="col-auto pl-0">
                                            <h6 className="text-left def-blue">
                                              Supplier
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="forgot_body">
                                        <div className="row mt-4">
                                          {!cur_hide ? (
                                            <div className="col-md-6">
                                              {/* dropdown coding start */}
                                              <div className="form-group custon_select custom_selct2">
                                                <label>Currency</label>
                                                <Select
                                                  // isDisabled
                                                  className="width-selector"
                                                  value={{
                                                    label: currency,
                                                    value: currency,
                                                  }}
                                                  // classNamePrefix="custon_select-selector-inner"
                                                  styles={_customStyles}
                                                  classNamePrefix="react-select"
                                                  options={
                                                    this.state.currencyList
                                                  }
                                                  onChange={
                                                    this.handleCurrencyChange
                                                  }
                                                  id="cur"
                                                  tabIndex="2233"
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
                                                <div className="text-danger error-12">
                                                  {this.state.formErrors
                                                    .currency !== ""
                                                    ? this.state.formErrors
                                                        .currency
                                                    : ""}
                                                </div>
                                              </div>
                                              {/* end  */}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {!date_hide ? (
                                            <div className="col-md-6">
                                              <div className="form-group custon_select">
                                                <label htmlFor="id_date">
                                                  Date
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_date"
                                                    tabIndex="2234"
                                                    value={
                                                      poDate
                                                        ? moment(
                                                            poDate,
                                                            "DD/MM/YYYY"
                                                          )
                                                            .format(
                                                              "DD MMM YYYY"
                                                            )
                                                            .toUpperCase()
                                                        : ""
                                                    }
                                                    onChange={() => {}}
                                                    // disabled
                                                  />
                                                  {/* <DatePicker
                                              // disabled
                                              selected={new Date()}
                                              onChange={this.handleChangeDate}
                                               dateFormat="d MMM yyyy"
                                                autoComplete='off'

                                            /> */}
                                                  {/* <input type="date" className="form-control" id="usr"/> */}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <div className="form-group col-12">
                                            <div className="custon_select">
                                              <label htmlFor="id_sName">
                                                Supplier Name
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control focus_vender"
                                                  id="id_sName"
                                                  tabIndex="2222"
                                                  autoFocus={true}
                                                  autoComplete="off"
                                                  name={"supplierName"}
                                                  value={
                                                    this.state.supplierName
                                                  }
                                                  placeholder={
                                                    "Please select supplier from list or start typing"
                                                  }
                                                  onChange={
                                                    this
                                                      .handleChangeSupplierName
                                                  }
                                                />

                                                <span className="input_field_icons">
                                                  <i
                                                    onClick={() =>
                                                      this.openModal(
                                                        "openSupplierLookupModal"
                                                      )
                                                    }
                                                    className="fa fa-search"
                                                  ></i>
                                                </span>
                                              </div>
                                              <div className="invoice_vender_menu1">
                                                {this.state.clonedSuppliersList
                                                  .length > 0 ? (
                                                  <ul className="invoice_vender_menu">
                                                    {this.state.clonedSuppliersList.map(
                                                      (s, i) => {
                                                        return (
                                                          <li
                                                            classname="cursorPointer"
                                                            key={i}
                                                            onClick={() =>
                                                              this.updatePOSupplier(
                                                                s
                                                              )
                                                            }
                                                          >
                                                            <span>
                                                              <img
                                                                src={userAvatar}
                                                                className=" img-fluid"
                                                                alt="user"
                                                              />
                                                            </span>
                                                            <div className="vender_menu_right">
                                                              <h3>{s.name}</h3>
                                                              <p className="invoice_edit_vender_email">
                                                                {s.email}
                                                              </p>
                                                            </div>
                                                          </li>
                                                        );
                                                      }
                                                    )}
                                                  </ul>
                                                ) : (
                                                  <div className="sup_nt_fnd text-center">
                                                    <h6>No Supplier Found</h6>
                                                  </div>
                                                )}
                                                {this.state.editName ? (
                                                  <div className="last_menu_li cursorPointer">
                                                    <buuton
                                                      onClick={this.addSupplier}
                                                      className="addSupplier"
                                                    >
                                                      + Create Supplier From{" "}
                                                      {"'"}
                                                      {this.state.supplierName}
                                                      {"'"}
                                                    </buuton>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors
                                                .supplierCode !== ""
                                                ? this.state.formErrors
                                                    .supplierCode
                                                : ""}
                                            </div>
                                          </div>
                                          {!address_hide ? (
                                            <div className="col-12">
                                              <div className="form-group custon_select disabled_fields pl-0">
                                                <label htmlFor="id_address">
                                                  Address
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_address"
                                                    // tabIndex="2225"
                                                    disabled
                                                    value={supplierAddress}
                                                    onChange={() => {}}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="id_conName">
                                                Contact Name
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  tabIndex="2223"
                                                  id="id_conName"
                                                  className="form-control"
                                                  value={supplierContact}
                                                  onChange={() => {}}
                                                  // disabled
                                                />
                                                <span className="input_field_icons">
                                                  <i
                                                    onClick={() =>
                                                      this.openModal(
                                                        "openContactModal"
                                                      )
                                                    }
                                                    className="fa fa-search"
                                                  ></i>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="form-group custon_select">
                                              <label htmlFor="id_emal">
                                                Email
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="email"
                                                  className="form-control"
                                                  id="id_emal"
                                                  tabIndex="2224"
                                                  value={supplierEmail}
                                                  onChange={() => {}}
                                                  // disabled
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-6">
                                            <div className="form-group custon_select">
                                              <label htmlFor="id_phn">
                                                Phone
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  id="id_phn"
                                                  tabIndex="2225"
                                                  value={supplierPhone}
                                                  onChange={() => {}}
                                                  // disabled
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {!quote_hide ? (
                                            <div className="col-12">
                                              <div className="form-group custon_select">
                                                <label htmlFor="id_iq">
                                                  Import Quote
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_iq"
                                                    tabIndex="-1"
                                                    name="quote"
                                                    value={this.state.quote}
                                                    onChange={this.handleQuote}
                                                    onBlur={this.importQuote}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Supplier Modal Adding End  */}
                                {/* Delivery Modal Adding Start */}
                                {!deliv_hide ? (
                                  <div className="col-lg-12 mt-4">
                                    <div className="cross__icons">
                                      <img
                                        src="images/gray-close.png"
                                        onClick={() =>
                                          this.handleHideCheck(
                                            "deliv_hide",
                                            deliv_hide
                                          )
                                        }
                                        className="gray_close xs-position"
                                        alt="close"
                                      />
                                    </div>
                                    <div className="forgot_form_main report_main sup-inner-pad sup_pb1">
                                      <div className="forgot_header">
                                        <div className="modal-top-header">
                                          <div className="row bord-btm">
                                            <div className="col-auto pl-0">
                                              <h6 className="text-left def-blue">
                                                Delivery
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="forgot_body">
                                          <div className="row mt-4">
                                            <div className="col-12">
                                              <div className="form-group custon_select ">
                                                <label htmlFor="id_i">
                                                  Delivery Instructions/Special
                                                  Conditions
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_i"
                                                    tabIndex="2226"
                                                    name="specialConditions"
                                                    value={
                                                      this.state
                                                        .specialConditions
                                                    }
                                                    onChange={
                                                      this.handleChangeField
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* Delivery Modal Adding end   */}
                              </div>
                              <div className="col-lg-6">
                                {/* Company Modal Adding Start */}
                                {!comp_hide ? (
                                  <div className="col-lg-12 ">
                                    <div className="cross__icons">
                                      <img
                                        src="images/gray-close.png"
                                        onClick={() =>
                                          this.handleHideCheck(
                                            "comp_hide",
                                            comp_hide
                                          )
                                        }
                                        className="gray_close xs-position"
                                        alt="close"
                                      />
                                    </div>
                                    <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn">
                                      <div className="forgot_header">
                                        <div className="modal-top-header">
                                          <div className="row bord-btm">
                                            <div className="col-auto pl-0">
                                              <h6 className="text-left def-blue">
                                                Company
                                              </h6>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="forgot_body">
                                          <div className="row mt-4">
                                            <div className="col-12">
                                              {/* <p className="model-p move-modal-t">
                                          This order will be copied to your drafts folder to modify and send for approval.
                                          </p> */}
                                              {/* dropdown coding start */}
                                              <div className="form-group custon_select custom_selct2">
                                                <label>
                                                  Production Company
                                                </label>
                                                <Select
                                                  className="width-selector"
                                                  // classNamePrefix="custon_select-selector-inner"
                                                  styles={_customStyles}
                                                  classNamePrefix="react-select"
                                                  value={
                                                    this.state.companyValue
                                                  }
                                                  options={this.state.companies}
                                                  onChange={
                                                    this.handleChangeCompanies
                                                  }
                                                  id="id_pCompany"
                                                  tabIndex="2235"
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
                                              </div>
                                              {/* end  */}
                                            </div>
                                            <div className="col-12">
                                              <div className="form-group custon_select disabled_fields pl-0">
                                                <label htmlFor="id_adr">
                                                  Address
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_adr"
                                                    // tabIndex="2231"
                                                    disabled
                                                    value={
                                                      this.state.companyAddress
                                                    }
                                                    onChange={() => {}}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group custon_select disabled_fields pl-0">
                                                <label htmlFor="id_txId">
                                                  Tax ID
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_txId"
                                                    tabIndex="2232"
                                                    disabled
                                                    value={this.state.taxID}
                                                    onChange={() => {}}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group custon_select disabled_fields">
                                                <label htmlFor="id_phn">
                                                  Phone
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_phn"
                                                    tabIndex="2233"
                                                    disabled
                                                    value={this.state.phone}
                                                    onChange={() => {}}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* Company Modal Adding end */}
                                {/* PO Refrence Modal Adding Start */}
                                {!poRef_hide ? (
                                  <div className="col-lg-12 mt-md-4">
                                    <div className="cross__icons">
                                      <img
                                        src="images/gray-close.png"
                                        onClick={() =>
                                          this.handleHideCheck(
                                            "poRef_hide",
                                            poRef_hide
                                          )
                                        }
                                        className="gray_close xs-position"
                                        alt="close"
                                      />
                                    </div>
                                    <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn ">
                                      <div className="forgot_header">
                                        <div className="modal-top-header">
                                          <div className="row bord-btm">
                                            <div className="col-auto pl-0">
                                              <h6 className="text-left def-blue">
                                                PO Reference
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="forgot_body">
                                          <div className="row mt-4">
                                            <div className="col-md-12 mb-md-4">
                                              <div className="form-group custon_select">
                                                <label htmlFor="name">
                                                  {" "}
                                                  PO Number
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className={
                                                      lockPONumber &&
                                                      lockPONumber.trim() ===
                                                        "Y"
                                                        ? "disable_bg disable_border"
                                                        : ""
                                                    }
                                                    pattern="[0-9]*"
                                                    id="name"
                                                    tabIndex="2227"
                                                    name="poNumber"
                                                    value={this.state.poNumber}
                                                    onChange={
                                                      this.handleChangeField
                                                    }
                                                    disabled={
                                                      lockPONumber &&
                                                      lockPONumber.trim() ===
                                                        "Y"
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* PO Refrence Modal Adding end   */}
                                {/* Order Request Modal Adding Start */}
                                {!ordReq_hide ? (
                                  <div className="col-lg-12 mt-md-4 mb-md-4">
                                    <div className="cross__icons">
                                      <img
                                        src="images/gray-close.png"
                                        onClick={() =>
                                          this.handleHideCheck(
                                            "ordReq_hide",
                                            ordReq_hide
                                          )
                                        }
                                        className="gray_close xs-position"
                                        alt="close"
                                      />
                                    </div>
                                    <div className="forgot_form_main report_main sup-inner-pad">
                                      <div className="forgot_header">
                                        <div className="modal-top-header">
                                          <div className="row bord-btm">
                                            <div className="col-auto pl-0">
                                              <h6 className="text-left def-blue">
                                                Order Request
                                              </h6>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="forgot_body">
                                          <div className="row mt-4">
                                            <div className="col-md-6">
                                              <div className="form-group custon_select">
                                                <label htmlFor="id_rb">
                                                  Requested By
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_rb"
                                                    tabIndex="2228"
                                                    name="requestedBy"
                                                    value={
                                                      this.state.requestedBy
                                                    }
                                                    onChange={
                                                      this.handleChangeField
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group custon_select">
                                                <label htmlFor="id_rd">
                                                  Department
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_rd"
                                                    tabIndex="2229"
                                                    name="requestedDepartment"
                                                    value={
                                                      this.state
                                                        .requestedDepartment
                                                    }
                                                    onChange={
                                                      this.handleChangeField
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {/* Order Request Modal Adding end   */}
                              </div>
                            </div>
                          </div>
                          {/* Order Details Portion Start */}
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
                                        data-target="#Order_Details"
                                      />{" "}
                                    </span>
                                    Order Details
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Order_Details">
                            <div className="forgot_body">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="col-lg-12 mt-4">
                                    <div className="forgot_form_main report_main sup-inner-pad order_decr_div">
                                      <div className="forgot_header">
                                        <div className="forgot_body">
                                          <div className="row mt-4">
                                            <div className="col-12">
                                              <div className="form-group custon_select ">
                                                <label htmlFor="usr">
                                                  Order Description
                                                </label>
                                                <div className="modal_input">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="usr"
                                                    tabIndex="2230"
                                                    name="orderDescription"
                                                    value={
                                                      this.state
                                                        .orderDescription
                                                    }
                                                    onChange={
                                                      this.handleChangeField
                                                    }
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="col-auto d-flex justify-content-end s-c-main icon_pad_top">
                                    <button
                                      className="new_poedit_add_btn"
                                      type="button"
                                      tabIndex="2231"
                                      id="id_save111"
                                      onClick={() => this.insertPoLines()}
                                    >
                                      <img
                                        onClick={() => this.insertPoLines()}
                                        src="images/plus-round.png"
                                        className="btn img-fluid float-right pr-0"
                                        alt="user"
                                      />
                                    </button>

                                    <Dropdown
                                      alignRight="false"
                                      drop="down"
                                      className="analysis-card-dropdwn float-right bg-tp"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                        tabIndex="-1"
                                      >
                                        <img
                                          src="images/order-option.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={
                                            this.handleMultipleChangesModal
                                          }
                                        >
                                          Multiple Changes
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() =>
                                            this.openModal(
                                              "openImportLinesModal"
                                            )
                                          }
                                        >
                                          Import
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={this.exportPOLines}
                                        >
                                          Export
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                              </div>

                              {/* table start  */}
                              <div className="row mt-3">
                                <div className="col-12">
                                  <div className="login_form">
                                    <div className="login_table_list table-reponsive for-dropdown-ui">
                                      <table className="table project_table shadow-none newpo--edit new-po-edit-popup-table">
                                        <thead>
                                          <tr>
                                            <th scope="col">
                                              <div className="col align-self-center text-center pr-0">
                                                <div className="form-group remember_check pt-0">
                                                  <input
                                                    type="checkbox"
                                                    id="editOrder1"
                                                    onChange={(e) =>
                                                      this.handleCheckboxesInOrderDetails(
                                                        e,
                                                        "all"
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    htmlFor="editOrder1"
                                                    className="mr-0"
                                                  ></label>
                                                </div>
                                              </div>
                                            </th>
                                            <th
                                              scope="col"
                                              className="text-left newpoedit-desth"
                                            >
                                              Description
                                            </th>
                                            <th
                                              className="text-left pl-0 pr-3"
                                              scope="col"
                                            >
                                              Chart Sort
                                            </th>
                                            <th
                                              className="text-left"
                                              scope="col"
                                            >
                                              Chart Code
                                            </th>
                                            {this.state.defaultUserFlags
                                              .length > 0 ? (
                                              this.state.defaultUserFlags.map(
                                                (u, i) => {
                                                  return (
                                                    <th
                                                      key={i}
                                                      scope="col"
                                                      className={
                                                        "text-left pad-left"
                                                      }
                                                    >
                                                      {u.prompt}
                                                    </th>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                                <th scope="col"></th>
                                              </>
                                            )}

                                            <th
                                              className="text-right pl-0 new-pad-right"
                                              scope="col"
                                            >
                                              Amount
                                            </th>
                                            <th scope="col"></th>
                                            <th scope="col"></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                        {   console.log(" this.state.defaultUserFlags  ddddddddddd",  this.state.poLines)}

                                          {this.state.poLines.map((d, i) => {
                                            return (
                                              <tr key={i}>
                                                <td>
                                                  <div className="col align-self-center text-center pr-0">
                                                    <div className="form-group remember_check pt-0">
                                                      <input
                                                        type="checkbox"
                                                        id={
                                                          "editOrderListing" + i
                                                        }
                                                        onChange={(e) =>
                                                          this.handleCheckboxesInOrderDetails(
                                                            e,
                                                            d
                                                          )
                                                        }
                                                        checked={d.checked}
                                                      />
                                                      <label
                                                        htmlFor={
                                                          "editOrderListing" + i
                                                        }
                                                        className="mr-0"
                                                      ></label>
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-left newpoedit-desth desc_amount_td pl-0 uppercaseText ">
                                                  {d.type === "Service" ||
                                                  d.type === "Distribution" ? (
                                                    <div className="modal_input">
                                                      <input
                                                        type="text"
                                                        className="form-control uppercaseText"
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={"description"}
                                                        defaultValue={
                                                          d.description
                                                        }
                                                        onBlur={(e) =>
                                                          this.handleChangeInLineFields(
                                                            e,
                                                            d
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  ) : (
                                                    <>
                                                      {d.type === "Car" ||
                                                      d.type === "Inventory" ||
                                                      d.type ===
                                                        "Rental/Hire" ||
                                                      d.type === "Hire/Rental"
                                                        ? d.typeDescription ||
                                                          ""
                                                        : d.description ||
                                                          ""}{" "}
                                                    </>
                                                  )}
                                                </td>

                                                <td className="text-left pl-0 new-po-edittd3">
                                                  <div
                                                    className={`modal_input input-valid-error ${
                                                      d.sortErrorMsg
                                                        ? "input-valid-line"
                                                        : ""
                                                    } `}
                                                  >
                                                    <input
                                                      type="text"
                                                      className={
                                                        d.chartSort.length <= 5
                                                          ? "form-control wd-50 uppercaseText"
                                                          : "form-control wd-75 uppercaseText"
                                                      }
                                                      id="usr"
                                                      autoComplete="off"
                                                      name={"chartSort"}
                                                      value={d.chartSort}
                                                      onBlur={(e) =>
                                                        this.handleInLine(
                                                          e,
                                                          d,
                                                          i
                                                        )
                                                      }
                                                      onChange={(e) =>
                                                        this.handleChangeInLineFields(
                                                          e,
                                                          d
                                                        )
                                                      }
                                                    />
                                                    <div className="text-danger error-12">
                                                      {d.sortErrorMsg
                                                        ? d.sortErrorMsg
                                                        : ""}
                                                    </div>
                                                  </div>
                                                </td>

                                                <td className="text-left dropdown-position">
                                                  <div
                                                    className={`modal_input width-90 input-valid-error ${
                                                      d.errorMessageCode
                                                        ? "input-valid-line"
                                                        : ""
                                                    } `}
                                                  >
                                                    <input
                                                      type="text"
                                                      className={
                                                        d.chartCode.length <= 4
                                                          ? "form-control focus_chartCode wd-45 uppercaseText"
                                                          : d.chartCode
                                                              .length <= 8
                                                          ? "form-control focus_chartCode wd-72 uppercaseText"
                                                          : "form-control focus_chartCode wd-101 uppercaseText"
                                                      }
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
                                                      onBlur={(e) =>
                                                        this.handleInLine(
                                                          e,
                                                          d,
                                                          i
                                                        )
                                                      }
                                                    />
                                                    <div className="text-danger error-12">
                                                      {d.errorMessageCode
                                                        ? d.errorMessageCode
                                                        : ""}
                                                    </div>
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
                                                          (c, ind) => {
                                                            return (
                                                              <li
                                                                className="cursorPointer"
                                                                key={ind}
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
                                                {   console.log(" this.state.defaultUserFlags   uuuuuuuuuuu",  this.state.defaultUserFlags)}
                                                {this.state.defaultUserFlags
                                                  .length > 0 ? (
                                                  this.state.defaultUserFlags.map(
                                                 
                                                    (u, i) => {

                                                      return (
                                                        <td
                                                          className={
                                                            "text-left pad-left"
                                                          }
                                                          key={i}
                                                        >
                                                          {/* {" "}
                                                          {d.flags.find(
                                                            (f) =>
                                                              f.type.toLowerCase() ===
                                                              u.type.toLowerCase()
                                                          ).value || ""}{" "} */}

                                                          <div
                                                            className={`modal_input input-valid-error ${
                                                              d.flags[i]
                                                                .errorMessageIn ||
                                                              d.flags[i]
                                                                .errorMessageF ||
                                                              d.flags[i]
                                                                .errorMessageTax
                                                                ? "input-valid-line"
                                                                : ""
                                                            } `}
                                                          >
                                                            <input
                                                              type="text"
                                                              className={`form-control uppercaseText flags-w${u.length}`}
                                                              id="usr"
                                                              autoComplete="off"
                                                              name={u.type}
                                                              maxLength={
                                                                u.length
                                                              }
                                                              value={
                                                                (d.flags.find(
                                                                  (f) =>
                                                                    f.type.toLowerCase() === u.type.toLowerCase() &&  f.sequence === u.sequence
                                                                ) &&
                                                                  d.flags.find(
                                                                    (f) =>
                                                                      f.type.toLowerCase() === u.type.toLowerCase()  &&  f.sequence === u.sequence
                                                                  ).value) ||
                                                                ""
                                                              }
                                                              onChange={(e) =>
                                                                this.handleChangeFlags(
                                                                  e,
                                                                  d,
                                                                  u.sequence
                                                                )
                                                              }
                                                              onBlur={(e) =>
                                                                this.handleInLine(
                                                                  e,
                                                                  d,
                                                                  i,
                                                                  u.sequence
                                                                )
                                                              }
                                                            />
                                                            <div className="text-danger error-12">
                                                              {d.flags[i]
                                                                .errorMessageIn
                                                                ? d.flags[i]
                                                                    .errorMessageIn
                                                                : d.flags[i]
                                                                    .errorMessageF
                                                                ? d.flags[i]
                                                                    .errorMessageF
                                                                : d.flags[i]
                                                                    .errorMessageTax
                                                                ? d.flags[i]
                                                                    .errorMessageTax
                                                                : d.flags[i]
                                                                .errorMessageSet 
                                                                ? d.flags[i]
                                                                .errorMessageSet
                                                                : 
                                                                d.flags[i]
                                                                .errorMessageRebate 
                                                                ? d.flags[i]
                                                                .errorMessageRebate
                                                               :
                                                               d.flags[i]
                                                               .errorMessageTest 
                                                               ? d.flags[i]
                                                               .errorMessageTest
                                                              : ""}
                                                                
                                                            </div>
                                                          </div>
                                                        </td>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                  </>
                                                )}

                                                <td className="text-right desc_amount_td uppercaseText pl-0">
                                                  {d.type === "Service" ||
                                                  d.type === "Distribution" ? (
                                                    <div className="modal_input newpoedit-amount_input">
                                                      <input
                                                        type="number"
                                                        className="form-control uppercaseText text-right float-right pr-0"
                                                        id="usr"
                                                        autoComplete="off"
                                                        name={"amount"}
                                                        value={d.amount}
                                                        onChange={(e) =>
                                                          this.handleChangeInLineFields(
                                                            e,
                                                            d,
                                                            i
                                                          )
                                                        }
                                                        onBlur={(e) =>
                                                          this.convertTwoDecimal(
                                                            e,
                                                            d
                                                          )
                                                        }
                                                        onKeyDown={(e) =>
                                                          e.key === "Enter"
                                                            ? this.convertTwoDecimal(
                                                                e,
                                                                d
                                                              )
                                                            : " "
                                                        }
                                                      />
                                                    </div>
                                                  ) : (
                                                    <span className="new-pad-right3">
                                                      {Number(d.amount).toFixed(
                                                        2
                                                      ) || 0.0}
                                                    </span>
                                                  )}
                                                </td>

                                                <td>
                                                  <img
                                                    onClick={() =>
                                                      this.editPOLine(d)
                                                    }
                                                    src="images/pencill.png"
                                                    className="import_icon cursorPointer"
                                                    alt="pencill"
                                                  />
                                                </td>
                                                <td>
                                                  <img
                                                    onClick={() =>
                                                      this.deletePOLineItem(d)
                                                    }
                                                    src="images/delete.svg"
                                                    className="invoice-delete-icon cursorPointer"
                                                    alt="delete"
                                                  />
                                                </td>
                                              </tr>
                                            );
                                          })}
                                          <tr>
                                            <td scope="row"></td>
                                            <td className="text-left"></td>
                                            <td></td>
                                            <td></td>

                                            {this.state.defaultUserFlags &&
                                            this.state.defaultUserFlags.length >
                                              0 ? (
                                              this.state.defaultUserFlags.map(
                                                (p, i) => {
                                                  if (i != 1) {
                                                    return <td></td>;
                                                  }
                                                }
                                              )
                                            ) : (
                                              <>
                                                <td></td>
                                                <td></td>
                                              </>
                                            )}
                                            <td className="tbl_total_amount">
                                              Subtotal:
                                            </td>
                                            <td className="tbl_total_amount text-right pr-subtotal">
                                              {" "}
                                              {Number(
                                                this.state.subTotal
                                              ).toFixed(2)}
                                            </td>
                                            <td></td>
                                            <td></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* table end */}
                            </div>
                          </div>
                          {/* Order Details Portion End */}
                          {/* Approval Portions Start */}
                          {!approval_hide ? (
                            <>
                              <div className="forgot_header mt-4">
                                <div className="cross__icons">
                                  <img
                                    src="images/gray-close.png"
                                    onClick={() =>
                                      this.handleHideCheck(
                                        "approval_hide",
                                        approval_hide
                                      )
                                    }
                                    className="gray_close xs-position"
                                    alt="close"
                                  />
                                </div>
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
                                            data-target="#Approvals"
                                          />{" "}
                                        </span>
                                        Approval Group
                                      </h6>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="collapse show" id="Approvals">
                                <div className="row mt-4">
                                  <div className="col-md-6">
                                    {/* dropdown coding start */}
                                    <div className="form-group custon_select">
                                      <Select
                                        className="width-selector"
                                        // classNamePrefix="track_menu custon_select-selector-inner"
                                        styles={_customStyles}
                                        classNamePrefix="react-select"
                                        value={this.state.approvalGroupValue}
                                        options={this.state.approvals}
                                        onChange={
                                          this.handleChangeApprovalsGroups
                                        }
                                        tabIndex="2232"
                                        id="id_appGroup"
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
                                      <span
                                        className="input_field_icons rit-icon-input"
                                        data-toggle="collapse"
                                        data-target="#asd"
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {/* Approval Portions End */}
                          {/* Total Amount portion Start */}
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
                                        data-target="#Total_Amount"
                                      />{" "}
                                    </span>
                                    Total Amount
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Total_Amount">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                <div className="col-md-6 mb-md-4">
                                  <div className="form-group custon_select">
                                    <label>Sub Total</label>
                                    <div className="modal_input ">
                                      <input
                                        type="text"
                                        className="disable_bg disable_border"
                                        id="name"
                                        name={"subTotal"}
                                        value={this.state.subTotal}
                                        onChange={() => {}}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="col-md-6 mb-md-4">
                              <div className="form-group custon_select">
                                <div className="modal_input">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Freight"
                                  />
                                </div>
                              </div>
                            </div> */}
                                <div className="col-md-6 mb-md-4">
                                  <div className="form-group custon_select">
                                    <label>Tax Total</label>
                                    <div className="modal_input">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="name"
                                        autoComplete={false}
                                        name={"taxTotal"}
                                        value={this.state.taxTotal}
                                        onChange={this.handleChangeField}
                                        // disabled
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 mb-md-4">
                                  <div className="form-group custon_select">
                                    <label>PO Total/Gross Total</label>
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="disable_bg disable_border"
                                        id="name"
                                        name={"grossTotal"}
                                        value={this.state.grossTotal}
                                        onChange={() => {}}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Total Amount portion End */}
                          {/* Attachments portion Start */}
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
                                        data-target="#Attachmentss"
                                      />{" "}
                                    </span>
                                    Attachments
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="collapse show" id="Attachmentss">
                            <div className="forgot_body">
                              <div className="row mt-4">
                                {this.state.poAttachments &&
                                  this.state.poAttachments.length > 0 &&
                                  this.state.poAttachments.map((a, i) => {
                                    return (
                                      <div key={i} className="col-md-4 mb-md-4">
                                        <span className="del_notes">
                                          <i
                                            onClick={() =>
                                              this.deletePOAttachment(
                                                a.recordID
                                              )
                                            }
                                            className="fa fa-times cursorPointer"
                                          ></i>

                                          <span
                                            className="cursorPointer"
                                            onClick={() =>
                                              this.getAttachment(
                                                a.recordID,
                                                a.fileName
                                              )
                                            }
                                          >
                                            {a.fileName || ""}
                                          </span>
                                        </span>
                                      </div>
                                    );
                                  })}
                                <div className="col-12 mt-2">
                                  <div className="form-group custon_select border text-center mb-0 border-rad-5">
                                    <div id="drop-area">
                                      <input
                                        type="file"
                                        id="fileElem"
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
                                        multiple
                                      />
                                      <label
                                        className="upload-label"
                                        htmlFor="fileElem"
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
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Attachments Portion End */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
          {/* end */}
        </div>
        <SupplierLookup
          openSupplierLookupModal={this.state.openSupplierLookupModal}
          closeModal={this.closeModal}
          getSuppliersList={this.getSuppliersList}
          suppliersList={this.state.suppliersList || []}
          supplierCode={this.state.supplierCode || ""}
          updatePOSupplier={this.updatePOSupplier}
          stateData={this.state}
          props={this.props}
          page="newPOedit"
        />
        <Contact
          openContactModal={this.state.openContactModal}
          closeModal={this.closeModal}
          openModal={this.openModal}
          contacts={this.state.contacts}
          updatePOSupplierContacts={this.updatePOSupplierContacts}
          updateSupplierContactsList={this.updateSupplierContactsList} //update contacts list when Add || Edit Or Removing the contact
          supplierCode={this.state.supplierCode}
          currency={this.state.currency}
        />
        <DeleteOrderDetails
          openDeleteOrderDetailModal={this.state.openDeleteOrderDetailModal}
          closeModal={this.closeModal}
          deletePOLineId={this.state.deletePOLineId}
          deletePOLine={this.deletePOLine}
        />
        <LineItem
          openLineItemModal={this.state.openLineItemModal}
          closeModal={this.closeModal}
          modal="New-PO-Edit" //to specify which page opens Line Item Modal to change Fields accordingly
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          currency={this.state.currency || ""}
          flags_api={this.state.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          updateFlags={this.updateFlags} //get updated flags from line item modal
          suppliersFlags={this.state.suppliersFlags}
          poLineEditData={this.state.poLineEditData} //poLine for Editing
          getNewORUpdatedPOLine={this.getNewORUpdatedPOLine} //add/edit po line
          accountDetails={
            this.props.user.getAccountDetails.accountDetails || ""
          }
          props={this.props}
          page="poEditPage"
          basisOptions={this.state.basisOptions || []}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
          chartCodesList={this.state.chartCodesList || []}
          customFields={this.state.customFields || []}
        />
        <ImportModal
          openImportLinesModal={this.state.openImportLinesModal}
          closeModal={this.closeModal}
          importLines={this.importPOLines}
        />
        <ExportSuccessModal
          openExportSuccessModal={this.state.openExportSuccessModal}
          closeModal={this.closeModal}
        />
        <MultipleChanges
          openMultipleChangesModal={this.state.openMultipleChangesModal}
          closeModal={this.closeModal}
          flags_api={this.state.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          handleMultipleChanges={this.handleMultipleChanges}
          lines={this.state.poLines}
          props={this.props}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  chart: state.chart,
  poData: state.poData,
  supplier: state.supplier,
});

export default connect(mapStateToProps, {
  getChartSorts: ChartActions.getChartSorts,
  getChartCodes: ChartActions.getChartCodes,
  getFlags: ChartActions.getFlags,
  getCurrencies: ChartActions.getCurrencies,
  clearChartStates: ChartActions.clearChartStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
  getDefaultValues: UserActions.getDefaultValues,
  getSupplier: SupplierActions.getSupplier,
  getSuppliersList: SupplierActions.getSuppliersList,
  getSupplierContacts: SupplierActions.getSupplierContacts,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  getPO: POActions.getPO,
  insertPO: POActions.insertPO,
  updatePO: POActions.updatePO,
  getQuote: POActions.getQuote,
  addPoAttachments: POActions.addPoAttachments,
  addPoAttachmentLists: POActions.addPoAttachmentLists,
  deletePOAttachment: POActions.deletePOAttachment,
  getPOAttachment: POActions.getPOAttachment,
  importPOLines: POActions.importPOLines,
  exportPOLines: POActions.exportPOLines,
  clearPOStates: POActions.clearPOStates,
  clearUserStates: UserActions.clearUserStates,
})(NewPoEdit);
