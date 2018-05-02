import React, { Component, PropTypes } from 'react';

require('./defaultListStyles.less');

const defaultStyles = {
  container: {
    padding: '0rem 0',
  },
  icon: {
    width: '1.1rem',
    height: '0.6rem',
    position: 'absolute',
    right: '0.5rem',
    top: '0.39rem',
    borderRadius: '3rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  innerIcon: {
    margin: '0.02rem',
    width: '0.56rem',
    height: '0.56rem',
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  infoBox: {
    position: 'absolute',
    left: '0.6rem',
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
      <div className="timing-list-item-container">
        <div className="timing-list-item">
          <div className="flash-animate" />
          <div style={defaultStyles.infoBox}>
            <div style={defaultStyles.title} />
            <div style={defaultStyles.subTitle} />
          </div>
          <div style={defaultStyles.icon}>
            <div style={defaultStyles.innerIcon} />
          </div>
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
