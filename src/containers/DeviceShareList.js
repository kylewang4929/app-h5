import React from 'react';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import Scroll from '../components/Scroll';
import router from '../utils/router';
import NonePage from '../components/StatePage/NonePage';

const Item = List.Item;
const styles = {
  wrapper: {},
};

class DeviceShareList extends React.Component {

  componentDidMount() {
    console.log('DeviceShareList 加载【成功】');
  }

  getUserArray() {
    const { objects } = this.props.data;

    const userArray = [];
    const _check = [];
    for (const _obj of objects) {
      if (!_check.includes(_obj.uid)) {
        _check.push(_obj.uid);

        userArray.push({
          id: _obj.id,
          phone: _obj.phone,
          email: _obj.email,
          uid: _obj.uid,
          user_alias: _obj.user_alias,
        });
      }
    }
    return userArray;
  }

  render() {
    const userArray = this.getUserArray();

    return (
      <div style={styles.wrapper}>
        <Scroll>
          <List>
            {userArray.map(item => (
              <Item
                key={item.id}
                extra={item.phone || item.email}
                arrow="horizontal"
                onClick={() => {
                  router.go(`#/menu/toShareUserDeviceList/${item.uid}`);
                }}
              >{item.user_alias || <FormattedMessage id="ALIAS_NOT_SET" />}</Item>
            ))}
          </List>
          {
            userArray.length === 0 ? (
              <NonePage
                icon="mdi mdi-atom"
                text={
                  <span>
                    <FormattedMessage id="NO_DEVICE_HAS_BEEN_SHARED" />
                    <br />
                    <FormattedMessage id="SHARE_YOUR_DEVICE_TO_YOUR_PARTNER" />
                  </span>
                }
              />
            ) : null
          }
        </Scroll>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(DeviceShareList);
