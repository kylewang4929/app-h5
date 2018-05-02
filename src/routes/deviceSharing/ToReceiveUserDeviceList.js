import React from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import { List, Button, WhiteSpace, Modal } from 'antd-mobile';
import Scroll from '../../components/Scroll';
import MenuPage from '../../components/MenuPage';
import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';

import './ToShareUserDeviceList.less';


const Item = List.Item;
const alert = Modal.alert;

const styles = {
  tip: {
    wrapper: {
      margin: '0.2rem 0 0 0',
      padding: '1rem 0',
      textAlign: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: '0.6rem',
      color: 'rgb(55, 154, 250)',
    },
  },
  rightBox: {
    position: 'absolute',
    right: '0px',
    top: '0px',
  },
  button: {
    padding: '0 0.2rem',
  },
  emptyTip: {
    paddingTop: '2rem',
    textAlign: 'center',
    color: '#c35400',
  },
  nonePage: {
    textAlign: 'center',
    padding: '2rem 0',
  },
  nonePageIcon: {
    color: '#909090',
    fontSize: '2rem',
    display: 'inline-block',
  },
  nonePageText: {
    fontSize: '0.26rem',
    color: '#909090',
  },
};

class ToReceiveUserDeviceList extends React.Component {

  /**
   * 调用接口，回应分享邀请，
   * Todo 调用接口前，让用户进行确定！
   *
   * @param shareId 分享记录id
   * @param status 接受/拒绝分享，1：接受分享，2：拒绝分享
   */
  handleShareOffer(shareId, status) {
    const { dispatch } = this.props;
    dispatch({
      type: 'shareState/replyShareOffer',
      payload: {
        shareId, status,
        success: this.updateShareState.bind(this)
      }
    });
  }

  /**
   * 用户回应邀请后，更新设备分享情况
   */
  updateShareState() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shareState/getShareUsers',
      payload: {
        sharing_type: 1,
        limit: 100,
      }
    });
  }

  /**
   * 获取 “当前用户分享的设备” 列表，满足以下条件
   * 1. 来自shareState.shareToReceive
   * 2. 属于当前uid
   *
   * @param status 分享状态，逗号分隔，0：未接受分享，1：已接受分享，2：拒绝分享，3：取消分享
   * @returns {Array}
   */
  getDeviceArrayByStatus(status) {
    const { objects } = this.props.shareState.shareToReceive;
    const { uid } = this.props.params;

    let receivedDeviceArray = [];
    for (let _device of objects) {
      if (_device.uid === uid && _device.status === status) {
        receivedDeviceArray.push(_device);
      }
    }

    return receivedDeviceArray;
  }

  getUserInfoByUid(uid) {
    const { objects } = this.props.shareState.shareToReceive;
    for (let _device of objects) {
      if (_device.uid === uid) {
        return {
          uid,
          username: _device.username,
          user_alias: _device.user_alias,
          email: _device.email,
          phone: _device.phone,
        }
      }
    }
    return { uid }
  }

  render() {

    const { uid } = this.props.params;
    const { username, user_alias, email, phone } = this.getUserInfoByUid(uid);

    const devicesToHandle = this.getDeviceArrayByStatus(0);
    const devicesHasAccepted = this.getDeviceArrayByStatus(1);
    const devicesRefuse = this.getDeviceArrayByStatus(2);

    const { language } = this.props;
    const CANCEL = getLanguageString(language.key, 'CANCEL');
    const CONFIRM = getLanguageString(language.key, 'CONFIRM');
    const REFUSED_TO_ACCEPT = getLanguageString(language.key, 'REFUSED_TO_ACCEPT');
    const AGREE_TO_RECEIVE = getLanguageString(language.key, 'AGREE_TO_RECEIVE');
    const HAS_REFUSED = getLanguageString(language.key, 'HAS_REFUSED');
    const HAVE_RECEIVED = getLanguageString(language.key, 'HAVE_RECEIVED');
    return (
      <div>
        <NavBar
          title="SHARE_MY_DEVICE"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            {
              devicesToHandle.length === 0 && devicesHasAccepted.length === 0 && devicesRefuse.length === 0 ? (
                <div style={styles.nonePage}>
                  <span className="mdi mdi-format-list-bulleted" style={styles.nonePageIcon} />
                  <div style={styles.nonePageText}>
                    <FormattedMessage id="NO_DEVICE_SHARED_BY_THE_USER_HAS_BEEN_RECEIVED" />
                  </div>
                </div>
              ) : (
                <div style={styles.tip.wrapper}>
                  <div style={styles.tip.title}>{
                    user_alias || phone || email
                  }</div>
                  <div><FormattedMessage id="SHARE_THE_FOLLOWING_DEVICE_CONTROL" /></div>
                </div>
              )
            }
            {
              devicesToHandle.length ?
                (
                  <List
                    renderHeader={() => <FormattedMessage id="DEAL_WITH_SHARING_INVITATIONS" />}
                    className="supper-app-choice-list my-list"
                  >
                    {
                      devicesToHandle.map(
                        (item) => (
                          <Item
                            key={item.did}
                            extra={
                              <div style={styles.rightBox}>
                                <Button
                                  className="btn" type="warning"
                                  style={styles.button}
                                  onClick={() => alert(item.dev_alias || item.product_name, REFUSED_TO_ACCEPT, [
                                    { text: CANCEL, onPress: () => console.log('cancel') },
                                    { text: CONFIRM, onPress: () => this.handleShareOffer.bind(this)(item.id, 2) },
                                  ])}
                                ><FormattedMessage id="REFUSED" /></Button>
                                <Button
                                  className="btn" type="primary"
                                  style={styles.button}
                                  onClick={() => alert(item.dev_alias || item.product_name, AGREE_TO_RECEIVE, [
                                    { text: CANCEL, onPress: () => console.log('cancel') },
                                    { text: CONFIRM, onPress: () => this.handleShareOffer.bind(this)(item.id, 1) },
                                  ])}
                                ><FormattedMessage id="ACCEPT" /></Button>
                              </div>
                            }
                          >{item.dev_alias || item.product_name}</Item>
                        )
                      )
                    }
                  </List>
                ) : null
            }
            {
              devicesHasAccepted.length ?
                (
                  <List
                    renderHeader={() => <FormattedMessage id="DEVICE_THAT_HAS_BEEN_RECEIVED" />}
                    className="supper-app-choice-list my-list"
                  >
                    {
                      devicesHasAccepted.map(
                        (item) => (
                          <Item
                            key={item.did}
                            extra={HAVE_RECEIVED}
                          >{item.dev_alias || item.product_name}</Item>
                        )
                      )
                    }
                  </List>
                ) : null
            }
            {
              devicesRefuse.length ?
                (
                  <List
                    renderHeader={() => <FormattedMessage id="SHARE_REJECTED" />}
                    className="supper-app-choice-list my-list"
                  >
                    {
                      devicesRefuse.map(
                        (item) => (
                          <Item
                            style={{ paddingRight: '0.3rem' }}
                            key={item.did}
                            extra={HAS_REFUSED}
                          >{item.dev_alias || item.product_name}</Item>
                        )
                      )
                    }
                  </List>
                ) : null
            }
          </Scroll>
        </MenuPage>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    shareState: state.shareState,
    language: state.language,
  };
}

export default connect(mapStateToProps)(ToReceiveUserDeviceList);
