import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import { Button, InputItem, List, WhiteSpace } from 'antd-mobile';
import BackButton from '../containers/MenuButton/BackButton';
import router from '../utils/router';
import { getLanguageString } from '../utils/getLanguage';
import Toast from '../utils/Toast';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import InfoAlert from '../components/InfoAlert';

const styles = {
  box: {
    padding: '0 0.4rem',
  },
  button: {
    fontSize: '.32rem',
    height: '.88rem',
    lingHeight: '.88rem',
  },
};

class EditNickName extends React.Component {

  submit = () => {
    const { getFieldValue } = this.props.form;
    const { dispatch, language } = this.props;
    const value = getFieldValue('name');

    const UPDATE_FAILURE_PLEASE_TRY_AGAIN = getLanguageString(language.key, 'UPDATE_FAILURE_PLEASE_TRY_AGAIN');
    const LOADING = getLanguageString(language.key, 'LOADING');

    const token = localStorage.getItem('token');
    Toast.loading(LOADING, 0);
    dispatch({
      type: 'userState/changeUserInfo',
      payload: {
        token,
        additionalInfo: {
          name: value,
        },
        success: () => {
          Toast.hide();
          router.goBack(-1);
        },
        error: () => {
          InfoAlert.show(UPDATE_FAILURE_PLEASE_TRY_AGAIN, 'error', 2000);
          Toast.hide();
        },
      },
    });
  }

  render() {
    const { language, form, userState } = this.props;

    const { getFieldProps, getFieldValue, getFieldError } = form;
    const { name } = userState;

    const errors = getFieldError('name');
    const value = getFieldValue('name');

    const NICK_NAME = getLanguageString(language.key, 'NICK_NAME');

    return (
      <div>
        <NavBar
          title="NICK_NAME"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace size="md" />
          <List className="no-border-list">
            <InputItem
              placeholder={NICK_NAME}
              {...getFieldProps(
                'name',
                {
                  rules: [
                    { required: true },
                  ],
                  initialValue: name,
                })
              }
            />
          </List>
          <WhiteSpace size="xl" />
          <div style={styles.box}>
            <Button
              disabled={!(value && !errors)}
              className="btn"
              style={styles.button}
              type="primary"
              onClick={this.submit}
            >
              <FormattedMessage id="CHANGE_NICK_NAME" />
            </Button>
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

const EditNickNameForm = createForm()(EditNickName);
export default connect(mapStateToProps)(EditNickNameForm);
