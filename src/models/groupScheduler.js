import { Toast } from 'antd-mobile';
import moment from 'moment';
import { conversionRepeat, conversionBookingList, localTimeToUtcTime, formattingNum } from '../utils/schedulerTool';
import { save } from '../services/groupScheduler';
import { getLanguageString } from '../utils/getLanguage';
import router from '../utils/router';

export default {

  namespace: 'groupScheduler',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * setAntifreeze({ payload }, { call, put, select }) {
      const { device } = payload;
      let { temp } = payload;
      if (temp) {
        
      } else {
        const deviceData = yield select(state => state.deviceData);
        // 找出防冻温度
        try {
          temp = deviceData[device.did].data.antifreeze_temperature;
        } catch (error) {
          temp = 10;
        }
      }
      yield put({
        type: 'gizwitsSdk/sendCmd',
        payload: {
          data: {
            temperature: temp,
          },
          device,
        },
      });
    },
    * save({ payload }, { call, put, select }) {
      const { did, repeat, name } = payload;
      const groupScheduler = yield select(state => state.groupScheduler);
      groupScheduler.data.data.map((item) => {
        item.repeat = repeat;
        // 重写remark
        let remark = JSON.parse(item.originalData.remark);
        remark.name = name;
        item.originalData.remark = JSON.stringify(remark);
      });

      const languageKey = localStorage.getItem('languageKey');
      const LOADING = getLanguageString(languageKey, 'LOADING');
      Toast.loading(LOADING);
      // 保存
      const postData = [];
      groupScheduler.data.data.map((item) => {
        const { repeat, type } = item;
        // 转换一下repeat
        postData.push({ ...item.originalData, repeat: conversionRepeat(repeat), type, did });
      });
      const data = yield save(postData);
      Toast.hide();
      if (data[0].success) {
        // 保存成功
        router.goBack(-1);
      } else {
        // 失败
      }
    },
  },
  reducers: {
    updateActiveItem(state, action) {
      return { ...state, data: action.payload };
    },
    delete(state, action) {
      state.data.data.map((item, index) => {
        const remark = JSON.parse(item.originalData.remark);
        if (remark.gid === action.payload) {
          item.type = 'delete';
        }
      });
      // 删除后要重新计算
      return { ...state };
    },
    newItem(state, action) {

      const { attr, id } = action.payload;

      const languageKey = localStorage.getItem('languageKey');
      const TIMING = getLanguageString(languageKey, 'TIMING');

      // 判断今天是周几
      const date = moment();
      const weekday = date.weekday();
      const defaultRepeat = [
        { active: false, text: 'SUN', id: 'sun' },
        { active: false, text: 'MON', id: 'mon' },
        { active: false, text: 'TUE', id: 'tue' },
        { active: false, text: 'WED', id: 'wed' },
        { active: false, text: 'THU', id: 'thu' },
        { active: false, text: 'FRI', id: 'fri' },
        { active: false, text: 'SAT', id: 'sat' },
      ];
      defaultRepeat[weekday].active = true;

      // 计算出本地时间0点和12点
      const offset = moment().utcOffset();
      const zeroTime = moment();
      zeroTime.hour(0);
      zeroTime.minute(0);
      zeroTime.minute(zeroTime.minute() - offset);

      const midTime = moment();
      midTime.hour(12);
      midTime.minute(0);
      midTime.minute(zeroTime.minute() - offset);

      const remark = {
        id,
        name: TIMING,
        gid: `gid${new Date().getTime()}`,
      };
      const originalData = [
        {
          id: '1',
          attrs: JSON.parse(`{ "${attr}": 20 }`),
          time: zeroTime.format('HH:mm'),
          repeat: 'mon',
          enabled: true,
          remark: JSON.stringify({ ...remark, type: 'start' }),
        },
        {
          id: '2',
          attrs: JSON.parse(`{ "${attr}": 20 }`),
          time: midTime.format('HH:mm'),
          repeat: 'mon',
          enabled: true,
          remark: JSON.stringify({ ...remark, type: 'end' }),
        },
      ];

      // 转换成预期格式
      const schedulerList = conversionBookingList(originalData);

      // 标记为新建
      schedulerList.map((item) => {
        item.type = 'create';
      });

      const data = {
        id,
        data: schedulerList,
        timeText: TIMING,
        repeat: defaultRepeat,
        isActive: true,
      };
      return { ...state, data };
    },
    updateTiming(state, action) {
      const { hour, min, attrs, id, endId, endHour, endMin, endAttrs } = action.payload;
      // 更新数据
      state.data.data.map((item) => {
        if (item.id === id) {
          item.time = {
            hours: hour,
            min,
          };
          item.attrs = attrs;
          item.timeText = `${formattingNum(hour)}:${formattingNum(min)}`;
          // 同时也需要更新原始数据
          item.originalData.attrs = attrs;
          const utcTime = localTimeToUtcTime(moment().format('YYYY-MM-DD'), { hour, min });
          item.originalData.time = utcTime.time;
        }
        if (item.id === endId) {
          item.time = {
            hours: endHour,
            min: endMin,
          };
          item.attrs = endAttrs;
          item.timeText = `${formattingNum(endHour)}:${formattingNum(endMin)}`;
          // 同时也需要更新原始数据
          item.originalData.attrs = endAttrs;
          const utcTime = localTimeToUtcTime(moment().format('YYYY-MM-DD'), { hour: endHour, min: endMin });
          item.originalData.time = utcTime.time;
        }
      });
      return { ...state };
    },
    createTiming(state, action) {
      const repeat = state.data.data[0].originalData.repeat;
      const { hour, min, attrs, endAttrs, endHour, endMin } = action.payload;
      const utcTime = localTimeToUtcTime(moment().format('YYYY-MM-DD'), { hour, min });
      const nextUtcTime = localTimeToUtcTime(moment().format('YYYY-MM-DD'), { hour: endHour, min: endMin });
      const remark = JSON.parse(state.data.data[0].originalData.remark);

      const gid = `gid${new Date().getTime()}`;
      remark.gid = gid;

      const data = {
        id: `${new Date().getTime()}1`,
        attrs,
        time: utcTime.time,
        repeat,
        enabled: true,
        remark: JSON.stringify({ ...remark, type: 'start' }),
      };

      const nextData = {
        id: `${new Date().getTime()}2`,
        attrs: endAttrs,
        time: nextUtcTime.time,
        repeat,
        enabled: true,
        remark: JSON.stringify({ ...remark, type: 'end' }),
      };

      const newSchedulerList = conversionBookingList([data]);
      newSchedulerList[0].type = 'create';

      const nextNewSchedulerList = conversionBookingList([nextData]);
      nextNewSchedulerList[0].type = 'create';

      state.data.data.push(newSchedulerList[0]);
      state.data.data.push(nextNewSchedulerList[0]);
      return { ...state };
    },
  },
};
