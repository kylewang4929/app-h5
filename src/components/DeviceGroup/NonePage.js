import React, { Component, PropTypes } from 'react';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

const nonePageStyles = {
  nonePage: {
    padding: '0rem',
    textAlign: 'center',
    color: 'rgb(209, 209, 209)',
    boxSizing: 'border-box',
  },
  box: {
    backgroundColor: '#fff',
    padding: '0.8rem 0.4rem',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  image: {
    width: '100%',
    margin: '0.6rem 0 0.8rem 0',
  },
  title: {
    fontSize: '0.36rem',
    color: '#000',
  },
  button: {
    borderRadius: '1rem',
    fontSize: '0.3rem',
    height: '.8rem',
    lineHeight: '.8rem',
    width: '5rem',
    margin: 'auto',
  },
};

// const image = require('./IOT.png');
const image = require('../../assets/device.png');

class NonePage extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <div style={nonePageStyles.nonePage}>
        <div style={nonePageStyles.box}>
          <div style={nonePageStyles.title}>
            <FormattedMessage id="LET_THE_WISDOM_CONNECT_LIFE" />
          </div>
          <img role="presentation" style={nonePageStyles.image} src={image} />
          <Button style={nonePageStyles.button} onClick={onClick} type="primary">
            <FormattedMessage id="ADD_GROUP" />
          </Button>
        </div>
      </div>
    );
  }
}

NonePage.propTypes = {
  onClick: PropTypes.func,
};

export default NonePage;
