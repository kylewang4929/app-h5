import React, { Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import SaveGroupButton from '../../containers/MenuButton/SaveGroupButton';
import MenuPage from '../../components/MenuPage';
import EditGroupHead from '../../components/DeviceGroupList/EditGroupHead';
import EditGroupItem from '../../components/DeviceGroupList/EditGroupItem';
import router from '../../utils/router';
import MyToast from '../../utils/Toast';

import { getItemForPk } from '../../utils/configExpand';
import { getLanguageString } from '../../utils/getLanguage';

const addImg = require('../../assets/add.png');

const styles = {
  EditGroupHead: {
    marginTop: '0.4rem',
  },
  groupList: {
    marginTop: '0.4rem',
  },
  groupListItemBox: {
    marginBottom: '0.05rem',
  },
  addBox: {
		overflow: 'hidden',
		width: '100%',
		height: '1.5rem',
    backgroundColor: '#fff',
    position: 'relative',
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
  },
};

class CreateDeviceGroup extends Component {
  constructor(props){
    super(props);
    this.state = {
      canSave: false,
    }

    this.deleteDevice = this.deleteDevice.bind(this);
    this.onGroupNameChange = this.onGroupNameChange.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    const { tempData } = this.props.deviceGroup;
    const { gid } = this.props.params;
    tempData.forEach((item,index) => {
      if(item.id == gid){
        this.setState({
          group: item,
          groupIndex: index,
        })
      }
    })
  }

  //更改分组名字
  onGroupNameChange(value) {
    if(value == ''){
      this.setState({
        canSave: false,
      })
    }else{
      this.setState({
        canSave: true,
      })
      //更新至临时model
      const { dispatch } = this.props;
      let { tempData } = this.props.deviceGroup;
      let { group, groupIndex } = this.state;
      group.group_name = value;
      tempData[groupIndex] = group;
      dispatch({
        type: 'deviceGroup/updateTemp',
        payload: tempData,
      });
    }
  }

  goAddDevice(gid) {
    router.go(`#/menu/addDevice/${gid}`);
  }

  // 删除设备
  deleteDevice(did) {
    const { dispatch } = this.props;
    let { tempData } = this.props.deviceGroup;
    let { group, groupIndex } = this.state;
    //根据did删除对应设备
    group.devices.forEach((item,index) => {
      if(item.did == did){
        group.devices.splice(index,1);
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
  }

  // 保存更改
  save() {
    const { canSave,group } = this.state;
    const { language } = this.props;
    if (canSave) {
      const { dispatch } = this.props;
      const { tempData } = this.props.deviceGroup;
      let dids = [];
      group.devices.map((item) => {
        dids.push(item.did);
      });
      dispatch({
        type: 'deviceGroup/createAndAddDevice',
        payload: {
          dids,
          productKey: group.productKey,
          groupName: group.group_name,
          success: () => {
            router.goBack(-3);
          },
          error: (error) => {
            console.log(error);
          }
        },
      });
      router.goBack(-3);
    } else {
      // 提示没有输入名称 目前只有这一种情况
      const PLEASE_ENTER_THE_GROUP_NAME_TIPS = getLanguageString(language.key, 'PLEASE_ENTER_THE_GROUP_NAME_TIPS');
      MyToast.info(PLEASE_ENTER_THE_GROUP_NAME_TIPS, 2);
    }
  }

  render() {
    const { group } = this.state;
    const { language } = this.props;
    const PK = group.product_key;
    const item = getItemForPk(PK);
    return (
      <div>
        <NavBar
          title="EDIT_DEVICE_GROUP"
          leftButton={<BackButton />} 
          rightButton={<SaveGroupButton onClick={this.save} />}
        />
        <MenuPage theme="dark" hasTab>
          <div style={styles.EditGroupHead}>
            <EditGroupHead iconImg={item.icon} groupName={group.group_name} productName={item.name} onChange={this.onGroupNameChange}/>
          </div>
          <div style={styles.groupList}>
            <div style={styles.groupListItemBox}>
              <div style={styles.addBox} onClick={this.goAddDevice.bind(null,group.id)}>
                <div style={styles.leftBox}>
                  添加设备
                </div>
                <div style={styles.rightBox}>
                  <img src={addImg} alt="" style={styles.addImg}/>
                </div>
              </div>
            </div>
            {
              group.devices.map((item,index) => {
                return (
                  <div style={styles.groupListItemBox} key={index}>
                    <EditGroupItem deviceName={item.dev_alias} did={item.did} onDelete={this.deleteDevice} language={language}/>
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

CreateDeviceGroup.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceGroup: state.deviceGroup,
  };
}

export default connect(mapStateToProps)(CreateDeviceGroup);
