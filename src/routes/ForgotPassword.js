import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import { Button, InputItem, List, WhiteSpace, WingBlank, Modal } from 'antd-mobile';
import SetPassPhone from '../containers/SetPassPhone';
import BackButton from '../containers/MenuButton/BackButton';
import { getLanguageString } from '../utils/getLanguage';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import regular from '../utils/regular';
import CountryPicker from '../containers/CountryPicker';

const appConfig = require('../config/template').app;

const styles = {
  button: {
    margin: '0 0.4rem',
  },
};

class ForgotPassword extends React.Component {

  state = {
    phoneReset: false,
  };
  submit() {
    const { getFieldValue } = this.props.form;
    const { dispatch } = this.props;
    const value = getFieldValue('phoneOrEmail');

    // 如果是手机号码
    if (/^(\d)+$/.test(value)) {
      this.setState({ phoneReset: true });
      dispatch({
        type: 'loginState/update',
        payload: {
          phoneNum: value,
        },
      });
    } else {
      dispatch({
        type: 'loginState/forgotPassword',
        payload: { email: value },
      });
      dispatch({
        type: 'loginState/update',
        payload: {
          email: value,
        },
      });
    }
  }

  submitPhone(phone, password, code) {
    const { dispatch } = this.props;
    dispatch({
      type: 'loginState/forgotPassword',
      payload: {
        phone,
        new_pwd: password,
        code,
      },
    });
  }

  render() {
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
    const { language } = this.props;
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
      <div>
        <NavBar
          title="FORGET_PASSWORD"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace size="lg" />
          {
            this.state.phoneReset ?
              <WingBlank>
                <SetPassPhone onSubmitDispatch={this.submitPhone.bind(this)} />
              </WingBlank>
              : (
              <div>
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
                >
                  <FormattedMessage id="RESET_PASSWORD" />
                </Button>
              </div>
              )
          }
        </MenuPage>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

const ForgotPasswordForm = createForm()(ForgotPassword);
export default connect(mapStateToProps)(ForgotPasswordForm);
