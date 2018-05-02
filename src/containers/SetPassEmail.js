import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Button, InputItem, List, WhiteSpace } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

import { getLanguageString } from '../utils/getLanguage';
import { accountType } from '../utils/constant';
import regular from '../utils/regular';
import PasswordTips from '../components/PasswordTips';

const input = {
};

const btn = {
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
};

class SetPassEmail extends React.Component {
  state = {
    hasError: false,
    errMsg: null,
    showPassword: false,
  };

  submit() {
    const { getFieldValue } = this.props.form;
    const password = getFieldValue('password');
    const { email } = this.props.loginState;

    const { dispatch } = this.props;

    const that = this;
    that.setState({
      hasError: false,
      errMsg: null,
    });
    dispatch({
      type: 'loginState/registerEmail',
      payload: {
        userName: email,
        password,
        accountType: accountType.GizUserEmail,
      },
    });
  }

  switchPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  render() {
    const { loginState, language, form } = this.props;
    const { getFieldProps, getFieldValue, getFieldError } = form;

    const value = getFieldValue('password');
    const passError = getFieldError('password');

    const EMAIL = getLanguageString(language.key, 'EMAIL');
    const PASSWORD = getLanguageString(language.key, 'PASSWORD');

    const { showPassword } = this.state;

    return (
      <div style={{ marginTop: '0.32rem' }}>
        <List className="list-radius">
          <InputItem
            style={input}
            type="text"
            disabled
            placeholder={EMAIL}
            value={loginState.email}
          />
        </List>
        {
          this.state.hasError ? <div>{this.state.errMsg}</div> : null
        }
        <WhiteSpace size="md" />
        <List className="list-radius">
          <span
            onClick={this.switchPassword}
            className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'}`}
            style={styles.passwordIcon}
          />
          <InputItem
            style={input}
            type={showPassword ? 'text' : 'password'}
            placeholder={PASSWORD}
            {...getFieldProps('password', {
              // todo 加强密码的验证
              rules: [
                { required: true },
                { min: 8 },
                { max: 32 },
                { pattern: regular.password },
              ],
            })}
          />
        </List>
        {/* 提示 */}
        <PasswordTips />
        <WhiteSpace size="xl" />
        <Button
          className="btn"
          type="primary"
          style={btn}
          disabled={!value || !value.length || passError}
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

const SetPassEmailForm = createForm()(SetPassEmail);
export default connect(mapStateToProps)(SetPassEmailForm);
