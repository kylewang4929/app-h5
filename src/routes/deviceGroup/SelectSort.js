import React, { Component } from 'react';
import { connect } from 'dva';

import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import MenuPage from '../../components/MenuPage';
import SortItem from '../../components/DeviceGroupList/SortItem';
import router from '../../utils/router';
import config from '../../config/product';
import Scroll from '../../components/Scroll';

const styles = {
  deviceItem: {
  },
  comfirmButton: {
    background: '#00C3FF',
    color: '#fff',
    position: 'absolute',
    bottom: '0',
    width: '100%',
    borderRadius: '0',
  },
};

class SelectSort extends Component {
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

  goSelectDevice(PK) {
    router.go(`#/menu/selectDevice/${PK}`);
  }

  render() {
    const { language } = this.props;
    return (
      <div>
        <NavBar
          title="SELECT_SORT"
          leftButton={<BackButton />} 
        />
        <MenuPage theme="dark" hasTab>
          <Scroll bounce>
            <div style={styles.deviceList}>
              {
                config.map((item,index) => {
                  const productName = item[`${language.key}_name`] || item[`name`];
                  return (
                    <div style={styles.deviceItem} onClick={this.goSelectDevice.bind(null,item.productKey)} key={index}>
                      <SortItem iconImg={item.icon} deviceName={productName} />
                    </div>
                  )
                })
              }
            </div>
            <div style={{ height: '1rem' }} />
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

SelectSort.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(SelectSort);
