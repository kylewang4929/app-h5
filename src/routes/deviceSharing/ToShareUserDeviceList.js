import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { FormattedMessage } from 'react-intl';

import { List, Switch, WhiteSpace, Button, Modal } from 'antd-mobile';
import BackButton from '../../containers/MenuButton/BackButton';
import CommonButton from '../../containers/MenuButton/CommonButton';
import Scroll from '../../components/Scroll';
import router from '../../utils/router';
import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';

const Item = List.Item;
const prompt = Modal.prompt;

const styles = {
  btn: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    border: 'none',
    borderRadius: '0px',
    height: '1.1rem',
    lineHeight: '1.1rem',
  },
};

class ToShareUserDeviceList extends React.Component {

  state = {
    originShareStatus: {},
    changeDict: {},
  };

  componentWillMount() {
    const { dispatch, language } = this.props;
    const that = this;
    const CANCEL = getLanguageString(language.key, 'CANCEL');
    const SUBMIT = getLanguageString(language.key, 'SUBMIT');
    const DEVICE_USER_ALIAS = getLanguageString(language.key, 'DEVICE_USER_ALIAS');
    const USER_ALIAS = getLanguageString(language.key, 'USER_ALIAS');

    this.button = (
      <CommonButton
        onClick={() => prompt(DEVICE_USER_ALIAS, USER_ALIAS,
          [
            { text: CANCEL },
            {
              text: SUBMIT,
              onPress: that.setUserAlias.bind(that),
            },
          ],
        )}
      >
        <i className="mdi mdi-lead-pencil" style={{ fontSize: '0.36rem' }} />
      </CommonButton>);

    /**
     * 获取当前用户下的设备列表
     * 1. 当前所有拥有的产品
     * 2. 当前所有已经分享的产品
     * 2.1 属于当前被分享用户的产品
     * 2. 已经分享，即为true，尚未分享，则为false
     */
    const { objects } = this.props.shareState.shareToSend;
    const { uid } = this.props.params;
    const myDeviceArray = this.getOwnerDevices();

    const originShareStatus = {};
    for (const device of myDeviceArray) {
      originShareStatus[device.did] = false;
    }

    for (const device of objects) {
      if (device.uid === uid) {
        originShareStatus[device.did] = true;
      }
    }

    this.setState({
      originShareStatus,
    });
  }

  setUserAlias = (value) => {
    const { dispatch, params } = this.props;
    console.log('提交用户别名', value, params.uid, this.getShareIdFrom('uid', params.uid));

    dispatch({
      type: 'shareState/setUserAlias',
      payload: {
        shareId: this.getShareIdFrom('uid', params.uid),
        userAlias: value,
        success: () => {
          router.goBack(-1);
          dispatch({
            type: 'shareState/getShareUsers',
            payload: {
              sharing_type: 0,
              limit: 100,
            },
          });
        },
      },
    });
  };

  /**
   * 获取我所拥有的设备 = 总设备列表 - 分享给我的设备
   */
  getOwnerDevices() {
    // 总设备列表
    const { data } = this.props.deviceList;
    // 分享给我的设备
    const { objects } = this.props.shareState.shareToReceive;
    const checkArray = [];
    for (const device of objects) {
      checkArray.push(device.did);
    }

    // 我所拥有的设备
    const myDevices = [];
    for (const device of data) {
      if (!checkArray.includes(device.did)) {
        myDevices.push(device);
      }
    }
    return myDevices;
  }

  getShareIdFrom(key, value) {
    const { objects } = this.props.shareState.shareToSend;
    for (const device of objects) {
      console.log('getShareIdFrom', key, value, device[key], device.id);
      if (value === device[key]) {
        return device.id;
      }
    }
    return null;
  }

  getUserName() {
    const { uid } = this.props.params;
    const { objects } = this.props.shareState.shareToSend;

    for (const device of objects) {
      if (device.uid === uid) {
        const { user_alias, phone, email } = device;
        return user_alias || phone || email;
      }
    }
    return '';
  }

  /**
   * 获取所有变化的设备
   * 1. 决定是否分享
   */
  submitChange() {
    const { dispatch } = this.props;
    const { uid } = this.props.params;
    const changeDict = this.checkChangeDict();

    for (const key in changeDict) {
      console.log('----> changeDict', changeDict, changeDict[key]);

      // 如果是开启分享
      if (changeDict[key]) {
        console.log('start share ---->', key, uid);

        dispatch({
          type: 'shareState/shareDevice',
          payload: {
            body: {
              type: 0,
              did: key,
              uid,
            },
          },
        });
      } else { // 如果是取消分享
        const shareId = this.getShareIdFrom('did', key);

        console.log('----> shareId', shareId);

        if (shareId !== null) {
          dispatch({
            type: 'shareState/cancelShareDevice',
            payload: { shareId },
          });
        }
      }
    }
  }

  checkChangeDict() {
    const { changeDict, originShareStatus } = this.state;
    const updateDict = {};

    for (const key in changeDict) {
      if (changeDict[key] !== originShareStatus[key]) {
        updateDict[key] = changeDict[key];
      }
    }
    return updateDict;
  }

  /**
   * 检查用户操作后，是否与原来
   * @param that
   * @returns {boolean}
   */
  checkHasChange() {
    for (const key in this.checkChangeDict()) {
      return true;
    }
    return false;
  }

  render() {
    const { getFieldProps } = this.props.form;
    const that = this;

    console.log(this.state.changeDict);

    return (
      <div>
        <NavBar
          title="INITIATING_DEVICE_SHARING"
          leftButton={<BackButton />}
          rightButton={this.button}
        />
        <MenuPage>
          <Scroll bounce>
            <WhiteSpace />
            <List className="my-list">
              {
                this.getOwnerDevices().map((item, index) => {
                  return (
                    <Item
                      key={item.did}
                      extra={<Switch
                        {...getFieldProps(item.mac, {
                          initialValue: this.state.originShareStatus[item.did],
                          valuePropName: 'checked',
                        })}
                        onClick={(checked) => {
                          const changeDict = {
                            ...that.state.changeDict,
                          };
                          changeDict[item.did] = checked;
                          that.setState({ changeDict });
                        }}
                      />}
                    >{item.name}</Item>
                  );
                })
              }
              <WhiteSpace style={{ height: '1.1rem' }} />
            </List>
          </Scroll>
          <Button
            style={styles.btn}
            className="btn"
            type="primary"
            disabled={!this.checkHasChange(this)}
            onClick={this.submitChange.bind(this)}
          ><FormattedMessage id="IDENTIFY_SHARING" />{this.getUserName()}</Button>
        </MenuPage>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    shareState: state.shareState,
    deviceList: state.deviceList,
    language: state.language,
  };
}

const ToShareUserDeviceListForm = createForm()(ToShareUserDeviceList);
export default connect(mapStateToProps)(ToShareUserDeviceListForm);
