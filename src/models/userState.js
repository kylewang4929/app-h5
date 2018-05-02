
import { getUserInfo, changeUserPassword, changeUserInfo } from '../services/gizwitsSdk';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';

export default {
  namespace: 'userState',
  state: {
    address: '',
    email: '',
    phone: '',
    gender: '',
    isAnonymous: '',
    name: '',
    remark: '',
    uid: '',
    username: '',
    birthday: '',
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    *userInfo({ payload }, { call, put }) {
      const data = yield call(getUserInfo, payload);
      if (data.success) {
        console.log('getUserInfo success', data);
        yield put({ type: 'update', payload: data.data });
      } else {
        console.log('getUserInfo error', data);
      }
    },
    *changeUserInfo({ payload }, { call, put, select }) {
      console.log('userState/changeUserInfo', payload);
      const { additionalInfo } = payload;
      const userState = yield select(state => state.userState);
      const obj = { ...payload, additionalInfo: { ...userState, ...additionalInfo } };
      if (obj.additionalInfo.gender) {
        switch (obj.additionalInfo.gender) {
          case 'Female': {
            obj.additionalInfo.gender = 1;
            break;
          }
          case 'Male': {
            obj.additionalInfo.gender = 0;
            break;
          }
          default : {
            obj.additionalInfo.gender = 2;
            break;
          }
        }
      }
      const data = yield call(changeUserInfo, obj);
      if (data.success) {
        console.log('changeUserInfo success', data);
        console.log('changeUserInfo success', payload.additionalInfo);
        yield put({ type: 'update', payload: payload.additionalInfo });
        if (payload.success) payload.success();
      } else {
        console.log('changeUserInfo error', data);
        if (payload.error) payload.error();
      }
    },
    * resetPassword({ payload }, { call, select }) {
      console.log('userState/resetPassword', payload);
      const language = yield select(state => state.language);
      const THE_OLD_PASSWORD_IS_INCORRECT = getLanguageString(language.key, 'THE_OLD_PASSWORD_IS_INCORRECT');
      const data = yield call(changeUserPassword, payload);
      if (data.success) {
        console.log('resetPassword success', data);
        payload.success(data);
      } else {
        payload.error(data);
        console.log('resetPassword error', data);
        const { errorCode } = data.data;

        switch (errorCode) {
          case 9056:
            InfoAlert.show(THE_OLD_PASSWORD_IS_INCORRECT, 'error');
            break;
          default:
            break;
        }
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
};
