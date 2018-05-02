import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import router from '../../utils/router';

const styles = {
  icon: {
    fontSize: '0.44rem',
  },
  iconBox: {
    padding: '0rem 0.3rem',
  },
  rightIcon: {
  },
  leftIcon: {
  },
};

class SettingButton extends Component {
  onClick = () => {
    router.go('#/menu/setting');
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={this.onClick} style={{ ...styles.iconBox, color, ...styles.rightIcon }}>
        <span className="mdi mdi-settings" style={styles.icon} />
      </Button>
    );
  }
}

SettingButton.propTypes = {
  color: PropTypes.string,
};

SettingButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(SettingButton);
