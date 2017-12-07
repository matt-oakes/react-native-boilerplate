// @flow

import { all, call } from "redux-saga/effects";

import appLoadSaga from "./appLoad";

// Single entry point to start all Sagas
export default function* rootSaga(): Generator<*, *, *> {
  yield all([call(appLoadSaga)]);
}
