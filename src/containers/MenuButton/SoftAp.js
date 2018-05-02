import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
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

class SoftAp extends Component {
  onClick = () => {
    const { id } = this.props;
    router.go(`#/menu/softAp/${id}`);
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={this.onClick} style={{ ...styles.iconBox, color, ...styles.rightIcon }}>
        <FormattedMessage id="COMPATIBILITY_MODE" />
      </Button>
    );
  }
}

SoftAp.propTypes = {
  color: PropTypes.string,
};

SoftAp.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(SoftAp);
