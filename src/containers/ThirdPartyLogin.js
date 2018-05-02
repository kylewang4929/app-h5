import React from 'react';
import { Flex, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import ThirdPartyEntry from '../components/ThirdPartyEntry';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';
import router from '../utils/router';
import { quickLogin } from '../services/quickLogin';

import wechat from '../assets/wechat.png';
import qq from '../assets/qq.png';
import sina from '../assets/weibo.png';
import google from '../assets/Google+.png';
import twitter from '../assets/twitter.png';
import facebook from '../assets/facebook.png';

const iconList = {
  qq,
  sina,
  wechat,
  google,
  twitter,
  facebook,
};

const appConfig = require('../config/template').app;

const entry = {
  textAlign: 'center',
  fontSize: '0.3rem',
  marginBottom: '0.8rem',
  color: '#cdcdcd',
};

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    bottom: '0.6rem',
    left: '0px',
    padding: '0 10%',
    boxSizing: 'border-box',
  },
};

class ThirdPartyLogin extends React.Component {
  onClick = (item) => {
    const { language } = this.props;
    const LOADING = getLanguageString(language.key, 'LOADING');
    Toast.loading(LOADING, 0);
    quickLogin({ type: item.id }).then(() => {
      router.go('#/menu/mainPage');
      Toast.hide();
    }).catch(() => {
      Toast.hide();
    });
  }

  loginError = () => {
    // 可能是用户取消了授权 可以在这里提示失败
    const { language } = this.props;
    const AUTH_LOGIN_FAILED = getLanguageString(language.key, 'AUTH_LOGIN_FAILED');
    InfoAlert.show(AUTH_LOGIN_FAILED, 'error', 2000);
  }

  render() {
    return (
      <div style={styles.contianer} className="keyboard-open-hide">
        {
          appConfig.quickLogin.length > 0 ? <div style={entry}><FormattedMessage id="QUICK_LOGIN" /></div> : null
        }
        <Flex>
          {
            appConfig.quickLogin.map((item, index) => {
              return (
                <Flex.Item key={index}>
                  <ThirdPartyEntry onClick={this.onClick.bind(null, item)} style={{ float: 'right' }} src={iconList[item.id]} text={<FormattedMessage id={item.label} />} />
                </Flex.Item>
              );
            })
          }
        </Flex>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(ThirdPartyLogin);
