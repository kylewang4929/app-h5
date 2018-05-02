import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';
import { List, SwipeAction, Toast, Popup, Button, PickerView, Slider } from 'antd-mobile';
import moment from 'moment';

import CommonButton from '../../containers/MenuButton/CommonButton';
import BackButton from '../../containers/MenuButton/BackButton';
import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import Scroll from '../../components/Scroll';

import ButtonGroup from '../../components/ButtonGroup';
import { getLanguageString } from '../../utils/getLanguage';
import { formattingNum } from '../../utils/schedulerTool';
import { getItemForPk } from '../../utils/configExpand';

const Item = List.Item;

const styles = {
  container: {
  },
  listContainer: {
    borderTop: '1px solid rgba(0,0,0,0.1)',
  },
  titleIcon: {
    fontSize: '0.4rem',
    padding: '0.2rem',
    display: 'inline-block',
  },
  borderBottom: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },
  listBox: {
    backgroundColor: '#fff',
  },
  titleLeft: {
  },
  titleRight: {
    position: 'absolute',
    right: '0.1rem',
    top: '50%',
    marginTop: '-0.42rem',
  },
  box: {
    backgroundColor: '#fff',
    padding: '0.2rem',
    margin: '0rem 0 0.2rem 0',
  },
  item: {
    paddingLeft: '0.1rem',
    color: 'rgb(121, 121, 121)',
  },
  listTitle: {
    color: '#909090',
    fontSize: '0.26rem',
    padding: '0.36rem 0.4rem 0.32rem 0.4rem',
    position: 'relative',
  },
  title: {
    color: '#909090',
    fontSize: '0.26rem',
    padding: '0.16rem 0.2rem 0rem 0.2rem',
  },
  input: {
    border: 'none',
    backgroundColor: '#fff',
    width: '100%',
    fontSize: '0.3rem',
  },
  inputContentBox: {
    padding: '0.3rem 0.2rem',
  },
  sliderContentBox: {
    textAlign: 'center',
    padding: '0.3rem 0.4rem',
  },
  contentBox: {

  },
  repeatContentBox: {
    padding: '0.4rem 0.3rem 0.3rem 0.3rem',
  },
  titleBox: {
    position: 'relative',
    height: '0.8rem',
    textAlign: 'center',
    lineHeight: '0.8rem',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    fontSize: '0.3rem',
  },
  closeButton: {
    position: 'absolute',
    left: '0.3rem',
  },
  confirmButton: {
    position: 'absolute',
    right: '0.3rem',
  },
  tipsBox: {
    fontSize: '0.26rem',
    paddingLeft: '0.4rem',
    lineHeight: '0.6rem',
    paddingTop: '0.1rem',
    color: '#9f9f9f',
  },
  timeBox: {
    height: '2.3rem',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  startBox: {
    position: 'absolute',
    width: '40%',
    left: '5%',
    top: '-1.15rem',
    height: '2.2rem',
  },
  endBox: {
    position: 'absolute',
    width: '40%',
    right: '5%',
    top: '-1.15rem',
  },
  middleIcon: {
    height: '2.4rem',
    width: '0.5rem',
    position: 'absolute',
    left: '50%',
    top: '0',
    marginLeft: '-0.25rem',
    lineHeight: '2.4rem',
    textAlign: 'center',
  },
  temperatureBox: {
    height: '2rem',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  sliderBox: {
    height: '2.2rem',
  },
  showTemperature: {
    textAlign: 'center',
    fontSize: '0.3rem',
    height: '0.8rem',
    paddingTop: '0.4rem',
  }
};

class GroupTimingDetail extends Component {

  state = {
    repeat: [
      { active: false, text: 'SUN', id: 'sun' },
      { active: false, text: 'MON', id: 'mon' },
      { active: true, text: 'TUE', id: 'tue' },
      { active: false, text: 'WED', id: 'wed' },
      { active: false, text: 'THU', id: 'thu' },
      { active: false, text: 'FRI', id: 'fri' },
      { active: false, text: 'SAT', id: 'sat' },
    ],
  };

  componentWillMount() {
    this.button = (<CommonButton
      onClick={this.onSave}
    >
      <div style={{ fontSize: '0.32rem' }}>
        <FormattedMessage id="SAVE" />
      </div>
    </CommonButton>);

    // 从modal读取数据
    const { groupScheduler } = this.props;
    this.updateState(groupScheduler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupScheduler !== this.props.groupScheduler) {
      this.updateState(nextProps.groupScheduler);
    }
  }

  onSave = () => {
    const { dispatch, params } = this.props;
    const { data, repeat } = this.state;
    
    dispatch({
      type: 'groupScheduler/save',
      payload: {
        did: params.did,
        repeat,
        name: data.timeText,
      },
    });
  }

  onButtonClick = (value) => {
    // 至少要选择一个
    const { repeat } = this.state;
    let activeIndex = 0;
    let setIndex = 0;
    repeat.map((item, index) => {
      if (item.active) {
        activeIndex += 1;
      }
      if (item.id === value.id) {
        setIndex = index;
      }
    });
    if (activeIndex === 1 && repeat[setIndex].active) {
      
    } else {
      repeat[setIndex].active = !repeat[setIndex].active;
    }
    this.setState({
      repeat,
    });
  }

  onNameChange = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        timeText: e.nativeEvent.target.value,
      },
    });
  }

  updateState = (groupScheduler) => {
    // 过滤掉delete的item
    let data = [];
    const groupSchedulerData = JSON.parse(JSON.stringify(groupScheduler.data.data));
    groupSchedulerData.map((item) => {
      if (item.type !== 'delete') data.push(item);
    });
    // 并且还要排序
    data = this.bubbleSort(data);
    // 再分组
    const groupList = [];
    data.map((item) => {
      const remark = JSON.parse(item.originalData.remark);
      if (item.isSelect) {
        return;
      }
      data.map((subItem) => {
        const subRemark = JSON.parse(subItem.originalData.remark);
        if (subRemark.gid === remark.gid && item.id !== subItem.id) {
          groupList.push({
            gid: remark.gid,
            data: [item, subItem],
          });
          item.isSelect = true;
          subItem.isSelect = true;
        }
      });
    });

    this.setState({
      data: { ...groupScheduler.data, data: groupList },
      repeat: groupScheduler.data.repeat,
    });
  }

  addSubTiming = () => {
    const { params, dispatch, groupScheduler, language, deviceData } = this.props;
    const { productKey, did } = params;
    // router.go(`#menu/groupTiming/${productKey}/${did}/subTiming/create`);
    Popup.show(
      <div style={styles.container}>
        <TimePicker deviceData={deviceData} did={did} productKey={productKey} type="create" groupScheduler={groupScheduler} dispatch={dispatch} language={language} />
      </div>, { animationType: 'slide-up', maskClosable: true });
  }

  edit = (item) => {
    const { params, dispatch, groupScheduler, language, deviceData } = this.props;
    const { productKey, did } = params;
    Popup.show(
      <div style={styles.container}>
        <TimePicker deviceData={deviceData} did={did} productKey={productKey} id={item.gid} type="edit" groupScheduler={groupScheduler} dispatch={dispatch} language={language} />
      </div>, { animationType: 'slide-up', maskClosable: true });
    // router.go(`#menu/groupTiming/${productKey}/${did}/subTiming/edit/${item.gid}`);
  }

  delete = (item) => {
    const { dispatch, language } = this.props;
    const { data } = this.state;
    const KEEP_AT_LEAST_ONE_TIMING = getLanguageString(language.key, 'KEEP_AT_LEAST_ONE_TIMING');
    if (data.data.length === 1) {
      // 提示不能再删除
      Toast.info(KEEP_AT_LEAST_ONE_TIMING, 2);
      return;
    }
    dispatch({
      type: 'groupScheduler/delete',
      payload: item.gid,
    });
  }

  bubbleSort = (list) => {
    list.sort((a,b) => {
      const time = a.timeText.split(':');
      const value = Number.parseInt(time[0]) * 60 + Number.parseInt(time[1]);
      const nextTime = b.timeText.split(':');
      const nextValue = Number.parseInt(nextTime[0]) * 60 + Number.parseInt(nextTime[1]);
      return value-nextValue;
    });
    return list;
  }

  getNextTimeText = ({ hours, min }) => {
    const time = moment();
    time.hours(hours);
    time.minute(min);
    return `${formattingNum(time.hour())}:${formattingNum(time.minute())}`;
  }

  render() {
    const { tintColor } = this.context.properties;
    const { repeat, data } = this.state;
    const { language, params } = this.props;
    const { productKey } = params;
    const config = getItemForPk(productKey);
    // 数据点名称
    const attr = config.groupScheduler.featureList[0].attr;
    
    const ENTER_TITLE = getLanguageString(language.key, 'ENTER_TITLE');
    const EDIT = getLanguageString(language.key, 'EDIT');
    const DELETE = getLanguageString(language.key, 'DELETE');
    return (
      <div>
        <NavBar
          title="DETAIL"
          rightButton={this.button}
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            <div style={{ height: '0.2rem' }} />
            <div style={styles.box}>
              <div style={styles.title}>
                <FormattedMessage id="NAME" />
              </div>
              <div style={styles.inputContentBox}>
                <input
                  value={data.timeText}
                  placeholder={ENTER_TITLE}
                  style={styles.input}
                  onChange={this.onNameChange}
                />
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

            <div style={styles.listBox}>
              <div style={styles.listTitle}>
                <span style={styles.titleLeft}>
                  <FormattedMessage id="TIMING_LIST" />
                </span>
                <span style={styles.titleRight} onClick={this.addSubTiming}>
                  <span style={styles.titleIcon} className="mdi mdi-plus" />
                </span>
              </div>
              <div style={styles.listContainer}>
                <List className="my-list">
                  {
                    data.data.map((item, index) => {
                      let startTiming = {};
                      let endTiming = {};
                      item.data.map((subItem) => {
                        const remark = JSON.parse(subItem.originalData.remark);
                        if (remark.type === 'start') {
                          startTiming = subItem;
                        } else {
                          endTiming = subItem;
                        }
                      });
                      let text = '';
                      text = `${startTiming.timeText} - ${endTiming.timeText}`;
                      const value = startTiming.attrs[attr];

                      const buttonList = [
                        {
                          text: EDIT,
                          onPress: this.edit.bind(null, item),
                          style: { backgroundColor: '#ddd', color: 'white' },
                        },
                        {
                          text: DELETE,
                          onPress: this.delete.bind(null, item),
                          style: { backgroundColor: '#F4333C', color: 'white' },
                        },
                      ];
                      return (
                        <SwipeAction
                          autoClose
                          key={index}
                          right={buttonList}
                        >
                          <Item
                            extra={`${value}℃`}
                            arrow="horizontal"
                            onClick={this.edit.bind(null, item)}
                            style={styles.borderBottom}
                          >
                            <span style={styles.item}>
                              {text}
                            </span>
                          </Item>
                        </SwipeAction>
                      );
                    })
                  }
                </List>
              </div>
            </div>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

GroupTimingDetail.contextTypes = {
  properties: PropTypes.object.isRequired,
};

GroupTimingDetail.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
    deviceData: state.deviceData,
    scheduler: state.scheduler,
    groupScheduler: state.groupScheduler,
  };
}


