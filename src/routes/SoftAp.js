/**
 * airLink 页面
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import ConfigWifi from '../containers/ConfigWifi';
import FlashingImage from '../components/FlashingImage';
import BackButton from '../containers/MenuButton/BackButton';
import { getItemForPk } from '../utils/configExpand';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import router from '../utils/router';

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
  };

  componentWillMount() {
    const { params, language } = this.props;
    const productItem = getItemForPk(params.productKey);
    this.setState({
      productItem,
    });

    const softApConfig = productItem.softAp;
    this.text = {
      title: softApConfig[`title_${language.key}`] || softApConfig[`title`],
      buttonText: softApConfig[`buttonText_${language.key}`]  || softApConfig[`buttonText`],
      buttonTips: softApConfig[`buttonTips_${language.key}`]  || softApConfig[`buttonTips`],
    };
  }

  onClick = () => {
    this.setState({
      showModal: true,
    });
  }

  onModalCancel = () => {
    this.setState({
      showModal: false,
    });
  }

  goToTips = () => {
    const { params } = this.props;
    router.go(`#/menu/configTipsPage/softAp/${params.productKey}`);
  }

  render() {
    const { showModal, blur, productItem } = this.state;
    const { params, language } = this.props;
    return (
      <div>
        <ConfigWifi
          configureMode={0}
          isShow={showModal}
          onCancel={this.onModalCancel}
          productConfig={productItem}
        />
        <NavBar
          title="ADD_DEVICE"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <div style={styles.header}>
            <div style={styles.headerImage}>
              <FlashingImage
                speed={2000}
                image={productItem.configImage.unActive}
                activeImage={productItem.configImage.active}
              />
            </div>
          </div>
          <div style={styles.tipsText}>
            {
              this.text.title ? this.text.title : <FormattedMessage id="SLOW_FLASHING_TIPS" />
            }
          </div>
          <div style={styles.buttonBox}>
            <div style={styles.link} onClick={this.goToTips}>
              {
                this.text.buttonTips ? this.text.buttonTips : <FormattedMessage id="HOW_TO_SET_SLOW_FLASHING" />
              }
            </div>
            <Button type="primary" onClick={this.onClick}>
              {
                this.text.buttonText ? this.text.buttonText : <FormattedMessage id="CONFIRM_SLOW_FLASHING" />
              }
            </Button>
          </div>
        </MenuPage>
      </div>
    );
  }
}

AirLink.propTypes = {
  params: PropTypes.object,
  language: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(AirLink);
