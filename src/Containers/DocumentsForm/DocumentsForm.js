import React, { Component } from "react";
import Select from "react-select";
import Header from "../Common/Header/Header";
import TopNav from "../Common/TopNav/TopNav";
import DatePicker from "react-datepicker";
import { Document, Page } from "react-pdf";
import $ from "jquery";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { components } from "react-select";
import AddNewType from "./AddNewType";
import * as DocumentActions from "../../Actions/DocumentActions/DocumentActions";
import { clearStatesAfterLogout } from "../../Actions/UserActions/UserActions";
import {
  handleAPIErr,
  pdfViewerZoomIn,
  pdfViewerZoomOut,
  pdfViewerSelect,
  toBase64,
  addDragAndDropFileListners,
  removeDragAndDropFileListners,
} from "../../Utils/Helpers";
import * as Validation from "../../Utils/Validation";
import { options, _customStyles } from "../../Constants/Constants";

class DocumentsForm extends Component {
  constructor() {
    super();
    this.dateRef = React.createRef();
    this.state = {
      tran: "",
      date: "",
      type: {
        label: "Select Type",
        value: "",
      },
      typeOptions: [],
      approverGroup: {
        label: "Select Approver Group",
        value: "",
      },
      approvalOptions: [
        {
          label: "Select Approver Group",
          value: "",
        },
      ],
      description: "",
      docAttachments: [],
      attachmentSize: 0, //default 0 Bytes,  attachments should always less than 29.5 MB
      primDocName: "", //name of the primary document
      previews: [],
      pdf: "",
      numPages: null,
      pageNumber: 1,

      scaling: 1.1,
      dropdownZoomingValue: { label: "15%", value: "15%" },
      rotate: 0,
      addDocumentCheck: false,
      updateDocumentCheck: false,
      openAddTypeModal: false,
      newType: { label: "", value: "" },
      formErrors: {
        date: "",
        type: "",
        approverGroup: "",
        description: "",
      },
    };
  }

  async componentDidMount() {
    //adding drag and drop attachments listeners
    addDragAndDropFileListners("drop-area-doc", this.uploadAttachment);
    //end

    let tran =
      (this.props.history.location &&
        this.props.history.location.state &&
        this.props.history.location.state.tran) ||
      "";
    if (tran && tran === "addNewdocument") {
      //  add document case
      await this.addDocument(); //add Document to get trans
    } else if (tran) {
      //  update document case
      this.setState({
        tran,
        updateDocumentCheck: true,
        addDocumentCheck: false,
        attachmentSize: 0,
      });
      this.getDocument(tran);
    } else {
      this.props.history.push("/documents");
    }

    //  setting the document zoom
    let documentZoom = localStorage.getItem("documentZoom");
    if (documentZoom) {
      this.handleDropdownZooming({ value: documentZoom });
    }
  }

  componentWillUnmount() {
    //removing drag and drop attachments listeners
    removeDragAndDropFileListners("drop-area-doc", this.uploadAttachment);
  }

