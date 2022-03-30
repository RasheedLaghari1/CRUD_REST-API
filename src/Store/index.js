import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../Reducers/index";
import { logger } from "redux-logger";

const middlewares = [thunk, logger];

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares))
);

export default store;
