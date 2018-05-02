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

class EditAddress extends React.Component {

  submit = () => {
    const { getFieldValue } = this.props.form;
    const { dispatch, language } = this.props;
    const value = getFieldValue('address');

    const LOADING = getLanguageString(language.key, 'LOADING');

    const token = localStorage.getItem('token');
    Toast.loading(LOADING, 0);

    const UPDATE_FAILURE_PLEASE_TRY_AGAIN = getLanguageString(language.key, 'UPDATE_FAILURE_PLEASE_TRY_AGAIN');

    dispatch({
      type: 'userState/changeUserInfo',
      payload: {
        token,
        additionalInfo: {
          address: value,
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
    const { form, language, userState } = this.props;
    const { getFieldProps, getFieldValue, getFieldError } = form;
    const { address } = userState;
    
    const errors = getFieldError('address');
    const value = getFieldValue('address');

    const ADDRESS = getLanguageString(language.key, 'ADDRESS');

    return (
      <div>
        <NavBar
          title="ADDRESS"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace size="md" />
          <List className="no-border-list">
            <InputItem
              placeholder={ADDRESS}
              {...getFieldProps(
                'address',
                {
                  rules: [
                    { required: true },
                  ],
                  initialValue: address,
                },
              )}
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
              <FormattedMessage id="CHANGE_ADDRESS" />
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

const EditAddressForm = createForm()(EditAddress);
export default connect(mapStateToProps)(EditAddressForm);
