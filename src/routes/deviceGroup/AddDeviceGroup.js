import React from 'react';
import { connect } from 'dva';
import { List, Switch, WhiteSpace, Button } from 'antd-mobile';

import Toast from '../../utils/Toast';
import BackButton from '../../containers/MenuButton/BackButton';
import { Prompt } from '../../components/Modal';
import { getLanguageString } from '../../utils/getLanguage';
import NavBar from '../../containers/NavBar';
import router from '../../utils/router';
import MenuPage from '../../components/MenuPage';
import InfoAlert from '../../components/InfoAlert';

const Item = List.Item;

const styles = {
  btn: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    lineHeight: '1.1rem',
    height: '1.1rem',
    border: 'none',
    borderRadius: '0px',
  },
  hide: {
    display: 'none',
  },
};

class AddDeviceGroup extends React.Component {

  state = {
    selectMap: {},
    showPrompt: false,
  };

  componentDidMount() {
    const { dispatch, params } = this.props;

    if (params.type === 'edit') {
      // 查询分组信息
      dispatch({
        type: 'deviceGroup/query',
        payload: {
          success: (data) => {
            this.getBindDevice(data);
          },
          error: () => {},
        },
      });
    }
  }

  // 过滤出当前分组下的设备dids
  getBindDevice = (deviceGroup) => {
    const { params } = this.props;
    const { gid } = params;
    let dids = {};
    deviceGroup.map((item) => {
      if (item.id === gid) {
        item.devices.map((deviceItem) => {
          dids[deviceItem.did] = true;
        });
      }
    });
    this.setState({
      selectMap: dids,
    });
  }

  getDeviceArrayByPk(pk) {
    const { data } = this.props.deviceList;

    const deviceArray = [];
    for (const device of data) {
      if (device.productKey === pk) {
        deviceArray.push(device);
      }
    }
    return deviceArray;
  }

  getSwitchButton(item) {
    const that = this;
    return (<Switch
      checked={that.state.selectMap[item.did]}
      onClick={(checked) => {
        const selectMap = {
          ...that.state.selectMap,
        };
        selectMap[item.did] = checked;
        that.setState({ selectMap });
      }}
    />);
  }

  checkHasSelected() {
    const { selectMap } = this.state;
    for (const key in selectMap) {
      if (selectMap[key]) {
        return true;
      }
    }
    return false;
  }

  modalOnCancel() {
    this.setState({
      showPrompt: false,
    });
  }

  modalOnConfirm(value) {
    // 获取需要分享的设备
    // 调用接口
    const { language } = this.props;
    const { selectMap } = this.state;
    const { dispatch, params } = this.props;

    const THE_NAME_CANNOT_BE_EMPTY = getLanguageString(language.key, 'THE_NAME_CANNOT_BE_EMPTY');
    const LOADING = getLanguageString(language.key, 'LOADING');

    if (value === '' || value === undefined) {
      InfoAlert.show(THE_NAME_CANNOT_BE_EMPTY, 'error', 3000);
      return;
    }
    Toast.loading(LOADING, 0);

    const dids = [];
    for (const key in selectMap) {
      if (selectMap[key]) {
        dids.push(key);
      }
    }

    dispatch({
      type: 'deviceGroup/createAndAddDevice',
      payload: {
        dids,
        productKey: params.productKey,
        groupName: value,
        success: (data) => {
          this.setState({
            showPrompt: false,
          });
          // 跳转到列表页面
          Toast.hide();
          router.go('#/menu/mainPage', []);
        },
        error: (err) => {
          const { language } = this.props;
          const GROUP_NAMES_ALREADY_EXIST = getLanguageString(language.key, 'GROUP_NAMES_ALREADY_EXIST');
          const CREATE_GROUP_FAILURE = getLanguageString(language.key, 'CREATE_GROUP_FAILURE');
          const CANNOT_USE_SPECIAL_CHARACTERS = getLanguageString(language.key, 'CANNOT_USE_SPECIAL_CHARACTERS');
          Toast.hide();
          if (err.error_code === 9206) {
            // 分组名称重复
            InfoAlert.show(GROUP_NAMES_ALREADY_EXIST, 'error', 3000);
            return;
          }
          if (err.error_code === 9015 && err.detail_message.group_name) {
            InfoAlert.show(CANNOT_USE_SPECIAL_CHARACTERS, 'error', 3000);
            return;
          }
          InfoAlert.show(CREATE_GROUP_FAILURE, 'error', 3000);
        },
      },
    });
  }

  createGroup = () => {
    const { params, language } = this.props;
    const { gid, type } = params;

    const FAILED_TO_ADD_DEVICE_TO_GROUP = getLanguageString(language.key, 'FAILED_TO_ADD_DEVICE_TO_GROUP');

    if (type === 'edit') {
      // 编辑模式 获取选中的设备，更新到分组
      const { selectMap } = this.state;
      const { dispatch } = this.props;

      const dids = [];
      for (const key in selectMap) {
        if (selectMap[key]) {
          dids.push(key);
        }
      }

      dispatch({
        type: 'deviceGroup/updateGroupDevices',
        payload: {
          dids,
          gid,
          success: () => {
            router.goBack(-1);
          },
          error: () => {
            InfoAlert.show(FAILED_TO_ADD_DEVICE_TO_GROUP, 'success', 2000);
          },
        },
      });
    } else {
      // 添加模式
      this.setState({ showPrompt: true });
    }
  }

  render() {
    const { params, language } = this.props;
    const { productKey, type } = params;
    const deviceArray = this.getDeviceArrayByPk(productKey);
    const { showPrompt } = this.state;

    const SET_GROUPING_NAMES = getLanguageString(language.key, 'SET_GROUPING_NAMES');
    const PLEASE_ENTER_THE_GROUP_NAME = getLanguageString(language.key, 'PLEASE_ENTER_THE_GROUP_NAME');
    const ADD_DEVICE_TO_GROUP = getLanguageString(language.key, 'ADD_DEVICE_TO_GROUP');
    const CREATE_GROUP = getLanguageString(language.key, 'CREATE_GROUP');
    const GROUP = getLanguageString(language.key, 'GROUP');

    return (
      <div>
        <NavBar
          title="SELECT_DEVICE"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <WhiteSpace />
          <List className="my-list">
            {
              deviceArray.map((item) => {
                return (
                  <Item
                    key={item.mac}
                    extra={this.getSwitchButton(item)}
                  >{item.name}</Item>
                );
              })
            }
          </List>
          <Button
            style={styles.btn}
            className="btn"
            type="primary"
            disabled={!this.checkHasSelected()}
            onClick={this.createGroup}
          >
            {
              type === 'edit' ? ADD_DEVICE_TO_GROUP : CREATE_GROUP
            }
          </Button>
          <Prompt
            isShow={showPrompt}
            value={GROUP}
            title={SET_GROUPING_NAMES}
            placeholder={PLEASE_ENTER_THE_GROUP_NAME}
            onClose={this.modalOnCancel.bind(this)}
            onConfirm={this.modalOnConfirm.bind(this)}
          />
        </MenuPage>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    deviceGroup: state.deviceGroup,
    language: state.language,
  };
}

export default connect(mapStateToProps)(AddDeviceGroup);
