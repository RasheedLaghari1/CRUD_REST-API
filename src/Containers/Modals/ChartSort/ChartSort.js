import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

class ChartSort extends Component {
  constructor() {
    super();
    this.state = {
      flag: true,
      // dropdown coding
      selected: [],
      selectedCurrency: { label: "Select Currency", value: "" },
      currency: [],
      selectedLocation: { label: "Select Location", value: "" },
      location: [],
      selectedEpisode: { label: "Select Episodes", value: "" },
      episode: [],
    };
  }

  async componentWillReceiveProps(np) {
    if (this.props.chartSorts && np.openChartSortModal) {
      // to make arrays of currency, location and episodes
      let currency = this.props.chartSorts.currency || [];
      let location = this.props.chartSorts.location || [];
      let episode = this.props.chartSorts.episode || [];
      let crncy = [];
      let loc = [];
      let epi = [];
      currency.map((cr, i) => {
        return crncy.push({
          label: cr.description + " " + "(" + cr.code + ")",
          value: cr.code,
        });
      });
      location.map((lc, i) => {
        return loc.push({
          // label: lc.description + " " + "(" + lc.code + ")",
          label: lc.description,
          value: lc.code,
        });
      });
      episode.map((ep, i) => {
        return epi.push({
          label: ep.description + " " + "(" + ep.code + ")",
          value: ep.code,
        });
      });
      await this.setState({
        currency: crncy,
        location: loc,
        episode: epi,
      });
      // end
      // to show default value
      let chartSort = this.props.defaultChartSort;
      let currency_obj = "";
      let loc_obj = "";
      let epi_obj = "";
      if (chartSort) {
        let chartSortArr = chartSort.toString().split(".");

        if (chartSortArr.length === 3) {
          let c = chartSortArr[0]; // default curreny
          let l = chartSortArr[1]; //default location
          let e = chartSortArr[2]; //default episode

          currency_obj = this.state.currency.find((cr) => cr.value == c);
          loc_obj = this.state.location.find((lc) => lc.value == l);
          epi_obj = this.state.episode.find((ep) => ep.value == e);
        }
      }
      if (
        currency_obj &&
        currency_obj.label &&
        loc_obj &&
        loc_obj.label &&
        epi_obj &&
        epi_obj.label
      ) {
         this.setState({
          selectedCurrency: currency_obj,
          selectedLocation: loc_obj,
          selectedEpisode: epi_obj,
          flag: false,
        });
      }
    }
    // ---- end -----
  }
  handleCurrencyChange = (data) => {
    this.setState({ selectedCurrency: data });
  };
  handleLocationChange = (data) => {
    this.setState({ selectedLocation: data });
  };
  handleEpisodeChange = (data) => {
    this.setState({ selectedEpisode: data });
  };
  onSelect = async () => {
    let currency = this.state.selectedCurrency;
    let location = this.state.selectedLocation;
    let episode = this.state.selectedEpisode;
    if (currency.value && location.value && episode.value) {
      let newChartSort =
        currency.value + "." + location.value + "." + episode.value;
      await this.props.getUpdatedChartSort(newChartSort);
      await this.props.closeModal("openChartSortModal");
      await this.clearStates();
    }
  };
  closeModal = async () => {
    await this.props.closeModal("openChartSortModal");
    await this.clearStates();
  };
  clearStates =  () => {
     this.setState({
      flag: true,
      selected: [],
      selectedCurrency: { label: "Select Currency", value: "" },
      currency: [],
      selectedLocation: { label: "Select Location", value: "" },
      location: [],
      selectedEpisode: { label: "Select Episodes", value: "" },
      episode: [],
    });
  };
  render() {
    return (
      <>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.props.openChartSortModal}
          onHide={this.closeModal}
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
                              <h6 className="text-left def-blue">Chart Sort</h6>
                            </div>
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={() => {
                                  this.props.closeModal("openChartSortModal");
                                }}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-ban"></span>
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="forgot_body">
                        <div className="row mt-4">
                          <div className="col-12">
                            {/* dropdown coding start */}
                            <div className="form-group custon_select">
                              <label>Currency</label>
                              <Select
                                className="width-selector"
                                // defaultValue={this.state.currency[0]}
                                classNamePrefix="custon_select-selector-inner"
                                name="currency"
                                onChange={this.handleCurrencyChange}
                                value={this.state.selectedCurrency}
                                options={this.state.currency}
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
                            {/* end  */}
                          </div>
                          <div className="col-12">
                            {/* dropdown coding start */}
                            <div className="form-group custon_select">
                              <label>Location</label>
                              <Select
                                className="width-selector"
                                // defaultValue={this.state.location[0]}
                                classNamePrefix="custon_select-selector-inner"
                                name="location"
                                onChange={this.handleLocationChange}
                                value={this.state.selectedLocation}
                                options={this.state.location}
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
                            {/* end  */}
                          </div>
                          <div className="col-12">
                            {/* dropdown coding start */}
                            <div className="form-group custon_select">
                              <label>Episode</label>
                              <Select
                                className="width-selector"
                                // defaultValue={this.state.episode[0]}
                                classNamePrefix="custon_select-selector-inner"
                                name="episode"
                                onChange={this.handleEpisodeChange}
                                value={this.state.selectedEpisode}
                                options={this.state.episode}
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
                            {/* end  */}
                          </div>
                        </div>
                      </div>
                      <div className="forgot_header">
                        <div className="modal-top-header">
                          <div className="row">
                            <div className="col d-flex justify-content-end s-c-main">
                              <button
                                onClick={this.onSelect}
                                type="button"
                                className="btn-save"
                              >
                                <span className="fa fa-check"></span>
                                Select
                              </button>
                              <button
                                onClick={this.closeModal}
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

export default ChartSort;
