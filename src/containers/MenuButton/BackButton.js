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

class BackButton extends Component {
  onClick = () => {
    router.goBack(-1);
    const { navState, onClick } = this.props;
    let canBack = false;
    if (navState.canBack) {
      canBack = true;
    }
    if (canBack) {
      router.goBack(-1);
      if (onClick) {
        onClick();
      }
    }
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={this.onClick} style={{ ...styles.iconBox, color, ...styles.leftIcon }}>
        <span className="mdi mdi-chevron-left" style={styles.icon} />
      </Button>
    );
  }
}

BackButton.propTypes = {
  color: PropTypes.string,
};

BackButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    navState: state.navState,
  };
}

const BackButtonContainer = connect(mapStateToProps)(BackButton);

BackButtonContainer.defaultProps = {
  key: 'BackButton',
};

export default BackButtonContainer;
