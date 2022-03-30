import React, { Component } from "react";
import Select from "react-select";
import $ from "jquery";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Document, Page } from "react-pdf";
import _ from "lodash";
import store from "../../Store/index";
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import DatePicker from "react-datepicker";
import SupplierSelectModal from "../Modals/SupplierSelect/SupplierSelect";
import LineItem from "../Modals/LineItem/LineItem";
import SupplierLookup from "../Modals/SupplierLookup/SupplierLookup";
import DeleteOrderDetails from "../Modals/DeleteOrderDetail/DeleteOrderDetail";
import POTransfer from "../Modals/POTransfer/POTransfer";
import MultipleChanges from "../Modals/MultipleChanges/MultipleChanges";
import { userAvatar, _customStyles, options } from "../../Constants/Constants";
import * as InvoiceActions from "../../Actions/InvoiceActions/InvoiceActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as POActions from "../../Actions/POActions/POActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import {
  handleAPIErr,
  pdfViewerZoomIn,
  pdfViewerZoomOut,
  pdfViewerSelect,
  downloadAttachments,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";

const uuidv1 = require("uuid/v1");

class AddNewInvoice extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      showDetail: false, //to show invoice detail after invoice file is upladed successfully to Sypht
      OCRToken: "",
      syphtResults: "",

      suppliersList: [], //contains all suppliers by calling Get Supplier Api
      clonedSuppliersList: [], //contains all suppliers by calling Get Supplier List Api
      supplierName: "",
      supplierCode: "",
      tran: "", //transition# of the invoice
      invoiceNumber: "",
      poNumber: "",
      invoiceDate: "",
      dueDate: "",
      invoiceTotal: "",
      taxTotal: "",
      currency: "",

      amount: "",
      receiveDate: "",
      reference: "", //payment ref
      payDate: "", //payment date
      description: "",
      approvalGroup: "",
      approvalOptions: [],
      invoiceLines: [],
      subTotal: 0.0,
      invoiceLineEditData: "", //contains invoice Line data for editing
      deleteInvoiceLineId: "", //contains invoice Line id for deleting

      invoiceAttachments: [], //to show which attachments are uploaded
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB

      getDefaultValueFlags: [], //get default value flags API response
      getChartCodes: "", //get chart sorts API response
      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes lsit
      getFlags: "", //API response
      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags
      getChartLayout: "",
      defaultUserFlags: [], //default user flags
      suppliersFlags: [],
      openSupplierSelectModal: false,
      openLineItemModal: false,
      openSupplierLookupModal: false,
      openDeleteOrderDetailModal: false,
      openPOTransferModal: false,
      openMultipleChangesModal: false,
      // po transfer
      POsToTransfer: [], //po to transfer to invoice
      transferList: [],
      clonedTransferList: [],
      poTransferSearch: "",
      includeZeroLinesCheck: false,
      includeAllSuppliersCheck: false,

      // end

      // receivedDateCheck: true,
      descriptionCheck: true,
      paymentReferenceCheck: true,
      paymentDateCheck: true,

      bankCode: { label: "Select Bank", value: "" },
      bankOptions: [{ label: "Select Bank", value: "" }],

      scaling: 1.1,
      dropdownZoomingValue: { label: "15%", value: "15%" },
      rotate: 0,

      action: [
        { label: "Clear", value: "Clear" },
        { label: "Subtract", value: "Subtract" },
        { label: "Ignore", value: "Ignore" },
      ],
      basisOptions: [],
      pdf: "",
      numPages: null,
      pageNumber: 1,
      formErrors: {
        supplierCode: "",
        invoiceNumber: "",
        invoiceDate: "",
        bankCode: "",
      },
      editName: false, //check when supplier name is going to edit
      scndLstTbIndx: 8346,
      lstTbIndx: 8347,
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
    addDragAndDropFileListners("drop-area", this.fileUpload);
    addDragAndDropFileListners("drop-area-attach", this.uploadAttachment);
    //end

    // hide prefrences
    let displayAddInvoiceSettings = localStorage.getItem(
      "displayAddInvoiceSettings"
    );
    let parseSetting = JSON.parse(displayAddInvoiceSettings);
    if (displayAddInvoiceSettings) {
      this.setState({ ...parseSetting });
    }
    // end
    let state =
      this.props.history.location && this.props.history.location.state;
    if (state && state.stateData) {
      //to set state after comming from the new supplier page(it is because we don't have to call all APIs again)
      this.setState({ ...state.stateData, isLoading: false }, () => {
        let { invoiceLines } = this.state;
        let subTotal = 0.0;

        invoiceLines.map((l, i) => {
          //to assign every line a unique id
          l.id = uuidv1();
          l.checked = false;
          // l.tabIndex = 4457 + i * 2;
          subTotal = Number(subTotal) + Number(l.amount);

          if (!l.poNumber.trim()) {
            l.actionDisabled = true;
          } else {
            l.actionDisabled = false;
          }
          return l;
        });
        this.setState(
          {
            invoiceLines,
            isLoading: false,
            openSupplierLookupModal: false,
            openSupplierSelectModal: false,
            subTotal,
            formErrors: {
              supplierCode: "",
            },
            editName: false,
          },
          () => this.getSupplier()
        );
      });
    } else {
      //only in draft type user can add new invoice
      let type =
        (this.props.history.location.state &&
          this.props.history.location.state.type) ||
        "";
      if (type && type === "draft") {
        this.setState({ isLoading: true, attachmentSize: 0 });

        let promises = [];

        promises.push(this.draftInvoice());

        let isDefaultValues = false;

        let defVals =
          (this.props.user.getDefaultValues &&
            this.props.user.getDefaultValues.flags) ||
          [];

        if (defVals.length === 0) {
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
        } else {
          isDefaultValues = true;
        }

        let isFlgs = false;

        let flgs = this.props.chart.getFlags || "";

        if (!flgs) {
          promises.push(this.props.getFlags());
        } else {
          isFlgs = true;
        }
        promises.push(this.props.getOCRToken()); // get OCR Token

        promises.push(this.getChartCodes("", "all"));

        promises.push(this.getSuppliersList());

        await Promise.all(promises);
        let {
          flags,
          clonedFlags,
          getFlags,
          getDefaultValueFlags,
          defaultUserFlags,
          OCRToken,
        } = this.state;

        //success case of get default vaues
        if (this.props.user.getDefaultValuesSuccess || isDefaultValues) {
          // toast.success(this.props.user.getDefaultValuesSuccess);
          getDefaultValueFlags =
            (this.props.user.getDefaultValues &&
              this.props.user.getDefaultValues.flags) ||
            [];

          defaultUserFlags =
            (this.props.user.getDefaultValues &&
              this.props.user.getDefaultValues.flags) ||
            [];
          let _flags = [];
          defaultUserFlags.map((f, i) => {
            let obj = {
              value: f.defaultValue || "",
              length: f.length,
              prompt: f.prompt,
              sequence: f.sequence,
              type: f.type,
            };
            _flags.push(obj);
          });
          defaultUserFlags = _flags;
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
        if (getDefaultValueFlags.length > 0) {
          flags = [];
          clonedFlags = [];
          getDefaultValueFlags.map((defVal, i) => {
            flags.push(
              {
                type: defVal.type,
                label: defVal.type,
                value: "",
                id: i,
                sequence: defVal.sequence,
              },
              {
                type: defVal.type,
                label: "",
                value: "",
                id: i,
                sequence: defVal.sequence,
              }
            );
            clonedFlags.push({
              type: defVal.type,
              value: "",
              prompt: defVal.prompt,
              sequence: defVal.sequence,
            });
          });
        }
        //success case of get OCR Token
        if (this.props.invoiceData.getOCRTokenSuccess) {
          // toast.success(this.props.invoiceData.getOCRTokenSuccess);
          OCRToken = this.props.invoiceData.getOCRToken;
        }
        //error case case of get OCR Token
        if (this.props.invoiceData.getOCRTokenError) {
          handleAPIErr(this.props.invoiceData.getOCRTokenError, this.props);
        }
        this.setState({
          isLoading: false,
          OCRToken,
          flags,
          clonedFlags,
          getFlags,
          defaultUserFlags,
          getDefaultValueFlags,
        });
      } else {
        this.props.history.push("/invoice");
      }

      this.props.clearPOStates();
      this.props.clearChartStates();
      this.props.clearUserStates();
      this.props.clearInvoiceStates();
      this.props.clearSupplierStates();
    }

    // //setting the invoice zoom
    // let newInvoiceZoom = localStorage.getItem("newInvoiceZoom");
    // if (newInvoiceZoom) {
    //   this.handleDropdownZooming({ value: newInvoiceZoom });
    // }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area", this.fileUpload);
    removeDragAndDropFileListners("drop-area-attach", this.uploadAttachment);
  }

  draftInvoice = async () => {
    await this.props.draftInvoice(); // draftInvoice create Invoice to get 'tran'
    //success case of draft invoice
    if (this.props.invoiceData.draftInvoiceSuccess) {
      toast.success(this.props.invoiceData.draftInvoiceSuccess);

      let invoiceDetails =
        (this.props.invoiceData &&
          JSON.parse(JSON.stringify(this.props.invoiceData.draftInvoice))) ||
        "";

      //geting trans
      let tran = (invoiceDetails && invoiceDetails.tran) || "";

      //getting approvals groups

      let approvalOptions = [];

      let _approvalOptions =
        (invoiceDetails &&
          JSON.parse(JSON.stringify(invoiceDetails.approvalOptions))) ||
        [];

      if (_approvalOptions && _approvalOptions.length > 0) {
        _approvalOptions.map((a, i) => {
          approvalOptions.push({ label: a.groupName, value: a.groupName });
        });
      }

      let approvalGroup = invoiceDetails.approvalGroup || "";

      let dueDate = invoiceDetails.dueDate || "";
      let invoiceDate = invoiceDetails.invoiceDate || "";

      let basisOptions = (invoiceDetails && invoiceDetails.basisOptions) || [];

      let bankCode = (invoiceDetails && invoiceDetails.bankCode) || "";
      let bankOptions = (invoiceDetails && invoiceDetails.bankOptions) || [];

      let bnkOptns = [{ label: "Select Bank", value: "" }];
      bankOptions.map((b, i) => {
        bnkOptns.push({
          label: b.code + " " + b.description,
          value: b.code,
        });
      });

      this.setState({
        tran,
        dueDate,
        invoiceDate,
        basisOptions,
        approvalOptions,
        approvalGroup: (approvalOptions.length > 0 && approvalOptions[0]) || {
          label: approvalGroup,
          value: approvalGroup,
        },
        bankCode: { label: bankCode, value: bankCode },
        bankOptions: bnkOptns,
      });
    }
    //error case of draft invoice
    if (this.props.invoiceData.draftInvoiceError) {
      handleAPIErr(this.props.invoiceData.draftInvoiceError, this.props);
    }
  };

  getChartCodes = async (sort, check) => {
    //if check == all it means that store all type chartCodes for the first time(when call api in didmount )
    //it is because when line item modal open and we call getChartCodes according to selected Chart sort then state contains only that chart codes related to select chart sorts
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
    let value = e.target.value;
    let { invoiceLines } = this.state;

    // update in invoice lines
    let foundIndex = invoiceLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = value || "";
      invoiceLines[foundIndex] = line;
    }

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
    this.setState({ invoiceLines, clonedChartCodesList });
  };

  handleChangeField = (e, line, i) => {
    let { name, value } = e.target;
    let { invoiceLines } = this.state;

    line[name] = value || "";

    this.setState({ invoiceLines });
  };

  handleChangeFlags = (e, line) => {
    let { name, value } = e.target;

    let { invoiceLines } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value.toUpperCase();
      }
      return f;
    });

    // update in invoice lines
    let foundIndex = invoiceLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.flags = flags;
      invoiceLines[foundIndex] = line;
    }

    this.setState({ invoiceLines });
  };

  onblurCode = (i) => {
    setTimeout(() => {
      $(`.chart${i}`).hide();
    }, 700);
  };

  //when select code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line) => {
    let { invoiceLines } = this.state;

    // update in invoice lines
    let foundIndex = invoiceLines.findIndex((l) => l.id == line.id);
    if (foundIndex != -1) {
      line.chartCode = chartCode.code || "";
      invoiceLines[foundIndex] = line;
    }

    this.setState({ invoiceLines });
  };

  getChartSorts = async () => {
    if (!this.props.chart.getChartSorts) {
      this.setState({ isLoading: true });

      await this.props.getChartSorts();

      if (this.props.chart.getChartSortsSuccess) {
        // toast.success(this.props.chart.getChartSortsSuccess);
      }
      //error case of Get Chart Sorts
      if (this.props.chart.getChartSortsError) {
        handleAPIErr(this.props.chart.getChartSortsError, this.props);
      }
      this.props.clearChartStates();
      this.setState({ isLoading: false });
    }
  };

  //when click on tallien
  handleTallies = async (tallies) => {
    if (tallies.type.toLowerCase() != "draft") {
      this.props.history.push("/invoice", { talliesType: tallies.type });
    }
  };

  //handle actions
  handleChangeAction = async (data, line, check) => {
    let { invoiceLines, transferList } = this.state;
    if (check === "poTransferList") {
      //update in po transfer list

      let foundIndex = transferList.findIndex((l) => l.id == line.id);
      if (foundIndex != -1) {
        line.action = data.value;
        transferList[foundIndex] = line;
      }
      //end

      this.setState({ transferList });
    } else {
      // update in invoice lines
      let foundIndex = invoiceLines.findIndex((l) => l.id == line.id);
      if (foundIndex != -1) {
        line.action = data.value;
        invoiceLines[foundIndex] = line;
      }
    }

    //end

    this.setState({ invoiceLines });
  };

  //add/update invoice Lines
  getNewORUpdatedInvoiceLine = async (invoiceLine) => {
    if (invoiceLine.id) {
      //update case
      let { invoiceLines } = this.state;

      var foundIndex = invoiceLines.findIndex((p) => p.id == invoiceLine.id);

      if (foundIndex != -1) {
        invoiceLines[foundIndex] = invoiceLine;
        let subTotal = 0.0;
        invoiceLines.map((l, i) => {
          //to assign every line a unique id
          l.id = uuidv1();
          l.checked = false;
          // l.tabIndex = 4457 + i * 2;
          subTotal = Number(subTotal) + Number(l.amount);

          if (!l.poNumber.trim()) {
            l.actionDisabled = true;
          } else {
            l.actionDisabled = false;
          }
          return l;
        });

        this.setState({ invoiceLines, subTotal });
      }
    } else {
      //add case
      let { invoiceLines } = this.state;
      invoiceLine.id = uuidv1();
      invoiceLines.push(invoiceLine);
      let subTotal = 0;
      invoiceLines.map((l, i) => {
        //to assign every line a unique id
        l.id = uuidv1();
        l.checked = false;
        // l.tabIndex = 4457 + i * 2;
        subTotal = Number(subTotal) + Number(l.amount);

        if (!l.poNumber.trim()) {
          l.actionDisabled = true;
        } else {
          l.actionDisabled = false;
        }
        return l;
      });
      this.setState({ invoiceLines, subTotal });
    }
  };

  //edit invoice lines
  editInvoiceLine = (data) => {
    if (data.type && data.type.trim()) {
      this.setState({ invoiceLineEditData: data }, () => {
        this.openModal("openLineItemModal");
      });
    }
  };

  //delete invoice line
  deleteInvoiceLine = (line) => {
    this.setState({ deleteInvoiceLineId: line.id }, () =>
      this.openModal("openDeleteOrderDetailModal")
    );
  };

  deletingInvoiceLine = (id) => {
    let { invoiceLines } = this.state;
    if (id) {
      let filteredInvoiceLines = invoiceLines.filter((p) => p.id != id);

      let subTotal = 0;
      filteredInvoiceLines.map((line, i) => {
        subTotal += Number(line.amount);
        return line;
      });
      this.setState({
        invoiceLines: filteredInvoiceLines,
        subTotal: Number(subTotal).toFixed(2),
      });
    }
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    if (name === "openPOTransferModal") {
      this.setState({
        includeZeroLinesCheck: false,
        includeAllSuppliersCheck: false,
      });
    }
    this.setState({
      [name]: false,
      invoiceLineEditData: "",
      deleteInvoiceLineId: "",
    });

    this.setState({ [name]: false });
  };

  handleApprovalGroup = (approvalGroup) => {
    this.setState({ approvalGroup });
  };

  handleDateChange = (date, name) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(
      name,
      new Date(date).getTime(),
      formErrors
    );
    this.setState({
      [name]: new Date(date).getTime(),
      formErrors,
    });
  };

  handleFieldChange = (e) => {
    let { formErrors, amount, invoiceTotal } = this.state;
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    formErrors = Validation.handleValidation(fieldName, fieldValue, formErrors);

    if (fieldName === "invoiceTotal" || fieldName === "amount") {
      amount = fieldValue;
      invoiceTotal = fieldValue;
    }
    this.setState({
      [fieldName]: fieldValue,
      amount,
      invoiceTotal,
      formErrors,
    });
  };

  convertTwoDecimal = (e, line, check) => {
    let val = Number(e.target.value).toFixed(2) || 0.0;

    let { invoiceLines, taxTotal } = this.state;

    if (check === "line") {
      //update invoice lines case
      line["amount"] = val;
    } else {
      //update taxTotal case

      /* When you edit the amount in this tax field(taxTotal)
      can you update the invoice tax line (line 1) on the invoice to this amount? */

      let lineIndex = invoiceLines.findIndex((line) => line.lineNo === 1);
      if (lineIndex >= 0) {
        invoiceLines[lineIndex].amount = val;
      }

      taxTotal = val;
    }

    let subTotal = 0.0;

    // calculation(subTotal)
    invoiceLines.map((l) => {
      subTotal = Number(subTotal) + Number(l.amount);
    });
    subTotal = Number(subTotal).toFixed(2);

    this.setState({ taxTotal, invoiceLines, subTotal });
  };

  handleCheckBoxes = (name) => {
    this.setState((state) => ({ [name]: !state[name] }));
  };

  handleBankCodes = async (bankCode) => {
    let { formErrors } = this.state;
    if (bankCode.label != "Select Bank") {
      formErrors = Validation.handleValidation(
        "bankCode",
        bankCode.value,
        formErrors
      );
      this.setState({ bankCode, formErrors });
    }
  };

  //get supplier's list
  getSuppliersList = async () => {
    await this.props.getSuppliersList("", "", "INVOICE"); //second param for previous supplier(used in search page)

    //success case of Get Suppliers List
    if (this.props.supplier.getSuppliersListSuccess) {
      // toast.success(this.props.supplier.getSuppliersListSuccess);

      this.setState({
        suppliersList: this.props.supplier.getSuppliersList || [],
      });
    }
    //error case of Get Suppliers List
    if (this.props.supplier.getSuppliersListError) {
      handleAPIErr(this.props.supplier.getSuppliersListError, this.props);
    }
  };

  //file upload to sypht
  fileUpload = async (f) => {
    let { OCRToken, supplierName, formErrors } = this.state;
    var _this = this;

    let attachment = f;
    if (attachment[0] && attachment[0].type) {
      if (OCRToken) {
        let type = attachment[0].type;
        let name = attachment[0].name;
        let file = attachment[0];
        let size = attachment[0].size;

        if (type == "application/pdf") {
          if (size <= 20000000) {
            //max 20 MB allowed
            await _this.setState({ isLoading: true });
            await _this
              .fileUploadToSypht(file, OCRToken)
              .then(async (data) => {
                if (data && data.status === "RECEIVED") {
                  toast.success("Successfully File Uplaod");
                  await _this
                    .getResultsAfterFileUplaod(data.fileId) //get results of file after uploaded successfully
                    .then(async (data) => {
                      if (data && data.status === "FINALISED") {
                        //now populate the data in the right bar fields that the results API responds
                        let results =
                          (data && data.results && data.results.fields) || [];

                        let obj = {
                          poNumber: "",
                          invoiceNumber: "",
                          invoiceDate: "",
                          dueDate: "",
                          invoiceTotal: "",
                          taxTotal: "",
                        };
                        let amount = "";
                        results.map((r, i) => {
                          if (r.name === "invoice.purchaseOrderNo") {
                            obj.poNumber = r.value || "";
                          } else if (r.name === "document.referenceNo") {
                            obj.invoiceNumber = r.value || "";
                            formErrors = Validation.handleValidation(
                              "invoiceNumber",
                              r.value || "",
                              formErrors
                            );
                          } else if (r.name === "document.date") {
                            obj.invoiceDate =
                              r.value == "0"
                                ? ""
                                : new Date(r.value).getTime() || "";
                            formErrors = Validation.handleValidation(
                              "invoiceDate",
                              r.value || "",
                              formErrors
                            );
                          } else if (r.name === "invoice.dueDate") {
                            obj.dueDate =
                              r.value == "0"
                                ? ""
                                : new Date(r.value).getTime() || "";
                          } else if (r.name === "invoice.total") {
                            obj.invoiceTotal = r.value || "";
                            amount = r.value || "";
                          } else if (r.name === "invoice.tax") {
                            obj.taxTotal = r.value || "";
                          }
                        });

                        await _this.setState({
                          showDetail: true,
                          ...obj,
                          syphtResults: results,
                          amount,
                          isLoading: false,
                          formErrors,
                        });

                        // first convert pdf to base 64 after that show it on thw PDF viewer
                        const result = await toBase64(file).catch((e) => e);
                        if (result instanceof Error) {
                          toast.error(result.message);
                          return;
                        } else {
                          await _this.setState({ pdf: result, rotate: 0 });
                          this.handleHorizontalCross(); //to fit pdf in a container
                        }
                        //primaryAttach ---> while adding new invoice then document/pdf sending for OCR Sypht will be the primary attachment of the invoice
                        await this.addAttachment(result, name, true);

                        //call InvoiceOCRLookup request to get currency and supplier code if there exists
                        let { syphtResults, supplierName } = this.state;
                        //calling API InvoiceOCRLookup for getting the currency
                        let InvoiceOCRLookupData = {
                          poNumber: "",
                          abn: "",
                          supplierName: supplierName,
                          syphtData: syphtResults,
                        };
                        this.setState({ isLoading: true });
                        await this.props.invoiceOCRLookup(InvoiceOCRLookupData);
                        this.setState({ isLoading: false });

                        if (this.props.invoiceData.invoiceOCRLookupSuccess) {
                          toast.success(
                            this.props.invoiceData.invoiceOCRLookupSuccess
                          );

                          let invoiceOCRLookup =
                            this.props.invoiceData.invoiceOCRLookup || "";
                          if (
                            invoiceOCRLookup.currency &&
                            invoiceOCRLookup.supplierCode &&
                            this.state.amount > 0
                          ) {
                            await this.addTaxLines(
                              invoiceOCRLookup.supplierCode,
                              invoiceOCRLookup.currency,
                              this.state.amount,
                              this.state.taxTotal
                            );
                          }

                          // Invoice Lookup - When uploading an invoice pdf, if a supplier is found in the response, please populate and select it
                          if (
                            invoiceOCRLookup.supplierName &&
                            invoiceOCRLookup.supplierCode
                          ) {
                            formErrors = Validation.handleValidation(
                              "supplierCode",
                              invoiceOCRLookup.supplierCode,
                              formErrors
                            );
                            this.setState({
                              supplierCode: invoiceOCRLookup.supplierCode,
                              supplierName: invoiceOCRLookup.supplierName,
                              formErrors,
                            });
                            await this.getSupplier();
                          }
                        }
                        //error case of Invoice OCR Lookup
                        if (this.props.invoiceData.invoiceOCRLookupError) {
                          handleAPIErr(
                            this.props.invoiceData.invoiceOCRLookupError,
                            this.props
                          );
                        }
                        // end
                      }
                    })
                    .catch(function (error) {
                      console.log(
                        "Something went wrong while getting results",
                        error
                      );
                      toast.error(
                        (error && error.statusText) ||
                          "Error While Fetching Results!"
                      );
                      _this.setState({ isLoading: false });
                    });
                } else {
                  toast.error("Error While Uploading File!");
                  await _this.setState({ isLoading: false });
                }
              })
              .catch(function (error) {
                console.log("Something went wrong while uploading file", error);
                toast.error(
                  (error && error.statusText) || "Error While Uploading File!"
                );
                _this.setState({ isLoading: false });
              });
          } else {
            toast.error("Maximum Attachment Size 20 MB");
          }
        } else {
          toast.error("Please Upload Only PDF File");
        }
      } else {
        toast.error("There is no OCR Token,Please get OCR Token First!");
      }
    }
  };

  fileUploadToSypht = async (file, token) => {
    // Create the XHR request
    var xhr = new XMLHttpRequest();

    // Return it as a Promise
    return new Promise(async function (resolve, reject) {
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
            });
          }
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        }
      };
      let url = "https://api.sypht.com/fileupload";

      let data = new FormData();

      data.append("fileToUpload", file);
      data.append("products", JSON.stringify(["invoices"]));
      // data.append(
      //   "fieldSets",
      //   JSON.stringify(["sypht.invoice", "sypht.document", "sypht.generic"])
      // );
      xhr.open("POST", url);

      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(data);

      xhr.onerror = function (e) {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };
    });
  };

  //get results after file upload from sypht
  getResultsAfterFileUplaod = async (id) => {
    let { OCRToken } = this.state;

    if (OCRToken && id) {
      var xhr = new XMLHttpRequest();

      // Return it as a Promise
      return new Promise(async function (resolve, reject) {
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject({
                status: xhr.status,
                statusText: xhr.statusText,
              });
            }
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText,
            });
          }
        };
        let url = `https://api.sypht.com/result/final/${id}`;

        xhr.open("GET", url);

        xhr.setRequestHeader("Authorization", `Bearer ${OCRToken}`);
        xhr.send();

        xhr.onerror = function (e) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        };
      });
    } else {
      toast.error("OCR Token OR File ID is Missing!");
    }
  };

  // **********add/delete invoice attachments*********
  // uplaod invoice attchments
  uploadAttachment = async (f) => {
    let { attachmentSize } = this.state;

    let type = f[0].type;
    let name = f[0].name;
    let file = f[0];
    let size = f[0].size;
    if (type == "application/pdf") {
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
              await this.addAttachment(result, name);
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
      toast.error("Please Select only Attachments of type: 'pdf'");
    }
  };

  addAttachment = async (attachment, fileName, primaryAttach) => {
    this.setState({ isLoading: true });
    let { tran } = this.state;
    //primaryAttach ---> while adding new invoice then document/pdf sending for OCR Sypht will be the primary attachment of the invoice
    if (tran) {
      let data = {
        fileName,
        attachment: attachment.split(",")[1],
        tran,
      };
      await this.props.addInvoiceAttachments(data, primaryAttach);
      if (this.props.invoiceData.addInvoiceAttachmentSuccess) {
        toast.success(this.props.invoiceData.addInvoiceAttachmentSuccess);
        let invoiceAttachments =
          this.props.invoiceData.addInvoiceAttachment || [];
        let attachmentSize = 0;
        invoiceAttachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        this.setState({ invoiceAttachments, attachmentSize });
      }
      if (this.props.invoiceData.addInvoiceAttachmentError) {
        handleAPIErr(
          this.props.invoiceData.addInvoiceAttachmentError,
          this.props
        );
      }
      await this.props.clearInvoiceStates();
    } else {
      toast.error("There is no Tran of the Invoice!");
    }
    this.setState({ isLoading: false });
  };

  deleteInvoiceAttachment = async (attach) => {
    let { attachmentSize } = this.state;
    let recordID = attach.recordID;
    this.setState({ isLoading: true });

    await this.props.deleteInvoiceAttachment(recordID);
    if (this.props.invoiceData.deleteInvoiceAttachmentSuccess) {
      toast.success(this.props.invoiceData.deleteInvoiceAttachmentSuccess);
      let invoiceAttachments = this.state.invoiceAttachments || [];
      let filteredInvoiceAttachments = invoiceAttachments.filter(
        (a) => a.recordID != recordID
      );

      attachmentSize = Number(attachmentSize) - Number(attach.fileSize);
      this.setState({
        invoiceAttachments: filteredInvoiceAttachments,
        attachmentSize,
      });
    }
    if (this.props.invoiceData.deleteInvoiceAttachmentError) {
      handleAPIErr(
        this.props.invoiceData.deleteInvoiceAttachmentError,
        this.props
      );
    }
    this.props.clearInvoiceStates();

    this.setState({ isLoading: false });
  };

  // **********END*****************
  // ******* PDF header icons functionality Start **********
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () => {
    let { pageNumber } = this.state;
    if (pageNumber - 1 >= 1) {
      this.setState({ pageNumber: pageNumber - 1 });
    }
  };

  goToNextPage = () => {
    let { pageNumber, numPages } = this.state;
    if (pageNumber + 1 <= numPages) {
      this.setState({ pageNumber: pageNumber + 1 });
    }
  };

  zoomIn = async () => {
    $(".react-pdf__Page").removeClass("add-new-invoice-pdf");
    $(".add-new-invoicePdf").removeClass("over_auto_remove");
    let { scaling } = this.state;

    let { scale, dropdownZoomingValue, zoom } = pdfViewerZoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        if (
          scaling == 2.5 ||
          scaling == 2.2 ||
          scaling == 1.9 ||
          scaling == 1.6 ||
          scaling == 1.3
        ) {
          if ($(window).width() >= 2045) {
            $(".invoice_pdf_new").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  zoomOut = async () => {
    $(".react-pdf__Page").removeClass("add-new-invoice-pdf");
    $(".add-new-invoicePdf").removeClass("over_auto_remove");

    let { scaling } = this.state;

    let { scale, dropdownZoomingValue, zoom } = pdfViewerZoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        // localStorage.setItem("newInvoiceZoom", zoom);

        if (
          scaling == 2.5 ||
          scaling == 2.2 ||
          scaling == 1.9 ||
          scaling == 1.6 ||
          scaling == 1.3
        ) {
          if ($(window).width() >= 2045) {
            $(".invoice_pdf_new").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".invoice_pdf_new").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  handleDropdownZooming = async (data) => {
    $(".react-pdf__Page").removeClass("add-new-invoice-pdf");
    $(".add-new-invoicePdf").removeClass("over_auto_remove");

    let value = data.value;

    let { scale, dropdownZoomingValue } = pdfViewerSelect(value);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        // localStorage.setItem("newInvoiceZoom", value);

        if (
          value == "25%" ||
          value == "20%" ||
          value == "15%" ||
          value == "10%" ||
          value == "5%"
        ) {
          if ($(window).width() < 2045) {
            $(".react-pdf__Page").addClass("invoice_pdf_new1");
          }
        } else {
          if ($(window).width() < 2045) {
            $(".react-pdf__Page").removeClass("invoice_pdf_new1");
          }
        }
      }
    );
  };

  handleHorizontalArrow = () => {
    $(".react-pdf__Page").addClass("add-new-invoice-pdf");
    $(".pdf_canvas").removeClass("over_auto_remove");
    if ($(window).width() > 1500) {
      this.setState({
        scaling: 1.4,
        dropdownZoomingValue: { label: "20%", value: "20%" },
      });
    } else if ($(window).width() <= 1500) {
      this.setState({
        scaling: 1.4,
        dropdownZoomingValue: { label: "20%", value: "20%" },
      });
    }
  };

  handleHorizontalCross = () => {
    $(".pdf_canvas").addClass("over_auto_remove");
    this.setState({
      scaling: 1.3,
      dropdownZoomingValue: { label: "20%", value: "20%" },
    });
  };

  // ******END Zooming Functionality********
  getSelectedSupplier = async (supplier) => {
    let { formErrors } = this.state;
    let supplierName = supplier.name;
    let supplierCode = supplier.code;
    let currency = supplier.currency;
    formErrors = Validation.handleValidation(
      "supplierCode",
      supplierCode,
      formErrors
    );
    this.setState(
      {
        supplierName,
        supplierCode,
        currency,
        editName: false,
        clonedSuppliersList: [],
        formErrors,
      },
      async () => {
        //call addTaxLine API if amount > 0
        if (supplier.code && supplier.currency && this.state.amount > 0) {
          await this.addTaxLines(
            supplier.code,
            supplier.currency,
            this.state.amount,
            this.state.taxTotal
          );
        }
        this.setState({ isLoading: true });
        await this.onUpdateInvoiceSupplier();
        this.setState({ isLoading: false });
      }
    );
  };

  //************ */PO Transfer****************
  getPOTransferList = async () => {
    let { supplierCode, includeZeroLinesCheck, includeAllSuppliersCheck } =
      this.state;
    if (supplierCode) {
      this.setState({ isLoading: true });
      await this.props.getTransferList(
        supplierCode,
        includeZeroLinesCheck,
        includeAllSuppliersCheck
      );
      //success case of Get Transfer List
      if (this.props.poData.getTransferListSuccess) {
        toast.success(this.props.poData.getTransferListSuccess);
        let transferList = this.props.poData.getTransferList || [];

        transferList.map((l, i) => {
          l.id = uuidv1();
          l.action = "Clear";
          l.checked = false;
          return l;
        });
        this.setState(
          {
            transferList,
            clonedTransferList: transferList,
            POsToTransfer: [],
          },
          () => {
            this.openModal("openPOTransferModal");
          }
        );
      }
      //error case of Get Transfer List
      if (this.props.poData.getTransferListError) {
        handleAPIErr(this.props.poData.getTransferListError, this.props);
      }
      this.props.clearPOStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please Select Supplier First!");
    }
  };

  handleFilterCheckBoxes = async (name) => {
    await this.setState((state) => ({ [name]: !state[name] }));
    await this.getPOTransferList();
  };

  //when type in search box
  poTransferSearchHandler = (e) => {
    let text = e.target.value;
    if (!text) {
      this.setState({
        poTransferSearch: text,
        clonedTransferList: this.state.transferList || [],
      });
    } else {
      this.setState({
        poTransferSearch: text,
      });
    }
  };

  //when clicks on search button
  onSearch = () => {
    let text = this.state.poTransferSearch.trim();
    if (text) {
      let poTransferSearchData = [];
      poTransferSearchData = this.state.transferList.filter((t) => {
        return (
          t.poNumber.toString().toUpperCase().includes(text.toUpperCase()) ||
          t.description.toUpperCase().includes(text.toUpperCase()) ||
          t.amount.toString().toUpperCase().includes(text.toUpperCase()) ||
          t.supplier.toString().toUpperCase().includes(text.toUpperCase())
        );
      });

      this.setState({ clonedTransferList: poTransferSearchData });
    }
  };

  onEnter = async (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      let text = this.state.poTransferSearch.trim();
      if (text) {
        let poTransferSearchData = [];
        poTransferSearchData = this.state.transferList.filter((t) => {
          return (
            t.poNumber.toString().toUpperCase().includes(text.toUpperCase()) ||
            t.description.toUpperCase().includes(text.toUpperCase()) ||
            t.amount.toString().toUpperCase().includes(text.toUpperCase()) ||
            t.supplier.toString().toUpperCase().includes(text.toUpperCase())
          );
        });

        this.setState({ clonedTransferList: poTransferSearchData });
      }
    }
  };

  handlePOTransferCheckbox = async (e, data) => {
    let { POsToTransfer, transferList } = this.state;

    if (e.target.checked) {
      if (data === "all") {
        transferList.map(async (l, i) => {
          l.checked = true;

          return l;
        });
        this.setState({ POsToTransfer: [...transferList] });
      } else {
        transferList.map(async (l, i) => {
          if (data.id === l.id) {
            l.checked = true;
          }
          return l;
        });
        this.state.POsToTransfer.push(data);
        this.setState({ POsToTransfer });
      }
    } else {
      if (data === "all") {
        transferList.map(async (l, i) => {
          l.checked = false;

          return l;
        });
        this.setState({ POsToTransfer: [] });
      } else {
        transferList.map(async (l, i) => {
          if (data.id === l.id) {
            l.checked = false;
          }
          return l;
        });
        let filteredPOs = POsToTransfer.filter((f) => f.id != data.id);
        this.setState({ POsToTransfer: filteredPOs });
      }
    }

    this.setState({
      transferList,
    });
  };

  onTransfer = async () => {
    let POsToTransfer = JSON.parse(JSON.stringify(this.state.POsToTransfer));

    if (POsToTransfer.length > 0) {
      /*
      Client-> I've added approvalGroup as a field to each lin in the GetTransferList response, 
      can the approvalGroup of the first line selected to transfer replace the selected approval group of the invoice?
      */
      let _approvalGroup = POsToTransfer[0].approvalGroup || "";
      let approvalGroup = {
        label: _approvalGroup,
        value: _approvalGroup,
      };
      //End

      POsToTransfer.map((po, i) => {
        po.poTran = po.tran;
        po.poLine = po.lineNumber;
        delete po["tran"];
        delete po["lineNumber"];
        return po;
      });

      await this.state.invoiceLines.push(...POsToTransfer);

      let { invoiceLines } = this.state;
      let subTotal = 0.0;

      invoiceLines.map((l, i) => {
        //to assign every line a unique id
        l.id = uuidv1();
        l.checked = false;
        // l.tabIndex = 4457 + i * 2;
        l.amount = Number(l.amount).toFixed(2) || 0.0;
        subTotal = Number(subTotal) + Number(l.amount);

        if (!l.poNumber.trim()) {
          l.actionDisabled = true;
        } else {
          l.actionDisabled = false;
        }
        return l;
      });
      this.setState({
        invoiceLines,
        openPOTransferModal: false,
        approvalGroup,
        subTotal: Number(subTotal).toFixed(2),
      });
    } else {
      toast.error("Please Select PO Line First to Transfer!");
    }
  };

  // ***********END***************
  // when click on import button then call API import invoice
  importInvoice = async () => {
    let formErrors = this.state.formErrors;

    if (!this.state.supplierCode) {
      formErrors.supplierCode = "This Field is Required.";
    }
    if (!this.state.invoiceDate) {
      formErrors.invoiceDate = "This Field is Required.";
    }
    if (!this.state.invoiceNumber) {
      formErrors.invoiceNumber = "This Field is Required.";
    }
    this.setState({
      formErrors: formErrors,
    });
    if (
      !formErrors.supplierCode &&
      !formErrors.invoiceDate &&
      !formErrors.invoiceNumber
    ) {
      this.setState({ isLoading: true });

      await this.invoiceOCRLookup(); //to get currency regarding to the selected supplier

      let {
        tran,
        poNumber,
        currency,
        supplierCode,
        invoiceDate,
        invoiceNumber,
        dueDate,
        invoiceTotal,
        taxTotal,
      } = this.state;
      let data = {
        tran,
        poNumber,
        attachment: "",
        invoiceDetails: {
          currency,
          supplier: supplierCode, //suplier code
          invoiceDate,
          invoiceNumber,
          dueDate,
          invoiceTotal,
          taxTotal,
        },
      };
      await this.props.importInvoice(data);
      let subTotal = 0.0;

      //success case of Import Invoice
      if (this.props.invoiceData.importInvoiceSuccess) {
        toast.success(this.props.invoiceData.importInvoiceSuccess);
        if (this.props.invoiceData.importInvoiceWarning) {
          toast.warn(this.props.invoiceData.importInvoiceWarning);
        }
        let invoice =
          (this.props.invoiceData.importInvoiceData &&
            this.props.invoiceData.importInvoiceData.invoice) ||
          "";
        let lines =
          (invoice && JSON.parse(JSON.stringify(invoice.lines))) || [];
        let approvalOptions =
          (invoice && JSON.parse(JSON.stringify(invoice.approvalOptions))) ||
          [];
        let approvalOpt = [];

        approvalOptions.map((a, i) => {
          approvalOpt.push({ label: a.groupName, value: a.groupName });
        });

        let approvalGroup =
          (invoice && JSON.parse(JSON.stringify(invoice.approvalGroup))) || "";

        let { invoiceLines } = this.state;

        /*
       I've added a new field to the invoice lines called lineNo. When calling the AddTaxLines 
       and ImportInvoice requests, can you check if there is a line with the lineNo that already exists 
       and if so ignore the new line in the response? This is to avoid duplicate tax lines.
       */
        let filterImportedLines = lines.filter((t) => {
          let exists = invoiceLines.find((l) => l.lineNo === t.lineNo);
          if (exists) {
            //if already exists then ignore new comming line
            return false;
          }
          return true;
        });

        filterImportedLines.map((line, i) => {
          line.id = uuidv1();
        });

        invoiceLines = [...invoiceLines, ...filterImportedLines];

        invoiceLines.map((l, i) => {
          //to assign every line a unique id
          l.id = uuidv1();
          l.checked = false;
          // l.tabIndex = 4457 + i * 2;
          l.amount = Number(l.amount).toFixed(2) || 0.0;

          subTotal = Number(subTotal) + Number(l.amount);

          if (!l.poNumber.trim()) {
            l.actionDisabled = true;
          } else {
            l.actionDisabled = false;
          }
          return l;
        });

        // When the tax line is returned for the invoice, can you update the tax field in this section with the amount?
        let txLine = invoiceLines.find((line) => line.lineNo === 1);
        if (txLine) {
          taxTotal = Number(txLine.amount).toFixed(2);
        }

        this.setState({
          tran: invoice.tran || "",
          taxTotal,
          supplierName: invoice.supplierName || "",
          invoiceDate:
            invoice.invoiceDate == "0" ? "" : Number(invoice.invoiceDate) || "",
          invoiceNumber: invoice.invoiceNumber || "",
          amount: invoice.amount || 0,
          invoiceTotal: invoice.amount || 0,
          receiveDate:
            invoice.receiveDate == "0" ? "" : Number(invoice.receiveDate) || "",
          dueDate: invoice.dueDate == "0" ? "" : Number(invoice.dueDate) || "",
          reference: invoice.reference || "",
          payDate: invoice.payDate == "0" ? "" : Number(invoice.payDate) || "",
          description: invoice.description || "",
          approvalGroup: { label: approvalGroup, value: approvalGroup },
          approvalOptions: approvalOpt,
          invoiceLines,
          subTotal: Number(subTotal).toFixed(2),
        });
      }
      //error case of Import Invoice
      if (this.props.invoiceData.importInvoiceError) {
        handleAPIErr(this.props.invoiceData.importInvoiceError, this.props);
      }
      this.props.clearInvoiceStates();
      this.setState({ isLoading: false });
    }
  };

  handleCheckboxesInvoiceLines = async (e, line) => {
    let { invoiceLines } = this.state;
    if (e.target.checked) {
      if (line === "all") {
        invoiceLines.map(async (l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        invoiceLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = true;
          }
          return l;
        });
      }
    } else {
      if (line === "all") {
        invoiceLines.map(async (l, i) => {
          l.checked = false;
          return l;
        });
      } else {
        invoiceLines.map(async (l, i) => {
          if (l.id === line.id) {
            l.checked = false;
          }
          return l;
        });
      }
    }

    this.setState({
      invoiceLines,
    });
  };

  handleMultipleChangesModal = () => {
    let { invoiceLines } = this.state;
    let check = invoiceLines.find((l) => l.checked);
    if (check) {
      this.openModal("openMultipleChangesModal");
    } else {
      toast.error("Please tick lines for Multiple changes!");
    }
  };

  //upldate invoice-lines according to multiple change modal
  handleMultipleChanges = async (data) => {
    let { invoiceLines } = this.state;

    let flagIsEmpty = false;

    // data.trackingCodes.map((f, i) => {
    //   if (f.value.trim() == "") {
    //     flagIsEmpty = true;
    //   }
    // });

    invoiceLines.map((p, i) => {
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

    this.setState({ invoiceLines });
  };

  addTaxLines = async (supplierCode, currency, amount, taxAmount) => {
    /*
    Regarding the tax lines in invoice entry, 
    can the AddTaxLine request be called whenever the 
    Supplier or amount is changed with the tax lines 1 & 2 being updated? 
    If the request returns no lines, 
    can the current tax lines be removed?
    */

    this.setState({ isLoading: true });
    await this.props.addTaxLines({
      supplierCode,
      currency,
      amount,
      taxAmount,
    });
    let { taxTotal } = this.state;

    //success case of add tax lines
    if (this.props.invoiceData.addTaxLinesSuccess) {
      toast.success(this.props.invoiceData.addTaxLinesSuccess);
      let addTaxLines = this.props.invoiceData.addTaxLines;
      let { invoiceLines } = this.state;

      if (addTaxLines.length > 0) {
        //add OR update tax lines in invoiceLines

        addTaxLines.map((txLine, i) => {
          //to assign every line a unique id
          txLine.id = uuidv1();
          txLine.checked = false;
          // txLine.tabIndex = 4457 + i * 2;

          if (!txLine.poNumber.trim()) {
            txLine.actionDisabled = true;
          } else {
            txLine.actionDisabled = false;
          }

          let foundIndex = invoiceLines.findIndex(
            (line) => line.lineNo === txLine.lineNo
          );
          txLine.amount = Number(txLine.amount).toFixed(2);
          if (foundIndex >= 0) {
            //update case
            invoiceLines[foundIndex] = txLine;
          } else {
            //add case
            invoiceLines = [...invoiceLines, txLine];
          }

          return txLine;
        });
        // END
      } else {
        //remove tax lines from invoiceLines where lineNo = 1 and 2
        invoiceLines = invoiceLines.filter(
          (l) => l.lineNo !== 1 && l.lineNo !== 2
        );
      }

      // When the tax line is returned for the invoice, can you update the tax field in this section with the amount?
      let txLine = invoiceLines.find((line) => line.lineNo === 1);
      if (txLine) {
        taxTotal = Number(txLine.amount).toFixed(2);
      }

      let subTotal = 0.0;

      // calculation(subTotal)
      invoiceLines.map((l) => {
        subTotal = Number(subTotal) + Number(l.amount);
      });
      subTotal = Number(subTotal).toFixed(2);

      this.setState({
        invoiceLines,
        taxTotal,
        subTotal,
      });
    }
    //error case of add tax lines
    if (this.props.invoiceData.addTaxLinesError) {
      handleAPIErr(this.props.invoiceData.addTaxLinesError, this.props);
    }
    this.setState({ isLoading: false });
  };

  //get currency according to supplier and sypht data
  invoiceOCRLookup = async () => {
    let { syphtResults, supplierName } = this.state;
    //calling API InvoiceOCRLookup for getting the currency
    let InvoiceOCRLookupData = {
      poNumber: "",
      abn: "",
      supplierName: supplierName,
      syphtData: syphtResults,
    };
    await this.props.invoiceOCRLookup(InvoiceOCRLookupData);

    if (this.props.invoiceData.invoiceOCRLookupSuccess) {
      toast.success(this.props.invoiceData.invoiceOCRLookupSuccess);

      let invoiceOCRLookup = this.props.invoiceData.invoiceOCRLookup || "";
      this.setState({
        currency: invoiceOCRLookup.currency,
      });
    }
    //error case of Invoice OCR Lookup
    if (this.props.invoiceData.invoiceOCRLookupError) {
      handleAPIErr(this.props.invoiceData.invoiceOCRLookupError, this.props);
    }
  };

  //view attachments in new tab
  getAttachment = async (recordID, fileName) => {
    this.setState({ isLoading: true });

    await this.props.getInvoiceAttachments(this.state.tran, recordID);
    if (this.props.invoiceData.getInvocieAttachmentSuccess) {
      // toast.success(this.props.invoiceData.getInvocieAttachmentSuccess);
      let resp = this.props.invoiceData.getInvocieAttachment;
      downloadAttachments(resp, fileName);
    }
    if (this.props.invoiceData.getInvocieAttachmentError) {
      handleAPIErr(
        this.props.invoiceData.getInvocieAttachmentError,
        this.props
      );
    }
    this.props.clearInvoiceStates();
    this.setState({ isLoading: false });
  };

  //When click on save button then call APi update invoice
  onSave = async (e) => {
    e.preventDefault();
    let {
      tran,
      currency,
      supplierCode,
      invoiceDate,
      invoiceNumber,
      dueDate,
      invoiceTotal,
      amount,
      bankCode,
      receiveDate,
      reference,
      payDate,
      description,
      approvalGroup,
      invoiceLines,
      formErrors,
    } = this.state;

    formErrors = Validation.handleWholeValidation(
      { supplierCode, invoiceDate, invoiceNumber, bankCode: bankCode.value },
      formErrors
    );

    if (
      !formErrors.supplierCode &&
      !formErrors.invoiceDate &&
      !formErrors.invoiceNumber &&
      !formErrors.bankCode
    ) {
      invoiceLines.map((l, i) => {
        l.description = l.description.toUpperCase();
        return l;
      });

      this.setState({ isLoading: true });

      await this.invoiceOCRLookup(); //to get currency regarding to the selected supplier

      let data = {
        tran,
        invoiceDetails: {
          currency,
          supplier: supplierCode, //suplier code
          invoiceDate,
          invoiceNumber,
          dueDate,
          invoiceTotal,
          amount,
          bankCode: bankCode.value,
          receiveDate,
          reference,
          payDate,
          description,
          approvalGroup: approvalGroup.value || "",
          invoiceLines,
        },
      };
      await this.props.updateInvoice(data);
      //success case of Update Invoice
      if (this.props.invoiceData.updateInvoiceSuccess) {
        toast.success(this.props.invoiceData.updateInvoiceSuccess);
        // hide prefrences
        let {
          // receivedDateCheck,
          descriptionCheck,
          paymentReferenceCheck,
          paymentDateCheck,
        } = this.state;
        let obj = {
          // receivedDateCheck,
          descriptionCheck,
          paymentReferenceCheck,
          paymentDateCheck,
        };
        localStorage.setItem("displayAddInvoiceSettings", JSON.stringify(obj));
        // end

        /*When  draft/Edit and Invoice or Order  and then user Save or Cancel that edit, 
        then load the same Invoice or Order user just edited?.*/
        this.props.history.push("/invoice", {
          tallies: "Draft",
          editInvoiceCheck: true,
          editInvoiceTran: this.state.tran,
        });
      }
      //error case of Update Invoice
      if (this.props.invoiceData.updateInvoiceError) {
        handleAPIErr(this.props.invoiceData.updateInvoiceError, this.props);
      }

      this.setState({ isLoading: false });
    }

    this.setState({
      formErrors: formErrors,
    });
  };

  onCancel = async () => {
    this.setState({ isLoading: true });
    await this.props.deleteInvoice(this.state.tran); //to delete invoice
    //success case of Delete Invoice
    if (this.props.invoiceData.deleteInvoiceSuccess) {
      toast.success(this.props.invoiceData.deleteInvoiceSuccess);
    }
    //error case of Delete Invoice
    if (this.props.invoiceData.deleteInvoiceError) {
      handleAPIErr(this.props.invoiceData.deleteInvoiceError, this.props);
    }
    this.setState({ isLoading: false });

    this.props.history.push("/invoice");
  };

  addSupplier = () => {
    this.props.history.push("/new-supplier2", {
      stateData: this.state,
      page: "addNewInvoice",
      supplierName: this.state.supplierName,
    });
  };

  getSupplier = async () => {
    /*
    168. Supplier Tracking Codes vs User Tracking Codes - 
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
    if (currency && supplierCode) {
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
    }
  };

  onUpdateInvoiceSupplier = async () => {
    /*
    168. Supplier Tracking Codes vs User Tracking Codes - 
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
    if (currency && supplierCode) {
      let supplierDetails = {
        currency,
        code: supplierCode,
      };

      await this.props.getSupplier(supplierDetails);

      //success case of Get single Supplier
      if (this.props.supplier.getSupplierSuccess) {
        // toast.success(this.props.supplier.getSupplierSuccess);
        let flgs = this.props.supplier.getSupplier.flags || [];

        this.setState({ suppliersFlags: flgs }, () => {
          this.updateInvoiceLines();
        });
      }
      //error case of Get single Supplier
      if (this.props.supplier.getSupplierError) {
        handleAPIErr(this.props.supplier.getSupplierError, this.props);
      }
      this.props.clearSupplierStates();
    }
  };

  //Update Invoice Lines -> on supplier change
  updateInvoiceLines = async () => {
    let { invoiceLines, suppliersFlags } = this.state;

    //pre-fill the Chart Sort with the user's default chart sort.
    let chartSort =
      (this.props.user.getDefaultValues &&
        this.props.user.getDefaultValues.defaultValues &&
        this.props.user.getDefaultValues.defaultValues.chartSort) ||
      "";

    let flags = this.state.defaultUserFlags || []; //user's flags
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

    let newInvoiceLines = JSON.parse(JSON.stringify(invoiceLines));

    for (let i = 0; i < newInvoiceLines.length; i++) {
      /*
      Can you ensure that the tax line in New Invoices and Edit Invoices is not changed by the user or vendor flags? 
      It needs to be excluded from having its flags updated. It is the tax flag that is generated by the system
      */
      let check = true;
      if (newInvoiceLines[i].lineNo === 1 || newInvoiceLines[i].lineNo === 2) {
        check = false;
      }

      if (check) {
        newInvoiceLines[i].chartSort = chartSort;
        newInvoiceLines[i].flags = JSON.parse(JSON.stringify(flags));
      }
    }

    this.setState({ invoiceLines: newInvoiceLines });
  };

  onBlurAmount = async (e) => {
    let val = Number(e.target.value).toFixed(2) || 0.0;
    this.setState({ amount: val, invoiceTotal: val });

    let { supplierCode, currency, amount, taxTotal } = this.state;
    //call addTaxLine API if amount > 0 and there is selected supplier
    if (supplierCode && currency && amount > 0) {
      await this.addTaxLines(supplierCode, currency, amount, taxTotal);
    }
  };

  handleChangeSupplierName = async (e) => {
    let { formErrors } = this.state;

    $(".invoice_vender_menu1").show();

    formErrors.supplierCode = "This Field is Required.";

    let value = e.target.value;

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
    }
    this.setState({
      supplierName: value,
      supplierCode: "",
      editName: true,
      clonedSuppliersList,
      formErrors,
    });
  };

  onFocusButtons = (e) => {
    let id = e.target.id;
    this.setState({ [id]: true });
  };

  onBlurButtons = (e) => {
    let id = e.target.id;
    this.setState({ [id]: false });
  };

  //to close date picker on tab change
  closeDatePicker = () => {
    $(".react-datepicker").hide();
  };

  handleChangePageNum = (e) => {
    let pageNumber = Number(e.target.value);
    this.setState({ pageNumber });
  };

  handlePDFRotate = () => {
    this.setState({ rotate: this.state.rotate + 270 });
  };

  render() {
    let _blockSupplier = localStorage.getItem("blockSupplier");
    let blockSupplier = false;
    if (_blockSupplier) {
      blockSupplier = _blockSupplier === "N" ? true : false;
    }

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} newInvoice={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}

            <section id="" className="supplier">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="body_content ordermain-padi">
                  <div className="container-fluid ">
                    <div className="main_wrapper ">
                      <div className="img-section-t col-12 pl-0 pr-0">
                        <div className="container p-0">
                          <div className="row justify-content-center">
                            <div
                              className=" col-12 col-sm-12 col-md-12 col-lg-9"
                              id="expandToFull"
                            >
                              <div className="drag-panel-main mx-auto">
                                <div className="drag-panel">
                                  <div className="row">
                                    <div className="col-sm-6 col-md-5 slider-panel pr-sm-0">
                                      {/* <span className="zom-img cursorPointer">
                                        <img
                                          src="images/search-w.png"
                                          className=" img-fluid float-left"
                                          alt="user"
                                        />{" "}
                                      </span> */}
                                      <span className="zom-img cursorPointer">
                                        <img
                                          onClick={this.handlePDFRotate}
                                          src="images/referesh-w.png"
                                          className=" img-fluid float-left"
                                          alt="user"
                                        />{" "}
                                      </span>
                                      <span className="clr-text cursorPointer m-0">
                                        {" "}
                                        page{" "}
                                        <span className="text-number add-new-inv-tno">
                                          {" "}
                                          {/* {this.state.pageNumber} */}
                                          <input
                                            name="pageNumber"
                                            className="invoice_PDF_pageNum"
                                            value={this.state.pageNumber}
                                            onChange={this.handleChangePageNum}
                                          />{" "}
                                        </span>{" "}
                                        of {this.state.numPages}
                                      </span>
                                    </div>
                                    <div className="col-sm-6 col-md-7 pl-sm-0 pr-sm-0">
                                      <div className="slider-panel add-new-invoice-tabledropdown">
                                        <span className="zom-img cursorPointer">
                                          <img
                                            onClick={this.zoomOut}
                                            src="images/minus-w.png"
                                            className=" img-fluid float-left"
                                            alt="user"
                                          />{" "}
                                        </span>
                                        <span className="zom-img cursorPointer">
                                          <img
                                            onClick={this.zoomIn}
                                            src="images/add-w.png"
                                            className=" img-fluid float-left"
                                            alt="user"
                                          />{" "}
                                        </span>
                                        <Select
                                          className="width-selector"
                                          value={
                                            this.state.dropdownZoomingValue
                                          }
                                          styles={_customStyles}
                                          classNamePrefix="react-select"
                                          options={options}
                                          onChange={this.handleDropdownZooming}
                                          tabIndex="-1"
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
                                        <span className="zom-img cursorPointer">
                                          <img
                                            src="images/drag-w.png"
                                            onClick={this.handleHorizontalCross}
                                            className=" img-fluid float-left"
                                            id="ani-full-screen"
                                            alt="user"
                                          />{" "}
                                        </span>
                                        <span className="zom-img cursorPointer ani-pdf-expand">
                                          <img
                                            onClick={this.handleHorizontalArrow}
                                            src="images/twoarow-w.png"
                                            className=" img-fluid float-left"
                                            alt="user"
                                          />{" "}
                                        </span>

                                        <span className="zom-img float-right cursorPointer">
                                          <img
                                            src="images/downa-w.png"
                                            className=" img-fluid"
                                            alt="user"
                                            href="#demo"
                                            data-slide="next"
                                            onClick={this.goToNextPage}
                                          />{" "}
                                        </span>
                                        <span className="zom-img float-right cursorPointer">
                                          <img
                                            src="images/upa-w.png"
                                            className=" img-fluid"
                                            alt="user"
                                            href="#demo"
                                            data-slide="prev"
                                            onClick={this.goToPrevPage}
                                          />{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="drag-t-sec"> */}

                                <div className="text-center">
                                  <div
                                    className={
                                      this.state.showDetail
                                        ? "add-new-invoicePdf text-center pdf_canvas"
                                        : "text-center pdf_canvas"
                                    }
                                  >
                                    {this.state.showDetail ? (
                                      <div
                                        id="maped_image"
                                        style={{ background: "#fff" }}
                                      >
                                        <div
                                          className="h-100"
                                          style={{
                                            margin: "0 auto",
                                            overFlow: "auto",
                                          }}
                                        >
                                          <Document
                                            file={this.state.pdf}
                                            onLoadSuccess={
                                              this.onDocumentLoadSuccess
                                            }
                                            rotate={this.state.rotate}
                                          >
                                            <Page
                                              pageNumber={this.state.pageNumber}
                                              width={600}
                                              scale={this.state.scaling}
                                            />
                                          </Document>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="col-12 mt-2 pb-2">
                                        <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                          <div id="drop-area">
                                            <input
                                              type="file"
                                              id="fileElem-newinvoice"
                                              className="form-control d-none"
                                              accept="application/pdf"
                                              onChange={(e) => {
                                                this.fileUpload(e.target.files);
                                              }}
                                              onClick={(event) => {
                                                event.currentTarget.value =
                                                  null;
                                              }} //to upload the same file again
                                            />
                                            <label
                                              className="upload-label"
                                              htmlFor="fileElem-newinvoice"
                                            >
                                              <div className="upload-text">
                                                <img
                                                  src="images/drag-file.png"
                                                  className="import_icon img-fluid"
                                                  alt="newinvoice-document"
                                                />
                                              </div>
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* <p>
                                      Page {this.state.pageNumber} of{" "}
                                      {this.state.numPages}
                                    </p> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" col-12 col-sm-12 col-md-12 col-lg-3">
                              <div className="drag-white-b add-new-inv-aside">
                                <div className="col-12">
                                  <div className="form-group custon_select">
                                    <label>Supplier</label>
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control focus_vender"
                                        id="Invoiceusr"
                                        autoComplete="off"
                                        name={"supplierName"}
                                        tabIndex="4436"
                                        autoFocus={true}
                                        value={this.state.supplierName}
                                        onChange={this.handleChangeSupplierName}
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
                                      {this.state.clonedSuppliersList.length >
                                      0 ? (
                                        <ul className="invoice_vender_menu">
                                          {this.state.clonedSuppliersList.map(
                                            (s, i) => {
                                              return (
                                                <li
                                                  classname="cursorPointer"
                                                  key={i}
                                                  onClick={() =>
                                                    this.getSelectedSupplier(s)
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
                                            + Create Supplier From {"'"}
                                            {this.state.supplierName}
                                            {"'"}
                                          </buuton>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>

                                    <div className="text-danger error-12">
                                      {this.state.formErrors.supplierCode !== ""
                                        ? this.state.formErrors.supplierCode
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group custon_select">
                                    <label>Invoice Number</label>
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="usr"
                                        name="invoiceNumber"
                                        tabIndex="4437"
                                        value={this.state.invoiceNumber}
                                        onChange={this.handleFieldChange}
                                      />
                                      {/* <span className="input_field_icons">
                                      <i className="fa fa-plus mr-3"></i>
                                      <i className="fa fa-search"></i>
                                    </span> */}
                                    </div>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.invoiceNumber !==
                                      ""
                                        ? this.state.formErrors.invoiceNumber
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="form-group custon_select">
                                    <label>PO Number</label>
                                    <div className="modal_input">
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="usr"
                                        name="poNumber"
                                        tabIndex="4438"
                                        value={this.state.poNumber}
                                        onChange={this.handleFieldChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="form-group custon_select">
                                    <label>Invoice Date</label>
                                    <div className="modal_input datePickerUP">
                                      <DatePicker
                                        name="invoiceDate"
                                        selected={this.state.invoiceDate}
                                        onKeyDown={(e) => {
                                          if (e.key == "Tab") {
                                            this.closeDatePicker();
                                          }
                                        }}
                                        tabIndex="4439"
                                        onChange={(d) =>
                                          this.handleDateChange(
                                            d,
                                            "invoiceDate"
                                          )
                                        }
                                        dateFormat="d MMM yyyy"
                                        autoComplete="off"
                                      />
                                    </div>
                                    <div className="text-danger error-12">
                                      {this.state.formErrors.invoiceDate !== ""
                                        ? this.state.formErrors.invoiceDate
                                        : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="form-group custon_select">
                                    <label>Due Date</label>
                                    <div className="modal_input datePickerUP">
                                      <DatePicker
                                        name="dueDate"
                                        selected={this.state.dueDate}
                                        onKeyDown={(e) => {
                                          if (e.key == "Tab") {
                                            this.closeDatePicker();
                                          }
                                        }}
                                        tabIndex="4440"
                                        onChange={(d) =>
                                          this.handleDateChange(d, "dueDate")
                                        }
                                        dateFormat="d MMM yyyy"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="form-group custon_select">
                                    <label>Invoice Total</label>
                                    <div className="modal_input">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="usr"
                                        name="invoiceTotal"
                                        tabIndex="4441"
                                        value={this.state.invoiceTotal}
                                        onChange={this.handleFieldChange}
                                        onBlur={this.onBlurAmount}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="form-group custon_select">
                                    <label>Tax Amount</label>
                                    <div className="modal_input">
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="usr"
                                        name="taxTotal"
                                        tabIndex="4442"
                                        value={this.state.taxTotal}
                                        onChange={this.handleFieldChange}
                                        onBlur={this.convertTwoDecimal}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* {this.state.showDetail && ( */}
                              {true && (
                                <button
                                  className="add_invc_imprt_po"
                                  type="button"
                                  onClick={this.importInvoice}
                                  tabIndex="4443"
                                >
                                  <div className="drag-white-b2 cursorPointer">
                                    Import PO
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                          {/* start invoice detail */}
                          {/* {this.state.showDetail && ( */}
                          {true && (
                            <div className="row">
                              <div className=" col-12 col-sm-12 col-md-12">
                                <div className="white-bg">
                                  <div className="">
                                    <Dropdown
                                      alignRight="false"
                                      drop="up"
                                      className="analysis-card-dropdwn float-right mt-7"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                      >
                                        <img
                                          src="images/more.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          to="#/action-1"
                                          className=""
                                          disabled
                                        >
                                          <div
                                            className="pr-0"
                                            // onClick={() =>
                                            //   this.handleCheckBoxes(
                                            //     "receivedDateCheck"
                                            //   )
                                            // }
                                          >
                                            <div className="form-group remember_check">
                                              <input
                                                type="checkbox"
                                                id="receivedDateCheck"
                                                name="receivedDateCheck"
                                                // checked={
                                                //   this.state.receivedDateCheck
                                                // }
                                                disabled
                                                onChange={() => {}}
                                              />
                                              <label
                                                htmlFor="receivedDateCheck"
                                                className="mr-0 grey-c"
                                              >
                                                Received Date
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          to="#/action-2"
                                          className="f-20"
                                        >
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleCheckBoxes(
                                                "descriptionCheck"
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check">
                                              <input
                                                type="checkbox"
                                                id="descriptionCheck"
                                                name="descriptionCheck"
                                                checked={
                                                  this.state.descriptionCheck
                                                }
                                                onChange={() => {}}
                                              />
                                              <label
                                                htmlFor="descriptionCheck"
                                                className="mr-0"
                                              >
                                                Description
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          to="#/action-3"
                                          className=""
                                        >
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleCheckBoxes(
                                                "paymentReferenceCheck"
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check">
                                              <input
                                                type="checkbox"
                                                id="paymentReferenceCheck"
                                                name="paymentReferenceCheck"
                                                checked={
                                                  this.state
                                                    .paymentReferenceCheck
                                                }
                                                onChange={() => {}}
                                              />
                                              <label
                                                htmlFor="paymentReferenceCheck"
                                                className="mr-0"
                                              >
                                                Payment Reference
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          to="#/action-4"
                                          className=""
                                        >
                                          <div
                                            className="pr-0"
                                            onClick={() =>
                                              this.handleCheckBoxes(
                                                "paymentDateCheck"
                                              )
                                            }
                                          >
                                            <div className="form-group remember_check">
                                              <input
                                                type="checkbox"
                                                id="paymentDateCheck"
                                                name="paymentDateCheck"
                                                checked={
                                                  this.state.paymentDateCheck
                                                }
                                                onChange={() => {}}
                                              />
                                              <label
                                                htmlFor="paymentDateCheck"
                                                className="mr-0"
                                              >
                                                Payment Date
                                              </label>
                                            </div>
                                          </div>
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>

                                    <div className="clearfix"></div>
                                  </div>
                                  <div className="row">
                                    <div className="form-group col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="custon_select">
                                        <label>Supplier</label>
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control focus_vender"
                                            id="usr"
                                            tabIndex="4444"
                                            autoComplete="off"
                                            name={"supplierName"}
                                            value={this.state.supplierName}
                                            onChange={
                                              this.handleChangeSupplierName
                                            }
                                          />

                                          <span
                                            onClick={() =>
                                              this.openModal(
                                                "openSupplierLookupModal"
                                              )
                                            }
                                            className="input_field_icons"
                                          >
                                            <i className="fa fa-angle-right"></i>
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
                                                        this.getSelectedSupplier(
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
                                                + Create Supplier From {"'"}
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
                                        {this.state.formErrors.supplierCode !==
                                        ""
                                          ? this.state.formErrors.supplierCode
                                          : ""}
                                      </div>
                                    </div>

                                    <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Date</label>

                                        <div className="modal_input datePickerUP">
                                          <DatePicker
                                            name="invoiceDate"
                                            tabIndex="4445"
                                            selected={this.state.invoiceDate}
                                            onKeyDown={(e) => {
                                              if (e.key == "Tab") {
                                                this.closeDatePicker();
                                              }
                                            }}
                                            onChange={(d) =>
                                              this.handleDateChange(
                                                d,
                                                "invoiceDate"
                                              )
                                            }
                                            dateFormat="d MMM yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                        <div className="text-danger error-12">
                                          {this.state.formErrors.invoiceDate !==
                                          ""
                                            ? this.state.formErrors.invoiceDate
                                            : ""}
                                        </div>
                                      </div>
                                    </div>

                                    <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Invoice</label>
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control"
                                            tabIndex="4446"
                                            id="usr"
                                            name="invoiceNumber"
                                            value={this.state.invoiceNumber}
                                            onChange={this.handleFieldChange}
                                          />
                                        </div>
                                        <div className="text-danger error-12">
                                          {this.state.formErrors
                                            .invoiceNumber !== ""
                                            ? this.state.formErrors
                                                .invoiceNumber
                                            : ""}
                                        </div>
                                      </div>
                                    </div>

                                    <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Amount</label>
                                        <div className="modal_input">
                                          <input
                                            type="number"
                                            className="form-control"
                                            id="usr"
                                            tabIndex="4447"
                                            name="amount"
                                            value={this.state.amount}
                                            onChange={this.handleFieldChange}
                                            onBlur={this.onBlurAmount}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {/* {this.state.receivedDateCheck && (
                                    <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Receive Date</label>
                                        <div className="modal_input datePickerUP">
                                          <DatePicker
                                            name="receiveDate"
                                            selected={this.state.receiveDate}
                                             onKeyDown={(e) => {
                                            if (e.key == "Tab") {
                                              this.closeDatePicker();
                                            }
                                          }}
                                            onChange={d =>
                                              this.handleDateChange(
                                                d,
                                                "receiveDate"
                                              )
                                            }
                                              tabIndex="4448"
                                              dateFormat="d MMM yyyy"
                                              autoComplete='off'
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )} */}

                                    <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Due Date</label>
                                        <div className="modal_input datePickerUP">
                                          <DatePicker
                                            name="dueDate"
                                            selected={this.state.dueDate}
                                            tabIndex="4449"
                                            onKeyDown={(e) => {
                                              if (e.key == "Tab") {
                                                this.closeDatePicker();
                                              }
                                            }}
                                            onChange={(d) =>
                                              this.handleDateChange(
                                                d,
                                                "dueDate"
                                              )
                                            }
                                            dateFormat="d MMM yyyy"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {this.state.paymentReferenceCheck && (
                                      <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="form-group custon_select">
                                          <label>Payment Reference</label>
                                          <div className="modal_input">
                                            <input
                                              type="text"
                                              className="form-control"
                                              tabIndex="4450"
                                              id="usr"
                                              name="reference"
                                              value={this.state.reference}
                                              onChange={this.handleFieldChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {this.state.paymentDateCheck && (
                                      <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="form-group custon_select">
                                          <label>Payment Date</label>
                                          <div className="modal_input datePickerUP">
                                            <DatePicker
                                              name="payDate"
                                              selected={this.state.payDate}
                                              tabIndex="4451"
                                              onKeyDown={(e) => {
                                                if (e.key == "Tab") {
                                                  this.closeDatePicker();
                                                }
                                              }}
                                              onChange={(d) =>
                                                this.handleDateChange(
                                                  d,
                                                  "payDate"
                                                )
                                              }
                                              dateFormat="d MMM yyyy"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {this.state.descriptionCheck && (
                                      <div className=" col-12 col-sm-6 col-md-6 col-lg-9">
                                        <div className="form-group custon_select">
                                          <label>Description</label>
                                          <div className="modal_input">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="usr"
                                              tabIndex="4452"
                                              name="description"
                                              maxLength="35"
                                              value={this.state.description}
                                              onChange={this.handleFieldChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <div className=" col-12 col-sm-6 col-md-6 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Approver Group</label>
                                        <Select
                                          className="width-selector"
                                          value={this.state.approvalGroup}
                                          styles={_customStyles}
                                          classNamePrefix="react-select"
                                          onChange={this.handleApprovalGroup}
                                          options={this.state.approvalOptions}
                                          tabIndex="4453"
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
                                    </div>
                                    <div className=" col-12 col-sm-6 col-md-6 col-lg-3">
                                      <div className="form-group custon_select">
                                        <label>Bank Code</label>
                                        <Select
                                          className="width-selector"
                                          value={this.state.bankCode}
                                          styles={_customStyles}
                                          classNamePrefix="react-select"
                                          onChange={this.handleBankCodes}
                                          tabIndex="4454"
                                          options={this.state.bankOptions}
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
                                          {this.state.formErrors.bankCode !== ""
                                            ? this.state.formErrors.bankCode
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Dropdown
                                      alignRight="false"
                                      drop="up"
                                      className="analysis-card-dropdwn float-right mt-7"
                                    >
                                      <Dropdown.Toggle
                                        variant="sucess"
                                        id="dropdown-basic"
                                      >
                                        <img
                                          src="images/more.png"
                                          className=" img-fluid"
                                          alt="user"
                                        />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          onClick={() =>
                                            this.handleMultipleChangesModal()
                                          }
                                        >
                                          Multiple Changes
                                        </Dropdown.Item>
                                        <Dropdown.Item to="#/action-1">
                                          Supplier Distribution
                                        </Dropdown.Item>
                                        <Dropdown.Item to="#/action-2">
                                          Paste
                                        </Dropdown.Item>
                                        <Dropdown.Item to="#/action-3">
                                          Export
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                    <button
                                      className="invoice_po_transfer_btns"
                                      type="button"
                                      onClick={() =>
                                        this.openModal("openLineItemModal")
                                      }
                                      tabIndex="4456"
                                    >
                                      <img
                                        src="images/add.png"
                                        className=" img-fluid mr-2 mt-1 float-right cursorPointer"
                                        alt="user"
                                      />
                                    </button>

                                    <button
                                      className="invoice_po_transfer_btns"
                                      type="button"
                                      onClick={this.getPOTransferList}
                                      tabIndex="4455"
                                    >
                                      <span className="float-right txt-link mr-sm-3 cursorPointer">
                                        {" "}
                                        <img
                                          src="images/menu-invoice.png"
                                          className=" img-fluid mr-2"
                                          alt="user"
                                        />
                                        PO Transfer
                                      </span>
                                    </button>

                                    <div className="clearfix"></div>
                                  </div>
                                  <div className="row">
                                    <div className="col-12">
                                      <div className="login_form">
                                        <div className="login_table_list table-responsive for-dropdown-ui">
                                          <table className="table table-hover busines_unit_table shadow-remove add-new-t invoice_edit2 add-new-invoice">
                                            <thead>
                                              <tr className="busines_unit_tbl-head">
                                                <th
                                                  scope="col"
                                                  className="add-new-invoice-th1"
                                                >
                                                  <div className="col align-self-center text-center pr-0 pl-0">
                                                    <div className="form-group remember_check">
                                                      <input
                                                        type="checkbox"
                                                        id="rem_invocie_lines"
                                                        onChange={(e) =>
                                                          this.handleCheckboxesInvoiceLines(
                                                            e,
                                                            "all"
                                                          )
                                                        }
                                                      />
                                                      <label
                                                        htmlFor="rem_invocie_lines"
                                                        className="mr-0"
                                                      ></label>
                                                    </div>
                                                  </div>
                                                </th>
                                                <th
                                                  scope="col"
                                                  className="pl-0 text-left"
                                                >
                                                  PO
                                                </th>
                                                <th
                                                  className="text-left"
                                                  scope="col"
                                                >
                                                  Action
                                                </th>

                                                <th
                                                  scope="col"
                                                  className="text-left invo-d-flag-pad"
                                                >
                                                  Chart Sort
                                                </th>
                                                <th
                                                  scope="col"
                                                  className="text-left invo-d-flag-pad"
                                                >
                                                  Chart Code
                                                </th>
                                                {this.state.getDefaultValueFlags.map(
                                                  (p, i) => {
                                                    return (
                                                      <th
                                                        className={
                                                          "text-left pad-left"
                                                        }
                                                        key={i}
                                                        scope="col"
                                                      >
                                                        {p.prompt}
                                                      </th>
                                                    );
                                                  }
                                                )}
                                                <th
                                                  scope="col"
                                                  className="text-left add-new-invoice-desc"
                                                >
                                                  Description
                                                </th>
                                                <th
                                                  className="text-right new-pad-right2"
                                                  scope="col"
                                                >
                                                  Amount
                                                </th>
                                                <th
                                                  className="text-left eidt-del-icons"
                                                  scope="col"
                                                ></th>
                                                <th
                                                  className="text-left eidt-del-icons"
                                                  scope="col"
                                                ></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {this.state.invoiceLines.map(
                                                (l, i) => {
                                                  return (
                                                    <tr key={i}>
                                                      <th
                                                        scope="row"
                                                        className="add-new-invoice-th1"
                                                      >
                                                        <div className="col align-self-center text-center pr-0 pl-0">
                                                          <div className="form-group remember_check">
                                                            <input
                                                              type="checkbox"
                                                              id={
                                                                "invoiceLines" +
                                                                i
                                                              }
                                                              onChange={(e) =>
                                                                this.handleCheckboxesInvoiceLines(
                                                                  e,
                                                                  l
                                                                )
                                                              }
                                                              checked={
                                                                l.checked
                                                              }
                                                            />
                                                            <label
                                                              htmlFor={
                                                                "invoiceLines" +
                                                                i
                                                              }
                                                              className="mr-0"
                                                            ></label>
                                                          </div>
                                                        </div>
                                                      </th>
                                                      <th
                                                        scope="row "
                                                        className="desc_amount_td nill-txt uppercaseText pl-0"
                                                      >
                                                        {l.poNumber &&
                                                        l.poNumber.trim() === ""
                                                          ? "N/A"
                                                          : l.poNumber || "N/A"}
                                                      </th>
                                                      <td
                                                        width="6%"
                                                        className="desc_amount_td action_select"
                                                      >
                                                        <Select
                                                          isDisabled={
                                                            l.actionDisabled
                                                          }
                                                          className={
                                                            i == 0
                                                              ? "width-selector only--one"
                                                              : i == 1
                                                              ? "width-selector only--one"
                                                              : "width-selector"
                                                          }
                                                          value={{
                                                            label: l.action,
                                                            value: l.action,
                                                          }}
                                                          // tabIndex={l.tabIndex}
                                                          onChange={(d) =>
                                                            this.handleChangeAction(
                                                              d,
                                                              l
                                                            )
                                                          }
                                                          styles={_customStyles}
                                                          classNamePrefix="react-select"
                                                          options={
                                                            this.state.action
                                                          }
                                                          theme={(theme) => ({
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

                                                      <td className="text-left pl-0 pr-0">
                                                        <div className="modal_input width-90">
                                                          <input
                                                            type="text"
                                                            className={
                                                              l.chartSort
                                                                .length <= 5
                                                                ? " form-control wd-50 uppercaseText"
                                                                : "form-control wd-75 uppercaseText"
                                                            }
                                                            id="usr"
                                                            autoComplete="off"
                                                            name={"chartSort"}
                                                            defaultValue={
                                                              l.chartSort
                                                            }
                                                            onBlur={(e) =>
                                                              this.handleChangeField(
                                                                e,
                                                                l,
                                                                i
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                      </td>

                                                      <td className="text-left dropdown-position  pl-0">
                                                        <div className="modal_input width-90">
                                                          <input
                                                            type="text"
                                                            className={
                                                              l.chartCode
                                                                .length <= 4
                                                                ? "form-control focus_chartCode wd-45 uppercaseText"
                                                                : l.chartCode
                                                                    .length <= 8
                                                                ? "form-control focus_chartCode wd-72 uppercaseText"
                                                                : "form-control focus_chartCode wd-101 uppercaseText"
                                                            }
                                                            id="usr"
                                                            autoComplete="off"
                                                            name={"chartCode"}
                                                            value={l.chartCode}
                                                            // tabIndex={
                                                            //   l.tabIndex + 1
                                                            // }
                                                            onChange={(e) =>
                                                              this.handleChangeChartCode(
                                                                e,
                                                                l,
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
                                                                (c, i) => {
                                                                  return (
                                                                    <li
                                                                      className="cursorPointer"
                                                                      key={i}
                                                                      onClick={() =>
                                                                        this.changeChartCode(
                                                                          c,
                                                                          l
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
                                                                No Chart Code
                                                                Found
                                                              </h6>
                                                            </div>
                                                          )}
                                                        </div>
                                                      </td>

                                                      {this.state.getDefaultValueFlags.map(
                                                        (p, i) => {
                                                          return (
                                                            <td
                                                              className={
                                                                "text-left pad-left2"
                                                              }
                                                              key={i}
                                                            >
                                                              {/* {" "}
                                                            {l.flags.find(
                                                              (f) =>
                                                                f.type.toLowerCase() ===
                                                                p.type.toLowerCase()
                                                            ).value || ""}{" "} */}

                                                              <div className="modal_input">
                                                                <input
                                                                  type="text"
                                                                  className={`form-control uppercaseText flags-w${p.length}`}
                                                                  id="usr"
                                                                  autoComplete="off"
                                                                  name={p.type}
                                                                  maxLength={
                                                                    p.length
                                                                  }
                                                                  value={
                                                                    (l.flags.find(
                                                                      (f) =>
                                                                        f.type.toLowerCase() ===
                                                                        p.type.toLowerCase()
                                                                    ) &&
                                                                      l.flags.find(
                                                                        (f) =>
                                                                          f.type.toLowerCase() ===
                                                                          p.type.toLowerCase()
                                                                      )
                                                                        .value) ||
                                                                    ""
                                                                  }
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    this.handleChangeFlags(
                                                                      e,
                                                                      l
                                                                    )
                                                                  }
                                                                />
                                                              </div>
                                                            </td>
                                                          );
                                                        }
                                                      )}

                                                      <td className="text-left ani-desc_amount_td uppercaseText">
                                                        {l.type === "Service" ||
                                                        l.type ===
                                                          "Distribution" ? (
                                                          <div className="modal_input">
                                                            <input
                                                              type="text"
                                                              className="form-control uppercaseText"
                                                              id="usr"
                                                              autoComplete="off"
                                                              name={
                                                                "description"
                                                              }
                                                              defaultValue={
                                                                l.description
                                                              }
                                                              onBlur={(e) =>
                                                                this.handleChangeField(
                                                                  e,
                                                                  l,
                                                                  i
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        ) : (
                                                          <>
                                                            {l.type === "Car" ||
                                                            l.type ===
                                                              "Inventory" ||
                                                            l.type ===
                                                              "Rental/Hire" ||
                                                            l.type ===
                                                              "Hire/Rental"
                                                              ? l.typeDescription ||
                                                                ""
                                                              : l.description ||
                                                                ""}{" "}
                                                          </>
                                                        )}
                                                      </td>

                                                      <td className="text-right desc_amount_td uppercaseText">
                                                        {l.type === "Service" ||
                                                        l.type ===
                                                          "Distribution" ? (
                                                          <div className="modal_input">
                                                            <input
                                                              type="number"
                                                              className="form-control uppercaseText text-right float-right pr-0"
                                                              id="usr"
                                                              autoComplete="off"
                                                              name={"amount"}
                                                              value={l.amount}
                                                              onChange={(e) =>
                                                                this.handleChangeField(
                                                                  e,
                                                                  l,
                                                                  i
                                                                )
                                                              }
                                                              onBlur={(e) =>
                                                                this.convertTwoDecimal(
                                                                  e,
                                                                  l,
                                                                  "line"
                                                                )
                                                              }
                                                              onKeyDown={(e) =>
                                                                e.key ===
                                                                "Enter"
                                                                  ? this.convertTwoDecimal(
                                                                      e,
                                                                      l,
                                                                      "line"
                                                                    )
                                                                  : " "
                                                              }
                                                            />
                                                          </div>
                                                        ) : (
                                                          <span className="new-pad-right4">
                                                            {Number(
                                                              l.amount
                                                            ).toFixed(2) || 0.0}
                                                          </span>
                                                        )}
                                                      </td>

                                                      <td className="text-left eidt-del-icons">
                                                        <img
                                                          onClick={() =>
                                                            this.editInvoiceLine(
                                                              l
                                                            )
                                                          }
                                                          src="images/pencill.png"
                                                          className="import_icon float-left mr-1"
                                                          alt="pencill"
                                                        />
                                                      </td>

                                                      <td className="text-left eidt-del-icons">
                                                        <img
                                                          onClick={() =>
                                                            this.deleteInvoiceLine(
                                                              l
                                                            )
                                                          }
                                                          src="images/delete.svg"
                                                          className="invoice-delete-icon float-right ml-1"
                                                          alt="delete"
                                                        />
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              )}
                                              <tr>
                                                <th scope="row"></th>
                                                <th className="text-left"></th>
                                                <td></td>
                                                <td></td>
                                                <td></td>

                                                {this.state.getDefaultValueFlags.map(
                                                  (p, i) => {
                                                    return <td></td>;
                                                  }
                                                )}

                                                <td className="tbl_total_amount text-right  ">
                                                  Subtotal:
                                                </td>
                                                <td className="tbl_total_amount text-right pr-subtotal2">
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
                                  <div className="row">
                                    <div className="col-12  mt-3 mb-3">
                                      <div className="col-12 mt-2 mb-2">
                                        <div className="form-group custon_select  text-center mb-0 border-rad-5">
                                          <div id="drop-area-attach">
                                            <input
                                              type="file"
                                              id="fileElem-attach"
                                              className="form-control d-none uppercaseText"
                                              accept="application/pdf"
                                              onChange={(e) => {
                                                this.uploadAttachment(
                                                  e.target.files
                                                );
                                              }}
                                              onClick={(event) => {
                                                event.currentTarget.value =
                                                  null;
                                              }} //to upload the same file again
                                            />
                                            <label
                                              className="upload-label"
                                              htmlFor="fileElem-attach"
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

                                      {this.state.invoiceAttachments &&
                                        this.state.invoiceAttachments.length >
                                          0 &&
                                        this.state.invoiceAttachments.map(
                                          (a, i) => {
                                            return (
                                              <div
                                                key={i}
                                                className="col-md-12 mb-md-4"
                                              >
                                                <span className="del_notes">
                                                  <i
                                                    onClick={() =>
                                                      this.deleteInvoiceAttachment(
                                                        a
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
                                          }
                                        )}
                                      <div className="mt-5 s-c-main">
                                        <button
                                          type="button"
                                          className={
                                            this.state.id_save
                                              ? "btn-save ml-0 btn_focus"
                                              : "btn-save ml-0"
                                          }
                                          id="id_save"
                                          onFocus={this.onFocusButtons}
                                          onBlur={this.onBlurButtons}
                                          tabIndex={this.state.scndLstTbIndx}
                                          onClick={this.onSave}
                                        >
                                          <span className="fa fa-check"></span>
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          className={
                                            this.state.id_cancel
                                              ? "btn-save btn_focus"
                                              : "btn-save"
                                          }
                                          id="id_cancel"
                                          onClick={this.onCancel}
                                          tabIndex={this.state.lstTbIndx}
                                          onFocus={this.onFocusButtons}
                                          onBlur={this.onBlurButtons}
                                        >
                                          <span className="fa fa-ban"></span>
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* end invoice detail */}
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
        <SupplierSelectModal
          openSupplierSelectModal={this.state.openSupplierSelectModal}
          closeModal={this.closeModal}
          suppliersList={this.state.suppliersList || []}
          getSuppliersList={this.getSuppliersList}
          getSelectedSupplier={this.getSelectedSupplier} //when user select a supplier
          supplierCode={this.state.supplierCode || ""}
          props={this.props}
          stateData={this.state}
          page="addNewInvoice"
        />

        <SupplierLookup
          openSupplierLookupModal={this.state.openSupplierLookupModal}
          closeModal={this.closeModal}
          suppliersList={this.state.suppliersList || []} //array of suppliers
          getSuppliersList={this.getSuppliersList} //function to get suppliers
          supplierCode={this.state.supplierCode || ""}
          updatePOSupplier={this.getSelectedSupplier} //when user select a supplier
          props={this.props}
          stateData={this.state}
          page="addNewInvoice"
        />

        <LineItem
          openLineItemModal={this.state.openLineItemModal}
          closeModal={this.closeModal}
          modal="add-New-Invoice" //to specify which page opens Line Item Modal to change Fields accordingly
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          flags_api={this.state.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          suppliersFlags={this.state.suppliersFlags}
          clonedFlags={this.state.clonedFlags} //a copy of flags
          // updateFlags={this.updateFlags} //get updated flags from liine item modal
          getNewORUpdatedPOLine={this.getNewORUpdatedInvoiceLine} //add/edit invoice line
          poLineEditData={this.state.invoiceLineEditData} //invoice Lines for Editing
          props={this.props}
          basisOptions={this.state.basisOptions || []}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
          chartCodesList={this.state.chartCodesList || []}
        />
        <DeleteOrderDetails
          openDeleteOrderDetailModal={this.state.openDeleteOrderDetailModal}
          closeModal={this.closeModal}
          invoice={true}
          deletePOLineId={this.state.deleteInvoiceLineId} //delete invoice line id
          deletePOLine={this.deletingInvoiceLine} //delete invoice line func
        />

        <POTransfer
          openPOTransferModal={this.state.openPOTransferModal}
          closeModal={this.closeModal}
          transferList={this.state.transferList}
          clonedTransferList={this.state.clonedTransferList}
          includeZeroLinesCheck={this.state.includeZeroLinesCheck}
          includeAllSuppliersCheck={this.state.includeAllSuppliersCheck}
          poTransferSearch={this.state.poTransferSearch}
          handleFilterCheckBoxes={this.handleFilterCheckBoxes}
          action={this.state.action}
          handleChangeAction={this.handleChangeAction}
          onTransfer={this.onTransfer}
          poTransferSearchHandler={this.poTransferSearchHandler}
          onSearch={this.onSearch}
          onEnter={this.onEnter}
          handlePOTransferCheckbox={this.handlePOTransferCheckbox}
        />

        <MultipleChanges
          openMultipleChangesModal={this.state.openMultipleChangesModal}
          closeModal={this.closeModal}
          flags_api={this.props.chart.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          // taxCodes={this.props.taxCodes || ""} //api response (get tax codes)
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          handleMultipleChanges={this.handleMultipleChanges} //update invoice-lines according to multiple change modal
          lines={this.state.invoiceLines}
          getChartCodes={this.getChartCodes} //get chart codes function
          getChartSorts={this.getChartSorts} //get chart sorts function
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  invoiceData: state.invoice,
  supplier: state.supplier,
  poData: state.poData,
  chart: state.chart,
});
export default connect(mapStateToProps, {
  draftInvoice: InvoiceActions.draftInvoice,
  deleteInvoice: InvoiceActions.deleteInvoice,
  getOCRToken: InvoiceActions.getOCRToken,
  invoiceOCRLookup: InvoiceActions.invoiceOCRLookup,
  importInvoice: InvoiceActions.importInvoice,
  addTaxLines: InvoiceActions.addTaxLines,
  getInvoiceAttachments: InvoiceActions.getInvoiceAttachments,
  updateInvoice: InvoiceActions.updateInvoice,
  getSupplier: SupplierActions.getSupplier,
  getSuppliersList: SupplierActions.getSuppliersList,
  getTransferList: POActions.getTransferList,
  getDefaultValues: UserActions.getDefaultValues,
  getChartCodes: ChartActions.getChartCodes,
  getChartSorts: ChartActions.getChartSorts,
  getFlags: ChartActions.getFlags,
  getChartLayouts: ChartActions.getChartLayouts,
  addInvoiceAttachments: InvoiceActions.addInvoiceAttachments,
  deleteInvoiceAttachment: InvoiceActions.deleteInvoiceAttachment,
  clearChartStates: ChartActions.clearChartStates,
  clearUserStates: UserActions.clearUserStates,
  clearPOStates: POActions.clearPOStates,

  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearInvoiceStates: InvoiceActions.clearInvoiceStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(AddNewInvoice);
