import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import {
  logOutUser,
  clearStatesAfterLogout,
} from "../Actions/UserActions/UserActions";

const ModileResponsiveMenu = (props) => {
  const history = useHistory();

  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  useEffect(() => {
    if (userState.logoutSuccess) {
      toast.success(userState.logoutSuccess);
      dispatch(clearStatesAfterLogout());

      history.push("/login");
    }

    if (userState.logoutError) {
      // toast.success(userState.logoutError);
      handleApiRespErr(userState.logoutError, props);
    }
  }, [userState]);

  const handleApiRespErr = async (error) => {
    if (
      error === "Session has expired. Please login again." ||
      error === "User has not logged in."
    ) {
      dispatch(clearStatesAfterLogout());
      history.push("/login");
    } else if (error === "User has not logged into a production.") {
      history.push("/login-table");
    } else {
      toast.error(error);
    }
  };

  const logout = async () => {
    setisLoading(true);
    let pathName =
      (props &&
        props.props &&
        props.props.location &&
        props.props.location.pathname) ||
      "";
    if (pathName) {
      //Client-> Can you save the last page a user was logged into so when they log in next it takes them back to that page?
      localStorage.setItem("lastPageLogin", pathName);
    }
    await dispatch(logOutUser());
    setisLoading(false);
  };

  return (
    <div>
      {isLoading ? <div className="se-pre-con"></div> : ""}
      <ul id="responsive_menu">
        <li
          className={props.active === "dashboard" && `responsive_menu_active`}
        >
          <a href="/dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5378 759 13.333 11.333"
            >
              <path
                id="ic_home_24px"
                className="cls-1"
                d="M7.333,14.333v-4H10v4h3.333V9h2L8.667,3,2,9H4v5.333Z"
                transform="translate(-5380 756)"
              />
            </svg>
            <span> Home </span>
          </a>
        </li>
        <li className={props.active === "timecard" && `responsive_menu_active`}>
          <a href="/timecards">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5378 806 13.333 10.909"
            >
              <defs></defs>
              <path
                id="ic_picture_in_picture_alt_24px"
                className="cls-1"
                d="M11.909,7.848H7.061v3.636h4.848ZM14.333,12.7V4.2A1.205,1.205,0,0,0,13.121,3H2.212A1.205,1.205,0,0,0,1,4.2v8.5a1.216,1.216,0,0,0,1.212,1.212H13.121A1.216,1.216,0,0,0,14.333,12.7Zm-1.212.012H2.212V4.194H13.121Z"
                transform="translate(-5379 803)"
              />
            </svg>
            <span> TimeCard</span>
          </a>
        </li>

        <li
          className={props.active === "signature" && `responsive_menu_active`}
        >
          <a href="/signature">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5377.333 896 12 15"
            >
              <defs></defs>
              <path
                id="ic_description_24px"
                className="cls-1"
                d="M11.5,2h-6A1.5,1.5,0,0,0,4.008,3.5L4,15.5A1.5,1.5,0,0,0,5.492,17H14.5A1.5,1.5,0,0,0,16,15.5v-9ZM13,14H7V12.5h6Zm0-3H7V9.5h6ZM10.75,7.25V3.125L14.875,7.25Z"
                transform="translate(-5381.333 894)"
              />
            </svg>
            <span>Signature </span>
          </a>
        </li>

        <li>
          <a href={null} onClick={logout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5377.499 1091.267 13.573 11.709"
            >
              <defs></defs>
              <path
                id="ic_keyboard_tab_24px"
                className="cls-1"
                d="M6.717,1.284l2.253,3.4-9,.078-.011,1.9,9-.078-2.3,3.439.894,1.335L11.4,5.614,7.62-.066ZM12.065-.105,12,11.322l1.27-.011L13.335-.116Z"
                transform="matrix(-1, 0.017, -0.017, -1, -5363.967, 1102.627)"
              />
            </svg>
            <span> Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ModileResponsiveMenu;
