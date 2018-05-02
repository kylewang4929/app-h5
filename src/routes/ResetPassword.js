import React from 'react';
import { connect } from 'dva';
import { List, InputItem, WhiteSpace, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import InfoAlert from '../components/InfoAlert';
import MenuPage from '../components/MenuPage';
import router from '../utils/router';
import Toast from '../utils/Toast';
import { getLanguageString } from '../utils/getLanguage';

import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';

import regular from '../utils/regular';
import PasswordTips from '../components/PasswordTips';

const styles = {
  buttonBox: {
    padding: '0 0.4rem',
  },
};

class ResetPassword extends React.Component {

  handleSubmit() {
    /**
     * 检查：
     * <li>是否都有填写</li>
     * <li>是否两次新密码一致</li>
     *
     * 提交后：
     * <li>是否成功</li>
     */

    const { dispatch, form, language } = this.props;
    const { getFieldError, getFieldValue } = form;

    const token = localStorage.getItem('token');
    const oldPassword = getFieldValue('oldPassword');
    const newPassword = getFieldValue('newPassword');
    const verifyNewPassword = getFieldValue('verifyNewPassword');

    const oldPasswordError = getFieldError('oldPassword');
    const newPasswordError = getFieldError('newPassword');
    const verifyNewPasswordError = getFieldError('verifyNewPassword');

    const ALL_ITEMS_MUST_BE_COMPLETED = getLanguageString(language.key, 'ALL_ITEMS_MUST_BE_COMPLETED');
    const PASSWORD_LENGTH_TIPS = getLanguageString(language.key, 'PASSWORD_LENGTH_TIPS');
    const OLD_AND_NEW_PASSWORDS_DO_NOT_MATCH = getLanguageString(language.key, 'OLD_AND_NEW_PASSWORDS_DO_NOT_MATCH');
    const PASSWORD_MODIFIED_SUCCESSFULLY = getLanguageString(language.key, 'PASSWORD_MODIFIED_SUCCESSFULLY');
    const OLD_PASSWORD_MODIFIED_ERROR = getLanguageString(language.key, 'OLD_PASSWORD_MODIFIED_ERROR');
    
    if (!oldPassword || !newPassword || !verifyNewPassword) {
      InfoAlert.show(ALL_ITEMS_MUST_BE_COMPLETED, 'error');
      return;
    }

    // if (oldPasswordError || newPasswordError || verifyNewPasswordError) {
    //   InfoAlert.show(PASSWORD_LENGTH_TIPS, 'error');
    //   return;
    // }

    if (newPassword !== verifyNewPassword) {
      InfoAlert.show(OLD_AND_NEW_PASSWORDS_DO_NOT_MATCH, 'error');
      return;
    }

    const LOADING = getLanguageString(language.key, 'LOADING');
    Toast.loading(LOADING, 0);

    dispatch({
      type: 'userState/resetPassword',
      payload: {
        token, oldPassword, newPassword,
        success: ({ data }) => {
          InfoAlert.show(PASSWORD_MODIFIED_SUCCESSFULLY);
          router.goBack(-1);
          Toast.hide();
        },
        error: ({ data }) => {
          if (data.errorCode === 9056) {
            InfoAlert.show(OLD_PASSWORD_MODIFIED_ERROR, 'error');
          }
          Toast.hide();
        },
      },
    });
  }

  render() {
    const { form, language } = this.props;
    const { getFieldProps, getFieldError, getFieldValue } = form;

    const oldPasswordError = getFieldError('oldPassword');
    const newPasswordError = getFieldError('newPassword');
    const verifyNewPasswordError = getFieldError('verifyNewPassword');

    const oldPassword = getFieldValue('oldPassword');
    const newPassword = getFieldValue('newPassword');
    const verifyNewPassword = getFieldValue('verifyNewPassword');

    const OLD_PASSWORD = getLanguageString(language.key, 'OLD_PASSWORD');
    const NEW_PASSWORD = getLanguageString(language.key, 'NEW_PASSWORD');
    const ENTER_THE_NEW_PASSWORD_AGAIN = getLanguageString(language.key, 'ENTER_THE_NEW_PASSWORD_AGAIN');

    return (
      <div>
        <NavBar
          title="MODIFY_LOGIN_PASSWORD"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace size="md" />
          <List>
            <InputItem
              type="password"
              placeholder={OLD_PASSWORD}
              {...getFieldProps('oldPassword', {
                rules: [
                  { required: true },
                ],
              })}
            />
            <InputItem
              type="password"
              placeholder={NEW_PASSWORD}
              {...getFieldProps('newPassword', {
                rules: [
                  { required: true },
                  { min: 8 },
                  { max: 32 },
                  { pattern: regular.password },
                ],
              })}
            />
            <InputItem
              type="password"
              placeholder={ENTER_THE_NEW_PASSWORD_AGAIN}
              {...getFieldProps('verifyNewPassword', {
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
          <div style={{ padding: '0 0.2rem' }}>
            <PasswordTips />
          </div>
          <WhiteSpace size="xl" />

          <div style={styles.buttonBox}>
            <Button
              className="btn"
              type="primary"
              disabled={!(newPassword && oldPassword && verifyNewPassword && !oldPasswordError && !newPasswordError && !verifyNewPasswordError)}
              onClick={this.handleSubmit.bind(this)}
            ><FormattedMessage id="SUBMIT" /></Button>
          </div>
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

const ResetPasswordForm = createForm()(ResetPassword);
export default connect(mapStateToProps)(ResetPasswordForm);
