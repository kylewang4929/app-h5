import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { Slider, createTooltip, Toast } from 'antd-mobile';

import NavBar from '../../containers/NavBar';
import BackButton from '../../containers/MenuButton/BackButton';
import TimePick from '../../components/TimePick';
import MenuPage from '../../components/MenuPage';
import Scroll from '../../components/Scroll';

import { getItemForPk } from '../../utils/configExpand';
import CommonButton from '../../containers/MenuButton/CommonButton';
import router from '../../utils/router';
import { getLanguageString } from '../../utils/getLanguage';
import { formattingNum } from '../../utils/schedulerTool';

const SliderWithTooltip = createTooltip(Slider);

const styles = {
  container: {
  },
  box: {
    backgroundColor: '#fff',
    padding: '0.2rem',
    margin: '0.2rem 0',
  },
  title: {
    color: '#818181',
    fontSize: '0.26rem',
    padding: '0.16rem 0.2rem 0rem 0.2rem',
  },
  sliderContentBox: {
    textAlign: 'center',
    padding: '0.3rem 0.4rem 0.4rem 0.4rem',
    marginBottom: '0.5rem',
  },
  contentBox: {
    padding: '0rem 0.6rem',
  },
};

class SubTimingDetail extends Component {

  state = {
    hour: 0,
    min: 0,
    endHour: 0,
    endMin: 0,
    value: 0,
  };

  componentWillMount() {
    const { params, groupScheduler } = this.props;
    const { productKey, id, type } = params;
    const item = getItemForPk(productKey);
    this.config = item.groupScheduler;

    this.button = (
      <CommonButton
        onClick={this.onSave}
      >
        <div style={{ fontSize: '0.32rem' }}>
          <FormattedMessage id="SAVE" />
        </div>
      </CommonButton>
    );

    if (type === 'edit') {
      const activeScheduler = [];
      groupScheduler.data.data.map((item) => {
        const remark = JSON.parse(item.originalData.remark);
        if (remark.gid === id) {
          activeScheduler.push(item);
        }
      });
      let startItem = {};
      let endItem = {};
      activeScheduler.map((item) => {
        const remark = JSON.parse(item.originalData.remark);
        if (remark.type === 'start') {
          startItem = item;
        } else {
          endItem = item;
        }
      });
      
      const { attr } = this.config.featureList[0];
      this.setState({
        hour: startItem.time.hours,
        min: startItem.time.min,
        value: startItem.attrs[attr],
        endHour: endItem.time.hours,
        endMin: endItem.time.min,
        endItem,
        startItem,
      });
    } else {
      // 创建一个新的
      this.setState({
        hour: 12,
        min: 0,
        endHour: 13,
        endMin: 0,
        value: this.config.featureList[0].min,
      });
    }
  }

  onPickChange = (value) => {
    this.setState({
      hour: value[0],
      min: value[1],
    });
  }

  onSlideChange = (value) => {
    this.setState({
      value,
    });
  }

