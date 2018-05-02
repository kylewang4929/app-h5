import { login, registerEmailUser, registerPhoneUser, sendCode } from '../services/gizwitsSdk';
import { forgotPassword } from '../services/openApi';

import router from '../utils/router';
import InfoAlert from '../components/InfoAlert/index';
import { getLanguageString } from '../utils/getLanguage';

export default {

  namespace: 'loginState',

  state: {
    phoneCode: '+86',
    phoneNum: '',
    email: '',
    register: {
      success: false,
      data: {},
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    /**
     * 登录
     * @param account
     * @param password
     * @param phoneCode
     */
    *login({ payload }, { call, put, select }) {
      const { account, password } = payload;
      const data = yield call(login, { userName: account, password });
      if (data.success) {
        const { uid, token } = data.data;
        localStorage.setItem('uid', uid);
        localStorage.setItem('token', token);
        payload.success(data.data);
      } else {
        payload.error(data.data);
      }
    },
    /**
     * 用户注册App账号时，调用的方法
     * @param payload
     * @param call
     * @param put
     */
    *registerEmail({ payload }, { call, select }) {
      const data = yield call(registerEmailUser, payload);

      const language = yield select(state => state.language);
      const REGISTERED_SUCCESSFULLY = getLanguageString(language.key, 'REGISTERED_SUCCESSFULLY');
      const EMAIL_ALREADY_EXISTS = getLanguageString(language.key, 'EMAIL_ALREADY_EXISTS');
      const REGISTRATION_FAILED_PLEASE_TRY_AGAIN = getLanguageString(language.key, 'REGISTRATION_FAILED_PLEASE_TRY_AGAIN');
      
      if (data.success) {
        InfoAlert.show(REGISTERED_SUCCESSFULLY);
        /**
         * 注册成功后，将处理：
         * 1、将uid、token存到localStorage中
         * 2、跳转页面到设备列表
         */
        localStorage.setItem('uid', data.data.uid);
        localStorage.setItem('token', data.data.token);
        router.go('#/menu/mainPage');
      } else {
        const { errorCode } = data.data;
        switch (errorCode) {
          case 9022:
            InfoAlert.show(EMAIL_ALREADY_EXISTS, 'error');
            break;
          default:
            InfoAlert.show(REGISTRATION_FAILED_PLEASE_TRY_AGAIN, 'error');
        }
      }
    },

    * sendCode({ payload }, { call, select }) {
      const data = yield call(sendCode, payload);
      const language = yield select(state => state.language);
      const AUTH_CODE_IS_SENT_SUCCESSFULLY = getLanguageString(language.key, 'AUTH_CODE_IS_SENT_SUCCESSFULLY');
      const AUTH_CODE_IS_SENT_ERROR = getLanguageString(language.key, 'AUTH_CODE_IS_SENT_ERROR');

      if (data.success) {
        InfoAlert.show(AUTH_CODE_IS_SENT_SUCCESSFULLY);
      } else {
        InfoAlert.show(AUTH_CODE_IS_SENT_ERROR, 'error');
      }
    },

    * registerPhone({ payload }, { call, select }) {
      const data = yield call(registerPhoneUser, payload);

      const language = yield select(state => state.language);
      const REGISTERED_SUCCESSFULLY = getLanguageString(language.key, 'REGISTERED_SUCCESSFULLY');
      const THE_PHONE_NUMBER_HAS_BEEN_REGISTERED = getLanguageString(language.key, 'THE_PHONE_NUMBER_HAS_BEEN_REGISTERED');
      const AUTH_CODE_ERROR = getLanguageString(language.key, 'AUTH_CODE_ERROR');
      const REGISTRATION_FAILED_PLEASE_TRY_AGAIN = getLanguageString(language.key, 'REGISTRATION_FAILED_PLEASE_TRY_AGAIN');
      
      if (data.success) {
        InfoAlert.show(REGISTERED_SUCCESSFULLY);
        /**
         * 注册成功后，将处理：
         * 1、将uid、token存到localStorage中
         * 2、跳转页面到设备列表
         */
        localStorage.setItem('uid', data.data.uid);
        localStorage.setItem('token', data.data.token);
        router.go('#/menu/mainPage');
      } else {
        const { errorCode } = data.data;
        switch (errorCode) {
          case 9018:
            InfoAlert.show(THE_PHONE_NUMBER_HAS_BEEN_REGISTERED, 'error');
            break;
          case 9010:
            InfoAlert.show(AUTH_CODE_ERROR, 'error');
            break;
          default:
            InfoAlert.show(REGISTRATION_FAILED_PLEASE_TRY_AGAIN, 'error');
        }
      }
    },

    *forgotPassword({ payload }, { call, select }) {
      const data = yield call(forgotPassword, payload);

      const language = yield select(state => state.language);
      const RESET_PASSWORD_SUCCESS = getLanguageString(language.key, 'RESET_PASSWORD_SUCCESS');
      const USERS_DON_NOT_EXIST = getLanguageString(language.key, 'USERS_DON_NOT_EXIST');
      const EMAIL_IS_SEND = getLanguageString(language.key, 'EMAIL_IS_SEND');
      const PASSWORD_RESET_FAILED = getLanguageString(language.key, 'PASSWORD_RESET_FAILED');
      const VERIFY_CODE_IS_INVALID_PLEASE_REACQUIRE = getLanguageString(language.key, 'VERIFY_CODE_IS_INVALID_PLEASE_REACQUIRE');
      
      if (data.success) {
        if (payload.phone) {
          InfoAlert.show(RESET_PASSWORD_SUCCESS);
        }
        if (payload.email) {
          InfoAlert.show(EMAIL_IS_SEND);
        }
        router.goBack(-1);
      } else {
        const { error_code } = data.data;
        switch (error_code) {
          case 9005:
            InfoAlert.show(USERS_DON_NOT_EXIST, 'error');
            break;
          case 9010:
            InfoAlert.show(VERIFY_CODE_IS_INVALID_PLEASE_REACQUIRE, 'error');
            break;
          default:
            InfoAlert.show(PASSWORD_RESET_FAILED, 'error');
        }
      }
    }
  },

  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
