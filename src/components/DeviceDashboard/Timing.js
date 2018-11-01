import React, { Component } from 'react';
import { SwipeAction } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    color: '#797979',
  },
  addItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: '-0.24rem 0.4rem 0.2rem 0.4rem',
    borderRadius: '0.1rem',
    padding: '0.2rem 0.2rem',
    position: 'relative',
    zIndex: 0,
  },
  addItemRightText: {
    fontSize: '0.28rem',
    color: '#4bb4c3',
  },
  addItemTitleBox: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  addItemTitle: {
    fontSize: '0.28rem',
  },
  addItemTips: {
    fontSize: '0.21rem',
    paddingTop: '0.06rem',
  },
};


class List extends Component {
  getTiming = (data, stage) => {
    const list = [];
    let index = 0;
    for (let i = 0; i < stage * 4; i += 4) {
      // 获取温度
      const temp = data[i] + data[i + 1];
      const time = data[i + 2] + data[i + 3];
      // 构建列表
      const item = {
        temp,
        time,
        index,
      };
      list.push(item);
      index += 1;
    }
    return list;
  }
  render() {
    const { deviceData, onDelete, onAdd } = this.props;
    const { Cook_Para, Cookstage_Para } = deviceData.data;
    const data = this.getTiming(Cook_Para, Cookstage_Para);
    return (
      <div style={styles.container}>
        {
          data.map((item, index) => {
            return <Item onDelete={onDelete} key={index} data={item} />;
          })
        }
        {
          Cookstage_Para < 5 ? <AddItem onAdd={onAdd} /> : null
        }
      </div>
    );
  }
}

export const AddItem = ({ onAdd }) => {
  return (
    <div style={styles.addItem} className="z-depth-1">
      <div style={styles.addItemTitleBox}>
        <span style={styles.addItemTitle}>
          <FormattedMessage id="ADVANCED_SETTING" />
        </span>
        <span style={styles.addItemTips}>
          <FormattedMessage id="BREAK_THE_COOKING_CYCLE_INTO_MUITIPLE_PHASES" />
        </span>
      </div>
      <div onClick={onAdd} style={styles.addItemRightText}>
        <FormattedMessage id="ADD" />
      </div>
    </div>
  );
};

const itemStyles = {
  container: {
    backgroundColor: '#fff',
    margin: '0.2rem 0.2rem',
    borderRadius: '0.1rem',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  containerInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0.38rem 0.3rem',
  },
  delete: {
    backgroundColor: '#da5f5a',
    color: 'white',
    width: '1rem',
    fontSize: '0.26rem',
  },
  title: {
    width: '2rem',
  },
  value: {
    flex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#4bb4c3',
    fontSize: '0.24rem',
  },
  unit: {
    fontSize: '0.24rem',
    color: '#ffa112',
  },
  valueText: {
    padding: '0 0.1rem',
  },
};
class Item extends Component {
  formattingNum = (num) => {
    return (Array(2).join(0) + num).slice(-2);
  }
  render() {
    const { onDelete, data } = this.props;
    return (
      <div className="z-depth-1" style={itemStyles.container}>
        <SwipeAction
          autoClose
          right={[
            {
              text: <div style={itemStyles.at}><FormattedMessage id="DELETE" /></div>,
              onPress: () => onDelete(data),
              style: itemStyles.delete,
            },
          ]}
        >
          <div style={itemStyles.containerInner}>
            <span style={itemStyles.title}>
              <FormattedMessage id="PHASE" /> {data.index + 1}
            </span>
            <ValueItem icon="oil-temperature" value={data.temp} unit="℃" />
            <ValueItem icon="history" value={`-${this.formattingNum(parseInt(data.time / 60))}:${this.formattingNum(data.time % 60)}`} unit="" />
          </div>
        </SwipeAction>
      </div>
    );
  }
}

const ValueItem = ({ icon, value, unit }) => {
  return (
    <div style={itemStyles.value}>
      <span className={`mdi mdi-${icon}`} style={itemStyles.icon} />
      <span style={itemStyles.valueText}>{value}</span>
      <span style={itemStyles.unit}>{unit}</span>
    </div>
  );
};

export default List;
