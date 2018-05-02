import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { SegmentedControl, PickerView, createTooltip, Slider } from 'antd-mobile';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import Scroll from '../../components/Scroll';
import router from '../../utils/router';
import BackButton from '../../containers/MenuButton/BackButton';
import CommonButton from '../../containers/MenuButton/CommonButton';
import ButtonGroup from '../../components/ButtonGroup';
import { getLanguageString } from '../../utils/getLanguage';
import Toast from '../../utils/Toast';
import NavBar from '../../containers/NavBar';
import { getItemForPk } from '../../utils/configExpand';
import MenuPage from '../../components/MenuPage';
import InfoAlert from '../../components/InfoAlert';
import TimePick from '../../components/TimePick';

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
  segContentBox: {
    textAlign: 'center',
    padding: '0.3rem 0',
  },
  sliderContentBox: {
    textAlign: 'center',
    padding: '0.3rem 0.4rem',
  },
  contentBox: {

  },
  seg: {
    width: '4.2rem',
    margin: 'auto',
  },
  repeatContentBox: {
    padding: '0.4rem 0.3rem',
  },
};

class TimingListPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hours: 0,
      min: 0,
      power: true,
      enabled: true,
      repeat: [
        { active: false, text: 'SUN', id: 'sun' },
        { active: true, text: 'MON', id: 'mon' },
        { active: false, text: 'TUE', id: 'tue' },
        { active: false, text: 'WED', id: 'wed' },
        { active: false, text: 'THU', id: 'thu' },
        { active: false, text: 'FRI', id: 'fri' },
        { active: false, text: 'SAT', id: 'sat' },
      ],
      expand: {},
    };
  }

  componentWillMount() {
    this.button = (
      <CommonButton
        onClick={this.onSave}
      >
        <div style={{ fontSize: '0.32rem' }}>
          <FormattedMessage id="SAVE" />
        </div>
      </CommonButton>
    );
    const { params, scheduler } = this.props;
    const { type, id } = params;
    const activeScheduler = this.filterScheduler(id, scheduler.data);
    /**
     * 判断开关对应的数据点是什么
     */
    const { productKey } = params;
    const item = getItemForPk(productKey);
    this.powerAttr = item.powerAttr || 'power';

    // 获取默认的数据点的值
    this.updateExpandData(item, activeScheduler);

    if (type === 'edit') {
      this.updateState(activeScheduler);
    }
    if (type === 'create') {
      this.getCurrentStatus();
    }
  }

  updateExpandData = (configItem, scheduler) => {
    let settingObj = {};
    if (configItem.scheduler && configItem.scheduler.featureList && configItem.scheduler.featureList.length > 0) {
      settingObj = configItem.scheduler.featureList[0];
    }

    if (settingObj.type === 'Number') {
      if (scheduler) {
        const value = scheduler.attrs[settingObj.attr] || settingObj.min;
        this.setState({
          expand: { ...settingObj, value },
        });
      } else {
        this.setState({
          expand: { ...settingObj, value: settingObj.min },
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scheduler.data !== this.props.scheduler.data) {
      const { params } = this.props;
      const { type, id } = params;
      if (type === 'edit') {
        const activeScheduler = this.filterScheduler(id, nextProps.scheduler.data);
        this.updateState(activeScheduler);
      }
    }
  }

  updateState = (obj) => {
    if (obj) {
      const { time, repeat, attrs } = obj;
      this.setState({
        hours: time.hours,
        min: time.min,
        repeat,
        power: attrs[this.powerAttr],
        enabled: obj.isActive,
      });
    }
  }

  // 匹配到当前编辑的定时
  filterScheduler = (id, list) => {
    let activeIndex = null;
    list.map((item, index) => {
      if (item.id === id) {
        activeIndex = index;
      }
    });
    if (activeIndex != null) {
      return list[activeIndex];
    } else {
      return null;
    }
  }

  getCurrentStatus = () => {
    // 获取当前时间和周几 更新到UI
    const date = moment();
    let weekday = date.weekday();

    const status = {
      hours: date.get('hour'),
      min: date.get('minute'),
      power: true,
      enabled: true,
      repeat: [
        { active: false, text: 'SUN', id: 'sun' },
        { active: false, text: 'MON', id: 'mon' },
        { active: false, text: 'TUE', id: 'tue' },
        { active: false, text: 'WED', id: 'wed' },
        { active: false, text: 'THU', id: 'thu' },
        { active: false, text: 'FRI', id: 'fri' },
        { active: false, text: 'SAT', id: 'sat' },
      ],
    };
    status.repeat[weekday].active = true;
    this.setState({
      ...status,
    });
  }

  onButtonClick = (value) => {
    let { repeat } = this.state;
    repeat.map((item, index) => {
      if (item.id === value.id) {
        repeat[index].active = !repeat[index].active;
      }
    });
    this.setState({
      repeat,
    });
  }

  // 时间选择器发生改变
  onPickChange = (value) => {
    this.setState({
      hours: value[0],
      min: value[1],
    });
  }

  // seg发生改变
  onSegChange = (e) => {
    const value = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      power: value === 1 ? false : true
    });
  }

  // 保存
  onSave = () => {
    /**
     * @param {*attrs} 
     * @param {*date} 
     * @param {*time} {hour: 1, min: 1}
     * @param {*repeat} 
     * @param {*enabled} 
     */
    const { dispatch, params, language } = this.props;
    const { power, enabled, repeat, hours, min } = this.state;
    const time = {
      hour: hours,
      min,
    };

    if (params.type === 'create') {
      const { scheduler } = this.props;
      const { did } = params;

      /**
       * 构建数据点
       */
      const attrs = {};
      attrs[this.powerAttr] = power;

      /**
       * 如果存在拓展，也需要构建一份
       */
      if (this.state.expand.attr) {
        attrs[this.state.expand.attr] = this.state.expand.value;
      }

      dispatch({
        type: 'scheduler/create',
        payload: {
          did,
          time,
          enabled: true,
          attrs,
          repeat,
          date: '', // 默认的话modal 会自动补全
          success: () => {
            Toast.hide();
            // 回到列表
            router.goBack(-1);
          },
          error: (err) => {
          },
        },
      });
    } else {
      // 获取当前定时
      const { params, scheduler, language } = this.props;
      const { type, id, did } = params;
      const activeScheduler = this.filterScheduler(id, this.props.scheduler.data);

      const EDIT_THE_TIMING_FAILURE = getLanguageString(language.key, 'EDIT_THE_TIMING_FAILURE');

      /**
       * 构建数据点
       */
      const attrs = {};
      attrs[this.powerAttr] = power;

      /**
       * 如果存在拓展，也需要构建一份
       */
      if (this.state.expand.attr) {
        attrs[this.state.expand.attr] = this.state.expand.value;
      }

      dispatch({
        type: 'scheduler/edit',
        payload: {
          did,
          id: activeScheduler.id,
          time,
          enabled: true,
          attrs,
          repeat,
          date: activeScheduler.originalData.date,
          success: () => {
            Toast.hide();
            // 回到列表
            router.goBack(-1);
          },
          error: () => {
            InfoAlert.show(EDIT_THE_TIMING_FAILURE, 'error', 2000);
          },
        },
      });
    }
  }

  onSlideChange = (value) => {
    this.setState({
      expand: {
        ...this.state.expand,
        value,
      },
    });
  }

  render() {
    const { params, language, scheduler } = this.props;
    const expandName = this.state.expand.label;
    const expandType = this.state.expand.type;
    const expandMin = this.state.expand.min;
    const expandMax = this.state.expand.max;
    const expandDefaultValue = this.state.expand.value;
    
    const { id, type } = params;

    const { repeat, hours, min, power } = this.state;

    const POWER_ON = getLanguageString(language.key, 'POWER_ON');
    const POWER_OFF = getLanguageString(language.key, 'POWER_OFF');

    const { tintColor } = this.context.properties;

    return (
      <div>
        <NavBar
          title="EDIT_THE_TIMING"
          leftButton={<BackButton />}
          rightButton={this.button}
        />
        <MenuPage style={styles.container}>
          <Scroll>
            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="ACTION" />
              </div>
              <div style={styles.segContentBox}>
                <SegmentedControl
                  onChange={this.onSegChange}
                  selectedIndex={power ? 0 : 1}
                  style={styles.seg}
                  values={[POWER_ON, POWER_OFF]}
                  tintColor={tintColor}
                />
              </div>
            </div>
            {
              expandType === 'Number' ? (
                <div style={styles.box}>
                  <div style={styles.title}>
                    <FormattedMessage id={expandName} />
                  </div>
                  <div style={styles.sliderContentBox}>
                    <SliderWithTooltip defaultValue={expandDefaultValue} min={expandMin} max={expandMax} onAfterChange={this.onSlideChange} />
                  </div>
                </div>
              ) : null
            }
            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="TIME" />
              </div>
              <div style={styles.contentBox}>
                <TimePick onChange={this.onPickChange} value={[hours, min]} />
              </div>
            </div>
            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="REPEAT" />
              </div>
              <div style={styles.repeatContentBox}>
                <ButtonGroup
                  onClick={this.onButtonClick}
                  datas={repeat}
                  tintColor={tintColor}
                />
              </div>
            </div>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

TimingListPage.propTypes = {
};

TimingListPage.contextTypes = {
  properties: PropTypes.object.isRequired,
};

const buttonStyles = {
  container: {
    fontSize: '0.32rem',
  },
};

class SaveButton extends Component {
  render() {
    const { color } = this.props;
    return (
      <div style={{ ...buttonStyles.container, color }} onClick={this.props.onClick}>
        <FormattedMessage id="SAVE" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    scheduler: state.scheduler,
    language: state.language,
  };
}

export default connect(mapStateToProps)(TimingListPage);
