import React, { Component, PropTypes } from 'react';
import { Button, Flex } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

const tipsStyles = {
  container: {
    position: 'fixed',
    width: '100%',
    left: '0px',
    top: '0px',
    zIndex: 2000,
    backgroundColor: '#00c3ff',
    color: '#fff',
    textAlign: 'center',
    padding: '0.4rem 0.4rem 0.6rem 0.4rem',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#fff',
    borderRadius: '5rem',
    border: '0.02rem solid #fff',
    width: '2.5rem',
    margin: 'auto',
    height: '0.7rem',
    lineHeight: '0.68rem',
    fontSize: '0.3rem',
  },
  buttonRightBorder: {
    borderRight: '0.02rem solid rgba(0,0,0,0.1)',
  },
  text: {
    padding: '0.4rem 0 0.54rem 0',
    fontSize: '0.32rem',
  },
};
class Tips extends Component {
  render() {
    const { onCancel, onConfirm, text } = this.props;
    return (
      <div style={tipsStyles.container}>
        <div style={tipsStyles.text}>{text}</div>
        <Flex>
          {
            onCancel ? (
              <Flex.Item>
                <Button onClick={onCancel} style={tipsStyles.button}>
                  <FormattedMessage id="CANCEL" />
                </Button>
              </Flex.Item>
            ) : null
          }
          {
            onConfirm ? (
              <Flex.Item>
                <Button onClick={onConfirm} style={tipsStyles.button}>
                  <FormattedMessage id="CONFIRM" />
                </Button>
              </Flex.Item>
            ) : null
          }
        </Flex>
      </div>
    );
  }
}

Tips.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  text: PropTypes.string,
};

export default Tips;
