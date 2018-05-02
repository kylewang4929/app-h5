import { getVersion, getPackageName } from '../services/appInfo';

export default {
  namespace: 'timing',
  state: {
    list: [
      {
        endTime: [4, 6],
        startTime: [7, 20],
        id: 0.848113536572056,
        level: 0,
        weeks: [
          {
            value: true,
            label: '周一',
          },
          {
            value: true,
            label: '周二',
          },
          {
            value: true,
            label: '周三',
          },
          {
            value: true,
            label: '周四',
          },
          {
            value: true,
            label: '周五',
          },
          {
            value: false,
            label: '周六',
          },
          {
            value: false,
            label: '周日',
          },
        ],
      },
    ],
  },
  effects: {

  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
    deleteTiming(state, action) {
      let deleteIndex = -1;
      state.list.map((item, index) => {
        if (item.id === action.payload.id) {
          deleteIndex = index;
        }
      });
      if (deleteIndex !== -1) {
        state.list.splice(deleteIndex, 1);
      }
      return { ...state };
    },
  },
};
