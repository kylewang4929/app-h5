import React, { Component, PropTypes } from 'react';

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    overflow: 'hidden',
  },
  indicator: {
    width: '6rem',
    height: '12rem',
    position: 'absolute',
    top: '50%',
    marginTop: '-6rem',
    zIndex: 9,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  animate: {
    transition: 'left 0.175s cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
};
class Page extends Component {

  constructor(props) {
    super(props);
    this.ontouchstart = this.ontouchstart.bind(this);
    this.ontouchmove = this.ontouchmove.bind(this);
    this.ontouchend = this.ontouchend.bind(this);

    this.state = {
      offset: '-6rem',
      hideIndicator: false,
      animate: false,
    };
  }

  componentDidMount() {
    // 封装一个滚动条
    this.touchFlag = false;
    this.startX = 0;
    // 监听滚动区域的touchstart
    this.dom.addEventListener('touchstart', this.ontouchstart);
    // 监听move事件，移动元素
    this.dom.addEventListener('touchmove', this.ontouchmove);
    // 清理
    this.dom.addEventListener('touchend', this.ontouchend);
  }

  componentWillUnmount() {
    this.dom.removeEventListener('touchstart', this.ontouchstart);
    this.dom.removeEventListener('touchmove', this.ontouchmove);
    this.dom.removeEventListener('touchend', this.ontouchend);
  }

  ontouchstart(e) {
    const { canBack } = this.props;
    if (canBack) {
      const { pageX } = e.touches[0];
      if (pageX < 50) {
        this.touchFlag = true;
        this.startX = pageX;
      }
    }
  }
  ontouchmove(e) {
    if (this.touchFlag) {
      const { pageX } = e.touches[0];
      const offset = pageX - this.startX;

      let domOffset = offset > 100 ? 100 : offset;
      domOffset = -6 + ((domOffset / 100)) + 'rem';
      this.setState({
        offset: domOffset,
      });

      if (offset > 100) {
        this.back = true;
      } else {
        this.back = false;
      }
    }
  }
  ontouchend() {
    if (this.touchFlag) {
      this.touchFlag = false;
      if (this.back) {
        this.props.back();
        this.setState({
          hideIndicator: true,
        });
      }
      this.hideAnimate();
    }
  }

  hideAnimate = () => {
    this.setState({
      animate: true,
    });

    setTimeout(() => {
      this.setState({
        offset: '-6rem',
      });
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 175);
    }, 50);
  }

  render() {
    const { offset, animate, hideIndicator } = this.state;
    const { children } = this.props;
    return (
      <div style={styles.container} ref={(c) => { this.dom = c; }}>
        {
          !hideIndicator ?
            <div
              style={{ ...styles.indicator,
                left: offset,
                ...animate ? styles.animate : {} }}
            /> : null
        }

        {children}
      </div>
    );
  }
}

Page.propTypes = {
  children: PropTypes.any,
  canBack: PropTypes.bool,
  back: PropTypes.func,
};

export default Page;