export default connect(mapStateToProps)(GroupTimingDetail);

//弹出层===================================================================

//获取时间数组
const getTime = function (){
  let hourArr = [];
  for(let i = 0;i<24;i++){
    let hourObj = {};
    if(i<10){
      hourObj.label = '0' + i;
      hourObj.value = '0' + i;
      hourArr.push(hourObj);
    }else{
      hourObj.label = String(i);
      hourObj.value = String(i);
      hourArr.push(hourObj);
    }
  }
  let minuteArr = [
    {
      label: '00',
      value: '00',
    },
    {
      label: '30',
      value: '30',
    },
  ]
  let timeArr = [hourArr,minuteArr];
  return timeArr;
}
const timeArr = getTime();

//弹出层组件
class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: 0,
      min: 0,
      endHour: 0,
      endMin: 0,
      value: 0,
    };

    this.onTemperatureChange = this.onTemperatureChange.bind(this);
    this.onStartTimeChange = this.onStartTimeChange.bind(this);
    this.onEndTimeChange = this.onEndTimeChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    //初始化数值
    const { groupScheduler, productKey, id, type } = this.props;
    const item = getItemForPk(productKey);
    this.config = item.groupScheduler;
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

      //将时间转为字符串
      let hourString, minString, endHourString, endMinString;
      if(startItem.time.hours < 10) {
        hourString = '0' + String(startItem.time.hours);
      }else {
        hourString = String(startItem.time.hours);
      }
      if(startItem.time.min < 10) {
        minString = '0' + String(startItem.time.min);
      }else {
        minString = String(startItem.time.min);
      }
      if(endItem.time.hours < 10) {
        endHourString = '0' + String(endItem.time.hours);
      }else {
        endHourString = String(endItem.time.hours);
      }
      if(endItem.time.min < 10) {
        endMinString = '0' + String(endItem.time.min);
      }else {
        endMinString = String(endItem.time.min);
      }
      console.log('startItem', startItem);
      this.setState({
        hour: hourString,
        min: minString,
        value: startItem.attrs[attr],
        endHour: endHourString,
        endMin: endMinString,
        endItem,
        startItem,
      });
    } else {
      // 创建一个新的
      this.setState({
        hour: '12',
        min: '00',
        endHour: '13',
        endMin: '00',
        value: this.config.featureList[0].min,
      });
    }
  }

  onStartTimeChange(value) {
    this.setState({
      hour: value[0],
      min: value[1],
    });
  }

  onEndTimeChange(value) {
    this.setState({
      endHour: value[0],
      endMin: value[1],
    });
  }

  onTemperatureChange(value) {
    this.setState({
      value: value,
    })
  }

  // 保存
  onSave = () => {
    const { dispatch, language, groupScheduler, deviceData, type, id, did } = this.props;
    let { hour, min, value, endHour, endMin, startItem, endItem } = this.state;
    hour = Number(hour);
    min = Number(min);
    endHour = Number(endHour);
    endMin = Number(endMin);
    const attr = this.config.featureList[0].attr;
    const attrs = {};
    attrs[attr] = value;

    const endAttrs = {};
    // 这里需要获取这个设备的防冻温度
    console.log('deviceData', deviceData);
    console.log('did', did);
    let temp = null;
    try {
      temp = deviceData[did].data.antifreeze_temperature;
    } catch (error) {
      
    }
    endAttrs[attr] = temp || 10;

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
    if (!isLegitimacy) {
      // 提示不合法
      const startTimeText = `${formattingNum(parseInt(illegalityItem.start / 60))}:${formattingNum(parseInt(illegalityItem.start % 60))}`;
      const endTimeText = `${formattingNum(parseInt(illegalityItem.end / 60))}:${formattingNum(parseInt(illegalityItem.end % 60))}`;
      const CONFLICT_WITH_THE_FOLLOWING_PERIOD = getLanguageString(language.key, 'CONFLICT_WITH_THE_FOLLOWING_PERIOD');
      Toast.show(`${CONFLICT_WITH_THE_FOLLOWING_PERIOD}: ${startTimeText}-${endTimeText}`, 2);
      return;
    }

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
    Popup.hide();
  }

  onClose = () => {
    Popup.hide();
  }

  render() {
    const { hour, min, value, endHour, endMin } = this.state;
    const { language } = this.props;
    // 获取温度最大值及最小值
    const expandMin = this.config.featureList[0].min;
    const expandMax = this.config.featureList[0].max;
    return (
      <div>
        <div style={styles.titleBox}>
          <span onClick={() => this.onClose('cancel')} style={styles.closeButton}>
            {getLanguageString(language.key, 'CLOSE')}
          </span>
            {getLanguageString(language.key, 'DATA_SETTING')}
          <span onClick={this.onSave} style={styles.confirmButton}>
            {getLanguageString(language.key, 'CONFIRM')}
          </span>
        </div>
        <div style={styles.tipsBox}>
          {getLanguageString(language.key, 'TIME_SELECT')}
        </div>
        <div>
          <div style={styles.timeBox} >
            <div style={styles.startBox} >
              <PickerView
                onChange={this.onStartTimeChange}
                value={[hour, min]}
                data={timeArr}
                cascade={false}
              />
            </div>
            <div style={styles.middleIcon}>
              ~
            </div>
            <div style={styles.endBox} >
              <PickerView
                onChange={this.onEndTimeChange}
                value={[endHour, endMin]}
                data={timeArr}
                cascade={false}
              />
            </div>
          </div>
          <div style={styles.temperatureBox} >
            <div style={styles.tipsBox}>
              {getLanguageString(language.key, 'TEMPERATURE_SELECT')}
            </div>
            <div style={styles.sliderBox}>
              <div>
                <Slider min={expandMin} max={expandMax} value={value} onChange={this.onTemperatureChange} onAfterChange={(value) => console.log(value)} />
              </div>
              <div style={styles.showTemperature}>{value}℃</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}