import { logError } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

// Actions
import {
  FORGOT_PASSWORD,
  forgotPasswordBegin,
  forgotPasswordSuccess,
  forgotPasswordForbidden,
  forgotPasswordServerError,
} from './actions';

import { forgotPassword } from './service';

// Services
export function* handleForgotPassword(action) {
  try {
    yield put(forgotPasswordBegin());

    yield call(forgotPassword, action.payload.email);

    yield put(forgotPasswordSuccess(action.payload.email));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(forgotPasswordForbidden());
    } else {
      yield put(forgotPasswordServerError());
    }
    logError(e);
  }
}

export default function* saga() {
  yield takeEvery(FORGOT_PASSWORD.BASE, handleForgotPassword);
}
