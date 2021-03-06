import { createAction } from 'redux-actions';

export const fetchDataSuccess = createAction('USER_FETCH_SUCCESS');
export const fetchDataFailed = createAction('USER_FETCH_FAILED');
export const fetchData = createAction('USER_FETCH');

export const fetchUserData = () => {
  return (dispatch, getState, api) => {
    dispatch(fetchData());
    api
      .get('user/info')
      .then(
        userData => dispatch(fetchDataSuccess(userData)),
        error => dispatch(fetchDataFailed(error))
      );
  };
};

export const setUserToken = createAction('SET_USER_TOKEN');
export const clearUserData = createAction('CLEAR_USER_DATA');
