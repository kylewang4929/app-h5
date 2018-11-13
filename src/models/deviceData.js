import messageManagement from '../utils/messageManagement';
import defaultDeviceData from '../utils/defaultDeviceData';
import { conversionDataPoint } from '../utils/conversionDataPoint';

function filterDeviceData(state, device, data, alerts, faults) {
  const obj = {};
  let currentData = state[device.did];
  console.log('currentData', currentData);
  // 兼容处理
  if (!currentData) {
    currentData = {
      data: {},
      alerts: {},
      faults: {},
    };
  }
  obj[device.did] = {
    data: { ...currentData.data, ...data },
    alerts: { ...currentData.alerts, ...alerts },
    faults: { ...currentData.faults, ...faults },
  };
  return obj;
}

export default {

  namespace: 'deviceData',

  state: {
    ZJNNvXFM2zutcVUj5ipPCC: {
      data: defaultDeviceData,
      alerts: {
        Low_Alarm: false,
        Dried_Alarm: false,
      },
      faults: {
        Fan_Err: false,
        Sensor_Err: false,
      },
    },
    // 'x8eLRSm8Mr3LyhJzwrcQnW': {
    //   data: {
    //     power: true,
    //   },
    // },
    // 'ZJNNvXFM2zutcVUj5ipPCC': {
    //   data: {
    //     power: true,
    //   },
    // }
  },

  effects: {
    * sendDeviceData({ payload }, { select }) {
      const deviceData = yield select(state => state.deviceData);
      const deviceList = yield select(state => state.deviceList);
      /**
       * 获取设备数据的时候需要做一个判断，
       * 如果当前激活设备是分组，要选择一个在线的设备
       */
      const data = deviceData[deviceList.activeDevice.did];
      if (data) {
        // 为了做校验 带上did
        const sendData = {};
        sendData[deviceList.activeDevice.did] = data;
        messageManagement.post('pushEvent', sendData, 'DeviceData');
      }
    },
    * deviceReportData({ payload }, { put }) {
      /**
       * 保存数据，告诉gizwitsSdk设备已经回复
       */
      const { device } = payload;
      sessionStorage.setItem(`deviceOnlineCheck${device.did}`, false);
      yield put({
        type: 'updateDeviceData',
        payload,
      });
    },
  },

  reducers: {
    updateDeviceData(state, action) {
      /**
       * 收到设备上报的内容，更新本地存储，标记已经收到设备回复
       */

      // 如果带有Settemp_Para的时候 需要转换 / 10

      const { payload } = action;
      const { alerts, faults, device, onlyUpdate } = payload;
      let { data } = payload;

      if (!onlyUpdate) {
        data = conversionDataPoint(JSON.parse(JSON.stringify(data)));
      }
      let obj = {};
      if (device.length > 0) {
        // 数组格式
        device.map((item) => {
          obj = { ...obj, ...filterDeviceData(state, item, data, alerts, faults) };
        });
      } else {
        obj = filterDeviceData(state, device, data, alerts, faults);
      }
      console.log({ ...state, ...obj });
      return { ...state, ...obj };
    },
  },

};
