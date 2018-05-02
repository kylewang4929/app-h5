import React, { Component, PropTypes } from 'react';
import { Button, Flex, NavBar } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import { FormattedMessage } from 'react-intl';

require('./styles.less');

const styles = {
  container: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    zIndex: '999',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '0.32rem',
    color: '#3e3e3e',
  },
  button: {
    fontSize: '0.4rem',
    padding: '0 0.3rem',
  },
};

/**
 * 这里的modal是用antd的组件弹出来的
 * 和普通的弹窗不一样
 * 这里它只是一个组件
 */
const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

class Modal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusBarHeight: '0rem',
    };
  }

  componentWillMount() {
    // 判断平台，计算statusbar 的高度
    try {
      if (device.platform === 'iOS') {
        this.setState({
          statusBarHeight: '0.3rem',
        });
      }
      if (device.platform === 'Android') {
        window.StatusBar.statusBarHeight((data) => {
          this.setState({
            statusBarHeight: `${(data / dpr / 50) - 0.02}rem`,
          });
        }, () => {});
      }
    } catch (error) {
    }
  }

  render() {
    const { onClose, onConfirm, confirmIcon, closeIcon, title, children } = this.props;
    const { statusBarHeight } = this.state;

    const { topNavBackground, topNavColor } = this.props.properties;

    return (
      <div style={styles.container}>
        <NavBar
          mode="light"
          style={{
            backgroundColor: topNavBackground,
            paddingTop: statusBarHeight,
            color: topNavColor,
            zIndex: 999,
            position: 'relative',
            borderBottom: '0.02rem solid rgba(0,0,0,0.08)',
          }}
          iconName={false}
          rightContent={
            onConfirm ? <Button
              style={{ ...styles.button, color: topNavColor }}
              onClick={onConfirm}
              className="outline"
            >
              <span className={`mdi mdi-${confirmIcon}`} />
            </Button> : null
          }
          leftContent={
            onClose ? <Button
              style={{ ...styles.button, color: topNavColor }}
              onClick={onClose}
              className="outline"
            >
              <span className={`mdi mdi-${closeIcon}`} />
            </Button> : null
          }
        >
          <span style={{ ...styles.title, color: topNavColor }}>{title}</span>
        </NavBar>
        {children}
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  confirmIcon: PropTypes.string,
  closeIcon: PropTypes.string,
  children: PropTypes.element,
};

class Prompt extends Component {
  state = {
    value: '',
  };

  componentWillMount() {
    this.setState({
      value: this.props.value,
    });
    if (!window.popupNav) {
      window.popupNav = {};
    }
    if (this.props.isShow) {
      window.popupNav.myAlert = {
        handle: this.onClose,
      };
    } else {
      window.popupNav.myAlert = null;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
    if (nextProps.isShow !== this.props.isShow) {
      if (nextProps.isShow) {
        window.popupNav.myAlert = {
          handle: this.onClose,
        };
      } else {
        window.popupNav.myAlert = null;
      }
    }
  }

  componentWillUnmount() {
    window.popupNav.myAlert = null;
  }

  onChange = (event) => {
    const { nativeEvent } = event;
    this.setState({
      value: nativeEvent.target.value,
    });
  }
  onConfirm = () => {
    const { value } = this.state;
    this.props.onConfirm(value);
  }
  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }
  render() {
    const { isShow, title, icon, placeholder } = this.props;
    const { value } = this.state;
    return (
      <QueueAnim delay={0} type="bottom">
        {
          isShow ? (
            <div key="prompt" className="model-overlay" onClick={this.onClose}>
              <div className="box my-prompt" onClick={(event) => { event.stopPropagation(); }}>
                <div className="title">{title}</div>
                <div className="content">
                  <div className="input-box">
                    <span className={`input-icon mdi mdi-${icon}`} />
                    <input placeholder={placeholder} value={value} onChange={this.onChange} />
                  </div>
                </div>
                <div className="button-box">
                  <Flex>
                    <Flex.Item style={{ margin: '0px' }}>
                      <Button onClick={this.onClose} className="modal-button">
                        <FormattedMessage id="CANCEL" />
                      </Button>
                    </Flex.Item>
                    <Flex.Item style={{ margin: '0px' }}>
                      <Button
                        onClick={this.onConfirm}
                        className="modal-button active-button"
                      >
                        <FormattedMessage id="CONFIRM" />
                      </Button>
                    </Flex.Item>
                  </Flex>
                </div>
              </div>
            </div>
          ) : <span />
        }
      </QueueAnim>
    );
  }
}

Prompt.defaultProps = {
  icon: 'pencil',
};

Prompt.propTypes = {
  isShow: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  icon: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export { Modal, Prompt };
