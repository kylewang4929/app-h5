
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { IntlProvider } from 'react-intl';
import { Toast } from 'antd-mobile';

import { CSSTransitionGroup } from 'react-transition-group';
import router from '../utils/router';
// import InfoAlert from '../components/InfoAlert';
import messageManagement from '../utils/messageManagement';
import { getLanguageJson, getLanguageString } from '../utils/getLanguage';

import Theme from '../containers/Theme';
import config from '../config/template';
import MyToast from '../utils/Toast';
import defaultDeviceData from '../utils/defaultDeviceData';

const appConfig = config.app;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      platformClass: '',
      language: getLanguageJson(this.props.language.key),
    };
  }

  componentDidMount() {
    // 模拟聚合数据
    // const { dispatch } = this.props;
    // const endTime = new Date();
    // endTime.setHours(23);
    // endTime.setMinutes(59);
    // endTime.setSeconds(59);
    // const endMilliseconds = endTime.getTime();

    // const startTime = new Date();
    // startTime.setDate(startTime.getDate() - 7);
    // startTime.setHours(0);
    // startTime.setMinutes(0);
    // startTime.setSeconds(0);
    // const startMilliseconds = startTime.getTime();

    // dispatch({
    //   type: 'aggregateData/query',
    //   payload: {
    //     did: 'ps5QizQLmn9aVYSGZfQWNd',
    //     startime: startMilliseconds,
    //     endtime: endMilliseconds,
    //     attr: 'power_consumption',
    //     aggregator: 'max',
    //     unit: 'DAYS',
    //   },
    // });

    /**
     * 模拟数据点上报
     * const { alerts, faults, device, data } = payload;
    */
    // this.getDeviceStatusSuccess({
    //   device: { did: 'ZJNNvXFM2zutcVUj5ipPCC' },
    //   data: defaultDeviceData,
    //   alerts: {},
    //   faults: {},
    // });

    window.addEventListener('message', (e) => {
      messageManagement.digestion(this.props.dispatch, e);
    }, false);

    document.addEventListener('deviceready', () => {
      try {
        window.Keyboard.automaticScrollToTopOnHiding = true;
      } catch (error) {

      }
      // if (device.platform === 'Android') {
      //   window.StatusBar.hide();
      // }
      // 设置平台class 到div
      this.setState({
        platformClass: device.platform,
      });
      document.getElementsByTagName('html')[0].setAttribute('class', device.platform);

      /**
       * 启动sdk
       */
      const { dispatch } = this.props;
      dispatch({
        type: 'gizwitsSdk/init',
        payload: {
          success: () => {
            /**
             * 注册设备状态通知
             */
            cordova.plugins
              .GizWifiCordovaSDK
              .registerDeviceStatusNotifications(
              this.getDeviceStatusSuccess,
              this.getDeviceStatusError,
            );

            /**
             * 注册全局监听
             */
            cordova.plugins
              .GizWifiCordovaSDK
              .registerDeviceListNotifications(
              this.getDeviceListSuccess,
              this.getDeviceListError,
            );
            // dispatch({
            //   type: 'gizwitsSdk/getCurrentCloudService',
            // });
          },
          error: () => {},
        },
      });

      /**
       * 取消启动画面
       */
      setTimeout(() => {
        navigator.splashscreen.hide();
      }, 375);
      /**
       * 判断是否存在token
       */
      const token = localStorage.getItem('token');
      if (token == null) {
        router.go('#/launch/guide');
      } else {
        router.go('#/menu/mainPage');
      }

      /**
       * 获取ssid
       */
      dispatch({
        type: 'configWifi/getSSID',
        payload: {
          resumeUpdate: false,
        },
      });

      /**
       * 获取当前版本号
       * appInfo
       */
      dispatch({
        type: 'appInfo/getVersion',
      });

      /**
       * 网络变更监听
       */
      document.addEventListener('offline', () => {
        // 提示断线
        // InfoAlert.show('网络连接断开。', 'error', 2000);
      }, false);
      document.addEventListener('online', () => {
        // 重新获取wifi ssid
        dispatch({
          type: 'configWifi/getSSID',
          payload: {
            resumeUpdate: false,
          },
        });
        if (device.platform === 'Android') {
          dispatch({
            type: 'configWifi/checkIs5G',
          });
        }
      }, false);

      /**
       * 从背景中还原
       */
      document.addEventListener('resume', () => {
        setTimeout(() => {
          // 重新获取wifi ssid
          dispatch({
            type: 'configWifi/getSSID',
            payload: {
              resumeUpdate: true,
            },
          });
        }, 200);
      }, false);

      // 暂停应用
      document.addEventListener('pause', () => {
      }, false);

      /**
       * 物理返回键监听
       */
      document.addEventListener('backbutton', this.onBackButton, false);
      /**
       * 键盘监听
       */
      window.addEventListener('native.keyboardshow', () => {
        document.getElementsByTagName('body')[0].setAttribute('class', 'keyboard-open');
      });
      window.addEventListener('native.keyboardhide', () => {
        document.getElementsByTagName('body')[0].setAttribute('class', '');
      });
      /**
       * 初始化友盟
       */
      dispatch({
        type: 'appInfo/getPackageName',
        payload: {
          success: (data) => {
            MobclickAgent.init(appConfig.umengID, data);
          },
        },
      });
    }, false);
  }
  componentWillReceiveProps(nextProps) {
    /**
     * 跳转到详情页面时需要预先加载
     */
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.location.pathname.indexOf('/devicePage/') !== -1) {
        const { language } = nextProps;
        const LOADING = getLanguageString(language.key, 'LOADING');
        // MyToast.loading(LOADING, 0.575);
      }
    }
    if (nextProps.language.key !== this.props.language.key) {
      console.log(getLanguageJson(nextProps.language.key));
      this.setState({
        language: getLanguageJson(nextProps.language.key),
      });
    }
  }
  onBackButton = () => {
    /**
     * 这里还需检查是否有弹窗
     */
    if (!window.popupNav) {
      window.popupNav = {};
    }
    if (window.popupNav.toast) {
      window.popupNav.toast.handle();
      return;
    }
    if (window.popupNav.alert) {
      window.popupNav.alert.handle();
      return;
    }
    if (window.popupNav.myAlert) {
      window.popupNav.myAlert.handle();
      return;
    }
    if (window.popupNav.popup) {
      window.popupNav.popup.handle();
      return;
    }
    if (window.templateBackButton && window.templateBackButton.handle) {
      window.templateBackButton.handle();
      return;
    }

    const { navState } = this.props;
    if (navState.canBack !== this.props.canBack && navState.canBack) {
      router.goBack(-1);
    } else {
      console.log('this.exitAppTouch', this.exitAppTouch);
      // 点击两次退出app
      if (this.exitAppTouch) {
        navigator.app.exitApp();
      }
      this.exitAppTouch = true;
      // 提示toats
      const { language } = this.props;
      const CLICK_THE_BACK_BUTTON_TO_EXIT = getLanguageString(language.key, 'CLICK_THE_BACK_BUTTON_TO_EXIT');
      Toast.info(CLICK_THE_BACK_BUTTON_TO_EXIT, 2);
      setInterval(() => {
        this.exitAppTouch = false;
      }, 2000);
    }
  }
  getDeviceListSuccess = (data) => {
    console.log('deviceList', data);
    const { dispatch } = this.props;
    /**
     * 容错处理
     */
    console.log('getDeviceListSuccess', data.devices);
    if (data.devices) {
      // data.devices.map((item) => {
      //   if (item.isBind) {
      //     dispatch({
      //       type: 'gizwitsSdk/getDeviceStatus',
      //       payload: { device: item },
      //     });
      //   }
      // });
      dispatch({
        type: 'deviceList/filterDeviceListAndUpdate',
        payload: data.devices,
      });
    }
  }
  getDeviceStatusSuccess = (data) => {
    const { dispatch } = this.props;
    console.log('getDeviceStatusSuccess', data);
    if (data.data) {
      // 含有data的是设备上报数据
      dispatch({
        type: 'deviceData/deviceReportData',
        payload: data,
      });
    } else {
      dispatch({
        type: 'deviceList/updateNetStatus',
        payload: { mac: data.device.mac, netStatus: data.device.netStatus },
      });
    }
  }
  getDeviceStatusError = (err) => {
    console.log('err', err);
  }
  getDeviceListError = (error) => {
    console.log(error);
  }
  getDeviceSuccess = (data) => {
    console.log(data);
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/filterDeviceListAndUpdate',
      payload: data.devices,
    });
  }
  getDeviceError = (error) => {
    console.log(error);
  }
  render() {
    let { children } = this.props;
    const { location } = this.props;
    const routerState = localStorage.getItem('routerState');

    let animateName = 'pageIn';
    const transitionEnterTimeout = 300;
    const transitionLeaveTimeout = 300;
    if (routerState === '1') {
      // 前进 判断是否是 设备详情页面
    } else {
      animateName = 'pageOut';
    }

    if (children === null) {
      children = <span />;
    }

    const { language } = this.state;
    console.log(location);
    return (
      <Theme>
        <IntlProvider locale={'en'} messages={language}>
          <CSSTransitionGroup
            transitionEnterTimeout={transitionEnterTimeout}
            transitionLeaveTimeout={transitionLeaveTimeout}
            transitionName={animateName}
          >
            {
              React.cloneElement(children, {
                key: location.pathname,
              })
            }
          </CSSTransitionGroup>
        </IntlProvider>
      </Theme>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  language: PropTypes.object,
  location: PropTypes.object,
  navState: PropTypes.any,
  dispatch: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    language: state.language,
    navState: state.navState,
    templateState: state.templateState,
  };
}


export default connect(mapStateToProps)(App);
