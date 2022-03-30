import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import { AppliedRoute } from "../Components/AppliedRoute/AppliedRoute";
import Login from "../Containers/Login/Login";
import RessetPassword from "../Containers/RessetPassword/RessetPassword";
import Verify from "../Containers/VerifyCode/VerifyCode";
import LoginTable from "../Containers/LoginTable/LoginTable";

import DashBoard from "../Containers/DashBoard/DashBoard";

import Order from "../Containers/Orders/Orders";
import OrderDetail from "../Containers/OrderDetail/OrderDetail";
import DisplayOrderDetail from "../Containers/DisplayOrderDetail/DisplayOrderDetail";
import ReceivedOrder from "../Containers/ReceivedOrder/ReceivedOrder";
import EditReceivedOrder from "../Containers/EditReceivedOrder/EditReceivedOrder";
import PastReceivedOrder from "../Containers/PastReceivedOrder/PastReceivedOrder";
import NewPoEdit from "../Containers/NewPoEdit/NewPoEdit";
// import POTransfer from "../Containers/POTransfer/POTransfer";
import POLog from "../Containers/POLog/PoLog";

import Invoice from "../Containers/Invoice/Invoice";
import InvoiceDetail from "../Containers/InvoiceDetail/InvoiceDetail";
import AddNewInvoice from "../Containers/AddNewInvoice/AddNewInvoice";
import DisplayInvoiceDetail from "../Containers/DisplayInvoiceDetails/DisplayInvoiceDetails";
import InvoiceEdit from "../Containers/InvoiceEdit/InvoiceEdit";

import Suppliers from "../Containers/Suppliers/Suppliers";
import Suppliers2 from "../Containers/Supplier2/Suppliers2";
import NewSupplier2 from "../Containers/NewSupplier2/NewSupplier";
import Analysis from "../Containers/Analysis/Analysis";
import Report from "../Containers/Report/Report";
import ReportView from "../Containers/ReportView/ReportView";
import ExternalLink from "../Containers/ExternalLink/ExternalLink";
import Search from "../Containers/Search/Search";
import ChartOfAccount from "../Containers/ChartOfAccount/ChartOfAccount";

import Expenses from "../Containers/Expenses/Expenses";
import ExpenseForm from "../Containers/ExpenseForm/ExpenseForm";

import Settings from "../Containers/Settings/Settings";

import Documents from "../Containers/Documents/Documents";
import DocumentsForm from "../Containers/DocumentsForm/DocumentsForm";

import UserSetup from "../Containers/Setup/UserSetup/UserSetup";
import ApprovalSetup from "../Containers/Setup/ApprovalSetup/ApprovalSetup";
import ChartOfAccounts from "../Containers/Setup/ChartOfAccounts/ChartOfAccounts";
import IndirectTaxCodes from "../Containers/Setup/IndirectTaxCodes/IndirectTaxCodes";
import BusinessUnits from "../Containers/Setup/BusinessUnits/BusinessUnits";
import Departments from "../Containers/Setup/Departments/Departments";
import CustomFields from "../Containers/Setup/CustomFields/CustomFields";
import CustomLineType from "../Containers/Setup/CustomLineType/CustomLineType";
import Currencies from "../Containers/Setup/Currencies/Currencies";
import ChartSortOrCodeLayout from "../Containers/Setup/ChartSortOrCodeLayout/ChartSortOrCodeLayout";
import TrackingCodesLayout from "../Containers/Setup/TrackingCodesLayout/TrackingCodesLayout";
import OrderTemplate from "../Containers/Setup/OrderTemplate/OrderTemplate";
import EmailTemplate from "../Containers/Setup/EmailTemplate/EmailTemplate";
import InvoiceOcrSetup from "../Containers/Setup/InvoiceOcrSetup/InvoiceOcrSetup";
import UserDefaults from "../Containers/Setup/UserDefaults/UserDefaults";
import SystemDefaults from "../Containers/Setup/SystemDefaults/SystemDefaults";
import BatchList from "../Containers/Setup/BatchList/BatchList";
import CurrenciesDetails from "../Containers/Setup/CurrenciesDetails/CurrenciesDetails";
import Journals from "../Containers/Journals/Journals";
import JournalForm from "../Containers/JournalForm/JournalForm";
import DistChange from "../Containers/DistChanges/DistChanges";
import DistChangesForm from "../Containers/DistChangesForm/DistChangesForm";
import Payments from "../Containers/Payments/Payments";
import Timecards from "../Containers/Timecards/Timecards";
import AddEditTimecard from "../Containers/AddEditTimecard/AddEditTimecard";