  onSave = () => {
    const { dispatch, params, language, groupScheduler, deviceData } = this.props;
    const { type, id, did } = params;
    const { hour, min, value, endHour, endMin, startItem, endItem } = this.state;
    const attr = this.config.featureList[0].attr;
    const attrs = {};
    attrs[attr] = value;

    const endAttrs = {};
    // 这里需要获取这个设备的防冻温度
    console.log('deviceData', deviceData);
    console.log('did', did);
    const temp = deviceData[did].data.antifreeze_temperature;
    if (temp === 0) {
      endAttrs[attr] = 0;
    } else {
      endAttrs[attr] = temp || 10;
    }

    // 计算开始时间是否小于结束时间
    if ((hour * 60) + min >= (endHour * 60) + endMin) {
      // 提示冲突
      const START_TIME_CANNOT_BE_GREATER_THAN_END_TIME = getLanguageString(language.key, 'START_TIME_CANNOT_BE_GREATER_THAN_END_TIME');
      Toast.show(START_TIME_CANNOT_BE_GREATER_THAN_END_TIME, 2);
      return;
    }

    // 计算时间区间是否冲突 先获取时间区间
    const timeRange = {};
    groupScheduler.data.data.map((item) => {
      const remark = JSON.parse(item.originalData.remark);
      if (remark.gid !== id && item.type !== 'delete') {
        if (!timeRange[remark.gid]) {
          timeRange[remark.gid] = {};
        }
        timeRange[remark.gid][remark.type] = (item.time.hours * 60) + item.time.min;
      }
    });
    // map 对比时间是否合法
    let isLegitimacy = true;
    let illegalityItem = {};
    const startTime = (hour * 60) + min;
    const endTime = (endHour * 60) + endMin;
    for (const key in timeRange) {
      if (startTime >= timeRange[key].start && startTime <= timeRange[key].end) {
        isLegitimacy = false;
        illegalityItem = timeRange[key];
      }
      if (endTime >= timeRange[key].start && endTime <= timeRange[key].end) {
        isLegitimacy = false;
        illegalityItem = timeRange[key];
      }
    }
    // if (!isLegitimacy) {
    //   // 提示不合法
    //   const startTimeText = `${formattingNum(parseInt(illegalityItem.start / 60))}:${formattingNum(parseInt(illegalityItem.start % 60))}`;
    //   const endTimeText = `${formattingNum(parseInt(illegalityItem.end / 60))}:${formattingNum(parseInt(illegalityItem.end % 60))}`;
    //   const CONFLICT_WITH_THE_FOLLOWING_PERIOD = getLanguageString(language.key, 'CONFLICT_WITH_THE_FOLLOWING_PERIOD');
    //   Toast.show(`${CONFLICT_WITH_THE_FOLLOWING_PERIOD}: ${startTimeText}-${endTimeText}`, 2);
    //   return;
    // }

    if (type === 'edit') {
      dispatch({
        type: 'groupScheduler/updateTiming',
        payload: {
          hour,
          min,
          endHour,
          endMin,
          attrs,
          id: startItem.id,
          endId: endItem.id,
          endAttrs,
        },
      });
    } else {
      // create
      dispatch({
        type: 'groupScheduler/createTiming',
        payload: {
          hour,
          min,
          endHour,
          endMin,
          attrs,
          endAttrs,
        },
      });
    }
    router.goBack(-1);
  }

  onEndTimePickChange = (value) => {
    this.setState({
      endHour: value[0],
      endMin: value[1],
    });
  }

  render() {
    const { hour, min, endHour, endMin, value } = this.state;

    // 这里加了拓展 暂时直接读取第一条
    const expandName = this.config.featureList[0].label;
    const expandMin = this.config.featureList[0].min;
    const expandMax = this.config.featureList[0].max;

    return (
      <div>
        <NavBar
          title="DETAIL"
          rightButton={this.button}
          leftButton={<BackButton />}
          right={this.rightButton}
        />
        <MenuPage>
          <Scroll bounce>
            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id={expandName} /> {`${value}℃`}
              </div>
              <div ref={state => this.dom = state} style={styles.sliderContentBox}>
                <SliderWithTooltip
                  defaultValue={value}
                  min={expandMin}
                  max={expandMax}
                  onChange={this.onSlideChange}
                />
              </div>
            </div>

            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="START_TIME" />
              </div>
              <div style={styles.contentBox}>
                <TimePick onChange={this.onPickChange} value={[hour, min]} />
              </div>
            </div>

            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="END_TIME" />
              </div>
              <div style={styles.contentBox}>
                <TimePick onChange={this.onEndTimePickChange} value={[endHour, endMin]} />
              </div>
            </div>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

SubTimingDetail.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceData: state.deviceData,
    groupScheduler: state.groupScheduler,
  };
}


export default connect(mapStateToProps)(SubTimingDetail);
