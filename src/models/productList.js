
export default {

  namespace: 'productList',

  state: {
    data: [
      {name: '插座', id: '1', type: 'socket'},
      {name: '智能灯', id: '2', type: 'lamp'},
    ],
    loading: false,
    isDefault: false
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
