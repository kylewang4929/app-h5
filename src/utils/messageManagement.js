import router from './router';
import config from '../config/product';
import { filterAntifreeze } from './groupTimingFilter';
import { getItemForPk } from './configExpand';

const RGBStringToArr = (string) => {
  if (string.indexOf('rgba') !== -1) {
    string = string.substring(5, string.length - 1);
    string = string.split(',');
    string.splice(string.length - 1, 1);
    string.map((item, index) => {
      string[index] = parseInt(item, 10);
    });
    return string;
  }
  if (string.indexOf('rgb') !== -1) {
    string = string.substring(4, string.length - 1);
    string = string.split(',');
    string.map((item, index) => {
      string[index] = parseInt(item, 10);
    });
    return string;
  }
};

const rgbaIsTransparent = (rgba) => {
  return ((rgba.r === 0) && (rgba.g === 0) && (rgba.b === 0) && (rgba.a === 0));
};

const RGBToHEX = (string) => {
  const arr = RGBStringToArr(string);
  const rgb = {
    r: arr[0],
    g: arr[1],
    b: arr[2],
  };
  if (rgbaIsTransparent(rgb)) {
    return 'transparent';
  }
  return '#' + ((1 << 24) | (parseInt(rgb.r) << 16) | (parseInt(rgb.g) << 8) | parseInt(rgb.b)).toString(16).substr(1);
};
const coverColorForAndroid = (color) => {
  if (color.indexOf('#') !== -1) {
    // hex 颜色
    return color;
  }
  if (color.indexOf('rgb') !== -1) {
    // rgb 颜色
    return RGBToHEX(color);
  }
};

class messageManagement {
  digestion = (dispatch, e) => {
    // 分发命令
    console.log('children to father', e);
    if (this[e.data.key]) {
      this[e.data.key](dispatch, e.data);
    }
  }

  back = (dispatch, data) => {
    const { callbackKey } = data;
    router.goBack(-1);
    this.post('callback', {}, callbackKey);
  }

  /**
   * 控制nav是否显示
   * @param {*} true or false
   */
  toggleStatusBar = (dispatch, data) => {
    const { message, callbackKey } = data;
    if (message === true || message === 'true') {
      StatusBar.show();
    } else {
      StatusBar.hide();
    }
    this.post('callback', {}, callbackKey);
  }

  // 获取安卓bar的高度
  getAndroidStatusBar = (dispatch, data) => {
    const { callbackKey } = data;
    window.StatusBar.statusBarHeight((height) => {
      this.post('callback', height, callbackKey);
    }, () => {});
  }

  // 响应设置状态栏
  setStatusBarStyle = (dispatch, data) => {
    const { message, callbackKey } = data;
    dispatch({
      type: 'navState/update',
      payload: {
        ...message,
      },
    });
    this.post('callback', {}, callbackKey);
  }
  destoryBackAction = (dispatch, data) => {
    window.templateBackButton = null;
    if (data && data.callbackKey) {
      const { callbackKey } = data;
      this.post('callback', {}, callbackKey);
    }
  }

  // 响应跳转到更多
  goToDeviceMore = (dispatch, data) => {
    const { callbackKey } = data;
    dispatch({
      type: 'deviceList/goToDeviceMore',
    });
    this.post('callback', {}, callbackKey);
  }

  /**
   * @param timing 定时页面
   */
  linkFeature = (dispatch, data) => {
    const { callbackKey } = data;
    dispatch({
      type: 'deviceList/goToTiming',
    });
    this.post('callback', {}, callbackKey);
  }

  sendCmd = (dispatch, data) => {
    const { message, callbackKey } = data;
    dispatch({
      type: 'gizwitsSdk/templateSendCmd',
      payload: {
        data: message.data,
        device: message.device,
      },
    });
    this.post('callback', {}, callbackKey);
  }

  getPlatform = (dispatch, data) => {
    const { callbackKey } = data;
    try {
      this.post('callback', device.platform, callbackKey);
    } catch (error) {
      
    }
  }

  // 这个方法基本只有温控器才能用到的
  toggleTiming = (dispatch, data) => {
    const { callbackKey, message } = data;
    dispatch({
      type: 'scheduler/toggleAllScheduler',
      payload: {
        device: message.device,
        data: message.data,
        success: (schedulerData) => {
          // message.data 代表开还是关
          if (message.data) {
            // 获取指定的数据点
            const productConfig = getItemForPk(message.device.productKey);
            const attr = productConfig.groupScheduler.featureList[0].attr;
            const antifreezeData = filterAntifreeze(schedulerData, attr);
            console.log('antifreezeData', antifreezeData);
            // 过滤出需要下发的温度
            dispatch({
              type: 'groupScheduler/setAntifreeze',
              payload: {
                temp: antifreezeData,
                device: message.device,
              },
            });
          }
        },
      },
    });
    try {
      this.post('callback', null, callbackKey);
    } catch (error) {
      
    }
  }

  // 获取配置文件
  getConfig = (dispatch, data) => {
    const { callbackKey, message } = data;
    config.map((item) => {
      if (item.productKey === message) {
        this.post('callback', item.templateConfig, callbackKey);
      }
    });
  }

  // 获取聚合数据
  aggregateData = (dispatch, data) => {
    const { callbackKey, message } = data;
    const { start_ts, end_ts, attrs, aggregator, unit, device } = message;
    dispatch({
      type: 'aggregateData/query',
      payload: {
        did: device.did,
        startime: start_ts,
        endtime: end_ts,
        attr: attrs,
        aggregator: aggregator,
        unit,
        callbackKey,
      },
    });
  }

  Language = (dispatch) => {
    dispatch({
      type: 'language/sendLanguage',
    });
  }

  // 响应template的getDevice方法
  Device = (dispatch) => {
    // 调用sendDevice方法，发送内容给template
    /**
     * 此时认为模版初始化完成
     */
    dispatch({
      type: 'templateState/initSuccess',
    });
    dispatch({
      type: 'deviceList/sendDevice',
    });
  }

  getGeolocation = (dispatch, data) => {
    /**
      * 获取当前位置
      */
    navigator.geolocation.getCurrentPosition((position) => {
      const { callbackKey } = data;
      const returnData = {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      };
      try {
        this.post('callback', returnData, callbackKey);
      } catch (error) {

      }
    }, (err) => {
      console.log(err);
    });
  }

  // 响应template的getDeviceData方法
  DeviceData = (dispatch) => {
    dispatch({
      type: 'deviceData/sendDeviceData',
    });
  }

  // 注册模版的返回键，暂时中断app的返回键，由模版代理 直至被销毁
  BackAction = (dispatch) => {
    window.templateBackButton = {
      handle: () => {
        this.post('pushEvent', {}, 'BackAction');
      },
    };
  }

  /**
   * 发送消息到iframe
   */
  post = (key, message, callbackKey) => {
    const data = {
      key,
      message,
      callbackKey,
    };

    console.log('father send to children', data);

    // frames无法map。。。只能穷举了
    if (window.frames[0]) {
      window.frames[0].postMessage(data, '*');
    }
    if (window.frames[1]) {
      window.frames[1].postMessage(data, '*');
    }
    if (window.frames[2]) {
      window.frames[2].postMessage(data, '*');
    }
    if (window.frames[3]) {
      window.frames[3].postMessage(data, '*');
    }
    if (window.frames[4]) {
      window.frames[4].postMessage(data, '*');
    }
    if (window.frames[5]) {
      window.frames[5].postMessage(data, '*');
    }
    if (window.frames[6]) {
      window.frames[6].postMessage(data, '*');
    }
  }
}

export default new messageManagement();
