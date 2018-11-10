import React from 'react';
import { connect } from 'dva';
import { Flex, Button, InputItem, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import { getLanguageString } from '../utils/getLanguage';
import { accountType } from '../utils/constant';
import config from '../config/template';
import regular from '../utils/regular';
import PasswordTips from '../components/PasswordTips';

const gizwitsConfig = config.gizwits;
const smsResendTimeGap = config.gizwits.smsResendTimeGap;

const styles = {
  title: {
    fontSize: '0.28rem',
    color: '#909090',
  },
  passwordIcon: {
    position: 'absolute',
    right: '0.1rem',
    zIndex: 999,
    color: '#909090',
    top: '50%',
    marginTop: '-0.42rem',
    padding: '0.24rem',
  },
  tipsWrapper: {
    textAlign: 'center',
    fontSize: '0.28rem',
    margin: '0.32rem 0 0.32rem 0',
  },
  tips: {
    fontSize: '0.26rem',
    color: '#e23900',
  },
  input: {
  },
  btn: {
    height: '.88rem',
    lineHeight: '.88rem',
  },
};

const timerInitSecond = smsResendTimeGap;

class SetPassPhone extends React.Component {

  state = {
    timerRunning: false,
    timer: null,
    timerRemainSecond: timerInitSecond,
    showPassword: false,
  };

  componentDidMount() {
    this.sendCode();
    this.runTimer();
  }

  runTimer() {
    const that = this;
    const timer = setTimeout(() => {
      const timerRemainSecond = this.state.timerRemainSecond;
      // 计时结束
      if (timerRemainSecond === 1) {
        clearTimeout(that.state.timer);
        that.setState({
          timer: null,
          timerRunning: false,
          timerRemainSecond: timerInitSecond,
        });
      } else {
        that.setState({ timerRemainSecond: timerRemainSecond - 1 });
        that.runTimer();
      }
    }, 1000);

    this.setState({
      timer,
      timerRunning: true,
    });
  }

  sendCode() {
    /**
     * 发送短信到给定的手机号码中
     * 手机号需要遵循+{国家码}{手机号}
     */
    const { dispatch, loginState } = this.props;
    const { phoneNum, phoneCode } = loginState;
    let appSecret = gizwitsConfig.androidAppSecret;

    try {
      if (device.platform === 'Android') {
        appSecret = gizwitsConfig.androidAppSecret;
      } else {
        appSecret = gizwitsConfig.iosAppSecret;
      }
    } catch (error) {

    }

    dispatch({
      type: 'loginState/sendCode',
      payload: {
        phone: `${phoneCode}${phoneNum}`,
        appSecret,
      },
    });
  }

  submit() {
    const { form, dispatch, loginState, onSubmitDispatch } = this.props;
    const { getFieldValue } = form;
    const { phoneNum, phoneCode } = loginState;

    const password = getFieldValue('password');
    const code = getFieldValue('code');

    const that = this;
    that.setState({
      hasError: false,
      errMsg: null,
    });

    if (onSubmitDispatch) {
      onSubmitDispatch(
        phoneNum,
        password,
        code,
      );
    } else {
      dispatch({
        type: 'loginState/registerPhone',
        payload: {
          userName: `${phoneCode}${phoneNum}`,
          password,
          verifyCode: code,
          accountType: accountType.GizUserPhone,
        },
      });
    }
  }

  switchPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  render() {
    const { loginState, form, language } = this.props;
    const { getFieldProps, getFieldValue, getFieldError } = form;

    const value = getFieldValue('password');
    const codeValue = getFieldValue('code');
    const passError = getFieldError('password');
    const codeError = getFieldError('code');

    const PASSWORD = getLanguageString(language.key, 'PASSWORD');
    const VERIFICATION_CODE = getLanguageString(language.key, 'VERIFICATION_CODE');
    const SECONDS = getLanguageString(language.key, 'SECONDS');

    const { showPassword } = this.state;

    return (
      <div className="flex-container">
        <div style={styles.tipsWrapper}>
          <div style={styles.title}>
            <FormattedMessage id="THE_CODE_HAS_BEEN_SEND_TO_YOUR_PHONE" />
          </div>
          <div style={styles.tips}>{loginState.phoneNum}</div>
        </div>
        <Flex>
          <Flex.Item style={{ flex: 5, ...styles.input }}>
            <List className="no-border-list list-radius">
              <InputItem
                style={styles.input}
                type="text"
                placeholder={VERIFICATION_CODE}
                {...getFieldProps('code', {
                  rules: [
                    { required: true },
                  ],
                })}
              />
            </List>
          </Flex.Item>
          <Flex.Item style={{ flex: 2 }}>
            <Button
              disabled={this.state.timerRunning}
              className="btn"
              type="primary"
              style={styles.btn}
              onClick={this.componentDidMount.bind(this)}
            >
              {
                this.state.timerRunning ? `${this.state.timerRemainSecond}${SECONDS}` : <FormattedMessage id="REACQUIRE" />
              }
            </Button>
          </Flex.Item>
        </Flex>
        <WhiteSpace size="md" />
        <List className="no-border-list list-radius">
          <span
            onClick={this.switchPassword}
            className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'}`}
            style={styles.passwordIcon}
          />
          <InputItem
            style={styles.input}
            type={showPassword ? 'text' : 'password'}
            placeholder={PASSWORD}
            {...getFieldProps('password', {
              // todo 加强密码的验证
              rules: [
                { required: true },
                { pattern: regular.password },
              ],
            })}
          />
        </List>
        {/* 提示 */}
        <PasswordTips />
        <WhiteSpace size="xl" />
        <Button
          disabled={!(value && codeValue && !passError && !codeError)}
          className="btn"
          type="primary"
          onClick={this.submit.bind(this)}
        ><FormattedMessage id="CONFIRM" /></Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginState: state.loginState,
    language: state.language,
  };
}

const SetPassPhoneForm = createForm()(SetPassPhone);
export default connect(mapStateToProps)(SetPassPhoneForm);
