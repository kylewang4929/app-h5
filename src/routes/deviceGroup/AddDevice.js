import React, { Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import MenuPage from '../../components/MenuPage';
import DeviceItem from '../../components/DeviceGroupList/DeviceItem';
import { Button } from 'antd-mobile';
import router from '../../utils/router';
import { FormattedMessage } from 'react-intl';

import { getItemForPk } from '../../utils/configExpand';

const styles = {
  groupHead: {
    marginTop: '0.4rem',
  },
  deviceList: {
    marginTop: '0.4rem',
  },
  deviceItem: {
  },
  comfirmButton: {
    background: '#00C3FF',
    color: '#fff',
    position: 'absolute',
    bottom: '0',
    width: '100%',
    borderRadius: '0',
    border: 'none',
  }
}

class AddDevice extends Component {
  constructor(props){
    super(props);
    this.state = {
      canSave: true,
    }

    this.changeState = this.changeState.bind(this);
    this.comfirm = this.comfirm.bind(this);
  }

  componentWillMount() {
    // 查询所有已绑定设备
    let deviceList = this.props.deviceList.data;

    const { tempData } = this.props.deviceGroup;
    const { gid } = this.props.params;
     //根据GID获取对应group
    let PK = '';
    let currentGroupItem = {};
    let groupItemIndex = 0;
    tempData.forEach((groupItem,index) => {
      if(groupItem.id == gid){
        PK = groupItem.product_key;
        currentGroupItem = groupItem;
        groupItemIndex = index;
      }
    })
    const item = getItemForPk(PK);

    let deviceData = [];
    //根据PK获取对应设备
    deviceList.map((deviceItem) => {
      if(deviceItem.productKey == PK){
        deviceData.push(deviceItem);
      }
    })

    //创建设备状态数组,获取对应group的索引
    let deviceStates = [];
    let has = false;
    let tempObj = {};
    deviceData.forEach((deviceItem) => {
      has = false;
      currentGroupItem.devices.forEach((groupDeviceItem,index) => {
        if(deviceItem.did == groupDeviceItem.did){
          tempObj = {
            device: deviceItem,
            selected: true,
          };
          deviceStates.push(tempObj);
          has = true;
        }
      })
      if(!has){
        tempObj = {
          device: deviceItem,
          selected: false,
        };
        deviceStates.push(tempObj);
      }
    })

    this.setState({
      item,
      deviceData,
      group: currentGroupItem,
      deviceStates,
      groupItemIndex,
    })
    
    
  }

  //选择事件、如无设备被选择则不能保存
  changeState(index) {
    let { deviceStates } = this.state;
    deviceStates[index].selected = !deviceStates[index].selected;
    let canSave = false;
    deviceStates.forEach((item) => {
      if(item.selected){
        canSave = true;
      }
    })
    this.setState({
      deviceStates,
      canSave,
    })
  }

  comfirm() {
    const { deviceStates,groupItemIndex,item,canSave } = this.state;
    if(canSave){
      const { tempData } = this.props.deviceGroup;
      const { dispatch } = this.props;
      const { gid } = this.props.params;
      let finalGroup = [];
      deviceStates.forEach((deviceItem) => {
        let tempObj = {};
        if(deviceItem.selected){
          tempObj.dev_alias = deviceItem.device.name;
          tempObj.did = deviceItem.device.did;
          tempObj.product_key = deviceItem.device.productKey;
          tempObj.type = "normal";
          tempObj.verbose_name = item.name;
          finalGroup.push(tempObj);
        }
      })
      tempData[groupItemIndex].devices = finalGroup;
      dispatch({
        type: 'deviceGroup/updateTemp',
        payload: tempData,
      })
      router.goBack(-1);
    }
  }

  render() {
    const { group, item, deviceStates,canSave } = this.state;
    return (
      <div>
        <NavBar
          title="ADD_DEVICE"
          leftButton={<BackButton />} 
        />
        <MenuPage theme="dark" hasTab>
          <div style={styles.deviceList}>
            {
              deviceStates.map((deviceItem,index) => {
                return (
                  <div style={styles.deviceItem} key={index} onClick={this.changeState.bind(null,index)}>
                    <DeviceItem iconImg={item.icon} deviceName={deviceItem.device.name} isChecked={deviceItem.selected} />
                  </div>
                )
              })
            }
          </div>
          <Button style={{...styles.comfirmButton,...(canSave ? {backgroundColor: '#00C3FF'} : {backgroundColor: '#9F9F9F'})}} onClick={this.comfirm}>
            <FormattedMessage id="CONFIRM" />
          </Button>
        </MenuPage>
      </div>
    );
  }
}

AddDevice.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceGroup: state.deviceGroup,
    deviceList: state.deviceList,
  };
}


export default connect(mapStateToProps)(AddDevice);
