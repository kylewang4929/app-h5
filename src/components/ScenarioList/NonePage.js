import React, { Component, PropTypes } from 'react';
import { Button } from 'antd-mobile';

const emptyImage = require('./timer_empty.png');

const nonePageStyles = {
  nonePage: {
    padding: '0.24rem',
    textAlign: 'center',
    color: 'rgb(209, 209, 209)',
    boxSizing: 'border-box',
  },
  box: {
    backgroundColor: '#fff',
    padding: '0.8rem 0.4rem',
    borderRadius: '0.2rem',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  icon: {
    fontSize: '2.4rem',
    paddingTop: '0.4rem',
    paddingBottom: '0.2rem',
  },
  title: {
    fontSize: '0.3rem',
    color: '#909090',
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

const image = require('../../assets/device.png');

class NonePage extends Component {
  render() {
    const { onClick, text } = this.props;
    return (
      <div style={nonePageStyles.nonePage}>
        <span className="mdi mdi-av-timer" style={nonePageStyles.icon} />
        <div style={nonePageStyles.title}>{text}</div>
      </div>
    );
  }
}

NonePage.propTypes = {
  onClick: PropTypes.func,
};

export default NonePage;
