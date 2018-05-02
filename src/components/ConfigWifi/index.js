/**
 * 配置wifi的模块
 */
import React, { Component, PropTypes } from 'react';
import { Button } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { FormattedMessage } from 'react-intl';
import _ from 'underscore';
import Loader from '../Loader';
import { getLanguageString } from '../../utils/getLanguage';

require('./styles.less');

const softApImage = require('../../assets/softAp.png');
const progressIcon = require('./progress_icon.png');

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '101%',
    zIndex: 1000,
    left: '0px',
    top: '-0.5%',
  },
  iconImage: {
    width: '2rem',
    margin: '0.6rem 0 0.4rem 0',
  },
  fullImage: {
    width: '5rem',
  },
  apTipsWiFiName: {
    position: 'absolute',
    top: '50%',
    left: '18%',
    marginTop: '0.18rem',
    display: 'block',
    fontSize: '0.28rem',
  },
  cancelText: {
    position: 'absolute',
    padding: '0.2rem',
    left: '0.2rem',
    top: '0.2rem',
    color: '#fff',
    fontSize: '0.32rem',
  },
  button: {
    border: 'none',
    lineHeight: '1rem',
    height: '1rem',
    borderRadius: '0px',
    color: '#00c3ff',
    fontWeight: 'bold',
  },
  buttonBox: {
    borderTop: '1px solid rgba(0,0,0,0.1)',
    borderBottomLeftRadius: '0.2rem',
    borderBottomRightRadius: '0.2rem',
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: '100%',
  },
  box: {
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: '.34rem',
    fontWeight: '500',
    padding: '0 0.9rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  tipsText: {
    textAlign: 'left',
    fontSize: '0.3rem',
    padding: '0 0.6rem',
    fontWeight: 'bold',
  },
  inputBox: {
    backgroundColor: '#e8e8e8',
    width: '80%',
    height: '1rem',
    margin: 'auto',
    boxSizing: 'border-box',
    borderRadius: '0.12rem',
    position: 'relative',
  },
  inputIcon: {
    fontSize: '0.5rem',
    position: 'absolute',
    left: '0.28rem',
    top: '50%',
    marginTop: '-0.3rem',
    color: '#909090',
  },
  towButton: {
    width: '50%',
    display: 'inline-block',
  },
  buttonBorderRight: {
    borderRight: '0.02rem solid rgba(0,0,0,0.08)'
  },
  boxTips: {
    color: '#fff',
    position: 'absolute',
    bottom: '-1.2rem',
    textAlign: 'center',
    width: '100%',
    fontSize: '0.28rem',
  },
  imageBox: {
    padding: '0 0rem 0.6rem 0rem',
    boxSizing: 'border-box',
    position: 'relative',
  },
  link: {
    textDecoration: 'underline',
    fontSize: '0.26rem',
    color: '#00c3ff',
    padding: '0.4rem 0.4rem 0 0.4rem',
  },
  input: {
    backgroundColor: 'transparent',
    color: '#909090',
    fontWeight: '500',
    border: 'none',
    width: '100%',
    height: '100%',
    paddingLeft: '1rem',
    paddingRight: '0.2rem',
    fontSize: '0.36rem',
    boxSizing: 'border-box',
  },
  textList: {
    textAlign: 'left',
    color: '#909090',
    padding: '0.4rem 0.6rem 0.1rem 0.6rem',
    fontSize: '0.28rem',
  },
  textItem: {
    margin: '0.1rem 0',
  },
  leftTips: {
    display: 'block',
    textAlign: 'left',
    paddingRight: '0.7rem',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  rightTips: {
    position: 'absolute',
    right: '0.6rem',
    top: '0.4rem',
    display: 'inline-block',
    height: '100%',
  },
  tips: {
    overflow: 'hidden',
    fontSize: '.3rem',
    padding: '0.4rem 0.64rem',
    fontWeight: '500',
    color: '#909090',
    position: 'relative',
  },
  apTipsIcon: {
    color: '#ff6a6b',
    position: 'relative',
    top: '0.026rem',
    left: '-0.1rem',
  },
  apTipsText: {
    fontSize: '0.27rem',
    color: '#909090',
  },
  apTipsBox: {
    position: 'relative',
    top: '0.2rem',
  },
  cancelButton: {
    position: 'absolute',
    right: '0rem',
    top: '0rem',
    lineHeight: '1rem',
    color: '#909090',
    zIndex: 999,
    borderRadius: '50%',
    display: 'block',
    width: '1rem',
    height: '1rem',
    textAlign: 'center',
  },
};


/**
 * status 可以是config loading success error
 */

