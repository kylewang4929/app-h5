import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Button } from 'antd-mobile';
import ReactLoading from 'react-loading';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import InfoAlert from '../components/InfoAlert';
import Toast from '../utils/Toast';

import router from '../utils/router';

import { getLanguageString } from '../utils/getLanguage';

const Item = List.Item;

const deviceIcon = require('../assets/search_ic_device.png');

const styles = {
  list: {
    marginTop: '0.3rem',
  },
  loading: {
    margin: 'auto',
  },
  stateBox: {
    fontSize: '0.28rem',
    position: 'absolute',
    width: '100%',
    left: '0px',
    textAlign: 'center',
    top: '34%',
    color: '#565656',
  },
  container: {
  },
  tipsText: {
    fontSize: '0.32rem',
    paddingRight: '0.1rem',
  },
  button: {
    margin: '0.2rem 0',
    fontSize: '0.3rem',
  },
  buttonBox: {
    position: 'absolute',
    bottom: '0.2rem',
    left: '0px',
    width: '100%',
    padding: '0 0.4rem',
    boxSizing: 'border-box',
  },
};

class SearchDevice extends Component {
  state = {
    loading: true,
  };
  componentWillMount() {
    setTimeout(() => {
      // 这里的loaidng是假的，因为数据是实时的，没必要loading
      this.setState({
        loading: false,
      });
    }, 600);
  }
  config = () => {
    // 判断是否是wifi环境
    const { configWifi, language } = this.props;
    const CONNECT_WIFI_TIPS = getLanguageString(language.key, 'CONNECT_WIFI_TIPS');
    const { SSID } = configWifi;
    if (SSID !== '' && SSID !== null) {
      router.go('#/menu/inputWifiPassword');
    } else {
      Toast.info(CONNECT_WIFI_TIPS);
    }
  }

  handleScanSuccess = (result) => {
    const res = JSON.parse(result);
    const { dispatch, language } = this.props;
    const LOADING = getLanguageString(language.key, 'LOADING');
    Toast.loading(LOADING);
    dispatch({
      type: 'shareState/sharingCode',
      payload: {
        code: res.result,
        success: () => {
          router.goBack();
          Toast.hide();
        },
        error: () => {
          Toast.hide();
        },
      },
    });
  }

  handleScanFail = (error) => {
    if (!error || error.resultCode === 2) {
      const { language } = this.props;
      const SCAN_FAILED = getLanguageString(language.key, 'SCAN_FAILED');
      InfoAlert.show(SCAN_FAILED, 'error', 3000);
    }
  }

  handleScan = () => {
    const { language } = this.props;
    const SCAN_QRCODE = getLanguageString(language.key, 'SCAN_QRCODE');
    const CHOOSE_FROM_ALBUMS = getLanguageString(language.key, 'CHOOSE_FROM_ALBUMS');
    const SCAN_THE_DEVICE_QRCODE = getLanguageString(language.key, 'SCAN_THE_DEVICE_QRCODE');
    cordova.plugins.gizscanqrcode.scan({
      baseColor: '02c4b1',
      title: SCAN_QRCODE,
      barColor: '02c4b1',
      describe: SCAN_THE_DEVICE_QRCODE,
      choosePhotoEnable: true,
      choosePhotoBtnTitle: CHOOSE_FROM_ALBUMS,
      choosePhotoBtnColor: '02c4b1',
    }, this.handleScanSuccess, this.handleScanFail);
  }

  getList = (list) => {
    const newData = [];
    list.map((item) => {
      if (!item.isBind) {
        newData.push(item);
      }
    });
    return newData;
  }
  bindDevice = (item) => {
    // 绑定设备
    const { dispatch, language } = this.props;
    dispatch({
      type: 'configWifi/bindDevice',
      payload: {
        device: item,
        success: () => {
          // 跳转到列表，提示绑定成功
          router.goBack(-1);
          const BIND_SUCCESS = getLanguageString(language.key, 'BIND_SUCCESS');
          InfoAlert.show(BIND_SUCCESS, 'success', 3000);
        },
      },
    });
  }
  render() {
    const { deviceList } = this.props;
    const { loading } = this.state;

    const data = this.getList(deviceList.cache);
    return (
      <div>
        <NavBar
          title="SEARCH_DEVICE"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>

          {
            loading ? (
              <div style={styles.stateBox}>
                <ReactLoading className="my-react-loading" type="bubbles" color="#80c7e8" delay={0} />
                <FormattedMessage id="SERCHING_DEVICE" />
              </div>
            ) : null
          }

          {
            !loading && data.length === 0 ? (
              <div style={styles.stateBox}>
                <FormattedMessage id="NET_WORK_NO_DEVICE" />
                <br />
                <FormattedMessage id="SURE_IN_THE_SAME_NETWORK" />
              </div>
            ) : null
          }
          {
            !loading ? (
              <List style={styles.list} className="my-list">
                {
                  data.map((item, index) => {
                    return (
                      <Item
                        key={index}
                        thumb={deviceIcon}
                        arrow="horizontal"
                        onClick={this.bindDevice.bind(null, item)}
                      >{item.dev_alias || <FormattedMessage id="HEATING_RODS" />}</Item>
                    );
                  })
                }
              </List>
            ) : null
          }

          <div style={styles.buttonBox}>
            <Button onClick={this.config} style={{ ...styles.button }} type="primary">
              <FormattedMessage id="CONFIG_NEW_DEVICE" />
            </Button>
          </div>
        </MenuPage>
      </div>
    );
  }
}

SearchDevice.propTypes = {
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    language: state.language,
    configWifi: state.configWifi,
  };
}


export default connect(mapStateToProps)(SearchDevice);
