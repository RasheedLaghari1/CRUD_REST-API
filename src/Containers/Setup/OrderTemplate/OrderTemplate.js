import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { connect } from "react-redux";
import "./OrderTemplate.css";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import TopNav from "../../Common/TopNav/TopNav";
import Filter from "../Filter/Filter";
import Settings from "../../Modals/SetupModals/Settings/Settings";
import * as SetupAction from "../../../Actions/SetupRequest/SetupAction";
import * as Helpers from "../../../Utils/Helpers";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";

import {
  zoomIn,
  zoomOut,
  handleDropdownZooming,
} from "../../Orders/ImageControllers";
import { options } from "../../../Constants/Constants";

import {
  convertCoordinates,
  updateCoordinates,
  updateTemplateFields,
} from "./Helpers";

let colors = [
  "#F98B74",
  "#BD8621",
  "#21BD24",
  "#7FD7BC",
  "#729288",
  "#727B92",
  "#876BAD",
  "#660915",
  "#8A4890",
  "#3B2780",
  "#41545A",
  "#6B8890",
  "#BAD5DC",
  "#CCE9DE",
  "#131615",
  "#657516",
  "#CA9617",
  "#B6834A",
  "#3E2100",
  "#04424C",
];

class OrderTemplate extends Component {
  constructor() {
    super();
    this.state = {
      templates: [], // order templates
      templateName: "",
      templateFields: [],
      templateImage: "",
      scaling: "scale(0.95)",
      dropdownZoomingValue: { label: "40%", value: "40%" },
    };
  }

  componentDidMount() {
    this.getOrderTemplatesList();

    //setting the image zoom
    let orderTempltZoom = localStorage.getItem("orderTempltZoom");

    if (orderTempltZoom) {
      this.handleDropdownZooming({ value: orderTempltZoom });
    }
  }

