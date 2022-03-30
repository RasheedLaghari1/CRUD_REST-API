import { toast } from "react-toastify";
import store from "../Store/index";
import $ from "jquery";
import FileSaver from "file-saver";

//a function that checks  api error
export function handleAPIErr(error, props) {
  if (
    error === "Session has expired. Please login again." ||
    error === "User has not logged in."
  ) {
    store.dispatch({
      type: "CLEAR_STATES_AFTER_LOGOUT",
    });
    props.history.push("/login");
    toast.error(error);
  } else if (error === "User has not logged into a production.") {
    toast.error(error);
    props.history.push("/login-table");
  } else {
    //Netork Error || api error
    toast.error(error);
  }
}

export function clearFormErrors(formErrors) {
  Object.keys(formErrors).map(function (key) {
    formErrors[key] = "";
  });
  return formErrors;
}
//DataTable Save Settings
export function handleSaveSettings(columns, name, pageLength) {
  //columns -> table columns, name -> table name
  let aoColumns =
    window
      .$("#" + name)
      .DataTable()
      .settings()[0].aoColumns || [];
  columns.map((c, i) => {
    if (c.hide) {
      let col = aoColumns.find((a) => a.sName === c.name);
      if (col) {
        window
          .$("#" + name)
          .DataTable()
          .column(col.idx)
          .visible(false);
      }
    } else {
      let col = aoColumns.find((a) => a.sName === c.name);
      if (col) {
        window
          .$("#" + name)
          .DataTable()
          .column(col.idx)
          .visible(true);
      }
    }
  });
  window
    .$("#" + name)
    .DataTable()
    .page.len(Number(pageLength))
    .draw();
  toast.success("Settings updated successfully.");
}
//DataTable Close Settings
export function handleCloseSettingModal(columns, name) {
  //columns -> table columns, name -> table name
  let data = JSON.parse(localStorage.getItem("DataTables_" + name));
  //update state to show which columns are hidden
  let cols =
    window
      .$("#" + name)
      .DataTable()
      .settings()[0].aoColumns || [];
  columns.map((c, i) => {
    let col = cols.find((a) => a.sName === c.name);
    if (col && !col.bVisible) {
      c.hide = true;
    } else {
      c.hide = false;
    }
  });
  return { pageLength: data.length || 10, columns };
}
//DataTable Main tables Initialization
export function tableSetting(columns, aoColumns, name) {
  window.$("#" + name).DataTable({
    language: {
      searchPlaceholder: "Search",
    },
    dom: "Rlfrtip",
    aoColumns, //default table Columns
    stateSave: true,
    stateSaveCallback: function (settings, data) {
      localStorage.setItem("DataTables_" + name, JSON.stringify(data));
    },
    stateLoadCallback: function (settings) {
      return JSON.parse(localStorage.getItem("DataTables_" + name));
    },
    order: [[1, "asc"]],
    colReorder: {
      fixedColumnsRight: 1,
      fixedColumnsLeft: 1,
    },
  });

  //update state to show which columns are hidden
  let cols =
    window
      .$("#" + name)
      .DataTable()
      .settings()[0].aoColumns || [];
  columns.map((c, i) => {
    let col = cols.find((a) => a.sName === c.name);
    if (col && !col.bVisible) {
      c.hide = true;
    } else {
      c.hide = false;
    }
  });

  let pageLength =
    window
      .$("#" + name)
      .DataTable()
      .page.len() || 10;
  return { pageLength };
}
//datatable filter card functionality
export function filterBox(name) {
  debugger;

  $(document).ready(function () {
    $("body").on("mouseover", `#${name}_filter label`, function (e) {
      // setTimeout(function () {
      $(`#object1`).remove();
      $(`#${name}_filter label`).append('<div id="object1"></div>');
      // }, 500);
    });

    $("body").on("mouseover", `#object1`, function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    $("body").on("click", "#object1", function (e) {
      e.preventDefault();
      e.stopPropagation();
      $("#filter_dropdpwn1").toggle();
      $("#filter_dropdpwn2").hide();
    });
    $(".plus_icon-filter_bottom").click(function () {
      $("#filter_dropdpwn2").toggle();
    });
    $("body").on("click", ".pop-cros-1", function () {
      $("#filter_dropdpwn2").hide();
      $("#filter_dropdpwn1").hide();
    });
    $(".close_top_sec").click(function () {
      $(".user_setup_headerbox").hide();
    });
  });

  // $(document).ready(function () {
  // $("body").on("click", `.user_setup_main #${name}_filter`, function (e) {
  //   setTimeout(function () {
  //     $(`#${name}_filter label`).append('<div id="object1"></div>');
  //   }, 500);
  // });
  // $("body").on("click", ".user_setup_main #object1", function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   $("#filter_dropdpwn1").toggle();
  //   $("#filter_dropdpwn2").hide();
  // });
  // $(".plus_icon-filter_bottom").click(function () {
  //   $("#filter_dropdpwn2").toggle();
  // });
  // $("body").on("click", ".pop-cros-1", function () {
  //   $("#filter_dropdpwn2").hide();
  //   $("#filter_dropdpwn1").hide();
  // });
  // $(".close_top_sec").click(function () {
  //   $(".user_setup_headerbox").hide();
  // });
  // });
}
/*******Invoice/Document/Expense pdf zoom functionality********/
export function zoomIn(scal) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (scal) {
    case 1.3:
      scaling = 1.6;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case 1.6:
      scaling = 1.9;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case 1.9:
      scaling = 2.2;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case 2.2:
      scaling = 2.5;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case 2.5:
      scaling = 2.8;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case 2.8:
      scaling = 3.1;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case 3.1:
      scaling = 3.4;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case 3.4:
      scaling = 3.7;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case 3.7:
      scaling = 4;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case 4:
      scaling = 4.3;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case 4.3:
      scaling = 4.6;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case 4.6:
      scaling = 4.9;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case 4.9:
      scaling = 5.2;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case 5.2:
      scaling = 5.5;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case 5.5:
      scaling = 5.8;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case 5.8:
      scaling = 6.1;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case 6.1:
      scaling = 6.4;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case 6.4:
      scaling = 6.7;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
    case 6.7:
    case 7:
      scaling = 7;
      dropdownZoomingValue = { label: "100%", value: "100%" };
      zoom = "100%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
export function zoomOut(scal) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (scal) {
    case 1.6:
    case 1.3:
      scaling = 1.3;
      dropdownZoomingValue = { label: "5%", value: "5%" };
      zoom = "5%";
      break;
    case 1.9:
      scaling = 1.6;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case 2.2:
      scaling = 1.9;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case 2.5:
      scaling = 2.2;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case 2.8:
      scaling = 2.5;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case 3.1:
      scaling = 2.8;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case 3.4:
      scaling = 3.1;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case 3.7:
      scaling = 3.4;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case 4:
      scaling = 3.7;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case 4.3:
      scaling = 4;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case 4.6:
      scaling = 4.3;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case 4.9:
      scaling = 4.6;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case 5.2:
      scaling = 4.9;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case 5.5:
      scaling = 5.2;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case 5.8:
      scaling = 5.5;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case 6.1:
      scaling = 5.8;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case 6.4:
      scaling = 6.1;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case 6.7:
      scaling = 6.4;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case 7:
      scaling = 6.7;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
export function handleDropdownZooming(val) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (val) {
    case "5%":
      scaling = 1.3;
      dropdownZoomingValue = { label: "5%", value: "5%" };
      zoom = "5%";
      break;
    case "10%":
      scaling = 1.6;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case "15%":
      scaling = 1.9;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case "20%":
      scaling = 2.2;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case "25%":
      scaling = 2.5;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case "30%":
      scaling = 2.8;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case "35%":
      scaling = 3.1;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case "40%":
      scaling = 3.4;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case "45%":
      scaling = 3.7;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case "50%":
      scaling = 4;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case "55%":
      scaling = 4.3;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case "60%":
      scaling = 4.6;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case "65%":
      scaling = 4.9;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case "70%":
      scaling = 5.2;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case "75%":
      scaling = 5.5;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case "80%":
      scaling = 5.8;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case "85%":
      scaling = 6.1;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case "90%":
      scaling = 6.4;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case "95%":
      scaling = 6.7;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
    case "100%":
      scaling = 7;
      dropdownZoomingValue = { label: "100%", value: "100%" };
      zoom = "100%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
/*******END********/
/*******Document Form & Add New Invoice pdf zomom functionality********/
export function pdfViewerZoomIn(scal) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (scal) {
    case 0.5:
      scaling = 0.8;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case 0.8:
      scaling = 1.1;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case 1.1:
      scaling = 1.4;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case 1.4:
    case 1.3:
      scaling = 1.7;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case 1.7:
      scaling = 2;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case 2:
      scaling = 2.3;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case 2.3:
      scaling = 2.6;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case 2.6:
      scaling = 2.9;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case 2.9:
      scaling = 3.2;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case 3.2:
      scaling = 3.5;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case 3.5:
      scaling = 3.8;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case 3.8:
      scaling = 4.1;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case 4.1:
      scaling = 4.4;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case 4.4:
      scaling = 4.7;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case 4.7:
      scaling = 5;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case 5:
      scaling = 5.3;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case 5.3:
      scaling = 5.6;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case 5.6:
      scaling = 5.9;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
    case 5.9:
    case 6.2:
      scaling = 6.2;
      dropdownZoomingValue = { label: "100%", value: "100%" };
      zoom = "100%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
export function pdfViewerZoomOut(scal) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (scal) {
    case 0.8:
    case 0.5:
      scaling = 0.5;
      dropdownZoomingValue = { label: "5%", value: "5%" };
      zoom = "5%";
      break;
    case 1.1:
      scaling = 0.8;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case 1.4:
    case 1.3:
      scaling = 1.1;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case 1.7:
      scaling = 1.4;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case 2:
      scaling = 1.7;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case 2.3:
      scaling = 2;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case 2.6:
      scaling = 2.3;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case 2.9:
      scaling = 2.6;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case 3.2:
      scaling = 2.9;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case 3.5:
      scaling = 3.2;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case 3.8:
      scaling = 3.5;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case 4.1:
      scaling = 3.8;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case 4.4:
      scaling = 4.1;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case 4.7:
      scaling = 4.4;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case 5:
      scaling = 4.7;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case 5.3:
      scaling = 5;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case 5.6:
      scaling = 5.3;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case 5.9:
      scaling = 5.6;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case 6.2:
      scaling = 5.9;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
export function pdfViewerSelect(val) {
  let scaling = "";
  let dropdownZoomingValue = "";
  let zoom = "";
  switch (val) {
    case "5%":
      scaling = 0.5;
      dropdownZoomingValue = { label: "5%", value: "5%" };
      zoom = "5%";
      break;
    case "10%":
      scaling = 0.8;
      dropdownZoomingValue = { label: "10%", value: "10%" };
      zoom = "10%";
      break;
    case "15%":
      scaling = 1.1;
      dropdownZoomingValue = { label: "15%", value: "15%" };
      zoom = "15%";
      break;
    case "20%":
      scaling = 1.4;
      dropdownZoomingValue = { label: "20%", value: "20%" };
      zoom = "20%";
      break;
    case "25%":
      scaling = 1.7;
      dropdownZoomingValue = { label: "25%", value: "25%" };
      zoom = "25%";
      break;
    case "30%":
      scaling = 2;
      dropdownZoomingValue = { label: "30%", value: "30%" };
      zoom = "30%";
      break;
    case "35%":
      scaling = 2.3;
      dropdownZoomingValue = { label: "35%", value: "35%" };
      zoom = "35%";
      break;
    case "40%":
      scaling = 2.6;
      dropdownZoomingValue = { label: "40%", value: "40%" };
      zoom = "40%";
      break;
    case "45%":
      scaling = 2.9;
      dropdownZoomingValue = { label: "45%", value: "45%" };
      zoom = "45%";
      break;
    case "50%":
      scaling = 3.2;
      dropdownZoomingValue = { label: "50%", value: "50%" };
      zoom = "50%";
      break;
    case "55%":
      scaling = 3.5;
      dropdownZoomingValue = { label: "55%", value: "55%" };
      zoom = "55%";
      break;
    case "60%":
      scaling = 3.8;
      dropdownZoomingValue = { label: "60%", value: "60%" };
      zoom = "60%";
      break;
    case "65%":
      scaling = 4.1;
      dropdownZoomingValue = { label: "65%", value: "65%" };
      zoom = "65%";
      break;
    case "70%":
      scaling = 4.4;
      dropdownZoomingValue = { label: "70%", value: "70%" };
      zoom = "70%";
      break;
    case "75%":
      scaling = 4.7;
      dropdownZoomingValue = { label: "75%", value: "75%" };
      zoom = "75%";
      break;
    case "80%":
      scaling = 5;
      dropdownZoomingValue = { label: "80%", value: "80%" };
      zoom = "80%";
      break;
    case "85%":
      scaling = 5.3;
      dropdownZoomingValue = { label: "85%", value: "85%" };
      zoom = "85%";
      break;
    case "90%":
      scaling = 5.6;
      dropdownZoomingValue = { label: "90%", value: "90%" };
      zoom = "90%";
      break;
    case "95%":
      scaling = 5.9;
      dropdownZoomingValue = { label: "95%", value: "95%" };
      zoom = "95%";
      break;
    case "100%":
      scaling = 6.2;
      dropdownZoomingValue = { label: "100%", value: "100%" };
      zoom = "100%";
      break;
  }

  return {
    scale: scaling,
    dropdownZoomingValue,
    zoom,
  };
}
/*******END********/

/*******Downloads Attachments********/
export async function downloadAttachments(resp, fileName, showImage = false) {
  if (resp.contentType == "application/pdf") {
    if (resp.isDownload) {
      //download pdf
      const a = document.createElement("a");
      a.href = `data:application/pdf;base64,${resp.attachment}`;
      a.download = resp.fileName || "download.pdf";
      a.click();
    } else {
      //display pdf
      let pdfWindow = await window.open("about:blank");
      if (pdfWindow) {
        pdfWindow.document
          .open()
          .write(
            "<html><head><title>Preview</title></head><body style='margin:0; text-align: center;'><style>body{margin:0;} .previewLoading { display:none; } </style><iframe width='100%' height='100%' style='border:0;' src='data:application/pdf;base64, " +
              encodeURI(resp.attachment) +
              "'></iframe></body></html>"
          );
      } else {
        toast.error("Please Allow Browser Pop-ups!");
      }
    }
  } else if (resp.contentType == "application/vnd.ms-excel") {
    let blob = new Blob([s2ab(atob(resp.attachment))], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
    });

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || "download.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (resp.contentType == "application/xml") {
    const a = document.createElement("a");

    a.href = `data:application/xml;base64,${resp.attachment}`;
    a.download = fileName || "download.xml";
    a.click();
  } else if (resp.contentType == "application/msword") {
    let a = document.createElement("a"); //Create <a>
    a.href =
      "data:application/vnd.openxmlformats-officedocument.wordprocessing;base64," +
      resp.attachment;
    a.download = fileName || "download.docx"; //File name Here
    a.click(); //Downloaded file
  } else if (resp.contentType == "application/vnd.ms-powerpoint") {
    let a = document.createElement("a"); //Create <a>
    a.href =
      "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64," +
      resp.attachment;
    a.download = fileName || "download.ppt"; //File name Here
    a.click(); //Downloaded file
  } else if (resp.contentType == "text/csv") {
    const csv = atob(resp.attachment);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    FileSaver.saveAs(csvData, fileName + ".csv" || "attachment.csv");
  } else {
    //image
    if (showImage) {
      let newWindow = window.open("about:blank");
      if (newWindow) {
        newWindow.document
          .open()
          .write(
            "<html><head><title>Preview</title></head><body style='margin:0; text-align: center;'><style>body{margin:0;} .previewLoading { display:none; } </style><iframe width='100%' height='100%' style='border:0;' src='data:image/jpeg;base64, " +
              encodeURI(resp.attachment) +
              "'></iframe></body></html>"
          );
      } else {
        toast.error("Please Allow Browser Pop-ups!");
      }
    } else {
      let a = document.createElement("a"); //Create <a>
      a.href = "data:image/png;base64," + resp.attachment;
      a.download = fileName || "attachment"; //File name Here
      a.click(); //Downloaded file
    }
  }
}
/*******Excell string to array buffer********/
function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
/******Convert any Attachment to base64********/
export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//************ */Drag and Drop Files************
export function addDragAndDropFileListners(id, uploadAttachment) {
  const dropArea = document.getElementById(id);
  if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unHightLight, false);
    });
    dropArea.addEventListener(
      "drop",
      (e) => handleDrop(e, uploadAttachment),
      false
    );
  }
}
export function removeDragAndDropFileListners(id, uploadAttachment) {
  const dropArea = document.getElementById(id);
  if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.removeEventListener(eventName, preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.removeEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.removeEventListener(eventName, unHightLight, false);
    });
    dropArea.removeEventListener(
      "drop",
      (e) => handleDrop(e, uploadAttachment),
      false
    );
  }
}
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
function highlight() {
  const ele = document.querySelector(".upload-label");
  if (ele) {
    ele.style.backgroundColor = "#e9e9e9";
    ele.style.border = "2px dotted #999";
  }
}
function unHightLight() {
  const ele = document.querySelector(".upload-label");
  if (ele) {
    ele.style.backgroundColor = "#f6f6f6";
    ele.style.border = "unset";
  }
}
function handleDrop(e, uploadAttachment) {
  const dt = e.dataTransfer;
  const { files } = dt;
  uploadAttachment(files);
}
// ***************END*************

