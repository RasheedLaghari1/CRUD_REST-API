import React, { Component } from "react";
import "./stimulsoft.viewer.office2013.whiteblue.css";
class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let jsonData = localStorage.getItem("jsonData");
    let key = localStorage.getItem("key");
    let reportFile = localStorage.getItem("reportFile");

    if (jsonData && key && reportFile) {
      var previewData = jsonData;
      console.log("Creating the report viewer with default options");
      var viewer = new window.Stimulsoft.Viewer.StiViewer(
        null,
        "StiViewer",
        false
      );

      console.log("Creating a new report instance");
      var report = new window.Stimulsoft.Report.StiReport();

      console.log("Load report from url");
      report.loadFile(
        "data:application/octet-stream;base64," + reportFile
      );

      report.dictionary.databases.clear();
      report.regData("currency", "currency", previewData);

      console.log(
        "Assigning report to the viewer, the report will be built automatically after rendering the viewer"
      );
      viewer.report = report;

      console.log("Rendering the viewer to selected element");
      viewer.renderHtml("viewer");
    } else {
      this.props.history.push("/report");
    }
  }

  render() {
    return <div id="viewer"></div>;
  }
}

export default ReportView;
