import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';

import throttle from '../../utils/throttle';

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

class CommonButton extends Component {
  // 这里需要处理一个问题，防止按钮被多次点击
  _onClick = throttle(() => {
    const { onClick } = this.props;
    onClick && onClick();
  }, 200);

  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    const { attrs } = this.props;
    color = color || topNavColor;
    return (
      <Button
        className="outline"
        onClick={this.props.onClick}
        style={{ ...styles.iconBox, color, ...styles.rightIcon }}
        {...attrs}
      >
        {this.props.children}
      </Button>
    );
  }
}

CommonButton.propTypes = {
  color: PropTypes.string,
  children: PropTypes.any,
  onClick: PropTypes.func,
  attrs: PropTypes.object,
};

CommonButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(CommonButton);