//Advanced List handlers
export function handleValueOptions(
  type,
  val,
  item,
  index,
  advancedList,
  clonedAdvancedList
) {
  //type -> list, date, checkbox, input fields
  //val -> value/event
  //item -> current row that is going to edit
  //index -> index of the row that is being edit

  if (type === "list") {
    item.value = val.value;
    advancedList[index] = item;
  } else if (type === "multiList") {
    item.multiValue = val || [];
    advancedList[index] = item;
  } else if (type === "date") {
    item.value = new Date(val).getTime();
    advancedList[index] = item;
  } else if (type === "checkbox") {
    item.value = val.target.checked ? "Y" : "N";
    advancedList[index] = item;
  } else {
    //input fields
    item.value = val.target.value;
    advancedList[index] = item;
  }
  //also update data in cloned advanced list
  let foundIndex = clonedAdvancedList.findIndex((x) => x.id == item.id);
  if (foundIndex > -1) {
    clonedAdvancedList[foundIndex] = item;
  }

  return {
    advancedList,
    clonedAdvancedList,
  };
}
export function handleHideUnhideRows(
  item,
  tableID,
  advnLstKey,
  mainLstt,
  clonedMainList,
  showHiddenRows = false
) {
  //advnLstKey -> key in which  the setting of the table is going to saved
  //tableID -> id of the table
  //mainLstt -> orignal list
  //clonedMainList -> a copy of mainLstt

  let mainList = JSON.parse(JSON.stringify(mainLstt));
  let table = window.$(tableID).DataTable();
  table.destroy();

  if (!item.hide) {
    //hide row
    let list = mainList.filter((l) => l.id != item.id);

    item.hide = true;
    let foundIndex = clonedMainList.findIndex((x) => x.id == item.id);
    clonedMainList[foundIndex] = item;
    //also save this setting on Local Storage
    let advList = JSON.parse(localStorage.getItem(advnLstKey) || "[]");
    if (advList && advList.length > 0) {
      let check = true;
      advList.map((al, i) => {
        if (
          al.category === item.category &&
          al.alescription === item.description &&
          al.valueType === item.valueType
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
        advList.push(obj);

        localStorage.setItem(advnLstKey, JSON.stringify(advList));
      }
    } else {
      //advList doesn't contain in local storage

      let advList = [];
      let obj = {
        category: item.category,
        description: item.description,
        valueType: item.valueType,
      };
      advList.push(obj);

      localStorage.setItem(advnLstKey, JSON.stringify(advList));
    }

    mainList = list;
    showHiddenRows = false;
  } else {
    //un-hide row
    item.hide = false;

    let _foundIndex = mainList.findIndex((x) => x.id == item.id);
    mainList[_foundIndex] = item;

    let foundIndex = clonedMainList.findIndex((x) => x.id == item.id);
    clonedMainList[foundIndex] = item;

    //also remove this setting on Local Storage
    let savedData = localStorage.getItem(advnLstKey);
    if (savedData) {
      let advList = JSON.parse(localStorage.getItem(advnLstKey) || "[]");
      if (advList.length > 0) {
        let lstArr = [];
        advList.map((d, i) => {
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
          localStorage.setItem(advnLstKey, JSON.stringify(lstArr));
        } else {
          localStorage.removeItem(advnLstKey);
        }
      }
    }
  }

  return {
    advancedList: mainList,
    clonedAdvancedList: clonedMainList,
    showHiddenRows,
  };
}
//End