  // uplaod doc attchments
  uploadAttachment = async (f) => {
    let { attachmentSize } = this.state;

    let attachment = f;
    if (attachment[0] && attachment[0].type) {
      let type = attachment[0].type;
      let name = attachment[0].name;
      let file = attachment[0];
      let size = attachment[0].size;

      if (type == "application/pdf") {
        if (size <= 10485760) {
          //10MB = 10485760 Bytes
          if (attachmentSize < 30932992) {
            //30932992  -> 29.5 MB
            if (Number(size) + Number(attachmentSize) < 30932992) {
              // first convert pdf to base 64 after that show it on thw PDF viewer
              const result = await toBase64(file).catch((e) => e);
              if (result instanceof Error) {
                toast.error(result.message);
                return;
              } else {
                this.setState(
                  {
                    pdf: result,
                    showDetail: true,
                    rotate: 0,
                  },
                  () => {
                    this.handleHorizontalCross(); //o fit the pdf in a container
                  }
                );
                await this.addAttachments({
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
        toast.error("Please Upload Only PDF File");
      }
    }
  };

  addAttachments = async (data) => {
    let { tran, previews, activeAtchID, primDocName } = this.state;

    if (tran) {
      this.setState({ isLoading: true });
      let obj = {
        tran,
        ...data,
      };
      await this.props.addDocAttachments(obj);
      if (this.props.document.addDocAttachmentSuccess) {
        toast.success(this.props.document.addDocAttachmentSuccess);
        let docAttachments = this.props.document.addDocAttachment || [];
        let attachmentSize = 0;
        docAttachments.map((a, i) => {
          a.primaryDoc = a.primaryDocument;
          attachmentSize += Number(a.fileSize) || 0;

          return a;
        });

        //  also push new attach to preview list
        let prevObj = {};
        if (docAttachments.length > 0) {
          let newAttach = docAttachments[docAttachments.length - 1];
          prevObj = {
            file: data.attachment,
            fileID: newAttach.fileID || "",
            primaryDoc: newAttach.primaryDoc || "N",
          };
        }
        previews = [...previews, prevObj];

        /*Please set the first file uploaded to be the Primary Document 
        (so automatically have it ticked so users do not have to tick it).
        */
        if (docAttachments.length === 1) {
          activeAtchID = docAttachments[0].fileID;
          primDocName = docAttachments[0].fileName;
        }
        this.setState({
          docAttachments,
          activePDF: prevObj.fileID,
          previews,
          pageNumber: 1,
          activeAtchID,
          primDocName,
          attachmentSize,
        });
      }
      if (this.props.document.addDocAttachmentError) {
        handleAPIErr(this.props.document.addDocAttachmentError, this.props);
      }
      this.props.clearDocumentStates();
      this.setState({ isLoading: false });
    }
  };

  //updating the Attchment to primary attachemnt
  updatePrimaryDocument = async () => {
    let { tran, activeAtchID } = this.state;
    if (activeAtchID) {
      await this.props.updatePrimaryDocument(tran, activeAtchID);
      if (this.props.document.updatePrimaryDocumentSuccess) {
        toast.success(this.props.document.updatePrimaryDocumentSuccess);
      }
      if (this.props.document.updatePrimaryDocumentError) {
        handleAPIErr(
          this.props.document.updatePrimaryDocumentError,
          this.props
        );
      }
    }
  };

  deleteAttachment = async (attach) => {
    let fileID = attach.fileID;

    let { attachmentSize } = this.state;
    this.setState({ isLoading: true });

    await this.props.deleteAttachment(fileID);
    if (this.props.document.deleteDocAttachmentSuccess) {
      toast.success(this.props.document.deleteDocAttachmentSuccess);

      let { primDocName, activeAtchID, docAttachments } = this.state;

      let filteredDocAttachments = docAttachments.filter(
        (a) => a.fileID != fileID
      );

      //if current selected attachment is going to delete then remove the name also that's showing
      if (fileID === activeAtchID) {
        primDocName = "";
        activeAtchID = "";
      }
      attachmentSize = Number(attachmentSize) - Number(attach.fileSize);

      this.setState({
        docAttachments: filteredDocAttachments,
        primDocName,
        activeAtchID,
        attachmentSize,
      });
    }
    if (this.props.document.deleteDocAttachmentError) {
      handleAPIErr(this.props.document.deleteDocAttachmentError, this.props);
    }
    this.props.clearDocumentStates();
    this.setState({ isLoading: false });
  };

  //  getting the single Document
  getDocument = async (tran) => {
    if (tran) {
      this.setState({
        isLoading: true,
      });
      await this.props.getDocument(tran); //get document
      //  success case of get document
      if (this.props.document.getDocumentSuccess) {
        toast.success(this.props.document.getDocumentSuccess);

        let docDetails =
          (this.props.document.getDocument &&
            this.props.document.getDocument &&
            JSON.parse(JSON.stringify(this.props.document.getDocument))) ||
          "";

        let date = (docDetails && docDetails.date) || "";

        let type = (docDetails && docDetails.type) || "";

        let approverGroup = (docDetails && docDetails.approverGroup) || "";

        let approvalOptions = (docDetails && docDetails.approvalOptions) || [];
        let aprvlGroup = [
          {
            label: "Select Approver Group",
            value: "",
          },
        ];
        approvalOptions.map((a, i) => {
          aprvlGroup.push({ label: a.approvalGroup, value: a.approvalGroup });
        });
        let description = (docDetails && docDetails.description) || "";

        let docTypesList = (docDetails && docDetails.docTypesList) || [];

        let typeOptions = [{ label: "Select Type", value: "" }];
        if (docTypesList && docTypesList.length > 0) {
          docTypesList.map((t, i) => {
            typeOptions.push({ label: t.docType, value: t.docType });
          });
        }

        let docAttachments = (docDetails && docDetails.attachments) || [];
        let attachmentSize = 0;
        docAttachments.map((a, i) => {
          attachmentSize += Number(a.fileSize) || 0;
        });
        let primDocName = "";
        let isPrim = docAttachments.find(
          (a) => a.primaryDoc.toLowerCase() === "y"
        );
        primDocName = isPrim ? isPrim.fileName : "";

        let previews = (docDetails && docDetails.previews) || [];

        //  show primary attachment by default
        let attchmnt = previews.find(
          (p) => p.primaryDoc && p.primaryDoc.toUpperCase() === "Y"
        );
        let pdf = "";
        let showDetail = false;
        let activePDF = "";
        let activeAtchID = "";
        if (attchmnt) {
          pdf = "data:application/pdf;base64," + attchmnt.file;
          activePDF = attchmnt.fileID || "";
          activeAtchID = attchmnt.fileID;
          showDetail = true;
        }

        this.setState({
          date,
          approverGroup: {
            label: approverGroup || "Select Approver Group",
            value: approverGroup || "",
          },
          approvalOptions: aprvlGroup,
          description,
          type: { label: type || "Select Type", value: type || "" },
          typeOptions,
          docAttachments,
          attachmentSize,
          primDocName,
          previews,
          pdf,
          activePDF,
          activeAtchID,
          showDetail,
        });
      }
      //  error case of get document
      if (this.props.document.getDocumentError) {
        handleAPIErr(this.props.document.getDocumentError, this.props);
      }
      this.props.clearDocumentStates();
      this.setState({ isLoading: false });
    }
  };

  //add new type success
  onAddNewTypeSuccess = (newType) => {
    let { typeOptions } = this.state;
    typeOptions.push(newType);
    this.setState({ typeOptions, type: newType });
  };

  //  Update Document
  updateDocument = async () => {
    let { date, type, approverGroup, description, formErrors } = this.state;

    formErrors = Validation.handleWholeValidation(
      {
        date,
        type: type.value,
        approverGroup: approverGroup.value,
        description,
      },
      formErrors
    );

    if (
      !formErrors.date &&
      !formErrors.type &&
      !formErrors.approverGroup &&
      !formErrors.description
    ) {
      let { tran } = this.state;
      if (tran) {
        this.setState({
          isLoading: true,
        });
        let { tran, date, type, approverGroup, description } = this.state;

        let data = {
          tran,
          document: {
            date,
            type: type.value,
            approverGroup: approverGroup.value,
            description: description.toUpperCase(),
          },
        };

        await this.props.updateDocument(data); //update Document

        //  success case of update Document
        if (this.props.document.updateDocumentSuccess) {
          /*Check When Add/Edit Document and then user Save or Cancel that edit, 
            then load the same  Document user just edited/created?.*/
          this.props.history.push("/documents", {
            tallies: "Draft",
            addEditDocCheck: true,
            docTran: tran,
          });
        }
        //  error case of update Document
        if (this.props.document.updateDocumentError) {
          handleAPIErr(this.props.document.updateDocumentError, this.props);
        }
        this.setState({ isLoading: false });

        this.props.clearDocumentStates();
        this.updatePrimaryDocument();
      } else {
        toast.error("Trans is missing");
      }
    }

    this.setState({
      formErrors: formErrors,
    });
  };

  //  Add New Document
  addDocument = async () => {
    this.setState({ isLoading: true });

    await this.props.addDocument(); //Add New Document

    this.setState({ isLoading: false });

    //  success case of add Document
    if (this.props.document.addDocumentSuccess) {
      toast.success(this.props.document.addDocumentSuccess);

      let docDetails =
        (this.props.document.addDocument &&
          this.props.document.addDocument &&
          JSON.parse(JSON.stringify(this.props.document.addDocument))) ||
        "";

      let tran = (docDetails && docDetails.tran) || "";

      let date = (docDetails && docDetails.date) || "";

      let approverGroup = (docDetails && docDetails.approverGroup) || "";

      let approvalOptions = (docDetails && docDetails.approvalOptions) || [];
      let aprvlGroup = [
        {
          label: "Select Approver Group",
          value: "",
        },
      ];
      approvalOptions.map((a, i) => {
        aprvlGroup.push({ label: a.approvalGroup, value: a.approvalGroup });
      });

      let type = (docDetails && docDetails.type) || "";

      let docTypesList = (docDetails && docDetails.docTypesList) || [];

      let typeOptions = [{ label: "Select Type", value: "" }];
      if (docTypesList && docTypesList.length > 0) {
        docTypesList.map((t, i) => {
          typeOptions.push({ label: t.docType, value: t.docType });
        });
      }

      let description = (docDetails && docDetails.description) || "";

      let docAttachments = (docDetails && docDetails.attachments) || [];

      this.setState({
        tran,
        date,
        type: { label: type || "Select Type", value: type || "" },
        typeOptions,
        approverGroup: {
          label: approverGroup || "Select Approver Group",
          value: approverGroup || "",
        },
        approvalOptions: aprvlGroup,
        description,
        docAttachments,
        addDocumentCheck: true,
        updateDocumentCheck: false,
      });
    }
    //  error case of add Document
    if (this.props.document.addDocumentError) {
      handleAPIErr(this.props.document.addDocumentError, this.props);
    }
    this.setState({ isLoading: false });
    this.props.clearDocumentStates();
  };

  //  Delete Document
  deleteDocument = async () => {
    let { tran } = this.state;
    if (tran) {
      this.setState({
        isLoading: true,
      });

      await this.props.deleteDocument(tran); //delete document
      //  success case of delete document
      if (this.props.document.deleteDocumentSuccess) {
        toast.success(this.props.document.deleteDocumentSuccess);
      }
      //  error case of delete document
      if (this.props.document.deleteDocumentError) {
        handleAPIErr(this.props.document.deleteDocumentError, this.props);
      }
      this.setState({ isLoading: false });
      this.props.clearDocumentStates();
    }
  };

  //  PDF viewer
  handleChangePageNum = (e) => {
    let pageNumber = Number(e.target.value);
    this.setState({ pageNumber });
  };

  handlePDFRotate = () => {
    this.setState({ rotate: this.state.rotate + 270 });
  };

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
    $(".document-form-Pdf").removeClass("over_auto_remove");
    $(".pdf_canvas").removeClass(" convas-expand");
    let { scaling } = this.state;

    let { scale, dropdownZoomingValue, zoom } = pdfViewerZoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("documentZoom", zoom);

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
    $(".document-form-Pdf").removeClass("over_auto_remove");
    $(".pdf_canvas").removeClass(" convas-expand");
    let { scaling } = this.state;

    let { scale, dropdownZoomingValue, zoom } = pdfViewerZoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("documentZoom", zoom);

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
    $(".document-form-Pdf").removeClass("over_auto_remove");
    $(".pdf_canvas").removeClass(" convas-expand");

    let value = data.value;

    let { scale, dropdownZoomingValue } = pdfViewerSelect(value);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("documentZoom", value);

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
    $(".pdf_canvas").removeClass("over_auto_remove");
    $(".pdf_canvas").addClass("convas-expand");
    if ($(window).width() > 1500) {
      this.setState({
        scaling: 1.4,
        dropdownZoomingValue: { label: "100%", value: "100%" },
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
      dropdownZoomingValue: { label: "100%", value: "100%" },
    });
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

  handleChangeType = async (type) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation("type", type.value, formErrors);
    this.setState({ type, formErrors });
  };

  handleChangeApproverGroup = (approverGroup) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(
      "approverGroup",
      approverGroup.value,
      formErrors
    );
    this.setState({ approverGroup, formErrors });
  };

  handleChangeField = (e) => {
    let { formErrors } = this.state;
    const { name, value } = e.target;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };

  showPDF = (a) => {
    let { previews } = this.state;
    let attchmnt = previews.find((p) => p.fileID === a.fileID);
    if (attchmnt) {
      this.setState({
        pdf: "data:application/pdf;base64," + attchmnt.file,
        activePDF: a.fileID,
        pageNumber: 1,
        rotate: 0,
        showDetail: true,
      });
    }
  };

  onDiscard = async () => {
    let { tran, updateDocumentCheck } = this.state;
    if (updateDocumentCheck) {
      /*Check When Add/Edit Document and then user Save or Cancel that edit,
            then load the same  Document user just edited/created?.*/
      this.props.history.push("/documents", {
        tallies: "Draft",
        addEditDocCheck: true,
        docTran: tran,
      });
    } else {
      //  if user want to create new document and he dont save the document then document should be deleted when click on Discard button
      await this.deleteDocument();
      this.props.history.push("/documents");
    }
  };

  closeModal = () => {
    this.setState({ openAddTypeModal: false });
  };

  render() {
    let { activeAtchID, primDocName } = this.state;

    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="dashboard">
          {/* top nav bar */}
          <Header props={this.props} documentsForm={true} />
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
                          {/* start invoice detail */}
                          {/* {this.state.showDetail && ( */}
                          <div className="row">
                            <div className=" col-12 col-sm-12 col-md-12">
                              <div className="white-bg">
                                <div className="row">
                                  <div className="col d-flex justify-content-end s-c-main w-sm-100">
                                    <button
                                      onClick={this.updateDocument}
                                      type="button"
                                      className={
                                        this.state.id_save
                                          ? "btn-save btn_focus"
                                          : "btn-save"
                                      }
                                      tabIndex="806"
                                      id="id_save"
                                      onFocus={(e) => {
                                        this.setState({ [e.target.id]: true });
                                      }}
                                    >
                                      <span className="fa fa-check"></span>
                                      Save
                                    </button>
                                    <button
                                      onClick={this.onDiscard}
                                      type="button"
                                      id="id_disc"
                                      className={
                                        this.state.id_disc
                                          ? "btn-save btn_focus"
                                          : "btn-save"
                                      }
                                      tabIndex="807"
                                      onFocus={(e) => {
                                        this.setState({ [e.target.id]: true });
                                      }}
                                    >
                                      <span className="fa fa-ban"></span>
                                      Discard
                                    </button>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className=" col-6">
                                    <div className="form-group custon_select">
                                      <label>Type</label>
                                      <Select
                                        className="width-selector"
                                        classNamePrefix="custon_select-selector-inner"
                                        value={this.state.type}
                                        options={this.state.typeOptions}
                                        onChange={this.handleChangeType}
                                        onBlur={(e) => {
                                          if (e.target.value) {
                                            this.setState({
                                              newType: {
                                                label: e.target.value,
                                                value: e.target.value,
                                              },
                                            });
                                          }
                                        }}
                                        tabIndex="801"
                                        autoFocus
                                        noOptionsMessage={() => (
                                          <p
                                            className="cursorPointer m-0"
                                            onClick={() => {
                                              this.setState({
                                                openAddTypeModal: true,
                                              });
                                            }}
                                          >
                                            + Create New Type
                                          </p>
                                        )}
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
                                        {this.state.formErrors.type !== ""
                                          ? this.state.formErrors.type
                                          : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className=" col-6">
                                    <div className="form-group custon_select">
                                      <label>Date</label>

                                      <div className="modal_input datePickerUP">
                                        <DatePicker
                                          name="date"
                                          selected={this.state.date}
                                          onChange={(d) =>
                                            this.handleDateChange(d, "date")
                                          }
                                          ref={this.dateRef}
                                          onKeyDown={(e) => {
                                            if (e.key == "Tab") {
                                              this.dateRef.current.setOpen(
                                                false
                                              );
                                            }
                                          }}
                                          tabIndex="802"
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

                                  <div className=" col-6">
                                    <div className="form-group custon_select">
                                      <label>Approver Group</label>
                                      <Select
                                        className="width-selector"
                                        classNamePrefix="custon_select-selector-inner"
                                        value={this.state.approverGroup}
                                        options={this.state.approvalOptions}
                                        onChange={
                                          this.handleChangeApproverGroup
                                        }
                                        tabIndex="803"
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
                                        {this.state.formErrors.approverGroup !==
                                        ""
                                          ? this.state.formErrors.approverGroup
                                          : ""}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-6">
                                    <div className="form-group custon_select">
                                      <label>Description</label>
                                      <div className="modal_input mm_text_outline">
                                        <input
                                          type="text"
                                          className="form-control uppercaseText"
                                          id="usr"
                                          name="description"
                                          tabIndex="804"
                                          defaultValue={this.state.description}
                                          onBlur={this.handleChangeField}
                                        />
                                      </div>
                                      <div className="text-danger error-12">
                                        {this.state.formErrors.description !==
                                        ""
                                          ? this.state.formErrors.description
                                          : ""}
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
                                            id="drop-area-doc"
                                            className="exp_drag_area"
                                          >
                                            <input
                                              type="file"
                                              id="fileElem-attach"
                                              className="form-control d-none"
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
                                              {this.state.docAttachments.map(
                                                (a, i) => {
                                                  return (
                                                    <li
                                                      className={
                                                        a.fileID ===
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
                                                              a.fileID ===
                                                              activeAtchID
                                                            }
                                                            onChange={() => {
                                                              this.setState({
                                                                activeAtchID:
                                                                  a.fileID,
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
                                                          a.fileID
                                                            ? "text-danger"
                                                            : ""
                                                        }
                                                        onClick={() =>
                                                          this.showPDF(a)
                                                        }
                                                      >
                                                        {a.fileName || ""}
                                                      </p>
                                                      <span
                                                        onClick={() => {
                                                          this.deleteAttachment(
                                                            a
                                                          );
                                                        }}
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

                                    <div className="row justify-content-center">
                                      <div
                                        className="col-md-12"
                                        id="expandToFull"
                                      >
                                        <div className="drag-panel-main mx-auto">
                                          <div className="drag-panel">
                                            <div className="row">
                                              <div className="col-sm-6 col-md-5 slider-panel pr-sm-0">
                                                <span className="zom-img cursorPointer">
                                                  <img
                                                    onClick={
                                                      this.handlePDFRotate
                                                    }
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
                                                      tabIndex="-1"
                                                      className="invoice_PDF_pageNum"
                                                      value={
                                                        this.state.pageNumber
                                                      }
                                                      onChange={
                                                        this.handleChangePageNum
                                                      }
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
                                                      this.state
                                                        .dropdownZoomingValue
                                                    }
                                                    classNamePrefix="custon_select-selector-inner"
                                                    options={options}
                                                    tabIndex="-1"
                                                    onChange={
                                                      this.handleDropdownZooming
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
                                                  <span className="zom-img cursorPointer">
                                                    <img
                                                      src="images/drag-w.png"
                                                      onClick={
                                                        this
                                                          .handleHorizontalCross
                                                      }
                                                      className=" img-fluid float-left"
                                                      alt="user"
                                                      id="doc-form-full-screen"
                                                    />{" "}
                                                  </span>
                                                  <span className="zom-img cursorPointer ani-pdf-expand">
                                                    <img
                                                      onClick={
                                                        this
                                                          .handleHorizontalArrow
                                                      }
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
                                                      onClick={
                                                        this.goToNextPage
                                                      }
                                                    />{" "}
                                                  </span>
                                                  <span className="zom-img float-right cursorPointer">
                                                    <img
                                                      src="images/upa-w.png"
                                                      className=" img-fluid"
                                                      alt="user"
                                                      href="#demo"
                                                      data-slide="prev"
                                                      onClick={
                                                        this.goToPrevPage
                                                      }
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
                                                  ? "document-form-Pdf text-center pdf_canvas"
                                                  : "text-center pdf_canvas"
                                              }
                                            >
                                              <div
                                                className="doc-form-convas"
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
                                                      pageNumber={
                                                        this.state.pageNumber
                                                      }
                                                      width={600}
                                                      scale={this.state.scaling}
                                                    />
                                                  </Document>
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
        <AddNewType
          updateDocument={this.updateDocument}
          closeModal={this.closeModal}
          onAddNewTypeSuccess={this.onAddNewTypeSuccess}
          state={this.state}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  document: state.document,
});

export default connect(mapStateToProps, {
  getDocument: DocumentActions.getDocument,
  addDocument: DocumentActions.addDocument,
  deleteDocument: DocumentActions.deleteDocument,
  updateDocument: DocumentActions.updateDocument,
  updatePrimaryDocument: DocumentActions.updatePrimaryDocument,
  addDocAttachments: DocumentActions.addDocAttachments,
  deleteAttachment: DocumentActions.deleteAttachment,
  clearDocumentStates: DocumentActions.clearDocumentStates,
  clearStatesAfterLogout,
})(DocumentsForm);
