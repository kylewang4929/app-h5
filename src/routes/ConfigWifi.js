import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import ReactLoading from 'react-loading';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import { getLanguageString } from '../utils/getLanguage';
import router from '../utils/router';
import InfoAlert from '../components/InfoAlert';

const logoImage = require('../assets/login_logo.png');

const styles = {
  container: {},
  header: {
    height: '4rem',
    width: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 2.2rem',
    boxSizing: 'border-box',
  },
  headerImage: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
  iconText: {
    color: '#000',
  },
  successIcon: {
    width: '2rem',
    height: '2rem',
    backgroundColor: '#80c7e8',
    borderRadius: '50%',
    textAlign: 'center',
    color: '#fff',
    lineHeight: '2rem',
    fontSize: '1rem',
    margin: '2rem auto 0.2rem auto',
  },
  loadingBox: {
    textAlign: 'center',
    color: '#909090',
    fontSize: '0.28rem',
    padding: '2rem 0',
  },
  box: {
    padding: '0.3rem',
    textAlign: 'center',
    color: '#909090',
    fontSize: '0.28rem',
  },
  button: {
    margin: '0.4rem 0.4rem',
    fontSize: '0.28rem',
  },
  errorIcon: {
    backgroundColor: '#f7c902',
    color: '#fff',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '50%',
    lineHeight: '1.4rem',
    fontSize: '0.6rem',
    margin: '0.8rem auto 0.2rem auto',
  },
  tips: {
    fontSize: '0.28rem',
    padding: '0.4rem 0.6rem',
    textAlign: 'center',
    color: '#808080',
  },
  list: {
    textAlign: 'left',
    marginTop: '0.4rem',
    marginBottom: '0.8rem',
  },
  item: {
    margin: '0.2rem 0',
    fontSize: '0.26rem',
  },
  itemPoint: {
    width: '0.16rem',
    height: '0.16rem',
    display: 'inline-block',
    margin: '0 0.1rem',
    borderRadius: '50%',
    backgroundColor: '#80c7e8',
  },
  errorTitle: {
    fontSize: '0.28rem',
    color: '#000',
  },
  errorContent: {
    width: '80%',
    margin: '1rem auto 0 auto',
  },
};

class ConfigWifi extends Component {
  state = {
    status: 'start',
  };
  config = () => {
    const { dispatch, configWifi, language } = this.props;
    const { SSID, password } = configWifi;

    this.setState({
      status: 'loading',
    });
    // 开始配网，设置成loading状态
    dispatch({
      type: 'configWifi/setDeviceOnboarding',
      payload: {
        ssid: SSID,
        key: password,
        mode: 1, // 1是airLink
        timeout: 60,
        gagentTypes: [4],
        success: (data) => {
          this.setState({
            status: 'success',
          });
          // 一秒后跳回设备列表
          router.goBack(-2);
          const CON_IS_SUCCESSFUL_CHOOSE_DEVICE = getLanguageString(language.key, 'CON_IS_SUCCESSFUL_CHOOSE_DEVICE');
          InfoAlert.show(CON_IS_SUCCESSFUL_CHOOSE_DEVICE, 'success', 3000);
        },
        error: (err) => {
          this.setState({
            status: 'error',
          });
        },
      },
    });
  }
  reTry = () => {
    // 重新配网
    this.config();
  }
  render() {
    const { status } = this.state;
    return (
      <div>
        <NavBar
          title="CONFIG_DEVICE"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          {
            status === 'start' ? (
              <div style={styles.box}>
                <div style={styles.header}>
                  <img src={logoImage} style={styles.headerImage} />
                </div>
                <div style={styles.tips}>
                  <FormattedMessage id="PRESS_THE_DEVICE_CONFIGURATION_BUTTON" />
                </div>
                <Button
                  style={{ ...styles.button }}
                  onClick={this.config}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="START_CONFIG" />
                </Button>
              </div>
            ) : null
          }

          {
            status === 'loading' ? (
              <div style={styles.box}>
                <div style={styles.loadingBox}>
                  <ReactLoading className="my-react-loading" type="bubbles" color="rgb(2, 196, 177)" delay={0} />
                  <FormattedMessage id="PLEASE_WAIT_FOR_THE_DEVICE_CONFIGURATION" />
                </div>
              </div>
            ) : null
          }

          {
            status === 'success' ? (
              <div style={styles.box}>
                <div style={styles.successIcon}>
                  <span className="mdi mdi-check" />
                </div>
                <div style={styles.iconText}><FormattedMessage id="CON_IS_SUCCESSFUL" /></div>
              </div>
            ) : null
          }

          {
            status === 'error' ? (
              <div style={styles.box}>
                <div style={styles.errorIcon}>
                  <span className="mdi mdi-close" />
                </div>
                <div style={styles.iconText}><FormattedMessage id="CONFIGURATION_FAILED" /></div>
                <div style={styles.errorContent}>
                  <div style={styles.errorTitle}><FormattedMessage id="CONFIGURATION_FAIL_TIPS" /></div>
                  <div style={styles.list}>
                    <div style={styles.item}>
                      <span style={styles.itemPoint} />
                      <FormattedMessage id="CONFIGURATION_FAIL_TIPS" />
                    </div>
                    <div style={styles.item}>
                      <span style={styles.itemPoint} />
                      <FormattedMessage id="IS_THE_WIFI_NETWORK_WELL_CONNECTED" />
                    </div>
                  </div>
                  <div style={styles.errorTitle}><FormattedMessage id="UNPLUG_THE_POWER_TIPS" /></div>
                </div>
                <Button
                  style={{ ...styles.button }}
                  onClick={this.reTry}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="RETRY" />
                </Button>
              </div>
            ) : null
          }
        </MenuPage>
      </div>
    );
  }
}

ConfigWifi.propTypes = {
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    language: state.language,
    configWifi: state.configWifi,
  };
}


export default connect(mapStateToProps)(ConfigWifi);
