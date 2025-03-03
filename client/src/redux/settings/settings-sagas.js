import { omit } from 'lodash-es';
import { call, delay, put, takeLatest, takeEvery } from 'redux-saga/effects';

import { createFlashMessage } from '../../components/Flash/redux';

import {
  getUsernameExists,
  putUpdateMyAbout,
  putUpdateMyEducation,
  putUpdateMyWorkExperience,
  putUpdateMyProfileUI,
  putUpdateMyUsername,
  putUpdateUserFlag,
  putVerifyCert,
  putUpdateMyCurrentsSuperBlock
} from '../../utils/ajax';

import {
  updateUserFlagComplete,
  updateUserFlagError,
  validateUsernameComplete,
  validateUsernameError,
  submitNewAboutComplete,
  submitNewAboutError,
  submitNewEducationComplete,
  submitNewEducationError,
  submitNewCurrentsSuperBlockComplete,
  submitNewCurrentsSuperBlockError,
  submitNewWorkExperienceComplete,
  submitNewWorkExperienceError,
  submitNewUsernameComplete,
  submitNewUsernameError,
  submitProfileUIComplete,
  submitProfileUIError,
  verifyCertComplete,
  verifyCertError
} from './';

function* submitNewAboutSaga({ payload }) {
  try {
    const response = yield call(putUpdateMyAbout, payload);
    yield put(submitNewAboutComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewAboutError(e));
  }
}

function* submitNewEducationSaga({ payload }) {
  try {
    const response = yield call(putUpdateMyEducation, payload);
    yield put(submitNewEducationComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewEducationError(e));
  }
}

function* submitNewCurrentsSuperBlockSaga({ payload }) {
  try {
    const response = yield call(putUpdateMyCurrentsSuperBlock, payload);
    yield put(submitNewCurrentsSuperBlockComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewCurrentsSuperBlockError(e));
  }
}

function* submitNewWorkExperienceCompleteSaga({ payload }) {
  try {
    const response = yield call(putUpdateMyWorkExperience, payload);
    yield put(submitNewWorkExperienceComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewWorkExperienceError(e));
  }
}

function* submitNewUsernameSaga({ payload: username }) {
  try {
    const response = yield call(putUpdateMyUsername, username);
    yield put(submitNewUsernameComplete({ ...response, username }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitNewUsernameError(e));
  }
}

function* submitProfileUISaga({ payload }) {
  try {
    const response = yield call(putUpdateMyProfileUI, payload);
    yield put(submitProfileUIComplete({ ...response, payload }));
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(submitProfileUIError);
  }
}

function* updateUserFlagSaga({ payload: update }) {
  try {
    const response = yield call(putUpdateUserFlag, update);
    yield put(updateUserFlagComplete({ ...response, payload: update }));
    yield put(
      createFlashMessage({ ...response, variables: { theme: update.theme } })
    );
  } catch (e) {
    yield put(updateUserFlagError(e));
  }
}

function* validateUsernameSaga({ payload }) {
  try {
    yield delay(500);
    const { exists } = yield call(getUsernameExists, payload);
    yield put(validateUsernameComplete(exists));
  } catch (e) {
    yield put(validateUsernameError(e));
  }
}

function* verifyCertificationSaga({ payload }) {
  try {
    const { response, isCertMap, completedChallenges } = yield call(
      putVerifyCert,
      payload
    );
    yield put(
      verifyCertComplete({
        ...response,
        payload: {
          ...isCertMap,
          completedChallenges: completedChallenges.map(x => ({
            ...omit(x, 'files'),
            challengeFiles: x.files ?? null
          }))
        }
      })
    );
    yield put(createFlashMessage(response));
  } catch (e) {
    yield put(verifyCertError(e));
  }
}

export function createSettingsSagas(types) {
  return [
    takeEvery(types.updateUserFlag, updateUserFlagSaga),
    takeLatest(types.submitNewAbout, submitNewAboutSaga),
    takeLatest(types.submitNewEducation, submitNewEducationSaga),
    takeLatest(
      types.submitNewCurrentsSuperBlock,
      submitNewCurrentsSuperBlockSaga
    ),
    takeLatest(
      types.submitNewWorkExperience,
      submitNewWorkExperienceCompleteSaga
    ),
    takeLatest(types.submitNewUsername, submitNewUsernameSaga),
    takeLatest(types.validateUsername, validateUsernameSaga),
    takeLatest(types.submitProfileUI, submitProfileUISaga),
    takeEvery(types.verifyCert, verifyCertificationSaga)
  ];
}
