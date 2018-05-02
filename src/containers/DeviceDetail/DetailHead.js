import React, { Component } from 'react';
import { Switch, Modal } from 'antd-mobile';
import SvgRing from '../../components/SvgRing';

const styles = {
  container: {
    backgroundColor: '#fff',
    margin: '.2rem 0',
    position: 'relative',
  },
  icon: {
    fontSize: '0.44rem',
    color: '#00bca8',
    position: 'absolute',
    right: '.1rem',
    top: '.14rem',
  },
  rw: {
    boxSizing: 'border-box',
    padding: '.3rem .2rem',
    fontSize: '.28rem',
    color: 'black',
    position: 'absolute',
    paddingLeft: '310px',
    top: '0',
    left: '0',
    width: '100%',
  },
  ri: {
    padding: '.22rem 0',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rn: {
    color: '#767676',
    marginRight: '.2rem',
  },
  rt: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

class DetailHead extends Component {

  onSwitch = (device, checked) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        device,
        data: {
          Fan_Switch: checked,
        },
      },
    });
  }
  onRename = () => {
    Modal.prompt('重命名', null,
      [
      { text: '取消' },
        {
          text: '确认',
          onPress: (alias) => {
            const { dispatch, device } = this.props;
            dispatch({
              type: 'gizwitsSdk/setCustomInfo',
              payload: { device, alias },
            });
          },
        },
      ], 'default', null, ['请输入新名称']);
  }
  onRemark = () => {
    Modal.prompt('修改备注', null,
      [
      { text: '取消' },
        {
          text: '确认',
          onPress: (remark) => {
            const { dispatch, device } = this.props;
            dispatch({
              type: 'gizwitsSdk/setCustomInfo',
              payload: { device, remark },
            });
          },
        },
      ], 'default', null, ['请输入新备注']);
  }
  render() {
    const { device, did, deviceData } = this.props;
    const { Oil_Tatal = 100, Oil_Remain = 0 } = deviceData[did].data;
    const present = (Oil_Remain / Oil_Tatal).toFixed(2);
    console.log(present);
    return (
      <div style={styles.container}>
        <SvgRing
          present={present}
          centerText={'精油余量'}
          innerRadius={120}
          outerRadius={35}
        />
        <div style={styles.rw}>
          <div style={styles.ri}>
            <span style={styles.rn}>设备名称</span>
            <span style={styles.rt}>{device.name}</span>
            <span className="mdi mdi-pencil-box-outline" style={styles.icon} onClick={this.onRename} />
          </div>
          <div style={styles.ri}>
            <span style={styles.rn}>备注</span>
            <span style={styles.rt}>{device.remark}</span>
            <span className="mdi mdi-pencil-box-outline" style={styles.icon} onClick={this.onRemark} />
          </div>
          <div style={styles.ri}>
            <span style={styles.rn}>风扇开关</span>
            <Switch
              style={styles.icon}
              checked={deviceData[did].data.Fan_Switch}
              onChange={checked => this.onSwitch(device, checked)}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default DetailHead;
