import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';

import router from '../utils/router';
import RefreshControlList from '../components/RefreshControlList';
import NonePage from '../components/DeviceList/NonePage';
import Item from '../components/DeviceList/Item';
import Modal from '../utils/Modal';
import MyToast from '../utils/Toast';

const { alert } = Modal;

const styles = {
  container: {
    height: '100%',
  },
};

class DeviceListContainer extends Component {

  constructor(props) {
    super(props);

    this.createRow = (rowData, sectionID, rowID) => {
      return (
        <Item
          data={rowData}
          key={rowID}
          onClick={this.toDetail}
          onDelete={this.onDelete}
          onRename={this.onRename}
        />
      );
    };
  }

  componentDidMount() {
    if (this.props.gizwitsSdk.initSuccess) {
      setTimeout(() => {
        this.onRefresh(true);
      }, 100);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.gizwitsSdk.initSuccess !== this.props.gizwitsSdk.initSuccess) && nextProps.gizwitsSdk.initSuccess) {
      setTimeout(() => {
        this.onRefresh(true);
      }, 500);
    }
  }

  onRename = (device, alias) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gizwitsSdk/setCustomInfo',
      payload: { device, alias },
    });
  }

  onDelete = (device) => {
    const { dispatch } = this.props;
    alert('解绑设备', '确定要解绑设备吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定',
        onPress: () => {
          dispatch({
            type: 'gizwitsSdk/unBindDevice',
            payload: { did: device.did },
          });
        } },
    ]);
  }
  onRefresh = (backgroundLoad) => {
    const backgroundLoadFlag = !!backgroundLoad;
    const { dispatch } = this.props;
    // 查询设备列表
    dispatch({
      type: 'deviceList/getList',
      payload: {
        backgroundLoad: backgroundLoadFlag,
        success: () => {
        },
        error: () => {
        },
      },
    });
  }
  addDevice = () => {
    router.go('#/menu/searchDevice');
  }

  toDetail = (data) => {
    const { deviceData } = this.props;
    if (!deviceData[data.did]) {
      MyToast.info('无法获取到设备数据，请重试', 1.5);
      return;
    }
    if (data.netStatus !== 2) {
      MyToast.info('设备不在线', 1.5);
      return;
    }
    console.log(data);
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceList/updateActiveDevice',
      payload: data,
    });
    router.go(`#/menu/devicePage/${data.productKey}/${data.mac}/${data.did}`);
  }

  render() {
    const { deviceList } = this.props;
    const { data, loading } = deviceList;
    return (
      <div style={styles.container}>
        <div style={{ height: '100%' }}>
          <RefreshControlList
            NonePage={<NonePage onClick={this.addDevice} />}
            onClick={this.onClick}
            refreshing={loading}
            createRow={this.createRow}
            data={data}
            onRefresh={this.onRefresh}
          />
        </div>
      </div>
    );
  }
}

DeviceListContainer.contextTypes = {
  properties: PropTypes.object.isRequired,
};


DeviceListContainer.propTypes = {
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    deviceData: state.deviceData,
    gizwitsSdk: state.gizwitsSdk,
    language: state.language,
  };
}

export default connect(mapStateToProps)(DeviceListContainer);
