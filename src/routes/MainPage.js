import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';

import NavBar from '../containers/NavBar';
import AddDeviceButton from '../containers/MenuButton/AddDeviceButton';
import CommonButton from '../containers/MenuButton/CommonButton';
import MenuPage from '../components/MenuPage';
import router from '../utils/router';
import DeviceList from '../containers/DeviceList';
import SearchContain from '../containers/SearchContain';
import Columns from '../containers/Columns';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
};

class MainPage extends Component {
  componentWillMount() {
    this.leftButton = (
      <CommonButton>
        <i className="mdi mdi-account-circle" style={{ fontSize: '0.44rem' }} onClick={this.goToAccount} />
      </CommonButton>
    );
  }

  goToAccount = () => {
    router.go('#/menu/account');
  }
  search = (v) => {
    console.log(v);
  }

  render() {
    const { data } = this.props.deviceList;
    return (
      <div>
        <NavBar
          title={<FormattedMessage id="DEVICE_LIST" />}
          leftButton={this.leftButton}
          rightButton={<AddDeviceButton />}
        />
        <MenuPage theme="dark">
          <DeviceList />
        </MenuPage>
      </div>
    );
  }
}

MainPage.propTypes = {
};

MainPage.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    tabState: state.tabState,
    deviceList: state.deviceList,
    language: state.language,
  };
}


export default connect(mapStateToProps)(MainPage);
