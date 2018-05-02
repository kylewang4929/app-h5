/**
 * 配置wifi的模块
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import { FormattedMessage } from 'react-intl';
import Toast from '../utils/Toast';
import ConfigWifi from '../components/ConfigWifi';
import router from '../utils/router';
import { getItemForPk } from '../utils/configExpand';
import { getLanguageString } from '../utils/getLanguage';
import Tips from '../components/TopTips';
import InfoAlert from '../components/InfoAlert';
import { userFeedback } from '../services/gizwitsSdk';

/**
 * 这里有个比较复杂的操作
 * 配网成功后，需要等设备列表的回调，把这个设备的did上报后，再执行绑定
 * 也就是说需要等设备列表上报did后，才算是配网成功
 */

const timeout = 90;

class ConfigWifiContainer extends Component {
  state = {
    password: '',
    progress: 0,
    loaderState: 'config',
    showTips: false,
    errorMessage: [
    ],
    tipsText: '',
    tipsConfirm: () => { },
    tipsCancel: () => { },
    deviceData: null, // 存放配网完成后的设备对象
    deviceDefaultName: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'configWifi/getSSID',
      payload: {
        resumeUpdate: false,
      },
    });
    this.getPassword(this.props.configWifi.SSID);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.configWifi !== this.props.configWifi) {
      // 从本地存储获取密码，有匹配的话就更新密码
      this.getPassword(nextProps.configWifi.SSID);
      // 如果wifi ssid发生了变化，同时又满足条件的话自动跳转到下一步
      const { productConfig } = this.props;
      const { resumeUpdate } = nextProps.configWifi;
      if (nextProps.configWifi.SSID
        .indexOf(productConfig.softAPSSIDPrefix) !== -1 && this.state.loaderState === 'softApTips' && resumeUpdate) {
        // ssid 正确，跳转到下一步
        setTimeout(() => {
          this.setConfigConfirm();
        }, 100);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  sendConfigWifiToUmeng = (configureMode, isSuccess) => {
    try {
      switch (configureMode) {
        case 0 : {
          if (isSuccess) {
            MobclickAgent.onEvent('softApSuccess');
          } else {
            MobclickAgent.onEvent('softApError');
          }
          break;
        }
        case 1 : {
          if (isSuccess) {
            MobclickAgent.onEvent('airLinkSuccess');
          } else {
            MobclickAgent.onEvent('airLinkError');
          }
          break;
        }
        default : {
        }
      }
    } catch (error) {
      console.log('sendConfigWifiToUmeng', error);
    }
  }

  // 上传日志
  upLoadLog = () => {
    const { language, userState } = this.props;
    const { phone } = userState;
    const uid = localStorage.getItem('uid');
    userFeedback({
      contactInfo: '',
      feedbackInfo: `uid: ${uid},phone: ${phone}`,
      sendLog: true,
    });
    const THANK_YOU_FEEDBACK = getLanguageString(language.key, 'THANK_YOU_FEEDBACK');
    InfoAlert.show(THANK_YOU_FEEDBACK, 'success', 3000);
  }

  /**
   *  取消
   */
  onCancel = () => {
    const { loaderState } = this.state;
    if (loaderState === 'loading') {
      // this.setState({
      //   showTips: true,
      //   tipsText: <FormattedMessage id="STOP_ADD_DEVICE_TIPS" />,
      //   tipsConfirm: () => {
      //     // 重置所有操作
      //     this.setState({
      //       showTips: false,
      //     });
      //     this.reset();
      //     this.props.onCancel();
      //   },
      //   tipsCancel: () => {
      //     this.setState({
      //       showTips: false,
      //     });
      //   },
      // });
    } else {
      this.reset();
      this.props.onCancel();
    }
  }

  onChange = (value) => {
    this.setState({
      password: value,
    });
  }

  getPassword = (ssid) => {
    let wifiData = localStorage.getItem('wifiData');
    wifiData = wifiData == null ? '[]' : wifiData;
    wifiData = JSON.parse(wifiData);

    let isSet = false;
    wifiData.map((item) => {
      if (item.ssid === ssid) {
        this.setState({
          password: item.key,
        });
        isSet = true;
      }
    });
    if (isSet === false) {
      this.setState({
        password: '',
      });
    }
  }

  setPasswordConfirm = () => {
    const { configureMode, configWifi } = this.props;
    const { SSID } = configWifi;
    const { password } = this.state;

    // 缓存账号密码
    this.SSID = SSID;
    this.password = password;
    if (configureMode === 0) {
      this.linkAp();
    }
    if (configureMode === 1) {
      this.setConfigConfirm();
    }
  }

  setConfigConfirm = () => {
    // 发送配网指令 获取产品的配置信息
    const { dispatch, configWifi, configureMode, productConfig, language } = this.props;
    const SSID = this.SSID;
    const password = this.password;

    if (configureMode === 0 && configWifi.SSID.indexOf(productConfig.softAPSSIDPrefix) === -1) {
      window.cordova.plugins.settings.open(['wifi', true], () => {}, () => {});
      return;
    }

    // 通过检测 进入loading状态 发送指令给sdk
    this.setState({
      loaderState: 'loading',
    });

    dispatch({
      type: 'configWifi/setDeviceOnboarding',
      payload: {
        ssid: SSID,
        key: password,
        mode: configureMode, // 1是airLink
        timeout,
        gagentTypes: productConfig.moduleType,
        softAPSSIDPrefix: productConfig.softAPSSIDPrefix,
        isOldFirmware: productConfig.isOldFirmware,
        success: (data) => {
          console.log('配网成功', data);
          // 设置状态，把device缓存起来，等待did回调，如果有did则直接执行下一步
          const deviceData = data.device;
          const deviceItem = getItemForPk(deviceData.productKey);
          if (deviceItem === null) {
            return;
          }
          // 同时也是绑定成功
          this.sendConfigWifiToUmeng(configureMode, true);
          // 判断当前语言
          let deviceName = deviceItem[`${language.key}_name`] || deviceItem.name;
          this.setState({
            progress: 100,
            deviceData,
            deviceDefaultName: deviceName,
          });
          this.clearInterval();
          setTimeout(() => {
            this.setState({
              loaderState: 'success',
            });
          }, 400);
        },
        error: (err) => {
          this.sendConfigWifiToUmeng(configureMode, false);
          this.setState({
            errorMessage: [
              'MAKE_SURE_THE_NETWORK_IS_OPEN',
              'MAKE_SURE_THE_DEVICE_LIGHTS_ARE_FLASHING',
              'MAKE_SURE_YOU_PHONE_IS_CLOSE_ENOUGH',
            ],
          });
          this.clearInterval();
          this.setState({
            loaderState: 'error',
          });
          const { onConfigFail } = this.props;
          onConfigFail && onConfigFail();
        },
      },
    });

    setTimeout(() => {
      /**
       * 如果是softAp 并且是安卓需要重新连接上一个ssid
       */
      try {
        if (configureMode === 0 && device.platform === 'Android') {
          dispatch({
            type: 'configWifi/connectNetwork',
            payload: {
              SSID,
            },
          });
        }
      } catch (error) {
      }
    }, 4000);

    // 开始倒计时
    this.interval = setInterval(() => {
      if (this.state.progress > 99) {
        // 终止倒计时，当成失败
        this.clearInterval();
        this.setState({
          loaderState: 'error',
          errorMessage: [
            'MAKE_SURE_THE_NETWORK_IS_OPEN',
            'MAKE_SURE_THE_DEVICE_LIGHTS_ARE_FLASHING',
            'MAKE_SURE_YOU_PHONE_IS_CLOSE_ENOUGH',
          ],
        });
        this.cleanFlag();
        const { onConfigFail } = this.props;
        onConfigFail && onConfigFail();
      }
      this.setState({
        progress: this.state.progress + 1,
      });
    }, 900);
  }

  // did 回调上来，配网成功
  // boardingSuccess = (device) => {
  //   // 设备配网成功 下一步是绑定设备
  //   const { dispatch, language } = this.props;
  //   dispatch({
  //     type: 'configWifi/bindDevice',
  //     payload: {
  //       device,
  //       success: () => {
  //         this.clearInterval();
  //         // 根据配置文件查找产品名称
  //         const deviceItem = getItemForPk(device.productKey);
  //         // 判断当前语言
  //         let deviceName = '';
  //         switch (language.key) {
  //           case 'zh':
  //             deviceName = deviceItem.name;
  //             break;
  //           case 'en':
  //             deviceName = deviceItem.en_name;
  //             break;
  //           default : deviceName = deviceItem.en_name;
  //         }
  //         this.setState({
  //           progress: 100,
  //           deviceData: device,
  //           deviceDefaultName: deviceName,
  //         });
  //         setTimeout(() => {
  //           this.setState({
  //             loaderState: 'success',
  //           });
  //         }, 400);
  //       },
  //       error: (err) => {
  //         if (err.error_code === 9091) {
  //           this.setState({
  //             errorMessage: [
  //               'THE_DEVICE_HAS_BEEN_BOUND_BY_OTHER_USERS',
  //               'RESET_DEVICE_AND_TRY_AGAIN',
  //             ],
  //           });
  //         }
  //       },
  //     },
  //   });
  // }

  // 清除计时器
  clearInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  linkAp = () => {
    this.setState({
      loaderState: 'softApTips',
    });
  }

  /**
   * 重置配网
   */
  reset = () => {
    this.clearInterval();
    this.setState({
      progress: 0,
      loaderState: 'config',
      errorMessage: [],
      tipsText: '',
      deviceData: null, // 存放配网完成后的设备对象
      deviceDefaultName: '',
    });
    this.cleanFlag();
  }

  /**
   * 完成配网跳转到控制页面
   */
  complete = (name) => {
    const { dispatch, onCancel, language, configureMode } = this.props;
    const { deviceData } = this.state;
    if (name === '') {
      const THE_NAME_CANNOT_BE_EMPTY = getLanguageString(language.key, 'THE_NAME_CANNOT_BE_EMPTY');
      InfoAlert.show(THE_NAME_CANNOT_BE_EMPTY, 'success', 2000);
      return;
    }

    // loading
    const LOADING = getLanguageString(language.key, 'LOADING');
    Toast.loading(LOADING);
    dispatch({
      type: 'gizwitsSdk/setCustomInfo',
      payload: {
        device: deviceData,
        alias: name,
        success: () => {
          /**
           * 这里如果是airlink，则回退一个页面
           * 如果是ap则回退两个
           */
          switch (configureMode) {
            case 0: {
              router.goBack(-2);
              break;
            }
            case 1: {
              router.goBack(-1);
              break;
            }
            default: {
              router.goBack(-2);
              break;
            }
          }
          // router.go('#menu/mainPage');
          onCancel();
          this.setState({
            deviceData: null,
          });
          Toast.hide();
        },
        error: () => {
          const RENAME_FAILURE = getLanguageString(language.key, 'RENAME_FAILURE');
          InfoAlert.show(RENAME_FAILURE, 'error', 2000);
        },
      },
    });
  }

  cleanFlag = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configWifi/update',
      payload: {
        activeDevice: null,
      },
    });
  }

  setFlag = (deviceData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'configWifi/update',
      payload: {
        activeDevice: deviceData,
      },
    });
  }

  /**
   * 变更wifi
   */
  changeWifi = () => {
    window.cordova.plugins.settings.open(['wifi', true], () => {}, () => {});
  }

  render() {
    const { SSID } = this.props.configWifi;
    const { isShow, productConfig, language, useSoftApOption, goToSoftAp } = this.props;
    const { password, progress, loaderState } = this.state;

    const { showTips, tipsCancel,
      tipsConfirm, tipsText,
      deviceDefaultName, errorMessage,
    } = this.state;
    return (
      <div>
        <QueueAnim delay={0} type="top">
          {
            showTips ? <Tips text={tipsText} onCancel={tipsCancel} onConfirm={tipsConfirm} key={`tips-${2}`} /> : null
          }
        </QueueAnim>
        <ConfigWifi
          useSoftApOption={useSoftApOption}
          changeWifi={this.changeWifi}
          is5g
          goToSoftAp={goToSoftAp}
          language={language}
          enable={isShow}
          progress={progress}
          upLoadLog={this.upLoadLog}
          status={loaderState}
          value={password}
          onSSIDChange={this.onChange}
          reset={this.reset}
          complete={this.complete}
          onCancel={this.onCancel}
          setPasswordConfirm={this.setPasswordConfirm}
          setConfigConfirm={this.setConfigConfirm}
          ssid={SSID}
          errorMessage={errorMessage}
          defaultName={deviceDefaultName}
          softAPSSIDPrefix={productConfig.softAPSSIDPrefix}
        />
      </div>
    );
  }
}

ConfigWifiContainer.propTypes = {
  configWifi: PropTypes.object,
  isShow: PropTypes.bool,
  onCancel: PropTypes.func,
  configureMode: PropTypes.number, // 0 ap 1 air
  dispatch: PropTypes.any,
  productConfig: PropTypes.object,
  language: PropTypes.object,
  onConfigFail: PropTypes.func,
  useSoftApOption: PropTypes.bool,
  goToSoftAp: PropTypes.func,
  userState: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    configWifi: state.configWifi,
    deviceList: state.deviceList,
    language: state.language,
    userState: state.userState,
  };
}


export default connect(mapStateToProps)(ConfigWifiContainer);
