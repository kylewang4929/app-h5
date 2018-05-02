import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Button } from 'antd-mobile';

const FlexItem = Flex.Item;

require('./defaultListStyles.less');

const itemStyles = {
  itemContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  borderBottom: {
    borderBottom: '0.01rem solid rgba(0,0,0,0.08)',
  },
  borderTop: {
    borderTop: '0.01rem solid rgba(0,0,0,0.08)',
  },
  buttonDisable: {
    opacity: 0.5,
    border: '1px solid rgba(0,0,0,0.2)',
    color: '#909090',
  },
  iconBox: {
    maxWidth: '1.6rem',
    textAlign: 'right',
  },
  buttonBox: {
    textAlign: 'right',
    padding: '0.5rem 0.5rem 0.54rem 0',
  },
  icon: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    backgroundColor: '#67b337',
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
  },
  tips: {
    fontSize: '0.26rem',
    paddingTop: '0.08rem',
    color: '#909090',
  },
  button: {
    display: 'inline-block',
    height: '0.64rem',
    padding: '0 0.4rem',
    lineHeight: '0.64rem',
    fontSize: '0.3rem',
  },
};
class Item extends Component {

  onAction = () => {
    const { onAction, data } = this.props;
    onAction(data);
  }

  onClick = () => {
    const { onClick, data } = this.props;
    onClick(data);
  }

  render() {
    const { data } = this.props;
    const { icon, name, tips, backgroundColor, isDefault, isPreset, tasks } = data;
    let { index } = this.props;
    index = Number.parseInt(index);
    const disableAction = (isPreset && isDefault) || (tasks && tasks.length === 0);
    const { properties } = this.context;
    return (
      <div
        style={{
          ...itemStyles.itemContainer,
          ...itemStyles.borderBottom,
          ...index === 0 ? itemStyles.borderTop : {},
        }}
        onClick={this.onClick}
      >
        <Flex>
          <FlexItem style={{ ...itemStyles.item, ...itemStyles.iconBox }}>
            <span style={{ ...itemStyles.icon, backgroundColor: backgroundColor || properties.tintColor }} className={icon || 'mdi mdi-view-dashboard'} />
          </FlexItem>
          <FlexItem style={{ ...itemStyles.item, ...itemStyles.textBox }}>
            <div style={itemStyles.text}>
              <FormattedMessage id={name} />
            </div>
            {
              tips ? (
                <div style={itemStyles.tips}>
                  {tips}
                </div>
              ) : null
            }
          </FlexItem>
          <FlexItem style={{ ...itemStyles.item, ...itemStyles.buttonBox }}>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                if (disableAction) return;
                this.onAction();
              }}
              style={{ ...itemStyles.button, ...disableAction ? itemStyles.buttonDisable : {} }}
              type="ghost"
            >
              <FormattedMessage id="EXECUTION" />
            </Button>
          </FlexItem>
        </Flex>
      </div>
    );
  }
}

Item.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
  onAction: PropTypes.func,
  index: PropTypes.any,
};

Item.contextTypes = {
  properties: PropTypes.object.isRequired,
};

export default Item;
