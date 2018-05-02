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
  onDelete = (data) => {
    const { dispatch, params: { did }, deviceData } = this.props;
    let { Cook_Para, Cookstage_Para } = deviceData[did].data;
    Cook_Para.splice(data.index, 4);
    Cook_Para = Cook_Para.concat([0, 0, 0, 0]);
    Cookstage_Para -= 1;
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
    const { Busy_Flag } = deviceData[did].data;
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        data: { Busy_Flag: !Busy_Flag },
      },
    });
  }
  render() {
    const { deviceList: { data }, dispatch, params: { did }, deviceData } = this.props;
    const device = data.find(v => v.did === did);
    const { Busy_Flag } = deviceData[did].data;
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
            <Button style={styles.button} onClick={this.toggle}>{Busy_Flag ? 'Cancel' : 'Start'}</Button>
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
