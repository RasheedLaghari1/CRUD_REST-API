import React, { Component } from "react";
import Select from "react-select";
import Dropdown from "react-bootstrap/Dropdown";
import $ from "jquery";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import store from "../../Store/index";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import DatePicker from "react-datepicker";
import LineItem from "../Modals/LineItem/LineItem";
import ImportModal from "../Modals/ImportLines/ImportLines";
import SupplierLookup from "../Modals/SupplierLookup/SupplierLookup";
import DeleteOrderDetails from "../Modals/DeleteOrderDetail/DeleteOrderDetail";
import POTransfer from "../Modals/POTransfer/POTransfer";
import MultipleChanges from "../Modals/MultipleChanges/MultipleChanges";
import { userAvatar, _customStyles } from "../../Constants/Constants";
import * as InvoiceActions from "../../Actions/InvoiceActions/InvoiceActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import * as POActions from "../../Actions/POActions/POActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import {
  handleAPIErr,
  downloadAttachments,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";
const uuidv1 = require("uuid/v1");

class InvoiceEdit extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      tran: "", //transition# of the invoice
      suppliersList: [], //contains all suppliers by calling Get Supplier List Api
      clonedSuppliersList: [], //contains all suppliers by calling Get Supplier List Api
      supplierName: "",
      supplierCode: "",
      currency: "",
      invoiceDate: "",
      invoiceNumber: "",
      amount: "",
      receiveDate: "",
      dueDate: "",
      reference: "", //payment ref
      payDate: "", //payment date
      description: "",
      approvalGroup: "",
      approvalOptions: [],
      invoiceAttachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      invoiceLines: [],
      subTotal: 0.0,
      invoiceLineEditData: "", //contains invoice Line data for editing
      deleteInvoiceLineId: "", //contains invoice Line id for deleting
      bankCode: { label: "Select Bank", value: "" },
      bankOptions: [{ label: "Select Bank", value: "" }],
      getDefaultValueFlags: [], //get default value flags API response
      getChartCodes: "", //get chart code API response
      chartCodesList: [],
      clonedChartCodesList: [], //copy of chart codes lsit
      getFlags: "", //API response
      flags: [], //restructured flags according to select dropdown to just show in Line Items Modal ,comming from get api (tracking codes)
      clonedFlags: [], //a copy of flags
      defaultUserFlags: [], //default user flags
      suppliersFlags: [],
      getChartLayout: "",
      // po transfer
      POsToTransfer: [], //po to transfer to invoice
      transferList: [],
      clonedTransferList: [],
      poTransferSearch: "",
      includeZeroLinesCheck: false,
      includeAllSuppliersCheck: false,
      openImportLinesModal: false,
      // end
      // receivedDateCheck: false,
      descriptionCheck: true,
      paymentReferenceCheck: false,
      paymentDateCheck: false,
      openLineItemModal: false,
      openSupplierLookupModal: false,
      openDeleteOrderDetailModal: false,
      openPOTransferModal: false,
      openMultipleChangesModal: false,
      action: [
        { label: "Clear", value: "Clear" },
        { label: "Subtract", value: "Subtract" },
        { label: "Ignore", value: "Ignore" },
      ],
      basisOptions: [],
      formErrors: {
        supplierCode: "",
        invoiceNumber: "",
        invoiceDate: "",
        bankCode: "",
      },
      editName: false, //check when supplier name is going to edit
      activeAtchID: "",
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
      //to set state after comming from the new Supplier page(it is because we don't have to call all APIs again)
      if (state.isNew) {
        //create supplier case
        this.setState({ ...state.stateData, isLoading: false }, () => {
          let { invoiceLines } = this.state;
          invoiceLines.map((l, i) => {
            //to assign every line a unique id
            l.id = uuidv1();
            l.checked = false;
            // l.tabIndex = 3346 + i * 2;

            // if (!l.poNumber.trim()) {
            //   l.actionDisabled = true;
            // } else {
            //   l.actionDisabled = false;
            // }

            return l;
          });
          this.setState(
            {
              invoiceLines,
              isLoading: false,
              openSupplierLookupModal: false,
              formErrors: {
                supplierCode: "",
              },
              editName: false,
            },
            () => this.getSupplier()
          );
        });
      } else {
        //when user clicks on discard button

        this.setState({ ...state.stateData, isLoading: false }, () => {
          let { invoiceLines } = this.state;
          invoiceLines.map((l, i) => {
            //to assign every line a unique id
            l.id = uuidv1();
            l.checked = false;
            // l.tabIndex = 3346 + i * 2;

            // if (!l.poNumber.trim()) {
            //   l.actionDisabled = true;
            // } else {
            //   l.actionDisabled = false;
            // }

            return l;
          });
          this.setState({
            invoiceLines,
            isLoading: false,
            openSupplierLookupModal: false,
          });
        });
      }
    } else {
      let tran =
        (this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.tran) ||
        "";
      if (tran) {
        //update Invoice case
        this.setState({ tran, isLoading: true, attachmentSize: 0 });
        let promises = [];

        promises.push(this.getInvoice(tran));

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
        promises.push(this.getChartCodes("", "all"));

        promises.push(this.getSuppliersList());

        await Promise.all(promises);
        let {
          flags,
          clonedFlags,
          getFlags,
          getDefaultValueFlags,
          defaultUserFlags,
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

        this.props.clearInvoiceStates();
        this.props.clearPOStates();
        this.props.clearChartStates();
        this.props.clearUserStates();
        this.props.clearSupplierStates();
        this.setState({
          isLoading: false,
          flags,
          clonedFlags,
          getFlags,
          defaultUserFlags,
          getDefaultValueFlags,
        });
        this.getSupplier();
      } else {
        this.props.history.push("/invoice");
      }
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-attach", this.uploadAttachment);
  }

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
    let { activeAtchID, primDocName } = this.state;
    this.setState({ isLoading: true });
    let { tran } = this.state;
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

        if (invoiceAttachments.length === 1) {
          activeAtchID = invoiceAttachments[0].recordID;
          primDocName = invoiceAttachments[0].fileName;
        }

        this.setState({
          invoiceAttachments,
          attachmentSize,
          activeAtchID,
          primDocName,
        });
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

  //delete invoice attachemnt
  deleteInvoiceAttachment = async (attach) => {
    let { attachmentSize } = this.state;
    this.setState({ isLoading: true });
    let recordID = attach.recordID || "";

    await this.props.deleteInvoiceAttachment(recordID);
    if (this.props.invoiceData.deleteInvoiceAttachmentSuccess) {
      toast.success(this.props.invoiceData.deleteInvoiceAttachmentSuccess);
      let invoiceAttachments = this.state.invoiceAttachments || [];

      let { primDocName, activeAtchID } = this.state;

      let filteredInvoiceAttachments = invoiceAttachments.filter(
        (a) => a.recordID != recordID
      );
      if (recordID === activeAtchID) {
        primDocName = "";
        activeAtchID = "";
      }

      attachmentSize = Number(attachmentSize) - Number(attach.fileSize);
      this.setState({
        invoiceAttachments: filteredInvoiceAttachments,
        attachmentSize,
        primDocName,
        activeAtchID,
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

  //getting the single invoice
  getInvoice = async (tran) => {
    await this.props.getInvoice(tran); // get Invocie
    //success case of getInvoice
    if (this.props.invoiceData.getInvoiceSuccess) {
      // toast.success(this.props.invoiceData.getInvoiceSuccess);

      let invoice =
        (this.props.invoiceData.getInvoice &&
          this.props.invoiceData.getInvoice.invoice &&
          JSON.parse(
            JSON.stringify(this.props.invoiceData.getInvoice.invoice)
          )) ||
        "";

      let approvalOptions =
        (invoice && JSON.parse(JSON.stringify(invoice.approvalOptions))) || [];
      let approvalOpt = [];

      approvalOptions.map((a, i) => {
        approvalOpt.push({ label: a.groupName, value: a.groupName });
      });

      let lines = (invoice && invoice.lines) || [];
      let subTotal = 0;
      lines.map((l, i) => {
        //to assign every line a unique id
        l.id = uuidv1();
        l.checked = false;
        //assigning dynamically tabIndex to Invoice Lines
        // l.tabIndex = 3346 + i * 2;
        l.amount = Number(l.amount).toFixed(2) || 0.0;
        subTotal = Number(subTotal) + Number(l.amount);

        // if (!l.poNumber.trim()) {
        //   l.actionDisabled = true;
        // } else {
        //   l.actionDisabled = false;
        // }

        return l;
      });

      let basisOptions = (invoice && invoice.basisOptions) || [];

      let bankCode = (invoice && invoice.bankCode) || "";
      let bankOptions = (invoice && invoice.bankOptions) || [];

      let bnkOptns = [{ label: "Select Bank", value: "" }];
      bankOptions.map((b, i) => {
        bnkOptns.push({
          label: b.code + " " + b.description,
          value: b.code,
        });
      });
      let amount = Number(invoice.amount).toFixed(2) || 0.0;

      let invoiceAttachments = (invoice && invoice.attachments) || [];
      let attachmentSize = 0;
      invoiceAttachments.map((a, i) => {
        attachmentSize += Number(a.fileSize) || 0;
      });

      let primDocName = "";
      let activeAtchID = "";
      let isPrim = invoiceAttachments.find(
        (a) => a.primaryDoc.toLowerCase() === "y"
      );
      console.log("isPrim", isPrim);
      primDocName = isPrim ? isPrim.fileName : "";
      activeAtchID = isPrim ? isPrim.recordID : "";

      this.setState({
        tran,
        invoiceAttachments: (invoice && invoice.attachments) || [],
        attachmentSize,
        primDocName,
        activeAtchID,
        invoiceLines: lines,
        subTotal: Number(subTotal).toFixed(2),
        supplierName: invoice.supplierName || "",
        supplierCode: invoice.supplierCode || "",
        currency: invoice.currency || "",
        invoiceDate:
          Number(invoice.invoiceDate) == 0
            ? ""
            : Number(invoice.invoiceDate) || "",
        invoiceNumber: invoice.invoiceNumber || "",
        amount: amount,
        receiveDate:
          Number(invoice.receiveDate) == 0
            ? ""
            : Number(invoice.receiveDate) || "",
        dueDate:
          Number(invoice.dueDate) == 0 ? "" : Number(invoice.dueDate) || "",
        reference: invoice.reference || "",
        payDate:
          Number(invoice.payDate) == 0 ? "" : Number(invoice.payDate) || "",
        description: invoice.description || "",
        approvalGroup:
          { label: invoice.approvalGroup, value: invoice.approvalGroup } || "",
        approvalOptions: approvalOpt,
        basisOptions,
        bankCode: { label: bankCode, value: bankCode },
        bankOptions: bnkOptns,
      });
    }
    //error case of get invoice
    if (this.props.invoiceData.getInvoiceError) {
      handleAPIErr(this.props.invoiceData.getInvoiceError, this.props);
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

  getSelectedSupplier = async (supplier) => {
    let { formErrors } = this.state;
    let supplierName = supplier.name;
    let supplierCode = supplier.code;
    let currency = supplier.currency;
    this.setState(
      {
        supplierName,
        supplierCode,
        currency,
        editName: false,
        clonedSuppliersList: [],
      },
      async () => {
        formErrors = Validation.handleValidation(
          "supplierCode",
          supplierCode,
          formErrors
        );
        this.setState({ isLoading: true, formErrors });
        await this.onUpdateInvoiceSupplier();
        this.setState({ isLoading: false });
      }
    );
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

  //handle change invoice lines fields
  handleChangeLineField = (e, line, i) => {
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

  onBlur = (i) => {
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

  //add/update invoice Lines
  getNewORUpdatedInvoiceLine = (invoiceLine) => {
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
          // l.tabIndex = 3346 + i * 2;
          subTotal = Number(subTotal) + Number(l.amount);
          // if (!l.poNumber.trim()) {
          //   l.actionDisabled = true;
          // } else {
          //   l.actionDisabled = false;
          // }
          return l;
        });

        this.setState({ invoiceLines, subTotal });
      }
    } else {
      //add case
      let { invoiceLines } = this.state;
      invoiceLine.id = uuidv1();
      invoiceLine.poUpdated = "newLine"; //change 'newLine' to 'N' in update invoice request

      invoiceLines.push(invoiceLine);

      let subTotal = 0;
      invoiceLines.map((l, i) => {
        //to assign every line a unique id
        l.id = uuidv1();
        l.checked = false;
        // l.tabIndex = 3346 + i * 2;
        subTotal = Number(subTotal) + Number(l.amount);

        // if (!l.poNumber.trim()) {
        //   l.actionDisabled = true;
        // } else {
        //   l.actionDisabled = false;
        // }

        return l;
      });
      this.setState({ invoiceLines, subTotal });
    }
  };

  //edit invoice lines
  editInvoiceLine = (data) => {
    if (data.type && data.type.trim()) {
      this.setState({ invoiceLineEditData: data }, () =>
        this.openModal("openLineItemModal")
      );
    }
  };

  //delete invoice line
  deleteInvoiceLine = (line) => {
    this.setState({ deleteInvoiceLineId: line.id }, () =>
      this.openModal("openDeleteOrderDetailModal")
    );
  };

  deletingInvoiceLine = async (id) => {
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

  handleFieldChange = (e) => {
    let { formErrors } = this.state;
    let { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  convertTwoDecimal = (e, line, check) => {
    let nam = e.target.name;
    let val = Number(e.target.value).toFixed(2) || 0.0;

    if (check === "line") {
      let { invoiceLines } = this.state;
      line["amount"] = val;

      // calculation(subTotal)
      let subTotal = 0.0;
      let lines = JSON.parse(JSON.stringify(invoiceLines));
      lines.map((l) => {
        subTotal = Number(subTotal) + Number(l.amount);
      });

      this.setState({
        subTotal: Number(subTotal).toFixed(2),
        invoiceLines,
      });
    } else {
      this.setState({ amount: val });
    }
  };

  handleCheckBoxes = (name) => {
    this.setState((state) => ({ [name]: !state[name] }));
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
  };

  handleCheckboxesInvoiceLines = (e, line) => {
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
  handleMultipleChanges = (data) => {
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
        // toast.success(this.props.poData.getTransferListSuccess);
        let transferList = this.props.poData.getTransferList || [];

        transferList.map((l, i) => {
          l.id = uuidv1();
          l.action = "Clear";
          l.checked = false;
          l.poUpdated = "newLine"; //change 'newLine' to 'N' in update invoice request
          return l;
        });
        this.setState(
          {
            transferList,
            clonedTransferList: transferList,
            POsToTransfer: [],
          },
          () => this.openModal("openPOTransferModal")
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

  handleFilterCheckBoxes = (name) => {
    this.setState((state) => ({ [name]: !state[name] }));
    this.getPOTransferList();
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

  handlePOTransferCheckbox = (e, data) => {
    let { POsToTransfer, transferList } = this.state;

    if (e.target.checked) {
      if (data === "all") {
        transferList.map((l, i) => {
          l.checked = true;

          return l;
        });
        this.setState({ POsToTransfer: [...transferList] });
      } else {
        transferList.map((l, i) => {
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
        transferList.map((l, i) => {
          l.checked = false;

          return l;
        });
        this.setState({ POsToTransfer: [] });
      } else {
        transferList.map((l, i) => {
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

      this.state.invoiceLines.push(...POsToTransfer);

      let { invoiceLines } = this.state;
      let subTotal = 0.0;

      invoiceLines.map((l, i) => {
        //to assign every line a unique id
        l.id = uuidv1();
        l.checked = false;
        l.amount = Number(l.amount).toFixed(2) || 0.0;

        // l.tabIndex = 3346 + i * 2;

        // if (!l.poNumber.trim()) {
        //   l.actionDisabled = true;
        // } else {
        //   l.actionDisabled = false;
        // }

        // calculation(subTotal)
        subTotal = Number(subTotal) + Number(l.amount);

        return l;
      });

      this.setState({
        invoiceLines,
        subTotal: Number(subTotal).toFixed(2),
        openPOTransferModal: false,
        approvalGroup,
      });
    } else {
      toast.error("Please Select PO Line First to Transfer!");
    }
  };

  // ***********END***************
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

  //when clcik on Paste/Import from menue item
  importInvoiceLines = async (importData) => {
    this.setState({ isLoading: true });
    if (importData) {
      await this.props.importInvoiceLines(importData);
    }

    //success case of Paste/Import Invoice Lines

    if (this.props.invoiceData.importInvoicLineseSuccess) {
      // toast.success(this.props.invoiceData.importInvoicLineseSuccess);
    }

    //error case of Paste/Import Invoice Lines
    if (this.props.invoiceData.importInvoicLineseError) {
      handleAPIErr(this.props.invoiceData.importInvoicLineseError, this.props);
    }

    this.setState({ isLoading: false });
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

  //when clcik on Export from menue item
  exportInvoiceLines = async () => {
    this.setState({ isLoading: true });
    let { invoiceLines } = this.state;
    await this.props.exportInvoiceLines(invoiceLines);

    //success case of export Invoice Lines

    if (this.props.invoiceData.exportInvoiceLinesSuccess) {
      // toast.success(this.props.invoiceData.exportInvoiceLinesSuccess);
      let attachemnt = this.props.invoiceData.exportInvoiceLines || "";
      if (attachemnt) {
        window.location.href =
          "data:application/vnd.ms-excel;base64," + attachemnt;
      }
    }

    //error case of export Invoice Lines
    if (this.props.invoiceData.exportInvoiceLinesError) {
      handleAPIErr(this.props.invoiceData.exportInvoiceLinesError, this.props);
    }

    this.setState({ isLoading: false });
  };

  handleChangeSupplierName = async (e) => {
    let { formErrors } = this.state;
    $(".invoice_vender_menu1").show();

    let value = e.target.value;

    formErrors.supplierCode = "This Field is Required.";

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

  //create supplier when click on + when supplier inline editing
  addSupplier = () => {
    this.props.history.push("/new-supplier2", {
      stateData: this.state,
      page: "editInvoice",
      supplierName: this.state.supplierName,
    });
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
      bankCode,
      dueDate,
      amount,
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
        if (l.poUpdated === "newLine") {
          l.poUpdated = "N";
        }
        l.description = l.description.toUpperCase();
        return l;
      });

      this.setState({ isLoading: true });
      let data = {
        tran,
        invoiceDetails: {
          currency,
          supplier: supplierCode, //suplier code
          invoiceDate,
          invoiceNumber,
          bankCode: bankCode.value,
          dueDate,
          amount,
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

      this.updatePrimaryInvoice();
    }

    this.setState({
      formErrors: formErrors,
    });
  };

  updatePrimaryInvoice = async () => {
    let { tran, activeAtchID } = this.state;
    if (activeAtchID) {
      await this.props.updatePrimaryDocument(tran, activeAtchID);
      if (this.props.invoiceData.updatePrimaryDocumentSuccess) {
        toast.success(this.props.invoiceData.updatePrimaryDocumentSuccess);
      }
      if (this.props.invoiceData.updatePrimaryDocumentError) {
        handleAPIErr(
          this.props.invoiceData.updatePrimaryDocumentError,
          this.props
        );
      }
    }
  };

  onCancel = () => {
    /*When  Edit and Invoice or Order  and then user Save or Cancel that edit, 
        then load the same Invoice or Order user just edited?.*/
    this.props.history.push("/invoice", {
      tallies: "Draft",
      editInvoiceCheck: true,
      editInvoiceTran: this.state.tran,
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

  render() {
    let { activeAtchID, primDocName } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} editInvoice={true} />
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
                        {/* <img src="images/image6.png" className=" img-fluid" alt="user" />  */}

                        <div className="container p-0">
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
                                      className="pt-2"
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
                                      >
                                        <div
                                          className="pr-0"
                                          // onClick={() =>
                                          //   this.handleCheckBoxes(
                                          //     "receivedDateCheck"
                                          //   )
                                          // }
                                        >
                                          <div className="form-group remember_check mm_check4">
                                            <input
                                              type="checkbox"
                                              id="receivedDateCheck"
                                              name="receivedDateCheck"
                                              checked={
                                                this.state.receivedDateCheck
                                              }
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
                                          <div className="form-group remember_check mm_check4">
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
                                          <div className="form-group remember_check mm_check4">
                                            <input
                                              type="checkbox"
                                              id="paymentReferenceCheck"
                                              name="paymentReferenceCheck"
                                              checked={
                                                this.state.paymentReferenceCheck
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
                                      <label htmlFor="id_vndr">Supplier</label>
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control focus_vender"
                                          id="id_vndr"
                                          tabIndex="3333"
                                          autoFocus={true}
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
                                      {this.state.formErrors.supplierCode !== ""
                                        ? this.state.formErrors.supplierCode
                                        : ""}
                                    </div>
                                  </div>

                                  <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="form-group custon_select">
                                      <label htmlFor="id_dt">Date</label>
                                      <div className="modal_input datePickerUP">
                                        <DatePicker
                                          name="invoiceDate"
                                          selected={this.state.invoiceDate}
                                          id="id_dt"
                                          tabIndex="3334"
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
                                      <label htmlFor="id_invc">Invoice</label>
                                      <div className="modal_input">
                                        <input
                                          type="text"
                                          className="form-control"
                                          id="id_invc"
                                          tabIndex="3335"
                                          name="invoiceNumber"
                                          value={this.state.invoiceNumber}
                                          onChange={this.handleFieldChange}
                                        />
                                      </div>
                                      <div className="text-danger error-12">
                                        {this.state.formErrors.invoiceNumber !==
                                        ""
                                          ? this.state.formErrors.invoiceNumber
                                          : ""}
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="form-group custon_select">
                                      <label htmlFor="id_amt">Amount</label>
                                      <div className="modal_input">
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="id_amt"
                                          tabIndex="3336"
                                          name="amount"
                                          value={this.state.amount}
                                          onBlur={this.convertTwoDecimal}
                                          onChange={this.handleFieldChange}
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
                                          tabIndex="3337"
                                          onChange={d =>
                                            this.handleDateChange(
                                              d,
                                              "receiveDate"
                                            )
                                          }
                                            dateFormat="d MMM yyyy"
                                            autoComplete='off'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )} */}

                                  <div className=" col-12 col-sm-6 col-md-4 col-lg-3">
                                    <div className="form-group custon_select">
                                      <label htmlFor="id_duDate">
                                        Due Date
                                      </label>
                                      <div className="modal_input datePickerUP">
                                        <DatePicker
                                          name="dueDate"
                                          selected={this.state.dueDate}
                                          id="id_duDate"
                                          tabIndex="3338"
                                          onKeyDown={(e) => {
                                            if (e.key == "Tab") {
                                              this.closeDatePicker();
                                            }
                                          }}
                                          onChange={(d) =>
                                            this.handleDateChange(d, "dueDate")
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
                                            id="usr"
                                            name="reference"
                                            tabIndex="3339"
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
                                        <label htmlFor="id_payDate">
                                          Payment Date
                                        </label>
                                        <div className="modal_input datePickerUP">
                                          <DatePicker
                                            name="payDate"
                                            selected={this.state.payDate}
                                            id="id_payDate"
                                            tabIndex="3340"
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
                                        <label htmlFor="id_desc">
                                          Description
                                        </label>
                                        <div className="modal_input">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="id_desc"
                                            tabIndex="3341"
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
                                      <label htmlFor="id_aprlGroup">
                                        Approver Group
                                      </label>
                                      <Select
                                        className="width-selector"
                                        value={this.state.approvalGroup}
                                        // classNamePrefix="custon_select-selector-inner"
                                        styles={_customStyles}
                                        classNamePrefix="react-select"
                                        onChange={this.handleApprovalGroup}
                                        options={this.state.approvalOptions}
                                        id="id_aprlGroup"
                                        tabIndex="3342"
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
                                      <label htmlFor="id_bnkCode">
                                        Bank Code
                                      </label>
                                      <Select
                                        className="width-selector"
                                        value={this.state.bankCode}
                                        styles={_customStyles}
                                        classNamePrefix="react-select"
                                        onChange={this.handleBankCodes}
                                        options={this.state.bankOptions}
                                        id={"id_bnkCode"}
                                        tabIndex="3343"
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
                                        className="img-fluid"
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
                                      <Dropdown.Item
                                      // onClick={() =>
                                      //   this.openModal("openImportLinesModal")
                                      // }
                                      >
                                        Paste
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        // onClick={this.exportInvoiceLines}
                                        to="#/action-3"
                                      >
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
                                    tabIndex="3345"
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
                                    tabIndex="3344"
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
                                      <div className="login_table_list table-responsive invoice_edit_table for-dropdown-ui">
                                        <table className="table busines_unit_table order-table shadow-remove add-new-t tab-1-line inv--edit invoice_edit2 inv-edit-page">
                                          <thead>
                                            <tr className="busines_unit_tbl-head">
                                              <th scope="col" className="pr-0">
                                                <div className="col align-self-center text-center pr-0">
                                                  <div className="form-group remember_check mm_check8">
                                                    <input
                                                      type="checkbox"
                                                      id="remember_invocie_lines"
                                                      onChange={(e) =>
                                                        this.handleCheckboxesInvoiceLines(
                                                          e,
                                                          "all"
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      htmlFor="remember_invocie_lines"
                                                      className="mr-0"
                                                    ></label>
                                                  </div>
                                                </div>
                                              </th>
                                              <th className="pl-0" scope="col">
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
                                                className="text-left"
                                                scope="col"
                                              ></th>
                                              <th
                                                className="text-left"
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
                                                      className="pr-0"
                                                    >
                                                      <div className="col align-self-center text-center pr-0">
                                                        <div className="form-group remember_check mm_check8">
                                                          <input
                                                            type="checkbox"
                                                            id={
                                                              "invoiceLines" + i
                                                            }
                                                            onChange={(e) =>
                                                              this.handleCheckboxesInvoiceLines(
                                                                e,
                                                                l
                                                              )
                                                            }
                                                            checked={l.checked}
                                                          />
                                                          <label
                                                            htmlFor={
                                                              "invoiceLines" + i
                                                            }
                                                            className="mr-0"
                                                          ></label>
                                                        </div>
                                                      </div>
                                                    </th>
                                                    <th
                                                      scope="row"
                                                      className="desc_amount_td nill-txt pl-0"
                                                    >
                                                      {l.poNumber &&
                                                      l.poNumber.trim() === ""
                                                        ? "N/A"
                                                        : l.poNumber || "N/A"}
                                                    </th>
                                                    <td
                                                      width="10%"
                                                      className="action_select2"
                                                    >
                                                      <Select
                                                        isDisabled={
                                                          l.poNumber ===
                                                            "N/A" ||
                                                          l.poNumber === ""
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
                                                        tabIndex={l.tabIndex}
                                                        onChange={(d) =>
                                                          this.handleChangeAction(
                                                            d,
                                                            l
                                                          )
                                                        }
                                                        classNamePrefix="react-select"
                                                        styles={_customStyles}
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
                                                            primary: "#f2f2f2",
                                                          },
                                                        })}
                                                      />
                                                    </td>
                                                    <td className="text-left edit-chart-sort-td">
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
                                                            this.handleChangeLineField(
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
                                                            this.onBlur(i)
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
                                                                    ).value) ||
                                                                  ""
                                                                }
                                                                onChange={(e) =>
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

                                                    <td className=" text-left desc_detail_td uppercaseText">
                                                      {l.type === "Service" ||
                                                      l.type ===
                                                        "Distribution" ? (
                                                        <div className="modal_input">
                                                          <input
                                                            type="text"
                                                            className="form-control uppercaseText"
                                                            id="usr"
                                                            autoComplete="off"
                                                            name={"description"}
                                                            defaultValue={
                                                              l.description
                                                            }
                                                            onBlur={(e) =>
                                                              this.handleChangeLineField(
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
                                                              this.handleChangeLineField(
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
                                                              e.key === "Enter"
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
                                                        className="import_icon float-left mr-1 cursorPointer"
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
                                                        className=" invoice-delete-icon import_icon float-right ml-1 cursorPointer"
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
                                  <div className="col-12 mb-3">
                                    <div className="forgot_body">
                                      <div className="col-12 mt-2">
                                        <div className="form-group custon_select">
                                          <div
                                            id="drop-area-attach"
                                            className="exp_drag_area"
                                          >
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
                                          <div className="exp_upload_files">
                                            <ul className="doc-upload-ul">
                                              {this.state.invoiceAttachments &&
                                                this.state.invoiceAttachments
                                                  .length > 0 &&
                                                this.state.invoiceAttachments.map(
                                                  (a, i) => {
                                                    return (
                                                      <li
                                                        className={
                                                          a.recordID ===
                                                          activeAtchID
                                                            ? "green_li cursorPointer"
                                                            : "blue_li cursorPointer"
                                                        }
                                                      >
                                                        <div className="pdf-custom-radio">
                                                          <label
                                                            className="check_main remember_check"
                                                            htmlFor={`att` + i}
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              className="custom-control-input"
                                                              id={`att` + i}
                                                              name="check"
                                                              checked={
                                                                a.recordID ===
                                                                activeAtchID
                                                              }
                                                              onChange={() => {
                                                                this.setState({
                                                                  activeAtchID:
                                                                    a.recordID,
                                                                  primDocName:
                                                                    a.fileName ||
                                                                    "",
                                                                });
                                                              }}
                                                            />
                                                            <span className="click_checkmark"></span>
                                                          </label>
                                                        </div>

                                                        <span className="fa fa-file"></span>
                                                        <p
                                                          className={
                                                            this.state
                                                              .activePDF ===
                                                            a.recordID
                                                              ? "text-danger"
                                                              : ""
                                                          }
                                                          // onClick={() =>
                                                          //   this.showPDF(a)
                                                          // }
                                                          onClick={() =>
                                                            this.getAttachment(
                                                              a.recordID,
                                                              a.fileName
                                                            )
                                                          }
                                                        >
                                                          {a.fileName || ""}
                                                        </p>
                                                        <span
                                                          // onClick={() => {
                                                          //   this.deleteAttachment(
                                                          //     a
                                                          //   );
                                                          // }}
                                                          onClick={() =>
                                                            this.deleteInvoiceAttachment(
                                                              a
                                                            )
                                                          }
                                                          className="fa fa-times"
                                                        ></span>
                                                      </li>
                                                    );
                                                  }
                                                )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="exp_radio_pad">
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label>
                                                Primary Document:
                                                {primDocName && (
                                                  <p className="doc-primary-box">
                                                    {primDocName}
                                                  </p>
                                                )}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div
                                    // className="mt-5 s-c-main"
                                    className="col d-flex justify-content-end s-c-main w-sm-100"
                                  >
                                    <button
                                      type="button"
                                      className={
                                        this.state.id_save
                                          ? "btn-save ml-0 btn_focus"
                                          : "btn-save ml-0"
                                      }
                                      id="id_save"
                                      tabIndex={"3346"}
                                      onFocus={this.onFocusButtons}
                                      onBlur={this.onBlurButtons}
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
                                      tabIndex={"3347"}
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
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
          </div>
          {/* end */}
        </div>

        <LineItem
          openLineItemModal={this.state.openLineItemModal}
          closeModal={this.closeModal}
          modal="invoice-edit" //to specify which page opens Line Item Modal to change Fields accordingly
          chartSorts={this.props.chart.getChartSorts || ""} //api response (get chart sort)
          chartCodes={this.state.chartCodesList || []} //api response (all chart codes)
          flags_api={this.state.getFlags} //flags comming from get flags api
          flags={this.state.flags} //restructured flags accordings to requirements
          clonedFlags={this.state.clonedFlags} //a copy of flags
          suppliersFlags={this.state.suppliersFlags}
          // updateFlags={this.updateFlags} //get updated flags from liine item modal
          getNewORUpdatedPOLine={this.getNewORUpdatedInvoiceLine} //add/edit invoice line
          poLineEditData={this.state.invoiceLineEditData} //invoice Lines for Editing
          props={this.props}
          page="invoiceEditPage"
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
        <SupplierLookup
          openSupplierLookupModal={this.state.openSupplierLookupModal}
          closeModal={this.closeModal}
          suppliersList={this.state.suppliersList || []} //array of suppliers
          getSuppliersList={this.getSuppliersList} //function to get suppliers
          supplierCode={this.state.supplierCode || ""}
          updatePOSupplier={this.getSelectedSupplier}
          props={this.props}
          stateData={this.state}
          page="editInvoice"
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
        <ImportModal
          openImportLinesModal={this.state.openImportLinesModal}
          closeModal={this.closeModal}
          importLines={this.importInvoiceLines}
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
  getInvoice: InvoiceActions.getInvoice,
  updateInvoice: InvoiceActions.updateInvoice,
  updatePrimaryDocument: InvoiceActions.updatePrimaryDocument,
  addInvoiceAttachments: InvoiceActions.addInvoiceAttachments,
  deleteInvoiceAttachment: InvoiceActions.deleteInvoiceAttachment,
  getInvoiceAttachments: InvoiceActions.getInvoiceAttachments,
  importInvoiceLines: InvoiceActions.importInvoiceLines,
  exportInvoiceLines: InvoiceActions.exportInvoiceLines,
  getSuppliersList: SupplierActions.getSuppliersList,
  getSupplier: SupplierActions.getSupplier,
  getDefaultValues: UserActions.getDefaultValues,
  getChartCodes: ChartActions.getChartCodes,
  getChartSorts: ChartActions.getChartSorts,
  getFlags: ChartActions.getFlags,
  getTransferList: POActions.getTransferList,
  clearPOStates: POActions.clearPOStates,
  clearChartStates: ChartActions.clearChartStates,
  clearUserStates: UserActions.clearUserStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearInvoiceStates: InvoiceActions.clearInvoiceStates,
})(InvoiceEdit);
