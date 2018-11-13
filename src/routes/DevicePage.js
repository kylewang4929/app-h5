import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import DeviceItem from '../components/DeviceDashboard/Item';
import Timing from '../components/DeviceDashboard/Timing';

import router from '../utils/router';
import BackButton from '../containers/MenuButton/BackButton';
import DeviceMoreButton from '../containers/MenuButton/DeviceMoreButton';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
  },
  buttonBox: {
    position: 'absolute',
    bottom: '0rem',
    left: '0px',
    width: '100%',
    padding: '0.1rem',
    boxSizing: 'border-box',
  },
  button: {
    border: 'none',
    backgroundColor: 'rgb(128, 199, 232)',
    color: '#fff',
  },
};
class DevicePage extends Component {
  goToMore = () => {
    const { params } = this.props;
    const { did, productKey, mac } = params;
    router.go(`#/menu/deviceMore/${productKey}/${mac}/${did}`);
  }
  parseValue = (value) => {
    value = value.toString(16);
    // 补够4位
    let newValue = value;
    for (let i = 0; i < 4 - value.length; i++) {
      newValue = `0${newValue}`;
    }
    const string = [];
    for (let i = 0; i < newValue.length; i += 2) {
      string.push(parseInt(`${newValue[i]}${newValue[i + 1]}`, 16));
    }
    return new Array(2 - string.length).fill(0).concat(string);
  }
  onDelete = (data) => {
    const { dispatch, params: { did }, deviceData } = this.props;
    let { Cook_Para, Cookstage_Para, Settemp_Para, Settime_Para } = deviceData[did].data;
    Cook_Para.splice(data.index, 4);

    const fillData = this.parseValue(Settemp_Para).concat(this.parseValue(Settime_Para));

    Cook_Para = fillData.concat(Cook_Para);
    // Cookstage_Para -= 1;
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        data: { Cookstage_Para, Cook_Para },
      },
    });
  }
  onAdd = () => {
    const { params: { did, productKey, mac } } = this.props;
    router.go(`#/menu/setTiming/${productKey}/${mac}/${did}`);
  }
  toggle = () => {
    const { dispatch, params: { did }, deviceData } = this.props;
    const { Start_Pause_Flag: flag } = deviceData[did].data;
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        data: { Start_Pause_Flag: !flag },
      },
    });
  }
  render() {
    const { deviceList: { data }, dispatch, params: { did }, deviceData } = this.props;
    const device = data.find(v => v.did === did);
    const { Start_Pause_Flag: flag } = deviceData[did].data;
    return (
      <div>
        <NavBar
          title={device.name}
          leftButton={<BackButton />}
          rightButton={<DeviceMoreButton onClick={this.goToMore} />}
        />
        <MenuPage theme="dark">
          <DeviceItem data={device} />
          <Timing onAdd={this.onAdd} onDelete={this.onDelete} deviceData={deviceData[did]} did={did} />
          <div style={styles.buttonBox}>
            <Button style={styles.button} onClick={this.toggle}>
              {
              flag ? <FormattedMessage id="PAUSE" /> : <FormattedMessage id="START" />
              }
            </Button>
          </div>
        </MenuPage>
      </div>
    );
  }
}

DevicePage.propTypes = {
  params: PropTypes.object,
  dispatch: PropTypes.any,
  deviceList: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    deviceData: state.deviceData,
    navState: state.navState,
    language: state.language,
  };
}


export default connect(mapStateToProps)(DevicePage);
