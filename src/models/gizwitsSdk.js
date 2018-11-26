
import { init, write, unbindDevice, setCustomInfo, getCurrentCloudService, apiLogin } from '../services/gizwitsSdk';
import { groupWrite } from '../services/deviceGroup';
import config from '../config/template';
import { getProductKeys, getProductSecrets } from '../utils/configExpand';
import router from '../utils/router';
import MyToast from '../utils/Toast';
import { getLanguageString } from '../utils/getLanguage';
import { conversionDataPointCToF, conversionDataPoint } from '../utils/conversionDataPoint';

const gizwitsConfig = config.gizwits;

/**
 * 检查设备是否离线
 */
let TIME_OUT_OBJ = null;
const checkInOnline = (key) => {
  if (TIME_OUT_OBJ) {
    clearTimeout(TIME_OUT_OBJ);
  }
  sessionStorage.setItem(key, true);
  TIME_OUT_OBJ = setTimeout(() => {
    const flag = sessionStorage.getItem(key);
    if (flag === 'true' || flag === true) {
      // 暂时先取消
      const languageKey = localStorage.getItem('languageKey');

      const ErrorTips = getLanguageString(languageKey, 'FAILED_TO_SEND_COMMAND_CHECK_CURRENT_CONNECTION_STATUS');
      // MyToast.info(ErrorTips, 2);
    }
  }, 4000);
};

export default {

  namespace: 'gizwitsSdk',

  state: {
    initSuccess: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

    },
  },

  effects: {
    * init({ payload }, { call, put }) {
      let specialProductKeys = getProductKeys();
      const specialProductKeySecrets = getProductSecrets();
      // 如果是* 则不过滤
      if (specialProductKeys === '*') {
        specialProductKeys = [];
      }

      let appID = '';
      let appSecret = '';

      // 判断平台
      try {
        if (device.platform === 'Android') {
          appID = gizwitsConfig.androidAppID;
          appSecret = gizwitsConfig.androidAppSecret;
        } else {
          appID = gizwitsConfig.iosAppID;
          appSecret = gizwitsConfig.iosAppSecret;
        }
      } catch (error) {

      }
      const data = yield call(init, {
        appID,
        appSecret,
        specialProductKeys,
        specialProductKeySecrets,
      });
      if (data.success) {
        const serveInfo = yield call(getCurrentCloudService, null);
        window.serveInfo = serveInfo.data;
        yield put({ type: 'update', payload: { initSuccess: true, serveInfo: serveInfo.data } });
        payload.success();
      } else {
        payload.error();
      }
    },
    // 解除设备绑定
    * getCurrentCloudService({ payload }, { call, put }) {
      const data = yield call(getCurrentCloudService, null);
      if (data.success) {
        window.serveInfo = data.data;
        yield put({ type: 'update', payload: { serveInfo: data.data } });
      }
    },
    * unBindDevice({ payload }, { call, put }) {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      const did = payload.did;
      console.log('payload', payload);
      const data = yield call(unbindDevice, { token, uid, did });

      if (data.success) {
        yield put({ type: 'deviceList/deleteDevice', payload: { did } });
        payload.success && payload.success();
      } else {
        payload.error && payload.error();
      }
    },
    * quickLogin({ payload }, { call, put }) {
      const data = yield call(apiLogin, { authData: payload.authData });
      if (data.success) {
        yield put({ type: 'loginSuccess' });
        // 登录成功，统一保存token
        localStorage.setItem('uid', data.data.uid);
        localStorage.setItem('token', data.data.token);
        router.go('#/menu/mainPage');
        payload.success && payload.success();
      } else {
        payload.error && payload.error();
      }
    },
    * setCustomInfo({ payload }, { call, put }) {
      const { device, alias, remark } = payload;
      const data = yield call(setCustomInfo, { device, remark, alias });
      if (data.success) {
        if (alias) yield put({ type: 'deviceList/renameDevice', payload: { device, alias } });
        if (remark) yield put({ type: 'deviceList/remarkDevice', payload: { device, remark } });
        payload.success();
      } else {
        payload.error();
      }
    },
    * templateSendCmd({ payload }, { put, select }) {
      /**
       * 本版本中 废弃这个方法
       */

      const { data, device } = payload;
      // 做一个判断，如果当前activeDevice 是分组的话则调用分组的api
      const activeDevice = yield select(state => state.deviceList.activeDevice);
      if (activeDevice.groupID) {
        // 是分组
        const deviceGroup = yield select(state => state.deviceGroup.data);
        let activeGroup = {};
        // 找出当前激活的分组
        deviceGroup.map((item) => {
          if (item.id === activeDevice.groupID) {
            activeGroup = item;
          }
        });
        yield put({
          type: 'gizwitsSdk/sendCmdToGroup',
          payload: {
            data,
            group: activeGroup,
          },
        });
      } else {
        write({ device, data });
        /**
         * 发送完指令后，设置一个十秒的延时，如果此时设备还是没有上报数据的话，提示用户可能离线
         * true 表示已经发出指令，等待回复
         * 还需要判断本次发送的指令是否是当前激活的设备
         */
        checkInOnline(`deviceOnlineCheck${device.did}`);
      }
      yield put({
        type: 'deviceData/updateDeviceData',
        payload: {
          data,
          device,
        },
      });
    },
    * sendCmd({ payload }, { put, select }) {
      try {
        let { data } = payload;
        const device = yield select(state => state.deviceList.activeDevice);
        const deviceData = yield select(state => state.deviceData);

        const deviceDataPoint = deviceData[device.did].data || {};

        let newData = {};
        if (deviceDataPoint.Unit_Flag === false) {
        // 判断是不是摄氏度模式，如果是的话，需要转换成F再发过去
          newData = conversionDataPointCToF(data);
        } else {
          newData = data;
        }

      // 发送的指令带有Settemp_Para的时候需要转换 * 10
        // if (newData.Settemp_Para) {
        //   newData.Settemp_Para *= 10;
        // }

        write({ device, data: newData });

      /**
       * 如果发了单位过去
       * 要重新更新一下本地状态
       */
        const coverData = { ...deviceDataPoint, ...data };
        if (data.Unit_Flag === false && deviceDataPoint.Unit_Flag !== data.Unit_Flag) {
        // 改成摄氏度
          data = conversionDataPoint(coverData);
        }
        if (data.Unit_Flag === true && deviceDataPoint.Unit_Flag !== data.Unit_Flag) {
        // 改成华氏度
          data = conversionDataPointCToF(coverData);
        }

      /**
       * 发送完指令后，设置一个十秒的延时，如果此时设备还是没有上报数据的话，提示用户可能离线
       * true 表示已经发出指令，等待回复
       * 还需要判断本次发送的指令是否是当前激活的设备
       */
        console.log('updateDeviceData', JSON.stringify(data));
        checkInOnline(`deviceOnlineCheck${device.did}`);
        yield put({
          type: 'deviceData/updateDeviceData',
          payload: {
            data,
            device,
            onlyUpdate: true,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    * sendCmdToGroup({ payload }, { put, call }) {
      const { data, group } = payload;
      const resultData = yield call(groupWrite, { gid: group.id, data });
      yield put({
        type: 'deviceData/updateDeviceData',
        payload: {
          data,
          device: group.devices,
        },
      });
    },
  },

  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
    // 发送指令给设备
    // sendCmd(state, action) {
    //   const { data, device } = action.payload;
    //   write({ device, data });
    //   return state;
    // },
  },

};
