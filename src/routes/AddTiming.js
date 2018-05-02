import React, { Component } from 'react';
import { connect } from 'dva';
import { Stepper } from 'antd-mobile';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';
import BackButton from '../containers/MenuButton/BackButton';
import SaveGroupButton from '../containers/MenuButton/SaveGroupButton';
import TimePick from '../components/TimePick';
import SecondPick from '../components/TimePick/SecondPick';
import router from '../utils/router';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    overflow: 'scroll',
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: '.2rem',
    padding: '.2rem .2rem',
  },
  ti: {
    width: '50%',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  tt: {
    color: '#727272',
    fontSize: '.26rem',
  },
  rp: {
    height: '1rem',
    marginTop: '.2rem',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    paddingLeft: '.8rem',
    position: 'relative',
  },
  rpn: {
    position: 'absolute',
    left: '.2rem',
    top: '.36rem',
    color: '#727272',
    fontSize: '.26rem',
  },
  ww: {
    height: '100%',
    boxSizing: 'border-box',
    paddingTop: '.24rem',
  },
  itms: {
    display: 'inline-block',
    width: '13%',
    fontSize: '.26rem',
    textAlign: 'center',
    border: '1px solid #f1f1f1',
    paddingTop: '.1rem',
    paddingBottom: '.1rem',
    marginRight: '.05rem',
    borderRadius: '.1rem',
    color: '#ffffff',
    backgroundColor: '#03bca8',
  },
  itmu: {
    display: 'inline-block',
    width: '13%',
    fontSize: '.26rem',
    textAlign: 'center',
    border: '1px solid #f1f1f1',
    paddingTop: '.1rem',
    paddingBottom: '.1rem',
    marginRight: '.05rem',
    borderRadius: '.1rem',
    color: '#8e8e8e',
    backgroundColor: '#ffffff',
  },
  stp: {
    position: 'absolute',
    right: '.2rem',
    top: '.16rem',
  },
  zdy: {
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    paddingLeft: '1rem',
    position: 'relative',
    borderTop: '1px solid #f1f1f1',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '.36rem',
  },
};

const weeks = [
  {
    value: false,
    label: '周一',
  },
  {
    value: false,
    label: '周二',
  },
  {
    value: false,
    label: '周三',
  },
  {
    value: false,
    label: '周四',
  },
  {
    value: false,
    label: '周五',
  },
  {
    value: false,
    label: '周六',
  },
  {
    value: false,
    label: '周日',
  },
];

class AddTiming extends Component {
  state={
    weeks,
    level: 0,
    startTime: [0, 0],
    endTime: [0, 0],
    workingTime: [0],
    stoppingTime: [0],
  }

  componentWillMount() {
    const { params: { id }, timing: { list } } = this.props;
    if (id === 'add') return;
    const data = list.find(v => v.id === id * 1);
    this.setState({ ...data });
  }

  timeChangeStart = (v) => {
    console.log(v);
    this.setState({ startTime: v });
  }
  timeChangeEnd = (v) => {
    console.log(v);
    this.setState({ endTime: v });
  }
  selWeek = (v, i) => {
    const { weeks } = this.state;
    const arr = weeks.concat();
    const obj = {};
    obj.label = arr[i].label;
    obj.value = !v;
    arr[i] = obj;
    this.setState({ weeks: arr });
  }
  levelChange = (v) => {
    if (v <= 0) this.setState({ level: 0 });
    else this.setState({ level: v });
  }
  save = () => {
    console.log(this.state);
    const { dispatch, timing: { list }, params: { id } } = this.props;
    const arr = list.concat();
    const item = { ...this.state, id: Math.random() };
    if (id === 'add') arr.push(item);
    else {
      const index = list.findIndex(v => v.id === id * 1);
      arr[index] = item;
    }
    dispatch({
      type: 'timing/update',
      payload: {
        list: arr,
      },
    });
    router.goBack(-1);
  }
  render() {
    const { deviceList, timing } = this.props;
    const { weeks, level, startTime, endTime, stoppingTime, workingTime } = this.state;
    return (
      <div>
        <NavBar
          title={'添加定时'}
          leftButton={<BackButton />}
          rightButton={<SaveGroupButton onClick={this.save} />}
        />
        <MenuPage theme="dark">
          <div style={styles.container}>
            <div style={styles.time}>
              <div style={{ ...styles.ti, paddingRight: '.25rem', borderRight: '1px solid #f6f6f6' }}>
                <div style={styles.tt}>开始工作时间</div>
                <TimePick onChange={this.timeChangeStart} value={startTime} />
              </div>
              <div style={{ ...styles.ti, paddingLeft: '.25rem', borderLeft: '1px solid #f6f6f6' }}>
                <div style={styles.tt}>停止工作时间</div>
                <TimePick onChange={this.timeChangeEnd} value={endTime} />
              </div>
            </div>
            <div style={styles.rp}>
              <span style={styles.rpn}>重复</span>
              <div style={styles.ww}>
                {
                    weeks.map((v, i) => {
                      return <span style={v.value ? styles.itms : styles.itmu} key={i} onClick={() => this.selWeek(v.value, i)}>{v.label}</span>;
                    })
                }
              </div>
            </div>
            <div style={styles.rp}>
              <span style={styles.rpn}>档位</span>
              <Stepper style={styles.stp} showNumber size="small" value={level} onChange={v => this.levelChange(v)} />
            </div>
            {
                level ? (
                  <div style={styles.zdy}>
                    <span style={styles.rpn}>自定义</span>
                    <div style={{ ...styles.ti, padding: '0 .25rem', borderRight: '1px solid #f6f6f6' }}>
                      <div style={styles.tt}>工作时长(秒)</div>
                      <SecondPick onChange={v => this.setState({ workingTime: v })} value={workingTime} />
                    </div>
                    <div style={{ ...styles.ti, padding: '0 .25rem', borderLeft: '1px solid #f6f6f6' }}>
                      <div style={styles.tt}>停止时长(秒)</div>
                      <SecondPick onChange={v => this.setState({ stoppingTime: v })} value={stoppingTime} />
                    </div>
                  </div>
                ) : null
            }

          </div>
        </MenuPage>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    timing: state.timing,
  };
}


export default connect(mapStateToProps)(AddTiming);

