import Promise from 'promise';
import CordovaRequest from '../utils/gizwitsCordova';
import { getProductSecret } from '../utils/configExpand';
import request from '../utils/request';
import { getOpenApiUrl } from '../utils/getServeInfo';
import config from '../config/template';

const gizwitsConfig = config.gizwits;
const appConfig = config.app;

export async function init({ appID, appSecret, specialProductKeys, specialProductKeySecrets }) {
  const serveFlag = appConfig.cloudServiceInfo;
  let cloudServiceInfo = null;

  switch (serveFlag) {
    case 'us': {
      cloudServiceInfo = {
        openAPIInfo: 'usapi.gizwits.com',
        siteInfo: 'ussite.gizwits.com',
        pushInfo: 'us.push.gizwitsapi.com',
      };
      break;
    }
    case 'eu': {
      cloudServiceInfo = {
        openAPIInfo: 'euapi.gizwits.com',
        siteInfo: 'eusite.gizwits.com',
        pushInfo: 'eu.push.gizwitsapi.com',
      };
      break;
    }
    case 'cn': {
      cloudServiceInfo = {
        openAPIInfo: 'api.gizwits.com',
        siteInfo: 'site.gizwits.com',
        pushInfo: 'push.gizwitsapi.com',
      };
      break;
    }
    default: {
      cloudServiceInfo = null;
      break;
    }
  }
  const obj = {
    appID,
    appSecret,
    specialProductKeys,
    specialProductKeySecrets,
    autoSetDeviceDomain: cloudServiceInfo === null, // 如果cloudServiceInfo是null则自动域名，否则false
  };

  if (cloudServiceInfo) {
    obj.cloudServiceInfo = cloudServiceInfo;
  }
  return CordovaRequest('GizWifiCordovaSDK', 'startWithAppID', obj);
}

export async function login({ userName, password }) {
  return CordovaRequest('GizWifiCordovaSDK', 'userLogin', { userName, password });
}

/**
 * 返回一个Promise对象，内部设一个定时器，一定实践后，返回指定的对象:data
 * @param timeout 定时器的延迟触发时间，默认800毫秒后
 * @param data 设置返回的数据对象
 * @returns {*|Promise}
 */
function mock(timeout = 800, data) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, timeout);
  });
  return promise;
}

export async function getDeviceList({ uid, token, specialProductKeys }) {
  console.log(uid, token, specialProductKeys);
  return CordovaRequest('GizWifiCordovaSDK', 'getBoundDevices', { uid, token, specialProductKeys });
  // return mock(2000, {
  //   success: true,
  //   data: [{ mac: '1', deviceType: 'socket', title: 'Mini Smart Socket', isOnline: true }],
  // });
}

export async function getDeviceStatus({ device, attrs }) {
  return CordovaRequest('GizWifiCordovaSDK', 'getDeviceStatus', { device, attrs });
}

export async function registerEmailUser({ userName, password, accountType }) {
  return CordovaRequest('GizWifiCordovaSDK', 'registerUser', { userName, password, accountType });
}

export async function sendCode({ phone, appSecret }) {
  return CordovaRequest('GizWifiCordovaSDK', 'requestSendVerifyCode', { phone, appSecret });
}

// 发送数据点给设备
export async function write({ device, data }) {
  return CordovaRequest('GizWifiDeviceModule', 'write', { device, data, sn: 0 });
}

// 更新设备信息
export async function setCustomInfo({ device, remark, alias }) {
  return CordovaRequest('GizWifiDeviceModule', 'setCustomInfo', { device, remark, alias });
}

export async function registerPhoneUser({ userName, password, verifyCode, accountType }) {
  return CordovaRequest('GizWifiCordovaSDK', 'registerUser', { userName, password, verifyCode, accountType });
}

export async function setDeviceOnboarding({ ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix }) {
  // 配网要再增加一个自动绑定的操作
  return CordovaRequest('GizWifiCordovaSDK', 'setDeviceOnboarding', { ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix });
}

