import { getVersion, getPackageName } from '../services/appInfo';

export default {
  namespace: 'appInfo',
  state: {
    version: '1.0.0',
  },
  effects: {
    * getVersion({ payload }, { call, put }) {
      const data = yield call(getVersion);
      if (data.success) {
        yield put({ type: 'update', payload: {
          version: data.data,
        } });
      } else {
        // 获取version失败
      }
    },
    * getPackageName({ payload }, { call, put }) {
      const data = yield call(getPackageName);
      if (data.success) {
        payload.success(data.data);
        yield put({ type: 'update', payload: {
          packageName: data.data,
        } });
      } else {
        // 获取包名失败
      }
    },
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
