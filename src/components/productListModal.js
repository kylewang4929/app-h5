import React, { Component, PropTypes } from 'react';
import { List } from 'antd-mobile';

import router from '../utils/router';
import Popup from '../utils/Popup';
import { Modal } from '../components/Modal';
import Scroll from '../components/Scroll';

import productList from '../config/product';
import { getLanguageString } from '../utils/getLanguage';

const appConfig = require('../config/template').app;

const Item = List.Item;

const styles = {
  itemTitle: {
    fontSize: '0.3rem',
    position: 'relative',
    top: '0.02rem',
  },
  listIcon: {
    width: '.9rem',
    height: '.9rem',
    margin: '0.1rem 0.3rem 0.1rem 0.1rem',
  },
  title: {
    fontSize: '0.32rem',
    color: '#3e3e3e',
  },
  iconBox: {
    color: '#3e3e3e',
    padding: '0rem 0.2rem',
  },
  rightIcon: {
    marginRight: '-0.18rem',
  },
  leftIcon: {
    marginLeft: '-0.18rem',
  },
};

class ProductList extends Component {

  onScan = () => {
    this.props.onScan();
  }

  onClose = () => {
    Popup.hide();
  }

  onItemClick = (item) => {
    const { networkConfigType } = appConfig;
    if (networkConfigType.length > 1) {
      router.go(`#/menu/airLink/${item.productKey}`);
    } else {
      networkConfigType.includes('AIR_LINK') ? router.go(`#/menu/airLink/${item.productKey}`) : router.go(`#/menu/softAp/${item.productKey}`);
    }
    Popup.hide();
  }

  render() {
    const { language, properties } = this.props;
    const DEVICE_TYPE = getLanguageString(language.key, 'DEVICE_TYPE');
    return (
      <Modal properties={properties} title={DEVICE_TYPE} onClose={this.onClose} closeIcon="close">
        <Scroll bounce>
          <List className="no-top-border-list">
            {
              productList.map((item, index) => {
                const languageKey = language.key;
                const name = item[`${languageKey}_name`] || item.name;
                return (
                  <Item
                    key={index}
                    onClick={this.onItemClick.bind(null, item)}
                    arrow="horizontal"
                  >
                    <img
                      role="presentation"
                      style={styles.listIcon}
                      src={item.icon}
                    />
                    <span style={styles.itemTitle}>{name}</span>
                  </Item>
                );
              })
            }
          </List>
          <div style={{ height: '2rem' }} />
        </Scroll>
      </Modal>
    );
  }
}

ProductList.propTypes = {
  onScan: PropTypes.func,
};

export default ProductList;