import Singnature from "../Containers/Signature/Signature";

const My404Component = () => {
  return <h3 className="_404">404 - Not found</h3>;
};

export default (childProps) => (
  <Router>
    <Switch>
      <AppliedRoute path="/" exact component={Login} props={childProps} />
      <AppliedRoute path="/login" exact component={Login} props={childProps} />
      <AppliedRoute
        path="/ressetPassword"
        exact
        component={RessetPassword}
        props={childProps}
      />
      <AppliedRoute
        path="/verify"
        exact
        component={Verify}
        props={childProps}
      />
      <AppliedRoute
        path="/login-table"
        exact
        component={LoginTable}
        props={childProps}
      />
      <AppliedRoute
        path="/dashboard"
        exact
        component={DashBoard}
        props={childProps}
      />
      <AppliedRoute
        path="/settings"
        exact
        component={Settings}
        props={childProps}
      />
      <AppliedRoute path="/order" exact component={Order} props={childProps} />
      <AppliedRoute
        path="/order-detail"
        exact
        component={OrderDetail}
        props={childProps}
      />
      <AppliedRoute
        path="/display-order-detail"
        exact
        component={DisplayOrderDetail}
        props={childProps}
      />
      <AppliedRoute
        path="/received-order"
        exact
        component={ReceivedOrder}
        props={childProps}
      />
      <AppliedRoute
        path="/edit-received-order"
        exact
        component={EditReceivedOrder}
        props={childProps}
      />
      <AppliedRoute
        path="/past-received-order"
        exact
        component={PastReceivedOrder}
        props={childProps}
      />
      <AppliedRoute
        path="/new-purchase-order"
        exact
        component={NewPoEdit}
        props={childProps}
      />
      {/* <AppliedRoute path="/po-transfer" exact component={POTransfer} props={childProps} /> */}
      <AppliedRoute
        path="/po-logs"
        exact
        component={POLog}
        props={childProps}
      />
      <AppliedRoute
        path="/invoice"
        exact
        component={Invoice}
        props={childProps}
      />
      <AppliedRoute
        path="/invoice-detail"
        exact
        component={InvoiceDetail}
        props={childProps}
      />
      <AppliedRoute
        path="/invoice-edit"
        exact
        component={InvoiceEdit}
        props={childProps}
      />
      <AppliedRoute
        path="/display-invoice-detail"
        exact
        component={DisplayInvoiceDetail}
        props={childProps}
      />
      <AppliedRoute
        path="/add-new-invoice"
        exact
        component={AddNewInvoice}
        props={childProps}
      />
      <AppliedRoute
        path="/suppliers"
        exact
        component={Suppliers}
        props={childProps}
      />
      <AppliedRoute
        path="/suppliers2"
        exact
        component={Suppliers2}
        props={childProps}
      />
      <AppliedRoute
        path="/new-supplier2"
        exact
        component={NewSupplier2}
        props={childProps}
      />
      <AppliedRoute
        path="/analysis"
        exact
        component={Analysis}
        props={childProps}
      />
      <AppliedRoute
        path="/report"
        exact
        component={Report}
        props={childProps}
      />
      <AppliedRoute
        path="/report-view"
        exact
        component={ReportView}
        props={childProps}
      />
      <AppliedRoute
        path="/external"
        exact
        component={ExternalLink}
        props={childProps}
      />
      <AppliedRoute
        path="/search"
        exact
        component={Search}
        props={childProps}
      />
      <AppliedRoute
        path="/expenses"
        exact
        component={Expenses}
        props={childProps}
      />
      <AppliedRoute
        path="/expense-form"
        exact
        component={ExpenseForm}
        props={childProps}
      />
      <AppliedRoute
        path="/chartofaccount"
        exact
        component={ChartOfAccount}
        props={childProps}
      />
      <AppliedRoute
        path="/documents"
        exact
        component={Documents}
        props={childProps}
      />
      <AppliedRoute
        path="/documents-form"
        exact
        component={DocumentsForm}
        props={childProps}
      />
      <AppliedRoute
        path="/user-setup"
        exact
        component={UserSetup}
        props={childProps}
      />
      <AppliedRoute
        path="/user-defaults"
        exact
        component={UserDefaults}
        props={childProps}
      />
      <AppliedRoute
        path="/tracking-codes-layout"
        exact
        component={TrackingCodesLayout}
        props={childProps}
      />
      <AppliedRoute
        path="/system-defaults"
        exact
        component={SystemDefaults}
        props={childProps}
      />
      <AppliedRoute
        path="/invoice-ocr-setup"
        exact
        component={InvoiceOcrSetup}
        props={childProps}
      />
      <AppliedRoute
        path="/indirect-tax-codes"
        exact
        component={IndirectTaxCodes}
        props={childProps}
      />
      <AppliedRoute
        path="/departments"
        exact
        component={Departments}
        props={childProps}
      />
      <AppliedRoute
        path="/custom-line-type"
        exact
        component={CustomLineType}
        props={childProps}
      />
      <AppliedRoute
        path="/custom-fields"
        exact
        component={CustomFields}
        props={childProps}
      />
      <AppliedRoute
        path="/currencies"
        exact
        component={Currencies}
        props={childProps}
      />
      <AppliedRoute
        path="/chart-of-accounts"
        exact
        component={ChartOfAccounts}
        props={childProps}
      />
      <AppliedRoute
        path="/chart-setup"
        exact
        component={ChartSortOrCodeLayout}
        props={childProps}
      />
      <AppliedRoute
        path="/business-units"
        exact
        component={BusinessUnits}
        props={childProps}
      />
      <AppliedRoute
        path="/batch-list"
        exact
        component={BatchList}
        props={childProps}
      />
      <AppliedRoute
        path="/approval-setup"
        exact
        component={ApprovalSetup}
        props={childProps}
      />
      <AppliedRoute
        path="/email-template"
        exact
        component={EmailTemplate}
        props={childProps}
      />
      <AppliedRoute
        path="/currencies-details"
        exact
        component={CurrenciesDetails}
        props={childProps}
      />
      <AppliedRoute
        path="/order-template"
        exact
        component={OrderTemplate}
        props={childProps}
      />
      <AppliedRoute
        path="/journals"
        exact
        component={Journals}
        props={childProps}
      />
      <AppliedRoute
        path="/journal-form"
        exact
        component={JournalForm}
        props={childProps}
      />
      <AppliedRoute
        path="/dist-changes"
        exact
        component={DistChange}
        props={childProps}
      />
      <AppliedRoute
        path="/dist-changes-form"
        exact
        component={DistChangesForm}
        props={childProps}
      />
      <AppliedRoute
        path="/payments"
        exact
        component={Payments}
        props={childProps}
      />
      <AppliedRoute
        path="/timecards"
        exact
        component={Timecards}
        props={childProps}
      />
      <AppliedRoute
        path="/add-edit-timecard"
        exact
        component={AddEditTimecard}
        props={childProps}
      />

      <AppliedRoute
        path="/signature"
        exact
        component={Singnature}
        props={childProps}
      />

      <AppliedRoute path="*" exact={true} component={My404Component} />
    </Switch>
  </Router>
);
