import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Button, InputItem } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import { getLanguageString } from '../utils/getLanguage';
import router from '../utils/router';

const styles = {
  container: {},
  wifiIcon: {
    display: 'block',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: '#80c7e8',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '2rem',
    fontSize: '1.4rem',
    margin: '0.8rem auto',
  },
  wifiBox: {
    fontSize: '0.27rem',
    padding: '0 0.4rem',
    color: '#4c4c4c',
  },
  wifiName: {
    color: '#80c7e8',
    fontSize: '0.26rem',
  },
  inputBox: {
    marginTop: '0.2rem',
  },
  button: {
    margin: '0.4rem 0.4rem',
    fontSize: '0.28rem',
  },
  ssidTips: {
    fontSize: '0.26rem',
    textAlign: 'center',
    padding: '0 0.6rem',
  },
};

class InputWifiPassword extends Component {
  state = {
    password: '',
  };
  componentDidMount() {
    this.getPassword(this.props.configWifi.SSID);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.configWifi !== this.props.configWifi) {
      // 从本地存储获取密码，有匹配的话就更新密码
      this.getPassword(nextProps.configWifi.SSID);
    }
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
  next = () => {
    // 先保存密码
    const { dispatch } = this.props;
    const { password } = this.state;
    dispatch({
      type: 'configWifi/update',
      payload: {
        password,
      },
    });
    router.go('#/menu/configWifi');
  }
  onChange = (value) => {
    this.setState({
      password: value,
    });
  }
  setting = () => {
    window.cordova.plugins.settings.open(['application_details', true], () => { }, () => { });
  }
  render() {
    const { language, configWifi } = this.props;
    const { SSID } = configWifi;
    const { password } = this.state;
    const PASSWORD = getLanguageString(language.key, 'PASSWORD');
    return (
      <div>
        <NavBar
          title="INPUT_PASSWORD"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <span style={styles.wifiIcon} className="mdi mdi-wifi" />

          {
            SSID === '<unknown ssid>' ? (
              <div style={styles.ssidTips}>
                <p>
                  <FormattedMessage id="CONNECT_WIFI_TIPS_1" />
                </p>
                <p>
                  <FormattedMessage id="CONNECT_WIFI_TIPS_2" />
                </p>
                <p>
                  <FormattedMessage id="CONNECT_WIFI_TIPS_3" />
                </p>

                <Button
                  style={{ ...styles.button }}
                  onClick={this.setting}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="SETTING" />
                </Button>
              </div>
            ) : (
              <div style={styles.content}>
                <span style={styles.wifiBox}><FormattedMessage id="CURRENT_WIFI_VALUE" /><span style={styles.wifiName}>{SSID}</span></span>
                <List className="no-border-list my-form" style={styles.inputBox}>
                  <InputItem
                    placeholder={PASSWORD}
                    value={password}
                    onChange={this.onChange}
                  >
                    <i className="mdi mdi-wifi" />
                  </InputItem>
                </List>

                <Button
                  style={{ ...styles.button }}
                  onClick={this.next}
                  className="btn"
                  type="primary"
                >
                  <FormattedMessage id="NEXT" />
                </Button>
              </div>
            )
          }
        </MenuPage>
      </div>
    );
  }
}

InputWifiPassword.propTypes = {
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    language: state.language,
    configWifi: state.configWifi,
  };
}


export default connect(mapStateToProps)(InputWifiPassword);
