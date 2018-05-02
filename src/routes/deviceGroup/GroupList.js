import React, { Component } from 'react';
import { connect } from 'dva';
import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import AddGroupButton from '../../containers/MenuButton/AddGroupButton';
import MenuPage from '../../components/MenuPage';
import GroupHead from '../../components/DeviceGroupList/GroupHead';
import RefreshControlList from '../../components/RefreshControlList';
import Item from '../../components/DeviceGroup/Item';
import NonePage from '../../components/DeviceGroup/NonePage';
import router from '../../utils/router';
import MyToast from '../../utils/Toast';
import { getLanguageString } from '../../utils/getLanguage';

import { getItemForPk } from '../../utils/configExpand';

import { SwipeAction, Modal } from 'antd-mobile';
const alert = Modal.alert;

const styles = {
  groupListItemBox: {
    marginBottom: '0.05rem',
  }
}

class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
    };

    this.delete = this.delete.bind(this);
    this.createRow = this.createRow.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // 同时还要查询分组
    dispatch({
      type: 'deviceGroup/query',
      payload: {
      },
    });
    this.getGroupData(this.props.deviceGroup, this.props.deviceList);
  }

  componentWillReceiveProps(nextProps) {
    this.getGroupData(nextProps.deviceGroup, nextProps.deviceList);
  }

  getGroupData = (groupData, device) => {
    const group = groupData.data;
    const deviceList = device.data;
    let groupList = [];
    group.forEach((item) => {
      //更新设备在线状态(all、some、none)
      let tempObj = {};
      let groupIsOnline = 'none';
      let onlineNum = 0;
      item.devices.forEach((groupDeviceItem, index) => {
        //计算在线设备的数量
        deviceList.forEach((deviceItem) => {
          if (deviceItem.did == groupDeviceItem.did) {
            //设备在线则数量+1
            if (deviceItem.netStatus == 2) {
              onlineNum++;
            }
          }
        })
      })
      if (onlineNum == item.devices.length) {
        groupIsOnline = 'all';
      } else if (onlineNum > 0 && onlineNum < item.devices.length) {
        groupIsOnline = 'some';
      } else if (onlineNum == 0) {
        groupIsOnline = 'none';
      }
      tempObj.group = item;
      tempObj.groupIsOnline = groupIsOnline;
      //添加入数组
      groupList.push(tempObj);
    });
    this.setState({
      groupList,
    });
  }

  //将group的ID传递到分组控制页面
  goGroupControl(item) {
    const { id } = item;
    router.go(`#/menu/deviceGroupControl/${id}`);
  }

  //删除分组
  delete(gid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'deviceGroup/delete',
      payload: {
        id: gid,
        success: function () {
          dispatch({
            type: 'deviceGroup/query',
            payload: {
            },
          });
        }
      }
    })
  }

  createRow(rowData) {
    const { language } = this.props;
    const item = rowData;
    // groupList.map((item, index) => {
    //const { product_key } = item.group;
    //const data = getItemForPk(product_key);
    //const productName = data[`${language.key}_name`] || data[`name`];
    return (
      <Item language={language} deleteGroup={this.delete.bind(null, item.group.id)} item={item} goGroupControl={this.goGroupControl.bind(null, item.group)} key={item.group.id} />
    );
    // })
  }

  //刷新页面
  onRefresh() {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    // 同时还要查询分组
    dispatch({
      type: 'deviceGroup/query',
      payload: {
        success: function () {
          this.setState({
            loading: false,
          })
        }.bind(this),
      },
    });
  }

  goAddGroup() {
    router.go('#/menu/selectSort');
  }

  render() {
    const { groupList, loading } = this.state;
    const deleteGroup = this.delete;
    const goGroupControl = this.goGroupControl
    return (
      <div>
        <NavBar
          title="GROUP_LIST"
          rightButton={<AddGroupButton />}
        />
        <MenuPage theme="dark" hasTab>
          <div style={{ height: '100%' }}>
            <RefreshControlList
              NonePage={<NonePage onClick={this.goAddGroup} />}
              onClick={this.goGroupControl}
              refreshing={loading}
              createRow={this.createRow}
              data={groupList}
              onRefresh={this.onRefresh}
            />
          </div>
          {/* <SwipeAction
          right={[
            {
              text: getLanguageString(language.key,'DELETE_THE_GROUP'),
              onPress: function(){
                alert(getLanguageString(language.key,'SURE_TO_DELETE_GROUP'), getLanguageString(language.key,"REMAIN_DEVICE"), [
                  { text: getLanguageString(language.key,'CANCEL'), onPress: () => console.log('cancel') },
                  { text: getLanguageString(language.key,'CONFIRM_DELETE_GROUP'), onPress: () => {deleteGroup(item.group.id)}, style:{color: "#FF8484"}},
                ])
              },
              style: { backgroundColor: '#FF8484', color: 'white', fontSize: '0.28rem'},
            },
          ]}
          autoClose
          key={item.group.id}
        >
          <div style={styles.groupListItemBox} onClick={this.goGroupControl.bind(null, item.group)}>
            <GroupItem tips={productName} iconImg={data.icon} title={item.group.group_name} isOffLine={item.groupIsOnline}/>
          </div>
        </SwipeAction> */}
        </MenuPage>
      </div>
    );
  }
}

GroupList.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceGroup: state.deviceGroup,
    deviceList: state.deviceList,
  };
}


export default connect(mapStateToProps)(GroupList);
