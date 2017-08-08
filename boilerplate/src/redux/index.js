// @flow

import { AsyncStorage } from "react-native";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";
import createSagaMiddleware from "redux-saga";
import { persistStore, autoRehydrate } from "redux-persist";
import { createBlacklistFilter } from "redux-persist-transform-filter";
import createMigration from "redux-persist-migrate";

import migrationManifest from "./migrations";
import appReducer from "./reducers";
import RootSaga from "../sagas";
import type { StoreType } from "./types";

export { initialState } from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const migration = createMigration(migrationManifest, "persist");

const composeEnhansers = composeWithDevTools({
  hostname: "localhost",
  port: 8000
});
const store: StoreType = createStore(
  appReducer,
  composeEnhansers(migration, autoRehydrate(), applyMiddleware(sagaMiddleware))
);

// Start the root saga running which starts all the others
sagaMiddleware.run(RootSaga);

// Begin periodically persisting the store with the whitelisted reducer names
persistStore(store, {
  whitelist: ["persist", "outlet", "user"],
  transforms: [
    // We don't want to store all the outlets through persist, as that's a lot of data to load on startup
    // TODO: Store the outlets in another way so they can work offline
    createBlacklistFilter("outlet", ["outlets"])
  ],
  storage: AsyncStorage
});

export default store;
