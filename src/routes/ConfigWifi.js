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
    const { dispatch, configWifi } = this.props;
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
        gagentTypes: [0, 8],
        success: (data) => {
          console.log('配网成功', data);
          this.setState({
            status: 'success',
          });
          // 一秒后跳回设备列表
          router.goBack(-2);
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
                  请按下设备配网按键，黄灯闪烁表示设备已经进入配置模式，此时请点击“开始配置”。
                </div>
                <Button
                  style={{ ...styles.button }}
                  onClick={this.config}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="开始配置" />
                </Button>
              </div>
            ) : null
          }

          {
            status === 'loading' ? (
              <div style={styles.box}>
                <div style={styles.loadingBox}>
                  <ReactLoading className="my-react-loading" type="bubbles" color="rgb(2, 196, 177)" delay={0} />
                  设备配置中，请耐心等待...
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
                <div style={styles.iconText}>配置成功</div>
              </div>
            ) : null
          }

          {
            status === 'error' ? (
              <div style={styles.box}>
                <div style={styles.errorIcon}>
                  <span className="mdi mdi-close" />
                </div>
                <div style={styles.iconText}>配置失败</div>
                <div style={styles.errorContent}>
                  <div style={styles.errorTitle}>配置失败了，让我们看看可能哪里出了错：</div>
                  <div style={styles.list}>
                    <div style={styles.item}>
                      <span style={styles.itemPoint} />
                      设备是否正常运行？
                    </div>
                    <div style={styles.item}>
                      <span style={styles.itemPoint} />
                      Wi-Fi网络是否连接顺畅？
                    </div>
                  </div>
                  <div style={styles.errorTitle}>请拔下电源，再重新接通电源，再点击重试</div>
                </div>
                <Button
                  style={{ ...styles.button }}
                  onClick={this.reTry}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="我要重试" />
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
