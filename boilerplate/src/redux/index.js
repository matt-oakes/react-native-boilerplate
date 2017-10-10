// @flow

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import PersistStorage from 'redux-persist/lib/storage'

import migrations from "./migrations";
import rootReducer from "./reducers";
import RootSaga from "../sagas";
import type { StoreType } from "./types";

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

const composeEnhansers = composeWithDevTools({
  hostname: "localhost",
  port: 8000
});
const store: StoreType = createStore(
  appReducer,
  composeEnhansers(applyMiddleware(sagaMiddleware))
);
export const persistor = persistStore(store)

// Start the root saga running which starts all the others
sagaMiddleware.run(RootSaga);

export default store;
