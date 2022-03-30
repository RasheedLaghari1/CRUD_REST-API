import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import "./EmailTemplate.css";
import $ from "jquery";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import Placeholders from '../../Modals/SetupModals/Placeholders/Placeholders'
import * as SetupAction from "../../../Actions/SetupRequest/SetupAction";
import * as Helpers from "../../../Utils/Helpers";
import * as Validation from "../../../Utils/Validation";
import Editor from "./Editor";

class EmailTemplate extends Component {
  constructor() {
    super();
    this.state = {
      openPlaceholderModal: false,
      emailTemplates: [], //email templates list
      templateName: 'Select Template To Edit',

      emailTypeOptions: [],
      templateType: { label: "Select Template Type", value: "" },

      system: "N",
      defaultCheck: true,
      privateCheck: false,
      subject: "",
      name: "",
      description: "",
      templateBody: "",//Editor template html 
      tempBody: "", //contains template body from getEmailTemplate

      attachments: [],
      addEditTempCheck: '',

      placeholders: [],
      openInsrtPlcHldr: false,
      formErrors: {
        subject: "",
        templateName: "",
        templateType: "",
      },
    };
  }
  componentWillMount() {
    Promise.all([this.getEmailTemplatesList(), this.getEmailTypeOptions()]);

    $(function () {
      "use strict";
      (function () {
        $(".setup_menu").on("click", function () {
          var id = $(this).attr("data-target");
          if (id === "#top_nav_toggle1") {
            $(`${id}`).toggleClass("show");
          }
        });

        $(".dash_menu_toggle.top--nav").on("click", function () {
          $(".setup_menu").click();
        });
      })();
    });
  }
  openModal = (name) => {
    this.setState({ [name]: true });
  };
  closeModal = (name) => {
    this.setState({ [name]: false });
  };
  handleChangeField = (e) => {
    let { name, value } = e.target;
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, value, formErrors);
    this.setState({ [name]: value, formErrors });
  };
  handleCheckbox = (event) => {
    let { name, checked } = event.target;
    this.setState({ [name]: checked });
  };
  handleSelect = (name, data) => {
    let { formErrors } = this.state;
    formErrors = Validation.handleValidation(name, data.value, formErrors);
    if (name === "templateName") {
      data = data.value
      this.closeInsertPlaceholder()
      this.getEmailTemplate(data)
    }
    this.setState({ [name]: data, formErrors, placeholders: [] });

  };
  clearStates = () => {
    this.setState({
      addEditTempCheck: '',
      templateName: "Select Template To Edit",
      templateType: { label: "Select Template Type", value: "" },
      system: "N",
      defaultCheck: true,
      privateCheck: false,
      subject: "",
      name: "",
      description: "",
      templateBody: "",//Editor template html 
      tempBody: "", //contains template body from getEmailTemplate  
      attachments: [],
      placeholders: [],
      openInsrtPlcHldr: false,
      formErrors: {
        subject: "",
        templateName: "",
        templateType: "",
      },
    });
  };
  handleTemplateBody = (templateBody) => {
    this.setState({ templateBody })
  }
  getEmailTemplatesList = async () => {
    let emailTemplates = [];
    this.setState({ isLoading: true });
    await this.props.getEmailTemplatesList();
    if (this.props.setup.getEmailTemplateListSuccess) {
      // toast.success(this.props.setup.getEmailTemplateListSuccess)
      let list = this.props.setup.getEmailTemplateList || [];
      list.map((l) =>
        emailTemplates.push({ label: l.templateName, value: l.templateName })
      );
    }
    if (this.props.setup.getEmailTemplateListError) {
      Helpers.handleAPIErr(
        this.props.setup.getEmailTemplateListError,
        this.props
      );
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false, emailTemplates });
  };
  //GetEmailTypeOptions will be used to populate the Template Type list:
  getEmailTypeOptions = async () => {
    let emailTypeOptions = [];
    this.setState({ isLoading: true });
    await this.props.getEmailTypeOptions();
    if (this.props.setup.getEmailTypeOptSuccess) {
      // toast.success(this.props.setup.getEmailTypeOptSuccess)
      let list = this.props.setup.getEmailTypeOpt || [];
      list.map((l) =>
        emailTypeOptions.push({ label: l.typeValue, value: l.typeValue })
      );
    }
    if (this.props.setup.getEmailTypeOptError) {
      Helpers.handleAPIErr(this.props.setup.getEmailTypeOptError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false, emailTypeOptions });
  };
  getEmailTemplate = async (templateName) => {
    let {
      templateType,
      subject,
      name,
      description,
      system,
      tempBody,
      defaultCheck,
      privateCheck,
      addEditTempCheck,
      attachments
    } = this.state;

    this.setState({ isLoading: true });
    await this.props.getEmailTemplate(templateName);
    if (this.props.setup.getEmailTemplateSuccess) {
      toast.success(this.props.setup.getEmailTemplateSuccess);
      let details = this.props.setup.getEmailTemplate || "";
      let emailTemplate = details.emailTemplate || "";

      templateType = emailTemplate.templateType || "";
      templateType = templateType ? { label: templateType, value: templateType } : { label: "Select Template Type", value: "" }
      subject = emailTemplate.subject || "";
      name = emailTemplate.name || "";
      description = emailTemplate.description || "";
      system = emailTemplate.system || "N";
      defaultCheck = emailTemplate.default === "Y" ? true : false;
      privateCheck = emailTemplate.private === "Y" ? true : false;
      tempBody = details.templateBody || "";
      attachments = emailTemplate.attachments || [];
      addEditTempCheck = 'update'
    }
    if (this.props.setup.getEmailTemplateError) {
      Helpers.handleAPIErr(this.props.setup.getEmailTemplateError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({
      isLoading: false,
      templateType,
      subject,
      name,
      description,
      system,
      tempBody,
      defaultCheck,
      privateCheck,
      addEditTempCheck,
      attachments,
      formErrors: {
        subject: "",
        templateName: "",
        templateType: "",
      },
    });
  };
  deleteEmailTemplate = async () => {
    let { emailTemplates, system, templateName } = this.state;
    if (templateName && templateName !== 'Select Template To Edit') {
      if (system === "N") {
        this.setState({ isLoading: true });
        await this.props.deleteEmailTemplate(templateName);
        if (this.props.setup.deleteEmailTemplateSuccess) {
          toast.success(this.props.setup.deleteEmailTemplateSuccess);
          emailTemplates = emailTemplates.filter(
            (t) => t.value != templateName
          );
          this.clearStates();
        }
        if (this.props.setup.deleteEmailTemplateError) {
          Helpers.handleAPIErr(
            this.props.setup.deleteEmailTemplateError,
            this.props
          );
        }

        this.props.clearSetupStates();
        this.setState({ isLoading: false, emailTemplates });
      }
    } else {
      toast.error("Please select Template to delete!");
    }
  };
  closeInsertPlaceholder() {
    this.setState({ openInsrtPlcHldr: false })
  }
  getPlaceholders = async (check) => {
    let { templateName, placeholders, openInsrtPlcHldr, openPlaceholderModal } = this.state

    if (templateName && templateName !== 'Select Template To Edit') {
      if (placeholders.length === 0) {

        this.setState({ isLoading: true });
        await this.props.getPlaceholders(templateName);
        if (this.props.setup.getPlaceholdersSuccess) {
          // toast.success(this.props.setup.getPlaceholdersSuccess)
          placeholders = this.props.setup.getPlaceholders || [];
        }
        if (this.props.setup.getPlaceholdersError) {
          Helpers.handleAPIErr(
            this.props.setup.getPlaceholdersError,
            this.props
          );
        }
        this.props.clearSetupStates();
      }
      if (check === 'update') {
        openPlaceholderModal = true
        openInsrtPlcHldr = false
      } else {
        openPlaceholderModal = false
        openInsrtPlcHldr = true
      }
      this.setState({ isLoading: false, placeholders, openPlaceholderModal, openInsrtPlcHldr })
    } else {
      toast.error('Please select Template first!')
    }
  }
  updatePlaceholders = async (_placeholders) => {
    let { templateName, placeholders } = this.state
    let obj = {
      emailType: templateName,
      placeholders: _placeholders
    }
    this.setState({ isLoading: true })
    await this.props.updatePlaceholders(obj)
    if (this.props.setup.updatePlaceholdersSuccess) {
      toast.success(this.props.setup.updatePlaceholdersSuccess)
      placeholders = _placeholders
    }
    if (this.props.setup.updatePlaceholdersError) {
      Helpers.handleAPIErr(
        this.props.setup.updatePlaceholdersError,
        this.props
      );
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false, placeholders })

  }
  //inserting placeholder into template body
  insertPlaceholders = (p) => {
    this.setState({ insertVal: p.tag }, () => {
      this.setState({ insertVal: '' }) //to allow useEffect insert placeholder in bode because useEffect updates only when insertVal will update
    })
  }
  addTemplate = () => {
    this.clearStates()
    this.setState({ addEditTempCheck: 'add', templateName: '' })
  }
  // uplaod po attchments
  uploadAttachment = async (attachments) => {

    let obj = ''
    let type = attachments[0].type;
    let file = attachments[0];
    let size = attachments[0].size;
    let name = attachments[0].name;

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
      if (size <= 10485760) { //10MB = 10485760 Bytes
        const result = await Helpers.toBase64(file).catch((e) => e);
        if (result instanceof Error) {
          toast.error(result.message);
          return;
        } else {
          obj = {
            fileName: name,
            attachment: result.split(",")[1],
          };
        }

      }
      else {
        toast.error("This file exceeds the 10MB limit. Please upload a smaller file.");
      }
    } else {
      toast.error(
        "Please Select only Attachments of type: 'pdf', 'docx', 'CSV', '.xls', '.xlsx', 'spreadsheets' or 'images'"
      );
    }
    await this.addEmailAttachment(obj);
  };
  //Add Email Attachment
  addEmailAttachment = async (attach) => {
    let { attachments } = this.state;

    this.setState({ isLoading: true });

    await this.props.addEmailAttachment(attach);
    if (this.props.setup.addEmailAttachSuccess) {
      toast.success(this.props.setup.addEmailAttachSuccess);
      let resp = this.props.setup.addEmailAttach || '';
      attachments = [...attachments, { fileName: resp }]
      this.setState({ attachments });
    }
    if (this.props.setup.addEmailAttachError) {
      Helpers.handleAPIErr(this.props.setup.addEmailAttachError, this.props);
    }
    this.props.clearSetupStates();

    this.setState({ isLoading: false });

  };
  onSave = async () => {
    let {
      formErrors,
      templateName,
      templateType,
      defaultCheck,
      privateCheck,
      system,
      subject,
      name,
      description,
      attachments,
      templateBody,
      addEditTempCheck,
      emailTemplates
    } = this.state;
    formErrors = Validation.handleWholeValidation(
      {
        subject,
        templateName,
        templateType: templateType.value,
      },
      formErrors
    );

    if (
      !formErrors.subject &&
      !formErrors.templateName &&
      !formErrors.templateType
    ) {
      this.setState({ isLoading: true })
      if (addEditTempCheck === 'add') {
        let obj = {
          emailTemplate: {
            templateName,
            templateType: templateType.value,
            default: defaultCheck,
            private: privateCheck,
            system,
            subject,
            name,
            description,
            attachments,
            templateBody
          }
        }
        await this.props.insertEmailTemplate(obj)
        if (this.props.setup.insertEmailTemplateSuccess) {
          toast.success(this.props.setup.insertEmailTemplateSuccess);
          this.clearStates()
          emailTemplates = [...emailTemplates, { label: templateName, value: templateName }]
        }
        if (this.props.setup.insertEmailTemplateError) {
          Helpers.handleAPIErr(
            this.props.setup.insertEmailTemplateError,
            this.props
          );
        }

      } else {
        let obj = {
          emailTemplate: {
            templateName,
            templateType: templateType.value,
            default: defaultCheck,
            private: privateCheck,
            system,
            subject,
            name,
            description,
            attachments,
            templateBody
          }
        }
        await this.props.updateEmailTemplate(obj)
        if (this.props.setup.updateEmailTemplateSuccess) {
          toast.success(this.props.setup.updateEmailTemplateSuccess);
        }
        if (this.props.setup.updateEmailTemplateError) {
          Helpers.handleAPIErr(
            this.props.setup.updateEmailTemplateError,
            this.props
          );
        }
      }
      this.props.clearSetupStates();
    }

    this.setState({
      formErrors: formErrors,
      isLoading: false,
      emailTemplates
    });
  };
  render() {
    let {
      addEditTempCheck,
      emailTemplates,
      templateName,
      emailTypeOptions,
      templateType,
      defaultCheck,
      privateCheck,
      subject,
      name,
      description,
      system,
      formErrors,
      tempBody,
      openPlaceholderModal,
      placeholders,
      openInsrtPlcHldr
    } = this.state;
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="user_setup_main">
          <header>
            <TopNav />
            <div className="user_setup_heading">
              <div className="header_menu">
                <Link to="/dashboard">
                  <img
                    src="images/dash-logo.png"
                    className="img-fluid"
                    alt="logo"
                  />
                </Link>
                <Link
                  className="setup_menu"
                  to="#"
                  data-target="#top_nav_toggle1"
                >
                  <img src="images/top-menu.png" className="" alt="top-menu" />
                </Link>
              </div>
              <h2>Email Template</h2>
              <span>
                <img
                  src="./images/user-setup/lock.png"
                  alt="lock"
                  className="img-fluid"
                />
              </span>
            </div>
            <div className="user_setup_headerbox">
              <div className="user_setup_play_div">
                <ul>
                  <li>
                    <p className="user_setup_play_video">Video</p>
                  </li>
                  <li>
                    <p className="user_setup_play_tuturial">Tutorials</p>
                  </li>
                </ul>
                <span className="user_setup_play_icon">
                  <img
                    src="./images/user-setup/play.png"
                    alt="play"
                    className="img-fluid"
                  />
                </span>
              </div>
              <div className="user_setup_header_rightbox">
                <p>
                  In our{" "}
                  <span>
                    <a href="#">Video</a>
                  </span>{" "}
                  learn how to use email template Read our{" "}
                  <span>
                    <a href="#">help article</a>
                  </span>{" "}
                  to learn More
                </p>
              </div>
              <span>
                <img
                  className="close_top_sec"
                  src="images/user-setup/cross.png"
                  alt="cross"
                ></img>
              </span>
            </div>
          </header>
          <div className="col-sm-12 table_white_box">
            <div className="row w-100 m-0">
              <div className="email_template_search col-md-4">
                <span className="email-temp_text">Email Template</span>
                <div className="email_template_search_box">
                  <Select
                    className="width-selector email_temp_select"
                    classNamePrefix="custon_select-selector-inner"
                    value={addEditTempCheck === 'add' ?
                      { label: "Select Template To Edit", value: "Select Template To Edit" }
                      :
                      { label: templateName, value: templateName }
                    }
                    options={emailTemplates}
                    onChange={(obj) => this.handleSelect("templateName", obj)}
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
                  {
                    addEditTempCheck === 'update' ? <div className="text-danger error-12  user-required-field">
                      {formErrors.templateName !== ""
                        ? formErrors.templateName
                        : ""}
                    </div> : ''
                  }

                </div>
              </div>
              <div className="col-md-4 template_center_div">
                {/* <p>Template Type: Reminder</p> */}
              </div>
              <div className=" col-md-4 email_temp_icons_div">
                <ul>
                  {
                    addEditTempCheck === 'update' ?
                      <li>
                        <div className="email_edit_palceholder">
                          <button onClick={() => this.getPlaceholders('update')}
                            className="btn email_edit_placeholder">
                            Edit placeholder
                      </button>
                        </div>
                      </li>
                      : ""
                  }
                  <li>
                    <button onClick={this.addTemplate} className="btn user_setup_rbtns" type="button">
                      <span className="round_plus">
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={this.deleteEmailTemplate}
                      className="btn user_setup_rbtns"
                      type="button"
                    >
                      <span className="round_file">
                        {" "}
                        <img
                          src="./images/user-setup/delete.png"
                          alt="filter"
                        ></img>
                      </span>
                    </button>
                  </li>
                  {
                    addEditTempCheck ?
                      <li>
                        <button
                          onClick={this.onSave}
                          type="button"
                          className="btn-save ml-0"
                        >
                          <span className="fa fa-check pr-1 "></span>Save
                    </button>
                      </li> : ''
                  }

                </ul>
              </div>
            </div>
            {addEditTempCheck ?
              <div className="email_template_detail">
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group input_field">
                      <label>Template</label>
                      <input
                        type="text"
                        name="templateName"
                        value={templateName}
                        onChange={(e) => addEditTempCheck === 'update' ? {} : this.handleChangeField(e)}
                        disabled={addEditTempCheck === 'update'}
                      />
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.templateName !== ""
                          ? formErrors.templateName
                          : ""}
                      </div>
                    </div>
                    <div className=" email_temp_type ">
                      <label>Template Type:</label>
                      <Select
                        className="width-selector email_temp_select"
                        classNamePrefix="custon_select-selector-inner"
                        value={templateType}
                        options={emailTypeOptions}
                        onChange={(event) =>
                          this.handleSelect("templateType", event)
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
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.templateType !== ""
                          ? formErrors.templateType
                          : ""}
                      </div>
                    </div>
                    <div className="form-group email_temp_check">
                      <div className="custom-radio">
                        Default:
                      <label
                          className="check_main remember_check"
                          htmlFor="def"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="def"
                            name="defaultCheck"
                            value={defaultCheck}
                            checked={defaultCheck}
                            onChange={(event) => this.handleCheckbox(event)}
                          />
                          <span className="click_checkmark"></span>
                        </label>
                      </div>
                      <div className="custom-radio">
                        private:
                      <label className="check_main remember_check" htmlFor="pr">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="pr"
                            name="privateCheck"
                            value={privateCheck}
                            checked={privateCheck}
                            disabled={system === "Y"}
                            onChange={(event) =>
                              system === "Y" ? {} : this.handleCheckbox(event)
                            }
                          />
                          <span className="click_checkmark"></span>
                        </label>
                      </div>
                    </div>
                    <div className="input_field">
                      <label>Attachment</label>
                    </div>
                    <div className="email_temp_attachment">
                      <label
                        className="custom-file-upload"
                        htmlFor="file-upload"
                      >
                        <div className="upload-text">
                          <img
                            src="images/drag-file.png"
                            className="import_icon img-fluid"
                            alt="upload-attachment"
                          />
                        </div>
                      </label>

                      <input
                        type="file"
                        id="file-upload"
                        className="form-control d-none uppercaseText"
                        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint
                        , application/pdf, image/jpeg,image/jpg,image/png,
                         .csv, .xlsx, .xls,
                         application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                         application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={(e) => {
                          this.uploadAttachment(
                            e.target.files
                          );
                        }}
                        onClick={(event) => {
                          event.currentTarget.value = null;
                        }} //to upload the same file again
                      />
                    </div>
                    {addEditTempCheck === 'update' ?
                      <div className="email_insert_placeholder">
                        <div className="">
                          <button
                            type="button"
                            className=" dropdown btn insert_placeholder_btn"
                            onClick={() => this.getPlaceholders('add')}
                          >
                            Insert Placeholders
                        </button>
                        </div>
                        {openInsrtPlcHldr ?
                          <div className="col-xs-7 col-sm-7 col-md-5 email__dropdown--right">
                            <ul className="dropdown-menu mrg_top_emiltep">
                              <a href={null} className="close_mrg_email" onClick={() => this.closeInsertPlaceholder()}>
                                <img className="cursorPointer pull-right" src="images/ic_clear_24px@2x.png" width="15" height="15" alt="" />
                              </a>
                              <h2>Insert Placeholders</h2>
                              Click to insert Placeholders in content which will dynamically get resolved into the appropriate data.
                                <div className="clear20"></div>
                              <div className="col-sm-12 p0">
                                <div className="insert_place_bg_w">
                                  {placeholders.map((p, index) => {
                                    return (
                                      <div className="btn_placeholders" key={index}>
                                        <button
                                          className="btn_email_temp_status CursorPointer"
                                          onClick={(e) => this.insertPlaceholders(p)}
                                        >{p.prompt}
                                        </button>
                                      </div>
                                    )
                                  })}
                                  <div className="clearfix"></div>
                                  <div className="clear10"></div>
                                </div>
                              </div>
                              <div className="clear40"></div>
                            </ul>
                          </div> : ''}
                      </div> : ""}
                    <div className="form-group w-float">
                      <label>
                        Subject:<span className="start_color">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={subject}
                        onChange={(event) => this.handleChangeField(event)}
                      ></input>
                      <div className="text-danger error-12  user-required-field">
                        {formErrors.subject !== "" ? formErrors.subject : ""}
                      </div>
                    </div>
                    <div className="form-group w-float">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(event) => this.handleChangeField(event)}
                      ></input>
                    </div>
                    <div className="form-group w-float mb-5">
                      <label>Description:</label>
                      <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(event) => this.handleChangeField(event)}
                      ></input>
                    </div>
                    <Editor
                      tempBody={tempBody}
                      handleTemplateBody={this.handleTemplateBody}
                      insertVal={this.state.insertVal || ''} //only used run-time when user inert placeholder
                    />
                  </div>
                  <div className="col-md-4">
                    <div className="email_instruction">
                      <p>Instructions</p>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="email_template_previw">
                <h2>Email Template Preivew</h2>
              </div>}
          </div>
        </div>
        <Placeholders
          openPlaceholderModal={openPlaceholderModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
          placeholders={placeholders}
          updatePlaceholders={this.updatePlaceholders}
        />

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  setup: state.setup,
});
export default connect(mapStateToProps, {
  getEmailTemplatesList: SetupAction.getEmailTemplatesList,
  getEmailTypeOptions: SetupAction.getEmailTypeOptions,
  getEmailTemplate: SetupAction.getEmailTemplate,
  insertEmailTemplate: SetupAction.insertEmailTemplate,
  updateEmailTemplate: SetupAction.updateEmailTemplate,
  deleteEmailTemplate: SetupAction.deleteEmailTemplate,
  addEmailAttachment: SetupAction.addEmailAttachment,
  getPlaceholders: SetupAction.getPlaceholders,
  updatePlaceholders: SetupAction.updatePlaceholders,
  clearSetupStates: SetupAction.clearSetupStates,
})(EmailTemplate);
