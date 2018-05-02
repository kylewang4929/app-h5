import React from 'react';

import { connect } from 'dva';
import { Button, InputItem, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';
import { getLanguageString } from '../utils/getLanguage';
import regular from '../utils/regular';
import CountryPicker from './CountryPicker';
import route from '../utils/router';


const appConfig = require('../config/template').app;

const styles = {
  button: {
    margin: '0 0.4rem',
  },
};

class RegisterForm extends React.Component {

  state = {
    hasError: true,
    phoneCode: null,
    value: null,
  };

  submit() {
    const { dispatch, form } = this.props;
    form.validateFields((error, value) => {
      if (!error) {
        const payload = {};
        const phoneOrEmail = value.phoneOrEmail;

        let url = '';
        if (/^(\d)+$/.test(phoneOrEmail)) {
          url = '#/menu/setpass/phone';
          payload.phoneNum = phoneOrEmail;
          payload.email = '';
        } else {
          url = '#/menu/setpass/email';
          payload.phoneNum = '';
          payload.email = phoneOrEmail;
        }

        dispatch({
          type: 'loginState/update',
          payload,
        });

        route.go(url);
      }
    });
  }

  render() {
    const { language, form, style } = this.props;
    const { getFieldProps, getFieldError, getFieldValue } = form;
    const errors = getFieldError('phoneOrEmail');
    const value = getFieldValue('phoneOrEmail');

    const PHONE_AND_EMAIL = getLanguageString(language.key, 'PHONE_AND_EMAIL');
    const PHONE_NUMBER = getLanguageString(language.key, 'PHONE_NUMBER');
    const EMAIL = getLanguageString(language.key, 'EMAIL');

    const { registerType } = appConfig;
    let accountPlaceholder = '';
    let regularString = regular.phone;
    // 筛选出输入框的填充文字和默认值
    if (registerType.length > 1) {
      accountPlaceholder = PHONE_AND_EMAIL;
      regularString = regular.phoneAndEmail;
    } else {
      accountPlaceholder = registerType.includes('PHONE') ? PHONE_NUMBER : EMAIL;
      regularString = registerType.includes('PHONE') ? regular.phone : regular.email;
    }

    return (
      <div style={style}>
        <WhiteSpace size="md" />
        <CountryPicker />
        <List className="no-border-list">
          <InputItem
            placeholder={accountPlaceholder}
            {...getFieldProps(
              'phoneOrEmail',
              {
                rules: [
                  { required: true },
                  { pattern: regularString },
                ],
              },
            )}
          />
        </List>
        <WhiteSpace size="xl" />
        <Button
          style={styles.button}
          disabled={!(value && !errors)}
          className="btn"
          type="primary"
          onClick={this.submit.bind(this)}
        ><FormattedMessage id="REGISTER" /></Button>
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

const RegisterPageForm = createForm()(RegisterForm);
export default connect(mapStateToProps)(RegisterPageForm);
