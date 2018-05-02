import { query } from '../services/aggregateData';
import messageManagement from '../utils/messageManagement';

export default {
  namespace: 'aggregateData',
  state: {
  },
  effects: {
    * query({ payload }, { call, put }) {
      const { did, startime, endtime, attr, aggregator, unit, callbackKey } = payload;
      const data = yield call(query, { did, startime, endtime, attr, aggregator, unit });
      if (data.success) {
        messageManagement.post('callback', data.data.data, callbackKey);
      } else {
      }
    },
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
