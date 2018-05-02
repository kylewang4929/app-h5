
export default {

  namespace: 'templateState',

  state: {
    isInit: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
  },

  reducers: {
    initSuccess(state) {
      return { ...state, isInit: true };
    },
    initStart(state) {
      return { ...state, isInit: false };
    },
  },

};
