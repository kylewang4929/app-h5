
// import Promise from 'promise';
import { getDeviceList, setSubscribe, getDeviceStatus } from '../services/gizwitsSdk';
import { getProductSecret, getProductKeys, getItemForPk } from '../utils/configExpand';
import messageManagement from '../utils/messageManagement';
import router from '../utils/router';
// import Toast from '../utils/Toast';
import { getLanguageString } from '../utils/getLanguage';
import InfoAlert from '../components/InfoAlert';

// let OVERDUE = false;
// /**
//  * 返回false说明没有过期，正常执行
//  */
// const timeOut = (time = 1000) => {
//   const promise = new Promise((resolve) => {
//     setTimeout(() => {
//       if (OVERDUE) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     }, time);
//   });
//   return promise;
// };

const sendDeviceFunc = (list, activeDevice) => {
  const { did } = activeDevice;
  let device = null;
  list.map((item) => {
    if (item.did === did) {
      device = { ...item };
    }
  });
  if (device) {
    messageManagement.post('pushEvent', device, 'Device');
  }
};

/**
 * 所有插入的设备或者更新的设备
 * 都是需要经过这个coverDevice方法
 * @param {*item}
 */
const coverDevice = function (item) {
  const newItem = JSON.parse(JSON.stringify(item));
  newItem.name = newItem.alias === '' ? newItem.productName : newItem.alias;
  newItem.onlineStatus = !!(newItem.netStatus === 1 || newItem.netStatus === 2);
  return newItem;
};

const setDeviceSubscribe = (item) => {
  // 如果已经被订阅 则不重复订阅
  if (item.isSubscribed) {
    return;
  }

  // 提取productSecret
  const productSecret = getProductSecret(item.productKey);

  const obj = {
    device: item,
    productSecret,
    subscribed: true,
  };

  // 订阅设备
  setSubscribe(obj).then(() => {
    // 获取所有数据
    getDeviceStatus({ device: item });
  });
};

