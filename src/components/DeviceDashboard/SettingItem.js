import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { SliderItem } from './Item';

const styles = {
  container: {
    borderRadius: '0.1rem',
    backgroundColor: '#fff',
    margin: '0.18rem 0',
    position: 'relative',
    zIndex: 99,
  },
  label: {
    padding: '0.4rem 0.3rem 0rem 0.3rem',
    fontSize: '0.32rem',
  },
  sliderTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.2rem',
    padding: '0 0.3rem',
  },
  sliderBox: {
    padding: '0.3rem 0rem 0.2rem 0',
  },
  sliderLabel: {
    flex: 1,
    fontSize: '0.3rem',
    color: 'rgb(128, 199, 232)',
  },
  sliderValue: {
    width: '2rem',
    textAlign: 'right',
    fontSize: '0.3rem',
    color: '#797979',
  },
  sliderUnit: {
    color: 'rgb(255, 161, 18)',
    fontSize: '0.26rem',
  },
  border: {
    borderBottom: '0.02rem solid rgba(214,214,214,0.2)',
  },
};
class SettingItem extends Component {
  formattingNum = (num) => {
    return (Array(2).join(0) + num).slice(-2);
  }
  onTempChange = (value) => {
    // 小数点是0.1
    value = parseFloat(value);
    value = value.toFixed(1);
    const { onChange } = this.props;
    const { data } = this.props;
    data.temp = parseFloat(value);
    onChange(data);
  }
  onTimeChange = (value) => {
    const { onChange } = this.props;
    const { data } = this.props;
    data.time = value;
    onChange(data);
  }
  render() {
    const { data, onChange } = this.props;
    return (
      <div className="z-depth-1" style={styles.container}>
        <div style={styles.label}>Phase {data.index + 1}</div>
        <SliderBox
          onChange={this.onTempChange}
          onAfterChange={this.onTempChange}
          value={data.temp}
          valueText={data.temp}
          unit={'°C'}
          label="Temperature"
          border
          min={32}
          step={0.1}
          max={90}
        />
        <SliderBox
          onChange={this.onTimeChange}
          onAfterChange={this.onTimeChange}
          value={data.time}
          valueText={`${this.formattingNum(parseInt(data.time / 60))}:${this.formattingNum(data.time % 60)}`}
          label="Time"
          min={0}
          step={1}
          max={600}
        />
      </div>
    );
  }
}

SettingItem.defaultProps = {
  onTempChange: () => {},
  onTimeChange: () => {},
};

const SliderBox = ({ border, label, value, valueText, unit, onChange, min, max, onAfterChange, step }) => {
  return (
    <div style={{ ...styles.sliderBox, ...border ? styles.border : {} }}>
      <div style={styles.sliderTitle}>
        <div style={styles.sliderLabel}>{label}</div>
        <div style={styles.sliderValue}>{valueText}<span style={styles.sliderUnit}>{unit}</span></div>
      </div>
      <SliderItem step={step} disableHandle min={min} max={max} onAfterChange={onAfterChange} onChange={onChange} value={value} />
    </div>
  );
};

export default SettingItem;
