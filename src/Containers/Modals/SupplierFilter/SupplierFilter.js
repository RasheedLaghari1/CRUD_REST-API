import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";

class SupplierFilter extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      id: "",
      filtersOptions: [{ label: "Select Filter To Update", value: "empty" }],
      dropDownFilterValue: {
        label: "Select Filter To Update",
        value: "empty",
      },
      formErrors: {
        description: "",
      },
    };
  }

  async componentWillReceiveProps() {
    if (this.props.checkFltr === "active") {
      let arr = [{ label: "Select Filter To Update", value: "empty" }];
      this.props.activeFilters.map((a, i) => {
        arr.push({ label: a.description, value: a.description, id: i });
      });
      this.setState({ filtersOptions: arr });
    } else if (this.props.checkFltr === "workspace") {
      let arr = [{ label: "Select Filter To Update", value: "empty" }];
      this.props.workSpaceFilters.map((w, i) => {
        arr.push({ label: w.description, value: w.description, id: i });
      });
      this.setState({ filtersOptions: arr });
    }
  }

  handleFieldChange = async (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    this.setState({ [fieldName]: fieldValue });
    this.validateField(fieldName, fieldValue);

    if (this.props.checkFltr === "active") {
      let activeFltr = JSON.parse(JSON.stringify(this.props.activeFilters));
      let userLogin = localStorage.getItem("userLogin");
      let update = "";
      activeFltr.map((a, i) => {
        if (i == this.state.id) {
          if (a.userLogin !== userLogin) {
            update = "no";
          }
        }
      });

      if (update === "no") {
        this.setState({
          dropDownFilterValue: {
            label: "Select Filter To Update",
            value: "empty",
          },
        });
      }
    } else if (this.props.checkFltr === "workspace") {
      let workspaceFltr = JSON.parse(
        JSON.stringify(this.props.workSpaceFilters)
      );
      let userLogin = localStorage.getItem("userLogin");

      let update = "";
      workspaceFltr.map((w, i) => {
        if (i == this.state.id) {
          if (w.userLogin !== userLogin) {
            update = "no";
          }
        }
      });

      if (update === "no") {
        this.setState({
          dropDownFilterValue: {
            label: "Select Filter To Update",
            value: "empty",
          },
        });
      }
    }
  };
  validateField = async (name, value) => {
    let formErrors = this.state.formErrors;
    switch (name) {
      case "description":
        if (value.length < 1) {
          formErrors.description = "This Field is Required.";
        } else {
          formErrors.description = "";
        }
        break;

      default:
        break;
    }
    this.setState({
      formErrors: formErrors,
    });
  };
  onCloseModal = () => {
    this.setState({
      description: "",
      id: "",
      filtersOptions: [{ label: "Select Filter To Update", value: "empty" }],
      dropDownFilterValue: {
        label: "Select Filter To Update",
        value: "empty",
      },
      formErrors: {
        description: "",
      },
    });
    this.props.closeModal("openSupplierFilterModal");
  };
  AddEditFilters = async () => {
    let formErrors = this.state.formErrors;
    if (!this.state.description) {
      formErrors.description = "This Field is Required.";
    }

    this.setState({
      formErrors: formErrors,
    });
    if (!formErrors.description) {
      if (this.state.dropDownFilterValue.value === "empty") {
        //Add Filter Case
        await this.addFilters();
      } else {
        //Update Filter Case
        await this.updateFilters();
      }
    }
  };

  //adding Filters
  addFilters = async () => {
    let userLogin = localStorage.getItem("userLogin");
    if (userLogin) {
      //oldFilters -> filters that are stored in local storage
      let storedFilters = [];
      if (this.props.checkFltr === "active") {
        storedFilters = JSON.parse(
          localStorage.getItem("ActiveFilters") || "[]"
        );
      } else {
        storedFilters = JSON.parse(
          localStorage.getItem("WorkSpaceFilters") || "[]"
        );
      }
      let oldFilters = [];
      if (storedFilters.length > 0) {
        let Type =
          this.props.checkFltr === "workspace"
            ? "workspaceFilter"
            : "activeFilter";
        storedFilters.map((f, i) => {
          if (f.userLogin === userLogin && f.Type === Type) {
            oldFilters = f.Filters;
          }
        });
      }

      let data = {
        userLogin,

        Type:
          this.props.checkFltr === "workspace"
            ? "workspaceFilter"
            : "activeFilter",
        Filters: [
          ...oldFilters,
          {
            description: this.state.description,
            Criteria: this.props.criteria,
            RulesList: [...this.props.filters],
            userLogin,
          },

        ],
      };

      storedFilters = storedFilters.filter((f) => f.userLogin != userLogin);

      let usersActiveOrWorkSpaceFilters = [...storedFilters, data];
      if (this.props.checkFltr === "active") {
        //store as active filters
        let fltrs = JSON.stringify(usersActiveOrWorkSpaceFilters);
        localStorage.setItem("ActiveFilters", fltrs);

        await this.props.getUpdatedActiveFilters(data.Filters);
      } else {
        //store as workspace filters
        let fltrs = JSON.stringify(usersActiveOrWorkSpaceFilters);
        localStorage.setItem("WorkSpaceFilters", fltrs);

        await this.props.getUpdatedWorkSpaceFilters(data.Filters);
      }

      await this.onCloseModal();
    } else {
      toast.error("UserLogin Not Found!");
    }
  };
  //updatting filters
  updateFilters = async () => {
    var userLogin = localStorage.getItem("userLogin");

    if (userLogin) {
      let data = "";
      var updateCheck = "NO"; //either user can update filter or not(only update his own created filter)
      if (this.props.checkFltr === "active") {
        let activeFltr = JSON.parse(
          JSON.stringify(this.props.activeFilters || [])
        );

        activeFltr.map((a, i) => {
          if (a.userLogin.toLowerCase() === userLogin.toLowerCase()) {
            updateCheck = "YES";
          }
          if (this.state.dropDownFilterValue.id === i) {
            a.description = this.state.description;
            a.Criteria = this.props.criteria;
            a.userLogin = userLogin;
            a.RulesList = [...this.props.filters];
          }
          return a;
        });

        data = {
          userLogin,
          Type: "activeFilter",
          Filters: activeFltr,
        };
      } else if (this.props.checkFltr === "workspace") {
        let workspaceFltr = JSON.parse(
          JSON.stringify(this.props.workSpaceFilters || [])
        );
        var userLogin = localStorage.getItem("userLogin");
        workspaceFltr.map((w, i) => {
          if (this.state.dropDownFilterValue.id === i) {
            if (w.userLogin.toLowerCase() === userLogin.toLowerCase()) {
              updateCheck = "YES";
            }
            w.description = this.state.description;
            w.Criteria = this.props.criteria;
            w.userLogin = userLogin;
            w.RulesList = [...this.props.filters];
          }
          return w;
        });

        data = {
          userLogin,
          Type: "workspaceFilter",
          Filters: workspaceFltr,
        };
      }
      if (updateCheck === "YES") {
        if (this.props.checkFltr === "active") {
          //update active filters

          let storedFilters = JSON.parse(
            localStorage.getItem("ActiveFilters") || "[]"
          );

          storedFilters = storedFilters.filter((f) => f.userLogin != userLogin);

          //update Active filters
          let usersActiveFilters = [...storedFilters, data];

          let fltrs = JSON.stringify(usersActiveFilters);
          localStorage.setItem("ActiveFilters", fltrs);

          await this.onCloseModal();
          await this.props.getUpdatedActiveFilters(data.Filters);
        } else {
          //update workspace filter
          let storedFilters = JSON.parse(
            localStorage.getItem("WorkSpaceFilters") || "[]"
          );

          storedFilters = storedFilters.filter((f) => f.userLogin != userLogin);

          //update workspace filters
          let usersWorkSpaceFilters = [...storedFilters, data];

          let fltrs = JSON.stringify(usersWorkSpaceFilters);
          localStorage.setItem("WorkSpaceFilters", fltrs);

          await this.onCloseModal();
          await this.props.getUpdatedWorkSpaceFilters(data.Filters);
        }
      } else {
        toast.error("You Can Only Update Your Own Filters!");
        this.setState({
          dropDownFilterValue: {
            label: "Select Filter To Update",
            value: "empty",
          },
          description: "",
        });
      }
    } else {
      toast.error("UserLogin Not Found!");
    }
  };
  handleDropDownFilter = async (data) => {
    if (data.value !== "empty") {
      this.setState({
        dropDownFilterValue: data,
        description: data.value,
        id: data.id,
        formErrors: {
          description: "",
        },
      });
    } else {
      this.setState({
        dropDownFilterValue: data,
        description: "",
        id: data.id,
        formErrors: {
          description: "This Field is Required.",
        },
      });
    }
  };

  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openSupplierFilterModal}
          onHide={this.onCloseModal}
          className="forgot_email_modal modal_555 mx-auto"
        >
          <Modal.Body>
            <div className="container-fluid ">
              <div className="main_wrapper p-10">
                <div className="row d-flex h-100">
                  <div className="col-12 justify-content-center align-self-center form_mx_width">
                    <div className="forgot_form_main">
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row bord-btm">
                            <div className="col-auto pl-0">
                              <h6 className="text-left def-blue">Filters</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.AddEditFilters}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  this.props.closeModal(
                                    "openSupplierFilterModal"
                                  )
                                }
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-ban"></span>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row">
                          <div className="col-12 pl-md-0">
                            <div className="row mt-4">
                              <div className="col-md-12">
                                <h2 className="save_filter_heading">
                                  {this.props.checkFltr === "active"
                                    ? "Save active filter"
                                    : this.props.checkFltr === "workspace"
                                      ? "Save workspace filter"
                                      : "Add Filter"}{" "}
                                </h2>
                                <div className="group">
                                  <label>Description</label>
                                  <input
                                    type="text"
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleFieldChange}
                                  />{" "}
                                  {this.state.formErrors.description !== "" ? (
                                    <span className="validation_error">
                                      {this.state.formErrors.description}
                                    </span>
                                  ) : (
                                      ""
                                    )}
                                </div>

                                <div className="form-group custon_select">
                                  <label>OR Select Filter To Update</label>
                                  <Select
                                    className="width-selector"
                                    value={this.state.dropDownFilterValue}
                                    onChange={this.handleDropDownFilter}
                                    classNamePrefix="track_menu custon_select-selector-inner"
                                    options={this.state.filtersOptions}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default SupplierFilter;
