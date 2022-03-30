import React, { Component } from "react";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import Select from "react-select";
import _ from "lodash";
import DatePicker from "react-datepicker";
import "./ExpenseForm.css";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import { connect } from "react-redux";
import store from "../../Store/index";
import { userAvatar, _customStyles } from "../../Constants/Constants";
import SupplierLookup from "../Modals/SupplierLookup/SupplierLookup";
import * as ExpenseActions from "../../Actions/ExpenseActions/ExpenseActions";
import * as SupplierActions from "../../Actions/SupplierActtions/SupplierActions";
import * as ChartActions from "../../Actions/ChartActions/ChartActions";
import * as UserActions from "../../Actions/UserActions/UserActions";
import {
  handleAPIErr,
  downloadAttachments,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";

class ExpenseForm extends Component {
  constructor() {
    super();
    this.myRef = React.createRef();

    this.state = {
      isLoading: false,
      tran: "",
      //Details Card
      expenseType: { label: "Select Type", value: "" },
      expenseTypeOptions: [],
      expenseCode: { label: "Select Code", value: "" },
      codeOptions: [],
      supplierName: "",
      supplierCode: "",
      suppliersList: [],
      clonedSuppliersList: [], //contains all suppliers by calling Get Supplier List Api
      currency: "",
      date: "",
      envelope: "",
      accountedAmount: 0.0,
      advancedAmount: 0.0,
      approverGroup: { label: "Select Approver Group", value: "" },
      approverOptions: [],
      //Car Info Card
      driver: "",
      rego: "",
      vehicle: "",
      reference: "",
      businessPercent: "",
      exempt: false,
      //Third card Info
      float: 0.0,
      gross: 0.0,
      tax: 0.0,
      amount: 0.0,
      docAmount: 0.0,
      //Expense Items
      expenseItems: [],
      checkAllExpItem: false,
      addTaxLinesCheck: true, //call add tax lines only one time when user enters in advanced amount
      //Log Book
      logBook: [],
      checkAllLogBook: false,
      //Vehicle Log
      vehicleLog: [],
      checkAllVehicleLog: false,
      //attachments
      attachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      primDocName: "", //name of the primary document

      //tax codes
      taxCodes: [],
      //get chart codes
      chartCodesList: [],
      clonedChartCodesList: [],
      defaultUserFlags: [], //default user flags
      //supplier's flags
      suppliersFlags: [],

      formErrors: {
        expenseType: "",
        expenseCode: "",
        supplierCode: "",
        approverGroup: "",
      },
      openSupplierLookupModal: false,
    };
  }

  async componentDidMount() {
    window.addEventListener(
      "resize",
      () => {
        // calculatin the margin for the chart code suggestion box
        this.calcMrgnForSuggestion();
      },
      false
    );

    //adding drag and drop attachments listeners
    addDragAndDropFileListners("drop-area-exp", this.uploadAttachment);
    //end

    $(document).ready(function () {
      $(".focus_vender").focusout(function () {
        setTimeout(() => {
          $(".invoice_vender_menu1").hide();
        }, 700);
      });
    });

    $(".sideBarAccord").click(function () {
      $(this).toggleClass("rorate_0");
    });

    let state =
      this.props.history.location && this.props.history.location.state;
    if (state && state.stateData) {
      //to set state after comming from the creating new supplier page(it is because we don't have to call all APIs again)
      this.setState(
        {
          ...state.stateData,
          isLoading: false,
          openSupplierLookupModal: false,
          formErrors: {
            expenseType: "",
            expenseCode: "",
            supplierCode: "",
            approverGroup: "",
          },
        },
        () => {
          let { supplierCode, currency } = state.stateData;
          if (supplierCode && currency) {
            //to get suppliers flags
            this.getSupplier(supplierCode, currency);
          }
        }
      );
    } else {
      //Add/Edit Expense case
      let tran =
        (this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.tran) ||
        "";
      let check = false;
      if (tran && tran === "insertExpense") {
        //insert Expense case
        await this.insertExpense(); //insert Expense
        check = true;
      } else if (tran) {
        //update Expense case
        this.setState({
          tran,
          attachmentSize: 0,
        });
        await this.getExpense(tran);
        check = true;
      } else {
        this.props.history.push("/expenses");
      }

      let isDefaultValues = false;
      let promises = [];
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
      if (check) {
        promises.push(this.getSuppliersList());
        promises.push(this.getTaxCodes());
        promises.push(this.getChartCodes());

        await Promise.all(promises);
      }

      //success case of get default vaues
      if (this.props.user.getDefaultValuesSuccess || isDefaultValues) {
        // toast.success(this.props.user.getDefaultValuesSuccess);
        let defaultUserFlags =
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
        this.setState({ defaultUserFlags: _flags });
      }
      //error case of get default vaues
      if (this.props.user.getDefaultValuesError) {
        handleAPIErr(this.props.user.getDefaultValuesError, this.props);
      }

      this.calcMrgnForSuggestion();
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-exp", this.uploadAttachment);
  }

  //Get Expense
  getExpense = async (tran) => {
    if (tran) {
      this.setState({
        isLoading: true,
      });
      await this.props.getExpenseDetail(tran); // get expense
      //success case of get expense
      if (this.props.expenseData.getExpenseDetailSuccess) {
        // toast.success(this.props.expenseData.getExpenseDetailSuccess);

        let expDetails =
          (this.props.expenseData.getExpenseDetail &&
            this.props.expenseData.getExpenseDetail &&
            JSON.parse(
              JSON.stringify(this.props.expenseData.getExpenseDetail)
            )) ||
          "";

        let tran = (expDetails && expDetails.tran) || "";
        //Details Card
        let expenseType =
          expDetails && expDetails.expenseType
            ? { label: expDetails.expenseType, value: expDetails.expenseType }
            : { label: "Select Type", value: "" };
        let expenseTypeOptions =
          (expDetails && expDetails.expenseTypeOptions) || [];
        let expTypOptns = [
          {
            label: "Select Expense Type",
            value: "",
          },
        ];
        expenseTypeOptions.map((a, i) => {
          expTypOptns.push({ label: a.option, value: a.option });
        });
        let expenseCode =
          expDetails && expDetails.expenseCode
            ? { label: expDetails.expenseCode, value: expDetails.expenseCode }
            : { label: "Select Code", value: "" };
        let codeOptions = (expDetails && expDetails.codeOptions) || [];
        let codOptns = [
          {
            label: "Select Code",
            value: "",
          },
        ];
        codeOptions.map((a, i) => {
          codOptns.push({ label: a.code, value: a.code });
        });
        let supplierName =
          expDetails.supplierName === "Select Vendor from list" ||
          expDetails.supplierName === "*No Supplier Selected*" ||
          expDetails.supplierName === "*No Supplier Selected*.."
            ? ""
            : expDetails.supplierName || "";

        let supplierCode = (expDetails && expDetails.supplierCode) || "";
        let currency = (expDetails && expDetails.currency) || "";
        let date = (expDetails && expDetails.date) || "";
        let envelope = (expDetails && expDetails.envelope) || "";
        let accountedAmount = (expDetails && expDetails.accountedAmount) || 0.0;
        let advancedAmount = (expDetails && expDetails.advancedAmount) || 0.0;
        let approverGroup =
          expDetails && expDetails.approverGroup
            ? {
                label: expDetails.approverGroup,
                value: expDetails.approverGroup,
              }
            : { label: "Select Approver Group", value: "" };
        let approverOptions = (expDetails && expDetails.approverOptions) || [];
        let aprvlGroup = [
          {
            label: "Select Approver Group",
            value: "",
          },
        ];
        approverOptions.map((a, i) => {
          aprvlGroup.push({ label: a.groupName, value: a.groupName });
        });

        //Car Info Card
        let cars = (expDetails && expDetails.cars) || "";
        let driver = (cars && cars.driver) || "";
        let rego = (cars && cars.rego) || "";
        let vehicle = (cars && cars.vehicle) || "";
        let reference = (cars && cars.reference) || "";
        let businessPercent = (cars && cars.businessPercent) || "";
        let exempt = cars && cars.exempt === "Y" ? true : false;
        //Third card Info
        let float = (expDetails && expDetails.float) || 0.0;
        let gross = (expDetails && expDetails.gross) || 0.0;
        let tax = (expDetails && expDetails.tax) || 0.0;
        let amount = (expDetails && expDetails.amount) || 0.0;
        let docAmount = (expDetails && expDetails.docAmount) || 0.0;
        //Expense Items
        let expenseItems = (expDetails && expDetails.expenseItems) || [];

        expenseItems.map((item, i) => {
          item.checked = false;
          item.amount = parseFloat(item.amount).toFixed(2);
          item.gross = parseFloat(item.gross).toFixed(2);
          item.tax = parseFloat(item.tax).toFixed(2);
          item.docketAmount = parseFloat(item.docketAmount).toFixed(2);
        });
        //Log Book
        let logBook = (expDetails && expDetails.logBook) || [];
        logBook.map((log, i) => {
          log.checked = false;
        });
        //Vehicle Log
        let vehicleLog = (expDetails && expDetails.vehicleLog) || [];
        vehicleLog.map((log, i) => {
          log.checked = false;
        });
        //attachemnts
        let attachments = (expDetails && expDetails.attachments) || [];

        let attachmentSize = 0;
        attachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });

        let primDocName = "";
        let activeAtchID = "";

        let isPrim = attachments.find(
          (a) => a.primaryDoc.toLowerCase() === "y"
        );
        primDocName = isPrim ? isPrim.fileName : "";
        activeAtchID = isPrim ? isPrim.id : "";

        this.setState(
          {
            isLoading: false,
            tran,
            //Details Card
            expenseType,
            expenseTypeOptions: expTypOptns,
            expenseCode,
            codeOptions: codOptns,
            supplierName,
            supplierCode,
            currency,
            date,
            envelope,
            accountedAmount: parseFloat(accountedAmount).toFixed(2),
            advancedAmount: parseFloat(advancedAmount).toFixed(2),
            approverGroup,
            approverOptions: aprvlGroup,
            //Car Info Card
            driver,
            rego,
            vehicle,
            reference,
            businessPercent,
            exempt,
            //Third card Info
            float: Number(float).toFixed(2),
            gross: Number(gross).toFixed(2),
            tax: Number(tax).toFixed(2),
            amount: Number(amount).toFixed(2),
            docAmount: Number(docAmount).toFixed(2),
            //expense items
            expenseItems,
            //Log Book
            logBook,
            //Vehicle Log
            vehicleLog,
            //attachemnts
            attachments,
            attachmentSize,
            primDocName,
            activeAtchID,
          },
          () => {
            this.calcMrgnForSuggestion();
            if (supplierCode && currency) {
              //to get suppliers flags
              this.getSupplier(supplierCode, currency);
            }
          }
        );
      }

      //error case of get expense
      if (this.props.expenseData.getExpenseDetailError) {
        handleAPIErr(this.props.expenseData.getExpenseDetailError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  getSupplier = async (code, currency) => {
    /*
     Vendor Tracking Codes vs User Tracking Codes - 
    These codes need to be reconciled when creating a new Expense line. The Supplier flags will overwrite
    and take precedence over the user's codes if they don't exist. 
    */
    let supplierDetails = {
      code,
      currency,
    };

    await this.props.getSupplier(supplierDetails);

    //success case of Get single Supplier
    if (this.props.supplier.getSupplierSuccess) {
      // toast.success(this.props.supplier.getSupplierSuccess);
      let flgs = this.props.supplier.getSupplier.flags || [];

      let tran =
        (this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.tran) ||
        "";
      let { float } = this.state;
      /*
       I've also added a field called float to the response of GetSupplier. 
      This should replace the float amount when drafting an Expense and a new supplier is selected.
      */

      if (tran && tran === "insertExpense") {
        float =
          (this.props.supplier.getSupplier &&
            this.props.supplier.getSupplier.supplier &&
            this.props.supplier.getSupplier.supplier.float) ||
          float;
      }
      this.setState({ suppliersFlags: flgs, float });
    }
    //error case of Get single Supplier
    if (this.props.supplier.getSupplierError) {
      handleAPIErr(this.props.supplier.getSupplierError, this.props);
    }
    this.props.clearSupplierStates();
  };

  onUpdateExpenseSupplier = async (code, currency) => {
    /*
     Vendor Tracking Codes vs User Tracking Codes - 
    These codes need to be reconciled when creating a new Expense line. The Supplier flags will overwrite
    and take precedence over the user's codes if they don't exist. 
    */
    let supplierDetails = {
      code,
      currency,
    };

    await this.props.getSupplier(supplierDetails);

    //success case of Get single Supplier
    if (this.props.supplier.getSupplierSuccess) {
      // toast.success(this.props.supplier.getSupplierSuccess);
      let flgs = this.props.supplier.getSupplier.flags || [];

      let tran =
        (this.props.history.location &&
          this.props.history.location.state &&
          this.props.history.location.state.tran) ||
        "";
      let { float } = this.state;
      /*
       I've also added a field called float to the response of GetSupplier. 
      This should replace the float amount when drafting an Expense and a new supplier is selected.
      */

      if (tran && tran === "insertExpense") {
        float =
          (this.props.supplier.getSupplier &&
            this.props.supplier.getSupplier.supplier &&
            this.props.supplier.getSupplier.supplier.float) ||
          float;
      }
      this.setState({ suppliersFlags: flgs, float }, () => {
        this.updateExpenseLines();
      });
    }
    //error case of Get single Supplier
    if (this.props.supplier.getSupplierError) {
      handleAPIErr(this.props.supplier.getSupplierError, this.props);
    }
    this.props.clearSupplierStates();
  };

  //calculate the dynamic margin from left for char code suggestion drop down
  calcMrgnForSuggestion = () => {
    if (
      $("#par").offset() &&
      $("#par").offset().left &&
      $("#cd_id") &&
      $("#cd_id").offset()
    ) {
      var dist_ho = Math.abs(
        $("#par").offset().left - $("#cd_id").offset().left
      ); // horizontal distance
      this.setState({ sugg_left: dist_ho });
    }
  };

  //Insert New Expense
  insertExpense = async () => {
    this.setState({ isLoading: true });

    await this.props.insertExpense(); //insert New Expense

    this.setState({ isLoading: false });

    //success case of Insert New Expense
    if (this.props.expenseData.insertExpenseSuccess) {
      // toast.success(this.props.expenseData.insertExpenseSuccess);

      let expDetails =
        (this.props.expenseData.insertExpense &&
          this.props.expenseData.insertExpense &&
          JSON.parse(JSON.stringify(this.props.expenseData.insertExpense))) ||
        "";

      let tran = (expDetails && expDetails.tran) || "";
      //Details Card
      let expenseType =
        expDetails && expDetails.expenseType
          ? { label: expDetails.expenseType, value: expDetails.expenseType }
          : { label: "Select Type", value: "" };
      let expenseTypeOptions =
        (expDetails && expDetails.expenseTypeOptions) || [];
      let expTypOptns = [
        {
          label: "Select Expense Type",
          value: "",
        },
      ];
      expenseTypeOptions.map((a, i) => {
        expTypOptns.push({ label: a.option, value: a.option });
      });
      let expenseCode =
        expDetails && expDetails.expenseCode
          ? { label: expDetails.expenseCode, value: expDetails.expenseCode }
          : { label: "Select Code", value: "" };
      let codeOptions = (expDetails && expDetails.codeOptions) || [];
      let codOptns = [
        {
          label: "Select Code",
          value: "",
        },
      ];
      codeOptions.map((a, i) => {
        codOptns.push({ label: a.code, value: a.code });
      });
      let supplierName =
        expDetails.supplierName === "Select Vendor from list" ||
        expDetails.supplierName === "*No Supplier Selected*" ||
        expDetails.supplierName === "*No Supplier Selected*.."
          ? ""
          : expDetails.supplierName || "";
      let supplierCode = (expDetails && expDetails.supplierCode) || "";
      let currency = (expDetails && expDetails.currency) || "";
      let date = (expDetails && expDetails.date) || "";
      let envelope = (expDetails && expDetails.envelope) || "";
      let accountedAmount = (expDetails && expDetails.accountedAmount) || 0.0;
      let advancedAmount = (expDetails && expDetails.advancedAmount) || 0.0;
      let approverGroup =
        expDetails && expDetails.approverGroup
          ? { label: expDetails.approverGroup, value: expDetails.approverGroup }
          : { label: "Select Approver Group", value: "" };
      let approverOptions = (expDetails && expDetails.approverOptions) || [];
      let aprvlGroup = [
        {
          label: "Select Approver Group",
          value: "",
        },
      ];
      approverOptions.map((a, i) => {
        aprvlGroup.push({ label: a.groupName, value: a.groupName });
      });

      //Car Info Card
      let cars = (expDetails && expDetails.cars) || "";
      let driver = (cars && cars.driver) || "";
      let rego = (cars && cars.rego) || "";
      let vehicle = (cars && cars.vehicle) || "";
      let reference = (cars && cars.reference) || "";
      let businessPercent = (cars && cars.businessPercent) || "";
      let exempt = cars && cars.exempt === "Y" ? true : false;

      //Third card Info
      let float = (expDetails && expDetails.float) || 0.0;
      let gross = (expDetails && expDetails.gross) || 0.0;
      let tax = (expDetails && expDetails.tax) || 0.0;
      let amount = (expDetails && expDetails.amount) || 0.0;
      let docAmount = (expDetails && expDetails.docAmount) || 0.0;

      //Expense Items
      let expenseItems = (expDetails && expDetails.expenseItems) || [];
      expenseItems.map((item, i) => {
        item.checked = false;
        item.amount = parseFloat(item.amount).toFixed(2);
        item.gross = parseFloat(item.gross).toFixed(2);
        item.tax = parseFloat(item.tax).toFixed(2);
        item.docketAmount = parseFloat(item.docketAmount).toFixed(2);
      });
      //Log Book
      let logBook = (expDetails && expDetails.logBook) || [];
      logBook.map((log, i) => {
        log.checked = false;
      });
      //Vehicle Log
      let vehicleLog = (expDetails && expDetails.vehicleLog) || [];
      vehicleLog.map((log, i) => {
        log.checked = false;
      });
      this.setState(
        {
          isLoading: false,
          tran,
          //Details Card
          expenseType,
          expenseTypeOptions: expTypOptns,
          expenseCode,
          codeOptions: codOptns,
          supplierName,
          supplierCode,
          currency,
          date,
          envelope,
          accountedAmount: parseFloat(accountedAmount).toFixed(2),
          advancedAmount: parseFloat(advancedAmount).toFixed(2),
          approverGroup,
          approverOptions: aprvlGroup,
          //Car Info Card
          driver,
          rego,
          vehicle,
          reference,
          businessPercent,
          exempt,
          //Third card Info
          float: Number(float).toFixed(2),
          gross: Number(gross).toFixed(2),
          tax: Number(tax).toFixed(2),
          amount: Number(amount).toFixed(2),
          docAmount: Number(docAmount).toFixed(2),
          //Expense Items
          expenseItems,
          //Log Book
          logBook,
          //Vehicle Log
          vehicleLog,
        },
        () => {
          if (supplierCode && currency) {
            //to get suppliers flags
            this.getSupplier(supplierCode, currency);
          }
        }
      );
    }
    //error case of Insert New Expense
    if (this.props.expenseData.insertExpenseError) {
      handleAPIErr(this.props.expenseData.insertExpenseError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearExpenseStates();
  };

  //Update Expense
  updateExpense = async () => {
    let {
      tran,
      expenseType,
      expenseCode,
      supplierCode,
      date,
      envelope,
      accountedAmount,
      advancedAmount,
      approverGroup,
      driver,
      rego,
      vehicle,
      reference,
      businessPercent,
      exempt,
      //Expense Items
      expenseItems,
      //logBook
      logBook,
      formErrors,
    } = this.state;

    formErrors = Validation.handleWholeValidation(
      {
        expenseType: expenseType.value,
        expenseCode: expenseCode.value,
        approverGroup: approverGroup.value,
        supplierCode,
      },
      formErrors
    );

    if (
      !formErrors.expenseType &&
      !formErrors.expenseCode &&
      !formErrors.approverGroup &&
      !formErrors.supplierCode
    ) {
      if (this.state.tran) {
        expenseItems.map((exp, i) => {
          exp.description = exp.description.toUpperCase();
          exp.chartCode = exp.chartCode.toUpperCase();
          exp.chartSort = exp.chartSort.toUpperCase();
          exp.supplier = exp.supplier.toUpperCase();
          exp.flags.map((f, i) => {
            f.value = f.value.toUpperCase();
          });
        });

        this.setState({
          isLoading: true,
        });

        logBook.map((log, i) => {
          log.code = log.code.toUpperCase();
          log.description = log.description.toUpperCase();
          log.rego = log.rego.toUpperCase();
        });
        let expDetails = {
          expense: {
            tran,
            expenseType: expenseType.value || "",
            expenseCode: expenseCode.value || "",
            supplierCode,
            date,
            envelope,
            advancedAmount,
            accountedAmount,
            approverGroup: approverGroup.value || "",
            cars: {
              driver: driver.toUpperCase(),
              rego: rego.toUpperCase(),
              vehicle: vehicle.toUpperCase(),
              reference: reference.toUpperCase(),
              businessPercent,
              exempt: exempt ? "Y" : "N",
            },
            expenseItems,
            logBook,
          },
        };
        await this.props.updateExpense(expDetails); //update Expense

        //success case of update expense
        if (this.props.expenseData.updateExpenseSuccess) {
          toast.success(this.props.expenseData.updateExpenseSuccess);
          if (this.state.tran) {
            this.props.history.push("/expenses", {
              tallies: "Draft",
              addEditExpCheck: true,
              expTran: this.state.tran,
            });
          } else {
            this.props.history.push("/expenses");
          }
        }
        //error case of update expense
        if (this.props.expenseData.updateExpenseError) {
          handleAPIErr(this.props.expenseData.updateExpenseError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearExpenseStates();
        this.updatePrimaryDocument();
      }
    } else {
      toast.error("Trans is missing");
    }

    this.setState({
      formErrors: formErrors,
    });
  };

  //updating the Attchment to primary attachemnt
  updatePrimaryDocument = async () => {
    let { tran, activeAtchID } = this.state;
    if (activeAtchID) {
      await this.props.updatePrimaryDocument(tran, activeAtchID);
      if (this.props.expenseData.updatePrimaryDocumentSuccess) {
        // toast.success(this.props.expenseData.updatePrimaryDocumentSuccess)
      }
      if (this.props.expenseData.updatePrimaryDocumentError) {
        handleAPIErr(
          this.props.expenseData.updatePrimaryDocumentError,
          this.props
        );
      }
    }
  };

  //Delete Expense
  deleteExpense = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.deleteExpense(tran); // delete expense
      //success case of delete expense
      if (this.props.expenseData.deleteExpenseSuccess) {
        toast.success(this.props.expenseData.deleteExpenseSuccess);
      }
      //error case of delete expense
      if (this.props.expenseData.deleteExpenseError) {
        handleAPIErr(this.props.expenseData.deleteExpenseError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearExpenseStates();
    }
  };

  //Expense Lines
  handleExpItemsCheckBoxes = async (e, expItem, index) => {
    let { expenseItems, checkAllExpItem } = this.state;
    if (expItem === "all") {
      if (e.target.checked) {
        expenseItems.map((e, i) => {
          e.checked = true;
          return e;
        });
      } else {
        expenseItems.map((e, i) => {
          e.checked = false;
          return e;
        });
      }
      this.setState({ expenseItems, checkAllExpItem: e.target.checked });
    } else {
      if (e.target.checked) {
        expItem.checked = e.target.checked;
        expenseItems[index] = expItem;

        let _check = expenseItems.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAllExpItem = true;
        }
        this.setState({ expenseItems, checkAllExpItem });
      } else {
        expItem.checked = e.target.checked;
        expenseItems[index] = expItem;
        this.setState({ checkAllExpItem: false, expenseItems });
      }
    }
  };

  //Update Expense Lines -> on supplier change
  updateExpenseLines = async () => {
    let { expenseItems, suppliersFlags } = this.state;

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

    let newExpenseItems = JSON.parse(JSON.stringify(expenseItems));

    for (let i = 0; i < newExpenseItems.length; i++) {
      /*
     Can you ensure that the tax line in Expenses is not changed by the user or vendor flags? 
     It needs to be excluded from having its flags updated. It is the tax flag that is generated by the system
     */
      let check = true;
      if (
        newExpenseItems[i].lineNo === 1 ||
        newExpenseItems[i].lineNo === 2 ||
        newExpenseItems[i].lineNo === 3 ||
        newExpenseItems[i].lineNo === 4
      ) {
        check = false;
      }

      if (check) {
        newExpenseItems[i].chartSort = chartSort;
        newExpenseItems[i].flags = JSON.parse(JSON.stringify(flags));
      }
    }

    this.setState({ expenseItems: newExpenseItems }, () => {
      if (expenseItems.length === 1) {
        this.calcMrgnForSuggestion();
      }
    });
  };

  //ADD Expense Lines -> when click to + button on Expense Items
  addExpenseLines = async () => {
    let { expenseItems, suppliersFlags } = this.state;
    /*The expense lines will require a LineNo in order to save. 
      Can we have this start at 5 and increment for each line added to the expense? 
      I'd like to use 1-4 for the Tax and Float lines */
    let lastLineItem = expenseItems[expenseItems.length - 1];
    let lineNo = 5;
    if (lastLineItem) {
      if (Number(lastLineItem.lineNo) != NaN) {
        if (Number(lastLineItem.lineNo) < 5) {
          lineNo = 5;
        } else {
          lineNo = Number(lastLineItem.lineNo) + 1;
        }
      } else {
        lineNo = 5;
      }
    } else {
      lineNo = 5;
    }

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

    let obj = {
      amount: "0.00",
      businessKM: 0,
      chartCode: "",
      chartSort,
      checked: false,
      date: new Date().getTime(),
      description: "",
      docketAmount: "0.00",
      flags,
      gross: "0.00",
      lineNo,
      perKM: 0,
      supplier: "",
      tax: "0.00",
      autoFocus: true,
    };

    expenseItems = [...expenseItems, obj];
    this.setState({ expenseItems }, () => {
      if (expenseItems.length === 1) {
        this.calcMrgnForSuggestion();
      }
    });
  };

  removeExpenseItem = () => {
    let { expenseItems } = this.state;

    let expItem = expenseItems.find((e) => e.checked);
    if (expItem) {
      //remove item from expense array
      let _expenseItems = expenseItems.filter((e) => !e.checked);
      this.setState({ expenseItems: _expenseItems });
    } else {
      toast.error("Please Select Expense Item To Remove!");
    }
  };

  //handle change expense lines fields
  hanldeExpenseLineFields = (e, exp, index, fldName) => {
    let name = "";
    let value = "";
    let { expenseItems, chartCodesList } = this.state;
    let clonedChartCodesList = [...chartCodesList];
    let chartCodeSuggestion = null;
    if (fldName === "date") {
      name = "date";
      value = new Date(e).getTime();
    } else if (e.target.name === "chartCode") {
      //chart code sugggestion
      name = e.target.name;
      value = e.target.value;
      if (!value) {
        clonedChartCodesList = [];
      } else {
        let chartCodesListFilterdData = clonedChartCodesList.filter((c) => {
          return (
            (c.code.toUpperCase().includes(value.toUpperCase()) ||
              c.description.toUpperCase().includes(value.toUpperCase())) &&
            c.sort.toUpperCase() === exp.chartSort.toUpperCase()
          );
        });
        clonedChartCodesList = chartCodesListFilterdData;
      }
      chartCodeSuggestion = index;
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    exp[name] = value;

    if (fldName === "gross") {
      let flags = exp.flags || [];
      let taxFlg = flags.find((f) => f.type && f.type.toLowerCase() === "tax");
      let taxRate = (taxFlg && taxFlg.value) || "";

      let { taxCodes } = this.state;
      let taxAmount = 0.0;
      if (taxCodes.length > 0) {
        let obj = taxCodes.find(
          (t) => t.code.toLowerCase() === taxRate.toLowerCase()
        );
        taxAmount = obj ? Number(obj.rate).toFixed(2) : 0.0;
      }

      exp["tax"] =
        Number(exp["gross"]) -
        (Number(exp["gross"]) / (1 + Number(taxAmount))).toFixed(2);

      exp["amount"] = (Number(exp["gross"]) - Number(exp["tax"])).toFixed(2);
    } else if (fldName === "tax") {
      exp["amount"] = (Number(exp["gross"]) - Number(exp["tax"])).toFixed(2);
    }
    expenseItems[index] = exp;

    this.setState({ expenseItems, clonedChartCodesList, chartCodeSuggestion });
  };

  // when select chart code from suggestions e.g. auto-completion
  changeChartCode = (chartCode, line, index) => {
    let { expenseItems } = this.state;
    // update in expense lines
    line.chartCode = chartCode.code || "";
    expenseItems[index] = line;
    this.setState({ expenseItems });
  };

  convertTwoDecimal = (e, line) => {
    let nam = e.target.name;
    let val = Number(e.target.value).toFixed(2) || 0.0;

    let { expenseItems } = this.state;
    line[nam] = val;

    this.setState({ expenseItems });
  };

  //handle change expense lines flags
  handleChangeFlags = (e, line, index) => {
    let { name, value } = e.target;
    let { expenseItems } = this.state;

    let flags = line.flags || [];
    flags.map((f, i) => {
      if (f.type && f.type.toLowerCase() == name.toLowerCase()) {
        f.value = value;
      }
      return f;
    });

    /* 
    Expense list Amount should auto calc based on Gross and tax and tax should auto calc based on tax code. 
    Line# should not be editable.
    Log book Var should autocalc based on end-start-bus – per and not be editable.*/

    /*
    Please do these calcs on these fields in the front end: see pic
    Gross Amount = Full Amount
    Tax Amount = Gross Amount - (Gross / (1 + Tax Rate from the Flag)
    Net Amount = Gross Amount - Tax Amount
    */
    if (name.toLowerCase() === "tax") {
      let { taxCodes } = this.state;
      if (taxCodes.length > 0) {
        let obj = taxCodes.find(
          (t) => t.code.toLowerCase() === value.toLowerCase()
        );

        let taxAmount = obj ? Number(obj.rate).toFixed(2) : 0;
        line["tax"] =
          Number(line["gross"]) -
          (Number(line["gross"]) / (1 + Number(taxAmount))).toFixed(2);

        line["amount"] = (Number(line["gross"]) - Number(line["tax"])).toFixed(
          2
        );
      } else {
        line["tax"] =
          Number(line["gross"]) - (Number(line["gross"]) / 1).toFixed(2);
        line["amount"] = (Number(line["gross"]) - Number(line["tax"])).toFixed(
          2
        );
      }
    }

    this.setState({ expenseItems });
  };

  handleOnBlur = (e) => {
    /*
    AddAdvancedLine will be called each time the user enters or updates the Advanced amount.
    AddAccountedLine will be called each time the user enters or updates the Accounted amount.
    AddTaxLines will be called when the user enters the Advanced amount for the first time.
    Each of the requests will return an expense item with a fixed line no. and 
    the lines in the response should replace the lines with the matching line no. in the list.
    The Advanced line will be line no. 1
    The Accounted line will be line no. 2
    The Tax lines will be lines no. 3 & 4
  */
    let { name, value } = e.target;
    let val = Number(e.target.value).toFixed(2) || 0.0;

    if (name === "advancedAmount") {
      this.addAdvancedLine();
      if (this.state.addTaxLinesCheck) {
        this.addTaxLines();
      }
    } else if (name === "accountedAmount") {
      this.addAccountedLine();
    }
    this.setState({ [name]: val });
  };

  //add tax lines
  addTaxLines = async () => {
    let formErrors = this.state.formErrors;
    let { currency, supplierName, supplierCode, advancedAmount } = this.state;
    if (!supplierCode) {
      if (supplierName) {
        formErrors.supplierCode = "Supplier Code is Missing.";
      } else {
        formErrors.supplierCode = "This Field is Required.";
      }
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.supplierCode) {
      if (currency) {
        this.setState({
          isLoading: true,
        });
        let obj = {
          currency,
          supplierCode,
          amount: advancedAmount,
        };
        await this.props.addTaxLines(obj); // add tax lines
        //success case of add advanced line
        if (this.props.expenseData.addTaxLinesSuccess) {
          toast.success(this.props.expenseData.addTaxLinesSuccess);
          this.setState({ addTaxLinesCheck: false });
          let taxLines = this.props.expenseData.addTaxLines || [];
          let { expenseItems } = this.state;
          taxLines.map((t, i) => {
            if (t.lineNo) {
              t.checked = false;
              var foundIndex = expenseItems.findIndex(
                (e) => e.lineNo == t.lineNo
              );
              if (foundIndex != -1) {
                expenseItems[foundIndex] = t;
              } else {
                expenseItems = [...expenseItems, t];
              }
            }
          });
          this.sortExpenseLines(expenseItems);
        }
        //error case of add tax lines
        if (this.props.expenseData.addTaxLinesError) {
          handleAPIErr(this.props.expenseData.addTaxLinesError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearExpenseStates();
      } else {
        toast.error("Currency is Missing!");
      }
    }
  };

  //add advanced lines
  addAdvancedLine = async () => {
    let formErrors = this.state.formErrors;
    let { currency, supplierName, supplierCode, advancedAmount } = this.state;
    if (!supplierCode) {
      if (supplierName) {
        formErrors.supplierCode = "Supplier Code is Missing.";
      } else {
        formErrors.supplierCode = "This Field is Required.";
      }
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.supplierCode) {
      if (currency) {
        this.setState({
          isLoading: true,
        });
        let obj = {
          currency,
          supplierCode,
          amount: advancedAmount,
        };
        await this.props.addAdvancedLine(obj); // add advanced line
        //success case of add advanced line
        if (this.props.expenseData.addAdvancedLineSuccess) {
          toast.success(this.props.expenseData.addAdvancedLineSuccess);

          let addAdvancedLines = this.props.expenseData.addAdvancedLine || [];
          let { expenseItems } = this.state;
          addAdvancedLines.map((l, i) => {
            if (l.lineNo) {
              l.checked = false;
              var foundIndex = expenseItems.findIndex(
                (e) => e.lineNo == l.lineNo
              );
              if (foundIndex != -1) {
                expenseItems[foundIndex] = l;
              } else {
                expenseItems = [...expenseItems, l];
              }
            }
          });
          this.sortExpenseLines(expenseItems);
        }
        //error case of add advanced line
        if (this.props.expenseData.addAdvancedLineError) {
          handleAPIErr(this.props.expenseData.addAdvancedLineError, this.props);
        }
        this.setState({ isLoading: false });
        this.props.clearExpenseStates();
      } else {
        toast.error("Currency is Missing!");
      }
    }
  };

  //add accounted lines
  addAccountedLine = async () => {
    let formErrors = this.state.formErrors;
    let { currency, supplierName, supplierCode, accountedAmount } = this.state;
    if (!supplierCode) {
      if (supplierName) {
        formErrors.supplierCode = "Supplier Code is Missing.";
      } else {
        formErrors.supplierCode = "This Field is Required.";
      }
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.supplierCode) {
      if (currency) {
        this.setState({
          isLoading: true,
        });
        let obj = {
          currency,
          supplierCode,
          amount: accountedAmount,
        };
        await this.props.addAccountedLine(obj); // add accounted line
        //success case of add accounted line
        if (this.props.expenseData.addAccountedLineSuccess) {
          toast.success(this.props.expenseData.addAccountedLineSuccess);

          let accountedLines = this.props.expenseData.addAccountedLine || [];
          let { expenseItems } = this.state;
          accountedLines.map((l, i) => {
            if (l.lineNo) {
              l.checked = false;
              var foundIndex = expenseItems.findIndex(
                (e) => e.lineNo == l.lineNo
              );
              if (foundIndex != -1) {
                expenseItems[foundIndex] = l;
              } else {
                expenseItems = [...expenseItems, l];
              }
            }
          });
          this.sortExpenseLines(expenseItems);
        }
        //error case of add accounted line
        if (this.props.expenseData.addAccountedLineError) {
          handleAPIErr(
            this.props.expenseData.addAccountedLineError,
            this.props
          );
        }
        this.setState({ isLoading: false });
        this.props.clearExpenseStates();
      } else {
        toast.error("Currency is Missing!");
      }
    }
  };

  //sort expense line according to line no
  sortExpenseLines = (items) => {
    let expenseItems = items.sort((a, b) =>
      a.lineNo > b.lineNo ? 1 : b.lineNo > a.lineNo ? -1 : 0
    );
    this.setState({ expenseItems });
  };

  //LogBook Lines
  handleLogBookCheckBoxes = async (e, lgbk, index) => {
    let { logBook, checkAllLogBook } = this.state;
    if (lgbk === "all") {
      if (e.target.checked) {
        logBook.map((l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        logBook.map((l, i) => {
          l.checked = false;
          return l;
        });
      }
      this.setState({ logBook, checkAllLogBook: e.target.checked });
    } else {
      if (e.target.checked) {
        lgbk.checked = e.target.checked;
        logBook[index] = lgbk;

        let _check = logBook.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAllLogBook = true;
        }
        this.setState({ logBook, checkAllLogBook });
      } else {
        lgbk.checked = e.target.checked;
        logBook[index] = lgbk;
        this.setState({ checkAllLogBook: false, logBook });
      }
    }
  };

  //ADD Log Book Lines -> when click to + button on LogBook Items
  addLogBookLines = () => {
    let { logBook } = this.state;
    let obj = {
      businessKM: 0,
      checked: false,
      code: "",
      dateFrom: new Date().getTime(),
      dateTo: new Date().getTime(),
      description: "",
      endOdometer: 0,
      perKM: 0,
      rego: "",
      startOdometer: 0,
      variance: 0,
      autoFocus: true,
    };

    logBook.push(obj);
    this.setState({ logBook });
  };

  removeLogBookItems = () => {
    let { logBook } = this.state;

    let lgbk = logBook.find((e) => e.checked);
    if (lgbk) {
      //remove item from Log Book array
      let _logBook = logBook.filter((e) => !e.checked);
      this.setState({ logBook: _logBook });
    } else {
      toast.error("Please Select Log Book Item To Remove!");
    }
  };

  //handle change log book lines fields
  hanldeLogBookLineFields = (e, log, index, fldName) => {
    let name = "";
    let value = "";
    let { logBook } = this.state;
    if (fldName === "dateFrom" || fldName === "dateTo") {
      name = fldName;
      value = new Date(e).getTime();
    } else {
      name = e.target.name;
      value = e.target.value;
    }

    log[name] = value;

    if (
      fldName === "startOdometer" ||
      fldName === "endOdometer" ||
      fldName === "businessKM" ||
      fldName === "perKM"
    ) {
      log["variance"] =
        Number(log["endOdometer"]) -
        Number(log["startOdometer"]) -
        Number(log["businessKM"]) -
        Number(log["perKM"]);
    }

    logBook[index] = log;
    this.setState({ logBook });
  };

  //Vehicle Log Lines
  handleVehicleLogCheckBoxes = async (e, vLog, index) => {
    let { vehicleLog, checkAllVehicleLog } = this.state;
    if (vLog === "all") {
      if (e.target.checked) {
        vehicleLog.map((l, i) => {
          l.checked = true;
          return l;
        });
      } else {
        vehicleLog.map((l, i) => {
          l.checked = false;
          return l;
        });
      }
      this.setState({ vehicleLog, checkAllVehicleLog: e.target.checked });
    } else {
      if (e.target.checked) {
        vLog.checked = e.target.checked;
        vehicleLog[index] = vLog;

        let _check = vehicleLog.findIndex((c) => c.checked === false);
        if (_check === -1) {
          checkAllVehicleLog = true;
        }
        this.setState({ vehicleLog, checkAllVehicleLog });
      } else {
        vLog.checked = e.target.checked;
        vehicleLog[index] = vLog;
        this.setState({ checkAllVehicleLog: false, vehicleLog });
      }
    }
  };

  //Remove Vehicle Log Item -> delete button functionality
  removeVehicleLogItems = () => {
    let { vehicleLog } = this.state;

    let vLog = vehicleLog.find((e) => e.checked);
    if (vLog) {
      //remove item from vehicle log array
      let _vehicleLog = vehicleLog.filter((e) => !e.checked);
      this.setState({ vehicleLog: _vehicleLog });
    } else {
      toast.error("Please Select Vehicle Log Item To Remove!");
    }
  };

  //----END----

  // uplaod exp attchments
  uploadAttachment = async (f) => {
    let { attachmentSize } = this.state;

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
          if (attachmentSize < 30932992) {
            //30932992  -> 29.5 MB
            if (Number(size) + Number(attachmentSize) < 30932992) {
              const result = await toBase64(file).catch((e) => e);
              if (result instanceof Error) {
                toast.error(result.message);
                return;
              } else {
                this.setState({ pdf: result });
                await this.addAttachment({
                  fileName: name,
                  attachment: result.split(",")[1],
                });
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
        toast.error(
          "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
        );
      }
    }
  };

  //add Expense Attachments
  addAttachment = async (data) => {
    let { tran, activeAtchID, primDocName } = this.state;

    if (tran) {
      this.setState({ isLoading: true });
      let obj = {
        tran,
        ...data,
      };
      await this.props.addExpAttachment(obj);
      if (this.props.expenseData.addExpAttachmentSuccess) {
        // toast.success(this.props.expenseData.addExpAttachmentSuccess);
        let attachments = this.props.expenseData.addExpAttachment || [];

        let attachmentSize = 0;
        attachments.map((a, i) => {
          a.id = a.recordID;
          attachmentSize += Number(a.fileSize) || 0;
        });

        /*Please set the first file uploaded to be the Primary Document 
       (so automatically have it ticked so users do not have to tick it).
       */
        if (attachments.length === 1) {
          activeAtchID = attachments[0].id;
          primDocName = attachments[0].fileName;
        }
        this.setState({
          attachments,
          activeAtchID,
          primDocName,
          attachmentSize,
        });
      }
      if (this.props.expenseData.addExpAttachmentError) {
        handleAPIErr(this.props.expenseData.addExpAttachmentError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  //Get Expense Attachment
  getAttachment = async (id, fileName) => {
    if (id) {
      this.setState({ isLoading: true });

      await this.props.getExpAttachment(id);
      if (this.props.expenseData.getExpAttachmentSuccess) {
        // toast.success(this.props.expenseData.getExpAttachmentSuccess);
        let resp = this.props.expenseData.getExpAttachment;
        downloadAttachments(resp, fileName);
      }
      if (this.props.expenseData.getExpAttachmentError) {
        handleAPIErr(this.props.expenseData.getExpAttachmentError, this.props);
      }
      this.props.clearExpenseStates();
      this.setState({ isLoading: false });
    }
  };

  //delete Expense Attachemnt
  deleteExpAttachment = async (attach) => {
    let id = attach.id;
    let { primDocName, activeAtchID, attachments, attachmentSize } = this.state;

    this.setState({ isLoading: true });

    await this.props.deleteExpAttachment(id);
    if (this.props.expenseData.deleteExpAttachmentSuccess) {
      toast.success(this.props.expenseData.deleteExpAttachmentSuccess);

      let filteredAttachments = attachments.filter((a) => a.id != id);

      //if current selected attachment is going to delete then remove the name also that's showing
      if (id === activeAtchID) {
        primDocName = "";
        activeAtchID = "";
      }
      attachmentSize = Number(attachmentSize) - Number(attach.fileSize);
      this.setState({
        attachments: filteredAttachments,
        primDocName,
        activeAtchID,
        attachmentSize,
      });
    }
    if (this.props.expenseData.deleteExpAttachmentError) {
      handleAPIErr(this.props.expenseData.deleteExpAttachmentError, this.props);
    }
    await this.props.clearExpenseStates();

    this.setState({ isLoading: false });
  };

  //get supplier's list
  getSuppliersList = async () => {
    await this.props.getSuppliersList(this.state.currency || "", "", "EXPENSE"); //second param for previous supplier(used in search page)

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

  //get tax codes
  getTaxCodes = async () => {
    let codes = this.props.chart.getTaxCodes || [];
    if (codes.length === 0) {
      await this.props.getTaxCodes();
    }
    //success case of Get Tax Codes
    if (this.props.chart.getTaxCodesSuccess) {
      // toast.success(this.props.chart.getTaxCodesSuccess);

      let getTaxCodes = this.props.chart.getTaxCodes || [];
      codes = getTaxCodes;
    }
    // error case of Get Tax Codes
    if (this.props.chart.getTaxCodesError) {
      handleAPIErr(this.props.chart.getTaxCodesError, this.props);
    }

    this.setState({ taxCodes: codes });
    this.props.clearChartStates();
  };

  //get chart codes
  getChartCodes = async () => {
    await this.props.getChartCodes();
    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
      let getChartCodes = this.props.chart.getChartCodes || "";
      this.setState({
        chartCodesList: getChartCodes.chartCodes || [],
        clonedChartCodesList: getChartCodes.chartCodes || [],
      });
    }

    //success case of Get Chart Codes
    if (this.props.chart.getChartCodesSuccess) {
      // toast.success(this.props.chart.getChartCodesSuccess);
    }
    //error case of Get Chart Codes
    if (this.props.chart.getChartCodesError) {
      handleAPIErr(this.props.chart.getChartCodesError, this.props);
    }
    this.props.clearChartStates();
  };

  handleChangeSupplierName = (e) => {
    $(".invoice_vender_menu1").show();

    let { formErrors } = this.state;
    let value = e.target.value;

    formErrors.supplierCode = "This field is Required!";

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
      clonedSuppliersList,
      supplierName: value,
      supplierCode: "",
      editName: true,
      formErrors,
    });
  };

  updateExpenseSupplier = (supplier) => {
    let { formErrors } = this.state;
    let { code, name, currency } = supplier;

    formErrors = Validation.handleValidation("supplierCode", code, formErrors);
    this.setState({
      supplierCode: code,
      supplierName: name,
      currency,
      formErrors,
    });

    if (code && currency) {
      //to get supplier's flags and merge with user's default flags to show on Expense items when + button pressed as a default flags
      this.onUpdateExpenseSupplier(code, currency);
    }
  };

  //create supplier when click on + when supplier inline editing
  addSupplier = () => {
    this.props.history.push("/new-supplier2", {
      stateData: this.state,
      page: "addEditExpense",
      supplierName: this.state.supplierName,
    });
  };

  openModal = (name) => {
    this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  handleChangeSelect = async (obj, name) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, obj.value, formErrors);
    this.setState({ [name]: obj, formErrors });
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

  handlechangeField = (e) => {
    let { name, value } = e.target;

    value = value.toUpperCase();
    this.setState({ [name]: value });
  };

  handleCheckboxes = (e, name) => {
    this.setState({ [name]: e.target.checked });
  };

  onDiscard = async () => {
    /*Check When Add/Edit Expense and then user Save or Cancel that edit,
    then load the same Expense user just edited/created?.*/

    let state = this.props.history.location
      ? this.props.history.location.state
      : "";
    if (
      state &&
      state.tran &&
      state.tran === "insertExpense" &&
      state.defaultData
    ) {
      //insert expense case
      this.deleteExpense();
      this.props.history.push("/expenses", {
        tallies: "Draft",
        addEditExpCheck: true,
        expTran: this.state.tran,
        noChange: true,
        defaultData: state.defaultData,
      });
    } else {
      //update expense case
      this.props.history.push("/expenses", {
        tallies: "Draft",
        addEditExpCheck: true,
        expTran: this.state.tran,
        noChange: true,
        defaultData: state.defaultData,
      });
    }
  };

  render() {
    let { activeAtchID, primDocName, attachments } = this.state;

    return (
      <>
        <div className="dashboard">
          {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

          {/* top nav bar */}
          <Header props={this.props} expenseForm={true} />
          {/* end */}

          {/* body part */}

          <div className="dashboard_body_content">
            {/* top Nav menu*/}
            <TopNav />
            {/* end */}
            <section id="">
              <div className="container-fluid ">
                <div className="main_wrapper mt-md-5 mt-2 sup-main-pad">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-12 w-100 ">
                      <div className="forgot_form_main report_main sup-inner-pad Setting_main expence_detail">
                        {/* user's Details Code start */}

                        <div className="forgot_header">
                          <div className="modal-top-header">
                            <div className="row">
                              <div className="col d-flex justify-content-end s-c-main w-sm-100">
                                <button
                                  onClick={this.updateExpense}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-check"></span>
                                  Save
                                </button>
                                <button
                                  onClick={this.onDiscard}
                                  type="button"
                                  className="btn-save"
                                >
                                  <span className="fa fa-ban"></span>
                                  Discard
                                </button>
                              </div>
                            </div>
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
                                      data-target="#expenseDetails"
                                    />{" "}
                                  </span>
                                  Expense Details
                                </h6>
                                <p></p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="collapse show" id="expenseDetails">
                          <div className="row">
                            <div
                              className={
                                this.state.expenseType.value === "Fuel" ||
                                this.state.expenseType.value === "fuel"
                                  ? "col-lg-4 p-0"
                                  : "col-lg-6 p-0"
                              }
                            >
                              <div className="col-lg-12 ">
                                <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn box_height">
                                  <div className="forgot_header">
                                    <div className="modal-top-header">
                                      <div className="row">
                                        <div className="col-auto pl-0">
                                          <h6 className="text-left def-blue mm_def_color">
                                            Details:
                                          </h6>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="forgot_body">
                                      <div className="row mt-4">
                                        <div className="col-md-12">
                                          {/* dropdown coding start */}
                                          <div className="form-group custon_select">
                                            <label>Type</label>
                                            <Select
                                              // isDisabled
                                              className="width-selector"
                                              value={this.state.expenseType}
                                              // classNamePrefix="custon_select-selector-inner"
                                              options={
                                                this.state.expenseTypeOptions
                                              }
                                              onChange={(d) =>
                                                this.handleChangeSelect(
                                                  d,
                                                  "expenseType"
                                                )
                                              }
                                              autoFocus={true}
                                              styles={_customStyles}
                                              classNamePrefix="react-select"
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
                                                .expenseType !== ""
                                                ? this.state.formErrors
                                                    .expenseType
                                                : ""}
                                            </div>
                                          </div>

                                          {/* end  */}
                                        </div>
                                        <div className="col-md-12">
                                          {/* dropdown coding start */}
                                          <div className="form-group custon_select">
                                            <label>Code</label>
                                            <Select
                                              // isDisabled
                                              className="width-selector"
                                              value={this.state.expenseCode}
                                              // classNamePrefix="custon_select-selector-inner"
                                              options={this.state.codeOptions}
                                              onChange={(d) =>
                                                this.handleChangeSelect(
                                                  d,
                                                  "expenseCode"
                                                )
                                              }
                                              styles={_customStyles}
                                              classNamePrefix="react-select"
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
                                                .expenseCode !== ""
                                                ? this.state.formErrors
                                                    .expenseCode
                                                : ""}
                                            </div>
                                          </div>

                                          {/* end  */}
                                        </div>

                                        <div className="form-group col-12">
                                          <div className=" custon_select">
                                            <label htmlFor="usr">
                                              Supplier
                                            </label>
                                            <div className="modal_input">
                                              <input
                                                type="text"
                                                className="form-control focus_vender uppercaseText"
                                                id="id_sName"
                                                // tabIndex="2222"
                                                // autoFocus={true}
                                                autoComplete="off"
                                                name={"supplierName"}
                                                placeholder="Please select supplier from list or start typing"
                                                value={this.state.supplierName}
                                                onChange={
                                                  this.handleChangeSupplierName
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
                                                            this.updateExpenseSupplier(
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
                                            {this.state.formErrors
                                              .supplierCode !== ""
                                              ? this.state.formErrors
                                                  .supplierCode
                                              : ""}
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="form-group custon_select">
                                            <label htmlFor="usr">Date</label>

                                            <div className="modal_input datePickerUP">
                                              <DatePicker
                                                name="date"
                                                selected={this.state.date}
                                                onKeyDown={(e) => {
                                                  if (e.key == "Tab") {
                                                    this.myRef.current.setOpen(
                                                      false
                                                    );
                                                  }
                                                }}
                                                ref={this.myRef}
                                                onChange={(d) =>
                                                  this.handleDateChange(
                                                    d,
                                                    "date"
                                                  )
                                                }
                                                dateFormat="d MMM yyyy"
                                                autoComplete="off"
                                              />
                                            </div>
                                            <div className="text-danger error-12">
                                              {this.state.formErrors.date !== ""
                                                ? this.state.formErrors.date
                                                : ""}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="form-group custon_select">
                                            <label htmlFor="envelope">
                                              Envelope
                                            </label>
                                            <div className="modal_input">
                                              <input
                                                type="text"
                                                className="form-control uppercaseText"
                                                id="envelope"
                                                name="envelope"
                                                defaultValue={
                                                  this.state.envelope
                                                }
                                                onBlur={this.handlechangeField}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-12">
                                          <div className="form-group custon_select">
                                            <label htmlFor="advancedAmount">
                                              Advance Amount
                                            </label>
                                            <div className="modal_input ">
                                              <input
                                                type="number"
                                                className="form-control"
                                                id="advancedAmount"
                                                name="advancedAmount"
                                                value={
                                                  this.state.advancedAmount
                                                }
                                                onChange={
                                                  this.handlechangeField
                                                }
                                                onBlur={this.handleOnBlur}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-12">
                                          <div className="form-group custon_select">
                                            <label htmlFor="accountedAmount">
                                              Accounted Amount
                                            </label>
                                            <div className="modal_input ">
                                              <input
                                                type="number"
                                                className="form-control"
                                                id="accountedAmount"
                                                name="accountedAmount"
                                                value={
                                                  this.state.accountedAmount
                                                }
                                                onChange={
                                                  this.handlechangeField
                                                }
                                                onBlur={this.handleOnBlur}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-12">
                                          {/* dropdown coding start */}
                                          <div className="form-group custon_select">
                                            <label>Approver Group</label>
                                            <Select
                                              // isDisabled
                                              className="width-selector"
                                              value={this.state.approverGroup}
                                              // classNamePrefix="custon_select-selector-inner"
                                              options={
                                                this.state.approverOptions
                                              }
                                              onChange={(d) =>
                                                this.handleChangeSelect(
                                                  d,
                                                  "approverGroup"
                                                )
                                              }
                                              styles={_customStyles}
                                              classNamePrefix="react-select"
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
                                                .approverGroup !== ""
                                                ? this.state.formErrors
                                                    .approverGroup
                                                : ""}
                                            </div>
                                          </div>

                                          {/* end  */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {this.state.expenseType.value === "Fuel" ||
                            this.state.expenseType.value === "fuel" ? (
                              <div className="col-lg-4 p-0">
                                <div className="col-lg-12 ">
                                  <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn box_height">
                                    <div className="forgot_header">
                                      <div className="modal-top-header">
                                        <div className="row">
                                          <div className="col-auto pl-0">
                                            <h6 className="text-left def-blue mm_def_color">
                                              Cars:
                                            </h6>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="forgot_body">
                                        <div className="row mt-4">
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="driver">
                                                Driver
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control uppercaseText"
                                                  id="driver"
                                                  name="driver"
                                                  defaultValue={
                                                    this.state.driver
                                                  }
                                                  onBlur={
                                                    this.handlechangeField
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="rego">Rego</label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control uppercaseText"
                                                  id="rego"
                                                  name="rego"
                                                  defaultValue={this.state.rego}
                                                  onBlur={
                                                    this.handlechangeField
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="vehicle">
                                                Vehicle
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control uppercaseText"
                                                  id="vehicle"
                                                  name="vehicle"
                                                  defaultValue={
                                                    this.state.vehicle
                                                  }
                                                  onBlur={
                                                    this.handlechangeField
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="reference">
                                                Reference Number
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control uppercaseText"
                                                  id="reference"
                                                  name="reference"
                                                  defaultValue={
                                                    this.state.reference
                                                  }
                                                  onBlur={
                                                    this.handlechangeField
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="form-group custon_select">
                                              <label htmlFor="businessPercent">
                                                Business Percentage
                                              </label>
                                              <div className="modal_input">
                                                <input
                                                  type="text"
                                                  className="form-control uppercaseText"
                                                  id="businessPercent"
                                                  name="businessPercent"
                                                  defaultValue={
                                                    this.state.businessPercent
                                                  }
                                                  onBlur={
                                                    this.handlechangeField
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-12">
                                            <div className="form-group">
                                              <label className="dash_container dash_remember table-check unckeck">
                                                <input
                                                  type="checkbox"
                                                  name="exempt"
                                                  id={"exempt"}
                                                  checked={this.state.exempt}
                                                  onChange={(e) =>
                                                    this.handleCheckboxes(
                                                      e,
                                                      "exempt"
                                                    )
                                                  }
                                                />
                                                <span
                                                  id="exempt"
                                                  className="dash_checkmark"
                                                ></span>
                                                Exempt
                                              </label>
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

                            <div
                              className={
                                this.state.expenseType.value === "Fuel" ||
                                this.state.expenseType.value === "fuel"
                                  ? "col-lg-4 p-0"
                                  : "col-lg-6 p-0"
                              }
                            >
                              <div className="col-lg-12 ">
                                <div className="forgot_form_main report_main sup-inner-pad po_edit_top_modal_mrgn box_height">
                                  <div className="forgot_header">
                                    <div className="modal-top-header">
                                      <div className="row">
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Float:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.float}
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Gross:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.gross}
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Tax:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.tax}
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Amount:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.amount}
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Doc Amt:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.docAmount}
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-left def-blue2">
                                            Trans:
                                          </h6>
                                        </div>
                                        <div className="col-6 pl-0">
                                          <h6 className="text-right ">
                                            {this.state.tran}
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
                                      data-target="#expenseItems"
                                    />{" "}
                                  </span>
                                  Expense Items
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="collapse show" id="expenseItems">
                          <div className="forgot_body">
                            <div className="col-12 mt-md-3 mb-1">
                              <div className="forgot_header">
                                <div className="modal-top-header">
                                  <div className="col-auto d-flex justify-content-end s-c-main p-0">
                                    <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                      <button
                                        type="button"
                                        className="btn-save exp-top-btn expxtopbtn1"
                                        onClick={this.addExpenseLines}
                                      >
                                        <span className="fa fa-plus-circle"></span>
                                      </button>
                                      <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                        <button
                                          type="button"
                                          className="btn-save exp-top-btn"
                                          onClick={this.removeExpenseItem}
                                        >
                                          <span className="fa fa-trash"></span>
                                        </button>
                                      </div>
                                      <div className="d-flex justify-content-end s-c-main w-sm-100">
                                        <Dropdown
                                          alignRight="false"
                                          drop="down"
                                          className="analysis-card-dropdwn float-right bg-tp exp_top_btn"
                                        >
                                          <Dropdown.Toggle
                                            variant="sucess"
                                            id="dropdown-basic"
                                          >
                                            <button
                                              type="button"
                                              className="btn-save exp-top-btn"
                                            >
                                              <span className="fa fa-ellipsis-v"></span>
                                            </button>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item>
                                              Import
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                              Export
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* table start  */}
                            <div className="row mt-3" id="par">
                              <div className="col-12">
                                <div className="login_form expense-form">
                                  <div className="login_table_list table-reponsive exp-dropdown-ui">
                                    <table className="table  project_table shadow-none newpo--edit exp_edit">
                                      <thead>
                                        <tr>
                                          <th
                                            scope="col"
                                            className="exp_th1 mm_contact-name"
                                          >
                                            <div className="form-group">
                                              <label className="dash_container dash_remember table-check unckeck">
                                                <input
                                                  type="checkbox"
                                                  name={"chk1"}
                                                  id={"chk1"}
                                                  checked={
                                                    this.state.checkAllExpItem
                                                  }
                                                  onChange={(e) =>
                                                    this.handleExpItemsCheckBoxes(
                                                      e,
                                                      "all"
                                                    )
                                                  }
                                                />
                                                <span
                                                  id="chk1"
                                                  className="dash_checkmark"
                                                ></span>
                                              </label>
                                            </div>
                                          </th>
                                          <th className="text-left white-space">
                                            {" "}
                                            Chart Sort
                                          </th>
                                          <th className="text-left white-space">
                                            {" "}
                                            Chart Code
                                          </th>
                                          {this.state.defaultUserFlags.map(
                                            (p, i) => {
                                              return (
                                                <th
                                                  className="text-left exp-form-flag"
                                                  key={i}
                                                  scope="col"
                                                >
                                                  {p.prompt}
                                                </th>
                                              );
                                            }
                                          )}
                                          <th scope="col" className="text-left">
                                            Date
                                          </th>
                                          <th
                                            scope="col"
                                            className="exp-descript text-left"
                                          >
                                            Description
                                          </th>
                                          <th
                                            scope="col"
                                            className="text-left exp-supplier-th"
                                          >
                                            Supplier
                                          </th>
                                          <th scope="col" className="text-left">
                                            Gross
                                          </th>
                                          <th scope="col" className="text-left">
                                            Tax
                                          </th>
                                          <th scope="col" className="text-left">
                                            Amount
                                          </th>

                                          {this.state.expenseType.value ===
                                            "Fuel" ||
                                          this.state.expenseType.value ===
                                            "fuel" ? (
                                            <>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Bus Km
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Per Km
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Docket Amount
                                              </th>
                                            </>
                                          ) : (
                                            ""
                                          )}
                                          <th
                                            scope="col"
                                            className="text-left "
                                          >
                                            Line
                                          </th>
                                          {/* <th scope="col" className="text-left">
                                            <span className="fa fa-bars"></span>
                                          </th> */}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.state.expenseItems.map(
                                          (item, i) => {
                                            return (
                                              <tr key={i}>
                                                <td>
                                                  <div className="col align-self-center text-center pr-0">
                                                    <div className="form-group mb-0 check-line">
                                                      <label className="dash_container dash_remember table-check unckeck">
                                                        <input
                                                          type="checkbox"
                                                          name={"chk1"}
                                                          id={"chk1" + i}
                                                          checked={item.checked}
                                                          onChange={(e) =>
                                                            this.handleExpItemsCheckBoxes(
                                                              e,
                                                              item,
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
                                                    className={
                                                      item.chartSort.length <= 5
                                                        ? "input_height wd-50 uppercaseText"
                                                        : "input_height wd-75 uppercaseText"
                                                    }
                                                    autoFocus={item.autoFocus}
                                                    name="chartSort"
                                                    value={item.chartSort}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="chartSort"
                                                  />
                                                </td>
                                                <td
                                                  className="text-left"
                                                  id="cd_id"
                                                >
                                                  <input
                                                    type="text"
                                                    className={
                                                      item.chartCode.length <= 4
                                                        ? "input_height wd-45 uppercaseText"
                                                        : item.chartCode
                                                            .length <= 8
                                                        ? "input_height wd-72 uppercaseText"
                                                        : "input_height wd-101 uppercaseText"
                                                    }
                                                    name="chartCode"
                                                    value={item.chartCode}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="chartCode"
                                                    autoComplete="off"
                                                    onBlur={() =>
                                                      setTimeout(() => {
                                                        this.setState({
                                                          chartCodeSuggestion:
                                                            null,
                                                        });
                                                      }, 200)
                                                    }
                                                  />
                                                  {this.state
                                                    .chartCodeSuggestion ==
                                                    i && (
                                                    <div
                                                      className={
                                                        "chart_menue d-block"
                                                      }
                                                      style={{
                                                        marginLeft:
                                                          this.state.sugg_left,
                                                      }}
                                                    >
                                                      {this.state
                                                        .clonedChartCodesList
                                                        .length > 0 ? (
                                                        <ul className="invoice_vender_menu">
                                                          {this.state.clonedChartCodesList.map(
                                                            (c, ind) => {
                                                              return (
                                                                <li
                                                                  className="cursorPointer"
                                                                  onClick={() =>
                                                                    this.changeChartCode(
                                                                      c,
                                                                      item,
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
                                                  )}
                                                </td>

                                                {this.state.defaultUserFlags.map(
                                                  (p, i) => {
                                                    return (
                                                      <td
                                                        className={
                                                          p.type === "Set" ||
                                                          p.type === "set"
                                                            ? "od-flag-last  text-left"
                                                            : "text-left"
                                                        }
                                                        key={i}
                                                      >
                                                        <div className="">
                                                          <input
                                                            type="text"
                                                            id="usr"
                                                            className="input_height  uppercaseText"
                                                            autoComplete="off"
                                                            name={p.type}
                                                            maxLength={p.length}
                                                            value={
                                                              (item.flags.find(
                                                                (f) =>
                                                                  f.type.toLowerCase() ===
                                                                  p.type.toLowerCase()
                                                              ) &&
                                                                item.flags.find(
                                                                  (f) =>
                                                                    f.type.toLowerCase() ===
                                                                    p.type.toLowerCase()
                                                                ).value) ||
                                                              ""
                                                            }
                                                            onChange={(e) =>
                                                              this.handleChangeFlags(
                                                                e,
                                                                item,
                                                                i
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                      </td>
                                                    );
                                                  }
                                                )}

                                                {/* {item.flags &&
                                                  item.flags.length > 0 ? (
                                                    item.flags.map((f, ind) => {
                                                      return (
                                                        <td
                                                          className="text-left"
                                                          key={ind}
                                                        >
                                                          <div className="">
                                                            <input
                                                              type="text"
                                                              className="input_height  uppercaseText"
                                                              id="usr"
                                                              autoComplete="off"
                                                              name={f.type}
                                                              value={
                                                                f.value || ""
                                                              }
                                                              onChange={(e) =>
                                                                this.handleChangeFlags(
                                                                  e,
                                                                  item,
                                                                  i
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        </td>
                                                      );
                                                    })
                                                  ) : (
                                                    <>
                                                      <td className="text-left"></td>
                                                      <td className="text-left"></td>
                                                      <td className="text-left"></td>
                                                      <td className="text-left"></td>
                                                    </>
                                                  )} */}

                                                <td className="text-left">
                                                  <div
                                                    className="input_width m-0"
                                                    style={{ width: "100px" }}
                                                  >
                                                    <DatePicker
                                                      selected={Number(
                                                        item.date
                                                      )}
                                                      onKeyDown={(e) => {
                                                        if (e.key == "Tab") {
                                                          this.refs[
                                                            "exp" + i
                                                          ].setOpen(false);
                                                        }
                                                      }}
                                                      ref={"exp" + i}
                                                      className="uppercaseText"
                                                      dateFormat="d MMM yyyy"
                                                      autoComplete="off"
                                                      name="date"
                                                      onChange={(date) =>
                                                        this.hanldeExpenseLineFields(
                                                          date,
                                                          item,
                                                          i,
                                                          "date"
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>

                                                <td className="text-left exp-descript">
                                                  <input
                                                    type="text"
                                                    className="input_height uppercaseText"
                                                    name="description"
                                                    value={item.description}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="description"
                                                  />
                                                </td>

                                                <td className="text-left">
                                                  <input
                                                    type="text"
                                                    className="input_height wd-300 uppercaseText"
                                                    name="supplier"
                                                    value={item.supplier}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="supplier"
                                                  />
                                                </td>
                                                <td className="text-left">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="gross"
                                                    value={item.gross}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i,
                                                        "gross"
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="gross"
                                                  />
                                                </td>
                                                <td className="text-left ">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="tax"
                                                    value={item.tax}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i,
                                                        "tax"
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="tax"
                                                  />
                                                </td>

                                                <td className="text-left ">
                                                  <input
                                                    type="number"
                                                    className="input_height wd-108"
                                                    name="amount"
                                                    value={item.amount}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    onBlur={(e) =>
                                                      this.convertTwoDecimal(
                                                        e,
                                                        item
                                                      )
                                                    }
                                                    id="amount"
                                                  />
                                                  {/* {Number(item.amount).toFixed(2)} */}
                                                </td>

                                                {this.state.expenseType
                                                  .value === "Fuel" ||
                                                this.state.expenseType.value ===
                                                  "fuel" ? (
                                                  <>
                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="businessKM"
                                                        value={item.businessKM}
                                                        onChange={(e) =>
                                                          this.hanldeExpenseLineFields(
                                                            e,
                                                            item,
                                                            i
                                                          )
                                                        }
                                                        id="businessKM"
                                                      />
                                                    </td>

                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="perKM"
                                                        value={item.perKM}
                                                        onChange={(e) =>
                                                          this.hanldeExpenseLineFields(
                                                            e,
                                                            item,
                                                            i
                                                          )
                                                        }
                                                        id="perKM"
                                                      />
                                                    </td>
                                                    <td className="text-left ">
                                                      <input
                                                        type="number"
                                                        className="input_height wd-108"
                                                        name="docketAmount"
                                                        value={
                                                          item.docketAmount
                                                        }
                                                        onChange={(e) =>
                                                          this.hanldeExpenseLineFields(
                                                            e,
                                                            item,
                                                            i
                                                          )
                                                        }
                                                        onBlur={(e) =>
                                                          this.convertTwoDecimal(
                                                            e,
                                                            item
                                                          )
                                                        }
                                                        id="docketAmount"
                                                      />
                                                    </td>
                                                  </>
                                                ) : (
                                                  ""
                                                )}
                                                <td className="text-left pl-2">
                                                  {/* <input
                                                    type="number"
                                                    className="input_height"
                                                    name="line"
                                                    value={item.line}
                                                    onChange={(e) =>
                                                      this.hanldeExpenseLineFields(
                                                        e,
                                                        item,
                                                        i
                                                      )
                                                    }
                                                    id="line"
                                                  /> */}
                                                  {item.lineNo}
                                                </td>

                                                {/* <td className="text-left"></td> */}
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
                            {/* table end */}
                          </div>
                        </div>
                        {this.state.expenseType.value === "Fuel" ||
                        this.state.expenseType.value === "fuel" ? (
                          <>
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
                                          data-target="#logBook"
                                        />{" "}
                                      </span>
                                      Log Book
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="collapse show" id="logBook">
                              <div className="forgot_body">
                                <div className="col-12 mt-md-3 mb-1">
                                  <div className="forgot_header">
                                    <div className="modal-top-header">
                                      <div className="col-auto d-flex justify-content-end s-c-main p-0">
                                        <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                          <button
                                            type="button"
                                            className="btn-save exp-top-btn expxtopbtn1"
                                            onClick={this.addLogBookLines}
                                          >
                                            <span className="fa fa-plus-circle"></span>
                                          </button>
                                          <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                            <button
                                              type="button"
                                              className="btn-save exp-top-btn"
                                              onClick={this.removeLogBookItems}
                                            >
                                              <span className="fa fa-trash"></span>
                                            </button>
                                          </div>
                                          <div className="d-flex justify-content-end s-c-main w-sm-100">
                                            <Dropdown
                                              alignRight="false"
                                              drop="down"
                                              className="analysis-card-dropdwn float-right bg-tp exp_top_btn"
                                            >
                                              <Dropdown.Toggle
                                                variant="sucess"
                                                id="dropdown-basic"
                                              >
                                                <button
                                                  type="button"
                                                  className="btn-save exp-top-btn"
                                                >
                                                  <span className="fa fa-ellipsis-v"></span>
                                                </button>
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item>
                                                  Import
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                  Export
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* table start  */}
                                <div className="row mt-3">
                                  <div className="col-12">
                                    <div className="login_form">
                                      <div className="login_table_list table-reponsive">
                                        <table className="table  project_table shadow-none newpo--edit exp_edit exp_edit2">
                                          <thead>
                                            <tr>
                                              <th
                                                scope="col"
                                                className="exp_th1 mm_contact-name"
                                              >
                                                <div className="form-group">
                                                  <label className="dash_container dash_remember table-check unckeck">
                                                    <input
                                                      type="checkbox"
                                                      name={"chk1"}
                                                      id={"chk1"}
                                                      checked={
                                                        this.state
                                                          .checkAllLogBook
                                                      }
                                                      onChange={(e) =>
                                                        this.handleLogBookCheckBoxes(
                                                          e,
                                                          "all"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      id="chk1"
                                                      className="dash_checkmark"
                                                    ></span>
                                                  </label>
                                                </div>
                                              </th>
                                              <th className="text-left">
                                                {" "}
                                                Code
                                              </th>

                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Rego
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Date From
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Date To
                                              </th>

                                              <th
                                                scope="col"
                                                className="exp-descript text-left"
                                              >
                                                Description
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Start
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                End
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Bus KM
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Per KM
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left "
                                              >
                                                Var
                                              </th>
                                              {/* <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                <span className="fa fa-bars"></span>
                                              </th> */}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {this.state.logBook.map(
                                              (log, i) => {
                                                return (
                                                  <tr key={i}>
                                                    <td>
                                                      <div className="col align-self-center text-center pr-0">
                                                        <div className="form-group mb-0 check-line">
                                                          <label className="dash_container dash_remember table-check unckeck">
                                                            <input
                                                              type="checkbox"
                                                              name={"chk1"}
                                                              id={"chk1"}
                                                              checked={
                                                                log.checked
                                                              }
                                                              onChange={(e) =>
                                                                this.handleLogBookCheckBoxes(
                                                                  e,
                                                                  log,
                                                                  i
                                                                )
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
                                                      <input
                                                        type="text"
                                                        className="input_height uppercaseText"
                                                        autoFocus={
                                                          log.autoFocus
                                                        }
                                                        name="code"
                                                        value={log.code}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i
                                                          )
                                                        }
                                                        id="code"
                                                      />
                                                    </td>

                                                    <td className="text-left">
                                                      <input
                                                        type="text"
                                                        className="input_height uppercaseText"
                                                        name="rego"
                                                        value={log.rego}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i
                                                          )
                                                        }
                                                        id="rego"
                                                      />
                                                    </td>

                                                    <td className="text-left">
                                                      <div
                                                        className="input_width m-0"
                                                        style={{
                                                          width: "100px",
                                                        }}
                                                      >
                                                        <DatePicker
                                                          selected={Number(
                                                            log.dateFrom
                                                          )}
                                                          onKeyDown={(e) => {
                                                            if (
                                                              e.key == "Tab"
                                                            ) {
                                                              this.refs[
                                                                "logRef" + i
                                                              ].setOpen(false);
                                                            }
                                                          }}
                                                          ref={"logRef" + i}
                                                          className="uppercaseText"
                                                          dateFormat="d MMM yyyy"
                                                          autoComplete="off"
                                                          name="dateFrom"
                                                          onChange={(date) =>
                                                            this.hanldeLogBookLineFields(
                                                              date,
                                                              log,
                                                              i,
                                                              "dateFrom"
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    </td>

                                                    <td className="text-left">
                                                      <div
                                                        className="input_width m-0"
                                                        style={{
                                                          width: "100px",
                                                        }}
                                                      >
                                                        <DatePicker
                                                          selected={Number(
                                                            log.dateTo
                                                          )}
                                                          onKeyDown={(e) => {
                                                            if (
                                                              e.key == "Tab"
                                                            ) {
                                                              this.refs[
                                                                "log" + i
                                                              ].setOpen(false);
                                                            }
                                                          }}
                                                          ref={"log" + i}
                                                          className="uppercaseText"
                                                          dateFormat="d MMM yyyy"
                                                          autoComplete="off"
                                                          name="dateTo"
                                                          onChange={(date) =>
                                                            this.hanldeLogBookLineFields(
                                                              date,
                                                              log,
                                                              i,
                                                              "dateTo"
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    </td>

                                                    <td className="text-left">
                                                      <input
                                                        type="text"
                                                        className="input_height uppercaseText"
                                                        name="description"
                                                        value={log.description}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i
                                                          )
                                                        }
                                                        id="description"
                                                      />
                                                    </td>

                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="startOdometer"
                                                        value={
                                                          log.startOdometer
                                                        }
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i,
                                                            "startOdometer"
                                                          )
                                                        }
                                                        id="startOdometer"
                                                      />
                                                    </td>

                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="endOdometer"
                                                        value={log.endOdometer}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i,
                                                            "endOdometer"
                                                          )
                                                        }
                                                        id="endOdometer"
                                                      />
                                                    </td>
                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="businessKM"
                                                        value={log.businessKM}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i,
                                                            "businessKM"
                                                          )
                                                        }
                                                        id="businessKM"
                                                      />
                                                    </td>
                                                    <td className="text-left">
                                                      <input
                                                        type="number"
                                                        className="input_height"
                                                        name="perKM"
                                                        value={log.perKM}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i,
                                                            "perKM"
                                                          )
                                                        }
                                                        id="perKM"
                                                      />
                                                    </td>
                                                    <td className="text-left">
                                                      {/* <input
                                                        type="number"
                                                        className="input_height"
                                                        name="variance"
                                                        value={log.variance}
                                                        onChange={(e) =>
                                                          this.hanldeLogBookLineFields(
                                                            e,
                                                            log,
                                                            i
                                                          )
                                                        }
                                                        id="variance"
                                                      /> */}
                                                      {log.variance}
                                                    </td>

                                                    {/* <td className="text-left"></td> */}
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
                                {/* table end */}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {this.state.expenseType.value === "Fuel" ||
                        this.state.expenseType.value === "fuel" ? (
                          <>
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
                                          data-target="#vehicleLog"
                                        />{" "}
                                      </span>
                                      Vehicle Log
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="collapse show" id="vehicleLog">
                              <div className="forgot_body">
                                <div className="col-12 mt-md-3 mb-1">
                                  <div className="forgot_header">
                                    <div className="modal-top-header">
                                      <div className="col-auto d-flex justify-content-end s-c-main">
                                        <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                          {/* <button
                                            type="button"
                                            className="btn-save exp-top-btn expxtopbtn1"
                                          >
                                            <span className="fa fa-plus-circle"></span>
                                          </button> */}
                                          {/* <div className=" d-flex justify-content-end s-c-main w-sm-100">
                                            <button
                                              type="button"
                                              className="btn-save exp-top-btn"
                                              onClick={
                                                this.removeVehicleLogItems
                                              }
                                            >
                                              <span className="fa fa-trash"></span>
                                            </button>
                                          </div> */}
                                          <div className="d-flex justify-content-end s-c-main w-sm-100">
                                            <Dropdown
                                              alignRight="false"
                                              drop="down"
                                              className="analysis-card-dropdwn float-right bg-tp exp_top_btn"
                                            >
                                              <Dropdown.Toggle
                                                variant="sucess"
                                                id="dropdown-basic"
                                              >
                                                <button
                                                  type="button"
                                                  className="btn-save exp-top-btn"
                                                >
                                                  <span className="fa fa-ellipsis-v"></span>
                                                </button>
                                              </Dropdown.Toggle>
                                              <Dropdown.Menu>
                                                <Dropdown.Item>
                                                  Import
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                  Export
                                                </Dropdown.Item>
                                              </Dropdown.Menu>
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* table start  */}
                                <div className="row mt-3">
                                  <div className="col-12">
                                    <div className="login_form">
                                      <div className="login_table_list table-reponsive">
                                        <table className="table  project_table shadow-none newpo--edit exp_edit exp_edit3">
                                          <thead>
                                            <tr>
                                              <th
                                                scope="col"
                                                className="exp_th1 mm_contact-name"
                                              >
                                                <div className="form-group">
                                                  <label className="dash_container dash_remember table-check unckeck">
                                                    <input
                                                      type="checkbox"
                                                      name={"chk1"}
                                                      id={"chk1"}
                                                      checked={
                                                        this.state
                                                          .checkAllVehicleLog
                                                      }
                                                      onChange={(e) =>
                                                        this.handleVehicleLogCheckBoxes(
                                                          e,
                                                          "all"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      id="chk1"
                                                      className="dash_checkmark"
                                                    ></span>
                                                  </label>
                                                </div>
                                              </th>
                                              <th className="text-left">
                                                {" "}
                                                Source
                                              </th>

                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Rego
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Vehicle
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                OdmoStart
                                              </th>

                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                OdmoEnd
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                Driver
                                              </th>
                                              <th
                                                scope="col"
                                                className="exp-descript text-left"
                                              >
                                                Description
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                EmpCode
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                RANumber
                                              </th>
                                              <th
                                                scope="col"
                                                className="text-left "
                                              >
                                                HireState
                                              </th>
                                              {/* <th
                                                scope="col"
                                                className="text-left"
                                              >
                                                <span className="fa fa-bars"></span>
                                              </th> */}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {this.state.vehicleLog.map(
                                              (log, i) => {
                                                return (
                                                  <tr key={i}>
                                                    <td>
                                                      <div className="col align-self-center text-center pr-0">
                                                        <div className="form-group mb-0 check-line">
                                                          <label className="dash_container dash_remember table-check unckeck">
                                                            <input
                                                              type="checkbox"
                                                              name={"chk1"}
                                                              id={"chk1"}
                                                              checked={
                                                                this.state
                                                                  .checkAllVehicleLog
                                                              }
                                                              onChange={(e) =>
                                                                this.handleVehicleLogCheckBoxes(
                                                                  e,
                                                                  log,
                                                                  i
                                                                )
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
                                                    <td className="text-left uppercaseText">
                                                      {log.source}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.rego}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.vehicle}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.odometerStart}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.odometerEnd}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.driver}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.description}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.empCode}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.raNumber}
                                                    </td>
                                                    <td className="text-left uppercaseText">
                                                      {log.hireState}
                                                    </td>
                                                    {/* <td className="text-left"></td> */}
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
                                {/* table end */}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
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
                                      data-target="#expenseAttachments"
                                    />{" "}
                                  </span>
                                  Attachments
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="collapse show" id="expenseAttachments">
                          <div className="forgot_body">
                            <div className="col-12 mt-2">
                              <div className="form-group custon_select">
                                <div
                                  id="drop-area-exp"
                                  className="exp_drag_area"
                                >
                                  <input
                                    type="file"
                                    id="fileElem-attach"
                                    className="form-control d-none"
                                    // accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                                    // , application/pdf, image/jpeg,image/jpg,image/png,
                                    //  .csv, .xlsx, .xls,
                                    //  application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    //  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={(e) => {
                                      this.uploadAttachment(e.target.files);
                                    }}
                                    onClick={(event) => {
                                      event.currentTarget.value = null;
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
                                    {attachments.map((a, i) => {
                                      return (
                                        <li
                                          className={
                                            a.id === activeAtchID
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
                                                checked={a.id === activeAtchID}
                                                onChange={() => {
                                                  this.setState({
                                                    activeAtchID: a.id,
                                                    primDocName:
                                                      a.fileName || "",
                                                  });
                                                }}
                                              />
                                              <span className="click_checkmark"></span>
                                            </label>
                                          </div>

                                          <span className="fa fa-file"></span>
                                          <p
                                            onClick={() =>
                                              this.getAttachment(
                                                a.id,
                                                a.fileName
                                              )
                                            }
                                          >
                                            {a.fileName || ""}
                                          </p>
                                          <span
                                            onClick={() => {
                                              this.deleteExpAttachment(a);
                                            }}
                                            className="fa fa-times"
                                          ></span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="exp_radio_pad">
                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group">
                                    <label>
                                      Primary Document:{" "}
                                      {primDocName && (
                                        <p className="doc-primary-box">
                                          {" "}
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
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* end */}
        </div>

        <SupplierLookup
          openSupplierLookupModal={this.state.openSupplierLookupModal}
          closeModal={this.closeModal}
          suppliersList={this.state.suppliersList || []} //array of suppliers
          getSuppliersList={this.getSuppliersList} //function to get suppliers
          supplierCode={this.state.supplierCode || ""}
          updatePOSupplier={this.updateExpenseSupplier}
          props={this.props}
          stateData={this.state}
          page="addEditExpense"
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expenseData: state.expense,
  supplier: state.supplier,
  chart: state.chart,
  user: state.user,
});

export default connect(mapStateToProps, {
  getExpenseDetail: ExpenseActions.getExpenseDetail,
  insertExpense: ExpenseActions.insertExpense,
  updateExpense: ExpenseActions.updateExpense,
  deleteExpense: ExpenseActions.deleteExpense,
  addExpAttachment: ExpenseActions.addExpAttachment,
  getExpAttachment: ExpenseActions.getExpAttachment,
  updatePrimaryDocument: ExpenseActions.updatePrimaryDocument,
  deleteExpAttachment: ExpenseActions.deleteExpAttachment,
  addTaxLines: ExpenseActions.addTaxLines,
  addAdvancedLine: ExpenseActions.addAdvancedLine,
  addAccountedLine: ExpenseActions.addAccountedLine,
  getSupplier: SupplierActions.getSupplier,
  getSuppliersList: SupplierActions.getSuppliersList,
  getTaxCodes: ChartActions.getTaxCodes,
  getChartCodes: ChartActions.getChartCodes,
  getDefaultValues: UserActions.getDefaultValues,
  clearUserStates: UserActions.clearUserStates,
  clearChartStates: ChartActions.clearChartStates,
  clearSupplierStates: SupplierActions.clearSupplierStates,
  clearExpenseStates: ExpenseActions.clearExpenseStates,
  clearStatesAfterLogout: UserActions.clearStatesAfterLogout,
})(ExpenseForm);
