import { combineReducers } from "redux";
import UserReducer from "./UserReducer/UserReducer";
import SuppliersReducer from "./SuppliersReducer/SuppliersReducer";
import PO from "./POReducer/POReducer";
import Invoice from "./InvoiceRducer/InvoiceRducer";
import Chart from "./ChartReducer/ChartReducer";
import Report from "./ReportReducer/ReportReducer";
import Document from "./DocumentReducer/DocumentReducer";
import Expense from "./ExpenseReducer/ExpenseReducer";
import Setup from "./SetupReducer/SetupReducer";
import Payments from "./PaymentReducer/PaymentReducer";
import Journal from "./JournalReducer/JournalReducer";
import Timecard from "./TimecardReducer/TimecardReducer";

const reducers = combineReducers({
  user: UserReducer,
  supplier: SuppliersReducer,
  poData: PO,
  invoice: Invoice,
  chart: Chart,
  report: Report,
  document: Document,
  expense: Expense,
  setup: Setup,
  payments: Payments,
  journal: Journal,
  timecard: Timecard,
});

export default reducers;
