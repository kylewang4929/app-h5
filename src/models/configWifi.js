import { getCurrentSSID, checkIs5G, connectNetwork } from '../services/netWork';
import { setDeviceOnboarding, bindRemoteDevice, setDeviceOnboardingDeploy } from '../services/gizwitsSdk';
import { getProductSecret } from '../utils/configExpand';

export default {
  namespace: 'configWifi',
  state: {
    SSID: '',
    password: '',
    is5g: false,
    activeDevice: null,
    resumeUpdate: false,
  },
  effects: {
    * getSSID({ payload }, { call, put }) {
      const data = yield call(getCurrentSSID);
      if (data.success) {
        const updateData = {
          SSID: data.data,
        };
        if (payload && payload.resumeUpdate) {
          updateData.resumeUpdate = payload.resumeUpdate;
        } else {
          updateData.resumeUpdate = false;
        }
        yield put({ type: 'update', payload: { ...updateData } });
      } else {
        // 获取ssid失败
      }
    },
    * bindDevice({ payload }, { call, put }) {
      const { device } = payload;
      const uid = localStorage.getItem('uid');
      const token = localStorage.getItem('token');
      const productSecret = getProductSecret(device.productKey);
      const data = yield call(bindRemoteDevice, { uid, token, mac: device.mac, productKey: device.productKey, productSecret });
      if (data.success) {
        payload.success && payload.success(data.data);
      } else {
        payload.error && payload.error(data.data);
      }
    },
    * checkIs5G({ payload }, { call, put }) {
      const data = yield call(checkIs5G);
      if (data.success) {
        yield put({ type: 'update', payload: { is5g: data.data } });
      } else {
      }
    },
    * connectNetwork({ payload }, { call }) {
      const data = yield call(connectNetwork, payload.SSID);
      if (data.success) {
      } else {
      }
    },
    * setDeviceOnboarding({ payload }, { call }) {
      // mode 0是ap 1是airLink
      const { ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix } = payload;

      // 保存密码
      let wifiData = localStorage.getItem('wifiData');
      wifiData = wifiData == null ? '[]' : wifiData;
      wifiData = JSON.parse(wifiData);
      let isMatching = false;
      wifiData.map((item, index) => {
        if (item.ssid === ssid) {
          // 账号相同
          item.key = key;
          isMatching = true;
        }
      });
      if (isMatching === false) {
        wifiData.push({ ssid, key });
      }
      localStorage.setItem('wifiData', JSON.stringify(wifiData));
      // 保存密码

      const data = yield call(setDeviceOnboarding, { ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix });

      if (data.success) {
        payload.success(data.data);
      } else {
        payload.error(data.data);
      }
    },
  },

  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
