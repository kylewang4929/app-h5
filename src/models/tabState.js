
export default {

  namespace: 'tabState',

  state: {
    selectedTab: 'deviceList', // deviceList account
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
  },

  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
