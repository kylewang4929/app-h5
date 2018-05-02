import React, { Component, PropTypes } from 'react';
import router from '../../utils/router';

const styles = {
  wrap: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  top: {
    paddingTop: '1.8rem',
  },
  add: {
    fontSize: '.6rem',
    width: '.6rem',
    height: '.6rem',
    lineHeight: '.5rem',
    display: 'inline-block',
    border: '2px solid #00bca8',
    borderRadius: '100%',
    color: '#00bca8',
    marginTop: '.4rem',
    marginBottom: '.2rem',
  },
  btm: {
    fontSize: '0.3rem',
  },
};


class NonePage extends Component {
  render() {
    const { onClick, text } = this.props;
    return (
      <div style={styles.wrap}>
        <div style={styles.top}>你还没添加定时哦～</div>
        <div style={styles.add} onClick={() => { router.go('#/menu/addTiming/add'); }}>+</div>
        <div style={styles.btm}>添加定时</div>
      </div>
    );
  }
}

NonePage.propTypes = {
  onClick: PropTypes.func,
};

export default NonePage;