class ConfigWifi extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deviceName: props.defaultName,
    };
    this.setPasswordConfirm = _.throttle(this.setPasswordConfirm, 1000);
  }

  componentWillMount() {
    if (!window.popupNav) {
      window.popupNav = {};
    }
    if (this.props.enable) {
      window.popupNav.myAlert = {
        handle: this.onCancel,
      };
    } else {
      window.popupNav.myAlert = null;
    }
  }

  componentDidMount() {
    this.dom.addEventListener('touchstart', (event) => {
      event.stopPropagation();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultName !== this.props.defaultName) {
      this.setState({
        deviceName: nextProps.defaultName,
      });
    }

    if (nextProps.enable !== this.props.enable) {
      if (nextProps.enable) {
        window.popupNav.myAlert = {
          handle: this.onCancel,
        };
      } else {
        window.popupNav.myAlert = null;
      }
    }
  }

  // componentWillUnmount() {
  //   window.popupNav.myAlert = null;
  // }

  onChange = (value) => {
    const { onSSIDChange } = this.props;
    if (onSSIDChange) {
      onSSIDChange(value.nativeEvent.target.value);
    }
  }
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  onNameChange = (event) => {
    const { nativeEvent } = event;
    const { value } = nativeEvent.target;
    this.setState({
      deviceName: value,
    });
  }

  changeWifi = () => {
    const { changeWifi } = this.props;
    changeWifi();
  }

  complete = () => {
    const { complete } = this.props;
    complete(this.state.deviceName);
    // this.lockConfigWifi();
  }

  setPasswordConfirm = () => {
    const { setPasswordConfirm } = this.props;
    setPasswordConfirm();
  }

  render() {
    const { ssid, value, progress, status, enable, is5g,
      reset, setConfigConfirm, errorMessage, upLoadLog,
      goToSoftAp,
      softAPSSIDPrefix, language, useSoftApOption } = this.props;
    const { deviceName } = this.state;

    const WIFI_PASSWORD = getLanguageString(language.key, 'WIFI_PASSWORD');
    const ENTER_DEVICE_NAME = getLanguageString(language.key, 'ENTER_DEVICE_NAME');

    return (
      <div ref={(e) => { this.dom = e; }}>
        <QueueAnim delay={0} type="bottom">
          {
            enable ? (
              <div key={`tips-${1}`} className={`config-wifi-container ${status} ${status === 'error' || status === 'success' ? 'loading' : ''}`} style={styles.container}>
                <div style={styles.inner}>
                  {/* <div style={styles.cancelText} onClick={this.onCancel}>取消</div> */}

                  <div className="config-page state-box" style={styles.box}>
                    <span style={styles.cancelButton} className="mdi mdi-close" onClick={this.onCancel} />
                    <div style={styles.title}>
                      <FormattedMessage id="ENTER_WIFI_PASSWORD" />
                    </div>
                    <div style={styles.inputBox}>
                      <span style={styles.inputIcon} className="mdi mdi-lock" />
                      <input style={styles.input} placeholder={value === '' ? WIFI_PASSWORD : ''} value={value} onChange={this.onChange} />
                    </div>
                    <div style={styles.tips}>
                      <span style={styles.leftTips}>
                        {
                          ssid === '' ?
                            <FormattedMessage id="SELECT_WIFI" /> :
                            <FormattedMessage id="CURRENT_WIFI_VALUE" values={{ ssid }} />
                        }
                      </span>
                      <span onClick={this.changeWifi} style={styles.rightTips}>
                        {ssid === '' ? <FormattedMessage id="SELECT" /> : <FormattedMessage id="CHANGE" />}
                      </span>
                    </div>
                    <div style={styles.buttonBox}>
                      <Button
                        disabled={Boolean(ssid) === false}
                        style={styles.button} onClick={this.setPasswordConfirm}
                      >
                        <FormattedMessage id="CONFIRM" />
                      </Button>
                    </div>
                    {
                      is5g ? <div style={styles.boxTips}>
                        <FormattedMessage id="5G_ALERT" />
                        <br />
                        <FormattedMessage id="5G_TIPS" />
                      </div> : null
                    }
                  </div>

                  <div className="ap-tips-page state-box" style={styles.box}>
                    <span style={styles.cancelButton} className="mdi mdi-close" onClick={this.onCancel} />
                    <div style={styles.title}>
                      <FormattedMessage id="CONNECT_YOUR_PHONE_WIFI_TO_THE_DEVICE_HOTSPOT1" />
                      <FormattedMessage id="CONNECT_YOUR_PHONE_WIFI_TO_THE_DEVICE_HOTSPOT2" />
                    </div>
                    <div style={styles.imageBox}>
                      <img style={styles.fullImage} src={softApImage} />
                      <span style={styles.apTipsWiFiName}>
                        {`${softAPSSIDPrefix}xxx`}
                      </span>
                      <div style={styles.apTipsBox}>
                        <span style={styles.apTipsIcon} className="mdi mdi-alert-circle"></span>
                        <span style={styles.apTipsText}><FormattedMessage id="CURRENT_WIFI" />: {ssid}</span>
                      </div>
                    </div>
                    <div style={styles.buttonBox}>
                      <Button style={styles.button} onClick={setConfigConfirm}>
                        <FormattedMessage id="TO_CONNECT" />
                      </Button>
                    </div>
                  </div>

                  <div className="loading-page state-box" style={styles.box}>
                    {/* <span style={styles.cancelButton} className="mdi mdi-close" onClick={this.onCancel} /> */}
                    <Loader progress={progress} />
                    <div style={styles.tipsText}>
                      <FormattedMessage id="KEEP_PHONE_DEVICE_ROUTERS" />
                    </div>
                    <div style={{ ...styles.textList, paddingBottom: '0.6rem' }}>
                      <div style={styles.textItem}>
                        <FormattedMessage id="FIND_DEVICE" />
                      </div>
                      <div style={styles.textItem}>
                        <FormattedMessage id="REGISTRATION_DEVICE_TO_GIZWITS" />
                      </div>
                      <div style={styles.textItem}>
                        <FormattedMessage id="INITIALIZATION_DEVICE" />
                      </div>
                    </div>
                  </div>

                  <div className="error-page state-box" style={styles.box}>
                    <span style={styles.cancelButton} className="mdi mdi-close" onClick={this.onCancel} />
                    <img src={progressIcon} style={styles.iconImage} />
                    <div style={styles.tipsText}>
                      {
                        useSoftApOption ? <FormattedMessage id="CON_IS_FAIL_USE_SOFT_AP" /> : <FormattedMessage id="CON_IS_FAIL" />
                      }
                    </div>
                    <div style={{ ...styles.textList }}>
                      {
                        useSoftApOption ? null : errorMessage.map((item, index) => {
                          return <div key={index} style={styles.textItem}><FormattedMessage id={item} /></div>;
                        })
                      }
                    </div>
                    {/* 上传日志提示 */}
                    <div onClick={upLoadLog} style={styles.link}><FormattedMessage id={'UPLOAD_LOGS_TO_HELP_US_IMPROVE_OUR_PRODUCTS'} /></div>
                    <div style={{ ...styles.buttonBox, marginTop: '0.4rem' }}>
                      {
                        useSoftApOption ? (
                          <Button type="primary" onClick={goToSoftAp} style={{ ...styles.button, ...styles.towButton }}>
                            <FormattedMessage id="USE_SOFT_AP" />
                          </Button>) : (
                          <Button type="primary" onClick={reset} style={styles.button}>
                            <FormattedMessage id="RETRY" />
                          </Button>
                        )
                      }
                    </div>
                  </div>
                  <div className="success-page state-box" style={styles.box}>
                    <span style={styles.cancelButton} className="mdi mdi-close" onClick={this.onCancel} />
                    <span className="title-icon mdi mdi-checkbox-marked-circle-outline" />
                    <div style={{ ...styles.tipsText, textAlign: 'center' }}>
                      <FormattedMessage id="CON_IS_SUCCESSFUL" />
                    </div>
                    <div style={{ ...styles.textList, textAlign: 'center' }}>
                      <div style={styles.textItem}>
                        <FormattedMessage id="NAME_YOUR_DEVICE" />
                      </div>
                      <div className="input-box">
                        <span className="input-icon mdi mdi-account" />
                        <input placeholder={deviceName === '' ? ENTER_DEVICE_NAME : ''} value={deviceName} onChange={this.onNameChange} />
                      </div>
                    </div>
                    <div style={{ ...styles.buttonBox, marginTop: '0.4rem' }}>
                      <Button onClick={this.complete} style={styles.button}>
                        <FormattedMessage id="CONFIRM" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : <span />
          }
        </QueueAnim>
      </div>
    );
  }
}

ConfigWifi.propTypes = {
  onSSIDChange: PropTypes.func,
  onCancel: PropTypes.func,
  changeWifi: PropTypes.func,
  ssid: PropTypes.string,
  value: PropTypes.string,
  progress: PropTypes.number,
  status: PropTypes.string,
  enable: PropTypes.bool,
  reset: PropTypes.func,
  complete: PropTypes.func,
  setConfigConfirm: PropTypes.func,
  setPasswordConfirm: PropTypes.func,
  is5g: PropTypes.bool,
  softAPSSIDPrefix: PropTypes.string,
  language: PropTypes.object,
  errorMessage: PropTypes.array,
  upLoadLog: PropTypes.func,
  useSoftApOption: PropTypes.bool,
  goToSoftAp: PropTypes.func,
};

export default ConfigWifi;