  componentWillMount() {
    $(document).ready(function () {
      $("#expand").on("click", function (e) {
        e.preventDefault();
        $(".maped_image").addClass("mm_pdf_img");
      });
    });
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

  openModal = async (name) => {
    await this.setState({ [name]: true });
  };

  closeModal = (name) => {
    this.setState({ [name]: false });
  };

  getOrderTemplatesList = async () => {
    this.setState({ isLoading: true });

    await this.props.getOrderTemplatesList();

    if (this.props.setup.getOrderTemplateListSuccess) {
      let templates = this.props.setup.getOrderTemplateList || [];
      let _templates = [];
      templates.map((tem) =>
        _templates.push({ label: tem.templateName, value: tem.templateName })
      );
      this.setState({ templates: _templates });
    }
    if (this.props.setup.getOrderTemplateListError) {
      Helpers.handleAPIErr(
        this.props.setup.getOrderTemplateListError,
        this.props
      );
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };

  getOrderTemplate = async (templateName) => {
    this.setState({ isLoading: true, templateName });

    await this.props.getOrderTemplate(templateName);

    if (this.props.setup.getOrderTemplateSuccess) {
      let templateFields =
        this.props.setup.getOrderTemplate.templateFields || [];

      let templateImage = this.props.setup.getOrderTemplate.templateImage || "";

      templateFields = templateFields.map((item, i) => ({
        ...item,
        checked: true,
        ...convertCoordinates(item.coordinates), //converting the coordinates into x, y, height and width
        color:
          colors.length >= templateFields.length
            ? colors[i]
            : "#" +
              (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
      }));

      this.setState({ templateFields, templateImage });
    }
    if (this.props.setup.getOrderTemplateError) {
      Helpers.handleAPIErr(this.props.setup.getOrderTemplateError, this.props);
    }

    this.props.clearSetupStates();
    this.setState({ isLoading: false });
  };

  //when click on '+' plus button to zoom in the pdf/image
  zoomIn = () => {
    let { scaling } = this.state;

    let { zoom, scale, dropdownZoomingValue } = zoomIn(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("orderTempltZoom", zoom);
      }
    );
  };

  //when click on '-' minus button to zoom out the pdf/image
  zoomOut = () => {
    let { scaling } = this.state;

    let { zoom, scale, dropdownZoomingValue } = zoomOut(scaling);

    this.setState(
      {
        scaling: scale,
        dropdownZoomingValue,
      },
      () => {
        localStorage.setItem("orderTempltZoom", zoom);
      }
    );
  };

  //when click on dropdown button to resize the image
  handleDropdownZooming = (data) => {
    let value = data.value;

    localStorage.setItem("orderTempltZoom", value);

    let { scale, dropdownZoomingValue } = handleDropdownZooming(value);

    this.setState({
      scaling: scale,
      dropdownZoomingValue,
    });
  };

  handleHorizontalArrow = () => {
    $(".explore_img").removeClass("fit_top_bottom");
    this.setState({
      scaling: "scale(1)",
      dropdownZoomingValue: { label: "50%", value: "50%" },
    });
  };

  handleHorizontalCross = () => {
    $(".expand_it").removeClass("mm_pdf_img");
    this.setState({
      scaling: "scale(1)",
      dropdownZoomingValue: { label: "50%", value: "50%" },
    });
  };

  /*
      x -> defines the distance of the box from right 
      y -> defines the distance of the box from top
      height -> the height of the box
      width -> the width of the box
  */
  onResizeStopHandler = async (e, direction, ref, delta, position, index) => {
    let { templateFields } = this.state;
    templateFields = JSON.parse(JSON.stringify(templateFields));

    let x = templateFields[index].x || "";
    let y = templateFields[index].y || "";
    templateFields[index] = {
      ...templateFields[index],
      coordinates: updateCoordinates({
        //updating the coordinates
        x,
        y,
        width: ref.style.width,
        height: ref.style.height,
      }),
      width: ref.style.width,
      height: ref.style.height,
    };
    this.setState({ templateFields });
  };

  onDragStop = async (e, d, index) => {
    let { templateFields } = this.state;
    templateFields = JSON.parse(JSON.stringify(templateFields));

    let width = templateFields[index].width || "";
    let height = templateFields[index].height || "";

    templateFields[index] = {
      ...templateFields[index],
      coordinates: updateCoordinates({
        //updating the coordinates
        x: d.x.toFixed(2),
        y: d.y.toFixed(2),
        width,
        height,
      }),
      x: d.x.toFixed(2),
      y: d.y.toFixed(2),
    };
    this.setState({ templateFields });
  };

  handleCheckbox = (e, f, i) => {
    let { templateFields } = this.state;

    let { checked } = e.target;
    templateFields[i].checked = checked;

    this.setState({ templateFields });
  };

  updateOrderTemplate = async () => {
    let { templateFields, templateName } = this.state;

    if (templateName) {
      this.setState({ isLoading: true });

      templateFields = updateTemplateFields(templateFields); //updating the coordinates in templateFields

      let obj = {
        templateName,
        templateFields,
      };
      await this.props.updateOrderTemplate(obj);

      if (this.props.setup.updateOrderTemplateSuccess) {
        toast.success(this.props.setup.updateOrderTemplateSuccess);
      } else if (this.props.setup.updateOrderTemplateError) {
        Helpers.handleAPIErr(
          this.props.setup.updateOrderTemplateError,
          this.props
        );
      }

      this.props.clearSetupStates();
      this.setState({ isLoading: false });
    } else {
      toast.error("Please select Template first!");
    }
  };

  render() {
    let { templates, templateName, templateFields, templateImage, scaling } =
      this.state;
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
              <h2>Order Template</h2>
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
                  learn how to use order template Read our{" "}
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
            <div className="row order_template_section ">
              <div className="col-md-9 p-0">
                <div className=" row order_template_icons thead_bg">
                  <div className="col-3">
                    <div className="order_template_search_box">
                      <Select
                        className="width-selector"
                        classNamePrefix="custon_select-selector-inner"
                        defaultValue={{ label: "Select Template", value: "" }}
                        options={templates}
                        onChange={(val) => this.getOrderTemplate(val.value)}
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
                  <div className="col-7">
                    <div className="order_template-icons_panel">
                      <span className="top-zoom-img cursorPointer">
                        <img
                          onClick={this.zoomOut}
                          src="images/minus-w.png"
                          className=" img-fluid float-left"
                          alt="user"
                        />{" "}
                      </span>
                      <span className="top-zoom-img cursorPointer">
                        <img
                          onClick={this.zoomIn}
                          src="images/add-w.png"
                          className=" img-fluid float-left"
                          alt="user"
                        />{" "}
                      </span>
                      <Select
                        className="width-selector"
                        value={this.state.dropdownZoomingValue}
                        classNamePrefix="custon_select-selector-inner"
                        options={options}
                        onChange={this.handleDropdownZooming}
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

                      <span className="top-zoom-img cursorPointer">
                        <img
                          onClick={this.handleHorizontalCross}
                          src="images/fulls-white.png"
                          className="img-fluid float-left"
                          alt="user"
                          id="full_screen"
                        />{" "}
                      </span>
                      {/* <span className="top-zoom-img cursorPointer">
                        <img
                          onClick={this.handleHorizontalArrow}
                          src="images/twoarow-white.png"
                          className="img-fluid float-left"
                          alt="user"
                          id="expand"
                        />{" "}
                      </span> */}
                    </div>
                  </div>
                </div>
                <div className="order_temp_upload_outer">
                  <div className="order_detail_upload">
                    <div
                      className="maped_image"
                      style={{
                        transform: scaling,
                        transformOrigin: "center top",
                      }}
                    >
                      {templateImage ? (
                        <div>
                          <img
                            className="explore_img"
                            src={"data:image/png;base64," + templateImage}
                            id="preview"
                            alt="preview"
                          />
                          {templateFields.map((temp, index) => {
                            return (
                              <Rnd
                                key={index}
                                style={{
                                  background: `${temp.color}`,
                                  opacity: "0.4",
                                  display: `${temp.checked ? "" : "none  "} `,
                                }}
                                size={{
                                  width: temp.width,
                                  height: temp.height,
                                }}
                                position={{ x: temp.x, y: temp.y }}
                                scale={
                                  Number(
                                    scaling
                                      .replace(/^\D+/g, "")
                                      .replace(/[{()}]/g, "")
                                  ) || 1
                                } //regex extract the numbers from string e.g [ "scale(1.20)".regex gives only 1.20], to show the boxes exact on the plcae with respect to selected scale
                                onDragStop={(e, d) =>
                                  this.onDragStop(e, d, index)
                                }
                                onResizeStop={(
                                  e,
                                  direction,
                                  ref,
                                  delta,
                                  position
                                ) =>
                                  this.onResizeStopHandler(
                                    e,
                                    direction,
                                    ref,
                                    delta,
                                    position,
                                    index
                                  )
                                }
                              ></Rnd>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 p-0">
                <div className="order_template_right_sec table-responsive">
                  <table className="table">
                    <thead className="thead_bg">
                      <tr>
                        <th scope="col">View</th>
                        <th scope="col">Field</th>
                        <th scope="col">Cordinates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templateFields.map((f, i) => {
                        return (
                          <tr key={f.field}>
                            <td>
                              <div className="custom-radio">
                                <label
                                  className="check_main remember_check"
                                  htmlFor={`${"fld" + i}`}
                                >
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`${"fld" + i}`}
                                    name="viewCoord"
                                    checked={f.checked}
                                    onChange={(e) =>
                                      this.handleCheckbox(e, f, i)
                                    }
                                  />
                                  <span className="click_checkmark"></span>
                                </label>
                              </div>
                            </td>

                            <td className="d-flex align-items-center">
                              <div
                                className="vertical--hr"
                                style={{ background: f.color }}
                              ></div>

                              {f.field}
                            </td>
                            <td>{f.coordinates}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div class="text-center">
                    {templateImage ? (
                      <button
                        className="btn cords__btn"
                        onClick={this.updateOrderTemplate}
                      >
                        Update Template
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  setup: state.setup,
});
export default connect(mapStateToProps, {
  getOrderTemplatesList: SetupAction.getOrderTemplatesList,
  getOrderTemplate: SetupAction.getOrderTemplate,
  updateOrderTemplate: SetupAction.updateOrderTemplate,
  clearSetupStates: SetupAction.clearSetupStates,
})(OrderTemplate);
