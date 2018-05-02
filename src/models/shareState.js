import { getShareUsers, shareDevice, cancelShareDevice, setUserAlias, replyShareOffer, sharingCode } from '../services/openApi';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';

/**
 * 在异步返回结果时，为了兼容不论有没有success或者error的回调函数，都能正常的调用
 * @param object
 * @param functionName
 * @param params
 */
function execFunctionFrom(object, functionName, data) {
  if (object.hasOwnProperty(functionName)) {
    object[functionName](data);
  }
}

export default {
  namespace: 'shareState',
  state: {
    // 我分享的设备
    shareToSend: {
      meta: {
        total: 0,
        limit: 0,
        skip: 0,
        previous: 'string',
        next: 'string',
      },
      objects: [
        // {
        //   id: 0,
        //   type: 0,
        //   uid: '123',
        //   username: 'string',
        //   user_alias: 'Matthew',
        //   email: '',
        //   phone: '+8618925133808',
        //   did: '222222',
        //   product_name: '智能空气鸡',
        //   dev_alias: 'string',
        //   status: 0,
        //   created_at: 'string',
        //   updated_at: 'string',
        //   expired_at: 'string',
        // },
      ],
    },
    // 分享给我的设备
    shareToReceive: {
      meta: {},
      objects: [
        // {
        //   id: 0,
        //   type: 0,
        //   uid: '123',
        //   username: 'string',
        //   user_alias: 'Matthew',
        //   email: '',
        //   phone: '+8618925133808',
        //   did: '222222',
        //   product_name: '智能空气鸡',
        //   dev_alias: 'string',
        //   status: 0,
        //   created_at: 'string',
        //   updated_at: 'string',
        //   expired_at: 'string',
        // },
      ],
    },
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    * getShareUsers({ payload }, { call, put }) {
      const data = yield call(getShareUsers, payload);
      if (data.success) {
        console.log('获取分享设备信息【成功】', data);
        execFunctionFrom(payload, 'success', data.data);
        if (payload.sharing_type === 0) {
          yield put({ type: 'update', payload: { shareToSend: data.data } });
        } else {
          let hasShare = false;
          data.data.objects.map((item) => {
            if (item.status === 0) {
              // 没有接受的邀请
              hasShare = true;
            }
          });
          yield put({ type: 'update', payload: { shareToReceive: { ...data.data, hasShare } } });
        }
      } else {
        execFunctionFrom(payload, 'error', data.data);
        console.log('获取分享设备信息 【失败】', data);
      }
    },
    * shareDevice({ payload }, { call, select }) {
      // console.log('shareDevice --->', payload);
      const language = yield select(state => state.language);
      const THE_DEVICE_HAS_BEEN_SHARED_WITH_THE_USER = getLanguageString(language.key, 'THE_DEVICE_HAS_BEEN_SHARED_WITH_THE_USER');
      const SHARING_WITHOUT_SUPPORT = getLanguageString(language.key, 'SHARING_WITHOUT_SUPPORT');
      const USERS_DON_NOT_EXIST = getLanguageString(language.key, 'USERS_DON_NOT_EXIST');
      const THE_DEVICE_DOES_NOT_BELONG_TO_YOU = getLanguageString(language.key, 'THE_DEVICE_DOES_NOT_BELONG_TO_YOU');
      const FAILED_DEVICE_SHARING = getLanguageString(language.key, 'FAILED_DEVICE_SHARING');
      
      const data = yield call(shareDevice, payload);
      console.log('shareDevice', data);
      if (data.success) {
        // console.log('执行设备分享【成功】', data);
        execFunctionFrom(payload, 'success', data.data);
      } else {
        // console.log('执行设备分享 【失败】', data);
        const { error_code } = data.data;
        switch (error_code) {
          case 9068:
            InfoAlert.show(SHARING_WITHOUT_SUPPORT, 'error', 3000);
            break;
          case 9081:
            InfoAlert.show(THE_DEVICE_DOES_NOT_BELONG_TO_YOU, 'error', 3000);
            break;
          case 9082:
            InfoAlert.show(USERS_DON_NOT_EXIST, 'error');
            break;
          case 9087:
            InfoAlert.show(THE_DEVICE_HAS_BEEN_SHARED_WITH_THE_USER, 'success', 3000);
            break;
          default:
            InfoAlert.show(FAILED_DEVICE_SHARING, 'error');
        }
        execFunctionFrom(payload, 'error', payload.body.did);
      }
    },
    *cancelShareDevice({ payload }, { call }) {
      console.log('cancelShareDevice ---> ', payload);
      const data = yield call(cancelShareDevice, payload);
      if (data.success) {
        // console.log('取消设备分享【成功】', data);
        execFunctionFrom(payload, 'success', data);
      } else {
        // console.log('取消设备分享【失败】', data);
        execFunctionFrom(payload, 'error', data);
      }
    },
    *setUserAlias({ payload }, { call }) {
      console.log('setUserAlias', payload);
      const data = yield call(setUserAlias, payload);
      if (data.success) {
        // console.log('设备用户别名【成功】', data);
        execFunctionFrom(payload, 'success', data);
      } else {
        // console.log('设备用户别名【失败】', data);
        execFunctionFrom(payload, 'error', data);
      }
    },
    *replyShareOffer({ payload }, { call }) {
      // console.log('handleShareOffer', payload);
      const data = yield call(replyShareOffer, payload);
      if (data.success) {
        // console.log('回应分享邀请【成功】', data);
        execFunctionFrom(payload, 'success', data);
      } else {
        // console.log('回应分享邀请【失败】', data);
        execFunctionFrom(payload, 'error', data);
      }
    },
    * sharingCode({ payload }, { call, select }) {
      const data = yield call(sharingCode, payload);
      const language = yield select(state => state.language);
      console.log('sharingCode', payload, data);
      if (data.success) {
        const BIND_SUCCEED = getLanguageString(language.key, 'BIND_SUCCEED');
        InfoAlert.show(BIND_SUCCEED, 'success', 2000);
        execFunctionFrom(payload, 'success', data);
      } else {
        const { error_code: errCode } = data.data;
        const BIND_FAILED = getLanguageString(language.key, 'BIND_FAILED');
        const QRCODE_EXPIRED = getLanguageString(language.key, 'QRCODE_EXPIRED');
        switch (errCode) {
          case 9088:
            InfoAlert.show(QRCODE_EXPIRED, 'error', 3000);
            break;
          default:
            InfoAlert.show(BIND_FAILED, 'error', 2000);
        }
        execFunctionFrom(payload, 'error', data);
      }
    },
  },
  subscriptions: {},
};
