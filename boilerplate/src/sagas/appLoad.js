// @flow

import { REHYDRATE } from "redux-persist/lib/constants";
import { put, takeEvery } from "redux-saga/effects";

import { UIActions } from "../redux/ui";

/**
 * Fire the ui/app_loaded action once the rehydrate action has been fired
 **/
export default function* appLoadSaga(): Generator<*, *, *> {
  yield takeEvery(REHYDRATE, function* appLoad(): Generator<*, *, *> {
    yield put(UIActions.appLoaded());
  });
}
