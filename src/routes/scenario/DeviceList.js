import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

import BackButton from '../../containers/MenuButton/BackButton';
import router from '../../utils/router';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import createDeviceList from '../../utils/createDeviceList';
import { getItemForPk } from '../../utils/configExpand';

const Item = List.Item;

const styles = {
  icon: {
    margin: '0.2rem 0',
    width: '1rem',
    height: '1rem',
  },
  list: {
    borderTop: '1px solid rgba(0,0,0,0.08)',
  },
  nonePage: {
    textAlign: 'center',
    color: '#909090',
    padding: '1.4rem 0',
  },
  noneIcon: {
    fontSize: '2rem',
  },
  noneTips: {
    fontSize: '0.28rem',
  },
};

class DeviceList extends Component {

  componentDidMount() {
  }

  select = (item) => {
    const { params, dispatch } = this.props;
    router.go(`#/menu/scenarioFeatures/${params.id}/new/${item.productKey}`);
    // 增加到缓存 有可能是分组
    let obj = {};
    if (item.type === 'group') {
      obj = {
        group_id: item.id,
        product_key: item.productKey,
        task_type: 'group',
        dev_alias: item.name,
        attrs: {},
      };
    } else {
      obj = {
        did: item.did,
        product_key: item.productKey,
        task_type: 'device',
        dev_alias: item.name,
        attrs: {},
      };
    }
    dispatch({
      type: 'scenario/addActiveTask',
      payload: obj,
    });
  }

  filterDevice = (list) => {
    const newList = [];
    list.map((item) => {
      const { productKey } = item;
      const productConfig = getItemForPk(productKey);
      // 如果productConfig没有声明场景的配置，则不显示
      // 满足条件，存在scene 》 featureList 并且长度大于0
      if (productConfig.scene && productConfig.scene.featureList && productConfig.scene.featureList.length > 0) {
        newList.push(item);
      }
    });
    return newList;
  }

  render() {
    const { deviceList } = this.props;
    const { data, loading, isDefault } = deviceList;
    const groupData = this.props.deviceGroup.data;
    const shareData = this.props.shareState.shareToReceive.objects;
    // 构造分组信息
    let deviceListData = createDeviceList(data, groupData, shareData);
    // 再过滤不合法的设备
    deviceListData = this.filterDevice(deviceListData);
    return (
      <div>
        <NavBar
          title="DEVICE_LIST"
          leftButton={<BackButton />}
        />
        <MenuPage theme="dark">
          {
            deviceListData.length > 0 ? (
              <List style={styles.list} className="my-list">
                {
                  deviceListData.map((item, index) => {
                    const { productKey } = item;
                    const productConfig = getItemForPk(productKey);
                    return (
                      <Item
                        key={index}
                        onClick={this.select.bind(null, item)}
                        thumb={<img style={styles.icon} src={productConfig.icon} />}
                        arrow="horizontal"
                      >
                        {item.name}
                      </Item>
                    );
                  })
                }
              </List>
            ) : (
              <div style={styles.nonePage}>
                <span style={styles.noneIcon} className="mdi mdi-heart-broken" />
                <div style={styles.noneTips}>
                  <FormattedMessage id="NO_DEVICE_IS_AVAILABLE" />
                </div>
              </div>
            )
          }
        </MenuPage>
      </div>
    );
  }
}

DeviceList.propTypes = {
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    deviceGroup: state.deviceGroup,
    shareState: state.shareState,
  };
}


export default connect(mapStateToProps)(DeviceList);
