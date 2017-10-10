// @flow

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer, createMigration } from 'redux-persist'
import PersistStorage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native

import migrations from "./migrations";
import rootReducer from "./reducers";
import RootSaga from "../sagas";
import type { StoreType } from "./types";

export { initialState } from "./reducers";

const persistConfig = {
  key: "persistKey",
  storage: PersistStorage,
  version: 1,
  migrate: createMigration(migrations, { debug: false }),
  whitelist: []
};
const appReducer = persistReducer(persistConfig, rootReducer)

const composeEnhansers = composeWithDevTools({
  hostname: "localhost",
  port: 8000
});
const store: StoreType = createStore(
  appReducer,
  composeEnhansers(applyMiddleware(createSagaMiddleware()))
);
export const persistor = persistStore(store)

// Start the root saga running which starts all the others
sagaMiddleware.run(RootSaga);

export default store;
