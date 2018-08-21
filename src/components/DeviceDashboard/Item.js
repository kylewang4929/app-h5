import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Slider from '../Slider';
import { formattingNum } from '../../utils/tool';

const logo = require('../../assets/logo.png');

const itemStyles = {
  itemContainerBox: {
    backgroundColor: '#fff',
    margin: '0.2rem',
    borderRadius: '0.1rem',
    overflow: 'hidden',
    color: '#797979',
    position: 'relative',
    zIndex: 1,
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
    fontSize: '0.24rem',
    color: 'rgb(255, 161, 18)',
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
  sliderBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 0.3rem',
    color: '#80c7e8',
  },
  sliderBoxIcon: {
  },
  slider: {
    flex: 1,
    height: '0.68rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 0.3rem',
  },
  flagIcon: {
    fontSize: '0.3rem',
    position: 'relative',
    top: '0.02rem',
  },
};
class Item extends Component {
  getDeviceData = () => {
    const { data, deviceData } = this.props;
    return deviceData[data.did] || {};
  }
  onAfterChange = (value) => {
    // 发送数据点
    const { dispatch } = this.props;
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        data: { Settemp_Para: value },
      },
    });
  }
  getFlag = () => {
    const deviceData = this.getDeviceData();
    const { Busy_Type_Bit0, Busy_Type_Bit1, Busy_Flag } = deviceData.data;
    if (Busy_Flag) {
      if (Busy_Type_Bit0) {
        return <div style={itemStyles.flagBox}><span style={itemStyles.flagIcon} className="mdi mdi-fire" />Heating</div>;
      }
      if (Busy_Type_Bit1) {
        return <div style={itemStyles.flagBox}><span style={itemStyles.flagIcon} className="mdi mdi-cookie" />Cooking</div>;
      }
    }
    return null;
  }
  render() {
    const { data } = this.props;
    const deviceData = this.getDeviceData();

    const { Currtemp_Para, Settemp_Para, Resttime_Para } = deviceData.data;
    const resttime = `${formattingNum(parseInt(Resttime_Para / 60))}:${formattingNum(parseInt(Resttime_Para % 60))}`;


    const flag = this.getFlag();
    return (
      <div className="z-depth-1" style={itemStyles.itemContainerBox}>
        <div style={itemStyles.containerInner}>
          <div style={itemStyles.titleBox}>
            <img src={logo} style={itemStyles.titleLogo} />
            <div style={itemStyles.titleText}>
              {data.name}
            </div>
            <div style={{ ...itemStyles.titleState }}>
              {flag}
            </div>
          </div>
          <div style={itemStyles.statusBar}>
            <ItemStatusBar active icon="mdi mdi-oil-temperature" label="当前温度" value={Currtemp_Para / 10} unit="℃" />
            <ItemStatusBar icon="mdi mdi-history" label="时间" value={`-${resttime}`} unit="" />
            <ItemStatusBar icon="mdi mdi-oil-temperature" label="设置温度" value={Settemp_Para} unit="℃" />
          </div>
          <SliderItem
            min={0}
            max={90}
            value={Settemp_Para}
            step={5}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
          />
        </div>
      </div>
    );
  }
}

export const SliderItem = ({ value, onChange, step = 1, onAfterChange, min, max, disableHandle }) => {
  return (
    <div style={itemStyles.sliderBox}>
      <span className="mdi mdi-minus" style={itemStyles.sliderBoxIcon} />
      <div style={itemStyles.slider}>
        <Slider
          defaultValue={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onAfterChange={onAfterChange}
          disableHandle
        />
      </div>
      <span className="mdi mdi-plus" style={itemStyles.sliderBoxIcon} />
    </div>
  );
};

const statusBarStyles = {
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  activeButton: {
    color: '#48b4df',
    fontSize: '0.28rem',
    textAlign: 'center',
    marginTop: '0.2rem',
  },
  activeText: {
    padding: '0.1rem',
    fontSize: '0.6rem',
    fontWeight: '400',
  },
};

class ItemStatusBar extends Component {
  render() {
    const { icon, unit, value, label, border, active } = this.props;
    return (
      <div style={statusBarStyles.item}>
        {
          active ? (
            <div>
              <div style={statusBarStyles.activeButton}>
                {label}
              </div>
              <div style={statusBarStyles.titleBox}>
                <span style={statusBarStyles.activeText}>
                  {value}
                </span>
                <span style={statusBarStyles.unit}>
                  {unit}
                </span>
              </div>
            </div>
          ) : (
            <div>
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
            </div>
          )
        }

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
