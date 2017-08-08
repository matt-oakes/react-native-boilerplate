// @flow

import { takeEvery } from "redux-saga";
import { put } from "redux-saga/effects";
import { REHYDRATE } from "redux-persist/constants";

import { UIActions } from "../redux/ui";
import { Actions } from "../redux/types";
import type { ActionType } from "../redux/types";

/**
 * Fire the ui/app_loaded action once the rehydrate action has been fired
 **/
export default function* appLoadSaga(): Generator<*, *, *> {
  yield takeEvery(REHYDRATE, function* appLoad(
    action: ActionType
  ): Generator<*, *, *> {
    yield put(UIActions.appLoaded());
  });
}
