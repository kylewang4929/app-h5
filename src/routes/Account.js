import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { List, Badge, Picker } from 'antd-mobile';

import { FormattedMessage } from 'react-intl';
import { getLanguageString, getLanguageList } from '../utils/getLanguage';
import NavBar from '../containers/NavBar';

import MenuPage from '../components/MenuPage';
import Avatar from '../components/Avatar';
import router from '../utils/router';

import config from '../config/template';
import BackButton from '../containers/MenuButton/BackButton';

const voiceConfig = config.voiceTips || {};

const Item = List.Item;

const languageList = getLanguageList();

const styles = {
  list: {
    marginTop: '0.3rem',
  },
  icon: {
    fontSize: '0.42rem',
    marginLeft: '0.1rem',
  },
  dot: {
    position: 'relative',
    top: '-0.16rem',
    left: '0.06rem',
  },
  borderBottom: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
};

class Account extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    /**
     * 获取用户信息
     */
    const token = localStorage.getItem('token');
    dispatch({
      type: 'userState/userInfo',
      payload: { token },
    });
  }

  onScan = () => {
    cordova.plugins.barcodeScanner.scan(
      (result) => {
        if (!result.cancelled) {
          alert(`Barcode type is: ${  result.format}`);
          alert(`Decoded text is: ${  result.text}`);
        } else {
          alert('You have cancelled scan');
        }
      },
      (error) => {
        alert(`Scanning failed: ${  error}`);
      },
    );
  };

  setLanguage = (value) => {
    let obj = {};
    languageList.map((item) => {
      if (value[0] === item.value) {
        obj = item;
      }
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'language/updateLanguage',
      payload: {
        key: obj.value,
        name: obj.label,
      },
    });
  }

  goToAccountDetail = () => {
    router.go('#/menu/accountDetail');
  }

  goToDeviceSharing = () => {
    router.go('#/menu/deviceSharing');
  }

  goToVoiceTips = () => {
    router.go('#/menu/voiceTips');
  }

  goToFeedback = () => {
    router.go('#/menu/feedback');
    // if (device.platform === 'iOS') {
    //   // router.go('#/menu/feedback');
    //   window.location.href = `itms-apps://itunes.apple.com/app/${appConfig.iosAppID}`;
    // }
    // if (device.platform === 'Android') {
    //   window.location.href = `market://details?id=${appConfig.androidAppID}`;
    // }
  };
  goToSetting = () => {
    router.go('#/menu/setting');
  };
  goToMessage = () => {
    router.go('#/menu/message');
  };
  goToLanguage = () => {
    router.go('#/menu/language');
  };
  goToAboutUs = () => {
    router.go('#/menu/aboutUs');
  };
  goToAccountDetail = () => {
    router.go('#/menu/accountDetail');
  };

  render() {
    const { tintColor } = this.context.properties;
    const { language, userState } = this.props;
    const { name, phone, email } = userState;
    const iconColor = {
      color: tintColor,
    };

    const { shareState } = this.props;
    const hasShare = shareState.shareToReceive.hasShare;

    const SELECT_LANGUAGE = getLanguageString(language.key, 'SELECT_LANGUAGE');
    const CONFIRM = getLanguageString(language.key, 'CONFIRM');
    const CANCEL = getLanguageString(language.key, 'CANCEL');

    return (
      <div>
        <NavBar
          title="MY"
          leftButton={<BackButton />}
        />
        <MenuPage theme="dark" hasTab>
          <List className="my-list" style={styles.list}>
            <Item
              onClick={this.goToLanguage}
              style={{ ...styles.borderBottom }}
              arrow="horizontal"
              thumb={<span style={{ ...styles.icon, ...iconColor }} className="mdi mdi-translate" />}
            >
              <FormattedMessage id="LANGUAGE" />
            </Item>
            <Item
              arrow="horizontal"
              onClick={this.goToAccountDetail}
              thumb={<span style={{ ...styles.icon, ...iconColor }} className="mdi mdi-account" />}
            ><FormattedMessage id="PERSONAL_CENTER" /></Item>
            <Item
              arrow="horizontal"
              onClick={this.goToAboutUs}
              thumb={<span style={{ ...styles.icon, ...iconColor }} className="mdi mdi-information" />}
            ><FormattedMessage id="ABOUT" /></Item>
            <Item
              arrow="horizontal"
              onClick={this.goToFeedback}
              thumb={<span style={{ ...styles.icon, ...iconColor }} className="mdi mdi-send" />}
            ><FormattedMessage id="FEED_BACK" /></Item>
          </List>
        </MenuPage>
      </div>
    );
  }
}

Account.propTypes = {
};

Account.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    userState: state.userState,
    shareState: state.shareState,
    language: state.language,
  };
}


export default connect(mapStateToProps)(Account);
