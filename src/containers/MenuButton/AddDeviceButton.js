import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';

import router from '../../utils/router';

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

class AddDeviceButton extends Component {
  onClick = () => {
    router.go('#/menu/searchDevice');
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={this.onClick} style={{ ...styles.iconBox, color, ...styles.rightIcon }}>
        <span className="mdi mdi-plus-circle-outline" style={styles.icon} />
      </Button>
    );
  }
}

AddDeviceButton.propTypes = {
  color: PropTypes.string,
};

AddDeviceButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(AddDeviceButton);
