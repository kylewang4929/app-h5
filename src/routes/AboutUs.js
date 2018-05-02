import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List } from 'antd-mobile';
import Scroll from '../components/Scroll';
import MenuPage from '../components/MenuPage';
import BackButton from '../containers/MenuButton/BackButton';
import config from '../config/template';
import { getPlatform } from '../utils/browser';
import NavBar from '../containers/NavBar';

const aboutUsConfig = config.aboutUs;

const Item = List.Item;

const logoImage = require('../assets/logo.png');

const styles = {
  container: {
    backgroundColor: '#fff',
  },
  logoBox: {
    textAlign: 'center',
  },
  list: {
    padding: '0.2rem 0.4rem',
    fontSize: '0.28rem',
    color: '#5a5a5a',
    lineHeight: '1.4',
    textIndent: '0.6rem',
  },
  logo: {
    width: '4rem',
    padding: '0.2rem 0 0.4rem 0',
  },
  contentImage: {
    width: '100%',
    display: 'block',
    height: 'auto',
  },
  tips: {
    position: 'absolute',
    bottom: '0.2rem',
    width: '100%',
    left: '0px',
    textAlign: 'center',
    color: '#80c7e8',
    fontSize: '0.28rem',
  },
  content: {
    fontSize: '.28rem',
    color: '#909090',
    display: 'block',
    padding: '0.1rem 0',
  },
  title: {
    fontWeight: 'bold',
  },
};

class AboutUs extends Component {

  state = {
    platform: getPlatform(),
  };

  componentWillMount() {
    const { dispatch } = this.props;
    let backgroundColor = aboutUsConfig.background;
    const { tintColor } = this.context.properties;
    backgroundColor = backgroundColor || tintColor;
    let color = '#fff';
    if (backgroundColor !== '#fff' &&
      backgroundColor !== '#ffffff' &&
      backgroundColor !== 'rgb(255,255,255)' &&
      backgroundColor !== 'rgba(255,255,255,1)') {
      color = '#fff';
    } else {
      color = '#000';
    }
    this.theme = {
      color,
      backgroundColor,
    };
  }
  render() {
    const { tintColor } = this.context.properties;
    const { appInfo } = this.props;
    const { version } = appInfo;
    return (
      <div>
        <NavBar
          title="ABOUT_US"
          theme={this.theme}
          leftButton={<BackButton color="#fff" />}
        />
        <MenuPage style={styles.container}>
          <Scroll>
            <div style={{ ...styles.logoBox }}>
              <img style={styles.logo} role="presentation" src={logoImage} />
            </div>
            <List className="my-form" style={styles.list}>
              机智云,全球领先的智能硬件软件自助开发及物联网(IOT)云服务平台,广州机智云物联网科技有限公司注册商标。面向开发者(企业)提供智能硬件PaaS及SaaS云服务,是目前
            </List>
          </Scroll>
          <div style={styles.tips}>
            {version}
          </div>
        </MenuPage>
      </div>
    );
  }
}

AboutUs.propTypes = {
};
AboutUs.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    platform: state.platform,
    language: state.language,
    appInfo: state.appInfo,
  };
}

export default connect(mapStateToProps)(AboutUs);
