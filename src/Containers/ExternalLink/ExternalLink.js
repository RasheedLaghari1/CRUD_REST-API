import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import {
  getHelpPage,
  clearUserStates,
  clearStatesAfterLogout,
} from "../../Actions/UserActions/UserActions";

class ExternalLink extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });

    if (!this.props.user.getHelpPage) {
      await this.props.getHelpPage();
    }

    //success case of Get Help Page
    if (this.props.user.getHelpPageSuccess) {
      // toast.success(this.props.user.getHelpPageSuccess);
    }
    //error case of Get Help Page
    if (this.props.user.getHelpPageError) {
      let error = this.props.user.getHelpPageError;
      if (
        error === "Session has expired. Please login again." ||
        error === "User has not logged in."
      ) {
        this.props.clearStatesAfterLogout();
        this.props.history.push("/login");
      } else {
        //Netork Error || api error
        toast.error(error);
      }
    }
    this.props.clearUserStates();
    this.setState({ isLoading: false });
  }

  render() {
    let link = this.props.user.getHelpPage || "#";
    return (
      <>
        {this.state.isLoading ? <div className="se-pre-con"></div> : ""}

        <div className="container-fluid">
          <div className="col-12">
            <Link className="navbar-brand" to="/dashboard">
              <img src="images/logo.png" className="img-fluid" alt="logo" />
            </Link>
            <div className="row d-flex external-text">
              <div className=" justify-content-center w-100 align-self-center m-2">
                <a href={link} target="_blank" className="helpLinkColor">
                  Help - External Link
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  getHelpPage,
  clearUserStates,
  clearStatesAfterLogout,
})(ExternalLink);
