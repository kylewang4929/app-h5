import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { SwipeAction, Modal } from 'antd-mobile';

require('./defaultListStyles.less');
const logo = require('../../assets/logo.png');


const itemStyles = {
  itemContainerBox: {
    backgroundColor: '#fff',
    margin: '0.2rem',
    borderRadius: '0.1rem',
    overflow: 'hidden',
    color: '#797979',
  },
  containerInner: {
    padding: '0.2rem 0',
  },
  titleLogo: {
    width: '0.8rem',
    height: '0.8rem',
    paddingRight: '0.2rem',
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0rem 0.2rem',
  },
  titleText: {
    flex: 1,
    fontSize: '0.3rem',
  },
  titleState: {
    padding: '0 0.2rem',
    fontSize: '0.26rem',
    color: '#b1b1b1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  onLineText: {
    color: '#18c259',
  },
  statusBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBarItem: {
    flex: 1,
  },
  point: {
    fontSize: '0.14rem',
    marginRight: '0.04rem',
  },
  rename: {
    backgroundColor: '#eec75e',
    color: 'white',
    width: '1rem',
    fontSize: '0.26rem',
  },
  delete: {
    backgroundColor: '#da5f5a',
    color: 'white',
    width: '1rem',
    fontSize: '0.26rem',
  },
};
class Item extends Component {
  prompt = () => {
    const { data } = this.props;
    const { onRename } = this.props;
    Modal.prompt('重命名', null,
      [
        { text: '取消' },
        {
          text: '确认',
          onPress: (value) => {
            onRename(data, value);
          },
        },
      ], 'default', data.name);
  }

  getDeviceData = () => {
    const { data, deviceData } = this.props;
    return deviceData[data.did] || {};
  }

  render() {
    const { data, onDelete, onClick } = this.props;
    const deviceData = this.getDeviceData();
    const { Currtemp_Para, Settemp_Para, Resttime_Para } = deviceData.data;
    const resttime = moment().second(Resttime_Para).format('MM:ss');
    return (
      <div className="z-depth-1" style={itemStyles.itemContainerBox}>
        <SwipeAction
          autoClose
          right={[
            {
              text: <div style={itemStyles.at}>重命名</div>,
              onPress: () => this.prompt(data),
              style: itemStyles.rename,
            },
            {
              text: <div style={itemStyles.at}>删除</div>,
              onPress: () => onDelete(data),
              style: itemStyles.delete,
            },
          ]}
        >
          <div style={itemStyles.containerInner} onClick={onClick.bind(null, data)}>
            <div style={itemStyles.titleBox}>
              <img src={logo} style={itemStyles.titleLogo} />
              <div style={itemStyles.titleText}>
                {data.name}
              </div>
              <div style={{ ...itemStyles.titleState, ...data.netStatus === 2 ? itemStyles.onLineText : {} }}>
                <span className="mdi mdi-brightness-1" style={itemStyles.point} />
                {data.netStatus === 2 ? '在线' : '离线'}
              </div>
            </div>
            {
              data.netStatus === 2 ? (
                <div style={itemStyles.statusBar}>
                  <ItemStatusBar icon="mdi mdi-oil-temperature" label="当前温度" value={Currtemp_Para} unit="℃" />
                  <ItemStatusBar icon="mdi mdi-history" label="时间" value={`-${resttime}`} unit="" border />
                  <ItemStatusBar icon="mdi mdi-oil-temperature" label="设置温度" value={Settemp_Para} unit="℃" />
                </div>
              ) : null
            }
          </div>
        </SwipeAction>
      </div>
    );
  }
}

const statusBarStyles = {
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '0.2rem',
    position: 'relative',
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.28rem',
  },
  icon: {
    color: '#4bb4c3',
  },
  unit: {
    color: '#ffa112',
  },
  text: {
    padding: '0.1rem',
    fontSize: '0.32rem',
  },
  button: {
    fontSize: '0.22rem',
    display: 'inline-block',
    padding: '0.05rem 0.1rem',
    borderRadius: '0.3rem',
    backgroundImage: 'linear-gradient(to bottom,#48b4df,#75d5ef)',
    color: '#fff',
    width: '1.2rem',
    textAlign: 'center',
  },
  border: {
    position: 'absolute',
    top: '50%',
    width: '0.02rem',
    height: '0.3rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginTop: '-0.2rem',
  },
  left: {
    left: '0px',
  },
  right: {
    right: '0px',
  },
};

class ItemStatusBar extends Component {
  render() {
    const { icon, unit, value, label, border } = this.props;
    return (
      <div style={statusBarStyles.item}>
        <div style={statusBarStyles.titleBox}>
          <span className={`mdi ${icon}`} style={statusBarStyles.icon} />
          <span style={statusBarStyles.text}>
            {value}
          </span>
          <span style={statusBarStyles.unit}>
            {unit}
          </span>
        </div>
        <div style={statusBarStyles.button}>
          {label}
        </div>

        {
          border ? (
            <div>
              <div style={{ ...statusBarStyles.border, ...statusBarStyles.left }} />
              <div style={{ ...statusBarStyles.border, ...statusBarStyles.right }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}

Item.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};

Item.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    deviceData: state.deviceData,
    language: state.language,
  };
}

export default connect(mapStateToProps)(Item);
