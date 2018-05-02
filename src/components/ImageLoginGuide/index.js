import React, { Component, PropTypes } from 'react';
import { Button, Flex } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

const logo = require('../../assets/logo2.png');
const bg = require('./buttonImage.png');

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0px',
    top: '0px',
    backgroundImage: `url(${logo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
  buttonBox: {
    position: 'absolute',
    width: '100%',
    left: '0px',
    bottom: '0px',
    padding: '2rem 0.8rem 0rem 0.8rem',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    boxSizing: 'border-box',
    height: '4.4rem',
  },
  logoBox: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    top: '20%',
    textAlign: 'center',
  },
  logo: {
    width: '3.4rem',
  },
  button: {
    width: '2.2rem',
    lineHeight: '0.8rem',
    height: '0.8rem',
    margin: 'auto',
  },
  item: {
    textAlign: 'center',
    boxSizing: 'border-box',
  },
};

class ImageLoginGuide extends Component {

  render() {
    const { onLogin, onRegister } = this.props;
    const { tintColor } = this.context.properties;
    return (
      <div style={styles.container}>
        <div style={styles.buttonBox}>
          <Flex>
            <Flex.Item style={styles.item}>
              <Button onClick={onLogin} style={{ ...styles.button }} type="primary">
                <FormattedMessage id="LOGIN" />
              </Button>
            </Flex.Item>
            <Flex.Item style={styles.item}>
              <Button onClick={onRegister} style={{ ...styles.button }} type="ghost">
                <FormattedMessage id="REGISTER" />
              </Button>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
  }
}

ImageLoginGuide.contextTypes = {
  properties: PropTypes.object.isRequired,
};

export default ImageLoginGuide;
