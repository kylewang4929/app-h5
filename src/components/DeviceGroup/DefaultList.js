import React, { Component } from 'react';

require('./defaultListStyles.less');

const defaultStyles = {
  container: {
  },
  icon: {
    width: '1.1rem',
    height: '1.1rem',
    position: 'absolute',
    left: '0.5rem',
    top: '0.36rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  infoBox: {
    position: 'absolute',
    left: '2.1rem',
    top: '0.44rem',
    width: '4rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  title: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '2.4rem',
    height: '0.18rem',
    marginBottom: '0.2rem',
  },
  subTitle: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '2.8rem',
    height: '0.18rem',
    marginBottom: '0.2rem',
  },
  tips: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '3.4rem',
    height: '0.18rem',
    marginBottom: '0.2rem',
  },
};

class DefaultItem extends Component {
  render() {
    return (
      <div className="device-group-list-item">
        <div className="flash-animate" />
        <div style={defaultStyles.icon} />
        <div style={defaultStyles.infoBox}>
          <div style={defaultStyles.title} />
          <div style={defaultStyles.subTitle} />
          <div style={defaultStyles.tips} />
        </div>
      </div>
    );
  }
}

class DefaultList extends Component {
  render() {
    return (
      <div style={defaultStyles.container}>
        <DefaultItem />
        <DefaultItem />
      </div>
    );
  }
}

export default DefaultList;
