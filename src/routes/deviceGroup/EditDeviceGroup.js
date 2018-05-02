import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'antd-mobile';

import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import SaveGroupButton from '../../containers/MenuButton/SaveGroupButton';
import MenuPage from '../../components/MenuPage';
import InfoAlert from '../../components/InfoAlert';
import EditGroupHead from '../../components/DeviceGroupList/EditGroupHead';
import EditGroupItem from '../../components/DeviceGroupList/EditGroupItem';
import router from '../../utils/router';
import MyToast from '../../utils/Toast';
import { getLanguageString } from '../../utils/getLanguage';

import { getItemForPk } from '../../utils/configExpand';

const addImg = require('../../assets/add.png');

const styles = {
  EditGroupHead: {
    marginTop: '0.4rem',
  },
  groupList: {
    marginTop: '0.4rem',
  },
  groupListItemBox: {
  },
  addBox: {
    overflow: 'hidden',
    width: '100%',
    height: '1.5rem',
    backgroundColor: '#fff',
    position: 'relative',
    border: '0.02rem solid rgba(0,0,0,0.04)',
  },
  leftBox: {
    float: 'left',
    width: '2rem',
    overflow: 'hidden',
    height: '1.5rem',
    lineHeight: '1.5rem',
    paddingLeft: '0.5rem',
    fontSize: '0.32rem',
    fontWeight: 'bold',
  },
  rightBox: {
    float: 'right',
    overflow: 'hidden',
    height: '1.5rem',
    paddingRight: '0.4rem',
    position: 'relative',
    width: '0.6rem',
  },
  addImg: {
    position: 'absolute',
    width: '0.6rem',
    height: '0.6rem',
    top: '50%',
    left: '50%',
    marginLeft: '-0.3rem',
    marginTop: '-0.3rem',
  }
}

class EditDeviceGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSave: true,
      showToast: false,
    }

    this.deleteDevice = this.deleteDevice.bind(this);
    this.onGroupNameChange = this.onGroupNameChange.bind(this);
    this.save = this.save.bind(this);
    this.onClose = this.onClose.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentWillMount() {
    const { tempData } = this.props.deviceGroup;
    const { gid } = this.props.params;
    tempData.forEach((item, index) => {
      if (item.id == gid) {
        this.setState({
          group: item,
          groupIndex: index,
        })
      }
    })
  }

  //更改分组名字
  onGroupNameChange(value) {
    if (value == '') {
      this.setState({
        canSave: false,
      })
    } else {
      this.setState({
        canSave: true,
      })
      //更新至临时model
      const { dispatch } = this.props;
      let { tempData } = this.props.deviceGroup;
      let { group, groupIndex } = this.state;
      group.group_name = value;
      //保存至state及model
      this.setState({
        group,
      })
      tempData[groupIndex] = group;
      dispatch({
        type: 'deviceGroup/updateTemp',
        payload: tempData,
      })
    }
  }

  goAddDevice(gid) {
    router.go(`#/menu/addDevice/${gid}`);
  }

  //删除设备
  deleteDevice(did) {
    let { tempData } = this.props.deviceGroup;
    let { group, groupIndex } = this.state;
    if (group.devices.length > 1) {
      const { dispatch } = this.props;
      //根据did删除对应设备
      group.devices.forEach((item, index) => {
        if (item.did == did) {
          group.devices.splice(index, 1);
        }
      })
      this.setState({
        group: group,
      })
      //更新group
      tempData[groupIndex] = group;
      dispatch({
        type: 'deviceGroup/updateTemp',
        payload: tempData,
      })
    } else if (group.devices.length == 1) {
      this.showModal();
    }
  }

  //保存更改
  save() {
    const { canSave, group } = this.state;
    if (canSave) {
      const { dispatch } = this.props;
      const { tempData } = this.props.deviceGroup;
      const { gid } = this.props.params;
      let dids = [];
      group.devices.map((item) => {
        dids.push(item.did);
      });

      const { language } = this.props;
      const LOADING = getLanguageString(language.key, 'LOADING');
      const SELECT_AT_LEAST_ONE_DEVICE = getLanguageString(language.key, 'SELECT_AT_LEAST_ONE_DEVICE');
      
      if (dids.length > 0) {
        // 发送更新请求
        MyToast.loading(LOADING, 0);
        dispatch({
          type: 'deviceGroup/updateGroupDevices',
          payload: {
            dids,
            gid,
            success: function () {
              // 更新名字
              dispatch({
                type: 'deviceGroup/rename',
                payload: {
                  id: gid,
                  name: group.group_name,
                },
              });
              MyToast.hide();
              router.goBack(-1);
            },
          },
        });
        // 更新至正式数据
        dispatch({
          type: 'deviceGroup/update',
          payload: tempData,
        });
      } else {
        // 只更新名字
        // dispatch({
        //   type: 'deviceGroup/rename',
        //   payload: {
        //     id: gid,
        //     name: group.group_name,
        //   },
        // });
        // router.goBack(-1);
        InfoAlert.show(SELECT_AT_LEAST_ONE_DEVICE, 'error', 2000);
      }
    }
  }

  // 关闭弹出层
  onClose() {
    this.setState({
      showToast: false,
    })
  }

  //显示弹出层
  showModal() {
    this.setState({
      showToast: true,
    })
  }

  render() {
    const { group, canSave, showToast } = this.state;
    const { language } = this.props;
    const PK = group.product_key;
    const item = getItemForPk(PK);
    const productName = item[`${language.key}_name`] || item[`name`];
    //翻译提示文字
    const tips = getLanguageString(language.key, "TIPS");
    const confirmText = getLanguageString(language.key, "CONFIRM");

    return (
      <div>
        <NavBar
          title="EDIT_DEVICE_GROUP"
          leftButton={<BackButton />}
          rightButton={<SaveGroupButton canSave={canSave} onClick={this.save} />}
        />
        <MenuPage theme="dark" hasTab>
          <div style={styles.EditGroupHead}>
            <EditGroupHead iconImg={item.icon} groupName={group.group_name} productName={productName} onChange={this.onGroupNameChange} />
          </div>
          <Modal
            title={tips}
            transparent
            maskClosable={true}
            visible={showToast}
            onClose={this.onClose}
            footer={[{ text: confirmText, onPress: this.onClose }]}
            platform="ios"
          >
            <FormattedMessage id="KEEP_AT_LEAST_ONE_DEVICE" /><br />
          </Modal>
          <div style={styles.groupList}>
            <div style={styles.groupListItemBox}>
              <div style={styles.addBox} onClick={this.goAddDevice.bind(null, group.id)}>
                <div style={styles.leftBox}>
                  <FormattedMessage id="ADD_DEVICE" />
                </div>
                <div style={styles.rightBox}>
                  <img src={addImg} alt="" style={styles.addImg} />
                </div>
              </div>
            </div>
            {
              group.devices.map((item, index) => {
                return (
                  <div style={styles.groupListItemBox} key={index}>
                    <EditGroupItem language={language} deviceName={item.dev_alias} did={item.did} onDelete={this.deleteDevice} />
                  </div>
                )
              })
            }
          </div>
        </MenuPage>
      </div>
    );
  }
}

EditDeviceGroup.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceGroup: state.deviceGroup,
  };
}

export default connect(mapStateToProps)(EditDeviceGroup);
