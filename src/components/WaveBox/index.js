import React, { Component, PropTypes } from 'react';
import { Button, Flex } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import classie from './classie';

const Snap = window.Snap;
require('./styles.less');
const logo = require('../../assets/login_logo.png');

const styles = {
  buttonBox: {
    position: 'absolute',
    width: '100%',
    left: '0px',
    bottom: '2%',
    padding: '0 1.4rem 0rem 1.4rem',
    boxSizing: 'border-box',
  },
  logoBox: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    top: '30%',
    textAlign: 'center',
  },
  logo: {
    width: '2.8rem',
  },
  button: {
    lineHeight: '0.8rem',
    height: '0.8rem',
    margin: '0.2rem auto',
  },
  item: {
    textAlign: 'center',
    boxSizing: 'border-box',
  },
};

class WaveBox extends Component {
  render() {
    const { onLogin, onRegister } = this.props;
    const { tintColor } = this.context.properties;
    return (
      <div ref={(e) => { this.dom = e; }} className="waveBox">
        <div style={styles.logoBox}>
          <img src={logo} style={styles.logo} />
        </div>

        <div style={styles.buttonBox}>
          <Button onClick={onLogin} style={{ ...styles.button }} type="primary">
            <FormattedMessage id="LOGIN" />
          </Button>
          <Button onClick={onRegister} style={{ ...styles.button }} type="primary">
            <FormattedMessage id="REGISTER" />
          </Button>
        </div>
      </div>
    );
  }
}

WaveBox.contextTypes = {
  properties: PropTypes.object.isRequired,
};

export default WaveBox;