export default {
  namespace: 'deviceList',
  state: {
    data: [
      { name: '加热棒', isShare: true, netStatus: 2, onlineStatus: false, mac: 'virtual:site', did: 'ZJNNvXFM2zutcVUj5ipPCC', productKey: 'c6adaa249cf84d0ab96db5daa38622b0' },
      // { name: '球泡灯1', isShare: true, netStatus: 2, onlineStatus: false, mac: 'virtual:site01', did: 'ocBDy4uK4DSJCQ2wuMELjk', productKey: '1e4a02033d22420a8699c71bff4b6226' },
      // { name: '球泡灯2', isShare: true, netStatus: 1, onlineStatus: false, mac: 'virtual:site02', did: 'ocBDy4uK4DSJCQ2wuMELjk', productKey: '1e4a02033d22420a8699c71bff4b6226' },
      // { name: '采暖器', isShare: true, netStatus: 2, onlineStatus: false, mac: 'virtual:site03', did: 'ocBDy4uK4DSJCQ2wuMELjk', productKey: '80d83218504c42baa90dc41b605f5e56' },
    ],
    // data: [],
    loading: false,
    cache: [
      // { name: '采暖器', dev_alias: '采暖器', isBind: false, netStatus: 2, onlineStatus: false, mac: 'virtual:site03', did: 'x8eLRSm8Mr3LyhJzwrcQn3', productKey: '63a7a2e85b154432b720573874416e1f' },
    ],
    activeDevice: {
      did: '',
      groupID: '',
    }, // 标记当前激活的did
    isDefault: true,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * goToTiming({ payload }, { call, put, select }) {
      // 跳转到定时页面
      const deviceList = yield select(state => state.deviceList);
      const language = yield select(state => state.language);

      const config = getItemForPk(deviceList.activeDevice.productKey);

      const THE_FUNCTION_IS_NOT_SUPPORTED_IN_GROUPS = getLanguageString(language.key, 'THE_FUNCTION_IS_NOT_SUPPORTED_IN_GROUPS');
      if (deviceList.activeDevice.groupID) {
        InfoAlert.show(THE_FUNCTION_IS_NOT_SUPPORTED_IN_GROUPS, 'success', 3000);
      } else {
        // 判断使用哪种定时功能
        switch (config.useSchedulerType) {
          case 'group': {
            router.go(`#/menu/groupTiming/${deviceList.activeDevice.productKey}/${deviceList.activeDevice.did}/list`);
            break;
          }
          default: {
            router.go(`#/menu/timing/${deviceList.activeDevice.productKey}/${deviceList.activeDevice.did}/list`);
            break;
          }
        }
      }
    },
    * filterDeviceListAndUpdate({ payload }, { put, select, call }) {
      const deviceList = yield select(state => state.deviceList);
      const bindDevices = [];
      payload.map((item) => {
        if (item.isBind) {
          bindDevices.push(coverDevice(item));
          // 订阅设备
          setDeviceSubscribe(item);
        }
      });
      // 推送到template
      sendDeviceFunc(bindDevices, deviceList.activeDevice);
      // 更新数据到本地

      const deviceListState = yield select(state => state.deviceList);

      // // 兼容sdk一开始报没有设备的问题
      // if (deviceListState.isDefault && bindDevices.length === 0) {
      //   const timeOutData = yield call(timeOut, 3000);
      //   if (timeOutData) return;
      // } else if (OVERDUE === false) {
      //   OVERDUE = true;
      // }
      if (bindDevices.length === 0 && deviceListState.isDefault) {
        yield put({ type: 'updateDeviceList', payload: { cache: payload } });
      } else {
        yield put({ type: 'updateDeviceList', payload: { data: bindDevices, cache: payload, isDefault: false } });
      }
    },
    * getList({ payload }, { call, put, select }) {
      if (!payload.backgroundLoad) {
        yield put({
          type: 'loadingStart',
        });
      }
      const uid = localStorage.getItem('uid');
      const token = localStorage.getItem('token');
      let specialProductKeys = getProductKeys();

      // 如果是* 则不过滤
      if (specialProductKeys === '*') {
        specialProductKeys = [];
      }

      const data = yield call(getDeviceList, { uid, token, specialProductKeys });
      if (data.success) {
        const deviceList = data.data.devices;
        const bindDevices = [];

        // 过滤设备列表，拿到绑定的
        deviceList.map((item) => {
          if (item.isBind) {
            bindDevices.push(coverDevice(item));
            // 订阅设备
            setDeviceSubscribe(item);
          }
        });

        // const deviceListState = yield select(state => state.deviceList);
        // if (bindDevices.length === 0 && deviceListState.isDefault) {
        // } else {
        //   yield put({
        //     type: 'updateDeviceList',
        //     payload: { data: bindDevices, cache: deviceList, isLoading: false, isDefault: false },
        //   });
        // }
        yield put({
          type: 'updateDeviceList',
          payload: { data: bindDevices, cache: deviceList, isLoading: false },
        });

        payload.success(deviceList);
      } else {
        payload.error();
      }
      yield put({
        type: 'loadingEnd',
      });
    },
  },

  reducers: {
    renameDevice(state, action) {
      const { alias, device } = action.payload;
      state.data.map((item, index) => {
        if (item.did === device.did) {
          state.data[index].name = alias;
        }
      });
      return { ...state, data: state.data };
    },
    remarkDevice(state, action) {
      const { remark, device } = action.payload;
      state.data.map((item, index) => {
        if (item.did === device.did) {
          state.data[index].remark = remark;
        }
      });
      return { ...state, data: state.data };
    },
    controlDevice(state, action) {
      const { checked, device } = action.payload;
      state.data.map((item, index) => {
        if (item.did === device.did) {
          state.data[index].onlineStatus = checked;
        }
      });
      return { ...state, data: state.data };
    },
    goToDeviceMore(state) {
      let activeItem = null;
      state.data.map((item) => {
        if (item.did === state.activeDevice.did) {
          activeItem = item;
        }
      });
      if (activeItem) {
        router.go(`#/menu/deviceMore/${activeItem.productKey}/${activeItem.mac}/${activeItem.did}`);
      }
      return state;
    },
    // 删除设备
    deleteDevice(state, action) {
      let deleteIndex = -1;
      state.data.map((item, index) => {
        if (item.did === action.payload.did) {
          deleteIndex = index;
        }
      });
      if (deleteIndex !== -1) {
        state.data.splice(deleteIndex, 1);
      }
      return { ...state };
    },
    update(state, action) {
      return { ...state, ...action.payload };
    },
    // 更新设备状态
    updateNetStatus(state, action) {
      const { mac, netStatus } = action.payload;
      const data = state.data;
      data.map((item, index) => {
        if (item.mac === mac) {
          item.netStatus = netStatus;
          data[index] = coverDevice(item);
        }
      });
      // 推送到template
      sendDeviceFunc(data, state.activeDevice);
      return { ...state, data };
    },
    updateDeviceList(state, action) {
      return { ...state, ...action.payload };
    },
    sendDevice(state) {
      const deviceList = state.data;
      sendDeviceFunc(deviceList, state.activeDevice);
      return state;
    },
    updateActiveDevice(state, action) {
      return { ...state, activeDevice: action.payload };
    },
    loadingStart(state) {
      return { ...state, loading: true };
    },
    loadingEnd(state) {
      return { ...state, loading: false };
    },
  },

};
