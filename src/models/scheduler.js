/**
 * 预约
 */
import { create, query, edit, deleteItem } from '../services/scheduler';
import { getLanguageString } from '../utils/getLanguage';
import InfoAlert from '../components/InfoAlert';
import { filterUpcoming, conversionBookingList, conversionRepeat, conversionTimeAndDate, checkIsConsistent } from '../utils/schedulerTool';

// let originalData = [
//   {
//     "id": '123',
//     "attrs": {
//       power: true
//     },
//     "date": "2017-07-09",
//     "time": "06:12",
//     "repeat": "none",
//     "enabled": true
//   },
//   {
//     "id": '1223',
//     "attrs": {
//       power: true
//     },
//     "date": "2016-12-29",
//     "time": "06:14",
//     "repeat": "mon,tue,wed,thu,fri,sat,sun",
//     "enabled": true
//   }
// ];
// originalData = conversionBookingList(originalData);

export default {

  namespace: 'scheduler',

  state: {
    // data: originalData,
    data: [],
    loading: false,
    isDefault: true,
    upcoming: { timeText: '', item: {} }, //即将到来的预约
    setting: {},
    // upcoming: filterUpcoming(originalData),
  },

  effects: {
    *query({ payload }, { call, put, select }) {
      //payload传递did
      if (!payload.backgroundLoad) {
        yield put({
          type: 'loadingStart',
        });
      }
      const data = yield call(query, { did: payload.did });
      if (data.success) {
        yield put({ type: 'updateSuccess', payload: { data: data.data } });
      }
      yield put({ type: 'loadingEnd' });
    },
    /**
     * @param {*attrs}
     * @param {*date}
     * @param {*time} {hour: 1, min: 1}
     * @param {*repeat}
     * @param {*enabled}
     */
    * create({ payload }, { call, put, select }) {

      let { attrs, date, time, repeat, enabled, did } = payload;

      const language = yield select(state => state.language);
      const CAN_NOT_ADD_THE_SAME_TIMING = getLanguageString(language.key, 'CAN_NOT_ADD_THE_SAME_TIMING');
      const TO_ADD_TIME_FAILURE = getLanguageString(language.key, 'TO_ADD_TIME_FAILURE');

      // 要转换time 同时要判断是循环预约还是单次预约，以及时间是否合法
      if (typeof repeat === 'object') {
        repeat = conversionRepeat(repeat);
      } else {
        // 检查时间是否合法
      }

      const timeObj = conversionTimeAndDate(time, date, repeat === 'none' ? 'single' : 'cycle');
      date = timeObj.date;
      time = timeObj.time;

      const item = { attrs, date, time, repeat, enabled, did };
      const schedulerList = yield select(state => state.scheduler.data);
      const isConsistent = checkIsConsistent(schedulerList, item);
      if (isConsistent) {
        // 重复的，提示错误
        InfoAlert.show(CAN_NOT_ADD_THE_SAME_TIMING, 'error', 3000);
        return;
      }
      const data = yield call(create, item);
      if (data.success) {
        payload.success();
        yield put({ type: 'addBookingSuccess', payload: { ...item, id: data.data.id } });
      } else {
        // console.log('添加定时失败，请重试', data);
        // console.log('payload', payload);
        payload.error(data);
        InfoAlert.show(TO_ADD_TIME_FAILURE, 'error', 3000);
      }
    },
    /**
     * @param {*attrs} 
     * @param {*date} 
     * @param {*time} {hour: 1, min: 1}
     * @param {*repeat} 
     * @param {*enabled} 
     */
    * edit({ payload }, { call, put, select }) {

      let { attrs, date, time, repeat, enabled, did, id, remark } = payload;

      const language = yield select(state => state.language);
      const CAN_NOT_ADD_THE_SAME_TIMING = getLanguageString(language.key, 'CAN_NOT_ADD_THE_SAME_TIMING');
      const TO_EDIT_TIME_FAILURE = getLanguageString(language.key, 'TO_EDIT_TIME_FAILURE');

      // 要转换time 同时要判断是循环预约还是单次预约，以及时间是否合法
      if (typeof repeat == 'object') {
        repeat = conversionRepeat(repeat);
      } else {
        // 检查时间是否合法
      }
      const timeObj = conversionTimeAndDate(time, date, repeat == 'none' ? 'single' : 'cycle');
      date = timeObj.date;
      time = timeObj.time;

      const item = { attrs, date, time, repeat, enabled, did, id, remark };

      const schedulerList = yield select(state => state.scheduler.data);
      const isConsistent = checkIsConsistent(schedulerList, item);

      // 暂时不提示重复这个错误
      // if (isConsistent) {
      //   InfoAlert.show(CAN_NOT_ADD_THE_SAME_TIMING, 'error', 3000);
      //   return;
      // }

      const data = yield call(edit, item);

      if (data.success) {
        payload.success();
        yield put({ type: 'updateBookingSuccess', payload: { attrs, date, time, repeat, enabled, did, id, remark } });
      } else {
        InfoAlert.show(TO_EDIT_TIME_FAILURE, 'error', 3000);
        payload.error();
      }
    },
    * delete({ payload }, { call, put, select }) {

      const language = yield select(state => state.language);
      const DELETE_THE_TIME_FAILURE = getLanguageString(language.key, 'DELETE_THE_TIME_FAILURE');

      const { did, id } = payload;

      const data = yield call(deleteItem, { did, id });
      if (data.success) {
        payload.success();
        yield put({ type: 'deleteBookingSuccess', payload: { did, id } });
      } else {
        payload.error();
        InfoAlert.show(DELETE_THE_TIME_FAILURE, 'error', 3000);
      }
    },
    * toggleAllScheduler({ payload }, { call, put, select }) {
      const data = yield call(query, { did: payload.device.did });
      if (data.success) {
        data.data.map((item) => {
          // toggle所有的定时
          edit({ ...item, enabled: payload.data });
        });
        yield put({ type: 'updateSuccess', payload: { data: data.data } });
        // 返回定时数据
        const listData = yield select(state => state.scheduler.data);
        payload.success && payload.success(listData);
      } else {
        payload.error && payload.error();
      }
    },
  },

  reducers: {
    updateSetting(state, action) {
      return {
        ...state,
        setting: { ...action.payload },
      };
    },
    resetData(state) {
      // 重置数据
      return { ...state, data: [], loading: false, isDefault: true, upcoming: { timeText: '', item: {} } };
      // return state;
    },
    updateSuccess(state, action) {
      const { data } = action.payload;
      const newData = conversionBookingList(data);
      const upcoming = filterUpcoming(newData);
      return { ...state, ...action.payload, data: newData, upcoming, isDefault: false };
    },
    addBookingSuccess(state, action) {
      const { id, attrs, time, repeat, enabled, date } = action.payload;

      let newItem = {
        attrs,
        id,
        time,
        date,
        repeat,
        enabled,
      };

      newItem = conversionBookingList([newItem]);

      state.data.unshift(newItem[0]);
      return { ...state };
    },
    deleteBookingSuccess(state, action) {
      const newData = state.data;
      let deleteIndex = null;
      // 删除被删除的预约
      newData.map((item, index) => {
        if (item.id === action.payload.id) {
          deleteIndex = index;
        }
      });
      if (deleteIndex != null) {
        newData.splice(deleteIndex, 1);
      }
      const upcoming = filterUpcoming(newData);
      return { ...state, data: newData, upcoming };
    },
    updateBookingSuccess(state, action) {
      const newData = state.data;
      newData.map((item, index) => {
        if (item.id === action.payload.id) {
          // 构造新的item
          const originalData = [{ ...newData[index].originalData, ...action.payload }];
          const newDataItem = conversionBookingList(originalData);
          newData[index] = newDataItem[0];
        }
      });
      const upcoming = filterUpcoming(newData);
      return { ...state, data: newData, upcoming };
    },
    loadingStart(state) {
      return { ...state, loading: true };
    },
    loadingEnd(state) {
      return { ...state, loading: false };
    },
  },
};
