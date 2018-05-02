import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import MenuPage from '../../components/MenuPage';
import DeviceItem from '../../components/DeviceGroupList/DeviceItem';
import Scroll from '../../components/Scroll';

import router from '../../utils/router';

import { getItemForPk } from '../../utils/configExpand';

const styles = {
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
  },
};

class SelectDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSave: false,
    }
    
    this.onSelect = this.onSelect.bind(this);
    this.comfirm = this.comfirm.bind(this);
  }
  componentWillMount() {
    //根据PK获取对应设备
    const deviceList = this.props.deviceList.data;
    const { pk } = this.props.params;
    const productDetail = getItemForPk(pk);

    let deviceState = [];
    deviceList.map((item) => {
      if(item.productKey == pk){
        let tempObj = {};
        tempObj.device = item;
        tempObj.isSelected = false;
        deviceState.push(tempObj);
      }
    })
    this.setState({
      deviceState,
      productDetail,
    })
  }

  //选择设备
  onSelect(did) {
    let { deviceState } = this.state;
    let hasSelected = false;
    deviceState.forEach((item) => {
      if(item.device.did == did){
        item.isSelected = !item.isSelected;
      }
    })
    //判断是否有设备被选中、如选中则确认按钮高亮
    deviceState.forEach((item) => {
      if(item.isSelected){
        hasSelected = true;
      }
    })
    this.setState({
      deviceState,
      canSave: hasSelected,
    })
  }

  //确认事件
  comfirm() {
    const { deviceState,productDetail,canSave } = this.state;
    if(canSave){
      const { dispatch } = this.props;
      const { pk } = this.props.params;
  
      //新建临时分组
      let finalArr = [];
      deviceState.forEach((item) => {
        if(item.isSelected){
          let tempObj = {};
          tempObj.dev_alias = item.device.name;
          tempObj.did = item.device.did;
          tempObj.product_key = item.device.productKey;
          tempObj.type = "normal";
          tempObj.verbose_name = productDetail.name;
          finalArr.push(tempObj);
        }
      })
      let tempGroup = {};
      const timeStamp = (new Date()).getTime();
      tempGroup.devices = finalArr;
      tempGroup.group_name = '';
      tempGroup.id = timeStamp;
      tempGroup.productKey = pk;
      tempGroup.product_key = pk;
      tempGroup.verbose_name = productDetail.name;
  
      let tempGroupList = [];
      tempGroupList.push(tempGroup);
      //更新至model
      dispatch({
        type: 'deviceGroup/updateTemp',
        payload: tempGroupList,
      })
      
      router.go(`#/menu/createDeviceGroup/${timeStamp}`);
    }
  }

  render() {
    const { deviceState,canSave } = this.state;
    const { tempData } = this.props.deviceGroup;
    return (
      <div>
        <NavBar
          title="SELECT_DEVICE"
          leftButton={<BackButton />} 
        />
        <MenuPage theme="dark" hasTab>
          <Scroll bounce>
            <div>
              {
                deviceState.map((item,index) => {
                  let icon = getItemForPk(item.device.productKey).icon;
                  return (
                    <div style={styles.deviceItem} key={index} onClick={this.onSelect.bind(null,item.device.did)} >
                      <DeviceItem iconImg={icon} deviceName={item.device.name} isChecked={item.isSelected} />
                    </div>
                  )
                })
              }
            </div>
            <div style={{ height: '1rem' }} />
          </Scroll>
          <Button style={{...styles.comfirmButton,...(canSave ? {backgroundColor: '#00C3FF'} : {backgroundColor: '#9F9F9F'})}} onClick={this.comfirm}>
            <FormattedMessage id="CONFIRM" />
          </Button>
        </MenuPage>
      </div>
    );
  }
}

SelectDevice.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceList: state.deviceList,
    deviceGroup: state.deviceGroup,
  };
}


export default connect(mapStateToProps)(SelectDevice);
