import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Button, Modal } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import router from '../utils/router';

const Item = List.Item;

const styles = {
  container: {
  },
  button: {
    width: '5rem',
    margin: '0.6rem auto',
    border: 'none',
    backgroundColor: '#e45460',
    color: '#fff',
  },
  list: {
    marginTop: '0.2rem',
  },
};

const deviceIcon = require('../assets/logo.png');

class DeviceMore extends Component {
  rename = (data) => {

    Modal.prompt('重命名', null,
      [
        { text: '取消' },
        {
          text: '确认',
          onPress: (value) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'gizwitsSdk/setCustomInfo',
              payload: { device, value },
            });
          },
        },
      ], 'default', data.name);
  }
  delete = (data) => {
    const { dispatch } = this.props;
    Modal.alert('解绑设备', '确定要解绑设备吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定',
        onPress: () => {
          dispatch({
            type: 'gizwitsSdk/unBindDevice',
            payload: { did: data.did },
          });
        } },
    ]);
  }
  render() {
    const { deviceList: { data }, dispatch, params: { did }, deviceData } = this.props;
    const device = data.find(v => v.did === did);
    return (
      <div>
        <NavBar
          title="SETTING"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <List style={styles.list} className="my-list">
            <Item
              thumb={deviceIcon}
              arrow="horizontal"
              onClick={this.rename.bind(null, device)}
            >{device.dev_alias || '加热棒'}</Item>
          </List>

            <Button
              style={{ ...styles.button }}
              onClick={this.delete.bind(null, data)}
            >
              <FormattedMessage id="DELETE_DEVICE" />
            </Button>
        </MenuPage>
      </div>
    );
  }
}

DeviceMore.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    shareState: state.shareState,
    deviceData: state.deviceData,
    deviceList: state.deviceList,
  };
}

export default connect(mapStateToProps)(DeviceMore);
