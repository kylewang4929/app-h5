import React, { Component } from 'react';
import { connect } from 'dva';
import NavBar from '../containers/NavBar';
import DeviceList from '../containers/DeviceList';
import AddDeviceButton from '../containers/MenuButton/AddDeviceButton';
import MenuPage from '../components/MenuPage';

class DeviceListPage extends Component {
  componentDidMount() {
    this.updateNav();
    this.timeOut = setTimeout(() => {
      this.updateNav();
    }, 400);
  }
  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }
  updateNav = () => {
  }
  render() {
    return (
      <div>
        <NavBar
          title="DEVICE_LIST"
          rightButton={<AddDeviceButton />}
        />
        <MenuPage theme="dark" hasTab>
          <DeviceList />
        </MenuPage>
      </div>
    );
  }
}

DeviceListPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(DeviceListPage);
