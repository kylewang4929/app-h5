import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

import BackButton from '../containers/MenuButton/BackButton';
import CommonButton from '../containers/MenuButton/CommonButton';

import SettingItem from '../components/DeviceDashboard/SettingItem';
import { AddItem } from '../components/DeviceDashboard/Timing';
import router from '../utils/router';
import { getScale, getUnitText } from '../utils/getUnit';

const styles = {
  container: {
  },
  box: {
    padding: '0rem 0.2rem 0 0.2rem',
    height: '100%',
    overflow: 'auto',
  },
  icon: {
    fontSize: '0.44rem',
  },
};
class SetTiming extends Component {
  state = {
    data: [],
  };
  componentWillMount() {
    const { params: { did }, deviceData } = this.props;
    const { Cook_Para, Cookstage_Para } = deviceData[did].data;
    const data = this.getTiming(Cook_Para, Cookstage_Para);
    this.setState({
      data,
    });
  }
  getTiming = (data, stage) => {
    const list = [];
    let index = 0;
    for (let i = 0; i < stage * 4; i += 4) {
      // 获取温度
      let temp = `${data[i].toString(16)}${data[i + 1].toString(16)}`;
      let time = `${data[i + 2].toString(16)}${data[i + 3].toString(16)}`;

      temp = parseInt(temp, 16);
      time = parseInt(time, 16);
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
  onAdd = () => {
    // 增加一条新的
    const { data } = this.state;
    data.push({
      index: data.length,
      temp: 320,
      time: 60,
    });
    this.setState({
      data,
    });
  }

  onChange = (item) => {
    const { data } = this.state;
    data.splice(item.index, 1, item);
    this.setState({
      data,
    });
  }
  save = () => {
    // 编辑没有做删除的交互，所以不需要重新计算段数
    const { params: { did }, deviceData, dispatch } = this.props;
    const { Cook_Para, Cookstage_Para } = deviceData[did].data;
    const { data } = this.state;
    const cookData = Array(20).fill(0);
    data.map((item, index) => {
      const { temp, time } = item;
      const value = this.parseValue(temp).concat(this.parseValue(time));
      cookData.splice(index * 4, 4, ...value);
    });
    console.log('cookData', cookData);
    dispatch({
      type: 'gizwitsSdk/sendCmd',
      payload: {
        data: {
          Cookstage_Para: data.length,
          Cook_Para: cookData,
        },
      },
    });
    router.goBack(-1);
  }
  parseValue = (value) => {
    console.log('value1', value);
    value = value.toString(16);
    console.log('value1', value);
    // 补够4位
    let newValue = value;
    for (let i = 0; i < 4 - value.length; i++) {
      newValue = `0${newValue}`;
    }
    const string = [];
    for (let i = 0; i < newValue.length; i += 2) {
      string.push(parseInt(`${newValue[i]}${newValue[i + 1]}`, 16));
    }
    console.log('value1', string);
    return new Array(2 - string.length).fill(0).concat(string);
  }

  render() {
    const { deviceList: { data }, params: { did }, deviceData } = this.props;
    const device = data.find(v => v.did === did);

    const { Unit_Flag } = deviceData[did].data;

    const { min, max } = getScale(Unit_Flag);
    const unitText = getUnitText(Unit_Flag);
    return (
      <div>
        <NavBar
          title={device.name}
          leftButton={<BackButton />}
          rightButton={
            <CommonButton onClick={this.save}>
              <span className="mdi mdi-check" style={styles.icon} />
            </CommonButton>
          }
        />
        <MenuPage style={styles.container} theme="dark">
          <div style={styles.box} className="iosScrolling">
            {
              this.state.data.map((item, index) => {
                return (
                  <SettingItem
                    onChange={this.onChange}
                    key={index}
                    data={item}
                    min={min}
                    max={max}
                    unit={unitText}
                  />
                );
              })
            }
            {
              this.state.data.length < 5 ? <AddItem onAdd={this.onAdd} /> : null
            }

          </div>
        </MenuPage>
      </div>
    );
  }
}

SetTiming.propTypes = {
  params: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    deviceList: state.deviceList,
    deviceData: state.deviceData,
    language: state.language,
  };
}


export default connect(mapStateToProps)(SetTiming);
