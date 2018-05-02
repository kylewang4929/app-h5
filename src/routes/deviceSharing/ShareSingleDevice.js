import React from 'react';
import { connect } from 'dva';
import { Button, InputItem, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import Toast from '../../utils/Toast';
import BackButton from '../../containers/MenuButton/BackButton';
import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';

import router from '../../utils/router';

const styles = {
  container: {
    marginTop: '0.2rem',
  },
  button: {
    width: '90%',
    margin: 'auto',
    height: '0.8rem',
    lineHeight: '0.8rem',
  },
};
class ShareSingleDevice extends React.Component {
  submit = () => {
    const { dispatch, params, language } = this.props;
    const { did } = params;
    this.props.form.validateFields((error, value) => {
      if (!error) {
        const LOADING = getLanguageString(language.key, 'LOADING');

        let body = {}; // (email or phone) (type) (did)
        const phoneOrEmail = value.phoneOrEmail;

        //为payload赋值
        if (/^(\d)+$/.test(phoneOrEmail)) {
          body.phone = phoneOrEmail;
        } else {
          body.email = phoneOrEmail;
        }

        body.type = 0;
        body.did = did;
        Toast.loading(LOADING, 0);

        dispatch({
          type: 'shareState/shareDevice',
          payload: {
            body,
            success: (did) => {
              router.goBack(-1);
              Toast.hide();
            },
            error: (did) => {
              Toast.hide();
            }
          }
        });
      }
    });
  }

  render() {
    const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
    const errors = getFieldError('phoneOrEmail');
    const value = getFieldValue('phoneOrEmail');

    const { language } = this.props;
    const PHONE_AND_EMAIL = getLanguageString(language.key, 'PHONE_AND_EMAIL');

    return (
      <div>
        <NavBar
          title="DEVICE_SHARE"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <div style={styles.container}>
            <List className="no-border-list list-radius">
              <WhiteSpace size="md" />
              <InputItem
                placeholder={PHONE_AND_EMAIL}
                {...getFieldProps(
                    'phoneOrEmail',
                    {
                    rules: [
                        { required: true },
                        { pattern: /^((\w-*\.*)+@(\w-?)+(\.\w{2,})+)|(\d)+$/ },
                    ],
                    },
                )}
              />
            </List>
            <WhiteSpace size="lg" />
            <Button
              disabled={!(value && !errors)}
              className="btn"
              type="primary"
              style={styles.button}
              onClick={this.submit}
            ><FormattedMessage id="SHARE_DEVICE" /></Button>
          </div>
        </MenuPage>
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
const ShareSingleDeviceForm = createForm()(ShareSingleDevice);
export default connect(mapStateToProps)(ShareSingleDeviceForm);
