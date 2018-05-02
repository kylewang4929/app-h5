import React, { Component, PropTypes } from 'react';
import { Button } from 'antd-mobile';
import { connect } from 'dva';

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0px',
    top: '0px',
  },
  icon: {
    fontSize: '0.44rem',
  },
  listIcon: {
    width: '.7rem',
    height: '.7rem',
    margin: '0.1rem 0.5rem 0.1rem 0.3rem',
  },
  iconBox: {
    padding: '0rem 0.3rem',
  },
  rightIcon: {
  },
  leftIcon: {
  },
};

class DeviceMoreButton extends Component {
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color, onClick } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={onClick} style={{ ...styles.iconBox, color, ...styles.rightIcon }}>
        <span className="mdi mdi-dots-horizontal" style={styles.icon} />
      </Button>
    );
  }
}

DeviceMoreButton.propTypes = {
  color: PropTypes.string,
  device: PropTypes.object,
  dispatch: PropTypes.any,
};

DeviceMoreButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(DeviceMoreButton);
