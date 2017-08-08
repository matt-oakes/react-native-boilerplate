// @flow

// We're using an older types file for flow without all
import { all } from "redux-saga/effects";

import AppLoadSaga from "./appLoad";

// Single entry point to start all Sagas
export default function* RootSaga(): Generator<*, *, *> {
  yield all([
    AppLoadSaga()
  ]);
}
