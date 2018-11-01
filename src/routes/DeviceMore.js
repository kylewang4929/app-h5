import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Button, Modal, ActionSheet } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import { getLanguageString } from '../utils/getLanguage';

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
    const { language } = this.props;

    const CANCEL = getLanguageString(language.key, 'CANCEL');
    const CONFIRM = getLanguageString(language.key, 'CONFIRM');
    const RENAME = getLanguageString(language.key, 'RENAME');
    Modal.prompt(RENAME, null,
      [
        { text: CANCEL },
        {
          text: CONFIRM,
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
    const { dispatch, language } = this.props;
    const DELETE_DEVICE = getLanguageString(language.key, 'DELETE_DEVICE');
    const CANCEL = getLanguageString(language.key, 'CANCEL');
    const CONFIRM = getLanguageString(language.key, 'CONFIRM');
    const SURE_DELETE_DEVICE = getLanguageString(language.key, 'SURE_DELETE_DEVICE');

    Modal.alert(DELETE_DEVICE, SURE_DELETE_DEVICE, [
      { text: CANCEL, onPress: () => console.log('cancel') },
      { text: CONFIRM,
        onPress: () => {
          dispatch({
            type: 'gizwitsSdk/unBindDevice',
            payload: { did: data.did },
          });
        } },
    ]);
  }
  switchMode = () => {
    const { language } = this.props;
    const FAHRENHEIT = getLanguageString(language.key, 'FAHRENHEIT');
    const C_UNIT = getLanguageString(language.key, 'C_UNIT');
    const CANCEL = getLanguageString(language.key, 'CANCEL');
    const UNIT = getLanguageString(language.key, 'UNIT');
    const BUTTONS = [FAHRENHEIT, C_UNIT, CANCEL];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      // title: 'title',
      message: UNIT,
      maskClosable: true,
    },
    (buttonIndex) => {
      const attrs = {};
      switch (buttonIndex) {
        case 0: {
          attrs.Unit_Flag = true;
          break;
        }
        case 1: {
          attrs.Unit_Flag = false;
          break;
        }
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'gizwitsSdk/sendCmd',
        payload: {
          data: attrs,
        },
      });
    });
  }
  render() {
    const { deviceList: { data }, params: { did }, deviceData } = this.props;
    const device = data.find(v => v.did === did);
    const unit = deviceData[did].data.Unit_Flag;
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
            >{device.dev_alias || <FormattedMessage id="HEATING_RODS" />}</Item>
          </List>

          <List style={styles.list} className="my-list">
            <Item
              arrow="horizontal"
              onClick={this.switchMode}
            >{unit ? <FormattedMessage id="FAHRENHEIT" /> : <FormattedMessage id="C_UNIT" />}</Item>
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
