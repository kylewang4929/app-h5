import React from 'react';
import { List, InputItem, Button, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import GenderPicker from '../components/GenderPicker';
import BirthdayPicker from '../components/BirthdayPicker';
import BackButton from '../containers/MenuButton/BackButton';
import { getLanguageString } from '../utils/getLanguage';
import NavBar from '../containers/NavBar';
import Toast from '../utils/Toast';
import MenuPage from '../components/MenuPage';

const styles = {
  box: {
    padding: '0 0.3rem',
  },
};

class ProfileSetting extends React.Component {

  state = {
    gender: 'F',
  };

  componentWillMount() {
    const { language } = this.props;
    this.ENTER_NAME = getLanguageString(language.key, 'ENTER_NAME');
    this.ENTER_ADDRESS = getLanguageString(language.key, 'ENTER_ADDRESS');
  }

  onSubmit() {
    const { dispatch, userState, form } = this.props;
    const { name, gender, } = userState;
    const { getFieldValue } = form;

    const token = localStorage.getItem('token');

    const params = ['name', 'gender', 'birthday', 'address'];
    let additionalInfo = {};

    params.forEach((key) => {
      const value = getFieldValue(key);
      if (value) {
        switch (key) {
          case 'birthday':
            additionalInfo[key] = value.format('YYYY-MM-DD');
            break;
          case 'gender':
            additionalInfo[key] = value[0];
            break;
          default:
            additionalInfo[key] = value;
        }
      }
    });

    Toast.loading('loading');
    dispatch({
      type: 'userState/changeUserInfo',
      payload: {
        token,
        additionalInfo,
      },
    });
  }

  render() {
    const { language } = this.props;
    const { getFieldProps } = this.props.form;
    const { name, gender, address } = this.props.userState;
    return (
      <div>
        <NavBar
          title="EDIT_PERSONAL_INFORMATION"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace size="md" />
          <List className="picker-list">
            <InputItem
              className="right-input"
              placeholder={this.ENTER_NAME}
              {...getFieldProps('name', {
                rules: [
                  { required: true },
                  { max: 64 },
                ],
              })}
            ><FormattedMessage id="NICK_NAME" /></InputItem>
            <GenderPicker fieldProps={getFieldProps('gender')} />
            <BirthdayPicker fieldProps={getFieldProps('birthday')} />
            <InputItem
              placeholder={this.ENTER_ADDRESS}
              className="right-input"
              {...getFieldProps('address', {
                rules: [
                  { required: true },
                  { max: 64 },
                ],
              })}
            ><FormattedMessage id="ADDRESS" /></InputItem>
          </List>
          <WhiteSpace size="xl" />

          <div style={styles.box}>
            <Button
              className="btn"
              type="primary"
              onClick={this.onSubmit.bind(this)}
            ><FormattedMessage id="SUBMIT" /></Button>
          </div>
        </MenuPage>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    userState: state.userState,
    language: state.language,
  };
}

const ProfileSettingForm = createForm()(ProfileSetting);
export default connect(mapStateToProps)(ProfileSettingForm);
