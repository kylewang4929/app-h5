import React from 'react';
import { connect } from 'dva';
import { Button, InputItem, WhiteSpace, List, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';
import router from '../utils/router';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';
import regular from '../utils/regular';
import CountryPicker from './CountryPicker';

const appConfig = require('../config/template').app;

const textStyle = {
  fontSize: '0.28rem',
  color: '#9b9b9b',
};

const styles = {
  passwordIcon: {
    position: 'absolute',
    right: '0.1rem',
    zIndex: 999,
    color: '#909090',
    top: '50%',
    marginTop: '-0.42rem',
    padding: '0.24rem',
  },
  button: {
    margin: '0 0.4rem',
  },
  itemBox: {
    position: 'relative',
  },
  tipsText: {
    float: 'center',
    color: '#80c7e8',
    textDecoration: 'underline',
  },
};

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      showPassword: false,
    };
  }

  componentWillMount() {
    /**
     * 从本地读取保存的账号
     */
    const account = localStorage.getItem('account');
    const accountType = localStorage.getItem('accountType');
    const { dispatch } = this.props;
    if (accountType === 'email') {
      dispatch({
        type: 'loginState/update',
        payload: {
          email: account,
        },
      });
    }
    if (accountType === 'phone') {
      dispatch({
        type: 'loginState/update',
        payload: {
          phoneNum: account,
        },
      });
    }
  }

  submit = () => {
    const { dispatch, loginState, form, language } = this.props;

    const AN_ACCOUNT_OR_PASSWORD_ERROR = getLanguageString(language.key, 'AN_ACCOUNT_OR_PASSWORD_ERROR');
    const LOGIN_FAILED_PLEASE_TRY_AGAIN = getLanguageString(language.key, 'LOGIN_FAILED_PLEASE_TRY_AGAIN');
    
    form.validateFields((error, value) => {
      if (!error) {
        this.setState({
          animating: true,
        });
        let account = value.phoneOrEmail;
        let accountType = 'email';
        if (/^(\d)+$/.test(account)) {
          accountType = 'phone';
        }

        dispatch({
          type: 'loginState/login',
          payload: {
            password: value.password,
            account,
            success: (data) => {
              // 登录成功
              this.setState({
                animating: false,
              });
              router.go('#/menu/mainPage');
              localStorage.setItem('account', value.phoneOrEmail);
              localStorage.setItem('accountType', accountType);
            },
            error: (error) => {
              // 登录失败
              this.setState({
                animating: false,
              });
              const { errorCode } = error;
              switch (errorCode) {
                case 9020:
                  InfoAlert.show(AN_ACCOUNT_OR_PASSWORD_ERROR, 'error', 3000);
                  break;
                default:
                  InfoAlert.show(LOGIN_FAILED_PLEASE_TRY_AGAIN, 'error', 3000);
              }
            },
          },
        });
      }
    });
  }

  goForgotPassword = () => {
    router.go('#/menu/forgotPassword');
  }

  switchPassword = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword,
    });
  }

  getDefaultAccount = () => {
    const { language, loginState } = this.props;
    const { phoneNum, email } = loginState;
    const PHONE_AND_EMAIL = getLanguageString(language.key, 'PHONE_AND_EMAIL');
    const PHONE_NUMBER = getLanguageString(language.key, 'PHONE_NUMBER');
    const EMAIL = getLanguageString(language.key, 'EMAIL');
    console.log('appConfig', appConfig);
    const { registerType } = appConfig;
    let accountPlaceholder = '';
    let accountDefaultValue = '';
    let regularString = regular.phone;
    // 筛选出输入框的填充文字和默认值
    if (registerType.length > 1) {
      accountPlaceholder = PHONE_AND_EMAIL;
      accountDefaultValue = localStorage.getItem('account');
      regularString = regular.phoneAndEmail;
    } else {
      accountPlaceholder = registerType.includes('PHONE') ? PHONE_NUMBER : EMAIL;
      accountDefaultValue = localStorage.getItem('account');
      regularString = registerType.includes('PHONE') ? regular.phone : regular.email;
    }
    return { accountPlaceholder, accountDefaultValue, regularString };
  }

  render() {
    const { style, language, form, loginState } = this.props;
    const { getFieldProps, getFieldError, getFieldValue } = form;
    const { phoneNum, email } = loginState;
    const { registerType } = appConfig;

    const { animating, showPassword } = this.state;

    const accountError = getFieldError('phoneOrEmail');
    const account = getFieldValue('phoneOrEmail');
    const passwordError = getFieldError('password');
    const password = getFieldValue('password');

    const PASSWORD = getLanguageString(language.key, 'PASSWORD');
    const LOADING = getLanguageString(language.key, 'LOADING');

    const { accountPlaceholder, accountDefaultValue, regularString } = this.getDefaultAccount();

    return (
      <div style={style}>
        <ActivityIndicator
          toast
          text={LOADING}
          animating={animating}
        />
        <WhiteSpace size="md" />
        <CountryPicker />
        <List className="border">
          <InputItem
            placeholder={accountPlaceholder}
            {...getFieldProps(
              'phoneOrEmail', {
                rules: [
                  { required: true },
                  { pattern: regularString },
                ],
                initialValue: accountDefaultValue,
              })}
          />
        </List>
        <List className="no-border-list">
          <div style={styles.itemBox}>
            <span
              onClick={this.switchPassword}
              className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'}`}
              style={styles.passwordIcon}
            />
            <InputItem
              placeholder={PASSWORD}
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps(
                'password',
                {
                  rules: [
                    { required: true },
                    { min: 6 },
                    { max: 32 },
                    // { pattern: regular.password },
                  ],
                },
              ) }
            />
          </div>
          {/* 提示 */}
          {/* <PasswordTips /> */}
        </List>
        <WhiteSpace size="xl" />
        <Button style={styles.button} onClick={this.submit} disabled={!(account && !accountError) || !(password && !passwordError)} className="btn" type="primary">
          <FormattedMessage id="LOGIN" />
        </Button>
        <WhiteSpace size="md" />
        <div style={{ ...textStyle }}>
          <a onClick={this.goForgotPassword} style={styles.tipsText}>
            <FormattedMessage id="FORGET_PASSWORD" />
          </a>
        </div>
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
const LoginFormContainer = createForm()(LoginForm);
export default connect(mapStateToProps)(LoginFormContainer);
