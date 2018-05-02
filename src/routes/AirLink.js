/**
 * airLink 页面
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import BackButton from '../containers/MenuButton/BackButton';
import SoftAp from '../containers/MenuButton/SoftAp';
import ConfigWifi from '../containers/ConfigWifi';
import { getItemForPk } from '../utils/configExpand';
import FlashingImage from '../components/FlashingImage';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import router from '../utils/router';

const appConfig = require('../config/template').app;

const styles = {
  container: {
  },
  header: {
    backgroundColor: '#eaeaea',
  },
  headerImage: {
    width: '100%',
    height: '4rem',
    margin: 'auto',
  },
  tipsText: {
    textAlign: 'center',
    fontSize: '0.32rem',
    fontWeight: '400',
    padding: '0.4rem 0.6rem',
  },
  buttonBox: {
    position: 'absolute',
    width: '100%',
    bottom: '1rem',
    padding: '0 1rem',
    boxSizing: 'border-box',
  },
  link: {
    textAlign: 'center',
    color: '#07f',
    textDecoration: 'underline',
    marginBottom: '0.28rem',
    fontSize: '0.28rem',
  },
};
class AirLink extends Component {

  state = {
    showModal: false,
    blur: false,
    errorNum: 0,
  };

  componentWillMount() {
    const { dispatch, params, language } = this.props;
    const productItem = getItemForPk(params.productKey);
    this.setState({
      productItem,
    });

    // 获取文本
    const airLinkConfig = productItem.airLink;
    this.text = {
      title: airLinkConfig[`title_${language.key}`] || airLinkConfig['title'],
      buttonText: airLinkConfig[`buttonText_${language.key}`] || airLinkConfig['buttonText'],
      buttonTips: airLinkConfig[`buttonTips_${language.key}`] || airLinkConfig['buttonTips'],
    };
  }

  onClick = () => {
    this.setState({
      showModal: true,
    });
    // 显示modal 把页面变模糊
    const { dispatch } = this.props;
  }

  onModalCancel = () => {
    this.setState({
      showModal: false,
    });
  }

  goToTips = () => {
    const { params } = this.props;
    router.go(`#/menu/configTipsPage/airLink/${params.productKey}`);
  }
  
  goToSoftAp = () => {
    const { params } = this.props;
    router.go(`#/menu/softAp/${params.productKey}`);
  }

  onConfigFail = () => {
    const { errorNum } = this.state;
    this.setState({
      errorNum: errorNum + 1,
    });
  }

  render() {
    const { showModal, blur, productItem, errorNum } = this.state;
    const { params, language } = this.props;

    const { networkConfigType } = appConfig;
    const useSoftApOption = errorNum > 1 ? true : false;
    return (
      <div>
        <ConfigWifi
          goToSoftAp={this.goToSoftAp}
          useSoftApOption={useSoftApOption}
          onConfigFail={this.onConfigFail}
          productConfig={productItem}
          configureMode={1}
          isShow={showModal}
          onCancel={this.onModalCancel}
        />
        <NavBar
          title="ADD_DEVICE"
          leftButton={<BackButton />}
          rightButton={networkConfigType.includes('SOFT_AP') ? <SoftAp id={params.productKey} /> : null}
        />
        <MenuPage style={styles.container}>
          <div style={styles.header}>
            <div style={styles.headerImage}>
              <FlashingImage
                speed={500}
                image={productItem.configImage.unActive}
                activeImage={productItem.configImage.active}
              />
            </div>
          </div>
          <div style={styles.tipsText}>
            {
              this.text.title ? this.text.title : <FormattedMessage id="FAST_FLASHING_TIPS" />
            }
          </div>
          <div style={styles.buttonBox}>
            <div style={styles.link} onClick={this.goToTips}>
              {
                this.text.buttonTips ? this.text.buttonTips : <FormattedMessage id="HOW_TO_SET_FAST_FLASHING" />
              }
            </div>
            <Button type="primary" onClick={this.onClick}>
              {
                this.text.buttonText ? this.text.buttonText : <FormattedMessage id="CONFIRM_FAST_FLASHING" />
              }
            </Button>
          </div>
        </MenuPage>
      </div>
    );
  }
}

AirLink.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(AirLink);
