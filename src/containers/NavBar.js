import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { NavBar } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import config from '../config/template';

const colorConfig = config.app.color;

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    left: '0px',
    top: '0px',
    zIndex: 888,
  },
  navBorder: {
  },
  icon: {
    fontSize: '0.4rem',
  },
  title: {
    fontSize: '0.32rem',
    color: '#3e3e3e',
    display: 'block',
    margin: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    width: '74%',
    lineHeight: '0.7rem',
  },
  iconBox: {
    color: '#3e3e3e',
    padding: '0rem 0.2rem',
  },
  rightIcon: {
    marginRight: '-0.18rem',
  },
  leftIcon: {
    marginLeft: '-0.18rem',
  },
};

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

class NavBarContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusBarHeight: '0rem',
    };
  }

  componentWillMount() {
    this.updateStatusBar(this.props.theme);
    let { leftButton } = this.props;
    if (!leftButton) leftButton = {};
    this.checkBack(leftButton);

    // 判断平台，计算statusbar 的高度
    try {
      if (device.platform === 'iOS') {
        this.setState({
          statusBarHeight: '0.3rem',
        });
      }
      if (device.platform === 'Android') {
        window.StatusBar.statusBarHeight((data) => {
          console.dir(document.children);
          const fontSize = parseInt(this.getStyle(document.children[0]).fontSize, 10);
          this.setState({
            statusBarHeight: `${(data / dpr / fontSize) - 0.04}rem`,
          });
        }, () => {});
      }
    } catch (error) {
    }
  }

  componentWillReceiveProps(nextProps) {
    let newTheme = nextProps.theme;
    let oldTheme = this.props.theme;
    const newLeftButton = nextProps.leftButton || {};
    const oldLeftButton = this.props.leftButton || {};
    if (!newTheme) newTheme = {};
    if (!oldTheme) oldTheme = {};
    if (newTheme.color !== oldTheme.color || newTheme.backgroundColor !== oldTheme.backgroundColor) {
      // 更新状态栏
      this.updateStatusBar(newTheme);
    }
  }

  getStyle = (ele) => {
    let style = null;
    if (window.getComputedStyle) {
      style = window.getComputedStyle(ele, null);
    } else {
      style = ele.currentStyle;
    }
    return style;
  }

  checkBack = (leftButton) => {
    let canBack = false;
    if (leftButton.props && leftButton.props.key === 'BackButton') {
      canBack = true;
    }
    // 更新到modal
    const oldCanBack = this.props.navState.canBack || false;
    if (canBack !== oldCanBack) {
      const { dispatch } = this.props;
      dispatch({
        type: 'navState/update',
        payload: {
          canBack,
        },
      });
    }
  }

  updateStatusBar = (theme) => {
    if (!theme) {
      theme = {};
    }
    const color = theme.backgroundColor || colorConfig.topNavBackground;
    if (color) {
      try {
        if (color === '#fff' || color === '#ffffff' || color === 'rgb(255,255,255)' || color === 'rgba(255,255,255, 1)') {
          if (device.platform === 'Android') {
            // window.StatusBar.backgroundColorByHexString('#dadada');
          }
          if (device.platform === 'iOS') {
            window.StatusBar.styleDefault();
          }
        } else {
          if (device.platform === 'iOS') {
            window.StatusBar.styleLightContent();
          }
          if (device.platform === 'Android') {
            // window.StatusBar.backgroundColorByHexString(color);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const { rightButton, leftButton, isTransparent } = this.props;
    let { theme, title } = this.props;
    if (!theme) {
      theme = {};
    }
    const rightDom = rightButton;
    const leftDom = leftButton;

    const { topNavBackground, topNavColor } = this.context.properties;
    let backgroundColor = '';
    if (isTransparent) {
      backgroundColor = 'rgba(0,0,0,0)';
    } else {
      backgroundColor = theme.backgroundColor || topNavBackground;
    }
    // 兼容
    if (title === '' || !title) {
      title = ' ';
    }

    const { statusBarHeight } = this.state;

    return (
      <NavBar
        mode="light"
        style={{ ...styles.contianer, ...isTransparent ? {} : styles.navBorder, backgroundColor, filter: theme.filter, paddingTop: statusBarHeight }}
        iconName={false}
        rightContent={rightDom}
        leftContent={leftDom}
      >
        <span style={{ ...styles.title, color: theme.color || topNavColor }}>
          <FormattedMessage id={title} />
        </span>
      </NavBar>
    );
  }
}

NavBarContainer.propTypes = {
};

NavBarContainer.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.language,
    navState: state.navState,
  };
}


export default connect(mapStateToProps)(NavBarContainer);
