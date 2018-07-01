// @flow

import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import PersistStorage from "redux-persist/lib/storage";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";

import migrations from "./migrations";
import middleware from "./middleware";
import rootReducer from "./reducers";
import type { StoreType } from "./types";

import RootSaga from "../sagas";

export { initialState } from "./reducers";

const persistConfig = {
  key: "persistKey",
  storage: PersistStorage,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: []
};
const appReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
const reactNavigationMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.navigation.state
);

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
// $FlowFixMe
const store: StoreType = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(...middleware, reactNavigationMiddleware, sagaMiddleware)
  )
);
export const persistor = persistStore(store);

// Start the root saga running which starts all the others
sagaMiddleware.run(RootSaga);

export default store;
