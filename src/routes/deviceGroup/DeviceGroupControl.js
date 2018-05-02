import React, { Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import EditGroupButton from '../../containers/MenuButton/EditGroupButton';
import MenuPage from '../../components/MenuPage';
import GroupHead from '../../components/DeviceGroupList/GroupHead';
import GroupDeviceItem from '../../components/DeviceGroupList/GroupDeviceItem';
import { SwipeAction, List } from 'antd-mobile';

//获取产品信息
import { getItemForPk } from '../../utils/configExpand';

const styles = {
  groupHead: {
    marginTop: '0.4rem',
  },
  groupList: {
    marginTop: '0.4rem',
  },
  groupListItemBox: {
    marginBottom: '0.05rem',
  }
}

class DeviceGroupControl extends Component {
  constructor(props){
    super(props);
    this.state = {};
    
    this.changeSwitch = this.changeSwitch.bind(this);
    this.controlGroup = this.controlGroup.bind(this);
  }
  componentWillMount() {
    const { data } = this.props.deviceGroup;
    const deviceList = this.props.deviceList.data;
    const { gid } = this.props.params;
    data.forEach((item) => {
      if(item.id == gid){
        //更新设备在线状态
        let groupIsOnline = false;
        item.devices.forEach((groupDeviceItem,index) => {
          deviceList.forEach((deviceItem) => {
            if(deviceItem.did == groupDeviceItem.did){
              groupDeviceItem.netStatus = deviceItem.netStatus;
              //如至少一个设备在线则显示分组在线
              if(groupDeviceItem.netStatus == 2){
                groupIsOnline = true;
              }
            }
          })
        })
        this.setState({
          group: item,
          groupIsOnline,
        })
      }
    })
  }

  //改变开关状态
  changeSwitch(did) {
    const { dispatch,deviceData } = this.props;
    const { power } = deviceData[did].data;
    const deviceList = this.props.deviceList.data;
    
    let device = {};
    deviceList.forEach((item) => {
      if(item.did == did){
        device = item;
      }
    })

    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        device,
        data: {
          power: !power,
        }
      }
    })
  }

  controlGroup(value) {
    const { group } = this.state;
    // const deviceList = this.props.deviceList.data;
    const { dispatch } = this.props;
    // group.devices.forEach((groupDeviceItem) => {
    //   deviceList.forEach((deviceItem) => {
    //     if(groupDeviceItem.did == deviceItem.did && deviceItem.netStatus == 2) {
    //       console.log(deviceItem,'deviceItem');
    //       //判断开或关
    //       if(value == 'on'){
    //         dispatch({
    //           type: 'gizwitsSdk/sendCmd',
    //           payload: {
    //             deviceItem,
    //             data: {
    //               power: true,
    //             }
    //           }
    //         })
    //       }else if(value == 'off'){
    //         dispatch({
    //           type: 'gizwitsSdk/sendCmd',
    //           payload: {
    //             deviceItem,
    //             data: {
    //               power: false,
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // })
    if(value == 'on'){
      dispatch({
        type: 'gizwitsSdk/sendCmdToGroup',
        payload: {
          group,
          data: {
            power: true,
          }
        }
      })
    }else if(value == 'off'){
      dispatch({
        type: 'gizwitsSdk/sendCmdToGroup',
        payload: {
          group,
          data: {
            power: false,
          }
        }
      })
    }
  }

  render() {
    const { group,groupIsOnline } = this.state;
    const { deviceData,language } = this.props;
    const PK = group.product_key;
    const item = getItemForPk(PK);
    const productName = item[`${language.key}_name`] || item[`name`];
    return (
      <div>
        <NavBar
          title="DEVICE_GROUP_CONTROL"
          leftButton={<BackButton />}
          rightButton={<EditGroupButton gid={group.id} />}
        />
        <MenuPage theme="dark" hasTab>
          <div style={styles.groupHead}>
            {
              //根据分组是否在线判断总开关显示与否
              groupIsOnline ? 
              <GroupHead iconImg={item.icon} groupName={group.group_name} productName={productName} isOffLine={!groupIsOnline} onSwitchChange={this.controlGroup} />
               : 
              <GroupHead iconImg={item.icon} groupName={group.group_name} productName={productName} isOffLine={!groupIsOnline} />
            }
          </div>
          <div style={styles.groupList}>
            {
              group.devices.map((item,index) => {
                if(deviceData[item.did]){
                  return (
                    <div style={styles.groupListItemBox} key={item.did}>
                      {/* deviceStateName="室内温度" deviceState="25℃"*/}
                      <GroupDeviceItem deviceName={item.dev_alias} isOffLine={item.netStatus == 2 ? false : true} power={deviceData[item.did].data.power} onSwitchChange={this.changeSwitch.bind(null,item.did)} />
                    </div>
                  )
                }else{
                  return (
                    <div style={styles.groupListItemBox} key={item.did}>
                      {/* deviceStateName="室内温度" deviceState="25℃"*/}
                      <GroupDeviceItem deviceName={item.dev_alias} isOffLine={item.netStatus == 2 ? false : true} />
                    </div>
                  )
                }
              })
            }
          </div>
        </MenuPage>
      </div>
    );
  }
}

DeviceGroupControl.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceGroup: state.deviceGroup,
    deviceList: state.deviceList,
    deviceData: state.deviceData,
  };
}


export default connect(mapStateToProps)(DeviceGroupControl);
