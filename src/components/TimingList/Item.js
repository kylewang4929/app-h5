import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwipeAction, List, Switch } from 'antd-mobile';

require('./defaultListStyles.less');

const itemStyles = {
  itemContainer: {
    height: '1.4rem',
    position: 'relative',
  },
  tipsText: {
    marginRight: '0.06rem',
  },
  content: {
    height: '100%',
    padding: '0rem 0.16rem',
  },
  title: {
    fontSize: '0.32rem',
    fontWeight: 'bold',
  },
  tips: {
    fontSize: '0.26rem',
    color: '#909090',
  },
  rightContent: {
    position: 'absolute',
    paddingRight: '0.2rem',
    right: '0rem',
    top: '0rem',
    textAlign: 'right',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  rightTips: {
    marginTop: '-0.1rem',
  },
  hidden: {
    display: 'none',
  },
  rightText: {
    fontSize: '0.26rem',
    color: '#909090',
    display: 'inline-block',
    marginRight: '0.2rem',
    marginTop: '-0.06rem',
  },
  rightTextIcon: {
    fontSize: '0.34rem',
    position: 'relative',
    top: '0.04rem',
    right: '0.01rem',
  },
};
class Item extends Component {

  state = {
    value: false,
  }

  componentWillMount() {
    const { data } = this.props;
    this.setState({
      value: data.isActive,
    });
    // 兼容没有设置数据点的情况
    this.powerAttr = this.props.powerAttr || 'power';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.attrs[this.powerAttr] !== this.props.data.attrs[this.powerAttr]) {
      const { data } = this.props;
      this.setState({
        value: data.isActive,
      });
    }
  }

  onChange = (value) => {
    this.setState({
      value,
    });
    const { data } = this.props;
    this.props.onSwitch(data, value);
  }

  delete = () => {
    const { onDelete, data } = this.props;
    onDelete(data);
  }

  edit = () => {
    const { onEdit, data } = this.props;
    onEdit(data);
  }

  render() {
    const { data, onClick, editText, deleteText, expand, hidePowerTips } = this.props;
    const { value } = this.state;

    return (
      <div className="timing-list-item-container">
        <SwipeAction
          autoClose
          right={[
            {
              text: editText,
              onPress: this.edit,
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: deleteText,
              onPress: this.delete,
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
        >
          <List.Item
            className="timing-list-item"
            style={itemStyles.itemContainer}
            onClick={() => {
              onClick(data);
            }}
          >
            <div style={itemStyles.content}>
              <div style={itemStyles.title}>{data.timeText}</div>
              <div style={itemStyles.tips}>
                {
                  data.repeatText.map((item, index) => {
                    return (
                      <span style={itemStyles.tipsText}key={index}>
                        <FormattedMessage id={item} />
                      </span>
                    );
                  })
                }
              </div>
            </div>
            <div style={itemStyles.rightContent}>
              <div style={itemStyles.rightText}>
                {
                  hidePowerTips ? null : (
                    <div>
                      <span style={itemStyles.rightTextIcon} className="mdi mdi-power" />            
                      {
                        data.attrs[this.powerAttr] ? <FormattedMessage id="OPEN_DEVICE" /> : <FormattedMessage id="CLOSE_DEVICE" />
                      }
                    </div>
                  )
                }
                {
                  expand ? (
                    <div style={itemStyles.rightTips}>
                      {expand}
                    </div>
                  ) : null
                }
              </div>
              <div onClick={(event) => {
                event.stopPropagation();
              }}>
                <Switch onChange={this.onChange} checked={value} />
              </div>
            </div>
          </List.Item>
        </SwipeAction>
      </div>
    );
  }
}

Item.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSwitch: PropTypes.func,
  deleteText: PropTypes.string,
  editText: PropTypes.string,
};

export default Item;
