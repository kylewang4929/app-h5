import React, { Component } from 'react';
import { SwipeAction, Switch, Modal } from 'antd-mobile';

const styles = {
  itemContainerBox: {
    marginBottom: '1px',
  },
  dl: {
    backgroundColor: '#da5f5a',
    color: 'white',
    width: '1rem',
  },
  at: {
    fontSize: '.2rem',
  },
  item: {
    position: 'relative',
  },
  it: {
    height: '100%',
    fontSize: '.24rem',
  },
  hf: {
    height: '50%',
    boxSizing: 'boeder-box',
    paddingLeft: '.2rem',
    color: '#9a9a9a',
  },
  tm: {
    color: 'black',
    fontSize: '.28rem',
    marginRight: '.6rem',
  },
  swh: {
    position: 'absolute',
    right: '.3rem',
    top: '0rem',
  },
};

function formattingNum(num) {
  return (Array(2).join(0) + num).slice(-2);
}

class TimimgItem extends Component {

  render() {
    const { data, onDelete, onClick, onSwitch } = this.props;
    const { startTime, endTime, level, weeks } = data;
    const days = weeks.map((v) => {
      if (v.value) return v.label;
    }).filter(v => v);
    return (
      <div style={styles.itemContainerBox} >
        <SwipeAction
          autoClose
          right={[
            {
              text: <div style={styles.at}>删除</div>,
              onPress: () => {
                Modal.alert(' ', '确定删除定时?', [
                  { text: '取消', onPress: () => console.log('cancel') },
                  { text: '确定', onPress: () => onDelete(data) },
                ]);
              },
              style: styles.dl,
            },
          ]}
        >
          <div
            className="device-list-item  active"
            style={styles.item}
            onClick={(event) => {
              event.stopPropagation();
              onClick(data, event);
            }}
          >
            <div style={styles.it}>
              <div style={{ ...styles.hf, lineHeight: '.6rem' }}>
                <span style={styles.tm}>
                  {`${formattingNum(startTime[0])}:${formattingNum(startTime[1])}-${formattingNum(endTime[0])}:${formattingNum(endTime[1])}`}
                </span>
                档位：{level}
              </div>
              <div style={{ ...styles.hf, lineHeight: '.4rem' }}>{days.join('、')}</div>
            </div>
            <div style={styles.swh}>
              <Switch
                checked={data.onlineStatus}
                onChange={checked => onSwitch(data, checked)}
              />
            </div>
          </div>
        </SwipeAction>
      </div>
    );
  }
}


export default TimimgItem;

