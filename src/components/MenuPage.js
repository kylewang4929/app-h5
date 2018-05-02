import React, { Component, PropTypes } from 'react';

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

class MenuPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusBarHeight: '0.89rem',
    };
  }

  componentWillMount() {
    // 判断平台，计算statusbar 的高度
    try {
      if (device.platform === 'iOS') {
        this.setState({
          statusBarHeight: `${0.89 + 0.3}rem`,
        });
      }
      if (device.platform === 'Android') {
        window.StatusBar.statusBarHeight((data) => {
          this.setState({
            statusBarHeight: `${((data / dpr / 50) - 0.04) + 0.9}rem`,
          });
        }, () => {});
      }
    } catch (error) {
    }
  }

  render() {
    const { style, children, theme, hasTab, className } = this.props;
    const { statusBarHeight } = this.state;
    return (
      <div style={{ ...style, paddingTop: statusBarHeight }} className={`router-page ${theme} ${className} ${hasTab ? 'has-tabbar' : ''}`}>
        {children}
      </div>
    );
  }
}

MenuPage.defaultProps = {
};
MenuPage.propTypes = {
};

export default MenuPage;
