import React, { Component } from 'react';
import { Flex } from 'antd-mobile';

const FlexItem = Flex.Item;

require('./defaultListStyles.less');

const defaultStyles = {
  iconBox: {
    maxWidth: '1.6rem',
    textAlign: 'right',
  },
  icon: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: '#fff',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '1rem',
    fontSize: '0.48rem',
  },
  item: {
    textAlign: 'center',
    padding: '0.5rem 0 0.54rem 0',
  },
  textBox: {
    textAlign: 'left',
    paddingLeft: '0.26rem',
    fontSize: '0.3rem',
    marginTop: '-0.08rem',
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: '0.2rem',
    width: '2.4rem',
  },
  tips: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: '0.2rem',
    width: '1.6rem',
    marginTop: '0.1rem',
  },
  button: {
    display: 'inline-block',
    height: '0.56rem',
    padding: '0 0.6rem',
    lineHeight: '0.56rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: '0.1rem',
  },
  buttonBox: {
    textAlign: 'right',
    paddingRight: '0.6rem',
  },
};
class DefaultItem extends Component {
  render() {
    return (
      <div className="scenario-list-item-container">
        <div className="scenario-list-item">
          <div className="flash-animate" />
          <Flex>
            <FlexItem style={{ ...defaultStyles.item, ...defaultStyles.iconBox }}>
              <span style={{ ...defaultStyles.icon }} />
            </FlexItem>
            <FlexItem style={{ ...defaultStyles.item, ...defaultStyles.textBox }}>
              <div style={defaultStyles.text} />
              <div style={defaultStyles.tips} />
            </FlexItem>
            <FlexItem style={{ ...defaultStyles.item, ...defaultStyles.buttonBox }}>
              <div style={defaultStyles.button}></div>
            </FlexItem>
          </Flex>
        </div>
      </div>
    );
  }
}

class DefaultList extends Component {
  render() {
    return (
      <div style={defaultStyles.container}>
        <DefaultItem />
        <DefaultItem />
      </div>
    );
  }
}

export default DefaultList;