export async function setDeviceOnboardingDeploy({ ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix }) {
  // 配网要再增加一个自动绑定的操作
  return CordovaRequest('GizWifiCordovaSDK', 'setDeviceOnboardingDeploy', { ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix, bind: true });
}

export async function getUserInfo({ token }) {
  console.log('services/gizwitsSdk/getUserInfo', token);
  return CordovaRequest('GizWifiCordovaSDK', 'getUserInfo', { token });
}

export async function changeUserPassword({ token, oldPassword, newPassword }) {
  console.log('services/gizwitsSdk/changeUserPassword', token, oldPassword, newPassword);
  return CordovaRequest('GizWifiCordovaSDK', 'changeUserPassword', { token, oldPassword, newPassword });
}

export async function changeUserInfo({ token, additionalInfo }) {
  console.log('services/gizwitsSdk/changeUserInfo', token, additionalInfo);
  return CordovaRequest('GizWifiCordovaSDK', 'changeUserInfo', { token, additionalInfo });
}

// 解绑设备
export async function unbindDevice({ token, uid, did }) {
  return CordovaRequest('GizWifiCordovaSDK', 'unbindDevice', { token, uid, did });
}

export async function setSubscribe({ device, productSecret, subscribed }) {
  const obj = {
    device,
    productSecret,
    subscribed,
  };
  return CordovaRequest('GizWifiDeviceModule', 'setSubscribe', obj);
}

export async function apiLogin(data) {
  console.log(data);
  // const testData = {
  //   authData: {
  //     src: 'sina',
  //     token: '2.00QoVRqC0whwFV394dc6bc060T6ad_',
  //     uid: '2604808992',
  //   },
  // };
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/users`;
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
  };

  let appID = gizwitsConfig.androidAppID;
  try {
    if (device.platform === 'Android') {
    // if (false) {
      appID = gizwitsConfig.androidAppID;
    } else {
      appID = gizwitsConfig.iosAppID;
    }
  } catch (error) {
  }
  options.headers = {
    'X-Gizwits-Application-Id': appID,
  };

  return request(url, options);
}

export async function bindRemoteDevice({ uid, token, mac, productKey, productSecret }) {
  const obj = {
    uid,
    token,
    mac,
    productKey,
    productSecret,
  };
  return CordovaRequest('GizWifiCordovaSDK', 'bindRemoteDevice', obj);
}

export async function getCurrentCloudService() {
  return CordovaRequest('GizWifiCordovaSDK', 'getCurrentCloudService');
}

export async function userFeedback(obj) {
  return CordovaRequest('GizWifiCordovaSDK', 'userFeedback', obj);
}

export async function repeatBindRemoteDevice({ uid, token, mac, productKey, productSecret }) {
  const obj = {
    uid,
    token,
    mac,
    productKey,
    productSecret,
  };
  let results = await bindRemoteDevice(obj);
  let counter = 0;
  console.log('bindResults', results);
  while (!results.success && counter < 5) {
    // 重新访问
    console.log('results', results);
    results = await bindRemoteDevice(obj);
    counter += 1;
  }
  return results;
}

/**
 * 配网的同时绑定设备
 */
export async function setDeviceOnboardingAndSubscribe({ ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix }) {
  // 配网要再增加一个自动绑定的操作
  const promise = new Promise((resolve, reject) => {
    setDeviceOnboarding({ ssid, key, mode, timeout, gagentTypes, softAPSSIDPrefix }).then((data) => {
      // 判断配网成功还是失败
      if (data.success) {
        // 成功 再调用绑定
        const { device } = data.data;
        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token');
        // 获取secret
        const productSecret = getProductSecret(device.productKey);
        repeatBindRemoteDevice({
          uid,
          token,
          mac: device.mac,
          productKey: device.productKey,
          productSecret,
        });
        console.log('setDeviceOnboardingSuccess', data);
        resolve(data);
        // setSubscribe({ device, productSecret, subscribed: true });
      } else {
        // 配置失败
        console.log('setDeviceOnboardingError', data);
        resolve(data);
      }
    });
  });
  return promise;
}
