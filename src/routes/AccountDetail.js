import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List, Button, Picker } from 'antd-mobile';
import BackButton from '../containers/MenuButton/BackButton';
import route from '../utils/router';
import { getLanguageString } from '../utils/getLanguage';
import logout from '../utils/logout';
import Toast from '../utils/Toast';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import InfoAlert from '../components/InfoAlert';
import Scroll from '../components/Scroll';

const Item = List.Item;
const styles = {
  list: {
    marginTop: '0.3rem',
  },
  container: {
  },
  button: {
    border: 'none',
    height: '0.9rem',
    lineHeight: '0.9rem',
    margin: '0.4rem 0.4rem',
    color: '#fff',
    backgroundColor: '#f1bf3d',
  },
  avatar: {
    width: '0.8rem',
    height: '0.8rem',
    borderRadius: '50%',
    margin: '0.1rem 0.1rem 0.1rem 0',
    boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 10px 0px rgba(0, 0, 0, 0.08)',
  },
};

const avatar = require('../assets/avatar.jpg');

class AccountDetail extends Component {

  handleLogout = () => {
    /**
     * 登出时，处理业务：
     * 1、清楚localStorage中的uid、token
     * 2、路由退到登录界面
     */
    // 去除localStorage的uid、token
    const { dispatch } = this.props;
    dispatch({
      type: 'tabState/update',
      payload: {
        selectedTab: 'deviceList',
      },
    });

    logout();
  }

  goToProfileSetting = () => {
    route.go('#/menu/profileSetting');
  }

  goToResatPassword = () => {
    route.go('#/menu/resetPassword');
  }

  editNickName = () => {
    route.go('#/menu/editNickName');
  }

  editAddress = () => {
    route.go('#/menu/editAddress');
  }

  setGenders = (value) => {
    if (!value || !value[0]) {
      value = [0];
    }
    const { dispatch, language } = this.props;
    const token = localStorage.getItem('token');

    const LOADING = getLanguageString(language.key, 'LOADING');
    const UPDATE_INFO_FAILED = getLanguageString(language.key, 'UPDATE_INFO_FAILED');

    Toast.loading(LOADING, 0);

    let gender = 'Unknown';
    switch (this.genders[value[0]].value) {
      case 0: {
        gender = 'Male';
        break;
      }
      case 1: {
        gender = 'Female';
        break;
      }
      default : {
        gender = 'Unknown';
        break;
      }
    }

    dispatch({
      type: 'userState/changeUserInfo',
      payload: {
        token,
        additionalInfo: {
          gender,
        },
        success: () => {
          Toast.hide();
        },
        error: () => {
          InfoAlert.show(UPDATE_INFO_FAILED, 'error', 3000);
          Toast.hide();
        },
      },
    });
  }

  render() {
    const { tintColor } = this.context.properties;
    const { language, userState } = this.props;
    const { phone, email, name } = userState;


    const NOT_SET = getLanguageString(language.key, 'NOT_SET');

    const MALE = getLanguageString(language.key, 'MALE');
    const FEMALE = getLanguageString(language.key, 'FEMALE');

    this.genders = [
      {
        value: 0,
        label: MALE,
      },
      {
        value: 1,
        label: FEMALE,
      },
    ];

    return (
      <div>
        <NavBar
          title="ACCOUNT_DETAIL"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <Scroll bounce>
            <List className="my-list" style={styles.list}>
              <Item arrow="horizontal" extra={name || NOT_SET} onClick={this.editNickName}>
                <FormattedMessage id="NICK_NAME" />
              </Item>
              
              <Item extra={phone || email}><FormattedMessage id="ACCOUNT" /></Item>
              
              <Item arrow="horizontal" extra="********" onClick={this.goToResatPassword}><FormattedMessage id="PASSWORD" /></Item>
            </List>
            
            <Button
              style={{ ...styles.button }}
              onClick={this.handleLogout.bind(this)}
            >
              <FormattedMessage id="LOG_OUT" />
            </Button>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

AccountDetail.propTypes = {
};

AccountDetail.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    userState: state.userState,
    language: state.language,
  };
}

export default connect(mapStateToProps)(AccountDetail);
